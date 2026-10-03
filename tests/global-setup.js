/* Strefa czasowa testów: Europe/Warsaw (strefa właściciela), chyba że TZ podano jawnie.
 * Ustawiana tu, w procesie głównym Jest, zanim wystartują procesy robocze — dziedziczą ją od startu.
 * Zmiana process.env.TZ w trakcie testu nie działa na macOS (przebieg iphone-local 03.10.2026: test zmiany czasu
 * dostał UTC), więc testy zależne od strefy nie mogą polegać na przełączaniu jej w locie. */
module.exports = () => { if (!process.env.TZ) process.env.TZ = 'Europe/Warsaw'; };
