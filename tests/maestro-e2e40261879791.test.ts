/*
 * Regresja przebiegu E2E 40261879791 (gałąź naprawa-nocne-2026-10-25, scenariusz 26, krok „Rest” po dwóch „Previous month”; padł dwa razy, 5m45s i 6m06s).
 * Przyczyna: scenariusz, nie aplikacja. Po „Wolne w tym dniu” strona jest przewinięta w dół, strzałki miesiąca leżą pod nagłówkiem (bounds y=38) — Maestro
 * uznaje je za widoczne, więc stuknięcia trafiły w przycisk „Log a past workout” i otwarły „Past workout” (zrzut step-164). Interpreter nie odtwarza
 * przewinięcia — test strukturalny (docs/09, jak E2E 39855279042): przed „Previous month” musi być scrollUntilVisible UP z centerElement.
 */
import { join } from 'path';
import { DIR, load } from './maestro-runner';

type Cmd = any;
const kind = (x: Cmd) => (typeof x === 'string' ? x : Object.keys(x)[0]);

test('26: przed stuknięciem „Previous month” przewinięcie do strzałki ze środkowaniem', () => {
  const c: Cmd[] = load(join(DIR, '26-plan-zarzadzanie.yaml'));
  const i = c.findIndex(x => x && x.tapOn === 'Previous month');
  expect(i).toBeGreaterThan(0);
  expect(kind(c[i - 1])).toBe('scrollUntilVisible');
  expect(c[i - 1].scrollUntilVisible).toMatchObject({ element: 'Previous month', direction: 'UP', centerElement: true });
});
