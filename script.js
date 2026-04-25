// ── Mobile detection ──
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
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
