/**
 * footer.js — Site footer component
 * Renders the site footer into #site-footer, including the sitemap
 * links, keyword-rich tag list, and dynamic copyright year.
 */
(function () {
  "use strict";

  function footerHTML() {
    var year = new Date().getFullYear();
    return (
      '<div class="footer-inner">' +
        '<div class="footer-top">' +
          '<div class="footer-brand">' +
            '<span class="brand-name">find words<span class="brand-dot">.</span></span>' +
            '<p>A free random English word generator and word finder for ' +
               'students, teachers, writers and word-game players.</p>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h3>Explore</h3>' +
            '<ul>' +
              '<li><a href="#generator">Random word generator</a></li>' +
              '<li><a href="#features">Features</a></li>' +
              '<li><a href="#use-cases">Who it&rsquo;s for</a></li>' +
              '<li><a href="#learn">Word finder guide</a></li>' +
              '<li><a href="#faq">FAQ</a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h3>Popular searches</h3>' +
            '<ul>' +
              '<li><a href="#generator">find words</a></li>' +
              '<li><a href="#generator">word finder</a></li>' +
              '<li><a href="#generator">random word</a></li>' +
              '<li><a href="#generator">english word generator</a></li>' +
              '<li><a href="#generator">word generator</a></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<p>&copy; ' + year + ' Find Words &mdash; findwords.github.io. Built for learning, ' +
             'wordplay and vocabulary practice.</p>' +
        '</div>' +
      '</div>'
    );
  }

  function mount() {
    var root = document.getElementById("site-footer");
    if (!root) return;
    root.innerHTML = footerHTML();
  }

  document.addEventListener("DOMContentLoaded", mount);
})();
