/* 0.19 B „Miejsce na zakres dni w planie” — scenariusz „z życia” (docs/33 „Testy”, docs/20 rodzaj 3): plan poniedziałek / środa / sobota (szablon FBW);
 * w piątek ustawiam Hotel na piątek–niedzielę; restart; w sobotę rano przypomnienie „Dziś: FBW · Hotel”; start → trening w Hotelu, okno „Dostosuj” samo →
 * Bench zostaje z domyślną propozycją, OHP ręcznie, Pull Up (bez sensownego zamiennika w Hotelu) — „Pomiń dziś” → „Zastosuj” → 2 serie → restart → dokończenie →
 * „Zakończ” → brak „Zapisz zmiany w szablonie”; szablon i plan bez zmian; w poniedziałek: siłownia, szablon oryginalny, bez okna. */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import * as timer from '@/lib/timer';
import { fresh, ex, saved, pressAlert } from './helpers';
import { renderApp, flushAll, screen, tap, act, startTpl } from './app';
import { loc } from './locations-fixtures';
import { presetEquipment } from '@/lib/equipment';
import { adaptCandidates } from '@/lib/adapt';

jest.setTimeout(120000);
afterEach(async () => { try { await timer.stop(); await timer.stopSet(); } catch { /* brak stanu */ } jest.useRealTimers(); });
const S = () => store.getState();
const blk = (i: number) => S().active!.exercises[i];
const stack = () => { const { store: rs } = require('expo-router/build/global-state/router-store'); let st = rs.navigationRef.getRootState(); while (st.routes.length === 1 && st.routes[0].name === '__root' && st.routes[0].state) st = st.routes[0].state; return st.routes.map((r: any) => r.name) as string[]; };
const top = () => stack().at(-1);
const FBW: [string, string][] = [['Bench Press (sztanga)', 'bench'], ['Overhead Press (sztanga)', 'ohp'], ['Pull Up', 'pull'], ['RDL (hantle/linki)', 'rdl']];
const FRI = new Date(2026, 9, 9, 9, 0), SAT_EARLY = new Date(2026, 9, 10, 7, 30), SAT = new Date(2026, 9, 10, 9, 0), MON = new Date(2026, 9, 12, 9, 0);
const doSet = async (bi: number, si: number) => { await act(async () => { blk(bi).sets[si].reps = 8; blk(bi).sets[si].weight = blk(bi).sets[si].weight === '' ? 20 : blk(bi).sets[si].weight; store.toggleDone(bi, si); }); await flushAll(5); };
const restart = async (now: Date) => { await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); jest.setSystemTime(now.getTime()); await flushAll(10); };

test('Hotel piątek–niedziela: ustawienie w panelu dnia → przypomnienie z „Hotel” → start w sobotę → okno → Pomiń + wybór ręczny → Zastosuj → restart → koniec; szablon i plan bez zmian; poniedziałek na siłowni', async () => {
  jest.useFakeTimers({ now: new Date(2026, 8, 28, 9, 0) }); await fresh(undefined, 'pl'); const s = S().settings;
  s.locations = [loc('Siłownia', presetEquipment('gym'), 'gym'), loc('Hotel', presetEquipment('hotel'), 'hotel')]; s.mainLocationId = 'gym';
  const tpl = store.newTemplate(); tpl.name = 'FBW'; tpl.items = FBW.map(([n, id]) => ({ id, exerciseId: ex(n).id, sets: 3, repMin: 6, repMax: 8, restSec: 120, startWeight: '' as const, targetSec: '' as const, groupId: null })); store.save(tpl);
  plan.setWeekDay(0, tpl.id); plan.setWeekDay(2, tpl.id); plan.setWeekDay(5, tpl.id); /* pon., śr., sob. — plan od 28.09 */
  jest.setSystemTime(FRI.getTime()); const tplBefore = JSON.stringify(S().templates); const planBefore = JSON.stringify([S().weekPlan, S().planOverrides, S().planHistory]);
  await act(async () => { await store.flush(); });

  /* piątek: panel dnia soboty? nie — „Hotel” ustawiam od piątku (dzień wolny w planie) do niedzieli */
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: '/history' }); jest.setSystemTime(FRI.getTime()); await flushAll(10);
  await tap(screen.getByTestId('cal-2026-10-09')); await flushAll(5); await tap(screen.getByText('Więcej opcji')); await flushAll(5); await tap(screen.getByText('Miejsce na te dni')); await flushAll(5);
  await tap(screen.getByLabelText('Dzień później')); await tap(screen.getByLabelText('Dzień później')); await flushAll(2);
  await tap(screen.getByLabelText('Hotel')); await tap(screen.getByText('Ustaw miejsce')); await flushAll(5);
  expect(S().planPlaces).toEqual({ '2026-10-09': 'hotel', '2026-10-10': 'hotel', '2026-10-11': 'hotel' }); expect(screen.getByTestId('day-place').props.children).toBe('Hotel');
  await tap(screen.getByTestId('cal-2026-10-10')); await flushAll(5); expect(screen.getByTestId('day-place').props.children).toBe('Hotel'); /* sobota: plan z FBW, miejsce z piątkowego zakresu */

  /* sobota rano, restart: przypomnienie o 8:00 z miejscem */
  global.__notifications.length = 0; jest.setSystemTime(SAT_EARLY.getTime()); await restart(SAT_EARLY);
  const rem = (global.__notifications as any[]).find(n => n.identifier === 'plan-2026-10-10'); expect(rem).toBeTruthy(); expect(rem.content.title).toBe('Dziś: FBW · Hotel');
  expect((global.__notifications as any[]).find(n => n.identifier === 'plan-2026-10-12')!.content.title).toBe('Dziś: FBW'); /* poniedziałek: bez miejsca */

  /* start: miejsce dnia, okno samo */
  jest.setSystemTime(SAT.getTime()); await flushAll(10); await startTpl('FBW');
  expect(S().active!.locationId).toBe('hotel'); expect(top()).toBe('adapt'); expect(require('expo-router/build/global-state/router-store').store.navigationRef.getCurrentOptions().title).toBe('Dostosuj do miejsca'); expect(screen.getByTestId('adapt-place-line').props.children).toBe('Dostosuj do: Hotel'); /* 101-17, decyzja właściciela 29.10.2026: tytuł stały, nazwa miejsca w wierszu adapt-place-line */
  const benchTo = (screen.getAllByText(/^Bench Press \(sztanga\) → /)[0].props.children as string).split(' → ')[1];
  await tap(screen.getAllByText(/^Overhead Press \(sztanga\) → /)[0]); await flushAll(20); expect(top()).toBe('swap');
  const props = screen.getAllByLabelText(/^Propozycja \d: /); const k = Math.min(1, props.length - 1); const manual = /^Propozycja \d: ([^,]+)/.exec(props[k].props.accessibilityLabel)![1]; await tap(props[k]); await flushAll(20);
  await tap(screen.getAllByText(/^Pull Up → /)[0]); await flushAll(20); await tap(screen.getByLabelText('Pomiń dziś: Pull Up')); await flushAll(20);
  expect(screen.getByTestId('adapt-apply').props.accessibilityLabel).toBe('Zastosuj (3)'); await tap(screen.getByTestId('adapt-apply')); await flushAll(20);
  expect(top()).toBe('(tabs)'); expect(blk(0).exerciseId).toBe(S().exercises.find(e => e.name === benchTo)!.id); expect(blk(1).exerciseId).toBe(S().exercises.find(e => e.name === manual)!.id);
  expect(blk(2).skipped).toBe(true); expect(blk(3).exerciseId).toBe(ex('RDL (hantle/linki)').id);

  await doSet(0, 0); await doSet(0, 1); expect(blk(0).sets.filter(x => x.done)).toHaveLength(2);
  await restart(SAT); expect(top()).toBe('(tabs)'); expect(S().active!.locationId).toBe('hotel'); expect(blk(2).skipped).toBe(true); expect(blk(0).sets.filter(x => x.done)).toHaveLength(2);
  await doSet(0, 2); for (let si = 0; si < 3; si++) { await doSet(1, si); await doSet(3, si); }
  await tap(screen.getAllByText('Zakończ')[0]); await act(async () => { pressAlert('Zakończyć trening?', 'Zakończ'); }); await flushAll(600);
  expect(S().active).toBeFalsy(); expect(S().workouts.at(-1)!.locationId).toBe('hotel'); expect(screen.queryByText('Zapisz zmiany w szablonie')).toBeNull();
  expect(JSON.stringify(S().templates)).toBe(tplBefore); expect(JSON.stringify([S().weekPlan, S().planOverrides, S().planHistory])).toBe(planBefore);
  expect(S().planPlaces).toEqual({ '2026-10-09': 'hotel', '2026-10-10': 'hotel', '2026-10-11': 'hotel' }); /* miejsce dnia zostaje po treningu */

  /* poniedziałek: miejsce główne (zakres skończył się w niedzielę), szablon oryginalny, bez okna */
  jest.setSystemTime(MON.getTime()); await flushAll(10); await act(async () => { store.startFromTemplate(S().templates[0]); }); await flushAll(10);
  expect(S().active!.locationId).toBe('gym'); expect(top()).not.toBe('adapt'); expect(S().active!.exercises.map(e => e.exerciseId)).toEqual(FBW.map(([n]) => ex(n).id));
  expect(S().active!.exercises.every(e => !e.swappedFrom && !e.skipped)).toBe(true); expect(adaptCandidates(S().active!, 'gym')).toEqual([]); /* siłownia: nic do dostosowania */
});
