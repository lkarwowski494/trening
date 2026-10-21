/*
 * Strażnik pętli awarii przy starcie (M1-audytor-generalny-003). Licznik kolejnych uruchomień, w których pierwszy ekran nie dotrwał do „kamienia”
 * (BOOT_STABLE_MS po zamontowaniu aplikacji), trzyma mały klucz kv. Drugi z rzędu start bez „kamienia” (próg CRASH_LOOP_THRESHOLD) jest awaryjny:
 * init() nie ładuje ani nie zmienia danych, tylko zatrzymuje się na ekranie z wysłaniem danych i ponowieniem — aplikacja nie zamyka się przy każdym starcie.
 * Czysta logika (decideBoot, parseBootGuard) jest testowana na wektorach; zapis i odczyt: lib/state/boot.ts.
 * Zależy od: —
 */
/** Ile kolejnych uruchomień bez „kamienia” (łącznie z bieżącym) uruchamia tryb awaryjny. */
export const CRASH_LOOP_THRESHOLD = 2;
/** „Kamień”: tyle ms po zamontowaniu aplikacji (albo wcześniej — przy wyjściu do tła) start uznajemy za udany. */
export const BOOT_STABLE_MS = 1500;
/** Klucz kv z licznikiem. */
export const BOOT_GUARD_KEY = 'bootguard';
const GUARD_MAX = 100;

export interface BootGuard { starts: number }
export type BootMode = 'normal' | 'safe';

/** Zapis z bazy -> stan; brak, nie-JSON i złe wartości dają stan początkowy (start normalny). */
export function parseBootGuard(raw: string | null | undefined): BootGuard {
  if (!raw) return { starts: 0 };
  try {
    const n = Number((JSON.parse(raw) as { starts?: unknown } | null)?.starts);
    return { starts: Number.isFinite(n) && n > 0 ? Math.min(GUARD_MAX, Math.floor(n)) : 0 };
  } catch { return { starts: 0 }; }
}
/** Decyzja przy starcie: `prev.starts` = poprzednie uruchomienia bez „kamienia”; zwraca tryb bieżącego startu i stan do zapisania. */
export function decideBoot(prev: BootGuard): { mode: BootMode; next: BootGuard } {
  const starts = prev.starts + 1;
  return { mode: starts >= CRASH_LOOP_THRESHOLD ? 'safe' : 'normal', next: { starts: Math.min(GUARD_MAX, starts) } };
}
