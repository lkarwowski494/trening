// Generator póz rodziny mobility_stand (27.10.2026): rozciąganie stojąc / siedząc / w ruchu. Pozy tylko tam, gdzie reguły sensu mają przeczytane źródła (data/zrodla/figury-sens.json → mobility_stand);
// pozostałe ćwiczenia rodziny to jawne wyjątki bez animacji z powodem (decyzja właściciela 27.10.2026, docs/53 bramka 1: nie wymyślamy póz bez źródła).
// Układ: x = przód, y = góra, z = prawa strona; pozy statyczne = dwie identyczne klatki. Liczby bez źródła (kąty, rozstawy) to uproszczenie ilustracyjne.
import { fkRamie } from './mob.mjs';
import { BODY, R, r1, PODLOGA, poza, HIP, lerp, ease, nrm, add, statyczna, Y_PODLOGA, kolanoIK, lokiecIK, sieganie, kostkaY, sonda, ramka, rekiDo, prosta, stoj, glowaSrodek } from './mob.mjs';

export const RODZINA = 'mobility_stand';
const SP = [PODLOGA(-170, 170)];
const POL = (s) => (s === 'R' ? 1 : -1);
const SD = ['R', 'L'];
const MY = 89.5; /* miednica stojącej osoby (kolana zgięte ok. 12°) */

/* ---------- siad ---------- */
/** Chin To Chest Stretch: siad ze skrzyżowanymi nogami (stopy razem), tułów pionowo, głowa pochylona do klatki, dłonie na tyle głowy (ciągną ją w dół). */
function chinToChest(cw) {
  const m = [0, Y_PODLOGA, 0]; const p = 0; const hp = 42; const T = sonda(m, p);
  const H = glowaSrodek(T.shoulderC, p, hp); const tyl = [-Math.cos(hp * R), Math.sin(hp * R)];
  const g = (s) => [H[0] + tyl[0] * 12, H[1] + tyl[1] * 12 + 4, POL(s) * 6];
  const nogi = { R: { a: [34, kostkaY(-12), 3.5], pod: -12, rot: 20, pole: [0, 0.15, 1] }, L: { a: [34, kostkaY(-12), -3.5], pod: -12, rot: 20, pole: [0, 0.15, -1] } };
  const rece = { R: { g: g('R'), pole: [0.3, 0.3, 1] }, L: { g: g('L'), pole: [0.3, 0.3, -1] } };
  return statyczna(RODZINA, cw, SP, (u) => ramka(u, { m, p, head: hp, nogi, rece }));
}

/* ---------- stanie ---------- */
/** Side Neck Stretch: stanie, głowa pochylona w bok (ucho ku prawemu barkowi, 25°), prawa dłoń na głowie (ciągnie ją w bok), lewa ręka luźno w dół. */
function sideNeck(cw) {
  const m = [0, MY, 0]; const p = 0; const T = sonda(m, p); const H = glowaSrodek(T.shoulderC, p, 0);
  const rece = { R: { g: sieganie(T.sh.R, [H[0], H[1] + 13, 8]), pole: [0, 0.6, 1] }, L: { g: sieganie(T.sh.L, [T.sh.L[0], T.sh.L[1] - 62, -6]), pole: [-0.2, -0.3, -1] } };
  return statyczna(RODZINA, cw, SP, (u) => ramka(u, { m, p, head: 0, nogi: stoj(0, 14), rece, ext: { headTilt: 25 } }));
}
/** Overhead Triceps Stretch: stanie, prawa ręka uniesiona i zgięta (dłoń za głową, łokieć nad barkiem), lewa dłoń na prawym łokciu. */
function overheadTriceps(cw) {
  const m = [0, MY, 0]; const p = 0; const T = sonda(m, p);
  const f = fkRamie(T.sh.R, [0.24, 0.97, 0.1], [-0.75, -0.55, -0.35]);
  const dolny = add(T.sh.R, nrm([0.24, 0.97, 0.1]), 10);
  const rece = { R: { g: f.g, pole: f.pole ?? [0, 1, 0.3] }, L: { g: sieganie(T.sh.L, [dolny[0], dolny[1], dolny[2] + 2]), pole: [0, -0.2, -1] } };
  return statyczna(RODZINA, cw, SP, (u) => ramka(u, { m, p, head: 0, nogi: stoj(0, 12), rece }));
}
/** Standing Chest Stretch: stanie, ręce wyprostowane za plecami (dłonie splecione), łokcie za linią barków, tułów prosto. */
function standingChest(cw) {
  const m = [0, MY, 0]; const p = 2; const T = sonda(m, p);
  const rece = rekiDo(T.sh, { R: [-26, 80, 3], L: [-26, 80, -3] }, { R: [-0.6, -0.4, 0.5], L: [-0.6, -0.4, -0.5] });
  return statyczna(RODZINA, cw, SP, (u) => ramka(u, { m, p, head: 0, nogi: stoj(0, 12), rece }));
}
/** Standing Gastrocnemius Calf Stretch: stanie, prawa pięta na stopniu, noga prosta, palce ku górze, tułów pochylony, dłonie na nodze; lewa noga lekko ugięta. */
function gastroc(cw) {
  const m = [-10, 88, 0]; const p = 45; const T = sonda(m, p); const pod = 60; const top = 12;
  const aR = prosta(T.hip.R, [0.58, -0.81, 0.03], { pod, rot: 6 }); aR.a[1] = r1(kostkaY(pod, top));
  const nogi = { R: aR, L: { a: [-8, 7, -14], pod: 0, rot: 10, pole: [1, 0, -0.1] } };
  const pt = add(T.hip.R, nrm([aR.a[0] - T.hip.R[0], aR.a[1] - T.hip.R[1], aR.a[2] - T.hip.R[2]]), 35);
  const rece = rekiDo(T.sh, { R: [pt[0], pt[1] + 4, 9], L: [pt[0], pt[1] + 4, 3] }, { R: [0, -0.2, 1], L: [0, -0.2, -1] });
  return statyczna(RODZINA, cw, [...SP, { rodzaj: 'skrzynia', x0: 28, x1: 82, top }], (u) => ramka(u, { m, p, head: 30, nogi, rece }));
}
/** Wykrok łydkowy: tylna noga (L) i przednia (R); tylna prosta (kolano ≤ 15°) albo lekko ugięta. */
function wykrokLydka({ wall, tylnaProsta }) {
  const p = wall ? 20 : 8; const m = wall ? [-7, 80, 0] : [-7, 79, 0]; const T = sonda(m, p);
  const aF = [25, 7, 10]; const aB = tylnaProsta ? prosta(T.hip.L, [-0.47, -0.88, -0.03], { pod: 0 }).a : [-16, 7, -10];
  aB[1] = 7;
  const nogi = { R: { a: aF, pod: 0, rot: 8, pole: [1, 0, 0.1] }, L: { a: aB, pod: 0, rot: 8, pole: [1, 0.1, -0.1] } };
  const rece = wall ? rekiDo(T.sh, { R: [72, 125, 19], L: [72, 125, -19] }, { R: [0, -0.5, 1], L: [0, -0.5, -1] }) : { R: { g: [T.hip.R[0] - 2, T.hip.R[1] + 8, 24], pole: [-0.6, -0.1, 1] }, L: { g: [T.hip.L[0] - 2, T.hip.L[1] + 8, -24], pole: [-0.6, -0.1, -1] } };
  return { m, p, nogi, rece };
}
/** Wall Calf Stretch: wykrok, dłonie na ścianie przed sobą (ręce proste), tylna noga prosta z piętą na podłodze, przednia ugięta. */
function wallCalf(cw) {
  const o = wykrokLydka({ wall: true, tylnaProsta: true });
  return statyczna(RODZINA, cw, [...SP, { rodzaj: 'sciana', x: 75, h: 250, przed: true }], (u) => ramka(u, { m: o.m, p: o.p, head: 12, nogi: o.nogi, rece: o.rece }));
}
/** Standing Soleus And Achilles Stretch: wykrok, oba kolana ugięte, tylna pięta na podłodze, dłonie na biodrach. */
function soleus(cw) {
  const o = wykrokLydka({ wall: false, tylnaProsta: false });
  return statyczna(RODZINA, cw, SP, (u) => ramka(u, { m: o.m, p: o.p, head: 4, nogi: o.nogi, rece: o.rece }));
}
/** Standing Lateral Stretch: stanie, skłon boczny w prawo (20°), lewa ręka nad głową, prawa wzdłuż ciała; bez skrętu i bez pochylenia do przodu. */
function lateral(cw) {
  const m = [0, MY, 0]; const p = 0; const ext = { lean: 20 }; const T = sonda(m, p, { ext });
  const rece = { R: { g: sieganie(T.sh.R, [T.sh.R[0], T.sh.R[1] - 62, T.sh.R[2] + 4]), pole: [-0.2, -0.3, 1] }, L: { g: sieganie(T.sh.L, [T.sh.L[0] + 14, T.sh.L[1] + 42, T.sh.L[2] + 44]), pole: [-0.3, 0.2, -1] } };
  return statyczna(RODZINA, cw, SP, (u) => ramka(u, { m, p, head: 0, nogi: stoj(0, 12), rece, ext }));
}

/* ---------- Inchworm: stanie w skłonie → marsz rąk do podporu → powrót ---------- */
function inchworm(cw) {
  const ANK = (u) => { const pod = lerp(0, -55, ease(u)); return { pod, y: kostkaY(pod) }; };
  const fr = (u) => {
    const e = ease(u); const phi = lerp(4, 70.5, e); const a = ANK(u); const L = 82.4;
    const P = [L * Math.sin(phi * R), a.y + L * Math.cos(phi * R)];
    const pLerp = lerp(125, phi, e); const pMin = Math.acos(Math.max(-1, Math.min(1, (62 - P[1]) / 50))) / R; const p = Math.max(pLerp, pMin);
    const T = sonda([P[0], P[1], 0], p);
    const hands = (s) => { const S = T.sh[s]; const dy = S[1] - 2; const dx = Math.sqrt(Math.max(0, 63.7 * 63.7 - dy * dy)); return { g: [S[0] + dx, 2, S[2]], pole: [-0.3, -0.5, POL(s) * 0.6] }; };
    const nogi = { R: { a: [0, a.y, 10], pod: a.pod, rot: 6, pole: [1, 0, 0.1] }, L: { a: [0, a.y, -10], pod: a.pod, rot: 6, pole: [1, 0, -0.1] } };
    return ramka(u, { m: [P[0], P[1], 0], p, head: p * 0.8, nogi, rece: { R: hands('R'), L: hands('L') } });
  };
  return poza(RODZINA, cw, SP, [0, 0.12, 0.25, 0.37, 0.5, 0.63, 0.75, 0.88, 1].map(fr), []);
}

const BRAK = 'brak przeczytanego źródła pozycji albo ruchu tego ćwiczenia (figury-sens.json → mobility_stand: tylko reguła „poza nieruchoma”, pozycja z analogii albo reguła z nazwy/konwencji); wyjątek bez animacji (decyzja właściciela 27.10.2026)';
export const WYJATKI = Object.fromEntries([
  'Chest And Front Of Shoulder Stretch', 'Chest Stretch on Stability Ball', 'Cross-Body Shoulder Stretch', 'One Knee To Chest', 'Overhead Stretch', 'Standing Toe Touches',
  'Standing Biceps Stretch', 'Standing Elevated Quad Stretch', 'Wall Lat Stretch',
  'Leg Swings (Front-to-Back)', 'Leg Swings (Side-to-Side)', 'Lying Leg Crossover Swings', 'Ankle Circles', 'Knee Circles', 'Standing Hip Circles', 'Arm Circles',
  'Round The World Shoulder Stretch', 'Dynamic Chest Stretch', 'Shoulder Circles', 'Torso Rotation', 'Iron Crosses (Stretch)', 'Wrist Circles',
  'Dynamic Back Stretch', 'Groiners', 'Hip Circles (Prone)', "World's Greatest Stretch",
].map((k) => [k, BRAK]));
WYJATKI['Standing Pelvic Tilt'] = 'ruch wewnętrzny (przechył miednicy w płaszczyźnie strzałkowej) bez widocznej zmiany pozy szkieletu, a ćwiczenie bez przeczytanego źródła; wyjątek bez animacji (decyzja właściciela 26.10.2026 o ćwiczeniach bez widocznej istoty ruchu; 27.10.2026)';
export const PRZYBLIZENIA = {
  'Chin To Chest Stretch': 'przybliżenie: siad ze skrzyżowanymi nogami (stopy razem); katalog: „siad, dłonie ciągną głowę w dół”',
  'Standing Gastrocnemius Calf Stretch': 'przybliżenie: dłonie na wyprostowanej nodze zamiast na palcach stopy (zasięg ręki nie sięga palców przy prostych plecach)',
};
export function generuj() {
  return {
    ...Object.fromEntries(Object.keys(WYJATKI).map((k) => [k, () => { throw new Error('wyjątek'); }])),
    'Chin To Chest Stretch': () => chinToChest('Chin To Chest Stretch'),
    'Side Neck Stretch': () => sideNeck('Side Neck Stretch'),
    'Overhead Triceps Stretch': () => overheadTriceps('Overhead Triceps Stretch'),
    'Standing Chest Stretch': () => standingChest('Standing Chest Stretch'),
    'Standing Gastrocnemius Calf Stretch': () => gastroc('Standing Gastrocnemius Calf Stretch'),
    'Wall Calf Stretch': () => wallCalf('Wall Calf Stretch'),
    'Standing Soleus And Achilles Stretch': () => soleus('Standing Soleus And Achilles Stretch'),
    'Standing Lateral Stretch': () => lateral('Standing Lateral Stretch'),
    Inchworm: () => inchworm('Inchworm'),
  };
}
export const WYJATKI_OPISU = {};
