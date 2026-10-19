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
import { renderApp, flushAll, screen, act, openInfo } from './app';

const NOW = new Date(2026, 9, 8, 18, 0);
beforeEach(async () => { jest.useFakeTimers({ now: NOW }); await fresh(); });
afterEach(() => { applyLang('pl'); });
const bench = (n: number, d = 6) => addWorkout(new Date(2026, 9, d, 18).getTime(), [['Bench Press (sztanga)', Array.from({ length: n }, () => ({ weight: 80, reps: 8 }))]]);
const boot = async (fn: () => void, locale: 'pl' | 'en' = 'pl') => { await fresh(undefined, locale); fn(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url: '/progress' }); jest.setSystemTime(NOW.getTime()); await flushAll(10); };

test('liczba w jednym miejscu (10) ze źródłem i cytatem przy stałej', () => {
  expect(WEEKLY_SETS_MARK).toBe(10);
  const src = fs.readFileSync(path.join(__dirname, '../lib/stats.ts'), 'utf8'); expect(src).toMatch(/PMC12965823/); expect(src).toMatch(/≥10 sets\/muscle group\/wk/);
});

describe('ekran Postępy', () => {
  test('12 serii klatki: VoiceOver „co najmniej 10”; kreska w połowie skali przy 20; opis ze źródłem', async () => {
    await boot(() => { bench(12); });
    expect(screen.getByLabelText(/^klatka: Ten tydzień 12, Poprzedni tydzień 0 \(brak danych\), cel 10, co najmniej 10$/)).toBeTruthy();
    expect(screen.getByLabelText(/^triceps: Ten tydzień 0 bezpośrednio, 6 pośrednio \(serie pomocnicze: 12\), Poprzedni tydzień 0 \(brak danych\), cel 10$/)).toBeTruthy(); /* pomocnicza 0,5 × 12 — poniżej kreski, bez dopisku */
    await openInfo('sets-part'); /* ⓘ 14.10.2026: akapity pod ⓘ osobno */
    for (const x of ['Kreska = cel serii na partię w tygodniu: 10 automatycznie albo Twoja liczba z Ustawień.', 'Stanowisko ACSM 2026: przy co najmniej 10 seriach na partię tygodniowo przyrost mięśni był większy niż przy mniejszej objętości; każdy trening siłowy daje przyrost w porównaniu z brakiem treningu.', 'Uproszczenie: partia pomocnicza ćwiczenia liczy się za pół serii (główna 1, pomocnicza 0,5; metaanaliza Pelland i in. 2026).', 'Uproszczenie: drop set liczy się razem z serią, po której jest.']) expect(screen.getByText(x)).toBeTruthy(); /* D3 (audyt 0.10): dopisane uproszczenie drop setu */
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
    expect(screen.getByLabelText(/^chest: This week 12, Last week 0 \(no data\), goal 10, at least 10$/)).toBeTruthy();
    await openInfo('sets-part'); expect(screen.getByText(/^Line = weekly goal of sets per muscle group: 10 automatically, or your own number from Settings\.$/)).toBeTruthy(); expect(screen.getByText(/^ACSM 2026 position stand/)).toBeTruthy(); /* ⓘ: akapity osobno */
  });
});
