# Role mięśni — fala W2, rodzina core_standing

Data: 02.11.2026. Autor: badacz merytoryczny (agent). Tryb: tylko zbieranie danych (bez zmian w `data/zrodla/role-miesni.json`).
Podstawa: W1 `role/core_standing.md` (24 otwarte pary w wierszach 25–33) i `role/core_floor.md` (funkcje `obliques.rotate`, `obliques.side_bend`,
`obliques.antirotation`). Wszystkie strony przeczytane 02.11.2026 (WebFetch; PDF abstraktu ISB — odczyt strony). Cytaty krótkie.

## 1. Wiersze

| wiersz (ćwiczenie, mięsień) | proponowana funkcja / reguła | źródła (miejsce, szczebel) | status |
|---|---|---|---|
| Pallof Press, obliques (main) | `obliques.antirotation` — reguła rodziny `core_anti_rot` + `obliques` + `main` (jak W1) | R1 McGill 1991 (abstrakt: wysiłki izometryczne skrętne, skośny zewn. ok. 52% MVC, wewn. ok. 55%; szczebel 3); R2 Ng i in. 2001 (abstrakt: różna aktywność skośnych zewn. i wewn. zależnie od kierunku izometrycznego skrętu — mięśnie wytwarzają moment skrętny; szczebel 3); R3 Flynn i in. 2005 (abstrakt ISB, wyciskanie linki stojąc: po mięśniach barku najwyższa aktywność skośnego wewn.; szczebel 3, ten sam zespół co R1 — nie liczy się osobno) | **dwa_zrodla + uproszczenie** (zadanie laboratoryjne: izometryczny wysiłek skrętny przeciw unieruchomieniu → ćwiczenie „nie daj się skręcić”; mechanicznie to ten sam izometryczny moment skrętny tułowia) |
| Pallof Press, Pallof Press With Rotation, Russian Twist, Cable Woodchop, Landmine Rotation, Cable Judo Flip, Cable Russian Twists, Medicine Ball Full Twist, Spell Caster — abs (aux) | nowa `abs.brace` (PL main/aux: „Usztywnia tułów” / „Pomaga usztywnić tułów”; EN: „Braces your trunk” / „Helps brace your trunk”); reguły: `core_anti_rot` + `abs` + `aux` oraz `nameRules` dla skrętów (lista jak w kolumnie 1) | R1 McGill 1991 (prosty brzucha ok. 22% MVC przy maksymalnym izometrycznym wysiłku skrętnym — wyraźnie mniej niż skośne); R2 Ng i in. 2001 (prosty brzucha bez różnicy między skrętem w prawo i w lewo, a aktywność wszystkich mięśni tułowia rośnie z wysiłkiem; „not only produce torque but also maintain the spinal posture and stability”) | **dwa_zrodla + uproszczenie** — oba badania: izometryczny wysiłek skrętny w laboratorium, nie konkretne ćwiczenia; rola „pomocniczy, usztywnia” to odczyt (brak kierunkowości = nie wytwarza skrętu). Do decyzji koordynatora: nowa funkcja vs. zostawić bez opisu |
| Landmine Rotation, front_delt (aux) | — | ruch ramion: Fitness Volt (górna ręka wyprostowana, dolna ugięta) i BarBend (ręce wyprostowane) — źródła techniki, nie ról; brak źródła o pracy barku | otwarte (bez zmian; ruch ramion różni się między źródłami — `wskazowki-fala-w2/core_standing-cz1.md`, pkt 4) |
| Spell Caster, front_delt (aux) | — | nie badane w W2 (ćwiczenie bez źródła techniki szczebla 4) | otwarte |
| Kettlebell Windmill — obliques (main), side_delt (aux) | — | nie badane w W2 | otwarte (powód z W1) |
| Double Kettlebell Windmill — obliques / side_delt / hamstrings | — | nie badane w W2 | otwarte (powód z W1) |
| Bent Press — obliques / front_delt / triceps / side_delt | — | nie badane w W2 | otwarte (powód z W1) |
| Kettlebell Figure 8 — obliques / lower_back / hamstrings | — | nie badane w W2 | otwarte (powód z W1) |

Liczenie par: z 24 otwartych W1 → `obliques.antirotation` (Pallof Press) 1 para + `abs.brace` 9 par = **10 par z propozycją** (dwa_zrodla + uproszczenie);
14 nadal otwartych (Landmine i Spell Caster — barki: 2; windmill ×2, bent press, figure 8: 12).

Uwaga o zasięgu reguły: `core_anti_rot` + `obliques` + `main` obejmuje też Bird Dog (rodzina core_floor, W1 `role/core_floor.md` wiersz 39). R1/R2 dotyczą
wysiłku skrętnego w staniu/siadzie — dla Bird Dog to uproszczenie dalej idące (podpór na czworakach); decyzja przy scalaniu należy do koordynatora core_floor.

Pułapka z W1 nadal ważna: `Pallof Press With Rotation` ma wzorzec `core_anti_rot` — skośne main muszą iść przez `nameRules` (`obliques.rotate`), nie przez regułę rodziny.
Dla `abs` aux wynik obu ścieżek jest ten sam (`abs.brace`).

## 2. Źródła

| id | adres | opis | szczebel | miejsce |
|---|---|---|---|---|
| R1 | https://pubmed.ncbi.nlm.nih.gov/1824571/ | McGill SM. EMG mięśni brzucha i dolnej części pleców przy wytwarzaniu izometrycznego i dynamicznego momentu skrętnego tułowia. J Orthop Res 1991;9(1):91–103, doi 10.1002/jor.1100090112 | 3 — recenzowane badanie | abstrakt (wartości % MVC dla prostego brzucha, skośnego zewn. i wewn.; zdanie „…strongly involved in the generation of axial torque” o skośnym zewn. przy skręcie dynamicznym) |
| R2 | https://pubmed.ncbi.nlm.nih.gov/11398861/ | Ng JK, Parnianpour M, Richardson CA, Kippers V. Funkcje mięśni brzucha i pleców przy izometrycznym skręcie tułowia. J Orthop Res 2001;19(3):463–471, doi 10.1016/S0736-0266(00)90027-5 | 3 — recenzowane badanie (inny zespół niż R1) | abstrakt (różnice prawa/lewa dla skośnych; brak różnicy dla prostego brzucha; zdanie o utrzymaniu postawy i stabilności) |
| R3 | https://media.isbweb.org/images/conf/2005/abstracts/0400.pdf | Flynn, Vera-Garcia, Brown, McGill. Wzorce aktywacji mięśni tułowia: wyciskanie linki i Body-blade. Abstrakt kongresu ISB/ASB 2005, s. 400 | 3 (abstrakt kongresowy, słabszy niż artykuł); ten sam zespół co R1 — nie liczy się jako niezależne | „Results and discussion” i rys. 1 (skośny wewn. lewy ok. 36% MVC, prosty brzucha < 10% przy wyciskaniu linki prawą ręką) |

Odrzucone / nieużyte: Mandroukas i in. 2022 (J Funct Morphol Kinesiol, PMC9505236) — bez ćwiczeń przeciw rotacji, a strona podaje „expression of concern” (2026);
Oliva-Lozano i Muyor 2020 (przegląd systematyczny, PMC7345922) — przeczytany fragment bez ćwiczeń przeciw rotacji ani skrętów w staniu (tylko brzuszek ze skrętem);
Stephens i in. 2021 (abstrakt IJES, 4 osoby, pilotaż) — nie podaje kierunku różnic; preprint 202411.2276 i MDPI — 403; Mullane 2021 — repozytorium 405 (pełny tekst nieczytany).

## 3. Otwarte

- [OTWARTE] Brak przeglądu/stanowiska (szczebel 2) albo badania EMG samego Pallofa w pełnym tekście; oba źródła to zadania laboratoryjne → status „dwa_zrodla + uproszczenie”, nie „ustalone”.
- [OTWARTE] Czy dodać funkcję `abs.brace` (nowa w `functions`) — decyzja koordynatora; alternatywa: prosty brzucha aux bez opisu (jak dotąd).
- [OTWARTE] Ruchy złożone (windmill ×2, bent press, figure 8) i barki (landmine, spell caster) — bez zmian względem W1; nie badane w W2 (limit kontekstu).

## Stan

- Zrobione: 10 par z propozycją (1 × `obliques.antirotation`, 9 × `abs.brace`), źródła R1–R3.
- Zostało: 14 par (pkt 3).
- Następny krok: pełne teksty R1/R2 (wydawca Wiley/Elsevier — dostęp), badania EMG windmilla/kettlebell (np. czasopisma NSCA).
- Pułapki: PDF R3 zawiera adres e-mail autorki — nie cytować w repo; PubMed wyszukiwanie „pallof” myli zapytanie.
