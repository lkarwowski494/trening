# Stan partii 3 rodzin figur v2 (figury/partia-3) — 09.11.2026

Rodziny: pulldown, shrug, hip_abd_add, leg_machine, glute_floor. Gałąź od `origin/integracja-1-1` (aeabf69a), scalona z `figury/slad-dzwignia` (D1 A).

## Rodziny
| Rodzina | Stan | Skrót v2 | Recenzje (docs/research/recenzje/) |
|---|---|---|---|
| pulldown | wyswietlana 8/8 | 335199eb4c79 | p3-pulldown-audytor (r1: N1 WYSOKIE), p3-pulldown-r2 (N1 naprawione) |
| shrug | wyswietlana 8/8 | cf2edb2c70fe | p3-shrug-audytor (r1: W1–W4 WYSOKIE), p3-shrug-r2 |
| hip_abd_add | wyswietlana 4 (marsze wstrzymane) | eddcd1af9d43 po D1 — recenzja różnicy r3 w toku | p3-hip-abd-add-audytor, -r2, -r3 |
| leg_machine | włączona, recenzja w toku | 39d2c2b68d32 | p3-leg-machine-audytor |
| glute_floor | planned (brak reguły „ustalone” ze zdaniem karty → nakładka niemożliwa; badacz) | — | — |

## Decyzje (docs/18, 09.11.2026)
- D1 A (koordynator): ślad dźwigni = punkt styku — gałąź `figury/slad-dzwignia` (wypchnięta, tests.yml w toku).
- D2 A (koordynator): EN „Ściąganie” = „Pulling”.
- Partia: szrugsy w bez_bramki_ruchu + reguła rece_proste; marsze z gumą bez rysunku; kąt ukryty hip_abd_add.

## Następne kroki
1. Wynik recenzji leg_machine + różnica hip (r3) → wpisy (`scratchpad wpisz.py`: v2, karty Leg Press, v1 Leg Press → zastapiona, zestawy).
2. tests.yml zielony dla slad-dzwignia → raport koordynatorowi.
3. Scalić `origin/integracja-1-1`, przeliczyć generowane (README, docs/19, docs/51, docs/55, data.json), `npm run verify:szybkie`, push, tests.yml.
4. Raport końcowy.

## Pułapki
- `test-matrix --write` po każdej zmianie tytułu testu (inaczej verify:szybkie pada na końcu, ok. 20 min).
- figury-sens.json ręcznie formatowany — edycje tekstowe.
- Zestaw ogólny bez wpisu „zestawy” → nakładka nie rysuje się (strażnik kazda-rodzina).
