/* ============================================
   HealthSync — Dashboard Page Scripts
   ============================================ */

// Micro-interaction: Update heart rate randomly for 'Live' feel
const hrDisplay = document.querySelector(
  ".col-span-12:nth-child(1) .text-\\[56px\\]"
);
if (hrDisplay) {
  setInterval(() => {
    const currentHr = parseInt(hrDisplay.innerText);
    const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
    hrDisplay.innerText = currentHr + variation;
  }, 3000);
}

// Toggle Dark Mode (Optional logic)
function toggleDarkMode() {
  document.documentElement.classList.toggle("dark");
}
