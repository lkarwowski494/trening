# Wynik roli 03-zakres, tryb fix — M1-audytor-generalny-037 (DEC-07 b) · 27–28.10.2026

Kopia robocza: `/home/user/trening/.claude/worktrees/agent-ab9baab932e7ee5e1`, gałąź `worktree-agent-ab9baab932e7ee5e1` (od `naprawy/M2-koordynator-napraw-2026-10-27-p3`, f775eb5c). Nic nie wypchnięte, nic nie scalone, workflowów nie uruchamiano.

## ETAP 0 — środowisko
Linux (bez Xcode), Node 22.22.0, git lokalnie (bez push — polecenie koordynatora), Playwright 1.63 + Chromium (`/opt/pw-browsers`) — zrzuty wersji web, sieć działa (strony Apple czytane `curl`, cytaty sprawdzone na surowym tekście), repo publiczne. Maszyna współdzielona: Jest tylko `--maxWorkers=1`, tylko testy związane.

## E0 — klasyfikacja i odstępstwa
- Pozycja zbiorcza rodzaju P z decyzją właściciela DEC-07 b (27.10.2026). Części: A — D (wdrożenie po decyzji; brzmienie wybrane przez rolę 03 z rekomendacji ról 02 i 08, do weta), B — D (dokumenty) + zamknięcie decyzji UA (opcja c z 02-monetyzacja-506, rekomendowana), C — część agenta (przejście poznawcze) + krok właściciela, D — przygotowanie (dane, strażnik, dokument) + kroki koordynatora i właściciela, backlog — D (dokument).
- Odstępstwa nazwane: kontrakt roli mówi „kodu nie zmieniasz”, a polecenie koordynatora zleca część A w kodzie — wykonane wg polecenia. `zakres.mjs` nie dotyczy (projekt bez kontraktu zakresu, DEC-02 z 20.10.2026) — zamiast niego testy i macierz. Bramka STOP E0 pominięta: zakres i wybór już rozstrzygnął właściciel (DEC-07 b).

## Commity → część (E2: dowody)

| SHA | Część | ID źródłowe | Test (przed → po) |
|---|---|---|---|
| 1a96768a | A — wiersz w Ustawieniach → „Subskrypcja” zależny od stanu | 02-monetyzacja-002, 08-programista-005, 04-studio-projektowe-006 | `tests/audit-m1-2026-10-27-037-wiersz-pelna-wersja.test.tsx`: 39 z 40 czerwonych → 40/40 (`dowody/037A-przed.txt`, `dowody/037A-po.txt`); testy związane 266/266 i 113/113 (`dowody/037A-zwiazane-2.txt`, `dowody/037A-zwiazane-3.txt`) |
| 2b5f8567 | B — plan „zły build” (docs/42 pkt 4) i zamknięcie decyzji UA, krok Z-10b | 10-wydanie-005, 02-monetyzacja-506 | `tests/audit-m1-2026-10-27-037-dokumenty-wydania.test.ts`: 6/6 czerwonych → zielone (`dowody/037B-przed.txt`); zmienione testy starego stanu: `tests/audit-m1-068-release-plan.test.ts`, `tests/decyzje-straznik.test.ts` |
| 170c13cc | C — test pierwszego użycia: przejście poznawcze 5 zadań, krok Z-37 | 03-zakres-008 | `tests/audit-m1-2026-10-27-037-pierwsze-uzycie.test.ts`: 9/9 czerwonych → 9/9 (`dowody/037C-przed.txt`, `dowody/037C-po.txt`) |
| 5c01c579 | D — podpisy zrzutów dla 27 kolejnych języków, docs/48 pkt 5 | 10-wydanie-004 | `tests/audit-m1-2026-10-27-037-podpisy-zrzutow.test.ts`: 29 z 32 czerwonych → 33/33 (`dowody/037D-przed.txt`, `dowody/037D-po.txt`) |
| 848f9b0d | Backlog z wersją w docs/21 | 03-zakres-006, 03-zakres-007, 11-wzrost-002, 11-wzrost-004, 02-monetyzacja-005 | ten sam plik co B, opis „backlog”: 6 czerwonych → 12/12 |

Na końcu: `tsc` 0 (`dowody/tsc-koniec.txt`), `npm run lint` 0 błędów (`dowody/lint-koniec.txt`), `check:i18n`, `check:claims`, `check:decyzje` (325 wpisów), `check:matrix`, katalog przepływów, kontekst tłumaczeń, README, kontrola BRD — zielone. Pełne `verify` i E2E — nie uruchamiane (polecenie).

**Zrzuty przed/po (A):** `dowody/zrzuty/A-przed-ustawienia-subskrypcja.png` (tytuł „Pełna wersja”), `dowody/zrzuty/A-po-ustawienia-subskrypcja.png` (tytuł „Zobacz plany Pro”), wersja web, PL, stan darmowy.

### Co zmienione (skrót)
- **A:** tytuł wiersza w `components/SubscriptionCard.tsx:17` — darmowy „Zobacz plany Pro” (ta sama etykieta co „Zobacz plany Pro ›” w oknie „Uczciwe zasady” i karcie po imporcie; CLAUDE.md: ta sama akcja = ta sama etykieta), z planem „Masz plan: {nazwa}” (jak nagłówek DEC-09 a); `planName` w jednym miejscu (re-eksport z `app/paywall.tsx`); strona wsparcia PL/EN prowadzi przez sekcję „Subskrypcja”; BRD BR-ZAK-003 „Wiersz w Ustawieniach”; Maestro 21 (tytuł z planem, po wygaśnięciu „See Pro plans”), 35, 56; katalog przepływów US-12.
- **B:** docs/42 pkt 4 — „Remove App From Sale”: zainstalowane kopie dalej dostają aktualizacje (cytat Apple, odczyt 27.10.2026); przyspieszona recenzja tylko po wysłaniu do recenzji, kroki odtworzenia w Notes, bez gwarancji. Wpis UA z 13.10.2026 → „zastąpione 27.10.2026” (opis od 21.10 mówi „porównywalnej”, przypis 1,06–1,51 €); krok Z-10b (eksport cen ze wszystkich krajów — właściciel; porównanie z 1,51 € — agent).
- **C:** `docs/design/test-pierwszego-uzycia.md` — 5 zadań z Q1–Q4; wynik: 5 × pozytywny, jedna porażka (NZ-037-1), dwie niepewności do testu z ludźmi („Plan” jako miejsce historii; wybór ćwiczenia w Postępach pod wykresem). Zrzuty `z1-…` do `z5-…` w katalogu `dowody/zrzuty/`, skrypt `narzedzia/przejscie.mjs.txt`.
- **D:** `store/screenshot-captions.json` — 9 podpisów × 27 języków (terminy jak w słownikach aplikacji), status „propozycja agenta 28.10.2026 … do recenzji lokalizacji”; strażnik sprawdza też, że każdy znak jest w czcionce ramek (odczyt tabeli cmap). docs/48 pkt 5: [OTWARTE] o dziedziczeniu rozstrzygnięte — Apple: nowy język domyślnie bierze zrzuty języka podstawowego (u nas polskiego; odczyt 28.10.2026); warunki przed Z-16 i kroki koordynatora.

## Nowe teksty — do recenzji lokalizacji (rola `recenzent-lokalizacji`)
1. Klucz UI `Zobacz plany Pro` (EN „See Pro plans”) w 32 słownikach + nakładka pt-BR — wyprowadzony z istniejącej, zrecenzowanej etykiety „Zobacz plany Pro ›” bez „ ›” (strażnik pilnuje równości).
2. Podpisy zrzutów: 27 języków × 9 ekranów w `store/screenshot-captions.json` (cs, sk, hu, ro, hr, uk, es, es-419, pt, pt-BR, de, fr, it, nl, sv, da, nb, fi, tr, el, id, ms, vi, ru, ja, ko, zh-Hant). Do sprawdzenia przez native speakera szczególnie: it „historia” (skrót „ads”), vi „historia”, fr „plan”, el „import”, ko/ja (styl).

## Kroki koordynatora
1. Przegląd ścieżki wrażliwej (zakupy, część A) — nieodbyty; polecenie: `przeglad-sciezki-wrazliwej.md` w tym katalogu.
2. Recenzja lokalizacji (punkt wyżej), poprawki przez tłumacza, status języków „zrecenzowane DD.MM.RRRR”.
3. Po scaleniu partii: pełne `npm run verify` (uwaga: NZ-037-3 — test S5 czerwony już na bazie p3), E2E `tylko_scenariusze`: 21, 35, 56.
4. Strona wsparcia zmieniona (`site/support.html`): eksport do repo strony i Z-10a (`check-urls.yml`).
5. Zrzuty (D), po warunkach z docs/48 pkt 5 ppkt 6: `store-screenshots.yml` (`jezyki: all`, `wyglad: dark`) → `watch-sim.yml` (`jezyki_zrzutow: all`) → przegląd każdego obrazu (L-004) → akceptacja właściciela → `asc-zrzuty.yml` dry-run (32 lokalizacje × iPhone i zegarek „wgraj”) → apply za `release`. Czas zegarowy ok. 2–3 h maszyn macOS, jeden naraz.

## Kroki i decyzje właściciela
1. **Akceptacja podpisów EN** zrzutów (dziś „propozycja”) — warunek Z-16.
2. **Podpis pierwszego ekranu wobec przekazu K6 (23.10.2026)** — dziś PL „Twój trening zostaje w Twoim telefonie” = hasło z 13.10, zastąpione przekazem „szybki zapis serii, także z zegarka; dane tylko na telefonie; bez konta”. (a) zostawić — zaakceptowany 14.10, zdanie prawdziwe, zero pracy; (b) zmienić na „Szybki zapis serii, także z zegarka” / „Log sets fast, even from your watch” — zgodne z przekazem startowym i z tym, co pokazuje pierwszy zrzut (tablica serii); koszt: przekład jednego podpisu na 27 języków i recenzja (agent, ok. 0,5 h). **Rekomendacja: (b).**
3. **Weto brzmienia A:** „Zobacz plany Pro” (spójne z dwoma istniejącymi wejściami) albo alternatywa roli 04 „Kup pełną wersję” (zgodna z K1 „jedna nazwa”, ale nowa etykieta tej samej akcji i 33 przekłady). Kwestia „Pro” obok „Pełna wersja” zostaje przy M1-audytor-generalny-009 — przy zmianie wszystkie trzy wejścia zmieniają się razem.
4. **Z-10b:** eksport cen planu miesięcznego ze wszystkich krajów z App Store Connect (ok. 5 min) — agent porówna z 1,51 €.
5. **Z-37 po premierze:** test pierwszego użycia z 3–5 osobami bez instrukcji (ok. 1 h; protokół w `docs/design/test-pierwszego-uzycia.md`).
6. Weto wersji i warunków backlogu w docs/21 (propozycja roli 03 z rekomendacji znalezisk).

## Nowe znaleziska (nie naprawiane)

### NZ-037-1 · Wyszukiwanie ćwiczenia po polsku nie znajduje ćwiczeń z angielską nazwą i podsuwa ćwiczenie własne
- Pozycja listy kontrolnej: ZAK-06 (SP-09)
- Poziom: P2 (droga bez wyszukiwania — partia „klatka” → „Bench Press (sztanga)” — działa)
- Realność: realny (użytkownik PL) · Pewność: wysoka
- Rodzaj: P
- Dowód: zrzut `dowody/zrzuty/z1b-szukaj-po-polsku-03-szukaj-wyciskanie.png` — „wyciskanie” daje tylko „Wyciskanie na linkach (stojąc)”, „Wyciskanie nad głowę (linki)” i „Utwórz „wyciskanie””; filtr po nazwie `app/picker.tsx:32` (nazwa z biblioteki i `exName`, bez polskich aliasów). Utworzenie własnego „wyciskanie” rozdziela historię i Postępy od „Bench Press”. Przy okazji: biblioteka miesza nazwy angielskie (DEC-13) z dwiema polskimi.
- Opcje: (a) polskie aliasy wyszukiwania dla ćwiczeń podstawowych (dane + test) — 1.0.1; (b) przy „Utwórz „X”” podpowiedź najbliższych ćwiczeń z biblioteki — tańsza osłona przed duplikatem; (c) bez zmian. Rekomendacja: (a) w 1.0.1, (b) jeśli taniej przed 1.0 — decyzja właściciela.
- Test akceptacyjny: wyszukanie „wyciskanie” / „przysiad” / „martwy ciąg” pokazuje odpowiednie ćwiczenia z biblioteki przed „Utwórz”.

### NZ-037-2 · „Kopia zapasowa” i „backup”, „plik JSON” na jednym ekranie
- Poziom: P2 · Realność: realny · Rodzaj: P (słownictwo — rola 04/09). Dowód: `app/more/backup.tsx:23`, zrzut `dowody/zrzuty/z4-kopia-02-kopia.png`. Krok się udaje; dwa słowa na jedną rzecz i termin techniczny.

### NZ-037-3 · Strażnik S5 czerwony na bazie partii 3 (przed zmianami tej roli)
- Poziom: P1 dla procesu (pełne `verify` nie przejdzie) · Realność: realny · Rodzaj: D. Dowód: `tests/interaction-guards.test.ts` „style: 'cancel' tylko w lib/confirm.ts” zgłasza `app/_layout.tsx:99` (okno „Nie udało się zapisać danych” z commita ca846687, M1-015); plik nietknięty przez tę rolę (`dowody/037A-zwiazane.txt`). Opcje: przycisk przez `lib/confirm.ts` albo nazwany wyjątek w strażniku — decyzja wykonawcy M1-015.

### NZ-037-4 · Zrzuty D3 (10. ekran „cwiczenie”) niewdrożone
- Poziom: P2 · Rodzaj: P/D. Decyzja D3 A (25.10.2026, docs/48 pkt 5) — karta ćwiczenia z grafiką jako drugi zrzut „po wejściu grafik”; w `scripts/screens/store-seed.test.ts` i w podpisach jest 9 ekranów. Wymaga zadania dla roli 08 (trasa, akcja, podpisy PL/EN do akceptacji) i zgodności z regułą recenzji grafik (CLAUDE.md, 27.10.2026). Poza zakresem 037.

Drobne naprawione po drodze: opis w `store/screenshot-captions.json` wskazywał nieistniejący `tests/store-frames.test.ts` — teraz wskazuje strażnik D.

## Otwarte
Akceptacja EN i decyzja o pierwszym podpisie (właściciel); recenzja przekładów; Z-10b (eksport cen); uruchomienie workflowów zrzutów (koordynator); Z-37 (po premierze); przegląd ścieżki wrażliwej; pełne verify i E2E po scaleniu; publikacja strony wsparcia; NZ-037-1…4. „Zweryfikowane” nadaje reaudit.

## Kontrola dowodów i sekretów
Wynik skryptu `sprawdz-raport.mjs` (kopia w `narzedzia/`): zob. ostatnia linia pliku `dowody/sprawdz-raport.txt`.
