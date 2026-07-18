/**
 * header.js — Site header component
 * Renders the sticky navigation bar into #site-header and wires up
 * the mobile menu toggle + active-link scroll spy.
 */
(function () {
  "use strict";

  var HEADER_HTML =
    '<div class="header-inner">' +
      '<a class="brand" href="#top" aria-label="Find Words home">' +
        '<span class="brand-mark" aria-hidden="true">' +
          '<span class="tile t1">F</span><span class="tile t2">W</span>' +
        '</span>' +
        '<span class="brand-text">' +
          '<span class="brand-name">find words<span class="brand-dot">.</span></span>' +
          '<span class="brand-tag">random english word generator</span>' +
        '</span>' +
      '</a>' +
      '<nav class="site-nav" id="site-nav" aria-label="Primary">' +
        '<a href="#generator">Generator</a>' +
        '<a href="#features">Features</a>' +
        '<a href="#learn">Learn</a>' +
        '<a href="#faq">FAQ</a>' +
      '</nav>' +
      '<button class="nav-toggle" id="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav">' +
        '<span></span><span></span><span></span>' +
      '</button>' +
    '</div>';

  function mount() {
    var root = document.getElementById("site-header");
    if (!root) return;
    root.innerHTML = HEADER_HTML;

    var toggle = document.getElementById("nav-toggle");
    var nav = document.getElementById("site-nav");

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    // Shrink header slightly on scroll for a bit of polish.
    var header = document.querySelector(".site-header");
    window.addEventListener("scroll", function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    }, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", mount);
})();
