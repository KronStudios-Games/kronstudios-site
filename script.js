// ── Mobile detection ──
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
}

// ── Canvas trail ──
const canvas = document.getElementById('trailCanvas');
const ctx = canvas.getContext('2d');
let W = window.innerWidth, H = window.innerHeight;
canvas.width = W; canvas.height = H;

const trail = [];
let maxTrail = 50;
let lastX = 0, lastY = 0;
let TRAIL_ENABLED = true;
let rafId = null;

window.addEventListener('resize', () => {
  W = window.innerWidth; H = window.innerHeight;
  canvas.width = W; canvas.height = H;
});

document.addEventListener('mousemove', e => {
  if (!TRAIL_ENABLED) return;
  const dx = e.clientX - lastX, dy = e.clientY - lastY;
  const speed = Math.sqrt(dx * dx + dy * dy);
  lastX = e.clientX; lastY = e.clientY;
  maxTrail = Math.min(120, 50 + speed * 1.4);
  const decay = 0.06 + speed / 900;
  for (let i = 0; i < 3; i++) {
    trail.push({ x: e.clientX, y: e.clientY, alpha: 1, decay });
  }
  if (trail.length > maxTrail) trail.splice(0, trail.length - maxTrail);
});

function animateTrail() {
  ctx.clearRect(0, 0, W, H);
  ctx.lineWidth = 28;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (let i = 0; i < trail.length - 1; i++) {
    const p1 = trail[i], p2 = trail[i + 1];
    ctx.strokeStyle = `rgba(102,117,255,${Math.max(0, p1.alpha - 0.18)})`;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    p1.alpha -= p1.decay;
  }
  if (TRAIL_ENABLED) {
    rafId = requestAnimationFrame(animateTrail);
  } else {
    ctx.clearRect(0, 0, W, H);
    rafId = null;
  }
}

// ── Trail widget ──
(function () {
  const widget = document.getElementById('trailWidget');
  const tab    = widget.querySelector('.trail-tab');
  const panel  = document.getElementById('trailPanel');
  const toggle = document.getElementById('trailToggle');

  toggle.addEventListener('change', () => {
    TRAIL_ENABLED = toggle.checked;
    if (TRAIL_ENABLED && !rafId) animateTrail();
    canvas.style.display = TRAIL_ENABLED ? 'block' : 'none';
  });

  tab.addEventListener('click', e => {
    e.stopPropagation();
    const open = widget.classList.toggle('open');
    tab.setAttribute('aria-expanded', String(open));
    panel.setAttribute('aria-hidden', String(!open));
  });

  tab.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tab.click(); }
    if (e.key === 'Escape') { widget.classList.remove('open'); tab.focus(); }
  });

  document.addEventListener('click', e => {
    if (!widget.contains(e.target)) widget.classList.remove('open');
  });
})();

if (!isMobile()) {
  animateTrail();
} else {
  document.getElementById('trailWidget').style.display = 'none';
  canvas.style.display = 'none';
}


// ── Studio role typewriter ──
const roles = [
  'Game Development',
  'Narrative Design',
  'World Building',
  'Systems Architecture',
  'Lore Forge',
];

const roleEl = document.getElementById('roleType');
let roleIdx  = 0;

function typeText(text) {
  return new Promise(resolve => {
    let i = 0;
    roleEl.textContent = '';
    const iv = setInterval(() => {
      roleEl.textContent += text[i++];
      if (i >= text.length) { clearInterval(iv); resolve(); }
    }, 75);
  });
}

function eraseText() {
  return new Promise(resolve => {
    const iv = setInterval(() => {
      roleEl.textContent = roleEl.textContent.slice(0, -1);
      if (!roleEl.textContent.length) { clearInterval(iv); resolve(); }
    }, 40);
  });
}

async function loopRoles() {
  while (true) {
    await typeText(roles[roleIdx]);
    await new Promise(r => setTimeout(r, 1800));
    await eraseText();
    await new Promise(r => setTimeout(r, 280));
    roleIdx = (roleIdx + 1) % roles.length;
  }
}

if (roleEl) loopRoles();


// ── Mobile nav hamburger ──
(function () {
  const hamburger = document.getElementById('navHamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', e => {
    e.stopPropagation();
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
})();


// ── Smooth nav scroll ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
