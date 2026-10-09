/*
 * Regresja przebiegu E2E 91 (09.10.2026, build z 1080a40, Maestro 2.11.0, iPhone 17, en-US): 7 z 17 scenariuszy nieudanych, przyczyny
 * w scenariuszach. Każdy test wykonuje bieżący scenariusz z krokiem przywróconym do wersji z 224d229 i sprawdza, że interpreter
 * (tests/maestro-runner.ts + przybliżony układ tests/maestro-layout.ts) zatrzymuje się w tym samym kroku co symulator — a bieżąca wersja
 * przechodzi (tests/maestro-flows.test.tsx). Poza zasięgiem interpretera (testy w tests/maestro-selectors.test.ts, „regresja E2E 91”):
 * 07 — tap przy górnej krawędzi trafił w systemowy baner iOS (Ustawienia → Siri), 11 — pole powtórzeń przy krawędzi klawiatury numerycznej.
 */
import { join } from 'path';
import { Runner, DIR, load } from './maestro-runner';

jest.setTimeout(240000);
type Cmd = any;
const same = (a: Cmd, b: Cmd) => JSON.stringify(a) === JSON.stringify(b);
/** Bieżący scenariusz z podmienionymi krokami: `edit` dostaje listę kroków i zwraca listę w wersji sprzed poprawki. */
async function failsAt(file: string, edit: (c: Cmd[]) => Cmd[], step: string, why: RegExp) {
  const cmds = edit(load(join(DIR, file)));
  let err: Error | null = null; try { await new Runner(file).run(cmds, file); } catch (e) { err = e as Error; }
  expect(err).not.toBeNull();
  const msg = err!.message.split('\nNa ekranie:')[0];
  expect(msg).toContain(`krok: ${file}: ${step}`); expect(msg).toMatch(why);
}
/** Ostatnie wystąpienie kroku (ten sam krok bywa w scenariuszu kilka razy, np. przewinięcie do przycisku zamiany w 07). */
const at = (c: Cmd[], step: Cmd) => { let i = -1; c.forEach((x, k) => { if (same(x, step)) i = k; }); if (i < 0) throw new Error('brak kroku ' + JSON.stringify(step)); return i; };
const replace = (step: Cmd, by: Cmd[]) => (c: Cmd[]) => { const i = at(c, step); return [...c.slice(0, i), ...by, ...c.slice(i + 1)]; };

describe('E2E 91: interpreter odtwarza porażki scenariuszy z 224d229 w tym samym kroku', () => {
  afterAll(() => { delete (global as any).__notifPerm; });

  test('01 — kafelek „Workouts” nie jest osobnym elementem (etykieta przycisku „Postępy” obejmuje trzy kafelki)', async () => {
    await failsAt('01-trening-z-szablonu.yaml', replace({ assertVisible: 'Workouts: 1, previous week 0;.*' }, [{ assertVisible: 'Workouts: 1, previous week 0' }]),
      'assertVisible "Workouts: 1, previous week 0"', /niewidoczny/);
  });

  test('10 — po przewinięciu do wiersza Pull Up karta „Set done” jest nad ekranem: `below: "Set done.*"` nie ma kotwicy', async () => {
    await failsAt('10-gumy.yaml', c => {
      const i = at(c, { scrollUntilVisible: { element: 'Set 1 done — Pull Up', direction: 'DOWN', timeout: 30000, centerElement: true } });
      return [...c.slice(0, i), { scrollUntilVisible: { element: 'Band: none', direction: 'DOWN', timeout: 30000, centerElement: true } }, { tapOn: { text: 'Band: none', below: 'Set done.*' } }, ...c.slice(i + 2)];
    }, 'tapOn {"text":"Band: none","below":"Set done.*"}', /Nie znaleziono/);
  });

  test('13 — okno zgody na przypomnienie po pierwszym dniu planu zasłania wiersze dni', async () => {
    await failsAt('13-kalendarz-plan.yaml', replace({ tapOn: { text: 'Not now', optional: true } }, []), 'tapOn "Tuesday, Rest"', /Nie znaleziono/);
  });

  test('15 — nagłówek „Packages (n)” pod licencjami, poza ekranem bez przewinięcia', async () => {
    await failsAt('15-masa-licencje.yaml', c => {
      const i = at(c, { extendedWaitUntil: { visible: 'MIT, .*', timeout: 30000 } });
      return [...c.slice(0, i), { extendedWaitUntil: { visible: 'Packages \\(\\d+\\)', timeout: 30000 } }, ...c.slice(i + 1)];
    }, 'extendedWaitUntil {"visible":"Packages \\\\(\\\\d+\\\\)","timeout":30000}', /nie pojawił się/);
  });

  test('17 — „Setup” pod rysunkiem ruchu, poza ekranem bez przewinięcia', async () => {
    await failsAt('17-biblioteka-technika.yaml', replace({ scrollUntilVisible: { element: 'Setup', direction: 'DOWN', timeout: 30000 } }, [{ extendedWaitUntil: { visible: 'Setup', timeout: 15000 } }]),
      'extendedWaitUntil {"visible":"Setup","timeout":15000}', /nie pojawił się/);
  });

  test('07 (krok po porażce przebiegu 91) — po linijce „Usually at Home…” przycisk zamiany jest pod paskiem zakładek', async () => {
    await failsAt('07-zamiana.yaml', replace({ scrollUntilVisible: { element: 'Swap exercise: Bench Press \\(Dumbbell\\)', direction: 'DOWN', timeout: 30000, centerElement: true } }, [{ assertVisible: 'Swap exercise: Bench Press \\(Dumbbell\\)' }]),
      'assertVisible "Swap exercise: Bench Press \\\\(Dumbbell\\\\)"', /niewidoczny/);
  });

  test('model: przewijanie w złą stronę (element pod widokiem, direction: UP) to błąd — Maestro przewija tylko w podanym kierunku', async () => {
    /* 15: nagłówek „Packages (n)” jest pod widokiem — przewijanie w górę go nie pokaże */
    await failsAt('15-masa-licencje.yaml', replace({ scrollUntilVisible: { element: 'Packages \\(\\d+\\)', direction: 'DOWN', timeout: 60000 } }, [{ scrollUntilVisible: { element: 'Packages \\(\\d+\\)', direction: 'UP', timeout: 60000 } }]),
      'scrollUntilVisible {"element":"Packages \\\\(\\\\d+\\\\)","direction":"UP","timeout":60000}', /pod widokiem/);
  });
  test('model: chip poza prawą krawędzią poziomego paska (E2E 89, 16 — „weight + time”, piąty chip) jest niewidoczny', async () => {
    await failsAt('16-edycja-na-zadanie.yaml', c => { const i = c.findIndex(x => same(x, { tapOn: 'reps' })); return [...c.slice(0, i), { tapOn: 'weight \\+ time' }, ...c.slice(i + 1)]; },
      'tapOn "weight \\\\+ time"', /Nie znaleziono|poza ekranem/);
  });
});

/*
 * Przebieg E2E run 37900617167 (commit f2bdca8, 14/17): trzy porażki w scenariuszach (aplikacja bez zmian), odtworzone tu na krokach sprzed poprawki:
 * 15 — wyrażenie do całego tekstu (treść licencji zaczyna się od „MIT License”; interpreter z flagą m dopasowywał do linii),
 * 07 — „Back” ze stylem 'cancel' jest na dole okna (interpreter pomijał kotwice przy oknie),
 * 13 — „Close” rozwiniętej sekcji „What's new” pod paskiem zakładek (luz 24 pt przepuszczał stuknięcie).
 */
describe('run 37900617167 (f2bdca8): interpreter odtwarza porażki w tym samym kroku', () => {
  afterAll(() => { delete (global as any).__notifPerm; });

  test('model: wyrażenie Maestro pasuje do CAŁEGO tekstu, także wielolinijkowego (Kotlin Regex.matches z MULTILINE)', () => {
    const { full } = require('./maestro-runner');
    const lic = 'MIT License\n\nPermission is hereby granted, free of charge,\nto any person';
    expect(full('Permission is hereby granted.*').test(lic)).toBe(false);
    expect(full('MIT License.*Permission is hereby granted.*').test(lic)).toBe(true);
    expect(full('MIT License').test(lic)).toBe(false);
    expect(full('Finish workout?').test('Finish workout?')).toBe(true); /* dosłowna równość */
  });

  test('15 — „Permission is hereby granted.*” nie pasuje do treści licencji od „MIT License”', async () => {
    await failsAt('15-masa-licencje.yaml', replace({ extendedWaitUntil: { visible: 'MIT License.*Permission is hereby granted.*', timeout: 30000 } }, [{ extendedWaitUntil: { visible: 'Permission is hereby granted.*', timeout: 30000 } }]),
      'extendedWaitUntil {"visible":"Permission is hereby granted.*","timeout":30000}', /nie pojawił się/);
  });

  test('07 — „Back” (styl cancel) na dole okna: przycisk okna nie jest pod „Back”', async () => {
    await failsAt('07-zamiana.yaml', replace({ tapOn: { text: 'Discard workout', above: 'Back' } }, [{ tapOn: { text: 'Discard workout', below: 'Back', above: 'Discard workout' } }]),
      'tapOn {"text":"Discard workout","below":"Back","above":"Discard workout"}', /Nie znaleziono/);
  });

  test('13 — „Close” rozwiniętej sekcji „What\'s new” pod paskiem zakładek bez przewinięcia', async () => {
    const up = { scrollUntilVisible: { element: 'Start planned workout: Upper A', direction: 'UP', timeout: 30000, centerElement: true } };
    await failsAt('13-kalendarz-plan.yaml', c => replace({ scrollUntilVisible: { element: 'Close', direction: 'DOWN', timeout: 30000, centerElement: true } }, [])(c).filter(x => !same(x, up)),
      'tapOn "Close"', /pod widokiem listy/);
  });
});
