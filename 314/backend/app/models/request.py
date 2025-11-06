from app import db
from datetime import datetime

class HelpRequest(db.Model):
    __tablename__ = 'help_requests'
    
    id = db.Column(db.Integer, primary_key=True)
    requester_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    location = db.Column(db.String(200))
    urgency = db.Column(db.String(20))  # low, medium, high, urgent
    status = db.Column(db.String(50), default='pending')  # pending, accepted, completed, cancelled
    photo_url = db.Column(db.String(500))
    view_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    
    # Relationships
    category = db.relationship('Category', backref='requests')
    offers = db.relationship('VolunteerOffer', backref='request', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'requester_id': self.requester_id,
            'title': self.title,
            'description': self.description,
            'category': self.category.name if self.category else None,
            'location': self.location,
            'urgency': self.urgency,
            'status': self.status,
            'photo_url': self.photo_url,
            'view_count': self.view_count,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class VolunteerOffer(db.Model):
    __tablename__ = 'volunteer_offers'
    
    id = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(db.Integer, db.ForeignKey('help_requests.id'), nullable=False)
    volunteer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String(50), default='pending')  # pending, accepted, rejected, withdrawn
    message = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    volunteer = db.relationship('User', foreign_keys=[volunteer_id])
    
    def to_dict(self):
        return {
            'id': self.id,
            'request_id': self.request_id,
            'volunteer_id': self.volunteer_id,
            'status': self.status,
            'message': self.message,
            'created_at': self.created_at.isoformat()
        }
