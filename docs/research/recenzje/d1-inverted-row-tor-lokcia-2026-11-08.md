# D-1: reguła `tor_lokcia_srodek` a Inverted Row — badacz, 08.11.2026

Repo nie zmieniane. Worktree: /home/user/wt-ir (gałąź figury/d1-inverted-row).

## Werdykt: (a) w oknie u = 0,3–0,7 reguła Inverted Row nie dotyczy

Łokieć przed płaszczyzną pleców w pierwszej połowie i w środku ruchu wynika z geometrii (rachunek niżej) i zgadza się z opisem techniki w źródłach. Źródła mówią o łokciu za linią pleców tylko w punkcie końcowym. Figura nie jest błędna (20,7 → 14,4 → 7,8 cm, spada monotonicznie ku końcowi).

## (1) Skąd pochodzi reguła

- Definicja: `scripts/figures/v2-jakosc.mjs:462-467` (komentarz „16d. Tor łokcia w środku ruchu przyciągania (u 0,3…0,7): łokieć nie leży po stronie klatki”). Wywołanie: `:815`, tylko dla `PRZYCIAGANIE = ['Inverted Row']` (`:123`). Próg: `lokiecPrzedPlecamiMaxCm: 2` (`:38`). Komentarz progu mówi wprost: **„na końcu** łokieć leży najwyżej tyle PRZED płaszczyzną pleców”.
- **Reguła 16d nie ma własnego źródła.** Komentarz przy `torLokciaSrodek` nie wskazuje źródła. W `data/zrodla/figury-sens.json` ani w `docs/research/28-figury.md` nie ma wpisu `tor_lokcia_srodek` ani reguły środka ruchu. Do środka ruchu przeniesiono próg reguły końcowej (16, `torLokciaPrzyciagania`, `:486-494`, „w ostatniej klatce”).
- Źródła reguły końcowej: wskazówka `inv.pull` (ExRx BWSupineRow „Execution”, ACE #84 kroki 3–4; `data/zrodla/cues.json:4200-4213`). Jej treść (pl.json:188: „Przyciągnij klatkę do drążka, łokcie blisko tułowia”) nie mówi nic o łokciu w środku ruchu.
- Pokrewna reguła wiosłowania `lokiec_za_plecami` (`figury-sens.json:2619-2631`, cue `row.elbowsPast`) opiera się na wiosłowaniu z podparciem i w opadzie: ExRx DBInclineRow, ACE #168 krok 3, ACE #12, NSCA s. 46. Typ `lokiec_za_tulowiem` (`:7796`) wymaga, by **istniała** próbka z łokciem za barkiem, czyli opisuje koniec ruchu, nie całe okno. Wiosłowania w zwisie te źródła nie opisują, a o środku ruchu nie mówią nic.

## (2) Gdzie jest łokieć w połowie ruchu — rachunek (szczebel 1, geometria; sprawdzalny)

Oś „przód” = kierunek klatki (ku drążkowi), płaszczyzna pleców przechodzi przez bark. Niech r = odległość chwytu od płaszczyzny pleców wzdłuż osi przód, b = łokieć → chwyt (przedramię z dłonią, ok. 28–30 cm). Odcinek łokieć–chwyt ma długość b, więc **łokieć leży przed płaszczyzną co najmniej o r − b**, przy każdym odwiedzeniu ramienia (rozłożenie łokci tego ograniczenia nie omija).
- Start (u = 0): ręka prosta skierowana do drążka, kąt ramię–tułów ok. 70–100° (badacz-kat-zwisu.md, pkt 3) → r ≈ 55–60 cm, łokieć ok. 28–30 cm przed płaszczyzną.
- Warunek reguły (łokieć ≤ 2 cm) wymaga r ≤ b + 2 ≈ 30–32 cm, czyli pokonania ok. 55–60% drogi chwytu (koniec: r ok. 10–15 cm przy klatce z grubością, mniej w szkielecie bez grubości). Przy u liniowym względem drogi jest to **fizycznie niemożliwe w u = 0,3 i 0,5** dla każdej techniki, a w u = 0,7 możliwe dopiero przy końcu zakresu.
- Ze źródłami jest zgodne: start „drążek nad klatką, ręce proste”, koniec „klatka do drążka, łokcie przy bokach / blisko tułowia” (S1 Snarr i Esco 2013, JEPonline 16(6), s. 54; S2 Hevy; S3 BarBend; S5 ACE #84 krok 3: „Your elbows should move towards your sides and remain close to your body”). Przeczytane 08.11.2026, adresy w badacz-kat-zwisu.md. Żadne przeczytane źródło nie każe trzymać łokcia za plecami w środku ruchu.
- Oznaczenia: ustawienie start/koniec — **ustalone** (wcześniejsza analiza). Ograniczenie „łokieć ≥ r − b przed płaszczyzną” — **ustalone (rachunek)**. Liczby r i b — **uproszczenie** (wymiary rysunku, nie cytat).

## (3) Rekomendacja

(a) Wyłączyć Inverted Row z `tor_lokcia_srodek` w oknie 0,3–0,7. Do wyboru:
- **a1 (zalecane):** łokieć za płaszczyzną pleców wymagać tylko na końcu ruchu. To już sprawdza reguła 16 (`torLokciaPrzyciagania`), więc 16d dla Inverted Row usunąć albo dodać wyjątek z powodem „rachunek: łokieć ≥ r − b przed płaszczyzną”.
- **a2:** zastąpić 16d regułą monotoniczności (łokieć przed płaszczyzną nie rośnie z u, tolerancja do ustalenia jako **konwencja** rysunku). Pilnuje sensu toru (łokieć cofa się ku tułowiowi) bez warunku niemożliwego geometrycznie.
- Warunek „tylko u ≥ 0,8” to **konwencja** bez źródła: nie gwarantuje r ≤ b + 2 przy każdym rozkładzie u, więc lepszy jest warunek geometryczny r ≤ b + 2 albo samo u końcowe.

## Otwarte

- [OTWARTE] Kąt łokcia albo położenie łokcia w środku ruchu jako liczba ze źródła — żadne przeczytane źródło jej nie podaje.
- [OTWARTE] Czy w szkielecie bez grubości klatki koniec ruchu (reguła 16) jest osiągalny przy piętach na podłodze — osobna sprawa (`data/zrodla/figures.json:6607`, `docs/research/28-figury.md:959`).
