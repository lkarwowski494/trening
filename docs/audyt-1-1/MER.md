# Raport MER — liczby i twierdzenia merytoryczne (audyt 1.1, commit 79117f33)

Audytor: MER (soczewka: użytkownik dostaje błędną informację). Kopia robocza: worktree odłączony na 79117f33, po pracy usunięty. Sondy: `testy-MER/`.

## Zakres i pokrycie

Przeczytane / sprawdzone:
- `node scripts/claims.mjs --check` → **kod 0** („61 wpisów, 42 tekstów dziedzinowych (w tym bez twierdzenia: 7), rejestr zgodny”).
- `node scripts/kontrola-brd.mjs docs/brd` → **kod 0** („88 BR, 15 RD, 85 wektorów, 0 błędów, 1 uwaga”: RD-09 bez wektora błędnych danych — uzasadnione w regule, GEN_MINUTES to lista 45/60/90). `--wektory` zgodne z `tests/wektory/brd.json` (cmp). `tests/audit-m1-044-brd.test.ts` + `tests/muscle-roles.test.ts`: 60/60 zielone (wektory RD-05…RD-15 wykonywane na kodzie).
- Diff `v1.0.0-b1033..79117f33` w `lib/i18n.en.ts`, `lib/locales/_source.json`, rejestrze twierdzeń. Nowe teksty dziedzinowe od 1.0: role mięśni (blok ROLE-MIESNI, 56 zdań), etykiety faz animacji, „Czego unikać”, „Co nowego”. Teksty T-010/T-012/T-025/T-028 istniały w 1.0 — zmiana tylko brzmienia EN (sens zgodny). Nowe wpisy rejestru: T-060, T-061.
- Warstwa obliczeń: `lib/stats.ts`, `units.ts`, `loads.ts`, `deload*.ts`, `generator.ts`, `genconst.ts`, `adapt.ts`, `progress.ts`, `state/history.ts` — **bez zmian od 1.0** (diff pusty poza refaktorem `swap.ts`→`swapScore.ts` bez zmiany wag i `catalog.generated.ts`: 2 rozciągania straciły region 0,25).
- Wyrocznia niezależna od kodu (`testy-MER/oracle.test.ts`, 4/4 zielone): Epley (100×5 = 116,667; 60×10 = 80; 1 powt. = ciężar; 0 kg/0 powt. = 0), NIST lb = 0,45359237 kg (100 kg → 220,5 lb; 20 kg → 44,1 lb; wpis 45 lb/225 lb wraca jako 45/225; objętość 1000 kg → 2205 lb), talerze (gryf 20 + pary 25/10/1,25 → 8 sum; para hantli perStep 4), deload ceil(n/2), WHO 2020 cardio 150–300 / 75–150 min, ≥ 2 dni siłowe, ≥ 80% 1RM, przerwy 180/120/90 s, budżet serii (60 min siła = 15).
- Wektory BRD przeliczone ręcznie: RD-01, RD-02 (RIR = 10 − RPE, skala Zourdos), RD-09, RD-10, RD-11, RD-12 (0,64 × 80 × 4/3 = 68,2667) — zgodne.
- Podpowiedź progresji (`progressionFor`): podwójna progresja +2,5 kg / +1 kg hantle / +5 lb / +2,5 lb, masa ciała i guma — logika czytana, bez zmian od 1.0.
- Role mięśni: zrzut wszystkich 969 wyświetlanych par (ćwiczenie, mięsień, zdanie) — `testy-MER/roles.tsv`; przejrzane kombinacje podejrzane (zawias + czworogłowe, izolacje z klatką/najszerszym, core_other, szrugsy) — bez błędu anatomicznego.
- Fazy animacji ze wskazanym czasem: zrzut 506 animowanych ćwiczeń — `testy-MER/tempo.tsv`.
- Teksty zdrowotne: `MedicalNote` („Aplikacja nie udziela porad medycznych. Przy bólu, urazie lub chorobie skonsultuj się z lekarzem lub fizjoterapeutą.”) w generatorze i stopce wskazówek; w PL/EN wskazówek techniki brak twierdzeń o bólu/kontuzjach.
- Tłumaczenia 33 języków: placeholdery `{…}` i liczby w kluczach vs przekład — brak rozjazdu liczb (różnice tylko słowo ↔ cyfra, np. „o 1” → „jedno”).

Nie przeczytane / nie sprawdzone: patrz „Nie sprawdzono”.

## Znaleziska

### MER-01 — Etykieta animacji podaje „Opuszczanie 2 s” (i „Podnoszenie 1 s”) dla ćwiczeń balistycznych: swing, zarzuty kettlebell, wysoki ciąg, ciągi olimpijskie
- **Waga: WYSOKIE** (błędna liczba merytoryczna widoczna przy ćwiczeniu, także na stronie z ćwiczeniami). Jeśli koordynator uzna licznik faz za czysto ilustracyjny — ŚREDNIE; uzasadnienie wagi niżej.
- **Realność: realny** — każdy, kto otworzy ćwiczenie z rysunkiem.
- **Kroki:** Ćwiczenia → „Kettlebell Swing” (albo Kettlebell Clean, One-Arm Kettlebell Swings, Double Kettlebell Clean, Dumbbell Clean, Kettlebell Sumo High Pull, Bottoms-Up Clean From The Hang Position, Clean Pull, Snatch Pull) → pod animacją: „Podnoszenie 1 s · Opuszczanie 2 s”.
- **Dowód:**
  - `testy-MER/tempo.tsv` (sonda `tempo.test.ts`, wynik `phasesFor(shownFigureSpec(k), tempoFor(…))`): `Kettlebell Swing  kb_ballistic  Podnoszenie 1s · Opuszczanie 2s`; to samo dla 9 ćwiczeń z listy wyżej.
  - `lib/figures/v2/rodziny/kb_ballistic.ts:9`: `ui: { names: { first: 'Podnoszenie', second: 'Opuszczanie' }, lowerFirst: false …` — rwania i podrzuty są wyjęte (jedna faza bez czasu), swing/zarzut/wysoki ciąg nie.
  - `lib/figures/v2/anim.ts:7` `TEMPO = { downMs: 2000, upMs: 1000 … }`; uzasadnienie w nagłówku `anim.ts:2–3` i w rejestrze T-059: „umiarkowana prędkość 1–2 s na fazę” (ACSM 2009) i zakres 0,5–8 s dla PRZEROSTU (Schoenfeld 2015). Oba źródła dotyczą zwykłych ćwiczeń siłowych; ACSM 2009 dla treningu mocy zaleca ruch szybki/eksplozywny — źródło cytowane dla T-059 nie obejmuje ćwiczeń balistycznych.
  - Niespójność wewnętrzna: ta sama rodzina dla rwania i dla skoków/rzutów świadomie nie podaje czasu (`anim.ts:79–80`: „czas powtórzenia nie jest podawany (brak źródła)”).
  - Sprzeczność z kartą tego samego ćwiczenia: wskazówka swinga „…potem energicznie wypchnij biodra w przód” (`lib/cues/text/pl.json`), a etykieta mówi o 2-sekundowym opuszczaniu; w swingu powrót dzwonu między nogi nie jest kontrolowanym, wolnym opuszczaniem.
  - Strona: `scripts/strona/eksport.mjs:136` eksportuje te same fazy (`figurePhases`) — ta sama liczba publicznie.
- **Mechanizm (grep wzorca):** licznik czasu zależy tylko od typu pętli (`phasesFor`: jednokierunkowa / marsz / reszta), nie od charakteru ruchu. Wszystkie trafienia z czasem w rodzinach mocy: kb_ballistic — Kettlebell Swing, One-Arm Kettlebell Swings, Kettlebell Clean, Double Kettlebell Clean, Dumbbell Clean, Kettlebell Sumo High Pull, Bottoms-Up Clean From The Hang Position; olympic — Clean Pull, Snatch Pull (Jerk Dip Squat „wolno i pod kontrolą” — zgodne z kartą, bez uwag). Do oceny także Push Press i Push Press – Behind the Neck (`overhead_press`: „Wypychanie 1 s · Opuszczanie 2 s”, a karta mówi „dynamicznie wyprostuj nogi”) — patrz „Do sprawdzenia”.
- **Propozycja naprawy:** fazy bez czasu (`untimed`, jak `walkPhases`/`oneWayPhases`) dla ćwiczeń balistycznych — np. lista `BALLISTIC` (kb_ballistic całe, olympic: Clean Pull, Snatch Pull) w `figure.ts` `phasesFor` albo pole w `DATA_UI` rodziny; animacja może zostać, znika tylko liczba sekund. Rejestr T-059: dopisać zakres („tylko ćwiczenia nie-balistyczne”). Tania naprawa, bez przebudowy.
- **Test akceptacyjny:** dla każdego klucza z rodzin kb_ballistic i z listy olympic-ciągów `phasesFor(shownFigureSpec(k), tempoFor(spec)).every(p => p.name === 'Pauza' || p.untimed)`; eksport strony: `figurePhases` tych ćwiczeń bez `ms` widocznych jako sekundy; test dla zwykłego ćwiczenia (Bench Press) dalej „Opuszczanie 2 s · Wypychanie 1 s”.
- **Uzasadnienie wagi:** próg „błędne liczby lub twierdzenia merytoryczne”; liczba nie ma źródła dla tej klasy ćwiczeń (projekt sam to przyznał dla rwań i skoków), a karta mówi co innego. Brak ryzyka zdrowotnego — tylko błędna informacja.

### MER-02 — Wpis T-060 („o około 1/3–1/2 mniej serii” przy deloadzie) bez listy źródeł i z niezrobionym przeglądem badacza
- **Waga: NISKIE** (higiena rejestru; liczba sama jest poprawna). **Realność:** nie dotyczy użytkownika bezpośrednio.
- **Dowód:** `docs/research/rejestr-twierdzen.json` T-060: `"rodzaje": ["uproszczenie","przegląd badań"]`, `"zrodla": []`, `"przeglad": "…bez nowej oceny źródeł; do przeglądu badacza przy najbliższym przeglądzie rejestru."` (26.10.2026). Źródła istnieją w `docs/research/22-serie-deload-generator.md:64` (taper 30–70%, Pritchard 58,9%, Travis 41–50%) — wynik `ceil(n/2)` (33–50%) mieści się w części wspólnej, więc treść poprawna.
- **Mechanizm:** `check:claims` nie wymaga niepustych `zrodla` przy rodzaju „przegląd badań”. Inne wpisy z pustym `zrodla`: T-012 (uproszczenie), T-061 (opis rysunku — w porządku).
- **Naprawa:** przepisać źródła z docs/22 do `zrodla`, przegląd badacza; opcjonalnie: `checkClaims` odrzuca „przegląd badań” z pustym `zrodla`. **Test:** wpis z „przegląd badań” i `zrodla: []` → błąd kontroli.

## Do sprawdzenia (pewność ≤ 80%)
- **Push Press / Push Press – Behind the Neck:** „Wypychanie 1 s” przy ruchu opisanym w karcie jako dynamiczny. 1 s fazy koncentrycznej przy ciężkim wyciskaniu z nóg bywa realny, więc nie zgłaszam jako błąd — do decyzji badacza razem z MER-01.
- **Clean Pull / Snatch Pull:** czy 1 s ciągu z podłogi do wzruszenia barków to jeszcze rozsądna ilustracja (pewność, że błędne, ok. 70%) — włączone do mechanizmu MER-01.
- **Role mięśni — cytaty źródeł** (S4–S17, S28 w `data/zrodla/role-miesni.json`): sieć sesji blokuje openstax.org, teachmeanatomy.info, kenhub.com, pmc.ncbi.nlm.nih.gov, who.int (proxy 403 / DNS). Treść zdań zgodna z podręcznikową anatomią (wyprost biodra przez pośladkowy wielki, zgięcie łokcia przez dwugłowy itd.), ale cytatów dosłownie nie potwierdziłem.

## Co działa dobrze
- Rejestr twierdzeń i BRD: obie kontrole kod 0; wektory RD wykonywane na kodzie; nowe teksty dziedzinowe od 1.0 (role mięśni) wyświetlane tylko przy statusie „ustalone”/„dwa źródła” (`lib/muscleRoles.ts`, pole `show`), bez zgadywania (brak reguły → brak zdania), funkcje z jednym źródłem ukryte.
- Role mięśni: 969 par bez błędu anatomicznego w przejrzanych kombinacjach; ćwiczenia na czas w rodzinach z fazą nie dostają zdania „gdy wstajesz”.
- Obliczenia: wszystkie wyrocznie niezależne (Epley, NIST, WHO 2020, rachunek talerzy, deload, budżet serii) zgodne; e1RM tylko ≤ 10 powtórzeń i bez drop setów; brak e1RM dla ćwiczeń z masą ciała bez źródła udziału.
- Lb/kg: przyciąganie do „okrągłych” kg zachowuje liczbę na ekranie (45 lb, 225 lb wracają bez zmian).
- Przekłady: liczby i placeholdery tekstów dziedzinowych zgodne we wszystkich 33 językach.
- Teksty zdrowotne: jedno spójne odesłanie do specjalisty; wskazówki techniki bez porad medycznych.

## Nie sprawdzono
- Otwarcie źródeł i cytatów (próbka min. 10 twierdzeń) — **zablokowane siecią sesji** (proxy odrzuca CONNECT do openstax.org, teachmeanatomy.info, kenhub.com, pmc.ncbi.nlm.nih.gov, who.int; WebFetch: DNS nie rozwiązuje). Krok: dopuścić te hosty w ustawieniach sieci sesji albo zlecić badaczowi z dostępem; lista cytatów do sprawdzenia: S4, S5, S6, S7, S8, S10, S11, S12, S13, S15, S17, S28 z `data/zrodla/role-miesni.json` (frazy w polu `cytaty`).
- `docs/24` (generator) i `docs/33` (dostosowanie do miejsca) — sprawdzone tylko stałe i budżet serii; logika doboru ćwiczeń i zamian w miejscu nieprzeczytana w całości (bez zmian od 1.0, audytowana przy 1.0).
- Rozgrzewka (serie rozgrzewkowe) — nie znalazłem generatora ciężarów rozgrzewki; `WARMUP_MIN = 10` min tylko w budżecie czasu.
- Wygląd etykiet faz na urządzeniu/stronie (natywny build, strona) — nie na Linuksie.
- Figury i karty ćwiczeń poza liczbami (inny audytor).
