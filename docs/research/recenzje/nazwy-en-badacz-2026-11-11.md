# Recenzja merytoryczna kanonicznych nazw EN (nazwy-en.json)

- Recenzent: badacz-merytoryczny (recenzja niezależna, L-047; nie jestem autorem tabeli)
- Data: 11.11.2026
- Zakres: 267 wpisów `docs/research/equipment/nazwy-en.json` (gałąź `zb/w04-nazwy`)
- Metoda: każdy wpis porównany z dawną nazwą i z opisem ćwiczenia w `docs/research/equipment/catalog.json` (pola `requires`, `note`, `cables`, `implements`). Sprawdzone: sprzęt, wariant, pozycja, chwyt, jednostronność. Sprawdzenie kolizji: nowe nazwy wobec wszystkich kluczy `catalog.json` (709 nazw; wyszukiwanie po rdzeniach Row/Press/Raise/Deadlift/Squat/Extension/Curl/Fly/Crunch/Push-Up/Shrug/Dip/Chin/Foam Roll), `lib/nazwy-en.generated.ts`, `lib/seed.ts:292-294` (`LIB_DISPLAY_NAME`) i `lib/i18n.ts:134-140` (`EX_FULL`, `EX_PAREN`). Konwencje P1–P4 i reguły stylu przewodnika (W, H, L, K, E) nie były oceniane. Naturalność angielszczyzny należy do recenzenta lokalizacji.
- Ograniczenie: z tej sesji nie da się otworzyć exrx.net, acefitness.org ani catalystathletics.com (brak DNS — te domeny trzeba dopuścić w ustawieniach sieci sesji). Gdzie potrzebne było źródło terminu, korzystam z wpisów źródeł zapisanych już w repo z dokładnym miejscem (`docs/research/27-wskazowki-zrodla.md`). Nie otwierałem tych stron ponownie dzisiaj.

## Werdykt

**Zatwierdzone z poprawkami.** Jedna nazwa zmienia ćwiczenie (WYSOKIE): 76c15d28. Pozostałe uwagi są NISKIE albo [DO USTALENIA]. Nie znalazłem kolizji ani duplikatów z innymi nazwami katalogu.

## Znaleziska

| rid | dawna | nowa | problem | waga | propozycja | źródło |
|---|---|---|---|---|---|---|
| 76c15d28 | Side To Side Chins | Side-to-Side Chin-Up | Opis ćwiczenia w katalogu to szeroki nachwyt (`catalog.json:12446` „Wide pronated grip…”), research przyrównuje je do archer pull-up (`docs/research/25-biblioteka/L5.json:2124`), a figura korzysta z pozy `pull_up` (`lib/figures/v2/poses/pull_up.json`). „Chin-Up” oznacza podchwyt, więc nowa nazwa opisuje inny chwyt niż karta i rysunek. Dawne „Chins” było ogólnym słowem kulturystycznym; rozwinięcie do „Chin-Up” dopisało chwyt, którego ćwiczenie nie ma. | WYSOKIE | „Side-to-Side Pull-Up” (reguły H1, H2 bez zmian) | Szczebel 4: ACE „Chin Ups (#190)”, Step 1, i ExRx „BWUnderhandChinup”, Preparation — podchwyt w chin-upie (zapis w `docs/research/27-wskazowki-zrodla.md:495`, wpis `cu.grip`). Szczebel 4: ACE „Pull Ups (#191)”, Step 1; NASM „Pull Up”, Step 1: Setup; ExRx „BWPullup”, Preparation — nachwyt w pull-upie (`27-wskazowki-zrodla.md:475`, `pu.grip`). Dwa zgodne źródła szczebla 4 na każde z dwóch twierdzeń. |
| 2cfc60fd | Cable Crunch With Side Bends (Balance Dome) | Balance Dome Cable Crunch with Side Bend | (a) Zastąpienie znaku towarowego nazwą ogólną idzie w dobrą stronę (SEC2-01). Nie potwierdziłem jednak źródłem, że „Balance Dome” to rozpoznawalna nazwa ogólna tego przyrządu. (b) „with Side Bend” w liczbie pojedynczej przeczy L2 przewodnika („słowo po with zostaje w naturalnej liczbie”, por. 9abbde89 „…with Alternating Oblique Twists”). | NISKIE | (a) [DO USTALENIA]: sprawdzić termin ogólny na półkulę balansową w źródle szczebla ≤ 4 (np. biblioteka ćwiczeń ACE/NASM, gdy domeny będą dostępne) i wtedy zostawić albo zmienić. (b) „Balance Dome Cable Crunch with Side Bends” | brak przeczytanego źródła dla (a); przewodnik L2 dla (b) |
| 5eef847c | Lying Supine Dumbbell Curl | Lying Dumbbell Curl | K4 uznaje „Lying Supine” za podwójne, ale „Supine” niesie informację (na plecach; `catalog.json:16217` „Lying face up on a flat bench…”). Samo „Lying” pasuje też do wariantu na brzuchu. Dziś w katalogu nie ma wariantu na brzuchu, więc nie ma kolizji. | NISKIE | Zostawić albo „Supine Dumbbell Curl” — do decyzji recenzenta lokalizacji (naturalność) | `catalog.json:16217` (opis wewnętrzny) |
| 9c5c8269 | Mixed Grip Chin | Mixed-Grip Chin-Up | Chwyt mieszany (`catalog.json:12068`: jedna dłoń w nachwycie, druga w podchwycie) nie jest ani czystym chin-upem, ani czystym pull-upem; research nazywa go „analogią do pull-up/chin-up” (`L5.json:2059`). Znaczenie nie zmieniło się względem dawnej nazwy („Chin”), więc to nie błąd. | NISKIE | [DO USTALENIA]: zostawić „Mixed-Grip Chin-Up” albo „Mixed-Grip Pull-Up” według przeczytanego źródła szczebla ≤ 4 (nie otwarte w tej sesji) | brak przeczytanego źródła rozstrzygającego |

## Sprawdzone bez uwag (wybrane wpisy z ryzykiem merytorycznym)

- Nazwy po polsku (W0): 7ad8aef8 „Standing Cable Chest Press” (`catalog.json:320`: chest press, h_push), 662edea9 „Seated Dual-Cable Row” (`:921`: dwie ręce na dwóch linkach, `cables: 2`), 775db8cc „Cable Belt Squat”. Każda opisuje to samo ćwiczenie.
- E5 Leverage → Machine: 1c9abcb6, aa94afd5, 04c94607, 9bfac6b8, 6df50c2d (`lever_machine`, „maszyna”). Nie kolidują z istniejącymi „Machine Chest Press”, „Machine Row”, „Machine Shoulder Press”.
- E3 Dual-Cable: 1f02eafa (`catalog.json:5767` — po jednym uchwycie na rękę z dwóch linek) odróżnia się od istniejącego „Cable Curl” (drążek na jednej lince).
- F1 rolowanie: 7deb94b3 „Upper Back Foam Roll” — opis katalogu to „Foam rolling, upper back” (`:28104`), więc obszar się zgadza. f9dd2033 „Foot Roll” — katalog nie wymaga wałka (`:28130-28139`), co zgadza się z nazwą bez „Foam”.
- K4: a984f904 „Single-Arm Dumbbell Fly” i 03686829 „Oblique Crunch” — opuszczone dopowiedzenia są domyślne; warianty „Decline Oblique Crunch” i „Decline Dumbbell Fly” zostają odrębne. bd10f542 „Seated Leg Pull-In” zostaje odrębne od „Leg Pull-In”.
- Gironda Sternum Chin-Up (`:11617` podchwyt) i Gorilla Chin-Up Crunch (`:24659` podchwyt): „Chin-Up” jest tu poprawne. Eponimy (Gironda, Pallof) zostały bez zmian.
- Kolizje: nie znalazłem żadnej nowej nazwy równej innej nazwie katalogu (porównanie bez wielkości liter). Pary bliskie, ale odrębne: Seated Cable Row / Seated Dual-Cable Row; Cable Crunch / Seated Cable Crunch; Spider Curl / Barbell Spider Curl; Barbell Wrist Curl / Barbell Wrist Curl Behind the Back; Leg Pull-In / Seated Leg Pull-In.

## Poza zakresem tej recenzji

- Pozycje z sekcji 3 przewodnika, których nazwa EN się nie zmienia (Pec Deck, Battle Ropes, Conan's Wheel, Linear Jammer, Superman, Arnold/Pendlay/Bayesian, Air Bike, Ski Ergometer, Orbitrek). Nie ma ich wśród 267 wpisów → [OTWARTE], osobne zadanie.
- Potwierdzenie słownikowe pisowni H1 (push-up, pull-up…) → [OTWARTE].

## Liczby

- Przejrzane: 267
- Bez uwag: 263
- Z uwagami: 4 (WYSOKIE 1, NISKIE 3; z tego [DO USTALENIA] 2)
