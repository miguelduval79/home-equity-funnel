function getLeadSource() {
  const params = new URLSearchParams(window.location.search);
  return params.get("source") || params.get("utm_source") || "direct";
}

const steps = document.querySelectorAll(".step");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const yesHomeowner = document.getElementById("yesHomeowner");
const noHomeowner = document.getElementById("noHomeowner");
const restartFromExit = document.getElementById("restartFromExit");

const toStep3 = document.getElementById("toStep3");
const toStep4 = document.getElementById("toStep4");
const toStep5 = document.getElementById("toStep5");
const showResult = document.getElementById("showResult");
const verifyCodeBtn = document.getElementById("verifyCodeBtn");
const restartFunnel = document.getElementById("restartFunnel");

const backButtons = document.querySelectorAll(".back-btn");

const addressInput = document.getElementById("address");
const propertyValueInput = document.getElementById("propertyValue");
const mortgageBalanceInput = document.getElementById("mortgageBalance");
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const verificationCodeInput = document.getElementById("verificationCode");

const equityResult = document.getElementById("equityResult");
const resultAddress = document.getElementById("resultAddress");
const resultValue = document.getElementById("resultValue");
const resultMortgage = document.getElementById("resultMortgage");

const langEnBtn = document.getElementById("lang-en");
const langEsBtn = document.getElementById("lang-es");

const SUBMIT_LEAD_URL = "/submit-lead";
const SEND_CODE_URL = "/send-verification-code";
const VERIFY_CODE_URL = "/verify-code";

let currentStep = 1;
const totalSteps = 6;
let currentLanguage = "en";
let pendingLeadData = null;

const translations = {
  en: {
    eyebrowText: "Home Equity Check",
    mainHeading: "See how much equity you may have in your home",
    mainSubtext: "Answer a few quick questions to get an estimate.",
    progressStep: "Step",
    progressOf: "of",
    progressExited: "Exited",
    progressComplete: "Complete",
    step1Title: "Do you currently own a home?",
    step1Text: "This tool is made for current homeowners.",
    yesHomeowner: "Yes",
    noHomeowner: "No",
    exitTitle: "This tool is for homeowners right now",
    exitText: "If you plan to buy a home later, this tool may help you in the future.",
    restartFromExit: "Start Over",
    step2Title: "What is your property address?",
    step2Text: "We use this to help organize your estimate.",
    addressLabel: "Property Address",
    addressPlaceholder: "123 Main St, Miami, FL",
    step3Title: "What do you think your home is worth?",
    step3Text: "A rough estimate is okay.",
    valueLabel: "Estimated Property Value",
    valuePlaceholder: "500000",
    step4Title: "What is your current mortgage balance?",
    step4Text: "A best guess is fine if you do not know the exact number.",
    mortgageLabel: "Mortgage Balance",
    mortgagePlaceholder: "300000",
    step5Title: "Where should we send your result?",
    step5Text: "Enter your information below.",
    nameLabel: "Full Name",
    namePlaceholder: "John Smith",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    phoneLabel: "Phone Number",
    phonePlaceholder: "305-555-1234",
    verificationTitle: "Check your email",
    verificationText: "We sent a 4-digit code to your email. Enter it below to see your result.",
    verificationCodeLabel: "Verification Code",
    verificationPlaceholder: "1234",
    verifyCodeBtn: "Verify and See My Result",
    verifying: "Verifying...",
    resultTitle: "Your estimated equity",
    resultText: "This is based on your estimated home value minus your mortgage balance.",
    resultAddressLabel: "Address:",
    resultValueLabel: "Estimated Value:",
    resultMortgageLabel: "Mortgage Balance:",
    restartFunnel: "Start Over",
    back: "Back",
    next: "Next",
    showResult: "See My Result",
    sending: "Sending...",
    alertAddress: "Please enter your property address.",
    alertValueMissing: "Please enter your estimated property value.",
    alertValueInvalid: "Please enter a valid property value.",
    alertMortgageMissing: "Please enter your current mortgage balance.",
    alertMortgageInvalid: "Please enter a valid mortgage balance.",
    alertName: "Please enter your full name.",
    alertEmail: "Please enter your email.",
    alertEmailInvalid: "Please enter a valid email address.",
    alertPhone: "Please enter your phone number.",
    alertPhoneInvalid: "Please enter a valid phone number like 305-555-1234.",
    alertCode: "Please enter the 4-digit code.",
    alertCodeInvalid: "The code must be 4 digits.",
    alertCodeSendError: "There was a problem sending the verification code. Please try again.",
    alertCodeVerifyError: "The code is incorrect or expired. Please try again.",
    alertSendError: "There was a problem sending the lead. Please try again."
  },
  es: {
    eyebrowText: "Consulta de plusvalía",
    mainHeading: "Mira cuánta plusvalía podrías tener en tu casa",
    mainSubtext: "Responde unas preguntas rápidas para obtener un estimado.",
    progressStep: "Paso",
    progressOf: "de",
    progressExited: "Salida",
    progressComplete: "Completado",
    step1Title: "¿Actualmente eres dueño de una casa?",
    step1Text: "Esta herramienta es para propietarios actuales.",
    yesHomeowner: "Sí",
    noHomeowner: "No",
    exitTitle: "Esta herramienta es para propietarios en este momento",
    exitText: "Si planeas comprar una casa más adelante, esta herramienta te puede ayudar en el futuro.",
    restartFromExit: "Comenzar de nuevo",
    step2Title: "¿Cuál es la dirección de tu propiedad?",
    step2Text: "Usamos esto para organizar tu estimado.",
    addressLabel: "Dirección de la propiedad",
    addressPlaceholder: "123 Main St, Miami, FL",
    step3Title: "¿Cuánto crees que vale tu casa?",
    step3Text: "Un estimado aproximado está bien.",
    valueLabel: "Valor estimado de la propiedad",
    valuePlaceholder: "500000",
    step4Title: "¿Cuál es el saldo actual de tu hipoteca?",
    step4Text: "Una aproximación está bien si no sabes el número exacto.",
    mortgageLabel: "Saldo de la hipoteca",
    mortgagePlaceholder: "300000",
    step5Title: "¿A dónde te enviamos tu resultado?",
    step5Text: "Ingresa tu información abajo.",
    nameLabel: "Nombre completo",
    namePlaceholder: "Juan Pérez",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "tu@email.com",
    phoneLabel: "Número de teléfono",
    phonePlaceholder: "305-555-1234",
    verificationTitle: "Revisa tu correo",
    verificationText: "Enviamos un código de 4 dígitos a tu correo. Escríbelo abajo para ver tu resultado.",
    verificationCodeLabel: "Código de verificación",
    verificationPlaceholder: "1234",
    verifyCodeBtn: "Verificar y ver mi resultado",
    verifying: "Verificando...",
    resultTitle: "Tu plusvalía estimada",
    resultText: "Esto se basa en el valor estimado de tu casa menos el saldo de tu hipoteca.",
    resultAddressLabel: "Dirección:",
    resultValueLabel: "Valor estimado:",
    resultMortgageLabel: "Saldo de la hipoteca:",
    restartFunnel: "Comenzar de nuevo",
    back: "Atrás",
    next: "Siguiente",
    showResult: "Ver mi resultado",
    sending: "Enviando...",
    alertAddress: "Por favor ingresa la dirección de tu propiedad.",
    alertValueMissing: "Por favor ingresa el valor estimado de tu propiedad.",
    alertValueInvalid: "Por favor ingresa un valor válido de la propiedad.",
    alertMortgageMissing: "Por favor ingresa el saldo actual de tu hipoteca.",
    alertMortgageInvalid: "Por favor ingresa un saldo válido de la hipoteca.",
    alertName: "Por favor ingresa tu nombre completo.",
    alertEmail: "Por favor ingresa tu correo electrónico.",
    alertEmailInvalid: "Por favor ingresa un correo electrónico válido.",
    alertPhone: "Por favor ingresa tu número de teléfono.",
    alertPhoneInvalid: "Por favor ingresa un número válido como 305-555-1234.",
    alertCode: "Por favor ingresa el código de 4 dígitos.",
    alertCodeInvalid: "El código debe tener 4 dígitos.",
    alertCodeSendError: "Hubo un problema enviando el código. Inténtalo de nuevo.",
    alertCodeVerifyError: "El código es incorrecto o expiró. Inténtalo de nuevo.",
    alertSendError: "Hubo un problema al enviar la información. Inténtalo de nuevo."
  }
};

function getText(key) {
  return translations[currentLanguage][key];
}

function showStep(stepId) {
  steps.forEach((step) => step.classList.add("hidden"));
  const activeStep = document.getElementById(stepId);
  if (activeStep) activeStep.classList.remove("hidden");
}

function updateProgress(stepNumber) {
  const progressPercent = (stepNumber / totalSteps) * 100;
  progressFill.style.width = `${progressPercent}%`;
  progressText.textContent = `${getText("progressStep")} ${stepNumber} ${getText("progressOf")} ${totalSteps}`;
}

function showExitState() {
  steps.forEach((step) => step.classList.add("hidden"));
  document.getElementById("step-exit").classList.remove("hidden");
  progressFill.style.width = "0%";
  progressText.textContent = getText("progressExited");
}

function formatCurrency(value) {
  return Number(value).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  });
}

function formatPhoneNumber(value) {
  const numbersOnly = value.replace(/\D/g, "").slice(0, 10);
  if (numbersOnly.length <= 3) return numbersOnly;
  if (numbersOnly.length <= 6) return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
  return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 6)}-${numbersOnly.slice(6)}`;
}

function isValidEmail(email) {
  const cleanEmail = email.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailPattern.test(cleanEmail);
}

function isValidPhoneNumber(phone) {
  const numbersOnly = phone.replace(/\D/g, "");
  if (numbersOnly.length !== 10) return false;

  const fakeNumbers = [
    "0000000000",
    "1111111111",
    "2222222222",
    "3333333333",
    "4444444444",
    "5555555555",
    "6666666666",
    "7777777777",
    "8888888888",
    "9999999999",
    "1234567890"
  ];

  if (fakeNumbers.includes(numbersOnly)) return false;

  const areaCode = numbersOnly.slice(0, 3);
  const prefix = numbersOnly.slice(3, 6);

  if (areaCode === "000" || prefix === "000") return false;
  if (areaCode[0] === "0" || areaCode[0] === "1") return false;
  if (prefix[0] === "0" || prefix[0] === "1") return false;

  return true;
}

function isValidVerificationCode(code) {
  return /^\d{4}$/.test(code.trim());
}

if (phoneInput) {
  phoneInput.addEventListener("input", () => {
    phoneInput.value = formatPhoneNumber(phoneInput.value);
  });
}

if (verificationCodeInput) {
  verificationCodeInput.addEventListener("input", () => {
    verificationCodeInput.value = verificationCodeInput.value.replace(/\D/g, "").slice(0, 4);
  });
}

function resetFunnel() {
  currentStep = 1;
  pendingLeadData = null;

  addressInput.value = "";
  propertyValueInput.value = "";
  mortgageBalanceInput.value = "";
  fullNameInput.value = "";
  emailInput.value = "";
  phoneInput.value = "";

  if (verificationCodeInput) {
    verificationCodeInput.value = "";
  }

  equityResult.textContent = "$0";
  resultAddress.textContent = "-";
  resultValue.textContent = "-";
  resultMortgage.textContent = "-";

  showStep("step-1");
  updateProgress(1);
}

function validateStep2() {
  if (addressInput.value.trim() === "") {
    alert(getText("alertAddress"));
    return false;
  }
  return true;
}

function validateStep3() {
  if (propertyValueInput.value.trim() === "") {
    alert(getText("alertValueMissing"));
    return false;
  }

  if (Number(propertyValueInput.value) <= 0) {
    alert(getText("alertValueInvalid"));
    return false;
  }

  return true;
}

function validateStep4() {
  if (mortgageBalanceInput.value.trim() === "") {
    alert(getText("alertMortgageMissing"));
    return false;
  }

  if (Number(mortgageBalanceInput.value) < 0) {
    alert(getText("alertMortgageInvalid"));
    return false;
  }

  return true;
}

function validateStep5() {
  if (fullNameInput.value.trim() === "") {
    alert(getText("alertName"));
    return false;
  }

  if (emailInput.value.trim() === "") {
    alert(getText("alertEmail"));
    return false;
  }

  if (!isValidEmail(emailInput.value)) {
    alert(getText("alertEmailInvalid"));
    return false;
  }

  if (phoneInput.value.trim() === "") {
    alert(getText("alertPhone"));
    return false;
  }

  if (!isValidPhoneNumber(phoneInput.value)) {
    alert(getText("alertPhoneInvalid"));
    return false;
  }

  return true;
}

function calculateEquity() {
  const propertyValue = Number(propertyValueInput.value);
  const mortgageBalance = Number(mortgageBalanceInput.value);
  return propertyValue - mortgageBalance;
}

function buildLeadPayload() {
  const equity = calculateEquity();

  return {
    full_name: fullNameInput.value.trim(),
    email: emailInput.value.trim().toLowerCase(),
    phone: phoneInput.value.trim(),
    property_address: addressInput.value.trim(),
    estimated_property_value: formatCurrency(propertyValueInput.value),
    current_mortgage_balance: formatCurrency(mortgageBalanceInput.value),
    estimated_equity: formatCurrency(equity),
    language: currentLanguage === "en" ? "English" : "Spanish",
    source: getLeadSource()
  };
}

async function sendVerificationCode(email) {
  const response = await fetch(SEND_CODE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  });

  if (!response.ok) {
    throw new Error("Failed to send verification code.");
  }

  return response.json();
}

async function verifyEmailCode(email, code) {
  const response = await fetch(VERIFY_CODE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, code })
  });

  if (!response.ok) {
    throw new Error("Failed to verify code.");
  }

  return response.json();
}

async function sendLeadToBackend(payload) {
  const response = await fetch(SUBMIT_LEAD_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Failed to send lead.");
  }

  return payload;
}

function showFinalResult(leadData) {
  equityResult.textContent = leadData.estimated_equity;
  resultAddress.textContent = leadData.property_address;
  resultValue.textContent = leadData.estimated_property_value;
  resultMortgage.textContent = leadData.current_mortgage_balance;

  currentStep = 7;
  showStep("step-7");
  progressFill.style.width = "100%";
  progressText.textContent = getText("progressComplete");
}

function applyLanguage(language) {
  currentLanguage = language;

  langEnBtn.classList.toggle("active", language === "en");
  langEsBtn.classList.toggle("active", language === "es");

  document.documentElement.lang = language;

  document.getElementById("eyebrowText").textContent = getText("eyebrowText");
  document.getElementById("mainHeading").textContent = getText("mainHeading");
  document.getElementById("mainSubtext").textContent = getText("mainSubtext");

  document.getElementById("step1Title").textContent = getText("step1Title");
  document.getElementById("step1Text").textContent = getText("step1Text");
  yesHomeowner.textContent = getText("yesHomeowner");
  noHomeowner.textContent = getText("noHomeowner");

  document.getElementById("exitTitle").textContent = getText("exitTitle");
  document.getElementById("exitText").textContent = getText("exitText");
  restartFromExit.textContent = getText("restartFromExit");

  document.getElementById("step2Title").textContent = getText("step2Title");
  document.getElementById("step2Text").textContent = getText("step2Text");
  document.getElementById("addressLabel").textContent = getText("addressLabel");
  addressInput.placeholder = getText("addressPlaceholder");

  document.getElementById("step3Title").textContent = getText("step3Title");
  document.getElementById("step3Text").textContent = getText("step3Text");
  document.getElementById("valueLabel").textContent = getText("valueLabel");
  propertyValueInput.placeholder = getText("valuePlaceholder");

  document.getElementById("step4Title").textContent = getText("step4Title");
  document.getElementById("step4Text").textContent = getText("step4Text");
  document.getElementById("mortgageLabel").textContent = getText("mortgageLabel");
  mortgageBalanceInput.placeholder = getText("mortgagePlaceholder");

  document.getElementById("step5Title").textContent = getText("step5Title");
  document.getElementById("step5Text").textContent = getText("step5Text");
  document.getElementById("nameLabel").textContent = getText("nameLabel");
  document.getElementById("emailLabel").textContent = getText("emailLabel");
  document.getElementById("phoneLabel").textContent = getText("phoneLabel");
  fullNameInput.placeholder = getText("namePlaceholder");
  emailInput.placeholder = getText("emailPlaceholder");
  phoneInput.placeholder = getText("phonePlaceholder");

  document.getElementById("verificationTitle").textContent = getText("verificationTitle");
  document.getElementById("verificationText").textContent = getText("verificationText");
  document.getElementById("verificationCodeLabel").textContent = getText("verificationCodeLabel");
  verificationCodeInput.placeholder = getText("verificationPlaceholder");
  verifyCodeBtn.textContent = getText("verifyCodeBtn");

  document.getElementById("resultTitle").textContent = getText("resultTitle");
  document.getElementById("resultText").textContent = getText("resultText");
  document.getElementById("resultAddressLabel").textContent = getText("resultAddressLabel");
  document.getElementById("resultValueLabel").textContent = getText("resultValueLabel");
  document.getElementById("resultMortgageLabel").textContent = getText("resultMortgageLabel");
  restartFunnel.textContent = getText("restartFunnel");

  backButtons.forEach((button) => {
    button.textContent = getText("back");
  });

  toStep3.textContent = getText("next");
  toStep4.textContent = getText("next");
  toStep5.textContent = getText("next");
  showResult.textContent = getText("showResult");

  const exitVisible = !document.getElementById("step-exit").classList.contains("hidden");
  const resultVisible = !document.getElementById("step-7").classList.contains("hidden");

  if (exitVisible) {
    progressText.textContent = getText("progressExited");
  } else if (resultVisible) {
    progressText.textContent = getText("progressComplete");
  } else {
    updateProgress(currentStep);
  }
}

yesHomeowner.addEventListener("click", () => {
  currentStep = 2;
  showStep("step-2");
  updateProgress(1);
});

noHomeowner.addEventListener("click", () => {
  showExitState();
});

restartFromExit.addEventListener("click", () => {
  resetFunnel();
});

toStep3.addEventListener("click", () => {
  if (!validateStep2()) return;

  currentStep = 3;
  showStep("step-3");
  updateProgress(2);
});

toStep4.addEventListener("click", () => {
  if (!validateStep3()) return;

  currentStep = 4;
  showStep("step-4");
  updateProgress(3);
});

toStep5.addEventListener("click", () => {
  if (!validateStep4()) return;

  currentStep = 5;
  showStep("step-5");
  updateProgress(4);
});

showResult.addEventListener("click", async () => {
  if (!validateStep5()) return;

  showResult.disabled = true;
  showResult.textContent = getText("sending");

  try {
    pendingLeadData = buildLeadPayload();

    await sendVerificationCode(pendingLeadData.email);

    if (verificationCodeInput) {
      verificationCodeInput.value = "";
    }

    currentStep = 6;
    showStep("step-6");
    updateProgress(5);
  } catch (error) {
    console.error(error);
    alert(getText("alertCodeSendError"));
  } finally {
    showResult.disabled = false;
    showResult.textContent = getText("showResult");
  }
});

verifyCodeBtn.addEventListener("click", async () => {
  const code = verificationCodeInput.value.trim();

  if (code === "") {
    alert(getText("alertCode"));
    return;
  }

  if (!isValidVerificationCode(code)) {
    alert(getText("alertCodeInvalid"));
    return;
  }

  if (!pendingLeadData) {
    alert(getText("alertSendError"));
    return;
  }

  verifyCodeBtn.disabled = true;
  verifyCodeBtn.textContent = getText("verifying");

  try {
    await verifyEmailCode(pendingLeadData.email, code);
    await sendLeadToBackend(pendingLeadData);
    showFinalResult(pendingLeadData);
  } catch (error) {
    console.error(error);
    alert(getText("alertCodeVerifyError"));
  } finally {
    verifyCodeBtn.disabled = false;
    verifyCodeBtn.textContent = getText("verifyCodeBtn");
  }
});

restartFunnel.addEventListener("click", () => {
  resetFunnel();
});

backButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const previousStep = Number(button.getAttribute("data-back"));
    currentStep = previousStep;
    showStep(`step-${previousStep}`);
    updateProgress(previousStep);
  });
});

langEnBtn.addEventListener("click", () => {
  applyLanguage("en");
});

langEsBtn.addEventListener("click", () => {
  applyLanguage("es");
});

showStep("step-1");
updateProgress(1);
applyLanguage("en");
/* ==========================================================================
   Stage 2 — Home Equity Options Comparison
   Extends CalcMyEquity with a final "Compare Your Home Equity Options"
   experience. Re-uses the borrower's existing inputs — no re-entry.
   All scenario assumptions live in ASSUMPTIONS below and are easy to change.
   ========================================================================== */

/* Centralized scenario assumptions / configuration. */
const ASSUMPTIONS = {
  baseRatePct: 7.5,            // default APR assumption (first mortgage / cash-out)
  defaultTermYears: 30,
  minRatePct: 3.0,
  maxRatePct: 15.0,
  cashOut: {
    maxLTV: 0.80,              // maximum loan-to-value for a cash-out refinance
    rateSpread: 0.00           // added on top of the base rate
  },
  heloc: {
    maxCLTV: 0.85,             // maximum combined loan-to-value
    rateSpread: 0.50,          // HELOC lines typically price above a first mortgage
    drawYears: 10,
    repayYears: 20,
    defaultDrawnPct: 0.50      // share of the credit limit assumed drawn
  },
  homeEquityLoan: {
    maxCLTV: 0.85,
    rateSpread: 0.75,
    defaultTermYears: 15
  },
  /* Credit-score scenario bands. rateAdj adjusts the assumed rate; ltvAdj
     mildly adjusts the maximum ratio. These are scenario assumptions, NOT
     underwriting rules. */
  creditBands: [
    { min: 740, label: "Excellent",    rateAdj: -0.25, ltvAdj:  0.02 },
    { min: 700, label: "Good",         rateAdj:  0.00, ltvAdj:  0.00 },
    { min: 640, label: "Fair",         rateAdj:  0.50, ltvAdj: -0.03 },
    { min: 0,   label: "Lower Credit", rateAdj:  1.25, ltvAdj: -0.06 }
  ]
};

/* Bilingual strings for the comparison screen. */
const compareTranslations = {
  en: {
    compareTitle: "Compare Your Home Equity Options",
    compareIntro: "Adjust the assumptions below to compare potential scenarios.",
    rateLabel: "Interest Rate (APR)",
    termLabel: "Loan Term",
    creditLabel: "Credit Score",
    creditHint: "Scenario estimate only \u2014 not an underwriting decision.",
    yourEquityLabel: "Your Estimated Home Equity",
    equityExplanation: "Based on your estimated home value minus your mortgage balance.",
    accessibleLabel: "Potential Accessible Equity",
    accessibleNote: "Potential accessible equity depends on product and qualification.",
    cashoutTitle: "Cash-Out Refinance",
    cashoutDesc: "Replace your existing mortgage with a larger new mortgage and potentially receive part of the difference in cash.",
    cashoutPotentialLabel: "Potential Cash You Could Receive",
    cashoutRateLabel: "Interest Rate (APR)",
    cashoutTermLabel: "Loan Term",
    cashoutNewMortgageLabel: "Estimated New Mortgage",
    cashoutPaymentLabel: "Estimated New Mortgage Payment",
    helocTitle: "Home Equity Line of Credit (HELOC)",
    helocDesc: "A revolving line of credit secured by your home equity that lets you draw funds when you need them.",
    helocPotentialLabel: "Potential Credit Limit",
    helocDrawnLabel: "Amount Drawn",
    helocRateLabel: "Interest Rate (APR)",
    helocDrawLabel: "Draw Period",
    helocRepayLabel: "Repayment Period",
    helocPaymentLabel: "Estimated Payment",
    helocFine: "Payment shown assumes interest-only payments during the draw period. A line of credit is not the same as a fixed installment loan.",
    heloanTitle: "Home Equity Loan",
    heloanDesc: "A separate loan secured by your property's equity that provides a lump sum while leaving your existing first mortgage in place.",
    heloanPotentialLabel: "Potential Loan Amount",
    heloanRateLabel: "Interest Rate (APR)",
    heloanTermLabel: "Loan Term",
    heloanPaymentLabel: "Estimated Monthly Payment",
    heloanTotalLabel: "Estimated Total Repayment",
    heloanFine: "Payment shown is for the new home equity loan only and does not include your existing first mortgage.",
    exploreBtn: "Explore This Option",
    ctaTitle: "Want to explore your options?",
    ctaText: "We already have your details \u2014 tell us you're interested and we'll help you understand the next step. The numbers above are estimates only.",
    ctaButton: "Get a Personalized Quote",
    ctaConfirm: "Thanks! Your information is already on file, so no re-entry is needed. A specialist can follow up about your options.",
    disclosureText: "These calculations are estimates for informational purposes only and are not a loan offer or approval. Actual rates, terms, payments, available equity and eligibility may vary based on credit profile, property value, existing liens, lender requirements and underwriting.",
    backToResult: "Back to My Result",
    compareOptions: "Compare My Options",
    bandExcellent: "Excellent",
    bandGood: "Good",
    bandFair: "Fair",
    bandLowerCredit: "Lower Credit",
    compareStatus: "Some options show $0 because the existing mortgage is at or above the assumed maximum loan-to-value. Equity above that limit is real, but it may not be accessible through these products at these assumptions.",
    assumptionsNote: "Assumptions used: up to 80% loan-to-value for a cash-out refinance and 85% combined loan-to-value for a HELOC or home equity loan. Actual lender limits may differ."
  },
  es: {
    compareTitle: "Compara tus opciones de plusval\u00eda",
    compareIntro: "Ajusta los supuestos a continuaci\u00f3n para comparar escenarios potenciales.",
    rateLabel: "Tasa de inter\u00e9s (APR)",
    termLabel: "Plazo del pr\u00e9stamo",
    creditLabel: "Puntaje de cr\u00e9dito",
    creditHint: "Solo estimaci\u00f3n de escenario \u2014 no es una decisi\u00f3n de aprobaci\u00f3n.",
    yourEquityLabel: "Tu plusval\u00eda estimada",
    equityExplanation: "Seg\u00fan el valor estimado de tu casa menos el saldo de tu hipoteca.",
    accessibleLabel: "Plusval\u00eda potencialmente accesible",
    accessibleNote: "La plusval\u00eda potencialmente accesible depende del producto y de la calificaci\u00f3n.",
    cashoutTitle: "Refinanciamiento con retiro de efectivo",
    cashoutDesc: "Reemplaza tu hipoteca actual con una hipoteca nueva m\u00e1s grande y podr\u00edas recibir parte de la diferencia en efectivo.",
    cashoutPotentialLabel: "Efectivo potencial que podr\u00edas recibir",
    cashoutRateLabel: "Tasa de inter\u00e9s (APR)",
    cashoutTermLabel: "Plazo del pr\u00e9stamo",
    cashoutNewMortgageLabel: "Nueva hipoteca estimada",
    cashoutPaymentLabel: "Pago estimado de la nueva hipoteca",
    helocTitle: "L\u00ednea de cr\u00e9dito con garant\u00eda hipotecaria (HELOC)",
    helocDesc: "Una l\u00ednea de cr\u00e9dito revolvente garantizada por la plusval\u00eda de tu casa que te permite disponer de fondos cuando los necesites.",
    helocPotentialLabel: "L\u00edmite de cr\u00e9dito potencial",
    helocDrawnLabel: "Monto dispuesto",
    helocRateLabel: "Tasa de inter\u00e9s (APR)",
    helocDrawLabel: "Per\u00edodo de disposici\u00f3n",
    helocRepayLabel: "Per\u00edodo de pago",
    helocPaymentLabel: "Pago estimado",
    helocFine: "El pago mostrado asume pagos de solo intereses durante el per\u00edodo de disposici\u00f3n. Una l\u00ednea de cr\u00e9dito no es lo mismo que un pr\u00e9stamo fijo a plazos.",
    heloanTitle: "Pr\u00e9stamo con garant\u00eda hipotecaria",
    heloanDesc: "Un pr\u00e9stamo separado garantizado por la plusval\u00eda de tu propiedad que entrega un monto fijo y mantiene tu primera hipoteca actual.",
    heloanPotentialLabel: "Monto de pr\u00e9stamo potencial",
    heloanRateLabel: "Tasa de inter\u00e9s (APR)",
    heloanTermLabel: "Plazo del pr\u00e9stamo",
    heloanPaymentLabel: "Pago mensual estimado",
    heloanTotalLabel: "Pago total estimado",
    heloanFine: "El pago mostrado corresponde solo al nuevo pr\u00e9stamo con garant\u00eda hipotecaria y no incluye tu primera hipoteca actual.",
    exploreBtn: "Explorar esta opci\u00f3n",
    ctaTitle: "\u00bfQuieres explorar tus opciones?",
    ctaText: "Ya tenemos tus datos \u2014 dinos que te interesa y te ayudamos a entender el siguiente paso. Los n\u00fameros de arriba son solo estimados.",
    ctaButton: "Obtener una cotizaci\u00f3n personalizada",
    ctaConfirm: "\u00a1Gracias! Tu informaci\u00f3n ya est\u00e1 registrada, no necesitas volver a ingresarla. Un especialista puede dar seguimiento a tus opciones.",
    disclosureText: "Estos c\u00e1lculos son estimados solo con fines informativos y no constituyen una oferta ni aprobaci\u00f3n de pr\u00e9stamo. Las tasas, plazos, pagos, plusval\u00eda disponible y elegibilidad reales pueden variar seg\u00fan el perfil de cr\u00e9dito, el valor de la propiedad, los grav\u00e1menes existentes, los requisitos del prestamista y la suscripci\u00f3n.",
    backToResult: "Volver a mi resultado",
    compareOptions: "Comparar mis opciones",
    bandExcellent: "Excelente",
    bandGood: "Bueno",
    bandFair: "Regular",
    bandLowerCredit: "Cr\u00e9dito bajo",
    compareStatus: "Algunas opciones muestran $0 porque la hipoteca actual est\u00e1 en o por encima del m\u00e1ximo de relaci\u00f3n pr\u00e9stamo-valor asumido. Esa plusval\u00eda existe, pero puede no ser accesible con estos productos bajo estos supuestos.",
    assumptionsNote: "Supuestos: hasta 80% de relaci\u00f3n pr\u00e9stamo-valor para refinanciamiento con retiro de efectivo y 85% de relaci\u00f3n combinada para HELOC o pr\u00e9stamo con garant\u00eda hipotecaria. Los l\u00edmites reales del prestamista pueden variar."
  }
};

function ct(key) {
  const table = compareTranslations[currentLanguage] || compareTranslations.en;
  return table[key] || key;
}

function setCompareText(id, key) {
  const el = document.getElementById(id);
  if (el) el.textContent = ct(key);
}

function getCreditBandLabel(band) {
  return ct("band" + band.label.replace(/\s+/g, ""));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/* Parse a formatted dollar string like "$480,000" back into a number. */
function parseMoney(text) {
  if (!text) return 0;
  const cleaned = String(text).replace(/[^0-9.-]/g, "");
  const n = Number(cleaned);
  return isNaN(n) ? 0 : n;
}

function creditBandFor(score) {
  const bands = ASSUMPTIONS.creditBands;
  for (let i = 0; i < bands.length; i++) {
    if (score >= bands[i].min) return bands[i];
  }
  return bands[bands.length - 1];
}

/* Standard amortized (principal + interest) monthly payment. */
function amortizedPayment(principal, annualRatePct, years) {
  if (principal <= 0 || years <= 0) return 0;
  const monthlyRate = annualRatePct / 100 / 12;
  const n = years * 12;
  if (monthlyRate === 0) return principal / n;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
}

function formatRate(value) {
  return Number(value).toFixed(2) + "%";
}

const compareOptionsBtn = document.getElementById("compareOptions");
const backToResultBtn = document.getElementById("backToResult");
const rateSlider = document.getElementById("rateSlider");
const termSlider = document.getElementById("termSlider");
const creditSlider = document.getElementById("creditSlider");
const helocDrawnSlider = document.getElementById("helocDrawnSlider");
const funnelCard = document.querySelector(".funnel-card");

let scenario = null;

function applyComparisonLanguage() {
  setCompareText("compareTitle", "compareTitle");
  setCompareText("compareIntro", "compareIntro");
  setCompareText("rateLabel", "rateLabel");
  setCompareText("termLabel", "termLabel");
  setCompareText("creditLabel", "creditLabel");
  setCompareText("creditHint", "creditHint");
  setCompareText("yourEquityLabel", "yourEquityLabel");
  setCompareText("equityExplanation", "equityExplanation");
  setCompareText("accessibleLabel", "accessibleLabel");
  setCompareText("accessibleNote", "accessibleNote");
  setCompareText("assumptionsNote", "assumptionsNote");
  setCompareText("cashoutTitle", "cashoutTitle");
  setCompareText("cashoutDesc", "cashoutDesc");
  setCompareText("cashoutPotentialLabel", "cashoutPotentialLabel");
  setCompareText("cashoutRateLabel", "cashoutRateLabel");
  setCompareText("cashoutTermLabel", "cashoutTermLabel");
  setCompareText("cashoutNewMortgageLabel", "cashoutNewMortgageLabel");
  setCompareText("cashoutPaymentLabel", "cashoutPaymentLabel");
  setCompareText("helocTitle", "helocTitle");
  setCompareText("helocDesc", "helocDesc");
  setCompareText("helocPotentialLabel", "helocPotentialLabel");
  setCompareText("helocDrawnLabel", "helocDrawnLabel");
  setCompareText("helocRateLabel", "helocRateLabel");
  setCompareText("helocDrawLabel", "helocDrawLabel");
  setCompareText("helocRepayLabel", "helocRepayLabel");
  setCompareText("helocPaymentLabel", "helocPaymentLabel");
  setCompareText("helocFine", "helocFine");
  setCompareText("heloanTitle", "heloanTitle");
  setCompareText("heloanDesc", "heloanDesc");
  setCompareText("heloanPotentialLabel", "heloanPotentialLabel");
  setCompareText("heloanRateLabel", "heloanRateLabel");
  setCompareText("heloanTermLabel", "heloanTermLabel");
  setCompareText("heloanPaymentLabel", "heloanPaymentLabel");
  setCompareText("heloanTotalLabel", "heloanTotalLabel");
  setCompareText("heloanFine", "heloanFine");
  document.querySelectorAll(".product-btn").forEach((btn) => (btn.textContent = ct("exploreBtn")));
  setCompareText("ctaTitle", "ctaTitle");
  setCompareText("ctaText", "ctaText");
  setCompareText("ctaButton", "ctaButton");
  setCompareText("ctaConfirm", "ctaConfirm");
  setCompareText("disclosureText", "disclosureText");
  setCompareText("backToResult", "backToResult");
  setCompareText("compareOptions", "compareOptions");
  if (scenario) updateComparison();
}

function openComparison() {
  /* Carry over the figures the borrower already saw on the result screen.
     This guarantees the comparison uses the SAME equity we already calculated
     instead of ever showing $0. Raw inputs are used only as a fallback. */
  let propertyValue = parseMoney(resultValue.textContent);
  let mortgageBalance = parseMoney(resultMortgage.textContent);
  let equity = parseMoney(equityResult.textContent);

  if (!propertyValue) propertyValue = Number(propertyValueInput.value) || 0;
  if (!mortgageBalance) mortgageBalance = Number(mortgageBalanceInput.value) || 0;
  if (!equity) equity = Math.max(0, propertyValue - mortgageBalance);

  scenario = {
    propertyValue: propertyValue,
    mortgageBalance: mortgageBalance,
    equity: equity
  };

  /* Reset sliders to documented defaults each time the screen opens. */
  rateSlider.value = String(ASSUMPTIONS.baseRatePct);
  termSlider.value = String(ASSUMPTIONS.defaultTermYears);
  creditSlider.value = "720";
  helocDrawnSlider.value = String(ASSUMPTIONS.heloc.defaultDrawnPct * 100);

  const confirmEl = document.getElementById("ctaConfirm");
  if (confirmEl) confirmEl.classList.add("hidden");

  if (funnelCard) funnelCard.classList.add("comparing");
  showStep("step-8");
  progressFill.style.width = "100%";
  progressText.textContent = getText("progressComplete");
  updateComparison();
}

function updateComparison() {
  if (!scenario) return;

  const rateInput = Number(rateSlider.value);
  const term = Number(termSlider.value);
  const creditScore = Number(creditSlider.value);
  const band = creditBandFor(creditScore);

  /* Product maximum ratios, mildly adjusted by credit band, then clamped. */
  const cashOutLTV = clamp(ASSUMPTIONS.cashOut.maxLTV + band.ltvAdj, 0.60, 0.90);
  const helocCLTV = clamp(ASSUMPTIONS.heloc.maxCLTV + band.ltvAdj, 0.60, 0.90);
  const heloanCLTV = clamp(ASSUMPTIONS.homeEquityLoan.maxCLTV + band.ltvAdj, 0.60, 0.90);

  const value = scenario.propertyValue;
  const balance = scenario.mortgageBalance;

  /* --- Cash-Out Refinance --- */
  const cashOutRate = clamp(
    rateInput + band.rateAdj + ASSUMPTIONS.cashOut.rateSpread,
    ASSUMPTIONS.minRatePct, ASSUMPTIONS.maxRatePct
  );
  const maxNewMortgage = Math.max(0, value * cashOutLTV);
  const cashOutAmount = Math.max(0, maxNewMortgage - balance);
  /* Payment is on the ENTIRE replacement mortgage, not just the cash received. */
  const cashOutPayment = amortizedPayment(maxNewMortgage, cashOutRate, term);

  /* --- HELOC --- */
  const helocRate = clamp(
    rateInput + band.rateAdj + ASSUMPTIONS.heloc.rateSpread,
    ASSUMPTIONS.minRatePct, ASSUMPTIONS.maxRatePct
  );
  const helocLimit = Math.max(0, value * helocCLTV - balance);
  const drawnPct = Number(helocDrawnSlider.value) / 100;
  const amountDrawn = helocLimit * drawnPct;
  /* Draw-period payment = interest-only on the amount actually drawn. */
  const helocPayment = amountDrawn * (helocRate / 100 / 12);

  /* --- Home Equity Loan (second lien; first mortgage stays put) --- */
  const heloanRate = clamp(
    rateInput + band.rateAdj + ASSUMPTIONS.homeEquityLoan.rateSpread,
    ASSUMPTIONS.minRatePct, ASSUMPTIONS.maxRatePct
  );
  const heloanAmount = Math.max(0, value * heloanCLTV - balance);
  const heloanTerm = ASSUMPTIONS.homeEquityLoan.defaultTermYears;
  const heloanPayment = amortizedPayment(heloanAmount, heloanRate, heloanTerm);
  const heloanTotal = heloanPayment * heloanTerm * 12;

  /* Potential accessible equity = best case across the three products. */
  const accessible = Math.max(cashOutAmount, helocLimit, heloanAmount);

  /* Explain any $0 results instead of silently showing zeros. */
  const statusEl = document.getElementById("compareStatus");
  if (statusEl) {
    const anyZero = cashOutAmount <= 0 || helocLimit <= 0 || heloanAmount <= 0;
    if (anyZero) {
      statusEl.textContent = ct("compareStatus");
      statusEl.classList.remove("hidden");
    } else {
      statusEl.classList.add("hidden");
    }
  }

  /* --- Scenario control readouts --- */
  document.getElementById("rateValue").textContent = formatRate(rateInput);
  document.getElementById("termValue").textContent = term + " yr";
  document.getElementById("creditValue").textContent = creditScore + " (" + getCreditBandLabel(band) + ")";

  /* --- Equity block --- */
  document.getElementById("compareEquityValue").textContent = formatCurrency(scenario.equity);
  document.getElementById("accessibleEquityValue").textContent = formatCurrency(accessible);

  /* --- Cash-Out card --- */
  document.getElementById("cashoutCash").textContent = formatCurrency(cashOutAmount);
  document.getElementById("cashoutRate").textContent = formatRate(cashOutRate);
  document.getElementById("cashoutTerm").textContent = term + " yr";
  document.getElementById("cashoutNewMortgage").textContent = formatCurrency(maxNewMortgage);
  document.getElementById("cashoutPayment").textContent = formatCurrency(cashOutPayment) + "/mo";

  /* --- HELOC card --- */
  document.getElementById("helocLimit").textContent = formatCurrency(helocLimit);
  document.getElementById("helocRate").textContent = formatRate(helocRate);
  document.getElementById("helocDraw").textContent = ASSUMPTIONS.heloc.drawYears + " yr";
  document.getElementById("helocRepay").textContent = ASSUMPTIONS.heloc.repayYears + " yr";
  document.getElementById("helocDrawnValue").textContent = Math.round(drawnPct * 100) + "%";
  document.getElementById("helocPayment").textContent = formatCurrency(helocPayment) + "/mo";

  /* --- Home Equity Loan card --- */
  document.getElementById("heloanAmount").textContent = formatCurrency(heloanAmount);
  document.getElementById("heloanRate").textContent = formatRate(heloanRate);
  document.getElementById("heloanTerm").textContent = heloanTerm + " yr";
  document.getElementById("heloanPayment").textContent = formatCurrency(heloanPayment) + "/mo";
  document.getElementById("heloanTotal").textContent = formatCurrency(heloanTotal);
}

/* --- Wiring --- */
if (compareOptionsBtn) {
  compareOptionsBtn.addEventListener("click", openComparison);
}

if (backToResultBtn) {
  backToResultBtn.addEventListener("click", () => {
    if (funnelCard) funnelCard.classList.remove("comparing");
    showStep("step-7");
    progressFill.style.width = "100%";
    progressText.textContent = getText("progressComplete");
  });
}

[rateSlider, termSlider, creditSlider, helocDrawnSlider].forEach((slider) => {
  if (slider) slider.addEventListener("input", updateComparison);
});

document.querySelectorAll(".product-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const cta = document.querySelector(".comparison-cta");
    if (cta) cta.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

const ctaButtonEl = document.getElementById("ctaButton");
if (ctaButtonEl) {
  ctaButtonEl.addEventListener("click", () => {
    const confirmEl = document.getElementById("ctaConfirm");
    if (confirmEl) confirmEl.classList.remove("hidden");
  });
}

/* Keep the comparison screen in sync with the language toggle. */
if (typeof langEnBtn !== "undefined" && langEnBtn) {
  langEnBtn.addEventListener("click", applyComparisonLanguage);
}
if (typeof langEsBtn !== "undefined" && langEsBtn) {
  langEsBtn.addEventListener("click", applyComparisonLanguage);
}

/* If the user restarts from the result screen, leave comparison mode. */
const restartBtnForCompare = document.getElementById("restartFunnel");
if (restartBtnForCompare) {
  restartBtnForCompare.addEventListener("click", () => {
    if (funnelCard) funnelCard.classList.remove("comparing");
  });
}

/* Initial pass so the first screen load has correct labels. */
applyComparisonLanguage();
