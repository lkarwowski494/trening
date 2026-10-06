/* Decyzja właściciela 06.10.2026 (wariant A): sztanga / gryf EZ / trap bar zaznaczone bez wpisanych talerzy = ciężary nieznane
 * (podpowiedź „↑” i wartości z poprzedniego treningu jak bez miejsca), nie „dostępne tylko 20 kg”. Znalezisko testów macierzowych 06.10. */
import * as store from '@/lib/store';
import { addLocation, setEquip } from '@/lib/locations';
import { loadsFor as exLoads, equipById } from '@/lib/equipment';
import { noPlates } from '@/lib/loads';
import { loadSummary } from '@/components/LoadEditor';
import { fresh, ex } from './helpers';

beforeEach(async () => { await fresh(); });
test.each(['barbell', 'ez_bar', 'trap_bar'])('%s bez talerzy → ciężary nieznane; z talerzami → lista', item => {
  const l = addLocation('bodyweight'); setEquip(l, item, true); const e = l.equipment.find(x => x.item === item)!;
  const name = item === 'barbell' ? 'Bench Press (sztanga)' : store.getState().exercises.find(x => (x.requires ?? []).some(g => g.includes(item)) && x.loadSource)!.name;
  expect(noPlates(e.load!)).toBe(true);
  expect(exLoads(ex(name), l).kind).toBe('unknown');
  expect(loadSummary(equipById(item)!, e.load!)).toBe('brak ciężarów — podpowiedź „↑” jak bez miejsca');
  (e.load as any).plates = [{ w: 10, n: 2 }];
  expect(noPlates(e.load!)).toBe(false); expect(exLoads(ex(name), l).kind).toBe('loads');
});
