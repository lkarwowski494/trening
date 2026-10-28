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
import type { PoseData } from './contract';
import type { FamilyId } from './families';

/** Rodziny bez rigu: pozy z danych (poses/<rodzina>.json, poseData.ts). */
export type DataFamilyId = Exclude<FamilyId, 'squat' | 'bench_press' | 'hinge'>;

export type Variant =
  | { family: 'squat'; p: SquatParams; static?: boolean }
  | { family: 'bench_press'; p: BenchParams }
  | { family: 'hinge'; p: HingeParams; lowerFirst: boolean }
  | { family: DataFamilyId; data: PoseData };

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
const SUMO: Partial<HingeParams> = { stance: 34, toeOut: 40, grip: 12, shin: HINGE.shin.sumo };

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
  'Decline Bench Press': BP('barbell', { angle: -15, touch: 28, vert: true }),
  'Close Grip Bench Press': BP('barbell', { grip: 12, touch: 30 }),
  'Decline Bench Press (hantle)': BP('db', { angle: -15, touch: 28, grip: 32, gripTop: 22, vert: true }),
  'Floor Press (hantle)': BP('db', { floor: true, grip: 32, gripTop: 22, vert: true }),
  'Floor Press (sztanga)': BP('barbell', { floor: true, vert: true }),
  'Squeeze Press (hantle)': BP('db', { grip: 7, squeeze: true }),
  'Smith Machine Bench Press': BP('smith', { vert: true }),
  'Smith Machine Incline Press': BP('smith', { angle: 30, touch: 38, flare: 0.068, vert: true }),
  'JM Press': BP('barbell', { grip: 12, touch: 60, touchB: 10, flare: 0.8 }),
  'One-Arm Kettlebell Floor Press': BP('kb', { floor: true, oneArm: true, grip: 30, vert: true }),
  'One Arm Dumbbell Bench Press': BP('db', { oneArm: true, grip: 32, vert: true }),
  'Barbell Guillotine Bench Press': BP('barbell', { grip: 42, touch: 50, touchB: 9 }),
  'Wide-Grip Barbell Bench Press': BP('barbell', { grip: 45, flare: 0.15, vert: true }),
  'Smith Machine Decline Press': BP('smith', { angle: -15, touch: 28, vert: true }),
  'Band Bench Press': BP('band', { vert: true }),
  'Chain Press': BP('chain', { vert: true }),
  'Bench Press with Chains': BP('chain', { vert: true }),
  'Floor Press with Chains': BP('chain', { floor: true, vert: true }),
  'Reverse Band Bench Press': BP('barbell', { band: true, reverse: true, vert: true }),
  'Board Press': BP('barbell', { touchB: 17.5, vert: true }),
  'Pin Press': BP('barbell', { touchB: 19, vert: true }),
  'Close-Grip Dumbbell Press': BP('db', { grip: 10, touch: 30 }),
  'Close-Grip EZ-Bar Press': BP('barbell', { grip: 12, touch: 30 }),
  'Smith Machine Close-Grip Bench Press': BP('smith', { grip: 12, touch: 30 }),
  'Reverse Grip Bench Press': BP('barbell', { grip: 30, touch: 31, vert: true }),
  'Decline Close-Grip Bench To Skull Crusher': BP('barbell', { angle: -15, grip: 12, touch: 54, touchB: 12 }),
  /* ---- zawias ---- */
  'Deadlift (sztanga)': HG('floor', 'barbell'),
  'Deadlift (hantle)': HG('floor', 'db', { grip: HINGE.dbFloorGrip }),
  'Sumo Deadlift': HG('floor', 'barbell', SUMO),
  'Trap Bar Deadlift': HG('floor', 'trapbar', { yStart: 20, sx: [2, -6] }),
  'RDL (sztanga)': HG('rdl', 'barbell'),
  'RDL (hantle/linki)': HG('rdl', 'db'),
  'Good Morning': HG('goodMorning', 'barbell'),
  'Rack Pull': HG('floor', 'barbell', { yStart: 45 }),
  'Single Leg RDL (hantel)': HG('singleLeg', 'db', { grip: 13 }),
  'Single Leg RDL (linki)': HG('singleLeg', 'cable', { grip: 13 }),
  'Cable Pull Through': HG('pullThrough', 'cable', { grip: 6, pull: true, yEnd: 55, sx: [-2, 30] }),
  'Single Arm RDL (hantel/linka)': HG('rdl', 'db', { oneArm: true, grip: 24 }),
  'Sumo Deadlift (kettlebell)': HG('floor', 'kb', { ...SUMO, yStart: 26, grip: 6 }),
  'Axle Deadlift': HG('floor', 'barbell'),
  'Deadlift with Bands': HG('floor', 'barbell', { band: true }),
  'Deadlift with Chains': HG('floor', 'barbell', { chain: true }),
  'Deficit Deadlift': HG('floor', 'barbell', { platform: 6 }),
  'Rack Pull with Bands': HG('floor', 'barbell', { yStart: 45, band: true }),
  'Reverse Band Deadlift': HG('floor', 'barbell', { band: true, reverse: true }),
  'Cable Deadlift': HG('floor', 'cable', { yStart: 20 }),
  'Leverage Deadlift': HG('floor', 'trapbar', { yStart: 24, sx: [2, -6] }),
  'One-Arm Side Deadlift': HG('floor', 'barbell', { oneArm: true }),
  'Rickshaw Deadlift': HG('floor', 'trapbar', { yStart: 26, sx: [2, -6] }),
  'Band Good Morning': HG('goodMorning', 'barbell', { band: true }),
  'Clean Deadlift': HG('floor', 'barbell'),
  'Good Morning off Pins': HG('goodMorning', 'barbell'),
  'Reverse Band Sumo Deadlift': HG('floor', 'barbell', { ...SUMO, band: true, reverse: true }),
  'Smith Machine Stiff-Legged Deadlift': HG('rdl', 'smith', { yEnd: 48, sx: [-2, 20] }),
  'Snatch Deadlift': HG('floor', 'barbell', { grip: 45 }),
  'Stiff-Legged Barbell Deadlift': HG('rdl', 'barbell', { yEnd: 48, sx: [-2, 20] }),
  'Sumo Deadlift with Bands': HG('floor', 'barbell', { ...SUMO, band: true }),
  'Sumo Deadlift with Chains': HG('floor', 'barbell', { ...SUMO, chain: true }),
};
