/* Liczby zmiennoprzecinkowe poza Linuksem x64 (06.11.2026, build TestFlight 1.0.1 na runnerze macOS, przebieg 42265419689).
 * Wzorce figur (tests/fixtures/figury-v2-zlote.json) i pliki póz (lib/figures/v2/poses/*.json) powstały na Linuksie. V8 liczy sin/cos/atan2/acos własnym kodem C++,
 * który na arm64 (macOS) kompilator łączy w instrukcje FMA — wynik różni się o 1 ulp (~1e-16), a po zaokrągleniu do 0,1 (r1) albo do 2 miejsc w SVG
 * wartość leżąca dokładnie na granicy zaokrąglenia przeskakuje o jeden krok. Na Linuksie porównanie zostaje BAJTOWE (nic nie osłabione);
 * gdzie indziej: pozy z tolerancją TOLERANCJA_POZ, odciski figur tylko po kształtach (raw, zaokrąglone do 1e-9), bo odcisk SVG zależy od zaokrąglenia tekstu. */
export const INNA_ARYTMETYKA = process.platform !== 'linux';
/** Jednostki modelu (te same co współrzędne i kąty w plikach póz). Symulacja: sin/cos/atan2/acos przesunięte o 1 ulp w 10–50% wywołań dają różnice póz do 0,7 (zaokrąglenia do 0,1 i progi), mediana ~1e-15. */
export const TOLERANCJA_POZ = 1;
