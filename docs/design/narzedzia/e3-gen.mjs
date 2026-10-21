// Generator makiet systemu E3 (M3, rola 04 build, 21.10.2026): node --experimental-strip-types docs/design/narzedzia/e3-gen.mjs
// Wejście: docs/design/tokeny.ts (propozycja modułu motywu). Zapisuje:
//   docs/design/ekrany/e3-ekrany.html (pl) i e3-ekrany-el.html (najdłuższy język dla tych ekranów: el; suma długości tekstów ekranów z lib/locales),
//   docs/design/ikona/arkusz.html (ikona: obecny rysunek, zegarek 1088, intro na tle motywu).
// Ekrany TO BE (docs/design/to-be.md): karta „teraz” seria i przerwa (ZM-01, ZM-02, ZM-05), start z motywem A2, Postępy z historią i pusty stan (ZM-06,
// DEC-09), szczegóły sesji z „Usuń sesję” i oknem potwierdzenia (ZM-04). Dane (nazwy szablonów, ciężary, daty) — [PRZYKŁAD]; nazwy ćwiczeń z biblioteki
// (lib/seed.ts; poza pl po angielsku z nawiasem z EX_PAREN — DEC-13). Teksty interfejsu z lib/i18n (pl) i lib/locales/el.json; nowe teksty oznaczone NOWY.
import { writeFileSync, mkdirSync } from 'node:fs';
const T = await import(new URL('../tokeny.ts', import.meta.url).href);
const DESIGN = new URL('../', import.meta.url).pathname;
mkdirSync(DESIGN + 'ekrany', { recursive: true });

// ---------- teksty ----------
// NOWY = tekst, którego nie ma w lib/i18n (do dodania przez rolę 08 i tłumacza); el dla NOWY — propozycja do przeglądu tłumacza.
const NOWE = ['Następne ćwiczenia', 'Następna: {x}', 'z {s}', 'Zacznij trening'];
const L = {
  pl: {
    lang: 'pl', locale: 'pl', zakoncz: 'Zakończ', opcje: 'Opcje treningu', seria: (n, m) => `seria ${n} z ${m}`, zrobiona: 'Seria zrobiona', poprz: 'Poprzednio: {l}',
    nast: 'Następne ćwiczenia', przerwa: 'Przerwa', zS: 'z {s}', nastS: 'Następna: {x}', pomin: 'Pomiń', powt: 'powt.', sek: 's',
    start: 'Start: {name}', inny: 'Inny trening', planowanie: 'Planowanie', dzis: 'Dziś', cw: 'ćw.', planN: 'Plan: {name}', nastD: 'Następne: {list}',
    trening: 'Trening', plan: 'Plan', postepy: 'Postępy', wiecej: 'Więcej', szukaj: 'Szukaj ćwiczenia…', rekordy: 'REKORDY', cwiczenie: 'ĆWICZENIE', maxC: 'Max ciężar',
    najlS: 'Najlepsza seria (objętość)', maxP: 'Max powtórzeń w serii', sesje: 'Sesje', wykresy: 'Wykresy pojawią się po pierwszym zakończonym treningu.', zacznij: 'Zacznij trening',
    wroc: 'Wróć', edytuj: 'Edytuj', usunSesje: 'Usuń sesję', usunQ: 'Usunąć tę sesję z historii?', anuluj: 'Anuluj', usun: 'Usuń', zapiszSz: 'Zapisz jako szablon',
    ciezar: 'ciężar', pow: 'Pow.', health: 'Kopia w Apple Health zostanie — usuniesz ją w aplikacji Zdrowie.', tydzOd: 'odpoczynek', serii: 'serii',
    ex: { bench: 'Bench Press (sztanga)', row: 'One Arm Row (hantle)', incl: 'Incline Bench Press (hantle)', pull: 'Pull Up', squat: 'Back Squat', rdl: 'RDL (sztanga)' },
    planName: 'Mięśnie, 3× w tygodniu', plus4: '+ 4 ćwiczenia',
  },
};
L.el = {
  ...L.pl, lang: 'el', locale: 'el', zakoncz: 'Ολοκλήρωση', opcje: 'Επιλογές προπόνησης', seria: (n, m) => `σετ ${n} από ${m}`, zrobiona: 'Το σετ ολοκληρώθηκε', poprz: 'Προηγουμένως: {l}',
  nast: 'Επόμενες ασκήσεις', przerwa: 'Διάλειμμα', zS: 'από {s}', nastS: 'Επόμενο: {x}', pomin: 'Παράλειψη', powt: 'επαν.', sek: 'δευτ.',
  start: 'Έναρξη: {name}', inny: 'Άλλη προπόνηση', planowanie: 'Σχεδιασμός', dzis: 'Σήμερα', cw: 'ασκ.', planN: 'Πρόγραμμα: {name}', nastD: 'Επόμενα: {list}',
  trening: 'Προπόνηση', plan: 'Πρόγραμμα', postepy: 'Πρόοδος', wiecej: 'Περισσότερα', szukaj: 'Αναζήτηση ασκήσεων…', rekordy: 'ΡΕΚΟΡ', cwiczenie: 'ΑΣΚΗΣΗ', maxC: 'Μέγιστο βάρος',
  najlS: 'Καλύτερο σετ (όγκος)', maxP: 'Μέγ. επαναλήψεις σε σετ', sesje: 'Συνεδρίες', wykresy: 'Τα γραφήματα εμφανίζονται μετά την πρώτη ολοκληρωμένη προπόνηση.', zacznij: 'Έναρξη προπόνησης',
  wroc: 'Πίσω', edytuj: 'Επεξεργασία', usunSesje: 'Διαγραφή συνεδρίας', usunQ: 'Διαγραφή συνεδρίας από το ιστορικό;', anuluj: 'Ακύρωση', usun: 'Διαγραφή', zapiszSz: 'Αποθήκευση ως πρότυπο',
  ciezar: 'βάρος', pow: 'Επαν.', health: 'Το αντίγραφο στο Apple Health παραμένει — διάγραψέ το στην εφαρμογή Υγεία.', tydzOd: 'ημέρα ξεκούρασης', serii: 'σετ',
  ex: { bench: 'Bench Press (Barbell)', row: 'One Arm Row (Dumbbell)', incl: 'Incline Bench Press (Dumbbell)', pull: 'Pull Up', squat: 'Back Squat', rdl: 'RDL (Barbell)' },
  planName: 'Μύες, 3× την εβδομάδα', plus4: '+ 4 ασκήσεις',
};
const f = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k]);

// ---------- barwy z tokenów → zmienne CSS ----------
const vars = (p, k) => `--bg:${p.bg};--tekst:${p.text};--tekst2:${p.muted};--linia:${p.line};--ctrl:${p.ctrlLine};--pole:${p.surface2};--powierzchnia:${p.surface};--przycisk:${p.accent};--przycisk-tekst:${p.accentInk};--akcent:${p.accent};--danger:${p.danger};--tablica:${p.board};--tablica-brzeg:${p.boardEdge};--tablica-tekst:${p.boardText};--tablica-tekst2:${p.boardMuted};--tablica-pole:${p.boardField};--zegar:${p.now};--znacznik:${p.accent};--motyw-gryf:${p.motifBar};--m0:${p.motif25};--m1:${p.motif20};--m2:${p.motif15};--m3:${p.motif10};--motyw-widoczny:${k}`;
const R = T.RADIUS, S = T.SPACE, TY = T.TYPE;
const rem = (pt) => `${pt / 16}rem`;

// ---------- ikony (siatka 24, linia 1,8 — tokeny ICON, jak components/Icon.tsx z m3-wejscie/029-ikony) ----------
const sv = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${T.ICON.stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;
const I = {
  minus: sv('<path d="M5 12h14"/>'), plus: sv('<path d="M5 12h14M12 5v14"/>'),
  more: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5.5" cy="12" r="1.8" fill="currentColor"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/><circle cx="18.5" cy="12" r="1.8" fill="currentColor"/></svg>',
  t: sv('<circle cx="12" cy="13.5" r="7"/><path d="M12 13.5V9.5M9.5 3h5"/>'), p: sv('<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>'),
  s: sv('<path d="M5 20v-7M10 20V8M15 20v-5M20 20V5"/>'), w: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5.5" cy="12" r="1.8" fill="currentColor"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/><circle cx="18.5" cy="12" r="1.8" fill="currentColor"/></svg>',
  wstecz: sv('<path d="M15 5l-7 7 7 7"/>'), lupa: sv('<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>'),
  filizanka: sv('<path d="M5 8h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z M16 10h1.5a2 2 0 0 1 0 4H16 M4 20h13"/>'),
};
const sb = `<div class="sb"><span>9:41</span><span class="sb-i" aria-hidden="true"><i style="width:17px;height:11px"></i><i style="width:15px;height:11px;border-radius:5px"></i><i style="width:25px;height:12px;border-radius:4px"></i></span></div>`;
const zakl = (t, akt) => `<nav class="zakl">${[['t', t.trening], ['p', t.plan], ['s', t.postepy], ['w', t.wiecej]].map(([k, n]) => `<a${k === akt ? ' class="ak" aria-current="page"' : ''}>${I[k]}<span>${n}</span></a>`).join('')}</nav>`;

// ---------- pola serii (reguła z E2b, decyzja 21.10.2026; liczby z tokenów SET_FIELDS / SIZE) ----------
const POLA_JS = `(function () {
  var GAP = ${T.SIZE.boardFieldGap}, MIN = ${T.SIZE.boardFieldMinWidth}, MAXW = ${T.SET_FIELDS.maxRows}, LIMIT = ${T.SET_FIELDS.scrollAbove}, WYN = ${T.SET_FIELDS.resultUpTo};
  function dt(el) { var p = document.createElement('i'); p.style.cssText = 'position:absolute;visibility:hidden;width:calc(100px * var(--dt-liczba))'; el.appendChild(p); var v = p.offsetWidth / 100; p.remove(); return v || 1; }
  function rysuj(el) {
    var s = el.dataset.serie.split(','), cur = +el.dataset.teraz, w = (el.dataset.wyniki || '').split(','), n = s.length;
    el.innerHTML = ''; var d = dt(el), W = el.clientWidth, minW = MIN * d, font = 20 * d;
    var fit = Math.max(1, Math.floor((W + GAP) / (minW + GAP))), rows = 1, cols, zapas = n > LIMIT; el.classList.toggle('zapas', zapas);
    if (zapas) { cols = n; el.style.gridTemplateColumns = 'repeat(' + n + ', ' + Math.max(minW, 44) + 'px)'; }
    else { while (rows < MAXW && Math.ceil(n / rows) > fit) rows++; cols = Math.min(Math.ceil(n / rows), fit); if (rows === 1) cols = Math.max(cols, Math.min(WYN, fit)); el.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)'; }
    var fw = zapas ? Math.max(minW, 44) : (W - GAP * (cols - 1)) / cols;
    s.forEach(function (lab, i) { var f = document.createElement('span'); var st = i < cur ? 'z' : i === cur ? 't' : 'p';
      f.className = 'pole ' + st + (lab === 'W' ? ' w' : ''); var txt = lab;
      if (st === 'z' && w[i] && rows === 1 && !zapas && n <= WYN && w[i].length * 0.48 * font + 10 <= fw) txt = w[i];
      f.textContent = txt; el.appendChild(f); });
  }
  function wszystkie() { document.querySelectorAll('.pola[data-serie]').forEach(rysuj); }
  window.addEventListener('load', wszystkie); new MutationObserver(wszystkie).observe(document.documentElement, { attributes: true });
  document.addEventListener('DOMContentLoaded', wszystkie);
})();`;
const pola = (serie, teraz, wyniki, aria) => `<div class="pola" role="img" aria-label="${aria}" data-serie="${serie.join(',')}" data-teraz="${teraz}" data-wyniki="${wyniki.join(',')}"></div>`;

// ---------- motyw A2 (geometria ikony: lib/brandIcon.ts, viewBox 120) ----------
const PL = [[30, 16, 15, 88, 4], [48, 23, 14, 74, 4], [65, 31, 12, 58, 4], [80, 38, 10, 44, 3]];
const motyw = (kl) => `<svg class="${kl}" viewBox="0 0 120 120" aria-hidden="true" focusable="false"><rect x="10" y="56" width="98" height="8" rx="2" fill="var(--motyw-gryf)"/>${PL.map(([x, y, w, h, r], i) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="var(--m${i})"/>`).join('')}<rect x="93" y="49" width="7" height="22" rx="2" fill="var(--motyw-gryf)"/></svg>`;

// ---------- CSS ekranów (rozmiary z TYPE, odstępy z SPACE, promienie z RADIUS) ----------
const fs = (r, mn = 'opis') => `calc(${rem(TY[r].size)} * var(--dt-${mn}))`;
const CSS = `
@font-face { font-family: 'Tablica'; src: url('../fonty/barlow-condensed/BarlowCondensed-SemiBold.ttf'); font-weight: 600; }
@font-face { font-family: 'Tablica'; src: url('../fonty/barlow-condensed/BarlowCondensed-Bold.ttf'); font-weight: 700; }
:root { --kroj-t: 'Tablica', var(--tresc); --krój-tytul: var(--kroj-t); --r-przyc: ${R.button}px; --dt-pasek: min(var(--dt-tresc), ${T.TEXT_SCALE.bar}); }
.tel { overflow-x: clip; } .tel > * { position: relative; z-index: 1; }
.nag-t { font-size: calc(${rem(TY.navTitle.size)} * var(--dt-pasek)); }
.nag .bt { font-size: calc(${rem(TY.body.size)} * var(--dt-pasek)); white-space: nowrap; }
.nag-t .czas { font-size: calc(${rem(TY.body.size)} * var(--dt-pasek)) !important; }
.zakl a span { font-size: calc(${rem(TY.caption.size)} * var(--dt-pasek)); }
.zakl svg { width: ${T.ICON.tabSize}px; height: ${T.ICON.tabSize}px; }
.pmp { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(148px * var(--dt-liczba))), 1fr)); gap: ${S.s}px; }
.pmg { min-width: 0; display: flex; align-items: center; justify-content: space-between; gap: ${S.xs}px; }
.pmw { text-align: center; flex: 1; min-height: ${T.SIZE.hit}px; display: grid; place-items: center; line-height: 1; }
.pm svg { width: 20px; height: 20px; }
.prz { display: flex; flex-wrap: wrap; gap: ${S.s}px; }
.prz .pm2 { flex: 1 1 auto; white-space: nowrap; } .prz .pm2.prim { flex-grow: 2; }
.pm2 { min-height: ${T.SIZE.buttonSecondary}px; padding: ${S.xs}px ${S.s}px; border-radius: ${R.button}px; background: var(--pole); color: var(--tekst); font-weight: 700; font-size: ${fs('button')}; line-height: 1.2; }
.pm2.prim { background: var(--przycisk); color: var(--przycisk-tekst); }
.przyc { font-size: ${fs('buttonPrimary')}; min-height: ${T.SIZE.buttonPrimary}px; border-radius: ${R.button}px; }
.akcja { padding: ${S.l}px ${S.l}px 0; display: grid; gap: ${S.s}px; }
.akcja .opis { text-align: center; }
.tab { margin: ${S.xs}px ${S.l}px 0; background: var(--tablica); color: var(--tablica-tekst); border-radius: ${R.board}px; padding: ${S.l}px; border: 1px solid var(--tablica-brzeg); }
.tab-g { display: flex; justify-content: space-between; align-items: baseline; gap: ${S.s}px; font-family: var(--kroj-t); flex-wrap: wrap; }
.tab-cw { font-size: ${fs('boardName', 'tytul')}; text-transform: uppercase; letter-spacing: ${TY.boardName.tracking}em; font-weight: 600; line-height: 1.1; min-width: 0; overflow-wrap: anywhere; }
.tab-s { font-size: ${fs('boardMeta')}; color: var(--tablica-tekst2); white-space: nowrap; font-weight: 600; }
.tab-l { display: flex; align-items: baseline; justify-content: center; gap: ${S.s}px; font-family: var(--kroj-t); font-weight: 700; font-size: min(calc(${rem(TY.boardNumber.size)} * var(--dt-liczba)), calc(var(--w, 390px) * ${TY.boardNumber.fitWidth}), calc(var(--w, 390px) * 1.05 / var(--zn, 3))); line-height: .95; margin: ${S.m}px 0; flex-wrap: wrap; font-variant-numeric: tabular-nums; }
.tab-l small { font-size: .3em; font-weight: 600; color: var(--tablica-tekst2); }
.tab-l .x { font-size: .45em; color: var(--tablica-tekst2); font-weight: 600; }
.tab-l .pusta { color: var(--tablica-tekst2); }
.tab-l.zeg { color: var(--zegar); font-size: min(calc(${rem(TY.boardClock.size)} * var(--dt-liczba)), calc(var(--w, 390px) * ${TY.boardClock.fitWidth})); }
.tab .pm { background: var(--tablica-pole); color: var(--tablica-tekst); }
.tab .pmw small { font-family: var(--kroj-t); font-size: ${fs('stepLabel')}; color: var(--tablica-tekst); font-weight: 600; }
.pola { display: grid; gap: ${T.SIZE.boardFieldGap}px; margin-top: ${S.m}px; position: relative; }
.pola.zapas { overflow-x: auto; scrollbar-width: none; }
.pole { min-height: calc(${T.SIZE.boardFieldMin}px * var(--dt-liczba)); border-radius: ${R.field}px; display: grid; place-items: center; font-family: var(--kroj-t); font-size: ${fs('boardField', 'liczba')}; font-weight: 700; white-space: nowrap; font-variant-numeric: tabular-nums; }
.pole.z { background: var(--tablica-tekst); color: var(--tablica); }
.pole.t { box-shadow: inset 0 0 0 3px var(--zegar); }
.pole.p { box-shadow: inset 0 0 0 1px var(--tablica-tekst2); color: var(--tablica-tekst2); font-weight: 600; }
.nast { font-family: var(--kroj-t); font-weight: 600; text-align: center; font-size: ${fs('boardNext')}; color: var(--tablica-tekst); line-height: 1.2; }
.lista h2 { font-size: ${fs('sectionTitle', 'tytul')}; }
.dt { padding: ${S.xs}px ${S.l}px 0; }
.dt h1 { font-family: var(--kroj-t); font-weight: 700; font-size: min(${fs('largeTitle', 'tytul')}, calc(var(--w, 390px) * 0.13)); line-height: 1.1; }
.dt p { margin-top: 2px; }
.pasek { display: flex; justify-content: space-between; align-items: center; padding: 0 ${S.s}px; min-height: ${T.SIZE.hit}px; gap: ${S.s}px; }
.pasek .tyt { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; font-size: calc(${rem(TY.body.size)} * var(--dt-pasek)); text-align: center; flex: 1; }
.bt3 { min-height: ${T.SIZE.hit}px; padding: 0 ${S.s}px; font-weight: 600; font-size: calc(${rem(TY.body.size)} * var(--dt-pasek)); white-space: nowrap; color: var(--akcent); display: inline-flex; align-items: center; gap: 2px; }
.bt3 svg { width: 22px; height: 22px; }
.tydz { margin: ${S.xl}px ${S.l}px 0; display: grid; grid-template-columns: repeat(7, 1fr); gap: ${S.xs}px; background: var(--powierzchnia); border-radius: ${R.group}px; padding: ${S.s}px ${S.xs}px; }
.tydz div { display: grid; justify-items: center; gap: ${S.xs}px; padding: ${S.s}px 0; border-radius: ${R.button}px; min-width: 0; font-size: calc(${rem(TY.footnote.size)} * min(var(--dt-pasek), 1.1)); color: var(--tekst2); line-height: 1.1; text-align: center; white-space: nowrap; overflow: hidden; }
.tydz div b { font-family: var(--kroj-t); font-size: calc(${rem(TY.boardMeta.size)} * min(var(--dt-liczba), 1.2)); color: var(--tekst); font-weight: 700; }
.tydz div.dzis { box-shadow: inset 0 0 0 2px var(--znacznik); }
.zn { width: 20px; height: 20px; border-radius: ${R.marker}px; display: block; }
.zn.zr { background: var(--znacznik); } .zn.pl { box-shadow: inset 0 0 0 2px var(--znacznik); }
.tydz svg { width: 22px; height: 22px; color: var(--tekst2); }
.tab.dzis-t .tab-l { font-size: min(calc(3.5rem * var(--dt-liczba)), calc(var(--w, 390px) * 0.16)); justify-content: flex-start; margin: ${S.s}px 0 ${S.xs}px; }
.tab ul { list-style: none; margin-top: ${S.s}px; border-top: 1px solid var(--tablica-pole); }
.tab li { display: flex; flex-wrap: wrap; gap: 2px ${S.m}px; padding: ${S.s}px 0; border-bottom: 1px solid var(--tablica-pole); font-size: ${fs('body')}; line-height: 1.3; }
.tab li .n { flex: 1 1 55%; min-width: 0; } .tab li .d { color: var(--tablica-tekst2); white-space: nowrap; margin-left: auto; font-variant-numeric: tabular-nums; }
.przyc2 { width: 100%; min-height: ${T.SIZE.buttonSecondary}px; border-radius: ${R.button}px; background: var(--pole); color: var(--tekst); font-weight: 700; font-size: ${fs('button')}; padding: ${S.xs}px ${S.l}px; line-height: 1.2; }
.pusty { margin: ${S.xxxl}px ${S.l}px 0; display: grid; justify-items: center; gap: ${S.l}px; text-align: center; }
.pusty .opis { max-width: 30ch; font-size: ${fs('body')}; color: var(--tekst); line-height: 1.3; }
.pusty .przyc { max-width: 320px; }
.motyw-start { position: absolute; z-index: 0; top: 72px; right: 14px; width: calc(var(--w, 390px) * ${T.MOTIF.startWidthRatio}); height: auto; aspect-ratio: 1; pointer-events: none; opacity: calc(clamp(0, calc((${T.MOTIF.hideFromFontScale} - var(--dt-tytul)) * 100), 1) * var(--motyw-widoczny)); }
.motyw-pusty { width: ${T.MOTIF.emptyWidthPt}px; max-width: 100%; height: auto; opacity: var(--motyw-widoczny); }
[data-kontrast="hc"] .motyw-pusty { display: none; }
/* Postępy (DEC-09: wykres i rekordy wybranego ćwiczenia na górze; ZM-06: chipy tylko ćwiczeń z danymi) */
.chipy { display: flex; gap: ${S.s}px; padding: 0 ${S.l}px; flex-wrap: wrap; }
.chip { min-height: ${T.SIZE.hit}px; padding: ${S.xs}px ${S.m}px; border-radius: ${R.round}px; background: var(--pole); color: var(--tekst); font-size: ${fs('callout')}; font-weight: 600; line-height: 1.2; max-width: 100%; text-align: left; }
.chip.wyb { background: var(--przycisk); color: var(--przycisk-tekst); }
.szuk { margin: ${S.s}px ${S.l}px 0; min-height: ${T.SIZE.hit}px; border-radius: ${R.button + 2}px; background: var(--pole); display: flex; align-items: center; gap: ${S.s}px; padding: ${S.xs}px ${S.m}px; color: var(--tekst2); font-size: ${fs('body')}; }
.szuk svg { width: calc(20px * var(--dt-liczba)); height: calc(20px * var(--dt-liczba)); flex: none; }
.wykres { margin: ${S.l}px ${S.l}px 0; background: var(--powierzchnia); border-radius: ${R.group}px; padding: ${S.l}px; }
.wykres h2 { font-family: var(--kroj-t); font-size: ${fs('sectionTitle', 'tytul')}; font-weight: 700; display: flex; justify-content: space-between; gap: ${S.s}px; flex-wrap: wrap; overflow-wrap: anywhere; }
.wykres .wm { display: flex; justify-content: space-between; align-items: baseline; gap: ${S.s}px; flex-wrap: wrap; margin-top: ${S.xs}px; color: var(--tekst2); font-size: ${fs('callout')}; }
.wykres .wv { font-family: var(--kroj-t); font-weight: 700; color: var(--tekst); font-size: ${fs('stat', 'liczba')}; line-height: 1; font-variant-numeric: tabular-nums; }
.wykres h2 span { font-size: ${fs('stat', 'liczba')}; line-height: 1; font-variant-numeric: tabular-nums; }
.wykres svg { width: 100%; height: auto; display: block; margin-top: ${S.s}px; color: var(--akcent); }
.wykres .os { display: flex; justify-content: space-between; font-size: ${fs('footnote')}; color: var(--tekst2); margin-top: ${S.xs}px; }
.grupa-t { padding: ${S.xl}px ${S.xl + S.s}px ${S.s}px; font-size: ${fs('footnote')}; color: var(--tekst2); font-weight: 600; letter-spacing: .03em; }
.grupa { margin: 0 ${S.l}px; background: var(--powierzchnia); border-radius: ${R.group}px; list-style: none; }
.grupa li { display: flex; flex-wrap: wrap; align-items: baseline; gap: ${S.xs}px ${S.m}px; min-height: ${T.SIZE.rowMin}px; padding: ${S.m}px ${S.l}px; border-bottom: 1px solid var(--linia); font-size: ${fs('body')}; line-height: 1.3; }
.grupa li:last-child { border-bottom: 0; }
.grupa li .n { flex: 1 1 50%; min-width: 0; } .grupa li .v { margin-left: auto; font-family: var(--kroj-t); font-weight: 700; font-size: ${fs('boardMeta', 'liczba')}; white-space: nowrap; font-variant-numeric: tabular-nums; }
/* szczegóły sesji (ZM-04) */
.meta { padding: ${S.xs}px ${S.l}px 0; }
.blok { margin: ${S.xl}px ${S.l}px 0; }
.blok h2 { font-family: var(--kroj-t); font-weight: 700; font-size: ${fs('sectionTitle', 'tytul')}; margin-bottom: ${S.s}px; overflow-wrap: anywhere; }
.tabs { width: 100%; border-collapse: collapse; background: var(--powierzchnia); border-radius: ${R.group}px; overflow: hidden; font-variant-numeric: tabular-nums; }
.tabs th { text-align: left; font-size: calc(${rem(TY.footnote.size)} * var(--dt-liczba)); color: var(--tekst2); font-weight: 600; padding: ${S.s}px ${S.l}px ${S.xs}px; }
.tabs th:first-child, .tabs td:first-child { width: 3.5em; }
.tabs td { padding: ${S.s}px ${S.l}px; border-top: 1px solid var(--linia); font-size: calc(${rem(TY.body.size)} * var(--dt-liczba)); }
.btn-row { margin: ${S.xl}px ${S.l}px 0; display: grid; gap: ${S.s}px; }
.btn-danger { width: 100%; min-height: ${T.SIZE.buttonSecondary}px; border-radius: ${R.button}px; background: var(--powierzchnia); color: var(--danger); font-weight: 600; font-size: ${fs('button')}; padding: ${S.xs}px ${S.l}px; }
.koniec { height: ${S.xxxl}px; }
/* okno potwierdzenia (systemowe, UIAlertController — tu tylko podgląd wyglądu) */
.alert-tlo { position: absolute; inset: 0; background: rgba(0,0,0,.4); z-index: 5 !important; display: grid; place-items: center; padding: ${S.l}px; }
.alert { width: min(calc(270px * var(--dt-opis)), 100%); background: var(--powierzchnia); border-radius: 14px; text-align: center; color: var(--tekst); overflow: hidden; }
.alert .tr { padding: ${S.l}px ${S.l}px ${S.m}px; }
.alert b { display: block; font-size: ${fs('bodyStrong')}; line-height: 1.3; }
.alert p { font-size: ${fs('footnote')}; margin-top: ${S.xs}px; line-height: 1.35; }
.alert .pr { display: flex; flex-wrap: wrap; border-top: 1px solid var(--linia); }
.alert .pr button { flex: 1 1 50%; min-height: ${T.SIZE.hit}px; font-size: ${fs('body')}; color: var(--akcent); padding: ${S.s}px; }
.alert .pr button + button { border-left: 1px solid var(--linia); }
.alert .pr .ds { color: var(--danger); font-weight: 600; }
`;

// ---------- ekrany ----------
const fmtN = (t, v) => v.toLocaleString(t.locale);
function ekrany(t, { lb = false } = {}) {
  const nag = `<header class="nag"><h1 class="nag-t">Góra A<span class="czas">24:13</span></h1><button class="ib" aria-label="${t.opcje}">${I.more}</button><button class="bt">${t.zakoncz}</button></header>`;
  const W4 = ['80×6', '80×6', '80×6', '80×6'];
  const pm = (u, krok, kg) => `<div class="pmp"><div class="pmg"><button class="pm" aria-label="−${krok} ${u}">${I.minus}</button><span class="pmw"><small>${u}</small></span><button class="pm" aria-label="+${krok} ${u}">${I.plus}</button></div><div class="pmg"><button class="pm" aria-label="−1 ${t.powt}">${I.minus}</button><span class="pmw"><small>${t.powt}</small></span><button class="pm" aria-label="+1 ${t.powt}">${I.plus}</button></div></div>`;
  const dalej = `<section class="lista"><h2>${t.nast}</h2><ul>${[[t.ex.row, '3 × 10, 32 kg'], [t.ex.incl, '3 × 8, 26 kg'], [t.ex.pull, '3 × 6–8']].map(([n, d]) => `<li><span class="n">${n}</span><span class="d">${d.replace('.', ',')}</span></li>`).join('')}</ul></section>`;
  const seria = (ciez, u, krok, pow, poprz, wyn) => `${sb}${nag}<section class="tab" aria-label="${t.ex.bench}, ${t.seria(3, 4)}, ${ciez} ${u} × ${pow}">
<div class="tab-g"><span class="tab-cw">${t.ex.bench}</span><span class="tab-s">${t.seria(3, 4)}</span></div>
<div class="tab-l" aria-hidden="true" style="--zn:${(ciez + pow).length}"><span>${ciez}<small> ${u}</small></span><span class="x">×</span><span>${pow}</span></div>
${pm(u, krok)}
${pola(['1', '2', '3', '4'], 2, wyn, `${t.serii}: 2 / 4`)}
</section>
<div class="akcja"><button class="przyc">${t.zrobiona}</button><p class="opis">${f(t.poprz, { l: poprz })}</p></div>
${dalej}${zakl(t, 't')}`;
  const przerwa = `${sb}${nag}<section class="tab" aria-label="${t.przerwa} 1:47 / 2:30">
<div class="tab-g"><span class="tab-cw">${t.przerwa}</span><span class="tab-s">${f(t.zS, { s: '2:30' })}</span></div>
<div class="tab-l zeg" aria-hidden="true">1:47</div>
<p class="nast">${f(t.nastS, { x: `${t.seria(4, 4)}, 80 kg × 6` })}</p>
${pola(['1', '2', '3', '4'], 3, W4, `${t.serii}: 3 / 4`)}
</section>
<div class="akcja"><div class="prz"><button class="pm2">−15 ${t.sek}</button><button class="pm2">+15 ${t.sek}</button><button class="pm2 prim">${t.pomin}</button></div></div>
${dalej}${zakl(t, 't')}`;
  const dni = [...Array(7)].map((_, i) => new Intl.DateTimeFormat(t.locale, { weekday: 'short' }).format(new Date(2026, 9, 19 + i)));
  const STAN = ['zr', 'od', 'pl', 'od', 'od', 'pl', 'od'];
  const tydz = `<div class="tydz" role="list">${dni.map((d, i) => `<div role="listitem"${i === 2 ? ' class="dzis"' : ''}>${d}<b>${19 + i}</b>${STAN[i] === 'od' ? I.filizanka : `<i class="zn ${STAN[i]}"></i>`}</div>`).join('')}</div>`;
  const data = new Intl.DateTimeFormat(t.locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(2026, 9, 21));
  const nastD = new Intl.DateTimeFormat(t.locale, { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(2026, 9, 24));
  const start = `${motyw('motyw-start')}${sb}<div class="pasek"><span></span><button class="bt3">${t.planowanie}</button></div><div class="dt"><h1>${t.trening}</h1><p class="opis">${data}</p><p class="opis">${f(t.planN, { name: t.planName })}</p></div>
${tydz}
<section class="tab dzis-t" aria-label="${t.dzis}: Dół B">
<div class="tab-g"><span class="tab-cw">${t.dzis}: Dół B</span><span class="tab-s">6 ${t.cw}</span></div>
<ul><li><span class="n">${t.ex.squat}</span><span class="d">4 × 5, 100 kg</span></li><li><span class="n">${t.ex.rdl}</span><span class="d">3 × 8, 80 kg</span></li><li><span class="n">${t.plus4}</span></li></ul>
</section>
<div class="akcja"><button class="przyc">${f(t.start, { name: 'Dół B' })}</button><button class="przyc2">${t.inny}</button><p class="opis">${f(t.nastD, { list: `${nastD} — Góra A` })}</p></div>
${zakl(t, 't')}`;
  const pkt = [72.5, 75, 75, 77.5, 77.5, 80, 80, 82.5];
  const xs = pkt.map((_, i) => 8 + i * (284 / 7)), ys = pkt.map((v) => 108 - (v - 70) * 7.5);
  const wykres = `<svg viewBox="0 0 300 120" role="img" aria-label="${t.maxC}: 72,5 → 82,5 kg"><path d="M0 108H300M0 70H300M0 33H300" stroke="var(--linia)" stroke-width="1"/><polyline points="${xs.map((x, i) => `${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ')}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>${xs.map((x, i) => `<circle cx="${x.toFixed(1)}" cy="${ys[i].toFixed(1)}" r="${i === 7 ? 5 : 3.5}" fill="${i === 7 ? 'currentColor' : 'var(--powierzchnia)'}" stroke="currentColor" stroke-width="2"/>`).join('')}</svg>`;
  const os = [new Date(2026, 7, 31), new Date(2026, 9, 19)].map((d) => new Intl.DateTimeFormat(t.locale, { day: 'numeric', month: 'short' }).format(d));
  const postepy = `${sb}<div class="dt"><h1>${t.postepy}</h1></div>
<section class="wykres"><h2>${t.ex.bench}</h2><p class="wm"><span>${t.maxC}</span><span class="wv">${fmtN(t, 82.5)} kg</span></p>${wykres}<div class="os"><span>${os[0]}</span><span>${os[1]}</span></div></section>
<div class="grupa-t">${t.rekordy}</div>
<ul class="grupa"><li><span class="n">${t.maxC}</span><span class="v">${fmtN(t, 82.5)} kg</span></li><li><span class="n">${t.najlS}</span><span class="v">80 kg × 8</span></li><li><span class="n">${t.maxP}</span><span class="v">12</span></li><li><span class="n">${t.sesje}</span><span class="v">14</span></li></ul>
<div class="grupa-t">${t.cwiczenie}</div>
<div class="chipy" role="radiogroup">${[t.ex.bench, t.ex.squat, t.ex.rdl].map((n, i) => `<button class="chip${i === 0 ? ' wyb' : ''}" role="radio" aria-checked="${i === 0}">${n}</button>`).join('')}</div>
<div class="szuk">${I.lupa}<span>${t.szukaj}</span></div>
<div class="koniec"></div>${zakl(t, 's')}`;
  const pusty = `${sb}<div class="dt"><h1>${t.postepy}</h1></div>
<div class="pusty">${motyw('motyw-pusty')}<p class="opis">${t.wykresy}</p><button class="przyc">${t.zacznij}</button></div>
${zakl(t, 's')}`;
  const dzien = new Intl.DateTimeFormat(t.locale, { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(2026, 9, 19));
  const blok = (n, rows) => `<section class="blok"><h2>${n}</h2><table class="tabs"><thead><tr><th>#</th><th>${t.ciezar}</th><th>${t.pow}</th></tr></thead><tbody>${rows.map((r, i) => `<tr><td>${i + 1}</td><td>${r[0]} kg</td><td>${r[1]}</td></tr>`).join('')}</tbody></table></section>`;
  const sesjaTresc = `${sb}<div class="pasek"><button class="bt3">${I.wstecz}${t.wroc}</button><span class="tyt">${t.trening}</span><button class="bt3">${t.edytuj}</button></div>
<div class="dt"><h1>Góra A</h1></div>
<div class="meta"><p class="opis">${dzien}, 18:05</p><p class="opis">52 min, 16 ${t.serii}, 6840 kg</p></div>
${blok(t.ex.bench, [['80', 6], ['80', 6], ['80', 6], ['80', 5]])}
${blok(t.ex.row, [['32', 10], ['32', 10], ['32', 9]])}
<div class="btn-row"><button class="przyc2">${t.zapiszSz}</button></div>
<div class="btn-row"><button class="btn-danger">${t.usunSesje}</button></div>
<div class="koniec"></div>`;
  const okno = `<div class="alert-tlo" role="alertdialog" aria-label="${t.usunQ}"><div class="alert"><div class="tr"><b>${t.usunQ}</b><p>Góra A, ${dzien}</p><p>${t.health}</p></div><div class="pr"><button>${t.anuluj}</button><button class="ds">${t.usun}</button></div></div></div>`;
  const out = [['seria', seria('80', 'kg', '2,5', '6', '77,5 kg × 6', W4)]];
  if (lb) out.push(['seria-lb', seria('187,5', 'lb', '5', '12', '182,5 lb × 12', ['185×12', '185×12'])]);
  out.push(['przerwa', przerwa], ['start', start], ['postepy', postepy], ['postepy-pusty', pusty], ['sesja', sesjaTresc], ['sesja-usun', sesjaTresc + okno]);
  return out;
}

function plik(t, { lb }) {
  const palety = `:root { ${vars(T.light, 1)} }
[data-theme="dark"] { ${vars(T.dark, 1)} }
[data-kontrast="hc"] { ${vars(T.lightHC, 0)} }
[data-theme="dark"][data-kontrast="hc"] { ${vars(T.darkHC, 0)} }`;
  return `<!doctype html>
<html lang="${t.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>System E3 — ekrany TO BE (${t.lang})</title>
<!-- Plik wygenerowany: node --experimental-strip-types docs/design/narzedzia/e3-gen.mjs (tokeny: docs/design/tokeny.ts). Rola 04 build, M3, 21.10.2026.
     Nazwy szablonów, ciężary, daty i liczby — [PRZYKŁAD]. Nazwy ćwiczeń: biblioteka lib/seed.ts (poza pl po angielsku, DEC-13).
     Teksty: lib/i18n (pl), lib/locales/${t.lang === 'pl' ? 'el' : t.lang}.json; nowe teksty (brak w i18n): ${NOWE.join(' | ')} — dla el propozycja do przeglądu tłumacza.
     Krój treści: na iOS SF Pro; w makiecie zastępczo Source Sans 3 (OFL). Barlow Condensed nie ma greki ani cyrylicy: litery idą krojem zastępczym (tu Source Sans 3, na iOS SF Pro), cyfry zostają w Barlow.
     „Zwiększ kontrast”: atrybut data-kontrast="hc" na <html>. -->
<link rel="stylesheet" href="../kierunki/wspolne.css">
<style>
${palety}
${CSS}
</style>
<script>${POLA_JS}</script></head>
<body>
<div class="uklad">
${ekrany(t, { lb }).map(([n, h]) => `<main data-ekran="${n}" class="tel">${h}</main>`).join('\n')}
</div>
</body></html>
`;
}
writeFileSync(DESIGN + 'ekrany/e3-ekrany.html', plik(L.pl, { lb: true }));
writeFileSync(DESIGN + 'ekrany/e3-ekrany-el.html', plik(L.el, { lb: false }));

// ---------- arkusz ikony ----------
const offset = (i, t) => { const q = Math.min(1, Math.max(0, (t - i * 100) / 380)); return 120 * (1 - (1 - (1 - q) ** 3)); };
const IK = [...PL.map(([x, y, w, h, r], i) => ({ x, y, w, h, r, c: i })), { x: 93, y: 49, w: 7, h: 22, r: 2, c: 'ink' }];
const TAL = { j: ['#D7263D', '#1F5FD1', '#F2C230', '#2E9E5B'], c: ['#E8414F', '#4A82F0', '#F2C230', '#3FBE72'] };
const kadr = (t, ciemny, bg) => { const ink = ciemny ? '#ECEAE4' : '#15171A'; const kol = ciemny ? TAL.c : TAL.j;
  return `<svg viewBox="0 0 120 120" width="140" height="140" style="background:${bg}"><rect x="10" y="56" width="98" height="8" rx="2" fill="${ink}"/>${IK.map((p, i) => `<rect x="${p.x + offset(i, t)}" y="${p.y}" width="${p.w}" height="${p.h}" rx="${p.r}" fill="${p.c === 'ink' ? ink : kol[p.c]}"/>`).join('')}</svg>`; };
const ik = (src, s, extra = '') => `<img src="${src}" width="${s}" height="${s}" style="border-radius:${(s * 0.2237).toFixed(1)}px;display:block;${extra}" alt="">`;
const kolo = (src, s) => `<img src="${src}" width="${s}" height="${s}" style="border-radius:50%;display:block" alt="">`;
writeFileSync(DESIGN + 'ikona/arkusz.html', `<!doctype html>
<html lang="pl"><head><meta charset="utf-8"><title>Ikona — arkusz kontrolny E3</title>
<!-- Wygenerowany (e3-gen.mjs). Rysunek ikony bez zmian (assets/brand/icon*.svg, decyzja STOP E2). Zegarek: zegarek-1088.png z ikona.svg (ikona.mjs, kod 0).
     Maski: iOS zaokrąglony kwadrat (przybliżenie promieniem 22,37%), watchOS koło (HIG App icons: „For visionOS and watchOS, provide square layers so the system can create the circular icon shape.”). -->
<style>
@font-face { font-family: 'Zastepczy'; src: url('../fonty/source-sans-3/SourceSans3-var.ttf'); font-weight: 200 900; }
@font-face { font-family: 'Tablica'; src: url('../fonty/barlow-condensed/BarlowCondensed-Bold.ttf'); font-weight: 700; }
body { margin: 0; background: #d9dbdd; font-family: 'Zastepczy', sans-serif; color: #1c1f23; }
.ark { width: 1500px; padding: 28px; box-sizing: border-box; display: grid; gap: 18px; }
h1 { font-family: Tablica; font-size: 36px; margin: 0; } h2 { font-family: Tablica; font-size: 24px; margin: 6px 0 0; } p { margin: 0; font-size: 15px; line-height: 1.4; max-width: 1400px; }
.rz { display: flex; gap: 24px; align-items: flex-end; flex-wrap: wrap; }
.tap { padding: 18px; border-radius: 14px; display: flex; gap: 18px; align-items: flex-end; }
.tj { background: linear-gradient(160deg, #cfd8e3, #eef1f4); } .tc { background: linear-gradient(160deg, #10151c, #2a3038); color: #fff; } .tz { background: #000; color: #fff; }
figure { margin: 0; font-size: 13px; } figcaption { margin-top: 6px; }
.ciem { background: radial-gradient(circle at 30% 20%, #3a3f47, #1c1c1e); }
</style></head><body><div class="ark" data-ekran="ikona">
<h1>Ikona: obecny rysunek, pliki docelowe (zatwierdzone STOP E3, 21.10.2026)</h1>
<p>Rysunek bez zmian (decyzja STOP E2, 21.10.2026). Nowy plik: <b>zegarek 1088×1088</b> (HIG App icons, tabela specyfikacji: watchOS „1088x1088 px”, kształt okrągły; odczyt 21.10.2026). iOS: <code>assets/icon.png</code> 1024 RGB bez przezroczystości (ikona.mjs kod 0), ciemny i barwiony — obecne pliki. Android: nie wydawany (DEC-26) — otwarte. Wpięcie zegarka 1088 i tła startu: <code>ikona/konfiguracja.md</code> (rola 08).</p>
<h2>iPhone — jasna tapeta (180, 60, 40 i 29 pt)</h2>
<div class="rz"><div class="tap tj">${ik('../../../assets/brand/icon.svg', 180)}${ik('../../../assets/brand/icon.svg', 60)}${ik('../../../assets/brand/icon.svg', 40)}${ik('../../../assets/brand/icon.svg', 29)}</div>
<div class="tap tc">${ik('../../../assets/brand/icon.svg', 180)}${ik('../../../assets/brand/icon.svg', 60)}${ik('../../../assets/brand/icon.svg', 40)}${ik('../../../assets/brand/icon.svg', 29)}</div></div>
<h2>iPhone — wygląd ciemny i barwiony (tło ikony daje system)</h2>
<div class="rz"><div class="tap tc">${ik('../../../assets/brand/icon-dark.svg', 180, 'background:radial-gradient(circle at 30% 20%,#3a3f47,#1c1c1e)')}${ik('../../../assets/brand/icon-dark.svg', 60, 'background:#1c1c1e')}${ik('../../../assets/brand/icon-dark.svg', 29, 'background:#1c1c1e')}</div>
<div class="tap tj">${ik('../../../assets/brand/icon-dark.svg', 180, 'background:radial-gradient(circle at 30% 20%,#3a3f47,#1c1c1e)')}${ik('../../../assets/brand/icon-tinted.svg', 180, 'background:#1c1c1e;filter:sepia(1) hue-rotate(160deg) saturate(2)')}${ik('../../../assets/brand/icon-tinted.svg', 60, 'background:#1c1c1e;filter:sepia(1) hue-rotate(160deg) saturate(2)')}</div></div>
<h2>Zegarek — maska okrągła (zegarek-1088.png; 196, 100 i 44 px)</h2>
<div class="rz"><div class="tap tz">${kolo('zegarek-1088.png', 196)}${kolo('zegarek-1088.png', 100)}${kolo('zegarek-1088.png', 44)}</div>
<p style="max-width:700px">Talerze mieszczą się w kole: najdalszy narożnik (talerz 25 kg, 30/16 w siatce 120) leży 53 jednostki od środka przy promieniu 60. Tło papieru, nie czarne (HIG watchOS: „Avoid using black for your icon’s background.”).</p></div>
<h2>Ekran startowy i intro na tle motywu (zatwierdzone STOP E3, 21.10.2026: tło startu = bg z tokenów)</h2>
<div class="rz"><figure><div class="rz">${[0, 250, 450, 850].map((ms) => kadr(ms, false, T.light.bg)).join('')}</div><figcaption>jasny: ${T.light.bg} (dziś ${'#F4F3EF'}) — kadry 0, 250, 450, 850 ms (lib/intro.ts)</figcaption></figure>
<figure><div class="rz">${kadr(0, true, T.dark.bg)}${kadr(850, true, T.dark.bg)}</div><figcaption>ciemny: ${T.dark.bg} (dziś #121316)</figcaption></figure></div>
</div></body></html>
`);
console.log('OK: ekrany/e3-ekrany.html, ekrany/e3-ekrany-el.html, ikona/arkusz.html');
