/* Strefa czasowa testów: Europe/Warsaw (strefa właściciela), chyba że TZ podano jawnie.
 * Ustawiana tu, w procesie głównym Jest, zanim wystartują procesy robocze — dziedziczą ją od startu.
 * Zmiana process.env.TZ w trakcie testu nie działa na macOS (przebieg iphone-local 03.10.2026: test zmiany czasu
 * dostał UTC), więc testy zależne od strefy nie mogą polegać na przełączaniu jej w locie.
 * TST2-07: ziarno testów własności ustalane raz na przebieg (PROP_SEED=random → liczba w process.env, dziedziczona przez procesy robocze)
 * i wypisywane w logu — do odtworzenia porażki: PROP_SEED=<liczba> npx jest <plik>. */
const { resolvePropSeed } = require('./prop-seed');
module.exports = () => {
  if (!process.env.TZ) process.env.TZ = 'Europe/Warsaw';
  const { seed, mode } = resolvePropSeed(process.env.PROP_SEED);
  if (mode === 'losowe') process.env.PROP_SEED = String(seed);
  console.log(`\ntesty własności (fast-check): PROP_SEED=${seed} (${mode}; odtworzenie: PROP_SEED=${seed} npx jest <plik>)`); // eslint-disable-line no-console
};
