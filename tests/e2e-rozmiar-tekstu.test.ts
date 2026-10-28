/* Duży tekst dostępności w E2E (T-04, 27.10.2026): wejście `rozmiar_tekstu` w e2e-ios.yml ustawia rozmiar tekstu systemu symulatora w obu miejscach startu
 * symulatora (części pakietu i zadanie aktualizacji/pojedyncze), a scenariusz 58 robi zrzuty ekranu Trening w trzech stanach. */
import * as fs from 'fs';
import * as path from 'path';

const root = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');
const wf = read('.github/workflows/e2e-ios.yml');

describe('wejście rozmiar_tekstu w e2e-ios.yml', () => {
  test('jest w workflow_dispatch i workflow_call, opcjonalne, domyślnie puste', () => {
    expect(wf).toMatch(/\n      rozmiar_tekstu:\n        description: [^\n]*content_size[^\n]*\n        required: false\n        default: ''\n/);
    expect(wf).toMatch(/\n      rozmiar_tekstu: \{ type: string, required: false, default: '' \}\n/);
  });
  test('w każdym miejscu startu symulatora (po kroku z „wyglad”) ustawia content_size tylko gdy wejście niepuste, przez zmienną środowiskową', () => {
    const ui = wf.match(/\[ "\$WYGLAD" = dark \]/g) || [];
    const cs = wf.match(/\[ -z "\$ROZMIAR_TEKSTU" \] \|\| xcrun simctl ui "\$DEV" content_size "\$ROZMIAR_TEKSTU"/g) || [];
    expect(ui.length).toBe(2); expect(cs.length).toBe(2);
    expect((wf.match(/ROZMIAR_TEKSTU: \$\{\{ inputs\.rozmiar_tekstu \}\}/g) || []).length).toBe(2);
    expect(wf).not.toMatch(/content_size "\$\{\{/); // bez wstrzykiwania wejścia do skryptu
  });
});

describe('scenariusz 58 — duży tekst', () => {
  const src = read('.maestro/58-duzy-tekst.yaml');
  test('zrzuty: bez planu, z planem i trening w toku', () => {
    for (const s of ['580-bez-planu-gora', '583-z-planem-gora', '586-trening-w-toku']) expect(src).toContain(`takeScreenshot: ${s}`);
  });
});
