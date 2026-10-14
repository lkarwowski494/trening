/* 0.19 B, decyzja właściciela 14.10.2026 (docs/18): miejsce na zakres dat zostaje przy DACIE, nie przy treningu — scenariusz „z życia” (docs/20 rodzaj 3):
 * plan pon. i pt. (FBW), Hotel na pt.–niedz.; w piątku w panelu dnia „Przesuń plan o 1 dzień” → piątek wolny, sobota z FBW; miejsce dalej na piątek,
 * sobotę i niedzielę (nie „pojechało” z treningiem); restart; start w sobotę bierze Hotel (miejsce daty soboty), nie siłownię. Logika: tests/plan-places.test.ts,
 * niezmiennik losowy: tests/matrix-invariants.test.ts (PP_BY_DATE). */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import * as timer from '@/lib/timer';
import { fresh, ex, saved } from './helpers';
import { renderApp, flushAll, screen, tap, act, startTpl } from './app';
import { loc } from './locations-fixtures';
import { presetEquipment } from '@/lib/equipment';

jest.setTimeout(120000);
afterEach(async () => { try { await timer.stop(); await timer.stopSet(); } catch { /* brak stanu */ } jest.useRealTimers(); });
const S = () => store.getState();
const THU = new Date(2026, 9, 8, 9, 0), SAT = new Date(2026, 9, 10, 9, 0);
const HOTEL3 = { '2026-10-09': 'hotel', '2026-10-10': 'hotel', '2026-10-11': 'hotel' };

test('Hotel pt.–niedz.; przesunięcie piątkowego treningu na sobotę nie rusza miejsc dat; start w sobotę — Hotel', async () => {
  jest.useFakeTimers({ now: THU }); await fresh(undefined, 'pl'); const s = S().settings;
  s.locations = [loc('Siłownia', presetEquipment('gym'), 'gym'), loc('Hotel', presetEquipment('hotel'), 'hotel')]; s.mainLocationId = 'gym';
  const tpl = store.newTemplate(); tpl.name = 'FBW'; tpl.items = [{ id: 'b', exerciseId: ex('Bench Press (sztanga)').id, sets: 3, repMin: 6, repMax: 8, restSec: 120, startWeight: '' as const, targetSec: '' as const, groupId: null }]; store.save(tpl);
  plan.setWeekDay(0, tpl.id); plan.setWeekDay(4, tpl.id); expect(plan.setPlanPlace('2026-10-09', '2026-10-11', 'hotel')).toBe(3);
  await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: '/history' }); jest.setSystemTime(THU.getTime()); await flushAll(10);

  await tap(screen.getByTestId('cal-2026-10-09')); await flushAll(5); expect(screen.getByTestId('day-place').props.children).toBe('📍 Hotel');
  await tap(screen.getByText('Przesuń albo pomiń')); await flushAll(5);
  await tap(screen.getByLabelText('Zastosuj: Przesuń plan o 1 dzień')); await flushAll(10);
  expect(plan.plannedOn('2026-10-09')).toBeNull(); expect(plan.plannedOn('2026-10-10')).toBe(tpl.id); /* trening poszedł na sobotę */
  expect(S().planPlaces).toEqual(HOTEL3); /* miejsca dat bez zmian */
  expect(screen.getByTestId('day-place').props.children).toBe('📍 Hotel'); /* piątek, już wolny: miejsce zostaje przy dacie */
  await tap(screen.getByTestId('cal-2026-10-10')); await flushAll(5); expect(screen.getByTestId('day-place').props.children).toBe('📍 Hotel');

  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); jest.setSystemTime(SAT.getTime()); await flushAll(10);
  expect(S().planPlaces).toEqual(HOTEL3); await startTpl('FBW'); expect(S().active!.locationId).toBe('hotel');
});
