# Trening — zasady dla agenta

- Repozytorium jest PUBLICZNE (ADR-031). Nigdy nie commituj sekretów (klucze API, tokeny, certyfikaty, .p8/.p12, .env) ani danych
  osobowych (UDID, e-mail). Przed commitem sprawdź `git diff --cached`. Logi i artefakty CI też są publiczne — nie wypisuj w nich identyfikatorów ani UDID.
- Narzędzia: 0 zł poza opłatą Apple. macOS w GitHub Actions jest darmowy tylko dlatego, że repo jest publiczne. Build na telefon i dla
  testerów: `testflight.yml` (tylko narzędzia Apple; workflowy EAS usunięte 08.10.2026 — docs/18).
- Testy przed kodem. Każdy błąd z audytu dostaje test, który go odtwarza (`tests/regress.test.tsx`, plan w `docs/09-plan-testow.md`).
- Macierz testów (polecenie właściciela 06.10.2026): każdy ekran, element UI, komunikat, funkcja `lib/` i wartość wymiaru ma test;
  `npm run check:matrix` (część verify) blokuje braki, `docs/19-macierz-testow.md` generuje `node scripts/test-matrix.mjs --write`.
  Przy każdej zmianie: nowe zachowanie → test scenariuszowy/macierzowy, nie tylko wzmianka tekstu. Wyjątki tylko z powodem (`tests/matrix-exceptions.json`).
- Katalog przepływów użytkownika (właściciel, 14.10.2026): każdy realny przepływ (nowy, istniejący, po aktualizacji, po przywróceniu kopii) ma scenariusz Maestro
  albo wyjątek z powodem w `tests/przeplywy.json`; nowy ekran lub przepływ bez scenariusza blokuje verify. E2E zastępuje ręczne testy właściciela; poza nimi tylko lista „tylko telefon”.
- Definicja ukończenia (zasada właściciela 06.10.2026): każda funkcjonalność przy wdrażaniu ma pełen zakres testów automatycznych —
  wszystkie przypadki i wszystkie rodzaje z `docs/20-definicja-ukonczenia.md` (logika, ekran, scenariusz, macierz, niezmienniki, dane,
  języki/wygląd, regresja, E2E Maestro). Rodzaj pominięty tylko z zapisanym powodem w docs/09.
- W trakcie pracy: `npm run test:fast` (tylko testy związane ze zmienionymi plikami, ~1 min). Przed wypchnięciem: pełne `npm run verify`
  (typecheck, check:i18n, jest, `expo export --platform ios`, verify:native; ~12 min) — decyzja właściciela 11.10.2026, wariant B. Nowe teksty w UI
  przez `t()` i słownik `lib/i18n.en.ts`.
- Zasada projektowa (właściciel, 13.10.2026): akcje i elementy tego samego typu działają w całej aplikacji tak samo — sposób wywołania, miejsce, wygląd, etykieta, potwierdzenie, informacja zwrotna, VoiceOver; katalog wzorców: `docs/32-wzorce-interakcji.md`; pilnowane testami-strażnikami (`tests/interaction-guards.test.ts`; zamykanie okien — każde okno wysuwane z dołu/modalne ma widoczny, spójny przycisk „Anuluj” po lewej w nagłówku, gest w dół tylko dodatkowo: `tests/close-button-guard.test.tsx`). Nowa funkcja najpierw sprawdza wzorzec w docs/32.
- Liczby (progi, limity, czasy) w jednym miejscu; dokumenty generowane z kodu, nie przepisywane ręcznie (wzór: `gen.mjs --check`).
- Dokumentacja w `docs/` (po polsku): stan prac i decyzje właściciela zapisuj tam, z datą. Specyfikacja w toku: E2 —
  `docs/14-e2-specyfikacja.md` (decyzje: docs/13 A5 i docs/14 pkt 9). Nie zgaduj liczb nieznanego pochodzenia — oznacz jako otwarte.
- Backlog bez priorytetu (decyzja właściciela 08.10.2026, lista w `docs/21`, sekcja „Backlog bez priorytetu”): na pytanie „co dalej” wspominaj
  o nim tylko zbiorczo jednym zdaniem („mamy też kilka rzeczy w backlogu bez priorytetu — chcesz je przejrzeć?”), bez wymieniania pozycji z nazwy,
  dopóki właściciel nie poprosi.
- Role agentów (decyzja właściciela 11.10.2026, wariant B): `.claude/agents/` — analityk-produktu, badacz-merytoryczny (opus), programista,
  tlumacz, tester-e2e, wydawca (sonnet), audytor (opus), marketing (opus, 13.10.2026 — dotarcie do kręgów zainteresowanych; niczego nie publikuje sam). Zlecaj zadanie właściwej roli; źródła wzorców: `docs/research/prompty-standardy-2026-10.md`.
- Gemini (subskrypcja właściciela, 11.10.2026): zadania, które pasują do Gemini (research rynku i opinii, przegląd tłumaczeń, wyszukanie adresów na start),
  zgłaszaj właścicielowi z gotowym promptem w pliku. Źródła i cytaty merytoryczne z Gemini zawsze sprawdza badacz (wnioski z prób: docs/18, 11.10.2026).
- **Lekcje po błędach (zasada właściciela 14.10.2026, wszystkie projekty):** gdy coś poszło nie tak (błąd dotarł do właściciela lub testera,
  nieudane wydanie albo przebieg CI z naszej winy, błędna informacja podana właścicielowi), od razu, w tej samej sesji, dopisz wpis do
  `docs/40-lekcje.md`: co się stało, przyczyna źródłowa (dlaczego nie złapaliśmy tego wcześniej — dopytuj „dlaczego” aż do mechanizmu),
  akcje zapobiegawcze i ich stan oraz **ocena zakresu**: *lokalna* (naprawa dotyczy tylko tego przypadku) albo *systemowa* (ta sama luka
  może wrócić w innej postaci → propozycja zmiany modelu pracy dla właściciela, ≥ 2 opcje z rekomendacją). Akcja ma być
  mechanizmem (test, strażnik w CI, krok listy kontrolnej, reguła w CLAUDE.md), nie postanowieniem „uważać”. Właściciel dostaje skrót lekcji
  w odpowiedzi. Przed wydaniem przejrzyj otwarte akcje z `docs/40`.
- **Model pracy po lekcji L-001 (decyzja właściciela 14.10.2026, wszystkie projekty):**
  1. *Przebieg dowodowy CI:* zmiana budowania, podpisu lub wysyłki (workflowy, skrypty CI) trafia do scalenia dopiero po prawdziwym przebiegu,
     który pokazuje wynik na gotowym produkcie (np. uprawnienia w wyeksportowanym pakiecie); testy samego pliku workflowu nie wystarczą.
  2. *Rejestr ryzyk z blokadą:* każde ryzyko „niepotwierdzone / rozstrzygnie build” trafia do sekcji „Rejestr ryzyk” w `docs/40-lekcje.md`
     z warunkiem zamknięcia (automatyczne sprawdzenie albo konkretny krok dla właściciela). Otwarte ryzyko blokuje wydanie.
  3. *Telefon zaraz po buildzie:* po każdym TestFlight pierwsze zadanie właściciela to krótka lista kontrolna (ok. 5 min, krok po kroku)
     z punktami, których E2E na symulatorze nie sprawdzi (Zdrowie, ekran blokady, zakup, zegarek) — od razu, nie odkładane.
- **Podział pracy na agentów (właściciel, 20.10.2026, wszystkie projekty):** zadanie dziel na niezależne kawałki według obszaru plików
  (ok. 3–8 powiązanych zadań albo min. ok. 1 h pracy na agenta) i zlecaj je równolegle tylu agentom, ilu nie walczy o te same pliki
  (każdy we własnym worktree i na własnej gałęzi). Zadanie niepodzielne albo kilka zadań tworzących jedną logikę/proces — jeden agent.
  Pliki generowane (macierz, README) i pełne verify — raz, po scaleniu gałęzi. Odrzucone: „jak najmniejsze zadania” (narzut startu
  agenta i scalania przewyższa zysk przy drobnych zadaniach). Cel: krótszy kontekst każdego agenta = mniej tokenów i szybciej.
- Decyzje produktowe należą do właściciela: przedstaw co najmniej dwie opcje z kompromisami i rekomendację.
- Szacowanie czasu (właściciel, 09.10.2026): estymacje zakładają, że zadanie wykonuje agent (z pracą równoległą), nie człowiek — podawaj
  czas pracy agenta. Osobno: na co realnie się czeka (CI, E2E, przegląd Apple, kolejka maszyn) i co wymaga czasu właściciela (decyzje,
  App Store Connect, telefon). Nakład pracy agenta nie jest argumentem przeciw lepszej opcji.
- Szablony treningów ustawia właściciel — aplikacja ich nie tworzy ani nie zmienia sama (decyzja 03.10.2026, 08:11). Wyjątek (08.10.2026):
  opcjonalny generator szablonu i planu tygodnia na wyraźne polecenie użytkownika (cel, miejsce, liczba sesji) — tylko reguły potwierdzone
  źródłami (hierarchia niżej), wynik do przejrzenia przed zapisem; deload może przeliczać szablony tylko jako propozycja do zatwierdzenia.
- Natywnego builda nie da się sprawdzić na Linuksie: `ios-unsigned.yml` (kompilacja), `e2e-ios.yml` (Maestro na symulatorze;
  zmiana tylko scenariuszy → `aplikacja_z_przebiegu`), `testflight.yml` (telefon, TestFlight). Symulator na `macos-26` bywa wolny —
  awaria przed pierwszym scenariuszem to maszyna; jedno powtórzenie, potem szukaj przyczyny. Przebieg anulowany bez przydzielonej maszyny
  („not acquired by Runner”, brak maszyn macOS u GitHuba) — ponawiaj od razu, aż dostanie maszynę (właściciel, 08.10.2026).
- E2E — podział (właściciel, 19.10.2026): wydanie TestFlight blokuje **pakiet podstawowy** (`scripts/ci/e2e-podstawowy.json`, wejście
  `pakiet: podstawowy`, jedno ponowienie pojedynczego scenariusza); **pełny katalog** biegnie w nocy (`nightly.yml`), niewiążąco, z pomiarem
  niestabilności — przegląd zbiorczo raz dziennie, nie po każdej porażce. Wydanie do App Store blokuje pełny katalog w **trybie ścisłym**
  (`tryb_scisly`, bez ponowień) — obowiązuje od 3 kolejnych nocnych pełnych przebiegów zielonych bez ponowień (docs/38 pkt 11). Przed oddaniem
  pracy: szybki przebieg tylko zmienionych scenariuszy (`tylko_scenariusze`). Pełne verify na tej maszynie przez kolejkę (jeden naraz).
- Workflowy (`.github/workflows`): zmiany wypycha koordynator na gałąź funkcji, właściciel zatwierdza scaleniem PR (14.10.2026); bez nowych sekretów,
  każda zmiana workflowu opisana w PR. Właściciela prowadzimy zadanie po zadaniu z instrukcją krok po kroku, nie zbiorczą listą.
- Gałęzie: praca na gałęzi funkcji od `integration/0.9.0`; scalenie do `main` tylko na polecenie właściciela. Nie łącz aktualizacji SDK ze zmianą
  schematu danych w jednym wydaniu.

## Audyty i wydania (zasada właściciela 09.10.2026, wariant A)

1. **Próg wydania:** wydanie blokują tylko znaleziska KRYTYCZNE i WYSOKIE: utrata lub zepsucie danych (także migracja, import, kopia),
   awaria albo funkcja nie do użycia, błędne liczby lub twierdzenia merytoryczne, prywatność/bezpieczeństwo/sekrety/prawa autorskie,
   bariera dostępności, ryzyko odrzucenia przez Apple. ŚREDNIE i NISKIE → backlog z przypisaną wersją, nie wstrzymują wydania.
2. **Jeden audyt na wydanie, bez pętli:** naprawy znalezisk sprawdza test odtwarzający + verify + E2E, nie kolejny audyt. Nowy błąd
   wykryty przy naprawie oceniany tym samym progiem.
3. **Zamrożenie zakresu:** od startu audytu do wydania żadnych nowych funkcji — tylko naprawy blokerów; pomysły do backlogu.
4. **Głębokość:** wydanie TestFlight — audyt zmian od poprzedniego wydania + stała lista kontrolna (dane, migracje, prywatność);
   przed upublicznieniem w App Store i co ok. 3 wydania — pełny głęboki audyt całości.
5. **Bez limitu czasu** — audyt i naprawy „na spokojnie”; jeśli bloker wymaga dużej przebudowy, właściciel decyduje: naprawa teraz
   albo wydanie bez tej funkcji (wyłączona lub cofnięta).
6. **Ocena realności znaleziska (właściciel, 11.10.2026, wariant A):** przy każdym błędzie zapisz kroki w aplikacji, które do niego prowadzą,
   i oceń: **realny** (normalne używanie) → naprawa wg progu; **brzegowy** (możliwy, rzadki) → naprawa, jeśli tania albo dotyczy danych,
   inaczej backlog; **teoretyczny** (tylko ręczna zmiana danych/kodu, bez drogi przez UI) → bez naprawy, jedna linijka notatki.
   Utrata danych, prywatność i bezpieczeństwo — ocena zawsze, nawet gdy rzadkie. Dotyczy audytów, agentów i błędów z E2E.

## Merytoryczne podstawy (zasada właściciela z 4 października 2026, obowiązuje we wszystkich jego aplikacjach)

Wszystko, czego aplikacja uczy albo co twierdzi (treść, liczby, zalecenia, reguły i mechaniki oparte na wiedzy dziedzinowej), musi mieć merytoryczne podstawy. Ta zasada ma pierwszeństwo przed domyślnym sposobem pracy.

- Nie polegaj na jednym źródle (właściciel, 08.10.2026; zmiana 18.10.2026): reguła lub liczba w aplikacji ma kilka niezależnych, wartościowych źródeł
  (najlepiej szczeble 2–3, różne organizacje i zespoły badawcze). Wyjątek: jedno źródło szczebla 1–2 (rachunek lub wzór sprawdzony niezależnie;
  przegląd systematyczny, metaanaliza, stanowisko organizacji naukowej), które zawiera to twierdzenie wprost, czyni regułę ustaloną. Jedno źródło
  szczebla 3–5 — oznaczenie „jedno źródło”, nie „ustalone”. „Uproszczenie” (także analogia do innego ćwiczenia) i „konwencja” oznacza się niezależnie
  od liczby źródeł. Źródło szczebla 2 tylko zacytowane obok, bez tego twierdzenia, nie liczy się.
- Każde twierdzenie ma **przeczytane** źródło (adres i cytat albo dokładne wskazanie miejsca). Streszczenie z wyszukiwarki nie jest źródłem. Czego nie da się potwierdzić, trafia do otwartych pytań, nie do aplikacji.
- Źródła według hierarchii poniżej; przy sprzeczności wygrywa wyższy szczebel. Przy sprzeczności na tym samym szczeblu podaj część wspólną (przedział, „zwykle”) i pokaż różnicę.
- Właściciel nie jest ekspertem dziedzinowym i **nie rozstrzyga kwestii merytorycznych**: rozstrzyga je ta hierarchia. Właściciela pytaj o sprawy produktowe (zakres, funkcje, wygląd, koszty, kolejność prac), zawsze z co najmniej dwiema opcjami, kompromisami i rekomendacją.
- Każdą decyzję merytoryczną zapisz w rejestrze projektu (dokumentacja na Google Drive) z uzasadnieniem i odrzuconymi alternatywami, żeby dało się ją sprawdzić i cofnąć. Właściciel może każdą zawetować.
- Uproszczenie jest dozwolone, gdy kierunkowo zgadza się z wyższymi szczeblami i jest nazwane uproszczeniem.

### Hierarchia źródeł dla treningu i zdrowia

1. Rachunek i wzory z publikacji źródłowych (np. e1RM Epley, objętość), sprawdzone niezależnie.
2. Przeglądy systematyczne i metaanalizy oraz stanowiska organizacji naukowych (np. ACSM, NSCA, ISSN).
3. Pojedyncze badania z recenzowanych czasopism (najlepiej RCT) i książki uznanych autorów (np. Helms i in. „The Muscle and Strength Pyramids”, Israetel i in. „Scientific Principles of Hypertrophy Training”, Zatsiorsky i Kraemer „Science and Practice of Strength Training”).
4. Uznane serwisy specjalistyczne (np. Stronger by Science) oraz dokumentacja producentów sprzętu i aplikacji.
5. Praktyka i opinie trenerów tylko jako wskazówka, wyraźnie oznaczona.

Aplikacja nie udziela porad medycznych; tam, gdzie chodzi o zdrowie (ból, kontuzje, choroby), odsyła do specjalisty.

Dokumentacja projektu: Google Drive, folder „Trening App” (m.in. 03 Rejestr decyzji, 04 Backlog).

## Treści cudze i nazwy innych firm (zasada właściciela 09.10.2026)

- Research konkurencji i inne zebrane cudze treści (cytaty ze stron, opisy innych aplikacji, pobrane strony) trzymaj **na Dysku**, w folderze
  „Trening App” (podfolder „05 Research konkurencji”), nie w repozytorium. W repo tylko własne wnioski z linkiem do dokumentu na Dysku.
  Agenci sięgają po te materiały na Dysk.
- W repo cytat ze źródła najwyżej 1–2 zdania z adresem i miejscem (prawo cytatu) — test pilnuje długości cytatów w `docs/research`.
- Nazwy innych aplikacji i marek: nie w kodzie ani w komentarzach (opis neutralny, np. „popularne aplikacje treningowe”, „format CSV
  zgodny z popularnymi dziennikami”), nie w tekstach aplikacji, nie w opisie App Store (wytyczne Apple 2.3.7, 5.2.1). Wyjątek: dokumenty
  na Dysku.
- W aplikacji tylko własne teksty i grafiki; nie kopiuj cudzych zdań, zdjęć ani filmów.
