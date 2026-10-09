# 24. Generator szablonów i planu tygodnia; kilka planów (08.10.2026)

Decyzje właściciela: docs/18 (08.10.2026). Reguły merytoryczne: docs/research/22 (serie, deload, zasady generatora R1–R9) i docs/research/23
(regeneracja). Wyjątek od zasady z 03.10 („szablony ustawia właściciel”): generator działa tylko na wyraźne polecenie, wynik do przejrzenia przed zapisem.

## 1. Kilka planów tygodnia, jeden aktywny
- Aktywny plan: `State.weekPlan` (dni pon…nd + opcjonalna nazwa) — dane sprzed zmiany przechodzą 1:1.
- Inne plany: `State.savedPlans` (id, nazwa, dni, od 08.10.2026 wieczór także `overrides`). „Ustaw jako aktywny” zamienia miejscami.
- Audyt 0.10 (decyzje właściciela 08.10.2026 wieczór — wariant lepszy, nie tańszy):
  - **B1 (DAT-02 B):** zmiany pojedynczych dni **od dziś** należą do swojego planu — przy wyłączeniu zapisują się w nim (`SavedPlan.overrides`),
    przy ponownej aktywacji wracają (te, które nie minęły); przeszłe zostają w kalendarzu. Okno aktywacji (ekran planu i generator — jeden tekst,
    `lib/plan.ts` `activationNote`) mówi, ile zmian przejdzie z obecnym planem i ile wróci z nowym; bez obecnego planu nie obiecuje zapisu.
  - **B2 A (UX-04 A):** „+ Nowy plan” tworzy osobny wpis w „Inne plany” (kopia dni aktywnego planu), który edytuje się (nazwa, dni) przed
    „Ustaw jako aktywny”; aktywny plan i jego nazwa bez zmian. Plan bez nazwy, gdy przestaje obowiązywać, dostaje nazwę z datą („Plan do 8.10”).
    Zmiana nazwy: tapnięcie planu w „Inne plany”. Nazwy bez powtórzeń („Masa, 3× w tygodniu (2)”, także z generatora).
  - **B3:** najwyżej 50 zapisanych planów — ten sam limit w `migrate` i w UI (bez „+ Nowy plan”, generator pokazuje komunikat).
  - **B4:** nazwa planu zapisywana przy każdej zmianie pola, porządkowana przy końcu edycji (spacje, ≤ 40 znaków bez rozcinania emoji; idempotentnie).
- Usuwanie gestem (z potwierdzeniem).
- **Historia planu (schemat 18, audyt 0.10 A1, wariant B):** `State.planHistory` — odcinki `{from, days}`; każda zmiana planu (dzień, aktywacja,
  generator) dopisuje odcinek od dziś; miniony dzień liczy się wg planu, który wtedy obowiązywał; dni sprzed pierwszego planu nie są „opuszczone”.
  Dane sprzed 18: plan obowiązuje od dnia migracji. Zmiany dni z przeszłości nie są kasowane (dawniej po 60 dniach).

## 2. Generator — wejście i założenia
- Nazwa (audyt 0.10 UX-14): ekran „Generator szablonów i planu” (jak temat przewodnika), przycisk „Wygeneruj szablony i plan”.
- Wejście: ekran Szablony („Wygeneruj szablony i plan”) i ekran Plan tygodnia (ten sam kreator).
- Założenia: cel (siła / masa / redukcja = masa + cardio), miejsce (sprzęt z Miejsc), sesje w tygodniu 2–6 (przy redukcji 3–6, w tym 1 cardio —
  siłowych 2–5), czas sesji (45 / 60 / 90 min). Wszystkie liczby generatora to stałe w `lib/generator.ts`; teksty ekranu dostają je jako parametry.
- Miejsce (audyt 0.10 UX-10): chip „+ Dodaj miejsce” (Miejsca treningu); bez miejsc — wyjaśnienie, że plan zakłada pełną siłownię; „Bez ograniczeń
  sprzętu” = pełna siłownia (opis pod chipami).
- Wynik: szablony w folderze „Wygenerowane” (każdy szablon siłowy z notatką: jedna linijka wysiłku — RIR; puste szablony nie są zapisywane — dzień
  wolny), nowy plan tygodnia „{cel}, {n}× w tygodniu · {miejsce}” (bez miejsca — „Pełna siłownia”; za długie miejsce skrócone „…” do 40 znaków)
  zapisany obok innych; pytanie, czy ma od razu obowiązywać; po zapisie potwierdzenie „Zapisano” (co i gdzie) z „Pokaż szablony” i „Plan tygodnia”.
  Nazwy (szablony, folder, plan) w języku z chwili zapisu — potem to dane użytkownika.
- Ponowne generowanie (UX-10): gdy są poprzednio wygenerowane, **nieużywane** szablony (folder „Wygenerowane” w dowolnym języku; bez treningu
  w historii ani w toku, poza aktywnym planem, zmianami dni i każdym innym miejscem stanu) — pytanie „Zastąpić…?” z listą: „Zastąp” usuwa je razem
  z zapisanymi planami złożonymi tylko z nich, „Zostaw” dodaje nowe obok („FBW A (2)”).

## 3. Reguły (z docs/research/22 sekcja 3; status jak tam)
| Element | Reguła w generatorze | Podstawa / status |
|---|---|---|
| Podział | 2 → FBW A/B; 3 → FBW A/B/A; 4 → góra/dół ×2; 5 → góra/dół ×2 + FBW; 6 → góra/dół ×3 | konkretny podział = **konwencja** |
| Dni na partię | każda partia z `MAJOR` ≥ 2 dni/tydz. (`MIN_DAYS`), dla **każdego celu**: dzień z partią główną = 1, tylko pomocniczą = 0,5 (`SECONDARY_SHARE`); podgląd: „Brak ćwiczeń na: …” z podpowiedzią sprzętu z danych (`HELP_EQUIP`: drążek, gumy, hantle, kettlebell — ten, po którego dodaniu jest ćwiczenie na brakującą partię) i „Rzadziej niż 2 dni w tygodniu: … (0,5)” | R1: WHO 2020 (zdrowie, wszystkie główne partie ≥ 2 dni); ACSM 2026 (siła ≥ 2 sesje); liczenie 0,5 — Pelland 2026, **jedno źródło**, uproszczenie (audyt 0.10 MER-02, LOG-03) |
| Dni | spośród wszystkich układów n dni (kolejność sesji bez zmian) ten z najmniejszą liczbą par dzień po dniu ze wspólną partią główną; dalej mniej dni pod rząd, bez niedzieli, najbliżej układu domyślnego (`bestDays`; 4 sesje → pon/wt/czw/sob, 0 par); cardio — pierwszy wolny z sob/nd/śr/czw/wt/pt/pon | docs/research/23 (uproszczenie; audyt 0.10 LOG-10) |
| Dobór ćwiczeń | wzorce ruchu: przysiad/wykrok, zawias biodrowy, pchanie i ciąganie poziome/pionowe; jednostawowe dla partii poniżej 10 serii | R7 (potwierdzone); liczba ćwiczeń = konwencja |
| Sprzęt | tylko ćwiczenia dostępne w wybranym miejscu (lib/equipment `availability`) | dane użytkownika |
| Serie tygodniowo (masa, redukcja) | cel ≥ 10 serii na partię (`WEEKLY_SETS_MARK` z lib/stats), gdy czas pozwala; podgląd pokazuje braki (partia bez serii — tylko w „Brak ćwiczeń”) | R2 (dolny próg potwierdzony; 20 — jedno źródło, nie używane) |
| Serie na ćwiczenie | 3 (`SETS_PER_EX`) | R10: ACSM 2026 — co najmniej 2; 3 = **uproszczenie** |
| Siła | bój główny na początku, 3 × 4–6 powt. (≈ ≥ 80% 1RM, `HEAVY_PCT`), przerwa 180 s — **tylko ćwiczenie z obciążeniem zewnętrznym obecnym w miejscu** (`hasExternalLoad`: sztanga, hantle, kettlebell, maszyny, wyciągi, Smith); dodatkowe 3 × 6–10, 120 s; jednostawowe i core 90 s. **Miejsce bez żadnego obciążenia zewnętrznego** (dom, masa ciała): plan jak masa w domu (3 × 12–20, przerwy masy, budżet z przerw masy) i ostrzeżenie zamiast „ok. 80% maksimum” | R3 (ciężar potwierdzony; 2–3 serie — jedno źródło); 6–10 = **konwencja**; audyt 0.10 MER-01 (rekomendacja A) |
| Masa / redukcja | 3 serie × 8–12 na siłowni; w domu (bez sztangi, wyciągów, maszyn i Smitha z obciążeniem) 12–20; przerwa 120 s wielostawowe, 90 s izolacja i core | R4 (zakres potwierdzony, liczby = uproszczenie), R6 (**uproszczenie**, „przeglądy niejednoznaczne”) |
| Wysiłek | opis: zwykle 0–3 powtórzenia w zapasie (ACSM 2026: blisko upadku albo 2–3; dokładnej liczby nie ustalono), upadek nieobowiązkowy; ta sama linijka w notatce każdego szablonu siłowego | R5 (potwierdzone kierunkowo; audyt 0.10 MER-06) |
| Cardio (redukcja) | sesje umiarkowanego cardio w osobne dni, długość = czas sesji (**konwencja**); podgląd: zalecenie WHO „co najmniej 150–300 min umiarkowanego (albo 75–150 min intensywnego) wysiłku tygodniowo, liczy się też umiarkowany ruch w ciągu dnia”; bez „na czczo” i „strefy 2”; w Zdrowiu jako trening cardio (bieg → running, rower → cycling…, inne → mixedCardio), nie siłowy | R8 (potwierdzone; audyt 0.10 MER-08, MER-18); docs/research/22 sekcja 4 |
| Czas sesji | budżet serii = (minuty − 10 min rozgrzewki) × 60 / (40 s serii + średnia przerwa `AVG_REST`: siła 150 s = średnio bój 180 i dodatkowe 120; masa i redukcja 105 s = średnio 120 i 90; siła bez obciążenia — 105 s); ćwiczeń = budżet / 3, co najmniej 3; szacunek — rzeczywiste przerwy mogą dać ±1–2 min (np. masa 90 min ≈ 91 min) | **uproszczenie bez źródła** — nazwane w podglądzie z liczbą serii i średnią przerwą (audyt 0.10 MER-12, LOG-11) |
| Progresja | opis: zwiększ ciężar po górnej granicy zakresu przy docelowym RIR | R9 (**konwencja**) |

## 3a. Plan z moich szablonów (decyzja właściciela 09.10.2026, wariant B — wyjątek od zamrożenia; docs/18 ok. 14:55)
- Wejścia: ekran generatora — wybór „Nowe szablony i plan” / „Plan z moich szablonów” (`/generator?mode=own`); edytor planu (przycisk, gdy jest
  szablon z ćwiczeniami); „Pierwsze kroki” (krok 2, gdy jest szablon z ćwiczeniami, a nie ma planu).
- Wejście: szablony użytkownika (niezarchiwizowane, z ćwiczeniami; domyślnie wszystkie, gdy jest ich najwyżej 6) i liczba dni `GEN_SESSIONS`
  (2–6, jak generator), co najmniej tyle, ile wybranych szablonów (`OWN_MAX` = 6 — każdy szablon dostaje dzień).
- Rozkład (`lib/generator.ts` `ownPlan`) — te same reguły co generator, bez nowych liczb: szablony po kolei A/B/A… (jak 3 FBW A/B/A i 6 góra/dół —
  konwencja), dni `bestDays` od układu domyślnego generatora (najmniej par dzień po dniu ze wspólną partią główną — docs/research/23 reguła 1,
  uproszczenie), ostrzeżenia z `weekLoad` (wspólna funkcja z generatorem): brak ćwiczeń na partię, rzadziej niż `MIN_DAYS` (R1), poniżej
  `WEEKLY_SETS_MARK` (R2 — opisane jako próg dla masy, bo plan nie ma celu), pary dzień po dniu. Serie: robocze jak w treningu (bez rozgrzewek);
  ćwiczenia cardio nie liczą się do partii.
- Zapis po podglądzie: to samo pytanie co generator (`activationNote` — zmiany pojedynczych dni od dziś zostają z poprzednim planem w „Inne plany”
  i wracają przy jego aktywacji), plan „Moje szablony, n× w tygodniu”; **szablony bez zmian** (zasada 03.10.2026).

## 4. Otwarte
- Audyt 0.10 (08.10.2026): rejestr decyzji na Dysku — ADR-041 ma jeszcze sformułowanie „150–300 min ruchu” (do poprawy na „co najmniej 150–300 min
  umiarkowanego wysiłku”, MER-08); opis uprawnienia Zdrowia (`app.json`, 26 języków) mówi „treningi siłowe”, a od poprawki MER-18 trening cardio trafia
  do Zdrowia jako cardio — tekst uprawnienia do zmiany przy wydaniu Health (zmiana natywna).
- Dni z partią tylko pomocniczą liczone jako 0,5 — jedno źródło (Pelland 2026), nazwane uproszczeniem; przypisanie partii w katalogu bez źródeł (MER-10).
- Godzina przypomnienia 8:00 — potwierdzona przez właściciela 08.10.2026.
- RIR = 10 − RPE — drugie niezależne źródło znalezione 08.10.2026 (Bastos i in. 2024, docs/research/22 sekcja 5) — zamknięte.
