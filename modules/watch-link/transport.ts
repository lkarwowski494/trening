/**
 * Transport telefon <-> zegarek (0.20 „Zegarki i głos”, docs/36). Wspólny kształt dla WatchConnectivity (Apple Watch), Connect IQ (drugi zegarek) i atrapy
 * (testy, E2E). Treści komunikatów są dla transportu NIEPRZEZROCZYSTYMI ciągami JSON — ich kształt ustala protokół (lib/watch/protocol.ts, docs/35), nie ten moduł.
 * Warstwa protokołu (lib/watch/link.ts) dostaje transport przez adapter `toLinkTransport` i nie wie, co jest pod spodem.
 */
export type WatchLinkStatus = { supported: boolean; activated: boolean; paired: boolean; installed: boolean; reachable: boolean };
export const NO_WATCH: WatchLinkStatus = { supported: false, activated: false, paired: false, installed: false, reachable: false };

export interface WatchTransport {
  status(): WatchLinkStatus;
  /** Wysyła komunikat (JSON) na zegarek; false = nie wysłano (brak zegarka/aplikacji/aktywacji). Migawka jest stanem — kolejna niesie pełną treść. */
  send(json: string): Promise<boolean>;
  /** Prosi system o uruchomienie aplikacji na zegarku (sesja treningu). Zegarek startuje sesję też po poleceniu `session start`. */
  startWatchApp(): Promise<boolean>;
  /** Komunikaty z zegarka zapisane w trwałej kolejce od ostatniego wywołania (kolejka jest czyszczona). */
  takeMessages(): string[];
  /** Powiadomienia o nowych komunikatach (bez treści — treść pobiera takeMessages) i o zmianie statusu; zwraca funkcję odpinającą. */
  subscribe(onMessages: () => void, onStatus?: (s: WatchLinkStatus) => void): () => void;
}

type Sub = { remove(): void };
export type NativeWatchLink = {
  isSupported(): boolean;
  getStatus(): Partial<WatchLinkStatus>;
  send(json: string): Promise<boolean>;
  startWatchApp(): Promise<boolean>;
  takeMessages(): string[];
  addListener(name: 'onMessages' | 'onStatus', cb: (payload?: Partial<WatchLinkStatus>) => void): Sub;
};

const bool = (v: unknown) => v === true;
const toStatus = (s: Partial<WatchLinkStatus> | null | undefined): WatchLinkStatus =>
  s ? { supported: bool(s.supported), activated: bool(s.activated), paired: bool(s.paired), installed: bool(s.installed), reachable: bool(s.reachable) } : NO_WATCH;

/** Transport na module natywnym WatchLink; bez modułu (Expo Go, Android, testy) — transport „bez zegarka”, wszystko no-op. */
export function createNativeTransport(native: NativeWatchLink | null): WatchTransport {
  const safe = <T,>(f: () => T, fallback: T): T => { try { return f(); } catch { return fallback; } };
  return {
    status: () => (native ? safe(() => toStatus(native.getStatus()), NO_WATCH) : NO_WATCH),
    send: async json => (native ? safe(() => native.send(json), Promise.resolve(false)).catch(() => false) : false),
    startWatchApp: async () => (native ? safe(() => native.startWatchApp(), Promise.resolve(false)).catch(() => false) : false),
    takeMessages: () => (native ? safe(() => native.takeMessages().filter(e => typeof e === 'string' && e.length > 0), []) : []),
    subscribe: (onMessages, onStatus) => {
      if (!native) return () => {};
      const subs: Sub[] = [native.addListener('onMessages', () => { try { onMessages(); } catch { /* błąd odbiorcy nie zrywa kanału */ } })];
      if (onStatus) subs.push(native.addListener('onStatus', p => { try { onStatus(toStatus(p ?? safe(() => native.getStatus(), NO_WATCH))); } catch { /* jak wyżej */ } }));
      return () => subs.forEach(s => s.remove());
    },
  };
}

/**
 * Odbiera komunikaty z zegarka: pobiera kolejkę przy starcie (komunikaty z czasu, gdy JS nie działał) i po każdym powiadomieniu.
 * Błąd obsługi jednego komunikatu nie gubi pozostałych. Zwraca funkcję odpinającą.
 */
export function attachWatchMessages(t: WatchTransport, handle: (json: string) => void, onStatus?: (s: WatchLinkStatus) => void): () => void {
  const drain = () => { for (const m of t.takeMessages()) { try { handle(m); } catch { /* komunikat odrzucony; reszta idzie dalej */ } } };
  const off = t.subscribe(drain, onStatus);
  drain();
  return off;
}

/** Kształt transportu, którego oczekuje warstwa protokołu (WatchTransport w lib/watch/link.ts, gałąź f020-protokol). */
export interface LinkTransport {
  send(msg: object): void;
  onMessage(cb: (raw: unknown) => void): () => void;
  reachable(): boolean;
}

/**
 * Adapter transportu natywnego do łącza protokołu: `send` serializuje komunikat do JSON (błąd wysyłki nie jest wyjątkiem — migawka jest zawsze najnowsza,
 * zdarzenia ma kolejka zegarka), `onMessage` podaje surowe ciągi JSON (decodeWatchMessage przyjmuje tekst), `reachable` z bieżącego statusu.
 * Polecenie `session start` budzi dodatkowo aplikację na zegarku (HKHealthStore.startWatchApp) — bez tego sesja treningu ruszyłaby dopiero po
 * ręcznym otwarciu aplikacji zegarka.
 */
export function toLinkTransport(t: WatchTransport): LinkTransport {
  return {
    send: msg => {
      let json: string; try { json = JSON.stringify(msg); } catch { return; }
      void t.send(json).catch(() => false);
      const m = msg as { kind?: unknown; action?: unknown };
      if (m.kind === 'session' && m.action === 'start') void t.startWatchApp().catch(() => false);
    },
    onMessage: cb => attachWatchMessages(t, raw => cb(raw)),
    reachable: () => t.status().reachable,
  };
}

/** Atrapa transportu natywnego: testy logiki telefonu i scenariusze E2E z fałszywym transportem (wzór EXPO_PUBLIC_STORE_FAKE). */
export type FakeWatchLink = WatchTransport & {
  /** Komunikaty wysłane na zegarek, w kolejności (JSON). */
  readonly sent: string[];
  readonly started: number;
  /** Komunikat z zegarka (jak odebrany przez moduł natywny): trafia do kolejki i budzi subskrybentów. */
  emit(json: string): void;
  setStatus(s: Partial<WatchLinkStatus>): void;
  /** Następne wysłanie się nie powiedzie (zegarek poza zasięgiem). */
  failNextSend(): void;
};

export function createFakeWatchLink(initial: Partial<WatchLinkStatus> = { supported: true, activated: true, paired: true, installed: true, reachable: true }): FakeWatchLink {
  let st = toStatus(initial); let fail = false; let started = 0;
  const queue: string[] = []; const sent: string[] = [];
  const evs = new Set<() => void>(); const sts = new Set<(s: WatchLinkStatus) => void>();
  return {
    sent, get started() { return started; },
    status: () => st,
    send: async json => { if (fail || !st.activated || !st.paired || !st.installed) { fail = false; return false; } sent.push(json); return true; },
    startWatchApp: async () => { if (!st.paired || !st.installed) return false; started++; return true; },
    takeMessages: () => queue.splice(0, queue.length),
    subscribe: (onMessages, onStatus) => { evs.add(onMessages); if (onStatus) sts.add(onStatus); return () => { evs.delete(onMessages); if (onStatus) sts.delete(onStatus); }; },
    emit: json => { queue.push(json); [...evs].forEach(f => f()); },
    setStatus: s => { st = toStatus({ ...st, ...s }); [...sts].forEach(f => f(st)); },
    failNextSend: () => { fail = true; },
  };
}
