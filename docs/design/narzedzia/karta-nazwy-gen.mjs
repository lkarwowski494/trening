// karta-nazwy-gen.mjs — makiety nagłówka karty ćwiczenia z nazwą angielską i lokalną (decyzja właściciela 07.11.2026, ZB-044).
// Użycie: node docs/design/narzedzia/karta-nazwy-gen.mjs <katalog-wyjścia>  → karta-nazwy.html (wszystkie stany jako <main data-ekran>).
// Barwy z lib/tokens.ts (light/dark/lightHC/darkHC), skala z TYPE (largeTitle 34/38, navTitle 20/24, callout 15/20, body 17/22, footnote 13/18).
// Teksty interfejsu z lib/i18n (pl), lib/locales/de.json, lib/locales/lv.json; nazwy oznaczone [PRZYKŁAD] nie istnieją w katalogu.
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const OUT = resolve(process.argv[2] ?? resolve(ROOT, 'docs/design/karta-nazwy'));
mkdirSync(OUT, { recursive: true });
const FONTY = relative(OUT, resolve(ROOT, 'docs/design/fonty'));

/* palety z lib/tokens.ts (przepisane wartości; kontrast liczony w karta-nazwy-kontrast.json) */
const tok = readFileSync(resolve(ROOT, 'lib/tokens.ts'), 'utf8');
const pal = (name) => { const m = tok.match(new RegExp(`export const ${name}: Palette = \\{([\\s\\S]*?)\\};`)); return Object.fromEntries([...m[1].matchAll(/(\w+): '(#[0-9A-Fa-f]{6})'/g)].map((x) => [x[1], x[2]])); };
const P = { light: pal('light'), dark: pal('dark') };
P.lightHC = { ...P.light, ...pal('lightHC') }; P.darkHC = { ...P.dark, ...pal('darkHC') };

const loc = (l) => JSON.parse(readFileSync(resolve(ROOT, `lib/locales/${l}.json`), 'utf8'));
const DE = loc('de'), LV = loc('lv');
const T = (l, k) => (l === 'pl' ? k : (l === 'de' ? DE : LV)[k] ?? k);

/* przypadki: en = nazwa wyświetlana (lib/nazwy-en.generated.ts / EX_FULL), lokalna = nazwa w języku interfejsu */
const CASES = {
  'pl-390': { l: 'pl', w: 390, th: 'light', en: 'Standing Cable Chest Press', lok: 'Wyciskanie na linkach (stojąc)', group: 'klatka', eq: 'linki', note: 'nazwa lokalna = obecna nazwa z katalogu (lib/i18n.ts:133, EX_FULL)' },
  'pl-390-ciemny': { l: 'pl', w: 390, th: 'dark', en: 'Standing Cable Chest Press', lok: 'Wyciskanie na linkach (stojąc)', group: 'klatka', eq: 'linki' },
  'pl-320-dluga': { l: 'pl', w: 320, th: 'dark', en: 'Lying Close-Grip Barbell Triceps Extension Behind the Head', lok: 'Wyprost ramion ze sztangą w leżeniu za głowę, wąski chwyt', przyklad: true, group: 'triceps', eq: 'sztanga', note: 'najdłuższa nazwa EN w katalogu (58 znaków); polska nazwa [PRZYKŁAD] — w katalogu jest prawie ta sama angielska' },
  'pl-390-duplikat': { l: 'pl', w: 390, th: 'light', en: 'Bench Press', lok: 'Bench Press (sztanga)', group: 'klatka', eq: 'sztanga', note: 'typowy stan katalogu PL dziś: „polska” nazwa = angielska + dopisek sprzętu' },
  'de-320': { l: 'de', w: 320, th: 'dark', en: 'Lying Close-Grip Barbell Triceps Extension Behind the Head', lok: 'Enges Langhantel-Trizepsdrücken im Liegen hinter den Kopf', przyklad: true, group: 'triceps', eq: 'sztanga', note: 'brak niemieckich nazw w repo — nazwa [PRZYKŁAD]' },
  'wlasne-390': { l: 'pl', w: 390, th: 'light', en: null, own: 'Wiosłowanie na TRX przy drzwiach', przyklad: true, group: 'plecy', eq: 'masa ciała', note: 'ćwiczenie własne: jedna nazwa, jak wpisana' },
  'lv-390': { l: 'lv', w: 390, th: 'light', en: 'Standing Cable Chest Press', lok: null, group: 'klatka', eq: 'linki', note: 'język bez nazwy lokalnej: sama angielska' },
  'pl-390-ax5': { l: 'pl', w: 390, th: 'light', ax5: true, en: 'Standing Cable Chest Press', lok: 'Wyciskanie na linkach (stojąc)', group: 'klatka', eq: 'linki', note: 'tekst AX5: tytuł do 13% szerokości (titleMaxScale), opis do 200%' },
  'pl-390-hc': { l: 'pl', w: 390, th: 'lightHC', en: 'Standing Cable Chest Press', lok: 'Wyciskanie na linkach (stojąc)', group: 'klatka', eq: 'linki', note: 'Zwiększ kontrast (lightHC)' },
  'pl-320-ciemny-hc': { l: 'pl', w: 320, th: 'darkHC', en: 'Lying Close-Grip Barbell Triceps Extension Behind the Head', lok: 'Wyprost ramion ze sztangą w leżeniu za głowę, wąski chwyt', przyklad: true, group: 'triceps', eq: 'sztanga', note: 'Zwiększ kontrast (darkHC), długa nazwa' },
};
const LANG_LABEL = { pl: 'Po polsku', de: 'Auf Deutsch' }; // wariant B — NOWY tekst (do t() i 30 słowników)
const VAR = {
  A: { nazwa: 'A „Podpis”', opis: 'Nazwa lokalna pod tytułem: callout 15/20, kolor muted, w kolumnie tytułu obok „Edytuj”.' },
  B: { nazwa: 'B „Podpis z językiem”', opis: 'Pod tytułem „Po polsku: …” — etykieta muted, nazwa w kolorze tekstu, callout 15/20.' },
  C: { nazwa: 'C „Drugi tytuł”', opis: 'Nazwa lokalna krojem tytułu (navTitle 20/24, Barlow 700, muted) na całej szerokości pod wierszem z „Edytuj”.' },
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
function naglowek(v, c) {
  const lok = c.lok && c.lok.toLocaleLowerCase(c.l) !== (c.en ?? '').toLocaleLowerCase(c.l) ? c.lok : null; // reguła: identyczna (bez wielkości liter) → jedna linia
  const tytul = c.own ?? c.en;
  const h1 = `<h1 class="h1" lang="${c.own ? c.l : 'en'}">${esc(tytul)}</h1>`;
  const edytuj = `<button class="edytuj">${T(c.l, 'Edytuj')}</button>`;
  if (!lok || c.own) return `<div class="wiersz">${'<div class="kol">' + h1 + '</div>'}${edytuj}</div>`;
  if (v === 'A') return `<div class="wiersz"><div class="kol">${h1}<p class="lok-a" lang="${c.l}">${esc(lok)}</p></div>${edytuj}</div>`;
  if (v === 'B') return `<div class="wiersz"><div class="kol">${h1}<p class="lok-b" lang="${c.l}"><span class="et">${LANG_LABEL[c.l]}:</span> ${esc(lok)}</p></div>${edytuj}</div>`;
  return `<div class="wiersz"><div class="kol">${h1}</div>${edytuj}</div><p class="lok-c" lang="${c.l}">${esc(lok)}</p>`;
}
function ekran(v, id, c) {
  const l = c.l;
  return `<main data-ekran="${v}-${id}" data-w="${c.w}" data-th="${c.th}" ${c.ax5 ? 'data-ax5="1"' : ''} class="tel" style="--w:${c.w}px" aria-label="${VAR[v].nazwa}, ${id}">
<div class="sb"><span>9:41</span><span>●●● ▮</span></div>
<div class="nav"><span class="wroc" aria-label="${T(l, 'Wróć')}">←</span><span class="nav-t">${T(l, 'Ćwiczenie')}</span></div>
<div class="tresc">${naglowek(v, c)}
<div class="linia"></div>
<div class="tech"><span>${T(l, 'Technika')}</span><span class="m">▸</span></div>
<div class="row"><div class="lab">${T(l, 'Partia')}</div><div>${T(l, c.group)}</div></div>
<div class="row"><div class="lab">${T(l, 'Sprzęt')}</div><div>${T(l, c.eq)}</div></div>
</div>
<p class="przyklad">${VAR[v].nazwa} · ${id}${c.przyklad ? ' · [PRZYKŁAD] nazwa spoza katalogu' : ''}</p>
</main>`;
}
const vars = (p) => Object.entries(p).map(([k, x]) => `--${k}:${x}`).join(';');
const css = `
@font-face { font-family: 'Barlow Condensed'; src: url('${FONTY}/barlow-condensed/BarlowCondensed-Bold.ttf'); font-weight: 700; }
@font-face { font-family: 'Tresc'; src: url('${FONTY}/source-sans-3/SourceSans3-var.ttf'); font-weight: 200 900; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #d9dbdd; padding: 24px; font-family: 'Tresc', sans-serif; }
.uklad { display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-start; }
.tel { width: var(--w); background: var(--bg); color: var(--text); display: flex; flex-direction: column; --dt-tytul: 1; --dt-opis: 1; }
.tel[data-ax5] { --dt-opis: 2; }
${['light', 'dark', 'lightHC', 'darkHC'].map((t) => `.tel[data-th="${t}"] { ${vars(P[t])} }`).join('\n')}
.sb { display: flex; justify-content: space-between; height: 44px; align-items: center; padding: 0 24px; font-weight: 600; font-size: 15px; }
.nav { display: flex; align-items: center; gap: 24px; height: 44px; padding: 0 16px; }
.wroc { font-size: 24px; width: 28px; }
.nav-t { font-family: 'Barlow Condensed'; font-weight: 700; font-size: calc(20px * min(var(--dt-opis), 1.4)); }
.tresc { padding: 10px 16px 16px; }
.wiersz { display: flex; align-items: flex-start; gap: 8px; }
.kol { flex: 1; min-width: 0; }
.h1 { font-family: 'Barlow Condensed'; font-weight: 700; font-size: calc(34px * var(--dt-tytul)); line-height: 1.1176; overflow-wrap: break-word; }
.edytuj { flex: none; margin-top: calc((38px * var(--dt-tytul) - 44px) / 2); min-height: 44px; padding: 0 14px; border: 0; border-radius: 10px; background: var(--surface2); color: var(--text); font: 600 calc(17px * min(var(--dt-opis), 1.4))/1.2 'Tresc'; }
.lok-a, .lok-b { margin-top: 4px; font-size: calc(15px * var(--dt-opis)); line-height: 1.3333; overflow-wrap: break-word; }
.lok-a { color: var(--muted); }
.lok-b { color: var(--text); } .lok-b .et { color: var(--muted); }
.lok-c { margin-top: 4px; font-family: 'Barlow Condensed'; font-weight: 700; font-size: calc(20px * var(--dt-tytul)); line-height: 1.2; color: var(--muted); overflow-wrap: break-word; }
.linia { height: 1px; background: var(--line); margin: 12px 0 0; }
.tech { display: flex; justify-content: space-between; align-items: center; min-height: 52px; font-size: calc(17px * var(--dt-opis)); font-weight: 600; }
.tech .m { color: var(--muted); font-weight: 400; }
.row { margin-bottom: 10px; font-size: calc(17px * var(--dt-opis)); line-height: 1.3; }
.row .lab { color: var(--muted); font-size: calc(13px * var(--dt-opis)); }
.przyklad { margin-top: auto; padding: 8px 16px 12px; font-size: 11px; color: var(--muted); border-top: 1px dashed var(--line); }
`;
/* AX5: tytuł ograniczony titleMaxScale (lib/theme.ts:81) = min(2, szer × 0,13 / 34) */
const ax = (w) => Math.max(1, Math.min(2, +((w * 0.13) / 34).toFixed(4)));
const html = `<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>Karta ćwiczenia — nazwa EN + lokalna</title><style>${css}
${Object.values(CASES).filter((c) => c.ax5).map((c) => `.tel[data-ax5][data-w="${c.w}"] { --dt-tytul: ${ax(c.w)}; }`).join('\n')}</style></head><body><div class="uklad">
${Object.keys(VAR).flatMap((v) => Object.entries(CASES).map(([id, c]) => ekran(v, id, c))).join('\n')}
</div></body></html>`;
writeFileSync(resolve(OUT, 'karta-nazwy.html'), html);
writeFileSync(resolve(OUT, 'karta-nazwy-przypadki.json'), JSON.stringify({ CASES, VAR }, null, 1));
console.log('zapisano', resolve(OUT, 'karta-nazwy.html'));
