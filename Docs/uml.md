# UML - Home Equity Funnel

This document describes the current system flow for the Home Equity Funnel.

## Project Summary

The system is a homeowner lead generation website.

A homeowner arrives from content or paid ads, answers a few questions, verifies their email with a 4-digit code, receives an estimated home equity result, and submits verified contact information.

The lead details are sent to a Python Flask backend, saved in Google Sheets, and an email notification is sent to the owner.

There is currently:
- a working frontend funnel
- bilingual support EN / ES
- phone validation
- email verification with 4-digit code
- source tracking using URL parameters
- Python Flask backend
- Google Sheets lead storage
- Gmail SMTP email notifications
- no CRM dashboard yet
- no advanced automation layer yet

## Main Logic

Estimated Equity = Estimated Property Value - Mortgage Balance

If estimated equity is positive, the system shows a positive result.

If estimated equity is zero or negative, the system still shows the estimated result, but this can later be expanded into different result states.

## Source Tracking Logic

Traffic source is captured from the URL.

Examples:

```text
/?source=google
/?source=facebook