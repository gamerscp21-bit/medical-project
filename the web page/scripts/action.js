/* ============================================
   HealthSync — Action Page Scripts
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  // Notifications → notifications page (handled by app.js if wired)
  const notifBtn = document.querySelector(
    'header button .material-symbols-outlined[data-icon="notifications"]'
  )?.closest("button");
  if (notifBtn && !notifBtn.dataset.wired) {
    notifBtn.dataset.wired = "notifications";
    notifBtn.addEventListener("click", (e) => {
      e.preventDefault();
      HealthSyncApp.navigate("notifications.html");
    });
  }

  // Profile avatar → profile page
  const avatar = document.querySelector("header img");
  if (avatar) {
    avatar.closest("div")?.classList.add("cursor-pointer");
    avatar.closest("div")?.addEventListener("click", () =>
      HealthSyncApp.navigate("profile.html")
    );
  }

  // File upload
  const uploadZone = document.querySelector(".border-dashed");
  const browseBtn = uploadZone?.querySelector("button");
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.multiple = true;
  fileInput.accept = ".pdf,.jpg,.jpeg,.png";
  fileInput.className = "hidden";
  document.body.appendChild(fileInput);

  const triggerUpload = () => fileInput.click();
  uploadZone?.addEventListener("click", (e) => {
    if (e.target.closest("button.text-error")) return;
    triggerUpload();
  });
  browseBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    triggerUpload();
  });

  fileInput.addEventListener("change", () => {
    if (fileInput.files.length)
      HealthSyncApp.toast(`${fileInput.files.length} file(s) added`);
  });

  // Remove file buttons
  document.querySelectorAll('button .material-symbols-outlined[data-icon="close"]').forEach((icon) => {
    icon.closest("button")?.addEventListener("click", (e) => {
      e.stopPropagation();
      const row = icon.closest(".flex.items-center.p-3");
      row?.style && (row.style.transition = "opacity 0.3s, transform 0.3s");
      row && (row.style.opacity = "0", row.style.transform = "translateX(20px)");
      setTimeout(() => row?.remove(), 300);
      HealthSyncApp.toast("File removed");
    });
  });

  // Confirm & Pay
  const confirmBtn = document.querySelector(
    "button.bg-primary.text-on-primary.font-bold"
  );
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      confirmBtn.innerHTML =
        '<span class="material-symbols-outlined animate-spin">progress_activity</span> Processing...';
      confirmBtn.disabled = true;
      setTimeout(() => {
        confirmBtn.innerHTML =
          '<span class="material-symbols-outlined">check_circle</span> Payment Successful';
        confirmBtn.classList.remove("bg-primary");
        confirmBtn.classList.add("bg-secondary");
        HealthSyncApp.toast("Diagnosis request submitted! A physician will contact you shortly.");
        setTimeout(() => HealthSyncApp.navigate("schedule.html"), 2000);
      }, 2000);
    });
  }
});
