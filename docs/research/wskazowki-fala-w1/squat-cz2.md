# Wskazówki techniki — rodzina `squat`, cz. 2: warianty z gumami i łańcuchami

Data: 02.11.2026 · autor: badacz-merytoryczny · **Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1**

Metoda: jak w `docs/research/33-wskazowki-partia2.md` i briefie fali W1. Wariant z dodatkiem (gumy, łańcuchy, odwrócone gumy) liczy się
tylko ze źródłem o tym wariancie; źródło o przysiadzie bez dodatku — tylko gdy samo mówi, że ruch jest ten sam. Wzór zdań: Back Squat
w `data/zrodla/cues.json`. ExRx (403) i web.archive.org (zablokowane) niedostępne.

## Tabela ćwiczeń

| Ćwiczenie (klucz katalogu) | Wynik | Uwagi |
|---|---|---|
| Squat with Bands | otwarte | 1 przeczytane źródło o wariancie (Gymreapers, autor bez podanych kwalifikacji — do akceptacji) |
| Squat with Chains | otwarte | 1 przeczytane źródło o ustawieniu łańcuchów (EliteFTS); Barbell Logic — tylko cel metody, bez techniki |
| Box Squat with Bands | otwarte | brak przeczytanego źródła o wariancie |
| Box Squat with Chains | otwarte | brak przeczytanego źródła o wariancie |
| Reverse Band Box Squat | otwarte | brak przeczytanego źródła o wariancie |
| Reverse Band Power Squat | otwarte | brak przeczytanego źródła o wariancie |
| Band Squat (sama guma, bez sztangi — katalog: `requires: bands`) | otwarte | ustawienie i ruch — 2 źródła; wskazówek/błędów z 2 źródłami — 0 |

Żadne ćwiczenie nie spełnia minimum — brak bloku JSON z gotowymi wpisami.

## Zebrane dane częściowe

### Band Squat (guma pod stopami i przez górę pleców)
Źródła: The Prehab Guys „Squat – Band” (https://theprehabguys.com/vimeo-video/squat-band/) i Rubberbanditz „The best leg exercise: squats”
(https://www.rubberbanditz.com/blog/the-best-leg-exercise-squats, producent gum).
- Ustawienie (2 źródła) — proponowane `bsq.setup`: Prehab Guys „Setup” (guma pod stopami i na górze pleców, trzymana jak sztanga); Rubberbanditz (guma pod obiema stopami i wokół barków).
- Ruch (2 źródła) — proponowane `bsq.move`: Prehab Guys („squat down similarly to how you would perform a back squat”; biodra się zginają, pośladki w tył); Rubberbanditz (zejdź, jakbyś siadał na krześle; wstań bez odbijania).
- Wskazówki po 1 źródle: kolana nie zapadają się do środka (Prehab Guys) — `sq.kneesToes`/`sq.mis.kneesIn`.
- **Sprzeczności z zestawem ogólnym:** Rubberbanditz: „Your knees should not extend past your toes” i ciężar „on your heels” — przeczy `sq.kneesPast` i „całymi stopami” w `sq.down`; Prehab Guys pozwala na lekkie pochylenie. Dlatego `sq.down` z zestawu ogólnego nie przechodzi tu bez zmian.

### Squat with Bands (sztanga + gumy zaczepione u dołu)
Źródło: Gymreapers „Banded Squats” (https://au.gymreapers.com/blogs/news/banded-squats, R. Pilon; firma ze sprzętem do dźwigania, autor bez podanych kwalifikacji).
- Kroki 1–3: gumy jednakowe po obu stronach; zaczepione „directly underneath where you will be standing when you squat”; założone na końce sztangi w tej samej odległości.
- Krok 4: sztanga na plecach „as you would in a regular squat”; kroki 6–7: zejście przez zgięcie kolan i bioder, wstanie, napięcie gumy rośnie przy wstawaniu.
- Potrzebne drugie źródło o wariancie (np. biblioteka organizacji szkolącej trenerów, materiał producenta gum do trójboju).

### Squat with Chains
Źródło: EliteFTS „Friday technique video: how to set up chains” (https://elitefts.com/blogs/training/friday-technique-video-how-to-set-up-chains, J. L. Holdsworth).
- Ustawienie: kołnierz dystansowy, łańcuch prowadzący na zewnątrz kołnierza, długość tak, by w pozycji stojącej część łańcucha leżała na podłodze (źródło podaje liczbę ogniw — liczba nie do aplikacji), długość zależy od wzrostu i techniki.
- Barbell Logic „How to set up chains” (https://barbell-logic.com/how-to-set-up-chains) — tylko cel (cała krzywa siły) i ostrzeżenie, że to metoda zaawansowana; bez techniki ani ustawienia w tekście (instrukcja tylko w osadzonym filmie zewnętrznym — nie oglądany).
- Brak źródła o ruchu z łańcuchami (czy technika jak w przysiadzie).

## Nowe zdania (propozycje — do użycia po uzupełnieniu wskazówek)

| id | PL | EN (propozycja) | uzasadnienie |
|---|---|---|---|
| `bsq.setup` | Stań obiema stopami na gumie, drugi koniec przełóż przez górę pleców i przytrzymaj rękami. | Stand on the band with both feet, loop the other end over your upper back and hold it in place with your hands. | `sq.bar` mówi o sztandze i stojaku. |
| `bsq.move` | Zejdź w przysiad, cofając biodra, potem wróć do stania. | Squat down by pushing your hips back, then stand back up. | `sq.down` zawiera „całymi stopami”, czemu przeczy jedno z przeczytanych źródeł. |

## Nowe źródła (przeczytane, niewystarczające do „gotowe”)

| id | adres | organizacja | szczebel | miejsce / krótki cytat |
|---|---|---|---|---|
| `prehab-squat-band` | https://theprehabguys.com/vimeo-video/squat-band/ | The Prehab Guys | 4 | „squat down similarly to how you would perform a back squat” |
| `rubberbanditz-squats` | https://www.rubberbanditz.com/blog/the-best-leg-exercise-squats | Rubberbanditz (producent gum) — nowa | 4 | „Stabilize one band under both feet and around shoulders.” |
| `gymreapers-banded-squats` | https://au.gymreapers.com/blogs/news/banded-squats | Gymreapers (sprzęt do dźwigania; autor bez kwalifikacji — do akceptacji) — nowa | 4? | Kroki 1–7 |
| `elitefts-set-up-chains` | https://elitefts.com/blogs/training/friday-technique-video-how-to-set-up-chains | EliteFTS (producent sprzętu do trójboju, artykuły trenerów) — nowa | 4 | „first attach a spacer collar to ensure the chains do not drag on the power rack” |
| `barbelllogic-set-up-chains` | https://barbell-logic.com/how-to-set-up-chains | Barbell Logic — nowa (patrz leg_machine.md) | 4 | „Using chains while lifting is an advanced technique” |

```json
{
  "orgs": {
    "Rubberbanditz": {"name": "Rubberbanditz — blog producenta gum oporowych (rubberbanditz.com)", "level": 4, "kind": "maker"},
    "Gymreapers": {"name": "Gymreapers — blog firmy ze sprzętem do dźwigania (gymreapers.com) — DO AKCEPTACJI", "level": 4, "kind": "maker"},
    "EliteFTS": {"name": "EliteFTS — artykuły trenerów, producent sprzętu do trójboju (elitefts.com)", "level": 4, "kind": "maker"}
  },
  "sources": {
    "prehab-squat-band": {"org": "The Prehab Guys", "title": "Squat – Band", "url": "https://theprehabguys.com/vimeo-video/squat-band/", "level": 4},
    "rubberbanditz-squats": {"org": "Rubberbanditz", "title": "The Best Leg Exercise: Squats", "url": "https://www.rubberbanditz.com/blog/the-best-leg-exercise-squats", "level": 4},
    "gymreapers-banded-squats": {"org": "Gymreapers", "title": "Banded Squats", "url": "https://au.gymreapers.com/blogs/news/banded-squats", "level": 4},
    "elitefts-set-up-chains": {"org": "EliteFTS", "title": "How to Set Up Chains", "url": "https://elitefts.com/blogs/training/friday-technique-video-how-to-set-up-chains", "level": 4},
    "barbelllogic-set-up-chains": {"org": "Barbell Logic", "title": "How To Set Up Chains", "url": "https://barbell-logic.com/how-to-set-up-chains", "level": 4}
  }
}
```

## Otwarte

- **Wszystkie 7 wariantów** — brak 2 przeczytanych źródeł o wariancie dla wskazówek/błędów. Rozstrzygnie: biblioteki organizacji szkolących trenerów albo materiały producentów sprzętu do trójboju z opisem ruchu z gumami/łańcuchami (box, odwrócone gumy).
- **Zestawy ogólne (`cue-sets.json`) — informacja o błędach:** wszystkie 7 wariantów ma zestaw `squat` (`sq.down`, `sq.back`, `sq.kneesToes`, `sq.mis.kneesIn`, część `sq.mis.heels`) bez przeczytanego źródła o wariancie. Przy Band Squat jedno przeczytane źródło przeczy `sq.down` („całymi stopami” wobec „ciężar na piętach”) i `sq.kneesPast`. „Band Squat” w katalogu wymaga tylko gum (bez sztangi), a `sq.down`/`sq.back` pochodzą z przysiadu ze sztangą.
- **Akceptacja źródeł:** Gymreapers (autor bez kwalifikacji) — czy liczyć jako szczebel 4.

## Dostęp

- ExRx — 403; web.archive.org — zablokowane.
- elitefts.com/blogs/powerlifting/squatting-with-bands — 404.
- bodybuilding.com/exercises/squat-with-chains → shop.bodybuilding.com — 404.
- usawa.com/page/409 — strona bez instrukcji (lista wpisów).
- food.unl.edu (PDF z ćwiczeniami z gumą) — 403.

## Stan

Zrobione: przegląd wstępny 7 wariantów (dane częściowe wyżej). Nie szukano jeszcze osobno: Box Squat with Bands/Chains, Reverse Band
Box Squat, Reverse Band Power Squat (tylko wyszukiwania ogólne o gumach i łańcuchach). Następny krok: szukać materiałów EliteFTS /
Westside / producentów gum do trójboju o box squat i odwróconych gumach, drugiego źródła o ustawieniu łańcuchów i gum oraz drugiej
wskazówki dla Band Squat (np. biblioteka fizjoterapeutów, NASM „Resistance Band Squat”). Pułapki: ExRx i archiwum niedostępne;
wiele wyników to strony aplikacji (pominąć) i kopie spamowe; strony bodybuilding.com przekierowują do sklepu (404).
