/* ============================================
   HealthSync — Schedule Page Scripts
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  // Medication checkbox toggle
  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const parent = this.closest(".group");
      if (this.checked) {
        parent.classList.add("opacity-50");
        parent.style.transition = "opacity 0.3s ease";
        HealthSyncApp.toast("Reminder enabled");
      } else {
        parent.classList.remove("opacity-50");
        HealthSyncApp.toast("Reminder disabled", "info");
      }
    });
  });

  // Mouse wheel scroll for date strip
  const scrollContainer = document.querySelector(".custom-scrollbar");
  if (scrollContainer) {
    scrollContainer.addEventListener("wheel", (evt) => {
      evt.preventDefault();
      scrollContainer.scrollLeft += evt.deltaY;
    });
  }

  // Day pill selection
  document.querySelectorAll(".flex-shrink-0.rounded-2xl").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".flex-shrink-0.rounded-2xl").forEach((p) => {
        p.className =
          "flex-shrink-0 flex flex-col items-center justify-center w-[72px] h-[96px] rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container transition-all cursor-pointer soft-card hs-day-pill";
        p.querySelector(".w-1\\.5")?.remove();
      });
      pill.className =
        "flex-shrink-0 flex flex-col items-center justify-center w-[72px] h-[96px] rounded-2xl bg-primary text-on-primary shadow-lg shadow-primary/20 scale-105 transition-all cursor-pointer z-10 hs-day-pill hs-day-active";
      if (!pill.querySelector(".w-1\\.5")) {
        const dot = document.createElement("div");
        dot.className = "w-1.5 h-1.5 bg-white rounded-full mt-2";
        pill.appendChild(dot);
      }
    });
  });

  // View Month → calendar
  document.querySelectorAll("button").forEach((btn) => {
    if (btn.textContent.includes("View Month")) {
      btn.addEventListener("click", () => HealthSyncApp.navigate("calendar.html"));
    }
    if (btn.textContent.includes("Join Video Call")) {
      btn.addEventListener("click", () => HealthSyncApp.navigate("video-call.html"));
    }
    if (btn.textContent.includes("Get Directions")) {
      btn.addEventListener("click", () => {
        window.open(
          "https://www.google.com/maps/search/?api=1&query=242+Medical+Plaza",
          "_blank"
        );
        HealthSyncApp.toast("Opening directions in Maps", "info");
      });
    }
  });

  // Notifications
  const notif = document.querySelector('header button[data-icon="notifications"]');
  notif?.addEventListener("click", () => HealthSyncApp.navigate("notifications.html"));

  // Profile avatar on schedule header
  document.querySelector("header img")?.addEventListener("click", () =>
    HealthSyncApp.navigate("profile.html")
  );
});
