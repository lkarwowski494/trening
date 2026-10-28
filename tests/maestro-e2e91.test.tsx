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
    await failsAt('01-trening-z-szablonu.yaml', replace({ assertVisible: 'Workouts: 1;.*' }, [{ assertVisible: 'Workouts: 1' }]),
      'assertVisible "Workouts: 1"', /niewidoczny/); /* 11.10.2026: etykieta bez „previous week” — „Workouts: 1; Sets: …; Volume: …; Time: …” */
  });

  test('10 — po przewinięciu do wiersza Pull Up karta „Set done” jest nad ekranem: `below: "Set done.*"` nie ma kotwicy', async () => {
    await failsAt('10-gumy.yaml', c => {
      const i = at(c, { scrollUntilVisible: { element: 'Set 1 done — Pull Up', direction: 'DOWN', timeout: 30000, centerElement: true } });
      /* M3 p2: tablica „teraz” jest niższa niż dawna karta i przy wierszu Pull Up jeszcze się mieści — do odtworzenia przewijamy do końca listy (tablica nad ekranem) */
      return [...c.slice(0, i), { scrollUntilVisible: { element: '\\+ Add exercise', direction: 'DOWN', timeout: 30000, centerElement: true } }, { scrollUntilVisible: { element: 'Band: none', direction: 'DOWN', timeout: 30000, centerElement: true } }, { tapOn: { text: 'Band: none', below: 'Set done.*' } }, ...c.slice(i + 2)];
    }, 'tapOn {"text":"Band: none","below":"Set done.*"}', /Nie znaleziono/);
  });

  test('13 — okno zgody na przypomnienie po pierwszym dniu planu zasłania wiersze dni', async () => {
    /* przebieg 39399241275: „Not now” jest też po starcie treningu (karta zgody) — usuwamy PIERWSZE wystąpienie, to po pierwszym dniu planu */
    const first = (c: Cmd[]) => { const i = c.findIndex(x => same(x, { tapOn: { text: 'Not now', optional: true } })); return [...c.slice(0, i), ...c.slice(i + 1)]; };
    await failsAt('13-kalendarz-plan.yaml', first, 'tapOn "Tuesday, Rest"', /Nie znaleziono/);
  });

  test('15 — nagłówek „Packages (n)” pod licencjami, poza ekranem bez przewinięcia', async () => {
    await failsAt('15-masa-licencje.yaml', c => {
      const i = at(c, { extendedWaitUntil: { visible: 'MIT, .*', timeout: 30000 } });
      return [...c.slice(0, i), { extendedWaitUntil: { visible: 'Packages \\(\\d+\\)', timeout: 30000 } }, ...c.slice(i + 1)];
    }, 'extendedWaitUntil {"visible":"Packages \\\\(\\\\d+\\\\)","timeout":30000}', /nie pojawił się/);
  });

  test('17 — „Setup” pod rysunkiem ruchu, poza ekranem bez przewinięcia', async () => {
    /* kroki figury (TST2-05) dopisane po 224d229 przewijają do przycisku pauzy — usunięte, jak w wersji z przebiegu */
    const fig = (c: Cmd[]) => { const a = at(c, { tapOn: 'Technique' }); /* od 27.10.2026 dwa stuknięcia (zwiń, rozwiń) — liczy się ostatnie */ const b = c.findIndex(x => same(x, { extendedWaitUntil: { visible: 'Pause animation', timeout: 15000 } })); expect(b).toBeGreaterThan(a); return [...c.slice(0, a + 1), ...c.slice(b + 1)]; };
    /* audyt kontrolny 1 (UX2-05 B, celowa zmiana): sekcja „Technika” stoi teraz na górze podglądu — „Setup” mieści się pod rysunkiem bez przewijania;
     * ten sam rodzaj porażki (element pod krawędzią bez przewinięcia) sprawdzamy na stopce sekcji (zdanie o poradach medycznych) */
    await failsAt('17-biblioteka-technika.yaml', c => replace({ scrollUntilVisible: { element: 'The app does not give medical advice.*', direction: 'DOWN', timeout: 30000 } }, [{ extendedWaitUntil: { visible: 'The app does not give medical advice.*', timeout: 15000 } }])(replace({ scrollUntilVisible: { element: 'Setup', direction: 'DOWN', timeout: 30000 } }, [])(fig(c))),
      'extendedWaitUntil {"visible":"The app does not give medical advice.*","timeout":15000}', /nie pojawił się/);
  });

  test('07 (krok po porażce przebiegu 91) — po podpowiedzi „Usually at Home…” przycisk zamiany bywa pod paskiem zakładek: scenariusz przewija do niego', async () => {
    /* 11.10.2026 (wydanie 1): podpowiedź to jeden tekst-przycisk bez „Zamień” — w układzie interpretera przycisk zamiany mieści się już bez przewinięcia,
     * więc porażki z przebiegu 91 nie da się odtworzyć w tym samym kroku. Przewinięcie z centerElement zostaje w scenariuszu (większa czcionka,
     * dłuższe tłumaczenia) — test pilnuje, że stoi PO podpowiedzi „Swap to substitute: …” i przed zrzutem 37. */
    const c = load(join(DIR, '07-zamiana.yaml')); const hint = at(c, { extendedWaitUntil: { visible: 'Swap to substitute: .*', timeout: 30000 } });
    const scroll = at(c, { scrollUntilVisible: { element: 'Swap exercise: Bench Press \\(Dumbbell\\)', direction: 'DOWN', timeout: 30000, centerElement: true } });
    expect(scroll).toBeGreaterThan(hint); expect(c.findIndex(x => same(x, { takeScreenshot: '37-podpowiedz-zamiennika' }))).toBeGreaterThan(scroll);
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

  test('07 — „Cancel” (styl cancel) na dole okna: przycisk okna nie jest pod „Cancel”', async () => {
    await failsAt('07-zamiana.yaml', replace({ tapOn: { text: 'Discard workout', above: 'Cancel' } }, [{ tapOn: { text: 'Discard workout', below: 'Cancel', above: 'Discard workout' } }]),
      'tapOn {"text":"Discard workout","below":"Cancel","above":"Discard workout"}', /Nie znaleziono/);
  });

  /* 13 — „Close” rozwiniętej sekcji „What's new”: przy 1.0.0 historia pusta, scenariusz 13 nie otwiera panelu (docs/18, 14.10.2026). */
});
