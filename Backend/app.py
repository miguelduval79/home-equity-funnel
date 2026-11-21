from flask import Flask, request, jsonify, render_template, redirect
from flask_cors import CORS
from datetime import datetime
import base64
import json
import os
import random
import time

from email.message import EmailMessage

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)

# ---------------------------------------------------------------------------
# Mail configuration (Gmail API, OAuth refresh token — no SMTP, no password)
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOCAL_TOKEN_PATH = os.path.join(BASE_DIR, "gmail_token.json")
RENDER_TOKEN_PATH = "/etc/secrets/gmail_token.json"

GMAIL_TOKEN_FILE = os.environ.get(
    "GMAIL_TOKEN_FILE",
    RENDER_TOKEN_PATH if os.path.exists(RENDER_TOKEN_PATH) else LOCAL_TOKEN_PATH,
)
GMAIL_SCOPES = ["https://www.googleapis.com/auth/gmail.send"]
SENDER_EMAIL = os.environ.get("GMAIL_SENDER", "miguel@myfloridaequity.com")
LEAD_NOTIFY_TO = os.environ.get("LEAD_NOTIFY_TO", "miguel@myfloridaequity.com")

_google = {}


def load_credentials():
    """Token from GMAIL_TOKEN_JSON env var (preferred), else from the token file."""
    raw = os.environ.get("GMAIL_TOKEN_JSON", "").strip()
    if raw:
        try:
            info = json.loads(raw)
        except json.JSONDecodeError as exc:
            raise RuntimeError(f"GMAIL_TOKEN_JSON is not valid JSON: {exc}")
        return Credentials.from_authorized_user_info(info, GMAIL_SCOPES)
    if os.path.exists(GMAIL_TOKEN_FILE):
        return Credentials.from_authorized_user_file(GMAIL_TOKEN_FILE, GMAIL_SCOPES)
    raise RuntimeError(
        "No Gmail credentials: set the GMAIL_TOKEN_JSON environment variable "
        f"or provide the token file at {GMAIL_TOKEN_FILE}"
    )


def gmail_service():
    """Build (and cache) the Gmail API client from the stored refresh token."""
    service = _google.get("service")
    if service is not None:
        return service
    creds = load_credentials()
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
    service = build("gmail", "v1", credentials=creds, cache_discovery=False)
    _google["service"] = service
    return service


def send_email(to_address, subject, body):
    message = EmailMessage()
    message["To"] = to_address
    message["From"] = SENDER_EMAIL
    message["Subject"] = subject
    message.set_content(body)

    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
    gmail_service().users().messages().send(
        userId="me", body={"raw": raw}
    ).execute()


verification_codes = {}
verified_emails = set()
CODE_EXPIRATION_SECONDS = 600


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/fb")
def facebook_source():
    return redirect("/?source=facebook")


@app.route("/tt")
def tiktok_source():
    return redirect("/?source=tiktok")


@app.route("/google")
def google_source():
    return redirect("/?source=google")


@app.route("/healthz")
def healthz():
    return jsonify({"ok": True}), 200


def send_new_lead_email(lead_data, timestamp):
    subject = "New Home Equity Lead"

    body = f"""
New lead received

Name: {lead_data.get("full_name", "")}
Email: {lead_data.get("email", "")}
Phone: {lead_data.get("phone", "")}
Address: {lead_data.get("property_address", "")}
Value: {lead_data.get("estimated_property_value", "")}
Mortgage: {lead_data.get("current_mortgage_balance", "")}
Equity: {lead_data.get("estimated_equity", "")}
Language: {lead_data.get("language", "")}
Source: {lead_data.get("source", "direct")}
Time: {timestamp}
"""

    send_email(LEAD_NOTIFY_TO, subject, body)


def send_verification_email(email, code):
    subject = "Your Home Equity Verification Code"

    body = f"""
Your verification code is:

{code}

Enter this code to see your home equity result.

This code expires in 10 minutes.
"""

    send_email(email, subject, body)


@app.route("/send-verification-code", methods=["POST"])
def send_verification_code():
    try:
        data = request.get_json()
        email = data.get("email", "").strip().lower()

        if not email:
            return jsonify({"error": "Email is required."}), 400

        code = str(random.randint(1000, 9999))

        verification_codes[email] = {
            "code": code,
            "created_at": time.time()
        }

        send_verification_email(email, code)

        return jsonify({
            "status": "success",
            "message": "Verification code sent."
        }), 200

    except Exception as e:
        print("VERIFICATION EMAIL ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/verify-code", methods=["POST"])
def verify_code():
    try:
        data = request.get_json()
        email = data.get("email", "").strip().lower()
        code = data.get("code", "").strip()

        if not email or not code:
            return jsonify({"error": "Email and code are required."}), 400

        stored = verification_codes.get(email)

        if not stored:
            return jsonify({"error": "No verification code found."}), 400

        code_age = time.time() - stored["created_at"]

        if code_age > CODE_EXPIRATION_SECONDS:
            verification_codes.pop(email, None)
            return jsonify({"error": "Verification code expired."}), 400

        if stored["code"] != code:
            return jsonify({"error": "Invalid verification code."}), 400

        verified_emails.add(email)
        verification_codes.pop(email, None)

        return jsonify({
            "status": "success",
            "message": "Email verified."
        }), 200

    except Exception as e:
        print("CODE VERIFICATION ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/submit-lead", methods=["POST"])
def submit_lead():
    try:
        data = request.get_json()
        print("RECEIVED DATA:", data)

        email = data.get("email", "").strip().lower()

        if email not in verified_emails:
            return jsonify({"error": "Email has not been verified."}), 403

        timestamp = datetime.now().strftime("%Y-%m-%d %I:%M %p")

        email_sent = True
        email_error = None

        try:
            send_new_lead_email(data, timestamp)
        except Exception as email_exception:
            email_sent = False
            email_error = str(email_exception)
            print("EMAIL ALERT ERROR:", email_error)

        verified_emails.discard(email)

        return jsonify({
            "status": "success",
            "email_sent": email_sent,
            "email_error": email_error
        }), 200

    except Exception as e:
        print("BACKEND ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
