/* P-003 E1 (D, E): ekrany miejsc treningu, chip miejsca w treningu, filtr w wyborze ćwiczenia, plakietka braku sprzętu, szablon. */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { fireEvent } from '@testing-library/react-native';
import { fresh, ex, addWorkout, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, go, tap, type, act, expandEquip, deleteActions, startEdit, saveEdit } from './app';
import { userHome } from './locations-fixtures';
import { addLocation } from '@/lib/locations';

jest.setTimeout(60000);
afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });

const toggle = async (label: string | RegExp, v: boolean) => { await act(async () => { fireEvent(screen.getAllByLabelText(label)[0], 'valueChange', v); }); await flushAll(5); };
/** Zapisany stan z domem użytkownika (główne) i siłownią; opcjonalnie trening w toku w domu. */
/** demo: szablony demonstracyjne (świeża instalacja nie ma szablonów od 03.10.2026) */
async function savedWithPlaces(active = false, demo = false) {
  await fresh(); if (demo) withDemoTemplates(); const s = store.getState().settings; const home = userHome([2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]); s.locations.push(home); s.mainLocationId = home.id; addLocation('gym', 'Siłownia');
  if (active) { store.startEmpty(); }
  await store.flush(); return JSON.parse(JSON.stringify(store.getState()));
}

describe('bez miejsc — ekrany jak dotąd', () => {
  test('trening bez chipu miejsca; wybór ćwiczenia bez przełącznika i bez dopisków „brak:”', async () => {
    await renderApp(); await act(async () => { store.startEmpty(); }); await flushAll(10);
    expect(screen.queryByLabelText(/^Miejsce treningu:/)).toBeNull();
    await go('/picker?target=active'); await flushAll(10);
    await tap(screen.getAllByText('nogi')[0]); await flushAll(5); /* pełna baza (04.10): lista wirtualizowana — grupa zamiast przewijania */
    expect(screen.queryByLabelText(/^Filtr miejsca/)).toBeNull(); expect(screen.queryAllByText(/brak:/)).toHaveLength(0); expect(screen.getByText('Back Squat')).toBeTruthy();
  });
  test('Ustawienia → Miejsca treningu: pusta lista z wyjaśnieniem', async () => {
    await renderApp(); await go('/more/settings'); await flushAll(10); await tap(screen.getByText('Miejsca i sprzęt')); await flushAll(10);
    expect(screen.getByText(/Brak miejsc — wszystkie ćwiczenia są dostępne/)).toBeTruthy();
  });
});

describe('Ustawienia → Miejsca treningu', () => {
  test('„+ Dodaj miejsce” → Dom (pusto) → pierwsze miejsce jest główne; sprzęt zapisuje się od razu; opcje pod pozycją', async () => {
    await renderApp(); await go('/more/locations'); await flushAll(10);
    await tap(screen.getByText('+ Dodaj miejsce')); await tap(screen.getByText('Dom')); await flushAll(10);
    const s = store.getState().settings; expect(s.locations).toHaveLength(1); expect(s.mainLocationId).toBe(s.locations[0].id);
    expect(screen.getByText(/Miejsce główne/)).toBeTruthy(); expect(screen.getByText(`Dostępne ćwiczenia: ${store.getState().exercises.filter(e => !(e.requires ?? []).length).length} z 709`)).toBeTruthy(); /* research 09.10.2026: 709 ćwiczeń */
    await expandEquip(); await toggle('Ławka regulowana', true); expect(s.locations[0].equipment.map(e => e.item)).toEqual(['bench_adj']);
    await toggle('Ławka regulowana: ze skosem w dół', true); /* audyt M7: opcja z nazwą pozycji */ expect(s.locations[0].equipment[0].opts).toEqual(['decline']);
    await toggle('Drążek do podciągania (rozporowy, ścienny)', true); expect(screen.getByText(/Dostępne ćwiczenia: \d+ z 709/)).toBeTruthy();
    await flushAll(400); expect(JSON.parse(global.__kv.get('state')!).settings.locations[0].equipment).toHaveLength(2); /* zapis bez „Wróć” */
  });
  test('hantle: „wypełnij zakresem” 2–24 co 2, odznaczenie 4 kg, dodanie 5 kg; podsumowanie dostępnych', async () => {
    const saved = await savedWithPlaces(); await renderApp({ saved }); await go('/more/location/home'); await flushAll(10); await expandEquip();
    await toggle('Hantle (stała waga albo z szybką regulacją)', false); await toggle('Hantle (stała waga albo z szybką regulacją)', true);
    const db = () => store.getState().settings.locations[0].equipment.find(e => e.item === 'db_fixed')!;
    expect((db().load as any).items).toHaveLength(12); expect(db().off).toBeUndefined(); /* audyt M5: odznaczenie i ponowne zaznaczenie nie kasuje listy */
    await type(screen.getAllByLabelText('od')[0], '2'); await type(screen.getAllByLabelText('do')[0], '24'); await type(screen.getAllByLabelText('co')[0], '2');
    await tap(screen.getByLabelText('Wypełnij zakresem — Hantle (stała waga albo z szybką regulacją)')); expect((db().load as any).items).toHaveLength(12);
    const c4 = screen.getByLabelText('4 kg'); expect(c4.props.accessibilityRole).toBe('switch'); /* audyt M7: ciężar jako przełącznik */ await tap(c4); expect(screen.getByLabelText('4 kg').props.accessibilityState.checked).toBe(false); expect((db().load as any).items.find((x: any) => x.w === 4).on).toBe(false);
    await type(screen.getAllByLabelText('dodaj ciężar')[0], '5'); await tap(screen.getByLabelText('Dodaj ciężar — Hantle (stała waga albo z szybką regulacją)'));
    expect(screen.getByText('dostępne: 12 (2–24 kg)')).toBeTruthy();
  });
  test('stacja elektryczna: preset ViShape Pro; hantle na talerze: Hop-Sport — podsumowanie pary i jednego hantla', async () => {
    const saved = await savedWithPlaces(); await renderApp({ saved }); await go('/more/location/home'); await flushAll(10); await expandEquip();
    expect(screen.getByText('Ustawienia na stronę: 128 (1,5–65 kg)')).toBeTruthy();
    await toggle('Hantle na talerze (uchwyty + talerze)', true); await tap(screen.getByText('Hantle z talerzami 2×10 kg')); await flushAll(5);
    expect(screen.getByText('para: 8 (1,5–10 kg); jeden hantel: 21 (1,5–18,5 kg)')).toBeTruthy();
  });
  test('ustaw jako główne, duplikuj, usuń: głównego nie da się usunąć, dopóki jest inne', async () => {
    const saved = await savedWithPlaces(); await renderApp({ saved });
    /* 07.10.2026 wieczór: usuwanie przesunięciem na liście miejsc — główne (gdy jest inne) nie ma akcji „usuń” */
    await go('/more/locations'); await flushAll(10); expect(deleteActions()).toEqual(['Usuń miejsce: Siłownia']);
    await go('/more/location/home'); await flushAll(10); await expandEquip(); expect(screen.queryByText('Usuń')).toBeNull();
    const gym = store.getState().settings.locations[1]; await go(`/more/location/${gym.id}`); await flushAll(10); await expandEquip();
    await tap(screen.getByText('Ustaw jako główne')); expect(store.getState().settings.mainLocationId).toBe(gym.id);
    await tap(screen.getByText('Duplikuj')); await flushAll(10); expect(store.getState().settings.locations.map(l => l.name)).toEqual(['Dom', 'Siłownia', 'Siłownia (kopia)']);
  });
});

describe('trening i wybór ćwiczenia w miejscu', () => {
  test('chip „📍 Dom ▾” i zmiana miejsca tylko dla tej sesji', async () => {
    const saved = await savedWithPlaces(true); await renderApp({ saved }); await flushAll(10);
    const chip = screen.getByLabelText('Miejsce treningu: Dom'); expect(screen.getByText('📍 Dom ▾')).toBeTruthy();
    await tap(chip); await act(async () => { (global as any).__pickSheet(1); }); await flushAll(5);
    expect(store.getState().active!.locationId).toBe(store.getState().settings.locations[1].id); expect(store.getState().settings.mainLocationId).toBe('home');
    expect(screen.getByText('📍 Siłownia ▾')).toBeTruthy();
  });
  test('wybór ćwiczenia: domyślnie tylko dostępne w Dom; „Pokaż wszystkie” zapamiętany, niedostępne wyszarzone z „brak: …”', async () => {
    const saved = await savedWithPlaces(true); await renderApp({ saved }); await go('/picker?target=active'); await flushAll(10);
    expect(screen.getByText('Bench Press (hantle)')).toBeTruthy(); expect(screen.getByText(/tylko dostępne w: Dom · ukryte: \d+$/)).toBeTruthy(); expect(screen.getByText(/^niszowe ukryte: \d+/)).toBeTruthy(); /* research 09.10.2026: najpierw filtr „Podstawowe”, potem miejsce */
    await tap(screen.getAllByText('nogi')[0]); await flushAll(5); expect(screen.queryByText('Back Squat')).toBeNull(); /* pełna baza: lista wirtualizowana — grupa */
    await tap(screen.getByLabelText(/^Filtr miejsca: Dom/)); /* decyzja 04.10: filtr-etykieta zamiast przełącznika */ expect(store.getState().settings.pickerShowAll).toBe(true);
    expect(screen.getByText('Back Squat')).toBeTruthy(); expect(screen.getAllByText('sztanga · brak: sztanga, klatka / stojaki').length).toBeGreaterThanOrEqual(3); /* Back/Front/Box Squat, Good Morning */
    await tap(screen.getByText('Back Squat')); await flushAll(10);
    expect(store.getState().active!.exercises.map(e => ex('Back Squat').id === e.exerciseId)).toEqual([true]);
    expect(screen.getByText('brak sprzętu w: Dom (sztanga, klatka / stojaki)')).toBeTruthy(); /* plakietka, bez automatycznej zamiany */
  });
  test('wyszukanie dokładnej nazwy pokazuje ćwiczenie mimo filtra (bez propozycji duplikatu)', async () => {
    const saved = await savedWithPlaces(true); await renderApp({ saved }); await go('/picker?target=active'); await flushAll(10);
    await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'back squat'); await flushAll(5);
    expect(screen.getByText('Back Squat')).toBeTruthy(); expect(screen.queryByText(/^Utwórz/)).toBeNull();
  });
  test('podpowiedź „↑” z ciężarów domu i dopisek, gdy „Poprzednio” jest z innego miejsca', async () => {
    await fresh(); const s = store.getState().settings; const home = userHome([2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]); s.locations.push(home); s.mainLocationId = home.id; const gym = addLocation('gym', 'Siłownia');
    addWorkout(Date.now() - 86400e3, [['Biceps Curl (hantle)', [{ weight: 10, reps: 12 }, { weight: 10, reps: 12 }]]]).locationId = gym.id;
    const tpl = store.newTemplate(); tpl.name = 'Ręce'; tpl.items.push({ id: 'i1', exerciseId: ex('Biceps Curl (hantle)').id, sets: 2, repMin: 10, repMax: 12, restSec: null, startWeight: '', targetSec: '', groupId: null }); store.save(); store.startFromTemplate(tpl); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await flushAll(10);
    expect(screen.getByText(/↑ spróbuj 12 kg/)).toBeTruthy(); /* decyzja 7a: od razu następny dostępny (10 → 12) */ expect(screen.queryByText(/ten sam ciężar/)).toBeNull(); expect(screen.getByText('Poprzednio: Siłownia')).toBeTruthy();
  });
  test('szablon: miejsce domyślne (chipy) i start treningu w tym miejscu', async () => {
    const saved = await savedWithPlaces(false, true); await renderApp({ saved }); const tpl = store.getState().templates[0]; await go(`/template/${tpl.id}`); await flushAll(10); await startEdit();
    expect(screen.getByText('Miejsce domyślne')).toBeTruthy(); await tap(screen.getByText('Siłownia')); await saveEdit(); expect(store.getState().templates[0].locationId).toBe(store.getState().settings.locations[1].id);
    expect(screen.getByText(/📍 Siłownia/)).toBeTruthy(); /* podgląd: miejsce domyślne */
    await tap(screen.getByText('Start')); await flushAll(10); expect(store.getState().active!.locationId).toBe(store.getState().settings.locations[1].id);
    expect(screen.getByText('📍 Siłownia ▾')).toBeTruthy();
  });
  test('picker w edycji szablonu z miejscem domyślnym filtruje po tym miejscu', async () => {
    const saved = await savedWithPlaces(false, true); saved.templates[0].locationId = 'home'; await renderApp({ saved }); await go(`/picker?target=template:${saved.templates[0].id}`); await flushAll(10);
    expect(screen.getByText(/tylko dostępne w: Dom/)).toBeTruthy(); expect(screen.queryByText('Leg Press')).toBeNull();
  });
});
