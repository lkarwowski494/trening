# Audyt 1.1 (W-10) — znaleziska zbiorczo

Data: 11.11.2026. Badany kod: **79117f33** (`integracja-1-1`; 0fa2f448 to ten sam kod plus 2 commity samych dokumentów, potwierdził koordynator). Plan: [plan.md](plan.md). Raport roli 07 z werdyktem: [07-jakosc-2026-11-11.md](07-jakosc-2026-11-11.md).
Raporty źródłowe audytorów (bez zmian treści; ścieżki do plików roboczych dotyczą sesji audytu, tych plików nie ma w repozytorium): [DAT](DAT.md), [SEC](SEC.md), [APL](APL.md), [MER](MER.md), [FIG](FIG.md), [UX](UX.md), [LOK](LOK.md), [TST](TST.md), [DIF](DIF.md) (różnica do `wyd/w08-1-1`).

Zasady: próg z CLAUDE.md („Audyty i wydania”): blokują tylko KRYTYCZNE i WYSOKIE. Każde KRYTYCZNE i WYSOKIE sprawdził drugi, niezależny agent, który dostał tylko twierdzenie i wskazany dowód.

## Liczby

| Waga | Liczba | ID |
|---|---|---|
| KRYTYCZNE | 0 | — |
| WYSOKIE | 1 | MER-01 |
| ŚREDNIE | 10 | APL-01, DAT-01, SEC-01, SEC-02, UX-01, UX-02, FIG-01, TST-01, TST-02, DIF-01 |
| NISKIE | 10 | APL-02, DAT-02, SEC-03, MER-02, FIG-02, FIG-03, UX-03, LOK-01, TST-03, DIF-02 |

TST-01 zgłoszone jako WYSOKIE, po weryfikacji ŚREDNIE (warunek zamknięcia W-15 przed App Store).

## WYSOKIE (blokują wydanie, do W-11)

### MER-01 · Animacje 7 ćwiczeń balistycznych pokazują czasy faz bez źródła („Opuszczanie 2 s” w zamachu)
- **Waga:** WYSOKIE (po weryfikacji: potwierdzone dla 7 ćwiczeń; weryfikator dopuszcza ŚREDNIE, jeśli uznać licznik faz za czysto ilustracyjny — patrz „Decyzje”).
- **Realność:** realny — każde otwarcie techniki tych ćwiczeń i strona z ćwiczeniami.
- **Ćwiczenia:** Kettlebell Swing, One-Arm KB Swings, Kettlebell Clean, Double KB Clean, Dumbbell Clean, KB Sumo High Pull, Bottoms-Up Clean From The Hang.
- **Kroki:** Ćwiczenia → np. Kettlebell Swing → Technika → pod rysunkiem „Podnoszenie 1 s · Pauza · Opuszczanie 2 s”.
- **Dowód:** sonda weryfikatora (`shownFigureSpec` + `phasesFor`) — tryb `wahadlo`, fazy 1000 / 500 / 2000 ms dla wszystkich 7; tekst: `components/ExerciseFigureV2.tsx:122`; wyjątek z czasów tylko dla rwań i podrzutów: `lib/figures/v2/rodziny/kb_ballistic.ts:9`; projekt sam usuwa sekundy „z braku źródła” w ruchach jednokierunkowych: `lib/figures/v2/anim.ts:79`; wpis T-059 (`docs/research/rejestr-twierdzen.json:911-926`) — konwencja 2 s / 1 s ze źródłami o hipertrofii, nie o ruchu balistycznym; strona: `scripts/strona/eksport.mjs:136`; recenzje kb_ballistic r1–r4 nie oceniały sekund wahadła; brak wpisu w docs/21.
- **Odrzucone z pierwotnego zakresu:** Clean Pull i Snatch Pull — decyzja 05.11.2026 po recenzji r6 celowo zostawia je jako wahadło z sekundami (`docs/18-przekazanie.md:264-265`).
- **Naprawa (tania):** fazy bez sekund (`untimed`) dla wahadeł rodziny kb_ballistic; zawęzić T-059 do ruchów niebalistycznych.
- **Test akceptacyjny:** dla 7 kluczy fazy tylko „Pauza” albo bez sekund; Bench Press nadal 2 s / 1 s; data decyzji w teście.

## ŚREDNIE i NISKIE (backlog z wersją, przez koordynatora do docs/21)

| ID | Waga | Realność | Tytuł | Dowód | Propozycja wersji |
|---|---|---|---|---|---|
| APL-01 | ŚREDNIE | realny | Trening z samego cardio prowadzony z zegarkiem trafia do Zdrowia jako trening siłowy | `targets/watch-app/WorkoutController.swift:44`, `modules/watch-link/ios/WatchLinkHub.swift:70`; telefon nie zapisuje, gdy zapisał zegarek (`lib/watch/health.ts:20`) | 1.2 |
| DAT-01 | ŚREDNIE | — (luka testu) | Test zapisu b1033 porównuje część pól; plik zapisu bez większości rodzajów danych | `tests/migrate-released.test.ts:38-49`; bogaty zapis audytora: migracja b1033 → kandydat i cofnięcie bez strat | 1.1.x (tani: dodać bogaty zapis) |
| SEC-01 | ŚREDNIE | brzegowy | Klucz ASC jako sekret repozytorium — 5 zadań czyta go bez `environment: release` | `asc-status-wersji.yml:28`, `asc-kontrola.yml:28` i 3 zadania podglądu; `docs/43-przekazanie.md:165` | 1.2 (decyzja: osobny klucz tylko do odczytu) |
| SEC-02 | ŚREDNIE | realny | 56 cytatów ponad limit (2 zdania / 300 znaków) w `docs/research` w publicznym repo; SEC2-03 bez wpisu w docs/21 i zobowiązaniach | `tests/research-quotes.json`, `docs/research/25-biblioteka/L1-zrodla.md` | 1.1.x |
| UX-01 | ŚREDNIE | realny | VoiceOver czyta angielskie nazwy ćwiczeń polskim głosem (trening na żywo, Szablony, Postępy) — nowe w 1.1 (ZB-044), wbrew wzorcowi 34 | sonda: 130 z 274 trafień bez języka; `exName` w 22 plikach, `exNameLang` w 11 | 1.1.x; podnieść do WYSOKIE, jeśli na telefonie niezrozumiałe (lista „tylko telefon”) |
| UX-02 | ŚREDNIE | realny | Znaczki ✓/✕ na rysunku to przyciski w elemencie-obrazie — VoiceOver ich nie widzi (treść dostępna w opisie) | `components/ExerciseFigureV2.tsx:103` i 50–53; strażnik S19 `tests/interaction-guards.test.ts:268-279` nie widzi komponentu podrzędnego | 1.2 |
| FIG-01 | ŚREDNIE | realny | Triceps Dips (ławka): docs/18 mówi „bez rysunku”, aplikacja pokazuje rysunek v1 | `components/ExerciseCues.tsx:45`; `docs/18-przekazanie.md:368` | decyzja: ukryć v1 albo poprawić zapis |
| TST-01 | ŚREDNIE (po weryfikacji; zgłoszone jako WYSOKIE) | realny (proces) | Domyślny E2E aktualizacji instaluje 1.0.1 b1037, nie 1.0.0 b1033 (z której aktualizują się użytkownicy App Store); ścieżka `retireCatalog` (1.0.0 → 1.1) w E2E niesprawdzona | `scripts/ci/poprzednia-wersja.sh:10-24`, `.github/workflows/e2e-ios.yml:263`, `:112-116` (artefakt 1 dzień), opis wejścia nieaktualny `:42`; luka już otwarta jako W-15 (`docs/49-wydanie-1-1.md:53`) | **warunek W-15 przed App Store**: przebieg na refie `v1.0.0-b1033` (zadanie build), w ciągu doby pełny katalog kandydata z `poprzednia_wersja_z_przebiegu`; trwale: wejście z tagiem wydania |
| TST-02 | ŚREDNIE | — (proces) | Kandydat bez E2E od 902 commitów i bez `tests-tz.yml` (nocą tylko `main`) | ostatni E2E integracji 42285310215 (06.11, 1f339f4c); tests-tz na integracji 02.11 | przed W-13: dopisać bramkę do docs/49 albo integrację do `NIGHTLY_REFS` |
| APL-02 | NISKIE | brzegowy | Chip usuniętego miejsca w edycji szablonu to przycisk bez działania | `app/template/[id].tsx:115` | 1.2 |
| DAT-02 | NISKIE | brzegowy | Odhaczenie z ostatnich 300 ms ginie przy awarii aplikacji | `lib/state/core.ts:169-170` | backlog |
| SEC-03 | NISKIE | — | Polityka prywatności nie wymienia przypomnienia o ważeniu (lokalne; nic nie wychodzi z telefonu) | `site/privacy.html` | 1.1.x |
| MER-02 | NISKIE | — | T-060 „przegląd badań” z pustą listą źródeł (liczba poprawna) | `docs/research/rejestr-twierdzen.json` (T-060), `docs/research/22-serie-deload-generator.md:64` | 1.1.x |
| FIG-02 | NISKIE | — | 3 rysunki v1 bez arkusza śladu i pól autor/recenzent (recenzja sprzed L-047/L-050) | sekcja v1 `docs/research/figury-recenzja.json` | 1.2 |
| FIG-03 | NISKIE | — | Strażnik toru bierze widoki rodziny — widok Wall Ball z przodu niesprawdzany | `tests/figures-v2-tor.test.ts:18` | 1.2 |
| UX-03 | NISKIE | — | Nieużywany import `firstSteps` | `app/(tabs)/index.tsx:20` | backlog |
| LOK-01 | NISKIE | realny | „Trening — opinia” po angielsku w ro i it | `lib/locales/ro.json`, `lib/locales/it.json` | 1.1.x |
| TST-03 | NISKIE | — | CLAUDE.md i `tests.yml` mówią o 4 częściach Jest / 14 min; faktycznie 5 części / 15,5 min | `CLAUDE.md:16`, `tests.yml` (`czesci_jest: 5`) | 1.1.x |

## Do sprawdzenia (pewność ≤ 80%)

- APL: Ask to Buy — czy pusty wynik zakupu z openiap jest traktowany jak sukces (brak komunikatu „czeka na zgodę”; dostępu nie daje). Piaskownica z kontem dziecka.
- FIG: Skullcrusher (dół przy czubku głowy vs „tuż nad czołem”), Upright Row (hantle w połowie klatki vs „do barków”), Arnold Press (obrót przed wyciskaniem vs „naraz”), Hanging Leg Raise (słupek przez sylwetkę) — do recenzji ruchu (bramka 4); strażnik L-047 porównuje autor/recenzent tylko jako nazwy ról.
- DAT: wycofanie wide-grip zmieniło normalizację bez podbicia schematu — pytanie o regułę, bez wpływu na dane.
- LOK: 585 pozycji `CATALOG_LIB_EXTRA` bez nazwy lokalnej (zakres ZB-044?); el — 11 nazw po łacinie; brak testu długości przycisków.
- UX: kontrast napisów tablicy „Pierwszy trening”; przyciski w elementach VoiceOver na innych ekranach (sonda renderu wszystkich tras).
- MER: próbka 10 cytatów źródeł nie wykonana — sieć sesji blokuje openstax, pmc, who.int i in.; badacz z dostępem sprawdza `cytaty` S4–S17, S28 w `data/zrodla/role-miesni.json`.

## Weryfikacja KRYTYCZNYCH i WYSOKICH

| ID | Weryfikator (niezależny agent) | Wynik |
|---|---|---|
| MER-01 | sonda Jest na 79117f33 + przegląd docs/18, rejestru, recenzji | potwierdzone dla 7 ćwiczeń (WYSOKIE warunkowo — patrz „Decyzje”); Clean Pull i Snatch Pull odrzucone (decyzja 05.11, r6) |
| TST-01 | przegląd skryptu, `gh api releases`, e2e-ios.yml na tagu b1033, SCHEMA_VERSION na 3 tagach | mechanizm potwierdzony; „nie da się wskazać b1033” obalone (obejście przez przebieg na tagu); luka zapisana w W-15; Jest W-16 (`tests/migrate-released.test.ts:24`) osłania dane → ŚREDNIE, warunek zamknięcia W-15 |

## Różnica do `wyd/w08-1-1` (sesja U: KO-047, 1.1.0, „Co nowego”)

Zakres: `git diff 79117f33 origin/wyd/w08-1-1` (głowa 83baf759, 102 pliki), ten sam próg. Raport: [DIF](DIF.md). **0 KRYTYCZNYCH, 0 WYSOKICH.**

| ID | Waga | Realność | Tytuł | Dowód | Propozycja |
|---|---|---|---|---|---|
| DIF-01 | ŚREDNIE | realny | „Co nowego” obiecuje nazwę w języku użytkownika pod nazwą ćwiczenia, a każdy język ma 277 nazw lokalnych na 708 ćwiczeń — przy pozostałych nic się nie pokazuje | `lib/nazwy-lokalne.generated.ts`, `lib/i18n.ts:155-161` | przed wysyłką 1.1 (tanie): „przy wielu ćwiczeniach…” + przekład 2 zdań + recenzja lokalizacji |
| DIF-02 | NISKIE | — | `tests/whats-new.test.tsx:41` przekroczył 5000 ms na obciążonej maszynie (sam plik 14/14, kod 0) | log w raporcie DIF | podnieść limit tego testu |

Sprawdzone bez uwag: pozostałe twierdzenia „Co nowego” zgodne z kodem (rysunki 528/708 = „większość”), limity sklepu (słowa kluczowe ≤ 100 B, podtytuł ≤ 30), KO-047 z recenzją niezależną (autor ≠ recenzent, `slad`; testy 215/215), wersja 1.1.0 bez zmiany schematu, `site/privacy.html` tylko numer wersji. Pole `whatsNew` w metadanych sklepu jeszcze puste — znane W-22.
