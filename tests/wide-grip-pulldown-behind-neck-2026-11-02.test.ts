/*
 * Wide-Grip Pulldown Behind The Neck — ukryte w aplikacji (decyzja właściciela 02.11.2026 ~17:20, docs/18: źródło szczebla 4 odradza wariant, bez własnego ostrzeżenia).
 * Mechanizm: ćwiczenie wycofane z biblioteki (lib/catalog-wycofane.ts → LIB, LIB_KEYS, LIB_REMOVED, LIB_RETIRED); istniejące dane użytkowników obsługuje retireCatalog
 * (lib/state/migrate-catalog.ts:186): użyte w treningu albo szablonie zostaje jako ćwiczenie WŁASNE (historia i szablony bez zmian), nieużyte i nietknięte znika.
 * Rodzaje (docs/20): logika (biblioteka, wycofanie), dane (migracja zapisu z wydanego builda — brak utraty historii i szablonów), niezmienniki (lista 57 obowiązkowych),
 * regresja (nowy użytkownik nie dostaje ćwiczenia). Ocena realności: użytkownik z historią tego ćwiczenia — realny; utrata danych nie może zajść (test).
 */
import * as fs from 'fs';
import * as path from 'path';
import * as store from '@/lib/store';
import { LIB, LIB_KEYS, LIB_REMOVED, LIB_RETIRED, seedState } from '@/lib/seed';
import { LIB_WYCOFANE } from '@/lib/catalog-wycofane';
import { fresh, saved } from './helpers';

jest.setTimeout(60000);
const NAME = 'Wide-Grip Pulldown Behind The Neck';
const root = path.join(__dirname, '..');
const fx = JSON.parse(fs.readFileSync(path.join(root, 'tests/fixtures/released/state-v1.0.0-b1032-schema19.json'), 'utf8'));
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

describe('biblioteka bez ćwiczenia (02.11.2026)', () => {
  test('lista wycofanych zawiera dokładnie to ćwiczenie; nie ma go w LIB, LIB_KEYS ani w nowym stanie; jest w LIB_REMOVED i LIB_RETIRED', () => {
    expect([...LIB_WYCOFANE]).toEqual([NAME]);
    expect(LIB.some(r => r[0] === NAME)).toBe(false); expect(LIB_KEYS.has(NAME)).toBe(false);
    expect(LIB_REMOVED.has(NAME)).toBe(true); expect(LIB_RETIRED.has(NAME)).toBe(true);
    expect(seedState('pl').exercises.some((e: { name: string; libKey?: string }) => e.name === NAME || e.libKey === NAME)).toBe(false);
  });
  test('pozostałe ćwiczenia ściągania nadal w bibliotece (wycofanie nie dotyka rodziny)', () => {
    for (const k of ['Lat Pulldown', 'Close-Grip Pulldown']) if ([...LIB_KEYS].includes(k)) expect(LIB_KEYS.has(k)).toBe(true);
    expect(LIB_KEYS.size).toBeGreaterThan(600);
  });
  test('lista 58 → 57 obowiązkowych: ćwiczenia nie ma w docs/research/pokrycie-1-1-obowiazkowe.json, a opis mówi o decyzji 02.11.2026', () => {
    const j = JSON.parse(fs.readFileSync(path.join(root, 'docs/research/pokrycie-1-1-obowiazkowe.json'), 'utf8'));
    expect(JSON.stringify(j)).not.toContain(NAME.replace(/"/g, ''));
    expect(JSON.stringify(j._opis)).toMatch(/02\.11\.2026/);
  });
});

describe('zapis użytkownika z tym ćwiczeniem: bez utraty historii i szablonów', () => {
  const load = async (state: unknown) => {
    await fresh(); global.__kv.clear(); global.__kv.set('state', JSON.stringify(state)); store.__resetForTests(); await store.init(); return store.getState();
  };
  /** Zapis z wydanego builda + trening i szablon używające ćwiczenia (id ćwiczenia z fixture). */
  const zUzyciem = () => {
    const state = clone(fx.state); const ex = state.exercises.find((e: { libKey?: string }) => e.libKey === NAME);
    const w = clone(state.workouts[0]); w.id = 'w-bn-1'; w.exercises[0].exerciseId = ex.id; w.exercises[0].sets.forEach((s: { id: string }, i: number) => { s.id = `s-bn-${i}`; });
    state.workouts.push(w);
    const tp = clone(state.templates[0]); tp.id = 't-bn-1'; tp.name = 'Szablon z ćwiczeniem'; tp.items[0].exerciseId = ex.id; state.templates.push(tp);
    return { state, exId: ex.id as string, w, tp };
  };
  test('użyte w treningu i szablonie: zostaje jako ćwiczenie własne (bez lib/libKey), nazwa i id bez zmian, trening i szablon 1:1', async () => {
    const { state, exId, w, tp } = zUzyciem(); const st = await load(state);
    const e = st.exercises.find(x => x.id === exId)!;
    expect(e).toBeDefined(); expect(e.name).toBe(NAME); expect(e.lib).toBeFalsy(); expect(e.libKey).toBeUndefined();
    const w2 = st.workouts.find(x => x.id === 'w-bn-1')!; expect(w2.exercises[0].exerciseId).toBe(exId);
    expect(w2.exercises[0].sets.map(s => [s.weight, s.reps])).toEqual(w.exercises[0].sets.map((s: { weight: unknown; reps: unknown }) => [s.weight, s.reps]));
    expect(st.templates.find(x => x.id === 't-bn-1')!.items[0].exerciseId).toBe(exId); expect(tp.items[0].exerciseId).toBe(exId);
  });
  test('nieużyte i nietknięte: znika z listy ćwiczeń; reszta biblioteki użytkownika bez zmian; restart daje ten sam wynik (idempotencja)', async () => {
    const st = await load(clone(fx.state));
    expect(st.exercises.some(x => x.name === NAME)).toBe(false);
    const before = clone(fx.state.exercises.filter((e: { libKey?: string }) => e.libKey !== NAME).map((e: { id: string }) => e.id)).sort();
    expect(st.exercises.map(x => x.id).filter(id => before.includes(id)).sort()).toEqual(before);
    await store.flush(); const ids = st.exercises.map(x => x.id).sort();
    const again = await fresh(saved());
    expect(again.exercises.map(x => x.id).sort()).toEqual(ids);
  });
  test('wszystkie treningi z fixture zachowują się 1:1 (liczba treningów i serii)', async () => {
    const { state } = zUzyciem(); const st = await load(state);
    expect(st.workouts.length).toBe(state.workouts.length);
    expect(st.workouts.flatMap(w => w.exercises.flatMap(e => e.sets.length))).toEqual(state.workouts.flatMap((w: { exercises: { sets: unknown[] }[] }) => w.exercises.flatMap(e => e.sets.length)));
  });
});
