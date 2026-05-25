/* ============================================================
   LEBEDEV-PROD — main.js
   ============================================================ */

'use strict';

/* ── 1. PAGE LOAD REVEAL ──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => document.body.classList.add('loaded'));
});

/* ── 2. CUSTOM CURSOR ─────────────────────────────────────── */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');

let mouseX = -200, mouseY = -200;
let cx = -200, cy = -200;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  // dot snaps instantly
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

document.addEventListener('mouseleave', () => {
  cursor.style.opacity    = '0';
  cursorDot.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity    = '1';
  cursorDot.style.opacity = '1';
});

(function animateCursor() {
  cx += (mouseX - cx) * 0.1;
  cy += (mouseY - cy) * 0.1;
  cursor.style.left = cx + 'px';
  cursor.style.top  = cy + 'px';
  requestAnimationFrame(animateCursor);
})();

// Grow cursor on interactive elements
document.querySelectorAll('a, button, .service-card, .work-item').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
});

/* ── 3. THEME TOGGLE ──────────────────────────────────────── */
const themeBtn = document.getElementById('theme-toggle');
let isDark = localStorage.getItem('theme') !== 'light';

function applyTheme() {
  document.documentElement.classList.toggle('light', !isDark);
  themeBtn.innerHTML = isDark ? SUN_ICON : MOON_ICON;
}

const SUN_ICON  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
const MOON_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

applyTheme();

themeBtn.addEventListener('click', () => {
  isDark = !isDark;
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  applyTheme();
});

/* ── 4. SCROLL-TRIGGERED ANIMATIONS ──────────────────────── */
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = parseInt(entry.target.dataset.delay || 0);
    setTimeout(() => entry.target.classList.add('animated'), delay);
    animObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-animate]').forEach(el => animObserver.observe(el));

// Stagger children automatically
document.querySelectorAll('[data-stagger]').forEach(parent => {
  [...parent.children].forEach((child, i) => {
    child.dataset.animate = '';
    child.dataset.delay   = i * 110;
    animObserver.observe(child);
  });
});

/* ── 5. COUNTER ANIMATION ─────────────────────────────────── */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    runCounter(entry.target);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.6 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

function runCounter(el) {
  const target   = parseInt(el.dataset.count, 10);
  const suffix   = el.dataset.suffix || '';
  const prefix   = el.dataset.prefix || '';
  const duration = 1400;
  const startTs  = performance.now();

  function step(now) {
    const t = Math.min((now - startTs) / duration, 1);
    // easeOutExpo
    const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    el.textContent = prefix + Math.floor(eased * target) + suffix;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ── 6. MAGNETIC BUTTONS ─────────────────────────────────── */
document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) * 0.28;
    const y = (e.clientY - r.top  - r.height / 2) * 0.32;
    btn.style.transform = `translate(${x}px, ${y}px) scale(1.04)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ── 7. ACTIVE NAV ON SCROLL ─────────────────────────────── */
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = [...document.querySelectorAll('section[id]')];

const navSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      link.classList.toggle('nav-active', link.getAttribute('href') === '#' + entry.target.id);
    });
  });
}, { threshold: 0.35 });

sections.forEach(s => navSectionObserver.observe(s));

// Also hide/show nav on scroll direction
let lastScrollY = 0;
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > 120) {
    nav.classList.toggle('nav-hidden', y > lastScrollY + 4);
    nav.classList.toggle('nav-visible', y < lastScrollY - 4);
  } else {
    nav.classList.remove('nav-hidden');
  }
  lastScrollY = y;
}, { passive: true });

/* ── 8. TICKER PAUSE ON HOVER ────────────────────────────── */
document.querySelectorAll('.ticker-wrap, .ticker-wrap-2').forEach(wrap => {
  wrap.addEventListener('mouseenter', () => {
    wrap.querySelectorAll('[class*="ticker-inner"]').forEach(t => {
      t.style.animationPlayState = 'paused';
    });
  });
  wrap.addEventListener('mouseleave', () => {
    wrap.querySelectorAll('[class*="ticker-inner"]').forEach(t => {
      t.style.animationPlayState = 'running';
    });
  });
});

/* ── 9. HERO PARALLAX ────────────────────────────────────── */
const heroTitle = document.querySelector('.hero-title');
const heroMeta  = document.querySelector('.hero-meta');
const heroSub   = document.querySelector('.hero-sub');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > window.innerHeight) return; // only in hero zone
  if (heroTitle) heroTitle.style.transform = `translateY(${y * 0.16}px)`;
  if (heroMeta)  heroMeta.style.transform  = `translateY(${y * 0.07}px)`;
  if (heroSub)   heroSub.style.transform   = `translateY(${y * 0.1}px)`;
}, { passive: true });

/* ── 10. GRAIN NOISE OVERLAY ─────────────────────────────── */
(function grain() {
  const canvas = document.createElement('canvas');
  canvas.id = 'noise-canvas';
  // Small canvas — stretched via CSS for cheap grain look
  canvas.width  = 256;
  canvas.height = 256;
  canvas.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;' +
    'pointer-events:none;z-index:9998;opacity:0.032;' +
    'mix-blend-mode:screen;image-rendering:pixelated;';
  document.body.appendChild(canvas);

  const ctx  = canvas.getContext('2d');
  const w    = canvas.width;
  const h    = canvas.height;
  let frame  = 0;

  function drawGrain() {
    frame++;
    // Redraw only every 2nd frame — halves CPU cost
    if (frame % 2 === 0) {
      const img  = ctx.createImageData(w, h);
      const data = img.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        data[i] = data[i+1] = data[i+2] = v;
        data[i+3] = 180;
      }
      ctx.putImageData(img, 0, 0);
    }
    requestAnimationFrame(drawGrain);
  }
  drawGrain();
})();

/* ── 11. WORK ITEM HOVER SOUND (visual only) ─────────────── */
// Flash accent colour on .work-name briefly
document.querySelectorAll('.work-item').forEach(item => {
  const name = item.querySelector('.work-name');
  item.addEventListener('mouseenter', () => {
    name.style.color = 'var(--accent)';
  });
  item.addEventListener('mouseleave', () => {
    name.style.color = '';
  });
});

/* ── 12. FORM SUBMIT ─────────────────────────────────────── */
window.handleSubmit = function(e) {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('.form-submit');
  btn.textContent = '✓ Отправлено';
  btn.style.background = '#4ade80';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Отправить →';
    btn.style.background = '';
    btn.disabled = false;
    form.reset();
  }, 3000);
};

/* ── 13. SCROLL PROGRESS BAR ─────────────────────────────── */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total    = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.transform = `scaleX(${scrolled / total})`;
}, { passive: true });
