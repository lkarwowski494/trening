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

describe('E2E 89 — podprzepływy szablon-testowy i start-szablonu (Upper A), wydanie 1 (11.10.2026)', () => {
  test('Więcej → Szablony: „+ New” → nazwa (bez endEditing) → dwa ćwiczenia → „Save template” → „Back” → „Back” → zakładka Trening → „Other workout” → „From a template” → „Start: Upper A”', async () => {
    await boot();
    await tap(screen.getByLabelText(/^More, tab/)); await flushAll(10); await tap(screen.getByLabelText('Templates')); await flushAll(10); /* 11.10.2026: Szablony pod Więcej */
    await tap(screen.getByLabelText('+ New')); await flushAll(10);
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
    await act(async () => { require('expo-router').router.back(); }); await flushAll(10); /* „Back” w pasku nawigacji (w Jest się nie renderuje) */
    expect(screen.getByLabelText('+ New')).toBeTruthy(); /* po zapisie „Back” wraca na listę szablonów */
    await act(async () => { require('expo-router').router.back(); }); await flushAll(10); expect(screen.getByLabelText(/^Workout, tab/)).toBeTruthy(); /* drugie „Back” — do Więcej z paskiem zakładek */
    await tap(screen.getByLabelText(/^Workout, tab/)); await flushAll(10);
    await tap(screen.getByLabelText('Other workout')); await flushAll(10);
    await tap(screen.getByLabelText('From a template')); await flushAll(10);
    await tap(screen.getByLabelText('Start: Upper A')); await flushAll(10);
    expect(S().active?.templateId).toBe(S().templates[0].id);
  });
});
