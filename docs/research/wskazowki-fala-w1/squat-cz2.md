# Wskazówki techniki — rodzina `squat`, cz. 2: warianty z gumami i łańcuchami

Data: 02.11.2026 · autor: badacz-merytoryczny · **Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1**

## Korekta szczebli 2 (02.11.2026)

W tym pliku to także pierwsza korekta (rozstrzygnięcie 1 koordynatora linii 1.1; oceny przeniesione z sekcji „Stan korekty” w
`kneeling_hinge.md`, dla spójności między plikami) i druga (rozstrzygnięcie 2, ~07:55). Nowych źródeł nie szukano; autorów stron
sprawdzono WebFetch 02.11.2026.

| Źródło / organizacja | Było | Jest | Uzasadnienie |
|---|---|---|---|
| The Prehab Guys (`prehab-squat-band`) | 4 | **5** | rozstrzygnięcie 2: 4 tylko z autorem z kwalifikacjami; strona sprawdzona 02.11 — brak osoby, tylko marka i daty (opublikowano 01.04.2020, akt. 23.08.2021) |
| Gymreapers (`gymreapers-banded-squats`) | 4? (do akceptacji) | **5** | ocena z `kneeling_hinge.md` (firma ze sprzętem, autor bez kwalifikacji, blog sprzedażowy — kryteria (b)–(c)) |
| Rubberbanditz (`rubberbanditz-squats`) | 4 | 4 (warunkowo) | producent gum — reguła producentów: 4 tylko dla własnego rodzaju sprzętu (przysiad z gumą bez sztangi — tak). Autora i charakteru wpisu (marketing?) nie sprawdzano ponownie — bez wpływu na wynik |
| EliteFTS (`elitefts-set-up-chains`) | 4 | 4 | producent sprzętu do trójboju (także łańcuchów) i artykuły trenerów z autorem (J. L. Holdsworth) — (a)–(c) spełnione; ocena nowej organizacji, do potwierdzenia koordynatora |
| Barbell Logic (`barbelllogic-set-up-chains`) | 4 | 4 | lista z `kneeling_hinge.md` (firma szkoląca trenerów) |

Przeliczenie zdań (≥ 2 niezależne źródła szczebla ≥ 4):
- **Band Squat** — `bsq.setup` i `bsq.move` miały The Prehab Guys + Rubberbanditz → zostaje tylko Rubberbanditz (1 źródło). Wskazówka o kolanach (tylko Prehab Guys) — teraz 0 źródeł szczebla 4.
- **Squat with Bands** — jedyne źródło (Gymreapers) ma szczebel 5 → brak źródła szczebla 4.
- **Squat with Chains** — bez zmian (EliteFTS 4; Barbell Logic bez techniki).
- Pozostałe 4 warianty — bez zmian (brak przeczytanego źródła).
- Bloku JSON z gotowymi wpisami nie było i nie ma. Gotowe: przed 0 → po 0. Reguła błędów (zaprzeczenie standardu) — nie dotyczy (brak zdań błędów).

Metoda: jak w `docs/research/33-wskazowki-partia2.md` i briefie fali W1. Wariant z dodatkiem (gumy, łańcuchy, odwrócone gumy) liczy się
tylko ze źródłem o tym wariancie; źródło o przysiadzie bez dodatku — tylko gdy samo mówi, że ruch jest ten sam. Wzór zdań: Back Squat
w `data/zrodla/cues.json`. ExRx (403) i web.archive.org (zablokowane) niedostępne.

## Tabela ćwiczeń

| Ćwiczenie (klucz katalogu) | Wynik | Uwagi |
|---|---|---|
| Squat with Bands | otwarte | jedyne przeczytane źródło o wariancie (Gymreapers) — szczebel 5 (korekta 02.11) |
| Squat with Chains | otwarte | 1 przeczytane źródło o ustawieniu łańcuchów (EliteFTS); Barbell Logic — tylko cel metody, bez techniki |
| Box Squat with Bands | otwarte | brak przeczytanego źródła o wariancie |
| Box Squat with Chains | otwarte | brak przeczytanego źródła o wariancie |
| Reverse Band Box Squat | otwarte | brak przeczytanego źródła o wariancie |
| Reverse Band Power Squat | otwarte | brak przeczytanego źródła o wariancie |
| Band Squat (sama guma, bez sztangi — katalog: `requires: bands`) | otwarte | po korekcie 02.11 ustawienie i ruch — 1 źródło szczebla 4 (Rubberbanditz); The Prehab Guys — 5 |

Żadne ćwiczenie nie spełnia minimum — brak bloku JSON z gotowymi wpisami.

## Zebrane dane częściowe

### Band Squat (guma pod stopami i przez górę pleców)
Źródła: The Prehab Guys „Squat – Band” (https://theprehabguys.com/vimeo-video/squat-band/; **szczebel 5** po korekcie 02.11 — tylko
informacja) i Rubberbanditz „The best leg exercise: squats” (https://www.rubberbanditz.com/blog/the-best-leg-exercise-squats, producent gum, 4).
- Ustawienie — proponowane `bsq.setup`: Rubberbanditz (guma pod obiema stopami i wokół barków); Prehab Guys „Setup” (zgodne, szczebel 5). Po korekcie 1 źródło szczebla 4.
- Ruch — proponowane `bsq.move`: Rubberbanditz (zejdź, jakbyś siadał na krześle; wstań bez odbijania); Prehab Guys (zgodne, szczebel 5). Po korekcie 1 źródło szczebla 4.
- Kolana nie zapadają się do środka — tylko Prehab Guys (szczebel 5).
- **Sprzeczności z zestawem ogólnym:** Rubberbanditz: „Your knees should not extend past your toes” i ciężar „on your heels” — przeczy `sq.kneesPast` i „całymi stopami” w `sq.down`; Prehab Guys pozwala na lekkie pochylenie. Dlatego `sq.down` z zestawu ogólnego nie przechodzi tu bez zmian.

### Squat with Bands (sztanga + gumy zaczepione u dołu)
Źródło: Gymreapers „Banded Squats” (https://au.gymreapers.com/blogs/news/banded-squats, R. Pilon; **szczebel 5** po korekcie — tylko informacja).
- Kroki 1–3: gumy jednakowe po obu stronach; zaczepione „directly underneath where you will be standing when you squat”; założone na końce sztangi w tej samej odległości.
- Krok 4: sztanga na plecach „as you would in a regular squat”; kroki 6–7: zejście przez zgięcie kolan i bioder, wstanie, napięcie gumy rośnie przy wstawaniu.
- Potrzebne dwa źródła szczebla 4 o wariancie (np. biblioteka organizacji szkolącej trenerów, materiał producenta gum do trójboju).

### Squat with Chains
Źródło: EliteFTS „Friday technique video: how to set up chains” (https://elitefts.com/blogs/training/friday-technique-video-how-to-set-up-chains, J. L. Holdsworth).
- Ustawienie: kołnierz dystansowy, łańcuch prowadzący na zewnątrz kołnierza, długość tak, by w pozycji stojącej część łańcucha leżała na podłodze (źródło podaje liczbę ogniw — liczba nie do aplikacji), długość zależy od wzrostu i techniki.
- Barbell Logic „How to set up chains” (https://barbell-logic.com/how-to-set-up-chains) — tylko cel (cała krzywa siły) i ostrzeżenie, że to metoda zaawansowana; bez techniki ani ustawienia w tekście (instrukcja tylko w osadzonym filmie zewnętrznym — nie oglądany).
- Brak źródła o ruchu z łańcuchami (czy technika jak w przysiadzie).

## Nowe zdania (propozycje — do użycia po uzupełnieniu źródeł)

| id | PL | EN (propozycja) | uzasadnienie |
|---|---|---|---|
| `bsq.setup` | Stań obiema stopami na gumie, drugi koniec przełóż przez górę pleców i przytrzymaj rękami. | Stand on the band with both feet, loop the other end over your upper back and hold it in place with your hands. | `sq.bar` mówi o sztandze i stojaku. Po korekcie 1 źródło szczebla 4. |
| `bsq.move` | Zejdź w przysiad, cofając biodra, potem wróć do stania. | Squat down by pushing your hips back, then stand back up. | `sq.down` zawiera „całymi stopami”, czemu przeczy jedno z przeczytanych źródeł. Po korekcie 1 źródło szczebla 4; „cofając biodra” miało oparcie w Prehab Guys (5) — przy uzupełnianiu sprawdzić, czy drugie źródło je potwierdza. |

## Nowe źródła (przeczytane, niewystarczające do „gotowe”)

| id | adres | organizacja | szczebel | miejsce / krótki cytat |
|---|---|---|---|---|
| `prehab-squat-band` | https://theprehabguys.com/vimeo-video/squat-band/ | The Prehab Guys | **5** (korekta 02.11: bez autora) | „squat down similarly to how you would perform a back squat” |
| `rubberbanditz-squats` | https://www.rubberbanditz.com/blog/the-best-leg-exercise-squats | Rubberbanditz (producent gum) — nowa | 4 (własny rodzaj sprzętu) | „Stabilize one band under both feet and around shoulders.” |
| `gymreapers-banded-squats` | https://au.gymreapers.com/blogs/news/banded-squats | Gymreapers — nowa | **5** (korekta 02.11) | Kroki 1–7 |
| `elitefts-set-up-chains` | https://elitefts.com/blogs/training/friday-technique-video-how-to-set-up-chains | EliteFTS (producent sprzętu do trójboju, artykuły trenerów) — nowa | 4 | „first attach a spacer collar to ensure the chains do not drag on the power rack” |
| `barbelllogic-set-up-chains` | https://barbell-logic.com/how-to-set-up-chains | Barbell Logic — nowa (patrz leg_machine.md) | 4 | „Using chains while lifting is an advanced technique” |

Do `cues.json` (gdy zasilą gotową kartę) — tylko źródła szczebla 4; `prehab-squat-band` i `gymreapers-banded-squats` nie dopisywać.

```json
{
  "orgs": {
    "Rubberbanditz": {"name": "Rubberbanditz — blog producenta gum oporowych (rubberbanditz.com) — tylko gumy", "level": 4, "kind": "maker"},
    "EliteFTS": {"name": "EliteFTS — artykuły trenerów, producent sprzętu do trójboju (elitefts.com)", "level": 4, "kind": "maker"}
  },
  "sources": {
    "rubberbanditz-squats": {"org": "Rubberbanditz", "title": "The Best Leg Exercise: Squats", "url": "https://www.rubberbanditz.com/blog/the-best-leg-exercise-squats", "level": 4},
    "elitefts-set-up-chains": {"org": "EliteFTS", "title": "How to Set Up Chains", "url": "https://elitefts.com/blogs/training/friday-technique-video-how-to-set-up-chains", "level": 4},
    "barbelllogic-set-up-chains": {"org": "Barbell Logic", "title": "How To Set Up Chains", "url": "https://barbell-logic.com/how-to-set-up-chains", "level": 4}
  }
}
```

## Otwarte

- **Wszystkie 7 wariantów** — brak 2 przeczytanych źródeł szczebla 4 o wariancie. Rozstrzygnie: biblioteki organizacji szkolących trenerów albo materiały producentów sprzętu do trójboju z opisem ruchu z gumami/łańcuchami (box, odwrócone gumy).
- **Band Squat (korekta 02.11)** — `bsq.setup`, `bsq.move` po 1 źródle szczebla 4 (Rubberbanditz); The Prehab Guys bez autora z kwalifikacjami → 5. Rozstrzygnie: drugie źródło szczebla 4 o przysiadzie z samą gumą (np. inny producent gum, organizacja szkoląca trenerów).
- **Squat with Bands (korekta 02.11)** — Gymreapers → 5; brak źródła szczebla 4.
- **Zestawy ogólne (`cue-sets.json`) — informacja o błędach:** wszystkie 7 wariantów ma zestaw `squat` (`sq.down`, `sq.back`, `sq.kneesToes`, `sq.mis.kneesIn`, część `sq.mis.heels`) bez przeczytanego źródła o wariancie. Przy Band Squat jedno przeczytane źródło przeczy `sq.down` („całymi stopami” wobec „ciężar na piętach”) i `sq.kneesPast`. „Band Squat” w katalogu wymaga tylko gum (bez sztangi), a `sq.down`/`sq.back` pochodzą z przysiadu ze sztangą.
- **EliteFTS** — ocena nowej organizacji (4) do potwierdzenia koordynatora; bez wpływu na wynik.

## Dostęp

- ExRx — 403; web.archive.org — zablokowane.
- elitefts.com/blogs/powerlifting/squatting-with-bands — 404.
- bodybuilding.com/exercises/squat-with-chains → shop.bodybuilding.com — 404.
- usawa.com/page/409 — strona bez instrukcji (lista wpisów).
- food.unl.edu (PDF z ćwiczeniami z gumą) — 403.

## Stan

Zrobione: przegląd wstępny 7 wariantów (dane częściowe wyżej); korekta szczebli 1 i 2 (02.11). Nie szukano jeszcze osobno: Box Squat
with Bands/Chains, Reverse Band Box Squat, Reverse Band Power Squat (tylko wyszukiwania ogólne o gumach i łańcuchach). Następny krok:
szukać materiałów EliteFTS / producentów gum do trójboju o box squat i odwróconych gumach, drugiego źródła o ustawieniu łańcuchów i gum
oraz drugiego źródła szczebla 4 dla Band Squat. Pułapki: ExRx i archiwum niedostępne; wiele wyników to strony aplikacji (pominąć) i kopie
spamowe; strony bodybuilding.com przekierowują do sklepu (404); strony The Prehab Guys nie mają autora (szczebel 5).
