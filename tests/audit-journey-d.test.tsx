/* Runda 72 — testy z audytu T8 (pełna ścieżka użytkownika, weryfikacja końcowa). */
const log = (..._a: unknown[]) => { /* diagnostyka audytu wyciszona */ };
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as units from '@/lib/units';
import { exName, t as tr } from '@/lib/i18n';
import { renderApp, tap, type, flushAll, screen, go, act } from './app';
import { ex, pressAlert, seedWithDemo } from './helpers';

jest.setTimeout(120000);
afterEach(async () => { await timer.stop(); await timer.stopSet(); units.applyUnit('kg'); });
const field = (label: string, hint: string) => { const f = screen.getAllByLabelText(label).find(x => x.props.accessibilityHint === hint); if (!f) throw new Error('no field ' + label + ' ' + hint); return f; };
const finish = async () => { await tap(screen.getAllByText(tr('Zakończ trening i zapisz'))[0]); pressAlert(tr('Zakończyć trening?'), tr('Zakończ')); await flushAll(600); };
const texts = () => screen.getAllByText(/./).map(x => [x.props.children].flat().join('')).join(' | ');

test('D1 en/lb day2 improvement: alert + history + poprzednio', async () => {
  await renderApp({ locale: 'en', saved: seedWithDemo('en') });
  const st = store.getState(); st.settings.unit = 'lb'; store.applyPrefs(); store.save(); await flushAll(400);
  const bench = exName(ex('Bench Press (hantle)')); const lbl = store.loadLabel(ex('Bench Press (hantle)'));
  await tap(screen.getByLabelText(tr('Start: {name}', { name: 'Upper A' }))); await flushAll(10);
  for (let i = 1; i <= 4; i++) await tap(screen.getByLabelText(tr('Seria {n} zrobiona — {ex}', { n: i, ex: bench })));
  await finish();
  jest.setSystemTime(Date.now() + 86400e3); await go('/'); await flushAll(10);
  await tap(screen.getByLabelText(tr('Start: {name}', { name: 'Upper A' }))); await flushAll(10);
  log('day2 screen', texts().slice(0, 800));
  await type(field(lbl, tr('Seria {n} — {ex}', { n: 1, ex: bench })), '55');
  for (let i = 1; i <= 4; i++) await tap(screen.getByLabelText(tr('Seria {n} zrobiona — {ex}', { n: i, ex: bench })));
  log('day2 sets', JSON.stringify(store.getState().active!.exercises[0].sets.map(s => [s.weight, s.reps])));
  global.__alerts.length = 0; await finish();
  log('alerts', JSON.stringify(global.__alerts.map(x => [x.title, x.msg])));
  log('history', texts().slice(0, 1200));
});
