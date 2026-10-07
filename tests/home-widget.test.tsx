/*
 * Widżet na ekran główny (docs/21 pkt 4a; decyzja właściciela 07.10.2026 wieczór „wdrażaj wszystko oprócz Health”): „W tym tygodniu:
 * N treningów, M serii” i „Ostatni trening: nazwa, data” — same liczby z danych użytkownika (bez ocen i zaleceń). Aplikacja liczy
 * podsumowanie (lib/widget.ts) i zapisuje je we wspólnej grupie aplikacji (App Group, ExtensionStorage z @bacons/apple-targets);
 * widżet (targets/rest-widget/SummaryWidget.swift) tylko je pokazuje. Rodzaje (docs/20): logika (tydzień od poniedziałku jak
 * w statystykach i kalendarzu, serie robocze jak w historii), dane (format JSON wspólny z Swift), języki (teksty w języku aplikacji),
 * spójność JS ↔ Swift (grupa, klucz, rodzaj widżetu, pola). Wygląd widżetu — tylko na telefonie (Maestro nie steruje ekranem głównym).
 */
import * as fs from 'fs';
import * as path from 'path';
import * as store from '@/lib/store';
import { applyLang } from '@/lib/i18n';
import { thisMonday } from '@/lib/stats';
import { widgetSummary, pushWidget, WIDGET } from '@/lib/widget';
import { fresh, addWorkout } from './helpers';
import { renderApp, flushAll, act } from './app';

const root = path.join(__dirname, '..'); const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');
const NOW = new Date(2026, 9, 7, 18, 0).getTime(); /* środa */
beforeEach(async () => { await fresh(); (global as any).__widget = []; });
afterEach(() => { applyLang('pl'); });

describe('logika (lib/widget.ts)', () => {
  test('tydzień od poniedziałku: treningi i serie robocze (bez rozgrzewek) tego tygodnia; ostatni trening — najnowszy', () => {
    addWorkout(new Date(2026, 9, 4, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]); /* niedziela — poprzedni tydzień */
    const a = addWorkout(new Date(2026, 9, 5, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }]]]); a.templateName = 'Push A';
    const b = addWorkout(new Date(2026, 9, 7, 8).getTime(), [['Plank', [{ durationSec: 60 }]]]); b.templateName = 'Core'; b.exercises[0].sets.push({ ...b.exercises[0].sets[0], id: 'w', kind: 'warmup' } as never);
    const s = widgetSummary(NOW);
    expect([s.weekStart, s.weekEnd]).toEqual([thisMonday(0, new Date(NOW)), thisMonday(1, new Date(NOW))]);
    expect([s.workouts, s.sets]).toEqual([2, 3]); expect(s.lastName).toBe('Core'); expect(s.lastAt).toBe(b.startedAt);
    expect(s.text).toMatchObject({ workouts: '2 treningi', sets: '3 serie', zeroWorkouts: '0 treningów', zeroSets: '0 serii', week: 'W tym tygodniu', last: 'Ostatni trening', none: 'Jeszcze bez treningu' });
    expect(s.text.lastDate).toBe(store.fmtDate(b.startedAt));
  });
  test('bez treningów: zera, bez ostatniego; trening w toku się nie liczy', () => {
    store.startEmpty(); const s = widgetSummary(NOW); expect([s.workouts, s.sets, s.lastName, s.lastAt]).toEqual([0, 0, '', 0]); expect(s.text.lastDate).toBe('');
  });
  test('English', () => {
    applyLang('en'); addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    expect(widgetSummary(NOW).text).toMatchObject({ workouts: '1 workout', sets: '1 set', week: 'This week', last: 'Last workout', none: 'No workout yet' });
  });
});

describe('dane: zapis do grupy aplikacji', () => {
  test('pushWidget zapisuje JSON pod kluczem w grupie i odświeża widżet; ten sam stan — bez ponownego zapisu', () => {
    addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    pushWidget(NOW); const w = (global as any).__widget as any[];
    expect(w[0]).toEqual(['set', WIDGET.group, WIDGET.key, expect.any(String)]); expect(JSON.parse(w[0][3])).toMatchObject({ v: 1, workouts: 1 }); expect(w[1]).toEqual(['reload', WIDGET.kind]);
    pushWidget(NOW); expect(w).toHaveLength(2);
  });
  test('aplikacja wysyła podsumowanie po starcie i po zmianie historii (zakończony trening)', async () => {
    await renderApp(); await flushAll(10); const n0 = (global as any).__widget.filter((x: any[]) => x[0] === 'set').length; expect(n0).toBeGreaterThan(0);
    await act(async () => { addWorkout(Date.now() - 3600e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]); store.refreshViews(); }); await flushAll(10);
    const sets = (global as any).__widget.filter((x: any[]) => x[0] === 'set'); expect(sets.length).toBeGreaterThan(n0); expect(JSON.parse(sets.at(-1)[3]).lastAt).toBeGreaterThan(0);
  });
});

describe('spójność JS ↔ Swift i konfiguracja', () => {
  test('grupa aplikacji w app.json i w widżecie; klucz i rodzaj widżetu w Swift; pola JSON odczytywane w Swift', () => {
    const app = JSON.parse(read('app.json')).expo; expect(app.ios.entitlements['com.apple.security.application-groups']).toEqual([WIDGET.group]);
    const cfg = read('targets/rest-widget/expo-target.config.js'); expect(cfg).toMatch(/application-groups/);
    const sw = read('targets/rest-widget/SummaryWidget.swift'); expect(sw).toContain(`"${WIDGET.group}"`); expect(sw).toContain(`"${WIDGET.key}"`); expect(sw).toContain(`"${WIDGET.kind}"`);
    for (const f of ['v', 'weekEnd', 'workouts', 'sets', 'lastName', 'lastAt', 'text']) expect(sw).toMatch(new RegExp(`\\blet ${f}\\b`));
    expect(read('targets/rest-widget/RestWidgetBundle.swift')).toMatch(/SummaryWidget\(\)/);
  });
});
