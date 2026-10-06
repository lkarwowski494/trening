# 19. Macierz testów (generowana)

Plik generuje `node scripts/test-matrix.mjs --write` z kodu i testów — nie edytuj ręcznie. `npm run verify` uruchamia `--check`:
nowy ekran, przycisk, pole, funkcja albo wartość wymiaru bez testu blokuje commit (polecenie właściciela 06.10.2026).
Wyjątki tylko z powodem w `tests/matrix-exceptions.json`. Pokrycie UI = tekst elementu występuje w teście (Jest albo Maestro);
to warunek konieczny, nie dowód — przepływy i logikę sprawdzają testy scenariuszowe (docs/09, sekcja „Macierz testów”).

| Rodzaj | Pozycji | Z testem | Wyjątki |
|---|---|---|---|
| EKRAN | 20 | 20 | 0 |
| UI | 174 | 174 | 0 |
| TEKST | 366 | 366 | 0 |
| LOGIKA | 349 | 349 | 0 |
| WYMIAR | 10 | 10 | 0 |

## EKRAN

| Pozycja | Źródło | Testy (pierwsze 3) |
|---|---|---|
| /exercises | app/(tabs)/exercises.tsx | tests/matrix-a11y.test.tsx, tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx +6 |
| /history | app/(tabs)/history.tsx | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r83.test.tsx +18 |
| / | app/(tabs)/index.tsx | tests/app.tsx, tests/audit-backlog-q.test.tsx, tests/audit-backlog-r75.test.tsx +67 |
| /more | app/(tabs)/more.tsx | tests/audit-io-flows.test.tsx, tests/audit-io-more.test.tsx, tests/audit-journey-c.test.tsx +29 |
| /templates | app/(tabs)/templates.tsx | tests/matrix-a11y.test.tsx, tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx +5 |
| /exercise | app/exercise/[id].tsx | tests/catalog-v2.test.ts, tests/matrix-a11y.test.tsx, tests/matrix-dim-langs1.test.tsx +7 |
| /history | app/history/[id].tsx | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r83.test.tsx +18 |
| /history/add | app/history/add.tsx | tests/audit-r82.test.tsx, tests/edit-history.test.tsx, tests/matrix-ui.test.tsx +1 |
| /history/edit | app/history/edit/[id].tsx | tests/backlog-0410.test.tsx, tests/integration-090.test.tsx, tests/matrix-a11y.test.tsx +2 |
| /more/backup | app/more/backup.tsx | tests/audit-io-more.test.tsx, tests/audit-r83.test.tsx, tests/audit-r83b.test.tsx +10 |
| /more/bands | app/more/bands.tsx | tests/audit-r83.test.tsx, tests/audit-records-misc.test.tsx, tests/matrix-a11y.test.tsx +9 |
| /more/language | app/more/language.tsx | tests/matrix-a11y.test.tsx, tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx +4 |
| /more/location | app/more/location/[id].tsx | tests/audit-r82c.test.tsx, tests/decisions-0310.test.tsx, tests/locations-audit.test.tsx +5 |
| /more/locations | app/more/locations.tsx | tests/locations-ui.test.tsx, tests/matrix-a11y.test.tsx, tests/matrix-dim-langs1.test.tsx +6 |
| /more/progress | app/more/progress.tsx | tests/audit-journey-c.test.tsx, tests/audit-perf-ui.test.tsx, tests/audit-records-ui.test.tsx +10 |
| /more/settings | app/more/settings.tsx | tests/audit-io-flows.test.tsx, tests/audit-io-more.test.tsx, tests/audit-r83.test.tsx +18 |
| /picker | app/picker.tsx | tests/audit-prephone.test.tsx, tests/backlog-0410.test.tsx, tests/catalog-full.test.tsx +7 |
| /reorder | app/reorder.tsx | tests/reorder-t010.test.tsx |
| /swap | app/swap.tsx | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| /template | app/template/[id].tsx | tests/audit-prephone.test.tsx, tests/audit-r82.test.tsx, tests/audit-r83.test.tsx +17 |

## UI

| Pozycja | Źródło | Testy (pierwsze 3) |
|---|---|---|
| {n} z {all} | components/DragList.tsx | (tylko parametry — pokrycie przez test ekranu) |
| ↑ przy ćwiczeniu, gdy ostatnio wszystkie serie były na górze zakresu powtórzeń | app/more/settings.tsx | tests/matrix-ui.test.tsx |
| ↺ cofnij | components/ActiveWorkout.tsx | tests/invariants.test.ts, tests/swap-ui.test.tsx, .maestro/07-zamiana.yaml |
| ↺ przywróć: {name} | app/swap.tsx | tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx, tests/swap-history.test.tsx |
| ⇄ zamień | app/history/edit/[id].tsx | tests/scenario-full.test.tsx, tests/swap-history.test.tsx, tests/swap-ui.test.tsx +1 |
| + Dodaj ćwiczenie | app/history/edit/[id].tsx | tests/audit-prephone.test.tsx, tests/audit-r82.test.tsx, tests/edit-history.test.tsx +10 |
| + Dodaj miejsce | app/more/locations.tsx | tests/locations-ui.test.tsx, tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx +6 |
| + Dodaj trening wstecz | app/(tabs)/history.tsx | tests/edit-history.test.tsx, tests/integration-090.test.tsx, tests/matrix-dim-langs1.test.tsx +5 |
| + drop set | app/history/edit/[id].tsx | tests/scenario-full.test.tsx, tests/set-kinds-visible.test.tsx, tests/template-rows.test.tsx +2 |
| + Guma | app/more/bands.tsx | tests/audit-r83.test.tsx, tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx +4 |
| + Nowe | app/(tabs)/exercises.tsx | tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx, tests/matrix-dim-langs3.test.tsx +2 |
| + Nowy | app/(tabs)/templates.tsx | tests/flows.test.tsx, tests/matrix-ui.test.tsx, tests/regress.test.tsx +2 |
| + Nowy szablon | app/(tabs)/index.tsx | tests/flows.test.tsx, tests/matrix-ui.test.tsx, tests/regress.test.tsx +2 |
| + rozgrzewka | app/history/edit/[id].tsx | tests/scenario-full.test.tsx, tests/set-kinds-visible.test.tsx, tests/template-rows.test.tsx +2 |
| + seria | app/history/edit/[id].tsx | tests/audit-close2-b.test.tsx, tests/audit-journey-c.test.tsx, tests/audit-prephone.test.tsx +10 |
| + talerz | components/LoadEditor.tsx | tests/locations-loads.test.ts, tests/locations-ui.test.tsx, tests/matrix-ui.test.tsx +1 |
| + zakres powtórzeń | app/template/[id].tsx | tests/scenario-full.test.tsx, tests/template-rows.test.tsx, .maestro/08-szablon-wiersze.yaml |
| − seria | app/template/[id].tsx | tests/flows.test.tsx, tests/matrix-ui.test.tsx, tests/regress.test.tsx +1 |
| ≡ Kolejność | app/template/[id].tsx | tests/matrix-ui.test.tsx, tests/reorder-t010.test.tsx |
| Anuluj | app/(tabs)/index.tsx | tests/audit-prephone.test.tsx, tests/backlog-0410.test.tsx, tests/edit-history.test.tsx +9 |
| Anuluj trening | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx, tests/ux.test.tsx +1 |
| Asysta gumą | app/exercise/[id].tsx | tests/scenario-full.test.tsx |
| Automatyczna kopia po każdym treningu | app/more/settings.tsx | tests/phone-p1.test.tsx, tests/scenario-full.test.tsx |
| Backup (eksport / import) | app/(tabs)/more.tsx | tests/scenario-full.test.tsx |
| Brak sprzętu w: {l}. Brakuje: {m} | components/ActiveWorkout.tsx | tests/scenario-full.test.tsx |
| cel s | app/template/[id].tsx | tests/audit-stale-ui.test.tsx, tests/regress.test.tsx, tests/scenario-full.test.tsx +1 |
| co | components/LoadEditor.tsx | tests/app.tsx, tests/audit-ac5d764.test.tsx, tests/audit-backlog-q.test.tsx +124 |
| Co logujesz w serii | app/exercise/[id].tsx | tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx, tests/matrix-dim-langs3.test.tsx +2 |
| Cofnij | components/ActiveWorkout.tsx | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx +2 |
| Cofnij zamianę: {name} | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx, tests/swap-ui.test.tsx +1 |
| czas | app/history/edit/[id].tsx | tests/app.tsx, tests/audit-backlog-q.test.tsx, tests/audit-backlog-r75.test.tsx +24 |
| Czas trwania (min) | components/WhenFields.tsx | tests/edit-history.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Data (RRRR-MM-DD) | components/WhenFields.tsx | tests/edit-history.test.tsx, tests/integration-090.test.tsx, tests/matrix-ui.test.tsx +1 |
| do | app/template/[id].tsx | tests/app.tsx, tests/audit-backlog-q.test.tsx, tests/audit-backlog-r75.test.tsx +120 |
| Do upadku (F) | app/template/[id].tsx | tests/scenario-full.test.tsx, .maestro/08-szablon-wiersze.yaml |
| dodaj ciężar | components/LoadEditor.tsx | tests/locations-ui.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Dodaj notatkę | components/ActiveWorkout.tsx | tests/scenario-full.test.tsx |
| domyślna {s} | app/exercise/[id].tsx | tests/audit-backlog-r75.test.tsx, tests/regress.test.tsx, tests/scenario-full.test.tsx +1 |
| Domyślna przerwa (sekundy) | app/more/settings.tsx | tests/scenario-full.test.tsx |
| Drop set (D) | app/template/[id].tsx | tests/scenario-full.test.tsx |
| Duplikuj | app/more/location/[id].tsx | tests/flows.test.tsx, tests/locations-ui.test.tsx, tests/regress.test.tsx +1 |
| dystans | app/history/edit/[id].tsx | tests/audit-backlog-r75.test.tsx, tests/audit-prephone.test.tsx, tests/edit-history.test.tsx +8 |
| Dzień później | components/WhenFields.tsx | tests/scenario-full.test.tsx |
| Dzień wcześniej | components/WhenFields.tsx | tests/edit-history.test.tsx, tests/scenario-full.test.tsx |
| Dźwięk i wibracja na koniec przerwy | app/more/settings.tsx | tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx, tests/matrix-dim-langs3.test.tsx +4 |
| Edytuj | app/history/[id].tsx | tests/app.tsx, tests/audit-r83b.test.tsx, tests/edit-history.test.tsx +7 |
| Edytuj notatkę | components/ActiveWorkout.tsx | tests/scenario-full.test.tsx |
| Edytuj sesję | app/history/[id].tsx | tests/scenario-full.test.tsx, .maestro/05-edycja-historii.yaml |
| Ekran włączony podczas treningu | app/more/settings.tsx | tests/phone-p1.test.tsx, tests/regress.test.tsx, tests/scenario-full.test.tsx |
| Eksportuj backup (plik JSON) | app/more/backup.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Eksportuj historię do CSV | app/more/backup.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| główne | app/template/[id].tsx | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx +19 |
| Godzina startu | components/WhenFields.tsx | tests/edit-history.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Gotowe | app/reorder.tsx | tests/audit-prephone.test.tsx, tests/matrix-ui.test.tsx, tests/reorder-t010.test.tsx +1 |
| Guma: {b}. Tapnij, by zmienić. | app/history/edit/[id].tsx | tests/audit-journey-c.test.tsx, tests/locations-ui.test.tsx, tests/matrix-ui.test.tsx +2 |
| Importuj | app/more/backup.tsx | tests/audit-io-more.test.tsx, tests/audit-r83.test.tsx, tests/audit-r83b.test.tsx +3 |
| Importuj backup | app/more/backup.tsx | tests/audit-io-more.test.tsx, tests/audit-r83.test.tsx, tests/audit-r83b.test.tsx +3 |
| Inny przyrząd: {impl} | app/swap.tsx | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx +1 |
| Jak liczyć ciężar w objętości | app/exercise/[id].tsx | tests/scenario-full.test.tsx |
| jak robocza | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| Jednostka ciężaru | app/more/settings.tsx | tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx, tests/matrix-dim-langs3.test.tsx +3 |
| Język | app/more/settings.tsx | tests/audit-io-flows.test.tsx, tests/audit-io-more.test.tsx, tests/flows.test.tsx +4 |
| kolor | app/more/bands.tsx | tests/audit-r83.test.tsx, tests/brand-kreda.test.tsx, tests/flows.test.tsx +13 |
| Kolor gumy | app/more/bands.tsx | tests/owner-0510c.test.tsx, tests/regress.test.tsx, tests/scenario-full.test.tsx +1 |
| Kontynuuj | components/ActiveWorkout.tsx | tests/audit-close2-a.test.tsx, tests/audit-journey-b.test.tsx, tests/audit-r72-d.test.ts +4 |
| krok | components/LoadEditor.tsx | tests/app.tsx, tests/audit-backlog-r75.test.tsx, tests/audit-r82b.test.tsx +22 |
| max na stronę | components/LoadEditor.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Miejsca i sprzęt | app/(tabs)/more.tsx | tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx, tests/matrix-dim-langs3.test.tsx +3 |
| Miejsca treningu | app/more/settings.tsx | tests/locations-ui.test.tsx, tests/scenario-full.test.tsx, .maestro/06-miejsca.yaml |
| Miejsce domyślne | app/template/[id].tsx | tests/locations-ui.test.tsx, tests/scenario-full.test.tsx |
| Miejsce treningu: {l}. Tapnij, by zmienić. | components/ActiveWorkout.tsx | tests/audit-journey-c.test.tsx, tests/locations-ui.test.tsx, tests/matrix-ui.test.tsx +2 |
| min na stronę | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Nazwa | app/exercise/[id].tsx | tests/regress.test.tsx, tests/scenario-full.test.tsx, .maestro/05-edycja-historii.yaml +1 |
| Nie | app/exercise/[id].tsx | tests/decisions-0310.test.tsx, tests/eas-capabilities.test.ts, tests/edit-history.test.tsx +17 |
| Nie udało się zapisać danych | app/(tabs)/index.tsx | tests/matrix-ui.test.tsx, tests/regress.test.tsx |
| Nie zamieniaj: {name} | components/ActiveWorkout.tsx | tests/scenario-full.test.tsx, tests/swap-alternates.test.tsx |
| Notatka do treningu | app/history/edit/[id].tsx | tests/edit-history.test.tsx, tests/scenario-full.test.tsx |
| Notatki techniczne | app/exercise/[id].tsx | tests/scenario-full.test.tsx |
| np. samopoczucie, ból, sprzęt | app/history/edit/[id].tsx | tests/matrix-ui.test.tsx |
| Obciążenie partii (z katalogu) | app/exercise/[id].tsx | tests/catalog-v2.test.ts |
| od | components/LoadEditor.tsx | tests/app.tsx, tests/audit-ac5d764.test.tsx, tests/audit-backlog-q.test.tsx +116 |
| Odrzuć | components/ActiveWorkout.tsx | tests/audit-close2-a.test.tsx, tests/edit-history.test.tsx, tests/flows.test.tsx +4 |
| Odrzuć trening | app/history/edit/[id].tsx | tests/edit-history.test.tsx, tests/flows.test.tsx, tests/matrix-invariants.test.ts +3 |
| Odrzuć zmiany | app/history/edit/[id].tsx | tests/edit-history.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| opcjonalne pole, nie wpływa na objętość | app/more/settings.tsx | tests/matrix-ui.test.tsx |
| Partia | app/exercise/[id].tsx | tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx, tests/helpers.ts +4 |
| Partie główne (1 seria) | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| Partie pomocnicze (0,5 serii) | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| Pliki → Na moim iPhonie → {app} → Backup, ostatnie {n} | app/more/settings.tsx | tests/xcheck-0610.test.tsx |
| Podpowiedź progresji | app/more/settings.tsx | tests/matrix-ui.test.tsx, tests/phone-p1.test.tsx, tests/scenario-full.test.tsx |
| Pokaż więcej ({n}) | app/swap.tsx | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| Pokaż więcej ćwiczeń: zostało {n} | app/swap.tsx | tests/catalog-full.test.tsx, tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| Połącz z następnym w superset | app/template/[id].tsx | tests/flows.test.tsx, tests/scenario-full.test.tsx, tests/ux.test.tsx |
| Pomiń | components/ActiveWorkout.tsx | tests/scenario-full.test.tsx, .maestro/05-edycja-historii.yaml |
| Poprzednich danych nie dało się odczytać | app/(tabs)/index.tsx | tests/matrix-ui.test.tsx, tests/regress.test.tsx |
| Postęp treningu: {d} z {n} serii | components/ActiveWorkout.tsx | tests/audit-backlog-r75.test.tsx, tests/scenario-full.test.tsx |
| Postępy | app/(tabs)/more.tsx | tests/audit-perf-ui.test.tsx, tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx +5 |
| pow. od | app/template/[id].tsx | tests/template-rows.test.tsx |
| Powtórz ostatni ({name}) | app/(tabs)/index.tsx | tests/audit-close2-b.test.tsx, tests/scenario-full.test.tsx |
| Powtórzenia | app/history/edit/[id].tsx | tests/audit-close2-b.test.tsx, tests/audit-journey-a.test.tsx, tests/audit-journey-c.test.tsx +5 |
| Poziom (1–7) | app/more/bands.tsx | tests/phone-p1.test.tsx, tests/regress.test.tsx, tests/scenario-full.test.tsx |
| Propozycja {n}: {name} | app/swap.tsx | tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx, tests/swap-alternates.test.tsx +3 |
| Przerwa po rozgrzewce (s) | app/exercise/[id].tsx | tests/scenario-full.test.tsx |
| Przerwa robocza (s) | app/exercise/[id].tsx | tests/scenario-full.test.tsx |
| przerwa s | app/template/[id].tsx | tests/fixtures/demo-templates.ts, tests/regress.test.tsx, tests/scenario-full.test.tsx |
| Przerwa zamiennika (s): {name} | app/template/[id].tsx | tests/swap-alternates.test.tsx |
| Przerwa: {s}. Tapnij, by zmienić. | components/ActiveWorkout.tsx | tests/audit-journey-c.test.tsx, tests/locations-ui.test.tsx, tests/matrix-ui.test.tsx +2 |
| Przywróć „{name}” | app/(tabs)/exercises.tsx | tests/backlog-0410.test.tsx, tests/matrix-logic.test.tsx, tests/regress.test.tsx +1 |
| Pusty trening | app/(tabs)/index.tsx | tests/audit-r82.test.tsx, tests/edit-history.test.tsx, tests/flows.test.tsx +12 |
| Rozgrzewka (W) | app/template/[id].tsx | tests/scenario-full.test.tsx |
| RPE / RIR przy serii | app/more/settings.tsx | tests/flows.test.tsx, tests/matrix-ui.test.tsx, tests/phone-p1.test.tsx +1 |
| Seria {n} zrobiona — {ex} | components/ActiveWorkout.tsx | tests/audit-close2-a.test.tsx, tests/audit-close2-b.test.tsx, tests/audit-final-auto.test.tsx +15 |
| Seria {n}, typ: {k}. Tapnij, by zmienić typ lub dodać notatkę. | app/history/edit/[id].tsx | tests/audit-close2-b.test.tsx, tests/audit-journey-c.test.tsx, tests/scenario-full.test.tsx +1 |
| Seria {n}, typ: {k}. Tapnij, by zmienić typ lub usunąć serię. | app/template/[id].tsx | tests/scenario-full.test.tsx, .maestro/08-szablon-wiersze.yaml |
| Seria normalna | app/template/[id].tsx | tests/scenario-full.test.tsx |
| Skróć przerwę o 15 sekund | components/ActiveWorkout.tsx | tests/scenario-full.test.tsx |
| Sprawdź zgodę na powiadomienia | app/more/settings.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Sprzęt | app/exercise/[id].tsx | tests/audit-r83.test.tsx, tests/audit-r83b.test.tsx |
| Start | app/(tabs)/index.tsx | tests/audit-backlog-q.test.tsx, tests/audit-backlog-r75.test.tsx, tests/audit-close-b.test.tsx +45 |
| Start: {name} | app/(tabs)/index.tsx | tests/audit-close2-a.test.tsx, tests/audit-journey-a.test.tsx, tests/audit-journey-b.test.tsx +17 |
| sztuk | components/LoadEditor.tsx | tests/locations-loads.test.ts, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Szukaj ćwiczenia… | app/more/progress.tsx | tests/audit-prephone.test.tsx, tests/audit-r82.test.tsx, tests/backlog-0410.test.tsx +13 |
| Szukaj… | app/(tabs)/exercises.tsx | tests/regress.test.tsx, tests/scenario-full.test.tsx |
| talerz ({u}) | components/LoadEditor.tsx | tests/scenario-full.test.tsx |
| Tempo (opcjonalnie, np. 3-1-1) | app/exercise/[id].tsx | tests/scenario-full.test.tsx |
| Trening | app/history/edit/[id].tsx | tests/audit-backlog-q.test.tsx, tests/audit-close-c.test.tsx, tests/audit-close2-a.test.tsx +27 |
| Tylko teraz | components/ActiveWorkout.tsx | tests/regress.test.tsx, tests/scenario-full.test.tsx |
| Ukryj komunikat | app/(tabs)/index.tsx | tests/regress.test.tsx |
| Ustaw jako główne | app/more/location/[id].tsx | tests/locations-ui.test.tsx, tests/scenario-full.test.tsx |
| Ustawienia | app/(tabs)/more.tsx | tests/audit-backlog-r75.test.tsx, tests/audit-r72-b.test.ts, tests/i18n-multi.test.ts +16 |
| usuń | app/history/edit/[id].tsx | tests/locations-ui.test.tsx, tests/regress.test.tsx, tests/ux.test.tsx |
| Usuń | app/exercise/[id].tsx | tests/audit-r83.test.tsx, tests/audit-records-misc.test.tsx, tests/edit-history.test.tsx +10 |
| Usuń ćwiczenie | app/exercise/[id].tsx | tests/edit-history.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx +2 |
| Usuń ćwiczenie: {name} | app/history/edit/[id].tsx | tests/edit-history.test.tsx, tests/scenario-full.test.tsx |
| Usuń gumę | app/more/bands.tsx | tests/audit-r83.test.tsx, tests/audit-records-misc.test.tsx, tests/matrix-ui.test.tsx +3 |
| Usuń gumy… | app/more/location/[id].tsx | tests/scenario-full.test.tsx |
| Usuń odznaczone | components/LoadEditor.tsx | tests/scenario-full.test.tsx |
| Usuń serię | app/template/[id].tsx | tests/edit-history.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx +2 |
| Usuń serię {n} — {ex} | app/history/edit/[id].tsx | tests/edit-history.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx +2 |
| Usuń sesję | app/history/[id].tsx | tests/edit-history.test.tsx, tests/matrix-ui.test.tsx, tests/regress.test.tsx +1 |
| Usuń usunięte ćwiczenie z treningu | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Usuń z szablonu | app/template/[id].tsx | tests/flows.test.tsx, tests/regress.test.tsx, tests/scenario-full.test.tsx +2 |
| Usuń zakres powtórzeń | app/template/[id].tsx | tests/scenario-full.test.tsx, .maestro/08-szablon-wiersze.yaml |
| Usuń zamiennik: {name} | app/template/[id].tsx | tests/swap-alternates.test.tsx |
| Utwórz „{name}” | app/(tabs)/exercises.tsx | tests/backlog-0410.test.tsx, tests/matrix-logic.test.tsx, tests/regress.test.tsx +1 |
| Wróć | app/history/edit/[id].tsx | tests/audit-close2-a.test.tsx, tests/edit-history.test.tsx, tests/locations-ui.test.tsx +8 |
| Wszystkie | app/picker.tsx | tests/matrix-a11y.test.tsx, tests/matrix-time.test.ts, tests/scenario-full.test.tsx +1 |
| Wyczyść | app/more/settings.tsx | tests/audit-io-more.test.tsx, tests/audit-r83.test.tsx, tests/audit-r83b.test.tsx +5 |
| Wyczyść wszystkie dane | app/more/settings.tsx | tests/audit-io-more.test.tsx, tests/audit-r83.test.tsx, tests/audit-r83b.test.tsx +5 |
| Wydłuż przerwę o 15 sekund | components/ActiveWorkout.tsx | tests/scenario-full.test.tsx |
| Wygląd | app/more/settings.tsx | tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx, tests/matrix-dim-langs3.test.tsx +4 |
| Wyjmij z supersetu | app/template/[id].tsx | tests/scenario-full.test.tsx |
| Wykres słupkowy: {v} | components/Chart.tsx | tests/regress.test.tsx |
| Wypełnij | components/LoadEditor.tsx | tests/audit-r82c.test.tsx, tests/locations-audit.test.tsx, tests/locations-ui.test.tsx +2 |
| Wyślij kopię | app/(tabs)/index.tsx | tests/matrix-ui.test.tsx, tests/regress.test.tsx |
| Zakończ | components/ActiveWorkout.tsx | tests/audit-backlog-r75.test.tsx, tests/audit-close2-a.test.tsx, tests/audit-close2-b.test.tsx +22 |
| Zakończ i zapisz | components/ActiveWorkout.tsx | tests/audit-close2-a.test.tsx, tests/audit-close2-c.test.tsx, tests/audit-journey-b.test.tsx +2 |
| Zakończ serię | components/ActiveWorkout.tsx | tests/audit-r72-ui.test.tsx, tests/matrix-ui.test.tsx, tests/regress.test.tsx +1 |
| Zakończ trening i zapisz | components/ActiveWorkout.tsx | tests/audit-backlog-r75.test.tsx, tests/audit-close2-b.test.tsx, tests/audit-journey-a.test.tsx +11 |
| Zamień | components/ActiveWorkout.tsx | tests/backlog-0410.test.tsx, tests/catalog-full.test.tsx, tests/matrix-ui.test.tsx +5 |
| Zamień ćwiczenie (brak sprzętu): {name} | components/ActiveWorkout.tsx | tests/scenario-full.test.tsx, tests/swap-ui.test.tsx |
| Zamień ćwiczenie: {name} | app/history/edit/[id].tsx | tests/backlog-0410.test.tsx, tests/catalog-full.test.tsx, tests/matrix-ui.test.tsx +5 |
| Zamień na zamiennik: {name} | components/ActiveWorkout.tsx | tests/swap-alternates.test.tsx |
| Zapamiętaj | components/ActiveWorkout.tsx | tests/regress.test.tsx, tests/scenario-full.test.tsx, tests/swap-alternates.test.tsx |
| Zapisuj zakończone treningi do Apple Health | app/more/settings.tsx | tests/matrix-ui.test.tsx, tests/phone-p1.test.tsx, tests/scenario-full.test.tsx |
| Zapisz | app/history/edit/[id].tsx | tests/edit-history.test.tsx, tests/integration-090.test.tsx, tests/matrix-ui.test.tsx +3 |
| Zapisz zmiany | app/history/edit/[id].tsx | tests/edit-history.test.tsx, tests/scenario-full.test.tsx, .maestro/05-edycja-historii.yaml |
| Zastąp | components/LoadEditor.tsx | tests/locations-audit.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Zawsze w: {l} | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx, tests/swap-alternates.test.tsx +1 |
| Zawsze w: {l} — {name} | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx, tests/swap-alternates.test.tsx +1 |
| zaznaczone: {n} z {m} | app/more/location/[id].tsx | tests/eas-capabilities.test.ts, tests/scenario-full.test.tsx |
| Zmień kolejność ćwiczeń | app/template/[id].tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Zmień kolejność: {name} | components/DragList.tsx | tests/reorder-t010.test.tsx, tests/scenario-full.test.tsx |
| Zmierz | components/ActiveWorkout.tsx | tests/audit-close-b.test.tsx, tests/audit-close2-c.test.tsx, tests/audit-final-timer.test.tsx +4 |

## TEKST

| Pozycja | Źródło | Testy (pierwsze 3) |
|---|---|---|
| „do” jest mniejsze niż „od” — zakres pokaże się jako {n}+ | app/template/[id].tsx | tests/scenario-full.test.tsx |
| (kopia) | lib/locations.ts | tests/locations-model.test.ts, tests/locations-ui.test.tsx, tests/scenario-full.test.tsx |
| (usunięte miejsce) | lib/locations.ts | tests/audit-r82c.test.tsx, tests/integration-090.test.tsx, tests/locations-model.test.ts +2 |
| {c}, poziom {n} | lib/store.ts | tests/audit-r83.test.tsx, tests/flows.test.tsx, tests/regress.test.tsx +2 |
| {k}: {v} | lib/stats.ts | (tylko parametry) |
| {n} rozgrz. | app/template/[id].tsx | tests/scenario-full.test.tsx |
| {n} z {m} | app/more/location/[id].tsx | (tylko parametry) |
| {n}, główne: {m} | app/more/settings.tsx | tests/scenario-full.test.tsx, .maestro/06-miejsca.yaml |
| {name}, wybrany | app/more/language.tsx | tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx |
| {p} zastąpi ciężary wpisane dla: {i}. | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| {u}/hant. | lib/store.ts | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx +3 |
| {u}/hantel | lib/store.ts | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx +4 |
| {u}/str. | lib/store.ts | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx +6 |
| {u}/strona | lib/store.ts | tests/matrix-ui.test.tsx |
| {u}/stronę | lib/store.ts | tests/audit-r82.test.tsx |
| ↑ spróbuj {n} pow. | components/ActiveWorkout.tsx | tests/audit-backlog-r75.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx +2 |
| ↑ spróbuj {v} | components/ActiveWorkout.tsx | tests/audit-backlog-r75.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx +2 |
| ↑ spróbuj bez asysty | components/ActiveWorkout.tsx | tests/audit-backlog-r75.test.tsx |
| ●●● główna · ●● pomocnicza · ● stabilizacja | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| ★ Miejsce główne — domyślne dla nowych treningów i szablonów bez własnego miejsca. | app/more/location/[id].tsx | tests/scenario-full.test.tsx |
| Anulować trening? | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx, tests/ux.test.tsx +1 |
| Apple Health niedostępne | app/more/settings.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Backup | app/_layout.tsx | tests/audit-backlog-r75.test.tsx, tests/audit-close-d.test.ts, tests/audit-io-flows.test.tsx +33 |
| Backup treningów | lib/backup.ts | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| Backup z nowszej wersji aplikacji | app/more/backup.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| bez miejsca | components/ActiveWorkout.tsx | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx +9 |
| Bez serii — ćwiczenie nie zostanie zapisane. | app/history/edit/[id].tsx | tests/edit-history.test.tsx |
| bez szablonu | app/(tabs)/index.tsx | tests/audit-close2-b.test.tsx, tests/ux.test.tsx |
| brak | app/history/edit/[id].tsx | tests/app.tsx, tests/audit-backlog-r75.test.tsx, tests/audit-io-flows.test.tsx +47 |
| brak ciężarów — podpowiedź „↑” jak bez miejsca | components/LoadEditor.tsx | tests/bar-no-plates.test.tsx, tests/matrix-ui.test.tsx |
| Brak ćwiczeń — dodaj pierwsze. | app/history/edit/[id].tsx | tests/edit-history.test.tsx, tests/scenario-full.test.tsx |
| Brak danych do wykresu. | components/Chart.tsx | tests/regress.test.tsx |
| Brak gum. Dodaj pierwszą, by zapisywać asystę przy podciąganiu. | app/more/bands.tsx | tests/matrix-ui.test.tsx |
| Brak miejsc — wszystkie ćwiczenia są dostępne, a podpowiedzi działają jak dotąd. | app/more/locations.tsx | tests/scenario-full.test.tsx |
| Brak odhaczonych serii | components/ActiveWorkout.tsx | tests/flows.test.tsx, tests/matrix-invariants.test.ts, tests/matrix-ui.test.tsx +3 |
| Brak podobnych ćwiczeń w tym miejscu — rozwiń „Inne”. | app/swap.tsx | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| Brak serii w tym i poprzednim tygodniu. | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| Brak sesji. | app/history/[id].tsx | tests/edit-history.test.tsx |
| brak sprzętu w: {l} | app/template/[id].tsx | tests/locations-ui.test.tsx, tests/swap-alternates.test.tsx, tests/swap-ui.test.tsx +1 |
| Brak szablonów — dodaj pierwszy. | app/(tabs)/templates.tsx | tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx, tests/matrix-dim-langs3.test.tsx +2 |
| Brak szablonów z ćwiczeniami — utworzysz je w zakładce Szablony. Możesz też zacząć od pustego treningu. | app/history/add.tsx | tests/edit-history.test.tsx |
| Brak zapisanych sesji z tym ćwiczeniem. | app/more/progress.tsx | tests/scenario-full.test.tsx |
| Brak zgody | app/more/settings.tsx | tests/matrix-ui.test.tsx |
| Brak zgody na zapis treningów. Włącz ją w aplikacji Zdrowie: profil → Aplikacje → {app}. | app/more/settings.tsx | tests/matrix-ui.test.tsx |
| brak: {m} | app/picker.tsx | tests/locations-audit.test.tsx, tests/locations-catalog.test.ts, tests/locations-ui.test.tsx +4 |
| Ciemny | app/more/settings.tsx | tests/scenario-full.test.tsx, tests/theme-choice.test.tsx, .maestro/09-jezyk-wyglad.yaml |
| ciężar | app/history/[id].tsx | tests/audit-prephone.test.tsx, tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx +53 |
| Ciężar od {a} do {b}. | components/LoadEditor.tsx | tests/scenario-full.test.tsx |
| Ciężar serii na stacji wpisuj na stronę — tak, jak pokazuje urządzenie. | components/LoadEditor.tsx | tests/decisions-0310.test.tsx |
| Ciężarów w tym zakresie: {c} — najwyżej {n}. Zwiększ krok. | components/LoadEditor.tsx | tests/locations-audit.test.tsx |
| ciężaru {w} nie ma tutaj — wpisz ciężar | app/history/edit/[id].tsx | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx +1 |
| Cofnąć zamianę? | components/ActiveWorkout.tsx | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx, tests/swap-ui.test.tsx |
| CSV: ciężar w jednostce z ustawień ({u}), dystans w metrach. | app/more/backup.tsx | tests/matrix-ui.test.tsx |
| Czas trwania: od 1 do 1440 minut. | lib/edit.ts | tests/matrix-time.test.ts, tests/matrix-ui.test.tsx |
| ćw. | app/(tabs)/index.tsx | tests/scenario-full.test.tsx |
| Ćwiczenia | app/(tabs)/_layout.tsx | tests/matrix-a11y.test.tsx, tests/matrix-data-shared.ts, tests/matrix-dim-langs1.test.tsx +7 |
| ćwiczenia dodasz w następnym kroku | app/history/add.tsx | tests/scenario-full.test.tsx |
| Ćwiczenie | app/_layout.tsx | tests/swap-top3.test.ts, .maestro/08-szablon-wiersze.yaml |
| dalej: {name} | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Dane i kopie | app/more/settings.tsx | tests/phone-p1.test.tsx |
| Dane nie zostały wyczyszczone | app/more/settings.tsx | tests/audit-r83.test.tsx |
| Dane w telefonie | app/more/settings.tsx | tests/regress.test.tsx |
| do upadku | lib/backup.ts | tests/edit-history.test.tsx, tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx +8 |
| Dodaj ciężar | components/LoadEditor.tsx | tests/locations-audit.test.tsx, tests/locations-ui.test.tsx, tests/matrix-ui.test.tsx +1 |
| Dostępne ćwiczenia: {n} z {m} | app/more/location/[id].tsx | tests/locations-ui.test.tsx, tests/scenario-full.test.tsx, .maestro/06-miejsca.yaml |
| dostępne: {n} ({r}) | components/LoadEditor.tsx | tests/locations-ui.test.tsx |
| Dotknij etykiety serii, by zmienić typ albo usunąć serię. Zakres powtórzeń jest opcjonalny — z nim pojawiają się podpowiedzi „↑”. „⇅ SS” łączy ćwiczenie z następnym w superset, „✂ SS” wyjmuje z grupy. Kolejność: „≡ Kolejność”. | app/template/[id].tsx | tests/matrix-ui.test.tsx |
| e1RM (dociążenie) | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| e1RM (Epley, na stronę) | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| e1RM (Epley, per hantel) | app/more/progress.tsx | tests/scenario-full.test.tsx |
| e1RM {v} (seria {s}) | lib/stats.ts | tests/audit-records-logic.test.ts, tests/audit-records-misc.test.tsx, tests/regress.test.tsx +2 |
| Edycja sesji | app/_layout.tsx | .maestro/05-edycja-historii.yaml |
| Eksport CSV | lib/backup.ts | tests/matrix-ui.test.tsx |
| Eksport tworzy plik JSON z całą historią i szablonami — zapisz go w Plikach/iCloud albo wyślij sobie. Import przyjmuje ten sam format, także backup z wersji webowej. | app/more/backup.tsx | tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx, tests/matrix-dim-langs3.test.tsx +2 |
| Filtr miejsca wyłączony: {l}. Tapnij, by pokazać tylko dostępne. | app/picker.tsx | tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx |
| Filtr miejsca: {l}. Tapnij, by zdjąć. | app/picker.tsx | tests/catalog-full.test.tsx, tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx +2 |
| Filtr partii wyłączony: {g}. Tapnij, by włączyć. | app/swap.tsx | tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx |
| Filtr partii: {g}. Tapnij, by zdjąć. | app/swap.tsx | tests/catalog-full.test.tsx, tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx +2 |
| Gdzie trenujesz i jaki sprzęt tam masz. Wybór ćwiczenia pokazuje wtedy to, co da się zrobić w miejscu treningu, a podpowiedź „↑” proponuje ciężary, które naprawdę masz. Miejsce wybierasz na starcie treningu. | app/more/locations.tsx | tests/matrix-ui.test.tsx |
| główna | app/exercise/[id].tsx | tests/audit-r83.test.tsx, tests/catalog-v2.test.ts, tests/logic.test.ts +6 |
| Godzina {t} nie istnieje tego dnia (zmiana czasu). Wpisz inną. | lib/edit.ts | tests/edit-history.test.tsx, tests/matrix-time.test.ts |
| Gryf ({u}) | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| gryf łamany | lib/swap.ts | tests/matrix-ui.test.tsx |
| guma | app/(tabs)/exercises.tsx | tests/audit-close-d.test.ts, tests/audit-perf-equiv.test.ts, tests/audit-r72-b.test.ts +21 |
| Guma | app/history/edit/[id].tsx | tests/audit-journey-a.test.tsx, tests/audit-journey-c.test.tsx, tests/audit-r83.test.tsx +11 |
| Guma jako opór: przy serii wybierasz gumę (poziom 1–7), rekordy liczą serie z gumą. | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| Gumy | app/_layout.tsx | tests/audit-r83.test.tsx, tests/invariants.test.ts, tests/matrix-ui.test.tsx +5 |
| hantle | lib/swap.ts | tests/audit-backlog-r75.test.tsx, tests/audit-close-d.test.ts, tests/audit-journey-c.test.tsx +50 |
| Historia | app/(tabs)/_layout.tsx | tests/edit-history.test.tsx, tests/integration-090.test.tsx, tests/matrix-a11y.test.tsx +8 |
| Import przerwany | app/more/backup.tsx | tests/audit-r83.test.tsx, tests/audit-r83b.test.tsx, tests/matrix-ui.test.tsx |
| Import zastąpi wszystkie obecne dane zawartością pliku. Obecne dane (także trening w toku) zapiszą się najpierw jako kopia w Plikach: {app} → Backup. | app/more/backup.tsx | tests/matrix-ui.test.tsx |
| Inne | app/swap.tsx | tests/backlog-0410.test.tsx, tests/catalog-full.test.tsx, tests/matrix-logic.test.tsx +3 |
| Inne ▴ | app/swap.tsx | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| Inne ▾ | app/swap.tsx | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx, tests/swap-ui.test.tsx |
| Jak w telefonie | app/more/language.tsx | tests/i18n-multi.test.ts, tests/logic.test.ts, tests/matrix-dim-langs1.test.tsx +7 |
| Jasny | app/more/settings.tsx | tests/scenario-full.test.tsx, tests/theme-choice.test.tsx, .maestro/09-jezyk-wyglad.yaml |
| Jedna sesja: {v}. Wykres pojawi się po drugiej. | components/Chart.tsx | tests/matrix-ui.test.tsx |
| Jednostka sprzętu | components/LoadEditor.tsx | tests/locations-audit.test.tsx, tests/scenario-full.test.tsx |
| Jeszcze pusto — pierwszy trening czeka. | app/(tabs)/history.tsx | tests/scenario-full.test.tsx |
| Jutro wygasa podpis aplikacji | lib/signing.ts | tests/matrix-ui.test.tsx |
| już w treningu | app/swap.tsx | tests/matrix-logic.test.tsx, tests/swap-logic.test.ts, tests/swap-ui.test.tsx |
| kettlebell | lib/swap.ts | tests/catalog-v2.test.ts, tests/decisions-0310.test.tsx, tests/locations-catalog.test.ts +1 |
| Kolejność ćwiczeń | app/_layout.tsx | .maestro/03-kolejnosc.yaml |
| Kolor i poziom trudności: 1 = cienka, 7 = bardzo gruba. Gumy nie mają kilogramów — przy serii zapisujesz, którą gumą pomagałeś. Rekordem są powtórzenia bez gumy, a postęp z gumą to zejście na niższy poziom. | app/more/bands.tsx | tests/matrix-ui.test.tsx |
| Koniec przerwy da znać nawet na zablokowanym ekranie. | app/more/settings.tsx | tests/matrix-ui.test.tsx |
| Koniec treningu ({t}) jest w przyszłości. Zmień datę, godzinę albo czas trwania. | lib/edit.ts | tests/matrix-time.test.ts, tests/matrix-ui.test.tsx |
| Kopia automatyczna po treningu jest wyłączona (Ustawienia). | app/more/backup.tsx | tests/matrix-ui.test.tsx |
| Kopia automatyczna: po każdym treningu plik JSON zapisuje się sam w Plikach (Na moim iPhonie → {app} → Backup, ostatnie {n}). Import przyjmuje też te pliki. Te kopie znikają razem z aplikacją — przed jej usunięciem albo instalacją z innego Apple ID wyeksportuj backup na zewnątrz. | app/more/backup.tsx | tests/matrix-ui.test.tsx |
| Kopia jest zachowana w telefonie. Tapnij, by ją wysłać, a potem zaimportuj backup. | app/(tabs)/index.tsx | tests/matrix-ui.test.tsx |
| Kopia nieczytelnych danych | lib/backup.ts | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| Kopia obejmie też poprzednie, nieczytelne dane. | lib/backup.ts | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| lista ćwiczeń z filtrami, które możesz zdjąć | app/swap.tsx | tests/matrix-ui.test.tsx |
| łączny czas | lib/stats.ts | tests/matrix-invariants.test.ts, tests/regress.test.tsx, tests/stats.test.ts |
| łączny dystans | lib/stats.ts | tests/matrix-invariants.test.ts, tests/regress.test.tsx, tests/stats.test.ts |
| Masa ciała: „±” to dociążenie (plus) albo asysta, np. maszyny (minus); guma to osobne pole z poziomem. Masa ciała nie wchodzi do obliczeń: rekord to suma powtórzeń bez asysty, a e1RM i objętość liczą się tylko z dociążenia. Ćwiczenia na czas mają w treningu stoper — po upływie celu seria odhacza się sama. Przerwa ustawiona w pozycji szablonu ma pierwszeństwo; puste pole przerwy w szablonie oznacza przerwę z tego ćwiczenia. | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| maszyna | lib/swap.ts | tests/catalog-v2.test.ts, tests/invariants.test.ts, tests/locations-audit.test.tsx +5 |
| max ± | lib/stats.ts | tests/audit-backlog-q.test.tsx, tests/backlog-0410.test.tsx, tests/regress.test.tsx +1 |
| max ciężar | lib/stats.ts | tests/stats.test.ts |
| Max ciężar | app/more/progress.tsx | tests/regress.test.tsx, tests/scenario-full.test.tsx |
| Max ciężar (na stronę) | app/more/progress.tsx | tests/regress.test.tsx |
| Max ciężar (per hantel) | app/more/progress.tsx | tests/scenario-full.test.tsx |
| max czas | lib/stats.ts | tests/matrix-ui.test.tsx |
| Max dociążenie | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| max dystans | lib/stats.ts | tests/matrix-ui.test.tsx |
| max pow. | lib/stats.ts | tests/matrix-ui.test.tsx |
| Max powtórzeń bez asysty | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| Max powtórzeń w serii | app/more/progress.tsx | tests/audit-r72-d.test.ts, tests/scenario-full.test.tsx |
| Max powtórzeń z asystą | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| Miejsce | app/_layout.tsx | tests/locations-fixtures.ts, tests/locations-model.test.ts, tests/locations-progress.test.ts +6 |
| Miejsce tego treningu | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Minęło {s} s. | lib/timer.ts | tests/matrix-ui.test.tsx |
| Na pewno? | app/more/settings.tsx | tests/audit-io-more.test.tsx, tests/audit-r83.test.tsx, tests/audit-r83b.test.tsx +4 |
| Nadpisać dane? | app/more/backup.tsx | tests/audit-io-more.test.tsx, tests/audit-r83.test.tsx, tests/audit-r83b.test.tsx +3 |
| Najdłużej łącznie na treningu | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| Najdłuższa seria | app/more/progress.tsx | tests/scenario-full.test.tsx |
| Najdłuższy dystans | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| Najdłuższy dystans na treningu | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| najlepsza | app/more/progress.tsx | tests/audit-perf-ui.test.tsx, tests/audit-records-ui.test.tsx, tests/logic.test.ts +2 |
| Najlepsza seria (objętość) | app/more/progress.tsx | tests/scenario-full.test.tsx |
| Najlepszy trening (objętość) | app/more/progress.tsx | tests/regress.test.tsx |
| Najpierw ustaw inne miejsce jako główne. | app/more/location/[id].tsx | tests/matrix-ui.test.tsx |
| Najpierw zakończ albo anuluj bieżący trening. | app/template/[id].tsx | tests/matrix-ui.test.tsx |
| Najwięcej powtórzeń na treningu | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| Najwyżej {n} rodzajów. | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Następna seria. | lib/timer.ts | tests/matrix-ui.test.tsx |
| Nazwy ćwiczeń z biblioteki są po angielsku we wszystkich językach poza polskim. | app/more/language.tsx | tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx, tests/matrix-dim-langs3.test.tsx +3 |
| Nic do zapisania. Odrzucić ten trening? | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Nic nie pasuje. | app/(tabs)/exercises.tsx | tests/matrix-logic.test.tsx, tests/regress.test.tsx, tests/scenario-full.test.tsx |
| nie | app/exercise/[id].tsx | tests/app.tsx, tests/audit-ac5d764.test.tsx, tests/audit-backlog-q.test.tsx +111 |
| Nie ma takiego ćwiczenia. | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| Nie ma takiego miejsca. | app/more/location/[id].tsx | tests/matrix-ui.test.tsx |
| Nie ma takiego szablonu. | app/reorder.tsx | tests/reorder-t010.test.tsx |
| Nie ma treningu w toku. | app/reorder.tsx | tests/reorder-t010.test.tsx |
| Nie ma żadnej serii z wynikiem — nic do zapisania. | app/history/edit/[id].tsx | tests/edit-history.test.tsx, tests/scenario-full.test.tsx |
| Nie ma żadnej serii z wynikiem. | lib/edit.ts | tests/matrix-ui.test.tsx |
| Nie masz jeszcze szablonów — utwórz pierwszy albo zacznij pusty trening. | app/(tabs)/index.tsx | tests/flows.test.tsx, tests/scenario-full.test.tsx, .maestro/subflows/szablon-testowy.yaml |
| Nie udało się | app/(tabs)/index.tsx | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx, tests/regress.test.tsx +1 |
| Nie udało się otworzyć danych. | app/_layout.tsx | tests/regress.test.tsx, tests/splash-start-error.test.tsx |
| Nie udało się zapisać | app/history/edit/[id].tsx | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx, tests/regress.test.tsx |
| Nie udało się zapisać kopii bezpieczeństwa w Plikach — dane nie zostały zmienione. | lib/backup.ts | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| Nie zostałaby żadna seria z wynikiem. Usunąć tę sesję z historii? | app/history/edit/[id].tsx | tests/matrix-ui.test.tsx |
| niedostępne w: {l} są wyszarzone | app/picker.tsx | tests/scenario-full.test.tsx, .maestro/06-miejsca.yaml |
| Nieodhaczone serie z wpisanymi wynikami: {n} — nie zostaną zapisane. Seria zapisuje się po odhaczeniu ✓. | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Nieprawidłowa data. Wpisz RRRR-MM-DD, np. {d}. | lib/edit.ts | tests/matrix-time.test.ts, tests/matrix-ui.test.tsx |
| Nieprawidłowa godzina. Wpisz GG:MM, np. 18:00. | lib/edit.ts | tests/matrix-time.test.ts, tests/matrix-ui.test.tsx |
| Notatka do serii | app/history/edit/[id].tsx | tests/scenario-full.test.tsx |
| nowa | app/more/bands.tsx | tests/audit-backlog-r75.test.tsx, tests/audit-close-b.test.tsx, tests/audit-close2-c.test.tsx +31 |
| Nowe ćwiczenie | app/exercise/[id].tsx | tests/scenario-full.test.tsx |
| nowe ćwiczenie własne | app/picker.tsx | tests/matrix-logic.test.tsx, tests/regress.test.tsx |
| Nowe miejsce | app/more/locations.tsx | tests/scenario-full.test.tsx |
| Nowe rekordy: {n} | components/ActiveWorkout.tsx | tests/audit-records-misc.test.tsx |
| Nowy rekord! | components/ActiveWorkout.tsx | tests/audit-records-misc.test.tsx, .maestro/10-gumy.yaml |
| Nowy szablon | app/template/[id].tsx | tests/flows.test.tsx, tests/i18n-multi.test.ts, tests/matrix-ui.test.tsx +4 |
| obj. | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| objętość | app/history/[id].tsx | tests/audit-final-stats.test.ts, tests/audit-journey-a.test.tsx, tests/audit-r72-b.test.ts +22 |
| Objętość per partia ({u}) — ten tydzień vs poprzedni | app/more/progress.tsx | tests/scenario-full.test.tsx |
| Objętość serii roboczych (ciężar × powtórzenia × mnożnik ćwiczenia); partia główna liczy całość, pomocnicza połowę. Ćwiczenia bez ciężaru (masa ciała, gumy) się nie liczą. | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| Objętość tygodniowo ({u}) | app/more/progress.tsx | tests/scenario-full.test.tsx |
| Odhaczone są tylko serie rozgrzewkowe ({n}). Zapisać taki trening? | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Odhaczone serie bez ciężaru: {n}. | components/ActiveWorkout.tsx | tests/locations-verify3.test.tsx |
| Odhaczone serie bez czasu lub dystansu: {n}. | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Odhaczone serie bez powtórzeń: {n}. | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Odrzucić trening? | components/ActiveWorkout.tsx | tests/audit-close2-a.test.tsx, tests/matrix-ui.test.tsx, tests/regress.test.tsx |
| Odrzucić zmiany? | app/history/edit/[id].tsx | tests/edit-history.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Odznacz ciężary, których nie masz. Najwyżej {n} ciężarów. | components/LoadEditor.tsx | tests/locations-audit.test.tsx |
| Ogólne | app/more/settings.tsx | tests/phone-p1.test.tsx |
| Ostatnia rozgrzewka o {t}, bez serii roboczych. Kontynuować czy odrzucić? | lib/timer.ts | tests/matrix-ui.test.tsx |
| Ostatnia rozgrzewka o {t}, bez serii roboczych. Otwórz, by kontynuować albo odrzucić. | lib/timer.ts | tests/matrix-ui.test.tsx |
| Ostatnia seria o {t}. Otwórz, by zakończyć albo kontynuować. | lib/timer.ts | tests/matrix-ui.test.tsx |
| Ostatnia seria o {t}. Zakończyć trening z tą godziną końca? | lib/timer.ts | tests/matrix-ui.test.tsx |
| ostatnio | app/(tabs)/index.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx, tests/template-rows.test.tsx |
| Ostatnio {d}: | app/exercise/[id].tsx | tests/scenario-full.test.tsx |
| ostatnio {s} | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx, tests/template-rows.test.tsx |
| para: {a} ({r}); jeden hantel: {b} ({r1}) | components/LoadEditor.tsx | tests/locations-ui.test.tsx |
| Partia główna liczy 1 serię, pomocnicza 0,5 (np. wyciskanie: klatka 1, triceps i barki po 0,5). Partie ustawisz w edycji ćwiczenia. | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| Pierwszy raz? Utwórz swój szablon („+ Nowy szablon” niżej) albo zacznij pusty trening. Wpisuj ciężar i powtórzenia, odhaczaj serie ✓ — przerwa odlicza się sama. Na koniec „Zakończ trening i zapisz”. | app/(tabs)/index.tsx | tests/matrix-ui.test.tsx |
| Pierwszy raz? Wybierz szablon niżej, wpisz ciężar i powtórzenia, odhaczaj serie ✓ — przerwa odlicza się sama. Na koniec „Zakończ trening i zapisz”. Szablony i ćwiczenia zmienisz w zakładkach obok. | app/(tabs)/index.tsx | tests/matrix-ui.test.tsx |
| Plik ma schemat {a}, a ta wersja obsługuje do {b}. Zaktualizuj aplikację. | lib/backup.ts | tests/matrix-ui.test.tsx |
| Po ukryciu komunikatu kopii nie da się już wysłać z aplikacji — najpierw ją wyślij, jeśli jest potrzebna. | app/(tabs)/index.tsx | tests/matrix-ui.test.tsx |
| Podpis aplikacji wygasa dziś. | app/(tabs)/index.tsx | tests/matrix-ui.test.tsx |
| Podpis aplikacji wygasa za {n} {d}. | app/(tabs)/index.tsx | tests/matrix-ui.test.tsx |
| Podpis aplikacji wygasł — odnów w Sideloadly. | lib/signing.ts | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| Podpis aplikacji wygasł — zbuduj ją od nowa w GitHubie. | lib/signing.ts | tests/audit-r83.test.tsx |
| Podpis ważny do {d}. | app/(tabs)/more.tsx | tests/matrix-ui.test.tsx |
| Pokazano {n} z {m} — wpisz nazwę, by zawęzić. | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| Pokaż inne ćwiczenia | app/swap.tsx | tests/backlog-0410.test.tsx, tests/catalog-full.test.tsx, tests/matrix-logic.test.tsx +4 |
| pomocnicza | app/exercise/[id].tsx | tests/catalog-v2.test.ts, tests/logic.test.ts, tests/matrix-dim-catalog.test.tsx +2 |
| Poprawka zapisu: wszystkie serie bloku „{name}” przejdą pod wybrane ćwiczenie (wartości bez zmian). | app/swap.tsx | tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx |
| poprz. | app/more/progress.tsx | tests/scenario-full.test.tsx |
| Poprzednio | app/template/[id].tsx | tests/audit-final2-auto.test.ts, tests/audit-r72-b.test.ts, tests/audit-r72-d.test.ts +25 |
| Poprzednio: {l} | components/ActiveWorkout.tsx | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/decisions-0310.test.tsx +4 |
| pow. | app/history/[id].tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx, tests/stats.test.ts +2 |
| Pow. | app/history/edit/[id].tsx | tests/matrix-ui.test.tsx |
| Powiadomienia | app/more/settings.tsx | tests/matrix-ui.test.tsx, tests/phone-p1.test.tsx, tests/scenario-full.test.tsx |
| Powiadomienia działają | app/more/settings.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| powtórzenia do | app/template/[id].tsx | tests/scenario-full.test.tsx, .maestro/08-szablon-wiersze.yaml |
| powtórzenia od | app/template/[id].tsx | tests/scenario-full.test.tsx, tests/template-rows.test.tsx, .maestro/08-szablon-wiersze.yaml |
| poziom {n} | app/more/location/[id].tsx | tests/audit-r83.test.tsx, tests/band-exercises.test.tsx, tests/flows.test.tsx +10 |
| Poziomy gum, które masz w tym miejscu (1 = cienka, 7 = bardzo gruba). | app/more/location/[id].tsx | tests/matrix-ui.test.tsx |
| Propozycje | app/swap.tsx | tests/maestro-failures.test.ts, tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx +2 |
| Przeciągnij za ≡, żeby zmienić kolejność. Superset przesuwa się w całości; kolejność w nim zmienisz uchwytami przy ćwiczeniach. | app/reorder.tsx | tests/matrix-ui.test.tsx |
| przerwa | app/history/[id].tsx | tests/audit-io-flows.test.tsx, tests/audit-r72-d.test.ts, tests/audit-r83.test.tsx +24 |
| Przerwa | lib/timer.ts | tests/audit-io-flows.test.tsx, tests/matrix-ui.test.tsx, tests/regress.test.tsx +4 |
| Przerwa (sekundy) | components/ActiveWorkout.tsx | tests/regress.test.tsx, tests/scenario-full.test.tsx |
| przerwa {s} | app/(tabs)/_layout.tsx | tests/audit-io-flows.test.tsx, tests/audit-r72-d.test.ts, tests/audit-r83.test.tsx +24 |
| przerwa {s} s | lib/timer.ts | tests/audit-io-flows.test.tsx, tests/audit-r72-d.test.ts, tests/audit-r83.test.tsx +24 |
| przerwa minęła | components/ActiveWorkout.tsx | tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx |
| Przerwa minęła | lib/timer.ts | tests/audit-io-flows.test.tsx, tests/matrix-ui.test.tsx |
| przerwa z {s} | components/ActiveWorkout.tsx | tests/flows.test.tsx, tests/matrix-ui.test.tsx, tests/regress.test.tsx +3 |
| Przesuń niżej | components/DragList.tsx | tests/template-cards.test.tsx |
| Przesuń wyżej | components/DragList.tsx | tests/reorder-t010.test.tsx, tests/template-cards.test.tsx |
| przyrząd: {impl} | components/ActiveWorkout.tsx | tests/audit-r82b.test.tsx, tests/matrix-invariants.test.ts, tests/matrix-logic.test.tsx +3 |
| REKORDY | app/more/progress.tsx | tests/audit-records-ui.test.tsx, tests/scenario-full.test.tsx |
| robione {n}× | lib/swap.ts | tests/audit-r82.test.tsx |
| sek. | app/history/edit/[id].tsx | tests/matrix-ui.test.tsx |
| Seria | lib/timer.ts | tests/audit-close-b.test.tsx, tests/audit-close2-a.test.tsx, tests/audit-close2-b.test.tsx +24 |
| seria · bez celu | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| seria · cel {s} | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| seria {n} | components/ActiveWorkout.tsx | tests/audit-backlog-q.test.tsx, tests/audit-backlog-r75.test.tsx, tests/audit-close2-b.test.tsx +45 |
| Seria {n} | app/history/edit/[id].tsx | tests/audit-close-b.test.tsx, tests/audit-close2-a.test.tsx, tests/audit-close2-b.test.tsx +24 |
| Seria {n} — {ex} | app/history/edit/[id].tsx | tests/audit-close-b.test.tsx, tests/audit-close2-a.test.tsx, tests/audit-close2-b.test.tsx +24 |
| seria {s} s | lib/timer.ts | tests/audit-backlog-q.test.tsx, tests/audit-backlog-r75.test.tsx, tests/audit-close2-b.test.tsx +45 |
| Seria jest już odhaczona. | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Seria skończona | lib/timer.ts | tests/matrix-ui.test.tsx |
| Serie bez ciężaru: {n}. | app/history/edit/[id].tsx | tests/integration-090.test.tsx |
| Serie bez wyniku zostaną pominięte: {n}. | app/history/edit/[id].tsx | tests/edit-history.test.tsx, tests/scenario-full.test.tsx |
| Serie per partia — ten tydzień vs poprzedni | app/more/progress.tsx | tests/scenario-full.test.tsx |
| Serie robocze tygodniowo | app/more/progress.tsx | tests/scenario-full.test.tsx |
| Serie z tej sesji przepadną. | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Sesja | app/_layout.tsx | tests/matrix-invariants.test.ts, tests/scenario-full.test.tsx |
| Sesja w historii zostanie bez zmian. | app/history/edit/[id].tsx | tests/scenario-full.test.tsx |
| Sesje | app/more/progress.tsx | tests/audit-records-ui.test.tsx, tests/scenario-full.test.tsx |
| Sprawdź datę i godzinę | app/history/add.tsx | tests/edit-history.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Spróbuj ponownie | app/_layout.tsx | tests/matrix-ui.test.tsx, tests/splash-start-error.test.tsx |
| Spróbuj ponownie. | app/(tabs)/index.tsx | tests/matrix-ui.test.tsx |
| sprzęt w domu, na siłowni, w hotelu… | app/more/settings.tsx | tests/scenario-full.test.tsx, .maestro/06-miejsca.yaml |
| stabilizacja | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| stacja | lib/swap.ts | tests/audit-r82c.test.tsx, tests/catalog-v2.test.ts, tests/decisions-0310.test.tsx +15 |
| start | components/ActiveWorkout.tsx | tests/app.tsx, tests/audit-backlog-q.test.tsx, tests/audit-backlog-r75.test.tsx +105 |
| Start stopera serii | components/ActiveWorkout.tsx | tests/audit-close-b.test.tsx, tests/audit-close-c.test.tsx, tests/audit-close2-a.test.tsx +15 |
| Stoper trwa | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| suma pow. | lib/stats.ts | tests/stats.test.ts |
| superset | app/reorder.tsx | tests/audit-close-d.test.ts, tests/audit-final-ss.test.ts, tests/audit-final-timer.test.tsx +18 |
| superset · przerwa po rundzie {t} | components/ActiveWorkout.tsx | tests/scenario-full.test.tsx |
| Szablon | app/_layout.tsx | tests/audit-persist.test.ts, tests/audit-r83.test.tsx, tests/brand-kreda.test.tsx +12 |
| Szablony | app/(tabs)/_layout.tsx | tests/audit-persist.test.ts, tests/brand-kreda.test.tsx, tests/edit-history.test.tsx +9 |
| sztanga | lib/swap.ts | tests/audit-backlog-q.test.tsx, tests/audit-backlog-r75.test.tsx, tests/audit-close-a.test.ts +56 |
| tak — przy serii wybierasz gumę | app/exercise/[id].tsx | tests/scenario-full.test.tsx |
| Talerze: ciężar i liczba sztuk (wszystkie, dla obu hantli razem). | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Talerze: ciężar i liczba sztuk (wszystkie, na obie strony razem). | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Tapnij numer serii, by zmienić typ (W, D, F) albo dodać notatkę. Serie bez wyniku nie zostaną zapisane. | app/history/edit/[id].tsx | tests/matrix-ui.test.tsx |
| Tapnij, by spróbować ponownie. Zrób też backup. | app/(tabs)/index.tsx | tests/matrix-ui.test.tsx |
| Tapnij, by wybrać inne ćwiczenie. | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| te same mięśnie | lib/swap.ts | tests/matrix-ui.test.tsx |
| Tego ćwiczenia nie da się już zamienić. | app/swap.tsx | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| Tej sesji nie ma już w historii. | lib/edit.ts | tests/edit-history.test.tsx |
| tempo | app/(tabs)/exercises.tsx | tests/audit-close2-a.test.tsx, tests/audit-close2-b.test.tsx, tests/audit-close2-c.test.tsx +10 |
| ten sam ruch | lib/swap.ts | tests/scenario-full.test.tsx, tests/swap-logic.test.ts, tests/swap-top3.test.ts +1 |
| Ten sam ruch, inny przyrząd | app/swap.tsx | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx +1 |
| Ten termin nachodzi na sesję „{name}” ({d}). | app/history/edit/[id].tsx | tests/matrix-ui.test.tsx |
| Ten termin nachodzi na trening w toku (start {t}). Wybierz wcześniejszy. | lib/edit.ts | tests/matrix-ui.test.tsx |
| Ten trening nie zostanie zapisany. | app/history/edit/[id].tsx | tests/matrix-ui.test.tsx |
| Timer odlicza w aplikacji, a na koniec przerwy przychodzi powiadomienie — także przy zablokowanym telefonie. | app/more/settings.tsx | tests/matrix-ui.test.tsx |
| To miejsce główne | app/more/location/[id].tsx | tests/locations-ui.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| To nie wygląda na backup z tej apki | app/more/backup.tsx | tests/scenario-full.test.tsx |
| trap bar | lib/swap.ts | tests/bar-no-plates.test.tsx, tests/xcheck-0610b.test.tsx |
| Trening rozpoczęty o {t}, bez odhaczonych serii. Kontynuować czy odrzucić? | lib/timer.ts | tests/matrix-ui.test.tsx |
| Trening rozpoczęty o {t}, bez odhaczonych serii. Otwórz, by kontynuować albo odrzucić. | lib/timer.ts | tests/matrix-ui.test.tsx |
| Trening w toku | app/template/[id].tsx | tests/audit-persist.test.ts, tests/audit-r83.test.tsx, tests/matrix-ui.test.tsx +1 |
| Trening w toku zapisuje się na bieżąco. Tapnij numer serii, by oznaczyć rozgrzewkę (W), drop set (D), serię do upadku (F) albo dodać notatkę. | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Trening wciąż trwa | components/ActiveWorkout.tsx | tests/audit-backlog-q.test.tsx, tests/audit-close-c.test.tsx, tests/audit-close2-a.test.tsx +7 |
| Trening wstecz | app/_layout.tsx | tests/scenario-full.test.tsx, .maestro/05-edycja-historii.yaml |
| Trening z {d} {s} nie miał aktywności od 6 godzin, więc zapisał się sam. Koniec: {e} (ostatnia seria). Znajdziesz go w Historii. | app/_layout.tsx | tests/matrix-ui.test.tsx |
| Trening, którego nie zapisałeś na bieżąco. Ustaw termin i wybierz szablon — serie uzupełnisz w następnym kroku (wartości z ostatniego treningu przed tą datą). | app/history/add.tsx | tests/matrix-ui.test.tsx |
| Treningi i szablony z tym miejscem pokażą „(usunięte miejsce)”. | app/more/location/[id].tsx | tests/matrix-ui.test.tsx |
| Tygodnie od poniedziałku. Objętość = ciężar × powtórzenia × mnożnik ćwiczenia; rozgrzewka poza. | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| tylko dostępne w: {l} | app/picker.tsx | tests/integration-090.test.tsx, tests/locations-ui.test.tsx, tests/scenario-full.test.tsx +1 |
| Tylko rozgrzewka | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx, tests/regress.test.tsx |
| Uchwyt (jeden, {u}) | components/LoadEditor.tsx | tests/scenario-full.test.tsx |
| ukryte: {n} | app/picker.tsx | tests/locations-ui.test.tsx, tests/scenario-full.test.tsx |
| Ustawienia na stronę: {n} ({r}) | components/LoadEditor.tsx | tests/locations-ui.test.tsx |
| Usunąć ćwiczenie? | app/exercise/[id].tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx, tests/ux.test.tsx |
| Usunąć gumę? | app/more/bands.tsx | tests/audit-r83.test.tsx, tests/audit-records-misc.test.tsx, tests/matrix-ui.test.tsx +3 |
| Usunąć miejsce? | app/more/location/[id].tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Usunąć ostatnią serię? | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Usunąć serię? | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Usunąć szablon? | app/template/[id].tsx | tests/scenario-full.test.tsx, tests/ux.test.tsx |
| Usunąć tę sesję z historii? | app/history/[id].tsx | tests/matrix-ui.test.tsx, tests/regress.test.tsx, tests/scenario-full.test.tsx |
| Usunąć z szablonu? | app/template/[id].tsx | tests/flows.test.tsx, tests/regress.test.tsx, tests/scenario-full.test.tsx +1 |
| Usunąć z treningu? | app/history/edit/[id].tsx | tests/edit-history.test.tsx, tests/regress.test.tsx, tests/scenario-full.test.tsx +1 |
| Usunąć zamiennik? | app/template/[id].tsx | tests/swap-alternates.test.tsx |
| Usunie ćwiczenia, szablony i całą historię oraz przywróci ustawienia domyślne (także miejsca, sprzęt i gumy). Przedtem obecne dane zapiszą się jako kopia w Plikach: {app} → Backup (można ją zaimportować). | app/more/settings.tsx | tests/matrix-ui.test.tsx |
| usunięte | app/history/edit/[id].tsx | tests/audit-backlog-r75.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx +21 |
| Usunięte ćwiczenie | app/history/edit/[id].tsx | tests/matrix-logic.test.tsx, tests/swap-ui.test.tsx |
| usunięte ćwiczenie (w bieżącym treningu) | app/(tabs)/exercises.tsx | tests/matrix-logic.test.tsx, tests/regress.test.tsx |
| usunięte ćwiczenie z historią | app/(tabs)/exercises.tsx | tests/logic.test.ts, tests/matrix-logic.test.tsx, tests/regress.test.tsx +1 |
| Usuń talerz | components/LoadEditor.tsx | tests/scenario-full.test.tsx |
| Uwaga: zmiana sprzętu, trybu liczenia lub metryki przelicza też dawne treningi (objętość, rekordy, wykresy). | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| W historii serie z tą gumą pokażą „?”. | app/more/bands.tsx | tests/matrix-ui.test.tsx |
| W trwającym treningu guma zniknie z nieodhaczonych serii. | app/more/bands.tsx | tests/matrix-ui.test.tsx |
| W trwającym treningu zostanie oznaczone jako usunięte. | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| wcześniej zamieniane | lib/swap.ts | tests/swap-logic.test.ts, tests/swap-top3.test.ts |
| Więcej | app/(tabs)/_layout.tsx | tests/audit-r83.test.tsx, tests/matrix-a11y.test.tsx, tests/matrix-dim-langs1.test.tsx +11 |
| Włącz powiadomienia dla {app} w Ustawieniach iOS. | app/more/settings.tsx | tests/matrix-ui.test.tsx |
| Wpisane wartości zamiennika przepadną. | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| wpisz uchwyt i talerze | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| wpisz zakres na stronę i krok | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Wstaw ciężary modelu | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Wybierz ćwiczenie | app/_layout.tsx | tests/matrix-ui.test.tsx |
| wyciąg | lib/swap.ts | tests/catalog-full.test.tsx, tests/decisions-0310.test.tsx, tests/locations-audit.test.tsx +4 |
| Wykres, {n} {s}: od {a} ({x}) do {b} ({y}), najlepiej {c} ({z}). | components/Chart.tsx | tests/matrix-ui.test.tsx |
| Wykresy pojawią się po pierwszym zakończonym treningu. | app/more/progress.tsx | tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx, tests/matrix-dim-langs3.test.tsx +2 |
| Wypełnij zakresem | components/LoadEditor.tsx | tests/audit-r82c.test.tsx, tests/locations-audit.test.tsx, tests/locations-ui.test.tsx +2 |
| Wyświetlane jako: {n} | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| Z szablonu | app/history/add.tsx | .maestro/05-edycja-historii.yaml |
| Za dużo ciężarów (najwyżej {n}). | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Za dużo kombinacji talerzy — ciężary nie są liczone. Usuń nietypowe talerze. | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Za dużo rodzajów talerzy (najwyżej {n}). | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Za dużo ustawień (najwyżej {n}) — zwiększ krok. | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Zacznij z szablonu | app/(tabs)/index.tsx | tests/edit-history.test.tsx, tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx +6 |
| Zaimportowano | app/more/backup.tsx | tests/scenario-full.test.tsx |
| Zakończyć trening? | components/ActiveWorkout.tsx | tests/audit-backlog-r75.test.tsx, tests/audit-close2-b.test.tsx, tests/audit-journey-a.test.tsx +12 |
| Zakres jest niepoprawny: „do” musi być ≥ „od”, krok > 0, wartości od {a} do {b}. | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Zakres jest niepoprawny: „max” musi być ≥ „min”, krok > 0. Ciężary nie są liczone. | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Zakres powtórzeń: {r} — po osiągnięciu górnej granicy podpowiedź „↑ więcej {u}”. | app/template/[id].tsx | tests/matrix-ui.test.tsx |
| Zamiana tylko w tym treningu: {name} | app/swap.tsx | tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx |
| zamiast: {name} | app/swap.tsx | tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx, tests/swap-ui.test.tsx +1 |
| Zamienniki | app/template/[id].tsx | tests/matrix-ui.test.tsx |
| Zamień ćwiczenie | app/_layout.tsx | tests/backlog-0410.test.tsx, tests/catalog-full.test.tsx, tests/matrix-ui.test.tsx +5 |
| Zapamiętać dla tego ćwiczenia? | components/ActiveWorkout.tsx | tests/scenario-full.test.tsx |
| Zapisać zmiany? | app/history/edit/[id].tsx | tests/edit-history.test.tsx, tests/integration-090.test.tsx, tests/matrix-ui.test.tsx +2 |
| Zapisałem trening | app/_layout.tsx | tests/app.tsx, tests/audit-close2-a.test.tsx, tests/audit-final2-fg.test.tsx +2 |
| Zapisane zostaną serie robocze: {n}. | components/ActiveWorkout.tsx | tests/scenario-full.test.tsx |
| Zapisany czas zostanie nadpisany. | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Zapisuje zamiennik w szablonie dla tego miejsca. | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Zastąpić wpisane ciężary? | components/LoadEditor.tsx | tests/locations-audit.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Zmiany nie trafiają do Apple Health. | app/history/edit/[id].tsx | tests/edit-history.test.tsx |
| Zmierzyć serię od nowa? | components/ActiveWorkout.tsx | tests/audit-close-b.test.tsx, tests/audit-close2-c.test.tsx, tests/audit-final-timer.test.tsx +4 |
| Zniknie z list i szablonów; historia, wykresy i eksport zostaną. | app/exercise/[id].tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Zniknie z list i szablonów. | app/exercise/[id].tsx | tests/scenario-full.test.tsx |
| Zrób backup (Więcej → Backup) i odnów w Sideloadly. Dane zostają. | lib/signing.ts | tests/audit-r83.test.tsx |
| Zrób backup (Więcej → Backup) i zbuduj aplikację od nowa w GitHubie: iPhone (EAS) → build. Dane zostają. | lib/signing.ts | tests/audit-r83.test.tsx, tests/matrix-logic.test.tsx |
| Zrób backup i odnów w Sideloadly (ok. 2 min). Dane zostają w telefonie. | lib/signing.ts | tests/audit-r83.test.tsx |
| Zrób backup, potem w GitHubie: Actions → iPhone (EAS) → build i zainstaluj z linku. Dane zostają w telefonie. | lib/signing.ts | tests/audit-r83.test.tsx |
| Zwiń inne ćwiczenia | app/swap.tsx | tests/catalog-full.test.tsx, tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| Zwykle w: {l} — {name}. Zamienić? | components/ActiveWorkout.tsx | tests/scenario-full.test.tsx, tests/swap-alternates.test.tsx, .maestro/07-zamiana.yaml |

## LOGIKA

| Pozycja | Źródło | Testy (pierwsze 3) |
|---|---|---|
| backup.buildBackup | lib/backup.ts | tests/audit-close-d.test.ts, tests/audit-io-flows.test.tsx, tests/audit-io-more.test.tsx +22 |
| backup.exportBackup | lib/backup.ts | tests/matrix-logic.test.tsx |
| backup.autoBackup | lib/backup.ts | tests/audit-backlog-r75.test.tsx, tests/audit-r83.test.tsx, tests/audit-r83b.test.tsx +6 |
| backup.safetyBackup | lib/backup.ts | tests/audit-r83b.test.tsx, tests/matrix-logic.test.tsx |
| backup.safetyRecoveryNote | lib/backup.ts | tests/matrix-logic.test.tsx |
| backup.isSafetyError | lib/backup.ts | tests/matrix-logic.test.tsx |
| backup.onWorkoutSaved | lib/backup.ts | tests/audit-backlog-r75.test.tsx |
| backup.onHistoryEdited | lib/backup.ts | tests/matrix-logic.test.tsx |
| backup.buildCsv | lib/backup.ts | tests/audit-backlog-q.test.tsx, tests/audit-close-d.test.ts, tests/audit-io-flows.test.tsx +18 |
| backup.exportCsv | lib/backup.ts | tests/audit-backlog-q.test.tsx |
| backup.parseBackup | lib/backup.ts | tests/audit-close-d.test.ts, tests/audit-io-flows.test.tsx, tests/audit-io-more.test.tsx +25 |
| backup.recheckHealthAfterImport | lib/backup.ts | tests/audit-io-flows.test.tsx |
| backup.importBackup | lib/backup.ts | tests/audit-journey-c.test.tsx |
| backup.exportRecovery | lib/backup.ts | tests/matrix-logic.test.tsx |
| edit.touchDraft | lib/edit.ts | tests/edit-history.test.tsx, tests/integration-090.test.tsx, tests/matrix-invariants.test.ts +1 |
| edit.useDraftTick | lib/edit.ts | tests/matrix-logic.test.tsx |
| edit.draftOf | lib/edit.ts | tests/audit-r83b.test.tsx, tests/backlog-0410.test.tsx, tests/edit-history.test.tsx +3 |
| edit.discardDraft | lib/edit.ts | tests/edit-history.test.tsx, tests/matrix-invariants.test.ts, tests/matrix-logic.test.tsx +2 |
| edit.dateText | lib/edit.ts | tests/edit-history.test.tsx, tests/integration-090.test.tsx, tests/matrix-time.test.ts +1 |
| edit.timeText | lib/edit.ts | tests/edit-history.test.tsx, tests/matrix-time.test.ts, tests/matrix-ui.test.tsx |
| edit.minText | lib/edit.ts | tests/matrix-logic.test.tsx |
| edit.isDirty | lib/edit.ts | tests/matrix-logic.test.tsx |
| edit.beginEdit | lib/edit.ts | tests/audit-r83b.test.tsx, tests/decisions-0310.test.tsx, tests/edit-history.test.tsx +6 |
| edit.defaultPastWhen | lib/edit.ts | tests/edit-history.test.tsx, tests/matrix-time.test.ts |
| edit.beginPast | lib/edit.ts | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx +10 |
| edit.prefilledOffList | lib/edit.ts | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx |
| edit.draftSetWhen | lib/edit.ts | tests/edit-history.test.tsx, tests/integration-090.test.tsx, tests/matrix-invariants.test.ts +1 |
| edit.draftAddExercise | lib/edit.ts | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/decisions-0310.test.tsx +7 |
| edit.draftAddSet | lib/edit.ts | tests/edit-history.test.tsx, tests/matrix-invariants.test.ts, tests/matrix-logic.test.tsx +2 |
| edit.draftRemoveSet | lib/edit.ts | tests/edit-history.test.tsx, tests/matrix-invariants.test.ts |
| edit.draftRemoveExercise | lib/edit.ts | tests/edit-history.test.tsx, tests/matrix-invariants.test.ts |
| edit.swapTargetOk | lib/edit.ts | tests/matrix-invariants.test.ts, tests/swap-history.test.tsx |
| edit.draftSwapExercise | lib/edit.ts | tests/matrix-invariants.test.ts, tests/swap-history.test.tsx |
| edit.canRestoreExercise | lib/edit.ts | tests/swap-history.test.tsx |
| edit.draftRestoreExercise | lib/edit.ts | tests/swap-history.test.tsx |
| edit.draftImplChoices | lib/edit.ts | tests/swap-history.test.tsx |
| edit.draftSetImpl | lib/edit.ts | tests/swap-history.test.tsx |
| edit.shiftDate | lib/edit.ts | tests/edit-history.test.tsx, tests/matrix-logic.test.tsx, tests/matrix-time.test.ts |
| edit.parseWhen | lib/edit.ts | tests/edit-history.test.tsx, tests/matrix-time.test.ts |
| edit.activeOverlapError | lib/edit.ts | tests/edit-history.test.tsx |
| edit.checkDraft | lib/edit.ts | tests/audit-r83b.test.tsx, tests/edit-history.test.tsx, tests/integration-090.test.tsx +3 |
| edit.commitDraft | lib/edit.ts | tests/decisions-0310.test.tsx, tests/edit-history.test.tsx, tests/integration-090.test.tsx +5 |
| edit.__resetDrafts | lib/edit.ts | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx +7 |
| equipment.capLabel | lib/equipment.ts | tests/matrix-logic.test.tsx |
| equipment.equipById | lib/equipment.ts | tests/bar-no-plates.test.tsx, tests/locations-catalog.test.ts, tests/matrix-dim-catalog.test.tsx +9 |
| equipment.equipLabel | lib/equipment.ts | tests/app.tsx, tests/locations-audit.test.tsx, tests/matrix-dim-catalog.test.tsx +7 |
| equipment.blankLoad | lib/equipment.ts | tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-equipment.test.tsx, tests/matrix-dim-langs1.test.tsx +6 |
| equipment.applyLoadPreset | lib/equipment.ts | tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-equipment.test.tsx, tests/matrix-dim-langs1.test.tsx +6 |
| equipment.equipEntry | lib/equipment.ts | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx +16 |
| equipment.presetEquipment | lib/equipment.ts | tests/catalog-full.test.tsx, tests/catalog-v2.test.ts, tests/locations-audit.test.tsx +14 |
| equipment.fillOpts | lib/equipment.ts | tests/matrix-logic.test.tsx |
| equipment.fillGym | lib/equipment.ts | tests/matrix-logic.test.tsx |
| equipment.allLabels | lib/equipment.ts | tests/i18n-locales.test.ts |
| equipment.capsOf | lib/equipment.ts | tests/catalog-full.test.tsx, tests/catalog-v2.test.ts, tests/locations-catalog.test.ts +9 |
| equipment.availability | lib/equipment.ts | tests/catalog-full.test.tsx, tests/catalog-v2.test.ts, tests/locations-audit.test.tsx +12 |
| equipment.missingLabel | lib/equipment.ts | tests/locations-catalog.test.ts |
| equipment.loadKindsFor | lib/equipment.ts | tests/locations-catalog.test.ts, tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-equipment.test.tsx +7 |
| equipment.loadsFor | lib/equipment.ts | tests/audit-r82b.test.tsx, tests/bar-no-plates.test.tsx, tests/catalog-v2.test.ts +14 |
| equipment.implAt | lib/equipment.ts | tests/decisions-0310.test.tsx, tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-equipment.test.tsx +7 |
| equipment.implsAt | lib/equipment.ts | tests/catalog-v2.test.ts, tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-equipment.test.tsx +8 |
| health.ensureAuthorization | lib/health.ts | tests/regress.test.tsx |
| health.saveWorkout | lib/health.ts | tests/edit-history.test.tsx, tests/regress.test.tsx, tests/swap-history.test.tsx |
| health.syncAfterFinish | lib/health.ts | tests/audit-io-more.test.tsx, tests/swap-history.test.tsx |
| i18n.isLang | lib/i18n.ts | tests/matrix-logic.test.tsx |
| i18n.detectLang | lib/i18n.ts | tests/matrix-logic.test.tsx |
| i18n.applyLang | lib/i18n.ts | tests/audit-ac5d764.test.tsx, tests/catalog-v2.test.ts, tests/i18n-locales.test.ts +16 |
| i18n.lang | lib/i18n.ts | tests/helpers.ts, tests/i18n-locales.test.ts, tests/i18n-multi.test.ts +12 |
| i18n.appName | lib/i18n.ts | tests/i18n-locales.test.ts |
| i18n.locale | lib/i18n.ts | tests/app.tsx, tests/audit-ac5d764.test.tsx, tests/audit-close2-b.test.tsx +16 |
| i18n.decimalComma | lib/i18n.ts | tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-equipment.test.tsx, tests/matrix-dim-langs1.test.tsx +6 |
| i18n.t | lib/i18n.ts | tests/audit-backlog-q.test.tsx, tests/audit-close2-b.test.tsx, tests/audit-journey-b.test.tsx +63 |
| i18n.lbl | lib/i18n.ts | tests/audit-close2-b.test.tsx, tests/audit-journey-c.test.tsx, tests/audit-journey-d.test.tsx +9 |
| i18n.tp | lib/i18n.ts | tests/edit-history.test.tsx, tests/i18n-multi.test.ts, tests/invariants.test.ts +4 |
| i18n.exName | lib/i18n.ts | tests/audit-close2-a.test.tsx, tests/audit-close2-b.test.tsx, tests/audit-final-auto.test.tsx +23 |
| i18n.fold | lib/i18n.ts | tests/catalog-v2.test.ts, tests/i18n-multi.test.ts |
| i18n.tIn | lib/i18n.ts | tests/i18n-multi.test.ts, tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-equipment.test.tsx +6 |
| loads.toKg | lib/loads.ts | tests/locations-audit.test.tsx, tests/locations-loads.test.ts, tests/matrix-dim-catalog.test.tsx |
| loads.rangeCount | lib/loads.ts | tests/locations-verify2.test.tsx |
| loads.rangeValues | lib/loads.ts | tests/locations-audit.test.tsx, tests/locations-loads.test.ts, tests/locations-verify2.test.tsx +1 |
| loads.fillRange | lib/loads.ts | tests/locations-audit.test.tsx, tests/locations-loads.test.ts, tests/locations-verify2.test.tsx |
| loads.plateSums | lib/loads.ts | tests/locations-audit.test.tsx, tests/locations-loads.test.ts |
| loads.validateSpec | lib/loads.ts | tests/locations-audit.test.tsx, tests/locations-verify2.test.tsx, tests/matrix-dim-catalog.test.tsx +7 |
| loads.specValues | lib/loads.ts | tests/locations-loads.test.ts, tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-equipment.test.tsx +6 |
| loads.noPlates | lib/loads.ts | tests/bar-no-plates.test.tsx |
| loads.achievable | lib/loads.ts | tests/decisions-0310.test.tsx, tests/locations-audit.test.tsx, tests/locations-catalog.test.ts +3 |
| loads.convertSpec | lib/loads.ts | tests/locations-audit.test.tsx, tests/locations-verify2.test.tsx, tests/locations-verify3.test.tsx |
| loads.sameLoad | lib/loads.ts | tests/locations-loads.test.ts |
| loads.hasLoad | lib/loads.ts | tests/audit-backlog-q.test.tsx, tests/audit-perf-equiv.test.ts, tests/audit-r82b.test.tsx +4 |
| loads.hasLoadShown | lib/loads.ts | tests/audit-r82b.test.tsx |
| loads.nextHeavier | lib/loads.ts | tests/decisions-0310.test.tsx, tests/locations-loads.test.ts |
| loads.roundDown | lib/loads.ts | tests/locations-loads.test.ts |
| loads.sanitizeLoadSpec | lib/loads.ts | tests/locations-audit.test.tsx, tests/locations-loads.test.ts, tests/matrix-ui.test.tsx |
| locations.addLocation | lib/locations.ts | tests/band-exercises.test.tsx, tests/bar-no-plates.test.tsx, tests/decisions-0310.test.tsx +20 |
| locations.setMainLocation | lib/locations.ts | tests/locations-model.test.ts, tests/locations-verify3.test.tsx, tests/matrix-invariants.test.ts |
| locations.renameLocation | lib/locations.ts | tests/locations-audit.test.tsx, tests/matrix-invariants.test.ts |
| locations.commitLocationName | lib/locations.ts | tests/matrix-invariants.test.ts, tests/matrix-logic.test.tsx |
| locations.duplicateLocation | lib/locations.ts | tests/locations-model.test.ts, tests/matrix-invariants.test.ts |
| locations.canDeleteLocation | lib/locations.ts | tests/matrix-invariants.test.ts, tests/matrix-logic.test.tsx |
| locations.deleteLocation | lib/locations.ts | tests/audit-r82c.test.tsx, tests/integration-090.test.tsx, tests/locations-model.test.ts +3 |
| locations.locationEdited | lib/locations.ts | tests/matrix-logic.test.tsx |
| locations.equipOf | lib/locations.ts | tests/locations-model.test.ts, tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-equipment.test.tsx +6 |
| locations.activeEquip | lib/locations.ts | tests/locations-model.test.ts, tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-equipment.test.tsx +9 |
| locations.setEquip | lib/locations.ts | tests/audit-r82c.test.tsx, tests/band-exercises.test.tsx, tests/bar-no-plates.test.tsx +14 |
| locations.setOpt | lib/locations.ts | tests/locations-model.test.ts, tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-equipment.test.tsx +8 |
| locations.setBandLevel | lib/locations.ts | tests/band-exercises.test.tsx, tests/matrix-invariants.test.ts, tests/owner-0510c.test.tsx +1 |
| locations.setBandColor | lib/locations.ts | tests/matrix-invariants.test.ts, tests/owner-0510c.test.tsx |
| locations.setLoad | lib/locations.ts | tests/audit-perf-equiv.test.ts, tests/audit-r82c.test.tsx, tests/audit-r83.test.tsx +11 |
| locations.locationLabel | lib/locations.ts | tests/locations-model.test.ts |
| plural.pluralIndex | lib/plural.ts | tests/i18n-multi.test.ts |
| seed.hasTime | lib/seed.ts | tests/audit-perf-equiv.test.ts, tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-equipment.test.tsx +8 |
| seed.hasReps | lib/seed.ts | tests/audit-perf-equiv.test.ts, tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-equipment.test.tsx +7 |
| seed.hasWeight | lib/seed.ts | tests/audit-perf-equiv.test.ts, tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-equipment.test.tsx +6 |
| seed.hasDistance | lib/seed.ts | tests/audit-perf-equiv.test.ts, tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-equipment.test.tsx +7 |
| seed.loadModeFor | lib/seed.ts | tests/catalog-v2.test.ts |
| seed.loadMult | lib/seed.ts | tests/matrix-logic.test.tsx |
| seed.uid | lib/seed.ts | tests/fixtures/demo-templates.ts, tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-equipment.test.tsx +7 |
| seed.base | lib/seed.ts | tests/audit-perf-equiv.test.ts, tests/audit-r72-a.test.ts, tests/audit-records-logic.test.ts +15 |
| seed.defaultModules | lib/seed.ts | tests/matrix-logic.test.tsx |
| seed.muscleLoadOf | lib/seed.ts | tests/catalog-v2.test.ts, tests/matrix-ui.test.tsx |
| seed.libExtraRevOf | lib/seed.ts | tests/swap-logic.test.ts |
| seed.metricFor | lib/seed.ts | tests/catalog-v2.test.ts, tests/ux.test.tsx |
| seed.musclesFor | lib/seed.ts | tests/catalog-v2.test.ts |
| seed.equipFields | lib/seed.ts | tests/locations-catalog.test.ts |
| seed.blankTimer | lib/seed.ts | tests/matrix-invariants.test.ts, tests/matrix-logic.test.tsx |
| seed.defaultSettings | lib/seed.ts | tests/theme-choice.test.tsx |
| seed.libExercise | lib/seed.ts | tests/matrix-logic.test.tsx |
| seed.seedState | lib/seed.ts | tests/audit-persist.test.ts, tests/audit-r72-c.test.ts, tests/catalog-full.test.tsx +21 |
| signing.decodeB64 | lib/signing.ts | tests/audit-r83.test.tsx, tests/logic.test.ts |
| signing.parseExpiry | lib/signing.ts | tests/logic.test.ts |
| signing.parseTaskAllow | lib/signing.ts | tests/audit-r83b.test.tsx |
| signing.parseRenewKind | lib/signing.ts | tests/audit-r83.test.tsx, tests/audit-r83b.test.tsx |
| signing.renewTexts | lib/signing.ts | tests/matrix-logic.test.tsx |
| signing.getProfileInfo | lib/signing.ts | tests/matrix-logic.test.tsx |
| signing.getProfileExpiry | lib/signing.ts | tests/matrix-logic.test.tsx |
| signing.__resetSigningCache | lib/signing.ts | tests/audit-r83.test.tsx, tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| signing.signingState | lib/signing.ts | tests/matrix-logic.test.tsx |
| signing.calendarDaysLeft | lib/signing.ts | tests/matrix-time.test.ts, tests/matrix-ui.test.tsx, tests/regress.test.tsx |
| signing.reminderAt | lib/signing.ts | tests/matrix-time.test.ts, tests/regress.test.tsx |
| signing.scheduleReminder | lib/signing.ts | tests/audit-r83.test.tsx |
| stats.e1rm | lib/stats.ts | tests/audit-perf-equiv.test.ts, tests/audit-r83b.test.tsx, tests/logic.test.ts |
| stats.totalKind | lib/stats.ts | tests/matrix-dim-metrics.test.tsx, tests/matrix-invariants.test.ts, tests/stats.test.ts |
| stats.setTotal | lib/stats.ts | tests/audit-perf-equiv.test.ts, tests/q024.test.ts, tests/stats.test.ts |
| stats.fmtTotal | lib/stats.ts | tests/audit-records-logic.test.ts, tests/audit-records-misc.test.tsx, tests/stats.test.ts |
| stats.hasHistory | lib/stats.ts | tests/audit-perf-equiv.test.ts, tests/audit-perf-ui.test.tsx, tests/matrix-dim-catalog.test.tsx +2 |
| stats.sessionsFor | lib/stats.ts | tests/audit-backlog-q.test.tsx, tests/audit-perf-equiv.test.ts, tests/audit-records-logic.test.ts +13 |
| stats.emptyRecords | lib/stats.ts | tests/audit-perf-equiv.test.ts |
| stats.recordsFor | lib/stats.ts | tests/audit-backlog-q.test.tsx, tests/audit-final-stats.test.ts, tests/audit-journey-a.test.tsx +22 |
| stats.setPRs | lib/stats.ts | tests/audit-final-stats.test.ts, tests/stats.test.ts |
| stats.prMap | lib/stats.ts | tests/audit-final-stats.test.ts, tests/audit-journey-a.test.tsx, tests/audit-perf-equiv.test.ts +18 |
| stats.workoutPRs | lib/stats.ts | tests/audit-close-d.test.ts, tests/audit-close2-b.test.tsx, tests/audit-final-stats.test.ts +9 |
| stats.chartKeysFor | lib/stats.ts | tests/regress.test.tsx, tests/scenario-full.test.tsx, tests/stats.test.ts |
| stats.thisMonday | lib/stats.ts | tests/logic.test.ts, tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-metrics.test.tsx +5 |
| stats.weeklyTotals | lib/stats.ts | tests/edit-history.test.tsx, tests/logic.test.ts, tests/matrix-dim-catalog.test.tsx +7 |
| stats.hasAnyHistory | lib/stats.ts | tests/stats.test.ts |
| stats.weeklySetsByMuscle | lib/stats.ts | tests/logic.test.ts, tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-metrics.test.tsx +4 |
| stats.weeklyVolumeByMuscle | lib/stats.ts | tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-metrics.test.tsx, tests/matrix-time.test.ts +1 |
| store.dbDirectory | lib/store.ts | tests/audit-backlog-r75.test.tsx |
| store.copyKv | lib/store.ts | tests/audit-backlog-r75.test.tsx |
| store.init | lib/store.ts | tests/app.tsx, tests/audit-io-more.test.tsx, tests/audit-persist.test.ts +11 |
| store.applyPrefs | lib/store.ts | tests/audit-close-d.test.ts, tests/audit-close2-b.test.tsx, tests/audit-journey-c.test.tsx +9 |
| store.migrate | lib/store.ts | tests/audit-io-more.test.tsx, tests/audit-prephone.test.tsx, tests/audit-r72-a.test.ts +25 |
| store.flush | lib/store.ts | tests/audit-close-b.test.tsx, tests/audit-close-c.test.tsx, tests/audit-close2-a.test.tsx +46 |
| store.getPersistError | lib/store.ts | tests/audit-persist.test.ts, tests/logic.test.ts, tests/regress.test.tsx |
| store.getRecovery | lib/store.ts | tests/audit-io-more.test.tsx, tests/audit-r83b.test.tsx, tests/logic.test.ts +4 |
| store.clearRecovery | lib/store.ts | tests/matrix-logic.test.tsx, tests/regress.test.tsx |
| store.readRecovery | lib/store.ts | tests/audit-io-more.test.tsx, tests/logic.test.ts, tests/regress.test.tsx |
| store.save | lib/store.ts | tests/audit-backlog-q.test.tsx, tests/audit-backlog-r75.test.tsx, tests/audit-close-a.test.ts +74 |
| store.getState | lib/store.ts | tests/audit-backlog-q.test.tsx, tests/audit-backlog-r75.test.tsx, tests/audit-close-a.test.ts +92 |
| store.replaceState | lib/store.ts | tests/audit-close-d.test.ts, tests/audit-io-flows.test.tsx, tests/audit-io-more.test.tsx +12 |
| store.useStore | lib/store.ts | tests/matrix-logic.test.tsx |
| store.useTick | lib/store.ts | tests/logic.test.ts |
| store.usePrefsTick | lib/store.ts | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| store.getHistRev | lib/store.ts | tests/logic.test.ts, tests/regress.test.tsx |
| store.refreshViews | lib/store.ts | tests/audit-r72-ui.test.tsx, tests/audit-stale-ui.test.tsx, tests/matrix-logic.test.tsx +1 |
| store.useForegroundTick | lib/store.ts | tests/matrix-logic.test.tsx |
| store.useHistTick | lib/store.ts | tests/regress.test.tsx |
| store.memoHist | lib/store.ts | tests/matrix-logic.test.tsx |
| store.memoHistBy | lib/store.ts | tests/matrix-logic.test.tsx |
| store.exById | lib/store.ts | tests/edit-history.test.tsx, tests/flows.test.tsx, tests/invariants.test.ts +7 |
| store.bandById | lib/store.ts | tests/scenario-full.test.tsx |
| store.isBW | lib/store.ts | tests/audit-perf-equiv.test.ts, tests/invariants.test.ts, tests/matrix-invariants.test.ts +1 |
| store.repsOf | lib/store.ts | tests/audit-journey-a.test.tsx, tests/audit-perf-equiv.test.ts, tests/matrix-invariants.test.ts |
| store.loadOf | lib/store.ts | tests/audit-perf-equiv.test.ts, tests/audit-r83.test.tsx, tests/audit-r83b.test.tsx |
| store.shownLoad | lib/store.ts | tests/audit-r83.test.tsx, tests/audit-r83b.test.tsx, tests/backlog-0410.test.tsx |
| store.setLoad | lib/store.ts | tests/audit-perf-equiv.test.ts, tests/audit-r82c.test.tsx, tests/audit-r83.test.tsx +11 |
| store.loadFieldValue | lib/store.ts | tests/matrix-dim-metrics.test.tsx, tests/matrix-logic.test.tsx |
| store.writeLoad | lib/store.ts | tests/matrix-dim-metrics.test.tsx, tests/matrix-invariants.test.ts, tests/matrix-logic.test.tsx +1 |
| store.localDateTs | lib/store.ts | tests/logic.test.ts, tests/matrix-time.test.ts |
| store.effectiveLoad | lib/store.ts | tests/audit-perf-equiv.test.ts |
| store.exMult | lib/store.ts | tests/logic.test.ts, tests/regress.test.tsx |
| store.isWorking | lib/store.ts | tests/audit-perf-equiv.test.ts, tests/matrix-dim-metrics.test.tsx |
| store.setVolume | lib/store.ts | tests/audit-perf-equiv.test.ts, tests/audit-r82.test.tsx, tests/matrix-dim-catalog.test.tsx +1 |
| store.blockMult | lib/store.ts | tests/matrix-logic.test.tsx |
| store.volOf | lib/store.ts | tests/matrix-logic.test.tsx |
| store.loadLabelShort | lib/store.ts | tests/audit-r82.test.tsx, tests/audit-r82c.test.tsx, tests/regress.test.tsx |
| store.loadLabel | lib/store.ts | tests/audit-close2-b.test.tsx, tests/audit-journey-c.test.tsx, tests/audit-journey-d.test.tsx +3 |
| store.restFor | lib/store.ts | tests/regress.test.tsx |
| store.fmtSec | lib/store.ts | tests/invariants.test.ts, tests/regress.test.tsx, tests/scenario-full.test.tsx |
| store.fmtDist | lib/store.ts | tests/regress.test.tsx |
| store.reps | lib/store.ts | tests/audit-backlog-q.test.tsx, tests/audit-backlog-r75.test.tsx, tests/audit-close-a.test.ts +76 |
| store.fmtDur | lib/store.ts | tests/regress.test.tsx |
| store.fmtDate | lib/store.ts | tests/matrix-time.test.ts, tests/matrix-ui.test.tsx, tests/regress.test.tsx |
| store.fmtTime | lib/store.ts | tests/matrix-time.test.ts, tests/matrix-ui.test.tsx, tests/regress.test.tsx |
| store.bandColor | lib/store.ts | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| store.shortBand | lib/store.ts | tests/regress.test.tsx |
| store.bandA11y | lib/store.ts | tests/regress.test.tsx |
| store.finishedWorkouts | lib/store.ts | tests/audit-perf-equiv.test.ts, tests/edit-history.test.tsx, tests/matrix-invariants.test.ts +2 |
| store.blocksOf | lib/store.ts | tests/audit-perf-equiv.test.ts |
| store.workoutsWith | lib/store.ts | tests/audit-perf-equiv.test.ts, tests/edit-history.test.tsx, tests/matrix-logic.test.tsx |
| store.previousFor | lib/store.ts | tests/audit-prephone.test.tsx, tests/audit-r82b.test.tsx, tests/edit-history.test.tsx +4 |
| store.previousBlockFor | lib/store.ts | tests/audit-r72-b.test.ts, tests/audit-r72-d.test.ts, tests/audit-r82.test.tsx +8 |
| store.previousBlockBefore | lib/store.ts | tests/decisions-0310.test.tsx, tests/edit-history.test.tsx, tests/integration-090.test.tsx |
| store.hintFor | lib/store.ts | tests/audit-r72-b.test.ts, tests/audit-r72-d.test.ts, tests/audit-r82b.test.tsx +2 |
| store.progressionFor | lib/store.ts | tests/audit-backlog-r75.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx +7 |
| store.occurrence | lib/store.ts | tests/audit-r72-d.test.ts, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx +2 |
| store.occurrences | lib/store.ts | tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx, tests/store-hint.test.ts +1 |
| store.setSummary | lib/store.ts | tests/audit-r83.test.tsx, tests/audit-r83b.test.tsx, tests/backlog-0410.test.tsx +8 |
| store.setScore | lib/store.ts | tests/audit-perf-equiv.test.ts, tests/logic.test.ts |
| store.setHasValue | lib/store.ts | tests/matrix-dim-metrics.test.tsx, tests/matrix-logic.test.tsx |
| store.volume | lib/store.ts | tests/audit-close-d.test.ts, tests/audit-journey-a.test.tsx, tests/audit-perf-equiv.test.ts +18 |
| store.locationById | lib/store.ts | tests/audit-r82c.test.tsx, tests/decisions-0310.test.tsx, tests/locations-model.test.ts +2 |
| store.startLocationId | lib/store.ts | tests/scenario-full.test.tsx, tests/swap-logic.test.ts |
| store.offListAt | lib/store.ts | tests/audit-r82b.test.tsx, tests/swap-logic.test.ts |
| store.prevFromOther | lib/store.ts | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/swap-logic.test.ts |
| store.implAtLoc | lib/store.ts | tests/decisions-0310.test.tsx, tests/matrix-invariants.test.ts, tests/scenario-full.test.tsx +2 |
| store.blockImpl | lib/store.ts | tests/audit-r82b.test.tsx |
| store.liveBlockImpl | lib/store.ts | tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx |
| store.listLocFor | lib/store.ts | tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx, tests/swap-logic.test.ts |
| store.pinnedImpl | lib/store.ts | tests/swap-logic.test.ts |
| store.offListNote | lib/store.ts | tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx |
| store.srcSetAt | lib/store.ts | tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx, tests/swap-logic.test.ts |
| store.stampImpl | lib/store.ts | tests/matrix-logic.test.tsx |
| store.setActiveLocation | lib/store.ts | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx +6 |
| store.locationEquipChanged | lib/store.ts | tests/matrix-invariants.test.ts, tests/swap-logic.test.ts |
| store.prefillSets | lib/store.ts | tests/swap-logic.test.ts |
| store.tplRows | lib/store.ts | tests/matrix-dim-metrics.test.tsx, tests/matrix-invariants.test.ts, tests/scenario-full.test.tsx +1 |
| store.tplWorkSets | lib/store.ts | tests/matrix-dim-metrics.test.tsx, tests/scenario-full.test.tsx, tests/xcheck-0610.test.tsx |
| store.tplAddRow | lib/store.ts | tests/matrix-invariants.test.ts, tests/regress.test.tsx, tests/template-rows.test.tsx |
| store.tplRemoveRow | lib/store.ts | tests/matrix-invariants.test.ts, tests/template-rows.test.tsx |
| store.tplCycleBand | lib/store.ts | tests/matrix-invariants.test.ts, tests/template-rows.test.tsx |
| store.tplSetRow | lib/store.ts | tests/matrix-invariants.test.ts, tests/template-rows.test.tsx |
| store.tplSetKind | lib/store.ts | tests/matrix-dim-metrics.test.tsx, tests/matrix-invariants.test.ts, tests/template-rows.test.tsx |
| store.startFromTemplate | lib/store.ts | tests/audit-close-b.test.tsx, tests/audit-close2-c.test.tsx, tests/audit-final-timer.test.tsx +31 |
| store.startEmpty | lib/store.ts | tests/audit-backlog-q.test.tsx, tests/audit-backlog-r75.test.tsx, tests/audit-close-a.test.ts +68 |
| store.repeatLast | lib/store.ts | tests/audit-close-d.test.ts, tests/audit-r82.test.tsx, tests/decisions-0310.test.tsx +9 |
| store.addExerciseToActive | lib/store.ts | tests/audit-backlog-q.test.tsx, tests/audit-backlog-r75.test.tsx, tests/audit-close-a.test.ts +66 |
| store.swapBlock | lib/store.ts | tests/invariants.test.ts, tests/matrix-invariants.test.ts, tests/matrix-logic.test.tsx +6 |
| store.swapImpl | lib/store.ts | tests/matrix-invariants.test.ts, tests/swap-alternates.test.tsx, tests/swap-logic.test.ts |
| store.canUndoSwap | lib/store.ts | tests/invariants.test.ts, tests/matrix-invariants.test.ts, tests/swap-logic.test.ts |
| store.undoSwap | lib/store.ts | tests/invariants.test.ts, tests/matrix-invariants.test.ts, tests/swap-logic.test.ts +1 |
| store.canRememberAlt | lib/store.ts | tests/matrix-invariants.test.ts, tests/swap-alternates.test.tsx |
| store.rememberAlt | lib/store.ts | tests/matrix-invariants.test.ts, tests/swap-alternates.test.tsx |
| store.altHint | lib/store.ts | tests/matrix-invariants.test.ts, tests/swap-alternates.test.tsx |
| store.acceptAlt | lib/store.ts | tests/matrix-invariants.test.ts, tests/swap-alternates.test.tsx |
| store.skipAlt | lib/store.ts | tests/matrix-invariants.test.ts, tests/swap-alternates.test.tsx |
| store.rememberRest | lib/store.ts | tests/matrix-invariants.test.ts, tests/swap-alternates.test.tsx |
| store.addSet | lib/store.ts | tests/audit-backlog-q.test.tsx, tests/audit-backlog-r75.test.tsx, tests/audit-close-d.test.ts +21 |
| store.removeSetById | lib/store.ts | tests/matrix-invariants.test.ts, tests/xcheck-0610b.test.tsx |
| store.removeSet | lib/store.ts | tests/invariants.test.ts, tests/matrix-invariants.test.ts |
| store.removeExercise | lib/store.ts | tests/invariants.test.ts, tests/matrix-invariants.test.ts, tests/regress.test.tsx +1 |
| store.findSet | lib/store.ts | tests/audit-close-a.test.ts |
| store.usesBand | lib/store.ts | tests/band-exercises.test.tsx, tests/matrix-dim-catalog.test.tsx, tests/matrix-invariants.test.ts +2 |
| store.assistLost | lib/store.ts | tests/audit-r72-b.test.ts, tests/swap-logic.test.ts |
| store.prevOfActiveBlock | lib/store.ts | tests/matrix-logic.test.tsx |
| store.restAfter | lib/store.ts | tests/audit-r72-d.test.ts, tests/store-rest.test.ts |
| store.roundRest | lib/store.ts | tests/audit-r72-d.test.ts, tests/audit-r72-ui.test.tsx, tests/store-rest.test.ts |
| store.toggleDone | lib/store.ts | tests/audit-backlog-q.test.tsx, tests/audit-backlog-r75.test.tsx, tests/audit-close-a.test.ts +46 |
| store.lastActivity | lib/store.ts | tests/audit-persist.test.ts, tests/store-stale.test.ts |
| store.staleKind | lib/store.ts | tests/matrix-dim-metrics.test.tsx, tests/store-stale.test.ts |
| store.hasWorkDone | lib/store.ts | tests/matrix-dim-metrics.test.tsx, tests/store-stale.test.ts |
| store.staleSince | lib/store.ts | tests/audit-backlog-q.test.tsx, tests/audit-final2-auto.test.ts, tests/audit-persist.test.ts +5 |
| store.ackStale | lib/store.ts | tests/audit-r72-d.test.ts, tests/regress.test.tsx, tests/store-stale.test.ts |
| store.markActivity | lib/store.ts | tests/store-stale.test.ts |
| store.resolveColdStopwatch | lib/store.ts | tests/store-stale.test.ts |
| store.autoFinishStale | lib/store.ts | tests/audit-backlog-q.test.tsx, tests/audit-close-a.test.ts, tests/audit-final2-auto.test.ts +6 |
| store.finishWorkout | lib/store.ts | tests/audit-close-d.test.ts, tests/audit-io-more.test.tsx, tests/audit-persist.test.ts +19 |
| store.cancelWorkout | lib/store.ts | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/decisions-0310.test.tsx +11 |
| store.deleteWorkout | lib/store.ts | tests/edit-history.test.tsx, tests/invariants.test.ts, tests/matrix-invariants.test.ts +1 |
| store.setHasResult | lib/store.ts | tests/matrix-dim-catalog.test.tsx, tests/matrix-logic.test.tsx |
| store.putHistoryWorkout | lib/store.ts | tests/matrix-invariants.test.ts, tests/swap-schema16.test.ts |
| store.normalizeGroups | lib/store.ts | tests/logic.test.ts, tests/matrix-invariants.test.ts, tests/reorder-t010.test.tsx |
| store.groupLabels | lib/store.ts | tests/matrix-logic.test.tsx |
| store.linkWithNext | lib/store.ts | tests/audit-close-d.test.ts, tests/audit-journey-c.test.tsx, tests/audit-r72-d.test.ts +5 |
| store.unlink | lib/store.ts | tests/invariants.test.ts, tests/logic.test.ts, tests/matrix-invariants.test.ts |
| store.moveItem | lib/store.ts | tests/logic.test.ts |
| store.removeItem | lib/store.ts | tests/matrix-invariants.test.ts, tests/regress.test.tsx |
| store.blockRanges | lib/store.ts | tests/reorder-t010.test.tsx |
| store.moveBlockOf | lib/store.ts | tests/matrix-invariants.test.ts, tests/reorder-t010.test.tsx |
| store.moveInGroup | lib/store.ts | tests/reorder-t010.test.tsx |
| store.cleanLevels | lib/store.ts | tests/matrix-logic.test.tsx |
| store.nextBandId | lib/store.ts | tests/audit-r83.test.tsx, tests/owner-0510c.test.tsx, tests/xcheck-0610.test.tsx |
| store.cycleBand | lib/store.ts | tests/invariants.test.ts, tests/matrix-invariants.test.ts, tests/owner-0510c.test.tsx +1 |
| store.deleteBand | lib/store.ts | tests/invariants.test.ts, tests/matrix-invariants.test.ts |
| store.setTimerState | lib/store.ts | tests/audit-persist.test.ts, tests/matrix-invariants.test.ts, tests/regress.test.tsx +1 |
| store.clampName | lib/store.ts | tests/matrix-invariants.test.ts, tests/matrix-logic.test.tsx |
| store.newExercise | lib/store.ts | tests/audit-io-more.test.tsx, tests/backlog-0410.test.tsx, tests/catalog-v2.test.ts +6 |
| store.setEquipment | lib/store.ts | tests/audit-io-more.test.tsx, tests/audit-r83.test.tsx, tests/audit-r83b.test.tsx +7 |
| store.restoreExercise | lib/store.ts | tests/matrix-invariants.test.ts, tests/matrix-logic.test.tsx, tests/regress.test.tsx +1 |
| store.exerciseInHistory | lib/store.ts | tests/matrix-logic.test.tsx |
| store.exerciseUsed | lib/store.ts | tests/matrix-invariants.test.ts, tests/matrix-logic.test.tsx |
| store.deleteExercise | lib/store.ts | tests/backlog-0410.test.tsx, tests/flows.test.tsx, tests/logic.test.ts +6 |
| store.visibleExercises | lib/store.ts | tests/logic.test.ts, tests/scenario-full.test.tsx, tests/swap-logic.test.ts |
| store.newTemplate | lib/store.ts | tests/audit-close-b.test.tsx, tests/audit-close2-c.test.tsx, tests/audit-final-timer.test.tsx +26 |
| store.dupTemplate | lib/store.ts | tests/matrix-invariants.test.ts, tests/regress.test.tsx, tests/swap-alternates.test.tsx |
| store.deleteTemplate | lib/store.ts | tests/matrix-invariants.test.ts, tests/matrix-logic.test.tsx |
| store.setModule | lib/store.ts | tests/matrix-logic.test.tsx |
| store.resetAll | lib/store.ts | tests/audit-journey-c.test.tsx, tests/matrix-invariants.test.ts, tests/regress.test.tsx |
| store.isReadyForTests | lib/store.ts | tests/app.tsx |
| store.__resetForTests | lib/store.ts | tests/app.tsx, tests/audit-io-more.test.tsx, tests/audit-persist.test.ts +7 |
| swap.swapCandidates | lib/swap.ts | tests/catalog-full.test.tsx, tests/swap-logic.test.ts, tests/swap-top3.test.ts |
| swap.sortOthers | lib/swap.ts | tests/catalog-full.test.tsx |
| swap.implLabel | lib/swap.ts | tests/swap-top3.test.ts |
| swap.otherImpls | lib/swap.ts | tests/swap-logic.test.ts, tests/swap-top3.test.ts |
| swap.reasonText | lib/swap.ts | tests/swap-top3.test.ts |
| swap.parseSwapTarget | lib/swap.ts | tests/matrix-logic.test.tsx |
| theme.applyTheme | lib/theme.ts | tests/matrix-logic.test.tsx |
| theme.useTheme | lib/theme.ts | tests/matrix-logic.test.tsx |
| timer.ensurePermission | lib/timer.ts | tests/matrix-logic.test.tsx |
| timer.start | lib/timer.ts | tests/app.tsx, tests/audit-close2-a.test.tsx, tests/audit-final-auto.test.tsx +42 |
| timer.adjust | lib/timer.ts | tests/matrix-logic.test.tsx, tests/matrix-time.test.ts, tests/regress.test.tsx |
| timer.relabel | lib/timer.ts | tests/swap-ui.test.tsx |
| timer.stop | lib/timer.ts | tests/audit-backlog-q.test.tsx, tests/audit-backlog-r75.test.tsx, tests/audit-close-a.test.ts +47 |
| timer.stopIfFrom | lib/timer.ts | tests/matrix-invariants.test.ts, tests/matrix-logic.test.tsx |
| timer.restore | lib/timer.ts | tests/audit-final-timer.test.tsx, tests/audit-final2-auto.test.ts, tests/audit-final2-fg.test.tsx +3 |
| timer.onForeground | lib/timer.ts | tests/matrix-logic.test.tsx, tests/matrix-time.test.ts |
| timer.resetAll | lib/timer.ts | tests/audit-journey-c.test.tsx, tests/matrix-invariants.test.ts, tests/regress.test.tsx |
| timer.startSet | lib/timer.ts | tests/audit-backlog-q.test.tsx, tests/audit-close-a.test.ts, tests/audit-final2-auto.test.ts +4 |
| timer.refreshScheduled | lib/timer.ts | tests/audit-backlog-r75.test.tsx, tests/regress.test.tsx |
| timer.stopSet | lib/timer.ts | tests/audit-backlog-q.test.tsx, tests/audit-backlog-r75.test.tsx, tests/audit-close-a.test.ts +45 |
| timer.setElapsed | lib/timer.ts | tests/matrix-logic.test.tsx |
| timer.setReached | lib/timer.ts | tests/matrix-logic.test.tsx |
| timer.tick | lib/timer.ts | tests/audit-close2-b.test.tsx, tests/audit-close2-c.test.tsx, tests/audit-final-timer.test.tsx +11 |
| timer.subscribe | lib/timer.ts | tests/matrix-logic.test.tsx |
| timer.scheduleWeighReminder | lib/timer.ts | tests/audit-backlog-r75.test.tsx, tests/morning-removed.test.tsx |
| timer.cancelStaleReminder | lib/timer.ts | tests/audit-io-more.test.tsx |
| timer.staleBody | lib/timer.ts | tests/audit-stale-ui.test.tsx, tests/regress.test.tsx |
| timer.scheduleStaleReminder | lib/timer.ts | tests/regress.test.tsx |
| units.applyUnit | lib/units.ts | tests/audit-backlog-r75.test.tsx, tests/audit-close2-b.test.tsx, tests/audit-final-stats.test.ts +26 |
| units.wu | lib/units.ts | tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-equipment.test.tsx, tests/matrix-dim-langs1.test.tsx +7 |
| units.wOut | lib/units.ts | tests/audit-backlog-r75.test.tsx, tests/audit-r83.test.tsx, tests/audit-training.test.ts +12 |
| units.wField | lib/units.ts | tests/audit-close2-b.test.tsx, tests/logic.test.ts, tests/matrix-dim-catalog.test.tsx +8 |
| units.wIn | lib/units.ts | tests/audit-backlog-r75.test.tsx, tests/audit-close-d.test.ts, tests/audit-r83.test.tsx +20 |
| units.wInKeep | lib/units.ts | tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-equipment.test.tsx, tests/matrix-dim-langs1.test.tsx +6 |
| units.snapLb | lib/units.ts | tests/matrix-dim-equipment.test.tsx, tests/matrix-logic.test.tsx |
| units.snapLegacyLb | lib/units.ts | tests/matrix-migrations.test.tsx, tests/regress.test.tsx, tests/units.test.ts |
| units.fmtNum | lib/units.ts | tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx, tests/units.test.ts |
| units.volOut | lib/units.ts | tests/regress.test.tsx, tests/units.test.ts |
| units.fmtVol | lib/units.ts | tests/invariants.test.ts, tests/matrix-logic.test.tsx, tests/regress.test.tsx +2 |
| units.fmtW | lib/units.ts | tests/audit-close-d.test.ts, tests/audit-training.test.ts, tests/invariants.test.ts +3 |

## WYMIAR

| Pozycja | Źródło | Testy (pierwsze 3) |
|---|---|---|
| metryki ćwiczeń (METRICS) | lib/seed.ts | tests/matrix-dim-metrics.test.tsx |
| typy serii (SET_KINDS) | lib/seed.ts | tests/matrix-dim-metrics.test.tsx |
| partie mięśniowe (MUSCLES) | lib/seed.ts | tests/matrix-dim-catalog.test.tsx |
| języki (LANGS) | lib/i18n.ts | tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx, tests/matrix-dim-langs3.test.tsx +1 |
| jednostki kg/lb (UNITS) | tests/matrix-dimensions.test.tsx | tests/matrix-dim-metrics.test.tsx |
| motywy (THEMES) | tests/matrix-dimensions.test.tsx | tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx, tests/matrix-dim-langs3.test.tsx +1 |
| pozycje sprzętu (EQUIPMENT) | lib/equipment.ts | tests/matrix-dim-equipment.test.tsx |
| presety miejsc (LOCATION_PRESETS) | lib/equipment.ts | tests/matrix-dim-equipment.test.tsx |
| presety modeli ciężarów (LOAD_PRESETS) | lib/equipment.ts | tests/matrix-dim-equipment.test.tsx |
| ćwiczenia z katalogu (katalog (seedState().exercises)) | lib/seed.ts | tests/matrix-dim-catalog.test.tsx |
