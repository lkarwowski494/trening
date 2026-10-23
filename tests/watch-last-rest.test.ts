/*
 * Test właściciela na telefonie, build 1030 (23.10.2026, W2-05): po ostatnim ćwiczeniu zegarek pokazywał „nic więcej do zrobienia” DWA razy — raz jako zapowiedź przerwy
 * z telefonu (`rest.cue`, ten sam tekst co podpis Live Activity), drugi raz jako stała etykieta pod odliczaniem (RootView, RestView). Decyzja właściciela 23.10.2026:
 * zegarek mówi, że trening kończy się na telefonie, i mówi to RAZ (docs/18). Test odtwarza błąd (zapowiedź ostatniej przerwy nie trafia do widoku) i pilnuje etykiety.
 */
import * as fs from 'fs';
import * as path from 'path';
import { clientView } from '@/lib/watch/client';
import { WATCH_LABEL_IDS, watchLabelsFor } from '@/lib/watch/labels';
import { LANGS } from '@/lib/i18n';
import { snapshots, scenarios, runScenario, type Snaps, type Scenario } from './watch-scenarios';
import { teardownWorld } from './watch-world';

afterEach(teardownWorld);
let S: Snaps; let SC: Record<string, Scenario>;
beforeAll(async () => { S = await snapshots(); SC = Object.fromEntries(scenarios(S).map(s => [s.name, s])); teardownWorld(); });
const src = (f: string) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');

describe('ostatnia przerwa na zegarku: informacja „zakończ na telefonie” raz', () => {
  test('migawka ostatniej przerwy niesie zapowiedź „nic więcej do zrobienia” (źródło dublowania) i znacznik last', () => {
    expect(S.lastRest.rest).toMatchObject({ last: true, cue: 'nic więcej do zrobienia' });
  });
  test('widok ostatniej przerwy: odliczanie jest, zapowiedzi (cue) nie ma — tekst „nic więcej…” nie trafia do widoku, więc nie może się powtórzyć', () => {
    const p = runScenario(SC['last-set-and-done']);
    expect(p[1].view).toMatchObject({ screen: 'rest', cue: null, actions: [] });
    expect(p[1].view.restEndsAt).not.toBeNull();
  });
  test('zwykła przerwa zachowuje zapowiedź następnego ćwiczenia (zmiana dotyczy tylko ostatniej)', () => {
    const p = runScenario(SC['basic-apple']);
    expect(p[3].view.cue).toBe('Bench Press (sztanga) · seria 2, 80 kg, 8 powtórzeń');
  });
  test('po końcu ostatniej przerwy (ekran done) widok też bez zapowiedzi', () => {
    const p = runScenario(SC['last-set-and-done']);
    expect(p[2].view).toMatchObject({ screen: 'done', cue: null });
  });
  test('etykieta finishOnPhone: PL i EN dokładnie; w każdym z 35 języków niepusta, różna od „Trening zakończony”, z wielkiej litery tam, gdzie pismo ją ma', () => {
    expect(watchLabelsFor('pl').finishOnPhone).toBe('Zakończ trening na telefonie');
    expect(watchLabelsFor('en').finishOnPhone).toBe('Finish the workout on your phone');
    for (const l of LANGS) {
      const x = watchLabelsFor(l);
      expect([l, x.finishOnPhone.trim().length > 0, x.finishOnPhone !== x.finished]).toEqual([l, true, true]);
      if (l !== 'ja') expect([l, x.finishOnPhone === x.finishOnPhone.charAt(0).toLocaleUpperCase(l) + x.finishOnPhone.slice(1)]).toEqual([l, true]); /* ja zaczyna się od „iPhone” (nazwa własna małą literą) */
    }
    expect(WATCH_LABEL_IDS).not.toContain('nothingLeft' as never);
  });
  test('Swift (RootView): komunikat „zakończ na telefonie” w przerwie bez akcji i na ekranie done; stara etykieta usunięta; zapowiedź ostatniej przerwy nie jest rysowana osobno', () => {
    const root = src('targets/watch-app/RootView.swift');
    expect(root).not.toContain('nothingLeft');
    expect(root.match(/\.finishOnPhone/g)?.length).toBe(2); /* RestView (bez akcji) + MessageView ekranu done */
    const cl = src('targets/watch-app/Core/WatchClient.swift');
    expect(cl).toContain('v.cue = rest.flatMap { $0.last ? nil : $0.cue }'); /* lustro lib/watch/client.ts */
    expect(src('targets/watch-app/Core/WatchLabels.swift')).not.toContain('nothingLeft');
  });
  test('clientView na stanie z migawką lastRest (czyste wywołanie): zapowiedzi brak w trakcie odliczania', () => {
    const base = { cfg: { client: 'apple' as const, app: '0.20.0', session: true }, seq: 0, connected: true, base: S.lastRest, queue: [], history: [], undo: null, confirmSkip: false, finished: false, upgrade: null, restEndedSent: null };
    const t0 = S.lastRest.rest!.endsAt - 30_000;
    expect(clientView(base, t0)).toMatchObject({ screen: 'rest', cue: null });
  });
});
