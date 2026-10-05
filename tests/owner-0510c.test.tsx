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
import { addLocation, setEquip, setBandLevel, setBandColor, activeEquip } from '@/lib/locations';
import { availability, capsOf } from '@/lib/equipment';

describe('4) gumy w miejscu — posiadane poziomy 1–7 jak ciężary hantli, kolory przy poziomach (decyzja 05.10.2026)', () => {
  const bands = () => { const st = store.getState(); st.bands = [1, 2, 3, 5, 7].map(level => ({ ...(st.bands[0] ?? {}), id: 'b' + level, color: 'c' + level, level } as any)); };
  test('włączenie gum w miejscu zaznacza poziomy posiadanych gum; przycisk gumy przełącza tylko gumy z zaznaczonych poziomów', async () => {
    await fresh(); bands(); const l = addLocation('home'); setEquip(l, 'bands', true);
    expect(activeEquip(l, 'bands')!.levels).toEqual([1, 2, 3, 5, 7]);
    store.startEmpty(); store.addExerciseToActive(store.getState().exercises.find(e => e.name === 'Pull Up')!); store.setActiveLocation(l.id);
    const s = store.getState().active!.exercises[0].sets[0]; const seq = () => { const out: string[] = []; s.bandId = ''; for (let i = 0; i < 6; i++) { store.cycleBand(s); out.push(s.bandId); } return out; };
    expect(seq()).toEqual(['b1', 'b2', 'b3', 'b5', 'b7', '']);
    setBandLevel(l, 1, false); setBandLevel(l, 7, false); expect(activeEquip(l, 'bands')!.levels).toEqual([2, 3, 5]);
    expect(seq()).toEqual(['b2', 'b3', 'b5', '', 'b2', 'b3']);
  });
  test('zaznaczenie poziomu bez gumy tworzy gumę tego poziomu; kolor edytowany w miejscu; edytor historii używa miejsca edytowanego treningu (audyt MEDIUM)', async () => {
    await fresh(); bands(); const l = addLocation('home'); setEquip(l, 'bands', true);
    setBandLevel(l, 4, true); const b4 = store.getState().bands.find(b => b.level === 4)!; expect(b4).toBeTruthy(); expect(activeEquip(l, 'bands')!.levels).toEqual([1, 2, 3, 4, 5, 7]);
    setBandColor(4, 'zielona'); expect(store.getState().bands.find(b => b.level === 4)!.color).toBe('zielona');
    setBandLevel(l, 1, false); setBandLevel(l, 2, false); setBandLevel(l, 3, false); setBandLevel(l, 7, false);
    expect(store.nextBandId('', l.id)).toBe(b4.id); expect(store.nextBandId('', null)).toBe('b1'); /* bez miejsca — wszystkie */
  });
  test('zapis/odczyt: lista poziomów przetrwa migrację; zły zapis odrzucony; ekran miejsca: przyciski 1–7 i kolory zaznaczonych', async () => {
    await fresh(); bands(); const l = addLocation('home'); setEquip(l, 'bands', true); setBandLevel(l, 7, false); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) });
    expect(store.getState().settings.locations[0].equipment.find(e => e.item === 'bands')!.levels).toEqual([1, 2, 3, 5]);
    const bad = JSON.parse(JSON.stringify(store.getState())); bad.settings.locations[0].equipment.find((e: any) => e.item === 'bands').levels = ['x', 99, 3, 3];
    await renderApp({ saved: bad }); expect(store.getState().settings.locations[0].equipment.find(e => e.item === 'bands')!.levels).toEqual([3]);
    await go(`/more/location/${store.getState().settings.locations[0].id}`); await flushAll(10); await tap(screen.getByLabelText('Akcesoria'));
    for (let i = 1; i <= 7; i++) expect(screen.getByLabelText(`Gumy oporowe: poziom ${i}`)).toBeTruthy();
    expect(screen.getByLabelText('Kolor gumy: poziom 3')).toBeTruthy();
  });
  test('ekran „Gumy” zniknął z Więcej', async () => {
    await renderApp(); await go('/more'); await flushAll(10); expect(screen.queryByText('Gumy')).toBeNull();
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
