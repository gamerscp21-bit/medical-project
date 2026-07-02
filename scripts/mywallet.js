/* ============================================
   HealthSync — My Wallet Page Scripts
   ============================================ */

// Simple micro-interactions — subtle ripple effect on buttons
document.querySelectorAll("button, .cursor-pointer").forEach((el) => {
  el.addEventListener("click", () => {
    const originalColor = el.style.backgroundColor;
    el.style.backgroundColor = "rgba(0, 101, 101, 0.1)";
    setTimeout(() => {
      el.style.backgroundColor = originalColor;
    }, 200);
  });
});
