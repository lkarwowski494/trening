/*
 * Figury v2 — dane dla warstwy ekranu (poza czystym silnikiem, bo używa lib/cues i aliasów): wskazówki przypisane ćwiczeniu → linie odniesienia i błędy do animacji,
 * mięśnie z legendą i oznaczeniem „uproszczenie”. Wszystko wynika z danych ze źródłami (lib/cues, cue-sets.json, muscleLoad katalogu) — nic nie jest dopisywane ręcznie.
 */
import { CUE_DATA, CUE_SECTIONS, cueText, generalCuesReviewed, hasCues } from '@/lib/cues';
import { t, lang } from '@/lib/i18n';
import { catalogKey, type Exercise } from '@/lib/seed';
import { REGION_LABEL } from '@/lib/seed';
import { CUE_SETS } from './cueSets';
import { CUE_TO_ERROR, ERRORS, dataErrorId, type FigError } from './errors';
import type { MeasuredJoint } from './poseData';
import { faultApplicable, shownFigureSpec, frameAt, errorDefOf, markPoints, musclesFor, type FigureSpec } from './figure';
import { BADGE_MAX, okBadges, type Badge } from './badges';
import { proj } from './draw';
import type { View } from './scene';
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
export function errorsOf(spec: FigureSpec): { error: FigError; cue: string }[] {
  const out: { error: FigError; cue: string }[] = [];
  const v = spec.variant;
  if ('data' in v) {
    /* rodzina z danych: błędy ćwiczenia to wpisy bledy[] (poza = poprawna + delty; wskazówka „częsty błąd” sprawdzona walidatorem), do tego błąd tempa, gdy wskazówki ćwiczenia go mają */
    v.data.bledy.forEach((b, i) => out.push({ error: dataErrorId(i), cue: b.cue }));
    for (const cue of cueIdsOf(spec.key).errs) { const error = CUE_TO_ERROR[cue]; if (error && ERRORS[error].kind === 'tempo' && faultApplicable(spec, error) && !out.some(o => o.error === error)) out.push({ error, cue }); }
    return out;
  }
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
  return !!shownFigureSpec(key);
}

/**
 * Teksty „częstego błędu” bez wpisu w słownikach wskazówek (lib/cues/text): id z listy newIds w cue-sets.json, którym tłumacz jeszcze nie dopisał zdań. Zdanie idzie wtedy przez t()
 * (PL = klucz, EN w lib/i18n.en.ts, pozostałe języki z przekładu) zamiast pokazać gołe id. Wpis słownika wskazówek ma pierwszeństwo.
 */
const GAP_TEXT: Record<string, () => string> = {
  /* pusta od 27.10.2026: hang.noSwing przeniesione do słownika wskazówek (lib/cues/text, wszystkie języki) */
};
/** Id wskazówek, które mają tekst tylko tutaj (testy: kompletność). */
export const GAP_CUES: readonly string[] = Object.keys(GAP_TEXT);
/** Tekst wskazówki „częsty błąd” w języku interfejsu. */
export function errorText(cue: string): string {
  const x = cueText(cue, lang()); if (x !== cue) return x;
  return Object.prototype.hasOwnProperty.call(GAP_TEXT, cue) ? GAP_TEXT[cue]() : x;
}

/** Znaczki ✓/✕ pozycji u: poza poprawna — ✓ przy częściach ciała, których dotyczą wskazówki ćwiczenia; widok błędu — ✕ w miejscu błędu z jego wskazówką; maks. BADGE_MAX. */
export function badgesFor(spec: FigureSpec, u: number, view: View, error?: FigError): Badge[] {
  const f = frameAt(spec, u, error);
  if (error) {
    const def = errorDefOf(spec, error); if (!def) return [];
    return markPoints(f, view, def.mark).slice(0, BADGE_MAX).map((p, i) => ({ id: `err:${def.cue[0]}:${i}`, kind: 'err' as const, cue: def.cue[0], at: proj(p, view) }));
  }
  return okBadges(f, view, cueIdsOf(spec.key).ids);
}

/** Linia pomiaru pod licznikiem faz: szablon (klucz t()), etykieta stawu (klucz t()) i liczba. Znak wartości wybiera etykietę (nadgarstek, rotacja, obrót przedramienia, barki), liczba jest bez znaku; stopnie dla kolana, łokcia i biodra zostają jak były. */
export function measureLine(m: { joint: MeasuredJoint; deg: number; unit: 'deg' | 'cm' }): { template: string; staw: string; n: number } {
  const r = Math.round(m.deg) || 0; const neg = r < 0; const abs = Math.abs(r);
  const D = 'Kąt na rysunku: {staw} {n}°'; const C = 'Przesunięcie na rysunku: {staw} {n} cm';
  switch (m.joint) {
    case 'knee': return { template: D, staw: 'zgięcie kolana', n: r };
    case 'elbow': return { template: D, staw: 'zgięcie łokcia', n: r };
    case 'hip': return { template: D, staw: 'zgięcie biodra', n: r };
    case 'shElev': return { template: D, staw: 'uniesienie ramienia', n: r };
    case 'shAbd': return { template: D, staw: 'ramię odsunięte w bok', n: r };
    case 'shRot': return { template: D, staw: neg ? 'obrót ramienia do wewnątrz' : 'obrót ramienia na zewnątrz', n: abs };
    case 'wristFlex': return { template: D, staw: neg ? 'wyprost nadgarstka' : 'zgięcie nadgarstka', n: abs };
    case 'forearmRoll': return { template: D, staw: neg ? 'obrót przedramienia dłonią w dół' : 'obrót przedramienia dłonią w górę', n: abs };
    case 'shrug': return { template: C, staw: neg ? 'barki w dół' : 'barki w górę', n: abs };
    case 'protract': return { template: C, staw: neg ? 'barki do tyłu' : 'barki do przodu', n: abs };
  }
}
