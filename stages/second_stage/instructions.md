# CalcMyEquity — Second Stage
## Home Equity Options Comparison

### OBJECTIVE

Extend CalcMyEquity with a new FINAL STEP after the existing equity calculation.

The existing CalcMyEquity process has already:

- collected the homeowner's information
- collected estimated property value
- collected current mortgage balance
- calculated estimated home equity
- completed the existing lead process

Stage 2 should USE that information.

Do not ask the borrower to enter the same information again.

The new step answers:

"Now that I know how much equity I have, what are my potential options for accessing it?"


### CRITICAL RULE

DO NOT redesign or rewrite the existing CalcMyEquity process.

Stage 1 established the visual design.

Preserve it.

Stage 2 EXTENDS the application by adding a new comparison experience after the existing equity result.

Do not break or replace:

- existing equity calculation
- existing forms
- email verification
- lead capture
- Google Sheets integration
- source tracking
- existing Flask routes
- existing working JavaScript behavior


# NEW FINAL SCREEN

Create a new section/view titled approximately:

"Compare Your Home Equity Options"

The design must visually continue the Stage 1 CalcMyEquity design.

It should feel like the same application, not a separate website.


# EXISTING EQUITY RESULT

At the top of the comparison experience prominently display:

"Your Estimated Home Equity"

and the equity amount already calculated by CalcMyEquity.

Example:

Your Estimated Home Equity
$150,000

IMPORTANT:

Total home equity is NOT automatically the amount the borrower can access.

The application must calculate a separate:

"Potential Accessible Equity"

based on the property value, existing mortgage balance and product assumptions.


# SCENARIO CONTROLS

Create three modern horizontal slider controls near the top.

## 1. Interest Rate

Label:

Interest Rate (APR)

Allow the borrower to adjust the assumed interest rate and immediately see the calculations update.

This is a scenario/testing control.

Do not imply this is an offered or approved rate.


## 2. Time

Label:

Loan Term

Allow the borrower to adjust the term.

The calculation must respect the fact that different products can have different structures.

Do NOT force HELOC into the same amortization structure as a traditional fixed loan.


## 3. Credit

Label:

Credit Score

Allow the borrower to select/adjust an estimated credit score.

Use this as a scenario variable affecting reasonable product assumptions.

Do not imply that changing the slider represents actual approval or underwriting.


# THREE PRODUCT CARDS

Below the controls create THREE responsive Flexbox cards.

Desktop:

[ Cash-Out Refinance ] [ HELOC ] [ Home Equity Loan ]

Mobile:

Stack the cards vertically.

All three cards should update dynamically when relevant slider values change.


# CARD 1 — CASH-OUT REFINANCE

Title:

Cash-Out Refinance

Short explanation:

Replace the existing mortgage with a larger new mortgage and potentially receive part of the difference in cash.

Calculate a POTENTIAL cash-out amount using:

- estimated property value
- current mortgage balance
- assumed maximum LTV
- scenario interest rate
- credit score assumptions
- selected term

Display approximately:

Potential Cash You Could Receive

Interest Rate (APR)

Loan Term

Estimated New Mortgage Payment

Estimated New Mortgage Amount


### IMPORTANT CASH-OUT RULE

The monthly payment must be calculated from the ENTIRE NEW MORTGAGE.

Do NOT calculate the payment using only the cash the borrower receives.

Conceptually:

Maximum New Mortgage
=
Property Value × Allowed LTV

Potential Cash Out
=
Maximum New Mortgage
-
Existing Mortgage Balance
-
any explicitly modeled costs

Do not allow negative cash-out values.


# CARD 2 — HELOC

Title:

Home Equity Line of Credit (HELOC)

Short explanation:

A revolving line of credit secured by home equity that allows the borrower to draw funds when needed.

Calculate a potential credit limit using:

- property value
- existing mortgage balance
- assumed maximum CLTV
- credit score assumptions

Display approximately:

Potential Credit Limit

Interest Rate (APR)

Draw Period

Repayment Period

Estimated Payment


### IMPORTANT HELOC RULE

A HELOC is NOT the same as a fixed installment loan.

Distinguish:

CREDIT LIMIT

from:

AMOUNT DRAWN

The borrower may receive access to a credit line without borrowing the entire amount.

The payment calculation should be based on an assumed amount drawn.

If the interface needs an additional HELOC-specific control for amount drawn, it may be added inside the HELOC card.

During the draw period, clearly identify whether the displayed payment assumes interest-only payments.

Do not pretend the HELOC has the same fixed-rate structure as the other products.


# CARD 3 — HOME EQUITY LOAN

Title:

Home Equity Loan

Short explanation:

A separate loan secured by the property's equity that provides a lump sum while leaving the existing first mortgage in place.

Calculate potential loan amount using:

- property value
- existing mortgage balance
- assumed maximum CLTV
- credit score assumptions
- interest rate
- selected term

Display approximately:

Potential Loan Amount

Interest Rate (APR)

Loan Term

Estimated Monthly Payment

Estimated Total Repayment


### IMPORTANT HOME EQUITY LOAN RULE

The existing first mortgage remains in place.

The displayed payment should represent the NEW HOME EQUITY LOAN payment.

Do not combine it with the existing mortgage unless explicitly showing a separate "combined housing debt payment" figure.


# CALCULATION STRUCTURE

Do NOT scatter arbitrary numbers throughout the frontend.

Create centralized assumptions/configuration for items such as:

- maximum cash-out LTV
- maximum HELOC CLTV
- maximum home equity loan CLTV
- credit-score adjustments
- product interest-rate assumptions
- default loan terms
- HELOC draw period
- HELOC repayment period

Keep these assumptions easy to modify later.

This is important because actual lender guidelines and market rates will eventually change.


# CREDIT SCORE LOGIC

Credit score should influence the scenario.

However:

DO NOT present the credit score slider as actual underwriting.

For this version, use transparent scenario assumptions.

If necessary, create reasonable score bands such as:

Excellent
Good
Fair
Lower Credit

The exact thresholds and adjustments should be centralized and documented.

Report the assumptions used when Stage 2 is completed.


# INTERACTIVITY

When the borrower changes a slider:

- calculations should update immediately
- no page reload should be required
- all affected product cards should update
- dollar amounts should be formatted properly
- rates should display clearly
- invalid/negative borrowing amounts should never appear


# VISUAL DESIGN

Use the visual system established in Stage 1.

The comparison should resemble a modern financial dashboard.

Structure approximately:

------------------------------------------------

Compare Your Home Equity Options

Adjust the assumptions below to compare potential scenarios.

[ Interest Rate ] [ Loan Term ] [ Credit Score ]

------------------------------------------------

Your Estimated Home Equity

$XXX,XXX

Potential accessible equity depends on product and qualification.

------------------------------------------------

[ CASH-OUT ]    [ HELOC ]    [ HOME EQUITY LOAN ]

Potential       Potential     Potential
Cash            Credit Line   Loan Amount

Rate            Rate          Rate
Term            Draw Period   Term
Payment         Payment       Payment

Benefits        Benefits      Benefits

Explore         Explore       Explore

------------------------------------------------


# CALL TO ACTION

At the bottom provide a clear next step.

Example:

"Want to explore your options?"

or:

"Get a Personalized Quote"

Explain that the numbers shown are estimates.

Provide a CTA that can later connect the borrower with the mortgage lead/loan process.

DO NOT create a completely new lead form if CalcMyEquity already possesses the required borrower information.


# DISCLOSURE

Include concise language similar to:

"These calculations are estimates for informational purposes only and are not a loan offer or approval. Actual rates, terms, payments, available equity and eligibility may vary based on credit profile, property value, existing liens, lender requirements and underwriting."

Do not claim:

- guaranteed approval
- guaranteed rates
- guaranteed loan amounts
- guaranteed accessible equity


# IMPORTANT BUSINESS PURPOSE

This stage transforms CalcMyEquity from:

"How much equity do I have?"

into:

"How might I use that equity?"

The objective is to naturally move an existing homeowner lead toward understanding:

Cash-Out Refinance

vs.

HELOC

vs.

Home Equity Loan

without forcing them to leave the CalcMyEquity experience or enter their information again.


# TESTING

Before declaring Stage 2 complete verify:

1. Existing CalcMyEquity process still works.
2. Existing equity value transfers correctly.
3. Property value transfers correctly.
4. Existing mortgage balance transfers correctly.
5. All three product cards calculate independently.
6. Cash-out payment uses the FULL replacement mortgage.
7. HELOC distinguishes credit limit from amount drawn.
8. Home Equity Loan is treated as a second loan.
9. Sliders update calculations dynamically.
10. Negative accessible-equity values cannot appear.
11. Desktop layout works.
12. Mobile layout works.
13. Existing lead capture remains functional.
14. No existing functionality was removed.


# REPORT WHEN FINISHED

When complete, report:

- files created
- files modified
- formulas used
- LTV/CLTV assumptions
- credit-score assumptions
- rate assumptions
- HELOC assumptions
- any changes required to existing HTML/JavaScript
- testing performed


# STOP CONDITION

Complete Stage 2 and STOP.

Do not deploy to Render.

Do not merge this with the separate mortgage_leads project.

Do not begin another stage.

Wait for review and approval.
