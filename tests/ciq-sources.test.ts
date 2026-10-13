/* Kod Monkey C zegarka (garmin/) — kontrola statyczna na Linuksie, bez SDK Connect IQ (kompilator i symulator tylko u właściciela / w przyszłym CI):
 * spójność stałych Wire, zasobów, modułów i funkcji, nawiasów; zgodność metod Model.mc z modelem TypeScript; brak sekretów i artefaktów w garmin/.
 * To NIE zastępuje kompilacji ani testów Run No Evil (docs/35, lista testu właściciela) — łapie literówki i rozjazd z protokołem przed buildem. */
import * as fs from 'fs';
import * as path from 'path';
import { CIQ_LABEL_IDS, CIQ_KEYS, CIQ_LIMITS, CIQ_PRODUCTS } from '@/lib/watch/ciqWire';
import { CiqWatchModel } from '@/lib/watch/ciqModel';

const G = path.join(__dirname, '..', 'garmin');
const walk = (d: string): string[] => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const rel = (f: string) => path.relative(G, f);
const MC = walk(path.join(G, 'source')).filter(f => f.endsWith('.mc'));
const read = (f: string) => fs.readFileSync(f, 'utf8');
/** Kod bez komentarzy i bez treści literałów tekstowych (do liczenia nawiasów i szukania wywołań). */
const code = (s: string) => s.replace(/\/\/[^\n]*/g, '').replace(/"(?:[^"\\\n]|\\.)*"/g, '""');
const src = (f: string) => code(read(f));
const NON_TEST = MC.filter(f => !rel(f).startsWith(path.join('source', 'tests')));

test('są oczekiwane pliki projektu', () => {
  for (const f of ['manifest.xml', 'monkey.jungle', '.gitignore', 'resources/drawables/drawables.xml', 'resources/drawables/launcher_icon.png', 'resources/strings/strings.xml',
    'source/TreningApp.mc', 'source/Model.mc', 'source/Link.mc', 'source/MainView.mc', 'source/MainDelegate.mc', 'source/Wrap.mc', 'source/Haptics.mc', 'source/Util.mc', 'source/Wire.mc', 'source/Labels.mc', 'source/Recorder.mc', 'source/Demo.mc',
    'source/tests/ModelTests.mc', 'source/tests/WrapTests.mc', 'source/tests/QueueTests.mc', 'source/tests/RecorderTests.mc', 'source/tests/Fixtures.mc']) expect([f, fs.existsSync(path.join(G, f))]).toEqual([f, true]);
});

test('PNG ikony: poprawny nagłówek, 70 × 70', () => {
  const b = fs.readFileSync(path.join(G, 'resources/drawables/launcher_icon.png'));
  expect(b.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])); expect([b.readUInt32BE(16), b.readUInt32BE(20)]).toEqual([70, 70]);
});

describe.each(MC.map(f => [rel(f), f]))('%s', (_n, f) => {
  test('nawiasy {} () [] w równowadze, brak tabulatorów', () => {
    const s = src(f); for (const [o, c] of [['{', '}'], ['(', ')'], ['[', ']']]) expect([o, s.split(o).length - 1]).toEqual([o, s.split(c).length - 1]);
    expect(read(f)).not.toContain('\t');
  });
  test('nie zawiera nazw marek innych aplikacji ani adresów e-mail / kluczy', () => {
    expect(read(f)).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+|BEGIN (RSA |EC |)PRIVATE KEY/);
  });
});

test('każda stała Wire.X użyta w kodzie jest zdefiniowana w Wire.mc (i odwrotnie: każda stała klucza jest używana poza Wire.mc)', () => {
  const defined = new Set([...read(path.join(G, 'source/Wire.mc')).matchAll(/const (\w+) =/g)].map(m => m[1]));
  const usedAll = new Set<string>(); const missing: string[] = [];
  for (const f of MC) for (const m of src(f).matchAll(/\bWire\.(\w+)/g)) { usedAll.add(m[1]); if (!defined.has(m[1])) missing.push(`${rel(f)}: Wire.${m[1]}`); }
  expect(missing).toEqual([]);
  const keyConsts = [...defined].filter(n => n.startsWith('K_')); expect(keyConsts.length).toBe(Object.keys(CIQ_KEYS).length);
  expect(keyConsts.filter(n => !usedAll.has(n))).toEqual([]);
});

test('każde Rez.Strings.X i etykieta Labels.get(…, "id") istnieje; Labels.mc obejmuje wszystkie etykiety', () => {
  const strings = read(path.join(G, 'resources/strings/strings.xml')); const ids = new Set([...strings.matchAll(/<string id="(\w+)"/g)].map(m => m[1]));
  for (const f of MC) for (const m of src(f).matchAll(/\bRez\.Strings\.(\w+)/g)) expect([rel(f), m[1], ids.has(m[1])]).toEqual([rel(f), m[1], true]);
  for (const f of MC) for (const m of read(f).matchAll(/Labels\.get\([^,]+,\s*"(\w+)"\)/g)) expect([rel(f), m[1], (CIQ_LABEL_IDS as readonly string[]).includes(m[1])]).toEqual([rel(f), m[1], true]);
  const labels = read(path.join(G, 'source/Labels.mc')); for (const id of CIQ_LABEL_IDS) expect(labels).toContain(`id.equals("${id}")`);
});

test('wywołania Moduł.funkcja dla modułów projektu wskazują istniejące funkcje', () => {
  const mods = ['Util', 'Wrap', 'Haptics', 'Labels', 'RecorderLogic', 'Demo', 'Fixtures', 'ModelTests', 'QueueTests'];
  const fns: Record<string, Set<string>> = {};
  for (const m of mods) { const f = MC.find(x => new RegExp(`\\bmodule ${m}\\b`).test(read(x))); expect([m, !!f]).toEqual([m, true]); fns[m] = new Set([...read(f!).matchAll(/function (\w+)\(/g)].map(x => x[1])); }
  for (const f of MC) for (const mm of src(f).matchAll(/\b(Util|Wrap|Haptics|Labels|RecorderLogic|Demo|Fixtures|ModelTests|QueueTests)\.(\w+)\(/g)) expect([rel(f), `${mm[1]}.${mm[2]}`, fns[mm[1]].has(mm[2])]).toEqual([rel(f), `${mm[1]}.${mm[2]}`, true]);
});

test('kod produkcyjny nie odwołuje się do kodu testowego', () => {
  for (const f of NON_TEST) expect([rel(f), /\b(Fixtures|ModelTests|QueueTests|WrapTests|RecorderTests|FakeDc|Test\.)\b/.test(src(f))]).toEqual([rel(f), false]);
});

test('Model.mc: żadnych surowych kluczy wiadomości — teksty tylko ze stałych Wire (dozwolone: puste, kilka nazw pól wewnętrznych)', () => {
  const lits = [...read(path.join(G, 'source/Model.mc')).replace(/\/\/[^\n]*/g, '').matchAll(/"((?:[^"\\\n]|\\.)*)"/g)].map(m => m[1]);
  const internal = new Set(['', '-', 'g', 'mode', 'setId', 'blockId', 'title', 'counter', 'load', 'group', 'timed', 'restEndsAt', 'cue', 'next', 'restEndSent', 'set', 'restSec', 'restLeft', 'canUndo', 'blind', 'needsUpdate', 'hasNext']);
  expect(lits.filter(l => !internal.has(l))).toEqual([]);
});

test('Model.mc ma te same publiczne metody co model TypeScript (lib/watch/ciqModel.ts)', () => {
  const mc = new Set([...src(path.join(G, 'source/Model.mc')).matchAll(/function (\w+)\(/g)].map(m => m[1]));
  const ts = Object.getOwnPropertyNames(CiqWatchModel.prototype).filter(n => n !== 'constructor');
  const tsOnly = ts.filter(n => !mc.has(n) && n !== 'save'); /* save/restore: nazwy prywatne po obu stronach */
  expect(tsOnly).toEqual([]);
  for (const n of ['applySnapshot', 'hello', 'press', 'canUndo', 'undo', 'restLeft', 'tick', 'view', 'isBlind']) expect([n, mc.has(n)]).toEqual([n, true]);
});

test('manifest: punkt wejścia istnieje jako klasa AppBase, ikona wskazuje zasób, wszystkie modele z listy, uprawnienia tylko Communications i Fit (zapis aktywności)', () => {
  const m = read(path.join(G, 'manifest.xml')); expect(m).toMatch(/entry="TreningApp"/);
  expect(read(path.join(G, 'source/TreningApp.mc'))).toMatch(/class TreningApp extends Application\.AppBase/);
  expect(m).toContain('launcherIcon="@Drawables.LauncherIcon"'); expect(read(path.join(G, 'resources/drawables/drawables.xml'))).toContain('id="LauncherIcon"');
  expect([...m.matchAll(/<iq:product id="(\w+)"/g)].map(x => x[1])).toEqual([...CIQ_PRODUCTS]);
  expect([...m.matchAll(/<iq:uses-permission id="(\w+)"/g)].map(x => x[1])).toEqual(['Communications', 'Fit']);
});

test('jungle wskazuje istniejące katalogi; w garmin/ nie ma artefaktów budowania ani kluczy', () => {
  const j = read(path.join(G, 'monkey.jungle')); expect(j).toContain('project.manifest = manifest.xml'); expect(fs.existsSync(path.join(G, 'source'))).toBe(true); expect(fs.existsSync(path.join(G, 'resources'))).toBe(true);
  const all = walk(G).map(rel); expect(all.filter(f => /\.(prg|iq|der|pem|p12)$|^bin\/|developer_key/.test(f))).toEqual([]);
  expect(read(path.join(G, '.gitignore'))).toMatch(/developer_key\*/);
  expect(read(path.join(__dirname, '..', '.gitignore'))).toMatch(/developer_key\*/);
});

test('limity długości po stronie zegarka mieszczą się w czcionkach: tytuł ≤ 80, zapowiedź ≤ 200 znaków (3 linie przewijane)', () => {
  expect([CIQ_LIMITS.title, CIQ_LIMITS.cue]).toEqual([80, 200]);
});
