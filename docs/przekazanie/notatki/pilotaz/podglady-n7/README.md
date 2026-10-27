# Podglądy n7 (pilotaż agent-pozy, bramka 4) — materiał dla niezależnego recenzenta

Zestaw: tylko dwa ćwiczenia z błędami recenzji n6 — Cocoons (`core_floor/`) i Decline Push Up (`pushup_plank/`). Pozostałe 27 póz nie zmieniło się od n6 (porównane z danymi w repo).
Źródło póz: gałąź `jakosc-r2` (SHA w tabeli 1.1 w `docs/przekazanie/README.md`); wygenerowane poleceniem
`node scripts/figures/agent-pozy/run.mjs --rodzina <rodzina> --wyjscie <katalog> --podglad --tylko "<Ćwiczenie>" --przed <poza sprzed poprawki>`.

## Co się zmieniło (do oceny ruchu)
- **Cocoons:** zwijanie bez lewitacji. Miednica unosi się 3,4 cm (było 8), start 1,3 cm niżej, najniższy punkt narysowanego ciała ≤ 0,8 cm nad podłogą w każdej klatce (było do 6,7 cm). Nowa reguła R17 `styk_z_podlozem` (bez warunku cechy ćwiczenia).
- **Decline Push Up:** stopy na podwyższeniu 43 cm (było 10) — wysokość typowej ławki z danych sprzętu; uproszczenie, otwarte do potwierdzenia przez badacza. Kąt przedramienia w dole ustawia położenie dłoni, nie wysokość podparcia. Krok P3: porównanie cechy rozpoznawczej przed i po w `pushup_plank/manifest.json` → `zmiany_sprzetu`.

## Zawartość katalogu rodziny
- `<Ćwiczenie>-light.png` — poza poprawna i rzędy błędów; widok z boku, potem z przodu, po jednej komórce na klatkę kluczową.
- `manifest.json` — klatki, `katy_stawow`, opis, `przyblizenia`, `na_krawedzi` (P2), `zgodnosc_manifestu`, `zmiany_sprzetu` i `lista_kontrolna` (P3).
- `katy-stawow.md` — tabela kątów stawów (krok 5 listy kontrolnej).
- `PODGLAD-WAZNY.txt` — znacznik kroku 6.

## Stan automatyczny (bez oceny ruchu)
- Walidator (kontrakt, niezmienniki silnika, reguły sensu, reguły jakości R1–R17): obie pozy bez błędów; żadna nie jest na krawędzi progu (P2).
- R17 nie daje fałszywych alarmów na żadnej z 49 póz w `lib/figures/v2/poses/*.json` (test `tests/figury-styk-z-podlozem.test.ts`).
- Ocena ruchu (cel, ustawienie, zgodność z rzeczywistością) należy do recenzenta; autor poprawki jej nie wykonuje.
