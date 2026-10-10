/* Zgłoszenie właściciela (build 1004, 09.10.2026; obszar b2): „nie da się zrobić planu z własnych szablonów”. Właściciel wyjaśnił, że szablon
 * usunął sam — testy potwierdzają, że szablon utworzony przez „+ Nowy” (z ćwiczeniami, zapisany), szablon w folderze i szablon z generatora
 * są do wyboru w edytorze planu (app/plan.tsx, DayRows) i na liście „Zacznij z szablonu”, także po treningu z nich i po restarcie. */
import * as store from '@/lib/store';
import * as draft from '@/lib/draft';
import { generate, saveGenerated } from '@/lib/generator';
import { fresh, saved, pressAlert } from './helpers';
import { renderApp, flushAll, screen, go, tap, type, act, saveEdit, fromHome } from './app';
import { router } from 'expo-router';

jest.setTimeout(60000);
afterEach(() => { draft.__resetObjDrafts(); });
const S = () => store.getState();
const boot = async (fn: () => void = () => {}, url?: string) => { await fresh(); fn(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url }); await flushAll(10); };
const restart = async (url = '/') => { await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url }); await flushAll(10); };
const home = async () => { await act(async () => { if (router.canDismiss()) router.dismissAll(); router.navigate('/'); }); await flushAll(10); };
/** „+ Nowy” na zakładce Szablony → (nazwa, folder) → „+ Dodaj ćwiczenie” → wybór → „Zapisz”. */
const createViaUi = async (name?: string, folder?: string) => {
  await go('/templates'); await flushAll(10); await tap(screen.getByText('+ Nowy')); await flushAll(10);
  if (name) await type(screen.getByLabelText('Nazwa'), name);
  if (folder) { await tap(screen.getByText('+ Nowy folder')); await act(async () => { pressAlert('Nazwa folderu', 'Zapisz', folder); }); await flushAll(5); }
  await tap(screen.getByText('+ Dodaj ćwiczenie')); await flushAll(10);
  await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'Plank'); await flushAll(5); await tap(screen.getAllByText('Plank')[0]); await flushAll(10);
  if (screen.queryByLabelText('Zapisz szablon') == null) { await act(async () => { router.back(); }); await flushAll(10); }
  await saveEdit(); await flushAll(10);
};
/** Odhacz wszystkie serie i zakończ trening. */
const finish = async () => { await act(async () => { S().active!.exercises[0].sets.forEach((x, i) => { x.durationSec = 30; if (!x.done) store.toggleDone(0, i); }); store.finishWorkout(); }); await flushAll(10); };
/** Edytor planu: rozwiń poniedziałek i zwróć nazwy szablonów do wyboru. */
const planChoices = async () => {
  await go('/plan'); await flushAll(10); await tap(screen.getAllByLabelText(/^poniedziałek, /)[0]); await flushAll(5);
  return screen.queryAllByLabelText(/^poniedziałek: /).map(n => String(n.props.accessibilityLabel).replace(/^poniedziałek: /, '')).filter(x => x !== '+ Nowy szablon'); /* przycisk tworzenia (09.10.2026, B), nie szablon do wyboru */
};

describe('b2 — własne szablony w planie i na liście startu', () => {
  test('„+ Nowy” z nazwą domyślną i ćwiczeniem → Zapisz → Start → Zakończ: szablon zostaje, jest w „Zacznij z szablonu” i w edytorze planu (też po restarcie)', async () => {
    await boot(undefined, '/'); expect(S().templates.length).toBe(0);
    await createViaUi(); expect(S().templates.map(x => x.name)).toEqual(['Nowy szablon']); expect(S().templates[0].items.length).toBe(1);
    await home(); expect(screen.queryByText(/Nie masz jeszcze szablonów/)).toBeNull();
    await tap(screen.getByLabelText('Start: Nowy szablon')); await flushAll(10); expect(S().active?.templateId).toBe(S().templates[0].id);
    await finish(); expect(S().templates.length).toBe(1); expect(store.finishedWorkouts()[0].templateName).toBe('Nowy szablon');
    expect(screen.queryByText(/Nie masz jeszcze szablonów/)).toBeNull(); expect(screen.getByLabelText('Start: Nowy szablon')).toBeTruthy();
    expect(await planChoices()).toEqual(['Wolne', 'Nowy szablon']);
    await restart('/'); expect(S().templates.length).toBe(1); expect(screen.queryByText(/Nie masz jeszcze szablonów/)).toBeNull();
    expect(await planChoices()).toEqual(['Wolne', 'Nowy szablon']);
  });
  test('podgląd → wstecz, start z podglądu i „Powtórz ostatni” nie usuwają szablonu o nazwie domyślnej z ćwiczeniami', async () => {
    await boot(undefined, '/'); await createViaUi(); const id = S().templates[0].id;
    await home(); await go(`/template/${id}`); await flushAll(10); await act(async () => { router.back(); }); await flushAll(10);
    await go(`/template/${id}`); await flushAll(10); await tap(screen.getByLabelText('Start: Nowy szablon')); await flushAll(10); expect(S().active?.templateId).toBe(id);
    await finish(); await home();
    await fromHome('Powtórz ostatni (Nowy szablon)'); /* układ B: arkusz „Inny trening” */ await flushAll(10); expect(S().active?.templateId).toBe(id);
    await finish(); expect(S().templates.map(x => x.id)).toEqual([id]); expect(await planChoices()).toEqual(['Wolne', 'Nowy szablon']);
  });
  test('szablon z własną nazwą w folderze — w edytorze planu (pod nazwą folderu) i na liście startu', async () => {
    await boot(undefined, '/'); await createViaUi('Nogi', 'Siła'); expect(S().templates[0]).toMatchObject({ name: 'Nogi', folder: 'Siła' });
    expect(await planChoices()).toEqual(['Wolne', 'Nogi']); expect(screen.getAllByText('Siła').length).toBeGreaterThan(0);
    await home(); expect(screen.getByLabelText('Start: Nogi')).toBeTruthy();
  });
  test('szablony z generatora — wszystkie w edytorze planu i na liście startu', async () => {
    let names: string[] = [];
    await boot(() => { const inp = { goal: 'hypertrophy' as const, locationId: null, sessions: 3, minutes: 60 }; const r = saveGenerated(generate(inp), inp, false); names = r.templateIds.map(id => S().templates.find(x => x.id === id)!.name); }, '/');
    expect(names.length).toBeGreaterThan(1); /* 3 sesje — szablony A/B rotowane w planie */
    for (const n of names) expect(screen.getByLabelText(`Start: ${n}`)).toBeTruthy();
    expect((await planChoices()).sort()).toEqual(['Wolne', ...names].sort());
  });
  test('brak szablonów: edytor planu pokazuje „Nie masz jeszcze szablonów.” i „+ Nowy szablon” (znalezisko UX b2, wariant B — 09.10.2026)', async () => {
    await boot(undefined, '/'); expect(await planChoices()).toEqual(['Wolne']); expect(screen.getByText('Nie masz jeszcze szablonów.')).toBeTruthy();
    expect(screen.getByLabelText('poniedziałek: + Nowy szablon')).toBeTruthy(); /* przypisanie po „Zapisz”: tests/plan-own-templates-ui.test.tsx */
  });
});
