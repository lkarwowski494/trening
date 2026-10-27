# Macierz gestów — Trening 1.0 (commit 025a50b9) — rola 04, audyt M1 27.10.2026

Źródło: kod (`grep` PanResponder, SwipeRow, DragList, onLongPress, gestureEnabled; `onLongPress` nie występuje w app/ ani components/). Expo web gestów nie odtwarza — kolumna „na urządzeniu” to lista dla właściciela.

| Gest | Gdzie (plik) | Działanie | Zgodny z HIG „Standard gestures” | Alternatywa bez gestu | Informacja zwrotna | Kolizja z gestem systemu | Gest niszczący: cofnięcie / potwierdzenie |
|---|---|---|---|---|---|---|---|
| stuknięcie | wszędzie | aktywacja | tak | — | `opacity` przy naciśnięciu, haptyka wg „Wibracje” | nie | — |
| przesunięcie w lewo na wierszu (`components/SwipeRow.tsx`) | Plan (sesje, `app/(tabs)/history.tsx`), Szablony, Ćwiczenia (biblioteka), Edycja sesji, Gumy, Masa ciała, Miejsca, Plan (zapisane plany), Szablon (serie), LoadEditor (ciężary), trening (serie, `components/WorkoutBlocks.tsx`) | odsłania „Usuń” → okno [Anuluj, Usuń] | tak („Reveal actions”) | tak: „Usuń {obiekt}” na ekranach szczegółów (W2), „Edytuj” na Gumy/Masa ciała, „Usuń serię”/„Usuń ćwiczenie” w menu (DEC-12); akcja VoiceOver „Usuń …” | odsunięcie wiersza, czerwony przycisk | nie (kierunek w lewo, powrót systemowy w prawo od krawędzi) | potwierdzenie zawsze (decyzja 07.10.2026); ćwiczenie z biblioteki — archiwum z „Przywróć” |
| przeciąganie uchwytu ≡ (`components/DragList.tsx`) | Kolejność ćwiczeń (`app/reorder.tsx`, szablon i trening) | zmiana kolejności | tak („Move a UI element”) | **tylko VoiceOver**: akcje „w górę / w dół” (`components/DragList.tsx:98`); bez przycisków dla osób bez czytnika (04-studio-projektowe-009) | podniesienie wiersza, haptyka wg „Wibracje” | nie | nie dotyczy (odwracalne) |
| przesunięcie w dół arkusza „Inny trening” (`components/StartPanel.tsx`) | Trening | zamknięcie arkusza | tak („dismiss views”) | „Anuluj” w nagłówku, stuknięcie w tło | przesunięcie arkusza za palcem | nie | — |
| przesunięcie w dół okna modalnego (system) | picker, swap, pick-template, paywall, adapt, place-once | zamknięcie | tak | „Anuluj” po lewej (S1, `tests/close-button-guard.test.tsx`) | systemowa | — | — |
| przesunięcie od lewej krawędzi (system) | ekrany stosu | wstecz | tak | strzałka „Wróć” | systemowa | — | wyłączone w szkicach (`gestureEnabled: false`, `components/DraftHeader.tsx`), „Anuluj” pyta o odrzucenie zmian |
| poziome przewijanie | rzędy chipów, pola serii > 12 | przewijanie | tak („scroll”) | — | wskaźnik przewijania ukryty (S18) — brzegi chipów jako wskazówka | nie | — |

## Wnioski
- Ten sam gest znaczy to samo w całej aplikacji (przesunięcie w lewo = usunięcie z potwierdzeniem; w dół = zamknięcie) — heurystyka 4 spełniona.
- Każdy gest niszczący ma potwierdzenie i drogę bez gestu (od M3 W2 i DEC-12).
- Jedyna luka: kolejność zmienia się tylko przeciąganiem (dla osób bez VoiceOver) — 04-studio-projektowe-009 (P2).
- Brak potrząsania jako cofnięcia i gestów trzema palcami — brak kolizji.

## Lista dla właściciela (telefon, ok. 5 min)
| Gest × ekran | Oczekiwany wynik |
|---|---|
| przesunięcie w lewo na serii w treningu | „Usuń” → okno z „Anuluj” po lewej, „Usuń” czerwone; ostatnia seria bloku — okno z wyjaśnieniem i „OK” |
| przesunięcie w lewo na sesji w zakładce Plan | to samo okno co „Usuń sesję” na ekranie sesji |
| przeciągnięcie ≡ na ekranie Kolejność | wiersz jedzie za palcem, po puszczeniu nowa kolejność, wibracja tylko przy włączonych „Wibracjach” |
| przesunięcie w dół arkusza „Inny trening” | arkusz się zamyka; krótkie przesunięcie wraca na miejsce |
| przesunięcie od krawędzi w edycji szablonu | nic się nie dzieje (szkic chroniony), „Anuluj” pyta „Odrzucić zmiany?” |
