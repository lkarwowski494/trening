/*
 * M1-audytor-generalny-012 (audyt 1.0, 27.10.2026; 07-jakosc-001, 07-jakosc-002, 10-wydanie-003): rejestr ryzyk (docs/40) jest bramką wydania —
 * `npm run check:release` (scripts/ci/blokada-wydania.mjs) kończy się kodem 1 przy wierszu „otwarte”/„częściowo” bez odroczenia decyzją właściciela
 * z datą i bez oznaczenia „sprawdzenie po wydaniu” (warunek do sprawdzenia dopiero w wersji z App Store). Krok wydania wywołuje check:release:
 * lista zgłoszenia 1.0 (docs/48, przed wyborem buildu) i lista wydawcy (.claude/agents/wydawca.md). Decyzja właściciela 27.10.2026 (pkt 5a): lista
 * wydania zamiast zmiany testflight.yml; check:release zostaje poza verify (zwykła praca ma prawo mieć otwarte ryzyka — tests/blokada-wydania.test.ts).
 * Rodzaje (docs/20): logika (parser rejestru), dane (bieżący rejestr), regresja.
 */
import * as fs from 'fs';
import * as path from 'path';

const root = path.join(__dirname, '..'); const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');
import * as os from 'os';
import { execFileSync } from 'child_process';
const SCRIPT = path.join(root, 'scripts/ci/blokada-wydania.mjs');
/** Wywołanie modułu ESM w osobnym procesie (jak tests/blokada-wydania.test.ts): treść rejestru z pliku tymczasowego. */
const blockingRisks = (md: string): { id: string; state: string }[] => { const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'rejestr-')), 'r.md'); fs.writeFileSync(f, md);
  return JSON.parse(execFileSync('node', ['--input-type=module', '-e', `import { blockingRisks } from ${JSON.stringify('file://' + SCRIPT)}; import { readFileSync } from 'node:fs'; process.stdout.write(JSON.stringify(blockingRisks(readFileSync(process.argv[1], 'utf8'))));`, f], { encoding: 'utf8' })); };
const load = async () => ({ blockingRisks });
const table = (rows: string[]) => ['## Rejestr ryzyk (otwarte blokują wydanie)', '', '| id | ryzyko | warunek zamknięcia | stan |', '|---|---|---|---|', ...rows, '', '## Lekcje'].join('\n');

describe('M1-012: rejestr ryzyk jako bramka wydania', () => {
  test('blockingRisks: otwarte i częściowe blokują; zamknięte, zaakceptowane, odroczone decyzją z datą i „sprawdzenie po wydaniu” nie', async () => {
    const { blockingRisks } = await load();
    const md = table(['| R-1 | a | b | otwarte (20.10.2026) |', '| R-2 | a | b | **częściowo spełnione 22.10.2026** |', '| R-3 | a | b | **zamknięte 19.10.2026** — dowód |',
      '| R-4 | a | b | **zaakceptowane** (teoretyczny) |', '| R-5 | a | b | otwarte — odroczone decyzją właściciela 28.10.2026 (1.0 wychodzi z tym zachowaniem) |', '| R-6 | a | b | otwarte — sprawdzenie po wydaniu (Z-36) |']);
    expect(blockingRisks(md).map(r => r.id)).toEqual(['R-1', 'R-2']);
  });
  test('dodanie wiersza „otwarte” do bieżącego rejestru jest wykryte (test potrafi paść)', async () => {
    const { blockingRisks } = await load(); const cur = read('docs/40-lekcje.md');
    const more = cur.replace('|---|---|---|---|\n', '|---|---|---|---|\n| R-TEST | sztuczne | brak | otwarte (28.10.2026) |\n');
    expect(blockingRisks(more).map(r => r.id)).toContain('R-TEST');
  });
  test('bieżący rejestr: każdy wiersz ma stan z datą (dd.mm.rrrr)', () => {
    const rows = read('docs/40-lekcje.md').split('\n').filter(l => /^\| R-[\w-]+ \|/.test(l));
    expect(rows.length).toBeGreaterThan(10); for (const r of rows) { const st = r.split(' | ').at(-1)!; expect([r.split(' | ')[0], /\d{2}\.\d{2}\.\d{4}/.test(st)]).toEqual([r.split(' | ')[0], true]); }
  });
  test('krok wydania wywołuje check:release: docs/48 (przed Z-26) i lista wydawcy', () => {
    const z = read('docs/48-zgloszenie-1-0.md').split('\n').filter(l => /^\| Z-\d+[a-z]? \|/.test(l)); const i = z.findIndex(l => l.includes('npm run check:release')); const j = z.findIndex(l => l.startsWith('| Z-26 |'));
    expect(i).toBeGreaterThanOrEqual(0); expect(i).toBeLessThan(j);
    expect(read('.claude/agents/wydawca.md')).toContain('npm run check:release');
  });
});

/* Pętla 2 (M2, 28.10.2026; reaudyt 07-jakosc-001): każde ryzyko ma stan z datą, a zamknięte lub zaakceptowane — dowód (plik, przebieg, test) albo decyzję
 * z datą; sprawdzenie pustego pola zapobiega powrotowi R-010 bez zapisu zamknięcia. */
export const riskStateProblems = (md: string): string[] => {
  const sec = md.split(/^## /m).find(s => s.startsWith('Rejestr ryzyk')) ?? '';
  return sec.split('\n').filter(l => /^\| R-[\w-]+ \|/.test(l)).flatMap((l) => {
    const c = l.split(' | '); const id = c[0].replace('| ', '').trim(); const st = c.at(-1)!.replace(/\|\s*$/, '').trim();
    if (!/\d{2}\.\d{2}\.\d{4}/.test(st)) return [`${id}: stan bez daty`];
    if (/zamknięte|zaakceptowane/i.test(st) && !/dowód|`[^`]+`|\b\d{8,}\b|decyzj|test|bez naprawy|potwierdzi/i.test(st)) return [`${id}: zamknięte bez dowodu`];
    return [];
  });
};
describe('M1-012 (pętla 2): stan każdego ryzyka z datą, zamknięte z dowodem', () => {
  test('docs/40: brak wierszy bez daty i zamkniętych bez dowodu', () => { expect(riskStateProblems(read('docs/40-lekcje.md'))).toEqual([]); });
  test('strażnik potrafi paść: stan bez daty i zamknięte bez dowodu', () => {
    expect(riskStateProblems(table(['| R-1 | x | y | otwarte |', '| R-2 | x | y | **zamknięte 01.01.2026** |', '| R-3 | x | y | zamknięte 01.01.2026 — dowód: `a.ts` |']))).toEqual(['R-1: stan bez daty', 'R-2: zamknięte bez dowodu']);
  });
});
