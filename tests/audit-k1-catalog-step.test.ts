/*
 * Audyt kontrolny 1 (przed 0.10.0), DAT2-01 [WYSOKA]: krok danych „katalog-2026-10-09” pomijał poprawki pól (partia, partie mięśni, miara,
 * asysta gumą) z researchu L1–L6 dla ćwiczeń spoza bazowych — skrypt zapisywał poprawkę po zmianie pola („dawna” = „nowa”). Użytkownik po
 * aktualizacji z 1001/1002 zostawał z polami, które research uznał za błędne, a świeża instalacja miała poprawione.
 * Dane wzorcowe: tests/fixtures/catalog-1002-fields.json — dawne wartości (katalog builda 1002, f435c8c = f79f221^) każdego pola z poprawki
 * researchu dla ćwiczenia niebazowego (wyciąg z docs/research/equipment/catalog.json w f435c8c i docs/research/25-biblioteka/L1–L6.json).
 * Strażnik sensu danych (X2-01): miara i tryb ciężaru z innym mnożnikiem — tylko bez użycia; asysta gumą — tylko gdy ćwiczenie nie ma serii z gumą
 * (inaczej dawne serie z gumą zmieniłyby znaczenie: asysta ↔ opór, rekordy).
 * Rodzaje (docs/20): dane (krok katalogu dla danych 1002, idempotencja, restart), niezmiennik (każda poprawka w kroku), regresja.
 */
import * as store from '@/lib/store';
import { seedState, LIB_FIELD_FIXES, LIB_RENAMED, uid, type State, type Exercise } from '@/lib/seed';
import { recordsFor } from '@/lib/stats';
import { fresh, saved, set } from './helpers';
import OLD from './fixtures/catalog-1002-fields.json';

type F = 'group' | 'metric' | 'loadMode' | 'bandAssistable' | 'muscles' | 'secondaryMuscles';
const old = OLD as Record<string, Partial<Record<F, unknown>>>;
const final = (n: string) => LIB_RENAMED[n] ?? n;
const SEED = new Map(seedState('pl').exercises.map(e => [e.libKey ?? e.name, e]));
const val = (e: Exercise, k: F) => (e as unknown as Record<string, unknown>)[k];
const AT = new Date(2026, 8, 1, 18).getTime();

/** Stan jak w 1002 przed krokiem: ćwiczenia biblioteki z dawnymi wartościami pól. */
function state1002(): State & { libExtraStep?: string } {
  const s = JSON.parse(JSON.stringify(seedState('pl'))) as State & { libExtraStep?: string }; s.libExtraStep = 'katalog-2026-10-05';
  for (const [n, f] of Object.entries(old)) { const e = s.exercises.find(x => x.libKey === final(n))!; for (const [k, v] of Object.entries(f)) (e as unknown as Record<string, unknown>)[k] = JSON.parse(JSON.stringify(v)); }
  /* poprawki ćwiczeń bazowych i decyzji (już w kroku): dawne wartości z kroku */
  for (const x of LIB_FIELD_FIXES) { const e = s.exercises.find(y => y.libKey === x.name); if (e && JSON.stringify(val(e, x.field)) === JSON.stringify(x.to) && !(old[x.name] && x.field in old[x.name])) (e as unknown as Record<string, unknown>)[x.field] = JSON.parse(JSON.stringify(x.from)); }
  return s;
}
const addHistory = (s: State, libKey: string, p: Record<string, unknown> = { reps: 10 }) => {
  const e = s.exercises.find(x => x.libKey === libKey)!;
  s.workouts.push({ id: uid(), ownerId: 'local', createdAt: AT, updatedAt: AT, loggedBy: 'local', sessionMode: 'solo', healthUUID: null, templateId: null, templateName: 'T', startedAt: AT, finishedAt: AT + 3600e3, note: '',
    exercises: [{ id: uid(), exerciseId: e.id, restSec: 60, repMin: null, repMax: null, groupId: null, sets: [set({ completedAt: AT, ...p })] }] } as never);
  return e.id;
};

describe('DAT2-01: krok katalogu zawiera poprawki pól ćwiczeń niebazowych', () => {
  test('wzorzec: 87 ćwiczeń, 127 pól (research L1–L6, ćwiczenia niebazowe)', () => {
    expect(Object.keys(old).length).toBe(87); expect(Object.values(old).reduce((a, f) => a + Object.keys(f).length, 0)).toBe(127);
  });
  test('każde pole z dawną wartością różną od katalogu ma poprawkę w CATALOG_STEP.fieldFixes (dawna → końcowa)', () => {
    const missing: string[] = []; let n = 0;
    for (const [nm, f] of Object.entries(old)) {
      const now = SEED.get(final(nm)); expect(now).toBeDefined();
      for (const [k, v] of Object.entries(f) as [F, unknown][]) {
        if (JSON.stringify(v) === JSON.stringify(val(now!, k))) continue; n++;
        const fx = LIB_FIELD_FIXES.find(x => x.name === final(nm) && x.field === k);
        if (!fx || JSON.stringify(fx.from) !== JSON.stringify(v) || JSON.stringify(fx.to) !== JSON.stringify(val(now!, k))) missing.push(`${nm}.${k}`);
      }
    }
    expect(n).toBeGreaterThan(100); expect(missing).toEqual([]);
  });
  test('dane 1002 bez historii → migracja: każde ćwiczenie biblioteki ma pola jak świeża instalacja; idempotentne; restart', async () => {
    await fresh(state1002());
    const diffs: string[] = [];
    for (const e of store.getState().exercises) { if (!e.lib || !e.libKey) continue; const f = SEED.get(e.libKey); if (!f) continue;
      for (const k of ['group', 'metric', 'loadMode', 'bandAssistable', 'muscles', 'secondaryMuscles'] as F[]) if (JSON.stringify(val(e, k)) !== JSON.stringify(val(f, k))) diffs.push(`${e.libKey}.${k}`); }
    expect(diffs).toEqual([]);
    await store.flush(); const m = store.migrate(JSON.parse(JSON.stringify(saved()))); expect(store.migrate(JSON.parse(JSON.stringify(m)))).toEqual(m);
  });
  test('strażnik sensu danych: z historią — miara zostaje (Clock Push-Up), asysta gumą zostaje przy seriach z gumą; partie i grupa poprawione', async () => {
    const s = state1002();
    const clock = addHistory(s, 'Clock Push-Up', { weight: 5, reps: 10 });
    const band = s.bands?.[0]?.id; expect(band).toBeTruthy();
    const wide = addHistory(s, 'Push-Up Wide', { reps: 12, bandId: band });
    const iso = addHistory(s, 'Isometric Wipers', { reps: 8 }); /* historia bez gumy — asysta gumą poprawiona */
    const board = addHistory(s, 'Board Press', { weight: 80, reps: 5 });
    await fresh(s);
    expect(store.exById(clock)!.metric).toBe('weight_reps');
    expect(store.exById(wide)!.bandAssistable).toBe(true); expect(recordsFor(store.exById(wide)!).maxRepsFree).toBe(0); /* seria z gumą dalej jako asysta — rekord bez zmian */
    expect(store.exById(iso)!.bandAssistable).toBe(SEED.get('Isometric Wipers')!.bandAssistable);
    expect(store.exById(board)!.group).toBe(SEED.get('Board Press')!.group);
  });
});
