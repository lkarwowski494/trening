// Ładowanie modułów TypeScript aplikacji w zwykłym Node (bez Jesta i Metro) — dla skryptów, które muszą użyć DOKŁADNIE tego kodu i danych, co aplikacja
// (eksport dla strony z biblioteką ćwiczeń). Transpilacja w locie (typescript z node_modules), alias `@/` → korzeń repo, moduł natywny expo-crypto zastąpiony
// atrapą (potrzebny tylko do generowania id ćwiczeń użytkownika, których eksport nie używa). Nic nie jest zapisywane na dysku.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../..', import.meta.url));
const req = createRequire(import.meta.url);

/** Atrapy modułów natywnych (nazwa → eksporty). */
const STUBS = { 'expo-crypto': { randomUUID: () => '00000000-0000-4000-8000-000000000000' } };

let loaded = false;
/** Rejestruje obsługę *.ts i aliasu `@/` (raz na proces); zwraca `require` dla modułów aplikacji (ścieżki względem korzenia repo). */
export function appRequire() {
  const Module = req('node:module');
  if (!loaded) {
    loaded = true;
    const ts = req(join(root, 'node_modules/typescript'));
    const resolve = Module._resolveFilename, load = Module._load;
    Module._resolveFilename = function (request, ...rest) { return !(request in STUBS) && request.startsWith('@/') ? resolve.call(this, join(root, request.slice(2)), ...rest) : resolve.call(this, request, ...rest); };
    Module._load = function (request, ...rest) { return request in STUBS ? STUBS[request] : load.call(this, request, ...rest); };
    Module._extensions['.ts'] = (m, file) => {
      const js = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
      m._compile(js, file);
    };
  }
  return rel => req(join(root, rel));
}
export const repoRoot = root;
