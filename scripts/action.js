/* ============================================
   HealthSync — Action Page Scripts
   ============================================ */

// Drawer toggle
const menuBtn = document.querySelector("header button");
const drawer = document.getElementById("drawer");
let drawerOpen = false;

menuBtn.addEventListener("click", () => {
  drawerOpen = !drawerOpen;
  if (drawerOpen) {
    drawer.classList.remove("-translate-x-full");
    drawer.classList.add("translate-x-0", "md:block");
  } else {
    drawer.classList.add("-translate-x-full");
    drawer.classList.remove("translate-x-0");
  }
});

// Close drawer when clicking outside
document.addEventListener("click", (e) => {
  if (
    drawerOpen &&
    !drawer.contains(e.target) &&
    !menuBtn.contains(e.target)
  ) {
    drawerOpen = false;
    drawer.classList.add("-translate-x-full");
  }
});

// Success simulation on Confirm & Pay button click
const confirmBtn = document.querySelector(
  "button.bg-primary.text-on-primary.font-bold"
);
if (confirmBtn) {
  confirmBtn.addEventListener("click", () => {
    confirmBtn.innerHTML =
      '<span class="material-symbols-outlined animate-spin" data-icon="progress_activity">progress_activity</span> Processing...';
    setTimeout(() => {
      confirmBtn.innerHTML =
        '<span class="material-symbols-outlined" data-icon="check_circle">check_circle</span> Payment Successful';
      confirmBtn.classList.remove("bg-primary");
      confirmBtn.classList.add("bg-secondary");
    }, 2000);
  });
}
