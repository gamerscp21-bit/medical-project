/* ============================================
   HealthSync — Login Page Scripts
   ============================================ */

let selectedRole = "patient";

function selectRole(role) {
  selectedRole = role;
  document
    .querySelectorAll(".role-card")
    .forEach((card) => card.classList.remove("active"));
  const selected = document.getElementById(`role-${role}`);
  selected.classList.add("active");
  selected.classList.remove("hs-liked");
  void selected.offsetWidth;
  selected.classList.add("hs-liked");
}

function goToStep(step) {
  const steps = ["step-1", "step-2", "step-staff", "step-success"];
  steps.forEach((s) => {
    const el = document.getElementById(s);
    if (el) el.classList.add("hidden");
  });

  if (typeof step === "string") {
    document.getElementById(`step-${step}`).classList.remove("hidden");
  } else {
    document.getElementById(`step-${step}`).classList.remove("hidden");
  }
}

function handleVerification() {
  if (selectedRole === "staff") {
    goToStep("staff");
  } else if (selectedRole === "lab" || selectedRole === "pharmacy") {
    // Placeholder logic for other entities
    document.getElementById("success-msg").textContent =
      "Organization verification is required. Our team will contact you shortly.";
    goToStep("success");
  } else {
    // Patient flow — redirect straight to Dashboard
    window.location.href = "dashboard.html";
  }
}

document.getElementById("resend-otp")?.addEventListener("click", () => {
  HealthSyncApp.toast("A new OTP code has been sent to your phone");
});

// Social login demo
document.querySelectorAll("button img[alt='Google'], button img[alt='Facebook']").forEach((img) => {
  img.closest("button")?.addEventListener("click", () => {
    HealthSyncApp.toast(`Signing in with ${img.alt}...`);
    setTimeout(() => { window.location.href = "dashboard.html"; }, 1200);
  });
});

// Micro-interaction for OTP inputs — auto-focus next box on digit entry
const otpInputs = document.querySelectorAll(".otp-input");
otpInputs.forEach((input, index) => {
  // Prevent non-numeric key presses
  input.addEventListener("keypress", (e) => {
    if (e.key < "0" || e.key > "9") {
      e.preventDefault();
    }
  });

  input.addEventListener("input", (e) => {
    // Keep only numbers
    const value = e.target.value.replace(/[^0-9]/g, "");
    e.target.value = value;

    if (value.length === 1 && index < otpInputs.length - 1) {
      otpInputs[index + 1].focus();
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace") {
      if (!e.target.value && index > 0) {
        otpInputs[index - 1].value = "";
        otpInputs[index - 1].focus();
      } else {
        e.target.value = "";
      }
      e.preventDefault(); // Prevent double trigger
    }
  });

  // Paste handling
  input.addEventListener("paste", (e) => {
    e.preventDefault();
    const pastedData = (e.clipboardData || window.clipboardData).getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      otpInputs.forEach((inp, idx) => {
        inp.value = pastedData[idx];
      });
      otpInputs[5].focus();
    }
  });
});

// Initialize first role
selectRole("patient");
