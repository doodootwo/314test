from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User
from datetime import datetime, timedelta
import secrets

bp = Blueprint('password_recovery', __name__, url_prefix='/api/auth')

@bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    
    user = User.query.filter_by(email=email).first()
    
    if not user:
        # Don't reveal if user exists
        return jsonify({'message': 'If email exists, reset link has been sent'}), 200
    
    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    user.reset_token = reset_token
    user.reset_token_expiry = datetime.utcnow() + timedelta(hours=1)
    
    db.session.commit()
    
    # In production, send email here
    # For now, return token (remove in production!)
    return jsonify({
        'message': 'Password reset link sent to email',
        'reset_token': reset_token  # Remove this in production!
    }), 200

@bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('password')
    
    user = User.query.filter_by(reset_token=token).first()
    
    if not user or not user.reset_token_expiry:
        return jsonify({'error': 'Invalid or expired token'}), 400
    
    if datetime.utcnow() > user.reset_token_expiry:
        return jsonify({'error': 'Token has expired'}), 400
    
    user.set_password(new_password)
    user.reset_token = None
    user.reset_token_expiry = None
    
    db.session.commit()
    
    return jsonify({'message': 'Password reset successfully'}), 200
