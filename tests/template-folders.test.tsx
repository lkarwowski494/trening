/*
 * Foldery i archiwum szablonów (docs/21 pkt 4a; kolejność zatwierdzona przez właściciela 07.10.2026 wieczór). Szablony ustawia
 * właściciel — aplikacja niczego nie przenosi ani nie archiwizuje sama (zasada 03.10.2026, 08:11). Rodzaje (docs/20): logika (store),
 * dane (sanityzacja pól folder/archived, kopia szablonu, import), ekran (lista Szablony z folderami i Archiwum, edytor: folder i
 * archiwizacja, ekran Trening bez zarchiwizowanych), dostępność (nagłówki), języki (en), niezmienniki (nic samo się nie zmienia).
 */
import * as store from '@/lib/store';
import { fresh, ex, saved, pressAlert } from './helpers';
import { renderApp, flushAll, screen, go, tap, act } from './app';

jest.setTimeout(60000);
const S = () => store.getState();
beforeEach(async () => { await fresh(); });
const mk = (name: string, folder?: string, archived?: boolean) => { const t = store.newTemplate(); t.name = name; t.items.push({ id: name + 'i', exerciseId: ex('Back Squat').id, sets: 1, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null }); if (folder) t.folder = folder; if (archived) t.archived = true; store.save(t); return t; };

describe('logika', () => {
  test('templateGroups: najpierw bez folderu, potem foldery alfabetycznie (wg języka), bez zarchiwizowanych; archivedTemplates', () => {
    mk('A'); mk('B', 'Siła'); mk('C', 'Akcesoria'); mk('D', 'Żelazo'); mk('F', 'Siła'); mk('E', 'Mobilność', true);
    expect(store.templateGroups().map(g => [g.folder, g.items.map(t => t.name)])).toEqual([[null, ['A']], ['Akcesoria', ['C']], ['Siła', ['B', 'F']], ['Żelazo', ['D']]]); /* „Ż” po „S” — kolejność wg języka, nie kodów znaków */
    expect(store.archivedTemplates().map(t => t.name)).toEqual(['E']); expect(store.templateFolders()).toEqual(['Akcesoria', 'Mobilność', 'Siła', 'Żelazo']); /* także foldery samych zarchiwizowanych — do wyboru w edytorze */
  });
  test('setTemplateFolder: przycina i skraca do 40 znaków; pusty — bez folderu; setTemplateArchived', () => {
    const t = mk('A'); store.setTemplateFolder(t, '  Plan   wiosna  '); expect(t.folder).toBe('Plan wiosna');
    store.setTemplateFolder(t, 'x'.repeat(60)); expect(t.folder).toHaveLength(40); store.setTemplateFolder(t, '   '); expect('folder' in t).toBe(false);
    store.setTemplateArchived(t, true); expect(t.archived).toBe(true); store.setTemplateArchived(t, false); expect('archived' in t).toBe(false);
  });
  test('kopia szablonu zachowuje folder, ale nie archiwum', () => {
    const t = mk('A', 'Siła', true); const c = store.dupTemplate(t.id); expect(c.folder).toBe('Siła'); expect(c.archived).toBeUndefined();
  });
});

describe('dane', () => {
  test('sanityzacja: folder tylko niepusty tekst (przycięty, ≤ 40), archived tylko true', async () => {
    const st: any = JSON.parse(JSON.stringify(saved())); const base = { ownerId: st.ownerId, createdAt: 1, updatedAt: 1, items: [] };
    st.templates = [{ ...base, id: 't1', name: 'A', folder: '  Siła  ', archived: true }, { ...base, id: 't2', name: 'B', folder: 42, archived: 'tak' }, { ...base, id: 't3', name: 'C', folder: '   ' }, { ...base, id: 't4', name: 'D', folder: 'y'.repeat(80) }];
    await renderApp({ saved: st }); await flushAll(10);
    const by = (id: string) => S().templates.find(t => t.id === id)! as any;
    expect([by('t1').folder, by('t1').archived]).toEqual(['Siła', true]); expect(['folder' in by('t2'), 'archived' in by('t2')]).toEqual([false, false]);
    expect('folder' in by('t3')).toBe(false); expect(by('t4').folder).toHaveLength(40);
  });
});

describe('ekran', () => {
  const boot = async (fn: () => void, url = '/templates') => { fn(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url }); await flushAll(10); };
  test('lista Szablony: foldery jako nagłówki, „Archiwum (n)” zwinięte — rozwinięcie pokazuje zarchiwizowane', async () => {
    await boot(() => { mk('A'); mk('B', 'Siła'); mk('E', 'Siła', true); });
    expect(screen.getByText('Siła').props.accessibilityRole).toBe('header'); expect(screen.getByText('B')).toBeTruthy(); expect(screen.queryByText('E')).toBeNull();
    const arch = screen.getByLabelText('Archiwum (1)'); expect(arch.props.accessibilityState.expanded).toBe(false);
    await tap(arch); expect(screen.getByText('E')).toBeTruthy(); expect(screen.getByLabelText('Archiwum (1)').props.accessibilityState.expanded).toBe(true);
  });
  test('ekran Trening: zarchiwizowane szablony nie są do startu; foldery jako nagłówki', async () => {
    await boot(() => { mk('A'); mk('B', 'Siła'); mk('E', 'Siła', true); }, '/');
    expect(screen.getByLabelText('Start: A')).toBeTruthy(); expect(screen.getByLabelText('Start: B')).toBeTruthy(); expect(screen.queryByLabelText('Start: E')).toBeNull();
    expect(screen.getAllByText('Siła').some(x => x.props.accessibilityRole === 'header')).toBe(true);
  });
  test('edytor: folder z listy, „+ Nowy folder” (nazwa w oknie), „bez folderu”; „Archiwizuj” i „Przywróć z archiwum”', async () => {
    let id = ''; await boot(() => { id = mk('A').id; mk('B', 'Siła'); }, '/templates'); await go(`/template/${id}`); await flushAll(10);
    await tap(screen.getByLabelText('Folder: Siła')); expect(S().templates.find(t => t.id === id)!.folder).toBe('Siła');
    await tap(screen.getByText('+ Nowy folder')); expect(global.__alerts.at(-1)).toMatchObject({ title: 'Nazwa folderu', prompt: true });
    await act(async () => { pressAlert('Nazwa folderu', 'Zapisz', '  Push  '); }); await flushAll(5); expect(S().templates.find(t => t.id === id)!.folder).toBe('Push');
    await tap(screen.getByLabelText('Folder: bez folderu')); expect('folder' in S().templates.find(t => t.id === id)!).toBe(false);
    await tap(screen.getByText('Archiwizuj')); expect(S().templates.find(t => t.id === id)!.archived).toBe(true);
    await tap(screen.getByText('Przywróć z archiwum')); expect('archived' in S().templates.find(t => t.id === id)!).toBe(false);
  });
  test('ekran Trening: same zarchiwizowane szablony — jak brak szablonów („+ Nowy szablon”)', async () => {
    await boot(() => { mk('E', 'Siła', true); }, '/');
    expect(screen.getByText('Nie masz jeszcze szablonów — utwórz pierwszy albo zacznij pusty trening.')).toBeTruthy(); expect(screen.getByText('+ Nowy szablon')).toBeTruthy();
  });
  test('English', async () => {
    await fresh(undefined, 'en'); mk('A'); mk('E', 'Strength', true); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: 'en', url: '/templates' }); await flushAll(10);
    expect(screen.getByLabelText('Archive (1)')).toBeTruthy(); await go(`/template/${S().templates[0].id}`); await flushAll(10);
    expect(screen.getByText('+ New folder')).toBeTruthy(); expect(screen.getByText('Archive')).toBeTruthy(); expect(screen.getByLabelText('Folder: no folder')).toBeTruthy();
  });
  test('niezmiennik: aplikacja sama nie zmienia folderów ani archiwum (start, zakończenie treningu, restart)', async () => {
    let id = ''; await boot(() => { id = mk('A', 'Siła').id; mk('E', 'Siła', true); }, '/');
    const snap = () => S().templates.map(t => [t.id, t.folder, t.archived]);
    const before = JSON.stringify(snap()); await tap(screen.getByLabelText('Start: A')); await flushAll(10);
    await act(async () => { const w = S().active!; Object.assign(w.exercises[0].sets[0], { weight: 100, reps: 5, done: true }); store.finishWorkout(); }); await flushAll(10);
    expect(JSON.stringify(snap())).toBe(before); void id;
  });
});
