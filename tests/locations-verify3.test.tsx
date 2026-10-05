/* P-003 E1 — weryfikacja 3 audytu: 5 uwag LOW. */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as L from '@/lib/locations';
import { achievable, convertSpec, type LoadSpec } from '@/lib/loads';
import { availability, loadsFor } from '@/lib/equipment';
import { CATALOG } from '@/lib/catalog.generated';
import { fresh, ex, addWorkout, pressAlert } from './helpers';
import { renderApp, flushAll, screen, go, tap, act, expandEquip } from './app';
import { userHome, presetSpec } from './locations-fixtures';

jest.setTimeout(60000);
afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
const HOME = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
function homeAndGym() { const s = store.getState().settings; const h = userHome(HOME); s.locations.push(h); s.mainLocationId = h.id; const gym = L.addLocation('gym', 'Siłownia'); store.save(); return { h, gym }; }

describe('L1: odhaczone serie bez ciężaru', () => {
  test('okno „Zakończyć trening?” ostrzega o seriach bez ciężaru; przy ćwiczeniu dopisek, że ciężaru z innego miejsca tu nie ma', async () => {
    await fresh(); const { gym } = homeAndGym();
    addWorkout(Date.now() - 86400e3, [['Bench Press (hantle)', [{ weight: 32, reps: 8 }]]]).locationId = gym.id; store.save();
    store.startEmpty(); store.addExerciseToActive(ex('Bench Press (hantle)')); store.addExerciseToActive(ex('Pull Up'));
    const a = store.getState().active!; a.exercises[0].sets[0].reps = 8; store.toggleDone(0, 0); a.exercises[1].sets[0].reps = 5; store.toggleDone(1, 0); await store.flush();
    expect(a.exercises[0].sets[0].weight).toBe(''); /* użytkownik wpisał tylko powtórzenia */
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await flushAll(10);
    expect(screen.getByText('Poprzednio: Siłownia · ciężaru 32 kg nie ma tutaj — wpisz ciężar')).toBeTruthy();
    await tap(screen.getAllByText('Zakończ')[0]); const al = global.__alerts.filter(x => x.title === 'Zakończyć trening?').pop()!;
    expect(al.msg).toMatch(/Odhaczone serie bez ciężaru: 1\./); /* Pull Up (masa ciała) się nie liczy */ pressAlert('Zakończyć trening?', 'Wróć');
  });
  test('także bez miejsc (pierwsza sesja): seria tylko z powtórzeniami → ostrzeżenie; seria z ciężarem 0 kg — bez', async () => {
    await renderApp(); await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addExerciseToActive(ex('Biceps Curl (hantle)')); const a = store.getState().active!; a.exercises[0].sets[0].reps = 5; store.toggleDone(0, 0); a.exercises[1].sets[0].weight = 0; a.exercises[1].sets[0].reps = 10; store.toggleDone(1, 0); }); await flushAll(10);
    await tap(screen.getAllByText('Zakończ')[0]); const al = global.__alerts.filter(x => x.title === 'Zakończyć trening?').pop()!;
    expect(al.msg).toMatch(/Odhaczone serie bez ciężaru: 1\./);
  });
});

describe('L2: „Powtórz ostatni” jak start z szablonu', () => {
  test('ostatni trening w usuniętym miejscu (32 kg) → nowy w domu: ciężar spoza listy nie jest wstawiany; z listy — tak', async () => {
    await fresh(); const { gym } = homeAndGym();
    addWorkout(Date.now() - 86400e3, [['Bench Press (hantle)', [{ weight: 32, reps: 8 }]], ['Biceps Curl (hantle)', [{ weight: 12, reps: 10 }]]]).locationId = gym.id; store.save();
    L.setMainLocation('home'); L.deleteLocation(gym.id); store.repeatLast(); const a = store.getState().active!;
    expect(a.locationId).toBe('home'); expect(a.exercises.map(e => [e.sets[0].weight, e.sets[0].reps])).toEqual([['', ''], [12, 10]]);
  });
  test('ten sam / nieznany poprzedni miejsce — bez zmian', async () => {
    await fresh(); homeAndGym(); addWorkout(Date.now() - 86400e3, [['Bench Press (hantle)', [{ weight: 32, reps: 8 }]]]); store.save();
    store.repeatLast(); expect(store.getState().active!.exercises[0].sets[0].weight).toBe(32);
  });
});

describe('L3, L4: stacja i pola po zmianie jednostki', () => {
  test('stacja kg → lb dokładnym współczynnikiem: te same ustawienia (w kg) przed i po', () => {
    const kg = presetSpec('vishape_pro'); expect(achievable(convertSpec(kg, 'lb'))).toEqual(achievable(kg)); expect(achievable(convertSpec(convertSpec(kg, 'lb'), 'kg'))).toEqual(achievable(kg));
    const sp: LoadSpec = { kind: 'electric', unit: 'kg', min: 2, max: 50, step: 0.5 }; expect(achievable(convertSpec(sp, 'lb'))).toEqual(achievable(sp));
  });
  test('pola talerzy i stacji pokazują najwyżej 3 miejsca po przecinku', async () => {
    await fresh(); const s = store.getState().settings; const h = userHome(HOME); s.locations.push(h); s.mainLocationId = h.id;
    L.setEquip(h, 'db_plate', true); L.setLoad(h, 'db_plate', convertSpec(presetSpec('hopsport2x10'), 'lb')); L.setLoad(h, 'electric', convertSpec(presetSpec('vishape_pro'), 'lb')); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await go('/more/location/home'); await flushAll(10); await expandEquip();
    expect(screen.getAllByDisplayValue('3,307')).toHaveLength(2); /* uchwyt 1,5 kg i min stacji 1,5 kg/str. */ expect(screen.getAllByDisplayValue('1,102').length).toBeGreaterThanOrEqual(1); /* krok stacji (i talerz 0,5 kg) */ expect(screen.getByDisplayValue('2,756')).toBeTruthy();
    expect(screen.queryByDisplayValue(/\d,\d{4,}/)).toBeNull();
  });
});

describe('L5: zmiana sprzętu ćwiczenia z biblioteki', () => {
  test('Bench Press (hantle) → linki: bez wymagań (zawsze dostępne), źródło obciążenia z linek, catalogRev „user” (katalog go nie przywraca)', async () => {
    await fresh(); const bp = ex('Bench Press (hantle)'); store.setEquipment(bp, 'linki');
    expect(bp.requires).toEqual([]); expect(bp.loadSource).toBe('cable'); expect(bp.catalogRev).toBe('user'); expect(bp.implements).toBeUndefined();
    const h = userHome(HOME); expect(availability(bp, h).ok).toBe(true); const L1 = loadsFor(bp, h); expect(L1.kind === 'loads' && L1.item).toBe('electric'); /* nie hantle */
    const m = store.migrate(JSON.parse(JSON.stringify(store.getState()))); expect(m.exercises.find(e => e.id === bp.id)!.requires).toEqual([]);
    void CATALOG;
  });
});
