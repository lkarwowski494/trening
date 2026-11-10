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
import {
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
    for (const [f, k] of DATA_KEYS) { const s = figureSpec(k)!; expect([k, ALL[k]]).toEqual([k, f]); expect([k, s.family, 'data' in s.variant]).toEqual([k, f, true]); expect(s.views).toEqual(EXERCISE_VIEWS[k]?.views ?? FAMILY[f as keyof typeof FAMILY].views); } /* widoki ćwiczenia nadpisują rodzinę (suwnice tylko z boku, families.ts EXERCISE_VIEWS) */
  });
  test('ćwiczenia rodziny bez danych (Muscle Up, Rope Climb) i spoza katalogu: brak figury v2 (zachowanie jak dotąd), sekcja Technika nie pojawia się z ich powodu', () => {
    for (const k of ['Muscle Up', 'Rope Climb', 'Ćwiczenie własne']) { expect([k, figureSpec(k)]).toEqual([k, null]); }
    expect(hasTechnique(lib('Muscle Up'))).toBe(false); expect(hasTechnique(lib('Dead Hang'))).toBe(true);
  });
  /* forearm (10.11.2026, partia 5): staw mierzony wybiera ten o największym zakresie z ui.joints — odwrotne uginanie z talerzem mierzy łokieć, pronacja i supinacja obrót przedramienia, reszta nadgarstek */
  const FOREARM_JOINT: Record<string, string> = { 'Reverse Plate Curls': 'elbow', 'Dumbbell Lying Pronation': 'forearmRoll', 'Dumbbell Lying Supination': 'forearmRoll' };
  test('frameAt z danych: klatka w u = 0 i u = 1 ma dłonie na drążku, ruch ≥ 8 cm; faza 0 → 1 to podciąganie (1 s), powrót 2 s; staw = łokieć', () => {
    for (const [f, k] of DATA_KEYS.filter(([fam, x]) => !ISOMETRIC.has(x) && fam !== 'olympic' && fam !== 'delt_raise' && fam !== 'carry' && fam !== 'kneeling_hinge' && fam !== 'rotator_cuff')) { /* rotator_cuff (10.11.2026, partia 5): staw, fazy i kierunek per ćwiczenie w osobnym teście niżej; */ /* kneeling_hinge (10.11.2026): zawias w biodrach, zejście w dół (lowerFirst) 2 s i powrót 1 s — osobny test niżej; carry (10.11.2026): tryb cykliczny (marsz) — jedna faza „Marsz” bez pauz i sekund, osobny test niżej; delt_raise (09.11.2026): dwa stawy (shElev / shAbd) i wyjątki faz (Car Drivers, Alternating Deltoid Raise) — osobny test niżej; olympic (05.11.2026): mieszanka wahadła i trybu jednokierunkowego — fazy i staw per ćwiczenie sprawdza tests/figures-v2-olympic-petla.test.ts; każda rodzina z danych póz (pull_up, curl): fazy i staw z DATA_UI; unoszenie miednicy tylko w podciąganiu (03.11.2026: curl wypadł z kontroli przez zawężenie do pull_up) */
      const s = figureSpec(k)!; const a = frameAt(s, 0), b = frameAt(s, 1); const ui = DATA_UI[f];
      if (f === 'pull_up') expect([k, b.sk.pelvis[1] - a.sk.pelvis[1] > 0.5]).toEqual([k, true]);
      const ex = ui.exceptions?.[k]; /* wyjątek ćwiczenia (partia 3, 09.11.2026: Straight Arm Pulldown — łokieć prosty, mierzony bark shElev) */
      expect([k, s.lowerFirst]).toEqual([k, ex?.lowerFirst ?? ui.lowerFirst]); expect([k, measuredJoint(s)]).toEqual([k, FOREARM_JOINT[k] ?? (ex?.joints ?? ui.joints)[0]]); /* forearm (partia 5): staw wg FOREARM_JOINT */
      const nm = ex?.names ?? ui.names; const [msA, msB] = s.lowerFirst ? [2000, 1000] : [1000, 2000]; /* leg_machine (09.11.2026): maszyny przysiadu zaczynają od opuszczania (2 s) */
      const ph = phasesFor(s); expect(ph.map(p => [p.name, p.ms])).toEqual([[nm.first, msA], ['Pauza', 500], [nm.second, msB], ['Pauza', 500]]);
      /* Scapular Pull-Up (poprawka po recenzji ruchu, partia 1): ruch łopatek przy prostych rękach — kąt w łokciu się nie zmienia; reszta rośnie */
      if (ex?.hideAngle) { /* kąt ukryty na rysunku (hip_abd_add, partia 3, 09.11.2026: podpis „zgięcie biodra” nie opisuje odwodzenia) — kierunek pomiaru nie jest pokazywany */ }
      else if (k === 'Scapular Pull-Up') { expect(measuredAngle(s, 1).deg).toBeCloseTo(measuredAngle(s, 0).deg, 5); }
      /* triceps (04.11.2026): u = 0 to zgięcie, u = 1 wyprost — kąt zgięcia w łokciu maleje; hip_bridge (09.11.2026): u = 1 to wyprost bioder — kąt zgięcia w biodrze maleje; curl i podciąganie: rośnie */
      /* forearm (10.11.2026, partia 5): odwrotne uginanie nadgarstków to wyprost (u = 1 → zgięcie nadgarstka maleje, z +40° do −48°), pronacja to obrót z +70° do −70°; pozostałe (zgięcie dłoniowe, odwrotne uginanie z talerzem, obrót) rosną */
      else if (f === 'forearm' && /Reverse Wrist Curl|Pronation/.test(k)) { expect([k, measuredAngle(s, 1).deg < measuredAngle(s, 0).deg]).toEqual([k, true]); }
      /* partia 3, 09.11.2026: Straight Arm Pulldown — ręka prosta schodzi z góry do ud, uniesienie ramienia (shElev) maleje; Middle Back Shrug — łopatki ściągają się, wysunięcie barków (protract) maleje */
      else if (f === 'triceps' || f === 'hip_bridge' || ['Straight Arm Pulldown', 'Middle Back Shrug', 'Leg Press', 'Single Leg Press'].includes(k)) { /* Leg Press, Single Leg Press (09.11.2026): u = 0 nogi zgięte, u = 1 platforma wypchnięta — zgięcie kolana maleje */ expect([k, measuredAngle(s, 1).deg < measuredAngle(s, 0).deg]).toEqual([k, true]); }
      else { expect([k, measuredAngle(s, 1).deg > measuredAngle(s, 0).deg]).toEqual([k, true]); }
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
  test('carry (10.11.2026, tryb cykliczny marszu): 7 ćwiczeń, jedna faza „Marsz” bez sekund i pauz (phasesFor = walkPhases), mierzony staw ∈ ui.joints (kolano albo biodro), kierunek u nie jest podciąganiem (lowerFirst = false)', () => {
    const ui = DATA_UI.carry; const keys = DATA_KEYS.filter(([f]) => f === 'carry').map(([, k]) => k); expect(keys.length).toBe(7);
    for (const k of keys) {
      const sp = figureSpec(k)!; expect([k, sp.lowerFirst]).toEqual([k, false]); expect(ui.joints).toContain(measuredJoint(sp));
      expect([k, phasesFor(sp).map(p => [p.name, !!p.untimed])]).toEqual([k, [['Marsz', true]]]);
    }
  });
  test('kneeling_hinge (10.11.2026): zejście w dół 0 → 1 (lowerFirst), fazy Opuszczanie 2 s / Pauza / Prostowanie 1 s / Pauza z DATA_UI, mierzone biodro, kąt zgięcia w biodrze rośnie ze skłonem (≥ 30°)', () => {
    const ui = DATA_UI.kneeling_hinge; const keys = DATA_KEYS.filter(([f]) => f === 'kneeling_hinge').map(([, k]) => k); expect(keys).toEqual(['Seated Good Mornings']);
    for (const k of keys) {
      const s = figureSpec(k)!; expect([k, s.lowerFirst]).toEqual([k, true]); expect([k, measuredJoint(s)]).toEqual([k, 'hip']);
      expect(phasesFor(s).map(p => [p.name, p.ms])).toEqual([[ui.names.first, 2000], ['Pauza', 500], [ui.names.second, 1000], ['Pauza', 500]]);
      expect([k, measuredAngle(s, 1).deg - measuredAngle(s, 0).deg >= 30]).toEqual([k, true]);
    }
  });
  test('rotator_cuff (10.11.2026, partia 5): staw per ćwiczenie (shRot dla pięciu rotacji, shAbd dla Band Pull Apart i Reverse Flyes), fazy 1 s / pauza / 2 s / pauza (Obrót/Powrót, Rozsuwanie/Powrót, Unoszenie/Opuszczanie); rotacje zewnętrzne rosną (do ≥ 60° na zewnątrz), wewnętrzne maleją (od 58° do −32°), odwodzenie rośnie; Cuban Press (OTWARTE) bez rysunku', () => {
    const ui = DATA_UI.rotator_cuff; const keys = DATA_KEYS.filter(([f]) => f === 'rotator_cuff').map(([, k]) => k); expect(keys.length).toBe(7);
    const INT = ['Internal Rotation with Band', 'Cable Internal Rotation']; const ABD: Record<string, [string, string]> = { 'Band Pull Apart': ['Rozsuwanie', 'Powrót'], 'Reverse Flyes With External Rotation': ['Unoszenie', 'Opuszczanie'] };
    for (const k of keys) {
      const sp = figureSpec(k)!; expect([k, sp.lowerFirst]).toEqual([k, false]); expect([k, measuredJoint(sp)]).toEqual([k, ABD[k] ? 'shAbd' : 'shRot']); expect(ui.exceptions?.[k]?.joints ?? ui.joints).toContain(measuredJoint(sp));
      const [n1, n2] = ABD[k] ?? ['Obrót', 'Powrót']; expect([k, phasesFor(sp).map(p => [p.name, p.ms])]).toEqual([k, [[n1, 1000], ['Pauza', 500], [n2, 2000], ['Pauza', 500]]]);
      const a0 = measuredAngle(sp, 0).deg, a1 = measuredAngle(sp, 1).deg;
      expect([k, INT.includes(k) ? a1 < a0 - 60 : a1 > a0 + 60]).toEqual([k, true]);
    }
    expect(figureSpec('Cuban Press')).toBeNull();
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
    const BLAD_NIEWIDOCZNY = [/* 10.11.2026 (integrator partii 5): Behind-the-Back Barbell Wrist Curl|mis.jerk — po poprawce W2 forearm (ramię i przedramię nieruchome, rusza się tylko dłoń) szarpnięcie tempa nie zmienia punktów ciała o ≥ 3 cm; błąd tempa jak w curl/triceps/cable_row, wpis zestawu ogólnego r3 odsłonił go */ 'Seated Close-Grip Concentration Barbell Curl|mis.jerk', 'Dumbbell Front Raise to Overhead|mis.jerk', 'Car Drivers|mis.jerk', 'Cable Seated Lateral Raise|mis.jerk', 'Machine Lateral Raise|mis.jerk', 'Y Raise (hantle)|mis.jerk', 'Behind-the-Back Barbell Wrist Curl|mis.jerk']; /* delt_raise (09.11.2026; trzy ostatnie po wpisach „zestawy” z recenzji audytora — ten sam błąd tempa w zestawie ogólnym raiseSide): jerk to błąd tempa (errors.ts kind „tempo”, mods.tempo) — poza nie zmienia, jak w curl; tylko te dwa ćwiczenia mają go w zestawie; jak pokazuje go rysunek, ocenia recenzent niezależny */
    const JERK_CURL_TEMPO = JERK_TEMPO_RODZINY; /* 09.11.2026: rozszerzone na cable_row (Seated Cable Row i Wiosłowanie siedząc z kartą własną: błąd mis.jerk to błąd tempa, poza końca ruchu bez zmiany — ta sama przyczyna co curl i triceps); 05.11.2026: rozszerzone na triceps (3 ćwiczenia z zestawem ogólnym, recenzja niezależna r5 przyjęła jak w curl); ta sama przyczyna dla całej rodziny curl (błąd tempa); asercja czerwona już na 67ceb782 przed scaleniem integracji, rozszerzona 03.11.2026 z listy pojedynczej na rodzinę */
    const NA_DOLE = ['pu.partial']; /* fala 25, 01.11.2026: „bez wyprostu rąk na dole” widać w u = 0, góra jak w pozie poprawnej (scripts/figures/v2-jakosc.mjs: BLAD_DOL) */
    for (const [f, k] of DATA_KEYS) {
      const s = figureSpec(k)!; const errs: (FigError | undefined)[] = [undefined, ...errorsOf(s).map(e => e.error)];
      for (const er of errs) for (const u of U) { const is = checkFrame(frameAt(s, u, er)); if (is.length) throw new Error(`${k} ${er ?? 'poprawna'} u=${u}: ${JSON.stringify(is)}`); }
      for (const e of errorsOf(s)) {
        const uw = NA_DOLE.includes(e.cue) ? 0 : 1; const a = frameAt(s, uw).sk, b = frameAt(s, uw, e.error).sk; const pts = (x: typeof a) => [x.pelvis, x.spineMid, x.head, x.legs.R.knee, x.legs.R.ankle, x.arms.R.elbow];
        const dd = Math.max(...pts(a).map((p, i) => Math.hypot(p[0] - pts(b)[i][0], p[1] - pts(b)[i][1], p[2] - pts(b)[i][2]))); expect([k, e.error, dd > 3 || BLAD_NIEWIDOCZNY.includes(`${k}|${e.cue}`) || JERK_CURL_TEMPO(f, e.cue)]).toEqual([k, e.error, true]); /* widoczne: ≥ 3 cm (CONTRACT.visibleCm) */
      }
    }
  });
  test('macierz: kadr obejmuje poprawną pozę i pozy błędów; kształty w obu widokach i oba motywy istnieją dla każdego ćwiczenia z danymi', () => {
    for (const [, k] of DATA_KEYS) { const s = figureSpec(k)!; const es = errorsOf(s).map(e => e.error); for (const v of s.views) { const b = boxFor(s, v, es); expect([k, v, b.w > 20 && b.h > 50]).toEqual([k, v, true]); expect(shapesAt(s, 0.5, v, true, es[0]).length).toBeGreaterThan(20); } }
    expect(light.bg).not.toBe(dark.bg);
  });
  test('tempo: błąd z danych używa tempa domyślnego (jak poprawna poza)', () => { const s = figureSpec('Pull Up')!; expect(tempoFor(s, 'data:0')).toEqual(tempoFor(s)); expect(uAt(TEMPO.holdMs + TEMPO.upMs, false, tempoFor(s))).toBeCloseTo(1, 6); });
});

/* 05.11.2026: wyjątek „błąd tempa bez zmiany pozy” (mis.jerk z zestawu ogólnego) tylko dla rodzin curl i triceps, tylko dla tej wskazówki. */
const JERK_TEMPO_RODZINY = (f: string, cue: string) => ['curl', 'triceps', 'pulldown', 'shrug', 'hip_abd_add', 'leg_machine', 'cable_row'].includes(f) && cue === 'mis.jerk'; /* partia 3 (09.11.2026): zestawy ogólne vpull, shrug, row, hipAbd z błędem tempa mis.jerk — jak curl (recenzje niezależne partii 3 przyjęły zestawy) */
describe('wyjątek błędu tempa (mis.jerk): zakres', () => {
  test('negatyw: inna wskazówka albo inna rodzina nie korzysta z wyjątku', () => {
    expect(JERK_TEMPO_RODZINY('cable_row', 'mis.jerk')).toBe(true); expect(JERK_TEMPO_RODZINY('cable_row', 'mis.other')).toBe(false); expect(JERK_TEMPO_RODZINY('curl', 'mis.jerk')).toBe(true); expect(JERK_TEMPO_RODZINY('triceps', 'mis.jerk')).toBe(true);
    expect(JERK_TEMPO_RODZINY('triceps', 'mis.other')).toBe(false); expect(JERK_TEMPO_RODZINY('squat', 'mis.jerk')).toBe(false); expect(JERK_TEMPO_RODZINY('delt_raise', 'mis.jerk')).toBe(false);
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
