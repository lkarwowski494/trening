/* PIN_NOW: przesunięcie zegara całego przebiegu (tests/pin-now.js) — do przebiegu tests-tz.yml w nocy zmiany czasu (docs/18, 25.10.2026). */
const { parsePinNow, applyPinNow } = require('./pin-now');

describe('PIN_NOW — zegar przebiegu przypięty do chwili', () => {
  test('parsePinNow: brak = null; ISO w UTC = milisekundy; inny zapis = błąd (strefa lokalna dałaby inną chwilę na każdej maszynie)', () => {
    expect(parsePinNow(undefined)).toBeNull(); expect(parsePinNow('')).toBeNull();
    expect(parsePinNow('2026-10-25T02:30:00Z')).toBe(Date.UTC(2026, 9, 25, 2, 30));
    expect(parsePinNow('2026-03-29T03:00Z')).toBe(Date.UTC(2026, 2, 29, 3, 0));
    expect(() => parsePinNow('2026-10-25 02:30')).toThrow(/PIN_NOW/); expect(() => parsePinNow('2026-10-25T02:30:00+01:00')).toThrow(/PIN_NOW/);
  });
  test('applyPinNow: Date.now() i new Date() startują w podanej chwili i idą dalej; Date(arg) bez zmian; bez wartości — bez zmian', () => {
    const g: { Date: DateConstructor } = { Date };
    expect(applyPinNow(undefined, g)).toBe(false); expect(g.Date).toBe(Date);
    expect(applyPinNow('2026-10-25T02:30:00Z', g)).toBe(true);
    const t0 = g.Date.now(); expect(Math.abs(t0 - Date.UTC(2026, 9, 25, 2, 30))).toBeLessThan(60_000);
    expect(Math.abs(new g.Date().getTime() - t0)).toBeLessThan(60_000);
    expect(new g.Date(2020, 0, 1).getFullYear()).toBe(2020); expect(new g.Date('2021-05-05T00:00:00Z').getTime()).toBe(Date.UTC(2021, 4, 5));
    expect(g.Date.UTC(2026, 0, 1)).toBe(Date.UTC(2026, 0, 1));
  });
  test('w tym przebiegu: jeśli ustawiono PIN_NOW, zegar testu jest w jego pobliżu (całość przebiegu)', () => {
    if (!process.env.PIN_NOW) return;
    expect(Math.abs(Date.now() - parsePinNow(process.env.PIN_NOW))).toBeLessThan(3 * 3600_000);
  });
});
