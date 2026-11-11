# 49. Wydanie 1.1 do App Store — lista kroków (stan 10.11.2026)

Lista złożona na polecenie właściciela (KO-031, 10.11.2026 ~20:40 UTC: „tak złóż listę kroków do wydania 1.1”), na wzór `docs/48-zgloszenie-1-0.md`.
Uwaga o numerze: numer 49 ma też `docs/49-testflight-1-0.md` („What to Test” 1.0); ten plik to **lista kroków 1.1**, odnośniki piszą pełną nazwę pliku.
Kroki App Store Connect, które powtarzają się z 1.0, mają opis z docs/48 (Faza B/C) tylko tam, gdzie stronę Apple przeczytano **dziś (10.11.2026)**; pozostałe ścieżki w interfejsie oznaczone „nieprzeczytane dziś” — przed prowadzeniem właściciela przez krok agent czyta stronę tego samego dnia (CLAUDE.md, „przejście na sucho”).
Niczego nie wysłano do Apple. Kwoty i zasady płatności — tylko `docs/monetyzacja.md`.

Źródła kroków (przeczytane 10.11.2026): CLAUDE.md („Audyty i wydania”, E2E — podział, model pracy po L-001); docs/18 wpisy 31.10, 04.11, 06.11, 08.11, 09.11 (RepsGoat), 10.11; `docs/zobowiazania.md`; rejestr ryzyk w docs/40; stan koordynacji (`origin/koordynacja:docs/koordynacja/stan.md`, sekcje „Zadania przed wydaniem 1.1” i „Zadania i stan” poz. 7–8); docs/48 Faza B/C; `docs/42-plan-wydania-1.0.md` pkt 3 (wydanie stopniowe).

## Droga do wydania — w skrócie (aktualizuje agent przy każdej zmianie etapu)

**Teraz: etap 1** (stan 10.11.2026 ~21:00 UTC, sprawdzone u źródła):
- `integracja-1-1` = 57406e7f, `tests.yml` zielony (przebieg 42886062957); w toku pociąg-7 (partia 8) na `scal/pociag-7` (stan koordynacji).
- `app.json` i `package.json`: wersja **1.0.1** (build właściciela 1037 z 06.11.2026, tag `v1.0.1-b1037`); w App Store: 1.0.0 (build 1033, tag `v1.0.0-b1033`).
- `npm run check:release` na 57406e7f: **WYDANIE ZABLOKOWANE** — otwarte R-015, R-018, R-101-28, R-11-01, R-11-02 (W-05).
- Nocne testy (`nightly.yml` na `main`): 13 czerwonych z rzędu (hak startu sesji, 10.11.2026) — poprawki CI w PR na `main` (KO-032, sesja K).

| Etap | Co się dzieje | Kto | Kroki |
|---|---|---|---|
| 1 | Domknięcie zakresu 1.1: tura 3 rodzin, zadania przed wydaniem, przekład i recenzja lokalizacji, zobowiązania 1.1, ryzyka | agenci (koordynator linii 1.1) | W-01…W-07 |
| 2 | Zamrożenie zakresu, wersja 1.1.0 i „Co nowego”; zgoda na scalenie do `main` | agent + właściciel (jedno słowo) | W-08, W-09 |
| 3 | Pełny głęboki audyt całości na kandydacie; naprawy KRYTYCZNYCH i WYSOKICH (test + verify + E2E, bez drugiego audytu) | audytor + programiści | W-10…W-12 |
| 4 | Bramki na kandydacie: pełne verify, `tests.yml`, kompilacja iOS, pełny katalog E2E, migracja z 1.0, `check:release` | automat + agent | W-13…W-18 |
| 5 | Build TestFlight 1.1 (ok. 1,5 h CI) | właściciel zatwierdza `release` | W-19 |
| 6 | Telefon zaraz po buildzie: aktualizacja z 1.0, lista „tylko telefon”, odsłuch głosów | właściciel (ok. 45–60 min) | W-20 |
| 7 | App Store Connect: metadane z nową nazwą, „What's New”, zrzuty, notatki, build, wydanie stopniowe, „Add for Review” | właściciel + automat (agent przygotowuje) | W-21…W-31 |
| 8 | Recenzja Apple | Apple | W-32 |
| 9 | Po akceptacji: telefon, „Release”, nadzór wydania stopniowego 7 dni | właściciel + agent | W-33…W-35 |

## 1. Lista kroków

Podział jak w docs/48: **automat** = workflow GitHub Actions (zatwierdzenie środowiska `release` zawsze klika właściciel), **agent** = praca w repo, **właściciel** = App Store Connect / telefon.
Kolumna „Stan”: zrobione / w toku / otwarte / do potwierdzenia — z datą i dowodem (CLAUDE.md, „Stan kroków u źródła”). Właściciela prowadzimy po jednym kroku, nie tą tabelą.

### Faza A — zakres i gotowy produkt (bez App Store Connect)

| # | Krok | Kto | Zależy od | Czas | Uwagi | Stan (10.11.2026) |
|---|---|---|---|---|---|---|
| W-01 | Tura 3 rodzin figur v2 scalona do `integracja-1-1` (partie 6–9; cel pokrycia z `docs/research/pokrycie-cele.json`) | agenci | — | wg partii | rodziny bez danych póz (cardio, neck, foam_roll) → 1.2 (docs/18 10.11.2026, KO-025) | w toku 10.11.2026 — partie 6, 7, 9 na integracji (57406e7f, tests.yml 42886062957 zielony); partia 8 w `scal/pociag-7` (stan koordynacji) |
| W-02 | Zadania przed wydaniem 1.1 z listy koordynatora: Straight Raises on Incline Bench (poza + recenzja), `fidr.move`, dług `ROZJAZDY_POZA_ZAKRESEM`, badacz (lokcie_pod_dlonmi, glute_floor, pewność reguł mobility_floor/kneeling_hinge), silnik (punkty dźwigni barki/uda, obrót dzwonu kb), P3-MARSZ, PP-W1 | agenci | W-01 | kilka h agenta | każda pozycja: naprawa albo backlog 1.2 z ID decyzją | w toku 11.11.2026 (sesja L, gałąź `figury/w02-przed-1-1`): zrobione — Straight Raises (poza + recenzja „wyswietlana”, test `figures-v2-delt-raise-w02`), `fidr.move` (karta „wyswietlana”, cel pelnaKarta +1), dług `ROZJAZDY_POZA_ZAKRESEM` spłacony (lista pusta, `figury-generator-odtwarza`), dźwignia barki/uda (Standing i Seated Calf Raise zdjęte z wstrzymania po recenzji, `figures-v2-dzwignia-barki-uda`, cel +2), badacz (`docs/research/w02-badacz-reguly-2026-11-11.md`, cytaty curl; zmiany pewności → backlog W02-BAD-1…5); odłożone → 1.2 z decyzją w docs/18 11.11.2026: obrót dzwonu kb (P1-KB-2), PP-W1, P3-MARSZ (recenzja „do poprawy”); 11.11.2026 (sesja L2): testy po zamierzonych zmianach zaktualizowane (recenzja niezależna zmian testów: `docs/research/recenzje/w02-testy-audytor-2026-11-11.md`, brak osłabień); karta FIDR ukryta do przekładu W-03 (KO-042, docs/18 11.11.2026; cel pelnaKarta 523 → 522); `verify:szybkie` kod 0 i `tests.yml` zielony na 652d0c9c (przebieg 43005855183); zostaje: odsłonięcie FIDR po W-03, scalenie do integracji (koordynator) |
| W-03 | Przekład nowych tekstów przez API (ZB-057, pułap 30 USD) i zbiorcza recenzja lokalizacji (nachwyt sv/da/nb/ru/vi/nl, „Ściąganie”, lv kettlebell); nazwy lokalne ZB-044 — lista PL + 33 języki w `lib/nazwy-lokalne.ts` z polem recenzji (decyzja koordynatora 11.11.2026, KO-044 B, do weta) | tłumacz + recenzent-lokalizacji | W-01, W-02 | 2–4 h agenta | po ostatniej zmianie tekstów | otwarte 10.11.2026 — ZB-057 „czeka”, wydane 0 USD |
| W-04 | Zobowiązania 1.1: ZB-023 (znaczniki pochodzenia w `lib/cues`, `lib/figures`), ZB-025 (definicja „pełnej karty”, nazwy EN), ZB-044 (nazwy po angielsku + nazwa lokalna na karcie), ZB-039 (głosy zapowiedzi), ZB-056 (RepsGoat w aplikacji, sklepie, zrzutach, stronie) | agenci | — | wg zobowiązania | każde: zrobione z dowodem albo przeniesione decyzją właściciela | otwarte 11.11.2026 — ZB-025 zrobione 11.11.2026 (gałąź `zb/w04-nazwy`: recenzje nazw EN, 277 wpisów, aliasy; zobowiązania → Archiwum); ZB-044 kod zrobiony (w integracji od `funkcja/zb044-nazwy`), wzorzec 34 + strażnik S21 (f9501cf4), dane nazw lokalnych → W-03 (KO-044 B); ZB-023 „czeka”; ZB-039 „w toku” — kompilacja zielona (ios-unsigned 41763742923; z marką: 43027324931 na zb/w04-repsgoat-glosy aeab7fa0), odsłuch na liście „tylko telefon” W2-04 (11.11.2026), czeka odsłuch właściciela (W-20); ZB-056 „w toku” — kod w integracji (aff4c4cc), ZD-02 na liście „tylko telefon” (11.11.2026), czeka W-22, W-23, W-24/ZB-037 (nazwa grupy subskrypcji pl/en-US) i W-20 |
| W-05 | Rejestr ryzyk docs/40 bez otwartych pozycji: R-015, R-018, R-101-28, R-11-01 (opis i notatki sklepu o rysunkach), R-11-02 (Skullcrusher v1) — zamknięte z dowodem, zaakceptowane albo odroczone decyzją właściciela z datą | agent; właściciel przy odroczeniu | — | 1–3 h agenta | otwarte ryzyko blokuje wydanie (CLAUDE.md, model po L-001) | w toku 11.11.2026 (sesja M, gałąź `proces/w05-ryzyka-sigterm`) — R-015 (błąd parsera `blockingRisks`, poprawiony), R-11-01, R-11-02 zamknięte z dowodem; R-018 odroczone decyzją właściciela 03.11.2026 (Garmin → 1.2; do weta); R-101-28 zaakceptowane decyzją właściciela 11.11.2026 (~07:05 UTC, wariant A); `node scripts/ci/blokada-wydania.mjs` po zmianach: kod 0 („rejestr ryzyk: brak otwartych blokujących wydanie”). Zostaje: zielony `tests.yml` i scalenie gałęzi. Poprzednio: otwarte 10.11.2026 (5 ryzyk na 57406e7f) |
| W-06 | Nocne testy rozpatrzone (L-119): każda przyczyna czerwonej nocy — naprawa, backlog z ID albo „naprawione na gałęzi X” z dowodem `merge-base` | koordynator | — | 1 h agenta | noc to sygnał, nie bramka (CLAUDE.md, E2E — podział) | w toku 10.11.2026 — 13 czerwonych z rzędu; PR z poprawkami CI na `main` (KO-032, sesja K), scalenie osobną zgodą właściciela |
| W-07 | ZB-036: usunięcie alternatyw „stara nazwa ćwiczenia” ze scenariuszy Maestro i wyjątku `L091`, gdy plik wydania poprzedniej wersji ma już nowe nazwy | agent (tester-e2e) | W-19 poprzedniego wydania | 0,5 h | warunek z ZB-036 | otwarte 10.11.2026 — ZB-036 „czeka” |
| W-08 | **Zamrożenie zakresu** (od startu audytu tylko naprawy blokerów) i wersja **1.1.0** w `app.json`, `package.json`, lockfile; wpis „Co nowego” 1.1 w `lib/whatsnew.ts` z przekładem 33 języków; wiersz w docs/09 | agent (wydawca) | W-01…W-07 | 1 h agenta | dziś wersja 1.0.1 (`app.json:5`), wpis `whatsnew` z 06.11.2026 dotyczy buildu 1037 | otwarte 10.11.2026 |
| W-09 | **Zgoda właściciela na scalenie kandydata `integracja-1-1` → `main`** przez `scal-galaz --do main` (znacznik `pelne`); build wydania z `main` | właściciel (jedno słowo) | W-08 | 1 min | rekomendacja do weta (docs/18 10.11.2026, KO-031): jak przy 1.0 — commit wydania wchodzi na `main` tylko tą drogą (docs/48 Z-04) | otwarte 10.11.2026 |
| W-10 | **Pełny głęboki audyt całości aplikacji na kandydacie** (ZB-043; zastępuje audyt samych zmian — docs/18 08.11.2026); próg: blokują KRYTYCZNE i WYSOKIE; obejmuje bramkę 4 (każda rodzina `ready` i karta z recenzją niezależną, `autor` ≠ `recenzent`) | audytor (opus) | W-08 | 4–8 h agenta | jeden audyt na wydanie, bez pętli | otwarte 10.11.2026 — ZB-043 „czeka — faza 4 planu 1.1” |
| W-11 | Naprawy znalezisk KRYTYCZNYCH i WYSOKICH: test odtwarzający + verify + E2E (bez drugiego audytu); ŚREDNIE/NISKIE → backlog z wersją | programiści | W-10 | zależy od znalezisk | ocena realności każdego znaleziska (realny / brzegowy / teoretyczny) | otwarte |
| W-12 | Przegląd treści krytycznej po przekładzie (zdanie medyczne, asekuracja, wskazówki techniki; R-010) — po ostatniej zmianie tekstów | recenzent-lokalizacji / badacz | W-03, W-11 | 1–2 h agenta | odpowiednik docs/48 Z-02 | otwarte |
| W-13 | Pełne `npm run verify` lokalnie (znacznik `pelne`, pod `flock`) i `tests.yml` zielony na SHA kandydata | agent + automat | W-11 | 55–60 min lokalnie, CI ok. 20 min | warunek `scal-galaz --do main` | otwarte — ostatni zielony `tests.yml` integracji: 57406e7f (42886062957), to jeszcze nie kandydat |
| W-14 | `ios-unsigned.yml` (kompilacja natywna) zielony na kandydacie — zmiany natywne od 04.11 (nazwa RepsGoat w InfoPlist, głosy ZB-039) | automat | W-13 | CI ok. 20 min | Linux tego nie sprawdzi | otwarte — ostatni przebieg na integracji 04.11.2026 (41763742923, 687ad52b) |
| W-15 | **Pełny katalog E2E na standardowym iPhonie** zielony (jedno ponowienie scenariusza; scenariusz czerwony z winy skryptu potwierdzony przez tester-e2e nie blokuje) — bramka App Store; w tym scenariusz aktualizacji **z 1.0.0 (build 1033)**, bo z tej wersji aktualizują się użytkownicy | automat; tester-e2e analizuje | W-13 | CI ok. 1,5 h | [DO USTALENIA] W-15: test aktualizacji bierze poprzednią wersję z pliku wydania (R-012); najnowszy plik to `v1.0.1-b1037` (tylko właściciel) — trzeba potwierdzić, że przebieg instaluje b1033, albo uruchomić go z jawnie wskazanym plikiem 1.0.0 | otwarte — ostatni E2E na integracji: pakiet podstawowy 06.11.2026 (42285310215, 1f339f4c) |
| W-16 | Test migracji na zapisie z b1033 na kandydacie (kontrola z 06.11.2026) | automat (Jest) | W-13 | w `tests.yml` | utrata danych = zawsze blokuje | otwarte (na kandydacie) |
| W-17 | `npm run check:release` = kod 0 na SHA kandydata | agent | W-05, W-11 | 1 min | odpowiednik docs/48 Z-25b | otwarte 10.11.2026 — dziś zablokowane (W-05) |
| W-18 | Strony wsparcia i prywatności zgodne z 1.1 (nazwa RepsGoat, znacznik wersji): eksport `site/` do repo strony, potem `check-urls.yml` zielony | agent | W-08 | kilka min | odpowiednik docs/48 Z-10a (R-017) | otwarte |
| W-19 | **Build 1.1 na TestFlight**: `testflight.yml` (numer buildu = baza + numer przebiegu; zadanie `tag` samo dopisuje wiersz dziennika wydań — L-117) | automat; właściciel zatwierdza `release` | W-13…W-17 | CI ok. 1,5 h | wysyłka tylko po zatwierdzeniu właściciela | otwarte |
| W-20 | **Telefon zaraz po buildzie**: kopia zapasowa, aktualizacja z wersji 1.0 z App Store do buildu 1.1, lista docs/39 + „tylko telefon” (Zdrowie, ekran blokady, zakup, zegarek), nazwa RepsGoat pod ikoną, odsłuch głosów (ZB-039) | właściciel | W-19 | ok. 45–60 min | agent przygotowuje listę „tylko zmiany 1.1” przed buildem | otwarte |

### Faza B — App Store Connect (właściciel; agent przygotowuje)

Wszystkie kroki w <https://appstoreconnect.apple.com> → Apps → aplikacja. Rola: Account Holder, Admin lub App Manager (strona „Submit an app”, odczyt 10.11.2026).

| # | Krok | Kto | Strona Apple | Czas właściciela | Stan (10.11.2026) |
|---|---|---|---|---|---|
| W-21 | Wersja **1.1.0** iOS istnieje w stanie „Prepare for Submission”. Apple: „In the sidebar, click the add button (+) next to the desired platform. In the New Version dialog, enter an incremental App Store version number, then click Create.” | właściciel | <https://developer.apple.com/help/app-store-connect/update-your-app/create-a-new-version/> (odczyt 10.11.2026) | 1 min | do potwierdzenia — docs/18 09.11.2026: „wersja 1.1.0 w przygotowaniu” (rezerwacja nazwy RepsGoat); agent nie widzi ASC |
| W-22 | **Metadane 1.1** przez `asc-metadane.yml` (`podglad`, potem `zapis` za `release`): nazwa „RepsGoat: …” we wszystkich lokalizacjach, podtytuły i słowa kluczowe PL/EN wg docs/18 09.11.2026, przegląd pozostałych języków; **„What's New in this Version”** — Apple: „A description of the changes in this version of the app… Limited to 4000 characters.” Skrypt obsługuje pole (`scripts/asc/metadane.mjs:19,142`), ale `store/app-store-metadata.json` nie ma jeszcze `whatsNew` — agent dopisuje teksty 34 lokalizacji | automat + właściciel (zatwierdzenie) | <https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information/> (odczyt 10.11.2026) | 5 min | otwarte — ZB-056 „czeka” |
| W-23 | **Zrzuty ekranu** z nową nazwą i rysunkami 1.1: `store-screenshots.yml`, potem `asc-zrzuty.yml` (dry-run, potem apply za `release`); pierwszy zapis na jednym elemencie (model po L-001) | automat + właściciel | strona specyfikacji zrzutów — nieprzeczytana dziś (docs/48 Z-16, odczyt 25.10.2026) | 5 min | otwarte |
| W-24 | **Zakupy**: lokalizacje produktów bez zmian w treści — tylko gdy zmienia się nazwa w opisach; ZB-037: workflow `asc-iap-localizations.yml` zapisuje też en-US i pl (PATCH, nigdy DELETE), pierwszy zapis na jednym produkcie | agent (kod workflowu) + automat + właściciel | strona „Submit an In-App Purchase” — nieprzeczytana dziś (docs/48 Z-24, Z-28) | 5 min | otwarte — ZB-037 „czeka” |
| W-25 | **App Review Information — Notes** zaktualizowane: R-11-01 (rysunki ruchu w 1.1, nowa nazwa) w `store/review-notes.md` i `store/review-notes.en.txt`, właściciel wkleja wersję EN | agent przygotowuje, właściciel wkleja | <https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information/> (odczyt 10.11.2026; sekcja App Review information — szczegóły pól nieprzeczytane dziś) | 5 min | otwarte (W-05, R-11-01) |
| W-26 | `asc-kontrola.yml` zielone tuż przed zgłoszeniem (ceny, brak ofert wprowadzających, kategoria, adresy); oczekiwane wartości z nową nazwą | automat (agent uruchamia) | — (workflow własny) | — | otwarte |
| W-27 | **Wygaszenie buildów spoza kandydata** w TestFlight (1035, 1037 i każdy 1.0.1), żeby w W-28 nie dało się wybrać złego buildu | właściciel | strona „Stop testing a build” — nieprzeczytana dziś (docs/48 Z-25a, odczyt 28.10.2026) | 3 min | otwarte |
| W-28 | **Build do wersji**: Apple: „In the sidebar, click the app version you want to submit. On the right, scroll down to the Build section and verify that you added the right build for the version.” Numer z tagu `v1.1.0-bNNNN` na SHA kandydata | właściciel; agent podaje numer | <https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-app/> (odczyt 10.11.2026) | 3 min | otwarte |
| W-29 | **Wydanie stopniowe 7 dni** (docs/42 pkt 3, docs/48 Z-34): Apple: „scroll down to the Phased Release for Automatic Updates section, select Release update over a 7-day period using phased release. Click save.” | właściciel | <https://developer.apple.com/help/app-store-connect/update-your-app/release-a-version-update-in-phases/> (odczyt 10.11.2026) | 1 min | otwarte |
| W-30 | **Opcja wydania** (Version Release): przy 1.0 ręcznie (docs/48 Z-27). [DO USTALENIA] W-30: jak ręczne wydanie łączy się z wydaniem stopniowym — strona „release-a-version-update-in-phases” opisuje stan po akceptacji „Ready for Distribution … ‘Phased Release’”, nie opisuje połączenia z „Manually release”; agent czyta stronę „Select an app version release option” przed krokiem | właściciel | strona opcji wydania — nieprzeczytana dziś | 1 min | otwarte |
| W-31 | **Zgłoszenie**: Apple: „On the top right, click ‘Add for Review,’ and select whether to add the app version to an existing draft submission or create a new submission.” Potem „Draft Submissions” → „Submit for Review”; zakupy tylko gdy zmienione (W-24) | właściciel | <https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-app/> i <https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-for-review/> (odczyt 10.11.2026) | 10 min | otwarte |

### Faza C — po zgłoszeniu

| # | Krok | Kto | Uwagi | Stan (10.11.2026) |
|---|---|---|---|---|
| W-32 | Recenzja Apple; odpowiedzi w Resolution Center | Apple; agent przygotowuje odpowiedź, właściciel wysyła | Apple: zgłoszenia mogą być rozpatrywane nie w kolejności („Submissions may not be reviewed in the order you submit them.”, submit-for-review, odczyt 10.11.2026); czas recenzji 1.0: docs/48 Z-30 | otwarte |
| W-33 | Po akceptacji: build z TestFlight na telefonie (krótka lista), potem „Release” | właściciel | wada → wiadomość do agenta z numerem punktu | otwarte |
| W-34 | Nadzór wydania stopniowego 7 dni (1%, 2%, 5%, 10%, 20%, 50%, 100%); przy poważnym błędzie pauza — Apple: „During phased release, you may pause the release for up to 30 days, with no limit on the number of pauses.” | właściciel raz dziennie (recenzje, ASC); agent naprawia | strona phased release (odczyt 10.11.2026); plan „zły build”: docs/42 pkt 4 | otwarte |
| W-35 | Po wydaniu: wiersz „Wydanie” w docs/09 i wpis w docs/18; zobowiązania z warunkiem „po wydaniu 1.1”: ZB-014 (wspólny silnik), ZB-026 (fale), ZB-032 (pełna karta dla reszty), ZB-017 (strona z ćwiczeniami) — do sekcji „Aktywne” jako spełnione | agent + koordynator | tag i wiersz dziennika dopisuje `testflight.yml` (L-117) | otwarte |

## 2. Kroki właściciela (osobno, z czasem)

| Krok | Co robi właściciel | Czas | Co agent przygotowuje wcześniej |
|---|---|---|---|
| W-05 | decyzja o odroczeniu ryzyka (tylko jeśli agent go nie zamknie) | ok. 5 min na ryzyko | opis ryzyka, opcje z rekomendacją |
| W-06 | zgoda na scalenie PR z poprawkami CI do `main` (KO-032) | 1 min | przebieg dowodowy |
| W-09 | zgoda na scalenie kandydata do `main` | 1 min | zielone verify `pelne`, `tests.yml` |
| W-19 | zatwierdzenie środowiska `release` dla `testflight.yml` | 2 min | zielone bramki W-13…W-17 |
| W-20 | telefon po buildzie (kopia, aktualizacja z 1.0, lista, odsłuch) | ok. 45–60 min | lista „tylko zmiany 1.1” krok po kroku |
| W-21 | potwierdzenie, że wersja 1.1.0 istnieje w ASC | 1 min | — |
| W-22, W-23, W-24 | zatwierdzenie `release` dla metadanych, zrzutów, lokalizacji zakupów | ok. 15 min łącznie | podgląd różnic, zrzuty po recenzji |
| W-25 | wklejenie notatek EN | 5 min | tekst w `store/review-notes.en.txt` |
| W-27, W-28, W-29, W-30, W-31 | wygaszenie buildów, build do wersji, wydanie stopniowe, opcja wydania, „Add for Review” → „Submit for Review” | ok. 20 min | numer buildu, strony Apple przeczytane tego dnia |
| W-33 | test na telefonie po akceptacji i „Release” | ok. 20 min | krótka lista |
| W-34 | raz dziennie przez 7 dni: recenzje i ASC | ok. 5 min dziennie | — |

Razem: ok. 2,5–3 h czasu właściciela w kilku podejściach plus decyzje.

## 3. Szacunek czasu

- **Agent:** W-02 kilka h, W-03 2–4 h, W-05 1–3 h, W-08 1 h, W-10 4–8 h, W-11 zależy od znalezisk, W-12 1–2 h, teksty „What's New” 34 lokalizacji i notatki ok. 1,5 h — razem ok. 12–20 h, z równoległością krócej.
- **Czekanie:** `tests.yml` ok. 20 min na przebieg, pełne verify lokalnie 55–60 min, `ios-unsigned.yml` ok. 20 min, pełny katalog E2E ok. 1,5 h, build TestFlight ok. 1,5 h, zrzuty (godziny, zależnie od podziału zadań — docs/48 pkt 5), kolejka maszyn macOS, recenzja Apple (W-32), wydanie stopniowe 7 dni.

## 4. Luki (kroki bez pełnego źródła)

- W-15: czy test aktualizacji instaluje 1.0.0 (b1033), a nie najnowszy plik wydania 1.0.1 (b1037) — [DO USTALENIA] W-15.
- W-23, W-24, W-27: strony Apple przeczytane przy 1.0 (25 i 28.10.2026), nie dziś — przeczytać w dniu kroku.
- W-25: pola sekcji App Review information — przeczytać w dniu kroku.
- W-30: połączenie ręcznego wydania z wydaniem stopniowym — [DO USTALENIA] W-30.
- W-21: istnienie wersji 1.1.0 w ASC — tylko z zapisu docs/18 (09.11.2026), do potwierdzenia przez właściciela.

## 5. Start strony techniqueatlas (stan 11.11.2026)

Polecenie właściciela 11.11.2026 ~07:05 UTC („A: sprawdź teraz”), sesja O. Podstawa: docs/18 02.11.2026 (start stopniowy od 1.1; W0 „biblioteka, narzędzia falami”), ZB-017, ZB-034, ZB-052 (`docs/zobowiazania.md`), W-35 wyżej (ZB-017 bez zmian). Repo strony czytane tylko do odczytu; niczego nie opublikowano.

**Termin:** start = dzień wydania 1.1 (W-33) + ok. 3 h pracy agenta + ok. 10 min właściciela (decyzja o indeksowaniu i zgoda na publikację) + czekanie na CI strony (czas `pages.yml` niezmierzony — przebieg nigdy nie był uruchomiony). Warunek: S-01…S-06 zamknięte **przed** dniem wydania; dziś otwarte wszystkie sześć, więc start w dniu wydania nie jest jeszcze możliwy.

**Stan u źródła (11.11.2026):**
- Strona `main` = 26c7b97a; `PIN.json` → `integracja-1-1` @ f3f6e167 (zgodne z ZB-034); `config.json` → `indeksowanie: false`, `wersjaWydania: ""`, domena `https://www.techniqueatlas.com`; `pages.yml` tylko `workflow_dispatch` (`pages.yml:6-7`).
- Gałąź strony `claude/inspiring-rubin-tzqxk9` @ bcbcf5c9 (ZB-052: PIN na ab59dd5 z polem `pelna`, przekierowanie ukrytego ćwiczenia, wyjątki strażnika terminów) **nie jest scalona** do `main` strony; na `main` `slug-overrides.json` nie ma przekierowania (`grep` = 0).
- Eksport `scripts/strona/eksport.mjs --langs pl,en` (pomiar tej sesji): PIN f3f6e16 — 709 ćwiczeń, `pelna` 0 (pole jeszcze nie istniało), figura 98; integracja 5721a16 — **708 ćwiczeń, `pelna` 444 (pl i en), figura 526**; parytet z `slugs.lock.json` (709 kluczy): 708 zgodnych slugów, 0 nowych, 0 zmienionych, 1 klucz bez ćwiczenia (Wide-Grip Pulldown Behind The Neck — ukryte 02.11.2026; wymaga przekierowania z S-01, `src/slugi.mjs:54`). Figura w eksporcie tylko z rodzin `ready` z aktualną recenzją (`scripts/strona/eksport.mjs:70-72`, test `tests/strona-eksport-recenzja.test.ts`). Liczby po tagu 1.1 policzyć w S-09 (zakres 1.1 jeszcze się zmienia).
- Domena: `curl -sI https://www.techniqueatlas.com` i apex → `302` na zewnętrzną stronę parkingu (nie GitHub); `https://lkarwowski494.github.io/techniqueatlas/` → `404` (Pages wyłączone, zgodnie z README strony). Kto ma domenę — brak zapisu w `docs/fakty-wlasciciela.md` i docs/18 [DO USTALENIA].
- `trademark-check.json`: 0 wpisów „sprawdzone”; przy `indeksowanie: true` strażnik S3 wymaga wpisu dla każdej nazwy widocznej na stronie (`src/straznicy.mjs:14-25`).
- Nie sprawdzone w tej sesji: przebiegi CI strony (API akcji wymaga dołączenia repo z prawem zapisu — poza zakresem „tylko odczyt”) i `npm test` strony lokalnie (uruchomienie kodu z repo strony zablokowane przez uprawnienia sesji). Ostatni znany wynik: 101 pass / 0 fail / 1 skip na `claude/inspiring-rubin-tzqxk9` (ZB-052, 09.11.2026).

| Krok | Co | Kto | Zależy od | Czas agenta | Czas właściciela | Wykonalność | Stan |
|---|---|---|---|---|---|---|---|
| S-01 | Scalenie `claude/inspiring-rubin-tzqxk9` do `main` strony (przekierowanie ukrytego ćwiczenia, wyjątki strażnika terminów, PIN z polem `pelna`) po zielonym `tests.yml` strony | koordynator, za zgodą właściciela (push na `main` repo strony) | — | 0,5 h | 1 min (zgoda) | `src/slugi.mjs:54` (bez przekierowania build się zatrzymuje) | otwarte (11.11.2026: gałąź bcbcf5c9 poza `main` 26c7b97a, `git ls-remote`) |
| S-02 | Część F-20 w eksporcie aplikacji: lista funkcji wydania i `FREE_TRAINING_DAYS_PER_MONTH` (warunek F-11, F-12) — musi wejść do kodu przed tagiem 1.1, bo strona czyta tylko dane z tagu (S4) | programista (repo aplikacji) + decyzja właściciela o zakresie 1.1 | W-08 (zamrożenie zakresu) | ok. 2 h (techniqueatlas docs/54:54) | decyzja | wykonalność niesprawdzona; dziś brak w `scripts/strona/eksport.mjs` (`grep` = 0) | otwarte (11.11.2026) |
| S-03 | Podłogi W0 na stronie: F-13 (polityka, licencja, regulamin, stopka w 35 językach), F-11 (komponent „w aplikacji” + token kampanii), F-12 (akapit o wsparciu); recenzja lokalizacji | programista (repo strony) + recenzent-lokalizacji | S-02 | ok. 8 h według kosztu kontroli z techniqueatlas docs/54:53,56,57 [OCENA] | 0 | techniqueatlas docs/54:105 (kolejność W0); `src/ui/en.json` ma dziś tylko klucz `privacy` | otwarte (11.11.2026) |
| S-04 | Domena: ustalenie, kto ją ma; DNS `www` i apex na Pages; własna domena w ustawieniach Pages; „Enforce HTTPS” (do 24 h po podpięciu, techniqueatlas docs/54:649) | właściciel (agent przygotowuje instrukcję) | — | 0,5 h | ok. 20 min + czekanie na DNS i certyfikat | wykonalność niesprawdzona (strona pomocy GitHub o własnej domenie nieprzeczytana dziś) | otwarte (11.11.2026: domena → 302 na parking) |
| S-05 | Włączenie Pages (źródło: GitHub Actions) | właściciel | S-04 | 0 | 2 min | `pages.yml:1-4` (komentarz: Pages wyłączone do startu); ścieżka w ustawieniach nieprzeczytana dziś | otwarte (11.11.2026: github.io → 404) |
| S-06 | S3 znaki towarowe: wpisy „sprawdzone” z datą dla nazw widocznych na stronie (R-016) — sposób i zakres (liczba nazw × języki indeksowane) [DO USTALENIA] | właściciel + badacz (decyzja o metodzie) | — | [DO USTALENIA] | [DO USTALENIA] | `src/straznicy.mjs:14-25` | otwarte (11.11.2026: 0 wpisów) |
| S-07 | W dniu wydania: przepięcie PIN na tag wydanego buildu (`v1.1.0-b<numer>`, `testflight.yml:280-281`): `npm run przypnij -- <sha> --ref <tag>`; `config.json` → `wersjaWydania: "1.1.0"` | agent (repo strony, gałąź) | W-33 | 0,25 h | 0 | `src/przypnij.mjs:1-2`; S4: `src/straznicy.mjs:9,29-35` | otwarte |
| S-08 | `npm run dane`, `npm test`, `npm run build` (lokalnie i `tests.yml` strony); parytet slugów z `slugs.lock.json` (708 + 1 przekierowanie) | agent | S-01, S-07 | 0,5 h + czekanie na CI | 0 | README strony („Szybki start”); `src/build.mjs:12-15` (PIN = dane) | otwarte |
| S-09 | Liczby startu z eksportu tagu: ćwiczenia, `pelna`, figury, strony indeksowane (S6: `pelna` i własne wskazówki) — do raportu dla właściciela | agent | S-08 | 0,25 h | 0 | `src/straznicy.mjs:41-56` | otwarte |
| S-10 | Przegląd niezależny: diff PIN/config, próbka zbudowanych stron w pl i en, zrzuty, figury tylko z rodzin z recenzją (bramka 4) | drugi agent (≠ autor S-07) | S-09 | 1 h | 0 | CLAUDE.md (bramka 4, L-047); `tests/strona-eksport-recenzja.test.ts` | otwarte |
| S-11 | Decyzja o indeksowaniu: `indeksowanie: true` + `indeksowanieOd` (S8), wyzwalacz `push` w `pages.yml` w tym samym PR | właściciel (decyzja), agent (zmiana) | S-04, S-06, S-10 | 0,5 h | 5 min | `src/straznicy.mjs:60-62`; `pages.yml:2`; lista kontrolna techniqueatlas docs/54:648-656 | otwarte |
| S-12 | **Publikacja** — `pages.yml` (ręcznie) **tylko za zgodą właściciela** na to działanie; przebieg dowodowy na wdrożonej stronie (noindex/robots, HTTPS, github.io → domena, figura bez błędów w konsoli) | właściciel (zgoda), agent (sprawdzenie) | S-05, S-11 | 0,5 h | 2 min | `pages.yml:4,38-62` (sprawdzenie po wdrożeniu) | otwarte |
| S-13 | Indeksowanie: weryfikacja domeny przez DNS w darmowym narzędziu wyszukiwarki dla webmasterów, zgłoszenie mapy witryny | właściciel (agent przygotowuje instrukcję) | S-12 | 0,25 h | ok. 15 min | techniqueatlas docs/54:487 (analityka A); wykonalność niesprawdzona (strona pomocy nieprzeczytana dziś) | otwarte |
| S-14 | ZB-017 w W-35 jako spełnione (bez zmiany treści decyzji) | agent + koordynator | S-12 | 0,1 h | 0 | `docs/zobowiazania.md` (ZB-017) | otwarte |

**Blokery startu w dniu wydania:** S-02 (dane F-20 muszą być w tagu 1.1 — inaczej F-11/F-12 przesuwają się na falę po starcie albo na wersję po 1.1), S-04 i S-05 (domena dziś nie wskazuje na Pages), S-06 (S3 bez metody i zakresu), S-01 i S-03 (praca agenta przed wydaniem, ok. 8,5 h).
