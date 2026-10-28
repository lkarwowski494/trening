# Wynik 011 (T-04, duży tekst) — stan na 28.10.2026

SHA gałęzi naprawy/M2-koordynator-napraw-2026-10-27-p2-ax5: patrz ostatni commit (cofnięcie podprzepływu po e42ae15).

| Przebieg | Wynik | Przyczyna |
|---|---|---|
| tests.yml 40596518356 (fe14b7f) | czerwony | m3-token-guard: StartError.tsx fontSize 4 > 3 (spoza T-04, z commitu 451862d; main też czerwony). Naprawa: stała BTN_FONT, wykaz 3 -> 2 (93491283) |
| tests.yml 40600762766 (93491283), e42ae15 | zielony | |
| e2e 40596548351 (fe14b7f, duży tekst) | czerwony | scenariusz (skrypt): podprzepływ szablon-testowy, krok tapOn "Bench Press (Dumbbell), dumbbells" — wiersz wyniku poza ekranem przy największym tekście (zrzut step-027/029) |
| e2e 40608316437 | zielony pozornie | wejście tylko_scenariusze wymaga numerów ("58"), nie nazwy pliku: "Wybrane numery bez scenariusza" — nic nie uruchomiono |
| e2e 40611804186 (e42ae15, scrollUntilVisible centerElement) | czerwony | asercja "Bench Press (Dumbbell)" po wyborze: tap trafił w chip "chest" (zrzut run2-step-031) |

Zrzuty: /home/user/trening/audit/M1-2026-10-27/zrzuty/M2/ax5/
Ocena zrzutów 580 i 582 (ekran Trening bez planu, największy tekst, 1206x2622): brak uciętej ikony; strzałka karty, ikony zakładek, plakietki w normie. 581 = kopia 580 (scrollUntilVisible nic nie przewija, element widoczny). Zrzutów 583-589 (z planem — tam była uszkodzona ikona startu) NIE MA: scenariusz nie przechodzi etapu tworzenia szablonu.

Otwarte: scenariusz 58 przy dużym tekście wymaga innej drogi do planu (np. generator szablonu/planu z kroków startowych zamiast pickera, albo wyszukanie jednoznaczne), potem przebieg z "tylko_scenariusze: 58" i aplikacją z przebiegu 40608316437 (artefakt wygasa po 1 dniu). Ucięcie ikony T-04 w stanie z planem nadal bez dowodu na zrzucie.

## Ciąg dalszy (28.10.2026, nad ranem) — droga z generatorem
Polecenie koordynatora: stan z planem przez generator szablonu i planu; bez zmian w podprzepływach wspólnych z pakietem podstawowym; StartError.tsx i token-baseline.json bez zmian (inna poprawka na gałęzi partii 3).

| Przebieg | Wynik | Przyczyna |
|---|---|---|
| e2e 40614184684 (1c54954) | czerwony | podprzepływ generatora: "Preview" poza ekranem przy dużym tekście (zrzut run3-step-016) -> nowy podprzepływ subflows/generator-plan-duzy-tekst.yaml (przewijanie, bez asercji na dni) |
| e2e 40615662047 | nieważny | dispatch wystartował przed zakończeniem pusha (hak pre-push zatrzymał push na macierzy); przebieg szedł na starym kodzie. Błąd kolejności z mojej strony |
| e2e 40617152627 (688d264) | czerwony, ale scenariusz doszedł do kroku 50 z 51+ | 583-588 zrobione; padło "This week" widoczny po treningu (z planem podsumowanie jest pod kartą dnia; zrzut run5-step-050) -> przewinięcie scrollUntilVisible (0b39c55, bez kolejnego przebiegu: limit 2 prób wyczerpany) |

Zrzuty stanu z planem (środa 28.10, dzień planu, 1206x2622): 583 (nagłówek, pasek tygodnia, karta "Today: Full Body B"), 584 (reszta karty, "Next", przycisk "Start: Full Body B" ze strzałką, "Other workout"), 585 (Pierwsze kroki), 586 (trening w toku), 587, 588.
Ocena: nic ucięte w 583-585. Duża szara ikona startu kolejnego treningu NIE wystąpiła, bo przebieg trafił w dzień planu (stan "Dziś"); jej stan (dzień bez treningu, karta "Następny trening") nie jest pokryty — zależy od dnia tygodnia, scenariusz tego nie wymusza. W 586 przy "lb" jest mały znak (kareta) tuż przed dużą liczbą powtórzeń "8" — wygląda na normalny element (skala/zwijanie), nie ucięcie; do potwierdzenia na zrzucie w pełnej rozdzielczości przez recenzenta ruchu, bez dowodu na błąd.

Otwarte: (1) przebieg potwierdzający 0b39c55 (po This week i 589); (2) stan "brak treningu dziś" (ikona startu kolejnego treningu) — wymaga dnia spoza planu albo wymuszenia (np. plan na dni inne niż dziś); (3) aplikacja z 40608316437 wygasa po 1 dniu.

Poprawka katalogu przepływów (tests/przeplywy.json DA-07: znaczniki scenariusza 58) po tests.yml 40618811159 (czerwony na 0b39c55: brak znaczników "Today: Upper A"). tests.yml na 4c73243: ZIELONY.
