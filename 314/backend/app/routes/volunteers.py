from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.request import VolunteerOffer, HelpRequest

bp = Blueprint('volunteers', __name__, url_prefix='/api/volunteers')

@bp.route('/offers', methods=['POST'])
@jwt_required()
def create_offer():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    offer = VolunteerOffer(
        request_id=data['request_id'],
        volunteer_id=user_id,
        message=data.get('message', ''),
        status='accepted'
    )
    
    existing_offer = VolunteerOffer.query.filter_by(
        request_id=offer.request_id,
        volunteer_id=user_id
    ).first()

    if existing_offer:
        existing_offer.status = offer.status
        existing_offer.message = offer.message
        saved_offer = existing_offer
    else:
        db.session.add(offer)
        saved_offer = offer

    db.session.commit()
    return jsonify(saved_offer.to_dict()), 201

@bp.route('/offers/<int:offer_id>/withdraw', methods=['PUT'])
@jwt_required()
def withdraw_offer(offer_id):
    user_id = get_jwt_identity()
    offer = VolunteerOffer.query.get_or_404(offer_id)
    
    if offer.volunteer_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    if offer.status == 'accepted':
        return jsonify({'error': 'Cannot withdraw accepted offer'}), 400
    
    offer.status = 'withdrawn'
    db.session.commit()
    
    return jsonify(offer.to_dict()), 200

@bp.route('/my-offers', methods=['GET'])
@jwt_required()
def get_my_offers():
    user_id = get_jwt_identity()
    offers = VolunteerOffer.query.filter_by(volunteer_id=user_id).all()
    return jsonify([offer.to_dict() for offer in offers]), 200
