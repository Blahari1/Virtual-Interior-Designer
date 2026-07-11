/* ==========================================
   Virtual Interior Designer
   Login Authentication
========================================== */

<<<<<<< HEAD:frontend/js/login.js
const API_URL = "https://virtual-interior-designer-vqfn.onrender.com";
=======
const API_URL = "/api/auth";
>>>>>>> d742568 (Deploy full stack on Render):backend/public/js/login.js

/*const API_URL = "http://localhost:5001/api/auth";*/
// Change this to your Render/Railway URL after deployment
// Example:
// const API_URL = "https://your-backend.onrender.com/api/auth";

/* ==========================================
   Elements
========================================== */

const authForm = document.getElementById("authForm");

const emailStep = document.getElementById("emailStep");
const passwordStep = document.getElementById("passwordStep");
const otpStep = document.getElementById("otpStep");
const registerStep = document.getElementById("registerStep");

const emailInput = document.getElementById("email");

const existingEmail = document.getElementById("existingEmail");
const otpEmail = document.getElementById("otpEmail");
const registerEmail = document.getElementById("registerEmail");

const loginPassword = document.getElementById("loginPassword");

const otpInput = document.getElementById("otp");

const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");

const continueBtn = document.getElementById("continueBtn");
const loginBtn = document.getElementById("loginBtn");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const registerBtn = document.getElementById("registerBtn");
const resendOtpBtn = document.getElementById("resendOtpBtn");

const backToEmail1 = document.getElementById("backToEmail1");
const backToEmail2 = document.getElementById("backToEmail2");
const backToOtp = document.getElementById("backToOtp");

const message = document.getElementById("message");
const loader = document.getElementById("loader");

/* ==========================================
   Theme
========================================== */

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
  document.body.classList.add("light");
}

/* ==========================================
   Utility Functions
========================================== */

function hideAllSteps() {
  emailStep.classList.remove("active");
  passwordStep.classList.remove("active");
  otpStep.classList.remove("active");
  registerStep.classList.remove("active");
}

function showStep(step) {
  hideAllSteps();

  step.classList.add("active");
}

function showLoader() {
  loader.classList.remove("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}

function showMessage(text, type = "success") {
  message.textContent = text;

  message.className = "message " + type;
}

function clearMessage() {
  message.textContent = "";

  message.className = "message";
}
/* ==========================================
   Check Email
========================================== */

authForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  clearMessage();

  const email = emailInput.value.trim().toLowerCase();

  if (!email) {
    showMessage("Please enter your email.", "error");

    return;
  }

  showLoader();

  try {
    const response = await fetch(`${API_URL}/check-email`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
      }),
    });

    const data = await response.json();

    hideLoader();

    if (!data.success) {
      showMessage(data.message, "error");

      return;
    }

    if (data.exists) {
      existingEmail.value = email;

      showStep(passwordStep);
    } else {
      await sendOTP(email);
    }
  } catch (error) {
    hideLoader();

    showMessage("Unable to connect to server.", "error");

    console.error(error);
  }
});

/* ==========================================
   Send OTP
========================================== */

async function sendOTP(email) {
  clearMessage();

  showLoader();

  try {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 180000); // 3 minutes

    const response = await fetch(`${API_URL}/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data = await response.json();

    hideLoader();

    if (!data.success) {
      showMessage(data.message, "error");

      return;
    }

    otpEmail.value = email;

    registerEmail.value = email;

    showStep(otpStep);

    showMessage("OTP has been sent to your email.", "success");
  } catch (error) {
    hideLoader();

    showMessage("Failed to send OTP.", "error");

    console.error(error);
  }
}

/* ==========================================
   Resend OTP
========================================== */

resendOtpBtn.addEventListener("click", () => {
  sendOTP(otpEmail.value);
});
/* ==========================================
   Verify OTP
========================================== */

verifyOtpBtn.addEventListener("click", async () => {
  clearMessage();

  const email = otpEmail.value;

  const otp = otpInput.value.trim();

  if (!otp) {
    showMessage("Please enter the OTP.", "error");

    return;
  }

  showLoader();

  try {
    const response = await fetch(`${API_URL}/verify-otp`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,

        otp,
      }),
    });

    const data = await response.json();

    hideLoader();

    if (!data.success) {
      showMessage(data.message, "error");

      return;
    }

    showStep(registerStep);

    showMessage("Email verified successfully.", "success");
  } catch (error) {
    hideLoader();

    console.error(error);

    showMessage("Unable to verify OTP.", "error");
  }
});

/* ==========================================
   Register User
========================================== */

registerBtn.addEventListener("click", async () => {
  clearMessage();

  const email = registerEmail.value;

  const password = newPassword.value.trim();

  const confirmPassword = document
    .getElementById("confirmPassword")
    .value.trim();

  if (!password || !confirmPassword) {
    showMessage("Please fill all fields.", "error");

    return;
  }

  if (password !== confirmPassword) {
    showMessage("Passwords do not match.", "error");

    return;
  }

  showLoader();

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,

        password,

        confirmPassword,
      }),
    });

    const data = await response.json();

    hideLoader();

    if (!data.success) {
      showMessage(data.message, "error");

      return;
    }

    localStorage.setItem("token", data.token);

    localStorage.setItem("user", JSON.stringify(data.user));

    showMessage("Account created successfully.", "success");

    setTimeout(() => {
      window.location.href = "designer.html";
    }, 1000);
  } catch (error) {
    hideLoader();

    console.error(error);

    showMessage("Registration failed.", "error");
  }
});
/* ==========================================
   Existing User Login
========================================== */

loginBtn.addEventListener("click", async () => {
  clearMessage();

  const email = existingEmail.value;

  const password = loginPassword.value.trim();

  if (!password) {
    showMessage("Please enter your password.", "error");

    return;
  }

  showLoader();

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,

        password,
      }),
    });

    const data = await response.json();

    hideLoader();

    if (!data.success) {
      showMessage(data.message, "error");

      return;
    }

    localStorage.setItem("token", data.token);

    localStorage.setItem("user", JSON.stringify(data.user));

    showMessage("Login Successful.", "success");

    setTimeout(() => {
      window.location.href = "designer.html";
    }, 800);
  } catch (error) {
    hideLoader();

    console.error(error);

    showMessage("Unable to login.", "error");
  }
});

/* ==========================================
   Back Buttons
========================================== */

backToEmail1.addEventListener("click", () => {
  loginPassword.value = "";

  showStep(emailStep);
});

backToEmail2.addEventListener("click", () => {
  otpInput.value = "";

  showStep(emailStep);
});

backToOtp.addEventListener("click", () => {
  newPassword.value = "";

  confirmPassword.value = "";

  showStep(otpStep);
});

/* ==========================================
   Already Logged In?
========================================== */

window.addEventListener("load", () => {
  const token = localStorage.getItem("token");

  if (token) {
    window.location.href = "designer.html";
  }
});

/* ==========================================
   Helper Functions
========================================== */

function logout() {
  localStorage.removeItem("token");

  localStorage.removeItem("user");

  window.location.href = "index.html";
}
window.addEventListener("load", () => {
  const token = localStorage.getItem("token");

  if (token) {
    window.location.href = "designer.html";
  }
});
