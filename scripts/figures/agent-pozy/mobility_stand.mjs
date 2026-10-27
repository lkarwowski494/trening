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

/* ---------- stanie, szyja ---------- */
/** Ręce zwisają wzdłuż ciała (ACE #204 i #202, krok 1: „arms by your sides”): dłonie prawie prosto w dół od barków, tuż przy udach. */
const rekiWzdluz = (T) => ({ R: { g: sieganie(T.sh.R, [T.sh.R[0] + 1, T.sh.R[1] - 63.5, T.sh.R[2] + 3], 64), pole: [-0.2, -0.3, 1] }, L: { g: sieganie(T.sh.L, [T.sh.L[0] + 1, T.sh.L[1] - 63.5, T.sh.L[2] - 3], 64), pole: [-0.2, -0.3, -1] } });
/** Chin To Chest Stretch (ACE #204 Neck Flexion: stanie, stopy na szerokość bioder, ręce wzdłuż ciała, „drop your chin toward your chest”): tułów pionowo, sam skłon głowy do przodu, bez rąk na głowie (wariant z dłonią to osobny, lekki nacisk — nie rysujemy). */
function chinToChest(cw) {
  const m = [0, MY, 0]; const p = 0; const T = sonda(m, p);
  return statyczna(RODZINA, cw, SP, (u) => ramka(u, { m, p, head: 45, nogi: stoj(0, 12), rece: rekiWzdluz(T) }));
}

/* ---------- stanie ---------- */
/** Side Neck Stretch (ACE #202 Lateral Neck Flexion: stanie, ręce wzdłuż ciała, „draw your right ear toward your right shoulder”): tułów pionowo, głowa pochylona w bok o 25°, ręce bez udziału (wariant z dłonią na głowie to osobny, lekki nacisk — nie rysujemy). */
function sideNeck(cw) {
  const m = [0, MY, 0]; const p = 0; const T = sonda(m, p);
  return statyczna(RODZINA, cw, SP, (u) => ramka(u, { m, p, head: 0, nogi: stoj(0, 12), rece: rekiWzdluz(T), ext: { headTilt: 25 } }));
}
/** Overhead Triceps Stretch (ACE #174: stanie, stopy na szerokość bioder; prawa ręka w górę, łokieć zgięty, dłoń opada na plecy za głową): łokieć nad barkiem, dłoń za szyją na górze pleców (zasięg ręki modelu).
 * Ręka pomocnicza (lewa, lekki nacisk na ramieniu tuż przy łokciu) NIE jest rysowana: dosięgnięcie prawego łokcia nad głową wymaga barku powyżej zakresu modelu (171°) albo przejścia przez głowę — lewa ręka zwisa wzdłuż ciała (PRZYBLIZENIA). */
function overheadTriceps(cw) {
  const m = [0, MY, 0]; const p = 0; const T = sonda(m, p);
  const gR = [-12, 144, 5]; const poleR = [0.6, 1, 0.3];
  const rece = { R: { g: gR, pole: poleR }, L: rekiWzdluz(T).L };
  return statyczna(RODZINA, cw, SP, (u) => ramka(u, { m, p, head: 15, nogi: stoj(0, 12), rece }));
}
/** Standing Chest Stretch: stanie, ręce wyprostowane za plecami (dłonie splecione), łokcie za linią barków, tułów prosto. */
function standingChest(cw) {
  const m = [0, MY, 0]; const p = 2; const T = sonda(m, p);
  const rece = rekiDo(T.sh, { R: [-26, 80, 3], L: [-26, 80, -3] }, { R: [-0.6, -0.4, 0.5], L: [-0.6, -0.4, -0.5] });
  return statyczna(RODZINA, cw, SP, (u) => ramka(u, { m, p, head: 0, nogi: stoj(0, 12), rece }));
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
/** Wall Calf Stretch (ACE #152 Standing Dorsi-Flexion Calf Stretch: twarzą do ściany, dłonie na ścianie nieco powyżej barków, rozkrok, OBIE stopy płasko, tylna noga prosta z piętą dociśniętą do podłogi, przednie kolano zgięte): wykrok, dłonie na ścianie przed sobą (ręce proste), tylna noga prosta z piętą na podłodze, przednia ugięta. */
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

/* ---------- Inchworm: wymiary ruchu w układzie dłoni ---------- */
/** Inchworm (ACE #254): skłon z dłońmi na podłodze → marsz rąk do podporu → wejście stopami do dłoni. Pętla odtwarza ruch tam i z powrotem (ping-pong), więc rysujemy go w układzie DŁONI: dłonie stoją w miejscu (x = INCH_H), a stopy dochodzą do nich krokami
 * (krok 12,5–25 cm w źródle; tu 4 kroki po ok. 19 cm). u = 0: podpór (dłonie daleko), u = 1: skłon (stopy przy dłoniach). Ruch wstecz (u: 1 → 0) to marsz stóp do tyłu, czyli względem ciała ten sam ruch co „marsz rąk do podporu” ze źródła.
 * Podpory nie ślizgają się: dłonie nie ruszają się wcale, palce stóp stoją w miejscu między krokami (stopa obraca się wokół palców), a w kroku stopa jest uniesiona (INCH_LIFT). Marsz rąk i stóp naprzemiennie (jedna kończyna naraz) to UPROSZCZENIE: obie stopy idą razem. */
export const INCH_H = 150; export const INCH_KROKI = 5; export const INCH_LIFT = 5;
function inchworm(cw) {
  /* 11 klatek (limit kontraktu: 12): parzyste = stopy stoją po k krokach, nieparzyste = środek kroku z uniesionymi stopami */
  const fr = (i) => {
    const u = i / (2 * INCH_KROKI); const post = i / (2 * INCH_KROKI); const lift = i % 2 ? INCH_LIFT : 0; /* post: 0 = podpór, 1 = skłon */
    const e = 1 - post; const ee = ease(e);
    const phi = lerp(4, 70.5, ee); const pod = lerp(0, -55, ee); const L = 82.4; const fp = pod * R; const yaw = 6 * R;
    const ay = kostkaY(pod); const ax = -(19 * Math.cos(fp) + 7 * Math.sin(fp)) * Math.cos(yaw); /* palce w x = 0 (potem przesunięcie) */
    const P = [ax + L * Math.sin(phi * R), ay + lift + L * Math.cos(phi * R)];
    const pLerp = lerp(125, phi, ee); const pMin = Math.acos(Math.max(-1, Math.min(1, (64 - P[1]) / 50))) / R; const p = Math.max(pLerp, pMin);
    const T = sonda([P[0], P[1], 0], p);
    const hands = (s) => { const S = T.sh[s]; const dy = S[1] - 2; const dx = Math.sqrt(Math.max(0, 63.7 * 63.7 - dy * dy)); return { g: [S[0] + dx, 2, S[2]], pole: [-0.3, -0.5, POL(s) * 0.6] }; };
    const hr = hands('R'); const hl = hands('L'); const sh = INCH_H - hr.g[0]; /* przesunięcie świata: dłonie zawsze w INCH_H */
    const mv = (v) => [r1(v[0] + sh), v[1], v[2]];
    const nogi = { R: { a: mv([ax, ay + lift, 10]), pod, rot: 6, pole: [1, 0, 0.1] }, L: { a: mv([ax, ay + lift, -10]), pod, rot: 6, pole: [1, 0, -0.1] } };
    return ramka(u, { m: mv([P[0], P[1], 0]), p, head: p * 0.8, nogi, rece: { R: { g: mv(hr.g), pole: hr.pole }, L: { g: mv(hl.g), pole: hl.pole } } });
  };
  return poza(RODZINA, cw, SP, Array.from({ length: 2 * INCH_KROKI + 1 }, (_, i) => fr(i)), []);
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
  'Standing Gastrocnemius Calf Stretch': 'poza ze źródła (ACE #152 Standing Dorsi-Flexion: przy ścianie, tylna noga prosta, pięta na podłodze) — taka sama jak Wall Calf Stretch; wariant z piętą na podwyższeniu i palcami w górę (podpowiedź katalogu) nie ma przeczytanego źródła i nie jest rysowany',
  'Overhead Triceps Stretch': 'przybliżenie: bez ręki pomocniczej (ACE #174: lewa dłoń na ramieniu przy łokciu, lekki nacisk) — dosięgnięcie łokcia nad głową wymaga barku powyżej zakresu modelu (171°) albo przejścia ręki przez głowę; lewa ręka zwisa; dłoń prawa na górze pleców za szyją (zasięg ręki), nie „na środku pleców”',
  Inchworm: 'uproszczenie: rysunek w układzie dłoni (dłonie stoją, stopy dochodzą do nich krokami po ok. 15 cm, obie stopy naraz, ACE #254 krok 5; ruch wstecz to marsz stóp do tyłu = względem ciała marsz rąk do podporu); pompka w podporze (krok 3) pominięta',
};
export function generuj() {
  return {
    ...Object.fromEntries(Object.keys(WYJATKI).map((k) => [k, () => { throw new Error('wyjątek'); }])),
    'Chin To Chest Stretch': () => chinToChest('Chin To Chest Stretch'),
    'Side Neck Stretch': () => sideNeck('Side Neck Stretch'),
    'Overhead Triceps Stretch': () => overheadTriceps('Overhead Triceps Stretch'),
    'Standing Chest Stretch': () => standingChest('Standing Chest Stretch'),
    'Standing Gastrocnemius Calf Stretch': () => wallCalf('Standing Gastrocnemius Calf Stretch'),
    'Wall Calf Stretch': () => wallCalf('Wall Calf Stretch'),
    'Standing Soleus And Achilles Stretch': () => soleus('Standing Soleus And Achilles Stretch'),
    'Standing Lateral Stretch': () => lateral('Standing Lateral Stretch'),
    Inchworm: () => inchworm('Inchworm'),
  };
}
export const WYJATKI_OPISU = {};
