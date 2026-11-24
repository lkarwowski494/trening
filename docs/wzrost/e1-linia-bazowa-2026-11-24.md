# E1 – linia bazowa najlepszych w niszy (dziennik treningowy / siłownia)
Data odczytu wszystkich źródeł: 2026-11-24. Surowe pliki: <katalog roboczy agenta, poza repo>/zrodla-e1a/
Źródła: S1 = `https://itunes.apple.com/search?term=<t>&country=pl|us&entity=software&limit=25` (terminy: dziennik treningowy, gym log, workout tracker, siłownia; US: gym log, workout log); S2 = `https://itunes.apple.com/lookup?id=<ID>&country=pl|us`; S3 = `https://apps.apple.com/pl|us/app/id<ID>`; S4 = `https://itunes.apple.com/us/rss/customerreviews/id=<ID>/sortby=mostrecent/json`.
Uwaga: RSS dla PL zwrócił 0 wpisów (nie odczytano); dla Strong i Fitbod RSS US też 0 (nie odczytano). Tylko Hevy i Gravitus mają 50 najnowszych recenzji US.

## 1. Wybór kandydatów (log siłowy, nie cardio, nie RepsGoat)
Wg największego `userRatingCount` (S1+S2). Fitbod to generator planów AI z logowaniem, ale ma największą bazę ocen – wybrany jako 3. wg reguły "największa liczba ocen"; Gravitus dodany jako 4. (czysty logger, #2 w PL).
| App (trackId) | Sprzedawca | Oceny PL | Oceny US | Śr. PL / US | Cena | Wersja bieżąca z dnia |
|---|---|---|---|---|---|---|
| Hevy (1458862350) | Hevy Studios S.L. | 4845 | 105317 | 4,94 / 4,92 | free + IAP | 2026-11-20 (3.2.8) |
| Strong (464254577) | Strong Fitness PTE Limited | 1467 | 108558 | 4,88 / 4,86 | free + IAP | 2026-11-19 (6.6.0) |
| Fitbod (1041517543) | Fitbod Inc. | 652 | 290774 | 4,77 / 4,81 | free + IAP | 2026-11-20 (8.40.0) |
| Gravitus (965383840) – dodatkowo | Gravitus, Inc. | 2739 | 3383 | 4,89 / 4,83 | free + IAP | 2026-11-16 (4.7.0) |
Pominięci: "Gym Workout App & Fitness Plan" (5627 PL, FITNESS ONLINE MChJ) i polskie Fabryka Siły / Diet & Training by Ann / eFitness – plany/dieta/karnety, nie log serii; Liftoff (103849 US) – ranking/gamifikacja; JEFIT 47376 US, StrongLifts 76959 US – poza top 3. Strive (2067 PL, 4,93) – mały w US, pominięty.
Ceny IAP (S3 US, lista "In-App Purchases", wiele wariantów regionalnych): Hevy Pro $2.99–3.99/mc, $23.99/rok, $74.99 lifetime; Strong PRO $3.99–4.99/mc, $23.99–29.99/rok, $79.99–99.99 Forever; Fitbod Elite $9.99–15.99/mc, $59.99–95.99/rok; Gravitus Pro $7.99–12.99 (miesiąc), $59.99–79.99 (rok).
Do porównania RepsGoat: 0,99/mc, 6,99/rok, 14,99 lifetime – ok. 3–5x taniej niż lifetime konkurencji.

## 2. Obietnica i dla kogo (S3 PL/US, podtytuł + początek opisu)
| App | Podtytuł (PL / US) | Pierwsze zdania opisu (US) |
|---|---|---|
| Hevy | "Track & share with friends" / "Software For Personal Trainers" | "trusted by 15M+ lifters… 112M+ workouts logged in 2025… Log every set, follow any program… Free, with no ads." + społeczność, follow friends |
| Strong | "Fitness Exercise Strength Log" / "Weight Lifting & Exercise Log" | "The most intuitive workout and exercise tracker for any fitness routine… simplest and most intuitive" |
| Fitbod | "Smart exercise tracker & log" / "Track & share with friends" | "Build muscle… customized workout plan just for you… personalized AI workouts" (Apple Editor's Choice) |
| Gravitus | "Weight lifting workout planner" / "Weightlifting workout notes" | "workout tracker and planner for the gym. Lift without ads for free. Log every set, follow programs… Strength Score" |
[OCENA] Strong = prostota i szybkość; Hevy = darmowy bez reklam + społeczność; Fitbod = plan "za Ciebie" (inny job); Gravitus = log + programy + friends. Żadna z 4 nie obiecuje "dane tylko na telefonie / bez konta" – wolna nisza dla RepsGoat (hipoteza, nie sprawdzono wszystkich funkcji).

## 3. Rytm wersji (S3 US, lista versionHistory – strona pokazuje 25 ostatnich wpisów)
| App | Wersji od 2026-05-24 do 2026-11-24 | Daty ostatnich | Uwaga |
|---|---|---|---|
| Hevy | min. 25 (lista ucięta na 3.1.1 z 2026-07-01, od 3.1.1 do 3.2.8) | 11-20, 11-14, 11-10, 11-06, 10-28 | ok. co 4–7 dni; nowości: integracja z Claude, Contacts & Discovery, Sled Push |
| Strong | 7 (6.4.0 z 05-28 … 6.6.0 z 11-19) | 11-19, 10-08, 08-12, 07-23 | ok. raz na 4–6 tyg. |
| Fitbod | 22 (8.19.0 z 05-26 … 8.40.0 z 11-20) | 11-20, 11-05, 11-03, 10-27 | ok. co tydzień–dwa |
| Gravitus | 13 (4.5.4 z 06-30 … 4.7.0 z 11-16); przerwa 2025-10-26 → 2026-04-06 | 11-16, 11-03, 10-31, 10-22 | niejednostajnie |

## 4. Odpowiedzi dewelopera na recenzje (S3, próbka "na stronie" = 8 recenzji na stronę/rynek, to wybór Apple, nie najnowsze: daty 2017–2026)
| App | PL: z odpowiedzią / próbka | US: z odpowiedzią / próbka |
|---|---|---|
| Hevy | 0 z 8 | 1 z 8 (odpowiedź 2026-11-19 na recenzję z 2026-11-01, merytoryczna wskazówka jak zobaczyć statystyki) |
| Strong | 1 z 8 | 3 z 8 (wszystkie na recenzje z 2019) |
| Fitbod | 2 z 8 | 5 z 8 |
| Gravitus | 4 z 8 | 2 z 8 |
Razem 18 z 64 (28%) w próbce; próbka mała i nie losowa – wskaźnik tylko orientacyjny. [OCENA] odpowiedzi udzielają głównie na błędy/UX i płatności; top-ocena Hevy nie wymaga odpowiadania.

## 5. Powody powrotu i odejścia – recenzje
Próbka A: S4 Hevy US, n=50, 2026-11-20…11-22. Próbka B: S4 Gravitus US, n=50, 2025-04-16…2026-11-16. Próbka C: S3 strony 8 recenzji/rynek (Strong PL/US, Fitbod PL/US, Gravitus PL/US, Hevy PL/US = 64). Liczenia: regex po tytule+treści, orientacyjnie.
| Wątek | Hevy (n=50) | Gravitus (n=50) |
|---|---|---|
| "free"/bez subskrypcji/bez reklam | 11 z 50 | 10 z 50 |
| prostota / łatwość / intuicyjność | 18 z 50 | 9 z 50 |
| historia i progres (poprzednie ciężary, PR, overload) | 21 z 50 | 17 z 50 |
| konsekwencja / motywacja / "wytrwanie" | 7 z 50 | 5 z 50 |
| płatności/cena/paywall (każda wzmianka, także pozytywna) | 10 z 50 | 6 z 50 |
| błąd/crash/update | 2 z 50 | 6 z 50 |
| sync/konto/dane/eksport | 4 z 50 | 5 z 50 |
| powiadomienia/przypomnienia/streak | 0 z 50 | 0 z 50 |
| Apple Watch | 1 z 50 | 3 z 50 |
W żadnej z 100 recenzji nie ma słowa o powiadomieniach, przypomnieniach ani streakach jako powodzie zostania. W próbce C (64): rest timer w paywallu 2 z 8 Gravitus PL; subskrypcja/odnowienie 1 z 8 Fitbod PL; Apple Watch (rozłączanie) 1 z 8 Strong PL.

Cytaty (tytuł – cytat; źródło):
- Hevy, "Amazing Free!" – "helped me track and stay consistent with my workouts in a way I have never been able to" (S4, 2026-11-22)
- Hevy, "Perfect gym tracker" – "exact features which are needed without unnecessary noise… Export workout data is a very critical feature for me" (S4, 2026-11-21)
- Hevy, "Great app" – "Purchased the forever version… the base free version has generous baseline functionality. Apps like this should be rewarded." (S4, 2026-11-20)
- Gravitus, "Good app but features keep getting paywalled" – "They keep taking features away from the free version and paywalling them" (S4, 2026-05-06)
- Gravitus, "Resting timer" – "I think it's a bit too much to ask me to buy premium version just to change the timer" (S3 PL, 2023-11-13)
- Gravitus, "Fraud charges" – "I deleted my account and canceled my subscription through Apple yet the app is continuing to charge me." (S4, 2026-03-30)
- Fitbod, "Fine but trying to steal money" – "it is impossible to resign from subscriptions" (S3 PL, 2026-08-28, z odpowiedzią dewelopera)
- Fitbod, "Getting worse with each update" – "After every update, you need to learn UI again because they like to move stuff around" (S3 PL, 2025-07-28)
- Strong, "Excellent, but too expensive" – "10$ for all features without subscription would be more adequate" (S3 PL, 2020-10-16)
- Strong, "Bad Apple Watch connection" – "it'll disconnect during and won't allow to resync. You either register two workouts…" (S3 PL, 2024-06-28)
- Gravitus, "Not loving the new update" – "Don't update it. You can't set your goal for your sets anymore" (S4, 2025-05-17)
- Gravitus, "Keeping track without the stress" – "upon returning I was able to see where I left off" (S4, 2026-11-15)

## 6. Wnioski per wymiar [OCENA]
| Wymiar | Co najlepsi robią i użytkownicy chwalą | Czego unikać (nadmiar) | Dla RepsGoat |
|---|---|---|---|
| Pozyskanie | Hevy: free bez reklam + "share with friends", rekomendacje "tell every gym goer", featured by Apple, polecenia od trenerów/YouTuberów (Gravitus: Jeff Nippard). Duża liczba ocen = dowód społeczny | Ukrywanie funkcji, które były darmowe | Mocny, krótki hak: darmowe do 5 dni/mies., bez konta; poleć znajomemu zamiast "social feed" (pominięcie: feed) |
| Aktywacja | Szybki log serii, widać poprzednie ciężary i powtórzenia (21 z 50 Hevy) | Rozbudowany onboarding, planery AI (Fitbod: UX "after finishing one set…") | Pierwszy log serii w <1 min; prefill poprzednim ciężarem |
| Retencja | Historia/progres, PR, "wrócić po przerwie i zobaczyć, gdzie skończyłem" | Streaki i powiadomienia nie padają w ani jednej z 100 recenzji jako powód zostania [OCENA: nie są oczekiwane w tej niszy] | Pominięcie streaków/push-nagabywania; ewentualnie 1 opcjonalne przypomnienie. Wartość = historia |
| Monetyzacja | Hevy: hojny free, lifetime ("Purchased the forever version… should be rewarded") | Zabieranie darmowych funkcji (Gravitus), rest timer w paywallu, trudne anulowanie/odnowienie (Fitbod, Gravitus "Fraud charges"), wysokie ceny (Strong "too expensive") | Limit 5 dni/mies. zamiast blokowania funkcji; jasne anulowanie przez Apple; nie przesuwać funkcji free→Pro po fakcie |
| Jakość/aktualizacje | Częste wersje (Hevy co kilka dni) jako sygnał "dbają" | Zmiany UI co update, błędy po update (Fitbod, Gravitus: "after the last update I cannot submit my workout") | Rytm 2–4 tyg. wystarczy (Strong), stabilność > częstość |
| Dane/konto | Eksport danych ceniony (Hevy), "bez konta" nie omawiane w próbce | Utrata/niezgodność danych przy sync Watch (Strong PL) | Eksport + stabilne Watch to wartość; "dane tylko na telefonie" = ryzyko braku backupu – zakomunikować wprost |
| Odpowiedzi na recenzje | Odpowiedzi merytoryczne i szybkie (Hevy 2026-11-19, w 18 dni) | Brak odpowiedzi nie blokuje 4,9 (Hevy 0/8 PL) | Odpowiadać na błędy i płatności; nie priorytet |

## 7. Ograniczenia
- Próbka recenzji na stronie (8/rynek) to wybór Apple, nie losowa; RSS tylko Hevy i Gravitus (US, 50 each).
- Brak recenzji PL w RSS (nie odczytano). Brak danych o retencji/pobraniach (nie odczytano).
- Liczenia tematów regexem – orientacyjne.
