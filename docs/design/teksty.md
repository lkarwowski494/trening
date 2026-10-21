# Nowe i zmienione teksty UI — redesign M3 (E4 roli 04, 21.10.2026)

Dla roli 09 (tłumacz, 35 języków, DEC-21) i roli 08 (klucze w `lib/i18n.en.ts`, teksty przez `t()`). Klucz = polski tekst źródłowy. EN to **propozycja** do przeglądu tłumacza, nie tłumaczenie. Stan klucza sprawdzony skryptem na `lib/i18n.en.ts` (HEAD `cf0bc57`): „nowy” = brak klucza, „jest” = klucz istnieje, „zmiana” = istniejący tekst do podmiany. Ton: formalne ekrany tam, gdzie język tego wymaga (docs/16); wyjątek „ton trenera” dotyczy tylko wskazówek techniki.

| # | Klucz PL | EN (propozycja) | Kontekst (ekran, element, ZM) | Stan |
|---|---|---|---|---|
| 1 | Następne ćwiczenia | Up next | nagłówek listy pod tablicą „teraz” (trening w toku, ZM-02); nie mylić z „Dalej” = „Continue” | nowy |
| 2 | Następna: {x} | Next: {x} | tablica w przerwie: następna seria, np. „Następna: seria 4 z 4, 80 kg × 6” (ZM-01) | nowy |
| 3 | z {s} | of {s} | tablica w przerwie: pod zegarem „z 2:30” (czas całej przerwy) | nowy |
| 4 | Zacznij trening | Start a workout | Postępy bez historii: przycisk pustego stanu (ZM-06) | nowy |
| 5 | Opcje treningu | Workout options | etykieta VoiceOver „⋯” w nagłówku treningu (ZM-02, wz. 19 a / 30) | nowy |
| 6 | Przerwa trwa — powiadomić na koniec? | Resting — notify you when it ends? | wiersz pod tablicą przy pierwszej przerwie (ZM-02, wz. 30) | nowy |
| 7 | Powiadamiaj | Notify me | przycisk w wierszu z pkt 6 (obok istniejącego „Nie teraz”) | nowy |
| 8 | Dźwięk na koniec przerwy | Sound at the end of rest | Ustawienia, przełącznik (ZM-07) | nowy |
| 9 | Wibracje | Haptics | Ustawienia, przełącznik (ZM-07); EN: słowo z ustawień iOS do sprawdzenia przez tłumacza | nowy |
| 10 | Dźwięk i wibracja na koniec przerwy | — | dawny przełącznik (ZM-07) — klucz do usunięcia po migracji | zmiana (usunąć) |
| 11 | Zapowiedzi działają, gdy włączony jest „Dźwięk na koniec przerwy”. To samo ustawienie zmienisz przyciskiem „Głos” na ekranie treningu. | Announcements work when “Sound at the end of rest” is on. You can change the same setting with the “Voice” button on the workout screen. | Ustawienia → ⓘ przy „Zapowiedzi głosowe” (dziś odsyła do przełącznika z pkt 10). Druga część zdania: przycisk „Głos” trafia do menu „⋯” (ZM-02) — rola 08 sprawdza brzmienie po wdrożeniu | zmiana |
| 12 | Zwiększ ciężar o {n} | Increase weight by {n} | VoiceOver przycisku „+” na tablicy; {n} z jednostką z `wu()` (ZM-01) | nowy |
| 13 | Zmniejsz ciężar o {n} | Decrease weight by {n} | VoiceOver przycisku „−” na tablicy (ZM-01) | nowy |
| 14 | Zwiększ powtórzenia o 1 / Zmniejsz powtórzenia o 1 | Add one rep / Remove one rep | VoiceOver ± przy powtórzeniach (ZM-01); analogicznie czas „Zwiększ czas o {n}” i dystans „Zwiększ dystans o {n}” | nowy |
| 15 | Wpisz {co}, żeby zapisać serię. | Enter {co} to save the set. | ogłoszenie VoiceOver, gdy „Seria zrobiona” trafia na puste pole ({co} = istniejące „ciężar”, „powtórzenia”, „czas”, „dystans”) (ZM-01, wz. 29) | nowy |
| 16 | Serie: {d} z {n} zrobione | Sets: {d} of {n} done | opis tablicy dla VoiceOver (design-spec §2) | nowy |
| 17 | Rozgrzewki: {d} z {n} zrobione | Warm-ups: {d} of {n} done | j.w., gdy ćwiczenie ma serie rozgrzewkowe | nowy |
| 18 | lista serii przewijana | set list scrolls | j.w., dopisek przy > 12 polach | nowy |
| 19 | Przerwa. Pozostały czas: {t}. Cała przerwa: {all}. | Rest. Time left: {t}. Total rest: {all}. | opis tablicy w przerwie (VoiceOver); dalej pkt 2 | nowy |
| 20 | Usuń szablon | Delete template | przycisk `danger` na dole podglądu szablonu (ZM-04, wz. 5) | nowy |
| 21 | Usuń z biblioteki | Delete from library | przycisk `danger` na dole ekranu ćwiczenia (ZM-04); słowo jak akcja gestu „Usuń z biblioteki: {name}” — **nie** „Usuń ćwiczenie”, które w treningu znaczy usunięcie z treningu | nowy |
| 22 | Usuń sesję · Usuń miejsce · Edytuj · Gotowe · Planowanie · Zakończ serię · Seria zrobiona · Wykresy pojawią się po pierwszym zakończonym treningu. · Ćwiczenie · Nie teraz | (bez zmian) | ZM-04 (sesja, miejsce), ZM-04 listy, W1 c, ZM-05, ZM-01, ZM-06 (nagłówek wyboru w Postępach) | jest |
| 23 | Plan „{name}” jest aktywny. | Plan “{name}” is active. | jedno zdanie na ekranie Planowanie po zapisie generatora, gdy nie było aktywnego planu (ZM-03, wz. 14) | nowy |
| 24 | Szablony trafiają do folderu „Wygenerowane”, a plan do „Inne plany” albo od razu jako aktywny. | — | opis w generatorze: po ZM-03 pierwszy plan zostaje aktywny bez pytania — rola 08 sprawdza, czy zdanie nadal opisuje zachowanie (zmiana brzmienia tylko w ramach ZM-03) | do przejrzenia |

## Teksty dziedzinowe (rejestr twierdzeń)
Żaden tekst z tabeli nie powołuje się na źródło ani nie nazywa swojej wagi (uproszczenie, konwencja, jedno źródło), więc nie wymaga wpisu w `docs/research/rejestr-twierdzen.json`. Merytoryczne są **reguły**, nie teksty: krok ± o sprzęt (ZM-01) i to, czy seria bez wyniku jest serią — do badacza (rola 06) i BRD (reguła RD z wektorami), zanim rola 08 je zakoduje. Jeżeli wynik badacza doda tekst z oznaczeniem (np. „uproszczenie”) — wpis `node scripts/claims.mjs --stub`, po przeglądzie `--rehash <ID>`. Stan na HEAD: `npm run check:claims` — wynik w `audit/M3-2026-10-21/role/04-build/stop-e4.md`.

## Uwagi dla tłumacza
- Nazwy ćwiczeń na tablicy idą wersalikami przez `upperText()` (reguły języka, A11-02; wz. 28 pkt 4) — tłumaczenia nazw bez zmian.
- Barlow Condensed nie ma greki ani cyrylicy: w el, bg, ru, uk, sr litery tablicy krojem systemowym, cyfry w Barlow (STOP E3). Długość tekstu na tablicy liczyć dla el przy 320 pt (najdłuższy język; zrzuty `wzorce-zrzuty/e3-ekrany-el-*-320-*`).
- Makieta el (`ekrany/e3-ekrany-el.html`) zawiera propozycje dla nowych kluczy (np. „Επόμενες ασκήσεις”, „Έναρξη προπόνησης”) — do przeglądu, nie do przepisania.
