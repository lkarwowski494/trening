// Generator póz rodziny leg_isolation po stronie agenta (wersja 1.1, 26.10.2026): prostowanie i uginanie nóg na maszynach, w staniu, na linkach i gumie, uginanie na ślizgaczach.
// Pozy WYLICZONE z modelu: miednica nieruchoma, udo poziomo (siad) albo pionowo (stanie), goleń obraca się w kolanie o kąt z modelu (kolano = bieguny z IK), dźwignia maszyny na osi kolana (promień = goleń + przesunięcie boczne).
// Błędy: rodzina ma tylko mis.jerk (tempo, bez animacji) i ht.mis.arch (przeprost lędźwi na górze ślizgacza) — ten ostatni łamie wyłącznie regułę „plecy_most” (grupa plecy).
import { v2, BODY, R, r1, lerp, ease, HIP, SH, ZASIEG_R, dNogi, rPlan, hipY, tp, S, reka, K, poza, PODLOGA, kolano2D, katXY, bladZTrajektorii, przeciecie, kostkaStopyY } from './dol.mjs';

export const RODZINA = 'leg_isolation';
const ZS = 10; const ZP = 30; /* oś dźwigni maszyny z boku (z) */
const th = () => BODY().thigh, sh = () => BODY().shank;
/** Biegun kolana z jego znanego położenia: kierunek od środka odcinka biodro–kostka do kolana. */
const poleKolana = (hip, ankle, knee) => { const mid = hip.map((v, i) => (v + ankle[i]) / 2); const d = knee.map((v, i) => v - mid[i]); const l = Math.hypot(...d) || 1; return d.map((v) => r1(v / l * 100) / 100); };

/** Siad na maszynie: miednica na siedzisku (oparcie 80°), udo poziomo, kolano w x = miednica + 42. Zwraca geometrię. */
function siad() {
  const E = v2(); const kat = 80; const top = 37.8; const hx = 0; const hp = E.benchHip(kat, top); const m = [hp[0] + hx, hp[1]]; const p = kat - 90;
  const knee = [m[0] + th(), m[1]]; return { kat, top, hx, m, p, knee };
}
const stopaKostka = (knee, psi) => [knee[0] + sh() * Math.sin(psi * R), knee[1] - sh() * Math.cos(psi * R)];

function dzwignia(kneePt, ankle) { const r = Math.hypot(ankle[0] - kneePt[0], ankle[1] - kneePt[1], ZP - ZS); return { rodzaj: 'dzwignia', tryb: 'obrot', punkt: 'kostki', trzyma: 'R', x: r1(kneePt[0]), y: r1(kneePt[1]), z: ZP, dlugosc: r1(r) }; }

/** Prostowanie i uginanie nóg w siadzie: psi = kąt goleni od pionu (do przodu dodatni): 0 = zgięcie 90°, 82 ≈ prawie wyprost. jednonoz: pracuje tylko prawa. */
export function siadMaszyna(cw, o = {}) {
  const { psi0 = 0, psi1 = 80, jednonoz = false, siedzisko = 40, extra = [] } = o;
  const g = siad(); const us = [0, 0.25, 0.5, 0.75, 1];
  const mk = (u) => {
    const psi = lerp(psi0, psi1, ease(u)); const aR3 = (() => { const a = stopaKostka(g.knee, psi); return [a[0], a[1], ZS]; })();
    const aL3 = jednonoz ? [g.knee[0], g.knee[1] - sh(), -ZS] : [aR3[0], aR3[1], -ZS];
    const hipR = [g.m[0], g.m[1], HIP()], hipL = [g.m[0], g.m[1], -HIP()];
    const kR = [g.knee[0], g.knee[1], HIP() + 1], kL = [g.knee[0], g.knee[1], -HIP() - 1];
    const grip = (sg) => ({ g: [g.m[0] + 18, g.top + 5, sg * 24], pole: [-0.2, -0.5, sg] });
    return K({ u, m: g.m, p: g.p, head: g.p, R: { a: aR3, pod: null, rot: 10, pole: poleKolana(hipR, aR3, kR) }, L: { a: aL3, pod: null, rot: 10, pole: poleKolana(hipL, aL3, kL) }, hr: grip(1), hl: grip(-1) });
  };
  const fr = us.map(mk);
  const a0 = stopaKostka(g.knee, psi0); const spr = [PODLOGA(-60, 140), { rodzaj: 'lawka', x: r1(g.m[0] - 8.5), top: g.top, kat: g.kat, siedzisko, dlugosc: 75 }, dzwignia(g.knee, [a0[0], a0[1], ZS]), ...extra];
  return poza(RODZINA, cw, spr, fr, []);
}

/** Uginanie nóg leżąc przodem (głowa +x, nogi −x): ławka płaska, kolana na krawędzi, goleń podnosi się o kąt phi nad poziomem. */
export function lezac(cw) {
  const g = { top: 43 }; const m = [0, g.top + 10.2]; const knee = [-th(), m[1]]; const us = [0, 0.25, 0.5, 0.75, 1]; const phi0 = 4, phi1 = 100;
  const mk = (u) => { const phi = lerp(phi0, phi1, ease(u)); const a = [knee[0] - sh() * Math.cos(phi * R), knee[1] + sh() * Math.sin(phi * R)];
    const aR3 = [a[0], a[1], ZS], aL3 = [a[0], a[1], -ZS]; const hipR = [m[0], m[1], HIP()], hipL = [m[0], m[1], -HIP()]; const kR = [knee[0], knee[1], HIP() + 1], kL = [knee[0], knee[1], -HIP() - 1];
    const grip = (sg) => ({ g: [78, g.top + 4, sg * 20], pole: [0, -1, sg * 0.4] });
    return K({ u, m, p: 90, head: 72, R: { a: aR3, pod: null, rot: 10, pole: poleKolana(hipR, aR3, kR) }, L: { a: aL3, pod: null, rot: 10, pole: poleKolana(hipL, aL3, kL) }, hr: grip(1), hl: grip(-1) }); };
  const fr = us.map(mk); const a0 = [knee[0] - sh() * Math.cos(phi0 * R), knee[1] + sh() * Math.sin(phi0 * R)];
  const spr = [PODLOGA(-120, 100), { rodzaj: 'lawka', x: 0, top: g.top, kat: 0, siedzisko: 70, dlugosc: 45 }, dzwignia(knee, [a0[0], a0[1], ZS])];
  return poza(RODZINA, cw, spr, fr, []);
}

/** Uginanie nogi stojąc (maszyna albo linka): noga podporowa L prosta, pracująca R: udo pionowo, goleń odchyla się do tyłu o beta (0 = prosta, 95 = zgięcie). */
export function stojac(cw, o = {}) {
  const { maszyna = true, pitch = 24, linka = false } = o; const us = [0, 0.25, 0.5, 0.75, 1];
  const aL = [0, 7, -ZS]; const y = hipY(aL, 0, -HIP(), 8); const m = [0, y]; const pr = maszyna ? pitch : 6;
  const kneeR = [0, y - th()]; const kneeR3 = [0, y - th(), HIP() + 1];
  const mk = (u) => { const beta = lerp(10, 95, ease(u)); const a = [kneeR[0] - sh() * Math.sin(beta * R), kneeR[1] - sh() * Math.cos(beta * R)]; const aR3 = [a[0], a[1], ZS]; const hipR = [m[0], m[1], HIP()];
    const Sx = S(m, pr); const grip = (sg) => maszyna ? ({ g: [Sx[0] + 24, Sx[1] - 30, sg * 22], pole: [0, -1, sg * 0.5] }) : ({ g: [m[0] - 3, m[1] + 10, sg * 21], pole: [-0.5, 0, sg] });
    return K({ u, m, p: pr, head: pr * 0.5, R: { a: aR3, pod: null, rot: 10, pole: poleKolana(hipR, aR3, kneeR3) }, L: { a: aL, pod: 0, rot: 10, odch: 6 }, hr: grip(1), hl: grip(-1) }); };
  const fr = us.map(mk); const a0 = [kneeR[0] - sh() * Math.sin(10 * R), kneeR[1] - sh() * Math.cos(10 * R)];
  const spr = [PODLOGA(-90, 110)];
  if (maszyna) spr.push(dzwignia(kneeR, [a0[0], a0[1], ZS]));
  if (linka) spr.push({ rodzaj: 'wyciag', x: 95, y: 18, z: 78, chwyt: 'kostka', trzyma: 'R', h: 120 });
  return poza(RODZINA, cw, spr, fr, []);
}

/** Uginanie nogi na gumie w siadzie na skrzyni: goleń prawej nogi wraca po podłodze pod kolano, pętla gumy między kostkami. */
export function guma(cw) {
  const m = [0, 48]; const us = [0, 0.25, 0.5, 0.75, 1]; const aLx = th(); const aL3 = [aLx, 7, -ZS];
  const x0 = Math.sqrt(dNogi(10) ** 2 - (48 - 8.6) ** 2 - 1.5 ** 2); const x1 = th() + 1;
  const mk = (u) => { const ax = lerp(x0, x1, ease(u)); const aR3 = [ax, 8.6, ZS]; const grip = (sg) => ({ g: [8, 40, sg * 27], pole: [-0.2, -0.6, sg] });
    return K({ u, m, p: 0, head: 0, R: { a: aR3, pod: -5, rot: 10, odch: 6, pole: [1, 0.3, 0.05] }, L: { a: aL3, pod: 0, rot: 10, odch: 6, pole: [1, 0.3, -0.05] }, hr: grip(1), hl: grip(-1) }); };
  const spr = [PODLOGA(-60, 140), { rodzaj: 'skrzynia', x0: -40, x1: -1, top: 38.6 }, { rodzaj: 'guma', mocowanie: 'kostki' }];
  return poza(RODZINA, cw, spr, us.map(mk), []);
}

/** Uginanie nóg na ślizgaczach w pozycji mostka: barki na podłodze, miednica nieruchomo wysoko (θ = 26°), pięty na ślizgaczach wysuwają się od zgięcia 100° do prawie wyprostu. */
export function slizgacze(cw) {
  const T = BODY().trunk; const th0 = 12; const Sx = [-50, 9.5]; const m = [Sx[0] + T * Math.cos(th0 * R), Sx[1] + T * Math.sin(th0 * R)]; const p = -(90 + th0);
  const us = [0, 0.25, 0.5, 0.75, 1]; const hipR = [m[0], m[1], HIP()];
  const mk = (u, arch = 0) => { const K1 = lerp(100, 12, ease(u)); const dx = Math.sqrt(Math.max(1, rPlan(dNogi(K1), HIP() - ZS) ** 2 - (m[1] - 9) ** 2)); let ax = m[0] + dx, pod = 0, ay = 9;
    for (let i = 0; i < 8; i++) { const kn = kolano2D(m, [ax, ay], [0.1, 1]); const ang = katXY([ax, ay], kn); pod = Math.max(-30, Math.min(75, ang - 82)); ay = kostkaStopyY(2, pod); ax = m[0] + Math.sqrt(Math.max(1, rPlan(dNogi(K1), HIP() - ZS) ** 2 - (m[1] - ay) ** 2)); }
    const g = (sg) => ({ g: [Sx[0] + 60, 3.5, sg * 24], pole: [0, 0.3, sg] });
    return K({ u, m, p, bend: -arch * ease(u), head: -86, R: { a: [ax, ay, ZS], pod, rot: 10, pole: [0.1, 1, 0.08] }, L: { a: [ax, ay, -ZS], pod, rot: 10, pole: [0.1, 1, -0.08] }, hr: g(1), hl: g(-1) }); };
  const fr = us.map((u) => mk(u)); const zle = us.map((u) => mk(u, 35));
  const spr = [PODLOGA(-120, 160), { rodzaj: 'slizgacze', punkt: 'kostki', trzyma: 'obie' }];
  return poza(RODZINA, cw, spr, fr, [bladZTrajektorii({ cue: 'ht.mis.arch', znacznik: 'back', us, ok: (u) => fr[us.indexOf(u)], zle: (u) => zle[us.indexOf(u)] })]);
}

export const WYJATKI = {
  'Leg Curl (hantel)': 'hantel zaciśnięty między stopami: sprzęt „hantel” podąża tylko za dłonią (chwyt), a nie za kostką — kontrakt nie umie narysować ciężaru trzymanego stopami',
  'Stability Ball Hamstring Curl': 'piłka gimnastyczna ma w kontrakcie stałe położenie (x, z) i toczy się po podłodze razem z piętami, więc przy ruchu kostek o ok. 40 cm pięty nie mogą leżeć na piłce w każdej klatce',
};
export const PRZYBLIZENIA = {};
export function generuj() {
  return {
    'Leg Extension': () => siadMaszyna('Leg Extension'),
    'Single-Leg Leg Extension': () => siadMaszyna('Single-Leg Leg Extension', { jednonoz: true }),
    'Leg Curl': () => siadMaszyna('Leg Curl', { psi0: 80, psi1: -10, siedzisko: 30 }),
    'Lying Leg Curl': () => lezac('Lying Leg Curl'),
    'Standing Leg Curl': () => stojac('Standing Leg Curl'),
    'Standing Cable Leg Curl': () => stojac('Standing Cable Leg Curl', { maszyna: false, linka: true }),
    'Seated Band Hamstring Curl': () => guma('Seated Band Hamstring Curl'),
    'Slider Hamstring Curl': () => slizgacze('Slider Hamstring Curl'),
  };
}
