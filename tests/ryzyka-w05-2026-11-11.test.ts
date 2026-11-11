/*
 * W-05 (docs/49, 11.11.2026, sesja M): zamknięcie ryzyk R-11-01 i R-018 (docs/40 „Rejestr ryzyk”) pilnowane testem, żeby stan, na którym je zamknięto, nie cofnął się
 * przed wydaniem 1.1 bez sygnału.
 * - R-11-01: opis i notatki sklepu mówią o animowanych rysunkach odmian przysiadu, wyciskania leżąc i martwego ciągu — warunek zamknięcia: figura v2 w aplikacji ≥ 87
 *   oraz rodziny squat, bench_press, hinge gotowe i zrecenzowane (liczby z tests/fixtures/pokrycie-katalogu.json; jego zgodność z kodem pilnuje
 *   `npm run check:pokrycie`, scripts/pokrycie-katalogu.mjs --check).
 * - R-018: zegarek Garmin przeniesiony do 1.2 (właściciel 03.11.2026 ~21:20 PL, docs/18) — wydanie 1.1 nie zawiera SDK Connect IQ (zależności, wtyczki, moduły, cele natywne).
 */
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.join(__dirname, '..');
const pokrycie = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests/fixtures/pokrycie-katalogu.json'), 'utf8')) as {
  razem: { figura: { v2: number } };
  rodziny: Record<string, { status: string; figuraV2: number; recenzja: number; cwiczen: number }>;
};

describe('R-11-01 (zamknięte 11.11.2026): rysunki opisane w sklepie są w aplikacji', () => {
  test('figura v2 w aplikacji ≥ 87 (warunek zamknięcia z docs/40)', () => {
    expect(pokrycie.razem.figura.v2).toBeGreaterThanOrEqual(87);
  });
  test.each(['squat', 'bench_press', 'hinge'])('rodzina %s gotowa, każda wyświetlana figura v2 ma aktualną recenzję', (r) => {
    const f = pokrycie.rodziny[r];
    expect(f.status).toBe('ready');
    expect(f.figuraV2).toBeGreaterThan(0);
    expect(f.recenzja).toBe(f.figuraV2);
  });
});

describe('R-018 (odroczone 03.11.2026 → 1.2): wydanie 1.1 bez SDK Connect IQ', () => {
  /* Użycie SDK, nie wzmianka w komentarzu (modules/watch-link/transport.ts opisuje Connect IQ jako przyszły transport): import, require, pod, klasy SDK. */
  const SDK = /import\s+ConnectIQ\b|from\s+['"][^'"]*connect-?iq|require\(\s*['"][^'"]*connect-?iq|pod\s+['"]ConnectIQ|\bConnectIQ\.|\bIQDevice\b|\bIQApp\b/i;
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')) as Record<string, Record<string, string> | undefined>;
  test('package.json: żadna zależność Connect IQ', () => {
    const zal = ['dependencies', 'devDependencies', 'optionalDependencies'].flatMap((k) => Object.keys(pkg[k] ?? {}));
    expect(zal.filter((n) => /connect-?iq|garmin/i.test(n))).toEqual([]);
  });
  const pliki = (dir: string): string[] => !fs.existsSync(dir) ? [] : fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === 'node_modules' || e.name.startsWith('.') ? [] : pliki(p);
    return /\.(ts|tsx|js|mjs|cjs|json|swift|m|mm|h|rb|plist|podspec|gradle|kt|java)$/.test(e.name) ? [p] : [];
  });
  test('app.json i kod natywny (plugins, modules, targets) nie używają SDK Connect IQ', () => {
    const znalezione = [path.join(ROOT, 'app.json'), ...['plugins', 'modules', 'targets'].flatMap((d) => pliki(path.join(ROOT, d)))]
      .filter((p) => SDK.test(fs.readFileSync(p, 'utf8'))).map((p) => path.relative(ROOT, p));
    expect(znalezione).toEqual([]);
  });
});
