/* M1-audytor-generalny-053: limit przerwy (REST_MAX) i limit doby (DURATION_MAX_SEC) są w jednym miejscu — lib/state/util.ts.
   Strażnik: żadnego literału 1800/86400 w lib/ poza tym modułem; zmiana stałej przechodzi przez migrację, stoper i zamiennik. */
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative } from 'path';

const LIB = join(__dirname, '../lib');
const files = (d: string): string[] => readdirSync(d).flatMap(n => {
  const p = join(d, n);
  return statSync(p).isDirectory() ? (n === 'locales' || n === 'cues' || n === 'figures' ? [] : files(p)) : /\.tsx?$/.test(n) && !/generated|i18n/.test(n) ? [p] : [];
});

/* Stryker (nightly.yml, mutacje) instrumentuje lib/: id mutantów to liczby w cudzysłowie, np. stryMutAct_9fa48("1800") — nie są literałami kodu
   (run 39537208004: „plan.ts:80”). Wycinamy wywołania instrumentacji przed szukaniem. */
const bezInstrumentacji = (l: string) => l.replace(/\bstry(MutAct|Cov)_\w+\(\s*(?:"\d+"\s*,?\s*)+\)?/g, '');

describe('limity w jednym miejscu (M1-053)', () => {
  test('instrumentacja Strykera nie daje fałszywych trafień, a prawdziwy literał zostaje', () => {
    const wzor = /\b(1800|86400|86_400|1_800)\b/;
    expect(bezInstrumentacji('if (stryMutAct_9fa48("1800")) {} else { stryCov_9fa48("1800", "1801"); x = 5; }')).not.toMatch(wzor);
    expect(bezInstrumentacji('const t = stryMutAct_9fa48("12") ? 0 : 1800;')).toMatch(wzor);
    expect(bezInstrumentacji('const d = 86400;')).toMatch(wzor);
  });
  test('literały 1800 i 86400 występują w lib/ tylko w lib/state/util.ts', () => {
    const trafienia = files(LIB).filter(f => !f.endsWith('state/util.ts'))
      .flatMap(f => readFileSync(f, 'utf8').split('\n').map((l, i) => [relative(LIB, f) + ':' + (i + 1), bezInstrumentacji(l).replace(/\/\*.*?\*\/|\/\/.*$/g, '')] as const))
      .filter(([, l]) => /\b(1800|86400|86_400|1_800)\b/.test(l)).map(([w]) => w);
    expect(trafienia).toEqual([]);
  });

  const zStalymi = (rest: number, doba: number, fn: (m: any) => void) => {
    jest.isolateModules(() => {
      jest.doMock('../lib/state/util', () => ({ ...jest.requireActual('../lib/state/util'), REST_MAX: rest, DURATION_MAX_SEC: doba }));
      fn(require('../lib/store'));
    });
    jest.dontMock('../lib/state/util');
  };
  const surowy = () => ({
    exercises: [{ id: 'e1', name: 'Plank', metric: 'time', restSec: 1400, restWarmupSec: 1300 }],
    templates: [{ id: 't1', name: 'A', items: [{ id: 'i1', exerciseId: 'e1', sets: 1, restSec: 1500, targetSec: 5000 }] }],
    workouts: [{ id: 'w1', templateId: 't1', startedAt: 1, finishedAt: 2, exercises: [{ id: 'x1', exerciseId: 'e1', restSec: 1200, sets: [{ id: 's1', done: true, durationSec: 5000 }] }] }],
    settings: { defaultRest: 1500 },
    timer: { restTotal: 5000, setTarget: 5000 },
  });

  test('zmniejszenie stałych zmienia efekt migracji w ustawieniach, katalogu, szablonie, treningu i stoperze', () => {
    zStalymi(600, 3600, m => {
      const s = m.migrate(surowy());
      expect(s.settings.defaultRest).toBe(600);
      expect(s.exercises[0].restSec).toBe(600);
      expect(s.exercises[0].restWarmupSec).toBe(600);
      expect(s.templates[0].items[0].restSec).toBe(600);
      expect(s.templates[0].items[0].targetSec).toBe(3600);
      expect(s.workouts[0].exercises[0].restSec).toBe(600);
      expect(s.workouts[0].exercises[0].sets[0].durationSec).toBe(3600);
      expect(s.timer.restTotal).toBe(3600);
      expect(s.timer.setTarget).toBe(3600);
    });
  });
  test('przy wartościach produkcyjnych 1800 s i doba (86400 s) — jak dotąd', () => {
    zStalymi(1800, 86400, m => {
      const raw: any = surowy(); raw.exercises[0].restSec = 99999; raw.workouts[0].exercises[0].sets[0].durationSec = 200000;
      const s = m.migrate(raw);
      expect(s.exercises[0].restSec).toBe(1800);
      expect(s.workouts[0].exercises[0].sets[0].durationSec).toBe(86400);
    });
  });
});
