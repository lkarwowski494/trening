/*
 * Regresja przebiegu E2E 38563966851 (14.10.2026, f020-wydanie, build z 0c33997, Maestro 2.11.0, iPhone 17, en-US): 6 scenariuszy padło, build i eksperymenty zielone.
 * Wszystkie sześć to scenariusze (albo wolny symulator), nie aplikacja — Jest ich nie odtwarzał, bo:
 *  - build E2E ma sztuczny sklep i udawany zegarek (panel „Test watch” pod treningiem, wydłuża ekran) we WSZYSTKICH scenariuszach, a Jest włączał je tylko dla 21, 35 i 50
 *    (tests/maestro-flows.test.tsx — teraz dla wszystkich);
 *  - przybliżony układ interpretera nie wylicza, gdzie lista staje po przewinięciu — pozycje z hierarchii przebiegu wstawia test (jak RUN_SCROLL w tests/maestro-e2e105.test.tsx).
 * 07 „Undo swap” nad górną krawędzią listy (y 35–75, lista od 62) — stuknięcie w pasek stanu; 27 znacznik serii 1 nad ekranem (y −35…8) — nic nie odhaczone, „No sets ticked”;
 * 50 „Finish” poza hierarchią po przewinięciu do wiersza serii; 35 „Workout view” nad krawędzią — klawiatura została i „RIR” nie zadziałał;
 * 28 dwa „Delete” (wiersz historii i przycisk okna) — Maestro stuknął w pierwszy; 31 zgubiony pierwszy znak „60” (waga 0) — ta sama klasa co 15 i 04 (E2E 105, Q-029).
 */
import { join } from 'path';
import { Runner, DIR, load } from './maestro-runner';
import { SCREEN } from './maestro-layout';

jest.setTimeout(240000);
type Cmd = any;
const same = (a: Cmd, b: Cmd) => JSON.stringify(a) === JSON.stringify(b);
const at = (c: Cmd[], step: Cmd) => { const i = c.findIndex(x => same(x, step)); if (i < 0) throw new Error('brak kroku ' + JSON.stringify(step)); return i; };
const without = (c: Cmd[], step: Cmd) => c.filter(x => !same(x, step));

/** Build E2E: sztuczny sklep + udawany zegarek we wszystkich scenariuszach (e2e-ios.yml). */
function fakeBuild(on: boolean) {
  const { resetStoreAdapterForTests } = require('@/lib/store-adapter'); const { resetEntitlementsForTests } = require('@/lib/entitlement');
  if (on) { process.env.EXPO_PUBLIC_STORE_FAKE = '1'; process.env.EXPO_PUBLIC_WATCH_FAKE = '1'; } else { delete process.env.EXPO_PUBLIC_STORE_FAKE; delete process.env.EXPO_PUBLIC_WATCH_FAKE; }
  resetStoreAdapterForTests(); resetEntitlementsForTests();
}
beforeEach(() => fakeBuild(true));
afterAll(() => { fakeBuild(false); delete (global as any).__notifPerm; delete (global as any).__sysPrompt; });

/** Wykonuje kroki do `marker` włącznie, przewija listę tak, by środek `target` leżał `dy` pt nad jej górną krawędzią (jak w hierarchii przebiegu), i kończy scenariusz. */
async function runAbove(f: string, cmds: Cmd[], marker: Cmd, target: any, stop?: Cmd, dy = 40) {
  const r = new Runner(f); const i = at(cmds, marker); await r.run(cmds.slice(0, i + 1), f);
  const c = r.find(target, true)[0]; const b = c?.node ? r.screenBox(c.node as any) : null;
  expect(b?.sc).toBeTruthy();
  const top = r.vpTop(b!.sc!); const cur = r.curScroll(b!.sc!, top);
  r.scrollY.set(r.scrollKey(b!.sc!), cur + (b!.y + b!.h / 2) - (top - dy));
  const b2 = r.screenBox(c!.node as any)!; expect(b2.y + b2.h / 2).toBeLessThan(top - SCREEN.slack); /* lista pozwala przewinąć tak daleko (treść dość długa) */
  await r.run(cmds.slice(i + 1, stop ? at(cmds, stop) + 1 : undefined), f); /* `stop`: dalsze kroki zależą od przewinięcia, którego przebieg nie pokazał */
}

describe('E2E 38563966851: scenariusze z elementem nad krawędzią listy', () => {
  test('07 — „Undo swap” nad listą: scenariusz przewija w górę przed stuknięciem; wersja z przebiegu zatrzymuje się na stuknięciu', async () => {
    const f = '07-zamiana.yaml'; const cmds = load(join(DIR, f)); const shot = { takeScreenshot: '33-po-zamianie' };
    const scroll = { scrollUntilVisible: { element: 'Undo swap: Bench Press \\(Dumbbell\\)', direction: 'UP', timeout: 30000, centerElement: true } };
    const target = { text: 'Undo swap: Bench Press \\(Dumbbell\\)' };
    const stop = { extendedWaitUntil: { visible: 'Swap exercise: Bench Press \\(Barbell\\)', timeout: 30000 } };
    await runAbove(f, cmds, shot, target, stop);
    await expect(runAbove(f, without(cmds, scroll), shot, target, stop)).rejects.toThrow(/tapOn "Undo swap[^\n]*\n(Nie znaleziono elementu|Element nad widokiem listy)/);
  });

  test('27 — znacznik serii 1 nad ekranem: scenariusz przewija w górę przed odhaczeniem; wersja z przebiegu zatrzymuje się na stuknięciu', async () => {
    const f = '27-biblioteka-cwiczen.yaml'; const cmds = load(join(DIR, f)); const mark = { extendedWaitUntil: { visible: 'Set 1 done — Zottman Curl E2E', timeout: 30000 } };
    const scroll = { scrollUntilVisible: { element: 'Set 1 done — Cable Hammer E2E', direction: 'UP', timeout: 60000, centerElement: true } };
    const target = { text: 'Set 1 done — Cable Hammer E2E' };
    await runAbove(f, cmds, mark, target);
    await expect(runAbove(f, without(cmds, scroll), mark, target)).rejects.toThrow(/tapOn "Set 1 done — Cable Hammer E2E"\n(Nie znaleziono elementu|Element nad widokiem listy)/);
  });

  test('50 — „Finish” nad ekranem po przewinięciu do wiersza serii: scenariusz przewija w górę przed drugim stuknięciem; wersja z przebiegu zatrzymuje się na „Finish”', async () => {
    const f = '50-zegarek-do-uzupelnienia.yaml'; const cmds = load(join(DIR, f));
    const scroll = { scrollUntilVisible: { element: 'Finish', direction: 'UP', timeout: 60000, centerElement: true } };
    const second = cmds.map((c: Cmd, i: number) => (same(c, scroll) ? i : -1)).filter((i: number) => i >= 0).pop()!; /* ostatnie takie przewinięcie — przed drugim „Finish” */
    expect(same(cmds[second - 1], { extendedWaitUntil: { visible: 'Set 1 to fill in — .*', timeout: 30000 } })).toBe(true);
    const marker = cmds[second - 1];
    const run = async (list: Cmd[]) => {
      const r = new Runner(f); const i = list.indexOf(marker); await r.run(list.slice(0, i + 1), f);
      const c = r.find({ text: 'Finish' }, true)[0]; const b = c?.node ? r.screenBox(c.node as any) : null; expect(b?.sc).toBeTruthy();
      const top = r.vpTop(b!.sc!); r.scrollY.set(r.scrollKey(b!.sc!), r.curScroll(b!.sc!, top) + (b!.y + b!.h / 2) - (top - 40));
      await r.run(list.slice(i + 1), f);
    };
    await run(cmds);
    await expect(run(cmds.filter((_: Cmd, i: number) => i !== second))).rejects.toThrow(/tapOn "Finish"/);
  });

  test('35 — klawiatura po wpisie przerwy zostaje na ekranie (zrzuty 105 z trzech przebiegów): przełączniki są przewijane na środek i stukane z klawiaturą; nie ma stukania „Workout view”', () => {
    const cmds = load(join(DIR, '35-ustawienia-dostepnosc.yaml')); const from = cmds.findIndex((c: Cmd) => c && c.retry && JSON.stringify(c).includes('Default rest'));
    const to = cmds.findIndex((c: Cmd) => same(c, { tapOn: { id: 'sw-Automatic backup after every workout' } })); expect(from).toBeGreaterThan(0); expect(to).toBeGreaterThan(from);
    expect(cmds.some((c: Cmd) => c && c.tapOn === 'Workout view')).toBe(false);
    const taps = cmds.slice(from, to + 1).map((c: Cmd, i: number, a: Cmd[]) => ({ c, prev: a[i - 1] })).filter(x => x.c && x.c.tapOn && x.c.tapOn.id && /^sw-/.test(x.c.tapOn.id));
    expect(taps.length).toBe(5);
    for (const x of taps) expect([x.c.tapOn.id, x.prev?.scrollUntilVisible?.centerElement, x.prev?.scrollUntilVisible?.element?.id]).toEqual([x.c.tapOn.id, true, x.c.tapOn.id]);
  });
});

describe('E2E 38563966851 / 38607952098: 28 — dwa „Delete” pod oknem pytania', () => {
  const f = '28-dluga-historia.yaml';
  const punkt = { tapOn: { point: '68%, 56%' } };
  const bez = { tapOn: { text: 'Delete', below: 'Delete this session from history\\?' } };
  test('stuknięcie w punkt przycisku „Delete” okna (68%, 56% — zrzuty przebiegów) — sesja znika, „3 sessions”', async () => {
    const cmds = load(join(DIR, f)); expect(cmds.filter((c: Cmd) => same(c, punkt)).length).toBe(1);
    await new Runner(f).run(cmds, f);
  });
  test('punkt po lewej (Cancel) zostawia sesję', async () => {
    const cmds = load(join(DIR, f)).map((c: Cmd) => same(c, punkt) ? { tapOn: { point: '32%, 56%' } } : c);
    await expect(new Runner(f).run(cmds, f)).rejects.toThrow(/extendedWaitUntil \{"visible":"3 sessions"/);
  });
  test('wersja z przebiegu 38563966851 (selektor bez indeksu) stuka w „Delete” wiersza pod oknem — okno zostaje, brak „3 sessions”', async () => {
    const cmds = load(join(DIR, f)).map((c: Cmd) => same(c, punkt) ? bez : c);
    await expect(new Runner(f).run(cmds, f)).rejects.toThrow(/extendedWaitUntil \{"visible":"3 sessions"/);
  });
  test('wersja z indeksem 1 (przebieg 38607952098: też nie trafiła w okno) — interpreter nie odróżnia kolejności, więc scenariusz nie może na niej polegać', () => {
    const txt = require('fs').readFileSync(join(DIR, f), 'utf8'); expect(txt).not.toMatch(/Delete this session from history\\\\\?", index: 1/);
  });
});

describe('E2E 38563966851: 31 — zgubiony pierwszy znak wagi na wolnym symulatorze', () => {
  const f = '31-pierwszy-tydzien.yaml';
  /* pierwsze wywołanie inputText w polu wagi pierwszego wiersza gubi pierwszy znak („60” → „0”, „6” → „”) */
  const dropFirst = () => { let n = 0; return (t: string, field: any) => { if (field.props.testID !== 'w-0-0') return t; n++; return n === 1 ? t.slice(1) : t; }; };
  test('scenariusz powtarza wpis wagi: 60 zapisane, rekordy ćwiczenia pokazują „Best session (volume)”', async () => {
    const r = new Runner(f); r.inputFilter = dropFirst(); await r.run(load(join(DIR, f)), f);
    expect(r.retries.length).toBe(1); expect(r.retries[0]).toMatch(/w-0-0/);
  });
  test('bez zgubionych znaków scenariusz przechodzi bez powtórki', async () => {
    const r = new Runner(f); await r.run(load(join(DIR, f)), f); expect(r.retries.length).toBe(0);
  });
  test('wersja z przebiegu (jeden wpis „60” bez sprawdzenia) przy zgubionym znaku zatrzymuje się przy rekordach ćwiczenia', async () => {
    const cmds: Cmd[] = load(join(DIR, f)); const k = cmds.findIndex(x => x && typeof x === 'object' && 'retry' in x && JSON.stringify(x).includes('"w-0-0"'));
    const old = [...cmds.slice(0, k), { tapOn: { id: 'w-0-0' } }, { inputText: '60' }, { tapOn: { id: 'r-0-0' } }, { inputText: '10' }, ...cmds.slice(k + 2)];
    const r = new Runner(f); r.inputFilter = dropFirst();
    await expect(r.run(old, f)).rejects.toThrow(/assertVisible "Best session/);
  });
});

describe('E2E 38607952098: 33/34 — zgubiony pierwszy znak powtórzeń („10” → „0”) w wpisie przed aktualizacją', () => {
  const f33 = '33-aktualizacja-przygotuj.yaml', f34 = '34-aktualizacja-sprawdz.yaml';
  const dropFirst = () => { let n = 0; return (t: string, field: any) => { if (field.props.testID !== 'r-0-0') return t; n++; return n === 1 ? t.slice(1) : t; }; };
  const pair = async (cmds33: Cmd[], filter?: any) => { const r = new Runner(f33); if (filter) r.inputFilter = filter; await r.run(cmds33, f33); const r2 = new Runner(f34); await r2.run(load(join(DIR, f34)), f34); return r; };
  test('scenariusz powtarza wpis powtórzeń — po aktualizacji „Now: 40 kg × 10”', async () => {
    const r = await pair(load(join(DIR, f33)), dropFirst()); expect(r.retries.length).toBe(1);
  });
  test('wersja z przebiegu (jeden wpis „10”) przy zgubionym znaku: 34 zatrzymuje się na „Now: 40 kg × 10”', async () => {
    const cmds: Cmd[] = load(join(DIR, f33)); const k = cmds.findIndex(x => x && typeof x === 'object' && 'retry' in x && JSON.stringify(x).includes('"w-0-0"'));
    const old = [...cmds.slice(0, k), { tapOn: { id: 'w-0-0' } }, { inputText: '40' }, { tapOn: { id: 'r-0-0' } }, { inputText: '10' }, ...cmds.slice(k + 2)];
    await expect(pair(old, dropFirst())).rejects.toThrow(/Now: 40 kg/);
  });
});

/* Tego interpreter nie odtwarza (bezwładność przewijania listy, rozsuwająca się klawiatura, układ okna wyboru) — zapisujemy tylko, że kroki są w `retry` (docs/09, E2E 38607952098). */
describe('E2E 38607952098: 12 i 32 — stuknięcie gubione na wolnym symulatorze jest powtarzane', () => {
  const inRetry = (f: string, text: string) => load(join(DIR, f)).some((c: Cmd) => c && typeof c === 'object' && 'retry' in c && JSON.stringify(c.retry.commands).includes(text));
  test('12: wybór „Back Squat” w retry', () => { expect(inRetry('12-usuwanie-gestem.yaml', 'Back Squat,.*')).toBe(true); });
  test('32: przewinięcie, czekanie na koniec ruchu, stuknięcie „Bench Press (Dumbbell)” i „RECORDS” w jednym retry', () => {
    const c = load(join(DIR, '32-regularny-uzytkownik.yaml')).find((x: Cmd) => x && typeof x === 'object' && 'retry' in x && JSON.stringify(x).includes('RECORDS'));
    const kinds = c.retry.commands.map((x: Cmd) => (typeof x === 'string' ? x : Object.keys(x)[0]));
    expect(kinds).toEqual(['scrollUntilVisible', 'waitForAnimationToEnd', 'tapOn', 'extendedWaitUntil']);
  });
});

/* E2E 39148365522: 35 — po „tapOn 90” kursor na początku: „45”+„90” = 4590 → 1800 s („rest 30:00” w treningu); 07 — „Finish” przewinięty tylko do krawędzi. Kursora i stuknięcia pod nagłówkiem interpreter nie odtwarza — test strukturalny. */
describe('E2E 39148365522: 35 i 07', () => {
  const retries = (f: string) => load(join(DIR, f)).filter((c: Cmd) => c && typeof c === 'object' && 'retry' in c);
  test('35: wpis przerwy — podwójne stuknięcie zaznacza liczbę, wpis „4”, „5”, sprawdzenie pola, retry; stary „tapOn 90” zniknął', () => {
    const r = retries('35-ustawienia-dostepnosc.yaml').find((c: Cmd) => JSON.stringify(c).includes('Default rest'));
    expect(r.retry.commands.map((x: Cmd) => (typeof x === 'string' ? x : Object.keys(x)[0]))).toEqual(['doubleTapOn', 'eraseText', 'inputText', 'inputText', 'assertVisible']);
    const all = load(join(DIR, '35-ustawienia-dostepnosc.yaml')); expect(all.some((c: Cmd) => same(c, { tapOn: '90' }))).toBe(false);
  });
  test('07: „Finish” przewijany na środek, stuknięcie i pytanie w retry', () => {
    const f = '07-zamiana.yaml'; const cmds = load(join(DIR, f)); const r = retries(f).find((c: Cmd) => JSON.stringify(c).includes('Finish workout'));
    expect(r.retry.commands.map((x: Cmd) => Object.keys(x)[0])).toEqual(['tapOn', 'extendedWaitUntil']);
    expect(cmds.some((c: Cmd) => same(c, { scrollUntilVisible: { element: 'Finish', direction: 'UP', timeout: 60000, centerElement: true } }))).toBe(true);
  });
});
