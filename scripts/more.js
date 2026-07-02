/* ============================================
   HealthSync — More Page Scripts
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  // Log interactions for development/debugging
  const menuLinks = document.querySelectorAll("a, button");
  menuLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      // Only prevent default for placeholder links
      if (link.getAttribute("href") === "#") {
        e.preventDefault();
        console.log("Interaction detected on:", link.innerText.trim());
      }
    });
  });

  // Logout behavior redirect
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
});
