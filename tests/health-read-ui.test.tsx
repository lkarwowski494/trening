/*
 * 0.16.0, odczyt z Apple Health — EKRANY (docs/29 rozdz. 6, 7, 12 pkt 2; decyzje właściciela 12.10.2026): Ustawienia (przełącznik odczytu, zgoda, alerty, notatka),
 * panel dnia (kroki + „Inna aktywność · 32 min · 5,2 km”, stany: wyłączony / ładowanie / brak danych / dane / przyszłość), linia pod „Ten tydzień” (ŚREDNIA dzienna kroków
 * z 7 dni + liczba innych aktywności), szczegóły sesji (tętno śr./maks., aktywne kcal), tekst usuwania sesji z „watch”, VoiceOver, EN, ciemny wygląd, restart.
 * Makieta biblioteki: tests/health-world.ts (kontrakt 16.x). Rodzaje (docs/20): ekran, scenariusz, języki i wygląd. E2E: .maestro/20 (Ustawienia i stan wyłączony);
 * ścieżki z danymi — poza E2E z powodem w docs/09 (CI nie steruje danymi Zdrowia).
 */
import * as store from '@/lib/store';
import { applyLang } from '@/lib/i18n';
import { HEALTH_READ_TYPES } from '@/lib/healthRead';
import { fresh, saved, addWorkout, pressAlert } from './helpers';
import { renderApp, flushAll, screen, tap, act, swipeDelete, fireEvent } from './app';
import { hkWorld, watchStrength, watchOther, at, type World } from './health-world';

const NOW = new Date(2026, 9, 14, 12, 0); /* środa; poniedziałek tygodnia 12.10 */
const S = () => store.getState();
let W: World;
afterEach(() => { applyLang('pl'); jest.restoreAllMocks(); });
const settle = async () => { for (let i = 0; i < 8; i++) await flushAll(10); };
const sess = (start: number, minutes = 60) => { const w = addWorkout(start, [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Push A'); w.finishedAt = start + minutes * 60e3; return w; };
/** Start aplikacji z gotowym światem Zdrowia (fn dokłada dane i sesje przed startem). */
async function boot(fn: (w: World) => void = () => {}, opts: { read?: boolean; url?: string; locale?: 'pl' | 'en'; theme?: 'dark' } = {}) {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, opts.locale ?? 'pl'); W = hkWorld(); if (opts.read !== false) S().settings.healthRead = true; if (opts.theme) S().settings.theme = opts.theme; fn(W);
  store.save(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: opts.locale ?? 'pl', url: opts.url ?? '/' }); jest.setSystemTime(NOW.getTime()); await settle();
}
const openDay = async (key: string) => { await tap(screen.getByTestId(`cal-${key}`)); await settle(); };
const sw = async (label: RegExp | string, v: boolean) => { await act(async () => { fireEvent(screen.getByLabelText(label), 'valueChange', v); }); await settle(); };
const steps = (n: number) => `Kroki: ${n.toLocaleString('pl-PL')}`;

describe('Ustawienia: przełącznik odczytu', () => {
  test('domyślnie wyłączony, z opisem; bez notatki o cofnięciu zgody; żadne zapytanie do Zdrowia przy samym otwarciu (kryterium 1)', async () => {
    await boot(undefined, { read: false, url: '/more/settings' });
    expect(screen.getByText('Pokazuj dane z Apple Health')).toBeTruthy(); expect(screen.getByText('Kroki, inne aktywności oraz tętno i kcal z zegarka — tylko do wglądu, dane zostają w Zdrowiu.')).toBeTruthy();
    expect(screen.queryByTestId('health-read-note')).toBeNull(); expect(S().settings.healthRead).toBeUndefined();
    for (const k of ['requestAuthorization', 'queryWorkoutSamples', 'queryStatisticsCollectionForQuantity', 'deleteObjects']) expect(W.spies[k]).not.toHaveBeenCalled();
  });
  test('włączenie: arkusz zgody z typami z HEALTH_READ_TYPES (zapisu nie dotyka), pole zapisane, komunikat „Gotowe”, notatka o cofnięciu zgody', async () => {
    await boot(undefined, { read: false, url: '/more/settings' });
    await sw(/^Pokazuj dane z Apple Health/, true);
    expect(W.spies.requestAuthorization).toHaveBeenCalledWith({ toRead: HEALTH_READ_TYPES, toShare: [] }); expect(S().settings.healthRead).toBe(true);
    const a = global.__alerts.find(x => x.title === 'Gotowe')!; expect(a.msg).toBe('Jeśli dane się nie pokażą, sprawdź dostęp w aplikacji Zdrowie: profil → Aplikacje → Trening.');
    expect(screen.getByText('Zgodę cofniesz w aplikacji Zdrowie: profil → Aplikacje → Trening.')).toBeTruthy();
    await store.flush(); expect(JSON.parse(global.__kv.get('state')!).settings.healthRead).toBe(true);
  });
  test('HealthKit niedostępny → alert „Apple Health niedostępne”, przełącznik zostaje wyłączony, bez notatki', async () => {
    await boot(w => { w.available = false; }, { read: false, url: '/more/settings' });
    await sw(/^Pokazuj dane z Apple Health/, true);
    expect(global.__alerts.find(x => x.title === 'Apple Health niedostępne')!.msg).toBe('Apple Health nie jest dostępne na tym urządzeniu.'); expect(S().settings.healthRead).toBeUndefined(); expect(screen.queryByTestId('health-read-note')).toBeNull();
  });
  test('prośba nieobsłużona → „Nie udało się”, pole bez zmian', async () => {
    await boot(w => { w.spies.requestAuthorization.mockImplementation((async () => false) as any); }, { read: false, url: '/more/settings' });
    await sw(/^Pokazuj dane z Apple Health/, true); expect(global.__alerts.find(x => x.title === 'Nie udało się włączyć Apple Health')!.msg).toBe('Spróbuj ponownie.'); expect(S().settings.healthRead).toBeUndefined();
  });
  test('wyłączenie: pole znika, aplikacja przestaje pytać Zdrowie, zgoda w iOS nie jest ruszana; ustawienie przeżywa restart', async () => {
    await boot(undefined, { url: '/more/settings' }); expect(screen.getByTestId('health-read-note')).toBeTruthy();
    await sw(/^Pokazuj dane z Apple Health/, false); expect(S().settings.healthRead).toBeUndefined(); expect(screen.queryByTestId('health-read-note')).toBeNull(); expect(W.spies.requestAuthorization).not.toHaveBeenCalled();
    await sw(/^Pokazuj dane z Apple Health/, true); await store.flush(); await renderApp({ saved: JSON.parse(global.__kv.get('state')!), url: '/more/settings' }); jest.setSystemTime(NOW.getTime()); await settle();
    expect(S().settings.healthRead).toBe(true); expect(screen.getByTestId('health-read-note')).toBeTruthy();
  });
  test('odczyt i zapis to dwa niezależne przełączniki: włączenie odczytu nie włącza zapisu', async () => {
    await boot(undefined, { read: false, url: '/more/settings' }); await sw(/^Pokazuj dane z Apple Health/, true); expect([S().settings.healthRead, S().settings.healthSync]).toEqual([true, false]);
  });
  test('angielski: etykieta, opis i notatka', async () => {
    await boot(undefined, { url: '/more/settings', locale: 'en' });
    expect(screen.getByText('Show data from Apple Health')).toBeTruthy(); expect(screen.getByText('Steps, other activities, and heart rate and kcal from your watch — view only, the data stays in Health.')).toBeTruthy();
    expect(screen.getByText('You can revoke access in the Health app: profile → Apps → Training.')).toBeTruthy();
  });
});

describe('panel dnia', () => {
  test('odczyt wyłączony → bez bloku i bez zapytań (ekran jak dotąd)', async () => {
    await boot(w => { w.steps['2026-10-10'] = 8000; }, { read: false, url: '/history' }); await openDay('2026-10-10');
    expect(screen.getByTestId('day-panel')).toBeTruthy(); expect(screen.queryByTestId('health-day')).toBeNull(); expect(screen.queryByTestId('health-day-empty')).toBeNull(); expect(screen.queryByText('Apple Health…')).toBeNull();
    expect(W.spies.queryWorkoutSamples).not.toHaveBeenCalled(); expect(W.spies.queryStatisticsCollectionForQuantity).not.toHaveBeenCalled();
  });
  test('minione dni: kroki + inne aktywności (bieg z dystansem, spacer); bez nazw rodzajów (P8) i bez nazw urządzeń', async () => {
    await boot(w => { w.steps['2026-10-10'] = 8432; w.workouts.push(watchOther(at('2026-10-10', 7), 32), watchOther(at('2026-10-10', 17), 45, { type: 52, distanceM: null })); }, { url: '/history' }); await openDay('2026-10-10');
    expect(screen.getByTestId('health-day')).toBeTruthy(); expect(screen.getByText('Apple Health')).toBeTruthy(); expect(screen.getByText(steps(8432))).toBeTruthy();
    expect(screen.getByText('Inna aktywność · 32 min · 5,2 km')).toBeTruthy(); expect(screen.getByText('Inna aktywność · 45 min')).toBeTruthy();
    expect(screen.queryByText(/Bieg|Spacer|Watch|zegarek/i)).toBeNull();
  });
  test('VoiceOver: blok jako jeden element z jednostkami słownie', async () => {
    await boot(w => { w.steps['2026-10-10'] = 8432; w.workouts.push(watchOther(at('2026-10-10', 7), 32)); }, { url: '/history' }); await openDay('2026-10-10');
    expect(screen.getByTestId('health-day').props.accessibilityLabel).toBe(`Apple Health: kroki ${(8432).toLocaleString('pl-PL')}; inna aktywność, 32 minuty, 5,2 km`); expect(screen.getByTestId('health-day').props.accessible).toBe(true);
  });
  test('brak danych (albo odmowa — nie do odróżnienia): jedna neutralna linia z drogą do zgody, bez alertu i bez słowa „odmówiono”', async () => {
    await boot(undefined, { url: '/history' }); await openDay('2026-10-10');
    expect(screen.getByText('Brak danych z Apple Health dla tego dnia. Jeśli dane powinny być, sprawdź dostęp w aplikacji Zdrowie: profil → Aplikacje → Trening.')).toBeTruthy(); expect(screen.queryByTestId('health-day')).toBeNull(); expect(screen.queryByText(/odmów/i)).toBeNull(); expect(global.__alerts).toHaveLength(0);
  });
  test('dane częściowe: same kroki albo same aktywności — pokazujemy to, co jest', async () => {
    await boot(w => { w.steps['2026-10-10'] = 5000; w.workouts.push(watchOther(at('2026-10-11', 8), 20)); }, { url: '/history' }); await openDay('2026-10-10'); expect(screen.getByText(steps(5000))).toBeTruthy(); expect(screen.queryByText(/^Inna aktywność/)).toBeNull();
    await openDay('2026-10-11'); expect(screen.getByText('Inna aktywność · 20 min · 5,2 km')).toBeTruthy(); expect(screen.queryByText(/^Kroki:/)).toBeNull();
  });
  test('B14: „Kroki: 0” tylko w dniu minionym z innymi danymi; sam brak kroków albo zero bez aktywności = stan pusty', async () => {
    await boot(w => { w.steps['2026-10-10'] = 0; w.steps['2026-10-11'] = 0; w.workouts.push(watchOther(at('2026-10-10', 8), 20)); }, { url: '/history' });
    await openDay('2026-10-10'); expect(screen.getByText('Kroki: 0')).toBeTruthy(); await openDay('2026-10-11'); expect(screen.queryByText('Kroki: 0')).toBeNull(); expect(screen.getByTestId('health-day-empty')).toBeTruthy();
  });
  test('dzisiejszy dzień pokazuje kroki do tej pory; dzień przyszły — bez bloku i bez zapytania', async () => {
    await boot(w => { w.steps['2026-10-14'] = 3210; }, { url: '/history' }); await openDay('2026-10-14'); expect(screen.getByText(steps(3210))).toBeTruthy();
    const n = W.spies.queryStatisticsCollectionForQuantity.mock.calls.length; await openDay('2026-10-16'); expect(screen.queryByTestId('health-day')).toBeNull(); expect(screen.queryByTestId('health-day-empty')).toBeNull(); expect(W.spies.queryStatisticsCollectionForQuantity.mock.calls.length).toBe(n);
  });
  test('ładowanie: zarezerwowana linia „Apple Health…”, potem wartości', async () => {
    await boot(w => { w.steps['2026-10-10'] = 8000; }, { url: '/history' }); let release: () => void = () => {}; const gate = new Promise<void>(r => { release = r; });
    const orig = W.spies.queryStatisticsCollectionForQuantity.getMockImplementation()!; W.spies.queryStatisticsCollectionForQuantity.mockImplementation((async (...a: any[]) => { await gate; return orig(...a); }) as any);
    await tap(screen.getByTestId('cal-2026-10-10')); await flushAll(10); expect(screen.getByText('Apple Health…')).toBeTruthy(); expect(screen.queryByText(steps(8000))).toBeNull();
    release(); await settle(); expect(screen.queryByText('Apple Health…')).toBeNull(); expect(screen.getByText(steps(8000))).toBeTruthy();
  });
  test('błąd zapytań = jak brak danych, bez alertu', async () => {
    await boot(w => { w.fail.steps = true; w.fail.workouts = true; }, { url: '/history' }); await openDay('2026-10-10'); expect(screen.getByTestId('health-day-empty')).toBeTruthy(); expect(global.__alerts).toHaveLength(0);
  });
  test('aktywność dopasowana do sesji z zegarka nie jest „inną aktywnością”; własne wpisy aplikacji też nie', async () => {
    await boot(w => { const s = sess(at('2026-10-10', 18)); w.workouts.push(watchStrength(at('2026-10-10', 18, 5), 50), { uuid: 'own', start: s.startedAt, end: s.finishedAt!, type: 50, bundle: 'com.test.trening', syncId: s.id }, watchOther(at('2026-10-10', 7), 32)); }, { url: '/history' });
    await openDay('2026-10-10'); expect(screen.getAllByText(/^Inna aktywność/)).toHaveLength(1);
  });
  test('angielski i ciemny wygląd: te same linie, bez polskich napisów', async () => {
    await boot(w => { w.steps['2026-10-10'] = 8432; w.workouts.push(watchOther(at('2026-10-10', 7), 32)); }, { url: '/history', locale: 'en', theme: 'dark' }); await openDay('2026-10-10');
    expect(screen.getByText('Other activity · 32 min · 5.2 km')).toBeTruthy(); expect(screen.getByText(/^Steps: 8[,\s]?432$/)).toBeTruthy(); expect(screen.getByTestId('health-day').props.accessibilityLabel).toMatch(/^Apple Health: steps 8[,\s]?432; other activity, 32 minutes, 5\.2 km$/);
  });
});

describe('„Ten tydzień”: linia Apple Health', () => {
  const week = (w: World) => { addWorkout(at('2026-10-13', 18), [['Back Squat', [{ weight: 100, reps: 5 }]]]); for (let d = 7; d <= 13; d++) w.steps[`2026-10-${String(d).padStart(2, '0')}`] = d * 1000; w.steps['2026-10-14'] = 123; };
  test('średnia dzienna kroków z ostatnich 7 pełnych dni (NIE suma) + liczba innych aktywności bieżącego tygodnia', async () => {
    await boot(w => { week(w); w.workouts.push(watchOther(at('2026-10-12', 8), 30), watchOther(at('2026-10-14', 7), 30), watchOther(at('2026-10-11', 8), 30)); });
    expect(screen.getByTestId('week-health')).toBeTruthy(); expect(screen.getByText(`Apple Health: Kroki dziennie (średnia z 7 dni): ${(10000).toLocaleString('pl-PL')} · 2 inne aktywności w tym tygodniu`)).toBeTruthy();
    expect(screen.queryByText(new RegExp((70000).toLocaleString('pl-PL')))).toBeNull(); /* suma tygodnia nie jest pokazywana */
  });
  test('same kroki (bez aktywności) i same aktywności; brak danych — linia znika (bez „Brak danych”)', async () => {
    await boot(week); expect(screen.getByText(`Apple Health: Kroki dziennie (średnia z 7 dni): ${(10000).toLocaleString('pl-PL')}`)).toBeTruthy();
    await boot(w => { addWorkout(at('2026-10-13', 18), [['Back Squat', [{ weight: 100, reps: 5 }]]]); w.workouts.push(watchOther(at('2026-10-13', 8), 30)); }); expect(screen.getByText('Apple Health: 1 inna aktywność w tym tygodniu')).toBeTruthy();
    await boot(w => { addWorkout(at('2026-10-13', 18), [['Back Squat', [{ weight: 100, reps: 5 }]]]); }); expect(screen.queryByTestId('week-health')).toBeNull(); expect(screen.queryByText(/^Apple Health/)).toBeNull();
  });
  test('odczyt wyłączony → bez linii i bez zapytań; błąd zapytań → linia znika', async () => {
    await boot(week, { read: false }); expect(screen.queryByTestId('week-health')).toBeNull(); expect(W.spies.queryStatisticsCollectionForQuantity).not.toHaveBeenCalled();
    await boot(w => { week(w); w.fail.steps = true; w.fail.workouts = true; }); expect(screen.queryByTestId('week-health')).toBeNull();
  });
  test('angielski', async () => {
    await boot(w => { week(w); w.workouts.push(watchOther(at('2026-10-12', 8), 30), watchOther(at('2026-10-13', 8), 30)); }, { locale: 'en' });
    expect(screen.getByText(/^Apple Health: Steps per day \(average of 7 days\): 10[,\s]?000 · 2 other activities this week$/)).toBeTruthy();
  });
});

describe('szczegóły sesji', () => {
  const detail = async (fn: (w: World, s: ReturnType<typeof sess>) => void, opts: any = {}) => { let id = ''; await boot((w) => { const s = sess(at('2026-10-10', 18)); id = s.id; fn(w, s); }, opts); await store.flush(); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: opts.locale ?? 'pl', url: `/history/${id}` }); jest.setSystemTime(NOW.getTime()); await settle(); return id; };
  test('dopasowany trening z zegarka: tętno śr./maks. i aktywne kcal; czas sesji z aplikacji (czasu z zegarka nie ma)', async () => {
    await detail(w => { w.workouts.push(watchStrength(at('2026-10-10', 18, 3), 50, { hr: { avg: 128, max: 161 }, kcal: 312 })); });
    expect(screen.getByText('Apple Health (zegarek): tętno śr. 128 /min, maks. 161 /min · 312 kcal aktywne')).toBeTruthy();
    expect(screen.getByTestId('session-health').findByProps({ accessibilityLabel: 'Z zegarka: tętno średnie 128 na minutę, maksymalne 161; 312 kilokalorii aktywnych' })).toBeTruthy();
  });
  test('bez zegarka (normalny przypadek) i bez wartości: nic, także po załadowaniu; odczyt wyłączony: nic i zero zapytań', async () => {
    await detail(() => {}); expect(screen.queryByTestId('session-health')).toBeNull(); expect(screen.queryByText('Apple Health…')).toBeNull();
    await detail(w => { w.workouts.push(watchStrength(at('2026-10-10', 18, 3), 50, { hr: undefined, kcal: undefined })); }); expect(screen.queryByTestId('session-health')).toBeNull();
    await detail(w => { w.workouts.push(watchStrength(at('2026-10-10', 18, 3), 50)); }, { read: false }); expect(screen.queryByTestId('session-health')).toBeNull(); expect(W.spies.queryWorkoutSamples).not.toHaveBeenCalled();
  });
  test('ładowanie: zarezerwowana linia „Apple Health…”, potem wartości', async () => {
    let id = ''; await boot(w => { const s = sess(at('2026-10-10', 18)); id = s.id; w.workouts.push(watchStrength(at('2026-10-10', 18, 3), 50)); }); await store.flush();
    let release: () => void = () => {}; const gate = new Promise<void>(r => { release = r; }); const orig = W.spies.queryWorkoutSamples.getMockImplementation()!; W.spies.queryWorkoutSamples.mockImplementation((async (...a: any[]) => { await gate; return orig(...a); }) as any);
    await renderApp({ saved: JSON.parse(global.__kv.get('state')!), url: `/history/${id}` }); jest.setSystemTime(NOW.getTime()); W.spies.queryWorkoutSamples.mockImplementation((async (...a: any[]) => { await gate; return orig(...a); }) as any); await flushAll(10);
    expect(screen.getByText('Apple Health…')).toBeTruthy(); release(); await settle(); expect(screen.queryByText('Apple Health…')).toBeNull(); expect(screen.getByTestId('session-health')).toBeTruthy();
  });
  test('angielski: „Apple Health (watch): avg. heart rate …”', async () => {
    await detail(w => { w.workouts.push(watchStrength(at('2026-10-10', 18, 3), 50)); }, { locale: 'en' }); expect(screen.getByText('Apple Health (watch): avg. heart rate 128 /min, max 161 /min · 312 active kcal')).toBeTruthy();
  });
});

describe('lista sesji: usuwanie', () => {
  test('sesja z „watch”: „Trening z zegarka w Apple Health zostanie…”; z własną kopią — jak dotąd; bez zapisu — bez zdania', async () => {
    await boot(() => { const a = sess(at('2026-10-10', 18)); a.healthUUID = 'watch'; a.templateName = 'Watch'; const b = sess(at('2026-10-09', 18)); b.healthUUID = 'U-1'; b.templateName = 'Copy'; const c = sess(at('2026-10-08', 18)); c.templateName = 'None'; }, { url: '/history' });
    for (const [name, line] of [['Watch', 'Trening z zegarka w Apple Health zostanie — usuniesz go w aplikacji Zdrowie.'], ['Copy', 'Kopia w Apple Health zostanie — usuniesz ją w aplikacji Zdrowie.'], ['None', '']] as const) {
      global.__alerts.length = 0; await swipeDelete(new RegExp(`^Usuń sesję: ${name}, `)); const al = global.__alerts.find(x => x.title === 'Usunąć tę sesję z historii?')!; expect(al.msg).toMatch(line ? new RegExp(`${line.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) : /^[^\n]+$/);
      if (!line) expect(al.msg).not.toMatch(/Apple Health/); pressAlert('Usunąć tę sesję z historii?', 'Anuluj'); await flushAll(5);
    }
  });
});
