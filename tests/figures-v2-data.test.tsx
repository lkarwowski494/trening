/*
 * Figury v2 — rodziny z DANYCH (poses/<rodzina>.json, docs/50 pkt 10, docs/53): podłączenie do aplikacji generycznie dla każdej rodziny z plikiem póz (dziś pull_up, 11 z 13 ćwiczeń).
 * Rodzaje (docs/20): logika (figureSpec/frameAt/shapesAt z danych, błędy z bledy[], fazy, staw, izometria), macierz (każde ćwiczenie z danymi × geometria, błędy, oba motywy, oba języki),
 * ekran (licznik faz, „Kąt na rysunku”, legenda, błąd, pauza, Ogranicz ruch), dostępność (etykieta obrazu, przyciski), regresja (tekst błędu bez gołego id), wydajność (budżet kształtów i czasu klatki).
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: ten test sprawdza rysowanie, nie recenzję rodziny (tests/figure-gate-open.ts) */
import React from 'react';
import * as RN from 'react-native';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { ExerciseFigureV2 } from '@/components/ExerciseFigureV2';
import { lowerFirstOf,
  figureSpec, frameAt, shapesAt, checkFrame, boxFor, trailFor, staticPositions, phasesFor, tempoFor, measuredJoint, measuredAngle, faultApplicable, errorMarks, uAt, TEMPO,
  errorDefOf, dataErrorId, isDataError, dataErrorIndex, POSE_FAMILIES, poseKeys, poseFile, poseDataFor, hasPoseFile, dataUiFor, DATA_UI, ISOMETRIC, assignAll, FAMILY, type FigError,
} from '@/lib/figures/v2';
import { errorsOf, errorText, GAP_CUES, hasTechnique, legendOf } from '@/lib/figures/v2/ui';
import { EXERCISE_VIEWS } from '@/lib/figures/v2/families';
import { cueText, cueDict } from '@/lib/cues';
import { metricFor } from '@/lib/seed';
import { applyLang } from '@/lib/i18n';
import { light, dark } from '@/lib/theme';
import { krotnosc, LIMIT_KROTNOSCI } from './perf-wzgledny';

import { PLANNED_Z_DANYMI } from './helpers/rodziny-planned';
const lib = (key: string) => ({ lib: true as const, libKey: key });
const AI = RN.AccessibilityInfo as unknown as { isReduceMotionEnabled: jest.Mock };
const setReduce = (v: boolean) => { AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(v)); };
const flush = async () => { await act(async () => { await Promise.resolve(); }); };
afterEach(() => { applyLang('pl'); jest.useRealTimers(); AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(false)); jest.restoreAllMocks(); });

const ALL = assignAll();
/* 10.11.2026: rodziny planned z danymi (tests/helpers/rodziny-planned.ts) poza testami gotowych figur — ich stan pilnuje figures-v2-mapping */
const READY_POSE_FAMILIES = POSE_FAMILIES.filter(f => !PLANNED_Z_DANYMI.includes(f));
const DATA_KEYS: [string, string][] = READY_POSE_FAMILIES.flatMap(f => poseKeys(f).map(k => [f, k] as [string, string]));
/** Ćwiczenia mierzone czasem, ale z ruchem (nie izometria): Mountain Climbers (pushup_plank, 09.11.2026) — nogi zamieniają się w podporze, rysunek jest animowany. */
const TIMED_DYNAMIC = ['Mountain Climbers'];
const U = Array.from({ length: 13 }, (_, i) => i / 12);

describe('dane póz: rejestr i podłączenie (logika)', () => {
  test('każda rodzina z plikiem póz: status „gotowa”, wpis DATA_UI, ćwiczenia pliku należą do rodziny, spec z danych (nie z rigu); pull_up ma 11 ćwiczeń', () => {
    expect(DATA_KEYS.filter(([f]) => f === 'pull_up').length).toBe(11);
    for (const f of READY_POSE_FAMILIES) { expect([f, FAMILY[f as keyof typeof FAMILY].status]).toEqual([f, 'ready']); expect([f, !!DATA_UI[f]]).toEqual([f, true]); expect(poseFile(f)!.rodzina).toBe(f); }
    for (const [f, k] of DATA_KEYS) { const s = figureSpec(k)!; expect([k, ALL[k]]).toEqual([k, f]); expect([k, s.family, 'data' in s.variant]).toEqual([k, f, true]); expect(s.views).toEqual(EXERCISE_VIEWS[k]?.views ?? FAMILY[f as keyof typeof FAMILY].views); } /* widoki ćwiczenia nadpisują rodzinę (suwnice tylko z boku, families.ts EXERCISE_VIEWS) */
  });
  test('ćwiczenia rodziny bez danych (Muscle Up, Rope Climb) i spoza katalogu: brak figury v2 (zachowanie jak dotąd), sekcja Technika nie pojawia się z ich powodu', () => {
    for (const k of ['Muscle Up', 'Rope Climb', 'Ćwiczenie własne']) { expect([k, figureSpec(k)]).toEqual([k, null]); }
    expect(hasTechnique(lib('Muscle Up'))).toBe(false); expect(hasTechnique(lib('Dead Hang'))).toBe(true);
  });
  test('frameAt z danych: klatka w u = 0 i u = 1 ma dłonie na drążku, ruch ≥ 8 cm; faza 0 → 1 to podciąganie (1 s), powrót 2 s; staw = łokieć', () => {
    for (const [f, k] of DATA_KEYS.filter(([fam, x]) => !ISOMETRIC.has(x) && fam !== 'olympic' && fam !== 'delt_raise' && fam !== 'dip' && fam !== 'cable_press' && fam !== 'back_extension' && fam !== 'thruster' && fam !== 'pushup_plank' && fam !== 'glute_floor')) { /* glute_floor (10.11.2026, partia 7): kierunek kąta biodra różny w ćwiczeniach (kickbacki: maleje i przechodzi w przeprost, Fire Hydrant/Clamshell/flutter: kąt ukryty) — fazy, kąt i kierunek u sprawdza tests/figures-v2-glute-floor.test.tsx */ /* pushup_plank (09.11.2026, partia 2): pompki to opuszczanie (u 0 → 1 = 2 s) i wyjątki faz (Mountain Climbers, Plank Shoulder Taps, Inverted Row) — osobny test w tests/figures-v2-nakladka-pushup-plank.test.tsx */ /* thruster (10.11.2026): pętla jednokierunkowa — osobny test w tests/figures-v2-thruster.test.tsx */ /* back_extension (10.11.2026): Back Extension ma u 0 → 1 = opuszczanie (wyjątek lowerFirst) — fazy, kierunek i staw sprawdza tests/figures-v2-back-extension.test.tsx; dip (09.11.2026): kierunek u różny w rodzinie (poręcze, kółka, ławka: opuszczanie; Dip Machine: wypychanie) — osobny test niżej; delt_raise (09.11.2026): dwa stawy (shElev / shAbd) i wyjątki faz (Car Drivers, Alternating Deltoid Raise) — osobny test niżej; olympic (05.11.2026): mieszanka wahadła i trybu jednokierunkowego — fazy i staw per ćwiczenie sprawdza tests/figures-v2-olympic-petla.test.ts; każda rodzina z danych póz (pull_up, curl): fazy i staw z DATA_UI; unoszenie miednicy tylko w podciąganiu (03.11.2026: curl wypadł z kontroli przez zawężenie do pull_up) */
      if (f === 'kb_ballistic' && poseFile(f)!.cwiczenia[k].petla === 'jednokierunkowa') continue; /* 09.11.2026: 9 ćwiczeń kb_ballistic w pętli jednokierunkowej (jedna faza bez czasu): fazy i staw sprawdza tests/figures-v2-kb-ballistic-p1.test.ts */
      const s = figureSpec(k)!; const a = frameAt(s, 0), b = frameAt(s, 1); const ui = DATA_UI[f];
      if (f === 'pull_up') expect([k, b.sk.pelvis[1] - a.sk.pelvis[1] > 0.5]).toEqual([k, true]);
      const ex = ui.exceptions?.[k]; /* wyjątek ćwiczenia (partia 3, 09.11.2026: Straight Arm Pulldown — łokieć prosty, mierzony bark shElev) */
      expect([k, s.lowerFirst]).toEqual([k, lowerFirstOf(ui, k)]); /* 10.11.2026 (overhead_press): wyjątek ćwiczenia w DATA_UI wygrywa (Pike Push Up: najpierw opuszczanie) */ if (f === 'kb_ballistic' || f === 'core_floor') expect([k, ui.joints.includes(measuredJoint(s)!)]).toEqual([k, true]); /* core_floor (10.11.2026): biodro albo kolano — to, które rusza się najbardziej (Bird Dog, Dead Bug, Leg Pull-In: kolano) */ else if (f === 'chest_fly') expect([k, measuredJoint(s)]).toEqual([k, /Pullover/.test(k) ? 'shElev' : 'shAbd']); /* chest_fly (09.11.2026): rozpiętki mierzą odsunięcie ramienia (shAbd), pullover — uniesienie (shElev); Crucifix (utrzymanie, ISOMETRIC od r1 W2) nie wchodzi do tej pętli */ /* 09.11.2026: staw mierzony to ten z kandydatów (biodro, kolano), który rusza się najbardziej w danym ćwiczeniu (swing: biodro, podrzut: kolano), nie zawsze pierwszy */ else expect([k, measuredJoint(s)]).toEqual([k, (ex?.joints ?? ui.joints)[0]]);
      const nm = ex?.names ?? ui.names; const [msA, msB] = s.lowerFirst ? [2000, 1000] : [1000, 2000]; /* leg_machine (09.11.2026): maszyny przysiadu zaczynają od opuszczania (2 s) */
      const ph = phasesFor(s); expect(ph.map(p => [p.name, p.ms])).toEqual([[nm.first, msA], ['Pauza', 500], [nm.second, msB], ['Pauza', 500]]);
      /* Scapular Pull-Up (poprawka po recenzji ruchu, partia 1): ruch łopatek przy prostych rękach — kąt w łokciu się nie zmienia; reszta rośnie */
      if (ex?.hideAngle) { /* kąt ukryty na rysunku (hip_abd_add, partia 3, 09.11.2026: podpis „zgięcie biodra” nie opisuje odwodzenia) — kierunek pomiaru nie jest pokazywany */ }
      else if (k === 'Scapular Pull-Up') { expect(measuredAngle(s, 1).deg).toBeCloseTo(measuredAngle(s, 0).deg, 5); }
      /* triceps (04.11.2026) i chest_press_machine (09.11.2026, wypychanie od uchwytów przy barkach): u = 0 to zgięcie, u = 1 wyprost — kąt zgięcia w łokciu maleje; hip_bridge (09.11.2026): u = 1 to wyprost bioder — kąt zgięcia w biodrze maleje; curl i podciąganie: rośnie */
      else if (f === 'calf_raise') { /* 09.11.2026: kolano w wspięciu stoi (zakres < 15°, linia kąta ukryta) — kąt nie jest mierzonym ruchem; zakres kostki sprawdza tests/figures-v2-calf-raise-p1.test.ts */ }
      else if (f === 'kb_ballistic') { /* 09.11.2026: wahadło dół → góra; mierzony staw (biodro albo kolano) rusza się w ruchu o co najmniej MIN_MEASURED_ROM (15°) — inaczej linia kąta byłaby bez znaczenia; kierunek i zakres z reguł karty: tests/figures-v2-kb-ballistic-p1.test.ts */ const ds = U.map(u => measuredAngle(s, u).deg); expect([k, Math.max(...ds) - Math.min(...ds) >= 15]).toEqual([k, true]); }
      /* partia 3, 09.11.2026: Straight Arm Pulldown — ręka prosta schodzi z góry do ud, uniesienie ramienia (shElev) maleje; Middle Back Shrug — łopatki ściągają się, wysunięcie barków (protract) maleje */
      else if (f === 'triceps' || f === 'chest_press_machine' || f === 'hip_bridge' || ['Straight Arm Pulldown', 'Middle Back Shrug', 'Leg Press', 'Single Leg Press'].includes(k)) { /* Leg Press, Single Leg Press (09.11.2026): u = 0 nogi zgięte, u = 1 platforma wypchnięta — zgięcie kolana maleje */ expect([k, measuredAngle(s, 1).deg < measuredAngle(s, 0).deg]).toEqual([k, true]); }
            /* chest_fly (09.11.2026): u = 0 ramiona szeroko / ciężar za głową, u = 1 nad klatką — odsunięcie w bok (rozpiętki) i zgięcie ramienia (pullover) maleją; wyjątek Crucifix usunięty po recenzji r1 (W2): utrzymanie jest ISOMETRIC, więc poza tą pętlą */
      else if (f === 'chest_fly') { expect([k, measuredAngle(s, 1).deg < measuredAngle(s, 0).deg]).toEqual([k, true]); }
      /* core_floor (10.11.2026, partia 7): kierunek zmiany kąta zależy od ćwiczenia (brzuszki i unoszenie nóg: biodro rośnie; Bird Dog i Dead Bug: kolano maleje przy prostowaniu nogi) — fazy i staw per ćwiczenie sprawdza tests/figures-v2-core-floor.test.tsx */
      else if (f === 'core_floor') { /* osobny test */ }
      /* overhead_press (10.11.2026): u = 0 dłonie przy barkach, u = 1 ręce wyprostowane — zgięcie łokcia maleje; Pike Push Up odwrotnie (u = 1 łokcie zgięte, głowa przy podłodze) */
      else if (f === 'overhead_press') { expect([k, k === 'Pike Push Up' ? measuredAngle(s, 1).deg > measuredAngle(s, 0).deg : measuredAngle(s, 1).deg < measuredAngle(s, 0).deg]).toEqual([k, true]); }
      else { expect([k, measuredAngle(s, 1).deg > measuredAngle(s, 0).deg]).toEqual([k, true]); }
    }
  });
  test('dip (09.11.2026): staw = łokieć; poręcze, kółka i ławka: u 0 → 1 to opuszczanie (2 s), zgięcie łokcia rośnie do ≈ 90–95°, wyprost na górze ≤ 25° (reguła zakres: min_max 80°, max_min 25°); Dip Machine (siedzący, miednica stoi): wypychanie 1 s i powrót 2 s, łokieć zgięty 90° → 21°', () => {
    const keys = DATA_KEYS.filter(([f]) => f === 'dip').map(([, k]) => k); expect(keys.sort()).toEqual(['Chest Dip', 'Dip Machine', 'Ring Dips', 'Triceps Dip', 'Triceps Dips (ławka)']);
    for (const k of keys) {
      const sp = figureSpec(k)!; const maszyna = k === 'Dip Machine'; expect([k, measuredJoint(sp)]).toEqual([k, 'elbow']); expect([k, sp.lowerFirst]).toEqual([k, !maszyna]);
      const ph = phasesFor(sp).map(p => [p.name, p.ms]);
      expect([k, ph]).toEqual([k, maszyna ? [['Wypychanie', 1000], ['Pauza', 500], ['Powrót', 2000], ['Pauza', 500]] : [['Opuszczanie', 2000], ['Pauza', 500], ['Podnoszenie', 1000], ['Pauza', 500]]]);
      const a = measuredAngle(sp, 0).deg, b = measuredAngle(sp, 1).deg; const gora = maszyna ? b : a, dol = maszyna ? a : b;
      expect([k, gora <= 25]).toEqual([k, true]); expect([k, dol >= 80]).toEqual([k, true]);
    }
  });
  test('cable_press (10.11.2026): staw = łokieć; faza 0 → 1 to wypychanie (1 s), powrót 2 s (Wypychanie / Powrót); łokieć zgięty ≥ 70° przy klatce (u = 0) i ≤ 25° w wyproście (u = 1) — reguła zakres', () => {
    const keys = DATA_KEYS.filter(([f]) => f === 'cable_press').map(([, k]) => k); expect(keys.sort()).toEqual(['Incline Cable Chest Press', 'Seated Cable Chest Press', 'Single Arm Cable Chest Press', 'Wyciskanie na linkach (stojąc)']);
    for (const k of keys) {
      const sp = figureSpec(k)!; expect([k, measuredJoint(sp)]).toEqual([k, 'elbow']); expect([k, sp.lowerFirst]).toEqual([k, false]);
      expect([k, phasesFor(sp).map(p => [p.name, p.ms])]).toEqual([k, [['Wypychanie', 1000], ['Pauza', 500], ['Powrót', 2000], ['Pauza', 500]]]);
      expect([k, measuredAngle(sp, 0).deg >= 70]).toEqual([k, true]); expect([k, measuredAngle(sp, 1).deg <= 25]).toEqual([k, true]);
    }
  });
  test('delt_raise (09.11.2026, jak olympic: staw i fazy per ćwiczenie): staw mierzony ∈ ui.joints (shAbd tylko unoszenie w tył i Alternating Deltoid Raise, reszta shElev); fazy 1 s / pauza / 2 s / pauza z nazwami Unoszenie/Opuszczanie, wyjątki: Car Drivers (Obrót/Powrót), Alternating Deltoid Raise (jedna faza 2,5 s)', () => {
    const ui = DATA_UI.delt_raise; const REAR = ['Reverse Fly (hantle)', 'One-Arm Cable Rear Lateral Raise', 'Cable Reverse Fly', 'Reverse Pec Deck', 'Dumbbell Lying One-Arm Rear Lateral Raise', 'Alternating Deltoid Raise'];
    const keys = DATA_KEYS.filter(([f]) => f === 'delt_raise').map(([, k]) => k); expect(keys.length).toBe(31);
    for (const k of keys) {
      const sp = figureSpec(k)!; expect([k, sp.lowerFirst]).toEqual([k, false]); expect([k, measuredJoint(sp)]).toEqual([k, REAR.includes(k) ? 'shAbd' : 'shElev']); expect(ui.joints).toContain(measuredJoint(sp));
      const ph = phasesFor(sp).map(p => [p.name, p.ms]);
      if (k === 'Alternating Deltoid Raise') expect(ph).toEqual([['Naprzemiennie', 2500]]);
      else expect([k, ph]).toEqual([k, [[k === 'Car Drivers' ? 'Obrót' : 'Unoszenie', 1000], ['Pauza', 500], [k === 'Car Drivers' ? 'Powrót' : 'Opuszczanie', 2000], ['Pauza', 500]]]);
    }
  });
  /** Poza stała: dłonie, barki i miednica w u = 0 i u = 1 w tym samym miejscu (< 0,5 cm). */
  const poseStala = (k: string): boolean => { const s = figureSpec(k)!; const a = frameAt(s, 0).sk, b = frameAt(s, 1).sk; const d = (p: readonly number[], q: readonly number[]) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); return Math.max(d(a.arms.R.grip, b.arms.R.grip), d(a.arms.L.grip, b.arms.L.grip), d(a.shoulderC, b.shoulderC), d(a.pelvis, b.pelvis)) < 0.5; };
  test('izometria w pomiarze ciężar + czas (chest_fly r1 W2, 09.11.2026): Crucifix (weight_time, poza stała) jest w ISOMETRIC i ma jedną pozycję bez faz; przypadek negatywny: lista bez Crucifix oblewa strażnika, a ruchome ćwiczenie weight_time nie jest izometrią', () => {
    expect(metricFor('Crucifix')).toBe('weight_time'); expect(poseStala('Crucifix')).toBe(true); expect(ISOMETRIC.has('Crucifix')).toBe(true);
    const s = figureSpec('Crucifix')!; expect(s.static).toBe(true); expect(staticPositions(s)).toEqual([1]);
    const bezCrucifix = new Set([...ISOMETRIC].filter(x => x !== 'Crucifix')); expect(bezCrucifix.has('Crucifix') === (metricFor('Crucifix') === 'weight_time' && poseStala('Crucifix'))).toBe(false);
    for (const [, k] of DATA_KEYS.filter(([, x]) => metricFor(x) === 'weight_time' && x !== 'Crucifix')) expect([k, poseStala(k) === ISOMETRIC.has(k)]).toEqual([k, true]);
  });
  test('izometria (Dead Hang) = pozycja statyczna; lista ISOMETRIC zgadza się z katalogiem (pomiar czasu); pozostałe ćwiczenia z danymi animowane', () => {
    for (const [, k] of DATA_KEYS) { const s = figureSpec(k)!; expect([k, s.static]).toEqual([k, ISOMETRIC.has(k)]); expect([k, ISOMETRIC.has(k)]).toEqual([k, (metricFor(k) === 'time' && !TIMED_DYNAMIC.includes(k)) || (metricFor(k) === 'weight_time' && poseStala(k))]); }
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
    for (const [f, k] of DATA_KEYS) {
      const s = figureSpec(k)!; const d = (s.variant as { data: { bledy: { cue: string }[] } }).data; const e = errorsOf(s);
      expect([k, e.map(x => x.cue).filter(c => c !== 'mis.jerk' || d.bledy.some(b => b.cue === c))]).toEqual([k, d.bledy.map(b => b.cue)]); /* mis.jerk = błąd tempa dokładany przez silnik (nie poza) — poza listą z danych dozwolony */ if (k !== 'Gorilla Chin/Crunch' && f === 'pull_up') expect(e.length).toBeGreaterThan(0); /* curl: część ćwiczeń nie ma w danych błędów do pokazania (bledy[] puste) — wtedy brak sekcji błędów rysunku */ /* Gorilla: poza bez błędu (v2-jakosc etykieta_bledu: brak tekstu wskazówki) */
      d.bledy.forEach((_, i) => expect(faultApplicable(s, `data:${i}`)).toBe(true)); expect(faultApplicable(s, `data:${d.bledy.length}`)).toBe(false);
      for (const r of ['kneesIn', 'heels', 'roundBack', 'arch', 'barAway', 'kneesBent'] as const) expect(faultApplicable(s, r)).toBe(false);
    }
    expect(faultApplicable(figureSpec('Back Squat')!, 'data:0')).toBe(false);
  });
  test('macierz: wszystkie ćwiczenia z danymi × poza poprawna i poza błędu × 13 pozycji: brak błędów geometrii (podłoga, zasięg, przenikanie, chwyt); błąd różni się od pozy poprawnej na końcu ruchu (błąd pokazany na dole — pu.partial — na początku ruchu)', () => {
    /* curl (03.11.2026): „szarpnięcie” (mis.jerk) to błąd tempa — nie zmienia pozy (różnica < 3 cm w miednicy, głowie, kolanie, kostce i łokciu R); jak pokazuje go rysunek, ocenia recenzent niezależny. */
    /* hip_bridge (09.11.2026, r1 K14): przeprost lędźwi przy ustalonej miednicy zostaje wykryty miarą — do punktów testu należy środek kręgosłupa (spineMid, −35° vs 0°, ok. 7 cm); bez wyjątków */
    const BLAD_NIEWIDOCZNY = ['Seated Cable Chest Press|mis.jerk' /* cable_press (10.11.2026): mis.jerk z karty własnej siedzącego to błąd tempa (errors.ts kind „tempo”), poza go nie zmienia — jak w curl/delt_raise; reguła bledy_bez_animacji w figury-sens.json */, 'Seated Close-Grip Concentration Barbell Curl|mis.jerk', 'Dumbbell Front Raise to Overhead|mis.jerk', 'Car Drivers|mis.jerk', 'Cable Seated Lateral Raise|mis.jerk', 'Machine Lateral Raise|mis.jerk', 'Y Raise (hantle)|mis.jerk']; /* delt_raise (09.11.2026; trzy ostatnie po wpisach „zestawy” z recenzji audytora — ten sam błąd tempa w zestawie ogólnym raiseSide): jerk to błąd tempa (errors.ts kind „tempo”, mods.tempo) — poza nie zmienia, jak w curl; tylko te dwa ćwiczenia mają go w zestawie; jak pokazuje go rysunek, ocenia recenzent niezależny */
    const JERK_CURL_TEMPO = JERK_TEMPO_RODZINY; /* 10.11.2026: rozszerzone na rodziny dip, chest_press_machine, cable_press, back_extension (partia 4); 09.11.2026: rozszerzone na cable_row (Seated Cable Row i Wiosłowanie siedząc z kartą własną: błąd mis.jerk to błąd tempa, poza końca ruchu bez zmiany — ta sama przyczyna co curl i triceps); 05.11.2026: rozszerzone na triceps (3 ćwiczenia z zestawem ogólnym, recenzja niezależna r5 przyjęła jak w curl); ta sama przyczyna dla całej rodziny curl (błąd tempa); asercja czerwona już na 67ceb782 przed scaleniem integracji, rozszerzona 03.11.2026 z listy pojedynczej na rodzinę */
    const NA_DOLE = ['pu.partial']; /* fala 25, 01.11.2026: „bez wyprostu rąk na dole” widać w u = 0, góra jak w pozie poprawnej (scripts/figures/v2-jakosc.mjs: BLAD_DOL) */
    for (const [f, k] of DATA_KEYS) {
      const s = figureSpec(k)!; const errs: (FigError | undefined)[] = [undefined, ...errorsOf(s).map(e => e.error)];
      for (const er of errs) for (const u of U) { const is = checkFrame(frameAt(s, u, er)); if (is.length) throw new Error(`${k} ${er ?? 'poprawna'} u=${u}: ${JSON.stringify(is)}`); }
      for (const e of errorsOf(s)) {
        const uw = NA_DOLE.includes(e.cue) ? 0 : 1; const pts = (x: ReturnType<typeof frameAt>['sk']) => [x.pelvis, x.spineMid, x.head, x.legs.R.knee, x.legs.R.ankle, x.arms.R.elbow];
        /* thruster (10.11.2026): pętla jednokierunkowa — błąd „pięty odrywają się” jest na dole przysiadu (u ≈ 0,35), a u = 1 to stanie z ciężarem nad głową; widoczność mierzymy w najgorszej klatce całego powtórzenia (siatka 0,05), nie tylko w u = 1 */
        const uws = f === 'thruster' ? Array.from({ length: 21 }, (_, i) => i / 20) : [uw];
        const dd = Math.max(...uws.flatMap(u2 => { const a = frameAt(s, u2).sk, b = frameAt(s, u2, e.error).sk; return pts(a).map((p, i) => Math.hypot(p[0] - pts(b)[i][0], p[1] - pts(b)[i][1], p[2] - pts(b)[i][2])); })); expect([k, e.error, dd > 3 || BLAD_NIEWIDOCZNY.includes(`${k}|${e.cue}`) || JERK_CURL_TEMPO(f, e.cue) || ZAOKRAGLONE_PLECY_KB(f, k, e.cue, e.error)]).toEqual([k, e.error, true]); /* widoczne: ≥ 3 cm (CONTRACT.visibleCm) */
      }
    }
  });
  /* Pozycje nisko przy podłodze: Child's Pose (mobility_floor, 09.11.2026) ma kadr 48 cm wysokości — próg „kadr nie zdegenerowany” 50 cm byłby dla niej fałszywym alarmem; próg 40 cm zostaje wyraźnie ponad liniami i punktami (kadr zdegenerowany = kilka cm). */
  const NISKIE_POZY = ["Child's Pose"];
  test('macierz: kadr obejmuje poprawną pozę i pozy błędów; kształty w obu widokach i oba motywy istnieją dla każdego ćwiczenia z danymi', () => {
    for (const [, k] of DATA_KEYS) { const s = figureSpec(k)!; const es = errorsOf(s).map(e => e.error); for (const v of s.views) { const b = boxFor(s, v, es); expect([k, v, b.w > 20 && (b.h > (k === 'Lower Back Curl' ? 20 : NISKIE_POZY.includes(k) ? 40 : 50) || (k === 'Crucifix' && v === 'top'))]).toEqual([k, v, true]); /* Crucifix z góry (09.11.2026, partia 1): osoba stojąca widziana z góry ma głębokość ok. 30 cm (< 50) — widok „top” rodziny chest_fly jest sensowny tylko dla leżących; Lower Back Curl (10.11.2026, partia 4): leżenie przodem na podłodze — kadr ma wysokość sylwetki leżącej (barki ≤ 16 cm nad podłogą), próg wysokości 20 zamiast 50; zgłoszone koordynatorowi (widoki ćwiczenia = widoki rodziny, silnik wspólny) */ expect(shapesAt(s, 0.5, v, true, es[0]).length).toBeGreaterThan(20); } }
    expect(light.bg).not.toBe(dark.bg);
  });
  test('tempo: błąd z danych używa tempa domyślnego (jak poprawna poza)', () => { const s = figureSpec('Pull Up')!; expect(tempoFor(s, 'data:0')).toEqual(tempoFor(s)); expect(uAt(TEMPO.holdMs + TEMPO.upMs, false, tempoFor(s))).toBeCloseTo(1, 6); });
});

/* 05.11.2026: wyjątek „błąd tempa bez zmiany pozy” (mis.jerk z zestawu ogólnego) tylko dla rodzin curl i triceps, tylko dla tej wskazówki. */
/* 09.11.2026 (kb_ballistic, partia 1): „zaokrąglone plecy” (mis.roundBack) to zgięcie kręgosłupa — krzywizna grzbietu przy tych samych punktach stawów (miednica, głowa, kolano, kostka, łokieć różnią się < 3 cm). Miara widoczności: zmiana zgięcia kręgosłupa w kadrach błędu ≥ 15° (generator: 26°). Przypadek negatywny: poza poprawna ma 0°. */
const ZAOKRAGLONE_PLECY_KB = (f: string, k: string, cue: string, err: FigError) => { if (f !== 'kb_ballistic' || cue !== 'mis.roundBack') return false; const d = poseFile(f)!.cwiczenia[k]; const kl = d.bledy[dataErrorIndex(err as never)].klatki; return Math.max(...kl.map(x => Math.abs(x.zgiecieKregoslupa ?? 0))) >= 15 && Math.max(...d.klatki.map(x => Math.abs(x.zgiecieKregoslupa ?? 0))) < 15; };
const JERK_TEMPO_RODZINY = (f: string, cue: string) => ['curl', 'triceps', 'chest_fly', 'row', 'cable_row', 'overhead_press', 'pulldown', 'shrug', 'hip_abd_add', 'leg_machine', 'dip', 'chest_press_machine', 'cable_press', 'back_extension', 'core_floor'].includes(f) && cue === 'mis.jerk'; /* + overhead_press (10.11.2026, partia 1): zestawy ogólne landmine (3 ćwiczenia) niosą mis.jerk — błąd tempa, poza nie zmienia; recenzja r3 audytora przyjęła (K15, N1-r2); */ /* + row (10.11.2026, partia 1): zestawy ogólne wiosłowań niosą mis.jerk — błąd tempa (rodzina row r3 wyswietlana, audytor 09.11.2026); + chest_fly (09.11.2026, partia 1): zestawy ogólne rozpiętek niosą mis.jerk — błąd tempa, poza nie zmienia */ /* + pulldown, shrug, hip_abd_add, leg_machine (partia 3, 09.11.2026): zestawy ogólne vpull, shrug, row, hipAbd z błędem tempa mis.jerk — jak curl (recenzje niezależne partii 3 przyjęły zestawy); scalenie 10.11.2026 */ /* + dip, chest_press_machine, cable_press, back_extension (10.11.2026, partia 4): mis.jerk z zestawów ogólnych (bdip, machinePress, cablePress, hipExt/cobra) to ten sam błąd tempa (errors.ts kind „tempo”), poza się nie zmienia; zestawy zrecenzowane niezależnie (partia4-*-r2/r4) */ /* + core_floor (10.11.2026, partia 7): zestaw ogólny brzuszków niesie mis.jerk (Frog Sit-Ups, Janda Sit-Up i in.) — błąd tempa, poza się nie zmienia; recenzja niezależna r2 (docs/research/recenzje/partia7-core_floor-r2-audytor-2026-11-10.md, wpisy figury-recenzja.json: „błąd mis.jerk bez pozy (tekst ogólny, bez animacji)”) */
describe('wyjątek błędu tempa (mis.jerk): zakres', () => {
  test('negatyw: inna wskazówka albo inna rodzina nie korzysta z wyjątku', () => {
    expect(JERK_TEMPO_RODZINY('dip', 'mis.jerk')).toBe(true); expect(JERK_TEMPO_RODZINY('core_floor', 'mis.jerk')).toBe(true); expect(JERK_TEMPO_RODZINY('core_floor', 'crunch.neck')).toBe(false); expect(JERK_TEMPO_RODZINY('chest_press_machine', 'mis.jerk')).toBe(true); expect(JERK_TEMPO_RODZINY('cable_press', 'mis.jerk')).toBe(true); expect(JERK_TEMPO_RODZINY('back_extension', 'mis.jerk')).toBe(true); expect(JERK_TEMPO_RODZINY('dip', 'mis.other')).toBe(false); expect(JERK_TEMPO_RODZINY('chest_fly', 'mis.jerk')).toBe(true); expect(JERK_TEMPO_RODZINY('chest_fly', 'fly.elbows')).toBe(false); expect(JERK_TEMPO_RODZINY('curl', 'mis.jerk')).toBe(true); expect(JERK_TEMPO_RODZINY('triceps', 'mis.jerk')).toBe(true);
    expect(JERK_TEMPO_RODZINY('triceps', 'mis.other')).toBe(false); expect(JERK_TEMPO_RODZINY('squat', 'mis.jerk')).toBe(false); expect(JERK_TEMPO_RODZINY('delt_raise', 'mis.jerk')).toBe(false); expect(JERK_TEMPO_RODZINY('row', 'mis.jerk')).toBe(true); expect(JERK_TEMPO_RODZINY('row', 'row.back')).toBe(false); expect(JERK_TEMPO_RODZINY('overhead_press', 'mis.jerk')).toBe(true); expect(JERK_TEMPO_RODZINY('overhead_press', 'ohp.mis.lock')).toBe(false); expect(JERK_TEMPO_RODZINY('cable_row', 'mis.jerk')).toBe(true); expect(JERK_TEMPO_RODZINY('cable_row', 'mis.other')).toBe(false); /* + cable_row (09.11.2026, partia 2): zestawy ogólne wiosłowań na linkach niosą mis.jerk */
  });
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
    await render(<ExerciseFigureV2 exercise={lib('Pull Up')} />); await flush();
    expect(screen.getByLabelText(/^Rysunek ruchu: /)).toBeTruthy();
    expect(screen.getByText('Podciąganie 1 s ·')).toBeTruthy(); expect(screen.getByText('Opuszczanie 2 s')).toBeTruthy();
    expect(screen.getByTestId('exercise-figure-v2-angle').props.children).toMatch(/zgięcie łokcia \d+°/);
    expect(screen.getByTestId('exercise-figure-v2-legend')).toBeTruthy(); expect(screen.getByTestId('exercise-figure-v2-side')).toBeTruthy(); expect(screen.getByTestId('exercise-figure-v2-front')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Pokaż częsty błąd' }));
    expect(screen.getByText('Częsty błąd: Skracanie ruchu — bez wyprostu rąk na dole.')).toBeTruthy(); expect(screen.getByRole('button', { name: 'Ukryj częsty błąd' })).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Ukryj częsty błąd' })); expect(screen.queryByTestId('exercise-figure-v2-error')).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: 'Zatrzymaj animację' })); expect(screen.getByTestId('exercise-figure-v2-static')).toBeTruthy();
  });
  test('EN: fazy i błąd po angielsku („Pulling up 1 s”, „Lowering 2 s”, „Common mistake: …”); Pull Up pokazuje tekst z t() zamiast id', async () => {
    jest.useFakeTimers(); setReduce(false); applyLang('en');
    await render(<ExerciseFigureV2 exercise={lib('Pull Up')} />); await flush();
    expect(screen.getByText('Pulling up 1 s ·')).toBeTruthy(); expect(screen.getByText('Lowering 2 s')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Show common mistake' })); expect(screen.getByText('Common mistake: Cutting the range short — not straightening your arms at the bottom.')).toBeTruthy();
  });
  test('wiele błędów: Gironda Sternum Chins ma jeden (bez listy wyboru); Ogranicz ruch → statycznie start i koniec bez przycisku pauzy; Dead Hang statycznie jedna pozycja bez licznika faz', async () => {
    jest.useFakeTimers(); setReduce(true);
    const r = await render(<ExerciseFigureV2 exercise={lib('Gironda Sternum Chins')} />); await flush();
    expect(screen.queryByTestId('exercise-figure-v2-anim')).toBeNull(); expect(screen.getByText('Pozycja wyjściowa')).toBeTruthy(); expect(screen.queryByRole('button', { name: 'Zatrzymaj animację' })).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: 'Pokaż częsty błąd' })); expect(screen.queryByTestId('exercise-figure-v2-error-data0')).toBeNull(); await r.unmount();
    setReduce(false); await render(<ExerciseFigureV2 exercise={lib('Dead Hang')} />); await flush();
    expect(screen.getByTestId('exercise-figure-v2-static')).toBeTruthy(); expect(screen.queryByTestId('exercise-figure-v2-phases')).toBeNull(); expect(screen.queryByText('Pozycja wyjściowa')).toBeNull();
  });
  test('Crucifix (utrzymanie, chest_fly r1 W2, 09.11.2026): jedna pozycja bez wiersza faz „Unoszenie / Opuszczanie” i bez przycisku pauzy; przypadek negatywny: rozpiętka (Chest Fly (hantle)) ma wiersz faz', async () => {
    jest.useFakeTimers(); setReduce(false); const r = await render(<ExerciseFigureV2 exercise={lib('Crucifix')} />); await flush();
    expect(screen.getByTestId('exercise-figure-v2-static')).toBeTruthy(); expect(screen.queryByTestId('exercise-figure-v2-phases')).toBeNull(); expect(screen.queryByText(/Opuszczanie/)).toBeNull(); expect(screen.queryByRole('button', { name: 'Zatrzymaj animację' })).toBeNull(); await r.unmount();
    await render(<ExerciseFigureV2 exercise={lib('Chest Fly (hantle)')} />); await flush(); expect(screen.getByTestId('exercise-figure-v2-phases')).toBeTruthy();
  });
  test('ćwiczenie rodziny bez danych (Muscle Up) → komponent nic nie rysuje', async () => { setReduce(false); await render(<ExerciseFigureV2 exercise={lib('Muscle Up')} />); await flush(); expect(screen.queryByTestId('exercise-figure-v2')).toBeNull(); });
  test('legenda mięśni z katalogu dla ćwiczeń z danymi (główne: najszersze grzbietu)', () => { const l = legendOf('Pull Up')!; expect(l.main.length).toBeGreaterThan(0); });
});

describe('wydajność: budżet kształtów i czasu klatki', () => {
  test('klatka (oba widoki, z mięśniami, torem i błędem) ≤ 120 kształtów na widok; koszt względny klatki (tests/perf-wzgledny.ts); kadr liczony raz (cache)', () => {
    const jobs: (() => void)[] = []; /* 07-jakosc-005: kształty sprawdzane deterministycznie; czas — względnie (tests/perf-wzgledny.ts), nie w ms */
    for (const [, k] of DATA_KEYS) { const s = figureSpec(k)!; const er = errorsOf(s)[0]?.error; for (const v of s.views) { const sh = [...shapesAt(s, 0.5, v, true, er), ...trailFor(s, v)]; expect([k, v, sh.length <= 120]).toEqual([k, v, true]); jobs.push(() => { shapesAt(s, 0.5, v, true, er); trailFor(s, v); }); } }
    const k = krotnosc(() => { for (const j of jobs) j(); }, 3) / jobs.length; expect(k).toBeLessThan(LIMIT_KROTNOSCI.klatka);
    const s = figureSpec('Pull Up')!; expect(boxFor(s, 'side')).toBe(boxFor(s, 'side'));
  });
});
