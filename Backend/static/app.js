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