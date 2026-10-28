/*
 * Seria i ćwiczenie w obliczeniach: wyszukiwanie po id (ćwiczenie, guma), obciążenie serii (jedno źródło — loadOf), objętość, liczba serii
 * roboczych, etykiety kolumny ciężaru, przerwa domyślna, opis i wynik serii, nazwy gum do wyświetlenia.
 * Zależy od: ./core, ./time, ./effort; zewnętrzne: ../seed, ../catalog.generated, ../units, ../i18n.
 */
import { t, tIn, upper, fold, LANGS } from '../i18n';
import { wu, unitLabel, wOut, KG_PER_LB, fmtW } from '../units';
import { loadModeFor, loadMult, hasReps, hasWeight, own, type Impl, type SetKind, type Workout, type WSet, type Exercise, catalogKey } from '../seed';
import { CABLES } from '../catalog.generated';
import { fmtSec, fmtDist } from './time';
import { getState } from './core';
import { effortScale, effortText } from './effort';

/* ---------- helpers ---------- */
/** PERF-05 (audyt 0.10): indeks id → pozycja zamiast liniowego find po 1154 ćwiczeniach (CSV, okresy, mapa mięśni — każdy blok historii).
 * Odporny na zmiany listy w miejscu: trafienie sprawdzane (ten sam id na tej pozycji); chybienie — jedno przejście jak dawniej find, a gdy ćwiczenie
 * jednak jest (lista zmieniona w miejscu: dopisanie, podmiana), indeks budowany od nowa. Brak id (np. blok z importu) — bez przebudowy. */
let exIdx: { arr: Exercise[]; m: Map<string, number> } | null = null;
export const exById = (id: string): Exercise | undefined => {
  const arr = getState().exercises;
  if (exIdx && exIdx.arr === arr) { const i = exIdx.m.get(id); const e = i === undefined ? undefined : arr[i]; if (e && e.id === id) return e; }
  const e = arr.find(x => x.id === id); if (!e) return undefined; /* chybienie: jedno przejście jak dawniej; brak id — bez przebudowy (np. blok z importu) */
  const m = new Map<string, number>();
  arr.forEach((x, i) => {
    if (!m.has(x.id)) m.set(x.id, i);
  });
  exIdx = { arr, m }; /* lista zmieniła się w miejscu — indeks od nowa */
  return e;
};
export const bandById = (id: string) => getState().bands.find(b => b.id === id);
export const isBW = (e: Exercise) => e.equipment === 'masa ciała';
/** Liczba powtórzeń do obliczeń: nieujemna liczba całkowita. */
export const repsOf = (s: WSet) => Math.max(0, Math.floor(Number(s.reps) || 0));
/**
 * Ciężar serii — JEDNO źródło (Q-018, runda 83b). Seria ma dwa pola: `weight` (kg — sprzęt z ciężarem) i `addKg` (±kg — masa ciała:
 * + dociążenie, − asysta). Pole „własne” to to, które pasuje do OBECNEGO sprzętu ćwiczenia; drugie („obce”) zostaje w seriach zapisanych
 * przed zmianą sprzętu (np. „inne” 42,5 kg → masa ciała).
 * Reguła (decyzja rundy 83b):
 *  - WIDOK (historia: ekran sesji, edytor, opisy serii „Ostatnio”/Postępy, CSV) pokazuje wartość własnego pola, a gdy puste — obcego
 *    (`shownLoad`), żeby historia mówiła, co wpisano (Q-018: bez „0 kg”);
 *  - OBLICZENIA i trening w toku (objętość, rekordy max/e1RM, PR, „najlepsza seria”, podpowiedź progresji, „Poprzednio”, wpisywanie
 *    podpowiedzi) biorą WYŁĄCZNIE własne pole (`setLoad`): 42,5 kg maszyny to nie „+42,5 kg dociążenia”, a asysta −20 to nie ciężar sztangi
 *    — runda 83 (Q-018) liczyła je do rekordów i progresji (audyt 83b, MEDIUM 1). Obca wartość zacznie się liczyć, gdy użytkownik wpisze ją
 *    w edytorze historii (zapis `writeLoad` przenosi ją do własnego pola).
 * Ujemna wartość ma sens tylko przy masie ciała (asysta): poza nią widok i obliczenia dają ≥ 0 (runda 48; audyt 83b, LOW 1).
 * Wpisane 0 jest wartością (bez sięgania do drugiego pola). Usunięte ćwiczenie (ex brak) = pole kg własne.
 */
export function loadOf(ex: Exercise | undefined, s: Pick<WSet, 'weight' | 'addKg'>): { kg: number; own: boolean; raw: number | '' } {
  const bw = !!ex && isBW(ex); const a = bw ? s.addKg : s.weight, b = bw ? s.weight : s.addKg; const has = (v: unknown) => v !== '' && v != null;
  const own = has(a) || !has(b); const raw: number | '' = has(a) ? (Number(a) || 0) : has(b) ? (Number(b) || 0) : '';
  const v = raw === '' ? '' : bw ? raw : Math.max(0, raw);
  return { kg: v === '' ? 0 : v, own, raw: v };
}
/** Ciężar do WYŚWIETLENIA (historia, edytor historii, opisy serii, CSV) — patrz loadOf. */
export const shownLoad = (ex: Exercise | undefined, s: Pick<WSet, 'weight' | 'addKg'>) => loadOf(ex, s).kg;
/** Obciążenie zewnętrzne serii do OBLICZEŃ: tylko pole właściwe dla obecnego sprzętu — kg (≥ 0) albo ±kg przy masie ciała (dodatnie = dociążenie,
 * ujemne = asysta gumą/maszyną — 0.5, wzór z popularnej aplikacji treningowej). Seria zapisana pod innym sprzętem = 0 (patrz loadOf). */
export const setLoad = (ex: Exercise, s: Pick<WSet, 'weight' | 'addKg'>) => {
  const l = loadOf(ex, s);
  return l.own ? l.kg : 0;
}; // runda 48: ujemny ciężar (np. asysta z szablonu po zmianie sprzętu) nie daje ujemnej objętości
/** Pole ciężaru w formularzu edytora historii: wartość, którą pokazuje ekran sesji (shownLoad), jako zapisane kg (lub '' gdy brak). */
export const loadFieldValue = (ex: Exercise | undefined, s: Pick<WSet, 'weight' | 'addKg'>): number | '' => loadOf(ex, s).raw;
/** Zapis ciężaru wpisanego w pole serii (trening w toku i edytor historii): do pola właściwego dla obecnego sprzętu; obce pole jest czyszczone —
 * wpis określa obciążenie w obecnym sprzęcie (runda 83b; dzięki temu da się też wyczyścić pole pokazujące obcą wartość). */
export function writeLoad(ex: Exercise | undefined, s: Pick<WSet, 'weight' | 'addKg'>, kg: number | '') {
  if (ex && isBW(ex)) { s.addKg = kg; s.weight = ''; } else { s.weight = kg === '' ? '' : Math.max(0, kg); s.addKg = ''; } /* runda 54: ciężar nieujemny */
}
/** Obciążenie efektywne: dla ćwiczeń z masą ciała tylko ±kg (dociążenie; asysta = 0), dla reszty ciężar.
 * Runda 75 (Q-001, decyzja 02.10.2026): masa ciała nie wchodzi do żadnych obliczeń — rekord to „moja masa ciała” albo „masa ciała + 10 kg”. */
export function effectiveLoad(ex: Exercise, s: Pick<WSet, 'weight' | 'addKg'>): number { return Math.max(0, setLoad(ex, s)); }
/** Mnożnik objętości: per hantel / jednostronne ×2, łącznie ×1; ćwiczenia z masą ciała zawsze ×1. */
export const exMult = (ex: Exercise) => isBW(ex) ? 1 : loadMult(ex.loadMode ?? loadModeFor(ex.equipment, catalogKey(ex) ?? ex.name));
/** Seria robocza = odhaczona i nie rozgrzewkowa. */
export const isWorking = (s: WSet) => s.done && s.kind !== 'warmup' && !s.warmup;
/** D3 (audyt 0.10, decyzja A, 08.10.2026): JEDNA definicja liczby serii roboczych — bez rozgrzewek, a drop set liczy się razem z serią, po której jest
 * (jak cięcie deload i rundy supersetu); drop bez serii przed nim liczy się sam. Uproszczenie: brak źródła, jak liczyć drop sety w tygodniowej
 * objętości (docs/research/22, pytanie otwarte). Używane w kartach szablonów, Postępach, kafelkach, seriach na partię, mapie mięśni, pytaniu deload,
 * Kolejności, edycji historii, liście Historii i w Zdrowiu. */
export function workCount(kinds: readonly (SetKind | undefined)[]): number {
  let n = 0, prev = false; for (const k of kinds) { if (k === 'warmup') continue; if (!(k === 'drop' && prev)) n++; prev = true; } return n;
}
/** Serie robocze bloku (odhaczone, bez rozgrzewek; drop razem z poprzednią serią). */
export const workSetCount = (sets: readonly WSet[]) => workCount(sets.filter(isWorking).map(s => s.kind));
/** X-15 (audyt 0.10): serie robocze treningu — bloki bez ćwiczenia (np. z importu) pominięte, jak w kafelkach i Postępach. */
export const workingSets = (w: Workout) => w.exercises.reduce((a, e) => a + (exById(e.exerciseId) ? workSetCount(e.sets) : 0), 0);
/** Objętość jednej serii — JEDYNA definicja, używana w historii, Postępach, rekordach i PR (audyt 0.8.1). */
export function setVolume(ex: Exercise, s: WSet, impl?: Impl | null): number {
  const m = ex.metric ?? 'weight_reps'; if (!isWorking(s) || !hasWeight(m) || !hasReps(m)) return 0;
  return volOf(ex, effectiveLoad(ex, s), repsOf(s), impl);
}
/** Q-024 (decyzja właściciela 04.10.2026: „×2 dla dwóch linek”): blok na stacji (`impl` 'electric' — ciężar wpisywany NA STRONĘ) przy ćwiczeniu
 * biblioteki na dwie linki (katalog: CABLES 2) liczy objętość ×2 zamiast mnożnika trybu liczenia (RDL „na hantel” zostaje ×2, nie ×4). Wyciąg siłowni,
 * hantle, jedna linka, ćwiczenia własne i bloki bez zapisanego przyrządu — bez zmian. */
export const blockMult = (ex: Exercise, impl?: Impl | null) => {
  const k = catalogKey(ex);
  return !isBW(ex) && impl === 'electric' && !!k && own(CABLES as Record<string, 1 | 2>, k) === 2 ? 2 : exMult(ex);
}; /* E2 (audyt 0.10, X-03): po kluczu katalogu — zmiana nazwy nie zmienia objętości dawnych sesji */
/** Rdzeń setVolume dla znanego obciążenia efektywnego i powtórzeń (runda 74: statystyki liczą je raz na serię). */
export const volOf = (ex: Exercise, load: number, reps: number, impl?: Impl | null) => blockMult(ex, impl) * dispKg(load) * reps;
/** Runda 73 (T13): w lb ciężar serii liczony tak, jak go widać (0,1 lb) — wpis 100 lb zapisany jako 45,35 kg dawał objętość 2999 lb zamiast 3000.
 * Zwraca kg odpowiadające dokładnie wyświetlanej liczbie funtów; w kg bez zmian. */
const dispKg = (kg: number) => wu() === 'lb' ? wOut(kg) * KG_PER_LB : kg;
/** Etykieta kolumny ciężaru zależna od trybu liczenia — a dla bloku na stacji z oporem elektrycznym/magnetycznym (`impl` 'electric') zawsze
 * NA STRONĘ (decyzja 03.10.2026 „stacja elektryczna na stronę”; audyt f132330/025ee6a, MEDIUM 2: wcześniej zmieniała się tylko lista ciężarów, a kolumna
 * mówiła „kg” / „kg/hantel”). Dotyczy każdego ćwiczenia na stacji, także „Przysiad z pasem (linki)”, „Cable Fly”, „RDL (hantle/linki)”.
 * `impl` — przyrząd bloku (WExercise.impl; blockImpl dopowiada go z miejsca, gdy blok go nie ma); bez przyrządu — jak przed P-003.
 * Objętość: Q-024 (blockMult) — ×2 na stacji przy ćwiczeniach na dwie linki. */
const perSide = (impl: Impl | null | undefined) => impl === 'electric';
/** Runda 69 (zrzuty): krótka etykieta kolumny tabeli — pełna zostaje dla VoiceOver. */
export const loadLabelShort = (ex: Exercise, impl?: Impl | null) => isBW(ex) ? `±${unitLabel()}`
    : perSide(impl) ? t('{u}/str.', { u: unitLabel() }) : (ex.loadMode === 'per_dumbbell' ? t('{u}/hant.', { u: unitLabel() })
    : ex.loadMode === 'unilateral' ? t('{u}/str.', { u: unitLabel() }) : unitLabel());
export const loadLabel = (ex: Exercise, impl?: Impl | null) => isBW(ex) ? `±${unitLabel()}`
    : perSide(impl) ? t('{u}/stronę', { u: unitLabel() }) : (ex.loadMode === 'per_dumbbell' ? t('{u}/hantel', { u: unitLabel() })
    : ex.loadMode === 'unilateral' ? t('{u}/strona', { u: unitLabel() }) : unitLabel());
/** Domyślna przerwa dla ćwiczenia: zapamiętana w ćwiczeniu albo globalna. */
export const restFor = (ex: Exercise | undefined, warmup = false): number => {
  const s = getState().settings;
  const def = typeof s.defaultRest === 'number' && s.defaultRest >= 0 ? s.defaultRest : 90;
  if (!ex) return def;
  if (warmup && ex.restWarmupSec != null) return ex.restWarmupSec;
  return ex.restSec ?? def;
};
/** Nazwa koloru gumy w języku interfejsu (kolory z zestawu startowego tłumaczone jak nazwy ćwiczeń z biblioteki) — runda 51: ta sama na ekranie Gumy,
 * w treningu, historii i CSV. */
/* M1-audytor-generalny-040: kolory gum z zestawu startowego to polskie klucze słownika (seedState), tłumaczone na język interfejsu przy wyświetlaniu. Zapisy sprzed zmiany miały
 * nazwę w języku INSTALACJI („red”, „Rot”) — rozpoznajemy ją po słownikach wszystkich języków i pokazujemy w bieżącym. Własne kolory użytkownika (inne napisy) bez zmian. */
export const SEED_BAND_COLORS = ['czerwona', 'czarna', 'fioletowa'] as const;
let seedColorIndex: Map<string, string> | null = null;
/** Klucz koloru z zestawu startowego dla napisu w dowolnym języku; inny napis — bez zmian. */
export function canonicalBandColor(c: string): string {
  if (!seedColorIndex) { seedColorIndex = new Map(); for (const l of LANGS) for (const k of SEED_BAND_COLORS) seedColorIndex.set(fold(tIn(l, k)), k); }
  return seedColorIndex.get(fold(c)) ?? c;
}
export const bandColor = (b: { color: string }) => t(canonicalBandColor(b.color) || '?');
/** Skrót gumy do wąskiej kolumny: pierwsza litera koloru (po tłumaczeniu) + poziom; odporne na pusty kolor. */
/* A11-02: wielka litera wg języka (tr „İ”, el bez tonosu) */
// runda 52: emoji całe
export const shortBand = (b?: { color: string; level: number } | null) => b ? (upper(Array.from(bandColor(b))[0] ?? '?') || '?') + b.level : '—';
/** Pełna nazwa gumy dla VoiceOver (litera z poziomem nic nie mówi). */
export const bandA11y = (b?: { color: string; level: number } | null) => b ? t('{c}, poziom {n}', { c: bandColor(b), n: b.level }) : t('brak');
/** Opis serii („8@+10”, „100×5”). `calc` = ciężar do obliczeń (setLoad) — podpowiedź „Poprzednio” w treningu w toku, bo wpisanie podpowiedzi
 * przenosi tylko pole właściwe dla obecnego sprzętu (audyt 83b, MEDIUM 1b: „8@+42,5” przy pustym ±kg po wpisaniu); domyślnie widok historii
 * (shownLoad — jak ekran sesji i CSV). Jedna reguła w loadOf. */
export function setSummary(ex: Exercise, s: WSet, load: 'shown' | 'calc' = 'shown'): string {
  const b = s.bandId ? bandById(s.bandId) : null; const l = load === 'calc' ? setLoad(ex, s) : shownLoad(ex, s);
  const m = ex.metric ?? 'weight_reps';
  let core: string;
  if (m === 'time') core = fmtSec(Number(s.durationSec) || 0);
  else if (m === 'distance_time') core = `${fmtDist(Number(s.distanceM) || 0)} ${fmtSec(Number(s.durationSec) || 0)}`;
  else if (m === 'weight_time') core = `${fmtW(l, false)}${unitLabel()}×${fmtSec(Number(s.durationSec) || 0)}`;
  else if (m === 'weight_distance')
    core = `${fmtW(l, false)}${unitLabel()}×${fmtDist(Number(s.distanceM) || 0)}`; /* research biblioteki 09.10.2026: noszenie, sanki */
  else if (m === 'reps') core = `${s.reps || 0}`;
  else { core = isBW(ex) ? `${s.reps || 0}${l ? '@' + (l > 0 ? '+' : '') + fmtW(l, false) : ''}` : `${fmtW(l, false)}×${s.reps || 0}`; }
  return core + (b ? ` (${shortBand(b)})` : '') + (s.rpe !== '' && s.rpe != null
      ? (effortScale() === 'rir' ? ` RIR ${effortText(Number(s.rpe))}` : ` @${effortText(Number(s.rpe))}`) : '');
}
/** Wynik serii do porównań „najlepsza seria”: ciężar×1000+pow. / czas / dystans (przy równym dystansie krótszy czas lepszy). */
export function setScore(ex: Exercise, s: WSet): number {
  const m = ex.metric ?? 'weight_reps';
  if (m === 'time') return Number(s.durationSec) || 0;
  if (m === 'distance_time') {
    const d = Number(s.durationSec) || 0;
    return (Number(s.distanceM) || 0) * 1e6 - (d > 0 ? d : 999999);
  } // runda 60: ten sam dystans bez czasu — na końcu
  if (m === 'weight_time') return setLoad(ex, s) * 10000 + (Number(s.durationSec) || 0);
  if (m === 'weight_distance') return setLoad(ex, s) * 1e6 + (Number(s.distanceM) || 0); /* cięższy wygrywa, przy równym — dłuższy dystans */
  if (m === 'reps') return repsOf(s);
  return setLoad(ex, s) * 1000 + repsOf(s);
}
/** Czy seria ma jakikolwiek wpisany wynik (do autouzupełniania i podsumowań). */
export const setHasValue = (s: WSet) => [s.weight, s.reps, s.durationSec, s.distanceM, s.addKg].some(v => v !== '' && v != null);
export function volume(w: Workout): number {
  let v = 0;
  w.exercises.forEach(e => {
    const ex = exById(e.exerciseId);
    if (!ex) return;
    e.sets.forEach(s => {
      v += setVolume(ex, s, e.impl);
    });
  }); /* Q-024: przyrząd bloku */
  return v; // runda 6: bez zaokrąglania w kg — zaokrągla dopiero fmtVol w jednostce wyświetlania (w lb było ±1 lb)
}
/** Ćwiczenie z gumą: asysta (bandAssistable) albo opór gumy (wymaganie sprzętu „bands”) — uwaga właściciela 06.10.2026. */
/* przegląd 06.10: także guma „zalecana” */
export const usesBand = (ex: Exercise | undefined | null): boolean => !!ex
    && (!!ex.bandAssistable || (ex.requires ?? []).some(g => g.includes('bands')) || (ex.recommended ?? []).includes('bands'));
/** Seria liczona w rundzie supersetu: robocza bez drop setu (drop set to część serii, po której jest — runda 72, T6). */
export const isRoundSet = (y: WSet) => y.kind !== 'warmup' && y.kind !== 'drop';
