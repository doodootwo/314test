from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User, VolunteerBlacklist, VolunteerShortlist, VolunteerReview, UserProfile
from app.models.request import VolunteerOffer
from app.models.system import SystemLog

bp = Blueprint('pin', __name__, url_prefix='/api/pin')

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

@bp.route('/blacklist', methods=['POST'])
@jwt_required()
def blacklist_volunteer():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    blacklist = VolunteerBlacklist(
        pin_id=user_id,
        volunteer_id=data['volunteer_id'],
        reason=data.get('reason', '')
    )
    
    db.session.add(blacklist)
    db.session.commit()
    
    log_action('VOLUNTEER_BLACKLISTED', f'Blacklisted volunteer ID {data["volunteer_id"]}')
    
    return jsonify({'message': 'Volunteer blacklisted successfully'}), 201

@bp.route('/blacklist/<int:volunteer_id>', methods=['DELETE'])
@jwt_required()
def remove_from_blacklist(volunteer_id):
    user_id = get_jwt_identity()
    
    blacklist = VolunteerBlacklist.query.filter_by(
        pin_id=user_id,
        volunteer_id=volunteer_id
    ).first_or_404()
    
    db.session.delete(blacklist)
    db.session.commit()
    
    return jsonify({'message': 'Volunteer removed from blacklist'}), 200

@bp.route('/blacklist', methods=['GET'])
@jwt_required()
def get_blacklist():
    user_id = get_jwt_identity()
    
    blacklisted = VolunteerBlacklist.query.filter_by(pin_id=user_id).all()
    
    result = []
    for item in blacklisted:
        volunteer = User.query.get(item.volunteer_id)
        result.append({
            'id': item.id,
            'volunteer_id': item.volunteer_id,
            'volunteer_name': volunteer.username,
            'reason': item.reason,
            'created_at': item.created_at.isoformat()
        })
    
    return jsonify(result), 200

@bp.route('/shortlist', methods=['POST'])
@jwt_required()
def add_to_shortlist():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    shortlist = VolunteerShortlist(
        pin_id=user_id,
        volunteer_id=data['volunteer_id']
    )
    
    db.session.add(shortlist)
    db.session.commit()
    
    return jsonify({'message': 'Volunteer added to shortlist'}), 201

@bp.route('/shortlist', methods=['GET'])
@jwt_required()
def get_shortlist():
    user_id = get_jwt_identity()
    
    shortlisted = VolunteerShortlist.query.filter_by(pin_id=user_id).all()
    
    result = []
    for item in shortlisted:
        volunteer = User.query.get(item.volunteer_id)
        result.append({
            'id': item.id,
            'volunteer_id': item.volunteer_id,
            'volunteer_name': volunteer.username,
            'created_at': item.created_at.isoformat()
        })
    
    return jsonify(result), 200

@bp.route('/review', methods=['POST'])
@jwt_required()
def submit_review():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    review = VolunteerReview(
        pin_id=user_id,
        volunteer_id=data['volunteer_id'],
        request_id=data['request_id'],
        rating=data['rating'],
        comment=data.get('comment', '')
    )
    
    db.session.add(review)
    
    # Update volunteer's average rating
    volunteer_profile = UserProfile.query.filter_by(user_id=data['volunteer_id']).first()
    if volunteer_profile:
        all_reviews = VolunteerReview.query.filter_by(volunteer_id=data['volunteer_id']).all()
        total_rating = sum(r.rating for r in all_reviews) + data['rating']
        volunteer_profile.total_reviews = len(all_reviews) + 1
        volunteer_profile.rating = total_rating / volunteer_profile.total_reviews
    
    db.session.commit()
    
    log_action('REVIEW_SUBMITTED', f'Submitted review for volunteer ID {data["volunteer_id"]}')
    
    return jsonify({'message': 'Review submitted successfully'}), 201

@bp.route('/reviews/<int:volunteer_id>', methods=['GET'])
@jwt_required()
def get_volunteer_reviews(volunteer_id):
    reviews = VolunteerReview.query.filter_by(volunteer_id=volunteer_id).all()
    
    result = []
    for review in reviews:
        pin = User.query.get(review.pin_id)
        result.append({
            'id': review.id,
            'pin_name': pin.username,
            'rating': review.rating,
            'comment': review.comment,
            'created_at': review.created_at.isoformat()
        })
    
    return jsonify(result), 200
