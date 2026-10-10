/* Audyt kontrolny 1, UX2-02 (ŚREDNIA): podgląd szablonu bez przypisanego miejsca pisał „📍 (usunięte miejsce)”, choć taki szablon używa
 * miejsca głównego (edytor pokazuje zaznaczone „główne”, start bierze miejsce główne). Ma pokazywać nazwę miejsca głównego z dopiskiem „główne”;
 * „(usunięte miejsce)” tylko dla id miejsca, którego już nie ma. */
import * as store from '@/lib/store';
import * as draft from '@/lib/draft';
import { addLocation, deleteLocation } from '@/lib/locations';
import { fresh, ex, saved } from './helpers';
import { renderApp, flushAll, screen, go, act } from './app';

jest.setTimeout(60000);
afterEach(() => { draft.__resetObjDrafts(); });

const mkTpl = (locationId?: string) => { const t = store.newTemplate(); t.name = 'Push'; if (locationId) t.locationId = locationId;
  t.items.push({ id: 'a', exerciseId: ex('Bench Press (sztanga)').id, sets: 3, repMin: 6, repMax: 8, restSec: 150, startWeight: 60, targetSec: '', groupId: null }); store.save(t); return t; };
const boot = async (fn: () => void) => { await fresh(); fn(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(10); };

describe('UX2-02 — miejsce w podglądzie szablonu', () => {
  test('szablon bez miejsca przy ≥ 1 miejscu: nazwa miejsca głównego z „główne”, bez „(usunięte miejsce)”', async () => {
    let id = ''; await boot(() => { addLocation('gym', 'Siłownia'); id = mkTpl().id; });
    await go(`/template/${id}`); await flushAll(10);
    expect(screen.queryByText(/usunięte miejsce/)).toBeNull();
    expect(screen.getByText(/📍 Siłownia \(główne\)/)).toBeTruthy();
  });
  test('szablon z przypisanym miejscem: jego nazwa; po usunięciu tego miejsca — „(usunięte miejsce)”', async () => {
    let id = ''; let dom = ''; await boot(() => { addLocation('gym', 'Siłownia'); dom = addLocation('bodyweight', 'Dom').id; id = mkTpl(dom).id; });
    await go(`/template/${id}`); await flushAll(10);
    expect(screen.getByText(/📍 Dom/)).toBeTruthy(); expect(screen.queryByText(/główne/)).toBeNull();
    await act(async () => { deleteLocation(dom); }); await go(`/template/${id}`); await flushAll(10);
    expect(screen.getByText(/usunięte miejsce/)).toBeTruthy();
  });
});
