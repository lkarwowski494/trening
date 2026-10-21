/*
 * M1-audytor-generalny-034: linki na ekranie treningu miały pola dotyku ok. 32–38 pt — chip miejsca („Dom ▾”), wiersz „N ćwiczeń bez sprzętu · Dostosuj” i podpowiedź
 * „Zwykle w: … Zamienić?”. Po naprawie minHeight + hitSlop dają ≥ 44 pt (HIG) dla każdego z trzech.
 */
import { StyleSheet } from 'react-native';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { fresh, ex } from './helpers';
import { renderApp, flushAll, screen } from './app';
import { loc } from './locations-fixtures';
import { presetEquipment } from '@/lib/equipment';

jest.setTimeout(60000);
afterEach(async () => { await timer.stop(); await timer.stopSet(); });
const S = () => store.getState();
const item = (name: string, id: string) => ({ id, exerciseId: ex(name).id, sets: 3, repMin: 6, repMax: 8, restSec: 120, startWeight: '' as const, targetSec: '' as const, groupId: null });
const MIN_PT = 44;
/** Wysokość pola dotyku: minHeight stylu + hitSlop góra/dół (jak iOS). */
const touchH = (el: { props: { style?: unknown; hitSlop?: unknown } }) => {
  const st = StyleSheet.flatten(el.props.style as never) as { minHeight?: number; height?: number; paddingVertical?: number }; const hs = el.props.hitSlop; const slop = typeof hs === 'number' ? { top: hs, bottom: hs } : (hs as { top?: number; bottom?: number }) ?? {};
  return (st.minHeight ?? st.height ?? 0) + (slop.top ?? 0) + (slop.bottom ?? 0);
};
async function world() {
  await fresh(undefined, 'pl'); const s = S().settings;
  s.locations = [loc('Siłownia', presetEquipment('gym'), 'gym'), loc('Hotel', presetEquipment('hotel'), 'hotel')]; s.mainLocationId = 'gym';
  const tpl = store.newTemplate(); tpl.name = 'FBW'; tpl.items = [item('Bench Press (sztanga)', 'bench'), item('Overhead Press (sztanga)', 'ohp')];
  tpl.items[0].alternates = [{ locationId: 'hotel', exerciseId: ex('Bench Press (hantle)').id, restSec: null }]; store.save(tpl);
  store.startFromTemplate(tpl); store.setActiveLocation('hotel'); await store.flush(); await renderApp({ saved: JSON.parse(JSON.stringify(S())) }); await flushAll(20);
}
describe('pola dotyku linków na ekranie treningu', () => {
  test('chip miejsca, wiersz „Dostosuj” i podpowiedź zamiennika mają pole ≥ 44 pt', async () => {
    await world();
    const chip = screen.getByLabelText(/^Miejsce treningu: /); const adapt = screen.getByTestId('adapt-line'); const hint = screen.getByLabelText(/^Zamień na zamiennik: /);
    for (const [n, el] of [['chip miejsca', chip], ['Dostosuj', adapt], ['zamiennik', hint]] as const) expect([n, touchH(el) >= MIN_PT]).toEqual([n, true]);
  });
});
