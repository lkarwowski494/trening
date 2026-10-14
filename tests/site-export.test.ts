/* Eksport stron aplikacji na apps4brew.com/trening/ (decyzja właściciela 14.10.2026, D-2 A — docs/41): scripts/site/export-apps4brew.mjs
 * przenosi treść site/privacy.html i site/support.html (źródło sprawdzane testami zgodności z kodem) do szablonu strony marki. */
import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const root = path.join(__dirname, '..');
const out = fs.mkdtempSync(path.join(os.tmpdir(), 'a4b-'));
const log = execFileSync('node', [path.join(root, 'scripts/site/export-apps4brew.mjs'), out], { encoding: 'utf8' });
const read = (n: string) => fs.readFileSync(path.join(out, 'trening', n), 'utf8');
const body = (s: string) => s.replace(/<!--[\s\S]*?-->/g, '');

describe('scripts/site/export-apps4brew.mjs', () => {
  test('zapisuje trening/privacy.html i trening/support.html', () => { expect(log.trim().split('\n')).toEqual(['trening/privacy.html', 'trening/support.html']); });
  test.each(['privacy.html', 'support.html'])('%s: jeden h1, sekcje PL i EN, szablon marki (../assets), znacznik „wygenerowane” i uwaga o skrzynce po DSA', (n) => {
    const s = read(n);
    expect((s.match(/<h1[\s>]/g) || []).length).toBe(1);
    expect(s).toContain('<section lang="pl" data-lang-section="pl">'); expect(s).toContain('<section lang="en" data-lang-section="en">');
    for (const w of ['href="../assets/site.css"', 'src="../assets/site.js"', 'class="logo" href="../"', 'WYGENEROWANE z repozytorium aplikacji Trening', '[UWAGA 14.10.2026] Skrzynka support@apps4brew.com działa dopiero po weryfikacji DSA']) expect(s).toContain(w);
    expect(body(s)).not.toMatch(/github\.(com|io)/); expect(s).toContain('href="mailto:support@apps4brew.com"');
  });
  test('treść = źródło: każdy nagłówek h2/h3 i akapit „Obowiązuje od” z site/ jest w eksporcie (bez akapitu o GitHub Issues)', () => {
    for (const n of ['privacy.html', 'support.html']) {
      const src = fs.readFileSync(path.join(root, 'site', n), 'utf8'); const s = read(n);
      for (const h of src.match(/<h[23]>[^<]+<\/h[23]>/g) || []) expect({ n, h, ok: s.includes(h) }).toEqual({ n, h, ok: true });
    }
    expect(read('privacy.html')).toContain('Obowiązuje od 14 października 2026 r.'); expect(read('privacy.html')).toContain('<h2>Apple Watch (opcjonalnie)</h2>');
    expect(read('support.html')).not.toContain('GitHub Issues');
    expect(body(read('privacy.html'))).not.toContain('DO WERYFIKACJI');
  });
});
