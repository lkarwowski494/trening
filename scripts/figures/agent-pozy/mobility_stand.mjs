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

/* ---------- Inchworm: marsz rąk w układzie stóp ---------- */
/** Inchworm (ACE #254): skłon z dłońmi na podłodze → marsz rąk do podporu → marsz stóp do dłoni. Pętla odtwarza ruch tam i z powrotem (ping-pong): u = 0 podpór (dłonie daleko), u = 1 skłon (dłonie przy stopach).
 * Rysujemy go w układzie STÓP: palce stóp stoją w miejscu (obrót stopy wokół palców, pięta unosi się w podporze), a dłonie idą NAPRZEMIENNIE (R, L, R, L, R, L: po INCH_KROKI kroków każda, krok ≈ 22 cm ≈ 9", w zakresie źródła 6–12"): w każdej chwili co najmniej jedna
 * dłoń stoi na podłodze, dłoń w kroku jest uniesiona o INCH_LIFT, a jej położenie tylko maleje (u rośnie): bez poślizgu i bez kroku wstecz. Względem ciała to ten sam ruch co marsz stóp do dłoni (krok 5: „…taking 6-12" steps without moving your hands”).
 * Dlaczego nie naprzemienne stopy: przy nogach prawie prostych (kolano ≤ 25°) odległość biodro–kostka obu nóg może się różnić o ok. 1,4 cm, więc rozstaw stóp w x wynosi najwyżej 1,5 cm w podporze i ok. 8 cm w skłonie (nie 15–30 cm ze źródła); ruch stóp pokazuje ten sam rysunek co ruch rąk.
 * Ciało (miednica, tułów) podąża za środkiem między dłońmi: ręce są prawie pionowe, więc dłoń może odejść od barku w x najwyżej o ok. 16 cm (ramię 64 cm, bark nad podłogą 62 cm) — rozstaw dłoni ≈ 22 cm mieści się jako ±11 cm. Pompka w podporze (ACE #254, krok 4: „Perform one full push-up…”) jest pominięta (uproszczenie, PRZYBLIZENIA). */
export const INCH_KROKI = 4; export const INCH_LIFT = 5; export const INCH_TULOW_KONIEC = 120; const INCH_BARK_Y = 64; /* wysokość barków nad podłogą (ręka 64 cm: zapas na zgięcie łokcia przy kroku) */
const INCH_ZASIEG = 62; /* odległość bark–dłoń przy dłoniach pod środkiem (stoją prawie proste) */
/** Ułożenie ciała dla postępu `post` (0 = podpór, 1 = skłon) w układzie stóp: palce stóp w x = 0, ręka prosta do podłogi. */
function inchTelo(post) {
  const ee = ease(1 - post); const phi = lerp(4, 70.5, ee); const pod = lerp(0, -55, ee); const L = 82.4; const fp = pod * R; const yaw = 6 * R;
  const ay = kostkaY(pod); const ax = -(19 * Math.cos(fp) + 7 * Math.sin(fp)) * Math.cos(yaw);
  const P = [ax + L * Math.sin(phi * R), ay + L * Math.cos(phi * R)];
  const pLerp = lerp(INCH_TULOW_KONIEC, phi, ee); const pMin = Math.acos(Math.max(-1, Math.min(1, (INCH_BARK_Y - P[1]) / 50))) / R; const p = Math.max(pLerp, pMin);
  const T = sonda([P[0], P[1], 0], p);
  const hands = (sd) => { const S = T.sh[sd]; const dy = S[1] - 2; const dx = Math.sqrt(Math.max(0, INCH_ZASIEG * INCH_ZASIEG - dy * dy)); return { g: [S[0] + dx, 2, S[2]], pole: [-1, 0, POL(sd) * 0.3] }; };
  return { pod, ay, ax, P, p, hr: hands('R'), hl: hands('L') };
}
/** Położenie dłoni (x w układzie stóp) jako obwiednia malejąca postępu: do odwracania (x dłoni → postęp). */
const INCH_TAB = (() => { let m = 1e9; return Array.from({ length: 401 }, (_, k) => { m = Math.min(m, inchTelo(k / 400).hr.g[0]); return m; }); })();
export const INCH_X0 = INCH_TAB[0]; export const INCH_KROK = (INCH_TAB[0] - INCH_TAB[400]) / INCH_KROKI;
const inchPostDla = (x) => { let lo = 0, hi = 400; while (lo < hi) { const mid = (lo + hi) >> 1; if (INCH_TAB[mid] > x) lo = mid + 1; else hi = mid; } return Math.min(1, lo / 400); };
const inchFrames = 2 * 2 * INCH_KROKI + 1; /* 17: dłonie stoją po k krokach (parzyste), środek kroku z uniesioną jedną dłonią (nieparzyste) */
function inchworm(cw) {
  const fr = (i) => {
    const etap = Math.ceil(i / 2); const wKroku = i % 2 === 1; const ruch = wKroku ? (etap % 2 === 1 ? 'R' : 'L') : null; /* etap nieparzysty: krok prawej dłoni, parzysty: lewej */
    const kroki = (sd, e) => (sd === 'R' ? Math.ceil(e / 2) : Math.floor(e / 2));
    const x = {}; const lift = {};
    for (const sd of SD) { const n = kroki(sd, wKroku ? etap - 1 : etap) + (sd === ruch ? 0.5 : 0); x[sd] = INCH_X0 - n * INCH_KROK; lift[sd] = sd === ruch ? INCH_LIFT : 0; }
    const B = inchTelo(inchPostDla((x.R + x.L) / 2)); /* ciało podąża za środkiem między dłońmi (każda ±11 cm od barku: ręce prawie proste, nigdy poza zasięgiem) */
    const rece = {}; for (const sd of SD) { const g = sd === 'R' ? B.hr : B.hl; rece[sd] = { g: [r1(x[sd]), r1(g.g[1] + lift[sd]), g.g[2]], pole: g.pole }; }
    const nogi = { R: { a: [r1(B.ax), r1(B.ay), 10], pod: B.pod, rot: 6, pole: [1, 0, 0.1] }, L: { a: [r1(B.ax), r1(B.ay), -10], pod: B.pod, rot: 6, pole: [1, 0, -0.1] } };
    return ramka(i / (inchFrames - 1), { m: [r1(B.P[0]), B.P[1], 0], p: B.p, head: B.p * 0.8, nogi, rece });
  };
  return poza(RODZINA, cw, SP, Array.from({ length: inchFrames }, (_, i) => fr(i)), []);
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
  'Overhead Triceps Stretch': 'przybliżenie: krok 1 źródła (ACE #174) zawiera rękę pomocniczą (lewa dłoń na prawym ramieniu „just above the elbow”, lekki nacisk), rysunek ją pomija — dosięgnięcie łokcia nad głową wymaga barku L 192° (limit modelu 171°) albo przedramienia przechodzącego ≈ 3 cm przez głowę (pomiar 27.10.2026); lewa ręka zwisa; dłoń prawa na górze pleców za szyją (zasięg ręki), nie „na środku pleców” (źródło: „middle of your back”)',
  Inchworm: 'uproszczenie: rysunek w układzie STÓP (stopy stoją, dłonie idą naprzemiennie po ok. 22 cm ≈ 9" — ACE #254 krok 5 mówi o krokach stóp po 6–12" bez ruchu rąk: „…taking 6-12" steps without moving your hands”; względem ciała ruch ten sam); naprzemienne stopy przy kolanach ≤ 25° (źródło: „extended (but not locked)”) nie mieszczą się w modelu: rozstaw stóp w x najwyżej ≈ 1,5 cm w podporze i ≈ 8 cm w skłonie przy kroku źródła 15–30 cm (pomiar 27.10.2026); pompka w podporze pominięta (ACE #254, krok 4: „Perform one full push-up…”)',
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
