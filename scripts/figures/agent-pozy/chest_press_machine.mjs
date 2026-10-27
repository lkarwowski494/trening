// Generator póz rodziny chest_press_machine po stronie agenta (26.10.2026): maszyny do wyciskania (klatka prosto, skośnie w górę, w dół; nad głowę) i wyciskanie nad głowę na suwnicy Smitha.
// Maszyna rysowana schematycznie: siedzisko i oparcie jako ławka, ruchoma część jako dźwignia obrotowa (oś P wyznaczona z dwóch skrajnych położeń dłoni i długości ramienia), dłonie na łuku.
// Tułów nieruchomy przy oparciu (plecy_przy_oparciu: pochylenie ≤ 5°, miednica ≤ 3 cm); łokieć od ≥ 70° do ≤ 25°. Błędów rysowanych brak (jedyny błąd katalogu to tempo).
import { v2, BODY, R, r1, lerp, Y_STOJ, SPRZET, poza, nogiStoj, noga3, bark, naLawce, buduj, wyc, U9 } from './gora.mjs';

export const RODZINA = 'chest_press_machine';
const POL = (s) => (s === 'R' ? 1 : -1);
const SIDES = ['R', 'L'];
const sm = (t) => { const c = Math.min(1, Math.max(0, t)); return c * c * (3 - 2 * c); };

/** Punkt w układzie tułowia: a = odległość „do przodu” od klatki (normalna), b = wzdłuż tułowia w górę (od barku). */
const wTulowiu = (S, p, a, b) => { const n = [Math.cos(p * R), -Math.sin(p * R)], t = [Math.sin(p * R), Math.cos(p * R)]; return [S[0] + a * n[0] + b * t[0], S[1] + a * n[1] + b * t[1]]; };

/** Biegun łokcia ku stopom i na zewnątrz (recenzja ruchu 1.1, 27.10.2026, błąd nr 1: w ławce ujemnej biegun liczony od środka dźwigni przerzucał łokieć za głowę): wersor od głowy ku stopom w osi tułowia (pochylenie p) + wychylenie na bok. */
const poleKuStopom = (p, sg) => [r1(-Math.sin(p * R) * 3), r1(-Math.cos(p * R) * 3), r1(sg * 1.8)];

/** Maszyna z dźwignią obrotową. o: { kat (oparcie), top, h0 [a,b], h1 [a,b], r (ramię), zr, wybor ('gora'|'dol'|'tyl'|'przod'), dec (ławka ujemna), poleStopy (biegun łokcia ku stopom), leverZ + trzyma (jedna dźwignia z boku: pivot z = leverZ, trzyma 'R') }. */
function maszyna(cw, o) {
  const kat = o.kat ?? 85; const top = o.top ?? 45; const B = naLawce(kat, top, { zr: 24 }); let nogi = B.nogi;
  if (kat < 0) { const nn = (s) => noga3([B.m[0] + 44, 66, POL(s) * 24], [0.15, 1, POL(s) * 0.1], { pod: 0, rot: 8 }); nogi = { R: nn('R'), L: nn('L') }; }
  const S0 = bark(B.m, B.p, 1); const zr = o.zr ?? 26; const dz = zr - 19;
  const r2 = o.leverZ === undefined ? o.r : Math.sqrt(o.r ** 2 - (o.leverZ - zr) ** 2); /* dźwignia z boku (pivot w z = leverZ): ramię 3D = r, w płaszczyźnie strzałkowej r2 */
  const rIn = (a) => a; void rIn;
  const H0 = wTulowiu(S0, B.p, o.h0[0], o.h0[1]); const H1 = wTulowiu(S0, B.p, o.h1[0], o.h1[1]);
  const mid = [(H0[0] + H1[0]) / 2, (H0[1] + H1[1]) / 2]; const dx = H1[0] - H0[0], dy = H1[1] - H0[1]; const l = Math.hypot(dx, dy); const half = l / 2; const hh = Math.sqrt(Math.max(0, r2 * r2 - half * half)); const n = [-dy / l, dx / l];
  const kand = [[mid[0] + n[0] * hh, mid[1] + n[1] * hh], [mid[0] - n[0] * hh, mid[1] - n[1] * hh]];
  const P = kand.sort((a, b) => (o.wybor === 'dol' ? a[1] - b[1] : o.wybor === 'tyl' ? a[0] - b[0] : o.wybor === 'przod' ? b[0] - a[0] : b[1] - a[1]))[0];
  const a0 = Math.atan2(H0[1] - P[1], H0[0] - P[0]); let a1 = Math.atan2(H1[1] - P[1], H1[0] - P[0]); if (Math.abs(a1 - a0) > Math.PI) a1 += a1 < a0 ? 2 * Math.PI : -2 * Math.PI;
  const fr = (u) => { const a = lerp(a0, a1, u); const c = [P[0] + r2 * Math.cos(a), P[1] + r2 * Math.sin(a)]; const rr = {};
    for (const s of SIDES) { const sg = POL(s); const pv = [c[0] - S0[0], c[1] - 33 - S0[1], 0]; const pl = Math.hypot(pv[0], pv[1], 1) || 1; rr[s] = { g: [c[0], c[1], sg * zr], pole: o.poleStopy ? poleKuStopom(B.p, sg) : [r1(pv[0] / pl * 3), r1(pv[1] / pl * 3), r1(sg * 1.2)], obrot: 0 }; }
    return poza({ u, tulow: { m: B.m, p: B.p, glowa: B.glowa ?? B.p }, nogi, rece: rr }); };
  const lever = { rodzaj: 'dzwignia', tryb: 'obrot', x: r1(P[0]), y: r1(P[1]), z: o.leverZ ?? 0, dlugosc: r1(o.r), punkt: 'dlonie', trzyma: o.leverZ === undefined ? 'obie' : 'R' };
  const lawka = { rodzaj: 'lawka', x: 0, top, kat, dlugosc: 75, ...(kat < 0 ? { walki: true } : { siedzisko: 40 }) };
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-110, 130), lawka, lever], fr, us: o.us ?? U9 });
}

/** Wyciskanie nad głowę na suwnicy Smitha, siedząc (oparcie 85°): sztanga porusza się tylko w pionie w x prowadnicy. */
function smithPress(cw, o = {}) {
  const top = 45; const B = naLawce(85, top, { zr: 24 }); const S0 = bark(B.m, B.p, 1); const xr = S0[0] + (o.xr ?? 20); const zr = o.zr ?? 26; const dz = zr - 19;
  const yTop = Math.sqrt(63.4 ** 2 - (o.xr ?? 20) ** 2 - dz * dz);
  const fr = (u) => { const rece = {}; for (const s of SIDES) { const sg = POL(s); const y = S0[1] + lerp(o.dy0 ?? 14, yTop, u); rece[s] = { g: [xr, y, sg * zr], pole: [xr - S0[0], y - 33 - S0[1], 0].map((c, i, a) => r1(c / (Math.hypot(...a) || 1) * 3)).map((c, i) => (i === 2 ? r1(sg * 0.6) : c)), obrot: -75 }; }
    return poza({ u, tulow: { m: B.m, p: B.p, glowa: B.p }, nogi: B.nogi, rece }); };
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-110, 130), { rodzaj: 'lawka', x: 0, top, kat: 85, dlugosc: 75, siedzisko: 40 }, { rodzaj: 'smith', x: r1(xr), h: 200 }, SPRZET.sztanga()], fr, us: o.us ?? U9 });
}

export const WYJATKI = {};
export const PRZYBLIZENIA = {
  'Machine Chest Press': 'przybliżenie: dźwignia obrotowa jako schemat (oś nad uchwytami), siedzisko i oparcie jako ławka 85°, bez rysowania konstrukcji maszyny',
  'Leverage Incline Chest Press': 'przybliżenie: dźwignia obrotowa jako schemat, oparcie 50° od poziomu',
  'Leverage Decline Chest Press': 'przybliżenie: dźwignia obrotowa jako schemat, oparcie ujemne (−20°) z wałkami na nogi',
  'Machine Shoulder Press': 'przybliżenie: jedna dźwignia obrotowa po prawej stronie (oś przed osobą, z = 30 cm — opis kontraktu: dźwignia z boku, nie w osi ciała), uchwyty startowe na wysokości barków',
};

export function generuj() {
  const G = {};
  G['Machine Chest Press'] = () => maszyna('Machine Chest Press', { kat: 85, top: 45, h0: [14, -8], h1: [62.4, -2], r: 70, wybor: 'gora' });
  G['Leverage Incline Chest Press'] = () => maszyna('Leverage Incline Chest Press', { kat: 50, top: 45, h0: [14, -8], h1: [62.4, -2], r: 70, wybor: 'gora' });
  G['Leverage Decline Chest Press'] = () => maszyna('Leverage Decline Chest Press', { kat: -20, top: 60, h0: [14, -8], h1: [62.4, -2], r: 70, wybor: 'gora', poleStopy: true });
  G['Machine Shoulder Press'] = () => maszyna('Machine Shoulder Press', { kat: 85, top: 45, h0: [18, 5], h1: [10, 62], r: 70, wybor: 'przod', zr: 24, leverZ: 30 });
  G['Smith Machine Shoulder Press'] = () => smithPress('Smith Machine Shoulder Press');
  return G;
}
