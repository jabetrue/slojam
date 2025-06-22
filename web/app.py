from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import os

app = Flask(__name__)
load_dotenv()

students = [
    {"id": "stu_001", "name": "Alice Johnson"},
    {"id": "stu_002", "name": "Bob Lee"}
]

slos = [
    {"id": "slo_001", "title": "SLO 1", "description": "Analyze art using formal and contextual analysis."},
    {"id": "slo_002", "title": "SLO 2", "description": "Identify stylistic features in historical artworks."}
]

@app.route("/")
def index():
    return render_template("index.html", students=students, slos=slos)

@app.route("/submit_score", methods=["POST"])
def submit_score():
    data = request.get_json()
    print("Received score:", data)
    return jsonify({"status": "success", "received": data}), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
	app.run(debug=True, host='0.0.0.0', port=port)