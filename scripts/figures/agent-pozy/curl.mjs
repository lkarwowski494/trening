// Generator póz rodziny curl po stronie agenta (26.10.2026): uginanie ramion — sztanga, gryf łamany, hantle, linka, modlitewnik, ławka skośna, maszyna.
// Każde ćwiczenie to parametry (chwyt = obrót przedramienia i rozstaw dłoni, tor łokcia = kąty ramienia, sprzęt, postawa), nie osobny kod; błąd curl.mis.elbows = łokcie wysuwane do przodu.
import { v2, BODY, R, r1, lerp, gladko, Y_STOJ, SPRZET, poza, nogiStoj, nogiSiedz, nogiLezac, naLawce, naSiedzisku, modlitewnik, kier3, buduj, bark, ramieFK, ramieU as ramie, wolna, noga3, wyc } from './gora.mjs';

export const RODZINA = 'curl';
const U5 = [0, 0.25, 0.5, 0.75, 1];
const POL = (s) => (s === 'R' ? 1 : -1);
const SIDES = ['R', 'L'];

/** Postać stojąca z uginaniem. o: parametry ramienia (patrz ramie) + sprzet, jedna ('R'/'L'), blad, nogi, tulow. */
function stoj(cw, o) {
  const m = o.m ?? [0, Y_STOJ]; const p = o.p ?? 0; const nogi = o.nogi ?? nogiStoj(0, o.zrStop ?? 14);
  const fr = (u, zle) => {
    const rece = {}; for (const s of SIDES) rece[s] = o.jedna && o.jedna !== s ? (o.wolna ?? wolna()) : ramie(o.sideo?.[s] ?? o, u, zle);
    return poza({ u, tulow: { m, p, glowa: o.glowa ?? p * 0.5 }, nogi, rece });
  };
  const sprz = o.sprzet.map((g) => (o.jedna && g.rodzaj === 'hantel' ? { ...g, trzyma: o.jedna } : g));
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-70, 120), ...sprz], fr, us: o.us ?? U5, blad: o.blad ? { cue: 'curl.mis.elbows' } : undefined });
}

/** Ławka skośna / płaska: ręce z parametrów jak w stoj; ławka = wpis lawka (kat), tułów i nogi z naLawce. */
function lawka(cw, o) {
  const B = naLawce(o.kat, o.top ?? 43, { zr: o.zrStop ?? 24 });
  const fr = (u, zle) => {
    const rece = {}; for (const s of SIDES) rece[s] = o.jedna && o.jedna !== s ? (o.wolna ?? { f1: o.f1[0], a1: 8, f2: o.f1[0] + 4, zG: 24, obrot: 0 }) : ramie(o, u, zle);
    return poza({ u, tulow: { m: B.m, p: B.p, glowa: B.glowa }, nogi: B.nogi, rece });
  };
  const sprz = o.sprzet.map((g) => (o.jedna && g.rodzaj === 'hantel' ? { ...g, trzyma: o.jedna } : g));
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-130, 120), { rodzaj: 'lawka', x: 0, top: o.top ?? 43, kat: o.kat, dlugosc: 75 }, ...sprz], fr, us: o.us ?? U5, blad: o.blad ? { cue: 'curl.mis.elbows' } : undefined });
}
/** Modlitewnik: ramiona na podpórce (łokcie na jej powierzchni), przedramię zgina się od wyprostu do ok. 130°. */
function modl(cw, o) {
  const M = modlitewnik();
  const f1 = M.f1;
  const oo = { ...o, f1: [f1, o.dzwignia ? f1 : f1 + 2], f2: [f1 + 12, f1 + (o.gora ?? 128)], a1: 3 };
  if (o.dzwignia) { /* maszyna: dźwignia obrotowa o osi na wysokości łokcia (przesuniętej na bok), punkt mocowania = chwyt; długość = odległość osi od chwytu (stała w ruchu) */
    const S = bark(M.m, M.p, 1); const f = ramieFK(S, 1, ramie(oo, 0, false)); const pz = f.E[2] + 16; const g0 = ramie(oo, 0, false); const G = ramieFK(S, 1, g0).g;
    o.sprzet = [...o.sprzet, { rodzaj: 'dzwignia', tryb: 'obrot', x: r1(f.E[0]), y: r1(f.E[1]), z: r1(pz), dlugosc: r1(Math.hypot(G[0] - f.E[0], G[1] - f.E[1], G[2] - pz)), punkt: 'dlonie', trzyma: 'R' }]; }
  const fr = (u, zle) => {
    const rece = {}; for (const s of SIDES) rece[s] = o.jedna && o.jedna !== s ? { f1: -10, a1: 8, f2: -6, zG: 24, obrot: 0 } : ramie(oo, u, zle);
    return poza({ u, tulow: { m: M.m, p: M.p, glowa: M.p }, nogi: M.nogi, rece });
  };
  const sprz = o.sprzet.map((g) => (o.jedna && g.rodzaj === 'hantel' ? { ...g, trzyma: o.jedna } : g));
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-80, 130), M.sprzet, ...sprz], fr, us: o.us ?? U5, blad: o.blad ? { cue: 'curl.mis.elbows' } : undefined });
}

/** Leżenie na plecach na ławce płaskiej: ramiona wzdłuż tułowia po bokach ławki (łokcie przy bokach), przedramię zgina się z poziomu ku górze. */
function leza(cw, o) {
  const B = naLawce(0, 43, { zr: 22 });
  const fr = (u, zle) => poza({ u, tulow: { m: B.m, p: B.p, glowa: B.glowa }, nogi: B.nogi, rece: { R: ramie(o, u, zle), L: ramie(o, u, zle) } });
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-130, 120), { rodzaj: 'lawka', x: 0, top: 43, kat: 0, dlugosc: 75 }, ...o.sprzet], fr, us: o.us ?? U5, blad: o.blad ? { cue: 'curl.mis.elbows' } : undefined });
}

/** Postać z własnym tułowiem i nogami (siedzenie, pochylenie, klęk): ręce z funkcji rece(u, zle) → { R, L }. */
function wlasna(cw, o) {
  const fr = (u, zle) => poza({ u, tulow: o.tulow, nogi: o.nogi, rece: o.rece(u, zle) });
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-130, 130), ...o.sprzet], fr, us: o.us ?? U5, blad: o.blad ? { cue: 'curl.mis.elbows' } : undefined });
}


export const WYJATKI = {
  'Spider Curl': 'leżenie przodem na pochyłej ławce (klatka na oparciu, ręce zwisają) wymaga obrotu tułowia o 180° i nóg poza siedziskiem: uda w linii tułowia przechodzą przez siedzisko, a ułożenie nóg poza nim wychodzi poza zakres biodra kontraktu (−17°) — nie da się narysować bez zmiany kontraktu',
  'Spider Curl (sztanga)': 'jak Spider Curl: leżenie przodem na pochyłej ławce / modlitewniku, nogi poza siedziskiem; kontrakt nie obsługuje takiej pozy',
};
export const PRZYBLIZENIA = {};

export function generuj() {
  const G = {};
  const STD = { f1: [2, 5], f2: [20, 140], zle: [10, 36] };
  /* --- stojące: sztanga, gryf łamany --- */
  G['Barbell Curl'] = () => stoj('Barbell Curl', { ...STD, sprzet: [SPRZET.sztanga()], zr: 19, blad: true });
  G['EZ Bar Curl'] = () => stoj('EZ Bar Curl', { ...STD, sprzet: [SPRZET.gryfLamany()], zr: 15, obrot: [25, 25], blad: true });
  G['Reverse Curl'] = () => stoj('Reverse Curl', { ...STD, f2: [20, 128], sprzet: [SPRZET.sztanga()], zr: 19, obrot: [-70, -70], blad: true });
  G['Drag Curl'] = () => stoj('Drag Curl', { f1: [0, -22], f2: [20, 118], sprzet: [SPRZET.sztanga()], zr: 19 });
  /* --- stojące: hantle --- */
  G['Biceps Curl (hantle)'] = () => stoj('Biceps Curl (hantle)', { ...STD, sprzet: [SPRZET.hantle()], zr: 25, obrot: [0, 70], blad: true });
  G['Hammer Curl'] = () => stoj('Hammer Curl', { ...STD, sprzet: [SPRZET.hantle()], zr: 25, obrot: [0, 0], blad: true });
  G['Standing Dumbbell Reverse Curl'] = () => stoj('Standing Dumbbell Reverse Curl', { ...STD, f2: [20, 128], sprzet: [SPRZET.hantle()], zr: 25, obrot: [-70, -70], blad: true });
  G['Zottman Curl'] = () => stoj('Zottman Curl', { ...STD, sprzet: [SPRZET.hantle()], zr: 25, obrot: [60, 60, 60, 60, -60], blad: true });
  G['Standing Inner-Biceps Curl'] = () => stoj('Standing Inner-Biceps Curl', { ...STD, a1: 22, sprzet: [SPRZET.hantle()], zr: 31, obrot: [20, 75], blad: true });
  G['Cross Body Hammer Curl'] = () => stoj('Cross Body Hammer Curl', { ...STD, sprzet: [SPRZET.hantle()], jedna: 'R', zr: [25, 3], obrot: [0, 0], blad: true });
  /* --- wyciąg --- */
  G['Cable Curl'] = () => stoj('Cable Curl', { ...STD, sprzet: [wyc({ chwyt: 'drazek' })], zr: 19, obrot: [70, 70] });
  G['Reverse Cable Curl'] = () => stoj('Reverse Cable Curl', { ...STD, f2: [20, 128], sprzet: [wyc({ chwyt: 'drazek' })], zr: 19, obrot: [-70, -70], blad: true });
  G['Hammer Curl (linki)'] = () => stoj('Hammer Curl (linki)', { ...STD, f2: [14, 140], sprzet: [wyc({ chwyt: 'lina' })], zr: 12, obrot: [0, 0], blad: true });
  G['Standing One-Arm Cable Curl'] = () => stoj('Standing One-Arm Cable Curl', { ...STD, sprzet: [wyc({ chwyt: 'uchwyt', trzyma: 'R' })], jedna: 'R', zr: 24, obrot: [70, 70], blad: true });
  G['Cable Curl (dwie linki)'] = () => stoj('Cable Curl (dwie linki)', { ...STD, sprzet: [wyc({ chwyt: 'uchwyt', dwa: true, y: 15 })], zr: 25, obrot: [70, 70], blad: true });
  /* --- ławka skośna: ręce zwisają poza linią tułowia --- */
  const SK = { f1: [-4, 2], f2: [-2, 132], zr: 29, zle: [8, 30] };
  G['Incline Curl (hantle)'] = () => lawka('Incline Curl (hantle)', { ...SK, kat: 55, sprzet: [SPRZET.hantle()], obrot: [0, 70], blad: true });
  G['Incline Hammer Curl'] = () => lawka('Incline Hammer Curl', { ...SK, kat: 55, sprzet: [SPRZET.hantle()], obrot: [0, 0], blad: true });
  /* --- leżenie na ławce płaskiej --- */
  G['Lying Supine Dumbbell Curl'] = () => leza('Lying Supine Dumbbell Curl', { f1: [72, 72], f2: [82, 200], zr: 27, sprzet: [SPRZET.hantle()], obrot: [0, 70] });
  /* --- wyciąg: ramiona w bok (dwa górne wyciągi), ramię za tułowiem (Bayesian) --- */
  G['High Cable Curl'] = () => wlasna('High Cable Curl', { sprzet: [wyc({ chwyt: 'uchwyt', dwa: true, y: 200, z: 100 })], tulow: { m: [0, Y_STOJ], p: 0 }, nogi: nogiStoj(0, 14),
    rece: (u) => { const al = lerp(18, 128, u) * R; const sp = (s) => ({ d1: [0, 0.18, 1], d2: [0, Math.sin(al), Math.cos(al)], obrot: lerp(60, 80, u) }); return { R: sp('R'), L: sp('L') }; } });
  G['Bayesian Curl'] = () => wlasna('Bayesian Curl', { sprzet: [wyc({ chwyt: 'uchwyt', x: -70, trzyma: 'R' })], tulow: { m: [0, Y_STOJ], p: 0 }, nogi: nogiStoj(0, 14),
    rece: (u) => ({ R: { f1: -35, a1: 6, f2: lerp(-30, 92, u), zG: 22, obrot: lerp(70, 70, u) }, L: wolna() }) });
  /* --- siedząc / pochylony: łokieć o wewnętrzną stronę uda --- */
  const NAK = 40; /* pochylenie tułowia w koncentracyjnych (łokieć wsparty o udo) */
  const sed = (px = 22) => { const y = 43 + 9.5 + 0.3; const m = [px, y]; const kolano = (s) => [px + 38, 7, POL(s) * 26]; return { m, nogi: { R: noga3(kolano('R'), [0.8, 0.3, 0.7]), L: noga3(kolano('L'), [0.8, 0.3, -0.7]) } }; };
  G['Concentration Curl (hantle)'] = () => { const T = sed(); return wlasna('Concentration Curl (hantle)', { sprzet: [{ rodzaj: 'lawka', x: 0, top: 43, kat: 0, dlugosc: 75, siedzisko: 38 }, SPRZET.hantle({ trzyma: 'R' })], tulow: { m: T.m, p: NAK, glowa: NAK * 0.7 }, nogi: T.nogi,
    rece: (u) => ({ R: { f1: 0, a1: -16, f2: lerp(3, 128, u), zG: 11, obrot: lerp(0, 70, u) }, L: { g: [T.m[0] + 24, 70, -26] } }) }); };
  G['Seated Close-Grip Concentration Barbell Curl'] = () => { const T = sed(); return wlasna('Seated Close-Grip Concentration Barbell Curl', { sprzet: [{ rodzaj: 'lawka', x: 0, top: 43, kat: 0, dlugosc: 75, siedzisko: 38 }, SPRZET.gryfLamany()], tulow: { m: T.m, p: NAK, glowa: NAK * 0.7 }, nogi: T.nogi,
    rece: (u) => { const a = (s) => ({ f1: 14, a1: -14, f2: lerp(34, 145, u), zG: 9, obrot: 60 }); return { R: a('R'), L: a('L') }; } }); };
  G['Standing Concentration Curl'] = () => { const m = [-22, 72]; const k = (s) => [0, 7, POL(s) * 26]; return wlasna('Standing Concentration Curl', { sprzet: [SPRZET.hantle({ trzyma: 'R' })], tulow: { m, p: 45, glowa: 38 }, nogi: { R: noga3(k('R'), [1, 0.1, 0.9]), L: noga3(k('L'), [1, 0.1, -0.9]) },
    rece: (u) => ({ R: { f1: 0, a1: -16, f2: lerp(2, 120, u), zG: 11, obrot: lerp(0, 70, u) }, L: { g: [-3, 70, -21] } }) }); };
  /* --- leżenie na ławce płaskiej głową do wysokiego wyciągu: ramiona ku bloczkowi, przedramiona zginają się nad klatkę --- */
  G['Lying Close-Grip Bar Curl On High Pulley'] = () => { const B = naLawce(0, 43, { zr: 22 }); return wlasna('Lying Close-Grip Bar Curl On High Pulley', { sprzet: [{ rodzaj: 'lawka', x: 0, top: 43, kat: 0, dlugosc: 75 }, wyc({ chwyt: 'drazek', x: -125, y: 200 })], tulow: { m: B.m, p: B.p, glowa: B.glowa }, nogi: B.nogi,
    rece: (u) => { const a = lerp(112, 4, u) * R; const sp = () => ({ d1: [-0.38, 0.92, 0], d2: [Math.cos(a) * 0.95, Math.sin(a) * 0.95, -0.3], obrot: 60 }); return { R: sp(), L: sp() }; } }); };
  /* --- leżenie na podłodze (wyciąg niski za stopami) --- */
  G['Lying Cable Curl'] = () => { const m = [0, 9.5]; const nog = (s) => noga3([83, 7, POL(s) * 10], [0, 1, 0], { pod: null }); return wlasna('Lying Cable Curl', { sprzet: [wyc({ chwyt: 'drazek', x: 120, y: 30 })], tulow: { m, p: -90, glowa: -90 }, nogi: { R: nog('R'), L: nog('L') },
    rece: (u) => { const a = (s) => ({ f1: 93, a1: 6, f2: lerp(103, 218, u), zG: 20, obrot: 70 }); return { R: a('R'), L: a('L') }; } }); };
  /* --- modlitewnik --- */
  const MD = { zle: [4, 20] };
  G['Barbell Preacher Curl'] = () => modl('Barbell Preacher Curl', { ...MD, sprzet: [SPRZET.sztanga()], zr: 19, obrot: [70, 70] });
  G['Preacher Curl (EZ)'] = () => modl('Preacher Curl (EZ)', { ...MD, sprzet: [SPRZET.gryfLamany()], zr: 15, obrot: [25, 25] });
  G['Reverse EZ-Bar Preacher Curl'] = () => modl('Reverse EZ-Bar Preacher Curl', { ...MD, gora: 120, sprzet: [SPRZET.gryfLamany()], zr: 15, obrot: [-60, -60] });
  G['Preacher Curl'] = () => modl('Preacher Curl', { ...MD, sprzet: [SPRZET.hantle()], zr: 25, obrot: [0, 70] });
  G['Preacher Hammer Dumbbell Curl'] = () => modl('Preacher Hammer Dumbbell Curl', { ...MD, sprzet: [SPRZET.hantle()], zr: 25, obrot: [0, 0] });
  G['Zottman Preacher Curl'] = () => modl('Zottman Preacher Curl', { ...MD, sprzet: [SPRZET.hantle()], zr: 25, obrot: [60, 60, 60, 60, -60] });
  G['Cable Preacher Curl'] = () => modl('Cable Preacher Curl', { ...MD, sprzet: [wyc({ chwyt: 'drazek', x: 90, y: 15 })], zr: 19, obrot: [70, 70] });
  G['Machine Biceps Curl'] = () => modl('Machine Biceps Curl', { ...MD, dzwignia: true, sprzet: [], zr: 19, obrot: [70, 70], jedna: undefined });
  G['One Arm Dumbbell Preacher Curl'] = () => modl('One Arm Dumbbell Preacher Curl', { ...MD, sprzet: [SPRZET.hantle()], jedna: 'R', zr: 25, obrot: [0, 70] });
  return G;
}
