/*
 * lib/live.ts restCue / spokenLoad / counterLabel — JEDNO składanie zapowiedzi: `text` (ekran, Live Activity, zegarki — skrót kg/lb) i `speech` (głos — pełna nazwa jednostki) (0.20, decyzje właściciela
 * 13.10.2026): ćwiczenie, ciężar, liczba powtórzeń, bez talerzy; pole puste pomijane; po ostatniej serii „nic więcej do zrobienia”.
 */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { restCue, restLabel, spokenLoad, cueLoad, spokenUnit, counterLabel } from '@/lib/live';
import { completeSet } from '@/lib/setFlow';
import { METRICS, type Exercise, type MetricType, type WSet } from '@/lib/seed';
import { LANGS, applyLang, t } from '@/lib/i18n';
import { applyUnit } from '@/lib/units';
import { ex } from './helpers';
import { world, A, sid, teardownWorld } from './watch-world';

afterEach(teardownWorld);
const blank = (p: Partial<WSet> = {}): WSet => ({ id: 'x', weight: '', reps: '', durationSec: '', distanceM: '', rpe: '', bandId: '', addKg: '', kind: 'normal', warmup: false, note: '', done: false, completedAt: null, actualRest: null, ...p });
const withMetric = (m: MetricType, base = 'Plank'): Exercise => ({ ...ex(base), metric: m, equipment: 'hantle' as Exercise['equipment'] });

describe('spokenLoad: ciężar i powtórzenia słowami', () => {
  beforeEach(async () => { await world(); });
  const FULL = blank({ weight: 80, reps: 8, durationSec: 45, distanceM: 400, addKg: '' });
  test.each([...METRICS])('metryka %s: pola, których metryka używa, w stałej kolejności ciężar, dystans, powtórzenia, czas', m => {
    const e = withMetric(m); const want: Record<MetricType, string> = {
      weight_reps: '80 kg, 8 powtórzeń', reps: '8 powtórzeń', time: '45 s', distance_time: '400 m, 45 s', weight_time: '80 kg, 45 s', weight_distance: '80 kg, 400 m',
    };
    expect(cueLoad(e, FULL)).toBe(want[m]); /* ekran i zegarek: skrót */
    expect(spokenLoad(e, FULL)).toBe(want[m].replace('80 kg', '80 kilogramów')); /* głos: pełna nazwa jednostki */
  });
  test.each([...METRICS])('metryka %s: puste pola i zera są pomijane (nie zgadujemy liczby) → pusty napis', m => {
    expect(spokenLoad(withMetric(m), blank())).toBe(''); expect(spokenLoad(withMetric(m), blank({ weight: 0, reps: 0, durationSec: 0, distanceM: 0 }))).toBe(m === 'weight_reps' || m === 'weight_time' || m === 'weight_distance' ? '0 kilogramów' : '');
  });
  test('liczba mnoga powtórzeń wg języka: 1 / 2 / 5 w pl i en; funty jak karta „teraz”', () => {
    const e = withMetric('reps');
    expect([1, 2, 5, 22].map(n => spokenLoad(e, blank({ reps: n })))).toEqual(['1 powtórzenie', '2 powtórzenia', '5 powtórzeń', '22 powtórzenia']);
    applyLang('en'); expect([1, 2].map(n => spokenLoad(e, blank({ reps: n })))).toEqual(['1 rep', '2 reps']);
    applyLang('pl'); applyUnit('lb'); expect(spokenLoad(withMetric('weight_reps'), blank({ weight: 80, reps: 8 }))).toBe('176,4 funta, 8 powtórzeń'); expect(cueLoad(withMetric('weight_reps'), blank({ weight: 80, reps: 8 }))).toBe('176,4 lb, 8 powtórzeń');
  });
  test('masa ciała: bez dociążenia „masa ciała”, z dociążeniem „+10 kg”, z asystą „-20 kg”; ćwiczenie ciężarowe bez ciężaru: tylko powtórzenia', () => {
    const bw = ex('Pull Up'); expect(spokenLoad(bw, blank({ reps: 8 }))).toBe('masa ciała, 8 powtórzeń'); expect(spokenLoad(bw, blank({ addKg: 10, reps: 8 }))).toBe('+10 kilogramów, 8 powtórzeń'); expect(cueLoad(bw, blank({ addKg: 10, reps: 8 }))).toBe('+10 kg, 8 powtórzeń');
    expect(spokenLoad(bw, blank({ addKg: -20, reps: 5 }))).toMatch(/^[-−]20 kilogramów, 5 powtórzeń$/);
    expect(spokenLoad(ex('Bench Press (sztanga)'), blank({ reps: 8 }))).toBe('8 powtórzeń');
  });
});

describe('spokenUnit: pełna, odmieniona nazwa jednostki do głosu (nie skrót kg/lb)', () => {
  beforeEach(async () => { await world(); });
  const W = (kg: number) => spokenLoad(withMetric('weight_reps'), blank({ weight: kg }));
  test('pl: liczba całkowita — 1 / 2 / 5 / 12 / 22; ułamek (CLDR: other → dopełniacz lp.)', () => {
    expect([1, 2, 5, 12, 22, 80].map(W)).toEqual(['1 kilogram', '2 kilogramy', '5 kilogramów', '12 kilogramów', '22 kilogramy', '80 kilogramów']);
    expect([62.5, 1.5, 0.5, 2.25].map(W)).toEqual(['62,5 kilograma', '1,5 kilograma', '0,5 kilograma', '2,25 kilograma']);
  });
  test('en: 1 pound, 80 pounds, 62.5 kilograms', () => {
    applyLang('en'); expect([1, 80, 62.5].map(W)).toEqual(['1 kilogram', '80 kilograms', '62.5 kilograms']);
    applyUnit('lb'); expect(spokenLoad(withMetric('weight_reps'), blank({ weight: 0.4536 }))).toBe('1 pound'); expect(spokenLoad(withMetric('weight_reps'), blank({ weight: 36.2874 }))).toBe('80 pounds');
  });
  test('fr i pt-BR: ułamek poniżej 2 → liczba pojedyncza (CLDR: one = i 0..1), od 2 w górę — mnoga', () => {
    applyLang('fr'); expect([1.5, 0.5, 2.5, 5].map(W)).toEqual(['1,5 kilogramme', '0,5 kilogramme', '2,5 kilogrammes', '5 kilogrammes']);
    applyLang('pt-BR'); expect(W(1.5)).toBe('1,5 quilograma'); expect(W(2.5)).toBe('2,5 quilogramas');
  });
  test.each(LANGS.map(l => [l]))('%s: kg i lb, liczby 1 / 2 / 5 / 22 / 62,5 — pełne słowo, nigdy skrót, a ekran dalej ze skrótem', l => {
    applyLang(l); const e = withMetric('weight_reps');
    for (const u of ['kg', 'lb'] as const) {
      applyUnit(u);
      for (const n of [1, 2, 5, 22, 62.5]) {
        const v = spokenLoad(e, blank({ weight: n * (u === 'lb' ? 0.45359237 : 1) }));
        expect(v).not.toMatch(/\b(kg|lb)\b/i); expect(v).toMatch(/^\d/); expect(v.length).toBeGreaterThan(String(n).length + 1);
        expect(cueLoad(e, blank({ weight: n * (u === 'lb' ? 0.45359237 : 1) }))).toMatch(new RegExp(`\\b${u}$`));
      }
      expect(spokenUnit(1).length).toBeGreaterThan(0);
    }
  });
  test('restCue: text (ekran, Live Activity, zegarek) ze skrótem, speech (głos) z pełną nazwą; ten sam szkielet', async () => {
    await world(); const c = restCue(A(), sid(0, 0));
    expect(c.text).toBe('Bench Press (sztanga) · seria 2, 80 kg, 8 powtórzeń'); expect(c.speech).toBe('Bench Press (sztanga) · seria 2, 80 kilogramów, 8 powtórzeń');
    expect(restCue(A(), 'nie ma')).toEqual({ text: '', speech: '', last: false });
    A().exercises.forEach(e => e.sets.forEach(x => { x.done = true; })); expect(restCue(A(), sid(2, 1))).toEqual({ text: 'nic więcej do zrobienia', speech: 'nic więcej do zrobienia', last: true });
  });
});

describe('counterLabel', () => {
  test('„seria k z n”, rozgrzewka, drop set — tekst jak na karcie „teraz”', async () => {
    const a = await world(); store.addSet(0, 'warmup'); store.addSet(0, 'drop');
    const e = A().exercises[0]; const iW = e.sets.findIndex(s => s.kind === 'warmup'); const iD = e.sets.findIndex(s => s.kind === 'drop');
    expect(counterLabel(e, iW)).toBe('rozgrzewka'); expect(counterLabel(e, iD)).toBe('seria 3 z 3 · drop set'); expect(counterLabel(e, e.sets.findIndex(s => s.kind === 'normal'))).toBe('seria 1 z 3');
    applyLang('en'); expect(counterLabel(e, iW)).toBe('warm-up'); void a;
  });
});

describe('restCue: kontrakt jednego tekstu', () => {
  test('to samo ćwiczenie: „nazwa · seria n, ciężar, powtórzenia”; inne ćwiczenie: „dalej: nazwa, …”; pole puste: sama nazwa', async () => {
    await world();
    expect(restCue(A(), sid(0, 0))).toEqual({ text: 'Bench Press (sztanga) · seria 2, 80 kg, 8 powtórzeń', speech: 'Bench Press (sztanga) · seria 2, 80 kilogramów, 8 powtórzeń', last: false });
    const a = A(); a.exercises[0].sets.forEach(s => { s.done = true; });
    expect(restCue(a, sid(0, 2))).toEqual({ text: 'dalej: Pull Up, +10 kg, 8 powtórzeń', speech: 'dalej: Pull Up, +10 kilogramów, 8 powtórzeń', last: false });
    a.exercises[2].sets[0].durationSec = ''; a.exercises[1].sets.forEach(s => { s.done = true; });
    expect(restCue(a, sid(1, 1))).toEqual({ text: 'dalej: Plank', speech: 'dalej: Plank', last: false });
  });
  test('ostatnia seria: „nic więcej do zrobienia” i last; nieznana seria: pusty tekst', async () => {
    const a = await world(); a.exercises.forEach(e => e.sets.forEach(s => { s.done = true; }));
    expect(restCue(a, sid(2, 1))).toEqual({ text: 'nic więcej do zrobienia', speech: 'nic więcej do zrobienia', last: true }); expect(restCue(a, 'nie ma')).toEqual({ text: '', speech: '', last: false });
    expect(restLabel(a, 2, 1)).toEqual({ sub: 'nic więcej do zrobienia', last: true }); expect(restLabel(a, 9, 9)).toEqual({ sub: '', last: false });
  });
  test('pominięty blok jest pomijany, jak na karcie „teraz” (LIVE-04)', async () => {
    const a = await world(); store.skipExercise(a.exercises[1].id);
    a.exercises[0].sets.forEach(s => { s.done = true; });
    expect(restCue(a, sid(0, 2)).text).toBe('dalej: Plank, 45 s');
  });
  test('superset: następny członek rundy to „nazwa · seria n” z ciężarem', async () => {
    const a = await world({ ss: true });
    expect(restCue(a, sid(0, 0)).text).toBe('Pull Up · seria 1, +10 kg, 8 powtórzeń');
    a.exercises[0].sets[0].done = true; expect(restCue(a, sid(1, 0)).text).toBe('Bench Press (sztanga) · seria 2, 80 kg, 8 powtórzeń');
  });
  test('talerzy w zapowiedzi nie ma (decyzja właściciela: każda siłownia ma inne) — także gdy miejsce opisuje talerze', async () => {
    await world(); for (const s of A().exercises[0].sets) s.weight = 102.5;
    expect(restCue(A(), sid(0, 0)).text).toBe('Bench Press (sztanga) · seria 2, 102,5 kg, 8 powtórzeń'); expect(restCue(A(), sid(0, 0)).text).not.toMatch(/stron|talerz|plate|side/i);
  });
  test('ten sam tekst: zapowiedź = podpis timera = Live Activity = migawka zegarka (jedna funkcja, wszystkie sposoby odhaczenia)', async () => {
    const a = await world(); const id = sid(0, 0);
    await completeSet(0, 0); const want = restCue(a, id).text;
    expect([timer.T.sub, timer.labels.subtitle]).toEqual([want, want]);
    expect(global.__la).toContainEqual(['start', 'Push', want, timer.T.endAt, 90, 'rest|Przerwa']);
  });
  test.each(LANGS.map(l => [l]))('35 języków (%s): zapowiedź bez nawiasów klamrowych i bez polskich liter poza pl; liczba powtórzeń w tekście', async l => {
    await world(); applyLang(l); const c = restCue(A(), sid(0, 0)).text;
    expect(c).not.toMatch(/[{}]/); expect(c).toContain('80'); expect(c).toContain('8');
    if (l !== 'pl') expect(l === 'lt' ? /[łńśźżŁŃŚŹŻ]/.test(c) : /[ąęłńśźżĄĘŁŃŚŹŻ]/.test(c)).toBe(false);
    expect(c).toContain(t('seria {n}', { n: 2 }));
  });
});
