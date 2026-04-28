// ═══════════════════════════════════════════════════════
//  ANIMA MUNDI — UI Rendering & Transitions
// ═══════════════════════════════════════════════════════
import { PORTRAITS, GUIDES } from './guides.js';
import { getLevelInfo } from './gamification.js';

// ─── Ambient particle canvas ───────────────────────────
export function initCanvas() {
  const canvas = document.getElementById('ambientCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 16000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.3,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -Math.random() * 0.18 - 0.04,
        alpha: Math.random() * 0.5 + 0.1,
        life: Math.random(),
        maxLife: Math.random() * 0.4 + 0.3,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.life += 0.003;
      if (p.life > p.maxLife) {
        p.life = 0;
        p.x = Math.random() * canvas.width;
        p.y = canvas.height + 10;
        p.alpha = Math.random() * 0.5 + 0.1;
      }
      p.x += p.vx; p.y += p.vy;
      const fade = Math.sin((p.life / p.maxLife) * Math.PI);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${p.alpha * fade})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

// ─── Build selection grid ──────────────────────────────
export function buildSelectGrid(onPick, onLore) {
  const ag = document.getElementById('avGrid');
  ag.innerHTML = '';
  GUIDES.forEach(g => {
    const c = document.createElement('div');
    c.className = 'av-card';
    c.id = 'gc-' + g.id;
    const [r, gv, b] = hexToRgb(g.color);
    c.style.setProperty('--char-glow', `rgba(${r},${gv},${b},0.12)`);
    c.innerHTML = `
      <div class="av-card-inner">
        <div class="av-portrait">
          ${PORTRAITS[g.id]}
          <div class="av-ring" style="color:${g.color}"></div>
          <div class="av-ring2" style="color:${g.color}"></div>
        </div>
        <div class="av-nm" style="color:${g.color}">${g.title}</div>
        <div class="av-role">${g.label}</div>
        <div class="av-tradition">${g.tradition.split('·')[0].trim()}</div>
      </div>
      <div class="av-lore-peek">${g.lorePeek}</div>`;
    c.addEventListener('click', () => onPick(g.id));
    c.addEventListener('dblclick', (e) => { e.preventDefault(); onLore(g.id); });
    ag.appendChild(c);
  });
}

export function pickCard(id) {
  document.querySelectorAll('.av-card').forEach(c => c.classList.remove('picked'));
  const card = document.getElementById('gc-' + id);
  if (card) card.classList.add('picked');
}

// ─── Screen transitions ────────────────────────────────
export function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.toggle('hidden', s.id !== id);
  });
}

// ─── Lore panel ────────────────────────────────────────
export function openLorePanel(guideId, onEnter) {
  const g = GUIDES.find(x => x.id === guideId);
  if (!g) return;

  document.getElementById('lorePortrait').innerHTML = PORTRAITS[g.id];
  document.getElementById('loreTitle').textContent = `${g.title} · ${g.label}`;
  document.getElementById('loreSubtitle').textContent = g.role;
  document.getElementById('loreTradition').textContent = g.tradition;
  document.getElementById('loreOriginLabel').textContent = 'Origin: ' + g.loreOrigin;
  document.getElementById('loreStory').innerHTML = g.loreStory;

  const tl = document.getElementById('loreTeachingsList');
  tl.innerHTML = '';
  g.loreTeachings.forEach(t => {
    const d = document.createElement('div');
    d.className = 'lore-teaching';
    d.textContent = t;
    tl.appendChild(d);
  });

  const btn = document.getElementById('loreEnterBtn');
  btn.onclick = () => { closeLorePanel(); onEnter(guideId); };

  document.getElementById('lorePanel').classList.add('open');
}

export function closeLorePanel() {
  document.getElementById('lorePanel').classList.remove('open');
}

// ─── Companion screen setup ───────────────────────────
export function setupCompanionScreen(guide) {
  document.getElementById('tbNm').textContent = guide.title;
  document.getElementById('tbSub').textContent = `${guide.label} · ${guide.tradition.split('·')[0].trim()}`;
  document.getElementById('tbMini').innerHTML = PORTRAITS[guide.id];
  document.getElementById('portraitBig').innerHTML = PORTRAITS[guide.id];
  document.getElementById('stageCharName').textContent = guide.title;
  document.documentElement.style.setProperty('--char-color', guide.color);
}

// ─── Chat messages ────────────────────────────────────
export function addAIMessage(guide, text) {
  const div = document.createElement('div');
  div.className = 'msg ai';
  const mav = document.createElement('div');
  mav.className = 'msg-av ai-av';
  mav.innerHTML = PORTRAITS[guide.id];
  const bub = document.createElement('div');
  bub.className = 'bubble';
  const lbl = document.createElement('div');
  lbl.className = 'ai-nm';
  lbl.textContent = `${guide.title} · ${guide.label}`;
  bub.appendChild(lbl);
  const body = document.createElement('div');
  body.innerHTML = formatAIText(text);
  bub.appendChild(body);
  div.appendChild(mav);
  div.appendChild(bub);
  document.getElementById('chatScroll').appendChild(div);
  scrollBottom();
}

export function addUserMessage(text) {
  const div = document.createElement('div');
  div.className = 'msg user';
  const mav = document.createElement('div');
  mav.className = 'msg-av user-av';
  mav.textContent = '✦';
  const bub = document.createElement('div');
  bub.className = 'bubble';
  bub.textContent = text;
  div.appendChild(mav);
  div.appendChild(bub);
  document.getElementById('chatScroll').appendChild(div);
  scrollBottom();
}

export function showThinking(guide) {
  const d = document.createElement('div');
  d.className = 'think-wrap'; d.id = 'think';
  const mav = document.createElement('div');
  mav.className = 'msg-av ai-av';
  mav.innerHTML = PORTRAITS[guide.id];
  const dr = document.createElement('div');
  dr.className = 'dots-row';
  dr.innerHTML = '<div class="dt"></div><div class="dt"></div><div class="dt"></div>';
  d.appendChild(mav); d.appendChild(dr);
  document.getElementById('chatScroll').appendChild(d);
  scrollBottom();
}

export function removeThinking() {
  const e = document.getElementById('think');
  if (e) e.remove();
}

export function clearChat() {
  document.getElementById('chatScroll').innerHTML = '';
}

function scrollBottom() {
  const c = document.getElementById('chatScroll');
  requestAnimationFrame(() => { c.scrollTop = c.scrollHeight; });
}

function formatAIText(text) {
  let out = text.replace(/\[SOURCE:\s*([^\]]+)\]\s*\n?"([^"]+)"/g, (m, src, q) =>
    `<div class="cit"><div class="cit-src">${src.trim()}</div><div class="cit-txt">"${q}"</div></div>`
  );
  out = out.replace(/\[SOURCE:\s*([^\]]+)\]([^<\n]*)/g, (m, src, rest) => {
    if (rest.trim()) return `<div class="cit"><div class="cit-src">${src.trim()}</div><div class="cit-txt">${rest.trim()}</div></div>`;
    return `<span class="ttag">${src.trim()}</span>`;
  });
  out = out.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p style="margin-top:8px">')
    .replace(/\n/g, '<br>');

  const tags = [];
  if (/sufi|rumi|hafiz/i.test(text)) tags.push('Sufism');
  if (/buddha|zen|dharma|tibetan/i.test(text)) tags.push('Buddhism');
  if (/stoic|marcus|epictetus|seneca/i.test(text)) tags.push('Stoicism');
  if (/tao|lao|zhuangzi/i.test(text)) tags.push('Taoism');
  if (/vedant|upanishad|gita|advaita/i.test(text)) tags.push('Vedanta');
  if (/kabbalah|torah|talmud/i.test(text)) tags.push('Kabbalah');
  if (/gospel|psalm|christian|meister/i.test(text)) tags.push('Christianity');
  if (/ancestor|ubuntu|yoruba/i.test(text)) tags.push('Indigenous');
  if (tags.length > 0) {
    out += '<div class="ttags">' + tags.map(t => `<span class="ttag">${t}</span>`).join('') + '</div>';
  }
  return out;
}

// ─── XP HUD ───────────────────────────────────────────
export function updateXPHud(state) {
  const info = getLevelInfo(state.xp);
  const el = document.getElementById('xpHud');
  if (!el) return;

  const pct = Math.round(info.progress * 100);
  el.querySelector('.xp-level-title').textContent = info.current.title;
  el.querySelector('.xp-level-icon').textContent = info.current.icon;
  el.querySelector('.xp-bar-fill').style.width = pct + '%';
  el.querySelector('.xp-count').textContent = state.xp + ' XP';
  el.querySelector('.xp-next').textContent = info.next
    ? `${info.next.xpNeeded - state.xp} to ${info.next.title}`
    : 'Max Level';
}

// ─── XP gain toast ────────────────────────────────────
export function showXPToast(amount, reason) {
  const t = document.createElement('div');
  t.className = 'xp-toast';
  t.innerHTML = `<span class="xp-toast-plus">+${amount} XP</span><span class="xp-toast-reason">${reason}</span>`;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('visible'), 50);
  setTimeout(() => { t.classList.remove('visible'); setTimeout(() => t.remove(), 400); }, 2800);
}

// ─── Level up modal ───────────────────────────────────
export function showLevelUp(levelData) {
  const modal = document.getElementById('levelUpModal');
  modal.querySelector('.lu-icon').textContent = levelData.icon;
  modal.querySelector('.lu-title').textContent = 'Level ' + levelData.level;
  modal.querySelector('.lu-subtitle').textContent = levelData.title;
  modal.classList.add('open');
  setTimeout(() => modal.classList.remove('open'), 3200);
}

// ─── Quest notification ───────────────────────────────
export function showQuestComplete(quest) {
  const t = document.createElement('div');
  t.className = 'quest-toast';
  t.innerHTML = `
    <div class="qt-icon">${quest.icon}</div>
    <div class="qt-text">
      <div class="qt-label">Quest Complete</div>
      <div class="qt-title">${quest.title}</div>
    </div>
    <div class="qt-xp">+${quest.xp} XP</div>`;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('visible'), 50);
  setTimeout(() => { t.classList.remove('visible'); setTimeout(() => t.remove(), 500); }, 3500);
}

// ─── Avatar stage toggle ──────────────────────────────
export function toggleAvatarStage(show) {
  document.getElementById('avStage').classList.toggle('collapsed', !show);
  document.getElementById('avTogBtn').classList.toggle('on', show);
}

// ─── Textarea auto-resize ──────────────────────────────
export function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 90) + 'px';
}

// ─── Helpers ──────────────────────────────────────────
function hexToRgb(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}
