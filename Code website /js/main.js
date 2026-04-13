/* ============================================
   ROMO Marketing – main.js
   ============================================ */

// ---------- Immer oben starten ----------
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (window.location.hash) history.replaceState(null, '', window.location.pathname);
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  setTimeout(() => window.scrollTo(0, 0), 50);
});

// ---------- Navbar scroll effect ----------
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ---------- Hamburger / Mobile Menu ----------
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ---------- Scroll-reveal animations ----------
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
revealEls.forEach(el => revealObserver.observe(el));

// ---------- Counter animation ----------
function animateCounter(el, target, duration = 1800) {
  const suffix = el.dataset.suffix || '';
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        animateCounter(el, parseInt(el.dataset.count), 1600);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);
counters.forEach(el => counterObserver.observe(el));

// ---------- Contact Form ----------
const form = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success');

form?.addEventListener('submit', function (e) {
  e.preventDefault();

  // Honeypot-Check (Spam-Schutz)
  if (this.querySelector('[name="website"]')?.value) return;

  const data = new FormData(this);

  // Sende per fetch an contact.php
  fetch('contact.php', {
    method: 'POST',
    body: data
  })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        form.style.display = 'none';
        successMsg.style.display = 'block';
      } else {
        alert('Fehler: ' + (res.message || 'Unbekannter Fehler'));
      }
    })
    .catch(() => {
      // Fallback: mailto öffnen
      const name    = data.get('name') || '';
      const email   = data.get('email') || '';
      const subject = encodeURIComponent('Kontaktanfrage: ' + (data.get('subject') || 'Anfrage'));
      const body    = encodeURIComponent(
        'Name: ' + name + '\nE-Mail: ' + email +
        '\n\nNachricht:\n' + (data.get('message') || '')
      );
      window.location.href = `mailto:info@romo-marketing.de?subject=${subject}&body=${body}`;
    });
});

// ---------- Cookie Banner ----------
const cookieBanner  = document.getElementById('cookie-banner');
const cookieAccept  = document.getElementById('cookie-accept');
const cookieDecline = document.getElementById('cookie-decline');

function setCookieChoice(accepted) {
  localStorage.setItem('cookie-consent', accepted ? 'accepted' : 'declined');
  localStorage.setItem('cookie-consent-date', new Date().toISOString());
  cookieBanner?.classList.add('hidden');
}

// Prüfe ob Nutzer bereits gewählt hat
if (!localStorage.getItem('cookie-consent')) {
  cookieBanner?.classList.remove('hidden');
} else {
  cookieBanner?.classList.add('hidden');
}

cookieAccept?.addEventListener('click',  () => setCookieChoice(true));
cookieDecline?.addEventListener('click', () => setCookieChoice(false));

// ---------- Smooth Anchor Scroll (extra sicher) ----------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Hash aus URL entfernen damit Reload immer oben startet
      history.replaceState(null, '', window.location.pathname);
    }
  });
});

// ---------- Phone Showcase – Drag Scroll ----------
const phonesTrack = document.getElementById('phonesTrack');
if (phonesTrack) {
  let isDown = false, startX, scrollLeft;

  phonesTrack.addEventListener('mousedown', (e) => {
    isDown = true;
    phonesTrack.classList.add('is-dragging');
    startX = e.pageX - phonesTrack.offsetLeft;
    scrollLeft = phonesTrack.scrollLeft;
  });
  document.addEventListener('mouseup', () => {
    isDown = false;
    phonesTrack.classList.remove('is-dragging');
  });
  phonesTrack.addEventListener('mouseleave', () => {
    isDown = false;
    phonesTrack.classList.remove('is-dragging');
  });
  phonesTrack.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - phonesTrack.offsetLeft;
    const walk = (x - startX) * 1.5;
    phonesTrack.scrollLeft = scrollLeft - walk;
  });
}

// ---------- Phone Showcase – Like Button ----------
document.querySelectorAll('.like-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    if (this.classList.contains('liked')) {
      this.classList.remove('liked');
      return;
    }
    this.classList.add('liked');

    // Spawn floating heart particles
    for (let i = 0; i < 4; i++) {
      const p = document.createElement('span');
      p.textContent = '♥';
      p.className = 'heart-particle';
      p.style.left = (Math.random() * 30 - 15) + 'px';
      p.style.top = '0px';
      p.style.animationDelay = (Math.random() * 0.2) + 's';
      this.appendChild(p);
      p.addEventListener('animationend', () => p.remove());
    }
  });
});

// ---------- Timeline Animation (Prozess) ----------
var tlSection = document.getElementById('prozess');
var tlFill    = document.getElementById('timelineTrackFill');
var tlWrapper = document.getElementById('timeline');
var tlItems   = Array.prototype.slice.call(document.querySelectorAll('.timeline-item'));

if (tlSection && tlFill && tlWrapper && tlItems.length) {
  // Activate CSS animation mode (progressive enhancement – nodes are visible by default in CSS)
  tlWrapper.classList.add('timeline-animate');

  // Scroll-driven gradient fill line
  function tlUpdateLine() {
    var rect  = tlSection.getBoundingClientRect();
    var winH  = window.innerHeight;
    var total = tlSection.offsetHeight + winH * 0.5;
    var pct   = Math.max(0, Math.min(100, ((winH - rect.top) / total) * 100));
    tlFill.style.height = pct + '%';
  }
  window.addEventListener('scroll', tlUpdateLine, { passive: true });
  tlUpdateLine();

  // Reveal each item with IntersectionObserver – threshold:0 fires on first pixel entering viewport
  var tlObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      var item = entry.target;
      var node = item.querySelector('.timeline-node');
      var body = item.querySelector('.timeline-body');
      if (node) node.classList.add('popped');
      if (body) setTimeout(function() { body.classList.add('visible'); }, 300);
      tlObserver.unobserve(item);
    });
  }, {
    threshold: 0,
    rootMargin: '0px 0px -60px 0px'
  });

  tlItems.forEach(function(item) { tlObserver.observe(item); });
}

// ---------- Phone Showcase – Video Autoplay on Scroll ----------
const phoneVideos = document.querySelectorAll('.phone-video');
if (phoneVideos.length) {
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        const playBtn = e.target.closest('.phone-screen')?.querySelector('.phone-play-btn');
        if (e.isIntersecting) {
          e.target.play().catch(() => {});
          if (playBtn) playBtn.style.opacity = '0';
        } else {
          e.target.pause();
          if (playBtn) playBtn.style.opacity = '1';
        }
      });
    },
    { threshold: 0.4 }
  );
  phoneVideos.forEach(v => videoObserver.observe(v));
}
