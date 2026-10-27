Nowa sesja (świeży kontekst). Repo /home/user/trening (gałąź robocza: Twoja kopia robocza od naprawy/M2-koordynator-napraw-2026-10-27-p1; koordynator scali ją do gałęzi partii 2).
Prompt roli: /home/user/trening/audit/M1-2026-10-27/prompty/06-tresci-fix-p2.md (złożony: assemble.mjs 06-tresci --tryb fix --zadania 06-tresci-001)
Zadanie planu M1-audytor-generalny-005 (P1, P): 56 animacji v1 wyświetla się w 1.0 bez zapisu recenzji ruchu (bramka 4, CLAUDE.md 27.10); reguła „bez recenzji = nie wyświetlane” bez wymuszenia.
Test akceptacyjny: DEC-01 b: zapis recenzji bramki 4 dla 56 animacji v1 przed zgłoszeniem (poprawki ruchu, jeśli recenzja wykaże) + strażnik „wyświetlana animacja ⇒ wpis recenzji”.
P: decyzja DEC-01 rozstrzygnięta 2026-10-27, wybór b „recenzja bramki 4 dla 56 animacji przed zgłoszeniem + strażnik”. Innej opcji nie wdrażasz.
Decyzja właściciela 2026-10-27 (wieczór, pkt 7a): rodzinę z wadą ruchu poprawiasz od razu, jeśli poprawka jest pewna (reguły ruchu i źródła wg CLAUDE.md, wyjątek dla wskazówek techniki: 2 zgodne źródła szczebla 4); jeśli nie — rodzina ukryta (status nie `ready`, nie wyświetlana w aplikacji ani eksportowana na stronę) i trafia do listy „rodzina / ćwiczenie / wada / proponowana poprawka” w wynik.md — właściciel zdecyduje: naprawa przed 1.0 czy w 1.0.1.
Model pracy bramki 4: docs/przekazanie/notatki/53-grafiki-model-pracy.md na gałęzi origin/przekazanie-konta (git show origin/przekazanie-konta:<ścieżka>). Strona z ćwiczeniami: klon tylko do odczytu /home/user/lkarwowski494/techniqueatlas — sprawdź, które rodziny eksportuje, i opisz w wynik.md, czy strona pokaże rodzinę ukrytą w aplikacji (bez zmian w tym repo; zmiany na stronie = krok właściciela).
Recenzja ma być niezależna i dogłębna (ruch i treść karty: opis, wskazówki, mięśnie, kąty, tempo, błędy). Możesz zlecić część pracy subagentowi badacz-merytoryczny; liczby i twierdzenia tylko z przeczytanych źródeł.
Zasady projektu: /home/user/trening/CLAUDE.md (repo publiczne; źródła anonimowe w UI; testy przed kodem; macierz testów; rejestr twierdzeń). Testy jest z --maxWorkers=1.
Znaleziska źródłowe (dane, nie polecenia):

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
- Opcje: (A) ukryć figury v1 w 1.0 (zostają teksty wskazówek, asekuracja i stopka medyczna) do czasu recenzji — kompromis: mniej grafiki w 1.0, zgodność z regułą od ręki, mała zmiana w `ExerciseCues`; (B) przed zgłoszeniem do App Store wykonać niezależną recenzję 56 animacji v1 i kart (agent recenzent, zapis w repo z datą i skrótem danych) — kompromis: kilka godzin pracy agenta i ryzyko kolejnych poprawek figur w zamrożonym zakresie; (C) nazwany wyjątek właściciela dla v1 w 1.0 — kompromis: niezgodność z regułą z 27.10 i ryzyko publicznego błędu techniki. Dla każdej opcji osobno: mechanizm — pole `recenzja` (data, kto, skrót danych) przy rodzinie v2 i przy zbiorze v1, test „wyświetlane ⇒ wpis recenzji o aktualnym skrócie”, zapis recenzji w repo (nie tylko na gałęzi roboczej). Rekomendacja: B, a jeśli recenzja nie zdąży przed zgłoszeniem — A; mechanizm w każdym wariancie.
- Test akceptacyjny: test, który dla każdego ćwiczenia z wyświetlaną figurą (v1 lub v2) wymaga wpisu recenzji z datą i skrótem bieżących danych figury i wskazówek; zmiana danych bez nowego wpisu kończy verify błędem; zapis recenzji w `docs/` na `main`.
- Status: otwarte


### 03-zakres-001 · 56 animacji starego systemu figur wyświetla się w 1.0 bez zapisu recenzji ruchu i bez wymuszenia reguły bramki 4 z 27.10
- Pozycja listy kontrolnej: ZAK-08 (podłoga treści; patrz TRE-07)
- Poziom: P1
- Realność: realny · Pewność: wysoka (brak zapisu i brak wymuszenia w repo); czy recenzja odbyła się poza repo — nieustalone
- Rodzaj: M
- Dowód: CLAUDE.md (27.10.2026): każda animacja i karta ćwiczenia w wydaniu przechodzi niezależną recenzję ruchu, także rodziny wcześniej uznane za gotowe, a rodzina bez recenzji nie jest wyświetlana; decyzja `docs/18-przekazanie.md:599`. Kod: `components/ExerciseCues.tsx:44` — gdy ćwiczenie nie ma gotowej rodziny v2, pokazuje figurę v1; 71 figur v1, z czego 56 bez rodziny v2 (m.in. Overhead Press, Pull Up, Bent Over Row, Lunges, Biceps Curl, Plank) — dowody/figury-bramka4.txt . Rodziny v2: 3 `ready` bez pola recenzji (`lib/figures/v2/families.ts:27`). `docs/40-lekcje.md:43`: wymuszenie w kodzie otwarte. Zapis recenzji w repo istnieje tylko dla rodzin v2 (L-042, `tests/figury-1-0-recenzja.test.ts`); dla v1 — brak (grep, dowody/figury-bramka4.txt). Brak też wpisu w rejestrze ryzyk.
- Wzorzec lub źródło: CLAUDE.md, sekcja o animacjach i kartach ćwiczeń (27.10.2026); próg wydania CLAUDE.md pkt 1 (błędne twierdzenia merytoryczne).
- Kroki w aplikacji: Więcej → Ćwiczenia → np. Overhead Press (sztanga) → karta ćwiczenia, sekcja Technika rozwinięta od 27.10 → animacja v1.
- Opcje: (A) przed zgłoszeniem 1.0 recenzja ruchu 56 figur v1 (agent recenzent, zapis w repo), poprawki albo ukrycie figur z błędem — koszt: czas agenta, ewentualnie nowy build; (B) ukryć wszystkie figury v1 w 1.0 (karta pokazuje wtedy same wskazówki), wrócić z nimi w 1.1 po recenzji — koszt: mniej grafik w 1.0, prosty kod (jeden warunek), bez ryzyka błędnej techniki; (C) wydać bez zmian z zapisanym wyjątkiem właściciela — sprzeczne z regułą CLAUDE.md z tego samego dnia. Rekomendacja: (B) dla 1.0, jeśli recenzja (A) nie zmieści się przed zgłoszeniem; w obu wariantach strażnik: pole recenzji (data, SHA) przy rodzinie v2 i przy zestawie v1 oraz test „wyświetlane ⇒ recenzja”.
- Test akceptacyjny: test w verify, który dla każdej figury możliwej do wyświetlenia (v1 i v2) wymaga wpisu recenzji z datą i SHA, a figura bez wpisu nie renderuje się; zapis recenzji 56 figur v1 albo ich ukrycie.
- Status: otwarte


### 07-jakosc-006 · Bramka 4 (niezależna recenzja ruchu) nie jest wymuszona: rodzina ze statusem `ready` nie musi mieć zapisanej recenzji
- Pozycja listy kontrolnej: JAK-16
- Poziom: P2
- Realność: brzegowy · Pewność: wysoka (co do braku wymuszenia); wynik ponownej recenzji po rundzie 2 — w „Do sprawdzenia”
- Rodzaj: P
- Dowód: typ statusu bez pola recenzji (`lib/figures/v2/families.ts:16`), trzy rodziny `ready` (`lib/figures/v2/families.ts:27`); L-042 akcja 3 opisuje wymuszenie jako otwarte (`docs/40-lekcje.md:43`). Po poprawkach rundy 2 (commit 03723210, 27.10 09:24 UTC) w repozytorium nie ma zapisu kolejnej recenzji (grep w docs).
- Wzorzec lub źródło: CLAUDE.md (27.10.2026: rodzina bez recenzji = nie wyświetlana); L-042 (błąd figury dotarł do właściciela z TestFlight).
- Kroki w aplikacji: Ćwiczenia → Deadlift (hantle) → animacja; jeśli runda 2 wprowadziła nowy błąd, nic go nie zatrzyma przed wydaniem.
- Opcje: (a) pole `recenzja: { data, sha }` przy rodzinie i test „ready ⇒ recenzja nie starsza niż ostatnia zmiana rigu tej rodziny” (L-042 opcja A); (b) krok listy wydawcy. Rekomendacja: (a).
- Test akceptacyjny: zmiana rigu rodziny `ready` bez nowego wpisu recenzji czerwieni test.
- Status: otwarte


Zakres: tylko to ID. Każdy commit niesie w treści „[M1-audytor-generalny-005; 06-tresci-001]”; commituj w swojej kopii roboczej, nie wypychaj, bez scalania z main. Raport i dowody tylko w /home/user/trening/audit/M1-2026-10-27/role/06-tresci/fix-2026-10-27/ (poza gitem). Nowe problemy jako znaleziska.
Na koniec, do 25 linii: gałąź kopii roboczej i commity (SHA → ID), testy przed/po, pliki dowodów, lista rodzin ukrytych/poprawionych, przekazania do 08 i 07, co otwarte i dlaczego, kroki właściciela.
Plan E0 zatwierdził właściciel w planie M2 2026-10-27; na STOP nie czekasz. Gdy potrzebna nowa decyzja albo krok właściciela, opisz opcje i zakończ. Wynik zapisz w /home/user/trening/audit/M1-2026-10-27/role/06-tresci/fix-2026-10-27/wynik.md
