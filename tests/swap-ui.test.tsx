/* E2 W1 (docs/14 pkt 3.1, 3.4, 3.8; UI z pkt 7) — przycisk „⇄ zamień”, arkusz app/swap.tsx, cel pickera swap:, linijka „zamiast”, „↺ cofnij”,
 * timery po zamianie (stoper usuniętej serii stop, przerwa trwa, nowy podpis Live Activity), angielski interfejs bez polskich tekstów (C6). */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { fresh, ex, addWorkout, pressAlert } from './helpers';
import { renderApp, flushAll, screen, go, tap, act, type } from './app';
import { userHome } from './locations-fixtures';
import { addLocation } from '@/lib/locations';

jest.setTimeout(60000);
afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
const H = Date.UTC(2026, 8, 10, 10);

/** Zapisany stan z domem właściciela (główne, hantle do 24 kg) i siłownią; trening w toku z blokami. */
async function savedWith(blocks: string[], o: { places?: boolean; locale?: 'pl' | 'en' } = {}) {
  await fresh(undefined, o.locale ?? 'pl');
  if (o.places !== false) { const s = store.getState().settings; const home = userHome([2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 24]); s.locations.push(home); s.mainLocationId = home.id; addLocation('gym', 'Siłownia'); }
  addWorkout(H, [['Bench Press (hantle)', [{ weight: 22.5, reps: 10 }]]]);
  store.startEmpty(); blocks.forEach(n => store.addExerciseToActive(ex(n))); const a = store.getState().active!; a.exercises.forEach(e => { e.sets = [store.emptySet(), store.emptySet(), store.emptySet()]; });
  await store.flush(); return JSON.parse(JSON.stringify(store.getState()));
}
const blk = (i: number) => store.getState().active!.exercises[i];

describe('W1 — ekran treningu i arkusz zamiany', () => {
  test('przycisk ukryty po odhaczeniu wszystkich serii (D3) i w bloku usuniętego ćwiczenia; „⇄” przy plakietce braku sprzętu', async () => {
    await renderApp({ saved: await savedWith(['Bench Press (sztanga)', 'Push Up']) }); await flushAll(20);
    expect(screen.getByLabelText('Zamień ćwiczenie: Bench Press (sztanga)')).toBeTruthy();
    expect(screen.getByText(/brak sprzętu w: Dom/)).toBeTruthy(); expect(screen.getByLabelText('Zamień ćwiczenie (brak sprzętu): Bench Press (sztanga)')).toBeTruthy();
    for (let si = 0; si < 3; si++) await act(async () => { blk(1).sets[si].reps = 10; store.toggleDone(1, si); }); await flushAll(5);
    expect(screen.queryByLabelText('Zamień ćwiczenie: Push Up')).toBeNull();
    await act(async () => { blk(0).exerciseId = 'gone'; store.save(store.getState().active); }); await flushAll(5);
    expect(screen.getByText(/Usunięte ćwiczenie/)).toBeTruthy(); expect(screen.queryAllByLabelText(/^Zamień ćwiczenie/)).toHaveLength(0);
  });

  test('arkusz: top-3, „już w treningu”, „Inne” z filtrami; linijka „zamiast: …”; cofnij', async () => {
    await renderApp({ saved: await savedWith(['Bench Press (sztanga)', 'Incline Bench Press (hantle)']) }); await flushAll(20);
    await tap(screen.getByLabelText('Zamień ćwiczenie: Bench Press (sztanga)')); await flushAll(20);
    expect(screen.getByText('Propozycje')).toBeTruthy();
    const props = screen.getAllByLabelText(/^Propozycja \d: /); expect(props).toHaveLength(3);
    expect(screen.getByText(/już w treningu/)).toBeTruthy(); /* Incline Bench Press (hantle) jest w treningu i jest wśród propozycji */
    expect(screen.getByLabelText('Pokaż inne ćwiczenia')).toBeTruthy();
    await tap(screen.getByLabelText(/^Propozycja \d: Bench Press \(hantle\)/)); await flushAll(20);
    expect(blk(0).exerciseId).toBe(ex('Bench Press (hantle)').id); expect(blk(0).sets.map(s => s.weight)).toEqual([22.5, 22.5, 22.5]);
    expect(screen.getByText(/zamiast: Bench Press \(sztanga\)/)).toBeTruthy();
    await tap(screen.getByLabelText('Cofnij zamianę: Bench Press (hantle)')); await flushAll(10);
    expect(blk(0).exerciseId).toBe(ex('Bench Press (sztanga)').id); expect(screen.queryByText(/zamiast:/)).toBeNull();
    /* „Inne” (decyzja 04.10.2026): filtry-etykiety partii i miejsca, zdejmowane ✕; zawsze bez bieżącego i bez innej miary */
    await tap(screen.getByLabelText('Zamień ćwiczenie: Bench Press (sztanga)')); await flushAll(20);
    await tap(screen.getByLabelText('Pokaż inne ćwiczenia')); await flushAll(5);
    expect(screen.getByLabelText('Filtr partii: klatka. Tapnij, by zdjąć.')).toBeTruthy(); expect(screen.getByLabelText('Filtr miejsca: Dom. Tapnij, by zdjąć.')).toBeTruthy();
    expect(screen.queryByText('Goblet Squat')).toBeNull(); expect(screen.getAllByText('Incline Push Up').length).toBeGreaterThan(0);
    await tap(screen.getByLabelText('Filtr partii: klatka. Tapnij, by zdjąć.')); await flushAll(5);
    const find = async (q: string) => { await type(screen.getAllByPlaceholderText('Szukaj ćwiczenia…').pop()!, q); await flushAll(5); }; /* pełna baza: lista „Inne” porcjami (SWAP_PAGE) */
    await find('Goblet Squat'); expect(screen.getByText('Goblet Squat')).toBeTruthy(); await find('Leg Press'); expect(screen.queryByText('Leg Press')).toBeNull(); /* niedostępne w Domu */
    await tap(screen.getByLabelText('Filtr miejsca: Dom. Tapnij, by zdjąć.')); await flushAll(5);
    expect(screen.getByText('Leg Press')).toBeTruthy(); await find('Plank'); expect(screen.queryByText('Plank')).toBeNull(); await find('Bench Press (sztanga)'); expect(screen.queryAllByText('Bench Press (sztanga)').length).toBe(0); /* inna miara; bieżące */
    await find('Goblet Squat'); await tap(screen.getByText('Goblet Squat')); await flushAll(20);
    expect(blk(0).exerciseId).toBe(ex('Goblet Squat').id); expect(blk(0).swappedFrom).toBe(ex('Bench Press (sztanga)').id);
  });

  test('cofnięcie z wpisanymi wartościami zamiennika pyta o potwierdzenie (C7)', async () => {
    await renderApp({ saved: await savedWith(['Bench Press (sztanga)']) }); await flushAll(20);
    await act(async () => { store.swapBlock(blk(0).id, ex('Bench Press (hantle)').id); blk(0).sets[0].weight = 20; blk(0).sets[0].edited = true; store.save(store.getState().active); }); await flushAll(5);
    await tap(screen.getByLabelText('Cofnij zamianę: Bench Press (hantle)')); expect(blk(0).exerciseId).toBe(ex('Bench Press (hantle)').id);
    await act(async () => pressAlert('Cofnąć zamianę?', 'Cofnij')); await flushAll(5); expect(blk(0).exerciseId).toBe(ex('Bench Press (sztanga)').id);
  });

  test('stoper usuwanej serii zatrzymany, przerwa trwa, timer.relabel po zamianie w przerwie', async () => {
    /* audyt 0.10 (LIVE-04): podpis przerwy = następna seria jak na karcie „teraz” — ławka przed plankiem, inaczej podpis wskazywałby nieodhaczony plank */
    await renderApp({ saved: await savedWith(['Bench Press (sztanga)', 'Plank'], { places: false }) }); await flushAll(20);
    /* przerwa po serii 1 ławki, potem stoper planka; zamiana ławki (podział) w trakcie przerwy */
    await act(async () => { blk(0).sets[0].weight = 100; blk(0).sets[0].reps = 5; }); await tap(screen.getAllByLabelText(/^Seria 1 zrobiona — Bench Press \(sztanga\)/)[0]); await flushAll(5);
    expect(timer.T.on).toBe(true); const restSet = timer.T.setId;
    expect(timer.T.sub).toMatch(/Bench Press \(sztanga\) · seria 2/);
    await tap(screen.getByLabelText('Zamień ćwiczenie: Bench Press (sztanga)')); await flushAll(20);
    await tap(screen.getByLabelText(/^Propozycja 1: /)); await flushAll(20);
    const B = blk(1); expect(B.splitFrom).toBe(blk(0).id);
    expect(timer.T.on).toBe(true); expect(timer.T.setId).toBe(restSet);
    expect(timer.T.sub).toContain(store.exById(B.exerciseId)!.name); expect((global.__la as any[]).some(x => JSON.stringify(x).includes(store.exById(B.exerciseId)!.name))).toBe(true);
    /* stoper serii czasowej w bloku, który zamieniamy w miejscu */
    await act(async () => { await timer.startSet(blk(2).sets[0].id, 30); }); expect(timer.S.on).toBe(true);
    await tap(screen.getByLabelText('Zamień ćwiczenie: Plank')); await flushAll(20);
    await tap(screen.getByLabelText(/^Propozycja 1: /)); await flushAll(20);
    expect(timer.S.on).toBe(false);
  });

  test('EN bez polskich tekstów (C6)', async () => {
    await renderApp({ saved: await savedWith(['Bench Press (sztanga)'], { locale: 'en' }), locale: 'en' }); await flushAll(20);
    await act(async () => { store.getState().settings.language = 'en'; store.applyPrefs(); store.save(); }); await flushAll(5);
    await tap(screen.getByLabelText('Swap exercise: Bench Press (Barbell)')); await flushAll(20);
    expect(screen.getByText('Suggestions')).toBeTruthy(); expect(screen.getByLabelText('Show other exercises')).toBeTruthy();
    const txt = JSON.stringify(screen.toJSON()); expect(txt).not.toMatch(/Propozycje|Pokaż inne ćwiczenia|ten sam ruch|już w treningu|zamiast/);
    await tap(screen.getByLabelText(/^Suggestion 1: /)); await flushAll(20);
    expect(JSON.stringify(screen.toJSON())).toMatch(/instead of: Bench Press \(Barbell\)/);
  });

  test('D5: sekcja „Ten sam ruch, inny przyrząd” — RDL w Domu: stacja; wybór przypina przyrząd (kolumna kg/str.)', async () => {
    await renderApp({ saved: await savedWith(['RDL (hantle/linki)']) }); await flushAll(20);
    expect(blk(0).impl).toBe('dumbbell');
    await tap(screen.getByLabelText('Zamień ćwiczenie: RDL (hantle/linki)')); await flushAll(20);
    expect(screen.getByText('Ten sam ruch, inny przyrząd')).toBeTruthy();
    await tap(screen.getByLabelText('Inny przyrząd: stacja')); await flushAll(20);
    expect(blk(0)).toMatchObject({ impl: 'electric', implPinned: true }); expect(screen.getAllByText('kg/str.').length).toBeGreaterThan(0);
    await tap(screen.getByLabelText('Zamień ćwiczenie: RDL (hantle/linki)')); await flushAll(20);
    expect(screen.getByLabelText('Inny przyrząd: hantle')).toBeTruthy(); expect(screen.queryByLabelText('Inny przyrząd: stacja')).toBeNull();
  });
  test('D5: bez miejsca — sekcji nie ma', async () => {
    await renderApp({ saved: await savedWith(['RDL (hantle/linki)'], { places: false }) }); await flushAll(20);
    await tap(screen.getByLabelText('Zamień ćwiczenie: RDL (hantle/linki)')); await flushAll(20);
    expect(screen.queryByText('Ten sam ruch, inny przyrząd')).toBeNull();
  });
});
