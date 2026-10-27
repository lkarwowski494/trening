/*
 * Karta ćwiczenia: „Kąt na rysunku” i nazwy faz ruchu dla rodzin delt_raise, shrug, rotator_cuff, forearm, carry (63 ćwiczenia z danych póz; decyzja właściciela 27.10.2026, znalezisko S2).
 * Rodziny mają status „planned” (nie zmieniamy go): w tym pliku czasowo „gotowe” i obsługiwane z plików poses/<rodzina>.json przez podmienione `poseDataFor`.
 * Rodzaje (docs/20): logika (wybór stawu z geometrii, próg ruchu, nazwy faz), silnik (rotacja barku), dane (63 ćwiczenia), ekran (linia kąta i licznik faz), dostępność, języki (PL/EN), niezmienniki.
 */
import React from 'react';
import * as RN from 'react-native';
import { render, screen, act } from '@testing-library/react-native';
import { ExerciseFigureV2 } from '@/components/ExerciseFigureV2';
import {
  FAMILY, DATA_UI, MEASURE_UNIT, MIN_MEASURED_ROM, SIDES, assignAll, figureSpec, jointAngles, keyframeFrame, loopLength, measuredAngle, measuredJoint, angleLineShown,
  phaseNames, phasesFor, solveSkeleton, TEMPO, walkPhases, type FamilyId, type MeasuredJoint, type Side, type Skeleton, type V3, type PoseData,
} from '@/lib/figures/v2';
import { measureLine } from '@/lib/figures/v2/ui';
import { EN } from '@/lib/i18n.en';
import { applyLang } from '@/lib/i18n';
import { TEXT_SCALE_MAX } from '@/lib/theme';
import { metricFor } from '@/lib/seed';

jest.mock('@/lib/figures/v2/poseData', () => {
  const real = jest.requireActual('@/lib/figures/v2/poseData');
  const EXTRA = ['delt_raise', 'shrug', 'rotator_cuff', 'forearm', 'carry'];
  return { ...real, poseDataFor: (key: string, family: string) => {
    if (!EXTRA.includes(family)) return real.poseDataFor(key, family);
    const f = jest.requireActual(`@/lib/figures/v2/poses/${family}.json`).cwiczenia as Record<string, { cwiczenie: string; rodzina: string }>;
    const d = Object.prototype.hasOwnProperty.call(f, key) ? f[key] : undefined; return d && d.cwiczenie === key && d.rodzina === family ? d : null;
  } };
});

const FAMS = ['delt_raise', 'shrug', 'rotator_cuff', 'forearm', 'carry'] as const;
type Fam = typeof FAMS[number];
const FILES: Record<Fam, Record<string, PoseData>> = {
  delt_raise: require('@/lib/figures/v2/poses/delt_raise.json').cwiczenia, shrug: require('@/lib/figures/v2/poses/shrug.json').cwiczenia, rotator_cuff: require('@/lib/figures/v2/poses/rotator_cuff.json').cwiczenia,
  forearm: require('@/lib/figures/v2/poses/forearm.json').cwiczenia, carry: require('@/lib/figures/v2/poses/carry.json').cwiczenia,
};
const KEYS: [Fam, string][] = FAMS.flatMap(f => Object.keys(FILES[f]).map(k => [f, k] as [Fam, string]));
const ALL = assignAll();
const SAVED = Object.fromEntries(FAMS.map(f => [f, FAMILY[f as FamilyId].status])) as Record<Fam, 'ready' | 'planned'>;
beforeAll(() => { for (const f of FAMS) FAMILY[f as FamilyId].status = 'ready'; });
afterAll(() => { for (const f of FAMS) FAMILY[f as FamilyId].status = SAVED[f]; });

const lib = (key: string) => ({ lib: true as const, libKey: key });
const AI = RN.AccessibilityInfo as unknown as { isReduceMotionEnabled: jest.Mock };
const setReduce = (v: boolean) => { AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(v)); };
const flush = async () => { await act(async () => { await Promise.resolve(); }); };
afterEach(() => { applyLang('pl'); jest.useRealTimers(); AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(false)); });

/* Niezależny rachunek: wartość stawu `j` strony `s` w pozycji u wprost z klatek kontraktu i kątów silnika (bez kodu wyboru z figure.ts). */
const val = (d: PoseData, j: MeasuredJoint, s: Side, u: number): number => jointAngles(keyframeFrame(d, u).sk, s)[j];
const series = (d: PoseData, j: MeasuredJoint, s: Side): number[] => Array.from({ length: 25 }, (_, i) => val(d, j, s, (d.petla === 'cykl_lustro' ? 2 : 1) * i / 24)); /* tryb cykliczny (marsz, 27.10.2026): zakres liczony na całej pętli, razem z połową w lustrze */
const rangeOf = (a: number[]): number => Math.max(...a) - Math.min(...a);
const uiOf = (f: Fam, k: string) => { const u = DATA_UI[f]; const x = u.exceptions?.[k]; return { joints: x?.joints ?? u.joints, names: x?.names ?? u.names, hide: !!x?.hideAngle }; };
/** Oczekiwany wybór: staw i strona o największym zakresie (przy równych — pierwszy kandydat, strona prawa). */
function expectedPick(f: Fam, k: string): { joint: MeasuredJoint; side: Side; range: number } {
  const d = FILES[f][k]; let best = { joint: uiOf(f, k).joints[0], side: 'R' as Side, range: -1 };
  for (const j of uiOf(f, k).joints) for (const s of SIDES) { const r = rangeOf(series(d, j, s)); if (r > best.range + 1e-9) best = { joint: j, side: s, range: r }; }
  return best;
}
const spec = (k: string) => figureSpec(k)!;

describe('dane: 63 ćwiczenia pięciu rodzin (logika)', () => {
  test('rodziny mają 30 + 8 + 7 + 11 + 7 ćwiczeń z danymi; każde należy do swojej rodziny i ma figurę z danych (status rodziny w tym pliku „gotowa”)', () => {
    expect(FAMS.map(f => Object.keys(FILES[f]).length)).toEqual([30, 8, 7, 11, 7]); expect(KEYS.length).toBe(63);
    for (const [f, k] of KEYS) { expect([k, ALL[k]]).toEqual([k, f]); const s = spec(k); expect([k, s.family, 'data' in s.variant]).toEqual([k, f, true]); }
  });
  test('każda rodzina ma wpis DATA_UI; kandydaci stawów (także w wyjątkach) mają jedną jednostkę, a wyjątki dotyczą istniejących ćwiczeń', () => {
    for (const f of FAMS) {
      const u = DATA_UI[f]; expect([f, !!u]).toEqual([f, true]); expect([f, u.joints.length > 0]).toEqual([f, true]);
      for (const k of Object.keys(u.exceptions ?? {})) expect([f, k, k in FILES[f]]).toEqual([f, k, true]);
      const all = [...u.joints, ...Object.values(u.exceptions ?? {}).flatMap(x => x.joints ?? [])];
      expect([f, new Set(all.map(j => MEASURE_UNIT[j])).size]).toEqual([f, 1]);
    }
  });
  test('konwencja progu ruchu: jedna stała (15° albo 2 cm), każdy staw ma jednostkę', () => {
    expect(MIN_MEASURED_ROM).toEqual({ deg: 15, cm: 2 });
    for (const j of ['knee', 'elbow', 'hip', 'shElev', 'shAbd', 'shRot', 'shrug', 'protract', 'wristFlex', 'forearmRoll'] as MeasuredJoint[]) expect([j, ['deg', 'cm'].includes(MEASURE_UNIT[j])]).toEqual([j, true]);
    expect([MEASURE_UNIT.shrug, MEASURE_UNIT.protract, MEASURE_UNIT.wristFlex]).toEqual(['cm', 'cm', 'deg']);
  });
  test('mierzony staw to ten (i ta strona), który w ćwiczeniu rusza się najbardziej; linia kąta jest pokazana tylko przy ruchu > progu (stopnie 15, cm 2) i bez wyjątku „ukryj”', () => {
    for (const [f, k] of KEYS) {
      const p = expectedPick(f, k); const s = spec(k);
      expect([k, measuredJoint(s)]).toEqual([k, p.joint]);
      const want = !uiOf(f, k).hide && p.range > MIN_MEASURED_ROM[MEASURE_UNIT[p.joint]];
      expect([k, angleLineShown(s)]).toEqual([k, want]);
      for (const u of [0, 0.25, 0.5, 1]) { const m = measuredAngle(s, u); expect([k, u, m.joint, m.unit]).toEqual([k, u, p.joint, MEASURE_UNIT[p.joint]]); expect([k, u, Math.abs(m.deg - val(FILES[f][k], p.joint, p.side, u)) < 1e-6]).toEqual([k, u, true]); }
    }
  });
  test('dla każdej rodziny pokazany staw ma zakres ruchu > progu; ukryta jest tylko linia z jawnego wyjątku (Car Drivers: ręce pracują naprzemiennie), a każda rodzina ma ćwiczenia z linią', () => {
    const hidden = KEYS.filter(([, k]) => !angleLineShown(spec(k))).map(([, k]) => k);
    expect(hidden).toEqual(['Car Drivers']);
    for (const [f, k] of KEYS.filter(([, k]) => angleLineShown(spec(k)))) { const p = expectedPick(f, k); expect([k, p.range > MIN_MEASURED_ROM[MEASURE_UNIT[p.joint]]]).toEqual([k, true]); }
    for (const f of FAMS) expect([f, KEYS.filter(([x, k]) => x === f && angleLineShown(spec(k))).length > 0]).toEqual([f, true]);
  });
  test('przypięcie wyboru: stawy per rodzina (liczba ćwiczeń)', () => {
    const tab: Record<string, Record<string, number>> = {};
    for (const [f, k] of KEYS) { const j = measuredJoint(spec(k)); tab[f] = tab[f] ?? {}; tab[f][j] = (tab[f][j] ?? 0) + 1; }
    expect(tab).toEqual({
      delt_raise: { shElev: 26, shAbd: 4 }, shrug: { shrug: 7, protract: 1 }, rotator_cuff: { shRot: 5, shAbd: 2 }, forearm: { wristFlex: 8, elbow: 1, forearmRoll: 2 }, carry: { knee: 7 },
    });
  });
  test('ćwiczenie jednoręczne: mierzona jest ręka, która pracuje (największy zakres), nie średnia z ręką nieruchomą', () => {
    const k = 'One-Arm Lateral Raise (hantel)'; const d = FILES.delt_raise[k]; const p = expectedPick('delt_raise', k);
    const R = rangeOf(series(d, p.joint, 'R')), L = rangeOf(series(d, p.joint, 'L')); expect(Math.max(R, L)).toBeGreaterThan(2 * Math.min(R, L) + 5);
    const s = spec(k); const mid = (val(d, p.joint, 'R', 1) + val(d, p.joint, 'L', 1)) / 2;
    expect(Math.abs(measuredAngle(s, 1).deg - val(d, p.joint, p.side, 1))).toBeLessThan(1e-6); expect(Math.abs(measuredAngle(s, 1).deg - mid)).toBeGreaterThan(5);
  });
  test('rotacja zewnętrzna ma znak dodatni (koniec ruchu większy od początku), wewnętrzna ujemny', () => {
    for (const k of ['External Rotation (hantel)', 'External Rotation (linki)', 'External Rotation with Band']) expect([k, measuredAngle(spec(k), 1).deg > measuredAngle(spec(k), 0).deg + 60]).toEqual([k, true]);
    for (const k of ['Internal Rotation with Band', 'Cable Internal Rotation']) expect([k, measuredAngle(spec(k), 1).deg < measuredAngle(spec(k), 0).deg - 60]).toEqual([k, true]);
  });
  test('szrugsy: unoszenie barków rośnie od 0 do 6 cm (EXT_ROM), ściąganie łopatek (Middle Back Shrug) kończy się cofnięciem barków (wartość ujemna)', () => {
    for (const k of ['Shrugs (sztanga)', 'Shrugs (hantle)', 'Leverage Shrug']) { const m1 = measuredAngle(spec(k), 1), m0 = measuredAngle(spec(k), 0); expect([k, m1.unit, m0.deg, Math.round(m1.deg)]).toEqual([k, 'cm', 0, 6]); }
    const mb = spec('Middle Back Shrug'); expect(measuredJoint(mb)).toBe('protract'); expect(measuredAngle(mb, 0).deg).toBeGreaterThan(0); expect(measuredAngle(mb, 1).deg).toBeLessThan(0);
  });
  test('przedramię: zgięcie nadgarstka dodatnie, wyprost ujemny; odwrotne uginanie nadgarstka kończy wyprostem; leżące nawracanie mierzy obrót przedramienia, odwrotne uginanie talerza łokieć', () => {
    expect(measuredAngle(spec('Barbell Wrist Curl'), 1).deg).toBeGreaterThan(40); expect(measuredAngle(spec('Barbell Reverse Wrist Curl'), 1).deg).toBeLessThan(-40);
    expect(measuredJoint(spec('Dumbbell Lying Pronation'))).toBe('forearmRoll'); expect(measuredJoint(spec('Reverse Plate Curls'))).toBe('elbow');
  });
});

describe('nazwy faz i licznik (logika)', () => {
  test('nazwy faz per ćwiczenie: wznosy i szrugsy Unoszenie/Opuszczanie, rotacje Obrót/Powrót, przedramię Uginanie/Opuszczanie; wyjątki: rozsuwanie taśmy, ściąganie łopatek, nawracanie', () => {
    const exc: Record<string, [string, string]> = {
      'Band Pull Apart': ['Rozsuwanie', 'Powrót'], 'Middle Back Shrug': ['Ściąganie', 'Powrót'], 'Reverse Flyes With External Rotation': ['Unoszenie', 'Opuszczanie'],
      'Dumbbell Lying Pronation': ['Obrót', 'Powrót'], 'Dumbbell Lying Supination': ['Obrót', 'Powrót'],
    };
    const fam: Record<string, [string, string]> = { delt_raise: ['Unoszenie', 'Opuszczanie'], shrug: ['Unoszenie', 'Opuszczanie'], rotator_cuff: ['Obrót', 'Powrót'], forearm: ['Uginanie', 'Opuszczanie'], carry: ['Marsz', 'Marsz'] };
    for (const [f, k] of KEYS) { const n = phaseNames(spec(k)); expect([k, [n.first, n.second]]).toEqual([k, exc[k] ?? fam[f]]); }
  });
  test('ruch z opuszczaniem: pętla Nazwa 1 s · Pauza · Nazwa 2 s · Pauza (tempo ilustracyjne jak w podciąganiu); noszenie: jedna faza „Marsz” bez sekund i bez pauz', () => {
    for (const [f, k] of KEYS.filter(([f]) => f !== 'carry')) { const n = phaseNames(spec(k)); expect([k, phasesFor(spec(k)).map(p => [p.name, p.ms])]).toEqual([k, [[n.first, 1000], ['Pauza', 500], [n.second, 2000], ['Pauza', 500]]]); expect([f, spec(k).lowerFirst]).toEqual([f, false]); }
    for (const [, k] of KEYS.filter(([f]) => f === 'carry')) { const ph = phasesFor(spec(k)); expect([k, ph]).toEqual([k, [{ name: 'Marsz', ms: loopLength(false), untimed: true }]]); expect(metricFor(k)).toMatch(/distance/); }
    expect(walkPhases()).toEqual([{ name: 'Marsz', ms: TEMPO.holdMs * 2 + TEMPO.downMs + TEMPO.upMs, untimed: true }]);
  });
  test('żadna z faz nowych rodzin nie nazywa ruchu podciąganiem, a noszenie nie ma „Opuszczanie” ani „Pauza”', () => {
    for (const [f, k] of KEYS) { const names = phasesFor(spec(k)).map(p => p.name); expect([k, names.includes('Podciąganie')]).toEqual([k, false]); if (f === 'carry') expect([k, names.some(n => n === 'Opuszczanie' || n === 'Pauza')]).toEqual([k, false]); }
  });
});

/* Silnik: rotacja barku liczona z geometrii. Ramię i przedramię ustawione ręcznie na szkielecie stojącym — wynik znany z konstrukcji. */
describe('silnik: rotacja barku shRot (znana konstrukcja)', () => {
  const STAND = { pelvis: [0, 88, 0], trunkPitch: 0, legs: { R: { ankle: [0, 7, 14] }, L: { ankle: [0, 7, -14] } }, arms: { R: { grip: [8, 80, 24] }, L: { grip: [8, 80, -24] } } } as const;
  const base = (): Skeleton => solveSkeleton(STAND as never);
  const withArm = (sk: Skeleton, s: Side, upper: V3, fore: V3): Skeleton => {
    const a = sk.arms[s]; const elbow: V3 = [a.shoulder[0] + upper[0] * 30, a.shoulder[1] + upper[1] * 30, a.shoulder[2] + upper[2] * 30];
    const wrist: V3 = [elbow[0] + fore[0] * 28, elbow[1] + fore[1] * 28, elbow[2] + fore[2] * 28]; return { ...sk, arms: { ...sk.arms, [s]: { ...a, elbow, wrist, grip: wrist, bent: false } } };
  };
  const dir = (deg: number, out: number): V3 => [Math.cos(deg * Math.PI / 180), 0, out * Math.sin(deg * Math.PI / 180)];
  test('ramię przy boku, łokieć zgięty: przedramię do przodu 0°, na zewnątrz dodatnio, do wewnątrz ujemnie — po obu stronach ciała', () => {
    for (const s of SIDES) { const out = s === 'R' ? 1 : -1;
      for (const a of [-90, -45, 0, 30, 90]) expect([s, a, Math.round(jointAngles(withArm(base(), s, [0, -1, 0], dir(a, out)), s).shRot)]).toEqual([s, a, a]);
    }
  });
  test('ramię odwiedzone w bok do poziomu: przedramię do przodu 0°, w górę +90° (zewnętrzna), w dół −90° (wewnętrzna)', () => {
    for (const s of SIDES) { const out = s === 'R' ? 1 : -1;
      const rot = (f: V3) => jointAngles(withArm(base(), s, [0, 0, out], f), s).shRot;
      expect([s, Math.round(rot([1, 0, 0]))]).toEqual([s, 0]); expect([s, Math.round(rot([0, 1, 0]))]).toEqual([s, 90]); expect([s, Math.round(rot([0, -1, 0]))]).toEqual([s, -90]);
    }
  });
  test('przypadki graniczne: przedramię w osi ramienia → 0; ramię skierowane w przód (brak kierunku odniesienia) → 0', () => {
    expect(jointAngles(withArm(base(), 'R', [0, -1, 0], [0, -1, 0]), 'R').shRot).toBe(0); expect(jointAngles(withArm(base(), 'R', [1, 0, 0], [0, 1, 0]), 'R').shRot).toBe(0);
  });
});

describe('linia pomiaru: tekst i etykiety (logika)', () => {
  test('stopnie i cm: szablon, etykieta, zaokrąglenie; znak wybiera etykietę (nadgarstek, rotacja, obrót przedramienia, barki), a liczba jest bez znaku', () => {
    const c = (joint: MeasuredJoint, deg: number) => measureLine({ joint, deg, unit: MEASURE_UNIT[joint] });
    const D = 'Kąt na rysunku: {staw} {n}°';
    expect(c('knee', 41.6)).toEqual({ template: D, staw: 'zgięcie kolana', n: 42 }); expect(c('elbow', 90)).toEqual({ template: D, staw: 'zgięcie łokcia', n: 90 }); expect(c('hip', -3.2).n).toBe(-3);
    expect(c('shElev', 60)).toEqual({ template: D, staw: 'uniesienie ramienia', n: 60 }); expect(c('shAbd', 44.4).staw).toBe('ramię odsunięte w bok');
    expect(c('shRot', 35.2)).toEqual({ template: D, staw: 'obrót ramienia na zewnątrz', n: 35 }); expect(c('shRot', -35.2)).toEqual({ template: D, staw: 'obrót ramienia do wewnątrz', n: 35 });
    expect(c('wristFlex', 52)).toMatchObject({ staw: 'zgięcie nadgarstka', n: 52 }); expect(c('wristFlex', -48.4)).toMatchObject({ staw: 'wyprost nadgarstka', n: 48 });
    expect(c('forearmRoll', 70)).toMatchObject({ staw: 'obrót przedramienia dłonią w górę', n: 70 }); expect(c('forearmRoll', -70)).toMatchObject({ staw: 'obrót przedramienia dłonią w dół', n: 70 });
    expect(c('shrug', 5.6)).toEqual({ template: 'Przesunięcie na rysunku: {staw} {n} cm', staw: 'barki w górę', n: 6 }); expect(c('shrug', -2.2)).toMatchObject({ staw: 'barki w dół', n: 2 });
    expect(c('protract', 3.9)).toMatchObject({ staw: 'barki do przodu', n: 4 }); expect(c('protract', -4)).toMatchObject({ staw: 'barki do tyłu', n: 4 });
    expect(c('wristFlex', -0.2)).toMatchObject({ staw: 'zgięcie nadgarstka', n: 0 }); /* po zaokrągleniu do 0 nie ma wyprostu */
  });
  test('słownik EN: każdy szablon, etykieta i nazwa fazy nowych rodzin ma tłumaczenie; parametry {staw}, {n} zachowane', () => {
    const keys = ['Przesunięcie na rysunku: {staw} {n} cm', 'uniesienie ramienia', 'ramię odsunięte w bok', 'obrót ramienia na zewnątrz', 'obrót ramienia do wewnątrz', 'zgięcie nadgarstka', 'wyprost nadgarstka',
      'obrót przedramienia dłonią w górę', 'obrót przedramienia dłonią w dół', 'barki w górę', 'barki w dół', 'barki do przodu', 'barki do tyłu', 'Unoszenie', 'Obrót', 'Powrót', 'Rozsuwanie', 'Ściąganie', 'Uginanie', 'Marsz'];
    for (const k of keys) { expect([k, typeof EN[k], (EN[k] ?? '').length > 0]).toEqual([k, 'string', true]); expect([k, (k.match(/\{\w+\}/g) ?? []).join()]).toEqual([k, (EN[k].match(/\{\w+\}/g) ?? []).join()]); }
  });
});

describe('ekran: karta z rodziną z danych (komponent)', () => {
  const angleText = (): string => { const el = screen.queryByTestId('exercise-figure-v2-angle'); return el ? String(React.Children.toArray(el.props.children).join('')) : ''; };
  const phasesText = (): string => screen.getByTestId('exercise-figure-v2-phases').findAllByType(RN.Text).map(n => String(React.Children.toArray(n.props.children).join(''))).join('|');
  let cur: { unmount: () => void } | null = null;
  const show = async (k: string) => { cur?.unmount(); setReduce(true); cur = render(<ExerciseFigureV2 exercise={lib(k)} />); await flush(); };
  afterEach(() => { cur = null; });
  test('wznos bokiem: kąt stawu ramienia (nie kolana), licznik Unoszenie 1 s · Opuszczanie 2 s; wartość = pozycja końcowa z geometrii', async () => {
    await show('Lateral Raise (hantle)'); const m = measuredAngle(spec('Lateral Raise (hantle)'), 1);
    expect(angleText()).toBe(`Kąt na rysunku: uniesienie ramienia ${Math.round(m.deg)}°`); expect(angleText()).not.toMatch(/kolana|łokcia|biodra/); expect(phasesText()).toBe('Unoszenie 1 s ·|Pauza ·|Opuszczanie 2 s');
  });
  test('szrugsy: przesunięcie w cm zamiast kąta; ściąganie łopatek: barki do tyłu i fazy Ściąganie/Powrót', async () => {
    await show('Shrugs (sztanga)'); expect(angleText()).toBe('Przesunięcie na rysunku: barki w górę 6 cm'); expect(angleText()).not.toMatch(/°/);
    await show('Middle Back Shrug'); expect(angleText()).toBe('Przesunięcie na rysunku: barki do tyłu 4 cm'); expect(phasesText()).toBe('Ściąganie 1 s ·|Pauza ·|Powrót 2 s');
  });
  test('rotacja i przedramię: etykiety wynikają ze znaku (zewnętrzna/wewnętrzna, zgięcie/wyprost nadgarstka)', async () => {
    await show('External Rotation (hantel)'); expect(angleText()).toMatch(/^Kąt na rysunku: obrót ramienia na zewnątrz \d+°$/); expect(phasesText()).toContain('Obrót 1 s');
    await show('Barbell Reverse Wrist Curl'); expect(angleText()).toMatch(/^Kąt na rysunku: wyprost nadgarstka \d+°$/);
  });
  test('noszenie: licznik to samo słowo „Marsz” bez sekund, bez „Opuszczanie” i „Pauza”; kąt: kolano', async () => {
    await show('Farmer\'s Walk'); expect(phasesText()).toBe('Marsz'); expect(phasesText()).not.toMatch(/Opuszczanie|Pauza|[0-9]/); expect(angleText()).toMatch(/^Kąt na rysunku: zgięcie kolana \d+°$/);
  });
  test('ćwiczenie bez jednego stawu opisującego ruch (Car Drivers): bez linii kąta, licznik faz zostaje', async () => {
    await show('Car Drivers'); expect(screen.queryByTestId('exercise-figure-v2-angle')).toBeNull(); expect(screen.getByTestId('exercise-figure-v2-phases')).toBeTruthy();
  });
  test('animacja: noszenie podczas pętli ma cały czas jedną fazę „Marsz”, a kąt zmienia się z klatką', async () => {
    jest.useFakeTimers(); setReduce(false); render(<ExerciseFigureV2 exercise={lib('Farmer\'s Walk')} />); await flush();
    const a0 = angleText(); await act(async () => { jest.advanceTimersByTime(TEMPO.holdMs + TEMPO.upMs / 2); }); expect(angleText()).not.toBe(a0);
    await act(async () => { jest.advanceTimersByTime(1700); }); expect(phasesText()).toBe('Marsz');
  });
  test('VoiceOver: nowe linie mają język interfejsu i ograniczoną skalę tekstu jak istniejąca linia kąta; pomiar kursywą (nie zalecenie)', async () => {
    await show('Shrugs (sztanga)'); const a = screen.getByTestId('exercise-figure-v2-angle');
    expect(a.props.accessibilityLanguage).toBe('pl'); expect(a.props.maxFontSizeMultiplier).toBe(TEXT_SCALE_MAX); expect(a.props.style.fontStyle).toBe('italic');
    const ph = screen.getByTestId('exercise-figure-v2-phases').findAllByType(RN.Text)[0]; expect(ph.props.accessibilityLanguage).toBe('pl'); expect(ph.props.maxFontSizeMultiplier).toBe(TEXT_SCALE_MAX);
  });
  test('język EN: szablony, etykiety i nazwy faz po angielsku', async () => {
    applyLang('en'); await show('Barbell Wrist Curl'); const m = measuredAngle(spec('Barbell Wrist Curl'), 1);
    expect(angleText()).toBe(`Angle in the drawing: wrist flexion ${Math.round(m.deg)}°`); expect(phasesText()).toBe('Curling 1 s ·|Pause ·|Lowering 2 s');
    await show('Shrugs (sztanga)'); expect(angleText()).toBe('Movement in the drawing: shoulders up 6 cm');
    await show('Farmer\'s Walk'); expect(phasesText()).toBe('Walking');
  });
  test('podciąganie bez zmian: Dead Hang (izometria) nadal pokazuje linię kąta (łokieć), Pull Up też', () => {
    expect(angleLineShown(spec('Dead Hang'))).toBe(true); expect(measuredJoint(spec('Dead Hang'))).toBe('elbow'); expect(angleLineShown(spec('Pull Up'))).toBe(true);
  });
});
