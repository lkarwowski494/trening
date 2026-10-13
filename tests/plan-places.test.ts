/* 0.19 B „Miejsce na dni planu” (docs/33; decyzje właściciela P4 A, P6 B, P7 A) — logika: State.planPlaces (data → id miejsca), SavedPlan.places.
 * Rodzaje (docs/20): logika (setPlanPlace/zakres, placeRun, clearPlanPlace, plannedPlace, start dnia, przypomnienie), niezmienniki (miejsce zostaje przy dacie:
 * shiftPlan / moveOnly / swapDays / resetDay / tidy; szablony i plan tygodnia bez zmian), dane (cleanPlanPlaces, zapisane plany, usunięte miejsce), macierz
 * (PLAN_PLACE_RANGE_MAX, PLAN_PLACES_MAX). Ekran — tests/places-ui.test.tsx, scenariusz — tests/places-scenario.test.tsx. */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import * as locs from '@/lib/locations';
import { syncPlanReminders, planReminderKey } from '@/lib/planReminder';
import { takeAutoAdapt } from '@/lib/adaptPick';
import { presetEquipment } from '@/lib/equipment';
import { fresh, saved, withDemoTemplates } from './helpers';
import { loc } from './locations-fixtures';

jest.setTimeout(60000);
const S = () => store.getState();
const THU = new Date(2026, 9, 8, 9, 0); /* czwartek 8.10.2026 */
const GYM = 'gym', HOTEL = 'hotel', HOME = 'home';
let A = '', B = '';
beforeEach(async () => {
  jest.useFakeTimers({ now: THU }); await fresh(undefined, 'pl'); const t = withDemoTemplates(); [A, B] = [t[0].id, t[1].id];
  const s = S().settings; s.locations = [loc('Siłownia', presetEquipment('gym'), GYM), loc('Hotel', presetEquipment('hotel'), HOTEL), loc('Dom', presetEquipment('bodyweight'), HOME)]; s.mainLocationId = GYM; store.save();
  global.__notifications.length = 0; global.__cancelled.length = 0;
});
afterEach(() => { jest.useRealTimers(); });
const weekPlan = (...d: (string | null)[]) => { d.forEach((id, i) => plan.setWeekDay(i, id)); };
const places = (from: string, n: number) => Array.from({ length: n }, (_, i) => plan.plannedPlace(plan.addDays(from, i)));

describe('setPlanPlace — zakres od–do (P6 B)', () => {
  test('piątek–niedziela Hotel: trzy dni, reszta bez miejsca; zapis w State.planPlaces osobno od planOverrides', () => {
    expect(plan.setPlanPlace('2026-10-09', '2026-10-11', HOTEL)).toBe(3);
    expect(places('2026-10-08', 5)).toEqual([undefined, HOTEL, HOTEL, HOTEL, undefined]); expect(S().planPlaces).toEqual({ '2026-10-09': HOTEL, '2026-10-10': HOTEL, '2026-10-11': HOTEL });
    expect(S().planOverrides).toBeUndefined(); expect(plan.plannedPlaceName('2026-10-10')).toBe('Hotel'); expect(plan.plannedPlaceName('2026-10-12')).toBe('');
    expect(S().userTouched).toBe(true);
  });
  test('jeden dzień (od = do), dzisiejszy dzień dozwolony; nadpisanie części zakresu innym miejscem', () => {
    expect(plan.setPlanPlace('2026-10-08', '2026-10-08', HOTEL)).toBe(1); expect(plan.setPlanPlace('2026-10-08', '2026-10-10', HOME)).toBe(3);
    expect(places('2026-10-08', 3)).toEqual([HOME, HOME, HOME]); expect(plan.setPlanPlace('2026-10-09', '2026-10-09', HOTEL)).toBe(1); expect(places('2026-10-08', 3)).toEqual([HOME, HOTEL, HOME]);
  });
  test('nieprawidłowe: dzień miniony, odwrócony zakres, zły format, nieznane miejsce, zakres dłuższy niż PLAN_PLACE_RANGE_MAX — 0 i nic się nie zmienia', () => {
    const before = JSON.stringify(S());
    expect(plan.setPlanPlace('2026-10-07', '2026-10-09', HOTEL)).toBe(0); expect(plan.setPlanPlace('2026-10-11', '2026-10-09', HOTEL)).toBe(0); expect(plan.setPlanPlace('2026-10-9', '2026-10-11', HOTEL)).toBe(0);
    expect(plan.setPlanPlace('2026-10-09', '2026-10-11', 'nie-ma')).toBe(0); expect(plan.setPlanPlace('2026-10-09', plan.addDays('2026-10-09', store.PLAN_PLACE_RANGE_MAX), HOTEL)).toBe(0);
    expect(JSON.stringify(S())).toBe(before);
  });
  test('granica: dokładnie PLAN_PLACE_RANGE_MAX dni działa', () => {
    const last = plan.addDays('2026-10-09', store.PLAN_PLACE_RANGE_MAX - 1); expect(plan.setPlanPlace('2026-10-09', last, HOTEL)).toBe(store.PLAN_PLACE_RANGE_MAX); expect(plan.plannedPlace(last)).toBe(HOTEL);
    expect(plan.placeDays('2026-10-09', last)).toHaveLength(store.PLAN_PLACE_RANGE_MAX); expect(plan.placeDays('2026-10-09', plan.addDays(last, 1))).toEqual([]); expect(plan.placeDays('2026-10-09', '2026-10-08')).toEqual([]);
  });
  test('dni minione odpadają przy zapisie (nic ich nie czyta); przejście przez granicę miesiąca i roku', () => {
    S().planPlaces = { '2026-10-01': HOTEL }; store.save(); /* miejsce z przeszłości (np. po starej wersji) */
    expect(plan.setPlanPlace('2026-10-30', '2026-11-02', HOME)).toBe(4); expect(S().planPlaces).toEqual({ '2026-10-30': HOME, '2026-10-31': HOME, '2026-11-01': HOME, '2026-11-02': HOME });
    expect(plan.setPlanPlace('2026-12-30', '2027-01-02', HOME)).toBe(4); expect(plan.plannedPlace('2027-01-01')).toBe(HOME);
  });
});

describe('placeRun / clearPlanPlace — „Usuń miejsce”', () => {
  test('placeRun: cały ciąg dni z tym samym miejscem wokół dnia; dzień bez miejsca → null; inne miejsce przerywa ciąg', () => {
    plan.setPlanPlace('2026-10-09', '2026-10-11', HOTEL); plan.setPlanPlace('2026-10-12', '2026-10-12', HOME);
    expect(plan.placeRun('2026-10-10')).toEqual({ from: '2026-10-09', to: '2026-10-11', locationId: HOTEL }); expect(plan.placeRun('2026-10-12')).toEqual({ from: '2026-10-12', to: '2026-10-12', locationId: HOME });
    expect(plan.placeRun('2026-10-13')).toBeNull();
  });
  test('clearPlanPlace zdejmuje miejsce z całego ciągu wokół dnia; sąsiednie miejsce zostaje; brak miejsca → 0', () => {
    plan.setPlanPlace('2026-10-09', '2026-10-11', HOTEL); plan.setPlanPlace('2026-10-12', '2026-10-12', HOME);
    expect(plan.clearPlanPlace('2026-10-10')).toBe(3); expect(places('2026-10-09', 4)).toEqual([undefined, undefined, undefined, HOME]); expect(plan.clearPlanPlace('2026-10-10')).toBe(0);
    expect(plan.clearPlanPlace('2026-10-12')).toBe(1); expect(S().planPlaces).toBeUndefined(); /* pusta mapa znika z danych */
  });
  test('miejsce jednorazowe znika po zdjęciu z ostatniego dnia (bez odwołań)', () => {
    const o = locs.addOneOffLocation('Hotel Sopot', []); plan.setPlanPlace('2026-10-09', '2026-10-10', o.id); expect(S().settings.locations.some(l => l.id === o.id)).toBe(true);
    plan.clearPlanPlace('2026-10-09'); expect(S().settings.locations.some(l => l.id === o.id)).toBe(false);
  });
  test('usunięcie miejsca z listy (deleteLocation) zdejmuje je z dni planu i z zapisanych planów', () => {
    plan.setPlanPlace('2026-10-09', '2026-10-11', HOME); S().savedPlans = [{ id: 'p', name: 'P', days: [null, null, null, null, null, null, null], places: { '2099-01-01': HOME, '2099-01-02': HOTEL } }]; store.save();
    expect(locs.deleteLocation(HOME)).toBe(true); expect(S().planPlaces).toBeUndefined(); expect(plan.plannedPlace('2026-10-10')).toBeUndefined(); expect(S().savedPlans![0].places).toEqual({ '2099-01-02': HOTEL });
  });
  test('miejsce usunięte w danych (id bez miejsca) — plannedPlace nic nie zwraca, start nie wybiera nieistniejącego miejsca', () => {
    S().planPlaces = { '2026-10-08': 'duch' }; expect(plan.plannedPlace('2026-10-08')).toBeUndefined(); store.startFromTemplate(S().templates[0]); expect(S().active!.locationId).toBe(GYM);
  });
});

describe('miejsce zostaje przy dacie (P7 A) — przesunięcia nie ruszają planPlaces', () => {
  beforeEach(() => { weekPlan(A, null, B, null, A, null, null); plan.setPlanPlace('2026-10-09', '2026-10-11', HOTEL); });
  test('shiftPlan, moveOnly, swapDays i resetDay zmieniają trening dnia, ale nie miejsce; plan tygodnia i szablony bez zmian', () => {
    const tpls = JSON.stringify(S().templates); const week = JSON.stringify(S().weekPlan); const pp = JSON.stringify(S().planPlaces);
    plan.shiftPlan('2026-10-09'); expect(plan.plannedOn('2026-10-10')).toBe(A); expect(JSON.stringify(S().planPlaces)).toBe(pp);
    expect(plan.moveOnly('2026-10-10', '2026-10-11').ok).toBe(true); expect(plan.plannedOn('2026-10-11')).toBe(A); expect(JSON.stringify(S().planPlaces)).toBe(pp);
    plan.swapDays('2026-10-11', '2026-10-12'); expect(JSON.stringify(S().planPlaces)).toBe(pp);
    plan.setDayPlan('2026-10-10', B); plan.resetDay('2026-10-10'); expect(plan.plannedPlace('2026-10-10')).toBe(HOTEL); expect(JSON.stringify(S().planPlaces)).toBe(pp);
    expect(JSON.stringify(S().templates)).toBe(tpls); expect(JSON.stringify(S().weekPlan)).toBe(week);
  });
  test('zmiana planu tygodnia (setWeekDay) i porządek zmian dni (tidy) nie ruszają miejsc dni', () => {
    const pp = JSON.stringify(S().planPlaces); plan.setWeekDay(5, B); plan.setWeekDay(5, null); plan.setDayPlan('2026-10-10', null); expect(JSON.stringify(S().planPlaces)).toBe(pp);
  });
});

describe('zapisane plany (SavedPlan.places)', () => {
  test('wyłączenie planu (deactivatePlan): miejsca dni od dziś trafiają do zapisanego planu, aktywne miejsca puste; aktywacja je przywraca', () => {
    weekPlan(A, null, B, null, A, null, null); plan.setPlanPlace('2026-10-09', '2026-10-11', HOTEL);
    expect(plan.deactivatePlan()).toBe('ok'); expect(S().planPlaces).toBeUndefined(); const p = S().savedPlans![0]; expect(p.places).toEqual({ '2026-10-09': HOTEL, '2026-10-10': HOTEL, '2026-10-11': HOTEL });
    plan.activatePlan(p.id); expect(S().planPlaces).toEqual({ '2026-10-09': HOTEL, '2026-10-10': HOTEL, '2026-10-11': HOTEL }); expect((S().savedPlans ?? []).some(x => x.places)).toBe(false);
  });
  test('aktywacja innego planu: miejsca obecnego planu idą z nim, miejsca nowego wracają; usunięte miejsca z zapisu odpadają', () => {
    weekPlan(A, null, null, null, null, null, null); plan.setPlanPlace('2026-10-09', '2026-10-09', HOTEL);
    const id = plan.newPlan('Drugi')!; S().savedPlans!.find(x => x.id === id)!.places = { '2026-10-20': HOME, '2026-10-21': 'duch' }; store.save();
    plan.activatePlan(id); expect(S().planPlaces).toEqual({ '2026-10-20': HOME }); expect(S().savedPlans!.find(x => x.places?.['2026-10-09'] === HOTEL)).toBeTruthy();
  });
  test('wyłączenie planu bez miejsc nie dodaje pola places do zapisanego planu', () => {
    weekPlan(A, null, null, null, null, null, null); plan.deactivatePlan(); expect('places' in S().savedPlans![0]).toBe(false);
  });
});

describe('start treningu w dniu z miejscem (P4 A)', () => {
  test('miejsce dnia przed miejscem szablonu i głównym — każda droga startu: szablon, pusty trening, „Powtórz ostatni”', () => {
    const t = S().templates[0]; t.locationId = HOME; store.save(t); plan.setPlanPlace('2026-10-08', '2026-10-09', HOTEL);
    store.startFromTemplate(t); expect(S().active!.locationId).toBe(HOTEL); store.cancelWorkout();
    expect(store.startEmpty()).toBe(true); expect(S().active!.locationId).toBe(HOTEL); store.cancelWorkout();
    store.startFromTemplate(t); store.toggleDone(0, 0); store.finishWorkout(Date.now()); expect(store.repeatLast()).toBe(true); expect(S().active!.locationId).toBe(HOTEL); store.cancelWorkout();
  });
  test('bez miejsca dnia: miejsce szablonu, potem główne (jak dotąd); miejsce na inny dzień nie wpływa', () => {
    const t = S().templates[0]; plan.setPlanPlace('2026-10-09', '2026-10-09', HOTEL); store.startFromTemplate(t); expect(S().active!.locationId).toBe(GYM); store.cancelWorkout();
    t.locationId = HOME; store.save(t); store.startFromTemplate(t); expect(S().active!.locationId).toBe(HOME);
  });
  test('start z miejscem dnia uzbraja otwarcie okna „Dostosuj” (raz); bez miejsca dnia — nie', () => {
    const t = S().templates[0]; store.startFromTemplate(t); expect(takeAutoAdapt(S().active!.id)).toBe(false); store.cancelWorkout();
    plan.setPlanPlace('2026-10-08', '2026-10-08', HOTEL); store.startFromTemplate(t); const id = S().active!.id; expect(takeAutoAdapt(id)).toBe(true); expect(takeAutoAdapt(id)).toBe(false);
  });
  test('start zmienia miejsce tylko nowego treningu: sam zapis miejsca dnia nie dotyka treningu w toku i szablonów', () => {
    const t = S().templates[0]; store.startFromTemplate(t); const before = JSON.stringify(S().active); plan.setPlanPlace('2026-10-08', '2026-10-09', HOTEL); expect(JSON.stringify(S().active)).toBe(before);
  });
  test('dzień liczony z chwili startu: miejsce na jutro nie działa dziś, a po północy działa', () => {
    const t = S().templates[0]; plan.setPlanPlace('2026-10-09', '2026-10-09', HOTEL); store.startFromTemplate(t); expect(S().active!.locationId).toBe(GYM); store.cancelWorkout();
    jest.setSystemTime(new Date(2026, 9, 9, 0, 5)); store.startFromTemplate(t); expect(S().active!.locationId).toBe(HOTEL);
  });
});

describe('przypomnienie rano z miejscem', () => {
  const titles = () => (global.__notifications as any[]).map(n => `${n.identifier}|${n.content.title}`);
  test('„Dziś: <szablon> · <miejsce>” tylko w dniach z miejscem; dni bez miejsca — sama nazwa', async () => {
    weekPlan(null, null, null, null, A, A, null); plan.setPlanPlace('2026-10-09', '2026-10-09', HOTEL); /* pt. Hotel, sob. bez miejsca */
    await syncPlanReminders(THU.getTime()); const t = titles();
    expect(t).toContain(`plan-2026-10-09|Dziś: ${S().templates[0].name} · Hotel`); expect(t).toContain(`plan-2026-10-10|Dziś: ${S().templates[0].name}`);
  });
  test('klucz synchronizacji zmienia się po ustawieniu, zmianie nazwy i usunięciu miejsca (przypomnienia przeliczane)', () => {
    weekPlan(null, null, null, null, A, null, null); const k0 = planReminderKey(THU.getTime());
    plan.setPlanPlace('2026-10-09', '2026-10-09', HOTEL); const k1 = planReminderKey(THU.getTime()); expect(k1).not.toBe(k0);
    S().settings.locations.find(l => l.id === HOTEL)!.name = 'Hotel Tatry'; const k2 = planReminderKey(THU.getTime()); expect(k2).not.toBe(k1);
    plan.clearPlanPlace('2026-10-09'); expect(planReminderKey(THU.getTime())).toBe(k0);
  });
  test('miejsce w dniu bez treningu nie tworzy przypomnienia', async () => {
    weekPlan(null, null, null, null, A, null, null); plan.setPlanPlace('2026-10-10', '2026-10-11', HOTEL); await syncPlanReminders(THU.getTime()); expect(titles().every(x => !x.includes('2026-10-10') && !x.includes('2026-10-11'))).toBe(true);
  });
});

describe('dane: cleanPlanPlaces', () => {
  test('klucze-daty, id tekstem (liczbowe → tekst), puste i zbyt długie odpadają, bez __proto__ i śmieci; znane id; idempotentne', () => {
    const raw = JSON.parse('{"2026-10-09":"a","2026-10-10":7,"zła":"a","2026-10-11":"","2026-10-12":null,"2026-10-13":{"x":1},"__proto__":"a","constructor":"a","2026-10-14":"' + 'x'.repeat(81) + '"}');
    const c = store.cleanPlanPlaces(raw); expect(c).toEqual({ '2026-10-09': 'a', '2026-10-10': '7' }); expect(Object.getPrototypeOf(c)).toBe(Object.prototype); expect(store.cleanPlanPlaces(c)).toEqual(c);
    expect(store.cleanPlanPlaces(raw, new Set(['7']))).toEqual({ '2026-10-10': '7' });
    for (const bad of [null, undefined, 5, 'x', [], [1]]) expect(store.cleanPlanPlaces(bad)).toEqual({});
  });
  test('limit PLAN_PLACES_MAX: zostają najnowsze dni', () => {
    const big: Record<string, string> = {}; for (let i = 0; i < store.PLAN_PLACES_MAX + 25; i++) big[plan.addDays('2026-01-01', i)] = 'a';
    const c = store.cleanPlanPlaces(big); const ks = Object.keys(c); expect(ks).toHaveLength(store.PLAN_PLACES_MAX); expect(ks[ks.length - 1]).toBe(plan.addDays('2026-01-01', store.PLAN_PLACES_MAX + 24));
  });
  test('restart: miejsca dni przeżywają zapis i odczyt (klucz „cfg” też)', async () => {
    plan.setPlanPlace('2026-10-09', '2026-10-11', HOTEL); await store.flush(); const st = await fresh(saved(), 'pl'); expect(st.planPlaces).toEqual({ '2026-10-09': HOTEL, '2026-10-10': HOTEL, '2026-10-11': HOTEL });
    expect(store.CFG_KEYS).toContain('planPlaces');
  });
});
