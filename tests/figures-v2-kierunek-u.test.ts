/*
 * Strażnik kierunku u: 0 → 1 (recenzja treści kart leg_machine i lunge, 28.10.2026, Z4). Wpis rodziny w DATA_UI (`lowerFirst`, `names`) mówi, czy faza 0 → 1 to opuszczanie, ale w rodzinie kierunek bywa różny:
 * Leg Press, Single Leg Press (wypychanie) kontra Hack Squat i reszta (opuszczanie); Step Up, Barbell Step Up (wejście w górę) kontra reszta wykroków (opuszczanie). Jeden wpis bez wyjątków dałby błędne nazwy i czasy faz.
 * Kierunek wynika z geometrii póz: miednica (zmiana wysokości ≥ PELVIS_MIN_CM), a gdy miednica stoi — kolano (zmiana ≥ MIN_MEASURED_ROM.deg). Ćwiczenie bez takiego ruchu (ruch tylko w kostce) musi mieć kierunek zadeklarowany wprost w wyjątku (`lowerFirst`).
 * Rodziny: leg_machine i lunge są jeszcze „planned” (bez wpisu DATA_UI) — test pokazuje na proponowanych wpisach, że jeden wpis jest czerwony, a wpis z wyjątkami zielony; wpis każdej rodziny z plikiem póz (także przyszły) jest sprawdzany automatycznie.
 */
import * as fs from 'fs';
import * as path from 'path';
import { DATA_UI, ONE_WAY_UI, ISOMETRIC, MIN_MEASURED_ROM, SIDES, dataUiFor, figureSpec, jointAngles, keyframeFrame, lowerFirstOf, type DataUi, type PoseData } from '@/lib/figures/v2';

const POSES = path.join(__dirname, '../lib/figures/v2/poses');
/** Konwencja testowa (bez źródła): zmiana wysokości miednicy między u = 0 i u = 1, od której ruch uznajemy za opuszczanie albo wejście. */
const PELVIS_MIN_CM = 5;
type Kierunek = 'opuszczanie' | 'wysilek' | null;
const plik = (f: string): Record<string, PoseData> => JSON.parse(fs.readFileSync(path.join(POSES, f + '.json'), 'utf8')).cwiczenia;
const FAMILIES = fs.readdirSync(POSES).filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/, ''));

/** Kierunek u: 0 → 1 wyliczony z klatek: miednica w dół albo kolano zgina się = opuszczanie; w górę albo kolano prostuje się = wysiłek; brak ruchu miednicy i kolan = null (nie do oceny). */
function kierunekU(d: PoseData): Kierunek {
  const a = keyframeFrame(d, 0).sk, b = keyframeFrame(d, 1).sk; const dy = b.pelvis[1] - a.pelvis[1];
  if (Math.abs(dy) >= PELVIS_MIN_CM) return dy < 0 ? 'opuszczanie' : 'wysilek';
  const dk = SIDES.map(s => jointAngles(b, s).knee - jointAngles(a, s).knee).reduce((m, x) => Math.abs(x) > Math.abs(m) ? x : m, 0);
  if (Math.abs(dk) >= MIN_MEASURED_ROM.deg) return dk > 0 ? 'opuszczanie' : 'wysilek';
  return null;
}
/** Naruszenia wpisu `ui` rodziny `family`: ćwiczenia, których lowerFirst albo nazwa pierwszej fazy nie zgadza się z kierunkiem u, i ćwiczenia bez pomiaru bez zadeklarowanego kierunku (gdy w rodzinie da się go zmierzyć). */
function naruszenia(family: string, ui: DataUi): string[] {
  if (ui.walk) return []; /* chód: jedna faza „Marsz”, kierunku u nie ma */
  const cw = plik(family); const kier = Object.fromEntries(Object.entries(cw).map(([k, d]) => [k, kierunekU(d)]));
  if (Object.values(kier).every(x => x === null)) return []; /* rodzina bez ruchu miednicy i kolan (ręce, barki): kierunku nie da się ocenić geometrią */
  const o: string[] = [];
  for (const [k, kd] of Object.entries(kier)) {
    const wyj = ui.exceptions?.[k]; const lf = lowerFirstOf(ui, k); const nazwy = wyj?.names ?? ui.names;
    if (kd === null) { if (ISOMETRIC.has(k)) continue; /* izometria: jedna pozycja bez animacji */
      if (wyj?.lowerFirst === undefined) o.push(`${k}: kierunek nie do zmierzenia, a wyjątek nie deklaruje lowerFirst`); continue; }
    if (lf !== (kd === 'opuszczanie')) o.push(`${k}: u 0→1 to ${kd}, a lowerFirst = ${lf}`);
    else if ((nazwy.first === 'Opuszczanie') !== (kd === 'opuszczanie')) o.push(`${k}: u 0→1 to ${kd}, a pierwsza faza nazywa się „${nazwy.first}”`);
  }
  return o;
}
const OPUSZCZANIE = { names: { first: 'Opuszczanie', second: 'Wypychanie' }, lowerFirst: true, joints: ['knee'] } as const satisfies DataUi;
const WYPYCHANIE = { names: { first: 'Wypychanie', second: 'Opuszczanie' }, lowerFirst: false } as const;
const WEJSCIE = { names: { first: 'Wstawanie', second: 'Opuszczanie' }, lowerFirst: false } as const;

describe('kierunek u z geometrii póz (dane, logika)', () => {
  test.each([
    ['leg_machine', 'Leg Press', 'wysilek'], ['leg_machine', 'Single Leg Press', 'wysilek'],
    ['leg_machine', 'Hack Squat', 'opuszczanie'], ['leg_machine', 'Pendulum Squat', 'opuszczanie'], ['leg_machine', 'Lying Machine Squat', 'opuszczanie'], ['leg_machine', 'Belt Squat Machine', 'opuszczanie'],
    ['lunge', 'Step Up', 'wysilek'], ['lunge', 'Barbell Step Up', 'wysilek'], ['lunge', 'Reverse Lunge', 'opuszczanie'], ['lunge', 'Pistol Squat', 'opuszczanie'], ['lunge', 'Lateral Lunge', 'opuszczanie'],
  ] as const)('%s / %s: kierunek %s', (f, k, oczekiwany) => { expect(kierunekU(plik(f)[k])).toBe(oczekiwany); });
  test('lista odwróceń: w leg_machine i lunge dokładnie te ćwiczenia mają u 0→1 inny niż „opuszczanie” (wejście dla wpisów DATA_UI)', () => {
    const inne = (f: string) => Object.entries(plik(f)).filter(([, d]) => kierunekU(d) !== 'opuszczanie').map(([k]) => k);
    expect(inne('leg_machine')).toEqual(['Leg Press', 'Single Leg Press']); expect(inne('lunge')).toEqual(['Step Up', 'Barbell Step Up']);
  });
});

describe('wyjątek lowerFirst w DATA_UI (silnik)', () => {
  test('lowerFirstOf: wpis rodziny, gdy wyjątek nie ma lowerFirst; wyjątek wygrywa w obie strony', () => {
    const ui: DataUi = { ...OPUSZCZANIE, exceptions: { A: { lowerFirst: false }, B: { hideAngle: true }, C: { lowerFirst: true } } };
    expect(['A', 'B', 'C', 'D'].map(k => lowerFirstOf(ui, k))).toEqual([false, true, true, true]);
    expect(lowerFirstOf({ ...OPUSZCZANIE, lowerFirst: false }, 'X')).toBe(false);
    expect(lowerFirstOf({ ...OPUSZCZANIE, exceptions: {} }, 'toString')).toBe(true); /* klucz z prototypu nie jest wyjątkiem */
  });
  test('figureSpec bierze lowerFirst z wyjątku ćwiczenia (pull_up: wpis rodziny false, wyjątek true dla jednego ćwiczenia)', () => {
    const k = 'Neutral Grip Pull Up'; const before = DATA_UI.pull_up;
    try {
      expect(figureSpec(k)!.lowerFirst).toBe(false);
      DATA_UI.pull_up = { ...before, exceptions: { [k]: { lowerFirst: true } } };
      expect(figureSpec(k)!.lowerFirst).toBe(true);
    } finally { DATA_UI.pull_up = before; }
  });
});

describe('strażnik: wpis DATA_UI zgodny z kierunkiem u dla każdego ćwiczenia', () => {
  test('leg_machine: jeden wpis rodziny jest czerwony (dwa ćwiczenia), wpis z wyjątkami zielony', () => {
    expect(naruszenia('leg_machine', OPUSZCZANIE)).toEqual([
      'Leg Press: u 0→1 to wysilek, a lowerFirst = true', 'Single Leg Press: u 0→1 to wysilek, a lowerFirst = true',
    ]);
    expect(naruszenia('leg_machine', { ...OPUSZCZANIE, exceptions: { 'Leg Press': WYPYCHANIE, 'Single Leg Press': WYPYCHANIE } })).toEqual([]);
  });
  test('lunge: jeden wpis rodziny jest czerwony (wejścia na stopień), wpis z wyjątkami zielony', () => {
    expect(naruszenia('lunge', OPUSZCZANIE)).toEqual(['Step Up: u 0→1 to wysilek, a lowerFirst = true', 'Barbell Step Up: u 0→1 to wysilek, a lowerFirst = true']);
    expect(naruszenia('lunge', { ...OPUSZCZANIE, exceptions: { 'Step Up': WEJSCIE, 'Barbell Step Up': WEJSCIE } })).toEqual([]);
  });
  test('sama zmiana lowerFirst bez nazwy faz też jest czerwona (nazwa „Opuszczanie” przy wypychaniu)', () => {
    expect(naruszenia('lunge', { ...OPUSZCZANIE, exceptions: { 'Step Up': { lowerFirst: false }, 'Barbell Step Up': { ...WEJSCIE } } })).toEqual(['Step Up: u 0→1 to wysilek, a pierwsza faza nazywa się „Opuszczanie”']);
  });
  test('rodzina bez ruchu miednicy i kolan (ręce, barki) nie jest oceniana geometrią', () => {
    expect(naruszenia('delt_raise', { ...OPUSZCZANIE, lowerFirst: false })).toEqual([]);
  });
  test.each(FAMILIES.filter(f => dataUiFor(f)))('wpis DATA_UI rodziny %s: kierunek u zgodny z ruchem w każdym ćwiczeniu', f => { expect(naruszenia(f, dataUiFor(f)!)).toEqual([]); });
  test('wyjątki lowerFirst w DATA_UI dotyczą istniejących ćwiczeń rodziny', () => {
    for (const [f, ui] of Object.entries(DATA_UI)) for (const [k, x] of Object.entries(ui.exceptions ?? {})) if (x.lowerFirst !== undefined) expect([f, k, k in plik(f)]).toEqual([f, k, true]);
  });
});

/*
 * Ruch z lotem albo rzutem (28.10.2026, recenzja treści plyo/sanie, Z2): u 0 → 1 obejmuje całe powtórzenie, więc wahadło odtworzyłoby skok albo rzut wstecz, a nazwy i czasy faz „Opuszczanie/Wypychanie” nie opisywałyby ruchu.
 * Wymaga trybu `petla: 'jednokierunkowa'` ćwiczenie, w którym (a) miednica nie jest monotoniczna — w ruchu jest i wzniesienie, i opuszczenie o ≥ PELVIS_MIN_CM (skok, lot, lądowanie), albo (b) wariant ma regułę sensu rzutu/uderzenia
 * (rzut_*, slam_*, wallball_rzut w data/zrodla/figury-sens.json; piłka w dłoniach przez całą pętlę, miednica bywa monotoniczna). Sprawdzane w rodzinach z wpisem DATA_UI albo ONE_WAY_UI; pozostałe rodziny dostaną ten sam strażnik przy wpisie.
 */
const SENS = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/zrodla/figury-sens.json'), 'utf8')).rodziny as Record<string, { warianty?: Record<string, string[]> }>;
const REGULA_RZUTU = /^(rzut_|slam_|wallball_rzut)/;
function miednicaNieMonotoniczna(d: PoseData): boolean {
  const y = Array.from({ length: 49 }, (_, i) => keyframeFrame(d, i / 48).sk.pelvis[1]); let wzrost = 0, spadek = 0, min = y[0], max = y[0];
  for (const v of y) { wzrost = Math.max(wzrost, v - min); spadek = Math.max(spadek, max - v); min = Math.min(min, v); max = Math.max(max, v); }
  return wzrost >= PELVIS_MIN_CM && spadek >= PELVIS_MIN_CM;
}
const rzutWSensie = (family: string, key: string): boolean => { const w = SENS[family]?.warianty; const r = w && Object.prototype.hasOwnProperty.call(w, key) ? w[key] : undefined; return Array.isArray(r) && r.some(x => REGULA_RZUTU.test(x)); };
/** Ćwiczenia rodziny, które wymagają trybu jednokierunkowego, a go nie mają (komunikat per ćwiczenie). */
function bezTrybuJednokierunkowego(family: string, cw: Record<string, PoseData> = plik(family)): string[] {
  return Object.entries(cw).filter(([k, d]) => d.petla !== 'jednokierunkowa' && d.petla !== 'cykl_lustro' && (miednicaNieMonotoniczna(d) || rzutWSensie(family, k)))
    .map(([k, d]) => `${k}: ruch z lotem lub rzutem (${miednicaNieMonotoniczna(d) ? 'miednica nie monotoniczna' : 'reguła sensu rzutu'}) wymaga petla = jednokierunkowa`);
}
describe('strażnik: ruch z lotem lub rzutem wymaga trybu jednokierunkowego', () => {
  test('wykrywanie: Jump Squat i Box Jump (miednica w górę i w dół) oraz Medicine Ball Slam (reguła rzutu) bez pola są czerwone; Pull Up i Barbell Squat zielone', () => {
    const j = { ...plik('plyo')['Jump Squat'], petla: undefined }; expect(miednicaNieMonotoniczna(j)).toBe(true); expect(bezTrybuJednokierunkowego('plyo', { 'Jump Squat': j })).toEqual(['Jump Squat: ruch z lotem lub rzutem (miednica nie monotoniczna) wymaga petla = jednokierunkowa']);
    const sl = { ...plik('sled_throw')['Medicine Ball Slam'], petla: undefined }; expect(miednicaNieMonotoniczna(sl)).toBe(false);
    expect(bezTrybuJednokierunkowego('sled_throw', { 'Medicine Ball Slam': sl })).toEqual(['Medicine Ball Slam: ruch z lotem lub rzutem (reguła sensu rzutu) wymaga petla = jednokierunkowa']);
    expect(bezTrybuJednokierunkowego('pull_up')).toEqual([]);
  });
  test('Sled Push i Sled Drag (tryb cykliczny, miednica stała) nie wymagają jednokierunkowego', () => { expect(bezTrybuJednokierunkowego('sled_throw')).toEqual([]); });
  test.each(FAMILIES.filter(f => dataUiFor(f) || ONE_WAY_UI[f]))('rodzina %s: każde ćwiczenie z lotem albo rzutem ma petla = jednokierunkowa', f => { expect(bezTrybuJednokierunkowego(f)).toEqual([]); });
  test('plyo i sled_throw mają wpis ONE_WAY_UI (nazwa fazy „Skok” / „Rzut”), nie opuszczania', () => { expect([ONE_WAY_UI.plyo.names.first, ONE_WAY_UI.sled_throw.names.first]).toEqual(['Skok', 'Rzut']); });
});
