/* Model zegarka z Connect IQ (lib/watch/ciqModel.ts = wykonywalna specyfikacja garmin/source/Model.mc), 0.20.
 * Rodzaje: logika (każda operacja, każdy tryb), scenariusze (skrypty z ciq-scenarios), niezmienniki (losowe sekwencje), regresja (kontrakt zdarzeń z parseCiqEvent).
 * Oczekiwania pisane ręcznie, niezależnie od zapisu „złotego” w tests/ciq-gen.test.ts. */
import { CiqWatchModel } from '@/lib/watch/ciqModel';
import { toCiqWire, parseCiqEvent, CIQ_KEYS, CIQ_MODES, CIQ_UNDO_WINDOW_SEC, CIQ_OFFLINE_AFTER, isBlindEvent, type CiqWireMessage } from '@/lib/watch/ciqWire';
import { SNAPSHOTS, SCRIPTS, T0 } from './ciq-scenarios';
import { runScript } from './ciq-run';

const K = CIQ_KEYS;
const snap = (m: CiqWatchModel, name: string, at = T0) => m.applySnapshot(toCiqWire(SNAPSHOTS[name].snap, { withLabels: !!SNAPSHOTS[name].labels }), at);
const get = (e: CiqWireMessage | null, k: string) => e?.[k];

describe('migawka', () => {
  test.each([
    ['idle', CIQ_MODES.idle, ''], ['end', CIQ_MODES.end, ''], ['set_weight', CIQ_MODES.set, 's2'], ['rest_with_next', CIQ_MODES.rest, 's3'], ['set_timed', CIQ_MODES.set, 't1'],
  ])('%s -> tryb %i, seria %j', (name, mode, sid) => { const m = new CiqWatchModel('w1'); expect(snap(m, name)).toBe(true); expect([m.mode, m.set.setId]).toEqual([mode, sid]); });
  test('pola serii: tytuł, licznik, ciężar, grupa, czas', () => {
    const m = new CiqWatchModel('w1'); snap(m, 'set_superset');
    expect(m.view(T0)).toMatchObject({ title: 'Uginanie ramion ze sztangą', counter: 'seria 1 z 3', load: '30 kg × 10', group: 'A1', timed: false, hasNext: true });
    snap(m, 'set_timed'); expect(m.view(T0)).toMatchObject({ timed: true, group: '', load: '45 s' });
  });
  test('przerwa: czas liczony od odebrania migawki, zapowiedź z telefonu', () => {
    const m = new CiqWatchModel('w1'); snap(m, 'rest_with_next', T0);
    expect(m.restLeft(T0)).toBe(90); expect(m.restLeft(T0 + 30)).toBe(60); expect(m.restLeft(T0 + 500)).toBe(0); expect(m.cue).toMatch(/^Następne:/);
    expect(m.labels.undo).toBe('Cofnij'); expect(Object.keys(m.labels).length).toBe(11);
  });
  test('wiadomość nie będąca migawką jest ignorowana; nowsza wersja => „zaktualizuj”, stan bez zmian, naciśnięcia nic nie robią', () => {
    const m = new CiqWatchModel('w1'); snap(m, 'set_weight');
    expect(m.applySnapshot({ k: 'e' }, T0)).toBe(false); expect(m.applySnapshot(null as never, T0)).toBe(false);
    expect(m.applySnapshot({ ...toCiqWire(SNAPSHOTS.idle.snap), [K.version]: 2 }, T0)).toBe(true);
    expect(m.needsUpdate).toBe(true); expect(m.set.setId).toBe('s2'); expect(m.press('done', T0)).toBeNull();
    snap(m, 'set_weight'); expect(m.needsUpdate).toBe(false); expect(m.press('done', T0)).not.toBeNull();
  });
  test('starsza rev nie jest odrzucana (restart telefonu zeruje licznik)', () => {
    const m = new CiqWatchModel('w1'); snap(m, 'set_last'); expect(m.rev).toBe(8); snap(m, 'set_weight'); expect(m.rev).toBe(5);
  });
  test('brak etykiet w migawce nie kasuje wcześniejszych', () => {
    const m = new CiqWatchModel('w1'); snap(m, 'rest_with_next'); snap(m, 'set_weight'); expect(m.labels.done).toBe('Seria zrobiona');
  });
});

describe('odhaczenie', () => {
  test('„zrobione” w serii: zdarzenie d z setId, blockId, baseRev, czasem i wersją; zegarek od razu w przerwie z zapowiedzią i następną serią', () => {
    const m = new CiqWatchModel('w1'); snap(m, 'set_weight'); const e = m.press('done', T0)!;
    expect(e).toEqual({ k: 'e', v: 1, t: 'd', e: 'w1-1', b: 5, id: 's2', bk: 'b1', a: T0, c: 'g0.1.0' });
    expect(parseCiqEvent(e)).toMatchObject({ type: 'done', setId: 's2', blockId: 'b1' });
    expect(m.view(T0)).toMatchObject({ mode: CIQ_MODES.rest, setId: 's3', counter: 'seria 3 z 4', restLeft: 120, canUndo: true, blind: false, hasNext: false });
    expect(m.cue).toMatch(/seria 3 z 4/);
  });
  test('„zrobione inaczej” ma typ x i taki sam skutek lokalny', () => {
    const m = new CiqWatchModel('w1'); snap(m, 'set_weight'); const e = m.press('doneDiff', T0)!; expect(get(e, K.eventType)).toBe('x'); expect(m.mode).toBe(CIQ_MODES.rest);
  });
  test('przycisk w przerwie odhacza następną serię (P4-A), bez czekania na koniec przerwy', () => {
    const m = new CiqWatchModel('w1'); snap(m, 'rest_with_next'); const e = m.press('done', T0 + 10)!;
    expect(get(e, K.setId)).toBe('s3'); expect(m.view(T0 + 10)).toMatchObject({ mode: CIQ_MODES.rest, setId: 's4', restLeft: 120 });
  });
  test('następna seria bez przerwy (superseria): zegarek zostaje w trybie serii z nową serią', () => {
    const m = new CiqWatchModel('w1'); snap(m, 'set_superset'); m.press('done', T0); expect(m.view(T0)).toMatchObject({ mode: CIQ_MODES.set, setId: 'a2', group: 'A2', restLeft: 0 });
    expect(m.tick(T0 + 1000)).toBeNull(); /* nie było przerwy — nie ma „końca przerwy” */
  });
  test('bez znanej następnej serii zegarek niczego nie zgaduje (czeka na telefon)', () => {
    const m = new CiqWatchModel('w1'); snap(m, 'set_last'); const e = m.press('done', T0)!; expect(e).not.toBeNull(); expect(m.view(T0)).toMatchObject({ mode: CIQ_MODES.set, setId: 's4' });
  });
  test('tryby bez serii: nic się nie wysyła', () => {
    const m = new CiqWatchModel('w1'); for (const n of ['idle', 'end']) { snap(m, n); for (const k of ['done', 'doneDiff', 'skip'] as const) expect(m.press(k, T0)).toBeNull(); }
    expect(m.undo(T0)).toBeNull(); expect(m.tick(T0)).toBeNull();
  });
  test('identyfikatory zdarzeń rosną i są jednoznaczne w obrębie uruchomienia; runId je rozróżnia', () => {
    const a = new CiqWatchModel('wA'); const b = new CiqWatchModel('wB'); snap(a, 'set_weight'); snap(b, 'set_weight');
    const ids = [a.hello(T0), a.press('done', T0)!, a.press('skip', T0)!, b.hello(T0)].map(e => e[K.eventId]); expect(ids).toEqual(['wA-1', 'wA-2', 'wA-3', 'wB-1']);
  });
});

describe('pominięcie', () => {
  test('wysyła skip z setId i blockId, nie zmienia stanu lokalnego (zmienia telefon)', () => {
    const m = new CiqWatchModel('w1'); snap(m, 'set_weight'); const before = m.view(T0); const e = m.press('skip', T0)!;
    expect(e).toMatchObject({ t: 's', id: 's2', bk: 'b1' }); expect(m.view(T0)).toEqual(before); expect(parseCiqEvent(e)).toMatchObject({ type: 'skip', blockId: 'b1' });
  });
});

describe('cofnij', () => {
  test('w oknie: zdarzenie u dla odhaczonej serii, stan wraca; po oknie — nic', () => {
    const m = new CiqWatchModel('w1'); snap(m, 'set_weight'); m.press('done', T0);
    expect(m.canUndo(T0 + CIQ_UNDO_WINDOW_SEC - 1)).toBe(true); expect(m.canUndo(T0 + CIQ_UNDO_WINDOW_SEC)).toBe(false);
    const e = m.undo(T0 + 3)!; expect(e).toMatchObject({ t: 'u', id: 's2' }); expect(parseCiqEvent(e)).toMatchObject({ type: 'undo', setId: 's2' });
    expect(m.view(T0 + 3)).toMatchObject({ mode: CIQ_MODES.set, setId: 's2', counter: 'seria 2 z 4', canUndo: false, hasNext: true, blind: false });
    expect(m.undo(T0 + 3)).toBeNull();
  });
  test('po migawce z telefonu cofnięcie nadal wysyła zdarzenie, ale nie nadpisuje stanu z telefonu', () => {
    const m = new CiqWatchModel('w1'); snap(m, 'set_weight'); m.press('done', T0); snap(m, 'rest_with_next', T0 + 1);
    const e = m.undo(T0 + 2)!; expect(get(e, K.setId)).toBe('s2'); expect(m.view(T0 + 2)).toMatchObject({ mode: CIQ_MODES.rest, setId: 's3' });
  });
  test('okno liczone od ostatniego odhaczenia; nowe odhaczenie otwiera je na nowo', () => {
    const m = new CiqWatchModel('w1'); snap(m, 'set_weight'); m.press('done', T0); m.press('done', T0 + 20); expect(m.canUndo(T0 + 22)).toBe(true); expect(get(m.undo(T0 + 22), K.setId)).toBe('s3');
  });
});

describe('bez łączności', () => {
  test(`po ${CIQ_OFFLINE_AFTER} odhaczeniach bez odpowiedzi telefonu kolejne idą „na ślepo” (setId puste), bez cofnięcia`, () => {
    const m = new CiqWatchModel('w1'); snap(m, 'set_weight');
    const e1 = m.press('done', T0)!, e2 = m.press('done', T0 + 5)!; expect([get(e1, K.setId), get(e2, K.setId)]).toEqual(['s2', 's3']); expect(m.isBlind()).toBe(true);
    const e3 = m.press('done', T0 + 9)!; expect(get(e3, K.setId)).toBe(''); expect(isBlindEvent(parseCiqEvent(e3)!)).toBe(true); expect(get(e3, K.blockId)).toBeUndefined();
    expect(m.canUndo(T0 + 10)).toBe(false); expect(m.undo(T0 + 10)).toBeNull();
  });
  test('migawka z telefonu zeruje licznik ślepych odhaczeń', () => {
    const m = new CiqWatchModel('w1'); snap(m, 'set_weight'); m.press('done', T0); m.press('done', T0 + 1); expect(m.isBlind()).toBe(true); snap(m, 'rest_with_next', T0 + 2); expect(m.isBlind()).toBe(false);
  });
  test('cofnięcie zmniejsza licznik', () => {
    const m = new CiqWatchModel('w1'); snap(m, 'set_weight'); m.press('done', T0); m.undo(T0 + 1); m.press('done', T0 + 2); expect(m.isBlind()).toBe(false);
  });
});

describe('koniec przerwy', () => {
  test('dokładnie raz: zdarzenie r i przejście do serii; wcześniej nic', () => {
    const m = new CiqWatchModel('w1'); snap(m, 'rest_with_next', T0);
    expect(m.tick(T0 + 89)).toBeNull(); const e = m.tick(T0 + 90)!; expect(e).toMatchObject({ t: 'r', id: 's3', a: T0 + 90 }); expect(parseCiqEvent(e)).toMatchObject({ type: 'restEnd' });
    expect(m.mode).toBe(CIQ_MODES.set); expect(m.tick(T0 + 91)).toBeNull();
  });
  test('przerwa od odhaczenia lokalnego też kończy się raz', () => {
    const m = new CiqWatchModel('w1'); snap(m, 'set_weight'); m.press('done', T0); expect(m.tick(T0 + 119)).toBeNull(); expect(m.tick(T0 + 120)).not.toBeNull(); expect(m.tick(T0 + 121)).toBeNull();
  });
  test('cofnięcie w trakcie przerwy lokalnej przywraca serię i nie wyśle końca przerwy', () => {
    const m = new CiqWatchModel('w1'); snap(m, 'set_weight'); m.press('done', T0); m.undo(T0 + 1); expect(m.tick(T0 + 500)).toBeNull();
  });
});

describe('hello', () => {
  test('powitanie: typ h, pusty setId, rev 0 przed pierwszą migawką', () => {
    const m = new CiqWatchModel('w1'); const e = m.hello(T0); expect(e).toMatchObject({ t: 'h', id: '', b: 0 }); expect(parseCiqEvent(e)).toMatchObject({ type: 'hello' });
  });
});

describe('skrypty (kontrakt dla Monkey C)', () => {
  test.each(Object.keys(SCRIPTS))('%s: każde zdarzenie przechodzi parseCiqEvent', name => {
    for (const r of runScript(SCRIPTS[name])) if (r.event) { const p = parseCiqEvent(r.event); expect([name, r.step.op, p === null]).toEqual([name, r.step.op, false]); }
  });
  test('online_basic: pełny obieg — hello, odhaczenie, cofnięcie, odhaczenie, koniec przerwy', () => {
    const r = runScript(SCRIPTS.online_basic); const ev = r.map(x => (x.event ? `${x.event[K.eventType]}:${x.event[K.setId]}` : '-'));
    expect(ev).toEqual(['h:', '-', 'd:s2', 'u:s2', 'd:s2', '-', 'r:s3', '-']);
    expect(r[5].view.restLeft).toBe(1); expect(r[6].view.mode).toBe(CIQ_MODES.set);
  });
  test('undo_window: cofnięcie w 5. sekundzie już nie działa, w 4. tak', () => {
    const r = runScript(SCRIPTS.undo_window); expect(r[2].event).toBeNull(); expect(r[3].event).not.toBeNull();
  });
  test('offline_blind: trzecie odhaczenie na ślepo, cofnięcie odmówione, migawka przywraca zwykłe odhaczanie', () => {
    const r = runScript(SCRIPTS.offline_blind); expect(r[3].event?.[K.setId]).toBe(''); expect(r[4].event).toBeNull(); expect(r[5].view.blind).toBe(false); expect(r[6].event?.[K.setId]).toBe('s3');
  });
  test('newer_version: w czasie niezgodności wersji nic nie jest wysyłane', () => {
    const r = runScript(SCRIPTS.newer_version); expect(r[2].event).toBeNull(); expect(r[2].view.needsUpdate).toBe(true); expect(r[4].event).not.toBeNull();
  });
});

describe('niezmienniki na losowych sekwencjach', () => {
  const rnd = (seed: number) => () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32;
  test('200 sekwencji: identyfikatory zdarzeń unikalne, wszystkie zdarzenia poprawne, restLeft zawsze 0..max, brak wyjątków', () => {
    const names = Object.keys(SNAPSHOTS);
    for (let seed = 1; seed <= 200; seed++) {
      const r = rnd(seed); const m = new CiqWatchModel(`w${seed}`); let t = T0; const seen = new Set<string>();
      for (let i = 0; i < 60; i++) {
        t += Math.floor(r() * 40); const x = r(); let e: CiqWireMessage | null = null;
        if (x < 0.25) snap(m, names[Math.floor(r() * names.length)], t);
        else if (x < 0.55) e = m.press('done', t); else if (x < 0.62) e = m.press('doneDiff', t); else if (x < 0.67) e = m.press('skip', t);
        else if (x < 0.77) e = m.undo(t); else if (x < 0.95) e = m.tick(t); else e = m.hello(t);
        if (e) { expect(parseCiqEvent(e)).not.toBeNull(); const id = String(e[K.eventId]); expect(seen.has(id)).toBe(false); seen.add(id); expect(e[K.at]).toBe(t); }
        const v = m.view(t); expect(v.restLeft).toBeGreaterThanOrEqual(0); expect(v.restLeft).toBeLessThanOrEqual(120);
        if (v.mode === CIQ_MODES.idle || v.mode === CIQ_MODES.end) expect(v.setId).toBe('');
      }
    }
  });
});
