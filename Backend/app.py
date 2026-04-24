from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import gspread
from google.oauth2.service_account import Credentials
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import random
import time

app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOCAL_CREDS_PATH = os.path.join(BASE_DIR, "service_account.json")
RENDER_CREDS_PATH = "/etc/secrets/service_account.json"

CREDS_PATH = RENDER_CREDS_PATH if os.path.exists(RENDER_CREDS_PATH) else LOCAL_CREDS_PATH

CREDS = Credentials.from_service_account_file(
    CREDS_PATH,
    scopes=SCOPES
)

client = gspread.authorize(CREDS)

SHEET_ID = "1mrYVAUjA95iZ7csOlJncKBbcDOZyvGgYdzin1RIf8aU"
sheet = client.open_by_key(SHEET_ID).sheet1

verification_codes = {}
verified_emails = set()
CODE_EXPIRATION_SECONDS = 600


@app.route("/")
def home():
    return render_template("index.html")


def send_new_lead_email(lead_data, timestamp):
    smtp_server = "smtp.gmail.com"
    smtp_port = 587

    sender_email = "miguelmedinarealtor@gmail.com"
    sender_password = "cvjb segs kvbf gkaz"
    recipient_email = "medina21@gmail.com"

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

    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = recipient_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, recipient_email, message.as_string())


def send_verification_email(email, code):
    smtp_server = "smtp.gmail.com"
    smtp_port = 587

    sender_email = "miguelmedinarealtor@gmail.com"
    sender_password = "cvjb segs kvbf gkaz"

    subject = "Your Home Equity Verification Code"

    body = f"""
Your verification code is:

{code}

Enter this code to see your home equity result.

This code expires in 10 minutes.
"""

    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, email, message.as_string())


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

        row = [
            data.get("full_name"),
            data.get("email"),
            data.get("phone"),
            data.get("property_address"),
            data.get("estimated_property_value"),
            data.get("current_mortgage_balance"),
            data.get("estimated_equity"),
            data.get("language"),
            timestamp,
            data.get("source", "direct")
        ]

        sheet.append_row(row)

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