import { snapLb, KG_PER_LB } from './units';

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
/**
 * Audyt E1 (H1, M11): jedne limity dla edytora, sanityzacji i obliczeń. Nic nie jest po cichu ucinane: zakres albo talerze ponad limit
 * są odrzucane w edytorze (komunikat z validateSpec), a opis ponad limit daje pustą listę (podpowiedź jak bez miejsca), nigdy listę bez
 * najcięższych ciężarów.
 */
export const LOAD_LIMITS = { listItems: 300, plateRows: 30, rangeValues: 2000, plateSums: 50000 } as const;
/** Weryfikacja 2: zakres pojedynczej wartości (ciężar, krok) — ten sam w edytorze i sanityzacji (inaczej wpis znikał po restarcie). */
export const W_MIN = 0.001, W_MAX = 1000;
const r2 = (v: number) => Math.round(v * 100) / 100 + 0;
const milli = (v: number) => Math.round(v * 1000);
/** Weryfikacja 2 (LOW 1): sumy talerzy w milionowych — talerze przeliczone z kg na lb (dokładny współczynnik) nie dają prawie-duplikatów. */
const micro = (v: number) => Math.round(v * 1e6);
/** Wartość w jednostce sprzętu → kg na siatce zapisu (jak wIn: kg do 0,01, lb przyciągane do „okrągłych” kg). */
export const toKg = (v: number, unit: LoadUnit): number => unit === 'lb' ? snapLb(Math.round(v * 10) / 10) : r2(v); /* weryfikacja 3: najpierw siatka wyświetlania 0,1 lb (jak wOut) — wartości z dokładnym współczynnikiem (22,0462 lb) nie zaokrąglają się podwójnie do 22,1 */

/** Liczba wartości zakresu min..max co krok; null przy złych danych (krok ≤ 0, max < min, ujemne). */
export function rangeCount(min: number, max: number, step: number): number | null {
  if (![min, max, step].every(Number.isFinite) || min < 0 || max < min) return null; const s = micro(step); if (s <= 0) return null;
  return Math.floor((micro(max) - micro(min)) / s) + 1; /* weryfikacja 3: w milionowych — krok przeliczony dokładnym współczynnikiem (1,102311 lb) nie „dryfuje” */
}
/** Wartości min..max co krok (w jednostce sprzętu), bez szumu zmiennoprzecinkowego; pusta lista przy złych danych albo ponad limit. */
export function rangeValues(min: number, max: number, step: number, limit: number = LOAD_LIMITS.rangeValues): number[] {
  const n = rangeCount(min, max, step); if (n == null || n > limit) return [];
  const a = micro(min), s = micro(step); const out: number[] = []; for (let i = 0; i < n; i++) out.push((a + i * s) / 1e6);
  return out;
}
/** Skrót edytora: lista z zakresu (wszystkie włączone); ciężary odznaczone wcześniej zostają odznaczone, spoza zakresu znikają.
 * null = zły zakres albo więcej niż LOAD_LIMITS.listItems wartości (edytor pokazuje komunikat, lista się nie zmienia). */
export function fillRange(items: WeightEntry[], min: number, max: number, step: number): WeightEntry[] | null {
  if (min < W_MIN || max > W_MAX || step < W_MIN) return null; const n = rangeCount(min, max, step); if (n == null || n > LOAD_LIMITS.listItems) return null;
  const off = new Set(items.filter(x => !x.on).map(x => milli(x.w)));
  return rangeValues(min, max, step).map(w => ({ w, on: !off.has(milli(w)) }));
}
/** Sumy talerzy na stronę (w tysięcznych) albo null, gdy kombinacji jest więcej niż limit. */
function plateSumSet(plates: PlateEntry[], perStep: 2 | 4): Set<number> | null {
  let sums = new Set<number>([0]);
  for (const p of plates) {
    if (!(p.w > 0) || !Number.isFinite(p.w)) continue; const k = Math.floor(Math.max(0, Math.floor(p.n)) / perStep); if (!k) continue;
    const w = micro(p.w); const next = new Set<number>();
    for (const s of sums) for (let i = 0; i <= k; i++) next.add(s + 2 * i * w);
    if (next.size > LOAD_LIMITS.plateSums) return null; sums = next;
  }
  return sums;
}
/**
 * Ciężary z uchwytu/gryfu i talerzy: base + 2·Σ kᵢ·wᵢ, gdzie kᵢ ≤ ⌊nᵢ / perStep⌋ to liczba talerzy danego rozmiaru na jednej stronie.
 * perStep = ile sztuk trzeba na „jeden talerz więcej”: sztanga / jeden hantel = 2 (po jednym na stronę), para hantli = 4.
 * Wynik w jednostce sprzętu, posortowany, bez powtórzeń; pusty, gdy dane są złe albo kombinacji jest za dużo (validateSpec to zgłasza).
 */
export function plateSums(base: number, plates: PlateEntry[], perStep: 2 | 4): number[] {
  if (!Number.isFinite(base) || base < 0 || plates.length > LOAD_LIMITS.plateRows) return [];
  const sums = plateSumSet(plates, perStep); if (!sums) return [];
  const b = micro(base); return [...sums].sort((x, y) => x - y).map(s => (b + s) / 1e6);
}
export type SpecProblem = 'list_too_long' | 'plates_too_many_rows' | 'plates_too_many_combos' | 'range_invalid' | 'range_too_many';
/** Czy opis da się policzyć w całości; null = w porządku. Edytor pokazuje komunikat zamiast po cichu uciętej listy. */
export function validateSpec(spec: LoadSpec): SpecProblem | null {
  if (spec.kind === 'list') return spec.items.length > LOAD_LIMITS.listItems ? 'list_too_long' : null;
  if (spec.kind === 'plates') return spec.plates.length > LOAD_LIMITS.plateRows ? 'plates_too_many_rows' : !plateSumSet(spec.plates, 2) ? 'plates_too_many_combos' : null;
  if (spec.max === 0 && spec.min === 0) return null; /* jeszcze niewypełniony */
  const n = rangeCount(spec.min, spec.max, spec.step); return n == null ? 'range_invalid' : n > LOAD_LIMITS.rangeValues ? 'range_too_many' : null;
}
/** Jak użyć opisu: perStep talerzy (para hantli 4, inaczej 2) i mnożniki (2 = suma pary / dwie linki; [1, 2] = jedna albo dwie linki). */
export interface LoadUse { perStep?: 2 | 4; mult?: number[] }
/** Wartości opisu w jednostce sprzętu (przed mnożnikami). */
export function specValues(spec: LoadSpec, perStep: 2 | 4 = 2): number[] {
  if (spec.kind === 'list') return spec.items.length > LOAD_LIMITS.listItems ? [] : [...new Set(spec.items.filter(x => x.on && x.w > 0 && Number.isFinite(x.w)).map(x => milli(x.w)))].sort((a, b) => a - b).map(x => x / 1000);
  if (spec.kind === 'plates') return plateSums(spec.base, spec.plates, perStep).filter(v => v > 0);
  return rangeValues(spec.min, spec.max, spec.step).filter(v => v > 0);
}
/** Audyt E1 (LOW): wynik liczony raz na treść opisu (klucz = JSON) — ekran treningu przelicza bloki przy każdym wpisie, a suma talerzy
 * dla pełnej siłowni to tysiące kombinacji. Klucz z treści, więc zmiana opisu w miejscu (edytor mutuje obiekt) nie daje starego wyniku. */
const memo = new Map<string, number[]>();
/** Osiągalne ciężary w kg, posortowane rosnąco, bez powtórzeń (z tolerancją). Zwracanej tablicy nie modyfikować. */
export function achievable(spec: LoadSpec | undefined | null, use: LoadUse = {}): number[] {
  if (!spec) return [];
  const key = JSON.stringify([spec, use.perStep ?? 2, use.mult ?? [1]]); const hit = memo.get(key); if (hit) return hit;
  const vals = specValues(spec, use.perStep ?? 2); const mult = use.mult?.length ? use.mult : [1];
  const kg = mult.flatMap(m => vals.map(v => toKg(v * m, spec.unit))).sort((a, b) => a - b);
  const out: number[] = []; for (const v of kg) if (!out.length || v - out[out.length - 1] > LOAD_TOL_KG + EPS) out.push(v);
  if (memo.size > 200) memo.clear(); memo.set(key, out); return out;
}
/** Audyt E1 (M4): zmiana jednostki sprzętu przelicza wartości (kg → lb do 0,1 lb, lb → kg przez to samo przyciąganie co wpis w polu),
 * a nie tylko zmienia podpis — „20 kg” nie staje się „20 lb”. Liczba sztuk talerzy bez zmian. */
export function convertSpec(spec: LoadSpec, to: LoadUnit): LoadSpec {
  if (spec.unit === to) return spec;
  const cv = (v: number) => to === 'kg' ? toKg(v, 'lb') : Math.round(v / KG_PER_LB * 10) / 10;
  /* weryfikacja 2 (LOW 1): talerze i gryf z dokładnym współczynnikiem (10⁻⁶ lb) — zaokrąglenie każdego talerza do 0,1 lb dawało prawie-duplikaty sum */
  const cvFine = (v: number) => Math.round((to === 'kg' ? v * KG_PER_LB : v / KG_PER_LB) * 1e6) / 1e6;
  if (spec.kind === 'list') { const seen = new Set<number>(); const items: WeightEntry[] = []; for (const x of spec.items) { const w = cv(x.w); if (w > 0 && !seen.has(milli(w))) { seen.add(milli(w)); items.push({ w, on: x.on }); } } return { kind: 'list', unit: to, items }; }
  if (spec.kind === 'plates') return { kind: 'plates', unit: to, base: cvFine(spec.base), plates: spec.plates.map(p => ({ w: cvFine(p.w), n: p.n })) };
  /* weryfikacja 3 (L3): stacja dokładnym współczynnikiem jak talerze — ustawienia się nie przesuwają (zaokrąglenie tylko na ekranie) */
  const min = cvFine(spec.min), max = cvFine(spec.max); let step = Math.max(W_MIN, cvFine(spec.step));
  /* weryfikacja 2 (LOW 3): krok zaokrąglony w górę tak, by nie przekroczyć limitu ustawień */
  const c = rangeCount(min, max, step); if (c != null && c > LOAD_LIMITS.rangeValues) step = Math.ceil((max - min) / (LOAD_LIMITS.rangeValues - 1) * 1e6) / 1e6;
  return { kind: 'electric', unit: to, min, max, step };
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
  if (o.kind === 'list') { const items = (Array.isArray(o.items) ? o.items : []).flatMap((x: any) => { const w = num(x?.w, W_MIN, W_MAX); return w == null ? [] : [{ w, on: x?.on !== false }]; }).slice(0, LOAD_LIMITS.listItems); return { kind: 'list', unit, items }; } /* H1: ten sam limit co edytor (edytor nie pozwala na więcej) */
  if (o.kind === 'plates') { const base = num(o.base, 0, W_MAX) ?? 0; const plates = (Array.isArray(o.plates) ? o.plates : []).flatMap((x: any) => { const w = num(x?.w, 0, W_MAX); /* wiersz z 0 (dopiero dodany w edytorze) zostaje — nie liczy się do sum */ const n = num(x?.n, 0, 100); return w == null || n == null ? [] : [{ w, n: Math.floor(n) }]; }).slice(0, LOAD_LIMITS.plateRows); return { kind: 'plates', unit, base, plates }; }
  if (o.kind === 'electric') { const min = num(o.min, 0, W_MAX), max = num(o.max, 0, W_MAX), step = num(o.step, W_MIN, W_MAX); if (min == null || max == null || step == null) return undefined; return { kind: 'electric', unit, min, max, step }; } /* audyt (LOW): max < min zostaje — edytor to zgłasza (validateSpec), ciężary puste */
  return undefined;
}
