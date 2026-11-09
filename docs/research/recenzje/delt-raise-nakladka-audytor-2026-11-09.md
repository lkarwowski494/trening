# Recenzja niezależna nakładki techniki — delt_raise (bramka 4, L-047, L-050), 09.11.2026

Recenzent: audytor (opus). Autor: programista.

Materiał:
- runda 1: commit 1e8f9f8d (różnica 1cd586a5..1e8f9f8d);
- runda 2 (poprawka #1): commit 64ebbbd4 (różnica 1e8f9f8d..64ebbbd4).

Arkusze: katalog arkuszy poza repozytorium (delt-arkusze-nakladka) (przegenerowane 11:17).

## Werdykt końcowy: WYŚWIETLANA (stan 64ebbbd4)

Poprawka #1 jest skuteczna:
- `deltArmElevationFront` — tylko rzut z przodu: 6 ćwiczeń unoszenia bokiem, Scaption i Cable Y Raise;
- `deltArmElevationSide` — tylko rzut z boku: 4 ćwiczenia unoszenia przodem i 2 overhead.

Listy są rozłączne (lib/figures/v2/overlay/delt_raise.ts:15–17). Pilnuje tego test „łuk tylko w rzucie płaszczyzny ruchu” (tests/figures-v2-nakladka-fix4.test.tsx).

## Runda 2 — sprawdzenie poprawki

(1) Parser SVG objął wszystkie 62 arkusze. Łuk pojawia się tylko w rzucie płaszczyzny ruchu:
- z przodu: unoszenie bokiem, Scaption, Y — łuk rośnie płynnie, 27→88° / 96° / 163°;
- z boku: unoszenie przodem i overhead — 26→90° i 27→167°.

W rzutach poprzecznych zostały tylko linie, bez łuku:
- unoszenie bokiem z boku — 0 kształtów;
- Front Raise, Cable Front, Front Plate i Single DB z przodu — sam poziom barku;
- Front Raise to Overhead z przodu — 0 kształtów.

Obejrzane wizualnie: Lateral-Raise-hantle-side.png (bez łuku; zielone kreski to tylko przerywany ślad), Front-Plate-Raise-front.png i Single-Dumbbell-Front-Raise-front.png (tylko linia poziomu, łuku brak; ślad pionowy).

(2) `deltShoulderLevelRef` z przodu w unoszeniu przodem — to nie jest problem. Wysokość względem barku widać w każdym rzucie. Na szczycie ciężar i dłonie dochodzą do linii (Front Raise, Front Plate, Single DB, u=1). Linia to cel ±12 cm, zgodny z regułą `lokcie_na_wysokosci_barkow_u1` i z kartą (lat.height). Brak tej linii z boku w unoszeniu przodem to najwyżej NISKIE (czytelność) — backlog, nie warunek.

Uwaga informacyjna, nie znalezisko: Machine Lateral Raise i Cable Seated Lateral Raise mają nakładkę na arkuszu, ale w aplikacji nie. Arkusz i skrót biorą surowe wskazówki (`wskazowkiSurowe`, scripts/skrot-v2-dobor.mjs:19–25), a aplikacja przepuszcza zestaw ogólny dopiero po recenzji treści (`cueIdsOf`, lib/figures/v2/ui.ts:21–26). Różnica jest zamierzona (nadzbiór, ścisła strona błędu) i opisana w teście (NIE_RYSUJE).

(3) Rzekoma luka skrótu: NIE POTWIERDZONA. To pomyłka co do wartości, nie luka L-047.
- **b62f05ccc077 to skrót rodziny squat**, nie delt_raise (docs/research/figury-recenzja.json:651, wpis v2.squat; także docs/research/recenzje/delt-raise-roznica-7-rodzin-2026-11-09.md:13).
- Skrót delt_raise zmienia się razem z nakładką. W chwili oddania raportu bieżący wpis v2.delt_raise ma sha b882c034cdce (docs/research/figury-recenzja.json:869):

| Stan | Skrót delt_raise | Jak policzony |
|---|---|---|
| zrecenzowany przed nakładką (1cd586a5) | b882c034cdce | wartość z wpisu, nie liczyłem |
| 1e8f9f8d | 9b59bfcf1eb2 | pliki z 1e8f9f8d, funkcje doboru z 64ebbbd4 — wartość orientacyjna |
| 64ebbbd4 | **f80ea000ce69** | `node scripts/zrodla-runtime.mjs --skroty` w worktree delt_raise |

- Mechanizm obejmuje nakładki wszystkich rodzin:
  - `rodzinaSkrot` (scripts/zrodla-runtime.mjs:110) i `skrotRodziny` (scripts/strona/recenzja-figur.mjs:23) czytają `plikNakladki(rodzina)`, czyli lib/figures/v2/overlay/<rodzina>.ts (scripts/skrot-v2-norm.mjs:27);
  - wspólne common/squat/hinge są w V2_WSPOLNE (skrot-v2-norm.mjs:29);
  - overlay.ts wchodzi po normalizacji: własny import i wpis rodziny (skrot-v2-norm.mjs:31);
  - do tego dochodzi wynik doboru elementów po kartach (`doborRodziny`, w tym id elementów nakładki).
- Zmiana nakładki po recenzji daje więc inny skrót. Eksport strony (recenzja-figur.mjs:30) i strażnik wpisu wymagają wtedy zgodnego sha. Mechanizm działa, nowej propozycji nie trzeba.
- Realność luki: teoretyczna (brak drogi, w której zmiana overlay/<rodzina>.ts nie zmienia skrótu).
- Akcja procesowa dla koordynatora: sha do wpisu brać z wyjścia `--skroty`, nie z innego wpisu. Ten przypadek pokazuje, że skopiowanie skrótu innej rodziny jest możliwe. Strażnik i tak by to odrzucił, bo sha ≠ skrót rodziny, więc rodzina wypadłaby z eksportu — bez szkody dla danych.

## Znaleziska (stan końcowy)

| # | Poziom | Pewność | Realność | Stan | Opis | Dowód |
|---|---|---|---|---|---|---|
| 1 | ŚREDNIE | 90% | realny | NAPRAWIONE w 64ebbbd4 | Łuk kąta ramię–tułów rysował się też w rzucie poprzecznym do ruchu i pokazywał fałszywy kąt (np. unoszenie bokiem z boku: 29→70° tylko przy u ≥ 0,9). | Runda 1: Lateral-Raise-hantle-side, Front-Plate-Raise-front, Single-Dumbbell-Front-Raise-front. Runda 2: te same arkusze bez łuku, parser na 62 arkuszach. |
| 2 | NISKIE | 85% | realny | uwaga | Car Drivers: poziom barku zgodny z rysunkiem i kartą. Reguła pochodzi ze źródeł unoszenia bokiem, a źródła ćwiczenia są szczebla 5. | figury-sens.json, warianty; data/zrodla/cues.json ok. l. 17135 |
| 3 | NISKIE | 80% | realny | backlog | Unoszenie przodem nie ma poziomu barku w rzucie z boku (jest tylko z przodu) — czytelność, nie błąd. | overlay/delt_raise.ts, deltShoulderLevelRef `views: ['front']` |

## Obejrzane arkusze
- **Runda 1 (wizualnie):** Lateral-Raise-hantle-front/side, Front-Raise-front/side, Car-Drivers-front, Cable-Y-Raise-front, Dumbbell-Scaption-front, Barbell-Front-Raise-to-Overhead-side, Front-Plate-Raise-front, Single-Dumbbell-Front-Raise-front.
- **Runda 2 (wizualnie):** Lateral-Raise-hantle-side, Front-Plate-Raise-front, Single-Dumbbell-Front-Raise-front.
- **Parser w obu rundach:** wszystkie 62 arkusze, czyli 14 ćwiczeń z nakładką w obu rzutach i 17 ćwiczeń bez elementów.
- **Pozy błędów:** brak osobnych klatek. Jedyny błąd w zestawach to mis.jerk (tempo, bez zmiany pozy), więc nie było czego oceniać.

## Sprawdzone bez znalezisk
- Element rysuje się tylko dla reguły „ustalone” wariantu. Pominięte reguły (`rear_*`, `lokcie_nad_dlonmi_u1`, `ciezar_blisko_glowy`, `tulow_nieruchomy`, `ramie_unosi_sie_skos`) mają powód w komentarzu.
- Rear delt (5), upright row (5), Alternating, Front Incline, Straight Raises on Incline Bench i Y Raise (hantle) nie mają elementu w żadnym rzucie.
- Poziom barku to cel ±12 cm. W ćwiczeniach nad głowę linii nie ma.
- Ślad toru (L-050) jest zgodny z ruchem we wszystkich 31 ćwiczeniach.
- Zmiany testów: wyjątek stawu i faz, BLAD_NIEWIDOCZNY, liczniki 214 i 33 — spójne z danymi.
- Testy celowane pod flock (fix4, tor) nie mają wyniku: zadanie b4k5uzj14 przerwał limit 900 s, gdy wciąż czekało na blokadę (kod 143), czyli testy w ogóle nie ruszyły. Trzeba je uruchomić w kolejce na 64ebbbd4.

## Pola do wpisu v2.delt_raise (stan 64ebbbd4)
- werdykt: wyswietlana
- sha: **f80ea000ce69** — nie b62f05ccc077 (to skrót squat). Wartość z `node scripts/zrodla-runtime.mjs --skroty` w worktree delt_raise @ 64ebbbd4; przy każdej dalszej zmianie przeliczyć.
- kto: "audytor — recenzja niezależna nakładki techniki delt_raise (bramka 4, L-047, L-050), 09.11.2026; figury delt-wlaczenie-wip @ 1e8f9f8d i poprawka 64ebbbd4"
- recenzent: "audytor"
- autor: "programista"
- uwagi: "Nakładka 09.11.2026: deltArmElevationFront (ramie_unosi_sie; przód: unoszenie bokiem ×6, Scaption, Cable Y Raise), deltArmElevationSide (ramie_unosi_sie; bok: unoszenie przodem ×4, Front Raise to Overhead ×2), deltShoulderLevelRef (lokcie_na_wysokosci_barkow_u1, przód; cel ±12 cm, nie granica). Runda 1 (1e8f9f8d): łuk także w rzucie poprzecznym — artefakt (bokiem z boku 0→70° przy u ≥ 0,9), poprawione w 64ebbbd4 (parser 62 arkuszy: łuk tylko w płaszczyźnie ruchu). Rear delt, upright row, Alternating, Front Incline, Straight Raises, Y Raise (hantle) bez elementu — zasadnie. Car Drivers: poziom barku zgodny z kartą (źródła ćwiczenia szczebla 5). Machine Lateral i Cable Seated Lateral mają element tylko na arkuszu (zestaw ogólny bez recenzji treści w aplikacji). Błędy: tylko mis.jerk (tempo, bez pozy)."
- slad: "Ślad toru ciężaru obejrzany w obu rzutach wszystkich 31 ćwiczeń (62 arkusze z nakładką, kadry co 0,05; runda 2 po 64ebbbd4): unoszenie bokiem — łuk od biodra na zewnątrz do wysokości barku (przód); przodem — łuk w przód do barku (bok), z przodu pion do linii barku; overhead — półokrąg nad głowę; Y/Scaption — po skosie; Car Drivers — ciężar stale na wysokości barków; bez skoków i przenikania."
