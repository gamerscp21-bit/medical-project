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

  // ============================================
  // Like/Favorite Toggle Interaction
  // ============================================
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

  // ============================================
  // Comment Section Micro-interaction
  // ============================================
  const commentBtns = document.querySelectorAll(
    'button:has(.material-symbols-outlined[data-icon="chat_bubble"]), button:has(.material-symbols-outlined[data-icon="comment"])'
  );

  // Pre-configured mock comments for demonstration
  const mockComments = {
    card_0: [
      { author: "Dr. Marcus Brody", role: "Physician", text: "Excellent point, Elena. HRV monitoring has revolutionized postoperative recovery tracking." },
      { author: "James Cole", role: "Patient", text: "I noticed my HRV trend going up, it is very encouraging to see concrete progress!" }
    ],
    card_1: [
      { author: "Dr. Elena Vance", role: "Cardiologist", text: "Stiffness is common Sarah. Ensure you do the circular joint movements we discussed. Keep it gentle!" },
      { author: "Robert Ford", role: "Physician", text: "The healing alignment looks clean on the lateral shoulder view. Keep up the physical rehab." }
    ]
  };

  commentBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const article = btn.closest("article");
      let commentSection = article.querySelector(".comment-section");

      if (commentSection) {
        // Toggle visibility
        if (commentSection.classList.contains("hidden")) {
          commentSection.classList.remove("hidden");
          commentSection.style.maxHeight = "500px";
        } else {
          commentSection.classList.add("hidden");
          commentSection.style.maxHeight = "0px";
        }
        return;
      }

      // Create comment section if it doesn't exist
      commentSection = document.createElement("div");
      commentSection.className = "comment-section mt-md pt-md border-t border-outline-variant/50 transition-all duration-300 overflow-hidden";
      commentSection.style.maxHeight = "500px";

      const commentsList = document.createElement("div");
      commentsList.className = "space-y-sm mb-md";

      // Populate dummy comments
      const postComments = mockComments[`card_${index}`] || [];
      postComments.forEach((c) => {
        const commentItem = document.createElement("div");
        commentItem.className = "bg-surface-container-low p-3 rounded-xl text-sm border border-outline-variant/30";
        commentItem.innerHTML = `
          <div class="flex justify-between items-baseline mb-1">
            <span class="font-bold text-on-surface text-xs">${c.author}</span>
            <span class="text-[10px] text-primary uppercase font-bold tracking-wider">${c.role}</span>
          </div>
          <p class="text-on-surface-variant text-xs leading-relaxed">${c.text}</p>
        `;
        commentsList.appendChild(commentItem);
      });

      // Comment input elements
      const inputWrapper = document.createElement("div");
      inputWrapper.className = "flex gap-sm mt-md";

      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Write a comment...";
      input.className = "flex-grow bg-surface-container border border-outline-variant rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all";

      const postBtn = document.createElement("button");
      postBtn.className = "bg-primary text-on-primary px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm";
      postBtn.textContent = "Post";

      // Function to post comment
      const submitComment = () => {
        const text = input.value.trim();
        if (!text) return;

        const newCommentItem = document.createElement("div");
        newCommentItem.className = "bg-surface-container-low p-3 rounded-xl text-sm border border-outline-variant/30 animate-pulse-soft";
        newCommentItem.innerHTML = `
          <div class="flex justify-between items-baseline mb-1">
            <span class="font-bold text-on-surface text-xs">Alex Johnson</span>
            <span class="text-[10px] text-secondary uppercase font-bold tracking-wider">Patient (You)</span>
          </div>
          <p class="text-on-surface-variant text-xs leading-relaxed">${text}</p>
        `;
        commentsList.appendChild(newCommentItem);
        input.value = "";
        
        // Remove animation pulse
        setTimeout(() => newCommentItem.classList.remove("animate-pulse-soft"), 1500);

        // Update comment counter
        const span = btn.querySelector("span:not(.material-symbols-outlined)");
        let count = parseInt(span.textContent);
        span.textContent = count + 1;

        showToast("Comment posted successfully!");
      };

      postBtn.addEventListener("click", submitComment);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          submitComment();
        }
      });

      inputWrapper.appendChild(input);
      inputWrapper.appendChild(postBtn);

      commentSection.appendChild(commentsList);
      commentSection.appendChild(inputWrapper);
      article.appendChild(commentSection);
    });
  });

  // ============================================
  // Share Button Clipboard & Toast Interaction
  // ============================================
  const shareBtns = document.querySelectorAll(
    'button:has(.material-symbols-outlined[data-icon="share"])'
  );
  shareBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const dummyUrl = window.location.origin + "/feed.html#post-id";
      navigator.clipboard.writeText(dummyUrl).then(() => {
        showToast("Post link copied to clipboard!");
      }).catch(() => {
        showToast("Link prepared! Ready to share.");
      });
    });
  });

  // Wallet widget → mywallet
  const walletWidget = document.querySelector(".bg-primary-container.text-on-primary-container");
  if (walletWidget) {
    walletWidget.style.cursor = "pointer";
    walletWidget.addEventListener("click", () => HealthSyncApp.navigate("mywallet.html"));
  }

  // Profile avatar → profile
  document.querySelector("header img")?.addEventListener("click", () =>
    HealthSyncApp.navigate("profile.html")
  );

  // Post Update button
  document.querySelectorAll("button").forEach((btn) => {
    if (btn.textContent.includes("Post Update")) {
      btn.addEventListener("click", () => {
        const textarea = document.querySelector("textarea");
        const text = textarea?.value.trim();
        if (!text) return HealthSyncApp.toast("Write something to post", "error");
        HealthSyncApp.toast("Post published successfully!");
        textarea.value = "";
      });
    }
  });

  // Feed filter chips
  document.querySelectorAll(".flex.gap-sm.mb-lg button").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".flex.gap-sm.mb-lg button").forEach((c) => {
        c.className =
          "px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm whitespace-nowrap hover:bg-outline-variant";
      });
      chip.className =
        "px-4 py-1.5 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm whitespace-nowrap";
      HealthSyncApp.toast(`Showing: ${chip.textContent.trim()}`, "info");
    });
  });

  // FAB → focus composer
  document.querySelector("button.fixed.bottom-20")?.addEventListener("click", () => {
    const ta = document.querySelector("textarea");
    ta?.focus();
    ta?.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  // Download attachment
  document.querySelectorAll('button .material-symbols-outlined[data-icon="download"]').forEach((icon) => {
    icon.closest("button")?.addEventListener("click", (e) => {
      e.stopPropagation();
      HealthSyncApp.toast("HRV Trends Analysis PDF downloaded");
    });
  });

  // X-ray lightbox
  document.querySelectorAll(".aspect-video.group").forEach((box) => {
    box.addEventListener("click", () => HealthSyncApp.toast("Opening full-screen scan viewer", "info"));
  });
});

// ============================================
// Shared Toast Notification Creator
// ============================================
function showToast(message) {
  let toast = document.querySelector(".toast-container");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast-container";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <span class="material-symbols-outlined text-secondary text-lg" style="font-variation-settings: 'FILL' 1;">check_circle</span>
    <span>${message}</span>
  `;
  // Show toast
  setTimeout(() => toast.classList.add("show"), 50);

  // Auto hide
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}
