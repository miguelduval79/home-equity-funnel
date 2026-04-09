from flask import Flask, request, jsonify
from flask_cors import CORS
import gspread
from google.oauth2.service_account import Credentials
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os  # ✅ added

app = Flask(__name__)
CORS(app)

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

# ✅ FIX: Always reference file from same folder as app.py
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

CREDS = Credentials.from_service_account_file(
    os.path.join(BASE_DIR, "service_account.json"),
    scopes=SCOPES
)

client = gspread.authorize(CREDS)

SHEET_ID = "1mrYVAUjA95iZ7csOlJncKBbcDOZyvGgYdzin1RIf8aU"
sheet = client.open_by_key(SHEET_ID).sheet1


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


@app.route("/submit-lead", methods=["POST"])
def submit_lead():
    try:
        data = request.get_json()
        print("RECEIVED DATA:", data)

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
            timestamp
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