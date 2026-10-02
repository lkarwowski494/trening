# Edycja treningów z historii i trening wstecz

Wersja 02.10.2026. Status: **zrobione na gałęzi `feature/edit-history`, czeka na przegląd** (przed telefonem).
Priorytet od właściciela produktu. Research (w zleceniu): 9 z 10 porównywanych aplikacji pozwala poprawić zapisany trening — Strong (Historia → trening → Edit Workout: serie, data, start/koniec; trening z przeszłości przez przestawienie startu/końca), Hevy (Edit Workout, data i godzina na ekranie zapisu, kalendarz „Log a workout”), Fitbod (powtórzenia/serie/ciężar, dodawanie i usuwanie ćwiczeń, czas trwania, „Add as Past Workout”), Liftosaur (serie, zamiana/usuwanie ćwiczeń, data i długość; zapis nie uruchamia ponownie progresji).

## 1. Co zbudowano

**Edycja zakończonego treningu.** Szczegóły sesji (Historia → sesja) mają przycisk **„Edytuj”**. Otwiera się edytor (`app/history/edit/[id].tsx`), który pracuje na **szkicu** — głębokiej kopii treningu trzymanej tylko w pamięci. Można zmienić:
- nazwę treningu (to samo pole, które historia pokazuje jako nazwę — `templateName`) i notatkę do treningu,
- datę, godzinę startu i czas trwania w minutach (koniec = start + czas trwania),
- każde pole serii, którego używa metryka ćwiczenia: ciężar albo ±kg (masa ciała), powtórzenia, dystans, czas, RPE (gdy włączone w Ustawieniach), gumę (ćwiczenia z asystą gumą),
- typ serii (normalna / rozgrzewka W / drop set D / do upadku F) i notatkę do serii — tapnięcie numeru serii, to samo menu co w treningu,
- „+ seria” (kopia ostatniej), „✕” przy każdej serii (usuwa tę serię), „usuń” przy ćwiczeniu (z potwierdzeniem), „+ Dodaj ćwiczenie” (ten sam ekran wyboru — nowy cel `edit:<klucz szkicu>`); to samo ćwiczenie może wystąpić kilka razy.

„Anuluj” (w nagłówku) wyrzuca szkic — gdy coś zmieniono, najpierw pyta „Odrzucić zmiany?”. „Zapisz” (w nagłówku i na dole) zapisuje wszystko naraz.

**Trening wstecz.** Zakładka Historia ma przycisk **„+ Dodaj trening wstecz”** (`app/history/add.tsx`): termin (domyślnie wczoraj 18:00, 60 min), potem szablon z listy albo „Pusty trening”, potem ten sam edytor. Szkic z szablonu powstaje jak przy starcie treningu, ale **bez** treningu w toku, timerów, powiadomień i maszynerii podpowiedzi (`pre`, `hinted`): pozycje szablonu, liczba serii, superserie, a wartości z **ostatniej sesji ćwiczenia sprzed tej daty** (ten sam dobór bloku co „Poprzednio”: pozycja szablonu, k-ty blok, bez drop setów). Bez wcześniejszej sesji — ciężar startowy i cel czasu z szablonu oraz dolna granica powtórzeń (to, co wstawiłoby odhaczenie pustej serii). Ćwiczenie dodane w edytorze dostaje wartości z ostatniej serii sprzed tej daty. Zapis wstawia trening do historii w miejscu zgodnym z datą.

**Zapis (edycja i trening wstecz):**
- serie bez wyniku w metryce ćwiczenia odpadają z ostrzeżeniem „Serie bez wyniku zostaną pominięte: n” (kg × powt. i powt.: brak powtórzeń; czas, kg × czas: brak czasu; dystans + czas: brak obu) — odpowiednik ostrzeżeń „Zakończ” o seriach bez powtórzeń / bez czasu; ćwiczenie bez serii też odpada;
- gdy nie zostaje żadna seria — edycja proponuje „Usuń sesję” z historii, trening wstecz „Odrzuć trening”;
- termin: poprawna data RRRR-MM-DD, godzina GG:MM, czas trwania 1–1440 min, koniec nie później niż teraz. Gdy pól terminu nie ruszono, znaczniki zostają co do sekundy; gdy zmieniono datę, godziny serii (`completedAt`) przesuwają się razem ze startem, a nowe serie dostają godziny po kolei (kolejność PR = kolejność na liście);
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
| Edycja nazwy treningu = pole `templateName` | Model nie ma osobnej nazwy sesji; historia i CSV pokazują właśnie to pole. Powiązanie z szablonem (`templateId`, `tplItemId`) zostaje — „Poprzednio” dla pozycji szablonu dalej działa. |

## 3. Ograniczenia

- Szkic nie przeżywa zamknięcia aplikacji (jest tylko w pamięci) — zapis jest jednym ruchem, edycja trwa zwykle chwilę.
- Bez kalendarza systemowego — datę wpisuje się tekstem (RRRR-MM-DD) albo przyciskami ‹ ›.
- W edytorze nie ma kolumny „Poprzednio”, odznak PR, stopera ani zmiany kolejności / supersetów (superserie z szablonu i z historii zostają; usunięcie ćwiczenia porządkuje grupę jak w treningu).
- Zmiana daty w edytorze treningu wstecz nie przelicza wartości wstawionych z szablonu (brane z sesji sprzed daty wybranej w pierwszym kroku).
- Apple Health nie jest aktualizowane (patrz wyżej).
- Przerwy między seriami (`actualRest`) istniejących serii zostają; nowe serie nie mają przerwy (w historii „—”).

## 4. Pliki

- `lib/edit.ts` — szkic: tworzenie (edycja, trening wstecz), zmiany, walidacja terminu (`parseWhen`), sprawdzenie i zapis (`checkDraft`, `commitDraft`).
- `lib/store.ts` — `putHistoryWorkout`, `previousSetsBefore`, `setHasResult`, eksport `emptySet` / `copyVals` / `stripUnused`.
- `lib/backup.ts` — `onHistoryEdited` (kopia automatyczna, bez Zdrowia).
- `app/history/edit/[id].tsx` — edytor; `app/history/add.tsx` — trening wstecz; `components/WhenFields.tsx` — pola terminu.
- `app/history/[id].tsx` — „Edytuj”; `app/(tabs)/history.tsx` — „+ Dodaj trening wstecz”; `app/picker.tsx` — cel `edit:<klucz>`; `app/_layout.tsx` — ekrany w stosie; `lib/i18n.en.ts` — tłumaczenia.

## 5. Testy (`tests/edit-history.test.tsx`, 17)

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

Weryfikacja: `npx tsc --noEmit`, `npm run check:i18n`, `npx jest` (cały zestaw), `node scripts/verify-native.mjs` — wszystko OK.
