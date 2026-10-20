/*
 * M1-audytor-generalny-025: podpis mapy mięśni w Progresji mówił „im ciemniej, tym większy wzrost” — w ciemnym motywie skala idzie odwrotnie (większy wzrost = jaśniejszy niebieski).
 * Po naprawie podpis opisuje siłę koloru (wyraźniejszy = większy wzrost) i jest prawdziwy w obu motywach; tłumaczenia we wszystkich językach bez „ciemniej”.
 */
import * as RN from 'react-native';
import * as store from '@/lib/store';
import { light, dark } from '@/lib/theme';
import { shadeColor } from '@/lib/musclemap';
import { LANGS, tIn } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';
import { fresh, addWorkout, saved } from './helpers';
import { renderApp, flushAll, screen, act } from './app';

jest.setTimeout(60000);
const OLD = 'Zaznaczone partie, w których objętość jest większa niż w okresie porównawczym; im ciemniej, tym większy wzrost. Szare — bez wzrostu.';
const NEW_PL = 'Zaznaczone partie, w których objętość jest większa niż w okresie porównawczym; im mocniejszy kolor, tym większy wzrost. Szare — bez wzrostu.';
let scheme: 'light' | 'dark' = 'light';
beforeEach(() => { scheme = 'light'; jest.restoreAllMocks(); jest.spyOn(RN, 'useColorScheme').mockImplementation((() => scheme) as never); });
const lum = (h: string) => { const c = h.slice(1).match(/../g)!.map(x => parseInt(x, 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const dist = (a: string, b: string) => Math.abs(lum(a) - lum(b));

async function progression(locale: 'pl' | 'en', sc: 'light' | 'dark') {
  scheme = sc; jest.useFakeTimers({ now: new Date(2026, 9, 8, 9, 0) }); await fresh(undefined, locale);
  addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }]]], 'A'); addWorkout(new Date(2026, 8, 30, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'B');
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url: '/progression' }); await flushAll(10);
}
describe('podpis mapy mięśni w Progresji', () => {
  test.each([['pl', 'light'], ['pl', 'dark'], ['en', 'light'], ['en', 'dark']] as const)('%s / %s: podpis nie odwołuje się do jasności i opisuje siłę koloru', async (lg, sc) => {
    await progression(lg, sc);
    const cap = screen.getByTestId('muscle-map').findAll((n: { type: unknown; props: { children?: unknown } }) => n.type === 'Text' && typeof n.props.children === 'string' && /w okresie porównawczym|comparison period/.test(n.props.children as string)).map((n: { props: { children: string } }) => n.props.children);
    expect(cap).toHaveLength(1);
    expect(cap[0]).toBe(lg === 'pl' ? NEW_PL : 'Highlighted muscle groups have more volume than in the comparison period; the stronger the colour, the bigger the increase. Grey — no increase.');
    expect(cap[0]).not.toMatch(/ciemni|jaśni|darker|lighter|dark|bright/i);
  });
  test('kierunek skali zgodny z podpisem w obu motywach: wyższy stopień = kolor dalej od neutralnego (line) niż niższy', () => {
    for (const th of [light, dark]) for (const [lo, hi] of [[1, 2], [2, 3], [3, 4]]) expect(dist(shadeColor(hi, th.line, th.accent), th.line)).toBeGreaterThan(dist(shadeColor(lo, th.line, th.accent), th.line));
    /* a „ciemniej” NIE jest prawdą w obu: w jasnym wyższy stopień ma niższą luminancję, w ciemnym wyższą */
    expect(lum(shadeColor(4, light.line, light.accent))).toBeLessThan(lum(shadeColor(1, light.line, light.accent)));
    expect(lum(shadeColor(4, dark.line, dark.accent))).toBeGreaterThan(lum(shadeColor(1, dark.line, dark.accent)));
  });
  test('słowniki: stary podpis („ciemniej”) usunięty ze wszystkich języków; nowy przetłumaczony w każdym', () => {
    for (const l of LANGS) { if (l === 'pl') continue; expect([l, (LOCALES as Record<string, Record<string, string>>)[l]?.[OLD]]).toEqual([l, undefined]); }
    for (const l of LANGS) { if (l === 'pl' || l === 'en' || l === 'es-419' || l === 'pt-BR') continue; expect([l, tIn(l, NEW_PL) !== NEW_PL]).toEqual([l, true]); }
  });
});
