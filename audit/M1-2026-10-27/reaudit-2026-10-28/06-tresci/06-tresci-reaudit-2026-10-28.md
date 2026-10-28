# Reaudyt: Treści i wiedza domenowa — Trening (iOS) — 2026-10-28
Commit: 2385e75aeb3880c0c90ba5edd69145a1c6d80b01 (main po naprawach M2, HEAD odłączony — zgodny z poleceniem) · Baza: 025a50b96f504ea9d16d573720d1e92dc951a103 · Tryb: reaudit, pętla 1 · Prompt przeczytany do ostatniej linii (616); ostatni nagłówek: „## Kontrola dowodów i sekretów przed oddaniem raportu”.
Środowisko (ETAP 0): Linux bez Xcode i symulatora, Node 22.22.0; sondy w osobnym `git worktree` (scratchpad, `node_modules` jako dowiązanie do drzewa głównego), usunięty na końcu; sieć przez proxy: Europe PMC, strongerbyscience.com, nhs.uk, issaonline.com — 200; nsca.com — 403; web.archive.org — połączenie zerwane. Workflowów nie uruchamiano. Typecheck i lint: wyniki wspólne (`wspolne/`, kod 0), nie powtarzane. Testy tylko pojedynczo z `--maxWorkers=1`. Raportów innych ról, linii bazowej, soczewek, katalogu weryfikacji ani gałęzi `przekazanie-konta` nie czytałam.

## Podsumowanie
Trzy ID źródłowe w zakresie tej roli: M1-020 (06-tresci-004) i M1-021 w części strażnika (06-tresci-002) są zweryfikowane na 2385e75 dowodem z kodu, testów i ze źródła otwartego dziś. M1-005 (06-tresci-001) działa dla figur v1. Figura bez aktualnego wpisu recenzji wypada z pliku runtime, co potwierdzają mutacja i test. Reguły podparcia łapią opisane błędy na klatkach sprzed poprawki. Trzy ukryte figury (Reverse Lunge, Push Press, Pendlay Row) nie są rysowane. Zostaje część v2: skrót recenzji rodzin v2 obejmuje tylko pliki rigu. Zmiana tekstu wskazówki widocznej tylko na karcie v2 albo przypisania zestawu ogólnego nie unieważnia zapisu, co pokazuje mutacja 3. M1-021 w części kąta stóp (06-tresci-003) też nadal otwarte. Tekst „zwykle 15–20°” jest w aplikacji, choć rejestr ma go jako otwarty: drugie źródło szczebla 4 nadal jest nieprzeczytane (dziś też HTTP 403). Nowe znalezisko jest jedno, P2: definicja tekstu dziedzinowego w CLAUDE.md jest węższa niż kontrola po naprawie. Regresji w zmienionych plikach ani w próbce nie ma.

| ID | Wynik | ID źródłowe M1 | Dowód (skrót) |
|---|---|---|---|
| 06-tresci-001 | v1: zweryfikowane · v2 (treść kart): nadal otwarte, P2 | M1-005 | `dowody/jest-figury-recenzja.txt` (32/32, kod 0), `dowody/mutacje-bramka4.txt` (mutacje 1–2 wykryte, 3 niewykryta), `dowody/sonda-v2-karty-poza-skrotem.txt` (9 id) |
| 06-tresci-002 | zweryfikowane | M1-021 | `dowody/check-claims.txt` (59 wpisów, 41 tekstów, kod 0), `dowody/sonda-claims-pokrycie.txt` (wszystkie teksty z audytu mają ID), `dowody/jest-audit-m1-048-claims-registry.txt` (16/16) |
| 06-tresci-003 | zestawy ogólne: zweryfikowane · kąt stóp 15–20°: nadal otwarte, P2 | M1-021 | `dowody/zrodla-runtime-check.txt` (kod 0), `dowody/jest-zrodla-pelne-wskazowki-ogolne.txt` (4/4), `dowody/wskazowki-ogolne-kontrola.txt`, `dowody/zrodla-odczyt-2026-10-28.txt` (NSCA 403) |
| 06-tresci-004 | zweryfikowane | M1-020 | `lib/state/effort.ts:20`, `dowody/jest-regress-020.txt` (kod 0), `dowody/jest-audit-k1-bl-mer-MER2-08-timeout60s.txt` (3/3), źródło dziś: `dowody/zrodla-odczyt-2026-10-28.txt` |
| 06-tresci-601 | nowe, P2 (D) | — | `CLAUDE.md:109` vs `scripts/claims.mjs:30` |

Nowe znaleziska według poziomu: P0 — 0, P1 — 0, P2 — 1 (06-tresci-601). Znane 06-tresci-005 (RIR 6 po zapisie pokazywany jako 5, z naprawy M1-020) nie jest zgłaszane ponownie: zachowanie zgodne z opisem w RD-02.

Otwarte poza main (tylko wypisuję, nie są znaleziskiem): decyzja 9a (eksport figur strony tylko dla rodzin `ready` z aktualnym wpisem recenzji) na gałęzi `naprawy/M2-po-decyzjach-eksport-figur` (`docs/18-przekazanie.md:618`: wdrożenie otwarte); propozycje A/B w L-047 i L-048 (docs/40); backlog 1.0.1 w docs/21 (m.in. czwarta pozycja silnika v1 dla Reverse Lunge i Push Press, krok drugą nogą w Walking Lunges, Pendlay Row).

## Wyniki dla ID źródłowych (szczegóły)

### Wynik 06-tresci-001 (M1-005): bramka 4 dla animacji i kart
- **Mechanizm v1, zweryfikowane.** Do runtime trafia tylko figura z werdyktem „wyswietlana” albo „zastapiona” i skrótem równym bieżącemu (`scripts/zrodla-runtime.mjs:23`, `scripts/zrodla-runtime.mjs:60`). Skrót obejmuje figurę oraz id i polskie teksty wskazówek. Sonda na 2385e75: `lib/figures/data.json` ma 68 figur, na liście otwartej jest 34. Żadna figura w runtime nie jest bez wpisu „shown”. Wszystkie 71 skrótów v1 zgadza się z `--skroty`. Reverse Lunge, Push Press i Pendlay Row mają werdykt „ukryta”, nie ma ich w runtime, są na liście otwartej. Lunges (hantle), Walking Lunges, Incline Push Up i Step Up są w runtime z wpisem z 28.10 i z odwołaniem do recenzji niezależnej (`docs/research/figury-recenzja.json:357` itd.). `check:zrodla-runtime` kod 0 (`dowody/zrodla-runtime-check.txt`). `tests/figury-recenzja.test.tsx` 32/32 (`dowody/jest-figury-recenzja.txt`).
- **Mutacje (sonda, cofnięte):** (1) zmiana klatki Step Up powoduje, że `--check` kończy się kodem 1, a figura wypada z runtime; (2) zmiana polskiego tekstu `stepup.move` też powoduje, że figura wypada; (3) zmiana tekstu `sumo.kneesOut`, który występuje tylko na kartach v2, nie zmienia żadnego skrótu v2. Szczegóły: `dowody/mutacje-bramka4.txt`.
- **v2 wyświetlane tylko w rodzinach `ready`:** `lib/figures/v2/figure.ts:29`. Wpis recenzji v2 z aktualnym skrótem wymusza test, nie aplikacja w działaniu. Wystarcza to jako bramka verify.
- **Nadal otwarte (część v2).** Skrót rodziny v2 to tekst trzech plików rigu i wariantów (`scripts/zrodla-runtime.mjs:52`), bez tekstów wskazówek i bez `cue-sets.json`. 87 ćwiczeń ma figurę v2. Na ich kartach jest 9 id wskazówek spoza każdego skrótu v1 (`sumo.*`, `wall.*` z oddechem `wall.breath`, `bp.elbowsMid`), a do tego przypisania zestawów ogólnych (`dowody/sonda-v2-karty-poza-skrotem.txt`). Wpis v2 nazywa recenzję recenzją ruchu L-042 (`docs/research/figury-recenzja.json:603`). Zapisu recenzji treści kart v2 w repo nie znalazłam [DO USTALENIA: czy recenzja L-042 obejmowała karty; jej zapis leży na gałęzi, której nie czytam]. Test akceptacyjny z audytu wymagał skrótu figury i wskazówek dla każdej wyświetlanej figury, v1 albo v2, więc jest spełniony tylko dla v1. Poziom pozostałej części: P2, bo teksty mają źródła w `data/zrodla/` i nie znalazłam w nich błędu; brakuje zapisu i wymuszenia. Minimalna poprawka: do `rodzinaSkrot` dodać id i polskie teksty wskazówek ćwiczeń rodziny (własne i z zestawu ogólnego), potem nowa recenzja treści i nowy wpis.
- Tłumaczenia wskazówek (34 języki) nie wchodzą do skrótu (dotyczy też v1). W tym zakresie zmieniono 15 plików `lib/cues/text/*.json` (przegląd 1a). Dwa pliki sprawdziłam wyrywkowo (es, ru, 7 zmian): sens zgodny z PL. Recenzja tłumaczeń należy do roli lokalizacji.

### Wynik 06-tresci-002 (M1-021, strażnik rejestru): zweryfikowane
- `scripts/claims.mjs:30` (słownictwo dziedziny) i `scripts/claims.mjs:32` (jawna lista kluczy). `check:claims` kod 0: 59 wpisów, 41 tekstów dziedzinowych, w tym 7 bez twierdzenia z powodem (`dowody/check-claims.txt`).
- Sonda: wszystkie teksty wskazane w audycie 27.10 strażnik rozpoznaje i każdy ma wpis: „chroni mięśnie” (T-047, T-048), 4–6 powtórzeń ≈ 80% (T-050), „Siła też wtedy rośnie” (T-052, T-056), kąt stóp (T-054), tempo faz (T-059), warianty „Wysiłek:” (T-009, T-027, T-053, T-058), „Dzień po dniu” (T-049), jeden trening w tygodniu (T-057) — `dowody/sonda-claims-pokrycie.txt`. Test `tests/audit-m1-048-claims-registry.test.ts` 16/16 (`dowody/jest-audit-m1-048-claims-registry.txt`).
- Uwaga poza zakresem werdyktu: T-050 i T-056 mają w uwadze „[OTWARTE — przelicznik %1RM ↔ powtórzenia]”. Status jest zapisany, więc nie zgłaszam go ponownie.

### Wynik 06-tresci-003 (M1-021, źródła z 25.10 w repo)
- **Zestawy ogólne: zweryfikowane.** `data/zrodla/wskazowki-ogolne.json` ma 177 wskazówek i 538 przypisań. Kontrola w `check:zrodla-runtime` daje kod 0. Test `tests/zrodla-pelne-wskazowki-ogolne.test.ts` 4/4. Kod aplikacji (`app/`, `components/`, `lib/`) nie importuje `data/zrodla`: grep kod 1, 0 trafień, więc nazwy źródeł nie trafiają do paczki. `tests/zrodla-wiedzy.test.ts` 21/21. Pola „miejsce”: 106, najdłuższe 110 znaków, żadne nie ma więcej niż 2 zdań (`dowody/wskazowki-ogolne-kontrola.txt`). Próbka losowa źródeł (ziarno w pliku dowodu): `hab.hips` (NHS) i `wr.forearms` (ISSA) — cytaty zgadzają się dosłownie na surowym tekście. Obie wskazówki nie mają dziś tekstu PL, więc aplikacja ich nie wyświetla. Źródła ACE i NSCA nieotwarte (403) — `dowody/zrodla-odczyt-2026-10-28.txt`.
- **Kąt stóp 15–20°: nadal otwarte.** Tekst jest wyświetlany pod figurą przysiadu (`scripts/zrodla-runtime.mjs:92`, `components/ExerciseFigureV2.tsx:105`). Rejestr ma T-054 jako „otwarte” (`docs/research/rejestr-twierdzen.json:828`), plik źródeł też (`data/zrodla/wskazowki-ogolne.json:3961`). Dziś otworzyłam SBS How to Squat: cytat 15-20 degrees zgadza się dosłownie. NSCA Basics dalej zwraca HTTP 403, a Wayback jest niedostępny. CLAUDE.md wymaga dla przedziału kątów 2 zgodnych przeczytanych źródeł szczebla 4. Treść nie jest sprzeczna z przeczytanym źródłem, więc poziom zostaje P2. Minimalna poprawka do wyboru właściciela (sprawa produktowa): (A) do czasu drugiego odczytu tekst bez liczby, np. palce lekko na zewnątrz — kompromis: wymaga przekładu na 35 języków, rola 04 i tłumacz; (B) właściciel pobiera PDF w przeglądarce, a badacz potwierdza miejsce — kompromis: kilka minut właściciela, tekst bez zmiany. Rekomendacja: B, a jeśli nie da się tego zrobić przed zgłoszeniem — A.

### Wynik 06-tresci-004 (M1-020): zweryfikowane
- `lib/state/effort.ts:20` (RIR_MAX 6), `lib/state/effort.ts:22` (RPE_RIR_MIN 5), `lib/state/effort.ts:29` (RIR 5–6 → RPE 5, RIR > 6 → RPE 4). Test regresji `M1-audytor-generalny-020` przechodzi (`dowody/jest-regress-020.txt`, kod 0). MER2-08 3/3 (`dowody/jest-audit-k1-bl-mer-MER2-08-timeout60s.txt`). Pierwszy przebieg całego pliku przekroczył limit 5 s w jednym teście na obciążonej maszynie (`dowody/jest-audit-k1-bl-mer.txt`, 22/23). Z limitem 60 s ten sam test przechodzi w 0,7 s, więc przyczyną jest środowisko, nie kod.
- Źródło otwarte dziś (Helms i in. 2016, PMC4961270, Europe PMC fullTextXML): cytat o grupowaniu 5–6 jako 4–6 RIR i opisy słowne poniżej RPE 5 zgadzają się dosłownie (`dowody/zrodla-odczyt-2026-10-28.txt`). Tekst Ustawień składa liczby z parametrów (`app/more/settings.tsx:55`). Werdykt dla nowego zachowania: POPARTE. Para zdań: pierwsze zdanie podaje RIR = 10 − RPE, a RIR 6 zapisuje się jako RPE 5 — to znana rozbieżność 06-tresci-005, uproszczenie nazwane w RD-02 (`kontrola-brd` kod 0, `dowody/kontrola-brd.txt`).

## Przegląd różnicy 025a50b..2385e75 w obszarze roli
Pliki: `lib/figures/data.json`, `data/zrodla/figures.json` (20 figur zmienionych), `data/zrodla/wskazowki-ogolne.json` (nowy), 15 plików `lib/cues/text/*.json`, `docs/research/{rejestr-twierdzen.json, figury-recenzja.json, 28-figury.md, przeglad-tresci-2026-10-27.md, espresso-mimit-2026-10.md}`, `tests/figury-podparcie.test.ts` (nowy).
- **Reguły podparcia łapią opisany błąd.** `tests/figury-podparcie.test.ts:102-134` uruchamia reguły na klatkach sprzed poprawki. Wady wychodzą: Lunges ze stopą w powietrzu, biodro ponad 20 j. przed podporą; Step Up z biodrem 19,5 j. za piętą; Step Up po pierwszej poprawce ze środkiem ciężkości ponad 6,5 j. za piętą, przy czym stara reguła ±10 j. go przepuszczała; Incline Push Up z barkiem ponad 25 j. od dłoni. Na figurach poprawionych reguły dają wynik 0. Moje mutacje na bieżących klatkach: przywrócenie starej pozycji „w trakcie” w Lunges daje 10 naruszeń; Step Up z tułowiem pionowo albo odchylonym w tył daje 29–30 naruszeń reguły jednej podpory (`dowody/sonda-figury-geometria.txt`). Plik testów 20/20 (`dowody/jest-figury-podparcie.txt`). Ograniczenie: reguła pompek sprawdza bark względem dłoni. Przesunięcie całej dolnej pozycji razem z dłońmi poza blat łapie inny test, scenariuszowy (dłoń na blacie, `tests/figury-podparcie.test.ts:153`), nie reguła pompek.
- **Moja ocena ruchu (geometria klatek, `dowody/sonda-figury-geometria.txt`):** *Lunges / Walking Lunges*: start w staniu; w pozycji „w trakcie” krok jest postawiony (przednia stopa płasko, wysokość 0,3–0,7 j.), tułów pionowo; na dole przednie kolano ma 70° (wewnętrzny kąt), tylne kolano jest 5,9 j. nad podłogą, a przednie kolano 4 j. przed palcami. To zgadza się z kartą („tylne kolano tuż nad podłogą”, „krok w przód”). Walking Lunges nie pokazuje kroku drugą nogą — znane ŚREDNIE, backlog 1.0.1. *Step Up*: stopa na skrzyni stoi w miejscu; w pozycji „w trakcie” tułów jest pochylony ok. 30°, a środek ciężkości (x 4,2) leży nad stopą na skrzyni (−2…12); na górze noga wyprostowana. Drugą nogę uniesioną na końcu nazywa notatka figury („uproszczenie”). *Incline Push Up*: linia bark–biodro–kostka 180° we wszystkich pozycjach, dłoń na blacie, w dolnej pozycji bark 8 j. przed dłonią i 13,8 j. nad blatem — zgodne z „Opuść klatkę do krawędzi”. Ruchu sprzecznego z kartą nie znalazłam.
- **Ukryte:** Reverse Lunge, Push Press i Pendlay Row mają werdykt „ukryta” i nie ma ich w runtime (wyżej). Wskazówki tekstowe zostają, zgodnie z decyzjami 2a i Reverse Lunge (`docs/18-przekazanie.md:611`, `docs/18-przekazanie.md:622`).
- **Źródła anonimowe publicznie:** `tests/zrodla-wiedzy.test.ts` 21/21. W `store/` i `site/` nie ma nazw źródeł; jedyne trafienie to angielskie słowo „who” w notatkach dla recenzji (`dowody/regresja-probka.txt`). Testy nazw marek i długości cytatów w `docs/research` przechodzą: `dowody/jest-audit-k1-brands.txt`, `dowody/jest-research-quotes.txt`.
- **Dokumenty generowane:** `check:figures`, `check:cues` i `check:figures-v2` kod 0 (`dowody/check-figures.txt`, `dowody/check-cues.txt`, `dowody/check-figures-v2.txt`).

## Weryfikacja twierdzeń
Zakres: twierdzenia zmienione albo dodane w naprawach w obszarze roli (T-041, T-054) i próbka regresji. Źródła otwarte dziś, cytaty sprawdzone dosłownie na surowym tekście (`dowody/zrodla-odczyt-2026-10-28.txt`). Hierarchia: z CLAUDE.md projektu. Skrypt: rolę `kontrole-tresci.mjs` pełni `scripts/claims.mjs`, bo projekt nie używa znaczników [T:ID] (kontrola zastępcza, jak w audycie); kod 0.

| ID | Zdanie (plik:linia) | Twierdzenie | Źródło otwarte dziś | Cytat | Werdykt | Para zdań | Minimalna poprawka | Znalezisko |
|---|---|---|---|---|---|---|---|---|
| T-041 | `app/more/settings.tsx:55` | RIR 0–6; powyżej 6 „lekko” (RPE 4); poniżej RPE 5 skala opisowa | Helms 2016, PMC4961270, Introduction i Incorporating… | “scores of 5–6 were grouped as 4–6 RIR”; “3–4 RPE = “light effort”” | POPARTE | z „RIR = 10 − RPE” → 06-tresci-005 (znane) | — | — |
| T-054 | `scripts/zrodla-runtime.mjs:92` (tekst pod figurą) | palce na zewnątrz zwykle 15–20° | SBS How to Squat, Foot Angle; NSCA Basics — 403 | “toes pointed out 15-20 degrees” | POPARTE jednym źródłem; drugie — Do sprawdzenia | — | patrz wynik 06-tresci-003 | 06-tresci-003 |
| T-015 | `lib/stats.ts:44` (Push Up 0.64) | pompki ok. 64% masy ciała | van den Tillaar i Ball 2020, PMC7386139, Results | “from 62.6 to 65.1% of body mass” | POPARTE | — | — | — |
| T-021 | `lib/deload.ts:10` (4–6 tygodni) | deload zwykle co 4–6 tygodni | Bell i in. 2023, PMC10511399 | “Deloading is generally undertaken every 4–6 weeks” | POPARTE | — | — | — |

## Próbka regresji (trzy pozycje listy kontrolnej spoza zmienionych plików)
Pliki bez zmian w 025a50b..2385e75: `lib/deload.ts`, `components/MedicalNote.tsx`, `store/app-store-metadata.json` (`dowody/regresja-probka.txt`).
1. **TRE-06 (liczby = rejestr):** `lib/deload.ts:10` [4, 6] i `lib/stats.ts:44` Push Up 0.64, który nie zmienił się mimo zmiany innych linii pliku. Wartości zgodne z T-021 i T-015, źródła otwarte dziś (tabela wyżej). Wynik: ok.
2. **TRE-10 (granica zastosowania):** zdanie o poradach medycznych bez zmian (`components/MedicalNote.tsx:9`). Wynik: ok.
3. **TRE-14 (treść tam, gdzie wskazuje CLAUDE.md; źródła anonimowe):** brak nazw źródeł w `store/` i `site/`; `data/zrodla/` nie trafia do kodu aplikacji. Wynik: ok.

## Znaleziska (szczegóły)

### 06-tresci-601 · CLAUDE.md opisuje tekst dziedzinowy węziej, niż sprawdza strażnik po naprawie M1-021, więc agent czytający regułę może uznać, że tekst bez nazwy źródła nie potrzebuje wpisu
- Pozycja listy kontrolnej: TRE-01
- Poziom: P2
- Realność: brzegowy (strażnik i tak zablokuje verify, więc skutkiem jest stracony przebieg i mylna reguła, nie tekst bez wpisu w wydaniu) · Pewność: wysoka
- Rodzaj: D
- Dowód: `CLAUDE.md:109` definiuje tekst dziedzinowy jako powołujący się na źródło albo nazywający swoją wagę. `scripts/claims.mjs:30` rozpoznaje od 27.10 także słownictwo dziedziny (RIR/RPE, % maksimum, kąty, „zwykle”, siła, regeneracja, cardio), a `scripts/claims.mjs:32` — jawną listę kluczy. `check:claims`: 41 tekstów dziedzinowych przy 0 według starej definicji (`dowody/check-claims.txt`). Wpis decyzji DEC-05 a opisuje nową regułę (`docs/18-przekazanie.md:605`), a CLAUDE.md nie został zmieniony. Fix M1-021 zostawił to w „Co otwarte” do koordynatora, ale nie ma tego w backlogu.
- Mechanizm: reguła w CLAUDE.md i kod strażnika rozjechały się przy naprawie, bo agent naprawy nie zmienia CLAUDE.md, a przekazanie nie trafiło do żadnej listy; `grep -n "nazywający swoją wagę" CLAUDE.md` → 1 trafienie: `CLAUDE.md:109`.
- Powraca: tak — ten sam mechanizm co w 06-tresci-001 (reguła i wymuszenie w różnych miejscach) → trwała kontrola: test, że CLAUDE.md wymienia `DOMAIN_WORDS_RE`/`DOMAIN_KEYS` (wzór: strażniki dokumentów generowanych).
- Wzorzec lub źródło: CLAUDE.md, „Liczby … w jednym miejscu; dokumenty generowane z kodu, nie przepisywane ręcznie”.
- Kroki w aplikacji: brak (dotyczy pracy agentów).
- Opcje: (A) koordynator zmienia zdanie w CLAUDE.md na odesłanie do `scripts/claims.mjs`, bez kopiowania listy słów — kompromis: jedno zdanie, reguła żyje w kodzie; (B) zostawić i dopisać do backlogu — kompromis: rozjazd zostaje. Rekomendacja: A.
- Test akceptacyjny: zdanie w CLAUDE.md odsyła do wzorca w `scripts/claims.mjs` i nie zawęża definicji; test-strażnik dokumentu przechodzi.
- Status: otwarte

## Do sprawdzenia (pewność ≤ 80%)
- Czy recenzja L-042 rodzin v2 obejmowała treść kart (wskazówki, zestawy ogólne, mięśnie), a nie tylko ruch. Zapis leży na gałęzi, której nie czytam. Krok koordynatora: wskazać miejsce w repo albo dopisać recenzję treści kart v2 (wpływa na wynik 06-tresci-001).
- NSCA Basics 2012, s. 49 (drugie źródło T-054) — HTTP 403 również 28.10. Krok właściciela: pobrać PDF w przeglądarce; potem odczyt przez badacza.
- Bulgarian Split Squat: środek ciężkości 12–18 j. za piętą przedniej stopy przy tylnej stopie na ławce (`dowody/sonda-figury-geometria.txt`). Recenzja niezależna z 28.10 oceniła to jako „między stopami” (OK). Źródła o rozkładzie ciężaru między nogami nie czytałam, więc nie zgłaszam znaleziska.
- Na kartach v1 są wskazówki z zestawu 52 id bez tekstu PL. Aplikacja je pomija; sprawdziłam tylko mechanizm filtrowania w `components/ExerciseCues.tsx`, nie każdy ekran.

## Pokrycie
| Obszar | Sprawdzone? | Jak |
|---|---|---|
| Mechanizm bramki 4 v1 i v2 | tak | kod, test 32/32, mutacje 1–3, sondy skrótów |
| Reguły podparcia (test na złej klatce) | tak | test 20/20, mutacje Lunges i Step Up |
| Geometria 4 poprawionych figur + Push Up, BSS | tak | `dowody/sonda-figury-geometria.txt` |
| Rejestr twierdzeń, strażnik | tak | `check:claims`, sonda pokrycia, test 16/16 |
| `wskazowki-ogolne.json` | tak, źródła w próbce (2 z 52) | kontrola długości, test 4/4, curl |
| Tłumaczenia wskazówek | próbka es, ru (7 zmian) | porównanie z PL i EN |
| Animacje w aplikacji na urządzeniu | nie sprawdzono | Linux bez symulatora; krok: tester-e2e, scenariusz biblioteki z kartą Step Up / Lunges (`tylko_scenariusze`) |
| Strona z ćwiczeniami | nie sprawdzono | poza main (9a otwarte) |

## Kontrola dowodów i sekretów
`node /home/user/trening/audit/M1-2026-10-27/reaudit-2026-10-28/sprawdz-raport.mjs <raport> /home/user/trening <katalog wyjścia> --rola 06-tresci` — wynik w `dowody/sprawdz-raport.txt`. Raport bez e-maili, UDID, sekretów i nazw innych aplikacji; cytaty ze źródeł do 1–2 zdań.

`git status --porcelain` drzewa /home/user/trening na początku: puste (`dowody/git-status-start.txt`); na końcu: `dowody/git-status-koniec.txt`. Worktree sond usunięty (`git worktree remove`).
