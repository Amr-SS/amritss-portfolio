/* ============================================
   AMRIT SS — Portfolio JavaScript v3
   Top 10 Premium Animations:
   1.  Scroll Progress Bar
   2.  Section Heading Text Reveal
   3.  Staggered Fade-in on Scroll
   4.  Hero Image Scale-in with 3D
   5.  Card 3D Tilt on Hover
   6.  Stats Counter Animation
   7.  Hero Stagger Animation
   8.  Parallax on Hero
   9.  Magnetic Hover on Buttons
   10. Smooth Page Load
   ============================================ */

(function () {
  'use strict';

  // ── Touch detection ──
  var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  // ── Enable page-load animation on desktop (CSS uses .js-ready guard) ──
  if (!isTouch && window.innerWidth > 768) {
    document.body.classList.add('js-ready');
  }

  // ── Safety timer: force all animated content visible after 2.5s ──
  // Catches any edge case where IntersectionObserver or rAF fails on mobile
  setTimeout(function () {
    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(function (el) {
      if (!el.classList.contains('visible')) el.classList.add('visible');
    });
    document.querySelectorAll('.heading').forEach(function (el) {
      if (!el.classList.contains('revealed')) el.classList.add('revealed');
    });
    var heroImgEl = document.querySelector('.hero-photo img');
    if (heroImgEl && !heroImgEl.classList.contains('loaded')) {
      heroImgEl.classList.add('loaded');
      heroImgEl.style.transform = 'none';
    }
  }, 2500);

  // ── Scroll Progress Bar (#1) ──
  var progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
    }, { passive: true });
  }

  // ── Navbar ──
  var navbar     = document.getElementById('navbar');
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  var mobLinks   = document.querySelectorAll('.mob-link');
  var sections   = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    // Active link highlight
    var y = window.scrollY + 180;
    sections.forEach(function (s) {
      var id   = s.getAttribute('id');
      var link = document.querySelector('.nav-link[href="#' + id + '"]');
      if (link) {
        if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }, { passive: true });

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
    mobileMenu.classList.toggle('open');
  });

  mobLinks.forEach(function (l) {
    l.addEventListener('click', function () {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
    });
  });

  // ── Close mobile menu on outside click ──
  document.addEventListener('click', function (e) {
    if (mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
    }
  });

  // ── Smooth scroll ──
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ── Hero Stagger Animation (#7) ──
  var heroEls = document.querySelectorAll('.hero-text .fade-in');
  heroEls.forEach(function (el, i) {
    el.style.transitionDelay = (150 + i * 130) + 'ms';
  });
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      heroEls.forEach(function (el) { el.classList.add('visible'); });
    });
  });

  // ── Hero Image Scale-in (#4) — no 3D to prevent mobile blur ──
  var heroImg = document.querySelector('.hero-photo img');
  if (heroImg) {
    heroImg.classList.add('scale-in');
    var revealImg = function () {
      setTimeout(function () {
        heroImg.classList.add('loaded');
        // After animation completes, remove transform entirely for crisp rendering
        setTimeout(function () {
          heroImg.style.transform = 'none';
        }, 1000);
      }, 400);
    };
    if (heroImg.complete) revealImg();
    else heroImg.addEventListener('load', revealImg);
  }

  // ── Section Heading Text Reveal (#2) ──
  var headings = document.querySelectorAll('.heading');
  var headingObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        headingObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  headings.forEach(function (h) { headingObserver.observe(h); });

  // ── Staggered Fade-in on Scroll (#3) ──
  var fades = document.querySelectorAll('.fade-in:not(.visible), .fade-in-left:not(.visible), .fade-in-right:not(.visible)');
  var fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var parent   = entry.target.parentElement;
        var siblings = parent ? parent.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right') : [];
        var idx      = Array.prototype.indexOf.call(siblings, entry.target);
        var delay    = Math.max(0, idx) * 90;
        setTimeout(function () {
          entry.target.classList.add('visible');
        }, delay);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });
  fades.forEach(function (el) { fadeObserver.observe(el); });

  // ── Stats Counter Animation (#6) ──
  var statNums = document.querySelectorAll('.stat-num');
  var statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(function (el) { statsObserver.observe(el); });

  function animateCounter(el) {
    var text    = el.textContent.trim();
    var suffix  = text.replace(/[0-9]/g, '');
    var target  = parseInt(text, 10);
    if (isNaN(target)) return;
    var duration = 1400;
    var start    = performance.now();

    function tick(now) {
      var elapsed  = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 4);
      var current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ── Card 3D Tilt on Hover (#5) — desktop only ──
  if (!isTouch) {
    var tiltCards = document.querySelectorAll('.proj-card');
    tiltCards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -4;
        var rotateY = ((x - centerX) / centerX) * 4;
        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px) scale(1.01)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(.16,1,.3,1), box-shadow .35s';
      });
      card.addEventListener('mouseenter', function () {
        card.style.transition = 'box-shadow .35s';
      });
    });
  }

  // ── Parallax on Hero (#8) — desktop only, uses margin to avoid blur ──
  if (!isTouch) {
    var heroPhotoEl = document.querySelector('.hero-photo');
    if (heroPhotoEl) {
      window.addEventListener('scroll', function () {
        if (window.scrollY < 900) {
          var offset = window.scrollY * 0.04;
          heroPhotoEl.style.marginTop = offset + 'px';
        }
      }, { passive: true });
    }
  }

  // ── Magnetic Hover on Buttons (#9) — desktop only ──
  if (!isTouch) {
    var magneticBtns = document.querySelectorAll('.btn-solid, .btn-outline');
    magneticBtns.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15 - 2) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  // ── Skill pill stagger on scroll ──
  var skillGroups = document.querySelectorAll('.skill-group');
  var skillObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var pills = entry.target.querySelectorAll('.skill-pills span');
        pills.forEach(function (pill, i) {
          pill.style.opacity = '0';
          pill.style.transform = 'translateY(10px) scale(0.95)';
          setTimeout(function () {
            pill.style.transition = 'all 0.4s cubic-bezier(.16,1,.3,1)';
            pill.style.opacity = '1';
            pill.style.transform = 'none';
          }, i * 60);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  skillGroups.forEach(function (g) { skillObserver.observe(g); });

})();
