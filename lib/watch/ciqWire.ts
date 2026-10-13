/*
 * Zegarek z Connect IQ — format wiadomości telefon <-> zegarek (0.20, część „Zegarki”). Czysty TypeScript, bez natywnych zależności.
 *
 * ZASADA (decyzja właściciela 13.10.2026): zegarek tylko WYŚWIETLA i odsyła zdarzenia; cały tekst (ćwiczenie, „seria 2 z 4”, „80 kg × 8”, zapowiedź
 * następnego ćwiczenia) powstaje w telefonie, w języku aplikacji. Ten plik jest JEDNYM źródłem kluczy wiadomości: z niego test
 * tests/ciq-gen.test.ts generuje garmin/source/Wire.mc (stałe po stronie zegarka), garmin/source/tests/Fixtures.mc (pliki „złote” dla testów Monkey C)
 * i garmin/resources*\/strings.xml (stałe etykiety w językach zegarka).
 *
 * Wiadomość to słownik z kluczami jednoliterowymi/dwuliterowymi (mała ramka Bluetooth); wartości tylko tekst i liczby całkowite.
 * Telefon -> zegarek: migawka (k = 's'). Zegarek -> telefon: zdarzenie (k = 'e'). Wszystkie zdarzenia są bezwzględne (nie przełączniki) i mają
 * eventId, więc powtórzenie (ponowna wysyłka po utracie łączności) jest pomijane (idempotencja po stronie telefonu).
 *
 * Dopasowanie do protokołu wspólnego (gałąź f020-protokol, lib/watch/*): ten plik zna tylko własny, wąski widok migawki (CiqSnapshot) — adapter
 * ze wspólnego protokołu do CiqSnapshot to jedna funkcja po stronie telefonu; nazwy typów i pól wspólnego protokołu nie wchodzą na zegarek.
 */
import { LANGS, applyLang, lang, t, APP_NAME, type Lang } from '../i18n';

/** Identyfikator aplikacji Connect IQ (manifest.xml `id` bez kresek). Nie jest tajny — to adres aplikacji na zegarku. */
export const CIQ_APP_ID_HEX = 'f8ba5b0da66642a5bbad734726c31501';
/** To samo w postaci UUID (NSUUID po stronie iOS). */
export const CIQ_APP_UUID = `${CIQ_APP_ID_HEX.slice(0, 8)}-${CIQ_APP_ID_HEX.slice(8, 12)}-${CIQ_APP_ID_HEX.slice(12, 16)}-${CIQ_APP_ID_HEX.slice(16, 20)}-${CIQ_APP_ID_HEX.slice(20)}`;
/** Schemat URL, którym aplikacja pomocnicza zegarka wraca do naszej aplikacji po wyborze urządzeń (Info.plist: plugins/withConnectIq.js), i identyfikator odtwarzania stanu Bluetooth. */
export const CIQ_URL_SCHEME = 'trening-ciq';
export const CIQ_RESTORE_ID = 'trening-ciq';
/** Wersja formatu wiadomości. Zegarek, który dostanie wersję nowszą niż zna, pokazuje „Zaktualizuj aplikację na zegarku”; telefon odrzuca zdarzenia innej wersji. */
export const CIQ_WIRE_VERSION = 1;
/** Wersja aplikacji na zegarku w manifeście (osobna od wersji aplikacji telefonu do czasu decyzji właściciela o wspólnej numeracji). */
export const CIQ_WATCH_APP_VERSION = '0.1.0';
/** Ile sekund po „zrobione” działa „Cofnij” na zegarku (spec: „kilka sekund”, otwarte do potwierdzenia na fēnix 8). */
export const CIQ_UNDO_WINDOW_SEC = 5;
/** Maksymalna kolejka niewysłanych zdarzeń na zegarku (najstarsze są wyrzucane). */
export const CIQ_QUEUE_MAX = 30;
/** Zdarzenia w kolejce starsze niż tyle sekund są porzucane (po powrocie po dniach nie odhaczamy cudzych serii — telefon i tak nie miałby jak ich przypiąć). */
export const CIQ_QUEUE_TTL_SEC = 900;
/** Zapis aktywności „Siła” na zegarku (FIT, spec P6-A): krótszej niż tyle sekund nie zapisujemy (przypadkowe uruchomienie). */
export const CIQ_RECORD_MIN_SEC = 60;
/** Decyzja rejestratora aktywności po zmianie stanu zegarka. */
export const CIQ_RECORDER_ACTIONS = { none: 0, start: 1, save: 2, discard: 3 } as const;
/** Po ilu odhaczeniach bez odpowiedzi telefonu zegarek pokazuje „Brak połączenia z telefonem” (spec rozdz. 2, reguła 4). */
export const CIQ_OFFLINE_AFTER = 2;

/** Modele zegarków w manifeście (identyfikatory produktów Connect IQ). Rodzina fēnix 8 (API 6.0). Lista NIE była sprawdzona kompilatorem (SDK niedostępny w środowisku
 * agenta, licencja): przy błędzie „unknown product” usuń pozycję — docs/35-zegarek-garmin.md, krok sprawdzenia listy urządzeń. Pierwszy model to urządzenie właściciela (AMOLED 47 mm). */
export const CIQ_PRODUCTS = ['fenix847mm', 'fenix843mm', 'fenix851mm', 'fenix8solar47mm', 'fenix8solar51mm', 'fenix8pro47mm'] as const;
/** Minimalny poziom API Connect IQ w manifeście. */
export const CIQ_MIN_API = '5.0.0';

/** Klucze wiadomości. */
export const CIQ_KEYS = {
  kind: 'k', version: 'v', rev: 'r', mode: 'm', setId: 'id', blockId: 'bk', title: 'ti', counter: 'ct', load: 'ld', group: 'gr', timed: 'tm',
  restLeft: 'rs', cue: 'cu', next: 'af', nextRestSec: 'rt', nextCue: 'nc', labels: 'lb',
  eventType: 't', eventId: 'e', baseRev: 'b', at: 'a', client: 'c',
} as const;
/** Rodzaje wiadomości (klucz `k`). */
export const CIQ_KINDS = { snapshot: 's', event: 'e' } as const;
/** Tryby ekranu zegarka w migawce (klucz `m`) — wartości liczbowe są też stałymi Mode w Monkey C. */
export const CIQ_MODES = { idle: 0, set: 1, rest: 2, end: 3 } as const;
/** Zdarzenia zegarek -> telefon (klucz `t`). */
export const CIQ_EVENT_TYPES = { done: 'd', doneDiff: 'x', skip: 's', undo: 'u', restEnd: 'r', hello: 'h' } as const;
export type CiqEventName = keyof typeof CIQ_EVENT_TYPES;

/** Limity długości (znaki), żeby wiadomość mieściła się w jednej ramce i na ekranie. */
export const CIQ_LIMITS = { id: 40, title: 80, counter: 30, load: 40, group: 12, cue: 200, label: 60, client: 24, event: 40 } as const;

/** Stałe etykiety zegarka: id -> tekst źródłowy (polski) przez t(). Funkcja, nie stała — tłumaczenie zależy od bieżącego języka. */
export const CIQ_LABEL_IDS = ['idle', 'offline', 'update', 'finished', 'nothingMore', 'done', 'doneDiff', 'skip', 'skipQuestion', 'undo', 'rest'] as const;
export type CiqLabelId = typeof CIQ_LABEL_IDS[number];
export function ciqLabels(): Record<CiqLabelId, string> {
  return {
    idle: t('Zacznij trening w aplikacji na telefonie'),
    offline: t('Brak połączenia z telefonem'),
    update: t('Zaktualizuj aplikację na zegarku'),
    finished: t('Trening zakończony'),
    nothingMore: t('Nic więcej do zrobienia'),
    done: t('Seria zrobiona'),
    doneDiff: t('Zrobione inaczej niż w planie'),
    skip: t('Pomiń ćwiczenie'),
    skipQuestion: t('Pominąć ćwiczenie?'),
    undo: t('Cofnij'),
    rest: t('Przerwa'),
  };
}

/** Kod języka Connect IQ (ISO 639-2, katalog resources-<kod>) dla języka aplikacji; null = zegarek nie ma takiego kodu (serbski, grecki). */
export const CIQ_LANG: Record<Lang, string | null> = {
  pl: 'pol', en: null /* język bazowy bez kwalifikatora */, cs: 'ces', sk: 'slo', hu: 'hun', ro: 'ron', bg: 'bul', hr: 'hrv', sl: 'slv', sr: null, lt: 'lit', lv: 'lav',
  et: 'est', uk: 'ukr', es: 'spa', 'es-419': null /* ten sam kod co es */, pt: 'por', 'pt-BR': null /* ten sam kod co pt */, de: 'deu', fr: 'fre', it: 'ita', nl: 'dut',
  sv: 'swe', da: 'dan', nb: 'nob', fi: 'fin', tr: 'tur', el: null, id: 'ind', ms: 'zsm', vi: 'vie', ru: 'rus', ja: 'jpn', ko: 'kor', 'zh-Hant': 'zht',
};

/**
 * Rejestrator aktywności „Siła” (garmin/source/Recorder.mc, RecorderLogic.decide): zapis zaczyna się, gdy zegarek ma serię albo przerwę, a kończy się
 * po końcu treningu (tryb end) albo gdy telefon nie ma już treningu (idle) — zapisany, jeśli trwał ≥ CIQ_RECORD_MIN_SEC, inaczej odrzucony.
 * Zgodność z Apple Health: wpis z zegarka nakłada się na sesję zapisaną z telefonu, a aplikacja łączy takie wpisy z sesją (docs/29, reguła z 11.10.2026 A) — nie ma drugiej kopii.
 */
export function ciqRecorderAction(recording: boolean, mode: number, needsUpdate: boolean, elapsedSec: number): number {
  const A = CIQ_RECORDER_ACTIONS;
  if (needsUpdate) return A.none;
  const live = mode === CIQ_MODES.set || mode === CIQ_MODES.rest;
  if (live) return recording ? A.none : A.start;
  if (!recording) return A.none;
  return elapsedSec >= CIQ_RECORD_MIN_SEC ? A.save : A.discard;
}

// ───────────── migawka telefon -> zegarek ─────────────

export type CiqSetView = { setId: string; blockId?: string; title: string; counter: string; load: string; group?: string; timed?: boolean };
/** Co zegarek pokaże po odhaczeniu bieżącej serii, gdy telefon nie odpowie od razu. */
export type CiqNext = { set: CiqSetView; restSec: number; cue: string };
export type CiqSnapshot =
  | { rev: number; mode: 'idle' | 'end' }
  | { rev: number; mode: 'set'; now: CiqSetView; next?: CiqNext }
  | { rev: number; mode: 'rest'; now: CiqSetView; restLeftSec: number; cue: string; next?: CiqNext };
export type CiqWireMessage = Record<string, string | number | Record<string, string | number>>;

/** Przycięcie do n znaków (punktów kodowych), z wielokropkiem. */
export function ciqClip(s: string, n: number): string {
  const a = [...String(s ?? '')];
  return a.length <= n ? a.join('') : a.slice(0, Math.max(0, n - 1)).join('').trimEnd() + '…';
}
const intOr0 = (n: number) => (Number.isFinite(n) && n > 0 ? Math.floor(n) : 0);

function setFields(s: CiqSetView, into: CiqWireMessage) {
  const K = CIQ_KEYS;
  into[K.setId] = ciqClip(s.setId, CIQ_LIMITS.id);
  if (s.blockId) into[K.blockId] = ciqClip(s.blockId, CIQ_LIMITS.id);
  into[K.title] = ciqClip(s.title, CIQ_LIMITS.title);
  into[K.counter] = ciqClip(s.counter, CIQ_LIMITS.counter);
  into[K.load] = ciqClip(s.load, CIQ_LIMITS.load);
  if (s.group) into[K.group] = ciqClip(s.group, CIQ_LIMITS.group);
  if (s.timed) into[K.timed] = 1;
}

/** Migawka -> słownik wysyłany przez Bluetooth. `withLabels`: dołącz stałe etykiety w języku aplikacji (po „hello” i po zmianie języka). */
export function toCiqWire(s: CiqSnapshot, opts: { withLabels?: boolean } = {}): CiqWireMessage {
  const K = CIQ_KEYS;
  const m: CiqWireMessage = { [K.kind]: CIQ_KINDS.snapshot, [K.version]: CIQ_WIRE_VERSION, [K.rev]: intOr0(s.rev), [K.mode]: CIQ_MODES[s.mode] };
  if (s.mode === 'set' || s.mode === 'rest') {
    setFields(s.now, m);
    if (s.mode === 'rest') { m[K.restLeft] = intOr0(s.restLeftSec); m[K.cue] = ciqClip(s.cue, CIQ_LIMITS.cue); }
    if (s.next) {
      const n: CiqWireMessage = {}; setFields(s.next.set, n);
      m[K.next] = n as Record<string, string | number>; m[K.nextRestSec] = intOr0(s.next.restSec); m[K.nextCue] = ciqClip(s.next.cue, CIQ_LIMITS.cue);
    }
  }
  if (opts.withLabels) { const lb: Record<string, string> = {}; for (const [id, v] of Object.entries(ciqLabels())) lb[id] = ciqClip(v, CIQ_LIMITS.label); m[K.labels] = lb; }
  return m;
}

// ───────────── zdarzenia zegarek -> telefon ─────────────

export type CiqEvent = { type: CiqEventName; eventId: string; baseRev: number; setId: string; blockId?: string; at: number; client?: string };
const TYPE_BY_CODE = Object.fromEntries(Object.entries(CIQ_EVENT_TYPES).map(([n, c]) => [c, n])) as Record<string, CiqEventName>;
const isStr = (x: unknown, max: number): x is string => typeof x === 'string' && x.length <= max;
const isInt = (x: unknown): x is number => typeof x === 'number' && Number.isInteger(x);
/** Najwcześniejszy i najpóźniejszy sensowny czas zdarzenia (sekundy epoki): 2020-09-13 … 2096. Odrzuca śmieci, nie pilnuje zegara. */
export const CIQ_AT_RANGE = { min: 1_600_000_000, max: 4_000_000_000 } as const;

/** Wiadomość z zegarka -> zdarzenie albo null (złe pole, zła wersja, obce dane). Wejście jest NIEZAUFANE (Bluetooth). */
export function parseCiqEvent(msg: unknown): CiqEvent | null {
  if (!msg || typeof msg !== 'object' || Array.isArray(msg)) return null;
  const o = msg as Record<string, unknown>; const K = CIQ_KEYS;
  if (o[K.kind] !== CIQ_KINDS.event || o[K.version] !== CIQ_WIRE_VERSION) return null;
  const code = o[K.eventType]; const type = typeof code === 'string' ? TYPE_BY_CODE[code] : undefined;
  if (!type) return null;
  const eventId = o[K.eventId]; const baseRev = o[K.baseRev]; const setId = o[K.setId] ?? ''; const at = o[K.at]; const blockId = o[K.blockId]; const client = o[K.client];
  if (!isStr(eventId, CIQ_LIMITS.event) || eventId.length === 0 || !isInt(baseRev) || baseRev < 0 || !isStr(setId, CIQ_LIMITS.id)) return null;
  if (!isInt(at) || at < CIQ_AT_RANGE.min || at > CIQ_AT_RANGE.max) return null;
  if (blockId !== undefined && !isStr(blockId, CIQ_LIMITS.id)) return null;
  if (client !== undefined && !isStr(client, CIQ_LIMITS.client)) return null;
  if (type === 'skip' && !blockId && !setId) return null; /* pominięcie bez adresu nie ma sensu */
  if (type === 'undo' && !setId) return null; /* cofnięcie dotyczy konkretnej serii */
  return { type, eventId, baseRev, setId, ...(blockId ? { blockId } : {}), at, ...(client ? { client } : {}) };
}

/** Pusty `setId` w zdarzeniu „done”/„doneDiff” = „następna otwarta seria” (zegarek po dwóch odhaczeniach bez łączności odhacza na ślepo). */
export const isBlindEvent = (e: CiqEvent) => (e.type === 'done' || e.type === 'doneDiff') && e.setId === '';

// ───────────── generowanie plików zegarka (używa tests/ciq-gen.test.ts) ─────────────

/** Etykiety we wszystkich językach aplikacji (do strings.xml i testów). Zmienia język na chwilę i przywraca poprzedni. */
export function ciqLabelsAllLangs(): Record<Lang, Record<CiqLabelId, string>> {
  const prev = lang(); const out = {} as Record<Lang, Record<CiqLabelId, string>>;
  for (const l of LANGS) { applyLang(l); out[l] = ciqLabels(); }
  applyLang(prev);
  return out;
}
export const ciqAppName = (l: Lang) => APP_NAME[l];
