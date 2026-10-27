### 03-zakres-001 · 56 animacji starego systemu figur wyświetla się w 1.0 bez zapisu recenzji ruchu i bez wymuszenia reguły bramki 4 z 27.10
- Pozycja listy kontrolnej: ZAK-08 (podłoga treści; patrz TRE-07)
- Poziom: P1
- Realność: realny · Pewność: wysoka (brak zapisu i brak wymuszenia w repo); czy recenzja odbyła się poza repo — nieustalone
- Rodzaj: M
- Dowód: CLAUDE.md (27.10.2026): każda animacja i karta ćwiczenia w wydaniu przechodzi niezależną recenzję ruchu, także rodziny wcześniej uznane za gotowe, a rodzina bez recenzji nie jest wyświetlana; decyzja `docs/18-przekazanie.md:599`. Kod: `components/ExerciseCues.tsx:44` — gdy ćwiczenie nie ma gotowej rodziny v2, pokazuje figurę v1; 71 figur v1, z czego 56 bez rodziny v2 (m.in. Overhead Press, Pull Up, Bent Over Row, Lunges, Biceps Curl, Plank) — dowody/figury-bramka4.txt . Rodziny v2: 3 `ready` bez pola recenzji (`lib/figures/v2/families.ts:27`). `docs/40-lekcje.md:43`: wymuszenie w kodzie otwarte. Zapis recenzji w repo istnieje tylko dla rodzin v2 (L-042, `tests/figury-1-0-recenzja.test.ts`); dla v1 — brak (grep, dowody/figury-bramka4.txt). Brak też wpisu w rejestrze ryzyk.
- Wzorzec lub źródło: CLAUDE.md, sekcja o animacjach i kartach ćwiczeń (27.10.2026); próg wydania CLAUDE.md pkt 1 (błędne twierdzenia merytoryczne).
- Kroki w aplikacji: Więcej → Ćwiczenia → np. Overhead Press (sztanga) → karta ćwiczenia, sekcja Technika rozwinięta od 27.10 → animacja v1.

- Test akceptacyjny: test w verify, który dla każdej figury możliwej do wyświetlenia (v1 i v2) wymaga wpisu recenzji z datą i SHA, a figura bez wpisu nie renderuje się; zapis recenzji 56 figur v1 albo ich ukrycie.


### 06-tresci-001 · Animacje v1 (56 ćwiczeń) i karty ćwiczeń idą do 1.0 bez zapisu recenzji bramki 4; reguła „bez recenzji = nie wyświetlane” nie ma mechanizmu
- Pozycja listy kontrolnej: TRE-10 (także TRE-13)
- Poziom: P1
- Realność: realny · Pewność: wysoka (brak zapisu i mechanizmu w commicie wydania); średnia co do tego, czy recenzja v1 istnieje gdzie indziej
- Rodzaj: P (naprawa może ukryć grafiki v1 do czasu recenzji)
- Dowód:
  - CLAUDE.md (27.10.2026): każda animacja i karta ćwiczenia trafiająca do wydania przechodzi niezależną recenzję ruchu i treści, „także rodziny uznane wcześniej za gotowe”; rodzina bez recenzji nie jest wyświetlana.
  - `components/ExerciseCues.tsx:44` — gdy ćwiczenie nie ma figury v2, wyświetlana jest figura v1 (`<ExerciseFigure exercise={exercise} />`); sonda: 56 ćwiczeń z własnymi wskazówkami pokazuje animację v1 (m.in. Pull Up, Overhead Press, wiosłowania, wykroki, Hip Thrust, Kettlebell Swing, Push Press) — `dowody/sonda-figury-v1.txt`.
  - Od 27.10.2026 sekcja “Technika” jest domyślnie rozwinięta w karcie ćwiczenia (`docs/18-przekazanie.md:600`), więc animacje v1 widzi każdy, kto otworzy kartę.
  - L-042 w `docs/40-lekcje.md:43`: krok bramki 4 — “reguła zapisana; wymuszenie w kodzie otwarte”; `lib/figures/v2/families.ts:27` (status `ready` bez pola recenzji). Recenzje L-042 obejmują tylko rodziny squat, bench_press, hinge; zapis recenzji jest na gałęzi `przekazanie-konta`, nie w wydawanym commicie (`docs/21-roadmapa-offline.md:143` odsyła tam).
  - Teksty wskazówek (306 zdań, 35 języków) i zestawy ogólne nie mają skrótu wersji zrecenzowanej: `check:cues` pilnuje zgodności dokumentu z danymi (`dowody/check-cues.txt`), nie recenzji.
  - Ten sam mechanizm luki co przy decyzji o kolejności planów (polecenie M1): decyzja zapisana w CLAUDE.md i docs bez testu-strażnika, który by ją wymuszał.
- Wzorzec lub źródło: CLAUDE.md projektu, sekcja „Animacje i karty ćwiczeń — audyt dogłębny” (27.10.2026); moduł tresci-krytyczne, zasada 6.
- Kroki w aplikacji: Ćwiczenia → np. „Pull Up” → karta otwiera się z rozwiniętą „Techniką” i animacją v1.

- Test akceptacyjny: test, który dla każdego ćwiczenia z wyświetlaną figurą (v1 lub v2) wymaga wpisu recenzji z datą i skrótem bieżących danych figury i wskazówek; zmiana danych bez nowego wpisu kończy verify błędem; zapis recenzji w `docs/` na `main`.


### 09-lokalizacja-001 · Treść krytyczna w 33 językach bez zamkniętego przeglądu po ostatnich zmianach (R-010 otwarte)
- Pozycja listy kontrolnej: LOK-10
- Poziom: P1 (blokuje wydanie w App Store przez otwarte ryzyko R-010, CLAUDE.md „Rejestr ryzyk z blokadą”; nie blokuje TestFlight)
- Realność: realny · Pewność: wysoka
- Rodzaj: P
- Dowód: `docs/40-lekcje.md:22` — R-010 „blokuje wydanie w App Store, nie blokuje TestFlight”, status „otwarte”; `docs/48-zgloszenie-1-0.md:306` — przegląd z 22.10 „trzeba go powtórzyć po przekładzie”; `docs/16-jezyki-i-marka.md:272` — piąty klucz asekuracji to „własne tłumaczenie agenta w 31 słownikach”, do przeglądu tłumacza; tabela tamże: kolumna „drugi przegląd wskazówek” = „niewykonany” w każdym języku; commit f781b5e6 (26.10) zmienił 4 zdania wskazówek w 32 plikach po przeglądzie API. Kontroli (a) polityki „szerokiej” (przekład zwrotny na polski w świeżej sesji) nie znalazłem w repo (`grep -i "przekład zwrotny"` w docs/tests/scripts: 0 trafień).
- Wzorzec lub źródło: zasada roli 3 („Przekład twierdzenia to nowe twierdzenie”); decyzja właściciela 21.10.2026 (docs/18): R-010 zamyka przegląd Claude z listą sprawdzonych zdań.
- Kroki w aplikacji: telefon w np. czeskim → ćwiczenie → Technika: wskazówki i zdanie o asekuracji w przekładzie bez zapisanego przeglądu po ostatniej zmianie.

- Test akceptacyjny: wpis w docs/16 „drugi przegląd” z datą i SHA dla każdego języka; R-010 „zamknięte” w docs/40; test, który porównuje skrót tekstu krytycznego z ostatnim przeglądem i czerwieni się po zmianie bez przeglądu.


### 09-lokalizacja-003 · Panel startu po ukraińsku i słoweńsku pokazuje złą formę liczby ćwiczeń („4 вправ”, „4 vaj”)
- Pozycja listy kontrolnej: LOK-05
- Poziom: P1 (zła forma w głównym przepływie — próg z listy kontrolnej)
- Realność: realny (szablon z 1–4 ćwiczeniami) · Pewność: wysoka
- Rodzaj: D
- Dowód: `components/StartPanel.tsx:27` — „sub: t('dziś w planie · {n} ćw.', { n: m.tpl.items.length })”; źródło używa skrótu „ćw.”, żeby ominąć odmianę, a przekład rozwinął go do dopełniacza liczby mnogiej: `lib/locales/uk.json:321` „сьогодні в плані · {n} вправ” (poprawnie: 1 вправа, 2–4 вправи), `lib/locales/sl.json:321` „danes v načrtu · {n} vaj” (1 vaja, 2 vaji, 3–4 vaje); to samo w kluczach `lib/locales/uk.json:659`, `lib/locales/uk.json:1336`, `lib/locales/sl.json:659`, `lib/locales/sl.json:1336`. Pozostałe 31 języków zachowały skrót (sonda: dowody/probka-jakosci.txt i zapytanie w scratchpadzie; uk sam klucz „ćw.” = „впр.”).
- Wzorzec lub źródło: zasada roli 5 (liczba mnoga w mechanizmie); CLDR uk/sl (wiersze „Ukrainian”, „Slovenian”: one/few/many, one/two/few/other).
- Kroki w aplikacji: język ukraiński → zakładka Trening bez treningu w toku, plan z szablonem 2–4 ćwiczeń → podpis przycisku startu „… · 3 вправ”.

- Test akceptacyjny: test, który dla każdego klucza ze skrótem po `{n}` w źródle sprawdza, że przekład w językach z formą few/many też ma skrót albo jest kluczem liczebnikowym; render panelu w uk z n = 3.


### 09-lokalizacja-004 · Przy największym tekście ekran Trening ucina ikony, w tym ikonę startu kolejnego treningu (T-04)
- Pozycja listy kontrolnej: SP-07 (rola 04; LOK-08 odsyła skalowanie w języku źródłowym do SP-07)
- Poziom: P1 (ucięta akcja w głównym przepływie przy ustawieniu dostępności)
- Realność: realny (ustawienie „Większe rozmiary dostępności”) · Pewność: wysoka co do objawu (obserwacja właściciela, build 1031); przyczyna w układzie [DO USTALENIA]
- Rodzaj: D
- Dowód: obserwacja T-04 z polecenia M1 (pogrubiony tekst bez problemu). Na web nie da się odtworzyć Dynamic Type; zrzuty 320 pt w pl, fr, uk bez ucięć (dowody/zrzuty-raport.json.txt), więc problem dotyczy skali tekstu, nie długości przekładu.
- Wzorzec lub źródło: zasada roli 7 (najpierw układ, zgłoszenie do 04).
- Kroki w aplikacji: Ustawienia iOS → Dostępność → Większy tekst → największy → zakładka Trening.

- Test akceptacyjny: scenariusz Maestro z największym rozmiarem tekstu i zrzut ekranu Trening bez uciętych ikon (krok właściciela albo E2E iOS).


### 01-odkrywanie-003 · Przy największym tekście ikony ekranu Trening ucięte (T-04); brak wymagania dla elementów sterujących
- Pozycja listy kontrolnej: ODK-14 (dostępność; ekran w kontekście: SP-17)
- Poziom: P1
- Realność: realny (użytkownicy z „Większymi rozmiarami dostępności”; obserwacja właściciela na buildzie 1031) · Pewność: wysoka co do obserwacji; czy ikona startu przestaje działać — nie sprawdzono
- Rodzaj: D
- Dowód: T-04 (polecenie M1): «ucięta większość ikon, m.in. duża szara ikona startu kolejnego treningu». BRD ma tylko NFR-DOS-001 dla opisów: `docs/brd/wymagania.md:721` (Próg 2 = 200%, `lib/theme.ts:34`); żadne wymaganie nie mówi, że elementy sterujące i ikony pozostają widoczne i działają przy największym tekście. Decyzja DEC-10 (200%) ogranicza skalę tekstu, ale nie przyjmuje ucinania przycisków.
- Wzorzec lub źródło: CLAUDE.md, „Audyty i wydania” pkt 1 — bariera dostępności blokuje wydanie.
- Kroki w aplikacji: Ustawienia iOS → Dostępność → Ekran i tekst → Większy tekst → największy rozmiar → aplikacja → zakładka Trening.

- Test akceptacyjny: test ekranu Trening przy największej skali: każdy przycisk z ikoną mieści się w swoim polu i ma działającą akcję; zrzut z symulatora przy AX5 w E2E.


### 04-studio-projektowe-002 · Ikony ekranu Trening ucięte przy największym tekście (T-04) — przyczyna nieustalona, brak sprawdzenia dużego tekstu na iOS
- Pozycja listy kontrolnej: SP-07
- Poziom: P1
- Realność: realny (zaobserwowany przez właściciela na buildzie 1031) · Pewność: średnia (co do przyczyny; samo zjawisko — obserwacja właściciela)
- Rodzaj: D
- Dowód: emulacja Dynamic Type w Expo web (mnożnik 3,12 = AX5 dla tekstu treści, ograniczony przez `maxFontSizeMultiplier` jak w RN iOS: `node_modules/react-native/ReactCommon/react/renderer/textlayoutmanager/platform/ios/react/renderer/textlayoutmanager/RCTAttributedTextUtils.mm:230` skaluje też interlinię) **nie odtwarza** ucięcia na ekranie Trening (390 i 320 pt, jasny i ciemny, z planem, bez planu, pierwsze uruchomienie, trening w toku): `zrzuty/t04-trening-plan-390-dark-ax5.png`, `zrzuty/ark-t04-light.png`, `zrzuty/ark-t04-320.png`, `zrzuty/ark-t04-aktywny-390-dark-ax5.png`, `dowody/web-zrzuty.txt` (0 elementów przyciętych). Emulacja pokazuje inną cechę: grafiki (znaczniki dni, stosy talerzy, znaki legendy strażnika, sztanga po tytule) mają stały rozmiar przy 2–3 razy większym tekście. Na pasku zakładek w web podpisy są przycięte już przy rozmiarze domyślnym (`zrzuty/tabbar-cmp.png`) — artefakt web bez dolnego bezpiecznego obszaru, niedowód. W CI nie ma żadnego przebiegu z dużym tekstem: `.maestro/` i workflowy nie ustawiają rozmiaru treści (`grep content_size` — 0 trafień, `dowody/sp07-skalowanie.txt`).
- Wzorzec lub źródło: podłoga roli „Tekst skaluje się do AX5, kluczowe elementy nie są ucinane” (HIG Typography; WWDC24 Dynamic Type, cytaty w bibliotece ról); próg wydania CLAUDE.md: bariera dostępności = WYSOKIE, jeśli element jest nie do użycia.
- Kroki w aplikacji: Ustawienia iOS → Dostępność → Ekran i wielkość tekstu → Większy tekst → Większe rozmiary dostępności, suwak maksymalnie → Trening, ekran Trening (właściciel: duża szara ikona startu kolejnego treningu ucięta).

- Test akceptacyjny: zrzut z symulatora przy AX5 (ekran Trening z planem i bez, trening w toku) bez przyciętych ikon i przycisków; przy decyzji D3 b — scenariusz w pakiecie podstawowym.


### 04-studio-projektowe-004 · W wąskim układzie tabeli serii przycisk stopera i pole RPE mają 40 pt szerokości (poniżej przyjętych 44 pt)
- Pozycja listy kontrolnej: SP-06
- Poziom: P1 (reguła SP-06: projekt przyjął 44 pt, element w głównym przepływie z rękami zajętymi)
- Realność: brzegowy (tylko gdy szeroki układ się nie mieści: ekrany ok. 320–375 pt, tryb „Powiększenie ekranu”) · Pewność: wysoka
- Rodzaj: D
- Dowód: `components/WorkoutBlocks.tsx:51` — układ COMPACT: `play: 40`, `rpe: 40` (wysokość 44, `components/WorkoutBlocks.tsx:231`); układ szeroki ma 44 i 46 (`components/WorkoutBlocks.tsx:49`). Cel dotyku w tokenach: `SIZE.hit = 44` (`lib/tokens.ts:155`). Bez `hitSlop` na tych elementach.
- Wzorzec lub źródło: podłogi dostępności roli (44 × 44 pt, decyzja studia; HIG minimum 28); design-spec §1 „Cel dotykowy ≥ 44 pt”.
- Kroki w aplikacji: iPhone o szerokości 320–375 pt albo „Powiększenie ekranu” → trening z ćwiczeniem na czas (plank) i włączonym RPE → tabela serii pod tablicą → przycisk ▶ stopera i pole RPE węższe niż 44 pt.

- Test akceptacyjny: test układu COMPACT: każdy element interaktywny wiersza serii ma szerokość + hitSlop ≥ 44.


