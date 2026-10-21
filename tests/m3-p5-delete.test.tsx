/*
 * M3 p5 (ZM-04, W1 b, W2 wariant a; docs/32 wzorzec 5 i 19): widoczna droga usuwania obok gestu.
 *  - listy bez ekranu szczegółów (Masa ciała, Gumy): „Edytuj” w nagłówku → przy wierszu przycisk „Usuń {obiekt}: {nazwa}” → to samo okno co gest; „Gotowe” kończy tryb;
 *  - szczegóły miejsca: „Usuń miejsce” na dole (tylko gdy gest też jest dozwolony), jeden na ekran, to samo okno co gest.
 * Rodzaje (docs/20): ekran + scenariusz (przebieg, Anuluj/Usuń), macierz (miejsce × droga), regresja (gest zostaje), języki (en), dostępność (etykiety).
 * Zaostrzenie decyzji z 07.10.2026 („bez przycisków Usuń”), zastąpionej przez W2 21.10.2026 — blok w tests/swipe-delete.test.tsx zostaje dla tras innych partii.
 */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { addLocation } from '@/lib/locations';
import { fresh, pressAlert, saved, addWorkout } from './helpers';
import { bandDeleteMessage, locationDeleteMessage } from '@/lib/deleteMessages';
import { renderApp, flushAll, screen, go, act, swipeDelete, deleteActions, tap } from './app';

jest.setTimeout(60000);
const S = () => store.getState();
const lastAlert = () => global.__alerts[global.__alerts.length - 1];
afterEach(async () => { await timer.stop(); await timer.stopSet(); });
const boot = async (fn: () => void = () => {}, url?: string, locale?: 'pl' | 'en') => {
  await fresh(undefined, locale); fn(); await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url, locale }); await flushAll(10);
};
const rowDeletes = () => screen.queryAllByTestId('row-delete');

type List = { name: string; setup: () => void; url: string; label: RegExp; title: string; count: () => number };
const LISTS: List[] = [
  { name: 'Masa ciała', setup: () => { store.addBodyMass(80, '2026-10-01'); store.addBodyMass(81, '2026-10-05'); }, url: '/more/bodymass', label: /^Usuń pomiar: /, title: 'Usunąć pomiar?', count: () => store.bodyMassLog().length },
  { name: 'Gumy', setup: () => { /* nowa instalacja ma gumy z nasion */ }, url: '/more/bands', label: /^Usuń gumę: /, title: 'Usunąć gumę?', count: () => S().bands.length },
];

describe.each(LISTS.map(l => [l.name, l] as const))('lista „%s”: tryb usuwania (ZM-04, W1 b)', (_n, l) => {
  test('„Edytuj” w nagłówku; poza trybem edycji brak przycisków usuwania; „Gotowe” kończy tryb', async () => {
    await boot(l.setup, l.url); await flushAll(10);
    expect(screen.getByTestId('edit-button')).toBeTruthy(); expect(screen.getByText('Edytuj')).toBeTruthy(); expect(rowDeletes()).toHaveLength(0);
    await tap(screen.getByTestId('edit-button')); await flushAll(5);
    expect(screen.getByText('Gotowe')).toBeTruthy(); expect(screen.queryByText('Edytuj')).toBeNull(); expect(rowDeletes().length).toBe(l.count());
    for (const b of rowDeletes()) expect(String(b.props.accessibilityLabel)).toMatch(l.label);
    await tap(screen.getByTestId('edit-button')); await flushAll(5);
    expect(screen.getByText('Edytuj')).toBeTruthy(); expect(rowDeletes()).toHaveLength(0);
  });
  test('przycisk usunięcia otwiera to samo okno co gest; „Anuluj” zostawia, „Usuń” usuwa jeden element', async () => {
    await boot(l.setup, l.url); const n0 = l.count();
    await swipeDelete(l.label); const gest = { ...lastAlert() }; await act(async () => { pressAlert(l.title, 'Anuluj'); });
    await tap(screen.getByTestId('edit-button')); await flushAll(5);
    await tap(rowDeletes()[0]); const btn = lastAlert();
    expect([btn.title, btn.msg, btn.buttons!.map((b: any) => b.text)]).toEqual([gest.title, gest.msg, ['Anuluj', 'Usuń']]); expect(btn.title).toBe(l.title);
    await act(async () => { pressAlert(l.title, 'Anuluj'); }); await flushAll(5); expect(l.count()).toBe(n0);
    await tap(rowDeletes()[0]); await act(async () => { pressAlert(l.title, 'Usuń'); }); await flushAll(10); expect(l.count()).toBe(n0 - 1);
  });
  test('gest przesunięcia zostaje (skrót, DEC-12) także w trybie edycji', async () => {
    await boot(l.setup, l.url); expect(deleteActions().some(x => l.label.test(x))).toBe(true);
    await tap(screen.getByTestId('edit-button')); await flushAll(5); expect(deleteActions().some(x => l.label.test(x))).toBe(true);
  });
});

describe('Masa ciała i Gumy: stany brzegowe', () => {
  test('Masa ciała bez pomiarów: brak „Edytuj” (nie ma czego usuwać)', async () => {
    await boot(() => {}, '/more/bodymass'); expect(screen.queryByTestId('edit-button')).toBeNull();
  });
  test('Masa ciała: po usunięciu ostatniego pomiaru tryb edycji się kończy („Edytuj” znika, nie zostaje pusty „Gotowe”)', async () => {
    await boot(() => { store.addBodyMass(80, '2026-10-01'); }, '/more/bodymass');
    await tap(screen.getByTestId('edit-button')); await flushAll(5); await tap(rowDeletes()[0]); await act(async () => { pressAlert('Usunąć pomiar?', 'Usuń'); }); await flushAll(10);
    expect(store.bodyMassLog()).toHaveLength(0); expect(screen.queryByTestId('edit-button')).toBeNull(); expect(screen.queryByText('Gotowe')).toBeNull();
  });
  test('Gumy: w trybie edycji „+” znika (wz. 19 b), po „Gotowe” wraca', async () => {
    await boot(() => {}, '/more/bands'); expect(screen.getByTestId('add-button')).toBeTruthy();
    await tap(screen.getByTestId('edit-button')); await flushAll(5); expect(screen.queryByTestId('add-button')).toBeNull();
    await tap(screen.getByTestId('edit-button')); await flushAll(5); expect(screen.getByTestId('add-button')).toBeTruthy();
  });
  test('Gumy: okno usunięcia z przycisku ma ten sam opis skutków co gest (guma użyta w historii)', async () => {
    await boot(() => { const id = [...S().bands].sort((a, b) => a.level - b.level)[0].id /* pierwszy wiersz listy */; addWorkout(Date.now() - 86400e3, [['Back Squat', [{ weight: 0, reps: 5, bandId: id }]]]); }, '/more/bands');
    await swipeDelete(/^Usuń gumę: /); const gest = { ...lastAlert() }; await act(async () => { pressAlert('Usunąć gumę?', 'Anuluj'); });
    await tap(screen.getByTestId('edit-button')); await flushAll(5); await tap(rowDeletes()[0]);
    expect(lastAlert().msg).toBe(gest.msg); expect(String(gest.msg ?? '')).toContain('„?”');
  });
});

describe('szczegóły miejsca: „Usuń miejsce” na dole (ZM-04, W2 wariant a)', () => {
  const open = async (main = false, locale?: 'pl' | 'en') => {
    let id = ''; await boot(() => { const a = addLocation('home'); const b = addLocation('gym'); id = main ? S().settings.mainLocationId! : (S().settings.mainLocationId === a.id ? b.id : a.id); }, undefined, locale);
    await go(`/more/location/${id}`); await flushAll(10); return id;
  };
  test('miejsce inne niż główne: dokładnie jeden przycisk „Usuń miejsce”, to samo okno co gest, „Anuluj” zostawia, „Usuń” usuwa i wraca do listy', async () => {
    const id = await open(); const btns = screen.queryAllByTestId('delete-object'); expect(btns).toHaveLength(1); expect(screen.getAllByText('Usuń miejsce')).toHaveLength(1);
    const n0 = S().settings.locations.length;
    await go('/more/locations'); await flushAll(10); await swipeDelete(/^Usuń miejsce: /); const gest = { ...lastAlert() }; await act(async () => { pressAlert('Usunąć miejsce?', 'Anuluj'); });
    await go(`/more/location/${id}`); await flushAll(10);
    await tap(screen.getByTestId('delete-object')); const b = lastAlert();
    expect(b.title).toBe('Usunąć miejsce?'); expect(b.buttons!.map((x: any) => x.text)).toEqual(['Anuluj', 'Usuń']); expect(b.title).toBe(gest.title);
    await act(async () => { pressAlert('Usunąć miejsce?', 'Anuluj'); }); expect(S().settings.locations.length).toBe(n0);
    await tap(screen.getByTestId('delete-object')); await act(async () => { pressAlert('Usunąć miejsce?', 'Usuń'); }); await flushAll(10);
    expect(S().settings.locations.length).toBe(n0 - 1); expect(S().settings.locations.some(x => x.id === id)).toBe(false);
  });
  test('miejsce główne (gdy są inne): bez przycisku — jak bez gestu', async () => {
    await open(true); expect(screen.queryByTestId('delete-object')).toBeNull();
  });
  test('przycisk jest ostatnim elementem ekranu, a wyjątek wz. 5 „Usuń odznaczone” (talerze) nie jest tym przyciskiem', async () => {
    await open(); expect(screen.queryAllByText('Usuń odznaczone')).toHaveLength(0); expect(screen.getByTestId('delete-button-wrap')).toBeTruthy();
  });
  test('English: „Delete place” (rola 09: wzorzec „Delete …” jak sesja i szablon) — okno po angielsku', async () => {
    await open(false, 'en'); expect(screen.getByText('Delete place')).toBeTruthy(); await tap(screen.getByTestId('delete-object')); expect(lastAlert().buttons!.map((x: any) => x.text)).toEqual(['Cancel', 'Delete']);
  });
});

describe('strażnik źródła: usuwanie poza treningiem tylko przez wspólne komponenty (docs/32 wz. 5, 19 b)', () => {
  const fs = require('fs'); const path = require('path'); const read = (f: string) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8') as string;
  test('Masa ciała i Gumy: EditableRow + useEditHeader (bez własnego headerRight i bez własnego okna usuwania)', () => {
    for (const f of ['app/more/bodymass.tsx', 'app/more/bands.tsx']) {
      const s = read(f); expect(s).toContain('<EditableRow'); expect(s).toContain('useEditHeader('); expect(s).not.toMatch(/header(Left|Right)\s*:/); expect(s).not.toContain('Alert.alert(t(\'Usunąć');
    }
  });
  test('szczegóły miejsca: dokładnie jeden <DeleteButton>, bez własnego Btn danger', () => {
    const s = read('app/more/location/[id].tsx'); expect(s.match(/<DeleteButton\b/g)).toHaveLength(1); expect(s).not.toMatch(/kind="danger"/);
  });
});

describe('logika (lib/deleteMessages.ts): opisy skutków usunięcia — jedno źródło dla gestu i przycisku', () => {
  test('bandDeleteMessage: bez użycia — brak opisu; guma w historii — dopisek o „?”; w trwającym treningu — dopisek o nieodhaczonych seriach; oba naraz łączy spacją', async () => {
    await fresh(); const [b1, b2] = S().bands; expect(bandDeleteMessage(b1.id)).toBeUndefined();
    addWorkout(Date.now() - 86400e3, [['Back Squat', [{ weight: 0, reps: 5, bandId: b1.id }]]]);
    expect(bandDeleteMessage(b1.id)).toBe('W historii serie z tą gumą pokażą „?”.'); expect(bandDeleteMessage(b2.id)).toBeUndefined();
    store.startEmpty(); store.addExerciseToActive(require('./helpers').ex('Back Squat')); S().active!.exercises[0].sets[0].bandId = b1.id;
    expect(bandDeleteMessage(b1.id)).toBe('W historii serie z tą gumą pokażą „?”. W trwającym treningu guma zniknie z nieodhaczonych serii.');
  });
  test('locationDeleteMessage: miejsce nieużywane — brak opisu; użyte w szablonie — dopisek o „(usunięte miejsce)”; miejsce trwającego treningu — drugi dopisek', async () => {
    await fresh(); const l = addLocation('gym'); expect(locationDeleteMessage(l.id)).toBeUndefined();
    const tpl = store.newTemplate(); tpl.locationId = l.id;
    expect(locationDeleteMessage(l.id)).toBe('Treningi i szablony z tym miejscem pokażą „(usunięte miejsce)”.');
    store.startEmpty(); S().active!.locationId = l.id;
    expect(locationDeleteMessage(l.id)).toBe('Treningi i szablony z tym miejscem pokażą „(usunięte miejsce)”. Trwający trening w tym miejscu trwa dalej; miejsce pokaże się jako „(usunięte miejsce)”.');
  });
});
