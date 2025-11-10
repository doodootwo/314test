from app import create_app, db
from app.models.user import User, UserProfile
from app.models.request import Category, HelpRequest

app = create_app()

with app.app_context():
    print("Dropping all tables...")
    db.drop_all()
    
    print("Creating all tables...")
    db.create_all()
    
    print("Creating categories...")
    categories = [
        Category(name="Groceries", description="Help with grocery shopping"),
        Category(name="Moving", description="Assistance with moving furniture"),
        Category(name="Tutoring", description="Educational support and tutoring"),
        Category(name="Healthcare", description="Medical appointments and healthcare"),
        Category(name="Technology", description="Tech support and assistance"),
        Category(name="General", description="General help and support")
    ]
    db.session.add_all(categories)
    db.session.commit()
    
    print("Creating admin user...")
    admin = User(
        email="admin@mockfyp.com",
        username="admin",
        role="admin",
        is_active=True
    )
    admin.set_password("admin123")
    admin.profile = UserProfile(
        full_name="System Administrator",
        phone="123-456-7890"
    )
    db.session.add(admin)
    
    print("Creating PIN user...")
    pin_user = User(
        email="john@mockfyp.com",
        username="john_doe",
        role="pin",
        is_active=True
    )
    pin_user.set_password("password123")
    pin_user.profile = UserProfile(
        full_name="John Doe",
        phone="555-123-4567",
        address="123 Main St, City"
    )
    db.session.add(pin_user)
    
    print("Creating CSR user...")
    csr_user = User(
        email="volunteer@company.com",
        username="csr_rep",
        role="csr",
        is_active=True
    )
    csr_user.set_password("password123")
    csr_user.profile = UserProfile(
        full_name="Jane Smith",
        phone="555-987-6543",
        company_name="Tech Corp"
    )
    db.session.add(csr_user)
    
    db.session.commit()
    
    print("Creating sample help requests...")
    requests = [
        HelpRequest(
            requester_id=pin_user.id,
            title="Need help with groceries",
            description="Looking for someone to help me get groceries this week",
            category_id=categories[0].id,
            location="Downtown",
            urgency="medium",
            status="pending"
        ),
        HelpRequest(
            requester_id=pin_user.id,
            title="Moving assistance needed",
            description="Need help moving furniture to new apartment",
            category_id=categories[1].id,
            location="Uptown",
            urgency="high",
            status="pending"
        )
    ]
    db.session.add_all(requests)
    db.session.commit()
    
    print("\n✅ Database initialized successfully!")
    print("\n📝 Test Credentials:")
    print("Admin: admin@mockfyp.com / admin123")
    print("PIN: john@mockfyp.com / password123")
    print("CSR: volunteer@company.com / password123")
