/*
 * Zrzuty do App Store, scenariusze scripts/ci/maestro-sklep: teksty aplikacji (przycisk, chip, podgląd) muszą być w języku zrzutu.
 * Przebieg 40861500739 (28.10.2026): w 17 z 18 języków brakowało 08-historia i 10-import, bo scenariusze czekały na „Pokaż wszystkie|Show all” i
 * „Wybierz plik CSV|Choose a CSV file” (tylko pl/en), a retry kalendarza po nieudanej asercji stukał „‹” jeszcze 3 razy (pusty miesiąc na zrzucie).
 * Reguła: tekst aplikacji w scenariuszu = zmienna ${NAZWA} z teksty.json (polski klucz słownika); skrypt przekazuje ją przez `-e` z teksty-<język>.json
 * (dane pokazowe: store-seed.test.ts, wartość z t() w danym języku). Literały dozwolone tylko dla okien systemowych (język symulatora) i etykiet niezależnych od języka.
 */
import { execFileSync } from 'child_process';
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { LANGS, applyLang, t } from '@/lib/i18n';

const root = join(__dirname, '..');
const dir = join(root, 'scripts/ci/maestro-sklep');
const TEKSTY: Record<string, string> = JSON.parse(readFileSync(join(dir, 'teksty.json'), 'utf8'));
const flows = readdirSync(dir).filter(f => f.endsWith('.yaml'));
/** Literały dozwolone w scenariuszach: okna systemowe (język symulatora: angielski), nazwa folderu aplikacji w Plikach, etykieta e1RM (taka sama we wszystkich językach), nazwa pliku CSV. */
const SYSTEMOWE = new Set(['Open', 'Don.t Allow', 'Browse|Recents|Cancel', 'Browse', 'On My iPhone', 'Trening|Training', 'e1RM', 'trening-historia, .*']);
/** Wskaźniki tekstu w kroku: `tapOn: "x"`, `visible: "x"`, `text: "x"`, `assertVisible: "x"`, `notVisible: "x"` (`id:` nie jest tekstem). */
function literaly(src: string): string[] {
  const out: string[] = [];
  for (const m of src.replace(/^\s*#.*$/gm, '').matchAll(/(?:tapOn|visible|notVisible|assertVisible|assertNotVisible|text)\s*:\s*"([^"]+)"/g)) out.push(m[1]);
  return out;
}

describe('maestro-sklep: teksty aplikacji z języka zrzutu', () => {
  test.each(flows)('%s: tekst aplikacji tylko jako ${ZMIENNA} z teksty.json, literały tylko systemowe', f => {
    const src = readFileSync(join(dir, f), 'utf8');
    for (const l of literaly(src)) {
      const vars = [...l.matchAll(/\$\{(\w+)\}/g)].map(m => m[1]);
      if (vars.length) { for (const v of vars) expect(Object.keys(TEKSTY)).toContain(v); continue; }
      expect(SYSTEMOWE).toContain(l);   // np. „Pokaż wszystkie|Show all” — tylko pl/en, w innych językach scenariusz pada
    }
  });
  test('każda zmienna z teksty.json jest użyta w scenariuszu', () => {
    const all = flows.map(f => readFileSync(join(dir, f), 'utf8')).join('\n');
    for (const v of Object.keys(TEKSTY)) expect(all).toContain('${' + v + '}');
  });
  test.each([...LANGS])('%s: każdy tekst ze scenariuszy ma w tym języku tłumaczenie widoczne w aplikacji', lng => {
    applyLang(lng);
    for (const [v, pl] of Object.entries(TEKSTY)) {
      const txt = t(pl);
      expect(txt.trim()).not.toBe('');
      if (lng !== 'pl') expect({ v, txt }).not.toEqual({ v, txt: pl });
    }
    applyLang('pl');
  });
});

describe('poprzedni-miesiac.yaml: stuknięcie „‹” tylko gdy miesiąc się nie zmienił', () => {
  const src = readFileSync(join(dir, 'poprzedni-miesiac.yaml'), 'utf8').replace(/^\s*#.*$/gm, '');
  test('w retry stuknięcie jest pod warunkiem notVisible (nieudana asercja nie cofa kalendarza wielokrotnie)', () => {
    const retry = src.slice(src.indexOf('retry:'));
    const tap = retry.indexOf('tapOn'); const when = retry.indexOf('notVisible');
    expect(when).toBeGreaterThan(-1); expect(tap).toBeGreaterThan(when);   // stuknięcie dopiero w commands warunku
    expect(retry).toMatch(/assertVisible:\s*"\$\{POKAZ_WSZYSTKIE\}"/);
  });
});

describe('store-screenshots.sh: przekazanie tekstów językowych do Maestro', () => {
  test('maestro dostaje -e ZMIENNA=tekst z teksty-<język>.json (znaki regex zakodowane)', () => {
    const d = mkdtempSync(join(tmpdir(), 'zrj-'));
    try {
      const bin = join(d, 'bin'); const data = join(d, 'data'); const app = join(d, 'app'); const out = join(d, 'out'); mkdirSync(bin); mkdirSync(data); mkdirSync(app);
      const stub = (n: string, body: string) => { writeFileSync(join(bin, n), `#!/bin/bash\n${body}\n`); chmodSync(join(bin, n), 0o755); };
      stub('sleep', 'exit 0');
      stub('xcrun', `case "$2" in get_app_container) echo "${app}";; esac; exit 0`);
      stub('maestro', `echo "$@" >> "${d}/args"; exit 0`);
      writeFileSync(join(data, 'routes-cs.json'), JSON.stringify([['import', '/more/import', 'jasny', 'import']]));
      writeFileSync(join(data, 'state-cs-jasny.json'), '{}'); writeFileSync(join(data, 'trening-historia.csv'), 'a');
      writeFileSync(join(data, 'teksty-cs.json'), JSON.stringify({ POKAZ_WSZYSTKIE: 'Zobrazit vše', WYBIERZ_CSV: 'Vybrat (soubor) CSV' }));
      execFileSync('bash', [join(root, 'scripts/ci/store-screenshots.sh'), 'UDID', out, data, 'cs'], { encoding: 'utf8', env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, EKRANY: '' } });
      const args = readFileSync(join(d, 'args'), 'utf8').split('\n').filter(l => /import\.yaml/.test(l))[0];
      expect(args).toContain('-e POKAZ_WSZYSTKIE=Zobrazit vše'); expect(args).toContain('-e WYBIERZ_CSV=Vybrat \\(soubor\\) CSV');
    } finally { rmSync(d, { recursive: true, force: true }); }
  });
  test('dane pokazowe zapisują teksty-<język>.json z teksty.json', () => {
    const seed = readFileSync(join(root, 'scripts/screens/store-seed.test.ts'), 'utf8');
    expect(seed).toMatch(/teksty-\$\{lng\}\.json/); expect(seed).toMatch(/maestro-sklep\/teksty\.json/);
  });
});
