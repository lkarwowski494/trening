/*
 * M1-audytor-generalny-050: build 1019 (tag v0.20.0-b1019) nie miał wiersza w dzienniku wydań (docs/09), a nic tego nie pilnowało.
 * Dziennik to tabela „Dziennik wydań” w docs/09-plan-testow.md: tag | build | SHA | numer przebiegu | wynik.
 * Test: każdy lokalny tag `v*-b*` ma wiersz, SHA zgadza się z tagiem, build = 1000 + numer przebiegu (CI: BUILD = 1000 + run_number).
 * Uwaga: kasa CI (actions/checkout) domyślnie nie pobiera tagów — wtedy sprawdzana jest tylko spójność samej tabeli.
 */
import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const doc = fs.readFileSync(path.join(__dirname, '..', 'docs', '09-plan-testow.md'), 'utf8');

type Row = { tag: string; build: number; sha: string; run: number; wynik: string };
function logRows(): Row[] {
  const start = doc.indexOf('## Dziennik wydań');
  if (start < 0) return [];
  const rest = doc.slice(start + 3);
  const end = rest.search(/\n## /);
  const body = end < 0 ? rest : rest.slice(0, end);
  const rows: Row[] = [];
  for (const line of body.split('\n')) {
    const m = /^\|\s*`(v\d+\.\d+\.\d+-b(\d+))`\s*\|\s*(\d+)\s*\|\s*`([0-9a-f]{7,40})`\s*\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*$/.exec(line);
    if (m) rows.push({ tag: m[1], build: Number(m[3]), sha: m[4], run: Number(m[5]), wynik: m[6] });
  }
  return rows;
}

function localTags(): string[] {
  try {
    return execFileSync('git', ['tag', '-l', 'v*-b*'], { cwd: path.join(__dirname, '..'), encoding: 'utf8' }).split('\n').filter(Boolean);
  } catch { return []; }
}
function tagSha(tag: string): string {
  return execFileSync('git', ['rev-list', '-n1', tag], { cwd: path.join(__dirname, '..'), encoding: 'utf8' }).trim();
}

describe('dziennik wydań (docs/09): wiersz dla każdego tagu v*-b*', () => {
  const rows = logRows();
  const tags = localTags();

  test('sekcja „Dziennik wydań” istnieje i ma wiersze', () => { expect(rows.length).toBeGreaterThan(0); });

  test('spójność wiersza: build w tagu = kolumna build = 1000 + numer przebiegu; tagi bez powtórzeń', () => {
    for (const r of rows) {
      expect(Number(/-b(\d+)$/.exec(r.tag)![1])).toBe(r.build);
      expect(r.build).toBe(1000 + r.run);
    }
    expect(new Set(rows.map((r) => r.tag)).size).toBe(rows.length);
  });

  test('każdy lokalny tag v*-b* ma wiersz z SHA zgodnym z tagiem', () => {
    const missing = tags.filter((t) => !rows.some((r) => r.tag === t));
    expect(missing).toEqual([]);
    for (const t of tags) {
      const row = rows.find((r) => r.tag === t)!;
      expect(tagSha(t).startsWith(row.sha)).toBe(true);
    }
  });

  test('build 1019 (przypadek z audytu) ma wiersz', () => { expect(rows.some((r) => r.build === 1019)).toBe(true); });
});
