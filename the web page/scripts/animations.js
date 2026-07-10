/* ============================================
   HealthSync — Global Animation Controller
   Auto-applies scroll reveals, ripples, and
   page-specific motion to every page.
   ============================================ */

(function () {
  "use strict";

  const STAGGER_MS = 70;
  const REVEAL_THRESHOLD = 0.12;

  /* ── Init ── */
  document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("hs-anim-ready");
    initScrollReveal();
    initRippleEffect();
    initCardHovers();
    initDashboardAnimations();
    initFeedAnimations();
    initScheduleAnimations();
    initWalletAnimations();
    initLoginAnimations();
    initNavInteractions();
    initPageTransitions();
    initNotificationDots();
    initTableRowReveal();
  });

  /* ── Scroll Reveal via IntersectionObserver ── */
  function initScrollReveal() {
    const targets = collectRevealTargets();
    if (!targets.length) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("hs-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("hs-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: REVEAL_THRESHOLD, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach((el) => observer.observe(el));
  }

  function collectRevealTargets() {
    const seen = new Set();
    const list = [];

    const selectors = [
      "main > section",
      "main > header",
      "main > div > section",
      "main .space-y-sm > a",
      "main .space-y-sm > div",
      "main .space-y-lg > article",
      "main .space-y-lg > section",
      "main .space-y-lg > div",
      "main .space-y-md > section",
      "main .grid > section",
      "main .grid > div",
      ".glass-card",
      "article",
      "aside",
      ".section-card",
      ".bento-grid > .vital-card-real",
      ".bento-grid > .chart-real",
      ".bento-grid > .reminders-real",
      "table",
      ".hs-alert-banner",
      "#profile-screen > main > section",
      "#profile-screen > main > div",
      "#wizard-screen > main > section",
      "#wizard-screen > main > div",
    ];

    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        applyRevealClass(el, list);
      });
    });

    /* Stagger siblings inside common containers */
    document
      .querySelectorAll(
        ".space-y-sm, .space-y-md, .space-y-lg, table tbody, .grid"
      )
      .forEach((container) => {
        const children = [
          ...container.children,
        ].filter((c) => c.classList.contains("hs-reveal"));
        children.forEach((child, i) => {
          const n = Math.min(i + 1, 10);
          child.classList.add(`hs-stagger-${n}`);
        });
      });

    return list;
  }

  function applyRevealClass(el, list) {
    if (el.closest("#skeleton-overlay")) return;
    if (el.classList.contains("hs-reveal")) return;

    const tag = el.tagName.toLowerCase();
    if (tag === "aside") {
      el.classList.add("hs-reveal-left");
    } else if (el.classList.contains("vital-card-real")) {
      el.classList.add("hs-reveal-scale");
    } else {
      el.classList.add("hs-reveal");
    }
    list.push(el);
  }

  /* ── Ripple on primary buttons ── */
  function initRippleEffect() {
    document.querySelectorAll("button, .hs-interactive").forEach((btn) => {
      if (btn.classList.contains("hs-ripple-bound")) return;
      btn.classList.add("hs-ripple-wrap", "hs-ripple-bound");

      btn.addEventListener("click", (e) => {
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const ripple = document.createElement("span");
        ripple.className = "hs-ripple";
        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = e.clientX - rect.left - size / 2 + "px";
        ripple.style.top = e.clientY - rect.top - size / 2 + "px";
        btn.appendChild(ripple);
        ripple.addEventListener("animationend", () => ripple.remove());
      });
    });
  }

  /* ── Auto card hover class ── */
  function initCardHovers() {
    const cardSelectors = [
      ".glass-card",
      "article",
      ".section-card",
      "main a.group",
      "main .rounded-xl.border",
      "main .rounded-2xl.border",
      "main .rounded-3xl.border",
    ];
    const seen = new Set();
    cardSelectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        el.classList.add("hs-card-hover");
      });
    });
  }

  /* ── Dashboard ── */
  function initDashboardAnimations() {
    const alert = document.querySelector(".bg-error-container.border-l-4");
    if (alert) alert.classList.add("hs-alert-banner");

    document.querySelectorAll(".vital-card-real").forEach((card) => {
      if (card.className.includes("border-primary")) {
        card.classList.add("hs-vital-pulse");
      }
      if (card.className.includes("border-error")) {
        const val = card.querySelector(".text-\\[56px\\]");
        if (val) val.classList.add("hs-critical-value");
      }
    });

    const chartArea = document.querySelector(
      ".chart-real .flex.items-end.gap-2, .chart-real .flex.items-end"
    );
    if (chartArea) {
      chartArea.querySelectorAll("div.bg-primary, div.bg-error").forEach((bar, i) => {
        bar.classList.add("hs-chart-bar");
        bar.style.animationDelay = `${0.5 + i * 0.04}s`;
      });
    }

    const bento = document.getElementById("vitals-grid");
    if (bento) {
      const obs = new MutationObserver(() => {
        if (!bento.classList.contains("is-loading")) {
          document.querySelectorAll(".hs-chart-bar").forEach((bar, i) => {
            bar.style.animation = "none";
            bar.offsetHeight;
            bar.style.animation = "";
            bar.style.animationDelay = `${0.3 + i * 0.04}s`;
          });
          obs.disconnect();
        }
      });
      obs.observe(bento, { attributes: true, attributeFilter: ["class"] });
    }
  }

  /* ── Feed ── */
  function initFeedAnimations() {
    const fab = document.querySelector("button.fixed.bottom-20, button.fixed.bottom-10");
    if (fab) fab.classList.add("hs-fab");

    /* Enhance like toggle with bounce */
    document.querySelectorAll(".feed-action-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const icon = btn.querySelector(".material-symbols-outlined");
        if (
          icon &&
          (icon.dataset.icon === "thumb_up" || icon.dataset.icon === "favorite")
        ) {
          btn.classList.remove("hs-liked");
          void btn.offsetWidth;
          if (btn.classList.contains("text-primary")) {
            btn.classList.add("hs-liked");
          }
          const countSpan = btn.querySelector("span:not(.material-symbols-outlined)");
          if (countSpan) {
            countSpan.classList.remove("hs-count-changed");
            void countSpan.offsetWidth;
            countSpan.classList.add("hs-count-changed");
          }
        }
      });
    });
  }

  /* ── Schedule ── */
  function initScheduleAnimations() {
    document.querySelectorAll(".soft-card, .flex-shrink-0.rounded-2xl").forEach((pill, i) => {
      pill.classList.add("hs-day-pill");
      if (pill.classList.contains("bg-primary")) {
        pill.classList.add("hs-day-active");
      }
      pill.style.animationDelay = `${i * STAGGER_MS}ms`;
    });
  }

  /* ── Wallet ── */
  function initWalletAnimations() {
    const balanceCard = document.querySelector(
      "section.bg-primary-container, section[class*='primary-container']"
    );
    if (balanceCard) balanceCard.classList.add("hs-balance-shimmer", "hs-reveal-scale");

    document.querySelectorAll(".zebra-row, table tbody tr").forEach((row, i) => {
      row.classList.add("hs-reveal");
      row.classList.add(`hs-stagger-${Math.min(i + 1, 10)}`);
    });
  }

  /* ── Login / OTP ── */
  function initLoginAnimations() {
    document.querySelectorAll(".otp-input").forEach((input, i) => {
      input.style.animationDelay = `${i * 0.05}s`;
    });

    /* Step transitions */
    const origGoToStep = window.goToStep;
    if (typeof origGoToStep === "function") {
      window.goToStep = function (step) {
        const visible = document.querySelector(
          "#step-1:not(.hidden), #step-2:not(.hidden), #step-staff:not(.hidden), #step-success:not(.hidden)"
        );
        if (visible) {
          visible.classList.add("hs-step-exit");
          setTimeout(() => {
            visible.classList.remove("hs-step-exit");
            origGoToStep(step);
            const next = document.querySelector(
              "#step-1:not(.hidden), #step-2:not(.hidden), #step-staff:not(.hidden), #step-success:not(.hidden)"
            );
            if (next) {
              next.classList.add("hs-step-view");
              setTimeout(() => next.classList.remove("hs-step-view"), 500);
            }
          }, 280);
        } else {
          origGoToStep(step);
        }
      };
    }
  }

  /* ── Bottom nav pop on click ── */
  function initNavInteractions() {
    document.querySelectorAll("nav.fixed a, nav.fixed button").forEach((link) => {
      link.addEventListener("click", () => {
        const icon = link.querySelector(".material-symbols-outlined");
        if (icon) {
          icon.style.animation = "none";
          void icon.offsetWidth;
          icon.style.animation = "hs-nav-pop 0.4s var(--anim-ease-spring)";
        }
      });
    });
  }

  /* ── Page link fade transition ── */
  function initPageTransitions() {
    document.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("javascript") ||
        href.startsWith("http") ||
        href.startsWith("mailto") ||
        a.target === "_blank"
      )
        return;

      a.addEventListener("click", (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        document.body.classList.add("hs-page-exit");
        setTimeout(() => {
          window.location.href = href;
        }, 220);
      });
    });
  }

  /* ── Notification dot pulse ── */
  function initNotificationDots() {
    document
      .querySelectorAll(
        "header .bg-error.rounded-full, header .rounded-full.bg-error, header [class*='bg-error'][class*='rounded-full']"
      )
      .forEach((dot) => dot.classList.add("hs-notif-dot"));
  }

  /* ── Table rows scroll reveal ── */
  function initTableRowReveal() {
    document.querySelectorAll("table tbody tr").forEach((row, i) => {
      if (!row.classList.contains("hs-reveal")) {
        row.classList.add("hs-reveal");
        row.classList.add(`hs-stagger-${Math.min(i + 1, 10)}`);
      }
    });
  }
})();
