# Ponowna recenzja ruchu i treści kart: poprawki-p4b, runda 2 (4 pozy), 27.10.2026

Recenzent niezależny (recenzent p4b-r2). Nie czytałem README podglądów, komunikatów commitów gałęzi, komentarzy w `scripts/figures/agent-pozy/*.mjs` ani linii stanu agentów.

- **Zakres:** Bent Press, Toes to Bar, Kettlebell Windmill, Double Kettlebell Windmill; `origin/poprawki-p4b` @ ad5fe355 (tests.yml 40499775158 zielony — dane koordynatora; geometrii walidatorem lokalnie nie powtarzałem, pkt 12).
- **Podgląd:** `podglady-1-1/poprawki-p4b-r2/` (core_hang, core_standing) — ważny: `PODGLAD-WAZNY.txt` i `katy-stawow.md` są, tabela kątów zgodna z moimi pomiarami (bark zgięcie 219,1° wiatraki / 212,9° Bent Press). Brak wierszy błędów we wszystkich 4 pozach (`bledy` = []).
- **Render własny: 17 klatek (u = 0…1 co 1/16) × 2 widoki (bok, przód) × 4 ćwiczenia = 136 klatek** (`v2.dataShapes` + `svgDocument` z gałęzi, wspólna ramka na ruch; skrypty i PNG lokalnie w `/tmp/claude-0/rec-p4b2/`). Do tego pomiary: stawy co 0,125 (`miary`), ciągłość Toes to Bar co 0,05 i co 0,01, środek ciężkości (funkcja `srodekCiezkosci` z `v2-jakosc.mjs`, masy segmentów z repo) względem wielokąta podparcia stóp, z ciężarem 16 kg i bez.

## Wynik

| Werdykt | Liczba | Ćwiczenia |
|---|---|---|
| OK | 0 | — |
| OK z uwagą | 3 | Toes to Bar, Kettlebell Windmill, Double Kettlebell Windmill |
| **BŁĄD** | **1** | **Bent Press** (WYSOKIE: hantel ucieka 48 cm do przodu i 27 cm na drugą stronę, postać traci równowagę; przedramię odchyla się ok. 50° w fazie środkowej) |

**Szczelność reguł: 0 z 1.** Reguła `srodek_ciezkosci_podparcie` istnieje, ale działa tylko dla listy `PODPARCIE_ZMIENNE` (`Single-Arm Push-Up`) i nie liczy ciężaru w dłoni.

### Stan znalezisk z recenzji `ponowne/p4b.md`

| Wcześniej | Stan | Dowód |
|---|---|---|
| nr 1 Bent Press: wyciskanie zamiast zejścia pod ciężar | **usunięte** | chwyt y 145,5 → 156,6 cm (+11 cm), barki 139,5 → 84,8 cm (−55 cm), łokieć 142° → 20°; widok z przodu czyta się jako bent press. **Nowy BŁĄD** w poziomie (niżej) |
| nr 3 Toes to Bar: start nie ze zwisu | **usunięte** | u = 0: biodro 12,1°, kolano 4,9°, nogi pionowo pod miednicą; u = 1: palce (−1,6; 236,4) przy drążku (0; 230) |
| nr 4 Double Windmill: dolna ręka zgięta 45°, kettlebell z dala od nogi | **usunięte** | łokieć dolnej ręki 5–8° przez cały ruch; u = 1 chwyt (20,6; 34,6; −7,6): 12 cm do środka od lewej kostki (z −20), ok. 20 cm przed goleniem; z przodu dzwon zjeżdża między nogami przy lewej (przedniej) nodze |
| uwaga KW: wolna ręka zgięta 41°, 19 cm na zewnątrz | **usunięte** | jak wyżej (ta sama poza) |
| uwaga: brak skrętu klatki, wyjątek zakresu z błędnym uzasadnieniem | **usunięte** | `skretTulowia` 40° (granica `EXT_ROM.twist` ±40, `skeleton.ts`), skłon boczny −34/−35° (granica ±35); uzasadnienie wyjątku 222/216° jest teraz prawdziwe |
| Bent Press: zestaw `ok` zawiera `wm.arm` („ręka prosta przez cały ruch”) | **nadal** (ŚREDNIE, dziś niewidoczne) | `cue-sets.json` l. 62 bez zmian; `wm.arm` nie ma tekstu w `pl.json`, więc karta go nie pokazuje |
| core_hang B: drążek niewidoczny z boku | **nadal** (uwaga) | rodzina ma `views: ['side']`, a w widoku z boku drążka nie rysuje się wcale |
| core_hang A: miednica się nie zwija | nadal (uwaga) | `zgiecieKregoslupa` 0 |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / staw | Co jest źle (liczby) | Jak powinno być | Pewność | Realność, waga | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Bent Press** | u 0,5 → 1, hantel, miednica | **Ciężar nie stoi w miejscu, tylko na wysokości, a postać traci równowagę.** Hantel jedzie x 18 → 66,5 cm (+48,5 cm do przodu) i z +10 → −16,8 cm (27 cm w poprzek, kończy nad linią lewej stopy, a trzyma go prawa ręka). Miednica stoi przez cały ruch w x = 0 (nad kostkami), a tułów pochyla się 75°. Na końcu hantel jest 66 cm przed biodrami, 48 cm przed czubkami palców (podparcie x −5,6…17,9) i 27 cm przed barkami. Środek ciężkości samego ciała wychodzi 1,9 cm przed palce (u = 1), a z hantlem 16 kg — 9,7 cm (u = 0,75: 8,1 cm). Z boku (klatki u ≥ 0,69) to przysiad z sięgnięciem ręką w przód i w górę, a nie „ciało pod ciężarem”. | Hantel na prawie stałym miejscu także w poziomie (rzędu ≤ 15 cm), nad stopami. Biodro wypchnięte w tył i w bok pod ciężar (miednica x ujemne, z ku prawej), tak żeby rzut środka ciężkości z ciężarem leżał w podparciu. Ręka pionowo nad stopą po stronie ciężaru. | 75% | realny (każde wyświetlenie, oba widoki); **WYSOKIE** w 1.1 (obraz uczy toru ciężaru, który przy realnym ciężarze nad głową kończy się utratą równowagi) | **nie**: `srodek_ciezkosci_podparcie` obejmuje tylko `Single-Arm Push-Up` i liczy samo ciało. Propozycja: stosować ją do wszystkich póz stojących z ciężarem w dłoni, z masą ciężaru (np. 16 kg) w chwycie; dodatkowo `ciezar_stoi_poziomo` dla Bent Press (przesunięcie chwytu w x/z ≤ 15 cm) |
| 1b | **Bent Press** (ta sama klatka) | u 0,44–0,69, prawe przedramię | **Łokieć ucieka w bok, przedramię nie stoi pionowo pod ciężarem.** Odchylenie przedramienia od pionu: u = 0: 4°, 0,25: 15°, **0,5: 48°, 0,625: 49°**, 0,75: 41°, 1: 25°. Łokieć z = 30 cm (odwiedzenie barku 46°); z przodu ramię poziomo w bok, hantel nad głową — wygląda jak wyciskanie z łokciem w bok. | Przedramię prawie pionowo pod hantlem w całym zejściu (≤ ~15°), łokieć przy tułowiu, aż ręka się wyprostuje. | 70% | realny; liczone razem z nr 1 (WYSOKIE) | **nie**: brak reguły pionu przedramienia pod ciężarem w core_standing (`lokiec_nad_nadgarstkiem` działa w innych rodzinach) |

Start Bent Press jest dobry: łokieć pod hantlem przy tułowiu (łokieć (14; 113; 12), przedramię pionowo), hantel przy barku; wolna ręka zsuwa się do lewego kolana i niżej. Głębokość (tułów 75°, kolana 65–71°) jest wiarygodna jako głęboki bent press z przysiadem — problemem jest tor ciężaru i miednica, nie głębokość.

## OK z uwagą

- **Toes to Bar:**
  - Start ze zwisu (biodro 12,1°), palce przy drążku na końcu — poprawne. **Ciągłość:** palce przesuwają się równo, 12,9–15,6 cm na krok 0,05 u (limit 16 cm); na 17 klatkach własnego renderu nie widać skoku.
  - **Drganie kolan (NISKIE):** kolano ma 5–10° w każdej klatce kluczowej i 16–18° między nimi (próbkowanie co 0,01). To 11 cykli „ugnij–wyprostuj” na jedno powtórzenie, ok. 4 cm ruchu kolana; przy odtwarzaniu może być widać lekkie pulsowanie goleni. Przyczyna: kostka jest interpolowana liniowo między klatkami (cięciwa łuku). Gęstsze klatki albo stałe kolano rozwiązują.
  - **Drążka nie widać (uwaga B, ŚREDNIE):** rodzina pokazuje tylko widok z boku, a w nim drążek nie jest rysowany. Cecha nazwy „do drążka” widać tylko jako stopy przy dłoniach.
- **Kettlebell Windmill, Double Kettlebell Windmill:**
  - Dolna ręka prosta (łokieć 5–8°), ciężar przy wewnętrznej stronie przedniej (lewej) nogi, ręka z ciężarem pionowo nad barkiem w widoku z przodu — poprawne.
  - **Bark przy wyjątku 222°:** na klatkach z boku i z przodu (pełna rozdzielczość, kadr powiększony 2,5×) ręka wychodzi z barku przy głowie i nie wygląda na wyłamaną. Wyjątek do przyjęcia.
  - **Równowaga (ŚREDNIE, ta sama przyczyna co BŁĄD nr 1, łagodniej):** miednica stoi w x = 0 przy tułowiu pochylonym 64°. Środek ciężkości ciała leży dokładnie na linii palców (0,0 cm od krawędzi), z kettlebellem 16 kg nad głową 5,4–6,0 cm przed palcami; kettlebell nad głową 50 cm przed kostkami. Z boku wygląda to jak skłon z ręką w przód, ale nadal czytelnie. Naprawa razem z nr 1: biodro w tył i w bok.
  - Wolna dłoń / dolny kettlebell ok. 20 cm przed goleniem (nie przy nodze) — dopuszczalne.

## Treść karty

| Ćwiczenie | Co pokazuje karta (pl) | Uwagi |
|---|---|---|
| Bent Press | tylko `mis.jerk` („Szarpanie i rzucanie ciężarem zamiast kontrolowanego ruchu.”) | zestaw `ok` nadal `wm.arm` („ręka prosta przez cały ruch”) — sprzeczne z rysunkiem (start z ręką zgiętą); dziś ukryte, bo brak tekstu. **ŚREDNIE**, bez zmian od rundy 1. Drobne (NISKIE): `loadSource: kettlebell`, a rysunek pokazuje hantel (`requires` dopuszcza oba) |
| Windmill ×2 | tylko `mis.jerk` | spójne z rysunkiem. Mięśnie: skośne 1, bark boczny 0,5 (Double: + dwugłowe uda 0,5, prostowniki 0,25, triceps 0,25) — spójne |
| Toes to Bar | brak wskazówek (`hang.slow`, `hang.ribs`, `hang.noSwing` bez tekstu w `pl.json`) | mięśnie: brzuch 1, skośne 0,5, najszerszy 0,25, przedramiona 0,25 — spójne; wymagania: drążek albo kółka |

- Rejestr twierdzeń: brak wpisów dla tych 4 ćwiczeń; widoczny tekst (`mis.jerk`) nie podaje liczb ani źródła, więc wpis nie jest wymagany.
- Nazwy marek i źródeł w tekstach widocznych: brak. Brzmienie `mis.jerk` naturalne.

## Gotowość do statusu „zatwierdzona”

- **core_hang (Toes to Bar): tak, z uwagami** (drganie kolan NISKIE, drążek w widoku z boku — uwaga przekrojowa rodziny).
- **core_standing: nie** — Bent Press (nr 1, WYSOKIE). Wiatraki same w sobie gotowe (OK z uwagą); poprawka miednicy najlepiej razem z Bent Press.
