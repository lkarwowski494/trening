/*
 * Łącze telefon <-> zegarek z Connect IQ (0.20): stan urządzeń, wysyłanie migawek (zawsze najnowsza), odbiór zdarzeń z walidacją.
 * Transport natywny jest wstrzykiwany (modules/ciq-link; w testach atrapa), więc cała logika działa w Jest na Linuksie.
 *
 * Zasady:
 * - zdarzenia z zegarka to wejście NIEZAUFANE: każde przechodzi parseCiqEvent, reszta jest odrzucana i liczona (diagnostyka bez treści);
 * - migawki idą pojedynczo; gdy poprzednia jeszcze leci, czeka tylko NAJNOWSZA (stara migawka byłaby nieaktualna, a Bluetooth jest wolny);
 * - wysyłamy tylko do urządzeń połączonych; brak zegarka albo brak modułu = ciche „nie wysłano” (aplikacja działa jak bez zegarka);
 * - powitanie (hello) i zmiana urządzeń => ponowna migawka z etykietami (zegarek mógł zmienić język, zostać zainstalowany od nowa).
 */
import { parseCiqEvent, type CiqEvent, type CiqWireMessage } from './ciqWire';
import type { CiqNative, NativeDevice, NativeSubscription } from '@/modules/ciq-link';

export const CIQ_DEVICE_STATUSES = ['invalid', 'bluetoothOff', 'notFound', 'notConnected', 'connected'] as const;
export type CiqDeviceStatus = typeof CIQ_DEVICE_STATUSES[number];
/** Kod stanu z SDK (IQDeviceStatus 0…4) -> nazwa; nieznany kod = invalid. */
export const ciqStatusName = (n: number): CiqDeviceStatus => CIQ_DEVICE_STATUSES[n] ?? 'invalid';

export type CiqDevice = { id: string; name: string; model: string; status: CiqDeviceStatus };
export type CiqLinkState = { available: boolean; devices: CiqDevice[]; needsCompanion: boolean; rejected: number };
export type CiqSendOutcome = 'sent' | 'no-device' | 'unavailable' | 'failed';

const toDevice = (d: NativeDevice): CiqDevice => ({ id: String(d.id), name: String(d.name ?? ''), model: String(d.model ?? ''), status: ciqStatusName(Number(d.status)) });

export type CiqLink = {
  /** Czy jest moduł natywny (iOS z wbudowanym mostem). */
  available(): boolean;
  state(): CiqLinkState;
  /** Przejście do aplikacji pomocniczej producenta w celu wyboru zegarka. */
  pair(): void;
  forget(): void;
  /** Najnowsza migawka do wszystkich połączonych zegarków; wcześniejsza oczekująca jest zastępowana. */
  send(msg: CiqWireMessage): Promise<CiqSendOutcome>;
  /** Prośba do zegarka o otwarcie aplikacji (zegarek pyta użytkownika). */
  openApp(): Promise<CiqSendOutcome>;
  showCompanionStore(): void;
  onEvent(cb: (e: CiqEvent, deviceId: string) => void): () => void;
  onChange(cb: (s: CiqLinkState) => void): () => void;
  dispose(): void;
};

export function createCiqLink(native: CiqNative | null): CiqLink {
  let devices: CiqDevice[] = native ? safeDevices(native) : [];
  let needsCompanion = false; let rejected = 0;
  const eventCbs = new Set<(e: CiqEvent, id: string) => void>(); const changeCbs = new Set<(s: CiqLinkState) => void>();
  const subs: NativeSubscription[] = [];
  const state = (): CiqLinkState => ({ available: !!native, devices: devices.map(d => ({ ...d })), needsCompanion, rejected });
  const changed = () => { const s = state(); changeCbs.forEach(cb => { try { cb(s); } catch { /* słuchacz nie może zepsuć łącza */ } }); };

  if (native) {
    subs.push(native.addListener('onMessage', ({ id, message }) => {
      const ev = parseCiqEvent(message);
      if (!ev) { rejected += 1; return; }
      eventCbs.forEach(cb => { try { cb(ev, String(id)); } catch { /* j.w. */ } });
    }));
    subs.push(native.addListener('onDeviceStatus', ({ id, status }) => { devices = devices.map(d => (d.id === id ? { ...d, status: ciqStatusName(Number(status)) } : d)); changed(); }));
    subs.push(native.addListener('onDevices', ({ devices: list, needsCompanion: nc }) => { devices = (list ?? []).map(toDevice); needsCompanion = !!nc; changed(); }));
  }

  let inFlight = false; let waiting: { msg: CiqWireMessage; resolve: (o: CiqSendOutcome) => void }[] = [];
  async function pump(): Promise<void> {
    if (inFlight) return;
    inFlight = true;
    try {
      while (waiting.length) {
        const batch = waiting; waiting = []; const last = batch[batch.length - 1];
        batch.slice(0, -1).forEach(w => w.resolve('sent')); /* zastąpione nowszą — dla wywołującego to „obsłużone” */
        const out = await deliver(last.msg); last.resolve(out);
      }
    } finally { inFlight = false; }
  }
  async function deliver(msg: CiqWireMessage): Promise<CiqSendOutcome> {
    if (!native) return 'unavailable';
    const live = devices.filter(d => d.status === 'connected');
    if (!live.length) return 'no-device';
    const res = await Promise.all(live.map(d => native.send(d.id, msg as Record<string, unknown>).then(r => r.ok, () => false)));
    return res.some(Boolean) ? 'sent' : 'failed';
  }

  return {
    available: () => !!native,
    state,
    pair: () => { if (native) native.pair(); },
    forget: () => { if (native) { native.forget(); devices = []; changed(); } },
    send: msg => new Promise<CiqSendOutcome>(resolve => { waiting.push({ msg, resolve }); void pump(); }),
    openApp: async () => {
      if (!native) return 'unavailable';
      const live = devices.filter(d => d.status === 'connected'); if (!live.length) return 'no-device';
      const r = await Promise.all(live.map(d => native.openApp(d.id).then(x => x.ok, () => false)));
      return r.some(Boolean) ? 'sent' : 'failed';
    },
    showCompanionStore: () => { if (native) native.showCompanionStore(); },
    onEvent: cb => { eventCbs.add(cb); return () => { eventCbs.delete(cb); }; },
    onChange: cb => { changeCbs.add(cb); return () => { changeCbs.delete(cb); }; },
    dispose: () => { subs.forEach(s => s.remove()); subs.length = 0; eventCbs.clear(); changeCbs.clear(); },
  };
}

function safeDevices(native: CiqNative): CiqDevice[] { try { return native.devices().map(toDevice); } catch { return []; } }
