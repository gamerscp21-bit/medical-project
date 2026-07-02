/* ============================================
   HealthSync — Feed Page Scripts
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  const privacyBtn = document.getElementById("privacyBtn");
  const privacyLabel = document.getElementById("privacyLabel");

  // Privacy selector switching
  const privacyOptions = document.querySelectorAll(
    ".group-hover\\:block button"
  );
  privacyOptions.forEach((opt) => {
    opt.addEventListener("click", (e) => {
      const text = opt.textContent.trim();
      privacyLabel.textContent = text;
    });
  });

  // Like toggle effect
  const likeBtns = document.querySelectorAll(
    'button:has(.material-symbols-outlined[data-icon="thumb_up"]), button:has(.material-symbols-outlined[data-icon="favorite"])'
  );
  likeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const icon = btn.querySelector(".material-symbols-outlined");
      const span = btn.querySelector("span:not(.material-symbols-outlined)");
      let count = parseInt(span.textContent);

      if (btn.classList.contains("text-primary")) {
        btn.classList.remove("text-primary");
        btn.classList.add("text-on-surface-variant");
        icon.style.fontVariationSettings = "'FILL' 0";
        span.textContent = count - 1;
      } else {
        btn.classList.add("text-primary");
        btn.classList.remove("text-on-surface-variant");
        icon.style.fontVariationSettings = "'FILL' 1";
        span.textContent = count + 1;
      }
    });
  });
});
