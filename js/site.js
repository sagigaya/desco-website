/* ==========================================================================
   DESCO Israel — clean site JS
   Minimal: header scroll state, hamburger, counter-up, hero video reveal.
   ========================================================================== */

(function () {
  'use strict';

  // ------------------------------------------------------------------
  // 1) Header scroll state — add .scrolled after 100px
  // ------------------------------------------------------------------
  var header = document.getElementById('site-header');
  var hasHero = document.querySelector('.hero') !== null;

  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 0) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // Pages without hero should always be solid
  if (header && !hasHero) header.classList.add('solid');
  if (hasHero) {
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  // ------------------------------------------------------------------
  // 2) Hamburger — toggle full-screen mobile menu
  // ------------------------------------------------------------------
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  var mobileClose = document.getElementById('mobile-close');

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    document.body.classList.add('no-scroll');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    document.body.classList.remove('no-scroll');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  if (mobileMenu) {
    // Close after tapping any link
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  // ------------------------------------------------------------------
  // 3) Counter-up on scroll-into-view (IntersectionObserver + easeOutQuart)
  //    Markup: <span class="stat__num" data-count="500">0</span>
  //    Formatter respects data-format="comma" | "plain" and data-decimals.
  // ------------------------------------------------------------------
  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

  function formatNumber(n, format, decimals) {
    if (decimals) {
      n = Number(n.toFixed(decimals));
    } else {
      n = Math.round(n);
    }
    if (format === 'comma') {
      return n.toLocaleString('en-US');
    }
    return String(n);
  }

  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var duration = parseInt(el.getAttribute('data-duration'), 10) || 1600;
    var format = el.getAttribute('data-format') || 'plain';
    var decimals = parseInt(el.getAttribute('data-decimals'), 10) || 0;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var elapsed = ts - start;
      var progress = Math.min(elapsed / duration, 1);
      var value = target * easeOutQuart(progress);
      el.textContent = formatNumber(value, format, decimals);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = formatNumber(target, format, decimals);
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('.stat__num[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    counters.forEach(function (c) { io.observe(c); });
  } else {
    counters.forEach(function (c) {
      var target = parseFloat(c.getAttribute('data-count')) || 0;
      var format = c.getAttribute('data-format') || 'plain';
      var decimals = parseInt(c.getAttribute('data-decimals'), 10) || 0;
      c.textContent = formatNumber(target, format, decimals);
    });
  }

  // ------------------------------------------------------------------
  // 4) Hero video reveal — click play button, hide button, play video
  // ------------------------------------------------------------------
  var heroEl = document.querySelector('.hero');
  var playBtn = document.querySelector('.hero__play');
  var heroVideo = document.querySelector('.hero__video');

  if (heroEl && playBtn && heroVideo) {
    playBtn.addEventListener('click', function () {
      heroEl.classList.add('playing');
      try {
        heroVideo.setAttribute('controls', 'controls');
        heroVideo.currentTime = 0;
        var p = heroVideo.play();
        if (p && typeof p.catch === 'function') p.catch(function () { /* silent */ });
      } catch (e) { /* silent */ }
    });
  }

  // ------------------------------------------------------------------
  // 5) Footer year (if present)
  // ------------------------------------------------------------------
  var copy = document.getElementById('copy-year');
  if (copy) copy.textContent = new Date().getFullYear();
})();
