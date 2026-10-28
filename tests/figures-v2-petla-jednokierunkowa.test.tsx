/*
 * Figury v2 — tryb pętli jednokierunkowej (`petla: 'jednokierunkowa'`, 28.10.2026, recenzja treści kart plyo/sanie, Z2): ćwiczenia, w których u: 0 → 1 obejmuje CAŁE powtórzenie (skok: stanie → ugięcie → lot → lądowanie;
 * rzut piłką: od przysiadu albo znad głowy do końca rzutu), a wahadło odtwarzałoby w powrocie skok albo rzut wstecz (zeskok tyłem ze skrzyni, piłka z podłogi do rąk). Tryb: 0 → 1 w czasie, krótka pauza na końcu,
 * skok do u = 0 (bez cofania ruchu), licznik: jedna faza bez sekund („Skok” / „Rzut”). Tempo = KONWENCJA ilustracyjna bez źródła (jak WALK).
 * Zakres: 27 ćwiczeń plyo i 6 w sled_throw (oba Slamy, trzy rzuty, Wall Ball); rodziny NIE są podłączone (status planned) — testy ustawiają status tymczasowo, jak tests/figures-v2-chod-cykliczny.test.tsx.
 * Rodzaje (docs/20): logika (czas pętli), kontrakt (schemat, walidator), dane (33 ćwiczenia), silnik (figure.ts), ekran (licznik, pauza, Ogranicz ruch), języki (PL/EN), niezmienniki (wahadło i marsz bez zmian).
 */
import React from 'react';
import * as RN from 'react-native';
import { render, screen, act, fireEvent } from '@testing-library/react-native';
import { ExerciseFigureV2 } from '@/components/ExerciseFigureV2';
import {
  FAMILY, LOOP_MODES, ONE_WAY, SIDES, checkSchema, figureSpec, keyframeFrame, loopOf, loopSpan, measuredAngle, oneWayAt, oneWayLength, oneWayPhases, phasesFor, poseLoopSpan, poseSchema,
  dataUiForPose, GAIT_UI, ONE_WAY_UI, staticPositions, validatePose, pendulumFrames, uAt, TEMPO,
  type FamilyId, type PoseData, type RomData,
} from '@/lib/figures/v2';
import { applyLang } from '@/lib/i18n';
import { EN } from '@/lib/i18n.en';

jest.mock('@/lib/figures/v2/poseData', () => {
  const real = jest.requireActual('@/lib/figures/v2/poseData');
  const EXTRA = ['plyo', 'sled_throw'];
  return { ...real, poseDataFor: (key: string, family: string) => {
    if (!EXTRA.includes(family)) return real.poseDataFor(key, family);
    const f = jest.requireActual(`@/lib/figures/v2/poses/${family}.json`).cwiczenia as Record<string, { cwiczenie: string; rodzina: string }>;
    const d = Object.prototype.hasOwnProperty.call(f, key) ? f[key] : undefined; return d && d.cwiczenie === key && d.rodzina === family ? d : null;
  } };
});

jest.setTimeout(240000);
type PoseFile = { cwiczenia: Record<string, PoseData> };
const POZY: Record<string, PoseFile> = { plyo: require('@/lib/figures/v2/poses/plyo.json'), sled_throw: require('@/lib/figures/v2/poses/sled_throw.json') };
const RZUTY = ['Medicine Ball Slam', 'One-Arm Medicine Ball Slam', 'Standing Two-Arm Overhead Throw', 'Backward Medicine Ball Throw', 'Medicine Ball Scoop Throw', 'Wall Ball'];
const JEDNOKIERUNKOWE: [string, string][] = [...Object.keys(POZY.plyo.cwiczenia).map(k => ['plyo', k] as [string, string]), ...RZUTY.map(k => ['sled_throw', k] as [string, string])];
const dane = (f: string, k: string): PoseData => POZY[f].cwiczenia[k];
const SAVED: Record<string, 'ready' | 'planned'> = Object.fromEntries(['plyo', 'sled_throw'].map(f => [f, FAMILY[f as FamilyId].status]));
beforeAll(() => { for (const f of Object.keys(SAVED)) FAMILY[f as FamilyId].status = 'ready'; });
afterAll(() => { for (const f of Object.keys(SAVED)) FAMILY[f as FamilyId].status = SAVED[f]; });
const ROM: RomData = { side: { hip: { min: -30, max: 130 }, knee: { min: 0, max: 150 }, ankle: { min: -60, max: 40 }, el: { min: 0, max: 150 }, sh: { min: -60, max: 180 } }, front: { abd: { min: 0, max: 180 } } };

describe('logika: czas pętli jednokierunkowej (jedno miejsce: ONE_WAY)', () => {
  test('ONE_WAY to jedyna liczba czasu; długość pętli = pauza na starcie + ruch + pauza na końcu', () => {
    expect(ONE_WAY).toEqual({ repMs: 1500, holdStartMs: 500, holdEndMs: 500 }); expect(oneWayLength()).toBe(2500);
  });
  test('oneWayAt: pauza na starcie (u = 0), ruch liniowy 0 → 1, pauza na końcu (u = 1), potem skok do u = 0 — bez cofania', () => {
    expect([0, 250, 499].map(ms => oneWayAt(ms))).toEqual([0, 0, 0]);
    expect(oneWayAt(500)).toBe(0); expect(oneWayAt(500 + 750)).toBeCloseTo(0.5, 9); expect(oneWayAt(500 + 1500)).toBe(1); expect(oneWayAt(2499)).toBe(1);
    expect(oneWayAt(2500)).toBe(0); expect(oneWayAt(2500 + 1250)).toBeCloseTo(0.5, 9); expect(oneWayAt(-250)).toBe(1);
    let prev = oneWayAt(0), skoki = 0; for (let ms = 33; ms < 5 * oneWayLength(); ms += 33) { const x = oneWayAt(ms); if (x < prev) { skoki++; expect(x).toBe(0); /* jedyny spadek to powrót do u = 0 na początku pętli */ } prev = x; }
    expect(skoki).toBe(4);
  });
  test('tempo wahadła nie wpływa na tryb jednokierunkowy; wahadło bez zmian (uAt)', () => {
    expect(uAt(0, true)).toBe(0); expect(TEMPO).toMatchObject({ downMs: 2000, upMs: 1000, holdMs: 500 });
  });
  test('oneWayPhases: jedna faza o podanej nazwie, bez sekund (untimed), na całą pętlę', () => {
    expect(oneWayPhases('Skok')).toEqual([{ name: 'Skok', ms: oneWayLength(), untimed: true }]); expect(oneWayPhases('Rzut')[0].name).toBe('Rzut');
  });
});

describe('kontrakt: pole petla = jednokierunkowa (schemat, walidator, klatki)', () => {
  test('LOOP_MODES i schemat zawierają trzeci tryb; wartość spoza listy odrzucona; pole nadal opcjonalne', () => {
    expect([...LOOP_MODES]).toEqual(['wahadlo', 'cykl_lustro', 'jednokierunkowa']);
    const s = poseSchema('generic'); const p = s.properties as Record<string, { enum?: string[] }>; expect(p.petla.enum).toEqual(['wahadlo', 'cykl_lustro', 'jednokierunkowa']); expect((s.required as string[]).includes('petla')).toBe(false);
    const d = dane('plyo', 'Jump Squat'); expect(checkSchema(d, s)).toEqual([]); expect(checkSchema({ ...d, petla: 'jednokierunkowa' }, s)).toEqual([]); expect(checkSchema({ ...d, petla: 'w_kolko' }, s).length).toBeGreaterThan(0);
  });
  test('zakres pętli to 1 (jak wahadło): klatki u ∈ [0, 1], bez lustra; klatka danych w u identyczna jak bez pola', () => {
    const d = dane('plyo', 'Jump Squat'); expect(d.petla).toBe('jednokierunkowa'); expect(poseLoopSpan(d)).toBe(1);
    const bez: PoseData = { ...d, petla: undefined };
    for (const u of [0, 0.3, 0.72, 1]) expect(keyframeFrame(d, u).sk.pelvis).toEqual(keyframeFrame(bez, u).sk.pelvis);
    expect(pendulumFrames(d, 8).length).toBe(17);
  });
  test('walidator nie zgłasza kodu „petla” dla trybu jednokierunkowego (to nie cykl z lustrem: brak styku i reguły stopy marszu)', () => {
    for (const [f, k] of [['plyo', 'Jump Squat'], ['plyo', 'Depth Jump'], ['sled_throw', 'Wall Ball']] as [string, string][]) {
      const d = dane(f, k); const w = validatePose(d, { family: f, exercise: k, errorCues: d.bledy.map(b => b.cue), rom: ROM, dynamic: true, allow: { ankleMin: -90, hipMin: -40, elbow: 150, shElev: 180, shSag: 200 } });
      expect([k, w.filter(x => x.kod === 'petla')]).toEqual([k, []]);
    }
  });
});

describe('dane: 33 ćwiczenia w trybie jednokierunkowym', () => {
  test('dokładnie 27 z plyo i 6 z sled_throw ma petla = jednokierunkowa; Sled Push i Sled Drag zostają cyklicznymi; reszta plików bez zmian', () => {
    const z: string[] = []; for (const f of Object.keys(POZY)) for (const [k, d] of Object.entries(POZY[f].cwiczenia)) if (d.petla === 'jednokierunkowa') z.push(`${f}/${k}`);
    expect(z.sort()).toEqual(JEDNOKIERUNKOWE.map(([f, k]) => `${f}/${k}`).sort()); expect(z.length).toBe(33); expect(Object.keys(POZY.plyo.cwiczenia).length).toBe(27);
    expect(dane('sled_throw', 'Sled Push').petla).toBe('cykl_lustro'); expect(dane('sled_throw', 'Sled Drag (Harness)').petla).toBe('cykl_lustro');
    expect(Object.keys(POZY.sled_throw.cwiczenia).sort()).toEqual([...RZUTY, 'Sled Push', 'Sled Drag (Harness)'].sort());
  });
  test.each(JEDNOKIERUNKOWE)('%s / %s: pole petla, wynik poza zakresem lustra (brak lustroRece), u zaczyna od 0 i kończy w 1', (f, k) => {
    const d = dane(f, k); expect(d.petla).toBe('jednokierunkowa'); expect(d.lustroRece).toBeUndefined(); expect([d.klatki[0].u, d.klatki[d.klatki.length - 1].u]).toEqual([0, 1]);
  });
});

describe('silnik: figure.ts — tryb pętli, fazy i prezentacja', () => {
  const sp = (k: string) => figureSpec(k)!;
  test.each(JEDNOKIERUNKOWE)('%s / %s: figura istnieje, loopOf = jednokierunkowa, zakres 1, jedna faza bez sekund', (f, k) => {
    const s = sp(k); expect([k, s !== null]).toEqual([k, true]); expect([k, loopOf(s), loopSpan(s)]).toEqual([k, 'jednokierunkowa', 1]);
    const ph = phasesFor(s); expect(ph).toHaveLength(1); expect(ph[0]).toEqual({ name: f === 'plyo' ? 'Skok' : 'Rzut', ms: oneWayLength(), untimed: true });
  });
  test('pozycje statyczne („Ogranicz ruch”, pauza): start i koniec, bez trzeciej pozycji', () => { expect(staticPositions(sp('Jump Squat'))).toEqual([0, 1]); });
  test('dataUiForPose: jednokierunkowe dostają ONE_WAY_UI rodziny (Skok / Rzut, kolano i biodro); Sled Push nadal GAIT_UI; wahadło bez pola — null w rodzinie bez wpisu', () => {
    expect(dataUiForPose('plyo', dane('plyo', 'Box Jump'))).toBe(ONE_WAY_UI.plyo); expect(dataUiForPose('sled_throw', dane('sled_throw', 'Wall Ball'))).toBe(ONE_WAY_UI.sled_throw);
    expect(ONE_WAY_UI.plyo).toMatchObject({ names: { first: 'Skok', second: 'Skok' }, joints: ['knee', 'hip'] }); expect(ONE_WAY_UI.sled_throw).toMatchObject({ names: { first: 'Rzut', second: 'Rzut' }, joints: ['knee', 'hip'] });
    expect(dataUiForPose('sled_throw', dane('sled_throw', 'Sled Push'))).toBe(GAIT_UI);
    expect(dataUiForPose('sled_throw', { ...dane('sled_throw', 'Wall Ball'), petla: undefined })).toBeNull();
  });
  test('rodziny z rigiem i ćwiczenia bez pola: wahadło (zgodność wsteczna)', () => {
    const s = figureSpec('Barbell Squat'); if (s) expect([loopOf(s), loopSpan(s)]).toEqual(['wahadlo', 1]);
  });
});

describe('niezmienniki: liczba ćwiczeń z polem petla w całym katalogu póz', () => {
  test('43 ćwiczenia z polem: 10 cykl_lustro (marsz) + 33 jednokierunkowa; żadne inne', () => {
    const fs = require('fs') as typeof import('fs'); const path = require('path') as typeof import('path'); const dir = path.join(__dirname, '..', 'lib/figures/v2/poses'); const c: Record<string, number> = {};
    for (const f of fs.readdirSync(dir).filter((x: string) => x.endsWith('.json'))) { const j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as PoseFile; for (const d of Object.values(j.cwiczenia)) if (d.petla !== undefined) c[d.petla] = (c[d.petla] ?? 0) + 1; }
    expect(c).toEqual({ cykl_lustro: 10, jednokierunkowa: 33 });
  });
});

describe('ekran: karta ćwiczenia z pętlą jednokierunkową (komponent)', () => {
  const AI = RN.AccessibilityInfo as unknown as { isReduceMotionEnabled: jest.Mock };
  const setReduce = (v: boolean) => { AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(v)); };
  const flush = async () => { await act(async () => { await Promise.resolve(); }); };
  const lib = (key: string) => ({ lib: true as const, libKey: key });
  afterEach(() => { applyLang('pl'); jest.useRealTimers(); AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(false)); });
  const angleVal = (): number => { const el = screen.getByTestId('exercise-figure-v2-angle'); return Number(String(React.Children.toArray(el.props.children).join('')).match(/(-?\d+)°/)![1]); };
  const phasesText = (): string => screen.getByTestId('exercise-figure-v2-phases').findAllByType(RN.Text).map(n => String(React.Children.toArray(n.props.children).join(''))).join('|');

  test('Jump Squat: kąt w chwili t równa się pomiarowi w oneWayAt(t); po końcu pętli wraca skokiem do pozycji wyjściowej (nie odtwarza ruchu wstecz)', async () => {
    jest.useFakeTimers(); setReduce(false); render(<ExerciseFigureV2 exercise={lib('Jump Squat')} />); await flush();
    const s = figureSpec('Jump Squat')!; expect(angleVal()).toBe(Math.round(measuredAngle(s, 0).deg));
    let t = 0; const widziane: number[] = [];
    for (const dt of [726, 396, 396, 495, 495, 495]) { await act(async () => { jest.advanceTimersByTime(dt); }); t += dt; const exp = Math.round(measuredAngle(s, oneWayAt(t)).deg); widziane.push(angleVal()); expect(Math.abs(angleVal() - exp)).toBeLessThanOrEqual(1); }
    /* t = 3003 ms > długość pętli 2500: pozycja z drugiego obiegu (u rośnie od 0), a nie z cofania (wahadło dałoby u malejące po 1 s) */
    expect(oneWayAt(t)).toBeLessThan(0.1);
  });
  test.each([['Jump Squat', 'Skok'], ['Box Jump', 'Skok'], ['Wall Ball', 'Rzut'], ['Medicine Ball Slam', 'Rzut']])('%s: licznik to jedna faza „%s” bez sekund i bez pauzy', async (k, faza) => {
    setReduce(true); render(<ExerciseFigureV2 exercise={lib(k)} />); await flush();
    expect(phasesText()).toBe(faza); expect(phasesText()).not.toMatch(/Pauza|Opuszczanie|[0-9]/);
  });
  test('„Zatrzymaj animację” zatrzymuje pętlę, „Wznów” ją wznawia', async () => {
    jest.useFakeTimers(); setReduce(false); render(<ExerciseFigureV2 exercise={lib('Broad Jump')} />); await flush();
    await act(async () => { jest.advanceTimersByTime(1000); }); fireEvent.press(screen.getByTestId('exercise-figure-v2-pause')); const a = angleVal();
    await act(async () => { jest.advanceTimersByTime(1500); }); expect(angleVal()).toBe(a);
    fireEvent.press(screen.getByTestId('exercise-figure-v2-pause')); await act(async () => { jest.advanceTimersByTime(300); }); expect(angleVal()).not.toBe(a);
  });
  test('„Ogranicz ruch”: pozycje statyczne z podpisami, bez pauzy i bez animacji', async () => {
    setReduce(true); render(<ExerciseFigureV2 exercise={lib('Lateral Bound')} />); await flush();
    expect(screen.getByTestId('exercise-figure-v2-static')).toBeTruthy(); expect(screen.queryByTestId('exercise-figure-v2-anim')).toBeNull(); expect(screen.queryByTestId('exercise-figure-v2-pause')).toBeNull();
    expect(screen.getByText('Pozycja wyjściowa')).toBeTruthy(); expect(screen.getByText('Pozycja końcowa')).toBeTruthy();
  });
  test('Wall Ball: dwa widoki (bok i przód) w animacji', async () => {
    setReduce(false); render(<ExerciseFigureV2 exercise={lib('Wall Ball')} />); await flush();
    expect(screen.getByTestId('exercise-figure-v2-side')).toBeTruthy(); expect(screen.getByTestId('exercise-figure-v2-front')).toBeTruthy();
  });
  test('język EN: „Jump” i „Throw”', async () => {
    applyLang('en'); setReduce(true); const a = render(<ExerciseFigureV2 exercise={lib('Jump Squat')} />); await flush(); expect(phasesText()).toBe('Jump'); a.unmount();
    render(<ExerciseFigureV2 exercise={lib('Wall Ball')} />); await flush(); expect(phasesText()).toBe('Throw'); expect(EN.Skok).toBe('Jump'); expect(EN.Rzut).toBe('Throw');
  });
});
