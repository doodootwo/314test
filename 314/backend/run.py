from app import create_app, db
from app.models.user import User, UserProfile
from app.models.request import HelpRequest, Category, VolunteerOffer

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {
        'db': db,
        'User': User,
        'UserProfile': UserProfile,
        'HelpRequest': HelpRequest,
        'Category': Category,
        'VolunteerOffer': VolunteerOffer
    }

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)