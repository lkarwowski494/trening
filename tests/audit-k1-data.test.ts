/*
 * Audyt kontrolny 1 (przed 0.10.0) — dane kroku katalogu „katalog-2026-10-09”.
 * X2-01 [WYSOKA]: poprawka pola `loadMode` (Pallof Press: total ×1 → unilateral ×2) zmieniała sens zapisanych ciężarów ćwiczenia z historią
 * (objętość i rekord sumy dawnych sesji ×2). Naprawa: poprawka mnożnika objętości tylko dla ćwiczenia bez serii i pozycji szablonu (jak miara);
 * ten sam mnożnik (per_dumbbell → unilateral, ×2 = ×2) — zmiana samej etykiety, liczby bez zmian, więc stosowana zawsze.
 * Rodzaje (docs/20): dane (migracja z historią i bez, szablon, idempotencja, restart), logika (objętość, rekordy, e1RM, sesje), regresja.
 */
import * as store from '@/lib/store';
import { sessionsFor, recordsFor } from '@/lib/stats';
import { seedState, LIB_EXTRA_REV, LIB_FIELD_FIXES, loadMult, uid, type State, type LoadMode } from '@/lib/seed';
import { fresh, saved, set } from './helpers';

const AT = new Date(2026, 8, 1, 18).getTime();
/** Stan sprzed kroku katalogu 09.10 (build 1001/1002): dawne domyślne wartości poprawianych pól. */
function before(): State & { libExtraStep?: string } {
  const s = JSON.parse(JSON.stringify(seedState('pl'))) as State & { libExtraStep?: string }; s.libExtraStep = 'katalog-2026-10-05';
  for (const f of LIB_FIELD_FIXES) { const e = s.exercises.find(x => x.libKey === f.name || x.name === f.name); if (e) (e as unknown as Record<string, unknown>)[f.field] = JSON.parse(JSON.stringify(f.from)); }
  return s;
}
const withHistory = (s: State, name: string, weight = 10, reps = 10) => {
  const e = s.exercises.find(x => x.name === name)!;
  s.workouts.push({ id: uid(), ownerId: 'local', createdAt: AT, updatedAt: AT, loggedBy: 'local', sessionMode: 'solo', healthUUID: null, templateId: null, templateName: 'T', startedAt: AT, finishedAt: AT + 3600e3, note: '',
    exercises: [{ id: uid(), exerciseId: e.id, restSec: 60, repMin: null, repMax: null, groupId: null, sets: [set({ weight, reps, completedAt: AT })] }] } as never);
  return e.id;
};
const stats = (id: string) => { const ex = store.exById(id)!; const r = recordsFor(ex); return { vol: store.volume(store.getState().workouts[0]), total: r.bestTotal, e1: r.bestE1rm, sessions: sessionsFor(ex).map(x => x.volume) }; };
/** Wczytanie „bez kroku” (krok uznany za zrobiony) — liczby jak przed aktualizacją; potem właściwa aktualizacja. */
async function compare(s: State & { libExtraStep?: string }, id: string) {
  await fresh(JSON.parse(JSON.stringify({ ...s, libExtraStep: LIB_EXTRA_REV }))); const b = stats(id); const lmB = store.exById(id)!.loadMode;
  await fresh(JSON.parse(JSON.stringify(s))); const a = stats(id); const lmA = store.exById(id)!.loadMode;
  return { b, a, lmB, lmA };
}

describe('X2-01: poprawka loadMode w kroku katalogu nie zmienia sensu zapisanych ciężarów', () => {
  test('Pallof Press z historią (total → unilateral, ×1 → ×2): loadMode zostaje total; objętość, rekord sumy, e1RM i sesje bez zmian', async () => {
    const s = before(); const id = withHistory(s, 'Pallof Press');
    const { b, a, lmB, lmA } = await compare(s, id);
    expect(lmB).toBe('total'); expect(lmA).toBe('total'); expect(a).toEqual(b); expect(a.vol).toBe(100);
  });
  test('Pallof Press tylko w szablonie (ciężar startowy): też bez zmiany mnożnika', async () => {
    const s = before(); const e = s.exercises.find(x => x.name === 'Pallof Press')!;
    s.templates.push({ id: 'tp', ownerId: 'local', createdAt: AT, updatedAt: AT, name: 'P', items: [{ id: 'i1', exerciseId: e.id, sets: 3, repMin: 8, repMax: 12, restSec: 60, startWeight: 10, targetSec: '', groupId: null }] } as never);
    await fresh(JSON.parse(JSON.stringify(s))); expect(store.exById(e.id)!.loadMode).toBe('total');
  });
  test('Pallof Press bez użycia: poprawka katalogu stosowana (unilateral)', async () => {
    const s = before(); const e = s.exercises.find(x => x.name === 'Pallof Press')!;
    await fresh(JSON.parse(JSON.stringify(s))); expect(store.exById(e.id)!.loadMode).toBe('unilateral');
  });
  test('Concentration Curl / Triceps Kickback z historią (per_dumbbell → unilateral, ten sam mnożnik ×2): poprawka stosowana, liczby bez zmian', async () => {
    for (const n of ['Concentration Curl (hantle)', 'Triceps Kickback']) {
      const s = before(); const id = withHistory(s, n, 12, 10);
      const { b, a, lmA } = await compare(s, id);
      expect(lmA).toBe('unilateral'); expect(a).toEqual(b);
    }
  });
  test('niezmiennik: żadna poprawka loadMode z innym mnożnikiem nie zmienia ćwiczenia z historią; migrate idempotentne; restart bez zmian', async () => {
    const s = before(); const ids = LIB_FIELD_FIXES.filter(f => f.field === 'loadMode').map(f => withHistory(s, s.exercises.find(x => x.libKey === f.name || x.name === f.name)!.name));
    await fresh(JSON.parse(JSON.stringify(s)));
    for (const f of LIB_FIELD_FIXES.filter(x => x.field === 'loadMode')) {
      const e = store.getState().exercises.find(x => x.libKey === f.name)!; expect(ids).toContain(e.id);
      expect(loadMult(e.loadMode as LoadMode)).toBe(loadMult(f.from as LoadMode));
    }
    await store.flush(); const m = store.migrate(JSON.parse(JSON.stringify(saved()))); expect(store.migrate(JSON.parse(JSON.stringify(m)))).toEqual(m);
    const lm = store.getState().exercises.map(e => e.loadMode); await fresh(saved()); expect(store.getState().exercises.map(e => e.loadMode)).toEqual(lm);
  });
});
