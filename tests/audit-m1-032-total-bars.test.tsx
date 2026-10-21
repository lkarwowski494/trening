/*
 * M1-audytor-generalny-032: paski „ten okres / poprzedni okres” w Progresji różniły się tylko kolejnością (oba pełne). Po naprawie sumy (objętość, serie) mają ten sam
 * język co paski partii: okres 1 — pełny kolor (SegBar), okres 2 — szary z prążkami (HatchBar) i nazwa okresu przy każdym pasku (PeriodLine); strażnik: żaden pasek
 * „poprzedni” w app/ i components/ nie jest zwykłym SegBar.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { uid, type Template, type TRow } from '@/lib/seed';
import { fresh, saved, ex, addWorkout } from './helpers';
import { renderApp, flushAll, screen, act } from './app';
import { within } from '@testing-library/react-native';

jest.setTimeout(60000);
const NOW = new Date(2026, 9, 8, 9, 0);
const row = (reps: number | '', weight: number | ''): TRow => ({ id: uid(), kind: 'normal', reps, weight, durationSec: '', distanceM: '' });
function tpl(name: string, rows: TRow[]): Template { const t = store.newTemplate(); t.name = name; t.items = [{ id: uid(), exerciseId: ex('Back Squat').id, sets: rows.length, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null, rows }]; store.save(); return t; }
const sq = (m: number, d: number, n: number) => addWorkout(new Date(2026, m, d, 18).getTime(), [['Back Squat', Array.from({ length: n }, () => ({ weight: 100, reps: 5 }))]], 'Przysiad');
const boot = async (url: string) => {
  jest.useFakeTimers({ now: NOW }); await fresh(); const a = tpl('A', [row(5, 100), row(5, 100)]);
  jest.setSystemTime(new Date(2026, 9, 5, 6).getTime()); plan.setWeekDay(1, a.id); jest.setSystemTime(NOW.getTime());
  sq(9, 6, 2); sq(8, 30, 2); sq(8, 23, 1); sq(8, 3, 1); store.save();
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
};
const prog = () => screen.getByTestId('progression-screen');
const has = (id: string) => prog().findAll((n: { type: unknown; props: { testID?: string } }) => typeof n.type === 'string' && n.props.testID === id).length > 0;

describe('sumy w Progresji: okres 2 z prążkami i nazwą okresu', () => {
  test.each([['week', 'Ten tydzień', 'Poprzedni tydzień'], ['prevWeek', 'Poprzedni tydzień', '2 tyg. temu'], ['month', 'Ten miesiąc', 'Poprzedni miesiąc']] as const)('%s: objętość i serie — okres 1 pełny (SegBar), okres 2 HatchBar z prążkami; przy każdym pasku nazwa okresu', async (kind, n1, n2) => {
    await boot(`/progression?c=${kind}`);
    for (const id of ['volume', 'sets']) {
      expect([id, has(`total-${id}-cur`)]).toEqual([id, true]);
      expect([id, has(`total-${id}-prev-fill`), has(`total-${id}-prev-hatch`)]).toEqual([id, true, true]); /* HatchBar: wypełnienie szare + prążki */
      expect([id, has(`cswatch-2-total-${id}`), has(`cswatch-2-total-${id}-hatch`), has(`cswatch-1-total-${id}`)]).toEqual([id, true, true, true]); /* próbki okresów */
      const box = within(screen.getByTestId(`total-${id}`, { includeHiddenElements: true })); expect(box.getAllByText(n1, { includeHiddenElements: true }).length).toBeGreaterThan(0); expect(box.getAllByText(n2, { includeHiddenElements: true }).length).toBeGreaterThan(0);
    }
  });
});

describe('strażnik: każdy pasek okresu 2 ma prążki', () => {
  const files = (d: string): string[] => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(path.join(d, e.name)) : /\.tsx$/.test(e.name) ? [path.join(d, e.name)] : []);
  test('w app/ i components/ żaden <SegBar> nie ma testID „…prev…” (poprzedni okres rysuje HatchBar)', () => {
    const root = path.join(__dirname, '..'); const bad: string[] = [];
    for (const f of [...files(path.join(root, 'app')), ...files(path.join(root, 'components'))]) {
      const src = fs.readFileSync(f, 'utf8'); for (const m of src.matchAll(/<SegBar\b[^>]*testID=\{?[`'"][^`'"]*prev[^>]*>/g)) bad.push(`${path.relative(root, f)}: ${m[0].slice(0, 90)}`);
    }
    expect(bad).toEqual([]);
  });
});
