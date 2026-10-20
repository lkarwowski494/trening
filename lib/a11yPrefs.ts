import { AccessibilityInfo } from 'react-native';
import { useSyncExternalStore } from 'react';

/*
 * Ustawienia dostępności iOS, od których zależy wygląd (audyt M1, 20.10.2026):
 *  - „Pogrubiony tekst” (M1-audytor-generalny-024): własny krój (IBM Plex) nie reaguje na ustawienie systemu, więc przesuwamy każdą rolę o stopień
 *    grubości (lib/theme.ts F: 400→600, 600→700, Mono 500→600) — jak system, który dodaje wagę do tekstu;
 *  - „Zwiększ kontrast” (M1-audytor-generalny-031; w RN: AccessibilityInfo.isDarkerSystemColorsEnabled) — paleta o wyższym kontraście (lib/theme.ts lightHC / darkHC).
 * Jedno źródło stanu: moduł trzyma wartości, `useA11yPrefs()` (useSyncExternalStore) odświeża każdy komponent, który woła useTheme(); zmiana ustawienia w trakcie
 * działania aplikacji odświeża ekrany bez restartu. Odczyt początkowy i nasłuch: `initA11yPrefs()` (app/_layout.tsx, raz).
 */
export interface A11yPrefs { bold: boolean; contrast: boolean }
let prefs: A11yPrefs = { bold: false, contrast: false };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(l => l());
export const a11yPrefs = (): A11yPrefs => prefs;
export function setA11yPrefs(p: Partial<A11yPrefs>) {
  const next = { ...prefs, ...p }; if (next.bold === prefs.bold && next.contrast === prefs.contrast) return;
  prefs = next; emit();
}
export const boldTextOn = (): boolean => prefs.bold;
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
/** Odświeża komponent przy zmianie „Pogrubiony tekst” / „Zwiększ kontrast”; zwraca bieżące wartości. */
export function useA11yPrefs(): A11yPrefs { return useSyncExternalStore(subscribe, a11yPrefs, a11yPrefs); }

let started = false;
/** Odczyt początkowy i nasłuch zmian ustawień systemu; bez API (testy, web) — wartości domyślne. Idempotentne. */
export function initA11yPrefs(): () => void {
  if (started) return () => {}; started = true;
  const subs: { remove: () => void }[] = [];
  try {
    AccessibilityInfo.isBoldTextEnabled?.().then(v => setA11yPrefs({ bold: !!v })).catch(() => {});
    AccessibilityInfo.isDarkerSystemColorsEnabled?.().then(v => setA11yPrefs({ contrast: !!v })).catch(() => {});
    const a = AccessibilityInfo.addEventListener?.('boldTextChanged', v => setA11yPrefs({ bold: !!v })); if (a) subs.push(a);
    const b = AccessibilityInfo.addEventListener?.('darkerSystemColorsChanged', v => setA11yPrefs({ contrast: !!v })); if (b) subs.push(b);
  } catch { /* brak natywnego API (test / web) */ }
  return () => { subs.forEach(s => { try { s.remove(); } catch { /* */ } }); started = false; };
}
/** Tylko testy: powrót do wartości domyślnych i zapomnienie nasłuchu. */
export function __resetA11yPrefsForTests() { prefs = { bold: false, contrast: false }; started = false; listeners.clear(); }
