import { MUSCLES, REGION_LABEL, REGION_MUSCLE, muscleLoadOf, type Exercise, type Muscle } from './seed';
import type { MuscleRegion } from './catalog.generated';

/*
 * Partie w statystykach serii tygodniowych i cel serii na partię (decyzje właściciela 12.10.2026, docs/research/32-serie-na-partie.md).
 *
 * 1. Rozbicie TYLKO w statystykach serii (paski „Ten tydzień”, Postępy, Progresja) i w celu: barki → przód / bok / tył, plecy → góra pleców /
 *    najszersze (+ prostowniki grzbietu, trzeci akton partii „plecy” w mapie regionów — inaczej serie z martwego ciągu znikałyby z liczenia).
 *    Objętość, mapa mięśni, generator i regeneracja zostają na partiach zbiorczych (MUSCLES) — bez zmian.
 * 2. Przypisanie bez zgadywania, z istniejących danych: partia zbiorcza ćwiczenia (muscles = 1, secondaryMuscles = 0,5, jak dotąd) dostaje serie
 *    na te jej regiony z katalogu (MUSCLE_LOAD przez muscleLoadOf), które mają NAJWYŻSZY poziom obciążenia w tej partii — każdy taki region pełny
 *    udział (jak dwie partie główne: każda 1 serię). Przykład: wyciskanie nad głową (barki główne, przód 1, bok 0,5) → przód; wiosłowanie
 *    (góra pleców 1, najszersze 1) → oba. Regiony o niższym poziomie nie dostają nic (nie dzielimy serii ułamkami poziomów 0,5 / 0,25).
 * 3. Ćwiczenie bez regionów dla barków lub pleców (własne, spoza katalogu, przemianowane bez klucza) → wiersz „bez rozbicia” (id = nazwa partii
 *    zbiorczej). Reguła do akceptacji właściciela (raport 12.10.2026).
 */
const FRONT_DELT = 'front_delt', SIDE_DELT = 'side_delt', REAR_DELT = 'rear_delt', UPPER_BACK = 'upper_back', LATS = 'lats', LOWER_BACK = 'lower_back';
/** Regiony katalogu (aktony), na które rozbijamy partię zbiorczą — w kolejności wyświetlania. */
export const SPLIT_REGIONS = { barki: [FRONT_DELT, SIDE_DELT, REAR_DELT], plecy: [UPPER_BACK, LATS, LOWER_BACK] } as const satisfies Partial<Record<Muscle, readonly MuscleRegion[]>>;
export type SplitRegion = typeof SPLIT_REGIONS[keyof typeof SPLIT_REGIONS][number];
/** Id części w statystykach serii: partia zbiorcza (także „barki”/„plecy” = bez rozbicia) albo region rozbicia. */
export type SetPart = Muscle | SplitRegion;
/** Wszystkie części w kolejności wyświetlania (po „barki”/„plecy” — wiersz „bez rozbicia”). */
export const SET_PARTS: readonly SetPart[] = MUSCLES.flatMap((m): SetPart[] => (m === 'barki' || m === 'plecy' ? [...SPLIT_REGIONS[m], m] : [m]));
const splitOf = (m: Muscle): readonly SplitRegion[] | undefined => (m === 'barki' || m === 'plecy' ? SPLIT_REGIONS[m] : undefined);
export const isSetPart = (k: string): k is SetPart => (SET_PARTS as readonly string[]).includes(k);

/** Polski klucz tekstu części (do t()): regiony — REGION_LABEL, wiersz bez rozbicia — osobny napis, pozostałe — nazwa partii. */
export function partLabel(p: SetPart): string {
  if (p === 'barki') return 'barki — bez rozbicia'; if (p === 'plecy') return 'plecy — bez rozbicia';
  return (REGION_LABEL as Record<string, string>)[p] ?? p;
}

/** Części i udziały jednej serii ćwiczenia: [część, udział]. Partie bez rozbicia → ta sama partia; patrz reguła w nagłówku pliku. */
export function partCredits(ex: Pick<Exercise, 'lib' | 'libKey' | 'muscles' | 'secondaryMuscles'>): [SetPart, number][] {
  const out = new Map<SetPart, number>(); const add = (p: SetPart, v: number) => out.set(p, (out.get(p) ?? 0) + v);
  let load: [MuscleRegion, number][] | null = null;
  const credit = (m: Muscle, share: number) => {
    const split = splitOf(m); if (!split) return add(m, share);
    const rs = (load ??= muscleLoadOf(ex)).filter(([r]) => REGION_MUSCLE[r] === m && (split as readonly string[]).includes(r)); if (!rs.length) return add(m, share);
    const top = Math.max(...rs.map(([, w]) => w)); for (const [r, w] of rs) if (w === top) add(r as SplitRegion, share);
  };
  (ex.muscles ?? []).forEach(m => credit(m, 1)); (ex.secondaryMuscles ?? []).forEach(m => credit(m, 0.5));
  return [...out];
}

/* Cel serii na partię w tygodniu (Ustawienia). Granice to granice pola w interfejsie (zabezpieczenie przed pomyłką wpisu), NIE zalecenie
 * dawkowania — zalecenie to wartość automatyczna (stats.WEEKLY_SETS_MARK, ze źródłami). */
export const SETS_GOAL_MIN = 1;
export const SETS_GOAL_MAX = 40;
export const clampGoal = (n: number): number => Math.min(SETS_GOAL_MAX, Math.max(SETS_GOAL_MIN, Math.round(n)));
/** Migracja/import: zostają tylko znane części z liczbą skończoną (zaokrągloną i przyciętą do granic); wszystko inne odpada. Pusty wynik → undefined. */
export function normalizeGoals(raw: unknown): Record<string, number> | undefined {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined;
  const out: Record<string, number> = {};
  for (const p of SET_PARTS) { const v = Object.prototype.hasOwnProperty.call(raw, p) ? (raw as Record<string, unknown>)[p] : undefined; if (typeof v === 'number' && Number.isFinite(v)) out[p] = clampGoal(v); }
  return Object.keys(out).length ? out : undefined;
}
