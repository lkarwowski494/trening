/*
 * Scenariusze modelu zegarka (lib/watch/client.ts) na migawkach z PRAWDZIWEGO telefonu (tests/watch-world.ts). Wspólne dla testów logiki (tests/watch-client.test.ts)
 * i generatora plików wzorcowych (tests/watch-fixtures.test.ts → watch-fixtures/scenarios/*.json, czytanych przez testy Swift i Monkey C).
 * Identyfikatory są zastępowane stałymi aliasami (workout-1, block-0, set-0-0), żeby pliki były deterministyczne.
 */
import * as timer from '@/lib/timer';
import * as store from '@/lib/store';
import { buildSnapshot, type SnapshotCtx } from '@/lib/watch/snapshot';
import { completeSet } from '@/lib/setFlow';
import type { ClientConfig, ClientInput } from '@/lib/watch/client';
import type { PhoneToWatch, WatchSnapshot } from '@/lib/watch/protocol';
import { applyLang, type Lang } from '@/lib/i18n';
import { world, A, NOW } from './watch-world';

export interface Step { at: number; input: ClientInput; note?: string }
export interface Scenario { name: string; doc: string; cfg: ClientConfig; steps: Step[] }

/** Zamiana losowych identyfikatorów treningu na stałe aliasy (głęboko, po wartościach tekstowych). */
export function aliasMap(): Map<string, string> {
  const m = new Map<string, string>(); const a = A(); m.set(a.id, 'workout-1');
  a.exercises.forEach((e, i) => { m.set(e.id, `block-${i}`); e.sets.forEach((s, j) => m.set(s.id, `set-${i}-${j}`)); });
  return m;
}
export const alias = <T>(x: T, m: Map<string, string>): T => JSON.parse(JSON.stringify(x), (_k, v) => (typeof v === 'string' && m.has(v) ? m.get(v) : v));

const rest = (): NonNullable<SnapshotCtx['rest']> => ({ on: timer.T.on, setId: timer.T.setId, endAt: timer.T.endAt, total: timer.T.total });
export interface Snaps { idle: WatchSnapshot; set1: WatchSnapshot; skipped: WatchSnapshot; rest1: WatchSnapshot; fill: WatchSnapshot; paused: WatchSnapshot; rest2: WatchSnapshot; after2: WatchSnapshot; lastRest: WatchSnapshot; done: WatchSnapshot }

/**
 * Migawki stanów treningu z prawdziwego telefonu — każdy fragment w osobnym świecie (`world()`), z zegarem ustawionym jak w scenariuszu (zdarzenia z zegarka
 * dochodzą z godziną `at`, więc przerwa liczy się od niej).
 */
export async function snapshots(lang?: Lang): Promise<Snaps> {
  /* `lang` (zrzuty zegarka, scripts/screens/watch-seed.ts): teksty danych migawki w tym języku; `world()` przywraca polski, więc język ustawiamy tuż przed budową migawki */
  const take = (rev: number, o: Partial<SnapshotCtx> = {}) => (lang && applyLang(lang), alias(buildSnapshot(A(), { rev, nowMs: Date.now(), rest: null, ...o }), aliasMap()));
  /* świat 1: początek treningu, pominięty blok, odhaczona pierwsza seria (przerwa), seria do uzupełnienia, pauza */
  await world(); if (lang) applyLang(lang); const idle = alias(buildSnapshot(null, { rev: 1, nowMs: Date.now(), rest: null }), aliasMap());
  const set1 = take(1);
  store.skipExercise(A().exercises[0].id); const skipped = take(2); store.unskipExercise(A().exercises[0].id);
  await completeSet(0, 0); const rest1 = take(2, { rest: rest() });
  A().exercises[0].sets[0].toFill = true; const fill = take(2, { rest: rest() }); delete A().exercises[0].sets[0].toFill;
  store.pauseWorkout(); const paused = take(2, { rest: rest() }); store.resumeWorkout();
  /* świat 2: druga seria odhaczona w przerwie po 20 s (przycisk główny w przerwie) */
  await world(); await completeSet(0, 0); jest.setSystemTime(NOW + 20e3); await completeSet(0, 1, NOW + 20e3); const rest2 = take(3, { rest: rest() });
  /* świat 3: dwa odhaczenia zrobione offline (godziny z zegarka), telefon stosuje je 30 s później */
  await world(); jest.setSystemTime(NOW + 30e3); await completeSet(0, 0, NOW + 1e3); await completeSet(0, 1, NOW + 20e3); const after2 = take(3, { rest: rest() });
  /* świat 4: ostatnia seria treningu — przerwa zostaje, potem faza done */
  await world(); A().exercises.forEach(e => e.sets.forEach(x => { x.done = true; })); A().exercises[2].sets[1].done = false;
  await completeSet(2, 1); const lastRest = take(2, { rest: rest() }); const r = rest(); const done = take(3, { rest: r, nowMs: r.endAt + 1000 });
  return { idle, set1, skipped, rest1, fill, paused, rest2, after2, lastRest, done };
}

export const welcomeOk = (): PhoneToWatch => ({ v: 1, kind: 'welcome', ok: true, protocol: 1, upgrade: null });
export const ack = (eventId: string, rev: number, status: 'applied' | 'duplicate' | 'ignored' | 'rejected' = 'applied'): PhoneToWatch => ({ v: 1, kind: 'ack', eventId, status, reason: null, rev });
const recv = (msg: PhoneToWatch): ClientInput => ({ t: 'receive', msg });

export function scenarios(S: Snaps): Scenario[] {
  const apple: ClientConfig = { client: 'apple', app: '0.20.0', session: true }; const garmin: ClientConfig = { client: 'garmin', app: '0.20.0', session: false };
  const T = NOW; const at = (n: number) => T + n;
  const rev = (x: WatchSnapshot, n: number): WatchSnapshot => ({ ...x, rev: n });
  const basic = (cfg: ClientConfig): Step[] => [
    { at: T, input: { t: 'launch' }, note: 'start aplikacji: zgłoszenie hello' },
    { at: T, input: recv(welcomeOk()) },
    { at: T, input: recv(S.set1), note: 'bieżąca seria: ćwiczenie, licznik, ciężar × powtórzenia' },
    { at: at(1000), input: { t: 'press', button: 'main' }, note: '„Seria zrobiona”: zdarzenie done; od razu przerwa i zapowiedź z pola after migawki (bez czekania na telefon)' },
    { at: at(1100), input: recv(S.rest1), note: 'telefon: migawka z przerwą (najpierw migawka…)' },
    { at: at(1200), input: recv(ack(`${cfg.client}-1`, 2)), note: '…potem potwierdzenie z numerem tej migawki' },
  ];
  return [
    { name: 'basic-apple', doc: 'Apple Watch online: seria → zrobione → przerwa z zapowiedzią (ten sam tekst co głos).', cfg: apple, steps: basic(apple) },
    { name: 'basic-garmin', doc: 'Zegarek z Connect IQ: to samo zachowanie, inny klient (eventId z przedrostkiem garmin, bez zdolności sesji).', cfg: garmin, steps: basic(garmin) },
    { name: 'ack-before-snapshot', doc: 'Potwierdzenie przed migawką (kolejność nie jest gwarantowana): widok nie migocze — zdarzenie znika dopiero z migawką o numerze z potwierdzenia.', cfg: apple, steps: [
      { at: T, input: recv(welcomeOk()) }, { at: T, input: recv(S.set1) }, { at: at(1000), input: { t: 'press', button: 'main' } },
      { at: at(1100), input: recv(ack('apple-1', 2)), note: 'ack wyprzedził migawkę: nadal widok z projekcji lokalnej' },
      { at: at(1200), input: recv(S.rest1) },
    ] },
    { name: 'undo-window', doc: '„Cofnij” tuż po odhaczeniu (okno 5 s): zdarzenie undo, widok wraca do serii; po oknie nie ma akcji cofnięcia i zdarzenie nie powstaje.', cfg: apple, steps: [
      ...basic(apple),
      { at: at(2000), input: { t: 'press', button: 'undo' }, note: 'w oknie: zdarzenie undo, widok wraca do serii (z historii migawek)' },
      { at: at(2100), input: recv(rev(S.set1, 3)), note: 'telefon cofnął odhaczenie' },
      { at: at(2200), input: recv(ack('apple-2', 3)) },
      { at: at(2300), input: { t: 'press', button: 'main' }, note: 'ponowne odhaczenie tej samej serii' },
      { at: at(2400), input: recv(rev(S.rest1, 4)) }, { at: at(2500), input: recv(ack('apple-3', 4)) },
      { at: at(9000), input: { t: 'tick' }, note: 'po 5 s okno minęło' },
      { at: at(9100), input: { t: 'press', button: 'undo' }, note: 'poza oknem: nic' },
    ] },
    { name: 'differ', doc: '„Zrobione inaczej niż w planie”: zdarzenie differ; telefon oznaczy serię „do uzupełnienia” (migawka z toFillCount).', cfg: apple, steps: [
      { at: T, input: recv(welcomeOk()) }, { at: T, input: recv(S.set1) },
      { at: at(1000), input: { t: 'press', button: 'differ' } },
      { at: at(1100), input: recv(S.fill), note: 'telefon: seria do uzupełnienia (toFillCount 1)' }, { at: at(1200), input: recv(ack('apple-1', 2)) },
    ] },
    { name: 'skip-confirm', doc: '„Pomiń”: najpierw pytanie [Anuluj, Pomiń]; Anuluj nic nie wysyła; Pomiń wysyła skip bloku.', cfg: apple, steps: [
      { at: T, input: recv(welcomeOk()) }, { at: T, input: recv(S.set1) },
      { at: at(500), input: { t: 'press', button: 'skip' }, note: 'pytanie o potwierdzenie' },
      { at: at(600), input: { t: 'press', button: 'cancelSkip' }, note: 'Anuluj: bez zdarzenia' },
      { at: at(700), input: { t: 'press', button: 'confirmSkip' }, note: 'potwierdzenie bez pytania: nic' },
      { at: at(800), input: { t: 'press', button: 'skip' } },
      { at: at(900), input: { t: 'press', button: 'confirmSkip' }, note: 'Pomiń: zdarzenie skip, widok czeka na telefon' },
      { at: at(1000), input: recv(S.skipped), note: 'telefon pominął blok' }, { at: at(1100), input: recv(ack('apple-1', 2)) },
    ] },
    { name: 'main-in-rest', doc: 'Przycisk główny w przerwie odhacza następną serię (ktoś skończył przerwę wcześniej).', cfg: apple, steps: [
      { at: T, input: recv(welcomeOk()) }, { at: at(1), input: recv(S.rest1) },
      { at: at(20000), input: { t: 'press', button: 'main' }, note: 'w przerwie: done następnej serii (set-0-1)' },
      { at: at(20100), input: recv(S.rest2) }, { at: at(20200), input: recv(ack('apple-1', 3)) },
    ] },
    { name: 'rest-ended', doc: 'Koniec odliczania przerwy: raz zdarzenie restEnded i przejście do serii.', cfg: apple, steps: [
      { at: T, input: recv(welcomeOk()) }, { at: at(1), input: recv(S.rest1) },
      { at: at(89000), input: { t: 'tick' }, note: 'jeszcze przerwa' },
      { at: at(90000), input: { t: 'tick' }, note: 'koniec: restEnded' },
      { at: at(90500), input: { t: 'tick' }, note: 'drugi raz nie' },
      { at: at(90600), input: recv(ack('apple-1', 2, 'ignored')) },
    ] },
    { name: 'offline-two-done', doc: 'Bez telefonu: po „zrobione” przerwa z pola after; drugie „zrobione” odhacza następną serię; potem „Połącz z telefonem”, dalsze przyciski nic nie robią; po powrocie zdarzenia dochodzą po kolei.', cfg: apple, steps: [
      { at: T, input: recv(welcomeOk()) }, { at: T, input: recv(S.set1) },
      { at: at(100), input: { t: 'connection', reachable: false } },
      { at: at(1000), input: { t: 'press', button: 'main' }, note: 'pierwsze zrobione offline' },
      { at: at(20000), input: { t: 'press', button: 'main' }, note: 'drugie (w przerwie) offline' },
      { at: at(21000), input: { t: 'press', button: 'main' }, note: 'trzecie: zegarek nie zna dalszych serii — nic' },
      { at: at(30000), input: { t: 'connection', reachable: true }, note: 'powrót: hello' },
      { at: at(30100), input: recv(S.after2), note: 'telefon zastosował oba zdarzenia i wysłał migawkę…' },
      { at: at(30200), input: recv(ack('apple-1', 3)) }, { at: at(30300), input: recv(ack('apple-2', 3)) },
    ] },
    { name: 'stale-snapshot', doc: 'Spóźniona (starsza) migawka tego samego treningu jest pomijana; ack nieznanego zdarzenia nic nie zmienia.', cfg: apple, steps: [
      { at: T, input: recv(welcomeOk()) }, { at: T, input: recv(rev(S.rest2, 6)) }, { at: at(1), input: recv(S.set1), note: 'starsza (rev 1 < 6): pomijamy' },
      { at: at(2), input: recv(ack('apple-99', 6)) },
    ] },
    { name: 'finished-and-update', doc: 'Koniec treningu na telefonie: „Trening zakończony”; nowy trening wraca do serii; welcome z upgrade=watch pokazuje „Zaktualizuj aplikację”.', cfg: apple, steps: [
      { at: T, input: recv(welcomeOk()) }, { at: T, input: recv(S.set1) }, { at: at(1), input: recv(rev(S.idle, 2)), note: 'trening skończony' },
      { at: at(2), input: recv(rev(S.set1, 3)) },
      { at: at(3), input: recv({ v: 1, kind: 'welcome', ok: false, protocol: 2, upgrade: 'watch' }), note: 'zegarek starszy od telefonu' },
      { at: at(4), input: recv({ v: 1, kind: 'welcome', ok: false, protocol: 1, upgrade: 'phone' }), note: 'telefon starszy od zegarka' },
    ] },
    { name: 'last-set-and-done', doc: 'Ostatnia seria: przerwa zostaje z „nic więcej do zrobienia”, potem ekran „done”.', cfg: apple, steps: [
      { at: T, input: recv(welcomeOk()) }, { at: T, input: recv(S.lastRest) }, { at: at(1), input: recv(S.done) },
      { at: at(2), input: { t: 'press', button: 'main' }, note: 'nie ma serii do odhaczenia — nic' },
    ] },
    { name: 'paused', doc: 'Pauza treningu na telefonie: znacznik paused w widoku, przerwa liczy dalej.', cfg: apple, steps: [{ at: T, input: recv(welcomeOk()) }, { at: at(1), input: recv(S.paused) }] },
  ];
}

import { clientStep, clientView, initialClient, type ClientView } from '@/lib/watch/client';
import type { WatchToPhone } from '@/lib/watch/protocol';
export interface Played { at: number; input: ClientInput; out: WatchToPhone[]; view: ClientView; note?: string }
/** Odtwarza scenariusz na modelu zegarka: dla każdego kroku zdarzenia do wysłania i widok po kroku. */
export function runScenario(sc: Scenario): Played[] {
  let st = initialClient(sc.cfg);
  return sc.steps.map(step => { const r = clientStep(st, { at: step.at, input: step.input }); st = r.state; return { at: step.at, input: step.input, out: r.out, view: clientView(st, step.at), note: step.note }; });
}
