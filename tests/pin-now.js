/* Przesunięcie zegara ściennego całego przebiegu Jest (PIN_NOW=<ISO>): „teraz” startuje w podanej chwili i idzie dalej jak zegar.
 * Używa go tests-tz.yml (zadanie „zmiana czasu”): ten sam zestaw biegnie w nocy zmiany czasu (nocne 25.10.2026 — testy zależne od „teraz”, docs/40).
 * Bez PIN_NOW nic się nie zmienia. Jedno miejsce z logiką; tests/setup.js tylko je wywołuje. */
function parsePinNow(v) {
  if (v == null || v === '') return null;
  const ms = Date.parse(v);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?Z$/.test(String(v)) || !Number.isFinite(ms)) throw new Error(`PIN_NOW: oczekiwano ISO w UTC (np. 2026-10-25T02:30:00Z), jest: ${v}`);
  return ms;
}
function applyPinNow(v, g = globalThis) {
  const target = parsePinNow(v); if (target == null) return false;
  const Real = g.Date; const delta = target - Real.now();
  class Shifted extends Real {
    constructor(...a) { if (a.length === 0) super(Real.now() + delta); else super(...a); }
    static now() { return Real.now() + delta; }
  }
  g.Date = Shifted; return true;
}
module.exports = { parsePinNow, applyPinNow };
