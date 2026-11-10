# Recenzja niezależna — rodzina v2 `lunge`, partia 9, runda 2 (audytor, 10.11.2026)

Stan zamrożony: `figury/partia-9-lunge` @ a96bbaed (poprawki 1728824, e247377, a96bbae od 8360f576). Autor rodziny: programista partii 9; poprawki r1: inny programista partii 9. Recenzent: audytor (nie pisał rodziny, poprawek, nakładki, kart ani zestawów). Bramka 4, L-047 A, L-050, K4–K15. Raport r1: `partia9-lunge-r1-audytor-2026-11-10.md`.

**Werdykt rodziny: wyświetlana** — W1–W5, Ś1, Ś2, N1 z r1 naprawione; 0 × KRYTYCZNE/WYSOKIE. Do backlogu: Ś3, Ś4, N2.

## Metoda
- Ćwiczenia ze zmienionymi danymi póz od r1 (porównanie `poses/lunge.json` 8360f57 ↔ a96bbae): 13 — Split Squat, Split Squat (linki), Elevated Back Lunge, Step Up, Barbell Step Up, Pistol Squat, Smith Machine Pistol Squat, Bulgarian ×3, Lateral Lunge, Cossack Squat, Barbell Side Split Squat. Zmiana tylko strony pomiaru: Reverse Lunge, Curtsy Lunge, Crossover Reverse Lunge, Lunge Pass Through.
- Arkusze wygenerowane samodzielnie: `arkusz-slad` 13 ćwiczeń × 2 widoki (26) i `arkusz-nakladka --family lunge` (76). W pełnej rozdzielczości obejrzane: Split Squat (z boku, z przodu), Split Squat (linki) (oba), Elevated Back Lunge (oba), Step Up (z boku + nakładka z przodu), Barbell Step Up (z przodu), Barbell Side Split Squat (z przodu), Pistol Squat (z boku + nakładka z przodu), Smith Machine Pistol Squat (z boku), Smith Machine Bulgarian Split Squat (z boku), nakładka z przodu Lateral Lunge i Cossack Squat. Pozostałe arkusze (te same szkielety albo ta sama poprawka) — liczbowo, `frameAt` co u = 0,01 dla wszystkich 24 ćwiczeń: kąty, styki, chwyty, `checkFrame` (bez uwag), odstępy kapsuł co u = 0,005.

## Znaleziska z r1 — stan
| ID | Stan | Miara r2 |
|---|---|---|
| W1 | naprawione | `measuredSide` = R w 24/24 (DATA_UI.exceptions `side: 'R'` przy 7 ćwiczeniach); pion „kolano nad stopą” i kąt na nodze przedniej / na stopniu (Step Up 90 → 7°). |
| W2 | naprawione | stopa prosto (pięta i palce z = 30 cm, Cossack 36 cm); kolano na dole 3,6 cm (Cossack 3,9 cm) na zewnątrz od palców (≤ 4 cm). |
| W3 | naprawione | z gryfu = z barków = 21,5 cm w całym ruchu, środek gryfu = środek chwytów; gryf 1,7 cm od pleców. Opis wyjątku toru (12,9 cm: tułów 8° → 26° przy prawie stojącej miednicy) zgodny z liczbami. |
| W4 | naprawione | Elevated Back Lunge: start obiema stopami na stopniu, kolana 9,5°; tylna stopa schodzi na podłogę (najgłębiej 0,2 cm w stopień). Split Squat / (linki): u = 0 kolana R 8,8°, L 23,2°, zakres miednicy 31,5 cm; biodro tylnej nogi min. −24,7° w granicy wyjątku hipMin −25 (decyzja leada, do weta). Merytorycznie: wyprost biodra tylnej nogi ok. 25° w rozkroku to wartość możliwa, uproszczenie nazwane. |
| W5 | naprawione | kolano nogi wolnej 6,2–8,2° (Smith 6,2–6,6°). |
| Ś1 | naprawione | noga zakroczna zgięta do 100,6° tylko przy przenoszeniu nad stopień (palce 1,5 cm nad blatem), od u 0,85 stopa na stopniu (0–0,7 cm). |
| Ś2 | naprawione | grzbiet tylnej stopy 0,6 cm od siedziska. |
| Ś3 | backlog (ŚREDNIE) | zestaw `lunge` przy Lateral / Barbell Side Split / Cossack: „Przednie kolano…”. Ocena wpływu: wskazówka techniki (kolano w linii palców) jest prawdziwa dla ugiętej nogi i po W1/W2 rysunek pokazuje ją dokładnie na tej nodze; myli tylko słowo „przednie” — to nie jest błędne twierdzenie ani ruch sprzeczny z kartą, więc zestaw może być „wyswietlana” z pozycją w backlogu (zdanie dla ruchu bocznego albo `CUE_REQUIRES` z rozróżnieniem ruchu bocznego). |
| Ś4 | backlog (wg koordynatora) | u = 0 kolano R 51,8° (Cossack 38,4°). |
| N1 | naprawione | opisy Pistol i Single-Leg High Box: ślad = miednica. |

## Nowe
- **N2 (NISKIE)** `gear.ts`: przy `podazaZaChwytem` z gryfu = średnia z chwytów (było 0). W gotowych rodzinach zmienia 7 ćwiczeń olympic (Clean, Power Jerk, Split Jerk, Squat Jerk, Clean and Jerk, Jerk Balance, Split Clean) o ≤ 0,05 cm — niewidoczne; skrót v2 olympic tego nie łapie (skrót nie obejmuje gear.ts). `zrodla-runtime --skroty` b66ecfa ↔ a96bbae: różni się tylko v2 `lunge`; v1, karty, zestawy i v2 innych rodzin bez zmian. Pole `side` w PhaseOverride ma wpisy tylko w lunge (394 ćwiczenia innych rodzin: szkielet bez zmian).

## K14 (`git diff 8360f57..a96bbae -- tests/`)
- `tests/tor-wyjatki.json`: tylko 3 opisy (Pistol, Single-Leg High Box, Barbell Side Split) — wartości bez zmian, bez nowych wyjątków.
- Nowy `tests/figures-v2-lunge-poprawki-r1.test.ts` (W1–W5, Ś1, Ś2, N1): progi z karty i geometrii (kolano ≤ 20/25° przy „stań/wstań”, noga wolna ≤ 15°, styk ≤ 1 cm, gryf ≤ 3 cm od środka chwytów i barków, kolano −4…+4 cm od linii palców); dane r1 oblewają każdy próg (63,1°, 56,8°, 30,6°, 116°, 2,1 cm, 21,5 cm, 10 cm). Bez poluzowań. Uruchomiony: 2 pliki (z `figures-v2-lunge.test.tsx`), 43/43 zielone.

## Wpisy
- v2 `lunge`: wyswietlana, liczba 24, skrót `f2ff1a209120` (własne `--skroty` = szkielet; `recenzja-szkielet --sprawdz`: komplet).
- Zestawy ogólne 12/12 i karty własne 12/12: wyswietlana (skróty bez zmian od r1).
- v1 → zastąpiona: Bulgarian Split Squat (hantle), Lunges (hantle), Pistol Squat, Reverse Lunge, Step Up, Walking Lunges.

## K14 — zmiany testów d8282b8 (aneks, 10.11.2026)
Stan d8282b8 (na a96bbae; poza `tests/` bez zmian w kodzie i pozach). `--skroty`: v2 `lunge` = `f2ff1a209120` (bez zmian — JSON r2 aktualny).
- `tests/fixtures/figury-v2-zlote.json`: 622 klucze przed i po, zmienione 13 — wyłącznie `dane/lunge/*`, dokładnie 13 ćwiczeń ze zmienionymi pozami od r1; inne rodziny bez zmian. Wzorzec świadomie przepisany, nie poluzowanie.
- `figury-recenzja-p2` sekcja 7: 7 ćwiczeń lunge przeniesione z „bez zmian” do ZMIENIONE — każde ma zmienione pozy od r1; dla nich test wymaga teraz, by rysunek RÓŻNIŁ się od bazy (warunek mocniejszy), reszta bazy dalej „bez zmian”. Poprawne.
- `figures-v2-data`: wyjątek kierunku kąta tylko dla Step Up i Barbell Step Up (noga na stopniu R: 90° → 7°, kąt maleje) — wynika z W1; pozostałe wykroki dalej „kąt rośnie”. Poprawne.
- `figury-rozszerzenia-gora`: „zwykłe” ćwiczenie bez deklaracji zakresu Split Squat → Reverse Lunge (Split Squat ma teraz hipMin −25) — ten sam warunek na innym przykładzie, nie poluzowanie.
- `karty-recenzja`: `generalCuesReviewed('Lateral Lunge')` porównane z `REC.zestawy` zamiast stałej `false` — ten sam wzór co linia Skull Crusher; nadal wykrywa niezgodność wyniku z zapisem recenzji. Poprawne.
- `pokrycie-katalogu`: w d8282b8 scenariusz „spadek” liczy od minimum zamiast od stanu bieżącego; lead cofnął to na rzecz `--podnies-minimum` (poza tym commitem) — do zachowania cofnięcia; strażnik minimum sam w sobie nieosłabiony.
- Uruchomione pojedynczo (`--runInBand`): figures-v2-zgodnosc-wsteczna 624/624, figury-recenzja-p2 542/542, figures-v2-data 23/23, figury-rozszerzenia-gora 9/9; karty-recenzja 14/15 — czerwony test „każdy zestaw ogólny wyświetlany przy figurze v2 ma wpis w „zestawy”” (Barbell Side Split Squat: brak wpisu, oczekiwany wzorzec `lunge`): w `docs/research/figury-recenzja.json` jest już v2 `lunge`, ale nie ma jeszcze wpisów „zestawy” z `partia9-lunge-r2.json`. To bramka K12 działająca zgodnie z zamiarem, nie wada testu — zielono po przeniesieniu 1:1 wpisów zestawów (12) i kart (12).
