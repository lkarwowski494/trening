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
- Wejście: ekran Szablony („Wygeneruj szablony i plan”) i ekran Plan tygodnia (ten sam kreator).
- Założenia: cel (siła / masa / redukcja = masa + cardio), miejsce (sprzęt z Miejsc), sesje siłowe w tygodniu (2–6), czas sesji (45 / 60 / 90 min).
- Wynik: szablony w folderze „Wygenerowane”, nowy plan tygodnia zapisany obok innych (nazwa bez powtórzeń); pytanie, czy ma od razu obowiązywać.

## 3. Reguły (z docs/research/22 sekcja 3; status jak tam)
| Element | Reguła w generatorze | Podstawa / status |
|---|---|---|
| Podział | 2 → FBW A/B; 3 → FBW A/B/A; 4 → góra/dół ×2; 5 → góra/dół ×2 + FBW; 6 → góra/dół ×3 | R1 (każda grupa ≥ 2×/tydz. — potwierdzone); konkretny podział = **konwencja** |
| Dni | rozłożenie z dniem przerwy między sesjami z tymi samymi głównymi partiami, gdy się da | docs/research/23 (uproszczenie) |
| Dobór ćwiczeń | wzorce ruchu: przysiad/wykrok, zawias biodrowy, pchanie i ciąganie poziome/pionowe; jednostawowe dla partii poniżej 10 serii | R7 (potwierdzone); liczba ćwiczeń = konwencja |
| Sprzęt | tylko ćwiczenia dostępne w wybranym miejscu (lib/equipment `availability`) | dane użytkownika |
| Serie tygodniowo (masa, redukcja) | cel ≥ 10 serii na partię, gdy czas pozwala; podgląd pokazuje braki | R2 (dolny próg potwierdzony; 20 — jedno źródło, nie używane) |
| Siła | bój główny na początku, 3 serie × 4–6 powt. (≈ ≥ 80% 1RM), przerwa 180 s; dodatkowe 2–3 × 6–10, 120 s | R3 (ciężar potwierdzony; 2–3 serie — jedno źródło); 6–10 = **konwencja** |
| Masa / redukcja | 3 serie × 8–12 na siłowni; w domu (bez sztangi i maszyn) 12–20; przerwa 120 s wielostawowe, 90 s izolacja | R4 (zakres potwierdzony, liczby = uproszczenie), R6 („zwykle”) |
| Wysiłek | opis: 1–3 powtórzenia w zapasie (RIR), upadek nieobowiązkowy | R5 (potwierdzone kierunkowo) |
| Cardio (redukcja) | sesje umiarkowanego cardio w osobne dni; licznik do 150–300 min/tydz. łącznie z codzienną aktywnością; bez „na czczo” i „strefy 2” | R8 (potwierdzone); docs/research/22 sekcja 4 |
| Czas sesji | budżet serii = (minuty − 10 min rozgrzewki) × 60 / (40 s serii + przerwa) | **uproszczenie bez źródła** — nazwane w podglądzie |
| Progresja | opis: zwiększ ciężar po górnej granicy zakresu przy docelowym RIR | R9 (**konwencja**) |

## 4. Otwarte
- Godzina przypomnienia 8:00 — potwierdzona przez właściciela 08.10.2026.
- RIR = 10 − RPE — drugie niezależne źródło znalezione 08.10.2026 (Bastos i in. 2024, docs/research/22 sekcja 5) — zamknięte.
