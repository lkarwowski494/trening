/*
 * Pole [wykonalność: …] w dzienniku decyzji (decyzja właściciela 30.10.2026, wariant A; lekcja w docs/40 o wariancie „stała klatka” zrzutu 02
 * opisanym sposobem, który nie działa): wpis od 30.10.2026 z [wdrożenie: otwarte → …] wskazuje plik:linię albo przeczytaną stronę (adres),
 * która potwierdza, że wariant da się wykonać tak, jak opisano — albo jawnie „niesprawdzona — powód”. Skrypt: scripts/decyzje.mjs (check:decyzje).
 */
import * as path from 'path';
import { spawnSync } from 'child_process';

const ROOT = path.join(__dirname, '..');
const SKRYPT = path.join(ROOT, 'scripts/decyzje.mjs');
const bledy = (tekst: string): string[] => {
  const r = spawnSync(process.execPath, ['--input-type=module', '-e',
    `import * as m from ${JSON.stringify(SKRYPT)}; console.log(JSON.stringify(m.sprawdz('probka.md', ${JSON.stringify(tekst)})));`], { encoding: 'utf8', cwd: ROOT });
  if (r.status !== 0) throw new Error(r.stderr);
  return (JSON.parse(r.stdout) as { blad: string }[]).map(e => e.blad);
};
const dziennik = (...wpisy: string[]) => ['# 18', '', '## Decyzje (od 11.10.2026)', ...wpisy, ''].join('\n');

describe('check:decyzje — pole [wykonalność: …] (30.10.2026)', () => {
  test('otwarte od 30.10.2026 bez pola → błąd', () => {
    expect(bledy(dziennik('- 30.10.2026 (właściciel): wariant A1. [wdrożenie: otwarte → 101-32]')).join()).toMatch(/wykonalność/);
  });
  test.each([
    '[wykonalność: components/ExerciseFigureV2.tsx:53]',
    '[wykonalność: lib/figures/v2/anim.ts:15–21, .github/workflows/testflight.yml:102]',
    '[wykonalność: https://developer.apple.com/help/app-store-connect/ (przeczytane 30.10.2026)]',
    '[wykonalność: niesprawdzona — wymaga przebiegu macOS]',
  ])('poprawne pole: %s', pole => {
    expect(bledy(dziennik(`- 30.10.2026 (właściciel): wariant A2. [wdrożenie: otwarte → 101-32] ${pole}`))).toEqual([]);
  });
  test.each(['[wykonalność: ]', '[wykonalność: sprawdzone]', '[wykonalność: niesprawdzona]', '[wykonalność: ExerciseFigureV2]'])('niepoprawne pole: %s', pole => {
    expect(bledy(dziennik(`- 30.10.2026 (właściciel): x. [wdrożenie: otwarte → 101-32] ${pole}`)).join()).toMatch(/wykonalność/);
  });
  test('wpisy sprzed 30.10.2026 i inne pola wdrożenia (kod, bez kodu, zastąpione, odłożone) — bez wymogu', () => {
    expect(bledy(dziennik(
      '- 29.10.2026 (właściciel): stare. [wdrożenie: otwarte → 101-17]',
      '- 30.10.2026 (właściciel): proces. [wdrożenie: bez kodu — decyzja procesowa]',
      '- 30.10.2026 (właściciel): stara wersja. [wdrożenie: zastąpione 30.10.2026]',
      '- 30.10.2026 (właściciel): później. [wdrożenie: odłożone → 1.1]',
    ))).toEqual([]);
  });
});
