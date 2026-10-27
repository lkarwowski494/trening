/*
 * Regresja przebiegu E2E 39825973624 (podglad-m5s1): scenariusze 21 i 35 — po stuknięciu „Subscribe” (start ponad limit dni) „You have the full version” niewidoczne.
 * Od DEC-09 a (27.10.2026) nagłówek karty stanu to „Your plan: {name}” — scenariusze czekają na niego.
 * Ekran zakupu po M5 S1 jest dłuższy (pochwała, opisy planów), zakup robi się na jego dole, a karta „Masz pełną wersję” jest na górze, poza polem widzenia — aplikacja
 * przewija więc po udanym zakupie na początek (tests/subscription-ui.test.tsx), a scenariusz czeka na koniec przewijania przed stuknięciem (stuknięcie w trakcie
 * bezwładności listy tylko ją zatrzymuje). Interpreter nie modeluje bezwładności, więc test pilnuje kolejności kroków.
 */
import { readFileSync } from 'fs';
import { join } from 'path';

const steps = (f: string): string[] => readFileSync(join(__dirname, '..', '.maestro', f), 'utf8').split('\n').filter(l => /^- /.test(l)).map(l => l.replace(/\s+#.*$/, '').trim());

test.each(['21-subskrypcja.yaml', '35-ustawienia-dostepnosc.yaml'])('%s: przed stuknięciem „Subscribe” koniec przewijania, po nim czekanie na „Your plan: …”', f => {
  const s = steps(f); const i = s.indexOf('- tapOn: "Subscribe"');
  expect(i).toBeGreaterThan(1);
  expect(s[i - 2]).toMatch(/^- scrollUntilVisible: \{ element: "Subscribe"/); expect(s[i - 1]).toBe('- waitForAnimationToEnd');
  expect(s[i + 1]).toMatch(/^- extendedWaitUntil: \{ visible: "\.\*Your plan: \.\*"/);
});
