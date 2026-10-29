/*
 * Migracja literałów fontSize / borderRadius na tokeny (1.0.1, M1-audytor-generalny-030): dowód „wynik renderu bez zmian”.
 * Dla ekranów, które renderują Dashboard, GuardSection, PeriodSummary, RecordsCard i plan (+ stary krój F.heavy), test zbiera spłaszczone style
 * (StyleSheet.flatten) WSZYSTKICH węzłów i porównuje z odciskiem zapisanym przed migracją (tests/tokeny-odcisk.json). Zamiana literału na token
 * o identycznej wartości nie może zmienić żadnego stylu. Zmiana wyglądu z zamiarem (porównanie zrzutów po 1.0) = świadoma aktualizacja odcisku:
 * `ODCISK_ZAPIS=1 npx jest tests/tokeny-odcisk.test.tsx`.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as RN from 'react-native';
import { Appearance, StyleSheet } from 'react-native';
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { uid, type Template, type TRow } from '@/lib/seed';
import { fresh, saved, ex, addWorkout, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, tap, act, go } from './app';

jest.setTimeout(120000);
const FILE = path.join(__dirname, 'tokeny-odcisk.json');
const NOW = new Date(2026, 9, 8, 9, 0);
const at = (m: number, d: number, h = 18) => new Date(2026, m, d, h).getTime();
const sets = (n: number, weight: number, reps: number) => Array.from({ length: n }, () => ({ weight, reps }));
const row = (reps: number | '', weight: number | ''): TRow => ({ id: uid(), kind: 'normal', reps, weight, durationSec: '', distanceM: '' });
function tpl(name: string, ...blocks: [string, TRow[]][]): Template {
  const t = store.newTemplate(); t.name = name;
  t.items = blocks.map(([n, rows]) => ({ id: uid(), exerciseId: ex(n).id, sets: rows.length, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null, rows }));
  store.save(); return t;
}
const setPlan = (days: Record<number, Template>) => { jest.setSystemTime(at(9, 5, 6)); for (const [i, t] of Object.entries(days)) plan.setWeekDay(Number(i), t.id); jest.setSystemTime(NOW.getTime()); };
const SQ = 'Back Squat'; const BP = 'Bench Press (sztanga)'; const LC = 'Leg Curl'; const HA = 'Hip Adduction';
const mixed = () => {
  addWorkout(at(9, 1), [[SQ, sets(3, 100, 5)]], 'p1'); addWorkout(at(9, 2), [[BP, sets(3, 60, 8)]], 'p2');
  addWorkout(at(9, 6), [[SQ, sets(3, 80, 5)], [BP, sets(3, 70, 8)], [LC, sets(2, 40, 10)]], 'c');
  setPlan({ 3: tpl('A', [LC, [row(10, 40), row(10, 40)]]) });
};
const makieta = () => {
  addWorkout(at(9, 1), [['Leg Extension', sets(10, 40, 10)]], 'p'); addWorkout(at(9, 6), [['Leg Extension', sets(10, 50, 10)], ['Hip Thrust (sztanga)', sets(10, 80, 8)], [LC, sets(1, 40, 10)], [HA, sets(2, 30, 10)], [SQ, sets(1, 100, 5)]], 'c');
  setPlan({ 3: tpl('A', [LC, [row(10, 40), row(10, 40)]]), 5: tpl('B', [HA, [row(10, 30), row(10, 30)]]) });
};
let prId = '';
const prs = () => { addWorkout(at(9, 1), [[SQ, sets(2, 100, 5)]], 'p'); prId = addWorkout(at(9, 3), [[SQ, [{ weight: 100, reps: 5 }, { weight: 110, reps: 5 }]], [BP, sets(2, 60, 8)]], 'r').id; };

let scheme: 'light' | 'dark' = 'light';
beforeEach(() => {
  jest.spyOn(Appearance, 'setColorScheme').mockImplementation(((v: string | null | undefined) => { scheme = v === 'dark' ? 'dark' : 'light'; }) as never);
  jest.spyOn(RN, 'useColorScheme').mockImplementation((() => scheme) as never);
});
afterEach(() => { jest.restoreAllMocks(); scheme = 'light'; });
const boot = async (fn: () => void, url: string, theme: 'light' | 'dark' = 'light') => {
  jest.useFakeTimers({ now: NOW }); await fresh(); fn(); store.getState().settings.theme = theme; scheme = theme; store.saveCfg();
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
};

type N = { type: string; props?: Record<string, unknown>; children?: unknown[] | null };
const textOf = (x: unknown): string => typeof x === 'string' ? x : x && typeof x === 'object' && 'children' in (x as N) ? ((x as N).children ?? []).map(textOf).join('') : '';
/** Odcisk: lista [typ, testID, początek tekstu, spłaszczony styl] wszystkich węzłów drzewa renderu, w kolejności dokumentu. */
function fingerprint(): string[] {
  const out: string[] = [];
  const walk = (n: unknown) => {
    if (!n || typeof n !== 'object') return; const node = n as N;
    const style = StyleSheet.flatten(node.props?.style as never) ?? {};
    out.push(JSON.stringify([node.type, node.props?.testID ?? '', textOf(node).slice(0, 24), style]));
    for (const c of node.children ?? []) walk(c);
  };
  const j = screen.toJSON() as unknown; for (const r of Array.isArray(j) ? j : [j]) walk(r);
  return out;
}
const expandAll = async () => {
  const rows = screen.UNSAFE_root.findAll((n: { type: unknown; props: { testID?: string } }) => typeof n.type === 'string' && /^grow-/.test(n.props.testID ?? ''));
  for (const r of rows) { const b = r.findAll((n: { props: { accessibilityRole?: string } }) => n.props.accessibilityRole === 'button')[0]; if (b) await tap(b); }
  await flushAll(5);
};
const moreGuard = async () => { const m = screen.queryByTestId('guard-more'); if (m) { await tap(m); await flushAll(10); } };

const SCENARIA: [string, () => void, string, 'light' | 'dark', (() => Promise<void>)?][] = [
  ['dashboard-nowa-osoba', () => {}, '/', 'light'],
  ['dashboard-pierwsze-kroki-szablon', () => { withDemoTemplates(); }, '/', 'light'],
  ['dashboard-dane-jasny', mixed, '/', 'light'],
  ['dashboard-dane-ciemny', mixed, '/', 'dark'],
  ['postepy-straznik-rozwiniety-jasny', mixed, '/progress', 'light', async () => { await moreGuard(); await expandAll(); }],
  ['postepy-straznik-makieta-ciemny', makieta, '/progress', 'dark', async () => { await moreGuard(); await expandAll(); }],
  ['postepy-straznik-makieta-jasny', makieta, '/progress', 'light', async () => { await moreGuard(); await expandAll(); }],
  ['plan-tygodnia', () => { const t = withDemoTemplates(); plan.setWeekDay(0, t[0].id); mixed(); }, '/plan', 'light'],
  ['plan-tygodnia-ciemny', () => { const t = withDemoTemplates(); plan.setWeekDay(0, t[0].id); mixed(); }, '/plan', 'dark'],
];

describe('odcisk stylów (migracja na tokeny nie zmienia renderu)', () => {
  const zapis = process.env.ODCISK_ZAPIS === '1';
  const stored: Record<string, string[]> = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : {};
  const nowe: Record<string, string[]> = {};
  afterAll(() => { if (zapis) fs.writeFileSync(FILE, JSON.stringify({ ...stored, ...nowe }).replace(/\],"/g, '],\n"') + '\n'); });
  const porownaj = (name: string, fp: string[]) => {
    expect(fp.length).toBeGreaterThan(20); nowe[name] = fp;
    if (!zapis) { expect(stored[name]).toBeDefined(); expect(fp).toEqual(stored[name]); }
  };

  test.each(SCENARIA.map(s => [s[0]]))('%s', async name => {
    const [, fn, url, theme, after] = SCENARIA.find(s => s[0] === name)!;
    await boot(fn, url, theme); if (after) await after();
    porownaj(name, fingerprint());
  });
  test('historia-rekordy: szczegóły treningu z kartą rekordów', async () => {
    await boot(prs, '/');
    await go(`/history/${prId}`); await flushAll(10);
    expect(screen.queryByTestId('record-banner')).toBeTruthy();
    porownaj('historia-rekordy', fingerprint());
  });
});
