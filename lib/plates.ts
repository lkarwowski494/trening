import { KG_PER_LB, fmtNum } from './units';
import type { LoadSpec, LoadUnit } from './loads';

/*
 * Talerze „co nałożyć na stronę” (styl „Tuleja”, decyzja właściciela 07.10.2026; docs/21 pkt 6). Jedno źródło kolorów talerzy w aplikacji.
 * Kolory: IWF Technical and Competition Rules & Regulations, pkt 3.3.3.6 „Competition discs” (wyd. 2019, kopia PZPC:
 * https://pzpc.pl/download/file/3354): 25 kg czerwony, 20 niebieski, 15 żółty, 10 zielony, 5 biały; talerze zmiany ciężaru 2,5 czerwony,
 * 2 niebieski, 1,5 żółty, 1 zielony, 0,5 biały. IPF Technical Rules 2026, rozdz. 2.3(b)6 — tylko 25/20/15 (te same kolory).
 * Wydanie IWF 2025 nieprzeczytane (docs/21: [NIEZWERYFIKOWANE]). Talerze w funtach i inne rozmiary — bez koloru (szare): kod barw dotyczy kg.
 * Kolor nigdy nie jest jedyną informacją (WCAG 1.4.1): na każdym talerzu jest liczba, a VoiceOver czyta listę talerzy.
 */
export const PLATE_COLORS = { red: '#D7263D', blue: '#1F5FD1', yellow: '#F2C230', green: '#2E9E5B', white: '#FFFFFF' } as const;
export type PlateColor = keyof typeof PLATE_COLORS;
/** Kod barw IWF (kg → kolor), pkt 3.3.3.6. Klucz = waga w gramach (bez błędów zmiennoprzecinkowych). */
export const IWF_DISC: Readonly<Record<number, PlateColor>> = { 25000: 'red', 20000: 'blue', 15000: 'yellow', 10000: 'green', 5000: 'white', 2500: 'red', 2000: 'blue', 1500: 'yellow', 1000: 'green', 500: 'white' };
/** Kolor talerza wg IWF albo null (talerz w lb albo rozmiar spoza kodu, np. 1,25 kg). */
export function plateColor(w: number, unit: LoadUnit): PlateColor | null {
  if (unit !== 'kg' || !Number.isFinite(w)) return null; return IWF_DISC[Math.round(w * 1000)] ?? null;
}
/** Liczba na talerzu: biała na czerwonym i niebieskim, ciemna na żółtym, zielonym i białym — kontrast ≥ 4,5 (tests/tuleja.test.tsx).
 * Znalezisko testu 07.10.2026: biała liczba na zielonym #2E9E5B miała 3,4:1 — ciemna ma 5,3:1 (kolor talerza bez zmian). */
export const plateInk = (c: PlateColor): string => c === 'red' || c === 'blue' ? '#FFFFFF' : '#15171A';
/** Talerze jasne (biały, żółty) — z obwódką: na jasnym tle sam kolor ledwo odcina się od tła (WCAG 1.4.11, grafika ≥ 3:1). */
export const plateOutlined = (c: PlateColor | null): boolean => c == null || c === 'white' || c === 'yellow';

export interface PlatePlan { unit: LoadUnit; base: number; plates: number[] }
/** Tolerancja dopasowania w jednostce sprzętu: ciężar zapisany w kg na siatce 0,01 (lb przyciągane do „okrągłych” kg). */
const TOL: Record<LoadUnit, number> = { kg: 0.006, lb: 0.06 };
/**
 * Talerze na JEDNĄ stronę dla ciężaru całkowitego `totalKg` z opisu „gryf + talerze” (lib/loads.ts, kind 'plates'): base + 2·Σ talerzy.
 * Dostępne sztuki talerza na stronę = ⌊n/2⌋. Wynik malejąco; spośród możliwych układów — najmniej talerzy (przeszukiwanie od największych,
 * z nawrotami, więc ograniczone talerze nie dają błędnej odpowiedzi jak zachłanne dobieranie). null = ciężaru nie da się ułożyć
 * (mniej niż gryf, za dużo albo brak pasujących talerzy). Opis innego rodzaju niż talerze — null.
 */
export function platesPerSide(totalKg: number, spec: LoadSpec | null | undefined): PlatePlan | null {
  if (!spec || spec.kind !== 'plates' || !Number.isFinite(totalKg) || totalKg <= 0) return null;
  const total = spec.unit === 'lb' ? totalKg / KG_PER_LB : totalKg; const tol = TOL[spec.unit];
  const side = (total - spec.base) / 2; if (side < -tol) return null;
  if (Math.abs(side) <= tol) return { unit: spec.unit, base: spec.base, plates: [] };
  const kinds = spec.plates.filter(p => p.w > 0 && Number.isFinite(p.w) && Math.floor(p.n / 2) > 0).map(p => ({ w: p.w, k: Math.floor(p.n / 2) })).sort((a, b) => b.w - a.w);
  let best: number[] | null = null; const cur: number[] = []; let steps = 0;
  const go = (i: number, left: number) => {
    if (++steps > 20000) return; /* ograniczenie pracy — opis ma limit 30 rodzajów talerzy (LOAD_LIMITS.plateRows) */
    if (Math.abs(left) <= tol) { if (!best || cur.length < best.length) best = [...cur]; return; }
    if (i >= kinds.length || left < -tol || (best && cur.length >= best.length - 1)) return;
    const { w, k } = kinds[i];
    for (let c = Math.min(k, Math.floor((left + tol) / w)); c >= 0; c--) { for (let j = 0; j < c; j++) cur.push(w); go(i + 1, left - c * w); cur.length -= c; }
  };
  go(0, side);
  return best ? { unit: spec.unit, base: spec.base, plates: best } : null;
}
/** „25 + 5” (liczby w jednostce opisu sprzętu, przecinek wg języka); pusty napis, gdy bez talerzy (ekran pisze wtedy „sam gryf”). */
export const plateList = (p: PlatePlan): string => p.plates.map(w => fmtNum(w, 2)).join(' + ');
