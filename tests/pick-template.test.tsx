/*
 * Wybór szablonu do startu (docs/22 P2 B, decyzja właściciela 11.10.2026): „Inny trening” → „Z szablonu” otwiera pełnoekranowy wybór (app/pick-template.tsx)
 * ze „Startem” przy każdym szablonie, wzorem „Wybierz ćwiczenie”; start tymi samymi funkcjami co duży przycisk (lib/start.startTemplate).
 * Rodzaje (docs/20): ekran (wiersze, foldery, wyszukiwarka od SEARCH_MIN, stany puste), scenariusz (start → ekran treningu, stos bez modalu, „Zamknij”,
 * podgląd szablonu), niezmienniki (zarchiwizowane i puste bez „Startu”, jeden start przy podwójnym tapnięciu, deload jak duży przycisk, strażnik treningu w toku),
 * języki (EN), wąski ekran (320 pt). E2E: .maestro (zmiana literałów „Start from a template” → „Other workout” → „From a template”).
 */
import * as store from '@/lib/store';
import { SEARCH_MIN } from '../app/pick-template';
import { uid, type Template } from '@/lib/seed';
import { fresh, saved, ex, addWorkout, pressAlert, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, tap, act, type, fireEvent } from './app';

jest.setTimeout(60000);
const NOW = new Date(2026, 9, 8, 9, 0);
const S = () => store.getState();
const mk = (name: string, opts: { folder?: string; archived?: boolean; empty?: boolean } = {}): Template => {
  const t = store.newTemplate(); t.name = name; if (opts.folder) t.folder = opts.folder; if (opts.archived) t.archived = true;
  t.items = opts.empty ? [] : [{ id: uid(), exerciseId: ex('Back Squat').id, sets: 3, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null }]; store.save(t); return t;
};
const boot = async (fn: () => void = () => {}, url = '/', locale: 'pl' | 'en' = 'pl', width?: number) => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); fn();
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url, width }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
};
/** „Inny trening” → „Z szablonu”. */
const openPick = async (en = false) => { await tap(screen.getByLabelText(en ? 'Other workout' : 'Inny trening')); await flushAll(5); await tap(screen.getByLabelText(/^(Z szablonu|From a template)$/)); await flushAll(10); };
type Nav = { routes: { name: string; state?: Nav }[] };
const stack = () => { const { store: rs } = require('expo-router/build/global-state/router-store'); let st: Nav = rs.navigationRef.getRootState();
  while (st.routes.length === 1 && st.routes[0].name === '__root' && st.routes[0].state) st = st.routes[0].state; return st.routes.map(r => r.name); };
const lastAlert = (title: string) => [...global.__alerts].reverse().find(x => x.title === title);
const header = () => screen.UNSAFE_root.findAll((n: { type: unknown }) => n.type === 'RNSScreenStackHeaderConfig').map((n: { props: { title?: string } }) => n.props.title);

describe('wiersze i foldery', () => {
  test('„Z szablonu” z arkusza → ekran „Wybierz szablon”: arkusz zamknięty, szablony z folderami jako nagłówkami, „Start” przy każdym, opis wiersza', async () => {
    await boot(() => { mk('A'); mk('B', { folder: 'Siła' }); addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'A').templateId = S().templates[0].id; store.save(); });
    await openPick(); expect(screen.queryByTestId('other-sheet')).toBeNull(); expect(header()).toContain('Wybierz szablon');
    expect(screen.getByLabelText('Start: A')).toBeTruthy(); expect(screen.getByLabelText('Start: B')).toBeTruthy();
    expect(screen.getAllByText('Siła').some(x => x.props.accessibilityRole === 'header')).toBe(true);
    expect(screen.getByText(`1 ćw. · 3 serie · ostatnio ${store.fmtDate(new Date(2026, 9, 6, 18).getTime())}`)).toBeTruthy(); expect(screen.getByText('1 ćw. · 3 serie')).toBeTruthy(); /* bez „ostatnio” przy nieużywanym */
    expect(screen.queryByPlaceholderText('Szukaj szablonu…')).toBeNull(); /* mało szablonów — bez wyszukiwarki */
    expect(screen.getByText('Wiersz otwiera podgląd szablonu, „Start” zaczyna trening.')).toBeTruthy();
  });
  test('zarchiwizowane nie są na liście; pusty szablon jest, ale bez „Startu” (wiersz otwiera podgląd do uzupełnienia)', async () => {
    await boot(() => { mk('A'); mk('Stary', { archived: true }); mk('Pusty', { empty: true }); });
    await openPick(); expect(screen.queryByText('Stary')).toBeNull(); expect(screen.queryByLabelText('Start: Stary')).toBeNull();
    expect(screen.getByText('Pusty')).toBeTruthy(); expect(screen.queryByLabelText('Start: Pusty')).toBeNull(); expect(screen.getByLabelText('Start: A')).toBeTruthy();
    await tap(screen.getByText('Pusty')); await flushAll(10); expect(stack()).toContain('template/[id]');
  });
  test('wiersz otwiera podgląd szablonu (Start nie jest wywołany)', async () => {
    let id = ''; await boot(() => { id = mk('A').id; });
    await openPick(); await tap(screen.getByText('A')); await flushAll(10); expect(stack()).toEqual(['(tabs)', 'pick-template', 'template/[id]']); expect(S().active).toBeNull(); expect(header()).toContain('Szablon'); void id;
  });
});

describe('wyszukiwarka (od SEARCH_MIN szablonów)', () => {
  test('SEARCH_MIN = 6: przy 5 szablonach brak pola, przy 6 jest; filtr po nazwie bez uwzględniania wielkości liter i polskich znaków; „Nic nie pasuje.”', async () => {
    expect(SEARCH_MIN).toBe(6);
    await boot(() => { ['Alfa', 'Beta', 'Gamma', 'Delta', 'Epsilon'].forEach(n => mk(n)); });
    await openPick(); expect(screen.queryByPlaceholderText('Szukaj szablonu…')).toBeNull();
    await boot(() => { ['Alfa', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Żółw'].forEach(n => mk(n)); });
    await openPick(); const q = screen.getByPlaceholderText('Szukaj szablonu…'); expect(screen.getByLabelText('Start: Alfa')).toBeTruthy();
    await type(q, 'ZOLW'); await flushAll(5); expect(screen.getByLabelText('Start: Żółw')).toBeTruthy(); expect(screen.queryByLabelText('Start: Alfa')).toBeNull();
    await type(q, 'zzz'); await flushAll(5); expect(screen.getByText('Nic nie pasuje.')).toBeTruthy();
    await type(q, ''); await flushAll(5); expect(screen.getByLabelText('Start: Alfa')).toBeTruthy(); expect(screen.getByLabelText('Start: Epsilon')).toBeTruthy();
  });
  test('filtr zostawia nagłówek folderu tylko z pasującymi szablonami', async () => {
    await boot(() => { ['A1', 'A2', 'A3', 'A4'].forEach(n => mk(n, { folder: 'Góra' })); mk('Nogi', { folder: 'Dół' }); mk('Core'); });
    await openPick(); await type(screen.getByPlaceholderText('Szukaj szablonu…'), 'nogi'); await flushAll(5);
    expect(screen.getByLabelText('Start: Nogi')).toBeTruthy(); expect(screen.getAllByText('Dół').length).toBeGreaterThan(0); expect(screen.queryByText('Góra')).toBeNull();
  });
});

describe('start i zamknięcie', () => {
  test('„Start” zaczyna trening z tego szablonu i wraca na ekran treningu (jeden ekran w stosie, bez modalu wyboru)', async () => {
    let id = ''; await boot(() => { mk('A'); id = mk('B').id; });
    await openPick(); await tap(screen.getByLabelText('Start: B')); await flushAll(10);
    expect(S().active?.templateId).toBe(id); expect(stack()).toEqual(['(tabs)']); expect(screen.getAllByText('Zakończ').length).toBeGreaterThan(0);
  });
  test('start z wyboru = start z dużego przycisku: ten sam efekt (bloki z szablonu), jedno uruchomienie', async () => {
    let t: Template[] = []; await boot(() => { t = withDemoTemplates(); });
    await openPick(); await tap(screen.getByLabelText(`Start: ${t[1].name}`)); await flushAll(10);
    const a = S().active!; expect(a.templateId).toBe(t[1].id); expect(a.exercises.map(e => e.exerciseId)).toEqual(t[1].items.map(i => i.exerciseId));
  });
  test('podwójne tapnięcie „Start” w tygodniu deload → jedno pytanie; „Anuluj” zostawia wybór otwarty, „Pełny trening” startuje', async () => {
    let id = ''; await boot(() => { mk('A'); id = mk('B').id; store.toggleDeloadWeek(NOW.getTime()); });
    await openPick(); const b = screen.getByLabelText('Start: B'); await act(async () => { fireEvent.press(b); fireEvent.press(b); }); await flushAll(5);
    expect(global.__alerts.filter(x => x.title === 'Tydzień deload')).toHaveLength(1);
    await act(async () => { pressAlert('Tydzień deload', 'Anuluj'); }); await flushAll(1500); expect(S().active).toBeNull(); expect(stack()).toEqual(['(tabs)', 'pick-template']);
    await tap(screen.getByLabelText('Start: B')); await flushAll(5); await act(async () => { pressAlert('Tydzień deload', 'Pełny trening'); }); await flushAll(10);
    expect(S().active?.templateId).toBe(id); expect(stack()).toEqual(['(tabs)']);
  });
  test('podwójne tapnięcie „Start” poza deload → jeden trening', async () => {
    await boot(() => { mk('A'); mk('B'); });
    await openPick(); const b = screen.getByLabelText('Start: B'); await act(async () => { fireEvent.press(b); fireEvent.press(b); }); await flushAll(10);
    expect(S().active).not.toBeNull(); expect(S().active!.templateId).toBeTruthy(); expect(stack()).toEqual(['(tabs)']); expect(global.__alerts).toHaveLength(0); /* jedno uruchomienie, bez błędów */
  });
  test('trening już w toku (strażnik): „Start” nie nadpisuje treningu, tylko wraca do niego', async () => {
    let a = ''; await boot(() => { a = mk('A').id; mk('B'); });
    await openPick(); await act(async () => { store.startEmpty(); }); const id0 = S().active!.id; await flushAll(5);
    await tap(screen.getByLabelText('Start: B')); await flushAll(10);
    expect(S().active!.id).toBe(id0); expect(S().active!.templateId).toBeNull(); expect(stack()).toEqual(['(tabs)']); void a;
  });
  test('„Zamknij” w nagłówku zamyka wybór bez startu; podwójne „Zamknij” nie cofa dalej', async () => {
    await boot(() => { mk('A'); });
    await openPick(); const cancel = screen.getByTestId('close-modal'); await act(async () => { fireEvent.press(cancel); fireEvent.press(cancel); }); await flushAll(10);
    expect(S().active).toBeNull(); expect(stack()).toEqual(['(tabs)']); expect(screen.getByTestId('start-main')).toBeTruthy();
  });
  test('brak szablonów (wejście z linku): „Nie masz jeszcze szablonów.”, bez wyszukiwarki', async () => {
    await boot(() => {}, '/pick-template'); expect(screen.getByText('Nie masz jeszcze szablonów.')).toBeTruthy(); expect(screen.queryByPlaceholderText('Szukaj szablonu…')).toBeNull();
  });
});

describe('języki i wąski ekran', () => {
  test('EN: „Choose a template”, „Start: …”, opis wiersza i wyszukiwarka po angielsku', async () => {
    await boot(() => { ['Alfa', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta'].forEach(n => mk(n)); }, '/', 'en');
    await openPick(true); expect(header()).toContain('Choose a template'); expect(screen.getByLabelText('Start: Alfa')).toBeTruthy(); expect(screen.getByPlaceholderText('Search templates…')).toBeTruthy();
    expect(screen.getAllByText('1 ex. · 3 sets').length).toBeGreaterThan(0); expect(screen.getByText('A row opens the template preview; “Start” begins the workout.')).toBeTruthy();
  });
  test('320 pt: wybór renderuje się z długą nazwą szablonu i folderu (nazwa zawija się, „Start” zostaje)', async () => {
    const long = 'Bardzo długa nazwa szablonu treningowego na wąskim ekranie telefonu';
    await boot(() => { mk(long, { folder: 'Wygenerowane przez generator szablonów i planu' }); }, '/', 'pl', 320);
    await openPick(); expect(screen.getByText(long)).toBeTruthy(); expect(screen.getByLabelText(`Start: ${long}`)).toBeTruthy();
  });
});
