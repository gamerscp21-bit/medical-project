/* ============================================
   HealthSync — Login Page Scripts
   ============================================ */

let selectedRole = "patient";

function selectRole(role) {
  selectedRole = role;
  // Clear all active classes
  document
    .querySelectorAll(".role-card")
    .forEach((card) => card.classList.remove("active"));
  // Add active class to selected
  document.getElementById(`role-${role}`).classList.add("active");
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

// Initialize first role
selectRole("patient");

// Micro-interaction for OTP inputs
const otpInputs = document.querySelectorAll("#step-2 input");
otpInputs.forEach((input, index) => {
  input.addEventListener("input", (e) => {
    if (e.target.value.length === 1 && index < otpInputs.length - 1) {
      otpInputs[index + 1].focus();
    }
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      otpInputs[index - 1].focus();
    }
  });
});
