# Recenzja niezależna r2 (różnicy) — rodzina v2 `core_standing` (partia 8), 10.11.2026

Recenzent: audytor (sesja r2; nie pisał rodziny ani poprawek). Autor poprawek: programista core_standing. Zakres: `git diff 70fa2f75..d3e22931` (r1 na układzie KO-022 → poprawki). SHA: d3e22931 (figury/partia-8-core_standing).
Skrót v2 (`node scripts/zrodla-runtime.mjs --skroty`, liczony przez recenzenta): `0e202db15319` (r1: `cbf3be33b708`). `assignAll()`: 19.

**Werdykt rodziny: do poprawy** — 1 × WYSOKIE (R2-W1, W4 z r1 nieusunięte). Pozostałe znaleziska r1 usunięte albo rozstrzygnięte.

## Znaleziska r1 — stan
| r1 | Stan | Miara po |
|---|---|---|
| W1 | usunięte | prowadnica wm.arm przy ręce R (pole `side`); arkusz nakładki obu wiatraków; test W1 zielony |
| W2 | rozstrzygnięte | Barbell Side Bend w `V2_WSTRZYMANE` (P8-CS-1, decyzja leada do weta); eksport strony 402 → 401 |
| W3 | usunięte | tułów −76° od pionu, góra pleców na piłce (r 27,5 cm), łokcie 166–174°, obrót tułowia ± 36° |
| W4 | **nieusunięte → R2-W1** | koniec gryfu (pivot) ≤ 3 cm od dłoni, odcinek 20 cm; ale odcinek i ślad na z = 0 |
| W5 | usunięte | ślad = środek piłki (0 cm) we wszystkich kadrach |
| Ś1 | usunięte | „Ściąganie”/„Powrót”, lowerFirst false (dwa ćwiczenia z wyciągiem) |
| Ś2, N1 | backlog | P8-CS-2, P8-CS-3 w docs/21 |
| Ś3 | usunięte | łokieć Pallof w u = 1: 171–172° |

## Nowe znalezisko
| ID | Klasa | Pewność | Ćwiczenie | Opis i miara | Realność |
|---|---|---|---|---|---|
| R2-W1 | WYSOKIE | 95% | Landmine Rotation, rzut z przodu | Dłonie i koniec gryfu idą w bok (z = −19,1 → +19,1 cm), a odcinek „sztanga” 20 cm i ślad toru (`info.load`) stoją na osi ciała z = 0: w u = 0 i u = 1 są 19,1 cm od środka chwytów; na arkuszu poprzeczka i ślad na środku bioder, dłonie z boku. Przyczyna: `gear.ts:106` zeruje z środka sztangi `podazaZaChwytem`, `contract.ts:320` bierze ślad z `bar.c`; dopisek `landmine` w gałęzi FW1 (`contract.ts`) nie działa, bo ćwiczenie ma wpis „sztanga”. Test W4 sprawdza tylko `pivot.to`. Miara: `barbell.c` i `info.load` ≤ 3 cm od środka chwytów w każdej klatce. Alternatywa: wstrzymać ćwiczenie. | realny — każde otwarcie rysunku |

## Kod wspólny i testy (K14)
- `--skroty` r2 vs 70fa2f75: zmienia się tylko `v2.core_standing`; zestawy i karty bez zmian skrótu. Zmiana `contract.ts` (pilka_lekarska) dotyczy też sled_throw, które nie ma figury w aplikacji (`figureSpec` = null).
- `overlay.ts` pole `side`: domyślnie dawne `ctx.side` — inne rodziny bez zmian.
- 6 nowych wyjątków w `tests/tor-wyjatki.json` (Woodchop 8,8; oba wiatraki 14,9; Judo Flip 5,0; Bosu 4,2; Cable Russian Twists front 11,4 cm): łuki z obrotu/skłonu tułowia, progi bez zmian; Bosu 4,2 cm przy progu 4 — łuk zgięcia tułowia, bez zmian kierunku, przyjęte. `tests/figures-v2-tor.test.ts` i nowy test poprawek: 211/211 zielone (pojedyncze pliki, `--runInBand`).
- Zmiany list `V2_WSTRZYMANE` w 4 testach i licznik 401 — zgodne z wstrzymaniem; brak poluzowań.

## Bez znalezisk (obejrzane arkusze)
Cable Russian Twists front i side, Medicine Ball Full Twist front, Pallof Press side, Pallof Press With Rotation front, nakładka obu wiatraków front (nowe prowadnice przy ręce z ciężarem). Bosu Ball Cable Crunch With Side Bends — tylko wyjątek toru (poza bez zmian od r1).
