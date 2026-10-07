/*
 * Styl „Tuleja” (decyzja właściciela 07.10.2026: grafika B, „wszystko naraz”, krój mieszany, domyślnie jasny; docs/16, docs/21 pkt 3 i 6):
 * kolory talerzy IWF, talerze „co nałożyć na stronę”, widok skupiony na bieżącej serii z przełącznikiem w ustawieniach.
 * Rodzaje testów (docs/20): logika (plates, focusSet, plateSpecFor), ekran (karta „teraz”, talerze, ustawienie), dane (migracja, restart),
 * języki (en), regresja (kontrast tekstu na talerzach). Macierz wymiarów: tests/matrix-tuleja.test.tsx. E2E: .maestro/11-widok-skupiony.yaml.
 */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { addLocation } from '@/lib/locations';
import { plateSpecFor } from '@/lib/equipment';
import { PLATE_COLORS, IWF_DISC, plateColor, plateInk, plateOutlined, platesPerSide, plateList, type PlateColor } from '@/lib/plates';
import { toKg, type LoadSpec } from '@/lib/loads';
import { applyUnit } from '@/lib/units';
import { applyLang } from '@/lib/i18n';
import { fresh, ex, saved } from './helpers';
import { renderApp, tap, flushAll, screen, act, fireEvent } from './app';

jest.setTimeout(60000);
const S = () => store.getState();
const GYM: LoadSpec = { kind: 'plates', unit: 'kg', base: 20, plates: [25, 20, 15, 10, 5, 2.5, 1.25].map(w => ({ w, n: 8 })) };
beforeEach(async () => { await fresh(); });
afterEach(async () => { applyUnit('kg'); applyLang('pl'); await timer.stop(); await timer.stopSet(); });

describe('kolory talerzy IWF (lib/plates.ts)', () => {
  test('kod barw IWF pkt 3.3.3.6: 25/2,5 czerwony, 20/2 niebieski, 15/1,5 żółty, 10/1 zielony, 5/0,5 biały', () => {
    const want: [number, PlateColor][] = [[25, 'red'], [20, 'blue'], [15, 'yellow'], [10, 'green'], [5, 'white'], [2.5, 'red'], [2, 'blue'], [1.5, 'yellow'], [1, 'green'], [0.5, 'white']];
    for (const [w, c] of want) expect([w, plateColor(w, 'kg')]).toEqual([w, c]);
    expect(Object.keys(IWF_DISC)).toHaveLength(10);
  });
  test('poza kodem: 1,25 kg, talerze w funtach, wartości złe — bez koloru', () => {
    for (const [w, u] of [[1.25, 'kg'], [45, 'lb'], [25, 'lb'], [NaN, 'kg'], [0, 'kg'], [-25, 'kg']] as const) expect([w, u, plateColor(w, u)]).toEqual([w, u, null]);
  });
  test('liczba na talerzu ma kontrast ≥ 4,5 z kolorem talerza (WCAG 1.4.3) — kolor nigdy nie jest jedyną informacją', () => {
    const lum = (h: string) => { const c = h.slice(1).match(/../g)!.map(x => parseInt(x, 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
    const ratio = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
    for (const c of Object.keys(PLATE_COLORS) as PlateColor[]) expect([c, ratio(plateInk(c), PLATE_COLORS[c]) >= 4.5]).toEqual([c, true]);
    /* talerz bez obwódki odcina się od jasnego tła karty (≥ 3:1, WCAG 1.4.11); jasne talerze mają obwódkę */
    for (const c of Object.keys(PLATE_COLORS) as PlateColor[]) expect([c, plateOutlined(c) || ratio(PLATE_COLORS[c], '#ffffff') >= 3]).toEqual([c, true]);
    expect(plateOutlined(null)).toBe(true);
  });
});

describe('talerze na stronę (platesPerSide)', () => {
  test('typowe ciężary na gryfie 20 kg: najmniej talerzy', () => {
    const per = (kg: number) => platesPerSide(kg, GYM)?.plates;
    expect(per(80)).toEqual([25, 5]); expect(per(100)).toEqual([25, 15]); expect(per(60)).toEqual([20]); expect(per(140)).toEqual([25, 25, 10]);
    expect(per(22.5)).toEqual([1.25]); expect(per(20)).toEqual([]);
  });
  test('ciężaru nie da się ułożyć → null: mniej niż gryf, nieparzysta reszta, za mało talerzy, zero i złe wartości', () => {
    for (const kg of [15, 21, 0, -5, NaN, 20 + 2 * 8 / 2 * (25 + 20 + 15 + 10 + 5 + 2.5 + 1.25) + 5]) expect([kg, platesPerSide(kg, GYM)]).toEqual([kg, null]);
  });
  test('ograniczone talerze: przeszukiwanie z nawrotami (zachłanne 20 + … nie znajdzie 15 + 15)', () => {
    const spec: LoadSpec = { kind: 'plates', unit: 'kg', base: 20, plates: [{ w: 20, n: 2 }, { w: 15, n: 4 }] };
    expect(platesPerSide(80, spec)?.plates).toEqual([15, 15]); expect(platesPerSide(60, spec)?.plates).toEqual([20]); expect(platesPerSide(90, spec)?.plates).toEqual([20, 15]); expect(platesPerSide(110, spec)).toBeNull(); /* 45 na stronę: dwie 15 to za mało */
  });
  test('sztuki liczone na obie strony: nieparzysta liczba — jedna sztuka zostaje', () => {
    expect(platesPerSide(70, { kind: 'plates', unit: 'kg', base: 20, plates: [{ w: 25, n: 3 }] })?.plates).toEqual([25]);
    expect(platesPerSide(120, { kind: 'plates', unit: 'kg', base: 20, plates: [{ w: 25, n: 3 }] })).toBeNull();
  });
  test('opis w funtach: ciężar zapisany w kg (siatka lb) → talerze w lb', () => {
    const lb: LoadSpec = { kind: 'plates', unit: 'lb', base: 45, plates: [{ w: 45, n: 8 }, { w: 25, n: 4 }, { w: 10, n: 4 }, { w: 5, n: 4 }, { w: 2.5, n: 4 }] };
    for (const [tot, side] of [[225, [45, 45]], [135, [45]], [185, [45, 25]], [155, [45, 10]], [45, []]] as [number, number[]][]) expect([tot, platesPerSide(toKg(tot, 'lb'), lb)]).toEqual([tot, { unit: 'lb', base: 45, plates: side }]);
  });
  test('inny opis niż talerze (lista, stacja) albo brak opisu → null', () => {
    expect(platesPerSide(20, { kind: 'list', unit: 'kg', items: [{ w: 20, on: true }] })).toBeNull();
    expect(platesPerSide(20, { kind: 'electric', unit: 'kg', min: 1, max: 100, step: 1 })).toBeNull();
    expect(platesPerSide(80, null)).toBeNull(); expect(platesPerSide(80, undefined)).toBeNull();
  });
  test('napis: przecinek wg języka (pl „2,5”, en „2.5”)', () => {
    expect(plateList({ unit: 'kg', base: 20, plates: [25, 2.5] })).toBe('25 + 2,5');
    applyLang('en'); expect(plateList({ unit: 'kg', base: 20, plates: [25, 2.5] })).toBe('25 + 2.5');
  });
});

describe('opis talerzy przyrządu w miejscu (plateSpecFor)', () => {
  beforeEach(async () => { await fresh(); });
  test('sztanga w siłowni → opis talerzy; hantle, maszyna, masa ciała → null; bez miejsca → null', () => {
    const l = addLocation('gym');
    expect(plateSpecFor(ex('Bench Press (sztanga)'), l)?.kind).toBe('plates');
    expect(plateSpecFor(ex('Bench Press (hantle)'), l)).toBeNull();
    expect(plateSpecFor(ex('Bench Press (sztanga)'), null)).toBeNull();
    expect(plateSpecFor(ex('Pull Up'), l)).toBeNull(); expect(plateSpecFor(ex('Leg Press'), l)).toBeNull(); expect(plateSpecFor(ex('Back Squat'), l)?.kind).toBe('plates');
  });
  test('gryf bez talerzy (decyzja 06.10.2026) → null, jak „ciężary nieznane”', () => {
    const l = addLocation('gym'); const b = l.equipment.find(e => e.item === 'barbell')!; (b.load as any).plates = [];
    expect(plateSpecFor(ex('Bench Press (sztanga)'), l)).toBeNull();
  });
});

describe('seria „teraz” (store.focusSet)', () => {
  beforeEach(async () => { await fresh(); store.startEmpty(); });
  test('pierwsza nieodhaczona seria w kolejności treningu; wszystko odhaczone → null; pusty trening → null', () => {
    expect(store.focusSet(S().active)).toBeNull();
    store.addExerciseToActive(ex('Back Squat')); store.addSet(0); store.addExerciseToActive(ex('Bench Press (sztanga)'));
    expect(store.focusSet(S().active)).toEqual({ ei: 0, si: 0 });
    store.toggleDone(0, 0); expect(store.focusSet(S().active)).toEqual({ ei: 0, si: 1 });
    store.toggleDone(0, 1); expect(store.focusSet(S().active)).toEqual({ ei: 1, si: 0 });
    store.toggleDone(1, 0); expect(store.focusSet(S().active)).toBeNull();
    store.toggleDone(0, 0); expect(store.focusSet(S().active)).toEqual({ ei: 0, si: 0 }); /* cofnięcie odhaczenia wraca do tej serii */
    expect(store.focusSet(null)).toBeNull();
  });
  test('superset: naprzemiennie A1, B1, A2, B2', () => {
    store.addExerciseToActive(ex('Back Squat')); store.addSet(0); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addSet(1);
    const a = S().active!; store.linkWithNext(a.exercises, 0, a);
    const seq: string[] = []; for (let i = 0; i < 4; i++) { const p = store.focusSet(S().active)!; seq.push(`${p.ei}:${p.si}`); store.toggleDone(p.ei, p.si); }
    expect(seq).toEqual(['0:0', '1:0', '0:1', '1:1']);
  });
  test('blok usuniętego ćwiczenia jest pomijany', () => {
    store.addExerciseToActive(ex('Back Squat')); store.addExerciseToActive(ex('Bench Press (sztanga)'));
    S().active!.exercises[0].exerciseId = 'nie-ma'; expect(store.focusSet(S().active)).toEqual({ ei: 1, si: 0 });
  });
});

describe('ustawienie „Widok treningu” (dane)', () => {
  test('domyślnie skupiony — także dla starszych danych i złych wartości; „lista” zostaje po restarcie', async () => {
    await fresh(); expect(S().settings.workoutView).toBe('focus');
    const s = JSON.parse(JSON.stringify(S())); delete s.settings.workoutView; await fresh(s); expect(S().settings.workoutView).toBe('focus');
    s.settings.workoutView = 'cokolwiek'; await fresh(s); expect(S().settings.workoutView).toBe('focus');
    s.settings.workoutView = 'list'; await fresh(s); expect(S().settings.workoutView).toBe('list');
    await act(async () => { await store.flush(); }); expect(saved().settings.workoutView).toBe('list');
    const again = JSON.parse(JSON.stringify(saved())); await fresh(again); expect(store.getState().settings.workoutView).toBe('list'); /* migrate idempotentne */
  });
});

/* ---------- ekran ---------- */
async function gymWorkout(view: 'focus' | 'list' = 'focus') {
  await fresh(); addLocation('gym'); S().settings.workoutView = view; store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addSet(0);
  const a = S().active!; a.exercises[0].sets[0].weight = 80; a.exercises[0].sets[0].reps = 8; a.exercises[0].sets[1].weight = 100; a.exercises[0].sets[1].reps = 5;
  store.save(a); await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(10);
}
describe('ekran treningu: karta „teraz”', () => {
  test('ćwiczenie, numer serii, duże „80 × 8 kg”, talerze 25 + 5 na stronę; „Seria zrobiona” odhacza serię i startuje przerwę, karta przechodzi dalej', async () => {
    await gymWorkout();
    expect(screen.getByText('seria 1 z 2')).toBeTruthy();
    expect(screen.getByLabelText('Teraz: 80 × 8 kg')).toBeTruthy();
    expect(screen.getByLabelText('Na każdą stronę: 25 + 5 kg')).toBeTruthy();
    await tap(screen.getByText('Seria zrobiona')); await flushAll(10);
    expect(S().active!.exercises[0].sets[0].done).toBe(true); expect(timer.T.on).toBe(true);
    expect(screen.getByText('seria 2 z 2')).toBeTruthy(); expect(screen.getByLabelText('Na każdą stronę: 25 + 15 kg')).toBeTruthy();
    await tap(screen.getByText('Seria zrobiona')); await flushAll(10);
    expect(screen.getByText('Wszystkie serie odhaczone')).toBeTruthy();
    await tap(screen.getByText('Zakończ trening')); await flushAll(10);
    expect(global.__alerts[global.__alerts.length - 1].title).toBe('Zakończyć trening?'); /* to samo potwierdzenie co „Zakończ” */
  });
  test('przycisk karty ma własną etykietę VoiceOver (inna niż ✓ w wierszu — dwa przyciski o tej samej nazwie mylą); „↑” tylko w nagłówku ćwiczenia', async () => {
    await gymWorkout();
    expect(screen.getAllByLabelText('Seria zrobiona: Bench Press (sztanga), seria 1')).toHaveLength(1);
    expect(screen.getAllByLabelText('Seria 1 zrobiona — Bench Press (sztanga)')).toHaveLength(1); /* pole wyboru w wierszu */
  });
  test('ciężar wpisany w wierszu zmienia kartę i talerze (wartości tylko w wierszu)', async () => {
    await gymWorkout();
    await act(async () => { const a = S().active!; a.exercises[0].sets[0].weight = 60; store.save(a); }); await flushAll(10);
    await act(async () => { fireEvent(screen.getAllByLabelText('kg')[0], 'endEditing'); }); await flushAll(5);
    expect(screen.getByLabelText('Teraz: 60 × 8 kg')).toBeTruthy(); expect(screen.getByLabelText('Na każdą stronę: 20 kg')).toBeTruthy();
  });
  test('widok listy (ustawienie): bez karty; pod ćwiczeniem napis z talerzami następnej serii', async () => {
    await gymWorkout('list');
    expect(screen.queryByText('Seria zrobiona')).toBeNull();
    expect(screen.getByText('Na każdą stronę: 25 + 5 kg')).toBeTruthy();
  });
  test('English: karta i talerze po angielsku, kropka dziesiętna', async () => {
    await fresh(undefined, 'en'); addLocation('gym'); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)'));
    const a = S().active!; a.exercises[0].sets[0].weight = 45; a.exercises[0].sets[0].reps = 5; store.save(a); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: 'en' }); await flushAll(10);
    expect(screen.getByText('set 1 of 1')).toBeTruthy(); expect(screen.getByText('Set done')).toBeTruthy();
    expect(screen.getByLabelText('Each side: 10 + 2.5 kg')).toBeTruthy();
  });
});

describe('ekran Ustawień: „Widok treningu”', () => {
  test('kontrolka Skupiony / Lista z opisem; zmiana zapisuje się i zmienia ekran treningu', async () => {
    await fresh(); await renderApp({ url: '/more/settings' }); await flushAll(10);
    expect(screen.getByText('Skupiony: bieżąca seria dużymi cyframi i talerze na stronę nad listą ćwiczeń.')).toBeTruthy();
    expect(screen.getByText('Skupiony')).toBeTruthy();
    await tap(screen.getByText('Lista')); await flushAll(5);
    expect(S().settings.workoutView).toBe('list'); await act(async () => { await store.flush(); }); expect(saved().settings.workoutView).toBe('list');
    await tap(screen.getByText('Skupiony')); await flushAll(5); expect(S().settings.workoutView).toBe('focus');
  });
  test('karta pokazuje wskazówkę, gdzie zmienić wartości', async () => {
    await gymWorkout(); expect(screen.getByText('Wartości zmienisz w wierszu serii poniżej.')).toBeTruthy();
  });
});
