# M2 — plan wykonania — Trening — 2026-10-28 (pętla 2)
Plan: kontrola planu kod 0 (49 zadań, 10 decyzji, 0 bez wyboru; dowody/M2/p2/kontrola-planu-start.txt) · Pętla 2 (1 wpis `reaudyty`) · Audyt 025a50b · Reaudyt 2385e75 · Baza **4c116d0** (gałąź audyt/m1-reaudit-2026-10-28 = main 2385e75 + 2 commity tylko docs/18) · Stan wyjściowy: npm ci 0, typecheck 0, lint 0 (dowody/M2/p2/stan-*.txt); pełny Jest — CI tests.yml zielone na 2385e75 (40657525976) i 316b666 (40658116200), na 4c116d0 w toku; lokalnie 539/539 zestawów w reaudycie.
Bramka D-025: docs/monetyzacja.md:77 werdykt „wydać” → pełny zakres dozwolony.

## Odstępstwa (zasada 7)
- `tools/assemble.mjs` i kopie `sprawdz-plan.mjs`/`zakres-napraw.mjs`/`sprawdz-raport.mjs` zablokowane przez zasady uprawnień sesji („kod z zewnątrz”). Prompt M2 złożony własnym skryptem w scratchpadzie (te same części, kolejność i podstawienia co skrypt; przeczytany w całości), kontrola planu — własne odtworzenie reguł sprawdz-plan w scratchpadzie. Kolejkę układam ręcznie według reguł zakres-napraw (partia, zależności, poziom, ID); statusy w planie zapisuję własnym kodem z tymi samymi warunkami co `--zatwierdz`/`--ustaw`/`--blokada`.

## Pętla 2: zadania otwarte do ponownego zatwierdzenia (21)
Wszystkie mają status `otwarte`; bez Twojego ponownego zatwierdzenia nie wolno mi ich ruszyć.

| ID | Poziom | Rodzaj → wykonawca | Co nie działało po pętli 1 / co nowe |
|---|---|---|---|
| 006 | P1 | D → M2 | R-010: brak zapisu zamknięcia przeglądu API 28.10 w docs/40:22; docs/16:368 „przegląd natywny otwarty” sprzeczne z decyzją 21.10 (docs/18:404); lista sprawdzonych zdań tylko w artefakcie CI (wygasa 04.11) |
| 038 | P1 | P (DEC-10 a) → rola 06 | 31 kart bez figury + karty v2 bez zapisu recenzji bramki 4; strażnik filtruje tylko figury |
| 039 | P1 | P (DEC-11 a) → rola 04 | „Zarządzaj subskrypcją” niedostępne dla VoiceOver (karta `accessible` z przyciskiem w środku) |
| 040 | P2 | D, regresja od 031 | ru/uk/bg/sr/el: „кг” obok „m” w podpisie przerwy (lib/live.ts na sztywno) |
| 041 | P2 | D, regresja od 031 | el: „κιλά” w kroku ± i nagłówku kolumny (nie mieści się, VoiceOver bez odmiany) |
| 042 | P2 | D, regresja od 013 | po błędzie migracji następny start pokazuje „zamknęła się nieoczekiwanie” |
| 043 | P2 | D, regresja od 025 | „›” w „Pierwszych krokach” z limitem skali 2,0 zamiast 1,4; strażnik nie renderuje stanu |
| 044 | P2 | D, regresja od 010 | posiadany plan wyszarzony opacity — kontrast 3,52:1 / 4,06:1 |
| 045 | P2 | D, regresja od 037 | notatki App Review prowadzą do „Full version”, a wiersz ma „See Pro plans”/„Masz plan: …” |
| 009 | P2 | P (DEC-02 a) → rola 07 | resztka: podgląd liczb 1.0.1 bez wpisu w docs/21; K1 w docs/18 „otwarte → M1-009” |
| 012 | P2 | D | R-010 bez stanu z datą (zależy od 006); reszta ryzyk to kroki telefonu (bramka działa) |
| 017 | P2 | D | site/ poprawione i wdrożone na Pages (2385e75), ale **apps4brew.com** ma starą treść: check-urls kod 1 dziś (dowody/M2/p2/017-check-urls-start.txt) — wymaga eksportu do repo apps4brew-www i push tam |
| 023 | P2 | D | e2e-ios.yml:52 opisuje bramkę App Store bez ponowień (sprzeczne z CLAUDE.md 21/26.10); wiersz R-015 |
| 011 | P2 | D | metoda NFR-DOS-001 opisuje tylko Jest; „dziś bez treningu” przy największym tekście bez kroku na liście telefonu |
| 021 | P2 | M (DEC-05) → rola 06 | „palce na zewnątrz zwykle 15–20°” z jednym przeczytanym źródłem szczebla 4 (wymagane 2) |
| 032 | P2 | D | kod diagnostyczny w e-mailu tylko z ekranu pętli awarii; przy błędzie migracji/bazy bez kodu |
| 034 | P2 | D | zakres testów mutacyjnych bez zmian (07-jakosc-010) |
| 046 | P2 | D | oferta dla darmowych przy płacącym offline; rada „anuluj subskrypcję” dla członka Chmury |
| 047 | P2 | D | check:decyzje nie wykrywa „otwarte → ID” po naprawie; BRD i docs/39 nieaktualne |
| 048 | P2 | D | podpis zrzutu „Gotowe szablony albo własne” przeczy kodowi (templates: []) w 29 językach |
| 049 | P2 | D | strażnik limitu rozmiaru pomija lib/figures (3 pliki > 20 KB) |

## Kolejka i gałęzie (od bazy 4c116d0)
| Partia | Gałąź | Zadania (kolejność) | STOP przed partią |
|---|---|---|---|
| 1 — blokery | naprawy/M2-koordynator-napraw-2026-10-28-p1 | 006 (D), 039 (P→04), 038 (P→06) | tak z reguły (P) — **proponuję pominąć**: wybory DEC-10 a i DEC-11 a już zapisane, polecenia ról pokażę w raporcie |
| 2 — regresje i tanie P2 | …-p2 (od końca p1) | 040, 041, 042, 043, 044, 045, 012 (po 006), 023, 009 (P→07), 017 | nie (tylko D i P z wyborem); 017 wymaga działania zewnętrznego — pkt 4 |
| 3 — reszta P2 | …-p3 (od końca p2) | 011, 021 (M→06), 032, 034, 046, 047, 048, 049 | 021 to M — źródła rozstrzyga rola 06; dane użytkownika: żadne zadanie nie zmienia schematu ani zapisu (042/032 dotyczą tylko ekranu błędu) |

## Plan per ID
| ID | Rodzaj | Test (co sprawdza) albo polecenie roli | Pliki | Reguły obszaru | Dane? |
|---|---|---|---|---|---|
| 006 | D | strażnik: R-010 w docs/40 ma stan z datą i odnośnikiem do listy zdań w repo; docs/16 bez „przegląd natywny otwarty” sprzecznego z docs/18 21.10 | docs/40, docs/16, docs/lokalizacja/raport-api-2026-10-28/ (lista z artefaktu CI, przed 04.11) | 09 tryb fix, i18n-expo | nie |
| 039 | P→04 | strażnik: żaden `accessible` bez roli przycisku nie zawiera potomka z `onPress` (czerwony na bazie); scenariusz 21 stuka „Manage subscription” → E2E `tylko_scenariusze` | app/paywall.tsx, tests/, .maestro scenariusz 21 | 04 tryb fix, docs/32 | nie |
| 038 | P→06 | niezależna recenzja treści 37 kart (31 bez figury + v2) przez rolę 06 w świeżym kontekście (nie autor treści); strażnik w verify: ćwiczenie ze wskazówkami ⇒ wpis recenzji z aktualnym skrótem wskazówek; mutacja wskazówki v2 unieważnia wpis | scripts/zrodla-runtime.mjs, rejestr recenzji, lib/cues | 06 tryb fix, CLAUDE.md „Animacje i karty” | nie |
| 040 | D | test 5 języków: podpis przerwy z lokalnym symbolem dystansu | lib/live.ts | 08, i18n-expo | nie |
| 041 | D | el: krótka forma w nagłówku ≤ 56 pt, etykieta VoiceOver z odmianą | lib/locales/el.json, lib/units* | 09 | nie |
| 042 | D | po wyjątku migracji kolejny start nie pokazuje komunikatu pętli awarii | lib/ (strażnik startu) | 12 | nie (tylko znacznik startu) |
| 043 | D | strażnik GLYPH renderuje „Pierwsze kroki”, limit 1,4 | komponent Pierwszych kroków | 04 | nie |
| 044 | D | kontrast ≥ 4,5:1 obu motywów (kolor z systemu, nie opacity) | app/paywall.tsx | 04 | nie |
| 045 | D | strażnik notatek: ścieżka = bieżąca etykieta wiersza; docs/49 T-11 | store/review-notes.md, docs/49 | 10 | nie |
| 012 | D | każdy wiersz rejestru ryzyk ma stan z datą (po 006) | docs/40 | 07 | nie |
| 023 | D | jedno źródło bramek, reszta odsyła (e2e-ios.yml komentarz, R-015) | docs, komentarz workflowu | 07 | nie |
| 009 | P→07 | wpis podglądu liczb 1.0.1 w docs/21; K1 w docs/18 → zamknięte | docs/21, docs/18 | 07 | nie |
| 017 | D | check-urls kod 0 po eksporcie | scripts/site/eksport-apps4brew.mjs → repo apps4brew-www | 10 | nie |
| 011, 032, 034, 046–049 | D | testy z pól „test akceptacyjny” planu | wg raportów | 04/12/07/02/05/10 | nie |
| 021 | M→06 | drugie przeczytane źródło szczebla 4 dla 15–20° albo `[DO USTALENIA]` + blokada (tekst zostaje do decyzji — pkt 5) | rejestr twierdzeń | 06 | nie |

## Sesje ról: (a) subagenci po kolei, wynik sprawdzam ja (rekomendacja) · (b) nowe sesje otwierane przez Ciebie
Role 06 (038, 021), 04 (039), 07 (009) + recenzent-lokalizacji, jeśli zmienią się teksty (039, 041, 045, 048).

## Push gałęzi partii
Gałąź robocza po każdym commicie (nie scalenie, nie wydanie); stan K na gałąź audyt-m1-1-0-2026-10-27 przy każdym STOP (bez prompty/, narzedzia/, skryptów). Zgoda raz na cały plan.

## Weryfikacja przed push (CLAUDE.md)
(a) test:fast + hak pre-push przy każdym push, CI tests.yml po każdym push, pełne `npm run verify` raz na koniec każdej partii (jak w pętli 1 — wyjątek nazwany, lokalnie pełny Jest ok. 70 min) — **rekomendacja**; (b) pełne verify przed każdym push — zgodne z CLAUDE.md co do litery, ok. 20 dodatkowych przebiegów × ~70 min.

## Koszt (czas agenta; kalibracja: szacunek ÷ ok. 5)
- Partia 1: plan 5–7 h → realnie ok. 1–1,5 h agenta; czekanie: E2E scenariusza 21 (40–60 min macOS), CI ok. 30 min.
- Partia 2: plan 6–8 h → ok. 1,5 h; czekanie: CI, verify.
- Partia 3: plan 8–10 h → ok. 2 h; czekanie: CI, verify.
- Twój czas: ta odpowiedź (decyzje 1–6), zgoda na repo apps4brew-www (017), na końcu decyzja o scaleniu. Tokeny: role jako subagenci ok. 1–2 mln.

## Czego nie zrobię
Telefon (R-004, R-005, R-013, R-014, R-RES, AK-05, T-04, waluta T-11), App Store Connect (wklejenie notatek 045 i podpisów zrzutów 048 — przygotuję tekst), build kandydata (TestFlight tylko po Twoim zatwierdzeniu). K bez kopii na gałęzi audytu przepada z kontenerem — wypycham go przy każdym STOP.

## Decyzje
1. Zakres pętli 2: (a) wszystkie 3 partie przed zgłoszeniem — ok. 4,5–5 h agenta (rekomendacja: P2 są tanie, 6 to regresje z poprzedniej pętli, a reaudyt i tak przejdzie całość) · (b) partie 1–2 teraz, partia 3 → backlog 1.0.1 z wersją (krócej o ok. 2 h; 011/021/032/046–049 zostają w wydaniu) · (c) tylko partia 1 (blokery).
2. Sesje ról: (a) subagenci po kolei (rekomendacja) · (b) Ty otwierasz sesje.
3. Weryfikacja przed push: (a) jak w pętli 1 (rekomendacja) · (b) pełne verify przed każdym push.
4. 017 (apps4brew.com): (a) dołączam repo apps4brew-www z prawem zapisu i publikuję eksport `site/` (działanie zewnętrzne — publikacja strony; rekomendacja: zmiana poprawia tylko odbiorców poczty w polityce, z PR do akceptacji) · (b) przygotuję eksport i instrukcję, publikujesz Ty.
5. 021, jeśli drugiego źródła nie będzie: (a) usunąć liczbę 15–20° z tekstu (zostaje „palce lekko na zewnątrz”) przez rolę 06 + recenzję lokalizacji (rekomendacja: zgodne z zasadą 2 źródeł) · (b) blokada, tekst zostaje do 1.0.1.
6. STOP przed partią 1 (zadania P z zapisanym wyborem): (a) pominąć (rekomendacja) · (b) zatrzymać się z poleceniami ról.
7. Przy okazji (nie blokuje): 13 plików prompty/*.polecenie.md na publicznej gałęzi audytu — (a) zostawić · (b) usunąć commitem na tej gałęzi (historia zostaje) · (c) usunąć i przepisać historię gałęzi (wymaga force-push). Nie ruszam bez Twojej decyzji.
