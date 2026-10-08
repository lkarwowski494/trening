# Audyt 0.10.0 — merytoryka i prawdziwość tekstów (MER)

Raport źródłowy audytora z 08.10.2026 (commit d2a1e85), bez zmian treści. Zbiorczo: [docs/25](../25-audyt-0.10.md). Ścieżki do plików roboczych (worktree, scratchpad) dotyczą sesji audytu — pliki nie są w repozytorium.

## Zakres i pokrycie

**Commit.** Audyt dotyczy d2a1e85. Od początku czytałem kod z eksportu `git archive d2a1e85`, a nie ze starego f435c8c. Po przełączeniu worktree przez koordynatora sprawdziłem: `diff -rq lib` daje identyczne pliki, więc żadne znalezisko nie pochodzi ze starego kodu.

**(a) Twierdzenia dziedzinowe.** Przejrzałem wszystkie 893 klucze `lib/i18n.en.ts`:
- 184 dłuższe teksty przeczytałem w całości, resztę przejrzałem.
- Dodatkowo: `lib/guide.ts`, `lib/whatsnew.ts`, `lib/generator.ts`, `lib/deload*.ts`, `lib/start.ts`, `lib/plan.ts`, `lib/stats.ts`, `lib/seed.ts` (mięśnie), katalog (`catalog.json`), `lib/plates.ts`, `lib/health.ts`, `app.json` (opisy uprawnień).
- Wyszło 34 twierdzeń, liczb i reguł: RIR=10−RPE, kreska 10 serii, 0,5 serii pomocniczej, deload (co 4–6 tyg., próg 4 tyg., „około połowy”, „ciężary bez zmian”), regeneracja (dzień przerwy, dwa dni pod rząd, powrót w 10 dni), cała rodzina reguł generatora (≥2×/tydz., 4–6 przy ≥80% 1RM, 6–10, 8–12 / w domu 12–20, RIR 1–3, przerwy 180/120/90, 3 serie, WARMUP_MIN/SET_WORK_SEC/AVG_REST, redukcja + cardio, 150–300 min), progresja (+2,5/+1 kg, +1 powtórzenie), e1RM (Epley, limit 10 powtórzeń, masa ciała), objętość i mnożniki, przypisanie mięśni, mapa mięśni, gumy, talerze i sztangi, DEFAULT_REST 90 s, zamiany, Apple Health.

**(b) Tekst a zachowanie.** Sprawdziłem:
- przewodnik: 24 kroki;
- „Co nowego”: 14 pozycji;
- 9 opisów w Ustawieniach;
- podpowiedzi: DeloadHint (3 warianty), PeriodSummary (3), ekran generatora (14 tekstów), panel dnia / Propozycje (8);
- 4 okna (alerty), „Pierwsze kroki” (3), edytor szablonu (2), Postępy (5).

**(c) Granica medyczna.** Przeszukałem 893 klucze pod kątem słów zdrowotnych, do tego opisy uprawnień iOS i docs/15.

**Źródła przeczytane samodzielnie** (pełne teksty z Europe PMC, cytaty niżej):
- ACSM 2026 (PMC12965823), WHO 2020 (PMC7719906), Bastos 2024 (PMC11127506), Helms 2016 (PMC4961270);
- deload: Rogerson 2024 (PMC10948666), Bell 2022 (PMC9811819), Bell 2023 (PMC10511399), Travis 2020 (PMC7552788);
- Cuthbert 2021 (PMC8363540);
- tylko streszczenia: Pelland 2026, Robinson 2024, Kubo 2019.
- Oryginału Garber 2011 (ACSM, „48 h”) nie przeczytałem: strona zwraca 402 (płatny dostęp).

**Rejestr decyzji na Dysku** („03 Rejestr decyzji”): sprawdziłem ADR-018 i ADR-038…041 oraz wpis o decyzji Q-001 (ADR bez numeru w wyciągu).

**Testy robocze** (niezacommitowane, w worktree):
- `tests/zz-audit-mer-gen.test.ts` — macierz generatora, 210 kombinacji: cel × sesje × długość × 5 miejsc;
- `tests/zz-audit-mer-gen2.test.ts`;
- `tests/zz-audit-mer-deload.test.ts`;
- `tests/zz-audit-mer-e1rm.test.ts`.

Wszystkie przechodzą i potwierdzają znaleziska opisane niżej.

## Znaleziska

### MER-01 — „Siła” bez obciążenia: 3 × 4–6 przysiadów i pompek bez ciężaru jako „ciężko, ok. 80% maksimum”
- **Waga:** KRYTYCZNA (błędne zalecenie treningowe; nieskuteczne, ale nie groźne).
- **Dowód (POTWIERDZONE, zz-audit-mer-gen2):** wynik `generate({goal:'strength', sessions:3, minutes:60})` dla miejsca „Dom” (pusty preset) i „Tylko masa ciała” (`home=true`):
  - FBW A: `Bodyweight Squat 3x4-6 r180; Push Up 3x6-10; Pike Push Up 3x6-10; Łydki na stopniu 3x6-10 r120; Dead Bug 3x6-10 r120`;
  - FBW B: `Push Up 3x4-6 r180; … Bird Dog 3x6-10 r120`.
  - Przyczyna w `lib/generator.ts:86-88`: gałąź „siła” ignoruje `home`; tylko masa i redukcja używają `home ? 12 : 8`.
  - Ekran, `app/generator.tsx:22`: „Siła: bój główny na początku, 3 serie po 4–6 powtórzeń (ciężko, ok. 80% maksimum i więcej)”.
  - ACSM 2026, tab. 6: „Strength … Intensity: ≥80% 1RM (dose-response)”; tamże: „completion of 'near-failure' or a target of 2–3 RIR”.
  - docs/research/22 (R4) przewiduje „w domu lżej” tylko dla masy.
- **Skutek:** zapisane szablony „siłowe” nie są ani ciężkie, ani blisko upadku. Sprzeczne z podstawą, którą ekran sam podaje. Do tego Dead Bug / Bird Dog z przerwą 2 min.
- **Propozycja:**
  - A) cel „Siła” w miejscu bez obciążenia zewnętrznego (brak sztangi, hantli, kettli, maszyn, wyciągów, suwnicy Smitha): ostrzeżenie w podglądzie i zakresy jak „masa w domu” (12–20, blisko upadku);
  - B) chip „Siła” niedostępny w takim miejscu, z wyjaśnieniem;
  - C) progresje trudniejszych wariantów — wymagają źródeł.
  - **Rekomendacja: A.**
- **Test:** `generator.test` — dla presetów `bodyweight` i pustego `home` przy celu `strength` żadna pozycja bez obciążenia nie ma `repMax ≤ 6`; `generator-ui` — widoczne ostrzeżenie.

### MER-02 — „Każda partia co najmniej 2 razy w tygodniu (ACSM, przeglądy badań)”, a plan nie ma pleców, bicepsa i dwugłowych — bez ostrzeżenia przy „Siła”
- **Waga:** WYSOKA.
- **Dowód (POTWIERDZONE, macierz 210 kombinacji):**
  - Dom (pusty) i masa ciała, każdy cel: plecy 0 serii, biceps 0, dwugłowe 0 (przy 2–3 sesjach).
  - Hotel, każdy cel: dwugłowe w mniej niż 2 dniach.
  - Przy „Siła” `below10 = []` (`lib/generator.ts:98`), więc brak komunikatu; widać tylko liczbę „plecy 0” (`app/generator.tsx:55`). Tekst podstawy: `app/generator.tsx:61`.
  - Komunikat „Pomoże więcej sesji, dłuższy czas…” (`:56`) nie pomoże, gdy brakuje sprzętu.
  - Atrybucja: ACSM 2026 daje „Frequency: ≥2 sessions/wk” tylko dla siły. Dla masy: „RT did not influence hypertrophy performed with low (1 d/wk) versus high (>5 d/wk) frequency when total volume was equated”.
  - Zasada „wszystkie główne grupy ≥2 dni” to WHO 2020: „muscle-strengthening activities … that involve all major muscle groups on 2 or more days a week”. ADR-041 cytuje WHO, ekran podaje „ACSM, przeglądy badań”.
  - Na siłowni i bez miejsca wymóg jest spełniony, jeśli liczyć partie pomocnicze.
- **Propozycja:**
  - A) liczyć dni na partię (główna albo pomocnicza) dla każdego celu; pokazywać „Brak ćwiczeń na: plecy, biceps — przyda się drążek/guma” i „rzadziej niż 2×: …”; atrybucja „(WHO 2020; ACSM — siła)”;
  - B) tylko zastrzeżenie w „Na czym to oparte”.
  - **Rekomendacja: A.**
- **Test:** dla każdego presetu × celu partia z 0 serii albo z mniej niż 2 dniami trafia do widocznego ostrzeżenia.

### MER-03 — „e1RM (dociążenie)” liczone z samego dociążenia nie jest szacunkiem Epleya; rekord e1RM odwraca kolejność
- **Waga:** WYSOKA.
- **Dowód (POTWIERDZONE, zz-audit-mer-e1rm):**
  - Pull Up +20×8 daje bestE1rm 25,33. Seria +30×3 dostaje `setPRs = ['e1RM']` („Nowy rekord”).
  - Epley z obciążenia całkowitego (80 kg ciała): 100×8 → 126,7, a 110×3 → 121. Lepsza jest seria +20×8: odpowiednik dociążenia 46,7 kg wobec 41 kg.
  - Kod: `lib/stats.ts:27-28` (`e1rm(effectiveLoad)`), `lib/store.ts:491` (`max(0, ±kg)`).
  - Ekran: `app/more/progress.tsx:71` „e1RM (dociążenie)”, `lib/stats.ts:182` „e1RM {v} (seria {s})”.
  - Rejestr: ADR-018 — e1RM „nie liczone dla ćwiczeń z masą ciała”. Późniejszy wpis o decyzji Q-001 (właściciel) — „e1RM z samego dociążenia”. Według CLAUDE.md to kwestia merytoryczna (wzór S1), której właściciel nie rozstrzyga.
- **Skutek:** liczba wygląda na szacunek 1RM, a jest mniej więcej o połowę zaniżona; odznaki rekordu są błędne.
- **Propozycja:**
  - A) brak e1RM dla ćwiczeń z masą ciała (jak ADR-018); rekordy: max dociążenie i suma powtórzeń. Cel Q-001 („masa ciała poza obliczeniami”) zostaje.
  - B) nazwa bez „1RM” („wskaźnik dociążenia”) i bez odznaki.
  - C) przywrócić masę ciała — odrzucone przez właściciela.
  - **Rekomendacja: A.**
- **Test:** `setPRs` dla ćwiczenia z masą ciała nigdy nie zwraca `'e1RM'`; Postępy dla Pull Up nie mają wiersza e1RM.

### MER-04 — „mniej serii (około połowy)”, a dla 3 serii zostają 2
- **Waga:** WYSOKA (dotyczy 100% szablonów z generatora; łagodzi to okno z dokładnymi liczbami).
- **Dowód (POTWIERDZONE):**
  - Szablon 3×3 → `deloadCounts = {full 9, less 6}`. Szablony z generatora mają zawsze 3 serie, więc 12/18, 16/24 itd. (cięcie 33%).
  - Kod: `lib/deload-sets.ts:9` `Math.ceil(n/2)`.
  - Teksty: `components/DeloadHint.tsx:27` (dwa warianty) i `components/PeriodSummary.tsx:46` — „…mniej serii (około połowy), ciężary bez zmian”.
  - Samo cięcie mieści się w źródłach: Bell 2022 „ranged from 25% to > 50%”; Travis 2020 „reduce training volume by approximately 30–70%”. ADR-040 sam pisze „cięcie 33–50%”.
- **Propozycja:**
  - A) tekst „o około 1/3–1/2 mniej serii (np. 2 z 3)”;
  - B) zmiana reguły na floor(n/2) — 3→1 to 67%, poza „25–>50%” praktyki.
  - **Rekomendacja: A.**
- **Test:** dla n=2..6 tekst zgadza się z `deloadKeep`.

### MER-05 — Tydzień deload: „ciężary bez zmian”, a „↑ spróbuj +2,5 kg” działa; „Powtórz ostatni” i szablony z jedną serią omijają propozycję
- **Waga:** WYSOKA.
- **Dowód (POTWIERDZONE, zz-audit-mer-deload):**
  - Tydzień deload, poprzednio 3×12 przy zakresie 8–12, start z „Mniej serii” → `progressionFor` = `{load, 102,5}`; `components/ActiveWorkout.tsx:303-304` pokazuje „↑ spróbuj” bezwarunkowo.
  - `repeatLast()` w tygodniu deload: brak okna, 4 serie (`app/(tabs)/index.tsx:58`).
  - Szablon z samymi pojedynczymi seriami: brak okna (`lib/start.ts:20`).
  - Teksty mówią co innego: DeloadHint „Przy starcie treningu zaproponuję…”, `lib/guide.ts:37`, `lib/whatsnew.ts:22`.
  - Merytorycznie: Rogerson 2024 — „training intensity (load lifted) would decrease, and effort would be reduced”; Travis 2020 — „maintain … or reduce training intensity”. Żadne źródło nie mówi o dokładaniu ciężaru w deloadzie.
- **Propozycja:**
  - A) w tygodniu deload ukryć „↑”, zaproponować mniej serii także przy „Powtórz ostatni”, dopisek „ćwiczenia z 1 serią bez zmian”;
  - B) tylko poprawić teksty („przy starcie z szablonu”).
  - **Rekomendacja: A.**
- **Test:** w tygodniu deload brak „↑ spróbuj”; `repeatLast` wywołuje okno „Tydzień deload”.

### MER-06 — „zwykle 1–3 powtórzenia w zapasie” nie ma źródła wprost
- **Waga:** ŚREDNIA.
- **Dowód:**
  - Ekran: `app/generator.tsx:23` i `:64`.
  - ACSM 2026 (POTWIERDZONE): „'near-failure' or a target of 2–3 repetitions in reserve”; „insufficient evidence to quantify exact RIR … targets”.
  - Robinson 2024: „muscle hypertrophy improves as sets are terminated closer to failure”.
  - docs/22 (R5) nie podaje źródła dla „1–3”.
- **Propozycja:**
  - A) „zwykle 0–3 (ACSM: 2–3; dokładnej liczby nie ustalono)”;
  - B) zostawić 1–3 z oznaczeniem „uproszczenie”.
  - **Rekomendacja: A.**
- **Test:** tekst z jednej stałej, z oznaczeniem.

### MER-07 — Przerwy 180/120/90 s, 3 serie na ćwiczenie i długość cardio bez podstaw w podglądzie
- **Waga:** ŚREDNIA.
- **Dowód (Z KODU):**
  - `lib/generator.ts:86-88` (przerwy i serie), `:77` (cardio = minuty sesji), `:36` (jedna sesja cardio).
  - Nagłówek ekranu (`app/generator.tsx:32`): „Reguły pochodzą z przeglądów badań”, a punkty `:61-65` nie mówią nic o przerwach ani o liczbie serii.
  - docs/24 obiecywał przerwy jako „zwykle” (R6). docs/22: przerwy przy masie — Singer 2024, „jedno źródło”.
  - ACSM 2026 (POTWIERDZONE): krótkie vs długie przerwy nie zmieniają siły; dla masy „insufficient data”.
  - W miejscu „masa ciała” cardio to „Bieg — 90 min” — konwencja bez oznaczenia.
- **Propozycja:** dodać punkt „Przerwy: zwykle 2–3 min przy ciężkich seriach, 1,5–2 min przy masie — uproszczenie (przeglądy niejednoznaczne); 3 serie — ACSM: co najmniej 2; czas cardio = czas sesji — konwencja”.
- **Test:** każdy parametr podglądu ma swój punkt w „Na czym to oparte”.

### MER-08 — „Ruch w ciągu dnia też się liczy — razem zwykle 150–300 min (WHO, ACSM)”
- **Waga:** ŚREDNIA.
- **Dowód (POTWIERDZONE, WHO 2020):**
  - „Adults should do at least 150–300 min of moderate-intensity aerobic physical activity, or at least 75–150 min of vigorous-intensity…”;
  - „MVPA bouts of any duration now count towards these recommendations”;
  - lekka aktywność jedynie zastępuje siedzenie.
  - Ekran `app/generator.tsx:58`: „zwykle” robi z minimum wartość typową, a „ruch w ciągu dnia” obejmuje też lekki ruch. ADR-041 ma to samo sformułowanie („150–300 min ruchu”).
- **Propozycja:** „Zalecenie WHO: co najmniej 150–300 min umiarkowanego wysiłku tygodniowo (albo 75–150 min intensywnego); liczy się też umiarkowany ruch w ciągu dnia, np. szybki marsz, nawet krótki”. Poprawić też ADR-041.
- **Test:** tekst.

### MER-09 — „zwykle dzień przerwy … (przeglądy badań, ACSM)”: ACSM „48 h” znane tylko z drugiej ręki
- **Waga:** ŚREDNIA.
- **Dowód:**
  - Cuthbert 2021 (POTWIERDZONE): „ACSM guidelines suggest … 2–3 days per week with 48 h recovery in between [12]” — cytat wtórny.
  - docs/23: oryginał [OTWARTE]; Garber 2011 niedostępny (402).
  - Ekran: `components/DayPanel.tsx:86`.
  - Sama reguła ma podstawę na szczeblu 3 (ADR-038: Pareja-Blanco, Soares, Paulsen, Hayes). Druga część zdania (dwa dni pod rząd) — ACSM 2026, POTWIERDZONE.
- **Propozycja:**
  - A) atrybucja „(badania nad regeneracją; ACSM 2026 — dwa dni pod rząd)”;
  - B) przeczytać oryginał ACSM i podać stronę.
  - **Rekomendacja: A teraz, B później.**

### MER-10 — Przypisanie mięśni w katalogu bez źródeł; przykłady sprzeczne z badaniami
- **Waga:** ŚREDNIA.
- **Dowód:**
  - `docs/research/equipment/catalog-notes.md:58-61`: szkic agenta, drugi agent i recenzent; brak źródeł merytorycznych przy ćwiczeniach.
  - Te dane napędzają kreskę 10 serii, mapę mięśni, braki w generatorze i ostrzeżenia o regeneracji.
  - `lib/seed.ts:175`: Back Squat ma dwugłowe jako partię pomocniczą (+0,5 serii za każdą serię przysiadu). Kubo 2019 (PMID 31230110, streszczenie, POTWIERDZONE): „rectus femoris and hamstring muscles did not change in either group”; urosły przywodziciele i pośladki, a przywodziciele nie są liczeni.
  - Deadlift ma „plecy” jako partię główną, więc podziały góra/dół dostają ostrzeżenia „dzień po dniu te same partie” (1–2 pary przy 4–6 sesjach).
- **Propozycja:**
  - A) kolumna źródła dla 125 podstawowych ćwiczeń, zaczynając od najczęstszych;
  - B) od razu dopisek na ekranie ćwiczenia: „przypisanie partii — uproszczenie, nie wynik badań”.
  - **Rekomendacja: B teraz, A stopniowo.**
- **Test:** `catalog-v2` wymaga pola źródła dla LIB_BASE.

### MER-11 — Granica medyczna: podpowiedź „np. samopoczucie, ból, sprzęt” bez odesłania; generator bez notki zdrowotnej
- **Waga:** ŚREDNIA.
- **Dowód (Z KODU):**
  - `components/ActiveWorkout.tsx:160` (placeholder notatki).
  - W 893 kluczach brak „lekarz”, „specjalista”, „fizjoterapeuta” i jakiejkolwiek notki zdrowotnej.
  - Generator tworzy pełne plany, w tym 45–90 min cardio.
  - Dobrze: DeloadHint nie używa bólu stawów ani bolesności jako wyzwalacza.
- **Propozycja:**
  - A) jedno zdanie w generatorze, przewodniku i Ustawieniach: „Aplikacja nie udziela porad medycznych. Przy bólu, urazie lub chorobie skonsultuj się z lekarzem lub fizjoterapeutą.”;
  - B) tylko usunąć „ból” z podpowiedzi.
  - **Rekomendacja: A.**
- **Test:** tekst obecny w 26 językach.

### MER-12 — „Liczba ćwiczeń z czasu sesji: …”, a wzór daje liczbę serii
- **Waga:** NISKA.
- **Dowód (Z KODU):** `lib/generator.ts:28,78`; ćwiczeń = max(3, floor(serie/3)); „przerwa” we wzorze to AVG_REST (150/105 s), której ekran nie pokazuje (`app/generator.tsx:62`).
- **Propozycja:** „Liczba serii = …; ćwiczeń = serie/3 (co najmniej 3); średnia przerwa {r} s”.

### MER-13 — Edytor szablonu: „podpowiedź ‚↑ więcej {u}’”
- **Waga:** NISKA.
- **Dowód (Z KODU):**
  - Faktyczny tekst podpowiedzi to „↑ spróbuj 62,5” albo „↑ spróbuj 9 pow.”.
  - Opis pokazuje się też przy zakresie otwartym „8+”, gdzie podpowiedzi nigdy nie ma (`store.ts:665` wymaga repMax).
  - Pliki: `app/template/[id].tsx:145`, `store.ts:524`.

### MER-14 — RIR = 10 − RPE także poza RPE 5–10
- **Waga:** NISKA.
- **Dowód (POTWIERDZONE):** Helms 2016 — „descriptors of effort for values below 5 (1–2 RPE = 'little to no effort,' 3–4 RPE = 'light effort')”. Aplikacja przelicza RIR 6–10 na RPE 4–0 (`store.ts:716-718`); RPE 0 nie istnieje w skali.
- **Propozycja:** RIR 0–5, a powyżej „>5 = lekko”.

### MER-15 — Ekran Gumy: „postęp z gumą to zejście na niższy poziom”
- **Waga:** NISKA.
- **Dowód (Z KODU):** `app/more/bands.tsx:19`. Zdanie jest prawdziwe tylko dla asysty. Przy gumie jako oporze (edytor ćwiczenia, `equipvis role 'resist'`) jest odwrotnie, a rekordy liczą serie z gumą.

### MER-16 — Stopka Propozycji: „Po zmianach plan wraca do rutyny w ciągu {n} dni”
- **Waga:** NISKA.
- **Dowód (Z KODU):**
  - Zdanie jest bezwarunkowe, a propozycje z `returns=false` też się pokazują (`DayPanel.tsx:86`).
  - „z najmniejszą liczbą zmian” (`guide.ts:26`) — ranking to w kolejności: powrót do rutyny → brak utraconych sesji → nowe pary dzień po dniu → liczba zmian (`plan.ts:187`).

### MER-17 — 0,5 serii pomocniczej (Pelland 2026, jedno źródło) bez oznaczenia w podglądzie generatora; drop sety liczone jak pełne serie
- **Waga:** NISKA.
- **Dowód:**
  - Pelland 2026 (POTWIERDZONE): „evidence for the 'fractional' quantification method was strongest”.
  - „Uproszczenie” stoi tylko w jednym tekście Postępów. Podgląd generatora (`app/generator.tsx:55`) i drugi tekst Postępów — bez oznaczenia.
  - Drop sety liczone w `stats.ts:238`.

### MER-18 — Wygenerowany trening cardio („Bieg — 45 min”) trafia do Apple Health jako trening siłowy
- **Waga:** NISKA.
- **Dowód (Z KODU):** `lib/health.ts:47`; opis uprawnienia w `app.json:78` mówi „treningi siłowe”. Częściowo obszar LOG.

## Sprawdzone i w porządku

- **Kreska 10 serii i tekst o ACSM 2026** (POTWIERDZONE): „higher volume (≥10 sets/muscle group/wk)”; „Compared with CTRL, hypertrophy was improved by RT”. Tekst oznacza 0,5 jako uproszczenie.
- **RIR = 10 − RPE** (POTWIERDZONE): Bastos 2024, „Zourdos et al. (2016) created … RPE-9 has a description of one repetition remaining”. Dwa zespoły; dane zawsze zapisywane jako RPE.
- **Deload co 4–6 tygodni jako praktyka:**
  - Bell 2022: „programmed every 4 to 6 weeks”; Bell 2023: „generally undertaken every 4–6 weeks”; Rogerson 2024: „5.6 ± 2.3 weeks” (POTWIERDZONE).
  - Ekran mówi wprost „praktyka, nie wynik badań”; tłumaczenia (de, fr, es, it, uk) zachowują to zastrzeżenie.
  - Brak automatycznych wyzwalaczy (Meeusen 2013). Wielkość cięcia mieści się w źródłach.
- **Generator na siłowni:**
  - ≥80% 1RM, bój główny na początku, 3 serie (ACSM: „2–3 sets”, „Beginning of training session”) — POTWIERDZONE.
  - ≥10 serii na partię przy masie, braki pokazywane.
  - Zakresy 30–100% 1RM nazwane uproszczeniem (ACSM: „low (30% 1RM) to high (100% 1RM) loads”).
  - Podział sesji i progresja oznaczone jako konwencja; wzór czasu jako uproszczenie.
  - Pary dzień po dniu jako ostrzeżenie, nie blokada.
- **e1RM:** Epley w×(1+r/30) (`stats.ts:28`), limit 10 powtórzeń, liczenie na jedną hantlę.
- **Objętość:** definicja i wyłączenie rozgrzewki.
- **Mapa mięśni:** skala względna, celowo bez progów.
- **Zamiany:** wagi rankingu jawnie opisane w kodzie jako bez źródła; ekran tylko opisuje („te same mięśnie”).
- **Talerze i sztangi:** kolory talerzy wg IWF (źródło w `plates.ts`); domyślne sztangi edytowalne.
- **DEFAULT_REST 90 s:** wartość domyślna, a nie twierdzenie.
- **Apple Health:** tylko zapis treningu, bez kalorii; opisy uprawnień zgodne z działaniem.
- **Przewodnik (24 kroki) i „Co nowego” (14 pozycji):** nazwy przycisków istnieją, funkcje działają, poza wyjątkami z MER-05 i MER-16.
- **Rejestr na Dysku:** ADR-038…041 mają źródła i odrzucone alternatywy, zgodnie z CLAUDE.md.
- **Przypomnienie o wadze:** usunięte; klucze tekstów nieużywane, stare przypomnienie jest odwoływane (`timer.ts:173-177`).

