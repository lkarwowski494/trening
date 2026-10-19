/*
 * Protokół zegarka (lib/watch/protocol.ts): walidacja wejścia z sieci, kodowanie, stałe, etykiety w 35 językach (docs/35). Zegarek jest nieufnym klientem —
 * telefon odrzuca każdy komunikat niezgodny z protokołem, a pola dodatkowe (zgodność w przód) pomija.
 */
import {
  WATCH, WATCH_PROTOCOL, WATCH_PROTOCOL_MIN, WATCH_CLIENTS, WATCH_PHASES, WATCH_EVENT_TYPES, WATCH_ACK_STATUSES, WATCH_REASONS, WATCH_SESSION_ACTIONS, WATCH_MSG_KINDS,
  parseWatchMessage, decodeWatchMessage, encodeWatchMessage,
} from '@/lib/watch/protocol';
import { WATCH_LABEL_IDS, watchLabels, watchLabelsFor, allWatchLabels } from '@/lib/watch/labels';
import { LANGS, applyLang, lang } from '@/lib/i18n';

const base = { v: 1, kind: 'event', eventId: 'apple-1', workoutId: 'w1', baseRev: 3, at: 1760000000000, client: 'apple' };
const EXTRA: Record<string, object> = { done: { setId: 's1' }, differ: { setId: 's1' }, skip: { blockId: 'b1' }, undo: { setId: 's1' }, restEnded: { setId: 's1' }, sessionStarted: {}, sessionEnded: { saved: true } };

describe('stałe protokołu', () => {
  test('wersja, minimum, rodzaje komunikatów, klienci, fazy, typy zdarzeń, statusy, powody, akcje sesji', () => {
    expect([WATCH_PROTOCOL, WATCH_PROTOCOL_MIN]).toEqual([1, 1]);
    expect([...WATCH_MSG_KINDS]).toEqual(['snapshot', 'ack', 'welcome', 'session', 'hello', 'event']);
    expect([...WATCH_CLIENTS]).toEqual(['apple', 'garmin']); expect([...WATCH_PHASES]).toEqual(['idle', 'set', 'rest', 'done']);
    expect([...WATCH_EVENT_TYPES]).toEqual(['done', 'differ', 'skip', 'undo', 'restEnded', 'sessionStarted', 'sessionEnded']);
    expect([...WATCH_ACK_STATUSES]).toEqual(['applied', 'duplicate', 'ignored', 'rejected']); expect([...WATCH_SESSION_ACTIONS]).toEqual(['start', 'end']);
    expect(new Set(WATCH_REASONS).size).toBe(WATCH_REASONS.length);
  });
  test('liczby protokołu: dodatnie i spójne (okno „Cofnij” 5 s, 2 zdarzenia offline, dziennik 200, zapis do Zdrowia czeka 20 s)', () => {
    for (const [k, v] of Object.entries(WATCH)) expect([k, typeof v === 'number' && v > 0]).toEqual([k, true]);
    expect([WATCH.UNDO_SEC, WATCH.OFFLINE_DONE_MAX, WATCH.EVENT_LOG_MAX, WATCH.HEALTH_WAIT_SEC]).toEqual([5, 2, 200, 20]);
  });
});

describe('parseWatchMessage: zdarzenia', () => {
  test.each([...WATCH_EVENT_TYPES])('poprawne zdarzenie „%s” przechodzi, a wynik ma tylko pola protokołu', type => {
    const r = parseWatchMessage({ ...base, type, ...EXTRA[type], junk: 'x', nested: { a: 1 } });
    expect(r.ok).toBe(true); if (r.ok) { expect(r.msg).toEqual({ ...base, type, ...EXTRA[type] }); expect('junk' in r.msg).toBe(false); }
  });
  test.each([...WATCH_EVENT_TYPES])('zdarzenie „%s”: brak pola wymaganego → odrzucone', type => {
    for (const k of Object.keys(EXTRA[type])) { const bad = { ...base, type, ...EXTRA[type] } as Record<string, unknown>; delete bad[k]; expect(parseWatchMessage(bad).ok).toBe(false); }
    for (const k of ['eventId', 'workoutId', 'baseRev', 'at', 'client', 'type']) { const bad = { ...base, type, ...EXTRA[type] } as Record<string, unknown>; delete bad[k]; expect([k, parseWatchMessage(bad).ok]).toEqual([k, false]); }
  });
  test('złe wartości pól: wersja, rodzaj, klient, typ, puste i za długie id, ujemne i ułamkowe baseRev, at ≤ 0 albo NaN, saved nie-boolean', () => {
    const ok = { ...base, type: 'done', setId: 's1' };
    const bads: Record<string, unknown>[] = [{ v: 2 }, { v: '1' }, { kind: 'x' }, { client: 'pebble' }, { type: 'edit' }, { eventId: '' }, { eventId: 'x'.repeat(WATCH.ID_MAX + 1) }, { workoutId: 5 }, { setId: '' },
      { baseRev: -1 }, { baseRev: 1.5 }, { baseRev: 'a' }, { at: 0 }, { at: -5 }, { at: NaN }, { at: Infinity }, { at: '1' }];
    for (const b of bads) expect([JSON.stringify(b), parseWatchMessage({ ...ok, ...b }).ok]).toEqual([JSON.stringify(b), false]);
    expect(parseWatchMessage({ ...base, type: 'sessionEnded', saved: 'yes' }).ok).toBe(false);
    expect(parseWatchMessage({ ...ok, eventId: 'x'.repeat(WATCH.ID_MAX) }).ok).toBe(true);
  });
  test('nie-obiekty i pusta wartość → odrzucone', () => { for (const x of [null, undefined, 5, 'a', [], true]) expect(parseWatchMessage(x).ok).toBe(false); });
});
describe('parseWatchMessage: hello', () => {
  const hello = { v: 1, kind: 'hello', client: 'garmin', protocol: 1, app: '0.20.0', caps: { session: false } };
  test('poprawne przechodzi; złe pola nie', () => {
    expect(parseWatchMessage(hello)).toEqual({ ok: true, msg: hello });
    for (const b of [{ client: 'x' }, { protocol: 0 }, { protocol: 1.5 }, { app: '' }, { app: 'x'.repeat(33) }, { caps: null }, { caps: {} }, { caps: { session: 1 } }, { v: 0 }])
      expect([JSON.stringify(b), parseWatchMessage({ ...hello, ...b }).ok]).toEqual([JSON.stringify(b), false]);
  });
});
describe('kodowanie', () => {
  test('encode: JSON i rozmiar w bajtach UTF-8 (polskie znaki 2 B, emoji 4 B)', () => {
    const e = encodeWatchMessage({ v: 1, kind: 'welcome', ok: true, protocol: 1, upgrade: null });
    expect(JSON.parse(e.text)).toEqual({ v: 1, kind: 'welcome', ok: true, protocol: 1, upgrade: null }); expect(e.bytes).toBe(e.text.length);
    const pl = encodeWatchMessage({ v: 1, kind: 'ack', eventId: 'ąę', status: 'applied', reason: null, rev: 1 }); expect(pl.bytes).toBe(pl.text.length + 2);
    const em = encodeWatchMessage({ v: 1, kind: 'ack', eventId: '😀', status: 'applied', reason: null, rev: 1 }); expect(em.bytes).toBe(em.text.length + 2); /* 2 jednostki UTF-16 = 4 B */
  });
  test('decode: tekst JSON i obiekt; zepsuty JSON odrzucony', () => {
    const ev = { ...base, type: 'done', setId: 's1' };
    expect(decodeWatchMessage(JSON.stringify(ev))).toEqual(parseWatchMessage(ev)); expect(decodeWatchMessage(ev)).toEqual(parseWatchMessage(ev));
    expect(decodeWatchMessage('{zepsuty')).toEqual({ ok: false, reason: 'json' });
  });
});

describe('etykiety zegarka (35 języków)', () => {
  afterEach(() => applyLang('pl'));
  test('każda etykieta istnieje w każdym języku, niepusta; poza polskim żadna z polskich liter (przeciek) — lt ma ą ę', () => {
    expect(LANGS.length).toBe(35);
    const all = allWatchLabels();
    for (const l of LANGS) for (const id of WATCH_LABEL_IDS) {
      const v = all[l][id]; expect([l, id, typeof v === 'string' && v.trim().length > 0]).toEqual([l, id, true]);
      if (l !== 'pl') expect([l, id, (l === 'lt' ? /[łńśźżŁŃŚŹŻ]/ : /[ąęłńśźżĄĘŁŃŚŹŻ]/).test(v)]).toEqual([l, id, false]);
    }
  });
  test('polski i angielski: dokładne teksty; kolejność identyfikatorów; bieżący język po wywołaniu bez zmian', () => {
    applyLang('en'); expect(watchLabels()).toEqual({ done: 'Set done', differ: 'Done differently', skip: 'Skip', skipAsk: 'Skip this exercise?', cancel: 'Cancel', undo: 'Undo', rest: 'Rest', set: 'Set', pause: 'Workout paused',
      connect: 'Connect to your phone', idle: 'Start a workout on your phone', finished: 'Workout finished', update: 'Update the watch app', nothingLeft: 'nothing more to do' });
    applyLang('de'); expect(watchLabelsFor('pl').done).toBe('Seria zrobiona'); expect(lang()).toBe('de');
  });
  test('polski: dokładne teksty wszystkich etykiet', () => {
    expect(watchLabelsFor('pl')).toEqual({ done: 'Seria zrobiona', differ: 'Zrobione inaczej', skip: 'Pomiń', skipAsk: 'Pominąć ćwiczenie?', cancel: 'Anuluj', undo: 'Cofnij', rest: 'Przerwa', set: 'Seria', pause: 'Trening wstrzymany',
      connect: 'Połącz z telefonem', idle: 'Zacznij trening na telefonie', finished: 'Trening zakończony', update: 'Zaktualizuj aplikację na zegarku', nothingLeft: 'nic więcej do zrobienia' });
  });
  test('etykiety wzorców docs/32: „Seria zrobiona”, „Pomiń”, „Anuluj”, „Cofnij” = teksty telefonu', () => {
    for (const l of LANGS) { const x = watchLabelsFor(l); applyLang(l); const { t } = require('@/lib/i18n'); expect([l, x.done, x.skip, x.cancel, x.undo]).toEqual([l, t('Seria zrobiona'), t('Pomiń'), t('Anuluj'), t('Cofnij')]); }
  });
});
