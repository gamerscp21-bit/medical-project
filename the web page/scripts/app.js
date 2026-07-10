/* ============================================
   HealthSync — Shared App Utilities
   Global wiring for navigation, toasts, logout
   ============================================ */

const HealthSyncApp = {
  toast(message, type = "success") {
    let toast = document.querySelector(".toast-container");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast-container";
      document.body.appendChild(toast);
    }
    const icon =
      type === "error"
        ? "error"
        : type === "info"
          ? "info"
          : "check_circle";
    const color =
      type === "error" ? "text-error" : type === "info" ? "text-primary" : "text-secondary";
    toast.innerHTML = `
      <span class="material-symbols-outlined ${color} text-lg" style="font-variation-settings: 'FILL' 1;">${icon}</span>
      <span>${message}</span>
    `;
    setTimeout(() => toast.classList.add("show"), 50);
    setTimeout(() => toast.classList.remove("show"), 2800);
  },

  logout() {
    if (confirm("Are you sure you want to logout from HealthSync?")) {
      document.body.classList.add("hs-page-exit");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 220);
    }
  },

  copyText(text, successMsg = "Copied to clipboard!") {
    navigator.clipboard
      .writeText(text)
      .then(() => this.toast(successMsg))
      .catch(() => this.toast(successMsg, "info"));
  },

  navigate(href) {
    document.body.classList.add("hs-page-exit");
    setTimeout(() => {
      window.location.href = href;
    }, 220);
  },

  dismissAlert(el) {
    const banner = el.closest(".hs-alert-banner, .bg-error-container");
    if (!banner) return;
    banner.style.transition = "opacity 0.35s ease, transform 0.35s ease, max-height 0.4s ease";
    banner.style.opacity = "0";
    banner.style.transform = "translateX(-20px)";
    banner.style.maxHeight = banner.offsetHeight + "px";
    setTimeout(() => {
      banner.style.maxHeight = "0";
      banner.style.padding = "0";
      banner.style.margin = "0";
      banner.style.overflow = "hidden";
    }, 350);
    setTimeout(() => banner.remove(), 750);
    this.toast("Alert dismissed");
  },

  initGlobal() {
    this.wireNotificationButtons();
    this.wireLogoutButtons();
  },

  wireNotificationButtons() {
    document.querySelectorAll("header button, header a").forEach((btn) => {
      const icon = btn.querySelector?.(
        '.material-symbols-outlined[data-icon="notifications"], .material-symbols-outlined:not([data-icon])'
      );
      if (
        icon &&
        (icon.textContent.trim() === "notifications" ||
          icon.dataset.icon === "notifications")
      ) {
        if (btn.dataset.wired === "notifications") return;
        btn.dataset.wired = "notifications";
        btn.addEventListener("click", (e) => {
          if (btn.tagName === "A") return;
          e.preventDefault();
          e.stopPropagation();
          this.navigate("notifications.html");
        });
      }
    });
  },

  wireLogoutButtons() {
    document.querySelectorAll("button, a").forEach((el) => {
      const text = el.textContent?.toLowerCase() || "";
      if (
        text.includes("logout") &&
        !el.dataset.wiredLogout &&
        !el.getAttribute("href")?.includes("index.html")
      ) {
        el.dataset.wiredLogout = "true";
        el.addEventListener("click", (e) => {
          e.preventDefault();
          this.logout();
        });
      }
    });
  },
};

document.addEventListener("DOMContentLoaded", () => {
  if (!window.location.pathname.endsWith("index.html") && !window.location.pathname.endsWith("/")) {
    /* index is login - skip global on login unless not index */
  }
  const isLogin =
    document.getElementById("step-1") !== null ||
    window.location.pathname.endsWith("index.html");
  if (!isLogin) {
    HealthSyncApp.initGlobal();
  }
});

window.HealthSyncApp = HealthSyncApp;
