// Generator póz rodziny dip po stronie agenta (wersja 1.1, 26.10.2026): pompki na poręczach (klatka, triceps), na kółkach, na maszynie i z ławki.
// Pozy WYLICZONE z modelu: dłonie stałe na poręczach/kółkach/ławce, bark opada nad dłonie od wyprostu (łokieć ≈ 8°) do zgięcia ≈ 95°, tułów wisi na barkach (miednica = bark − oś tułowia), nogi z FK.
// Maszyna: dłonie prowadzi dźwignia obrotowa (łuk wokół osi wyliczonej z dwóch skrajnych położeń dłoni). Błędów katalogu rodzina nie ma (mis.jerk — tempo).
import { v2, BODY, R, r1, lerp, ease, HIP, K, poza, PODLOGA, S, kostkaStopyY } from './dol.mjs';

export const RODZINA = 'dip';
const US = [0, 0.25, 0.5, 0.75, 1];
const a01 = ease;
const ZR = 22; /* dłonie: z = ±22 (połowa rozstawu poręczy) */
const ODCHYL_TASMY = 21; /* taśma rozchodzi się ku górze o tyle cm na zewnątrz (ok. 8°), żeby przedramię nie przechodziło przez nią */
const ZR_KOLKA = 28; /* kółka: dłonie nieco szerzej niż barki (19), taśmy lekko na zewnątrz, żeby nie przechodziły przez ramię */
export const WYJATKI = {};
export const PRZYBLIZENIA = {
  'Ring Dips': 'przybliżenie: kółka rysowane jako dwa uchwyty na osobnych taśmach (sprzęt „zawieszenie”, taśma na każdą dłoń, zaczep 250 cm nad podłogą, taśmy lekko rozchodzą się ku górze) — bez obrotu kółek na zewnątrz na dole; dwie niezależne rączki, nie poprzeczka (recenzja ruchu 27.10.2026)',
};
const poleKolana = (hip, ankle, knee) => { const mid = hip.map((v, i) => (v + ankle[i]) / 2); const d = knee.map((v, i) => v - mid[i]); const l = Math.hypot(...v3(d)) || 1; return d.map((v) => r1(v / l * 100) / 100); };
const v3 = (d) => d;
/** Noga z FK w płaszczyźnie strzałkowej: biodro, kąt uda ang (od +x), zgięcie kolana k, z kostki. */
function noga(hip, ang, k, z) {
  const b = BODY(); const t = ang * R, s = (ang - k) * R; const kn = [hip[0] + b.thigh * Math.cos(t), hip[1] + b.thigh * Math.sin(t), hip[2]]; const an = [kn[0] + b.shank * Math.cos(s), kn[1] + b.shank * Math.sin(s), z];
  return { ankle: an, pole: poleKolana(hip, an, kn) };
}

/** Pompki w podporze na poręczach/kółkach: dłonie (0, h, ±22) stałe; bark od (0, h + 63,5) do (dx, h + dyDol) przy ugięciu ≈ 95°. */
function wPodporze(cw, { h = 115, p1, p2, dxDol, dyDol, poleLokcia, sprzet, kolana = 95, zr = ZR }) {
  const dz = zr - 19; const dGora = 63.6; const yGora = Math.sqrt(dGora * dGora - dz * dz);
  const fr = (u) => { const a = a01(u); const Sx = lerp(0, dxDol, a), Sy = h + lerp(yGora, dyDol, a); const p = lerp(p1, p2, a); const tr = BODY().trunk; const m = [Sx - tr * Math.sin(p * R), Sy - tr * Math.cos(p * R)];
    const ang = 270 - p + 8; const hR = [m[0], m[1], HIP()], hL = [m[0], m[1], -HIP()]; const nR = noga(hR, ang, kolana, 9), nL = noga(hL, ang, kolana, -9);
    return K({ u, m, p, head: p * 0.4, R: { a: nR.ankle, pod: null, rot: 10, pole: nR.pole }, L: { a: nL.ankle, pod: null, rot: 10, pole: nL.pole }, hr: { g: [0, h, zr], pole: poleLokcia(1) }, hl: { g: [0, h, -zr], pole: poleLokcia(-1) } }); };
  return poza(RODZINA, cw, [PODLOGA(-120, 120), ...sprzet(h)], US.map(fr), []);
}

/** Pompki z ławki: dłonie na krawędzi ławki za plecami, nogi proste do przodu (pięty na podłodze), miednica opada między ławką a stopami. */
function zLawki(cw) {
  const top = 43; const xf = 0; const hx = xf - 3; const dz = ZR - 19; const SX = xf + 6; const phi = 8; const tr = BODY().trunk;
  const yGora = top + 3.5 + Math.sqrt(63.4 ** 2 - (SX - hx) ** 2 - dz * dz); const yDol = top + 3.5 + 46;
  const mTop = [SX + tr * Math.sin(phi * R), yGora - tr * Math.cos(phi * R)]; const ankX = mTop[0] + 60; const pod = 20; const ay = kostkaStopyY(0, pod);
  const fr = (u) => { const a = a01(u); const Sy = lerp(yGora, yDol, a); const m = [SX + tr * Math.sin(phi * R), Sy - tr * Math.cos(phi * R)]; const p = -phi;
    const aR = [ankX, ay, 9], aL = [ankX, ay, -9];
    return K({ u, m, p, head: p * 0.5, R: { a: aR, pod, rot: 10, pole: [0.3, 1, 0.05] }, L: { a: aL, pod, rot: 10, pole: [0.3, 1, -0.05] }, hr: { g: [hx, top + 3.5, ZR], pole: [-0.4, -1, 0.3] }, hl: { g: [hx, top + 3.5, -ZR], pole: [-0.4, -1, -0.3] } }); };
  return poza(RODZINA, cw, [PODLOGA(-110, 150), { rodzaj: 'lawka', x: xf - 55, top, kat: 0, dlugosc: 75, siedzisko: 55 }], US.map(fr), []);
}

/** Maszyna do dipów: siad (oparcie 80°), uchwyty prowadzi dźwignia obrotowa; dłonie od ≈ 90° zgięcia łokcia (przy barkach z przodu) do wyprostu przy biodrach. */
function maszyna(cw) {
  const E = v2(); const kat = 80; const top = 37.8; const hp = E.benchHip(kat, top); const m = [hp[0], hp[1]]; const p = kat - 90; const Sx = S(m, p);
  const A = [26, -37], B = [6, -62.5]; const M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]; const ab = [B[0] - A[0], B[1] - A[1]]; const cl = Math.hypot(...ab); const nrm = [ab[1] / cl, -ab[0] / cl]; /* prostopadła do cięciwy */
  const rxy = 70; const hh = Math.sqrt(rxy * rxy - (cl / 2) ** 2); const Pr = [M[0] + nrm[0] * hh, M[1] + nrm[1] * hh]; const ang = (q) => Math.atan2(q[1] - Pr[1], q[0] - Pr[0]); const a0 = ang(A), a1 = ang(B);
  const hand = (u) => { const t = lerp(a0, a1, a01(u)); return [Sx[0] + Pr[0] + rxy * Math.cos(t), Sx[1] + Pr[1] + rxy * Math.sin(t)]; };
  const ak = (sg) => ({ a: [m[0] + 40, 7, sg * 12], pod: 0, rot: 10, pole: [1, 0.4, sg * 0.05] });
  const fr = (u) => { const g = hand(u); return K({ u, m, p, head: p, R: ak(1), L: ak(-1), hr: { g: [g[0], g[1], ZR], pole: [-1, -0.3, 0.4] }, hl: { g: [g[0], g[1], -ZR], pole: [-1, -0.3, -0.4] } }); };
  const dzL = 28; const L3 = Math.sqrt(rxy * rxy + dzL * dzL);
  const spr = [PODLOGA(-60, 140), { rodzaj: 'lawka', x: r1(m[0] - 8.5), top, kat, siedzisko: 40, dlugosc: 75 }, { rodzaj: 'dzwignia', tryb: 'obrot', punkt: 'dlonie', trzyma: 'R', x: r1(Sx[0] + Pr[0]), y: r1(Sx[1] + Pr[1]), z: ZR + dzL, dlugosc: r1(L3) }];
  return poza(RODZINA, cw, spr, US.map(fr), []);
}

export function generuj() {
  const por = (h) => [{ rodzaj: 'poreczy', h, z: ZR, x0: -30, x1: 30 }];
  return {
    'Chest Dip': () => wPodporze('Chest Dip', { p1: 28, p2: 34, dxDol: 8, dyDol: 42.4, poleLokcia: (sg) => [-1, -0.3, sg * 0.6], sprzet: por }),
    'Triceps Dip': () => wPodporze('Triceps Dip', { p1: 4, p2: 4, dxDol: 0, dyDol: 43.2, poleLokcia: (sg) => [-1, 0, sg * 0.3], sprzet: por }),
    'Ring Dips': () => wPodporze('Ring Dips', { p1: 24, p2: 30, dxDol: 6, dyDol: 42.8, poleLokcia: (sg) => [-1, -0.3, sg * 0.5], zr: ZR_KOLKA, sprzet: () => [{ rodzaj: 'zawieszenie', x: 0, y: 250, z: ZR_KOLKA + ODCHYL_TASMY, punkt: 'dlonie', trzyma: 'R' }, { rodzaj: 'zawieszenie', x: 0, y: 250, z: -(ZR_KOLKA + ODCHYL_TASMY), punkt: 'dlonie', trzyma: 'L' }] }),
    'Dip Machine': () => maszyna('Dip Machine'),
    'Triceps Dips (ławka)': () => zLawki('Triceps Dips (ławka)'),
  };
}
