(function () {
  "use strict";

  // ---------- Year ----------
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Theme ----------
  var root = document.documentElement;
  var toggle = document.getElementById("themeToggle");
  var iconEl = toggle ? toggle.querySelector(".theme-icon") : null;

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (iconEl) iconEl.textContent = theme === "dark" ? "☀️" : "🌙";
  }

  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  // ---------- Mobile menu ----------
  var menuToggle = document.getElementById("menuToggle");
  var navLinks = document.getElementById("navLinks");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ---------- Active section highlight ----------
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  var map = {};
  links.forEach(function (a) {
    var id = a.getAttribute("href").slice(1);
    var sec = document.getElementById(id);
    if (sec) map[id] = a;
  });

  if ("IntersectionObserver" in window && Object.keys(map).length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (a) { a.style.color = ""; a.style.background = ""; });
          var active = map[entry.target.id];
          if (active) {
            active.style.color = "var(--accent)";
            active.style.background = "var(--accent-bg)";
          }
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    Object.keys(map).forEach(function (id) {
      observer.observe(document.getElementById(id));
    });
  }
})();
