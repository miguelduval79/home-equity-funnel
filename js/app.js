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
const restartFunnel = document.getElementById("restartFunnel");

const backButtons = document.querySelectorAll(".back-btn");

const addressInput = document.getElementById("address");
const propertyValueInput = document.getElementById("propertyValue");
const mortgageBalanceInput = document.getElementById("mortgageBalance");
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");

const equityResult = document.getElementById("equityResult");
const resultAddress = document.getElementById("resultAddress");
const resultValue = document.getElementById("resultValue");
const resultMortgage = document.getElementById("resultMortgage");

const langEnBtn = document.getElementById("lang-en");
const langEsBtn = document.getElementById("lang-es");

const BACKEND_URL = "http://127.0.0.1:5000/submit-lead";

let currentStep = 1;
const totalSteps = 5;
let currentLanguage = "en";

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
    phonePlaceholder: "(305) 555-1234",

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
    alertPhone: "Please enter your phone number.",
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
    phonePlaceholder: "(305) 555-1234",

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
    alertPhone: "Por favor ingresa tu número de teléfono.",
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

function resetFunnel() {
  currentStep = 1;

  addressInput.value = "";
  propertyValueInput.value = "";
  mortgageBalanceInput.value = "";
  fullNameInput.value = "";
  emailInput.value = "";
  phoneInput.value = "";

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

  if (phoneInput.value.trim() === "") {
    alert(getText("alertPhone"));
    return false;
  }

  return true;
}

function calculateEquity() {
  const propertyValue = Number(propertyValueInput.value);
  const mortgageBalance = Number(mortgageBalanceInput.value);
  return propertyValue - mortgageBalance;
}

async function sendLeadToBackend() {
  const equity = calculateEquity();

  const payload = {
    full_name: fullNameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    property_address: addressInput.value.trim(),
    estimated_property_value: formatCurrency(propertyValueInput.value),
    current_mortgage_balance: formatCurrency(mortgageBalanceInput.value),
    estimated_equity: formatCurrency(equity),
    language: currentLanguage === "en" ? "English" : "Spanish"
  };

  const response = await fetch(BACKEND_URL, {
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
  const resultVisible = !document.getElementById("step-6").classList.contains("hidden");

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
    const leadData = await sendLeadToBackend();

    equityResult.textContent = leadData.estimated_equity;
    resultAddress.textContent = leadData.property_address;
    resultValue.textContent = leadData.estimated_property_value;
    resultMortgage.textContent = leadData.current_mortgage_balance;

    currentStep = 6;
    showStep("step-6");
    progressFill.style.width = "100%";
    progressText.textContent = getText("progressComplete");
  } catch (error) {
    console.error(error);
    alert(getText("alertSendError"));
  } finally {
    showResult.disabled = false;
    showResult.textContent = getText("showResult");
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