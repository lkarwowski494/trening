# Recenzja niezależna (L-047): triceps → `wskazowki_na_reguly` → `lokiec_prostuje_sie` (16 zdań)

**Werdykt: ZATWIERDZONE** (bez przypisań do cofnięcia; 2 uwagi nieblokujące niżej, pkt 4).

- autor: programista B0 (figury/nakladka-b0 @ d5a56f5f)
- recenzent: badacz-merytoryczny
- data: 08.11.2026
- zakres: `/home/user/stan-b0/badacz/figury-sens.diff` (16 nowych kluczy w `data/zrodla/figury-sens.json`, rodzina `triceps`, linie 666–713 po zmianie);
  teksty zdań: `lib/cues/text/pl.json` i `lib/cues/text/en.json`; źródła zdań: `data/zrodla/cues.json`; element nakładki: `lib/figures/v2/overlay/triceps.ts:13`.
- kryterium (docs/18, wpis 04.11.2026, linia 254): „reguła przypisana do zdania tylko tam, gdzie tekst zdania ją mówi”.
  Reguła `lokiec_prostuje_sie` (figury-sens.json:625–642) mówi: w ruchu roboczym łokieć zgina się i prostuje (wyprost bez gwałtownego blokowania).

## 1. Czy zdanie mówi regułę — 16 przypisań

| id zdania | tekst PL (EN zgodny) | ocena | uzasadnienie |
|---|---|---|---|
| `ote.moveLoad` | „Zginaj łokcie, opuszczając ciężar za głowę; wyprostuj ręce nad głową.” | tak | zgięcie i wyprost łokcia nazwane wprost |
| `ote1.move` | „Zginaj łokieć, opuszczając hantel za głowę; wyprostuj rękę nad głową.” | tak | jw., jednorącz |
| `lpote.move` | „Zginaj łokieć, opuszczając uchwyt za głowę; wyprostuj rękę nad głową.” | tak | jw. |
| `rgpd.move` | „Prostuj łokcie, wypychając drążek w dół; powoli wróć do góry.” | tak | wyprost nazwany wprost; powrót = zgięcie (bez zakresu — próg u0 ≥ 70° to i tak nazwane uproszczenie reguły) |
| `tpd1.move` | „Prostuj łokieć, wypychając uchwyt w dół; powoli wróć do góry.” | tak | jw. |
| `tate.move` | „Zginaj łokcie skierowane na boki, opuszczając hantle do klatki; wyprostuj ręce.” | tak | zgięcie i wyprost nazwane; kierunek łokci (na boki) nie zmienia stawu ani zakresu |
| `kick.move` | „Prostuj łokieć, odprowadzając dłoń do tyłu, aż ręka będzie prosta; wróć do kąta prostego.” | tak | wyprost do prostej ręki, powrót do 90° (zgodne z u0 ≥ 70°) |
| `skullDb.move` | „Zginaj łokcie, opuszczając hantle w stronę głowy; wyprostuj ręce do pozycji wyjściowej.” | tak | wprost |
| `tri.bandOte.move` | „Prostuj łokcie, wypychając dłonie nad głowę; zginając je, wróć dłońmi za głowę.” | tak | wprost (oba kierunki) |
| `tri.chainExt.move` | „Prostuj łokcie, trzymając ramiona nieruchomo; potem opuść uchwyty z powrotem.” | tak | wyprost wprost; „opuść z powrotem” = zgięcie |
| `tri.kick2.move` | „Prostuj łokcie, odprowadzając dłonie do tyłu, aż ręce będą proste; wróć do kąta prostego.” | tak | jak `kick.move` |
| `tri.skullBand.move` | „Zginaj łokcie, opuszczając dłonie w stronę głowy; wyprostuj ręce…” | tak | wprost |
| `tri.skullBb.move` | „Zginaj łokcie, opuszczając sztangę w stronę głowy; wyprostuj ręce…” | tak | wprost |
| `tri.skullBehind.move` | „Zginaj łokcie, opuszczając sztangę za czubek głowy; wyprostuj ręce…” | tak | wprost |
| `tri.skullCb.move` | „Zginaj łokcie, opuszczając drążek w stronę głowy; wyprostuj ręce…” | tak | wprost |
| `tri.skullDb1.move` | „Zginaj łokieć, opuszczając hantel w stronę głowy; wyprostuj rękę…” | tak | wprost |

Wszystkie 16 zdań to zdania sekcji „ruch” o tej samej budowie co cztery wcześniejsze przypisania (`tpd.move`, `ote.move`, `skull.move`, `cote.move`). Element nakładki (linia bark–łokieć i łuk zgięcia łokcia, podpis „zgięcie łokcia”) nie twierdzi niczego ponad tekst zdania.

## 2. Status reguły `lokiec_prostuje_sie`

- Wpis reguły (figury-sens.json:625–642): `pewnosc: "ustalone"`, źródła: ACE #185 i ExRx CBPushdown (`tpd.move`), ACE #74 i ExRx DBTriExt (`ote.move`), ACE #36 i ExRx BBLyingTriExt (`skull.move`) — po 2 niezależne źródła szczebla 4 dla przebiegu ruchu (wyjątek dla wskazówek techniki, CLAUDE.md). Liczby kątów oznaczone „uproszczenie”. Wpis nie jest pusty.
- Reguła już przed zmianą była w `zawsze` (figury-sens.json:715–717), czyli obowiązywała pozy wszystkich ćwiczeń rodziny; zmiana dodaje tylko powiązanie z tekstem karty.
- Dla pozostałych ćwiczeń wyprost łokcia potwierdzają źródła samych zdań w `data/zrodla/cues.json` (przeczytane wpisy): np. `tate.move` — ISSA #5 i Catalyst 909; `kick.move` — ACE #55 i Catalyst 910; `tpd1.move` — ACE #185 i Catalyst 898; `lpote.move` — Catalyst 894, BarBend, ACE #74; `tri.skullBb.move` — ACE #36, Catalyst 903, ISSA; `rgpd.move` — Catalyst 878 i NFPT; `tri.bandOte.move` — BarBend i The Prehab Guys; `tri.chainExt.move` — dwa źródła szczebla 5 (cues.json:18620–18631, status „praktyka”, cues.json:18822).
- Ocena recenzenta: wyprost łokcia jest ruchem definiującym każde z tych ćwiczeń (nazwa „extension”/„pushdown”/„kickback”/„Tate press” to wyprost łokcia); przyrząd, chwyt, liczba rąk i ustawienie ciała nie zmieniają stawu ani kierunku ruchu. Potwierdzam (L-047), że dla wariantów sprzętu ruch łokcia się nie różni — przeniesienie reguły „ustalone” z wersji bazowych to dozwolone, nazwane „uproszczenie” (wariant sprzętu), CLAUDE.md, „Merytoryczne podstawy”, ostatnie zdanie wyjątku dla wskazówek.

## 3. Uwagi programisty

**(a) `ramie_nieruchome` dla `kick.upperArm`, `ote1.upperArm`, `tpd1.elbow` — opinia: tak, tekst każdego mówi regułę** (`lokiec_nieruchomy_wzgledem_barku`):
- `kick.upperArm` „Ramię nieruchomo przy tułowiu — rusza się tylko przedramię.” — źródła: ACE #55 Step 3, Catalyst 910 (cues.json:17898–17908).
- `ote1.upperArm` „Ramię nieruchomo, łokieć wysoko nad głową — pracuje przedramię.” — Catalyst 894, ACE #74, ISSA (cues.json:17181–17196).
- `tpd1.elbow` „Łokieć przy boku — pracuje przedramię, nie bark.” — ACE #185, Catalyst 898 (cues.json:17559–17569); to odpowiednik `tpd.elbows`, który już jest przypisany.

Zastrzeżenie rysunkowe (nie merytoryczne): pion od barku do miednicy (`tricepsElbowPlumb`) pasuje tylko do `tpd1.elbow` (stojąc, ramię pionowo). Przy kickbacku ramię leży wzdłuż pochylonego tułowia, więc pion byłby błędnym elementem — przypisanie w danych tak, ale bez pionu (tak jak dziś `ote.upperArm`/`skull.upperArm`: bez elementu). Przed dopisaniem sprawdzić, czy pozy kickbacku i ote1 przechodzą próg `max_cm: 8` (dopisanie zdania obejmie te ćwiczenia sprawdzaniem reguły).

**(b) `llc.move` na karcie Machine Triceps Extension — NIE potwierdzam błędu danych.**
- Karta Machine Triceps Extension to zestaw ogólny: `lib/figures/v2/cue-sets.json:2977–2987` — `ok: ["press.noLock", "llc.control"]`, `err: ["mis.jerk"]`. Jest tam `llc.control` („Ruch płynny w obie strony, bez szarpania.”, pl.json:229), nie `llc.move`.
- `llc.move` („Zegnij kolana…”) występuje tylko przy Lying Leg Curl: `data/zrodla/cues.json:7401`, `lib/cues/data.json` (karta „Lying Leg Curl”) i figura v1 Lying Leg Curl (`data/zrodla/figures.json:6123`). Brak go w `lib/figures/v2/poses/triceps.json`, w arkuszu `/home/user/stan-b0/arkusze/triceps/cwiczenia.json` (Machine Triceps Extension: elementy [], błąd `mis.jerk`) i w kodzie.
- Prawdopodobnie pomylono `llc.control` z `llc.move`. `llc.control` to ogólne zdanie o płynności ruchu (prefiks klucza po leg curlu, treść nie dotyczy nóg) — nie jest błędem treści. Jeśli programista widział „Zegnij kolana” na zrzucie, proszę o ścieżkę zrzutu — w danych tego nie ma.

## 4. Uwagi nieblokujące

1. Pole `zrodlo` reguły (figury-sens.json:639) wymienia tylko wersje bazowe; warto dopisać: „pozostałe ćwiczenia rodziny: źródła zdań *.move w cues.json; warianty sprzętu — uproszczenie potwierdzone przez recenzenta 08.11.2026”, żeby status był sprawdzalny bez tej recenzji.
2. `press.noLock` („Prostuj ręce do końca, ale bez gwałtownego blokowania łokci.”) jest w `cue_dodatkowe` reguły (figury-sens.json:633), ale nie w `wskazowki_na_reguly`. Tekst mówi o wyproście (koniec zakresu), nie o zgięciu — częściowo. Dopisanie dałoby nakładkę Machine Triceps Extension; to decyzja projektowa programisty/koordynatora, merytorycznie dopuszczalna jako „częściowo” (element rysuje cały zakres łokcia, zdanie mówi tylko o wyproście).
