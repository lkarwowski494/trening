// Przebieg „zmiana-czasu” (tests-tz.yml, PIN_NOW): pliki testów, które same ustawiają zegar (jest.useFakeTimers({ now … }) albo setSystemTime), nie zależą od zegara
// maszyny — przypięcie „teraz” niczego w nich nie sprawdza i miesza się z ich fałszywym zegarem. Skrypt wypisuje wyrażenie regularne dla --testPathIgnorePatterns.
// Użycie: npx jest --testPathIgnorePatterns "$(node scripts/ci/pin-wykluczenia.mjs)"
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const WLASNY_ZEGAR = /useFakeTimers\(\{[^}]*\bnow\b|setSystemTime/;
export function pliki(dir) { return readdirSync(dir).filter(f => /\.test\.tsx?$/.test(f) && WLASNY_ZEGAR.test(readFileSync(join(dir, f), 'utf8'))); }

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dir = resolve(dirname(fileURLToPath(import.meta.url)), '../../tests');
  console.log(pliki(dir).map(f => `/tests/${f.replace(/\./g, '\\.')}$`).join('|'));
}
