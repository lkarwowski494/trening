/*
 * Regresja przebiegu E2E 39399241275 (audyt-m1, f37c5a4, iPhone 17, en-US) — scenariusze 13, 31 i 36 (pakiet podstawowy).
 * Przyczyny (zrzuty i commands.json przebiegu), wszystkie w scenariuszach, nie w strażniku pętli awarii (M1-003: 36 pada PRZED pierwszym restartem, 02/32/41 z restartami przeszły):
 *  - 36 (krok „Element not found: r-0-0 / w-0-0”) i 13 („Set 1 done.*” niewidoczny): na czystej instalacji ekran treningu pokazuje kartę zgody na powiadomienia
 *    (M1-035, ok. 150 pt) — pola serii lądują pod klawiaturą, a przycisk „Set done” poza ekranem. Scenariusz musi ją zamknąć („Not now”) zaraz po starcie treningu.
 *  - 31 („Resume workout” niewidoczny): po odhaczeniu serii lista jest przewinięta do karty „teraz”, nagłówek z „Pause workout” leży nad ekranem; hierarchia iOS go zwraca
 *    (jak w E2E 105), scrollUntilVisible nic nie przewija, stuknięcie trafia w pasek stanu. Scenariusz przesuwa listę na początek przed stuknięciem.
 * Interpreter nie modeluje klawiatury ani przycinania hierarchii, więc test pilnuje kolejności kroków.
 */
import { readFileSync } from 'fs';
import { join } from 'path';

const steps = (f: string): string[] => readFileSync(join(__dirname, '..', '.maestro', f), 'utf8').split('\n').filter(l => /^- /.test(l)).map(l => l.replace(/\s+#.*$/, '').trim());
const NOT_NOW = '- tapOn: { text: "Not now", optional: true }';

test('podprzepływ start-szablonu zamyka kartę zgody na powiadomienia zaraz po „Start: Upper A” (36, 13: pola serii i „Set done” widoczne)', () => {
  const s = steps('subflows/start-szablonu.yaml'); const i = s.indexOf('- tapOn: "Start: Upper A"');
  expect(i).toBeGreaterThan(0); expect(s[i + 1]).toBe(NOT_NOW);
});

test('13: po „Start planned workout: Upper A” karta zgody zamknięta przed czekaniem na „Set 1 done”', () => {
  const s = steps('13-kalendarz-plan.yaml'); const i = s.indexOf('- tapOn: "Start planned workout: Upper A"');
  expect(i).toBeGreaterThan(0); expect(s[i + 1]).toBe(NOT_NOW); expect(s[i + 2]).toMatch(/^- extendedWaitUntil: \{ visible: "Set 1 done\.\*"/);
});

test('31: przed pauzą (menu „⋯” → „Pause workout”) lista przesunięta na początek (dwa przesunięcia w dół), nie samo scrollUntilVisible', () => {
  const s = steps('31-pierwszy-tydzien.yaml'); const i = s.indexOf('- tapOn: "Pause workout"'); /* M3 p2 (ZM-02): pauza w menu „⋯”, więc przed nią stuknięcie „Workout options” */
  expect(i).toBeGreaterThan(4); expect(s[i - 1]).toBe('- tapOn: "Workout options"');
  expect(s.slice(i - 4, i - 1)).toEqual([
    '- swipe: { start: "50%, 30%", end: "50%, 85%", duration: 400 }',
    '- swipe: { start: "50%, 30%", end: "50%, 85%", duration: 400 }',
    '- waitForAnimationToEnd',
  ]);
  expect(s.some(l => /scrollUntilVisible: \{ element: "Pause workout"/.test(l))).toBe(false);
});

test('36: przed wpisywaniem serii (w-0-0) karta zgody jest zamknięta — start przez podprzepływ', () => {
  const raw = readFileSync(join(__dirname, '..', '.maestro', '36-przerwanie-szkice.yaml'), 'utf8');
  const i = raw.indexOf('- runFlow: subflows/start-szablonu.yaml');
  expect(i).toBeGreaterThan(0); expect(raw.indexOf('id: "w-0-0"')).toBeGreaterThan(i);
  const sub = steps('subflows/start-szablonu.yaml'); expect(sub[sub.length - 1]).toBe(NOT_NOW);
});

test('31 (run 39410740673): po wyborze zamiennika przewinięcie do „instead of: …” z wyśrodkowaniem zamiast samego czekania', () => {
  const s = steps('31-pierwszy-tydzien.yaml'); const i = s.indexOf('- tapOn: "Suggestion 1: .*"');
  expect(i).toBeGreaterThan(0);
  expect(s[i + 1]).toBe('- scrollUntilVisible: { element: "instead of: Bent Over Row \\\\(Barbell\\\\).*", direction: UP, timeout: 30000, centerElement: true }');
});
