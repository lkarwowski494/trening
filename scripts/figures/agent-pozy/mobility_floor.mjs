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
/** Seated Calf Stretch (ACE #214: siad, obie nogi proste przed sobą, tułów pionowo; guma oporowa owinięta wokół podeszwy jednej stopy, końce w dłoniach; palce ku sobie, pięta od siebie): stopa pionowo (zgięcie grzbietowe ≈ 0°, maks. podbicie modelu 90°), guma od podeszwy prawej stopy do obu dłoni przy klatce. */
function seatedCalf(cw) {
  const m = [0, Y, 0]; const p = 8; const T = sonda(m, p);
  const nogi = {}; for (const s of SD) nogi[s] = prosta(T.hip[s], [1, -0.02, POL(s) * 0.1], { pod: 90, rot: 6 });
  const rece = rekiDo(T.sh, { R: [30, 40, 9], L: [30, 40, -9] }, { R: [0, -0.5, 1], L: [0, -0.5, -1] });
  const A = nogi.R.a; const guma = { rodzaj: 'guma', mocowanie: 'zaczep', x: r1(A[0] + 6.5), y: r1(A[1] + 6), z: r1(A[2]) };
  return statyczna(RODZINA, cw, [...SP, guma], (u) => ramka(u, { m, p, head: 6, nogi, rece }));
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
/** Child's Pose (ACE #227: klęk, kolana szeroko, palce za sobą (stopy wyprostowane podeszwowo, grzbietem do podłogi), pośladki do pięt, klatka między udami, czoło na podłodze; krok 4: ręce wzdłuż ciała, dłonie do góry):
 * pośladki na piętach (środek miednicy 12,6 cm od pięty = styk), kolana zgięte biernie ok. 156° (model: wyjątek `kneeMax`, limit CONTRACT.kneePassiveMaxDeg), biodro zgięte ≈ 139°, czoło na podłodze, ręce wzdłuż ciała (dłonie przy biodrach).
 * Stopa leży grzbietem na podłodze (podbicie 180° + a: palce do tyłu i w dół o a°; tak samo jak tylna stopa przysiadu bułgarskiego). */
const CP_A = 28; /* nachylenie osi stopy leżącej grzbietem (palce opadają o tyle stopni; kostka ≈ 5 cm nad podłogą, czubek palców ≈ 2 cm) */
function childsPose(cw) {
  const m = [2, 26, 0]; const p = 100; const T = sonda(m, p); const pod = 180 + CP_A; const ay = 6;
  const nogi = {}; for (const s of SD) nogi[s] = { a: [0, ay, POL(s) * 6], pod, rot: 6, pole: [1, -0.5, POL(s) * 0.6] };
  const neckY = T.shoulderC[1] + 4 * Math.cos(p * R); const hp = Math.acos(Math.max(-1, Math.min(1, (9.8 - neckY) / 18))) / R; /* środek głowy tuż nad podłogą: czoło na podłodze */
  const rece = rekiDo(T.sh, { R: [-2, 3, 22], L: [-2, 3, -22] }, { R: [0, 0.3, 1], L: [0, 0.3, -1] });
  return statyczna(RODZINA, cw, SP, (u) => ramka(u, { m, p, head: r1(hp), nogi, rece }));
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
/** Supine Hamstring Stretch (AAOS Hip Conditioning: leżenie na plecach, jedna noga uniesiona i wyprostowana, dłonie splecione z tyłu uda, nie na stawie kolanowym, noga przyciągana ku głowie; druga stopa na podłodze z kolanem zgiętym; ACE #235 — wariant z nogą o ścianę — nie rysujemy):
 * noga R prosta w górę (biodro ≈ 90°), dłonie obok siebie na tylnej stronie uda (ok. 12 cm od kolana), noga L zgięta, stopa płasko na podłodze. */
function supineHamstring(cw) {
  const m = [0, Y, 0]; const T = sonda(m, -90); const el = 88; const kierR = [Math.cos(el * R), Math.sin(el * R), 0.02];
  const pt = add(T.hip.R, nrm(kierR), 28); const tyl = [Math.sin(el * R), -Math.cos(el * R)]; const g = (z) => [pt[0] + tyl[0] * 12.5, pt[1] + tyl[1] * 12.5, z];
  const nogi = { R: prosta(T.hip.R, kierR, { pole: [-0.15, 1, 0], rot: 8 }), L: { a: [36, 7, -12], pod: 0, rot: 8, pole: [0, 1, -0.3] } };
  const rece = { R: { g: sieganie(T.sh.R, g(11.5)), pole: [-0.3, 0.2, 1] }, L: { g: sieganie(T.sh.L, g(5.5)), pole: [-0.3, 0.2, -1] } };
  return statyczna(RODZINA, cw, SP, (u) => ramka(u, { m, p: -90, head: -90, nogi, rece }));
}

/* ---------- leżenie bokiem (LEWY bok na podłodze, klatka ku −z (od kamery), głowa ku −x; górna noga R jest po stronie kamery) ---------- */
const PYB = 20; /* środek miednicy: obrys tułowia i spodenek ≤ 2 cm nad podłogą (reguła „ciało leży”, R9) */
const SQ_ROLL = -75; /* ODSTĘPSTWO OD ŹRÓDŁA wymuszone ograniczeniem rysunku (wpis w PRZYBLIZENIA, kontrola L4): obrót tułowia −90 = dokładnie na boku (biodra i barki jedno nad drugim, ACE #149); −75 = tułów odchylony do tyłu o 15°. Dolny bark leży wtedy wyżej niż dolna krawędź obrysu tułowia (grubość pleców), więc ramię nie wchodzi pod podłogę, a tułów leży (przy −90 bark 4 cm nad podłogą i tułów 4 cm nad nią albo ramię pod podłogą) */
const SQ_LEAN = 2; /* przechył tułowia w płaszczyźnie czołowej (stopnie): bark (głowa) wyżej o ok. 1,7 cm niż miednica (lekkie zgięcie boczne kręgosłupa, głowa na ręce) */
const SQ_HEAD_TILT = -20; /* skłon boczny głowy ku dolnemu barkowi (przechylGlowy, − = ucho ku lewemu barkowi): głowa opada na dłoń leżącą na podłodze (r6: dolna ręka leży, więc głowa musi zejść o ok. 6 cm; bez skłonu zawisała nad ręką) */
const bokRamka = (nogi, rece, ext = { roll: SQ_ROLL, lean: SQ_LEAN, headTilt: SQ_HEAD_TILT }) => (u) => { const k = K({ u, m: [0, PYB, 0], p: -90, head: -90, roll: ext.roll, lean: ext.lean, R: nogi.R, L: nogi.L, hr: rece.R, hl: rece.L }); if (ext.headTilt !== undefined) k.przechylGlowy = ext.headTilt; return k; };
/** Side-Lying Quad Stretch (ACE #149: leżenie na boku, biodra i barki jedno nad drugim, dolna ręka zgięta, przedramię pod głową; górne kolano zgięte, pięta ku pośladkowi: „Bend your left knee and pull your left heel up towards your left glute…”, „keeping the left thigh and knee resting on the inside of the right thigh and pointing straight out from the left hip joint”; dolna noga prosta tylko w pozycji wyjściowej: „with your legs extended straight away from your body”):
 * leżymy na LEWYM boku (klatka ku −z, od kamery, tułów odchylony do tyłu o 15°), górna (prawa) noga: udo w linii tułowia (biodro ≈ 13°, udo spoczywa na dolnym udzie), kolano zgięte ok. 140° (granica modelu) ku tyłowi ciała (+z, do kamery),
 * dłoń górnej ręki (zza pleców) przy kostce (1,3 cm; środek dłoni na odcinku bark–kostka, sięg ręki ≈ 63 cm); dolna ręka zgięta, przedramię pod głową (głowa na przedramieniu, styk), dolna stopa wzdłuż podłogi (stopa na zewnętrznej krawędzi: nie w osi widoku). */
const SQ_PSI = 40; const SQ_POD = 45;
function sideQuad(cw) {
  const m = [0, PYB, 0]; const T = sonda(m, -90, { ext: { roll: SQ_ROLL, lean: SQ_LEAN } }); const H = T.hip.R; const B = BODY();
  const th = 5 * R; const d1 = [Math.cos(th), -Math.sin(th), 0]; const K1 = add(H, d1, B.thigh);
  const kf = 40 * R; /* kąt wewnętrzny kolana (zgięcie 140°); goleń zawraca ku tyłowi ciała (+z) */
  const psi = SQ_PSI * R; /* płaszczyzna zgięcia kolana: ku tyłowi ciała (+z) i w górę (+y) */
  const aR = add(K1, [-d1[0] * Math.cos(kf), -d1[1] * Math.cos(kf) + Math.sin(kf) * Math.sin(psi), Math.sin(kf) * Math.cos(psi)], B.shank).map(r1);
  const mid = [(H[0] + aR[0]) / 2, (H[1] + aR[1]) / 2, (H[2] + aR[2]) / 2]; const pole = nrm([K1[0] - mid[0], K1[1] - mid[1], K1[2] - mid[2]]).map((x) => r1(x * 100) / 100);
  const aL = [T.hip.L[0] + 82.6, 7.2, T.hip.L[2]]; /* dolna noga leży: udo i goleń ≤ 3 cm nad podłogą (R9: lezyBokNogaCm), kolano wypchnięte w głąb (−z), nie w górę */
  const nogi = { R: { a: aR, pod: SQ_POD, rot: 0, pole }, L: { a: aL, pod: 0, rot: 60, pole: [0, 0, -1] } };
  const rece = { R: { g: sieganie(T.sh.R, aR), pole: [0, 1, 0.5] }, L: { g: [T.sh.L[0] - 22, 4.5, T.sh.L[2]], pole: [0, 0.04, -1] } }; /* dolna ręka leży: łokieć i dłoń przy podłodze (dolna krawędź ≤ 2 cm), przedramię pod głową */
  return statyczna(RODZINA, cw, SP, bokRamka(nogi, rece));
}


/* ---------- czworak: Cat-Cow ---------- */
/** Cat-Cow (ACE #15: klęk podparty, dłonie pod barkami, kolana pod biodrami; koci grzbiet: brzuch w górę, „Allow your head to fall towards your chest, maintaining alignment with the spine.”; krowa: brzuch opada ku podłodze, kręgosłup wygięty, bez zalecenia dla głowy): głowa idzie za kręgosłupem
 * — przy kocim grzbiecie opuszczona ku klatce (głowa − tułów +28°), w przejściu +14°, przy krowie w linii z tułowiem (0°; źródło nie każe unosić głowy). */
function catCow(cw) {
  const B = BODY(); const hx = 60; const Sy = 65.8; const PX = 12.9; const Py = 8.8 + B.thigh;
  const fr = (u, bend, glowaWzgTulowia) => {
    const chord = Math.cos(0.55 * bend * R); const phi = Math.asin((Sy - Py) / (B.trunk * chord)); const p = 90 - phi / R; const P = [PX, Py]; /* miednica (i kolana pod nią) stoi w miejscu: kolana nie jeżdżą po podłodze (recenzja r4: 1,6 cm); barki przesuwają się o ≤ 1,5 cm względem dłoni (ręce giętkie) */
    const aK = (s) => { const f = fk([P[0], P[1], POL(s) * HIP()], [0, -1, 0], [Math.cos(165 * R), Math.sin(165 * R), 0]); return { a: [f.ankle[0], f.ankle[1], POL(s) * 10], pod: -90, rot: 10, pole: [0.15, -1, 0] }; };
    return K({ u, m: P, p, bend, head: p + glowaWzgTulowia, R: aK('R'), L: aK('L'), hr: { g: [hx, 2, 19], pole: [-0.5, -1, 0.3] }, hl: { g: [hx, 2, -19], pole: [-0.5, -1, -0.3] } });
  };
  return poza(RODZINA, cw, SP, [fr(0, 26, 28), fr(0.5, 4, 14), fr(1, -16, 0)], []);
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
export const PRZYBLIZENIA = {
  "Child's Pose": 'wariant ACE #227 „ręce wzdłuż ciała” (krok 4: „Extend your arms alongside the body with the palms facing upward…”): dłonie na podłodze przy biodrach (palce do góry nie rysujemy); kolana szeroko, bierne zgięcie kolana ≈ 152° i biodra ≈ 139° (wyjątek zakresu: CONTRACT.kneePassiveMaxDeg, hipPassiveMaxDeg); stopy grzbietem na podłodze (podbicie 208°, krok 1: „toes pointing behind you”)',
  'Seated Calf Stretch': 'przybliżenie: stopa pionowo (zgięcie grzbietowe ≈ 0°, maksymalne podbicie modelu to 90°); guma owinięta wokół podeszwy prawej stopy (ACE #214), druga noga bez gumy',
  'Supine Hamstring Stretch': 'poza wg AAOS (dłonie splecione z tyłu uda, druga noga zgięta, stopa na podłodze); wariant ACE #235 z nogą o ścianę nie jest rysowany',
  'Side-Lying Quad Stretch': 'przybliżenie: leżenie na lewym boku, górną (prawą) nogą i dłonią od strony kamery; tułów odchylony do tyłu o 15° (obrót tułowia −75°, nie −90°: przy −90° dolny bark wchodzi pod podłogę albo tułów wisi nad nią; w widoku z boku, jedynym w aplikacji, odchylenia nie widać); głowa opada skłonem bocznym ≈ 20° na dłoń dolnej ręki leżącej na podłodze; dolna noga prosta (kolano ≈ 9°) leży na podłodze; udo górnej nogi w linii tułowia (biodro ≈ 13°), kolano zgięte ≈ 140° (granica modelu), goleń zawraca ku tyłowi ciała i w górę; dłoń 1,3 cm od kostki (sięg ręki ≈ 63 cm); stopa pochylona 45° (model nie ma stopy wzdłuż goleni leżącej na boku)',
};
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
