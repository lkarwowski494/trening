# Podglądy n6 (pilotaż agent-pozy, bramka 4) — materiał dla niezależnego recenzenta

Zestaw: te same 29 ćwiczeń co w n5 (17 w `pushup_plank/`, 12 w `core_floor/`).
Źródło póz: gałąź `jakosc-r2` @ f1e9e314; wygenerowane poleceniem
`node scripts/figures/agent-pozy/run.mjs --rodzina <rodzina> --wyjscie <katalog> --podglad`.

## Zawartość katalogu rodziny
- `<Ćwiczenie>-light.png` — wiersze: poza poprawna, potem po jednym wierszu na błąd; w wierszu najpierw widok z boku, potem z przodu, po jednej komórce na każdą klatkę kluczową.
- `manifest.json` — klatki (`klatki_u`), `katy_stawow` (min…max na staw), opis ćwiczenia i błędów, `przyblizenie` (krok 1 listy), `na_krawedzi` (P2), `zgodnosc_manifestu`.
- `katy-stawow.md` — tabela kątów stawów dla recenzenta (krok 5 listy kontrolnej, docs/53): min…max w całym ruchu, obie strony, pozy poprawne.
- `PODGLAD-WAZNY.txt` — znacznik z kroku 6 (kontrola manifestu bez niezgodności).

## Stan automatyczny (bez oceny ruchu)
- Walidator `waliduj` (kontrakt, niezmienniki silnika: stała długość taśmy, kolano po swojej stronie osi; reguły sensu; reguły jakości R1–R16): 29/29 poz bez błędów.
- Ćwiczenia z zapasem od progu mniejszym niż margines (P2, pole `na_krawedzi` w manifeście): Single-Arm Push-Up, Mountain Climbers, Rollout (sztanga), Barbell Rollout from Bench, Standing Barbell Rollout. Pozostałe 24 są w środku przedziałów reguł.
- Do sprawdzenia przez recenzenta niezależnie od powyższego: lista kontrolna bramki 4 z `docs/przekazanie/notatki/53-grafiki-model-pracy.md` (kroki 1–7), w tym krok 4 (nowe reguły na pozach, których nie zmieniano) oraz porównanie tabeli kątów z opisem ćwiczenia.
