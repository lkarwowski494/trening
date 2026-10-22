/* 0.18 „Dostosuj do miejsca”, etap 2 (docs/33) — okno app/adapt.tsx, wiersz pod chipem miejsca, auto-otwarcie po zmianie „📍”, cel `adapt:` arkusza zamiany
 * („Bez zmian”, „Pomiń dziś”), „Wraca z planu”, potwierdzenie C7, zastosowanie (jeden zapis) i ogłoszenie VoiceOver. */
import { AccessibilityInfo } from 'react-native';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { fresh, ex, pressAlert } from './helpers';
import { renderApp, flushAll, screen, tap, act, go, fireEvent } from './app';
import { loc } from './locations-fixtures';
import { presetEquipment } from '@/lib/equipment';

/** M3 p2 (ZM-02, wzorzec 30): miejsce treningu jest w menu „⋯” (dawny chip „📍 Dom ▾” pod nazwą) — otwiera menu, wybiera pozycję miejsca i zwraca arkusz miejsc */
const openPlaceSheet = async () => { await tap(screen.getByTestId('more-button')); const m = (global as any).__sheets.at(-1); const i = (m.opts.options as string[]).findIndex(o => /^(Miejsce treningu|Workout place): /.test(o)); await act(async () => { m.cb(i); }); return (global as any).__sheets.at(-1); };
jest.setTimeout(60000);
const S = () => store.getState();
const blk = (i: number) => S().active!.exercises[i];
const GYM = 'gym', HOTEL = 'hotel', DOM = 'dom';
const stack = () => { const { store: rs } = require('expo-router/build/global-state/router-store'); let st = rs.navigationRef.getRootState(); while (st.routes.length === 1 && st.routes[0].name === '__root' && st.routes[0].state) st = st.routes[0].state; return st.routes.map((r: { name: string }) => r.name) as string[]; };
const top = () => stack().at(-1);
const item = (name: string, id: string) => ({ id, exerciseId: ex(name).id, sets: 3, repMin: 6, repMax: 8, restSec: 120, startWeight: '' as const, targetSec: '' as const, groupId: null });
const FBW: [string, string][] = [['Bench Press (sztanga)', 'bench'], ['Overhead Press (sztanga)', 'ohp'], ['Pull Up', 'pull'], ['RDL (hantle/linki)', 'rdl']];

/** Siłownia (główne), Hotel, „Dom” (tylko masa ciała); trening z szablonu FBW na siłowni. */
async function savedWorld(names: [string, string][] = FBW, locale: 'pl' | 'en' = 'pl', theme: 'light' | 'dark' = 'light') {
  await fresh(undefined, locale); const s = S().settings;
  s.locations = [loc('Siłownia', presetEquipment('gym'), GYM), loc('Hotel', presetEquipment('hotel'), HOTEL), loc('Dom', presetEquipment('bodyweight'), DOM)]; s.mainLocationId = GYM; s.theme = theme;
  const tpl = store.newTemplate(); tpl.name = 'FBW'; tpl.items = names.map(([n, id]) => item(n, id)); store.save(tpl); store.startFromTemplate(tpl);
  await store.flush(); return JSON.parse(JSON.stringify(S()));
}
const boot = async (names?: [string, string][], locale: 'pl' | 'en' = 'pl', theme: 'light' | 'dark' = 'light') => { await renderApp({ saved: await savedWorld(names, locale, theme), locale }); await flushAll(20); };
/** „📍” → wybór miejsca w arkuszu akcji (jak w aplikacji). */
const pickPlace = async (name: string) => {
  const sh = await openPlaceSheet(); const i = (sh.opts.options as string[]).indexOf(name); expect(i).toBeGreaterThanOrEqual(0);
  await act(async () => { sh.cb(i); }); await flushAll(20);
};
const toggle = async (i: number, v: boolean) => { await act(async () => { fireEvent(screen.getAllByRole('switch')[i], 'valueChange', v); }); await flushAll(5); };
const rowsText = () => screen.queryAllByText(/ → /).map(n => n.props.children as string);

describe('okno „Dostosuj do: X”', () => {
  test('po zmianie „📍” na miejsce z brakami okno otwiera się samo: tytuł, stała linijka, wiersze „A → B” z powodem, „Anuluj” po lewej, „Zastosuj (n)” po prawej', async () => {
    await boot(); expect(top()).toBe('(tabs)'); await pickPlace('Hotel');
    expect(top()).toBe('adapt'); expect(screen.getByText('Zamiany tylko w tym treningu — szablon i plan bez zmian.')).toBeTruthy();
    expect(screen.getByText('Ćwiczenia bez sprzętu')).toBeTruthy();
    const r = rowsText(); expect(r).toHaveLength(3); expect(r[0]).toMatch(/^Bench Press \(sztanga\) → .+/); expect(r[1]).toMatch(/^Overhead Press \(sztanga\) → /); expect(r[2]).toMatch(/^Pull Up → /);
    expect(screen.getAllByText(/brak: /).length).toBe(3);
    const close = screen.getByTestId('close-modal'); expect(close.props.accessibilityLabel).toBe('Anuluj'); const ap = screen.getByTestId('adapt-apply'); expect(ap.props.accessibilityLabel).toBe('Zastosuj (3)'); expect(ap.props.accessibilityRole).toBe('button');
    expect(S().active!.locationId).toBe(HOTEL); expect(blk(0).exerciseId).toBe(ex('Bench Press (sztanga)').id); /* sama zmiana miejsca niczego nie zamienia */
  });
  test('„Anuluj” zamyka okno bez zmian w treningu; pod chipem zostaje wiersz „3 ćwiczenia bez sprzętu · Dostosuj”, który otwiera okno ponownie', async () => {
    await boot(); await pickPlace('Hotel'); const before = JSON.stringify(S().active!.exercises);
    await tap(screen.getByTestId('close-modal')); await flushAll(20); expect(top()).toBe('(tabs)'); expect(JSON.stringify(S().active!.exercises)).toBe(before);
    const line = screen.getByTestId('adapt-line'); expect(line.props.accessibilityLabel).toBe('3 ćwiczenia bez sprzętu · Dostosuj'); expect(line.props.accessibilityRole).toBe('button'); expect(line.props.accessibilityHint).toBe('Otwiera propozycje zamian na to miejsce.');
    await tap(line); await flushAll(20); expect(top()).toBe('adapt'); expect(rowsText()).toHaveLength(3);
  });
  test('start z miejscem z brakami: wiersz pod chipem jest od razu, okno samo się nie otwiera; na siłowni wiersza nie ma', async () => {
    await fresh(undefined, 'pl'); const s = S().settings; s.locations = [loc('Siłownia', presetEquipment('gym'), GYM), loc('Hotel', presetEquipment('hotel'), HOTEL)]; s.mainLocationId = HOTEL;
    const tpl = store.newTemplate(); tpl.name = 'FBW'; tpl.items = FBW.map(([n, id]) => item(n, id)); store.save(tpl); store.startFromTemplate(tpl); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(S())) }); await flushAll(20);
    expect(top()).toBe('(tabs)'); expect(screen.getByTestId('adapt-line').props.accessibilityLabel).toBe('3 ćwiczenia bez sprzętu · Dostosuj');
    await pickPlace('Siłownia'); expect(top()).toBe('(tabs)'); expect(screen.queryByTestId('adapt-line')).toBeNull(); /* siłownia: wszystko dostępne — bez okna i bez wiersza */
  });
  test('zmiana miejsca na takie bez braków (np. tylko ćwiczenia z masą ciała) — okno się nie otwiera i wiersza nie ma', async () => {
    await boot([['Push Up', 'p1'], ['Plank', 'p2']]); await pickPlace('Hotel'); expect(top()).toBe('(tabs)'); expect(screen.queryByTestId('adapt-line')).toBeNull();
  });
  test('liczba mnoga wiersza pod chipem: 1 ćwiczenie / 3 ćwiczenia / 5 ćwiczeń (tp)', async () => {
    await boot([['Bench Press (sztanga)', 'b'], ['RDL (hantle/linki)', 'r']]); await pickPlace('Hotel'); await tap(screen.getByTestId('close-modal')); await flushAll(20);
    expect(screen.getByTestId('adapt-line').props.accessibilityLabel).toBe('1 ćwiczenie bez sprzętu · Dostosuj');
  });
  test('5 ćwiczeń bez sprzętu: „5 ćwiczeń bez sprzętu · Dostosuj”', async () => {
    await boot([...FBW.slice(0, 3), ['Back Squat', 'sq'], ['Leg Press', 'lp']]); await pickPlace('Hotel'); await tap(screen.getByTestId('close-modal')); await flushAll(20);
    expect(screen.getByTestId('adapt-line').props.accessibilityLabel).toBe('5 ćwiczeń bez sprzętu · Dostosuj');
  });
});

describe('arkusz zamiany z celem adapt: i zastosowanie', () => {
  test('stuknięcie wiersza otwiera arkusz: „Bez zmian” i „Pomiń dziś”, propozycje od ćwiczenia z planu, brak „cofnij zamianę”; wybór wraca do okna i NIC nie zapisuje', async () => {
    await boot(); await pickPlace('Hotel'); const before = JSON.stringify(S().active!.exercises);
    await tap(screen.getAllByText(/^Bench Press \(sztanga\) → /)[0]); await flushAll(20); expect(top()).toBe('swap');
    expect(screen.getByText('Bez zmian')).toBeTruthy(); expect(screen.getByLabelText('Pomiń dziś: Bench Press (sztanga)')).toBeTruthy(); expect(screen.queryByLabelText(/^Cofnij zamianę/)).toBeNull();
    const props = screen.getAllByLabelText(/^Propozycja \d: /); expect(props.length).toBeGreaterThan(0); expect(screen.queryByLabelText(/^Propozycja \d: Bench Press \(sztanga\)/)).toBeNull();
    const second = props[Math.min(1, props.length - 1)]; const label = second.props.accessibilityLabel as string; const name = /^Propozycja \d: ([^,]+)/.exec(label)![1];
    await tap(second); await flushAll(20); expect(top()).toBe('adapt'); expect(screen.getByText(new RegExp(`^Bench Press \\(sztanga\\) → ${name.replace(/[()]/g, '\\$&')}`))).toBeTruthy(); expect(screen.getByText(/wybrane ręcznie/)).toBeTruthy();
    expect(JSON.stringify(S().active!.exercises)).toBe(before);
  });
  test('„Bez zmian” zdejmuje blok z listy zastosowań (Zastosuj (2)); „Pomiń dziś” pomija blok po „Zastosuj”', async () => {
    await boot(); await pickPlace('Hotel');
    await tap(screen.getAllByText(/^Bench Press \(sztanga\) → /)[0]); await flushAll(20); await tap(screen.getByText('Bez zmian')); await flushAll(20);
    expect(top()).toBe('adapt'); expect(screen.getByText('Bench Press (sztanga) → Bez zmian')).toBeTruthy(); expect(screen.getByTestId('adapt-apply').props.accessibilityLabel).toBe('Zastosuj (2)');
    await tap(screen.getAllByText(/^Pull Up → /)[0]); await flushAll(20); await tap(screen.getByLabelText('Pomiń dziś: Pull Up')); await flushAll(20);
    expect(screen.getByText('Pull Up → Pomiń dziś')).toBeTruthy(); expect(screen.getByTestId('adapt-apply').props.accessibilityLabel).toBe('Zastosuj (2)');
    await tap(screen.getByTestId('adapt-apply')); await flushAll(20);
    expect(top()).toBe('(tabs)'); expect(blk(0).exerciseId).toBe(ex('Bench Press (sztanga)').id); expect(blk(0).swappedFrom).toBeUndefined();
    expect(blk(1).swappedFrom).toBe(ex('Overhead Press (sztanga)').id); expect(blk(2).skipped).toBe(true); expect(blk(3).exerciseId).toBe(ex('RDL (hantle/linki)').id);
  });
  test('spójność (docs/32): „Pomiń dziś” w oknie przy trwającym stoperze serii pyta jak pojedyncze „Pomiń dziś”; Anuluj → bez zmian i bez zapisu; potwierdzenie → pominięto, stoper zatrzymany', async () => {
    await boot(); await pickPlace('Hotel');
    await tap(screen.getAllByText(/^Pull Up → /)[0]); await flushAll(20); await tap(screen.getByLabelText('Pomiń dziś: Pull Up')); await flushAll(20);
    await act(async () => { await timer.startSet(blk(2).sets[0].id, 0); }); expect(timer.S.on).toBe(true);
    const saves = jest.spyOn(store, 'save'); const before = JSON.stringify(S().active);
    await tap(screen.getByTestId('adapt-apply')); await flushAll(5);
    const q = global.__alerts.at(-1)!; expect(q.title).toBe('Trwa pomiar serii'); expect(q.msg).toBe('Pominięcie ćwiczenia przerwie pomiar — ten czas się nie zapisze.');
    await act(async () => { pressAlert('Trwa pomiar serii', 'Anuluj'); }); await flushAll(5);
    expect(top()).toBe('adapt'); expect(timer.S.on).toBe(true); expect(JSON.stringify(S().active)).toBe(before); expect(saves).not.toHaveBeenCalled(); saves.mockRestore();
    await tap(screen.getByTestId('adapt-apply')); await flushAll(5); await act(async () => { pressAlert('Trwa pomiar serii', 'Pomiń dziś'); }); await flushAll(20);
    expect(top()).toBe('(tabs)'); expect(blk(2).skipped).toBe(true); expect(timer.S.on).toBe(false);
  });
  test('„Zastosuj”: bloki zamienione („zamiast: A”), jeden zapis, szablon bez zmian, ogłoszenie VoiceOver „Zamieniono 3 ćwiczenia”; wiersz pod chipem znika', async () => {
    const spy = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => {});
    await boot(); const tpl = JSON.stringify(S().templates); await pickPlace('Hotel'); await tap(screen.getByTestId('adapt-apply')); await flushAll(20);
    expect(top()).toBe('(tabs)'); expect(spy).toHaveBeenCalledWith('Zamieniono 3 ćwiczenia');
    for (let i = 0; i < 3; i++) expect(blk(i).swappedFrom).toBeTruthy(); expect(screen.getAllByText(/zamiast: /).length).toBe(3);
    expect(JSON.stringify(S().templates)).toBe(tpl); expect(screen.queryByTestId('adapt-line')).toBeNull();
    spy.mockRestore();
  });
  test('liczba mnoga ogłoszenia: 1 ćwiczenie', async () => {
    const spy = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => {});
    await boot([['Bench Press (sztanga)', 'b'], ['RDL (hantle/linki)', 'r']]); await pickPlace('Hotel'); await tap(screen.getByTestId('adapt-apply')); await flushAll(20);
    expect(spy).toHaveBeenCalledWith('Zamieniono 1 ćwiczenie'); spy.mockRestore();
  });
});

describe('„Wraca z planu” i potwierdzenie C7', () => {
  const swapped = async () => { await boot(); await pickPlace('Hotel'); await tap(screen.getByTestId('adapt-apply')); await flushAll(20); };
  test('powrót na siłownię: okno otwiera się samo, sekcja „Wraca z planu” z przełącznikami (domyślnie włączone), „Zastosuj (3)” przywraca ćwiczenia z planu', async () => {
    await swapped(); await pickPlace('Siłownia'); expect(top()).toBe('adapt');
    expect(screen.getByText('Wraca z planu')).toBeTruthy(); expect(screen.queryByText('Ćwiczenia bez sprzętu')).toBeNull(); expect(screen.getAllByRole('switch')).toHaveLength(3);
    for (const sw of screen.getAllByRole('switch')) expect(sw.props.accessibilityState.checked).toBe(true);
    expect(screen.getByTestId('adapt-apply').props.accessibilityLabel).toBe('Zastosuj (3)');
    await tap(screen.getByTestId('adapt-apply')); await flushAll(20);
    expect(blk(0).exerciseId).toBe(ex('Bench Press (sztanga)').id); expect(blk(0).swappedFrom).toBeUndefined(); expect(blk(2).exerciseId).toBe(ex('Pull Up').id);
  });
  test('wyłączenie przełącznika zdejmuje blok z listy; wszystkie wyłączone — brak przycisku „Zastosuj”', async () => {
    await swapped(); await pickPlace('Siłownia');
    await toggle(0, false);
    expect(screen.getByTestId('adapt-apply').props.accessibilityLabel).toBe('Zastosuj (2)');
    await toggle(1, false); await toggle(2, false);
    expect(screen.queryByTestId('adapt-apply')).toBeNull(); expect(screen.getByTestId('close-modal')).toBeTruthy();
  });
  test('C7: wpisane wartości zamiennika → pytanie „Cofnąć zamianę?” [Anuluj, Cofnij]; Anuluj nic nie zmienia, Cofnij przywraca', async () => {
    await swapped(); await act(async () => { blk(0).sets[0].weight = 20; blk(0).sets[0].edited = true; store.save(S().active); }); await flushAll(5);
    await pickPlace('Siłownia'); const ex0 = blk(0).exerciseId;
    await tap(screen.getByTestId('adapt-apply')); await flushAll(5);
    const a = (global as any).__alerts.at(-1); expect(a.title).toBe('Cofnąć zamianę?'); expect(a.msg).toBe('Wpisane wartości zamiennika przepadną.'); expect(a.buttons.map((b: { text: string }) => b.text)).toEqual(['Anuluj', 'Cofnij']);
    expect(top()).toBe('adapt'); expect(blk(0).exerciseId).toBe(ex0);
    await act(async () => { pressAlert('Cofnąć zamianę?', 'Anuluj'); }); await flushAll(5); expect(top()).toBe('adapt'); expect(blk(0).exerciseId).toBe(ex0);
    await tap(screen.getByTestId('adapt-apply')); await flushAll(5); await act(async () => { pressAlert('Cofnąć zamianę?', 'Cofnij'); }); await flushAll(20);
    expect(top()).toBe('(tabs)'); expect(blk(0).exerciseId).toBe(ex('Bench Press (sztanga)').id);
  });
  test('wyłączony przełącznik bloku z wpisanymi wartościami — bez pytania C7', async () => {
    await swapped(); await act(async () => { blk(0).sets[0].weight = 20; blk(0).sets[0].edited = true; store.save(S().active); }); await flushAll(5);
    const n = (global as any).__alerts.length; await pickPlace('Siłownia'); await toggle(0, false);
    await tap(screen.getByTestId('adapt-apply')); await flushAll(20); expect((global as any).__alerts.length).toBe(n); expect(top()).toBe('(tabs)'); expect(blk(0).swappedFrom).toBeTruthy(); expect(blk(1).swappedFrom).toBeUndefined();
  });
});

describe('stany brzegowe okna', () => {
  test('nic do dostosowania: „Wszystkie ćwiczenia są dostępne w: Siłownia”, tylko „Anuluj”', async () => {
    await boot(); await go('/adapt'); await flushAll(20); expect(top()).toBe('adapt');
    expect(screen.getByText('Wszystkie ćwiczenia są dostępne w: Siłownia')).toBeTruthy(); expect(screen.queryByTestId('adapt-apply')).toBeNull(); expect(screen.getByTestId('close-modal')).toBeTruthy();
    await tap(screen.getByTestId('close-modal')); await flushAll(20); expect(top()).toBe('(tabs)');
  });
  test('bez treningu w toku: „Nie ma treningu w toku.” i „Anuluj” zamykające okno', async () => {
    await fresh(undefined, 'pl'); await store.flush(); await renderApp({ saved: JSON.parse(JSON.stringify(S())) }); await flushAll(10); await go('/adapt'); await flushAll(20);
    expect(top()).toBe('adapt'); expect(screen.getByText('Nie ma treningu w toku.')).toBeTruthy(); await tap(screen.getByTestId('close-modal')); await flushAll(20); expect(top()).toBe('(tabs)');
  });
  test('arkusz zamiany adapt: dla nieistniejącego bloku — „Tego ćwiczenia nie da się już zamienić.”', async () => {
    await boot(); await go('/swap?target=adapt:nie-ma'); await flushAll(20); expect(screen.getByText('Tego ćwiczenia nie da się już zamienić.')).toBeTruthy();
  });
  test('restart z otwartym oknem — nic nie zastosowano (stan z zapisu bez zamian)', async () => {
    await boot(); await pickPlace('Hotel'); await store.flush(); const st = JSON.parse(JSON.stringify(S())); await fresh(st); expect(S().active!.exercises.every(e => !e.swappedFrom && !e.skipped)).toBe(true);
  });
});

describe.each([['pl', 'light'], ['en', 'dark']] as const)('okno w języku %s, motyw %s', (locale, theme) => {
  test('nagłówek, linijka, wiersze i przyciski — bez polskich tekstów w EN', async () => {
    await boot(undefined, locale, theme); await openPlaceSheet();
    const sh = (global as any).__sheets.at(-1); const i = (sh.opts.options as string[]).indexOf('Hotel'); await act(async () => { sh.cb(i); }); await flushAll(20);
    expect(top()).toBe('adapt');
    if (locale === 'pl') { expect(screen.getByText('Zamiany tylko w tym treningu — szablon i plan bez zmian.')).toBeTruthy(); expect(screen.getByTestId('adapt-apply').props.accessibilityLabel).toBe('Zastosuj (3)'); expect(screen.getByTestId('close-modal').props.accessibilityLabel).toBe('Anuluj'); }
    else {
      expect(screen.getByText('Swaps apply to this workout only — your template and plan stay as they are.')).toBeTruthy(); expect(screen.getByText('Exercises without equipment')).toBeTruthy();
      expect(screen.getByTestId('adapt-apply').props.accessibilityLabel).toBe('Apply (3)'); expect(screen.getByTestId('close-modal').props.accessibilityLabel).toBe('Cancel');
      expect(screen.queryByText(/Zamiany|Anuluj|Zastosuj|bez sprzętu/)).toBeNull();
    }
  });
});

describe('dopiski wierszy, podpowiedzi i tytuł okna', () => {
  /** Jak `boot`, ale z możliwością zmiany szablonu (zamienniki per miejsce, własne ćwiczenia) przed startem treningu. */
  async function bootWith(build: (tpl: ReturnType<typeof store.newTemplate>) => void, names: [string, string][] = FBW) {
    await fresh(undefined, 'pl'); const s = S().settings;
    s.locations = [loc('Siłownia', presetEquipment('gym'), GYM), loc('Hotel', presetEquipment('hotel'), HOTEL), loc('Dom', presetEquipment('bodyweight'), DOM)]; s.mainLocationId = GYM;
    const tpl = store.newTemplate(); tpl.name = 'FBW'; tpl.items = names.map(([n, id]) => item(n, id)); build(tpl); store.save(tpl); store.startFromTemplate(tpl); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(S())) }); await flushAll(20);
  }
  test('zamiennik z szablonu dla miejsca (W3) — wiersz z dopiskiem „zamiennik z szablonu dla tego miejsca”, domyślnie zaznaczony; po ręcznej zmianie dopisek znika', async () => {
    await bootWith(tpl => { tpl.items[0].alternates = [{ locationId: HOTEL, exerciseId: ex('Incline Bench Press (hantle)').id, restSec: 75 }]; });
    await pickPlace('Hotel'); expect(screen.getByText('Bench Press (sztanga) → Incline Bench Press (hantle)')).toBeTruthy(); expect(screen.getByText(/zamiennik z szablonu dla tego miejsca/)).toBeTruthy();
    await tap(screen.getByText('Bench Press (sztanga) → Incline Bench Press (hantle)')); await flushAll(20); await tap(screen.getByText('Bez zmian')); await flushAll(20);
    expect(screen.queryByText(/zamiennik z szablonu dla tego miejsca/)).toBeNull(); expect(screen.getByText('Bench Press (sztanga) → Bez zmian')).toBeTruthy();
    await tap(screen.getByTestId('adapt-apply')); await flushAll(20); expect(blk(0).restSec).toBe(120); /* wybrano „Bez zmian” dla bloku 0 — bez przerwy z zamiennika */
  });
  test('zastosowanie zamiennika z szablonu niesie jego przerwę (75 s)', async () => {
    await bootWith(tpl => { tpl.items[0].alternates = [{ locationId: HOTEL, exerciseId: ex('Incline Bench Press (hantle)').id, restSec: 75 }]; });
    await pickPlace('Hotel'); await tap(screen.getByTestId('adapt-apply')); await flushAll(20); expect(blk(0).exerciseId).toBe(ex('Incline Bench Press (hantle)').id); expect(blk(0).restSec).toBe(75);
  });
  test('P3 A: trzy bloki tego samego ćwiczenia — drugi i trzeci z dopiskiem „następna propozycja — pierwsza jest już zajęta…”', async () => {
    await bootWith(() => {}, [['Bench Press (sztanga)', 'b1'], ['Bench Press (sztanga)', 'b2'], ['Bench Press (sztanga)', 'b3']]);
    await pickPlace('Hotel'); expect(screen.getAllByText(/następna propozycja — pierwsza jest już zajęta przez inne ćwiczenie/)).toHaveLength(2); expect(screen.queryByText(/ta sama propozycja co przy innym ćwiczeniu/)).toBeNull();
    const to = rowsText().map(r => r.split(' → ')[1]); expect(new Set(to).size).toBe(3);
  });
  test('P3 A: gdy rankingu zabraknie — drugi wiersz powtarza propozycję z dopiskiem „ta sama propozycja co przy innym ćwiczeniu — możesz zmienić”', async () => {
    await fresh(undefined, 'pl'); const s = S().settings;
    const mk = (n: string, requires?: string[][]) => { const e = store.newExercise(n); e.group = 'inne'; e.muscles = ['testowy-mięsień' as never]; if (requires) e.requires = requires; store.save(e); return e; };
    const a = mk('Test A', [['barbell']]); mk('Test Zamiennik');
    s.locations = [loc('Siłownia', presetEquipment('gym'), GYM), loc('Hotel', presetEquipment('hotel'), HOTEL)]; s.mainLocationId = GYM;
    const tpl = store.newTemplate(); tpl.name = 'T'; tpl.items = [{ ...item('Bench Press (sztanga)', 'x1'), exerciseId: a.id }, { ...item('Bench Press (sztanga)', 'x2'), exerciseId: a.id }]; store.save(tpl); store.startFromTemplate(tpl); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(S())) }); await flushAll(20); await pickPlace('Hotel');
    expect(screen.getAllByText('Test A → Test Zamiennik')).toHaveLength(2); expect(screen.getAllByText(/ta sama propozycja co przy innym ćwiczeniu — możesz zmienić/)).toHaveLength(1);
  });
  test('wiersze mają podpowiedź „Otwiera wybór zamiennika.”, „Bez zmian” w arkuszu — podpis „zostaje to ćwiczenie” i etykietę z nazwą ćwiczenia', async () => {
    await boot(); await pickPlace('Hotel'); const row = screen.getAllByLabelText(/^Bench Press \(sztanga\) → /)[0]; expect(row.props.accessibilityHint).toBe('Otwiera wybór zamiennika.'); expect(row.props.accessibilityRole).toBe('button');
    await tap(row); await flushAll(20); expect(screen.getByText('zostaje to ćwiczenie')).toBeTruthy(); const none = screen.getByLabelText('Bez zmian: Bench Press (sztanga)'); expect(none.props.accessibilityRole).toBe('button');
    await tap(none); await flushAll(20); expect(screen.getByText('Bench Press (sztanga) → Bez zmian')).toBeTruthy();
  });
  test('„Wraca z planu”: podpis przełącznika „wraca do ćwiczenia z planu”, a przy wpisanych wartościach „wpisane wartości zamiennika przepadną”', async () => {
    await boot(); await pickPlace('Hotel'); await tap(screen.getByTestId('adapt-apply')); await flushAll(20);
    await act(async () => { blk(1).sets[0].weight = 20; blk(1).sets[0].edited = true; store.save(S().active); }); await flushAll(5); await pickPlace('Siłownia');
    expect(screen.getAllByText('wraca do ćwiczenia z planu')).toHaveLength(2); expect(screen.getAllByText('wpisane wartości zamiennika przepadną')).toHaveLength(1);
    const sw = screen.getAllByRole('switch'); expect(sw).toHaveLength(3); expect(sw[1].props.accessibilityHint).toBe('wpisane wartości zamiennika przepadną');
  });
  test('tytuł okna: „Dostosuj do: Hotel” przy treningu, „Dostosuj do miejsca” w trasie z układu (bez treningu)', async () => {
    const title = () => require('expo-router/build/global-state/router-store').store.navigationRef.getCurrentOptions().title as string;
    await boot(); await pickPlace('Hotel'); expect(title()).toBe('Dostosuj do: Hotel');
    await tap(screen.getByTestId('close-modal')); await flushAll(20); await act(async () => { store.cancelWorkout(); }); await flushAll(10); await go('/adapt'); await flushAll(20); expect(title()).toBe('Dostosuj do miejsca');
  });
});
