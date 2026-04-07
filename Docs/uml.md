# UML - Home Equity Funnel

This document describes the current system flow for the Home Equity Funnel.

## Project Summary

The system is a homeowner lead generation website.

A homeowner arrives from content, answers a few questions, receives an estimated home equity result, and submits contact information. The lead details are then sent directly to a Python backend, saved in Google Sheets, and an email notification is sent to the owner.

There is currently:
- a working frontend funnel
- a working Python backend
- Google Sheets lead storage
- email lead notifications
- no CRM dashboard yet
- no advanced automation layer yet

## Main Logic

Estimated Equity = Estimated Property Value - Mortgage Balance

If estimated equity is positive, the system shows a positive result.

If estimated equity is zero or negative, the system still shows the estimated result, but this can later be expanded into different result states.

---

## Current Architecture

Frontend:
- HTML
- CSS
- JavaScript
- bilingual support (EN / ES)
- multi-step funnel

Backend:
- Python
- Flask
- Flask-CORS

Storage:
- Google Sheets

Notification:
- Gmail SMTP email alert

---

## System Flow

1. Visitor lands on the funnel
2. Visitor answers homeowner qualification question
3. Visitor enters property address
4. Visitor enters estimated property value
5. Visitor enters current mortgage balance
6. Visitor enters contact information
7. Frontend calculates estimated equity
8. Frontend sends lead data to backend API
9. Backend saves lead to Google Sheets
10. Backend sends email notification
11. Frontend shows estimated equity result to the user

---

## Use Case Diagram

```mermaid
flowchart LR
    U[Visitor / Homeowner]
    W[Lead Generation Website]
    C[Equity Calculator]
    B[Python Backend API]
    S[Google Sheets]
    E[Email Notification]
    O[Owner / Admin]

    U -->|Starts equity check| W
    U -->|Enters address| W
    U -->|Enters property value| W
    U -->|Enters mortgage balance| W
    U -->|Enters contact info| W

    W -->|Calculate estimated equity| C
    C -->|Return result| W
    W -->|Send structured lead data| B
    B -->|Save lead| S
    B -->|Send alert email| E
    E -->|Deliver notification| O
    W -->|Show result| U