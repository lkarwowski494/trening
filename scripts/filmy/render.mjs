// Automat krótkich filmów o technice (ZB-047): MP4 1080×1920 z animacji ćwiczenia (silnik figur v2) i tekstów z danych aplikacji.
// Użycie:
//   node scripts/filmy/render.mjs --film <id> --jezyk pl [--out .filmy] [--konfig scripts/filmy/filmy.json]
//   node scripts/filmy/render.mjs --film <id> --jezyk pl --plan      → tylko kontrola i plan (JSON na stdout, bez przeglądarki i ffmpeg)
//   node scripts/filmy/render.mjs --film <id> --jezyk pl --klatka 0  → HTML jednej klatki na stdout (test, podgląd)
//   node scripts/filmy/render.mjs --wszystkie --jezyk pl,en          → wszystkie filmy w podanych językach
// Wymaga: playwright (Chromium) i ffmpeg z libx264 — tylko przy renderze MP4. Publikuje właściciel (docs/18 07.11.2026); automat niczego nie wysyła.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { loadV2 } from '../figures/v2-build.mjs';
import { ROOT, daneRepo, problemyFilmu, planKlatek, svgFigury, tekstyFilmu, htmlStrony } from './kompozycja.mjs';

const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i >= 0 ? argv[i + 1] : d; };
const has = n => argv.includes('--' + n);
const cfg = JSON.parse(fs.readFileSync(path.resolve(arg('konfig', path.join(ROOT, 'scripts/filmy/filmy.json'))), 'utf8'));
const langs = String(arg('jezyk', 'pl')).split(',');
const filmy = has('wszystkie') ? cfg.filmy : cfg.filmy.filter(f => f.id === arg('film'));
if (!filmy.length) { console.error(`Nie ma filmu „${arg('film')}” w konfiguracji (dostępne: ${cfg.filmy.map(f => f.id).join(', ')})`); process.exit(2); }

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'filmy-v2-'));
let v2, tokens;
try { ({ v2, tokens } = loadV2(tmp)); } finally { /* moduły już wczytane do pamięci */ }
const dane = daneRepo();
const d = cfg.domyslne;
const pal = v2.figurePalette(tokens[d.motyw]);
const dataUri = (f, mime) => `data:${mime};base64,${fs.readFileSync(path.join(ROOT, f)).toString('base64')}`;
const sprzatnij = () => fs.rmSync(tmp, { recursive: true, force: true });

/* kontrola wszystkich filmów przed renderem — błąd w definicji przerywa całość (kod 1) */
const bledy = filmy.flatMap(f => langs.flatMap(l => problemyFilmu(f, l, cfg, v2, dane).map(p => `${f.id} [${l}]: ${p}`)));
if (bledy.length) { console.error('Odmowa — definicja filmu niezgodna z danymi aplikacji:\n- ' + bledy.join('\n- ')); sprzatnij(); process.exit(1); }

const FIG_W = d.szerokosc - 80, FIG_H = 840;
const strona = (f, l) => htmlStrony(tekstyFilmu(f, l, cfg, dane), tokens, d, dataUri('assets/icon.png', 'image/png'), dataUri('assets/fonts/BarlowCondensed-Bold.ttf', 'font/ttf'));
const figura = (plan, f, k) => svgFigury(v2, plan.spec, k.u, k.faza === 'blad' ? f.blad : undefined, f.blad, pal, FIG_W, FIG_H, f.widoki);

if (has('plan')) {
  const out = filmy.flatMap(f => langs.map(l => {
    const plan = planKlatek(f, cfg, v2); const tx = tekstyFilmu(f, l, cfg, dane);
    return { film: f.id, jezyk: l, klatek: plan.klatki.length, fps: d.fps, startMs: plan.startMs, zmianaMs: plan.zmianaMs, koniecOdMs: plan.koniecOdMs,
      fazy: [...new Set(plan.klatki.map(k => k.faza))], klatki_koniec: plan.klatki.filter(k => k.koniec).length,
      /* liczba znaczników ✕ na pierwszej klatce (wszystkie widoki) — błąd widoczny pod hakiem od 0 s */
      znaczniki_bledu_klatka0: (f.widoki ?? plan.spec.views).reduce((n, v) => n + v2.shapesAt(plan.spec, plan.klatki[0].u, v, false, f.blad).filter(s => s.id === 'errorRing').length, 0),
      waga_bledu_klatka0: Math.round(v2.faultWeight(plan.spec, plan.klatki[0].u) * 100) / 100,
      teksty: tx, stan_haka: f.haki[l].stan, stan_tekstow: cfg.teksty_stan?.[l] ?? null };
  }));
  sprzatnij(); process.stdout.write(JSON.stringify(out, null, 2) + '\n', () => process.exit(0)); /* exit dopiero po opróżnieniu potoku */
  await new Promise(() => {});
}

if (arg('klatka') !== undefined) {
  const f = filmy[0], l = langs[0]; const plan = planKlatek(f, cfg, v2); const k = plan.klatki[Number(arg('klatka'))];
  const html = strona(f, l).replace('<div id="fig"></div>', `<div id="fig">${figura(plan, f, k)}</div>`).replace('<body class="blad">', `<body class="${k.faza}${k.koniec ? ' na-koncu' : ''}">`);
  sprzatnij(); process.stdout.write(html, () => process.exit(0));
  await new Promise(() => {});
}

const { chromium } = createRequire(import.meta.url)('playwright');
const outDir = path.resolve(arg('out', path.join(ROOT, '.filmy'))); fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
try {
  for (const f of filmy) for (const l of langs) {
    const t0 = Date.now(); const plan = planKlatek(f, cfg, v2);
    const plik = path.join(outDir, `${f.id}-${l}.mp4`);
    const page = await browser.newPage({ viewport: { width: d.szerokosc, height: d.wysokosc }, deviceScaleFactor: 1 });
    await page.setContent(strona(f, l)); await page.evaluate(() => document.fonts.ready);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(d.fps), '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', plik], { stdio: ['pipe', 'inherit', 'inherit'] });
    const done = new Promise((res, rej) => ff.on('close', c => (c === 0 ? res() : rej(new Error('ffmpeg kod ' + c)))));
    for (const k of plan.klatki) {
      await page.evaluate(([svg, cls]) => { document.getElementById('fig').innerHTML = svg; document.body.className = cls; }, [figura(plan, f, k), k.faza + (k.koniec ? ' na-koncu' : '')]);
      const png = await page.screenshot({ type: 'png' });
      if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end(); await done; await page.close();
    console.log(`${plik} — ${plan.klatki.length} klatek, ${(Date.now() - t0) / 1000} s renderu`);
  }
} finally { await browser.close(); sprzatnij(); }
