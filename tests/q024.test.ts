/* Q-024 (decyzja właściciela 04.10.2026: „×2 dla dwóch linek”; odłożona do pełnego katalogu — katalog z liczbą linek gotowy 04.10 wieczorem).
 * Blok na stacji (impl 'electric') przy ćwiczeniu biblioteki na dwie linki (CABLES 2): ciężar wpisany na stronę → objętość ×2.
 * Siłownia (wyciąg), hantle, ćwiczenia na jedną linkę i ćwiczenia własne — bez zmian; „na hantel” (RDL) już ×2 — nie ×4. */
import * as store from '@/lib/store';
import * as stats from '@/lib/stats';
import { fresh, ex, addWorkout } from './helpers';
import type { Impl } from '@/lib/seed';

const H = Date.UTC(2026, 8, 10, 10);
const one = (name: string, impl: Impl | undefined, weight: number, reps = 10, at = H) => { const w = addWorkout(at, [[name, [{ weight, reps }]]]); if (impl) w.exercises[0].impl = impl; store.save(); return w; };

describe('Q-024 — objętość na stacji przy dwóch linkach', () => {
  test('dwie linki na stacji ×2; ten sam blok na wyciągu siłowni ×1; „na hantel” bez ×4; jedna linka bez zmian', async () => {
    await fresh();
    expect(store.volume(one('Przysiad z pasem (linki)', 'electric', 30))).toBe(600);
    expect(store.volume(one('Przysiad z pasem (linki)', 'cable', 30))).toBe(300);
    expect(store.volume(one('Przysiad z pasem (linki)', undefined, 30))).toBe(300); /* bez przyrządu (sesje sprzed 8c) — jak dotąd */
    expect(store.volume(one('RDL (hantle/linki)', 'electric', 20))).toBe(400);
    expect(store.volume(one('RDL (hantle/linki)', 'dumbbell', 20))).toBe(400);
    expect(store.volume(one('Wiosłowanie na linkach (siedząc)', 'electric', 25))).toBe(500);
    expect(store.volume(one('Single Arm Cable Row', 'electric', 20))).toBe(400); /* „na stronę” ×2 — jak dotąd */
    expect(store.volume(one('Cable Lateral Raise', 'electric', 5))).toBe(stats.setTotal(ex('Cable Lateral Raise'), { ...store.emptySet(), weight: 5, reps: 10, done: true }));
  });
  test('ćwiczenie własne o tej samej nazwie i przemianowane z biblioteki — bez ×2', async () => {
    await fresh(); const e = ex('Przysiad z pasem (linki)'); delete (e as any).lib; store.save();
    expect(store.volume(one('Przysiad z pasem (linki)', 'electric', 30))).toBe(300);
  });
  test('rekordy, sesje i PR liczą z przyrządu bloku: stacja 30×10 (600) po wyciągu 40×10 (400) to rekord sumy', async () => {
    await fresh(); const sq = ex('Przysiad z pasem (linki)');
    one('Przysiad z pasem (linki)', 'cable', 40, 10, H);
    const w2 = one('Przysiad z pasem (linki)', 'electric', 30, 10, H + 86400e3);
    const ss = stats.sessionsFor(sq); expect(ss.map(s => s.volume)).toEqual([400, 600]); expect(ss.map(s => s.total)).toEqual([400, 600]);
    expect(stats.recordsFor(sq).bestTotal).toBe(600);
    expect([...stats.prMap(w2).values()].flat()).toContain('objętość treningu');
    expect(stats.workoutPRs(w2)[0].details.join(' ')).toMatch(/600 kg/);
  });
  test('trening w toku: zmiana przyrządu bloku (D5) zmienia objętość serii', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Przysiad z pasem (linki)')); const a = store.getState().active!; const b = a.exercises[0];
    b.sets = [{ ...store.emptySet(), weight: 30, reps: 10, done: true }]; b.impl = 'electric'; expect(store.volume(a)).toBe(600);
    b.impl = 'cable'; expect(store.volume(a)).toBe(300);
  });
});
