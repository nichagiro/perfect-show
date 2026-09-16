(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var header = document.getElementById("site-header");
  var navToggle = document.getElementById("nav-toggle");
  var siteNav = document.getElementById("site-nav");

  function onScroll() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 20);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeNav() {
    if (!siteNav || !navToggle) return;
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menú");
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });
    siteNav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });
  }

  var revealEls = document.querySelectorAll(".reveal");

  var root = document.documentElement;
  var themeToggle = document.getElementById("theme-toggle");

  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      themeToggle.setAttribute("aria-label", theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
    }
  }

  function setTheme(theme) {
    try { localStorage.setItem("theme", theme); } catch (e) {}
    applyTheme(theme);
  }

  if (themeToggle) {
    applyTheme(currentTheme());
    themeToggle.addEventListener("click", function () {
      setTheme(currentTheme() === "dark" ? "light" : "dark");
    });
  }
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  var faqBtns = document.querySelectorAll(".faq-item__btn");
  faqBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
      if (panel) panel.setAttribute("aria-hidden", expanded ? "true" : "false");
    });
  });
  faqBtns.forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (panel) panel.setAttribute("aria-hidden", "true");
  });

  var confettiHost = document.getElementById("confetti");
  if (confettiHost && !prefersReducedMotion) {
    var colors = ["#FF5A8A", "#FFB937", "#2BD6C2", "#FFFFFF", "#8A63D2"];
    var shapes = ["square", "rect", "round"];
    var count = window.innerWidth < 640 ? 28 : 46;

    for (var i = 0; i < count; i++) {
      var piece = document.createElement("i");
      piece.className = "confetti-piece";
      var shape = shapes[Math.floor(Math.random() * shapes.length)];
      if (shape === "square") {
        piece.style.width = piece.style.height = 8 + Math.random() * 6 + "px";
        piece.style.borderRadius = "2px";
      } else if (shape === "rect") {
        piece.style.width = 6 + Math.random() * 5 + "px";
        piece.style.height = 2 + Math.random() * 3 + "px";
        piece.style.borderRadius = "2px";
      } else {
        var size = 7 + Math.random() * 5;
        piece.style.width = piece.style.height = size + "px";
        piece.style.borderRadius = "50%";
      }
      piece.style.left = Math.random() * 100 + "vw";
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.setProperty("--spin", Math.round(360 + Math.random() * 540) + "deg");
      piece.style.animationDuration = 5 + Math.random() * 6 + "s";
      piece.style.animationDelay = Math.random() * 7 + "s";
      confettiHost.appendChild(piece);
    }
  }
})();