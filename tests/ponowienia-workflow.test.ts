/*
 * L-096-A (decyzja właściciela 03.11.2026; lekcja L-096 w docs/40): ponowienie w kroku CI pod `bash -e` bywa martwe (run 41538603321: `faza …; rc=$?` kończyło krok
 * przy pierwszej porażce), a test samego tekstu workflowu tego nie wykryje. Strażnik: każdy krok `run:` w .github/workflows/*.yml, którego kod (bez wierszy-komentarzy)
 * pasuje do wzorca ponowienia, ma wpis w tests/ponowienia-workflow.json — `test` (istniejący plik testu, który wymienia ten workflow i wykonuje wiersze kroku
 * w `bash -e` ze stubami; wzór tests/e2e-ios-ponowienie-aktualizacji.test.ts) albo `wyjatek` z powodem.
 * Zakres: lista workflowów = readdir .github/workflows/*.yml; wzorce = WZORCE poniżej (ponow, retry, `|| rc=`, pętla `for proba`); wpisy = tests/ponowienia-workflow.json.
 * Czego strażnik nie obejmuje: kroków `uses:` (akcje), skryptów wywoływanych z kroku (scripts/ci/*.sh), ponowień w komentarzach.
 */
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const yaml = require('js-yaml');

const ROOT = join(__dirname, '..');
const WF = '.github/workflows';
export const WZORCE = [/ponow/i, /retry/i, /\|\|\s*rc=/, /for\s+proba/];
type Wpis = { plik: string; krok: string; test?: string; wyjatek?: string };
type Krok = { plik: string; zadanie: string; krok: string; run: string };

/** Kroki `run:` ze wszystkich workflowów (nazwa kroku albo id). */
export function kroki(pliki: Record<string, string>): Krok[] {
  const out: Krok[] = [];
  for (const [plik, tresc] of Object.entries(pliki)) {
    const d = yaml.load(tresc) as { jobs?: Record<string, { steps?: { name?: string; id?: string; run?: string }[] }> };
    for (const [zadanie, job] of Object.entries(d.jobs ?? {})) for (const s of job.steps ?? []) if (s.run) out.push({ plik, zadanie, krok: s.name ?? s.id ?? '(bez nazwy)', run: s.run });
  }
  return out;
}

/** Kroki z logiką ponowienia: kod kroku bez wierszy-komentarzy pasuje do któregoś z WZORCE. */
export const zPonowieniem = (k: Krok[]) => k.filter(x => WZORCE.some(w => w.test(x.run.split('\n').filter(l => !/^\s*#/.test(l)).join('\n'))));

/** Problemy: krok bez wpisu, wpis bez kroku, wpis bez testu/powodu, test nieistniejący albo niewymieniający workflowu. */
export function problemy(wykryte: Krok[], lista: Wpis[], istnieje: (p: string) => boolean, tresc: (p: string) => string): string[] {
  const out: string[] = [];
  for (const x of wykryte) if (!lista.some(w => w.plik === x.plik && w.krok === x.krok)) out.push(`${x.plik}/${x.zadanie}: krok „${x.krok}” z ponowieniem bez wpisu w tests/ponowienia-workflow.json`);
  for (const w of lista) {
    const id = `${w.plik}: „${w.krok}”`;
    if (!wykryte.some(x => x.plik === w.plik && x.krok === w.krok)) out.push(`${id}: wpis bez takiego kroku z ponowieniem`);
    if (!w.test && !w.wyjatek?.trim()) out.push(`${id}: ani test, ani wyjątek z powodem`);
    if (w.test && !istnieje(w.test)) out.push(`${id}: brak pliku testu ${w.test}`);
    else if (w.test && !tresc(w.test).includes(`${WF}/${w.plik}`)) out.push(`${id}: test ${w.test} nie wymienia ${WF}/${w.plik}`);
  }
  return out;
}

const PLIKI = Object.fromEntries(readdirSync(join(ROOT, WF)).filter(f => f.endsWith('.yml')).map(f => [f, readFileSync(join(ROOT, WF, f), 'utf8')]));
const LISTA: Wpis[] = JSON.parse(readFileSync(join(__dirname, 'ponowienia-workflow.json'), 'utf8')).kroki;
const istnieje = (p: string) => existsSync(join(ROOT, p));
const tresc = (p: string) => readFileSync(join(ROOT, p), 'utf8');

describe('L-096-A: kroki workflowów z ponowieniem mają test wykonujący ich wiersze sterujące', () => {
  test('każdy wykryty krok jest na liście, a lista nie ma martwych wpisów ani testów bez workflowu', () => {
    expect(problemy(zPonowieniem(kroki(PLIKI)), LISTA, istnieje, tresc)).toEqual([]);
  });
  test('wykrywa dziś dokładnie kroki z listy (dwa e2e-ios.yml + wyjątki testflight.yml i tests.yml)', () => {
    expect(zPonowieniem(kroki(PLIKI)).map(x => `${x.plik}|${x.krok.slice(0, 12)}`).sort()).toEqual(['e2e-ios.yml|Aktualizacja', 'e2e-ios.yml|Maestro', 'tests.yml|Jest (część ', 'testflight.yml|Strażnik upr']);
  });
  test('wzorce: ponow, retry, || rc=, pętla for proba — w kodzie tak, w komentarzu nie', () => {
    const k = (run: string): Krok => ({ plik: 'x.yml', zadanie: 'j', krok: 'k', run });
    expect(zPonowieniem([k('echo ponowienie'), k('retry foo'), k('cmd || rc=$?'), k('for proba in 1 2; do :; done')])).toHaveLength(4);
    expect(zPonowieniem([k('# ponowienie w komentarzu\necho ok'), k('echo ok')])).toHaveLength(0);
  });
  test('strażnik pada: nowy krok z ponowieniem bez wpisu, wpis bez testu, test nie dla tego workflowu, wpis martwy', () => {
    const wyk = [{ plik: 'a.yml', zadanie: 'j', krok: 'Nowy', run: '' }, { plik: 'a.yml', zadanie: 'j', krok: 'Bez', run: '' }, { plik: 'a.yml', zadanie: 'j', krok: 'Obcy', run: '' }];
    const lista: Wpis[] = [{ plik: 'a.yml', krok: 'Bez' }, { plik: 'a.yml', krok: 'Obcy', test: 'tests/t.test.ts' }, { plik: 'a.yml', krok: 'Martwy', wyjatek: 'x' }, { plik: 'a.yml', krok: 'Brak', test: 'tests/brak.ts' }];
    const r = problemy(wyk, lista, p => p !== 'tests/brak.ts', () => 'nic o workflowach');
    expect(r).toEqual([
      'a.yml/j: krok „Nowy” z ponowieniem bez wpisu w tests/ponowienia-workflow.json',
      'a.yml: „Bez”: ani test, ani wyjątek z powodem',
      'a.yml: „Obcy”: test tests/t.test.ts nie wymienia .github/workflows/a.yml',
      'a.yml: „Martwy”: wpis bez takiego kroku z ponowieniem',
      'a.yml: „Brak”: wpis bez takiego kroku z ponowieniem',
      'a.yml: „Brak”: brak pliku testu tests/brak.ts',
    ]);
  });
  test('gałąź z wcześniejszymi zmianami względem main (L-080): krok już pokryty testem przechodzi, nowy krok z ponowieniem dodany na tej samej gałęzi — nie', () => {
    const stary = { plik: 'a.yml', zadanie: 'j', krok: 'Stary', run: '' };
    const nowy = { plik: 'a.yml', zadanie: 'j', krok: 'Nowy', run: '' };
    const lista: Wpis[] = [{ plik: 'a.yml', krok: 'Stary', test: 'tests/t.test.ts' }];
    const t = () => 'sprawdza .github/workflows/a.yml';
    expect(problemy([stary], lista, () => true, t)).toEqual([]);
    expect(problemy([stary, nowy], lista, () => true, t)).toEqual(['a.yml/j: krok „Nowy” z ponowieniem bez wpisu w tests/ponowienia-workflow.json']);
  });
  test('testy z listy rzeczywiście wykonują skrypt w bash -e (spawnSync z -e)', () => {
    for (const w of LISTA.filter(x => x.test)) expect(tresc(w.test!)).toMatch(/spawnSync\('bash', \['-e'/);
  });
});
