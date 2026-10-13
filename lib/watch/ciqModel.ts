/*
 * Model stanu zegarka z Connect IQ w TypeScripcie — „wykonywalna specyfikacja” garmin/source/Model.mc (0.20).
 *
 * Po co: kodu Monkey C nie da się uruchomić na Linuksie ani w CI bez SDK Connect IQ (licencja — docs/35-zegarek-garmin.md), a zachowanie zegarka
 * (przejście do przerwy bez łączności, „Cofnij”, odhaczenie na ślepo po dwóch seriach bez odpowiedzi) ma być sprawdzone testami. Ten model robi dokładnie
 * to, co Model.mc; scenariusze z tests/ciq-scenarios.ts są uruchamiane tutaj (Jest), a ich wynik jest zapisywany jako pliki „złote” w
 * garmin/source/tests/Fixtures.mc — testy Monkey C (Run No Evil) odtwarzają te same kroki na zegarku/symulatorze i porównują wynik.
 * Każda zmiana zachowania: najpierw tu i w scenariuszach, potem Model.mc (test ciq-gen pilnuje zgodności plików złotych).
 */
import { CIQ_KEYS, CIQ_KINDS, CIQ_MODES, CIQ_EVENT_TYPES, CIQ_WIRE_VERSION, CIQ_UNDO_WINDOW_SEC, CIQ_OFFLINE_AFTER, CIQ_WATCH_APP_VERSION, type CiqWireMessage } from './ciqWire';

type Dict = Record<string, unknown>;
type SetFields = { setId: string; blockId: string; title: string; counter: string; load: string; group: string; timed: boolean };
const EMPTY_SET: SetFields = { setId: '', blockId: '', title: '', counter: '', load: '', group: '', timed: false };
type Next = { set: SetFields; restSec: number; cue: string };
type Saved = { mode: number; set: SetFields; restEndsAt: number; cue: string; next: Next | null; restEndSent: boolean };

const str = (v: unknown) => (typeof v === 'string' ? v : '');
const num = (v: unknown) => (typeof v === 'number' ? Math.floor(v) : 0);
function readSet(d: Dict): SetFields {
  const K = CIQ_KEYS;
  return { setId: str(d[K.setId]), blockId: str(d[K.blockId]), title: str(d[K.title]), counter: str(d[K.counter]), load: str(d[K.load]), group: str(d[K.group]), timed: num(d[K.timed]) === 1 };
}

export class CiqWatchModel {
  mode: number = CIQ_MODES.idle;
  rev = -1;
  set: SetFields = { ...EMPTY_SET };
  restEndsAt = 0;
  cue = '';
  next: Next | null = null;
  labels: Record<string, string> = {};
  offlineCount = 0;
  needsUpdate = false;
  private seq = 0;
  private lastDoneAt = 0;
  private undoSetId = '';
  private restEndSent = false;
  private prediction: Saved | null = null;
  constructor(readonly runId: string) {}

  private save(): Saved { return { mode: this.mode, set: { ...this.set }, restEndsAt: this.restEndsAt, cue: this.cue, next: this.next, restEndSent: this.restEndSent }; }

  /** Migawka z telefonu. Zwraca true, gdy wiadomość była migawką tej wersji (ekran do odświeżenia). Kolejność dostarczania pilnuje Bluetooth — starszej rev nie odrzucamy
   * (restart telefonu zeruje licznik; odrzucanie zablokowałoby zegarek). */
  applySnapshot(msg: Dict, nowSec: number): boolean {
    const K = CIQ_KEYS;
    if (!msg || msg[K.kind] !== CIQ_KINDS.snapshot) return false;
    if (num(msg[K.version]) > CIQ_WIRE_VERSION) { this.needsUpdate = true; return true; }
    this.needsUpdate = false;
    this.rev = num(msg[K.rev]);
    this.mode = num(msg[K.mode]);
    this.set = this.mode === CIQ_MODES.set || this.mode === CIQ_MODES.rest ? readSet(msg) : { ...EMPTY_SET };
    this.restEndsAt = this.mode === CIQ_MODES.rest ? nowSec + num(msg[K.restLeft]) : 0;
    this.cue = this.mode === CIQ_MODES.rest ? str(msg[K.cue]) : '';
    const af = msg[K.next];
    this.next = af && typeof af === 'object' ? { set: readSet(af as Dict), restSec: num(msg[K.nextRestSec]), cue: str(msg[K.nextCue]) } : null;
    const lb = msg[K.labels];
    if (lb && typeof lb === 'object') this.labels = { ...(lb as Record<string, string>) };
    this.offlineCount = 0; this.prediction = null; this.restEndSent = this.mode !== CIQ_MODES.rest;
    return true;
  }

  private make(type: string, setId: string, nowSec: number, blockId = ''): CiqWireMessage {
    const K = CIQ_KEYS; this.seq += 1;
    const e: CiqWireMessage = { [K.kind]: CIQ_KINDS.event, [K.version]: CIQ_WIRE_VERSION, [K.eventType]: type, [K.eventId]: `${this.runId}-${this.seq}`, [K.baseRev]: Math.max(this.rev, 0), [K.setId]: setId, [K.at]: nowSec, [K.client]: `g${CIQ_WATCH_APP_VERSION}` };
    if (blockId) e[K.blockId] = blockId;
    return e;
  }

  /** Zdarzenie powitalne po uruchomieniu aplikacji na zegarku — telefon odpowiada migawką. */
  hello(nowSec: number): CiqWireMessage { return this.make(CIQ_EVENT_TYPES.hello, '', nowSec); }

  /** Czy odhaczenie pójdzie „na ślepo” (po CIQ_OFFLINE_AFTER odhaczeniach bez odpowiedzi telefonu). */
  isBlind(): boolean { return this.offlineCount >= CIQ_OFFLINE_AFTER; }

  /** Naciśnięcie: odhaczenie według planu, inaczej niż w planie albo pominięcie. null = nic do zrobienia w tym trybie. */
  press(kind: 'done' | 'doneDiff' | 'skip', nowSec: number): CiqWireMessage | null {
    if (this.needsUpdate || (this.mode !== CIQ_MODES.set && this.mode !== CIQ_MODES.rest)) return null;
    if (kind === 'skip') return this.make(CIQ_EVENT_TYPES.skip, this.set.setId, nowSec, this.set.blockId);
    const blind = this.isBlind();
    const sid = blind ? '' : this.set.setId;
    const ev = this.make(kind === 'done' ? CIQ_EVENT_TYPES.done : CIQ_EVENT_TYPES.doneDiff, sid, nowSec, blind ? '' : this.set.blockId);
    this.prediction = this.save(); this.undoSetId = sid; this.lastDoneAt = nowSec; this.offlineCount += 1;
    if (this.next) {
      this.set = { ...this.next.set };
      this.cue = this.next.cue;
      if (this.next.restSec > 0) { this.mode = CIQ_MODES.rest; this.restEndsAt = nowSec + this.next.restSec; this.restEndSent = false; } else { this.mode = CIQ_MODES.set; this.restEndsAt = 0; this.restEndSent = true; }
      this.next = null;
    }
    return ev;
  }

  canUndo(nowSec: number): boolean { return this.lastDoneAt > 0 && this.undoSetId !== '' && nowSec - this.lastDoneAt < CIQ_UNDO_WINDOW_SEC; }

  /** „Cofnij” po przypadkowym odhaczeniu: zdarzenie „undo”; stan lokalny wraca, jeśli telefon jeszcze nie odpowiedział migawką. */
  undo(nowSec: number): CiqWireMessage | null {
    if (!this.canUndo(nowSec)) return null;
    const ev = this.make(CIQ_EVENT_TYPES.undo, this.undoSetId, nowSec);
    if (this.prediction) { const p = this.prediction; this.mode = p.mode; this.set = p.set; this.restEndsAt = p.restEndsAt; this.cue = p.cue; this.next = p.next; this.restEndSent = p.restEndSent; this.prediction = null; }
    this.offlineCount = Math.max(0, this.offlineCount - 1); this.lastDoneAt = 0; this.undoSetId = '';
    return ev;
  }

  restLeft(nowSec: number): number { return this.mode === CIQ_MODES.rest ? Math.max(0, this.restEndsAt - nowSec) : 0; }

  /** Tyknięcie zegara (raz na sekundę). Koniec przerwy: zdarzenie „restEnd” (telefon mówi „koniec przerwy”) i przejście do serii — raz. */
  tick(nowSec: number): CiqWireMessage | null {
    if (this.mode !== CIQ_MODES.rest || this.restEndSent || this.restLeft(nowSec) > 0) return null;
    this.restEndSent = true; this.mode = CIQ_MODES.set; this.restEndsAt = 0;
    return this.make(CIQ_EVENT_TYPES.restEnd, this.set.setId, nowSec);
  }

  /** Widok do porównań w testach (te same pola sprawdza Monkey C). */
  view(nowSec: number) {
    return { mode: this.mode, setId: this.set.setId, title: this.set.title, counter: this.set.counter, load: this.set.load, group: this.set.group, timed: this.set.timed, cue: this.cue,
      restLeft: this.restLeft(nowSec), canUndo: this.canUndo(nowSec), blind: this.isBlind(), needsUpdate: this.needsUpdate, hasNext: this.next !== null };
  }
}
