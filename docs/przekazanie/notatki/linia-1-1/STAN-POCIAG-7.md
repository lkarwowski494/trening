# Stan pociągu-7 (sesja I, 10.11.2026)

Gałąź `scal/pociag-7` od `integracja-1-1` @ 57406e7f. Scalenie `figury/partia-8` @ 213c3f9e (core_standing, sled_throw, strongman).

## Zrobione (SHA)
- d44557a2 — scalenie partii 8 (31 konfliktów; reguły KO-020: generatory, suma wpisów, cele 1.1 z symulacji). Cele: pelnaKarta 498 → 520, ćwiczeń poza pełną kartą 188; figura.v2 527 → 526 (i 3 pokrewne −1) przez wstrzymany Barbell Side Bend (KO-027) — wynik symulacji.
- d44557a2 — zad. 3 (L-080): pomocnik `odlaczenie(rodzina)` w `tests/helpers/skrot-v2-kopia.ts`; scenariusze podłączenia w `tests/skrot-v2-wynik.test.ts` i `tests/skrot-v2-podlaczenie.test.ts` startują z odłączonej strongman (po partii 8 nie ma rodziny planned z plikiem póz). Stara wersja czerwona („występuje 0 razy”), nowa 51/51.
- c1a7736b — docs/18: KO-030 (R3-W1 w draw.ts zostaje także dla lunge).
- 6a5ed25b — wpis v2 lunge sha f6b935560af3 po recenzji audytora („wyswietlana”, autor ≠ recenzent); raport `docs/research/recenzje/pociag-7-scalenie.md`; Z3 (przeskok gryfu na progu 1 cm, NISKIE) → docs/21; test mapping — kolejność rodzin.
- bfecacb9 — `tests/strona-eksport-recenzja.test.ts`: pilotaż w kopii drzewa (odłączona strongman, eksport z jej wpisem recenzji nie bierze figur); minima zapadki `--podnies-minimum` (41 metryk, w górę), cele = max(symulacja, minimum), języki 633.

## Skróty po scaleniu (`node scripts/zrodla-runtime.mjs --skroty`)
Rodziny spoza partii 8 = integracja 57406e7f, poza lunge f2ff1a209120 → f6b935560af3 (R3-W1, KO-030). Partia 8: core_standing ba395c4d26d1, sled_throw dade4388eeaa, strongman 04b91430146d.

## Decyzje do weta (docs/18, 10.11.2026)
- L-080 / 1A: rodzina odłączona w kopii (strongman) zamiast rodziny planned z repo.
- strona-eksport-recenzja: pilotaż tworzony w kopii.
- KO-030 (koordynator): lunge z nową recenzją.

## Otwarte / pułapki
- tests.yml na głowie — odbiór u koordynatora.
- Następna partia, która zmieni strongman (status/plik rodziny), musi przenieść `odlaczenie` na inną gotową rodzinę z plikiem póz.
- Kontrola sha256 promptu roli niewykonana (nie da się odtworzyć bajtów promptu w sesji).
- Wynik verify:szybkie: plik w scratchpadzie sesji I (log), końcówka w PRZEKAZANIU.
