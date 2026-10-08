/* Pełna baza ćwiczeń (decyzja właściciela 04.10.2026, wieczór: „dodawaj resztę”, ~870 ćwiczeń). Listy nie renderują wszystkiego naraz:
 * wybór ćwiczenia — FlatList (wirtualizacja); arkusz zamiany „Inne” — porcje SWAP_PAGE z „Pokaż więcej”. */
import * as store from '@/lib/store';
import { SWAP_PAGE } from '@/lib/swap';
import { fresh, ex } from './helpers';
import { renderApp, flushAll, screen, go, tap, type, act } from './app';

jest.setTimeout(60000);
describe('pełna baza — listy', () => {
  test('wybór ćwiczenia: nie renderuje całej biblioteki naraz; wyszukiwanie znajduje ćwiczenie z końca listy', async () => {
    await fresh(); store.startEmpty(); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await go('/picker?target=add'); await flushAll(20);
    const n = store.getState().exercises.length; const shown = screen.getAllByText('+').length;
    expect(shown).toBeLessThan(Math.min(n, 120));
    const last = [...store.getState().exercises].sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name)).pop()!;
    await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), last.name); await flushAll(10);
    expect(screen.getAllByText(last.name).length).toBeGreaterThan(0);
  });
  test('arkusz zamiany „Inne” bez filtrów: najwyżej SWAP_PAGE wierszy, „Pokaż więcej” dokłada kolejne', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await flushAll(20);
    await tap(screen.getByLabelText('Zamień ćwiczenie: Bench Press (sztanga)')); await flushAll(20);
    await tap(screen.getByLabelText('Pokaż inne ćwiczenia')); await flushAll(5);
    await tap(screen.getByLabelText('Filtr partii: klatka')); await flushAll(5);
    const rows = () => screen.getAllByText('⇄').length;
    expect(rows()).toBeLessThanOrEqual(SWAP_PAGE + 3 /* propozycje */ + 1);
    const more = screen.getByLabelText(/^Pokaż więcej ćwiczeń: zostało \d+$/); await tap(more); await flushAll(5);
    expect(rows()).toBeGreaterThan(SWAP_PAGE + 4);
  });
});

import { swapCandidates, sortOthers } from '@/lib/swap';
import { exName } from '@/lib/i18n';
describe('pełna baza — audyt kodu 04.10 wieczór', () => {
  test('MEDIUM 1: rozciąganie (wzorzec mobility) nie jest „tym samym ruchem” dla innego rozciągania bez wspólnej partii', async () => {
    await fresh(); const c = swapCandidates(ex('Ankle Circles').id, { showAll: true, inWorkout: new Set() });
    expect(c.filter(x => !x.reasons.includes('muscle'))).toEqual([]);
  });
  test('LOW 4: lista „Inne” — dokładne trafienie nazwy na początku (przed porcją „Pokaż więcej”), reszta alfabetycznie', async () => {
    await fresh(); const all = store.getState().exercises.filter(e => /push/i.test(e.name));
    const s = sortOthers(all, 'push up'); expect(exName(s[0])).toBe('Push Up');
    const rest = s.slice(1).map(e => exName(e)); expect(rest).toEqual([...rest].sort((a, b) => a.localeCompare(b, 'pl')));
  });
  test('LOW 5: zwinięcie i ponowne rozwinięcie „Inne” wraca do pierwszej porcji', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await flushAll(20);
    await tap(screen.getByLabelText('Zamień ćwiczenie: Bench Press (sztanga)')); await flushAll(20);
    await tap(screen.getByLabelText('Pokaż inne ćwiczenia')); await flushAll(5); await tap(screen.getByLabelText('Filtr partii: klatka')); await flushAll(5);
    const first = screen.getAllByText('⇄').length; await tap(screen.getByLabelText(/^Pokaż więcej ćwiczeń/)); await flushAll(5); expect(screen.getAllByText('⇄').length).toBeGreaterThan(first);
    const wait = async () => { await act(async () => { jest.advanceTimersByTime(800); }); }; /* Item: useOnce(700) — ochrona przed podwójnym tapnięciem */
    await wait(); await tap(screen.getByLabelText('Zwiń inne ćwiczenia')); await flushAll(5); await wait(); await tap(screen.getByLabelText('Pokaż inne ćwiczenia')); await flushAll(5);
    expect(screen.getAllByText('⇄').length).toBe(first);
  });
});

/* Decyzja właściciela 05.10.2026 („1.a”): nowy sprzęt (krok b i pełna baza) dopisany jednorazowo do miejsc opartych na presecie siłowni. */
import { presetEquipment, GYM_FILL, capsOf, availability } from '@/lib/equipment';
import { seedState } from '@/lib/seed';
describe('pełna baza — nowy sprzęt w zapisanych miejscach (decyzja 1.a)', () => {
  const oldGym = () => presetEquipment('gym').filter(e => !GYM_FILL.items.includes(e.item)).map(e => ({ ...e, opts: e.opts.filter(o => !(GYM_FILL.opts[e.item] ?? []).includes(o)) }));
  const withLocs = (locs: any[]) => { const s: any = JSON.parse(JSON.stringify(seedState('pl'))); delete s.equipFill; s.settings.locations = locs; s.settings.mainLocationId = locs[0].id; return s; };
  const L = (id: string, equipment: any[]) => ({ id, ownerId: 'local', createdAt: 1, updatedAt: 1, name: id, equipment });
  test('siłownia z dawnego presetu (także z kilkoma usuniętymi pozycjami) dostaje nowy sprzęt i opaski przy wyciągach; dom — nie; raz', async () => {
    await fresh(); const gym = oldGym(); const trimmed = gym.slice(3);
    const m = store.migrate(withLocs([L('gym', gym), L('gym2', trimmed), L('home', [{ item: 'db_fixed', opts: [] }, { item: 'bench_adj', opts: [] }])]));
    const [g, g2, h] = m.settings.locations;
    for (const id of GYM_FILL.items) expect([id, g.equipment.some(e => e.item === id)]).toEqual([id, true]);
    expect(g.equipment.find(e => e.item === 'cable_cross')!.opts).toContain('ankle'); expect(g2.equipment.some(e => e.item === 'row_machine')).toBe(true);
    expect(h.equipment.map(e => e.item)).toEqual(['db_fixed', 'bench_adj']);
    expect(m.equipFill).toBe(GYM_FILL.rev);
    const caps = capsOf(g); const ex2 = m.exercises.find(e => e.name === 'Machine Row')!; expect(availability(ex2, g, caps).ok).toBe(true);
    /* raz: pozycja usunięta później przez użytkownika nie wraca */
    const again: any = JSON.parse(JSON.stringify(m)); again.settings.locations[0].equipment = again.settings.locations[0].equipment.filter((e: any) => e.item !== 'row_machine');
    expect(store.migrate(again).settings.locations[0].equipment.some(e => e.item === 'row_machine')).toBe(false);
  });
  test('ciężary i opcje istniejących pozycji bez zmian; strongman nie jest dopisywany', async () => {
    await fresh(); const gym = oldGym(); const db = gym.find(e => e.item === 'db_fixed')!; db.load = { kind: 'list', unit: 'kg', items: [{ w: 7, on: true }] } as any;
    const g = store.migrate(withLocs([L('gym', gym)])).settings.locations[0];
    expect(g.equipment.find(e => e.item === 'db_fixed')!.load).toEqual(db.load); expect(g.equipment.some(e => e.item === 'tire')).toBe(false);
  });
});

describe('sprzęt w miejscach (1.a) — audyt 05.10', () => {
  const L2 = (id: string, equipment: any[]) => ({ id, ownerId: 'local', createdAt: 1, updatedAt: 1, name: id, equipment });
  const old = () => presetEquipment('gym').filter(e => !GYM_FILL.items.includes(e.item)).map(e => ({ ...e, opts: e.opts.filter(o => !(GYM_FILL.opts[e.item] ?? []).includes(o)) }));
  test('MEDIUM: odznaczone pozycje (off) nie liczą się do „presetu siłowni” — dom z presetu z odznaczonym prawie wszystkim nie dostaje sprzętu', async () => {
    await fresh(); const eq = old().map((e, i) => (i < 40 ? { ...e, off: true } : e));
    const s: any = JSON.parse(JSON.stringify(seedState('pl'))); delete s.equipFill; s.settings.locations = [L2('dom', eq)]; s.settings.mainLocationId = 'dom';
    expect(store.migrate(s).settings.locations[0].equipment.some(e => e.item === 'row_machine')).toBe(false);
  });
  test('LOW: opaski dopisywane tylko przy zaznaczonych wyciągach', async () => {
    await fresh(); const eq = old().map(e => (e.item === 'cable_single' ? { ...e, off: true } : e));
    const s: any = JSON.parse(JSON.stringify(seedState('pl'))); delete s.equipFill; s.settings.locations = [L2('gym', eq)]; s.settings.mainLocationId = 'gym';
    const g = store.migrate(s).settings.locations[0];
    expect(g.equipment.find(e => e.item === 'cable_single')!.opts).not.toContain('ankle'); expect(g.equipment.find(e => e.item === 'cable_cross')!.opts).toContain('ankle');
  });
  test('LOW: start aplikacji zapisuje wynik jednorazowych kroków (znaczniki), nawet bez zmiany schematu', async () => {
    await fresh(); const s: any = JSON.parse(JSON.stringify(seedState('pl'))); delete s.equipFill; s.settings.locations = [L2('gym', old())]; s.settings.mainLocationId = 'gym';
    global.__kv.set('state', JSON.stringify(s)); store.__resetForTests(); await store.init(); await store.flush();
    const saved = JSON.parse(global.__kv.get('state')!); expect(saved.equipFill).toBe(GYM_FILL.rev); expect(saved.settings.locations[0].equipment.some((e: any) => e.item === 'row_machine')).toBe(true);
  });
});
