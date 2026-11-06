// start-1-1-gen.mjs — generuje makiety trzech kierunków ekranu „Trening” nowej osoby (linia 1.1, 05.11.2026, rola 04).
// Użycie: node docs/design/narzedzia/start-1-1-gen.mjs  → docs/design/kierunki/start-1-1-{tablica-dnia,pusty-tydzien,zgloszenie}.html
// Teksty z lib/i18n (polskie klucze t()); nowe teksty oznaczone klasą .nowy i opisane w panelu; przykłady — [PRZYKŁAD].
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const KAT = resolve(dirname(fileURLToPath(import.meta.url)), '../kierunki');

const SB = '<div class="sb"><span>9:41</span><span class="sb-i" aria-hidden="true"><i style="width:17px;height:11px"></i><i style="width:15px;height:11px;border-radius:5px"></i><i style="width:25px;height:12px;border-radius:4px"></i></span></div>';
const ZAKL = '<nav class="zakl"><a class="ak" aria-current="page"><svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 13h20M7 7v12M10 5v16M16 5v16M19 7v12"/></svg>Trening</a><a><svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="20" height="18" rx="3"/><path d="M3 10h20M8 2v5M18 2v5"/></svg>Plan</a><a><svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 22V13M11 22V7M17 22v-6M23 22V4"/></svg>Postępy</a><a><svg viewBox="0 0 26 26" fill="currentColor"><rect x="5" y="6" width="4" height="14" rx="1.5"/><rect x="11" y="6" width="4" height="14" rx="1.5"/><rect x="18" y="9" width="3" height="8" rx="1.5"/></svg>Więcej</a></nav>';
// Gryf z talerzami w barwach motywu A2 (lib/brandIcon.ts ICON_*; barwy motif* z lib/tokens.ts) — dekoracja, aria-hidden.
const GRYF = (cls = '') => `<svg class="${cls}" viewBox="6 12 106 96" aria-hidden="true" focusable="false"><rect x="10" y="56" width="98" height="8" rx="2" fill="var(--motifBar)"/><rect x="30" y="16" width="15" height="88" rx="4" fill="var(--motif25)"/><rect x="48" y="23" width="14" height="74" rx="4" fill="var(--motif20)"/><rect x="65" y="31" width="12" height="58" rx="4" fill="var(--motif15)"/><rect x="80" y="38" width="10" height="44" rx="3" fill="var(--motif10)"/><rect x="93" y="49" width="7" height="22" rx="2" fill="var(--motifBar)"/></svg>`;
const TYT = (data = true) => `<div class="tyt"><h1>Trening</h1>${GRYF()}</div>${data ? '<p class="data">czwartek, 5 listopada</p>' : ''}`;
const DNI = [['PON.', 2], ['WT.', 3], ['ŚR.', 4], ['CZW.', 5], ['PT.', 6], ['SOB.', 7], ['NIEDZ.', 8]];
const DNI_PELNE = ['poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota', 'niedziela'];

const start = (s, nowyTekst) => s === 'nowa'
  ? `<button class="start${nowyTekst ? ' nowy' : ''}" aria-label="${nowyTekst ? 'Zacznij pierwszy trening' : 'Pusty trening'}"><span><b>${nowyTekst ? 'Zacznij pierwszy trening' : 'Pusty trening'}</b><small>${nowyTekst ? 'pusty — ćwiczenia dodasz w trakcie' : 'ćwiczenia dodasz w trakcie'}</small></span><span class="sz" aria-hidden="true">›</span></button>`
  : '<button class="start" aria-label="Start następnego treningu: Góra A"><span><b>Start: Góra A</b><small>5 ćw.</small></span><span class="sz" aria-hidden="true">›</span></button>';
const inny = '<button class="inny">Inny trening</button>';
const krok = (n, ok, tekst, akcja) => `<li><button class="wiersz" aria-label="${n}. ${tekst} ${ok ? 'zrobione' : 'do zrobienia'}${akcja ? '. ' + akcja : ''}"><span class="nr${ok ? ' ok' : ''}" aria-hidden="true">${ok ? '✓' : n}</span><span class="tx">${tekst}${akcja ? `<small>${akcja}</small>` : ''}</span>${akcja ? '<span class="sz" aria-hidden="true">›</span>' : ''}</button></li>`;
const kroki = (s) => `<section class="kroki"><h2>Pierwsze kroki</h2><ol>
${krok(1, s !== 'nowa', 'Utwórz pierwszy szablon albo wygeneruj szablony i plan.', s === 'nowa' ? 'Szablony i plan' : '')}
${krok(2, false, 'Ustaw plan tygodnia — zobaczysz tu dzisiejszy trening i dostaniesz przypomnienie.', 'Planowanie')}
${krok(3, false, s === 'nowa' ? 'Pierwszy trening: duży przycisk „Pusty trening” u góry.' : 'Pierwszy trening: duży przycisk „Start” u góry albo „Pusty trening”.', 'Przewodnik')}
${krok(4, false, 'Masz historię w innej aplikacji? Możesz ją dopisać z pliku CSV.', 'Importuj historię z pliku CSV')}
</ol><p class="zdanie"><span>Ćwiczysz w domu albo na siłowni? Ustaw sprzęt w „Miejsca i sprzęt”.</span><span aria-hidden="true">›</span></p></section>`;

function strona({ plik, tytul, css, ekrany, panel }) {
  const html = `<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>${tytul}</title>
<link rel="stylesheet" href="wspolne.css"><link rel="stylesheet" href="start-1-1.css"><style>${css}</style></head><body><div class="uklad">
${ekrany.map(([n, opis, tresc]) => `<main data-ekran="${n}" class="tel" aria-label="${opis}">${SB}${tresc}${ZAKL}</main>`).join('\n')}
<aside class="panel">${panel}</aside></div></body></html>`;
  writeFileSync(resolve(KAT, plik), html);
  console.log('zapisano', plik);
}

/* ---------- K1 „Tablica dnia” ---------- */
const tabDnia = (s) => {
  const pola = [['Szablony', s === 'nowa' ? '0' : '1'], ['Plan tygodnia', 'brak'], ['Treningi', '0']];
  const vo = `Tablica dnia: dziś, czwartek, 5 listopada. Szablony: ${pola[0][1]}. Plan tygodnia: brak. Treningi: 0.`;
  return `<section class="td" role="img" aria-label="${vo}"><div class="td-g"><span class="td-dz">DZIŚ: CZWARTEK, 5 LISTOPADA</span></div>
<div aria-hidden="true">${pola.map(([k, v], i) => `<div class="td-r"><span>${k}</span><b class="${s !== 'nowa' && i === 0 ? 'flip' : ''}">${v}</b></div>`).join('')}</div></section>`;
};
strona({
  plik: 'start-1-1-tablica-dnia.html', tytul: 'K1 Tablica dnia',
  css: `.td{margin:12px 16px 0;background:var(--board);border:1px solid var(--boardEdge);border-radius:8px;padding:16px;color:var(--boardText);display:flex;flex-direction:column;gap:8px}
.td-dz{font-family:var(--krój-tytul);font-weight:600;letter-spacing:.04em;line-height:1.1;font-size:calc(1.5rem*var(--dt-tytul))}
.td-r{display:flex;justify-content:space-between;align-items:baseline;gap:8px;border-top:1px solid var(--boardField);padding-top:8px;font-size:calc(1.0625rem*var(--dt-opis));line-height:1.3}
.td-r b{font-family:var(--krój-tytul);font-weight:600;font-size:calc(1.125rem*var(--dt-liczba));color:var(--boardText);display:inline-block}.td-r span{color:var(--boardText)}
.td-r b.flip{animation:flip .25s ease-out}@keyframes flip{from{transform:rotateX(90deg)}to{transform:none}}`,
  ekrany: [
    ['nowa', 'Trening, nowa osoba bez szablonu', `${TYT(false)}${tabDnia('nowa')}<div class="sek">${start('nowa', true)}${inny}</div>${kroki('nowa')}`],
    ['szablon', 'Trening, szablon bez planu', `${TYT(false)}${tabDnia('szablon')}<div class="sek">${start('szablon')}${inny}</div>${kroki('szablon')}<p class="uw">[PRZYKŁAD] nazwa szablonu „Góra A”, 5 ćw.</p>`],
  ],
  panel: `<h2>K1 · Tablica dnia</h2><p><b>Idea:</b> od pierwszego dnia nowa osoba dostaje tę samą granatową tablicę co osoba z planem — z dzisiejszym dniem i stanem startu zamiast ćwiczeń.</p>
<h3>Element firmowy i dane</h3><ul><li>Tablica „Dziś” (kierunek A) w tej samej postaci co u osoby z planem: nagłówek „DZIŚ: …” wersalikami (W3) z prawdziwą datą.</li><li>Wiersze tablicy (jak ćwiczenia dnia): liczba szablonów, plan, liczba treningów — prawdziwy stan z <code>lib/dashboard.ts firstSteps</code> i historii.</li></ul>
<h3>Moment</h3><p>Po zapisaniu pierwszego szablonu pole „Szablony” obraca się jak klapka (0 → 1, 250 ms, <code>MOTION.boardFlipMs</code>). „Ogranicz ruch”: przenikanie 150 ms.</p>
<h3>VoiceOver</h3><p class="vo">„Tablica dnia: czwartek, 5 listopada. Szablony: 0. Plan tygodnia: brak. Treningi: 0.”</p>
<h3>Decyzje</h3><ul><li>Nie zmienia: układ B (przycisk startu nad krokami), lista „Pierwsze kroki” (P4 A, krok 4 CSV, zdanie o miejscach).</li><li>Data przenosi się z szarego podpisu na tablicę (ST-09). Bez wielkiej cyfry daty — to był układ „duża liczba + etykieta + statystyki” z kalibracji (poprawka po krytyce).</li><li><span class="nowy">Nowy tekst</span> przycisku: Z-2 (opcja).</li></ul>`,
});

/* ---------- K2 „Pusty tydzień” ---------- */
const pasek = (s) => `<p class="pt-p">Bez planu tygodnia</p><div class="pt" role="group" aria-label="Ten tydzień">${DNI.map(([d, n], i) => `<button class="pt-d${i === 3 ? ' dzis' : ''}" aria-label="${DNI_PELNE[i]}, ${n} listopada${i === 3 ? ', dziś' : ''}, wolne"><small>${d}</small><b>${n}</b><i class="pt-z">${s === 'po' && i === 3 ? '<svg viewBox="0 0 20 14" aria-hidden="true"><rect x="1" y="6" width="18" height="2" rx="1" fill="currentColor"/><rect x="5" y="1" width="3" height="12" rx="1" fill="currentColor"/><rect x="9" y="2.5" width="2.6" height="9" rx="1" fill="currentColor"/><rect x="12.6" y="4" width="2.2" height="6" rx="1" fill="currentColor"/></svg>' : ''}</i></button>`).join('')}</div>`;
const pustyStan = (s) => s === 'po' ? '' : `<div class="pt-pusty">${GRYF('pt-g')}<p>${s === 'nowa' ? 'Tu zobaczysz swoje treningi w tym tygodniu.' : 'Ustaw plan, a zobaczysz tu dni treningów.'}</p></div>`;
strona({
  plik: 'start-1-1-pusty-tydzien.html', tytul: 'K2 Pusty tydzień',
  css: `.pt-p{padding:0 16px;margin-top:12px;font-size:calc(.9375rem*var(--dt-opis));line-height:1.35;color:var(--tekst2)}
.pt{margin:8px 16px 0;display:flex;gap:4px;padding:4px;background:var(--surface);border-radius:12px}
.pt-d{flex:1;min-width:0;min-height:72px;display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 0;border-radius:8px;border:1.5px solid transparent;color:var(--tekst2)}
.pt-d small{font-size:calc(.6875rem*min(var(--dt-tresc),1.25));font-weight:600;line-height:1.2}.pt-d b{font-family:var(--krój-tytul);font-weight:700;font-size:calc(1.0625rem*min(var(--dt-tresc),1.3));line-height:1.3}
.pt-d.dzis{border-color:var(--tekst);color:var(--tekst)}.pt-z{height:16px;display:grid;place-items:center;color:var(--tekst)}.pt-z svg{width:20px;height:14px;animation:wjazd .25s ease-out}
@keyframes wjazd{from{transform:scale(.4);opacity:0}to{transform:none;opacity:1}}
.pt-pusty{display:flex;align-items:center;gap:12px;margin:8px 16px 0;padding:8px 12px}.pt-g{width:64px;height:auto;flex:none}.pt-pusty p{font-size:calc(.9375rem*var(--dt-opis));line-height:1.35;color:var(--tekst2)}`,
  ekrany: [
    ['nowa', 'Trening, nowa osoba bez szablonu', `${TYT()}${pasek('nowa')}${pustyStan('nowa')}<div class="sek">${start('nowa', true)}${inny}</div>${kroki('nowa')}`],
    ['szablon', 'Trening, szablon bez planu', `${TYT()}${pasek('szablon')}${pustyStan('szablon')}<div class="sek">${start('szablon')}${inny}</div>${kroki('szablon')}<p class="uw">[PRZYKŁAD] nazwa szablonu „Góra A”, 5 ćw.</p>`],
    ['po-treningu', 'Trening, moment: pierwszy trening zapisany', `${TYT()}${pasek('po')}<p class="pt-p nowy" style="margin:8px 16px 0;padding:0">Pierwszy trening zapisany: dziś, Pusty trening.</p><div class="sek">${start('szablon')}${inny}</div><p class="uw">Moment Z-5: znak dnia wjeżdża w kolumnę „dziś” (250 ms; „Ogranicz ruch”: pojawia się). Dalej „Ten tydzień” jak dziś.</p>`],
  ],
  panel: `<h2>K2 · Pusty tydzień</h2><p><b>Idea:</b> pasek tygodnia, który osoba z planem ma nad startem, jest od pierwszego dnia — pusty, z ramką „dziś”, czeka na pierwszy znak dnia.</p>
<h3>Element firmowy i dane</h3><ul><li>Pasek tygodnia (<code>components/TodayPlan.tsx</code>, <code>lib/dashboard.ts weekStrip</code> działa bez planu): prawdziwe dni 2–8 listopada, dziś w ramce, dni „wolne” bez znaku.</li><li>Znak dnia = mała ikona aplikacji (<code>DayIcon</code>), jak dziś po treningu.</li><li>Gryf A2 obok zdania — pusty stan, dozwolony w <code>MOTIF.where</code> (dekoracja, bez danych, ukryta dla VoiceOver i przy „Zwiększ kontrast”).</li></ul>
<h3>Moment</h3><p>Po pierwszym zapisanym treningu w kolumnie „dziś” pojawia się znak dnia (skala 0,4 → 1, 250 ms) i jednorazowe zdanie domknięcia (Z-5). „Ogranicz ruch”: bez skali.</p>
<h3>VoiceOver</h3><p class="vo">Każdy dzień: „czwartek, 5 listopada, dziś, wolne” (etykiety jak dziś w pasku).</p>
<h3>Decyzje</h3><ul><li>Zmienia regułę z kodu <code>TodayPlan.tsx:20,35</code> („nowa osoba — karty nie ma”) — to reguła agenta, nie decyzja właściciela; decyzja 08.10.2026 (lista „Pierwsze kroki”) zostaje.</li><li>Układ B zostaje: pasek nad startem jak u osoby z planem.</li><li><span class="nowy">Nowe teksty</span>: zdanie pustego stanu, domknięcie (Z-5), przycisk (Z-2).</li></ul>`,
});

/* ---------- K3 „Karta zgłoszenia” ---------- */
const zgl = (s) => {
  const w = [
    ['Miejsce i sprzęt', 'nie ustawione', 'Miejsca i sprzęt', false],
    ['Jednostka', 'kg', 'Ustawienia', false],
    ['Szablony', s === 'nowa' ? '0' : '1', 'Szablony i plan', s !== 'nowa'],
    ['Plan tygodnia', 'brak', 'Planowanie', false],
    ['Pierwszy trening', 'przed Tobą', 'Przewodnik', false],
    ['Historia z innej aplikacji', 'opcjonalnie', 'Importuj historię z pliku CSV', false],
  ];
  return `<section class="kroki zg"><h2>Pierwsze kroki</h2><div class="zg-k">${w.map(([k, v, a, ok]) => `<button class="zg-r${ok ? ' ok' : ''}" aria-label="${k}: ${v}${ok ? ', ustawione' : ''}. ${a}"><small>${k}</small><b>${v}${ok ? ' <i aria-hidden="true">✓</i>' : ''}</b><span class="zg-a">${a} ›</span></button>`).join('')}</div></section>`;
};
strona({
  plik: 'start-1-1-zgloszenie.html', tytul: 'K3 Karta zgłoszenia',
  css: `.zg-k{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,150px),1fr));gap:8px}
.zg-r{display:flex;flex-direction:column;align-items:flex-start;gap:4px;text-align:left;min-height:96px;padding:12px;border:1.5px solid var(--ctrlLine);border-radius:4px;background:var(--surface)}
.zg-r small{font-size:calc(.8125rem*var(--dt-opis));line-height:1.38;color:var(--tekst2)}.zg-r b{font-family:var(--krój-tytul);font-weight:700;font-size:calc(1.375rem*var(--dt-liczba));line-height:1.15}
.zg-r.ok{border-color:var(--tekst)}.zg-r i{font-style:normal;display:inline-block;animation:st .25s ease-out}.zg-a{margin-top:auto;font-size:calc(.8125rem*var(--dt-opis));font-weight:600;line-height:1.38}
@keyframes st{from{transform:scale(1.8);opacity:0}to{transform:none;opacity:1}}`,
  ekrany: [
    ['nowa', 'Trening, nowa osoba bez szablonu', `${TYT()}<div class="sek">${start('nowa', true)}${inny}</div>${zgl('nowa')}`],
    ['szablon', 'Trening, szablon bez planu', `${TYT()}<div class="sek">${start('szablon')}${inny}</div>${zgl('szablon')}<p class="uw">[PRZYKŁAD] nazwa szablonu „Góra A”, 5 ćw.</p>`],
  ],
  panel: `<h2>K3 · Karta zgłoszenia</h2><p><b>Idea:</b> „Pierwsze kroki” jako karta zgłoszenia zawodnika — każdy wiersz pokazuje, co aplikacja już wie o Tobie, i prowadzi tam, gdzie to zmienisz.</p>
<h3>Element firmowy i dane</h3><ul><li>Rubryki karty (pole z ramką, podpis, wartość, działanie) z prawdziwymi wartościami: miejsca (<code>settings.locations</code> = []), jednostka (<code>settings.unit</code> = kg), liczba szablonów, plan, pierwszy trening, import.</li><li>Wartości krojem tablicy (Barlow); „✓” i mocniejsza ramka przy tym, co osoba ustawiła sama — kształt, nie kolor. Jednostka bez „✓”: to założenie aplikacji (poprawka po krytyce).</li></ul>
<h3>Moment</h3><p>Gdy wartość się ustawia, obok wbija się „✓” jak stempel (skala 1,8 → 1, 250 ms). „Ogranicz ruch”: pojawia się.</p>
<h3>VoiceOver</h3><p class="vo">Wiersz: „Szablony: 1, ustawione. Szablony i plan.”</p>
<h3>Decyzje</h3><ul><li><b>Zmienia decyzję P4 A (11.10.2026)</b> w formie: kroki stają się rubrykami karty z wartością (po jednym przycisku zostaje).</li><li><b>Zmienia decyzję z 11.10.2026</b> „Miejsca i sprzęt — jedno zdanie z odnośnikiem, nie osobny krok” → osobna rubryka.</li><li>Dodaje rubrykę „Jednostka” (U8: pokazuje założenie aplikacji). Krok 4 (CSV) nigdy nie dostaje „✓” (DEC-04 a).</li></ul>`,
});
