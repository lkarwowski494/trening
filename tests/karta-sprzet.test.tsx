/*
 * Build 1004 (decyzje właściciela 07.10.2026, docs/18): na karcie „teraz” grafika sprzętu z wartości serii (talerze, stos „na X”, hantle, kettle,
 * stacja, guma, dociążenie), notatka ćwiczenia (pkt 2), przerwa w karcie z podglądem następnej serii (pkt 3), pierścień serii na czas.
 * Rodzaje (docs/20): logika (lib/equipvis.ts), ekran, dane (nic nie jest zapisywane — grafika liczona z serii), języki (en), macierz:
 * tests/matrix-karta.test.tsx (IMPLS). E2E: .maestro/11-widok-skupiony.yaml (przerwa w karcie).
 */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { addLocation, setEquip } from '@/lib/locations';
import { stackWindow, equipVisFor, equipSlotFor, bandHex, implFor } from '@/lib/equipvis';
import { fresh, ex, saved } from './helpers';
import { renderApp, tap, flushAll, screen, act } from './app';

jest.setTimeout(60000);
const S = () => store.getState();
beforeEach(async () => { await fresh(); });
afterEach(async () => { await timer.stop(); await timer.stopSet(); });
const block = (name: string, p: Partial<import('@/lib/seed').WSet> = {}) => { store.addExerciseToActive(ex(name)); const a = S().active!; const e = a.exercises[a.exercises.length - 1]; Object.assign(e.sets[0], p); return { a, e, set: e.sets[0] }; };

describe('logika (lib/equipvis.ts)', () => {
  test('stackWindow: 5 sąsiednich wartości z bolcem na wpisanej; brzegi listy; spoza listy i pusta lista → null', () => {
    const L = [5, 10, 15, 20, 25, 30, 35, 40];
    expect(stackWindow(L, 20)).toEqual([10, 15, 20, 25, 30].map(kg => ({ kg, pin: kg === 20 })));
    expect(stackWindow(L, 5)).toEqual([5, 10, 15, 20, 25].map(kg => ({ kg, pin: kg === 5 })));
    expect(stackWindow(L, 40)).toEqual([20, 25, 30, 35, 40].map(kg => ({ kg, pin: kg === 40 })));
    expect(stackWindow([10, 20], 20)).toEqual([{ kg: 10, pin: false }, { kg: 20, pin: true }]);
    expect(stackWindow(L, 22)).toBeNull(); expect(stackWindow([], 20)).toBeNull();
    expect(stackWindow(L, 20.005)?.find(x => x.pin)?.kg).toBe(20); /* tolerancja 0,01 kg jak „ciężar dostępny” */
  });
  test('bandHex: znane kolory po polsku i angielsku (wielkość liter, spacje); nieznane → null', () => {
    expect(bandHex('czerwona')).toBe('#D7263D'); expect(bandHex(' Red ')).toBe('#D7263D'); expect(bandHex('Fioletowa')).toBe('#6B3FA0');
    expect(bandHex('turkusowa mini')).toBeNull(); expect(bandHex('')).toBeNull();
  });
  test('siłownia: przyrząd bloku i grafika z wartości serii (stos, hantle, kettle jednostronnie, talerze); pusty ciężar — bez grafiki', () => {
    const g = addLocation('gym'); store.startEmpty(); S().active!.locationId = g.id;
    const st = block('Pec Deck', { weight: 45 }); expect(implFor(st.a, st.e)).toBe('machine');
    const v = equipVisFor(st.a, st.e, st.set)[0]; expect(v.kind).toBe('stack');
    const db = block('Bench Press (hantle)', { weight: 22.5 }); expect(equipVisFor(db.a, db.e, db.set)).toEqual([{ kind: 'dumbbell', n: 2, eachKg: 22.5 }]);
    const kb = block('Kettlebell Press', { weight: 16 }); expect(equipVisFor(kb.a, kb.e, kb.set)).toEqual([{ kind: 'kettlebell', n: 1, eachKg: 16 }]);
    const bb = block('Bench Press (sztanga)', { weight: 80 }); expect(equipVisFor(bb.a, bb.e, bb.set)).toEqual([{ kind: 'plates', plan: { unit: 'kg', base: 20, plates: [25, 5] } }]);
    const empty = block('Pec Deck'); expect(equipVisFor(empty.a, empty.e, empty.set)).toEqual([]);
  });
  test('stacja elektryczna: wartość „na urządzeniu”; masa ciała: dociążenie i asysta; guma: kolor, poziom, rola', () => {
    const l = addLocation('bodyweight'); setEquip(l, 'electric', true); store.startEmpty(); S().active!.locationId = l.id;
    const c = block('Cable Fly', { weight: 12 }); expect(implFor(c.a, c.e)).toBe('electric'); expect(equipVisFor(c.a, c.e, c.set)).toEqual([{ kind: 'electric', kg: 12 }]);
    const pu = block('Pull Up', { addKg: 10 }); expect(equipVisFor(pu.a, pu.e, pu.set)).toEqual([{ kind: 'bodyweight', addKg: 10 }]);
    const b = S().bands[0]; const pa = block('Pull Up', { addKg: -15, bandId: b.id });
    expect(equipVisFor(pa.a, pa.e, pa.set)).toEqual([{ kind: 'bodyweight', addKg: -15 }, { kind: 'band', color: b.color, level: b.level, role: ex('Pull Up').bandAssistable ? 'assist' : 'resist' }]);
    const bw0 = block('Pull Up'); expect(equipVisFor(bw0.a, bw0.e, bw0.set)).toEqual([]);
  });
  test('bez miejsc treningu: przyrząd z rodzaju obciążenia ćwiczenia; stos bez listy (okno null)', () => {
    store.startEmpty(); const m = block('Pec Deck', { weight: 45 }); expect(implFor(m.a, m.e)).toBe('machine');
    expect(equipVisFor(m.a, m.e, m.set)).toEqual([{ kind: 'stack', kg: 45, window: null }]);
    const bb = block('Bench Press (sztanga)', { weight: 80 }); expect(equipVisFor(bb.a, bb.e, bb.set)).toEqual([]); /* talerze tylko z opisem w miejscu */
  });
  test('equipSlotFor (decyzja A 07.10, E2E run 37611882320): miejsce na grafikę z przyrządu, niezależne od wpisanej wartości — karta nie zmienia wysokości przy wpisywaniu', () => {
    const g = addLocation('gym'); store.startEmpty(); S().active!.locationId = g.id;
    const bb = block('Back Squat'); expect(equipSlotFor(bb.a, bb.e, bb.set)).toEqual([{ kind: 'plates', plan: { unit: 'kg', base: 20, plates: [] } }]);
    bb.set.weight = 8035; expect(equipVisFor(bb.a, bb.e, bb.set)).toEqual([]); expect(equipSlotFor(bb.a, bb.e, bb.set)).toHaveLength(1); /* wartość spoza talerzy — miejsce zostaje */
    const st = block('Pec Deck'); expect(equipSlotFor(st.a, st.e, st.set)).toEqual([{ kind: 'stack', kg: 10, window: null }]); /* preset: lista stosu pusta (nieznane ciężary) */
    g.equipment.find(x => x.item === 'pec_deck')!.load = { kind: 'list', unit: 'kg', items: [5, 10, 15, 20, 25, 30, 35, 40].map(w => ({ w, on: true })) };
    const sv = equipSlotFor(st.a, st.e, st.set)[0]; expect(sv).toEqual({ kind: 'stack', kg: 15, window: [5, 10, 15, 20, 25].map(kg => ({ kg, pin: kg === 15 })) });
    const db = block('Bench Press (hantle)'); expect(equipSlotFor(db.a, db.e, db.set)).toEqual([{ kind: 'dumbbell', n: 2, eachKg: 10 }]);
    const pu = block('Pull Up'); expect(equipSlotFor(pu.a, pu.e, pu.set)).toEqual([{ kind: 'bodyweight', addKg: 10 }]);
    const pl = block('Plank'); expect(equipSlotFor(pl.a, pl.e, pl.set)).toEqual([]);
  });
  test('equipSlotFor bez miejsc: sztanga bez opisu talerzy — bez miejsca (jak equipVisFor); stos bez listy — pojedynczy pasek', () => {
    store.startEmpty(); const bb = block('Bench Press (sztanga)'); expect(equipSlotFor(bb.a, bb.e, bb.set)).toEqual([]);
    const m = block('Pec Deck'); expect(equipSlotFor(m.a, m.e, m.set)).toEqual([{ kind: 'stack', kg: 10, window: null }]);
  });
});

async function boot(setup: () => void, locale: 'pl' | 'en' = 'pl') { setup(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale }); await flushAll(10); }
describe('ekran: karta „teraz”', () => {
  test('notatka ćwiczenia na karcie (pkt 2); bez notatki — nic', async () => {
    await boot(() => { ex('Pec Deck').notes = 'siedzisko 4, oparcie 2'; store.startEmpty(); block('Pec Deck', { weight: 45, reps: 10 }); });
    expect(screen.getAllByText('siedzisko 4, oparcie 2').length).toBeGreaterThanOrEqual(1);
  });
  test('stos maszyny: podpis „stos na 45 kg” (także VoiceOver)', async () => {
    await boot(() => { store.startEmpty(); block('Pec Deck', { weight: 45, reps: 10 }); });
    expect(screen.getByLabelText('stos na 45 kg')).toBeTruthy();
  });
  test('masa ciała: asysta „asysta: 15 kg” i dociążenie „dociążenie: 10 kg”', async () => {
    await boot(() => { store.startEmpty(); block('Pull Up', { addKg: -15, reps: 6 }); store.addSet(0); const a = S().active!; a.exercises[0].sets[1].addKg = 10; });
    expect(screen.getByLabelText('asysta: 15 kg')).toBeTruthy();
    await tap(screen.getByText('Seria zrobiona')); await flushAll(10); expect(screen.getByLabelText('dociążenie: 10 kg')).toBeTruthy();
  });
  test('hantle: „hantle: 2 × 22,5 kg”', async () => {
    await boot(() => { store.startEmpty(); block('Bench Press (hantle)', { weight: 22.5, reps: 10 }); });
    expect(screen.getByLabelText('hantle: 2 × 22,5 kg')).toBeTruthy();
  });
  test('przerwa w karcie (pkt 3): po „Seria zrobiona” odliczanie i −15/+15/Pomiń w karcie (jeden zestaw na ekranie), nagłówek „dalej: …”; Pomiń kończy przerwę', async () => {
    await boot(() => { store.startEmpty(); block('Bench Press (hantle)', { weight: 22.5, reps: 10 }); store.addSet(0); });
    await tap(screen.getByText('Seria zrobiona')); await flushAll(10);
    expect(timer.T.on).toBe(true);
    expect(screen.getAllByLabelText('Skróć przerwę o 15 sekund')).toHaveLength(1);
    expect(screen.getByText('dalej: Bench Press (hantle)')).toBeTruthy();
    await tap(screen.getByText('Pomiń')); await flushAll(10);
    expect(timer.T.on).toBe(false); expect(screen.queryByText('dalej: Bench Press (hantle)')).toBeNull();
  });
  test('widok listy: przerwa w dolnym pasku jak dotąd (bez karty)', async () => {
    await boot(() => { S().settings.workoutView = 'list'; store.startEmpty(); block('Bench Press (hantle)', { weight: 22.5, reps: 10 }); store.addSet(0); });
    await tap(screen.getByLabelText('Seria 1 zrobiona — Bench Press (hantle)')); await flushAll(10);
    expect(screen.getAllByLabelText('Skróć przerwę o 15 sekund')).toHaveLength(1); expect(screen.queryByText(/^dalej: /)).toBeNull();
  });
  test('seria na czas: pierścień postępu w karcie podczas pomiaru', async () => {
    await boot(() => { store.startEmpty(); block('Plank', { durationSec: 60 }); });
    await tap(screen.getByLabelText('Start stopera serii')); await flushAll(10);
    expect(screen.getAllByRole('progressbar').some(x => /seria · (cel|bez celu)/.test(x.props.accessibilityLabel))).toBe(true);
  });
  test('regresja E2E run 37611882320: pusty ciężar — niewidoczne miejsce na talerze (VoiceOver go nie czyta); po wpisaniu — prawdziwa grafika', async () => {
    await boot(() => { const g = addLocation('gym'); store.startEmpty(); S().active!.locationId = g.id; block('Back Squat', { reps: 5 }); });
    expect(screen.queryByLabelText(/^Na każdą stronę/)).toBeNull();
    expect(screen.getByLabelText(/^Na każdą stronę/, { includeHiddenElements: true })).toBeTruthy();
    await act(async () => { S().active!.exercises[0].sets[0].weight = 80; store.save(S().active!); }); await flushAll(10);
    expect(screen.getByLabelText('Na każdą stronę: 25 + 5 kg')).toBeTruthy();
  });
  test('English: podpisy grafik po angielsku', async () => {
    await fresh(undefined, 'en');
    await boot(() => { store.startEmpty(); block('Pec Deck', { weight: 45, reps: 10 }); }, 'en');
    expect(screen.getByLabelText('stack at 45 kg')).toBeTruthy();
  });
});
