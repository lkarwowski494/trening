# Etap 2 (ZB-033) — luki źródeł kart ćwiczeń po uwzględnieniu badań

Data: 03.11.2026. Wynik skryptu `python3 docs/research/etap2/wyniki-2026-11-03/licz.py` (wejście: `stan-repo.json` z `node docs/research/etap2/wyniki-2026-11-03/stan-repo.mjs` — `policz()` z `scripts/pokrycie-katalogu.mjs` na integracja-1-1 42aee4d (różni się od origin 8306c14 tylko 2 dokumentami); `data/zrodla/cues.json` z repo i z `origin/integracja/p2-moc`; bloki ```json „Blok do wdrożenia” z 15 gałęzi `origin/badania/*`). Liczby niżej przepisane z `wynik.json`.

## Reguła liczenia

- Sekcja pokryta = niepusta lista `setup` (ustawienie), `move` (ruch), `mistakes` (częste błędy) we wpisie ćwiczenia w repo, na P2 albo w aktualnym bloku do wdrożenia gałęzi badań (badacze wpisują tylko zdania spełniające próg szczebli po przeliczeniu 02.11.2026). Suma (unia) warstw.
- Pomijane: bloki z nagłówkiem NIEAKTUALNY / warunkowy / wstrzymani / kandydaci / częściowe / otwarte, pliki ról mięśni, bloki W1 uznane za nieaktualne w plikach przeliczenia (g4: `przeliczenie-szczebli-2026-11-02.md:117-120`; g5: `:9-10`). Gdy plik ma „Blok do wdrożenia”, liczą się tylko takie bloki.
- Zestaw ogólny rodziny (77 ćwiczeń w aplikacji) NIE liczy się jako źródła ćwiczenia → te ćwiczenia są w lukach z flagą `zestaw_ogolny` (jeśli koordynator uzna zestaw ogólny za wystarczający, odjąć je).
- Pendlay Row i calf.step — etap 2 zrobiony (`docs/research/etap2/p0-luki.md`), luki z `data/zrodla/cues.json → luki` nie liczone.

## Liczby

| | liczba |
|---|---|
| ćwiczeń w katalogu | 708 |
| komplet (ustawienie + ruch + błędy) po badaniach | **377** (repo 85, P2 36, gałęzie badań 256) |
| — w tym niepewne (warunkowo, `niepewne.json`) | 46 |
| ćwiczeń z luką | **331** |
| — luka ustawienia lub ruchu | **290** |
| — luka tylko „częste błędy” | **41** |
| — w tym zestaw ogólny rodziny | 48 |
| — w tym blok warunkowy w badaniach | 3 |
| — w tym wyjątek (bez animacji / brak źródła techniki) | 29 |
| obowiązkowe 1.1 z luką | **9 z 51** |

## Obowiązkowe z luką (na początek każdej paczki)

- Bird Dog (core_floor, paczka A) — brakuje: bledy; sekcje ze źródłami: ruch, ustawienie
- High Cable Curl (curl, paczka D) — brakuje: ustawienie, ruch, bledy; brak źródeł w repo i w blokach do wdrożenia gałęzi badań (dane częściowe mogą być w plikach — opis tekstowy)
- Triceps Dip (dip, paczka B) — brakuje: ustawienie, ruch, bledy; blok warunkowy (decyzja koordynatora o szczeblu)
- Hip Abduction (hip_abd_add, paczka C) — brakuje: ustawienie, ruch, bledy; blok warunkowy (decyzja koordynatora o szczeblu)
- Nordic Curl (leg_isolation, paczka C) — brakuje: bledy; sekcje ze źródłami: ruch, ustawienie
- Sissy Squat (leg_isolation, paczka C) — brakuje: ustawienie, ruch, bledy; blok warunkowy (decyzja koordynatora o szczeblu)
- Inverted Row (pushup_plank, paczka B) — brakuje: bledy; sekcje ze źródłami: ruch, ustawienie
- Meadows Row (row, paczka D) — brakuje: bledy; sekcje ze źródłami: ruch, ustawienie
- Medicine Ball Slam (sled_throw, paczka D) — brakuje: ustawienie, bledy; sekcje ze źródłami: ruch

Źródło szczebla 4 od właściciela (Sakowski, `badania/obowiazkowe-1-1:…/etap2-kandydaci.md`) nadaje się do drugiego źródła ustawienia i ruchu przy dipach (Triceps Dip) — bez błędów; błędy nadal wymagają 2 źródeł szczebla 4 albo ścieżki etapu 2.

## Paczki dla badaczy (szczebel 5, 4 serwisy — ZB-033 wariant B)

| Paczka | ćwiczeń | obowiązkowe | ustawienie/ruch | tylko błędy | zestaw ogólny | wyjątek | rodziny (luki) |
|---|---|---|---|---|---|---|---|
| A — tułów, mobilność, cardio | 83 | 1 | 72 | 11 | 0 | 12 | core_floor 30, mobility_stand 15, cardio 12, core_standing 10, mobility_floor 7, back_extension 4, neck 3, foam_roll 1, rotator_cuff 1 |
| B — pchanie i triceps | 78 | 2 | 63 | 15 | 14 | 6 | pushup_plank 19, bench_press 15, chest_fly 15, overhead_press 11, triceps 8, chest_press_machine 4, dip 3, cable_press 3 |
| C — nogi, biodra, skoki | 87 | 3 | 80 | 7 | 28 | 7 | hinge 17, plyo 15, lunge 13, squat 13, leg_isolation 9, leg_machine 5, hip_abd_add 4, calf_raise 4, hip_bridge 3, glute_floor 2, kneeling_hinge 2 |
| D — barki, ramiona, przyciąganie, moc | 83 | 3 | 75 | 8 | 6 | 4 | delt_raise 27, curl 9, sled_throw 9, strongman 8, pull_up 7, kb_ballistic 6, forearm 4, cable_row 3, olympic 3, row 2, carry 2, shrug 2, pulldown 1 |

Lista ćwiczeń paczki: `luki.json`, pole `paczka` (kolejność: obowiązkowe, potem rodzina i nazwa).

## Niepewne

- 46 ćwiczeń policzonych jako komplet ma nazwę w wierszu „warunkowo” pliku STAN grupy (zależą od decyzji koordynatora o szczeblu jednego źródła, np. NFPT, Bells of Steel, EliteFTS) — `niepewne.json`. Dopasowanie po tekście, może łapać wiersz dotyczący innego zdania; przy odmowie koordynatora wracają do luk.
- Unia warstw: gałąź W2 mogła cofnąć zdanie W1 opisane tylko tekstem (np. przeliczenie per zdanie) — skrypt widzi tylko bloki JSON, więc taki spadek przeoczy.
- `badania/lokalne-0211`: bloki w `curl.md` i `curl-2.md` nieparsowalne (fragmenty JSON), a ich „Blok do wdrożenia” jest pusty — curl liczony z `w2-ramiona` i repo.
- Ćwiczenia z kompletem tylko z badań nie są jeszcze wdrożone (status PROPOZYCJA, bramka 4 — recenzja niezależna przed wydaniem).
- Wyjątki: `wyjatek` w `luki.json` = powód z `data/zrodla/cues.json → open` (brak źródła techniki) albo `lib/cues/data.json → open` (bez animacji).
