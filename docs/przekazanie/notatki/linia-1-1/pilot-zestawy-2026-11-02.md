> Wpisy 20 zatwierdzonych zestawów dopisane do docs/research/figury-recenzja.json (sekcja zestawy) przez koordynatora 02.11.2026; 7 z rodziny pull_up widoczne od razu, 13 po włączeniu ich rodzin. Teza o Z3 sprawdzona u źródła: scripts/pokrycie-katalogu.mjs:67,73 i components/ExerciseCues.tsx:33-34. Cele 1.1 i Z-1 — do decyzji właściciela.

# Próbna partia recenzji zestawów ogólnych (linia 1.1) — 02.11.2026

Gałąź pilot/zestawy-ogolne @ 6002907 (z lok/pullup-c-poprawki). Recenzent: audytor (niezależny, nie pisał zestawów). Bez jest/verify.

## 1. Inwentarz (runtime)

Polecenia: `node scripts/pokrycie-katalogu.mjs --cel 1.1`; inwentarz: policz() z scripts/pokrycie-katalogu.mjs + skroty() z scripts/zrodla-runtime.mjs (skrypt jednorazowy node -e, wynik kandydaci.json).

- cue-sets.json: general 538, own 102, open 69.
- general z aktualnym wpisem „zestawy”: 71 (0 nieaktualnych skrótów); liczonych jako „ogólne” w liczniku: 70 (1 bez spec).
- **general bez recenzji: 467, z tego ze spec tylko 8** (wszystkie rodzina pull_up = dokładnie lista zestawy_bez_wpisu z tests/recenzja-wyjatki-1-1.json); bez spec 459 (dane pozy v2 niewłączone 359, bez danych 100, v1 0).
- spec = v2.shownFigureSpec(key): figura v2 POKAZYWANA w aplikacji (rodzina ready + aktualna recenzja ruchu, nie wstrzymana) — nie dane pozy, nie v1 (scripts/pokrycie-katalogu.mjs:68,73; components/ExerciseCues.tsx:32-34; eksport strony scripts/strona/eksport.mjs:147 to samo).
- Skutek: przegląd całej puli podnosi wskazówki o max 8 (171→179) i częste błędy o max 8 (109→117; w tej partii 7, bo Dead Hang do poprawki). **Luk 469/448 recenzja zestawów nie zamyka** — 459 kandydatów odpada przez brak spec; potrzebne figury v2 (rodzina ready + recenzja ruchu) dla ~460 ćwiczeń, w tym 100 bez danych pozy.
- Cel 1.1 „wskazowki.zTekstem 640” = 101 own + 538 general + Hack Squat, „czesteBledyTekst 557” — liczby sprzed Z3 (wtedy zestaw ogólny liczył się bez recenzji i figury). Pod Z3 osiągalne tylko z figurami całego katalogu → decyzja właściciela o celu.
- Komplet tekstów pl/en 527/671: licznik bierze cueIds z ui.cueIdsOf (lib/figures/v2/ui.ts:24), który wymaga recenzji, ale NIE figury. Symulacja recenzji wszystkich 467: +146 kart z kompletem pl+en (0 brakujących tekstów) ≥ 144 → luka by się zamknęła, ale tymi tekstami, których ekran nie pokazuje (ExerciseCues wymaga v2). Patrz znalezisko Z-1.
- Własne wskazówki 101/102: brak = Hack Squat — lib/cues/data.json hidden, wpis „karty” werdykt „do poprawy” (28.10.2026: drugie źródło o hack squat dla 5 zdań + EN lp.hips). Nie zestaw ogólny.
- Własne z błędami 39/43: data/zrodla/cues.json ma tylko 39 kart własnych z mistakes (runtime też 39, żadna nie ukryta) → cel 43 nieosiągalny recenzją; wymaga nowych treści (badacz) albo korekty celu. Podejrzenie „pull_up → 1+4” nieprawdziwe: 8 kart pull_up to tryb general, nie own.
- sha wpisu: zestawSkrot (scripts/zrodla-runtime.mjs:77-80) = sha12 z {rodzina f, ok, err, polskie teksty id}; bieżące: `node scripts/zrodla-runtime.mjs --skroty` → klucz „zestawy”. Ten sam zestaw = ten sam skrót (np. 8c36dcc1e8f9 dla 3 chinów), więc wpis dla ćwiczenia bez figury przetrwa włączenie rodziny.

## 2. Partia (25)

Dobór: 8/8 kandydatów ze spec (pull_up — jedyni, którzy dziś ruszają licznik) + 17 bez spec: środkowe ćwiczenie z każdej z 17 największych rodzin.

| # | Ćwiczenie | rodzina / zestaw | spec | Werdykt |
|---|---|---|---|---|
| 1 | Dead Hang | pull_up / vpull | tak | POPRAWKI |
| 2 | Gironda Sternum Chins | pull_up / vpull | tak | wyswietlana |
| 3 | Mixed Grip Chin | pull_up / vpull | tak | wyswietlana |
| 4 | One Arm Chin-Up | pull_up / vpull | tak | wyswietlana (uwaga: „łokcie” l.mn.) |
| 5 | Scapular Pull-Up | pull_up / vpull | tak | wyswietlana |
| 6 | Side To Side Chins | pull_up / vpull | tak | wyswietlana |
| 7 | Wide-Grip Rear Pull-Up | pull_up / vpull | tak | wyswietlana |
| 8 | Gorilla Chin/Crunch | pull_up / hanging | tak | wyswietlana |
| 9 | Overhead Stretch | mobility_stand / stretch | nie | wyswietlana |
| 10 | Decline Oblique Crunch | core_floor / crunch | nie | POPRAWKI |
| 11 | Seated Close-Grip Concentration Barbell Curl | curl / curl | nie | wyswietlana |
| 12 | Alternating Deltoid Raise | delt_raise / raiseSide | nie | POPRAWKI |
| 13 | Split Jump | plyo / jump | nie | wyswietlana |
| 14 | Incline Barbell Triceps Extension | triceps / triLying | nie | POPRAWKI |
| 15 | Push-Ups With Feet On A Stability Ball | pushup_plank / pushup | nie | wyswietlana |
| 16 | Block Power Snatch | olympic / oly | nie | wyswietlana |
| 17 | Kneeling Hip Flexor Stretch | mobility_floor / stretch | nie | wyswietlana |
| 18 | Barbell Step Up | lunge / lunge | nie | wyswietlana |
| 19 | See-Saw Press (Alternating Side Press) | overhead_press / ohp | nie | POPRAWKI |
| 20 | Decline Dumbbell Fly | chest_fly / fly | nie | wyswietlana |
| 21 | One-Arm Kettlebell Jerk | kb_ballistic / pushPress | nie | wyswietlana (err pusty) |
| 22 | Cable Russian Twists | core_standing / rotation | nie | wyswietlana |
| 23 | Peroneals-SMR | foam_roll / smr | nie | wyswietlana |
| 24 | One-Arm Dumbbell Reverse Wrist Curl | forearm / wrist | nie | wyswietlana |
| 25 | Calf Raise (linki) | calf_raise / calf | nie | wyswietlana |

Wynik: 20 wyswietlana (80%), 5 POPRAWKI (20%). Wpisy: wpisy.json (20).

## POPRAWKI

1. **Dead Hang** — npu.hang „Chwyć uchwyty…” (zdanie do podciągania na uchwytach neutralnych); figura (lib/figures/v2/poses/pull_up.json, sprzęt „sztanga” = drążek) i typowy zwis to drążek. Zamiana: pu.grip („Chwyć drążek nachwytem, trochę szerzej niż barki, i zawiśnij na prostych rękach”). Po zmianie nowy skrót i wpis.
2. **Decline Oblique Crunch** — crunch.lowBack „Dolna część pleców zostaje na podłodze” fałszywe: ławka skośna, nogi zaczepione, tułów trzymany ok. 35–45° nad ławką, skręt do kolana. Usunąć crunch.lowBack (zostaje crunch.neck, mis.jerk) albo zdanie o kontrolowanym skręcie (badacz).
3. **Alternating Deltoid Raise** — naprzemiennie unoszenie w przód i bokiem (opis ćwiczenia: przód do barków, następne powtórzenie bokiem). lat.elbows „łokcie prowadzą ruch… na wysokości dłoni lub wyżej” to zdanie unoszenia bokiem. Zamiana: front.elbows + lat.height | mis.jerk (istniejący wariant zestawu raiseFront).
4. **Incline Barbell Triceps Extension** — skull.upperArm „Ramiona… mniej więcej pionowo” fałszywe: ławka 45–75°, sztanga opuszczana za głowę, ramiona nieruchomo przy głowie (wzdłuż tułowia, nie pionowo). Zamiana na zestaw triOver: ote.upperArm, ote.elbowsIn, press.noLock | mis.jerk.
5. **See-Saw Press (Alternating Side Press)** — opis: hantle z rotacją jak w Arnold press, łokieć na zewnątrz, pochylenie w biodrze w stronę przeciwną. ohp.tall („tułów wysoko i stabilnie; ciężar prosto w górę”) i ohp.elbowsUnder przeczą. Żaden istniejący zestaw nie pasuje → tryb open albo własne wskazówki (badacz).

Typowe przyczyny: wariant odbiega od wzorca rodziny (ławka skośna, ruch naprzemienny przód/bok, pochylenie boczne) — zdania o pozycji ciała (pionowo, na podłodze, tułów wysoko) i o sprzęcie (uchwyty vs drążek). Zdania ogólne (kontrola, bez szarpania, oddech) nie zawiodły ani razu. Ryzyko rośnie dla ćwiczeń z nazwą zawierającą: Decline/Incline, Alternating/Side, Kneeling, z sprzętem innym niż wzorzec.

## 3. Pomiar

- Czas zegarowy partii (od checkoutu do zapisu wpisów): ok. 4 min (date +%s: 1793597236 → 1793597454), z inwentarzem; sama recenzja 25 pozycji ok. 2 min plus 5 odczytów opisu ćwiczeń z zewnętrznego katalogu dla niepewnych.
- Tokeny: ok. 65–75 tys. kontekstu całej sesji (inwentarz ok. 35 tys., partia ok. 30 tys.); szacunek ok. 1,0–1,5 tys. tokenów na pozycję przy partii 25–40 i grupowaniu po zestawie (wspólne teksty raz).
- 80% zatwierdzonych / 20% POPRAWKI; wśród bez spec 13/17 (76%).

## 4. Szacunek i podział

- Pula: 467 bez recenzji (8 ze spec + 459 bez). Po partii: 447 bez wpisu (5 POPRAWKI czeka na zmianę zestawu → nowy skrót).
- Co da cała pula dla celu 1.1: wskazówki/błędy +8 (tylko pull_up, już w tej partii 7); pl/en +146 kart (patrz Z-1 — liczba bez pokrycia w UI). Pozostałe 459 wpisów to praca „na zapas” — zadziała dopiero, gdy rodzina dostanie figurę v2 z recenzją ruchu, i tylko jeśli tekst zestawu się nie zmieni.
- Partie: 447 / 35 ≈ 13 partii. Agenci równolegle: 4–5 (podział po rodzinach v2, każdy zwraca JSON wpisów, koordynator scala jednym skryptem do docs/research/figury-recenzja.json sekcja zestawy; bez kolizji, bo nikt nie pisze do repo). Przy ~1,2 tys. tok./poz. jeden agent mieści ok. 2–3 partie w 30% okna.
- Fale (propozycja): F1 — pull_up (zrobione 7/8; Dead Hang po poprawce zestawu). F2 — rodziny najbliżej statusu ready (z danymi pozy, 359), w kolejności włączania figur. F3 — reszta (100 bez danych pozy) dopiero przy figurach. Poprawki zestawów (ok. 20% → ~90 ćwiczeń) zbiorczo do badacza, potem recenzja tylko zmienionych.
- Rekomendacja: zanim ruszy masowa recenzja — decyzja właściciela o celu 1.1 (640/557/43/671 są niespójne z Z3) i poprawka Z-1; inaczej praca zamyka lukę licznika pl/en bez zmiany w aplikacji.

## Znalezisko

| ID | Poziom | Pewność | Realność | Opis | Dowód |
|---|---|---|---|---|---|
| Z-1 | ŚREDNIE | 90% | realny (bramka wydania) | „Komplet tekstów karty” liczy id zestawu ogólnego po samej recenzji, bez figury v2; ekran i strona pokazują je tylko przy figurze. Recenzja 146 zestawów bez figur „zamknie” cel pl/en 671 bez żadnej zmiany widocznej dla użytkownika. Nie blokuje wydania (licznik, nie UI). | scripts/pokrycie-katalogu.mjs:76 (ui.cueIdsOf) i lib/figures/v2/ui.ts:24 vs components/ExerciseCues.tsx:34, scripts/strona/eksport.mjs:147 |
| Z-2 | NISKIE (do decyzji) | 95% | — | Cele 1.1 wskazowki.zTekstem 640, czesteBledyTekst 557, wlasneZBledami 43 nieosiągalne pod Z3 bez figur całego katalogu / nowych treści (dane mają 39 kart własnych z błędami). | docs/research/pokrycie-cele.json; data/zrodla/cues.json |
