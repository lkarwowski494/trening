/*
 * Zrzuty sklepu: wejście `powtorz` przy uzupełnianiu z poprzedniego przebiegu (przegląd 29.10.2026: hu/01-trening z banerem przerwy
 * i uciętą plakietką — do powtórki, a uzupełnianie skopiowałoby stary plik). Rodzaje (docs/20): logika, regresja.
 */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { spawnSync } from 'child_process';

const SCRIPT = path.join(__dirname, '..', 'scripts/ci/store-powtorz.mjs');
// skrypt .mjs uruchamiany jak w workflow (Jest nie ładuje modułów ES)
function powtorz(dir: string, list: string): string[] {
  const r = spawnSync('node', [SCRIPT, dir, list], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(r.stderr);
  const m = /usunięte z uzupełnienia\): (.*)/.exec(r.stdout);
  return m ? m[1].split(', ') : [];
}

const wf = fs.readFileSync(path.join(__dirname, '..', '.github/workflows/store-screenshots.yml'), 'utf8');

function tmp() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'powtorz-'));
  for (const f of ['6.9/hu/01-trening.png', '6.9/hu/02-cwiczenie.png', '6.9/ja/01-trening.png']) {
    fs.mkdirSync(path.dirname(path.join(d, f)), { recursive: true }); fs.writeFileSync(path.join(d, f), 'x');
  }
  return d;
}

describe('store-powtorz: ekrany do powtórzenia mimo uzupełniania', () => {
  test('usuwa tylko wskazane pary język/ekran', () => {
    const d = tmp();
    expect(powtorz(d, 'hu/01-trening')).toEqual([path.join('6.9', 'hu', '01-trening.png')]);
    expect(fs.existsSync(path.join(d, '6.9/hu/01-trening.png'))).toBe(false);
    expect(fs.existsSync(path.join(d, '6.9/hu/02-cwiczenie.png'))).toBe(true);
    expect(fs.existsSync(path.join(d, '6.9/ja/01-trening.png'))).toBe(true);
  });
  test('pusta lista i brak katalogu — nic nie robi', () => {
    const d = tmp();
    expect(powtorz(d, '')).toEqual([]);
    expect(powtorz(path.join(d, 'brak'), 'hu/01-trening')).toEqual([]);
  });
  test('zły wpis — błąd zamiast cichego pominięcia', () => {
    expect(() => powtorz(tmp(), 'hu/trening')).toThrow(/Zły wpis/);
  });
  test('workflow: wejście powtorz i krok w zadaniach dane i zrzuty, tylko przy uzupelnij_z_przebiegu', () => {
    expect(wf).toMatch(/\n {6}powtorz:\n/);
    const steps = wf.split('store-powtorz.mjs uzupelnij').length - 1;
    expect(steps).toBe(2);
    expect(wf).toMatch(/if: inputs\.uzupelnij_z_przebiegu != '' && inputs\.powtorz != ''/);
  });
});
