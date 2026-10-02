# Edycja treningów z historii i trening wstecz

Wersja 03.10.2026 (po audycie niezależnym — sekcja 6). Status: **zrobione na gałęzi `feature/edit-history`, czeka na przegląd** (przed telefonem).
Priorytet od właściciela produktu. Research (w zleceniu): 9 z 10 porównywanych aplikacji pozwala poprawić zapisany trening — Strong (Historia → trening → Edit Workout: serie, data, start/koniec; trening z przeszłości przez przestawienie startu/końca), Hevy (Edit Workout, data i godzina na ekranie zapisu, kalendarz „Log a workout”), Fitbod (powtórzenia/serie/ciężar, dodawanie i usuwanie ćwiczeń, czas trwania, „Add as Past Workout”), Liftosaur (serie, zamiana/usuwanie ćwiczeń, data i długość; zapis nie uruchamia ponownie progresji).

## 1. Co zbudowano

**Edycja zakończonego treningu.** Szczegóły sesji (Historia → sesja) mają przycisk **„Edytuj”**. Otwiera się edytor (`app/history/edit/[id].tsx`), który pracuje na **szkicu** — głębokiej kopii treningu trzymanej tylko w pamięci. Można zmienić:
- nazwę treningu (to samo pole, które historia pokazuje jako nazwę — `templateName`) i notatkę do treningu,
- datę, godzinę startu i czas trwania w minutach (koniec = start + czas trwania),
- każde pole serii, którego używa metryka ćwiczenia: ciężar albo ±kg (masa ciała), powtórzenia, dystans, czas, RPE (gdy włączone w Ustawieniach), gumę (ćwiczenia z asystą gumą),
- typ serii (normalna / rozgrzewka W / drop set D / do upadku F) i notatkę do serii — tapnięcie numeru serii, to samo menu co w treningu,
- „+ seria” (kopia ostatniej), „✕” przy każdej serii (usuwa tę serię), „usuń” przy ćwiczeniu (z potwierdzeniem), „+ Dodaj ćwiczenie” (ten sam ekran wyboru — nowy cel `edit:<klucz szkicu>`); to samo ćwiczenie może wystąpić kilka razy.

„Anuluj” (w nagłówku) wyrzuca szkic — gdy coś zmieniono, najpierw pyta „Odrzucić zmiany?”. „Zapisz” (w nagłówku i na dole) zapisuje wszystko naraz.

**Trening wstecz.** Zakładka Historia ma przycisk **„+ Dodaj trening wstecz”** (`app/history/add.tsx`): termin (domyślnie wczoraj 18:00, 60 min), potem szablon z listy albo „Pusty trening”, potem ten sam edytor. Szkic z szablonu powstaje jak przy starcie treningu, ale **bez** treningu w toku, timerów, powiadomień i maszynerii podpowiedzi (`pre`, `hinted`): pozycje szablonu, liczba serii, superserie, a wartości z **ostatniej sesji ćwiczenia sprzed tej daty** (ten sam kod doboru bloku co „Poprzednio” — `store.previousBlockBefore` dzieli z `previousBlockFor` wszystkie reguły: pozycja szablonu, k-ty blok, pominięta pozycja, sesje z samymi drop setami; drop sety nie są źródłem; gdy są miejsca — najpierw sesje z miejsca szkicu, sekcja 3). Bez wcześniejszej sesji — ciężar startowy i cel czasu z szablonu oraz dolna granica powtórzeń (to, co wstawiłoby odhaczenie pustej serii). Ćwiczenie dodane w edytorze dostaje wartości z **ostatniej** serii roboczej sprzed bieżącej daty w edytorze. Gdy datę lub godzinę zmienić w edytorze, pola wstawione przez aplikację i nieruszone liczą się od nowa z sesji sprzed nowej daty — per pole (wpisane ręcznie powtórzenia zostają, a ciężar z tej samej serii się przelicza); seria dodana „+ seria” z takiej serii też jest „wypełniona przez aplikację”. Zapis wstawia trening do historii w miejscu zgodnym z datą.

**Zapis (edycja i trening wstecz):**
- serie **nowe albo zmienione w edytorze** (inne wartości niż przy otwarciu) bez wyniku w metryce ćwiczenia odpadają z ostrzeżeniem „Serie bez wyniku zostaną pominięte: n” (kg × powt. i powt.: brak powtórzeń; czas, kg × czas: brak czasu; dystans + czas: brak obu) — odpowiednik ostrzeżeń „Zakończ”; serie zapisane wcześniej i nieruszone zostają zawsze (historia może mieć odhaczone serie bez powtórzeń, rozgrzewki bez powtórzeń albo serie z dawnej metryki ćwiczenia); ćwiczenie bez serii odpada;
- gdy nie zostaje żadna seria (tylko po usunięciu/wyczyszczeniu serii przez użytkownika) — edycja proponuje „Usuń sesję” z historii (potem zawsze lista Historii — także gdy szczegóły otwarto z zakładki Trening — i kopia automatyczna), trening wstecz „Odrzuć trening”;
- termin: poprawna data RRRR-MM-DD, godzina GG:MM istniejąca tego dnia (nie 02:30 w dniu zmiany czasu na letni), czas trwania 1–1440 min (same cyfry), koniec nie później niż teraz. Pola nieruszone zostają co do sekundy: sama zmiana czasu trwania nie przesuwa startu, sama zmiana daty/godziny zachowuje dawny czas trwania (także > 24 h z importu). Godziny serii (`completedAt`) przesuwają się razem ze startem i mieszczą w [start, koniec] (skrócony trening); serie nowe i zmienione bez godziny dostają godziny po kolei (kolejność PR = kolejność na liście); nieruszone serie ze starych danych bez godziny zostają bez godziny i z dawną przerwą (kopia 1:1);
- przy podmianie treningu znacznik Apple Health (`healthUUID`) i `createdAt` są brane z treningu zapisanego w tej chwili, a zapis do Zdrowia kończący się po edycji wpisuje znacznik do obiektu, który jest wtedy w historii;
- termin nachodzący na trening w toku — błąd (także już na pierwszym ekranie treningu wstecz); nachodzący na inną sesję z historii — ostrzeżenie z potwierdzeniem;
- start identyczny z inną sesją (albo treningiem w toku) przesuwa się o 1 s (patrz decyzje);
- jeden zapis do stanu (`store.putHistoryWorkout`): `save()` podbija `histRev`, od którego zależą wszystkie cache historii (lista, indeks treningów z ćwiczeniem, „Poprzednio”, sesje i rekordy narastające ze `stats.ts`) — rekordy/PR, „Poprzednio”, wykresy, tygodniowa objętość i serie na partię, CSV liczą się od nowa;
- potem ta sama kopia automatyczna co po „Zakończ” (`backup.onHistoryEdited` → `autoBackup`, gdy włączona).

## 2. Decyzje (z uzasadnieniem)

| Decyzja | Dlaczego |
|---|---|
| Edycja na szkicu, zapis jednym ruchem; „Anuluj” z pytaniem tylko po zmianach | Strong i Hevy: „Edit Workout” → Save/Cancel. Wpisywanie w szkicu nie przelicza historii przy każdym znaku (cache na `histRev`), a porzucona edycja niczego nie zostawia. |
| Termin = data + godzina + czas trwania (nie godzina końca) | Strong: zmiana startu/końca; Fitbod: „edit duration”; Liftosaur: „change date and length”. Czas trwania jest prostszy do wpisania i nie da się wpisać końca przed startem. |
| Pola tekstowe daty i godziny z przyciskami ‹ › zamiast kalendarza | Bez nowego modułu natywnego (`@react-native-community/datetimepicker` wymagałby przebudowy i nowej weryfikacji natywnej). Walidacja przy zapisie z czytelnym komunikatem. |
| Trening wstecz: najpierw termin i szablon, potem edytor | Hevy: kalendarz „Log a workout” na wybrany dzień; Fitbod: „Add as Past Workout”; Strong: trening z przestawionym startem/końcem. Jeden edytor dla edycji i dodawania. |
| Wartości treningu wstecz tylko z sesji **sprzed** jego daty | Trening sprzed tygodnia nie może dostać ciężarów z wczoraj — tamtego dnia ich jeszcze nie było. |
| Zapis niczego nie „przelicza” w treningu w toku | Liftosaur: zapis edycji nie uruchamia ponownie progresji. Trening w toku, timery, powiadomienia i wstawione wartości startowe zostają nietknięte; kolumna „Poprzednio” po prostu pokazuje aktualną historię. |
| Apple Health: zmiany nie są wysyłane, trening wstecz nie jest zapisywany; w edytorze krótka uwaga „Zmiany nie trafiają do Apple Health.” (gdy zapis do Zdrowia jest włączony albo trening ma `healthUUID`) | Aktualizacja/usuwanie próbek HealthKit to osobny, ryzykowny temat (duplikaty, uprawnienia odczytu). Uczciwa informacja zamiast cichej rozbieżności. |
| Gest cofania w edytorze wyłączony; Anuluj/Zapisz w nagłówku | Szkic nie może przepaść przypadkowym gestem (natywny stos nie zawsze pozwala go zatrzymać). Wzór iOS dla edycji modalnej. |
| Bez zmiany schematu danych | Edycja korzysta z istniejących pól; `migrate()` bez zmian, kopia z edytowanym treningiem wraca 1:1 (test eksport → import). |
| Serie nieruszone nie podlegają regule „bez wyniku” (audyt H1) | Edycja notatki nie może skasować serii zapisanych przez starszą wersję albo przed zmianą metryki ćwiczenia; reguła dotyczy tylko tego, co użytkownik dodał lub zmienił. |
| Ten sam start co inna sesja → +1 s (audyt M4) | Rekordy liczą się z sesji „przed startem” (`<`) — przy remisie obie sesje dostałyby PR, a „Poprzednio” zależałoby od kolejności wstawienia. 1 s jest niewidoczna (minuty na ekranie), a porządek jest jednoznaczny. Koniec i godziny serii przesuwają się razem. |
| Nachodzenie: na trening w toku — blokada, na sesję z historii — ostrzeżenie (audyt M5) | Trening w toku ma start „teraz − x” i trwa; trening wstecz w tym czasie to prawie na pewno pomyłka i psułby jego „Poprzednio”/PR. Dwie sesje jednego dnia w historii bywają celowe (rano/wieczorem) — wystarczy potwierdzenie. |
| Ponowne wstawienie wartości po zmianie daty (audyt M2) | Wartości z sesji sprzed pierwotnej daty mogłyby pochodzić z treningów późniejszych niż nowa data. Liczą się od nowa tylko pola nieruszone — wpisane ręcznie zostają. |
| Edycja nazwy treningu = pole `templateName` | Model nie ma osobnej nazwy sesji; historia i CSV pokazują właśnie to pole. Powiązanie z szablonem (`templateId`, `tplItemId`) zostaje — „Poprzednio” dla pozycji szablonu dalej działa. |

## 3. Ograniczenia

- Szkic nie przeżywa zamknięcia aplikacji (jest tylko w pamięci) — zapis jest jednym ruchem, edycja trwa zwykle chwilę.
- Bez kalendarza systemowego — datę wpisuje się tekstem (RRRR-MM-DD) albo przyciskami ‹ ›.
- W edytorze nie ma kolumny „Poprzednio”, odznak PR, stopera ani zmiany kolejności / supersetów (superserie z szablonu i z historii zostają; usunięcie ćwiczenia porządkuje grupę jak w treningu).
- Szkic jest wyrzucany przy zamknięciu edytora w jakikolwiek sposób (także systemowo) — bez pytania, gdy wyjście nie przeszło przez „Anuluj”.
- Ostrzeżenie o nachodzeniu na sesję z historii i blokada treningu w toku działają tylko, gdy termin zmieniono (albo przy treningu wstecz) — nieruszony termin nie jest sprawdzany.
- Apple Health nie jest aktualizowane (patrz wyżej).
- Przerwy między seriami (`actualRest`) istniejących serii zostają; nowe serie nie mają przerwy (w historii „—”).
- **Miejsca treningu (P-003, integracja 0.9.0):** edycja zachowuje `locationId` treningu (szkic to głęboka kopia), więc po zapisie „Poprzednio” i wstępne wartości tego miejsca liczą się od nowa. Trening wstecz dostaje miejsce jak start treningu (decyzja 1a): miejsce domyślne szablonu, gdy istnieje, inaczej główne — tylko gdy są miejsca. Miejsca nie zmienia się w edytorze: nagłówek pokazuje je tylko do odczytu („📍 Dom”, usunięte — „📍 (usunięte miejsce)”; trening bez miejsca — bez tego wiersza).
- Wartości wstawiane w edytorze (`prefillFor` → `previousBlockBefore(…, locationId)`) stosują decyzję 8a: najpierw sesje sprzed daty z miejsca szkicu (`histOf(exId, loc)` z tym samym filtrem daty i bez edytowanego treningu), a gdy tam ćwiczenia jeszcze nie było — cała historia sprzed daty (ten sam fallback co `previousBlockFor`). Ciężar z sesji w **innym, znanym** miejscu, spoza listy dostępnych w miejscu szkicu (`offListAt`, jak `startFromTemplate`), nie jest wstawiany — puste zostają ciężar i powtórzenia razem (także bez dolnej granicy zakresu z szablonu; nigdy „ciężar pusty + powtórzenia”). Wstrzymanie działa tylko na pola wciąż wypełniane przez aplikację (śledzenie per pole): ciężar wpisany ręcznie — nic nie jest wstrzymywane, wstawiane powtórzenia idą ze źródła; powtórzenia wpisane ręcznie zostają (wtedy seria może mieć pusty ciężar — zapis jej nie gubi, ale okno „Zapisać zmiany?” ostrzega „Serie bez ciężaru: n” dla serii nowych/zmienionych ćwiczeń z ciężarem, bez rozgrzewek — odpowiednik „Odhaczone serie bez ciężaru” przy „Zakończ”). „Inne miejsce” liczy się tylko, gdy sesja daje wartości: sesja z samymi drop setami nie jest źródłem, więc nie wstrzymuje ciężaru startowego szablonu (jak `startFromTemplate`). Sesje bez miejsca nie są „gdzie indziej”. Szkic bez miejsca (trening sprzed miejsc) i aplikacja bez miejsc — dobór jak dotąd (cała historia, bez wstrzymywania).
- `repeatLast`: najnowszy trening bez `locationId` (sprzed miejsc, import), a miejsca są — „nieznane miejsce”: nowy trening w miejscu głównym, wartości kopiowane bez wstrzymywania (świadomie bez zmian).
- Wybór ćwiczenia w edytorze (`edit:<klucz>`) filtruje po miejscu szkicu, gdy je ma i miejsce wciąż istnieje (jak trening w toku, z tym samym przełącznikiem „Pokaż wszystkie”) — także trening wstecz; treningi sprzed miejsc i z usuniętym miejscem — pełna lista.

## 4. Pliki

- `lib/edit.ts` — szkic: tworzenie (edycja, trening wstecz), zmiany, walidacja terminu (`parseWhen`), sprawdzenie i zapis (`checkDraft`, `commitDraft`).
- `lib/store.ts` — `putHistoryWorkout` (z rozdzieleniem remisu startu), `previousBlockBefore` (wspólny dobór bloku z „Poprzednio”: skanery `prevScan`, `byItemScan`, `byTplBlockScan` dostają historię ćwiczenia — całą albo z jednego miejsca, `histOf` — i filtr sesji `WOk`; `selectBlock` wybiera blok; od integracji 0.9.0 ta sama ścieżka obsługuje `previousBlockFor(..., locationId)` z P-003), `setHasResult`, eksport `emptySet` / `copyVals` / `stripUnused`.
- `lib/backup.ts` — `onHistoryEdited` (kopia automatyczna, bez Zdrowia).
- `app/history/edit/[id].tsx` — edytor; `app/history/add.tsx` — trening wstecz; `components/WhenFields.tsx` — pola terminu.
- `app/history/[id].tsx` — „Edytuj”; `app/(tabs)/history.tsx` — „+ Dodaj trening wstecz”; `app/picker.tsx` — cel `edit:<klucz>`; `app/_layout.tsx` — ekrany w stosie; `lib/i18n.en.ts` — tłumaczenia.

## 5. Testy (`tests/edit-history.test.tsx`, 33)

Logika:
1. zmiana ciężaru: szkic nie rusza historii; po zapisie PR i „Poprzednio” następnego treningu liczą się od nowa (także start z szablonu);
2. zmiana daty: kolejność historii, źródło „Poprzednio”, PR, przesunięte godziny serii; bez zmiany pól znaczniki co do sekundy; zmiana godziny i czasu trwania;
3. „+ seria” kopiuje ostatnią, usuwanie serii po id, to samo ćwiczenie dwa razy, usunięte ćwiczenie znika z historii, objętość;
4. serie bez wyniku odpadają z liczbą do ostrzeżenia; trening bez serii nie zapisze się; trening usunięty w trakcie edycji — błąd, nic nie wraca;
5. walidacja terminu, przesuwanie dnia, domyślny termin;
6. trening wstecz z szablonu: wartości z sesji sprzed daty (nie z późniejszej, bez drop setów), bez historii — ciężar startowy, cel czasu, dolna granica powtórzeń; kolejność w historii; godziny serii;
7. trening wstecz w historii, rekordach, tygodniowej objętości i CSV; szablon z tym samym ćwiczeniem dwa razy (blok ↔ pozycja szablonu);
8. trening w toku (z przerwą i powiadomieniami) nietknięty przy edycji i treningu wstecz;
9. eksport → import po edycji i treningu wstecz: te same dane, migracja idempotentna.

Ekrany:
10. „Edytuj” → ciężar i powtórzenia → „Zapisz”: szczegóły, zapis na dysk, kopia automatyczna, bez ostrzeżeń Reacta;
11. „Anuluj” bez zmian / z pytaniem („Wróć”, „Odrzuć zmiany”); uwaga o Apple Health przy `healthUUID`;
12. usunięcie ćwiczenia z potwierdzeniem, dodanie z wyboru, usunięcie i dodanie serii, typ serii, ostrzeżenie o seriach bez wyniku;
13. trening bez serii → „Usuń sesję”;
14. trening wstecz z Historii: walidacja daty, ‹, godzina i czas trwania, wartości sprzed daty, zapis → szczegóły, kopia automatyczna, HealthKit nie jest wołany;
15. pusty trening wstecz → „Odrzuć trening”;
16. jednostka lb: pola w funtach, zapis w kg, nieruszone serie co do cyfry;
17. English: edytor, trening wstecz i komunikaty bez polskich tekstów.

Audyt — logika:
18. H1: nieruszone serie zostają (metryka zmieniona po treningu, odhaczona seria bez powtórzeń, rozgrzewka bez powtórzeń); ruszona seria bez wyniku odpada; typ i notatka to nie wynik;
19. M2: zmiana daty po wstawieniu wartości — nieruszone z sesji sprzed nowej daty, wpisane ręcznie zostają, niedokończona data bez zmian, zapis liczy od nowa; ćwiczenie dodane przy edycji — sesja sprzed bieżącej daty, nie sama edytowana;
20. M3: blok „lżej” nie dostaje ciężaru z bloku „ciężko” (ostatnia sesja z innego treningu); `previousBlockBefore(∞)` = `previousBlockFor` w kilku przypadkach; sesja z samymi dropami pominięta;
21. M4: ten sam start → +1 s, PR tylko w późniejszej, „Poprzednio” jednoznaczne; także sesja przeniesiona edycją;
22. M5: nachodzenie na trening w toku — błąd; na sesję z historii — `overlap`; nieruszony termin bez sprawdzania;
23. LOW: sama zmiana czasu trwania (sekundy startu zostają, godziny serii przycięte), dawny czas > 24 h przy zmianie samej daty, ścisłe minuty;
24. LOW: nieistniejąca godzina przy zmianie czasu (Europe/Warsaw).

Audyt — ekrany:
25. H1 na ekranie: metryka zmieniona, edycja samej notatki — zapis bez pytań i bez utraty serii;
26. „Usuń sesję” z edytora: powrót na listę Historii, kopia automatyczna;
27. trening wstecz nachodzący na trening w toku — odrzucony na pierwszym ekranie; na sesję z historii — potwierdzenie;
28. id z „/ ? # spacją”: edytor, wybór ćwiczenia, zapis; wyjście bez „Anuluj” wyrzuca szkic; „Edytuj” dwa razy szybko = jeden szkic;
29. brak szablonów — podpowiedź, gdzie je utworzyć.

Weryfikacja 2:
30. L1 + L2: „+ seria” z serii wypełnionej przez aplikację przelicza się po zmianie daty; przeliczanie per pole;
31. L3: `healthUUID`/`createdAt` z bieżącego zapisu — Zdrowie skończone w trakcie edycji i po zapisie edycji;
32. L4: nieruszona seria bez godziny zostaje 1:1 (także po eksporcie/imporcie), zmieniona dostaje godzinę;
33. L5: „Usuń sesję” ze szczegółów otwartych z zakładki Trening → lista Historii.

Weryfikacja: `npx tsc --noEmit`, `npm run check:i18n`, `npx jest --maxWorkers=2` (cały zestaw, 683), `node scripts/verify-native.mjs` — wszystko OK.

## 6. Audyt niezależny (03.10.2026) — co poprawiono

| # | Problem | Poprawka |
|---|---|---|
| H1 | Zapis edycji kasował serie, których użytkownik nie ruszał (ocena wszystkich serii wg bieżącej metryki) — np. zmiana metryki na kg × czas i edycja notatki dawały „Pusty trening… Usunąć sesję?” | Reguła „bez wyniku” tylko dla serii nowych lub zmienionych (porównanie wartości z serią źródłową po id); nieruszone zostają, więc nieruszone serie nigdy nie prowadzą do propozycji usunięcia sesji. |
| M2 | Wartości treningu wstecz liczone od daty z pierwszego ekranu, nie z pola w edytorze | `draftSetWhen`: zmiana startu liczy nieruszone wartości od nowa; `draftAddExercise` i zapis używają bieżącej daty. |
| M3 | Inny dobór bloku niż „Poprzednio” | Jedna implementacja (`selectBlock` + skany z filtrem) dla „Poprzednio” i treningu wstecz. |
| M4 | Dwie sesje z identycznym startem — obie z PR | +1 s przy zapisie, aż start jest unikalny. |
| M5 | Brak sprawdzania nachodzenia terminów | Blokada dla treningu w toku, ostrzeżenie dla historii. |
| M6 | Brak testów powyższego | Testy 18–28. |
| LOW | Sama zmiana czasu trwania przesuwała start; ułamki/wykładniki w minutach; nieistniejąca godzina DST; limit 24 h dla nieruszonego czasu; id w adresach bez kodowania; szkic zostawał po wyjściu; podwójne „Edytuj”; pierwsza zamiast ostatniej serii; brak kopii po „Usuń sesję”; tekst „Brak szablonów” | Wszystkie poprawione (testy 19, 23, 24, 26, 28, 29). |

### Weryfikacja 2 (03.10.2026) — 0 HIGH, 0 MEDIUM; poprawione LOW

| # | Problem | Poprawka |
|---|---|---|
| L1 | Seria z „+ seria” skopiowana z serii wypełnionej przez aplikację nie była oznaczona — po zmianie daty zostawały wartości z późniejszej sesji | Kopia dziedziczy oznaczenie pól wciąż równych wstawionym (`draftAddSet`). |
| L2 | „Ruszona” liczona per seria — wpisanie powtórzeń blokowało przeliczenie ciężaru | Oznaczenie per pole (`prefilled[id][pole]`); przeliczane są tylko pola wciąż równe wstawionej wartości. |
| L3 | Znacznik Apple Health mógł zginąć, gdy zapis do Zdrowia skończył się w trakcie edycji | `putHistoryWorkout` bierze `healthUUID` i `createdAt` z treningu zapisanego teraz; `health.saveWorkout` wpisuje znacznik także do obiektu, który jest w historii po podmianie. |
| L4 | Nieruszone serie bez godziny (stare dane) dostawały zmyśloną godzinę i traciły przerwę | Godzina i zerowanie przerwy tylko dla serii nowych lub zmienionych; przesuwanie/przycinanie godzin tylko przy zmianie terminu. |
| L5 | „Usuń sesję” przez `dismiss(2)` mogło wrócić na zakładkę Trening | Po usunięciu zawsze `dismissAll()` + `navigate('/history')` (wzór z edytora szablonu). |

## 7. Integracja 0.9.0 z miejscami treningu (P-003 E1)

- **Jeden dobór „Poprzednio”** (`lib/store.ts`): skanery dostają listę treningów z ćwiczeniem (od najnowszego; `histOf(exId, loc)` — cała historia albo tylko z miejsca) i filtr sesji. Cache (`memoHistBy`, klucz `exId` albo `exId + LOC_SEP + idMiejsca`, dla pozycji szablonu i bloków szablonu analogicznie) tylko dla pełnej historii; skan „przed datą” bez cache (filtr zmienia się ze szkicem).
- `previousBlockFor(exId, k, n, tplItemId, tplId, locationId)` — decyzja 8a: gdy są miejsca i w tym miejscu było już ćwiczenie, dobór tylko z treningów w tym miejscu, inaczej z całej historii. Bez miejsc — dokładnie jak przed P-003.
- `previousBlockBefore(exId, before, k, n, tplItemId, tplId, excludeId, locationId)` — ta sama decyzja 8a z filtrem daty (sekcja 3); bez miejsc albo bez `locationId` — wynik identyczny jak przed dodaniem parametru (test „ZERO miejsc”).
- Trening wstecz: `beginPast` nadaje miejsce przez `startLocationId(tpl?.locationId)`; w edytorze „📍” tylko do odczytu.
- Testy przejścia funkcji: `tests/integration-090.test.tsx` (edycja treningu z miejscem i wartości z tego miejsca, fallback i ciężar spoza listy, trening wstecz z miejscem, wybór ćwiczenia w edytorze, „📍” w edytorze, migracja i eksport/import z danymi obu funkcji, zero miejsc, `repeatLast` z treningiem bez miejsca; weryfikacja: wstrzymanie tylko pól wypełnianych przez aplikację, „Serie bez ciężaru” przy zapisie, sesja z samymi drop setami nie wstrzymuje ciężaru startowego).
