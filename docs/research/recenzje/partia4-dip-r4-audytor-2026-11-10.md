# Recenzja niezależna rodziny v2 `dip` — runda 4 (audytor, 10.11.2026)

Stan: `figury/partia-4-dip` @ c918a066 (r3 na 83f4ba0). Decyzja koordynatora 10.11.2026: Triceps Dips (ławka) wstrzymana (`V2_WSTRZYMANE`, backlog P4-DIP-1, W5), zestaw Dip Machine zostaje „do poprawy” (W3, P4-DIP-2). Pozy i generator bez zmian od 83f4ba0.

## Werdykt

| Wpis | Werdykt |
|---|---|
| v2 `dip` (liczba 5, bez_rysunku [], wstrzymane [Triceps Dips (ławka)]; sha eec289f04568) | **wyswietlana** (4 ćwiczenia: Chest Dip, Triceps Dip, Ring Dips, Dip Machine) |
| karty Chest Dip, Triceps Dips (ławka) | wyswietlana |
| zestawy Triceps Dip, Ring Dips | wyswietlana |
| zestaw Dip Machine | do poprawy (W3, P4-DIP-2) |
| v1 Triceps Dips (ławka) | **zostaje wyswietlana** (bez zmiany wpisu; v1_zastapiona = []) |

## (1) Czy wstrzymanie działa

- `shownFigureSpec('Triceps Dips (ławka)')` = null, `figureSpec` ≠ null; pozostałe 4 ćwiczenia → rodzina dip (test `figures-v2-wstrzymane`).
- Nakładka: `techniquesOf` = [] (test `figures-v2-nakladka-dip`).
- Eksport strony: `figureEntry` i `shownSpec` pomijają klucze z `V2_WSTRZYMANE` (`scripts/strona/eksport.mjs:74`, `:134`); liczba figur 219 → 218.
- `figures-v2-wstrzymane`, `figures-v2-nakladka-dip`, `figures-v2-dip-podpora`: 83/83 zielone (`--runInBand`).
- Arkusze `arkusz-slad.mjs` wszystkich 5 ćwiczeń (PNG i HTML) bajtowo równe r3 (`cmp`). W1 i W2 naprawione (r2). W ćwiczeniach wyświetlanych nie zostało żadne WYSOKIE; Ś1 (poręcze niewidoczne z przodu) w backlogu.

## (2) Format wpisu v2 i v1 ławki

- **`bez_rysunku` = [], a nie [ławka].** Wzór wstrzymania na `origin/figury/partia-2` (hip_bridge, Machine Hip Thrust): osobne pole `wstrzymane`, a `bez_rysunku` tylko dla ćwiczeń bez póz (London Bridges). Ławka ma pozy (`figureSpec` ≠ null), a `recenzja-szkielet.mjs` wylicza `bez_rysunku` = []. Wpisanie ławki do `bez_rysunku` rozjechałoby się z wyliczeniem.
- **v1 ławki zostaje „wyswietlana”, nie „zastapiona”.**
  - „zastapiona” dopisuje ćwiczenie do `replaced`, więc `figureWithheld` = true (`figure.ts:67`) i karta byłaby bez żadnego rysunku (`components/ExerciseCues.tsx:45`). To regresja względem 1.0, gdzie ta figura v1 jest pokazywana.
  - Przy „wyswietlana” aplikacja rysuje v1, bo v2 = null, a ćwiczenie nie jest w `replaced`.
  - Test `tests/figury-recenzja.test.tsx:54` dopuszcza „wyswietlana”, gdy `shownFigureSpec` = null.
  - Wpis v1 ma skrót bieżący (0e72ab5e0fbf), recenzja z 27.10.2026.
  - Dane v1 pokazują ruch zgodny ze źródłem i kartą: łokieć 0° → 90°, bark w wyproście −13° → −52° (łokcie do tyłu), pięty na podłodze. Pełnej recenzji v1 w tej rundzie nie robiłem (poza zakresem).
  - Po naprawie P4-DIP-1 (zdjęcie z `V2_WSTRZYMANE`) v1 przechodzi na „zastapiona” w tym samym commicie.
- Karta Triceps Dips (ławka): wpis „karty” (457bb9d115cb) zostaje — karta jest wyświetlana z rysunkiem v1; treść zgodna z nim.

## Znalezisko narzędzia

| ID | Klasa | Pewność | Opis |
|---|---|---|---|
| N3 | NISKIE | 95% | `scripts/recenzja-szkielet.mjs:41` (`rysuje`) liczy rysunek przez `figureSpec`, bez `V2_WSTRZYMANE`. `--sprawdz` zgłasza dla ławki „werdykt wyswietlana zamiast zastapiona”, choć test runtime (`figury-recenzja.test.tsx:54`, `shownFigureSpec`) to dopuszcza. Fałszywy alarm — `rysuje` powinno pomijać wstrzymane (wtedy także pole `wstrzymane` w szkielecie). |

Skróty (`zrodla-runtime.mjs --skroty`, kopia @ c918a066): v2 dip eec289f04568; karty Chest Dip 58bc2ad0a6ce, Triceps Dips (ławka) 457bb9d115cb; zestawy Triceps Dip / Ring Dips / Dip Machine 90516c549650; v1 Triceps Dips (ławka) 0e72ab5e0fbf (bez zmiany wpisu).
