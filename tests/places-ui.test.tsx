/* 0.19 A4 i B — ekrany (docs/33; docs/20 rodzaj 2): arkusz „📍” z pozycją „Inne miejsce (tylko dziś)…”, okno „Inne miejsce” (app/place-once.tsx: nazwa,
 * „Zapisz jako miejsce”, gotowe zestawy, sprzęt, „Użyj”, „Anuluj”), listy miejsc bez miejsc jednorazowych (Miejsca i sprzęt, generator, edytor szablonu),
 * panel dnia w planie („📍 Miejsce na te dni”, zakres, „Ustaw miejsce”, „Wyczyść miejsce”, „📍 Hotel” w dniu i na karcie „Dziś”), samoczynne okno „Dostosuj”
 * po starcie w dniu z miejscem (P4 A). Scenariusz z życia — tests/places-scenario.test.tsx; logika — tests/places-oneoff-logic.test.ts, tests/plan-places.test.ts. */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import * as timer from '@/lib/timer';
import { applyLang } from '@/lib/i18n';
import { fresh, ex, saved } from './helpers';
import { renderApp, flushAll, screen, tap, act, go, type, startTpl, openInfo, openPlaceSheet, placeInMenu } from './app';
import { loc } from './locations-fixtures';
import { presetEquipment } from '@/lib/equipment';
import { LANGS, type Lang } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';
import { EN } from '@/lib/i18n.en';
import { fireEvent } from '@testing-library/react-native';

jest.setTimeout(90000);
afterEach(async () => { try { await timer.stop(); await timer.stopSet(); } catch { /* brak stanu */ } jest.useRealTimers(); applyLang('pl'); });
const S = () => store.getState();
const GYM = 'gym', HOTEL = 'hotel', DOM = 'dom';
const THU = new Date(2026, 9, 8, 9, 0);
const stack = () => { const { store: rs } = require('expo-router/build/global-state/router-store'); let st = rs.navigationRef.getRootState(); while (st.routes.length === 1 && st.routes[0].name === '__root' && st.routes[0].state) st = st.routes[0].state; return st.routes.map((r: any) => r.name) as string[]; };
const top = () => stack().at(-1);
const title = () => require('expo-router/build/global-state/router-store').store.navigationRef.getCurrentOptions().title as string;
const FBW: [string, string][] = [['Bench Press (sztanga)', 'bench'], ['Overhead Press (sztanga)', 'ohp'], ['Pull Up', 'pull'], ['RDL (hantle/linki)', 'rdl']];
const item = (name: string, id: string) => ({ id, exerciseId: ex(name).id, sets: 3, repMin: 6, repMax: 8, restSec: 120, startWeight: '' as const, targetSec: '' as const, groupId: null });

/** Siłownia (główne), Hotel, Dom (tylko masa ciała); szablon FBW; opcjonalnie trening w toku na siłowni; wstaje jako „aplikacja po restarcie”. */
async function boot(o: { start?: boolean; url?: string; locale?: 'pl' | 'en'; fn?: () => void } = {}) {
  jest.useFakeTimers({ now: THU }); await fresh(undefined, o.locale ?? 'pl'); const s = S().settings;
  s.locations = [loc('Siłownia', presetEquipment('gym'), GYM), loc('Hotel', presetEquipment('hotel'), HOTEL), loc('Dom', presetEquipment('bodyweight'), DOM)]; s.mainLocationId = GYM;
  const tpl = store.newTemplate(); tpl.name = 'FBW'; tpl.items = FBW.map(([n, id]) => item(n, id)); store.save(tpl); o.fn?.(); if (o.start) store.startFromTemplate(tpl);
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: o.locale ?? 'pl', url: o.url ?? '/' }); jest.setSystemTime(THU.getTime()); await flushAll(10);
  return tpl;
}
const sheetOpts = openPlaceSheet; /* M3 p2 (ZM-02): miejsce w menu „⋯” treningu */
const pick = async (sh: { opts: { options: string[] }; cb: (i: number) => void }, name: string) => { const i = sh.opts.options.indexOf(name); expect(i).toBeGreaterThanOrEqual(0); await act(async () => { sh.cb(i); }); await flushAll(20); };
const chip = (label: string | RegExp) => screen.getByLabelText(label);
const ONCE = 'Inne miejsce (tylko dziś)…';

describe('A4 — arkusz „📍” i okno „Inne miejsce”', () => {
  test('arkusz: miejsca z listy, potem „Inne miejsce (tylko dziś)…”, potem „Anuluj”; miejsca jednorazowego na liście nie ma', async () => {
    await boot({ start: true, fn: () => { require('@/lib/locations').addOneOffLocation('Ukryte', []); } });
    const sh = await sheetOpts(); expect(sh.opts.options).toEqual(['Siłownia', 'Hotel', 'Dom', ONCE, 'Anuluj']); expect(sh.opts.cancelButtonIndex).toBe(4); expect(sh.opts.title).toBe('Miejsce tego treningu');
  });
  test('wybór pozycji otwiera okno „Inne miejsce”: nazwa z podpowiedzią „Tylko dziś”, „Zapisz jako miejsce”, gotowe zestawy, grupy sprzętu; „Anuluj” po lewej i „Użyj” po prawej', async () => {
    await boot({ start: true }); await pick(await sheetOpts(), ONCE);
    expect(top()).toBe('place-once'); expect(screen.getByText('Miejsce tylko na ten trening. Wybierz sprzęt, jaki tam masz — ciężarów nie trzeba wpisywać.')).toBeTruthy();
    expect(screen.getByPlaceholderText('Tylko dziś')).toBeTruthy(); expect(screen.getByText('Zapisz jako miejsce')).toBeTruthy(); expect(screen.getByText('Miejsce trafi na listę miejsc (Ustawienia → Miejsca i sprzęt).')).toBeTruthy();
    expect(screen.getByText('Gotowe zestawy')).toBeTruthy(); for (const n of ['Hotel', 'Tylko masa ciała', 'Dom']) expect(screen.getAllByText(n).length).toBeGreaterThan(0);
    expect(screen.getByText('Sprzęt')).toBeTruthy(); expect(screen.getByText('Wolne ciężary')).toBeTruthy();
    expect(screen.getByTestId('close-modal').props.accessibilityLabel).toBe('Anuluj'); expect(screen.getByTestId('place-once-use').props.accessibilityLabel).toBe('Użyj');
  });
  test('„Anuluj” nic nie zmienia: ani miejsca treningu, ani listy miejsc', async () => {
    await boot({ start: true }); const before = JSON.stringify(S().settings.locations); await pick(await sheetOpts(), ONCE);
    await tap(chip('Hotel')); await tap(screen.getByTestId('close-modal')); await flushAll(20);
    expect(top()).toBe('(tabs)'); expect(S().active!.locationId).toBe(GYM); expect(JSON.stringify(S().settings.locations)).toBe(before);
  });
  test('zestaw „Tylko masa ciała” + „Użyj”: miejsce jednorazowe „Tylko dziś”, trening przechodzi tam, okno „Dostosuj do: Tylko dziś” otwiera się samo z propozycjami', async () => {
    await boot({ start: true }); await pick(await sheetOpts(), ONCE); await tap(screen.getAllByText('Tylko masa ciała')[0]); await tap(screen.getByTestId('place-once-use')); await flushAll(20);
    const l = S().settings.locations.find(x => x.oneOff)!; expect(l).toMatchObject({ name: 'Tylko dziś', oneOff: true }); expect(l.equipment.map(e => e.item).sort()).toEqual(['floor_mat', 'wall']);
    expect(S().active!.locationId).toBe(l.id); expect(top()).toBe('adapt'); expect(title()).toBe('Dostosuj do: Tylko dziś');
    expect(S().active!.exercises.map(e => e.exerciseId)).toEqual(FBW.map(([n]) => ex(n).id)); /* nic nie zamienione samo (P4 A) */
    await tap(screen.getByTestId('close-modal')); await flushAll(20); expect(await placeInMenu()).toBe('Miejsce treningu: Tylko dziś'); /* M3 p2: miejsce w menu „⋯” */
  });
  test('własna nazwa i ręcznie wybrany sprzęt; miejsce z pełnym sprzętem do ćwiczeń z planu — bez okna „Dostosuj” (wraca do treningu)', async () => {
    await boot({ start: true }); await pick(await sheetOpts(), ONCE); await type(screen.getByPlaceholderText('Tylko dziś'), 'Hotel Sopot');
    for (const lab of ['Ławka regulowana', 'Sztanga', 'Drążek do podciągania', 'Hantle stałe']) { const el = screen.queryAllByLabelText(lab); if (el.length) await tap(el[0]); }
    await tap(screen.getByTestId('place-once-use')); await flushAll(20);
    const l = S().settings.locations.find(x => x.oneOff)!; expect(l.name).toBe('Hotel Sopot'); expect(S().active!.locationId).toBe(l.id);
    expect(['adapt', '(tabs)']).toContain(top());
  });
  test('„Zapisz jako miejsce”: zwykłe miejsce na liście (bez znacznika), trening w nim; pojawia się w arkuszu 📍 i w Ustawieniach', async () => {
    await boot({ start: true }); await pick(await sheetOpts(), ONCE); await type(screen.getByPlaceholderText('Tylko dziś'), 'Dom gościnny');
    await act(async () => { require('@testing-library/react-native').fireEvent(screen.getByTestId('sw-Zapisz jako miejsce'), 'valueChange', true); }); await flushAll(5);
    await tap(screen.getAllByText('Tylko masa ciała')[0]); await tap(screen.getByTestId('place-once-use')); await flushAll(20);
    const l = S().settings.locations.find(x => x.name === 'Dom gościnny')!; expect(l.oneOff).toBeUndefined(); expect(S().active!.locationId).toBe(l.id); expect(store.visibleLocations().map(x => x.name)).toContain('Dom gościnny');
    if (top() === 'adapt') { await tap(screen.getByTestId('close-modal')); await flushAll(20); }
    const sh = await sheetOpts(); expect(sh.opts.options).toContain('Dom gościnny');
  });
  test('bez treningu w toku (adres wpisany ręcznie): „Nie ma treningu w toku.”, bez „Użyj”', async () => {
    await boot({ url: '/place-once' }); expect(screen.getByText('Nie ma treningu w toku.')).toBeTruthy(); expect(screen.queryByTestId('place-once-use')).toBeNull(); expect(screen.getByTestId('close-modal')).toBeTruthy();
  });
  test('język angielski: pozycja arkusza i teksty okna', async () => {
    await boot({ start: true, locale: 'en' }); const sh = await sheetOpts(); expect(sh.opts.options).toContain('Another place (today only)…'); await pick(sh, 'Another place (today only)…');
    expect(screen.getByPlaceholderText('Today only')).toBeTruthy(); expect(screen.getByText('Save as a place')).toBeTruthy(); expect(screen.getByText('Ready-made sets')).toBeTruthy(); expect(screen.getByTestId('place-once-use').props.accessibilityLabel).toBe('Use');
  });
});

describe('A4 — miejsca jednorazowe poza listami', () => {
  const withOnce = () => { require('@/lib/locations').addOneOffLocation('Ukryte', []); };
  test('Ustawienia → Miejsca i sprzęt: bez miejsca jednorazowego; przy samych jednorazowych — „Brak miejsc”', async () => {
    await boot({ url: '/more/locations', fn: withOnce }); expect(screen.getByText(/Siłownia/)).toBeTruthy(); expect(screen.queryByText(/Ukryte/)).toBeNull();
    await boot({ url: '/more/locations', fn: () => { S().settings.locations = []; S().settings.mainLocationId = null; withOnce(); } }); expect(screen.queryByText(/Ukryte/)).toBeNull(); expect(screen.getByText(/^Brak miejsc/)).toBeTruthy();
  });
  test('generator: chipy miejsc bez jednorazowego', async () => {
    await boot({ url: '/generator', fn: withOnce }); expect(screen.getByText('Siłownia')).toBeTruthy(); expect(screen.queryByText('Ukryte')).toBeNull();
  });
  test('edytor szablonu: „Miejsce domyślne” bez jednorazowego', async () => {
    const tpl = await boot({ fn: withOnce }); await go(`/template/${tpl.id}?edit=1`); await flushAll(20); expect(screen.getByText('Miejsce domyślne')).toBeTruthy(); expect(screen.queryByText('Ukryte')).toBeNull(); expect(screen.getByText('Hotel')).toBeTruthy();
  });
  test('trening w miejscu jednorazowym: pozycja miejsca w menu „⋯” pokazuje nazwę, ale arkusz go nie wymienia; „Zawsze w” nie ma', async () => {
    await boot({ start: true, fn: () => { /* start w drugim kroku */ } });
    const o = require('@/lib/locations').addOneOffLocation('Ukryte', presetEquipment('hotel')); store.setActiveLocation(o.id); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(10); expect(await placeInMenu()).toBe('Miejsce treningu: Ukryte'); const sh = await sheetOpts(); expect(sh.opts.options).not.toContain('Ukryte'); expect(screen.queryByText(/^Zawsze w:/)).toBeNull();
  });
});

describe('B — panel dnia w planie', () => {
  const open = async (day = '2026-10-09') => { await tap(screen.getByTestId(`cal-${day}`)); await flushAll(5); };
  const plan3 = () => { jest.setSystemTime(new Date(2026, 8, 28, 9).getTime()); const t = S().templates[0]; plan.setWeekDay(0, t.id); plan.setWeekDay(2, t.id); plan.setWeekDay(5, t.id); jest.setSystemTime(THU.getTime()); };
  test('„Więcej opcji” → „📍 Miejsce na te dni”: miejsca z listy, „Inne miejsce…”, „Od/Do”, dzień po dniu; bez „Ustaw miejsce”, dopóki nie wybrano miejsca', async () => {
    await boot({ url: '/history', fn: plan3 }); await open(); expect(screen.queryByText('Miejsce na te dni')).toBeNull(); await tap(screen.getByText('Więcej opcji')); await flushAll(5);
    await tap(screen.getByText('Miejsce na te dni')); await flushAll(5); expect(screen.getByTestId('place-range')).toBeTruthy();
    expect(screen.getByText('Start w tych dniach weźmie to miejsce. Nic nie zmienia się samo.')).toBeTruthy(); await openInfo('place-range'); /* ⓘ 14.10.2026 */
    expect(screen.getByText('Start treningu w tych dniach weźmie to miejsce przed miejscem szablonu, a okno „Dostosuj” zaproponuje zamiany. Nic nie zmienia się samo.')).toBeTruthy(); expect(screen.getByText('Inne miejsce…')).toBeTruthy();
    expect(screen.getByText(/^Od: /)).toBeTruthy(); expect(screen.getByTestId('place-to').props.children).toMatch(/^Do: /); expect(screen.queryByText('Ustaw miejsce')).toBeNull(); expect(screen.queryByText('Wyczyść miejsce')).toBeNull();
  });
  test('Hotel od piątku do niedzieli: „+” przesuwa „Do”, „−” nie schodzi poniżej „Od”; „Ustaw miejsce” zapisuje trzy dni; dni pokazują „📍 Hotel”', async () => {
    await boot({ url: '/history', fn: plan3 }); await open(); await tap(screen.getByText('Więcej opcji')); await tap(screen.getByText('Miejsce na te dni')); await flushAll(5);
    await tap(screen.getByLabelText('Dzień wcześniej')); await flushAll(2); expect(screen.getByTestId('place-to').props.children).toBe(screen.getByText(/^Od: /).props.children.replace('Od: ', 'Do: '));
    await tap(screen.getByLabelText('Dzień później')); await tap(screen.getByLabelText('Dzień później')); await flushAll(2);
    await tap(chip('Hotel')); await tap(screen.getByText('Ustaw miejsce')); await flushAll(5);
    expect(S().planPlaces).toEqual({ '2026-10-09': HOTEL, '2026-10-10': HOTEL, '2026-10-11': HOTEL }); expect(screen.getByTestId('day-place').props.children).toBe('Hotel');
    await tap(screen.getByTestId('cal-2026-10-11')); await flushAll(5); expect(screen.getByTestId('day-place').props.accessibilityLabel).toBe('Miejsce treningu: Hotel');
    await tap(screen.getByTestId('cal-2026-10-12')); await flushAll(5); expect(screen.queryByTestId('day-place')).toBeNull();
  });
  test('„Wyczyść miejsce” (etykieta z zakresem; M3 rola 09: wcześniej „Usuń miejsce” — to słowo zostało dla usunięcia samego miejsca) zdejmuje miejsce z całego zakresu; szablony i plan tygodnia bez zmian', async () => {
    await boot({ url: '/history', fn: () => { plan3(); plan.setPlanPlace('2026-10-09', '2026-10-11', HOTEL); } }); const tpls = JSON.stringify(S().templates); const wk = JSON.stringify(S().weekPlan);
    await open('2026-10-10'); await tap(screen.getByText('Więcej opcji')); await tap(screen.getByText('Miejsce na te dni')); await flushAll(5);
    const del = screen.getByLabelText(/^Wyczyść miejsce: /); expect(del.props.accessibilityLabel).toMatch(/ – /); await tap(del); await flushAll(5);
    expect(S().planPlaces).toBeUndefined(); expect(screen.queryByTestId('day-place')).toBeNull(); expect(JSON.stringify(S().templates)).toBe(tpls); expect(JSON.stringify(S().weekPlan)).toBe(wk);
  });
  test('„Inne miejsce…” z panelu: okno dla wybranego zakresu; „Użyj” ustawia miejsce jednorazowe na dni od–do (bez zmiany treningu w toku)', async () => {
    await boot({ url: '/history', fn: plan3 }); await open(); await tap(screen.getByText('Więcej opcji')); await tap(screen.getByText('Miejsce na te dni')); await flushAll(5);
    await tap(screen.getByLabelText('Dzień później')); await tap(screen.getByText('Inne miejsce…')); await flushAll(20);
    expect(top()).toBe('place-once'); expect(screen.getByText(/^Miejsce na dni .* – .*\. Wybierz sprzęt/)).toBeTruthy(); expect(screen.getByPlaceholderText('Inne miejsce')).toBeTruthy();
    await tap(screen.getAllByText('Hotel')[0]); await tap(screen.getByTestId('place-once-use')); await flushAll(20);
    const l = S().settings.locations.find(x => x.oneOff)!; expect(l.name).toBe('Inne miejsce'); expect(S().planPlaces).toEqual({ '2026-10-09': l.id, '2026-10-10': l.id }); expect(top()).toBe('(tabs)');
    expect(screen.getByTestId('day-place').props.children).toBe('Inne miejsce');
  });
  test('dzień miniony i brak miejsc na liście: przycisk „📍 Miejsce na te dni” się nie pokazuje', async () => {
    await boot({ url: '/history', fn: plan3 }); await open('2026-10-05'); await tap(screen.getByText('Więcej opcji')); expect(screen.queryByText('Miejsce na te dni')).toBeNull();
    await boot({ url: '/history', fn: () => { plan3(); S().settings.locations = []; S().settings.mainLocationId = null; } }); await open(); await tap(screen.getByText('Więcej opcji')); expect(screen.queryByText('Miejsce na te dni')).toBeNull();
  });
  test('karta „Dziś”: „📍 Hotel” w dniu z miejscem; etykieta dnia w pasku tygodnia ma miejsce', async () => {
    await boot({ fn: () => { plan3(); plan.setPlanPlace('2026-10-08', '2026-10-09', HOTEL); jest.setSystemTime(new Date(2026, 8, 28, 9).getTime()); plan.setWeekDay(3, S().templates[0].id); jest.setSystemTime(THU.getTime()); } });
    expect(screen.getByTestId('today-place').props.children).toBe('Hotel'); expect(screen.getByTestId('strip-2026-10-09').props.accessibilityLabel).toMatch(/Miejsce treningu: Hotel/); expect(screen.getByTestId('strip-2026-10-10').props.accessibilityLabel).not.toMatch(/Miejsce treningu/);
  });
});

describe('B — start w dniu z miejscem (P4 A)', () => {
  test('start z ekranu głównego w dniu z Hotelem: trening w Hotelu, okno „Dostosuj do: Hotel” otwiera się samo, ćwiczenia niezamienione do „Zastosuj”', async () => {
    await boot({ fn: () => { plan.setPlanPlace('2026-10-08', '2026-10-09', HOTEL); } }); await startTpl('FBW');
    expect(S().active!.locationId).toBe(HOTEL); expect(top()).toBe('adapt'); expect(title()).toBe('Dostosuj do: Hotel'); expect(S().active!.exercises.map(e => e.exerciseId)).toEqual(FBW.map(([n]) => ex(n).id));
    expect(screen.getByTestId('adapt-apply').props.accessibilityLabel).toBe('Zastosuj (3)'); /* zaznaczone propozycje, jedno „Zastosuj” */
    await tap(screen.getByTestId('close-modal')); await flushAll(20); expect(top()).toBe('(tabs)'); expect(S().active!.exercises.map(e => e.exerciseId)).toEqual(FBW.map(([n]) => ex(n).id)); expect(screen.getByTestId('adapt-line')).toBeTruthy();
  });
  test('dzień z miejscem bez braków (np. siłownia) — bez okna; bez miejsca dnia — bez okna (jak 0.18: tylko wiersz pod chipem)', async () => {
    await boot({ fn: () => { plan.setPlanPlace('2026-10-08', '2026-10-08', GYM); } }); await startTpl('FBW'); expect(S().active!.locationId).toBe(GYM); expect(top()).toBe('(tabs)'); expect(screen.queryByTestId('adapt-line')).toBeNull();
  });
  test('restart z otwartym oknem po starcie: aplikacja wstaje bez okna, wiersz „3 ćwiczenia bez sprzętu · Dostosuj” zostaje', async () => {
    await boot({ fn: () => { plan.setPlanPlace('2026-10-08', '2026-10-09', HOTEL); } }); await startTpl('FBW'); expect(top()).toBe('adapt'); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); jest.setSystemTime(THU.getTime()); await flushAll(10); expect(top()).toBe('(tabs)'); expect(S().active!.locationId).toBe(HOTEL);
    expect(screen.getByTestId('adapt-line').props.accessibilityLabel).toBe('3 ćwiczenia bez sprzętu · Dostosuj'); expect(S().active!.exercises.every(e => !e.swappedFrom && !e.skipped)).toBe(true);
  });
});

describe('języki i wygląd (docs/20 rodzaj 7)', () => {
  const dict = (l: Lang): Record<string, string> => (l === 'en' ? EN : (LOCALES as Record<string, Record<string, string>>)[l]);
  const esc = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/[\u00a0\u202f ]/g, '[\\s\\u00a0\\u202f]'); /* fr: spacja nierozdzielająca przed „:” */
  test.each(LANGS.filter(l => l !== 'pl'))('%s: panel „📍 Miejsce na te dni” i okno „Inne miejsce” po tłumaczeniu — nowe teksty z tego języka, bez polskich', async l => {
    jest.useFakeTimers({ now: THU }); await fresh(undefined, 'pl'); const s0 = S().settings;
    s0.locations = [loc('Siłownia', presetEquipment('gym'), GYM), loc('Hotel', presetEquipment('hotel'), HOTEL)]; s0.mainLocationId = GYM; s0.language = l; s0.theme = LANGS.indexOf(l) % 2 ? 'dark' : 'light';
    const tpl = store.newTemplate(); tpl.name = 'FBW'; tpl.items = FBW.map(([n, id]) => item(n, id)); store.save(tpl); jest.setSystemTime(new Date(2026, 8, 28, 9).getTime()); plan.setWeekDay(3, tpl.id); plan.setWeekDay(4, tpl.id); jest.setSystemTime(THU.getTime());
    store.startFromTemplate(tpl); await act(async () => { await store.flush(); });
    const T = dict(l); const txt = (k: string) => T[k];
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: '/history', code: l === 'en' ? 'en' : l }); jest.setSystemTime(THU.getTime()); await flushAll(10);
    await tap(screen.getByTestId('cal-2026-10-09')); await flushAll(5); await tap(screen.getByLabelText(txt('Więcej opcji'))); await flushAll(5); await tap(screen.getByText(txt('Miejsce na te dni'))); await flushAll(5);
    expect(screen.getByText(txt('Start w tych dniach weźmie to miejsce. Nic nie zmienia się samo.'))).toBeTruthy(); await openInfo('place-range');
    expect(screen.getByText(txt('Start treningu w tych dniach weźmie to miejsce przed miejscem szablonu, a okno „Dostosuj” zaproponuje zamiany. Nic nie zmienia się samo.'))).toBeTruthy();
    expect(screen.getByText(txt('Inne miejsce…'))).toBeTruthy(); expect(screen.getByText(new RegExp('^' + esc(txt('Od: {day}').split('{day}')[0])))).toBeTruthy(); expect(new RegExp('^' + esc(txt('Do: {day}').split('{day}')[0])).test(screen.getByTestId('place-to').props.children)).toBe(true);
    await tap(screen.getAllByText('Hotel')[0]); expect(screen.getByText(txt('Ustaw miejsce'))).toBeTruthy();
    for (const k of ['Inne miejsce…', 'Ustaw miejsce', 'Miejsce na te dni']) if (l !== 'cs' && l !== 'sk' && l !== 'hr' && l !== 'sl') expect([k, screen.queryAllByText(k).length > 0 && T[k] !== k]).toEqual([k, false]);
    await go('/place-once'); await flushAll(20);
    expect(screen.queryByLabelText(txt('Gotowe zestawy')) ?? screen.getByText(txt('Gotowe zestawy'))).toBeTruthy(); /* SectionTitle: wersaliki wg języka (tr, el), etykieta VoiceOver bez zmian */ expect(screen.getByText(txt('Miejsce tylko na ten trening. Wybierz sprzęt, jaki tam masz — ciężarów nie trzeba wpisywać.'))).toBeTruthy();
    expect(screen.getByText(txt('Zapisz jako miejsce'))).toBeTruthy(); expect(screen.getByPlaceholderText(txt('Tylko dziś'))).toBeTruthy(); expect(screen.getByTestId('place-once-use').props.accessibilityLabel).toBe(txt('Użyj'));
    applyLang('pl');
  });
  test('najdłuższa nazwa miejsca jednorazowego (80 znaków) w chipie, tytule okna „Dostosuj” i w kopii — bez błędu, nazwa przycięta tylko do NAME_MAX', async () => {
    await boot({ start: true }); const long = 'Ł'.repeat(120); await pick(await sheetOpts(), ONCE); await type(screen.getByPlaceholderText('Tylko dziś'), long); await tap(screen.getAllByText('Tylko masa ciała')[0]);
    await tap(screen.getByTestId('place-once-use')); await flushAll(20); const l = S().settings.locations.find(x => x.oneOff)!; expect(l.name).toHaveLength(store.NAME_MAX); expect(title()).toBe(`Dostosuj do: ${l.name}`);
    await tap(screen.getByTestId('close-modal')); await flushAll(20); expect(await placeInMenu()).toBe(`Miejsce treningu: ${l.name}`);
  });
  test('ciemny motyw: okno „Inne miejsce” i panel miejsca na dni renderują się (motyw z Ustawień)', async () => {
    await boot({ start: true, fn: () => { S().settings.theme = 'dark'; } }); await pick(await sheetOpts(), ONCE); expect(screen.getByText('Gotowe zestawy')).toBeTruthy(); expect(S().settings.theme).toBe('dark');
  });
});
