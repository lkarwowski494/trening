/* Zegarek z Connect IQ — format wiadomości (lib/watch/ciqWire.ts, 0.20): klucze, migawki, zdarzenia, etykiety w 35 językach, mapa języków zegarka.
 * Rodzaje testów (docs/20): logika (clip, toCiqWire, parseCiqEvent), macierz (każdy rodzaj zdarzenia × każde złe pole), dane (limity, rozmiar ramki),
 * języki (etykiety × LANGS), niezmienniki (wszystkie scenariusze mieszczą się w ramce, nic poza dozwolonymi kluczami). */
import {
  CIQ_APP_ID_HEX, CIQ_APP_UUID, CIQ_WIRE_VERSION, CIQ_UNDO_WINDOW_SEC, CIQ_QUEUE_MAX, CIQ_OFFLINE_AFTER, CIQ_KEYS, CIQ_KINDS, CIQ_MODES, CIQ_EVENT_TYPES, CIQ_LIMITS,
  CIQ_LABEL_IDS, CIQ_LANG, CIQ_PRODUCTS, CIQ_MIN_API, CIQ_AT_RANGE, CIQ_RECORD_MIN_SEC, CIQ_RECORDER_ACTIONS, ciqRecorderAction, ciqLabels, ciqLabelsAllLangs, ciqAppName, ciqClip, toCiqWire, parseCiqEvent, isBlindEvent, type CiqEventName,
} from '@/lib/watch/ciqWire';
import { LANGS, applyLang, lang } from '@/lib/i18n';
import { SNAPSHOTS, T0 } from './ciq-scenarios';

const ev = (over: Record<string, unknown> = {}) => ({ k: 'e', v: 1, t: 'd', e: 'w1-1', b: 5, id: 's2', a: T0, c: 'g0.1.0', ...over });

describe('stałe i klucze', () => {
  test('klucze wiadomości są niepowtarzalne i krótkie; wersja 1; okno cofnięcia, kolejka i próg „bez łączności” z jednego miejsca', () => {
    const vals = Object.values(CIQ_KEYS); expect(new Set(vals).size).toBe(vals.length); for (const v of vals) expect(v.length).toBeLessThanOrEqual(2);
    expect([CIQ_WIRE_VERSION, CIQ_UNDO_WINDOW_SEC, CIQ_QUEUE_MAX, CIQ_OFFLINE_AFTER]).toEqual([1, 5, 30, 2]);
    expect(CIQ_KINDS).toEqual({ snapshot: 's', event: 'e' });
    expect(CIQ_MODES).toEqual({ idle: 0, set: 1, rest: 2, end: 3 });
    expect(Object.values(CIQ_EVENT_TYPES).sort()).toEqual(['d', 'h', 'r', 's', 'u', 'x']);
  });
  test('identyfikator aplikacji: 32 znaki hex i UUID z kreskami (NSUUID)', () => {
    expect(CIQ_APP_ID_HEX).toMatch(/^[0-9a-f]{32}$/); expect(CIQ_APP_UUID).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    expect(CIQ_APP_UUID.replace(/-/g, '')).toBe(CIQ_APP_ID_HEX);
  });
  test('modele zegarków: rodzina fēnix 8, bez powtórzeń, pierwszy to AMOLED 47 mm właściciela; minimalne API', () => {
    expect(CIQ_PRODUCTS[0]).toBe('fenix847mm'); expect(new Set(CIQ_PRODUCTS).size).toBe(CIQ_PRODUCTS.length);
    for (const p of CIQ_PRODUCTS) expect(p).toMatch(/^fenix8[a-z0-9]*$/);
    expect(CIQ_MIN_API).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

describe('ciqClip', () => {
  test.each([
    ['', 5, ''], ['abc', 5, 'abc'], ['abcde', 5, 'abcde'], ['abcdef', 5, 'abcd…'], ['ab cdef', 5, 'ab c…'], ['ab  def', 4, 'ab…' /* spacja przed wielokropkiem znika */],
    ['ąęłńó', 3, 'ąę…'], ['日本語のテキスト', 4, '日本語…'], ['😀😀😀😀', 3, '😀😀…'],
  ])('%j do %i znaków → %j', (s, n, want) => { expect(ciqClip(s, n)).toBe(want); });
  test('wejście spoza tekstu nie wywala (null/undefined) i n = 0', () => {
    expect(ciqClip(undefined as unknown as string, 5)).toBe(''); expect(ciqClip(null as unknown as string, 5)).toBe(''); expect(ciqClip('abc', 0)).toBe('…');
  });
});

describe('toCiqWire: migawka -> słownik', () => {
  const ALLOWED = new Set<string>(Object.values(CIQ_KEYS));
  test.each(Object.keys(SNAPSHOTS))('%s: tylko dozwolone klucze, wartości tekst/liczba/słownik, ramka < 1 KB, wersja, tryb', name => {
    const { snap, labels } = SNAPSHOTS[name]; const m = toCiqWire(snap, { withLabels: !!labels });
    for (const [k, v] of Object.entries(m)) { expect(ALLOWED.has(k)).toBe(true); expect(['string', 'number', 'object']).toContain(typeof v); }
    expect(m[CIQ_KEYS.kind]).toBe('s'); expect(m[CIQ_KEYS.version]).toBe(CIQ_WIRE_VERSION); expect(m[CIQ_KEYS.mode]).toBe(CIQ_MODES[snap.mode]);
    expect(Buffer.byteLength(JSON.stringify(m), 'utf8')).toBeLessThan(1024 + (labels ? 700 : 0));
  });
  test('tryby bez serii (idle, end) nie niosą pól serii; set bez next nie niesie af/rt/nc', () => {
    const idle = toCiqWire({ rev: 1, mode: 'idle' }); expect(Object.keys(idle).sort()).toEqual(['k', 'm', 'r', 'v']);
    const set = toCiqWire(SNAPSHOTS.set_last.snap); expect(set).not.toHaveProperty(CIQ_KEYS.next); expect(set).not.toHaveProperty(CIQ_KEYS.restLeft);
  });
  test('przerwa niesie rs i cu; seria na czas niesie tm = 1; superseria niesie gr; masa ciała i guma to zwykły tekst', () => {
    const r = toCiqWire(SNAPSHOTS.rest_with_next.snap); expect(r[CIQ_KEYS.restLeft]).toBe(90); expect(String(r[CIQ_KEYS.cue])).toMatch(/^Następne:/);
    expect(toCiqWire(SNAPSHOTS.set_timed.snap)[CIQ_KEYS.timed]).toBe(1); expect(toCiqWire(SNAPSHOTS.set_weight.snap)).not.toHaveProperty(CIQ_KEYS.timed);
    expect(toCiqWire(SNAPSHOTS.set_superset.snap)[CIQ_KEYS.group]).toBe('A1');
    expect(toCiqWire(SNAPSHOTS.set_bodyweight.snap)[CIQ_KEYS.load]).toBe('+10 kg × 6'); expect(toCiqWire(SNAPSHOTS.set_band.snap)[CIQ_KEYS.load]).toBe('guma czerwona × 15');
  });
  test('next: zagnieżdżony słownik z polami serii + rt i nc na wierzchu', () => {
    const m = toCiqWire(SNAPSHOTS.set_weight.snap); const af = m[CIQ_KEYS.next] as Record<string, unknown>;
    expect(af[CIQ_KEYS.setId]).toBe('s3'); expect(af[CIQ_KEYS.counter]).toBe('seria 3 z 4'); expect(m[CIQ_KEYS.nextRestSec]).toBe(120); expect(String(m[CIQ_KEYS.nextCue]).length).toBeGreaterThan(10);
  });
  test('przycinanie: długi tytuł, zapowiedź i identyfikator mieszczą się w limitach', () => {
    const m = toCiqWire({ rev: 1, mode: 'rest', now: { setId: 'x'.repeat(100), title: 'T'.repeat(200), counter: 'c'.repeat(100), load: 'l'.repeat(100), group: 'G'.repeat(50) }, restLeftSec: 10, cue: 'c'.repeat(500) });
    expect([...String(m[CIQ_KEYS.title])].length).toBe(CIQ_LIMITS.title); expect([...String(m[CIQ_KEYS.cue])].length).toBe(CIQ_LIMITS.cue); expect([...String(m[CIQ_KEYS.setId])].length).toBe(CIQ_LIMITS.id);
    expect([...String(m[CIQ_KEYS.counter])].length).toBe(CIQ_LIMITS.counter); expect([...String(m[CIQ_KEYS.load])].length).toBe(CIQ_LIMITS.load); expect([...String(m[CIQ_KEYS.group])].length).toBe(CIQ_LIMITS.group);
  });
  test('liczby: ujemne, ułamkowe i NaN stają się nieujemnymi całkowitymi', () => {
    const m = toCiqWire({ rev: -3, mode: 'rest', now: { setId: 's', title: 't', counter: 'c', load: 'l' }, restLeftSec: 12.9, cue: '' });
    expect([m[CIQ_KEYS.rev], m[CIQ_KEYS.restLeft]]).toEqual([0, 12]);
    expect(toCiqWire({ rev: NaN, mode: 'rest', now: { setId: 's', title: 't', counter: 'c', load: 'l' }, restLeftSec: Infinity, cue: '' })[CIQ_KEYS.restLeft]).toBe(0);
  });
  test('etykiety tylko na żądanie; w języku aplikacji', () => {
    applyLang('en'); const m = toCiqWire({ rev: 1, mode: 'idle' }, { withLabels: true }); applyLang('pl');
    const lb = m[CIQ_KEYS.labels] as Record<string, string>; expect(Object.keys(lb).sort()).toEqual([...CIQ_LABEL_IDS].sort()); expect(lb.idle).toBe('Start a workout in the app on your phone');
    expect(toCiqWire({ rev: 1, mode: 'idle' })).not.toHaveProperty(CIQ_KEYS.labels);
  });
});

describe('parseCiqEvent: zdarzenie z zegarka (wejście niezaufane)', () => {
  test.each(Object.entries(CIQ_EVENT_TYPES) as [CiqEventName, string][])('poprawne zdarzenie %s', (name, code) => {
    const base = ev({ t: code, ...(name === 'hello' || name === 'restEnd' ? { id: name === 'hello' ? '' : 's2' } : {}) });
    const p = parseCiqEvent(base); expect(p).toEqual({ type: name, eventId: 'w1-1', baseRev: 5, setId: base.id, at: T0, client: 'g0.1.0' });
  });
  test('pominięcie z blockId i bez setId jest poprawne; bez adresu — nie', () => {
    expect(parseCiqEvent(ev({ t: 's', id: '', bk: 'b1' }))).toMatchObject({ type: 'skip', blockId: 'b1', setId: '' }); expect(parseCiqEvent(ev({ t: 's', id: '' }))).toBeNull();
  });
  test('cofnięcie wymaga setId; odhaczenie bez setId to „na ślepo”', () => {
    expect(parseCiqEvent(ev({ t: 'u', id: '' }))).toBeNull(); const blind = parseCiqEvent(ev({ id: '' }))!; expect(isBlindEvent(blind)).toBe(true); expect(isBlindEvent(parseCiqEvent(ev())!)).toBe(false);
    expect(isBlindEvent(parseCiqEvent(ev({ t: 'x', id: '' }))!)).toBe(true); expect(isBlindEvent(parseCiqEvent(ev({ t: 'h', id: '' }))!)).toBe(false);
  });
  test.each([
    ['null', null], ['liczba', 5], ['tekst', 'd'], ['tablica', [1]], ['pusty słownik', {}],
    ['zły rodzaj', ev({ k: 's' })], ['zła wersja 2', ev({ v: 2 })], ['wersja jako tekst', ev({ v: '1' })], ['nieznany typ', ev({ t: 'z' })], ['typ liczbą', ev({ t: 1 })],
    ['brak eventId', ev({ e: undefined })], ['pusty eventId', ev({ e: '' })], ['za długi eventId', ev({ e: 'x'.repeat(41) })], ['eventId liczbą', ev({ e: 7 })],
    ['baseRev ujemny', ev({ b: -1 })], ['baseRev ułamkowy', ev({ b: 1.5 })], ['baseRev tekstem', ev({ b: '5' })], ['brak baseRev', ev({ b: undefined })],
    ['setId za długi', ev({ id: 's'.repeat(41) })], ['setId liczbą', ev({ id: 3 })], ['at za wczesne', ev({ a: CIQ_AT_RANGE.min - 1 })], ['at za późne', ev({ a: CIQ_AT_RANGE.max + 1 })],
    ['at ułamkowe', ev({ a: T0 + 0.5 })], ['at tekstem', ev({ a: String(T0) })], ['brak at', ev({ a: undefined })], ['blockId liczbą', ev({ bk: 1 })], ['client za długi', ev({ c: 'c'.repeat(25) })],
  ])('odrzucone: %s', (_n, msg) => { expect(parseCiqEvent(msg)).toBeNull(); });
  test('granice: eventId 40 znaków, at na krańcach zakresu i brak client są poprawne', () => {
    expect(parseCiqEvent(ev({ e: 'x'.repeat(40) }))).not.toBeNull(); expect(parseCiqEvent(ev({ a: CIQ_AT_RANGE.min }))).not.toBeNull(); expect(parseCiqEvent(ev({ a: CIQ_AT_RANGE.max }))).not.toBeNull();
    expect(parseCiqEvent(ev({ c: undefined }))).not.toHaveProperty('client'); expect(parseCiqEvent(ev({ b: 0 }))).toMatchObject({ baseRev: 0 });
  });
  test('dodatkowe nieznane pola są ignorowane (zgodność w przód), a wynik ich nie niesie', () => {
    expect(parseCiqEvent(ev({ zz: 'x', yy: 1 }))).toEqual({ type: 'done', eventId: 'w1-1', baseRev: 5, setId: 's2', at: T0, client: 'g0.1.0' });
  });
});

describe('etykiety zegarka w 35 językach i mapa języków Connect IQ', () => {
  test('polskie teksty źródłowe etykiet (to one są kluczami słownika t())', () => {
    applyLang('pl');
    expect(ciqLabels()).toEqual({
      idle: 'Zacznij trening w aplikacji na telefonie', offline: 'Brak połączenia z telefonem', update: 'Zaktualizuj aplikację na zegarku', finished: 'Trening zakończony', nothingMore: 'Nic więcej do zrobienia',
      done: 'Seria zrobiona', doneDiff: 'Zrobione inaczej niż w planie', skip: 'Pomiń ćwiczenie', skipQuestion: 'Pominąć ćwiczenie?', undo: 'Cofnij', rest: 'Przerwa',
    });
  });
  const all = ciqLabelsAllLangs();
  test.each(LANGS)('%s: wszystkie etykiety niepuste, bez znaków sterujących, w limicie', l => {
    for (const id of CIQ_LABEL_IDS) { const v = all[l][id]; expect([l, id, typeof v === 'string' && v.trim().length > 0]).toEqual([l, id, true]); expect([...v].length).toBeLessThanOrEqual(CIQ_LIMITS.label); expect(v).not.toMatch(/[\u0000-\u001f]/); }
  });
  test('nowe etykiety są przetłumaczone: w żadnym języku poza polskim nie zostaje polski tekst', () => {
    const fresh: (typeof CIQ_LABEL_IDS[number])[] = ['idle', 'offline', 'update', 'finished', 'nothingMore', 'doneDiff', 'skip', 'skipQuestion'];
    for (const l of LANGS.filter(x => x !== 'pl')) for (const id of fresh) expect([l, id, all[l][id] === all.pl[id]]).toEqual([l, id, false]);
  });
  test('zmiana języka na czas odczytu nie zostawia innego języka', () => { applyLang('de'); ciqLabelsAllLangs(); expect(lang()).toBe('de'); expect(ciqLabels().undo).toBe('Rückgängig'); applyLang('pl'); });
  test('nazwa aplikacji na zegarku = APP_NAME języka', () => { expect(ciqAppName('pl')).toBe('Trening'); expect(ciqAppName('cs')).toBe('Trénink'); expect(ciqAppName('en')).toBe('Training'); });
  test('CIQ_LANG: każdy język aplikacji ma wpis; kody z listy Connect IQ, bez powtórzeń; serbski i grecki bez kodu; warianty regionalne bez własnego kodu', () => {
    expect(Object.keys(CIQ_LANG).sort()).toEqual([...LANGS].sort());
    const codes = Object.values(CIQ_LANG).filter((c): c is string => !!c); expect(new Set(codes).size).toBe(codes.length);
    const VALID = ['ara', 'bul', 'ces', 'dan', 'deu', 'dut', 'eng', 'est', 'fin', 'fre', 'hrv', 'hun', 'ind', 'ita', 'jpn', 'kor', 'lav', 'lit', 'nob', 'pol', 'por', 'slo', 'slv', 'spa', 'swe', 'rus', 'ron', 'tha', 'tur', 'ukr', 'vie', 'zsm', 'zhs', 'zht'];
    for (const c of codes) expect(VALID).toContain(c);
    expect([CIQ_LANG.sr, CIQ_LANG.el, CIQ_LANG.en, CIQ_LANG['es-419'], CIQ_LANG['pt-BR']]).toEqual([null, null, null, null, null]);
    expect([CIQ_LANG.pl, CIQ_LANG.nl, CIQ_LANG.fr, CIQ_LANG.sk, CIQ_LANG.ms, CIQ_LANG['zh-Hant']]).toEqual(['pol', 'dut', 'fre', 'slo', 'zsm', 'zht']);
  });
});

describe('rejestrator aktywności „Siła” (ciqRecorderAction)', () => {
  const A = CIQ_RECORDER_ACTIONS;
  test.each([
    // [nagrywa?, tryb, needsUpdate, czas, akcja]
    [false, CIQ_MODES.set, false, 0, A.start], [false, CIQ_MODES.rest, false, 0, A.start], [true, CIQ_MODES.set, false, 500, A.none], [true, CIQ_MODES.rest, false, 500, A.none],
    [false, CIQ_MODES.idle, false, 0, A.none], [false, CIQ_MODES.end, false, 0, A.none],
    [true, CIQ_MODES.end, false, CIQ_RECORD_MIN_SEC, A.save], [true, CIQ_MODES.end, false, CIQ_RECORD_MIN_SEC - 1, A.discard], [true, CIQ_MODES.end, false, 3600, A.save],
    [true, CIQ_MODES.idle, false, CIQ_RECORD_MIN_SEC, A.save], [true, CIQ_MODES.idle, false, 10, A.discard],
    [false, CIQ_MODES.set, true, 0, A.none], [true, CIQ_MODES.end, true, 3600, A.none],
  ])('nagrywa=%s tryb=%i aktualizacja=%s czas=%i s -> akcja %i', (rec, mode, upd, el, want) => { expect(ciqRecorderAction(rec, mode, upd, el)).toBe(want); });
  test('stałe: próg 60 s, cztery akcje w kolejności', () => { expect(CIQ_RECORD_MIN_SEC).toBe(60); expect(CIQ_RECORDER_ACTIONS).toEqual({ none: 0, start: 1, save: 2, discard: 3 }); });
});
