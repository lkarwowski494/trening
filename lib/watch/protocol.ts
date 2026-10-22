import type { Lang } from '../i18n';

/*
 * Protokół zegarka (0.20 „Zegarki i głos”; docs/35-zegarki.md): telefon = mózg (stan, teksty, decyzje, głos, zapis), zegarek = wyświetlacz z jednym
 * przyciskiem. Jedna wersjonowana postać komunikatów dla Apple Watch (WatchConnectivity) i zegarków z Connect IQ; oba klienty są cienkie —
 * nie składają zdań, nie liczą reguł, niczego nie edytują (decyzja właściciela 13.10.2026). Czysty TypeScript: model, walidacja i kodowanie
 * sprawdzają testy Jest na Linuksie, a pliki wzorcowe (watch-fixtures/) czytają testy Swift i Monkey C.
 *
 * Kierunki:
 *  telefon → zegarek: `snapshot` (stan do wyświetlenia), `ack` (wynik zdarzenia), `welcome` (odpowiedź na `hello`), `session` (start/koniec sesji treningu zegarka),
 *  zegarek → telefon: `hello` (zgłoszenie klienta), `event` (zdarzenia bezwzględne — nie przełączniki; powtórzenie nie szkodzi).
 */

/** Wersja protokołu. Zmiana niezgodna wstecz podnosi liczbę; `welcome.upgrade` mówi, która strona ma się zaktualizować. */
export const WATCH_PROTOCOL = 1 as const;
/** Najstarsza wersja protokołu, którą telefon jeszcze obsługuje (dziś jedyna). */
export const WATCH_PROTOCOL_MIN = 1;

/** Liczby protokołu w jednym miejscu (CLAUDE.md). Oznaczone [OTWARTE] czekają na decyzję właściciela / test na urządzeniu. */
export const WATCH = {
  /** [OTWARTE] jak długo po „Seria zrobiona” zegarek pokazuje „Cofnij” (spec: np. 5 s). Telefon przyjmuje `undo` do tej granicy plus tolerancja zegarów. */
  UNDO_SEC: 5,
  /** Tolerancja rozjazdu zegarów telefonu i zegarka (ms): `at` zdarzenia względem znaczników na telefonie. */
  CLOCK_TOL_MS: 5000,
  /** Zdarzenie starsze niż tyle ms (kolejka offline) nie jest stosowane — to nie ten trening. */
  MAX_EVENT_AGE_MS: 12 * 3600e3,
  /** Zdarzenie „z przyszłości” (zegar zegarka do przodu) ponad tę granicę jest odrzucane. */
  MAX_FUTURE_MS: 10 * 60e3,
  /** Bez połączenia zegarek sam przechodzi do przerwy po jednym „zrobione” (z pola `after` migawki) i po drugim (przycisk w przerwie) — dalej „Połącz z telefonem”. */
  OFFLINE_DONE_MAX: 2,
  /** Ile ostatnich identyfikatorów zdarzeń trening w toku pamięta (odrzucanie powtórzeń, także po restarcie telefonu). */
  EVENT_LOG_MAX: 200,
  /** Limity długości pól tekstowych migawki (znaki) — mały komunikat także dla zegarków z Connect IQ. */
  CUE_MAX: 200, TITLE_MAX: 60, COUNTER_MAX: 40, LOAD_MAX: 40, ID_MAX: 64,
  /** Budżet rozmiaru jednego komunikatu po zakodowaniu (bajty UTF-8) — założenie projektowe, nie limit Connect IQ [DO SPRAWDZENIA na urządzeniu]. */
  MSG_MAX_BYTES: 2048,
  /** Jak długo telefon czeka po „Zakończ” na raport zegarka o zapisie treningu w Zdrowiu (s), zanim zapisze sam. */
  HEALTH_WAIT_SEC: 20,
  /** Tolerancja końca przerwy (ms): `restEnded` z zegarka przed tym czasem względem końca na telefonie jest ignorowane. */
  REST_END_TOL_MS: 3000,
  /** Ile ostatnich migawek zegarek trzyma, żeby odtworzyć widok po „Cofnij” (model referencyjny: lib/watch/client.ts). */
  CLIENT_HISTORY: 4,
} as const;

export const WATCH_CLIENTS = ['apple', 'garmin'] as const;
export type WatchClient = typeof WATCH_CLIENTS[number];
/** Stan wyświetlany na zegarku. */
export const WATCH_PHASES = ['idle', 'set', 'rest', 'done'] as const;
export type WatchPhase = typeof WATCH_PHASES[number];
/** Zdarzenia z zegarka. `done` = zrobione według planu; `differ` = zrobione inaczej niż w planie (seria „do uzupełnienia” na telefonie); `skip` = pomiń blok
 * (zegarek już zapytał o potwierdzenie); `undo` = cofnij odhaczenie; `restEnded` = skończyło się odliczanie przerwy; `sessionStarted` / `sessionEnded` =
 * sesja treningu zegarka (Apple Zdrowie). */
export const WATCH_EVENT_TYPES = ['done', 'differ', 'skip', 'undo', 'restEnded', 'sessionStarted', 'sessionEnded'] as const;
export type WatchEventType = typeof WATCH_EVENT_TYPES[number];
export const WATCH_ACK_STATUSES = ['applied', 'duplicate', 'ignored', 'rejected'] as const;
export type WatchAckStatus = typeof WATCH_ACK_STATUSES[number];
/** Powody `ignored` / `rejected` w `ack` (zegarek może pokazać krótką wskazówkę, telefon liczy je w dzienniku). */
export const WATCH_REASONS = [
  'no-workout', 'other-workout', 'set-gone', 'block-gone', 'not-done', 'undo-window', 'no-rest', 'rest-not-over', 'stale-time', 'future-time', 'skipped-block',
] as const;
export type WatchReason = typeof WATCH_REASONS[number];
export const WATCH_SESSION_ACTIONS = ['start', 'end'] as const;
export type WatchSessionAction = typeof WATCH_SESSION_ACTIONS[number];
export const WATCH_MSG_KINDS = ['snapshot', 'ack', 'welcome', 'session', 'hello', 'event'] as const;
export type WatchMsgKind = typeof WATCH_MSG_KINDS[number];

/** Bieżąca seria do wyświetlenia (wszystkie teksty już w języku aplikacji). */
export interface WatchNow {
  /** id serii — zegarek odsyła je w zdarzeniach */
  setId: string;
  /** id bloku ćwiczenia — dla `skip` */
  blockId: string;
  /** nazwa ćwiczenia */
  title: string;
  /** „seria 2 z 4” / „rozgrzewka” / „seria 2 z 4 · drop set” */
  counter: string;
  /** „80 kg × 8”, „+10 kg × 8”, „masa ciała × 12”, „45 s” — jak karta „teraz” na telefonie */
  load: string;
  /** etykieta supersetu („SS A”) albo null */
  group: string | null;
  /** seria na czas (stoper na telefonie) */
  timed: boolean;
  /** cel czasu serii (s) albo null */
  targetSec: number | null;
  /** M3 (ZM-05, wz. 24): telefon mierzy teraz tę serię na czas — przycisk główny zegarka to „Zakończ serię”. Pole jest tylko, gdy `true` (starszy klient je pomija). */
  measuring?: boolean;
}
/** Przerwa w toku. `cue` = ten sam tekst co ekran i Live Activity (lib/live.ts restCue.text, jednostka skrótem); głos czyta wariant `speech` z pełną nazwą jednostki. */
export interface WatchRest {
  /** seria, która uruchomiła przerwę */
  setId: string;
  startedAt: number;
  endsAt: number;
  totalSec: number;
  cue: string;
  /** przerwa po ostatniej serii treningu ("nic więcej do zrobienia") */
  last: boolean;
}
/** Co zobaczy zegarek po „Seria zrobiona” na bieżącej serii — liczone z góry, żeby przejść do przerwy bez czekania na telefon (i bez telefonu). */
export interface WatchAfter {
  /** długość przerwy (s); null = brak przerwy (środek rundy supersetu) */
  restSec: number | null;
  /** zapowiedź na przerwę ('' bez przerwy) */
  cue: string;
  last: boolean;
  /** następna seria po odhaczeniu (null = nic więcej) */
  now: WatchNow | null;
}
export interface WatchSnapshot {
  v: typeof WATCH_PROTOCOL;
  kind: 'snapshot';
  /** rośnie przy każdej zmianie treści (nie przy każdym ticku zegara) */
  rev: number;
  lang: Lang;
  phase: WatchPhase;
  paused: boolean;
  workoutId: string | null;
  title: string;
  now: WatchNow | null;
  rest: WatchRest | null;
  after: WatchAfter | null;
  doneCount: number;
  totalCount: number;
  /** serie oznaczone „zrobione inaczej” czekające na uzupełnienie na telefonie */
  toFillCount: number;
}

export interface WatchEventBase { v: typeof WATCH_PROTOCOL; kind: 'event'; eventId: string; workoutId: string; baseRev: number; at: number; client: WatchClient }
export type WatchEvent = WatchEventBase & (
  | { type: 'done'; setId: string }
  | { type: 'differ'; setId: string }
  | { type: 'skip'; blockId: string }
  | { type: 'undo'; setId: string }
  | { type: 'restEnded'; setId: string }
  | { type: 'sessionStarted' }
  | { type: 'sessionEnded'; saved: boolean }
);
export interface WatchHello { v: typeof WATCH_PROTOCOL; kind: 'hello'; client: WatchClient; protocol: number; app: string; caps: { session: boolean } }
export interface WatchWelcome { v: typeof WATCH_PROTOCOL; kind: 'welcome'; ok: boolean; protocol: number; upgrade: 'watch' | 'phone' | null }
export interface WatchAck { v: typeof WATCH_PROTOCOL; kind: 'ack'; eventId: string; status: WatchAckStatus; reason: WatchReason | null; rev: number }
/** Sesja treningu zegarka (Apple Zdrowie, negocjacja „kto zapisuje”): `start` — telefon prosi o sesję (zegarek odpowiada zdarzeniem `sessionStarted`); `end` — trening na telefonie
 * się skończył, zegarek kończy sesję i odpowiada `sessionEnded{saved}`. `save` = telefon ma włączony zapis do Zdrowia, więc zegarek MA zapisać trening w Zdrowiu (bogatsze źródło:
 * tętno, kcal); false = sesja tylko jako środek techniczny (tło, haptyka), bez zapisu. Telefon zapisuje sam tylko wtedy, gdy zegarek nie prowadził sesji albo jej nie zapisał (lib/watch/health.ts). */
export interface WatchSessionCmd { v: typeof WATCH_PROTOCOL; kind: 'session'; action: WatchSessionAction; workoutId: string; save: boolean }

export type PhoneToWatch = WatchSnapshot | WatchAck | WatchWelcome | WatchSessionCmd;
export type WatchToPhone = WatchHello | WatchEvent;
export type WatchMessage = PhoneToWatch | WatchToPhone;

/* ---------- walidacja ---------- */
export type ParseResult<T> = { ok: true; msg: T } | { ok: false; reason: string };
const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);
const str = (x: unknown, max: number): x is string => typeof x === 'string' && x.length > 0 && x.length <= max;
const num = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);
const oneOf = <T extends readonly string[]>(list: T, x: unknown): x is T[number] => typeof x === 'string' && (list as readonly string[]).includes(x);

/**
 * Walidacja komunikatu z zegarka (wejście z sieci — nigdy nie ufamy): wersja, rodzaj, typ, pola wymagane, długości identyfikatorów, liczby skończone.
 * Nieznane dodatkowe pola są pomijane (zgodność w przód — zegarek nowszy o pole nie psuje telefonu); wynik zawiera tylko pola protokołu.
 */
export function parseWatchMessage(raw: unknown): ParseResult<WatchToPhone> {
  if (!isObj(raw)) return { ok: false, reason: 'not-object' };
  if (raw.v !== WATCH_PROTOCOL) return { ok: false, reason: 'version' };
  if (raw.kind === 'hello') {
    if (!oneOf(WATCH_CLIENTS, raw.client)) return { ok: false, reason: 'client' };
    if (!num(raw.protocol) || !Number.isInteger(raw.protocol) || raw.protocol < 1) return { ok: false, reason: 'protocol' };
    if (!str(raw.app, 32)) return { ok: false, reason: 'app' };
    if (!isObj(raw.caps) || typeof raw.caps.session !== 'boolean') return { ok: false, reason: 'caps' };
    return { ok: true, msg: { v: WATCH_PROTOCOL, kind: 'hello', client: raw.client, protocol: raw.protocol, app: raw.app, caps: { session: raw.caps.session } } };
  }
  if (raw.kind !== 'event') return { ok: false, reason: 'kind' };
  if (!str(raw.eventId, WATCH.ID_MAX)) return { ok: false, reason: 'eventId' };
  if (!str(raw.workoutId, WATCH.ID_MAX)) return { ok: false, reason: 'workoutId' };
  if (!num(raw.baseRev) || !Number.isInteger(raw.baseRev) || raw.baseRev < 0) return { ok: false, reason: 'baseRev' };
  if (!num(raw.at) || raw.at <= 0) return { ok: false, reason: 'at' };
  if (!oneOf(WATCH_CLIENTS, raw.client)) return { ok: false, reason: 'client' };
  if (!oneOf(WATCH_EVENT_TYPES, raw.type)) return { ok: false, reason: 'type' };
  const base: WatchEventBase = { v: WATCH_PROTOCOL, kind: 'event', eventId: raw.eventId, workoutId: raw.workoutId, baseRev: raw.baseRev, at: raw.at, client: raw.client };
  switch (raw.type) {
    case 'done': case 'differ': case 'undo': case 'restEnded':
      if (!str(raw.setId, WATCH.ID_MAX)) return { ok: false, reason: 'setId' };
      return { ok: true, msg: { ...base, type: raw.type, setId: raw.setId } };
    case 'skip':
      if (!str(raw.blockId, WATCH.ID_MAX)) return { ok: false, reason: 'blockId' };
      return { ok: true, msg: { ...base, type: 'skip', blockId: raw.blockId } };
    case 'sessionStarted': return { ok: true, msg: { ...base, type: 'sessionStarted' } };
    case 'sessionEnded':
      if (typeof raw.saved !== 'boolean') return { ok: false, reason: 'saved' };
      return { ok: true, msg: { ...base, type: 'sessionEnded', saved: raw.saved } };
  }
}

/** Kodowanie komunikatu do przesłania (JSON, UTF-8). Zwraca też rozmiar — migawka ma mieścić się w budżecie `WATCH.MSG_MAX_BYTES`. */
export function encodeWatchMessage(msg: WatchMessage): { text: string; bytes: number } {
  const text = JSON.stringify(msg);
  let bytes = 0; for (let i = 0; i < text.length; i++) { const c = text.charCodeAt(i); bytes += c < 0x80 ? 1 : c < 0x800 ? 2 : c >= 0xd800 && c <= 0xdbff ? (i++, 4) : 3; }
  return { text, bytes };
}
/** Odczyt komunikatu z zegarka przesłanego jako tekst JSON (albo już jako obiekt — Connect IQ przesyła słowniki). Błąd składni = odrzucenie. */
export function decodeWatchMessage(input: unknown): ParseResult<WatchToPhone> {
  if (typeof input === 'string') { let o: unknown; try { o = JSON.parse(input); } catch { return { ok: false, reason: 'json' }; } return parseWatchMessage(o); }
  return parseWatchMessage(input);
}
