import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

API_BASE = os.getenv("CANVAS_API_BASE")
API_TOKEN = os.getenv("CANVAS_API_TOKEN")

HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}"
}

def get_user_courses():
    url = f"{API_BASE}/courses?enrollment_state=active&per_page=100"
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    return response.json()

def filter_courses_by_term(courses, term_id):
    return [c for c in courses if c.get("term", {}).get("id") == term_id]
