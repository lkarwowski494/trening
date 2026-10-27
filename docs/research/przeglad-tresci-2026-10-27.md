# Przegląd treści — naprawy M2, partia 3 (27.10.2026)

Rola 06-tresci (tryb fix), plan napraw M2: M1-audytor-generalny-020 (06-tresci-004, DEC-04 a) i M1-audytor-generalny-021 (06-tresci-002, 06-tresci-003, DEC-05 a).
Źródła otwarte w dniu pracy; cytat sprawdzony na surowym tekście (`curl` + usunięcie znaczników + wyszukanie frazy), najwyżej 1–2 zdania.
Źródła żyją tylko tutaj i w rejestrach w repo (`docs/research/rejestr-twierdzen.json`, `data/zrodla/`); aplikacja ich nie wymienia (decyzja właściciela 25.10.2026).

## T-041 — skala RIR: przedział 4–6 RIR (M1-audytor-generalny-020)

- Źródło: Helms i in. 2016, Strength Cond J 38(4):42–49, pełny tekst https://www.ebi.ac.uk/europepmc/webservices/rest/PMC4961270/fullTextXML
  (= https://pmc.ncbi.nlm.nih.gov/articles/PMC4961270/), odczyt 2026-10-27, szczebel 3 (przegląd narracyjny autorów skali).
- Sekcja INTRODUCTION, opis skali z tabeli 1: „In addition, scores of 5–6 were grouped as 4–6 RIR as it is easier for athletes to give a range of RIR when RIR is greater than 3.”
- Sekcja INCORPORATING THE SCALE INTO PROGRAMMING: „Because the scale has subjective descriptors of effort for values below 5 (1–2 RPE = “little to no effort,” 3–4 RPE = “light effort”)” — opisy słowne dopiero poniżej RPE 5.
- Werdykt dla zachowania sprzed poprawki (RIR 6 → RPE 4 „lekko”): CZĘŚCIOWO — RIR 6 należy w skali do przedziału RPE 5–6, nie do „light effort”.
- Poprawka (DEC-04 a): wpis RIR 0–6; RIR do 5 = 10 − RIR; RIR powyżej 5 do 6 = RPE 5 (najniższe RPE przedziału 4–6 RIR); więcej niż 6 = „lekko” (RPE 4, górna granica „light effort”),
  w skali RIR pokazywane „7+”. Tekst T-041 (`RIR wpisujesz w zakresie 0–{max}; …`) bez zmiany brzmienia — liczby z parametrów `RIR_MAX = 6`, `RPE_LIGHT = 4`, `RPE_RIR_MIN = 5`
  (`lib/state/effort.ts`); para zdań „więcej niż 6 → lekko, bo poniżej RPE 5 opis słowami” zgodna ze źródłem.
- Uproszczenie (nazwane w BRD RD-02): w obrębie przedziału 4–6 RIR źródło nie przypisuje dokładnego RPE; aplikacja zapisuje RIR 6 jako RPE 5, więc po zapisie wraca na ekran jako RIR 5.
  Dane zapisane wcześniej (RPE 4 z dawnego „6+”) się nie zmieniają; w skali RIR pokazują się teraz jako „7+”.
- Odrzucone: (B) zostawić RIR 6 → RPE 4 i nazwać to uproszczeniem w tekście — oznaczeń wagi w interfejsie nie używamy (decyzja 23.10.2026), a zachowanie przeczyłoby źródłu.
