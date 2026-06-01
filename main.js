(function () {
  'use strict';

  /* ── Nav scroll detection ── */
  var nav = document.getElementById('nav');
  var heroBottom = document.getElementById('heroBottom');

  if (nav && heroBottom && window.IntersectionObserver) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          nav.classList.add('is-scrolled');
        } else {
          nav.classList.remove('is-scrolled');
        }
      });
    }, { threshold: 0 });
    navObserver.observe(heroBottom);
  } else if (nav) {
    // Fallback
    window.addEventListener('scroll', function () {
      if (window.scrollY > 60) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    }, { passive: true });
  }

  /* ── Mobile nav toggle ── */
  var navToggle = document.getElementById('navToggle');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('mobile-open', !expanded);
    });

    // Close on link click
    var mobileLinks = document.querySelectorAll('.nav-mobile a');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('mobile-open');
      });
    });
  }

  /* ── FAQ accordion ── */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all
      faqItems.forEach(function (other) {
        var otherBtn = other.querySelector('.faq-question');
        var otherAnswer = other.querySelector('.faq-answer');
        if (otherBtn && otherAnswer) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherAnswer.hidden = true;
        }
      });

      // Toggle current
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
      }
    });
  });

  /* ── Contact form → WhatsApp ── */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (form.elements['name'] ? form.elements['name'].value.trim() : '') || '';
      var email = (form.elements['email'] ? form.elements['email'].value.trim() : '') || '';
      var message = (form.elements['message'] ? form.elements['message'].value.trim() : '') || '';
      var text = 'Hola, soy ' + name + ' (' + email + ').\n\n' + message;
      var url = 'https://wa.me/34632235491?text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener');
    });
  }

  /* ── Custom cursor ── */
  var cursor = document.getElementById('cursor');
  if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var cursorRing = cursor.querySelector('.cursor-ring');
    var cx = -100, cy = -100;
    cursor.classList.add('is-ready');
    document.addEventListener('mousemove', function (e) {
      cx = e.clientX; cy = e.clientY;
      cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
    }, { passive: true });
    var hoverables = 'a, button, [data-cursor]';
    document.querySelectorAll(hoverables).forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('is-hovering'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('is-hovering'); });
    });
  }

  /* ── Process step animation ── */
  var processSteps = document.querySelectorAll('.process-step');
  if (processSteps.length && window.IntersectionObserver) {
    var stepDelay = [0, 300, 600, 900];
    var processObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        processObserver.disconnect();
        processSteps.forEach(function (step, i) {
          setTimeout(function () {
            step.classList.add('is-active');
          }, stepDelay[i] || i * 300);
        });
      }
    }, { threshold: 0.3 });
    var firstStep = processSteps[0];
    if (firstStep) processObserver.observe(firstStep);
  }

  /* ── Count-up animation for stats ── */
  var statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length && window.IntersectionObserver) {
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        statsObserver.unobserve(entry.target);
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-target'), 10);
        var prefix = el.getAttribute('data-prefix') || '';
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1200;
        var start = performance.now();

        function tick(now) {
          var elapsed = now - start;
          var progress = Math.min(elapsed / duration, 1);
          // ease out
          var eased = 1 - Math.pow(1 - progress, 3);
          var current = Math.round(eased * target);
          el.textContent = prefix + current + suffix;
          if (progress < 1) {
            requestAnimationFrame(tick);
          }
        }

        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (el) {
      statsObserver.observe(el);
    });
  }

})();
