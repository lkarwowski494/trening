# Stan partii 5 (linia 1.1) — forearm, carry, core_hang, rotator_cuff, kneeling_hinge

Aktualizacja: 10.11.2026 ~09:00 UTC (sesja B koordynatora, programista). Polecenie: `docs/koordynacja/polecenia/B.md` na gałęzi `koordynacja`; decyzja KO-021 (scalenie integracji, opcja A).

## Zrobione w tej sesji
- Strażniki poluzowane przez poprzednika — przegląd niezależny (audytor): `docs/research/recenzje/partia5-straznicy-przeglad-audytor-2026-11-10.md`; wszystkie 3 uzasadnione; zawężenia w 432be36 (l103 37 → 36 przed scaleniem; kierunek-u przypięty do 5 ćwiczeń).
- Lekcja `## L-NNN` (adres e-mail w briefie w historii gałęzi) + mechanizm `scripts/skan-publiczny.mjs` w `check:pochodne` (c3b25d5; decyzja docs/18 10.11.2026, do weta).
- rotator_cuff: recenzja r1 (audytor) — wyswietlana, 0 KRYTYCZNYCH/WYSOKICH; scalona do `figury/partia-5` (db2414e), wpisy w `figury-recenzja.json` (v2 aef0547423ef, 2 zestawy, 5 kart); backlog RC-S1/N2/N4/P1 w docs/21.
- Scalenie `origin/integracja-1-1` @ dfaeeefe (ca2ae91; 5 części Jest w tests.yml) + przegląd scalenia (audytor, `partia5-scalenie-integracji-audytor-2026-11-10.md`) i poprawki braków (6728bde, 216aba1).
- `poseData.ts` skrócone komentarze (limit 20 KB po scaleniu; zapas tylko 48 B).

## Stan rodzin
| Rodzina | Recenzja | Stan |
|---|---|---|
| carry | r2 wyswietlana (bc03d01d72f6) | włączona |
| core_hang | r2 wyswietlana (43a33ada7ec7) | włączona |
| forearm | r3 wyswietlana (4f6519625eed) | włączona |
| kneeling_hinge | r2 wyswietlana (17d7fac90626); bez nakładki — wyjątek KH-F1 | włączona |
| rotator_cuff | r1 wyswietlana (aef0547423ef) | włączona |

Cele 1.1 z symulacji po scaleniu z integracją: animowanyBlad 269, roleMiesni 524, pelnaKarta 460; ciężkich 248, (c) 11.

## Otwarte / następne kroki
1. Zielony tests.yml na końcowym SHA (sprawdza koordynator).
2. Decyzja produktowa RC-P1 (widok rotacji stojących) — przez studio-projektowe.
3. glute_floor (tura 3) — poza zakresem tej sesji.
4. Integracja przesunie się o pociąg-4; dociągnięcie robi pociąg-5.

## Pułapki
- Lokalny klon płytki: `tests/maestro-57-bramka.test.ts` czyta commit f77db9b — przed verify `git fetch --unshallow origin` (CI ma pełną historię).
- `lib/figures/v2/poseData.ts` ma 20 432 B przy limicie 20 480 B (`tests/architecture-limits.test.ts`) — kolejna rodzina wymaga skrótu albo podziału pliku.
- Po wpisie recenzji zestawu ogólnego sprawdź `tests/figures-v2-data.test.tsx` (BLAD_NIEWIDOCZNY: błąd tempa mis.jerk) i `tests/karty-recenzja.test.tsx`.
- Restart kontenera kasuje niezacommitowaną pracę — commit po każdym kroku.
