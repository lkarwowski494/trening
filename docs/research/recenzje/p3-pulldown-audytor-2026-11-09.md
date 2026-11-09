# Recenzja niezależna bramki 4 — rodzina v2 `pulldown` (partia 3), 09.11.2026

- Recenzent: audytor (L-047: nie pisał zmian). Autor: programista partii 3 (`figury/partia-3` @ a9c220be).
- Kopia czysta: `git archive a9c220be` → `/tmp/rec-p3-pulldown` (node_modules dowiązane). Różnica wobec `origin/integracja-1-1`: families.ts (ready), overlay.ts + overlay/pulldown.ts, poseData.ts (LOAD, DATA_UI), reguly-cwiczen.json, testy liczników, tests/tor-wyjatki.json (8 wpisów). Plik póz `poses/pulldown.json` był już w bazie.
- Skróty (`node scripts/zrodla-runtime.mjs --skroty` w czystej kopii): v2.pulldown 6953c14db395; v1 Lat Pulldown 72f6a47c92d4; karty: Lat Pulldown 2ad35a7ac5a6, Close-Grip 1e21937a5a34, Underhand 9ae90b1e6ea3, V-Bar e571966124a6, Single Arm 2e9c7470fe9e, Straight Arm 2e38186de1a0; zestawy: Full ROM 82ac6379f373, Wide-Grip Behind The Neck d08a46fced0c.
- Obejrzane: arkusze śladu 8 ćwiczeń × 2 rzuty (side, front) × 2 motywy (`/tmp/rec-p3-pulldown/ark`, `/tmp/rec-p3-pulldown/ark-dark`), arkusze nakładki 16 (`/tmp/rec-p3-pulldown/nak`), kadry powiększone z pełnej rozdzielczości (`/tmp/rec-p3-pulldown/c_*.png`); pomiary stawów, chwytu i kolizji z `frameAt` (skrypt pomocniczy w scratchpad); walidator `v2-validate.mjs` (OK dla wszystkich sprawdzanych — patrz N1, dlaczego nie łapie).

## Werdykt rodziny: **do_poprawy** (1 × WYSOKIE: Straight Arm Pulldown)

Pozostałe 7 ćwiczeń: ruch zgodny z kartą/zestawem, mogą być wyświetlane po naprawie N1 (rodzina wychodzi w całości); ŚREDNIE i NISKIE → backlog.

## Znaleziska (od najpoważniejszego)

| ID | Waga | Pewność | Ćwiczenie / rzut / kadr | Opis | Realność | Dowód |
|---|---|---|---|---|---|---|
| N1 | WYSOKIE | 98% | Straight Arm Pulldown / side (i front) / u = 0,05–0,70 | Drążek przechodzi przez kolumnę wyciągu. Kolumna: x = 62 ± 5 cm, z = ±5 cm (towerW 10). Chwyt (drążek z = ±12, ciągły przez z = 0): x = 61,6 (u 0,05) → 75,8 (u 0,35–0,40) → 61,6 (u 0,70), czyli przez ok. 2/3 ruchu drążek jest w kolumnie albo za nią (po stronie odwrotnej niż ćwiczący); linka biegnie wtedy od bloczka w przód-dół do drążka „za” maszyną. Przyczyna: bark x ≈ 13, długość ręki ≈ 63 cm, kolumna 49 cm od barku — łuk prostej ręki musi ją przeciąć. Walidator tego nie łapie: koliderem wyciągu jest tylko linka i kolumna dla ciała, nie drążek (`lib/figures/v2/colliders.ts:67–70`). Naprawa: odsunąć kolumnę (x ≳ 85–90) albo cofnąć ćwiczącego; rozważyć kolizję drążek–kolumna w walidatorze. | realny (każde odtworzenie ćwiczenia, oba rzuty) | `/tmp/rec-p3-pulldown/ark/Straight-Arm-Pulldown-side.png` (wiersz 1–2), kadr powiększony `/tmp/rec-p3-pulldown/c_sap_side_035.png`; `ark-dark/…side.png`; dane `lib/figures/v2/poses/pulldown.json` (wyciag x 62) |
| N2 | ŚREDNIE | 85% | Wide-Grip Pulldown Behind The Neck / front / u = 0,45–0,70 | Drążek jest za głową (x ≈ −4 wobec głowy x ≈ 12–17,6), a w rzucie z przodu rysowany na głowie — przecina czoło/twarz jak przy ściąganiu przed twarzą. Kolejność głębi błędna (kolumna z tyłu jest poprawnie za ciałem). W ćwiczeniu „za głowę” ten rzut przeczy nazwie; rzut z boku jest poprawny. | realny (rzut z przodu) | `/tmp/rec-p3-pulldown/ark/Wide-Grip-Pulldown-Behind-The-Neck-front.png`, powiększenie `/tmp/rec-p3-pulldown/c_wg_front_060.png` |
| N3 | ŚREDNIE | 85% | Wide-Grip Pulldown Behind The Neck / side / cały ruch | Ćwiczący siedzi tyłem do kolumny (wyciag x = −38, ćwiczący zwrócony w +x); linka idzie ukośnie w tył-górę (ok. 35° od pionu na górze, 19° na dole). Zwykle siedzi się przodem do stosu, z drążkiem ściąganym prawie pionowo za głowę. Ruch rąk i tor są poprawne; nieprawdziwe jest ustawienie przy maszynie. | realny (każde odtworzenie) | `/tmp/rec-p3-pulldown/ark/Wide-Grip-Pulldown-Behind-The-Neck-side.png`; `poses/pulldown.json` (wyciag x −38, lawka kat 0) |
| N4 | ŚREDNIE | 85% | Lat Pulldown, Close-Grip, Underhand, V-Bar, Single Arm / side / u = 0 | Karta (pierwsza wskazówka `lpd.thighs` / `lpd.vbarSetup` / `lpd.thighsOnly`) każe ustawić wałki przytrzymujące uda; rysunek nie ma wałków (kontrakt zna `walki` tylko jako wałek przy kostkach ławki ujemnej, `lib/figures/v2/gear.ts:233`), za to ma oparcie pod kątem 85°, którego karta nie opisuje. To brak elementu, nie przeczenie ruchowi. Na dole ruchu ramię w rzucie z boku nachodzi na krawędź oparcia (łokieć x −10,4, z ±33 wobec oparcia z ±15 — bez kolizji w 3D, tylko na rysunku). | realny | `/tmp/rec-p3-pulldown/c_lat_u1.png`, `/tmp/rec-p3-pulldown/ark/Lat-Pulldown-side.png` |
| N5 | ŚREDNIE | 90% | wszystkie 8 / etykieta faz (EN) | Faza „Ściąganie” ma w słowniku EN tłumaczenie „Pulling back” (`lib/i18n.en.ts:794`, z szrugsów/ściągania łopatek). Pod ściąganiem drążka w dół angielski użytkownik czyta „Pulling back 1 s”. Potrzebny osobny klucz fazy (np. pull down) albo inne słowo PL dla pulldown. | realny (UI w EN) | `lib/figures/v2/poseData.ts:76`, `components/ExerciseFigureV2.tsx:120` (t(p.name)) |
| N6 | NISKIE | 90% | Close-Grip, Underhand, Single Arm, Full ROM / side / u = 1 | Na dole chwyt kończy 17 cm pod barkami (y 88 wobec barku 105), a reguła `do_gornej_klatki` mówi „na dole chwyt od 10 cm poniżej do 15 cm powyżej barków”; Lat Pulldown i V-Bar −8 cm (zgodnie). Ewaluator sprawdza tylko, czy jakikolwiek kadr mieści się w przedziale (`scripts/figures/v2-sens.mjs:266`, `p.some`), więc tego nie łapie. Na rysunku drążek leży mniej więcej w 1/3 wysokości tułowia, z łokciem lekko się prostującym w ostatnich kadrach (143° → 137°); w Single Arm karta mówi „do barku”. | realny, mały | `/tmp/rec-p3-pulldown/c_cg_front_u1.png`, `/tmp/rec-p3-pulldown/nak/Close-Grip-Front-Lat-Pulldown-side.png` (u 1,00: drążek pod linią poziomu barku) |
| N7 | NISKIE | 85% | V-Bar Pulldown / front | Uchwyt V rysowany jako krótki prosty drążek (chwyt `drazek`, dłonie 14 cm); kontrakt nie ma uchwytu V. Schemat do zaakceptowania jako uproszczenie, ale karta mówi „uchwyt V, dłonie zwrócone do siebie”. | realny, kosmetyczny | `/tmp/rec-p3-pulldown/c_V-Bar-Pulldown_front_u0.png` |

## Ruch — ocena ćwiczeń (oba rzuty, motyw jasny i ciemny)

- **Lat Pulldown**: nachwyt (obrót przedramienia −75), drążek schodzi przed twarzą (min. 22,9 cm od punktu głowy), na dole 8 cm pod barkami; łokieć na górze 19° (reguła ≤ 20°), na dole w dół i lekko w tył. Zgodny z kartą (ACE #158 kroki 2–4: „until your elbows are fully extended”; ExRx CBFrontPulldown) poza N4.
- **Close-Grip Front Lat Pulldown**: wąski chwyt (z ±11), łokcie przed tułowiem; N4, N6.
- **Underhand Lat Pulldown**: podchwyt (obrót +78) widoczny; łokcie w połowie ruchu szeroko — dopuszczalne; N4, N6.
- **V-Bar Pulldown**: chwyt neutralny, dłonie blisko; do górnej klatki (−8 cm); N4, N7.
- **Single Arm Lat Pulldown**: jedna ręka (uchwyt, trzyma R), druga na udzie, linka nie przecina głowy; N4, N6.
- **Full Range-Of-Motion Lat Pulldown**: dwa wyciągi (z ±60), łokcie w dół do boków — zgodne z zestawem vpull; N6.
- **Wide-Grip Pulldown Behind The Neck**: szeroki nachwyt (z ±42), głowa pochyla się w przód (x 12 → 17,6), drążek schodzi za głowę do karku (y 109, 4 cm nad barkami); N2, N3.
- **Straight Arm Pulldown**: ręce proste przez cały ruch (zgięcie łokcia 12–20°, reguła ≤ 25°), łuk z góry do ud (shElev 143° → 27°, zmiana > 45°), na dole drążek przed udami; **N1**.

## Wyjątki toru (tests/tor-wyjatki.json)

Policzyłem miarę testu (`ksztaltToru`, 25 kadrów) w czystej kopii: 6 × 9,0 cm / 1 zawrócenie (ściąganie przed twarzą), Wide-Grip 6,0 cm / 1, Straight Arm 31,6 cm / 1 — liczby w powodach się zgadzają. Na arkuszu śladu: łuk przed twarzą (wybrzuszenie w przód) i łuk za głową (w tył) to omijanie głowy, jedno zawrócenie, bez „S” — **potwierdzam 7**. Straight Arm: łuk prostej ręki o promieniu ramienia — **potwierdzam powód**; po naprawie N1 (przesunięcie kolumny/ćwiczącego) liczba może się nieznacznie zmienić i wymaga ponownego pomiaru.

## Nakładka (lib/figures/v2/overlay/pulldown.ts)

Trzy elementy z reguł „ustalone”, wskazówki obecne na kartach (dobór na arkuszach `nak/cwiczenia.json`: Lat/Close-Grip/Underhand — łokieć + poziom barku; V-Bar, Full ROM, Wide-Grip — sam łokieć (zestaw/karta bez `lpd.toChest`/`lpd.pull`); Single Arm — brak elementów (karta bez wskazówek z reguł); Straight Arm — kąt ramię–tułów). Bez podwójnych linii i artefaktów w obu motywach. Pominięcia uzasadnione: `lokcie_w_dol` (ta sama pozioma linia), `bez_odchylania` („ustalone (kierunek)”, granica z jednego źródła), `proste_rece` (prowadnica tylko z przodu, ręka w skrócie). Element Straight Arm jest drobny (krótka linia tułowia i łuk przy barku), ale czytelny w pełnej rozdzielczości — bez znaleziska. Poziom barku w Close-Grip/Underhand pokazuje rozjazd N6.

## Prezentacja (DATA_UI.pulldown)

Fazy Ściąganie 1 s / Pauza / Powrót 2 s / Pauza, `lowerFirst: false`, staw łokieć; Straight Arm — wyjątek `joints: ['shElev']` obsłużony w `figure.ts:107`; test `figures-v2-data.test.tsx` sprawdza wyjątek i spadek shElev. Poprawne; N5 dotyczy tylko przekładu EN.

## Karty

- **Lat Pulldown** (nowy wpis „karty”, 2ad35a7ac5a6): 4 wskazówki, każda z 2 źródłami szczebla 4 (ACE #158, ExRx CBFrontPulldown) — wyjątek wskazówek techniki spełniony; treść zgodna z rysunkiem v2 (przed twarzą, do górnej klatki, pełny wyprost) poza brakiem wałków (N4, nie przeczy ruchowi). Werdykt: wyświetlana. Wpis v1 72f6a47c92d4 → „zastapiona” po wydaniu v2.
- Close-Grip, Underhand, V-Bar, Single Arm, Straight Arm — spójność z v2: brak przeczenia ruchowi; uwagi N4/N6/N7. Karta Straight Arm zgodna z ruchem — N1 to błąd sprzętu na rysunku, nie karty.

## Zestawy ogólne (vpull)

- **Full Range-Of-Motion Lat Pulldown** (82ac6379f373): ruch pionowego ściągania — przypisanie poprawne; „Zacznij ruch od ściągnięcia łopatek w dół”, „Prowadź łokcie w dół, do boków tułowia”, „Na górze wyprostuj ręce do końca”, błąd „Szarpanie…” — zgodne z rysunkiem (łokcie 18 cm pod barkami na dole, wyprost 19°). EN wierne. Wyświetlana.
- **Wide-Grip Pulldown Behind The Neck** (d08a46fced0c): przypisanie poprawne; teksty bez „do klatki” (słusznie — drążek za głowę), zgodne z rysunkiem. EN wierne. Wyświetlana (N2/N3 dotyczą rysunku, nie zestawu).

## Sprawdzone bez znalezisk

Dane póz (8/8, walidator OK), liczniki w testach, skróty, przypisanie wariantów reguł sensu, zgięcie łokcia na górze, proste ręce w Straight Arm, chwyt podchwyt/nachwyt/neutralny/jednorącz/za głowę, linka a głowa (Single Arm, Lat), motyw ciemny (kontrast śladu i nakładki), zestawy pl/en.
