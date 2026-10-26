import { CATALOG, type MuscleRegion } from './catalog.generated';
import { catalogKey, muscleLoadOf, metricFor, REGION_MUSCLE, type Exercise, type Muscle } from './seed';
import { t } from './i18n';
import { MUSCLE_MIN_LOAD } from './figures/v2/muscles';

/*
 * Rola mięśnia w ruchu (decyzja właściciela 26.10.2026): przy każdym podświetlonym mięśniu ćwiczenia jedno zdanie o jego pracy („Prostuje biodro, gdy wstajesz.”).
 * Zdanie powstaje z pary (ćwiczenie, region) wg reguł rodziny ruchu (pattern), roli (główny 1 / pomocniczy 0,5) i — w jawnych wyjątkach — nazwy z katalogu.
 * Dane: lib/muscleRoles/data.json (generuje scripts/zrodla-runtime.mjs z data/zrodla/role-miesni.json; źródeł w paczce nie ma). Pokazujemy TYLKO funkcje
 * potwierdzone ≥ 2 źródłami (pole show); uproszczenia i funkcje z jednym źródłem zostają w danych bez tekstu. Reguła pierwszej pasującej; brak reguły → null
 * (aplikacja nie zgaduje). Aplikacja niczego nie zaleca i nie daje porad medycznych — zdanie opisuje tylko ruch w stawie.
 */
export type RoleKind = 'main' | 'aux';
type Rule = { p: string; m: string; o: RoleKind[]; f: string; ph?: 1; rm?: string; s: 0 | 1 };
type NameRule = { x: string[]; m: string; o: RoleKind[]; f: string; s: 0 | 1 };
export type RoleData = {
  phases: string[];
  functions: Record<string, { r: string; t: Partial<Record<RoleKind, Record<string, string>>> }>;
  rules: Rule[]; names: NameRule[]; noRole: { e: string; m: string[] }[]; noRegions: string[];
};
export const ROLE_DATA: RoleData = require('./muscleRoles/data.json');

/** Wynik dopasowania: funkcja, wariant zdania (rodzina z fazą albo „_”) i czy wolno ją pokazać. */
export type RoleHit = { fn: string; role: RoleKind; show: boolean; text: string | null };
export type RoleCtx = { key: string; pattern: string; metric: string; loads: Partial<Record<MuscleRegion, number>> };

/** Rola z udziału: 1 = główny, 0,5 = pomocniczy; poniżej MUSCLE_MIN_LOAD (0,25 — mały udział, niepodświetlany) brak. */
export const roleKindOf = (w: number): RoleKind | null => (w >= 1 ? 'main' : w >= MUSCLE_MIN_LOAD ? 'aux' : null);

/** Dopasowanie roli (bez filtra wyświetlania): pierwsza pasująca reguła; wyjątki z nazwy → lista nameRules przed regułami rodziny. */
export function matchRole(ctx: RoleCtx, region: string, w: number, data: RoleData = ROLE_DATA): RoleHit | null {
  const role = roleKindOf(w); if (!role || data.noRegions.includes(region)) return null;
  if (data.noRole.some(x => x.e === ctx.key && x.m.includes(region))) return null;
  const hit = (fn: string, variant: string, show: number): RoleHit => ({ fn, role, show: !!show, text: data.functions[fn]?.t[role]?.[variant] ?? null });
  for (const n of data.names) if (n.m === region && n.o.includes(role) && n.x.includes(ctx.key)) return hit(n.f, '_', n.s);
  const isPhaseFamily = data.phases.includes(ctx.pattern);
  for (const r of data.rules) {
    if (r.p !== ctx.pattern || r.m !== region || !r.o.includes(role)) continue;
    if (r.rm && ctx.loads[r.rm as MuscleRegion] !== 1) continue;
    /* ćwiczenie na czas w rodzinie z fazą („gdy wstajesz”) — zdanie o ruchu nie opisuje utrzymania pozycji */
    if (isPhaseFamily && ctx.metric === 'time') return null;
    return hit(r.f, r.ph ? r.p : '_', r.s);
  }
  return null;
}

/** Kontekst dopasowania dla klucza katalogu (wzorzec, metryka); bez wpisu w katalogu → null. */
export function ctxOfKey(key: string, loads: Partial<Record<MuscleRegion, number>>): RoleCtx | null {
  const c = (CATALOG as Record<string, { pattern: string }>)[key]; return c ? { key, pattern: c.pattern, metric: metricFor(key), loads } : null;
}

export type MuscleRoleRow = { region: MuscleRegion; muscle: Muscle | null; load: number; role: string | null };
/** Wiersze „mięsień + rola” dla ćwiczenia z biblioteki: podświetlane regiony (udział ≥ MUSCLE_MIN_LOAD) w kolejności muscleLoadOf; rola = zdanie w języku aplikacji albo null
 * (brak reguły, funkcja niewyświetlana, szyja). Ćwiczenie własne albo bez katalogu → []. */
export function muscleRoleRows(e: Pick<Exercise, 'lib' | 'libKey'> & Partial<Pick<Exercise, 'muscles' | 'secondaryMuscles'>>): MuscleRoleRow[] {
  const key = catalogKey(e); if (!key) return [];
  const rows = muscleLoadOf(e).filter(([, w]) => w >= MUSCLE_MIN_LOAD); if (!rows.length) return [];
  const ctx = ctxOfKey(key, Object.fromEntries(rows) as Partial<Record<MuscleRegion, number>>); if (!ctx) return [];
  return rows.map(([region, load]) => {
    const h = matchRole(ctx, region, load);
    return { region, muscle: REGION_MUSCLE[region], load, role: h?.show && h.text ? t(h.text) : null };
  });
}
