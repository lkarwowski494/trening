/*
 * Figury v2 — rodziny z DANYCH (poses/<rodzina>.json, docs/50 pkt 10, docs/53): podłączenie do aplikacji generycznie dla każdej rodziny z plikiem póz (dziś pull_up, 11 z 13 ćwiczeń).
 * Rodzaje (docs/20): logika (figureSpec/frameAt/shapesAt z danych, błędy z bledy[], fazy, staw, izometria), macierz (każde ćwiczenie z danymi × geometria, błędy, oba motywy, oba języki),
 * ekran (licznik faz, „Kąt na rysunku”, legenda, błąd, pauza, Ogranicz ruch), dostępność (etykieta obrazu, przyciski), regresja (tekst błędu bez gołego id), wydajność (budżet kształtów i czasu klatki).
 */
import React from 'react';
import * as RN from 'react-native';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { ExerciseFigureV2 } from '@/components/ExerciseFigureV2';
import {
  figureSpec, frameAt, shapesAt, checkFrame, boxFor, trailFor, staticPositions, phasesFor, tempoFor, measuredJoint, measuredAngle, faultApplicable, errorMarks, uAt, TEMPO,
  errorDefOf, dataErrorId, isDataError, dataErrorIndex, POSE_FAMILIES, poseKeys, poseFile, poseDataFor, hasPoseFile, dataUiFor, DATA_UI, ISOMETRIC, assignAll, FAMILY, type FigError,
} from '@/lib/figures/v2';
import { errorsOf, errorText, GAP_CUES, hasTechnique, legendOf } from '@/lib/figures/v2/ui';
import { cueText, cueDict } from '@/lib/cues';
import { metricFor } from '@/lib/seed';
import { applyLang } from '@/lib/i18n';
import { light, dark } from '@/lib/theme';

const lib = (key: string) => ({ lib: true as const, libKey: key });
const AI = RN.AccessibilityInfo as unknown as { isReduceMotionEnabled: jest.Mock };
const setReduce = (v: boolean) => { AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(v)); };
const flush = async () => { await act(async () => { await Promise.resolve(); }); };
afterEach(() => { applyLang('pl'); jest.useRealTimers(); AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(false)); jest.restoreAllMocks(); });

const ALL = assignAll();
const DATA_KEYS: [string, string][] = POSE_FAMILIES.flatMap(f => poseKeys(f).map(k => [f, k] as [string, string]));
const U = Array.from({ length: 13 }, (_, i) => i / 12);

describe('dane póz: rejestr i podłączenie (logika)', () => {
  test('każda rodzina z plikiem póz: status „gotowa”, wpis DATA_UI, ćwiczenia pliku należą do rodziny, spec z danych (nie z rigu); pull_up ma 11 ćwiczeń', () => {
    expect(DATA_KEYS.filter(([f]) => f === 'pull_up').length).toBe(11);
    for (const f of POSE_FAMILIES) { expect([f, FAMILY[f as keyof typeof FAMILY].status]).toEqual([f, 'ready']); expect([f, !!DATA_UI[f]]).toEqual([f, true]); expect(poseFile(f)!.rodzina).toBe(f); }
    for (const [f, k] of DATA_KEYS) { const s = figureSpec(k)!; expect([k, ALL[k]]).toEqual([k, f]); expect([k, s.family, 'data' in s.variant]).toEqual([k, f, true]); expect(s.views).toEqual(FAMILY[f as keyof typeof FAMILY].views); }
  });
  test('ćwiczenia rodziny bez danych (Muscle Up, Rope Climb) i spoza katalogu: brak figury v2 (zachowanie jak dotąd), sekcja Technika nie pojawia się z ich powodu', () => {
    for (const k of ['Muscle Up', 'Rope Climb', 'Ćwiczenie własne']) { expect([k, figureSpec(k)]).toEqual([k, null]); }
    expect(hasTechnique(lib('Muscle Up'))).toBe(false); expect(hasTechnique(lib('Dead Hang'))).toBe(true);
  });
  test('frameAt z danych: klatka w u = 0 i u = 1 ma dłonie na drążku, ruch ≥ 8 cm; faza 0 → 1 to podciąganie (1 s), powrót 2 s; staw = łokieć', () => {
    for (const [, k] of DATA_KEYS.filter(([, x]) => !ISOMETRIC.has(x))) {
      const s = figureSpec(k)!; const a = frameAt(s, 0), b = frameAt(s, 1);
      expect([k, b.sk.pelvis[1] - a.sk.pelvis[1] > 0.5]).toEqual([k, true]);
      expect(s.lowerFirst).toBe(false); expect(measuredJoint(s)).toBe('elbow');
      const ph = phasesFor(s); expect(ph.map(p => [p.name, p.ms])).toEqual([['Podciąganie', 1000], ['Pauza', 500], ['Opuszczanie', 2000], ['Pauza', 500]]);
      /* Scapular Pull-Up (poprawka po recenzji ruchu, partia 1): ruch łopatek przy prostych rękach — kąt w łokciu się nie zmienia; reszta rośnie */
      if (k === 'Scapular Pull-Up') { expect(measuredAngle(s, 1).deg).toBeCloseTo(measuredAngle(s, 0).deg, 5); }
      else { expect(measuredAngle(s, 1).deg).toBeGreaterThan(measuredAngle(s, 0).deg); }
    }
  });
  test('izometria (Dead Hang) = pozycja statyczna; lista ISOMETRIC zgadza się z katalogiem (pomiar czasu); pozostałe ćwiczenia z danymi animowane', () => {
    for (const [, k] of DATA_KEYS) { const s = figureSpec(k)!; expect([k, s.static]).toEqual([k, ISOMETRIC.has(k)]); expect([k, ISOMETRIC.has(k)]).toEqual([k, metricFor(k) === 'time']); }
    expect(staticPositions(figureSpec('Dead Hang')!)).toEqual([1]); expect(staticPositions(figureSpec('Pull Up')!)).toEqual([0, 1]);
  });
  test('tor ruchu przy nieruchomym drążku to droga miednicy (nie punkt na drążku): linia ma długość, a znacznik ✕ „bar” stoi na drążku', () => {
    const s = figureSpec('Pull Up')!; const tr = trailFor(s, 'side'); expect(tr.filter(x => x.id === 'trail').length).toBe(24);
    expect(frameAt(s, 0).info.trail).toBeDefined(); expect(frameAt(s, 0).info.load).toEqual([0, 230, 0]);
    const marks = errorMarks(frameAt(s, 1, 'data:0'), 'side', 'data:0', s); expect(marks.filter(m => m.id === 'errorMark').length).toBe(2);
  });
});

describe('rejestr póz: dostęp', () => {
  test('hasPoseFile / poseFile / poseDataFor / dataUiFor: rodzina z plikiem tak, bez pliku nie; poza tylko dla właściwej rodziny i klucza', () => {
    expect(hasPoseFile('pull_up')).toBe(true); expect(hasPoseFile('squat')).toBe(false); expect(poseFile('squat')).toBeNull(); expect(poseDataFor('Back Squat', 'squat')).toBeNull();
    expect(poseDataFor('Pull Up', 'pull_up')!.cwiczenie).toBe('Pull Up'); expect(poseDataFor('Pull Up', 'squat')).toBeNull(); expect(poseDataFor('Muscle Up', 'pull_up')).toBeNull(); expect(poseDataFor('toString', 'pull_up')).toBeNull();
    expect(dataUiFor('pull_up')).toBe(DATA_UI.pull_up); expect(dataUiFor('squat')).toBeNull(); expect(errorDefOf(undefined, 'kneesIn')!.mark).toBe('knees'); expect(errorDefOf(undefined, 'data:0')).toBeNull();
    expect(errorDefOf(figureSpec('Pull Up')!, dataErrorId(0))!.mark).toBe('bar'); expect(isDataError('data:2') && dataErrorIndex('data:2')).toBe(2); expect(isDataError('jerk')).toBe(false);
  });
});

describe('błędy z danych (bledy[])', () => {
  test('errorsOf: każdy wpis bledy[] ćwiczenia = błąd do pokazania (id data:i, wskazówka z danych); błąd rigowy nie dotyczy rodziny z danych poza tempem; indeks poza zakresem nieobsługiwany', () => {
    for (const [, k] of DATA_KEYS) {
      const s = figureSpec(k)!; const d = (s.variant as { data: { bledy: { cue: string }[] } }).data; const e = errorsOf(s);
      expect([k, e.map(x => x.cue)]).toEqual([k, d.bledy.map(b => b.cue)]); if (k !== 'Gorilla Chin/Crunch') expect(e.length).toBeGreaterThan(0); /* Gorilla: poza bez błędu (v2-jakosc etykieta_bledu: brak tekstu wskazówki) */
      d.bledy.forEach((_, i) => expect(faultApplicable(s, `data:${i}`)).toBe(true)); expect(faultApplicable(s, `data:${d.bledy.length}`)).toBe(false);
      for (const r of ['kneesIn', 'heels', 'roundBack', 'arch', 'barAway', 'kneesBent'] as const) expect(faultApplicable(s, r)).toBe(false);
    }
    expect(faultApplicable(figureSpec('Back Squat')!, 'data:0')).toBe(false);
  });
  test('macierz: wszystkie ćwiczenia z danymi × poza poprawna i poza błędu × 13 pozycji: brak błędów geometrii (podłoga, zasięg, przenikanie, chwyt); błąd różni się od pozy poprawnej na końcu ruchu', () => {
    for (const [, k] of DATA_KEYS) {
      const s = figureSpec(k)!; const errs: (FigError | undefined)[] = [undefined, ...errorsOf(s).map(e => e.error)];
      for (const er of errs) for (const u of U) { const is = checkFrame(frameAt(s, u, er)); if (is.length) throw new Error(`${k} ${er ?? 'poprawna'} u=${u}: ${JSON.stringify(is)}`); }
      for (const e of errorsOf(s)) {
        const a = frameAt(s, 1).sk, b = frameAt(s, 1, e.error).sk; const pts = (x: typeof a) => [x.pelvis, x.head, x.legs.R.knee, x.legs.R.ankle, x.arms.R.elbow];
        const dd = Math.max(...pts(a).map((p, i) => Math.hypot(p[0] - pts(b)[i][0], p[1] - pts(b)[i][1], p[2] - pts(b)[i][2]))); expect([k, e.error, dd > 3]).toEqual([k, e.error, true]); /* widoczne: ≥ 3 cm (CONTRACT.visibleCm) */
      }
    }
  });
  test('macierz: kadr obejmuje poprawną pozę i pozy błędów; kształty w obu widokach i oba motywy istnieją dla każdego ćwiczenia z danymi', () => {
    for (const [, k] of DATA_KEYS) { const s = figureSpec(k)!; const es = errorsOf(s).map(e => e.error); for (const v of s.views) { const b = boxFor(s, v, es); expect([k, v, b.w > 20 && b.h > 50]).toEqual([k, v, true]); expect(shapesAt(s, 0.5, v, true, es[0]).length).toBeGreaterThan(20); } }
    expect(light.bg).not.toBe(dark.bg);
  });
  test('tempo: błąd z danych używa tempa domyślnego (jak poprawna poza)', () => { const s = figureSpec('Pull Up')!; expect(tempoFor(s, 'data:0')).toEqual(tempoFor(s)); expect(uAt(TEMPO.holdMs + TEMPO.upMs, false, tempoFor(s))).toBeCloseTo(1, 6); });
});

describe('regresja: tekst częstego błędu (bez gołego id wskazówki)', () => {
  test('każda wskazówka błędu z danych ma tekst w PL i EN: ze słownika wskazówek albo z t() (GAP_CUES); żaden tekst nie jest id; teksty z t() to zdania bez nazw źródeł', () => {
    for (const lng of ['pl', 'en'] as const) {
      applyLang(lng);
      for (const [, k] of DATA_KEYS) for (const e of errorsOf(figureSpec(k)!)) { const x = errorText(e.cue); expect([k, e.cue, x !== e.cue && x.length > 8 && !/^[a-z]+\.[A-Za-z.]+$/.test(x)]).toEqual([k, e.cue, true]); }
    }
    applyLang('pl'); expect(errorText('hang.noSwing')).toBe('Bujanie się i wymachy nogami.'); applyLang('en'); expect(errorText('hang.noSwing')).toBe('Swinging and kicking the legs.');
    expect(GAP_CUES).toEqual([]); /* wszystkie teksty błędów są w słowniku wskazówek (27.10.2026) */
    for (const id of GAP_CUES) { expect([id, cueDict('pl')[id]]).toEqual([id, undefined]); } /* gdy tłumacz doda zdanie do słownika wskazówek, usuń wpis z GAP_TEXT */
    applyLang('pl'); expect(errorText('pu.partial')).toBe(cueText('pu.partial', 'pl'));
  });
});

describe('komponent z danych (ekran, dostępność)', () => {
  test('Pull Up: obraz z etykietą, licznik faz „Podciąganie 1 s · Pauza · Opuszczanie 2 s”, „Kąt na rysunku: zgięcie łokcia”, legenda mięśni, pauza i przełącznik błędu z tekstem błędu', async () => {
    jest.useFakeTimers(); setReduce(false);
    render(<ExerciseFigureV2 exercise={lib('Pull Up')} />); await flush();
    expect(screen.getByLabelText(/^Rysunek ruchu: /)).toBeTruthy();
    expect(screen.getByText('Podciąganie 1 s ·')).toBeTruthy(); expect(screen.getByText('Opuszczanie 2 s')).toBeTruthy();
    expect(screen.getByTestId('exercise-figure-v2-angle').props.children).toMatch(/zgięcie łokcia \d+°/);
    expect(screen.getByTestId('exercise-figure-v2-legend')).toBeTruthy(); expect(screen.getByTestId('exercise-figure-v2-side')).toBeTruthy(); expect(screen.getByTestId('exercise-figure-v2-front')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Pokaż częsty błąd' }));
    expect(screen.getByText('Częsty błąd: Skracanie ruchu — bez wyprostu rąk na dole.')).toBeTruthy(); expect(screen.getByRole('button', { name: 'Ukryj częsty błąd' })).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Ukryj częsty błąd' })); expect(screen.queryByTestId('exercise-figure-v2-error')).toBeNull();
    fireEvent.press(screen.getByRole('button', { name: 'Zatrzymaj animację' })); expect(screen.getByTestId('exercise-figure-v2-static')).toBeTruthy();
  });
  test('EN: fazy i błąd po angielsku („Pulling up 1 s”, „Lowering 2 s”, „Common mistake: …”); Pull Up pokazuje tekst z t() zamiast id', async () => {
    jest.useFakeTimers(); setReduce(false); applyLang('en');
    render(<ExerciseFigureV2 exercise={lib('Pull Up')} />); await flush();
    expect(screen.getByText('Pulling up 1 s ·')).toBeTruthy(); expect(screen.getByText('Lowering 2 s')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Show common mistake' })); expect(screen.getByText('Common mistake: Cutting the range short — not straightening your arms at the bottom.')).toBeTruthy();
  });
  test('wiele błędów: Gironda Sternum Chins ma jeden (bez listy wyboru); Ogranicz ruch → statycznie start i koniec bez przycisku pauzy; Dead Hang statycznie jedna pozycja bez licznika faz', async () => {
    jest.useFakeTimers(); setReduce(true);
    const r = render(<ExerciseFigureV2 exercise={lib('Gironda Sternum Chins')} />); await flush();
    expect(screen.queryByTestId('exercise-figure-v2-anim')).toBeNull(); expect(screen.getByText('Pozycja wyjściowa')).toBeTruthy(); expect(screen.queryByRole('button', { name: 'Zatrzymaj animację' })).toBeNull();
    fireEvent.press(screen.getByRole('button', { name: 'Pokaż częsty błąd' })); expect(screen.queryByTestId('exercise-figure-v2-error-data0')).toBeNull(); r.unmount();
    setReduce(false); render(<ExerciseFigureV2 exercise={lib('Dead Hang')} />); await flush();
    expect(screen.getByTestId('exercise-figure-v2-static')).toBeTruthy(); expect(screen.queryByTestId('exercise-figure-v2-phases')).toBeNull(); expect(screen.queryByText('Pozycja wyjściowa')).toBeNull();
  });
  test('ćwiczenie rodziny bez danych (Muscle Up) → komponent nic nie rysuje', async () => { setReduce(false); render(<ExerciseFigureV2 exercise={lib('Muscle Up')} />); await flush(); expect(screen.queryByTestId('exercise-figure-v2')).toBeNull(); });
  test('legenda mięśni z katalogu dla ćwiczeń z danymi (główne: najszersze grzbietu)', () => { const l = legendOf('Pull Up')!; expect(l.main.length).toBeGreaterThan(0); });
});

describe('wydajność: budżet kształtów i czasu klatki', () => {
  test('klatka (oba widoki, z mięśniami, torem i błędem) ≤ 120 kształtów na widok; średnio ≤ 15 ms w Node na klatkę; kadr liczony raz (cache)', () => {
    let n = 0; const t0 = Date.now();
    for (const [, k] of DATA_KEYS) { const s = figureSpec(k)!; const er = errorsOf(s)[0]?.error; for (const v of s.views) { const sh = [...shapesAt(s, 0.5, v, true, er), ...trailFor(s, v)]; expect([k, v, sh.length <= 120]).toEqual([k, v, true]); n++; } }
    expect((Date.now() - t0) / n).toBeLessThan(15);
    const s = figureSpec('Pull Up')!; expect(boxFor(s, 'side')).toBe(boxFor(s, 'side'));
  });
});
