# Recenzja ruchu 1.1: rodzina glute_floor (7 ćwiczeń), 27.10.2026

Metoda jak w `back_extension.md` (`origin/integracja-1-1` @ 4e5a7f95, zapisane pozy, PNG w pełnej rozdzielczości, liczby z silnika v2, kierunek zgięcia kolana).

Walidator: **7/7 OK**. Szczelność reguł automatycznych: **0 z 1 błędów (0%)**.

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| Donkey Kick | OK z uwagą | Klęk podparty: kolana pod biodrami (x 11,6 = miednica), dłonie pod barkami (x 60). Noga R przy stałym zgięciu kolana 105° → 90° idzie w tył i w górę: biodro 76° → 11°, pięta do y 83,9, podeszwa ku sufitowi. Miednica i tułów nieruchome. Uwaga A |
| Fire Hydrant | OK | Ten sam klęk. Kolano R odchodzi w bok i w górę (z 8,5 → 42,9, y 8,8 → 26,7, ok. 55° od pionu) przy stałym zgięciu 105°. Miednica pozioma |
| Clamshell | OK z uwagą | Leżenie na prawym boku, biodra 46°, kolana 90°, stopy razem (kostki 10 cm nad sobą). Górne kolano unosi się o 20 cm (y 28,5 → 48,6), miednica nieruchoma. Uwaga B |
| Cable Kickback | OK | Pochylenie 24°, dłonie na słupku wyciągu (chwyt x 76 przy słupku x 86). Linka z dołu z przodu do kostki R. Noga prosta (kolano 3–6°) w tył do przeprostu biodra −14°, kostka (13; 8) → (−47,5; 22) |
| Hip Extension with Bands | OK | Postawa prosta (8°), guma na kostkach, noga prosta w tył do −16° (kostka x 13 → −29,7, y 12,5). Dłonie przed klatką |
| **Machine Glute Kickback** | **BŁĄD** | Maszyny nie widać, a ręce trzymają powietrze (nr 1) |
| Prone Flutter Kicks | OK z uwagą | Leżenie przodem na ławce, biodra tuż za jej końcem, nogi proste naprzemiennie ±17 cm przy kostce (biodro −16° / +16°), dłonie na ławce przed głową. Uwaga C |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / element | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Machine Glute Kickback** | wszystkie klatki: sprzęt, obie ręce | **Nie ma maszyny ani podparcia, a ręce sięgają w pustkę.** Sprzęt to `podloga` i `dzwignia` (obrót przy biodrze, z = 38, ramię 88,8 cm do kostki). W rzucie z boku dźwignia to tylko ciemny pręt wzdłuż nogi, a w rzucie z przodu pręt od boku biodra do stopy, bez ramy, poduszki i uchwytów. Postać pochyla się o 32° (barki x 26,5 przed miednicą). Obie dłonie stoją przez cały ruch w (82,5; 120,3; ±14), 56 cm przed barkami, i nie dotykają niczego. To ta sama klasa co One Arm Row w `row.md`. Ruch nogi jest poprawny (kolano 3–6°, biodro 44° → 11°, kostka x 13 → −47,5, y 8 → 22). Bez maszyny ćwiczenie wygląda jak Cable Kickback bez wyciągu. | Rama maszyny z poduszką pod klatkę albo łokcie (stojąca maszyna do wykopów) i uchwytami. Dłonie na uchwytach (≤ 3 cm), dźwignia z poduszką za piętą lub łydką. Jeśli rysujemy wariant bez ramy: dłonie na słupku, jak w Cable Kickback. | 80% | realny | nie: `sprzet_rozpoznawczy` przechodzi przy samej `dzwignia`, a żadna reguła nie sprawdza, czy dłonie z chwytem mają w pobliżu sprzęt |

## OK z uwagą (backlog, nie blokuje)

- **A. Donkey Kick, Fire Hydrant:** łokcie zgięte o 32° (łokieć (52,4; 33,8; ±23,6), łokcie na boki). W klęku podpartym ręce są zwykle proste, a „miękki” łokieć to kilka stopni. Pewność 50%.
- **B. Clamshell, stopy:** obie stopy wskazują palcami w górę (pięta (66,1; 9,1), palce (63,9; 34,0)), czyli do sufitu. W rzucie z boku widać je jako pionowe „deski” na końcu nóg. W leżeniu bokiem palce powinny leżeć w płaszczyźnie nóg (x–z), w przedłużeniu goleni albo prostopadle do niej, ku przodowi ciała. Stopa jest obrócona o ok. 90° wokół goleni, co dla dolnej nogi oznacza niemożliwą rotację. Ta sama klasa co stopy w bok w Lower Back Curl (`back_extension.md`, uwaga D): silnik ustawia stopę względem pionu świata, a nie względem nogi. Pewność 70%.
- **C. Prone Flutter Kicks:** kolano wygina się do tyłu do 9° w fazach pośrednich (u = 0,35 i 0,65; kolano 3,1 cm za linią biodro–kostka). To ta sama klasa co nr 1 i nr 2 w `back_extension.md`, ale mała. Wystarczy biegun kolana ku przodowi uda (w dół). Pewność 60%.
- **Uwaga ogólna:** `cue-sets.json` deklaruje błędy (`hext.mis.arch`, `hab.mis.high`), a żadna z 7 póz nie ma wiersza błędu. Wygięcie lędźwi przy wykopie i za wysokie unoszenie kolana da się pokazać pozą.

## Proponowana reguła

| Reguła | Warunek | Błąd | Pozostałe |
|---|---|---|---|
| `chwyt_ma_sprzet` | dłoń z chwytem ponad 15 cm od ciała musi leżeć ≤ 3 cm od sprzętu (uchwyt, słupek, rama, ławka, gryf) albo od własnego ciała (biodro, udo, głowa) | Machine Glute Kickback: 56 cm przed barkiem, brak sprzętu | Cable Kickback: dłoń przy słupku, bez alarmu. Reverse Hyperextension (`back_extension.md`, uwaga C) też by ją złapała |
