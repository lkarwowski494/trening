// Generator póz rodziny hip_bridge po stronie agenta (wersja 1.1, 26.10.2026): mostki biodrowe i hip thrust (z podłogi, z ławki/skrzyni, z piłki gimnastycznej, z obciążeniem).
// Układ: leżenie na plecach, głowa w stronę −x, stopy w stronę +x. Tułów obraca się wokół barków (barki stałe), miednica leży na okręgu o promieniu długości tułowia; stopy płasko na podłodze (pięta na podłodze).
// Kąt tułowia θ (nad poziomem; ujemny = miednica poniżej barków): pochylenieTulowia = −(90 + θ), głowa leży (pochylenieGlowy −90). Kolano wynika z IK (kostka stała), stopa płasko.
// Błąd z cue (ht.mis.arch): przeprost w lędźwiach na górze (zgięcie kręgosłupa −35°) — łamie wyłącznie regułę „plecy_bez_przeprostu” (grupa plecy).
import { v2, BODY, R, r1, lerp, ease, HIP, SH, ZASIEG_R, dNogi, rPlan, hipY, tp, S, reka, K, poza, PODLOGA, kolano2D, katXY, bladZTrajektorii, przeciecie } from './dol.mjs';

export const RODZINA = 'hip_bridge';
const ZS = 10;
const TR = () => BODY().trunk;
const YL = 9.5; /* wysokość środka tułowia leżącego (promień 9,5) */

/** Chwyty rąk: wzdłuż ciała na podłodze (bez ciężaru), albo na gryfie/hantlu na biodrach. m = miednica [x, y], th = kąt tułowia, Sx = bark [x, y]. */
function rece(tryb, m, th, Sx, barX = null) {
  const nx = -Math.sin(th * R), ny = Math.cos(th * R); /* normalna tułowia w górę (od pleców ku brzuchowi) */
  if (tryb === 'sztanga') { const tx = Math.cos(th * R), ty = Math.sin(th * R); const c = [barX ?? m[0] + 13 * nx - 4 * tx, m[1] + 13 * ny - 4 * ty]; const g = (sg) => ({ g: [c[0], c[1], sg * 30], pole: [0.2, 0.8, sg * 0.5] }); return { hr: g(1), hl: g(-1), c, sprzet: [{ rodzaj: 'sztanga', talerze: true, podazaZaChwytem: true, dlugosc: 220 }] }; }
  if (tryb === 'hantel') { const tx = Math.cos(th * R), ty = Math.sin(th * R); const c = [m[0] + 17.5 * nx - 5 * tx, m[1] + 17.5 * ny - 5 * ty]; const g = (sg) => ({ g: [c[0], c[1], sg * 4], pole: [0, -1, sg * 0.6] }); return { hr: g(1), hl: g(-1), c, sprzet: [{ rodzaj: 'hantel', pionowo: true }] }; }
  if (tryb === 'biodra') { const g = (sg) => ({ g: [m[0] + 11 * nx - 2 * Math.cos(th * R), m[1] + 11 * ny - 2 * Math.sin(th * R), sg * 13], pole: [0, -0.3, sg] }); return { hr: g(1), hl: g(-1), c: null, sprzet: [] }; } /* dłonie na biodrach */
  const g = (sg) => ({ g: [Sx[0] + 60, 3.5, sg * 24], pole: [0, 0.3, sg] }); return { hr: g(1), hl: g(-1), c: null, sprzet: [] }; /* ręce wzdłuż ciała na podłodze */
}

/** Mostek / hip thrust. podpar: 'podloga' (barki na podłodze), 'lawka' (górna część pleców na skrzyni 43 cm), 'pilka' (górna część pleców na piłce). */
export function most(cw, o = {}) {
  const { podpar = 'podloga', tryb = 'cc', th0 = podpar === 'podloga' ? 0 : -33, thGora = podpar === 'podloga' ? 26 : 0, Kgora = 82, rotZ = 60, poleZ = 0.4, jednonoz = false, zaba = false, smith = false, maszyna = false, bledy = true, wolna = 38 } = o;
  const T = TR(); const sx0 = -50; const rP = 32.5;
  const Spoz = (th) => { if (podpar === 'pilka') { const C = [sx0 + 40, rP]; const nxx = -Math.sin(th * R), nyy = Math.cos(th * R); return [C[0] + (rP + 9.5) * nxx - 15 * Math.cos(th * R), C[1] + (rP + 9.5) * nyy - 15 * Math.sin(th * R)]; } return [sx0, podpar === 'lawka' ? 43 + YL : YL]; };
  /* pozycja górna wyznacza położenie stóp: kolano = Kgora przy kostkach płasko na podłodze */
  const Sg = Spoz(thGora); const pg = [Sg[0] + T * Math.cos(thGora * R), Sg[1] + T * Math.sin(thGora * R)];
  const zA = zaba ? 5 : ZS; const rr = rPlan(dNogi(Kgora), HIP() - zA); const xa = r1(pg[0] + Math.sqrt(Math.max(1, rr * rr - (pg[1] - 7) ** 2)));
  const us = [0, 0.25, 0.5, 0.75, 1];
  const mk = (u, arch = 0) => {
    const th = lerp(th0, thGora, ease(u)); let Sx = Spoz(th);
    let m = [Sx[0] + T * Math.cos(th * R), Sx[1] + T * Math.sin(th * R)];
    if (smith) { /* sztanga porusza się tylko w pionie: miednica (i barki na ławce) przesuwają się tak, by środek gryfu został w x prowadnicy */ const nx = -Math.sin(th * R), tx = Math.cos(th * R); m = [pg[0] - 4 - (13 * nx - 4 * tx), m[1]]; Sx = [m[0] - T * tx, Sx[1]]; }
     const p = -(90 + th); const rc = rece(tryb, m, th, Sx, smith ? pg[0] - 4 : null);
    const aR = [xa, 7, zA], aL = [xa, 7, -zA];
    const rot = zaba ? rotZ : 10; const poleR = zaba ? [0, poleZ, 1] : [0.1, 1, 0.08]; const poleL = zaba ? [0, poleZ, -1] : [0.1, 1, -0.08];
    let nl = { a: aL, pod: 0, rot, pole: poleL };
    if (jednonoz) { const ph = Math.max(lerp(40, th, ease(u)), 5); const fa = [m[0] + 80 * Math.cos(ph * R), m[1] + 80 * Math.sin(ph * R), -ZS]; const kn = kolano2D(m, fa, [0.3, 1]); nl = { a: fa, pod: null, rot: 10, pole: [0.3, 1, 0], odch: undefined }; void kn; }
    return { f: K({ u, m, p: p, bend: -arch * ease(u), head: -86, R: { a: aR, pod: 0, rot, pole: poleR }, L: nl, hr: rc.hr, hl: rc.hl }), o: rc, m, Sx, th };
  };
  const fr = us.map((u) => mk(u)); const zle = us.map((u) => mk(u, 35));
  const x1 = xa; const spr = [PODLOGA(sx0 - 70, xa + 60), ...fr[0].o.sprzet];
  if (podpar === 'lawka') { const xs = Math.min(...fr.map((r) => r.Sx[0])); spr.push({ rodzaj: 'skrzynia', x0: r1(xs - 60), x1: r1(xs - 4.5), top: 43 }); }
  if (podpar === 'pilka') spr.push({ rodzaj: 'pilka_gimnastyczna', x: r1(sx0 + 40), promien: rP });
  if (smith) spr.push({ rodzaj: 'smith', x: r1(fr[4].o.c[0]), h: 200 });
  if (maszyna) { const a = fr[0].m, b = fr[4].m; spr.push({ rodzaj: 'dzwignia', tryb: 'prosta', kat: r1(katXY(a, b)), punkt: 'miednica', trzyma: 'R', x: r1(a[0]), y: r1(a[1]), z: 0, dlugosc: r1(Math.hypot(b[0] - a[0], b[1] - a[1]) + 6) }); }
  void x1;
  const b = bledy ? [bladZTrajektorii({ cue: 'ht.mis.arch', znacznik: 'back', us, ok: (u) => fr[us.indexOf(u)].f, zle: (u) => zle[us.indexOf(u)].f })] : [];
  return poza(RODZINA, cw, spr, fr.map((r) => r.f), b);
}

export const WYJATKI = {};
export const PRZYBLIZENIA = {};
export function generuj() {
  return {
    'Glute Bridge': () => most('Glute Bridge'),
    'Glute Bridge (sztanga)': () => most('Glute Bridge (sztanga)', { tryb: 'sztanga' }),
    'Frog Pump': () => most('Frog Pump', { zaba: true, Kgora: 90, rotZ: 35, poleZ: 1.8, thGora: 22 }),
    'Single Leg Glute Bridge': () => most('Single Leg Glute Bridge', { jednonoz: true }),
    'Hip Thrust (sztanga)': () => most('Hip Thrust (sztanga)', { podpar: 'lawka', tryb: 'sztanga' }),
    'Hip Thrust (hantel)': () => most('Hip Thrust (hantel)', { podpar: 'lawka', tryb: 'hantel' }),
    'Single Leg Hip Thrust': () => most('Single Leg Hip Thrust', { podpar: 'lawka', jednonoz: true, tryb: 'biodra' }),
    'Smith Machine Hip Thrust': () => most('Smith Machine Hip Thrust', { podpar: 'lawka', tryb: 'sztanga', smith: true }),
    'Machine Hip Thrust': () => most('Machine Hip Thrust', { podpar: 'lawka', maszyna: true, tryb: 'biodra' }),
    'Stability Ball Hip Bridge': () => most('Stability Ball Hip Bridge', { podpar: 'pilka', tryb: 'biodra', Kgora: 42, th0: -36, thGora: -14 }),
  };
}
