/* 0.19 A4 „Inne miejsce (tylko dziś)” (docs/33; decyzja właściciela P1 A) — logika: miejsce jednorazowe to ukryte miejsce z `Location.oneOff`.
 * Rodzaje (docs/20): logika (addOneOffLocation, keepOneOff, visibleLocations, startLocationId, canDeleteLocation, deleteLocation, pruneOneOff,
 * unusedOneOffIds, „Zawsze w”), niezmienniki (lista miejsc bez oneOff, historia zachowuje nazwę i sprzęt), dane (restart, kopia), regresja W1/W3/D5
 * (zamiana, zamiennik per miejsce, przypięty przyrząd działają w miejscu jednorazowym tak samo jak w zapisanym), macierz (ONE_OFF_PRESETS). */
import * as store from '@/lib/store';
import * as locs from '@/lib/locations';
import { buildBackup, parseBackup } from '@/lib/backup';
import { presetEquipment, equipEntry, availability, LOCATION_PRESETS } from '@/lib/equipment';
import { adaptCandidates } from '@/lib/adapt';
import { fresh, ex, saved } from './helpers';
import { loc } from './locations-fixtures';
import type { Template } from '@/lib/seed';

jest.setTimeout(60000);
const S = () => store.getState();
const GYM = 'gym', HOTEL = 'hotel';
async function world() {
  await fresh(undefined, 'pl'); const s = S().settings;
  s.locations = [loc('Siłownia', presetEquipment('gym'), GYM), loc('Hotel', presetEquipment('hotel'), HOTEL)]; s.mainLocationId = GYM; store.save();
}
const FBW: [string, string][] = [['Bench Press (sztanga)', 'bench'], ['Overhead Press (sztanga)', 'ohp'], ['Pull Up', 'pull'], ['RDL (hantle/linki)', 'rdl']];
const tpl = (names = FBW): Template => { const t = store.newTemplate(); t.name = 'FBW'; t.items = names.map(([n, id]) => ({ id, exerciseId: ex(n).id, sets: 3, repMin: 6, repMax: 8, restSec: 120, startWeight: '' as const, targetSec: '' as const, groupId: null })); store.save(t); return t; };

describe('addOneOffLocation / keepOneOff', () => {
  test('miejsce jednorazowe: znacznik oneOff, nazwa domyślna „Tylko dziś”, sprzęt skopiowany (zmiana źródła go nie rusza), poza visibleLocations', async () => {
    await world(); const eq = [equipEntry('floor_mat'), equipEntry('wall')]; const l = locs.addOneOffLocation('', eq);
    expect(l.oneOff).toBe(true); expect(l.name).toBe('Tylko dziś'); expect(l.equipment.map(e => e.item)).toEqual(['floor_mat', 'wall']);
    eq[0].opts.push('zmiana'); expect(l.equipment[0].opts).not.toContain('zmiana');
    expect(S().settings.locations.map(x => x.id)).toContain(l.id); expect(store.visibleLocations().map(x => x.id)).toEqual([GYM, HOTEL]);
    expect(S().settings.mainLocationId).toBe(GYM); expect(store.locationById(l.id)).toBe(l); /* ale działa w locationById (trening, historia) */
  });
  test('nazwa wpisana: spacje złączone, przycięta do NAME_MAX; pusta albo same spacje → nazwa domyślna z argumentu', async () => {
    await world(); expect(locs.addOneOffLocation('  Hotel   Zakopane  ', []).name).toBe('Hotel Zakopane');
    expect(locs.addOneOffLocation('x'.repeat(200), []).name).toHaveLength(store.NAME_MAX); expect(locs.addOneOffLocation('   ', [], false, 'Inne miejsce').name).toBe('Inne miejsce');
  });
  test('„Zapisz jako miejsce” (keep): zwykłe miejsce bez znacznika, nazwa bez powtórzeń z listą, miejsce główne bez zmian', async () => {
    await world(); const l = locs.addOneOffLocation('Hotel', [equipEntry('wall')], true);
    expect(l.oneOff).toBeUndefined(); expect(l.name).toBe('Hotel 2'); expect(store.visibleLocations().map(x => x.id)).toContain(l.id); expect(S().settings.mainLocationId).toBe(GYM);
  });
  test('keepOneOff: zdejmuje znacznik z istniejącego miejsca; nie-jednorazowe i nieznane id → false; nazwa bez powtórzeń', async () => {
    await world(); const l = locs.addOneOffLocation('Siłownia', []); expect(locs.keepOneOff(l.id)).toBe(true);
    expect(store.locationById(l.id)!.oneOff).toBeUndefined(); expect(store.locationById(l.id)!.name).toBe('Siłownia 2');
    expect(locs.keepOneOff(l.id)).toBe(false); expect(locs.keepOneOff(GYM)).toBe(false); expect(locs.keepOneOff('nie-ma')).toBe(false);
  });
  test('pierwsze miejsce zapisane (keep) przy zerze miejsc zostaje głównym; jednorazowe nie bywa głównym', async () => {
    await fresh(undefined, 'pl'); expect(S().settings.locations).toEqual([]);
    const o = locs.addOneOffLocation('', [], false); expect(S().settings.mainLocationId ?? null).toBeNull(); expect(store.visibleLocations()).toEqual([]);
    const k = locs.addOneOffLocation('Dom', [], true); expect(S().settings.mainLocationId).toBe(k.id); expect(store.visibleLocations().map(x => x.id)).toEqual([k.id]); expect(o.oneOff).toBe(true);
  });
});

describe('startLocationId, lista miejsc, usuwanie', () => {
  test('startLocationId: miejsce główne; gdy go brak — pierwsze Z LISTY (nie jednorazowe); preferowane jednorazowe wolno (dzień planu)', async () => {
    await world(); const o = locs.addOneOffLocation('', []); S().settings.locations.unshift(S().settings.locations.splice(S().settings.locations.indexOf(o), 1)[0]); /* jednorazowe pierwsze */
    expect(store.startLocationId()).toBe(GYM); S().settings.mainLocationId = null; expect(store.startLocationId()).toBe(GYM); /* pierwsze z listy, nie oneOff */
    expect(store.startLocationId(o.id)).toBe(o.id); expect(store.startLocationId('nie-ma')).toBe(GYM);
  });
  test('startLocationId: same miejsca jednorazowe (zero z listy) — nadal jest miejsce (trening w nim trwa), bez miejsc w ogóle — brak', async () => {
    await fresh(undefined, 'pl'); expect(store.startLocationId()).toBeUndefined(); const o = locs.addOneOffLocation('', []); expect(store.startLocationId()).toBe(o.id);
  });
  test('canDeleteLocation liczy tylko miejsca z listy: główne nie do usunięcia, gdy jest inne z listy; jedyne z listy — tak, mimo miejsca jednorazowego', async () => {
    await world(); locs.addOneOffLocation('', []); expect(locs.canDeleteLocation(GYM)).toBe(false); expect(locs.canDeleteLocation(HOTEL)).toBe(true);
    expect(locs.deleteLocation(HOTEL)).toBe(true); expect(locs.canDeleteLocation(GYM)).toBe(true); expect(locs.deleteLocation(GYM)).toBe(true);
    expect(S().settings.mainLocationId ?? null).toBeNull(); expect(store.visibleLocations()).toEqual([]);
  });
  test('addLocation (preset): nazwa liczona tylko wśród miejsc z listy (jednorazowe „Hotel” nie powoduje „Hotel 2”)', async () => {
    await fresh(undefined, 'pl'); locs.addOneOffLocation('Hotel', []); expect(locs.addLocation('hotel').name).toBe('Hotel');
  });
});

describe('porządkowanie: pruneOneOff / unusedOneOffIds', () => {
  test('nieużywane jednorazowe znika; używane przez trening w toku, zakończony trening, miejsce dnia planu i zapisany plan zostaje', async () => {
    await world(); const a = locs.addOneOffLocation('A', []), b = locs.addOneOffLocation('B', []), c = locs.addOneOffLocation('C', []), d = locs.addOneOffLocation('D', []), e = locs.addOneOffLocation('E', []);
    store.startFromTemplate(tpl()); store.setActiveLocation(a.id); /* A: trening w toku */
    S().workouts.push({ ...JSON.parse(JSON.stringify(S().active)), id: 'w-old', finishedAt: Date.now(), locationId: b.id }); /* B: historia */
    S().planPlaces = { '2099-01-01': c.id }; /* C: miejsce dnia */
    S().savedPlans = [{ id: 'p1', name: 'P', days: [null, null, null, null, null, null, null], places: { '2099-01-02': d.id } }]; /* D: zapisany plan */
    expect([...store.unusedOneOffIds(S())]).toEqual([e.id]); expect(store.pruneOneOff()).toBe(1);
    expect(S().settings.locations.map(x => x.id).sort()).toEqual([GYM, HOTEL, a.id, b.id, c.id, d.id].sort()); expect(store.pruneOneOff()).toBe(0);
  });
  test('zwykłe miejsce bez odwołań zostaje (porządek dotyczy tylko oneOff)', async () => {
    await world(); expect(store.pruneOneOff()).toBe(0); expect(S().settings.locations).toHaveLength(2);
  });
  test('unusedOneOffIds na surowych danych: liczbowe id, brak pól, śmieci — bez wyjątku', () => {
    const raw: any = { settings: { locations: [{ id: 1, oneOff: true }, { id: 'x', oneOff: true }, null, { id: 'y' }] }, workouts: [{ locationId: 1 }, null], active: null, planPlaces: { a: 'x' }, savedPlans: [null, { places: null }] };
    expect([...store.unusedOneOffIds(raw)]).toEqual([]); raw.workouts = []; raw.planPlaces = undefined; expect([...store.unusedOneOffIds(raw)].sort()).toEqual(['1', 'x']);
    expect(store.unusedOneOffIds({}).size).toBe(0); expect(store.unusedOneOffIds({ settings: { locations: 'x' } }).size).toBe(0);
  });
});

describe('trening w miejscu jednorazowym i historia', () => {
  test('setActiveLocation na jednorazowe: przyrządy bloków od nowa, adaptCandidates liczy braki wg sprzętu miejsca; „Zawsze w” niedostępne', async () => {
    await world(); const t = tpl(); store.startFromTemplate(t);
    const o = locs.addOneOffLocation('', presetEquipment('bodyweight')); store.setActiveLocation(o.id);
    expect(S().active!.locationId).toBe(o.id); expect(adaptCandidates(S().active!, o.id).length).toBe(FBW.filter(([n]) => !availability(ex(n), o).ok).length);
    /* zamiana w miejscu jednorazowym; „Zawsze w” (canRememberAlt) tylko dla zapisanego miejsca */
    const b0 = S().active!.exercises[0]; const alt = ex('Push Up'); expect(store.swapBlock(b0.id, alt.id)).toBeTruthy(); expect(store.canRememberAlt(S().active!, S().active!.exercises[0])).toBe(false);
    store.setActiveLocation(HOTEL); store.setActiveLocation(GYM); /* zwykłe miejsce z szablonem: wpis możliwy dla bloku z zamianą w zapisanym miejscu */
  });
  test('„Zapisz jako miejsce” w trakcie treningu (keepOneOff): „Zawsze w” działa jak dla zwykłego miejsca (W3)', async () => {
    await world(); const t = tpl(); store.startFromTemplate(t); const o = locs.addOneOffLocation('Dom gościnny', presetEquipment('hotel')); store.setActiveLocation(o.id);
    const b = S().active!.exercises[0]; store.swapBlock(b.id, ex('Bench Press (hantle)').id);
    expect(store.canRememberAlt(S().active!, S().active!.exercises[0])).toBe(false); expect(locs.keepOneOff(o.id)).toBe(true); expect(store.canRememberAlt(S().active!, S().active!.exercises[0])).toBe(true);
    expect(store.rememberAlt(S().active!.exercises[0].id)).toBe(true); expect(S().templates.find(x => x.id === t.id)!.items[0].alternates![0].locationId).toBe(o.id);
  });
  test('historia zachowuje nazwę i sprzęt: po zakończeniu treningu miejsce jednorazowe zostaje (locationLabel), restart i pruneOneOff go nie usuwają; pusta lista miejsc w UI', async () => {
    await world(); store.startFromTemplate(tpl()); const o = locs.addOneOffLocation('Hotel Sopot', [equipEntry('wall'), equipEntry('floor_mat')]); store.setActiveLocation(o.id);
    store.toggleDone(3, 0); const w = store.finishWorkout(Date.now())!; expect(w.locationId).toBe(o.id);
    expect(store.pruneOneOff()).toBe(0); expect(locs.locationLabel(o.id)).toBe('Hotel Sopot');
    await store.flush(); const st = await fresh(saved()); const back = st.settings.locations.find(l => l.id === o.id)!;
    expect(back.oneOff).toBe(true); expect(back.name).toBe('Hotel Sopot'); expect(back.equipment.map(e => e.item)).toEqual(['wall', 'floor_mat']); expect(st.workouts[0].locationId).toBe(o.id);
    expect(store.visibleLocations().map(l => l.id)).toEqual([GYM, HOTEL]);
  });
  test('anulowany trening w miejscu jednorazowym: miejsce znika przy najbliższym porządku (bez odwołań)', async () => {
    await world(); store.startFromTemplate(tpl()); const o = locs.addOneOffLocation('', []); store.setActiveLocation(o.id); store.cancelWorkout();
    expect(store.pruneOneOff()).toBe(1); expect(S().settings.locations.find(l => l.id === o.id)).toBeUndefined();
  });
  test('regresja D5: przypięty przyrząd bloku (implPinned) zostaje po zmianie na miejsce jednorazowe, gdy przyrząd jest tam dostępny', async () => {
    await world(); store.startFromTemplate(tpl([['RDL (hantle/linki)', 'rdl']]));
    const o = locs.addOneOffLocation('', presetEquipment('hotel')); store.setActiveLocation(o.id);
    const b = S().active!.exercises[0]; expect(b.impl).toBeDefined(); expect(store.implAtLoc(ex('RDL (hantle/linki)'), o.id)).toBe(b.impl);
  });
  test('regresja W3: zamiennik per zwykłe miejsce nie przenosi się na jednorazowe (altHint tylko dla zapisanego miejsca szablonu)', async () => {
    await world(); const t = tpl(); t.items[0].alternates = [{ locationId: HOTEL, exerciseId: ex('Bench Press (hantle)').id, restSec: null }]; store.save(t);
    store.startFromTemplate(t); store.setActiveLocation(HOTEL); expect(store.altHint(S().active!, S().active!.exercises[0])).toBeTruthy();
    const o = locs.addOneOffLocation('', presetEquipment('hotel')); store.setActiveLocation(o.id); expect(store.altHint(S().active!, S().active!.exercises[0])).toBeUndefined();
  });
});

describe('dane i macierz', () => {
  test('kopia zapasowa: eksport → import 1:1 z miejscem jednorazowym używanym przez historię; nieużywane jednorazowe po imporcie znika (porządek migracji)', async () => {
    await world(); store.startFromTemplate(tpl()); const o = locs.addOneOffLocation('Hotel Gdynia', [equipEntry('wall')]); store.setActiveLocation(o.id);
    store.toggleDone(3, 0); store.finishWorkout(Date.now()); const unused = locs.addOneOffLocation('Nieużywane', []);
    const back = parseBackup(JSON.stringify(buildBackup())); expect(back.schemaVersion).toBe(19);
    expect(back.settings.locations.find(l => l.id === o.id)).toMatchObject({ oneOff: true, name: 'Hotel Gdynia' }); expect(back.settings.locations.find(l => l.id === unused.id)).toBeUndefined();
  });
  test('wymiar: ONE_OFF_PRESETS to presety kreatora miejsc; każdy daje sprzęt z presetEquipment, a „Hotel” ma hantle', () => {
    for (const p of locs.ONE_OFF_PRESETS) { expect(LOCATION_PRESETS).toContain(p); expect(Array.isArray(presetEquipment(p))).toBe(true); }
    expect([...locs.ONE_OFF_PRESETS]).toEqual(['hotel', 'bodyweight', 'home']); expect(presetEquipment('hotel').some(e => e.item === 'db_fixed')).toBe(true); expect(presetEquipment('home')).toEqual([]);
  });
  test('ONE_OFF_DEFAULT_NAME: „Tylko dziś” (pl) i „Today only” (en)', async () => {
    await fresh(undefined, 'pl'); expect(locs.ONE_OFF_DEFAULT_NAME()).toBe('Tylko dziś'); await fresh(undefined, 'en'); expect(locs.ONE_OFF_DEFAULT_NAME()).toBe('Today only');
  });
});
