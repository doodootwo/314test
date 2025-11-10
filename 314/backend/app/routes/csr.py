from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User, UserProfile
from app.models.request import VolunteerOffer, HelpRequest
from app.models.system import SystemLog
from datetime import datetime

bp = Blueprint('csr', __name__, url_prefix='/api/csr')

def log_action(action, details):
    user_id = get_jwt_identity()
    log = SystemLog(
        user_id=user_id,
        action=action,
        details=details,
        ip_address=request.remote_addr
    )
    db.session.add(log)
    db.session.commit()

@bp.route('/accepted-tasks', methods=['GET'])
@jwt_required()
def get_accepted_tasks():
    user_id = get_jwt_identity()
    
    offers = VolunteerOffer.query.filter_by(
        volunteer_id=user_id,
        status='accepted'
    ).all()
    
    result = []
    for offer in offers:
        req = HelpRequest.query.get(offer.request_id)
        result.append({
            'id': offer.id,
            'request_id': req.id,
            'title': req.title,
            'description': req.description,
            'location': req.location,
            'urgency': req.urgency,
            'status': req.status,
            'created_at': offer.created_at.isoformat()
        })
    
    return jsonify(result), 200

@bp.route('/complete-task/<int:offer_id>', methods=['PUT'])
@jwt_required()
def complete_task(offer_id):
    user_id = get_jwt_identity()
    
    offer = VolunteerOffer.query.filter_by(
        id=offer_id,
        volunteer_id=user_id
    ).first_or_404()
    
    if offer.status != 'accepted':
        return jsonify({'error': 'Task is not in accepted status'}), 400
    
    # Mark request as completed
    req = HelpRequest.query.get(offer.request_id)
    req.status = 'completed'
    req.completed_at = datetime.utcnow()
    
    # Update volunteer's completed tasks count
    profile = UserProfile.query.filter_by(user_id=user_id).first()
    if profile:
        profile.completed_tasks += 1
    
    db.session.commit()
    
    log_action('TASK_COMPLETED', f'Completed task for request ID {req.id}')
    
    return jsonify({'message': 'Task marked as completed'}), 200
