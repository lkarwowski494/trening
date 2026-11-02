/*
 * Scenariusz 17 (przebieg 41400907053, 02.11.2026): krok „Deadlift, barbell.*” padł, bo symulator zgubił literę przy inputText (zrzut: pole „Deadlft”, „No matches”,
 * przycisk Utwórz „Deadlft”). Aplikacja jest poprawna (wyszukiwanie „Deadlift” zwraca ćwiczenia). Scenariusz powtarza wpis raz, gdy wiersza nie widać.
 * Strażnik: po pierwszym wpisie „Deadlift” jest warunkowe ponowienie z tym samym polem i wpisem, a dopiero potem twarda asercja wiersza.
 */
import { join } from 'path';
import { DIR, load } from './maestro-runner';

const cmds = () => load(join(DIR, '17-biblioteka-technika.yaml')) as any[];

test('17: po wpisie „Deadlift” warunkowe ponowienie wpisu przed twardą asercją wiersza', () => {
  const c = cmds(); const iType = c.findIndex(x => x.inputText === 'Deadlift');
  const iAssert = c.findIndex((x, k) => k > iType && x.extendedWaitUntil && x.extendedWaitUntil.visible === 'Deadlift, barbell.*');
  expect(iType).toBeGreaterThan(-1); expect(iAssert).toBeGreaterThan(iType);
  const retry = c.slice(iType + 1, iAssert).find(x => x.runFlow && x.runFlow.when && x.runFlow.when.notVisible === 'Deadlift, barbell.*');
  expect(retry).toBeTruthy();
  const inner = retry.runFlow.commands as any[];
  expect(inner.some(x => x.tapOn && x.tapOn.id === 'exercises-search')).toBe(true);
  expect(inner.some(x => x.inputText === 'Deadlift')).toBe(true);
});
