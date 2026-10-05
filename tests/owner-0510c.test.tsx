/* Uwagi właściciela 05.10.2026 po treningu: 1) grupy sprzętu zwijane, 3) bieżnia z nachyleniem i bez, 4) gumy — zakres poziomów w miejscu. */
import { renderApp, flushAll, screen, go, tap, act, fireEvent } from './app';

jest.setTimeout(60000);

describe('1) grupy sprzętu zwijane', () => {
  test('domyślnie zwinięte z licznikiem; dotknięcie rozwija i zwija', async () => {
    await renderApp(); await go('/more/locations'); await flushAll(10);
    await tap(screen.getByText('+ Dodaj miejsce')); await tap(screen.getByText('Dom')); await flushAll(10);
    expect(screen.queryByLabelText('Ławka regulowana')).toBeNull();
    const g = screen.getByLabelText('Ławki i stojaki'); expect(g.props.accessibilityState).toEqual({ expanded: false }); expect(screen.getAllByText(/^0 z \d+$/).length).toBeGreaterThan(0);
    await tap(g); expect(screen.getByLabelText('Ławka regulowana')).toBeTruthy();
    await act(async () => { fireEvent(screen.getByLabelText('Ławka regulowana'), 'valueChange', true); }); await flushAll(5);
    expect(screen.getByText(/^1 z \d+$/)).toBeTruthy();
    await tap(screen.getByLabelText('Ławki i stojaki')); expect(screen.queryByLabelText('Ławka regulowana')).toBeNull();
  });
});

import * as store from '@/lib/store';
import { fresh } from './helpers';
import { addLocation, setEquip, setBandLevels, activeEquip } from '@/lib/locations';
import { availability, capsOf } from '@/lib/equipment';

describe('4) gumy — zakres poziomów w miejscu', () => {
  const bands = () => { const st = store.getState(); st.bands = [1, 2, 3, 5, 7].map(level => ({ ...st.bands[0] ?? {}, id: 'b' + level, color: 'c' + level, level } as any)); };
  test('przycisk gumy w serii przełącza tylko gumy z zakresu miejsca treningu; bez zakresu — wszystkie', async () => {
    await fresh(); bands(); const l = addLocation('home'); setEquip(l, 'bands', true);
    store.startEmpty(); store.addExerciseToActive(store.getState().exercises.find(e => e.name === 'Pull Up')!); store.setActiveLocation(l.id);
    const s = store.getState().active!.exercises[0].sets[0]; const seq = () => { const out: string[] = []; s.bandId = ''; for (let i = 0; i < 6; i++) { store.cycleBand(s); out.push(s.bandId); } return out; };
    expect(seq()).toEqual(['b1', 'b2', 'b3', 'b5', 'b7', '']);
    setBandLevels(l, 2, 5); expect(activeEquip(l, 'bands')!.levels).toEqual([2, 5]);
    expect(seq()).toEqual(['b2', 'b3', 'b5', '', 'b2', 'b3']);
    setBandLevels(l, 6, 3); expect(activeEquip(l, 'bands')!.levels).toEqual([3, 6]); /* odwrócony zakres → posortowany */
    setBandLevels(l, 0, 9); expect(activeEquip(l, 'bands')!.levels).toBeUndefined(); /* 1–7 = bez ograniczenia */
  });
  test('zakres zapisany i odczytany (migracja nie gubi), zły zakres odrzucony; ekran miejsca pokazuje pola od–do', async () => {
    await fresh(); const l = addLocation('home'); setEquip(l, 'bands', true); setBandLevels(l, 2, 4); await store.flush();
    const raw = JSON.parse(JSON.stringify(store.getState())); raw.settings.locations[0].equipment.push({ item: 'bands', opts: [] });
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) });
    expect(store.getState().settings.locations[0].equipment.find(e => e.item === 'bands')!.levels).toEqual([2, 4]);
    const bad = JSON.parse(JSON.stringify(store.getState())); bad.settings.locations[0].equipment.find((e: any) => e.item === 'bands').levels = ['x', 99];
    await renderApp({ saved: bad }); expect(store.getState().settings.locations[0].equipment.find(e => e.item === 'bands')!.levels).toBeUndefined();
    await go(`/more/location/${store.getState().settings.locations[0].id}`); await flushAll(10); await tap(screen.getByLabelText('Akcesoria'));
    expect(screen.getByLabelText('Gumy oporowe: od poziomu')).toBeTruthy(); expect(screen.getByLabelText('Gumy oporowe: do poziomu')).toBeTruthy();
  });
});

describe('3) bieżnia z nachyleniem i bez', () => {
  test('marsz pod górę wymaga nachylenia; zwykły marsz — każdej bieżni', async () => {
    await fresh(); const l = addLocation('home'); setEquip(l, 'treadmill', true);
    const incline = store.getState().exercises.find(e => e.name === 'Incline Walk (bieżnia)')!; const walk = store.getState().exercises.find(e => e.name === 'Treadmill Walking')!;
    expect(activeEquip(l, 'treadmill')!.opts).toContain('incline'); /* domyślnie z nachyleniem */
    expect(availability(incline, l, capsOf(l)).ok).toBe(true);
    store.getState(); const { setOpt } = require('@/lib/locations'); setOpt(l, 'treadmill', 'incline', false);
    expect(availability(incline, l, capsOf(l)).ok).toBe(false); expect(availability(walk, l, capsOf(l)).ok).toBe(true);
  });
  test('istniejące bieżnie (sprzed opcji) dostają nachylenie raz — „marsz pod górę” nie znika po aktualizacji', async () => {
    await fresh(); const l = addLocation('home'); setEquip(l, 'treadmill', true); activeEquip(l, 'treadmill')!.opts = []; await store.flush();
    const raw = JSON.parse(JSON.stringify(store.getState())); delete raw.optFill;
    await renderApp({ saved: raw }); expect(store.getState().settings.locations[0].equipment.find(e => e.item === 'treadmill')!.opts).toEqual(['incline']);
    const again = JSON.parse(JSON.stringify(store.getState())); again.settings.locations[0].equipment.find((e: any) => e.item === 'treadmill').opts = [];
    await renderApp({ saved: again }); expect(store.getState().settings.locations[0].equipment.find(e => e.item === 'treadmill')!.opts).toEqual([]); /* tylko raz — odznaczenie zostaje */
  });
});
