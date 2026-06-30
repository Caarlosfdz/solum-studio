(function () {
  'use strict';

  /* ── Particles ── */
  (function () {
    var canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H, particles = [];
    var COUNT = 55;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    for (var i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.5 + 0.4,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.35 + 0.1
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(45,91,255,' + p.alpha + ')';
        ctx.fill();
      }
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(45,91,255,' + (0.05 * (1 - dist / 100)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  })();

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

    var mobileLinks = document.querySelectorAll('.nav-mobile a');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('mobile-open');
      });
    });
  }

  /* ── Reveal IntersectionObserver ── */
  var reveals = document.querySelectorAll('.reveal, .reveal-scale');
  if (reveals.length && window.IntersectionObserver) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.05 });
    reveals.forEach(function (el) { revealObs.observe(el); });
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
          otherAnswer.style.maxHeight = '0';
          otherAnswer.style.paddingBottom = '0';
        }
      });

      // Open clicked if it was closed
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.paddingBottom = '28px';
      }
    });
  });

  /* ── Contact form → Web3Forms ── */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = document.getElementById('contactSubmitBtn');
      var status = document.getElementById('formStatus');
      var data = new FormData(form);
      if (btn) { btn.disabled = true; btn.textContent = 'Enviando…'; }
      fetch('https://api.web3forms.com/submit', { method: 'POST', body: data })
        .then(function (res) { return res.json(); })
        .then(function (json) {
          if (json.success) {
            if (status) { status.textContent = '✓ Mensaje enviado. Te contactamos pronto.'; status.style.color = '#22B882'; }
            form.reset();
          } else {
            if (status) { status.textContent = 'Error al enviar. Escríbenos por WhatsApp.'; status.style.color = '#ff6b6b'; }
          }
        })
        .catch(function () {
          if (status) { status.textContent = 'Error de conexión. Inténtalo de nuevo.'; status.style.color = '#ff6b6b'; }
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.textContent = 'Enviar mensaje →'; }
        });
    });
  }

  /* ── Custom cursor ── */
  var cursor = document.getElementById('cursor');
  if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    cursor.classList.add('is-ready');
    document.addEventListener('mousemove', function (e) {
      cursor.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
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
          var eased = 1 - Math.pow(1 - progress, 3);
          var current = Math.round(eased * target);
          el.textContent = prefix + current + suffix;
          if (progress < 1) { requestAnimationFrame(tick); }
        }

        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (el) { statsObserver.observe(el); });
  }

  /* ── Services carousel drag + progress bar ── */
  var trackOuter = document.getElementById('services-track-outer');
  if (trackOuter) {
    var isDown = false, startX, scrollLeft;

    trackOuter.addEventListener('mousedown', function (e) {
      isDown = true;
      startX = e.pageX - trackOuter.offsetLeft;
      scrollLeft = trackOuter.scrollLeft;
      trackOuter.style.cursor = 'grabbing';
    });
    trackOuter.addEventListener('mouseleave', function () {
      isDown = false;
      trackOuter.style.cursor = 'grab';
    });
    trackOuter.addEventListener('mouseup', function () {
      isDown = false;
      trackOuter.style.cursor = 'grab';
    });
    trackOuter.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - trackOuter.offsetLeft;
      trackOuter.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });

    var fill = document.getElementById('progress-fill');
    var label = document.getElementById('progress-label');
    var btnPrev = document.getElementById('carousel-prev');
    var btnNext = document.getElementById('carousel-next');

    function updateCarouselUI() {
      var max = trackOuter.scrollWidth - trackOuter.clientWidth;
      var pct = max > 0 ? (trackOuter.scrollLeft / max * 100) : 0;
      if (fill) fill.style.width = pct + '%';
      var cards = trackOuter.querySelectorAll('.service-card-carousel');
      var idx = Math.round(pct / 100 * (cards.length - 1)) + 1;
      if (label) label.textContent = '0' + Math.min(idx, cards.length) + ' / 0' + cards.length;
      if (btnPrev) btnPrev.disabled = trackOuter.scrollLeft <= 0;
      if (btnNext) btnNext.disabled = trackOuter.scrollLeft >= max - 2;
    }

    trackOuter.addEventListener('scroll', updateCarouselUI, { passive: true });
    updateCarouselUI();

    function scrollByCard(dir) {
      var cards = trackOuter.querySelectorAll('.service-card-carousel');
      if (!cards.length) return;
      var cardW = cards[0].offsetWidth + 24;
      trackOuter.scrollBy({ left: dir * cardW, behavior: 'smooth' });
    }

    if (btnPrev) btnPrev.addEventListener('click', function () { scrollByCard(-1); });
    if (btnNext) btnNext.addEventListener('click', function () { scrollByCard(1); });
  }

  /* ── Back to top ── */
  var backTop = document.getElementById('back-to-top');
  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Protección de contenido ── */
  document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  document.addEventListener('dragstart', function (e) { e.preventDefault(); });
  document.addEventListener('selectstart', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    e.preventDefault();
  });
  document.addEventListener('keydown', function (e) {
    var k = e.key;
    if (e.ctrlKey && (k === 'u' || k === 'U' || k === 's' || k === 'S')) { e.preventDefault(); return false; }
    if (e.ctrlKey && e.shiftKey && (k === 'i' || k === 'I' || k === 'j' || k === 'J' || k === 'c' || k === 'C')) { e.preventDefault(); return false; }
    if (k === 'F12') { e.preventDefault(); return false; }
  });
  document.querySelectorAll('img').forEach(function (img) {
    img.setAttribute('draggable', 'false');
    img.style.webkitUserDrag = 'none';
    img.style.userSelect = 'none';
    img.style.pointerEvents = 'none';
  });

  // Image protection
  document.querySelectorAll('img').forEach(function(img) {
      img.addEventListener('contextmenu', function(e) { e.preventDefault(); });
      img.addEventListener('dragstart', function(e) { e.preventDefault(); });
      img.style.webkitUserDrag = 'none';
      img.style.userSelect = 'none';
  });

})();

// ── Code & Content Protection ─────────────────────────────────────────────

// Disable right-click on whole page
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Disable keyboard shortcuts for view-source, save, devtools
document.addEventListener('keydown', function(e) {
    // Ctrl+U (view source), Ctrl+S (save), Ctrl+P (print)
    if (e.ctrlKey && (e.key === 'u' || e.key === 'U' ||
                      e.key === 's' || e.key === 'S' ||
                      e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
    }
    // Ctrl+Shift+I, Ctrl+Shift+J (devtools)
    if (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'I' ||
                                     e.key === 'j' || e.key === 'J' ||
                                     e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
    }
    // F12
    if (e.key === 'F12') {
        e.preventDefault();
    }
});

// DevTools detection - clear console periodically
(function devToolsDetect() {
    var threshold = 160;
    function check() {
        if (window.outerWidth - window.innerWidth > threshold ||
            window.outerHeight - window.innerHeight > threshold) {
            console.clear();
        }
    }
    setInterval(check, 1000);
    // Override console methods
    var noop = function() {};
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        console.log = noop;
        console.warn = noop;
        console.error = noop;
        console.info = noop;
        console.debug = noop;
    }
})();
