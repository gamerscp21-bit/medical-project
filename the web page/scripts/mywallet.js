/* ============================================
   HealthSync — My Wallet Page Scripts
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  // Top Up buttons
  document.querySelectorAll("button").forEach((btn) => {
    if (btn.textContent.includes("Top Up")) {
      btn.addEventListener("click", () => HealthSyncApp.navigate("topup.html"));
    }
    if (btn.textContent.includes("View All Transactions")) {
      btn.addEventListener("click", () =>
        HealthSyncApp.navigate("transactions.html")
      );
    }
    if (btn.textContent.includes("Add New")) {
      btn.addEventListener("click", () =>
        HealthSyncApp.toast("Payment method form coming soon", "info")
      );
    }
  });

  // Quick actions
  document.querySelectorAll("section.grid button").forEach((btn) => {
    const label = btn.querySelector("span.font-label-sm")?.textContent || "";
    btn.addEventListener("click", () => {
      if (label.includes("Top Up")) HealthSyncApp.navigate("topup.html");
      else if (label.includes("Withdraw"))
        HealthSyncApp.toast("Withdrawal request submitted", "info");
      else if (label.includes("Send"))
        HealthSyncApp.toast("Send credit: enter recipient in app", "info");
    });
  });

  // Payment method rows
  document
    .querySelectorAll("section.mb-10 .cursor-pointer.group")
    .forEach((row) => {
      row.addEventListener("click", () => {
        const name = row.querySelector("p.font-semibold")?.textContent;
        HealthSyncApp.toast(`${name} selected as default`, "info");
      });
    });
});
