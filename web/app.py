from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import os
import requests

app = Flask(__name__)
load_dotenv()

# Load Canvas API details
CANVAS_API_URL = os.environ.get("CANVAS_API_URL")
CANVAS_API_TOKEN = os.environ.get("CANVAS_API_TOKEN")
COURSE_ID = "1158826"

# Function to fetch real student enrollments from Canvas
def fetch_students():
    headers = {
        "Authorization": f"Bearer {CANVAS_API_TOKEN}"
    }
    url = f"{CANVAS_API_URL}/api/v1/courses/{COURSE_ID}/enrollments?type[]=StudentEnrollment&per_page=100"
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    enrollments = response.json()
    students = []
    for enr in enrollments:
        user = enr.get("user", {})
        students.append({
            "id": str(user.get("id")),
            "name": f"{user.get('sortable_name') or user.get('name', 'Unknown')}"
        })
    return students

# Sample SLOs (will replace with real data or CSV later)
slos = [
    {"id": "slo_001", "title": "SLO 1", "description": "Analyze art using formal and contextual analysis."},
    {"id": "slo_002", "title": "SLO 2", "description": "Identify stylistic features in historical artworks."}
]

# Temporary hardcoded required SLOs matrix by term
REQUIRED_SLO_MATRIX = {
    "202670": [1, 5],
    "202710": [1, 5],
    "202730": [1, 5],
    "202750": [1, 5],
    "202770": [2, 6],
    "202810": [2, 6],
    "202830": [2, 6],
    "202850": [2, 6],
    "202870": [3, 7],
    "202910": [3, 7],
    "202930": [3, 7],
    "202950": [3, 7],
}

def get_required_slos(term_id):
    return REQUIRED_SLO_MATRIX.get(term_id, [])

@app.route("/")
def index():
    try:
        students = fetch_students()
    except Exception as e:
        students = []
        print("Error fetching students:", e)

    term_id = "202670"  # temp: simulate current term
    required_slos = get_required_slos(term_id)

    return render_template("index.html", students=students, slos=slos, required_slos=required_slos)

@app.route("/submit_score", methods=["POST"])
def submit_score():
    data = request.get_json()
    print("Received score:", data)
    return jsonify({"status": "success", "received": data}), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(debug=True, host='0.0.0.0', port=port)
