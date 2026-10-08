/*
 * Znacznik „10 serii na partię tygodniowo” przy „Serie per partia — ten tydzień vs poprzedni” (pakiet C, 08.10.2026).
 * Źródło: ACSM Position Stand 2026 (Currier i in., MSSE 58(4); pełny tekst PMC12965823, „Improving hypertrophy”): „hypertrophy was enhanced
 * by … higher volume (≥10 sets/muscle group/wk)” oraz „Compared with CTRL, hypertrophy was improved by RT” — opis nie mówi, że mniej nie działa.
 * Rodzaje (docs/20): logika (liczba w jednym miejscu), ekran (kreska w skali, VoiceOver, opis ze źródłem, tylko przy seriach), języki (EN).
 * E2E: .maestro/05 (Postępy — przewinięcie do opisu kreski).
 */
import * as fs from 'fs';
import * as path from 'path';
import * as store from '@/lib/store';
import { applyLang } from '@/lib/i18n';
import { WEEKLY_SETS_MARK } from '@/lib/stats';
import { fresh, addWorkout, saved } from './helpers';
import { renderApp, flushAll, screen, act } from './app';

const NOW = new Date(2026, 9, 8, 18, 0);
beforeEach(async () => { jest.useFakeTimers({ now: NOW }); await fresh(); });
afterEach(() => { applyLang('pl'); });
const bench = (n: number, d = 6) => addWorkout(new Date(2026, 9, d, 18).getTime(), [['Bench Press (sztanga)', Array.from({ length: n }, () => ({ weight: 80, reps: 8 }))]]);
const boot = async (fn: () => void, locale: 'pl' | 'en' = 'pl') => { await fresh(undefined, locale); fn(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url: '/more/progress' }); jest.setSystemTime(NOW.getTime()); await flushAll(10); };

test('liczba w jednym miejscu (10) ze źródłem i cytatem przy stałej', () => {
  expect(WEEKLY_SETS_MARK).toBe(10);
  const src = fs.readFileSync(path.join(__dirname, '../lib/stats.ts'), 'utf8'); expect(src).toMatch(/PMC12965823/); expect(src).toMatch(/≥10 sets\/muscle group\/wk/);
});

describe('ekran Postępy', () => {
  test('12 serii klatki: VoiceOver „co najmniej 10”; kreska w połowie skali przy 20; opis ze źródłem', async () => {
    await boot(() => { bench(12); });
    expect(screen.getByLabelText(/^klatka: 12 \(poprz\. 0\), co najmniej 10$/)).toBeTruthy();
    expect(screen.getByLabelText(/^triceps: 6 \(poprz\. 0\)$/)).toBeTruthy(); /* pomocnicza 0,5 × 12 — poniżej kreski, bez dopisku */
    expect(screen.getByText('Kreska = 10 serii na partię w tygodniu. Stanowisko ACSM 2026: przy co najmniej 10 seriach na partię tygodniowo przyrost mięśni był większy niż przy mniejszej objętości; każdy trening siłowy daje przyrost w porównaniu z brakiem treningu. Uproszczenie: serie pomocnicze liczymy po 0,5.')).toBeTruthy();
    await boot(() => { bench(20); }); expect(screen.getByTestId('mark-klatka').props.style.left).toBe('50%');
  });
  test('mała objętość: skala obejmuje kreskę (widoczna na końcu paska); kreski tylko przy seriach, nie przy objętości', async () => {
    await boot(() => { bench(2); });
    expect(screen.getByTestId('mark-klatka').props.style.left).toBe('100%');
    const marks = screen.UNSAFE_root.findAll((n: any) => typeof n.props?.testID === 'string' && n.props.testID.startsWith('mark-') && typeof n.type === 'string');
    expect(marks.map((n: any) => n.props.testID).sort()).toEqual(['mark-barki', 'mark-klatka', 'mark-triceps']);
  });
  test('English', async () => {
    await boot(() => { bench(12); }, 'en');
    expect(screen.getByLabelText(/^chest: 12 \(prev\. 0\), at least 10$/)).toBeTruthy();
    expect(screen.getByText(/^Line = 10 sets per muscle group per week\. ACSM 2026 position stand/)).toBeTruthy();
  });
});
