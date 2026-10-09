/* Audyt kontrolny 1, UX2-11 (NISKA): na 320 pt etykieta „Data pomiaru (RRRR-MM-DD)” zawijała się i pola masy i daty stały w jednym rzędzie
 * na różnych wysokościach. Pola jedno pod drugim — każde ma całą szerokość, etykiety nie konkurują o miejsce (także przy powiększonym tekście). */
import * as store from '@/lib/store';
import { fresh, saved } from './helpers';
import { renderApp, flushAll, screen, go, act } from './app';

jest.setTimeout(60000);
test('UX2-11: pola masy i daty nie są w jednym rzędzie (ekran 320 pt)', async () => {
  await fresh(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), width: 320 }); await flushAll(10);
  await go('/more/bodymass'); await flushAll(10);
  const mass = screen.getByText(/^Masa ciała \(kg\)$/); const date = screen.getByText('Data pomiaru (RRRR-MM-DD)');
  const rowOf = (n: { parent: unknown; props: { style?: unknown } }) => { let p = n as { parent: { props: { style?: unknown } } | null; props: { style?: unknown } } | null; while (p) { const st = [p.props.style].flat(9).filter(Boolean) as { flexDirection?: string }[]; if (st.some(s => s.flexDirection === 'row')) return p; p = p.parent as typeof p; } return null; };
  const a = rowOf(mass as never); const b = rowOf(date as never);
  expect(a && b && a === b).toBeFalsy();
});
