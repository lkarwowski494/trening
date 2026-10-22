// Generator makiet E2b (M3, 21.10.2026): node docs/design/narzedzia/a-warianty-gen.mjs
// Zapisuje: docs/design/kierunki/a1-tablica.html, a2-tablica-talerze.html, a-serie.html, docs/design/kroje.html, docs/design/porownanie-a.html.
// Kierunek A wybrany na STOP E2 (docs/18, 21.10.2026). A1 = A jak w E2; A2 = A z subtelnym nawiązaniem do barw talerzy w tle wybranych okien.
// Bez zależności; zrzuty robi skrypt zrzuty.mjs (Playwright spoza projektu).
import { writeFileSync } from 'node:fs';
const KIER = new URL('../kierunki/', import.meta.url).pathname;
const DESIGN = new URL('../', import.meta.url).pathname;

// ---------- barwy ----------
const hex = (n) => '#' + n.map((x) => Math.round(x).toString(16).padStart(2, '0')).join('').toUpperCase();
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
/** Barwa nałożona na tło z kryciem a (wynik jako pełny hex — do pomiaru kontrastu). */
export const mix = (fg, bg, a) => hex(rgb(fg).map((c, i) => c * a + rgb(bg)[i] * (1 - a)));

// Talerze: lib/discColors.ts PLATE_COLORS (jasny) i lib/brandIcon.ts DARK_PLATES (ciemny wariant ikony) — te same, co ikona i intro.
const TALERZE = { jasny: ['#D7263D', '#1F5FD1', '#F2C230', '#2E9E5B'], ciemny: ['#E8414F', '#4A82F0', '#F2C230', '#3FBE72'] };
// Krycie nawiązania (A2). Dobrane okiem na zrzutach 390 pt; kontrast tekstu na każdej barwie mierzony (kontrast-a.json).
export const KRYCIE = { jasny: 0.16, ciemny: 0.2 };
const TLO = { jasny: '#E6E8E5', ciemny: '#161C24' };
export const TINT = Object.fromEntries(Object.entries(TALERZE).map(([m, t]) => [m, t.map((c) => mix(c, TLO[m], KRYCIE[m]))]));

// ---------- wspólny chrom (jak kierunki-gen.mjs E2) ----------
const minus = '<svg viewBox="0 0 20 20"><path d="M4 10h12" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
const plus = '<svg viewBox="0 0 20 20"><path d="M4 10h12M10 4v12" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
const kropki = '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg>';
const sb = `<div class="sb"><span>9:41</span><span class="sb-i" aria-hidden="true"><i style="width:17px;height:11px"></i><i style="width:15px;height:11px;border-radius:5px"></i><i style="width:25px;height:12px;border-radius:4px"></i></span></div>`;
const nag = `<header class="nag"><h1 class="nag-t">Góra A<span class="czas">24:13</span></h1><button class="ib" aria-label="Opcje treningu">${kropki}</button><button class="bt">Zakończ</button></header>`;
const ik = {
  t: '<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13" cy="14" r="9"/><path d="M13 9v5l3 2M10 2h6"/></svg>',
  p: '<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="20" height="18" rx="3"/><path d="M3 10h20M8 2v5M18 2v5"/></svg>',
  s: '<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 22V13M11 22V7M17 22v-6M23 22V4"/></svg>',
  w: '<svg viewBox="0 0 26 26" fill="currentColor"><circle cx="6" cy="13" r="2.2"/><circle cx="13" cy="13" r="2.2"/><circle cx="20" cy="13" r="2.2"/></svg>',
};
const zakl = (akt) => `<nav class="zakl">${[['t', 'Trening'], ['p', 'Plan'], ['s', 'Postępy'], ['w', 'Więcej']].map(([k, n]) => `<a${k === akt ? ' class="ak" aria-current="page"' : ''}>${ik[k]}${n}</a>`).join('')}</nav>`;
const pmE = (etyk, co, krok) => `<div class="pmg"><button class="pm" aria-label="Zmniejsz ${co} o ${krok}">${minus}</button><span class="pmw"><small>${etyk}</small></span><button class="pm" aria-label="Zwiększ ${co} o ${krok}">${plus}</button></div>`;
const pmEtyk = `<div class="pmp">${pmE('kg', 'ciężar', '2,5 kg')}${pmE('powt.', 'powtórzenia', '1')}</div>`;
const przerwaPrzyc = `<div class="prz"><button class="pm2">−15 s</button><button class="pm2">+15 s</button><button class="pm2 prim">Pomiń</button></div>`;
const DALEJ = [['Wiosłowanie hantlem', '3 × 10, 32 kg'], ['Wyciskanie hantli na ławce skośnej', '3 × 8, 26 kg'], ['Podciąganie nachwytem', '3 × 6–8']];
const dalej = `<section class="lista"><h2>Dalej</h2><ul>${DALEJ.map(([n, d]) => `<li><span class="n">${n}</span><span class="d">${d}</span></li>`).join('')}</ul></section>`;

// ---------- pola serii: reguła 1–12 i tryb zapasowy > 12 (decyzja właściciela 21.10.2026) ----------
// Etykiety jak lib/live.ts setMarkOf: rozgrzewka „W”, seria robocza „n”, drop „nD”. Seria przed `teraz` = zrobiona (makieta; pominięte serie bez zmian).
const POLA_JS = `
(function () {
  var GAP = 6, MIN = 36, MAXW = 3, LIMIT = 12;
  function dt(el) { var p = document.createElement('i'); p.style.cssText = 'position:absolute;visibility:hidden;width:calc(100px * var(--dt-liczba))'; el.appendChild(p); var v = p.offsetWidth / 100; p.remove(); return v || 1; }
  function rysuj(el) {
    var s = el.dataset.serie.split(','), cur = +el.dataset.teraz, w = (el.dataset.wyniki || '').split(','), n = s.length;
    el.innerHTML = ''; var d = dt(el), W = el.clientWidth, minW = MIN * d, font = 20 * d;
    var fit = Math.max(1, Math.floor((W + GAP) / (minW + GAP))), rows = 1, cols;
    var zapas = n > LIMIT; el.classList.toggle('zapas', zapas);
    if (zapas) { cols = n; el.style.gridTemplateColumns = 'repeat(' + n + ', ' + Math.max(minW, 44) + 'px)'; }
    else { while (rows < MAXW && Math.ceil(n / rows) > fit) rows++; cols = Math.min(Math.ceil(n / rows), fit); if (rows === 1) cols = Math.max(cols, Math.min(4, fit)); el.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)'; }
    var fw = zapas ? Math.max(minW, 44) : (W - GAP * (cols - 1)) / cols;
    var zr = 0, rozg = 0, rozgZr = 0;
    s.forEach(function (lab, i) {
      var f = document.createElement('span'); var stan = i < cur ? 'z' : i === cur ? 't' : 'p';
      f.className = 'pole ' + stan + (lab === 'W' ? ' w' : ''); var txt = lab;
      if (stan === 'z' && w[i] && rows === 1 && !zapas && w[i].length * 0.48 * font + 10 <= fw) txt = w[i];
      f.textContent = txt; el.appendChild(f);
      if (lab === 'W') { rozg++; if (i < cur) rozgZr++; } else if (i < cur) zr++;
    });
    var rob = n - rozg;
    el.setAttribute('aria-label', (rozg ? 'Rozgrzewki: ' + rozgZr + ' z ' + rozg + ' zrobione; ' : '') + 'serie: ' + zr + ' z ' + rob + ' zrobione' + (zapas ? '; lista serii przewijana' : ''));
    if (zapas) el.scrollLeft = Math.max(0, cur * (fw + GAP) - W / 2 + fw / 2);
  }
  function wszystkie() { document.querySelectorAll('.pola[data-serie]').forEach(rysuj); }
  window.addEventListener('load', wszystkie);
  new MutationObserver(wszystkie).observe(document.documentElement, { attributes: true });
  if (window.ResizeObserver) { var ro = new ResizeObserver(wszystkie); document.addEventListener('DOMContentLoaded', function () { document.querySelectorAll('.pola[data-serie]').forEach(function (e) { ro.observe(e); }); }); }
  document.addEventListener('DOMContentLoaded', wszystkie);
})();`;
const pola = (serie, teraz, wyniki = []) => `<div class="pola" role="img" data-serie="${serie.join(',')}" data-teraz="${teraz}" data-wyniki="${wyniki.join(',')}"></div>`;
const S4 = ['1', '2', '3', '4'];
const W4 = ['80×6', '80×6', '80×6', '80×6'];

// ---------- motyw talerzy (A2): geometria ikony (lib/brandIcon.ts, viewBox 120) ----------
const PL = [[30, 16, 15, 88, 4], [48, 23, 14, 74, 4], [65, 31, 12, 58, 4], [80, 38, 10, 44, 3]];
const sygnatura = (kl, { gryf = true } = {}) => `<svg class="${kl}" viewBox="0 0 120 120" aria-hidden="true" focusable="false">${gryf ? '<rect x="10" y="56" width="98" height="8" rx="2" fill="var(--motyw-gryf)"/>' : ''}${PL.map(([x, y, w, h, r], i) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="var(--m${i})"/>`).join('')}${gryf ? '<rect x="93" y="49" width="7" height="22" rx="2" fill="var(--motyw-gryf)"/>' : ''}</svg>`;

// ---------- motyw A (paleta z E2 bez zmian) ----------
const JASNY = `--bg: #E6E8E5; --tekst: #18202B; --tekst2: #4A5361; --linia: #CBD0CB; --pole: #D3D8D3; --powierzchnia: #F4F5F3; --przycisk: #13294B; --przycisk-tekst: #F5F1E6; --tablica: #13294B; --tablica-brzeg: #13294B; --tablica-tekst: #F5F1E6; --tablica-tekst2: #B7C1D0; --tablica-pole: #26446F; --zegar: #F2A900; --znacznik: #13294B; --r-przyc: 8px;`;
const CIEMNY = `--bg: #161C24; --tekst: #E8EAED; --tekst2: #A3ACB8; --linia: #2C3440; --pole: #283244; --powierzchnia: #1E2530; --przycisk: #F5F1E6; --przycisk-tekst: #13294B; --tablica: #102544; --tablica-brzeg: #5675A8; --tablica-tekst: #F5F1E6; --tablica-tekst2: #AEB9CA; --tablica-pole: #22416D; --zegar: #F5B21C; --znacznik: #E8EAED;`;
const motywVars = (m) => `--motyw-gryf: ${m === 'jasny' ? '#C2C8C2' : '#3A4452'}; ${TINT[m].map((c, i) => `--m${i}: ${c};`).join(' ')}`;

const fontFaces = `@font-face { font-family: 'Tablica'; src: url('FONTY/barlow-condensed/BarlowCondensed-SemiBold.ttf'); font-weight: 600; }
@font-face { font-family: 'Tablica'; src: url('FONTY/barlow-condensed/BarlowCondensed-Bold.ttf'); font-weight: 700; }`;
const kandydaciFF = `@font-face { font-family: 'Oswald'; src: url('FONTY/oswald/Oswald-var.ttf'); font-weight: 200 700; }
@font-face { font-family: 'Big Shoulders'; src: url('FONTY/big-shoulders/BigShoulders-var.ttf'); font-weight: 100 900; }
@font-face { font-family: 'Saira Condensed'; src: url('FONTY/saira-condensed/SairaCondensed-SemiBold.ttf'); font-weight: 600; }
@font-face { font-family: 'Saira Condensed'; src: url('FONTY/saira-condensed/SairaCondensed-Bold.ttf'); font-weight: 700; }
@font-face { font-family: 'Doto'; src: url('FONTY/doto/Doto-var.ttf'); font-weight: 100 900; }`;

const CSS = `
:root { --kroj-t: 'Tablica'; --krój-tytul: var(--kroj-t); --w-t1: 600; --w-t2: 700; }
.pmp { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(148px * var(--dt-liczba))), 1fr)); gap: 8px; }
.pmg { min-width: 0; display: flex; align-items: center; justify-content: space-between; gap: 4px; }
.pmw { font-weight: 700; font-size: calc(1.375rem * var(--dt-liczba)); text-align: center; flex: 1; min-height: 44px; display: grid; place-items: center; line-height: 1; }
.prz { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 96px), 1fr)); gap: 8px; }
.pm2 { min-height: 52px; padding: 4px 8px; white-space: nowrap; border-radius: var(--r-przyc); background: var(--pole); color: var(--tekst); font-weight: 700; font-size: calc(1.0625rem * var(--dt-opis)); }
.pm2.prim { background: var(--przycisk); color: var(--przycisk-tekst); }
.akcja { padding: 16px 16px 0; display: grid; gap: 8px; }
.akcja .opis { text-align: center; }
.tel { overflow-x: clip; }
.tel > * { position: relative; z-index: 1; }
.tab { margin: 4px 16px 0; background: var(--tablica); color: var(--tablica-tekst); border-radius: 8px; padding: 16px; border: 1px solid var(--tablica-brzeg); }
.tab-g { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; font-family: var(--kroj-t); flex-wrap: wrap; }
.tab-cw { font-size: calc(1.5rem * var(--dt-tytul)); text-transform: uppercase; letter-spacing: .04em; font-weight: var(--w-t1); line-height: 1.1; }
.tab-s { font-size: calc(1.125rem * var(--dt-opis)); color: var(--tablica-tekst2); white-space: nowrap; font-weight: var(--w-t1); }
.tab-l { display: flex; align-items: baseline; justify-content: center; gap: 10px; font-family: var(--kroj-t); font-weight: var(--w-t2); font-size: min(calc(6rem * var(--dt-liczba)), calc(var(--w, 390px) * 0.24)); line-height: .95; margin: 12px 0; flex-wrap: wrap; }
.tab-l small { font-size: .3em; font-weight: var(--w-t1); color: var(--tablica-tekst2); }
.tab-l .x { font-size: .45em; color: var(--tablica-tekst2); font-weight: var(--w-t1); }
.tab-l.zeg { color: var(--zegar); font-size: min(calc(7rem * var(--dt-liczba)), calc(var(--w, 390px) * 0.3)); }
.tab .pm { background: var(--tablica-pole); color: var(--tablica-tekst); }
.tab .pmw small { font-family: var(--kroj-t); font-size: calc(1.125rem * var(--dt-opis)); color: var(--tablica-tekst); font-weight: var(--w-t1); }
.pola { display: grid; gap: 6px; margin-top: 12px; position: relative; }
.pola.zapas { overflow-x: auto; scrollbar-width: none; -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 24px, #000 calc(100% - 32px), transparent); mask-image: linear-gradient(90deg, transparent 0, #000 24px, #000 calc(100% - 32px), transparent); }
.pole { min-height: calc(44px * var(--dt-liczba)); border-radius: 4px; display: grid; place-items: center; font-family: var(--kroj-t); font-size: calc(1.25rem * var(--dt-liczba)); font-weight: var(--w-t2); white-space: nowrap; }
.pole.z { background: var(--tablica-tekst); color: var(--tablica); }
.pole.t { box-shadow: inset 0 0 0 3px var(--zegar); }
.pole.p { box-shadow: inset 0 0 0 1px var(--tablica-tekst2); color: var(--tablica-tekst2); font-weight: var(--w-t1); }
.pole.w.p { box-shadow: none; outline: 1px dashed var(--tablica-tekst2); outline-offset: -1px; }
.nast { font-family: var(--kroj-t); font-weight: var(--w-t1); text-align: center; font-size: calc(1.25rem * var(--dt-opis)); color: var(--tablica-tekst); line-height: 1.2; }
/* duży tytuł iOS */
.dt { padding: 4px 16px 0; }
.dt h1 { font-family: var(--kroj-t); font-weight: var(--w-t2); font-size: calc(2.25rem * var(--dt-tytul)); line-height: 1.1; }
.dt p { margin-top: 2px; }
.plan { margin: 16px 16px 0; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.plan .n { flex: 1 1 60%; font-weight: 600; font-size: calc(1.0625rem * var(--dt-opis)); line-height: 1.3; }
.plan .bt2 { min-height: 44px; padding: 0 14px; border-radius: var(--r-przyc); background: var(--pole); font-weight: 600; font-size: calc(1rem * var(--dt-opis)); }
.tydz { margin: 20px 16px 0; display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; background: var(--powierzchnia); border-radius: 12px; padding: 8px 4px; }
.tydz div { display: grid; justify-items: center; gap: 4px; padding: 6px 0; border-radius: 8px; min-width: 0; font-size: calc(0.8125rem * min(var(--dt-opis), 1.25)); color: var(--tekst2); line-height: 1.1; text-align: center; }
.tydz div b { font-size: calc(1.0625rem * min(var(--dt-liczba), 1.2)); color: var(--tekst); font-weight: 700; }
.tydz div.dzis { box-shadow: inset 0 0 0 2px var(--znacznik); }
.zn { width: 20px; height: 20px; border-radius: 3px; display: block; }
.zn.zr { background: var(--znacznik); }
.zn.pl { box-shadow: inset 0 0 0 2px var(--znacznik); }
.zn.od { width: 22px; height: 20px; color: var(--tekst2); }
.tab.dzis-t .tab-l { font-size: min(calc(3.5rem * var(--dt-liczba)), calc(var(--w, 390px) * 0.16)); justify-content: flex-start; margin: 8px 0 4px; }
.tab ul { list-style: none; margin-top: 8px; border-top: 1px solid var(--tablica-pole); }
.tab li { display: flex; flex-wrap: wrap; gap: 2px 12px; padding: 8px 0; border-bottom: 1px solid var(--tablica-pole); font-size: calc(1rem * var(--dt-opis)); line-height: 1.3; }
.tab li .n { flex: 1 1 55%; } .tab li .d { color: var(--tablica-tekst2); white-space: nowrap; margin-left: auto; }
.przyc2 { width: 100%; min-height: 52px; border-radius: var(--r-przyc); background: var(--pole); color: var(--tekst); font-weight: 700; font-size: calc(1.0625rem * var(--dt-opis)); }
.pusty { margin: 40px 16px 0; display: grid; justify-items: center; gap: 16px; text-align: center; }
.pusty .tytul { font-family: var(--kroj-t); font-weight: var(--w-t2); font-size: calc(1.5rem * var(--dt-tytul)); line-height: 1.15; }
.pusty .opis { max-width: 30ch; }
.pusty .przyc { max-width: 320px; }
.mini-tab { width: 220px; max-width: 100%; background: var(--tablica); color: var(--tablica-tekst2); border-radius: 8px; padding: 14px; font-family: var(--kroj-t); font-weight: var(--w-t2); font-size: 2.25rem; line-height: 1; text-align: center; border: 1px solid var(--tablica-brzeg); }
.mini-tab .r { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-top: 12px; }
.mini-tab .r i { height: 22px; border-radius: 3px; box-shadow: inset 0 0 0 1px var(--tablica-tekst2); }
/* A2: motyw talerzy w tle */
.motyw-start { position: absolute; z-index: 0; top: 72px; right: 14px; width: calc(var(--w, 390px) * 0.3); height: auto; aspect-ratio: 1; pointer-events: none; opacity: clamp(0, calc((1.4 - var(--dt-tytul)) * 2.5), 1); }
.pasek { display: flex; justify-content: flex-end; padding: 0 8px; min-height: 44px; }
.bt3 { min-height: 44px; padding: 0 12px; font-weight: 600; font-size: calc(1.0625rem * var(--dt-opis)); color: var(--tekst); }
.pusty .opis.duzy { font-size: calc(1.0625rem * var(--dt-opis)); color: var(--tekst); }
.motyw-pusty { width: 220px; max-width: 100%; height: auto; }
`;

const ekranSeria = `${sb}${nag}<section class="tab" aria-label="Karta teraz: Wyciskanie leżąc, seria 3 z 4, 80 kilogramów razy 6">
<div class="tab-g"><span class="tab-cw">Wyciskanie leżąc</span><span class="tab-s">seria 3 z 4</span></div>
<div class="tab-l" aria-hidden="true"><span>80<small> kg</small></span><span class="x">×</span><span>6</span></div>
${pmEtyk}
${pola(S4, 2, W4)}
</section>
<div class="akcja"><button class="przyc">Seria zrobiona</button><p class="opis">Poprzednio 77,5 kg × 6</p></div>
${dalej}${zakl('t')}`;
const ekranPrzerwa = `${sb}${nag}<section class="tab" aria-label="Przerwa: zostało 1 minuta 47 sekund z 2 minut 30. Następna seria 4 z 4: 80 kilogramów razy 6">
<div class="tab-g"><span class="tab-cw">Przerwa</span><span class="tab-s">z 2:30</span></div>
<div class="tab-l zeg" aria-hidden="true">1:47</div>
<p class="nast">Następna: seria 4 z 4, 80 kg × 6</p>
${pola(S4, 3, W4)}
</section>
<div class="akcja">${przerwaPrzyc}</div>
${dalej}${zakl('t')}`;

const filizanka = '<svg class="zn od" viewBox="0 0 22 20" aria-hidden="true"><path d="M4 7h11v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z M15 9h2a2 2 0 0 1 0 4h-2 M3 18h14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
const DNI = [['pon.', 19, 'zr', 'zrobiony: Góra A'], ['wt.', 20, 'od', 'odpoczynek'], ['śr.', 21, 'pl', 'dziś: Dół B'], ['czw.', 22, 'od', 'odpoczynek'], ['pt', 23, 'od', 'odpoczynek'], ['sob.', 24, 'pl', 'zaplanowany: Góra A'], ['niedz.', 25, 'od', 'odpoczynek']];
const tydz = `<div class="tydz" role="list" aria-label="Tydzień">${DNI.map(([d, n, s, a], i) => `<div role="listitem" aria-label="${d} ${n}, ${a}"${i === 2 ? ' class="dzis"' : ''}>${d}<b>${n}</b>${s === 'od' ? filizanka : `<i class="zn ${s}"></i>`}</div>`).join('')}</div>`;
const ekranStart = (a2) => `${a2 ? sygnatura('motyw-start') : ''}${sb}<div class="pasek"><button class="bt3">Planowanie</button></div><div class="dt"><h1>Trening</h1><p class="opis">środa, 21 października</p><p class="opis">Plan: Mięśnie, 3× w tygodniu</p></div>
${tydz}
<section class="tab dzis-t" aria-label="Dziś: Dół B, 6 ćwiczeń">
<div class="tab-g"><span class="tab-cw">Dziś: Dół B</span><span class="tab-s">6 ćw.</span></div>
<ul><li><span class="n">Przysiad ze sztangą</span><span class="d">4 × 5, 100 kg</span></li><li><span class="n">Martwy ciąg rumuński</span><span class="d">3 × 8, 80 kg</span></li><li><span class="n">+ 4 ćwiczenia</span></li></ul>
</section>
<div class="akcja"><button class="przyc">Start: Dół B</button><button class="przyc2">Inny trening</button><p class="opis">Następne: sob., 24 paź — Góra A</p></div>
${zakl('t')}`;
const ekranPostepy = (a2) => `${sb}<div class="dt"><h1>Postępy</h1></div>
<div class="pusty">${a2 ? sygnatura('motyw-pusty') : `<div class="mini-tab" aria-hidden="true">— kg × —<div class="r"><i></i><i></i><i></i><i></i></div></div>`}
<p class="opis duzy">Wykresy pojawią się po pierwszym zakończonym treningu.</p>
<button class="przyc">Zacznij trening</button></div>
${zakl('s')}`;

const kartaA1 = `<h2>A1 — Tablica podejść</h2>
<p><b>Idea.</b> Kierunek A dokładnie jak w E2: karta „teraz” to tablica podejścia z zawodów, czytelna z 2 m. Ikona i intro — obecne (decyzja STOP E2).</p>
<h3>Barwy talerzy</h3><p>Brak w środku aplikacji. Barwy talerzy są tylko na ikonie i w intro.</p>
<h3>Pola serii (1–12 i tryb zapasowy)</h3><p>Jedno pole = jedna seria: rozgrzewka „W”, robocza „n”, drop „nD” (jak <code>setMarkOf</code>). Do 4 pól w jednym rzędzie z wynikiem w polu. Gdy pól jest więcej, pola pokazują sam numer i układają się w 2 albo najwyżej 3 rzędy (szerokość pola ≥ 36 pt × skala liczb). Powyżej 12 pól jest jeden przewijany rząd, ustawiony na bieżącej serii, z wygaszonymi brzegami. Licznik „seria n z m” zostaje bez zmian. Arkusz: <code>a-serie.html</code>.</p>`;
const kartaA2 = `<h2>A2 — Tablica podejść z nawiązaniem do talerzy</h2>
<p><b>Idea.</b> Ten sam środek co A1. Barwy talerzy z ikony wracają tylko w tle dwóch rodzajów okien: na starcie (Trening przed treningiem) i w pustych stanach. Te okna stoją najbliżej intro: aplikacja otwiera się na nich zaraz po animacji.</p>
<h3>Gdzie i jak</h3><ul>
<li><b>Start:</b> sylwetka końca sztangi z ikony (te same proporcje talerzy) w prawym górnym rogu za dużym tytułem, ucięta krawędzią ekranu. Krycie barw ${Math.round(KRYCIE.jasny * 100)}% w jasnym motywie i ${Math.round(KRYCIE.ciemny * 100)}% w ciemnym. To pierwszy obraz po intro, który „zostaje” z ikony.</li>
<li><b>Pusty stan</b> (Postępy, ZM-06; ten sam wzór w innych pustych stanach): gryf z ekranu startowego i talerze w tych samych blado nasyconych barwach, czyli intro „przed wsunięciem talerzy”.</li></ul>
<h3>Czego A2 nie robi</h3><ul>
<li>Nic na tablicy „teraz” (seria, przerwa): czyta się ją z 2 m, a barwa obok liczby kg sugerowałaby ciężar talerza.</li>
<li>Barwa nigdy nie stoi przy liczbie kg i nie oznacza wartości. Decyzja z 09.10.2026: kolor talerzy nic nie koduje w interfejsie.</li>
<li>Bez pasków i listew w barwach talerzy (czterokolorowy pasek bez znaczenia usunięty 09.10.2026).</li>
<li>Nie zmienia akcentu interfejsu, przycisków, wykresów ani znaczników dni.</li></ul>
<h3>Dlaczego subtelnie</h3><p>Motyw leży pod tekstem jako tło i nie jest elementem interfejsu (WCAG 1.4.11 go nie obejmuje). Tekst na każdej barwie spełnia 4,5:1 (pomiar <code>kontrast-a.json</code>). Grafika jest ukryta dla VoiceOver. Przy „Zwiększ kontrast” znika (propozycja do E3).</p>`;

function plik({ tytul, a2, karta }) {
  return `<!doctype html>
<html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${tytul}</title>
<!-- Makieta E2b (M3, rola 04 build, 21.10.2026). Plik wygenerowany (docs/design/narzedzia/a-warianty-gen.mjs). Nazwy ćwiczeń, ciężary, czasy, daty i plan — [PRZYKŁAD].
     Teksty interfejsu z lib/i18n (Seria zrobiona, Pomiń, Zakończ, seria {n} z {all}, Start: {name}, Inny trening, Planowanie, Wykresy pojawią się po pierwszym zakończonym treningu.).
     Krój treści: na iOS SF Pro; w makiecie zastępczo Source Sans 3 (OFL). Barwy talerzy: lib/discColors.ts (IWF 3.3.3.6, wyd. 2019) i lib/brandIcon.ts. -->
<link rel="stylesheet" href="wspolne.css">
<style>
${fontFaces.replaceAll('FONTY', '../fonty')}
:root { ${JASNY} ${motywVars('jasny')} }
[data-theme="dark"] { ${CIEMNY} ${motywVars('ciemny')} }
${CSS}
</style>
<script>${POLA_JS}</script></head>
<body>
<div class="uklad">
<main data-ekran="seria" class="tel" aria-label="Ekran treningu, stan seria">${ekranSeria}</main>
<main data-ekran="przerwa" class="tel" aria-label="Ekran treningu, stan przerwa">${ekranPrzerwa}</main>
<main data-ekran="start" class="tel" aria-label="Trening przed treningiem">${ekranStart(a2)}</main>
<main data-ekran="postepy" class="tel" aria-label="Postępy, pusty stan">${ekranPostepy(a2)}</main>
<aside class="panel" data-panel="karta">${karta}</aside>
</div>
</body></html>
`;
}

writeFileSync(KIER + 'a1-tablica.html', plik({ tytul: 'Wariant A1 — Tablica podejść', a2: false, karta: kartaA1 }));
writeFileSync(KIER + 'a2-tablica-talerze.html', plik({ tytul: 'Wariant A2 — Tablica z nawiązaniem do talerzy', a2: true, karta: kartaA2 }));

// ---------- arkusz serii ----------
const PRZYPADKI = [
  ['1 seria', ['1'], 0, ['100×5'], 'seria 1 z 1'],
  ['2 serie', ['1', '2'], 1, ['100×5', '100×5'], 'seria 2 z 2'],
  ['4 serie', S4, 2, W4, 'seria 3 z 4'],
  ['8: 2 rozgrzewki + 5 + drop', ['W', 'W', '1', '2', '3', '4', '5', '5D'], 5, ['40×10', '60×5', '80×6', '80×6', '80×6'], 'seria 4 z 5'],
  ['12: 3 rozgrzewki + 8 + drop', ['W', 'W', 'W', '1', '2', '3', '4', '5', '6', '7', '8', '8D'], 8, [], 'seria 6 z 8'],
  ['15 — tryb zapasowy', Array.from({ length: 15 }, (_, i) => String(i + 1)), 12, [], 'seria 13 z 15'],
];
const WAR = [['320 pt, tekst domyślny', 320, 1, 1], ['320 pt, duży tekst (DEC-10: liczby 130%, opisy 200%)', 320, 1.8, 3.1], ['390 pt, tekst domyślny', 390, 1, 1]];
const kafel = ([nazwa, s, t, w, licz], [, szer, tyt, tr]) => `<div class="kaf" style="--w:${szer}px;--dt-tytul:${tyt};--dt-tresc:${tr};--dt-opis:${Math.min(tr, 2)};--dt-liczba:${Math.min(tr, 1.3)};width:${szer}px">
<section class="tab" aria-label="${nazwa}"><div class="tab-g"><span class="tab-cw">Wyciskanie leżąc</span><span class="tab-s">${licz}</span></div>${pola(s, t, w)}</section></div>`;
writeFileSync(KIER + 'a-serie.html', `<!doctype html>
<html lang="pl"><head><meta charset="utf-8"><title>Tablica A — liczba serii</title>
<!-- Arkusz E2b: pola serii na tablicy A dla 1–12 serii i tryb zapasowy > 12 (decyzja właściciela 21.10.2026). Wygenerowany; dane [PRZYKŁAD]. -->
<link rel="stylesheet" href="wspolne.css">
<style>${fontFaces.replaceAll('FONTY', '../fonty')}
:root { ${JASNY} } ${CSS}
.ark { display: grid; grid-template-columns: 200px 320px 320px 390px; gap: 20px 24px; align-items: start; background: var(--bg); padding: 24px; width: max-content; }
.ark h3 { font-size: 15px; } .ark .naz { font-weight: 700; font-size: 16px; padding-top: 16px; }
.kaf .tab { margin: 0; }
.ark > p { grid-column: 1 / -1; font-size: 15px; max-width: 1200px; }
</style><script>${POLA_JS}</script></head><body style="padding:0">
<div class="ark" data-ekran="serie"><h2 style="grid-column:1/-1;font-family:Tablica;font-size:30px">Pola serii na tablicy: 1–12 serii i tryb zapasowy powyżej 12</h2>
<div></div>${WAR.map(([n]) => `<h3>${n}</h3>`).join('')}
${PRZYPADKI.map((p) => `<div class="naz">${p[0]}</div>${WAR.map((w) => kafel(p, w)).join('')}`).join('\n')}
<p>Reguła: do 4 pól jeden rząd z wynikiem w polu (gdy się mieści). Od 5 do 12 pól sam numer w 1–3 rzędach, a pole ma co najmniej 36 pt × skala liczb. Powyżej 12 pól jest jeden przewijany rząd ustawiony na bieżącej serii. Ramka bursztynowa oznacza serię bieżącą, wypełnienie — zrobioną, kontur — czekającą, a kreskowany kontur — czekającą rozgrzewkę. Etykiety: W — rozgrzewka, nD — drop (lib/live.ts setMarkOf).</p>
</div></body></html>
`);

// ---------- kroje (krok 6) ----------
export const KROJE = [
  { f: 'Tablica', n: 'Barlow Condensed 600/700 (obecny w A)', w1: 600, w2: 700, lic: 'OFL 1.1', zrodlo: 'Opis autora (google/fonts, DESCRIPTION): wzorowany na oznaczeniach publicznych Kalifornii — tablice rejestracyjne, znaki drogowe, autobusy i pociągi.', dziedzina: 'Wąski grotesk o niskim kontraście, jak oznaczenia sprzętu i tablice informacyjne. Pochodzenie: oznakowanie drogowe w USA, nie sport.' },
  { f: 'Oswald', n: 'Oswald 500/700', w1: 500, w2: 700, lic: 'OFL 1.1', zrodlo: 'Opis autora: przerobienie klasycznego stylu „Alternate Gothic”.', dziedzina: 'Wąski gotyk plakatowy, kształtem bliski napisom z afiszy sportowych (ocena projektowa). Najbliżej szablonu kategorii, bo to bardzo częsty krój nagłówków.' },
  { f: 'Big Shoulders', n: 'Big Shoulders 700/800', w1: 700, w2: 800, lic: 'OFL 1.1', zrodlo: 'Opis autora: wąski gotyk amerykański dla systemu identyfikacji Chicago; formy z historii kolei i akcji publicznych.', dziedzina: 'Szyldowy, wysoki gotyk jak napisy na halach i tablicach wyników. Kontekst miejski z innego kraju, a nie sportowy.' },
  { f: 'Saira Condensed', n: 'Saira Condensed 600/700', w1: 600, w2: 700, lic: 'OFL 1.1 (nazwa zastrzeżona „Saira”)', zrodlo: 'Opis autora: system sans serif w wielu szerokościach (Omnibus-Type).', dziedzina: 'Kanciaste, techniczne cyfry jak na wyświetlaczach i oznaczeniach sprzętu. Najsłabsze zakorzenienie w dziedzinie, bo krój nie ma historii.' },
  { f: 'Doto', n: 'Doto 900 (matryca punktowa)', w1: 900, w2: 900, lic: 'OFL 1.1', zrodlo: 'Opis autora: krój inspirowany bitmapą, każdy znak z matrycy 6×10 punktów.', dziedzina: 'Najbliżej elektronicznej tablicy wyników z diodami. Tylko do liczb i krótkich nazw; słabiej czytelny w małym rozmiarze.' },
];
const krojEkran = (k) => `<div class="kk"><main class="tel" style="--kroj-t:'${k.f}';--w-t1:${k.w1};--w-t2:${k.w2}">${sb}${nag.replace('class="nag-t"', 'class="nag-t" style="font-family:var(--kroj-t)"')}<section class="tab"><div class="tab-g"><span class="tab-cw">Wyciskanie leżąc</span><span class="tab-s">seria 3 z 4</span></div>
<div class="tab-l"><span>80<small> kg</small></span><span class="x">×</span><span>6</span></div>${pola(S4, 2, W4)}</section>
<section class="tab" style="margin-top:12px"><div class="tab-g"><span class="tab-cw">Przerwa</span><span class="tab-s">z 2:30</span></div><div class="tab-l zeg" style="font-size:5rem">1:47</div><p class="nast">Następna: seria 4 z 4, 80 kg × 6</p></section>
<div class="dt" style="margin-top:12px"><h1 style="font-size:1.75rem">Planowanie</h1><p class="opis">Żółć, ąęłńóśźż — 0123456789</p></div></main>
<div class="kopis"><h3>${k.n}</h3><p><b>Pochodzenie:</b> ${k.zrodlo}</p><p><b>W świecie dziedziny:</b> ${k.dziedzina}</p><p><b>Licencja:</b> ${k.lic}</p></div></div>`;
writeFileSync(DESIGN + 'kroje.html', `<!doctype html>
<html lang="pl"><head><meta charset="utf-8"><title>Kroje tytułowe A1</title>
<!-- E2 krok 6 (M3, 21.10.2026): pięć krojów tytułowych na ekranie kluczowym wariantu A1. Pliki krojów i licencje: docs/design/fonty/<krój>/OFL.txt (google/fonts, katalog ofl/, pobrane 21.10.2026).
     Opisy pochodzenia — z DESCRIPTION/ARTICLE autorów w google/fonts (odczyt 21.10.2026); zdania „w świecie dziedziny” to ocena projektowa, nie fakt źródłowy. Dane [PRZYKŁAD]. -->
<link rel="stylesheet" href="kierunki/wspolne.css">
<style>${fontFaces.replaceAll('FONTY', 'fonty')}
${kandydaciFF.replaceAll('FONTY', 'fonty')}
:root { ${JASNY} } ${CSS}
.tel { min-height: 0; padding-bottom: 16px; }
.kroje { display: flex; gap: 24px; align-items: flex-start; padding: 24px; background: #d9dbdd; width: max-content; }
.kk { width: 360px; } .kk .tel { width: 360px; --w: 360px; }
.kopis { padding: 12px 4px 0; font-size: 14px; line-height: 1.4; } .kopis h3 { font-size: 17px; margin-bottom: 4px; } .kopis p { margin-top: 4px; }
</style><script>${POLA_JS}</script></head><body style="padding:0">
<div class="kroje" data-ekran="kroje">${KROJE.map(krojEkran).join('\n')}</div>
</body></html>
`);

// ---------- strona porównania A1 | A2 ----------
// Kadry intro: lib/intro.ts (slideMs 380, staggerMs 100, fromRight 120, ease-out cubic) — ten sam rachunek co pieceOffset.
const IKONA = [...PL.map(([x, y, w, h, r], i) => ({ x, y, w, h, r, c: i })), { x: 93, y: 49, w: 7, h: 22, r: 2, c: 'ink' }];
const offset = (i, t) => { const q = Math.min(1, Math.max(0, (t - i * 100) / 380)); return 120 * (1 - (1 - (1 - q) ** 3)); };
const kadr = (t, ciemny) => {
  const kol = ciemny ? TALERZE.ciemny : TALERZE.jasny; const ink = ciemny ? '#ECEAE4' : '#15171A'; const bg = ciemny ? '#121316' : '#F4F3EF';
  return `<svg viewBox="0 0 120 120" width="150" height="150" style="background:${bg};border-radius:8px"><rect x="10" y="56" width="98" height="8" rx="2" fill="${ink}"/>${IKONA.map((p, i) => `<rect x="${p.x + offset(i, t)}" y="${p.y}" width="${p.w}" height="${p.h}" rx="${p.r}" fill="${p.c === 'ink' ? ink : kol[p.c]}"/>`).join('')}</svg>`;
};
const zr = (v, e, m) => `zrzuty/${v === 1 ? 'a1-tablica' : 'a2-tablica-talerze'}-${e}-390-${m}.png`;
const EKRANY = [['start', 'Trening przed treningiem (start) — A2: motyw w tle nagłówka'], ['postepy', 'Postępy — pusty stan (ZM-06) — A2: gryf z talerzami w barwach'], ['seria', 'Karta „teraz” — seria (A1 = A2)'], ['przerwa', 'Karta „teraz” — przerwa (A1 = A2)']];
writeFileSync(DESIGN + 'porownanie-a.html', `<!doctype html>
<html lang="pl"><head><meta charset="utf-8"><title>Porównanie A1 i A2</title>
<!-- Strona porównania E2b (M3, 21.10.2026), wygenerowana. Zrzuty: kierunki/zrzuty/a1-*, a2-* (390 pt). Ikona: assets/brand/icon*.svg (obecna, bez zmian). -->
<style>
body { margin: 0; background: #d9dbdd; font-family: 'Zastepczy', sans-serif; color: #1c1f23; }
@font-face { font-family: 'Zastepczy'; src: url('fonty/source-sans-3/SourceSans3-var.ttf'); font-weight: 200 900; }
@font-face { font-family: 'Tablica'; src: url('fonty/barlow-condensed/BarlowCondensed-Bold.ttf'); font-weight: 700; }
.str { width: 1720px; padding: 32px; box-sizing: border-box; }
h1 { font-family: Tablica; font-size: 44px; margin: 0 0 8px; } h2 { font-family: Tablica; font-size: 28px; margin: 28px 0 10px; }
p, li { font-size: 17px; line-height: 1.4; max-width: 1500px; margin: 4px 0; }
.rzad { display: grid; grid-template-columns: repeat(4, 390px); gap: 24px; }
.rzad figure { margin: 0; } .rzad figcaption { font-weight: 700; font-size: 16px; margin-bottom: 6px; }
.rzad img { width: 390px; display: block; }
.mark { display: flex; gap: 32px; align-items: flex-end; flex-wrap: wrap; background: #fff; padding: 20px; border-radius: 8px; }
.mark figure { margin: 0; text-align: center; font-size: 14px; } .ik { border-radius: 22.5%; display: block; }
.tap-j { background: linear-gradient(160deg, #cfd8e3, #eef1f4); padding: 12px; border-radius: 12px; display: flex; gap: 12px; align-items: flex-end; }
.tap-c { background: linear-gradient(160deg, #10151c, #2a3038); padding: 12px; border-radius: 12px; display: flex; gap: 12px; align-items: flex-end; }
.pal { display: flex; gap: 10px; flex-wrap: wrap; } .pal span { display: inline-flex; gap: 6px; align-items: center; font-size: 13px; } .pal b { width: 26px; height: 26px; border-radius: 5px; border: 1px solid #0002; }
</style></head><body><div class="str" data-ekran="porownanie">
<h1>Kierunek A: wariant A1 i A2 obok siebie</h1>
<p><b>A1</b> — środek aplikacji jak w E2, barwy talerzy tylko na ikonie i w intro. <b>A2</b> — ten sam środek; barwy talerzy z ikony w tle okna startowego i pustych stanów (krycie ${Math.round(KRYCIE.jasny * 100)}% / ${Math.round(KRYCIE.ciemny * 100)}%). Nie ma ich na tablicy „teraz”, przy liczbach kg ani w paskach. Ikona i intro są obecne, bez zmian. Dane na ekranach to [PRZYKŁAD]. Treść: na iOS SF Pro, w makiecie zastępczo Source Sans 3.</p>
<h2>Obecna ikona i intro (zostają)</h2>
<div class="mark">
<figure><div class="tap-j"><img class="ik" src="../../assets/brand/icon.svg" width="180" height="180" alt="Obecna ikona, jasna"><img class="ik" src="../../assets/brand/icon.svg" width="60" height="60" alt=""><img class="ik" src="../../assets/brand/icon.svg" width="29" height="29" alt=""></div>ikona jasna — 180, 60, 29 pt</figure>
<figure><div class="tap-c"><img class="ik" src="../../assets/brand/icon-dark.svg" width="180" height="180" style="background:#1c1c1e" alt="Obecna ikona, ciemna"><img class="ik" src="../../assets/brand/icon-dark.svg" width="60" height="60" style="background:#1c1c1e" alt=""></div>ikona ciemna</figure>
<figure><div style="display:flex;gap:8px">${[0, 250, 450, 850].map((t) => kadr(t, false)).join('')}</div>intro: kadry 0, 250, 450 i 850 ms (lib/intro.ts)</figure>
<figure><div style="display:flex;gap:8px">${kadr(250, true)}${kadr(850, true)}</div>intro, motyw ciemny</figure>
</div>
<p style="margin-top:10px">Barwy nawiązania A2 (talerz nałożony na tło, kolejno 25, 20, 15, 10 kg z ikony):</p>
<div class="pal">${TINT.jasny.map((c) => `<span><b style="background:${c}"></b>${c}</span>`).join('')} <span>— jasny (${Math.round(KRYCIE.jasny * 100)}% na ${TLO.jasny})</span></div>
<div class="pal" style="margin-top:6px">${TINT.ciemny.map((c) => `<span><b style="background:${c}"></b>${c}</span>`).join('')} <span>— ciemny (${Math.round(KRYCIE.ciemny * 100)}% na ${TLO.ciemny})</span></div>
${EKRANY.map(([e, n]) => `<h2>${n}</h2><div class="rzad"><figure><figcaption>A1, jasny</figcaption><img src="kierunki/${zr(1, e, 'light')}" alt=""></figure><figure><figcaption>A2, jasny</figcaption><img src="kierunki/${zr(2, e, 'light')}" alt=""></figure><figure><figcaption>A1, ciemny</figcaption><img src="kierunki/${zr(1, e, 'dark')}" alt=""></figure><figure><figcaption>A2, ciemny</figcaption><img src="kierunki/${zr(2, e, 'dark')}" alt=""></figure></div>`).join('\n')}
<h2>Rekomendacja</h2>
<p><b>A2</b>: łączy rozpoznawalność ikony i intro ze środkiem A bez kosztu czytelności. Barwy są tylko w oknach bez liczb kg. Kompromis: dwie dodatkowe grafiki do utrzymania i wyłączenie przy „Zwiększ kontrast”. Szczegóły i pytania: STOP E2b.</p>
</div></body></html>
`);
console.log('OK: a1-tablica.html, a2-tablica-talerze.html, a-serie.html, kroje.html, porownanie-a.html');
console.log('TINT', JSON.stringify(TINT));
