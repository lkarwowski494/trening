/*
 * Prośba o ocenę w App Store — bramka (docs/26; decyzja właściciela 11.10.2026: moment B+A — po N-tym ukończonym treningu, gdy właśnie
 * zakończony trening ma nowy rekord; N = 3 (od 22.10.2026; wcześniej 5); odstęp 14 dni; max 1 na wersję aplikacji; data w polu ustawień).
 *
 * Moduł jest CZYSTY: czas i dane przychodzą jako argumenty (bez Date.now(), bez magazynu, bez `expo-store-review`). Nic w aplikacji go dziś
 * nie woła (wydanie przygotowawcze 0.17; pole w Settings i wywołanie systemowego okna — osobna decyzja o schemacie). System Apple sam
 * ogranicza prośby (3 na 365 dni) i może nie pokazać okna, więc aplikacja nie zakłada „pokazano” (docs/26 pkt 1).
 */

/** Liczby bramki — JEDNO miejsce (CLAUDE.md). */
export const REVIEW = {
  /** Minimalna liczba ukończonych treningów przed pierwszą prośbą (docs/26 pyt. 2; hipoteza bez źródła, decyzja właściciela 11.10.2026: 5; M5 S1 22.10.2026: 3 — przy limicie 5 dni
   * treningowych w miesiącu pierwsza prośba ma paść przed pierwszą blokadą, nie po niej). */
  MIN_WORKOUTS: 3,
  /** Minimalny odstęp od poprzedniej prośby w dniach (HIG: „co najmniej tydzień lub dwa”; decyzja właściciela 11.10.2026: 14). */
  MIN_GAP_DAYS: 14,
} as const;

/**
 * Link „Poproś o funkcję” na podsumowaniu treningu (decyzja właściciela 14.10.2026; docs/34): liczba PRODUKTOWA (nie merytoryczna) — bez źródeł naukowych.
 * Trzymana tu, obok progów prośby o ocenę, bo obie reguły dzielą ekran podsumowania i nie mogą się wzajemnie po cichu wyłączać.
 */
export const IDEA = {
  /** Link pojawia się, gdy od ostatniego pokazania (lub od początku) minęło co najmniej tyle ukończonych treningów. */
  EVERY_N_WORKOUTS: 10,
} as const;

const DAY_MS = 86400e3;

/** Powody odmowy, w kolejności sprawdzania (docs/26 rozdz. 2 „zasady twarde” + próg + odstęp + wersja). */
export const REVIEW_BLOCK_REASONS = [
  'badInput', 'workoutActive', 'blocked', 'ioBusy', 'lastFailed', 'tooFewWorkouts', 'noRecord', 'clockBack', 'sameVersion', 'tooSoon',
] as const;
export type ReviewBlockReason = (typeof REVIEW_BLOCK_REASONS)[number];

/** Poprzednia prośba: kiedy i w której wersji aplikacji (wersja potrzebna do „max 1 na wersję”). */
export interface ReviewAsked { at: number; version: string }

export interface ReviewInput {
  /** Chwila sprawdzenia (ms) — wstrzykiwana. */
  now: number;
  /** Liczba ukończonych treningów (włącznie z właśnie zakończonym). */
  finishedWorkouts: number;
  /** Właśnie zakończony trening ma nowy rekord (kontekst pozytywny, wariant B+A). */
  justFinishedHasRecord: boolean;
  /** Bieżąca wersja aplikacji (np. z lib/version). */
  version: string;
  /** Poprzednia prośba z ustawień; null/brak = jeszcze nie prosiliśmy. */
  lastAsked?: ReviewAsked | null;
  /** Trening w toku, przerwa lub edycja serii — nigdy w trakcie. */
  workoutActive?: boolean;
  /** Blokada/limit subskrypcji albo błąd ekranu (docs/26 zasada 3). */
  blocked?: boolean;
  /** Trwa kopia / import / eksport. */
  ioBusy?: boolean;
  /** Ostatnia operacja zakończyła się błędem (nieudany zapis/import). */
  lastFailed?: boolean;
}

const finite = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);

/** Pierwszy powód odmowy albo 'ask'. Zły lub niepełny argument (NaN, brak wersji) → 'badInput', czyli nie pytamy. */
export function reviewDecision(i: ReviewInput): 'ask' | ReviewBlockReason {
  if (!i || !finite(i.now) || !finite(i.finishedWorkouts) || typeof i.version !== 'string' || !i.version) return 'badInput';
  if (i.workoutActive) return 'workoutActive';
  if (i.blocked) return 'blocked';
  if (i.ioBusy) return 'ioBusy';
  if (i.lastFailed) return 'lastFailed';
  if (i.finishedWorkouts < REVIEW.MIN_WORKOUTS) return 'tooFewWorkouts'; /* obejmuje pierwszy trening i brak treningów */
  if (!i.justFinishedHasRecord) return 'noRecord'; /* brak rekordu → czekamy do następnego treningu */
  const last = i.lastAsked;
  if (last != null) {
    if (!finite(last.at) || typeof last.version !== 'string') return 'badInput';
    if (last.at > i.now) return 'clockBack'; /* zegar cofnięty albo uszkodzona data */
    if (last.version === i.version) return 'sameVersion'; /* max 1 prośba na wersję */
    if (i.now - last.at < REVIEW.MIN_GAP_DAYS * DAY_MS) return 'tooSoon';
  }
  return 'ask';
}

/** Czy poprosić o ocenę teraz (wołać tylko po zakończeniu treningu, nigdy z przycisku — docs/26 rozdz. 2). */
export const shouldAskForReview = (i: ReviewInput): boolean => reviewDecision(i) === 'ask';

/** Normalizacja pola Settings.reviewAsked przy wczytaniu/imporcie (migrate): poprawna para {at, version}; zła wartość albo data z przyszłości → undefined (brak pola). */
export function normalizeReviewAsked(raw: unknown, now: number = Date.now()): ReviewAsked | undefined {
  const r = raw as { at?: unknown; version?: unknown } | null | undefined;
  if (!r || typeof r !== 'object' || !finite(r.at) || r.at < 0 || r.at > now || typeof r.version !== 'string' || !r.version) return undefined;
  return { at: r.at, version: r.version };
}

/** Powody, dla których link „Poproś o funkcję” się nie pokazuje (w kolejności sprawdzania). */
export const IDEA_BLOCK_REASONS = ['badInput', 'tooSoon', 'reviewFirst'] as const;
export type IdeaBlockReason = (typeof IDEA_BLOCK_REASONS)[number];

export interface IdeaInput {
  /** Liczba ukończonych treningów (włącznie z właśnie zakończonym). */
  finishedWorkouts: number;
  /** Liczba ukończonych treningów w chwili ostatniego pokazania linku; brak = jeszcze nie pokazywano. */
  lastShownAt?: number | null;
  /** Wynik bramki prośby o ocenę dla tego samego treningu (reviewDecision). 'ask' = ocena ma pierwszeństwo (Apple ogranicza liczbę próśb). */
  review: 'ask' | ReviewBlockReason;
}

/**
 * Czy pokazać link „Poproś o funkcję” na podsumowaniu świeżo zakończonego treningu. Co N-ty trening (liczone od ostatniego pokazania);
 * gdy w tym samym treningu wypada prośba o ocenę, ona ma pierwszeństwo, a link przy następnym treningu, na którym ocena nie wypada
 * (zaległość nie przepada: licznik liczy od ostatniego POKAZANIA, nie od progu). Nigdy oba na jednym ekranie.
 */
export function ideaDecision(i: IdeaInput): 'show' | IdeaBlockReason {
  if (!i || !finite(i.finishedWorkouts) || i.finishedWorkouts < 0) return 'badInput';
  const last = i.lastShownAt == null ? 0 : (finite(i.lastShownAt) && i.lastShownAt >= 0 ? Math.min(i.lastShownAt, i.finishedWorkouts) : null);
  if (last == null) return 'badInput';
  if (i.finishedWorkouts - last < IDEA.EVERY_N_WORKOUTS) return 'tooSoon'; /* obejmuje też liczbę treningów mniejszą niż zapisana (usunięte treningi) */
  if (i.review === 'ask') return 'reviewFirst';
  return 'show';
}

/** Normalizacja pola Settings.ideaShownAt przy wczytaniu/imporcie: nieujemna liczba całkowita; inna wartość → undefined (brak pola = jeszcze nie pokazywano). */
export function normalizeIdeaShownAt(raw: unknown): number | undefined {
  return typeof raw === 'number' && Number.isInteger(raw) && raw >= 0 ? raw : undefined;
}
