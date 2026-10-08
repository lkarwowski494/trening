# Audyt 0.10.0 — logika lib/ (LOG)

Raport źródłowy audytora z 08.10.2026 (commit d2a1e85), bez zmian treści. Zbiorczo: [docs/25](../25-audyt-0.10.md). Ścieżki do plików roboczych (worktree, scratchpad) dotyczą sesji audytu — pliki nie są w repozytorium.

## Zakres i pokrycie

Uwaga wstępna: worktree startował na f435c8c. Do czasu przełączenia przez koordynatora pracowałem na kopii d2a1e85 wypakowanej `git archive` do scratchpadu. Po przełączeniu sprawdziłem, że `HEAD` = d2a1e85, a `lib/` jest identyczne z tą kopią. Wszystkie znaleziska dotyczą d2a1e85.

- **Przeczytane w całości:** 27 plików z mojej listy (backup, calendar, dashboard, deload-sets, deload, edit, equipment, equipvis, generator, guide, health, loads, locations, musclemap, period, plan, planReminder, plates, plural, start, stats, store (akcje i helpery), swap, timer, units, whatsnew, signing) — **472 eksporty**, z czego 181 w store (bez persystencji i migrate). Do porównań przeczytałem też docs/24, docs/research/22 i 23, docs/14 pkt 6, docs/10 (presety) oraz ekrany korzystające z funkcji: generator, plan, DayPanel, Dashboard, PeriodSummary.
- **Sondy (wszystkie przechodzą, wyniki w scratchpadzie):** 10 plików `tests/zz-audit-log-{pure,a,b,c,d,e,f,g,h,tz}.test.ts`, około 50 przypadków, w tym pętle właściwości:
  - jednostki: 10 001 wartości w lb (wpis↔wyświetlanie), 50 001 wartości kg (idempotencja), 100 001 wartości siatki kg;
  - talerze: wszystkie osiągalne ciężary dla 3 opisów sprzętu; 300 losowych zestawów porównanych z brute-force (DP, minimalna liczba talerzy); 4000 wartości dla 30 rodzajów talerzy;
  - liczba mnoga: 26 języków × liczby 0–1200 porównane z `Intl.PluralRules`;
  - `monthGrid`: 504 miesiące;
  - strefy czasowe: Europe/Warsaw, America/Los_Angeles, Pacific/Auckland, America/Santiago × 800 dni × 6 godzin (addDays, weekdayIdx, mondayKey, thisMonday, weekStrip, nextMonday, periodRange, shiftDate, DST w parseWhen);
  - generator: wszystkie **210 konfiguracji** (cel × sesje × czas × 5 miejsc);
  - superserie (5 kolejności odhaczania), progressionFor kg/lb, pauzy, sugestie planu, przypomnienia przy zmianie czasu, CSV, e1RM i PR.

## Znaleziska

### LOG-01 — Propozycje planu i „Przenieś na dziś” nie widzą treningów już zrobionych: sesja z planu ginie albo jest planowana drugi raz
- **Waga:** WYSOKA
- **Dowód (POTWIERDZONE):** `tests/zz-audit-log-h.test.ts`, wyniki w `scratchpad/log-h.json`.
  - **Przypadek 1:** plan pon A; poniedziałek opuszczony; w środę rano zrobiony trening C spoza planu. `suggest(pon, śr)` — pierwsza propozycja to `shift`. Po jej zastosowaniu `dayStatus(śr)` = done z szablonem A, poniedziałek = rest. Trening A zniknął z tygodnia, choć propozycja pokazywała `dropped: 0`. Tak samo działa `moveOnly(pon, śr)`, czyli przycisk „Przenieś na dziś”.
  - **Przypadek 2:** plan pon A, śr B; poniedziałek opuszczony, B zrobione w środę. Propozycja `shift` daje: śr „done (A)”, czw „planned B”. B jest zaplanowane drugi raz, A przepada.
- **Przyczyna (Z KODU):** `lib/plan.ts:160–188` (suggest) i `:99` (moveOnly) liczą tylko plan, bez `finishedWorkouts`. `components/DayPanel.tsx:42` pokazuje „Opuszczony: …” dla każdego przeszłego dnia z planem, także gdy `dayStatus` = done, i oferuje dla niego „Przenieś na dziś” i „Propozycje”.
- **Skutek:** w typowej sytuacji (wieczorem, po treningu, otwierasz opuszczony dzień) aplikacja proponuje i stosuje plan, który gubi sesję albo dubluje zrobioną.
- **Propozycja:** dzień z zakończonym treningiem traktować w symulacji jako zajęty (nie wolno na niego przenosić; nie wolno ustawiać na nim innego szablonu). „Zrobione” liczyć w `dropped` i `newBackToBack`. DayPanel brać stan z `dayStatus`.
- **Test regresji:** dwa scenariusze z `zz-audit-log-h` jako testy w `tests/regress` lub w teście planu.

### LOG-02 — e1RM w ćwiczeniach z masą ciała liczony z samego dociążenia: odwrócona kolejność serii i rekordów
- **Waga:** WYSOKA. Według rubryki to „błędny wynik”, więc mogłaby być KRYTYCZNA. Obniżyłem, bo dotyczy tylko ćwiczeń z masą ciała z dociążeniem i wynika ze świadomej decyzji Q-001.
- **Dowód (POTWIERDZONE):** `zz-audit-log-g`. W historii Pull Up +15 kg × 8, w nowym treningu +20 kg × 3.
  - Aplikacja: `prMap` daje „e1RM 22 kg (seria 20 kg × 3)” jako rekord, bo e1rm(15, 8) = 19 < e1rm(20, 3) = 22.
  - Przy masie ciała 80 kg: Epley na całym podnoszonym ciężarze daje e1rm(95, 8) = 120,3 > e1rm(100, 3) = 110. Kolejność jest odwrotna dla każdej masy ciała powyżej około 18 kg.
- **Gdzie (Z KODU):** `lib/stats.ts:27` (`recE1` → `effectiveLoad`), `lib/store.ts:491`; etykieta „e1RM (dociążenie)” w `stats.ts:198`.
- **Opis:** wzór Epleya mnoży podnoszony ciężar przez (1 + r/30). Policzony z samego dociążenia nie jest dociążeniową częścią e1RM — różni się o BW·r/30, a ta różnica zależy od liczby powtórzeń (rachunek, szczebel 1). Rekord e1RM, wykres i „najlepsza seria” mogą wskazać słabszą serię. Nie znalazłem w repo źródła, które stosuje Epleya do samego dociążenia.
- **Opcje (decyzja właściciela, bo dotyka Q-001):**
  - A) Nie liczyć e1RM ani rekordu e1RM dla ćwiczeń z masą ciała. Zostają suma powtórzeń bez asysty i „max ±”.
  - B) Opcjonalna masa ciała w Ustawieniach i Epley na (masa + dociążenie). Bez masy ciała — jak A.
  - C) Zostawić liczbę, ale pod inną nazwą (nie „e1RM”) i bez odznaki rekordu.
  - **Rekomendacja: A** — najprostsza i zgodna z Q-001.
- **Test regresji:** przypadek z `zz-audit-log-g`.

### LOG-03 — Generator: „Każda partia co najmniej 2 razy w tygodniu” nie jest sprawdzane; przy celu „Siła” plan bez pleców i bez ostrzeżenia
- **Waga:** WYSOKA
- **Dowód (POTWIERDZONE):** `zz-audit-log-e`, macierz 210 konfiguracji.
  - W **102** konfiguracjach któraś z 8 głównych partii (MAJOR) trafia się rzadziej niż 2× w tygodniu, nawet licząc mięśnie pomocnicze.
  - Przy celu „Siła” w miejscach dom (pusty), „Tylko masa ciała” i hotel (36 konfiguracji): plecy = 0, biceps = 0, dwugłowe = 0–1 sesji w tygodniu. Ostrzeżenie się nie pokazuje, bo `below10` jest puste dla siły (`lib/generator.ts:98`).
  - Ekran generatora twierdzi przy tym „Każda partia co najmniej 2 razy w tygodniu (ACSM, przeglądy badań)” (`app/generator.tsx:61`).
- **Uwaga merytoryczna:** w docs/research/22 R1 dotyczy grup „góra/dół × pchanie/ciąganie”, nie pojedynczych partii — tekst na ekranie mówi więcej niż reguła.
- **Propozycja:**
  - A) Liczyć częstotliwość (główne = 1, pomocnicze — do ustalenia) i pokazywać „Rzadziej niż 2× w tygodniu: …” dla każdego celu.
  - B) Zmienić tekst na zgodny z R1 („każda grupa ruchów…”) i dodać ostrzeżenie o partiach z 0 sesji.
  - **Rekomendacja:** A + poprawa tekstu.
- **Test regresji:** macierz z `zz-audit-log-e`: żadna konfiguracja nie ma partii poniżej 2× bez widocznego ostrzeżenia.

### LOG-04 — Edytor historii: przy pauzie na końcu treningu wpisany czas trwania jest ignorowany
- **Waga:** ŚREDNIA
- **Dowód (POTWIERDZONE):** `zz-audit-log-a`.
  - Trening 60 min z pauzą w minutach 30–60. Taki stan powstaje, gdy pauza trwa przy „Zakończ” (`finishWorkout` → `closePause`). Pole „min” pokazuje 30.
  - Wpisuję 20 → `checkDraft` i `commitDraft` zapisują koniec = start + 50 min, pauzę przyciętą do [30, 50] i czas bez pauz **30 min** zamiast 20.
- **Przyczyna:** `lib/edit.ts:291` (`dur = m·60000 + pausedTotal`) razem z przycięciem pauz w `:309`.
- **Propozycja:** wyznaczać koniec tak, by czas bez pauz po przycięciu był równy wpisanemu (przejść po pauzach i dodawać czas aktywny). Druga możliwość: przy zmianie minut usuwać pauzy po nowym końcu przed liczeniem.
- **Test regresji:** dokładnie ten przypadek; dodatkowo pauza w środku przy skróceniu poniżej jej końca.

### LOG-05 — Generator „Ustaw jako aktywny” bez ostrzeżenia usuwa zmiany pojedynczych dni od dziś
- **Waga:** ŚREDNIA
- **Dowód (POTWIERDZONE):** `zz-audit-log-f`. Przed: `futureChanges()` = 2. Po `saveGenerated(…, true)`: 0, a przesunięty trening zniknął z kalendarza.
- **Gdzie:** `lib/generator.ts:114` → `addPlan` → `activatePlan` (`lib/plan.ts:66–72`). Alert w `app/generator.tsx:25` tego nie mówi. Ekran Plan (`app/plan.tsx:24`) mówi, a docs/24 pkt 1 wymaga komunikatu przed potwierdzeniem.
- **Propozycja:** ten sam tekst z `futureChanges()` w alercie generatora.
- **Test regresji:** alert generatora zawiera liczbę zmian, gdy jest ich więcej niż 0.

### LOG-06 — Liczba rekordów liczona na dwa sposoby
- **Waga:** ŚREDNIA
- **Dowód (POTWIERDZONE):** `zz-audit-log-b`. Seria 110 × 5 bije sumę treningu i e1RM:
  - alert po treningu: „Nowe rekordy: 2” (`components/ActiveWorkout.tsx:92`, suma `details.length`);
  - karta „Ostatni trening”: „1 rekord” (`lib/dashboard.ts:27`, `workoutPRs(w).length`).
- **Propozycja:** jedna funkcja `prCount(w)` w lib/stats, używana w obu miejscach.
- **Test regresji:** obie liczby równe dla tego treningu.

### LOG-07 — Drop sety: trzy różne definicje „serii roboczych”; drop set liczy się do kreski 10 serii bez źródła
- **Waga:** ŚREDNIA
- **Dowód (POTWIERDZONE):** `zz-audit-log-b`. Szablon: rozgrzewka + 3 serie zwykłe + 1 drop set.
  - pytanie deload (`lib/start.ts:9`): „2 zamiast **3** serii roboczych”;
  - karta szablonu (`store.tplWorkSets`, `store.ts:877`): **4** serie;
  - po treningu Postępy „Serie robocze”, kafelek „Serie”, serie na partię i mapa mięśni: **4**, a czworogłowe = 4 serie do kreski 10.
  - deload-sets i rundy superserii (`restAfter`) traktują drop set jako część poprzedniej serii; `isWorking` liczy go jako osobną serię.
- **Merytorycznie:** docs/research/22 nie ma źródła, jak liczyć drop sety w tygodniowej objętości. To pytanie trzeba wpisać do otwartych.
- **Opcje:**
  - A) Wszędzie liczyć drop set razem z serią, po której jest (jak deload i rundy) — zmienia liczby w Postępach.
  - B) Wszędzie jako osobną serię — zmienia pytanie deload.
  - **Rekomendacja: A**, z oznaczeniem „uproszczenie” do czasu znalezienia źródeł.
- **Test regresji:** jeden szablon i jeden trening; ta sama liczba w czterech miejscach.

### LOG-08 — Opisy presetów miejsc tylko w kg, a przy jednostce lb preset tworzy sprzęt w funtach
- **Waga:** ŚREDNIA
- **Dowód (POTWIERDZONE):** `zz-audit-log-f`.
  - Opis „sztanga 20 kg + talerze 25…1,25; hantle 2,5–50 co 2,5” i „hantle 2,5–25” (`lib/equipment.ts:218–223`, `app/more/locations.tsx:24`).
  - Faktyczny sprzęt przy lb: gryf 45 lb, talerze 45/35/25/10/5/2,5 lb, hantle 5–100 lb (hotel 5–50 lb) (`equipment.ts:235–239`).
- **Propozycja:** budować tekst opisu z danych `presetEquipment(p, unit)`, żeby liczby pochodziły z jednego miejsca.
- **Test regresji:** opis zawiera wartości z presetu dla kg i dla lb.

### LOG-09 — Zamiana: top-3 dla Back Squat na pełnej siłowni to warianty z gumami i łańcuchami
- **Waga:** ŚREDNIA (zgłaszam do UX i do przeglądu właściciela)
- **Dowód (POTWIERDZONE):** `zz-audit-log-d`. Box Squat with Bands, Box Squat with Chains i Reverse Band Box Squat mają po 10 pkt, a Front Squat 9.
- **Przyczyna:** reguła „najpierw biblioteka przejrzana przez właściciela” (`lib/swap.ts:70–75`) działa tylko przy remisie punktów, a komentarz obiecuje, że rzadkie warianty nie wypchną znanych ćwiczeń. Tabela D7 (docs/14a) pokazuje to samo; przegląd właściciela jest „otwarty”.
- **Opcje:**
  - A) Tier przed punktami.
  - B) Kara punktowa dla pełnej bazy.
  - **Rekomendacja: A.** Właściciel decyduje przy przeglądzie D7.

### LOG-10 — Dni generatora: pary dzień po dniu z tymi samymi partiami, których dało się uniknąć
- **Waga:** NISKA
- **Dowód (POTWIERDZONE):** dla 4 sesji `backToBack` = [[czw, pt]]: Góra B → Dół B mają wspólne plecy, bo Deadlift ma pierwszy mięsień „plecy”. Dla 5 sesji: 2 pary.
- **Przyczyna:** stała tabela `STRENGTH_DAYS` (`lib/generator.ts:31`). Układ pon/wt/czw/sob ma 0 par, a docs/24 każe rozkładać „z dniem przerwy … gdy się da”.
- **Propozycja:** wybierać układ dni z najmniejszą liczbą par spośród kandydatów.
- **Test regresji:** dla 4 sesji `backToBack` puste.

### LOG-11 — Liczby generatora nie są w jednym miejscu
- **Waga:** NISKA
- **Dowód (Z KODU / POTWIERDZONE):**
  - Literały 3 / 4–6 / 6–10 / 8–12 / 12–20 / 180 / 120 / 90 w `generator.ts:87–88` i te same liczby wpisane w teksty `app/generator.tsx:22–23, 62`. Dla porównania deload używa `DELOAD_EVERY`.
  - Próg `< 10` w `generator.ts:98` zamiast `WEEKLY_SETS_MARK`.
  - `AVG_REST` (150/105 s) nie występuje w dokumentacji.
  - Plan masy 2–3× po 90 min wychodzi według reguł samego generatora na 91 min.
  - docs/24 mówi o „sesjach siłowych 2–6”, a przy redukcji wybór 3–6 obejmuje 1 cardio.
- **Propozycja:** stałe w lib/generator, teksty z parametrami {a}–{b}, `WEEKLY_SETS_MARK` zamiast literału, `AVG_REST` w docs/24.

### LOG-12 — Przypomnienia o planie
- **Waga:** NISKA
- **Dowód (POTWIERDZONE):**
  - `planReminderKey` nie zawiera języka, więc po zmianie języka zaplanowane powiadomienia zostają w starym (`lib/planReminder.ts:30–34`).
  - Synchronizacja o 7:59:30 odwołuje dzisiejsze przypomnienie i go nie planuje, bo do 8:00 zostaje mniej niż 60 s (`:24`).
- **Propozycja:** język w kluczu; w oknie poniżej 60 s nie odwoływać dzisiejszego przypomnienia.

### LOG-13 — `suggest()` zwraca dwie identyczne propozycje
- **Waga:** NISKA
- **Dowód (POTWIERDZONE, log-b i log-h):** „Przesuń plan” kończy łańcuch po jednym kroku, więc daje to samo `ov` co „Przenieś na <następny dzień>”.
- **Propozycja:** usuwać duplikaty po `ov`.

### LOG-14 — CSV „w układzie Stronga” odbiega od formatu Stronga (docs/21)
- **Waga:** NISKA
- **Dowód (POTWIERDZONE):**
  - Set Order: drop set i seria do upadku dostają numery (2, 3), a opis trafia do Notes; Strong używa `D`/`F`.
  - Duration „65m” zamiast „1h 5m” (`lib/backup.ts:101–106`).

### LOG-15 — RIR > 9 zapisuje RPE < 1, w tym RPE 0
- **Waga:** NISKA
- **Dowód (POTWIERDZONE):** `effortIn(12)` w trybie RIR = 0; RIR 10 → RPE 0 (`store.ts:275–279`). Takiej wartości nie ma na skali RPE-RIR.
- **Propozycja:** ograniczyć RIR do 0–9 albo RPE do 1–10.

### LOG-16 — Nazwy miejsc mogą przekroczyć NAME_MAX
- **Waga:** NISKA
- **Dowód (POTWIERDZONE):** druga kopia miejsca o 80-znakowej nazwie ma 82 znaki („… (kopia) 2”); tak samo `addLocation` z tą samą nazwą (`lib/locations.ts:12, 16, 26`).
- **Propozycja:** przycinać nazwę po `uniqueName`.

### LOG-17 — `deloadCounts` powiela dobór serii z `startFromTemplate`
- **Waga:** NISKA (porządek)
- **Dowód (POTWIERDZONE):** pozycja z zarchiwizowanym ćwiczeniem jest liczona w pytaniu deload („4 zamiast 7”), a start ją pomija (faktycznie 2 z 3).
- **Uwaga:** po migracji raczej nieosiągalne.
- **Propozycja:** liczyć z tego samego filtra co start (wspólna funkcja).

## Sprawdzone i w porządku
- **kg↔lb:** 0 błędów w pętlach; `snapLb`/`snapLegacyLb`, `volOut`, `KG_PER_LB` = 0,45359237.
- **Talerze:** wynik zgodny z `achievable` (kg i lb); zawsze minimalna liczba talerzy (300 losowych zestawów vs DP); kolory IWF.
- **loads:** `rangeValues` bez szumu zmiennoprzecinkowego; `convertSpec` wraca dokładnie po konwersji tam i z powrotem; `sanitizeLoadSpec`.
- **Daty w 4 strefach × 800 dni:** 0 błędów; godziny nieistniejące przy zmianie czasu odrzucane (Warszawa 02:30, Santiago 00:30); `monthGrid` dla 504 miesięcy.
- **weeklyTotals, setsByMuscle, periodRange** wokół zmiany czasu; tydzień od poniedziałku spójny w calendar/stats/store/plan.
- **Deload:** `ceil(n/2)` daje cięcie 33–50% (docs/research/22: 30–60%); `DELOAD_EVERY` [4, 6]; seria tygodni i podpowiedź.
- **Generator:**
  - wzór budżetu i podział zgodne z docs/24; siła 3×4–6 / 180 s i 3×6–10 / 120 s (w granicach „2–3”); masa 8–12 albo 12–20, 120/90 s;
  - główna partia = 1, pomocnicza = 0,5 — tak samo jak w stats; cardio w osobny dzień;
  - 0 pustych szablonów w 210 konfiguracjach.
- **Statystyki:** Epley, limit 10 powtórzeń, drop set poza e1RM; remis w lb nie jest rekordem; kroki `progressionFor` w kg i lb zgodne z opisem.
- **Pauzy:** `cleanPauses` scala i przycina; podwójna pauza nic nie zmienia; `healthStart`. Typy HKWorkout 50 i 20.
- **Superserie:** przerwy w `restAfter` poprawne dla 5 kolejności odhaczania.
- **Plan:** `shiftPlan` z limitem 14 dni; `moveOnly` z konfliktem; przypomnienia o 8:00 lokalnie także przy zmianie czasu; dni zrobione pomijane.
- **Liczba mnoga:** liczby całkowite 0–1200 zgodne z CLDR w 26 językach. Wyjątek dla A11: `pt` przy 0 — reguła pt-BR (forma „one”) a pt-PT (forma „other”); ułamki dają ostatnią formę, ale żadne wywołanie `tp()` nie dostaje ułamka.
- **Pozostałe:** signing (dni do wygaśnięcia przy zmianie czasu, `reminderAt`, rodzaj odnowienia); swap (determinizm, wagi = docs/14 pkt 6); musclemap (progi stopni, wszystkie 12 partii ma kształt); equipvis (okno stosu, hantle n/eachKg); w katalogu żaden mięsień nie jest jednocześnie główny i pomocniczy (brak podwójnego liczenia).
- **Stałe zgodne z dokumentacją:** godzina przypomnienia 8, `RETURN_DAYS` = 10, `WEEKLY_SETS_MARK` = 10, porzucony trening 2 h / 6 h, presety sprzętu z docs/10.

Pliki sond (do ponownego użycia, niecommitowane): `/home/user/trening/.claude/worktrees/agent-a02db1e214024d1be/tests/zz-audit-log-*.test.ts`. Wyniki JSON: `/tmp/claude-0/-home-user-trening/ff1266f8-cce8-5fe6-b038-09db1e9b7165/scratchpad/log-*.json`.
