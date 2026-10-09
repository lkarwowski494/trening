# Audyt 0.10.0 — trening na żywo (LIVE)

Raport źródłowy audytora z 08.10.2026 (commit d2a1e85), bez zmian treści. Zbiorczo: [docs/25](../25-audyt-0.10.md). Ścieżki do plików roboczych (worktree, scratchpad) dotyczą sesji audytu — pliki nie są w repozytorium.

## Zakres i pokrycie

Audyt na **d2a1e85**. Worktree startował z f435c8c, więc najpierw wyeksportowałem d2a1e85 (`git archive`) i czytałem z kopii. Po przełączeniu worktree sprawdziłem, że kopia i worktree są identyczne (`diff -rq` bez różnic), więc wszystkie wnioski dotyczą d2a1e85. Napisałem 6 testów roboczych z fałszywym zegarem i renderowaniem całej aplikacji (`renderApp`). Leżą w worktree, nie są commitowane: `<worktree audytora, poza repo>/tests/zz-audit-live-{a,b,c,d,e,f}.test.tsx`.

**Akcje i stany sprawdzone** (✔ w porządku, numer = znalezisko):

- **Start treningu:**
  - pusty trening (✔), z szablonu (✔), „Powtórz ostatni” (✔), „Dziś” (✔), panel dnia w Kalendarzu (✔, Start ukryty przy treningu w toku), ekran szablonu (✔, blokada „Trening w toku”);
  - trening wstecz (✔, `activeOverlapError`);
  - deload: „Mniej serii” / „Pełny trening” / „Anuluj” (✔, testy deload-ui);
  - podwójne tapnięcie: LIVE-12.
- **Wpisywanie wartości:** przecinek i kropka dziesiętna, puste pole, 0, wartość ujemna (tylko masa ciała), limit 1e6, powtórzenia całkowite ≥ 0, czas ≤ 86400, lb z przyciąganiem (225 lb → 102,05 kg → znów 225), RPE/RIR z obcięciem do 0–10 (✔).
- **Odhaczanie:** ✓ i cofnięcie, autouzupełnianie, przenoszenie wartości wstawionych, „Seria zrobiona” na karcie (✔).
- **Rozgrzewki i drop sety:** brak przerwy przed dropem, e1RM bez dropów i bez serii > 10 powtórzeń (✔); kolejność w supersecie: LIVE-02.
- **Usuwanie serii i ćwiczeń:** przesunięcie + potwierdzenie, ostatnia seria chroniona, akcja VoiceOver (✔); treść potwierdzenia: LIVE-11.
- **Ćwiczenia w trakcie:** dodawanie, kolejność, superset łącz/rozłącz (✔).
- **Zamiana (E2):** zamiana, cofnięcie, „Zawsze w”, podpowiedź, rekordy liczone dla zamiennika (✔, z kodu i istniejących testów).
- **„Pomiń dziś” / „Przywróć”:** LIVE-01, 03, 04, 08.
- **Masa ciała, asysta, gumy:** ✔; zapis na karcie: LIVE-14.
- **Seria na czas (stoper):** LIVE-06, LIVE-09.
- **Talerze:** kg i lb oraz zmiana jednostki w trakcie (✔, sprawdzone testem); ciężar, którego nie da się ułożyć: LIVE-17.
- **Widok skupiony:**
  - następna seria, przerwa w karcie, rozgrzewka, superset, stoper, wszystko odhaczone (karta pokazuje „Zakończ trening”), pusty trening (✔);
  - problemy: LIVE-02, 06, 07, 08.
- **Przerwa:**
  - start, −15, +15, Pomiń, powiadomienie, aplikacja w tle, zabicie aplikacji i odtworzenie (po restarcie zostaje 50 s, powiadomienie przeplanowane na 50 s) (✔);
  - podpis na ekranie blokady: LIVE-04, LIVE-15.
- **Pauza:** odejmowanie od czasu trwania wszędzie (grep: tylko `workoutDurSec`, start w Zdrowiu, edytor) (✔); pauza w trakcie przerwy liczy dalej zgodnie z decyzją (✔); LIVE-09, LIVE-10.
- **„Zakończ”:** z pustymi, nieodhaczonymi i samymi rozgrzewkowymi seriami (✔); ostrzeżenie o seriach z planu: LIVE-05.
- **Pozostałe:**
  - anulowanie: LIVE-12;
  - porzucony trening (2 h pytanie, 6 h auto-zapis) (✔ / LIVE-10);
  - przejście na inną zakładkę i powrót: ekran zostaje zamontowany, zakładki odświeżają timer (✔);
  - restart w trakcie (✔, LIVE-15);
  - dwa treningi naraz: blokada tylko w interfejsie (LIVE-12);
  - edycja szablonu w trakcie (trening jest kopią) (✔);
  - usunięcie ćwiczenia, miejsca lub gumy w trakcie (✔);
  - północ (trening należy do dnia startu, plan liczony po dniu startu) (✔); zmiana czasu letniego (wszystko w ms) (✔);
  - zmiana jednostki i języka w trakcie: pola się przeformatowują, `refreshScheduled` (✔);
  - Apple Health: LIVE-16; rekordy przy zakończeniu, liczone tylko z odhaczonych serii (✔);
  - brak zgody na powiadomienia: prośba przy otwarciu treningu, przycisk w Ustawieniach (✔); wibracja wyłączana razem z dźwiękiem (✔).

**Kroje na karcie „teraz”** (zmierzone testem a: spłaszczony styl każdego `Text`):

| Tekst | Krój i rozmiar |
|---|---|
| Nazwa ćwiczenia / „dalej: …” / „Wszystkie serie odhaczone” | IBMPlexSans_700Bold 20 (`F.heavy`) |
| „seria 1 z 3” / „rozgrzewka” | IBMPlexSans_600SemiBold 14 |
| Notatka ćwiczenia, „ostatnio …”, wskazówka pod przyciskiem | IBMPlexSans_400Regular 13 / 12 |
| Duża liczba „80 × 8” | IBMPlexSans_700Bold 64, lineHeight 72 (`F.display`) |
| Jednostka „ kg” | IBMPlexSans_600SemiBold 18 |
| Przyciski „Seria zrobiona” / „Zakończ trening” | IBMPlexSans_700Bold 19 |
| Podpis talerzy i sprzętu | IBMPlexSans_600SemiBold 12 |
| Liczby na talerzach i stosie | IBMPlexMono_600SemiBold 11 |
| Liczba na urządzeniu elektrycznym | IBMPlexMono_600SemiBold 20 |
| Przerwa „1:30” | IBMPlexMono_600SemiBold 34 |
| „przerwa z 1:30” | IBMPlexSans_400Regular 12 |
| −15 / +15 / Pomiń | IBMPlexSans_600SemiBold 14 |
| Pierścień stopera | IBMPlexMono_600SemiBold 18 |
| Pasek stopera (dół) | IBMPlexMono_600SemiBold 34 (28 przy szerokości < 360) |

- **Zgodność z docs/18:** jest zgodne — nagłówki i duże liczby w IBM Plex Sans Bold, timery w IBM Plex Mono.
- **Uwaga 1:** `F.monoBold` to w rzeczywistości SemiBold 600, a nie Bold — tylko nazwa jest myląca.
- **Uwaga 2:** pola w wierszach serii są w IBM Plex Sans Regular z cyframi tabelarycznymi, nie w „IBM Plex Mono dane” z wariantu A (powód: audyt cd60eec, Mono ucinało „102,5”). Warto to dopisać w docs/16, bo linia 130 opisuje jeszcze erę Archivo.
- **Przyczyna „nadal nie ta czcionka”:** potwierdzona przez `git show f435c8c:lib/theme.ts` — na `main` (build 1004 na telefonie) `heavy = Tektur_700Bold`, a `display = Tektur_800ExtraBold`.
- **Uwaga 3:** Live Activity używa systemowego SF Rounded (natywny widżet, poza `F`).
- **Jedyny tekst ekranu treningu w kroju systemowym:** LIVE-13.

## Znaleziska

### LIVE-01 — Superset: „Pomiń dziś” jednego ćwiczenia wyłącza przerwy drugiego do końca
- **Waga:** WYSOKA
- **Dowód:** POTWIERDZONE (zz-audit-live-b), `lib/store.ts:1169–1181` (`restAfter`).
  - Superset Bench + Back Squat po 3 serie: A1 → B1 (przerwa jest).
  - Potem „Pomiń dziś: Back Squat”, A2 → `T.on=false`, `restAfter(0,1)=null`; A3 → też bez przerwy.
- **Opis i skutek:** logika rund traktuje pominięty blok jako członka z zaległymi seriami („B ma mniej odhaczonych i ma nieodhaczone”). Do końca ćwiczenia nie ma przerwy ani powiadomienia.
- **Naprawa:** w `restAfter` pomijać bloki `skipped` przy budowie `members`/`others` i w `closesGroup`; `roundRest` liczyć z ostatniego niepominiętego.
- **Test regresji:** superset + „Pomiń dziś” B → po A2 przerwa równa `roundRest`.

### LIVE-02 — Karta „teraz” w supersecie z rozgrzewkami prowadzi w złej kolejności
- **Waga:** WYSOKA
- **Dowód:** POTWIERDZONE (zz-audit-live-d), `lib/store.ts:1508–1516` (`focusSet` porównuje surowe indeksy serii).
  - Bez rozgrzewek: A1 → B1(przerwa) → A2 → … — poprawnie.
  - Rozgrzewka w A: AW → **B1** → A1(przerwa) → B2 → A2(przerwa) → B3(przerwa) → A3(przerwa).
  - Rozgrzewka w B: A1 → BW → **A2** → B1(przerwa) → A3 → B2(przerwa) → B3.
- **Opis i skutek:** to domyślny widok. Karta każe zacząć od drugiego ćwiczenia albo wyprzedzić rundę, a przerwy przesuwają się na złe ćwiczenie.
- **Naprawa:** wybierać członka grupy po liczbie odhaczonych serii roboczych (najmniej, przy remisie wcześniejsze ćwiczenie). Rozgrzewka członka idzie przed jego pierwszą serią roboczą.
- **Test regresji:** obie konfiguracje dają AW, A1, B1, A2, B2… oraz BW, A1, B1… (albo A1, BW, B1 — do ustalenia w teście).

### LIVE-03 — „Pomiń dziś” zatrzymuje trwającą przerwę i po cichu kasuje pomiar stopera
- **Waga:** ŚREDNIA
- **Dowód:** POTWIERDZONE (zz-audit-live-a), `components/ActiveWorkout.tsx:284,381` (`dropBlockTimers`).
  - ✓ serii 1 → przerwa; „Pomiń dziś” → `T.on=false`, anulowane powiadomienie `rest-end`.
  - docs/09:188 planował tylko „stoper bloku stop”.
- **Opis i skutek:** przerwa po serii, która zostaje odhaczona, znika razem z powiadomieniem. Trwający stoper serii też znika, bez pytania.
- **Naprawa:** przy „Pomiń dziś” zatrzymywać tylko stoper serii nieodhaczonej (opcjonalnie z pytaniem). Przerwę zostawić i przeliczyć jej podpis (`timer.relabel`).
- **Test regresji:** ✓ → „Pomiń dziś” → `T.on` nadal true.

### LIVE-04 — Podpis przerwy („dalej: …”, Live Activity) liczy następną serię inaczej niż karta
- **Waga:** ŚREDNIA (czas jest prawidłowy, myli się tylko podpis na ekranie blokady)
- **Dowód:** POTWIERDZONE (zz-audit-live-b/e), `components/ActiveWorkout.tsx:172–179` (`restSubtitle`):
  - Back Squat pominięty → podpis „dalej: Back Squat”, a karta wskazuje Plank;
  - wcześniejsze ćwiczenie (Bench) nieodhaczone → podpis „dalej: Leg Press”, a karta wskazuje Bench;
  - po ostatnim ćwiczeniu, gdy Bench wciąż czeka → podpis to nazwa właśnie zrobionego ćwiczenia;
  - po ostatniej serii treningu przerwa i tak startuje, a powiadomienie mówi „Następna seria.” (`lib/timer.ts:117`).
- **Naprawa:** `restSubtitle` oprzeć na regule `focusSet` (stan po odhaczeniu, bez pominiętych i usuniętych bloków). Gdy nic nie zostało, decyzja produktowa:
  - A — bez przerwy po ostatniej serii treningu;
  - B — przerwa zostaje, ale treść „Przerwa minęła” bez „Następna seria”.
  - **Rekomendacja: B** (najmniejsza zmiana zachowania).
- **Test regresji:** trzy przypadki wyżej.

### LIVE-05 — „Zakończ” nie ostrzega o nieodhaczonych seriach z planu — przepadają po cichu
- **Waga:** ŚREDNIA (blisko utraty serii przez zapomniane ✓)
- **Dowód:** POTWIERDZONE (zz-audit-live-e), `ActiveWorkout.tsx:130–131,216` (`isPrefill = !s.edited`).
  - Szablon 3 × 60 kg (wstawione „60 × —”), ✓ dwóch serii.
  - Okno: „Zapisane zostaną serie robocze: 2.” — ani słowa o trzeciej; zapisane 2.
- **Opis i skutek:** ostrzeżenie obejmuje tylko wartości wpisane ręcznie. Seria wykonana „jak w planie” bez ✓ ginie bez śladu.
- **Opcje:**
  - A — linia „Nieodhaczone serie: n — nie zostaną zapisane” dla wszystkich nieodhaczonych, niepominiętych serii;
  - B — to samo tylko w blokach z ≥ 1 odhaczoną serią (ćwiczenie zaczęte, nieskończone; bez szumu przy świadomie przerwanym treningu);
  - C — bez zmian.
  - **Rekomendacja: B.**
- **Test regresji:** scenariusz jak wyżej → komunikat zawiera liczbę 1.

### LIVE-06 — Widok skupiony: brak startu stopera na karcie
- **Waga:** ŚREDNIA
- **Dowód:** POTWIERDZONE (zz-audit-live-a, karta planka), `ActiveWorkout.tsx:432–435`.
  - Karta zawiera tylko „Seria zrobiona”; pierścień pojawia się dopiero, gdy stoper już działa.
  - „Seria zrobiona” odhacza serię z czasem wstawionym (cel z szablonu), bez pomiaru.
- **Skutek:** przy deskach i bieżni karta nie prowadzi pomiaru, a łatwo zapisać czas, którego nikt nie zmierzył.
- **Opcje:**
  - A — dla serii z czasem i wyłączonego stopera duży przycisk „▶ Start”, pod nim mały „Odhacz bez pomiaru”;
  - B — osobny ▶ obok przycisku;
  - C — bez zmian.
  - **Rekomendacja: A.**
- **Test regresji:** karta Plank → przycisk startu uruchamia `S.on`.

### LIVE-07 — Widok skupiony: przerwa niewidoczna po ✓ w wierszu niżej
- **Waga:** ŚREDNIA
- **Dowód:** Z KODU, `ActiveWorkout.tsx:165,457` (`restInCard` chowa dolny pasek przerwy).
- **Opis i skutek:** odliczanie i −15/+15/Pomiń są tylko w karcie na górze przewijanej listy. Po ✓ w przewiniętym wierszu przerwy nie widać; zostaje tylko plakietka na zakładce.
- **Opcje:**
  - A — dolny pasek, gdy karta jest poza ekranem (onScroll + pozycja karty);
  - B — pasek zawsze, czyli podwójne przyciski;
  - C — przewinięcie do góry po ✓.
  - **Rekomendacja: A.**
- **Test regresji:** zdarzenie scroll poza kartę → pasek przerwy widoczny.

### LIVE-08 — „Wszystkie serie odhaczone”, gdy reszta jest tylko pominięta
- **Waga:** NISKA
- **Dowód:** POTWIERDZONE (zz-audit-live-a; istniejący test w skip-today.test.tsx utrwala ten tekst), `ActiveWorkout.tsx:404–409`.
  - Odhaczone `[true, false, false]` + „Pomiń dziś” → karta mówi „Wszystkie serie odhaczone”.
  - Bez żadnej odhaczonej serii karta mówi to samo, a „Zakończ trening” odpowiada potem „Brak odhaczonych serii”.
- **Naprawa:** tekst „Nic więcej do zrobienia (część pominięta)”; przy zerze odhaczonych — inny komunikat.

### LIVE-09 — Seria na czas zmierzona w trakcie pauzy liczy się do pauzy
- **Waga:** NISKA
- **Dowód:** POTWIERDZONE (zz-audit-live-c).
  - Pauza od 600 s, ▶ w 1200 s, plank 60 s.
  - Wynik: pauza [600; 1260], czas treningu 605 s zamiast 665 s.
- **Naprawa:** ▶ (`startSet`) wznawia trening od chwili startu, tak jak ✓.
- **Test regresji:** ten scenariusz → pauza [600; 1200].

### LIVE-10 — Pauza nie wstrzymuje logiki „porzuconego treningu”
- **Waga:** NISKA (decyzja produktowa)
- **Dowód:** POTWIERDZONE (zz-audit-live-c), `lib/store.ts:1234–1244` (`staleRef` pomija `pausedAt`).
  - Po 2 h pauzy pytanie „Trening wciąż trwa — Ostatnia seria o 17:00. Zakończyć…?”.
  - Przypomnienie zaplanowane mimo pauzy; po 6 h auto-zapis.
  - Podobnie stoper bez celu dłuższy niż 2 h (np. jazda na rowerze): „Zakończ i zapisz” odrzuca trwający pomiar.
- **Opcje:**
  - A — start pauzy liczy się jak aktywność;
  - B — logika bez zmian, ale tekst pytania wspomina pauzę („w pauzie od 17:30”);
  - C — bez zmian.
  - **Rekomendacja: B.**

### LIVE-11 — Usunięcie ćwiczenia z odhaczonymi seriami bez informacji o ich utracie
- **Waga:** NISKA
- **Dowód:** POTWIERDZONE (zz-audit-live-b), `ActiveWorkout.tsx:326`.
  - Treść okna: „Usunąć z treningu? | Bench Press (sztanga)”.
  - Dla porównania pojedyncza seria ma dopisek „Seria jest już odhaczona.”.
- **Naprawa:** dopisek „Odhaczone serie: n — przepadną.”.
- **Test regresji:** treść okna przy n > 0.

### LIVE-12 — Brak blokady podwójnego startu i anulowania; store nie broni się przed nadpisaniem treningu
- **Waga:** NISKA
- **Dowód:**
  - POTWIERDZONE (zz-audit-live-b): dwa szybkie „Anuluj trening” otwierają 2 okna (`ActiveWorkout.tsx:145`, bez `asking` jak w „Zakończ”).
  - Z KODU: `startFromTemplate`, `startEmpty` i `repeatLast` (`store.ts:912–948`) nadpisują `active` bez sprawdzenia. „Start”, „Pusty trening” i „Powtórz ostatni” na ekranie głównym są bez `useOnce` (`app/(tabs)/index.tsx:56–59`).
  - W tygodniu deload podwójne „Start” otwiera dwa pytania, a drugie może zastąpić świeżo rozpoczęty trening.
- **Naprawa:** strażnik w store (`if (getState().active) return`), `useOnce` na tych przyciskach, blokada `asking` dla „Anuluj”.

### LIVE-13 — „Poprzednio” w wierszu serii w kroju systemowym
- **Waga:** NISKA
- **Dowód:** POTWIERDZONE (zz-audit-live-a: „—” → (SYSTEM) 13), `ActiveWorkout.tsx:357`.
  - Wariant pod wierszem (wąski ekran, `Muted`) jest w IBM Plex Sans.
- **Naprawa:** `fontFamily: F.regular`.
- **Test regresji:** żaden tekst ekranu treningu (poza ✓, ▶, …) bez `fontFamily`.

### LIVE-14 — Duża liczba na karcie: jednostki i zapis
- **Waga:** NISKA
- **Dowód:** POTWIERDZONE (zz-audit-live-a/b), `ActiveWorkout.tsx:389,413–425,412`:
  - masa ciała: „+10 × 8” bez jednostki; etykieta VoiceOver „Teraz: +10 × 8”;
  - jednostka stoi po powtórzeniach/czasie: „80 × 8 kg”, „40 × 1:00 kg”;
  - dystans: „5000 m × 25:00”;
  - drop set: „seria 4D z 4” (drop liczony jako seria).
- **Opcje** (wygląd karty to decyzja właściciela):
  - A — „80 kg × 8”, „+10 kg × 8”, dystans „5000 m · 25:00”, licznik bez dropów;
  - B — zostawić, poprawić tylko VoiceOver.
  - **Rekomendacja: A.**

### LIVE-15 — Live Activity po restarcie traci podpis przerwy
- **Waga:** NISKA
- **Dowód:** POTWIERDZONE (zz-audit-live-c: przed restartem „Bench Press (sztanga) · seria 2”, po nim „przerwa 90 s”), `lib/timer.ts:91`. `T.sub` i `labels` nie są zapisywane.
- **Naprawa:** przy `restore` przeliczyć `restSubtitle` z `restSetId` (albo zapisywać podpis w `timer`).

### LIVE-16 — Zapis do Apple Health: błąd po cichu, bez ponowienia
- **Waga:** NISKA
- **Dowód:** Z KODU: `lib/health.ts:51,56` (wynik `'failed'`), `lib/backup.ts:84`, `ActiveWorkout.tsx:92`.
- **Opcje:**
  - A — informacja + „Spróbuj ponownie” w sesji;
  - B — automatyczne ponowienie przy starcie dla treningów z ostatnich 7 dni (`healthUUID == null`, synchronizacja włączona);
  - C — zostawić do wydania Health.
  - **Rekomendacja: B w wydaniu Health.**

### LIVE-17 — Ciężar, którego nie da się ułożyć z talerzy: pusta przestrzeń bez wyjaśnienia
- **Waga:** NISKA
- **Dowód:** POTWIERDZONE (zz-audit-live-f), `lib/equipvis.ts:93`.
  - 225 lb przy talerzach w kg (102,05 kg): `equipVisFor` zwraca pustą listę, widać tylko niewidoczne miejsce na grafikę.
  - Samo liczenie talerzy działa poprawnie: 100 kg → 25 + 15; 225 lb na siłowni w lb → 45 + 45 lb.
- **Naprawa:** podpis „Nie da się ułożyć z talerzy (miejsce) — najbliżej X (talerze)”.

## Sprawdzone i w porządku

- **Starty:** blokada „Trening w toku” na ekranie szablonu, Start ukryty w panelu dnia, kolizja z treningiem wstecz.
- **Deload:** połowa serii roboczych, rozgrzewki zostają, drop sety idą ze swoją serią, ciężary bez zmian, szablon nietknięty.
- **Pola wartości:** przecinek, zakresy, lb z przyciąganiem i zachowaniem kg; przeliczenie RIR = 10 − RPE.
- **✓ i cofnięcie:** uzupełnianie z podpowiedzi, czyszczenie wstawionych wartości przy cofnięciu, przerwa zatrzymywana tylko przez serię, która ją uruchomiła.
- **Zamiana i cofnięcie zamiany:** zatrzymanie timerów usuniętych serii i nowy podpis przerwy (`afterSwap`).
- **Usuwanie:** przesunięcie + potwierdzenie dla serii i bloków, zgodnie z decyzją z 07.10; nie ma przycisków „Usuń”.
- **Przerwa:** −15 nie schodzi poniżej zera, +15 po końcu na nowo uzbraja alarm; stałe identyfikatory powiadomień; po restarcie właściwa reszta czasu i przeplanowane powiadomienie; zakończenie Live Activity po powrocie z tła.
- **Stoper:** z celem przycinany do celu, wznawiany po restarcie; bez celu zgodnie z decyzją Q-002.
- **„Zakończ”:**
  - zapisują się tylko odhaczone serie (z rozgrzewkami), pomiar w toku zostaje odhaczony przed zapisem;
  - osobne okna dla „samej rozgrzewki” i pustego treningu;
  - rekordy liczone tylko z odhaczonych serii.
- **Pauza:** odejmowana spójnie (historia, CSV, podsumowanie, edytor, start w Zdrowiu); kończy się przy „Zakończ”.
- **Restart w trakcie:** stan, pauza i pozycja karty liczone z danych.
- **Zmiany w innych miejscach w trakcie treningu:**
  - usunięcie ćwiczenia → archiwum z dopiskiem „(usunięte)”;
  - usunięcie miejsca → „(usunięte miejsce)”, przyrządy przeliczone;
  - usunięcie gumy → czyszczenie tylko nieodhaczonych serii.
- **Czas:** północ i zmiana czasu letniego poprawne (trening należy do dnia startu, wszystko w ms).
- **Zmiana języka w trakcie:** przeplanowane powiadomienia, separator dziesiętny w polach.
- **Inne:** blokada wygaszania ekranu; prośba o zgodę na powiadomienia i przycisk sprawdzenia w Ustawieniach; zapis do Zdrowia nie blokuje zakończenia i nie dubluje treningu.

