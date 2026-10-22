/*
 * Regresja przebiegu E2E 39855279042 (gałąź podglad-m5s1b = b31bcd3, pakiet podstawowy, część 2, iPhone, en-US). Przyczyna: scenariusze, nie aplikacja
 * (zmiany od 97882a0 nie dotykają ekranu treningu ani Postępów; limit M5 S1 i data nie grają roli — trening na żywo ma < 20 min, a przebieg był ok. 22:00 UTC):
 *  - 31 krok 118: po „+ set” lista bywa przewinięta głębiej, 2 × swipe zatrzymały się na „Back Squat”, „Finish” poza hierarchią → „Element not found”; powtórzenie
 *    samego stuknięcia nie przewijało. Teraz przesunięcia i przewinięcie do „Finish” są wewnątrz retry.
 *  - 31 krok 175 (ponowienie): nagłówek „RECORDS” pod nagłówkiem ekranu po stuknięciu już wybranego ćwiczenia — przewinięcie do niego w retry (jak 32).
 *  - 13 krok 73: układ przesunięty (karta zgody) między odczytem hierarchii a stuknięciem — każdy dzień planu w retry.
 * Interpreter nie odtwarza głębokości przewinięcia ani przesunięcia układu — test strukturalny (docs/09, jak E2E 38607952098).
 */
import { join } from 'path';
import { DIR, load } from './maestro-runner';

type Cmd = any;
const kind = (x: Cmd) => (typeof x === 'string' ? x : Object.keys(x)[0]);
const retries = (f: string): Cmd[] => load(join(DIR, f)).filter((c: Cmd) => c && typeof c === 'object' && 'retry' in c);

describe('E2E 39855279042: 31 i 13 — przewijanie i stuknięcia w retry', () => {
  test('31: „Finish” — przesunięcia, przewinięcie do „Finish”, stuknięcie i pytanie w jednym retry (≥ 3 powtórzenia)', () => {
    const r = retries('31-pierwszy-tydzien.yaml').find(c => JSON.stringify(c).includes('Finish workout'));
    expect(r).toBeTruthy(); expect(r.retry.maxRetries).toBeGreaterThanOrEqual(3);
    expect(r.retry.commands.map(kind)).toEqual(['swipe', 'swipe', 'waitForAnimationToEnd', 'scrollUntilVisible', 'tapOn', 'extendedWaitUntil']);
    expect(r.retry.commands[3].scrollUntilVisible).toMatchObject({ element: 'Finish', direction: 'UP', centerElement: true });
  });
  test('31: poza retry nie zostało samotne przesunięcie przed „Finish”', () => {
    const c = load(join(DIR, '31-pierwszy-tydzien.yaml')); const i = c.findIndex((x: Cmd) => JSON.stringify(x).includes('Finish workout'));
    expect(kind(c[i - 1])).not.toBe('swipe');
  });
  test('31: „RECORDS” — przewinięcie do nagłówka po stuknięciu ćwiczenia, w retry', () => {
    const r = retries('31-pierwszy-tydzien.yaml').find(c => JSON.stringify(c).includes('RECORDS'));
    expect(r).toBeTruthy();
    expect(r.retry.commands.map(kind)).toEqual(['scrollUntilVisible', 'waitForAnimationToEnd', 'tapOn', 'scrollUntilVisible', 'extendedWaitUntil']);
    expect(r.retry.commands[3].scrollUntilVisible).toMatchObject({ element: 'RECORDS', direction: 'UP' });
  });
  test('13: każdy dzień od wtorku do soboty — wiersz i szablon w jednym retry', () => {
    const rs = retries('13-kalendarz-plan.yaml');
    for (const d of ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']) {
      const r = rs.find(c => JSON.stringify(c.retry.commands) === JSON.stringify([{ tapOn: `${d}, Rest` }, { tapOn: `${d}: Upper A` }]));
      expect(r).toBeTruthy();
    }
  });
});
