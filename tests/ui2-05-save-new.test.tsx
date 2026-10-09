/* Audyt kontrolny 1, UI2-05 (NISKA): „+ Nowy”/„+ Nowe” → „Zapisz” bez żadnej zmiany → po wyjściu z ekranu obiekt znikał (dropUnsavedNew przy
 * odmontowaniu: nietknięty od utworzenia). Decyzja wg zasady z 20:20 — wariant A: „Zapisz” to jawny wybór, zawsze zostawia obiekt.
 * „Anuluj” bez zmian nadal nic nie zostawia (bez śmieci po rezygnacji). */
import * as store from '@/lib/store';
import * as draft from '@/lib/draft';
import { fresh, saved } from './helpers';
import { renderApp, flushAll, screen, go, tap, act, saveEdit } from './app';

jest.setTimeout(60000);
afterEach(() => { draft.__resetObjDrafts(); });
const S = () => store.getState();
const back = async () => { const { router } = require('expo-router'); await act(async () => { router.back(); }); }; /* wyjście z ekranu — odmontowanie (dropUnsavedNew) */
const boot = async (url: string) => { await fresh(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url }); await flushAll(10); };

describe('UI2-05 — „Zapisz” bez zmian zostawia nowy obiekt', () => {
  test('szablon: „+ Nowy” → „Zapisz” → wyjście z ekranu → szablon zostaje (także po restarcie)', async () => {
    await boot('/templates'); const n0 = S().templates.length;
    await tap(screen.getByText('+ Nowy')); await flushAll(10); await saveEdit(); await flushAll(10);
    await back(); await flushAll(10);
    expect(S().templates.length).toBe(n0 + 1);
    await act(async () => { await store.flush(); }); expect(JSON.parse(JSON.stringify(saved())).templates.length).toBe(n0 + 1);
  });
  test('ćwiczenie: „+ Nowe” → „Zapisz” → wyjście → ćwiczenie zostaje', async () => {
    await boot('/exercises'); const n0 = S().exercises.length;
    await tap(screen.getByText('+ Nowe')); await flushAll(10); await saveEdit(); await flushAll(10);
    await back(); await flushAll(10);
    expect(S().exercises.length).toBe(n0 + 1);
  });
  test('„Anuluj” bez zmian nadal nic nie zostawia', async () => {
    await boot('/templates'); const n0 = S().templates.length;
    await tap(screen.getByText('+ Nowy')); await flushAll(10); await tap(screen.getByLabelText('Anuluj edycję szablonu')); await flushAll(10);
    expect(S().templates.length).toBe(n0);
  });
});
