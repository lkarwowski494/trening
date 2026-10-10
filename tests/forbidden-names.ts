/*
 * TST2-08 / SEC2-05: wspólny moduł listy nazw innych aplikacji i marek (dane: tests/forbidden-names.json — jedno miejsce; ten plik nazw nie zawiera).
 * Używają go: tests/forbidden-names.test.ts (strażnik całego kodu), tests/audit-k1-brands.test.ts (słowniki i etykiety w 26 językach),
 * tests/owner-0510b.test.tsx (teksty interfejsu PL i EN).
 */
import * as fs from 'fs';
import * as path from 'path';

export const ROOT = path.join(__dirname, '..');
export const LIST_FILE = 'tests/forbidden-names.json';
export type Exc = { path: string; name: string; reason: string };
export const CFG: { scope: string[]; names: string[]; namesAnyCase: string[]; exceptions: Exc[] } = JSON.parse(fs.readFileSync(path.join(ROOT, LIST_FILE), 'utf8'));
export const ALL_NAMES: readonly string[] = [...CFG.names, ...CFG.namesAnyCase];
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** Całe słowo z polską końcówką fleksyjną; nie wewnątrz innego słowa (litera, cyfra albo „_” obok — np. id presetu z nazwą małymi literami i podkreślnikiem). */
const wordRe = (n: string, flags: string) => new RegExp(`(?<![\\p{L}\\p{N}_])${esc(n)}(?:a|u|ie|iem|owi|y|ów|em|ach)?(?![\\p{L}\\p{N}_])`, flags);
export const MATCHERS: readonly { n: string; re: RegExp }[] = [...CFG.names.map(n => ({ n, re: wordRe(n, 'u') })), ...CFG.namesAnyCase.map(n => ({ n, re: wordRe(n, 'iu') }))];
/** Nazwy z listy obecne w tekście. */
export const namesIn = (s: string): string[] => MATCHERS.filter(x => x.re.test(s)).map(x => x.n);
const under = (f: string, p: string) => f === p || f.startsWith(p.replace(/\/?$/, '/'));
/** Wyjątek obejmujący nazwę w pliku (ścieżka pliku albo katalogu; nazwa „*” — wszystkie, dla plików przenoszonych w całości poza repo). */
export const exceptionFor = (f: string, n: string): Exc | undefined => CFG.exceptions.find(x => (x.name === n || x.name === '*') && under(f, x.path));
/** Nazwy zakazane w pliku `f` (bez tych z wyjątkiem dla niego). */
export const forbiddenIn = (f: string, s: string): string[] => namesIn(s).filter(n => !exceptionFor(f, n));
export const inScope = (p: string) => CFG.scope.some(s => under(p, s));

const TEXT = /\.(ts|tsx|js|mjs|cjs|json|ya?ml|py|sh|swift|m|mm|h|html|md|txt|plist|strings|xml|css)$/;
const SKIP_DIR = new Set(['node_modules', '.expo', 'ios', 'android', '.stryker-tmp', 'dist']);
function files(rel: string): string[] {
  const abs = path.join(ROOT, rel); if (!fs.existsSync(abs)) return [];
  if (fs.statSync(abs).isFile()) return [rel];
  return fs.readdirSync(abs, { withFileTypes: true }).flatMap(e => e.isDirectory() ? (SKIP_DIR.has(e.name) ? [] : files(path.join(rel, e.name))) : TEXT.test(e.name) ? [path.join(rel, e.name)] : []);
}
/** Wszystkie trafienia w zakresie (plik, linia, nazwa) — także te objęte wyjątkiem. */
export function scan(): { f: string; line: number; n: string }[] {
  const hits: { f: string; line: number; n: string }[] = [];
  for (const f of CFG.scope.flatMap(files)) {
    if (f === LIST_FILE) continue;
    fs.readFileSync(path.join(ROOT, f), 'utf8').split('\n').forEach((l, i) => { for (const n of namesIn(l)) hits.push({ f, line: i + 1, n }); });
  }
  return hits;
}
