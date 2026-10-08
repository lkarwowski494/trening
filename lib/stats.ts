import { t, tp } from './i18n';
import { fmtW, fmtVol, fmtNum, wu, KG_PER_LB, volOut } from './units';
import { getState, exById, volume, finishedWorkouts, setSummary, isBW, setLoad, loadOf, effectiveLoad, setVolume, blockMult, setScore, isWorking, workSetCount, repsOf, memoHist, memoHistBy, workoutsWith, volOf, fmtSec, fmtDist } from './store';
import { hasReps, hasWeight, hasTime, hasDistance, catalogKey, own, type Exercise, type Impl, type MetricType, type WSet, type Workout } from './seed';

/*
 * Statystyki i rekordy (T-030, 0.3). Wszystko liczone z historii — bez osobnych tabel (jedno źródło prawdy: workouts).
 * e1RM: Epley (D-005) — ciężar × (1 + powtórzenia / 30); dla trybu „per hantel” liczony per hantel.
 *
 * Audyt 0.8.1: objętość serii ma jedną definicję (store.setVolume) — ta sama w historii, Postępach, rekordach i PR;
 * PR-y liczy jeden silnik (prMap), który podnosi poprzeczkę po każdej serii, więc odznaka przy serii, historia
 * i podsumowanie po treningu zawsze się zgadzają. Runda 75 (Q-001): masa ciała nie wchodzi do objętości ani rekordu sumy — w ćwiczeniach z masą ciała liczy się
 * tylko ±kg. Audyt 0.10 (E1, decyzja właściciela 08.10.2026, wariant B — zmienia Q-001 w części e1RM): e1RM z masą ciała tylko na podnoszonym ciężarze
 * (liftedLoad: udział masy ciała ze źródeł + ±kg) i tylko przy masie ciała podanej w Ustawieniach; bez niej — brak e1RM i rekordu e1RM.
 */

/** e1RM (Epley). Runda 26: zaokrąglenie do 1e-6 — remis (np. 82,5×6 i 90×3 = 99) nie jest „rekordem” przez błąd float. */
/** Runda 73: e1RM (szacowany ciężar na 1 powtórzenie) tylko z serii do 10 powtórzeń i bez drop setów. Standard: wzory szacujące 1RM
 * (Epley, Brzycki) są wiarygodne do ok. 10 powtórzeń do upadku (Mayhew i in., JSCR 2008: „repetition range of no more than 10 produces
 * better predictions”); drop set robiony na zmęczeniu nie mówi nic o maksie (drop 80×25 dawał 146,7 kg nad prawdziwe 140×1). */
export const E1RM_MAX_REPS = 10;
const e1rmR = (s: WSet, load: number, reps: number) => s.kind === 'drop' || reps > E1RM_MAX_REPS ? 0 : e1rm(load, reps);
const e1rmOf = (s: WSet, load: number) => e1rmR(s, load, repsOf(s));
/** T8: guma bez wpisanej asysty (kg) — obciążenie nieznane (startowe gumy nie mają kg), więc seria nie wchodzi do rekordów e1RM i objętości serii. */
/** Q-026 (decyzja właściciela a, 04.10.2026): seria zapisana pod innym sprzętem (wartość tylko w „obcym” polu — loadOf.own false, np. 42,5 kg
 * sprzed zmiany na masę ciała) — obciążenie dla obecnego sprzętu nieznane: bez rekordów, „max ±” i rekordu powtórzeń bez asysty. Widok (shownLoad) bez zmian. */
const foreignLoad = (ex: Exercise, s: WSet) => hasWeight(ex.metric ?? 'weight_reps') && !loadOf(ex, s).own;
const unknownAssist = (ex: Exercise, s: WSet) => (isBW(ex) && !!s.bandId && ex.bandAssistable && !(setLoad(ex, s) < 0)) || foreignLoad(ex, s); /* Q-018/83b: ciężar do obliczeń z jednego źródła (store.setLoad → loadOf) */
/**
 * E1 (audyt 0.10: MER-03, LOG-02; decyzja właściciela 08.10.2026, wariant B). Wzór Epleya mnoży CAŁY podnoszony ciężar przez (1 + r/30), więc e1RM
 * z samego dociążenia nie jest szacunkiem 1RM i odwraca kolejność serii (+30 × 3 „biło” +20 × 8). Ćwiczenia z masą ciała: podnoszony ciężar =
 * udział masy ciała × masa ciała z Ustawień + ±kg (asysta odejmuje). Udział tylko ze źródłami (docs/research/masa-ciala-e1rm-2026-10.md):
 *  - podciąganie nachwytem (Pull Up): cała masa ciała — Sánchez-Moreno i in. 2017 (IJSPP 12(10), 1378–1384): „PU maximal strength (1RM) was calculated
 *    as the sum of the maximum weight lifted and the subject's BM”; Talaber i in. 2022 (BMC SSMR, PMC9208152): „The 1RM weight documented was the
 *    officer's body weight plus the additional weight lifted”. Podchwyt i chwyt neutralny — ten sam ruch w zwisie (uproszczenie: cała masa ciała,
 *    choć dłonie i część przedramion nie są unoszone);
 *  - pompki (Push Up): ok. 64% masy ciała na rękach — van den Tillaar i Ball 2020 (J Hum Kinet, PMC7386139): 62,6–65,1%, „similar to previous studies
 *    (64.0 and 63.2%)”, Suprak i in. 2011: 69% (siły specjalne); Gouvali i Boudolos 2005: 66,4% (streszczenie). 0,64 — uproszczenie w tym przedziale;
 *    dociążenie liczone w całości jak w przykładzie van den Tillaara (1RM = 62,6% masy ciała + dodatkowy ciężar).
 * Bez źródła (dipy, inne pompki, ćwiczenia własne) — brak e1RM, także z masą ciała (pytanie otwarte). Liczby wyłącznie tutaj.
 */
export const BW_SHARE: Readonly<Record<string, number>> = { 'Pull Up': 1, 'Chin Up': 1, 'Neutral Grip Pull Up': 1, 'Push Up': 0.64 };
/** Udział masy ciała w podnoszonym ciężarze (po kluczu katalogu — zmiana nazwy go nie zmienia); undefined = brak źródła. */
export const bwShare = (ex: Exercise): number | undefined => isBW(ex) ? own(BW_SHARE, catalogKey(ex) ?? '') : undefined;
/** Ciężar do e1RM: zwykłe ćwiczenia — obciążenie efektywne; z masą ciała — udział × masa ciała + ±kg (0 = nie liczymy: brak masy ciała albo udziału). */
export function liftedLoad(ex: Exercise, s: WSet): number {
  if (!isBW(ex)) return effectiveLoad(ex, s);
  const bm = getState().settings.bodyMass; const sh = bwShare(ex); if (!bm || !sh) return 0;
  return Math.max(0, sh * bm + setLoad(ex, s));
}
const recE1 = (ex: Exercise, s: WSet) => unknownAssist(ex, s) ? 0 : e1rmOf(s, liftedLoad(ex, s));
/** E1: e1RM ćwiczenia z masą ciała pokazany jako „126,7 kg (masa ciała + 46,7)” — różnica = dociążenie, z którym wyszłoby 1 powtórzenie. */
export function bwE1Diff(ex: Exercise, v: number): number | null { const bm = getState().settings.bodyMass; const sh = bwShare(ex); return isBW(ex) && bm && sh ? v - sh * bm : null; }
const signedW = (kg: number) => `${kg < 0 ? '−' : '+'} ${fmtW(Math.abs(kg), false)}`;
export function fmtE1(ex: Exercise, v: number): string { const d = bwE1Diff(ex, v); return d == null ? fmtW(v) : t('{v} (masa ciała {d})', { v: fmtW(v), d: signedW(d) }); }
export const e1rm = (load: number, reps: number) => (load > 0 && reps > 0) ? Math.round((reps === 1 ? load : load * (1 + reps / 30)) * 1e6) / 1e6 : 0;

/** Runda 73 (decyzja 01.10): REKORD ćwiczenia = suma na treningu (objętość / powtórzenia / czas / dystans wg metryki) + e1RM.
 * Masa ciała: suma powtórzeń bez asysty (jak „most session reps” w Hevy); pozostałe maksima zostają na karcie jako informacja, bez odznaki PR. */
export type TotalKind = 'objętość treningu' | 'suma powtórzeń' | 'łączny czas' | 'łączny dystans';
export function totalKind(ex: Exercise): TotalKind | null {
  const m = ex.metric ?? 'weight_reps';
  if (hasReps(m) && (isBW(ex) || !hasWeight(m))) return 'suma powtórzeń';
  if (hasWeight(m) && hasReps(m)) return 'objętość treningu';
  if (m === 'distance_time') return 'łączny dystans';
  if (hasTime(m)) return 'łączny czas';
  return null;
}
/** Wkład serii do sumy treningu (tylko serie robocze). */
export function setTotal(ex: Exercise, s: WSet, impl?: Impl | null): number {
  if (!isWorking(s)) return 0; const k = totalKind(ex);
  return totalOf(k, ex, s, k === 'objętość treningu' ? setVolume(ex, s, impl) : 0, repsOf(s));
}
/** Rdzeń setTotal przy znanej objętości serii (setVolume) i powtórzeniach — runda 74: summarize liczy je raz na serię. */
function totalOf(k: TotalKind | null, ex: Exercise, s: WSet, vol: number, reps: number): number {
  switch (k) {
    case 'objętość treningu': return unknownAssist(ex, s) ? 0 : vol;
    case 'suma powtórzeń': return freeOf(ex, s) ? reps : 0;
    case 'łączny czas': return Number(s.durationSec) || 0;
    case 'łączny dystans': return Number(s.distanceM) || 0;
    default: return 0;
  }
}
export const fmtTotal = (ex: Exercise, v: number) => { const k = totalKind(ex); return k === 'objętość treningu' ? fmtVol(v) : k === 'suma powtórzeń' ? `${fmtNum(Math.round(v))} ${tp(Math.round(v), 'powtórzenie|powtórzenia|powtórzeń')}` : k === 'łączny czas' ? fmtSec(v) : k === 'łączny dystans' ? fmtDist(v) : fmtNum(v); };
/** Porównanie sum z dokładnością wyświetlania (objętość: pełne kg/lb). */
/** `units` = ile „jednostek ciężaru” weszło w sumę (mnożnik × powtórzenia): wpis w lb przyciągany do siatki kg odjeżdża o krok wyświetlania na każdą. */
const totalGt = (ex: Exercise, a: number, b: number, units = 0) => { const k = totalKind(ex);
  if (k === 'objętość treningu') return a > b + Math.max(1e-9, (wu() === 'lb' ? 0.1 * KG_PER_LB : 0.01) * units) && volOut(a) > volOut(b);
  if (k === 'łączny dystans') return a > b + 1e-9 && fmtDist(a) !== fmtDist(b); /* T13: 5004 m to wciąż „5 km” — bez widocznej różnicy nie ma rekordu */
  return a > b + 1e-9; };

export interface Session { /** runda 73: suma na treningu (rekord) */ total: number; workout: Workout; date: number; sets: WSet[]; bestSet: WSet; maxLoad: number; /** runda 62: czy w sesji jest wykonana seria (0 ±kg to wynik, a nie brak danych) */ hasLoad: boolean; bestE1rm: number; volume: number; maxReps: number; maxDuration: number; maxDistance: number; /** runda 74: do rekordów narastających */ bestSetVolume: number; maxRepsFree: number }

/** Klucz: id ćwiczenia + jednostka — objętość w lb liczona z wyświetlanych funtów (runda 73), więc cache zależy od jednostki. */
const allSessions = memoHistBy((key: string): Session[] => {
  const exId = key.split('|')[0]; const ex = exById(exId); if (!ex) return [];
  const out: Session[] = [];
  for (const w of workoutsWith(exId)) { /* runda 74: indeks zamiast przejścia po całej historii */
    const sets: WSet[] = []; const impls: (Impl | undefined)[] = []; for (const e of w.exercises) if (e.exerciseId === exId) for (const s of e.sets) if (isWorking(s)) { sets.push(s); impls.push(e.impl); }
    if (sets.length) out.push(summarize(ex, w, sets, impls));
  }
  return out.reverse();
});
/** Runda 74: czy ćwiczenie ma w historii choć jedną serię roboczą (= sessionsFor(ex).length > 0, bez liczenia sesji) — lista wyboru w Postępach. */
const withHistory = memoHist(() => { const out = new Set<string>(); for (const w of finishedWorkouts()) for (const e of w.exercises) if (!out.has(e.exerciseId) && e.sets.some(isWorking)) out.add(e.exerciseId); return out; });
export const hasHistory = (exId: string) => withHistory().has(exId);
/** Liczba sesji rozpoczętych przed `before` (sesje rosnąco po dacie — wyszukiwanie binarne). */
const countBefore = (all: Session[], before: number) => { let lo = 0, hi = all.length; while (lo < hi) { const mid = (lo + hi) >> 1; if (all[mid].date < before) lo = mid + 1; else hi = mid; } return lo; };
/** Sesje z danym ćwiczeniem, od najstarszej. `before` wyklucza treningi rozpoczęte od tego znacznika. */
export function sessionsFor(ex: Exercise, before?: number): Session[] {
  const all = allSessions(ex.id + '|' + wu()); return before == null ? all : all.slice(0, countBefore(all, before));
}
/** Seria faktycznie wykonana: powtórzenia > 0, a bez powtórzeń — czas (lub dystans) > 0. Runda 58: 50 kg × 0 s nie jest rekordem ciężaru. */
const performed = (m: MetricType, s: WSet, reps = repsOf(s)) => hasReps(m) ? reps > 0 : hasDistance(m) ? Number(s.distanceM) > 0 || Number(s.durationSec) > 0 /* runda 59: bieg z samym dystansem */ : hasTime(m) ? Number(s.durationSec) > 0 : true;
/** Runda 74: jedno przejście po seriach (wcześniej dziewięć) — te same definicje (setTotal, setVolume, recE1, setScore), tylko liczone raz. */
function summarize(ex: Exercise, w: Workout, sets: WSet[], impls: (Impl | undefined)[] = []): Session {
  const m = ex.metric ?? 'weight_reps'; const at = w.startedAt; const W = hasWeight(m), R = hasReps(m), T = hasTime(m), D = hasDistance(m);
  let total = 0, volume = 0, bestE1rm = 0, maxReps = 0, maxDuration = 0, maxDistance = 0, bestSetVolume = 0, maxRepsFree = 0, maxLoad = -Infinity, hasLoad = false;
  // Runda 13: seria bez powtórzeń (np. 140×0) nie jest „najlepszą” — jak przy rekordzie ciężaru (gdy żadna nie jest wykonana — najlepsza ze wszystkich).
  let bestP: WSet | null = null, bestPS = -Infinity, bestA = sets[0], bestAS = setScore(ex, sets[0]);
  const tk = totalKind(ex);
  sets.forEach((s, i) => { /* serie robocze (allSessions) — setVolume = volOf(obciążenie efektywne, powtórzenia, przyrząd bloku — Q-024) */
    const reps = repsOf(s); const sc = setScore(ex, s); if (sc > bestAS) { bestA = s; bestAS = sc; }
    if (performed(m, s, reps)) { if (sc > bestPS) { bestP = s; bestPS = sc; } if (W && !unknownAssist(ex, s)) { maxLoad = Math.max(maxLoad, setLoad(ex, s)); hasLoad = true; } } /* Q-008: guma bez wpisanych kg — obciążenie nieznane, nie „±0” */
    const load = W && R ? effectiveLoad(ex, s) : 0; const v = W && R ? volOf(ex, load, reps, impls[i]) : 0; volume += v;
    total += totalOf(tk, ex, s, v, reps);
    if (!unknownAssist(ex, s)) { bestSetVolume = Math.max(bestSetVolume, v); if (W && R) bestE1rm = Math.max(bestE1rm, e1rmR(s, isBW(ex) ? liftedLoad(ex, s) : load, reps)); } /* E1: z masą ciała — podnoszony ciężar */
    if (R && s.kind !== 'drop') maxReps = Math.max(maxReps, reps); /* Q-005: drop set (na zmęczeniu, lżej) to nie „max powtórzeń w serii” — jak przy e1RM */
    if (T) maxDuration = Math.max(maxDuration, Number(s.durationSec) || 0);
    if (D) maxDistance = Math.max(maxDistance, Number(s.distanceM) || 0);
    if (freeOf(ex, s) && s.kind !== 'drop') maxRepsFree = Math.max(maxRepsFree, reps); /* Q-005 (audyt 74): także bez asysty */
  });
  return { workout: w, date: at, sets, bestSet: bestP ?? bestA, total, maxLoad: maxLoad === -Infinity ? 0 : maxLoad, hasLoad, bestE1rm, volume, maxReps, maxDuration, maxDistance, bestSetVolume, maxRepsFree };
}

export interface Records { /** runda 73: najlepsza suma na treningu */ bestTotal: number; maxLoad: number; bestE1rm: number; bestSetVolume: number; maxReps: number; /** runda 72: najwięcej powtórzeń bez asysty (ćwiczenia z masą ciała: ±kg ≥ 0) — próg rekordu powtórzeń */ maxRepsFree: number; /** Q-026: czy któraś sesja miała sumę > 0 (próg rekordu sumy) */ totalAny: boolean; /** T6: czy w historii jest seria, z której liczy się e1RM (≤ 10 powt., nie drop) */ e1rmAny: boolean; maxDuration: number; maxDistance: number; any: boolean }
export const emptyRecords = (): Records => ({ bestTotal: 0, maxLoad: 0, bestE1rm: 0, bestSetVolume: 0, maxReps: 0, maxRepsFree: 0, e1rmAny: false, totalAny: false, maxDuration: 0, maxDistance: 0, any: false });
/** Rekordy z historii przed znacznikiem `before` (domyślnie: cała historia). Kopia — prMap podnosi poprzeczki. */
export function recordsFor(ex: Exercise, before?: number): Records {
  const key = ex.id + '|' + wu(); const all = allSessions(key); const n = before == null ? all.length : countBefore(all, before);
  return n ? { ...recordsPrefix(key)[n - 1] } : emptyRecords();
}
/** Runda 74: rekordy narastające — wpis i = rekordy z sesji 0..i. Liczone raz na zmianę historii; rekordy sprzed dowolnej daty
 * (historia: PR każdej sesji) to wyszukiwanie binarne zamiast przejścia po wszystkich sesjach (wcześniej 1,4 s dla 5000 treningów). */
const recordsPrefix = memoHistBy((key: string): Records[] => {
  const out: Records[] = []; let r = emptyRecords();
  for (const s of allSessions(key)) {
    r = { any: true, bestTotal: Math.max(r.bestTotal, s.total), maxLoad: Math.max(r.maxLoad, s.maxLoad), bestE1rm: Math.max(r.bestE1rm, s.bestE1rm), e1rmAny: r.e1rmAny || s.bestE1rm > 0, totalAny: r.totalAny || s.total > 0,
      maxReps: Math.max(r.maxReps, s.maxReps), maxDuration: Math.max(r.maxDuration, s.maxDuration), maxDistance: Math.max(r.maxDistance, s.maxDistance),
      bestSetVolume: Math.max(r.bestSetVolume, s.bestSetVolume), maxRepsFree: Math.max(r.maxRepsFree, s.maxRepsFree) };
    out.push(r);
  }
  return out;
});
/**
 * Rekord e1RM tej serii względem `rec` (pusta lista = brak PR). Runda 73: z serii odznaczany jest już tylko e1RM —
 * drugi rekord, suma na treningu, liczy się dla całego ćwiczenia w prMap (odznaka przy serii, która przebiła poprzednią sumę).
 */
export function setPRs(ex: Exercise, s: WSet, rec: Records): string[] {
  if (!isWorking(s)) return [];
  const m = ex.metric ?? 'weight_reps'; const reps = repsOf(s);
  // Runda 72 (T5): tolerancja jednego kroku wyświetlania na „udział” ciężaru w e1RM (1 + pow./30) — w lb przyciąganie wpisu
  // do siatki kg potrafi odjechać o ~0,03 kg od starego zapisu tej samej liczby funtów; remis to nie rekord (runda 26).
  const tol = wu() === 'lb' ? 0.1 * KG_PER_LB - 1e-6 : 0.005; const gtk = (a: number, b: number, k = 1) => a > b + Math.max(1e-9, tol * k);
  if (hasWeight(m) && hasReps(m)) { const e = recE1(ex, s); if (e > 0 && rec.e1rmAny && gtk(e, rec.bestE1rm, 1 + reps / 30)) return ['e1RM']; }
  return [];
}
/** Seria bez asysty: ćwiczenie bez ciężaru albo z masą ciała z ±kg ≥ 0 (dociążenie też — trudniej niż sama masa ciała). */
const freeOf = (ex: Exercise, s: WSet) => { const m = ex.metric ?? 'weight_reps'; return !(s.bandId && ex.bandAssistable) /* przegląd 06.10: guma oporowa to nie asysta */ && !foreignLoad(ex, s) /* Q-026 */ && (!hasWeight(m) || (isBW(ex) && setLoad(ex, s) >= 0)); };
/** Podnosi poprzeczkę e1RM w trakcie treningu (druga identyczna seria nie jest rekordem). Runda 73: tylko e1RM — pozostałe maksima
 * nie dają już odznaki z serii, a sumę na treningu liczy prMap; podnoszenie ich tutaj było martwym kodem (wykazały to testy mutacyjne). */
function raise(ex: Exercise, s: WSet, rec: Records) {
  const e1 = recE1(ex, s); rec.bestE1rm = Math.max(rec.bestE1rm, e1); if (e1 > 0) rec.e1rmAny = true;
}
/**
 * PR-y treningu: mapa id serii → rodzaje rekordów. Serie liczone w kolejności odhaczenia (completedAt),
 * każda podnosi poprzeczkę dla kolejnych — druga identyczna seria nie jest rekordem. Używane przy serii,
 * w historii i w podsumowaniu, więc wszystkie trzy miejsca pokazują to samo.
 */
export function prMap(w: Workout): Map<string, string[]> {
  const out = new Map<string, string[]>(); const at = w.startedAt; const recs = new Map<string, Records>(); const run = new Map<string, number>(); const runU = new Map<string, number>(); const totDone = new Set<string>();
  const sets: { ex: Exercise; s: WSet; order: number; impl?: Impl }[] = [];
  w.exercises.forEach((e, ei) => { const ex = exById(e.exerciseId); if (!ex) return; e.sets.forEach((s, si) => { if (isWorking(s)) sets.push({ ex, s, order: s.completedAt ?? (ei * 1000 + si), impl: e.impl }); }); });
  sets.sort((a, b) => a.order - b.order);
  for (const { ex, s, impl } of sets) {
    let rec = recs.get(ex.id); if (!rec) { rec = recordsFor(ex, at); recs.set(ex.id, rec); }
    // Runda 72 (T5): pierwsza sesja ćwiczenia nie jest „rekordem” — nowy użytkownik nie dostaje 8 rekordów po pierwszym treningu.
    const k = rec.any ? setPRs(ex, s, rec) : [];
    // Runda 73: suma na treningu — odznaka przy serii, która przebiła najlepszą dotychczasową sumę (raz na ćwiczenie w treningu).
    const tk = totalKind(ex); if (tk) { const st = setTotal(ex, s, impl); const v = (run.get(ex.id) ?? 0) + st; run.set(ex.id, v);
      const u = (runU.get(ex.id) ?? 0) + (st > 0 ? blockMult(ex, impl) * repsOf(s) : 0); runU.set(ex.id, u);
      if (rec.any && rec.totalAny /* Q-026 (audyt 04.10): bez porównywalnej sumy w historii (np. same serie spod innego sprzętu) — bez rekordu sumy, jak e1rmAny */ && !totDone.has(ex.id) && v > 0 && totalGt(ex, v, rec.bestTotal, u)) { k.push(tk); totDone.add(ex.id); } }
    if (k.length) out.set(s.id, k);
    raise(ex, s, rec);
  }
  return out;
}
/** PR-y całego treningu (do podsumowania po zakończeniu). */
export type WorkoutPR = { exercise: Exercise; set: WSet; kinds: string[]; /** runda 73: gotowe opisy do podsumowania (suma treningu, e1RM z serią) */ details: string[] };
export function workoutPRs(w: Workout): WorkoutPR[] {
  const map = prMap(w); const out: { exercise: Exercise; set: WSet; kinds: string[] }[] = [];
  w.exercises.forEach(e => { const ex = exById(e.exerciseId); if (!ex) return; e.sets.forEach(s => { const k = map.get(s.id); if (k) out.push({ exercise: ex, set: s, kinds: k }); }); });
  // Runda 72 (T5): w podsumowaniu jeden wpis na ćwiczenie i rodzaj rekordu — ostatnia (najlepsza) seria; rozgrzewające 100/105/110 to jeden rekord, nie trzy.
  // Kolejność odhaczenia jak w prMap: każda późniejsza seria z tym samym rodzajem jest lepsza od wcześniejszej.
  const order = (x: { set: WSet }) => x.set.completedAt ?? 0; const last = new Map<string, typeof out[number]>();
  for (const x of [...out].sort((a, b) => order(a) - order(b))) for (const k of x.kinds) last.set(x.exercise.id + '|' + k, x);
  const total = (ex: Exercise) => w.exercises.filter(e => e.exerciseId === ex.id).reduce((a, e) => a + e.sets.reduce((b, s) => b + setTotal(ex, s, e.impl), 0), 0);
  return out.map(x => ({ ...x, kinds: x.kinds.filter(k => last.get(x.exercise.id + '|' + k) === x) })).filter(x => x.kinds.length)
    .map(x => ({ ...x, details: [...x.kinds].sort((a, b) => (a === 'e1RM' ? 1 : 0) - (b === 'e1RM' ? 1 : 0)) /* T13: najpierw suma (główny rekord), potem e1RM */
      .map(k => k === 'e1RM' ? (isBW(x.exercise) ? t('e1RM {v} (masa ciała {d}; seria {s})', { v: fmtW(recE1(x.exercise, x.set)), d: signedW(bwE1Diff(x.exercise, recE1(x.exercise, x.set)) ?? 0), s: `${fmtW(setLoad(x.exercise, x.set))} × ${repsOf(x.set)}` /* T13: „seria 6” wyglądało jak numer serii; E1: „masa ciała + X” */ }) : t('e1RM {v} (seria {s})', { v: fmtW(recE1(x.exercise, x.set)), s: setSummary(x.exercise, x.set) })) : t('{k}: {v}', { k: t(k), v: fmtTotal(x.exercise, total(x.exercise)) })) }));
}

/** E3 (audyt 0.10: X-08, LOG-06): liczba rekordów treningu — JEDNA funkcja dla okna po treningu i karty „Ostatni trening” (decyzja T13: liczba
 * rekordów, nie serii — suma treningu i e1RM tej samej serii to dwa rekordy). */
export const prCountOf = (prs: readonly WorkoutPR[]) => prs.reduce((a, p) => a + p.details.length, 0);
export const prCount = (w: Workout) => prCountOf(workoutPRs(w));

/** Serie wykresu dostępne dla metryki ćwiczenia. */
export type ChartKey = 'total' | 'maxLoad' | 'bestE1rm' | 'volume' | 'maxReps' | 'maxDuration' | 'maxDistance';
type ChartKeyDef = { key: ChartKey; label: string; fmt: (v: number) => string; /** runda 69: oś w jednostkach wyświetlanych */ scale?: number; minStep?: number; intOnly?: boolean; /** runda 71: oś czasu */ time?: boolean };
export function chartKeysFor(ex: Exercise): ChartKeyDef[] {
  const m = ex.metric ?? 'weight_reps'; const kg = (v: number) => fmtW(v); const lb = wu() === 'lb'; const ws = { scale: lb ? 1 / KG_PER_LB : 1, minStep: lb ? 0.1 : 0.01 };
  const out: ChartKeyDef[] = [];
  // Runda 73: najpierw seria rekordu (suma na treningu), potem e1RM, potem pozostałe maksima (informacyjnie).
  const tk = totalKind(ex);
  if (tk === 'suma powtórzeń') out.push({ key: 'total', label: t('suma pow.'), fmt: v => fmtNum(Math.round(v)), intOnly: true });
  if (tk === 'łączny czas') out.push({ key: 'total', label: t('łączny czas'), fmt: v => fmtSec(v), intOnly: true, time: true });
  if (tk === 'łączny dystans') out.push({ key: 'total', label: t('łączny dystans'), fmt: v => fmtDist(v), intOnly: true, minStep: 10 });
  const vol: ChartKeyDef = { key: 'volume', label: t('objętość'), fmt: fmtVol, scale: ws.scale, minStep: 1, intOnly: true /* T3: etykiety całkowite — krok 2,5 dawał powtórzone etykiety */ }; // runda 7: jak w historii
  if (tk === 'objętość treningu') out.push(vol);
  if (hasWeight(m) && hasReps(m) && (!isBW(ex) || (bwShare(ex) && getState().settings.bodyMass))) out.push({ key: 'bestE1rm', label: 'e1RM', fmt: kg, ...ws }); /* E1: masa ciała — tylko z masą ciała i udziałem ze źródeł */
  if (hasWeight(m)) out.push({ key: 'maxLoad', label: isBW(ex) ? t('max ±') : t('max ciężar'), fmt: kg, ...ws });
  if (hasWeight(m) && hasReps(m) && tk !== 'objętość treningu') out.push({ key: 'volume', label: t('objętość'), fmt: fmtVol, scale: ws.scale, minStep: 1, intOnly: true /* T3: etykiety całkowite — krok 2,5 dawał powtórzone etykiety */ }); // runda 7: jak w historii
  if (hasReps(m)) out.push({ key: 'maxReps', label: t('max pow.'), fmt: v => fmtNum(Math.round(v)), intOnly: true }); // runda 15: oś bez „2.5999999999999996”
  // Runda 7: w biegu (dystans+czas) „max czas” nagradzałby najwolniejszą sesję — jak przy PR (runda 6) pomijamy.
  if (hasTime(m) && m !== 'distance_time') out.push({ key: 'maxDuration', label: t('max czas'), fmt: v => fmtSec(v), intOnly: true, time: true });
  if (hasDistance(m)) out.push({ key: 'maxDistance', label: t('max dystans'), fmt: v => fmtDist(v), intOnly: true, minStep: 10 });
  return out;
}

/** Poniedziałek tygodnia z przesunięciem o `offsetWeeks` — budowany z daty kalendarzowej, więc odporny na zmianę czasu (DST). */
export function thisMonday(offsetWeeks = 0, now = new Date()): number { const day = (now.getDay() + 6) % 7; return new Date(now.getFullYear(), now.getMonth(), now.getDate() - day + offsetWeeks * 7).getTime(); }

/** Tygodniowa objętość i liczba serii roboczych (ostatnie n tygodni) — do ekranu Postępy. */
export function weeklyTotals(weeks = 8, now = new Date()): { weekStart: number; volume: number; sets: number; workouts: number }[] {
  const out = Array.from({ length: weeks }, (_, i) => ({ weekStart: thisMonday(i - (weeks - 1), now), volume: 0, sets: 0, workouts: 0 }));
  const end = thisMonday(1, now);
  for (const w of finishedWorkouts()) {
    if (w.startedAt < out[0].weekStart || w.startedAt >= end) continue;
    let idx = weeks - 1; while (idx > 0 && w.startedAt < out[idx].weekStart) idx--;
    out[idx].workouts++; out[idx].volume += volume(w); // suma objętości treningów = to samo co w historii
    w.exercises.forEach(e => { if (!exById(e.exerciseId)) return; out[idx].sets += workSetCount(e.sets); }); /* D3: drop razem z serią */
  }
  return out;
}
export const hasAnyHistory = () => getState().workouts.some(w => w.finishedAt);

/** Znacznik przy „Serie per partia” (pakiet C, 08.10.2026). Źródło: ACSM Position Stand 2026 (Currier i in., MSSE 58(4), pełny tekst
 * PMC12965823, sekcja „Improving hypertrophy”): „Between RTx, hypertrophy was enhanced by … higher volume (≥10 sets/muscle group/wk)”;
 * to samo stanowisko: każdy trening siłowy poprawia hipertrofię względem braku treningu — znacznik nie jest progiem „działa / nie działa”.
 * Uproszczenie: u nas serie pomocnicze liczą się po 0,5 (Pelland 2026, docs/21 B3), w stanowisku — serie na partię bez tego rozróżnienia. */
export const WEEKLY_SETS_MARK = 10;
/** Serie robocze per partia w tygodniu zaczynającym się `weekStart` (główna = 1, pomocnicza = 0,5), jak w Hevy/Boostcamp. */
export function weeklySetsByMuscle(weekStart: number): Record<string, number> {
  const d = new Date(weekStart); return setsByMuscle(weekStart, new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7).getTime());
}
/** Serie robocze per partia w okresie [start, end) — tydzień w Postępach, okres podsumowania i mapa mięśni (08.10.2026). */
export function setsByMuscle(start: number, end: number): Record<string, number> {
  const out: Record<string, number> = {};
  for (const w of finishedWorkouts()) { if (w.startedAt < start || w.startedAt >= end) continue;
    w.exercises.forEach(e => { const ex = exById(e.exerciseId); if (!ex) return; const n = workSetCount(e.sets); if (!n) return; /* D3: drop razem z serią (uproszczenie) */
      (ex.muscles ?? []).forEach(mu => { out[mu] = (out[mu] ?? 0) + n; }); (ex.secondaryMuscles ?? []).forEach(mu => { out[mu] = (out[mu] ?? 0) + n * 0.5; }); }); }
  return out;
}

/** Objętość per partia w tygodniu (uwaga właściciela 06.10.2026: „obciążenie per partia analogicznie”) — objętość serii roboczych
 * (jak „Objętość tygodniowo”), partia główna 1, pomocnicza 0,5 (jak serie per partia). Wartości w kg (wyświetlanie: volOut). */
export function weeklyVolumeByMuscle(weekStart: number): Record<string, number> {
  const out: Record<string, number> = {}; const d = new Date(weekStart); const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7).getTime();
  for (const w of finishedWorkouts()) { if (w.startedAt < weekStart || w.startedAt >= end) continue;
    w.exercises.forEach(e => { const ex = exById(e.exerciseId); if (!ex) return; const v = e.sets.filter(isWorking).reduce((a, s) => a + setVolume(ex, s, e.impl), 0); if (!v) return;
      (ex.muscles ?? []).forEach(mu => { out[mu] = (out[mu] ?? 0) + v; }); (ex.secondaryMuscles ?? []).forEach(mu => { out[mu] = (out[mu] ?? 0) + v * 0.5; }); }); }
  return out;
}
