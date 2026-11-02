# Wskazówki techniki — rodzina `squat`, cz. 2 (warianty z gumami i łańcuchami) — fala W2

- Data: 02.11.2026
- Rodzina: `squat` (status rodziny `ready`, rysunki v1; brak pliku póz v2 — kolumna „poza v2” = nie)
- Status: **PROPOZYCJA** — dane do integracji przez koordynatora linii 1.1
- Autor: badacz-merytoryczny (fala W2)
- Podstawa: wynik W1 (gałąź badania/g4-nogi, plik `squat-cz2.md`) i przeliczenie szczebli (ten sam plik gałęzi, `przeliczenie-szczebli-2026-11-02.md`,
  sekcja „squat-cz2.md”); szczeble wg `szczeble-organizacji-2026-11-02.md` (gałąź badania/lokalne-0211). Wszystkie strony przeczytane
  przez WebFetch 02.11.2026.

Zasada tej rodziny (koordynator, zlecenie W2): rodzina `ready` → karta własna tylko z ≥ 1 błędem. Obie proponowane karty mają błędy
(z karty Back Squat jako uproszczenie wariantu sprzętu, patrz niżej).

## Tabela ćwiczeń

| Ćwiczenie | poza v2 | stan | co dodano w W2 | brak |
|---|---|---|---|---|
| Squat with Chains | nie | **gotowe z błędem** (uproszczenie: wariant sprzętu Back Squat) | drugie źródło szczebla 4 o ustawieniu łańcuchów (Catalyst Athletics, „Chain Back Squat”) i zdanie „przysiad jak zwykle” z tego samego źródła; nowe zdanie `sqc.chains` | wskazówka o tym, ile łańcucha leży na podłodze na dole przysiadu — jedno źródło (Catalyst) |
| Squat with Bands | nie | **gotowe z błędem** (uproszczenie: wariant sprzętu Back Squat) | dwa źródła szczebla 4 o zaczepieniu gum (BarBend, T. Ramos; EliteFTS, J. L. Holdsworth); BarBend wprost: „perform standard back squats”; nowe zdanie `sqb.bands` | wskazówka „gumy pionowo” — jedno źródło dla tego wariantu |
| Box Squat with Bands | nie | otwarte (warunkowe) | ustawienie gum jak wyżej (`sqb.bands`) | karta bazowa Box Squat (część 1) bez 2 źródeł szczebla 4 |
| Box Squat with Chains | nie | otwarte (warunkowe) | ustawienie łańcuchów jak wyżej (`sqc.chains`) | jak wyżej |
| Reverse Band Box Squat | nie | otwarte | 1 źródło szczebla 4 (BarBend, M. Dewar): gumy zaczepione nad sztangą, pionowo | drugie źródło szczebla 4; karta Box Squat |
| Reverse Band Power Squat | nie | otwarte | jak wyżej (BarBend o wariancie z ławką — analogia) | dwa źródła o tym wariancie |
| Band Squat (sama guma) | nie | otwarte | bez zmian — szukano drugiego źródła szczebla 4, nie znaleziono | drugie źródło o ustawieniu i ruchu |

Błędy wnioskowane: 0 (karty mają błędy z karty bazowej; zaprzeczenia nowych zdań ustawienia — „gumy/łańcuchy nierówno” — byłyby
trywialne albo niepokazywalne na rysunku, więc ich nie proponuję).

**Uproszczenie: wariant sprzętu Back Squat** (dotyczy obu kart). Gumy i łańcuchy zmieniają tylko rozkład oporu w zakresie ruchu, nie
przebieg ruchu — oba źródła wariantów mówią to wprost: Catalyst „Chain Back Squat” — „Squat as usual”; BarBend „Accommodating
Resistance” (sekcja o przysiadzie z gumami) — „perform standard back squats”. Dlatego `sq.bar`, `sq.down`, `sq.kneesToes`, `sq.back`,
`sq.mis.kneesIn`, `sq.mis.heels` biorą źródła z karty Back Squat w `data/zrodla/cues.json` (bez zmiany brzmienia). Zestaw ogólny
w `cue-sets.json` dla obu ćwiczeń ma już te same zdania — karta własna dodaje ustawienie gum/łańcuchów.

### Blok do wdrożenia

```json
{
  "Squat with Chains": {
    "setup": [
      {"c": "sq.bar", "s": [["ace-11", "opis — uproszczenie: wariant sprzętu Back Squat"], ["exrx-Quadriceps/BBFullSquat", "Preparation — uproszczenie: wariant sprzętu Back Squat"]]},
      {"c": "sqc.chains", "s": [["catalyst-chain-back-squat", "opis (hang the chains … completely hanging as you near the top)"], ["elitefts-set-up-chains", "opis (leader chain outside the collar; one link of the weight chain on the floor in the standing position)"]]}
    ],
    "move": [
      {"c": "sq.down", "s": [["catalyst-chain-back-squat", "opis (Squat as usual)"], ["ace-11", "opis — uproszczenie: wariant sprzętu Back Squat"], ["exrx-Quadriceps/BBFullSquat", "Execution — uproszczenie: wariant sprzętu Back Squat"]]}
    ],
    "tips": [
      {"c": "sq.kneesToes", "s": [["sbs-how-to-squat", "Foot Angle; FAQ (knees caving in) — uproszczenie: wariant sprzętu Back Squat"], ["ace-135", "Step 4; Step 5 — uproszczenie: wariant sprzętu Back Squat"]]},
      {"c": "sq.back", "s": [["ace-11", "opis (straight back, chest up) — uproszczenie: wariant sprzętu Back Squat"], ["exrx-Quadriceps/BBFullSquat", "Comments (back straight) — uproszczenie: wariant sprzętu Back Squat"]]}
    ],
    "mistakes": [
      {"c": "sq.mis.kneesIn", "s": [["sbs-how-to-squat", "FAQ: My knees are caving in — uproszczenie: wariant sprzętu Back Squat"], ["ace-135", "Step 4 — uproszczenie: wariant sprzętu Back Squat"]]},
      {"c": "sq.mis.heels", "s": [["ace-135", "Step 4; Step 6 (heels flat) — uproszczenie: wariant sprzętu Back Squat"], ["exrx-Quadriceps/BBFullSquat", "Comments (feet flat on floor) — uproszczenie: wariant sprzętu Back Squat"]]}
    ]
  },
  "Squat with Bands": {
    "setup": [
      {"c": "sq.bar", "s": [["ace-11", "opis — uproszczenie: wariant sprzętu Back Squat"], ["exrx-Quadriceps/BBFullSquat", "Preparation — uproszczenie: wariant sprzętu Back Squat"], ["elitefts-bands-setup", "squat (walk the bar out until the bands are straight up and down)"]]},
      {"c": "sqb.bands", "s": [["barbend-accommodating-resistance", "sekcja o przysiadzie z gumami (anchor a band to the inside of the barbell … loop the other end to the bottom of the power rack; repeat on the other side)"], ["elitefts-bands-setup", "squat (choke the band around band peg); test z pustą sztangą — równe napięcie po obu stronach"]]}
    ],
    "move": [
      {"c": "sq.down", "s": [["barbend-accommodating-resistance", "sekcja o przysiadzie z gumami (perform standard back squats)"], ["ace-11", "opis — uproszczenie: wariant sprzętu Back Squat"], ["exrx-Quadriceps/BBFullSquat", "Execution — uproszczenie: wariant sprzętu Back Squat"]]}
    ],
    "tips": [
      {"c": "sq.kneesToes", "s": [["sbs-how-to-squat", "Foot Angle; FAQ (knees caving in) — uproszczenie: wariant sprzętu Back Squat"], ["ace-135", "Step 4; Step 5 — uproszczenie: wariant sprzętu Back Squat"]]},
      {"c": "sq.back", "s": [["ace-11", "opis (straight back, chest up) — uproszczenie: wariant sprzętu Back Squat"], ["exrx-Quadriceps/BBFullSquat", "Comments (back straight) — uproszczenie: wariant sprzętu Back Squat"]]}
    ],
    "mistakes": [
      {"c": "sq.mis.kneesIn", "s": [["sbs-how-to-squat", "FAQ: My knees are caving in — uproszczenie: wariant sprzętu Back Squat"], ["ace-135", "Step 4 — uproszczenie: wariant sprzętu Back Squat"]]},
      {"c": "sq.mis.heels", "s": [["ace-135", "Step 4; Step 6 (heels flat) — uproszczenie: wariant sprzętu Back Squat"], ["exrx-Quadriceps/BBFullSquat", "Comments (feet flat on floor) — uproszczenie: wariant sprzętu Back Squat"]]}
    ]
  }
}
```

Uwagi do integracji:
- ExRx (`exrx-Quadriceps/BBFullSquat`) to wpis istniejący w karcie Back Squat (dziś 403 dla narzędzia; w danych jest kopia archiwalna) —
  przejmuję go bez ponownego czytania, jak całą kartę bazową.
- Obie karty zależą od szczebla 4 EliteFTS (W1: „do potwierdzenia koordynatora”). Uzasadnienie: EliteFTS produkuje i sprzedaje gumy
  i łańcuchy do trójboju, a obie strony to instrukcje ustawienia właśnie tego sprzętu z autorem i datą — kryterium „producent: dokumentacja
  własnego rodzaju sprzętu” (pkt 1) i pkt 2. Gdyby koordynator uznał EliteFTS za 5: Squat with Chains zostaje z Catalyst (1 źródło ustawienia),
  Squat with Bands — z BarBend (1 źródło) → obie otwarte.

## Nowe zdania

| id | PL | EN | uzasadnienie |
|---|---|---|---|
| `sqc.chains` | Zawieś łańcuchy na końcach sztangi tak, żeby po wstaniu prawie całe wisiały nad podłogą. | Hang the chains from the ends of the bar so that when you stand up, almost all of the chain is off the floor. | Część wspólna dwóch źródeł: Catalyst — „completely hanging as you near the top”; EliteFTS — w pozycji stojącej na podłodze leży jedno ogniwo. Liczba ogniw (EliteFTS) celowo pominięta. „Na końcach sztangi” — EliteFTS (łańcuch prowadzący na końcówce sztangi, za zaciskiem); Catalyst miejsca nie podaje. Zdanie o tym, że na dole większość łańcucha leży na podłodze — tylko Catalyst → otwarte. |
| `sqb.bands` | Zaczep gumy przy końcach sztangi, a drugie końce przymocuj u dołu stojaka — tak samo po obu stronach. | Hook the bands near the ends of the bar and anchor the other ends at the bottom of the rack — the same on both sides. | BarBend: guma przy końcu gryfu, drugi koniec do dołu stojaka, to samo z drugiej strony. EliteFTS: pętla zaciśnięta na kołku, sprawdzenie pustą sztangą, czy napięcie po obu stronach jest równe. „U dołu” — wprost BarBend; to też definicja wariantu (gumy od góry to osobne ćwiczenia „Reverse Band …”). |

## Źródła

| id | adres | organizacja | autor / kwalifikacje / data | szczebel (uzasadnienie) |
|---|---|---|---|---|
| `catalyst-chain-back-squat` (nowe) | https://www.catalystathletics.com/exercise/609/Chain-Back-Squat/ | Catalyst Athletics (biblioteka ćwiczeń) — nowa organizacja w `cues.json` | hasło firmowane przez Catalyst Athletics, bez autora i daty | **4** — `szczeble-organizacji-2026-11-02.md`, tabela „Rozstrzygnięcia”, wiersz Catalyst Athletics (biblioteka firmowana, założyciel trener USA Weightlifting) |
| `elitefts-set-up-chains` (z W1) | https://elitefts.com/blogs/training/friday-technique-video-how-to-set-up-chains | EliteFTS | J. L. Holdsworth, 14.02.2014 (data na stronie) | **4** — producent łańcuchów, instrukcja własnego rodzaju sprzętu z autorem i datą (pkt 1–2); ocena organizacji z W1 do potwierdzenia koordynatora |
| `elitefts-bands-setup` (nowe) | https://elitefts.com/blogs/training/friday-technique-video-bands-setup | EliteFTS (ta sama organizacja co wyżej — w danej karcie liczy się raz) | J. L. Holdsworth, 18.07.2014 | **4** — jak wyżej (producent gum do trójboju) |
| `barbend-accommodating-resistance` (nowe) | https://barbend.com/accommodating-resistance/ | BarBend | Terry Ramos, B.S. Kinesiology, ACSM CPT; „Last updated on May 27th, 2025”; bez „Expert Verified” | **4** (warunkowo spełnione) — artykuł o technice z autorem z kwalifikacjami i datą, nie recenzja sprzętu (wiersz BarBend) |
| `barbend-reverse-band-box-squat` (nowe, tylko do otwartych) | https://barbend.com/reverse-band-box-squat/ | BarBend | Mike Dewar, M.S. Exercise Physiology, CSCS; aktualizacja 07.08.2023 | **4** — jak wyżej |
| `rubberbanditz-squats` (z W1, tylko do otwartych) | https://www.rubberbanditz.com/blog/the-best-leg-exercise-squats | Rubberbanditz | — | 4 (warunkowo, producent gum — W1) |
| Back Squat: `ace-11`, `ace-135`, `exrx-Quadriceps/BBFullSquat`, `sbs-how-to-squat` | istniejące w `cues.json` | ACE, ExRx, Stronger by Science | — | 4 (istniejące wpisy; uproszczenie: wariant sprzętu) |

Przeczytane, nie liczą się (szczebel 5): artykuł o metodzie odwróconych gum na stronie fizjoterapeuty-trenera (drjohnrusin.com,
`?p=21326`) — brak daty na stronie (pkt 2); artykuł gościnny o odwróconych gumach (ericcressey.com, `?p=16947`, G. Robins) — brak daty,
autor tylko z funkcją „coach” (pkt 2 i 4); Barbell Logic „How To Set Up Chains” — sprawdzone per strona 02.11: brak autora i daty, instrukcja
tylko w osadzonym filmie (pkt 2) → 5 (rozstrzyga „warunkowo 4” z przeliczenia W1); blog uczelni o ćwiczeniach z gumą (bcu.ac.uk) — bez autora,
inny wariant (guma na udach). Wpisy EliteFTS „Reverse Band Squat” (`/education/exercise-index/reverse-band-squat`, `-2`) — dzienniki
treningowe bez instrukcji. Pominięto stronę producenta aplikacji treningowej (nie źródło, docs/18).

Proponowane wpisy do `cues.json` (`orgs`/`sources`):

```json
{
  "orgs": {
    "Catalyst Athletics": {"name": "Catalyst Athletics — biblioteka ćwiczeń (catalystathletics.com)", "level": 4, "kind": "site"},
    "EliteFTS": {"name": "EliteFTS — producent sprzętu do trójboju (gumy, łańcuchy); instrukcje ustawienia z autorem (elitefts.com)", "level": 4, "kind": "maker"}
  },
  "sources": {
    "catalyst-chain-back-squat": {"org": "Catalyst Athletics", "title": "Chain Back Squat", "url": "https://www.catalystathletics.com/exercise/609/Chain-Back-Squat/", "level": 4},
    "elitefts-set-up-chains": {"org": "EliteFTS", "title": "Friday Technique Video: How to Set Up Chains (J. L. Holdsworth, 2014)", "url": "https://elitefts.com/blogs/training/friday-technique-video-how-to-set-up-chains", "level": 4},
    "elitefts-bands-setup": {"org": "EliteFTS", "title": "Friday Technique Video: Bands Setup (J. L. Holdsworth, 2014)", "url": "https://elitefts.com/blogs/training/friday-technique-video-bands-setup", "level": 4},
    "barbend-accommodating-resistance": {"org": "BarBend", "title": "Accommodating Resistance (T. Ramos, akt. 27.05.2025)", "url": "https://barbend.com/accommodating-resistance/", "level": 4}
  }
}
```

(Pole `kind` — wg wzoru istniejących `orgs`; koordynator dopasuje do schematu.)

## Otwarte

- **Squat with Chains — „na dole przysiadu większość łańcucha leży na podłodze”** — tylko Catalyst (EliteFTS opisuje tylko pozycję stojącą).
- **Squat with Bands — „wyjdź ze sztangą, aż gumy będą pionowo”** — EliteFTS wprost; BarBend (M. Dewar) mówi o pionowych gumach tylko
  przy gumach zaczepionych u góry (inny wariant) → jedno źródło dla tego wariantu.
- **Box Squat with Bands / with Chains** — warunkowe: gdy część 1 ustali kartę Box Squat (`box.setup`, `box.move`, `box.mis.bounce` —
  w W1 tylko BarBend), karta = karta Box Squat + `sqb.bands` / `sqc.chains` (uproszczenie: wariant sprzętu Box Squat; źródła gum
  i łańcuchów opisują przysiad ze sztangą na plecach, nie na skrzyni). Do tego czasu otwarte.
- **Reverse Band Box Squat, Reverse Band Power Squat** — ustawienie (gumy nad sztangą, zaczepione u góry stojaka, pionowo) ma jedno źródło
  szczebla 4 (BarBend, M. Dewar); pozostałe przeczytane — 5. Rozstrzygnie: drugie źródło szczebla 4 z autorem i datą o odwróconych gumach.
  Proponowane zdanie (bez wdrożenia): `sqrb.bands` — PL „Zaczep gumy u góry stojaka i załóż na końce sztangi tak, żeby szły pionowo.”,
  EN „Anchor the bands to the top of the rack and loop them over the ends of the bar so they run straight up and down.”
- **Band Squat (sama guma)** — dalej 1 źródło szczebla 4 (Rubberbanditz); szukano ACE, NASM, ISSA, Bodylastics, producentów gum — bez
  strony o tym ćwiczeniu. Sprzeczność z `sq.down`/`sq.kneesPast` (W1) bez zmian.
- **EliteFTS — szczebel organizacji** do potwierdzenia koordynatora (wpływ na obie karty — patrz „Uwagi do integracji”).

## Dostęp

- catalystathletics.com: brak hasła „Band Back Squat” (sprawdzone sąsiednie numery 608, 610, 612 i wyszukiwanie).
- Strona Westside Barbell o zaczepieniu gum — tylko film, bez tekstu (z wyników wyszukiwania; nie otwierano).
