# 49b. Wydanie 1.1.1 do App Store — lista kroków (stan 22.11.2026)

Plan na polecenie koordynatora (KO-119, właściciel 22.11.2026: „wersja 1.1.1 teraz, bez zmian w kodzie aplikacji, z nowymi metadanymi 33 lokalizacji”; KO-120 do weta: audyt zmian od 1.1 i stała lista kontrolna, bez pełnego audytu całości).
Konwencja jak `docs/49-wydanie-1-1.md` (stąd „49b”: numer 49 ma też lista 1.1 i „What to Test” 1.0). Kolumna „Stan” = jedyne źródło stanu kroków 1.1.1 (CLAUDE.md, „Stan kroków u źródła”).
Niczego nie wysłano do Apple ani do TestFlight; workflowy wysyłki i App Store Connect nie były dotykane przez agenta przygotowującego ten plan.

**Co to wydanie jest.** Poprzednie wydanie w sklepie: 1.1.0 (build 1041, tag `v1.1.0-b1041` @ 0e4555d5, akceptacja 17.11.2026 — docs/49 W-32). Od tego tagu **żaden plik aplikacji nie zmienił się** (dowód: `git diff --stat v1.1.0-b1041..HEAD -- app lib components targets assets app.json` przed commitem 1.1.1 = pusty; po commicie zmiany to wersja, jeden wpis „Co nowego” i słowniki — audyt: `docs/wydanie/audyt-1-1-1.md`). Zmieniają się: wersja 1.1.1, wpis „Co nowego” (jeden punkt, przekład 33 języków), nazwy/podtytuły/słowa kluczowe sklepu (AL2, KO-110…KO-115), notatki dla App Review i narzędzia ASC (skrypty zrzutów i lokalizacji zakupów).

Podział wykonawców: **agent** = praca w repo, **automat** = workflow GitHub Actions (środowisko `release` zatwierdza zawsze właściciel), **właściciel** = App Store Connect / telefon, **koordynator** = wyzwala przebiegi.

## 1. Lista kroków

### Faza A — gotowy produkt (bez App Store Connect)

| # | Krok | Kto | Zależy od | Czas | Stan (22.11.2026) |
|---|---|---|---|---|---|
| X-01 | Wersja 1.1.1 w `app.json`, `package.json`, `package-lock.json`; test `tests/release-1.1.1.test.tsx`; wiersz w docs/09 | agent | — | 0,3 h | zrobione 22.11.2026 — commit 33d46a8d na `wyd/1-1-1`; `npx jest tests/release-1.1.1.test.tsx tests/release-1.1.0.test.tsx tests/whats-new.test.tsx` zielone |
| X-02 | „Co nowego” 1.1.1: wpis `2026-11-22` w `lib/whatsnew-wpisy.ts` (jeden punkt, bez obietnic funkcji: „Zaktualizowaliśmy informacje o {app} w App Store, żeby łatwiej było je znaleźć. Sama aplikacja działa tak samo…” (pierwsza wersja tekstu — „opis jest dokładniejszy” — odrzucona po audycie N-1: opis w sklepie nie zmienił się od 1.1)), EN w `lib/i18n.en.ts`, przekład 31 słowników + nakładki es-419 i pt-BR (subagent `tlumacz`, 22.11.2026), `_source.json` przeliczony, `store/app-store-metadata.json` (whatsNew 33 lokalizacji) wygenerowany `node scripts/store-whatsnew.mjs --write` | agent (tlumacz) | X-01 | 0,5 h | zrobione 22.11.2026 — `check:i18n`, `check:claims`, `check:whatsnew-sklep` zielone; testy `store-whatsnew`, `i18n-variants`, `slownik-terminow` zielone. Wątpliwości językowe do recenzji native speakera (hu, fi, lt, lv, et, tr, hr, sl — odmiana nazwy w zdaniu): nie blokują (zasada progu: ŚREDNIE → backlog) |
| X-03 | Rejestr twierdzeń: wpis nie jest tekstem dziedzinowym (nie dotyczy treningu ani zdrowia) | agent | X-02 | — | zrobione 22.11.2026 — `npm run check:claims`: „rejestr zgodny”, 61 wpisów bez zmian |
| X-04 | Audyt zmian od 1.1 (tag `v1.1.0-b1041`) + stała lista kontrolna (dane, migracje, prywatność); blokują tylko KRYTYCZNE i WYSOKIE (KO-120, do weta) | audytor | X-02 | 1 h | zrobione 22.11.2026 — `docs/wydanie/audyt-1-1-1.md`: 0 KRYTYCZNYCH i WYSOKICH; N-1 (nieścisły tekst „opis dokładniejszy”) naprawiony, N-2 do backlogu |
| X-05 | Pełne `npm run verify` na końcowym commicie (pod `flock`, kod 0, znacznik `pelne`) i `tests.yml` zielony na SHA kandydata | agent + automat | X-04 | lokalnie 55–60 min, CI ok. 20 min | w toku 22.11.2026 — pierwszy przebieg na af284d57: 6 plików padło (zmiana wersji: `site/privacy.html`, 2 testy listy „Co nowego”; 3 pliki „podpisy” zabite SIGKILL przez pamięć, zielone osobno); po poprawce powtórka |
| X-06 | `ios-unsigned.yml` zielony na kandydacie (kompilacja natywna; kod natywny bez zmian względem 1.1, ale to jedyna kontrola Linux→Xcode) | koordynator wyzwala | X-05 | CI ok. 20 min | otwarte — wejść brak (`workflow_dispatch` bez pól) |
| X-07 | **Pełny katalog E2E na standardowym iPhonie** (bramka App Store, CLAUDE.md „E2E — podział”): `e2e-ios.yml`, wejście `pakiet` = `pelny`; pozostałe domyślne (`urzadzenie` puste = iPhone 17, `wyglad` light, `tryb_scisly` false — jedno ponowienie scenariusza dozwolone, `aplikacja_z_przebiegu` puste, `tylko_scenariusze` puste). Test aktualizacji 33–34: `poprzednia_wersja_z_przebiegu` puste → `scripts/ci/poprzednia-wersja.sh` bierze najnowsze wydanie z plikiem `Trening-sim.zip` o innym SHA i wersji ≤ bieżącej = **v1.1.0-b1041** (plik `Trening-sim.zip` w tym wydaniu istnieje — sprawdzone 22.11.2026 przez `get_release_by_tag`, rozmiar 33 670 144 B). Zielony przebieg `pelny` spełnia też bramkę TestFlight (wymaga pakietu podstawowego „lub szerszego” dla tego samego SHA: `.github/workflows/testflight.yml:6`; wzorzec tytułu przyjmuje `pakiet=(podstawowy|pelny)`: `scripts/ci/bramka-e2e.sh:10`, z `sha=` równym SHA budowanego commitu — E2E i TestFlight muszą więc iść na **tym samym, końcowym SHA**, bez późniejszych commitów), więc **jeden przebieg `pelny` wystarcza na oba** | koordynator wyzwala; tester-e2e analizuje | X-05 | CI ok. 1,5 h | otwarte |
| X-08 | Rejestr ryzyk bez otwartych pozycji: `npm run check:release` = kod 0 na SHA kandydata | agent | X-05 | 1 min | otwarte — do uruchomienia na końcowym commicie |
| X-08b | Strona prywatności zgodna z 1.1.1: `site/privacy.html` ma znacznik „wersja aplikacji 1.1.1” (test `tests/audit-m1-013-privacy.test.ts` wymaga ≥ wersji z `app.json`); żywa strona ma jeszcze 1.1.0 — eksport `site/` do repo strony (jak docs/49 W-18) i `check-urls.yml` zielony przed zgłoszeniem | agent (eksport) + koordynator (przebieg) | X-05 | kilka min | znacznik w repo: zrobione 22.11.2026 (pełne verify wykryło; poprawione); eksport na żywo i `check-urls.yml`: otwarte — wymaga działania zewnętrznego, koordynator |

Bramka scenariuszy użytkownika z promptu roli (`scripts/sprawdz-scenariusze.mjs`, `docs/jakosc/przypadki-uzycia.md`) **nie istnieje w tym repo** (`ls scripts/sprawdz-scenariusze.mjs docs/jakosc` — brak); CLAUDE.md projektu ma pierwszeństwo, a jego odpowiednikiem jest katalog przepływów `tests/przeplywy.json` pilnowany przez verify. Zmiana 1.1.1 nie dodaje ekranu ani przepływu, więc katalog bez zmian.

### Faza B — TestFlight

| # | Krok | Kto | Zależy od | Czas | Stan (22.11.2026) |
|---|---|---|---|---|---|
| X-09 | **Build 1.1.1 na TestFlight**: `testflight.yml` bez wejść (zadanie `bramka` czeka na zielony E2E dla tego SHA; zadanie `tag` dopisuje tag `v1.1.1-bNNNN` i wiersz dziennika wydań — L-117). Najpierw przebieg dowodowy `bez_wysylki` = true? **Nie wymagany**: workflow niezmieniony od 1.1 (`git diff v1.1.0-b1041..HEAD -- .github/workflows/testflight.yml` pusty), a zmieniona jest tylko wersja (L-001 pkt 1 dotyczy zmian budowania/wysyłki) | koordynator wyzwala; właściciel zatwierdza środowisko `release` (2 min) | X-05…X-08 | CI ok. 1,5 h | otwarte |
| X-10 | **Telefon zaraz po buildzie** (L-001 pkt 3), lista zawężona do zmian od 1.1 — patrz pkt 3 niżej; ok. 5 min | właściciel | X-09 | 5 min | zrobione 22.11.2026 ~19:40 UTC (właściciel „OK”, czat koordynatora) |

### Faza C — App Store Connect (właściciel; agent przygotowuje)

Wszystkie kroki w <https://appstoreconnect.apple.com> → Apps → aplikacja. Strony Apple przeczytane **22.11.2026** (surowy HTML, cytat dosłowny):

| # | Krok | Kto | Strona Apple (odczyt 22.11.2026) | Czas | Stan (22.11.2026) |
|---|---|---|---|---|---|
| X-11 | **Nowa wersja 1.1.1**: „In the sidebar, click the add button (+) next to the desired platform. In the New Version dialog, enter an incremental App Store version number, then click Create. Review and enter metadata about the new version. When you create a new version, the metadata from the current version is automatically transferred to the new version.” Numer: `1.1.1` | właściciel | <https://developer.apple.com/help/app-store-connect/update-your-app/create-a-new-version/> | 1 min | zrobione 23.11.2026 ~05:22 UTC (właściciel „1.1.1 utworzona”); strony Apple przeczytane 23.11: „Existing metadata carries over from the current version.”; wymóg statusu bieżącej wersji „Ready for Distribution” |
| X-12 | **Metadane 1.1.1** przez `asc-metadane.yml`: najpierw `podglad`, potem `zapis` za `release` (nazwy, podtytuły, słowa kluczowe, whatsNew 33 lokalizacji ze `store/app-store-metadata.json`). Apple: „What’s New in this Version — A description of the changes in this version of the app, such as new features, UI improvements, or bug fixes. Limited to 4000 characters.”; „Description … Limited to 4000 characters.” Pierwszy zapis na jednym elemencie (L-001 pkt 1), potem całość | koordynator wyzwala; właściciel zatwierdza `release` | <https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information/> | 10 min | zrobione 23.11.2026 (podgląd 45117729248, zapis 45118431784: appInfo 29, wersja 32; sl pominięte — brak w ASC; kontrola 45118701989: 0 różnic; L-001 pkt 1 nie dotyczy — `scripts/asc/metadane.mjs` i `asc-metadane.yml` bez zmian od zapisu 43759074365); decyzja właściciela 23.11.2026: polski tytuł bez zmian |
| X-13 | **Zrzuty ekranu**: nie zmieniamy (metadane i nowa nazwa EN nie zmieniają obrazów; zrzuty z 1.1 przechodzą do nowej wersji — „the metadata from the current version is automatically transferred”). Wyjątek do decyzji: jeśli nazwa EN „Progressive Overload” ma trafić do podpisów zrzutów EN — wtedy `store-screenshots.yml` + `asc-zrzuty.yml` (zamien-podglad, zamien-zapis, KO-082) [DO USTALENIA: nie wskazuje na to żadna decyzja KO-110…KO-119; zakładamy brak zmian] | — | <https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/>: „You must include at least one screenshot and can upload up to 10 screenshots per device size” | 0 | zrobione 23.11.2026 — bez zmian zrzutów |
| X-14 | **App Review Information — Notes**: `store/review-notes.md` i `store/review-notes.en.txt` zmienione po 1.1 (diff w audycie); właściciel wkleja wersję EN, jeśli różni się od tej w ASC | agent przygotowuje, właściciel wkleja | platform-version-information (jw.; sekcja App Review Information) | 5 min | zrobione 23.11.2026 ~05:50 UTC (właściciel „gotowe”; `store/review-notes.en.txt` 3988 B) |
| X-15 | **`asc-kontrola.yml`** zielone tuż przed zgłoszeniem (oczekiwane wartości `store/asc-kontrola-oczekiwane.json` zmienione w AL2 — nazwy, podtytuły) | koordynator wyzwala | — (workflow własny) | — | zrobione 23.11.2026 — przebieg 45118997956: OK 42, RÓŻNICA 0, BŁĄD 0 (App Privacy tylko ręcznie, bez zmian kodu od 1.1) |
| X-16 | **Zakupy**: bez zmian treści produktów; nowa wersja nie wymaga ponownego zgłaszania zakupów (zakupy zgłoszono z 1.1 — docs/49 W-31); gdyby ASC wymagało ponownego dołączenia, krok jak W-24 | właściciel | — | 0–5 min | zrobione 23.11.2026 — bez zmian (problemu nie zgłoszono) |
| X-17 | **Build do wersji**: „In the sidebar, click the app version you want to submit. On the right, scroll down to the Build section and verify that you added the right build for the version.” Numer z tagu `v1.1.1-bNNNN` na SHA kandydata | właściciel; agent podaje numer | <https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-app/> | 3 min | zrobione 23.11.2026 ~05:58 UTC (właściciel „gotowe”): build 1042 |
| X-18 | **Opcja wydania**: Apple: „In the App Store Version Release section, select a release option: … Automatically release the app after approval: Select ‘Automatically release this version.’” Rekomendacja: automatycznie, jak w 1.1 (KO-084) | właściciel | <https://developer.apple.com/help/app-store-connect/manage-your-apps-availability/select-an-app-store-version-release-option> | 1 min | zrobione 23.11.2026 ~05:58 UTC (właściciel „gotowe”): „Automatically release this version” (decyzja KO-123, do weta) |
| X-19 | **Wydanie stopniowe**: rekomendacja — **bez** (jak 1.1, KO-083): wydanie bez zmian funkcji, a stopniowanie opóźnia także poprawę widoczności w sklepie. Apple: „you can choose to release your iOS app in stages… released over a 7-day period to a percentage of your users on iOS with automatic updates turned on” | właściciel | platform-version-information (sekcja Phased Release) | 1 min | zrobione 23.11.2026 ~05:58 UTC (właściciel „gotowe”): bez wydania stopniowego (decyzja KO-124, do weta) |
| X-20 | **Zgłoszenie**: „On the top right, click ‘Add for Review,’ and select whether to add the app version to an existing draft submission or create a new submission.” Potem „Draft Submissions” → „Submit for Review”: „Click Submit for Review.” | właściciel | <https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-app/> | 10 min | zrobione 23.11.2026 ~06:00 UTC (właściciel „gotowe”); stan „Waiting for Review” — wynik recenzji otwarte |

### Faza D — po zgłoszeniu

| # | Krok | Kto | Stan (22.11.2026) |
|---|---|---|---|
| X-21 | Recenzja Apple; odpowiedzi w Resolution Center (uwaga z 1.1: 2.1(b) „nie znaleziono zakupów” — odpowiedź z krokami; notatki z X-14 już je zawierają, jeśli zachowane w `store/review-notes.md`) | Apple; agent przygotowuje odpowiedź, właściciel wysyła | otwarte |
| X-22 | Po akceptacji: sprawdzenie wersji w sklepie, wiersz „Wydanie 1.1.1” w docs/09 z datą i dowodem, wpisy w docs/18; zobowiązania ZB-006 (ceny w sklepie), ZB-012 (ocena hipotez widoczności 26.12.2026 — punkt odniesienia: data wydania metadanych) | agent + koordynator | otwarte |

## 2. Kroki właściciela (osobno, z czasem)

| Krok | Co robi właściciel | Czas | Co agent przygotowuje wcześniej |
|---|---|---|---|
| X-09 | zatwierdzenie środowiska `release` dla `testflight.yml` | 2 min | zielone bramki X-05…X-08 |
| X-10 | telefon po buildzie (pkt 3) | 5 min | lista poniżej |
| X-11 | utworzenie wersji 1.1.1 w ASC | 1 min | — |
| X-12 | zatwierdzenie `release` dla `asc-metadane.yml` (podgląd, zapis) | 5 min | podgląd różnic |
| X-14 | wklejenie notatek EN (jeśli różnią się) | 5 min | `store/review-notes.en.txt` |
| X-17…X-20 | build do wersji, opcja wydania, wydanie stopniowe (nie), „Add for Review” → „Submit for Review” | ok. 15 min | numer buildu, strony Apple z tego dnia |

Razem ok. 35–40 min czasu właściciela; każdy krok osobno, po jednym, z instrukcją (CLAUDE.md: właściciela prowadzimy zadanie po zadaniu).

## 3. Telefon zaraz po buildzie — tylko zmiany od 1.1 (L-001 pkt 3; ok. 5 min)

Dowód zawężenia: od `v1.1.0-b1041` kod natywny i funkcje aplikacji się nie zmieniły (X-01, audyt A1), więc listy „tylko telefon” 1.1 (Zdrowie, ekran blokady, zakup, zegarek — docs/39, wynik 15.11.2026 „Wszystko działa”) nie powtarzamy. Zmienia się tylko to, co widać:
1. Aktualizacja z 1.1 (z App Store lub poprzedniego TestFlight): treningi, szablony i ustawienia na miejscu (dane — bez zmian schematu).
2. Ekran Trening: przy przycisku ✦ „Co nowego” jest kropka; po otwarciu u góry jeden punkt „Zaktualizowaliśmy informacje o RepsGoat w App Store…”, pod nim wpis 1.1 (zwinięty).
3. Ustawienia → wersja pokazuje 1.1.1 (numer buildu z TestFlight).
4. Nazwa pod ikoną nadal „RepsGoat”.

## 4. Szacunek czasu

- **Agent:** X-01…X-04 zrobione/w toku (ok. 1,5 h), X-05 verify 55–60 min, X-08, raport.
- **Czekanie:** `tests.yml` ok. 20 min, `ios-unsigned.yml` ok. 20 min, pełny E2E ok. 1,5 h, build TestFlight ok. 1,5 h, recenzja Apple (1.1: ok. 1 doba z jedną rundą pytań).
- **Właściciel:** ok. 35–40 min w kilku podejściach.

## 5. Luki

- X-13: brak decyzji o podpisach zrzutów EN — brak zmian zrzutów; **zamknięte 23.11.2026** (stan z koordynatora).
- X-11/X-16: ASC niewidoczne dla agenta — stan tych kroków tylko ze słów właściciela (23.11.2026: X-11 zrobione, X-16 bez zmian).
- Przekład „Co nowego” 1.1.1: bez recenzji native speakera (hu, fi, lt, lv, et, tr, hr, sl) — [DO USTALENIA], nie blokuje (ŚREDNIE → backlog 1.2).
