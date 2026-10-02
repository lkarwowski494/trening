import { snapLb } from './units';

/*
 * P-003 E1: osiągalne ciężary sprzętu w miejscu treningu (docs/10-miejsca-i-sprzet.md, sekcja 3.2).
 * Trzy opisy, z których liczymy jedną posortowaną listę kg:
 *  - list     — lista ciężarów z przełącznikiem przy każdym (hantle stałe / z szybką regulacją, kettle, stos maszyny);
 *               „zakres + krok” to tylko skrót w edytorze — zapisuje się jako lista, żeby dało się odznaczyć pojedyncze kg;
 *  - plates   — uchwyt/gryf + talerze w sztukach (ograniczona suma podzbiorów; greedy bywa błędny przy ograniczonych talerzach);
 *  - electric — stacja z oporem elektrycznym/magnetycznym: zakres NA STRONĘ (jedną linkę) + krok.
 * Wartości w opisie są w jednostce sprzętu (talerz 45 lb ≠ 20 kg); wynik w kg na siatce zapisu aplikacji — lb przez to samo
 * przyciąganie co wpis w polu (snapLb), więc porównanie „ciężar ∈ dostępne” działa z tolerancją 0,01 kg.
 */
export type LoadUnit = 'kg' | 'lb';
export interface WeightEntry { w: number; on: boolean }
/** n = liczba posiadanych sztuk tego talerza (wszystkie, nie pary). */
export interface PlateEntry { w: number; n: number }
export type LoadSpec =
  | { kind: 'list'; unit: LoadUnit; items: WeightEntry[] }
  | { kind: 'plates'; unit: LoadUnit; base: number; plates: PlateEntry[] }
  | { kind: 'electric'; unit: LoadUnit; min: number; max: number; step: number };

/** Tolerancja porównań ciężarów w kg (siatka zapisu 0,01 kg; lb przez snapLb). */
export const LOAD_TOL_KG = 0.01;
const EPS = 1e-9;
const MAX_VALUES = 2000;
const r2 = (v: number) => Math.round(v * 100) / 100 + 0;
const milli = (v: number) => Math.round(v * 1000);
/** Wartość w jednostce sprzętu → kg na siatce zapisu (jak wIn: kg do 0,01, lb przyciągane do „okrągłych” kg). */
export const toKg = (v: number, unit: LoadUnit): number => unit === 'lb' ? snapLb(v) : r2(v);

/** Wartości min..max co krok (w jednostce sprzętu), bez szumu zmiennoprzecinkowego; pusta lista przy złych danych. */
export function rangeValues(min: number, max: number, step: number): number[] {
  if (![min, max, step].every(Number.isFinite) || step <= 0 || min < 0 || max < min) return [];
  const a = milli(min), b = milli(max), s = milli(step); if (s <= 0) return [];
  const out: number[] = []; for (let v = a; v <= b && out.length < MAX_VALUES; v += s) out.push(v / 1000);
  return out;
}
/** Skrót edytora: lista z zakresu (wszystkie włączone); ciężary odznaczone wcześniej zostają odznaczone, spoza zakresu znikają. */
export function fillRange(items: WeightEntry[], min: number, max: number, step: number): WeightEntry[] {
  const off = new Set(items.filter(x => !x.on).map(x => milli(x.w)));
  return rangeValues(min, max, step).map(w => ({ w, on: !off.has(milli(w)) }));
}
/**
 * Ciężary z uchwytu/gryfu i talerzy: base + 2·Σ kᵢ·wᵢ, gdzie kᵢ ≤ ⌊nᵢ / perStep⌋ to liczba talerzy danego rozmiaru na jednej stronie.
 * perStep = ile sztuk trzeba na „jeden talerz więcej”: sztanga / jeden hantel = 2 (po jednym na stronę), para hantli = 4.
 * Wynik w jednostce sprzętu, posortowany, bez powtórzeń.
 */
export function plateSums(base: number, plates: PlateEntry[], perStep: 2 | 4): number[] {
  if (!Number.isFinite(base) || base < 0) return [];
  let sums = new Set<number>([0]);
  for (const p of plates) {
    if (!(p.w > 0) || !Number.isFinite(p.w)) continue; const k = Math.floor(Math.max(0, Math.floor(p.n)) / perStep); if (!k) continue;
    const w = milli(p.w); const next = new Set<number>();
    for (const s of sums) for (let i = 0; i <= k; i++) next.add(s + 2 * i * w);
    sums = next; if (sums.size > 50000) break; /* ograniczenie na absurdalne dane (setki rozmiarów talerzy) */
  }
  const b = milli(base); return [...sums].sort((x, y) => x - y).slice(0, MAX_VALUES * 10).map(s => (b + s) / 1000);
}
/** Jak użyć opisu: perStep talerzy (para hantli 4, inaczej 2) i mnożniki (2 = suma pary / dwie linki; [1, 2] = jedna albo dwie linki). */
export interface LoadUse { perStep?: 2 | 4; mult?: number[] }
/** Wartości opisu w jednostce sprzętu (przed mnożnikami). */
export function specValues(spec: LoadSpec, perStep: 2 | 4 = 2): number[] {
  if (spec.kind === 'list') return [...new Set(spec.items.filter(x => x.on && x.w > 0 && Number.isFinite(x.w)).map(x => milli(x.w)))].sort((a, b) => a - b).map(x => x / 1000);
  if (spec.kind === 'plates') return plateSums(spec.base, spec.plates, perStep).filter(v => v > 0);
  return rangeValues(spec.min, spec.max, spec.step).filter(v => v > 0);
}
/** Osiągalne ciężary w kg, posortowane rosnąco, bez powtórzeń (z tolerancją). */
export function achievable(spec: LoadSpec | undefined | null, use: LoadUse = {}): number[] {
  if (!spec) return [];
  const vals = specValues(spec, use.perStep ?? 2); const mult = use.mult?.length ? use.mult : [1];
  const kg = mult.flatMap(m => vals.map(v => toKg(v * m, spec.unit))).sort((a, b) => a - b);
  const out: number[] = []; for (const v of kg) if (!out.length || v - out[out.length - 1] > LOAD_TOL_KG + EPS) out.push(v);
  return out;
}
/** Te same ciężary (tolerancja 0,01 kg). */
export const sameLoad = (a: number, b: number) => Math.abs(a - b) <= LOAD_TOL_KG + EPS;
export const hasLoad = (loads: readonly number[], x: number) => loads.some(v => sameLoad(v, x));
/** Najbliższy większy dostępny ciężar (lista rosnąca) albo null. */
export const nextHeavier = (loads: readonly number[], x: number): number | null => { for (const v of loads) if (v > x + LOAD_TOL_KG + EPS) return v; return null; };
/** Zaokrąglenie w dół do dostępnego (podpowiedzi i szacunki — nigdy wpisane wartości) albo null, gdy nic nie jest ≤ x. */
export const roundDown = (loads: readonly number[], x: number): number | null => { let r: number | null = null; for (const v of loads) { if (v <= x + LOAD_TOL_KG + EPS) r = v; else break; } return r; };

/* ---------- import / migracja ---------- */
const num = (v: unknown, min: number, max: number): number | null => { const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() ? Number(v.replace(',', '.')) : NaN; return Number.isFinite(n) && n >= min && n <= max ? Math.round(n * 1000) / 1000 : null; };
/** Opis ciężarów z importu: poprawny kształt albo undefined (śmieci nie wywracają ekranu). */
export function sanitizeLoadSpec(raw: unknown): LoadSpec | undefined {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined; const o = raw as Record<string, unknown>;
  const unit: LoadUnit = o.unit === 'lb' ? 'lb' : 'kg';
  if (o.kind === 'list') { const items = (Array.isArray(o.items) ? o.items : []).slice(0, 300).flatMap((x: any) => { const w = num(x?.w, 0.001, 1000); return w == null ? [] : [{ w, on: x?.on !== false }]; }); return { kind: 'list', unit, items }; }
  if (o.kind === 'plates') { const base = num(o.base, 0, 1000) ?? 0; const plates = (Array.isArray(o.plates) ? o.plates : []).slice(0, 30).flatMap((x: any) => { const w = num(x?.w, 0.001, 1000); const n = num(x?.n, 0, 100); return w == null || n == null ? [] : [{ w, n: Math.floor(n) }]; }); return { kind: 'plates', unit, base, plates }; }
  if (o.kind === 'electric') { const min = num(o.min, 0, 1000), max = num(o.max, 0, 1000), step = num(o.step, 0.001, 1000); if (min == null || max == null || step == null) return undefined; return { kind: 'electric', unit, min, max: Math.max(min, max), step }; }
  return undefined;
}
