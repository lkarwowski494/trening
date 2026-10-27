# Ponowna recenzja ruchu i treści kart: poprawki-p4b, runda 3 (3 pozy), 27.10.2026

Recenzent niezależny (recenzent p4b-r3). Nie czytałem README podglądów, komunikatów commitów gałęzi poprawek, komentarzy w `scripts/figures/agent-pozy/*.mjs` ani linii stanu agentów.

- **Zakres:** Bent Press, Kettlebell Windmill, Double Kettlebell Windmill (rodzina core_standing); `origin/poprawki-p4b` @ 252392c9.
- **CI:** tests.yml dla 252392c9 — przebieg **40508970603 w toku** (start 13:05 UTC) w chwili recenzji; poprzedni (ad5fe355) 40499775158 zielony. Walidatora lokalnie nie powtarzałem (pkt 12, obciążenie maszyny).
- **Podgląd:** `podglady-1-1/poprawki-p4b-r3/core_standing/` — ważny (`PODGLAD-WAZNY.txt`, `katy-stawow.md`, manifest; klatki 9/9/12). Wszystkie 3 pozy bez wierszy błędów (`bledy` = []).
- **Render własny: 17 klatek (u = 0…1 co 1/16) × 2 widoki (bok, przód) × 3 ćwiczenia = 102 klatki** + powiększenie 2,5× klatek u = 0; 0,25; 0,5; 0,625; 0,75; 1 (36) — `v2.dataShapes` + `svgDocument` z gałęzi, wspólna ramka na ruch; skrypty i PNG w `/tmp/claude-0/rec-p4b3/` (lokalnie). Pomiary: stawy i chwyt co 1/16, środek ciężkości `srodekCiezkosci` (`v2-jakosc.mjs`) z ciężarem 16 kg w chwycie względem otoczki stóp.

## Wynik

| Werdykt | Liczba | Ćwiczenia |
|---|---|---|
| OK | 0 | — |
| OK z uwagą | 3 | Bent Press, Kettlebell Windmill, Double Kettlebell Windmill |
| BŁĄD | 0 | — |

**BŁĄD WYSOKIE z rundy 2 (Bent Press) usunięty.** Nowych BŁĘDÓW nie ma. Uwagi niżej (ŚREDNIE/NISKIE), nie blokują.

### Stan znalezisk z `ponowne/p4b-r2.md`

| Wcześniej | Stan | Dowód (mój pomiar) |
|---|---|---|
| nr 1 Bent Press: hantel ucieka 48 cm w przód i 27 cm w bok, miednica nad kostkami, utrata równowagi (WYSOKIE) | **usunięte** | chwyt x 18,0 → 24,0 cm, z 10,0 → 4,0 cm: **przesunięcie poziome 8,5 cm** (było 55 cm); y 144 → 158 (ręka się prostuje). Miednica x 3 → −37,2 (u = 0,625) → −26,8 cm (w tył), z 0 → +18 cm (w bok, ku stronie ciężaru — prawa). Środek ciężkości z hantlem 16 kg **wewnątrz podparcia w każdej klatce**: 5,5 / 8,4 / 4,9 / 6,6 / 9,6 cm od krawędzi (u = 0 / 0,25 / 0,5 / 0,75 / 1); samo ciało u = 0,5: −0,9 cm (na krawędzi, za piętą — z hantlem wraca do środka, poprawnie) |
| nr 1b Bent Press: przedramię odchylone do 49° | **usunięte** | odchylenie przedramienia od pionu 0–1° w każdej z 17 klatek |
| Wiatraki: miednica x = 0, środek ciężkości z ciężarem 5–6 cm przed palcami (ŚREDNIE) | **usunięte** | miednica x 0 → −18 cm, z 0 → +7 cm (w bok ku ręce z ciężarem); środek ciężkości z kettlebellem 16 kg wewnątrz: KW 5,3–9,7 cm, DKW (oba dzwony) 3,8–9,2 cm od krawędzi |
| Bent Press: zestaw `ok` zawiera `wm.arm` („ręka prosta przez cały ruch”) | **nadal** (ŚREDNIE, dziś niewidoczne) | `cue-sets.json` l. 62 bez zmian; `wm.arm` na liście `newIds` (bez tekstu w pl.json) — karta go nie pokaże, ale tłumacz wdroży tekst sprzeczny z rysunkiem (start z łokciem zgiętym ~146°) |
| Bent Press: hantel zamiast kettlebella (`loadSource: kettlebell`) | nadal, znane NISKIE | — |

## Ocena ruchu

| Ćwiczenie | Ruch | Treść | Werdykt | Szczegóły |
|---|---|---|---|---|
| Bent Press | OK z uwagą | uwaga (`wm.arm`) | **OK z uwagą** | Z przodu czyta się jednoznacznie jako bent press: hantel stoi nad prawym barkiem, miednica wychodzi w prawo pod ciężar, tułów schodzi w lewo, wolna ręka zsuwa się po lewej nodze, na końcu ręka prosta pionowo nad hantlem. Z boku (u ≥ 0,5) wygląda bardziej jak głęboki skłon z przysiadem i ręką w górze — ramię poziomo w przód, przedramię pionowo, hantel stoi; czytelne, choć mniej charakterystyczne niż widok z przodu (NISKIE). Kąty zgodne z tabelą (biodro do 133°, kolano do 88°, bark zgięcie do 198° przy wyjątku 201°). Chwyt 6 cm przed czubkami palców (podparcie x −17,6…17,9), ale łączny środek ciężkości w środku — dopuszczalne. |
| Kettlebell Windmill | OK z uwagą | OK | **OK z uwagą** | Biodro w tył i w bok, dolna ręka prosta sunie po wewnętrznej stronie lewej nogi, z przodu ręka z ciężarem pionowo. **Uwaga (ŚREDNIE): z boku ręka z kettlebellem nie jest pionowa** — odchylenie w przód 16° (u = 0), **26° (u = 0,5)**, 10° (u = 1); chwyt jedzie x 18 → 42 → 32 cm i z 19 → −9 cm (ok. 37 cm w poziomie), u = 0,5 dzwon 26 cm przed czubkami palców. Wskazówka „ciężar nad barkiem, ręka pionowo” widoczna tylko z przodu. Równowaga zachowana (środek ciężkości wewnątrz). Reguła `wiatrak_ciezar_nad_barkiem` tego nie łapie (prawdopodobnie sprawdza tylko płaszczyznę czołową). |
| Double Kettlebell Windmill | OK z uwagą | OK | **OK z uwagą** | Ta sama poza co KW + dolny dzwon: schodzi między nogami przy lewej nodze, dolna ręka prosta. Ta sama uwaga o pochyleniu górnej ręki w przód (26° przy u = 0,5). |

Ciągłość: na 17 klatkach × 2 widoki brak skoków; chwyt i miednica zmieniają się monotonicznie (Bent Press: miednica cofa się do u = 0,625 i wraca o 10 cm do u = 1 — płynnie).

## Treść karty

- Wszystkie trzy: widoczny tylko `mis.jerk` („Szarpanie i rzucanie ciężarem zamiast kontrolowanego ruchu.”) — naturalnie, bez źródeł i marek, zgodne z rysunkiem.
- `wm.arm` / `wm.eyes` w zestawie `ok` bez tekstu w pl.json; dla wiatraków spójne z rysunkiem (ręka prosta, wzrok na ciężar), dla Bent Press `wm.arm` sprzeczne (ŚREDNIE, jak w rundzie 2).
- Rejestr twierdzeń: brak wpisów dla tych 3 ćwiczeń; widoczny tekst nie podaje liczb ani źródeł — wpis niewymagany.

## Gotowość do statusu „zatwierdzona”

- **core_standing: tak, z uwagami** — po zielonym tests.yml 40508970603. Do backlogu 1.1: (1) ŚREDNIE — górna ręka w wiatrakach pochylona w przód do 26° w widoku z boku (regułę `wiatrak_ciezar_nad_barkiem` rozszerzyć na płaszczyznę strzałkową, np. ≤ 15°); (2) ŚREDNIE — `wm.arm` w zestawie Bent Press zastąpić wskazówką o przedramieniu pod ciężarem przed wdrożeniem tekstu; (3) NISKIE — hantel zamiast kettlebella; widok z boku Bent Press mniej charakterystyczny.
