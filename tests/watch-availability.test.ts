/* Apple Watch: minimum watchOS 10, gest podwójnego stuknięcia od watchOS 11 (decyzja właściciela 14.10.2026, docs/35-zegarek-apple).
 * Kompilatora Swift na Linuksie nie ma, więc prosty skan źródeł: każde użycie API z watchOS 11 w `targets/watch-app` musi stać w gałęzi
 * `if #available(watchOS 11, *) { … }` albo w deklaracji z `@available(watchOS 11, *)`. Rodzaje (docs/20): logika skanera (przykłady dobre i złe),
 * dane (rzeczywiste źródła zegarka), konfiguracja (cel 10.0 w expo-target.config.js, zgodnie z verify:native). */
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.join(__dirname, '..', 'targets', 'watch-app');
/** API dostępne dopiero od watchOS 11 (SwiftUI i HealthKit). Lista celowo wąska — rozszerzać przy każdym nowym użyciu API z nowszego systemu. */
export const WATCHOS_11_API = ['handGestureShortcut', 'HandGestureShortcut', 'workoutEffortScore', 'estimatedWorkoutEffortScore', 'Previewable', 'ControlWidget', 'RelevanceConfiguration'];
const GUARD = /(?:#available|@available)\s*\(\s*watchOS\s+(?:1[1-9]|[2-9]\d)\b/;

const stripComments = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' ')).replace(/\/\/[^\n]*/g, m => ' '.repeat(m.length));

/** Użycia API z watchOS 11 poza osłoną (numer wiersza od 1 i nazwa). Osłona = którykolwiek otaczający blok ma w nagłówku (tekst od poprzedniego `{`, `}` albo `;`)
 * `#available(watchOS 11…` albo `@available(watchOS 11…`; gałąź `else` takiego `if` osłoną nie jest. */
export function unguardedWatchOS11(src: string): { line: number; api: string }[] {
  const code = stripComments(src); const out: { line: number; api: string }[] = [];
  const stack: boolean[] = []; let header = ''; let line = 1; let i = 0;
  const re = new RegExp(`\\b(${WATCHOS_11_API.join('|')})\\b`, 'y');
  while (i < code.length) {
    const c = code[i];
    if (c === '"') { const j = skipString(code, i); line += (code.slice(i, j).match(/\n/g) ?? []).length; header += ' '; i = j; continue; }
    if (c === '{') { stack.push(GUARD.test(header)); header = ''; i++; continue; }
    if (c === '}') { stack.pop(); header = ''; i++; continue; }
    if (c === ';') { header = ''; i++; continue; }
    if (c === '\n') line++;
    if (/[A-Za-z_]/.test(c) && (i === 0 || !/[\w.]/.test(code[i - 1]) || code[i - 1] === '.')) {
      re.lastIndex = i; const m = re.exec(code);
      if (m) { if (!stack.some(Boolean) && !GUARD.test(header)) out.push({ line, api: m[1] }); header += m[1]; i += m[1].length; continue; }
    }
    header += c; i++;
  }
  return out;
}
function skipString(code: string, i: number): number {
  if (code.startsWith('"""', i)) { const e = code.indexOf('"""', i + 3); return e < 0 ? code.length : e + 3; }
  let j = i + 1; while (j < code.length && code[j] !== '"' && code[j] !== '\n') j += code[j] === '\\' ? 2 : 1; return j + 1;
}

const swiftFiles = (d: string): string[] => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => (e.isDirectory() ? swiftFiles(path.join(d, e.name)) : e.name.endsWith('.swift') ? [path.join(d, e.name)] : []));

describe('skaner osłon watchOS 11 — przykłady', () => {
  test('użycie w if #available(watchOS 11, *) jest osłonięte, także w zagnieżdżonym bloku i w else-if', () => {
    expect(unguardedWatchOS11('struct M: ViewModifier { func body(content: Content) -> some View {\n if #available(watchOS 11, *) { content.handGestureShortcut(.primaryAction) } else { content }\n } }')).toEqual([]);
    expect(unguardedWatchOS11('func f() {\n if #available(watchOS 11, *) {\n  if x {\n   v.handGestureShortcut(.primaryAction)\n  }\n }\n}')).toEqual([]);
  });
  test('deklaracja z @available(watchOS 11, *) osłania całą zawartość', () => {
    expect(unguardedWatchOS11('@available(watchOS 11, *)\nstruct A: View {\n var body: some View { Button("x") {}.handGestureShortcut(.primaryAction) }\n}')).toEqual([]);
    expect(unguardedWatchOS11('@available(watchOS 12.0, *)\nfunc g() { _ = HKQuantityTypeIdentifier.workoutEffortScore }')).toEqual([]);
  });
  test('użycie bez osłony jest zgłaszane z numerem wiersza', () => {
    expect(unguardedWatchOS11('struct A: View {\n var body: some View {\n  Button("x") {}\n   .handGestureShortcut(.primaryAction)\n }\n}')).toEqual([{ line: 4, api: 'handGestureShortcut' }]);
  });
  test('gałąź else osłoniętego if NIE jest osłoną; osłona na watchOS 10 (#available(watchOS 10)) też nie', () => {
    expect(unguardedWatchOS11('if #available(watchOS 11, *) { a() } else { v.handGestureShortcut(.primaryAction) }')).toEqual([{ line: 1, api: 'handGestureShortcut' }]);
    expect(unguardedWatchOS11('if #available(watchOS 10, *) { v.handGestureShortcut(.primaryAction) }')).toEqual([{ line: 1, api: 'handGestureShortcut' }]);
  });
  test('osłona po zamknięciu bloku się kończy; komentarze i napisy nie są użyciem', () => {
    expect(unguardedWatchOS11('if #available(watchOS 11, *) { ok() }\nlet y = v.handGestureShortcut(.primaryAction)')).toEqual([{ line: 2, api: 'handGestureShortcut' }]);
    expect(unguardedWatchOS11('// handGestureShortcut(.primaryAction)\n/* HandGestureShortcut */ let s = "handGestureShortcut"')).toEqual([]);
  });
});

describe('źródła zegarka (targets/watch-app)', () => {
  const files = swiftFiles(ROOT);
  test('są pliki Swift do sprawdzenia i używają gestu podwójnego stuknięcia (inaczej skan nic nie pilnuje)', () => {
    expect(files.length).toBeGreaterThan(8);
    expect(files.some(f => fs.readFileSync(f, 'utf8').includes('handGestureShortcut'))).toBe(true);
  });
  test.each(files.map(f => [path.relative(ROOT, f), f]))('%s: każde API z watchOS 11 jest osłonięte', (_n, f) => {
    expect(unguardedWatchOS11(fs.readFileSync(f, 'utf8'))).toEqual([]);
  });
  test('Core (kompilowany też w pakiecie testów na macOS) nie używa SwiftUI ani WatchKit — nie ma tam API zegarka w ogóle', () => {
    for (const f of swiftFiles(path.join(ROOT, 'Core'))) expect([path.basename(f), /import\s+(SwiftUI|WatchKit)/.test(fs.readFileSync(f, 'utf8'))]).toEqual([path.basename(f), false]);
  });
});

test('minimum watchOS to 10.0 (expo-target.config.js; verify:native sprawdza WATCHOS_DEPLOYMENT_TARGET w projekcie)', () => {
  const cfg = fs.readFileSync(path.join(ROOT, 'expo-target.config.js'), 'utf8');
  expect(/deploymentTarget:\s*'10\.0'/.test(cfg)).toBe(true);
  expect(/WATCHOS_DEPLOYMENT_TARGET = 10\\\.0;/.test(fs.readFileSync(path.join(__dirname, '..', 'scripts', 'verify-native.mjs'), 'utf8'))).toBe(true);
});
