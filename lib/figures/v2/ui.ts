/*
 * Figury v2 — dane dla warstwy ekranu (poza czystym silnikiem, bo używa lib/cues i aliasów): wskazówki przypisane ćwiczeniu → linie odniesienia i błędy do animacji,
 * mięśnie z legendą i oznaczeniem „uproszczenie”. Wszystko wynika z danych ze źródłami (lib/cues, cue-sets.json, muscleLoad katalogu) — nic nie jest dopisywane ręcznie.
 */
import { CUE_DATA, CUE_SECTIONS, generalCuesReviewed, hasCues } from '@/lib/cues';
import { catalogKey, type Exercise } from '@/lib/seed';
import { REGION_LABEL } from '@/lib/seed';
import { CUE_SETS } from './cueSets';
import { CUE_TO_ERROR, type ErrorId } from './errors';
import { faultApplicable, figureSpec, musclesFor, type FigureSpec } from './figure';
import { guidesFor, type GuideId } from './guides';
import { MUSCLE_MIN_LOAD, type MuscleId } from './muscles';

/** Id wskazówek ćwiczenia: własne (lib/cues) albo zestaw ogólny (ok i err). */
export function cueIdsOf(key: string): { ids: string[]; errs: string[] } {
  const own = Object.prototype.hasOwnProperty.call(CUE_DATA.exercises, key) ? CUE_DATA.exercises[key] : null;
  if (own) return { ids: CUE_SECTIONS.flatMap(s => (own[s] ?? []).map(r => r.c)), errs: (own.mistakes ?? []).map(r => r.c) };
  const e = Object.prototype.hasOwnProperty.call(CUE_SETS.items, key) ? CUE_SETS.items[key] : null;
  if (e && e.b === 'general' && generalCuesReviewed(key) /* zestaw bez recenzji treści — bez linii i błędów (M1-audytor-generalny-038) */) return { ids: [...(e.ok ?? []), ...(e.err ?? [])], errs: e.err ?? [] };
  return { ids: [], errs: [] };
}

/** Linie odniesienia dozwolone przy ćwiczeniu (tylko z wskazówek ze źródłem). */
export const guidesOf = (key: string): GuideId[] => guidesFor(cueIdsOf(key).ids);

/** Błędy do animacji: wskazówki „częsty błąd” ćwiczenia, które da się pokazać pozą w tym wariancie rysunku (bez powtórzeń). */
export function errorsOf(spec: FigureSpec): { error: ErrorId; cue: string }[] {
  const out: { error: ErrorId; cue: string }[] = [];
  for (const cue of cueIdsOf(spec.key).errs) { const error = CUE_TO_ERROR[cue]; if (error && faultApplicable(spec, error) && !out.some(o => o.error === error)) out.push({ error, cue }); }
  return out;
}

export type MuscleLegend = { main: MuscleId[]; aux: MuscleId[]; simplified: boolean; label: (r: MuscleId) => string };
/** Legenda mięśni: główne (1) i pomocnicze (0,5); „uproszczenie”, gdy pewność w katalogu to uproszczenie. */
export function legendOf(key: string): MuscleLegend | null {
  const m = musclesFor(key); if (!m) return null;
  const pick = (f: (v: number) => boolean): MuscleId[] => (Object.entries(m.load) as [MuscleId, number][]).filter(([, v]) => v >= MUSCLE_MIN_LOAD && f(v)).map(([k]) => k as MuscleId);
  const main = pick(v => v >= 1), aux = pick(v => v < 1);
  return { main, aux, simplified: /uproszczenie/.test(m.confidence), label: r => REGION_LABEL[r] };
}

/** Opis ustawienia stóp w przysiadzie („palce lekko na zewnątrz, zwykle 15–20°”): zwykły rozstaw obu stóp na podłodze (nie szeroki/sumo, nie ściana); źródła: Stronger by Science „How to Squat” (Foot Angle) i NSCA Basics 2012 s. 49 — część wspólna przedziałów (docs/research, 25.10.2026, szczebel 4, dwa zgodne źródła). */
export const toeAngleApplies = (spec: FigureSpec): boolean => spec.family === 'squat' && faultApplicable(spec, 'kneesIn');

/** Czy przy ćwiczeniu jest sekcja „Technika”: własne wskazówki (lib/cues) albo figura v2 (a z nią zestaw ogólny wzorca; kolejne rodziny — kolejne etapy). */
export function hasTechnique(e: Pick<Exercise, 'lib' | 'libKey'> | null | undefined): boolean {
  if (hasCues(e)) return true; const key = catalogKey(e); if (!key) return false;
  return !!figureSpec(key);
}
