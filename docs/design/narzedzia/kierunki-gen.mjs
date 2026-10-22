// Generator makiet E2 (M3, 21.10.2026): node docs/design/narzedzia/kierunki-gen.mjs — zapisuje docs/design/kierunki/<kierunek>.html (bez zależności).
import { writeFileSync } from 'node:fs';
const OUT = new URL('../kierunki/', import.meta.url).pathname;

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
const zakl = `<nav class="zakl"><a class="ak" aria-current="page">${ik.t}Trening</a><a>${ik.p}Plan</a><a>${ik.s}Postępy</a><a>${ik.w}Więcej</a></nav>`;
const pmGrupa = (wart, jedn, co, krok) => `<div class="pmg"><button class="pm" aria-label="Zmniejsz ${co} o ${krok}">${minus}</button><span class="pmw" role="button" aria-label="${co}: ${wart} ${jedn}, stuknij, aby wpisać">${wart}<small>${jedn}</small></span><button class="pm" aria-label="Zwiększ ${co} o ${krok}">${plus}</button></div>`;
const pmE = (etyk, co, krok) => `<div class="pmg"><button class="pm" aria-label="Zmniejsz ${co} o ${krok}">${minus}</button><span class="pmw"><small>${etyk}</small></span><button class="pm" aria-label="Zwiększ ${co} o ${krok}">${plus}</button></div>`;
const pmEtyk = `<div class="pmp">${pmE('kg', 'ciężar', '2,5 kg')}${pmE('powt.', 'powtórzenia', '1')}</div>`;
const pmPara = `<div class="pmp">${pmGrupa('80', 'kg', 'ciężar', '2,5 kg')}${pmGrupa('6', 'powt.', 'powtórzenia', '1')}</div>`;
const przerwaPrzyc = (prim) => `<div class="prz"><button class="pm2">−15 s</button><button class="pm2">+15 s</button><button class="pm2 ${prim}">Pomiń</button></div>`;
const dalej = (wiersze) => `<section class="lista"><h2>Dalej</h2><ul>${wiersze.map(([z, n, d]) => `<li>${z || ''}<span class="n">${n}</span><span class="d">${d}</span></li>`).join('')}</ul></section>`;
const DALEJ = [['', 'Wiosłowanie hantlem', '3 × 10, 32 kg'], ['', 'Wyciskanie hantli na ławce skośnej', '3 × 8, 26 kg'], ['', 'Podciąganie nachwytem', '3 × 6–8']];

const wspolnyCss = `
.pmp { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(148px * var(--dt-liczba))), 1fr)); gap: 8px; }
.pmg { min-width: 0; display: flex; align-items: center; justify-content: space-between; gap: 4px; }
.pmw { font-weight: 700; font-size: calc(1.375rem * var(--dt-liczba)); text-align: center; flex: 1; min-height: 44px; display: grid; place-items: center; line-height: 1; }
.pmw small { font-size: calc(0.8125rem * var(--dt-opis)); font-weight: 600; opacity: .8; display: block; margin-top: 2px; }
.prz { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 96px), 1fr)); gap: 8px; }
.pm2 { min-height: 52px; padding: 4px 8px; white-space: nowrap; border-radius: var(--r-przyc, 14px); background: var(--pole); color: var(--tekst); font-weight: 700; font-size: calc(1.0625rem * var(--dt-opis)); }
.pm2.prim { background: var(--przycisk); color: var(--przycisk-tekst); }
.akcja { padding: 16px 16px 0; display: grid; gap: 8px; }
.akcja .opis { text-align: center; }
`;

function strona(k) {
  return `<!doctype html>
<html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Kierunek ${k.lit} — ${k.nazwa}</title>
<!-- Makieta E2 (M3, rola 04 build, 21.10.2026). Plik wygenerowany; wszystkie nazwy ćwiczeń, ciężary, czasy i liczby serii na ekranach to [PRZYKŁAD].
     Teksty interfejsu z lib/i18n (Seria zrobiona, Pomiń, Zakończ, seria {n} z {all}). Krój treści: na iOS SF Pro; w makiecie zastępczo Source Sans 3 (OFL). -->
<link rel="stylesheet" href="wspolne.css">
<style>
${k.fontFace}
:root { ${k.jasny} }
[data-theme="dark"] { ${k.ciemny} }
${wspolnyCss}
${k.css}
</style></head>
<body>
<div class="uklad">
<main data-ekran="seria" class="tel" aria-label="Ekran treningu, stan seria">${sb}${nag}${k.seria}${zakl}</main>
<main data-ekran="przerwa" class="tel" aria-label="Ekran treningu, stan przerwa">${sb}${nag}${k.przerwa}${zakl}</main>
<aside class="panel" data-panel="karta">${k.karta}</aside>
<aside class="panel" data-panel="male">
<h3>Ikona — 180, 60 i 29 pt; jasna i ciemna</h3>
<div class="ikony tapeta-j"><img class="i180" src="ikony/${k.id}-jasna.svg" alt="Ikona kierunku ${k.lit}"><img class="i60" src="ikony/${k.id}-jasna.svg" alt=""><img class="i29" src="ikony/${k.id}-jasna.svg" alt=""></div>
<div class="ikony tapeta-c" style="margin-top:8px"><img class="i180" src="ikony/${k.id}-ciemna.svg" alt="Ikona kierunku ${k.lit}, wariant ciemny"><img class="i60" src="ikony/${k.id}-ciemna.svg" alt=""><img class="i29" src="ikony/${k.id}-ciemna.svg" alt=""></div>
<h3>Ekran blokady (Live Activity przerwy) i zegarek</h3>
<div class="male">${k.blokada}${k.zegarek}</div>
<p class="opis" style="color:#4c5562;margin-top:8px">Na ekranach wszystkie nazwy i liczby to [PRZYKŁAD]. Treść: na iOS SF Pro; w makiecie zastępczo Source Sans 3.</p>
</aside>
</div>
</body></html>
`;
}

// ---------- A: tablica podejść ----------
const polaA = (z, t) => `<div class="pola" role="img" aria-label="Serie ćwiczenia: ${z} z 4 zrobione">${[1, 2, 3, 4].map((n) => n <= z ? `<span class="pole z">80×6</span>` : n === t ? `<span class="pole t">${n}</span>` : `<span class="pole p">${n}</span>`).join('')}</div>`;
const A = {
  id: 'a', lit: 'A', nazwa: 'Tablica podejść',
  fontFace: `@font-face { font-family: 'Tablica'; src: url('../fonty/barlow-condensed/BarlowCondensed-SemiBold.ttf'); font-weight: 600; }
@font-face { font-family: 'Tablica'; src: url('../fonty/barlow-condensed/BarlowCondensed-Bold.ttf'); font-weight: 700; }`,
  jasny: `--krój-tytul: 'Tablica'; --bg: #E6E8E5; --tekst: #18202B; --tekst2: #4A5361; --linia: #CBD0CB; --pole: #D3D8D3; --powierzchnia: #F4F5F3; --przycisk: #13294B; --przycisk-tekst: #F5F1E6; --tablica: #13294B; --tablica-brzeg: #13294B; --tablica-tekst: #F5F1E6; --tablica-tekst2: #B7C1D0; --tablica-pole: #26446F; --zegar: #F2A900; --r-przyc: 8px;`,
  ciemny: `--bg: #161C24; --tekst: #E8EAED; --tekst2: #A3ACB8; --linia: #2C3440; --pole: #283244; --powierzchnia: #1E2530; --przycisk: #F5F1E6; --przycisk-tekst: #13294B; --tablica: #102544; --tablica-brzeg: #5675A8; --tablica-tekst: #F5F1E6; --tablica-tekst2: #AEB9CA; --tablica-pole: #22416D; --zegar: #F5B21C;`,
  css: `
.tab { margin: 4px 16px 0; background: var(--tablica); color: var(--tablica-tekst); border-radius: 8px; padding: 16px; border: 1px solid var(--tablica-brzeg); }
.tab-g { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; font-family: 'Tablica'; flex-wrap: wrap; }
.tab-cw { font-size: calc(1.5rem * var(--dt-tytul)); text-transform: uppercase; letter-spacing: .04em; font-weight: 600; line-height: 1.1; }
.tab-s { font-size: calc(1.125rem * var(--dt-opis)); color: var(--tablica-tekst2); white-space: nowrap; font-weight: 600; }
.tab-l { display: flex; align-items: baseline; justify-content: center; gap: 10px; font-family: 'Tablica'; font-weight: 700; font-size: calc(6rem * var(--dt-liczba)); line-height: .95; margin: 12px 0 12px; flex-wrap: wrap; }
.tab-l small { font-size: .3em; font-weight: 600; color: var(--tablica-tekst2); }
.tab-l .x { font-size: .45em; color: var(--tablica-tekst2); font-weight: 600; }
.tab-l.zeg { color: var(--zegar); font-size: calc(7rem * var(--dt-liczba)); }
.tab .pm { background: var(--tablica-pole); color: var(--tablica-tekst); }
.tab .pmw small { font-family: 'Tablica'; font-size: calc(1.125rem * var(--dt-opis)); color: var(--tablica-tekst); opacity: 1; font-weight: 600; }
.pola { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-top: 12px; }
.pole { min-height: 48px; border-radius: 4px; display: grid; place-items: center; font-family: 'Tablica'; font-size: calc(1.25rem * var(--dt-liczba)); font-weight: 700; position: relative; }
.pole.z { background: var(--tablica-tekst); color: var(--tablica); }
.pole.t { box-shadow: inset 0 0 0 3px var(--zegar); }
.pole.p { box-shadow: inset 0 0 0 1px var(--tablica-tekst2); color: var(--tablica-tekst2); font-weight: 600; }
.nast { font-family: 'Tablica'; font-weight: 600; text-align: center; font-size: calc(1.25rem * var(--dt-opis)); color: var(--tablica-tekst); line-height: 1.2; }
`,
  seria: `<section class="tab" aria-label="Karta teraz: Wyciskanie leżąc, seria 3 z 4, 80 kilogramów razy 6">
<div class="tab-g"><span class="tab-cw">Wyciskanie leżąc</span><span class="tab-s">seria 3 z 4</span></div>
<div class="tab-l" aria-hidden="true"><span>80<small> kg</small></span><span class="x">×</span><span>6</span></div>
${pmEtyk}
${polaA(2, 3)}
</section>
<div class="akcja"><button class="przyc">Seria zrobiona</button><p class="opis">Poprzednio 77,5 kg × 6</p></div>
${dalej(DALEJ)}`,
  przerwa: `<section class="tab" aria-label="Przerwa: zostało 1 minuta 47 sekund z 2 minut 30. Następna seria 4 z 4: 80 kilogramów razy 6">
<div class="tab-g"><span class="tab-cw">Przerwa</span><span class="tab-s">z 2:30</span></div>
<div class="tab-l zeg" aria-hidden="true">1:47</div>
<p class="nast">Następna: seria 4 z 4, 80 kg × 6</p>
${polaA(3, 4)}
</section>
<div class="akcja">${przerwaPrzyc('prim')}</div>
${dalej(DALEJ)}`,
  karta: `<h2>A — Tablica podejść</h2>
<p><b>Idea.</b> Karta „teraz” to tablica podejścia z zawodów: ciężar do podjęcia, numer serii i zegar, czytelne z 2 m.</p>
<h3>Element firmowy i dane</h3><p>Tablica: nazwa ćwiczenia, ciężar × powtórzenia następnej serii, pola serii (zrobione z wynikiem, bieżąca w ramce, czekające w konturze), w przerwie zegar. VoiceOver: „Wyciskanie leżąc, seria 3 z 4, 80 kg razy 6; zrobione 2 z 4”.</p>
<h3>Paleta</h3><div class="pal">
<div><b style="background:#13294B"></b>granat tablicy #13294B — tło tablic wyników w halach (wybór projektowy)</div>
<div><b style="background:#F5F1E6"></b>biel cyfr #F5F1E6 — cyfry tablicy</div>
<div><b style="background:#F2A900"></b>bursztyn zegara #F2A900 — tylko „teraz”: zegar i ramka bieżącej serii</div>
<div><b style="background:#E6E8E5"></b>beton hali #E6E8E5 — tło</div>
<div><b style="background:#18202B"></b>tusz #18202B — tekst</div></div>
<h3>Kroje</h3><p>Tytuły i liczby tablicy: Barlow Condensed 600/700 (OFL) — wąskie cyfry tablic i oznaczeń sprzętu. Treść: systemowy (makieta: Source Sans 3).</p>
<h3>Kształty i gęstość</h3><p>Prostokąty o małym promieniu (4–8 pt), jeden duży blok na górze, reszta lista iOS. Gęstość niska na karcie, standardowa niżej.</p>
<h3>Ruch, haptyka, dźwięk</h3><p>„Seria zrobiona”: tablica przewraca się na zegar (pół obrotu klapki, ok. 250 ms; przy „Ogranicz ruch” przenikanie), jedno stuknięcie haptyki. 30 s przed końcem przerwy zegar zmienia stan i wibruje raz (analogia do sygnału zegara zawodów — konwencja, nie zalecenie).</p>
<h3>Głos</h3><ul><li>Pusty: „Tablica czeka na pierwszy trening. Wybierz szablon i zacznij.”</li><li>Błąd: „Nie zapisaliśmy serii. Sprawdź wynik i stuknij jeszcze raz.”</li><li>Sukces: „Trening zapisany: 18 serii.”</li></ul>
<h3>Ikona</h3><p>Trzy pola tablicy na granacie: dwa pełne (zrobione), trzecie w bursztynowej ramce (teraz).</p>
<h3>Najmocniejszy argument</h3><p>Najlepiej czytelna z odległości: telefon na ławce, spojrzenie 1–3 s, a ciężar i numer serii są największe na ekranie.</p>`,
  blokada: `<div class="blokada"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px"><div><div style="font-size:13px;color:#b7c1d0">Przerwa, Wyciskanie leżąc</div><div style="font-family:Tablica;font-weight:700;font-size:44px;line-height:1;color:#F2A900">1:47</div></div><div style="text-align:right"><div style="font-family:Tablica;font-weight:600;font-size:20px">80 kg × 6</div><div style="display:flex;gap:3px;margin-top:6px">${'<i style="width:18px;height:14px;background:#F5F1E6;border-radius:2px"></i>'.repeat(3)}<i style="width:18px;height:14px;box-shadow:inset 0 0 0 1.5px #F5F1E6;border-radius:2px"></i></div></div></div></div>`,
  zegarek: `<div class="zegarek"><div style="font-size:13px;color:#b7c1d0">Seria 4 z 4</div><div style="font-family:Tablica;font-weight:700;font-size:50px;line-height:1;color:#F2A900">1:47</div><div style="font-family:Tablica;font-weight:600;font-size:24px">80 kg × 6</div><div style="display:flex;gap:3px;margin-top:auto">${'<i style="flex:1;height:16px;background:#F5F1E6;border-radius:2px"></i>'.repeat(3)}<i style="flex:1;height:16px;box-shadow:inset 0 0 0 1.5px #F5F1E6;border-radius:2px"></i></div></div>`,
};

// ---------- B: światła sędziowskie ----------
const xZnak = (c) => `<svg viewBox="0 0 20 20" width="62%" height="62%" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="${c}" stroke-width="4" stroke-linecap="round"/></svg>`;
const swiatla = (stany, kl = 'sw') => `<div class="${kl}" aria-hidden="true">${stany.split('').map((s) => s === 'z' ? '<i class="z"></i>' : s === 't' ? '<i class="t"></i>' : s === 'c' ? `<i class="c">${xZnak('var(--x)')}</i>` : '<i class="p"></i>').join('')}</div>`;
const B = {
  id: 'b', lit: 'B', nazwa: 'Światła sędziowskie',
  fontFace: `@font-face { font-family: 'Swiatla'; src: url('../fonty/chivo/Chivo-var.ttf'); font-weight: 100 900; }`,
  jasny: `--krój-tytul: 'Swiatla'; --waga-tytul: 800; --bg: #EEF0F2; --tekst: #1C1F23; --tekst2: #4F555D; --linia: #D3D7DC; --pole: #DDE0E4; --powierzchnia: #FFFFFF; --przycisk: #2A2E34; --przycisk-tekst: #FFFFFF; --obudowa: #2A2E34; --obudowa-brzeg: #2A2E34; --obudowa-tekst: #FFFFFF; --obudowa-tekst2: #BCC2CA; --biale: #FFFFFF; --zgaszone: #8A919B; --czerwone: #EC3B43; --x: #2A2E34; --r-przyc: 30px;`,
  ciemny: `--bg: #17191C; --tekst: #ECEEF0; --tekst2: #A4AAB2; --linia: #2E3238; --pole: #2A2E34; --powierzchnia: #212428; --przycisk: #ECEEF0; --przycisk-tekst: #1B1E22; --obudowa: #2A2E34; --obudowa-brzeg: #6A707A; --obudowa-tekst: #F4F5F6; --obudowa-tekst2: #B3B9C1; --biale: #F4F5F6; --zgaszone: #858C96; --czerwone: #F0444C; --x: #2A2E34;`,
  css: `
.obud { margin: 4px 16px 0; background: var(--obudowa); border: 1px solid var(--obudowa-brzeg); border-radius: 20px; padding: 20px 16px 16px; color: var(--obudowa-tekst); }
.sw { display: flex; justify-content: center; gap: 16px; }
.sw i { width: 60px; height: 60px; border-radius: 50%; display: grid; place-items: center; }
.sw .z { background: var(--biale); box-shadow: 0 0 0 5px rgba(255,255,255,.12); }
.sw .t { box-shadow: inset 0 0 0 3px var(--biale); }
.sw .t::after { content: ''; width: 14px; height: 14px; border-radius: 50%; background: var(--biale); }
.sw .p { box-shadow: inset 0 0 0 2px var(--zgaszone); }
.sw .c { background: var(--czerwone); }
.obud .pod { text-align: center; margin-top: 12px; font-size: calc(1.0625rem * var(--dt-opis)); color: var(--obudowa-tekst2); font-weight: 600; }
.cw { padding: 20px 16px 0; font-family: 'Swiatla'; font-weight: 800; font-size: calc(1.625rem * var(--dt-tytul)); line-height: 1.15; }
.wyn { padding: 12px 16px 0; }
.wyn .pmw { font-family: 'Swiatla'; font-weight: 800; font-size: calc(3rem * var(--dt-liczba)); }
.zeg { text-align: center; font-family: 'Swiatla'; font-weight: 800; font-size: calc(6rem * var(--dt-liczba)); line-height: 1; padding: 20px 16px 4px; }
.zeg-p { text-align: center; }
.msw { display: inline-flex; gap: 4px; background: var(--obudowa); padding: 5px 7px; border-radius: 10px; flex: none; }
.msw i { width: 16px; height: 16px; border-radius: 50%; display: grid; place-items: center; }
.msw .z { background: var(--biale); } .msw .t, .msw .p { box-shadow: inset 0 0 0 1.5px var(--zgaszone); } .msw .c { background: var(--czerwone); }
`,
  seria: `<section class="obud" aria-label="Serie ćwiczenia: 2 zrobione, trzecia teraz, czwarta przed tobą">${swiatla('zztp')}<p class="pod">Seria 3 z 4</p></section>
<h2 class="cw">Wyciskanie leżąc</h2>
<div class="wyn">${pmPara}</div>
<div class="akcja"><button class="przyc">Seria zrobiona</button><p class="opis">Poprzednio 77,5 kg × 6</p></div>
<section class="lista"><h2>Trening</h2><ul>
<li>${swiatla('zzzc', 'msw')}<span class="n">Przysiad ze sztangą</span><span class="d">3 z 4, 1 pominięta</span></li>
<li>${swiatla('zztp', 'msw')}<span class="n">Wyciskanie leżąc</span><span class="d">teraz</span></li>
<li>${swiatla('ppp', 'msw')}<span class="n">Wiosłowanie hantlem</span><span class="d">3 × 10, 32 kg</span></li></ul></section>`,
  przerwa: `<section class="obud" aria-label="Serie ćwiczenia: 3 zrobione, czwarta przed tobą">${swiatla('zzzp')}<p class="pod">3 z 4 zrobione</p></section>
<div class="zeg" aria-label="Przerwa: zostało 1 minuta 47 sekund z 2 minut 30">1:47</div>
<p class="opis zeg-p">przerwa z 2:30</p>
<div class="akcja">${przerwaPrzyc('prim')}<p class="opis">Następna: seria 4 z 4, 80 kg × 6</p></div>
<section class="lista"><h2>Trening</h2><ul>
<li>${swiatla('zzzc', 'msw')}<span class="n">Przysiad ze sztangą</span><span class="d">3 z 4, 1 pominięta</span></li>
<li>${swiatla('zzzp', 'msw')}<span class="n">Wyciskanie leżąc</span><span class="d">teraz</span></li>
<li>${swiatla('ppp', 'msw')}<span class="n">Wiosłowanie hantlem</span><span class="d">3 × 10, 32 kg</span></li></ul></section>`,
  karta: `<h2>B — Światła sędziowskie</h2>
<p><b>Idea.</b> Każda seria to światło sędziowskie: po „Seria zrobiona” zapala się białe, pominięta seria dostaje czerwone z krzyżykiem.</p>
<h3>Element firmowy i dane</h3><p>Rząd świateł = serie ćwiczenia: białe pełne (zrobiona), białe w konturze (teraz), szare w konturze (przed tobą), czerwone z „×” (pominięta — na próbę, decyzja STOP E1). Ten sam mały rząd przy każdym ćwiczeniu na liście, na zegarku i na ekranie blokady. VoiceOver: „Serie: 2 zrobione, 1 pominięta, 1 przed tobą”.</p>
<h3>Paleta</h3><div class="pal">
<div><b style="background:#FFFFFF"></b>białe światło #FFFFFF — „zrobione” (IPF 2.8: biały)</div>
<div><b style="background:#EC3B43"></b>czerwone światło #EC3B43 — „pominięta”, zawsze z „×” (IPF 2.8: czerwony)</div>
<div><b style="background:#2A2E34"></b>obudowa #2A2E34 — tło świateł i przycisk</div>
<div><b style="background:#EEF0F2"></b>aluminium #EEF0F2 — tło</div>
<div><b style="background:#8A919B"></b>zgaszone #8A919B — kontur czekającej serii</div></div>
<h3>Kroje</h3><p>Tytuły i liczby: Chivo 800 (OFL) — grotesk o mocnych, otwartych cyfrach, jak napisy na sprzęcie sędziowskim. Treść: systemowy (makieta: Source Sans 3).</p>
<h3>Kształty i gęstość</h3><p>Koło tylko dla świateł; przyciski w kształcie pastylki; jedna obudowa na górze. Bez akcentu barwnego poza światłami: interfejs czarno-biały.</p>
<h3>Ruch, haptyka, dźwięk</h3><p>„Seria zrobiona”: światło zapala się (ok. 120 ms, bez ruchu przy „Ogranicz ruch”) z jednym stuknięciem haptyki. Po ostatniej serii ćwiczenia cały rząd błyska razem przez 3 s (jak trzy światła sędziów).</p>
<h3>Głos</h3><ul><li>Pusty: „Tu zapalą się światła twoich serii. Zacznij trening.”</li><li>Błąd: „Seria nie zapisała się. Stuknij „Seria zrobiona” jeszcze raz.”</li><li>Sukces: „Trening zapisany: 17 z 18 serii.”</li></ul>
<h3>Ikona</h3><p>Trzy światła w obudowie: dwa białe i jedno czerwone (decyzja większości, jak na pomoście) — nie trzy kropki, które czyta się jak „więcej”.</p>
<h3>Rozróżnienie od „Usuń”</h3><p>Czerwone światło jest zawsze kołem z „×” w rzędzie świateł; „Usuń” jest zawsze słowem na przycisku w kolorze ostrzeżenia z motywu (inna barwa i kształt).</p>
<h3>Najmocniejszy argument</h3><p>Najmocniejszy moment przy najczęstszej czynności: każda seria zapala światło, a ten sam rząd świateł czyta się w każdym rozmiarze — od ekranu po zegarek.</p>`,
  blokada: `<div class="blokada" style="--obudowa:#2A2E34;--biale:#fff;--zgaszone:#8A919B;--czerwone:#EC3B43;--x:#2A2E34"><div style="display:flex;justify-content:space-between;align-items:center"><div><div style="font-size:13px;color:#bcc2ca">Przerwa, Wyciskanie leżąc</div><div style="font-family:Swiatla;font-weight:800;font-size:40px;line-height:1">1:47</div></div><div style="display:grid;justify-items:end;gap:6px">${swiatla('zzzp', 'msw')}<div style="font-size:15px">następna 80 kg × 6</div></div></div></div>`,
  zegarek: `<div class="zegarek" style="--obudowa:#2A2E34;--biale:#fff;--zgaszone:#8A919B;--czerwone:#EC3B43"><div style="font-size:13px;color:#bcc2ca">Wyciskanie leżąc</div><div style="display:flex;gap:6px">${'<i style="width:28px;height:28px;border-radius:50%;background:#fff"></i>'.repeat(3)}<i style="width:28px;height:28px;border-radius:50%;box-shadow:inset 0 0 0 2px #8A919B"></i></div><div style="font-family:Swiatla;font-weight:800;font-size:46px;line-height:1">1:47</div><div style="font-size:15px">80 kg × 6</div></div>`,
};

// ---------- C: kreska kredą ----------
function kreski(n, razem, h = 40, krok = 13, kolor = 'var(--kreda)', pusty = 'var(--kreda-pusta)', nowa = -1) {
  let x = 4, out = '';
  const j = (i) => [0.6, -0.8, 0.4, -0.3, 0.9, -0.5][i % 6];
  for (let g = 0; g * 5 < razem; g++) {
    const wGr = Math.min(5, razem - g * 5);
    const x0 = x;
    for (let i = 0; i < Math.min(4, wGr); i++) {
      const idx = g * 5 + i; const zr = idx < n;
      const c = idx === nowa ? 'var(--kreda-nowa)' : zr ? kolor : pusty;
      out += `<path d="M${x + j(idx)} ${3 + Math.abs(j(idx + 1))} Q${x - j(idx + 2)} ${h / 2} ${x + j(idx + 3)} ${h - 3}" stroke="${c}" stroke-width="${zr ? h / 11 : h / 18}" ${zr ? '' : `stroke-dasharray="${h / 10} ${h / 12}"`} fill="none" stroke-linecap="round"/>`;
      x += krok;
    }
    if (wGr === 5) {
      const idx = g * 5 + 4; const zr = idx < n;
      const c = idx === nowa ? 'var(--kreda-nowa)' : zr ? kolor : pusty;
      out += `<path d="M${x0 - krok * 0.55} ${h - 6} Q${x0 + krok * 1.5} ${h / 2 + 2} ${x - krok * 0.45} 6" stroke="${c}" stroke-width="${zr ? h / 11 : h / 18}" ${zr ? '' : `stroke-dasharray="${h / 10} ${h / 12}"`} fill="none" stroke-linecap="round"/>`;
    }
    x += krok * 1.2;
  }
  return `<svg class="krsvg" viewBox="0 0 ${x} ${h}" width="${x}" height="${h}" aria-hidden="true">${out}</svg>`;
}
const C = {
  id: 'c', lit: 'C', nazwa: 'Kreska kredą',
  fontFace: `@font-face { font-family: 'Kreda'; src: url('../fonty/caveat/Caveat-var.ttf'); font-weight: 400 700; }`,
  jasny: `--krój-tytul: 'Kreda'; --bg: #F5F6F3; --tekst: #232725; --tekst2: #515854; --linia: #D8DBD5; --pole: #E4E7E1; --powierzchnia: #FFFFFF; --przycisk: #2F3B36; --przycisk-tekst: #F5F6F3; --kreda: #2F3B36; --kreda-nowa: #A87C00; --kreda-pusta: #848D87; --r-przyc: 12px;`,
  ciemny: `--bg: #26302C; --tekst: #EEF0EA; --tekst2: #B7BFB8; --linia: #3A4540; --pole: #36423C; --powierzchnia: #2E3934; --przycisk: #EEF0EA; --przycisk-tekst: #26302C; --kreda: #EEF0EA; --kreda-nowa: #F0C94A; --kreda-pusta: #7A8781;`,
  css: `
.trk { margin: 4px 16px 0; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.trk .opis { white-space: nowrap; }
.cw { padding: 16px 16px 0; font-family: 'Kreda'; font-weight: 700; font-size: calc(2.375rem * var(--dt-tytul)); line-height: 1.05; }
.cw-s { padding: 4px 16px 0; }
.nag-t { font-size: calc(1.625rem * var(--dt-tytul)); }
.lista h2 { font-family: var(--tresc); font-weight: 700; }
.kr-cw { padding: 12px 16px 0; display: flex; flex-wrap: wrap; align-items: center; gap: 16px; }
.kr-cw .krsvg { height: calc(88px * var(--dt-liczba)); width: auto; flex: none; }
.liczby { padding: 8px 16px 0; font-weight: 700; font-size: calc(4.5rem * var(--dt-liczba)); line-height: 1; display: flex; gap: 12px; align-items: baseline; flex-wrap: wrap; }
.liczby small { font-size: .32em; color: var(--tekst2); font-weight: 600; }
.wyn { padding: 12px 16px 0; }
.zeg { padding: 8px 16px 0; font-weight: 700; font-size: calc(6rem * var(--dt-liczba)); line-height: 1; }
.lista li .krsvg { height: 22px; width: auto; flex: none; }
`,
  seria: `<div class="trk" role="img" aria-label="Trening: 9 z 18 serii zrobione">${kreski(9, 18, 28, 9)}<span class="opis">9 z 18 serii</span></div>
<h2 class="cw">Wyciskanie leżąc</h2><p class="opis cw-s">seria 3 z 4</p>
<div class="kr-cw" role="img" aria-label="Serie ćwiczenia: 2 z 4 zrobione">${kreski(2, 4, 88, 34)}</div>
<div class="liczby" aria-hidden="true"><span>80<small> kg</small></span><span><small>× </small>6</span></div>
<div class="wyn">${pmEtyk}</div>
<div class="akcja"><button class="przyc">Seria zrobiona</button><p class="opis">Poprzednio 77,5 kg × 6</p></div>
${dalej(DALEJ)}`,
  przerwa: `<div class="trk" role="img" aria-label="Trening: 10 z 18 serii zrobione">${kreski(10, 18, 28, 9, undefined, undefined, 9)}<span class="opis">10 z 18 serii</span></div>
<h2 class="cw">Przerwa</h2><p class="opis cw-s">z 2:30</p>
<div class="zeg" aria-label="Zostało 1 minuta 47 sekund">1:47</div>
<div class="kr-cw" role="img" aria-label="Serie ćwiczenia: 3 z 4 zrobione">${kreski(3, 4, 88, 34, undefined, undefined, 2)}<p class="opis">Następna: seria 4 z 4,<br>80 kg × 6</p></div>
<div class="akcja">${przerwaPrzyc('prim')}</div>
${dalej(DALEJ)}`,
  karta: `<h2>C — Kreska kredą</h2>
<p><b>Idea.</b> Seria to kreska, piąta przekreśla cztery — jak trener liczy na tablicy; trening widać jako rząd piątek.</p>
<h3>Element firmowy i dane</h3><p>Kreski: na górze cały trening (zrobione z czekającymi w kropkach), na karcie serie ćwiczenia; świeża kreska żółta przez czas przerwy. W Planie tydzień jako kreski treningów. VoiceOver: „Trening: 9 z 18 serii zrobione”.</p>
<h3>Paleta</h3><div class="pal">
<div><b style="background:#2F3B36"></b>łupek #2F3B36 — tablica, kreski, przycisk</div>
<div><b style="background:#EEF0EA"></b>kreda #EEF0EA — kreski nocą (motyw ciemny = tablica)</div>
<div><b style="background:#F0C94A"></b>kreda żółta #F0C94A / #A87C00 — tylko świeża kreska</div>
<div><b style="background:#F5F6F3"></b>magnezja #F5F6F3 — tło dnia (chłodna biel, nie krem)</div>
<div><b style="background:#848D87"></b>ślad #848D87 — kreska czekająca</div></div>
<h3>Kroje</h3><p>Tytuły: Caveat 700 (OFL) — pismo ręczne z tablicy trenera; tylko nazwy i nagłówki. Liczby i treść: systemowy (makieta: Source Sans 3), bo pismo ręczne w liczbach jest mniej czytelne.</p>
<h3>Kształty i gęstość</h3><p>Bez kart i ramek na górze: kreski i liczby leżą wprost na tle. Jasny motyw: ołówek na papierze; ciemny: kreda na łupku (zaprojektowany, nie odwrócony).</p>
<h3>Ruch, haptyka, dźwięk</h3><p>„Seria zrobiona”: kreska rysuje się pociągnięciem (ok. 200 ms; przy „Ogranicz ruch” od razu), krótka haptyka; piąta, przekreślająca, ma mocniejsze stuknięcie.</p>
<h3>Głos</h3><ul><li>Pusty: „Jeszcze bez kresek. Pierwsza seria zrobi pierwszą.”</li><li>Błąd: „Ta seria się nie zapisała. Stuknij jeszcze raz.”</li><li>Sukces: „Trening zapisany: 18 kresek.”</li></ul>
<h3>Ikona</h3><p>Pięć kresek kredą (cztery i przekreślenie, przekreślenie żółte) na łupku.</p>
<h3>Najmocniejszy argument</h3><p>Pokazuje cały trening naraz bez czytania liczb: ile zrobione i ile zostało widać jako długość rzędu kresek.</p>`,
  blokada: `<div class="blokada" style="--kreda:#EEF0EA;--kreda-pusta:#7A8781;--kreda-nowa:#F0C94A"><div style="display:flex;justify-content:space-between;align-items:center"><div><div style="font-size:13px;color:#c9cfca">Przerwa, Wyciskanie leżąc</div><div style="font-weight:700;font-size:40px;line-height:1">1:47</div></div><div style="display:grid;justify-items:end;gap:4px">${kreski(10, 18, 22, 7, undefined, undefined, 9)}<div style="font-size:15px">następna 80 kg × 6</div></div></div></div>`,
  zegarek: `<div class="zegarek" style="--kreda:#EEF0EA;--kreda-pusta:#7A8781;--kreda-nowa:#F0C94A"><div style="font-family:Kreda;font-weight:700;font-size:22px;line-height:1">Wyciskanie leżąc</div>${kreski(3, 4, 40, 16, undefined, undefined, 2)}<div style="font-weight:700;font-size:44px;line-height:1">1:47</div><div style="font-size:15px">80 kg × 6</div></div>`,
};

// ---------- D: talerze IWF w środku ----------
const KOL = ['var(--t25)', 'var(--t20)', 'var(--t15)', 'var(--t10)', 'var(--t5)'];
function gryf(n, razem, { w = 358, h = 132, mono = false, nowy = -1 } = {}) {
  const bar = h * 0.07, cy = h / 2;
  const hs = [0.94, 0.8, 0.64, 0.5, 0.4]; const ws = [0.085, 0.078, 0.07, 0.06, 0.05];
  let x = w * 0.14, out = `<rect x="2" y="${cy - bar / 2}" width="${w - 4}" height="${bar}" rx="${bar / 3}" fill="var(--gryf)"/>`;
  out += `<rect x="${w * 0.1}" y="${cy - h * 0.2}" width="${w * 0.022}" height="${h * 0.4}" rx="2" fill="var(--gryf)"/>`;
  for (let i = 0; i < razem; i++) {
    const k = i % 5; const pw = w * ws[k] * (i >= 5 ? 0.75 : 1); const ph = h * hs[k] * (i >= 5 ? 0.6 : 1);
    const zr = i < n;
    const fill = mono ? 'var(--zeliwo)' : KOL[k];
    if (zr) out += `<rect x="${x}" y="${cy - ph / 2}" width="${pw}" height="${ph}" rx="${pw * 0.28}" fill="${fill}" ${!mono && (k === 4 || k === 2) ? 'stroke="var(--gryf)" stroke-width="2"' : ''}${i === nowy ? ' class="nowy"' : ''}/>`;
    else out += `<rect x="${x + 1}" y="${cy - ph / 2 + 1}" width="${pw - 2}" height="${ph - 2}" rx="${pw * 0.28}" fill="none" stroke="var(--pusty)" stroke-width="2" stroke-dasharray="5 4"/>`;
    x += pw + w * 0.014;
  }
  out += `<rect x="${x + w * 0.01}" y="${cy - h * 0.14}" width="${w * 0.03}" height="${h * 0.28}" rx="3" fill="var(--gryf)" opacity="${n >= razem ? 1 : 0.25}"/>`;
  return `<svg class="gryf" viewBox="0 0 ${w} ${h}" aria-hidden="true">${out}</svg>`;
}
const D = {
  id: 'd', lit: 'D', nazwa: 'Talerze IWF w środku aplikacji',
  fontFace: `@font-face { font-family: 'Odlew'; src: url('../fonty/archivo/Archivo-var.ttf'); font-weight: 100 900; font-stretch: 62% 125%; }`,
  jasny: `--krój-tytul: 'Odlew'; --waga-tytul: 800; --bg: #F4F3EF; --tekst: #15171A; --tekst2: #4A4D53; --linia: #D6D3CB; --pole: #E7E5DF; --powierzchnia: #FFFFFF; --przycisk: #15171A; --przycisk-tekst: #F4F3EF; --gryf: #15171A; --t25: #D7263D; --t20: #1F5FD1; --t15: #F2C230; --t10: #2E9E5B; --t5: #FFFFFF; --pusty: #8C897F; --zeliwo: #3B3E44; --r-przyc: 12px;`,
  ciemny: `--bg: #17191C; --tekst: #ECEAE4; --tekst2: #A6A9AF; --linia: #34373C; --pole: #27292E; --powierzchnia: #1F2125; --przycisk: #ECEAE4; --przycisk-tekst: #15171A; --gryf: #C3C6CB; --t25: #E0364C; --t20: #3A74E0; --t15: #F2C230; --t10: #36AD68; --t5: #F4F4F2; --pusty: #70747C; --zeliwo: #8D9198;`,
  css: `
.gr { margin: 0 16px; }
.gr .gryf { width: 100%; height: auto; display: block; }
.gr-p { display: flex; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
.cw { padding: 8px 16px 0; font-family: 'Odlew'; font-stretch: 112%; font-weight: 800; font-size: calc(1.5rem * var(--dt-tytul)); line-height: 1.15; }
.liczby { padding: 4px 16px 0; font-family: 'Odlew'; font-stretch: 125%; font-weight: 900; font-size: min(calc(4.25rem * var(--dt-liczba)), calc(var(--w, 390px) * 0.2)); line-height: 1; display: flex; gap: 10px; align-items: baseline; flex-wrap: wrap; }
.liczby small { font-size: .3em; font-weight: 700; color: var(--tekst2); }
.wyn { padding: 12px 16px 0; }
.wyn .pmw small { font-size: calc(0.8125rem * var(--dt-opis)); }
.zeg { padding: 4px 16px 0; font-family: 'Odlew'; font-stretch: 125%; font-weight: 900; font-size: min(calc(5.5rem * var(--dt-liczba)), calc(var(--w, 390px) * 0.26)); line-height: 1; }
.lista li .gryf { width: 64px; height: 24px; flex: none; }
`,
  seria: `<div class="gr" role="img" aria-label="Serie ćwiczenia: 2 z 4 zrobione">${gryf(2, 4)}</div>
<h2 class="cw">Wyciskanie leżąc</h2><p class="opis" style="padding:0 16px">seria 3 z 4</p>
<div class="liczby" aria-hidden="true"><span>80<small> kg</small></span><span><small>×</small> 6</span></div>
<div class="wyn">${pmEtyk}</div>
<div class="akcja"><button class="przyc">Seria zrobiona</button><p class="opis">Poprzednio 77,5 kg × 6</p></div>
<section class="lista"><h2>Dalej</h2><ul>
<li><span class="n">Wiosłowanie hantlem</span><span class="d">3 × 10, 32 kg</span></li>
<li><span class="n">Wyciskanie hantli na ławce skośnej</span><span class="d">3 × 8, 26 kg</span></li>
<li><span class="n">Podciąganie nachwytem</span><span class="d">3 × 6–8</span></li></ul></section>`,
  przerwa: `<div class="gr" role="img" aria-label="Serie ćwiczenia: 3 z 4 zrobione">${gryf(3, 4, { nowy: 2 })}</div>
<h2 class="cw">Przerwa</h2><p class="opis" style="padding:0 16px">z 2:30</p>
<div class="zeg" aria-label="Zostało 1 minuta 47 sekund">1:47</div>
<div class="akcja">${przerwaPrzyc('prim')}<p class="opis">Następna: seria 4 z 4, 80 kg × 6</p></div>
<section class="lista"><h2>Dalej</h2><ul>
<li><span class="n">Wiosłowanie hantlem</span><span class="d">3 × 10, 32 kg</span></li>
<li><span class="n">Wyciskanie hantli na ławce skośnej</span><span class="d">3 × 8, 26 kg</span></li>
<li><span class="n">Podciąganie nachwytem</span><span class="d">3 × 6–8</span></li></ul></section>`,
  karta: `<h2>D — Talerze IWF w środku aplikacji</h2>
<p><b>Idea.</b> Ikona i intro przechodzą do treningu: każda zrobiona seria wsuwa talerz na gryf, a ćwiczenie kończy się obrazem z ikony.</p>
<h3>Element firmowy i dane</h3><p>Gryf z talerzami = serie ćwiczenia: talerz na gryfie (zrobiona), kontur kreskowany (przed tobą). Talerz żółty i biały mają obrys w kolorze gryfu (kontrast elementu do tła, WCAG 1.4.11). Kolejność i wielkości talerzy jak na ikonie (od 25 do 5 kg, od 6. serii mniejsze talerze tych samych barw — IWF 3.3.3.6). Bez paska talerzy i kalkulatora „na stronę” (DEC-06). VoiceOver: „Serie: 2 z 4 zrobione”.</p>
<h3>Konflikt z decyzją 09.10.2026</h3><p>Barwa talerza znaczy tu <b>numer serii</b> (1. czerwona, 2. niebieska…), a decyzja z 09.10.2026 mówi: kolor talerza koduje wyłącznie ciężar. Nie rozstrzygam — pytanie na bramce. Wariant zgodny z decyzją (D1, talerze żeliwne bez barw):</p>
<div class="d1" style="--gryf:#15171A;--zeliwo:#3B3E44;--pusty:#8C897F">${gryf(2, 4, { mono: true })}</div>
<h3>Paleta</h3><div class="pal">
<div><b style="background:#D7263D"></b>talerz 25 kg #D7263D (IWF 3.3.3.6: czerwony)</div>
<div><b style="background:#1F5FD1"></b>talerz 20 kg #1F5FD1 (niebieski)</div>
<div><b style="background:#F2C230"></b>talerz 15 kg #F2C230 (żółty)</div>
<div><b style="background:#2E9E5B"></b>talerz 10 kg #2E9E5B (zielony)</div>
<div><b style="background:#F4F3EF"></b>papier #F4F3EF i tusz #15171A — tło i tekst (obecne)</div></div>
<h3>Kroje</h3><p>Tytuły i liczby: Archivo szerokie 800–900 (OFL) — szerokie, ciężkie cyfry jak odlewane na talerzach. Treść: systemowy (makieta: Source Sans 3).</p>
<h3>Kształty i gęstość</h3><p>Zaokrąglone prostokąty talerzy jak na ikonie; gryf przez całą szerokość; reszta lista iOS.</p>
<h3>Ruch, haptyka, dźwięk</h3><p>„Seria zrobiona”: talerz wsuwa się na gryf ruchem z intro (ok. 300 ms; przy „Ogranicz ruch” pojawia się od razu), stuknięcie haptyki; ostatnia seria domyka zacisk.</p>
<h3>Głos</h3><ul><li>Pusty: „Gryf jest pusty. Zacznij trening, a każda seria doda talerz.”</li><li>Błąd: „Talerz nie wszedł — seria się nie zapisała. Stuknij jeszcze raz.”</li><li>Sukces: „Trening zapisany: 18 serii.”</li></ul>
<h3>Ikona</h3><p>Obecna ikona (koniec sztangi z talerzami IWF) bez zmian — kierunek rozwija ją do środka.</p>
<h3>Najmocniejszy argument</h3><p>Jedyny kierunek, który buduje na rozpoznawalności, którą aplikacja już ma: intro i ikona wracają przy każdej serii, więc „wow” jest spójne od pierwszej sekundy.</p>`,
  blokada: `<div class="blokada" style="--gryf:#C3C6CB;--t25:#E0364C;--t20:#3A74E0;--t15:#F2C230;--t10:#36AD68;--t5:#F4F4F2;--pusty:#6A6E76"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><div><div style="font-size:13px;color:#c3c6cb">Przerwa, Wyciskanie leżąc</div><div style="font-family:Odlew;font-stretch:125%;font-weight:900;font-size:38px;line-height:1">1:47</div></div><div style="width:150px;display:grid;justify-items:end">${gryf(3, 4, { w: 150, h: 56 })}<div style="font-size:15px">następna 80 kg × 6</div></div></div></div>`,
  zegarek: `<div class="zegarek" style="--gryf:#C3C6CB;--t25:#E0364C;--t20:#3A74E0;--t15:#F2C230;--t10:#36AD68;--t5:#F4F4F2;--pusty:#6A6E76"><div style="font-size:13px;color:#c3c6cb">Wyciskanie leżąc</div>${gryf(3, 4, { w: 152, h: 60 })}<div style="font-family:Odlew;font-stretch:125%;font-weight:900;font-size:42px;line-height:1">1:47</div><div style="font-size:15px">80 kg × 6</div></div>`,
};

for (const k of [A, B, C, D]) {
  const nazwa = { a: 'a-tablica-podejsc', b: 'b-swiatla-sedziowskie', c: 'c-kreska-kreda', d: 'd-talerze-iwf' }[k.id];
  writeFileSync(OUT + nazwa + '.html', strona(k));
  console.log(nazwa);
}
