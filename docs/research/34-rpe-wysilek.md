# 34 — RPE serii a ocena wysiłku treningu w Apple Zdrowie (wydanie 0.16)

Badacz merytoryczny, 12.10.2026. Źródła przeczytane 12.10.2026. Dotyczy punktu [OTWARTE] z docs/21 (wydanie Health) i docs/18-archiwum
(„przeliczenie RPE → ocena [OTWARTE]”). Stan aplikacji: `lib/state/effort.ts` — w danych RPE serii 1–10 (skala RPE oparta na RIR,
RIR = 10 − RPE, Zourdos 2016 / Helms 2016 / Bastos 2024), wpis opcjonalny przy serii.

## Wnioski

1. **Dokumentacja Apple nie definiuje skali ani znaczenia `workoutEffortScore` / `estimatedWorkoutEffortScore`.** Strony typów, jednostki
   `HKUnit.appleEffortScore()` i metody `relateWorkoutEffortSample(_:with:activity:)` mają puste opisy (tylko deklaracje i dostępność:
   iOS 18.0 / watchOS 11.0). Jedyne oficjalne słowa Apple o skali: komunikat prasowy watchOS 11 — skala „1 to 10”, ocena wpisywana ręcznie
   dla treningów siłowych, obciążenie treningowe = średnia ważona oceny wysiłku i czasu trwania z 28 dni.
2. **Ocena Apple jest oceną całego treningu (sesyjną), nie serii.** Wynika to wprost z komunikatu Apple („after each workout … how difficult
   it was”) i z tego, że ocena jest wiązana z obiektem treningu (`relateWorkoutEffortSample … with workout`). Połączenie z czasem trwania
   w obciążeniu treningowym jest kierunkowo tym samym pomysłem co sesyjne RPE Fostera (RPE × minuty) — **to nasze wnioskowanie**, Apple nie
   podaje źródła metody.
3. **RPE serii i sesyjne RPE to różne miary — nie są równoważne.**
   - RPE serii w aplikacji to skala oparta na powtórzeniach w zapasie (bliskość upadku jednej serii); Helms 2016 opisuje ją jako odrębną od
     klasycznych skal Borga/CR-10 i trafniejszą przy seriach blisko upadku.
   - Sesyjne RPE (Foster) to jedna ocena całej sesji na zmodyfikowanej skali CR-10, zbierana po treningu (w badaniach zwykle po 30 min).
   - Badania porównujące średnią z ocen serii z sesyjnym RPE w treningu oporowym dają wyniki niezgodne: Sweet 2004 — sesyjne RPE może
     „istotnie zaniżać” średnią z ocen po seriach; Singh 2007 — różnica w protokołach siłowym i hipertroficznym, brak w mocy; Egan 2006 —
     brak istotnej różnicy. Przegląd systematyczny Lea 2022 podsumowuje to jako niejednoznaczne („optimum implementation of S-RPE requires
     further investigation”). Uwaga: trzy badania pochodzą z jednego środowiska (McGuigan/Foster) — nie są w pełni niezależne; Lea 2022
     jest niezależnym przeglądem (szczebel 2).
   - Te badania używały klasycznych skal (CR-10/OMNI) także dla serii, a nie skali RIR — dla średniej z RPE-RIR serii nie znaleziono
     żadnego porównania z sesyjnym RPE **[OTWARTE]**.
   - Dodatkowo: w aplikacji RPE serii jest opcjonalne (często puste), nie obejmuje rozgrzewki, przerw ani części cardio sesji.
4. **Czy skala Apple to CR-10?** Twierdzi tak jeden deweloper na forum Apple (bez odpowiedzi Apple; „from what I can tell”). Ten sam wpis
   podaje opisy w aplikacji Fitness: 1–3 łatwo, 4–6 umiarkowanie, 7–8 ciężko, 9–10 maksymalnie — **jedno źródło, szczebel 5, niepotwierdzone
   przez Apple** → [OTWARTE], nie do aplikacji.
5. **Zapis przez aplikację zewnętrzną** — według tego samego wpisu na forum próbki oceny nie da się zapisać zwykłym `save`, trzeba ją
   powiązać z treningiem (`relateWorkoutEffortSample`), a dopuszczalne wartości to 0–10. Istnienie metody `relate…` potwierdza dokumentacja
   Apple; reszta — **jedno źródło (forum, nie Apple)**, do sprawdzenia na urządzeniu.

## Opcje (ocena źródłowa; decyzja produktowa należy do właściciela)

| Opcja | Opis | Podstawa merytoryczna | Ocena |
|---|---|---|---|
| A. Brak zapisu | Aplikacja nie zapisuje oceny wysiłku do Zdrowia; użytkownik może ją wpisać w aplikacji Fitness / na zegarku (Apple pozwala na edycję oceny po treningu — instrukcja Apple Watch). | Nie wymaga żadnego twierdzenia merytorycznego. | Bezpieczna; zero ryzyka błędnych danych (wytyczna 5.1.3(ii): zakaz zapisywania danych „false or inaccurate” do HealthKit). |
| B. Sesyjna ocena podana przez użytkownika | Po zakończeniu treningu opcjonalne pytanie „Jak ciężki był cały trening? 1–10”, zapis bez przeliczania do `workoutEffortScore` powiązany z treningiem. | Sesyjne RPE jako ocena całej sesji ma poparcie w przeglądach (Haddad 2017, Lea 2022 — szczebel 2) i odpowiada temu, czego Apple oczekuje (ocena po treningu, 1–10). Nie wymaga przeliczania skal. | **Rekomendowana, jeśli zapis ma być.** Uproszczenie: Apple nie publikuje opisów skali, więc nie twierdzimy, że to „CR-10 Fostera” — pokazujemy własne opisy kierunkowo zgodne (1 = bardzo lekko, 10 = maksymalnie). Badania mierzyły ocenę po ok. 30 min, my pytamy od razu — nazwać uproszczeniem. |
| C. Wyliczenie ze średniej RPE serii | Średnia z RPE serii zapisana jako ocena treningu. | Brak: skale różne (RIR vs CR-10), wyniki porównań średniej i sesyjnego RPE niezgodne (Sweet 2004, Singh 2007 vs Egan 2006; Lea 2022), żadnych danych dla skali RIR. | **Odradzana** — byłaby liczbą nieznanego pochodzenia; ryzyko danych niedokładnych w Zdrowiu. Ewentualnie tylko jako *podpowiedź* do zatwierdzenia w opcji B — też [OTWARTE], bo nie ma źródła, że średnia jest dobrym punktem startu. |

Dodatkowa uwaga (decyzja 11.10.2026, etap 2 — łączenie z treningiem z zegarka): jeśli trening zapisał zegarek, użytkownik mógł już podać
ocenę na zegarku; zapis z aplikacji mógłby ją nadpisać/zdublować — zachowanie API w takim przypadku [OTWARTE] (dokumentacja milczy).

## Źródła

Szczebel 2 (przeglądy):
- Lea JWD i in. 2022, „Convergent Validity of Ratings of Perceived Exertion During Resistance Exercise…”, Sports Med Open 8:2 —
  https://pmc.ncbi.nlm.nih.gov/articles/PMC8742800/ (Dyskusja, część o sesyjnym RPE): „mean RPE-O, taken immediately after each set, elicits
  significantly higher ratings than S-RPE”; „The optimum implementation of S-RPE requires further investigation.”; o skalach: „The specific RPE
  scale used did not influence the reported effect sizes.” (dotyczy trafności względem intensywności, nie przeliczania między skalami).
- Haddad M i in. 2017, „Session-RPE Method for Training Load Monitoring…”, Front Neurosci — https://pmc.ncbi.nlm.nih.gov/articles/PMC5673663/
  (Wprowadzenie, opis metody): „TL(A.U.)=RPE x session duration (min)”; Foster i in. „modified the verbal anchors used in the CR-10 scale”.

Szczebel 3 (badania):
- Helms ER i in. 2016, Strength Cond J — https://pmc.ncbi.nlm.nih.gov/articles/PMC4961270/ (Wprowadzenie; sekcja „Benefits of Using a
  Repetitions in Reserve–Based Scale…”): skala RIR „more valid than traditional RPE for sets performed with near-limit loading”; sesyjne RPE:
  „an RPE score for the entire training bout is obtained”.
- Sweet TW, Foster C, McGuigan MR, Brice G 2004, JSCR 18(4):796–802 — streszczenie: https://lida.sport-iat.de/ta/Record/4009123 — sesyjne RPE
  „may meaningfully underestimate the average intensity rated immediately after each set”. (Tylko streszczenie.)
- Singh F, Foster C, Tod D, McGuigan MR 2007, IJSPP 2(1):34–45 — streszczenie: https://ro.ecu.edu.au/ecuworks/1686 — „a difference between
  both the 2 RPE values of the strength and hypertrophy protocols but no difference … for the power protocol”. (Tylko streszczenie.)
- Egan AD, Winchester JB, Foster C, McGuigan MR 2006, J Sports Sci Med 5:289–295 — https://www.jssm.org/jssm-05-289.xml-Fulltext
  (Streszczenie, Dyskusja): „When comparing average RPE and session RPE, no significant difference was found.”

Szczebel 4 (dokumentacja producenta):
- Apple, `HKQuantityTypeIdentifier.workoutEffortScore` — https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier/workouteffortscore
  (brak opisu; dostępność iOS 18.0, watchOS 11.0). Tak samo `estimatedWorkoutEffortScore`, `HKUnit.appleEffortScore()`,
  `HKHealthStore.relateWorkoutEffortSample(_:with:activity:completion:)` — puste opisy (odczyt danych JSON stron, 12.10.2026).
- Apple Newsroom, 10.06.2024, „watchOS 11 brings powerful health and fitness insights” —
  https://www.apple.com/newsroom/2024/06/watchos-11-brings-powerful-health-and-fitness-insights/ (część „Training Load”): ocena „to track how
  difficult it was on a scale from 1 to 10”; obciążenie to „a weighted average taking into account both the effort ratings and duration”.
- Apple Watch User Guide (watchOS 26), „Start a workout” → „Rate your effort” —
  https://support.apple.com/en-by/guide/watch/apd95450de2a/26/watchos/26: „After completing a cardio-focused workout, you can adjust estimated
  ratings of how hard you exercised.” (strona nie podaje skali ani opisów).

Szczebel 5 (forum, wskazówka):
- Apple Developer Forums, wątek 765438 (deweloper, nie Apple, X 2024) — https://developer.apple.com/forums/thread/765438: „They're specifically
  using the CR-10 scale, at least from what I can tell by saving values to HealthKit.” Opisy 1–3/4–6/7–8/9–10 i uwaga o `relate…` — **jedno
  źródło**.

## Otwarte pytania

- [OTWARTE] Oficjalna skala i opisy słowne `workoutEffortScore` (czy CR-10, czy 0 jest dopuszczalne, czy wartości ułamkowe).
- [OTWARTE] Zachowanie `relateWorkoutEffortSample`, gdy trening ma już ocenę z zegarka (nadpisanie, dwie próbki?) — test na urządzeniu.
- [OTWARTE] Czy średnia z RPE-RIR serii ma jakikolwiek związek z sesyjnym RPE — brak badań; nie używać do wyliczeń.
- [OTWARTE] Czy ocena podana od razu po treningu (bez 30 min) jest wystarczająco zbliżona — Lea 2022 przytacza sprzeczne wyniki
  (Kraft: brak różnicy 10 vs 30 min; Singh: różnica 5–10 vs 30 min) → przy opcji B nazwać to uproszczeniem.
