# Ponowny audyt: Zakres i kontrakt MVP — Trening — 2026-10-28
Commit: 2385e75aeb3880c0c90ba5edd69145a1c6d80b01 (main po naprawach M2, HEAD odłączony, zgodny z poleceniem) · Baza: 025a50b96f504ea9d16d573720d1e92dc951a103 · Tryb: reaudit, pętla 1 · Środowisko: Linux 6.18, Node 22.22.0, git 2.43, Playwright 1.63, gh (tylko odczyt); brak Xcode, symulatora i telefonu (dowody/srodowisko.txt). Sondy w osobnej kopii roboczej (`git worktree` w scratchpadzie, usunięta na końcu); testy pojedynczo `--maxWorkers=1`; typecheck i lint ze wspólnych wyników (kod 0). Pełnego verify, buildu ani workflowów nie uruchamiano.

Ostatni nagłówek promptu roli: „## Kontrola dowodów i sekretów przed oddaniem raportu”.

## Podsumowanie

Wszystkie dziewięć znalezisk roli z audytu 27.10 jest zweryfikowanych na 2385e75: bramka 4 dla figur v1 działa mechanicznie (generator przepuszcza tylko figury z aktualnym wpisem recenzji; trzy figury ukryte zgodnie z decyzjami 28.10), decyzje w docs/18 mają pole wdrożenia pilnowane w verify, BRD opisuje funkcje z inwentarza i nie wskazuje usuniętego ekranu, ekran zakupu ma stan „Masz plan: …”, a backlog i test pierwszego użycia są zapisane. Jedyna część nadal otwarta to K1 (jedna nazwa płatnej części: „Pro” obok "Pełna wersja") — świadomie zostawiona do decyzji właściciela. Przegląd różnicy dał cztery nowe znaleziska: jedno P1 istniejące już w bazie (31 kart ćwiczeń z wskazówkami techniki bez zapisu recenzji bramki 4 — reguła z CLAUDE.md obejmuje także karty, mechanizm M1-005 tylko figury) i trzy P2 (nieaktualne wskaźniki „otwarte → zadanie” w docs/18, Pendlay Row „powrót w 1.0.1” bez pozycji backlogu, podpis zrzutu obiecujący „gotowe szablony”, których aplikacja nie ma). Inwentarz funkcji bez zmian (120 pozycji, ta sama lista), próbka regresji zielona.

| ID | Źródło (plan M2) | Wynik | Dowód (2385e75) |
|---|---|---|---|
| 03-zakres-001 | M1-audytor-generalny-005 | zweryfikowane | `tests/figury-recenzja.test.tsx` 32/32 kod 0, `tests/figury-podparcie.test.ts` 20/20 kod 0, `node scripts/zrodla-runtime.mjs --check` kod 0; 68 figur v1 w `lib/figures/data.json`, każda z wpisem, 3 ukryte nieobecne (dowody/005-figury-recenzja.txt, dowody/005-figury-podparcie.txt, dowody/005-zrodla-runtime-check.txt) |
| 03-zakres-002 | M1-audytor-generalny-009 | zweryfikowane (mechanizm, K3, wpis z 27.10); K1 nadal otwarte — decyzja właściciela | `npm run check:decyzje` kod 0 (341 wpisów), `tests/decyzje-straznik.test.ts` 21/21 kod 0 (dowody/009-check-decyzje.txt, dowody/009-decyzje-straznik.txt); K3 `app/(tabs)/index.tsx:46`; kolejność planów `docs/18-przekazanie.md:599`; K1 `docs/18-przekazanie.md:468` |
| 03-zakres-003 | M1-audytor-generalny-022 | zweryfikowane | `tests/audit-m1-2026-10-27-022-brd-aktualny.test.ts` 10/10 kod 0 (każda trasa ma BR), `kontrola-brd` 75 BR, 0 błędów, kod 0; 16 funkcji z listy znaleziska ma BR (dowody/022-brd-aktualny.txt, dowody/022-kontrola-brd.txt, dowody/022-brd-funkcje.txt) |
| 03-zakres-004 | M1-audytor-generalny-022 | zweryfikowane | ten sam test, przypadek „BR-ZRO-001 wycofane … ZP-09 bez ekranu źródeł” (dowody/022-brd-aktualny.txt) |
| 03-zakres-005 | M1-audytor-generalny-010 | zweryfikowane | `tests/audit-m1-2026-10-27-010-stan-mam-plan.test.tsx` 10/10 kod 0 w powtórzeniu (pierwszy przebieg: 1 przekroczenie czasu 5 s przy zimnej pamięci podręcznej transformacji, kod 1 — obciążenie, nie wynik); `app/paywall.tsx:86`, `components/SubscriptionCard.tsx:12`, BR-ZAK-003 `docs/brd/wymagania.md:814` (dowody/010-stan-mam-plan.txt) |
| 03-zakres-006 | M1-audytor-generalny-037 | zweryfikowane (backlog 1.1 z warunkiem; weto właściciela wersji otwarte) | `docs/21-roadmapa-offline.md:164`; `tests/audit-m1-2026-10-27-037-dokumenty-wydania.test.ts` 12/12 kod 0 (dowody/037-dokumenty-wydania.txt) |
| 03-zakres-007 | M1-audytor-generalny-037 | zweryfikowane | „Powrót:” z progiem i datą przeglądu `docs/21-roadmapa-offline.md:165` (ten sam test) |
| 03-zakres-008 | M1-audytor-generalny-037 | zweryfikowane (część A); część B to krok właściciela Z-37 po premierze | `docs/design/test-pierwszego-uzycia.md:62`, `tests/audit-m1-2026-10-27-037-pierwsze-uzycie.test.ts` 9/9 kod 0 (dowody/037-pierwsze-uzycie.txt) |
| 03-zakres-009 | M1-audytor-generalny-022 | zweryfikowane (wariant B z audytu: BR → istniejący test, bez ID w nazwie testu) | przypadek „ślad BR → test (03-zakres-009)” w teście 022 (dowody/022-brd-aktualny.txt) |
| 03-zakres-601 | nowe | istniało wcześniej · P1 | dowody/601-karty-bez-recenzji.txt |
| 03-zakres-602 | nowe (nowy kod M1-009) | nowe · P2 | dowody/602-otwarte-wskazniki.txt |
| 03-zakres-603 | nowe (zapis 28.10) | nowe · P2 | dowody/603-pendlay-backlog.txt |
| 03-zakres-604 | nowe (rozszerzone przez M1-037 D) | istniało wcześniej · P2 | dowody/604-podpis-szablony.txt |

Pozostałe części M1-037 spoza ID tej roli (dla porządku): A wiersz „Subskrypcja” — `tests/audit-m1-2026-10-27-037-wiersz-pelna-wersja.test.tsx` 43/43 kod 0 (dowody/037-wiersz-pelna-wersja.txt); D podpisy zrzutów — `tests/audit-m1-2026-10-27-037-podpisy-zrzutow.test.ts` 34/34 kod 0 (dowody/037-podpisy-zrzutow.txt), ale zrzuty z nowymi podpisami nie są wygenerowane: ostatni przebieg `store-screenshots.yml` 27.10 (anulowany), `asc-zrzuty.yml` 27.10 — przed zmianą pierwszego podpisu (dowody/037D-przebiegi-zrzutow.txt); krok koordynatora, nie sprawdzono na produkcie.

Otwarte poza main (tylko wypisuję, nie znaleziska): 9a eksport figur strony (gałąź `naprawy/M2-po-decyzjach-eksport-figur`, `docs/18-przekazanie.md:618`), propozycje A/B w lekcjach L-047 i L-048 (docs/40), backlog 1.0.1 w docs/21.

## Linia bazowa i założenia

Linii bazowej nie ustalano od nowa (tryb reaudit): ta z 27.10.2026 (role/03-zakres/linia-bazowa-e0b.txt w katalogu M1) ma jeden dzień, listingów nie czytano ponownie (próg trzech miesięcy). ZAK-04, ZAK-07, ZAK-12 względem poprzedniego raportu: różnica 025a50b..2385e75 nie dodaje ani nie usuwa funkcji pętli głównej (inwentarz bez zmian, niżej); kalkulator talerzy ma teraz warunek powrotu (03-zakres-007), drugi widok treningu — punkt decyzji (03-zakres-006). Kurs bez zmian: fix, nie build od nowa.

Zmiany zakresu po audycie (decyzje 27–28.10) wobec kodu:

| Decyzja | Kod / zapis | Wynik |
|---|---|---|
| Push Press, Pendlay Row ukryte do 1.0.1 (2a, `docs/18-przekazanie.md:611`) | werdykt „ukryta” w `docs/research/figury-recenzja.json`, brak w `lib/figures/data.json`, scenariusz `docs/brd/wymagania.md:453` | zgodne w kodzie; Pendlay Row bez pozycji backlogu → 03-zakres-603 |
| Reverse Lunge ukryty do 1.0.1 (`docs/18-przekazanie.md:622`) | j.w.; backlog `docs/21-roadmapa-offline.md:151`; reguła podparcia pilnuje powrotu | zgodne |
| Lunges, Walking Lunges, Incline Push Up, Step Up poprawione i zrecenzowane niezależnie (`docs/18-przekazanie.md:621`) | wpisy """zrecenzowana niezależnie 28.10.2026""", test podparcia 20/20 | zgodne |
| Wiersz „Subskrypcja”: „Zobacz plany Pro” / „Masz plan: miesięczny / roczny / dożywotni” (DEC-07 b A, 1A × DEC-09 a, `docs/18-przekazanie.md:609`) | `components/SubscriptionCard.tsx:19`, `app/paywall.tsx:86` | zgodne |
| Pierwszy podpis zrzutu „Szybki zapis serii, także z zegarka” (10a, `docs/18-przekazanie.md:619`) | `store/screenshot-captions.json` (29 języków); zegarek odhacza serie (BR-ZEG-001, `docs/brd/wymagania.md:514`) | obietnica pokryta kodem; zrzuty niewygenerowane (wyżej) |
| Pozostałe podpisy zrzutów vs kod i opis sklepu | 8 z 9 zgodnych; „Gotowe szablony albo własne” bez pokrycia | → 03-zakres-604 |
| Symbol masy lokalnie w cyrylicy i grece (10a) | BR-JEZ `docs/brd/wymagania.md:723`; test `tests/units-label.test.ts` wskazany w decyzji | w BRD zgodne (brzmienie symboli: obszar roli 09) |

## Inwentarz funkcji

`inwentarz.mjs` (kopia z promptu) na 2385e75: 120 pozycji, kod 0 (dowody/inwentarz.txt) ""� tyle samo co na 025a50b. Różnica list (dowody/inwentarz-roznica.txt): jedna linia, import `ActionSheetIOS` w `components/DragList.tsx:2` ""� przycisk """"��""" z """Przesuń wyżej / niżej""" jako widoczna alternatywa przeciągania (M1-026), czyli poprawa ZAK-06, nie nowa funkcja. Nowych tras, przełączników, flag, uprawnień ani wtyczek brak; `app.json` niezmieniony. F-nn z raportu 27.10 obowiązują bez zmian.

## Macierz śladu

Zmienione wiersze względem raportu 27.10 (pozostałe bez zmian):

| F-nn | Decyzja | BR | Kryterium (scenariusz) | Test | W kodzie | Luka → znalezisko |
|---|---|---|---|---|---|---|
| F-13 | rdzeń | BR-SZB-002 | „Zapisz zmiany w szablonie” po treningu | wskazany w BR (test 022 sprawdza istnienie) | podsumowanie treningu | — |
| F-14, F-15, F-16 | 25.10, 22.10 | BR-ZAK-004, BR-KON-003, BR-KON-001 | okno „Uczciwe zasady”, link co 10. trening, prośba o ocenę | j.w. | `app/history/[id].tsx` | — |
| F-18 | DEC-01 b, 2a, 28.10 | BR-BIB-001 | „Rysunek ruchu tylko po recenzji” | `tests/figury-recenzja.test.tsx`, `tests/figury-podparcie.test.ts` | `scripts/zrodla-runtime.mjs:43` | karty bez figury → 03-zakres-601 |
| F-19 | rdzeń | BR-HIS-002, BR-HIS-003 | dopisanie i edycja wstecz | j.w. | zakładka Plan | — |
| F-25, F-27 | 14.10 | BR-PST-007, BR-PST-006 | Strażnik progresji, masa ciała | j.w. | `app/(tabs)/progress.tsx` | — |
| F-28…F-30 | podłoga danych | BR-DAN-006…009 | czyszczenie z kopią, import i eksport CSV, automatyczna kopia | j.w. | `app/more/backup.tsx`, `app/more/settings.tsx` | — |
| F-36 | M5 S1, DEC-09 a, 1A | BR-ZAK-003, BR-ZAK-005, BR-ZAK-006 | „Masz plan: …”, wiersz w Ustawieniach | `tests/audit-m1-2026-10-27-010-stan-mam-plan.test.tsx`, `tests/audit-m1-2026-10-27-037-wiersz-pelna-wersja.test.tsx` | `app/paywall.tsx:86` | K1 → 03-zakres-002 (otwarte) |
| F-37 | 08.10, 11.10 | BR-POM-001, BR-POM-002 | Pierwsze kroki, Przewodnik | j.w. | ekran Trening, Więcej | — |
| — | 25.10 usunięcie | BR-ZRO-001 wycofane | — | test 022 | brak ekranu | — |

`zakres.mjs` nadal nie dotyczy (projekt bez kontraktu zakresu, DEC-02 z 20.10.2026).

## Próbka regresji (trzy pozycje spoza zmienionych plików)

Pliki niezmienione w 025a50b..2385e75 (sprawdzone `git diff --name-only`): `lib/equipvis.ts`, `lib/discColors.ts`, `lib/review.ts`, `lib/seed.ts` i ich testy. Wynik (dowody/proba-regresji.txt):
- ZAK-03 (cięcie pilnowane: pasek talerzy usunięty, DEC-06): `tests/tuleja.test.tsx` 11/11, kod 0 — ok.
- ZAK-10 (decyzja → kod: prośba o ocenę po 3. treningu, 22.10): `tests/review.test.ts` 42/42, kod 0 — ok.
- ZAK-07 (granica aplikacji i wartości domyślne: tylko moduł training, głos domyślnie wyłączony): `lib/seed.ts:20` `new Set<ModuleId>(['training'])`, `tests/audit-m1-027-voice-default.test.ts` 25/25, kod 0 — ok.

## Pokrycie (co sprawdzono, czego nie)

| Obszar | Sprawdzone? | Jak |
|---|---|---|
| ID źródłowe roli (M1-005, -009, -010, -022, -037) | tak | testy M2 pojedynczo, skrypty `check:decyzje`, `kontrola-brd`, `zrodla-runtime --check` |
| `git diff 025a50b..2385e75` — docs/21, docs/brd, `store/screenshot-captions.json`, `docs/design/test-pierwszego-uzycia.md`, docs/18 (wpisy 27–28.10) | tak (treść przeczytana; BRD sprawdzony testem i wyszukaniem funkcji, nie zdanie po zdaniu) | dowody/022-brd-funkcje.txt, dowody/602-otwarte-wskazniki.txt |
| Obietnice zrzutów i opisu sklepu wobec kodu | tak (9 podpisów PL/EN, opis PL) | dowody/604-podpis-szablony.txt |
| Przebiegi workflowów zrzutów | tak, tylko odczyt | dowody/037D-przebiegi-zrzutow.txt |
| Przejście pętli na telefonie, zrzuty z nowymi podpisami | nie — brak symulatora i telefonu; krok: po `store-screenshots.yml` obejrzeć pierwszy zrzut każdej lokalizacji (oczekiwane: podpis „Szybki zapis serii, także z zegarka” w przekładzie) | — |
| Brzmienie przekładów podpisów (27 języków) | nie (obszar roli 09) | — |
| Treść merytoryczna kart i figur | nie (obszar roli 06); sprawdzono tylko istnienie zapisu recenzji | dowody/601-karty-bez-recenzji.txt |
| `git status --porcelain` start i koniec | tak | dowody/git-status-start.txt, dowody/git-status-koniec.txt |

## Kontrola dowodów i sekretów

Wynik `node /home/user/trening/audit/M1-2026-10-27/reaudit-2026-10-28/sprawdz-raport.mjs <raport> /home/user/trening <katalog roli> --rola 03-zakres`: dowody/sprawdz-raport.txt (wynik końcowy wklejony niżej po ostatnim przebiegu).

```
OK: odwołania, cytaty, pliki dowodów i sekrety sprawdzone; format raportu 03-zakres
kod wyjścia 0
```

Raport i dowody nie zawierają e-maili, UDID, sekretów, danych osobowych ani nazw innych aplikacji.

## Znaleziska (szczegóły)

### 03-zakres-601 · 31 kart ćwiczeń ze wskazówkami techniki wyświetla się bez zapisu recenzji bramki 4, a mechanizm M1-005 obejmuje tylko figury
- Pozycja listy kontrolnej: ZAK-08 (podłoga treści; patrz TRE-07)
- Poziom: P1 (CLAUDE.md: karta bez recenzji nie jest wyświetlana; reguła bramki wydania)
- Realność: realny (31 kart widocznych w bibliotece) · Pewność: średnia (czy przegląd źródeł wskazówek z października liczy się jako recenzja bramki 4, rozstrzyga notatka 53 na gałęzi, której nie czytałem)
- Rodzaj: M
- Wynik reaudytu: istniało wcześniej (te same 31 ćwiczeń miało wskazówki w 025a50b)
- Dowód: CLAUDE.md, sekcja """Animacje i karty ćwiczeń""" (27.10.2026): recenzję przechodzi """każda animacja ćwiczenia i każda karta ćwiczenia (opis, wskazówki, mięśnie, kąty, tempo, błędy)""". Zapis recenzji ma wpisy tylko dla figur v1 i rodzin v2; skrót v1 obejmuje figurę i wskazówki (`scripts/zrodla-runtime.mjs:43`), skrót rodziny v2 tylko pliki rigu (`scripts/zrodla-runtime.mjs:52`). 102 ćwiczenia mają wskazówki w `lib/cues/data.json`; 31 z nich nie ma wpisu recenzji (m.in. Back Extension, Hack Squat, Leg Curl, Nordic Curl, Sumo Deadlift, Farmer's Walk) ""� dowody/601-karty-bez-recenzji.txt (python3 na 2385e75 i `git show 025a50b`, kod 0). Scenariusz BRD łączy recenzję treści karty z rysunkiem (`docs/brd/wymagania.md:453`), więc karta bez rysunku nie ma żadnej bramki. Test akceptacyjny M1-005 obejmował """56 animacji v1""", nie karty.
- Mechanizm: strażnik `ok()` w `scripts/zrodla-runtime.mjs` filtruje wyłącznie figury; wskazówki ćwiczenia bez figury trafiają do pliku runtime bez sprawdzenia recenzji; zmiana zestawu ogólnego wskazówek v2 nie zmienia skrótu rodziny.
- Powraca: 03-zakres-001 (ta sama reguła, inny rodzaj treści) → trwała kontrola: test „karta z wskazówkami ⇒ wpis recenzji”.
- Wzorzec lub źródło: CLAUDE.md (27.10.2026), próg wydania pkt 1.
- Kroki w aplikacji: Więcej → Ćwiczenia → np. Nordic Curl → karta z rozwiniętą sekcją Technika (bez rysunku).
- Opcje: (A) recenzja bramki 4 dla 31 kart przed zgłoszeniem (agent niezależny od autora, wpis z datą i skrótem; skrót v2 rozszerzony o wskazówki) — ok. 1–2 h agenta, bez kosztu właściciela; (B) zapisana interpretacja właściciela, że przegląd źródeł wskazówek (2 zgodne źródła, CLAUDE.md 25.10) jest recenzją treści karty, a bramka 4 dotyczy ruchu — zero pracy, ale osłabia regułę z 27.10; (C) ukryć wskazówki tych 31 kart do recenzji — karta bez techniki, ryzyko zerowe. Rekomendacja: (A), bo reguła jest świeża i wprost wymienia karty; mięśnie z katalogu (709 kart) jako osobne pytanie do roli 06.
- Test akceptacyjny: test w verify — każde ćwiczenie z wskazówkami w `lib/cues/data.json` ma wpis recenzji z aktualnym skrótem wskazówek (także dla rodzin v2), inaczej wskazówki nie trafiają do pliku runtime.
- Status: otwarte

### 03-zakres-602 · Wpisy decyzji „otwarte → zadanie” zostają otwarte po naprawie zadania; strażnik sprawdza tylko obecność wskaźnika
- Pozycja listy kontrolnej: ZAK-10
- Poziom: P2
- Realność: realny (dla właściciela i agentów czytających docs/18 przed wydaniem; użytkownik nie widzi) · Pewność: wysoka
- Rodzaj: D
- Wynik reaudytu: nowe (w nowym mechanizmie M1-009)
- Dowód: `scripts/decyzje.mjs:98` — dla „otwarte” sprawdza tylko „brak wskazania, co ją prowadzi”. Cztery wpisy wskazują zadania oznaczone w planie M2 jako naprawione: `docs/18-przekazanie.md:610` „[wdrożenie: otwarte → M1-audytor-generalny-006]” (przegląd przez API wykonany, commit a38ce270), `docs/18-przekazanie.md:282` (→ 034), `docs/18-przekazanie.md:398` (→ 017), `docs/18-przekazanie.md:468` (→ 009, K1 — tu słusznie otwarte, ale zadanie 009 jest zamknięte, więc K1 nie ma już prowadzącego zadania) — dowody/602-otwarte-wskazniki.txt (kod 0).
- Mechanizm: zamknięcie zadania nie zmienia pola wdrożenia decyzji; brak porównania wskaźnika ze stanem zadania.
- Powraca: 03-zakres-002 (ta sama luka „decyzja → wdrożenie” w nowej postaci).
- Wzorzec lub źródło: CLAUDE.md, pole `[wdrożenie: …]` w docs/18 (DEC-02 a, 27.10.2026).
- Kroki w aplikacji: brak (dokumenty).
- Opcje: (A) przy naprawie zadania aktualizować pole wdrożenia w tym samym commicie + kontrola w `check:decyzje`: wskaźnik na zadanie z planu, które ma commit, = błąd — wymaga dostępu skryptu do planu (plan jest poza repo, więc raczej lista zamkniętych ID w repo); (B) krok listy kontrolnej przy scaleniu napraw: przejrzeć wpisy „otwarte → M1-…”; (C) bez zmian. Rekomendacja: (B) teraz (cztery wpisy, minuty), (A) przy następnej rundzie napraw; K1 przypisać do nowego ID decyzji właściciela.
- Test akceptacyjny: brak wpisu „otwarte → <zadanie zamknięte>”; K1 wskazuje otwarte zadanie albo decyzję.
- Status: otwarte

### 03-zakres-603 · Pendlay Row ma decyzję „powrót w 1.0.1”, ale w backlogu 1.0.1 nie ma pozycji z pracą potrzebną do powrotu
- Pozycja listy kontrolnej: ZAK-03 (PÓŹNIEJ bez warunku powrotu)
- Poziom: P2
- Realność: realny (rysunek zostanie ukryty dłużej, niż zdecydował właściciel) · Pewność: wysoka
- Rodzaj: P
- Wynik reaudytu: nowe (zapis z 28.10)
- Dowód: `docs/18-przekazanie.md:611` „Push Press i Pendlay Row — rysunki ukryte w 1.0, powrót w 1.0.1”; backlog 1.0.1 figur (`docs/21-roadmapa-offline.md:151`) wymienia Push Press, Reverse Lunge i krok w Walking Lunges; `grep -n Pendlay docs/21-roadmapa-offline.md` → 0 trafień, kod 1 (dowody/603-pendlay-backlog.txt). Powód ukrycia jest inny niż przy Push Press (brak cechy rozpoznawczej, nowe źródła — `docs/research/28-figury.md:391`), więc nie wchodzi w pracę "czwarta pozycja silnika".
- Wzorzec lub źródło: wzorzec roli (PÓŹNIEJ ma „Powrót:”).
- Kroki w aplikacji: Więcej → Ćwiczenia → Pendlay Row → karta bez rysunku.
- Opcje: (A) pozycja w backlogu 1.0.1: źródła cech Pendlay Row (start z podłogi), nowa figura, recenzja bramki 4 — kilka minut zapisu; (B) przenieść decyzję na „PÓŹNIEJ bez wersji” z warunkiem — wymaga zmiany decyzji przez właściciela. Rekomendacja: (A).
- Test akceptacyjny: pozycja Pendlay Row w backlogu 1.0.1 w docs/21 z zakresem pracy.
- Status: otwarte

### 03-zakres-604 · Podpis zrzutu w sklepie obiecuje „gotowe szablony”, a nowa instalacja nie ma żadnego szablonu
- Pozycja listy kontrolnej: ZAK-02 (obietnica w sklepie: patrz ODK-02)
- Poziom: P2
- Realność: realny (każdy nowy użytkownik po zrzucie „szablony” szuka gotowych szablonów) · Pewność: wysoka co do rozbieżności; średnia, czy „gotowe” da się czytać jako wynik generatora
- Rodzaj: P
- Wynik reaudytu: istniało wcześniej (PL i EN w 025a50b); M1-037 D powieliło podpis w 27 kolejnych językach
- Dowód: `store/screenshot-captions.json:49` „Gotowe szablony albo własne” (EN `store/screenshot-captions.json:60` „Ready-made templates or your own”, 29 języków); stan startowy `lib/seed.ts:316` „Stan startowy: biblioteka ćwiczeń i gumy, BEZ szablonów” i linia 325 tego pliku (`templates: []`) z decyzji właściciela z 03.10.2026 (CLAUDE.md: aplikacja nie tworzy szablonów sama); opis sklepu mówi tylko o własnych: `store/app-store-metadata.json:8` „Własne szablony treningów, porządkowane w folderach i archiwum” (dowody/604-podpis-szablony.txt). Generator ma już własny podpis („Plan tygodnia — sam albo z naszą pomocą”).
- Wzorzec lub źródło: CLAUDE.md (szablony ustawia użytkownik, 03.10.2026); zasada roli — obietnica sklepu pokryta kodem.
- Kroki w aplikacji: nowa instalacja → Więcej → Szablony → pusta lista.
- Opcje: (A) zmienić podpis przed generowaniem zrzutów, np. „Twoje szablony w folderach” (zgodny z opisem), przekład 29 języków i recenzja lokalizacji — ok. 0,5 h agenta, akceptacja PL/EN właściciela; teraz najtaniej, bo zrzuty z nowymi podpisami jeszcze nie powstały; (B) zostawić z interpretacją „gotowe = z generatora” — zero pracy, rozbieżność z opisem i z decyzją 03.10 zostaje. Rekomendacja: (A), razem z kolejnym przebiegiem `store-screenshots.yml`.
- Test akceptacyjny: test podpisów zrzutów odrzuca „gotowe szablony” (PL) i „Ready-made templates” (EN), dopóki stan startowy ma `templates: []`.
- Status: otwarte

## Do sprawdzenia (pewność ≤ 80%)

- Czy przegląd źródeł wskazówek (2 zgodne źródła, wyjątek CLAUDE.md z 25.10) spełnia bramkę 4 dla kart bez rysunku — interpretacja zależy od notatki 53 na gałęzi przekazanie-konta (nieczytanej z polecenia); 03-zakres-601.
- Zestawy ogólne wskazówek v2 (`lib/figures/v2/cue-sets.json`) na kartach z rysunkiem v2: skrót rodziny ich nie obejmuje — czy ich zmiana po recenzji zostałaby wykryta; obszar roli 06.
- NZ-037-1 (wyszukiwanie po polsku nie znajduje ćwiczeń z angielską nazwą; porażka Q3 w Z1 przejścia poznawczego, rynek główny Polska) — znane z wyniku fix roli 03, w docs/21 i docs/18 bez decyzji ani wersji (`docs/design/test-pierwszego-uzycia.md:19`). Nie zgłaszam ponownie (D-043); do decyzji M1, czy trafia do planu.

## Co działa dobrze i należy zachować

- Bramka 4 dla figur jest mechanizmem, nie postanowieniem: generator odrzuca figurę bez aktualnego skrótu recenzji, a reguła podparcia blokuje powrót Reverse Lunge przed poprawką.
- Pole wdrożenia przy każdej decyzji w docs/18 i `check:decyzje` w verify — decyzje 27–28.10 mają wskazane testy.
- BRD z testem „każda trasa ma BR” — nowa trasa bez wymagania zatrzyma verify (koniec dryfu z 03-zakres-003).
- Przejście poznawcze zapisane z etykietami pilnowanymi testem — zmiana etykiety wymusza ponowne przejście.

## Decyzje dla właściciela

1. Karty bez rysunku (03-zakres-601): (A) recenzja 31 kart przed zgłoszeniem, (B) interpretacja „źródła = recenzja treści”, (C) ukrycie wskazówek. Rekomendacja: A.
2. Podpis zrzutu „szablony” (03-zakres-604): (A) nowy podpis zgodny z opisem przed przebiegiem zrzutów, (B) zostawić. Rekomendacja: A.
3. K1 (jedna nazwa płatnej części) — nadal bez decyzji od 23.10; po zamknięciu zadania 009 potrzebuje nowego prowadzącego ID (03-zakres-602).

## Proponowane polecenie naprawy

`node tools/assemble.mjs 03-zakres --tryb fix --zadania 03-zakres-602,03-zakres-603,03-zakres-604` (dokumenty i podpisy; 03-zakres-601 dla roli 06 po decyzji 1).

`git status --porcelain` na końcu: dowody/git-status-koniec.txt (pliki śledzone nietknięte).
