// Manifest prywatności buildu (audyt M1-014, 20.10.2026; wcześniej NAT-04 tylko ostrzegał).
// Aplikacja używa interfejsów z czterech kategorii „required reason API”. Manifest zbiorczy powstaje przy `pod install` (React Native, „Privacy Manifest Aggregation”)
// z manifestów podów; ExpoFileSystem jest prekompilowany i jego manifest nie trafia do zbioru, więc brakuje DiskSpace. Ten skrypt:
//   --check  sprawdza, że każdy podany plik ma wszystkie wymagane kategorie (brak = kod 1, nazwa kategorii w komunikacie, bez ostrzeżeń);
//   --fix    dopisuje brakujące kategorie z powodami zgodnymi z manifestem modułu (node_modules/expo-file-system/ios/PrivacyInfo.xcprivacy), potem sprawdza.
// Użycie: node scripts/ci/ensure-privacy-manifest.mjs --check|--fix <plik.xcprivacy> [...]
import { readFileSync, writeFileSync } from 'node:fs';

/** Kategoria → powody użycia (kody Apple), dopisywane przy --fix. FileTimestamp, UserDefaults i SystemBootTime dokłada rdzeń React Native. */
export const REQUIRED = {
  NSPrivacyAccessedAPICategoryFileTimestamp: ['C617.1'],
  NSPrivacyAccessedAPICategoryUserDefaults: ['CA92.1'],
  NSPrivacyAccessedAPICategorySystemBootTime: ['35F9.1'],
  NSPrivacyAccessedAPICategoryDiskSpace: ['E174.1', '85F4.1'],
};
const KEY = '<key>NSPrivacyAccessedAPITypes</key>';
const [mode, ...files] = process.argv.slice(2);
if (!['--check', '--fix'].includes(mode) || !files.length) { console.error('Użycie: ensure-privacy-manifest.mjs --check|--fix <plik> [...]'); process.exit(2); }

function present(xml) { return Object.keys(REQUIRED).filter(c => xml.includes(`<string>${c}</string>`)); }
function fix(xml) {
  const k = xml.indexOf(KEY); if (k < 0) throw new Error('brak klucza NSPrivacyAccessedAPITypes');
  const have = present(xml); const add = Object.keys(REQUIRED).filter(c => !have.includes(c)); if (!add.length) return xml;
  const dict = add.map(c => `\t\t<dict>\n\t\t\t<key>NSPrivacyAccessedAPIType</key>\n\t\t\t<string>${c}</string>\n\t\t\t<key>NSPrivacyAccessedAPITypeReasons</key>\n\t\t\t<array>\n${REQUIRED[c].map(r => `\t\t\t\t<string>${r}</string>\n`).join('')}\t\t\t</array>\n\t\t</dict>\n`).join('');
  const rest = xml.slice(k + KEY.length); const m = /^\s*<array\s*\/>/.exec(rest);
  if (m) return xml.slice(0, k + KEY.length) + `\n\t<array>\n${dict}\t</array>` + rest.slice(m[0].length);
  const open = /^\s*<array>/.exec(rest); if (!open) throw new Error('NSPrivacyAccessedAPITypes nie jest tablicą');
  let depth = 1, i = open[0].length; const re = /<array>|<\/array>|<array\s*\/>/g; re.lastIndex = i; let t;
  while ((t = re.exec(rest))) { if (t[0] === '<array>') depth++; else if (t[0] === '</array>' && --depth === 0) { const at = k + KEY.length + t.index; const lineStart = xml.lastIndexOf('\n', at) + 1; return xml.slice(0, lineStart) + dict + xml.slice(lineStart); } }
  throw new Error('niedomknięta tablica NSPrivacyAccessedAPITypes');
}
let bad = 0;
for (const f of files) {
  try {
    let xml = readFileSync(f, 'utf8'); if (!/<plist[\s>]/.test(xml)) throw new Error('to nie jest plik plist w formacie XML');
    if (mode === '--fix') { const next = fix(xml); if (next !== xml) { writeFileSync(f, next); xml = next; console.log(`${f}: uzupełniono brakujące kategorie`); } }
    const missing = Object.keys(REQUIRED).filter(c => !present(xml).includes(c));
    if (missing.length) { bad++; console.error(`::error::${f}: manifest prywatności bez kategorii ${missing.join(', ')}`); } else console.log(`${f}: manifest prywatności OK (${Object.keys(REQUIRED).length} kategorie)`);
  } catch (e) { bad++; console.error(`::error::${f}: ${e.message}`); }
}
process.exit(bad ? 1 : 0);
