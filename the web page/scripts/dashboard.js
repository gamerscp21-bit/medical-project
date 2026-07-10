/* ============================================
   HealthSync — Dashboard Page Scripts
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  const bentoGrid = document.getElementById("vitals-grid");
  const skeletonOverlay = document.getElementById("skeleton-overlay");
  const realCards = document.querySelectorAll(
    ".vital-card-real, .chart-real, .reminders-real"
  );

  // Initialize battery UI from local state
  updateBatteryUI();

  // ============================
  // Skeleton Shimmer Loading (2s)
  // ============================
  setTimeout(() => {
    if (skeletonOverlay) {
      skeletonOverlay.style.transition = "opacity 0.4s ease-out";
      skeletonOverlay.style.opacity = "0";
      setTimeout(() => {
        skeletonOverlay.style.display = "none";
      }, 400);
    }

    if (bentoGrid) {
      bentoGrid.classList.remove("is-loading");
    }

    realCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("visible");
      }, index * 80);
    });
  }, 2000);

  // ============================
  // Heart Rate Live Update
  // ============================
  const hrDisplay = document.getElementById("hr-value");
  if (hrDisplay) {
    setInterval(() => {
      const currentHr = parseInt(hrDisplay.textContent, 10);
      const variation = Math.floor(Math.random() * 3) - 1;
      hrDisplay.textContent = currentHr + variation;
      hrDisplay.classList.remove("hs-count-changed");
      void hrDisplay.offsetWidth;
      hrDisplay.classList.add("hs-count-changed");
    }, 3000);
  }

  // Dismiss alert
  document.querySelectorAll(".bg-error-container button").forEach((btn) => {
    if (btn.textContent.includes("Dismiss")) {
      btn.addEventListener("click", () => HealthSyncApp.dismissAlert(btn));
    }
  });

  // Chart timeframe tabs
  document.querySelectorAll(".chart-real button").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".chart-real button").forEach((t) => {
        t.className =
          "px-3 py-1 hover:bg-surface-container text-on-surface-variant rounded-lg text-sm font-medium";
      });
      tab.className =
        "px-3 py-1 bg-surface-container-highest text-on-surface rounded-lg text-sm font-bold";
      HealthSyncApp.toast(`Showing ${tab.textContent} chart data`, "info");
    });
  });

  // View Full Schedule
  document.querySelectorAll("button").forEach((btn) => {
    if (btn.textContent.includes("View Full Schedule")) {
      btn.addEventListener("click", () => HealthSyncApp.navigate("schedule.html"));
    }
  });

  // Download Report
  document.querySelectorAll("button").forEach((btn) => {
    if (btn.textContent.includes("Download Report")) {
      btn.addEventListener("click", () => {
        HealthSyncApp.toast("Sync report downloaded as PDF");
      });
    }
  });

  // Medication reminder rows
  document
    .querySelectorAll(".reminders-real .border-outline-variant.rounded-2xl")
    .forEach((row) => {
      row.style.cursor = "pointer";
      row.addEventListener("click", () => {
        HealthSyncApp.toast("Opening medication details", "info");
        HealthSyncApp.navigate("schedule.html");
      });
    });
});

// ============================
// Bluetooth Status Toggle
// ============================
let bleConnected = true;

function toggleBleStatus() {
  const icon = document.getElementById("ble-icon");
  const text = document.getElementById("ble-text");
  const btn = document.getElementById("ble-status-btn");
  const mobileIcon = document.getElementById("ble-icon-mobile");
  const mobileText = document.getElementById("ble-text-mobile");

  bleConnected = !bleConnected;

  if (bleConnected) {
    icon.textContent = "bluetooth_connected";
    icon.style.fontVariationSettings = "'FILL' 1";
    icon.className =
      "material-symbols-outlined text-primary text-[18px]";
    text.textContent = "Connected via BLE";
    text.className =
      "text-label-sm font-label-sm text-primary font-bold";
    btn.classList.remove("border-outline");
    btn.classList.add("border-outline-variant");

    if (mobileIcon) {
      mobileIcon.textContent = "bluetooth_connected";
      mobileIcon.style.fontVariationSettings = "'FILL' 1";
      mobileIcon.className =
        "material-symbols-outlined text-primary text-[16px]";
    }
    if (mobileText) {
      mobileText.textContent = "Connected via BLE";
      mobileText.className = "text-label-sm text-primary font-bold";
    }
  } else {
    icon.textContent = "bluetooth_disabled";
    icon.style.fontVariationSettings = "'FILL' 0";
    icon.className =
      "material-symbols-outlined text-outline text-[18px]";
    text.textContent = "Searching for Patch...";
    text.className =
      "text-label-sm font-label-sm text-outline font-bold";
    btn.classList.remove("border-outline-variant");
    btn.classList.add("border-outline");

    if (mobileIcon) {
      mobileIcon.textContent = "bluetooth_disabled";
      mobileIcon.style.fontVariationSettings = "'FILL' 0";
      mobileIcon.className =
        "material-symbols-outlined text-outline text-[16px]";
    }
    if (mobileText) {
      mobileText.textContent = "Searching for Patch...";
      mobileText.className = "text-label-sm text-outline font-bold";
    }
  }
}

// ============================
// Battery & Charging State
// ============================
const batteryState = {
  percentage: 87,
  isCharging: true,
};

function updateBatteryUI() {
  const pctEl = document.getElementById("battery-pct");
  const chargingEl = document.getElementById("charging-label");
  const mobilePct = document.getElementById("battery-pct-mobile");
  const mobileCharging = document.getElementById("charging-label-mobile");

  if (pctEl) pctEl.textContent = batteryState.percentage + "%";
  if (mobilePct) mobilePct.textContent = batteryState.percentage + "%";

  const chargingHTML = batteryState.isCharging
    ? '<span class="material-symbols-outlined text-[14px]" style="font-variation-settings: \'FILL\' 1;">bolt</span> Charging'
    : '<span class="material-symbols-outlined text-[14px]">battery_horiz_050</span> Discharging';

  const chargingClass = batteryState.isCharging
    ? "text-label-sm font-label-sm text-secondary flex items-center gap-0.5"
    : "text-label-sm font-label-sm text-on-surface-variant flex items-center gap-0.5";

  if (chargingEl) {
    chargingEl.innerHTML = chargingHTML;
    chargingEl.className = chargingClass;
  }
  if (mobileCharging) {
    mobileCharging.innerHTML = chargingHTML;
    mobileCharging.className = chargingClass + " text-xs";
  }
}
