/* Ruch makiet rundy 2 (05.11.2026). Jeden zegar R2.now(): podgląd w pętli albo klatka stała (R2.seek(ms) — narzędzie klatek ruchu).
 * Main z klasą .rm = wersja „Ogranicz ruch” (bez ruchu, pozy stałe); prefers-reduced-motion działa tak samo na wszystkich ekranach. */
(function () {
  const R2 = (window.R2 = { fixed: null, start: performance.now(), hooks: [] });
  R2.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  R2.now = () => (R2.fixed != null ? R2.fixed : performance.now() - R2.start);
  R2.seek = (ms) => { R2.fixed = ms; R2.render(); };
  R2.play = () => { R2.fixed = null; R2.start = performance.now(); };
  R2.render = () => { const t = R2.now(); for (const h of R2.hooks) h(t); };
  const loop = () => { if (R2.fixed == null) R2.render(); requestAnimationFrame(loop); };
  const still = (el) => R2.reduce || !!el.closest('.rm');

  /* ---------- figury v2 (dane: start-1-1-r2-figury.js, wygenerowane z lib/figures/v2) ---------- */
  const F = window.FIG; const NUM = /(-?\d+(?:\.\d+)?)/;
  const parsed = {};
  const parse = (key) => parsed[key] || (parsed[key] = F.ex[key].frames.map((s) => s.split(NUM)));
  function frameAt(key, u) {
    const fr = parse(key); const x = u * (fr.length - 1); const i = Math.min(fr.length - 2, Math.floor(x)); const k = x - i;
    const a = fr[i], b = fr[i + 1];
    if (a.length !== b.length) return (k < 0.5 ? a : b).join('');
    let s = ''; for (let j = 0; j < a.length; j++) s += j % 2 ? (Math.round((+a[j] + (+b[j] - +a[j]) * k) * 10) / 10) : a[j];
    return s;
  }
  /* to samo co uAt() z lib/figures/v2/anim.ts (pauza, ruch z wygładzeniem cos, pauza, powrót) */
  function uAt(ms, lowerFirst) {
    const T = F.tempo; const a = lowerFirst ? T.downMs : T.upMs, b = lowerFirst ? T.upMs : T.downMs, h = T.holdMs, hl = T.holdMs;
    const total = h + a + hl + b; const x = ((ms % total) + total) % total; const e = (k) => (1 - Math.cos(Math.PI * k)) / 2;
    if (x < h) return 0; if (x < h + a) return e((x - h) / a); if (x < h + a + hl) return 1; return 1 - e((x - h - a - hl) / b);
  }
  R2.loopMs = () => F.tempo.holdMs * 2 + F.tempo.downMs + F.tempo.upMs;
  function drawFig(svg, key, u) {
    const ex = F.ex[key]; const bx = ex.box;
    svg.setAttribute('viewBox', `0 0 ${bx.w} ${bx.h}`);
    svg.innerHTML = `<g transform="matrix(1 0 0 -1 ${-bx.x} ${bx.y + bx.h})">${ex.trail || ''}${frameAt(key, u)}</g>`;
  }
  R2.drawFig = drawFig;
  const setPal = (el, hc) => { const th = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    /* tablica jest ciemna w obu motywach → paleta figury z motywu ciemnego (na granacie jasna paleta gubi ubranie w kolorze granatu) */
    const p = F.palette[hc ? 'darkHC' : 'dark']; for (const k in p) el.style.setProperty(k, p[k]); void th; };

  /* A: scena biblioteki — ćwiczenia po kolei, zmiana klapką (MOTION.boardFlipMs 250) */
  const ORDER = Object.keys(F.ex); const FLIP = 250;
  function sceneA(scene) {
    setPal(scene, scene.closest('[data-hc]'));
    const fixedKey = scene.dataset.cw; const svgs = scene.querySelectorAll('svg[data-fig]'); const name = scene.querySelector('.a-nazwa'); const flap = scene.querySelector('.a-klapka');
    const loopMs = R2.loopMs();
    return (t) => {
      if (still(scene)) { /* Ogranicz ruch: dwie pozy (start / koniec) jak staticPositions(), bez zmiany ćwiczenia */
        const key = fixedKey || ORDER[0]; svgs.forEach((s, i) => drawFig(s, key, svgs.length > 1 ? i : 1)); if (name) name.textContent = key; flap.style.transform = ''; return; }
      const n = fixedKey ? 0 : Math.floor(t / loopMs) % ORDER.length; const key = fixedKey || ORDER[n];
      const ex = F.ex[key]; const local = t % loopMs; drawFig(svgs[0], key, uAt(local, ex.lowerFirst));
      if (name) name.textContent = key;
      if (!fixedKey) { const toEnd = loopMs - local; let ang = 0;
        if (toEnd < FLIP / 2) ang = (1 - toEnd / (FLIP / 2)) * 90; else if (local < FLIP / 2 && t >= loopMs) ang = -90 + (local / (FLIP / 2)) * 90;
        flap.style.transform = ang ? `rotateX(${ang.toFixed(1)}deg)` : ''; }
    };
  }

  /* B: intro (lib/intro.ts: talerze wsuwają się od najcięższego, slide 380 ms, odstęp 100 ms, zacisk) → gryf przechodzi w oś tygodnia */
  const ICON = { bar: { x: 10, y: 56, w: 98, h: 8 }, plates: [[30, 16, 15, 88, 'red'], [48, 23, 14, 74, 'blue'], [65, 31, 12, 58, 'yellow'], [80, 38, 10, 44, 'green']], collar: [93, 49, 7, 22] };
  const PLATE = { light: { red: '#D7263D', blue: '#1F5FD1', yellow: '#F2C230', green: '#2E9E5B', ink: '#15171A' }, dark: { red: '#E8414F', blue: '#4A82F0', yellow: '#F2C230', green: '#3FBE72', ink: '#ECEAE4' } };
  const easeOut = (p) => 1 - (1 - Math.min(1, Math.max(0, p))) ** 3;
  const lerp = (a, b, k) => a + (b - a) * k;
  const B = { slide: 380, stagger: 100, introEnd: 850, hold: 150, hand: 600, loop: 5200 };
  function sceneB(main) {
    const ov = main.querySelector('.b-intro'); if (!ov) return () => {};
    const tlo = ov.querySelector('.tlo'); const svg = ov.querySelector('svg'); const rest = main.querySelectorAll('[data-b-po]');
    const bar = main.querySelector('.b-bar'), zac = main.querySelector('.b-zacisk');
    return (t) => {
      if (still(main)) { ov.style.display = 'none'; rest.forEach((e) => (e.style.opacity = '')); return; }
      ov.style.display = ''; const x = t % B.loop;
      const th = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'; const C = PLATE[th];
      const m = main.getBoundingClientRect(); const W = m.width, H = Math.min(m.height, 844);
      const s = Math.min(W, 390) * 0.62 / 120; const ox = W / 2 - 60 * s, oy = H / 2 - 60 * s; /* ikona na środku jak ekran startowy */
      const R = (r) => ({ x: ox + r.x * s, y: oy + r.y * s, w: r.w * s, h: r.h * s });
      const rel = (el) => { const r = el.getBoundingClientRect(); return { x: r.left - m.left, y: r.top - m.top, w: r.width, h: r.height }; };
      const tb = rel(bar), tz = rel(zac);
      const k = easeOut((x - B.introEnd - B.hold) / B.hand); /* 0 → 1 przejście */
      const b0 = R(ICON.bar); const bb = { x: lerp(b0.x, tb.x, k), y: lerp(b0.y, tb.y, k), w: lerp(b0.w, tb.w, k), h: lerp(b0.h, tb.h, k) };
      let out = `<rect x="${bb.x}" y="${bb.y}" width="${bb.w}" height="${bb.h}" rx="2" fill="${k > 0.98 ? 'var(--tekst)' : C.ink}"/>`;
      ICON.plates.forEach((p, i) => { const q = easeOut((x - i * B.stagger) / B.slide); const off = (1 - q) * 120 * s; const r = R({ x: p[0], y: p[1], w: p[2], h: p[3] });
        const gone = easeOut((x - B.introEnd - B.hold - i * 40) / 320); /* zdjęcie talerzy: zjeżdżają w prawo i gasną */
        out += `<rect x="${r.x + off + gone * (W - r.x + 40)}" y="${r.y}" width="${r.w}" height="${r.h}" rx="${4 * s}" fill="${C[p[4]]}" opacity="${1 - gone * 0.6}"/>`; });
      const qc = easeOut((x - 4 * B.stagger) / B.slide); const c0 = R({ x: ICON.collar[0], y: ICON.collar[1], w: ICON.collar[2], h: ICON.collar[3] });
      const kc = easeOut((x - B.introEnd - B.hold - 120) / (B.hand)); const cc = { x: lerp(c0.x + (1 - qc) * 120 * s, tz.x, kc), y: lerp(c0.y, tz.y, kc), w: lerp(c0.w, tz.w, kc), h: lerp(c0.h, tz.h, kc) };
      out += `<rect x="${cc.x}" y="${cc.y}" width="${cc.w}" height="${cc.h}" rx="3" fill="${kc > 0.5 ? 'var(--now)' : C.ink}"/>`;
      svg.innerHTML = out;
      const fade = easeOut((x - B.introEnd - B.hold - 150) / 450); tlo.style.opacity = String(1 - fade);
      const done = x > B.introEnd + B.hold + B.hand + 40; ov.style.visibility = done ? 'hidden' : 'visible';
      rest.forEach((e) => { const d = +(e.dataset.bPo || 0); e.style.opacity = String(easeOut((x - B.introEnd - B.hold - 350 - d) / 300)); });
      bar.style.visibility = done ? 'visible' : 'hidden'; zac.style.visibility = done ? 'visible' : 'hidden';
    };
  }

  /* C: klapki (tablica podejść / tablica odlotów): każda komórka przelatuje znaki i staje na wartości, kaskadą od lewej */
  const ABC = 'AĄBCĆDEĘFGHIJKLŁMNŃOÓPRSŚTUWYZŹŻ0123456789';
  function sceneC(main) {
    const cells = [...main.querySelectorAll('.fl[data-v]')];
    cells.forEach((c, i) => { c.innerHTML = `<span></span><i></i>`; c._i = i; });
    const LOOP = 5200, STEP = 70;
    return (t) => {
      const x = t % LOOP; const st = still(main);
      cells.forEach((c) => { const v = c.dataset.v, span = c.firstChild, flap = c.lastChild; const big = c.dataset.big != null;
        const end = (big ? 900 : 260 + c._i * 45) ; const n = Math.floor(x / STEP);
        if (st || x >= end || v === ' ') { span.textContent = v; flap.style.transform = 'scaleY(0)'; return; }
        span.textContent = big ? (x > 600 ? v : '') : ABC[(n * 7 + c._i * 13) % ABC.length];
        flap.style.transform = `scaleY(${(1 - (x % STEP) / STEP).toFixed(2)})`; });
    };
  }

  function init() {
    const qs = new URLSearchParams(location.search); const ek = qs.get('ekran'); const th = qs.get('motyw');
    if (th) document.documentElement.dataset.theme = th;
    if (ek) { document.body.style.padding = '0'; document.body.style.background = 'var(--bg)'; document.querySelectorAll('main[data-ekran], aside').forEach((e) => { if (e.dataset.ekran !== ek) e.remove(); }); }
    document.querySelectorAll('.a-scena').forEach((s) => R2.hooks.push(sceneA(s)));
    document.querySelectorAll('main[data-kier="b"]').forEach((m) => R2.hooks.push(sceneB(m)));
    document.querySelectorAll('main[data-kier="c"]').forEach((m) => R2.hooks.push(sceneC(m)));
    const q = new URLSearchParams(location.search).get('t'); if (q != null) R2.seek(+q); else requestAnimationFrame(loop);
    R2.render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
