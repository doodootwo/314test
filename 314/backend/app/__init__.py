from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

def create_app(config_class='config.Config'):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    CORS(app)
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    
    # Register blueprints
    from app.routes import auth, users, requests, volunteers, admin
    app.register_blueprint(auth.bp)
    app.register_blueprint(users.bp)
    app.register_blueprint(requests.bp)
    app.register_blueprint(volunteers.bp)
    app.register_blueprint(admin.bp)
    
    return app
