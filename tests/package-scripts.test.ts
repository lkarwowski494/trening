/* M1-audytor-generalny-051 / L-008: każde polecenie z package.json należy do `verify` albo ma powód wyjątku;
   `lint` ma eslint w devDependencies i konfigurację, więc `expo lint` niczego nie doinstalowuje. */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const root = join(__dirname, '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const verify: string = pkg.scripts.verify;

/* Ręczne lub pomocnicze polecenia poza bramką — z powodem. */
const WYJATKI: Record<string, string> = {
  start: 'serwer deweloperski Expo (interaktywny)',
  ios: 'budowa natywna na macOS (interaktywna)',
  android: 'budowa natywna Android (poza zakresem)',
  screens: 'zrzuty ekranów do sklepu, ręcznie',
  mutation: 'testy mutacyjne, nocny job',
  perf: 'zestaw wydajnościowy, nocny job',
  'test:fast': 'szybki cykl w trakcie pracy, nie bramka',
  test: 'skrót do jest; verify woła jest bezpośrednio',
  prepare: 'hak pre-push (L-009): uruchamia go npm ci, nie bramka; instalator nigdy nie wywraca instalacji',
  'verify:docs': 'szybkie kontrole dla commitu tylko z dokumentami (decyzja 21.10.2026), nie bramka wydania',
};

describe('skrypty package.json (M1-051, L-008)', () => {
  test('eslint i konfiguracja są w repozytorium, żeby expo lint niczego nie doinstalowywał', () => {
    expect(pkg.devDependencies.eslint).toBeTruthy();
    expect(pkg.devDependencies['eslint-config-expo']).toBeTruthy();
    expect(existsSync(join(root, 'eslint.config.js'))).toBe(true);
    expect(pkg.scripts.lint).toBe('eslint .');
  });
  test('lint jest częścią verify', () => {
    expect(verify).toMatch(/npm run lint\b/);
  });
  test('każde polecenie jest w verify albo na liście wyjątków z powodem', () => {
    const bezDrogi = Object.keys(pkg.scripts).filter(
      n => n !== 'verify' && !verify.includes(`npm run ${n}`) && !(n in WYJATKI),
    );
    expect(bezDrogi).toEqual([]);
  });
  test('wyjątki nie zawierają poleceń, które nie istnieją ani są już w verify', () => {
    for (const n of Object.keys(WYJATKI)) {
      expect(pkg.scripts[n]).toBeTruthy();
      expect(verify.includes(`npm run ${n} `)).toBe(false);
    }
  });
});
