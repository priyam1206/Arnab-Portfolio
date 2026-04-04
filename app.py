from flask import Flask, render_template, jsonify, request
import sqlite3

app = Flask(__name__)

PORTFOLIO_DATA = {
    "profile": {
        "name": "Arnab Ghosh",
        "titles": ["Full-Stack Developer", "MERN Architect", "UI and UX Engineer"],
        "about": "Engineering student focused on scalable web systems, developer experience, and interfaces that feel fast on every screen. I enjoy translating complex product needs into simple and dependable user journeys."
    },
    "education": [
        {
            "degree": "Bachelor of Technology in Computer Science",
            "institution": "University of Technology",
            "period": "2021 - 2025",
            "desc": "Specialization in web systems, distributed computing, and product engineering."
        }
    ],
    "skills": [
        {"category": "Frontend", "items": ["React", "Next.js", "Tailwind CSS", "TypeScript"]},
        {"category": "Backend", "items": ["Node.js", "Express", "Flask", "MySQL", "PostgreSQL"]},
        {"category": "Tooling", "items": ["Git", "REST APIs", "Docker", "CI/CD"]}
    ],
    "projects": [
        {
            "title": "Aura Commerce",
            "description": "Multi-vendor MERN commerce platform with role-based dashboards and optimized checkout performance.",
            "tags": ["React", "Node.js", "MongoDB"]
        },
        {
            "title": "Neural Vision",
            "description": "Computer-vision workflow for automated image quality analysis and defect detection.",
            "tags": ["Python", "TensorFlow", "Flask"]
        },
        {
            "title": "Pulse Analytics",
            "description": "Real-time product analytics dashboard with event streams and cohort insights.",
            "tags": ["Next.js", "PostgreSQL", "WebSockets"]
        }
    ]
}

# ---------- DATABASE ----------
def init_db():
    conn = sqlite3.connect('messages.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            message TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# ---------- ROUTES ----------
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/messages')
def messages_page():
    conn = sqlite3.connect('messages.db')
    c = conn.cursor()
    c.execute("SELECT * FROM messages ORDER BY id DESC")
    data = c.fetchall()
    conn.close()
    return render_template('messages.html', messages=data)

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json(silent=True) or {}
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip()
    message = (data.get('message') or '').strip()

    if not name or not email or not message:
        return jsonify({"success": False, "error": "Name, email, and message are required."}), 400

    conn = sqlite3.connect('messages.db')
    c = conn.cursor()
    c.execute("INSERT INTO messages (name, email, message) VALUES (?, ?, ?)",
              (name, email, message))
    conn.commit()
    conn.close()

    return jsonify({"success": True})

@app.route('/api/portfolio')
def portfolio():
    return jsonify(PORTFOLIO_DATA)

if __name__ == '__main__':
    app.run()
