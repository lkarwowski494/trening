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
  test('każdy ekran (trasa w app/) ma aktywne wymaganie BR, które go wskazuje; nowa trasa bez BR zatrzymuje verify (03-zakres-003)', () => {
    /* trasy techniczne bez działania użytkownika: układy nawigacji, ekran „nie znaleziono”, mapa tras, menu „Więcej” (lista przejść) */
    const TECH = new Set(['app/_layout.tsx', 'app/(tabs)/_layout.tsx', 'app/+not-found.tsx', 'app/_sitemap.tsx', 'app/(tabs)/more.tsx']);
    const walk = (d: string): string[] => fs.readdirSync(path.join(ROOT, d)).flatMap(n => { const r = `${d}/${n}`; return fs.statSync(path.join(ROOT, r)).isDirectory() ? walk(r) : /\.tsx$/.test(n) ? [r] : []; });
    const active = sections().filter(s => !s.withdrawn).map(s => s.text).join('\n');
    expect(walk('app').filter(r => !TECH.has(r) && !active.includes(r))).toEqual([]);
  });
  test('funkcje z audytu 27.10.2026 (01-odkrywanie-004, 03-zakres-003, M1-018) mają aktywne BR z kryteriami', () => {
    const s = sections().filter(x => !x.withdrawn); const has = (id: string, re: RegExp) => expect([id, re.test(s.find(x => x.id === id)?.text ?? '')]).toEqual([id, true]);
    has('BR-DAN-006', /Wyczyść wszystkie dane/); has('BR-HIS-002', /app\/history\/add\.tsx/); has('BR-HIS-003', /app\/history\/edit\/\[id\]\.tsx/);
    has('BR-DAN-007', /app\/more\/import\.tsx/); has('BR-DAN-008', /exportCsv/); has('BR-DAN-009', /autoBackup/); has('BR-PLN-004', /lib\/planReminder\.ts/);
    has('BR-ZAK-004', /components\/FairRulesSheet\.tsx/); has('BR-ZAK-005', /components\/ImportProCard\.tsx/); has('BR-ZAK-006', /Przywróć zakupy/);
    has('BR-ZAK-007', /tests\/audit-m1-2026-10-27-018-jedno-okno\.test\.tsx/); has('BR-KON-001', /lib\/review\.ts/); has('BR-KON-002', /Napisz do nas/);
    has('BR-KON-003', /Poproś o nową funkcję/); has('BR-PST-006', /app\/more\/bodymass\.tsx/); has('BR-MJS-003', /app\/more\/bands\.tsx/); has('BR-TRN-012', /app\/reorder\.tsx/);
    has('BR-POM-002', /app\/guide\.tsx/); has('BR-POM-001', /Pierwsze kroki/); has('BR-PST-007', /lib\/guard\.ts/); has('BR-PLN-005', /markDoneEarly/);
    has('BR-TRN-013', /⇅ SS/); has('BR-UST-002', /Ekran włączony/); has('BR-SZB-002', /Zapisz zmiany w szablonie/);
    for (const x of s.filter(y => y.file === 'wymagania-uzupelnienie.md')) expect([x.id, /Scenariusz:/.test(x.text) && /Wtedy /.test(x.text)]).toEqual([x.id, true]);
  });
  test('ograniczenia OG (01-odkrywanie-010): każde OG ma źródło S z adresem, cytatem i datą odczytu albo jest nazwaną zasadą właściciela; S polityk mają termin przeglądu', () => {
    const o = read('odkrywanie.md'); const og = o.slice(o.indexOf('## Ograniczenia')).split(/^### /m).slice(1);
    expect(og.length).toBeGreaterThanOrEqual(10);
    for (const x of og) expect([x.slice(0, 5), /\[FAKT S-\d\d\]/.test(x) || /Zasada właściciela/.test(x)]).toEqual([x.slice(0, 5), true]);
    for (const n of ['3.1.1', '3.1.2(b)', '3.1.2(c)', '2.3.2', '5.1.3(i)', '5.1.3(ii)', '5.6.1']) expect(read('zrodla.md')).toMatch(new RegExp(`punkt ${n.replace(/[().]/g, '\\$&')} .*\\| \\d{4}-\\d\\d-\\d\\d \\| 1 \\| \\d{4}-\\d\\d-\\d\\d \\|`));
  });
  test('errata: plik z tabelą ER (data, źródło, status)', () => {
    const e = read('errata.md'); expect(e).toMatch(/^\| ID \| Data \|/m); expect(e.match(/^\| ER-\d{2} \| \d{4}-\d\d-\d\d \|/gm)!.length).toBeGreaterThanOrEqual(5);
  });
});
