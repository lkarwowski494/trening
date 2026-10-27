/*
 * M1-audytor-generalny-022 (audyt 1.0, 27.10.2026; 01-odkrywanie-004/-005/-006/-009/-010/-011, 03-zakres-003/-004/-009): BRD (docs/brd) aktualny i pełny.
 * Strażniki: (1) usunięty ekran nie jest wymaganiem (BR-ZRO-001 wycofane, decyzja 25.10.2026), BR-JEZ-004 bez oznaczeń pewności (decyzja 23.10.2026);
 * (2) każda ścieżka pliku wskazana w BRD istnieje; (3) errata z wpisami ER. Rodzaje (docs/20): dane (dokument), regresja (strażnik).
 */
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'docs/brd');
const files = () => fs.readdirSync(DIR).filter(f => f.endsWith('.md')).sort();
const read = (f: string) => fs.readFileSync(path.join(DIR, f), 'utf8');
/** Sekcje wymagań: nagłówek `### BR-…` aż do następnego nagłówka poziomu 2 albo 3. */
function sections(): { id: string; file: string; text: string; withdrawn: boolean }[] {
  const out: { id: string; file: string; text: string; withdrawn: boolean }[] = [];
  for (const f of files()) {
    const lines = read(f).split('\n'); let cur: { id: string; file: string; text: string; withdrawn: boolean } | null = null;
    for (const l of lines) {
      const h = /^###\s+((?:BR|NFR)-[A-Z]{2,6}-\d{3})\b/.exec(l);
      if (h) { cur = { id: h[1], file: f, text: l, withdrawn: false }; out.push(cur); continue; }
      if (/^#{1,3}\s/.test(l)) { cur = null; continue; }
      if (cur) { cur.text += '\n' + l; if (/Status:\s*wycofane/i.test(l)) cur.withdrawn = true; }
    }
  }
  return out;
}
/** Ścieżki plików wskazane w tekście (z rozszerzeniem). */
const PATH = /(?:^|[\s(`„;,])((?:app|lib|components|tests|modules|scripts|docs|site|store|data|\.maestro)\/[\w/[\]().+@-]*\.(?:tsx?|mjs|js|json|md|ya?ml|html|storekit))(?![\w/])/g;

describe('M1-022: BRD aktualny wobec decyzji 20–27.10.2026', () => {
  test('BR-ZRO-001 wycofane (decyzja 25.10.2026), nazwa usuniętego ekranu tylko w jego nagłówku; ZP-09 bez ekranu źródeł', () => {
    const zro = sections().find(s => s.id === 'BR-ZRO-001')!; expect(zro.withdrawn).toBe(true); expect(zro.text).not.toMatch(/Scenariusz:/);
    for (const f of files()) read(f).split('\n').forEach((l, i) => { if (l.includes('Źródła wiedzy')) expect(`${f}:${i + 1} ${l}`).toMatch(/### BR-ZRO-001/); });
    const zp = read('odkrywanie.md'); const zp9 = zp.slice(zp.indexOf('### ZP-09'), zp.indexOf('## Ograniczenia'));
    expect(zp9).toMatch(/D-108/); expect(zp9).not.toMatch(/Ustawienia →/);
  });
  test('BR-JEZ-004 (decyzja 23.10.2026): interfejs bez oznaczeń pewności — wymaganie nie każe ich pokazywać', () => {
    const j = sections().find(s => s.id === 'BR-JEZ-004')!.text; expect(j).toMatch(/D-109/); expect(j).not.toMatch(/Wtedy tekst mówi o tym zwykłymi słowami/);
  });
  test('BR-JEZ-003: system miar (decyzja 20.10.2026) wdrożony; OP-02 zamknięte', () => {
    expect(sections().find(s => s.id === 'BR-JEZ-003')!.text).toMatch(/imperialny/); expect(read('README.md')).toMatch(/\| OP-02 \| Zamknięte/);
  });
  test('każda ścieżka pliku wskazana w BRD istnieje (usunięty ekran nie jest wskazywany jako dowód)', () => {
    const missing: string[] = [];
    for (const f of files()) read(f).split('\n').forEach((l, i) => { for (const m of l.matchAll(PATH)) if (!fs.existsSync(path.join(ROOT, m[1]))) missing.push(`${f}:${i + 1} ${m[1]}`); });
    expect(missing).toEqual([]);
  });
  test('errata: plik z tabelą ER (data, źródło, status)', () => {
    const e = read('errata.md'); expect(e).toMatch(/^\| ID \| Data \|/m); expect(e.match(/^\| ER-\d{2} \| \d{4}-\d\d-\d\d \|/gm)!.length).toBeGreaterThanOrEqual(5);
  });
});
