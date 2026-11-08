// Automat krótkich filmów o technice (ZB-047): MP4 1080×1920; obraz rysunku nagrany z eksportu web aplikacji (komponent ExerciseFigureV2 ze wszystkimi
// warstwami — decyzja właściciela 08.11.2026), napisy filmu wg scenariusza 1 (docs/18 08.11.2026 ~20:30): 0–0,5 s hak + nazwa + rysunek z błędem,
// 0,5–5 s napis błędu (✕ wyróżniony), 5–11,5 s ruch poprawny (✓ wskazówki wyróżniony), ostatnie 1,5 s logo i podpis na trwającej animacji.
// Użycie:
//   node scripts/filmy/render.mjs --film <id> --jezyk pl,en [--out .filmy] [--uklad poziom|pion] [--bez-eksportu] [--konfig scripts/filmy/filmy.json]
//   node scripts/filmy/render.mjs --wszystkie --jezyk pl,en
//   node scripts/filmy/render.mjs --film <id> --jezyk pl --plan        → tylko kontrola i plan (JSON, bez przeglądarki)
//   node scripts/filmy/render.mjs --film <id> --jezyk pl --strona N    → HTML kompozycji klatki N bez rysunku (test)
//   node scripts/filmy/render.mjs --film <id> --jezyk pl --klatki 0,200 → PNG wybranych klatek zamiast MP4 (podgląd)
// Eksport web: dane przykładowe (scripts/screens/seed.test.ts) + `expo export --platform web` do .expo/filmy (ok. 1 min; --bez-eksportu używa poprzedniego).
// Wymaga: playwright (Chromium) i ffmpeg z libx264. Publikuje właściciel; automat niczego nie wysyła.
import fs from 'node:fs';
import os from 'node:os';
import http from 'node:http';
import path from 'node:path';
import { spawn, execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { loadV2 } from '../figures/v2-build.mjs';
import { ROOT, daneRepo, problemyFilmu, planKlatek, tekstyFilmu, htmlStrony } from './kompozycja.mjs';

const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i >= 0 ? argv[i + 1] : d; };
const has = n => argv.includes('--' + n);
const cfg = JSON.parse(fs.readFileSync(path.resolve(arg('konfig', path.join(ROOT, 'scripts/filmy/filmy.json'))), 'utf8'));
const langs = String(arg('jezyk', 'pl')).split(',');
const filmy = has('wszystkie') ? cfg.filmy : cfg.filmy.filter(f => f.id === arg('film'));
if (!filmy.length) { console.error(`Nie ma filmu „${arg('film')}” w konfiguracji (dostępne: ${cfg.filmy.map(f => f.id).join(', ')})`); process.exit(2); }

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'filmy-v2-'));
const { v2, tokens } = loadV2(tmp);
const sprzatnij = () => fs.rmSync(tmp, { recursive: true, force: true });
const dane = daneRepo();
const d = { ...cfg.domyslne, uklad: arg('uklad', cfg.domyslne.uklad) };
const dataUri = (f, mime) => `data:${mime};base64,${fs.readFileSync(path.join(ROOT, f)).toString('base64')}`;
const wyjdz = (tekst, kod = 0) => { sprzatnij(); process.stdout.write(tekst, () => process.exit(kod)); /* exit dopiero po opróżnieniu potoku */ };

/* kontrola wszystkich filmów przed renderem — błąd w definicji przerywa całość (kod 1) */
const bledy = filmy.flatMap(f => langs.flatMap(l => problemyFilmu(f, l, cfg, v2, dane).map(p => `${f.id} [${l}]: ${p}`)));
if (bledy.length) { console.error('Odmowa — definicja filmu niezgodna z danymi aplikacji:\n- ' + bledy.join('\n- ')); sprzatnij(); process.exit(1); }

const strona = (f, l) => htmlStrony(tekstyFilmu(f, l, cfg, dane), tokens, d, dataUri('assets/icon.png', 'image/png'), dataUri('assets/fonts/BarlowCondensed-Bold.ttf', 'font/ttf'));
const klasa = k => [k.faza, k.napis ? 'napis' : '', k.koniec ? 'na-koncu' : ''].filter(Boolean).join(' ');

if (has('plan')) {
  const out = filmy.flatMap(f => langs.map(l => {
    const plan = planKlatek(f, cfg, v2); const tx = tekstyFilmu(f, l, cfg, dane);
    return { film: f.id, jezyk: l, klatek: plan.klatki.length, fps: d.fps, startMs: plan.startMs, zmianaMs: plan.zmianaMs, koniecOdMs: plan.koniecOdMs,
      fazy: [...new Set(plan.klatki.map(k => k.faza))], klatki_bez_napisu: plan.klatki.filter(k => !k.napis).length, klatki_koniec: plan.klatki.filter(k => k.koniec).length,
      widoki: plan.spec.views, waga_bledu_klatka0: Math.round(v2.faultWeight(plan.spec, plan.klatki[0].u) * 100) / 100,
      teksty: tx, stan_haka: f.haki[l].stan, stan_tekstow: cfg.teksty_stan?.[l] ?? null };
  }));
  wyjdz(JSON.stringify(out, null, 2) + '\n'); await new Promise(() => {});
}

if (arg('strona') !== undefined) {
  const f = filmy[0], l = langs[0]; const k = planKlatek(f, cfg, v2).klatki[Number(arg('strona'))];
  wyjdz(strona(f, l).replace('<body class="blad">', `<body class="${klasa(k)}">`)); await new Promise(() => {});
}

/* ---- eksport web aplikacji (dane przykładowe jak przy zrzutach ekranów) ---- */
const WEB = path.join(ROOT, '.expo/filmy');
if (!has('bez-eksportu') || !fs.existsSync(path.join(WEB, 'dist/index.html'))) {
  fs.mkdirSync(WEB, { recursive: true });
  execSync('npx jest --testMatch "**/scripts/screens/seed.test.ts"', { cwd: ROOT, stdio: 'inherit', env: { ...process.env, SEED_OUT: path.join(WEB, 'seed.json') } });
  execSync(`npx expo export --platform web --output-dir ${path.join(WEB, 'dist')}`, { cwd: ROOT, stdio: 'inherit' });
}
const seed = JSON.parse(fs.readFileSync(path.join(WEB, 'seed.json'), 'utf8'));
const dist = path.join(WEB, 'dist');
const typ = p => (p.endsWith('.js') ? 'text/javascript' : p.endsWith('.html') ? 'text/html' : p.endsWith('.css') ? 'text/css' : p.endsWith('.png') ? 'image/png' : p.endsWith('.ttf') ? 'font/ttf' : 'application/octet-stream');
const srv = http.createServer((q, r) => { let p = path.join(dist, decodeURIComponent(q.url.split('?')[0])); if (!p.startsWith(dist) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) p = path.join(dist, 'index.html'); r.writeHead(200, { 'content-type': typ(p) }); fs.createReadStream(p).pipe(r); });
await new Promise(r => srv.listen(0, '127.0.0.1', r)); const PORT = srv.address().port;

const { chromium } = createRequire(import.meta.url)('playwright');
const KROK_KLIKNIECIA = 33;
const browser = await chromium.launch();

/** Karta ćwiczenia w wersji web z zegarem pod kontrolą: krok zegara, włączenie/wyłączenie błędu, zrzut widoków z pozycjami wyróżnianych znaczków. */
async function kartaCwiczenia(f, l) {
  const ex = seed.exercises.find(e => e.name === f.cwiczenie || e.libKey === f.cwiczenie);
  if (!ex) throw new Error(`ćwiczenia „${f.cwiczenie}” nie ma w danych przykładowych (scripts/screens/seed.test.ts)`);
  const [vw, vh] = d.ekran_web;
  const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, colorScheme: d.motyw === 'dark' ? 'dark' : 'light', reducedMotion: 'no-preference', deviceScaleFactor: d.skala_web, locale: l });
  const st = JSON.parse(JSON.stringify(seed)); st.settings.language = l;
  await ctx.addInitScript(s => { if (!sessionStorage.getItem('seeded')) { localStorage.clear(); localStorage.setItem('kv:state', s); sessionStorage.setItem('seeded', '1'); } }, JSON.stringify(st));
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(String(e)));
  /* zegar zatrzymany: po install czas płynie realnie, a zrzut klatki trwa ok. 0,3 s — animacja przesuwa się tylko przez runFor (klatki deterministyczne) */
  await page.clock.install({ time: new Date('2026-11-08T12:00:00Z') }); await page.clock.pauseAt(new Date('2026-11-08T12:00:01Z'));
  await page.goto(`http://127.0.0.1:${PORT}/exercise/${ex.id}`); await page.clock.runFor(2000);
  const sel = id => page.locator(`[data-testid="${id}"]`);
  /* ekran wprowadzenia może pojawić się z opóźnieniem i przykryć kartę; sekcja „Technika” bywa domyślnie zwinięta — kilka prób z przebiegiem zegara */
  for (let proba = 0; proba < 6 && !(await sel('exercise-figure-v2-anim').count()); proba++) {
    if (await sel('intro-skip').count()) { await sel('intro-skip').first().click({ force: true }); await page.clock.runFor(800); continue; }
    await sel('exercise-cues-toggle').first().click({ force: true }); await page.clock.runFor(800);
  }
  if (!(await sel('exercise-figure-v2-anim').count())) {
    const ids = await page.evaluate(() => [...document.querySelectorAll('[data-testid]')].map(e => e.dataset.testid).filter(x => /figure|cues|intro/.test(x)).join(' '));
    throw new Error(`karta „${f.cwiczenie}” [${l}] bez animowanego rysunku v2 (elementy: ${ids || 'brak'}; ${errs.join('; ') || 'brak błędów strony'})`);
  }
  await sel('exercise-figure-v2-anim').first().scrollIntoViewIfNeeded();
  /* faza bieżąca licznika = tekst pogrubiony (pauza nie jest wyróżniana: indeks −1). Synchronizacja: pierwszy takt pierwszej fazy ruchu (indeks 0) po pauzie —
     ms pętli = holdMs z dokładnością do taktu 33 ms (anim.ts: pętla zaczyna się pauzą TEMPO.holdMs) */
  const fazaBiezaca = () => page.evaluate(() => [...document.querySelectorAll('[data-testid="exercise-figure-v2-phases"] > *')].findIndex(e => Number(getComputedStyle(e).fontWeight) >= 600));
  const zegar = ms => page.clock.runFor(ms);
  const synchronizuj = async () => {
    let p = await fazaBiezaca(), n = 0;
    while (p === 0 && n++ < 200) { await zegar(33); p = await fazaBiezaca(); } /* w środku fazy 0 — najpierw ją opuść */
    while (p !== 0 && n++ < 400) { await zegar(33); p = await fazaBiezaca(); }
    if (p !== 0) throw new Error('brak synchronizacji z licznikiem faz');
  };
  /* naciśnięcie przy zatrzymanym zegarze: klik Playwright czeka na „stabilność” (requestAnimationFrame stoi), więc klawisz Enter na przycisku z fokusem */
  const nacisnij = async loc => { await loc.focus(); await page.keyboard.press('Enter'); await page.clock.runFor(KROK_KLIKNIECIA); };
  const pokazBlad = async wlacz => {
    const on = (await sel('exercise-figure-v2-error').count()) > 0;
    /* Pressable (react-native-web) rozstrzyga dotknięcie na timerach — po kliknięciu krótki krok zegara; ten krok przesuwa też animację, więc liczy się do czasu */
    if (on !== wlacz) await nacisnij(sel('exercise-figure-v2-error-toggle').first());
    if (wlacz) { const inny = sel(`exercise-figure-v2-error-${f.blad.replace(':', '')}`); if (await inny.count()) await nacisnij(inny.first()); }
    return (await sel('exercise-figure-v2-error').count()) > 0 === wlacz;
  };
  const svgs = () => sel('exercise-figure-v2-anim').first().locator('svg');
  /** Zrzut każdego widoku (svg komponentu) + środki znaczków, których etykieta dostępności zawiera tekst wskazówki — w pikselach CSS widoku. */
  const zrzut = async (tekstWyroznienia, rodzaj) => {
    const out = []; const n = await svgs().count();
    for (let i = 0; i < n; i++) {
      const svg = svgs().nth(i); const box = await svg.boundingBox(); const png = await svg.screenshot({ type: 'png' });
      const znaczki = tekstWyroznienia ? await svg.evaluate((el, [txt, rodz]) => {
        const r = el.getBoundingClientRect();
        return [...el.parentElement.querySelectorAll('[data-testid^="exercise-figure-v2-badge-"]')].filter(b => (b.getAttribute('aria-label') ?? '').includes(txt))
          .map(b => { const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2 - r.x, y: q.y + q.height / 2 - r.y, rodzaj: rodz }; });
      }, [tekstWyroznienia, rodzaj]) : [];
      out.push({ src: 'data:image/png;base64,' + png.toString('base64'), w: box.width, h: box.height, znaczki });
    }
    return out;
  };
  return { ctx, zegar, synchronizuj, pokazBlad, zrzut, errs };
}

const outDir = path.resolve(arg('out', path.join(ROOT, '.filmy'))); fs.mkdirSync(outDir, { recursive: true });
const tylkoKlatki = arg('klatki') ? new Set(String(arg('klatki')).split(',').map(Number)) : null;
try {
  for (const f of filmy) for (const l of langs) {
    const t0 = Date.now(); const plan = planKlatek(f, cfg, v2); const tx = tekstyFilmu(f, l, cfg, dane);
    const karta = await kartaCwiczenia(f, l);
    if (!(await karta.pokazBlad(true))) throw new Error(`nie udało się włączyć błędu „${f.blad}” na karcie`); await karta.synchronizuj();
    /* ms pętli ≈ holdMs; dojście do startu planu, żeby błąd był widoczny od pierwszej klatki */
    const loop = v2.loopLength(plan.spec.lowerFirst, v2.tempoFor(plan.spec, f.blad));
    await karta.zegar((((plan.startMs - v2.TEMPO.holdMs) % loop) + loop) % loop);
    const komp = await browser.newPage({ viewport: { width: d.szerokosc, height: d.wysokosc }, deviceScaleFactor: 1 });
    await komp.setContent(strona(f, l)); await komp.evaluate(() => document.fonts.ready);
    const plik = path.join(outDir, `${f.id}-${l}.mp4`);
    const ff = tylkoKlatki ? null : spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(d.fps), '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', plik], { stdio: ['pipe', 'inherit', 'inherit'] });
    const done = ff ? new Promise((res, rej) => ff.on('close', c => (c === 0 ? res() : rej(new Error('ffmpeg kod ' + c))))) : Promise.resolve();
    let poprzedniT = 0; let faza = 'blad';
    for (const k of plan.klatki) {
      if (k.t > poprzedniT) { await karta.zegar(k.t - poprzedniT); poprzedniT = k.t; }
      if (k.faza !== faza) {
        /* przełączenie w aplikacji zabiera KROK_KLIKNIECIA zegara — cofamy go z następnego kroku, żeby oś czasu filmu się nie przesunęła */
        if (!(await karta.pokazBlad(false))) throw new Error('nie udało się wyłączyć błędu na karcie'); faza = k.faza; poprzedniT += KROK_KLIKNIECIA;
      }
      const wyroznij = k.koniec || !k.napis ? null : k.faza === 'blad' ? [tx.blad, 'err'] : [tx.poprawnie, 'ok'];
      const obrazy = await karta.zrzut(wyroznij?.[0], wyroznij?.[1]);
      await komp.evaluate(a => { window.ukladKlatki(a); return Promise.all([...document.images].map(i => i.decode())); }, { obrazy, klasa: klasa(k), uklad: d.uklad, gap: 30, promien: 34 });
      const png = await komp.screenshot({ type: 'png' });
      if (tylkoKlatki) { if (tylkoKlatki.has(k.i)) fs.writeFileSync(path.join(outDir, `${f.id}-${l}-${d.uklad}-k${k.i}.png`), png); if (k.i >= Math.max(...tylkoKlatki)) break; continue; }
      if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));
    }
    if (ff) ff.stdin.end(); await done; await komp.close(); await karta.ctx.close();
    if (karta.errs.length) console.error(`Uwaga [${l}]: błędy strony web: ${karta.errs.slice(0, 3).join(' | ')}`);
    console.log(`${tylkoKlatki ? outDir + ' (klatki ' + [...tylkoKlatki].join(',') + ')' : plik} — ${f.id} [${l}], ${(Date.now() - t0) / 1000} s`);
  }
} finally { await browser.close(); srv.close(); sprzatnij(); }
