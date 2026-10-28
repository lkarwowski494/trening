/* 28.10.2026 [M1-audytor-generalny-031; 09-lokalizacja-007]: walidator `npm run check:i18n` (scripts/check-i18n.mjs) widział tylko t('…') w apostrofach
 * i tylko słownik EN, a pismo języka zastępował test „liter polskich” w obcych słownikach (wzorce roli lokalizacji: „czego nie przywracać”).
 * Test uruchamia kopię skryptu na próbce projektu (katalog tymczasowy z app/, lib/i18n.en.ts, lib/locales/): każde wywołanie w dowolnym zapisie
 * bez wpisu w słowniku jest błędem, słownik języka spoza łaciny z tekstem łacinką — też; na repozytorium skrypt przechodzi. */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { spawnSync } from 'child_process';

const ROOT = path.join(__dirname, '..');
const SCRIPT = path.join(ROOT, 'scripts', 'check-i18n.mjs');
const dirs: string[] = [];
afterAll(() => { for (const d of dirs) fs.rmSync(d, { recursive: true, force: true }); });

type Opts = { code?: string; en?: string; locales?: Record<string, Record<string, string>>; wyjatki?: string[] };
function probe({ code = "t('Zapisz');", en = "'Zapisz': 'Save',", locales = {}, wyjatki }: Opts) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'check-i18n-'));
  dirs.push(d);
  for (const sub of ['app', 'components', 'lib/locales', 'scripts', 'docs/lokalizacja']) fs.mkdirSync(path.join(d, sub), { recursive: true });
  fs.symlinkSync(path.join(ROOT, 'node_modules'), path.join(d, 'node_modules'));
  fs.copyFileSync(SCRIPT, path.join(d, 'scripts', 'check-i18n.mjs'));
  fs.writeFileSync(path.join(d, 'app', 'a.tsx'), `import { t, tr, tp } from '@/lib/i18n';\nexport const x = () => { ${code} };\n`);
  fs.writeFileSync(path.join(d, 'lib', 'i18n.en.ts'), `export const EN: Record<string, string> = {\n ${en}\n};\n`);
  for (const [l, v] of Object.entries(locales)) fs.writeFileSync(path.join(d, 'lib', 'locales', `${l}.json`), JSON.stringify(v));
  if (wyjatki) fs.writeFileSync(path.join(d, 'docs', 'lokalizacja', 'pismo-wyjatki.json'), JSON.stringify({ wartosci: wyjatki }));
  const r = spawnSync('node', [path.join(d, 'scripts', 'check-i18n.mjs')], { encoding: 'utf8', cwd: d });
  return { code: r.status, out: `${r.stdout}${r.stderr}` };
}

describe('check:i18n — wywołania t() w każdym zapisie', () => {
  test('wzorzec: t(\'…\') ze wpisem w słowniku przechodzi', () => {
    expect(probe({}).code).toBe(0);
  });
  test('t("…") w cudzysłowie bez wpisu: błąd', () => {
    const r = probe({ code: 't("Nowy tekst");' });
    expect([r.code, r.out.includes('Nowy tekst')]).toEqual([1, true]);
  });
  test('t(`…`) szablon bez podstawień bez wpisu: błąd', () => {
    const r = probe({ code: 't(`Nowy tekst`);' });
    expect([r.code, r.out.includes('Nowy tekst')]).toEqual([1, true]);
  });
  test('tp(n, "…") w cudzysłowie bez wpisu: błąd; tr("…") też', () => {
    expect(probe({ code: 'tp(2, "a|b|c");' }).code).toBe(1);
    expect(probe({ code: 'tr("Nowy");' }).code).toBe(1);
  });
  test('wywołanie przez obiekt (i18n.t("…")) bez wpisu: błąd', () => {
    expect(probe({ code: 'i18n.t("Nowy tekst");' }).code).toBe(1);
  });
  test('wpis słownika w cudzysłowie i użycie w cudzysłowie: przechodzi (słownik czytany składnią, nie wyrażeniem)', () => {
    expect(probe({ code: 't("Zapisz plik");', en: '"Zapisz plik": "Save file",' }).code).toBe(0);
  });
  test('klucz z podstawieniem albo sklejany: błąd „nie do sprawdzenia”', () => {
    expect(probe({ code: 't(`Zapisz ${1}`);' }).code).toBe(1);
    expect(probe({ code: "t('Zapisz' + 1);" }).code).toBe(1);
  });
  test('zmienna jako klucz (t(x)): bez błędu — wartości dynamiczne sprawdza R39-02', () => {
    expect(probe({ code: 'const x = "Zapisz"; t(x);' }).code).toBe(0);
  });
  test('różne {parametry} w kluczu i wartości EN: błąd', () => {
    expect(probe({ code: "t('Zapisz {n}');", en: "'Zapisz {n}': 'Save {m}'," }).code).toBe(1);
  });
});

describe('check:i18n — pismo języka w słownikach', () => {
  test('ru z tekstem łacinką: błąd; ten sam tekst na liście wyjątków: przechodzi', () => {
    const locales = { ru: { 'Zapisz': 'Save file', 'Wróć': 'Назад' } };
    const r = probe({ locales });
    expect([r.code, r.out.includes('Save file')]).toEqual([1, true]);
    expect(probe({ locales, wyjatki: ['Save file'] }).code).toBe(0);
  });
  test('ru: tekst z pismem języka, symbole i parametry bez liter: przechodzi', () => {
    expect(probe({ locales: { ru: { a: 'Сохранить', b: '{n}', c: '12 %', d: 'Сохранить {n} kg' } } }).code).toBe(0);
  });
  test('el, ja, ko, zh-Hant, bg, uk: łacinka bez wyjątku to błąd', () => {
    for (const l of ['el', 'ja', 'ko', 'zh-Hant', 'bg', 'uk']) expect([l, probe({ locales: { [l]: { a: 'Hello world' } } }).code]).toEqual([l, 1]);
  });
  test('język łaciński (de) z cyrylicą albo greką: błąd; sr z łacinką: przechodzi', () => {
    expect(probe({ locales: { de: { a: 'Speichern Сохранить' } } }).code).toBe(1);
    expect(probe({ locales: { de: { a: 'Speichern α' } } }).code).toBe(1);
    expect(probe({ locales: { sr: { a: 'Sačuvaj' } } }).code).toBe(0);
  });
  test('polskie litery w słowniku łacińskim nie są już błędem pisma (kontrola „liter polskich” usunięta)', () => {
    expect(probe({ locales: { de: { a: 'Zażółć gęślą' } } }).code).toBe(0);
  });
});

test('repozytorium: npm run check:i18n przechodzi (kod i słowniki lib/locales)', () => {
  const r = spawnSync('node', [SCRIPT], { encoding: 'utf8', cwd: ROOT });
  expect([r.status, r.stdout.split('\n')[0]]).toEqual([0, expect.stringMatching(/^i18n: \d+ tekstów w kodzie/)]);
});
