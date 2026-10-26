// Generator póz rodziny delt_raise po stronie agenta (26.10.2026): unoszenie ramion bokiem, przodem, w skaptacji, tyłem (pochylony), w „Y”, wiosłowanie pionowe, halo.
// Ramiona prawie proste (lokiec_staly: stałe lekkie zgięcie łokcia), kierunek ramienia = elewacja (od pionu) i płaszczyzna (0 = przód, 90 = bok); błędów rysowanych brak (jedyny błąd katalogu to szarpanie = tempo).
import { lezyPrzodem } from './gora.mjs';
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


/** Unoszenie ramion przodem leżąc przodem na ławce skośnej: ramiona od zwisu pionowo w dół do poziomu przed sobą (w stronę głowy), łokieć stały lekko zgięty. */
function przodemLezac(cw, o) {
  const L = lezyPrzodem(o.kat ?? 45, { dl: 38, zr: 16, kolDx: 52, pole: [1, 0.2, 0] }); const zr = o.zr ?? 22; const re = Math.sqrt(62 ** 2 - (19 - zr) ** 2);
  const fr = (u) => { const th = lerp(0, 90, u) * R; const rece = {}; for (const sd of ['R', 'L']) { const sw = -POL(sd); const S = L.S(sd);
      rece[sd] = { g: [S[0] - re * Math.sin(th), S[1] - re * Math.cos(th), sw * zr], pole: [0.3, -1, 0], obrot: 0 }; }
    return poza({ u, tulow: { m: L.m, p: L.p, glowa: L.p, ext: L.ext }, nogi: L.nogi, rece }); };
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-110, 130), L.lawka, ...o.sprzet], fr, us: o.us ?? U9 });
}

export const WYJATKI = {
  'One-Arm Incline Lateral Raise': 'leżenie bokiem na pochyłej ławce (ramię unoszone ku górze względem leżącego) wymaga obrotu tułowia wokół osi długiej (roll 90°) i ułożenia nóg poza siedziskiem; ruch ramienia w płaszczyźnie względem ławki, nie względem podłogi — poza zakresem kontraktu bez luzowania zakresów stawów',
  'Kettlebell Halo': 'tor kettlebella wokół głowy przy regule „ciężar ≤ 30 cm od głowy” (ciezar_blisko_glowy) wymusza przenikanie głowy lub dzwonu przez ramię drugiej ręki (przeniesienie ręki przed twarzą): model ramienia ze stałymi kośćmi, bez ruchu łopatki i obrotu barku wokół osi ramienia, nie daje pozycji bez przenikania (kilka prób: promień 28–31 cm, wysokość od brody do czoła, biegun łokcia od głowy)',
  'Barbell Incline Shoulder Raise': 'OTWARTE — brak źródła ruchu (brak wskazówek, zestaw „open”; figury-sens.json → delt_raise.otwarte); wstrzymane do czasu źródła',
  'Dumbbell Incline Shoulder Raise': 'OTWARTE — brak źródła ruchu (zestaw „open”; figury-sens.json → delt_raise.otwarte); wstrzymane do czasu źródła',
  'Smith Incline Shoulder Raise': 'OTWARTE — brak źródła ruchu (zestaw „open”; figury-sens.json → delt_raise.otwarte); wstrzymane do czasu źródła',
  'Sled Reverse Flye': 'OTWARTE — brak źródła ruchu (zestaw „open”; figury-sens.json → delt_raise.otwarte) i sanie jako sprzęt; wstrzymane do czasu źródła',
  'Kettlebell Halo with Overhead Extension': 'OTWARTE — wskazówka halo.close przeczy części z wyprostem nad głową (ciężar odchodzi od głowy), potrzebne źródło na odmianę (figury-sens.json → delt_raise.otwarte)',
  'Dumbbell Lying One-Arm Rear Lateral Raise': 'leżenie na boku (lub przodem) na ławce z ramieniem unoszonym ku górze względem leżącego wymaga obrotu tułowia wokół osi długiej i ułożenia nóg poza siedziskiem — nie do narysowania bez rozszerzenia kontraktu',
};
export const PRZYBLIZENIA = {
  'Cable Seated Lateral Raise': 'przybliżenie: ławka płaska jako siedzisko, dwa niskie wyciągi po bokach; ręce unoszone symetrycznie',
  'Machine Lateral Raise': 'przybliżenie: dźwignia obrotowa narysowana po stronie prawej (trzyma R), druga strona bez dźwigni; oś obrotu na osi barku (schemat)',
  'Reverse Pec Deck': 'przybliżenie: dźwignia po stronie prawej (schemat); siedzisko bez poduszki piersiowej',
  'Car Drivers': 'przybliżenie: talerz obraca się o 60° w jedną stronę (jedna klatka ruchu); kierowca obraca w obie strony',
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
  G['Front Raise'] = () => stoj('Front Raise', { sprzet: [H], rece: ruch([10, 90], [62, 0], { pl: 1, obrot: [0, 0] }) });
  const FRONT = { pl: 1, obrot: [0, 0] };
  G['Single Dumbbell Front Raise'] = () => stoj('Single Dumbbell Front Raise', { sprzet: [{ rodzaj: 'hantel', pionowo: true }], rece: (u) => { const f = lukDloni(lerp(14, 98, u), 3.5); return { R: f('R'), L: f('L') }; } });
  G['Front Plate Raise'] = () => stoj('Front Plate Raise', { sprzet: [{ rodzaj: 'talerz' }], rece: (u) => { const f = lukDloni(lerp(12, 104, u), 22.5); return { R: f('R'), L: f('L') }; } });
  G['Alternating Deltoid Raise'] = () => stoj('Alternating Deltoid Raise', { sprzet: [H], rece: ruchJ([10, 90], [62, 0], FRONT) });
  G['Barbell Front Raise to Overhead'] = () => stoj('Barbell Front Raise to Overhead', { sprzet: [SPRZET.sztanga()], us: U12, rece: (u) => obie(RACZ(lerp(14, 167, u), 0, { flex: 25, pl: 1 })) });
  G['Dumbbell Front Raise to Overhead'] = () => stoj('Dumbbell Front Raise to Overhead', { sprzet: [H], us: U12, rece: ruch([10, 167], [40, 0], { flex: 25, pl: 1 }) });
  G['Cable Front Raise'] = () => stoj('Cable Front Raise', { sprzet: [wyc({ chwyt: 'uchwyt', x: -55, y: 15, z: 42, trzyma: 'R' })], rece: ruchJ([10, 90], [62, 0], FRONT) });
  G['Cable Lateral Raise'] = () => stoj('Cable Lateral Raise', { sprzet: [wyc({ chwyt: 'uchwyt', x: 60, y: 30, z: -10, trzyma: 'R' })], rece: ruchJ([9, 88], [85, 85], { obrot: [0, -35], pl: -1, flex: [5, 13] }) });
  G['Cable Seated Lateral Raise'] = () => { const B = naLawce(90, 43, { zr: 22 }); return wlasna('Cable Seated Lateral Raise', { sprzet: [{ rodzaj: 'lawka', x: 0, top: 43, kat: 0, dlugosc: 30, siedzisko: 38 }, wyc({ chwyt: 'uchwyt', dwa: true, x: 0, y: 15, z: 60 })], tulow: { m: [14, 53.8], p: 0 }, nogi: { R: noga3([54, 7, 20], [1, 0.3, 0.1]), L: noga3([54, 7, -20], [1, 0.3, -0.1]) }, rece: ruch([9, 88], [85, 85], { pl: -1, flex: [5, 13] }) }); };
  /* --- wiosłowanie pionowe --- */
  const ROW0 = 79.5, ROW1 = 126;
  G['Upright Row (sztanga)'] = () => stoj('Upright Row (sztanga)', { sprzet: [SPRZET.sztanga()], rece: rzad(11, 17, ROW0, ROW1, { obrot: -70 }) });
  G['Upright Row (hantle)'] = () => stoj('Upright Row (hantle)', { sprzet: [H], rece: rzad(14, 18, ROW0, ROW1, { obrot: -70 }) });
  G['Dumbbell One-Arm Upright Row'] = () => stoj('Dumbbell One-Arm Upright Row', { sprzet: sprzJ([H], 'R'), rece: rzad(14, 18, ROW0, ROW1, { obrot: -70, jedna: true }) });
  G['Upright Row (linki)'] = () => stoj('Upright Row (linki)', { sprzet: [wyc({ chwyt: 'drazek', x: 62, y: 15 })], rece: rzad(11, 17, ROW0, ROW1, { obrot: -70 }) });
  G['Band Upright Row'] = () => stoj('Band Upright Row', { sprzet: [{ rodzaj: 'guma', mocowanie: 'stopy' }], rece: rzad(11, 17, ROW0, ROW1, { obrot: -70 }) });
  G['Smith Machine One-Arm Upright Row'] = () => stoj('Smith Machine One-Arm Upright Row', { sprzet: [{ rodzaj: 'smith', x: 17, h: 200 }, { ...SPRZET.sztanga(), trzyma: 'R' }], rece: rzad(14, 18, ROW0, ROW1, { obrot: -70, jedna: true }) });
  G['Smith Machine Upright Row'] = () => stoj('Smith Machine Upright Row', { sprzet: [{ rodzaj: 'smith', x: 17, h: 200 }, SPRZET.sztanga()], rece: rzad(11, 17, ROW0, ROW1, { obrot: -70 }) });
  /* --- halo --- */
  /* --- Car Drivers --- */
  G['Car Drivers'] = () => { const cy = Y_STOJ + 50 - 2; const rr = (u) => { const a = lerp(0, 60, u) * R; const rad = 21; const dy = rad * Math.sin(a), dz = rad * Math.cos(a) - 19; const x = Math.sqrt(62 ** 2 - dy * dy - dz * dz); const sp = (s) => ({ g: [x, cy + POL(s) * dy, POL(s) * rad * Math.cos(a)], pole: [-0.2, -0.6, POL(s)] }); return { R: sp('R'), L: sp('L') }; };
    return wlasna('Car Drivers', { sprzet: [{ rodzaj: 'talerz' }], tulow: { m: [0, Y_STOJ], p: 0 }, nogi: nogiStoj(0, 14), rece: rr }); };
  /* --- w tył (pochylony), w „Y” --- */
  const pochyl = (px = -20, py = 76, p = 68) => ({ m: [px, py], p, glowa: p * 0.45 });
  const nogiPoch = (zr = 17) => { const n = (s) => noga3([0, 7, POL(s) * zr], [1, 0.1, POL(s) * 0.05]); return { R: n('R'), L: n('L') }; };
  G['Reverse Fly (hantle)'] = () => wlasna('Reverse Fly (hantle)', { sprzet: [H], tulow: pochyl(), nogi: nogiPoch(), rece: ruch([14, 88], [90, 90], { ku: [1, 0, 0], flex: 14 }) });
  G['One-Arm Cable Rear Lateral Raise'] = () => wlasna('One-Arm Cable Rear Lateral Raise', { sprzet: [wyc({ chwyt: 'uchwyt', x: 25, y: 15, z: -35, trzyma: 'R' })], tulow: pochyl(), nogi: nogiPoch(), rece: ruchJ([14, 88], [90, 90], { ku: [1, 0, 0], flex: 14 }) });
  G['Cable Reverse Fly'] = () => stoj('Cable Reverse Fly', { sprzet: [wyc({ chwyt: 'uchwyt', dwa: true, x: 82, y: 135, z: 58 })], rece: ruch([90, 90], [10, 100], { ku: [0, -1, 0], flex: 14 }) });
  G['Y Raise (hantle)'] = () => wlasna('Y Raise (hantle)', { sprzet: [H], tulow: pochyl(-14, 80, 45), nogi: nogiPoch(15), rece: ruch([10, 116], [40, 36], { pl: 1, flex: 14 }), us: U12 });
  G['Cable Y Raise'] = () => stoj('Cable Y Raise', { sprzet: [wyc({ chwyt: 'uchwyt', dwa: true, x: 10, y: 15, z: 70 })], rece: ruch([20, 152], [30, 36], { pl: 1, flex: 14 }), us: U12 });
  /* --- maszyny: dźwignia na osi ruchu --- */
  const siedz = () => ({ m: [14, 53.8], p: 0 }); const nogiSied = () => ({ R: noga3([54, 7, 20], [1, 0.3, 0.1]), L: noga3([54, 7, -20], [1, 0.3, -0.1]) });
  G['Machine Lateral Raise'] = () => { const T = siedz(); const sp = (u) => RACZ(lerp(9, 88, u), 85, { flex: 14, pl: -1 }); const S = bark(T.m, 0, 1); const G0 = ramieFK(S, 1, sp(0)).g;
    const pv = [r1(T.m[0] - 25), r1(S[1]), r1(S[2])]; const lever = { rodzaj: 'dzwignia', tryb: 'obrot', x: pv[0], y: pv[1], z: pv[2], dlugosc: r1(Math.hypot(G0[0] - pv[0], G0[1] - pv[1], G0[2] - pv[2])), punkt: 'dlonie', trzyma: 'R' };
    return wlasna('Machine Lateral Raise', { sprzet: [{ rodzaj: 'lawka', x: 0, top: 43, kat: 80, dlugosc: 60, siedzisko: 38 }, lever], tulow: { m: T.m, p: 0 }, nogi: nogiSied(), rece: (u) => obie(sp(u)), us: U12 }); };
  G['Reverse Pec Deck'] = () => { const T = siedz(); const sp = (u) => RACZ(90, lerp(8, 100, u), { flex: 14, ku: [0, -1, 0] }); const S = bark(T.m, 0, 1); const G0 = ramieFK(S, 1, sp(0)).g;
    const pv = [r1(S[0]), r1(G0[1] - 15), r1(S[2])]; const lever = { rodzaj: 'dzwignia', tryb: 'obrot', x: pv[0], y: pv[1], z: pv[2], dlugosc: r1(Math.hypot(G0[0] - pv[0], G0[1] - pv[1], G0[2] - pv[2])), punkt: 'dlonie', trzyma: 'R' };
    return wlasna('Reverse Pec Deck', { sprzet: [{ rodzaj: 'lawka', x: 0, top: 43, kat: 80, dlugosc: 60, siedzisko: 38 }, lever], tulow: { m: T.m, p: 0 }, nogi: nogiSied(), rece: (u) => obie(sp(u)), us: U12 }); };
  /* --- leżąc na ławce skośnej: sztanga z nad ud nad głowę --- */
  G['Straight Raises on Incline Bench'] = () => { const B = naLawce(55, 43, { zr: 24 }); return wlasna('Straight Raises on Incline Bench', { sprzet: [{ rodzaj: 'lawka', x: 0, top: 43, kat: 55, dlugosc: 75 }, SPRZET.sztanga()], tulow: { m: B.m, p: B.p, glowa: B.glowa }, nogi: B.nogi,
    rece: (u) => { const l = rekaProsta(lerp(80, 185, u), 0, { flex: 14, pl: 1 }); return obie(l); }, us: U12 }); };
  G['Front Incline Dumbbell Raise'] = () => przodemLezac('Front Incline Dumbbell Raise', { sprzet: [H] });
  return G;
}
