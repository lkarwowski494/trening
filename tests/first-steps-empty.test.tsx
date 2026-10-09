/*
 * „Pierwsze kroki” przy pustym szablonie (decyzja właściciela 09.10.2026): gdy jedyne szablony nie mają ćwiczeń — „Dodaj ćwiczenia do szablonu „…””
 * z przejściem do edycji (ostatnio zmieniany), przy kilku — „Puste szablony: n” → lista Szablony; bez szablonów — „Najpierw utwórz szablon.” jak dotąd.
 * Regresja (docs/20 rodzaj 8): dawniej przy pustym szablonie „Najpierw utwórz szablon.” (czerwony na e132ed0). Logika: lib/dashboard emptyTemplates.
 */
import * as store from '@/lib/store';
import * as draft from '@/lib/draft';
import { applyLang } from '@/lib/i18n';
import { emptyTemplates } from '@/lib/dashboard';
import { fresh, saved, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, tap, type, act, saveEdit } from './app';
import { router } from 'expo-router';

jest.setTimeout(60000);
const NOW = new Date(2026, 9, 8, 9, 0); /* czwartek */
const S = () => store.getState();
afterEach(() => { applyLang('pl'); draft.__resetObjDrafts(); });
const boot = async (url: string, fn: (ids: string[]) => void = () => {}, opts: { demo?: boolean } = {}) => {
  jest.useFakeTimers({ now: NOW }); await fresh(); const t = opts.demo === false ? [] : withDemoTemplates(); fn(t.map(x => x.id));
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
  return t;
};
const addPlank = async () => {
  await tap(screen.getByText('+ Dodaj ćwiczenie')); await flushAll(10);
  await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'Plank'); await flushAll(5); await tap(screen.getAllByText('Plank')[0]); await flushAll(10);
  if (screen.queryByLabelText('Zapisz szablon') == null) { await act(async () => { router.back(); }); await flushAll(10); }
};
/** Logika: świeży stan z czasem NOW (bez ekranu). */
const freshLogic = async () => { jest.useFakeTimers({ now: NOW }); await fresh(); };
const demo = () => withDemoTemplates();

describe('„Pierwsze kroki” — puste szablony (emptyTemplates)', () => {
  beforeEach(freshLogic);
  test('bez szablonów — pusto; puste niezarchiwizowane, ostatnio zmieniany pierwszy; szablon z ćwiczeniami i w archiwum — nie', () => {
    expect(emptyTemplates()).toEqual([]);
    const a = store.newTemplate(); a.name = 'Test A'; store.save(a);
    jest.setSystemTime(NOW.getTime() + 60000); const b = store.newTemplate(); b.name = 'Test B'; store.save(b);
    expect(emptyTemplates().map(x => x.name)).toEqual(['Test B', 'Test A']);
    jest.setSystemTime(NOW.getTime() + 120000); store.save(a); expect(emptyTemplates().map(x => x.name)).toEqual(['Test A', 'Test B']);
    store.setTemplateArchived(b, true); demo(); expect(emptyTemplates().map(x => x.name)).toEqual(['Test A']);
  });
});

describe('regresja (09.10.2026): „Pierwsze kroki” przy pustym szablonie — dawniej „Najpierw utwórz szablon.”', () => {
  test('jeden pusty szablon „Test A” → „Dodaj ćwiczenia do szablonu „Test A”.” i przejście do edycji; po dodaniu ćwiczenia krok 2 ma „Plan tygodnia”', async () => {
    await boot('/', () => { const x = store.newTemplate(); x.name = 'Test A'; store.save(x); }, { demo: false });
    expect(screen.queryByText('Najpierw utwórz szablon.')).toBeNull(); expect(screen.getByText('Dodaj ćwiczenia do szablonu „Test A”.')).toBeTruthy();
    expect(screen.queryByText(/^Puste szablony/)).toBeNull();
    await tap(screen.getByLabelText('Dodaj ćwiczenia do szablonu „Test A”.')); await flushAll(10); expect(screen.getByLabelText('Zapisz szablon')).toBeTruthy();
    await addPlank(); await saveEdit(); await flushAll(10);
    expect(S().templates[0].items.length).toBe(1); await act(async () => { router.dismissAll(); router.navigate('/'); }); await flushAll(10);
    expect(screen.queryByText(/^Dodaj ćwiczenia do szablonu/)).toBeNull(); expect(screen.getByText('Plan z moich szablonów')).toBeTruthy();
  });
  test('kilka pustych: ostatnio zmieniany + „Puste szablony: 2” → lista Szablony; bez szablonów — „Najpierw utwórz szablon.” jak dotąd', async () => {
    await boot('/', () => { const a = store.newTemplate(); a.name = 'Test A'; store.save(a); jest.setSystemTime(NOW.getTime() + 60000); const b = store.newTemplate(); b.name = 'Test B'; store.save(b); }, { demo: false });
    expect(screen.getByText('Dodaj ćwiczenia do szablonu „Test B”.')).toBeTruthy();
    expect(screen.getByLabelText('Puste szablony: 2').props.accessibilityHint).toBe('Lista szablonów.');
    await tap(screen.getByText('Puste szablony: 2')); await flushAll(10); expect(screen.getByText('Test A')).toBeTruthy();
    await boot('/', () => {}, { demo: false }); expect(screen.getByText('Najpierw utwórz szablon.')).toBeTruthy();
  });
});
