/*
 * Generator szablonów i planu tygodnia (decyzje właściciela 08.10.2026: wariant A pełny, na wyraźne polecenie, wynik do przejrzenia; docs/24).
 * Reguły z docs/research/22 sekcja 3 (R1–R9) ze statusami: podział i liczby powtórzeń akcesoriów = konwencja; czas sesji → serie = uproszczenie.
 * Rodzaje (docs/20): logika (budżet serii, podział i dni, sprzęt miejsca, parametry wg celu, dom vs siłownia, serie tygodniowo i braki do 10,
 * pary dzień po dniu, cardio przy redukcji, determinizm, brak powtórzeń w szablonie), dane (zapis: folder, unikalne nazwy, plan obok innych,
 * aktywacja). Ekran: tests/generator-ui.test.tsx.
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { addLocation } from '@/lib/locations';
import { availability } from '@/lib/equipment';
import { generate, saveGenerated, setsBudget, splitFor, GEN_MINUTES, GEN_SESSIONS, WARMUP_MIN, SET_WORK_SEC, AVG_REST, type GenInput } from '@/lib/generator';
import { fresh } from './helpers';

const S = () => store.getState();
const ex = (id: string) => store.exById(id)!;
beforeEach(async () => { jest.useFakeTimers({ now: new Date(2026, 9, 8, 9).getTime() }); await fresh(); });
const inp = (o: Partial<GenInput> = {}): GenInput => ({ goal: 'hypertrophy', locationId: null, sessions: 3, minutes: 60, ...o });

describe('parametry', () => {
  test('stałe i budżet serii: (minuty − rozgrzewka) × 60 / (praca serii + średnia przerwa)', () => {
    expect([WARMUP_MIN, SET_WORK_SEC, AVG_REST.strength, AVG_REST.hypertrophy, AVG_REST.cut]).toEqual([10, 40, 150, 105, 105]);
    expect(GEN_MINUTES).toEqual([45, 60, 90]); expect(GEN_SESSIONS).toEqual({ strength: [2, 3, 4, 5, 6], hypertrophy: [2, 3, 4, 5, 6], cut: [3, 4, 5, 6] });
    expect([setsBudget('hypertrophy', 45), setsBudget('hypertrophy', 60), setsBudget('hypertrophy', 90), setsBudget('strength', 60)]).toEqual([14, 20, 33, 15]);
  });
  test('podział i dni (konwencja z docs/24): 2 FBW, 3 FBW A/B/A, 4 góra/dół, 5 + FBW, 6 góra/dół ×3; redukcja = sesje − 1 siłowych + cardio', () => {
    expect(splitFor('hypertrophy', 2)).toEqual({ keys: ['fbwA', 'fbwB'], days: [0, 3] });
    expect(splitFor('hypertrophy', 3)).toEqual({ keys: ['fbwA', 'fbwB', 'fbwA'], days: [0, 2, 4] });
    expect(splitFor('strength', 4)).toEqual({ keys: ['upA', 'loA', 'upB', 'loB'], days: [0, 1, 3, 4] });
    expect(splitFor('hypertrophy', 5).keys).toEqual(['upA', 'loA', 'upB', 'loB', 'fbwA']);
    expect(splitFor('hypertrophy', 6).keys).toEqual(['upA', 'loA', 'upB', 'loB', 'upA', 'loA']);
    expect(splitFor('cut', 4)).toEqual({ keys: ['fbwA', 'fbwB', 'fbwA', 'cardio'], days: [0, 2, 4, 5] });
    expect(splitFor('cut', 3)).toEqual({ keys: ['fbwA', 'fbwB', 'cardio'], days: [0, 3, 5] });
  });
});

describe('wynik', () => {
  test('siła: bój główny 3 × 4–6, przerwa 180 s; pozostałe 3 × 6–10, 120 s; liczba serii w budżecie', () => {
    const r = generate(inp({ goal: 'strength', sessions: 2 }));
    for (const tp of r.templates) {
      expect(tp.items[0]).toMatchObject({ sets: 3, repMin: 4, repMax: 6, restSec: 180 });
      tp.items.slice(1).forEach(it => expect(it).toMatchObject({ sets: 3, repMin: 6, repMax: 10, restSec: 120 }));
      expect(tp.items.reduce((a, it) => a + it.sets, 0)).toBeLessThanOrEqual(setsBudget('strength', 60));
    }
  });
  test('masa na siłowni: 3 × 8–12, przerwa 120 s wielostawowe / 90 s izolacja; w domu (bez sztangi, wyciągów, maszyn) 12–20', () => {
    const r = generate(inp()); expect(r.home).toBe(false);
    r.templates.flatMap(tp => tp.items).forEach(it => expect(it).toMatchObject({ sets: 3, repMin: 8, repMax: 12, restSec: ex(it.exerciseId).pattern === 'isolation' ? 90 : 120 }));
    const home = addLocation('home'); const h = generate(inp({ locationId: home.id })); expect(h.home).toBe(true);
    h.templates.flatMap(tp => tp.items).forEach(it => { expect(it).toMatchObject({ repMin: 12, repMax: 20 }); expect(availability(ex(it.exerciseId), home).ok).toBe(true); });
  });
  test('tylko ćwiczenia dostępne w miejscu; bez powtórzeń w szablonie; FBW B różni się od A; wynik powtarzalny', () => {
    const gym = addLocation('gym'); const r = generate(inp({ locationId: gym.id }));
    r.templates.forEach(tp => { const ids = tp.items.map(i => i.exerciseId); expect(new Set(ids).size).toBe(ids.length); ids.forEach(id => expect(availability(ex(id), gym).ok).toBe(true)); });
    const [a, b] = r.templates; expect(a.items.map(i => i.exerciseId)).not.toEqual(b.items.map(i => i.exerciseId));
    expect(generate(inp({ locationId: gym.id }))).toEqual(r);
  });
  test('serie tygodniowo (główna 1, pomocnicza 0,5) i braki do 10 (masa); siła — bez listy braków', () => {
    const r = generate(inp({ sessions: 4 }));
    const want: Record<string, number> = {};
    r.days.forEach(ti => { if (ti == null) return; r.templates[ti].items.forEach(it => { const e = ex(it.exerciseId); e.muscles.forEach(m => { want[m] = (want[m] ?? 0) + it.sets; }); e.secondaryMuscles.forEach(m => { want[m] = (want[m] ?? 0) + it.sets * 0.5; }); }); });
    expect(r.weeklySets).toEqual(want);
    for (const m of ['klatka', 'plecy', 'czworogłowe']) expect(r.weeklySets[m]).toBeGreaterThanOrEqual(10);
    expect(r.below10).toEqual(['klatka', 'plecy', 'barki', 'biceps', 'triceps', 'czworogłowe', 'dwugłowe', 'pośladki'].filter(m => (r.weeklySets[m] ?? 0) < 10));
    expect(generate(inp({ goal: 'strength' })).below10).toEqual([]);
  });
  test('5 sesji: pary dzień po dniu z tymi samymi głównymi partiami są pokazane (ostrzeżenie, nie blokada)', () => {
    const r = generate(inp({ sessions: 5 })); expect(r.backToBack.length).toBeGreaterThan(0);
    expect(generate(inp({ sessions: 3 })).backToBack).toEqual([]);
  });
  test('redukcja: sesja cardio (umiarkowane, minuty sesji jako cel czasu), minuty cardio w tygodniu', () => {
    const r = generate(inp({ goal: 'cut', sessions: 4, minutes: 45 }));
    const c = r.templates.find(tp => tp.key === 'cardio')!; expect(c.items).toHaveLength(1); expect(c.items[0]).toMatchObject({ sets: 1, targetSec: 45 * 60 });
    expect(ex(c.items[0].exerciseId).pattern).toBe('cardio'); expect(r.cardioMin).toBe(45);
    expect(generate(inp()).cardioMin).toBe(0);
  });
});

describe('zapis', () => {
  test('szablony w folderze „Wygenerowane”, nazwy bez kolizji, plan obok innych; aktywacja na życzenie', () => {
    store.newTemplate().name = 'FBW A';
    const r = generate(inp()); const { templateIds, planId } = saveGenerated(r, inp(), false);
    const tpls = templateIds.map(id => S().templates.find(x => x.id === id)!);
    expect(tpls.map(x => x.folder)).toEqual(['Wygenerowane', 'Wygenerowane']); expect(tpls.map(x => x.name)).toEqual(['FBW A (2)', 'FBW B']);
    expect(tpls[0].items[0]).toMatchObject({ exerciseId: r.templates[0].items[0].exerciseId, sets: 3, repMin: 8, repMax: 12, restSec: 120, startWeight: '', targetSec: '', groupId: null });
    const p = plan.savedPlans().find(x => x.id === planId)!; expect(p.name).toBe('Masa, 3× w tygodniu · Pełna siłownia'); /* audyt 0.10 UX-10: nazwa z miejscem (bez miejsca — pełna siłownia) */
    expect(p.days).toEqual([tpls[0].id, null, tpls[1].id, null, tpls[0].id, null, null]); expect(plan.hasPlan()).toBe(false);
    const r2 = saveGenerated(generate(inp({ goal: 'strength', sessions: 2 })), inp({ goal: 'strength', sessions: 2 }), true);
    expect(plan.planName()).toBe('Siła, 2× w tygodniu · Pełna siłownia'); expect(plan.savedPlans().some(x => x.id === r2.planId)).toBe(false);
  });
});

describe('miejsce bez sprzętu', () => {
  test('zapas z pełnej biblioteki: wielostawowe bez sprzętu (przysiad z masą ciała), bez jednostawowych spoza podstawowej; braki widoczne', async () => {
    const bw = addLocation('bodyweight'); const r = generate(inp({ locationId: bw.id }));
    const names = r.templates.flatMap(tp => tp.items.map(i => ex(i.exerciseId).name));
    expect(names).toContain('Bodyweight Squat'); expect(names).not.toContain('Handstand Push Up'); expect(names).not.toContain('Prone Manual Hamstring');
    r.templates.flatMap(tp => tp.items).forEach(i => expect(availability(ex(i.exerciseId), bw).ok).toBe(true));
    expect(r.home).toBe(true); expect(r.below10).toContain('plecy'); /* bez drążka i gum nie ma ciągnięcia — podgląd to pokazuje */
  });
});
