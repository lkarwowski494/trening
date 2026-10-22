/*
 * L-016 (decyzja właściciela 21.10.2026): numery lekcji nadaje koordynator przy scalaniu — scripts/numeruj-lekcje.mjs.
 */
import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const skrypt = path.join(__dirname, '..', 'scripts', 'numeruj-lekcje.mjs');
const uruchom = (tekst: string, ...args: string[]) => {
  const plik = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'lekcje-')), '40.md');
  fs.writeFileSync(plik, tekst);
  let kod = 0;
  try { execFileSync('node', [skrypt, plik, ...args], { stdio: 'pipe' }); } catch (e) { kod = (e as { status: number }).status; }
  return { kod, wynik: fs.readFileSync(plik, 'utf8') };
};
const doc = '# Lekcje\n\n## L-NNN (B) — nowsza\nb\n\n## L-NNN (A) — starsza\na\n\n## L-002 (x) — druga\n\n## L-001 (x) — pierwsza\n';

describe('scripts/numeruj-lekcje.mjs', () => {
  test('nadaje kolejne wolne numery, najwyższy najnowszej (najwyżej w pliku)', () => {
    const { kod, wynik } = uruchom(doc);
    expect(kod).toBe(0);
    expect([...wynik.matchAll(/^## L-(\d{3}) \((\w)\)/gm)].map((m) => `${m[1]}${m[2]}`)).toEqual(['004B', '003A', '002x', '001x']);
  });
  test('--sprawdz: kod 1 przy nienumerowanych, nic nie zmienia; kod 0 po numeracji', () => {
    const przed = uruchom(doc, '--sprawdz');
    expect(przed.kod).toBe(1); expect(przed.wynik).toBe(doc);
    expect(uruchom(uruchom(doc).wynik, '--sprawdz').kod).toBe(0);
  });
  test('plik bez lekcji roboczych zostaje bez zmian', () => {
    const czysty = '## L-001 (x) — jedyna\n';
    expect(uruchom(czysty).wynik).toBe(czysty);
  });
});
