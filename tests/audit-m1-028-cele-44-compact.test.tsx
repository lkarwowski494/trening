/*
 * M1-audytor-generalny-028 (04-studio-projektowe-004, audyt M1 27.10.2026, poprawka 27.10.2026; SP-06): w zwartym układzie wiersza serii (COMPACT — gdy szerokie kolumny się nie
 * mieszczą, np. 320 pt) przycisk stopera serii i pole RPE miały 40 pt szerokości, bez hitSlop — poniżej przyjętych 44 pt (SIZE.hit, design-spec §1).
 * Po poprawce (rekomendacja audytu, opcja a): szerokość kolumny bez zmian (wiersz nadal mieści się na 320 pt — tests/ux.test.tsx C4), a pole dotyku
 * obu elementów ma 44 pt dzięki hitSlop po bokach. Bieg (dystans + czas) z RPE przy 320 pt to układ COMPACT.
 */
import { Dimensions, StyleSheet } from 'react-native';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { rowLayout } from '@/components/ActiveWorkout';
import { SIZE } from '@/lib/theme';
import { fresh, ex } from './helpers';
import { renderApp, flushAll, screen, act } from './app';

jest.setTimeout(30000);
afterEach(async () => { jest.restoreAllMocks(); try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
/** Szerokość okna 320 pt (renderApp nie ustawia szerokości okna — useWindowDimensions czyta Dimensions). */
const win320 = () => { const w = Dimensions.get('window'); jest.spyOn(Dimensions, 'get').mockImplementation(((k: string) => (k === 'window' ? { ...w, width: 320 } : Dimensions.get.call(Dimensions, k as never))) as never); };
type El = { props: { style?: unknown; hitSlop?: number | { left?: number; right?: number } }; parent: El | null };
const slopX = (h: El['props']['hitSlop']) => (typeof h === 'number' ? 2 * h : (h?.left ?? 0) + (h?.right ?? 0));
const width = (el: El): number => { let p: El | null = el; while (p) { const w = (StyleSheet.flatten(p.props.style as never) as { width?: number } | undefined)?.width; if (typeof w === 'number') return w; p = p.parent; } return 0; };

test('320 pt, bieg z RPE: układ COMPACT; stoper serii i pole RPE mają pole dotyku ≥ 44 pt (szerokość + hitSlop)', async () => {
  await fresh(); const st = store.getState(); st.settings.showRpe = true; st.settings.workoutView = 'list';
  const L = rowLayout('distance_time', false, true, 320); expect(L.W.play).toBeLessThan(SIZE.hit); expect(L.fixedW).toBeLessThanOrEqual(L.avail); /* COMPACT */
  await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Bieg')); }); await store.flush();
  win320(); await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())), width: 320 }); await flushAll(50);
  expect(screen.getAllByLabelText('Start stopera serii').length).toBeGreaterThan(0);
  const play = screen.getAllByLabelText('Start stopera serii')[0] as unknown as El; expect(width(play) + slopX(play.props.hitSlop)).toBeGreaterThanOrEqual(SIZE.hit);
  const rpe = screen.getAllByLabelText('RPE').find(x => x.props.onChangeText) as unknown as El; expect(rpe).toBeTruthy(); expect(width(rpe) + slopX(rpe.props.hitSlop)).toBeGreaterThanOrEqual(SIZE.hit);
});
