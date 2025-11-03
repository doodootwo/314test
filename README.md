# 314test
# NexaFlow Landing Page

A modern landing page built with React and Flask.

## Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm start
```

The frontend runs on http://localhost:3000
The backend runs on http://localhost:5000
```

## 5. **Add .gitignore**

Create **.gitignore** in the root:
```
# Python
__pycache__/
*.py[cod]
venv/
*.env

# Node
node_modules/
build/
.DS_Store

# IDE
.vscode/
.idea/
