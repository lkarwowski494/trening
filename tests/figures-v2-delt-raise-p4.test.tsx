/*
 * Rodzina delt_raise — poprawka po recenzji ruchu r4 (04.11.2026): r4-W1 (WYSOKIE, dostępność): zamknięta pętla jednokierunkowa (Alternating Deltoid Raise: u = 0 i u = 1 to ten sam zwis) w trybie statycznym
 * („Ogranicz ruch”, pauza, zrzuty) pokazywała dwa identyczne zwisy. Pozycje statyczne ze szczytów ruchu (u = 0, 1/6, 2/3), podpisy „Pozycja wyjściowa / Przodem / Bokiem” przez t() + EN, VoiceOver czyta je w etykiecie obrazu.
 * Strażnik ogólny: żadna pętla jednokierunkowa (skoki, rzuty, Alternating) nie ma identycznych pozycji statycznych. r4-N2: powód wyjątku w v2-jakosc podaje szczyty 1/6 i 2/3.
 * Rodzina delt_raise nie jest podłączona (status planned) — test ustawia status tymczasowo, jak tests/figures-v2-petla-jednokierunkowa.test.tsx.
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json')));
import React from 'react';
import * as RN from 'react-native';
import * as fs from 'fs';
import * as path from 'path';
import { render, screen, act } from '@testing-library/react-native';
import { ExerciseFigureV2 } from '@/components/ExerciseFigureV2';
import { FAMILY, ONE_WAY_STATIC, ONE_WAY_REP_MS, TEMPO, figureSpec, staticPositions, staticLabels, keyframeFrame, oneWayAt, type FamilyId, type PoseData } from '@/lib/figures/v2';
import { applyLang } from '@/lib/i18n';
import { EN } from '@/lib/i18n.en';

jest.mock('@/lib/figures/v2/poseData', () => {
  const real = jest.requireActual('@/lib/figures/v2/poseData');
  const EXTRA = ['delt_raise'];
  return { ...real, poseDataFor: (key: string, family: string) => {
    if (!EXTRA.includes(family)) return real.poseDataFor(key, family);
    const f = jest.requireActual(`@/lib/figures/v2/poses/${family}.json`).cwiczenia as Record<string, { cwiczenie: string; rodzina: string }>;
    const d = Object.prototype.hasOwnProperty.call(f, key) ? f[key] : undefined; return d && d.cwiczenie === key && d.rodzina === family ? d : null;
  } };
});

jest.setTimeout(240000);
const K = 'Alternating Deltoid Raise';
const POSES_DIR = path.join(__dirname, '../lib/figures/v2/poses');
type PoseFile = { rodzina: string; cwiczenia: Record<string, PoseData> };
const ALL = fs.readdirSync(POSES_DIR).filter(f => f.endsWith('.json')).flatMap(f => Object.entries((JSON.parse(fs.readFileSync(path.join(POSES_DIR, f), 'utf8')) as PoseFile).cwiczenia));
const SAVED = FAMILY.delt_raise.status;
beforeAll(() => { FAMILY.delt_raise.status = 'ready'; });
afterAll(() => { FAMILY.delt_raise.status = SAVED; });
const gripR = (d: PoseData, u: number) => keyframeFrame(d, u).sk.arms.R.grip;
const sk = (d: PoseData, u: number) => JSON.stringify(keyframeFrame(d, u).sk);

describe('r4-W1 logika: pozycje statyczne Alternating ze szczytów ruchu', () => {
  test('ONE_WAY_STATIC: u = [0, 1/6, 2/3] wyprowadzone z TEMPO i ONE_WAY_REP_MS; podpisy wyjściowa / przodem / bokiem', () => {
    const e = ONE_WAY_STATIC[K]; expect(e.u[0]).toBe(0); expect(e.u[1]).toBeCloseTo(1 / 6, 12); expect(e.u[2]).toBeCloseTo(2 / 3, 12);
    expect(e.u[1]).toBeCloseTo(TEMPO.upMs / ONE_WAY_REP_MS[K], 12); expect(e.labels).toEqual(['Pozycja wyjściowa', 'Przodem', 'Bokiem']);
  });
  test('szczyty leżą na szczytach animacji: oneWayAt w 1 s i 4 s ruchu daje u szczytów', () => {
    const hold = 500; expect(oneWayAt(hold + TEMPO.upMs, ONE_WAY_REP_MS[K])).toBeCloseTo(ONE_WAY_STATIC[K].u[1], 9); expect(oneWayAt(hold + 4000, ONE_WAY_REP_MS[K])).toBeCloseTo(ONE_WAY_STATIC[K].u[2], 9);
  });
  test('staticPositions / staticLabels: Alternating trzy pozycje; negatyw: Jump Squat i inne bez wpisu zostają [0, 1] z podpisami start/koniec', () => {
    const s = figureSpec(K)!; expect(s).toBeTruthy(); expect(staticPositions(s)).toEqual(ONE_WAY_STATIC[K].u); expect(staticLabels(s)).toEqual(['Pozycja wyjściowa', 'Przodem', 'Bokiem']);
    const l = figureSpec('Lateral Raise'); if (l) { expect(staticPositions(l)).toEqual([0, 1]); expect(staticLabels(l)).toEqual(['Pozycja wyjściowa', 'Pozycja końcowa']); }
  });
  test('dane: chwyt na szczycie przodem jest ≥ 30 cm od zwisu, a szczyt przodem i bokiem różnią się o ≥ 30 cm; stary wybór [0, 1] daje 0 cm', () => {
    const d = ALL.find(([k]) => k === K)![1]; const dist = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
    const [u0, u1, u2] = ONE_WAY_STATIC[K].u;
    expect(dist(gripR(d, u0), gripR(d, u1))).toBeGreaterThanOrEqual(30); expect(dist(gripR(d, u0), gripR(d, u2))).toBeGreaterThanOrEqual(30); expect(dist(gripR(d, u1), gripR(d, u2))).toBeGreaterThanOrEqual(30);
    expect(dist(gripR(d, 0), gripR(d, 1))).toBeLessThan(0.01);
  });
});

describe('r4-W1 strażnik ogólny: pętla jednokierunkowa nie ma identycznych pozycji statycznych', () => {
  const JED = ALL.filter(([, d]) => d.petla === 'jednokierunkowa');
  test('jest co sprawdzać (56 ćwiczeń jednokierunkowych: 33 skoki i rzuty + 19 olympic + Alternating + 3 thruster; 08.11.2026 po scaleniu olympic z integracją liczba 34 → 53, 10.11.2026 thruster 53 → 56)', () => { expect(JED).toHaveLength(56); });
  test.each(JED.map(([k, d]) => [k, d] as [string, PoseData]))('%s: pozycje statyczne parami różne', (k, d) => {
    const us = ONE_WAY_STATIC[k]?.u ?? [0, 1];
    for (let i = 0; i < us.length; i++) for (let j = i + 1; j < us.length; j++) expect([k, us[i], us[j], sk(d, us[i]) !== sk(d, us[j])]).toEqual([k, us[i], us[j], true]);
  });
  test('negatyw strażnika: dla Alternating stary wybór [0, 1] byłby wykryty (identyczna poza)', () => {
    const d = ALL.find(([k]) => k === K)![1]; expect(sk(d, 0) === sk(d, 1)).toBe(true);
  });
});

describe('r4-W1 ekran: Alternating w trybie statycznym', () => {
  const AI = RN.AccessibilityInfo as unknown as { isReduceMotionEnabled: jest.Mock };
  const flush = async () => { await act(async () => { await Promise.resolve(); }); };
  const lib = { lib: true as const, libKey: K };
  afterEach(() => { applyLang('pl'); AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(false)); });
  test('„Ogranicz ruch”: trzy pozycje z podpisami, testID start / mid / end w obu widokach', async () => {
    AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(true)); await render(<ExerciseFigureV2 exercise={lib} />); await flush();
    for (const t of ['Pozycja wyjściowa', 'Przodem', 'Bokiem']) expect(screen.getByText(t)).toBeTruthy();
    expect(screen.queryByText('Pozycja końcowa')).toBeNull();
    for (const p of ['start', 'mid', 'end']) for (const v of ['front', 'side']) expect(screen.getByTestId(`exercise-figure-v2-${p}-${v}`)).toBeTruthy();
  });
  test('VoiceOver: etykieta obrazu w trybie statycznym wymienia pozycje; w animacji ich nie ma', async () => {
    AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(true)); const a = await render(<ExerciseFigureV2 exercise={lib} />); await flush();
    expect(screen.getByTestId('exercise-figure-v2-image').props.accessibilityLabel).toContain('Pozycje na rysunku: Pozycja wyjściowa, Przodem, Bokiem'); await a.unmount();
    AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(false)); await render(<ExerciseFigureV2 exercise={lib} />); await flush();
    expect(screen.getByTestId('exercise-figure-v2-image').props.accessibilityLabel).not.toContain('Pozycje na rysunku');
  });
  test('język EN: podpisy i etykieta po angielsku', async () => {
    applyLang('en'); AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(true)); await render(<ExerciseFigureV2 exercise={lib} />); await flush();
    expect(EN['Przodem']).toBe('Forward'); expect(EN['Bokiem']).toBe('To the side'); expect(EN['Pozycje na rysunku: {lista}']).toBe('Positions in the drawing: {lista}');
    for (const t of ['Starting position', 'Forward', 'To the side']) expect(screen.getByText(t)).toBeTruthy();
    expect(screen.getByTestId('exercise-figure-v2-image').props.accessibilityLabel).toContain('Positions in the drawing: Starting position, Forward, To the side');
  });
});

describe('r4-N2: powód wyjątku w v2-jakosc podaje szczyty 1/6 i 2/3', () => {
  test('tekst zawiera u = 1/6 i u = 2/3, nie ma starych 0,27 / 0,73', () => {
    const src = fs.readFileSync(path.join(__dirname, '../scripts/figures/v2-jakosc.mjs'), 'utf8');
    expect(src).toContain('u = 1/6 i u = 2/3'); expect(src).not.toContain('u = 0,27'); expect(src).not.toContain('u = 0,73');
  });
});
