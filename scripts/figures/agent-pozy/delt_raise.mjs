// Generator póz rodziny delt_raise po stronie agenta (26.10.2026): unoszenie ramion bokiem, przodem, w skaptacji, tyłem (pochylony), w „Y”, wiosłowanie pionowe, halo.
// Ramiona prawie proste (lokiec_staly: stałe lekkie zgięcie łokcia), kierunek ramienia = elewacja (od pionu) i płaszczyzna (0 = przód, 90 = bok); błędów rysowanych brak (jedyny błąd katalogu to szarpanie = tempo).
import { lezyPrzodem } from './gora.mjs';
import { jednokierunkowa } from './dyn.mjs';
import { v2, BODY, R, r1, lerp, Y_STOJ, SPRZET, poza, nogiStoj, naLawce, buduj, bark, ramieFK, kier, rekaProsta, noga3, wyc, U9, U12, wolna } from './gora.mjs';

export const RODZINA = 'delt_raise';
const POL = (s) => (s === 'R' ? 1 : -1);
const obie = (spec) => ({ R: spec, L: spec });
const sprzJ = (sprzet, s) => sprzet.map((g) => (s && ['hantel', 'wyciag', 'kettlebell'].includes(g.rodzaj) ? { ...g, trzyma: s } : g));
const RACZ = (th, phi, o) => rekaProsta(th, phi, o);
/** Łuk dłoni w płaszczyźnie strzałkowej: chwyt na odległości 62 cm od barku, |z| = zr, elewacja θ (od pionu); biegun łokcia lekko na zewnątrz. */
const lukDloni = (theta, zr, pole = [0, -1, 0.4]) => (s) => { const re = Math.sqrt(62 ** 2 - (19 - zr) ** 2); const y0 = Y_STOJ + 50; return { g: [re * Math.sin(theta * R), y0 - re * Math.cos(theta * R), POL(s) * zr], pole: [pole[0], pole[1], POL(s) * pole[2]] }; };
const WOLNA = () => ({ f1: 4, a1: 8, f2: 8, zG: 24, obrot: 0 });

function wlasna(cw, o) {
  const fr = (u) => poza({ u, tulow: o.tulow, nogi: o.nogi, rece: o.rece(u) });
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-130, 130), ...o.sprzet], fr, us: o.us ?? U9 });
}
/** Stojąc: rece(u) → { R, L }. */
function stoj(cw, o) { return wlasna(cw, { sprzet: o.sprzet, tulow: o.tulow ?? { m: [0, Y_STOJ], p: 0 }, nogi: o.nogi ?? nogiStoj(0, 14), rece: o.rece, us: o.us }); }
/** Rodzaje ruchu ramion (obie ręce): elewacja [θ0, θ1], płaszczyzna [φ0, φ1] (stopnie), lekki łokieć, obrót przedramienia. */
const ruch = (th, phi, o = {}) => (u) => obie(RACZ(lerp(th[0], th[1], u), lerp(phi[0], phi[1], u), { flex: Array.isArray(o.flex) ? lerp(o.flex[0], o.flex[1], u) : (o.flex ?? 14), ku: o.ku, pl: o.pl, obrot: o.obrot ? lerp(o.obrot[0], o.obrot[1], u) : undefined }));
/** Jedna ręka pracuje (R), druga zwisa przy boku. */
const ruchJ = (th, phi, o = {}) => (u) => ({ R: RACZ(lerp(th[0], th[1], u), lerp(phi[0], phi[1], u), { flex: Array.isArray(o.flex) ? lerp(o.flex[0], o.flex[1], u) : (o.flex ?? 14), ku: o.ku, pl: o.pl, obrot: o.obrot ? lerp(o.obrot[0], o.obrot[1], u) : undefined }), L: o.wolna ?? WOLNA() });
/** Wiosłowanie pionowe: chwyt (g) i biegun łokcia (łokcie na zewnątrz i w górę) z funkcji wysokości; zwraca { R, L } dla uchwytów o rozstawie zr i głębokości x. */
const rzad = (zr, x, y0, y1, o = {}) => (u) => { const y = lerp(y0, y1, u); const sp = (s) => ({ g: [x, y, POL(s) * zr], pole: [-0.15, 0.45, POL(s)], obrot: o.obrot }); return o.jedna ? { R: sp('R'), L: WOLNA() } : { R: sp('R'), L: sp('L') }; };


/** Unoszenie ramion przodem leżąc przodem na ławce skośnej (Straight Raises on Incline Bench ze sztangą; Front Incline Dumbbell Raise [OTWARTE] — patrz figury-sens.json): ramiona od zwisu pionowo w dół do poziomu przed sobą (w stronę głowy), łokieć stały lekko zgięty. */
function przodemLezac(cw, o) {
  /* Zatwierdzony plik póz (delt_raise.json) ma tu nogi i siedzisko sprzed partii 2 (122a12b5, wspólne lezyPrzodem poprawiło je dla innych rodzin): siedzisko 20 cm, kostki 52 cm za biodrem (kolana lekko zgięte), biegun kolana [1, 0.2, 0] bez odwrócenia.
   * Rysunek użytkownika nie może się zmienić (09.11.2026), więc generator odtwarza je jawnie; poprawa (nogi proste, siedzisko 2) wejdzie razem z recenzją ruchu tego ćwiczenia, nie przez przypadek. */
  const L = lezyPrzodem(o.kat ?? 45, { dl: 38, zr: 16, kolDx: 52, pole: [1, 0.2, 0], sedzisko: 20 }); for (const sd of ['R', 'L']) { L.nogi[sd].k[0] = L.m[0] + 52; L.nogi[sd].pole = [1, 0.2, 0]; } const zr = o.zr ?? 22; const re = Math.sqrt(62 ** 2 - (19 - zr) ** 2);
  const fr = (u) => { const th = lerp(0, 90, u) * R; const rece = {}; for (const sd of ['R', 'L']) { const sw = -POL(sd); const S = L.S(sd);
      rece[sd] = { g: [S[0] - re * Math.sin(th), S[1] - re * Math.cos(th), sw * zr], pole: [0.3, -1, 0], obrot: 0 }; }
    return poza({ u, tulow: { m: L.m, p: L.p, glowa: L.p, ext: L.ext }, nogi: L.nogi, rece }); };
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-110, 130), L.lawka, ...o.sprzet], fr, us: o.us ?? U9 });
}

/** Y Raise (hantle) leżąc PRZODEM na ławce skośnej (R1 04.11.2026, decyzja koordynatora wg wejścia badacza: oba źródła i katalog — chest-down on an incline bench): klatka na oparciu, ramiona od zwisu pionowo w dół
 * unoszone w literę „Y” (rozwarcie 36° od płaszczyzny strzałkowej) do linii tułowia (zgięcie barku do ok. 125°), łokieć stale lekko zgięty. Jak przodemLezac: chwyt zadany wprost, strona R leży po −z. */
function yLezac(cw, o) {
  const L = lezyPrzodem(o.kat ?? 45, { dl: 38, zr: 16, kolDx: 52, pole: [1, 0.2, 0] }); const len = o.dl ?? 63.5; const fi = (o.fi ?? 36) * R; const Y_KONIEC = o.koniec ?? 125;
  const fr = (u) => { const th = lerp(0, Y_KONIEC, u) * R; const rece = {}; for (const sd of ['R', 'L']) { const sw = -POL(sd); const S = L.S(sd);
      rece[sd] = { g: [S[0] - len * Math.sin(th) * Math.cos(fi), S[1] - len * Math.cos(th), S[2] + sw * len * Math.sin(th) * Math.sin(fi)], pole: [0.3, -1, 0], obrot: 0 }; }
    return poza({ u, tulow: { m: L.m, p: L.p, glowa: L.p, ext: L.ext }, nogi: L.nogi, rece }); };
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-110, 130), L.lawka, ...o.sprzet], fr, us: o.us ?? U12 });
}

/** Unoszenie ręki bokiem leżąc PRZODEM na ławce płaskiej (r2-W2): chwyt R na łuku w płaszczyźnie poprzecznej do tułowia, θ od zwisu (0°) do poziomu barku (90°), łokieć stale lekko zgięty; ręka L zwisa. Strona R leży po −z (jak w yLezac). */
function przodemBok(cw, o) {
  const L = lezyPrzodem(o.kat ?? 15, { top: o.top ?? 43, dl: 110, zr: 16, kolDx: 52, pole: [1, 0.2, 0] }); const len = o.dl ?? 62.5; const TH1 = o.koniec ?? 90;
  const fr = (u) => { const th = lerp(0, TH1, u) * R; const rece = {};
    for (const sd of ['R', 'L']) { const sw = -POL(sd); const S = L.S(sd); const t = sd === 'R' ? th : 0;
      rece[sd] = { g: [S[0], S[1] - len * Math.cos(t), S[2] + sw * len * Math.sin(t)], pole: [0.3, -1, 0], obrot: 0 }; }
    return poza({ u, tulow: { m: L.m, p: L.p, glowa: L.p, ext: L.ext }, nogi: L.nogi, rece }); };
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-110, 130), L.lawka, ...o.sprzet], fr, us: o.us ?? U9 });
}

/** Parametry pętli Alternating Deltoid Raise (r3): zwis N (θ, φ), szczyty przodem (top) i bokiem (topB), pierwszy odcinek ze zwisu = f1 drogi (krótki: tu cięciwa przy zmianie płaszczyzny zgięłaby łokieć najmocniej), zgięcie łokcia (flex, stałe), płaszczyzna zgięcia pl (+1: przedramię wyżej niż ramię, jak Front Raise; −1: niżej, jak Lateral Raise). */
export const ALT_DOMYSLNE = { flex: 28, thN: 12, phiN: 42, top: 86, topB: 92, phiA: 0, phiB: 85, plA: 1, plB: -1, plN: 1, f1: 0.12 };
/**
 * Alternating Deltoid Raise (r3-W1, r3-W2, r3-N1): zwis N → przód (1 s w górę, 2 s w dół, ta sama droga) → zwis N → bok (1 s w górę, 2 s w dół) → zwis N; czas pętli ALT_REP_MS = 6 s (anim.ts).
 * Interpolacja klatek jest liniowa (cięciwa), więc krótszy promień ramienia w środku odcinka zgina łokieć: przy 3 odcinkach na ruch (łuk ≈ 28°) zmiana kąta łokcia dochodziła do 12°, bez zapasu; przy 4 odcinkach (≈ 22°) i krótkim pierwszym
 * wynosi ok. 8° (reguła lokiec_staly: zmiana ≤ 12°, kąt ≤ 40°). Klatek jest 17 (po 8 odcinków na ruch: 4 w górę, 4 w dół), czyli ponad zalecane 12 — liczba klatek nie jest walidowana, a wyjątek pilnuje tests/figures-v2-delt-raise-p3.test.ts.
 * Początek i koniec pętli to TEN SAM zwis N (φ pośrednie), więc restart nie ma przeskoku; powtórzenie bokiem biegnie w płaszczyźnie φ = phiB od pierwszego odcinka po zwisie.
 */
export function alternating(H, P = {}) {
  const c = { ...ALT_DOMYSLNE, ...P }; const n = 4; const N = [c.thN, c.phiN, 0, c.plN]; /* 4 odcinki na jedno unoszenie i opuszczanie */
  const th = (k, top) => c.thN + (top - c.thN) * [0, c.f1, c.f1 + (1 - c.f1) / 3, c.f1 + ((1 - c.f1) * 2) / 3, 1][k];
  const A = (t, k) => [t, th(k, c.top), c.phiA, 0, c.plA], B = (t, k) => [t, th(k, c.topB), c.phiB, k / n, c.plB];
  const ALT = [[0, ...N]];
  for (let k = 1; k <= n; k++) ALT.push(A(k / n, k)); /* w górę: 1 s */
  for (let k = n - 1; k >= 1; k--) ALT.push(A(1 + ((n - k) * 2) / n, k)); /* w dół: 2 s */
  ALT.push([3, ...N]);
  for (let k = 1; k <= n; k++) ALT.push(B(3 + k / n, k));
  for (let k = n - 1; k >= 1; k--) ALT.push(B(4 + ((n - k) * 2) / n, k));
  ALT.push([6, ...N]);
  const U = ALT.map(([t]) => Math.round((t / 6) * 10000) / 10000);
  return jednokierunkowa(stoj('Alternating Deltoid Raise', { sprzet: [H], us: U, rece: (u) => { const [, t, phi, ob, pl] = ALT[U.findIndex((x) => Math.abs(x - u) < 1e-9)]; return obie(RACZ(t, phi, { flex: c.flex, pl, obrot: lerp(0, -35, ob) })); } }));
}

export const WYJATKI = {
  'Kettlebell Halo': 'tor kettlebella wokół głowy przy regule „ciężar ≤ 30 cm od głowy” (ciezar_blisko_glowy) wymusza przenikanie głowy lub dzwonu przez ramię drugiej ręki (przeniesienie ręki przed twarzą): model ramienia ze stałymi kośćmi, bez ruchu łopatki i obrotu barku wokół osi ramienia, nie daje pozycji bez przenikania (kilka prób: promień 28–31 cm, wysokość od brody do czoła, biegun łokcia od głowy)',
  'One-Arm Incline Lateral Raise': 'leżenie bokiem na pochyłej ławce (ramię unoszone ku górze względem leżącego) wymaga obrotu tułowia wokół osi długiej (roll 90°) i ułożenia nóg poza siedziskiem; ruch ramienia w płaszczyźnie względem ławki, nie względem podłogi — poza zakresem kontraktu bez luzowania zakresów stawów',
  'Barbell Incline Shoulder Raise': 'OTWARTE — brak źródła ruchu (brak wskazówek, zestaw „open”; figury-sens.json → delt_raise.otwarte); wstrzymane do czasu źródła',
  'Dumbbell Incline Shoulder Raise': 'OTWARTE — brak źródła ruchu (zestaw „open”; figury-sens.json → delt_raise.otwarte); wstrzymane do czasu źródła',
  'Smith Incline Shoulder Raise': 'OTWARTE — brak źródła ruchu (zestaw „open”; figury-sens.json → delt_raise.otwarte); wstrzymane do czasu źródła',
  'Sled Reverse Flye': 'OTWARTE — brak źródła ruchu (zestaw „open”; figury-sens.json → delt_raise.otwarte) i sanie jako sprzęt; wstrzymane do czasu źródła',
  'Kettlebell Halo with Overhead Extension': 'OTWARTE — wskazówka halo.close przeczy części z wyprostem nad głową (ciężar odchodzi od głowy), potrzebne źródło na odmianę (figury-sens.json → delt_raise.otwarte)',
};
export const PRZYBLIZENIA = {
  'Dumbbell Lying One-Arm Rear Lateral Raise': 'przybliżenie: leżenie przodem na ławce lekko pochylonej (15°; na całkiem płaskiej tułów widziany z przodu spłaszczałby się do punktu, reguła czesc_ciala_nie_znika); ręka R pracuje, L zwisa swobodnie; ręka R od zwisu pionowo w dół unoszona bokiem w płaszczyźnie poprzecznej do tułowia do wysokości barku, łokieć stały lekko zgięty; bez modelu nóg poza ławką',
  'Cable Seated Lateral Raise': 'przybliżenie: ławka płaska jako siedzisko, dwa niskie wyciągi za plecami, kolumny bliżej osi ciała niż dłonie (linka ciąga dłoń do środka od startu, opór przez cały ruch); silnik prowadzi każdą linkę do dłoni po jej stronie, więc skrzyżowania linek nie rysuje; ręce unoszone symetrycznie',
  'Machine Lateral Raise': 'przybliżenie: dwie dźwignie obrotowe (R i L, jak w odwrotnych rozpiętkach na maszynie), oś obrotu na osi barku (schemat)',
  'Reverse Pec Deck': 'przybliżenie: dwie dźwignie (R i L) narysowane schematycznie z osią na wysokości barków; podpora piersiowa jako pionowe oparcie, siedzisko jako płaska ławka',
  'Car Drivers': 'przybliżenie: talerz obraca się od +30° do −30° i z powrotem (pętla lustrzana, obrót w obie strony); środek talerza stale na wysokości barków',
  'Cable Lateral Raise': 'przybliżenie: wyciąg stoi 60 cm przed ciałem (a nie z boku) i lekko po stronie przeciwnej; linka przechodzi przed ciałem do pracującej dłoni',
  'Cable Reverse Fly': 'przybliżenie: dwa wyciągi przed ciałem po bokach (z = ±58), linki nieskrzyżowane, dłonie na wysokości barków',
  'Y Raise (hantle)': 'przybliżenie: ławka skośna 45° z oparciem skróconym do klatki piersiowej (ramiona zwisają przed ławką), nogi proste za siedziskiem; Y: rozwarcie 36° od płaszczyzny strzałkowej, unoszenie do ok. 125° od pionu w dół',
};

export function generuj() {
  const G = {};
  const H = SPRZET.hantle();
  /* --- w bok --- */
  G['Lateral Raise (hantle)'] = () => stoj('Lateral Raise (hantle)', { sprzet: [H], rece: ruch([9, 88], [85, 85], { obrot: [0, -35], pl: -1, flex: [5, 13] }) });
  G['One-Arm Lateral Raise (hantel)'] = () => stoj('One-Arm Lateral Raise (hantel)', { sprzet: sprzJ([H], 'R'), rece: ruchJ([9, 88], [85, 85], { obrot: [0, -35], pl: -1, flex: [5, 13] }) });
  G['Band Lateral Raise'] = () => stoj('Band Lateral Raise', { sprzet: [{ rodzaj: 'guma', mocowanie: 'stopy' }], rece: ruch([9, 88], [85, 85], { pl: -1, flex: [5, 13] }) });
  G['Dumbbell Scaption'] = () => stoj('Dumbbell Scaption', { sprzet: [H], rece: ruch([9, 95], [70, 52], { obrot: [0, 0], pl: -1, flex: [5, 13] }) });
  /* --- do przodu --- */
  /* Ś-1 (recenzja R1 04.11.2026): unoszenie w przód w płaszczyźnie strzałkowej — odwiedzenie 0°, chwyt stale na szerokości barków (z = 19 cm), start przed udami; wcześniej płaszczyzna 62° → 0° dawała łuk na zewnątrz (chwyt do 48 cm od osi). */
  const FRONT_TH = [12, 90], FRONT_PHI = [0, 0];
  G['Front Raise'] = () => stoj('Front Raise', { sprzet: [H], rece: ruch(FRONT_TH, FRONT_PHI, { pl: 1, obrot: [0, 0] }) });
  const FRONT = { pl: 1, obrot: [0, 0] };
  G['Single Dumbbell Front Raise'] = () => stoj('Single Dumbbell Front Raise', { sprzet: [{ rodzaj: 'hantel', pionowo: true }], rece: (u) => { const f = lukDloni(lerp(14, 98, u), 3.5); return { R: f('R'), L: f('L') }; } });
  G['Front Plate Raise'] = () => stoj('Front Plate Raise', { sprzet: [{ rodzaj: 'talerz' }], rece: (u) => { const f = lukDloni(lerp(12, 104, u), 22.5); return { R: f('R'), L: f('L') }; } });
  /* r2-W1 / r3-W1, r3-W2, r3-N1 (recenzja ruchu 04.11.2026; karta adr.move: „Na zmianę: jedno powtórzenie unieś oba hantle przed sobą, następne — bokiem”): pętla jednokierunkowa obejmuje DWA powtórzenia obiema rękami naraz —
   * pierwsze przodem (płaszczyzna strzałkowa, jak Front Raise), drugie bokiem (φ 85°, jak Lateral Raise), każde: 1 s unoszenia + 2 s opuszczania (ALT_REP_MS = 6 s całej pętli, anim.ts), więc klatki leżą NIERÓWNO w u (czas / 6 s).
   * Łokieć stale zgięty o ok. 28° (r3-W1): przy 12 klatkach interpolacja idzie po cięciwach łuku (promień ramienia skraca się o ok. 3 cm), więc zgięcie przy prostym ramieniu pulsowało 14 → 40°; przy 28° ta sama zmiana promienia
   * zmienia kąt łokcia o mniej niż 12° (reguła lokiec_staly). Obie ręce wracają do TEGO SAMEGO zwisu N (φ 42°, przed udami i lekko na boki): początek i koniec pętli są identyczne (r3-N1: bez przeskoku przy restarcie), a drugie powtórzenie biegnie czysto bokiem (φ 85°) od pierwszej klatki po zwisie. */
  G['Alternating Deltoid Raise'] = () => alternating(H);
  G['Barbell Front Raise to Overhead'] = () => stoj('Barbell Front Raise to Overhead', { sprzet: [SPRZET.sztanga()], us: U12, rece: (u) => obie(RACZ(lerp(14, 167, u), 0, { flex: 25, pl: 1 })) });
  G['Dumbbell Front Raise to Overhead'] = () => stoj('Dumbbell Front Raise to Overhead', { sprzet: [H], us: U12, rece: ruch([12, 167], [0, 0], { flex: 25, pl: 1 }) });
  G['Cable Front Raise'] = () => stoj('Cable Front Raise', { sprzet: [wyc({ chwyt: 'uchwyt', x: -55, y: 15, z: 42, trzyma: 'R' })], rece: ruchJ(FRONT_TH, FRONT_PHI, FRONT) });
  G['Cable Lateral Raise'] = () => stoj('Cable Lateral Raise', { sprzet: [wyc({ chwyt: 'uchwyt', x: 60, y: 30, z: -10, trzyma: 'R' })], rece: ruchJ([9, 88], [85, 85], { obrot: [0, -35], pl: -1, flex: [5, 13] }) });
  G['Cable Seated Lateral Raise'] = () => { const B = naLawce(90, 43, { zr: 22 }); return wlasna('Cable Seated Lateral Raise', { sprzet: [{ rodzaj: 'lawka', x: 0, top: 43, kat: 0, dlugosc: 30, siedzisko: 38 }, wyc({ chwyt: 'uchwyt', dwa: true, x: -40, y: 15, z: 14 })], tulow: { m: [14, 53.8], p: 0 }, nogi: { R: noga3([54, 7, 20], [1, 0.3, 0.1]), L: noga3([54, 7, -20], [1, 0.3, -0.1]) }, rece: ruch([9, 88], [85, 85], { pl: -1, flex: [5, 13] }) }); };
  /* --- wiosłowanie pionowe --- */
  const ROW0 = 79.5, ROW1 = 126; /* r2-N1: szyna Smitha w x = 18 = x chwytu jednorącz (rzad(14, 18, …)); było 17 → gryf 1 cm przed szyną */
  G['Upright Row (sztanga)'] = () => stoj('Upright Row (sztanga)', { sprzet: [SPRZET.sztanga()], rece: rzad(11, 17, ROW0, ROW1, { obrot: -70 }) });
  G['Upright Row (hantle)'] = () => stoj('Upright Row (hantle)', { sprzet: [H], rece: rzad(14, 18, ROW0, ROW1, { obrot: -70 }) });
  G['Dumbbell One-Arm Upright Row'] = () => stoj('Dumbbell One-Arm Upright Row', { sprzet: sprzJ([H], 'R'), rece: rzad(14, 18, ROW0, ROW1, { obrot: -70, jedna: true }) });
  G['Upright Row (linki)'] = () => stoj('Upright Row (linki)', { sprzet: [wyc({ chwyt: 'drazek', x: 62, y: 15 })], rece: rzad(11, 17, ROW0, ROW1, { obrot: -70 }) });
  G['Band Upright Row'] = () => stoj('Band Upright Row', { sprzet: [{ rodzaj: 'guma', mocowanie: 'stopy' }], rece: rzad(11, 17, ROW0, ROW1, { obrot: -70 }) });
  G['Smith Machine One-Arm Upright Row'] = () => stoj('Smith Machine One-Arm Upright Row', { sprzet: [{ rodzaj: 'smith', x: 18, h: 200 }, { ...SPRZET.sztanga(), trzyma: 'R' }], rece: rzad(14, 18, ROW0, ROW1, { obrot: -70, jedna: true }) });
  G['Smith Machine Upright Row'] = () => stoj('Smith Machine Upright Row', { sprzet: [{ rodzaj: 'smith', x: 17, h: 200 }, SPRZET.sztanga()], rece: rzad(11, 17, ROW0, ROW1, { obrot: -70 }) });
  /* --- halo --- */
  /* --- leżąc PRZODEM na ławce płaskiej: jedna ręka (R) --- */
  /* r2-W2 (recenzja ruchu 04.11.2026; karta rear1.setup „Połóż się przodem na ławce; ręka z hantlem zwisa swobodnie w dół”, rear1.move „Unieś rękę bokiem do wysokości barku, prostopadle do tułowia”,
   * rear1.mis.high „Unoszenie ręki wyżej niż bark”): ramię pracuje w płaszczyźnie poprzecznej do tułowia — od zwisu pionowo w dół (θ = 0) do poziomu na wysokości barku (θ = 90), nie wyżej; druga ręka zwisa. */
  G['Dumbbell Lying One-Arm Rear Lateral Raise'] = () => przodemBok('Dumbbell Lying One-Arm Rear Lateral Raise', { sprzet: [{ ...H, trzyma: 'R' }] });
  /* --- Car Drivers --- */
  G['Car Drivers'] = () => { const cy = Y_STOJ + 50 - 2; const rr = (u) => { const a = lerp(30, -30, u) * R; const rad = 21; const dy = rad * Math.sin(a), dz = rad * Math.cos(a) - 19; const x = Math.sqrt(62 ** 2 - dy * dy - dz * dz); const sp = (s) => ({ g: [x, cy + POL(s) * dy, POL(s) * rad * Math.cos(a)], pole: [-0.2, -0.6, POL(s)] }); return { R: sp('R'), L: sp('L') }; };
    return wlasna('Car Drivers', { sprzet: [{ rodzaj: 'talerz' }], tulow: { m: [0, Y_STOJ], p: 0 }, nogi: nogiStoj(0, 14), rece: rr }); }; /* Ś-2: obrót ±30° w obie strony; r5-W1 (08.11.2026): wahadło (u 0 → 1 → 0, ten sam zegar co pasek faz), nie cykl_lustro — zob. tests/figures-v2-delt-raise-r5.test.tsx */
  /* --- w tył (pochylony), w „Y” --- */
  const pochyl = (px = -20, py = 76, p = 68) => ({ m: [px, py], p, glowa: p * 0.45 });
  const nogiPoch = (zr = 17) => { const n = (s) => noga3([0, 7, POL(s) * zr], [1, 0.1, POL(s) * 0.05]); return { R: n('R'), L: n('L') }; };
  G['Reverse Fly (hantle)'] = () => wlasna('Reverse Fly (hantle)', { sprzet: [H], tulow: pochyl(), nogi: nogiPoch(), rece: ruch([14, 88], [90, 90], { ku: [1, 0, 0], flex: 14 }) });
  G['One-Arm Cable Rear Lateral Raise'] = () => wlasna('One-Arm Cable Rear Lateral Raise', { sprzet: [wyc({ chwyt: 'uchwyt', x: 25, y: 15, z: -35, trzyma: 'R' })], tulow: pochyl(), nogi: nogiPoch(), rece: ruchJ([14, 88], [90, 90], { ku: [1, 0, 0], flex: 14 }) });
  G['Cable Reverse Fly'] = () => stoj('Cable Reverse Fly', { sprzet: [wyc({ chwyt: 'uchwyt', dwa: true, x: 82, y: 135, z: 58 })], rece: ruch([90, 90], [10, 100], { ku: [0, -1, 0], flex: 14 }) });
  G['Y Raise (hantle)'] = () => yLezac('Y Raise (hantle)', { sprzet: [H] });
  G['Cable Y Raise'] = () => stoj('Cable Y Raise', { sprzet: [wyc({ chwyt: 'uchwyt', dwa: true, x: 10, y: 15, z: 70 })], rece: ruch([20, 152], [30, 36], { pl: 1, flex: 14 }), us: U12 });
  /* --- maszyny: dźwignia na osi ruchu --- */
  const siedz = () => ({ m: [14, 53.8], p: 0 }); const nogiSied = () => ({ R: noga3([54, 7, 20], [1, 0.3, 0.1]), L: noga3([54, 7, -20], [1, 0.3, -0.1]) });
  G['Machine Lateral Raise'] = () => { const T = siedz(); const sp = (u) => RACZ(lerp(9, 88, u), 85, { flex: 14, pl: -1 }); const S = bark(T.m, 0, 1); const G0 = ramieFK(S, 1, sp(0)).g;
    const lev = (side) => { const sg = side === 'R' ? 1 : -1; const pv = [r1(T.m[0] - 25), r1(S[1]), r1(sg * S[2])]; return { rodzaj: 'dzwignia', tryb: 'obrot', x: pv[0], y: pv[1], z: pv[2], dlugosc: r1(Math.hypot(G0[0] - pv[0], G0[1] - pv[1], sg * G0[2] - pv[2])), punkt: 'dlonie', trzyma: side }; }; /* Ś-4: dwie dźwignie (R i L), jak w Reverse Pec Deck */
    return wlasna('Machine Lateral Raise', { sprzet: [{ rodzaj: 'lawka', x: 0, top: 43, kat: 80, dlugosc: 60, siedzisko: 38 }, lev('R'), lev('L')], tulow: { m: T.m, p: 0 }, nogi: nogiSied(), rece: (u) => obie(sp(u)), us: U12 }); };
  /* Reverse Pec Deck: siad PRZODEM do maszyny, klatka oparta o podporę przed tułowiem (plecy wolne), dwie dźwignie z rączkami (R i L); ręce w bok i w tył, aż łokcie miną linię pleców
   * (wskazówki rpd.setup, rpd.move; recenzja ruchu 27.10.2026). Podpora piersiowa to oparcie pionowe (lawka kat 90) tuż przed klatką, siedzisko to ławka płaska. */
  G['Reverse Pec Deck'] = () => { const T = siedz(); const sp = (u) => RACZ(90, lerp(8, 115, u), { flex: 14, ku: [0, -1, 0] }); const S = bark(T.m, 0, 1); const G0 = ramieFK(S, 1, sp(0)).g;
    const lev = (side) => { const sg = side === 'R' ? 1 : -1; const pv = [r1(S[0]), r1(G0[1] - 15), r1(sg * S[2])]; return { rodzaj: 'dzwignia', tryb: 'obrot', x: pv[0], y: pv[1], z: pv[2], dlugosc: r1(Math.hypot(G0[0] - pv[0], G0[1] - pv[1], sg * G0[2] - pv[2])), punkt: 'dlonie', trzyma: side }; };
    const siedzisko = { rodzaj: 'lawka', x: 0, top: 43, kat: 0, dlugosc: 30, siedzisko: 38 }; const podpora = { rodzaj: 'lawka', x: r1(T.m[0] + 19.7), top: 68, kat: 90, dlugosc: 30, siedzisko: 20 };
    return wlasna('Reverse Pec Deck', { sprzet: [siedzisko, podpora, lev('R'), lev('L')], tulow: { m: T.m, p: 0 }, nogi: nogiSied(), rece: (u) => obie(sp(u)), us: U12 }); };
  /* --- leżąc PRZODEM na ławce skośnej (opis źródłowy: face down, ręce proste, sztanga zwisa i unosi się przodem do ok. poziomu; docs/przekazanie badanie sprzeczności pkt 1, 27.10.2026) --- */
  G['Straight Raises on Incline Bench'] = () => przodemLezac('Straight Raises on Incline Bench', { sprzet: [SPRZET.sztanga()] });
  /* --- siedząc plecami do oparcia ławki skośnej (45–60°): hantle od zwisu przy udach do wysokości barków (2 źródła szczebla 4 + opis katalogu, 27.10.2026; wcześniej rysunek błędnie pokazywał leżenie przodem) --- */
  G['Front Incline Dumbbell Raise'] = () => { const B = naLawce(60, 43, { zr: 24 }); return wlasna('Front Incline Dumbbell Raise', { sprzet: [{ rodzaj: 'lawka', x: 0, top: 43, kat: 60, dlugosc: 75 }, H], tulow: { m: B.m, p: B.p, glowa: B.glowa }, nogi: B.nogi, rece: ruch([4, 92], [30, 0], { pl: 1, obrot: [0, 0] }) }); };
  return G;
}
