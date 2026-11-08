// Automat krótkich filmów o technice (ZB-047) — część bez przeglądarki: kontrola definicji filmu, plan klatek, SVG figury i strona HTML klatki.
// Render do MP4: scripts/filmy/render.mjs. Decyzje właściciela (docs/18, 07.11.2026 ~20:30, ~21:45, ~23:00):
//  - tylko rodziny po recenzji (L-047) i wskazówki z danych ćwiczenia (rejestr twierdzeń), nic dopisanego ręcznie;
//  - animacja od pierwszej klatki, błąd (✕) widoczny już pod hakiem, bez statycznej planszy;
//  - nazwa ćwiczenia od 0 s: angielska + lokalna pod nią (lokalna tylko po recenzji nazw, ZB-044);
//  - logo i podpis „Animacja: aplikacja …” na ostatnich ok. 1,5 s animacji, bez zachęty „pobierz” i bez „apps4brew”.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const readJson = rel => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));

/** Dane wejściowe z repo (jedno miejsce): wskazówki ćwiczeń, teksty wskazówek w języku, nazwy aplikacji w sklepie. */
export function daneRepo() {
  const cues = readJson('lib/cues/data.json');
  const names = readJson('store/app-store-names.json');
  const textCache = new Map();
  const cueText = lang => { if (!textCache.has(lang)) { const f = path.join(ROOT, 'lib/cues/text', `${lang}.json`); textCache.set(lang, fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null); } return textCache.get(lang); };
  /* nazwa aplikacji w języku = część nazwy w sklepie przed dwukropkiem (APP_NAME, store/app-store-names.json) */
  const appName = lang => { const map = names.names ?? names; const k = Object.keys(map).find(x => x === lang || x.startsWith(lang + '-')); return k ? String(map[k]).split(':')[0].trim() : null; };
  return { cues, cueText, appName };
}

/** Lista problemów definicji filmu w języku (pusta = film można zrobić). */
export function problemyFilmu(film, lang, cfg, v2, dane) {
  const p = [];
  const spec = v2.figureSpec(film.cwiczenie);
  if (!spec) p.push(`ćwiczenie „${film.cwiczenie}” nie ma figury v2`);
  else if (!v2.shownFigureSpec(film.cwiczenie)) p.push(`rodzina „${spec.family}” bez aktualnej recenzji — film tylko z rodzin po recenzji (L-047, CLAUDE.md)`);
  else if (!v2.faultApplicable(spec, film.blad)) p.push(`błąd „${film.blad}” nie dotyczy rysunku „${film.cwiczenie}”`);
  if ('widoki' in film) p.push('pole „widoki” niedozwolone — film pokazuje wszystkie widoki ćwiczenia (właściciel 08.11.2026)');
  const own = dane.cues.exercises?.[film.cwiczenie];
  if (!own) p.push(`ćwiczenie „${film.cwiczenie}” nie ma własnych wskazówek w lib/cues/data.json`);
  else {
    const mistakes = (own.mistakes ?? []).map(r => r.c); const ok = ['setup', 'move', 'tips'].flatMap(s => (own[s] ?? []).map(r => r.c));
    if (!mistakes.includes(film.wskazowka_bledu)) p.push(`wskazówka błędu „${film.wskazowka_bledu}” nie należy do częstych błędów „${film.cwiczenie}”`);
    else if (v2.CUE_TO_ERROR[film.wskazowka_bledu] !== film.blad) p.push(`wskazówka „${film.wskazowka_bledu}” nie opisuje błędu rysunku „${film.blad}”`);
    if (!ok.includes(film.wskazowka_poprawna)) p.push(`wskazówka „${film.wskazowka_poprawna}” nie należy do wskazówek „${film.cwiczenie}”`);
  }
  const texts = dane.cueText(lang);
  if (!texts) p.push(`brak tekstów wskazówek w języku „${lang}” (lib/cues/text)`);
  else for (const c of [film.wskazowka_bledu, film.wskazowka_poprawna]) if (!texts[c]) p.push(`brak tekstu „${c}” w lib/cues/text/${lang}.json`);
  if (!film.haki?.[lang]?.tekst) p.push(`brak haka w języku „${lang}”`);
  if (!cfg.teksty?.[lang]) p.push(`brak tekstów stałych (podpis, Błąd, Poprawnie) w języku „${lang}”`);
  if (!dane.appName(lang)) p.push(`brak nazwy aplikacji dla „${lang}” w store/app-store-names.json`);
  return p;
}

/** Pozycja ruchu u w chwili ms — ta sama reguła co ekran ćwiczenia (components/ExerciseFigureV2.tsx). */
export function uW(v2, spec, ms, tempo) {
  const loop = v2.loopOf(spec);
  return loop === 'cykl_lustro' ? v2.cycleAt(ms) : loop === 'jednokierunkowa' ? v2.oneWayAt(ms) : v2.uAt(ms, spec.lowerFirst, tempo);
}

/**
 * Plan klatek: faza „blad” (✕ od pierwszej klatki) → „poprawnie”; ostatnie koniec_s sekund z logo i podpisem na trwającej animacji.
 * Start zegara błędu: pierwsza chwila pętli, w której waga błędu ≥ 0,6 (błąd widać od razu, bez czekania na zejście).
 * Zmiana fazy: w oknie ±1 s wokół blad_do_s chwila najbliższa pozycji wyjściowej (najmniejsze u), żeby przejście nie skakało pozą.
 */
export function planKlatek(film, cfg, v2) {
  const spec = v2.shownFigureSpec(film.cwiczenie); const d = cfg.domyslne;
  const n = Math.round(d.sekundy * d.fps); const dt = 1000 / d.fps;
  const tBlad = v2.tempoFor(spec, film.blad); const tOk = v2.tempoFor(spec);
  const loopMs = v2.loopLength(spec.lowerFirst, tBlad);
  let start = 0; for (let ms = 0; ms < loopMs; ms += dt) if (v2.faultWeight(spec, uW(v2, spec, ms, tBlad)) >= 0.6) { start = ms; break; }
  const target = d.blad_do_s * 1000; let zmiana = target, best = Infinity;
  for (let ms = target - 1000; ms <= target + 1000; ms += dt) { const u = uW(v2, spec, start + ms, tBlad); if (u < best - 1e-9) { best = u; zmiana = ms; } }
  const koniecOd = (d.sekundy - d.koniec_s) * 1000; const klatki = [];
  for (let i = 0; i < n; i++) {
    const t = i * dt; const blad = t < zmiana;
    /* po zmianie zegar poprawnej animacji startuje w tej samej pozycji (u minimalne) — bez skoku */
    const u = blad ? uW(v2, spec, start + t, tBlad) : uW(v2, spec, t - zmiana, tOk);
    klatki.push({ i, t: Math.round(t), faza: blad ? 'blad' : 'poprawnie', koniec: t >= koniecOd, u: Math.round(u * 1e4) / 1e4 });
  }
  return { spec, klatki, startMs: Math.round(start), zmianaMs: Math.round(zmiana), koniecOdMs: koniecOd };
}

/** SVG figury: wszystkie widoki ćwiczenia obok siebie, jak na karcie w aplikacji (właściciel 08.11.2026), wspólny kadr całej pętli z pozą błędu — rysunek nie skacze. */
export function svgFigury(v2, spec, u, error, kadrBledu, pal, maxW, maxH) {
  const views = spec.views; const boxes = views.map(v => v2.boxFor(spec, v, [kadrBledu]));
  const gap = 0.06; const sumW = boxes.reduce((a, b) => a + b.w, 0) * (1 + gap * (views.length - 1) / views.length); const h = Math.max(...boxes.map(b => b.h));
  const scale = Math.min(maxW / sumW, maxH / h);
  const parts = views.map((v, k) => v2.svgDocument(v2.shapesAt(spec, u, v, false, error), boxes[k], pal, scale));
  return `<div class="widoki">${parts.join('')}</div>`;
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Teksty filmu w języku — wszystkie z danych (hak z filmy.json, wskazówki z lib/cues/text, nazwa aplikacji ze sklepu). */
export function tekstyFilmu(film, lang, cfg, dane) {
  const t = cfg.teksty[lang]; const cue = dane.cueText(lang); const app = dane.appName(lang);
  return { hak: film.haki[lang].tekst, nazwa: film.cwiczenie, nazwaLokalna: film.nazwa_lokalna?.[lang] ?? '', blad: cue[film.wskazowka_bledu], poprawnie: cue[film.wskazowka_poprawna],
    etykietaBlad: t.blad, etykietaOk: t.poprawnie, podpis: t.podpis.replace('{app}', app), app };
}

/** Strona HTML jednej klatki: układ stały, zmienia się figura (#fig) i klasy body (faza, koniec). Czcionka i ikona z assets/. */
export function htmlStrony(tx, tokens, d, ikonaDataUri, fontDataUri) {
  const c = tokens[d.motyw];
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Barlow;src:url(${fontDataUri});font-weight:700}
*{margin:0;box-sizing:border-box}
body{width:${d.szerokosc}px;height:${d.wysokosc}px;overflow:hidden;background:${c.bg};color:${c.text};font-family:Barlow,sans-serif;font-weight:700;position:relative}
.hak{position:absolute;top:140px;left:70px;right:70px;font-size:76px;line-height:1.08;text-align:center}
.nazwa{position:absolute;top:430px;left:70px;right:70px;text-align:center}
.nazwa .en{font-size:64px;color:${c.accent};letter-spacing:.5px}
.nazwa .lok{font-size:44px;color:${c.muted};margin-top:6px}
#fig{position:absolute;top:580px;left:40px;right:40px;height:840px;display:flex;align-items:center;justify-content:center}
.widoki{display:flex;gap:40px;align-items:flex-end}
.pasek{position:absolute;top:1430px;left:70px;right:70px;font-size:52px;line-height:1.12;text-align:center}
.pasek .znak{display:inline-block;margin-right:14px}
.pasek.b{color:${c.danger}} .pasek.ok{color:${c.doneLine}}
body.blad .pasek.ok,body.poprawnie .pasek.b{display:none}
.koniec{position:absolute;left:0;right:0;top:1440px;display:none;flex-direction:column;align-items:center;gap:22px}
body.na-koncu .koniec{display:flex} body.na-koncu .pasek{display:none}
.koniec img{width:150px;height:150px;border-radius:34px}
.koniec div{font-size:48px;color:${c.text}}
</style></head><body class="blad">
<div class="hak">${esc(tx.hak)}</div>
<div class="nazwa"><div class="en">${esc(tx.nazwa)}</div>${tx.nazwaLokalna ? `<div class="lok">${esc(tx.nazwaLokalna)}</div>` : ''}</div>
<div id="fig"></div>
<div class="pasek b"><span class="znak">✕</span>${esc(tx.etykietaBlad)}: ${esc(tx.blad)}</div>
<div class="pasek ok"><span class="znak">✓</span>${esc(tx.etykietaOk)}: ${esc(tx.poprawnie)}</div>
<div class="koniec"><img src="${ikonaDataUri}" alt=""><div>${esc(tx.podpis)}</div></div>
</body></html>`;
}
