# Przekazanie pracy koordynatora (dla kolejnego konta / sesji)

Aktualizowane na bieżąco przez koordynatora (polecenie właściciela 26.10.2026, ok. 21:50 Warszawa: przy wyczerpaniu limitu nic nie może zostać stracone). Gałąź `przekazanie-konta` — nie do scalania z main bez polecenia właściciela.

**Ostatnia aktualizacja:** 2026-10-26 19:58 UTC.

## Jak zacząć (nowa sesja)
1. Przeczytaj CLAUDE.md i `docs/48-zgloszenie-1-0.md` z `origin/integracja-2026-10-26b` (zasada „aktualne zasady przed planem”).
2. Przeczytaj ten plik i `notatki/rano-26-10.md` (kolejka koordynatora).
3. Notatki robocze z kontenera (recenzje póz, badania, audyt 1.0, marketing) są skopiowane do `notatki/` — scratchpad starej sesji nie istnieje.
4. Właściciel: pisz po polsku, decyzje produktowe przez pytanie z ≥2 opcjami i rekomendacją, zadania dla niego po jednym, krok po kroku. Pinguj tylko, gdy trzeba.
5. Zasada od 03:00 Warszawa (02:00 UTC): każdy agent wypycha pracę po każdym kroku (najpóźniej co ~30 min), także stan pośredni (gałąź robocza, w razie potrzeby `--no-verify` tylko dla zapisu, nie do scalenia).

## 1.0 (premiera, zakres zamrożony — tylko blokery)
| Krok | Stan | Gdzie |
|---|---|---|
| Naprawy z audytu 1.0 | zrobione, CI zielone | `naprawy-audyt-1-0` bc28bc3 |
| Scalenie do integracji | zrobione | `integracja-2026-10-26b` 227cb8c, potem c56ef5d (+ `straznik-paczki`, lekcja L-039) |
| tests.yml na c56ef5d | zielony (run 40389032814) | |
| E2E pakiet podstawowy | brak maszyny macOS: 40385948580, 40389043078, 40391367923, 40394232571 anulowane „not acquired by Runner”; ponowione jako run 40397482864 (c56ef5d) — ponawiać | |
| PR integracja → main + scalenie | do zrobienia (repo bez szablonu PR) | |
| Wersja 1.0.0 | gałąź zaktualizowana: 6a722cf (7a45540 + decyzje właściciela w docs/18 eb9c6fd + scalona integracja c56ef5d); pełne verify lokalnie zielone, tests.yml 40392538178 zielony | `wydanie-1-0-0`; po scaleniu integracji do main dołączyć main (treść ta sama) i PR do main |
| Pełny katalog E2E | do zrobienia, na SHA wersji na main | `pakiet: pelny`, iPhone standardowy; czerwony z winy skryptu nie blokuje (CLAUDE.md) |
| testflight.yml | do zrobienia; zatrzyma się na `release` — zatwierdza WŁAŚCICIEL rano | |
| check-urls.yml | do zrobienia po scaleniu do main (dowód, zamyka R-017 w docs/40) | |

Agent ścieżki 1.0 (stara sesja) prowadził te kroki; nowa sesja kontynuuje od pierwszego niezrobionego.

**Rozstrzygnięte (właściciel 26.10 wieczór, docs/18):** „Co nowego” w 1.0.0 bez przycisku ✦; kalistenika w sekcji „Progresje” techniqueatlas. **Dawne pytanie (1.0):** pusta historia „Co nowego” w 1.0.0 → bez przycisku ✦ (rekomendacja; zero nowych tekstów) albo panel powitalny (nowy tekst × 35 języków, wyjątek od zamrożenia). Domyślnie: bez przycisku.

**Rano dla właściciela (po buildzie), po kolei:** zatwierdzenie `release` → lista z telefonu docs/49 (T-01–T-14) + zakupy sandbox → akceptacja podpisów zrzutów EN → notatki EN do ASC (store/review-notes.md) i kontakt → sprawdzić support@apps4brew.com → zamknąć R-004 i R-014.

## Wersja 1.0.1 (po 1.0)
`wersja-1-0-1` dba56fc, tests.yml zielony (40379653147). Zawiera m.in. B-04 (pauza zegarka), check:claims dla liczb, poprawkę `test:fast` (słowniki → testy plików generowanych) z lekcją. Po 1.0: watch-sim / ios-unsigned (kompilacja Swift).

## 1.1 (biblioteka grafik v2 + strona techniqueatlas)
| Obszar | Stan | Gałąź / SHA |
|---|---|---|
| Integracja 1.1 | w toku: naprawa 7 testów `gemini-polecenia` (limit długości polecenia), potem scalenia `role-miesni`, `strona-eksport`, `straznik-paczki`, eksport `roles` dla strony, przekład 52 kluczy ról (workflow `przeklad-tlumaczen.yml`, ≤6 USD), E2E scenariusz 57 | `integracja-1-1` |
| Role mięśni + zakresy poza@2 | gotowe | `role-miesni` 77a6e28 |
| Eksport dla strony (sylwetka) | gotowe | `strona-eksport` a4ba332 |
| Bramki jakości póz | runda 4 w toku (reguły R1–R10 z recenzji n4, 5 póz, przyczyna miękkich kolan w rigu, tabela kątów dla recenzenta, P1 manifest; sprawdzian na pozach gora/dol/dyn; podglądy n5) | `jakosc-r2` (c171efb przed rundą 4) |
| Recenzja ruchu n4 | 24/29 OK, bramki złapały 0/5 błędów → runda 4 | `notatki/pilotaz/recenzja-n4.md` |
| Pozy góra ciała | 192 pozy, 13 rodzin; `zakres_wyjatki` per ćwiczenie (7 leżących przodem) | `pozy-gora` b9d6808 |
| Pozy dół ciała | 112 póz, 14 rodzin, 9 wyjątków | `pozy-dol` |
| Pozy dynamiczne | 68 póz + 7 bocznych (pole `przesuniecieBoczne`), CI run 40383670701 do sprawdzenia | `pozy-dynamiczne` 8f8f97a |
| Scalenie trzech gałęzi póz | w toku | `pozy-1-1` |
| Strażnik paczki | gotowe (granice słowa dla skrótów), lekcja L-039 | `straznik-paczki` 11dcbe5 |

Znane czerwone na gałęziach 1.1 do czasu naprawy w integracji: 7 testów `tests/gemini-polecenia.test.ts`. Pliki generowane (odciski `tests/fixtures/figury-v2-zlote.json`, README, `docs/19`) przy konflikcie — tylko regeneracja (`ZLOTE_ZAPISZ=1`, `node scripts/readme.mjs --write`, `node scripts/test-matrix.mjs --write`).

Cel bramek przed skalowaniem na wszystkie rodziny: ≥90% błędów łapanych automatycznie. Model pracy i lista kontrolna bramki 4: `notatki/53-grafiki-model-pracy.md`.

## Strona techniqueatlas (osobne repo `lkarwowski494/techniqueatlas`)
main 0d03d76 wypchnięte (sylwetka mięśni, strażnicy S3/S4/S6/S8, zamrożenie adresów, hreflang). noindex do 1.1. Po integracji 1.1: przepiąć `PIN.json` na SHA/tag aplikacji z polem `roles`, sprawdzić CI strony (krok `npm ci` dodany — przebieg dowodowy). Domena przy starcie 1.1.

## Kalistenika (osobne repo `lkarwowski494/kalistenika`) — WSTRZYMANA do pon. 2.11.2026
Gałęzie `oplacalnosc`, `odkrywanie`, `monetyzacja` (02679e8). Stan i plan wznowienia: `docs/sztafeta.md` sekcja „Wstrzymanie 26.10.2026”. Przypomnienie zaplanowane na 2.11 07:00 UTC. Pytania do właściciela przy wznowieniu: DK-13, DK-14, zakup książek (2 tytuły w `docs/research/badania-R01-R13.md`). Źródła szczebla 5: Dysk „Trening App / 05 Research konkurencji”.

## Otwarte pytania do właściciela (poza 1.0)
- Strona dla aplikacji jedzeniowych: jedna strona z sekcjami (rek.), nazwa — wolne w .com 26.10: homekitchenatlas.com (rek.), homemadeatlas.com, fromscratchatlas.com, homefoodatlas.com; „foodsdyi.com” ma literówkę (DIY). Zakup przy starcie, po pomiarze techniqueatlas. Przed zakupem: znaki towarowe.
- Kalistenika w techniqueatlas (sekcja „Progresje”, rek.) czy osobna strona.

## Koszty (API, poza abonamentem)
Przekład 26.10: 3 przebiegi sonnet ok. 2,1–2,8 USD; batch Opus `msgbatch_012Nrp2w9SwnzpvbM1ArKayB` mógł się rozliczyć (~1,4 USD), wynik nieużyty. Gemini wcześniej ~1,61 USD. Limity: przekład ≤6 USD/przebieg, Gemini ≤3 USD/przebieg.

## Zaplanowane przypomnienia (send_later, stara sesja)
Nocny przegląd agentów co ~2 h (następny 21:37 UTC); wznowienie kalisteniki 2.11 07:00 UTC. Przypomnienia trafiają do starej sesji — nowa sesja powinna ustawić własne.

## Grafiki 1.1 — wniosek z recenzji n5 (26.10, ok. 21:15 UTC)
Recenzja n5: 16 OK / 8 uwaga / 5 błąd; reguły złapały 0/5 (n4 też 0/5). Wzorzec: poprawki trafiają w zmierzoną liczbę, obok wyrasta błąd innej klasy, wartości tuż pod progiem (prawo Goodharta). Zmiana podejścia (koordynator, technicznie): ograniczenia strukturalne w silniku (stała długość taśmy, deklarowane punkty podparcia, strona kończyny, kształty nad podłogą) zamiast kolejnych progów; generatory celują w środek przedziału (P2). Agent jakosc-r2 robi rundę 5 → podglądy n6 → recenzja n6.
**Pytanie do właściciela rano (model pracy, systemowe):** A) dalej: bramki automatyczne + recenzja ruchu każdej rodziny obowiązkowa przed wydaniem (rek.: reguły jako ochrona przed regresją, recenzja jako bramka); B) skalować na całą bibliotekę dopiero po osiągnięciu ≥90% szczelności (ryzyko: termin 1.1 przesunie się o nieznany czas); C) wydać w 1.1 tylko rodziny z recenzją OK, resztę bez animacji.

## Integracja 1.1 (agent programisty, 26.10.2026 wieczór)
- `integracja-1-1` @ bd7e62f: tests.yml zielone (run 985). Zrobione: scalenia grafiki-dane-ui, grafiki-sprzet (+1ea6fe1), pilotaz-agent-pozy, figury-kontrakt-r4, role-miesni; z strona-eksport i straznik-paczki tylko cherry-picki własnych commitów (gałęzie niosą cudze zmiany z main/wyciskania). Skrócone polecenia Gemini do limitu 36 000 (zakres kontraktu per część), taśmy zawieszenia (15 cm bez kolizji), Suspended Push-Up/Fallout nałożone, eksport `roles`.
- Przekład ról mięśni: run 40389563916 (sonnet, ok. 0,96 USD), 55 pozycji × 33 języki, niezastosowany; raport: scratchpad/rp-dl/raport-przekladu/. Czeka na recenzję (scratchpad/rp-dl/recenzja-rol.json), potem `--zastosuj` + poprawki.
- E2E 57 (tylko_scenariusze): przebiegi 297, 298, 301 anulowane bez maszyny macOS; 304 w kolejce (ponawiać przy „not acquired”).
- Kolejne kroki: scalenie origin/pozy-1-1 dopiero przy zielonym CI i po jakosc-r2; odciski, README, macierz tylko regeneracją.
