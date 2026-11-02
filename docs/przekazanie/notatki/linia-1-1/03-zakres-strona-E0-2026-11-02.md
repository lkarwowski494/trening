# 03-zakres (build, moduł zmiany-zakresu) — strona techniqueatlas, raport E0 (02.11.2026)

Rola: `03-zakres --tryb build --moduly zmiany-zakresu` (prompts d32b4b8). Zadanie: ZB-031 — zmiana zakresu strony z „katalog prowadzący do App Store” na „darmowe narzędzie, aplikacja jako jedna z opcji”. Decyzje właściciela z 02.11.2026 są w docs/18 (cztery ostatnie wpisy) — tu nie są pytane ponownie.

## 1. Środowisko (sprawdzone 02.11.2026)
- Linux 6.18, Node v22.23.4, Playwright 1.63.0; repo trening (push na gałąź roboczą: tak), techniqueatlas (klon tylko do odczytu, `5911dca`; push: brak — wymaga `add_repo` z `access: push`), prompts (`d32b4b8`).
- CI: `tests.yml` dla ed093277 (przebieg 41426761052) — w toku o 10:4x UTC; wynik w odpowiedzi do właściciela.
- Pełnego `npm run verify` w kontenerze nie da się domknąć (limit 40 min zadania w tle — docs/18, 02.11.2026).

## 2. Wejścia i ich stan
| Wejście roli | Stan | Gdzie |
|---|---|---|
| `docs/scope-contract.md`, `docs/sztafeta.md`, `docs/zalozenia.md`, `docs/decyzje.md` | brak w repo trening | rolę rejestru pełnią docs/18 (decyzje), docs/21 (backlog z wersją), docs/brd |
| Kontrakt zakresu strony | de facto `techniqueatlas:docs/54-strona-biblioteki.md` (pkt 1, 2, 11, decyzje 26.10 i 01.11) | traktowany jako zatwierdzony kontrakt; zmiany = wiersze ZM |
| BRD (rola 01) | jest; dla strony tylko BR-BIB-006 (eksport figur z recenzją) | `docs/brd/wymagania.md:551` |
| Monetyzacja (rola 02), bramka opłacalności | werdykt „wydać” | `docs/monetyzacja.md:77` |

## 3. Wejście jako hipoteza (ZAL / H)
| ID robocze | Założenie | Status | Dowód |
|---|---|---|---|
| ZAL-S1 | Narzędzia strony mają popyt (P2) | hipoteza — raport P2 przepadł ze scratchpadem; w docs/18 tylko wnioski, bez poziomu dowodu (B/R/W) | docs/18, wpis 02.11 „zakres narzędzi po sprawdzeniu popytu” |
| ZAL-S2 | Narzędzia przyprowadzają użytkowników do aplikacji | hipoteza; sprawdzenie: token kampanii per narzędzie, punkt kontrolny 8 tyg. po starcie | docs/18 (analityka A) |
| ZAL-S3 | Plany na stronie liczone tym samym `generate()` co w aplikacji | potwierdzone w kodzie | `lib/generator.ts:1-12`, `tests/audit-0.10-gen.test.ts:34` |
| ZAL-S4 | Druk dla trenerów nie łamie granicy aplikacji ZP-08 („relacja trener–podopieczny poza zakresem”) | do potwierdzenia — ZP-08 dotyczy aplikacji, licencja dotyczy strony | `docs/brd/odkrywanie.md:37-38` |

## 4. Znaleziska E0 (z dowodem)
1. **Przypięcie strony jest sprzed nazw EN.** `techniqueatlas:PIN.json` → `fba531d` (01.11 21:07), a ZB-025 b scalono w `a0e06d7` (01.11 22:13); `git merge-base --is-ancestor fba531d a0e06d7` = prawda; `lib/nazwy-en.generated.ts` +542 linii po PIN. `slugs.lock.json` jest pusty (0 wpisów). Skutek: `npm run slugi` na obecnym PIN zamroziłby stare nazwy. Warunek: przepiąć PIN na commit z nazwami EN, dopiero potem zamrozić. Realność: realny (jedno polecenie), skutek po indeksowaniu — przekierowanie każdej strony × język.
2. **„Talerze w aplikacji” — opcja nie do pokazania.** Kalkulator talerzy w aplikacji wycięty (DEC-06), powrót w 1.1 tylko po ≥ 3 prośbach (`docs/21-roadmapa-offline.md:256`). Komponent „w aplikacji” przy kalkulatorze: tylko e1RM (RD-01, `docs/brd/reguly.md:6`).
3. **Brak BR dla narzędzi strony.** Rola 03 nie dopisuje BR sama — potrzebny wpis ER dla roli 01 (persona odwiedzającego stronę i trenera nie istnieje w BRD; P-1 to osoba z iPhone'em).
4. **Sprzeczności w docs/54 do przepisania:** pkt 1 (cel: „prowadzi ruch do App Store”), pkt 2 („nie ma pliku danych do pobrania” — trzeba odróżnić CSV własnego planu od zrzutu danych), pkt 8 (stan w adresie zamiast „bez localStorage”, bez zmiany D4/S9), pkt 9 (zdania wezwania tylko z wydanej wersji + wyjątek „wkrótce” ze strażnikiem), pkt 10 (budżet JS narzędzi — liczba do ustalenia), pkt 11 („nie ma planów ani generatora”, „nie zapowiada funkcji”), pkt 2 warunek startu (709/709 → start stopniowy), linia 325 (S6 „ćwiczenie bez figury v2” → „bez pełnej karty”), decyzja 26.10 (Excel i „Otwórz w aplikacji” → CSV i import w 1.2).
5. **Luka rejestru twierdzeń:** `scripts/claims.mjs:22` czyta tylko `lib/i18n.en.ts` — teksty strony (`techniqueatlas:src/ui/*.json`) są poza strażnikiem. Słownik pojęć i bilans muszą iść przez słownik aplikacji albo dostać osobny zakres strażnika.

## 5. Kandydaci (funkcje strony, ID F-S, wszystkie WTP-0 — strona bezpłatna z decyzji 02.11)
| ID | Funkcja | BR | Dowód | Nowe twierdzenia | Podłoga |
|---|---|---|---|---|---|
| F-S01 | Biblioteka: indeksowane tylko ćwiczenia z pełną kartą (D1, S6 zaostrzone) | BR-BIB-006 | decyzja właściciela | nie | prawo/sklep: tylko wydana wersja (S4) |
| F-S02 | Co zamiast (zamienniki, sprzęt) | brak → ER | ZAL-S1 | nie (dane aplikacji) | — |
| F-S03 | Co zrobię z tym sprzętem (kilka sprzętów) | brak → ER | ZAL-S1 | nie | — |
| F-S04 | Układanie planu z katalogu, druk/PDF, CSV | brak → ER | ZAL-S1 | nie | dane: plan tylko w adresie |
| F-S05 | Plan w linku (część po #) | brak → ER | ZAL-S1 | nie | prywatność: D4/S9 bez zmian |
| F-S06 | Wyszukiwanie od sylwetki | brak → ER | ZAL-S1 | role mięśni z aplikacji (509/709) | — |
| F-S07 | Szacowany maks na 1 powt. i talerze na sztangę | brak → ER | ZAL-S1 | e1RM: RD-01; talerze: rachunek | — |
| F-S08 | Bilans serii na partię (tylko „za mało”) | brak → ER | ZAL-S1 | T-034, T-055, T-005, T-006 | merytoryka |
| F-S09 | Gotowy plan z kilku pytań (`generate()`) | brak → ER | ZAL-S1 | ostrzeżenia generatora | merytoryka: T-050 zamknięte przed publikacją |
| F-S10 | Słownik pojęć | brak → ER | ZAL-S1 | każda definicja (6–10 h badań) | merytoryka: rejestr twierdzeń |
| F-S11 | Komponent „w aplikacji” + token kampanii per narzędzie | — | decyzja 02.11 | zdania tylko z listy funkcji wydania | sklep: pkt 9 |
| F-S12 | Akapit o wsparciu (brzmienie z docs/18) | — | decyzja 02.11 | nie | prawo: bez „darmowa” przy płatnej części |
| F-S13 | Polityka prywatności, licencja (druk dla trenerów, adres w stopce), regulamin | — | podłoga | — | prawo |
| F-S14 | Eksport słownika/tłumaczeń aplikacji na stronę | — | warunek F-S02…F-S10 | — | — |
| F-S15 | Import planu do aplikacji (aplikacja 1.2, bez zmiany SCHEMA_VERSION) + strażnik „wkrótce” | brak → ER | decyzja 02.11 | — | dane: import bez nadpisania szablonów |
| F-S16 | Zamrożenie slugów 709 po przepięciu PIN (znalezisko 1) | — | warunek indeksowania | — | indeksowanie |

Kolejność z decyzji 02.11: F-S02 → F-S03 → F-S04 → F-S05, potem F-S07 → F-S08 → F-S09 → F-S10. F-S06 (sylwetka) nie ma miejsca w tej kolejności — propozycja: grupa pierwsza (bez nowych twierdzeń, dane mięśni z aplikacji).

## 6. Plan E1–E3 i czas
- E1: pętla odwiedzającego (wejście z wyszukiwarki → ćwiczenie → narzędzie → druk/CSV/link/aplikacja), wymiary pokrycia, wzorzec 2–3 serwisów (odczyt z dziś), ER dla roli 01.
- E2: cięcie w apetycie, ≥ 2 warianty.
- E3: wiersze ZM i przepisany docs/54 (pkt 1, 2, 8–11, 325, decyzja 26.10), strażnik zapowiedzi „wkrótce” jako zadanie dla programisty.
- Czas agenta [OCENA]: E1 2–3 h, E2 1–2 h, E3 2–3 h. Oczekiwanie: CI po każdym wypchnięciu. Czas właściciela: 3 bramki STOP (ok. 10–15 min każda).
