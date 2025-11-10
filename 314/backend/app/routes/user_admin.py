from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.models.system import SystemLog
import csv
import io

bp = Blueprint('user_admin', __name__, url_prefix='/api/admin/users')

def require_admin():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return user and user.role == 'admin'

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

@bp.route('/assign-role/<int:user_id>', methods=['PUT'])
@jwt_required()
def assign_role(user_id):
    if not require_admin():
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    user = User.query.get_or_404(user_id)
    old_role = user.role
    user.role = data['role']
    
    db.session.commit()
    
    log_action('ROLE_ASSIGNED', f'Changed user {user.username} role from {old_role} to {user.role}')
    
    return jsonify({
        'message': 'Role assigned successfully',
        'user': user.to_dict()
    }), 200

@bp.route('/export-csv', methods=['GET'])
@jwt_required()
def export_users_csv():
    if not require_admin():
        return jsonify({'error': 'Unauthorized'}), 403
    
    users = User.query.all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    writer.writerow(['ID', 'Username', 'Email', 'Role', 'Active', 'Created At'])
    
    for user in users:
        writer.writerow([
            user.id,
            user.username,
            user.email,
            user.role,
            'Yes' if user.is_active else 'No',
            user.created_at.strftime('%Y-%m-%d %H:%M:%S')
        ])
    
    log_action('EXPORT_USERS', f'Exported {len(users)} users to CSV')
    
    return jsonify({
        'csv_data': output.getvalue(),
        'filename': f'users_export_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
    }), 200

@bp.route('/deactivate/<int:user_id>', methods=['PUT'])
@jwt_required()
def deactivate_user(user_id):
    if not require_admin():
        return jsonify({'error': 'Unauthorized'}), 403
    
    user = User.query.get_or_404(user_id)
    user.is_active = False
    db.session.commit()
    
    log_action('USER_DEACTIVATED', f'Deactivated user {user.username}')
    
    return jsonify({'message': 'User deactivated successfully'}), 200
