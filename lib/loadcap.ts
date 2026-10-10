import { getState, exById } from '@/lib/store';
import { implAt, loadsFor } from '@/lib/equipment';
import { REPS, HEAVY_PCT, type GenInput, type GenResult } from '@/lib/generator';
import { t, exName } from '@/lib/i18n';
import { fmtW } from '@/lib/units';
import type { Impl } from '@/lib/seed';

/*
 * Audyt kontrolny 1 MER2-02 (wariant A, docs/25 backlog 0.10.1): generator „Siła” w miejscu z lekkimi hantlami (hotel 2,5–25 kg) daje bój główny
 * REPS.heavy (4–6) „ciężko, ok. HEAVY_PCT% maksimum”. hasExternalLoad sprawdza, czy przyrząd jest, a nie jaki ma zakres ciężarów — 2 × 25 kg przy
 * 4–6 powtórzeniach to ≥ 80% 1RM tylko przy małej sile. Ostrzeżenie podaje najcięższy ciężar w miejscu i co robić, gdy wychodzi lekko
 * (więcej powtórzeń bliżej upadku; siła rośnie, zwykle mniej niż przy dużym ciężarze — ta sama podstawa co MER-01: ACSM 2026, Schoenfeld 2017,
 * Lopez 2021, docs/research/22 R3). Bez progu liczbowego „za lekkie” (wariant B odrzucony: próg bez źródła).
 * Podpięcie do podglądu generatora (previewWarnings / app/generator.tsx) — fala 2 po scaleniu gałęzi feat-plan-moje.
 */

/** Przyrządy o skończonej liście ciężarów w miejscu (hantle, kettlebell) — tu najcięższy ciężar może nie wystarczyć do ciężkich serii.
 * Sztanga, maszyny i wyciągi — nie (talerze dokłada się, stosy są zwykle cięższe; dane miejsca nie mówią o sile użytkownika). */
export const CAPPED_IMPLS = ['dumbbell', 'kettlebell'] as const satisfies readonly Impl[];
export type LoadCap = { exerciseId: string; impl: typeof CAPPED_IMPLS[number]; /** najcięższy dostępny ciężar (kg, jak loadsFor) */ maxKg: number };

const isCapped = (i: Impl | undefined): i is LoadCap['impl'] => !!i && (CAPPED_IMPLS as readonly string[]).includes(i);

/** Boje główne planu siłowego (serie REPS.heavy) robione w miejscu hantlami albo kettlem — z najcięższym dostępnym ciężarem; bez powtórzeń ćwiczeń. */
export function heavyLoadCaps(r: GenResult, inp: GenInput): LoadCap[] {
  if (inp.goal !== 'strength' || r.unloaded) return [];
  const loc = getState().settings.locations.find(l => l.id === inp.locationId) ?? null; if (!loc) return [];
  const out: LoadCap[] = [];
  for (const tp of r.templates) for (const it of tp.items) {
    if (it.repMin !== REPS.heavy[0] || it.repMax !== REPS.heavy[1] || out.some(c => c.exerciseId === it.exerciseId)) continue;
    const e = exById(it.exerciseId); if (!e) continue;
    const impl = implAt(e, loc); if (!isCapped(impl)) continue;
    const l = loadsFor(e, loc, impl); if (l.kind !== 'loads' || !l.loads.length) continue;
    out.push({ exerciseId: e.id, impl, maxKg: Math.max(...l.loads) });
  }
  return out;
}

/** Ostrzeżenie podglądu generatora (MER2-02) albo null. Liczba = najcięższy ciężar spośród bojów głównych (w jednostce aplikacji). */
export function loadCapWarning(r: GenResult, inp: GenInput): { kind: 'loadcap'; text: string } | null {
  const caps = heavyLoadCaps(r, inp); if (!caps.length) return null;
  const names = caps.map(c => exName(exById(c.exerciseId))).join(', ');
  return { kind: 'loadcap', text: t('Najcięższy ciężar w miejscu dla boju głównego ({list}): {w}. Ciężkie serie {a}–{b} powtórzeń (ok. {p}% maksimum) mogą być z nim za lekkie — jeśli {b} powtórzeń wychodzi lekko, rób więcej powtórzeń, bliżej upadku. Siła też wtedy rośnie, ale zwykle mniej niż przy dużym ciężarze.', { list: names, w: fmtW(Math.max(...caps.map(c => c.maxKg))), a: REPS.heavy[0], b: REPS.heavy[1], p: HEAVY_PCT }) };
}
