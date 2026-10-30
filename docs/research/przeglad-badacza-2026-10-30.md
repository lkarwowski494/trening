# Przegląd wpisów T-005, T-039, T-040 po przeniesieniu przeglądu z 21.10.2026 na Dysk (ZB-004, P3 = B)

- autor zmiany rejestru: programista (ZB-004)
- recenzent: badacz-merytoryczny
- data: 30.10.2026
- Powód: dokument `przeglad-badacza-2026-10-21.md` przeniesiono na Dysk (decyzja właściciela 30.10.2026, P3 B; docs/46 pkt 8). Wpisy rejestru twierdzeń, które go wskazywały, dostają dokument zostający w repo.
- Czytane: wpisy w `docs/research/rejestr-twierdzen.json`, przegląd z 21.10.2026 (pkt 1–4, teraz na Dysku), dokumenty zostające w repo (`przeglad-badacza-2026-10-21b.md`, `przeglad-badacza-2026-10-23.md`, `przeglad-tresci-2026-10-27.md`), `scripts/claims.mjs` (wpis ma dokument z frazą albo uwagę „[OTWARTE”).

## T-040 — asekuracja przy sztandze na tułowiu lub nad głową

- Podstawa: NSCA 2017, Standard 3.2 (szczebel 2), uproszczenie (standard dla programów prowadzonych → trening samodzielny).
- Ta sama podstawa w dokumencie zostającym: `przeglad-badacza-2026-10-23.md`, sekcja „Źródło (przeczytane dziś, surowy tekst)” (cytat Standardu 3.2, s. 11, odczyt 23.10.2026), werdykt: ustalone, przeniesienie = uproszczenie.
- Ocena: **ustalone** (jedno źródło szczebla 2 z twierdzeniem wprost), rodzaj „uproszczenie” — bez zmian.
- Werdykt: dokument `przeglad-badacza-2026-10-23.md`, fraza „Standard 3.2”.

## T-039 — „Krok zmiany (np. +2,5 kg) to nasz wybór, a nie wynik badań.” (tekst wycofany z interfejsu 23.10.2026)

- Podstawa: ACSM 2026 nie podaje kroku w kg ani progu; konwencja.
- Ta sama treść w dokumencie zostającym: `przeglad-badacza-2026-10-21b.md`, wiersz T-003 (konwencją jest moment i wielkość kroku) oraz „Zmiany tekstów do wdrożenia” pkt 2 (przedział 2–10% to ACSM 2009, ACSM 2026 go nie powtarza).
- Ocena: **konwencja** (rodzaj bez zmian). Zastrzeżenie: ACSM 2009 podaje krok procentowy 2–10% (szczebel 2), więc konwencją jest konkretna wartość w kg, nie sama zasada zwiększania. Tekst jest wycofany, nic nie trafia do aplikacji.
- Werdykt: dokument `przeglad-badacza-2026-10-21b.md`, fraza „wielkość kroku”.

## T-005 — częstotliwość partii, dzień pomocniczy i podział sesji

| Część | Źródło (szczebel) | Dokument w repo | Stan |
|---|---|---|---|
| 1. ≥ {n} dni na partię, zalecenie zdrowotne | WHO 2020, tab. 4 (S2) | `przeglad-badacza-2026-10-21b.md`, wiersze T-023 i T-025 | pokryte |
| 2. częstotliwość a siła, brak proporcjonalności, mała różnica przy równych seriach | ACSM 2026 (S2) | `przeglad-tresci-2026-10-27.md` Z-A oraz cytat niżej | pokryte |
| 3. dzień pomocniczy = {h} (0,5) | Pelland 2026 (S2) | `przeglad-badacza-2026-10-21b.md`, wiersz T-012; `docs/brd/zrodla.md` S-03 | pokryte |
| 4. podział sesji przy równych seriach → podobne efekty | Ramos-Campo 2024 (S2, przegląd systematyczny z metaanalizą) | ten dokument, cytat niżej | pokryte |

Odczyt 30.10.2026 (części 2 i 4):
- ACSM 2026, Currier i in., MSSE 58(4):851–872, https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12965823/fullTextXML, Dyskusja: „RT frequency was found to impact strength; however, there was insufficient evidence to conclude a dose-response relationship” oraz „the impact is diminished when volume is equated”.
- Ramos-Campo DJ i in., „Efficacy of Split Versus Full-Body Resistance Training on Strength and Muscle Growth: A Systematic Review With Meta-Analysis”, J Strength Cond Res 2024;38(7):1330–1340, doi:10.1519/jsc.0000000000004774, rekord Europe PMC MED 38595233 (https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:38595233%20AND%20SRC:MED&resultType=core&format=json), streszczenie, Conclusions: „does not significantly impact either strength gains or muscle hypertrophy when volume is equated”.

Ocena: wszystkie cztery części **mają podstawy** — każda ma źródło szczebla 2 z twierdzeniem wprost; rodzaje bez zmian: „konwencja” (wybór {n} = dolna granica, podział dowolny jako mechanika), „uproszczenie” (waga 0,5 — założenie modelu Pelland). „Więcej dni nie musi dawać proporcjonalnie więcej” jest zgodne z brakiem dowodu zależności dawka–odpowiedź (nie twierdzi braku zależności); „różnice są małe” kierunkowo zgodne z „impact is diminished”.
- Werdykt: dokument — ten plik, fraza „Ramos-Campo”.

Brzmienia wszystkich trzech wpisów bez zmian — `--rehash` niepotrzebny (zmieniają się tylko pola dokument, fraza, uwaga, przegląd).

## Otwarte pytania

- Pozostałe otwarte pytania z przeniesionego dokumentu (maszyna Smitha, wysokość ramion asekuracyjnych, drugie źródło o asekuracji) są powtórzone w `przeglad-badacza-2026-10-23.md`.

Aplikacja nie udziela porad medycznych: przy bólu lub urazie — specjalista.
