/* Uwaga właściciela 06.10.2026: „ćwiczenia z band nie mają przy tworzeniu szablonu / przy pustym treningu wyboru zakresu gumy. Sprawdź wszystkie
 * ćwiczenia z band i upewnij się, że można wybrać gumy z zakresu 1–7.” */
import { renderApp, flushAll, screen, go, tap, openCard, startEdit, saveEdit, tplDraft } from './app';
import * as store from '@/lib/store';
import { fresh, ex } from './helpers';
import { addLocation, setEquip, setBandLevel } from '@/lib/locations';

jest.setTimeout(60000);
const bandEx = () => store.getState().exercises.filter(e => !e.archived && (e.bandAssistable || (e.requires ?? []).some(g => g.includes('bands'))));

test('wszystkie ćwiczenia z gumami (opór i asysta) mają przycisk gumy — w katalogu co najmniej 30 z oporem gumy (34 przed researchem biblioteki 09.10.2026 — część scalona)', async () => {
  await fresh(); const all = bandEx(); expect(all.filter(e => !e.bandAssistable).length).toBeGreaterThanOrEqual(30);
  for (const e of all) expect([e.name, store.usesBand(e)]).toEqual([e.name, true]);
  expect(store.usesBand(ex('Bench Press (sztanga)'))).toBe(false);
});
test('pusty trening: Band Pull Apart — przycisk gumy przełącza poziomy 1–7 z miejsca (wszystkie 7 po zaznaczeniu w miejscu)', async () => {
  await fresh(); const l = addLocation('home'); setEquip(l, 'bands', true); for (let n = 1; n <= 7; n++) setBandLevel(l, n, true);
  store.startEmpty(); store.setActiveLocation(l.id); store.addExerciseToActive(ex('Band Pull Apart')); await store.flush();
  await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await flushAll(10);
  const btn = () => screen.getAllByLabelText(/^Guma: /)[0]; const seen: number[] = [];
  for (let i = 0; i < 8; i++) { await tap(btn()); const s = store.getState().active!.exercises[0].sets[0]; const b = store.getState().bands.find(x => x.id === s.bandId); if (b) seen.push(b.level); }
  expect([...new Set(seen)].sort()).toEqual([1, 2, 3, 4, 5, 6, 7]);
});
test('szablon: wiersz serii ćwiczenia z gumą ma przycisk gumy; guma z wiersza trafia do treningu', async () => {
  await fresh(); const st = store.getState(); st.templates.push({ ...st.templates[0], id: 'tb', name: 'B', items: [{ id: 'ib', exerciseId: ex('Band Pull Apart').id, sets: 2, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null }] } as any); await store.flush();
  await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await go('/template/tb'); await flushAll(10); await startEdit(); await openCard(0);
  await tap(screen.getAllByLabelText(/^Guma: /)[0]); expect(tplDraft('tb').items[0].rows![0].bandId).toBeTruthy(); await saveEdit(); const it = store.getState().templates.find(x => x.id === 'tb')!.items[0]; expect(it.rows![0].bandId).toBeTruthy();
  store.startFromTemplate(store.getState().templates.find(x => x.id === 'tb')!); expect(store.getState().active!.exercises[0].sets[0].bandId).toBe(it.rows![0].bandId);
});
