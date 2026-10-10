/** Numerowanie wersji (decyzja właściciela 09.10.2026, wariant A, docs/18): „<wersja> (<build>)”, np. „0.11.0 (1005)”. Build wpisuje CI
 * (testflight.yml → EXPO_PUBLIC_BUILD_NUMBER, ta sama liczba co CFBundleVersion); poza buildem z CI — sama wersja. */
export function versionLabel(version: string | undefined, build: string | undefined): string {
  const v = version || '—'; const b = (build ?? '').trim();
  return /^\d+$/.test(b) ? `${v} (${b})` : v;
}
/** Numer buildu z CI (inlinowany przez Metro przy budowaniu paczki JS); poza CI pusty. */
export const BUILD_NUMBER: string | undefined = process.env.EXPO_PUBLIC_BUILD_NUMBER;
