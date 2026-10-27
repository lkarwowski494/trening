### 02-monetyzacja-506 · Porównanie „jak jedno espresso” w opisie (33 lokalizacje) nie jest sprawdzone dla wszystkich krajów sprzedaży; decyzja o Ukrainie z 13.10 bez wdrożenia i bez zamknięcia
- Pozycja listy kontrolnej: MON-17
- Poziom: P2
- Realność: brzegowy (równoważniki Apple dla 0,99 USD w większości krajów leżą w okolicy 1 €; nie sprawdzono, czy gdzieś wyraźnie przekraczają 1,51 €) · Pewność: wysoka co do braku sprawdzenia
- Rodzaj: P (decyzja produktowa)
- Dowód: opis sklepu we wszystkich lokalizacjach: "plan miesięczny w cenie porównywalnej z jednym espresso w barze*" z przypisem o cenach we Włoszech 1,06–1,51 € (store/app-store-metadata.json). Warunek otwarty w źródle: `docs/research/espresso-mimit-2026-10.md:19` ("ceny planu miesięcznego we wszystkich krajach … do sprawdzenia"). Kontrola ASC obejmuje 8 terytoriów i strefę euro (`store/asc-kontrola.json:10`). Decyzja 13.10 o Ukrainie (`docs/18-przekazanie.md:179`) jest wciąż "[OTWARTE]" w `docs/15-app-store.md:135` i nie ma jej w kontroli. Dostępność: wszystkie kraje poza Chinami (`docs/18-przekazanie.md:591`). Rachunek PL: 4,99 zł ≈ 1,13 € (dowody/kursy-nbp.txt).
- Wzorzec lub źródło: 2.3.1 i zasada 2 wspólna (dowód zamiast deklaracji); CLAUDE.md „Nie zgaduj liczb”.
- Kroki w aplikacji: n/d (opis sklepu); czytelnik w kraju, w którym 0,99 USD to wyraźnie więcej niż 1,51 €, dostaje nieprawdziwe porównanie.

- Test akceptacyjny: zapis w docs/research z datą: lista krajów z ceną miesięczną w EUR, wszystkie ≤ 1,51 € albo wskazane korekty; decyzja UA ze statusem w docs/18.


### 11-wzrost-001 · Po imporcie historii pierwszy trening na żywo kończy się oknem „Uczciwe zasady” i prośbą o ocenę naraz
- Pozycja listy kontrolnej: WZR-04
- Poziom: P2
- Realność: realny (import z plików CSV popularnych dzienników jest w opisie sklepu, `store/app-store-metadata.json:8`; przesiadka z innej aplikacji to typowa droga) · Pewność: wysoka
- Rodzaj: D
- Dowód:
  - bramka liczy wszystkie zakończone treningi, także importowane i dopisane wstecz: `lib/review-run.ts:28` „finishedWorkouts: finishedWorkouts().length”;
  - lista zakończonych filtruje tylko po dacie końca: `lib/state/history.ts:15` „getState().workouts.filter(w => w.finishedAt)”;
  - znacznik `live` mają wyłącznie treningi rozpoczęte w aplikacji: `lib/state/start.ts:26` „trening wstecz i import CSV tworzą Workout osobno, bez niego”;
  - ekran podsumowania wywołuje w jednym przebiegu okno i opóźnioną (1500 ms) prośbę: `lib/review-run.ts:63` „if (onFairRules && fairRulesDue(w)) onFairRules();”;
  - sonda w scratchpadzie (10 treningów bez `live` + pierwszy na żywo z rekordem, użytkownik `free`): „okno Uczciwe zasady = 1 ; prośby o ocenę do systemu = 1” — `dowody/sonda-prosba-o-ocene.txt`;
  - żaden test nie łączy tych dwóch reguł (`dowody/grep-prosba-o-ocene.txt`); niezmiennik „nigdy dwa na jednym ekranie” obejmuje tylko link Poproś o funkcję: `docs/34-wsparcie-i-opinie.md:61`.
- Wzorzec lub źródło: HIG Ratings and reviews (odczyt 27.10.2026): „Avoid asking for a rating on first launch or during onboarding, because people haven’t had enough time to gain a clear understanding of your app’s value”; zasada twarda projektu `docs/26-prosba-o-ocene.md:30` „Nigdy przy pierwszym uruchomieniu/onboardingu ani przed pierwszym ukończonym treningiem”.
- Kroki w aplikacji: nowa instalacja → Więcej → Kopia zapasowa → import CSV z innego dziennika (albo dopisanie 3 treningów wstecz) → pierwszy trening na żywo z rekordem → „Zakończ” → okno „Pierwszy trening za Tobą!” z „Zobacz plany Pro ›”, po 1,5 s systemowe okno oceny (w wydaniu ze sklepu; w TestFlight okna oceny nie ma).

- Test akceptacyjny: test scenariuszowy jak sonda (import + pierwszy trening na żywo z rekordem, `free`) → `__review.requested === 0`; niezmiennik własności: na jednym podsumowaniu najwyżej jedno z {okno „Uczciwe zasady”, prośba o ocenę, link „Poproś o funkcję”}; wektory 7 z 7 dalej zielone.


### 01-odkrywanie-008 · Polityka prywatności wymienia nieaktualnych odbiorców poczty
- Pozycja listy kontrolnej: ODK-02
- Poziom: P2
- Realność: realny (każdy czytelnik polityki), skutek mały (nadmiarowe ujawnienie, nie zatajenie) · Pewność: wysoka
- Rodzaj: D
- Dowód: `site/privacy.html:89` — poczta «dziś Gmail, po przeniesieniu Google Workspace» oraz rejestrator przekazujący pocztę; ta sama treść na stronie apps4brew.com (odczyt 27.10, dowody/polityka-porkbun.txt); decyzja 21.10: Workspace działa, przekierowania usunięte, «Do zrobienia: usunięcie … z listy odbiorców w polityce prywatności» (`docs/18-przekazanie.md:400`).
- Wzorzec lub źródło: App Review 2.3 (odczyt 27.10): metadane „including privacy information” mają odpowiadać stanowi.
- Kroki w aplikacji: Ustawienia → Prywatność (link) albo ekran zakupu → Prywatność.

- Test akceptacyjny: grep nazwy rejestratora w `site/privacy.html` = 0; `scripts/check-urls.mjs` zgodność z opublikowaną stroną.


### 02-monetyzacja-002 · Wiersz „Pełna wersja” w Ustawieniach (stan darmowy) wygląda jak stan, nie jak wejście do zakupu
- Pozycja listy kontrolnej: MON-11 (wygląd i brzmienie: SP-09, rola 04 — zgłaszam sam, raportów innych ról nie czytam)
- Poziom: P2
- Realność: realny · Pewność: średnia
- Rodzaj: D (defekt)
- Dowód: `components/SubscriptionCard.tsx:16` tytuł wiersza to nazwa produktu „Pełna wersja”, podtytuł (`components/SubscriptionCard.tsx:13`) to licznik wykorzystanych dni; wiersz ma rolę przycisku i znak „›”, ale tytuł czyta się jak opis posiadanego stanu (obserwacja właściciela, T-11, 27.10).
- Wzorzec lub źródło: strona subskrypcji Apple (odczyt 2026-10-27): ekran ma dawać „A way for current subscribers to sign in or restore purchases”; wejście do zakupu i przywracania musi być rozpoznawalne. Katalog wzorców `docs/32-wzorce-interakcji.md` (wzorzec przejść).
- Kroki w aplikacji: Więcej → Ustawienia → sekcja „Subskrypcja” → wiersz „Pełna wersja / Darmowe dni treningowe w tym miesiącu: wykorzystano 2 z 5”.

- Test akceptacyjny: test ekranu Ustawień w stanie `free` i `full`: tytuł w `free` jest wezwaniem do działania, w `full` nazywa plan; tłumaczenia w słowniku.


### 08-programista-005 · Wiersz „Pełna wersja” w Ustawieniach w stanie darmowym czyta się jak stan, nie jak akcja
- Pozycja listy kontrolnej: brak pozycji DEV (wymiar „dostępność w komponentach”; wygląd i tekst należą do roli 04)
- Poziom: P2
- Realność: realny (każdy użytkownik darmowy) · Pewność: średnia (ocena czytelności; zgłoszone z telefonu T-11)
- Rodzaj: P (decyzja produktowa)
- Dowód: tytuł jest stały niezależnie od stanu: `components/SubscriptionCard.tsx:16` „<Item title={t('Pełna wersja')}”. W stanie darmowym podpis to licznik dni, więc wiersz brzmi „Pełna wersja — Darmowe dni treningowe…: wykorzystano 2 z 5”. VoiceOver ogłasza przycisk, ale wzrokowo jedyną wskazówką akcji jest znak „›”.
- Wzorzec lub źródło: docs/32 (wzorce interakcji, spójne etykiety akcji); uwaga T-11.
- Kroki w aplikacji: użytkownik darmowy → Więcej → Ustawienia → sekcja „Subskrypcja”.

- Test akceptacyjny: test karty w stanach free, full, lifetime sprawdza tytuł i etykietę VoiceOver.


