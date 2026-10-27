// Generator póz rodziny mobility_floor (27.10.2026): rozciąganie i mobilność na podłodze (siad, leżenie, klęk, czworak) — pozy statyczne (dwie identyczne klatki) i Cat-Cow (ruch).
// Układ: leżenie na plecach — głowa w stronę −x, nogi w +x, miednica [0, 9,6, 0], pochylenie −90; siad — tułów od pionu do przodu (+x); strona R = +z.
// Reguły sensu: data/zrodla/figury-sens.json → rodziny.mobility_floor (źródła przy regułach); pozycje bez przeczytanego źródła rysujemy tylko z cechą rozpoznawczą z opisu katalogu (PRZYBLIZENIA).
import { v2, BODY, R, r1, K, PODLOGA, poza, HIP, nrm, add, fk, nogaProsta, statyczna, Y_PODLOGA, kolanoIK, sieganie, kostkaY, sonda } from './mob.mjs';

export const RODZINA = 'mobility_floor';
const SP = [PODLOGA(-170, 170)];
const Y = Y_PODLOGA;
const POL = (s) => (s === 'R' ? 1 : -1);
const SD = ['R', 'L'];

/** Klatka z krótkiego opisu: tułów (m, p, bend, head, ext), nogi {R:{a,pod,rot,pole}}, ręce {R:{g,pole}}; ext: roll, twist, lean, tilt. */
const ramka = (u, { m, p, bend = 0, head, nogi, rece, ext = {} }) => K({ u, m, p, bend, head: head ?? p * 0.5, R: nogi.R, L: nogi.L, hr: rece.R, hl: rece.L, roll: ext.roll, twist: ext.twist, lean: ext.lean, tilt: ext.tilt });
/** Ręce do celów (punkty świata): prawie proste, jeśli cel daleko, inaczej łokieć zgięty (IK). */
const rekiDo = (S, cele, poles = {}) => { const o = {}; for (const s of SD) o[s] = { g: sieganie(S[s], cele[s]), pole: poles[s] ?? [0, -0.5, POL(s)] }; return o; };
/** Noga prosta od biodra w kierunku kier (3D), kostka w odległości 82,6 (kolano ≤ 15°); stopa: `pod` (null = neutralnie względem goleni). */
const prosta = (hip, kier, { pole = [0, 1, 0], pod = null, rot = 10 } = {}) => { const a = nogaProsta(hip, kier, 82.8, pole).a; return { a: pod === null ? a : [a[0], r1(kostkaY(pod)), a[2]], pod, rot, pole }; };

/* ---------- siad ---------- */
/** The Straddle: siad rozkroczny, nogi proste na boki (±40° od przodu), tułów pochylony z bioder (plecy płasko), dłonie na podłodze między nogami. */
function straddle(cw) {
  const m = [0, Y, 0]; const p = 50; const T = sonda(m, p); const th = 40;
  const nogi = {}; for (const s of SD) nogi[s] = prosta(T.hip[s], [Math.cos(th * R), -0.03, POL(s) * Math.sin(th * R)], { rot: 25 });
  const rece = rekiDo(T.sh, { R: [88, 3, 14], L: [88, 3, -14] });
  return statyczna(RODZINA, cw, SP, (u) => ramka(u, { m, p, head: 36, nogi, rece }));
}
/** Seated Calf Stretch: siad, nogi proste przed sobą, stopy ściągnięte ku sobie (palce w górę), tułów prosto (≤ 20°), dłonie na goleniach. */
function seatedCalf(cw) {
  const m = [0, Y, 0]; const p = 18; const T = sonda(m, p);
  const nogi = {}; for (const s of SD) nogi[s] = prosta(T.hip[s], [1, -0.02, POL(s) * 0.1], { pod: 72, rot: 6 });
  const rece = rekiDo(T.sh, { R: [58, 15, 11], L: [58, 15, -11] }, { R: [0, 0.3, 1], L: [0, 0.3, -1] });
  return statyczna(RODZINA, cw, SP, (u) => ramka(u, { m, p, head: 8, nogi, rece }));
}
/** Seated Floor Hamstring Stretch: jedna noga (R) prosta, stopa drugiej (L) przy wewnętrznej stronie uda, tułów pochylony z bioder (plecy płasko), dłonie na goleni. */
function seatedHamstring(cw) {
  const m = [0, Y, 0]; const p = 38; const T = sonda(m, p);
  const nogi = { R: prosta(T.hip.R, [1, -0.02, 0.1], { pod: 72, rot: 6 }), L: { a: [30, kostkaY(-12), -1], pod: -12, rot: 20, pole: [0, 0.15, -1] } };
  const rece = rekiDo(T.sh, { R: [52, 16, 10], L: [52, 16, 8] }, { R: [0, 0.2, 1], L: [0, 0.2, -1] });
  return statyczna(RODZINA, cw, SP, (u) => ramka(u, { m, p, head: 30, nogi, rece }));
}
/** Butterfly Stretch: siad, podeszwy stóp razem, kolana na boki, tułów pochylony do przodu, dłonie na stopach. */
function butterfly(cw) {
  const m = [0, Y, 0]; const p = 32; const T = sonda(m, p);
  const nogi = { R: { a: [34, kostkaY(-12), 3.5], pod: -12, rot: 20, pole: [0, 0.15, 1] }, L: { a: [34, kostkaY(-12), -3.5], pod: -12, rot: 20, pole: [0, 0.15, -1] } };
  const rece = rekiDo(T.sh, { R: [36, 12, 5], L: [36, 12, -5] }, { R: [0, -0.3, 1], L: [0, -0.3, -1] });
  return statyczna(RODZINA, cw, SP, (u) => ramka(u, { m, p, head: 25, nogi, rece }));
}

/* ---------- klęk i wykrok ---------- */
/** Child's Pose: klęk, pośladki nisko nad piętami, tułów złożony na udach, ręce wyciągnięte do przodu na podłodze. */
function childsPose(cw) {
  const m = [18, 42, 0]; const p = 95; const T = sonda(m, p); const pod = -85;
  const nogi = {}; for (const s of SD) nogi[s] = { a: [0, kostkaY(pod), POL(s) * 12], pod, rot: 0, pole: [1, 0.1, POL(s) * 0.3] };
  const rece = rekiDo(T.sh, { R: [120, 3, 15], L: [120, 3, -15] }, { R: [0, 1, 0.5], L: [0, 1, -0.5] });
  return statyczna(RODZINA, cw, SP, (u) => ramka(u, { m, p, head: 100, nogi, rece }));
}
/** Wykrok w klęku podpartym: tylna noga (L) kolanem przy podłodze, palce stopy podwinięte; przednia (R) stopa płasko. */
function wykrokKleczny({ y = 46, p = 12, xF = 43, xB = -57, head = 6, rece }) {
  const m = [0, y, 0]; const T = sonda(m, p); const podB = -85;
  const nogi = { R: { a: [xF, 7, 8.5], pod: 0, rot: 8, pole: [1, 0.1, 0.1] }, L: { a: [xB, kostkaY(podB), -9], pod: podB, rot: 4, pole: [0.8, -0.6, 0] } };
  return (u) => ramka(u, { m, p, head, nogi, rece: rece(T) });
}
/** Kneeling Hip Flexor Stretch: wykrok w klęku podpartym (kolano tylne przy podłodze), przednie kolano zgięte ok. 90°, tułów prosto, dłonie na biodrach. */
function hipFlexor(cw) {
  const rece = (T) => ({ R: { g: [T.hip.R[0] - 2, T.hip.R[1] + 8, 24], pole: [-0.6, -0.1, 1] }, L: { g: [T.hip.L[0] - 2, T.hip.L[1] + 8, -24], pole: [-0.6, -0.1, -1] } });
  return statyczna(RODZINA, cw, SP, wykrokKleczny({ rece }));
}

/* ---------- leżenie na plecach ---------- */
/** Supine Hamstring Stretch: leżenie, noga R uniesiona prosto (kąt 78° nad podłogą), noga L prosta na podłodze, dłonie obejmują tył uda (bez paska — przybliżenie). */
function supineHamstring(cw) {
  const m = [0, Y, 0]; const T = sonda(m, -90); const kierR = [Math.cos(78 * R), Math.sin(78 * R), 0.02];
  const pt = add(T.hip.R, nrm(kierR), 24); const g = [pt[0] - 7, pt[1], pt[2]];
  const nogi = { R: prosta(T.hip.R, kierR, { pole: [-0.15, 1, 0], rot: 8 }), L: prosta(T.hip.L, [1, -0.02, -0.1], { pod: 70, rot: 8 }) };
  const rece = { R: { g: sieganie(T.sh.R, [g[0], g[1], 7]), pole: [-0.3, 0.2, 1] }, L: { g: sieganie(T.sh.L, [g[0], g[1], -7]), pole: [-0.3, 0.2, -1] } };
  return statyczna(RODZINA, cw, SP, (u) => ramka(u, { m, p: -90, head: -90, nogi, rece }));
}

/* ---------- leżenie bokiem (prawy bok na podłodze, klatka ku +z, głowa ku −x) ---------- */
const PYB = 23;
const bokRamka = (nogi, rece, ext = { roll: 90 }) => (u) => K({ u, m: [0, PYB, 0], p: -90, head: -90, roll: ext.roll, R: nogi.R, L: nogi.L, hr: rece.R, hl: rece.L });
/** Side-Lying Quad Stretch: leżenie na boku, górna noga (L) zgięta, pięta przy pośladku, trzymana ręką; dolna noga prosta. */
function sideQuad(cw) {
  const m = [0, PYB, 0]; const T = sonda(m, -90, { ext: { roll: 90 } });
  const aL = [T.hip.L[0] + 14, T.hip.L[1] + 1, T.hip.L[2] - 24]; const aR = [T.hip.R[0] + 82.6, 8, T.hip.R[2]];
  const nogi = { R: { a: aR, pod: null, rot: 10, pole: [0, 1, 0.3] }, L: { a: aL, pod: null, rot: 10, pole: [1, 0.1, 0.4] } };
  const rece = { R: { g: [T.sh.R[0] - 40, 6, 0], pole: [0, 0.3, 1] }, L: { g: sieganie(T.sh.L, aL), pole: [0, 0.4, -1] } };
  return statyczna(RODZINA, cw, SP, bokRamka(nogi, rece));
}


/* ---------- czworak: Cat-Cow ---------- */
/** Cat-Cow: klęk podparty (ręce pod barkami, kolana pod biodrami), ruch kręgosłupa: koci grzbiet (zgięcie +) → neutralnie → wygięcie w dół (zgięcie −); ręce proste. */
function catCow(cw) {
  const B = BODY(); const hx = 60; const Sy = 65.8; const Py = 8.8 + B.thigh;
  const fr = (u, bend, head) => {
    const chord = Math.cos(0.55 * bend * R); const phi = Math.asin((Sy - Py) / (B.trunk * chord)); const p = 90 - phi / R; const P = [hx - B.trunk * chord * Math.cos(phi), Py];
    const aK = (s) => { const f = fk([P[0], P[1], POL(s) * HIP()], [0, -1, 0], [Math.cos(165 * R), Math.sin(165 * R), 0]); return { a: [f.ankle[0], f.ankle[1], POL(s) * 10], pod: -90, rot: 10, pole: [0.15, -1, 0] }; };
    return K({ u, m: P, p, bend, head, R: aK('R'), L: aK('L'), hr: { g: [hx, 2, 19], pole: [-0.5, -1, 0.3] }, hl: { g: [hx, 2, -19], pole: [-0.5, -1, -0.3] } });
  };
  return poza(RODZINA, cw, SP, [fr(0, 26, 12), fr(0.5, 4, 40), fr(1, -16, 52)], []);
}

const BRAK = 'brak przeczytanego źródła pozycji tego ćwiczenia (figury-sens.json → mobility_floor: tylko reguła „poza nieruchoma” albo pozycja z analogii/konwencji); wyjątek bez animacji (decyzja właściciela 27.10.2026)';
export const WYJATKI = Object.fromEntries([
  'Intermediate Groin Stretch', 'Kneeling Forearm Stretch', 'Middle Back Stretch', "Runner's Stretch", 'Side Lying Groin Stretch', 'Upper Back Stretch',
  'Supine Figure-Four Stretch', 'Supine Spinal Twist', 'Seated Rotation Stretch', 'Downward Facing Balance',
].map((k) => [k, BRAK]));
WYJATKI['IT Band and Glute Stretch'] = 'obrót miednicy przy prostej nodze przełożonej w poprzek ciała nie mieści się w modelu jednocześnie z regułami podłogi (miednica leży, kolano po swojej stronie ciała, kształty nad podłogą) — 12 prób parametrów (obrót −12…−35°, wysokość miednicy 10…13 cm); wyjątek bez animacji, do ponownej próby po rozszerzeniu modelu';
WYJATKI['Peroneals Stretch'] = 'istota ćwiczenia (odwrócenie stopy z paskiem) nie jest stopniem swobody modelu, a pozycja nie ma przeczytanego źródła; wyjątek bez animacji (decyzja właściciela 26.10.2026 o ćwiczeniach bez widocznej istoty ruchu; 27.10.2026)';
WYJATKI['Posterior Tibialis Stretch'] = 'istota ćwiczenia (nawrócenie stopy z paskiem) nie jest stopniem swobody modelu, a pozycja nie ma przeczytanego źródła; wyjątek bez animacji (decyzja właściciela 26.10.2026 o ćwiczeniach bez widocznej istoty ruchu; 27.10.2026)';
WYJATKI['Downward Facing Balance'] = 'zestaw „open”: ćwiczenie na piłce gimnastycznej bez przeczytanego źródła pozycji; wyjątek bez animacji (decyzja właściciela 27.10.2026)';
export const PRZYBLIZENIA = {};
export function generuj() {
  const G = {
    ...Object.fromEntries(Object.keys(WYJATKI).map((k) => [k, () => { throw new Error('wyjątek'); }])),
    'The Straddle': () => straddle('The Straddle'),
    'Seated Calf Stretch': () => seatedCalf('Seated Calf Stretch'),
    'Seated Floor Hamstring Stretch': () => seatedHamstring('Seated Floor Hamstring Stretch'),
    'Butterfly Stretch': () => butterfly('Butterfly Stretch'),
    "Child's Pose": () => childsPose("Child's Pose"),
    'Kneeling Hip Flexor Stretch': () => hipFlexor('Kneeling Hip Flexor Stretch'),
    'Supine Hamstring Stretch': () => supineHamstring('Supine Hamstring Stretch'),
    'Side-Lying Quad Stretch': () => sideQuad('Side-Lying Quad Stretch'),
    'Cat-Cow': () => catCow('Cat-Cow'),
  };
  return G;
}
export const WYJATKI_OPISU = {};
