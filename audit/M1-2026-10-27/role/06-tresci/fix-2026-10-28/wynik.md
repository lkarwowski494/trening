# 06-tresci · fix p3 · M1-audytor-generalny-020 i 021 — wynik

Data: 2026-10-27 · Rola: 06-tresci (tryb fix) · Plan E0 zatwierdzony przez właściciela 27.10.2026 (polecenie M2, partia 3).
Kopia robocza: `/home/user/trening/.claude/worktrees/agent-aa8072b2ba2a13fe6`, gałąź `worktree-agent-aa8072b2ba2a13fe6` (baza `naprawy/M2-koordynator-napraw-2026-10-27-p3` = d0ae52e). Bez wypychania i scalania.

| Commit | ID |
|---|---|
| 7fb4f1a | M1-audytor-generalny-020 (06-tresci-004) |
| 1cc402f | M1-audytor-generalny-021 (06-tresci-002, 06-tresci-003) |

## ETAP 0 — środowisko i klasyfikacja
- Linux, Node 22.22.0, git (worktree), sieć przez proxy: Europe PMC 200, strongerbyscience.com 200, odphp.health.gov 200 (PAG 2018 PDF), nsca.com — HTTP 403 (także WebFetch). Repo publiczne. Bez symulatora (zmiany niewidoczne poza tekstem w Ustawieniach — zrzutów nie robiłam).
- Klasyfikacja: 020 — M (rozstrzyga źródło; DEC-04 a); 021 — M (DEC-05 a). Ścieżek wrażliwych (migracje, kopie, import/eksport, zakupy, workflowy) zmiany nie dotykają — przegląd subagenta nie dotyczy. Nowych ani zmienionych tekstów UI nie ma (T-041 bez zmiany brzmienia, liczby z parametrów) — tłumacz i recenzent lokalizacji niepotrzebni.

## M1-audytor-generalny-020 (06-tresci-004): RIR 6 → RPE 5
- Źródło potwierdzone (przeczytane 27.10.2026, cytat dosłownie na surowym tekście): Helms i in. 2016, https://www.ebi.ac.uk/europepmc/webservices/rest/PMC4961270/fullTextXML, sekcja INTRODUCTION: „In addition, scores of 5–6 were grouped as 4–6 RIR as it is easier for athletes to give a range of RIR when RIR is greater than 3.” oraz INCORPORATING THE SCALE INTO PROGRAMMING: opisy słowne („3–4 RPE = light effort”) dopiero poniżej RPE 5. Werdykt dla starego zachowania: CZĘŚCIOWO.
- Poprawka: `lib/state/effort.ts:20` RIR_MAX 6, `lib/state/effort.ts:22` RPE_RIR_MIN 5 (Ustawienia biorą granicę z parametru, nie z 10 − RIR_MAX), `lib/state/effort.ts:29` RIR powyżej 5 do 6 → RPE 5, powyżej 6 → RPE 4 („7+”). Dane zapisane — bez zmian (migracja nie).
- BRD: `docs/brd/reguly.md:22` RD-02 z drugą tabelą wektorów (RD-02-W6…W10, W7: RIR 6 → RPE 5), S-04 w `docs/brd/zrodla.md`, BR-TRN-007; `tests/wektory/brd.json` z `kontrola-brd --wektory` (0 błędów). Rejestr T-041: źródło z cytatem, data, przegląd 27.10 (`--rehash`); docs/18: wpis DEC-04 a z polem wdrożenia.
- Testy: przed — `tests/regress.test.tsx` (nowy opis „M1-audytor-generalny-020”): 2 czerwone (`Expected: 5, Received: 4`; tekst Ustawień 0–6 nie istnieje) — `dowody/020-jest-przed.txt`. Po — 4 zestawy związane (MER2-08, effort-scale, audit-0.10-stats, BRD z wektorami RD-02 uruchamianymi na effortIn): 68/68 — `dowody/020-jest-po-zwiazane.txt`; regress pełny po zmianach: 321/321 — `dowody/020-jest-po-regress-koncowy.txt`. Test tekstu Ustawień przeniesiony do `tests/audit-k1-bl-mer.test.tsx` (w pliku regresji render po teście Live Activity padał na środowisku testu, nie na kodzie — `dowody/020-jest-po-regress.txt`). Zmienione istniejące testy (zmiana zachowania, nie dopasowanie): MER2-08 (RIR_MAX 6, „7+”), BRD RD-02.
- Skutek widoczny: wpis RIR 6 po zapisie wraca na ekran jako RIR 5 (przedział 4–6 RIR zapisany najniższym RPE przedziału); dawne wpisy „6+” (RPE 4) pokazują się teraz jako „7+”. Uproszczenie nazwane w RD-02; patrz „Nowe znaleziska”.

## M1-audytor-generalny-021 (06-tresci-002): strażnik rejestru twierdzeń
- Przed: `check:claims` — „46 wpisów, 0 tekstów dziedzinowych, rejestr zgodny”; ten sam sztuczny słownik (nowy tekst dziedzinowy, tempo, pomoc z „upadku”) na strażniku przed/po: 0 / 3 błędy — `dowody/021-straznik-przed-po.txt`; nowe testy w `tests/audit-m1-048-claims-registry.test.ts`: 4 czerwone przed — `dowody/021-jest-przed.txt`.
- Poprawka: `scripts/claims.mjs:30` DOMAIN_WORDS_RE, `scripts/claims.mjs:32` DOMAIN_KEYS, `scripts/claims.mjs:89` wyjątki „bezTwierdzenia” z powodem. Nowy wzorzec bez wpisów: 20 tekstów bez ID — `dowody/021-check-claims-nowy-wzorzec-przed-wpisami.txt`.
- Wpisy T-047–T-059 (13) ze źródłami przeczytanymi 27.10.2026, cytaty sprawdzone dosłownie skryptem na pobranym tekście: ACSM 2026 (PMC12965823), WHO 2020 (PMC7719906), Sardeli 2018 (PMC5946208), PAG 2018 s. 61 (odphp.health.gov), Schoenfeld 2015 (PMID 25601394, streszczenie), Stronger by Science „How to Squat” — adresy i cytaty w `docs/research/przeglad-tresci-2026-10-27.md`. 7 wyjątków z powodem; `_opis` rejestru zgodny ze stanem po 25.10. Po: `check:claims` — „59 wpisów, 41 tekstów dziedzinowych (w tym bez twierdzenia: 7), rejestr zgodny”.

## M1-audytor-generalny-021 (06-tresci-003): źródła zestawów ogólnych w repo
- `data/zrodla/wskazowki-ogolne.json` z plików badacza z 25.10 (gałąź przekazanie-konta, commit cea8576): 177 id wskazówek zestawów ogólnych → ćwiczenie ze źródłami w `data/zrodla/cues.json` albo ≥ 2 źródła { adres, miejsce } (miejsce ≤ 114 znaków); 538 przypisań (rodzina, plik badacza, zapis „dlaczego nie przeczy ruchowi”, gdy był); kąt stóp ze stanem odczytu. Korekta: `carry.noLean` — źródła przy „Suitcase Carry”, nie „Farmer's Walk”.
- Kontrola: `scripts/zrodla-runtime.mjs:73` w `check:zrodla-runtime`; przed (bez pliku) kod 1 — `dowody/021-zrodla-runtime-bez-pliku.txt`, po kod 0 — `dowody/021-zrodla-runtime-po.txt`. Test `tests/zrodla-pelne-wskazowki-ogolne.test.ts`: przed — ENOENT (`dowody/021b-jest-przed.txt`), po 4/4.
- Po (związane, 16 zestawów: rejestr, źródła pełne, figury, recenzja figur, cytaty, nazwy zakazane, decyzje, verify-docs): 187/188, jedyny błąd — nazwy marek w nowym pliku źródeł (`dowody/021-jest-po-zwiazane.txt`); po dopisaniu 2 wyjątków z powodem 25/25 — `dowody/021-jest-po-koncowe.txt`.
- Inne kontrole po: `tsc --noEmit` 0, eslint 0 błędów, `check:matrix` (bez testu: 0), `check:cues`, `check:i18n`, `check:decyzje` (323 wpisy), `kontrola-brd` 0 błędów; README i macierz zregenerowane. Pełnego `npm run verify` nie uruchamiałam (maszyna współdzielona; koordynator po scaleniu).

## Co otwarte
1. **T-054 kąt stóp 15–20°** — [DO USTALENIA]: przeczytane jedno źródło szczebla 4 (SBS); drugie (NSCA Basics 2012, s. 49) — PDF HTTP 403 dla agenta. Zgodnie z poleceniem tekst bez zmiany. Krok: badacz z dostępem do PDF (albo właściciel pobiera PDF) lub inne źródło szczebla 4 z liczbą. Wyszukiwarka wskazuje też badania z mniejszym kątem (do ok. 10°) — nieprzeczytane, do sprawdzenia przy rozstrzyganiu.
2. **T-050/T-056** — przelicznik %1RM ↔ 4–6 powtórzeń nie sprawdzony 27.10 u źródła ([OTWARTE] w uwadze wpisu); twierdzenie ≥80% 1RM potwierdzone (ACSM 2026).
3. Źródła wskazówek w `wskazowki-ogolne.json` czytał badacz 25.10 (część przez narzędzie streszczające); 27.10 nie otwierane ponownie (ACE i NSCA 403 dla agenta).
4. Zdanie CLAUDE.md „tekst dziedzinowy … powołujący się na źródło albo nazywający swoją wagę” jest węższe niż nowa kontrola — do aktualizacji przez koordynatora (agent nie zmienia CLAUDE.md).

## Nowe znaleziska (poza zakresem, do decyzji)
- **06-tresci-005 (P2, brzegowy, P)**: w skali RIR wpis 6 po zapisie pokazuje się jako 5, a dawne wpisy „6+” jako „7+” (skutek DEC-04 a przy danych w RPE). Opcje: (A) zostawić — uproszczenie nazwane w RD-02; (B) pokazywać RPE 5 w skali RIR jako „5–6” — zmiana UI i tekstów (rola 04). Rekomendacja: A.

## Przekazania
- Rola 08: przegląd zmian w `lib/state/effort.ts`, `app/more/settings.tsx`, `scripts/claims.mjs`, `scripts/zrodla-runtime.mjs` przy scalaniu.
- Rola 07: brak zmian w `.maestro`; scenariusze z wpisem RIR (jeśli są) do przebiegu `tylko_scenariusze`.
- Koordynator: pełne verify po scaleniu; regeneracja README/macierzy raz po scaleniu gałęzi.

## Kontrola dowodów i sekretów
Wynik: `dowody/sprawdz-raport.txt`.
