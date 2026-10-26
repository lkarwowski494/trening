// Generator póz rodziny triceps po stronie agenta (26.10.2026): prostowanie ramion — nad głową (stojąc), leżąc na ławce (płaska, skośna, ujemna), ściąganie z wyciągu, odwodzenie w tył, maszyna.
// Ramię nad głową / nad barkiem stoi w miejscu (reguła ramie_nieruchome), rusza się przedramię: u = 0 zgięcie ≥ 70°, u = 1 wyprost ≤ 25° (lokiec_prostuje_sie). Błędów rysowanych brak (jedyny błąd katalogu to szarpanie = tempo, nie poza).
import { v2, BODY, R, r1, lerp, Y_STOJ, SPRZET, poza, nogiStoj, naLawce, buduj, bark, ramieFK, ramieU as ramie, wolna, noga3, wyc } from './gora.mjs';

export const RODZINA = 'triceps';
const U5 = [0, 0.25, 0.5, 0.75, 1];
const POL = (s) => (s === 'R' ? 1 : -1);
const SIDES = ['R', 'L'];
const LAW = (kat, o = {}) => ({ rodzaj: 'lawka', x: 0, top: o.top ?? 43, kat, dlugosc: 75, ...(o.walki ? { walki: true } : {}) });

/** Wspólny budowniczy: tulow, nogi, rece(u) → { R, L } (spec ręki), sprzet. */
function wlasna(cw, o) {
  const fr = (u) => poza({ u, tulow: o.tulow, nogi: o.nogi, rece: o.rece(u) });
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-130, 130), ...o.sprzet], fr, us: o.us ?? U5 });
}
const jedna = (o, s) => (spec) => ({ R: s === 'R' ? spec : (o.wolna ?? wolna()), L: s === 'L' ? spec : (o.wolna ?? wolna()) });
const WOLNA_LEZAC = { f1: 80, a1: 6, f2: 84, zG: 24, obrot: 0 };
const obie = (spec) => ({ R: spec, L: spec });
const sprzJedna = (sprzet, s) => sprzet.map((g) => (s && (g.rodzaj === 'hantel' || g.rodzaj === 'wyciag' || g.rodzaj === 'kettlebell') ? { ...g, trzyma: s } : g));

/** Stojąc, ramiona nad głową: ramię pionowo (f1), przedramię z zagięcia za głową (f2 start) do wyprostu. o: { sprzet, zr, jedna, a1, f2s, f2k }. */
function nadGlowa(cw, o) {
  const f1 = o.f1 ?? 168; const sp = ramie({ f1: [f1, f1], a1: o.a1 ?? 0, f2: [f1 + (o.zgiecie ?? 125), f1 + (o.wyprost ?? 8)], zr: o.zr ?? 10, obrot: o.obrot }, 0, false);
  void sp;
  return wlasna(cw, { sprzet: sprzJedna(o.sprzet, o.jedna), tulow: { m: [0, Y_STOJ], p: o.p ?? 0 }, nogi: o.nogi ?? nogiStoj(0, 14),
    rece: (u) => { const a = ramie({ f1: [f1, f1], a1: o.a1 ?? 0, f2: [f1 + (o.zgiecie ?? 125), f1 + (o.wyprost ?? 8)], zr: o.zr ?? 10, obrot: o.obrot, polDom: [-1, 0.2, 0] }, u, false); return o.jedna ? jedna(o, o.jedna)(a) : obie(a); } });
}

/** Leżąc na ławce (kat): ramię prawie pionowo, przedramię z zagięcia nad czołem do wyprostu. */
function lezac(cw, o) {
  const topL = o.top ?? ((o.kat ?? 0) < 0 ? 60 : 43); const B = naLawce(o.kat ?? 0, topL, { zr: 22 }); let nogi = B.nogi;
  if ((o.kat ?? 0) < 0) { const dx = 44; const nn = (s) => noga3([B.m[0] + dx, 66, POL(s) * 24], [0.15, 1, POL(s) * 0.1], { pod: 0, rot: 8 }); nogi = { R: nn('R'), L: nn('L') }; }
  const f1 = o.f1 ?? 190;
  return wlasna(cw, { sprzet: [LAW(o.kat ?? 0, { top: topL, walki: (o.kat ?? 0) < 0 }), ...sprzJedna(o.sprzet, o.jedna)], tulow: { m: B.m, p: B.p, glowa: B.glowa }, nogi,
    rece: (u) => { const a = ramie({ f1: [f1, f1], a1: o.a1 ?? 0, f2: [f1 + (o.zgiecie ?? 110), f1 + (o.wyprost ?? 8)], zr: o.zr ?? 10, obrot: o.obrot, polDom: [-1, 0.2, 0] }, u, false); return o.jedna ? jedna({ wolna: WOLNA_LEZAC }, o.jedna)(a) : obie(a); } });
}

/** Ściąganie z wyciągu górnego: ramiona wzdłuż tułowia, przedramię od poziomu w dół. */
function pushdown(cw, o) {
  const f1 = 3;
  return wlasna(cw, { sprzet: sprzJedna(o.sprzet, o.jedna), tulow: { m: [0, Y_STOJ], p: 6, glowa: 3 }, nogi: nogiStoj(0, 14),
    rece: (u) => { const a = ramie({ f1: [f1, f1], a1: 3, f2: [f1 + (o.zgiecie ?? 98), f1 + 5], zr: o.zr ?? 12, obrot: o.obrot }, u, false); return o.jedna ? jedna(o, o.jedna)(a) : obie(a); } });
}

/** Odwodzenie w tył (kickback): tułów pochylony, ramię równolegle do tułowia, przedramię z zawisu do wyprostu w tył. */
function kickback(cw, o) {
  const p = 68; const m = [-20, 76]; const n = (s) => noga3([0, 7, POL(s) * 17], [1, 0.1, POL(s) * 0.05]);
  const f1 = -p;
  return wlasna(cw, { sprzet: sprzJedna(o.sprzet, o.jedna), tulow: { m, p, glowa: p * 0.45 }, nogi: { R: n('R'), L: n('L') },
    rece: (u) => { const a = ramie({ f1: [f1, f1], a1: 7, f2: [f1 + 92, f1 + 6], zr: 28 }, u, false); return o.jedna ? jedna(o, o.jedna)(a) : obie(a); } });
}

export const WYJATKI = {
  'Kneeling Cable Triceps Extension': 'klęk na ławce: goleń leży poziomo, a stopa ma palce skierowane do tyłu — model stopy w kontrakcie nie ma palców skierowanych do tyłu (kąt kostki 80° przy zakresie −60…37°); klęk na podłodze nie spełnia wymagania „ławka płaska”',
  'Body-Up': 'OTWARTE — brak źródła ruchu (brak wskazówek, zestaw „open”; data/zrodla/figury-sens.json → triceps.otwarte); ćwiczenie wstrzymane do czasu źródła',
  'Bodyweight Triceps Extension': 'OTWARTE — brak źródła ruchu (zestaw „open”; figury-sens.json → triceps.otwarte); ćwiczenie wstrzymane do czasu źródła',
  'Sled Overhead Triceps Extension': 'OTWARTE — brak źródła ruchu (zestaw „open”; figury-sens.json → triceps.otwarte) i sanie (sprzęt) — wstrzymane do czasu źródła',
};
export const PRZYBLIZENIA = {};

export function generuj() {
  const G = {};
  /* --- stojąc, nad głową --- */
  G['Overhead Triceps Extension (EZ)'] = () => nadGlowa('Overhead Triceps Extension (EZ)', { sprzet: [SPRZET.gryfLamany()], zr: 10 });
  G['Standing Overhead Barbell Triceps Extension'] = () => nadGlowa('Standing Overhead Barbell Triceps Extension', { sprzet: [SPRZET.sztanga()], zr: 11 });
  G['Overhead Triceps Extension (hantel)'] = () => nadGlowa('Overhead Triceps Extension (hantel)', { sprzet: [{ rodzaj: 'hantel', pionowo: true }], zr: 4, a1: -6, obrot: 0 });
  G['Kettlebell Overhead Triceps Extension'] = () => nadGlowa('Kettlebell Overhead Triceps Extension', { sprzet: [{ rodzaj: 'kettlebell', dzwon: 'tyl' }], zr: 4, a1: -6 });
  G['Dumbbell One-Arm Triceps Extension'] = () => nadGlowa('Dumbbell One-Arm Triceps Extension', { sprzet: [SPRZET.hantle()], zr: 12, jedna: 'R', obrot: 0 });
  G['Band Overhead Triceps Extension'] = () => nadGlowa('Band Overhead Triceps Extension', { sprzet: [{ rodzaj: 'guma', mocowanie: 'stopy' }], zr: 12 });
  G['Cable Overhead Extension'] = () => nadGlowa('Cable Overhead Extension', { sprzet: [wyc({ chwyt: 'lina', x: -75, y: 155 })], zr: 8 });
  G['Standing Low-Pulley One-Arm Triceps Extension'] = () => nadGlowa('Standing Low-Pulley One-Arm Triceps Extension', { sprzet: [wyc({ chwyt: 'uchwyt', x: -75, y: 20, trzyma: 'R' })], zr: 12, jedna: 'R' });
  /* --- leżąc na ławce płaskiej --- */
  G['Skullcrusher (sztanga)'] = () => lezac('Skullcrusher (sztanga)', { kat: 0, sprzet: [SPRZET.sztanga()], zr: 10 });
  G['Skullcrusher (EZ)'] = () => lezac('Skullcrusher (EZ)', { kat: 0, sprzet: [SPRZET.gryfLamany()], zr: 10 });
  G['Skullcrusher (hantle)'] = () => lezac('Skullcrusher (hantle)', { kat: 0, sprzet: [SPRZET.hantle()], zr: 17.5, obrot: 0 });
  G['One-Arm Lying Dumbbell Triceps Extension'] = () => lezac('One-Arm Lying Dumbbell Triceps Extension', { kat: 0, sprzet: [SPRZET.hantle()], zr: 17.5, jedna: 'R', obrot: 0 });
  G['Band Skull Crusher'] = () => lezac('Band Skull Crusher', { kat: 0, sprzet: [{ rodzaj: 'guma', mocowanie: 'zaczep', x: -110, y: 25, z: 0 }], zr: 12 });
  G['Chain Handle Extension'] = () => lezac('Chain Handle Extension', { kat: 0, sprzet: [{ rodzaj: 'lancuchy' }], zr: 12 });
  G['Cable Lying Triceps Extension'] = () => lezac('Cable Lying Triceps Extension', { kat: 0, sprzet: [wyc({ chwyt: 'drazek', x: -115, y: 58 })], zr: 10 });
  /* --- skośna i ujemna --- */
  G['Incline Barbell Triceps Extension'] = () => lezac('Incline Barbell Triceps Extension', { kat: 55, f1: 172, zgiecie: 75, sprzet: [SPRZET.sztanga()], zr: 10 });
  G['Cable Incline Triceps Extension'] = () => lezac('Cable Incline Triceps Extension', { kat: 55, f1: 172, zgiecie: 75, sprzet: [wyc({ chwyt: 'lina', x: -120, y: 200 })], zr: 8 });
  G['Decline Dumbbell Triceps Extension'] = () => lezac('Decline Dumbbell Triceps Extension', { kat: -20, sprzet: [SPRZET.hantle()], zr: 17.5, obrot: 0 });
  G['Decline EZ Bar Triceps Extension'] = () => lezac('Decline EZ Bar Triceps Extension', { kat: -20, sprzet: [SPRZET.gryfLamany()], zr: 10 });
  /* --- leżąc: łokcie na boki (Tate), sztanga za głową --- */
  const lerp3 = (a, b, t) => a.map((x, i) => lerp(x, b[i], t));
  G['Tate Press'] = () => { const B = naLawce(0, 43, { zr: 22 }); const d1 = [0.05, 1, 0.32]; return wlasna('Tate Press', { sprzet: [LAW(0), SPRZET.hantle()], tulow: { m: B.m, p: B.p, glowa: B.glowa }, nogi: B.nogi,
    rece: (u) => obie({ d1, d2: lerp3([0.12, -0.4, -0.85], d1, u), obrot: 0 }) }); };
  G['Lying Close-Grip Barbell Triceps Extension Behind The Head'] = () => lezac('Lying Close-Grip Barbell Triceps Extension Behind The Head', { kat: 0, f1: 200, zgiecie: 100, sprzet: [SPRZET.sztanga()], zr: 9 });
  /* --- siedząc w maszynie: łokcie przy bokach, dźwignia na osi łokcia --- */
  G['Machine Triceps Extension'] = () => { const B = naLawce(80, 43, { zr: 24 }); const spec = (u) => ({ f1: [4, 4], a1: 5, f2: [104, 12], zr: 22 });
    const sp = (u) => ramie(spec(), u, false); const S = bark(B.m, B.p, 1); const fk0 = ramieFK(S, 1, sp(0)); const G0 = fk0.g; const pz = fk0.E[2] + 16;
    const lever = { rodzaj: 'dzwignia', tryb: 'obrot', x: r1(fk0.E[0]), y: r1(fk0.E[1]), z: r1(pz), dlugosc: r1(Math.hypot(G0[0] - fk0.E[0], G0[1] - fk0.E[1], G0[2] - pz)), punkt: 'dlonie', trzyma: 'R' };
    return wlasna('Machine Triceps Extension', { sprzet: [LAW(80), lever], tulow: { m: B.m, p: B.p, glowa: B.glowa }, nogi: B.nogi, rece: (u) => obie(sp(u)) }); };
  /* --- ściąganie z wyciągu --- */
  const hg = { x: 42, y: 200 };
  G['Triceps Pushdown'] = () => pushdown('Triceps Pushdown', { sprzet: [wyc({ chwyt: 'lina', ...hg })], zr: 9, obrot: 0 });
  G['Reverse Grip Triceps Pushdown'] = () => pushdown('Reverse Grip Triceps Pushdown', { sprzet: [wyc({ chwyt: 'drazek', ...hg })], zr: 12, obrot: 75 });
  G['Single Arm Triceps Pushdown'] = () => pushdown('Single Arm Triceps Pushdown', { sprzet: [wyc({ chwyt: 'uchwyt', ...hg, trzyma: 'R' })], zr: 14, jedna: 'R', obrot: 0 });
  /* --- odwodzenie w tył --- */
  G['Triceps Kickback'] = () => kickback('Triceps Kickback', { sprzet: [SPRZET.hantle()], jedna: 'R' });
  G['Two-Arm Dumbbell Kickback'] = () => kickback('Two-Arm Dumbbell Kickback', { sprzet: [SPRZET.hantle()] });
  G['Triceps Kickback (linki)'] = () => kickback('Triceps Kickback (linki)', { sprzet: [wyc({ chwyt: 'uchwyt', x: 80, y: 40, z: 30, trzyma: 'R' })], jedna: 'R' });
  return G;
}
