from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/message')
def get_message():
    return jsonify({
        'message': 'Connected to Flask backend! 🚀'
    })

@app.route('/api/health')
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

**backend/requirements.txt:**
```
Flask==3.0.0
flask-cors==4.0.0
