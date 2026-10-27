// Generator póz rodziny chest_fly po stronie agenta (26.10.2026): rozpiętki (hantle leżąc na ławce płaskiej, skośnej i ujemnej, wyciągi, guma, maszyna) i pullover (hantel, sztanga).
// Rozpiętka: ramiona prawie proste w płaszczyźnie czołowej, kąt alfa = od ramion na boki (0°) do rąk nad klatką/przed klatką (ok. 100°); dłonie zbliżają się o ≥ 40 cm (luk_dloni), łokcie stałe zgięte.
// Pullover: ramiona proste, wahadło w płaszczyźnie strzałkowej od za głową (kąt względem tułowia ≤ 171°) do nad klatką.
import { v2, BODY, R, r1, lerp, Y_STOJ, SPRZET, poza, nogiStoj, noga3, bark, ramieFK, naLawce, buduj, rekaProsta, wyc, U9, U12, wolna } from './gora.mjs';

export const RODZINA = 'chest_fly';
const POL = (s) => (s === 'R' ? 1 : -1);
const WOLNA_LEZAC = { d1: [0, 0.0, 1], d2: [0, 0.1, 1], obrot: 0 }; /* wolna ręka odwiedziona w bok dla równowagi (luk_dloni mierzy odległość dłoni) */
const WOLNA_STOJ = { f1: 3, a1: 10, f2: 8, zG: 30, obrot: 0 };

/** Ramię w płaszczyźnie czołowej (R): kierunek (0, sin a, cos a) — a = 0 w bok, a = 90 w górę; przedramię obrócone o flex w stronę zamykania (hantle bliżej siebie niż łokcie). */
function rekaCzolowa(alfa, flex = 14, o = {}) {
  const k = (a) => [0, Math.sin(a * R), Math.cos(a * R)]; const d1 = k(alfa); const d2 = k(alfa + flex);
  const t = [d2[0] - Math.cos(flex * R) * d1[0], d2[1] - Math.cos(flex * R) * d1[1], d2[2] - Math.cos(flex * R) * d1[2]]; const tl = Math.hypot(...t) || 1;
  return { d1, d2, poleR: [-t[0] / tl, -t[1] / tl, -t[2] / tl], ...(o.obrot !== undefined ? { obrot: o.obrot } : {}) };
}
/** Rozpiętka w płaszczyźnie poziomej (stojąc): ramię (cos phi, 0, sin phi) — phi = 90 w bok, phi = 0 do przodu; przedramię lekko zgięte ku dołowi. */
function rekaPozioma(phi, flex = 14) {
  const k = (p) => [Math.cos(p * R), 0, Math.sin(p * R)]; const d1 = k(phi); const d2 = k(phi - flex); const t = [d2[0] - Math.cos(flex * R) * d1[0], d2[1], d2[2] - Math.cos(flex * R) * d1[2]]; const tl = Math.hypot(...t) || 1;
  return { d1, d2, poleR: [-t[0] / tl, -t[1] / tl, -t[2] / tl] };
}

function wlasna(cw, o) {
  const fr = (u) => poza({ u, tulow: o.tulow, nogi: o.nogi, rece: o.rece(u) });
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-130, 130), ...o.sprzet], fr, us: o.us ?? U9 });
}
const LAW = (kat, top = 43, walki = false) => ({ rodzaj: 'lawka', x: 0, top, kat, dlugosc: 75, ...(walki ? { walki: true } : {}) });
/** Leżąc (kat: 0 płaska, 55 skośna, −20 ujemna): rozpiętka — hantle / wyciągi; jedna: 'R' = jedna ręka pracuje. */
function lezac(cw, o) {
  const kat = o.kat ?? 0; const top = kat < 0 ? 60 : 43; const B = naLawce(kat, top, { zr: 22 }); let nogi = B.nogi;
  if (kat < 0) { const nn = (s) => noga3([B.m[0] + 44, 66, POL(s) * 24], [0.15, 1, POL(s) * 0.1], { pod: 0, rot: 8 }); nogi = { R: nn('R'), L: nn('L') }; }
  const sprz = o.sprzet.map((g) => (o.jedna && ['hantel', 'wyciag'].includes(g.rodzaj) && !g.dwa ? { ...g, trzyma: o.jedna } : g));
  return wlasna(cw, { sprzet: [LAW(kat, top, kat < 0), ...sprz], tulow: { m: B.m, p: B.p, glowa: B.glowa }, nogi,
    rece: (u) => { const a = rekaCzolowa(lerp(o.a[0], o.a[1], u), 14, { obrot: o.obrot }); return o.jedna ? { R: a, L: WOLNA_LEZAC } : { R: a, L: a }; }, us: o.us });
}
/** Stojąc: rozpiętka na wyciągach / z gumą — rece(u) → { R, L }. */
function stoj(cw, o) { return wlasna(cw, { sprzet: o.sprzet, tulow: o.tulow ?? { m: [0, Y_STOJ], p: o.p ?? 0 }, nogi: o.nogi ?? nogiStoj(0, 14), rece: o.rece, us: o.us }); }

export const WYJATKI = {
  'Around The Worlds': 'OTWARTE — brak źródła ruchu (brak wskazówek, zestaw „open”; figury-sens.json → chest_fly.otwarte); wstrzymane do czasu źródła',
  'Machine Pullover': 'OTWARTE — brak źródła ruchu (zestaw „open”; figury-sens.json → chest_fly.otwarte); wstrzymane do czasu źródła',
  'Svend Press': 'OTWARTE — brak źródła ruchu (zestaw „open”; figury-sens.json → chest_fly.otwarte); wstrzymane do czasu źródła',
};
export const PRZYBLIZENIA = {};

export function generuj() {
  const G = {};
  const H = SPRZET.hantle(); const A = [0, 92]; /* koniec ruchu: ramię pionowo (92°), dłonie ok. ±9 cm od osi — nie w jednym punkcie (recenzja ruchu 27.10.2026: przy 100° chwyty R i L leżały 0,4 cm od siebie) */
  /* --- hantle leżąc --- */
  G['Chest Fly (hantle)'] = () => lezac('Chest Fly (hantle)', { a: A, sprzet: [H], obrot: 0 });
  G['Incline Chest Fly (hantle)'] = () => lezac('Incline Chest Fly (hantle)', { kat: 55, a: A, sprzet: [H], obrot: 0 });
  G['Decline Dumbbell Fly'] = () => lezac('Decline Dumbbell Fly', { kat: -20, a: A, sprzet: [H], obrot: 0 });
  G['One-Arm Flat Bench Dumbbell Fly'] = () => lezac('One-Arm Flat Bench Dumbbell Fly', { a: [0, 100], sprzet: [H], jedna: 'R', obrot: 0 });
  /* --- wyciągi leżąc --- */
  G['Flat Bench Cable Fly'] = () => lezac('Flat Bench Cable Fly', { a: A, sprzet: [wyc({ chwyt: 'uchwyt', dwa: true, x: -50, y: 15, z: 105 })] });
  G['Incline Cable Fly'] = () => lezac('Incline Cable Fly', { kat: 55, a: A, sprzet: [wyc({ chwyt: 'uchwyt', dwa: true, x: -35, y: 15, z: 130 })] });
  /* --- stojąc: wyciągi, guma --- */
  const horiz = (p0, p1, y) => (u) => { const a = rekaPozioma(lerp(p0, p1, u), 14); return { R: a, L: a }; };
  G['Cable Fly'] = () => stoj('Cable Fly', { sprzet: [wyc({ chwyt: 'uchwyt', dwa: true, x: -15, y: 160, z: 105 })], rece: horiz(98, 6), p: 0 });
  G['Cable Fly (high to low)'] = () => stoj('Cable Fly (high to low)', { sprzet: [wyc({ chwyt: 'uchwyt', dwa: true, x: -15, y: 185, z: 105 })], rece: (u) => { const a = rekaPozioma(lerp(98, 8, u), 14); return { R: { ...a, d1: [a.d1[0], lerp(0.1, -0.55, u), a.d1[2]], d2: [a.d2[0], lerp(0.0, -0.6, u), a.d2[2]] }, L: { ...a, d1: [a.d1[0], lerp(0.1, -0.55, u), a.d1[2]], d2: [a.d2[0], lerp(0.0, -0.6, u), a.d2[2]] } }; } });
  G['Cable Fly (low to high)'] = () => stoj('Cable Fly (low to high)', { sprzet: [wyc({ chwyt: 'uchwyt', dwa: true, x: -15, y: 15, z: 105 })], rece: (u) => { const a = rekaPozioma(lerp(98, 8, u), 14); const dy = lerp(-0.3, 0.55, u); return { R: { ...a, d1: [a.d1[0], dy, a.d1[2]], d2: [a.d2[0], dy, a.d2[2]] }, L: { ...a, d1: [a.d1[0], dy, a.d1[2]], d2: [a.d2[0], dy, a.d2[2]] } }; } });
  G['Single Arm Cable Fly'] = () => stoj('Single Arm Cable Fly', { sprzet: [wyc({ chwyt: 'uchwyt', x: -15, y: 140, z: 105, trzyma: 'R' })], rece: (u) => ({ R: rekaPozioma(lerp(104, -14, u), 14), L: WOLNA_STOJ }) });
  G['Band Chest Fly'] = () => stoj('Band Chest Fly', { sprzet: [{ rodzaj: 'guma', mocowanie: 'zaczep', x: -60, y: 138, z: 0 }], rece: horiz(98, 6) });
  /* --- maszyna: butterfly --- */
  G['Pec Deck'] = () => { const m = [14, 53.8]; const sp = (u) => rekaPozioma(lerp(98, 6, u), 14); const S = bark(m, 0, 1); const G0 = ramieFK(S, 1, { ...sp(0), obrot: 0 }).g; const pv = [r1(S[0]), r1(G0[1] - 15), r1(S[2])];
    const lever = { rodzaj: 'dzwignia', tryb: 'obrot', x: pv[0], y: pv[1], z: pv[2], dlugosc: r1(Math.hypot(G0[0] - pv[0], G0[1] - pv[1], G0[2] - pv[2])), punkt: 'dlonie', trzyma: 'R' };
    return wlasna('Pec Deck', { sprzet: [{ rodzaj: 'lawka', x: 0, top: 43, kat: 80, dlugosc: 60, siedzisko: 38 }, lever], tulow: { m, p: 0 }, nogi: { R: noga3([54, 7, 20], [1, 0.3, 0.1]), L: noga3([54, 7, -20], [1, 0.3, -0.1]) }, rece: (u) => { const a = sp(u); return { R: a, L: a }; }, us: U12 }); };
  /* --- Crucifix (utrzymanie): ramiona w bok --- */
  G['Crucifix'] = () => stoj('Crucifix', { sprzet: [H], rece: () => { const a = rekaCzolowa(0, 10, { obrot: 0 }); return { R: a, L: a }; }, us: [0, 1] });
  /* --- pullover --- */
  const pull = (cw, o) => { const kat = o.kat ?? 0; const top = kat < 0 ? 60 : 43; const B = naLawce(kat, top, { zr: 22 }); let nogi = B.nogi;
    if (kat < 0) { const nn = (s) => noga3([B.m[0] + 44, 66, POL(s) * 24], [0.15, 1, POL(s) * 0.1], { pod: 0, rot: 8 }); nogi = { R: nn('R'), L: nn('L') }; }
    return wlasna(cw, { sprzet: [LAW(kat, top, kat < 0), ...o.sprzet], tulow: { m: B.m, p: B.p, glowa: B.glowa }, nogi, us: U12,
      rece: (u) => { const f = lerp(o.f[0], o.f[1], u); const t = f * R; const lat = o.lat ?? 0; const d1 = [Math.sin(t), -Math.cos(t), -(o.lat1 ?? lat)]; const fl = (o.flex ?? 8) * R; const d2 = [Math.sin(t + fl), -Math.cos(t + fl), -(o.lat2 ?? lat * 0.4)];
        const tt = [d2[0] - Math.cos(fl) * d1[0], d2[1] - Math.cos(fl) * d1[1], d2[2] - Math.cos(fl) * d1[2]]; const tl = Math.hypot(...tt) || 1; const a = { d1, d2, poleR: [-tt[0] / tl, -tt[1] / tl, -tt[2] / tl], obrot: 0 }; return { R: a, L: a }; } }); };
  G['Pullover (hantel)'] = () => pull('Pullover (hantel)', { f: [255, 150], sprzet: [{ rodzaj: 'hantel', pionowo: true }], lat: 0.34, lat1: 0.14, lat2: 0.3, flex: 8 });
  G['Front Raise And Pullover'] = () => pull('Front Raise And Pullover', { f: [255, 118], sprzet: [SPRZET.sztanga()], lat: 0, flex: 8 });
  G['Wide-Grip Decline Barbell Pullover'] = () => pull('Wide-Grip Decline Barbell Pullover', { kat: -20, f: [250, 150], sprzet: [SPRZET.sztanga()], lat: 0, flex: 8 });
  G['Bent-Arm Barbell Pullover'] = () => pull('Bent-Arm Barbell Pullover', { f: [255, 160], sprzet: [SPRZET.sztanga()], lat: 0, flex: 50 });
  return G;
}
