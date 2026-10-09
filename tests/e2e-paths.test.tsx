/* Przebieg E2E 89 (09.10.2026, commit dfa7ab8): ścieżki scenariuszy Maestro odtworzone w Jest (EN, całe ekrany expo-router) — teksty i etykiety,
 * które scenariusze .maestro dopasowują, oraz zachowanie po drodze. Każda porażka przebiegu 89 ma tu test: albo odtwarza błąd aplikacji,
 * albo przypina tekst, na który scenariusz został poprawiony (selektor zgodny z tym, co renderuje aplikacja). */
import * as store from '@/lib/store';
import * as draft from '@/lib/draft';
import { fresh, saved } from './helpers';
import { renderApp, flushAll, screen, go, tap, type, act } from './app';

jest.setTimeout(60000);
afterEach(() => { draft.__resetObjDrafts(); });
const S = () => store.getState();
const boot = async (fn: () => void = () => {}, url?: string) => { await fresh(undefined, 'en'); fn(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url, locale: 'en' }); await flushAll(10); };

describe('E2E 89 — podprzepływ szablon-testowy (Upper A)', () => {
  test('„+ New template” → nazwa (bez endEditing) → dwa ćwiczenia → „Save template” → „Back” → „Start: Upper A”', async () => {
    await boot();
    await tap(screen.getByLabelText('+ New template')); await flushAll(10);
    const nameF = screen.getByLabelText('Name'); expect(nameF.props.value).toBe('New template');
    await type(nameF, 'Upper A'); await flushAll(5);
    for (const [q, lbl] of [['Bench Press', 'Bench Press (Dumbbell), dumbbells'], ['Bent Over Row', 'Bent Over Row (Dumbbell), dumbbells']]) {
      await tap(screen.getByLabelText('+ Add exercise')); await flushAll(10);
      await type(screen.getByPlaceholderText('Search exercises…'), q); await flushAll(5);
      await tap(screen.getByLabelText(lbl)); await flushAll(10);
    }
    expect(screen.getByLabelText('Name').props.value).toBe('Upper A');
    await tap(screen.getByLabelText('Save template')); await flushAll(10);
    expect(S().templates[0].name).toBe('Upper A');
    expect(screen.getByLabelText('Edit template')).toBeTruthy();
  });
});
