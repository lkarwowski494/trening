/*
 * Scenariusze Maestro (.maestro/*.yaml) wykonywane w Jest na całej aplikacji (EN, region symulatora en-US) — przebieg E2E 89 (09.10.2026):
 * 12 z 16 scenariuszy padło na tekstach i etykietach zmienionych w fali 2 audytu 0.10, a każdy przebieg na symulatorze trwa ~40 min i pokazuje
 * tylko PIERWSZY nieaktualny krok. Ten interpreter przechodzi KAŻDY krok każdego scenariusza na drzewie dostępności z Jest, więc nieaktualny
 * selektor (tekst, etykieta VoiceOver, okno, jednostka z regionu) wychodzi lokalnie, zanim scenariusz trafi na symulator.
 *
 * Uproszczenia (nazwane): „widoczny” = w drzewie i na ekranie wg przybliżonego układu (tests/maestro-layout.ts, E2E 91: wysokości ze stylów i długości
 * tekstu, przewijanie list — scrollUntilVisible jak w Maestro, fokus pola przewija je nad klawiaturę; element poza ekranem jest „niewidoczny”, tap
 * w element pod paskiem zakładek albo pod klawiaturą — błąd); dopasowanie jak
 * w Maestro (Filters.textMatches, bez wielkości liter): wyrażenie regularne do CAŁEJ etykiety (accessibilityLabel), a bez niej do tekstu (Text bez
 * dostępnego przodka), wartości i placeholdera pola; ekrany pod spodem stosu (aria-hidden) niewidoczne; pasek nawigacji (w Jest się nie renderuje)
 * odtworzony z opcji ekranu: tytuł i „Back” na górze; `below`/`above` — kolejność w drzewie (przy otwartym oknie Alert — pozycje w pionie okna w układzie iOS, „cancel” na dole,
 * i ekranu pod nim; run 37900617167); czas: zegar Jest
 * przesuwany krokami. Okna (Alert, Alert.prompt, ActionSheetIOS) z mocków tests/setup.js. Gest przesunięcia w lewo = akcja dostępności „delete”.
 * Na scenariuszach z dfa7ab8 interpreter odtwarza 11 z 12 porażek przebiegu 89 w tym samym kroku (wyjątek: 16 — chip poza ekranem; od E2E 91
 * łapie go układ — tests/maestro-e2e91.test.tsx).
 * E2E 91 (09.10.2026, 7 z 17): odtwarza 5 z 7 w tym samym kroku (01 etykieta grupy, 10 kotwica nad ekranem, 13 okno zgody, 15 i 17 element pod
 * krawędzią) — tests/maestro-e2e91.test.tsx; 07 (systemowy baner iOS nad aplikacją) i 11 (pole przy klawiaturze numerycznej) — tests/maestro-selectors.
 * Selektor z kluczem, którego interpreter nie zna, jest błędem (żeby nic nie przechodziło po cichu). MAESTRO_DIR — inny katalog scenariuszy,
 * MAESTRO_DUMP=<fragment kroku> — wypisuje elementy z szacowanymi pozycjami po tym kroku.
 */
import { readdirSync } from 'fs';
import { join } from 'path';
import { Runner, DIR, load } from './maestro-runner';

jest.setTimeout(240000);
const flows = readdirSync(DIR).filter(f => /^\d\d-.*\.yaml$/.test(f)).sort();
describe('scenariusze Maestro na drzewie dostępności (EN, en-US)', () => {
  afterAll(() => { delete (global as any).__notifPerm; });
  test.each(flows)('%s', async f => { const r = new Runner(f); await r.run(load(join(DIR, f)), f); });
});
