/*
 * Tryb „udawanego zegarka” tylko w buildzie E2E (decyzja właściciela 14.10.2026, docs/18; lib/watch/test-mode.ts, components/TestWatchPanel.tsx; wzór: tests/store-adapter.test.ts).
 * Rodzaje (docs/20): logika (warunek trybu), ekran (panel „Test watch”: trzy przyciski → zdarzenia zegarka na telefonie), scenariusz (przycisk → seria „do uzupełnienia” → restart),
 * STRAŻ (zmienna czytana w jednym pliku, nie w app.json/eas.json/.env, ustawiana tylko w e2e-ios.yml, TestFlight jej nie zna; zamek podwójny ze sztucznym sklepem), regresja
 * (łącze startuje po wczytaniu danych — E2E 50: „store not initialised”). Scenariusz Maestro: .maestro/50-zegarek-do-uzupelnienia.yaml (interpretowany w tests/maestro-flows.test.tsx).
 */
import * as fs from 'fs';
import * as path from 'path';
import * as store from '@/lib/store';
import { isFakeWatchBuild, testWatch, pressTestWatch, startTestWatch } from '@/lib/watch/test-mode';
import { stopWatchLink } from '@/lib/watch/link';
import { resetStoreAdapterForTests } from '@/lib/store-adapter';
import { resetEntitlementsForTests } from '@/lib/entitlement';
import { fresh, saved, ex } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';

jest.setTimeout(60000);
const root = path.join(__dirname, '..'); const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');
const walk = (d: string): string[] => fs.readdirSync(path.join(root, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : /\.(ts|tsx)$/.test(e.name) ? [path.join(d, e.name)] : []);
const SRC = ['app', 'components', 'lib'].flatMap(walk).filter(f => !/lib[\\/]locales/.test(f));
const noComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
const S = () => store.getState();
const env = (watch?: string, shop?: string) => { for (const [k, v] of [['EXPO_PUBLIC_WATCH_FAKE', watch], ['EXPO_PUBLIC_STORE_FAKE', shop]] as const) { if (v === undefined) delete process.env[k]; else process.env[k] = v; } resetStoreAdapterForTests(); resetEntitlementsForTests(); };
afterEach(() => { stopWatchLink(); env(); });

describe('warunek trybu: obie zmienne „1” (zamek podwójny ze sztucznym sklepem)', () => {
  test('domyślnie wyłączony; sama WATCH_FAKE nie wystarcza; sam sztuczny sklep nie włącza zegarka; inne wartości niż „1” — wyłączony', () => {
    env(); expect(isFakeWatchBuild()).toBe(false);
    env('1'); expect(isFakeWatchBuild()).toBe(false); env(undefined, '1'); expect(isFakeWatchBuild()).toBe(false);
    for (const v of ['0', 'true', '', 'yes', ' 1']) { env(v, '1'); expect([v, isFakeWatchBuild()]).toEqual([v, false]); }
    env('1', '1'); expect(isFakeWatchBuild()).toBe(true);
  });
  test('poza trybem pressTestWatch nic nie robi (false), atrapa nie istnieje', () => {
    env(); expect(pressTestWatch('done')).toBe(false); expect(testWatch()).toBeNull();
  });
});

describe('startTestWatch', () => {
  test('uruchamia atrapę jako łącze (zgłasza hello, telefon odpowiada welcome) i zwraca funkcję zatrzymującą, po której atrapy już nie ma', async () => {
    env('1', '1'); await fresh(undefined, 'en'); const stop = startTestWatch(); const fw = testWatch()!; expect(fw).not.toBeNull();
    await new Promise(r => setTimeout(r, 0)); await Promise.resolve();
    expect(fw.fromWatch.map(m => m.kind)).toContain('hello'); expect(fw.sent.map(m => m.kind)).toEqual(expect.arrayContaining(['snapshot']));
    stop(); expect(testWatch()).toBeNull();
  });
});

describe('panel „Test watch” w treningu', () => {
  const boot = async (watch?: string, shop?: string) => {
    env(watch, shop); await fresh(undefined, 'en'); S().settings.workoutView = 'list'; store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addExerciseToActive(ex('Pull Up'));
    store.addSet(0); store.addSet(0); S().active!.exercises.forEach(e => e.sets.forEach(s => { s.weight = 80; s.reps = 8; })); store.save(S().active!);
    await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: 'en' }); await flushAll(10);
  };
  const press = async (label: string) => { await tap(screen.getByText(label)); await flushAll(20); };

  test('zwykły build (także z samym sztucznym sklepem): panelu nie ma', async () => {
    await boot(); expect(screen.queryByTestId('fake-watch-panel')).toBeNull(); expect(screen.queryByText('Test watch')).toBeNull();
    await boot(undefined, '1'); expect(screen.queryByTestId('fake-watch-panel')).toBeNull(); expect(testWatch()).toBeNull();
  });
  test('build E2E: panel z trzema przyciskami; „differ” = seria 1 zrobiona inaczej („do uzupełnienia”), „done” = następna zrobiona według planu, „skip” = ćwiczenie pominięte po potwierdzeniu na zegarku', async () => {
    await boot('1', '1'); expect(screen.getByTestId('fake-watch-panel')).toBeTruthy(); expect(testWatch()).not.toBeNull();
    for (const l of ['Test watch', 'Test watch: done', 'Test watch: differ', 'Test watch: skip']) expect([l, !!screen.queryByText(l)]).toEqual([l, true]);
    await press('Test watch: differ'); const a = () => S().active!.exercises[0];
    expect(a().sets[0]).toMatchObject({ done: true, toFill: true }); expect(screen.getByLabelText('Set 1 to fill in — Bench Press (Barbell)')).toBeTruthy();
    await press('Test watch: done'); expect(a().sets[1].done).toBe(true); expect(a().sets[1].toFill).toBeUndefined();
    await press('Test watch: skip'); expect(S().active!.exercises.some(e => e.skipped)).toBe(true);
  });
  test('znacznik z atrapy przeżywa restart aplikacji (jak zdarzenie z prawdziwego zegarka)', async () => {
    await boot('1', '1'); await press('Test watch: differ'); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: 'en' }); await flushAll(10);
    expect(S().active!.exercises[0].sets[0].toFill).toBe(true); expect(screen.getByLabelText('Set 1 to fill in — Bench Press (Barbell)')).toBeTruthy();
  });
});

describe('STRAŻ: tryb nie trafia do TestFlight ani App Store', () => {
  const wf = fs.readdirSync(path.join(root, '.github/workflows')).filter(f => /\.ya?ml$/.test(f));
  test('zmienną czyta wyłącznie lib/watch/test-mode.ts; app.json, eas.json, package.json i pliki .env jej nie znają', () => {
    expect(SRC.filter(f => noComments(read(f)).includes('EXPO_PUBLIC_WATCH_FAKE')).sort()).toEqual([path.join('lib', 'watch', 'test-mode.ts')]);
    for (const f of ['app.json', 'eas.json', 'package.json']) expect({ f, has: read(f).includes('WATCH_FAKE') }).toEqual({ f, has: false });
    expect(fs.readdirSync(root).filter(f => /^\.env/.test(f))).toEqual([]);
  });
  test('workflowy: zmienną ustawia co najwyżej e2e-ios.yml (i wtedy razem ze sztucznym sklepem); testflight.yml jej nie ustawia, a jeśli ją wymienia — to w kroku blokującym', () => {
    for (const f of wf) {
      const t = read('.github/workflows/' + f); const sets = /EXPO_PUBLIC_WATCH_FAKE\s*:\s*['"]?\d/.test(t);
      if (f !== 'e2e-ios.yml') expect({ f, sets }).toEqual({ f, sets: false });
      else if (sets) expect(t).toMatch(/EXPO_PUBLIC_STORE_FAKE: '1'[\s\S]{0,200}EXPO_PUBLIC_WATCH_FAKE: '1'|EXPO_PUBLIC_WATCH_FAKE: '1'[\s\S]{0,200}EXPO_PUBLIC_STORE_FAKE: '1'/);
    }
    const tf = read('.github/workflows/testflight.yml');
    expect(tf).toMatch(/-n "\$\{EXPO_PUBLIC_STORE_FAKE:-\}"[\s\S]*exit 1/); /* zamek podwójny: bez STORE_FAKE tryb zegarka nie ruszy */
    if (tf.includes('WATCH_FAKE')) expect(tf).toMatch(/-n "\$\{EXPO_PUBLIC_WATCH_FAKE:-\}"[\s\S]*exit 1/);
  });
  test('kod: warunek wymaga sztucznego sklepu; panel i start atrapy tylko za isFakeWatchBuild(); panel raz, na dole ekranu treningu', () => {
    const m = noComments(read('lib/watch/test-mode.ts'));
    expect(m).toMatch(/export const isFakeWatchBuild = \(\): boolean => process\.env\.EXPO_PUBLIC_WATCH_FAKE === '1' && isFakeStoreBuild\(\);/);
    expect(noComments(read('components/TestWatchPanel.tsx'))).toMatch(/if \(!isFakeWatchBuild\(\)\) return null;/);
    expect(noComments(read('app/_layout.tsx'))).toMatch(/isFakeWatchBuild\(\) \? startTestWatch\(\) : startAppleWatchLink\(\)/);
    const aw = noComments(read('components/ActiveWorkout.tsx')); expect(aw.split('<TestWatchPanel />').length).toBe(2); expect(aw.indexOf('<TestWatchPanel />')).toBeGreaterThan(aw.indexOf('onPress={cancel}'));
    expect(SRC.filter(f => noComments(read(f)).includes('startTestWatch(')).sort()).toEqual([path.join('app', '_layout.tsx'), path.join('lib', 'watch', 'test-mode.ts')].sort());
  });
});

describe('regresja E2E 50: łącze z zegarkiem startuje dopiero po wczytaniu danych', () => {
  test('_layout: efekt łącza zależy od `ready` (przed init() migawka rzuciłaby „store not initialised”)', () => {
    expect(noComments(read('app/_layout.tsx'))).toMatch(/useEffect\(\(\) => \(ready \? \(isFakeWatchBuild\(\) \? startTestWatch\(\) : startAppleWatchLink\(\)\) : undefined\), \[ready\]\);/);
  });
});
