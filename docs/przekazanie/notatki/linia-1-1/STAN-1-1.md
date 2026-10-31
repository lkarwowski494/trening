# Linia 1.1 — stan bieżący (aktualizowany po każdym kroku; ostatnio 31.10.2026 ~09:30 PL)

## Teraz
- Gałąź `integracja-1-1`: scalenie f3ca16c9 + poprawki 769c95b1, 6f21ce25, 5d9934fc, 5108782e + ten commit. Wypchnięte z nazwanym wyjątkiem `--no-verify` (niżej). Następny krok: `tests.yml` zielony → audyt ćwiczeń i grafik (1 agent, prompt `origin/przekazanie-konta:notatki/katalog-1-1/prompt-audyt-cwiczen-i-grafik.md` z nowym SHA) → raport w `docs/audyt-cwiczen/` → decyzja 2 (z wynikiem audytu) i ścieżka nazw EN (3 opcje) dla właściciela.
- Przydział limitu: decyzja właściciela 31.10 ~08:35 (docs/18) — priorytet a) push + tests.yml, b) audyt, c) decyzje; fale napraw/recenzje v2/ZB-023 tylko przy zapasie, inaczej prompty dla kolejnej sesji.
- Wyjątek nazwany (31.10.2026): push bez znacznika pełnego verify. Pełne verify na 6f21ce25 przeszło poza 3 testami (figures-v2-styk — przekroczenie 5 s pod obciążeniem; rejestr ryzyk — R-11-01 bez daty; docs/16 — tabela treści krytycznej nieaktualna); naprawy 5d9934fc i 5108782e (same dokumenty) + trzy testy zielone pojedynczo; tańsza kontrola zamiast drugiego pełnego verify (~55 min): pełny `tests.yml` w CI.
- Dociągnąć później z `wersja-1-0-1-r2`: 3eb21b5 (wersja 1.0.1) i f36a243 — po audycie.


Decyzja właściciela 31.10.2026 ~07:00 PL (PR #107, docs/18): 1.0.1 nie wychodzi osobno; zmiany `wersja-1-0-1-r2` wchodzą do 1.1. Kierunek scalania: `main` → `wersja-1-0-1-r2` → `integracja-1-1`, nigdy odwrotnie. Nic na `main`, żadnego PR do `main`.
Poprzedni stan: `origin/przekazanie-konta:notatki/katalog-1-1/STAN-2026-10-29.md` (wstrzymanie 29.10).

## Etap 1 a — scalenie `wersja-1-0-1-r2` (e796c7ed, zawiera `main` 68a18d37) → `integracja-1-1` (było 15e3ab45)
- 35 plików w konflikcie; rozstrzygnięcia:
  - rigi (`lib/figures/v2/variants.ts`): suma zmian; przy kolizji tej samej linii wersja zrecenzowana z 1.0.1 (Cable Pull Through, Stiff-Legged Barbell Deadlift); zmiany 1.1 bez kolizji zostały (flare Smith Incline / Wide-Grip, sx Smith SLDL).
  - kontrakt: zakresy poza@2 z 1.1 + wyjątek barku nad głową z 1.0.1 (`overheadException.ts`); sceny/rysowanie: rekwizyty obu linii; rączka gumy/łańcucha z 1.0.1 przemianowana na `gripHandleR/W` (kolizja nazwy z uchwytem linki 1.1; dane: `data/zrodla/figury-sprzet.json`).
  - teksty: `bp.elbowsMid` i `calf.edge` z 1.0.1 (34 języki, recenzja), nowe zdania 1.1 obok; `bp.elbowsMid` usunięte z zestawu do przekładu 27.10.
  - skrót recenzji rodziny v2: plik rigu albo pozy (1.1) + pliki wspólne R2-6 (1.0.1); ten sam wzór w eksporcie strony (`scripts/strona/recenzja-figur.mjs`, nowy test parytetu w `tests/strona-eksport-recenzja.test.ts`).
  - JSON-y danych scalone semantycznie (3-drożnie po kluczach); pliki generowane odtworzone generatorami.
- **Lista wstrzymań (pytanie koordynatora 1.0):** poprawki 1.0.1 naprawiają wszystkie WYSOKIE z recenzji 1.1 dla squat/bench/hinge (Zercher, Sumo hantel, Band/Chain/Close Grip, 11 martwych ciągów) — `V2_WSTRZYMANE` zostaje puste. Pull_up (0/13) bez wpisu recenzji.
- **Bramka fail-closed bez zmian:** rodziny v2 w 1.1 nadal ukryte (`lib/figures/data.json` v2 = []), bo scalony rysunek nie jest bajtowo żadną zrecenzowaną wersją. Pomiar (odciski kształtów 87 ćwiczeń, 21 kadrów, wszystkie widoki; skrypt poza repo):
  - poza poprawna (bez mięśni i błędów): 78 identycznych z recenzją 1.0.1, 6 identycznych z wersją 1.1 ocenioną w recenzji 1.1 (Box Squat ×4, One-Arm KB Floor Press, Smith SLDL), 3 nowe połączenia (Single Leg RDL ×2, Deficit Deadlift);
  - z mięśniami i trybami błędów: 58 identycznych z 1.0.1; reszta różni się głównie widokiem z przodu błędu „pięty” (zmiana 1.1).
  - Wniosek dla decyzji 3: zakres ponownej recenzji ruchu da się zawęzić; bez recenzji nic się nie pokazuje.
- Testy po scaleniu: wyjątki reguł sensu 1.1 (`tests/sens-wyjatki-1-1.json`) — dopisane 6 ćwiczeń (rigi 1.0.1 vs progi 1.1), usunięte 17 nieaktualnych (martwe ciągi po 101-02/03 spełniają progi 1.1); R11: 4 wyjątki sumo usunięte; wzorzec zgodności wstecznej rysunku odtworzony dla 49 rigów (pozy z danych bez zmian); testy 1.0.1 zakładające widoczne rodziny — bramka otwarta w teście (`figure-gate-open`) albo warunek `familyReviewed`; minimum zapadki pokrycia podniesione, cel startowy 1.1 języków 524 → 525.
- Pełne verify i `tests.yml`: sekcja „Teraz”.

## Etap 1 b — ZB-010 (SDK w 1.1 a schemat danych)
- Schemat danych bez zmian: `SCHEMA_VERSION = 19` na `main`, `wersja-1-0-1-r2` i po scaleniu (`lib/seed.ts:12`). Różnice warstwy zapisu względem `main`: tylko formatowanie dat (`lib/state/time.ts:35`), pole `willAutoRenew` w wyniku sklepu (`lib/store-native.ts:53`, kv poza stanem i kopią — `lib/entitlement.ts:17`), eksport funkcji (`lib/store.ts:39`); `lib/state/*` migracje bez zmian.
- Plan 1.1, który mógłby zmienić dane: nazwy EN — przewodnik (`origin/przekazanie-konta:notatki/katalog-1-1/przewodnik-nazw-en-szkic-2026-10-30.md`, sekcja 4/P5): ścieżka A (zmiana kluczy katalogu z migracją danych użytkownika) vs B (warstwa `nameEn` po `rid`, bez migracji; rekomendacja B w 1.1).
- Wniosek: **SDK w 1.1 — tak**, pod warunkiem, że 1.1 nie zmienia schematu ani kluczy katalogu (nazwy EN ścieżką B). Ścieżka A albo inna zmiana schematu ⇒ SDK osobnym wydaniem (zasada CLAUDE.md).

## Etap 1 c — decyzja 2
`docs/przekazanie/notatki/linia-1-1/decyzja-2-cel-pokrycia-2026-10-31.md` (opcje A/B/C, rekomendacja A).

## Czeka na wiadomość z sesji koordynatora 1.0
- Decyzja 2 (liczby celu), decyzja 3 (audyt ćwiczeń i grafik — nie uruchomiony), ZB-010 (potwierdzenie ścieżki B nazw → SDK w 1.1).
- Ewentualne dociągnięcia z `wersja-1-0-1-r2` (numer wersji / E2E) — kolejne scalenie.

## Pułapki (nowe)
- Skrót recenzji v2 obejmuje pliki wspólne (draw, scene, skeleton, figure…) — każda zmiana silnika ukrywa wszystkie rodziny do ponownej recenzji albo udokumentowanego przeliczenia z odciskami.
- Nie uruchamiać symulacji zmieniających pliki repo w trakcie pełnego jest (fałszywe porażki).
