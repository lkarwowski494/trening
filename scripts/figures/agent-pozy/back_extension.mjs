// Generator póz rodziny back_extension po stronie agenta (wersja 1.1, 26.10.2026): prostowanie tułowia na rzymskiej ławce, reverse hyper, z piłką i z talerzem, unoszenie tułowia leżąc.
// Układ: osoba leży przodem na podpórce (poza@2: obrotTulowia 180° — klatka w dół przy głowie w stronę −x), tułów zwisa i prostuje się w biodrach, nogi proste przy wałkach; kolano z IK.
// Pozy WYLICZONE z modelu: nogi proste (odległość biodro–kostka 82 cm) opadają pod kątem β ku wałkom, tułów obraca się wokół bioder (biodro 0° na górze, ≥ 70° na dole).
import { v2, BODY, R, r1, lerp, ease, HIP, SH, ZASIEG_R, dNogi, rPlan, hipY, tp, S, K, poza, PODLOGA, kolano2D, katXY, bladZTrajektorii, przeciecie, kostkaStopyY } from './dol.mjs';

export const RODZINA = 'back_extension';
const ZS = 9;
const T = () => BODY().trunk;

import { ramka as ramkaPodloga, chwyt as chwytPodloga } from './core_floor.mjs';

/** Chwyty rąk zwisających do przodu (poza@2 obrotTulowia 180°: prawa strona osoby w −z): ręce opadają ku podłodze, nie niżej niż 6 cm. */
const rekaZwis = (Sx, delta) => (sg) => ({ g: [Sx[0] + 6 * Math.cos(delta * R), Math.max(6, Sx[1] - 42), -sg * 8], pole: [0.2, -1, -sg * 0.5] });

/** Rzymska ławka: podpórka bioder (środek [xp, top], kąt kat), nogi proste opadają pod kątem β, wałki za kostkami. */
export function rzymska(cw, o = {}) {
  const { kat = 45, top = 75, xp = 0, beta = 40, dolDeg = -42, offN = 11.5, offD = -8 } = o; const th_ = kat * R; const n = [Math.sin(th_), Math.cos(th_)];
  const dd = [Math.cos(th_), -Math.sin(th_)]; const aEnd = [xp - 15 * dd[0], top - 15 * dd[1]]; const pelvis = [aEnd[0] + offD * dd[0] + offN * n[0], aEnd[1] + offD * dd[1] + offN * n[1]]; const L = 82;
  const us = [0, 0.25, 0.5, 0.75, 1];
  const A = [pelvis[0] + L * Math.cos(beta * R), pelvis[1] - L * Math.sin(beta * R)]; const rollerC = [A[0] + 9.6 * Math.sin(beta * R), A[1] + 9.6 * Math.cos(beta * R)];
  const mk = (u) => { const delta = lerp(beta, dolDeg, ease(u)); const p = -(90 - delta);
    const aR = [A[0], A[1], -ZS], aL = [A[0], A[1], ZS]; /* po obrocie 180° prawa strona osoby leży w −z */
    const Sx = [pelvis[0] - T() * Math.cos(delta * R), pelvis[1] + T() * Math.sin(delta * R)]; const g = rekaZwis(Sx, delta);
    return K({ u, m: pelvis, p, head: p, roll: 180, R: { a: aR, pod: null, rot: 10, pole: [0.3, 1, 0] }, L: { a: aL, pod: null, rot: 10, pole: [0.3, 1, 0] }, hr: g(1), hl: g(-1) }); };
  const fr = us.map(mk);
  const spr = [PODLOGA(-120, 160), { rodzaj: 'rzymska', x: xp, top, kat, dlugosc: r1(rollerC[0] - xp), y: r1(rollerC[1]) }];
  return poza(RODZINA, cw, spr, fr, []);
}

/** Reverse hyper: tułów leży przodem na podpórce (kat 0), nogi zwisają za jej końcem i unoszą się do linii z tułowiem (gamma = kąt nóg pod poziomem). */
export function reverseHyper(cw, o = {}) {
  const { top = 92, xp = 0, gDol = 82, gGora = -2 } = o; const pelvis = [xp + 19, top + 9.8]; const L = 82; const us = [0, 0.25, 0.5, 0.75, 1];
  const mk = (u) => { const g = lerp(gDol, gGora, ease(u)); const a = [pelvis[0] + L * Math.cos(g * R), pelvis[1] - L * Math.sin(g * R)]; const Sx = [pelvis[0] - T(), pelvis[1]]; const gr = (sg) => ({ g: [Sx[0] - 26, top + 4, -sg * 14], pole: [0, -0.5, -sg * 0.4] });
    return K({ u, m: pelvis, p: -90, head: -90, roll: 180, R: { a: [a[0], a[1], -ZS], pod: null, rot: 10, pole: [0, 1, 0] }, L: { a: [a[0], a[1], ZS], pod: null, rot: 10, pole: [0, 1, 0] }, hr: gr(1), hl: gr(-1) }); };
  const fr = us.map(mk);
  return poza(RODZINA, cw, [PODLOGA(-120, 160), { rodzaj: 'rzymska', x: xp, top, kat: 0, walki: false }], fr, []);
}

/** Lower Back Curl: leżenie przodem na podłodze (głowa +x), barki unoszą się o ok. 12 cm, miednica zostaje na podłodze, nogi leżą. */
export function lowerBackCurl(cw) {
  const Y0 = 9.5; const us = [0, 0.25, 0.5, 0.75, 1]; const D = 82.4;
  const fr = us.map((u) => { const phi = lerp(0, 7, ease(u)); const p = 90 - phi; const a = [-D, Y0 + 1.5]; const Sx = [Math.cos(phi * R) * T(), Y0 + Math.sin(phi * R) * T()];
    const nog = (z) => ({ ankle: a, strona: 'gora', pod: 0, rot: 90, z, pole: [0.15, 1, 0.1 * Math.sign(z || 1)] });
    return ramkaPodloga({ u, miednica: [0, Y0], p, glowa: p * 0.9, nogi: { R: nog(9), L: nog(-9) }, rece: { R: { g: [Sx[0] - 50, 6, 24], pole: [0, 0.3, 1] }, L: { g: [Sx[0] - 50, 6, -24], pole: [0, 0.3, -1] } } }); });
  return poza(RODZINA, cw, [PODLOGA(-170, 130)], fr, []);
}

export const WYJATKI = {};
export const PRZYBLIZENIA = {};
export function generuj() {
  return {
    'Back Extension': () => rzymska('Back Extension'),
    'Reverse Hyperextension': () => reverseHyper('Reverse Hyperextension'),
    'Lower Back Curl': () => lowerBackCurl('Lower Back Curl'),
  };
}
