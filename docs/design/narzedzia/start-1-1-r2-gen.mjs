// start-1-1-r2-gen.mjs — makiety rundy 2 ekranu startowego nowej osoby (05.11.2026). Użycie: node docs/design/narzedzia/start-1-1-r2-gen.mjs
// Pisze docs/design/kierunki/start-1-1-r2-{biblioteka,gryf,klapki}.html. Wspólne: start-1-1.css (tokeny), start-1-1-r2.css, start-1-1-r2.js, start-1-1-r2-figury.js.
// Teksty: istniejące klucze lib/i18n (np. „Inny trening”, „ćwiczenia dodasz w trakcie”, „Szablony i plan”, „Miejsca i sprzęt”, „Importuj historię z pliku CSV”,
// „Przewodnik”, „Powtórz ostatni ({name})”, „Pierwszy trening za Tobą!”); nowe teksty mają klasę .nowy (ramka przerywana) i trafią do lib/i18n przy wdrożeniu.
import { readFileSync, writeFileSync } from 'node:fs';
const K = 'docs/design/kierunki/';
const zakl = readFileSync(K + 'start-1-1-tablica-dnia.html', 'utf8').match(/<nav class="zakl"[\s\S]*?<\/nav>|<div class="zakl"[\s\S]*?<\/div>/)[0];
const sb = (cls = '') => `<div class="sb ${cls}"><span>9:41</span><span class="sb-i" aria-hidden="true"><i style="width:17px;height:11px"></i><i style="width:15px;height:11px;border-radius:5px"></i><i style="width:25px;height:12px;border-radius:4px"></i></span></div>`;
const FIG_N = 132; // liczba z kodu: shownFigureSpec() po CATALOG (start-1-1-r2-figury.js → FIG.shownCount); w aplikacji liczona, nie wpisana
const przyciski = (nowa = true, ost = 'Back Squat') => `<div class="dol">${nowa
  ? `<button class="glowny"><b class="nowy">Zacznij pierwszy trening</b><small>ćwiczenia dodasz w trakcie</small></button>`
  : `<button class="glowny"><b>Powtórz ostatni (${ost})</b><small>albo pusty — ćwiczenia dodasz w trakcie</small></button>`}
<button class="drugi">Inny trening</button></div>`;
const potem = (h = 'Kiedy zechcesz') => `<section class="potem"><h2 class="nowy">${h}</h2><ul>
<li><a href="#"><span>Szablony i plan</span><i>›</i></a></li><li><a href="#"><span>Miejsca i sprzęt</span><i>›</i></a></li>
<li><a href="#"><span>Importuj historię z pliku CSV</span><i>›</i></a></li><li><a href="#"><span>Przewodnik</span><i>›</i></a></li></ul></section>`;
const nagl = (data = true) => `<div class="nagl"><h1>Trening</h1>${data ? '<p class="data">czwartek, 5 listopada <span class="przyk" style="padding:0">[PRZYKŁAD: bieżąca data]</span></p>' : ''}</div>`;
const page = (title, kier, mains, panel) => `<!doctype html><html lang="pl" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<link rel="stylesheet" href="wspolne.css"><link rel="stylesheet" href="start-1-1.css"><link rel="stylesheet" href="start-1-1-r2.css">
<script src="start-1-1-r2-figury.js"></script><script src="start-1-1-r2.js" defer></script></head><body><div class="uklad">
${mains.map(([name, cls, label, body]) => `<main data-ekran="${name}" data-kier="${kier}" class="tel ${cls}" ${cls.includes('hc') ? 'data-hc' : ''} aria-label="${label}">${body}${zakl}</main>`).join('\n')}
<aside class="panel">${panel}</aside></div></body></html>`;
const STANY = (f) => [
  ['nowa', '', 'Nowa osoba — ruch', f(false)],
  ['nowa-ogranicz-ruch', 'rm', 'Nowa osoba — Ogranicz ruch', f(false)],
  ['nowa-kontrast', 'rm hc', 'Nowa osoba — Zwiększ kontrast', f(false)],
];

/* ---------- A: żywa biblioteka ---------- */
const sceneA = (rm, key = '') => `<section class="a-scena" ${key ? `data-cw="${key}"` : ''} role="img" aria-label="${key ? `Twój dzisiejszy trening: ${key}.` : `Biblioteka ćwiczeń: ${FIG_N} ćwiczeń z animacją ruchu. Teraz: Back Squat.`} Stuknij, aby otworzyć kartę ćwiczenia.">
<div class="a-gora">${key ? '<span class="nowy">Dziś zrobione</span><b>czwartek</b>' : `<span class="nowy">Biblioteka ćwiczeń</span><b>${FIG_N} z ruchem</b>`}</div>
<div class="a-klapka">${rm ? `<div class="a-figury"><figure><svg class="a-fig para" data-fig aria-hidden="true"></svg><figcaption>start</figcaption></figure><figure><svg class="a-fig para" data-fig aria-hidden="true"></svg><figcaption>koniec</figcaption></figure></div>` : `<svg class="a-fig" data-fig aria-hidden="true"></svg>`}
<div class="a-podloga"></div><div class="a-nazwa">Back Squat</div></div>
${key ? `<div class="a-wynik"><span class="ok">60 kg × 5</span><span class="ok">60 kg × 5</span><span class="ok">60 kg × 5</span></div><p class="przyk" style="padding:4px 0 0;color:var(--boardMuted)">[PRZYKŁAD: serie z zapisanego treningu]</p>`
  : `<div class="a-dol"><p class="nowy">Każde ćwiczenie pokazuje ruch i wskazówki.</p>${rm ? '<span class="a-nast"><button aria-label="Poprzednie ćwiczenie">‹</button><button aria-label="Następne ćwiczenie">›</button></span>' : ''}<button class="a-karta">Karta ćwiczenia</button></div>`}
</section>`;
const A = (rm) => `${sb()}${nagl()}${sceneA(rm)}${przyciski()}${potem()}`;
const Apo = `${sb()}${nagl()}${sceneA(false, 'Back Squat')}<p class="b-opis nowy" style="padding-top:12px">Pierwszy trening za Tobą! Następnym razem zaczniesz od niego jednym stuknięciem.</p>${przyciski(false)}${potem('Dalej')}`;
const panelA = `<h2>A. Żywa biblioteka</h2><p><b>Idea:</b> nowa osoba od pierwszej sekundy widzi, co aplikacja umie najlepiej — ruch ćwiczenia z biblioteki na tablicy na całą szerokość.</p>
<h3>Pierwsza sekunda</h3><p>Duża figura robi przysiad ze sztangą na granatowej tablicy; co pętlę tablica przewraca się klapką na kolejne ćwiczenie (martwy ciąg, wyciskanie).</p>
<h3>Prawdziwe dane</h3><ul><li>figury v2 z <code>lib/figures/v2</code> (rodziny z recenzją: przysiad, zawias, wyciskanie; <code>FIG_DATA.v2</code>), klatki z <code>shapesAt()</code>, tempo <code>uAt()</code>;</li><li>liczba ćwiczeń z ruchem: ${FIG_N} (liczona <code>shownFigureSpec</code> po katalogu, 05.11.2026);</li><li>po treningu: Twoje ćwiczenie i Twoje serie.</li></ul>
<h3>VoiceOver</h3><p class="vo">„Biblioteka ćwiczeń: ${FIG_N} ćwiczeń z animacją ruchu. Teraz: Back Squat. Stuknij, aby otworzyć kartę ćwiczenia.” Zmiana ćwiczenia nie jest ogłaszana (bez gadania co 4 s).</p>
<h3>Ogranicz ruch / Zwiększ kontrast</h3><p>Dwie pozy (start i koniec) jak w karcie ćwiczenia, zmiana ćwiczenia przyciskami ‹ ›. Kontrast: paleta figury z <code>darkHC</code>.</p>`;

/* ---------- B: gryf zostaje ---------- */
const DNI = ['PN', 'WT', 'ŚR', 'CZ', 'PT', 'SB', 'ND']; const DZIS = 3;
const os = (po) => `<div class="b-os" role="img" aria-label="Ten tydzień: od poniedziałku 2 do niedzieli 8 listopada. Dziś czwartek. ${po ? 'Dni z treningiem: czwartek.' : 'Dni z treningiem: brak.'}">
<div class="b-bar"></div><div class="b-dni" data-b-po="0">${DNI.map((d, i) => `<div class="${i < DZIS ? 'min' : ''}${i === DZIS ? ' dzis' : ''}">${d}</div>`).join('')}</div>
${po ? `<span class="b-znak" style="left:calc(6px + (100% - 16px) / 7 * ${DZIS + 0.5} - 12px)">✓</span>` : `<span class="b-zacisk" style="left:calc(6px + (100% - 16px) / 7 * ${DZIS + 0.5} - 8px)"></span>`}</div>`;
const B = (rm, po = false) => `${sb()}<div class="b-glowa" data-b-po="0"><div class="b-dzien">Czwartek</div><div class="b-data">5 listopada · tydzień 45 <span class="przyk" style="padding:0">[PRZYKŁAD]</span></div></div>
${os(po)}<p class="b-opis nowy" data-b-po="0">${po ? 'Pierwszy trening za Tobą! Każdy dzień z treningiem dostaje znak na gryfie.' : 'Każdy dzień z treningiem dostanie znak na gryfie.'}</p>
<div data-b-po="80">${przyciski(!po)}</div><div data-b-po="160">${potem(po ? 'Dalej' : 'Kiedy zechcesz')}</div>${!rm && !po ? '<div class="b-intro" aria-hidden="true"><div class="tlo"></div><svg></svg></div>' : ''}`;
const panelB = `<h2>B. Gryf zostaje</h2><p><b>Idea:</b> animacja startowa nie znika — talerze schodzą, a gryf z ikony rozciąga się na całą szerokość i staje się osią tygodnia, na której zacisk wskazuje dziś.</p>
<h3>Pierwsza sekunda</h3><p>Znane z ikony talerze wsuwają się na gryf (dzisiejsze intro), po czym gryf „wyjeżdża” w ekran: przedmiot z logo zostaje i zaczyna coś znaczyć.</p>
<h3>Prawdziwe dane</h3><ul><li>bieżący tydzień pon–niedz i dzisiejszy dzień (<code>lib/dashboard.ts</code> weekStrip działa bez planu);</li><li>dni z zapisanym treningiem — znak „✓” na gryfie (barwa <code>doneLine</code>, nie barwa talerza);</li><li>barwy talerzy tylko w intro (ikona = 25/20/15/10 kg), na ekranie żadnej.</li></ul>
<h3>VoiceOver</h3><p class="vo">„Ten tydzień: od poniedziałku 2 do niedzieli 8 listopada. Dziś czwartek. Dni z treningiem: brak.” Intro ukryte (jak dziś).</p>
<h3>Ogranicz ruch / Zwiększ kontrast</h3><p>Bez intro i bez przejścia (jak dziś: <code>introMode</code> → 'none'); ekran od razu w stanie końcowym. Kontrast: kreski dni <code>ctrlLine</code> HC.</p>`;

/* ---------- C: tablica klapkowa ---------- */
const flaps = (s) => `<span class="c-male">${[...s].map((ch) => `<span class="fl${ch === ' ' ? ' sp' : ''}" data-v="${ch}"></span>`).join('')}</span>`;
const C = (rm, po = false) => `${sb('na-tablicy')}<section class="c-tab" role="img" aria-label="${po ? 'Następny: trening 2. Ostatni: dziś, czwartek.' : 'Dziś czwartek, 5 listopada. Przed Tobą trening numer 1.'}">
<div class="c-wiersz"><span class="c-et">Dziś</span>${flaps('CZW 05 LIS')}</div>
${po ? `<div class="c-wiersz"><span class="c-et">Ostatni</span>${flaps('DZIŚ 1 ĆW')}</div>` : ''}
<div class="c-wielki"><span class="fl" data-big data-v="${po ? 2 : 1}"></span><div class="opis"><b class="nowy">${po ? 'Następny trening' : 'Pierwszy trening'}</b><span class="nowy">${po ? 'Numer z historii: każdy zapisany trening przestawia tablicę.' : 'Numer kolejnego treningu z Twojej historii.'}</span></div></div>
<p class="przyk" style="padding:8px 0 0;color:var(--boardMuted)">[PRZYKŁAD: data]</p></section>
${przyciski(!po)}${potem(po ? 'Dalej' : 'Kiedy zechcesz')}`;
const panelC = `<h2>C. Tablica klapkowa</h2><p><b>Idea:</b> pół ekranu to tablica podejść jak na pomoście: klapki przelatują i stają na dzisiejszej dacie i ogromnym numerze Twojego treningu — „1”.</p>
<h3>Pierwsza sekunda</h3><p>Granatowa tablica od samej góry ekranu, klapki szumią kaskadą od lewej, a wielka cyfra (ok. 230 pt) przeskakuje i staje na „1”.</p>
<h3>Prawdziwe dane</h3><ul><li>data i dzień tygodnia;</li><li>numer następnego treningu = liczba zapisanych treningów + 1 (historia);</li><li>po treningu: „Ostatni: dziś, 1 ćw.” i „2”.</li></ul>
<h3>VoiceOver</h3><p class="vo">„Dziś czwartek, 5 listopada. Przed Tobą trening numer 1.” Klapki ukryte, bez ogłaszania znaków pośrednich.</p>
<h3>Ogranicz ruch / Zwiększ kontrast</h3><p>Wartości od razu (przenikanie 150 ms, <code>MOTION.reducedCrossfadeMs</code>), bez przelotu znaków. Kontrast: <code>boardMuted</code> HC.</p>`;

const files = {
  'start-1-1-r2-biblioteka': ['R2 A Żywa biblioteka', 'a', [...STANY(() => '').map(([n, c, l]) => [n, c, l, A(c.includes('rm'))]), ['po-treningu', '', 'Po pierwszym treningu', Apo]], panelA],
  'start-1-1-r2-gryf': ['R2 B Gryf zostaje', 'b', [...STANY(() => '').map(([n, c, l]) => [n, c, l, B(c.includes('rm'))]), ['po-treningu', 'rm', 'Po pierwszym treningu', B(true, true)]], panelB],
  'start-1-1-r2-klapki': ['R2 C Tablica klapkowa', 'c', [...STANY(() => '').map(([n, c, l]) => [n, c, l, C(c.includes('rm'))]), ['po-treningu', '', 'Po pierwszym treningu', C(false, true)]], panelC],
};
for (const [f, [title, kier, mains, panel]] of Object.entries(files)) { writeFileSync(K + f + '.html', page(title, kier, mains, panel)); console.log(K + f + '.html'); }
