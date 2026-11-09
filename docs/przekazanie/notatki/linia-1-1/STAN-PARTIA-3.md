# Stan partii 3 rodzin figur v2 (figury/partia-3) — 09.11.2026, przekazanie (kontekst sesji > 30%)

Rodziny: pulldown, shrug, hip_abd_add, leg_machine, glute_floor. Gałąź od `origin/integracja-1-1` (aeabf69a), scalona z `figury/slad-dzwignia` (D1 A, 458e5766). Brief partii: prompt startowy sesji partii 3 (koordynator linii 1.1, session_01T66VByJCWCao1Hw3is68Cy).

## Rodziny (wpisy v2 w docs/research/figury-recenzja.json, skróty z `node scripts/zrodla-runtime.mjs --skroty`)
| Rodzina | Stan | Skrót v2 | Recenzje (docs/research/recenzje/) |
|---|---|---|---|
| pulldown | wyswietlana 8/8 | 335199eb4c79 | p3-pulldown-audytor (r1: N1 WYSOKIE), p3-pulldown-r2 (N1 naprawione) |
| shrug | wyswietlana 8/8 | cf2edb2c70fe | p3-shrug-audytor (r1: W1–W4 WYSOKIE), p3-shrug-r2 |
| hip_abd_add | wyswietlana 4/8 (Lateral Band Walk, Monster Walk bez rysunku — backlog) | eddcd1af9d43 (po D1) | p3-hip-abd-add-audytor, -r2, -r3 |
| leg_machine | wyswietlana 6/8 (Calf Press, Smith Machine Leg Press — wyjątki) | 39d2c2b68d32 | p3-leg-machine-audytor |
| glute_floor | planned — brak reguły „ustalone” z przypisanym zdaniem karty (nakładka niemożliwa); badacz w drugiej turze koordynatora | — | — |

Wszystkie recenzje: audytor (subagent), autor ≠ recenzent; ŚREDNIE/NISKIE w docs/21 („Backlog 1.1.x — figury: partia 3”).

## Decyzje (docs/18, 09.11.2026)
- D1 A (koordynator): ślad dźwigni = punkt styku — gałąź `figury/slad-dzwignia` zielona (tests.yml 42693069750), koordynator scalił do integracji lokalnie (55c9f206).
- D2 A (koordynator): EN „Ściąganie” = „Pulling” (+ kontekst tłumaczy; _source.json przeliczony).
- Partia: szrugsy w bez_bramki_ruchu + reguła rece_proste; marsze z gumą bez rysunku; kąt ukryty hip_abd_add.
- Cel 1.1 (wariant A zatwierdzony przez koordynatora do weta): pokrycie-cele.json z symulacji po wstrzymaniu marszów — pelnaKarta 457 → 456, figura.v2 533 → 531; powrót do 457 po poprawce marszów. **Do zrobienia: wpis w docs/18 tej decyzji koordynatora (odrzucone B, pola wdrożenie/test/wykonalność) i ID w backlogu docs/21 z warunkiem powrotu celu.**

## Następne kroki (sesja kontynuacji)
1. Naprawić ostatni czerwony test: `tests/gemini-polecenia.test.ts` „ćwiczenia czekające na kontrakt (pole wymaga, r5)” — przypadek oparty na rodzinie shrug, która jest teraz ready (klasyfikujCwiczenia nie daje ćwiczeń „do zrobienia”); przepiąć na rodzinę planned z regułami `wymaga: poza@2` (np. carry/core_standing — sprawdzić, czy WSZYSTKIE ćwiczenia rodziny przechodzą do „czeka” po poza@3). Reszta pełnej bramki zielona po poprawkach (17073 testów, 7 czerwonych → 6 naprawionych w ostatnim commicie: _source.json, public-repo /tmp, fix4, 101-squat, recenzja-p3, gemini liczba rodzin 34 → 30).
2. Wpis docs/18 (cel 1.1, punkt wyżej) + ID backlogu marszów.
3. Scalić `origin/integracja-1-1` (gdy koordynator wypchnie: delt_raise bb1072f3 + slad 55c9f206): konflikty w plikach generowanych → wersja partii + generatory (`zrodla-runtime --write`, `pokrycie-katalogu --write`, `test-matrix --write`, `readme --write`, `figures/v2-gen --write`, `i18n-context --write`, ZLOTE_ZAPISZ=1 zgodność wsteczna z wpisem zmiany celowej); rejestr TECHNIQUE (overlay.ts) — dopisać obie strony; listy rodzin w testach (mapping, triceps-olympic, recenzja-wyjatki, figury-recenzja/skrot-v2-wynik regex, strona-eksport liczba); **cel 1.1 = symulacja na wspólnym stanie** (`node scripts/pokrycie-symulacja.mjs --json`, pokrycie-cele.json) — podać liczby w raporcie. Skróty rodzin partii po scaleniu sprawdzić `--skroty` (zmiana = recenzja różnicy).
4. `npm run verify:szybkie` (przed nim `test-matrix --write` i `readme --write`), push, zielony tests.yml.
5. Raport końcowy do koordynatora (send_message): SHA, przebieg tests.yml, per rodzina (powyżej), zysk pokrycia (przed: figura.v2 183, pełna karta 180 na integracji aeabf69a; po partii przed scaleniem delt: 198/204), przekład: 0 nowych kluczy (31 id wskazówek w 35 słownikach; tylko ponowne sprawdzenie frazy „Ściąganie” w innych językach przez recenzenta lokalizacji, koszt API 0), otwarte: glute_floor, marsze z gumą, cel 457.

## Pułapki
- `test-matrix --write` i `readme --write` po każdej zmianie tytułu testu/licznika — inaczej verify pada na końcu (ok. 25 min).
- figury-sens.json ręcznie formatowany — edycje tekstowe, nie json.dump; pokrycie-cele.json: `poza11` w jednej linii.
- Zestaw ogólny bez wpisu „zestawy” → nakładka nie rysuje się (strażnik kazda-rodzina); pole `rodzina` wpisu zestawu = wzorzec z cue-sets.json (`f`), nie rodzina figury.
- Pole `liczba` we wpisie v2 = liczba ćwiczeń rodziny w katalogu (nie z rysunkiem).
- Raporty recenzentów nie mogą zawierać ścieżek /tmp (public-repo SEC2-08).
