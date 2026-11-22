const $ = q => document.querySelector(q);
const $$ = q => [...document.querySelectorAll(q)];
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = x => Math.max(0, Math.min(1, x));

// ---------------------------------------------------------------------------
// 1. Dynamic 4-Round Co-Evolution Showcase in MA-Task Harness (Appendix supp_coevolution_door)
// ---------------------------------------------------------------------------
const COEV_ROUNDS = [
  {
    tab: 'Round 1 · Grasp slip',
    ver: 'v0 → v1',
    img: 'static/images/coevolution/r1.jpg',
    chip: ['v0 · 60° top-down pinch', '#a54e39'],
    svg: `<circle cx="28%" cy="76%" r="36" fill="none" stroke="#fff" stroke-width="3.5"/><circle cx="28%" cy="76%" r="36" fill="none" stroke="#d93025" stroke-width="2.4" stroke-dasharray="6 5"/>`,
    s1: { cls: 'audit', badge: 'E(1) → G(1) · Physical Audit', badgeCol: '#a54e39', title: 'Left-finger slip at 27.4 s', text: '60° top-down pinch lets the pot tilt to 78.9° and slip out of grip in closed loop.' },
    s2: { cls: 'repair', badge: 'G(1) Repair · Grasp & Staging', badgeCol: '#2d5f8b', title: 'Side-grasp + doorway staging', text: 'Switch to 0.9 rad side-grasps, add +y exterior staging, and guard Panda IK limits.' },
  },
  {
    tab: 'Round 2 · Aperture',
    ver: 'v1 → v2',
    img: 'static/images/coevolution/r2.jpg',
    chip: ['v1 · 44 cm doorway collision', '#b26a18'],
    svg: `<line x1="22%" y1="45%" x2="58%" y2="45%" stroke="#d97706" stroke-width="3"/><circle cx="22%" cy="45%" r="4.5" fill="#d97706"/><circle cx="58%" cy="45%" r="4.5" fill="#d97706"/>`,
    s1: { cls: 'audit', badge: 'E(2) → G(2) · Geometry Audit', badgeCol: '#a54e39', title: 'Wrist cam clips the 44 cm frame', text: 'Exterior wrist spread exceeds the cabinet opening (−2.5 mm) and pot overhangs shelf by −1.1 mm.' },
    s2: { cls: 'repair', badge: 'G(2) Repair · TCP Compaction', badgeCol: '#2d5f8b', title: 'Compact wrists 0.9 → 1.5 rad', text: 'Secures +10.0 mm doorway clearance and shifts target +2.5 cm inside the shelf.' },
  },
  {
    tab: 'Round 3 · Counter-audit',
    ver: 'v2 → v3',
    img: 'static/images/coevolution/r3.jpg',
    chip: ['v3 · door held at 147.6°', '#2d5f8b'],
    svg: `<circle cx="83%" cy="32%" r="32" fill="none" stroke="#fff" stroke-width="3.2"/><circle cx="83%" cy="32%" r="32" fill="none" stroke="#4f8a43" stroke-width="2.4"/>`,
    s1: { cls: 'audit blue', badge: 'G(3) → E(3) · False Rejection', badgeCol: '#2d5f8b', title: 'Valid rollout rejected by phase string', text: 'Evaluator asserted (4,4) extrinsics and rigid phase tags that failed time-shifted policies.' },
    s2: { cls: 'repair terra', badge: 'E(3) & G(3) · Mutual Repair', badgeCol: '#a54e39', title: 'Physical carry-window predicate', text: 'Replace phase strings with physical state rule: door > 140° across every carry frame.' },
  },
  {
    tab: 'Round 4 · Certified v4',
    ver: 'v4 Final',
    img: 'static/images/coevolution/r4.jpg',
    chip: ['v4 · 100 / 100 certified', '#4f8a43'],
    svg: `<rect x="34%" y="33%" width="22%" height="23%" rx="8" fill="none" stroke="#fff" stroke-width="3.2"/><rect x="34%" y="33%" width="22%" height="23%" rx="8" fill="none" stroke="#4f8a43" stroke-width="2.4"/>`,
    s1: { cls: 'audit', badge: 'E(4) → G(4) · Terminal Rest Check', badgeCol: '#a54e39', title: 'Residual 2.4 cm/s shelf vibration', text: 'Perturbed layouts vibrated at release, missing the 2.0 s continuous rest predicate.' },
    s2: { cls: 'conv', badge: 'Frozen v4 Package · Converged', badgeCol: '#4f8a43', title: '100 certified pairs · 0 collisions', text: 'SE(3) held-pot leveling (≤ 0.15°), +22.5 mm shelf margin, door ≥ 147.6° across all 654 frames.' },
  },
];

(() => {
  const wrap = $('#coev'), tabs = $('#coev-tabs'), stage = $('#coev-stage'), flow = $('#coev-flow'), bar = $('#coev-bar');
  if (!wrap) return;
  let cur = 0, timer = null, visible = false;
  COEV_ROUNDS.forEach((r, i) => {
    const b = document.createElement('button');
    b.role = 'tab'; b.textContent = r.tab;
    b.onclick = () => { stopAuto(); show(i, false); };
    tabs.appendChild(b);
  });
  const restartBar = animate => {
    bar.classList.remove('run');
    bar.style.width = animate ? '0%' : '100%';
    if (animate) { void bar.offsetWidth; bar.classList.add('run'); }
  };
  const show = (i, animate = true) => {
    cur = (i + COEV_ROUNDS.length) % COEV_ROUNDS.length;
    const r = COEV_ROUNDS[cur];
    [...tabs.children].forEach((b, j) => b.classList.toggle('on', j === cur));
    stage.innerHTML = `<img src="${r.img}" alt="${r.tab}"><svg>${r.svg}</svg><span class="coev-chip" style="background:${r.chip[1]}">${r.chip[0]}</span>`;
    flow.innerHTML = `
      <div class="coev-step ${r.s1.cls}">
        <span class="coev-badge" style="color:${r.s1.badgeCol}">${r.s1.badge}</span>
        <h4>${r.s1.title}</h4><p>${r.s1.text}</p>
      </div>
      <div class="coev-arrow">↓</div>
      <div class="coev-step ${r.s2.cls}">
        <span class="coev-badge" style="color:${r.s2.badgeCol}">${r.s2.badge}</span>
        <h4>${r.s2.title}</h4><p>${r.s2.text}</p>
      </div>`;
    restartBar(animate && !REDUCED);
  };
  const startAuto = () => {
    if (REDUCED || timer) return;
    restartBar(true);
    timer = setInterval(() => { if (visible) show(cur + 1, true); }, 3800);
  };
  const stopAuto = () => { if (timer) { clearInterval(timer); timer = null; } };
  show(0, false);
  new IntersectionObserver(es => es.forEach(e => {
    visible = e.isIntersecting;
    if (visible) startAuto();
  }), { threshold: .25 }).observe(wrap);
})();

// ---------------------------------------------------------------------------
// 2. MA-Bench Task Cards + Interactive Clip Switcher
// ---------------------------------------------------------------------------
const TASKS = [
  { key: 'bowl', name: 'Joint bowl placing', team: ['ALOHA', 'ALOHA'], when: 'Asynchronous', why: 'Spatial',
    text: 'One ALOHA moves a bowl into a shared zone; the other carries it to a goal outside the first robot’s reach.',
    clipCap: '<b class="ca">ALOHA A</b> relays the bowl into the shared zone; <b class="cb">ALOHA B</b> carries it to the goal.' },
  { key: 'color', name: 'Find common color', team: ['ALOHA', 'ALOHA'], when: 'Asynchronous', why: 'Information',
    text: 'Two ALOHAs 2.7 m apart see disjoint sets of blocks sharing one color, which each picks on its own side.',
    clipCap: 'Separated by 2.7 m, <b class="ca">ALOHA A</b> and <b class="cb">ALOHA B</b> identify and place their one shared color.' },
  { key: 'scan', name: 'Hold and scan', team: ['ALOHA', 'ALOHA'], when: 'Partially synchronous', why: 'Spatial',
    text: 'One ALOHA presents a box while the other raises and aligns a barcode scanner with it.',
    clipCap: '<b class="ca">ALOHA A</b> holds the box steady while <b class="cb">ALOHA B</b> lifts and aims the scanner.' },
  { key: 'door', name: 'Open door, place pot', team: ['Panda', 'ALOHA'], when: 'Partially synchronous', why: 'Capability',
    text: 'A single-arm Panda holds a spring-loaded cabinet door open while an ALOHA carries a pot inside with both arms.',
    clipCap: '<b class="ca">Panda</b> holds a spring-loaded door. <b class="cb">ALOHA</b> carries the pot inside with both arms.' },
  { key: 'tray', name: 'Lift tray, keep blocks', team: ['ALOHA', 'ALOHA'], when: 'Synchronous', why: 'Capability',
    text: 'Two ALOHAs carry a tray with four arms without toppling the block stack on it.',
    clipCap: '<b class="ca">ALOHA A</b> and <b class="cb">ALOHA B</b> lift the tray in lockstep without toppling the stack.' },
  { key: 'food', name: 'Lift tray, pour food', team: ['ALOHA', 'ALOHA'], when: 'Synchronous', why: 'Capability',
    text: 'Two ALOHAs lift a tray and tilt it in unison to pour its contents into a bin.',
    clipCap: 'Four arms lift and tilt the tray in unison so the contents pour cleanly.' },
  { key: 'balls', name: 'Pour and catch', team: ['Panda', 'UR5'], when: 'Synchronous', why: 'Capability',
    text: 'A Panda tilts a hopper while a UR5 tracks the moving stream with a cup.',
    clipCap: '<b class="ca">Panda</b> tilts the hopper while <b class="cb">UR5</b> tracks the stream and catches every ball.' },
];

const rail = $('#rail'), clipv = $('#clipv'), clipt = $('#clipt'), clipp = $('#clipp');
const inView = new Set();
const setClip = t => {
  if (!clipv) return;
  const wantSrc = `static/wall/${t.key}_main_hd.mp4`;
  if (!clipv.getAttribute('data-task') || clipv.getAttribute('data-task') !== t.key) {
    clipv.setAttribute('data-task', t.key);
    clipv.poster = `static/wall/${t.key}_main.jpg`;
    clipv.src = wantSrc;
    clipt.textContent = t.name;
    clipp.innerHTML = t.clipCap;
    clipv.play().catch(() => {});
  }
};

TASKS.forEach(t => {
  const el = document.createElement('article');
  el.className = 'task';
  el.innerHTML = `
    <div class="stage">
      ${[0, 1, 2].map(i => `<img loading="lazy" class="${i ? '' : 'on'}" src="static/images/bench_v2/${t.key}_${i}.jpg" alt="${t.name}, keyframe ${i + 1}">`).join('')}
      <div class="bars">${[0, 1, 2].map(() => '<i></i>').join('')}</div>
    </div>
    <div class="body">
      <h3>${t.name}</h3>
      <div class="team"><span class="ta">${t.team[0]}</span> + <span class="tb">${t.team[1]}</span></div>
      <div class="tags"><span>${t.when}</span><span>${t.why}</span><span>${t.team[0] === t.team[1] ? 'Homogeneous' : 'Heterogeneous'}</span></div>
      <p>${t.text}</p>
    </div>`;
  const imgs = [...el.querySelectorAll('.stage img')], bars = [...el.querySelectorAll('.bars i')];
  let k = 0;
  el.show = i => {
    k = (i + 3) % 3;
    imgs.forEach((im, j) => im.classList.toggle('on', j === k));
    bars.forEach((b, j) => { b.classList.toggle('done', j < k); b.classList.remove('on'); });
    void bars[k].offsetWidth;
    bars[k].classList.add('on');
  };
  el.next = () => el.show(k + 1);
  el.addEventListener('click', () => { el.next(); setClip(t); });
  rail.appendChild(el);
});
if (clipv) clipv.setAttribute('data-task', 'door');

const taskIO = new IntersectionObserver(es => es.forEach(e => {
  const el = e.target;
  el.classList.toggle('play', e.isIntersecting && !REDUCED);
  if (e.isIntersecting) { inView.add(el); el.show(0); } else inView.delete(el);
}), { threshold: .6 });
$$('.task').forEach(el => taskIO.observe(el));
if (!REDUCED) setInterval(() => inView.forEach(el => el.next()), 1900);

const step = () => (rail.querySelector('.task').offsetWidth + 20);
const prev = $('#prev'), next = $('#next');
prev.onclick = () => rail.scrollBy({ left: -step(), behavior: 'smooth' });
next.onclick = () => rail.scrollBy({ left: step(), behavior: 'smooth' });
const railState = () => {
  prev.disabled = rail.scrollLeft < 8;
  next.disabled = rail.scrollLeft > rail.scrollWidth - rail.clientWidth - 8;
};
rail.addEventListener('scroll', railState, { passive: true }); railState();

// ---------------------------------------------------------------------------
// 3. Shared 3D Tray Imagination Curve (Point 15 - exact SEC54_MASTER_RESULTS data synced to video)
// ---------------------------------------------------------------------------
(() => {
  const host = $('#tray-chart'), vid = $('#trayv'), readout = $('#tray-readout');
  if (!host) return;
  // 48 steps: 0.16s .. 7.68s (6 open-loop chunks on Lift tray, keep blocks, 20 unseen scenes)
  const T = Array.from({ length: 48 }, (_, i) => +((i + 1) * 0.16).toFixed(2));
  const C_MAWAM = [1.10,1.30,1.29,1.25,1.32,1.33,1.32,1.38,1.33,1.51,2.49,1.95,2.37,1.96,2.89,2.16,3.03,2.71,2.78,2.28,1.87,1.61,1.46,1.44,1.41,1.40,1.40,1.51,1.43,1.41,1.45,1.71,1.58,1.56,1.47,1.67,1.63,1.54,1.82,1.77,1.67,1.89,1.99,1.85,1.63,1.85,1.83,2.12];
  const C_PER   = [4.67,4.55,4.48,4.44,4.39,4.42,4.40,4.41,4.52,4.61,4.58,4.49,4.46,4.44,4.40,4.42,4.51,4.58,4.53,4.49,4.47,4.48,4.52,4.50,4.38,4.31,4.24,4.19,4.15,4.11,4.09,4.07,4.18,4.26,4.33,4.39,4.42,4.45,4.47,4.48,4.51,4.55,4.58,4.60,4.62,4.63,4.64,4.64];
  const C_MASK  = [1.32,1.54,1.76,1.95,2.10,2.24,2.36,2.45,6.80,14.2,23.5,31.8,38.4,42.1,43.5,43.77,41.2,37.6,33.4,29.5,26.2,23.8,22.1,20.97,17.4,13.6,9.8,6.7,4.6,3.5,3.1,2.95,6.4,11.8,17.5,22.6,26.4,28.5,29.1,29.37,29.0,28.6,28.3,28.1,27.9,27.8,27.7,27.59];

  const W = 520, H = 300, px0 = 46, px1 = 502, py0 = 20, py1 = 256;
  const xOf = t => px0 + ((t - 0.16) / (7.68 - 0.16)) * (px1 - px0);
  const yOf = v => py1 - (Math.min(v, 46) / 46) * (py1 - py0);
  const poly = arr => arr.map((v, i) => `${i ? 'L' : 'M'}${xOf(T[i]).toFixed(1)},${yOf(v).toFixed(1)}`).join(' ');

  const gridY = [0, 10, 20, 30, 40].map(v => {
    const y = yOf(v).toFixed(1);
    return `<line x1="${px0}" y1="${y}" x2="${px1}" y2="${y}" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
            <text x="${px0 - 8}" y="${+y + 4}" text-anchor="end" fill="#86868b" font-size="11">${v}</text>`;
  }).join('');
  const ticksX = [1.28, 2.56, 3.84, 5.12, 6.40, 7.68].map(t => {
    const x = xOf(t).toFixed(1);
    return `<line x1="${x}" y1="${py0}" x2="${x}" y2="${py1}" stroke="rgba(255,255,255,.05)" stroke-dasharray="3 3"/>
            <text x="${x}" y="${py1 + 18}" text-anchor="middle" fill="#86868b" font-size="11">${t.toFixed(2)}s</text>`;
  }).join('');

  host.innerHTML = `<svg viewBox="0 0 ${W} ${H}">
    ${gridY}${ticksX}
    <line x1="${px0}" y1="${yOf(1.40).toFixed(1)}" x2="${px1}" y2="${yOf(1.40).toFixed(1)}" stroke="#4f8a43" stroke-width="1" stroke-dasharray="4 4" opacity=".7"/>
    <path d="${poly(C_MASK)}" fill="none" stroke="#ef4444" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${poly(C_PER)}" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5 4" stroke-linecap="round"/>
    <path d="${poly(C_MAWAM)}" fill="none" stroke="#3b82f6" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
    <line id="tc-cur" x1="${px0}" y1="${py0}" x2="${px0}" y2="${py1}" stroke="rgba(255,255,255,.45)" stroke-width="1.3"/>
    <circle id="tc-dot-m" cx="${px0}" cy="${yOf(C_MAWAM[0])}" r="4.5" fill="#3b82f6" stroke="#fff" stroke-width="1.5"/>
    <circle id="tc-dot-x" cx="${px0}" cy="${yOf(C_MASK[0])}" r="4" fill="#ef4444" stroke="#fff" stroke-width="1.2"/>
    <text x="${(px0 + px1) / 2}" y="${H - 4}" text-anchor="middle" fill="#6e6e73" font-size="11.5">Imagination horizon (6 open-loop chunks, 7.68 s)</text>
  </svg>`;

  const curLine = $('#tc-cur'), dotM = $('#tc-dot-m'), dotX = $('#tc-dot-x');
  const syncCursor = () => {
    if (vid && vid.duration > 0) {
      const u = clamp(vid.currentTime / vid.duration);
      const idx = Math.min(47, Math.floor(u * 47));
      const x = xOf(T[idx]).toFixed(1);
      curLine.setAttribute('x1', x); curLine.setAttribute('x2', x);
      dotM.setAttribute('cx', x); dotM.setAttribute('cy', yOf(C_MAWAM[idx]).toFixed(1));
      dotX.setAttribute('cx', x); dotX.setAttribute('cy', yOf(C_MASK[idx]).toFixed(1));
      if (readout) readout.innerHTML = `t = +${T[idx].toFixed(2)}s · <b>${C_MAWAM[idx].toFixed(1)} mm</b> vs. ${C_MASK[idx].toFixed(1)} mm`;
    }
    requestAnimationFrame(syncCursor);
  };
  if (!REDUCED) requestAnimationFrame(syncCursor);
})();

// ---------------------------------------------------------------------------
// 4. Motion: reveal on scroll, count-up, scroll-linked hero film and nav
// ---------------------------------------------------------------------------
const countUp = el => {
  const n = +el.dataset.count, t0 = performance.now(), D = 1400;
  const f = now => {
    const x = clamp((now - t0) / D);
    el.textContent = Math.round(n * (1 - Math.pow(1 - x, 4)));
    if (x < 1) requestAnimationFrame(f);
  };
  REDUCED ? (el.textContent = n) : requestAnimationFrame(f);
};
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  e.target.querySelectorAll('[data-count]').forEach(countUp);
  io.unobserve(e.target);
}), { threshold: .15, rootMargin: '0px 0px -6% 0px' });
$$('.reveal').forEach(el => io.observe(el));

const film = $('#film'), nav = $('#nav');
const lightSections = $$('section.light, section.white');
let ticking = false;
const onScroll = () => {
  ticking = false;
  const vh = innerHeight;
  const fr = film.getBoundingClientRect();
  const fp = clamp((vh - fr.top) / (vh * .75));
  if (!REDUCED) film.style.transform = `scale(${.86 + .14 * fp})`;
  nav.classList.toggle('on-light', lightSections.some(s => { const r = s.getBoundingClientRect(); return r.top <= 48 && r.bottom > 48; }));
};
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
addEventListener('resize', onScroll);
onScroll();

$$('video:not(#filmv):not(#lbv)').filter(v => !v.closest('#wall')).forEach(v => new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) v.play().catch(() => {}); else v.pause();
}), { threshold: .35 }).observe(v));

// ---------------------------------------------------------------------------
// 5. Result Tables (Finalized Paper Numbers: 100 independent trials / 20 real trials)
// ---------------------------------------------------------------------------
const MAIN_COLS = [
  ['Bowl placing', 'Asy / Spa / A+A'], ['Common color', 'Asy / Info / A+A'], ['Hold &amp; scan', 'Par / Spa / A+A'],
  ['Door &amp; pot', 'Par / Cap / P+A'], ['Tray: blocks', 'Syn / Cap / A+A'], ['Tray: pour', 'Syn / Cap / A+A'],
  ['Pour &amp; catch', 'Syn / Cap / P+U'],
  ['S&#772;<sub>k</sub>', 'avg'], ['S<sub>collab</sub>', 'avg'], ['SR', 'avg'],
];
const MAIN_ROWS = [
  { grp: 'Per-robot',       name: '&pi;<sub>0.5</sub>',        v: ['0.0', '6.0', '26.0', '21.0', '0.0', '0.0', '17.0', '31.4', '15.1', '10.0'] },
  { grp: 'Per-robot',       name: 'LingBot-VA',                v: ['5.0', '11.0', '82.0', '81.0', '47.0', '41.0', '97.0', '81.9', '60.6', '52.0'] },
  { grp: 'All-view',        name: '&pi;<sub>0.5</sub> (joint)',v: ['0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '0.0', '4.4', '0.1', '0.0'] },
  { grp: 'All-view',        name: 'LingBot-VA (joint)',        v: ['5.0', '28.0', '0.0', '0.0', '0.0', '63.0', '0.0', '40.9', '18.4', '13.7'] },
  { grp: 'Multi-robot VLA', name: 'MA-VLA',                    v: ['0.0', '35.0', '0.0', '31.0', '0.0', '38.0', '0.0', '41.6', '21.1', '14.9'] },
  { grp: 'Multi-robot VLA', name: 'VLA-Fabric',                v: ['9.0', '33.0', '42.0', '0.0', '0.0', '36.0', '0.0', '45.5', '24.0', '17.1'] },
  { grp: 'Ours',            name: 'MAWAM',                     v: ['66.0', '63.0', '95.0', '88.0', '93.0', '91.0', '83.0', '94.3', '87.2', '82.7'], ours: true },
];
const REAL_COLS = ['Fruit basket', 'Toy handoff &amp; sort', 'Funnel cube pour', 'Average'];
const REAL_ROWS = [
  { name: 'LingBot-VA (per-robot)', v: ['15.0', '0.0', '25.0', '13.3'] },
  { name: 'LingBot-VA (joint)',     v: ['0.0', '0.0', '0.0', '0.0'] },
  { name: 'MAWAM (ours)',           v: ['75.0', '50.0', '65.0', '63.3'], ours: true },
];
const cell = v => (v === null || v === undefined) ? '<td class="na">&mdash;</td>' : `<td>${v}</td>`;
$('#tab-main').innerHTML =
  `<thead><tr><th>Deployment</th><th class="l">Method</th>${MAIN_COLS.map(c => `<th>${c[0]}<small>${c[1]}</small></th>`).join('')}</tr></thead><tbody>` +
  MAIN_ROWS.map(r => `<tr class="${r.ours ? 'ours' : ''}"><td class="grp">${r.grp}</td><td class="l">${r.name}</td>${r.v.map(cell).join('')}</tr>`).join('') + '</tbody>';
$('#tab-real').innerHTML =
  `<thead><tr><th>Method</th>${REAL_COLS.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>` +
  REAL_ROWS.map(r => `<tr class="${r.ours ? 'ours' : ''}"><td>${r.name}</td>${r.v.map(cell).join('')}</tr>`).join('') + '</tbody>';

$('#copy').addEventListener('click', e => {
  navigator.clipboard.writeText($('#bibtext').textContent).then(() => {
    e.target.textContent = 'Copied';
    setTimeout(() => (e.target.textContent = 'Copy'), 1500);
  });
});

// ---------------------------------------------------------------------------
// 6. Film → Wall (Point 10: smooth full-frame outer fade-out; Point 6: seamless infinite-loop centre hero.mp4)
// ---------------------------------------------------------------------------
(() => {
  const box = $('#stagebox'), wall = $('#wall'), filmv = $('#filmv'), wrap = $('#film');
  const T = (window.WALL || []).slice();
  if (!box || !T.length) return;
  const main = T.filter(t => t.id.endsWith('_main')), grid = T.filter(t => t.id.endsWith('_grid'));
  const imag = T.filter(t => t.kind === 'imagine'), real = T.filter(t => t.kind === 'real');
  const order = [];
  for (let i = 0; i < 7; i++) {
    [main[i], imag[(i + 3) % 7], grid[(i + 5) % 7], real[i % real.length]].forEach(t => t && order.push(t));
  }
  const slots = [];
  for (let r = 1; r <= 6; r++) for (let c = 1; c <= 11; c += 2)
    if (!(r >= 2 && r <= 5 && c >= 5 && c <= 7)) slots.push([r, c]);
  const seen = new Set(), list = [];
  for (const t of order) if (t && !seen.has(t.id)) { seen.add(t.id); list.push(t); }
  for (const t of T) if (!seen.has(t.id)) { seen.add(t.id); list.push(t); }
  while (list.length < slots.length) list.push(main[list.length % main.length]);

  slots.forEach(([r, c], i) => {
    const t = list[i], el = document.createElement('button');
    el.className = `tile-w ${t.kind}`; el.style.gridRow = r; el.style.gridColumn = `${c} / span 2`;
    const d = Math.hypot((c + 1 - 6.5) / 2, r - 3.5); el.style.setProperty('--dl', (0.08 + d * 0.06).toFixed(2) + 's');
    el.innerHTML = `<video muted loop playsinline preload="none" poster="static/wall/${t.poster}" src="static/wall/${t.src}"></video>
      <span class="tl">${t.title}</span>`;
    el.addEventListener('click', () => openLB(T.indexOf(t)));
    wall.appendChild(el);
  });

  // Seamless infinite-loop center tile (first in DOM so it gets #1 network & hardware-decoder priority!)
  const centre = document.createElement('div');
  centre.className = 'tile-w centre';
  centre.innerHTML = `<video id="heroloop" muted defaultMuted loop playsinline webkit-playsinline preload="auto" poster="static/wall/hero_v5.jpg" src="static/wall/hero_v5.mp4"></video>
    <span class="tl">Imagine together. Then act.</span>`;
  wall.prepend(centre);
  const heroLoop = $('#heroloop');
  if (heroLoop) {
    heroLoop.muted = true;
    heroLoop.defaultMuted = true;
    heroLoop.playsInline = true;
    heroLoop.loop = true;
    heroLoop.load();
  }
  const tileVideos = () => $$('#wall video');

  const ensureHeroPlaying = () => {
    if (!heroLoop || !box.classList.contains('walled') || $('#lb')?.classList.contains('on')) return;
    heroLoop.muted = true;
    if (heroLoop.paused) heroLoop.play().catch(() => {});
  };
  if (heroLoop) {
    ['loadeddata', 'canplay', 'canplaythrough', 'stalled', 'suspend'].forEach(ev =>
      heroLoop.addEventListener(ev, ensureHeroPlaying)
    );
    document.addEventListener('visibilitychange', () => { if (!document.hidden) ensureHeroPlaying(); });
    setInterval(ensureHeroPlaying, 600);
  }

  const toWall = () => {
    // Full-frame fade-out from the outer perimeter — never shrink into a central square!
    filmv.pause();
    box.classList.add('walled'); wrap.classList.add('walled');
    ensureHeroPlaying();
    tileVideos().forEach((v, idx) => {
      if (v === heroLoop) return;
      v.muted = true;
      setTimeout(() => {
        if (box.classList.contains('walled')) v.play().catch(() => {});
      }, 120 + idx * 35);
    });
  };
  const toFilm = () => {
    box.classList.remove('walled'); wrap.classList.remove('walled');
    tileVideos().forEach(v => v.pause());
    filmv.currentTime = 0; filmv.play().catch(() => {});
  };
  filmv.addEventListener('ended', toWall);
  $('#skip').addEventListener('click', toWall);
  $('#replay').addEventListener('click', toFilm);
  $('#sound').addEventListener('click', e => {
    filmv.muted = !filmv.muted; e.target.textContent = filmv.muted ? '♪ Sound on' : '♪ Sound off';
    if (!filmv.muted) filmv.play().catch(() => {});
  });
  if (REDUCED) toWall();

  // Lightbox (clean title + team only, no small text clutter)
  const lb = $('#lb'), lbv = $('#lbv'); let cur = 0;
  const openLB = i => {
    cur = (i + T.length) % T.length; const t = T[cur];
    lbv.poster = `static/wall/${t.poster}`; lbv.src = `static/wall/${t.hd}`; lbv.play().catch(() => {});
    $('#lbt').textContent = t.title;
    const team = t.team ? `<b class="ta">${t.team[0]}</b> + <b class="tb">${t.team[1]}</b>` : '';
    $('#lbm').innerHTML = team;
    lb.classList.add('on'); tileVideos().forEach(v => v.pause());
  };
  const closeLB = () => {
    lb.classList.remove('on'); lbv.pause(); lbv.removeAttribute('src'); lbv.load();
    if (box.classList.contains('walled')) tileVideos().forEach(v => v.play().catch(() => {}));
  };
  $('#lbx').onclick = closeLB; $('#lbp').onclick = () => openLB(cur - 1); $('#lbn').onclick = () => openLB(cur + 1);
  lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
  addEventListener('keydown', e => {
    if (!lb.classList.contains('on')) return;
    if (e.key === 'Escape') closeLB(); if (e.key === 'ArrowLeft') openLB(cur - 1); if (e.key === 'ArrowRight') openLB(cur + 1);
  });
})();
