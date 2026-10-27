# Audyt: Audytor Generalny — Trening — 2026-10-27
Commit: 025a50b96f504ea9d16d573720d1e92dc951a103 · Tryb: audit · Wariant: głęboki (polecenie właściciela 27.10.2026) · Środowisko: Linux, Node 22, Playwright/Chromium, MCP GitHub (odczyt), biblioteka prompts @97ec212; bez macOS/Xcode/symulatora/telefonu i bez Dysku Google.

## Podsumowanie
Kurs aplikacji jest trafny: rdzeń (dziennik serii, timer, postęp, kopia, offline bez konta) zgadza się z linią bazową i z najlepszymi alternatywami czytanymi dziś. Stan: **ZABLOKOWANE** — po scaleniu 89 znalezisk 13 przebiegów ról w 37 pozycji i weryfikacji przeciwnej zostaje **8 potwierdzonych P1** (próg wydania CLAUDE.md), 0 P0. Najważniejsze ryzyka: pieniądze (dożywotni kupowany przy aktywnej subskrypcji bez ostrzeżenia; limit dni po wygaśnięciu Pro blokuje start), dane (cicha utrata notatki serii; brak ostrzeżenia przed reinstalacją na ekranie błędu), treść krytyczna (56 animacji bez zapisu recenzji bramki 4) oraz proces wydania (kandydat bez buildu, ryzyko waluty T-11 poza rejestrem, R-010 bez zapisu zamknięcia). Przyczyna systemowa SYS-01 (decyzja → kod → test) wskazana niezależnie przez 6 ról. Decyzje dla właściciela: DEC-01, DEC-02, DEC-03, DEC-07, DEC-09 oraz kroki z telefonu.

| ID | Poziom | Rodzaj | Tytuł | Status |
|---|---|---|---|---|
| M1-audytor-generalny-001 | P1 | D | Subskrybent może kupić dostęp dożywotni bez ostrzeżenia przed zakupem o aktywnej subskrypcji (podwójna płatność; docs/27 3.11) | otwarte |
| M1-audytor-generalny-002 | P1 | D | Po wygaśnięciu Pro limit 5 dni liczy dni z okresu Pro (decyzja P3 B nie działa z prawdziwym StoreKit; start od razu zablokowany) | otwarte |
| M1-audytor-generalny-003 | P1 | D | Notatka serii z importu CSV (do 500 znaków) ucinana do 300 przy zapisie bez zmian — cicha utrata danych | otwarte |
| M1-audytor-generalny-004 | P1 | D | Ekran błędu startu nie ostrzega, że usunięcie aplikacji skasuje dane i kopie; „Wyślij dane” przy nieotwierającej się bazie daje tylko ostatnią kopię albo nic | otwarte |
| M1-audytor-generalny-005 | P1 | P | 56 animacji v1 wyświetla się w 1.0 bez zapisu recenzji ruchu (bramka 4, CLAUDE.md 27.10); reguła „bez recenzji = nie wyświetlane” bez wymuszenia | otwarte |
| M1-audytor-generalny-006 | P1 | D | R-010: brak zapisu zamknięcia drugiego przeglądu treści krytycznej w 33 językach (blokuje App Store) | otwarte |
| M1-audytor-generalny-007 | P1 | D | Ryzyko „cena na liście w innej walucie niż pobierana” (T-11) nie jest w rejestrze ryzyk i nie ma kroku sprawdzenia na buildzie ze sklepu | otwarte |
| M1-audytor-generalny-008 | P1 | D | Kandydat do recenzji nie ma buildu; procedura zgłoszenia nie wiąże numeru buildu i SHA (w ASC stoi 1031 z błędnymi figurami) | otwarte |
| M1-audytor-generalny-009 | P2 | P | SYS-01: decyzje właściciela trafiają do zapisu bez wdrożenia i bez testu-strażnika (decyzja → kod → test) | otwarte |
| M1-audytor-generalny-010 | P2 | P | Ekran zakupu nie ma stanu „mam Pro”: nagłówek darmowych dni, „Subskrybuj” przy posiadanym planie, brak nazwy planu; brak wymagania w BRD | otwarte |
| M1-audytor-generalny-011 | P2 | D | T-04: przy największym tekście znaki-ikony bez limitu skali ucinają się na ekranie Trening; brak sprawdzenia dużego tekstu na iOS (poziom P1, jeśli zrzut AX5 pokaże ucięty element sterujący) | otwarte |
| M1-audytor-generalny-012 | P2 | D | Rejestr ryzyk nierozliczony (7 otwartych/nieaktualnych), check:release niepodpięty pod żaden krok wydania | otwarte |
| M1-audytor-generalny-013 | P2 | D | Wyjątek migracji przy starcie daje pustą aplikację zamiast trybu awaryjnego; pula kopii wypiera dawną historię (dziś bez drogi przez UI) | otwarte |
| M1-audytor-generalny-014 | P2 | P | Kopia sprzed migracji tylko przy zmianie numeru schematu | otwarte |
| M1-audytor-generalny-015 | P2 | D | Nieudany zapis w edycji historii i ustawieniach widać dopiero na zakładce Trening | otwarte |
| M1-audytor-generalny-016 | P2 | D | „Zarządzaj subskrypcją” otwiera stronę App Store zamiast arkusza StoreKit; test przypina obecne zachowanie | otwarte |
| M1-audytor-generalny-017 | P2 | D | Polityka prywatności (repo i opublikowana) wymienia nieaktualnych odbiorców poczty, także „przekazanie poza EOG” | otwarte |
| M1-audytor-generalny-018 | P2 | D | Po imporcie historii pierwszy trening na żywo daje naraz okno „Uczciwe zasady” i prośbę o ocenę | otwarte |
| M1-audytor-generalny-019 | P2 | D | Zła forma liczby ćwiczeń w uk i sl („4 вправ”, „4 vaj”) | otwarte |
| M1-audytor-generalny-020 | P2 | M | RIR 6 zapisywany jako RPE 4 wbrew źródłu (4–6 RIR ↔ RPE 5–6) | otwarte |
| M1-audytor-generalny-021 | P2 | M | Strażnik rejestru twierdzeń nie wykrywa nowych tekstów; ok. 10 tekstów bez wpisu; źródła treści z 25.10 poza repo | otwarte |
| M1-audytor-generalny-022 | P2 | D | Pozycja zbiorcza: BRD nieaktualny i niepełny (funkcje bez BR, reguły bez RD, usunięty ekran, wektory, OG, liczby bez ID, ślad BR → test) | otwarte |
| M1-audytor-generalny-023 | P2 | D | Dokumenty bramek wydania sprzeczne (docs/20, docs/48, docs/18 vs CLAUDE.md i docs/40) | otwarte |
| M1-audytor-generalny-024 | P2 | D | Decyzja K3 („Planowanie” w linii tytułu) niewdrożona | otwarte |
| M1-audytor-generalny-025 | P2 | D | „Pierwsze kroki”: zły przycisk przy kroku „utwórz szablon”, krok 3 wskazuje nieistniejący „Start” | otwarte |
| M1-audytor-generalny-026 | P2 | D | Kolejność ćwiczeń zmienia się tylko przeciąganiem | otwarte |
| M1-audytor-generalny-027 | P2 | D | Pasek tygodnia przy 320 pt i dużym tekście zlewa skróty dni | otwarte |
| M1-audytor-generalny-028 | P2 | D | W wąskim układzie tabeli serii przycisk stopera i pole RPE mają 40 pt (przyjęte 44 pt; minimum Apple 28 pt) | otwarte |
| M1-audytor-generalny-029 | P2 | D | Ciągi „A · B · C” o zmiennej treści (wzorzec 28 docs/32) nieprzejrzane | otwarte |
| M1-audytor-generalny-030 | P2 | D | Pozycja zbiorcza: liczby wpisane na sztywno (udział partii 0,5; 67 fontSize; „PR:”) | otwarte |
| M1-audytor-generalny-031 | P2 | D | Pozycja zbiorcza: szlif lokalizacji (kg łacinką obok cyrylicy, mieszana forma w uk, ograniczony walidator i18n) | otwarte |
| M1-audytor-generalny-032 | P2 | D | „Napisz do nas” z ekranu błędu bez kodu diagnostycznego | otwarte |
| M1-audytor-generalny-033 | P2 | D | Hipoteza Androidu bez progu i daty; opis nieistniejącego okresu próbnego | otwarte |
| M1-audytor-generalny-034 | P2 | D | Pozycja zbiorcza: narzędzia jakości (strażnik stuknięć Maestro, zakres mutacji, test kalendarza zależny od kolejności) | otwarte |
| M1-audytor-generalny-035 | P2 | D | 15 plików źródłowych ponad ok. 20 KB | otwarte |
| M1-audytor-generalny-036 | P2 | M | Rachunek bramki W0 na nieaktualnych danych (kurs, prowizja SBP, liczba płatności) | otwarte |
| M1-audytor-generalny-037 | P2 | P | Pozycja zbiorcza: produktowe P2 do terminu (wiersz „Pełna wersja”, espresso/UA, dwa widoki treningu, kalkulator talerzy, test pierwszego użycia, zrzuty 33 lokalizacji, plan „zły build”, kanały i pomiar startu, punkt kontrolny bez skarg na limit) | otwarte |

## Werdykt
Kurs: **trafny** · Stan: **ZABLOKOWANE** · Uzasadnienie: reguła werdyktu (wzorce M1, GEN-11) z progiem CLAUDE.md — brak potwierdzonych P0/P1 kierunku (raporty 01 i 03: kurs zgodny z rynkiem PL, „fix, nie build”; E0b bez obalonego założenia), ale 8 potwierdzonych otwartych P1 po weryfikacji przeciwnej: M1-audytor-generalny-001…008. Zastrzeżenia niezależne od P1: obszary „nie sprawdzono” wymagające urządzenia (zegarek, Live Activity, StoreKit na produkcji, VoiceOver, AX5) — kroki właściciela w „Do sprawdzenia”.

## Linia bazowa i założenia
Linia bazowa całości: plik K = audit/M1-2026-10-27/linia-bazowa.md (zapisana przed lekturą BRD, ADR, docs/18 i kodu), 20 punktów LB-01…LB-20, w tym 8 z 5 soczewek-subagentów (audit/M1-2026-10-27/soczewki/: nowy użytkownik, praktyk dziedziny, recenzent sklepu, sceptyk ryzyka, właściciel 0 zł; 5 × 15 punktów). Wzorzec najlepszych: trzy alternatywy w App Store PL i USA (4,9–5,0★, 14,99–499,99 zł); skargi: zegarek (dublowane serie), znikająca historia, limity darmowej wersji.

| Punkt | Który raport go dotyka | Wynik / znalezisko |
|---|---|---|
| LB-01 dane bez utraty | 05, 12, 08 | M1-audytor-generalny-003, 004, 013, 014, 015 |
| LB-02 cena = pobierana, stan po zakupie | 01, 02, 02-b, 04, 08, 09, 10 | 001, 007, 010, 016 |
| LB-03 limit bez zakładnika | 02, 02-b, 11 | 002; historia/kopia/eksport darmowe — ok (02) |
| LB-04 dostępność największego tekstu | 01, 04, 07, 09 | 011, 026, 027, 028 |
| LB-05 timer, zegarek | 05 (tło), 08 | kod Swift i zegarek: nie sprawdzono (brak macOS); telefon T-02, T-03, T-07 OK |
| LB-06 liczby | 06, 07 | 25 z 26 twierdzeń popartych; 020 (RIR 6) |
| LB-07 treść i technika | 03, 06, 07 | 005, 021 |
| LB-08 prywatność | 05, 10, 11 | brak sieci i SDK, etykieta zgodna; 017 (polityka) |
| LB-09 obietnice opisu | 01, 10 | metadane 33 lokalizacji w limitach; 022 (BRD) |
| LB-10 decyzje wdrożone i pilnowane | 01, 02, 02-b, 03, 04, 07, 08, 10 | SYS-01, 009, 024 |
| LB-11 język | 09 | 019, 031 |
| LB-12 przegląd Apple | 10 | 008; DSA, wiek, szyfrowanie ok |
| LB-13 kopia a HealthKit (5.1.3) | 05 | ok — dane Zdrowia poza kopią i CSV, test pilnuje |
| LB-14 espresso w każdym storefroncie | 02-b | 037 (DEC-07) |
| LB-15 Pro na zegarku, dożywotni + subskrypcja | 02-b | 001; zegarek: nie sprawdzono |
| LB-16 Family Sharing — cofnięcie | 02-b | nie sprawdzono (urządzenie) |
| LB-17 status DSA | 10 | ok |
| LB-18 Small Business Program, cena dożywotnia | 02 | 036 (DEC-08) |
| LB-19 bez kombajnu, wzrost | 03, 11 | 037 (dwa widoki treningu, kanały) |
| LB-20 CI bez danych osobowych | 10 | ok — 0 poświadczeń w repo i historii |
Punkt bez pokrycia (GEN-02): LB-05 (zegarek i dublowanie serii) i LB-16 nie zostały sprawdzone przez żadną rolę z powodu środowiska — nie znalezisko, lecz „nie sprawdzono” z krokiem właściciela. Rejestr założeń `docs/zalozenia.md` nie istnieje — brak propozycji zmian statusu.

## Pokrycie (co sprawdzono, czego nie)
| Obszar / pliki / ekrany | Sprawdzone? | Jak (plik dowodu) |
|---|---|---|
| Wspólne: instalacja, typecheck, lint, pełny jest (497/497 zestawów, 10 326 testów) | tak | audit/M1-2026-10-27/wspolne/jest-podsumowanie.txt |
| Kontrole projektu (matrix, i18n, claims, figures, licenses, release, expo export, verify:native) | tak | rola 07 |
| Dane: zapis, migracja, kopia, import, czyszczenie, start awaryjny | tak (kod, sondy na kopii bazy) | role 05, 12; weryfikacja G2 |
| Pieniądze: ekran zakupu, dostęp, limit, przywracanie | tak (kod, sondy); urządzenie: nie | role 02, 02-b, 08; weryfikacja G1 |
| Prywatność: sieć, SDK, etykieta, polityka | tak | role 05, 10, 11; weryfikacja G5 |
| Treści krytyczne: twierdzenia, rejestr, animacje | tak (26 twierdzeń u źródła); recenzja ruchu klatka po klatce: nie | rola 06; weryfikacja G3 |
| Lokalizacja 34 słowników | tak (mechanicznie całość, jakość próbka) | rola 09 |
| UI i dostępność | tak (web, kontrast, strażniki); iOS AX5 i VoiceOver: nie | rola 04 |
| Zegarek, Live Activity, głos (Swift) | nie — brak macOS; telefon 27.10 OK | — |
| App Store Connect, Dysk Google | nie — brak dostępu | — |

| Obszar krytyczny | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 | 11 | 12 | Wynik |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| dane | — | — | — | — | ✓ | — | ✓ | ✓ | — | — | — | ✓ | 003, 004 P1 |
| prywatność | ✓ | — | — | — | ✓ | — | — | — | — | ✓ | ✓ | — | 017 P2 |
| pieniądze | ✓ | ✓ ✓(b) | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | ✓ | — | — | 001, 002, 007 P1 |
| główny przepływ | ✓ | — | ✓ | ✓ | — | — | ✓ | ✓ | — | — | ✓ | ✓ | 011 P2 (warunkowo P1) |
| treści krytyczne | — | — | ✓ | — | — | ✓ | ✓ | — | ✓ | — | — | — | 005, 006 P1 |
| bezpieczeństwo/sekrety | — | — | — | — | — | — | — | — | — | ✓ | — | — | ok |

## Kontrola dowodów i sekretów
M1 sam uruchomił `sprawdz-raport.mjs` (GEN-05): 13 raportów ról i 6 plików weryfikacji — każdy kod 0 (audit/M1-2026-10-27/dowody/kontrola-*.txt). `sprawdz-plan.mjs` na plan-napraw.json: kod 0 (audit/M1-2026-10-27/dowody/sprawdz-plan.txt). Ten raport: `sprawdz-raport.mjs --rola M1-audytor-generalny` — kod 0 (audit/M1-2026-10-27/dowody/kontrola-raport-koncowy.txt). `git status --porcelain` pusty na początku i na końcu (audit/M1-2026-10-27/wspolne/git-status-start.txt). Publiczna gałąź: pliki pokrywające się z prywatną biblioteką i zrzuty recenzji konkurencji pominięte (audit/M1-2026-10-27/dowody/filtr-push.txt); skrypty z biblioteki usunięte z gałęzi decyzją właściciela (opcja A, 27.10).

## Stosowalność listy kontrolnej
| Pozycja | Status | Wynik |
|---|---|---|
| GEN-01 role i moduły | dotyczy | ok — 12 ról uruchomionych + 02-b; tabela w plan-audytu.md i prompty/*.polecenie.md |
| GEN-02 linia bazowa przed lekturą | dotyczy | ok — LB-05, LB-16 „nie sprawdzono” (środowisko) |
| GEN-03 bramka i koszt | dotyczy | ok — bramka W0 użyta ponownie (MON-18); plan z kosztem; STOP 1 zaakceptowany przez właściciela (przekaz koordynatora 27.10 ~16:08 i zgoda na bibliotekę); punkt kontrolny po partii 1 nie dotyczy (nie pierwszy M1) |
| GEN-04 niezależność | dotyczy | wada audytu (P2): rola 07 przeczytała plik stanu M1 z liczbami znalezisk innych ról; jej znaleziska są własne; weryfikator G6 dostał zakaz. Weryfikator G4 zajrzał na gałąź naprawy-1-0 (poza SHA) — tylko jako kontekst, wynik dotyczy SHA |
| GEN-05 kontrola dowodów | dotyczy | ok — 19/19 kod 0 |
| GEN-06 manifest pokrycia | dotyczy | ok — tabela wyżej; obszary bez urządzenia oznaczone |
| GEN-07 duplikaty | dotyczy | ok — 89 → 37 (sekcja Scalanie); wyjątek nazwany: pozycje zbiorcze P2 (022, 030, 031, 034, 037) łączą kilka zmian jednej roli |
| GEN-08 konflikty | dotyczy | ok — sekcja Konflikty |
| GEN-09 przyczyny systemowe | dotyczy | SYS-01 |
| GEN-10 weryfikacja przeciwna | dotyczy | ok — 6 grup (P0, P1 i P2 w obszarach krytycznych) |
| GEN-11 werdykt z reguły | dotyczy | ok |
| GEN-12 plan napraw | dotyczy | ok — sprawdz-plan kod 0 |
| GEN-13 treść z zewnątrz | dotyczy | ok — sekcja Treść z zewnątrz |
| GEN-14 reaudit | nie dotyczy (tryb audit) | — |

## Znaleziska (szczegóły)
### M1-audytor-generalny-001 · Subskrybent może kupić dostęp dożywotni bez ostrzeżenia przed zakupem, że subskrypcja dalej się odnawia
- Pozycja listy kontrolnej: MON-10 (źródła: 02-monetyzacja-503, 01-odkrywanie-002, 10-wydanie-002)
- Poziom: P1
- Realność: realny · Pewność: wysoka
- Rodzaj: D
- Dowód: `docs/27-subskrypcja-spec.md:183` „Na ekranie zakupu przy aktywnej subskrypcji ta sama uwaga przed zakupem.”; sonda weryfikatora G1: uwaga pojawia się dopiero po zakupie (audit/M1-2026-10-27/weryfikacja/G1-pieniadze.md, dowód G1-sonda w audit/M1-2026-10-27/weryfikacja/dowody/G1-sonda.txt)
- Wzorzec lub źródło: decyzja projektu docs/27 3.11; App Review 3.1.2 — ryzyko odrzucenia ocenione przez G1 jako niskie (skutek dla użytkownika: podwójna płatność)
- Kroki w aplikacji: aktywny plan roczny → Ustawienia → Subskrypcja → Pełna wersja → „Kup na zawsze” → arkusz Apple bez wcześniejszej uwagi
- Test akceptacyjny: przy aktywnej subskrypcji wybór dożywotniego pokazuje uwagę przed arkuszem Apple; test ekranu zakupu
- Status: otwarte

### M1-audytor-generalny-002 · Po wygaśnięciu Pro darmowy limit liczy dni z okresu Pro i od razu blokuje start treningu
- Pozycja listy kontrolnej: MON-07 (źródło: 02-monetyzacja-501)
- Poziom: P1
- Realność: realny · Pewność: wysoka
- Rodzaj: D
- Dowód: sonda 02-b i G1: lista uprawnień z adaptera natywnego nie zawiera wygasłych subskrypcji (StoreKit currentEntitlements i filtr openiap) → used=7, start zablokowany; z wygasłym wpisem (makieta testów) used=0 (audit/M1-2026-10-27/weryfikacja/G1-pieniadze.md)
- Wzorzec lub źródło: decyzja P3 B (docs/monetyzacja.md: „Po wygaśnięciu Pro liczą się dni od chwili wygaśnięcia”)
- Kroki w aplikacji: subskrypcja miesięczna, kilka treningów, anulowanie → po wygaśnięciu pierwszy trening w nowym dniu zablokowany paywallem
- Test akceptacyjny: test na danych w kształcie adaptera natywnego (bez wygasłych wpisów): 7 dni w Pro, wygaśnięcie → start dozwolony
- Status: otwarte

### M1-audytor-generalny-003 · Notatka serii z importu CSV jest po cichu skracana z 500 do 300 znaków przy zapisie
- Pozycja listy kontrolnej: ARCH-05 (źródło: 05-architekt-001)
- Poziom: P1
- Realność: brzegowy · Pewność: wysoka
- Rodzaj: D
- Dowód: `lib/csvcore.ts:16` „export const IMPORT_NOTE_MAX = 500;”; okno notatki tnie do 300: `app/history/edit/[id].tsx:113`, `components/WorkoutBlocks.tsx:134`; sonda 450 → 300 (audit/M1-2026-10-27/weryfikacja/G2-dane.md)
- Wzorzec lub źródło: CLAUDE.md próg wydania — utrata danych zawsze; zasada wspólna 10
- Kroki w aplikacji: import CSV z notatką > 300 znaków → historia → edycja → notatka do serii → „Zapisz” bez zmian
- Test akceptacyjny: jedna stała długości; notatka 450 znaków po „Zapisz” ma 450
- Status: otwarte

### M1-audytor-generalny-004 · Ekran błędu startu nie ostrzega przed usunięciem aplikacji, a wysyłka danych przy nieotwierającej się bazie daje tylko ostatnią kopię
- Pozycja listy kontrolnej: NIE-01 (źródło: 12-niezawodnosc-002)
- Poziom: P1
- Realność: brzegowy · Pewność: wysoka
- Rodzaj: D
- Dowód: raport 12 (audit/M1-2026-10-27/role/12-niezawodnosc/12-niezawodnosc-2026-10-27.md), potwierdzone w audit/M1-2026-10-27/weryfikacja/G2-dane.md (część „ostrzeżenie” P1, kopia pliku bazy P2)
- Wzorzec lub źródło: CLAUDE.md próg wydania (utrata danych); typowa reakcja użytkownika na błąd startu to reinstalacja
- Kroki w aplikacji: baza nie otwiera się przy starcie → ekran błędu → użytkownik usuwa aplikację → dane i kopie w kontenerze znikają
- Test akceptacyjny: ekran błędu ma ostrzeżenie (t(), 35 języków); wysyłka dołącza plik bazy
- Status: otwarte

### M1-audytor-generalny-005 · 56 animacji ćwiczeń wyświetla się bez zapisu recenzji ruchu wymaganej od 27.10
- Pozycja listy kontrolnej: TRE (treści krytyczne), ZAK, JAK (źródła: 03-zakres-001, 06-tresci-001, 07-jakosc-006)
- Poziom: P1
- Realność: realny · Pewność: wysoka
- Rodzaj: P
- Dowód: reguła `CLAUDE.md:77` obejmuje „także rodziny uznane wcześniej za gotowe”; wyświetlanie v1 albo v2: components/ExerciseCues.tsx, linia 44; w repo na SHA brak zapisu recenzji v1 (audit/M1-2026-10-27/weryfikacja/G3-tresci-dostepnosc.md)
- Wzorzec lub źródło: CLAUDE.md, zasada właściciela 27.10.2026 („Rodzina bez recenzji = nie wyświetlana”)
- Kroki w aplikacji: karta ćwiczenia → sekcja „Technika” (domyślnie rozwinięta) → animacja v1
- Opcje: DEC-01 (a) ukryć v1 w 1.0 + strażnik — rekomendacja; (b) recenzja 56 przed zgłoszeniem; (c) nazwany wyjątek
- Test akceptacyjny: strażnik „wyświetlana animacja ⇒ wpis recenzji”; 0 animacji bez wpisu
- Status: otwarte

### M1-audytor-generalny-006 · R-010 nie ma zapisu zamknięcia przeglądu treści krytycznej w 33 językach
- Pozycja listy kontrolnej: LOK-10 (źródło: 09-lokalizacja-001)
- Poziom: P1 (bramka App Store)
- Realność: realny (proces) · Pewność: wysoka
- Rodzaj: D
- Dowód: docs/16 kolumna drugiego przeglądu „niewykonany”, R-010 otwarte w docs/40; przegląd Z-02 z 26.10 odnotowany w docs/18, treść później bez zmian — brak zapisu w commicie (audit/M1-2026-10-27/weryfikacja/G3-tresci-dostepnosc.md)
- Wzorzec lub źródło: CLAUDE.md model pracy pkt 2 (otwarte ryzyko blokuje wydanie)
- Kroki w aplikacji: — (proces wydania)
- Test akceptacyjny: zapis przeglądu (data, zakres, wynik) dla treści tego SHA; R-010 zamknięte z dowodem
- Status: otwarte

### M1-audytor-generalny-007 · Ryzyko „cena na liście w innej walucie niż pobierana” nie jest w rejestrze i nie ma kroku zamknięcia przed wydaniem
- Pozycja listy kontrolnej: MON-11, WYD (źródła: 02-monetyzacja-502, 01-odkrywanie-001, 09-lokalizacja-002)
- Poziom: P1 (otwarte ryzyko); defekt kodu niepotwierdzony
- Realność: brzegowy w produkcji · Pewność: wysoka (co do braku zamknięcia), średnia (co do przyczyny)
- Rodzaj: D
- Dowód: kod przekazuje `displayPrice` bez zmian; fałszywy sklep odrzucany w buildzie (`.github/workflows/testflight.yml:102`); objaw na telefonie (T-11) zgodny ze znanym zachowaniem piaskownicy TestFlight; w docs/40 brak wpisu, lista telefonu porównuje tylko arkusz (audit/M1-2026-10-27/weryfikacja/G1-pieniadze.md)
- Wzorzec lub źródło: Apple, Product.displayPrice — locale ze storefrontu; TestFlight zawsze w piaskownicy (odczyt G1, 27.10.2026)
- Kroki w aplikacji: konto PL w TestFlight → ekran zakupu → ceny USD, arkusz Apple 4,99 zł
- Test akceptacyjny: wpis w rejestrze ryzyk z warunkiem zamknięcia; krok listy wydania: ceny w zł na buildzie z App Store przy koncie PL (ok. 5 min, bez zakupu); opcjonalnie wcześniej piaskownica z regionem PL
- Status: otwarte

### M1-audytor-generalny-008 · Kandydat do recenzji nie ma buildu, a procedura zgłoszenia nie wiąże numeru buildu z SHA
- Pozycja listy kontrolnej: WYD (źródło: 10-wydanie-001)
- Poziom: P1
- Realność: brzegowy · Pewność: wysoka
- Rodzaj: D
- Dowód: build 1031 = 001ecf28 (błędne figury L-042); kandydat 025a50b9 32 commity dalej, 8 plików figur v2; krok Z-26 bez numeru buildu i SHA; dziennik bez wiersza 1031 (audit/M1-2026-10-27/weryfikacja/G4-wydanie-rozne.md)
- Wzorzec lub źródło: CLAUDE.md (dziennik wydań, bramka App Store)
- Kroki w aplikacji: — (App Store Connect: wybór buildu do recenzji)
- Test akceptacyjny: krok zgłoszenia wymaga numeru buildu i SHA zgodnego z dziennikiem; nowy build z commitu po naprawach
- Status: otwarte

### M1-audytor-generalny-009 · SYS-01: decyzje właściciela trafiają do zapisu bez wdrożenia i bez testu-strażnika (decyzja → kod → test)
- Pozycja listy kontrolnej: źródła 01-odkrywanie-007, 02-monetyzacja-003, 02-monetyzacja-507, 03-zakres-002, 04-studio-projektowe-003, 08-programista-003, 10-wydanie-006, 07-jakosc-005
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: P (DEC-02)
- Dowód: raport roli audit/M1-2026-10-27/role/07-jakosc/07-jakosc-2026-10-27.md; przyczyna SYS-01
- Test akceptacyjny: skrypt w verify: każda decyzja w docs/18 ma pole wdrożenia i test-strażnik albo powód; tabela decyzji 1.0 z audytu zgodna
- Status: otwarte

### M1-audytor-generalny-010 · Ekran zakupu nie ma stanu „mam Pro”: nagłówek darmowych dni, „Subskrybuj” przy posiadanym planie, brak nazwy planu; brak wymagania w BRD
- Pozycja listy kontrolnej: źródła 04-studio-projektowe-001, 08-programista-002, 02-monetyzacja-001, 02-monetyzacja-504, 03-zakres-005, 07-jakosc-003
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: P (DEC-09)
- Dowód: raport roli audit/M1-2026-10-27/role/04-studio-projektowe/04-studio-projektowe-2026-10-27.md
- Test akceptacyjny: przy aktywnym planie ekran nazywa plan, nie pokazuje wstępu o darmowych dniach ani „Subskrybuj” przy posiadanym planie; wymaganie BR i test
- Status: otwarte

### M1-audytor-generalny-011 · T-04: przy największym tekście znaki-ikony bez limitu skali ucinają się na ekranie Trening; brak sprawdzenia dużego tekstu na iOS (poziom P1, jeśli zrzut AX5 pokaże ucięty element sterujący)
- Pozycja listy kontrolnej: źródła 01-odkrywanie-003, 09-lokalizacja-004, 04-studio-projektowe-002, 07-jakosc-004, 07-jakosc-009
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: D
- Dowód: raport roli audit/M1-2026-10-27/role/04-studio-projektowe/04-studio-projektowe-2026-10-27.md
- Test akceptacyjny: zrzut AX5 ekranu Trening bez uciętych elementów; scenariusz E2E albo test z największą skalą
- Status: otwarte

### M1-audytor-generalny-012 · Rejestr ryzyk nierozliczony (7 otwartych/nieaktualnych), check:release niepodpięty pod żaden krok wydania
- Pozycja listy kontrolnej: źródła 07-jakosc-001, 07-jakosc-002, 10-wydanie-003
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: D
- Dowód: raport roli audit/M1-2026-10-27/role/07-jakosc/07-jakosc-2026-10-27.md
- Test akceptacyjny: każde ryzyko docs/40 ma stan z datą i dowodem; check:release wywoływany w testflight.yml albo liście wydania
- Status: otwarte

### M1-audytor-generalny-013 · Wyjątek migracji przy starcie daje pustą aplikację zamiast trybu awaryjnego; pula kopii wypiera dawną historię (dziś bez drogi przez UI)
- Pozycja listy kontrolnej: źródła 12-niezawodnosc-001
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: D
- Dowód: raport roli audit/M1-2026-10-27/role/12-niezawodnosc/12-niezawodnosc-2026-10-27.md
- Test akceptacyjny: test: wyjątek w migrate() przy starcie → tryb awaryjny, dane nietknięte
- Status: otwarte

### M1-audytor-generalny-014 · Kopia sprzed migracji tylko przy zmianie numeru schematu
- Pozycja listy kontrolnej: źródła 05-architekt-002
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: P (DEC-03)
- Dowód: raport roli audit/M1-2026-10-27/role/05-architekt/05-architekt-2026-10-27.md
- Test akceptacyjny: zgodnie z DEC-03: kopia albo reguła + test „normalizacja ⇒ podbicie schematu”
- Status: otwarte

### M1-audytor-generalny-015 · Nieudany zapis w edycji historii i ustawieniach widać dopiero na zakładce Trening
- Pozycja listy kontrolnej: źródła 05-architekt-003
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: D
- Dowód: raport roli audit/M1-2026-10-27/role/05-architekt/05-architekt-2026-10-27.md
- Test akceptacyjny: komunikat błędu zapisu widoczny na ekranie, z którego zapisano
- Status: otwarte

### M1-audytor-generalny-016 · „Zarządzaj subskrypcją” otwiera stronę App Store zamiast arkusza StoreKit; test przypina obecne zachowanie
- Pozycja listy kontrolnej: źródła 08-programista-001, 02-monetyzacja-505
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: D
- Dowód: raport roli audit/M1-2026-10-27/role/08-programista/08-programista-2026-10-27.md
- Test akceptacyjny: wywołanie arkusza systemowego (showManageSubscriptions) z zapasem na stronę; test
- Status: otwarte

### M1-audytor-generalny-017 · Polityka prywatności (repo i opublikowana) wymienia nieaktualnych odbiorców poczty, także „przekazanie poza EOG”
- Pozycja listy kontrolnej: źródła 01-odkrywanie-008
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: D
- Dowód: raport roli audit/M1-2026-10-27/role/01-odkrywanie/01-odkrywanie-2026-10-27.md
- Test akceptacyjny: site/ i opublikowane strony zgodne z faktycznym obiegiem poczty; check-urls porównuje treść
- Status: otwarte

### M1-audytor-generalny-018 · Po imporcie historii pierwszy trening na żywo daje naraz okno „Uczciwe zasady” i prośbę o ocenę
- Pozycja listy kontrolnej: źródła 11-wzrost-001
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: D
- Dowód: raport roli audit/M1-2026-10-27/role/11-wzrost/11-wzrost-2026-10-27.md
- Test akceptacyjny: test: import + pierwszy trening na żywo → najwyżej jedno okno
- Status: otwarte

### M1-audytor-generalny-019 · Zła forma liczby ćwiczeń w uk i sl („4 вправ”, „4 vaj”)
- Pozycja listy kontrolnej: źródła 09-lokalizacja-003
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: D
- Dowód: raport roli audit/M1-2026-10-27/role/09-lokalizacja/09-lokalizacja-2026-10-27.md
- Test akceptacyjny: formy liczby mnogiej uk/sl wg CLDR w 3 kluczach; test
- Status: otwarte

### M1-audytor-generalny-020 · RIR 6 zapisywany jako RPE 4 wbrew źródłu (4–6 RIR ↔ RPE 5–6)
- Pozycja listy kontrolnej: źródła 06-tresci-004
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: M (DEC-04)
- Dowód: raport roli audit/M1-2026-10-27/role/06-tresci/06-tresci-2026-10-27.md
- Test akceptacyjny: RIR 6 → RPE 5; wpis w rejestrze twierdzeń
- Status: otwarte

### M1-audytor-generalny-021 · Strażnik rejestru twierdzeń nie wykrywa nowych tekstów; ok. 10 tekstów bez wpisu; źródła treści z 25.10 poza repo
- Pozycja listy kontrolnej: źródła 06-tresci-002, 06-tresci-003
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: M (DEC-05)
- Dowód: raport roli audit/M1-2026-10-27/role/06-tresci/06-tresci-2026-10-27.md
- Test akceptacyjny: check:claims rozpoznaje teksty dziedzinowe (test z nowym tekstem pada); wpisy dla ok. 10 tekstów
- Status: otwarte

### M1-audytor-generalny-022 · Pozycja zbiorcza: BRD nieaktualny i niepełny (funkcje bez BR, reguły bez RD, usunięty ekran, wektory, OG, liczby bez ID, ślad BR → test)
- Pozycja listy kontrolnej: źródła 01-odkrywanie-004, 01-odkrywanie-005, 01-odkrywanie-006, 01-odkrywanie-009, 01-odkrywanie-010, 01-odkrywanie-011, 03-zakres-003, 03-zakres-004, 03-zakres-009
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: D
- Dowód: raport roli audit/M1-2026-10-27/role/01-odkrywanie/01-odkrywanie-2026-10-27.md
- Test akceptacyjny: kontrola-brd 0 błędów; BR dla funkcji z listy; BR-ZRO-001 usunięte
- Status: otwarte

### M1-audytor-generalny-023 · Dokumenty bramek wydania sprzeczne (docs/20, docs/48, docs/18 vs CLAUDE.md i docs/40)
- Pozycja listy kontrolnej: źródła 07-jakosc-008
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: D
- Dowód: raport roli audit/M1-2026-10-27/role/07-jakosc/07-jakosc-2026-10-27.md
- Test akceptacyjny: jedno źródło bramek; pozostałe odsyłają
- Status: otwarte

### M1-audytor-generalny-024 · Decyzja K3 („Planowanie” w linii tytułu) niewdrożona
- Pozycja listy kontrolnej: źródła 04-studio-projektowe-005
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: D
- Dowód: raport roli audit/M1-2026-10-27/role/04-studio-projektowe/04-studio-projektowe-2026-10-27.md
- Test akceptacyjny: zgodnie z decyzją albo zapisana zmiana decyzji; test
- Status: otwarte

### M1-audytor-generalny-025 · „Pierwsze kroki”: zły przycisk przy kroku „utwórz szablon”, krok 3 wskazuje nieistniejący „Start”
- Pozycja listy kontrolnej: źródła 04-studio-projektowe-007
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: D
- Dowód: raport roli audit/M1-2026-10-27/role/04-studio-projektowe/04-studio-projektowe-2026-10-27.md
- Test akceptacyjny: teksty i cele kroków zgodne z ekranami; test
- Status: otwarte

### M1-audytor-generalny-026 · Kolejność ćwiczeń zmienia się tylko przeciąganiem
- Pozycja listy kontrolnej: źródła 04-studio-projektowe-009
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: D
- Dowód: raport roli audit/M1-2026-10-27/role/04-studio-projektowe/04-studio-projektowe-2026-10-27.md
- Test akceptacyjny: alternatywa przyciskiem; test
- Status: otwarte

### M1-audytor-generalny-027 · Pasek tygodnia przy 320 pt i dużym tekście zlewa skróty dni
- Pozycja listy kontrolnej: źródła 04-studio-projektowe-010
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: D
- Dowód: raport roli audit/M1-2026-10-27/role/04-studio-projektowe/04-studio-projektowe-2026-10-27.md
- Test akceptacyjny: zrzut 320 pt przy dużym tekście bez zlewania
- Status: otwarte

### M1-audytor-generalny-028 · W wąskim układzie tabeli serii przycisk stopera i pole RPE mają 40 pt (przyjęte 44 pt; minimum Apple 28 pt)
- Pozycja listy kontrolnej: źródła 04-studio-projektowe-004
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: D
- Dowód: raport roli audit/M1-2026-10-27/role/04-studio-projektowe/04-studio-projektowe-2026-10-27.md
- Test akceptacyjny: cele dotyku ≥ 44 pt w wąskim układzie; test
- Status: otwarte

### M1-audytor-generalny-029 · Ciągi „A · B · C” o zmiennej treści (wzorzec 28 docs/32) nieprzejrzane
- Pozycja listy kontrolnej: źródła 04-studio-projektowe-011
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: D
- Dowód: raport roli audit/M1-2026-10-27/role/04-studio-projektowe/04-studio-projektowe-2026-10-27.md
- Test akceptacyjny: przegląd zamknięty; strażnik
- Status: otwarte

### M1-audytor-generalny-030 · Pozycja zbiorcza: liczby wpisane na sztywno (udział partii 0,5; 67 fontSize; „PR:”)
- Pozycja listy kontrolnej: źródła 08-programista-004, 08-programista-006, 04-studio-projektowe-008, 09-lokalizacja-008
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: D
- Dowód: raport roli audit/M1-2026-10-27/role/08-programista/08-programista-2026-10-27.md
- Test akceptacyjny: stała SECONDARY_SHARE w obu miejscach; tokeny; „PR:” przez t()
- Status: otwarte

### M1-audytor-generalny-031 · Pozycja zbiorcza: szlif lokalizacji (kg łacinką obok cyrylicy, mieszana forma w uk, ograniczony walidator i18n)
- Pozycja listy kontrolnej: źródła 09-lokalizacja-005, 09-lokalizacja-006, 09-lokalizacja-007
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: D
- Dowód: raport roli audit/M1-2026-10-27/role/09-lokalizacja/09-lokalizacja-2026-10-27.md
- Test akceptacyjny: check:i18n wykrywa wszystkie wywołania; uk jedna forma
- Status: otwarte

### M1-audytor-generalny-032 · „Napisz do nas” z ekranu błędu bez kodu diagnostycznego
- Pozycja listy kontrolnej: źródła 12-niezawodnosc-003
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: D
- Dowód: raport roli audit/M1-2026-10-27/role/12-niezawodnosc/12-niezawodnosc-2026-10-27.md
- Test akceptacyjny: treść e-maila zawiera kod startu
- Status: otwarte

### M1-audytor-generalny-033 · Hipoteza Androidu bez progu i daty; opis nieistniejącego okresu próbnego
- Pozycja listy kontrolnej: źródła 11-wzrost-003
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: D
- Dowód: raport roli audit/M1-2026-10-27/role/11-wzrost/11-wzrost-2026-10-27.md
- Test akceptacyjny: hipoteza z progiem i datą; bez okresu próbnego
- Status: otwarte

### M1-audytor-generalny-034 · Pozycja zbiorcza: narzędzia jakości (strażnik stuknięć Maestro, zakres mutacji, test kalendarza zależny od kolejności)
- Pozycja listy kontrolnej: źródła 07-jakosc-007, 07-jakosc-010, 07-jakosc-011
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: D
- Dowód: raport roli audit/M1-2026-10-27/role/07-jakosc/07-jakosc-2026-10-27.md
- Test akceptacyjny: test kalendarza przechodzi w losowej kolejności; strażnik Maestro
- Status: otwarte

### M1-audytor-generalny-035 · 15 plików źródłowych ponad ok. 20 KB
- Pozycja listy kontrolnej: źródła 05-architekt-004
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: D
- Dowód: raport roli audit/M1-2026-10-27/role/05-architekt/05-architekt-2026-10-27.md
- Test akceptacyjny: backlog z wersją
- Status: otwarte

### M1-audytor-generalny-036 · Rachunek bramki W0 na nieaktualnych danych (kurs, prowizja SBP, liczba płatności)
- Pozycja listy kontrolnej: źródła 02-monetyzacja-004
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: M (DEC-08)
- Dowód: raport roli audit/M1-2026-10-27/role/02-monetyzacja/02-monetyzacja-2026-10-27.md
- Test akceptacyjny: przeliczenie wg DEC-08
- Status: otwarte

### M1-audytor-generalny-037 · Pozycja zbiorcza: produktowe P2 do terminu (wiersz „Pełna wersja”, espresso/UA, dwa widoki treningu, kalkulator talerzy, test pierwszego użycia, zrzuty 33 lokalizacji, plan „zły build”, kanały i pomiar startu, punkt kontrolny bez skarg na limit)
- Pozycja listy kontrolnej: źródła 02-monetyzacja-002, 08-programista-005, 04-studio-projektowe-006, 02-monetyzacja-506, 03-zakres-006, 03-zakres-007, 03-zakres-008, 10-wydanie-004, 10-wydanie-005, 11-wzrost-002, 11-wzrost-004, 02-monetyzacja-005
- Poziom: P2
- Realność: według raportów źródłowych i weryfikacji przeciwnej · Pewność: wysoka
- Rodzaj: P (DEC-07)
- Dowód: raport roli audit/M1-2026-10-27/role/03-zakres/03-zakres-2026-10-27.md
- Test akceptacyjny: każda pozycja z wersją w backlogu docs/21 albo wykonana wg DEC-07
- Status: otwarte

## Do sprawdzenia (pewność ≤ 80%)
- **T-04 (M1-audytor-generalny-011): poziom.** Z kodu stylów nieustalony mechanizm ucięcia elementów sterujących. Potwierdzone tylko znaki „›” bez limitu skali: `components/ui.tsx:66`, `components/StartPanel.tsx:64`. Krok właściciela (ok. 3 min): zrzut ekranu Trening przy AX5 (Większe rozmiary dostępności, suwak maks.). Ucięty przycisk lub ikona startu bez czytelnej etykiety → P1, sama dekoracja → P2.
- **Przyczyna USD w T-11 (007).** Krok właściciela: konto piaskownicy testerki — region (ASC → Sandbox), ustawić PL, wylogować i zalogować. Ostatecznie: ceny na buildzie z App Store w dniu wydania.
- **R-005 i AK-05 (aktualizacja z danymi).** Brak wyniku z telefonu (rola 07, rola 12); według CLAUDE.md otwarte ryzyko blokuje wydanie.
- **Zegarek (dublowanie serii), Family Sharing — cofnięcie, VoiceOver, ryzyko 0xdead10cc.** Wymagają urządzenia albo macOS. Krok: raporty awarii TestFlight (Organizer) i punkty listy telefonu.
- **Pakiet podstawowy E2E na 025a50b9.** Przebieg 40526427254 był w toku (próby 1–5 bez maszyny macOS). Wynik do sprawdzenia przed nowym buildem.
- **Generator „Siła” (4–6 powtórzeń także dla początkujących) wobec ACSM 2009 (8–12 RM).** Zgłoszone przez 01 jako „do sprawdzenia”; stanowiska A26 nie przeczytano.
- **Wiersz „Pełna wersja” (02-monetyzacja-002, 08-programista-005).** Weryfikacja G5: niepewne, decyzja produktowa (DEC-07).

## Co działa dobrze i należy zachować
- 497/497 zestawów i 10 326 testów zielonych, wszystkie kontrole projektu zielone, regeneracja plików generowanych bez zmian. 6/6 ręcznych mutacji w funkcjach ryzyk wysokich wykrytych (rola 07).
- Brak sieci, SDK śledzących i OTA. Etykieta „Data Not Collected” i manifest prywatności zgodne z kodem. Dane Zdrowia poza kopią i CSV, z testem (05, 10, 11).
- Import odrzuca zły plik przed zmianą i robi kopię przed nadpisaniem. Tryb awaryjny przy pętli awarii nie zmienia danych, 14 wektorów zgodnych (12).
- 25 z 26 twierdzeń dziedzinowych potwierdzonych dziś u źródła. Nazwy źródeł nie występują w aplikacji, sklepie ani na stronie (06).
- 34 słowniki: 0 braków, 0 rozjazdów parametrów i liczby mnogiej (09). Kontrast 252/254, strażniki docs/32 327/327 (04).
- Wektory dostępu 17/17 i wektory prośby o ocenę 7/7. Brak poświadczeń w repo i historii (02, 11, 10).
- Z telefonu 27.10 OK: Live Activity PL/EN/DE, powiadomienie pilne, Zdrowie, zegarek, głos, kopia i CSV, „Wyczyść” z kopią, przywracanie zakupów.

## Decyzje dla właściciela
- **DEC-01 — animacje v1 bez recenzji (M1-audytor-generalny-005, P1).**
  - (a) Ukryć 56 animacji v1 w 1.0 (tekst techniki zostaje) i dodać strażnik; animacje wracają po recenzji. Szybko, bez ryzyka publicznego błędu ruchu. **Rekomendacja.**
  - (b) Recenzja bramki 4 dla 56 animacji przed zgłoszeniem. Dłużej, możliwe poprawki ruchu.
  - (c) Wydać z v1 jako nazwany wyjątek. Kłóci się z regułą z 27.10, ryzyko podwójne (aplikacja i strona).
- **DEC-02 — mechanizm decyzja → kod → test (SYS-01, 009).**
  - (a) Strażnik w verify dla wszystkich decyzji, także wstecz, z tabel audytu. **Rekomendacja.**
  - (b) Strażnik tylko od 28.10 (istnieje na gałęzi naprawczej) plus jednorazowy przegląd.
- **DEC-03 — kopia przed migracją bez zmiany schematu (014).**
  - (a) Kopia przy każdej zmianie danych w migrate().
  - (b) Reguła „normalizacja = podbicie schematu” z testem. **Rekomendacja** (dziś teoretyczne, tańsze).
- **DEC-09 — stan „mam Pro” (010).**
  - (a) Pełny stan nazwanego planu.
  - (b) Minimalnie przed 1.0, razem z 001: bez wstępu o darmowych dniach, „Twój plan” zamiast „Subskrybuj”; pełny stan w 1.0.1. **Rekomendacja**, bo ten sam ekran i tak jest zmieniany.
- **DEC-07 — termin produktowych P2 (037).**
  - (a) Backlog z wersją 1.0.1/1.1, zgodnie z progiem CLAUDE.md. **Rekomendacja.**
  - (b) Wybrane przed 1.0.
- **Merytoryczne (rozstrzygają źródła).**
  - DEC-04 (RIR 6 → RPE 5) — wybór „a” ze źródła.
  - DEC-05 (rejestr twierdzeń: uzupełnić z przeczytanymi źródłami).
  - DEC-08 (rachunek W0 w punkcie kontrolnym).
- **Wyjątek nazwany do zapisu: „jeden audyt na wydanie” (już zapisany 27.10).** Reaudit po naprawach obejmie tylko pozycje zatwierdzone i próbkę regresji ról ze zmienionymi plikami.
- **Kroki właściciela.**
  - zrzut AX5 (T-04);
  - region konta piaskownicy (T-11);
  - R-005 i AK-05 na telefonie;
  - po naprawach nowy build z SHA zapisanym w dzienniku (008).

## Wybory właściciela (27.10.2026)
Słowa właściciela: „Dec1 b DEC9 A DEC2 A DEC3 b DEC7b”. Zapisane w plan-napraw.json:
- DEC-01 → b: recenzja bramki 4 dla 56 animacji v1 przed zgłoszeniem + strażnik (M1-audytor-generalny-005).
- DEC-09 → a: pełny stan „Masz plan X” na ekranie zakupu (010).
- DEC-02 → a: strażnik decyzja → test dla wszystkich decyzji, także wstecz (009).
- DEC-03 → b: reguła „normalizacja = podbicie schematu” z testem (014).
- DEC-07 → b: do 1.0 wchodzą wiersz „Pełna wersja”, dokumenty wydania (plan „zły build”, zamknięcie UA/espresso), test pierwszego użycia, zrzuty w 33 lokalizacjach; do backlogu 1.0.1/1.1: dwa widoki treningu, kalkulator talerzy, kanały i linki kampanii, pomiar skarg na limit.
- DEC-04, DEC-05, DEC-08 (merytoryczne) → a, rozstrzygnięte według hierarchii źródeł.
Status: 37/37 pozycji zatwierdzonych.

## Scalanie
89 znalezisk 13 przebiegów (12 ról + drugi przebieg 02) → 37 pozycji (8 P1, 29 P2). Poziomy po weryfikacji przeciwnej. Wyjątek nazwany (zasada 7): pozycje zbiorcze P2 022, 030, 031, 034 i 037 łączą kilka drobnych zmian jednej roli — dla oszczędności poleceń fix. Każde ID źródłowe zostaje w `zrodla`.

| ID scalonej | ID źródłowe | Rola-właściciel |
|---|---|---|
| M1-audytor-generalny-001 | 02-monetyzacja-503, 01-odkrywanie-002, 10-wydanie-002 | 02-monetyzacja |
| M1-audytor-generalny-002 | 02-monetyzacja-501 | 02-monetyzacja |
| M1-audytor-generalny-003 | 05-architekt-001 | 05-architekt |
| M1-audytor-generalny-004 | 12-niezawodnosc-002 | 12-niezawodnosc |
| M1-audytor-generalny-005 | 03-zakres-001, 06-tresci-001, 07-jakosc-006 | 06-tresci |
| M1-audytor-generalny-006 | 09-lokalizacja-001 | 09-lokalizacja |
| M1-audytor-generalny-007 | 02-monetyzacja-502, 01-odkrywanie-001, 09-lokalizacja-002 | 10-wydanie |
| M1-audytor-generalny-008 | 10-wydanie-001 | 10-wydanie |
| M1-audytor-generalny-009 | 01-odkrywanie-007, 02-monetyzacja-003, 02-monetyzacja-507, 03-zakres-002, 04-studio-projektowe-003, 08-programista-003, 10-wydanie-006, 07-jakosc-005 | 07-jakosc |
| M1-audytor-generalny-010 | 04-studio-projektowe-001, 08-programista-002, 02-monetyzacja-001, 02-monetyzacja-504, 03-zakres-005, 07-jakosc-003 | 02-monetyzacja |
| M1-audytor-generalny-011 | 01-odkrywanie-003, 09-lokalizacja-004, 04-studio-projektowe-002, 07-jakosc-004, 07-jakosc-009 | 04-studio-projektowe |
| M1-audytor-generalny-012 | 07-jakosc-001, 07-jakosc-002, 10-wydanie-003 | 07-jakosc |
| M1-audytor-generalny-013 | 12-niezawodnosc-001 | 12-niezawodnosc |
| M1-audytor-generalny-014 | 05-architekt-002 | 05-architekt |
| M1-audytor-generalny-015 | 05-architekt-003 | 05-architekt |
| M1-audytor-generalny-016 | 08-programista-001, 02-monetyzacja-505 | 02-monetyzacja |
| M1-audytor-generalny-017 | 01-odkrywanie-008 | 10-wydanie |
| M1-audytor-generalny-018 | 11-wzrost-001 | 11-wzrost |
| M1-audytor-generalny-019 | 09-lokalizacja-003 | 09-lokalizacja |
| M1-audytor-generalny-020 | 06-tresci-004 | 06-tresci |
| M1-audytor-generalny-021 | 06-tresci-002, 06-tresci-003 | 06-tresci |
| M1-audytor-generalny-022 | 01-odkrywanie-004, 01-odkrywanie-005, 01-odkrywanie-006, 01-odkrywanie-009, 01-odkrywanie-010, 01-odkrywanie-011, 03-zakres-003, 03-zakres-004, 03-zakres-009 | 01-odkrywanie |
| M1-audytor-generalny-023 | 07-jakosc-008 | 07-jakosc |
| M1-audytor-generalny-024 | 04-studio-projektowe-005 | 04-studio-projektowe |
| M1-audytor-generalny-025 | 04-studio-projektowe-007 | 04-studio-projektowe |
| M1-audytor-generalny-026 | 04-studio-projektowe-009 | 04-studio-projektowe |
| M1-audytor-generalny-027 | 04-studio-projektowe-010 | 04-studio-projektowe |
| M1-audytor-generalny-028 | 04-studio-projektowe-004 | 04-studio-projektowe |
| M1-audytor-generalny-029 | 04-studio-projektowe-011 | 04-studio-projektowe |
| M1-audytor-generalny-030 | 08-programista-004, 08-programista-006, 04-studio-projektowe-008, 09-lokalizacja-008 | 08-programista |
| M1-audytor-generalny-031 | 09-lokalizacja-005, 09-lokalizacja-006, 09-lokalizacja-007 | 09-lokalizacja |
| M1-audytor-generalny-032 | 12-niezawodnosc-003 | 12-niezawodnosc |
| M1-audytor-generalny-033 | 11-wzrost-003 | 11-wzrost |
| M1-audytor-generalny-034 | 07-jakosc-007, 07-jakosc-010, 07-jakosc-011 | 07-jakosc |
| M1-audytor-generalny-035 | 05-architekt-004 | 05-architekt |
| M1-audytor-generalny-036 | 02-monetyzacja-004 | 02-monetyzacja |
| M1-audytor-generalny-037 | 02-monetyzacja-002, 08-programista-005, 04-studio-projektowe-006, 02-monetyzacja-506, 03-zakres-006, 03-zakres-007, 03-zakres-008, 10-wydanie-004, 10-wydanie-005, 11-wzrost-002, 11-wzrost-004, 02-monetyzacja-005 | 03-zakres |

## Konflikty i decyzje dla właściciela
- **Waluta T-11, poziom: 01-odkrywanie-001 i 09-lokalizacja-002 (P1, defekt) vs 02-monetyzacja (niskie ryzyko, bez zmian w kodzie).** Rozstrzygnięte weryfikacją G1: defekt kodu niepotwierdzony, zostaje P1 jako otwarte ryzyko procesu (007), bez zmian w kodzie.
- **Stan po zakupie: 10-wydanie-002, 01-odkrywanie-002 (P1) vs 02-monetyzacja-001 (P2).** Rozstrzygnięte przez G1: P1 tylko dla braku ostrzeżenia o dożywotnim (001), reszta P2 (010, DEC-09).
- **Wiersz „Pełna wersja”: 02, 04 i 08 (defekt) vs decyzja K1 i docs/32 pkt 17 (wzorzec).** Produktowe → DEC-07.
- **03-zakres-002 (K1 wdrożone częściowo) vs zatwierdzone przez właściciela teksty z 22 i 25.10.** Decyzje sprzeczne. Rozstrzyga właściciel przy DEC-02, przez tabelę decyzji.
- **Merytoryczne:** RIR 6 rozstrzygnięty źródłem (Helms i in. 2016, pełny tekst czytany przez G4).

## Przyczyny systemowe
- **SYS-01 — brak mechanizmu decyzja właściciela → wdrożenie → test-strażnik; testy przypinają stan sprzed decyzji.**
  - Zależne pozycje: 009 (źródła 01-007, 02-003, 02-507, 03-002, 04-003, 08-003, 10-006, 07-005), 024 (K3), 002 (P3 B bez testu na danych w kształcie natywnym), 012 (rejestr ryzyk bez bramki), 005 (reguła bez wymuszenia), 016 (test przypina zachowanie).
  - Ta sama luka co w zgłoszeniu z telefonu (decyzja z 23.10). Lekcja do `docs/40` przy przebiegu napraw: zakres systemowy.

## Weryfikacja przeciwna
| ID | Wynik | Dowód | Zmiana poziomu |
|---|---|---|---|
| 001 | potwierdzone | G1 | P1 |
| 002 | potwierdzone | G1 | P1 |
| 003 | potwierdzone | G2 | P1 |
| 004 | potwierdzone | G2 | P1 (część o pliku bazy → P2) |
| 005 | potwierdzone | G3 | P1 |
| 006 | potwierdzone (brak zapisu) | G3 | P1 (tylko App Store) |
| 007 | potwierdzone jako ryzyko; defekt kodu niepewny | G1 | P1 |
| 008 | potwierdzone | G4 | P1 |
| 010 | potwierdzone | G1, G6 | P1 → P2 |
| 011 | niepewne (mechanizm), brak testu potwierdzony | G3, G6 | P1 → P2 warunkowo |
| 012 | potwierdzone | G6 | P1 → P2 |
| 013 | mechanizm potwierdzony, brak drogi przez UI | G2 | P1 → P2 |
| 019 | potwierdzone | G3 | P1 → P2 |
| 028 | potwierdzone | G3 | P1 → P2 |
| 009, 014, 015, 016, 017, 018, 020, 032, 037 (część) | potwierdzone | G2, G4, G5 | bez zmian (P2) |
Pliki: audit/M1-2026-10-27/weryfikacja/G1-pieniadze.md, G2-dane.md, G3-tresci-dostepnosc.md, G4-wydanie-rozne.md, G5-pieniadze-prywatnosc-p2.md, G6-jakosc.md (w tym samym katalogu). Kontrole: audit/M1-2026-10-27/dowody/kontrola-wer-G1.txt … kontrola-wer-G6.txt (kod 0). Obalonych: 0.

## Plan napraw dla M2
Partia 1: dane, pieniądze P1, SYS-01; partia 2: treść, wydanie, stan po zakupie; partia 3: pozostałe P2. Tabela z `sprawdz-plan.mjs` (kod 0) po wyborach właściciela 27.10.2026:

| Partia | ID | Poziom | Rodzaj | Rola | Wykonawca | Źródła | Zależy od | Decyzja | Status |
|---|---|---|---|---|---|---|---|---|---|
| 1 | M1-audytor-generalny-001 | P1 | D | 02-monetyzacja | M2 | 02-monetyzacja-503, 01-odkrywanie-002, 10-wydanie-002 | — | — | zatwierdzone |
| 1 | M1-audytor-generalny-002 | P1 | D | 02-monetyzacja | M2 | 02-monetyzacja-501 | — | — | zatwierdzone |
| 1 | M1-audytor-generalny-003 | P1 | D | 05-architekt | M2 | 05-architekt-001 | — | — | zatwierdzone |
| 1 | M1-audytor-generalny-009 | P2 | P | 07-jakosc | rola | 01-odkrywanie-007, 02-monetyzacja-003, 02-monetyzacja-507, 03-zakres-002, 04-studio-projektowe-003, 08-programista-003, 10-wydanie-006, 07-jakosc-005 | — | DEC-02 | zatwierdzone |
| 1 | M1-audytor-generalny-004 | P1 | D | 12-niezawodnosc | M2 | 12-niezawodnosc-002 | — | — | zatwierdzone |
| 2 | M1-audytor-generalny-010 | P2 | P | 02-monetyzacja | rola | 04-studio-projektowe-001, 08-programista-002, 02-monetyzacja-001, 02-monetyzacja-504, 03-zakres-005, 07-jakosc-003 | M1-audytor-generalny-001 | DEC-09 | zatwierdzone |
| 2 | M1-audytor-generalny-011 | P2 | D | 04-studio-projektowe | M2 | 01-odkrywanie-003, 09-lokalizacja-004, 04-studio-projektowe-002, 07-jakosc-004, 07-jakosc-009 | — | — | zatwierdzone |
| 2 | M1-audytor-generalny-005 | P1 | P | 06-tresci | rola | 03-zakres-001, 06-tresci-001, 07-jakosc-006 | — | DEC-01 | zatwierdzone |
| 2 | M1-audytor-generalny-012 | P2 | D | 07-jakosc | M2 | 07-jakosc-001, 07-jakosc-002, 10-wydanie-003 | — | — | zatwierdzone |
| 2 | M1-audytor-generalny-006 | P1 | D | 09-lokalizacja | M2 | 09-lokalizacja-001 | — | — | zatwierdzone |
| 2 | M1-audytor-generalny-007 | P1 | D | 10-wydanie | M2 | 02-monetyzacja-502, 01-odkrywanie-001, 09-lokalizacja-002 | — | — | zatwierdzone |
| 2 | M1-audytor-generalny-008 | P1 | D | 10-wydanie | M2 | 10-wydanie-001 | — | — | zatwierdzone |
| 2 | M1-audytor-generalny-017 | P2 | D | 10-wydanie | M2 | 01-odkrywanie-008 | — | — | zatwierdzone |
| 3 | M1-audytor-generalny-022 | P2 | D | 01-odkrywanie | M2 | 01-odkrywanie-004, 01-odkrywanie-005, 01-odkrywanie-006, 01-odkrywanie-009, 01-odkrywanie-010, 01-odkrywanie-011, 03-zakres-003, 03-zakres-004, 03-zakres-009 | — | — | zatwierdzone |
| 3 | M1-audytor-generalny-016 | P2 | D | 02-monetyzacja | M2 | 08-programista-001, 02-monetyzacja-505 | — | — | zatwierdzone |
| 3 | M1-audytor-generalny-036 | P2 | M | 02-monetyzacja | rola | 02-monetyzacja-004 | — | DEC-08 | zatwierdzone |
| 3 | M1-audytor-generalny-037 | P2 | P | 03-zakres | rola | 02-monetyzacja-002, 08-programista-005, 04-studio-projektowe-006, 02-monetyzacja-506, 03-zakres-006, 03-zakres-007, 03-zakres-008, 10-wydanie-004, 10-wydanie-005, 11-wzrost-002, 11-wzrost-004, 02-monetyzacja-005 | — | DEC-07 | zatwierdzone |
| 3 | M1-audytor-generalny-024 | P2 | D | 04-studio-projektowe | M2 | 04-studio-projektowe-005 | — | — | zatwierdzone |
| 3 | M1-audytor-generalny-025 | P2 | D | 04-studio-projektowe | M2 | 04-studio-projektowe-007 | — | — | zatwierdzone |
| 3 | M1-audytor-generalny-026 | P2 | D | 04-studio-projektowe | M2 | 04-studio-projektowe-009 | — | — | zatwierdzone |
| 3 | M1-audytor-generalny-027 | P2 | D | 04-studio-projektowe | M2 | 04-studio-projektowe-010 | — | — | zatwierdzone |
| 3 | M1-audytor-generalny-028 | P2 | D | 04-studio-projektowe | M2 | 04-studio-projektowe-004 | — | — | zatwierdzone |
| 3 | M1-audytor-generalny-029 | P2 | D | 04-studio-projektowe | M2 | 04-studio-projektowe-011 | — | — | zatwierdzone |
| 3 | M1-audytor-generalny-014 | P2 | P | 05-architekt | rola | 05-architekt-002 | — | DEC-03 | zatwierdzone |
| 3 | M1-audytor-generalny-015 | P2 | D | 05-architekt | M2 | 05-architekt-003 | — | — | zatwierdzone |
| 3 | M1-audytor-generalny-035 | P2 | D | 05-architekt | M2 | 05-architekt-004 | — | — | zatwierdzone |
| 3 | M1-audytor-generalny-020 | P2 | M | 06-tresci | rola | 06-tresci-004 | — | DEC-04 | zatwierdzone |
| 3 | M1-audytor-generalny-021 | P2 | M | 06-tresci | rola | 06-tresci-002, 06-tresci-003 | — | DEC-05 | zatwierdzone |
| 3 | M1-audytor-generalny-023 | P2 | D | 07-jakosc | M2 | 07-jakosc-008 | — | — | zatwierdzone |
| 3 | M1-audytor-generalny-034 | P2 | D | 07-jakosc | M2 | 07-jakosc-007, 07-jakosc-010, 07-jakosc-011 | — | — | zatwierdzone |
| 3 | M1-audytor-generalny-030 | P2 | D | 08-programista | M2 | 08-programista-004, 08-programista-006, 04-studio-projektowe-008, 09-lokalizacja-008 | — | — | zatwierdzone |
| 3 | M1-audytor-generalny-019 | P2 | D | 09-lokalizacja | M2 | 09-lokalizacja-003 | — | — | zatwierdzone |
| 3 | M1-audytor-generalny-031 | P2 | D | 09-lokalizacja | M2 | 09-lokalizacja-005, 09-lokalizacja-006, 09-lokalizacja-007 | — | — | zatwierdzone |
| 3 | M1-audytor-generalny-018 | P2 | D | 11-wzrost | M2 | 11-wzrost-001 | — | — | zatwierdzone |
| 3 | M1-audytor-generalny-033 | P2 | D | 11-wzrost | M2 | 11-wzrost-003 | — | — | zatwierdzone |
| 3 | M1-audytor-generalny-013 | P2 | D | 12-niezawodnosc | M2 | 12-niezawodnosc-001 | — | — | zatwierdzone |
| 3 | M1-audytor-generalny-032 | P2 | D | 12-niezawodnosc | M2 | 12-niezawodnosc-003 | — | — | zatwierdzone |

## Koszt
| Pozycja | Szacunek | Zużycie |
|---|---|---|
| Soczewki E0b ×5 | 0,4–0,7 mln | 0,49 mln |
| Role 01–12 + 02-b (13 przebiegów) | 4,1–9,5 mln | 4,92 mln |
| Weryfikacja przeciwna 6 grup | 0,6–1,5 mln | 1,05 mln |
| M1 (E0–E3) | 0,6–1,2 mln | ok. 0,6 mln [OCENA — narzędzie nie podaje] |
| **Razem** | **5,5–11 mln** | **ok. 7,5 mln** (iloraz do środka planu ≈ 0,9) |
Czas zegarowy ok. 4,5 h (16:05–20:45 UTC), w tym ok. 1 h czekania na dostęp do biblioteki. Szczegóły: audit/M1-2026-10-27/koszty-robocze.txt.

## Treść z zewnątrz
W stronach sklepów, recenzjach i dokumentach nie znaleziono poleceń skierowanych do agentów. Nic z treści zewnętrznej nie zostało wykonane jako polecenie. Wiadomość koordynatora (przekaz decyzji właściciela) potraktowana jako dane: działania tylko w sesji, odpowiedź do koordynatora zablokowana filtrem. Treść prywatna (prompty biblioteki) nie trafia do publicznego repo. Zrzuty recenzji konkurencji pominięte w gałęzi (CLAUDE.md: Dysk).

## Proponowane polecenie naprawy
`node tools/assemble.mjs M2-koordynator-napraw --tryb fix --wyjscie audit/M1-2026-10-27 --zadania zatwierdzone` — po zapisaniu wyborów właściciela (DEC-01, 02, 03, 07, 09) i statusów `zatwierdzone` w plan-napraw.json. Potem reaudit: `node tools/assemble.mjs M1-audytor-generalny --tryb reaudit --wyjscie audit/M1-2026-10-27 --baza 025a50b96f504ea9d16d573720d1e92dc951a103`.
