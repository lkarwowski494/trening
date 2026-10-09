/*
 * Audyt kontrolny 1 (przed 0.10.0), UX2-06 [WYSOKA — błędne twierdzenie merytoryczne]: ekran ćwiczenia pokazywał „Obciążenie partii (z katalogu)”
 * z MUSCLE_LOAD sprzecznie z „Partiami głównymi/pomocniczymi” po researchu L1–L6 (np. Back Squat: dwugłowe „●● pomocnicza”, choć research
 * 09.10 usunął je w przysiadzie, hip thruście i moście biodrowym). Naprawa (wariant A, jedno źródło prawdy): poziomy ●●● / ●● wynikają z pól
 * ćwiczenia (muscles / secondaryMuscles) — region partii spoza pól traci ●●/●●● (bez nowych twierdzeń), ●●● partii pomocniczej → ●●,
 * partia z pól bez regionu ●●/●●● dostaje poziom z pól.
 * Rodzaje (docs/20): niezmiennik (każde ćwiczenie biblioteki), logika (Back Squat, ćwiczenie edytowane), ekran (ekran ćwiczenia PL), regresja.
 */
import * as store from '@/lib/store';
import { seedState, muscleLoadOf, REGION_MUSCLE, REGION_LABEL, type Exercise, type Muscle } from '@/lib/seed';
import { fresh, saved, ex } from './helpers';
import { renderApp, flushAll, screen, go, act } from './app';

jest.setTimeout(30000);
const NOW = new Date(2026, 9, 8, 18).getTime();
beforeEach(() => { jest.useFakeTimers({ now: NOW }); });
afterEach(() => { jest.useRealTimers(); });

/** Sprzeczności listy „Obciążenie partii” z polami ćwiczenia (partie poza mapą — szyja — bez porównania). */
function conflicts(e: Exercise): string[] {
  const P = new Set<Muscle>(e.muscles ?? []), S = new Set<Muscle>(e.secondaryMuscles ?? []); const ml = muscleLoadOf(e); const out: string[] = [];
  for (const [r, w] of ml) { const M = REGION_MUSCLE[r]; if (!M) continue;
    if (w === 1 && !P.has(M)) out.push(`${r} ●●● bez partii głównej ${M}`);
    if (w === 0.5 && !P.has(M) && !S.has(M)) out.push(`${r} ●● bez partii ${M}`); }
  if (ml.length) for (const M of [...P, ...S]) { const rs = ml.filter(([r]) => REGION_MUSCLE[r] === M);
    if (P.has(M) && !rs.some(([, w]) => w === 1)) out.push(`${M}: główna bez ●●●`);
    if (S.has(M) && !P.has(M) && !rs.some(([, w]) => w === 0.5)) out.push(`${M}: pomocnicza bez ●●`); }
  return out;
}

describe('UX2-06: „Obciążenie partii” zgodne z partiami głównymi i pomocniczymi', () => {
  test('niezmiennik: każde ćwiczenie biblioteki (świeża instalacja) — ●●/●●● tylko dla partii z pól i każda partia z pól ma swój poziom', () => {
    const bad: string[] = [];
    for (const e of seedState('pl').exercises) { const c = conflicts(e); if (c.length) bad.push(`${e.name}: ${c.join('; ')}`); }
    expect(bad).toEqual([]);
  });
  test('Back Squat: bez dwugłowych ●● (research 09.10), czworogłowe ●●●, pośladki i przywodziciele ●●', async () => {
    await fresh(); const sq = ex('Back Squat'); const ml = new Map(muscleLoadOf(sq));
    expect(ml.get('hamstrings')).not.toBe(0.5); expect(ml.get('hamstrings')).not.toBe(1);
    expect(ml.get('quads')).toBe(1); expect(ml.get('glutes')).toBe(0.5); expect(ml.get('adductors')).toBe(0.5);
    for (const n of ['Hip Thrust (sztanga)', 'Glute Bridge']) expect([0.5, 1]).not.toContain(new Map(muscleLoadOf(ex(n))).get('hamstrings'));
  });
  test('ćwiczenie edytowane przez użytkownika: lista idzie za polami (dodane dwugłowe jako pomocnicze → ●●)', async () => {
    await fresh(); const sq = ex('Back Squat'); sq.secondaryMuscles = [...(sq.secondaryMuscles ?? []), 'dwugłowe']; store.save();
    expect(new Map(muscleLoadOf(sq)).get('hamstrings')).toBe(0.5); expect(conflicts(sq)).toEqual([]);
  });
  test('ekran ćwiczenia Back Squat: brak „dwugłowe ●●”, jest „czworogłowe ●●●”', async () => {
    await fresh(); store.save(); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(10);
    await go(`/exercise/${ex('Back Squat').id}`); await flushAll(10);
    const txt = screen.getAllByText(/●/).map(n => [n.props.children].flat().join('')).join('\n');
    expect(txt).toContain(`${REGION_LABEL.quads} ●●●`); expect(txt).not.toMatch(new RegExp(`${REGION_LABEL.hamstrings} ●●`));
  });
});
