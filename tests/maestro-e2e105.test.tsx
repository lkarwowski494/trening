/*
 * Regresja przebiegów E2E 102–105 (09–10.10.2026, Maestro 2.11.0, iPhone 17, en-US; przebiegi 38002403800, 38009269888, 38014484054 — build z e5053fa):
 * scenariusze 13 i 15 padały powtarzalnie. Przyczyny w scenariuszach i w szybkości symulatora, nie w dacie ani strefie (sprawdzone: oba scenariusze
 * przechodzą w interpreterze o 2026-10-09T23:40Z i 2026-10-10T00:30Z w strefach UTC, America/Los_Angeles i Pacific/Auckland — docs/09, E2E 105).
 *
 * 13 — ekran Trening był przewinięty o ok. 54 pt (podscenariusz szablon-testowy: `scrollUntilVisible "Start: Upper A"` z centerElement — lista
 * dojechała do końca treści) i zakładka trzyma przewinięcie. „i” leżało pod paskiem stanu: hierarchia Maestro w chwili stuknięcia
 * `whats-new-i` [14,27][46,59], po stuknięciu [14,81][46,113] (maestro.log i screen-hierarchy przebiegu 38014484054). Maestro uznał element za
 * widoczny (hierarchia iOS nie przycina do listy) i stuknął w (30, 43) — w pasek stanu; iOS przewinął listę do góry („scroll to top”), panel się nie
 * otworzył. Interpreter szacuje „Start: Upper A” 20 pt wyżej niż symulator (cały widoczny — bez przewinięcia), więc przewinięcie z przebiegu
 * wstawia test.
 * 15 — znaki „80” giną na symulatorze: 38002403800 i 38009269888 zapisały 0 (okno „must be greater than zero”), 38014484054 — 8 kg
 * (device-simulator.log: oba klawisze wstawione w pole, drugi 0,1 s po pierwszym, po 0,6 s zawieszenia wątku głównego; w przebiegu 37992276800,
 * który przeszedł, odstęp 0,7 s). Interpreter nie ma natywnego pola, więc zgubienie znaku podaje test (`inputFilter`).
 */
import { join } from 'path';
import { Runner, DIR, load } from './maestro-runner';

jest.setTimeout(240000);
type Cmd = any;
const same = (a: Cmd, b: Cmd) => JSON.stringify(a) === JSON.stringify(b);
const at = (c: Cmd[], step: Cmd) => { const i = c.findIndex(x => same(x, step)); if (i < 0) throw new Error('brak kroku ' + JSON.stringify(step)); return i; };
/** Przewinięcie ekranu Trening z przebiegu 38014484054: „i” na y = 27 zamiast 81. */
const RUN_SCROLL = 81 - 27;
const SHOT = { takeScreenshot: '63-dzis' };
const TAP_I = { tapOn: { id: 'whats-new-i' } };

async function run13(cmds: Cmd[]) {
  const f = '13-kalendarz-plan.yaml'; const r = new Runner(f); const i = at(cmds, SHOT);
  await r.run(cmds.slice(0, i + 1), f);
  const c = r.find({ id: 'whats-new-i' }, true)[0]; const b = c?.node ? r.screenBox(c.node as any) : null;
  expect(b?.sc).toBeTruthy();
  r.scrollY.set(r.scrollKey(b!.sc!), RUN_SCROLL);
  await r.run(cmds.slice(i + 1), f);
}
/** Przebieg 38014484054: pierwsza próba gubi drugi znak masy ciała („80” → „8”; przy wpisywaniu po znaku — „0”). */
const dropSecond = () => { let n = 0; return (t: string, field: any) => { if (field.props.testID !== 'bodymass-kg') return t; n++; return n === 1 ? t.slice(0, 1) : n === 2 && t.length === 1 ? '' : t; }; };

describe('E2E 105: scenariusze 13 i 15 na symulatorze', () => {
  afterAll(() => { delete (global as any).__notifPerm; });

  test('13 — z przewinięciem z przebiegu „i” pod paskiem stanu: scenariusz najpierw przewija ekran do góry i otwiera „Co nowego”', async () => {
    await run13(load(join(DIR, '13-kalendarz-plan.yaml')));
  });

  test('13 — wersja z przebiegu (stuknięcie „i” bez przewinięcia) zatrzymuje się na „i”', async () => {
    const cmds = load(join(DIR, '13-kalendarz-plan.yaml')); const i = at(cmds, SHOT), j = at(cmds, TAP_I);
    const old = [...cmds.slice(0, i + 1), ...cmds.slice(j)];
    await expect(run13(old)).rejects.toThrow(/krok: 13-kalendarz-plan\.yaml: tapOn \{"id":"whats-new-i"\}/);
  });

  test('15 — zgubiony znak masy ciała: scenariusz powtarza wpis i zapisuje 80 kg', async () => {
    const f = '15-masa-licencje.yaml'; const r = new Runner(f); r.inputFilter = dropSecond();
    await r.run(load(join(DIR, f)), f);
    expect(r.retries.length).toBe(1); expect(r.retries[0]).toMatch(/80 kg/);
  });

  test('15 — wersja z przebiegu (jeden wpis „80”) przy zgubionym znaku zatrzymuje się na „80 kg”', async () => {
    const f = '15-masa-licencje.yaml'; const r = new Runner(f); r.inputFilter = dropSecond();
    /* kroki z f5b320d (przebieg 38014484054) w miejscu bloku `retry` */
    const cur: Cmd[] = load(join(DIR, f)); const k = cur.findIndex(x => x && typeof x === 'object' && 'retry' in x);
    const old = k < 0 ? cur : [...cur.slice(0, k), { tapOn: { id: 'bodymass-kg' } }, 'waitForAnimationToEnd', { inputText: '80' }, { tapOn: 'Save measurement' }, { extendedWaitUntil: { visible: '80 kg, .*', timeout: 30000 } }, ...cur.slice(k + 1)];
    await expect(r.run(old, f)).rejects.toThrow(/extendedWaitUntil \{"visible":"80 kg, \.\*"/);
  });
});
