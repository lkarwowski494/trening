/* Audyt zmian 0.11, część 2 (09.10.2026):
 * A11B-1 (WYSOKA) — osierocony szkic edycji (pamięć lib/draft.ts i klucz bazy „drafts”) przeżywał import kopii i reset danych: „Edytuj” po imporcie
 *   pokazywało wartości ze starego szkicu, a „Zapisz” (albo „Wróć do edycji” po restarcie) nadpisywało nimi dane z kopii. Naprawa (wariant A):
 *   store.replaceState (import i „Wyczyść wszystkie dane”) czyści wszystkie szkice — ćwiczeń i szablonów (pamięć i baza) oraz edycji historii (lib/edit.ts).
 * A11B-2 / A11B-6 — teksty generatora (cel „Ogólny”) nie mówią więcej niż źródła (docs/research/30 G6, c8, c29).
 * A11B-8 — wersja 0.11.0 i wpis „Co nowego” 0.11. */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as draft from '@/lib/draft';
import * as edit from '@/lib/edit';
import * as backup from '@/lib/backup';
import { fresh, saved, ex, addWorkout, pressAlert } from './helpers';
import { renderApp, flushAll, screen, act, go, startEdit, saveEdit, tap } from './app';
import type { Exercise, Template } from '@/lib/seed';

jest.setTimeout(120000);
const S = () => store.getState();
afterEach(async () => { try { S(); } catch { return; } await timer.stop(); await timer.stopSet(); });
const lastAlert = () => global.__alerts[global.__alerts.length - 1];
const item = (e: { id: string }) => ({ id: Math.random().toString(36).slice(2), exerciseId: e.id, sets: 3, repMin: null, repMax: null, restSec: null, startWeight: '' as const, targetSec: '' as const, groupId: null });
/** Kopia obecnego stanu z inną notatką ćwiczenia (ta sama instalacja — te same id). */
const backupWith = (id: string, notes: string) => { const b = JSON.parse(JSON.stringify(backup.buildBackup())); b.state.exercises.find((x: Exercise) => x.id === id).notes = notes; return b; };
/** Import przez prawdziwą ścieżkę (wybór pliku → importBackup). */
async function importFile(b: unknown) {
  const pick = require('expo-document-picker').getDocumentAsync as jest.Mock; pick.mockImplementationOnce(async () => ({ canceled: false, assets: [{ uri: 'file:///cache/DocumentPicker/k.json' }] }));
  (require('expo-file-system/legacy').readAsStringAsync as jest.Mock).mockImplementationOnce(async () => JSON.stringify(b));
  let ok = false; await act(async () => { ok = await backup.importBackup(); }); return ok;
}

describe('A11B-1: import kopii i reset czyszczą szkice edycji', () => {
  beforeEach(() => { draft.__resetObjDrafts(); edit.__resetDrafts(); });

  test('regresja (dowód audytu, test B): sierota po „Wróć do edycji” przy pierwszym szkicu nie nadpisuje ćwiczenia z kopii', async () => {
    jest.useFakeTimers({ now: new Date(2026, 9, 8, 9).getTime() });
    try {
      await fresh(); const id = S().exercises.find(x => x.lib)!.id;
      const tp = store.newTemplate(); tp.name = 'Mój'; store.save(tp); await store.flush();
      const dt = draft.beginObjDraft<Template>('template', tp.id)!; dt.name = 'Mój 2'; store.save(dt);
      const de = draft.beginObjDraft<Exercise>('exercise', id)!; de.notes = 'STARA notatka ze szkicu'; store.save(de);
      jest.advanceTimersByTime(400); await Promise.resolve(); await store.flush();
      const kv = new Map(global.__kv);
      draft.__resetObjDrafts(); global.__kv.clear(); kv.forEach((v, k) => global.__kv.set(k, v)); store.__resetForTests(); await store.init();
      expect(draft.restoreObjDrafts().map(x => x.kind)).toEqual(['template', 'exercise']);
      draft.commitObjDraft('template', tp.id); /* „Wróć do edycji” → „Zapisz” przy szablonie; szkic ćwiczenia zostaje bez ekranu */
      const b = JSON.parse(JSON.stringify(S())); b.exercises.find((x: Exercise) => x.id === id).notes = 'Notatka z KOPII';
      store.replaceState(b); await store.flush();
      expect(draft.objDraft('exercise', id)).toBeUndefined();
      expect(global.__kv.has(draft.DRAFTS_KEY)).toBe(false);
      const again = draft.beginObjDraft<Exercise>('exercise', id)!; expect(again.notes).toBe('Notatka z KOPII');
      draft.commitObjDraft('exercise', id); expect(store.exById(id)!.notes).toBe('Notatka z KOPII');
    } finally { jest.useRealTimers(); }
  });

  test('store.onStateReplaced: zarejestrowane czyszczenie działa przy każdym replaceState (import, reset), nie przy zwykłym zapisie', async () => {
    await fresh(); const cb = jest.fn(); store.onStateReplaced(cb);
    store.save(); expect(cb).not.toHaveBeenCalled();
    store.replaceState(JSON.parse(JSON.stringify(S()))); expect(cb).toHaveBeenCalledTimes(1);
    store.resetAll(); await store.flush(); expect(cb).toHaveBeenCalledTimes(2);
  });

  test('„Wyczyść wszystkie dane” (resetAll) czyści szkice w pamięci i w bazie', async () => {
    await fresh(); const id = ex('Back Squat').id; const d = draft.beginObjDraft<Exercise>('exercise', id)!; d.notes = 'x'; store.save(d); await store.flush();
    expect(global.__kv.has(draft.DRAFTS_KEY)).toBe(true);
    store.resetAll(); await store.flush();
    expect(draft.objDraft('exercise', id)).toBeUndefined(); expect(global.__kv.has(draft.DRAFTS_KEY)).toBe(false);
  });

  test('import czyści też szkic edycji treningu z historii (lib/edit.ts) — „Edytuj” sesji zaczyna od danych z kopii', async () => {
    await fresh(); const w = addWorkout(Date.now() - 86400000, [['Back Squat', [{ weight: 100, reps: 5 }]]]); store.save();
    const d = edit.beginEdit(w.id)!; d.w.exercises[0].sets[0].weight = 1; edit.touchDraft();
    store.replaceState(JSON.parse(JSON.stringify(S()))); await store.flush();
    expect(edit.draftOf(w.id)).toBeUndefined();
  });

  test('scenariusz: dwa szkice po zamknięciu → „Wróć do edycji” (szablon) → „Zapisz” → import kopii → ćwiczenie „Edytuj” → „Zapisz” zachowuje dane z kopii; restart bez pytania o stary szkic', async () => {
    await fresh(); const e = ex('Back Squat'); const tp = store.newTemplate(); tp.name = 'Push'; tp.items.push(item(e)); store.save(tp);
    const dt = draft.beginObjDraft<Template>('template', tp.id)!; dt.name = 'Push+'; store.save(dt);
    const de = draft.beginObjDraft<Exercise>('exercise', e.id)!; de.notes = 'STARA notatka ze szkicu'; store.save(de); await store.flush();
    const kv: Record<string, string> = {}; global.__kv.forEach((v, k) => { if (k !== 'state') kv[k] = v; }); const state = saved(); draft.__resetObjDrafts();
    await renderApp({ saved: state, kv }); await flushAll(700);
    expect(lastAlert()).toMatchObject({ title: 'Niezapisane zmiany', msg: 'Aplikacja zamknęła się w trakcie edycji szablonu „Push+”. Wrócić do edycji?' });
    await act(async () => { pressAlert('Niezapisane zmiany', 'Wróć do edycji'); }); await flushAll(20);
    await tap(screen.getByLabelText('Zapisz szablon')); await flushAll(20);
    expect(S().templates.find(x => x.id === tp.id)!.name).toBe('Push+');
    expect(draft.objDraft<Exercise>('exercise', e.id)?.notes).toBe('STARA notatka ze szkicu'); /* sierota — pytanie przy następnym starcie albo „Edytuj” */
    expect(await importFile(backupWith(e.id, 'Notatka z KOPII'))).toBe(true); await flushAll(400);
    expect(store.exById(e.id)!.notes).toBe('Notatka z KOPII'); expect(global.__kv.has(draft.DRAFTS_KEY)).toBe(false);
    await go(`/exercise/${e.id}`); await flushAll(10); await startEdit();
    expect(screen.queryByDisplayValue('STARA notatka ze szkicu')).toBeNull();
    await saveEdit(); expect(store.exById(e.id)!.notes).toBe('Notatka z KOPII');
    /* restart po imporcie: brak okna „Niezapisane zmiany” o szkicu sprzed importu */
    await act(async () => { await store.flush(); }); const n = global.__alerts.length;
    const kv2: Record<string, string> = {}; global.__kv.forEach((v, k) => { if (k !== 'state') kv2[k] = v; }); draft.__resetObjDrafts();
    await renderApp({ saved: saved(), kv: kv2 }); await flushAll(700);
    expect(global.__alerts.slice(n).filter(a => a.title === 'Niezapisane zmiany')).toHaveLength(0);
    expect(store.exById(e.id)!.notes).toBe('Notatka z KOPII');
  });
});
