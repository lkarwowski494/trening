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
/** Overhead Triceps Stretch (ACE #174, krok 1: stanie, stopy na szerokość bioder; prawa ręka w górę, łokieć zgięty, dłoń opada za głowę, lewa dłoń na prawym ramieniu tuż nad łokciem, lekki nacisk): łokieć nad barkiem, dłoń za szyją na górze pleców (zasięg ręki modelu).
 * Ręka pomocnicza (lewa) jest częścią kroku 1 źródła, ale NIE jest rysowana — próba 27.10.2026: lewa dłoń na prawym ramieniu (7,2 cm od łokcia) wymaga albo barku L 192° (limit modelu 171°; najlepsze ułożenie łokcia za głową), albo przedramienia przechodzącego przez głowę
 * (łokieć L nie może wyjść nad czubek głowy: ramię 31 cm od barku daje y ≤ 170,5, a głowa sięga y = 170,4; przedramię leży ≈ 3 cm w głowie). Lewa ręka zwisa wzdłuż ciała (PRZYBLIZENIA). */
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
  const p = wall ? 22 : 8; const m = wall ? [-1, 80, 0] : [-7, 79, 0]; const T = sonda(m, p);
  const aF = [25, 7, 10]; const aB = tylnaProsta ? prosta(T.hip.L, [-0.47, -0.88, -0.03], { pod: 0 }).a : [-16, 7, -10];
  aB[1] = 7;
  const nogi = { R: { a: aF, pod: 0, rot: 8, pole: [1, 0, 0.1] }, L: { a: aB, pod: 0, rot: 8, pole: [1, 0.1, -0.1] } };
  const rece = wall ? rekiDo(T.sh, { R: [72, 132, 19], L: [72, 132, -19] }, { R: [0, -0.5, 1], L: [0, -0.5, -1] }) : { R: { g: [T.hip.R[0] - 2, T.hip.R[1] + 8, 24], pole: [-0.6, -0.1, 1] }, L: { g: [T.hip.L[0] - 2, T.hip.L[1] + 8, -24], pole: [-0.6, -0.1, -1] } };
  return { m, p, nogi, rece };
}
/** Wall Calf Stretch (ACE #152 Standing Dorsi-Flexion Calf Stretch: twarzą do ściany, dłonie na ścianie nieco powyżej barków, rozkrok, OBIE stopy płasko, tylna noga prosta z piętą dociśniętą do podłogi, przednie kolano zgięte): wykrok, dłonie na ścianie przed sobą (łokcie zgięte ok. 63°: „allowing your elbows to bend as you shift your weight forward”, krok 2), tylna noga prosta z piętą na podłodze, przednia ugięta. */
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

const BRAK = 'brak przeczytanego źródła pozycji albo ruchu tego ćwiczenia (figury-sens.json → mobility_stand: tylko reguła „poza nieruchoma”, pozycja z analogii albo reguła z nazwy/konwencji); wyjątek bez animacji (decyzja właściciela 27.10.2026)';
export const WYJATKI = Object.fromEntries([
  'Chest And Front Of Shoulder Stretch', 'Chest Stretch on Stability Ball', 'Cross-Body Shoulder Stretch', 'One Knee To Chest', 'Overhead Stretch', 'Standing Toe Touches',
  'Standing Biceps Stretch', 'Standing Elevated Quad Stretch', 'Wall Lat Stretch',
  'Leg Swings (Front-to-Back)', 'Leg Swings (Side-to-Side)', 'Lying Leg Crossover Swings', 'Ankle Circles', 'Knee Circles', 'Standing Hip Circles', 'Arm Circles',
  'Round The World Shoulder Stretch', 'Dynamic Chest Stretch', 'Shoulder Circles', 'Torso Rotation', 'Iron Crosses (Stretch)', 'Wrist Circles',
  'Dynamic Back Stretch', 'Groiners', 'Hip Circles (Prone)', "World's Greatest Stretch",
].map((k) => [k, BRAK]));
WYJATKI['Standing Pelvic Tilt'] = 'ruch wewnętrzny (przechył miednicy w płaszczyźnie strzałkowej) bez widocznej zmiany pozy szkieletu, a ćwiczenie bez przeczytanego źródła; wyjątek bez animacji (decyzja właściciela 26.10.2026 o ćwiczeniach bez widocznej istoty ruchu; 27.10.2026)';
WYJATKI.Inchworm = 'źródło (ACE #254, krok 5) opisuje dojście STOPAMI do nieruchomych dłoni (kroki 6–12"), a model przy kolanach prawie prostych (≤ 25°, „extended (but not locked)”) nie pozwala narysować kroku stóp 15–30 cm (pomiar: rozstaw stóp w x najwyżej ok. 1,5 cm w podporze i ok. 8 cm w skłonie); wariant z dłońmi idącymi od stóp jest odwrotnością źródła (recenzja ponowna mobilności r3); ćwiczenie bez rysunku zgodnego z przeczytanym źródłem — wyjątek bez animacji (reguła właściciela 27.10.2026)';
export const PRZYBLIZENIA = {
  'Standing Gastrocnemius Calf Stretch': 'poza ze źródła (ACE #152 Standing Dorsi-Flexion: przy ścianie, tylna noga prosta, pięta na podłodze) — taka sama jak Wall Calf Stretch; wariant z piętą na podwyższeniu i palcami w górę (podpowiedź katalogu) nie ma przeczytanego źródła i nie jest rysowany',
  'Overhead Triceps Stretch': 'przybliżenie: krok 1 źródła (ACE #174) zawiera rękę pomocniczą (lewa dłoń na prawym ramieniu „just above the elbow”, lekki nacisk), rysunek ją pomija — dosięgnięcie łokcia nad głową wymaga barku L 192° (limit modelu 171°) albo przedramienia przechodzącego ≈ 3 cm przez głowę (pomiar 27.10.2026); lewa ręka zwisa; dłoń prawa na górze pleców za szyją (zasięg ręki), nie „na środku pleców” (źródło: „middle of your back”)',
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
  };
}
export const WYJATKI_OPISU = {};
