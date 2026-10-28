/*
 * M1-audytor-generalny-006 (pętla 2, 28.10.2026): R-010 (treść krytyczna w 34 językach) zamyka przegląd wykonany przez Claude — decyzja właściciela
 * 21.10.2026 (docs/18; wcześniej K-P4-2, 20.10.2026: bez native speakerów). Przegląd przez API wykonano 28.10.2026 (decyzja 1a, batch msgbatch_01CVC1PzCUxnhgZPrJQnHzJZ),
 * ale rejestr ryzyk nadal miał „otwarte”, docs/16 opisywał przegląd natywny jako otwarty, a raport żył tylko w artefakcie CI (wygasa 04.11.2026).
 * Test: (1) trwała kopia raportu w repo (34 języki, bez braku odpowiedzi, 0 uwag krytycznych bez rozstrzygnięcia); (2) wiersz R-010 zamknięty z datą i dowodem
 * i nie blokuje check:release; (3) docs/16 bez sprzecznego „przegląd natywny otwarty” i bez [OTWARTE] przy formie fr/tr; (4) forma fr „vous” i tr „siz”
 * w zdaniu medycznym (pkt 2 warunku R-010).
 */
import * as fs from 'fs';
import * as path from 'path';
import { LANGS } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';
import { execFileSync } from 'child_process';

const ROOT = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const DIR = 'docs/lokalizacja/raport-api-2026-10-28';
const TARGETS = LANGS.filter((l) => l !== 'pl');
const SCRIPT = path.join(ROOT, 'scripts/ci/blokada-wydania.mjs');
/** blockingRisks z modułu ESM (jak tests/audit-m1-2026-10-27-012-rejestr-ryzyk-bramka.test.ts). */
const blockingIds = (): string[] => JSON.parse(execFileSync('node', ['--input-type=module', '-e',
  `import { blockingRisks } from ${JSON.stringify('file://' + SCRIPT)}; import { readFileSync } from 'node:fs'; process.stdout.write(JSON.stringify(blockingRisks(readFileSync(process.argv[1], 'utf8')).map((r) => r.id)));`,
  path.join(ROOT, 'docs/40-lekcje.md')], { encoding: 'utf8' }));
const MEDICAL = 'Aplikacja nie udziela porad medycznych. Przy bólu, urazie lub chorobie skonsultuj się z lekarzem lub fizjoterapeutą.';

describe('M1-006: trwały dowód przeglądu API z 28.10.2026', () => {
  test('kopia raportu ma wszystkie 34 języki, każdy z odpowiedzią modelu', () => {
    for (const l of TARGETS) {
      const f = path.join(ROOT, DIR, `${l}.json`);
      expect(fs.existsSync(f)).toBe(true);
      const r = JSON.parse(fs.readFileSync(f, 'utf8'));
      expect(r.batch_id).toBe('msgbatch_01CVC1PzCUxnhgZPrJQnHzJZ');
      expect(r.zdan).toBeGreaterThan(0);
      expect(r.brak_odpowiedzi ?? []).toEqual([]);
      expect(r.blad ?? null).toBeNull();
    }
    expect(read(`${DIR}/podsumowanie.md`)).toMatch(/Języków: 34/);
  });
  test('README podaje bazę batcha, przebieg CI i dokument decyzji o poprawkach', () => {
    const r = read(`${DIR}/README.md`);
    expect(r).toMatch(/98aa4a2/); expect(r).toMatch(/40642059904/); expect(r).toMatch(/docs\/16-jezyki-i-marka\.md/);
  });
});

describe('M1-006: R-010 w rejestrze ryzyk zamknięte (decyzja 21.10.2026)', () => {
  const d = read('docs/40-lekcje.md'); const line = d.split('\n').find((l) => l.startsWith('| R-010 |')) ?? '';
  const state = line.split(' | ').at(-1) ?? '';
  test('stan „zamknięte” z datą 28.10.2026, odwołaniem do decyzji 21.10.2026 i ścieżką dowodu', () => {
    expect(state).toMatch(/zamknięte \(28\.10\.2026\)/);
    expect(state).toMatch(/21\.10\.2026/);
    expect(state).toContain(DIR);
    expect(state).not.toMatch(/\botwarte\b/);
  });
  test('check:release nie liczy R-010 jako blokującego', () => {
    expect(blockingIds()).not.toContain('R-010');
  });
});

describe('M1-006: docs/16 zgodne z decyzją 21.10.2026', () => {
  const s = read('docs/16-jezyki-i-marka.md');
  test('brak opisu przeglądu natywnego jako otwartego warunku R-010', () => {
    expect(s).not.toMatch(/przegląd przez native speakerów nadal otwarty/);
    expect(s).not.toMatch(/Przegląd przez native speakerów jest w backlogu \(docs\/18\) — \*\*\[OTWARTE\]\*\*/);
  });
  test('forma fr/tr nie jest już opisana jako [OTWARTE], a słowniki mają vous/siz w zdaniu medycznym', () => {
    expect(s).not.toMatch(/Forma zwracania się w fr i tr nie jest ujednolicona — \[OTWARTE\]/);
    expect((LOCALES.fr as Record<string, string>)[MEDICAL]).toMatch(/consultez/);
    expect((LOCALES.tr as Record<string, string>)[MEDICAL]).toMatch(/danışın/);
  });
});
