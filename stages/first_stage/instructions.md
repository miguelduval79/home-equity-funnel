# CalcMyEquity — First Stage
## Visual Redesign Only

### OBJECTIVE

Redesign the existing CalcMyEquity interface so that it has the same modern visual style that will be used for the new Home Equity Options comparison experience.

This stage is ONLY a visual redesign of the existing CalcMyEquity application.

DO NOT change how CalcMyEquity works.

The purpose is to establish the visual foundation before we build the new comparison feature in Stage 2.


### EXISTING APPLICATION

Project:

/root/moreno/projects/calc_my_equity

Current application files:

Backend/app.py
Backend/templates/index.html
Backend/static/app.js
Backend/static/style.css


### CRITICAL RULE

PRESERVE THE EXISTING CALCMYEQUITY PROCESS.

Do not modify the business logic or user journey.

The existing application already:

- collects borrower/property information
- calculates estimated property equity
- verifies the user's email
- submits the lead
- stores the lead in Google Sheets
- sends lead notifications
- tracks the traffic source

ALL OF THIS MUST CONTINUE TO WORK EXACTLY AS IT DOES NOW.


### DO NOT CHANGE

Do not change:

- equity calculation logic
- existing form fields
- order of the existing process
- email verification
- lead submission
- Google Sheets integration
- source tracking
- Flask routes
- backend logic
- existing data collected
- existing JavaScript functionality

Do not remove or rename HTML IDs/classes used by the existing JavaScript.

Do not rewrite app.js simply to redesign the interface.


### WHAT SHOULD CHANGE

The objective is primarily to redesign:

Backend/static/style.css

Small HTML changes are allowed ONLY when necessary for presentation/layout.

The new interface should have a modern financial/mortgage dashboard appearance.

Design direction:

- clean white/light background
- navy/blue primary color
- professional mortgage/financial appearance
- rounded cards and containers
- subtle borders and shadows
- clean modern typography
- strong visual hierarchy
- improved spacing
- modern input fields
- modern buttons
- clear presentation of the equity result
- responsive design for desktop and mobile

The design should feel trustworthy, simple and modern.

Avoid excessive animation or unnecessary visual effects.


### IMPORTANT FUTURE DESIGN CONSIDERATION

This visual design will become the foundation for Stage 2.

Stage 2 will eventually add a comparison screen containing:

- Cash-Out Refinance
- HELOC
- Home Equity Loan

Therefore, design CalcMyEquity so the future comparison screen can look like a natural continuation of the same application.


### SAFETY

Before modifying anything:

1. Inspect the current application.
2. Preserve the current working version with Git.
3. Identify which HTML elements are connected to app.js.
4. Do not modify functional behavior.

Do not modify credentials, integrations, or deployment configuration during this stage.


### TESTING

After completing the redesign, verify that:

1. The application loads correctly.
2. Existing inputs work.
3. Equity calculations work exactly as before.
4. Email verification still works.
5. Lead submission still works.
6. Existing JavaScript works.
7. The interface works on desktop.
8. The interface works on mobile.

Report exactly which files were modified.


### STOP CONDITION

When Stage 1 is complete:

STOP.

Do NOT begin building the Cash-Out / HELOC / Home Equity Loan comparison feature.

That will be Stage 2 and will receive separate instructions.
