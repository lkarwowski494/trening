import { clientStep, clientView, initialClient, type ClientConfig, type ClientInput, type ClientState, type ClientView } from './client';
import type { PhoneToWatch, WatchToPhone } from './protocol';
import type { WatchTransport } from './link';

/*
 * Atrapa zegarka do testów i E2E (wzór EXPO_PUBLIC_STORE_FAKE): transport po stronie telefonu + zegarek zbudowany z modelu referencyjnego (lib/watch/client.ts).
 * Odtwarza zachowanie transportów: gdy zegarek jest poza zasięgiem, migawki zastępują się (zostaje najnowsza — jak updateApplicationContext), a zdarzenia
 * z zegarka czekają w kolejce i dochodzą po kolei po powrocie (jak transferUserInfo). Komunikaty telefon → zegarek (`ack`, `welcome`, `session`) czekają w kolejce.
 */
export class FakeWatch implements WatchTransport {
  /** wszystko, co telefon wysłał (do asercji) */
  sent: PhoneToWatch[] = [];
  /** zdarzenia i komunikaty zegarka wysłane do telefonu (do asercji) */
  fromWatch: WatchToPhone[] = [];
  state: ClientState; online = true;
  private cbs = new Set<(raw: unknown) => void>(); private held: PhoneToWatch[] = []; private outbox: WatchToPhone[] = [];
  constructor(cfg: ClientConfig, public clock: () => number = Date.now) { this.state = initialClient(cfg); }

  /* ----- strona telefonu (WatchTransport) ----- */
  send(msg: PhoneToWatch) {
    this.sent.push(msg);
    if (this.online) { this.input({ t: 'receive', msg }); return; }
    if (msg.kind === 'snapshot') this.held = this.held.filter(m => m.kind !== 'snapshot'); /* kontekst aplikacji: zostaje ostatni */
    this.held.push(msg);
  }
  onMessage(cb: (raw: unknown) => void) { this.cbs.add(cb); return () => { this.cbs.delete(cb); }; }
  reachable() { return this.online; }

  /* ----- strona zegarka ----- */
  input(input: ClientInput) {
    const r = clientStep(this.state, { at: this.clock(), input }); this.state = r.state;
    for (const m of r.out) { this.fromWatch.push(m); if (this.online) this.cbs.forEach(cb => cb(m)); else this.outbox.push(m); }
  }
  view(): ClientView { return clientView(this.state, this.clock()); }
  goOffline() { this.online = false; this.input({ t: 'connection', reachable: false }); }
  /** Powrót zasięgu: najpierw zaległe komunikaty z telefonu (ostatnia migawka), potem zdarzenia z kolejki zegarka w kolejności wysłania. */
  goOnline() {
    this.online = true; const held = this.held; this.held = []; this.input({ t: 'connection', reachable: true });
    for (const m of held) this.input({ t: 'receive', msg: m });
    const q = this.outbox; this.outbox = []; for (const m of q) this.cbs.forEach(cb => cb(m));
  }
}
