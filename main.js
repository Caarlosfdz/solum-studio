(function () {
  "use strict";

  /* ── helpers ── */
  var $ = function(sel, sc) { return (sc || document).querySelector(sel); };
  var $$ = function(sel, sc) { return Array.from((sc || document).querySelectorAll(sel)); };
  var fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var escHTML = function(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function(c) {
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  };
  function safe(fn, name) {
    try { fn(); } catch(e) { console.warn("[" + name + "]", e); }
  }

  /* ── splash ── */
  function initSplash() {
    var splash = $("[data-splash]");
    if (!splash) return;

    // Build letter cascade
    var lettersWrap = $("#splash-letters");
    if (lettersWrap) {
      var word1 = "SOLUM";
      var word2 = "STUDIO";
      var allLetters = word1.split("").concat([null]).concat(word2.split(""));
      allLetters.forEach(function(letter, i) {
        if (letter === null) {
          var sp = document.createElement("span");
          sp.className = "splash-letter space";
          sp.innerHTML = "&nbsp;";
          lettersWrap.appendChild(sp);
          return;
        }
        var span = document.createElement("span");
        span.className = "splash-letter" + (i >= word1.length + 1 ? " green" : "");
        span.textContent = letter;
        span.style.animationDelay = (i * 0.07) + "s";
        lettersWrap.appendChild(span);
      });
    }

    var hide = function() {
      splash.classList.add("is-out");
    };
    // JS safety net
    var hideTimeout = setTimeout(hide, 2800);
    if (document.readyState === "complete") {
      clearTimeout(hideTimeout);
      setTimeout(hide, 600);
    } else {
      window.addEventListener("load", function() {
        clearTimeout(hideTimeout);
        setTimeout(hide, 400);
      });
    }
    // Absolute safety at 4s
    setTimeout(hide, 4000);
  }

  /* ── nav ── */
  function initNav() {
    var nav = $("#nav");
    var burger = $("#nav-burger");
    var mobile = $("#nav-mobile");
    if (!nav) return;

    // Scroll glassmorphism
    var onScroll = function() {
      if (window.scrollY > 60) {
        nav.classList.add("is-scrolled");
      } else {
        nav.classList.remove("is-scrolled");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Burger
    if (burger && mobile) {
      var isOpen = false;
      var toggle = function() {
        isOpen = !isOpen;
        burger.classList.toggle("is-open", isOpen);
        mobile.classList.toggle("is-open", isOpen);
        burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
        document.body.style.overflow = isOpen ? "hidden" : "";
      };
      burger.addEventListener("click", toggle);
      $$(".nav-mobile-link, .nav-mobile .nav-cta", mobile).forEach(function(a) {
        a.addEventListener("click", function() {
          if (isOpen) toggle();
        });
      });
    }

    // Smooth scroll for anchors
    document.addEventListener("click", function(e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth"
      });
    });
  }

  /* ── reveals (IntersectionObserver) ── */
  function initReveals() {
    var els = $$(".reveal, .reveal-scale");
    if (!els.length || typeof IntersectionObserver === "undefined") {
      els.forEach(function(el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -2% 0px" });
    els.forEach(function(el) { io.observe(el); });

    // Safety: 6s force-reveal anything still hidden
    setTimeout(function() {
      $$(".reveal:not(.is-visible), .reveal-scale:not(.is-visible)").forEach(function(el) {
        el.classList.add("is-visible");
      });
    }, 6000);
  }

  /* ── particles canvas ── */
  function initParticles() {
    var canvas = $("#particles-canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var W, H, particles, animId;
    var mouse = { x: -1000, y: -1000 };
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
    }

    function createParticles() {
      var count = Math.min(Math.floor((W * H) / 12000), 80);
      particles = [];
      for (var i = 0; i < count; i++) {
        var accent = Math.random() > 0.5;
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.8 + 0.5,
          color: accent ? "34,184,130" : "46,120,199",
          opacity: Math.random() * 0.5 + 0.15
        });
      }
    }

    function dist(a, b) { return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2); }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var maxDist = 110;

      // Mouse influence
      particles.forEach(function(p) {
        var dx = mouse.x - p.x;
        var dy = mouse.y - p.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          p.vx -= (dx / d) * 0.015;
          p.vy -= (dy / d) * 0.015;
        }
        // Dampen
        p.vx *= 0.98;
        p.vy *= 0.98;
        // Max speed
        var speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 0.8) { p.vx = (p.vx / speed) * 0.8; p.vy = (p.vy / speed) * 0.8; }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
      });

      // Connections
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var d = dist(particles[i], particles[j]);
          if (d < maxDist) {
            var alpha = (1 - d / maxDist) * 0.18;
            ctx.beginPath();
            ctx.strokeStyle = "rgba(34,184,130," + alpha + ")";
            ctx.lineWidth = 0.7;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Dots
      particles.forEach(function(p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + p.color + "," + p.opacity + ")";
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    }

    function start() {
      resize();
      createParticles();
      if (animId) cancelAnimationFrame(animId);
      draw();
    }

    window.addEventListener("resize", function() {
      clearTimeout(window._particleResizeTimer);
      window._particleResizeTimer = setTimeout(start, 200);
    });

    if (fineHover) {
      canvas.closest("#hero") && canvas.closest("#hero").addEventListener("mousemove", function(e) {
        var rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
      document.addEventListener("mouseleave", function() { mouse.x = -1000; mouse.y = -1000; });
    }

    start();
  }

  /* ── stats counter ── */
  function initCounters() {
    var els = $$("[data-count-to]");
    if (!els.length || typeof IntersectionObserver === "undefined") return;

    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var el = e.target;
        var target = parseInt(el.getAttribute("data-count-to"), 10);
        var prefix = el.getAttribute("data-prefix") || "";
        var suffix = el.getAttribute("data-suffix") || "";
        var start = 0;
        var dur = 1400;
        var startTime = null;

        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / dur, 1);
          // ease out quad
          progress = 1 - (1 - progress) * (1 - progress);
          var val = Math.round(start + (target - start) * progress);
          el.textContent = prefix + val + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.3 });

    els.forEach(function(el) { io.observe(el); });
  }

  /* ── services scroll progress ── */
  function initServicesProgress() {
    var outer = $("#services-track-outer");
    var fill = $("#progress-fill");
    var label = $("#progress-label");
    if (!outer || !fill) return;

    outer.addEventListener("scroll", function() {
      var max = outer.scrollWidth - outer.clientWidth;
      if (max <= 0) return;
      var pct = outer.scrollLeft / max;
      fill.style.width = (pct * 100) + "%";
      if (label) {
        var cards = $$(".service-card", outer);
        var cardW = cards[0] ? cards[0].offsetWidth + 20 : 1;
        var idx = Math.min(Math.round(outer.scrollLeft / cardW), cards.length - 1);
        label.textContent = String(idx + 1).padStart(2, "0") + " / " + String(cards.length).padStart(2, "0");
      }
    }, { passive: true });

    // Drag to scroll
    var isDown = false, startX, scrollLeft;
    outer.addEventListener("mousedown", function(e) {
      isDown = true;
      startX = e.pageX - outer.offsetLeft;
      scrollLeft = outer.scrollLeft;
    });
    document.addEventListener("mouseup", function() { isDown = false; });
    outer.addEventListener("mousemove", function(e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - outer.offsetLeft;
      outer.scrollLeft = scrollLeft - (x - startX);
    });
  }

  /* ── process steps visibility ── */
  function initProcessSteps() {
    var steps = $$("[data-process-step]");
    if (!steps.length || typeof IntersectionObserver === "undefined") return;
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    steps.forEach(function(s) { io.observe(s); });
  }

  /* ── FAQ accordion ── */
  function initFAQ() {
    var items = $$(".faq-item");
    items.forEach(function(item) {
      var btn = item.querySelector(".faq-q");
      var panel = item.querySelector(".faq-a");
      var inner = item.querySelector(".faq-a-inner");
      if (!btn || !panel) return;

      btn.addEventListener("click", function() {
        var isOpen = item.classList.contains("is-open");
        // Close all
        items.forEach(function(i) {
          i.classList.remove("is-open");
          var p = i.querySelector(".faq-a");
          if (p) p.style.maxHeight = "0";
          var b = i.querySelector(".faq-q");
          if (b) b.setAttribute("aria-expanded", "false");
        });
        // Open clicked if it wasn't open
        if (!isOpen) {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
          panel.style.maxHeight = (inner ? inner.scrollHeight + 32 : 200) + "px";
        }
      });
    });
  }

  /* ── contact form ── */
  function initContactForm() {
    var form = $("#contact-form");
    if (!form) return;
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      var name = ($("#f-name") || {}).value || "";
      var contact = ($("#f-contact") || {}).value || "";
      var service = ($("#f-service") || {}).value || "";
      var msg = ($("#f-msg") || {}).value || "";

      if (!name.trim() || !contact.trim()) {
        var nameF = $("#f-name");
        if (nameF && !nameF.value.trim()) { nameF.focus(); return; }
      }

      var text = "Hola Solum Studio, me llamo " + name + "."
        + (contact ? " Teléfono/email: " + contact + "." : "")
        + (service ? " Interesado en: " + service + "." : "")
        + (msg ? " " + msg : "");

      var url = "https://wa.me/34632235491?text=" + encodeURIComponent(text);
      window.open(url, "_blank", "noopener");
    });
  }

  /* ── custom cursor ── */
  function initCursor() {
    if (!fineHover) return;
    var cursor = $("#cursor");
    var ring = cursor && cursor.querySelector(".cursor-ring");
    var lbl = $("#cursor-label");
    if (!cursor || !ring) return;

    var rx = 0, ry = 0, firstMove = false;
    var cursorLabels = {
      "reservar": "reservar",
      "ver": "ver",
      "leer": "leer",
      "escribir": "escribir",
      "enviar": "enviar",
      "subir": "subir"
    };

    window.addEventListener("mousemove", function(e) {
      if (!firstMove) {
        firstMove = true;
        rx = e.clientX; ry = e.clientY;
        ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
        cursor.classList.add("is-ready");
      }
      rx += (e.clientX - rx) * 0.18;
      ry += (e.clientY - ry) * 0.18;
      ring.style.transform = "translate3d(" + e.clientX + "px," + e.clientY + "px,0)";
    });

    // Hover label
    document.addEventListener("mouseover", function(e) {
      var target = e.target.closest("[data-cursor]");
      if (target) {
        var key = target.getAttribute("data-cursor");
        cursor.classList.add("is-hovering");
        if (lbl && cursorLabels[key]) {
          lbl.textContent = cursorLabels[key];
          cursor.classList.add("has-label");
        }
      }
    });
    document.addEventListener("mouseout", function(e) {
      if (!e.target.closest("[data-cursor]")) {
        cursor.classList.remove("is-hovering", "has-label");
      }
    });
  }

  /* ── back to top ── */
  function initBackToTop() {
    var btn = $("#back-to-top");
    if (!btn) return;
    btn.addEventListener("click", function() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    btn.setAttribute("data-cursor", "subir");
  }

  /* ── boot ── */
  function boot() {
    safe(initSplash, "initSplash");
    safe(initNav, "initNav");
    safe(initReveals, "initReveals");
    safe(initParticles, "initParticles");
    safe(initCounters, "initCounters");
    safe(initServicesProgress, "initServicesProgress");
    safe(initProcessSteps, "initProcessSteps");
    safe(initFAQ, "initFAQ");
    safe(initContactForm, "initContactForm");
    safe(initCursor, "initCursor");
    safe(initBackToTop, "initBackToTop");
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
