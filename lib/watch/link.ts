import { getState } from '../store';
import { subscribe as subscribeStore } from '../state/core';
import * as timer from '../timer';
import { reportWatchSession } from '../health';
import { applyWatchEvent } from './apply';
import { buildSnapshot, snapshotKey } from './snapshot';
import {
  WATCH_PROTOCOL, WATCH_PROTOCOL_MIN, decodeWatchMessage, encodeWatchMessage,
  type PhoneToWatch, type WatchAck, type WatchEvent, type WatchHello, type WatchSnapshot,
} from './protocol';

/*
 * Łącze z zegarkiem po stronie telefonu (docs/35 rozdz. 2). Transport (WatchConnectivity, Connect IQ albo atrapa w testach i E2E) jest wstrzykiwany —
 * ten plik jest czystym TypeScriptem i nie zna natywnych modułów. Telefon jest źródłem prawdy: wysyła migawkę przy każdej zmianie treści (z rosnącym `rev`),
 * odpowiada `welcome` na `hello`, potwierdza każde zdarzenie `ack` i prowadzi negocjację sesji treningu zegarka (zapis do Zdrowia).
 */
export interface WatchTransport {
  /** Wysyła komunikat do zegarka (kolejka po stronie transportu; brak połączenia nie jest błędem — migawka jest zawsze najnowsza). */
  send(msg: PhoneToWatch): void;
  /** Rejestruje odbiornik komunikatów z zegarka (surowe obiekty albo JSON). Zwraca funkcję wyrejestrowania. */
  onMessage(cb: (raw: unknown) => void): () => void;
  /** Czy zegarek jest osiągalny w tej chwili. */
  reachable(): boolean;
}

export class WatchLink {
  private rev = 0; private lastKey = ''; private off: (() => void)[] = []; private hello: WatchHello | null = null; private timerId: ReturnType<typeof setTimeout> | null = null;
  /** Śledzony trening: czy sesja zegarka została zamówiona (start) — do wysłania `end` po zakończeniu. */
  private tracked: { id: string; started: boolean; save: boolean } | null = null;
  private sessionAsked: string | null = null;
  /** Kolejka odbioru: zdarzenia z zegarka są stosowane jedno po drugim, w kolejności nadejścia (stosowanie jest asynchroniczne — przerwa, stoper). */
  private chain: Promise<void> = Promise.resolve();
  constructor(private tr: WatchTransport, private nowFn: () => number = Date.now) {}

  start() {
    this.off.push(this.tr.onMessage(raw => { this.chain = this.chain.then(() => this.receive(raw)).catch(() => {}); }), timer.subscribe(() => this.schedule()), subscribeStore(() => this.schedule()));
    this.push();
  }
  /** Czeka, aż zostaną zastosowane wszystkie dotychczas odebrane komunikaty (testy, zamknięcie). */
  settled(): Promise<void> { return this.chain; }
  stop() { this.off.forEach(f => f()); this.off = []; if (this.timerId) clearTimeout(this.timerId); this.timerId = null; }
  /** Zmiany stanu przychodzą seriami (wpisy, tick timera) — jedna migawka na paczkę. */
  private schedule() { if (this.timerId) return; this.timerId = setTimeout(() => { this.timerId = null; this.push(); }, 50); }

  /** Bieżąca migawka (numer `rev` ostatnio wysłanej treści). */
  snapshot(): WatchSnapshot {
    const T = timer.T;
    return buildSnapshot(getState().active, { rev: this.rev, nowMs: this.nowFn(), rest: { on: T.on && !T.alarmed, setId: T.setId, endAt: T.endAt, total: T.total } });
  }
  /** Wysyła migawkę, gdy treść się zmieniła (albo `force`). Zwraca wysłaną migawkę albo null. */
  push(force = false): WatchSnapshot | null {
    this.trackSession();
    const s = this.snapshot(); const key = snapshotKey(s);
    if (!force && key === this.lastKey) return null;
    if (key !== this.lastKey) this.rev++;
    this.lastKey = key; const out = { ...s, rev: this.rev };
    this.tr.send(out); return out;
  }

  /** Odbiór komunikatu z zegarka: `hello` → `welcome` + migawka; zdarzenie → zastosowanie i `ack`. Nieczytelne komunikaty są pomijane. */
  async receive(raw: unknown): Promise<void> {
    const p = decodeWatchMessage(raw); if (!p.ok) return;
    const m = p.msg;
    if (m.kind === 'hello') {
      this.hello = m; const ok = m.protocol >= WATCH_PROTOCOL_MIN && m.protocol <= WATCH_PROTOCOL;
      this.tr.send({ v: WATCH_PROTOCOL, kind: 'welcome', ok, protocol: WATCH_PROTOCOL, upgrade: ok ? null : m.protocol < WATCH_PROTOCOL_MIN ? 'watch' : 'phone' });
      if (ok) { this.sessionAsked = null; /* ponowne hello: zamówienie sesji wraca, dopóki zegarek jej nie zacznie */ this.push(true); }
      return;
    }
    const ack = await this.handleEvent(m);
    /* najpierw migawka, potem potwierdzenie z numerem tej migawki — zegarek zmienia widok jednym ruchem (lib/watch/client.ts: ackRev) */
    this.push(); this.tr.send({ ...ack, rev: this.rev });
  }

  private async handleEvent(ev: WatchEvent): Promise<WatchAck> {
    const w = getState().active;
    if (ev.type === 'sessionEnded' && (!w || w.id !== ev.workoutId)) return this.lateSessionEnded(ev);
    return applyWatchEvent(ev, this.rev);
  }
  /** Raport o zapisie w Zdrowiu po zakończeniu treningu na telefonie (trening czeka w historii z `healthPending`). */
  private lateSessionEnded(ev: Extract<WatchEvent, { type: 'sessionEnded' }>): WatchAck {
    const x = getState().workouts.find(y => y.id === ev.workoutId);
    const ack = (status: WatchAck['status'], reason: WatchAck['reason'] = null): WatchAck => ({ v: WATCH_PROTOCOL, kind: 'ack', eventId: ev.eventId, status, reason, rev: this.rev });
    if (!x) return ack('rejected', 'other-workout');
    if (!x.watch || x.watch.endedAt != null) return ack('duplicate');
    return reportWatchSession(x, ev.at, ev.saved) ? ack('applied') : ack('ignored');
  }

  /**
   * Sesja treningu zegarka (Zdrowie): `start` raz na trening, gdy zegarek zgłosił taką zdolność (`hello.caps.session`); `end` po zakończeniu albo odrzuceniu treningu.
   * `save` = zapis do Zdrowia włączony w Ustawieniach (a trening zapisany, nie odrzucony).
   */
  private trackSession() {
    const st = getState(); const w = st.active; const can = !!this.hello?.caps.session;
    if (w) {
      if (!this.tracked || this.tracked.id !== w.id) this.tracked = { id: w.id, started: false, save: st.settings.healthSync === true };
      this.tracked.save = st.settings.healthSync === true; this.tracked.started = this.tracked.started || !!w.watch?.startedAt;
      if (can && this.sessionAsked !== w.id && !w.watch?.startedAt) { this.sessionAsked = w.id; this.tr.send({ v: WATCH_PROTOCOL, kind: 'session', action: 'start', workoutId: w.id, save: this.tracked.save }); }
      return;
    }
    const t = this.tracked; if (!t) return; this.tracked = null;
    const fin = st.workouts.find(y => y.id === t.id);
    if (t.started || fin?.watch?.startedAt) this.tr.send({ v: WATCH_PROTOCOL, kind: 'session', action: 'end', workoutId: t.id, save: !!fin && t.save });
  }
}

/** Rozmiar zakodowanej migawki (bajty) — test pilnuje budżetu `WATCH.MSG_MAX_BYTES`. */
export const snapshotBytes = (s: WatchSnapshot): number => encodeWatchMessage(s).bytes;

/* ---------- rejestr transportu (moduły natywne rejestrują się same) ---------- */
let current: WatchLink | null = null;
/** Uruchamia łącze z podanym transportem (poprzednie zatrzymuje). Wołają moduły natywne zegarków albo atrapa. */
export function startWatchLink(tr: WatchTransport, nowFn?: () => number): WatchLink { current?.stop(); current = new WatchLink(tr, nowFn); current.start(); return current; }
export function stopWatchLink() { current?.stop(); current = null; }
export const activeWatchLink = () => current;
