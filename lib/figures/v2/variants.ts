/*
 * Figury v2 — warianty ćwiczeń gotowych rodzin: JAWNA tabela klucz katalogu → parametry rigu (sprzęt, chwyt, kąt ławki, głębokość…). Jawna, bo wariant to decyzja
 * o tym, co rysunek pokazuje; test pilnuje, że każde ćwiczenie przypisane do gotowej rodziny (families.ts) ma wpis i że nie ma wpisów osieroconych.
 * Liczby (głębokość zgięcia kolana, rozstaw chwytu, kąty ławki…) bez źródła w dokumentach to UPROSZCZENIE ILUSTRACYJNE — rysunek nie twierdzi, że to jedyna
 * poprawna wartość i nie pokazuje ich użytkownikowi jako liczb.
 */
import type { SquatParams } from './rigs/squat';
import type { BenchParams } from './rigs/benchPress';
import { HINGE, type HingeParams } from './rigs/hinge';
import { EQUIP } from './draw';

export type Variant =
  | { family: 'squat'; p: SquatParams; static?: boolean }
  | { family: 'bench_press'; p: BenchParams }
  | { family: 'hinge'; p: HingeParams; lowerFirst: boolean };

const SQ = (load: SquatParams['load'], impl: SquatParams['impl'], o: Partial<SquatParams> = {}): Variant => ({ family: 'squat', p: { load, impl, depth: 120, stance: 20, toeOut: 15, ...o }, static: o.wall ? true : undefined });
const BP = (impl: BenchParams['impl'], o: Partial<BenchParams> = {}): Variant => ({ family: 'bench_press', p: { impl, angle: 0, grip: 33, touch: 33, ...o } });
const HG = (style: HingeParams['style'], impl: HingeParams['impl'], o: Partial<HingeParams> = {}): Variant => {
  const rdl = style === 'rdl' || style === 'singleLeg' || style === 'pullThrough';
  const base: HingeParams = rdl
    ? { style, impl, yEnd: 55, stance: style === 'singleLeg' ? 8.5 : 14, toeOut: 8, grip: impl === 'db' ? 18 : 23, shin: HINGE.shin.rdl, sx: [-2, style === 'pullThrough' ? -2 : HINGE.rdlSxEnd] }
    : { style, impl, stance: 14, toeOut: 8, grip: impl === 'trapbar' ? EQUIP.trapW : impl === 'db' ? 26 : 23, shin: impl === 'trapbar' ? HINGE.shin.floor : HINGE.shin.conv, sx: [3, -9] };
  const p = { ...base, ...o };
  return { family: 'hinge', p, lowerFirst: rdl || style === 'goodMorning' };
};
/** Wąski chwyt (wskazówka cgbp.grip „na szerokość barków lub trochę węziej”): połowa rozstawu dłoni 18 cm przy barkach 20,5 (BENCH.dims) — przedramię pionowo jak w zwykłym wyciskaniu (docs/50, 1.0.1); dotyk 20 cm poniżej linii stawów (zakres 10–20, figury-wyciskanie.json B5). */
const CLOSE = { grip: 19, touch: 30 } as const;
/** Ławka ujemna: dotyk niżej na klatce niż płasko (tułów opuszczony), tak by przedramię na dole było ≤ 10° od pionu także strzałkowo (decyzja 26.10.2026 ±10°); uproszczenie ilustracyjne. */
const DECLINE = { touch: 26, touchDb: 24 } as const;
/** Grubość deski w Board Press (cm; uproszczenie ilustracyjne — było `touchB` 17,5 = klatka 11,9 + promień gryfu 1,6 + 4). */
const BOARD = 4;
/** Wyciskanie na uchwytach (Band Bench Press, Chain Press): tor jak w wyciskaniu hantli — dłonie szeroko na dole, bliżej na górze (katalog nie podaje; uproszczenie ilustracyjne, jak hantle). */
const HANDLES = { grip: 32, gripTop: 22, touch: 32 } as const;
/** Chain Press (101-06, recenzja 29.10.2026): dłonie na dole na wysokości klatki, jak w wyciskaniu hantli (katalog: „w tej samej pozycji co wyciskanie hantli”; docs/research/1-0-1-zrodla-2026-10-29.md pkt 3) — dotyk i wysokość dotyku jak w `HANDLES` (było `touch` 22 i `touchB` 32 = łokieć 90° na wysokości barku, dłonie o 10 cm niżej w stronę stóp).
 * Źródło mówi też o łokciu ok. 90°, ale przy dłoniach na klatce zgięcie wynika z długości ramienia (ok. 127°; hantle 135°) — pozycja dłoni ma pierwszeństwo (kompromis zapisany w tests/figury-pakiet-b.test.ts); rozstaw 40 cm na dole (szerzej niż hantle 32), 22 na górze (uproszczenie ilustracyjne). */
const CHAIN_PRESS = { ...HANDLES, grip: 40 } as const;
/** Drążek sześciokątny: bark względem uchwytów na starcie i na wyproście (cm) — na wyproście tułów w pionie (było −6 → tułów −6,4° do tyłu, 1.0.1). */
const TRAP_SX: [number, number] = [2, -2];
/** JM Press: sztanga na dole 13 cm za osią barków ku głowie (kąt ramienia wynika), odwiedzenie 45° stałe, zgięcie łokcia 145°, przedramiona lekko zbieżne (uproszczenie ilustracyjne; „ok. 45°” — badacz 28.10.2026, 3 zgodne źródła szczebla 4). */
const JM = { xb: -13, yb: 14, abd: 45 } as const;
/** Skull Crusher na ławce ujemnej: ramię 3° ku głowie, sztanga 8 cm nad czubkiem głowy, przedramiona lekko zbieżne (uproszczenie ilustracyjne; ramię „pionowo albo lekko ku głowie” — badacz 28.10.2026, D3, D4). */
const SKULL = { aHead: 3, clear: 8, inward: 0 } as const;
/** Martwy ciąg z podłogi (101-02, L-056): kolana jako osobna krzywa — podudzie pochylone ku przodowi na starcie (σ 10°), prosto przy kolanach gryfu; barki przed gryfem do końca ruchu i dopiero na wyproście za nim (late 10);
 * gryf wchodzi w uda za kolanem (jedna zmiana kierunku toru, ≤ HINGE.dev poniżej prostej). Uproszczenie ilustracyjne (kąty bez źródła; wskazówki karty: dl.close, dl.lift). */
const DL_KOLANA: Partial<HingeParams> = { knees: { s: [10, 0], late: 10, back: 0.4 }, sx: [6, -9] };
/** RDL i martwy na prostych nogach ze sztangą i linką (101-03): krzywa kolan — podudzie prawie pionowo (0° → 2°), niezależnie od zgięcia kolana; gryf prowadzony tuż przy udach (tor z jedną zmianą kierunku). Uproszczenie ilustracyjne (kolano ≤ 27° pilnuje figury-1-0-recenzja). */
const RDL_KOLANA: Partial<HingeParams> = { knees: { s: [0, 2] } };
const SUMO: Partial<HingeParams> = { stance: 34, toeOut: 40, grip: 12, shin: HINGE.shin.sumo };
/** Sumo ze sztangą (101-03, 101-04): krzywa kolan jak w martwym ciągu klasycznym, ale podudzie prawie pionowo (σ 6° na starcie), a kolana idą nad palcami (kierunek kolana = rotacja stóp 40°, było 2 × = 80°, czyli w bok) — gryf
 * przylega do goleni i ud (karta sumo.kneesOut: kolana na zewnątrz w linii stóp). Uproszczenie ilustracyjne. */
const SUMO_SZTANGA: Partial<HingeParams> = { ...SUMO, kneeOut: 40, knees: { s: [6, 0], late: 10, back: 0.4 }, sx: [6, -9] };

/** Klucz katalogu → wariant. Tylko gotowe rodziny (squat, bench_press, hinge). */
export const VARIANTS: Record<string, Variant> = {
  /* ---- przysiad ---- */
  'Back Squat': SQ('highBar', 'barbell'),
  'Front Squat': SQ('frontBar', 'barbell'),
  'Goblet Squat': SQ('goblet', 'db', { depth: 130 }),
  'Przysiad z pasem (linki)': SQ('belt', 'cable', { depth: 115 }),
  'Box Squat': SQ('highBar', 'barbell', { box: 45 }),
  'Wall Sit': SQ('bodyweight', 'none', { wall: true, depth: 90 }),
  'Cable Squat': SQ('goblet', 'cable', { depth: 120 }),
  'Bodyweight Squat': SQ('bodyweight', 'none', { depth: 125 }),
  'Smith Machine Squat': SQ('highBar', 'barbell', { smith: true, depth: 115 }),
  'Zercher Squat': SQ('zercher', 'barbell', { depth: 115 }),
  'Double Kettlebell Front Squat': SQ('kbRack', 'kb'),
  'Landmine Squat': SQ('landmine', 'barbell'),
  'Sumo Squat (hantel)': SQ('dbSumo', 'db', { stance: 32, toeOut: 40, depth: 115 }),
  'Box Squat with Bands': SQ('highBar', 'barbell', { box: 45, band: true }),
  'Box Squat with Chains': SQ('highBar', 'barbell', { box: 45, chain: true }),
  'Reverse Band Box Squat': SQ('highBar', 'barbell', { box: 45, band: true, reverse: true }),
  'Reverse Band Power Squat': SQ('highBar', 'barbell', { band: true, reverse: true }),
  'Squat with Bands': SQ('highBar', 'barbell', { band: true }),
  'Squat with Chains': SQ('highBar', 'barbell', { chain: true }),
  'Barbell Hack Squat': SQ('behind', 'barbell', { depth: 110 }),
  'Overhead Squat': SQ('overhead', 'barbell', { depth: 130 }),
  'Dumbbell Squat': SQ('dbSides', 'db', { depth: 115, stance: 18, toeOut: 8 }),
  'One-Arm Overhead Kettlebell Squat': SQ('kbOverhead1', 'kb', { depth: 115 }),
  'Dip Belt Squat': SQ('belt', 'none', { depth: 115 }),
  'Band Squat': SQ('bodyweight', 'none', { band: true, depth: 125 }),
  /* ---- wyciskanie leżąc ---- */
  'Bench Press (sztanga)': BP('barbell', { grip: 35, touch: 34, vert: true }),
  'Bench Press (hantle)': BP('db', { grip: 32, gripTop: 22, touch: 32, vert: true }),
  'Incline Bench Press (sztanga)': BP('barbell', { angle: 30, grip: 35, touch: 40, vert: true }),
  'Incline Bench Press (hantle)': BP('db', { angle: 30, grip: 32, gripTop: 22, touch: 40, vert: true }),
  'Decline Bench Press': BP('barbell', { angle: -15, touch: DECLINE.touch, vert: true }),
  'Close Grip Bench Press': BP('barbell', { grip: CLOSE.grip, touch: CLOSE.touch, vert: true }),
  'Decline Bench Press (hantle)': BP('db', { angle: -15, touch: DECLINE.touchDb, grip: 32, gripTop: 22, vert: true }),
  'Floor Press (hantle)': BP('db', { floor: true, grip: 32, gripTop: 22, vert: true }),
  'Floor Press (sztanga)': BP('barbell', { floor: true, vert: true }),
  'Squeeze Press (hantle)': BP('db', { grip: 7, squeeze: true }),
  'Smith Machine Bench Press': BP('smith', { vert: true }),
  'Smith Machine Incline Press': BP('smith', { angle: 30, touch: 38, vert: true }),
  'JM Press': BP('barbell', { grip: 12, touch: 62, touchB: 12, flare: 0.8, jm: JM }),
  'One-Arm Kettlebell Floor Press': BP('kb', { floor: true, oneArm: true, grip: 30, vert: true }),
  'One Arm Dumbbell Bench Press': BP('db', { oneArm: true, grip: 32, vert: true }),
  'Barbell Guillotine Bench Press': BP('barbell', { grip: 42, touch: 50, touchB: 9 }),
  'Wide-Grip Barbell Bench Press': BP('barbell', { grip: 45, vert: true }),
  'Smith Machine Decline Press': BP('smith', { angle: -15, touch: DECLINE.touch, vert: true }),
  'Band Bench Press': BP('band', { ...HANDLES, vert: true, handles: true }),
  'Chain Press': BP('chain', { ...CHAIN_PRESS, vert: true, handles: true }),
  'Bench Press with Chains': BP('chain', { vert: true }),
  'Floor Press with Chains': BP('chain', { floor: true, vert: true }),
  'Reverse Band Bench Press': BP('barbell', { band: true, reverse: true, vert: true }),
  'Board Press': BP('barbell', { board: BOARD, vert: true }),
  'Pin Press': BP('barbell', { touchB: 19, pins: true, vert: true }),
  'Close-Grip Dumbbell Press': BP('db', { grip: CLOSE.grip, touch: CLOSE.touch, vert: true }),
  'Close-Grip EZ-Bar Press': BP('barbell', { grip: CLOSE.grip, touch: CLOSE.touch, vert: true }),
  'Smith Machine Close-Grip Bench Press': BP('smith', { grip: CLOSE.grip, touch: CLOSE.touch, vert: true }),
  'Reverse Grip Bench Press': BP('barbell', { grip: 30, touch: 31, vert: true }),
  'Decline Close-Grip Bench To Skull Crusher': BP('barbell', { angle: -15, grip: CLOSE.grip, touch: DECLINE.touch - 1, vert: true, skull: SKULL }),
  /* ---- zawias ---- */
  'Deadlift (sztanga)': HG('floor', 'barbell', DL_KOLANA),
  'Deadlift (hantle)': HG('floor', 'db', { grip: HINGE.dbFloorGrip }),
  'Sumo Deadlift': HG('floor', 'barbell', SUMO_SZTANGA),
  'Trap Bar Deadlift': HG('floor', 'trapbar', { yStart: 20, sx: TRAP_SX }),
  'RDL (sztanga)': HG('rdl', 'barbell', { ...RDL_KOLANA, sx: [-2, 19] }), /* ramiona ok. 17° od pionu na dole — decyzja właściciela 29.10.2026 (było 23°, sx 25) */
  'RDL (hantle/linki)': HG('rdl', 'db', RDL_KOLANA),
  'Good Morning': HG('goodMorning', 'barbell'),
  'Rack Pull': HG('floor', 'barbell', { ...DL_KOLANA, knees: { ...DL_KOLANA.knees!, s: [3, 0] }, yStart: 45, rack: true }),
  'Single Leg RDL (hantel)': HG('singleLeg', 'db', { ...RDL_KOLANA, grip: 13 }),
  'Single Leg RDL (linki)': HG('singleLeg', 'cable', { ...RDL_KOLANA, grip: 13 }),
  'Cable Pull Through': HG('pullThrough', 'cable', { grip: 6, pull: true, sx: [-2, HINGE.rdlSxEnd] }),
  'Single Arm RDL (hantel/linka)': HG('rdl', 'db', { oneArm: true, grip: 24 }),
  'Sumo Deadlift (kettlebell)': HG('floor', 'kb', { ...SUMO, yStart: 26, grip: 6 }),
  'Axle Deadlift': HG('floor', 'barbell', DL_KOLANA),
  'Deadlift with Bands': HG('floor', 'barbell', { ...DL_KOLANA, band: true }),
  'Deadlift with Chains': HG('floor', 'barbell', { ...DL_KOLANA, chain: true }),
  'Deficit Deadlift': HG('floor', 'barbell', { ...DL_KOLANA, platform: 6 }),
  'Rack Pull with Bands': HG('floor', 'barbell', { ...DL_KOLANA, knees: { ...DL_KOLANA.knees!, s: [3, 0] }, yStart: 45, band: true, rack: true }),
  'Reverse Band Deadlift': HG('floor', 'barbell', { ...DL_KOLANA, band: true, reverse: true }),
  'Cable Deadlift': HG('floor', 'cable', { ...DL_KOLANA, yStart: 20 }),
  'Leverage Deadlift': HG('floor', 'trapbar', { yStart: 24, sx: TRAP_SX }),
  'One-Arm Side Deadlift': HG('floor', 'barbell', { oneArm: true }),
  'Rickshaw Deadlift': HG('floor', 'trapbar', { yStart: 26, sx: TRAP_SX }),
  'Band Good Morning': HG('goodMorning', 'barbell', { band: true }),
  'Clean Deadlift': HG('floor', 'barbell', DL_KOLANA),
  'Good Morning off Pins': HG('goodMorning', 'barbell', { rack: true }),
  'Reverse Band Sumo Deadlift': HG('floor', 'barbell', { ...SUMO_SZTANGA, band: true, reverse: true }),
  'Smith Machine Stiff-Legged Deadlift': HG('rdl', 'smith', { yEnd: 48 }),
  'Snatch Deadlift': HG('floor', 'barbell', { ...DL_KOLANA, sx: [11, -9], grip: 45 }),
  'Stiff-Legged Barbell Deadlift': HG('rdl', 'barbell', { ...RDL_KOLANA, yEnd: 48 }),
  'Sumo Deadlift with Bands': HG('floor', 'barbell', { ...SUMO_SZTANGA, band: true }),
  'Sumo Deadlift with Chains': HG('floor', 'barbell', { ...SUMO_SZTANGA, chain: true }),
};
