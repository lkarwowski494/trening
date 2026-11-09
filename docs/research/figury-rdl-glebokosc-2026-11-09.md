# RDL — głębokość na rysunku (09.11.2026)

Decyzja właściciela 09.11.2026 (opcja A): gryf/ciężar na dole tuż pod kolanem. Kontekst i wpis decyzji: docs/18-przekazanie.md (wpis 09.11.2026, RDL). Wnioski badacza (badanie `glebokosc-rdl`, 09.11.2026, źródła przeczytane tego dnia; nazwy źródeł tylko tu, w rejestrze wewnętrznym).

## Wnioski (sekcja RDL w docs/research/28-figury.md ma skrót w polu „note”)
1. **Głębokość zależy od osoby:** schodzi się do rozciągnięcia tyłu ud, tak nisko, jak pozwalają proste plecy (4 źródła szczebla 4: NASM, ACE, ISSA, Catalyst Athletics). Wskazówka `rdl.depth` bez zmian.
2. **Położenie gryfu na dole: od okolicy kolana do połowy piszczeli** — część wspólna źródeł szczebla 4 (NASM „połowa piszczeli albo trochę wyżej”; ISSA „mniej więcej na wysokość kolana”; Catalyst „tuż wokół kolan” dla osób spiętych). Status: praktyka (2–3 źródła szczebla 4), nie jedna liczba. ISSA i Catalyst mogą spaść do szczebla 5 (plik szczebli z 02.11.2026 nieobecny w kopii badacza) — wtedy NASM jest jedynym źródłem szczebla 4, a reszta to praktyka.
3. **„Tuż pod kolanem” (45 cm na rysunku; środek stawu kolanowego 48 cm) to konwencja rysunku — uproszczenie ilustracyjne** w tym przedziale.
4. **Kolano ok. 15°** (Catalyst; badanie Lee i in. 2018: ok. 15° w opisie, 33,9° w pomiarze). Próg testu ≤ 27° to konwencja testu, nie liczba ze źródła.
5. **Tułów:** przeczytane źródło o tułowiu to tylko Catalyst („blisko poziomu”). Przedział 50–80° od pionu z `tests/figury-1-0-recenzja.test.ts:74-75` nie ma przeczytanego źródła — konwencja testu; po zmianie tułów 66° (sztanga) i 72° (hantle) mieści się w nim, próg bez zmian.
6. [OTWARTE] Instrukcja NSCA (Exercise Technique Manual) — strona niedostępna (HTTP 403), nie liczy się. Po przeczytaniu mogłaby być trzecim źródłem „tuż pod kolanem”.

## Pomiar silnika (cm / stopnie, u = 1, strona R)
| | przed (sztanga) | po (sztanga) | przed (hantle/linki) | po (hantle/linki) |
|---|---|---|---|---|
| ciężar na dole (y) | 55 | 45 | 55 | 45 |
| środek kolana (y) | 48 | 48 | 48 | 48 |
| kolano | 23° | 23° (maks. w ruchu 25,9°) | 12° | 16° (maks. 20,9°) |
| biodro | 74° | 90° | 70° | 85° |
| tułów od pionu | 55° | 66° | 60° | 72° |
| ramię od pionu | 17° | 17,3° | 23° | 23° |

Dopasowania rigu, żeby kolano zostało ≤ 27° przy niższym gryfie i odstęp ud–gryf ≤ 3,5 cm (próg strażnika styku): podudzie RDL (sztanga) na wyproście −2° zamiast +2° (`lib/figures/v2/variants.ts`), tor sztangi do 4 cm pod prostą (`dev`, `lib/figures/v2/rigs/hinge.ts`). Kolano „ok. 15°” przy ramionach 17° od pionu (decyzja 29.10.2026) i gryfie pod kolanem nie wychodzi: kolano 23–26°; cel „≤ 27°” zachowany.

## Do recenzji niezależnej (rodzina hinge; L-047, L-050)
Wpis `v2.hinge` w docs/research/figury-recenzja.json zostaje przy skrócie z recenzji 08.11.2026; rodziny (7) są na liście wyjątków `tests/recenzja-wyjatki-1-1.json` (niewidoczne w aplikacji), dopóki recenzent nie wpisze nowego skrótu (`node scripts/zrodla-runtime.mjs --skroty`, pole v2.hinge) i nie usunie pozycji z wyjątków.
Zmiana rysunku dotyczy tylko: RDL (sztanga) i RDL (hantle/linki). Pozostałe ćwiczenia — ruch bez zmian: md5 klatek (u 0, 0,25, 0,5, 0,75, 1; poprawnie, kneesBent, barAway) bazy `integracja-1-1` @ 9dc2b0a9 i tej gałęzi równe dla 183 z 185 ćwiczeń z rysunkiem v2; różnią się tylko RDL (sztanga) i RDL (hantle/linki). Skrót każdej z 7 rodzin zmienił się, bo `variants.ts` jest w `V2_WSPOLNE` — dla 6 pozostałych rodzin wystarczy recenzja różnicy (md5 równe) i nowe skróty; wszystkie 7 są na liście wyjątków.
Szkic wpisu (autor ≠ recenzent; recenzent wypełnia `recenzent`, `werdykt`, `stan`, `sha`, `slad`):
```json
{ "data": "2026-11-09", "autor": "programista (figury/rdl-glebokosc)", "recenzent": "", "kto": "recenzja niezależna zmiany RDL (sztanga) i RDL (hantle/linki) — ciężar na dole tuż pod kolanem", "slad": "arkusz ze śladem toru gryfu przed i po (profil i przód, u 0–1 co 0,05; scripts/figures/arkusz-slad.mjs)" }
```
Arkusze przed/po (profil i przód, kadry co 0,05 z nałożonym śladem toru gryfu): katalogi „przed” i „po” (PNG + HTML; skrypt scripts/figures/arkusz-slad.mjs, poza repozytorium — ścieżkę podaje koordynatorowi raport programisty).
