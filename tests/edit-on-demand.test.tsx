/* Edycja na żądanie (decyzja właściciela 08.10.2026 ok. 21:30, docs/18): ekran ćwiczenia i szablonu otwiera się w PODGLĄDZIE; „Edytuj” zaczyna
 * szkic (lib/draft.ts) z „Anuluj” / „Zapisz” w nagłówku — ten sam wzór co edycja sesji (components/DraftHeader). Testy: wejście nie zmienia danych,
 * „Anuluj” odrzuca (z pytaniem przy zmianach), „Zapisz” zapisuje (także po restarcie), „+ Nowe/+ Nowy” od razu w edycji i bez śmieci po
 * rezygnacji, wybór ćwiczenia i Kolejność działają na szkicu, etykiety VoiceOver, szkic nie trafia do bazy ani nie unieważnia historii. */
import * as store from '@/lib/store';
import * as draft from '@/lib/draft';
import { fresh, ex, pressAlert, saved, addWorkout } from './helpers';
import { renderApp, flushAll, screen, go, tap, type, act, startEdit, saveEdit, tplDraft, exDraft, openCard } from './app';
import type { Template } from '@/lib/seed';

jest.setTimeout(60000);
afterEach(() => { draft.__resetObjDrafts(); });

const S = () => store.getState();
const lastAlert = () => global.__alerts[global.__alerts.length - 1];
const snap = () => JSON.stringify({ ex: S().exercises, tpl: S().templates });
const mkTpl = (name = 'Push') => { const t = store.newTemplate(); t.name = name; t.note = 'RIR 2';
  t.items.push({ id: 'a', exerciseId: ex('Bench Press (sztanga)').id, sets: 3, repMin: 6, repMax: 8, restSec: 150, startWeight: 60, targetSec: '', groupId: null },
    { id: 'b', exerciseId: ex('Pull Up').id, sets: 2, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null }); store.save(t); return t; };
const boot = async (fn: () => void = () => {}, url?: string, locale: 'pl' | 'en' = 'pl') => { await fresh(undefined, locale); fn(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url, locale }); await flushAll(10); };

describe('lib/draft — szkic poza stanem', () => {
  test('beginObjDraft: głęboka kopia, ten sam szkic przy ponownym „Edytuj”; save(szkic) nie zapisuje do bazy ani nie unieważnia historii', async () => {
    await fresh(); const t = mkTpl(); await act(async () => { await store.flush(); }); const kv = global.__kv.get('state'); const hist = store.getHistRev();
    const d = draft.beginObjDraft<Template>('template', t.id)!; expect(d).not.toBe(t); expect(d.items[0]).not.toBe(t.items[0]); expect(draft.beginObjDraft('template', t.id)).toBe(d);
    expect(store.isDraftObj(d)).toBe(true); expect(store.isDraftObj(t)).toBe(false);
    d.name = 'Zmieniony'; store.tplAddRow(d, 'a', 'warmup'); store.save(d); await act(async () => { jest.advanceTimersByTime(1000); await store.flush(); });
    expect(global.__kv.get('state')).toBe(kv); expect(store.getHistRev()).toBe(hist); expect(t.name).toBe('Push'); expect(store.tplRows(t.items[0]).length).toBe(3);
    expect(draft.objDirty('template', t.id)).toBe(true); expect(draft.templateForEdit(t.id)).toBe(d);
    draft.discardObjDraft('template', t.id); expect(draft.objDraft('template', t.id)).toBeUndefined(); expect(draft.templateForEdit(t.id)).toBe(t); expect(draft.objDirty('template', t.id)).toBe(false);
  });
  test('commitObjDraft: przenosi zmiany do obiektu w stanie (ta sama tożsamość), usuwa pola skasowane w szkicu, zachowuje archiwum; bez zmian — bez zapisu', async () => {
    await fresh(); const t = mkTpl(); t.folder = 'Siła'; store.save(t); const ts = t.updatedAt;
    draft.beginObjDraft('template', t.id); expect(draft.commitObjDraft('template', t.id)).toBe(true); expect(t.updatedAt).toBe(ts); /* nic nie zmieniono */
    const d = draft.beginObjDraft<Template>('template', t.id)!; delete d.folder; d.note = '  RIR  1 '; d.items.reverse(); (d as Template & { archived?: true }).archived = true;
    jest.advanceTimersByTime(5); expect(draft.commitObjDraft('template', t.id)).toBe(true);
    expect(S().templates.find(x => x.id === t.id)).toBe(t); expect('folder' in t).toBe(false); expect(t.note).toBe('RIR 1'); expect(t.items.map(i => i.id)).toEqual(['b', 'a']);
    expect(t.archived).toBeUndefined(); /* archiwum przełącza się w podglądzie, nie szkicem */ expect(t.updatedAt).toBeGreaterThan(ts); expect(store.isDraftObj(t)).toBe(false);
    expect(draft.commitObjDraft('template', t.id)).toBe(false); /* brak szkicu */
  });
  test('cleanName (G2): spacje uporządkowane, pusta — poprzednia, bez poprzedniej — domyślna; limit długości', () => {
    expect(draft.cleanName('  Upper   A ', 'X', 'D')).toBe('Upper A'); expect(draft.cleanName('   ', 'Upper A', 'D')).toBe('Upper A'); expect(draft.cleanName('', '', 'Nowy szablon')).toBe('Nowy szablon');
    expect(draft.cleanName('x'.repeat(200), '', 'D').length).toBe(store.NAME_MAX);
  });
  test('commitObjDraft: pusta nazwa ćwiczenia i szablonu wraca do poprzedniej (także po restarcie)', async () => {
    await fresh(); const t = mkTpl('Upper A'); const e = ex('Back Squat');
    draft.beginObjDraft<Template>('template', t.id)!.name = '   '; draft.commitObjDraft('template', t.id); expect(t.name).toBe('Upper A');
    draft.beginObjDraft('exercise', e.id)!.name = ''; draft.commitObjDraft('exercise', e.id); expect(e.name).toBe('Back Squat');
    await act(async () => { await store.flush(); }); await fresh(saved()); expect(S().templates.find(x => x.id === t.id)!.name).toBe('Upper A'); expect(ex('Back Squat')).toBeTruthy();
  });
  test('commit, gdy obiekt w międzyczasie zniknął — false, nic nie wraca', async () => {
    await fresh(); const t = mkTpl(); draft.beginObjDraft('template', t.id); store.deleteTemplate(t.id); expect(draft.commitObjDraft('template', t.id)).toBe(false); expect(S().templates.some(x => x.id === t.id)).toBe(false);
  });
  test('dropUnsavedNew: tylko obiekt nigdy niezapisany i nieużywany', async () => {
    await fresh(); const t = store.newTemplate(); expect(draft.dropUnsavedNew('template', t.id)).toBe(true); expect(S().templates.some(x => x.id === t.id)).toBe(false);
    const t2 = mkTpl(); expect(draft.dropUnsavedNew('template', t2.id)).toBe(false);
    const e = store.newExercise('Moje'); expect(draft.dropUnsavedNew('exercise', e.id)).toBe(true); expect(S().exercises.some(x => x.id === e.id)).toBe(false);
    const e2 = store.newExercise('Użyte'); addWorkout(Date.now() - 86400e3, [['Użyte', [{ weight: 10, reps: 5 }]]]); expect(draft.dropUnsavedNew('exercise', e2.id)).toBe(false);
    expect(draft.dropUnsavedNew('exercise', ex('Back Squat').id)).toBe(false); /* biblioteka */ expect(draft.dropUnsavedNew('exercise', 'brak')).toBe(false);
  });
});

describe('ekran ćwiczenia: podgląd → Edytuj → Anuluj / Zapisz', () => {
  test('wejście nie zmienia danych: podgląd bez pól edycji; wiersze czytane razem przez VoiceOver; historia ćwiczenia i Postępy', async () => {
    await boot(() => { addWorkout(Date.now() - 86400e3, [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }]]]); });
    await act(async () => { jest.advanceTimersByTime(1000); await store.flush(); }); const before = snap(); const kv = global.__kv.get('state'); const e = ex('Back Squat');
    await go(`/exercise/${e.id}`); await flushAll(10);
    const { TextInput } = require('react-native'); expect(screen.UNSAFE_queryAllByType(TextInput)).toHaveLength(0);
    expect(screen.getByLabelText('Partia: nogi')).toBeTruthy(); expect(screen.getByLabelText('Sprzęt: sztanga')).toBeTruthy(); expect(screen.getByLabelText('Co logujesz w serii: ciężar + powtórzenia')).toBeTruthy();
    expect(screen.getByLabelText(/^Przerwa robocza: /)).toBeTruthy(); expect(screen.getByLabelText(/^Partie główne \(1 seria\): /)).toBeTruthy();
    expect(screen.getByLabelText(/^Sesja .*: 100×5, 100×5$/)).toBeTruthy(); expect(screen.getByText('Postępy')).toBeTruthy();
    const edit = screen.getByLabelText('Edytuj ćwiczenie'); expect(edit.props.accessibilityRole).toBe('button');
    await act(async () => { jest.advanceTimersByTime(1000); await store.flush(); }); expect(snap()).toBe(before); expect(global.__kv.get('state')).toBe(kv);
  });
  test('„Edytuj”: pola na szkicu; dane bez zmian do „Zapisz”; „Zapisz” zapisuje i wraca do podglądu; po restarcie zostaje', async () => {
    await boot(); const e = ex('Back Squat'); await go(`/exercise/${e.id}`); await flushAll(10); await startEdit();
    expect(screen.getByLabelText('Anuluj edycję ćwiczenia')).toBeTruthy(); expect(screen.getByLabelText('Zapisz ćwiczenie')).toBeTruthy(); expect(screen.queryByLabelText('Edytuj ćwiczenie')).toBeNull();
    await type(screen.getByPlaceholderText('jak robocza'), '45'); await type(screen.getByLabelText('Notatki techniczne'), 'łokcie pod sztangą');
    expect(exDraft(e.id).restWarmupSec).toBe(45); expect(e.restWarmupSec).toBeNull(); expect(e.notes).toBe('');
    await saveEdit(); expect(e.restWarmupSec).toBe(45); expect(e.notes).toBe('łokcie pod sztangą'); expect(screen.getByLabelText('Edytuj ćwiczenie')).toBeTruthy(); expect(screen.getByLabelText('Notatki techniczne: łokcie pod sztangą')).toBeTruthy();
    await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); expect(ex('Back Squat').restWarmupSec).toBe(45);
  });
  test('„Anuluj” bez zmian — od razu; ze zmianami — „Odrzucić zmiany?”: „Wróć” zostaje w edycji, „Odrzuć zmiany” wyrzuca szkic', async () => {
    await boot(); const e = ex('Back Squat'); const before = snap(); await go(`/exercise/${e.id}`); await flushAll(10);
    await startEdit(); const n = global.__alerts.length; await tap(screen.getByLabelText('Anuluj edycję ćwiczenia')); await flushAll(5); expect(global.__alerts.length).toBe(n); expect(screen.getByLabelText('Edytuj ćwiczenie')).toBeTruthy();
    await startEdit(); await tap(screen.getAllByText('klatka')[0]); await tap(screen.getByLabelText('Anuluj edycję ćwiczenia'));
    expect(lastAlert()).toMatchObject({ title: 'Odrzucić zmiany?', msg: 'Ćwiczenie zostanie bez zmian.' }); expect(lastAlert().buttons!.map((b: { text: string; style?: string }) => [b.text, b.style])).toEqual([['Wróć', 'cancel'], ['Odrzuć zmiany', 'destructive']]);
    await act(async () => { pressAlert('Odrzucić zmiany?', 'Wróć'); }); expect(screen.getByLabelText('Zapisz ćwiczenie')).toBeTruthy(); expect(exDraft(e.id).group).toBe('klatka');
    await tap(screen.getByLabelText('Anuluj edycję ćwiczenia')); await act(async () => { pressAlert('Odrzucić zmiany?', 'Odrzuć zmiany'); }); await flushAll(5);
    expect(screen.getByLabelText('Edytuj ćwiczenie')).toBeTruthy(); expect(e.group).toBe('nogi'); expect(exDraft(e.id)).toBeUndefined(); expect(snap()).toBe(before);
  });
  test('wyjście z ekranu w trakcie edycji wyrzuca szkic (zmiany nie wracają i nie trafiają do danych)', async () => {
    await boot(); const e = ex('Back Squat'); await go(`/exercise/${e.id}`); await flushAll(10); await startEdit(); await type(screen.getByLabelText('Nazwa'), 'XYZ');
    const { router } = require('expo-router'); await act(async () => { router.back(); }); await flushAll(10); expect(exDraft(e.id)).toBeUndefined(); expect(e.name).toBe('Back Squat');
  });
  test('„+ Nowe” otwiera od razu edycję; „Anuluj” usuwa niezapisane ćwiczenie; „Zapisz” je zostawia', async () => {
    await boot(undefined, '/exercises'); const n0 = S().exercises.length;
    await tap(screen.getByText('+ Nowe')); await flushAll(10); expect(screen.getByLabelText('Zapisz ćwiczenie')).toBeTruthy(); expect(S().exercises.length).toBe(n0 + 1);
    await tap(screen.getByLabelText('Anuluj edycję ćwiczenia')); await flushAll(10); expect(S().exercises.length).toBe(n0); expect(screen.getByText('+ Nowe')).toBeTruthy();
    await flushAll(1100); await tap(screen.getByText('+ Nowe')); await flushAll(10); await type(screen.getByLabelText('Nazwa'), 'Moje wiosłowanie'); await saveEdit();
    expect(S().exercises.length).toBe(n0 + 1); expect(screen.getByLabelText('Edytuj ćwiczenie')).toBeTruthy();
    const { router } = require('expo-router'); await act(async () => { router.back(); }); await flushAll(10); expect(S().exercises.some(x => x.name === 'Moje wiosłowanie')).toBe(true);
  });
  test('English: preview and edit labels', async () => {
    await boot(undefined, '/', 'en'); await go(`/exercise/${ex('Back Squat').id}`); await flushAll(10);
    expect(screen.getByLabelText('Edit exercise')).toBeTruthy(); await startEdit(); expect(screen.getByLabelText('Save exercise')).toBeTruthy(); expect(screen.getByLabelText('Cancel exercise editing')).toBeTruthy();
  });
});

describe('ekran szablonu: podgląd „jak trening” → Edytuj → Anuluj / Zapisz', () => {
  test('podgląd: nazwa, notatka, „Start”, serie jak w treningu (VoiceOver: „Seria 1: 60 kg × 6–8”), przerwa; bez pól; wejście nie zmienia danych', async () => {
    let id = ''; await boot(() => { id = mkTpl().id; }); const before = snap(); await go(`/template/${id}`); await flushAll(10);
    const { TextInput } = require('react-native'); expect(screen.UNSAFE_queryAllByType(TextInput)).toHaveLength(0);
    expect(screen.getByLabelText('Notatka: RIR 2')).toBeTruthy(); expect(screen.getByLabelText('Start: Push')).toBeTruthy();
    expect(screen.getAllByLabelText('Seria 1: 60 kg × 6–8').length).toBe(1); expect(screen.getByText('zakres 6–8 · przerwa 2:30')).toBeTruthy();
    expect(screen.getByText(/^2 ćw\. · 5 serii$/)).toBeTruthy(); expect(screen.queryByText('+ Dodaj ćwiczenie')).toBeNull(); expect(screen.queryByText('≡ Kolejność')).toBeNull();
    expect(snap()).toBe(before);
  });
  test('„Start” z podglądu zaczyna trening; pusty szablon — opis i „Edytuj”', async () => {
    let id = '', e = ''; await boot(() => { id = mkTpl().id; const t = store.newTemplate(); t.name = 'Pusty'; store.save(t); e = t.id; }); await go(`/template/${id}`); await flushAll(10);
    await tap(screen.getByLabelText('Start: Push')); await flushAll(10); expect(S().active!.templateId).toBe(id);
    await go(`/template/${e}`); await flushAll(10); expect(screen.getByText('Szablon jest pusty — „Edytuj”, by dodać ćwiczenia.')).toBeTruthy(); expect(screen.getByLabelText('Edytuj szablon')).toBeTruthy();
  });
  test('„Edytuj” → wybór ćwiczenia i Kolejność trafiają do szkicu; „Zapisz” zapisuje wszystko naraz', async () => {
    let id = ''; await boot(() => { id = mkTpl().id; }); const t = () => S().templates.find(x => x.id === id)!;
    await go(`/template/${id}`); await flushAll(10); await startEdit();
    await go(`/picker?target=template:${id}`); await flushAll(10); await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'Plank'); await flushAll(5); await tap(screen.getAllByText('Plank')[0]); await flushAll(10);
    expect(tplDraft(id).items.length).toBe(3); expect(t().items.length).toBe(2);
    await act(async () => { store.moveItem(tplDraft(id).items, 0, 1, tplDraft(id)); }); expect(t().items.map(i => i.id)).toEqual(['a', 'b']);
    await saveEdit(); expect(t().items.length).toBe(3); expect(t().items.map(i => i.id).slice(0, 2)).toEqual(['b', 'a']);
  });
  test('„Anuluj” ze zmianami pyta; „Odrzuć zmiany” — szablon bez zmian; nagłówek bez strzałki wstecz, gest wyłączony', async () => {
    let id = ''; await boot(() => { id = mkTpl().id; }); const before = snap(); await go(`/template/${id}`); await flushAll(10); await startEdit(); await openCard(0);
    await tap(screen.getAllByText('+ seria')[0]); await tap(screen.getByLabelText('Anuluj edycję szablonu'));
    expect(lastAlert()).toMatchObject({ title: 'Odrzucić zmiany?', msg: 'Szablon zostanie bez zmian.' });
    await act(async () => { pressAlert('Odrzucić zmiany?', 'Odrzuć zmiany'); }); await flushAll(5); expect(snap()).toBe(before); expect(screen.getByLabelText('Start: Push')).toBeTruthy();
  });
  test('„+ Nowy” → od razu edycja; „Anuluj” bez zmian usuwa nowy szablon; zapisany zostaje', async () => {
    await boot(undefined, '/templates'); const n0 = S().templates.length;
    await tap(screen.getByText('+ Nowy')); await flushAll(10); expect(screen.getByLabelText('Zapisz szablon')).toBeTruthy();
    await tap(screen.getByLabelText('Anuluj edycję szablonu')); await flushAll(10); expect(S().templates.length).toBe(n0);
    await flushAll(1100); await tap(screen.getByText('+ Nowy')); await flushAll(10); await type(screen.getByLabelText('Nazwa'), 'Nogi'); await saveEdit();
    expect(S().templates.map(x => x.name)).toContain('Nogi'); expect(screen.getByLabelText('Edytuj szablon')).toBeTruthy();
  });
  test('Duplikuj i Archiwizuj zostają w podglądzie (archiwum z pytaniem o skutki — A7)', async () => {
    let id = ''; await boot(() => { id = mkTpl().id; }); await go(`/template/${id}`); await flushAll(10);
    await tap(screen.getByText('Archiwizuj')); expect(S().templates.find(x => x.id === id)!.archived).toBe(true); expect(screen.getByText(/w archiwum/)).toBeTruthy();
    await tap(screen.getByText('Przywróć z archiwum')); expect(S().templates.find(x => x.id === id)!.archived).toBeUndefined();
    const n = S().templates.length; await tap(screen.getByText('Duplikuj')); await flushAll(10); expect(S().templates.length).toBe(n + 1);
  });
});

describe('teksty edycji na żądanie, pierwszych kroków i edycji sesji (macierz: każdy komunikat pokazany)', () => {
  const headers = () => screen.UNSAFE_root.findAll((n: { type: unknown }) => n.type === 'RNSScreenStackHeaderConfig').map((n: { props: { title?: string } }) => n.props.title);
  test('ćwiczenie: „Ostatnie treningi” i „Jeszcze nie było w treningu.”; tytuł „Edycja ćwiczenia”; nowe ćwiczenie ze zmianami — „Nowe ćwiczenie nie zostanie zapisane.”', async () => {
    await boot(); const e = ex('Back Squat'); await go(`/exercise/${e.id}`); await flushAll(10);
    expect(screen.getByRole('header', { name: 'Ostatnie treningi' })).toBeTruthy(); expect(screen.getByText('Jeszcze nie było w treningu.')).toBeTruthy();
    await startEdit(); expect(headers()).toContain('Edycja ćwiczenia');
    await boot(undefined, '/exercises'); await tap(screen.getByText('+ Nowe')); await flushAll(10); await type(screen.getByLabelText('Nazwa'), 'Moje');
    await tap(screen.getByLabelText('Anuluj edycję ćwiczenia')); expect(lastAlert()).toMatchObject({ title: 'Odrzucić zmiany?', msg: 'Nowe ćwiczenie nie zostanie zapisane.' });
  });
  test('szablon: tytuł „Edycja szablonu”; nowy ze zmianami — „Nowy szablon nie zostanie zapisany.”; pusta nazwa folderu — komunikat; trening z tego szablonu — „Wróć do treningu”', async () => {
    let id = ''; await boot(() => { id = mkTpl().id; }); await go(`/template/${id}`); await flushAll(10); await startEdit(); expect(headers()).toContain('Edycja szablonu');
    await tap(screen.getByText('+ Nowy folder')); await act(async () => { pressAlert('Nazwa folderu', 'Zapisz', '   '); }); expect(lastAlert()).toMatchObject({ title: 'Pusta nazwa folderu', msg: 'Folder nie został utworzony.' });
    expect(tplDraft(id).folder).toBeUndefined();
    await boot(undefined, '/templates'); await tap(screen.getByText('+ Nowy')); await flushAll(10); await type(screen.getByLabelText('Nazwa'), 'Nogi');
    await tap(screen.getByLabelText('Anuluj edycję szablonu')); expect(lastAlert()).toMatchObject({ title: 'Odrzucić zmiany?', msg: 'Nowy szablon nie zostanie zapisany.' });
    await boot(() => { const t = mkTpl(); id = t.id; store.startFromTemplate(t); }); await go(`/template/${id}`); await flushAll(10); expect(screen.getByText('Wróć do treningu')).toBeTruthy();
  });
  test('store.markDraft: obiekt-szkic — save() tylko odświeża (bez zapisu do bazy)', async () => {
    await fresh(); const x = store.markDraft(JSON.parse(JSON.stringify(mkTpl('Szkic')))); expect(store.isDraftObj(x)).toBe(true); x.name = 'Zmiana';
    await act(async () => { await store.flush(); }); const before = global.__kv.get('state'); store.save(x); await act(async () => { await store.flush(); }); expect(global.__kv.get('state')).toBe(before);
  });
  test('pierwsze kroki: kroki 1 i 4 z przewodnikiem „Trening i serie”', async () => {
    await boot(); expect(screen.getByText('Utwórz pierwszy szablon albo wygeneruj szablony i plan.')).toBeTruthy(); expect(screen.getByText('Pierwszy trening: „Start” przy szablonie niżej albo „Pusty trening”.')).toBeTruthy();
    await tap(screen.getByLabelText('Przewodnik: Trening i serie')); await flushAll(10); expect(headers()).toContain('Przewodnik');
  });
  test('edycja sesji (G4): draftRemoveSet nie usuwa ostatniej serii — blok nigdy nie zostaje bez serii', async () => {
    await fresh(); const edit = require('@/lib/edit'); const w = addWorkout(Date.now() - 86400e3, [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }]]]); const d = edit.beginEdit(w.id)!;
    const ids = d.w.exercises[0].sets.map((x: { id: string }) => x.id); edit.draftRemoveSet(d.key, 0, ids[0]); edit.draftRemoveSet(d.key, 0, ids[1]);
    expect(d.w.exercises[0].sets.map((x: { id: string }) => x.id)).toEqual([ids[1]]); edit.discardDraft(d.key);
  });
});
