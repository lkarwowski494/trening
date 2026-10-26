/* Test na telefonie, build 1030 (23.10.2026): nowa instalacja startuje w ciemnym motywie; zapisane ustawienie osoby, która już korzysta, zostaje bez zmian. */
import { Appearance } from 'react-native';
import * as store from '@/lib/store';
import { defaultSettings, seedState } from '@/lib/seed';
import { fresh } from './helpers';

describe('domyślny motyw: ciemny dla nowej instalacji', () => {
  test('defaultSettings i seedState: theme = dark', () => { expect(defaultSettings().theme).toBe('dark'); expect(seedState('pl').settings.theme).toBe('dark'); expect(seedState('en').settings.theme).toBe('dark'); });
  test('świeża instalacja (pusta baza): ustawienie dark zapisane w bazie i nałożone na system (setColorScheme)', async () => {
    const spy = jest.spyOn(Appearance, 'setColorScheme').mockImplementation(() => {});
    try { await fresh(); expect(store.getState().settings.theme).toBe('dark'); expect(JSON.parse(global.__kv.get('state')!).settings.theme).toBe('dark'); expect(spy).toHaveBeenLastCalledWith('dark'); }
    finally { spy.mockRestore(); }
  });
  test.each(['light', 'dark', 'auto'] as const)('istniejące ustawienie %s zostaje po wczytaniu zapisanych danych', async th => {
    const s = seedState('pl'); s.settings.theme = th; await fresh(s); expect(store.getState().settings.theme).toBe(th);
  });
  test('zapis bez pola theme (bardzo stare dane) nadal normalizowany do jasnego — nie zmieniamy wyglądu istniejącej osoby', async () => {
    const s: any = seedState('pl'); delete s.settings.theme; await fresh(s); expect(store.getState().settings.theme).toBe('light');
  });
});
