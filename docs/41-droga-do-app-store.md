# 41. Droga do pierwszego wydania w App Store (stan 14.10.2026)

Lista braków do „Submit for Review” po wydaniu 0.20 w TestFlight. Pierwsza wersja w sklepie = **1.0** (zawartość 0.20 + poprawki z audytu;
„Co nowego” czyszczone przy 1.0 — koordynator, 14.10.2026). Źródła w repo: docs/15 (App Store, ceny, metadane PL/EN z 11.10), docs/18
(decyzje), docs/27 (subskrypcja), docs/39 (lista kontrolna właściciela), docs/40 (rejestr ryzyk), `store/`. Strony Apple — tylko przeczytane
14.10.2026 (lista na końcu). Czas „agent” = praca agenta (z równoległością); „czekanie” = CI, Apple; „właściciel” = czas właściciela (CLAUDE.md).

Wpis do App Store Connect: **API** = koordynator przez App Store Connect API (jak `scripts/asc/iap-localizations.mjs`), **ręcznie** = właściciel w przeglądarce.

## Ścieżka krytyczna

**Kolejność (zmiana właściciela 18.10.2026, zastępuje ustalenie z 14.10.2026):** najpierw **pełny audyt w obecnym repo** (po scaleniu 0.20)
i naprawy blokerów, **dopiero potem** przenosiny do organizacji GitHub **Apps4Brew** (plan Free) — nowe publiczne repo z **jednym commitem ze stanem
po naprawach**; build 1.0 do sklepu z nowego repo (`BUILD_BASE` wyżej niż ostatni build); stare repo → prywatne archiwum. (Było 14.10: przenosiny
zaraz po 0.20, audyt i poprawki już w nowym repo.)

```
0.20: A1 TestFlight 0.20 (CI ~1,5 h) → A2 telefon: docs/39 + R-001…R-003 (właściciel 20–30 min)
  → scalenie 0.20 do main (właściciel 5 min)
  → A3 pełny głęboki audyt w obecnym repo (agent 4–6 h) → A4 naprawy blokerów + verify + E2E (agent: zależy; CI ~2 h)
  → B2 włączenie płatności (D-1 = P) → B3 piaskownica (właściciel 30–45 min; TestFlight z obecnego repo)
  → E1 przenosiny: kroki właściciela W1–W5 (ok. 45 min) + agent (2–3 h; jeden commit ze stanem po naprawach) → zielony verify i TestFlight z nowego repo (CI ~2 h)
  → A6/A7 build 1.0 z nowego repo → TestFlight → szybka próba na telefonie (CI ~1,5 h, właściciel 15 min)
  → C1/C3 zrzuty z buildu 1.0 (CI ~2–3 h)               ┐
  → D3/D4 metadane 31 lokalizacji (agent ~4 h, równolegle z A3) ├→ F1 wysyłka (właściciel 20 min) → recenzja Apple
  → E3/E4 DSA zweryfikowane + skrzynka support@ (czekanie)  ┘
```

Najdłuższe ogniwa poza agentem: **weryfikacja DSA** (czeka na Apple; od niej zależy skrzynka support@ — E4) i **audyt z naprawami** (A3–A4).
Blok C i D (przygotowanie tekstów, próbny przebieg zrzutów) idzie równolegle z audytem; wpis przez API dopiero na buildzie 1.0.

### Kroki właściciela przy przenosinach (E1) — osobno, z czasem

| Krok | Co | Czas |
|---|---|---|
| W1 | GitHub: organizacja **Apps4Brew** (plan Free), puste **publiczne** repo (bez README) | 10 min |
| W2 | Sekrety repo (Settings → Secrets and variables → Actions): `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8` (ten sam klucz co dziś albo nowy); zmienne: `MAESTRO_VERSION` (jeśli była), `NIGHTLY_REFS` | 10 min |
| W3 | Ustawienia bezpieczeństwa: Secret scanning + Push protection, Actions → „Fork pull request workflows” — wymagane zatwierdzenie, środowisko „release” z zatwierdzeniem (decyzja F4 z 12.10), Pages → Source: GitHub Actions (jeśli D-2 = B) | 15 min |
| W4 | Dostęp sesji agenta do nowego repo (claude.ai → GitHub) | 5 min |
| W5 | Po zielonym TestFlight z nowego repo: stare `lkarwowski494/trening` → Settings → Change visibility → **Private** (nie usuwać); przedtem adresy prywatności/wsparcia w App Store Connect na nowe (D-2) | 5 min |

### Co przenosimy (agent, E1)

- **Kod i dokumenty:** migawka drzewa po audycie i naprawach blokerów jako jeden commit (bez historii); przed migawką skan sekretów i e-maili (testy repo publicznego) i sprawdzenie, że w drzewie nie ma danych właściciela.
- **Workflowy:** wszystkie z `.github/workflows/` (tests, e2e-ios, nightly, tests-tz, ios-unsigned, testflight, watch-sim, pages, asc-iap-localizations, store-screenshots); `testflight.yml`: `BUILD_BASE` wyżej niż ostatni build w App Store Connect (ostatni numer z TestFlight 0.20); `nightly.yml`: `NIGHTLY_REFS` na gałęzie nowego repo.
- **Sekrety:** tylko przez właściciela (W2); w repo nic.
- **Skrypty App Store Connect:** `scripts/asc/iap-localizations.mjs` (identyfikator grupy subskrypcji i bundle bez zmian — ta sama aplikacja w App Store Connect).
- **Adresy w kodzie:** `PRIVACY_URL` (lib/products.ts) wg D-2, link „GitHub Issues” w `site/support.html` (PL/EN), `s.homepage` w 3 podspecach (`modules/*/*.podspec`, test w `tests/public-repo.test.ts`), linki na stronie apps4brew.com do privacy/support.
- **Pages z privacy/support:** `site/` + `pages.yml` (D-2 = B) albo kopia do repo strony apps4brew.com (D-2 = A); stare adresy github.io działają do W5.
- **Pierwszy przebieg w nowym repo:** `npm run verify` (tests.yml), `ios-unsigned.yml`, `testflight.yml` (strażnik uprawnień) — dowód, że sekrety i podpis działają przed audytem.

## Lista braków

Legenda „Blokuje”: **TAK** — bez tego nie da się wysłać albo wysyłka łamie zasadę właściciela / ryzykuje odrzucenie; **nie** — można później.

### A. Build, jakość, wersja

| # | Co | Kto | Wpis | Zależy od | Blokuje | Agent | Właściciel |
|---|---|---|---|---|---|---|---|
| A1 | TestFlight 0.20 (`testflight.yml`), strażnik uprawnień zielony — zamyka R-001 | agent (CI) | — | gałąź f020-wydanie scalona | TAK | 0,5 h (+ CI ~1,5 h) | — |
| A2 | Lista kontrolna docs/39 (13 punktów) + R-002 (Zdrowie po poprawce podpisu), R-003 (zegarek) | właściciel | — | A1 | TAK (rejestr ryzyk) | — | 20–30 min (R-003 tylko z zegarkiem — patrz D-7) |
| A3 | **Pełny głęboki audyt całości** (w obecnym repo, po scaleniu 0.20 — zmiana 18.10.2026) (CLAUDE.md „Audyty i wydania” pkt 4: „przed upublicznieniem w App Store … pełny głęboki audyt”), z listą stałą: dane, migracje, prywatność, sekrety, prawa autorskie (grafiki w paczce, docs/15 pkt 8), elementy specyficzne dla właściciela (docs/15 pkt 7) | agent (audytor) | — | scalenie 0.20 (zakres zamrożony od startu audytu) | TAK | 4–6 h | 15–30 min (decyzje przy znaleziskach) |
| A4 | Naprawy KRYTYCZNYCH/WYSOKICH z A3: test odtwarzający + verify + E2E (bez drugiego audytu) | agent | — | A3 | TAK | zależy od znalezisk | decyzja „naprawa albo wyłączenie”, gdy bloker wymaga przebudowy |
| A5 | Notatki dla recenzenta — **szkic gotowy** (`store/review-notes.md`, PL+EN, test `tests/store-review-notes.test.ts`); sprawdzić na buildzie 1.0 | agent | API | A6 | TAK (2.1: „detailed explanations of non-obvious features and in-app purchases in the App Review notes”) | 0,5 h | 10 min (akceptacja) |
| A6 | Wersja 1.0: `app.json` 1.0.0, „Co nowego” wyczyszczone, testy wersji | agent | — | A4 | TAK | 0,5–1 h | — |
| A7 | Build 1.0 → TestFlight → szybka próba (instalacja, Zdrowie, zakup jeśli D-1 = P) | agent + właściciel | — | A6, E1, B2 | TAK | 0,5 h (+ CI ~1,5 h) | 15 min |
| A8 | Export compliance: `ITSAppUsesNonExemptEncryption: false` (app.json, test w `tests/public-repo.test.ts`) — aplikacja bez sieci, szyfrowanie tylko systemowe | **zrobione** | — | — | nie | potwierdzić w A3 | — |

### B. Zakupy (tylko przy D-1 = P)

| # | Co | Kto | Wpis | Zależy od | Blokuje | Agent | Właściciel |
|---|---|---|---|---|---|---|---|
| B1 | Produkty, ceny, Family Sharing (dawna oferta wprowadzająca uchylona 22.10.2026 — M5 S1; brak ofert potwierdzony kontrolą ASC 39822823188), lokalizacje 33 języków (bez `sl` — L-003) | **zrobione** (14.10.2026) | API/ręcznie | — | — | — | — |
| B2 | `PAYWALL.ENABLED = true` (lib/access.ts) + aktualizacja testów i scenariusza E2E 21 w zwykłym buildzie | agent | — | D-1, A4 | TAK | 1–2 h (+ CI) | — |
| B3 | Piaskownica na telefonie (docs/39 US-13): zakup każdego planu, „Przywróć zakupy” po ponownej instalacji, tryb samolotowy, zwrot, Chmura rodzinna, blokada po limicie dni; brak oferty wprowadzającej w arkuszu Apple | właściciel | — | B2, A7 | TAK (3.1.1 przywracanie; 2.1(b) zakupy „functional”) | — | 30–45 min (+10 min konto piaskownicy) |
| B4 | **Zrzut ekranu zakupu do przeglądu** (pole „App Review Screenshot” przy każdym produkcie: „A screenshot of the In-App Purchase that clearly shows the item or service being offered”) — workflow `store-screenshots.yml`, wejście `zrzut_zakupu_z_przebiegu` (aplikacja E2E ze sztucznym sklepem) albo zrzut z piaskownicy | agent (CI) lub właściciel | API | B2 | TAK | 0,5 h (+ CI ~30 min) | 0 (albo 5 min zrzut z telefonu) |
| B5 | „Review Notes” każdej subskrypcji — wymagane przy ofercie wprowadzającej („Required if the subscription offers introductory pricing”); propozycja w `store/review-notes.md` | agent | API | — | TAK | 10 min | — |
| B6 | Pierwsze zakupy każdego typu **w tym samym zgłoszeniu co wersja aplikacji** („The first … In-App Purchase of each type must be submitted with a new app version”; grupa subskrypcji razem z subskrypcją) | właściciel (przy F1) | ręcznie | B4, B5 | TAK | — | w F1 |
| B7 | Ryzyko do sprawdzenia przy F1: strona Apple „In-App Purchases and subscriptions aren't supported on Apple Watch. To submit an Apple Watch app version, remove all in-app purchases” — dotyczy osobnej wersji watchOS; nasz zegarek jest częścią aplikacji iOS, więc spodziewamy się, że nie dotyczy **[DO POTWIERDZENIA w App Store Connect]** | właściciel | — | — | możliwe | — | 2 min (spojrzenie przy F1) |

Przy D-1 = F: B2–B6 odpadają; produktów **nie** dodajemy do zgłoszenia, z opisu znika blok cenowy (2.1(b): zakupy, których nie da się znaleźć w aplikacji, wymagają wyjaśnienia).

### C. Zrzuty ekranu

**Podpisy i ramki (D-6 B, 14.10.2026):** zadanie `ramki` (ubuntu, ImageMagick i czcionki Noto CJK z apt, IBM Plex Sans z `node_modules` — 0 zł, bez nowych
zależności aplikacji) składa każdy zrzut w obraz o **tym samym rozmiarze** (1206 × 2622 / 1320 × 2868): tło `BRAND.paper`, podpis `BRAND.ink` u góry,
zrzut pomniejszony do 78% z zaokrągleniem i obwódką `BRAND.signal`, bez kanału alfa (`scripts/ci/store-frames.sh`). Języki bez zatwierdzonych podpisów
są pomijane z ostrzeżeniem (surowe zrzuty zostają w artefakcie). Agent: tłumaczenia podpisów 33 języków po akceptacji PL/EN (~1 h); właściciel: akceptacja 8 podpisów (5 min).

| # | Co | Kto | Wpis | Zależy od | Blokuje | Agent | Właściciel |
|---|---|---|---|---|---|---|---|
| C1 | iPhone: wymagany „iPhone with Dynamic Island (medium display)” (np. iPhone 17 Pro, 1206 × 2622) + zalecany „large display” (iPhone 17 Pro Max, 1320 × 2868; bez niego Apple użyje 6,5″ albo przeskaluje). Do 10 zrzutów na rozmiar i język. **Workflow gotowy: `.github/workflows/store-screenshots.yml`** (tylko ręcznie; nieuruchomiony) | agent (CI) | API | A7 (zrzuty z buildu 1.0) | TAK | 1 h (przegląd obrazów) | 15 min (akceptacja zestawu) |
| C2 | iPad — **niepotrzebny**: `supportsTablet: false` w app.json („iPad (if your app supports iPadOS)”) | — | — | — | nie | — | — |
| C3 | Apple Watch — **wymagane** („Required for Apple Watch apps”; ten sam rozmiar we wszystkich lokalizacjach) — `watch-sim.yml`, wejście `jezyki_zrzutow: all` (Series 10/11 → 416 × 496) | agent (CI) | API | A7 | TAK | 0,5 h | — |
| C4 | Podgląd wideo (App Preview) | — | — | — | nie (opcjonalny) | — | — |

**Jak działa C1 (14.10.2026):** zadanie `dane` (ubuntu) tworzy zmyślone dane dla 35 języków (`scripts/screens/store-seed.test.ts` — szablony
demonstracyjne, 15 treningów z 5 tygodni, trening w toku, dwa miejsca); `build` buduje Release na symulator **bez sztucznego sklepu i zegarka**;
`zrzuty` (macierz 6,9″ / 6,3″) zapisuje dane w bazie aplikacji (Library/SQLite/trening.db, klucz `state` — bez zmian w kodzie aplikacji),
ustawia pasek stanu 9:41, otwiera 8 ekranów łączem `trening://…` i robi `simctl io screenshot` (`scripts/ci/store-screenshots.sh`, wzór:
`watch-screenshots.sh`). Testy: `tests/store-screenshots.test.ts` (workflow, trasy, skrypt z podstawionym `xcrun`). Artefakty 3 dni.
**Koszt:** repo publiczne → minuty macOS bez opłat (CLAUDE.md). Orientacyjnie: build ~40 min + 2 maszyny × (rozruch ~8 min + ~1 min na język)
→ `pl,en` ≈ 1 h zegarowo; `all` (35 języków) ≈ 1,5–2 h zegarowo, ~150 min maszyn macOS. **Niesprawdzone (pierwszy przebieg):** czy
`simctl openurl` ze schematem `trening://` otwiera ekran bez okna potwierdzenia i czy expo-router przyjmuje ścieżkę bez ukośnika; czy pytanie
o powiadomienia nie zasłania ekranu. Nazwy szablonów na zrzutach są PL (pl) albo EN (pozostałe języki) — to dane użytkownika, aplikacja ich nie tłumaczy.

### D. Metadane (App Store Connect → wersja i App Information)

Co jest w repo: **nazwy** 31 lokalizacji (`store/app-store-names.json`, test długości); **PL/EN**: podtytuł (dwa warianty), słowa kluczowe,
tekst promocyjny, opis — projekt z 11.10 w docs/15 (stan funkcji 0.12); **pozostałe 29 lokalizacji: brak** podtytułu, opisu i słów kluczowych.
Zakupy: lokalizacje gotowe (`store/iap-localizations.json`).

| # | Co | Kto | Wpis | Zależy od | Blokuje | Agent | Właściciel |
|---|---|---|---|---|---|---|---|
| D1 | Nazwa (≤ 30 znaków) — gotowa, 31 lokalizacji | **zrobione** | API | — | — | — | — |
| D2 | Podtytuł (≤ 30 znaków): wybór wariantu (D-4), potem tłumaczenia | agent (tlumacz) | API | D-4 | nie (pole opcjonalne), ale ASO | 0,5 h | 5 min |
| D3 | Opis PL/EN odświeżony do 1.0: zegarek, głos, „Dostosuj do miejsca”, odczyt Zdrowia, import CSV; integracja ze Zdrowiem w opisie (2.5.1: „indicate that integration in their app description”); blok cenowy i link do standardowej licencji Apple (decyzja 14.10) tylko przy D-1 = P; bez nazw innych aplikacji (2.3.7) | agent | API | D-1, A4 (zakres 1.0) | TAK (opis wymagany) | 1 h | 15 min (akceptacja PL/EN) |
| D4 | Tłumaczenia opisu, słów kluczowych (≤ 100 **bajtów** — „up to 100 bytes”; PL dziś 97 B), podtytułu i tekstu promocyjnego na 29 lokalizacji + przegląd językowy | agent (tlumacz; opcjonalnie przegląd Gemini) | API | D3 | TAK dla lokalizacji z nazwą (bez opisu lokalizacja się nie zapisze) | 3–4 h | 0 (albo 15 min na prompt do Gemini) |
| D5 | Adresy: Privacy Policy URL (wymagany), Support URL (wymagany; „must lead to actual contact information (legal address, email address, telephone number), as may be required by local law”), Marketing URL (opcjonalny) | **zrobione w kodzie 14.10.2026** (D-2 A: `PRIVACY_URL`, `SUPPORT_URL`, `store/app-store-urls.json`); strony w repo apps4brew.com — commit lokalny, przegląd i push: koordynator | API | E4 (działająca skrzynka) | TAK | — | — |
| D6 | Copyright („2026 …” — imię i nazwisko sprzedawcy; nie wpisujemy do repo) | właściciel | ręcznie | — | TAK („This property is required”) | — | 2 min |
| D7 | App Review Information: kontakt (imię, telefon, e-mail — tylko w App Store Connect), „Sign-in required” wyłączone, notatki (A5) | właściciel + agent | ręcznie (kontakt), API (notatki) | A5, E5 | TAK | — | 5 min |
| D8 | Kategoria Health & Fitness, wiek 9+, App Privacy „Data Not Collected” (opublikowane przez właściciela 14.10.2026) | **zrobione** | — | — | — | — | — |
| D9 | Zgodność App Privacy z kodem 1.0: zegarek (WatchConnectivity, sesja treningu) i głos (syntezator iOS) nie wysyłają danych — strona prywatności **uzupełniona dziś** (`site/privacy.html`, sekcje „Apple Watch” i „Zapowiedzi głosowe”, test w `tests/public-repo.test.ts`) | agent | — | publikacja strony (D-2) | TAK (5.1.1(i)) | **zrobione** (do publikacji) | — |
| D10 | Ceny i dostępność aplikacji (darmowa do pobrania, kraje), punkt cenowy UA (otwarte w docs/15) | właściciel | ręcznie | D-1 | TAK (dostępność) | — | 10 min |
| D11 | Opcja wydania po akceptacji (ręcznie / automatycznie / data) — D-5 | właściciel | ręcznie | — | nie (domyślna zadziała) | — | 1 min |
| D12 | „What's New” — nie dotyczy pierwszej wersji | — | — | — | nie | — | — |

### E. Prawo, repozytorium, kontakt

| # | Co | Kto | Wpis | Zależy od | Blokuje | Agent | Właściciel |
|---|---|---|---|---|---|---|---|
| E1 | **Czysta historia git = nowe publiczne repo w organizacji Apps4Brew (plan Free) z jednym commitem ze stanem 0.20** (decyzja 12.10.2026, A; termin: po audycie i naprawach blokerów w obecnym repo — zmiana właściciela 18.10.2026), stare repo → prywatne archiwum. Kroki właściciela W1–W5 i lista przenoszonych rzeczy — wyżej, „Ścieżka krytyczna” | właściciel + agent | — | A3–A4 (audyt i naprawy), D-2 (adresy) | TAK (reguła właściciela „przed App Store”, docs/15 pkt 1 i 8) | 2–3 h (+ CI ~2 h) | ok. 45 min (W1–W5) |
| E2 | Prawa autorskie: cytaty w `docs/research` pilnuje `tests/research-quotes.test.ts`; research konkurencji na Dysku; podobieństwo wskazówek do źródeł sprawdzone (docs/09 rozdz. G); licencje zależności w verify (`check:licenses`). Zostaje: dawne długie cytaty w historii gita → znikają z E1; grafiki w paczce → A3 | agent | — | E1, A3 | TAK (część E1/A3) | w A3 | — |
| E3 | Status tradera DSA — **w weryfikacji** (Apple). **[DO POTWIERDZENIA]**: czy przed zakończeniem weryfikacji można wysłać wersję i czy blokuje to tylko dystrybucję w UE | właściciel | ręcznie | Apple | TAK dla UE | — | czekanie |
| E4 | Google Workspace + skrzynka support@apps4brew.com (aliasy support@, hello@) — **dopiero po weryfikacji DSA** (koordynator, 14.10.2026). Bez niej: przycisk „Napisz do nas” w aplikacji prowadzi do nieistniejącej skrzynki (funkcja nie do użycia — próg WYSOKI), Support URL bez działającego kontaktu, notatki recenzenta bez kontaktu | właściciel | ręcznie | E3 | TAK | — | 30 min (+ DNS/MX ręcznie, bez ruszania istniejących rekordów) |
| E5 | Polityka prywatności: znacznik „[DO WERYFIKACJI: badacz RODO/DPA]” w komentarzu `site/privacy.html` (sekcja „Gdy do nas piszesz”) — sprawdzić przed publikacją adresu w sklepie | agent (badacz) | — | E4 (dostawca poczty) | TAK (prywatność) | 1–2 h | — |
| E6 | Nominacja „App Launch” ok. 4 tyg. przed premierą (plan marketingu 13.10) | właściciel | ręcznie | data premiery | nie | — | 10 min |

### F. Wysyłka

| # | Co | Kto | Wpis | Zależy od | Blokuje | Agent | Właściciel |
|---|---|---|---|---|---|---|---|
| F1 | Wersja 1.0 w App Store Connect: build, zrzuty, metadane, zakupy w tym samym zgłoszeniu (B6) → „Add for Review” → „Submit for Review” | właściciel (koordynator przygotowuje przez API) | ręcznie | wszystko z TAK | — | 0,5 h (sprawdzenie kompletności przez API) | 20 min |
| F2 | Recenzja Apple; po odrzuceniu: odpowiedź w Resolution Center, naprawa wg progu | Apple / agent | — | F1 | — | zależy | czekanie — czas recenzji wg Apple: co najmniej 50% zgłoszeń < 24 h, 90% < 48 h (<https://developer.apple.com/distribute/app-review/>, odczyt 29.10.2026; docs/48 Z-30) |
| F3 | Plan wydania 1.0 (`docs/42-plan-wydania-1.0.md`, DEC-22): wydanie ręcznie po kontroli na telefonie, aktualizacje stopniowo 7 dni, postępowanie przy złym buildzie; lista kontrolna wydania 1.0 (punkt 5 planu) | właściciel + agent | ręcznie | F2 | TAK (punkt listy kontrolnej) | 0,5 h (utrzymanie planu) | 10 min |

## Decyzje właściciela (14.10.2026, przez koordynatora)

| Decyzja | Wybór | Skutek w liście braków |
|---|---|---|
| D-1 płatności | **P — płatności od 1.0** | B2–B6 na ścieżce krytycznej; blok cenowy w opisie |
| D-2 adresy privacy/support | **A — https://apps4brew.com/trening/privacy.html i …/support.html** | strony w repo strony apps4brew.com (przegląd i push: koordynator); `PRIVACY_URL`, `SUPPORT_URL` (lib/products.ts) i linki w `site/`, `store/` zmienione 14.10.2026; ten sam adres w App Store Connect |
| D-3 czyste repo | po audycie i naprawach w obecnym repo (zmiana 18.10.2026; było: zaraz po 0.20) | E1 |
| D-4 podtytuł | **zastąpione 21.10.2026 (STOP 2 M5, docs/45): PL „Serie i przerwy. Bez konta”, EN „Workout tracker. No account.”** · było: ~~A — prywatność/offline~~ → ~~zmiana właściciela 14.10.2026: EN „Clean gym log. No account.”, PL „Przejrzysty dziennik bez konta”~~ (26 i 30 znaków); „clean / przejrzysty” także w pierwszym zdaniu opisu i w słowach kluczowych EN | D2: `store/app-store-metadata.json` (33 lokalizacje, M5) |
| D-5 publikacja | **A — ręcznie** | D11 |
| D-6 zrzuty | **B — z podpisami i ramkami** (wbrew rekomendacji A) | C1: krok `ramki` w `store-screenshots.yml`, podpisy w `store/screenshot-captions.json` (PL/EN do akceptacji, reszta języków po akceptacji — tłumacz); ramka własna z kolorów marki, **bez obudów urządzeń Apple** (wytyczne Apple Marketing: „Use Apple-provided product bezels” i „Use Apple product images “as is” and without modification” — https://developer.apple.com/app-store/marketing/guidelines/, przeczytane 14.10.2026; obudowy Apple wymagałyby licencji Apple Design Resources i nie wolno ich wkładać do publicznego repo — dlatego neutralna ramka, nie imitacja telefonu) |
| D-7 zegarek | **B — pożyczony prawdziwy Apple Watch** | A2: R-003 sprawdzany na prawdziwym zegarku (właściciel, ok. 30 min) |

## Decyzje produktowe — warianty (historia, przed decyzjami z 14.10.2026)

- **D-1. Płatności w 1.0.** P: `PAYWALL.ENABLED = true` od pierwszej wersji (zgodne z decyzjami 06.10 i 09.10: „Nie będzie użytkowników za darmo”; kod i testy gotowe od 0.17) — kompromis: piaskownica, przegląd zakupów (B2–B6), więcej powodów odrzucenia (3.1.2), ok. 1 dzień dłużej. F: 1.0 za darmo, płatności w aktualizacji — szybsza i prostsza recenzja, ale późniejsze odebranie darmowego dostępu to skarga nr 1 z researchu (docs/15) i odwrócenie decyzji 06.10. **Rekomendacja: P.**
- **D-2. Gdzie mieszkają polityka prywatności i wsparcie.** Dziś działa tylko https://lkarwowski494.github.io/trening/privacy.html (i support.html); apps4brew.com/… zwraca 404, a strona główna apps4brew.com (GitHub Pages) linkuje do github.io. Adres prywatności jest wpisany w aplikację (`PRIVACY_URL` w lib/products.ts) i w App Store Connect. A: **apps4brew.com/trening/privacy.html i …/support.html** — adres niezależny od repozytorium i jego przenosin, zgodny z marką; kompromis: strony trzeba publikować w repo strony apps4brew.com (kopia z `site/` przy każdej zmianie albo workflow). B: GitHub Pages nowego repo w organizacji (np. apps4brew.github.io/trening/…) — bez dodatkowej pracy, ale adres znowu zależy od repo. C: zostawić github.io starego repo — **psuje się** po zmianie repo na prywatne przy W5 (GitHub Pages dla repo prywatnych wymaga płatnego planu — **[DO POTWIERDZENIA]** na stronie GitHuba). **Rekomendacja: A**; decyzja potrzebna przed W5 i przed buildem 1.0 (adres jest w aplikacji).
- **D-3. (rozstrzygnięte 14.10.2026, zmienione 18.10.2026)** — audyt i naprawy w obecnym repo, potem czyste repo (jeden commit) i 1.0 z nowego repo (E1).
- **D-4. Podtytuł.** A: o prywatności i offline (plan marketingu 13.10: PL „Plan i serie offline bez konta”, EN „Private, offline plans & sets”). B: funkcje (docs/15: „Plan, serie i timer przerw”, „Plans, sets & progress offline”). Kompromis: A wyróżnia na tle konkurencji, B ma więcej słów wyszukiwanych. **Rekomendacja: A** (słowa funkcji zostają w słowach kluczowych).
- **D-5. Wydanie po akceptacji.** A: ręcznie (właściciel klika „Release” — wpisy w społecznościach i nominacja w jednym dniu). B: automatycznie zaraz po akceptacji — szybciej, bez kontroli momentu. **Rekomendacja: A.**
- **D-6. Zrzuty.** A: same ekrany z symulatora (gotowy workflow, 0 zł, 35 języków automatycznie). B: z podpisami/ramkami (2.3.3 dopuszcza nakładki tekstu) — lepsza konwersja, ale grafik do przygotowania i tłumaczenia podpisów. **Rekomendacja: A na 1.0**, B po premierze.
- **D-7. Zegarek bez prawdziwego Apple Watch.** Właściciel nie ma zegarka (docs/35), R-003 wymaga sprawdzenia na prawdziwym zegarku. A: wydać 1.0 z zegarkiem po testach na symulatorze (XCUITest, `watch-sim.yml`) — ryzyko błędu widocznego dopiero u użytkowników. B: pożyczyć zegarek na 30 min przed wysyłką. C: wyłączyć zegarek w 1.0 (wraca w aktualizacji) — bez zrzutów zegarka (C3 odpada), ale wycofanie celu z buildu to zmiana projektu i nowy przebieg testów. **Rekomendacja: B**, jeśli realne w kilka dni; inaczej A z wpisem w rejestrze ryzyk.

## Przeczytane strony Apple (14.10.2026)

- App Review Guidelines — https://developer.apple.com/app-store/review/guidelines/ (2.1 i 2.1(b) zakupy „complete, up-to-date, visible to the reviewer and functional”; 2.3.3 zrzuty; 2.3.7 nazwa ≤ 30, bez nazw innych aplikacji i cen w nazwie/podtytule/zrzutach; 2.3.9 „fictional account information”; 2.5.1 HealthKit w opisie; 3.1.2 subskrypcje; 5.1.1(i) polityka prywatności w metadanych i w aplikacji; 5.1.3 dane zdrowotne).
- Screenshot specifications — https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/
- Submit an In-App Purchase — https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-in-app-purchase/
- In-App Purchase information (App Review Screenshot) — https://developer.apple.com/help/app-store-connect/reference/in-app-purchases-and-subscriptions/in-app-purchase-information/
- Required, localizable, and editable properties (Review Notes subskrypcji) — https://developer.apple.com/help/app-store-connect/reference/app-information/required-localizable-and-editable-properties/
- Platform version information (Notes ≤ 4000 bajtów, Keywords ≤ 100 bajtów, Promotional Text ≤ 170, Support URL, Copyright) — https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information/
- App information (Name, Subtitle ≤ 30, Privacy Policy URL) — https://developer.apple.com/help/app-store-connect/reference/app-information/app-information/
- Overview of export compliance — https://developer.apple.com/help/app-store-connect/manage-app-information/overview-of-export-compliance/
- Manage app privacy — https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy/

## Zrobione 14.10.2026 (gałąź f020-sklep)

- `.github/workflows/store-screenshots.yml`, `scripts/ci/store-screenshots.sh`, `scripts/screens/store-seed.test.ts` — zrzuty do App Store (C1, B4); testy `tests/store-screenshots.test.ts`, lista workflowów w `tests/public-repo.test.ts`.
- `store/review-notes.md` — notatki dla recenzenta PL/EN (A5, B5); test `tests/store-review-notes.test.ts`.
- `site/privacy.html` — sekcje „Apple Watch (opcjonalnie)” i „Zapowiedzi głosowe” PL/EN, data 14.10.2026 (D9); test w `tests/public-repo.test.ts`.
- 14.10.2026 (po decyzjach właściciela): D-2 A — `PRIVACY_URL`/`SUPPORT_URL` w lib/products.ts = https://apps4brew.com/trening/privacy.html i …/support.html,
  `store/app-store-urls.json` (dla API), test `tests/store-urls.test.ts`; eksport stron do repo strony marki `scripts/site/export-apps4brew.mjs`
  (test `tests/site-export.test.ts`; źródłem treści zostaje `site/`; po każdej zmianie `site/privacy.html` lub `site/support.html` — ponowny eksport i commit w repo strony).
- D-6 B — podpisy i ramki: `store/screenshot-captions.json` (podpisy PL/EN; EN zaakceptowane 28.10.2026, decyzja 10a), `scripts/ci/store-frames.sh`, zadanie `ramki`
  w `store-screenshots.yml` (artefakt `sklep-zrzuty-ramki`), test `tests/store-frames.test.ts`.
- 14.10.2026 (scenorys właściciela, 9 ekranów): dane pokazowe przebudowane (`scripts/screens/store-seed.test.ts`: 12 tygodni Push/Pull/Nogi pon/śr/pt
  z progresją w kg, sobotni FBW w ostatnich 3 tygodniach, plan z dniami wolnymi, trening w toku z przerwą, okno „Dostosuj” w domu, zmyślony CSV
  do podglądu importu; warianty stanu: trening, adapt, jasny, ciemny — ekrany 3 i 7 w ciemnym motywie); akcje na ekranach przez Maestro
  (`scripts/ci/maestro-sklep/`: wykres e1RM, przewinięcie do sylwetki strażnika, poprzedni pełny miesiąc w kalendarzu — `testID` `month-prev`/`month-next`
  w components/HistoryCalendar.tsx, wybór pliku CSV); podpisy 9 ekranów (PL i EN zaakceptowane). Opis sklepu PL/EN z funkcją
  „Strażnik progresji” i podtytuł D-4 A: `store/app-store-metadata.json` (projekt do akceptacji; test `tests/store-metadata.test.ts`).
  Ograniczenia: porównanie miesiąca liczy dni 1–N bieżącego miesiąca (zrzut z 1.–3. dnia miesiąca byłby słaby); nazwy ćwiczeń biblioteki
  w PL są takie, jak w aplikacji (część po angielsku); nazwy szablonów w innych językach — EN.
- 18.10.2026 (właściciel): wszystkie zrzuty do App Store w ciemnej wersji aplikacji (zastępuje „1–2 ekrany w ciemnym motywie”): dane pokazowe
  w ciemnym motywie (`STORE_SEED_THEME=light` tylko na żądanie), symulator w trybie ciemnym (wejście `wyglad`, domyślnie dark), ramka i podpis
  w kolorach ciemnego motywu (`dark.bg`, `dark.text`, `dark.accent` z lib/theme.ts; kontrast podpisu > 7:1 w teście). Okna systemowe po łączu
  („Open in …?”) i pytanie o powiadomienia zatwierdza Maestro (`scripts/ci/maestro-sklep/dialogi.yaml`) — wykryte w przebiegu 39143133368.
