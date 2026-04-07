# Home Equity Funnel

A lead generation system that helps homeowners estimate how much equity they may have in their home and captures their information for follow-up.

This project started as a simple MVP and has evolved into a working full-stack system with a frontend funnel, backend API, Google Sheets storage, and real-time email notifications.

---

## Purpose

This website supports a video-first lead generation strategy.

The video creates interest and confirms the need.  
The website continues that interest with a fast and simple funnel.

The goal is to:
- help homeowners estimate home equity
- collect structured lead data
- store leads in a database (Google Sheets)
- notify the owner instantly via email
- enable fast follow-up

---

## Current System Flow

1. User lands on the website
2. Progress bar shows funnel progress
3. User answers homeowner qualification question
4. If the user clicks "No", the site shows an exit message
5. If the user clicks "Yes", the funnel continues
6. User enters property address
7. User enters estimated property value
8. User enters current mortgage balance
9. User enters full name, email, and phone number
10. The app calculates estimated equity
11. Frontend sends lead data to backend API
12. Backend saves lead to Google Sheets
13. Backend sends email notification to owner
14. The app shows the result to the user

---

## Equity Formula

Estimated Equity = Estimated Property Value - Mortgage Balance

If the result is greater than 0, the app shows the estimated equity.

If the result is 0 or less, the app still displays the calculated result (future logic can expand this).

---

## Architecture

### Frontend
- HTML
- CSS
- JavaScript
- Multi-step funnel
- Bilingual support (EN / ES)

### Backend
- Python
- Flask
- Flask-CORS

### Storage
- Google Sheets (via gspread)

### Notification
- Gmail SMTP (email alerts)

---

## Data Captured

Each lead includes:

- Full Name  
- Email  
- Phone  
- Property Address  
- Estimated Property Value  
- Current Mortgage Balance  
- Estimated Equity  
- Language  
- Timestamp  

---

## Project Structure

```text
HOME_EQUITY_FUNNEL_1/
├── index.html
├── .gitignore
├── README.md
├── css/
│   └── style.css
├── js/
│   └── app.js
├── Assets/
├── Backend/
│   ├── app.py
│   ├── requirements.txt
│   └── service_account.json
└── docs/
    └── uml.md