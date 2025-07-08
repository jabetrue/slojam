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

def align_slos_to_course(course_id):
    headers = {"Authorization": f"Bearer {CANVAS_API_TOKEN}"}

    # Step 1: Get SIS course ID
    course_url = f"{CANVAS_API_URL}/courses/{course_id}"
    course_resp = requests.get(course_url, headers=headers)
    course_resp.raise_for_status()
    course_data = course_resp.json()
    sis_course_id = course_data.get("sis_course_id", "")

    if not sis_course_id or "_" not in sis_course_id:
        print("SIS ID not found or malformed.")
        return {"error": "Invalid SIS course ID format."}

    # Step 2: Extract GITR001A part from Fal25_GITR001A_87654
    parts = sis_course_id.split("_")
    if len(parts) < 2:
        return {"error": "Could not extract course code from SIS ID."}
    course_code = parts[1]
    target_vendor_guid = f"Group_LVL4_{course_code}"

    print(f"Looking for outcome group: {target_vendor_guid}")

    # Step 3: Search all account-level outcome groups
    # (Replace account_id with your real root account ID, often 1)
    account_id = 87480
    group_stack = [f"{CANVAS_API_URL}/accounts/{account_id}/outcome_groups"]

    while group_stack:
        group_url = group_stack.pop()
        try:
            group_resp = requests.get(group_url, headers=headers)
            group_resp.raise_for_status()
            groups = group_resp.json()
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 404:
                continue  # This just means no subgroups — skip
            else:
                raise
    
        for group in groups:
            if group.get("vendor_guid") == target_vendor_guid:
                group_id = group.get("id")
                print(f"Found group ID {group_id} for {target_vendor_guid}")
    
                # Link the group to the course
                link_url = f"{CANVAS_API_URL}/courses/{course_id}/outcome_group_links"
                post_resp = requests.post(link_url, headers=headers, json={"outcome_group_id": group_id})
                post_resp.raise_for_status()
                return {"status": "linked", "group_id": group_id}
    
            # Keep crawling down into subgroups
            group_stack.append(f"{CANVAS_API_URL}/outcome_groups/{group['id']}/subgroups")

def get_required_slos(term_id):
    return REQUIRED_SLO_MATRIX.get(term_id, [])
    
@app.route("/align_slos")
def align_slos():
    try:
        result = align_slos_to_course(COURSE_ID)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)})

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
    
@app.route("/full_api_test")
def full_api_test():
    data = {}

    try:
        # Headers for all requests
        headers = {"Authorization": f"Bearer {CANVAS_API_TOKEN}"}

        # 1. User profile
        user_resp = requests.get(f"{CANVAS_API_URL}/users/self/profile", headers=headers)
        user_resp.raise_for_status()
        data["user_profile"] = user_resp.json()

        # 2. Course info
        course_resp = requests.get(f"{CANVAS_API_URL}/courses/{COURSE_ID}", headers=headers)
        course_resp.raise_for_status()
        course_info = course_resp.json()
        data["course_info"] = {
            "name": course_info.get("name"),
            "course_code": course_info.get("course_code"),
            "term_id": course_info.get("term", {}).get("id"),
            "term_name": course_info.get("term", {}).get("name")
        }

        # 3. Sections
        sections_resp = requests.get(f"{CANVAS_API_URL}/courses/{COURSE_ID}/sections", headers=headers)
        sections_resp.raise_for_status()
        data["sections"] = sections_resp.json()

        # 4. Roster (students only)
        roster_url = f"{CANVAS_API_URL}/courses/{COURSE_ID}/enrollments?type[]=StudentEnrollment&per_page=100"
        roster_resp = requests.get(roster_url, headers=headers)
        roster_resp.raise_for_status()
        data["roster"] = [
            {
                "id": s.get("user", {}).get("id"),
                "name": s.get("user", {}).get("sortable_name")
            }
            for s in roster_resp.json()
        ]

        # 5. Outcomes
        outcomes_resp = requests.get(f"{CANVAS_API_URL}/courses/{COURSE_ID}/outcome_group_links", headers=headers)
        outcomes_resp.raise_for_status()
        data["outcomes"] = [
            {
                "id": o.get("outcome", {}).get("id"),
                "title": o.get("outcome", {}).get("title"),
                "description": o.get("outcome", {}).get("description")
            }
            for o in outcomes_resp.json()
        ]

        return jsonify(data)

    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

@app.route("/submit_score", methods=["POST"])
def submit_score():
    data = request.get_json()
    print("Received score:", data)
    return jsonify({"status": "success", "received": data}), 200
    
@app.route("/api_test")
def api_test():
    try:
        url = f"{CANVAS_API_URL}/users/self/profile"
        headers = {"Authorization": f"Bearer {CANVAS_API_TOKEN}"}
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(debug=True, host='0.0.0.0', port=port)
