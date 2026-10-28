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
