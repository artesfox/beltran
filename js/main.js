/* 10º Conversatorio Compras Públicas · Beltrán Pardo */
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var HEADER_OFFSET = 70;

  /* ---------- Scroll suave (Lenis) ---------- */
  var lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
    (function raf(t) {
      lenis.raf(t);
      requestAnimationFrame(raf);
    })(0);
  }
  function scrollToTarget(el) {
    if (lenis) lenis.scrollTo(el, { offset: -HEADER_OFFSET });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2 || a.hasAttribute('data-closed')) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      scrollToTarget(target);
    });
  });

  /* ---------- Header ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Resalta la sección activa en el menú
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]:not(.btn)'));
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          navLinks.forEach(function (l) {
            l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id);
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    navLinks.forEach(function (l) {
      var s = document.querySelector(l.getAttribute('href'));
      if (s) spy.observe(s);
    });
  }

  /* ---------- Menú móvil ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var overlay = document.querySelector('.nav-overlay');
  function closeMenu() {
    document.documentElement.classList.remove('menu-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = !document.documentElement.classList.contains('menu-open');
      document.documentElement.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    overlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- Aparición al hacer scroll ---------- */
  document.querySelectorAll('[data-stagger]').forEach(function (g) {
    var step = Number(g.getAttribute('data-stagger')) || 90;
    Array.prototype.forEach.call(g.querySelectorAll(':scope > [data-reveal]'), function (c, i) {
      c.style.setProperty('--d', (i % 8) * step + 'ms');
    });
  });
  document.querySelectorAll('[data-delay]').forEach(function (el) {
    el.style.setProperty('--d', el.getAttribute('data-delay') + 'ms');
  });
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('is-visible');
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ---------- Parallax suave en fondos ---------- */
  var parallax = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  if (parallax.length && !reduce) {
    var ticking = false;
    var update = function () {
      var vh = window.innerHeight;
      parallax.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var speed = Number(el.getAttribute('data-parallax')) || 0.15;
        el.style.transform = 'translate3d(0,' + ((r.top + r.height / 2 - vh / 2) * -speed).toFixed(1) + 'px,0)';
      });
      ticking = false;
    };
    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }

  /* ---------- Cuenta regresiva ---------- */
  var cd = document.querySelector('[data-countdown]');
  if (cd) {
    var target = new Date(cd.getAttribute('data-countdown')).getTime();
    var parts = {
      d: cd.querySelector('[data-d]'),
      h: cd.querySelector('[data-h]'),
      m: cd.querySelector('[data-m]'),
      s: cd.querySelector('[data-s]'),
    };
    var pad = function (n, l) {
      return String(n).padStart(l || 2, '0');
    };
    var tick = function () {
      var diff = Math.max(0, target - Date.now());
      var s = Math.floor(diff / 1000);
      parts.d.textContent = pad(Math.floor(s / 86400), 3);
      parts.h.textContent = pad(Math.floor((s % 86400) / 3600));
      parts.m.textContent = pad(Math.floor((s % 3600) / 60));
      parts.s.textContent = pad(s % 60);
      if (diff === 0) {
        document.querySelector('.cd-ended').hidden = false;
        return;
      }
      setTimeout(tick, 1000);
    };
    tick();
  }

  /* ---------- Más conferencistas ---------- */
  var moreBtn = document.querySelector('[data-more]');
  if (moreBtn) {
    moreBtn.addEventListener('click', function () {
      var sec = document.getElementById('conferencistas');
      var open = sec.classList.toggle('show-all');
      moreBtn.querySelector('span').textContent = open ? 'Ver menos' : 'Más conferencistas';
      moreBtn.setAttribute('aria-expanded', String(open));
      if (!open) scrollToTarget(sec);
    });
  }

  /* ---------- Agenda: Día 1 / Día 2 ---------- */
  var dayBtns = Array.prototype.slice.call(document.querySelectorAll('.fechas-bp .diabp'));
  var days = [document.querySelector('.deldia1'), document.querySelector('.deldia2')];
  dayBtns.forEach(function (btn, i) {
    btn.addEventListener('click', function () {
      dayBtns.forEach(function (b, k) {
        var on = k === i;
        b.classList.toggle('activafx', on);
        b.setAttribute('aria-pressed', String(on));
        if (days[k]) days[k].style.display = on ? 'block' : 'none';
      });
    });
  });

  /* ---------- Pop-up "Este seminario ya pasó" ---------- */
  var modal = document.getElementById('modal-ended');
  var lastFocus = null;
  function openModal(e) {
    if (e) e.preventDefault();
    lastFocus = document.activeElement;
    closeMenu();
    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');
    if (lenis) lenis.stop();
  }
  function closeModal() {
    modal.classList.add('is-closing');
    setTimeout(function () {
      modal.classList.remove('is-closing');
      if (typeof modal.close === 'function') modal.close();
      else modal.removeAttribute('open');
    }, 240);
  }
  modal.addEventListener('close', function () {
    if (lenis) lenis.start();
    if (lastFocus) lastFocus.focus();
  });
  modal.addEventListener('cancel', function (e) {
    e.preventDefault();
    closeModal();
  });
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });
  modal.querySelectorAll('[data-modal-close]').forEach(function (b) {
    b.addEventListener('click', closeModal);
  });
  document.querySelectorAll('[data-closed]').forEach(function (el) {
    el.addEventListener('click', openModal);
  });
  var form = document.getElementById('form-inscripcion');
  if (form) form.addEventListener('submit', openModal);
})();
