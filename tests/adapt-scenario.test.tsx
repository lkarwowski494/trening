/* 0.18 „Dostosuj do miejsca” — scenariusz „z życia” (docs/33, docs/20 rodzaj 3): plan Pn/Śr z szablonem FBW; w poniedziałek start na siłowni → „📍 Hotel” →
 * okno samo się otwiera → jedno ćwiczenie pomijam („Pomiń dziś”), jedno wybieram ręcznie, resztę zostawiam jak zaproponowano → „Zastosuj” → 2 serie →
 * restart aplikacji → dokończenie → „Zakończ” → brak „Zapisz zmiany w szablonie” (zamiana tylko w treningu); środa na siłowni: szablon oryginalny. */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import * as timer from '@/lib/timer';
import { fresh, ex, saved, pressAlert } from './helpers';
import { renderApp, flushAll, screen, tap, act, startTpl } from './app';
import { loc } from './locations-fixtures';
import { presetEquipment } from '@/lib/equipment';

jest.setTimeout(90000);
afterEach(async () => { try { await timer.stop(); await timer.stopSet(); } catch { /* brak stanu */ } jest.useRealTimers(); });
const S = () => store.getState();
const blk = (i: number) => S().active!.exercises[i];
const stack = () => { const { store: rs } = require('expo-router/build/global-state/router-store'); let st = rs.navigationRef.getRootState(); while (st.routes.length === 1 && st.routes[0].name === '__root' && st.routes[0].state) st = st.routes[0].state; return st.routes.map((r: { name: string }) => r.name) as string[]; };
const top = () => stack().at(-1);
const FBW: [string, string][] = [['Bench Press (sztanga)', 'bench'], ['Overhead Press (sztanga)', 'ohp'], ['Pull Up', 'pull'], ['RDL (hantle/linki)', 'rdl']];
const MON = new Date(2026, 9, 12, 9, 0), WED = new Date(2026, 9, 14, 9, 0);
const pickPlace = async (name: string) => {
  await tap(screen.getByLabelText(/^Miejsce treningu: /)); const sh = (global as any).__sheets.at(-1); await act(async () => { sh.cb((sh.opts.options as string[]).indexOf(name)); }); await flushAll(20);
};
const doSet = async (bi: number, si: number) => { await act(async () => { blk(bi).sets[si].reps = 8; blk(bi).sets[si].weight = blk(bi).sets[si].weight === '' ? 20 : blk(bi).sets[si].weight; store.toggleDone(bi, si); }); await flushAll(5); };

test('Hotel w poniedziałek: okno → Pomiń + wybór ręczny + domyślna → Zastosuj → 2 serie → restart → koniec → szablon bez zmian; środa na siłowni jak w szablonie', async () => {
  jest.useFakeTimers({ now: MON }); await fresh(undefined, 'pl'); const s = S().settings;
  s.locations = [loc('Siłownia', presetEquipment('gym'), 'gym'), loc('Hotel', presetEquipment('hotel'), 'hotel')]; s.mainLocationId = 'gym';
  const tpl = store.newTemplate(); tpl.name = 'FBW'; tpl.items = FBW.map(([n, id]) => ({ id, exerciseId: ex(n).id, sets: 3, repMin: 6, repMax: 8, restSec: 120, startWeight: '' as const, targetSec: '' as const, groupId: null })); store.save(tpl);
  plan.setWeekDay(0, tpl.id); plan.setWeekDay(2, tpl.id); const tplBefore = JSON.stringify(S().templates); const planBefore = JSON.stringify([S().weekPlan, S().planOverrides]);
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); jest.setSystemTime(MON.getTime()); await flushAll(10);

  await startTpl('FBW'); expect(S().active!.locationId).toBe('gym'); expect(screen.queryByTestId('adapt-line')).toBeNull();
  await pickPlace('Hotel'); expect(top()).toBe('adapt');
  /* ręcznie: Overhead Press → druga propozycja; Pull Up → Pomiń dziś; Bench Press zostaje z domyślną propozycją */
  const benchTo = (screen.getAllByText(/^Bench Press \(sztanga\) → /)[0].props.children as string).split(' → ')[1];
  await tap(screen.getAllByText(/^Overhead Press \(sztanga\) → /)[0]); await flushAll(20); expect(top()).toBe('swap');
  const props = screen.getAllByLabelText(/^Propozycja \d: /); const manual = /^Propozycja \d: ([^,]+)/.exec(props[Math.min(1, props.length - 1)].props.accessibilityLabel)![1]; await tap(props[Math.min(1, props.length - 1)]); await flushAll(20);
  await tap(screen.getAllByText(/^Pull Up → /)[0]); await flushAll(20); await tap(screen.getByLabelText('Pomiń dziś: Pull Up')); await flushAll(20);
  expect(screen.getByTestId('adapt-apply').props.accessibilityLabel).toBe('Zastosuj (3)'); await tap(screen.getByTestId('adapt-apply')); await flushAll(20);
  expect(top()).toBe('(tabs)'); expect(blk(0).exerciseId).toBe(S().exercises.find(e => e.name === benchTo)!.id); expect(blk(0).swappedFrom).toBe(ex('Bench Press (sztanga)').id);
  expect(blk(1).exerciseId).toBe(S().exercises.find(e => e.name === manual)!.id); expect(blk(2).skipped).toBe(true); expect(blk(3).exerciseId).toBe(ex('RDL (hantle/linki)').id);
  expect(screen.getAllByText(/zamiast: /).length).toBe(2);

  await doSet(0, 0); await doSet(0, 1); expect(blk(0).sets.filter(x => x.done)).toHaveLength(2);
  await act(async () => { await store.flush(); });
  /* restart: aplikacja wstaje z zapisu — zamiany, pominięcie i odhaczone serie są na miejscu */
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); jest.setSystemTime(MON.getTime()); await flushAll(10);
  expect(blk(0).swappedFrom).toBe(ex('Bench Press (sztanga)').id); expect(blk(2).skipped).toBe(true); expect(blk(0).sets.filter(x => x.done)).toHaveLength(2); expect(S().active!.locationId).toBe('hotel');
  await doSet(0, 2); for (let si = 0; si < 3; si++) { await doSet(1, si); await doSet(3, si); }
  await tap(screen.getAllByText('Zakończ')[0]); await act(async () => { pressAlert('Zakończyć trening?', 'Zakończ'); }); await flushAll(600);
  expect(S().active).toBeFalsy(); expect(S().workouts.at(-1)!.exercises[0].swappedFrom).toBe(ex('Bench Press (sztanga)').id);
  expect(screen.queryByText('Zapisz zmiany w szablonie')).toBeNull(); expect(JSON.stringify(S().templates)).toBe(tplBefore); expect(JSON.stringify([S().weekPlan, S().planOverrides])).toBe(planBefore);

  /* środa na siłowni: szablon oryginalny, wszystkie ćwiczenia z planu, bez wiersza „Dostosuj” */
  jest.setSystemTime(WED.getTime()); await flushAll(10); await act(async () => { store.startFromTemplate(S().templates[0]); }); await flushAll(10);
  expect(S().active!.locationId).toBe('gym'); expect(S().active!.exercises.map(e => e.exerciseId)).toEqual(FBW.map(([n]) => ex(n).id)); expect(S().active!.exercises.every(e => !e.swappedFrom && !e.skipped)).toBe(true);
  expect(screen.queryByTestId('adapt-line')).toBeNull();
});
