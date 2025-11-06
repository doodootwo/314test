from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.request import HelpRequest, Category
from sqlalchemy import or_

bp = Blueprint('requests', __name__, url_prefix='/api/requests')

@bp.route('', methods=['GET'])
def get_requests():
    # Query parameters for filtering
    category = request.args.get('category')
    location = request.args.get('location')
    urgency = request.args.get('urgency')
    status = request.args.get('status', 'pending')
    sort_by = request.args.get('sort_by', 'created_at')
    order = request.args.get('order', 'desc')
    
    query = HelpRequest.query
    
    if category:
        query = query.join(Category).filter(Category.name == category)
    if location:
        query = query.filter(HelpRequest.location.ilike(f'%{location}%'))
    if urgency:
        query = query.filter(HelpRequest.urgency == urgency)
    if status:
        query = query.filter(HelpRequest.status == status)
    
    # Sorting
    if order == 'desc':
        query = query.order_by(getattr(HelpRequest, sort_by).desc())
    else:
        query = query.order_by(getattr(HelpRequest, sort_by).asc())
    
    requests = query.all()
    return jsonify([req.to_dict() for req in requests]), 200

@bp.route('', methods=['POST'])
@jwt_required()
def create_request():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    help_request = HelpRequest(
        requester_id=user_id,
        title=data['title'],
        description=data['description'],
        category_id=data.get('category_id'),
        location=data.get('location'),
        urgency=data.get('urgency', 'medium'),
        photo_url=data.get('photo_url')
    )
    
    db.session.add(help_request)
    db.session.commit()
    
    return jsonify(help_request.to_dict()), 201

@bp.route('/<int:request_id>', methods=['GET'])
def get_request(request_id):
    help_request = HelpRequest.query.get_or_404(request_id)
    
    # Increment view count
    help_request.view_count += 1
    db.session.commit()
    
    return jsonify(help_request.to_dict()), 200

@bp.route('/<int:request_id>', methods=['PUT'])
@jwt_required()
def update_request(request_id):
    user_id = get_jwt_identity()
    help_request = HelpRequest.query.get_or_404(request_id)
    
    if help_request.requester_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    if 'title' in data:
        help_request.title = data['title']
    if 'description' in data:
        help_request.description = data['description']
    if 'urgency' in data:
        help_request.urgency = data['urgency']
    if 'status' in data:
        help_request.status = data['status']
    
    db.session.commit()
    return jsonify(help_request.to_dict()), 200

@bp.route('/<int:request_id>', methods=['DELETE'])
@jwt_required()
def delete_request(request_id):
    user_id = get_jwt_identity()
    help_request = HelpRequest.query.get_or_404(request_id)
    
    if help_request.requester_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(help_request)
    db.session.commit()
    
    return jsonify({'message': 'Request deleted successfully'}), 200

@bp.route('/my-requests', methods=['GET'])
@jwt_required()
def get_my_requests():
    user_id = get_jwt_identity()
    requests = HelpRequest.query.filter_by(requester_id=user_id).order_by(HelpRequest.created_at.desc()).all()
    return jsonify([req.to_dict() for req in requests]), 200
