# 19. Macierz testów (generowana)

Plik generuje `node scripts/test-matrix.mjs --write` z kodu i testów — nie edytuj ręcznie. `npm run verify` uruchamia `--check`:
nowy ekran, przycisk, pole, funkcja albo wartość wymiaru bez testu blokuje commit (polecenie właściciela 06.10.2026).
Wyjątki tylko z powodem w `tests/matrix-exceptions.json`. Pokrycie liczy się tylko z kodu testu (bez komentarzy, tytułów testów
i importów; Maestro bez komentarzy): UI/TEKST — tekst w literale testu, LOGIKA — funkcja użyta w kodzie, WYMIAR (z kodu lib/: tablice stałych
i typy-unie) — pętla po stałej albo każda wartość w teście. To warunek konieczny, nie dowód — przepływy i logikę sprawdzają testy
scenariuszowe (docs/09, sekcja „Macierz testów”).

| Rodzaj | Pozycji | Z testem | Wyjątki |
|---|---|---|---|
| EKRAN | 32 | 32 | 0 |
| UI | 349 | 349 | 0 |
| TEKST | 1107 | 1107 | 0 |
| LOGIKA | 921 | 921 | 0 |
| WYMIAR | 118 | 118 | 0 |

## EKRAN

| Pozycja | Źródło | Testy (pierwsze 3) |
|---|---|---|
| /history | app/(tabs)/history.tsx | tests/a11y-routes.ts, tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx +58 |
| / | app/(tabs)/index.tsx | tests/a11y-routes.ts, tests/adapt-scenario.test.tsx, tests/adapt-ui.test.tsx +226 |
| /more | app/(tabs)/more.tsx | tests/a11y-routes.ts, tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-gen-ui.test.tsx +72 |
| /progress | app/(tabs)/progress.tsx | tests/a11y-routes.ts, tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx +37 |
| /adapt | app/adapt.tsx | tests/a11y-routes.ts, tests/adapt-ui.test.tsx, tests/close-button-guard.test.tsx +1 |
| /exercise | app/exercise/[id].tsx | tests/a11y-routes.ts, tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-stats-ui.test.tsx +28 |
| /exercises | app/exercises.tsx | tests/a11y-routes.ts, tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-tst-ui.test.tsx +21 |
| /generator | app/generator.tsx | tests/a11y-routes.ts, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx +19 |
| /guide | app/guide.tsx | tests/a11y-routes.ts, tests/guide.test.tsx, tests/matrix-langs-routes-shared.tsx +1 |
| /history | app/history/[id].tsx | tests/a11y-routes.ts, tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx +58 |
| /history/add | app/history/add.tsx | tests/a11y-routes.ts, tests/audit-0.10-tst-ui.test.tsx, tests/audit-0.10-ui.test.tsx +6 |
| /history/edit | app/history/edit/[id].tsx | tests/a11y-routes.ts, tests/audit-0.10-stats-ui.test.tsx, tests/audit-0.10-ui.test.tsx +9 |
| /more/about | app/more/about.tsx | tests/a11y-routes.ts, tests/idea-request.test.tsx, tests/legal-links.test.tsx +2 |
| /more/backup | app/more/backup.tsx | tests/a11y-routes.ts, tests/audit-io-more.test.tsx, tests/audit-m1-006-import-ui.test.tsx +15 |
| /more/bands | app/more/bands.tsx | tests/a11y-routes.ts, tests/audit-0.10-stats-ui.test.tsx, tests/audit-0.10-ui.test.tsx +16 |
| /more/bodymass | app/more/bodymass.tsx | tests/a11y-routes.ts, tests/audit-0.10-data-ui.test.tsx, tests/interaction-patterns.test.tsx +6 |
| /more/import | app/more/import.tsx | tests/a11y-routes.ts, tests/audit-m1-006-import-ui.test.tsx, tests/csv-import-ui.test.tsx +1 |
| /more/language | app/more/language.tsx | tests/a11y-routes.ts, tests/audit-0.10-lang-ui.test.tsx, tests/audit-m1-064-language-ios.test.tsx +12 |
| /more/licenses | app/more/licenses.tsx | tests/a11y-routes.ts, tests/licenses-native.test.tsx, tests/matrix-langs-routes-shared.tsx |
| /more/location | app/more/location/[id].tsx | tests/a11y-routes.ts, tests/audit-0.10-ui.test.tsx, tests/audit-r82c.test.tsx +12 |
| /more/locations | app/more/locations.tsx | tests/a11y-routes.ts, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-ui.test.tsx +15 |
| /more/settings | app/more/settings.tsx | tests/a11y-routes.ts, tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx +44 |
| /paywall | app/paywall.tsx | tests/a11y-routes.ts, tests/audit-m1-016-paywall-benefit.test.tsx, tests/close-button-guard.test.tsx +4 |
| /pick-template | app/pick-template.tsx | tests/a11y-routes.ts, tests/close-button-guard.test.tsx, tests/matrix-langs-routes-shared.tsx +1 |
| /picker | app/picker.tsx | tests/a11y-routes.ts, tests/audit-0.10-lang-ui.test.tsx, tests/audit-k1-fala2b.test.tsx +16 |
| /place-once | app/place-once.tsx | tests/a11y-routes.ts, tests/close-button-guard.test.tsx, tests/matrix-langs-routes-shared.tsx +1 |
| /plan | app/plan.tsx | tests/a11y-routes.ts, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx +22 |
| /progression | app/progression.tsx | tests/a11y-routes.ts, tests/audit-m1-025-muscle-caption.test.tsx, tests/audit-m1-032-total-bars.test.tsx +5 |
| /reorder | app/reorder.tsx | tests/a11y-routes.ts, tests/audit-0.10-stats-ui.test.tsx, tests/matrix-langs-routes-shared.tsx +1 |
| /swap | app/swap.tsx | tests/a11y-routes.ts, tests/adapt-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx +4 |
| /template | app/template/[id].tsx | tests/a11y-routes.ts, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx +37 |
| /templates | app/templates.tsx | tests/a11y-routes.ts, tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-gen-ui.test.tsx +23 |

## UI

| Pozycja | Źródło | Testy (pierwsze 3) |
|---|---|---|
| {label}: {v}, poprzednio {p} | components/PeriodSummary.tsx | tests/period-summary.test.tsx, tests/progression-ui.test.tsx |
| {label}: {v}, poprzednio {p}, {d} | app/progression.tsx | tests/period-summary.test.tsx, tests/progression-ui.test.tsx |
| {n} min | app/generator.tsx | tests/adapt-ui.test.tsx, tests/app.tsx, tests/asc-metadane.test.ts +94 |
| {n} z {all} | components/DragList.tsx | (tylko parametry — pokrycie przez test ekranu) |
| {title} ({sub}): objętość {v}, {p}; serie {s}, {d} | components/Dashboard.tsx | tests/progression-ui.test.tsx |
| ↑ przy ćwiczeniu, gdy ostatnio wszystkie serie były na górze zakresu powtórzeń | app/more/settings.tsx | tests/matrix-ui.test.tsx |
| ↺ cofnij | components/WorkoutBlocks.tsx | tests/audit-0.10-tst-ui.test.tsx, tests/audit-0.10-tst.test.ts, tests/interaction-guards.test.ts +3 |
| ↺ cofnij zamianę: {name} | app/swap.tsx | tests/interaction-guards.test.ts, tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx +1 |
| ⇄ zamień | app/history/edit/[id].tsx | tests/guide.test.tsx |
| + Dodaj ćwiczenie | app/history/edit/[id].tsx | tests/audit-0.10-live.test.tsx, tests/audit-prephone.test.tsx, tests/audit-r82.test.tsx +13 |
| + Dodaj miejsce | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/matrix-dim-langs1.test.tsx +3 |
| + drop set | app/history/edit/[id].tsx | tests/i18n-wave2.test.ts, tests/matrix-i18n.test.tsx, tests/scenario-full.test.tsx +3 |
| + Nowy folder | app/template/[id].tsx | tests/b2-plan-own-templates.test.tsx, tests/edit-on-demand.test.tsx, tests/template-folders.test.tsx |
| + Nowy szablon | app/plan.tsx | tests/audit-0.10-ui.test.tsx, tests/b2-plan-own-templates.test.tsx, tests/dashboard.test.tsx +7 |
| + rozgrzewka | app/history/edit/[id].tsx | tests/scenario-full.test.tsx, tests/set-kinds-visible.test.tsx, tests/template-rows.test.tsx |
| + seria | app/history/edit/[id].tsx | tests/audit-0.10-live.test.tsx, tests/audit-close2-b.test.tsx, tests/audit-journey-c.test.tsx +6 |
| + talerz | components/LoadEditor.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/locations-ui.test.tsx +2 |
| + zakres powtórzeń | app/template/[id].tsx | tests/audit-0.10-tst-ui.test.tsx, tests/scenario-full.test.tsx, tests/template-rows.test.tsx |
| ≡ Kolejność | app/template/[id].tsx | tests/audit-0.10-live.test.tsx, tests/edit-on-demand.test.tsx, tests/guide.test.tsx +1 |
| ▶ Start | components/NowBoard.tsx | tests/audit-0.10-live.test.tsx, tests/matrix-i18n.test.tsx, tests/matrix-tuleja.test.tsx |
| ★ Miejsce główne | app/more/location/[id].tsx | tests/interaction-guards.test.ts, tests/scenario-full.test.tsx |
| Anuluj | app/history/edit/[id].tsx | tests/adapt-ui.test.tsx, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-live.test.tsx +53 |
| Archiwizuj | app/template/[id].tsx | tests/audit-0.10-plan-ui.test.tsx, tests/edit-on-demand.test.tsx, tests/guide.test.tsx +1 |
| Archiwum ({n}) | app/templates.tsx | tests/audit-0.10-ui.test.tsx, tests/audit-m1-workflows.test.ts, tests/public-repo.test.ts +1 |
| Asysta gumą | app/exercise/[id].tsx | tests/interaction-guards.test.ts, tests/scenario-full.test.tsx |
| Automatyczna kopia po każdym treningu | app/more/settings.tsx | tests/audit-m1-004-start-error.test.tsx, tests/guide.test.tsx, tests/i18n-wave2.test.ts +3 |
| bez folderu | app/template/[id].tsx | tests/template-folders.test.tsx |
| Bez miejsc plan zakłada pełną siłownię. W domu? „+ Dodaj miejsce”. | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx |
| Bez ograniczeń sprzętu | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-m1-015-asekuracja.test.tsx, tests/gen-days-ui.test.tsx +1 |
| Bez zmian | app/swap.tsx | tests/adapt-ui.test.tsx, tests/release-0.18.test.tsx, tests/whats-new.test.tsx |
| Bez zmian: {name} | app/swap.tsx | tests/adapt-ui.test.tsx |
| Brak sprzętu w: {l}. Brakuje: {m} | components/WorkoutBlocks.tsx | tests/scenario-full.test.tsx, tests/swap-ui.test.tsx |
| Cardio poza planem: przy tej liczbie dni wszystkie sesje są siłowe. | app/generator.tsx | tests/gen-days-ui.test.tsx, tests/generator-ui.test.tsx |
| Cardio w planie: {n} min tygodniowo. | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/gen-general-ui.test.tsx, tests/generator-ui.test.tsx +1 |
| Cel | app/generator.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/gen-general-ui.test.tsx, tests/generator-ui.test.tsx +9 |
| cel s | app/template/[id].tsx | tests/matrix-invariants.test.ts, tests/release-0.16.test.tsx, tests/scenario-full.test.tsx +10 |
| Cel serii: {part} | app/more/settings.tsx | tests/set-goals-ui.test.tsx, tests/set-goals.test.ts |
| Cele partii | app/more/settings.tsx | tests/interaction-patterns.test.tsx |
| co | components/LoadEditor.tsx | tests/access.test.ts, tests/adapt-ui.test.tsx, tests/architecture-limits.test.ts +237 |
| Co logujesz w serii | app/exercise/[id].tsx | tests/edit-on-demand.test.tsx, tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx +3 |
| Cofnij | components/DayPanel.tsx | tests/adapt-ui.test.tsx, tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx +7 |
| Cofnij zamianę: {name} | app/swap.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx, tests/swap-ui.test.tsx |
| Cofnij: {name} znów zaplanowany na ten dzień | components/DayPanel.tsx | tests/plan-wczesniej-ui.test.tsx |
| czas | app/history/edit/[id].tsx | tests/adapt-ui.test.tsx, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-live.test.tsx +29 |
| Czas sesji | app/generator.tsx | tests/generator-ui.test.tsx |
| Czas trwania (min) | components/WhenFields.tsx | tests/edit-history.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Czego Ci brakuje? Poproś o funkcję | components/IdeaLink.tsx | tests/idea-request.test.tsx |
| Ćwiczenia | app/(tabs)/more.tsx | tests/adapt-ui.test.tsx, tests/audit-0.10-live.test.tsx, tests/csv-import-ui.test.tsx +13 |
| Ćwiczysz w domu albo na siłowni? Ustaw sprzęt w „Miejsca i sprzęt”. | components/Dashboard.tsx | tests/dashboard.test.tsx |
| Data (RRRR-MM-DD) | components/WhenFields.tsx | tests/edit-history.test.tsx, tests/integration-090.test.tsx, tests/matrix-ui.test.tsx +1 |
| Data pomiaru (RRRR-MM-DD) | app/more/bodymass.tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-stats-ui.test.tsx, tests/interaction-patterns.test.tsx +1 |
| Dawne nazwy w bibliotece | app/exercise/[id].tsx | tests/audit-k1-fala2b.test.tsx |
| Dni cardio w planie | app/generator.tsx | tests/gen-general-ui.test.tsx, tests/matrix-i18n.test.tsx |
| Dni powyżej {k} to sesje umiarkowanego cardio zamiast siłowych. | app/generator.tsx | tests/gen-general-ui.test.tsx, tests/matrix-i18n.test.tsx |
| Dni treningowe w tygodniu | components/OwnPlan.tsx | tests/gen-days-ui.test.tsx, tests/gen-general-ui.test.tsx, tests/generator-ui.test.tsx +1 |
| do | app/template/[id].tsx | tests/adapt-logic.test.ts, tests/adapt-ui.test.tsx, tests/architecture-limits.test.ts +258 |
| Do upadku (F) | app/template/[id].tsx | tests/scenario-full.test.tsx |
| dodaj ciężar | components/LoadEditor.tsx | tests/audit-0.10-ui.test.tsx, tests/locations-ui.test.tsx, tests/matrix-ui.test.tsx +1 |
| Dodaj notatkę | components/WorkoutBlocks.tsx | tests/scenario-full.test.tsx |
| domyślna {s} | app/exercise/[id].tsx | tests/audit-0.10-tst-ui.test.tsx |
| Domyślna przerwa (s) | app/more/settings.tsx | tests/scenario-full.test.tsx |
| Dopisuje treningi z CSV — bez usuwania danych, z podglądem. | app/more/backup.tsx | tests/csv-import-ui.test.tsx, tests/matrix-ui.test.tsx |
| Dopisuje treningi z CSV. Obecnych danych nie zmienia. Przed zapisem — podgląd. | app/more/import.tsx | tests/csv-import-ui.test.tsx |
| Dopisz trening wstecz | app/(tabs)/history.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/edit-history.test.tsx, tests/guide.test.tsx +8 |
| Drop set (D) | app/template/[id].tsx | tests/i18n-wave2.test.ts, tests/matrix-i18n.test.tsx, tests/scenario-full.test.tsx |
| Duplikuj | app/more/location/[id].tsx | tests/audit-k1-fala2b.test.tsx, tests/edit-on-demand.test.tsx, tests/flows.test.tsx +3 |
| dystans | app/history/edit/[id].tsx | tests/audit-records-logic.test.ts, tests/catalog-library25.test.tsx, tests/logic.test.ts +5 |
| Dzień później | components/DayPanel.tsx | tests/interaction-patterns.test.tsx, tests/places-scenario.test.tsx, tests/places-ui.test.tsx +1 |
| Dzień wcześniej | components/DayPanel.tsx | tests/edit-history.test.tsx, tests/interaction-patterns.test.tsx, tests/places-ui.test.tsx +1 |
| Dźwięk na koniec przerwy | app/more/settings.tsx | tests/m3-p5d-settings-ui.test.tsx, tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx +6 |
| Edytuj | app/exercise/[id].tsx | tests/app.tsx, tests/audit-0.10-plan-ui.test.tsx, tests/audit-k1-fala2b.test.tsx +17 |
| Edytuj ćwiczenie | app/exercise/[id].tsx | tests/app.tsx, tests/edit-on-demand.test.tsx, tests/scenario-full.test.tsx |
| Edytuj notatkę | components/WorkoutBlocks.tsx | tests/scenario-full.test.tsx |
| Edytuj sesję | app/history/[id].tsx | tests/audit-0.10-plan-ui.test.tsx, tests/m3-p3-postepy-historia.test.tsx, tests/scenario-full.test.tsx |
| Edytuj szablon | app/template/[id].tsx | tests/app.tsx, tests/audit-k1-fala2b.test.tsx, tests/edit-on-demand.test.tsx +2 |
| Ekran nie mógł się wyświetlić. | app/_layout.tsx | tests/audit-m1-003-boundary.test.tsx |
| Ekran włączony podczas treningu | app/more/settings.tsx | tests/i18n-wave2-ui.test.tsx, tests/i18n-wave3-ui.test.tsx, tests/i18n-wave4-ui.test.tsx +3 |
| Eksportuj backup (plik JSON) | app/more/backup.tsx | tests/interaction-patterns.test.tsx, tests/matrix-ui.test.tsx, tests/public-repo.test.ts +1 |
| Eksportuj historię do CSV | app/more/backup.tsx | tests/matrix-ui.test.tsx, tests/public-repo.test.ts, tests/scenario-full.test.tsx |
| Folder | app/template/[id].tsx | tests/edit-on-demand.test.tsx, tests/i18n-wave2.test.ts, tests/matrix-i18n.test.tsx +2 |
| Gdzie trenujesz i jaki sprzęt tam masz. | app/more/locations.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/interaction-guards.test.ts, tests/matrix-dim-langs1.test.tsx +4 |
| główne | app/template/[id].tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/audit-k1-bl-mer.test.tsx +20 |
| Godzina startu | components/WhenFields.tsx | tests/backlog-0.10.1-dane-ui.test.tsx, tests/edit-history.test.tsx, tests/matrix-ui.test.tsx +1 |
| Gotowe | app/reorder.tsx | tests/health-read-ui.test.tsx, tests/m3-components.test.tsx, tests/m3-p5-delete.test.tsx +6 |
| Guma: {b} | app/history/edit/[id].tsx | tests/audit-journey-a.test.tsx, tests/audit-journey-c.test.tsx, tests/audit-r83.test.tsx +6 |
| Gumy… | app/more/location/[id].tsx | tests/matrix-i18n.test.tsx, tests/scenario-full.test.tsx, tests/ui2-09-leftovers.test.tsx |
| Importuj | app/more/backup.tsx | tests/audit-io-more.test.tsx, tests/audit-m1-006-import-ui.test.tsx, tests/audit-r83.test.tsx +8 |
| Importuj backup | app/more/backup.tsx | tests/audit-io-more.test.tsx, tests/audit-m1-006-import-ui.test.tsx, tests/audit-r83.test.tsx +4 |
| Importuj historię z pliku CSV | app/more/backup.tsx | tests/csv-import-ui.test.tsx, tests/release-0.13.test.tsx, tests/tabs-four.test.tsx +1 |
| Inne miejsce (tylko dziś)… | components/ActiveWorkout.tsx | tests/maestro-selectors.test.ts, tests/matrix-ui.test.tsx, tests/places-ui.test.tsx +1 |
| Inne miejsce… | components/DayPanel.tsx | tests/places-ui.test.tsx |
| Inny przyrząd: {impl} | app/swap.tsx | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx +1 |
| Inny trening | components/StartPanel.tsx | tests/app.tsx, tests/audit-0.10-live.test.tsx, tests/audit-0.10-stats-ui.test.tsx +21 |
| Inny z planu | components/StartPanel.tsx | tests/home-b.test.tsx |
| Inny z planu: {name} | components/StartPanel.tsx | tests/home-b.test.tsx |
| Jak liczyć ciężar w objętości | app/exercise/[id].tsx | tests/scenario-full.test.tsx |
| jak robocza | app/exercise/[id].tsx | tests/edit-on-demand.test.tsx, tests/matrix-ui.test.tsx |
| Jednostka ciężaru w pliku | app/more/import.tsx | tests/csv-import-ui.test.tsx |
| Język | app/more/settings.tsx | tests/audit-io-flows.test.tsx, tests/audit-io-more.test.tsx, tests/flows.test.tsx +11 |
| kolor | components/BandColorInput.tsx | tests/audit-m1-025-muscle-caption.test.tsx, tests/info-tip.test.tsx, tests/progression-ui.test.tsx +1 |
| Kolor gumy | app/more/bands.tsx | tests/audit-0.10-ui.test.tsx, tests/owner-0510c.test.tsx, tests/regress.test.tsx +1 |
| Kontynuuj | components/ActiveWorkout.tsx | tests/audit-close2-a.test.tsx, tests/audit-journey-b.test.tsx, tests/audit-r72-ui.test.tsx +4 |
| Kopia zapasowa (eksport / import) | app/(tabs)/more.tsx | tests/audit-0.10-ui.test.tsx, tests/public-repo.test.ts, tests/scenario-full.test.tsx |
| Kopie automatyczne znikają razem z aplikacją — przed jej usunięciem wyeksportuj backup. | app/more/backup.tsx | tests/matrix-ui.test.tsx |
| krok | components/LoadEditor.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/audit-k1-fala2b.test.tsx +27 |
| Kroki, inne aktywności oraz tętno i kcal z zegarka — tylko do wglądu, dane zostają w Zdrowiu. | app/more/settings.tsx | tests/health-read-ui.test.tsx |
| Licencje bibliotek open source. Dotknij, by zobaczyć treść. | app/more/licenses.tsx | tests/audit-0.10-data-ui.test.tsx |
| Licencje open source | app/more/about.tsx | tests/audit-0.10-data-ui.test.tsx |
| Ładowanie cen… | app/paywall.tsx | tests/subscription-i18n.test.ts |
| Masa ciała — pomiary | app/(tabs)/progress.tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-stats-ui.test.tsx, tests/audit-k1-fala2b.test.tsx +3 |
| Masa ciała ({u}) | app/more/bodymass.tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-stats-ui.test.tsx, tests/ux2-11-bodymass-se.test.tsx |
| max na stronę | components/LoadEditor.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Miejsca i sprzęt | app/(tabs)/more.tsx | tests/audit-0.10-ui.test.tsx, tests/dashboard.test.tsx, tests/guide.test.tsx +8 |
| Miejsce | app/generator.tsx | tests/adapt-scenario.test.tsx, tests/adapt-ui.test.tsx, tests/app.tsx +14 |
| Miejsce domyślne | app/template/[id].tsx | tests/locations-ui.test.tsx, tests/places-ui.test.tsx, tests/scenario-full.test.tsx |
| Miejsce na te dni | components/DayPanel.tsx | tests/maestro-selectors.test.ts, tests/places-scenario.test.tsx, tests/places-ui.test.tsx |
| Miejsce trafi na listę miejsc (Ustawienia → Miejsca i sprzęt). | app/place-once.tsx | tests/places-ui.test.tsx |
| Miejsce treningu: {l} | app/history/edit/[id].tsx | tests/integration-090.test.tsx, tests/locations-audit.test.tsx, tests/locations-ui.test.tsx +5 |
| min na stronę | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Możliwości w kolejności | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Mój plan | app/plan.tsx | tests/audit-0.10-plan.test.ts, tests/mutation-plan.test.ts, tests/plan-own-templates-ui.test.tsx +4 |
| Napisz do nas | app/more/about.tsx | tests/audit-m1-004-start-error.test.tsx, tests/idea-request.test.tsx, tests/release-0.17.test.tsx +3 |
| Nazwa | app/exercise/[id].tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-m1-064-language-ios.test.tsx, tests/b2-plan-own-templates.test.tsx +9 |
| Nazwa planu | app/plan.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/plans-multi-ui.test.tsx, tests/ui2-08-saved-plan-title.test.tsx |
| Nie teraz | app/paywall.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts, tests/audit-m1-035-notif-denied.test.tsx +3 |
| Nie udało się otworzyć danych. | app/_layout.tsx | tests/audit-m1-004-start-error.test.tsx, tests/intro.test.tsx, tests/regress.test.tsx +1 |
| Nie udało się zapisać danych | app/(tabs)/index.tsx | tests/audit-m1-006-import-ui.test.tsx, tests/audit-m1-006-import.test.ts, tests/matrix-ui.test.tsx +1 |
| Nie udało się zapisać kopii po treningu | app/(tabs)/index.tsx | tests/audit-m1-008-kopia-ui.test.tsx |
| Nie zamieniaj: {name} | components/WorkoutBlocks.tsx | tests/scenario-full.test.tsx, tests/swap-alternates.test.tsx |
| Notatka | app/template/[id].tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/audit011b.test.tsx +5 |
| Notatka do treningu | app/history/edit/[id].tsx | tests/edit-history.test.tsx, tests/finish-single-button.test.tsx, tests/scenario-full.test.tsx |
| Notatki techniczne | app/exercise/[id].tsx | tests/edit-on-demand.test.tsx, tests/scenario-full.test.tsx |
| Nowe ćwiczenie | app/more/import.tsx | tests/csv-import-ui.test.tsx, tests/edit-on-demand.test.tsx, tests/scenario-full.test.tsx |
| np. samopoczucie, ból, sprzęt | app/history/edit/[id].tsx | tests/matrix-ui.test.tsx |
| O aplikacji | app/(tabs)/more.tsx | tests/audit-0.10-data-ui.test.tsx, tests/public-repo.test.ts, tests/release-0.17.test.tsx +2 |
| Obciążenie partii (z katalogu) | app/exercise/[id].tsx | tests/catalog-v2.test.ts |
| od | components/LoadEditor.tsx | tests/a11y-routes.ts, tests/access.test.ts, tests/adapt-logic.test.ts +286 |
| Odhacz bez pomiaru | components/NowBoard.tsx | tests/audit-0.10-live.test.tsx, tests/m3-p2-board-ui.test.tsx, tests/matrix-tuleja.test.tsx |
| Odhacz bez pomiaru: {ex}, seria {n} | components/NowBoard.tsx | tests/audit-0.10-live.test.tsx, tests/m3-p2-board-ui.test.tsx |
| Odrzuć | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-ui.test.tsx, tests/audit-close2-a.test.tsx +11 |
| Odrzuć trening | app/history/edit/[id].tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-ui.test.tsx, tests/edit-history.test.tsx +6 |
| Odrzuć zmiany | app/_layout.tsx | tests/audit-k1-fala2b.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx, tests/edit-history.test.tsx +4 |
| OK | app/generator.tsx | tests/asc-metadane.test.ts, tests/audit-0.10-gen-ui.test.tsx, tests/audit-m1-045-store-description.test.ts +25 |
| Opcje ćwiczenia: {name} | components/ExMenuButton.tsx | tests/audit-m1-028-delete-menus.test.tsx, tests/swipe-delete.test.tsx |
| Opcje treningu | components/ActiveWorkout.tsx | tests/m3-components.test.tsx, tests/m3-p2-board-ui.test.tsx, tests/matrix-ui.test.tsx |
| opcjonalne pole, nie wpływa na objętość | app/more/settings.tsx | tests/matrix-ui.test.tsx |
| Opcjonalnie, tylko w telefonie. Potrzebna do e1RM w podciąganiu i pompkach. | app/more/bodymass.tsx | tests/audit-0.10-stats-ui.test.tsx |
| Otwórz Ustawienia iOS | app/more/settings.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-m1-035-notif-denied.test.tsx, tests/i18n-variants.test.ts +3 |
| Partia | app/exercise/[id].tsx | tests/audit-k1-fala2b.test.tsx, tests/edit-on-demand.test.tsx, tests/interaction-guards.test.ts +4 |
| Partie główne (1 seria) | app/exercise/[id].tsx | tests/edit-on-demand.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Partie pomocnicze (0,5 serii) | app/exercise/[id].tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Partie z większą objętością | app/progression.tsx | tests/progression-ui.test.tsx |
| Pauza — czas treningu stoi. Odhaczenie serii wznawia. | components/ActiveWorkout.tsx | tests/pause.test.tsx |
| Pełna wersja | components/SubscriptionCard.tsx | tests/iap-localizations.test.ts, tests/store-adapter.test.ts, tests/subscription-i18n.test.ts +1 |
| Plan z moich szablonów | app/plan.tsx | tests/audit011b.test.tsx, tests/dashboard.test.tsx, tests/home-b.test.tsx +7 |
| Plan z Twoich szablonów — do przejrzenia. Szablony bez zmian. | components/OwnPlan.tsx | tests/plan-own-templates-ui.test.tsx |
| Planowanie | app/(tabs)/history.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/dashboard.test.tsx +20 |
| Plik JSON z całą historią i szablonami. Import przyjmuje ten sam format. | app/more/backup.tsx | tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx, tests/matrix-dim-langs3.test.tsx +2 |
| Pliki → Na moim iPhonie → {app} → Backup, ostatnie {n} | app/more/settings.tsx | tests/audit-m1-004-start-error.test.tsx, tests/i18n-wave4.test.ts, tests/xcheck-0610.test.tsx |
| Podpowiedź progresji | app/more/settings.tsx | tests/audit-m1-046-047-claims.test.tsx, tests/matrix-ui.test.tsx, tests/phone-p1.test.tsx +1 |
| Podsumowanie | components/PeriodSummary.tsx | tests/e2e-shards.test.ts, tests/period-summary.test.tsx |
| Pokazuj dane z Apple Health | app/more/settings.tsx | tests/health-permissions.test.ts, tests/health-read-ui.test.tsx, tests/health-scenario.test.tsx |
| Pokaż | app/guide.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx +15 |
| Pokaż szablony | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/m3-p4-generator.test.tsx, tests/ui2-06-gen-back-to-plan.test.tsx |
| Pokaż więcej ({n}) | app/swap.tsx | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| Pokaż więcej ćwiczeń: zostało {n} | app/swap.tsx | tests/catalog-full.test.tsx, tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| Pokaż wszystkie | app/(tabs)/history.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/history-calendar.test.tsx |
| Pokaż wszystkie ({n}) | app/plan.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Pokaż: {name} | app/guide.tsx | tests/guide.test.tsx, tests/tabs-four.test.tsx |
| Połącz z następnym w superset | app/template/[id].tsx | tests/flows.test.tsx, tests/guide.test.tsx, tests/scenario-full.test.tsx +1 |
| Pomiń | components/ActiveWorkout.tsx | tests/adapt-scenario.test.tsx, tests/adapt-ui.test.tsx, tests/audit-0.10-live.test.tsx +15 |
| Pomiń dziś | app/swap.tsx | tests/adapt-scenario.test.tsx, tests/adapt-ui.test.tsx, tests/audit-0.10-live.test.tsx +7 |
| Pomiń dziś: {name} | app/swap.tsx | tests/adapt-scenario.test.tsx, tests/adapt-ui.test.tsx, tests/audit-0.10-live.test.tsx +2 |
| Ponów teraz | app/more/settings.tsx | tests/audit-0.10-data-ui.test.tsx |
| Poproś o nową funkcję | app/more/about.tsx | tests/idea-request.test.tsx, tests/release-0.20.test.tsx, tests/whats-new.test.tsx |
| Poprzednich danych nie dało się odczytać | app/(tabs)/index.tsx | tests/audit-0.10-ui.test.tsx, tests/matrix-ui.test.tsx, tests/regress.test.tsx |
| Posłuchaj przykładu | app/more/settings.tsx | tests/voice-ui.test.tsx |
| Postęp treningu: {d} z {n} serii | components/ActiveWorkout.tsx | tests/audit-0.10-ui.test.tsx, tests/audit-backlog-r75.test.tsx, tests/m3-p2-board-ui.test.tsx +2 |
| Postęp tygodnia: {p}% planu, zrobione {done} z {n} treningów z planu | components/WeekStacks.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/dashboard.test.tsx, tests/matrix-i18n.test.tsx +2 |
| Postępy | app/exercise/[id].tsx | tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/backlog-0.10.1-dane.test.ts +23 |
| pow. | app/history/edit/[id].tsx | tests/audit-0.10-tst-ui.test.tsx, tests/audit-records-ui.test.tsx, tests/edit-history.test.tsx +5 |
| pow. od | app/template/[id].tsx | tests/audit-0.10-tst-ui.test.tsx |
| Powiadamiaj | components/ActiveWorkout.tsx | tests/audit-m1-035-notif-denied.test.tsx, tests/m3-p2-board-ui.test.tsx |
| Powtórz ostatni | components/StartPanel.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-ui.test.tsx, tests/audit-close2-b.test.tsx +7 |
| Powtórz ostatni ({name}) | components/StartPanel.tsx | tests/audit-0.10-ui.test.tsx, tests/audit-close2-b.test.tsx, tests/b2-plan-own-templates.test.tsx +4 |
| Powtórzenia | app/history/edit/[id].tsx | tests/audit-0.10-ui.test.tsx, tests/audit-close2-b.test.tsx, tests/audit-journey-a.test.tsx +12 |
| Poziom (1–7) | app/more/bands.tsx | tests/phone-p1.test.tsx, tests/regress.test.tsx, tests/scenario-full.test.tsx |
| Poziom: 1 = cienka, 7 = bardzo gruba. | app/more/bands.tsx | tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx, tests/matrix-dim-langs3.test.tsx +3 |
| Propozycja {n}: {name} | app/swap.tsx | tests/adapt-scenario.test.tsx, tests/adapt-ui.test.tsx, tests/generator-ui.test.tsx +8 |
| Propozycja do przejrzenia przed zapisem. | app/generator.tsx | tests/generator-ui.test.tsx |
| Prywatność | app/more/about.tsx | tests/legal-links.test.tsx, tests/subscription-i18n.test.ts |
| Przeciągnij za ≡, by zmienić kolejność. | app/reorder.tsx | tests/matrix-ui.test.tsx |
| Przerwa (s) | app/template/[id].tsx | tests/audit-0.10-ui.test.tsx, tests/regress.test.tsx, tests/scenario-full.test.tsx |
| Przerwa po rozgrzewce | app/exercise/[id].tsx | tests/scenario-full.test.tsx |
| Przerwa po rozgrzewce (s) | app/exercise/[id].tsx | tests/scenario-full.test.tsx |
| Przerwa robocza | app/exercise/[id].tsx | tests/edit-on-demand.test.tsx, tests/scenario-full.test.tsx |
| Przerwa robocza (s) | app/exercise/[id].tsx | tests/scenario-full.test.tsx |
| Przerwa zamiennika (s): {name} | app/template/[id].tsx | tests/swap-alternates.test.tsx |
| Przerwa: {s} | components/WorkoutBlocks.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/regress.test.tsx +1 |
| Przesuń albo pomiń | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/guide.test.tsx +4 |
| Przewodnik | app/(tabs)/more.tsx | tests/audit-0.10-ui.test.tsx, tests/dashboard.test.tsx, tests/edit-on-demand.test.tsx +3 |
| Przewodnik po funkcjach | components/Dashboard.tsx | tests/audit-0.10-ui.test.tsx, tests/dashboard.test.tsx, tests/edit-on-demand.test.tsx +1 |
| Przypomnienie o treningu z planu | app/more/settings.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts, tests/backlog-0.10.1-dane-ui.test.tsx +4 |
| Przywróć | components/WorkoutBlocks.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/backlog-0410.test.tsx +10 |
| Przywróć „{name}” | app/exercises.tsx | tests/audit-k1-fala2b.test.tsx, tests/backlog-0410.test.tsx, tests/matrix-logic.test.tsx +2 |
| Przywróć ćwiczenie: {name} | components/WorkoutBlocks.tsx | tests/skip-today.test.tsx |
| Przywróć z planu | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/plan-calendar-ui.test.tsx, tests/plan-own-templates-ui.test.tsx |
| Przywróć zakupy | app/paywall.tsx | tests/subscription-i18n.test.ts, tests/subscription-ui.test.tsx |
| Pusty trening | app/history/add.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-ui.test.tsx, tests/audit-r82.test.tsx +14 |
| rano o {h}:00 w dniu zaplanowanego treningu | app/more/settings.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/plan-reminder.test.tsx |
| Rekord: {list} | components/WorkoutBlocks.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/matrix-i18n.test.tsx |
| Rozgrzewka (W) | app/template/[id].tsx | tests/scenario-full.test.tsx |
| RPE / RIR przy serii | app/more/settings.tsx | tests/flows.test.tsx, tests/matrix-ui.test.tsx, tests/phone-p1.test.tsx +1 |
| Seria {n} do uzupełnienia — {ex} | components/WorkoutBlocks.tsx | tests/watch-fill-ui.test.tsx |
| Seria {n} uzupełniona — {ex} | components/WorkoutBlocks.tsx | tests/watch-fill-ui.test.tsx |
| Seria {n} zrobiona — {ex} | components/WorkoutBlocks.tsx | tests/audit-0.10-live.test.tsx, tests/audit-close2-a.test.tsx, tests/audit-close2-b.test.tsx +18 |
| Seria {n}, typ: {k} | app/history/edit/[id].tsx | tests/audit-0.10-lang-ui.test.tsx, tests/audit-close2-b.test.tsx, tests/audit-journey-c.test.tsx +5 |
| Seria normalna | app/template/[id].tsx | tests/scenario-full.test.tsx |
| Seria zrobiona | components/NowBoard.tsx | tests/audit-0.10-live.test.tsx, tests/guide.test.tsx, tests/karta-sprzet.test.tsx +8 |
| Seria zrobiona: {ex}, seria {n} | components/NowBoard.tsx | tests/maestro-selectors.test.ts, tests/tuleja.test.tsx |
| Sesja {d}: {s} | app/exercise/[id].tsx | tests/audit-k1-fala2b.test.tsx, tests/edit-on-demand.test.tsx, tests/scenario-full.test.tsx +1 |
| Skala wysiłku | app/more/settings.tsx | tests/effort-scale.test.tsx, tests/whats-new.test.tsx |
| Skróć przerwę o 15 sekund | components/ActiveWorkout.tsx | tests/karta-sprzet.test.tsx, tests/m3-p2-board-ui.test.tsx, tests/scenario-full.test.tsx |
| Sprawdź zgodę na powiadomienia | app/more/settings.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Spróbuj ponownie | app/paywall.tsx | tests/audit-m1-003-boundary.test.tsx, tests/audit-m1-003-guard-ui.test.tsx, tests/health-read-ui.test.tsx +3 |
| Sprzęt | app/exercise/[id].tsx | tests/audit-0.10-tst.test.ts, tests/edit-on-demand.test.tsx, tests/places-ui.test.tsx |
| Start | app/pick-template.tsx | tests/app.tsx, tests/audit-0.10-live.test.tsx, tests/audit-0.10-plan-ui.test.tsx +68 |
| Start stopera: {ex}, seria {n} | components/NowBoard.tsx | tests/audit-0.10-live.test.tsx |
| Start w tych dniach weźmie to miejsce. Nic nie zmienia się samo. | components/DayPanel.tsx | tests/places-ui.test.tsx |
| Start zaplanowanego treningu: {name} | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/deload-ui.test.tsx +2 |
| Start: {name} | app/pick-template.tsx | tests/app.tsx, tests/audit-0.10-live.test.tsx, tests/audit-0.10-ui.test.tsx +20 |
| System miar | app/more/settings.tsx | tests/audit-m1-lok07-01-imperial-dist.test.tsx, tests/m3-p5d-settings-ui.test.tsx, tests/matrix-dim-langs1.test.tsx +7 |
| Szablony | app/(tabs)/more.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/b2-plan-own-templates.test.tsx, tests/edit-history.test.tsx +19 |
| Szablony › | app/plan.tsx | tests/home-plan-header.test.tsx |
| Szczegóły w Postępach | components/Dashboard.tsx | tests/guard-ui.test.tsx |
| sztuk | components/LoadEditor.tsx | tests/matrix-i18n.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Szukaj ćwiczenia… | app/(tabs)/progress.tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/audit-m1-015-asekuracja.test.tsx +31 |
| Szukaj szablonu… | app/pick-template.tsx | tests/pick-template.test.tsx |
| talerz ({u}) | components/LoadEditor.tsx | tests/scenario-full.test.tsx, tests/swipe-delete.test.tsx |
| Technika | components/ExerciseCues.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/audit-k1-bl-mer.test.tsx, tests/audit-k1-fala2b.test.tsx +8 |
| Technika: {name} | components/ExerciseCues.tsx | tests/audit-k1-fala2b.test.tsx |
| Tempo | app/exercise/[id].tsx | tests/i18n-wave2.test.ts, tests/matrix-i18n.test.tsx, tests/scenario-full.test.tsx |
| Tempo (opcjonalnie, np. 3-1-1) | app/exercise/[id].tsx | tests/scenario-full.test.tsx |
| Trening | app/history/edit/[id].tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-live.test.tsx +91 |
| Trening zapisał się sam | app/(tabs)/index.tsx | tests/interaction-patterns.test.tsx, tests/matrix-ui.test.tsx |
| Tydzień deload (D na wykresach). | components/PeriodSummary.tsx | tests/deload-week.test.tsx |
| Tygodnie treningu bez deloadu: {n}. | components/DeloadHint.tsx | tests/deload-ui.test.tsx |
| Tylko teraz | components/WorkoutBlocks.tsx | tests/audit-0.10-ui.test.tsx, tests/regress.test.tsx, tests/scenario-full.test.tsx |
| Tylko zapisz | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/generator-ui.test.tsx, tests/m3-p4-generator.test.tsx +3 |
| Ukryj komunikat | app/(tabs)/index.tsx | tests/audit-0.10-ui.test.tsx, tests/regress.test.tsx |
| Ustaw | app/plan.tsx | tests/audit-0.10-data.test.ts, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx +56 |
| Ustaw jako aktywny | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-tst-ui.test.tsx +8 |
| Ustaw jako aktywny: {name} | app/plan.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-tst-ui.test.tsx +4 |
| Ustaw jako główne | app/more/location/[id].tsx | tests/locations-ui.test.tsx, tests/scenario-full.test.tsx |
| Ustaw miejsce | components/DayPanel.tsx | tests/maestro-selectors.test.ts, tests/places-scenario.test.tsx, tests/places-ui.test.tsx |
| Ustaw termin i szablon — serie uzupełnisz w następnym kroku. | app/history/add.tsx | tests/matrix-ui.test.tsx |
| Ustawienia | app/(tabs)/more.tsx | tests/audit-0.10-data.test.ts, tests/audit-0.10-plan-ui.test.tsx, tests/audit-m1-035-notif-denied.test.tsx +28 |
| Usunąć ćwiczenie? | app/exercise/[id].tsx | tests/m3-p4-delete.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx +2 |
| Usunąć gumę? | app/more/bands.tsx | tests/audit-r83.test.tsx, tests/audit-records-misc.test.tsx, tests/m3-p5-delete.test.tsx +6 |
| Usunąć miejsce? | app/more/location/[id].tsx | tests/audit-0.10-ui.test.tsx, tests/m3-fix-e2e-teksty.test.ts, tests/m3-p5-delete.test.tsx +3 |
| Usunąć pomiar? | app/more/bodymass.tsx | tests/audit-0.10-data-ui.test.tsx, tests/m3-p5-delete.test.tsx, tests/swipe-delete.test.tsx |
| Usunąć serię? | app/history/edit/[id].tsx | tests/audit-m1-028-delete-menus.test.tsx, tests/edit-history.test.tsx, tests/flows.test.tsx +6 |
| Usunąć szablon? | app/template/[id].tsx | tests/audit-0.10-plan-ui.test.tsx, tests/m3-components.test.tsx, tests/m3-p4-delete.test.tsx +3 |
| Usunąć talerz? | components/LoadEditor.tsx | tests/scenario-full.test.tsx, tests/swipe-delete.test.tsx |
| Usunąć ten plan? | app/plan.tsx | tests/plans-multi-ui.test.tsx, tests/swipe-delete.test.tsx |
| Usunąć z szablonu? | app/template/[id].tsx | tests/flows.test.tsx, tests/live2-split-template.test.tsx, tests/regress.test.tsx +3 |
| Usunąć z treningu? | app/history/edit/[id].tsx | tests/audit-0.10-live.test.tsx, tests/audit-m1-028-delete-menus.test.tsx, tests/edit-history.test.tsx +5 |
| Usunąć zamiennik? | app/template/[id].tsx | tests/swap-alternates.test.tsx, tests/swipe-delete.test.tsx |
| Usuń | app/template/[id].tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-live.test.tsx +31 |
| Usuń ćwiczenie | components/ExMenuButton.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-ui.test.tsx, tests/audit-m1-028-delete-menus.test.tsx +10 |
| Usuń ćwiczenie: {name} | app/history/edit/[id].tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-ui.test.tsx, tests/edit-history.test.tsx +8 |
| Usuń gumę: {name} | app/more/bands.tsx | tests/audit-r83.test.tsx, tests/audit-records-misc.test.tsx, tests/m3-p5-delete.test.tsx +5 |
| Usuń miejsce | app/more/location/[id].tsx | tests/audit-0.10-ui.test.tsx, tests/guide.test.tsx, tests/locations-ui.test.tsx +5 |
| Usuń miejsce: {name} | app/more/locations.tsx | tests/audit-0.10-ui.test.tsx, tests/locations-ui.test.tsx, tests/m3-p5-delete.test.tsx +3 |
| Usuń odznaczone | components/LoadEditor.tsx | tests/audit-0.10-ui.test.tsx, tests/m3-p5-delete.test.tsx, tests/scenario-full.test.tsx |
| Usuń plan | app/plan.tsx | tests/plans-multi-ui.test.tsx, tests/swipe-delete.test.tsx |
| Usuń plan: {name} | app/plan.tsx | tests/plans-multi-ui.test.tsx, tests/swipe-delete.test.tsx |
| Usuń pomiar: {v}, {d} | app/more/bodymass.tsx | tests/audit-0.10-data-ui.test.tsx, tests/m3-p5-delete.test.tsx, tests/swipe-delete.test.tsx |
| Usuń serię | app/template/[id].tsx | tests/audit-0.10-ui.test.tsx, tests/audit-m1-028-delete-menus.test.tsx, tests/edit-history.test.tsx +8 |
| Usuń serię {n} — {ex} | app/history/edit/[id].tsx | tests/audit-0.10-ui.test.tsx, tests/audit-m1-028-delete-menus.test.tsx, tests/edit-history.test.tsx +8 |
| Usuń sesję | app/history/[id].tsx | tests/audit-0.10-ui.test.tsx, tests/edit-history.test.tsx, tests/health-read-ui.test.tsx +6 |
| Usuń szablon | app/template/[id].tsx | tests/audit-0.10-plan-ui.test.tsx, tests/guide.test.tsx, tests/m3-components.test.tsx +4 |
| Usuń szablon: {name} | app/templates.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/scenario-full.test.tsx, tests/swipe-delete.test.tsx +1 |
| Usuń usunięte ćwiczenie z treningu | components/WorkoutBlocks.tsx | tests/matrix-ui.test.tsx, tests/swipe-delete.test.tsx |
| Usuń z biblioteki | app/exercise/[id].tsx | tests/audit-0.10-data-ui.test.tsx, tests/m3-p4-delete.test.tsx, tests/matrix-ui.test.tsx +3 |
| Usuń z biblioteki: {name} | app/exercises.tsx | tests/audit-0.10-data-ui.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx +2 |
| Usuń zakres powtórzeń | app/template/[id].tsx | tests/scenario-full.test.tsx |
| Usuń zamiennik: {name} | app/template/[id].tsx | tests/swap-alternates.test.tsx, tests/swipe-delete.test.tsx |
| Utwórz „{name}” | app/exercises.tsx | tests/audit-k1-fala2b.test.tsx, tests/backlog-0410.test.tsx, tests/matrix-logic.test.tsx +2 |
| Warunki korzystania | app/more/about.tsx | tests/legal-links.test.tsx, tests/subscription-i18n.test.ts |
| Wersja | app/more/about.tsx | tests/audit-0.10-data-ui.test.tsx, tests/idea-request.test.tsx, tests/readme.test.ts +3 |
| Wibracje | app/more/settings.tsx | tests/m3-p5d-settings-ui.test.tsx, tests/phone-p1.test.tsx, tests/regress.test.tsx +1 |
| Widok treningu | app/more/settings.tsx | tests/audit-0.10-tst-ui.test.tsx, tests/info-tip.test.tsx, tests/m3-p5d-settings-ui.test.tsx |
| Więcej informacji: {name} | components/InfoTip.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/gen-days-ui.test.tsx, tests/info-tip.test.tsx +1 |
| Więcej możliwości ({n}) | components/DayPanel.tsx | tests/plan-calendar-ui.test.tsx |
| Więcej opcji | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/deload-week.test.tsx, tests/guide.test.tsx +4 |
| Wolne | app/plan.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/b2-plan-own-templates.test.tsx +6 |
| Wróć | components/ui.tsx | tests/audit011b.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx, tests/edit-history.test.tsx +7 |
| Wróć do edycji | app/_layout.tsx | tests/audit011b.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx, tests/edit-history.test.tsx +4 |
| Wszystkie | app/picker.tsx | tests/adapt-ui.test.tsx, tests/audit-0.10-live.test.tsx, tests/guard.test.ts +5 |
| Wybierz plik CSV | app/more/import.tsx | tests/audit-m1-006-import-ui.test.tsx, tests/csv-import-ui.test.tsx |
| Wyczyść | app/more/settings.tsx | tests/audit-0.10-ui.test.tsx, tests/audit-io-more.test.tsx, tests/audit-r83.test.tsx +10 |
| Wyczyść miejsce | components/DayPanel.tsx | tests/m3-fix-e2e-teksty.test.ts, tests/maestro-selectors.test.ts, tests/places-ui.test.tsx |
| Wyczyść wszystkie dane | app/more/settings.tsx | tests/audit-0.10-ui.test.tsx, tests/audit-io-more.test.tsx, tests/audit-r83.test.tsx +7 |
| Wydłuż przerwę o 15 sekund | components/ActiveWorkout.tsx | tests/audit-0.10-lang.test.ts, tests/m3-p2-board-ui.test.tsx, tests/scenario-full.test.tsx |
| Wygeneruj szablony i plan | app/plan.tsx | tests/audit-0.10-ui.test.tsx, tests/audit-k1-bl-mer.test.tsx, tests/dashboard.test.tsx +8 |
| Wygląd | app/more/settings.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/i18n-wave4-ui.test.tsx, tests/matrix-dim-langs1.test.tsx +6 |
| Wyjmij z supersetu | app/template/[id].tsx | tests/scenario-full.test.tsx |
| Wykres słupkowy: {v} | components/Chart.tsx | tests/deload-week.test.tsx, tests/regress.test.tsx |
| Wyłącz | app/plan.tsx | tests/matrix-i18n.test.tsx, tests/plan-wczesniej-ui.test.tsx, tests/voice-ui.test.tsx +1 |
| Wypełnij | components/LoadEditor.tsx | tests/audit-0.10-ui.test.tsx, tests/audit-r82c.test.tsx, tests/locations-audit.test.tsx +3 |
| Wyślij kopię | app/(tabs)/index.tsx | tests/matrix-ui.test.tsx, tests/regress.test.tsx |
| Z szablonu | components/StartPanel.tsx | tests/app.tsx, tests/audit-0.10-stats-ui.test.tsx, tests/audit-0.10-tst-ui.test.tsx +11 |
| Zacznij trening | app/(tabs)/progress.tsx | tests/m3-p3-postepy-historia.test.tsx, tests/scenario-full.test.tsx, tests/watch-protocol.test.ts |
| Zakończ | components/ActiveWorkout.tsx | tests/adapt-scenario.test.tsx, tests/audit-0.10-live.test.tsx, tests/audit-0.10-tst-ui.test.tsx +43 |
| Zakończ i zapisz | components/ActiveWorkout.tsx | tests/audit-close2-a.test.tsx, tests/audit-close2-c.test.tsx, tests/audit-journey-b.test.tsx +2 |
| Zakończ mimo to | components/ActiveWorkout.tsx | tests/watch-fill-ui.test.tsx |
| Zakończ serię | components/ActiveWorkout.tsx | tests/audit-r72-ui.test.tsx, tests/m3-fix-e2e.test.tsx, tests/m3-p2-board-ui.test.tsx +6 |
| Zakończ serię: {ex}, seria {n} | components/NowBoard.tsx | tests/m3-p2-board-ui.test.tsx, tests/m3-p2-matrix.test.tsx, tests/matrix-ui.test.tsx |
| Zakończ trening | components/NowBoard.tsx | tests/audit-0.10-live.test.tsx, tests/finish-single-button.test.tsx, tests/guide.test.tsx +2 |
| Zakres {r}: gdy ostatnio wszystkie serie miały ≥ {n} powt., pojawi się „↑”. | app/template/[id].tsx | tests/audit-0.10-stats-ui.test.tsx, tests/matrix-ui.test.tsx |
| Zamień ćwiczenie: {name} | app/history/edit/[id].tsx | tests/audit-0.10-live.test.tsx, tests/backlog-0410.test.tsx, tests/catalog-full.test.tsx +5 |
| Zamień na zamiennik: {name} | components/WorkoutBlocks.tsx | tests/audit-m1-034-hit-areas.test.tsx, tests/swap-alternates.test.tsx |
| Zamknij | components/IdeaLink.tsx | tests/idea-request.test.tsx, tests/whats-new.test.tsx |
| Zapamiętaj | components/WorkoutBlocks.tsx | tests/regress.test.tsx, tests/scenario-full.test.tsx |
| Zapisuj zakończone treningi do Apple Health | app/more/settings.tsx | tests/health-scenario.test.tsx, tests/matrix-ui.test.tsx, tests/phone-p1.test.tsx +1 |
| Zapisz | app/history/edit/[id].tsx | tests/adapt-scenario.test.tsx, tests/app.tsx, tests/audit-0.10-data-ui.test.tsx +37 |
| Zapisz jako miejsce | app/place-once.tsx | tests/maestro-selectors.test.ts, tests/places-ui.test.tsx |
| Zapisz jako szablon | app/history/[id].tsx | tests/audit-0.10-ui.test.tsx, tests/audit011b.test.tsx, tests/m3-p3-postepy-historia.test.tsx +1 |
| Zapisz plan | components/OwnPlan.tsx | tests/gen-days-ui.test.tsx, tests/m3-p4-generator.test.tsx, tests/plan-own-templates-ui.test.tsx +1 |
| Zapisz pomiar | app/more/bodymass.tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-stats-ui.test.tsx, tests/tabs-four.test.tsx |
| Zapisz szablony i plan | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx +7 |
| Zapisz zmiany w szablonie | app/history/[id].tsx | tests/adapt-scenario.test.tsx, tests/audit-0.10-ui.test.tsx, tests/live2-split-template.test.tsx +1 |
| Zaplanuj deload od {date} | components/DeloadHint.tsx | tests/deload-ui.test.tsx, tests/guide.test.tsx |
| Zapowiedzi głosowe | app/more/settings.tsx | tests/m3-p2-board-ui.test.tsx, tests/m3-p5d-settings-ui.test.tsx, tests/release-0.20.test.tsx +4 |
| Zarządzaj subskrypcją | app/paywall.tsx | tests/subscription-i18n.test.ts |
| Zastąp | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/locations-audit.test.tsx, tests/matrix-ui.test.tsx +2 |
| Zastosuj | components/DayPanel.tsx | tests/adapt-scenario.test.tsx, tests/adapt-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx +7 |
| Zastosuj: {title} | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/places-shift-scenario.test.tsx +2 |
| Zawsze w: {l} | components/WorkoutBlocks.tsx | tests/matrix-ui.test.tsx, tests/places-ui.test.tsx, tests/scenario-full.test.tsx +1 |
| Zawsze w: {l} — {name} | components/WorkoutBlocks.tsx | tests/matrix-ui.test.tsx, tests/places-ui.test.tsx, tests/scenario-full.test.tsx +1 |
| zaznaczone: {n} z {m} | app/more/location/[id].tsx | tests/scenario-full.test.tsx |
| Zdejmij oznaczenie deload | components/DeloadHint.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/deload-ui.test.tsx |
| Zmień kolejność ćwiczeń | app/template/[id].tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Zmień kolejność: {name} | components/DragList.tsx | tests/reorder-t010.test.tsx, tests/scenario-full.test.tsx |
| Zmień w ustawieniach iOS | app/more/language.tsx | tests/audit-m1-064-language-ios.test.tsx |
| Zmierz | components/WorkoutBlocks.tsx | tests/audit-close-b.test.tsx, tests/audit-close2-c.test.tsx, tests/audit-final-timer.test.tsx +4 |
| Zostaw | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/ux2-08-gen-replace-active.test.tsx |
| Zrealizuj kod | app/paywall.tsx | tests/subscription-i18n.test.ts |

## TEKST

| Pozycja | Źródło | Testy (pierwsze 3) |
|---|---|---|
| „⇄ zamień” przy ćwiczeniu zamienia je na inne tylko w tym treningu — szablon zostaje. | lib/guide.ts | tests/guide.test.tsx |
| „≥” — w zaplanowanych szablonach {n} {s} nie ma ciężaru ani powtórzeń (i nie ma „Poprzednio”): liczą się do serii, ale nie do objętości. | app/progression.tsx | tests/progression-ui.test.tsx |
| „Archiwizuj” w podglądzie chowa szablon; usuniesz go przyciskiem „Usuń szablon” na dole podglądu albo przesunięciem w lewo na liście (z potwierdzeniem). | lib/guide.ts | tests/guide.test.tsx |
| „Bez ograniczeń sprzętu” = pełna siłownia (sztanga, hantle, maszyny i wyciągi). | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx |
| „do” jest mniejsze niż „od” — zakres pokaże się jako {n}+ | app/template/[id].tsx | tests/scenario-full.test.tsx |
| „Dopisz trening wstecz” zapisze trening, którego nie zapisałeś na bieżąco; z dnia w zakładce Plan jest ten sam przycisk. | lib/guide.ts | tests/guide.test.tsx |
| „Pomiń dziś” pomija resztę serii ćwiczenia w tym treningu. | lib/guide.ts | tests/guide.test.tsx |
| „Poproś o nową funkcję” obok „Napisz do nas” w Więcej → O aplikacji. | lib/whatsnew.ts | tests/release-0.20.test.tsx, tests/whats-new.test.tsx |
| „Strażnik progresji” w Postępach: sylwetka z kierunkiem progresu oraz zdanie o brakach do celu z uwzględnieniem planu. | lib/whatsnew.ts | tests/release-0.20.test.tsx, tests/whats-new.test.tsx |
| „Technika”: wskazówki do ćwiczenia otworzysz też z treningu i z szablonu. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| „Wygeneruj szablony i plan” (Szablony albo Planowanie): wybierz cel, miejsce, liczbę i długość sesji. | lib/guide.ts | tests/guide.test.tsx |
| (kopia) | lib/locations.ts | tests/backlog-0.10.1-dane.test.ts, tests/locations-model.test.ts, tests/locations-ui.test.tsx +2 |
| (usunięte miejsce) | lib/locations.ts | tests/audit-0.10-ui.test.tsx, tests/integration-090.test.tsx, tests/locations-model.test.ts +3 |
| {app} tworzy niezależny deweloper: bez reklam, bez zbierania danych. Jeśli Ci pomaga, wybierz plan i trenuj bez limitu. Darmowe dni wracają {date}. | app/paywall.tsx | tests/subscription-i18n.test.ts, tests/subscription-ui.test.tsx |
| {c}, poziom {n} | lib/state/sets.ts | tests/flows.test.tsx, tests/regress.test.tsx, tests/scenario-full.test.tsx |
| {cur} wobec {prev} | app/progression.tsx | tests/guard-ui.test.tsx, tests/guard.test.ts, tests/progression-ui.test.tsx |
| {d} + {w} pośrednio ({n} {s} po {share}) | components/GuardSection.tsx | tests/guard-ui.test.tsx, tests/muscle-map.test.tsx, tests/regress.test.tsx +4 |
| {d} + {w} pośrednio ({n} {s}) | lib/setSplit.ts | tests/guard-ui.test.tsx, tests/muscle-map.test.tsx, tests/regress.test.tsx +4 |
| {d} bezpośrednio, {w} pośrednio (serie pomocnicze: {n}) | lib/setSplit.ts | tests/muscle-map.test.tsx, tests/set-goals-ui.test.tsx, tests/set-split-ui.test.tsx +2 |
| {ex} — {n} min, umiarkowane tempo | app/generator.tsx | tests/generator-ui.test.tsx |
| {ex} — {s} × {a}–{b}, przerwa {r} | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/gen-general-ui.test.tsx, tests/generator-ui.test.tsx +6 |
| {goal}, {n}× w tygodniu · {place} | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/gen-days-ui.test.tsx +9 |
| {k} dzień siłowy w tygodniu to mniej niż zalecenie WHO 2020 (co najmniej {n} dni). Na początek to dobry krok: według wytycznych USA 2018 na początku można ćwiczyć siłowo tylko {k} dzień w tygodniu, a z czasem dojść do {n} — trochę ruchu jest lepsze niż żaden. | lib/generator.ts | tests/audit011b.test.tsx, tests/gen-general-ui.test.tsx, tests/gen-general.test.ts +1 |
| {k}: {v} | lib/stats.ts | (tylko parametry) |
| {label} {value}, pierwszy wynik | components/RecordsCard.tsx | tests/records-card.test.tsx |
| {label} {value}, przyrost {delta} | components/RecordsCard.tsx | tests/records-card.test.tsx |
| {left} {n} z {limit} darmowych dni treningowych w tym miesiącu. | components/StartPanel.tsx | tests/subscription-i18n.test.ts, tests/subscription-ui.test.tsx |
| {n} {w} · Dostosuj | components/ActiveWorkout.tsx | tests/adapt-ui.test.tsx, tests/maestro-selectors.test.ts, tests/places-ui.test.tsx |
| {n} / {goal} serii | components/GuardSection.tsx | tests/adapt-ui.test.tsx, tests/architecture-limits.test.ts, tests/audit-0.10-gen-ui.test.tsx +82 |
| {n} h | components/Dashboard.tsx | (tylko parametry) |
| {n} kcal aktywne | lib/healthRead.ts | tests/health-read-ui.test.tsx, tests/health-read.test.ts, tests/health-scenario.test.tsx |
| {n} kilokalorii aktywnych | lib/healthRead.ts | tests/health-read-ui.test.tsx, tests/health-read.test.ts |
| {n} km | lib/state/time.ts | tests/audit-0.10-lang.test.ts, tests/audit-m1-lok07-01-imperial-dist.test.tsx, tests/csv-import-logic.test.ts +11 |
| {n} m | lib/state/time.ts | (tylko parametry) |
| {n} mi | lib/state/time.ts | tests/a11y-routes.ts, tests/access.test.ts, tests/adapt-logic.test.ts +286 |
| {n} rozgrz. | app/history/edit/[id].tsx | tests/audit-0.10-stats-ui.test.tsx, tests/scenario-full.test.tsx |
| {n} s | lib/state/time.ts | (tylko parametry) |
| {n} yd | lib/state/time.ts | tests/architecture-limits.test.ts, tests/audit-0.10-data.test.ts, tests/audit-0.10-gen-ui.test.tsx +68 |
| {n} z {m} | app/more/location/[id].tsx | (tylko parametry) |
| {name} · w planie na: {day} | components/StartPanel.tsx | tests/home-b.test.tsx |
| {name}, wybrany | app/more/language.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx |
| {name}: {n}× w tygodniu | components/OwnPlan.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit-0.10-plan.test.ts +12 |
| {p} zastąpi ciężary wpisane dla: {i}. | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| {p}% planu tygodnia ({done} z {n}) | components/WeekStacks.tsx | tests/dashboard.test.tsx, tests/matrix-i18n.test.tsx, tests/motyw.test.tsx +1 |
| {price} jednorazowo | app/paywall.tsx | tests/m5s1-bez-proby.test.ts, tests/subscription-i18n.test.ts, tests/subscription-ui.test.tsx |
| {price}/{period} | app/paywall.tsx | (tylko parametry) |
| {u}/hant. | lib/state/sets.ts | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx +2 |
| {u}/hantel | lib/state/sets.ts | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx +5 |
| {u}/str. | lib/state/sets.ts | tests/audit-k1-brands.test.ts, tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx +4 |
| {u}/strona | lib/state/sets.ts | tests/matrix-ui.test.tsx |
| {u}/stronę | lib/state/sets.ts | tests/audit-r82.test.tsx |
| {v} · pomiar z {d} | app/(tabs)/progress.tsx | tests/audit-0.10-data-ui.test.tsx, tests/tabs-four.test.tsx |
| {v} ({p}% masy ciała {d}) | lib/stats.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-stats-ui.test.tsx, tests/audit-k1-mer.test.tsx |
| {v} (masa ciała {d}) | lib/stats.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/audit-0.10-stats-ui.test.tsx +3 |
| {v} z {d}. Treningi z tego okresu przeliczą e1RM z wcześniejszego pomiaru (albo bez e1RM, gdy go nie ma). | app/more/bodymass.tsx | tests/audit-0.10-data-ui.test.tsx |
| ↑ {label} {value} ({delta}) | components/RecordsCard.tsx | (tylko parametry) |
| ↑ {label} {value} (pierwszy wynik) | components/RecordsCard.tsx | tests/records-card.test.tsx |
| ↑ spróbuj {n} pow. | components/WorkoutBlocks.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-stats-ui.test.tsx, tests/audit-backlog-r75.test.tsx +6 |
| ↑ spróbuj {v} | components/WorkoutBlocks.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-stats-ui.test.tsx, tests/audit-backlog-r75.test.tsx +6 |
| ↑ spróbuj bez asysty | components/WorkoutBlocks.tsx | tests/audit-backlog-r75.test.tsx |
| + {n} {w} | components/TodayPlan.tsx | (tylko parametry) |
| ●●● główna · ●● pomocnicza · ● stabilizacja | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| ★ Miejsce główne — domyślne dla nowych treningów i szablonów bez własnego miejsca. | app/more/location/[id].tsx | tests/scenario-full.test.tsx |
| 10 nowych języków: niemiecki, francuski, włoski, niderlandzki, szwedzki, duński, norweski, fiński, turecki i grecki. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| 16 języków; wygląd jasny, ciemny albo jak w telefonie. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| 2 tyg. temu | app/progression.tsx | tests/audit-m1-032-total-bars.test.tsx, tests/period-bars.test.tsx, tests/progression-ui.test.tsx |
| 20 nowych ćwiczeń ze wskazówkami w sekcji „Technika”. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| 35 języków; język zmienisz w Ustawieniach. | lib/whatsnew.ts | tests/release-0.12.test.tsx, tests/whats-new.test.tsx |
| 9 nowych języków: {list}. | lib/whatsnew.ts | tests/release-0.12.test.tsx, tests/whats-new.test.tsx |
| Aktualizacja współpracy z Apple Health — zapis treningów działa jak dotąd. | lib/whatsnew.ts | tests/release-0.15.test.tsx, tests/whats-new.test.tsx |
| aktywny | app/plan.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-tst-ui.test.tsx +19 |
| Aktywny plan | app/plan.tsx | tests/plan-wczesniej-ui.test.tsx |
| Anuluj edycję ćwiczenia | app/exercise/[id].tsx | tests/edit-on-demand.test.tsx |
| Anuluj edycję sesji | app/history/edit/[id].tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Anuluj edycję szablonu | app/template/[id].tsx | tests/audit-k1-fala2b.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx, tests/edit-on-demand.test.tsx +2 |
| Aplikacja korzysta z bibliotek open source. Niżej licencje (dotknij, by zobaczyć treść) oraz wszystkie pakiety npm, od których zależy aplikacja — także narzędzia budowania — z licencją i notką o prawach autorskich. | app/more/licenses.tsx | tests/audit-0.10-data-ui.test.tsx |
| Aplikacja nie udziela porad medycznych. Przy bólu, urazie lub chorobie skonsultuj się z lekarzem lub fizjoterapeutą. | components/ExerciseCues.tsx | tests/audit-0.10-ui.test.tsx, tests/audit-m1-049-critical-content.test.ts, tests/cues.test.tsx +1 |
| Aplikacja nie zbiera danych: wszystko, co wpisujesz, zostaje w telefonie, bez konta, reklam i analityki. | app/more/about.tsx | tests/audit-0.10-data-ui.test.tsx, tests/support-mail.test.tsx |
| Aplikacja zamknęła się nieoczekiwanie przy ostatnich uruchomieniach. | lib/state/boot.ts | tests/audit-m1-003-guard-ui.test.tsx |
| Aplikacja zamknęła się w trakcie edycji ćwiczenia „{name}”. Wrócić do edycji? | app/_layout.tsx | tests/backlog-0.10.1-dane-ui.test.tsx |
| Aplikacja zamknęła się w trakcie edycji szablonu „{name}”. Wrócić do edycji? | app/_layout.tsx | tests/audit011b.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx |
| Apple Health | components/HealthLines.tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/audit-m1-013-privacy.test.ts +23 |
| Apple Health (zegarek) | lib/healthRead.ts | tests/health-read-ui.test.tsx, tests/health-read.test.ts, tests/health-scenario.test.tsx |
| Apple Health nie jest dostępne na tym urządzeniu. | app/more/settings.tsx | tests/health-read-ui.test.tsx |
| Apple Health niedostępne | app/more/settings.tsx | tests/health-read-ui.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Apple Health… | components/HealthLines.tsx | tests/health-read-ui.test.tsx, tests/i18n-wave2.test.ts, tests/i18n-wave3.test.ts +2 |
| Apple Watch: odhaczanie serii, przerwa z timerem i „Cofnij” przez 5 sekund (watchOS 10 lub nowszy). | lib/whatsnew.ts | tests/release-0.20.test.tsx, tests/whats-new.test.tsx |
| Archiwizować szablon? | app/template/[id].tsx | tests/audit-0.10-plan-ui.test.tsx |
| Archiwum | app/history/add.tsx | tests/audit-0.10-ui.test.tsx, tests/audit-m1-workflows.test.ts, tests/public-repo.test.ts +1 |
| Asekuracja | components/ExerciseCues.tsx | tests/audit-m1-015-asekuracja.test.tsx, tests/audit-m1-031-asekuracja-zakres.test.tsx, tests/audit-m1-049-critical-content.test.ts +1 |
| asysta gumą: {v} | components/EquipVisual.tsx | tests/audit-0.10-tst-ui.test.tsx |
| asysta: {v} | components/EquipVisual.tsx | tests/karta-sprzet.test.tsx |
| Automatyczna kopia po każdym treningu trafia do Plików (Ustawienia). | lib/guide.ts | tests/guide.test.tsx, tests/i18n-wave2.test.ts, tests/i18n-wave3.test.ts |
| Automatyczna kopia po każdym treningu: Pliki → Na moim iPhonie → {app} → Backup. | components/StartError.tsx | tests/audit-m1-004-start-error.test.tsx |
| Automatycznie ({n}) | app/more/settings.tsx | tests/set-goals-ui.test.tsx, tests/set-goals.test.ts |
| Backup treningów | lib/backup.ts | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| Backup z nowszej wersji aplikacji | app/more/backup.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| badania naukowe | components/ExerciseCues.tsx | tests/audit-k1-bl-mer.test.tsx, tests/cues-014.test.tsx |
| bez asekuracji w stojakach | app/generator.tsx | tests/audit-m1-015-asekuracja.test.tsx, tests/audit-m1-031-asekuracja-zakres.test.tsx, tests/audit-m1-049-critical-content.test.ts +1 |
| bez ciężaru | components/GuardSection.tsx | tests/guard-ui.test.tsx, tests/integration-090.test.tsx, tests/interaction-guards.test.ts +2 |
| Bez e1RM: brak źródeł, jaką część masy ciała podnosisz w tym ćwiczeniu. | components/ExerciseProgress.tsx | tests/audit-0.10-stats-ui.test.tsx |
| bez miejsca | app/history/edit/[id].tsx | tests/bar-no-plates.test.tsx, tests/integration-090.test.tsx, tests/matrix-ui.test.tsx |
| Bez nowych rekordów w tym okresie. | components/PeriodSummary.tsx | tests/period-summary.test.tsx |
| Bez planu tygodnia | components/TodayPlan.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/home-b.test.tsx +3 |
| bez porównania | lib/guard.ts | tests/guard-ui.test.tsx, tests/guard.test.ts, tests/progression-ui.test.tsx |
| bez serii | lib/guard.ts | tests/guard-ui.test.tsx, tests/matrix-data-shared.ts, tests/matrix-invariants.test.ts +4 |
| Bez serii: {list} | components/GuardSection.tsx | tests/guard-ui.test.tsx |
| bez szablonu | components/StartPanel.tsx | tests/audit-close2-b.test.tsx |
| bez treningów | app/plan.tsx | tests/plans-multi-ui.test.tsx |
| Bez treningów i poza aktywnym planem: {list}. „Zastąp” je usunie, „Zostaw” doda nowe obok. | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/ux2-08-gen-replace-active.test.tsx |
| Bez treningów: {list}. To zastąpi też aktywny plan „{plan}”, zrobiony tylko z tych szablonów — „Zastąp” je usunie i ustawi nowy plan jako aktywny w jego miejsce, „Zostaw” doda nowe obok. | app/generator.tsx | tests/ux2-08-gen-replace-active.test.tsx |
| Bez zakupu: do {n} dni treningowych w miesiącu; historia, kopia i eksport zawsze dostępne. | app/paywall.tsx | tests/subscription-i18n.test.ts, tests/subscription-ui.test.tsx |
| bezpośrednie | components/ProgressBars.tsx | tests/set-split-ui.test.tsx |
| biblioteki ćwiczeń organizacji szkoleniowych | components/ExerciseCues.tsx | tests/audit-k1-bl-mer.test.tsx, tests/cues-014.test.tsx, tests/cues.test.tsx |
| Biblioteki natywne iOS spoza npm ({n}) | app/more/licenses.tsx | tests/licenses-native.test.tsx |
| brak | app/history/edit/[id].tsx | tests/adapt-ui.test.tsx, tests/app.tsx, tests/audit-0.10-lang-ui.test.tsx +71 |
| brak ciężarów — podpowiedź „↑” jak bez miejsca | components/LoadEditor.tsx | tests/bar-no-plates.test.tsx, tests/matrix-ui.test.tsx |
| Brak ćwiczeń — dodaj pierwsze. | app/history/edit/[id].tsx | tests/edit-history.test.tsx, tests/scenario-full.test.tsx |
| Brak ćwiczeń dostępnych w tym miejscu. | app/generator.tsx | tests/generator-ui.test.tsx |
| Brak ćwiczeń na: {list}. | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/mutation-generator.test.ts +1 |
| brak danych | components/ProgressBars.tsx | tests/period-bars.test.tsx, tests/scenario-full.test.tsx, tests/set-goals-ui.test.tsx +2 |
| Brak danych do wykresu. | components/Chart.tsx | tests/regress.test.tsx |
| Brak danych z Apple Health dla tego dnia. Jeśli dane powinny być, sprawdź dostęp w aplikacji Zdrowie: profil → Aplikacje → {app}. | components/HealthLines.tsx | tests/health-read-ui.test.tsx |
| Brak głosu dla języka aplikacji w tym telefonie. Pobierz go w Ustawieniach iOS (Dostępność). | app/more/settings.tsx | tests/voice-ui.test.tsx |
| Brak gum. Dodaj pierwszą, by zapisywać asystę przy podciąganiu. | app/more/bands.tsx | tests/matrix-ui.test.tsx |
| Brak miejsc — wszystkie ćwiczenia są dostępne, a podpowiedzi działają jak dotąd. | app/more/locations.tsx | tests/motyw.test.tsx, tests/scenario-full.test.tsx |
| Brak odhaczonych serii | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/flows.test.tsx, tests/matrix-ui.test.tsx +3 |
| Brak podobnych ćwiczeń w tym miejscu — rozwiń „Inne”. | app/swap.tsx | tests/audit-0.10-lang.test.ts, tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| Brak pomiarów. | app/more/bodymass.tsx | tests/audit-0.10-data-ui.test.tsx, tests/interaction-guards.test.ts, tests/interaction-patterns.test.tsx |
| brak poprzedniego okresu | lib/progress.ts | tests/progress.test.ts, tests/progression-ui.test.tsx |
| brak poprzedniego tygodnia | components/GuardSection.tsx | tests/guard-ui.test.tsx |
| Brak serii w tym i poprzednim okresie. | components/ProgressBars.tsx | tests/progression-ui.test.tsx |
| Brak serii w tym i poprzednim tygodniu. | components/MuscleCompare.tsx | tests/matrix-ui.test.tsx |
| Brak serii w tym tygodniu. | components/Dashboard.tsx | tests/guard-ui.test.tsx, tests/progression-ui.test.tsx |
| Brak sesji. | app/history/[id].tsx | tests/edit-history.test.tsx, tests/interaction-guards.test.ts, tests/m3-p3-postepy-historia.test.tsx |
| brak sprzętu w: {l} | app/template/[id].tsx | tests/locations-ui.test.tsx, tests/swap-alternates.test.tsx, tests/swap-ui.test.tsx |
| Brak szablonów — dodaj pierwszy. | app/templates.tsx | tests/audit-0.10-ui.test.tsx, tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx +4 |
| Brak szablonów z ćwiczeniami — utworzysz je w Więcej → Szablony. Możesz też zacząć od pustego treningu. | app/history/add.tsx | tests/edit-history.test.tsx |
| Brak treningów w tym i poprzednim okresie. | app/progression.tsx | tests/progression-ui.test.tsx |
| Brak treningów w tym miesiącu. | app/(tabs)/history.tsx | tests/audit-0.10-ui.test.tsx |
| Brak treningów w tym okresie. | components/PeriodSummary.tsx | tests/period-summary.test.tsx |
| Brak zapisanych sesji z tym ćwiczeniem. | app/(tabs)/progress.tsx | tests/m3-p3-postepy-historia.test.tsx |
| Brak zgody | app/more/settings.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-m1-035-notif-denied.test.tsx, tests/i18n-wave2.test.ts +4 |
| Brak zgody na powiadomienia — przypomnienia i koniec przerwy nie przyjdą. Zgodę włączysz w Ustawieniach iOS. | app/more/settings.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-m1-035-notif-denied.test.tsx |
| Brak zgody na zapis treningów. Włącz ją w aplikacji Zdrowie: profil → Aplikacje → {app}. | app/more/settings.tsx | tests/i18n-wave2.test.ts, tests/i18n-wave3.test.ts, tests/i18n-wave4.test.ts +1 |
| brak: {m} | app/adapt.tsx | tests/adapt-ui.test.tsx, tests/audit-m1-015-asekuracja.test.tsx, tests/locations-ui.test.tsx +2 |
| Był skrócony w tygodniu deload: {a} zamiast {b} serii roboczych. Powtórzyć pełny trening? | lib/start.ts | tests/audit-0.10-live.test.tsx |
| Cały rok treningów, rozliczany rocznie. | app/paywall.tsx | tests/subscription-i18n.test.ts, tests/subscription-ui.test.tsx |
| cały sprzęt; sztanga {bar} {u} + talerze {max}…{min} {u}; hantle {a}–{b} {u} co {step} | lib/equipment.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/scenario-full.test.tsx |
| Cardio | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/gen-days-ui.test.tsx +9 |
| Cardio poza planem: sesja cardio jest w planie od {k} dni w tygodniu, przy mniejszej liczbie wszystkie dni są siłowe. Zalecenie WHO: co najmniej {a}–{b} min umiarkowanego wysiłku tygodniowo (albo {c}–{d} min intensywnego); liczy się też umiarkowany ruch w ciągu dnia, np. szybki marsz, nawet krótki. | app/generator.tsx | tests/gen-days-ui.test.tsx, tests/gen-general-ui.test.tsx, tests/generator-ui.test.tsx +1 |
| Cardio w planie: {n} min tygodniowo. Zalecenie WHO: co najmniej {a}–{b} min umiarkowanego wysiłku tygodniowo (albo {c}–{d} min intensywnego); liczy się też umiarkowany ruch w ciągu dnia, np. szybki marsz, nawet krótki. | app/generator.tsx | tests/gen-days-ui.test.tsx, tests/gen-general-ui.test.tsx, tests/generator-ui.test.tsx +1 |
| Cardio: jedna sesja umiarkowanego wysiłku w osobny dzień; jej długość = czas sesji — konwencja. | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx |
| Cardio: od {k} dni w tygodniu jedna sesja w osobny dzień; przy mniejszej liczbie dni wszystkie są siłowe, żeby cardio nie zabierało dni treningowi siłowemu (każda główna partia co najmniej {n} dni) — konwencja. | app/generator.tsx | tests/gen-days-ui.test.tsx, tests/generator-ui.test.tsx, tests/matrix-i18n.test.tsx |
| Cardio: przy {k}–{m} dniach możesz zamienić dni powyżej {j} na sesje umiarkowanego cardio („Dni cardio w planie”, domyślnie wyłączone). WHO 2020 nie znalazło dowodów, że więcej ćwiczeń wzmacniających daje więcej korzyści dla zdrowia, a ruch aerobowy zalecenia radzą rozłożyć na kilka dni (wytyczne USA 2018, ACSM 2011). Długość sesji cardio = czas sesji — konwencja. | app/generator.tsx | tests/gen-general-ui.test.tsx, tests/matrix-i18n.test.tsx |
| cel {n} | components/MuscleCompare.tsx | tests/adapt-ui.test.tsx, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts +87 |
| Cel serii na partię w tygodniu | app/more/settings.tsx | tests/release-0.14.test.tsx, tests/set-goals-ui.test.tsx, tests/set-goals.test.ts +1 |
| Cel serii na partię w tygodniu ustawisz w Ustawieniach (Automatycznie albo Ręcznie); paski w „Ten tydzień” i w Postępach mierzą do tego celu, a partia pomocnicza ćwiczenia liczy się za pół serii. | lib/whatsnew.ts | tests/release-0.14.test.tsx, tests/whats-new.test.tsx |
| Ceny są niedostępne bez połączenia z internetem. | app/paywall.tsx | tests/subscription-i18n.test.ts |
| Ciemny | app/more/settings.tsx | tests/matrix-i18n.test.tsx, tests/scenario-full.test.tsx, tests/theme-choice.test.tsx +1 |
| ciężar | app/history/[id].tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-live.test.tsx, tests/audit-0.10-stats-ui.test.tsx +46 |
| Ciężar od {a} do {b}. | components/LoadEditor.tsx | tests/scenario-full.test.tsx |
| ciężar roboczy {sign} {now} (poprz. {prev}) | components/GuardSection.tsx | tests/guard-ui.test.tsx |
| Ciężar serii na stacji wpisuj na stronę — tak, jak pokazuje urządzenie. | components/LoadEditor.tsx | tests/decisions-0310.test.tsx |
| Ciężar z innego sprzętu — nie liczy się do rekordów, dopóki go tu nie wpiszesz. | app/history/edit/[id].tsx | tests/regress.test.tsx |
| Ciężarów w tym zakresie: {c} — najwyżej {n}. Zwiększ krok. | components/LoadEditor.tsx | tests/locations-audit.test.tsx |
| ciężaru {w} nie ma tutaj — wpisz ciężar | app/history/edit/[id].tsx | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx +1 |
| co najmniej {n} | app/progression.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-stats-ui.test.tsx, tests/audit-0.10-ui.test.tsx +19 |
| Co nowego | components/WhatsNew.tsx | tests/interaction-guards.test.ts, tests/whats-new.test.tsx |
| Co nowego — są nowe zmiany | components/WhatsNew.tsx | tests/whats-new.test.tsx |
| Cofnąć zamianę? | app/adapt.tsx | tests/adapt-ui.test.tsx, tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx +1 |
| CSV: ciężar w jednostce z ustawień ({u}), dystans w metrach. | app/more/backup.tsx | tests/matrix-ui.test.tsx, tests/regress.test.tsx |
| Czas | app/history/[id].tsx | tests/dashboard.test.tsx, tests/edit-history.test.tsx, tests/generator-ui.test.tsx +7 |
| Czas treningów | components/PeriodSummary.tsx | tests/period-summary.test.tsx |
| Czas trwania: od 1 do 1440 minut. | lib/edit.ts | tests/matrix-time.test.ts, tests/matrix-ui.test.tsx |
| Czego brakuje: | lib/support.ts | tests/idea-request.test.tsx |
| Czeka na zapis w Apple Health: {n}. Zapis zostanie ponowiony przy uruchomieniu i powrocie do aplikacji. | app/more/settings.tsx | tests/audit-0.10-data-ui.test.tsx |
| Czeka na zgodę organizatora rodziny. | app/paywall.tsx | tests/subscription-i18n.test.ts |
| Częste błędy | components/ExerciseCues.tsx | tests/cues.test.tsx |
| część zaplanowanych serii nie ma ciężaru | app/progression.tsx | tests/progression-ui.test.tsx |
| Cztery zakładki: Trening, Plan, Postępy i Więcej. Szablony i Ćwiczenia znajdziesz teraz w Więcej. | lib/whatsnew.ts | tests/tabs-four.test.tsx, tests/whats-new.test.tsx |
| ćw. | app/history/add.tsx | tests/edit-on-demand.test.tsx, tests/home-b.test.tsx, tests/m3-p2-start.test.tsx +2 |
| Ćwiczenia bez sprzętu | app/adapt.tsx | tests/adapt-ui.test.tsx, tests/maestro-selectors.test.ts |
| ćwiczenia dodasz w następnym kroku | app/history/add.tsx | tests/scenario-full.test.tsx |
| ćwiczenia dodasz w trakcie | components/StartPanel.tsx | tests/home-b.test.tsx |
| Ćwiczenia dopasowane do Twoich: {n} | app/more/import.tsx | tests/csv-import-ui.test.tsx |
| Ćwiczenia na czas mają w treningu stoper — po upływie celu seria odhacza się sama. Przerwa ustawiona w pozycji szablonu ma pierwszeństwo; puste pole przerwy w szablonie oznacza przerwę z tego ćwiczenia. | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| Ćwiczenia z 1 serią bez zmian. | lib/start.ts | tests/audit-0.10-live.test.tsx |
| Ćwiczenia z pliku | app/more/import.tsx | tests/csv-import-ui.test.tsx |
| Ćwiczenie | app/(tabs)/progress.tsx | tests/audit-0.10-ui.test.tsx, tests/audit-m1-015-asekuracja.test.tsx, tests/audit-m1-031-asekuracja-zakres.test.tsx +10 |
| Ćwiczenie ma co najmniej jedną serię. Żeby usunąć całe ćwiczenie, przesuń w lewo jego nazwę. | components/SwipeRow.tsx | tests/audit-0.10-ui.test.tsx |
| Ćwiczenie ze sztangą na tułowiu lub nad głową i twarzą: zalecana asekuracja — stojaki z ramionami asekuracyjnymi oraz osoba asekurująca. | components/ExerciseCues.tsx | tests/audit-m1-015-asekuracja.test.tsx, tests/audit-m1-031-asekuracja-zakres.test.tsx, tests/audit-m1-049-critical-content.test.ts +2 |
| Ćwiczenie ze sztangą na tułowiu lub nad głową i twarzą: zalecana osoba asekurująca. | components/ExerciseCues.tsx | tests/audit-m1-031-asekuracja-zakres.test.tsx, tests/audit-m1-049-critical-content.test.ts, tests/przeglad-tlumaczen.test.ts |
| Ćwiczenie zostanie bez zmian. | app/exercise/[id].tsx | tests/edit-on-demand.test.tsx |
| D — tydzień deload | app/(tabs)/progress.tsx | tests/deload-week.test.tsx |
| D — tydzień oznaczony jako deload. | app/(tabs)/progress.tsx | tests/deload-week.test.tsx |
| Dalej | lib/planReminder.ts | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts, tests/mutation-bounds.test.ts |
| dalej: {name} | lib/live.ts | tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx, tests/audit-0.10-tst.test.ts +10 |
| Dane i kopie | app/more/settings.tsx | tests/phone-p1.test.tsx, tests/ui2-09-leftovers.test.tsx |
| Dane nie zostały wyczyszczone | app/more/settings.tsx | tests/audit-r83.test.tsx |
| Dane w telefonie | app/more/settings.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-m1-003-boundary.test.tsx, tests/audit-m1-003-guard-ui.test.tsx +1 |
| Dane w telefonie nie zostały zmienione — możesz je wysłać jako plik. | app/_layout.tsx | tests/audit-m1-003-boundary.test.tsx, tests/audit-m1-003-guard-ui.test.tsx |
| Dane w telefonie zapisała nowsza wersja (schemat {a}); ta wersja obsługuje do {b}. Niczego nie zmieniam — zainstaluj najnowszą wersję (TestFlight). Dane możesz też wysłać jako plik. | app/_layout.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Dane z nowszej wersji aplikacji | lib/backup.ts | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts |
| Dane z nowszej wersji aplikacji — zaktualizuj aplikację | app/_layout.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts |
| Darmowe dni treningowe w tym miesiącu: wykorzystano {n} z {limit} | components/SubscriptionCard.tsx | tests/subscription-i18n.test.ts, tests/subscription-ui.test.tsx |
| Data pomiaru nie może być w przyszłości. | lib/state/bodymass.ts | tests/audit-0.10-data-ui.test.tsx |
| dawniej: {n} | app/exercises.tsx | tests/audit-k1-fala2b.test.tsx |
| Deload | lib/guide.ts | tests/deload-ui.test.tsx, tests/deload-week.test.tsx, tests/guard.test.ts +8 |
| deload — mniej serii | app/(tabs)/history.tsx | tests/audit-0.10-live.test.tsx |
| Deload: podpowiedź w Kalendarzu, a w tygodniu deload przy starcie {less}; przypomnienie rano w dniu treningu z planu. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| dni 1–{n} miesiąca vs poprzedni miesiąc | components/Dashboard.tsx | tests/progression-ui.test.tsx |
| Dni co najmniej tyle, ile wybranych szablonów. | components/OwnPlan.tsx | tests/plan-own-templates-ui.test.tsx |
| Dni treningowe w tygodniu (w tym {n} cardio) | app/generator.tsx | tests/gen-days-ui.test.tsx, tests/gen-general-ui.test.tsx, tests/generator-ui.test.tsx |
| Dni tygodnia | app/plan.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Dni: {n}, szablony: {k} — szablony powtarzają się po kolei: {seq}. Co tydzień od początku. | components/OwnPlan.tsx | tests/plan-own-templates-ui.test.tsx |
| do upadku | lib/live.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit-0.10-ui.test.tsx +11 |
| do uzupełnienia | components/WorkoutBlocks.tsx | tests/watch-fill-ui.test.tsx, tests/watch-scenarios.ts, .maestro/50-zegarek-do-uzupelnienia.yaml |
| do zrobienia | components/Dashboard.tsx | tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx, tests/audit-0.10-tst.test.ts +14 |
| Do: {day} | components/DayPanel.tsx | tests/matrix-i18n.test.tsx, tests/places-ui.test.tsx |
| dociążenie: {v} | components/EquipVisual.tsx | tests/karta-sprzet.test.tsx |
| Dodaj ciężar | components/LoadEditor.tsx | tests/audit-0.10-ui.test.tsx, tests/locations-audit.test.tsx, tests/locations-ui.test.tsx +2 |
| Dodaj ćwiczenie | app/exercises.tsx | tests/audit-0.10-live.test.tsx, tests/audit-prephone.test.tsx, tests/audit-r82.test.tsx +17 |
| Dodaj do planu | components/DayPanel.tsx | tests/plan-calendar-ui.test.tsx |
| Dodaj gumę | app/more/bands.tsx | tests/audit-r83.test.tsx, tests/interaction-guards.test.ts, tests/interaction-patterns.test.tsx +2 |
| Dodaj miejsce | app/more/locations.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/interaction-guards.test.ts +9 |
| Dodaj plan | app/plan.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/guide.test.tsx +6 |
| Dodaj szablon | app/templates.tsx | tests/b2-plan-own-templates.test.tsx, tests/edit-on-demand.test.tsx, tests/guide.test.tsx +8 |
| Dodane: {list}. | lib/tplsync.ts | tests/audit-0.10-ui.test.tsx, tests/matrix-i18n.test.tsx |
| Dodano treningi: {n}, nowe ćwiczenia: {m}. | app/more/import.tsx | tests/csv-import-ui.test.tsx |
| Dopisuje treningi z plików CSV popularnych dzienników treningowych — bez usuwania obecnych danych, z podglądem przed zapisem. | app/more/backup.tsx | tests/csv-import-ui.test.tsx, tests/matrix-ui.test.tsx |
| Dopisuje treningi z plików CSV popularnych dzienników treningowych. Obecnych danych nie zmienia ani nie usuwa. Przed zapisem zobaczysz podgląd. | app/more/import.tsx | tests/csv-import-ui.test.tsx |
| Dostęp do {date} | app/paywall.tsx | tests/prices-decision.test.ts, tests/subscription-i18n.test.ts |
| Dostęp z Chmury rodzinnej | app/paywall.tsx | tests/subscription-i18n.test.ts |
| Dostęp z kodu do {date} | app/paywall.tsx | tests/subscription-i18n.test.ts |
| Dostępne ćwiczenia: {n} z {m} | app/more/location/[id].tsx | tests/locations-ui.test.tsx, tests/scenario-full.test.tsx |
| dostępne: {n} ({r}) | components/LoadEditor.tsx | tests/locations-ui.test.tsx |
| Dostosuj do miejsca | app/_layout.tsx | tests/adapt-ui.test.tsx, tests/audit-m1-044-brd.test.ts, tests/audit-m1-045-store-description.test.ts +3 |
| Dostosuj do miejsca: po zmianie miejsca na takie bez potrzebnego sprzętu aplikacja proponuje zamienniki ćwiczeń do przejrzenia — zmiany tylko w tym treningu. | lib/whatsnew.ts | tests/release-0.18.test.tsx, tests/whats-new.test.tsx |
| Dostosuj do: {l} | app/adapt.tsx | tests/adapt-ui.test.tsx, tests/maestro-selectors.test.ts, tests/places-scenario.test.tsx +1 |
| Dotknij etykiety serii, by zmienić typ; przesuń wiersz w lewo, by go usunąć. Zakres powtórzeń jest opcjonalny — z nim pojawiają się podpowiedzi „↑”. „⇅ SS” łączy ćwiczenie z następnym w superset, „✕ SS” wyjmuje z grupy. Kolejność: „≡ Kolejność”. | lib/guide.ts | tests/guide.test.tsx |
| Dół A | lib/generator.ts | tests/generator-ui.test.tsx |
| Dół B | lib/generator.ts | tests/generator-ui.test.tsx |
| drop set | lib/live.ts | tests/audit-0.10-live.test.tsx, tests/audit-0.10-stats-ui.test.tsx, tests/guide.test.tsx +10 |
| Dystans w pliku przyjęto jako metry. | app/more/import.tsx | tests/csv-import-ui.test.tsx |
| Dzień po dniu te same główne partie: {list}. Zwykle lepiej z dniem przerwy; przy tej samej liczbie serii w tygodniu to też jest w porządku. | lib/generator.ts | tests/generator-ui.test.tsx |
| Dzień wraca do planu — trening nie liczy się już jako zrobiony. | components/DayPanel.tsx | tests/plan-wczesniej-ui.test.tsx |
| dziś | components/HistoryCalendar.tsx | tests/adapt-scenario.test.tsx, tests/adapt-ui.test.tsx, tests/audit-0.10-gen-ui.test.tsx +27 |
| dziś w planie · {n} ćw. | components/StartPanel.tsx | tests/home-b.test.tsx |
| Dziś wolne | components/TodayPlan.tsx | tests/m3-p2-start.test.tsx, tests/plan-calendar-ui.test.tsx |
| Dziś zrobione: {name} | components/TodayPlan.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/plan-calendar-ui.test.tsx |
| Dziś: {name} | components/TodayPlan.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx, tests/m3-p2-start.test.tsx +5 |
| e1RM | lib/stats.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/audit-0.10-stats-ui.test.tsx +27 |
| e1RM (Epley, na stronę) | components/ExerciseProgress.tsx | tests/matrix-ui.test.tsx |
| e1RM (Epley, per hantel) | components/ExerciseProgress.tsx | tests/matrix-i18n.test.tsx, tests/scenario-full.test.tsx |
| e1RM {v} ({p}% masy ciała {d}; seria {s}) | lib/stats.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-stats-ui.test.tsx, tests/audit-k1-mer.test.tsx |
| e1RM {v} (masa ciała {d}; seria {s}) | lib/stats.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/audit-0.10-stats-ui.test.tsx +3 |
| e1RM {v} (seria {s}) | lib/stats.ts | tests/audit-records-logic.test.ts, tests/audit-records-misc.test.tsx, tests/matrix-i18n.test.tsx +1 |
| e1RM pojawi się po wpisaniu masy ciała w Postępach. | components/ExerciseProgress.tsx | tests/audit-0.10-stats-ui.test.tsx, tests/matrix-ui.test.tsx |
| e1RM w ćwiczeniach z masą ciała liczy się tylko z masą ciała wpisaną w Postępach i tylko tam, gdzie wiadomo, jaką jej część podnosisz: podciąganie (cała — uproszczenie), pompki (ok. {p}% — badania z platformą siłową). | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| e1RM: wzór Epleya na {p}% masy ciała z dnia treningu (ostatni pomiar z tego dnia lub wcześniejszy) plus dociążenie (uproszczenie). | components/ExerciseProgress.tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-stats-ui.test.tsx |
| Edycja ćwiczenia | app/exercise/[id].tsx | tests/edit-on-demand.test.tsx |
| Edycja sesji | app/_layout.tsx | tests/audit-0.10-tst.test.ts, tests/guide.test.tsx |
| Edycja sesji i trening wstecz | lib/guide.ts | tests/guide.test.tsx |
| Edycja szablonu | app/template/[id].tsx | tests/edit-on-demand.test.tsx |
| Ekran Trening w nowym układzie; „Powtórz ostatni” z nazwą i datą. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| Ekran Trening: „Planowanie” przy nazwie planu, „Ten tydzień” i „Progresja”; „Z szablonu” w arkuszu „Inny trening” otwiera wybór szablonu ze „Startem”. | lib/whatsnew.ts | tests/tabs-four.test.tsx, tests/whats-new.test.tsx |
| Eksport CSV | lib/backup.ts | tests/matrix-i18n.test.tsx, tests/matrix-ui.test.tsx |
| Eksport tworzy plik JSON z całą historią i szablonami — zapisz go w Plikach/iCloud albo wyślij sobie. Import przyjmuje ten sam format, także backup z wersji webowej. | app/more/backup.tsx | tests/matrix-ui.test.tsx |
| FBW | lib/generator.ts | tests/adapt-logic.test.ts, tests/adapt-scenario.test.tsx, tests/adapt-ui.test.tsx +17 |
| FBW A | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/generator-ui.test.tsx +2 |
| FBW B | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/generator-ui.test.tsx +2 |
| Filtr miejsca wyłączony: {l} | app/picker.tsx | tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx |
| Filtr miejsca: {l} | app/picker.tsx | tests/locations-ui.test.tsx, tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx +2 |
| Filtr partii wyłączony: {g} | app/swap.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx |
| Filtr partii: {g} | app/swap.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/catalog-full.test.tsx, tests/matrix-logic.test.tsx +3 |
| Filtr: podstawowe ćwiczenia | components/LibScope.tsx | tests/catalog-library25.test.tsx |
| Folder nie został utworzony. | app/template/[id].tsx | tests/edit-on-demand.test.tsx |
| Gdzie trenujesz i jaki sprzęt tam masz. Wybór ćwiczenia pokazuje wtedy to, co da się zrobić w miejscu treningu, a podpowiedź „↑” proponuje ciężary, które naprawdę masz. Miejsce wybierasz na starcie treningu. | app/more/locations.tsx | tests/matrix-ui.test.tsx |
| Generator szablonów i planu | app/_layout.tsx | tests/generator-ui.test.tsx, tests/interaction-patterns.test.tsx, tests/m3-p4-generator.test.tsx +2 |
| Generator szablonów i planu tygodnia na Twoje polecenie (cel, miejsce, liczba i długość sesji) oraz kilka planów z wyborem aktywnego. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| Generator uwzględnia Twój cel serii z Ustawień. | lib/whatsnew.ts | tests/release-0.16.test.tsx, tests/whats-new.test.tsx |
| Generator: wybór dni tygodnia, od {a} do {b} dni, cel „Ogólny” i „Plan z moich szablonów”. | lib/whatsnew.ts | tests/audit011b.test.tsx, tests/whats-new.test.tsx |
| główna | app/exercise/[id].tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-k1-muscleload.test.tsx, tests/audit-m1-044-brd.test.ts +15 |
| Godzina {t} nie istnieje tego dnia (zmiana czasu). Wpisz inną. | lib/edit.ts | tests/edit-history.test.tsx, tests/matrix-time.test.ts |
| godzina nieznana | app/(tabs)/history.tsx | tests/regress.test.tsx, tests/release-0.14.test.tsx, tests/whats-new.test.tsx |
| Gotowe zestawy | app/place-once.tsx | tests/maestro-selectors.test.ts, tests/places-ui.test.tsx |
| Góra A | lib/generator.ts | tests/generator-ui.test.tsx, tests/m3-fix-e2e.test.tsx, tests/m3-p2-board-ui.test.tsx +3 |
| Góra B | lib/generator.ts | tests/generator-ui.test.tsx, tests/m3-fix-e2e.test.tsx, tests/m3-p3-postepy-historia.test.tsx |
| Gryf ({u}) | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| gryf łamany | lib/swap.ts | tests/matrix-ui.test.tsx |
| guma | app/exercises.tsx | tests/audit-0.10-tst-ui.test.tsx, tests/audit-r72-b.test.ts, tests/edit-history.test.tsx +11 |
| Guma | app/history/[id].tsx | tests/audit-0.10-stats-ui.test.tsx, tests/audit-journey-a.test.tsx, tests/audit-journey-c.test.tsx +11 |
| Guma jako opór: przy serii wybierasz gumę (poziom 1–7), rekordy liczą serie z gumą. | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| guma: {v} | components/EquipVisual.tsx | tests/audit-0.10-tst-ui.test.tsx, tests/matrix-data-shared.ts, tests/matrix-i18n.test.tsx |
| Gumy | app/_layout.tsx | tests/guide.test.tsx, tests/m3-p5-delete.test.tsx, tests/matrix-i18n.test.tsx +6 |
| Gumy usuniesz po „Edytuj” w nagłówku ekranu gum albo przesunięciem w lewo. | lib/guide.ts | tests/guide.test.tsx |
| hantle | lib/swap.ts | tests/adapt-logic.test.ts, tests/adapt-scenario.test.tsx, tests/adapt-ui.test.tsx +87 |
| hantle {a}–{b} {u}, ławka regulowana, mata, ściana, bieżnia, rower | lib/equipment.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/scenario-full.test.tsx |
| hantle: {v} | components/EquipVisual.tsx | tests/karta-sprzet.test.tsx, tests/matrix-karta.test.tsx |
| i jeszcze {n} | lib/guard.ts | tests/guard-ui.test.tsx, tests/guard.test.ts, tests/progression-ui.test.tsx |
| imperialny (lb, mi, yd) | app/more/settings.tsx | tests/audit-m1-lok07-01-imperial-dist.test.tsx, tests/matrix-i18n.test.tsx, tests/matrix-ui.test.tsx |
| Import historii treningów z plików CSV popularnych dzienników (Więcej → Kopia zapasowa → „Importuj historię z pliku CSV”), z podglądem przed zapisem. | lib/whatsnew.ts | tests/release-0.13.test.tsx, tests/tabs-four.test.tsx, tests/whats-new.test.tsx |
| Import historii z CSV | app/_layout.tsx | tests/csv-import-ui.test.tsx |
| Import przerwany | app/more/backup.tsx | tests/audit-r83.test.tsx, tests/audit-r83b.test.tsx, tests/csv-import-ui.test.tsx +1 |
| Import zastąpi wszystkie obecne dane zawartością pliku. Obecne dane (także trening w toku) zapiszą się najpierw jako kopia w Plikach: {app} → Backup. | app/more/backup.tsx | tests/matrix-ui.test.tsx |
| inna aktywność | lib/healthRead.ts | tests/health-read-ui.test.tsx, tests/health-read.test.ts |
| Inna aktywność | lib/healthRead.ts | tests/health-read-ui.test.tsx, tests/health-read.test.ts |
| Inna kolejność ćwiczeń. | lib/tplsync.ts | tests/audit-0.10-ui.test.tsx |
| Inne | app/swap.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit-0.10-lang.test.ts +21 |
| Inne miejsce | app/_layout.tsx | tests/maestro-selectors.test.ts, tests/matrix-ui.test.tsx, tests/places-oneoff-logic.test.ts +2 |
| Inne plany | app/plan.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit-0.10-plan-ui.test.tsx +12 |
| Inne serie: {list}. | lib/tplsync.ts | tests/audit-0.10-ui.test.tsx |
| Inny plan | app/plan.tsx | tests/ui2-08-saved-plan-title.test.tsx |
| Inny z planu, powtórz ostatni, z szablonu albo pusty. | components/StartPanel.tsx | tests/home-b.test.tsx |
| Jak ostatnio | lib/start.ts | tests/audit-0.10-live.test.tsx |
| Jak w telefonie | app/more/language.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/logic.test.ts, tests/matrix-i18n.test.tsx +6 |
| Jasny | app/more/settings.tsx | tests/matrix-i18n.test.tsx, tests/scenario-full.test.tsx, tests/theme-choice.test.tsx |
| Jeden trening w tygodniu też daje postępy, ale zwykle trochę mniejsze niż częstszy trening — głównie dlatego, że w jednej sesji mieści się mniej serii. Przy tej samej liczbie serii w tygodniu różnica w przyroście mięśni znika, a w sile maleje. | lib/generator.ts | tests/gen-days-ui.test.tsx, tests/gen-days.test.ts, tests/gen-general-ui.test.tsx +1 |
| Jedna sesja: {v}. Wykres pojawi się po drugiej. | components/Chart.tsx | tests/matrix-ui.test.tsx |
| Jednostka sprzętu | components/LoadEditor.tsx | tests/locations-audit.test.tsx, tests/scenario-full.test.tsx |
| Jesteśmy z Ciebie dumni! | app/paywall.tsx | tests/subscription-i18n.test.ts, tests/subscription-ui.test.tsx |
| Jeszcze nie było w treningu. | app/exercise/[id].tsx | tests/edit-on-demand.test.tsx |
| Jeszcze pusto — pierwszy trening czeka. | app/(tabs)/history.tsx | tests/motyw.test.tsx, tests/scenario-full.test.tsx |
| Jeśli dane się nie pokażą, sprawdź dostęp w aplikacji Zdrowie: profil → Aplikacje → {app}. | app/more/settings.tsx | tests/health-read-ui.test.tsx |
| jutro | components/StartPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/csv-import-logic.test.ts, tests/home-b.test.tsx +1 |
| już w treningu | app/swap.tsx | tests/matrix-logic.test.tsx, tests/swap-ui.test.tsx |
| Kalendarz od dziś będzie pusty. | app/plan.tsx | tests/plan-wczesniej-ui.test.tsx |
| Kalendarz zamiast Historii: plan tygodnia, przesuwanie treningów i propozycje zmian z myślą o regeneracji partii. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| Karta bieżącej serii w treningu; widok „Lista” jak wcześniej do wyboru w Ustawieniach. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| Każda główna partia co najmniej {n} dni w tygodniu (WHO 2020 — zalecenie dla zdrowia; ACSM 2026: częstotliwość wpływa na siłę, ale za mało dowodów, by stwierdzić zależność dawka–odpowiedź, a przy równej objętości różnica słabnie). Dzień, w którym partia pracuje tylko pomocniczo, liczy się jako {h} — uproszczenie (metoda z metaanalizy Pelland i in. 2026). Podział na sesje (FBW, góra/dół) to konwencja — przy tej samej liczbie serii daje podobne efekty. | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/zrodlo-jedno.test.ts |
| Każda z tych możliwości wraca do rutyny w ciągu {n} dni. | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/plan-calendar-ui.test.tsx |
| Każde ćwiczenie ma tu 1 serię — liczba serii zostaje bez zmian (ćwiczenia z 1 serią nie są skracane). Ciężary bez zmian. | lib/start.ts | tests/audit-0.10-live.test.tsx |
| kettlebell | lib/swap.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/audit-k1-bl-mer.test.tsx +10 |
| kettlebell: {v} | components/EquipVisual.tsx | tests/i18n-wave2.test.ts, tests/matrix-i18n.test.tsx, tests/matrix-karta.test.tsx |
| Kierunek dla partii liczymy tylko na ćwiczeniach, które były w obu tygodniach. Ćwiczenia bez punktu odniesienia — nowe w tym tygodniu albo nierobione teraz — pomijamy w obu tygodniach. | components/GuardSection.tsx | tests/guard-ui.test.tsx |
| Kilka planów: przycisk + w nagłówku (Dodaj plan) tworzy kopię do zmiany, a „Ustaw jako aktywny” w „Inne plany” ją włącza — zmiany dni wracają razem z planem. | lib/guide.ts | tests/guide.test.tsx |
| Kolejność ćwiczeń | app/_layout.tsx | .maestro/03-kolejnosc.yaml |
| Kolejność: najpierw zmiany, po których plan wraca do rutyny w ciągu {n} dni, potem bez utraty treningów, bez nowych par dzień po dniu z tymi samymi partiami i z najmniejszą liczbą zmienionych dni. | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Kolor i poziom trudności: 1 = cienka, 7 = bardzo gruba. Gumy nie mają kilogramów — przy serii zapisujesz, której gumy użyłeś. Guma jako asysta (np. podciąganie): rekordem są powtórzenia bez gumy, a postęp to zejście na niższy poziom. Guma jako opór: rekordy liczą serie z gumą. | app/more/bands.tsx | tests/matrix-ui.test.tsx |
| Kolor względem partii z największą liczbą serii w tym okresie (partia główna 1 seria, pomocnicza 0,5). Szare — bez serii. | components/PeriodSummary.tsx | tests/muscle-map.test.tsx |
| Koniec przerwy i przypomnienie o treningu z planu przyjdą także przy zablokowanym ekranie. | app/more/settings.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/matrix-ui.test.tsx |
| Koniec treningu ({t}) jest w przyszłości. Zmień datę, godzinę albo czas trwania. | lib/edit.ts | tests/matrix-time.test.ts, tests/matrix-ui.test.tsx |
| Kopia automatyczna po treningu jest wyłączona (Ustawienia). | app/more/backup.tsx | tests/matrix-ui.test.tsx |
| Kopia automatyczna: po każdym treningu plik JSON zapisuje się sam w Plikach (Na moim iPhonie → {app} → Backup, ostatnie {n}). Import przyjmuje też te pliki. Te kopie znikają razem z aplikacją — przed jej usunięciem albo instalacją z innego Apple ID wyeksportuj backup na zewnątrz. | app/more/backup.tsx | tests/matrix-ui.test.tsx |
| Kopia jest zachowana w telefonie. Tapnij, by ją wysłać, a potem zaimportuj backup. | app/(tabs)/index.tsx | tests/matrix-ui.test.tsx |
| Kopia nieczytelnych danych | lib/backup.ts | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| Kopia obecnego planu w „Inne plany” — zmienisz ją przed ustawieniem jako aktywny. | app/plan.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/interaction-patterns.test.tsx |
| Kopia obejmie też poprzednie, nieczytelne dane. | lib/backup.ts | tests/audit-r83b.test.tsx, tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| Kopia w Apple Health zostanie — usuniesz ją w aplikacji Zdrowie. | app/history/edit/[id].tsx | tests/audit-0.10-ui.test.tsx, tests/health-read-ui.test.tsx, tests/m3-p3-postepy-historia.test.tsx |
| Kopia zapasowa | app/_layout.tsx | tests/audit-0.10-ui.test.tsx, tests/guide.test.tsx, tests/public-repo.test.ts +4 |
| Kreska = cel serii na partię w tygodniu: {n} automatycznie albo Twoja liczba z Ustawień. | app/(tabs)/progress.tsx | tests/set-goals-ui.test.tsx, tests/set-goals.test.ts, tests/sets-mark.test.tsx |
| Kreska w „Ten tydzień” i w Postępach. Automatycznie: {n} serii (stanowisko ACSM 2026). Ręcznie: własna liczba od {min} do {max}. | app/more/settings.tsx | tests/matrix-i18n.test.tsx, tests/set-goals-ui.test.tsx, tests/set-goals.test.ts |
| Krok zmiany (np. +2,5 kg) to konwencja, a nie wynik badań. | app/more/settings.tsx | tests/audit-m1-046-047-claims.test.tsx, tests/matrix-ui.test.tsx |
| kroki {n} | lib/healthRead.ts | tests/dashboard.test.tsx, tests/health-permissions.test.ts, tests/health-read-ui.test.tsx +5 |
| Kroki dziennie (średnia z {d} dni): {n} | lib/healthRead.ts | tests/health-read-ui.test.tsx, tests/health-read.test.ts |
| Kroki: {n} | lib/healthRead.ts | tests/health-read-ui.test.tsx, tests/health-read.test.ts |
| Krótka animacja przy starcie: talerze wsuwają się na gryf. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| Kup na zawsze | app/paywall.tsx | tests/subscription-i18n.test.ts |
| Liczba serii z czasu sesji: (minuty − {w} min rozgrzewki) × 60 / ({s} s serii + średnia przerwa {r} s) = {n}; ćwiczeń = serie / {k} (co najmniej {e}) — uproszczenie, nie wynik badań. | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/generator-ui.test.tsx |
| Lista | app/more/settings.tsx | tests/audit-0.10-tst-ui.test.tsx, tests/audit-m1-045-store-description.test.ts, tests/audit-m1-068-release-plan.test.ts +7 |
| lista ćwiczeń z filtrami, które możesz zdjąć | app/swap.tsx | tests/matrix-ui.test.tsx |
| Lista ćwiczeń, zamiany i generator pokazują to, co da się zrobić w wybranym miejscu. | lib/guide.ts | tests/guide.test.tsx |
| Lista możliwości: przesunięcie planu, przeniesienie tylko tego treningu, zamiana albo wolne — z uwzględnieniem regeneracji partii. | components/DayPanel.tsx | tests/plan-calendar-ui.test.tsx |
| lista serii przewijana | components/BoardFace.tsx | tests/m3-fix-e2e.test.tsx, tests/m3-p2-board-ui.test.tsx, tests/m3-p2-matrix.test.tsx |
| Lista: ćwiczenia i serie jak w poprzednich wersjach, bez karty. | app/more/settings.tsx | tests/tuleja.test.tsx, .maestro/35-ustawienia-dostepnosc.yaml |
| łączny czas | lib/stats.ts | tests/audit-records-logic.test.ts, tests/matrix-invariants.test.ts, tests/records-card.test.tsx +2 |
| Łączny czas | lib/stats.ts | tests/audit-records-logic.test.ts |
| łączny dystans | lib/stats.ts | tests/audit-records-logic.test.ts, tests/catalog-library25.test.tsx, tests/matrix-invariants.test.ts +2 |
| Łączny dystans | lib/stats.ts | tests/audit-records-logic.test.ts |
| Mapa mięśni | components/MuscleMap.tsx | tests/backlog-0.10.1-dane.test.ts, tests/guide.test.tsx, tests/muscle-map.test.tsx |
| Mapa mięśni i serie na partię z kreską {n} serii tygodniowo. | lib/guide.ts | tests/backlog-0.10.1-dane.test.ts, tests/guide.test.tsx |
| Mapa mięśni: {list} | components/MuscleMap.tsx | tests/muscle-map.test.tsx |
| Mapa mięśni: brak serii w tym okresie. | components/MuscleMap.tsx | tests/muscle-map.test.tsx |
| Masa | lib/generator.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts +25 |
| masa ciała | components/BoardControls.tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/audit-0.10-live-logic.test.ts +33 |
| Masa ciała | app/(tabs)/progress.tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-stats-ui.test.tsx, tests/audit-k1-fala2b.test.tsx +8 |
| Masa ciała musi być większa od zera i nie większa niż {max}. | lib/state/bodymass.ts | tests/audit-0.10-data-ui.test.tsx |
| Masa ciała: „±” to dociążenie (plus) albo asysta, np. maszyny (minus); guma to osobne pole z poziomem. Rekord to suma powtórzeń bez asysty, a objętość liczy się tylko z dociążenia. | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| Masa: serie na partię w tygodniu do celu z Ustawień (automatycznie {m}), {a}–{b} powtórzeń (w domu {c}–{d}), zwykle {r1}–{r2} powtórzenia w zapasie. | app/generator.tsx | tests/generator-ui.test.tsx, tests/set-split-ui.test.tsx |
| Masz dostęp na zawsze | app/paywall.tsx | tests/subscription-i18n.test.ts |
| Masz pełną wersję | app/paywall.tsx | tests/subscription-i18n.test.ts |
| maszyna | lib/swap.ts | tests/catalog-library25.test.tsx, tests/invariants.test.ts, tests/locations-audit.test.tsx +4 |
| materiały producenta sprzętu | components/ExerciseCues.tsx | tests/audit-k1-bl-mer.test.tsx |
| max | lib/state/time.ts | tests/audit-0.10-lang.test.ts, tests/audit-k1-bl-mer.test.tsx, tests/e2e-pakiet.test.ts +47 |
| max ± | lib/stats.ts | tests/i18n-wave2.test.ts, tests/matrix-i18n.test.tsx, tests/regress.test.tsx +1 |
| max ciężar | lib/stats.ts | tests/m3-fix-e2e.test.tsx, tests/matrix-i18n.test.tsx |
| Max ciężar | components/ExerciseProgress.tsx | tests/m3-fix-e2e.test.tsx, tests/m3-p3-postepy-historia.test.tsx, tests/regress.test.tsx +1 |
| Max ciężar (na stronę) | components/ExerciseProgress.tsx | tests/regress.test.tsx |
| Max ciężar (per hantel) | components/ExerciseProgress.tsx | tests/m3-fix-e2e.test.tsx, tests/scenario-full.test.tsx |
| max czas | lib/stats.ts | tests/matrix-ui.test.tsx |
| Max dociążenie | components/ExerciseProgress.tsx | tests/audit-0.10-stats-ui.test.tsx, tests/matrix-ui.test.tsx |
| max dystans | lib/stats.ts | tests/matrix-ui.test.tsx |
| max pow. | lib/stats.ts | tests/matrix-i18n.test.tsx, tests/matrix-ui.test.tsx |
| Max powtórzeń bez asysty | components/ExerciseProgress.tsx | tests/matrix-ui.test.tsx |
| Max powtórzeń w serii | components/ExerciseProgress.tsx | tests/scenario-full.test.tsx |
| Max powtórzeń z asystą | components/ExerciseProgress.tsx | tests/matrix-ui.test.tsx |
| Menu ⋯ w nagłówku: „Pauza treningu” zatrzymuje zegar treningu; czas pauzy nie liczy się do czasu trwania. | lib/guide.ts | tests/guide.test.tsx |
| metryczny (kg, km, m) | app/more/settings.tsx | tests/audit-m1-lok07-01-imperial-dist.test.tsx, tests/maestro-przebieg-39427683836.test.ts, tests/matrix-i18n.test.tsx +1 |
| Miara: tonaż (serie × powtórzenia × ciężar) średnio na sesję ćwiczenia, więc inna liczba sesji nie zawyża wyniku. Gdy tonaż spadł, a ciężar roboczy wzrósł — albo poprzednio ciężar wynosił 0, a teraz nie — liczymy to jako więcej. | components/GuardSection.tsx | tests/guard-ui.test.tsx |
| Miejsca głównego nie usuniesz — najpierw ustaw inne miejsce jako główne. | app/more/locations.tsx | tests/audit-0.10-ui.test.tsx |
| Miejsca treningu i „Dostosuj do miejsca”: zmiany tylko w dzisiejszym treningu — szablon i plan zostają bez zmian. | lib/whatsnew.ts | tests/release-0.20.test.tsx, tests/whats-new.test.tsx |
| Miejsce na dni {a} – {b}. Wybierz sprzęt, jaki tam masz — ciężarów nie trzeba wpisywać. | app/place-once.tsx | tests/maestro-selectors.test.ts, tests/places-ui.test.tsx |
| Miejsce tego treningu | app/history/edit/[id].tsx | tests/m3-p2-board-ui.test.tsx, tests/matrix-ui.test.tsx, tests/places-ui.test.tsx |
| Miejsce tylko na ten trening. Wybierz sprzęt, jaki tam masz — ciężarów nie trzeba wpisywać. | app/place-once.tsx | tests/maestro-selectors.test.ts, tests/places-ui.test.tsx |
| Miejsce usuniesz przyciskiem „Usuń miejsce” na dole jego ekranu albo przesunięciem w lewo na liście; miejsca głównego nie usuniesz, dopóki są inne. | lib/guide.ts | tests/guide.test.tsx |
| miesiąc | app/paywall.tsx | tests/audit-0.10-ui.test.tsx, tests/audit-m1-016-paywall-benefit.test.tsx, tests/audit-m1-032-total-bars.test.tsx +15 |
| Miesiąc | app/progression.tsx | tests/deload-week.test.tsx, tests/motyw-miesiac.test.tsx, tests/period-summary.test.tsx +2 |
| Miesiąc do miesiąca | app/progression.tsx | tests/progression-ui.test.tsx |
| Mięsień docelowy spoza mapy partii: {m} — nie liczy się w seriach na partię ani na mapie mięśni. | app/exercise/[id].tsx | tests/audit-0.10-ui.test.tsx |
| Minęło {s} s. | lib/timer.ts | tests/matrix-ui.test.tsx, tests/timer-logic.test.ts |
| mniej | components/MuscleMap.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx +32 |
| Mniej niż przed tygodniem: {list}. | lib/guard.ts | tests/guard-ui.test.tsx, tests/guard.test.ts |
| Mniej niż w tygodniu {d}: {list}. | lib/guard.ts | tests/guard-ui.test.tsx, tests/guard.test.ts |
| Mniej opcji | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Mniej serii | lib/start.ts | tests/audit-0.10-live.test.tsx, tests/deload-ui.test.tsx, tests/guide.test.tsx +1 |
| Moje szablony, {n}× w tygodniu | lib/generator.ts | tests/gen-days-ui.test.tsx, tests/plan-own-templates-ui.test.tsx, tests/plan-own-templates.test.ts |
| Mój plan ({date}) | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/mutation-plan.test.ts, tests/plan-own-templates-ui.test.tsx +3 |
| Na czym to oparte | app/generator.tsx | tests/guide.test.tsx |
| Na ekranie Trening „Planowanie” (bez planu: „Ustaw plan”) otwiera plan tygodnia, który przypisuje szablony do dni — plan powtarza się co tydzień. | lib/guide.ts | tests/guide.test.tsx |
| Na ekranie Trening „Progresja” porównuje tydzień (wykonane + zaplanowane) z poprzednim oraz miesiąc z miesiącem. | lib/guide.ts | tests/guide.test.tsx |
| Na ekranie Trening stuknij duży przycisk „Start” (następny trening) albo „Inny trening” — tam wybierzesz szablon, powtórzysz ostatni trening albo zaczniesz pusty. | lib/guide.ts | tests/guide.test.tsx |
| Na ekranie treningu: dzisiejszy trening z planu, bieżący tydzień i najbliższe treningi z nazwą. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| Na górze listy jest polecana: wraca do rutyny i nie gubi treningu, potem unika par dzień po dniu z tymi samymi partiami i zmienia najmniej dni. | lib/guide.ts | tests/guide.test.tsx |
| Na koniec „Zakończ” w nagłówku (albo „Zakończ trening” w karcie po ostatniej serii) — sesja trafi do zakładki Plan. | lib/guide.ts | tests/guide.test.tsx |
| Na początku przerwy telefon zapowiada następne ćwiczenie, ciężar i powtórzenia. W słuchawkach — tylko przy podłączonych słuchawkach; Także przez głośnik — również bez słuchawek, przez głośnik telefonu (także w trybie cichym); Wyłączone — bez zapowiedzi. | app/more/settings.tsx | tests/voice-ui.test.tsx |
| Na podstawie: {list}. Własne sformułowania. | components/ExerciseCues.tsx | tests/audit-k1-bl-mer.test.tsx, tests/cues-014.test.tsx, tests/cues.test.tsx |
| na urządzeniu: {v} | components/EquipVisual.tsx | tests/matrix-karta.test.tsx |
| Nadpisać dane? | app/more/backup.tsx | tests/audit-io-more.test.tsx, tests/audit-m1-006-import-ui.test.tsx, tests/audit-r83.test.tsx +4 |
| Najcięższy ciężar w miejscu dla boju głównego ({list}): {w}. Ciężkie serie {a}–{b} powtórzeń (ok. {p}% maksimum) mogą być z nim za lekkie — jeśli {b} powtórzeń wychodzi lekko, rób więcej powtórzeń, bliżej upadku. Siła też wtedy rośnie, ale zwykle mniej niż przy dużym ciężarze. | lib/loadcap.ts | tests/audit-k1-bl-mer.test.tsx |
| Najdłużej łącznie na treningu | components/ExerciseProgress.tsx | tests/matrix-ui.test.tsx |
| Najdłuższa seria | components/ExerciseProgress.tsx | tests/scenario-full.test.tsx |
| Najdłuższy dystans | components/ExerciseProgress.tsx | tests/catalog-library25.test.tsx, tests/matrix-ui.test.tsx |
| Najdłuższy dystans na treningu | components/ExerciseProgress.tsx | tests/matrix-ui.test.tsx |
| najlepsza | components/ExerciseProgress.tsx | tests/audit-m1-033-session-row.test.tsx, tests/audit-records-ui.test.tsx |
| Najlepsza seria (objętość) | components/ExerciseProgress.tsx | tests/scenario-full.test.tsx |
| Najlepsza seria: {s} | components/RecordsCard.tsx | tests/records-card.test.tsx |
| Najlepszy trening (objętość) | components/ExerciseProgress.tsx | tests/regress.test.tsx |
| Najpierw zakończ albo odrzuć bieżący trening. | lib/start.ts | tests/audit-0.10-ui.test.tsx, tests/interaction-patterns.test.tsx, tests/matrix-ui.test.tsx |
| Najważniejsze funkcje w kilku krokach. „Pokaż” otwiera opisany ekran. | app/guide.tsx | tests/guide.test.tsx |
| Najwięcej powtórzeń na treningu | components/ExerciseProgress.tsx | tests/matrix-ui.test.tsx |
| Najwyżej {n} rodzajów. | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Najwyżej {n} szablonów — każdy dostaje co najmniej jeden dzień. | components/OwnPlan.tsx | tests/plan-own-templates-ui.test.tsx |
| Napisz na: {mail} | app/more/about.tsx | tests/idea-request.test.tsx, tests/support-mail.test.tsx |
| następna propozycja — pierwsza jest już zajęta przez inne ćwiczenie | app/adapt.tsx | tests/adapt-ui.test.tsx |
| Następna seria. | lib/timer.ts | tests/audit-0.10-live.test.tsx, tests/matrix-ui.test.tsx, tests/timer-logic.test.ts |
| Następna: {x} | components/BoardFace.tsx | tests/karta-sprzet.test.tsx, tests/m3-p2-board-ui.test.tsx |
| Następne ćwiczenia | components/ActiveWorkout.tsx | tests/m3-p2-board-ui.test.tsx, tests/m3-p2-matrix.test.tsx |
| Następne: {list} | components/TodayPlan.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/home-plan-header.test.tsx |
| Następny miesiąc | components/HistoryCalendar.tsx | tests/history-calendar.test.tsx |
| Następny okres | components/PeriodSummary.tsx | tests/period-summary.test.tsx |
| następny po: {name} · {n} ćw. | components/StartPanel.tsx | tests/home-b.test.tsx |
| Nazwa folderu | app/template/[id].tsx | tests/b2-plan-own-templates.test.tsx, tests/edit-on-demand.test.tsx, tests/template-folders.test.tsx |
| Nazwa pod ikoną i opis zgody Zdrowia zmienią język dopiero po ustawieniu języka aplikacji w Ustawieniach iOS. | app/more/language.tsx | tests/audit-m1-064-language-ios.test.tsx |
| Nazwy ćwiczeń z biblioteki są po angielsku we wszystkich językach poza polskim. | app/more/language.tsx | tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx, tests/matrix-dim-langs3.test.tsx +3 |
| Nic do zapisania. Odrzucić ten trening? | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Nic nie odhaczono — wszystkie ćwiczenia pominięte | components/NowBoard.tsx | tests/audit-0.10-live.test.tsx |
| Nic nie pasuje. | app/(tabs)/progress.tsx | tests/audit-k1-fala2b.test.tsx, tests/m3-p3-postepy-historia.test.tsx, tests/matrix-logic.test.tsx +4 |
| nic więcej do zrobienia | lib/live.ts | tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx, tests/voice.test.ts +5 |
| Nic więcej do zrobienia — możesz zakończyć trening. | lib/timer.ts | tests/audit-0.10-live.test.tsx, tests/audit-0.10-tst.test.ts, tests/timer-logic.test.ts |
| Nic więcej do zrobienia (część pominięta) | components/NowBoard.tsx | tests/audit-0.10-live.test.tsx, tests/skip-today.test.tsx |
| nie | app/exercise/[id].tsx | tests/adapt-logic.test.ts, tests/adapt-scenario.test.tsx, tests/adapt-ui.test.tsx +282 |
| Nie ma nowych treningów do dodania — wszystkie są już w historii. | app/more/import.tsx | tests/csv-import-ui.test.tsx |
| Nie ma takiego ćwiczenia. | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| Nie ma takiego miejsca. | app/more/location/[id].tsx | tests/matrix-ui.test.tsx |
| Nie ma takiego planu. | app/plan.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Nie ma takiego szablonu. | app/reorder.tsx | tests/interaction-patterns.test.tsx, tests/reorder-t010.test.tsx |
| Nie ma treningu w toku. | app/adapt.tsx | tests/adapt-ui.test.tsx, tests/interaction-guards.test.ts, tests/places-ui.test.tsx +1 |
| Nie ma żadnej serii z wynikiem — nic do zapisania. | app/history/edit/[id].tsx | tests/edit-history.test.tsx, tests/scenario-full.test.tsx |
| Nie ma żadnej serii z wynikiem. | lib/edit.ts | tests/matrix-ui.test.tsx |
| Nie masz jeszcze miejsc treningu, więc plan zakłada pełną siłownię (sztanga, hantle, maszyny i wyciągi). Trenujesz w domu albo w hotelu? Stuknij „+ Dodaj miejsce” i zaznacz sprzęt — generator dobierze ćwiczenia. | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx |
| Nie masz jeszcze szablonów. | app/pick-template.tsx | tests/b2-plan-own-templates.test.tsx, tests/pick-template.test.tsx, tests/plan-calendar-ui.test.tsx +1 |
| Nie masz szablonów z ćwiczeniami. Utwórz szablon albo wybierz „Wygeneruj szablony i plan”. | components/OwnPlan.tsx | tests/audit-k1-bl-mer.test.tsx, tests/plan-own-templates-ui.test.tsx |
| Nie można wyłączyć planu | app/plan.tsx | tests/plan-wczesniej-ui.test.tsx |
| nie podano — e1RM podciągania i pompek | app/(tabs)/progress.tsx | tests/audit-0.10-stats-ui.test.tsx, tests/tabs-four.test.tsx |
| Nie udało się dokończyć zakupu | app/paywall.tsx | tests/interaction-patterns.test.tsx |
| Nie udało się otworzyć poczty | lib/support.ts | tests/idea-request.test.tsx, tests/support-mail.test.tsx |
| Nie udało się przywrócić zakupów. Sprawdź połączenie z internetem. | app/paywall.tsx | tests/subscription-i18n.test.ts, tests/subscription-ui.test.tsx |
| Nie udało się włączyć Apple Health | app/more/settings.tsx | tests/health-read-ui.test.tsx |
| Nie udało się wyeksportować kopii | app/more/backup.tsx | tests/interaction-patterns.test.tsx |
| Nie udało się wysłać danych | app/_layout.tsx | tests/audit-m1-004-start-error.test.tsx, tests/interaction-patterns.test.tsx |
| Nie udało się wysłać kopii | app/(tabs)/index.tsx | tests/matrix-ui.test.tsx, tests/regress.test.tsx |
| Nie udało się zaimportować pliku | app/more/import.tsx | tests/csv-import-ui.test.tsx |
| Nie udało się zapisać | app/history/edit/[id].tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx, tests/audit-m1-006-import-ui.test.tsx +6 |
| Nie udało się zapisać kopii bezpieczeństwa w Plikach — dane nie zostały zmienione. | lib/backup.ts | tests/matrix-data-fuzz.test.ts, tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| Nie udało się zapisać w Apple Health | app/more/settings.tsx | tests/audit-0.10-data-ui.test.tsx |
| Nie zapisano jeszcze w Apple Health — zapis zostanie ponowiony przy następnym uruchomieniu aplikacji. | app/history/[id].tsx | tests/audit-0.10-data-ui.test.tsx |
| Nie zmieniono przerwy | components/WorkoutBlocks.tsx | tests/audit-0.10-ui.test.tsx |
| Nie znaleziono zakupów dla tego konta Apple. | app/paywall.tsx | tests/subscription-i18n.test.ts |
| Nie zostałaby żadna seria z wynikiem. Usunąć tę sesję z historii? | app/history/edit/[id].tsx | tests/matrix-ui.test.tsx |
| nieaktywny | app/plan.tsx | tests/plan-wczesniej-ui.test.tsx |
| niedostępne w: {l} są wyszarzone | app/picker.tsx | tests/scenario-full.test.tsx |
| Nieodhaczone serie z wpisanymi wynikami: {n} — nie zostaną zapisane. Seria zapisuje się po odhaczeniu ✓. | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/matrix-ui.test.tsx |
| Nieodhaczone serie: {n} — nie zostaną zapisane. | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/matrix-ui.test.tsx, tests/regress.test.tsx +1 |
| Nieprawidłowa data. Wpisz RRRR-MM-DD, np. {d}. | lib/edit.ts | tests/matrix-time.test.ts, tests/matrix-ui.test.tsx |
| Nieprawidłowa godzina. Wpisz GG:MM, np. 18:00. | lib/edit.ts | tests/matrix-time.test.ts, tests/matrix-ui.test.tsx |
| nieprzeczytane | app/guide.tsx | tests/guide.test.tsx, tests/tabs-four.test.tsx |
| nierobione w tym tygodniu | components/GuardSection.tsx | tests/guard-ui.test.tsx |
| Niezapisane zmiany | app/_layout.tsx | tests/audit-k1-fala2b.test.tsx, tests/audit011b.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx +1 |
| Niezapisane zmiany w edycji szablonu i ćwiczenia przetrwają zamknięcie aplikacji — po starcie wrócisz do edycji albo je odrzucisz. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| niszowe ukryte: {n} — znajdziesz je wyszukiwaniem | components/LibScope.tsx | tests/catalog-library25.test.tsx |
| Notatka do serii | app/history/edit/[id].tsx | tests/scenario-full.test.tsx |
| Notatka szablonu | components/ActiveWorkout.tsx | tests/audit-0.10-ui.test.tsx, tests/m3-p2-board-ui.test.tsx |
| nowa | app/more/bands.tsx | tests/asc-metadane.test.ts, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx +45 |
| nowe | lib/guard.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-tst.test.ts +15 |
| Nowe ćwiczenia: {n} | app/more/import.tsx | tests/csv-import-ui.test.tsx |
| Nowe ćwiczenie nie zostanie zapisane. | app/exercise/[id].tsx | tests/edit-on-demand.test.tsx |
| nowe ćwiczenie własne | app/picker.tsx | tests/matrix-logic.test.tsx |
| Nowe miejsce | app/more/locations.tsx | tests/interaction-patterns.test.tsx, tests/scenario-full.test.tsx |
| Nowe rekordy: {n} | components/RecordsCard.tsx | tests/audit-0.10-stats-ui.test.tsx, tests/audit-records-misc.test.tsx, tests/motyw.test.tsx +1 |
| nowe w tym tygodniu | components/GuardSection.tsx | tests/guard-ui.test.tsx |
| Nowy ekran Trening: dzisiejszy trening, tydzień w liczbach i ostatni trening; przewodnik po funkcjach w Więcej. | lib/whatsnew.ts | tests/guide.test.tsx, tests/whats-new.test.tsx |
| Nowy plan | lib/plan.ts | tests/audit-0.10-plan-ui.test.tsx, tests/interaction-guards.test.ts, tests/plans-multi-ui.test.tsx |
| Nowy rekord! | components/RecordsCard.tsx | tests/audit-0.10-tst-ui.test.tsx, tests/motyw.test.tsx, tests/voice.test.ts |
| Nowy szablon | app/template/[id].tsx | tests/audit-0.10-ui.test.tsx, tests/b2-plan-own-templates.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx +12 |
| Nowy szablon nie zostanie zapisany. | app/template/[id].tsx | tests/backlog-0.10.1-dane-ui.test.tsx, tests/edit-on-demand.test.tsx |
| Nowy szablon z ćwiczeniami i seriami tej sesji. | app/history/[id].tsx | tests/audit-0.10-ui.test.tsx |
| Nowy wygląd z ikony: znacznik dnia jak ikona aplikacji, stosy talerzy z procentem planu tygodnia, filiżanka w dzień odpoczynku, podsumowanie miesiąca jako stosy. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| Nowy wygląd: kolory i kroje, grafika talerzy na sztandze. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| Numer buildu w „O aplikacji”. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| o około 1/3–1/2 mniej serii (np. {k} z {n}; ćwiczenia z 1 serią bez zmian) | lib/start.ts | tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx, tests/deload-ui.test.tsx +2 |
| Obecny plan zostanie w „Inne plany” — wrócisz do niego jednym przyciskiem. | lib/plan.ts | tests/audit-0.10-gen.test.ts, tests/audit-0.10-plan.test.ts, tests/generator-ui.test.tsx +3 |
| Obecny plan zostanie w „Inne plany” razem ze zmianami pojedynczych dni od dziś ({n}) — wrócą, gdy znów go ustawisz. | lib/plan.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit-0.10-plan-ui.test.tsx +4 |
| obj. | components/ExerciseProgress.tsx | tests/matrix-i18n.test.tsx, tests/matrix-ui.test.tsx |
| Objaśnienia pod przyciskiem „i” na ekranach. | lib/whatsnew.ts | tests/release-0.20.test.tsx, tests/whats-new.test.tsx |
| objętość | app/history/[id].tsx | tests/audit-final-stats.test.ts, tests/audit-m1-025-muscle-caption.test.tsx, tests/audit-records-live.test.tsx +12 |
| Objętość | app/progression.tsx | tests/audit-records-live.test.tsx, tests/audit-records-logic.test.ts, tests/dashboard.test.tsx +5 |
| Objętość = ciężar × powtórzenia × mnożnik ćwiczenia (jak w Postępach); rozgrzewka poza. Partia główna liczy całość, pomocnicza połowę. | app/progression.tsx | tests/progression-ui.test.tsx |
| Objętość per partia ({u}) | app/progression.tsx | tests/scenario-full.test.tsx |
| Objętość per partia ({u}) — ten tydzień vs poprzedni | app/(tabs)/progress.tsx | tests/scenario-full.test.tsx |
| Objętość serii roboczych (ciężar × powtórzenia × mnożnik ćwiczenia); partia główna liczy całość, pomocnicza połowę. Ćwiczenia bez ciężaru (masa ciała, gumy) się nie liczą. | app/(tabs)/progress.tsx | tests/matrix-ui.test.tsx |
| Objętość tygodniowo ({u}) | app/(tabs)/progress.tsx | tests/scenario-full.test.tsx |
| Obok w nawiasie — cały poprzedni okres. Serie robocze bez rozgrzewki; rekordy jak w podsumowaniu treningu. | components/PeriodSummary.tsx | tests/period-summary.test.tsx |
| Obowiązuje jeden plan naraz. Po okresie przejściowym wrócisz do poprzedniego jednym przyciskiem. Tapnij plan, by zmienić jego nazwę i dni. | app/plan.tsx | tests/plans-multi-ui.test.tsx |
| Od {date}: tydzień deload. Przy starcie treningu zaproponuję {less}, ciężary bez zmian. | components/DeloadHint.tsx | tests/deload-ui.test.tsx |
| Od 0.10: biblioteka ćwiczeń uporządkowana — podobne warianty scalone, rzadsze widać po wyłączeniu filtra „Podstawowe” (Twoje treningi bez zmian); masa ciała z datą i e1RM w podciąganiu i pompkach, wskazówki techniki z rysunkiem ruchu, „Zapisz jako szablon” w historii. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| Od 0.10: szablon i ćwiczenie otwierają się w podglądzie — zmiany zaczynasz przyciskiem „Edytuj” i zatwierdzasz „Zapisz”. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| Od: {day} | components/DayPanel.tsx | tests/matrix-i18n.test.tsx, tests/places-ui.test.tsx |
| Odczyt z Apple Health (włączasz w Ustawieniach): kroki i inne aktywności w panelu dnia, średnia kroków pod „Ten tydzień” oraz tętno i kcal z zegarka przy sesji. | lib/whatsnew.ts | tests/release-0.16.test.tsx, tests/whats-new.test.tsx |
| Odhaczone są tylko serie rozgrzewkowe ({n}). Zapisać taki trening? | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Odhaczone serie bez ciężaru: {n}. | components/ActiveWorkout.tsx | tests/locations-verify3.test.tsx |
| Odhaczone serie bez czasu lub dystansu: {n}. | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Odhaczone serie bez powtórzeń: {n}. | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Odhaczone serie: {n} — przepadną. | components/WorkoutBlocks.tsx | tests/audit-0.10-live.test.tsx |
| odpoczynek | components/HistoryCalendar.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/matrix-invariants.test.ts, tests/motyw.test.tsx +1 |
| Odrzucić trening? | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-ui.test.tsx, tests/audit-close2-a.test.tsx +4 |
| Odrzucić zmiany? | components/DraftHeader.tsx | tests/audit-k1-fala2b.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx, tests/edit-history.test.tsx +4 |
| Odznacz ciężary, których nie masz. Najwyżej {n} ciężarów. | components/LoadEditor.tsx | tests/locations-audit.test.tsx |
| Ogólne | app/more/settings.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-lang.test.ts, tests/phone-p1.test.tsx |
| Ogólny | lib/generator.ts | tests/audit011b.test.tsx, tests/gen-general-ui.test.tsx, tests/gen-general.test.ts +3 |
| Ogólny (dla zdrowia i sprawności): {s} serie na ćwiczenie, {a}–{b} powtórzeń (w domu {c}–{d}), do chwili, gdy kolejne powtórzenie byłoby trudne. WHO 2020 zaleca ćwiczenia wzmacniające wszystkie główne partie co najmniej {n} dni w tygodniu. | app/generator.tsx | tests/gen-general-ui.test.tsx, tests/matrix-i18n.test.tsx |
| Opcjonalnie, tylko w telefonie. Z nią aplikacja liczy e1RM w podciąganiu (cała masa ciała — uproszczenie) i w pompkach (ok. {p}% masy ciała — badania z platformą siłową). Każdy trening liczy się z ostatnim pomiarem z tego dnia lub wcześniejszym; treningi sprzed pierwszego pomiaru — bez e1RM w tych ćwiczeniach. | app/more/bodymass.tsx | tests/audit-0.10-stats-ui.test.tsx |
| opuszczony: {name} | components/HistoryCalendar.tsx | tests/motyw.test.tsx, tests/plan-calendar-ui.test.tsx |
| Opuszczony: {name} | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/plan-calendar-ui.test.tsx |
| Ostatni trening był już skrócony — „Mniej serii” powtórzy go bez dalszego cięcia. | lib/start.ts | tests/audit-0.10-live.test.tsx |
| Ostatni trening był lżejszy | lib/start.ts | tests/audit-0.10-live.test.tsx |
| Ostatnia rozgrzewka o {t}, bez serii roboczych. Kontynuować czy odrzucić? | lib/timer.ts | tests/matrix-ui.test.tsx, tests/timer-logic.test.ts |
| Ostatnia rozgrzewka o {t}, bez serii roboczych. Otwórz, by kontynuować albo odrzucić. | lib/timer.ts | tests/matrix-ui.test.tsx, tests/timer-logic.test.ts |
| Ostatnia seria o {t}. Otwórz, by zakończyć albo kontynuować. | lib/timer.ts | tests/audit-0.10-live.test.tsx, tests/matrix-ui.test.tsx, tests/timer-logic.test.ts |
| Ostatnia seria o {t}. Zakończyć trening z tą godziną końca? | lib/timer.ts | tests/audit-0.10-live.test.tsx, tests/backlog-0.10.1-dane.test.ts, tests/matrix-ui.test.tsx +1 |
| Ostatnia udana kopia: {date} | app/(tabs)/index.tsx | tests/audit-m1-008-kopia-ui.test.tsx |
| Ostatnie treningi | app/exercise/[id].tsx | tests/edit-on-demand.test.tsx, tests/scenario-full.test.tsx |
| ostatnio | app/pick-template.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-stats-ui.test.tsx, tests/interaction-guards.test.ts +4 |
| Ostatnio {d}: | app/exercise/[id].tsx | tests/scenario-full.test.tsx |
| ostatnio {s} | components/NowBoard.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-stats-ui.test.tsx, tests/interaction-guards.test.ts +4 |
| Otwiera aplikację Mail | app/more/about.tsx | tests/idea-request.test.tsx, tests/support-mail.test.tsx |
| Otwiera listę szablonów. | app/plan.tsx | tests/home-plan-header.test.tsx |
| Otwiera Postępy. | components/Dashboard.tsx | tests/audit-0.10-ui.test.tsx, tests/guard-ui.test.tsx |
| Otwiera propozycje zamian na to miejsce. | components/ActiveWorkout.tsx | tests/adapt-ui.test.tsx |
| Otwiera stronę w przeglądarce. | app/more/about.tsx | tests/legal-links.test.tsx, tests/subscription-i18n.test.ts |
| Otwiera szczegóły Progresji. | components/Dashboard.tsx | tests/progression-ui.test.tsx |
| Otwiera ten dzień w zakładce Plan. | components/TodayPlan.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Otwiera wybór zamiennika. | app/adapt.tsx | tests/adapt-ui.test.tsx |
| Otwiera zamianę ćwiczenia | components/WorkoutBlocks.tsx | tests/swap-ui.test.tsx |
| Oznacz tydzień jako deload | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/guide.test.tsx |
| Pakiety ({n}) | app/more/licenses.tsx | tests/audit-0.10-data-ui.test.tsx |
| Pakiety open source: {n} | app/more/about.tsx | tests/audit-0.10-data-ui.test.tsx |
| pakiety: {n} · treść wg {p} | app/more/licenses.tsx | tests/audit-0.10-data-ui.test.tsx, tests/licenses-native.test.tsx |
| para: {a} ({r}); jeden hantel: {b} ({r1}) | components/LoadEditor.tsx | tests/locations-ui.test.tsx |
| Partia główna liczy 1 serię, pomocnicza 0,5 (np. wyciskanie: klatka 1, triceps i barki po 0,5). Partie ustawisz w edycji ćwiczenia. | app/(tabs)/progress.tsx | tests/matrix-ui.test.tsx |
| Partie z większą objętością niż poprzednio: {list} | app/progression.tsx | tests/progression-ui.test.tsx |
| Paski serii pokazują osobno serie pośrednie (pomocnicze, liczone po 0,5). | lib/whatsnew.ts | tests/release-0.16.test.tsx, tests/whats-new.test.tsx |
| pauza | components/ActiveWorkout.tsx | tests/audit-0.10-lang.test.ts, tests/interaction-guards.test.ts, tests/m3-p2-board-ui.test.tsx +5 |
| Pauza treningu | components/ActiveWorkout.tsx | tests/audit-0.10-lang.test.ts, tests/audit-0.10-live.test.tsx, tests/guide.test.tsx +5 |
| Pauza treningu — czas pauzy nie liczy się do czasu trwania. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| Pełny trening | lib/start.ts | tests/audit-0.10-live.test.tsx, tests/deload-ui.test.tsx, tests/pick-template.test.tsx |
| Pierwsza wersja testowa: treningi z szablonów, historia, postępy i rekordy, kopia zapasowa w Plikach. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| Pierwsze kroki | components/Dashboard.tsx | tests/dashboard.test.tsx |
| Pierwszy trening: duży przycisk „Start” u góry albo „Pusty trening”. | components/Dashboard.tsx | tests/dashboard.test.tsx, tests/edit-on-demand.test.tsx, tests/flows.test.tsx +2 |
| piszczelowy przedni | app/exercise/[id].tsx | tests/audit-0.10-ui.test.tsx |
| Plan | app/(tabs)/_layout.tsx | tests/adapt-ui.test.tsx, tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-gen-ui.test.tsx +156 |
| Plan „{name}” jest teraz aktywny. | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/m3-p4-generator.test.tsx, tests/plan-own-templates-ui.test.tsx +1 |
| Plan „{name}” jest w „Inne plany”. | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/plan-own-templates-ui.test.tsx |
| plan bez ciężaru lub powtórzeń | components/GuardSection.tsx | tests/guard-ui.test.tsx |
| Plan powtarza się co tydzień. Pojedyncze dni zmienisz w zakładce Plan. | app/plan.tsx | tests/dashboard.test.tsx, tests/home-b.test.tsx, tests/plan-calendar-ui.test.tsx |
| Plan tygodnia | components/TodayPlan.tsx | tests/audit-0.10-ui.test.tsx, tests/dashboard.test.tsx, tests/guide.test.tsx +6 |
| Plan tygodnia i Kalendarz | lib/guide.ts | tests/guide.test.tsx |
| Plan tygodnia z Twoich szablonów według tych samych reguł co generator — przejrzysz go przed zapisem. Szablony zostają bez zmian. | components/OwnPlan.tsx | tests/plan-own-templates-ui.test.tsx |
| Plan zmieniony w {day} — wcześniejsze dni wg poprzedniego planu | components/WeekStacks.tsx | tests/postep-tygodnia-zmiana-planu.test.tsx |
| Plan: {name} | components/TodayPlan.tsx | tests/deload-week.test.tsx, tests/guide.test.tsx, tests/home-b.test.tsx +2 |
| Plik jest pusty. Dane nie zostały zmienione. | app/more/import.tsx | tests/csv-import-ui.test.tsx |
| Plik jest za duży. Dane nie zostały zmienione. | app/more/import.tsx | tests/csv-import-ui.test.tsx |
| Plik ma schemat {a}, a ta wersja obsługuje do {b}. Zaktualizuj aplikację. | lib/backup.ts | tests/audit-0.10-plan.test.ts, tests/matrix-data-fuzz.test.ts, tests/matrix-ui.test.tsx |
| Plik nie podaje godzin treningów — dzień, w którym masz już trening, zostanie pominięty jako duplikat. | app/more/import.tsx | tests/csv-import-ui.test.tsx |
| Plik nie podaje, czy ciężary są w kg, czy w lb. Domyślnie: jednostka z Ustawień. | app/more/import.tsx | tests/csv-import-ui.test.tsx |
| Plik nie zawiera żadnych poprawnych treningów. Dane nie zostały zmienione. | app/more/import.tsx | tests/csv-import-ui.test.tsx |
| Płacisz co miesiąc i kończysz, kiedy chcesz. | app/paywall.tsx | tests/subscription-i18n.test.ts, tests/subscription-ui.test.tsx |
| Płacisz raz i masz na zawsze. | app/paywall.tsx | tests/subscription-i18n.test.ts, tests/subscription-ui.test.tsx |
| Po dopisaniu zakresu byłoby ciężarów: {c} — najwyżej {n}. Zwiększ krok albo usuń odznaczone. | components/LoadEditor.tsx | tests/audit-0.10-ui.test.tsx |
| Po kilku tygodniach treningu z rzędu zakładka Plan podpowie „Zaplanuj deload od …”. | lib/guide.ts | tests/guide.test.tsx |
| Po przywróceniu z archiwum szablon wróci do planu. | lib/plan.ts | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts |
| Po ukryciu komunikatu kopii nie da się już wysłać z aplikacji — najpierw ją wyślij, jeśli jest potrzebna. | app/(tabs)/index.tsx | tests/matrix-ui.test.tsx |
| Po zapisie szablon trafi na ten dzień. | app/plan.tsx | tests/plan-new-template-day.test.tsx |
| Podgląd | app/generator.tsx | tests/asc-metadane.test.ts, tests/csv-import-ui.test.tsx, tests/dashboard.test.tsx +5 |
| Podgląd importu | app/more/import.tsx | tests/csv-import-ui.test.tsx |
| Podpowiedź wróci w przyszłym tygodniu. | components/DeloadHint.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Podstawowe | components/LibScope.tsx | tests/audit-0.10-tst-ui.test.tsx, tests/audit011b.test.tsx, tests/scenario-0.10.test.tsx +2 |
| Pokazane wszystkie ćwiczenia, także niszowe | components/LibScope.tsx | tests/catalog-library25.test.tsx |
| Pokazano {n} z {m} — wpisz nazwę, by zawęzić. | app/(tabs)/progress.tsx | tests/matrix-ui.test.tsx |
| Pokazuje objaśnienie pod nagłówkiem. | components/InfoTip.tsx | tests/info-tip.test.tsx |
| Pokaż cele partii | app/more/settings.tsx | tests/set-goals-ui.test.tsx, tests/set-goals.test.ts |
| Pokaż inne ćwiczenia | app/swap.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/backlog-0410.test.tsx, tests/catalog-full.test.tsx +5 |
| polecane | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/plan-calendar-ui.test.tsx |
| Policzone jako trening z {day} — ten dzień jest wolny. | lib/plan.ts | tests/plan-wczesniej-ui.test.tsx, tests/plan-wczesniej.test.ts |
| Połącz z telefonem | lib/watch/labels.ts | tests/watch-protocol.test.ts, tests/watch-scenarios.ts |
| Pomiar z tym samym dniem zastępuje poprzedni. | app/more/bodymass.tsx | tests/audit-0.10-data-ui.test.tsx |
| Pomiary | app/more/bodymass.tsx | tests/audit-0.10-data-ui.test.tsx, tests/guide.test.tsx, tests/tabs-four.test.tsx |
| Pomiary masy ciała („Masa ciała — pomiary”) usuniesz po „Edytuj” w nagłówku albo przesunięciem w lewo. | lib/guide.ts | tests/guide.test.tsx |
| Pominąć ćwiczenie? | lib/watch/labels.ts | tests/watch-protocol.test.ts |
| Pominięcie ćwiczenia przerwie pomiar — ten czas się nie zapisze. | lib/confirm.ts | tests/adapt-ui.test.tsx, tests/audit-0.10-live.test.tsx, tests/interaction-patterns.test.tsx |
| Pominięte (bez ciężaru): {list} | components/GuardSection.tsx | tests/guard-ui.test.tsx |
| Pominięte (bez punktu odniesienia): {list} | components/GuardSection.tsx | tests/guard-ui.test.tsx |
| Pominięte (plan bez ciężaru lub powtórzeń): {list} | components/GuardSection.tsx | tests/guard-ui.test.tsx |
| pominięte dziś | components/WorkoutBlocks.tsx | tests/skip-today.test.tsx |
| Pominięte jako duplikaty: {n} | app/more/import.tsx | tests/csv-import-ui.test.tsx |
| Pominięte wiersze (błędne dane): {n} | app/more/import.tsx | tests/csv-import-ui.test.tsx |
| pomocnicza | app/exercise/[id].tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-k1-muscleload.test.tsx, tests/audit-m1-044-brd.test.ts +15 |
| Pomysł | lib/support.ts | tests/idea-request.test.tsx |
| Poniżej celu | components/GuardSection.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/generator-ui.test.tsx +7 |
| Poniżej celu (bez planu tygodnia): {list}. | lib/guard.ts | tests/guard.test.ts, tests/progression-ui.test.tsx |
| Poniżej celu nawet z planem | components/GuardSection.tsx | tests/guard-ui.test.tsx, tests/guard.test.ts, tests/progression-ui.test.tsx |
| Poniżej celu nawet z planem: {list}. | lib/guard.ts | tests/guard-ui.test.tsx, tests/guard.test.ts, tests/progression-ui.test.tsx |
| Poniżej celu serii tygodniowo: {list}. Cel ustawisz w Ustawieniach (automatycznie dolny próg zalecany przy budowie masy); serie dodasz w szablonach. | lib/generator.ts | tests/plan-own-templates-ui.test.tsx, tests/plan-own-templates.test.ts |
| Poniżej celu serii tygodniowo: {list}. Pomoże więcej sesji, dłuższy czas albo więcej sprzętu w miejscu. | lib/generator.ts | tests/generator-ui.test.tsx |
| Poprawione sformułowania części wskazówek techniki. | lib/whatsnew.ts | tests/release-0.15.test.tsx, tests/whats-new.test.tsx |
| Poprawka zapisu: wszystkie serie bloku „{name}” przejdą pod wybrane ćwiczenie (wartości bez zmian). | app/swap.tsx | tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx |
| Poprawka: zapis i odczyt Apple Health działają (w poprzedniej wersji testowej brakowało uprawnienia). | lib/whatsnew.ts | tests/release-0.20.test.tsx, tests/whats-new.test.tsx |
| Poprawki: Postępy pamiętają wybrane ćwiczenie, import bez godzin pokazuje „godzina nieznana”, a teksty pomocy zgadzają się z nazwami zakładek. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| poprz. | app/progression.tsx | tests/dashboard.test.tsx, tests/guard-ui.test.tsx, tests/period-bars.test.tsx +1 |
| Poprzedni miesiąc | app/progression.tsx | tests/audit-0.10-ui.test.tsx, tests/audit-m1-032-total-bars.test.tsx, tests/history-calendar.test.tsx +2 |
| Poprzedni okres | components/PeriodSummary.tsx | tests/audit-m1-p3-coverage.test.tsx, tests/motyw-miesiac.test.tsx, tests/period-summary.test.tsx |
| Poprzedni plan | app/generator.tsx | tests/audit-0.10-tst-ui.test.tsx, tests/mutation-plan.test.ts |
| Poprzedni tydzień | app/progression.tsx | tests/audit-m1-032-total-bars.test.tsx, tests/deload-week.test.tsx, tests/period-bars.test.tsx +4 |
| Poprzedni tydzień jest oznaczony jako deload. | app/progression.tsx | tests/deload-week.test.tsx, tests/progression-ui.test.tsx |
| Poprzedni tydzień vs 2 tyg. temu | app/progression.tsx | tests/progression-ui.test.tsx |
| Poprzednio | app/template/[id].tsx | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/decisions-0310.test.tsx +9 |
| Poprzednio: {l} | components/WorkoutBlocks.tsx | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/decisions-0310.test.tsx +4 |
| Porównanie tych samych dni miesiąca: 1–{n}. | app/progression.tsx | tests/progression-ui.test.tsx |
| Porównanie: {name} | app/progression.tsx | tests/progression-ui.test.tsx, tests/set-goals-ui.test.tsx |
| Porównywane ćwiczenia: tonaż/sesję i ciężar roboczy | components/GuardSection.tsx | tests/guard-ui.test.tsx |
| Postępy i rekordy | lib/guide.ts | tests/guide.test.tsx, tests/tabs-four.test.tsx |
| Postępy mają własną zakładkę: podsumowanie, „Progresja”, wykresy ćwiczeń i masa ciała. | lib/whatsnew.ts | tests/tabs-four.test.tsx, tests/whats-new.test.tsx |
| Postępy: dwa słupki na partię — porównanie okresu z poprzednim okresem. | lib/whatsnew.ts | tests/release-0.20.test.tsx, tests/whats-new.test.tsx |
| Postępy: podsumowanie tygodnia i miesiąca z mapą mięśni, znacznik {n} serii na partię w tygodniu i oznaczanie tygodnia deload. | lib/whatsnew.ts | tests/backlog-0.10.1-dane.test.ts, tests/whats-new.test.tsx |
| Postępy: podsumowanie tygodnia lub miesiąca z poprzednim okresem obok. | lib/guide.ts | tests/guide.test.tsx |
| pośrednie (pomocnicze, po {h}) | components/ProgressBars.tsx | tests/set-split-ui.test.tsx |
| Potrzebne połączenie z internetem. | app/paywall.tsx | tests/subscription-i18n.test.ts |
| Pow. | app/history/[id].tsx | tests/m3-p3-postepy-historia.test.tsx, tests/matrix-ui.test.tsx, tests/regress.test.tsx +1 |
| Powiadomienia | app/more/settings.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx, tests/matrix-ui.test.tsx +2 |
| Powiadomienia działają | app/more/settings.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| powtórzenia | components/BoardControls.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit-0.10-stats-ui.test.tsx +31 |
| powtórzenia do | app/template/[id].tsx | tests/scenario-full.test.tsx |
| powtórzenia od | app/template/[id].tsx | tests/audit-0.10-tst-ui.test.tsx, tests/scenario-full.test.tsx, tests/template-rows.test.tsx |
| Powtórzenia: {a}–{b} (wytyczne USA 2018, ACSM 2011); w domu i bez obciążenia {c}–{d} — uproszczenie: lżejszy ciężar, więcej powtórzeń. | app/generator.tsx | tests/gen-general-ui.test.tsx, tests/matrix-i18n.test.tsx |
| poziom {n} | app/more/location/[id].tsx | tests/audit-0.10-stats-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/flows.test.tsx +7 |
| Poziomy gum, które masz w tym miejscu (1 = cienka, 7 = bardzo gruba). | app/more/location/[id].tsx | tests/matrix-ui.test.tsx |
| Pozostałe akcje dla tego dnia. | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Pozostałe nieodhaczone serie: {n} — też nie zostaną zapisane. | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx |
| Pozycja końcowa | lib/figures/index.ts | tests/audit-k1-bl-mer.test.tsx, tests/figures.test.tsx |
| Pozycja wyjściowa | lib/figures/index.ts | tests/audit-k1-bl-mer.test.tsx, tests/figures.test.tsx |
| PR | components/WorkoutBlocks.tsx | tests/asc-metadane.test.ts, tests/audit-m1-037-ss-pr-dict.test.ts, tests/audit-m1-044-brd.test.ts +24 |
| Progresja | app/_layout.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/dashboard.test.tsx, tests/generator-ui.test.tsx +4 |
| Progresja: gdy zrobisz górę zakresu powtórzeń, dołóż ciężar. Stopniowe zwiększanie obciążenia zalecają stanowiska ACSM; moment i wielkość kroku to konwencja. | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/generator-ui.test.tsx |
| Propozycja według Twoich założeń — przejrzysz ją przed zapisem. Reguły pochodzą z przeglądów badań i zaleceń organizacji (WHO, ACSM); części oznaczone jako konwencja albo uproszczenie nie są bezpośrednim wynikiem badań. | app/generator.tsx | tests/generator-ui.test.tsx |
| Propozycje | app/swap.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/maestro-failures.test.ts, tests/matrix-logic.test.tsx +3 |
| Przeciągnij za ≡, żeby zmienić kolejność. Superset przesuwa się w całości; kolejność w nim zmienisz uchwytami przy ćwiczeniach. | app/reorder.tsx | tests/matrix-i18n.test.tsx, tests/matrix-ui.test.tsx |
| przeczytane | app/guide.tsx | tests/audit-0.10-ui.test.tsx, tests/guide.test.tsx, tests/tabs-four.test.tsx |
| Przeczytane: {n} z {m} | app/(tabs)/more.tsx | tests/guide.test.tsx |
| Przejrzyj podgląd i „Na czym to oparte” — wynik zapisuje się dopiero po zatwierdzeniu. | lib/guide.ts | tests/guide.test.tsx |
| Przenieś na {day} | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/plan-calendar-ui.test.tsx |
| przerwa | app/template/[id].tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-lang.test.ts, tests/audit-0.10-ui.test.tsx +34 |
| Przerwa | app/history/[id].tsx | tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-lang.test.ts, tests/audit-0.10-live.test.tsx +24 |
| przerwa {s} | app/(tabs)/_layout.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-lang.test.ts, tests/audit-0.10-ui.test.tsx +34 |
| przerwa {s} s | lib/timer.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-lang.test.ts, tests/audit-0.10-ui.test.tsx +34 |
| przerwa minęła | components/ActiveWorkout.tsx | tests/m3-p2-board-ui.test.tsx, tests/scenario-full.test.tsx |
| Przerwa minęła | lib/timer.ts | tests/audit-0.10-live.test.tsx, tests/audit-io-flows.test.tsx, tests/matrix-ui.test.tsx +1 |
| Przerwa trwa — powiadomić na koniec? | components/ActiveWorkout.tsx | tests/audit-m1-035-notif-denied.test.tsx, tests/m3-p2-board-ui.test.tsx |
| przerwa z {s} | components/ActiveWorkout.tsx | tests/release-0.20.test.tsx, tests/watch-scenarios.ts, tests/whats-new.test.tsx |
| Przerwa. Pozostały czas: {t}. Cała przerwa: {all}. | components/BoardFace.tsx | tests/m3-fix-e2e-teksty.test.ts, tests/m3-p2-matrix.test.tsx |
| Przerwy: {a} min po ciężkich seriach boju głównego, {b} min po innych wielostawowych, {c} min po jednostawowych i core — uproszczenie; przeglądy są niejednoznaczne (ACSM 2026: długość przerwy nie zmieniała przyrostu siły). | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx |
| Przerwy: {b} min po wielostawowych, {c} min po jednostawowych i core — uproszczenie; źródła są niejednoznaczne (ACSM 2026: długość przerwy nie zmieniała przyrostu siły). | app/generator.tsx | tests/matrix-i18n.test.tsx |
| Przesunięcie serii albo nazwy ćwiczenia w lewo usuwa je (z potwierdzeniem). | lib/guide.ts | tests/guide.test.tsx |
| Przesuń niżej | components/DragList.tsx | tests/template-cards.test.tsx |
| Przesuń plan o 1 dzień | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/places-shift-scenario.test.tsx, tests/plan-calendar-ui.test.tsx +1 |
| Przesuń plan od dziś | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/plan-calendar-ui.test.tsx |
| Przesuń wyżej | components/DragList.tsx | tests/template-cards.test.tsx |
| Przód | components/Guard.tsx | tests/muscle-map.test.tsx |
| Przycisk „Napisz do nas” w Więcej → O aplikacji. | lib/whatsnew.ts | tests/release-0.17.test.tsx, tests/whats-new.test.tsx |
| Przyda się: {list}. | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/mutation-generator.test.ts |
| Przypisanie partii mięśniowych — jedno źródło, nie ustalone. Od niego zależą serie na partię, mapa mięśni, generator i propozycje w kalendarzu. | app/exercise/[id].tsx | tests/audit-0.10-ui.test.tsx |
| Przypisanie partii mięśniowych — uproszczenie, nie wynik badań. Od niego zależą serie na partię, mapa mięśni, generator i propozycje w kalendarzu. | app/exercise/[id].tsx | tests/audit-0.10-ui.test.tsx, tests/matrix-ui.test.tsx |
| Przypisanie partii mięśniowych — ustalone na podstawie przeglądu badań dla tego ćwiczenia. Od niego zależą serie na partię, mapa mięśni, generator i propozycje w kalendarzu. | app/exercise/[id].tsx | tests/zrodlo-jedno.test.ts |
| Przypisanie partii: jedno źródło. | app/exercise/[id].tsx | tests/audit-0.10-stats-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/zrodlo-jedno.test.ts |
| Przypisanie partii: przegląd badań. | app/exercise/[id].tsx | tests/zrodlo-jedno.test.ts |
| Przypisanie partii: uproszczenie. | app/exercise/[id].tsx | tests/audit-0.10-stats-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/matrix-ui.test.tsx +1 |
| przyrząd: {impl} | components/WorkoutBlocks.tsx | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx +1 |
| Przywrócono zakupy. | app/paywall.tsx | tests/subscription-i18n.test.ts |
| Przywróć z archiwum | app/template/[id].tsx | tests/edit-on-demand.test.tsx, tests/template-folders.test.tsx |
| Pusta nazwa folderu | app/template/[id].tsx | tests/edit-on-demand.test.tsx |
| Pyta o potwierdzenie. | app/plan.tsx | tests/plan-wczesniej-ui.test.tsx |
| Rano o {h}:00 w dniu zaplanowanego treningu przyjdzie powiadomienie. Potrzebna jest zgoda na powiadomienia — iOS zapyta o nią po „Dalej”. | lib/planReminder.ts | tests/audit-0.10-plan-ui.test.tsx |
| Redukcja | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts +7 |
| Redukcja: trening jak na masę (chroni mięśnie) i jedna sesja umiarkowanego cardio. | app/generator.tsx | tests/generator-ui.test.tsx |
| Redukcja: trening jak na masę (chroni mięśnie); sesja cardio w planie od {k} dni w tygodniu. | app/generator.tsx | tests/gen-days-ui.test.tsx, tests/generator-ui.test.tsx, tests/matrix-i18n.test.tsx |
| REKORDY | components/ExerciseProgress.tsx | tests/audit-records-ui.test.tsx, tests/matrix-i18n.test.tsx, tests/scenario-full.test.tsx +1 |
| Rekordy w tym okresie | components/PeriodSummary.tsx | tests/period-summary.test.tsx |
| Ręcznie | app/more/settings.tsx | tests/matrix-i18n.test.tsx, tests/release-0.14.test.tsx, tests/set-goals-ui.test.tsx +2 |
| RIR — powtórzenia w zapasie: RIR = 10 − RPE (RPE 10 = 0 RIR, RPE 9 = 1 RIR; Zourdos i in., JSCR 2016). Zapisane wartości przeliczają się przy zmianie skali. | app/more/settings.tsx | tests/effort-scale.test.tsx |
| RIR wpisuje się w zakresie 0–{max}; więcej niż {max} powtórzeń w zapasie zapisuje się jako „lekko” (RPE {light}), bo poniżej RPE {min} skala opisuje wysiłek słowami, a nie powtórzeniami w zapasie (Helms i in. 2016). | app/more/settings.tsx | tests/audit-k1-bl-mer.test.tsx |
| robione {n}× | lib/swap.ts | tests/audit-0.10-plan-ui.test.tsx, tests/dashboard.test.tsx, tests/first-steps-empty.test.tsx +15 |
| rok | app/paywall.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/audit-io-more.test.tsx +38 |
| rozgrzewka | lib/live.ts | tests/audit-close2-a.test.tsx, tests/audit-stale-ui.test.tsx, tests/matrix-invariants.test.ts +9 |
| Rozgrzewki: {d} z {n} zrobione | components/BoardFace.tsx | tests/m3-p2-board-ui.test.tsx, tests/m3-p2-matrix.test.tsx |
| Ruch | components/ExerciseCues.tsx | tests/cues-014.test.tsx, tests/cues.test.tsx, tests/figures.test.tsx |
| Rysunek ruchu: {opis} | lib/figures/index.ts | tests/figures.test.tsx, tests/maestro-selectors.test.ts |
| Rysunek schematyczny — pozycje orientacyjne. | components/ExerciseFigure.tsx | tests/figures.test.tsx |
| Rzadziej niż {n} dni w tygodniu: {list} (dzień tylko z pracą pomocniczą = {h}). | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx |
| sek. | app/history/edit/[id].tsx | tests/matrix-i18n.test.tsx, tests/matrix-ui.test.tsx |
| Seria | lib/timer.ts | tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-lang.test.ts, tests/audit-0.10-live.test.tsx +45 |
| seria · bez celu | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| seria · cel {s} | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| seria {n} | lib/live.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx +63 |
| Seria {n} | app/history/edit/[id].tsx | tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-lang.test.ts, tests/audit-0.10-live.test.tsx +45 |
| Seria {n} — {ex} | app/history/edit/[id].tsx | tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-lang.test.ts, tests/audit-0.10-live.test.tsx +45 |
| seria {n} z {all} | lib/live.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx +63 |
| seria {n} z {all} · drop set | lib/live.ts | tests/audit-0.10-live.test.tsx, tests/watch-cue.test.ts, tests/watch-snapshot.test.ts |
| seria {s} s | lib/timer.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx +63 |
| Seria jest już odhaczona. | components/WorkoutBlocks.tsx | tests/audit-m1-028-delete-menus.test.tsx, tests/matrix-ui.test.tsx |
| Seria skończona | lib/timer.ts | tests/matrix-ui.test.tsx, tests/timer-logic.test.ts |
| Serie | components/Dashboard.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-m1-044-brd.test.ts, tests/audit-m1-048-claims-registry.test.ts +22 |
| Serie bez ciężaru: {n}. | app/history/edit/[id].tsx | tests/integration-090.test.tsx |
| Serie bez wyniku nie zostaną zapisane. | app/history/edit/[id].tsx | tests/guide.test.tsx, tests/matrix-ui.test.tsx |
| Serie bez wyniku zostaną pominięte: {n}. | app/history/edit/[id].tsx | tests/edit-history.test.tsx, tests/scenario-full.test.tsx |
| Serie do uzupełnienia | components/ActiveWorkout.tsx | tests/watch-fill-ui.test.tsx |
| Serie na partię w tygodniu (pomocnicza = {h} serii — uproszczenie): {list} | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/generator-ui.test.tsx, tests/plan-own-templates-ui.test.tsx +2 |
| Serie per partia | app/progression.tsx | tests/scenario-full.test.tsx |
| Serie per partia — ten tydzień vs poprzedni | app/(tabs)/progress.tsx | tests/scenario-full.test.tsx |
| Serie robocze | app/progression.tsx | tests/audit-m1-044-brd.test.ts, tests/m3-p3-postepy-historia.test.tsx, tests/period-summary.test.tsx +2 |
| Serie robocze tygodniowo | app/(tabs)/progress.tsx | tests/m3-p3-postepy-historia.test.tsx, tests/scenario-full.test.tsx |
| Serie z tej sesji przepadną. | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Serie: {d} z {n} zrobione | components/BoardFace.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/dashboard.test.tsx, tests/first-steps-empty.test.tsx +13 |
| Serie: {n} | app/more/import.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-m1-048-claims-registry.test.ts, tests/audit011b.test.tsx +6 |
| Serie: {s} na ćwiczenie — ACSM 2026 zaleca co najmniej {m}; więcej serii zwykle daje trochę więcej, z malejącym zyskiem. Liczba {s} to uproszczenie. | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx |
| Serie: {s} na ćwiczenie — dla zdrowia zwykle {s}–{b}. ACSM 2026 zaleca co najmniej {m}. Wytyczne USA 2018: jedna seria działa, {s}–{b} mogą działać lepiej; ACSM 2011: jedna seria może wystarczyć, zwłaszcza u początkujących i starszych. {s} to dolna granica — uproszczenie. | app/generator.tsx | tests/audit011b.test.tsx, tests/gen-general-ui.test.tsx, tests/matrix-i18n.test.tsx |
| Sesja | app/_layout.tsx | tests/audit-k1-fala2b.test.tsx, tests/edit-on-demand.test.tsx, tests/scenario-full.test.tsx +1 |
| Sesja w historii zostanie bez zmian. | app/history/edit/[id].tsx | tests/scenario-full.test.tsx |
| Sesje | components/ExerciseProgress.tsx | tests/audit-records-ui.test.tsx, tests/gen-days-ui.test.tsx, tests/scenario-full.test.tsx |
| Siła | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit-k1-bl-mer.test.tsx +15 |
| Siła bez obciążenia zewnętrznego (sztanga, hantle, kettlebell, maszyny, wyciągi): ciężkich serii (ok. {p}% maksimum) tu nie zrobisz, więc plan jest jak na masę w domu — {s} × {a}–{b} powtórzeń blisko upadku. Siła też wtedy rośnie, ale zwykle mniej niż przy dużym ciężarze. | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx |
| Siła: bój główny na początku, {s} × {a}–{b} powtórzeń (ciężko, ok. {p}% maksimum i więcej), pozostałe ćwiczenia {s} × {c}–{d}. | app/generator.tsx | tests/generator-ui.test.tsx |
| Skala do dwukrotności celu, » — więcej. | components/GuardSection.tsx | tests/guard-ui.test.tsx |
| Skala wysiłku RPE albo RIR w Ustawieniach. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| Skupiony | app/more/settings.tsx | tests/audit-m1-045-store-description.test.ts, tests/interaction-guards.test.ts, tests/matrix-i18n.test.tsx +1 |
| Skupiony: bieżąca seria dużymi cyframi nad listą ćwiczeń. | app/more/settings.tsx | tests/tuleja.test.tsx |
| specjalistyczne serwisy treningowe | components/ExerciseCues.tsx | tests/audit-k1-bl-mer.test.tsx, tests/cues.test.tsx |
| Spójniejsza obsługa w całej aplikacji: okna z „Anuluj” po lewej, „+” w nagłówkach list do dodawania oraz czytelniejsze komunikaty i opisy dla VoiceOver. | lib/whatsnew.ts | tests/release-0.17.test.tsx, tests/whats-new.test.tsx |
| Sprawdź datę i godzinę | app/history/add.tsx | tests/edit-history.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Spróbuj ponownie. | app/(tabs)/index.tsx | tests/health-read-ui.test.tsx, tests/interaction-patterns.test.tsx, tests/matrix-ui.test.tsx |
| SS | lib/state/groups.ts | tests/asc-kontrola.test.ts, tests/asc-metadane.test.ts, tests/audit-0.10-lang.test.ts +22 |
| SS {g} | lib/state/groups.ts | tests/asc-kontrola.test.ts, tests/asc-metadane.test.ts, tests/audit-0.10-lang.test.ts +22 |
| stabilizacja | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| stacja | lib/swap.ts | tests/audit-k1-brands.test.ts, tests/locations-audit.test.tsx, tests/matrix-logic.test.tsx +5 |
| Stanowisko ACSM 2026: przy co najmniej {n} seriach na partię tygodniowo przyrost mięśni był większy niż przy mniejszej objętości; trening siłowy w różnych formach daje przyrost w porównaniu z brakiem treningu. | app/(tabs)/progress.tsx | tests/set-goals.test.ts, tests/sets-mark.test.tsx |
| Start następnego treningu: {name} | components/StartPanel.tsx | tests/home-b.test.tsx, tests/ux.test.tsx |
| Start stopera serii | components/WorkoutBlocks.tsx | tests/audit-0.10-live.test.tsx, tests/audit-close-b.test.tsx, tests/audit-close-c.test.tsx +18 |
| Start treningu w tych dniach weźmie to miejsce przed miejscem szablonu, a okno „Dostosuj” zaproponuje zamiany. Nic nie zmienia się samo. | components/DayPanel.tsx | tests/places-ui.test.tsx |
| Stoper trwa | components/WorkoutBlocks.tsx | tests/matrix-ui.test.tsx |
| stos na {v} | components/EquipVisual.tsx | tests/karta-sprzet.test.tsx, tests/matrix-a11y.test.tsx, tests/matrix-karta.test.tsx |
| stożek rotatorów | app/exercise/[id].tsx | tests/audit-0.10-ui.test.tsx |
| Strażnik progresji | components/GuardSection.tsx | tests/guard-ui.test.tsx, tests/release-0.20.test.tsx, tests/whats-new.test.tsx +1 |
| Stuknij dzień w zakładce Plan: „Przesuń albo pomiń” pokazuje możliwości — przesunięcie planu o 1 dzień, tylko tego treningu, zamianę albo wolne. | lib/guide.ts | tests/guide.test.tsx |
| Stuknij liczbę na tablicy i wpisz ciężar oraz powtórzenia (albo użyj + i −), potem „Seria zrobiona” — przerwa odlicza się sama. Gdy brakuje wyniku, „Seria zrobiona” przenosi kursor do pustego pola. | lib/guide.ts | tests/guide.test.tsx |
| Subskrybuj | app/paywall.tsx | tests/m5s1-bez-proby.test.ts, tests/subscription-i18n.test.ts, tests/subscription-ui.test.tsx |
| Subskrypcja | components/SubscriptionCard.tsx | tests/prices-decision.test.ts, tests/store-review-notes.test.ts, tests/subscription-i18n.test.ts +1 |
| Subskrypcja odnawia się automatycznie, dopóki jej nie anulujesz w ustawieniach konta Apple. | app/paywall.tsx | tests/subscription-i18n.test.ts |
| suma pow. | lib/stats.ts | tests/stats.test.ts |
| Suma powtórzeń | lib/stats.ts | tests/audit-records-logic.test.ts, tests/records-card.test.tsx |
| superset | app/reorder.tsx | tests/architecture-limits.test.ts, tests/audit-journey-c.test.tsx, tests/flows.test.tsx +10 |
| superset · przerwa po rundzie {t} | components/WorkoutBlocks.tsx | tests/scenario-full.test.tsx |
| Superset ustawisz w szablonie: „Edytuj”, potem „⇅ SS” przy ćwiczeniu łączy je z następnym (w trakcie treningu ten sam przycisk jest przy ćwiczeniu) — przerwa liczy się po ostatnim ćwiczeniu grupy. | lib/guide.ts | tests/guide.test.tsx |
| Szablon | app/_layout.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-lang.test.ts, tests/audit-0.10-plan-ui.test.tsx +31 |
| szablon bez zmian | app/adapt.tsx | tests/guide.test.tsx |
| Szablon jest pusty — „Edytuj”, by dodać ćwiczenia. | app/template/[id].tsx | tests/edit-on-demand.test.tsx |
| Szablon jest pusty — dodaj ćwiczenia | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Szablon otwiera się w podglądzie ze „Start”; zmiany (także folder) dopiero po „Edytuj” — zapisuje je „Zapisz”. | lib/guide.ts | tests/guide.test.tsx |
| Szablon w planie: {name} | components/OwnPlan.tsx | tests/plan-own-templates-ui.test.tsx |
| Szablon zaktualizowany. | app/history/[id].tsx | tests/audit-0.10-ui.test.tsx, tests/live2-split-template.test.tsx |
| Szablon zostanie bez zmian. | app/template/[id].tsx | tests/edit-on-demand.test.tsx |
| Szablony trafiają do folderu „Wygenerowane”, a plan do „Inne plany” albo od razu jako aktywny. | lib/guide.ts | tests/guide.test.tsx |
| Szablony trafią do folderu „{folder}”, a plan — do „Inne plany” albo od razu jako aktywny. | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/generator-ui.test.tsx |
| Szablony w folderach i archiwum, „Pomiń dziś” bez zmiany szablonu, usuwanie przesunięciem w lewo. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| Szablony zostają bez zmian. Plan trafi do „Inne plany” albo od razu jako aktywny. | components/OwnPlan.tsx | tests/plan-own-templates-ui.test.tsx |
| Szablony: {list} — w folderze „{folder}” na liście Szablony. | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/ux2-08-gen-replace-active.test.tsx |
| sztanga | lib/swap.ts | tests/adapt-logic.test.ts, tests/adapt-scenario.test.tsx, tests/adapt-ui.test.tsx +121 |
| Szukam swojego rytmu | app/paywall.tsx | tests/m5s1-bez-proby.test.ts, tests/subscription-i18n.test.ts, tests/subscription-ui.test.tsx |
| ta sama propozycja co przy innym ćwiczeniu — możesz zmienić | app/adapt.tsx | tests/adapt-ui.test.tsx |
| tak — przy serii wybierasz gumę | app/exercise/[id].tsx | tests/scenario-full.test.tsx |
| Także przez głośnik | lib/voice.ts | tests/matrix-i18n.test.tsx, tests/voice-ui.test.tsx, tests/voice.test.ts |
| Talerze: ciężar i liczba sztuk (wszystkie, dla obu hantli razem). | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Talerze: ciężar i liczba sztuk (wszystkie, na obie strony razem). | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Tapnij numer serii, by zmienić typ (W, D, F) albo dodać notatkę. Serie bez wyniku nie zostaną zapisane. | lib/guide.ts | tests/guide.test.tsx |
| Tapnij, by pokazać tylko dostępne. | app/picker.tsx | tests/audit-0.10-lang-ui.test.tsx |
| Tapnij, by pokazać wszystkie. | components/LibScope.tsx | tests/catalog-library25.test.tsx |
| Tapnij, by spróbować ponownie. Zrób też backup. | app/(tabs)/index.tsx | tests/matrix-ui.test.tsx |
| Tapnij, by ukryć. | app/(tabs)/index.tsx | tests/interaction-patterns.test.tsx |
| Tapnij, by włączyć. | app/swap.tsx | tests/audit-0.10-lang-ui.test.tsx |
| Tapnij, by wybrać inne ćwiczenie. | app/(tabs)/progress.tsx | tests/m3-p3-postepy-historia.test.tsx |
| Tapnij, by zdjąć. | app/picker.tsx | tests/audit-0.10-lang-ui.test.tsx |
| Tapnij, by zmienić typ lub dodać notatkę. | app/history/edit/[id].tsx | tests/audit-0.10-lang-ui.test.tsx |
| Tapnij, by zmienić typ. | app/template/[id].tsx | tests/audit-0.10-lang-ui.test.tsx |
| Tapnij, by zmienić. | app/history/edit/[id].tsx | tests/audit-0.10-lang-ui.test.tsx |
| Tapnij, by zostawić podstawowe. | components/LibScope.tsx | tests/catalog-library25.test.tsx |
| te same mięśnie | lib/swap.ts | tests/matrix-ui.test.tsx |
| Tego ćwiczenia nie da się już zamienić. | app/swap.tsx | tests/adapt-ui.test.tsx, tests/interaction-guards.test.ts, tests/matrix-logic.test.tsx +1 |
| Tej sesji nie ma już w historii. | lib/edit.ts | tests/edit-history.test.tsx |
| tempo | app/exercises.tsx | tests/generator-ui.test.tsx, tests/i18n-wave2.test.ts, tests/matrix-data-shared.ts +3 |
| Ten miesiąc | app/progression.tsx | tests/audit-m1-032-total-bars.test.tsx, tests/period-bars.test.tsx, tests/set-split-ui.test.tsx |
| Ten okres | components/ProgressBars.tsx | tests/audit-m1-p3-coverage.test.tsx |
| Ten plan jeszcze nie obowiązuje. Zmień nazwę i dni, potem „Ustaw jako aktywny”. | app/plan.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/plans-multi-ui.test.tsx |
| ten sam ruch | lib/swap.ts | tests/swap-ui.test.tsx |
| Ten sam ruch, inny przyrząd | app/adapt.tsx | tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx, tests/swap-ui.test.tsx |
| Ten termin nachodzi na sesję „{name}” ({d}). | app/history/edit/[id].tsx | tests/backlog-0.10.1-dane-ui.test.tsx, tests/matrix-ui.test.tsx |
| Ten termin nachodzi na trening w toku (start {t}). Wybierz wcześniejszy. | lib/edit.ts | tests/matrix-ui.test.tsx |
| Ten trening nie zostanie zapisany. | app/history/edit/[id].tsx | tests/matrix-ui.test.tsx |
| Ten tydzień | app/progression.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-ui.test.tsx, tests/audit-m1-032-total-bars.test.tsx +20 |
| Ten tydzień = wykonane + plan. Plan bez ciężarów (≥) — bez porównania. Tydzień deloadu nie jest porównywany. | components/GuardSection.tsx | tests/guard-ui.test.tsx |
| Ten tydzień jest oznaczony jako deload (D na wykresach). Oznaczenie zmienisz w zakładce Plan: dzień → „Więcej opcji”. | components/PeriodSummary.tsx | tests/deload-week.test.tsx |
| Ten tydzień jest oznaczony jako deload. | app/progression.tsx | tests/progression-ui.test.tsx |
| Ten tydzień vs poprzedni | app/progression.tsx | tests/progression-ui.test.tsx, tests/tabs-four.test.tsx |
| Ten tydzień wobec poprzedniego: {list}. | lib/guard.ts | tests/guard-ui.test.tsx, tests/guard.test.ts, tests/progression-ui.test.tsx |
| Ten tydzień: deload. Przy starcie treningu zaproponuję {less}, ciężary bez zmian. | components/DeloadHint.tsx | tests/audit-0.10-live.test.tsx, tests/deload-ui.test.tsx |
| teraz | components/GuardSection.tsx | tests/architecture-limits.test.ts, tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-gen-ui.test.tsx +15 |
| tętno maks. {max} /min | lib/healthRead.ts | tests/health-read.test.ts |
| tętno maksymalne {n} na minutę | lib/healthRead.ts | tests/health-read.test.ts |
| tętno śr. {avg} /min | lib/healthRead.ts | tests/health-read-ui.test.tsx, tests/health-read.test.ts, tests/health-scenario.test.tsx |
| tętno śr. {avg} /min, maks. {max} /min | lib/healthRead.ts | tests/health-read-ui.test.tsx, tests/health-read.test.ts, tests/health-scenario.test.tsx |
| tętno średnie {avg} na minutę, maksymalne {max} | lib/healthRead.ts | tests/health-read-ui.test.tsx, tests/health-read.test.ts |
| tętno średnie {n} na minutę | lib/healthRead.ts | tests/health-read-ui.test.tsx, tests/health-read.test.ts |
| Timer odlicza w aplikacji, a na koniec przerwy przychodzi powiadomienie — także przy zablokowanym telefonie. | app/more/settings.tsx | tests/matrix-ui.test.tsx |
| To miejsce główne | app/more/locations.tsx | tests/audit-0.10-ui.test.tsx |
| To nie wygląda na backup z tej apki | app/more/backup.tsx | tests/scenario-full.test.tsx |
| To nie wygląda na obsługiwany plik CSV z historią treningów. Dane nie zostały zmienione. | app/more/import.tsx | tests/csv-import-ui.test.tsx |
| To ostatnia seria | components/SwipeRow.tsx | tests/audit-0.10-ui.test.tsx, tests/audit-m1-028-delete-menus.test.tsx |
| tonaż/sesję {sign} {now} (poprz. {prev}) | components/GuardSection.tsx | tests/guard-ui.test.tsx |
| trap bar | lib/swap.ts | tests/catalog-library25.test.tsx, tests/i18n-wave2.test.ts, tests/matrix-i18n.test.tsx +1 |
| Trening — opinia | lib/support.ts | tests/idea-request.test.tsx, tests/support-mail.test.tsx |
| Trening dopisywany wstecz: miejsce treningu wybierzesz w edytorze. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| Trening i serie | lib/guide.ts | tests/audit-0.10-ui.test.tsx, tests/guide.test.tsx |
| Trening rozpoczęty o {t}, bez odhaczonych serii. Kontynuować czy odrzucić? | lib/timer.ts | tests/matrix-ui.test.tsx, tests/timer-logic.test.ts |
| Trening rozpoczęty o {t}, bez odhaczonych serii. Otwórz, by kontynuować albo odrzucić. | lib/timer.ts | tests/backlog-0.10.1-dane.test.ts, tests/matrix-ui.test.tsx, tests/timer-logic.test.ts |
| Trening to część mojego tygodnia | app/paywall.tsx | tests/m5s1-bez-proby.test.ts, tests/subscription-i18n.test.ts, tests/subscription-ui.test.tsx |
| Trening to moje życie | app/paywall.tsx | tests/m5s1-bez-proby.test.ts, tests/subscription-i18n.test.ts, tests/subscription-ui.test.tsx |
| Trening w pauzie od {t}. | lib/timer.ts | tests/audit-0.10-live.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx, tests/backlog-0.10.1-dane.test.ts +1 |
| Trening w toku | app/template/[id].tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/guide.test.tsx +3 |
| Trening w toku też zostanie usunięty. | app/more/settings.tsx | tests/audit-0.10-ui.test.tsx |
| Trening w toku zapisuje się na bieżąco. Tapnij numer serii, by oznaczyć rozgrzewkę (W), drop set (D), serię do upadku (F) albo dodać notatkę. | lib/guide.ts | tests/guide.test.tsx |
| Trening wciąż trwa | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/audit-backlog-q.test.tsx, tests/audit-close-c.test.tsx +11 |
| Trening wstecz | app/_layout.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-tst.test.ts |
| Trening wstecz z datą tego dnia. | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Trening wstrzymany | lib/watch/labels.ts | tests/watch-protocol.test.ts |
| Trening z {d} {s} nie miał aktywności od 6 godzin, więc zapisał się sam. Koniec: {e} (ostatnia seria). Znajdziesz go w zakładce Plan. | app/_layout.tsx | tests/audit-0.10-ui.test.tsx, tests/matrix-ui.test.tsx |
| Trening z tego dnia zrobiony wcześniej — dzień wolny. | components/DayPanel.tsx | tests/plan-wczesniej-ui.test.tsx |
| Trening z Twojego planu tygodnia. Otwórz aplikację, by zacząć. | lib/planReminder.ts | tests/audit-k1-bl-mer.test.tsx, tests/mutation-bounds.test.ts, tests/plan-reminder.test.tsx |
| Trening zakończony | lib/watch/labels.ts | tests/watch-protocol.test.ts, tests/watch-scenarios.ts |
| Trening, którego nie zapisałeś na bieżąco. Ustaw termin i wybierz szablon — serie uzupełnisz w następnym kroku (wartości z ostatniego treningu przed tą datą). | app/history/add.tsx | tests/matrix-ui.test.tsx |
| Treningi | app/progression.tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-m1-016-paywall-benefit.test.tsx, tests/csv-import-ui.test.tsx +11 |
| Treningi do dodania: {n} | app/more/import.tsx | tests/csv-import-ui.test.tsx |
| Treningi i szablony z tym miejscem pokażą „(usunięte miejsce)”. | lib/deleteMessages.ts | tests/m3-p5-delete.test.tsx, tests/matrix-ui.test.tsx |
| Treningi nadal czekają na zapis w Apple Health. Sprawdź zgodę w aplikacji Zdrowie: profil → Aplikacje → {app}. | app/more/settings.tsx | tests/audit-0.10-data-ui.test.tsx |
| Treningi sprzed pierwszego pomiaru ({d}) — bez e1RM. | components/ExerciseProgress.tsx | tests/audit-0.10-data-ui.test.tsx |
| Trenuj {n} dni w miesiącu za darmo. Pro zdejmuje limit. Anulujesz w ustawieniach Apple ID, kiedy zechcesz. | app/paywall.tsx | tests/audit-m1-016-paywall-benefit.test.tsx, tests/subscription-i18n.test.ts, tests/subscription-ui.test.tsx |
| Trwa pomiar serii | lib/confirm.ts | tests/adapt-ui.test.tsx, tests/audit-0.10-live.test.tsx, tests/interaction-patterns.test.tsx +1 |
| Trwa trening z tego szablonu — zostanie bez zmian. | lib/plan.ts | tests/audit-0.10-plan.test.ts |
| Trwający trening w tym miejscu trwa dalej; miejsce pokaże się jako „(usunięte miejsce)”. | lib/deleteMessages.ts | tests/audit-0.10-ui.test.tsx, tests/m3-p5-delete.test.tsx |
| Twoja subskrypcja nadal się odnawia — anuluj ją, żeby nie płacić podwójnie. | app/paywall.tsx | tests/subscription-i18n.test.ts |
| Tydzień | components/PeriodSummary.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-plan-ui.test.tsx, tests/deload-ui.test.tsx +6 |
| tydzień deload | components/HistoryCalendar.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/deload-ui.test.tsx, tests/deload-week.test.tsx +1 |
| Tydzień deload | components/TodayPlan.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-plan-ui.test.tsx, tests/deload-ui.test.tsx +6 |
| Tydzień deloadu — bez porównania | components/GuardSection.tsx | tests/guard-ui.test.tsx, tests/guard.test.ts |
| Tygodnie od poniedziałku. Objętość = ciężar × powtórzenia × mnożnik ćwiczenia; rozgrzewka poza. | app/(tabs)/progress.tsx | tests/matrix-ui.test.tsx |
| Tygodnie treningu z rzędu bez deloadu: {n}. Deload zwykle co {a}–{b} tygodni — tak opisują praktykę trenerzy i zawodnicy w badaniach jednego zespołu (jedno źródło), nie wynik badań skuteczności. | components/DeloadHint.tsx | tests/deload-ui.test.tsx |
| Tygodnie z wykonanym planem: {done} z {n} | components/PeriodSummary.tsx | tests/motyw-miesiac.test.tsx |
| tyle samo | lib/guard.ts | tests/guard-ui.test.tsx, tests/guard.test.ts, tests/progression-ui.test.tsx |
| tylko dostępne w: {l} | app/picker.tsx | tests/integration-090.test.tsx, tests/locations-ui.test.tsx, tests/scenario-full.test.tsx |
| Tylko dziś | lib/locations.ts | tests/maestro-selectors.test.ts, tests/places-migrate.test.ts, tests/places-oneoff-logic.test.ts +1 |
| Tylko rozgrzewka | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx, tests/regress.test.tsx |
| Tył | components/Guard.tsx | tests/muscle-map.test.tsx |
| Uchwyt (jeden, {u}) | components/LoadEditor.tsx | tests/scenario-full.test.tsx |
| Ukryj cele partii | app/more/settings.tsx | tests/set-goals-ui.test.tsx, tests/set-goals.test.ts |
| ukryte: {n} | app/picker.tsx | tests/catalog-library25.test.tsx, tests/locations-ui.test.tsx, tests/scenario-full.test.tsx |
| Uproszczenie: drop set liczy się razem z serią, po której jest. | app/(tabs)/progress.tsx | tests/audit-0.10-stats-ui.test.tsx, tests/sets-mark.test.tsx |
| Uproszczenie: partia pomocnicza ćwiczenia liczy się za pół serii (główna 1, pomocnicza 0,5; metaanaliza Pelland i in. 2026). | app/(tabs)/progress.tsx | tests/set-goals-ui.test.tsx, tests/set-goals.test.ts, tests/sets-mark.test.tsx +1 |
| Uproszczenie: zwykle dzień przerwy między sesjami z tymi samymi głównymi partiami; dwa dni pod rząd przy tej samej liczbie serii w tygodniu też są w porządku (przeglądy badań, ACSM). | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Uproszczenie: zwykle dzień przerwy między sesjami z tymi samymi głównymi partiami. | components/DayPanel.tsx | tests/plan-calendar-ui.test.tsx |
| Ustaw plan | app/(tabs)/index.tsx | tests/audit-0.10-ui.test.tsx, tests/dashboard.test.tsx, tests/guide.test.tsx +5 |
| Ustaw plan tygodnia — zobaczysz tu dzisiejszy trening i dostaniesz przypomnienie. | components/Dashboard.tsx | tests/dashboard.test.tsx |
| Ustawić „{name}” jako aktywny plan? | app/plan.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-tst-ui.test.tsx +3 |
| Ustawić nowy plan jako aktywny? | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/generator-ui.test.tsx, tests/m3-p4-generator.test.tsx +3 |
| Ustawienia na stronę: {n} ({r}) | components/LoadEditor.tsx | tests/locations-ui.test.tsx |
| Ustawienie | components/ExerciseCues.tsx | tests/audit-k1-bl-mer.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/cues-014.test.tsx +2 |
| Ustawienie, ruch, wskazówki i częste błędy. | components/ExerciseCues.tsx | tests/audit-k1-bl-mer.test.tsx, tests/cues.test.tsx |
| Usunąć odznaczone ciężary? | components/LoadEditor.tsx | tests/audit-0.10-ui.test.tsx, tests/scenario-full.test.tsx |
| Usunie ćwiczenia, szablony i całą historię oraz przywróci ustawienia domyślne (także miejsca, sprzęt i gumy). Przedtem obecne dane zapiszą się jako kopia w Plikach: {app} → Backup (można ją zaimportować). | app/more/settings.tsx | tests/matrix-ui.test.tsx |
| usunięte | app/(tabs)/progress.tsx | tests/audit-0.10-ui.test.tsx, tests/integration-090.test.tsx, tests/locations-model.test.ts +10 |
| Usunięte ćwiczenie | app/adapt.tsx | tests/matrix-logic.test.tsx, tests/swap-ui.test.tsx |
| usunięte ćwiczenie (w bieżącym treningu) | app/exercises.tsx | tests/matrix-logic.test.tsx, tests/regress.test.tsx |
| usunięte ćwiczenie z historią | app/exercises.tsx | tests/matrix-logic.test.tsx, tests/regress.test.tsx, tests/scenario-full.test.tsx |
| Usunięte: {list}. | lib/tplsync.ts | tests/audit-0.10-ui.test.tsx |
| usunięty szablon | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/matrix-invariants.test.ts |
| Usuń talerz | components/LoadEditor.tsx | tests/scenario-full.test.tsx, tests/swipe-delete.test.tsx |
| Utwórz pierwszy szablon albo wygeneruj szablony i plan. | components/Dashboard.tsx | tests/dashboard.test.tsx, tests/edit-on-demand.test.tsx, tests/flows.test.tsx +3 |
| Uwaga: {a} i {b} dzień po dniu — te same główne partie. | components/DayPanel.tsx | tests/plan-calendar-ui.test.tsx |
| Uwaga: zmiana sprzętu, trybu liczenia lub metryki przelicza też dawne treningi (objętość, rekordy, wykresy). | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| Użyj | app/place-once.tsx | tests/maestro-selectors.test.ts, tests/places-ui.test.tsx |
| W „Inne plany” jest już {n} planów — usuń któryś, by dodać nowy. | app/generator.tsx | tests/audit-0.10-plan-ui.test.tsx |
| W „Inne plany” jest już {n} planów — usuń któryś, by wyłączyć obecny. | app/plan.tsx | tests/plan-wczesniej-ui.test.tsx |
| w archiwum | app/template/[id].tsx | tests/audit-m1-workflows.test.ts, tests/edit-on-demand.test.tsx, tests/public-repo.test.ts |
| W historii serie z tą gumą pokażą „?”. | lib/deleteMessages.ts | tests/m3-p5-delete.test.tsx, tests/matrix-ui.test.tsx |
| W jakiej sytuacji na treningu: | lib/support.ts | tests/idea-request.test.tsx |
| W oknie zmienisz zamiennik albo wybierzesz „Bez zmian” lub „Pomiń dziś”; zastosowaną zamianę cofniesz przy ćwiczeniu. | lib/whatsnew.ts | tests/release-0.18.test.tsx, tests/whats-new.test.tsx |
| w planie na: {day} · {n} ćw. | components/StartPanel.tsx | tests/home-b.test.tsx |
| W planie tygodnia: {days} — te dni będą wolne. | lib/plan.ts | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts |
| W Postępach oznaczony tydzień widać jako litera D na wykresach — tam się go nie zmienia. | lib/guide.ts | tests/guide.test.tsx |
| W słuchawkach | lib/voice.ts | tests/matrix-i18n.test.tsx, tests/voice-ui.test.tsx, tests/voice.test.ts |
| W tej wersji | components/WhatsNew.tsx | tests/whats-new.test.tsx |
| W trakcie | lib/figures/index.ts | tests/figures.test.tsx |
| W trwającym treningu guma zniknie z nieodhaczonych serii. | lib/deleteMessages.ts | tests/m3-p5-delete.test.tsx, tests/matrix-ui.test.tsx |
| W trwającym treningu zostanie oznaczone jako usunięte. | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| W tygodniu deload „Start” i „Powtórz ostatni” zaproponują „Mniej serii”: {less}; ciężary i szablon bez zmian. | lib/guide.ts | tests/guide.test.tsx |
| W tym miesiącu ciężko trenujesz i wykorzystujesz wszystkie darmowe dni treningowe ({n}). Dobra robota! | app/paywall.tsx | tests/subscription-i18n.test.ts, tests/subscription-ui.test.tsx |
| w tym tygodniu | lib/healthRead.ts | tests/audit-0.10-plan-ui.test.tsx, tests/guard-ui.test.tsx, tests/health-read-ui.test.tsx +2 |
| W zakładce Plan stuknij sesję, potem „Edytuj” — zmiany zapisuje „Zapisz”, „Anuluj” je odrzuca. | lib/guide.ts | tests/guide.test.tsx |
| W zakładce Plan: stuknij dzień, potem „Więcej opcji” → „Oznacz tydzień jako deload” — także przyszły tydzień. | lib/guide.ts | tests/guide.test.tsx |
| W zapisanych planach: {names}. | lib/plan.ts | tests/audit-0.10-plan.test.ts |
| wcześniej | components/GuardSection.tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-stats-ui.test.tsx, tests/edit-history.test.tsx +9 |
| wcześniej zamieniane | lib/swap.ts | tests/swap-top3.test.ts |
| Wersja testowa {n} · {date} | components/WhatsNew.tsx | tests/release-0.12.test.tsx, tests/whats-new.test.tsx |
| Wersja: {v} · iOS {os} · Język: {lang} | lib/support.ts | tests/idea-request.test.tsx, tests/support-mail.test.tsx |
| Wiersz otwiera podgląd szablonu, „Start” zaczyna trening. | app/pick-template.tsx | tests/pick-template.test.tsx |
| Wiersz w ramce — tydzień deload. | components/HistoryCalendar.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/deload-ui.test.tsx |
| więcej | components/MuscleMap.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit-0.10-live-logic.test.ts +25 |
| Więcej | app/(tabs)/_layout.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx, tests/audit-k1-fala2b.test.tsx +35 |
| Więcej → Kopia zapasowa: eksport wszystkich danych do pliku i import z pliku. | lib/guide.ts | tests/guide.test.tsx |
| Więcej → Miejsca i sprzęt: dom, siłownia, hotel — każdy ze swoim sprzętem i ciężarami. | lib/guide.ts | tests/guide.test.tsx |
| Więcej → Szablony: przycisk + w nagłówku (Dodaj szablon) tworzy szablon: ćwiczenia, serie, zakres powtórzeń i przerwy. | lib/guide.ts | tests/guide.test.tsx |
| Więcej → Ustawienia: „Dźwięk na koniec przerwy” i „Wibracje” włączasz osobno. | lib/guide.ts | tests/m3-p5d-settings-ui.test.tsx |
| Więcej dni niż szablonów: szablony po kolei (A, B, A…), jak w generatorze — konwencja. | components/OwnPlan.tsx | tests/plan-own-templates-ui.test.tsx |
| więcej niż poprzednio | components/ProgressBars.tsx | tests/progression-ui.test.tsx |
| Włącz powiadomienia dla {app} w Ustawieniach iOS. | app/more/settings.tsx | tests/matrix-ui.test.tsx |
| Wobec tygodnia {d} (poprzedni był deloadem) | lib/guard.ts | tests/guard-ui.test.tsx, tests/guard.test.ts |
| wolne | components/TodayPlan.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts, tests/guide.test.tsx +5 |
| Wolne w tym dniu | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/plan-calendar-ui.test.tsx |
| wpisane wartości zamiennika przepadną | app/adapt.tsx | tests/adapt-ui.test.tsx |
| Wpisane wartości zamiennika przepadną. | app/adapt.tsx | tests/adapt-ui.test.tsx, tests/matrix-ui.test.tsx |
| Wpisz {co}, żeby zapisać serię. | components/NowBoard.tsx | tests/m3-p2-board-ui.test.tsx, tests/m3-p2-matrix.test.tsx |
| Wpisz liczbę sekund od 0 do {n}. | components/WorkoutBlocks.tsx | tests/audit-0.10-ui.test.tsx |
| Wpisz masę ciała. | app/more/bodymass.tsx | tests/audit-0.10-data-ui.test.tsx |
| wpisz uchwyt i talerze | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| wpisz zakres na stronę i krok | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| wraca do ćwiczenia z planu | app/adapt.tsx | tests/adapt-ui.test.tsx |
| Wraca z planu | app/adapt.tsx | tests/adapt-ui.test.tsx, tests/maestro-selectors.test.ts, tests/matrix-invariants.test.ts |
| Wrócą zmiany pojedynczych dni zapisane z tym planem: {n}. | lib/plan.ts | tests/audit-0.10-gen.test.ts, tests/audit-0.10-plan.test.ts |
| Wróć do treningu | app/template/[id].tsx | tests/edit-on-demand.test.tsx |
| Wskazówki | components/ExerciseCues.tsx | tests/audit-k1-bl-mer.test.tsx, tests/cues-014.test.tsx, tests/cues.test.tsx |
| Wstaw ciężary modelu | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Wszystkie ćwiczenia są dostępne w: {l} | app/adapt.tsx | tests/adapt-ui.test.tsx |
| wszystkie ćwiczenia, także niszowe | components/LibScope.tsx | tests/catalog-library25.test.tsx |
| Wszystkie serie odhaczone | components/NowBoard.tsx | tests/audit-0.10-live.test.tsx, tests/m3-p2-board-ui.test.tsx, tests/skip-today.test.tsx +1 |
| Wszystkie trenowane partie są na celu (bez planu tygodnia). | lib/guard.ts | tests/guard.test.ts |
| Wybierz co najmniej jeden szablon. | components/OwnPlan.tsx | tests/audit-k1-bl-mer.test.tsx, tests/plan-own-templates-ui.test.tsx |
| Wybierz ćwiczenie | app/_layout.tsx | tests/matrix-ui.test.tsx |
| Wybierz dni treningowe: {n}. | components/DayPicker.tsx | tests/gen-days-ui.test.tsx, tests/plan-own-templates-ui.test.tsx |
| Wybierz dni treningowe: od {a} do {b}. | components/DayPicker.tsx | tests/gen-days-ui.test.tsx, tests/plan-own-templates-ui.test.tsx |
| Wybierz szablon | app/_layout.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/flows.test.tsx, tests/pick-template.test.tsx |
| Wybierz szablon na ten dzień. | app/plan.tsx | tests/audit-0.10-plan-ui.test.tsx |
| wybrane ręcznie | app/adapt.tsx | tests/adapt-ui.test.tsx |
| wyciąg | lib/swap.ts | tests/audit-0.10-gen-ui.test.tsx, tests/locations-audit.test.tsx, tests/scenario-full.test.tsx |
| Wyczyścić wszystkie dane? | app/more/settings.tsx | tests/audit-0.10-ui.test.tsx, tests/audit-io-more.test.tsx, tests/audit-r83.test.tsx +5 |
| Wyczyść miejsce: {a} – {b} | components/DayPanel.tsx | tests/m3-fix-e2e-teksty.test.ts, tests/places-ui.test.tsx |
| Wygenerowane | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx, tests/generator-ui.test.tsx, tests/generator.test.ts +6 |
| wykonane | components/Dashboard.tsx | tests/guard-ui.test.tsx, tests/guide.test.tsx, tests/progression-ui.test.tsx |
| wykonane + zaplanowane | components/Dashboard.tsx | tests/guide.test.tsx, tests/progression-ui.test.tsx |
| Wykonane: {text} | components/GuardSection.tsx | tests/guard-ui.test.tsx, tests/set-split-ui.test.tsx |
| Wykres, {n} {s}: od {a} ({x}) do {b} ({y}), najlepiej {c} ({z}). | components/Chart.tsx | tests/matrix-ui.test.tsx |
| Wykresy ćwiczeń i rekordy; rekord w trakcie treningu widać przy serii. | lib/guide.ts | tests/guide.test.tsx |
| Wykresy pojawią się po pierwszym zakończonym treningu. | app/(tabs)/progress.tsx | tests/guide.test.tsx, tests/m3-p3-postepy-historia.test.tsx, tests/matrix-dim-langs1.test.tsx +6 |
| Wyłącz plan: {name} | app/plan.tsx | tests/plan-wczesniej-ui.test.tsx |
| Wyłączone | lib/voice.ts | tests/matrix-i18n.test.tsx, tests/voice-ui.test.tsx, tests/voice.test.ts |
| Wyłączyć plan? | app/plan.tsx | tests/plan-wczesniej-ui.test.tsx |
| Wypada treningów: {n} | components/DayPanel.tsx | tests/plan-calendar-ui.test.tsx, tests/plan-calendar.test.ts |
| Wypełnij zakresem | components/LoadEditor.tsx | tests/audit-0.10-ui.test.tsx, tests/audit-r82c.test.tsx, tests/locations-audit.test.tsx +3 |
| Wysiłek: do chwili, gdy kolejne powtórzenie byłoby trudne — zmęczenie, ale nie wyczerpanie (WHO 2020: co najmniej umiarkowany; wytyczne USA 2018; ACSM 2011). Do upadku nie trzeba. | app/generator.tsx | tests/gen-general-ui.test.tsx, tests/matrix-i18n.test.tsx |
| Wysiłek: do chwili, gdy kolejne powtórzenie byłoby trudne; do upadku nie trzeba. | lib/generator.ts | tests/gen-general-ui.test.tsx, tests/gen-general.test.ts |
| Wysiłek: zwykle {a}–{b} powtórzenia w zapasie (ACSM 2026: blisko upadku albo {c}–{d}; dokładnej liczby nie ustalono); do upadku nie trzeba. | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx |
| Wysiłek: zwykle {a}–{b} powtórzenia w zapasie (RIR); do upadku nie trzeba. | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit-0.10-ui.test.tsx +1 |
| Wyszukiwanie ćwiczeń także po dawnej nazwie. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| wyszukiwanie obejmuje też niszowe | components/LibScope.tsx | tests/catalog-library25.test.tsx |
| Wyślij dane | app/_layout.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-m1-003-boundary.test.tsx, tests/audit-m1-003-guard-ui.test.tsx +2 |
| Wyświetlane jako: {n} | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| Wznów animację | components/ExerciseFigure.tsx | tests/figures.test.tsx, tests/maestro-selectors.test.ts |
| Wznów trening | components/ActiveWorkout.tsx | tests/m3-p2-board-ui.test.tsx, tests/pause.test.tsx |
| z {s} | components/BoardFace.tsx | (tylko parametry) |
| Z planem wszystkie trenowane partie dojdą do celu. | lib/guard.ts | tests/guard.test.ts |
| Z zegarka | lib/healthRead.ts | tests/health-read-ui.test.tsx, tests/health-read.test.ts, tests/watch-fill-ui.test.tsx |
| Z zegarka oznaczono serie jako zrobione inaczej niż w planie: {n}. Uzupełnij powtórzenia i ciężar — rekord liczy się dopiero po uzupełnieniu. | components/ActiveWorkout.tsx | tests/watch-fill-ui.test.tsx |
| Za dużo ciężarów (najwyżej {n}). | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Za dużo kombinacji talerzy — ciężary nie są liczone. Usuń nietypowe talerze. | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Za dużo rodzajów talerzy (najwyżej {n}). | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Za dużo ustawień (najwyżej {n}) — zwiększ krok. | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Za dużo zapisanych planów | app/generator.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/plan-own-templates-ui.test.tsx |
| Zacząć z mniejszą liczbą serii: {a} zamiast {b} serii roboczych? Ciężary bez zmian, szablon się nie zmienia. | lib/start.ts | tests/audit-0.10-live.test.tsx, tests/deload-ui.test.tsx |
| Zacznij trening na telefonie | lib/watch/labels.ts | tests/watch-protocol.test.ts |
| Zaczynasz od tej wersji — poniżej zmiany dla osób, które korzystały z poprzednich. Na start przyda się przewodnik. | components/WhatsNew.tsx | tests/audit-0.10-ui.test.tsx |
| Zaimportowano | app/more/backup.tsx | tests/audit-m1-006-import-ui.test.tsx, tests/csv-import-ui.test.tsx, tests/scenario-full.test.tsx |
| zakładka, {i} z {n} | app/(tabs)/_layout.tsx | tests/matrix-a11y.test.tsx, tests/motyw.test.tsx, tests/regress.test.tsx +3 |
| Zakończyć trening? | components/ActiveWorkout.tsx | tests/adapt-scenario.test.tsx, tests/audit-0.10-live.test.tsx, tests/audit-0.10-tst-ui.test.tsx +27 |
| zakres | app/template/[id].tsx | tests/architecture-limits.test.ts, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-tst-ui.test.tsx +17 |
| Zakres dat: {a} – {b} | app/more/import.tsx | tests/csv-import-ui.test.tsx |
| Zakres jest niepoprawny: „do” musi być ≥ „od”, krok > 0, wartości od {a} do {b}. | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Zakres jest niepoprawny: „max” musi być ≥ „min”, krok > 0. Ciężary nie są liczone. | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Zakres powtórzeń: {r} — gdy ostatnio wszystkie serie robocze miały co najmniej {n} powt., przy ćwiczeniu pojawi się podpowiedź „↑ spróbuj …”: większy ciężar albo powtórzenie więcej (poza tygodniem deload). | app/template/[id].tsx | tests/audit-0.10-stats-ui.test.tsx, tests/matrix-ui.test.tsx |
| Zakresy powtórzeń (masa {a}–{b}, w domu i bez obciążenia {c}–{d}; przy sile dodatkowe {e}–{f}) to uproszczenie: mięśnie rosną przy szerokim zakresie ciężarów, gdy serie są blisko upadku (ACSM, przeglądy badań). | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx |
| Zaktualizuj aplikację na zegarku | lib/watch/labels.ts | tests/watch-protocol.test.ts |
| Zakupy są przypisane do konta Apple. Treningi przywrócisz z kopii zapasowej. | app/paywall.tsx | tests/subscription-i18n.test.ts, tests/subscription-ui.test.tsx |
| Zamiana tylko w tym treningu: {name} | app/swap.tsx | tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx |
| Zamiany tylko w tym treningu — szablon i plan bez zmian. | app/adapt.tsx | tests/adapt-ui.test.tsx, tests/maestro-selectors.test.ts |
| zamiast: {name} | app/swap.tsx | tests/adapt-scenario.test.tsx, tests/adapt-ui.test.tsx, tests/matrix-logic.test.tsx +2 |
| Zamieniono {n} {w} | app/adapt.tsx | tests/adapt-ui.test.tsx |
| zamiennik z szablonu dla tego miejsca | app/adapt.tsx | tests/adapt-ui.test.tsx |
| Zamienniki | app/template/[id].tsx | tests/matrix-ui.test.tsx |
| Zamień ćwiczenie | app/_layout.tsx | tests/audit-0.10-live.test.tsx, tests/backlog-0410.test.tsx, tests/catalog-full.test.tsx +5 |
| Zamień z {day} ({name}) | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/plan-calendar-ui.test.tsx |
| Zapamiętać dla tego ćwiczenia? | components/WorkoutBlocks.tsx | tests/scenario-full.test.tsx |
| Zapisać zmiany? | app/history/edit/[id].tsx | tests/backlog-0.10.1-dane-ui.test.tsx, tests/edit-history.test.tsx, tests/integration-090.test.tsx +2 |
| Zapisane zostaną serie robocze: {n}. | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx, tests/regress.test.tsx +1 |
| Zapisano | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/generator-ui.test.tsx, tests/interaction-patterns.test.tsx +5 |
| Zapisany czas zostanie nadpisany. | components/WorkoutBlocks.tsx | tests/matrix-ui.test.tsx |
| Zapisuje zamiennik w szablonie dla tego miejsca. | components/WorkoutBlocks.tsx | tests/matrix-ui.test.tsx |
| Zapisz ćwiczenie | app/exercise/[id].tsx | tests/app.tsx, tests/edit-on-demand.test.tsx |
| Zapisz sesję | app/history/edit/[id].tsx | tests/edit-history.test.tsx, tests/scenario-full.test.tsx |
| Zapisz szablon | app/template/[id].tsx | tests/app.tsx, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx +16 |
| zaplanowane | components/GuardSection.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/audit-m1-p4b-queue.test.ts +8 |
| Zaplanowane = szablony z planu na pozostałe dni tygodnia, policzone z wartości w szablonie (brakujące — z „Poprzednio”). To rachunek z Twojego planu, nie prognoza. Partia główna liczy 1 serię, pomocnicza 0,5. | app/progression.tsx | tests/progression-ui.test.tsx |
| Zaplanowane: {text} ({days}) | components/GuardSection.tsx | tests/guard-ui.test.tsx |
| Zaplanowany też na: {days} — te dni będą wolne. | lib/plan.ts | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts |
| zaplanowany: {name} | components/HistoryCalendar.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/motyw.test.tsx, tests/plan-calendar-ui.test.tsx |
| Zaplanowany: {name} | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/plan-calendar-ui.test.tsx, tests/plan-own-templates-ui.test.tsx +1 |
| Zapowiedzi działają, gdy włączony jest „Dźwięk na koniec przerwy”. To samo ustawienie zmienisz w menu „⋯” na ekranie treningu. | app/more/settings.tsx | tests/m3-p5d-settings-ui.test.tsx, tests/voice-ui.test.tsx |
| Zapowiedzi głosowe na początku przerwy: ćwiczenie, ciężar i powtórzenia. | lib/whatsnew.ts | tests/release-0.20.test.tsx, tests/whats-new.test.tsx |
| Zapowiedzi głosowe: {mode} | components/ActiveWorkout.tsx | tests/m3-p2-board-ui.test.tsx, tests/voice-ui.test.tsx |
| Zastąpić poprzednio wygenerowane, nieużywane szablony? | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/ux2-08-gen-replace-active.test.tsx |
| Zastąpić wpisane ciężary? | components/LoadEditor.tsx | tests/locations-audit.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Zastosuj ({n}) | app/adapt.tsx | tests/adapt-scenario.test.tsx, tests/adapt-ui.test.tsx, tests/maestro-selectors.test.ts +2 |
| Zatrzymaj animację | components/ExerciseFigure.tsx | tests/figures.test.tsx, tests/maestro-selectors.test.ts |
| Zaznaczone partie, w których objętość jest większa niż w okresie porównawczym; im mocniejszy kolor, tym większy wzrost. Szare — bez wzrostu. | app/progression.tsx | tests/audit-m1-025-muscle-caption.test.tsx, tests/progression-ui.test.tsx |
| Zegar treningu stoi i pauza nie wlicza się do czasu trwania. Przerwa między seriami liczy dalej; odhaczenie serii wznawia trening. | components/ActiveWorkout.tsx | tests/matrix-i18n.test.tsx, tests/pause.test.tsx |
| Zegarek odczytuje tętno i energię aktywną z trwającego treningu. Dane nie są wysyłane poza Twoje urządzenia. | lib/watchLabels.ts | tests/watch-apple-i18n.test.ts |
| Zegarek zapisuje zakończony trening siłowy, z tętnem i energią aktywną, w Apple Health. | lib/watchLabels.ts | tests/watch-apple-i18n.test.ts |
| zębaty przedni | app/exercise/[id].tsx | tests/audit-0.10-ui.test.tsx |
| zginacze biodra | app/exercise/[id].tsx | tests/audit-0.10-ui.test.tsx |
| Zgodę cofniesz w aplikacji Zdrowie: profil → Aplikacje → {app}. | app/more/settings.tsx | tests/health-read-ui.test.tsx |
| Zgody na powiadomienia jeszcze nie ma — „Sprawdź zgodę na powiadomienia” poprosi o nią. | app/more/settings.tsx | tests/audit-0.10-plan-ui.test.tsx |
| zmiana planu | components/DayPanel.tsx | tests/plan-calendar-ui.test.tsx, tests/plan-own-templates-ui.test.tsx |
| zmiany dni: {n} | app/plan.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/matrix-invariants.test.ts |
| Zmiany nie trafiają do Apple Health. | app/history/edit/[id].tsx | tests/edit-history.test.tsx |
| Zmiany pojedynczych dni zapisane z tym planem: {n} — wrócą po aktywacji. | app/plan.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Zmiany sięgają dalej niż {n} dni. | components/DayPanel.tsx | tests/plan-calendar-ui.test.tsx |
| Zmiany w trakcie treningu | lib/guide.ts | tests/guide.test.tsx |
| Zmienione dni: {n} | components/DayPanel.tsx | tests/plan-calendar-ui.test.tsx |
| Zmień dopasowanie | app/more/import.tsx | tests/csv-import-ui.test.tsx |
| Zmień szablon | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/plan-calendar-ui.test.tsx, tests/plan-new-template-day.test.tsx +1 |
| Zmierzyć serię od nowa? | components/WorkoutBlocks.tsx | tests/audit-close-b.test.tsx, tests/audit-close2-c.test.tsx, tests/audit-final-timer.test.tsx +4 |
| Zniknie z list i szablonów; historia, wykresy i eksport zostaną. | app/exercise/[id].tsx | tests/audit-0.10-data-ui.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Zniknie z list i szablonów. | app/exercise/[id].tsx | tests/scenario-full.test.tsx |
| zostaje to ćwiczenie | app/swap.tsx | tests/adapt-ui.test.tsx |
| zrobione | components/Dashboard.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/dashboard.test.tsx, tests/first-steps-empty.test.tsx +13 |
| Zrobione inaczej | lib/watch/labels.ts | tests/watch-protocol.test.ts, tests/watch-scenarios.ts |
| zrobione: {name} | components/TodayPlan.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/motyw.test.tsx, tests/plan-calendar-ui.test.tsx |
| Zrobione: {name} | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx |
| zrobiony inny trening | components/HistoryCalendar.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/motyw.test.tsx |
| zrobiony inny trening: {name} | components/TodayPlan.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/motyw.test.tsx |
| Zrobiony inny trening: {name} | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx |
| zrobiony wcześniej: {name} | components/HistoryCalendar.tsx | tests/plan-wczesniej-ui.test.tsx |
| Zrobiony wcześniej: {name} | components/DayPanel.tsx | tests/plan-wczesniej-ui.test.tsx |
| Zwiń inne ćwiczenia | app/swap.tsx | tests/catalog-full.test.tsx, tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| Zwykle w: {l} — {name}. Zamienić? | components/WorkoutBlocks.tsx | tests/scenario-full.test.tsx, tests/swap-alternates.test.tsx |
| Żadna partia nie ma większej objętości niż poprzednio. | app/progression.tsx | tests/progression-ui.test.tsx |

## LOGIKA

| Pozycja | Źródło | Testy (pierwsze 3) |
|---|---|---|
| a11yPrefs.a11yPrefs | lib/a11yPrefs.ts | tests/audit-m1-024-bold.test.tsx, tests/audit-m1-p3-coverage.test.tsx |
| a11yPrefs.setA11yPrefs | lib/a11yPrefs.ts | tests/audit-m1-024-bold.test.tsx, tests/audit-m1-031-contrast.test.tsx, tests/audit-m1-p3-coverage.test.tsx +4 |
| a11yPrefs.boldTextOn | lib/a11yPrefs.ts | tests/audit-m1-p3-coverage.test.tsx |
| a11yPrefs.useA11yPrefs | lib/a11yPrefs.ts | tests/audit-m1-p3-coverage.test.tsx |
| a11yPrefs.initA11yPrefs | lib/a11yPrefs.ts | tests/audit-m1-024-bold.test.tsx |
| a11yPrefs.__resetA11yPrefsForTests | lib/a11yPrefs.ts | tests/audit-m1-024-bold.test.tsx, tests/audit-m1-031-contrast.test.tsx, tests/audit-m1-p3-coverage.test.tsx +4 |
| access.entitlementEnd | lib/access.ts | tests/access.test.ts, tests/subscription-invariants.test.ts |
| access.entitlementActive | lib/access.ts | tests/access.test.ts, tests/audit-m1-012-status.test.ts, tests/store-adapter.test.ts |
| access.access | lib/access.ts | tests/access.test.ts, tests/entitlement.test.ts, tests/m5s1-dni-zapis.test.ts +1 |
| access.effectiveAccess | lib/access.ts | tests/access.test.ts |
| access.freeSince | lib/access.ts | tests/access.test.ts |
| access.monthKey | lib/access.ts | tests/access.test.ts |
| access.nextMonthStart | lib/access.ts | tests/access.test.ts, tests/m5s1-dni-treningowe.test.ts |
| access.dayKey | lib/access.ts | tests/access.test.ts, tests/audit-m1-065-week-start.test.tsx, tests/history-calendar.test.tsx |
| access.freeUsed | lib/access.ts | tests/access.test.ts, tests/m5s1-dni-treningowe.test.ts |
| access.qualifiesForDay | lib/access.ts | tests/m5s1-dni-zapis.test.ts |
| access.recordLiveDay | lib/access.ts | tests/m5s1-dni-zapis.test.ts |
| access.canStartLive | lib/access.ts | tests/access.test.ts, tests/m5s1-dni-treningowe.test.ts |
| access.isAlwaysAvailable | lib/access.ts | tests/access.test.ts |
| adapt.restoreCandidates | lib/adapt.ts | tests/adapt-logic.test.ts, tests/matrix-invariants.test.ts |
| adapt.adaptCandidates | lib/adapt.ts | tests/adapt-logic.test.ts, tests/matrix-invariants.test.ts, tests/places-oneoff-logic.test.ts +1 |
| adaptPick.onAdaptPick | lib/adaptPick.ts | tests/adapt-pick.test.ts |
| adaptPick.emitAdaptPick | lib/adaptPick.ts | tests/adapt-pick.test.ts |
| adaptPick.armAutoAdapt | lib/adaptPick.ts | tests/plan-places.test.ts |
| adaptPick.takeAutoAdapt | lib/adaptPick.ts | tests/plan-places.test.ts |
| announce.announce | lib/announce.ts | tests/interaction-patterns.test.tsx, tests/voice.test.ts |
| announce.useAnnounce | lib/announce.ts | tests/interaction-patterns.test.tsx |
| backup.buildBackup | lib/backup.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/audit-0.10-live-logic.test.ts +41 |
| backup.cleanShareLeftovers | lib/backup.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-m1-041-reminder-files.test.tsx |
| backup.exportBackup | lib/backup.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-m1-041-reminder-files.test.tsx, tests/matrix-logic.test.tsx |
| backup.autoBackup | lib/backup.ts | tests/audit-backlog-r75.test.tsx, tests/audit-m1-008-kopia-ui.test.tsx, tests/audit-m1-041-reminder-files.test.tsx +10 |
| backup.safetyBackup | lib/backup.ts | tests/audit-m1-041-reminder-files.test.tsx, tests/audit-r83b.test.tsx, tests/matrix-logic.test.tsx |
| backup.safetyRecoveryNote | lib/backup.ts | tests/matrix-logic.test.tsx |
| backup.isSafetyError | lib/backup.ts | tests/matrix-logic.test.tsx |
| backup.persistFailure | lib/backup.ts | tests/audit-m1-006-import.test.ts |
| backup.isPersistError | lib/backup.ts | tests/audit-m1-006-import.test.ts |
| backup.onWorkoutSaved | lib/backup.ts | tests/audit-0.10-data.test.ts |
| backup.onHistoryEdited | lib/backup.ts | tests/matrix-logic.test.tsx |
| backup.strongDur | lib/backup.ts | tests/audit-0.10-stats.test.ts |
| backup.buildCsv | lib/backup.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-stats.test.ts, tests/audit-backlog-q.test.tsx +24 |
| backup.exportCsv | lib/backup.ts | tests/access.test.ts, tests/audit-0.10-data-ui.test.tsx, tests/audit-backlog-q.test.tsx +2 |
| backup.parseBackup | lib/backup.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/audit-0.10-live-logic.test.ts +41 |
| backup.recheckHealthAfterImport | lib/backup.ts | tests/audit-io-flows.test.tsx |
| backup.importBackup | lib/backup.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-journey-c.test.tsx, tests/audit-m1-006-import.test.ts +2 |
| backup.exportRawData | lib/backup.ts | tests/audit-0.10-plan.test.ts |
| backup.exportLatestCopy | lib/backup.ts | tests/audit-m1-004-start-error.test.tsx |
| backup.exportStartData | lib/backup.ts | tests/audit-m1-004-start-error.test.tsx |
| backup.exportRecovery | lib/backup.ts | tests/matrix-logic.test.tsx |
| board.boardKeys | lib/board.ts | tests/m3-p2-board-logic.test.ts |
| board.effectiveValues | lib/board.ts | tests/m3-p2-board-logic.test.ts |
| board.missingKey | lib/board.ts | tests/m3-p2-board-logic.test.ts |
| board.stepOf | lib/board.ts | tests/m3-p2-board-logic.test.ts |
| board.fieldLayout | lib/board.ts | tests/m3-p2-board-logic.test.ts |
| board.compactResult | lib/board.ts | tests/m3-p2-board-logic.test.ts |
| board.boardDigitChars | lib/board.ts | tests/m3-fix-e2e.test.tsx |
| brandIcon.iconColors | lib/brandIcon.ts | tests/intro.test.tsx, tests/m3-system.test.tsx |
| calendar.dayKey | lib/calendar.ts | tests/access.test.ts, tests/audit-m1-065-week-start.test.tsx, tests/history-calendar.test.tsx |
| calendar.regionWeekStart | lib/calendar.ts | tests/audit-m1-065-week-start.test.tsx |
| calendar.monthGrid | lib/calendar.ts | tests/audit-m1-065-week-start.test.tsx, tests/history-calendar.test.tsx |
| calendar.workoutsByDay | lib/calendar.ts | tests/history-calendar.test.tsx |
| calendar.shiftMonth | lib/calendar.ts | tests/history-calendar.test.tsx |
| calendar.weekdayLabels | lib/calendar.ts | tests/audit-m1-065-week-start.test.tsx, tests/gen-days.test.ts, tests/history-calendar.test.tsx |
| calendar.weekdayNames | lib/calendar.ts | tests/gen-days.test.ts |
| calendar.monthTitle | lib/calendar.ts | tests/history-calendar.test.tsx |
| calendar.dayTitle | lib/calendar.ts | tests/history-calendar.test.tsx |
| confirm.cancelButton | lib/confirm.ts | tests/interaction-patterns.test.tsx |
| confirm.backToEditButton | lib/confirm.ts | tests/interaction-patterns.test.tsx |
| confirm.okButton | lib/confirm.ts | tests/interaction-patterns.test.tsx |
| confirm.confirm | lib/confirm.ts | tests/interaction-patterns.test.tsx |
| confirm.confirmSkipTimedSet | lib/confirm.ts | tests/interaction-patterns.test.tsx |
| csvimport.pickCsv | lib/csvimport.ts | tests/csv-import-logic.test.ts |
| csvimport.commitCsvImport | lib/csvimport.ts | tests/audit-m1-006-import.test.ts, tests/csv-import-logic.test.ts, tests/regress.test.tsx |
| csvparse.isImportError | lib/csvparse.ts | tests/csv-import-logic.test.ts |
| csvparse.parseCsv | lib/csvparse.ts | tests/csv-import-logic.test.ts, tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-langs1.test.tsx +5 |
| csvparse.detectFormat | lib/csvparse.ts | tests/csv-import-logic.test.ts |
| csvparse.parseDurationA | lib/csvparse.ts | tests/csv-import-logic.test.ts |
| csvparse.parseTimeB | lib/csvparse.ts | tests/csv-import-logic.test.ts |
| csvparse.parseImport | lib/csvparse.ts | tests/audit-m1-006-import.test.ts, tests/csv-import-logic.test.ts, tests/live-marker.test.ts +1 |
| csvparse.normName | lib/csvparse.ts | tests/csv-import-logic.test.ts |
| csvparse.indexExercises | lib/csvparse.ts | tests/csv-import-logic.test.ts |
| csvparse.matchExercise | lib/csvparse.ts | tests/csv-import-logic.test.ts |
| csvparse.isDuplicate | lib/csvparse.ts | tests/csv-import-logic.test.ts |
| csvparse.analyze | lib/csvparse.ts | tests/csv-import-logic.test.ts |
| csvparse.buildImport | lib/csvparse.ts | tests/csv-import-logic.test.ts, tests/live-marker.test.ts |
| cues/index.cueText | lib/cues/index.ts | tests/audit-k1-bl-mer.test.tsx, tests/cues-014.test.tsx, tests/cues-lazy.test.ts +6 |
| cues/index.cueDict | lib/cues/index.ts | tests/audit-k1-bl-mer.test.tsx, tests/cues-014.test.tsx, tests/cues-lazy.test.ts +5 |
| cues/index.hasCues | lib/cues/index.ts | tests/audit-k1-fala2b.test.tsx |
| cues/index.cuesFor | lib/cues/index.ts | tests/audit-0.10-lang-ui.test.tsx, tests/cues-014.test.tsx, tests/cues-lazy.test.ts +2 |
| cues/index.cueBasis | lib/cues/index.ts | tests/audit-k1-bl-mer.test.tsx, tests/cues-014.test.tsx |
| cues/index.cueOrgs | lib/cues/index.ts | tests/cues.test.tsx |
| dashboard.weekStrip | lib/dashboard.ts | tests/audit-0.10-plan.test.ts, tests/dashboard.test.tsx, tests/matrix-invariants.test.ts +2 |
| dashboard.weekTiles | lib/dashboard.ts | tests/audit-0.10-plan.test.ts, tests/audit-0.10-stats.test.ts, tests/dashboard.test.tsx +3 |
| dashboard.lastWorkout | lib/dashboard.ts | tests/audit-0.10-stats.test.ts, tests/dashboard.test.tsx, tests/mutation-bounds.test.ts |
| dashboard.firstSteps | lib/dashboard.ts | tests/audit-0.10-plan.test.ts, tests/dashboard.test.tsx, tests/mutation-bounds.test.ts |
| deleteMessages.bandDeleteMessage | lib/deleteMessages.ts | tests/m3-p5-delete.test.tsx |
| deleteMessages.locationDeleteMessage | lib/deleteMessages.ts | tests/m3-p5-delete.test.tsx |
| deload-sets.deloadKeep | lib/deload-sets.ts | tests/audit-0.10-live-logic.test.ts, tests/deload-plan.test.ts, tests/deload-ui.test.tsx +1 |
| deload-sets.deloadSets | lib/deload-sets.ts | tests/deload-plan.test.ts, tests/mutation-bounds.test.ts |
| deload.nextMonday | lib/deload.ts | tests/deload-plan.test.ts, tests/mutation-bounds.test.ts |
| deload.trainingStreakWeeks | lib/deload.ts | tests/deload-plan.test.ts, tests/mutation-bounds.test.ts |
| deload.deloadHint | lib/deload.ts | tests/access.test.ts, tests/audit-0.10-plan.test.ts, tests/deload-plan.test.ts +1 |
| deload.snoozeDeloadHint | lib/deload.ts | tests/audit-0.10-plan.test.ts |
| draft.beginObjDraft | lib/draft.ts | tests/audit-k1-fala2b.test.tsx, tests/audit011b.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx +3 |
| draft.objDraft | lib/draft.ts | tests/app.tsx, tests/audit-k1-fala2b.test.tsx, tests/audit011b.test.tsx +3 |
| draft.objDirty | lib/draft.ts | tests/backlog-0.10.1-dane.test.ts, tests/edit-on-demand.test.tsx |
| draft.noteDraftEffect | lib/draft.ts | tests/audit-k1-fala2b.test.tsx, tests/matrix-invariants.test.ts |
| draft.discardObjDraft | lib/draft.ts | tests/audit-k1-fala2b.test.tsx, tests/backlog-0.10.1-dane.test.ts, tests/edit-on-demand.test.tsx +1 |
| draft.cleanName | lib/draft.ts | tests/edit-on-demand.test.tsx |
| draft.commitObjDraft | lib/draft.ts | tests/audit-k1-fala2b.test.tsx, tests/audit011b.test.tsx, tests/backlog-0.10.1-dane.test.ts +2 |
| draft.templateForEdit | lib/draft.ts | tests/edit-on-demand.test.tsx |
| draft.dropUnsavedNew | lib/draft.ts | tests/edit-on-demand.test.tsx |
| draft.restoreObjDrafts | lib/draft.ts | tests/audit-m1-004-start-error.test.tsx, tests/audit011b.test.tsx, tests/backlog-0.10.1-dane.test.ts |
| draft.dropRestored | lib/draft.ts | tests/backlog-0.10.1-dane.test.ts |
| draft.__resetObjDrafts | lib/draft.ts | tests/audit-k1-fala2b.test.tsx, tests/audit011b.test.tsx, tests/b2-plan-own-templates.test.tsx +10 |
| edit.touchDraft | lib/edit.ts | tests/audit011b.test.tsx, tests/edit-history.test.tsx, tests/integration-090.test.tsx +2 |
| edit.useDraftTick | lib/edit.ts | tests/matrix-logic.test.tsx |
| edit.draftOf | lib/edit.ts | tests/audit-0.10-data.test.ts, tests/audit-r83b.test.tsx, tests/audit011b.test.tsx +6 |
| edit.discardDraft | lib/edit.ts | tests/edit-history.test.tsx, tests/edit-on-demand.test.tsx, tests/matrix-invariants.test.ts +3 |
| edit.dateText | lib/edit.ts | tests/backlog-0.10.1-dane-ui.test.tsx, tests/backlog-0.10.1-dane.test.ts, tests/edit-history.test.tsx +4 |
| edit.timeText | lib/edit.ts | tests/backlog-0.10.1-dane-ui.test.tsx, tests/backlog-0.10.1-dane.test.ts, tests/edit-history.test.tsx +2 |
| edit.minText | lib/edit.ts | tests/matrix-logic.test.tsx |
| edit.isDirty | lib/edit.ts | tests/integration-090.test.tsx, tests/matrix-logic.test.tsx |
| edit.beginEdit | lib/edit.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-live-logic.test.ts, tests/audit-r83b.test.tsx +13 |
| edit.defaultPastWhen | lib/edit.ts | tests/edit-history.test.tsx, tests/matrix-time.test.ts |
| edit.beginPast | lib/edit.ts | tests/audit-0.10-data.test.ts, tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx +12 |
| edit.prefilledOffList | lib/edit.ts | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx |
| edit.draftSetWhen | lib/edit.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-live-logic.test.ts, tests/backlog-0.10.1-dane.test.ts +6 |
| edit.draftSetLocation | lib/edit.ts | tests/integration-090.test.tsx |
| edit.draftAddExercise | lib/edit.ts | tests/audit-0.10-data.test.ts, tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx +9 |
| edit.draftAddSet | lib/edit.ts | tests/edit-history.test.tsx, tests/matrix-invariants.test.ts, tests/matrix-logic.test.tsx +2 |
| edit.draftRemoveSet | lib/edit.ts | tests/edit-history.test.tsx, tests/edit-on-demand.test.tsx, tests/matrix-invariants.test.ts |
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
| edit.activeEnd | lib/edit.ts | tests/audit-0.10-live-logic.test.ts |
| edit.checkDraft | lib/edit.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-live-logic.test.ts, tests/audit-r83b.test.tsx +5 |
| edit.commitDraft | lib/edit.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-live-logic.test.ts, tests/backlog-0.10.1-dane.test.ts +10 |
| edit.__resetDrafts | lib/edit.ts | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx +8 |
| entitlement.paywallConfig | lib/entitlement.ts | tests/entitlement.test.ts, tests/store-adapter.test.ts |
| entitlement.paywallOn | lib/entitlement.ts | tests/entitlement.test.ts |
| entitlement.parseLastKnown | lib/entitlement.ts | tests/entitlement.test.ts |
| entitlement.lastKnownFrom | lib/entitlement.ts | tests/entitlement.test.ts |
| entitlement.refreshEntitlements | lib/entitlement.ts | tests/entitlement.test.ts, tests/m5s1-dni-zapis.test.ts, tests/subscription-invariants.test.ts |
| entitlement.initEntitlements | lib/entitlement.ts | tests/audit-m1-012-status.test.ts, tests/entitlement.test.ts, tests/m5s1-dni-zapis.test.ts +2 |
| entitlement.resetEntitlementsForTests | lib/entitlement.ts | tests/audit-m1-012-status.test.ts, tests/audit-m1-016-paywall-benefit.test.tsx, tests/audit-m1-041-reminder-files.test.tsx +11 |
| entitlement.liveStarts | lib/entitlement.ts | tests/entitlement.test.ts, tests/m5s1-dni-zapis.test.ts |
| entitlement.accessNow | lib/entitlement.ts | tests/entitlement.test.ts, tests/m5s1-dni-zapis.test.ts, tests/subscription-invariants.test.ts |
| entitlement.useAccess | lib/entitlement.ts | tests/audit-m1-012-status.test.ts, tests/subscription-ui.test.tsx |
| entitlement.guardLiveStart | lib/entitlement.ts | tests/entitlement.test.ts, tests/m5s1-dni-zapis.test.ts, tests/subscription-invariants.test.ts |
| entitlement.purchasePlan | lib/entitlement.ts | tests/entitlement.test.ts, tests/subscription-invariants.test.ts |
| entitlement.restorePurchases | lib/entitlement.ts | tests/access.test.ts, tests/entitlement.test.ts, tests/store-adapter.test.ts +1 |
| equipment.capLabel | lib/equipment.ts | tests/matrix-logic.test.tsx, tests/sec2-01-names.test.ts |
| equipment.equipById | lib/equipment.ts | tests/bar-no-plates.test.tsx, tests/catalog-library25.test.tsx, tests/locations-catalog.test.ts +3 |
| equipment.equipLabel | lib/equipment.ts | tests/app.tsx, tests/audit-k1-brands.test.ts, tests/locations-audit.test.tsx +2 |
| equipment.blankLoad | lib/equipment.ts | tests/matrix-dim-equipment.test.tsx, tests/matrix-logic.test.tsx |
| equipment.applyLoadPreset | lib/equipment.ts | tests/audit-m1-lok07-03-presets.test.ts, tests/matrix-dim-equipment.test.tsx, tests/xcheck-0610b.test.tsx |
| equipment.equipEntry | lib/equipment.ts | tests/audit-0.10-tst.test.ts, tests/audit-0.10-ui.test.tsx, tests/audit-m1-015-asekuracja.test.tsx +13 |
| equipment.presetEquipment | lib/equipment.ts | tests/adapt-logic.test.ts, tests/adapt-scenario.test.tsx, tests/adapt-ui.test.tsx +21 |
| equipment.presetHint | lib/equipment.ts | tests/audit-0.10-gen.test.ts, tests/catalog-library25.test.tsx |
| equipment.fillEquip2 | lib/equipment.ts | tests/catalog-library25.test.tsx |
| equipment.fillOpts | lib/equipment.ts | tests/matrix-logic.test.tsx |
| equipment.fillGym | lib/equipment.ts | tests/matrix-logic.test.tsx |
| equipment.allLabels | lib/equipment.ts | tests/i18n-locales.test.ts, tests/matrix-i18n.test.tsx |
| equipment.capsOf | lib/equipment.ts | tests/audit-0.10-tst.test.ts, tests/catalog-full.test.tsx, tests/catalog-v2.test.ts +4 |
| equipment.availability | lib/equipment.ts | tests/adapt-logic.test.ts, tests/catalog-full.test.tsx, tests/catalog-library25.test.tsx +11 |
| equipment.needsSafety | lib/equipment.ts | tests/audit-m1-015-asekuracja.test.tsx, tests/audit-m1-031-asekuracja-zakres.test.tsx |
| equipment.needsSpotter | lib/equipment.ts | tests/audit-m1-031-asekuracja-zakres.test.tsx |
| equipment.missingLabel | lib/equipment.ts | tests/locations-catalog.test.ts |
| equipment.loadKindsFor | lib/equipment.ts | tests/locations-catalog.test.ts, tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-equipment.test.tsx +1 |
| equipment.loadsFor | lib/equipment.ts | tests/audit-r82b.test.tsx, tests/catalog-v2.test.ts, tests/decisions-0310.test.tsx +7 |
| equipment.implAt | lib/equipment.ts | tests/decisions-0310.test.tsx, tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-equipment.test.tsx +1 |
| equipment.implsAt | lib/equipment.ts | tests/adapt-logic.test.ts, tests/audit-k1-log.test.ts, tests/catalog-v2.test.ts +3 |
| equipvis.implFor | lib/equipvis.ts | tests/karta-sprzet.test.tsx, tests/matrix-karta.test.tsx |
| equipvis.stackWindow | lib/equipvis.ts | tests/karta-sprzet.test.tsx |
| equipvis.equipVisFor | lib/equipvis.ts | tests/audit-0.10-tst-ui.test.tsx, tests/karta-sprzet.test.tsx, tests/matrix-karta.test.tsx |
| equipvis.bandHex | lib/equipvis.ts | tests/audit-m1-040-band-colors.test.ts, tests/karta-sprzet.test.tsx |
| equipvis.equipSlotFor | lib/equipvis.ts | tests/karta-sprzet.test.tsx |
| equipvis.slotHeight | lib/equipvis.ts | tests/slot-height.test.ts |
| figures/geom.side | lib/figures/geom.ts | tests/figures.test.tsx |
| figures/geom.norm | lib/figures/geom.ts | tests/figures.test.tsx, tests/intro.test.tsx, tests/invariants.test.ts |
| figures/geom.rawPoints | lib/figures/geom.ts | tests/figures.test.tsx |
| figures/geom.posePoints | lib/figures/geom.ts | tests/figures.test.tsx |
| figures/geom.jointAngles | lib/figures/geom.ts | tests/figures.test.tsx |
| figures/geom.toHorizontal | lib/figures/geom.ts | tests/figures.test.tsx |
| figures/geom.angleAt | lib/figures/geom.ts | tests/figures.test.tsx |
| figures/geom.lerpPose | lib/figures/geom.ts | tests/figures.test.tsx |
| figures/geom.lerpPt | lib/figures/geom.ts | tests/figures.test.tsx |
| figures/geom.loopAt | lib/figures/geom.ts | tests/figures.test.tsx |
| figures/geom.loopMs | lib/figures/geom.ts | tests/figures.test.tsx |
| figures/geom.resolveFigure | lib/figures/geom.ts | tests/figures.test.tsx |
| figures/geom.framePoints | lib/figures/geom.ts | tests/figures.test.tsx |
| figures/geom.poseBetween | lib/figures/geom.ts | tests/figures.test.tsx |
| figures/geom.evalCheck | lib/figures/geom.ts | tests/figures.test.tsx |
| figures/geom.shapes | lib/figures/geom.ts | tests/figures.test.tsx, tests/muscle-map.test.tsx, tests/trening-naglowek.test.tsx |
| figures/geom.bounds | lib/figures/geom.ts | tests/figures.test.tsx |
| figures/index.figureFor | lib/figures/index.ts | tests/audit-0.10-lang-ui.test.tsx, tests/cues-014.test.tsx, tests/figures.test.tsx +1 |
| figures/index.figureByKey | lib/figures/index.ts | tests/figures.test.tsx |
| figures/index.figureLabel | lib/figures/index.ts | tests/figures.test.tsx |
| figures/index.frameLabel | lib/figures/index.ts | tests/figures.test.tsx |
| figures/index.figureFrames | lib/figures/index.ts | tests/figures.test.tsx |
| figures/index.toSvg | lib/figures/index.ts | tests/figures.test.tsx |
| figures/index.svgPath | lib/figures/index.ts | tests/figures.test.tsx |
| figures/index.figureAt | lib/figures/index.ts | tests/figures.test.tsx |
| generator.setsFor | lib/generator.ts | tests/gen-general.test.ts |
| generator.cardioCount | lib/generator.ts | tests/gen-days.test.ts, tests/gen-general.test.ts, tests/generator.test.ts |
| generator.cardioSwitch | lib/generator.ts | tests/gen-general.test.ts |
| generator.setsBudget | lib/generator.ts | tests/audit-0.10-gen.test.ts, tests/gen-general.test.ts, tests/generator.test.ts |
| generator.splitFor | lib/generator.ts | tests/audit-0.10-gen.test.ts, tests/gen-general.test.ts, tests/generator.test.ts +1 |
| generator.bestDays | lib/generator.ts | tests/audit-0.10-gen.test.ts, tests/mutation-generator.test.ts, tests/plan-own-templates.test.ts |
| generator.pickDays | lib/generator.ts | tests/gen-days-ui.test.tsx, tests/gen-days.test.ts, tests/gen-general-ui.test.tsx +2 |
| generator.assignDays | lib/generator.ts | tests/gen-days.test.ts |
| generator.hasExternalLoad | lib/generator.ts | tests/audit-0.10-gen.test.ts, tests/mutation-generator.test.ts |
| generator.sessionName | lib/generator.ts | tests/generator-ui.test.tsx |
| generator.goalLabel | lib/generator.ts | tests/gen-general.test.ts, tests/generator-ui.test.tsx |
| generator.weekLoad | lib/generator.ts | tests/plan-own-templates.test.ts, tests/set-split.test.ts |
| generator.generate | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit-0.10-stats.test.ts +15 |
| generator.genCount | lib/generator.ts | tests/gen-days.test.ts, tests/gen-general.test.ts |
| generator.genProposal | lib/generator.ts | tests/gen-days-ui.test.tsx, tests/gen-days.test.ts, tests/gen-general.test.ts +1 |
| generator.weeklySetsList | lib/generator.ts | tests/set-split.test.ts |
| generator.previewWarnings | lib/generator.ts | tests/audit-0.10-gen.test.ts, tests/audit011-gen.test.tsx, tests/audit011b.test.tsx +4 |
| generator.genPlanName | lib/generator.ts | tests/audit-0.10-gen.test.ts, tests/gen-days.test.ts, tests/gen-general.test.ts +1 |
| generator.genNote | lib/generator.ts | tests/audit-0.10-gen.test.ts, tests/gen-general.test.ts |
| generator.genFolder | lib/generator.ts | tests/audit-0.10-gen.test.ts |
| generator.genFolders | lib/generator.ts | tests/matrix-invariants.test.ts |
| generator.replaceable | lib/generator.ts | tests/audit-0.10-gen.test.ts, tests/audit011-gen.test.tsx, tests/mutation-generator.test.ts +1 |
| generator.saveGenerated | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit011-gen.test.tsx +7 |
| generator.ownTemplates | lib/generator.ts | tests/matrix-invariants.test.ts, tests/plan-own-templates.test.ts |
| generator.ownSessionsFor | lib/generator.ts | tests/gen-days.test.ts, tests/plan-own-templates.test.ts |
| generator.ownPlan | lib/generator.ts | tests/gen-days-ui.test.tsx, tests/gen-days.test.ts, tests/matrix-invariants.test.ts +3 |
| generator.ownProposal | lib/generator.ts | tests/gen-days-ui.test.tsx, tests/gen-days.test.ts, tests/plan-own-templates-ui.test.tsx |
| generator.ownWarnings | lib/generator.ts | tests/gen-days.test.ts, tests/plan-own-templates.test.ts, tests/set-split.test.ts |
| generator.ownCounts | lib/generator.ts | tests/plan-own-templates.test.ts |
| generator.ownPlanName | lib/generator.ts | tests/plan-own-templates.test.ts |
| generator.saveOwnPlan | lib/generator.ts | tests/matrix-invariants.test.ts, tests/plan-own-templates.test.ts |
| guard.progressGuard | lib/guard.ts | tests/guard.test.ts |
| guard.guardCached | lib/guard.ts | tests/guard.test.ts |
| guard.guardWord | lib/guard.ts | tests/guard.test.ts |
| guard.guardTexts | lib/guard.ts | tests/guard.test.ts |
| guide.guideSeen | lib/guide.ts | tests/audit-0.10-ui.test.tsx, tests/guide.test.tsx, tests/migrate-idem.test.ts |
| guide.guideProgress | lib/guide.ts | tests/guide.test.tsx |
| guide.markGuideSeen | lib/guide.ts | tests/guide.test.tsx |
| haptics.hapticsEnabled | lib/haptics.ts | tests/m3-p5d-haptics.test.ts, tests/phone-p1.test.tsx |
| haptics.hapticsOn | lib/haptics.ts | tests/m3-p2-matrix.test.tsx, tests/m3-p5d-haptics.test.ts, tests/m3-p5d-settings-ui.test.tsx |
| haptics.playHaptic | lib/haptics.ts | tests/m3-p2-haptics.test.ts, tests/m3-p5d-haptics-done.test.tsx, tests/m3-p5d-haptics.test.ts |
| health.workoutActivityType | lib/health.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-gen.test.ts, tests/health-query.test.ts +3 |
| health.ensureAuthorization | lib/health.ts | tests/health-query.test.ts, tests/healthkit-contract.test.ts, tests/regress.test.tsx |
| health.ensureReadAuthorization | lib/health.ts | tests/health-query.test.ts, tests/regress.test.tsx |
| health.healthStart | lib/health.ts | tests/healthkit-contract.test.ts, tests/pause.test.tsx |
| health.saveWorkout | lib/health.ts | tests/audit-0.10-stats.test.ts, tests/edit-history.test.tsx, tests/health-query.test.ts +5 |
| health.healthPending | lib/health.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/audit-m1-009-watch-edit.test.ts +6 |
| health.deleteOwnCopy | lib/health.ts | tests/health-query.test.ts |
| health.reconcileWatchCopies | lib/health.ts | tests/health-query.test.ts, tests/matrix-invariants.test.ts |
| health.syncAfterFinish | lib/health.ts | tests/audit-0.10-data.test.ts, tests/audit-io-more.test.tsx, tests/audit-m1-009-watch-edit.test.ts +3 |
| health.reportWatchSession | lib/health.ts | tests/audit-m1-009-watch-edit.test.ts, tests/watch-health.test.ts |
| health.retryHealth | lib/health.ts | tests/audit-0.10-data.test.ts, tests/audit-m1-009-watch-edit.test.ts, tests/health-query.test.ts +2 |
| healthQuery.readEnabled | lib/healthQuery.ts | tests/health-query.test.ts |
| healthQuery.spansOf | lib/healthQuery.ts | tests/health-query.test.ts |
| healthQuery.sessionSpans | lib/healthQuery.ts | tests/health-query.test.ts |
| healthQuery.queryStepsByDay | lib/healthQuery.ts | tests/health-query.test.ts |
| healthQuery.loadDay | lib/healthQuery.ts | tests/health-query.test.ts |
| healthQuery.loadWeek | lib/healthQuery.ts | tests/health-query.test.ts |
| healthQuery.hasWatchMatch | lib/healthQuery.ts | tests/health-query.test.ts |
| healthQuery.matchesFor | lib/healthQuery.ts | tests/health-query.test.ts, tests/matrix-invariants.test.ts |
| healthQuery.ownCopySessions | lib/healthQuery.ts | tests/health-query.test.ts |
| healthQuery.loadWatchStats | lib/healthQuery.ts | tests/health-query.test.ts |
| healthRead.ownCopyFilter | lib/healthRead.ts | tests/health-read.test.ts |
| healthRead.validSpan | lib/healthRead.ts | tests/health-read.test.ts |
| healthRead.overlapMs | lib/healthRead.ts | tests/health-read.test.ts |
| healthRead.parseWorkout | lib/healthRead.ts | tests/health-read.test.ts |
| healthRead.isOwnWorkout | lib/healthRead.ts | tests/health-read.test.ts |
| healthRead.isWatchCandidate | lib/healthRead.ts | tests/health-read.test.ts |
| healthRead.matchWatchWorkouts | lib/healthRead.ts | tests/health-read.test.ts |
| healthRead.otherActivities | lib/healthRead.ts | tests/health-read.test.ts |
| healthRead.startingIn | lib/healthRead.ts | tests/health-read.test.ts |
| healthRead.dayBounds | lib/healthRead.ts | tests/health-read.test.ts, tests/health-world.ts |
| healthRead.avgDailySteps | lib/healthRead.ts | tests/health-read.test.ts |
| healthRead.stepsByDay | lib/healthRead.ts | tests/health-read.test.ts |
| healthRead.watchStatsFrom | lib/healthRead.ts | tests/health-read.test.ts |
| healthRead.hasWatchStats | lib/healthRead.ts | tests/health-read.test.ts |
| healthRead.fmtMinutes | lib/healthRead.ts | tests/health-read.test.ts |
| healthRead.stepsText | lib/healthRead.ts | tests/health-read.test.ts |
| healthRead.activityText | lib/healthRead.ts | tests/health-read.test.ts |
| healthRead.dayBlockSpoken | lib/healthRead.ts | tests/health-read.test.ts |
| healthRead.weekLineText | lib/healthRead.ts | tests/health-read.test.ts |
| healthRead.watchLineText | lib/healthRead.ts | tests/health-read.test.ts |
| healthRead.watchSpoken | lib/healthRead.ts | tests/health-read.test.ts |
| healthUse.useHealthLoad | lib/healthUse.ts | tests/health-use.test.tsx |
| hkModule.hk | lib/hkModule.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/audit-0.10-stats.test.ts +9 |
| home.startableTemplates | lib/home.ts | tests/home-b.test.tsx |
| home.mainStart | lib/home.ts | tests/home-b.test.tsx |
| home.otherStarts | lib/home.ts | tests/home-b.test.tsx |
| i18n.isLang | lib/i18n.ts | tests/matrix-logic.test.tsx |
| i18n.baseLang | lib/i18n.ts | tests/i18n-variants.test.ts, tests/matrix-i18n.test.tsx |
| i18n.resolveLang | lib/i18n.ts | tests/i18n-variants.test.ts, tests/i18n-wave2.test.ts, tests/i18n-wave3.test.ts +2 |
| i18n.detectLang | lib/i18n.ts | tests/i18n-variants.test.ts, tests/i18n-wave2.test.ts, tests/i18n-wave3.test.ts +2 |
| i18n.applyLang | lib/i18n.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/audit-0.10-gen-ui.test.tsx +121 |
| i18n.lang | lib/i18n.ts | tests/asc-metadane.test.ts, tests/audit-m1-028-delete-menus.test.tsx, tests/audit-m1-038-exname-lang.test.tsx +31 |
| i18n.appName | lib/i18n.ts | tests/audit-m1-004-start-error.test.tsx, tests/i18n-locales.test.ts |
| i18n.deviceUnit | lib/i18n.ts | tests/audit-0.10-tst.test.ts, tests/audit-0.10-ui.test.tsx, tests/audit-m1-lok07-02-default-system.test.ts +1 |
| i18n.locale | lib/i18n.ts | tests/adapt-ui.test.tsx, tests/app.tsx, tests/asc-metadane.test.ts +108 |
| i18n.decimalComma | lib/i18n.ts | tests/i18n-variants.test.ts, tests/i18n-wave2.test.ts, tests/i18n-wave3.test.ts +7 |
| i18n.setPseudo | lib/i18n.ts | tests/audit-m1-066-pseudo.test.tsx |
| i18n.isPseudo | lib/i18n.ts | tests/audit-m1-066-pseudo.test.tsx |
| i18n.t | lib/i18n.ts | tests/adapt-logic.test.ts, tests/app.tsx, tests/asc-kontrola.test.ts +169 |
| i18n.lbl | lib/i18n.ts | tests/audit-0.10-live-logic.test.ts, tests/audit-close2-b.test.tsx, tests/audit-journey-c.test.tsx +9 |
| i18n.tp | lib/i18n.ts | tests/audit-0.10-gen.test.ts, tests/audit-0.10-tst.test.ts, tests/audit-k1-bl-mer.test.tsx +28 |
| i18n.exName | lib/i18n.ts | tests/audit-0.10-lang-ui.test.tsx, tests/audit-close2-a.test.tsx, tests/audit-close2-b.test.tsx +29 |
| i18n.exNameLang | lib/i18n.ts | tests/audit-m1-038-exname-lang.test.tsx |
| i18n.collator | lib/i18n.ts | tests/audit-0.10-data.test.ts |
| i18n.fold | lib/i18n.ts | tests/catalog-v2.test.ts, tests/i18n-multi.test.ts |
| i18n.upper | lib/i18n.ts | tests/audit-0.10-lang.test.ts |
| i18n.glue | lib/i18n.ts | tests/audit-0.10-lang-ui.test.tsx |
| i18n.tIn | lib/i18n.ts | tests/audit-m1-025-muscle-caption.test.tsx, tests/audit-m1-040-band-colors.test.ts, tests/audit-m1-064-language-ios.test.tsx +14 |
| intro.introPieces | lib/intro.ts | tests/intro.test.tsx |
| intro.easeOutCubic | lib/intro.ts | tests/intro.test.tsx |
| intro.pieceOffset | lib/intro.ts | tests/intro.test.tsx |
| intro.introFrame | lib/intro.ts | tests/intro.test.tsx |
| intro.introMode | lib/intro.ts | tests/intro.test.tsx |
| intro.takeColdStart | lib/intro.ts | tests/intro.test.tsx |
| intro.__resetIntroForTests | lib/intro.ts | tests/app.tsx, tests/intro.test.tsx |
| live.setMarkOf | lib/live.ts | tests/audit-0.10-live-logic.test.ts |
| live.setLabel | lib/live.ts | tests/audit-0.10-live-logic.test.ts |
| live.restCue | lib/live.ts | tests/voice.test.ts, tests/watch-cue.test.ts, tests/watch-snapshot.test.ts |
| live.restLabel | lib/live.ts | tests/audit-0.10-live-logic.test.ts, tests/f014-logic.test.ts, tests/regress.test.tsx +1 |
| live.spokenUnit | lib/live.ts | tests/watch-cue.test.ts |
| live.spokenMeters | lib/live.ts | tests/audit-m1-lok07-01-imperial-dist.test.tsx, tests/watch-cue.test.ts |
| live.spokenDist | lib/live.ts | tests/audit-m1-lok07-01-imperial-dist.test.tsx |
| live.distParts | lib/live.ts | tests/audit-m1-lok07-01-imperial-dist.test.tsx |
| live.spokenDuration | lib/live.ts | tests/watch-cue.test.ts |
| live.spokenLoad | lib/live.ts | tests/watch-cue.test.ts |
| live.cueLoad | lib/live.ts | tests/watch-cue.test.ts |
| live.counterLabel | lib/live.ts | tests/watch-cue.test.ts |
| live.timedLabel | lib/live.ts | tests/f014-logic.test.ts |
| live.nowParts | lib/live.ts | tests/audit-0.10-live-logic.test.ts, tests/audit-m1-lok07-01-imperial-dist.test.tsx, tests/catalog-library25.test.tsx |
| live.focusCounter | lib/live.ts | tests/audit-0.10-live-logic.test.ts |
| loadcap.heavyLoadCaps | lib/loadcap.ts | tests/audit-k1-bl-mer.test.tsx |
| loadcap.loadCapWarning | lib/loadcap.ts | tests/audit-k1-bl-mer.test.tsx |
| loads.toKg | lib/loads.ts | tests/locations-loads.test.ts, tests/matrix-dim-catalog.test.tsx |
| loads.rangeCount | lib/loads.ts | tests/locations-verify2.test.tsx |
| loads.rangeValues | lib/loads.ts | tests/locations-audit.test.tsx, tests/locations-loads.test.ts, tests/locations-verify2.test.tsx +1 |
| loads.fillRange | lib/loads.ts | tests/audit-0.10-ui.test.tsx, tests/locations-audit.test.tsx, tests/locations-loads.test.ts +1 |
| loads.plateSums | lib/loads.ts | tests/locations-audit.test.tsx, tests/locations-loads.test.ts |
| loads.validateSpec | lib/loads.ts | tests/audit-0.10-tst.test.ts, tests/locations-audit.test.tsx, tests/locations-verify2.test.tsx +1 |
| loads.specValues | lib/loads.ts | tests/audit-m1-lok07-03-presets.test.ts, tests/locations-loads.test.ts, tests/matrix-dim-equipment.test.tsx |
| loads.noPlates | lib/loads.ts | tests/bar-no-plates.test.tsx |
| loads.achievable | lib/loads.ts | tests/decisions-0310.test.tsx, tests/locations-audit.test.tsx, tests/locations-catalog.test.ts +3 |
| loads.convertSpec | lib/loads.ts | tests/locations-audit.test.tsx, tests/locations-verify2.test.tsx, tests/locations-verify3.test.tsx |
| loads.sameLoad | lib/loads.ts | tests/locations-loads.test.ts |
| loads.hasLoad | lib/loads.ts | tests/audit-backlog-q.test.tsx, tests/audit-perf-equiv.test.ts, tests/audit-r82b.test.tsx +4 |
| loads.hasLoadShown | lib/loads.ts | tests/audit-r82b.test.tsx |
| loads.nextHeavier | lib/loads.ts | tests/decisions-0310.test.tsx, tests/locations-loads.test.ts |
| loads.roundDown | lib/loads.ts | tests/locations-loads.test.ts |
| loads.sanitizeLoadSpec | lib/loads.ts | tests/locations-audit.test.tsx, tests/locations-loads.test.ts |
| locations.addLocation | lib/locations.ts | tests/a11y-routes.ts, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts +42 |
| locations.setMainLocation | lib/locations.ts | tests/audit-0.10-lang-ui.test.tsx, tests/locations-model.test.ts, tests/locations-verify3.test.tsx +1 |
| locations.renameLocation | lib/locations.ts | tests/locations-audit.test.tsx, tests/matrix-invariants.test.ts |
| locations.commitLocationName | lib/locations.ts | tests/matrix-invariants.test.ts, tests/matrix-logic.test.tsx |
| locations.duplicateLocation | lib/locations.ts | tests/backlog-0.10.1-dane.test.ts, tests/locations-model.test.ts, tests/matrix-invariants.test.ts |
| locations.canDeleteLocation | lib/locations.ts | tests/matrix-invariants.test.ts, tests/matrix-logic.test.tsx, tests/places-oneoff-logic.test.ts |
| locations.deleteLocation | lib/locations.ts | tests/audit-r82c.test.tsx, tests/integration-090.test.tsx, tests/locations-model.test.ts +6 |
| locations.locationEdited | lib/locations.ts | tests/matrix-logic.test.tsx |
| locations.equipOf | lib/locations.ts | tests/locations-model.test.ts, tests/matrix-dim-equipment.test.tsx |
| locations.activeEquip | lib/locations.ts | tests/locations-model.test.ts, tests/matrix-dim-equipment.test.tsx, tests/matrix-invariants.test.ts +2 |
| locations.setEquip | lib/locations.ts | tests/audit-0.10-gen.test.ts, tests/audit-r82c.test.tsx, tests/band-exercises.test.tsx +11 |
| locations.setOpt | lib/locations.ts | tests/locations-model.test.ts, tests/matrix-dim-equipment.test.tsx, tests/matrix-invariants.test.ts +1 |
| locations.setBandLevel | lib/locations.ts | tests/band-exercises.test.tsx, tests/matrix-invariants.test.ts, tests/owner-0510c.test.tsx +1 |
| locations.setBandColor | lib/locations.ts | tests/matrix-invariants.test.ts, tests/owner-0510c.test.tsx |
| locations.setLoad | lib/locations.ts | tests/audit-perf-equiv.test.ts, tests/audit-r82c.test.tsx, tests/audit-r83.test.tsx +4 |
| locations.locationLabel | lib/locations.ts | tests/locations-model.test.ts, tests/places-oneoff-logic.test.ts, tests/scenario-full.test.tsx |
| locations.ONE_OFF_DEFAULT_NAME | lib/locations.ts | tests/places-oneoff-logic.test.ts |
| locations.addOneOffLocation | lib/locations.ts | tests/matrix-invariants.test.ts, tests/places-migrate.test.ts, tests/places-oneoff-logic.test.ts +2 |
| locations.keepOneOff | lib/locations.ts | tests/places-oneoff-logic.test.ts |
| motif.plateAt | lib/motif.ts | tests/motyw.test.tsx |
| motif.dayMark | lib/motif.ts | tests/matrix-invariants.test.ts, tests/motyw.test.tsx |
| motif.restCup | lib/motif.ts | tests/motyw.test.tsx |
| motif.miniIcon | lib/motif.ts | tests/motyw.test.tsx |
| motif.plateStack | lib/motif.ts | tests/motyw.test.tsx |
| motif.plateStackHeight | lib/motif.ts | tests/motyw.test.tsx |
| motif.planPct | lib/motif.ts | tests/matrix-invariants.test.ts, tests/motyw.test.tsx |
| motif.weekProgress | lib/motif.ts | tests/matrix-invariants.test.ts, tests/motyw.test.tsx, tests/plan-wczesniej.test.ts +1 |
| motif.monthWeeks | lib/motif.ts | tests/matrix-invariants.test.ts, tests/motyw-miesiac.test.tsx, tests/plan-wczesniej.test.ts |
| motif.contrast | lib/motif.ts | tests/audit-m1-031-contrast.test.tsx, tests/audit-m1-p3-coverage.test.tsx, tests/m3-components.test.tsx +6 |
| motif.needsEdge | lib/motif.ts | tests/motyw.test.tsx |
| musclemap.shadeLevel | lib/musclemap.ts | tests/muscle-map.test.tsx |
| musclemap.mixHex | lib/musclemap.ts | tests/muscle-map.test.tsx |
| musclemap.shadeColor | lib/musclemap.ts | tests/audit-m1-025-muscle-caption.test.tsx, tests/muscle-map.test.tsx |
| musclemap.rankedMuscles | lib/musclemap.ts | tests/muscle-map.test.tsx |
| musclemap.svgMarkup | lib/musclemap.ts | tests/muscle-map.test.tsx |
| notices.setAutoSavedNotice | lib/notices.ts | tests/interaction-patterns.test.tsx |
| notices.useAutoSavedNotice | lib/notices.ts | tests/interaction-patterns.test.tsx |
| notices.autoSavedNotice | lib/notices.ts | tests/audit-close2-a.test.tsx, tests/audit-final2-fg.test.tsx, tests/interaction-patterns.test.tsx +2 |
| notices.__resetNoticesForTests | lib/notices.ts | tests/app.tsx |
| period.periodRange | lib/period.ts | tests/matrix-invariants.test.ts, tests/motyw-miesiac.test.tsx, tests/mutation-bounds.test.ts +2 |
| period.totals | lib/period.ts | tests/progress.test.ts, tests/regress.test.tsx |
| period.periodSummary | lib/period.ts | tests/audit-0.10-stats.test.ts, tests/backlog-0.10.1-dane.test.ts, tests/mutation-bounds.test.ts +3 |
| period.periodTitle | lib/period.ts | tests/mutation-bounds.test.ts, tests/period-summary.test.tsx |
| plan.dayKeyOf | lib/plan.ts | tests/audit011-gen.test.tsx, tests/matrix-invariants.test.ts, tests/plan-calendar.test.ts |
| plan.addDays | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/audit011-gen.test.tsx, tests/matrix-invariants.test.ts +6 |
| plan.weekdayIdx | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/matrix-invariants.test.ts, tests/mutation-plan.test.ts +1 |
| plan.weekPlanDays | lib/plan.ts | tests/audit-0.10-gen.test.ts, tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts +13 |
| plan.planHistory | lib/plan.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-plan.test.ts, tests/audit-0.10-tst.test.ts +9 |
| plan.baseRaw | lib/plan.ts | tests/matrix-data-fuzz.test.ts, tests/mutation-plan.test.ts |
| plan.planInForce | lib/plan.ts | tests/matrix-invariants.test.ts, tests/motyw.test.tsx |
| plan.planChangedInWeek | lib/plan.ts | tests/postep-tygodnia-zmiana-planu.test.tsx |
| plan.plannedOn | lib/plan.ts | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts, tests/audit-k1-fala2b.test.tsx +11 |
| plan.planTplName | lib/plan.ts | tests/audit-0.10-plan.test.ts |
| plan.busyDays | lib/plan.ts | tests/audit-0.10-data.test.ts, tests/matrix-invariants.test.ts, tests/plan-wczesniej.test.ts |
| plan.setWeekDay | lib/plan.ts | tests/a11y-routes.ts, tests/adapt-scenario.test.tsx, tests/audit-0.10-gen-ui.test.tsx +49 |
| plan.planName | lib/plan.ts | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts, tests/gen-days-ui.test.tsx +16 |
| plan.savedPlans | lib/plan.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit-0.10-plan-ui.test.tsx +30 |
| plan.plansFull | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/matrix-invariants.test.ts |
| plan.setPlanName | lib/plan.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts +14 |
| plan.typePlanName | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/mutation-plan.test.ts |
| plan.newPlan | lib/plan.ts | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts, tests/home-plan-header.test.tsx +6 |
| plan.setSavedDay | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/matrix-invariants.test.ts, tests/mutation-plan.test.ts +1 |
| plan.typeSavedName | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/mutation-plan.test.ts |
| plan.renamePlan | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/matrix-invariants.test.ts, tests/mutation-plan.test.ts +1 |
| plan.activationNote | lib/plan.ts | tests/audit-0.10-gen.test.ts, tests/audit-0.10-plan.test.ts, tests/mutation-plan.test.ts +1 |
| plan.activatePlan | lib/plan.ts | tests/audit-0.10-gen.test.ts, tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts +8 |
| plan.deactivatePlan | lib/plan.ts | tests/places-migrate.test.ts, tests/plan-places.test.ts, tests/plan-wczesniej.test.ts +1 |
| plan.addPlan | lib/plan.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit-0.10-plan-ui.test.tsx +7 |
| plan.assignNewTemplate | lib/plan.ts | tests/matrix-invariants.test.ts, tests/plan-new-template-day.test.tsx |
| plan.deletePlan | lib/plan.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/matrix-invariants.test.ts +2 |
| plan.setDayPlan | lib/plan.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit-0.10-plan-ui.test.tsx +15 |
| plan.resetDay | lib/plan.ts | tests/matrix-invariants.test.ts, tests/mutation-plan.test.ts, tests/plan-calendar.test.ts +3 |
| plan.plannedPlace | lib/plan.ts | tests/matrix-invariants.test.ts, tests/plan-places.test.ts |
| plan.plannedPlaceName | lib/plan.ts | tests/plan-places.test.ts |
| plan.placeDays | lib/plan.ts | tests/matrix-invariants.test.ts, tests/plan-places.test.ts |
| plan.setPlanPlace | lib/plan.ts | tests/matrix-invariants.test.ts, tests/places-migrate.test.ts, tests/places-shift-scenario.test.tsx +2 |
| plan.placeRun | lib/plan.ts | tests/matrix-invariants.test.ts, tests/plan-places.test.ts |
| plan.clearPlanPlace | lib/plan.ts | tests/matrix-invariants.test.ts, tests/plan-places.test.ts |
| plan.shiftPlan | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/matrix-invariants.test.ts, tests/mutation-plan.test.ts +3 |
| plan.moveOnly | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/matrix-invariants.test.ts, tests/mutation-plan.test.ts +3 |
| plan.swapDays | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/matrix-invariants.test.ts, tests/mutation-plan.test.ts +2 |
| plan.templateUsage | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/mutation-plan.test.ts |
| plan.templateUsageText | lib/plan.ts | tests/audit-0.10-plan.test.ts |
| plan.removeTemplate | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/matrix-invariants.test.ts, tests/mutation-plan.test.ts |
| plan.earlyWorkout | lib/plan.ts | tests/plan-wczesniej.test.ts |
| plan.earlyFor | lib/plan.ts | tests/plan-wczesniej.test.ts |
| plan.earlyTarget | lib/plan.ts | tests/plan-wczesniej.test.ts |
| plan.markDoneEarly | lib/plan.ts | tests/plan-wczesniej-ui.test.tsx, tests/plan-wczesniej.test.ts |
| plan.undoDoneEarly | lib/plan.ts | tests/plan-wczesniej.test.ts |
| plan.earlyNote | lib/plan.ts | tests/plan-wczesniej.test.ts |
| plan.dayStatusFrom | lib/plan.ts | tests/audit-0.10-plan.test.ts |
| plan.doneOn | lib/plan.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-plan.test.ts, tests/postep-tygodnia-zmiana-planu.test.tsx |
| plan.pending | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/edit-history.test.tsx, tests/m3-p2-board-ui.test.tsx +4 |
| plan.templateMuscles | lib/plan.ts | tests/gen-days.test.ts, tests/mutation-plan.test.ts, tests/plan-calendar.test.ts +1 |
| plan.doneInfo | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/plan-wczesniej.test.ts |
| plan.backToBack | lib/plan.ts | tests/audit-0.10-gen.test.ts, tests/gen-days.test.ts, tests/gen-general-ui.test.tsx +6 |
| plan.suggest | lib/plan.ts | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts, tests/backlog-0.10.1-dane.test.ts +6 |
| plan.suggestionOrder | lib/plan.ts | tests/audit-k1-fala2b.test.tsx |
| plan.applySuggestion | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/matrix-invariants.test.ts, tests/plan-calendar.test.ts |
| planReminder.planReminderOn | lib/planReminder.ts | tests/plan-reminder.test.tsx |
| planReminder.syncPlanReminders | lib/planReminder.ts | tests/audit-0.10-plan.test.ts, tests/mutation-bounds.test.ts, tests/plan-places.test.ts +2 |
| planReminder.planReminderKey | lib/planReminder.ts | tests/audit-0.10-live.test.tsx, tests/audit-0.10-plan.test.ts, tests/mutation-bounds.test.ts +3 |
| planReminder.cancelLegacyReminders | lib/planReminder.ts | tests/rm-signing.test.tsx |
| planReminder.reminderPermission | lib/planReminder.ts | tests/audit-0.10-plan.test.ts, tests/mutation-bounds.test.ts |
| planReminder.askReminderPermission | lib/planReminder.ts | tests/audit-0.10-plan.test.ts, tests/e2e-102-reminder.test.tsx, tests/mutation-bounds.test.ts |
| planReminder.restExplainDismissed | lib/planReminder.ts | tests/audit-m1-p3-coverage.test.tsx |
| planReminder.dismissRestExplain | lib/planReminder.ts | tests/audit-m1-p3-coverage.test.tsx |
| planReminder.requestRestNotificationPermission | lib/planReminder.ts | tests/audit-m1-p3-coverage.test.tsx |
| planReminder.__resetReminderAsk | lib/planReminder.ts | tests/app.tsx, tests/audit-m1-p3-coverage.test.tsx, tests/helpers.ts |
| plural.pluralIndex | lib/plural.ts | tests/audit-m1-042-plural-guard.test.ts, tests/i18n-multi.test.ts, tests/i18n-wave2.test.ts +3 |
| products.planOfProduct | lib/products.ts | tests/store-adapter.test.ts |
| products.isSubscriptionPlan | lib/products.ts | tests/store-adapter.test.ts |
| products.isFakeStoreBuild | lib/products.ts | tests/store-adapter.test.ts |
| progress.estimateItem | lib/progress.ts | tests/progress.test.ts |
| progress.estimateTemplate | lib/progress.ts | tests/progress.test.ts |
| progress.plannedDays | lib/progress.ts | tests/guard.test.ts, tests/progress.test.ts |
| progress.plannedRest | lib/progress.ts | tests/progress.test.ts |
| progress.compare | lib/progress.ts | tests/audit-0.10-data.test.ts, tests/audit-k1-data.test.ts, tests/guard.test.ts +3 |
| progress.compareCached | lib/progress.ts | tests/progress.test.ts |
| progress.pctText | lib/progress.ts | tests/progress.test.ts |
| progress.signedNum | lib/progress.ts | tests/progress.test.ts |
| review-run.markJustFinished | lib/review-run.ts | tests/idea-request.test.tsx, tests/review-run.test.tsx |
| review-run.takeJustFinished | lib/review-run.ts | tests/review-run.test.tsx |
| review-run.maybeRequestReview | lib/review-run.ts | tests/review-run.test.tsx |
| review-run.ideaLinkDue | lib/review-run.ts | tests/idea-request.test.tsx |
| review-run.onSummaryShown | lib/review-run.ts | tests/idea-request.test.tsx, tests/review-run.test.tsx |
| review.reviewDecision | lib/review.ts | tests/idea-request.test.tsx, tests/review-run.test.tsx, tests/review.test.ts |
| review.shouldAskForReview | lib/review.ts | tests/review.test.ts |
| review.normalizeReviewAsked | lib/review.ts | tests/review-run.test.tsx |
| review.ideaDecision | lib/review.ts | tests/idea-request.test.tsx |
| review.normalizeIdeaShownAt | lib/review.ts | tests/idea-request.test.tsx |
| seed.hasTime | lib/seed.ts | tests/audit-perf-equiv.test.ts, tests/catalog-library25.test.tsx, tests/matrix-dim-metrics.test.tsx +3 |
| seed.hasReps | lib/seed.ts | tests/audit-perf-equiv.test.ts, tests/catalog-library25.test.tsx, tests/matrix-dim-catalog.test.tsx +3 |
| seed.hasWeight | lib/seed.ts | tests/audit-perf-equiv.test.ts, tests/catalog-library25.test.tsx, tests/matrix-dim-catalog.test.tsx +3 |
| seed.hasDistance | lib/seed.ts | tests/audit-perf-equiv.test.ts, tests/catalog-library25.test.tsx, tests/matrix-dim-metrics.test.tsx +1 |
| seed.loadModeFor | lib/seed.ts | tests/catalog-library25.test.tsx, tests/catalog-v2.test.ts |
| seed.loadMult | lib/seed.ts | tests/audit-k1-data.test.ts, tests/matrix-logic.test.tsx |
| seed.uid | lib/seed.ts | tests/audit-0.10-stats.test.ts, tests/audit-k1-catalog-step.test.ts, tests/audit-k1-data.test.ts +18 |
| seed.base | lib/seed.ts | tests/adapt-logic.test.ts, tests/audit-0.10-data.test.ts, tests/audit-0.10-gen-ui.test.tsx +39 |
| seed.defaultModules | lib/seed.ts | tests/matrix-logic.test.tsx |
| seed.muscleLoadOf | lib/seed.ts | tests/audit-0.10-stats.test.ts, tests/audit-k1-muscleload.test.tsx, tests/catalog-v2.test.ts +1 |
| seed.libExtraRevOf | lib/seed.ts | tests/audit-0.10-stats.test.ts, tests/swap-logic.test.ts |
| seed.catalogKey | lib/seed.ts | tests/audit-0.10-stats.test.ts |
| seed.isLibBase | lib/seed.ts | tests/audit-0.10-stats.test.ts |
| seed.metricFor | lib/seed.ts | tests/catalog-library25.test.tsx, tests/catalog-v2.test.ts, tests/ux.test.tsx |
| seed.muscleConfidence | lib/seed.ts | tests/audit-0.10-ui.test.tsx, tests/catalog-library25.test.tsx, tests/zrodlo-jedno.test.ts |
| seed.unmappedMuscleOf | lib/seed.ts | tests/audit-0.10-ui.test.tsx, tests/catalog-library25.test.tsx |
| seed.isNiche | lib/seed.ts | tests/catalog-library25.test.tsx, tests/swap-logic.test.ts |
| seed.formerNamesOf | lib/seed.ts | tests/audit-k1-fala2b.test.tsx |
| seed.formerMatch | lib/seed.ts | tests/audit-k1-fala2b.test.tsx |
| seed.formerExact | lib/seed.ts | tests/audit-k1-fala2b.test.tsx |
| seed.musclesSourced | lib/seed.ts | tests/audit-0.10-stats.test.ts, tests/audit-0.10-ui.test.tsx |
| seed.musclesFor | lib/seed.ts | tests/catalog-library25.test.tsx, tests/catalog-v2.test.ts |
| seed.equipFields | lib/seed.ts | tests/locations-catalog.test.ts |
| seed.blankTimer | lib/seed.ts | tests/audit-0.10-tst.test.ts, tests/m3-p5d-haptics.test.ts, tests/matrix-invariants.test.ts +4 |
| seed.defaultSettings | lib/seed.ts | tests/audit-m1-043-support-page.test.ts, tests/store-review-notes.test.ts, tests/theme-choice.test.tsx |
| seed.libExercise | lib/seed.ts | tests/matrix-logic.test.tsx |
| seed.fpHash | lib/seed.ts | tests/backlog-0.10.1-dane.test.ts |
| seed.libKeyFromFields | lib/seed.ts | tests/audit-0.10-stats.test.ts |
| seed.libKeyCandidates | lib/seed.ts | tests/backlog-0.10.1-dane-lib.test.ts |
| seed.seedState | lib/seed.ts | tests/audit-k1-catalog-step.test.ts, tests/audit-k1-data.test.ts, tests/audit-k1-fala2b.test.tsx +32 |
| setFlow.isClosingSet | lib/setFlow.ts | tests/set-flow.test.ts |
| setFlow.completeSet | lib/setFlow.ts | tests/set-flow.test.ts, tests/voice-ui.test.tsx, tests/voice.test.ts +7 |
| setFlow.restLabels | lib/setFlow.ts | tests/set-flow.test.ts |
| setFlow.finishTimedSet | lib/setFlow.ts | tests/set-flow.test.ts |
| setFlow.relabelRest | lib/setFlow.ts | tests/set-flow.test.ts |
| setParts.isSetPart | lib/setParts.ts | tests/matrix-invariants.test.ts, tests/set-goals.test.ts |
| setParts.clampGoal | lib/setParts.ts | tests/matrix-invariants.test.ts, tests/set-goals.test.ts |
| setParts.normalizeGoals | lib/setParts.ts | tests/set-goals.test.ts |
| setSplit.emptySplit | lib/setSplit.ts | tests/scenario-full.test.tsx, tests/set-split.test.ts |
| setSplit.makeSplit | lib/setSplit.ts | tests/set-split.test.ts |
| setSplit.sumSplit | lib/setSplit.ts | tests/set-split.test.ts |
| setSplit.addSplitSets | lib/setSplit.ts | tests/set-split.test.ts |
| setSplit.splitTotals | lib/setSplit.ts | tests/set-split.test.ts |
| setSplit.mergeSplits | lib/setSplit.ts | tests/set-split.test.ts |
| setSplit.splitText | lib/setSplit.ts | tests/scenario-full.test.tsx, tests/set-split.test.ts |
| setSplit.splitLabel | lib/setSplit.ts | tests/set-split.test.ts |
| start.deloadCounts | lib/start.ts | tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-stats.test.ts, tests/deload-ui.test.tsx +1 |
| start.repeatCounts | lib/start.ts | tests/audit-0.10-live-logic.test.ts, tests/live2-split-template.test.tsx |
| start.deloadLessText | lib/start.ts | tests/audit-0.10-live-logic.test.ts |
| start.startTemplate | lib/start.ts | tests/audit-journey-a.test.tsx, tests/flows.test.tsx |
| start.startRepeatLast | lib/start.ts | tests/audit-0.10-live-logic.test.ts |
| start.startEmptyWorkout | lib/start.ts | tests/entitlement.test.ts |
| start.workoutInProgressNotice | lib/start.ts | tests/interaction-patterns.test.tsx |
| store.getBackupStat | lib/state/backupstat.ts | tests/audit-m1-008-backupstat.test.ts, tests/audit-m1-008-kopia-ui.test.tsx |
| store.noteBackup | lib/state/backupstat.ts | tests/audit-m1-008-backupstat.test.ts |
| store.cleanLevels | lib/state/bands.ts | tests/matrix-logic.test.tsx |
| store.nextBandId | lib/state/bands.ts | tests/audit-r83.test.tsx, tests/owner-0510c.test.tsx, tests/xcheck-0610.test.tsx |
| store.cycleBand | lib/state/bands.ts | tests/invariants.test.ts, tests/matrix-invariants.test.ts, tests/owner-0510c.test.tsx +1 |
| store.deleteBand | lib/state/bands.ts | tests/invariants.test.ts, tests/matrix-invariants.test.ts |
| store.bodyMassLog | lib/state/bodymass.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/audit-0.10-stats-ui.test.tsx +9 |
| store.bodyMassOn | lib/state/bodymass.ts | tests/audit-0.10-data.test.ts, tests/matrix-invariants.test.ts |
| store.bodyMassFor | lib/state/bodymass.ts | tests/audit-0.10-data.test.ts |
| store.latestBodyMass | lib/state/bodymass.ts | tests/audit-0.10-data.test.ts |
| store.addBodyMass | lib/state/bodymass.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/backlog-0.10.1-dane.test.ts +6 |
| store.removeBodyMass | lib/state/bodymass.ts | tests/audit-0.10-data.test.ts, tests/matrix-invariants.test.ts |
| store.init | lib/state/boot.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-tst-ui.test.tsx, tests/audit-0.10-tst.test.ts +30 |
| store.readPreMigrate | lib/state/boot.ts | tests/audit-m1-002-premigrate.test.ts |
| store.markBootStable | lib/state/boot.ts | tests/crash-guard.test.ts |
| store.sanitizeDraftObj | lib/state/boot.ts | tests/backlog-0.10.1-dane-lib.test.ts |
| store.readRawData | lib/state/boot.ts | tests/audit-0.10-plan.test.ts |
| store.readRecovery | lib/state/boot.ts | tests/audit-io-more.test.tsx, tests/logic.test.ts, tests/regress.test.tsx |
| store.onStateReplaced | lib/state/boot.ts | tests/audit011b.test.tsx |
| store.replaceState | lib/state/boot.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-plan.test.ts, tests/audit-close-d.test.ts +17 |
| store.resetAll | lib/state/boot.ts | tests/audit-journey-c.test.tsx, tests/audit-m1-lok07-02-default-system.test.ts, tests/audit011b.test.tsx +4 |
| store.applyCfg | lib/state/core.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-tst.test.ts, tests/helpers.ts +1 |
| store.flush | lib/state/core.ts | tests/adapt-logic.test.ts, tests/adapt-scenario.test.tsx, tests/adapt-ui.test.tsx +198 |
| store.flushStrict | lib/state/core.ts | tests/audit-m1-006-import.test.ts |
| store.registerDraftStore | lib/state/core.ts | tests/backlog-0.10.1-dane-lib.test.ts |
| store.draftsChanged | lib/state/core.ts | tests/backlog-0.10.1-dane-lib.test.ts |
| store.takeSavedDrafts | lib/state/core.ts | tests/backlog-0.10.1-dane-lib.test.ts |
| store.getPersistError | lib/state/core.ts | tests/audit-persist.test.ts, tests/logic.test.ts, tests/matrix-data-fuzz.test.ts +1 |
| store.getRecovery | lib/state/core.ts | tests/audit-io-more.test.tsx, tests/audit-r83b.test.tsx, tests/db-real-sqlite.test.ts +7 |
| store.clearRecovery | lib/state/core.ts | tests/matrix-logic.test.tsx, tests/regress.test.tsx |
| store.getNewerSchema | lib/state/core.ts | tests/audit-0.10-plan.test.ts |
| store.markDraft | lib/state/core.ts | tests/edit-on-demand.test.tsx |
| store.isDraftObj | lib/state/core.ts | tests/edit-on-demand.test.tsx, tests/matrix-invariants.test.ts |
| store.save | lib/state/core.ts | tests/adapt-logic.test.ts, tests/adapt-scenario.test.tsx, tests/adapt-ui.test.tsx +198 |
| store.saveCfg | lib/state/core.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/audit-m1-027-voice-default.test.ts +11 |
| store.getState | lib/state/core.ts | tests/a11y-routes.ts, tests/adapt-logic.test.ts, tests/adapt-scenario.test.tsx +257 |
| store.useStore | lib/state/core.ts | tests/matrix-logic.test.tsx |
| store.useTick | lib/state/core.ts | tests/audit-0.10-tst.test.ts |
| store.usePrefsTick | lib/state/core.ts | tests/matrix-logic.test.tsx |
| store.getHistRev | lib/state/core.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/edit-on-demand.test.tsx +2 |
| store.getRev | lib/state/core.ts | tests/adapt-logic.test.ts, tests/audit-0.10-data.test.ts, tests/mutation-bounds.test.ts |
| store.refreshViews | lib/state/core.ts | tests/audit-r72-ui.test.tsx, tests/audit-stale-ui.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx +4 |
| store.useForegroundTick | lib/state/core.ts | tests/matrix-logic.test.tsx |
| store.useHistTick | lib/state/core.ts | tests/audit-0.10-tst.test.ts |
| store.useCfgTick | lib/state/core.ts | tests/audit-0.10-tst.test.ts |
| store.memoHist | lib/state/core.ts | tests/matrix-logic.test.tsx |
| store.memoHistBy | lib/state/core.ts | tests/matrix-logic.test.tsx |
| store.setTimerState | lib/state/core.ts | tests/audit-0.10-tst.test.ts, tests/audit-persist.test.ts, tests/m3-p5d-haptics.test.ts +6 |
| store.isReadyForTests | lib/state/core.ts | tests/app.tsx, tests/audit-0.10-plan.test.ts, tests/audit-m1-003-guard-ui.test.tsx +1 |
| store.__resetForTests | lib/state/core.ts | tests/app.tsx, tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-tst-ui.test.tsx +27 |
| store.parseBootGuard | lib/state/crashguard.ts | tests/crash-guard.test.ts |
| store.decideBoot | lib/state/crashguard.ts | tests/crash-guard.test.ts |
| store.dbDirectory | lib/state/db.ts | tests/audit-backlog-r75.test.tsx |
| store.copyKv | lib/state/db.ts | tests/audit-backlog-r75.test.tsx, tests/db-real-sqlite.test.ts |
| store.effortScale | lib/state/effort.ts | tests/audit-0.10-plan.test.ts, tests/audit-0.10-stats.test.ts, tests/audit-k1-bl-mer.test.tsx +4 |
| store.effortLabel | lib/state/effort.ts | tests/effort-scale.test.tsx |
| store.effortOut | lib/state/effort.ts | tests/audit-k1-bl-mer.test.tsx, tests/audit-m1-044-brd.test.ts, tests/effort-scale.test.tsx |
| store.effortText | lib/state/effort.ts | tests/audit-k1-bl-mer.test.tsx |
| store.effortIn | lib/state/effort.ts | tests/audit-0.10-stats.test.ts, tests/audit-k1-bl-mer.test.tsx, tests/audit-m1-044-brd.test.ts +1 |
| store.effortField | lib/state/effort.ts | tests/audit-k1-bl-mer.test.tsx, tests/effort-scale.test.tsx |
| store.useExercisesTick | lib/state/exercises.ts | tests/audit-0.10-tst.test.ts |
| store.newExercise | lib/state/exercises.ts | tests/adapt-logic.test.ts, tests/adapt-ui.test.tsx, tests/audit-0.10-data.test.ts +22 |
| store.setEquipment | lib/state/exercises.ts | tests/audit-io-more.test.tsx, tests/audit-r83.test.tsx, tests/audit-r83b.test.tsx +8 |
| store.exerciseEdited | lib/state/exercises.ts | tests/ui2-01-draft-equipment.test.tsx |
| store.restoreExercise | lib/state/exercises.ts | tests/audit-k1-fala2b.test.tsx, tests/matrix-invariants.test.ts |
| store.exerciseInHistory | lib/state/exercises.ts | tests/audit-0.10-data-ui.test.tsx, tests/matrix-logic.test.tsx |
| store.exerciseUsed | lib/state/exercises.ts | tests/matrix-invariants.test.ts, tests/matrix-logic.test.tsx |
| store.deleteExercise | lib/state/exercises.ts | tests/adapt-logic.test.ts, tests/audit-0.10-tst.test.ts, tests/audit-k1-fala2b.test.tsx +11 |
| store.visibleExercises | lib/state/exercises.ts | tests/audit-0.10-data-ui.test.tsx, tests/logic.test.ts, tests/scenario-full.test.tsx +1 |
| store.exercisesInUse | lib/state/exercises.ts | tests/catalog-library25.test.tsx, tests/scenario-full.test.tsx |
| store.inCoreList | lib/state/exercises.ts | tests/catalog-library25.test.tsx, tests/scenario-full.test.tsx |
| store.libShowAll | lib/state/exercises.ts | tests/audit-0.10-tst-ui.test.tsx, tests/catalog-library25.test.tsx, tests/matrix-invariants.test.ts +2 |
| store.setLibShowAll | lib/state/exercises.ts | tests/catalog-library25.test.tsx, tests/matrix-invariants.test.ts |
| store.lastActivity | lib/state/finish.ts | tests/audit-persist.test.ts, tests/store-stale.test.ts |
| store.staleKind | lib/state/finish.ts | tests/matrix-dim-metrics.test.tsx, tests/store-stale.test.ts |
| store.hasWorkDone | lib/state/finish.ts | tests/matrix-dim-metrics.test.tsx, tests/store-stale.test.ts |
| store.staleSince | lib/state/finish.ts | tests/audit-backlog-q.test.tsx, tests/audit-final2-auto.test.ts, tests/audit-m1-044-brd.test.ts +6 |
| store.ackStale | lib/state/finish.ts | tests/audit-r72-d.test.ts, tests/live-marker.test.ts, tests/regress.test.tsx +1 |
| store.markActivity | lib/state/finish.ts | tests/store-stale.test.ts |
| store.resolveColdStopwatch | lib/state/finish.ts | tests/regress.test.tsx, tests/store-stale.test.ts |
| store.autoFinishStale | lib/state/finish.ts | tests/audit-backlog-q.test.tsx, tests/audit-close-a.test.ts, tests/audit-final2-auto.test.ts +8 |
| store.recordLiveDayFor | lib/state/finish.ts | tests/entitlement.test.ts, tests/m5s1-dni-zapis.test.ts, tests/review-run.test.tsx +2 |
| store.finishWorkout | lib/state/finish.ts | tests/a11y-routes.ts, tests/audit-0.10-data.test.ts, tests/audit-0.10-lang-ui.test.tsx +41 |
| store.cancelWorkout | lib/state/finish.ts | tests/adapt-ui.test.tsx, tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx +25 |
| store.deleteWorkout | lib/state/finish.ts | tests/audit-0.10-data.test.ts, tests/edit-history.test.tsx, tests/invariants.test.ts +5 |
| store.setHasResult | lib/state/finish.ts | tests/matrix-dim-catalog.test.tsx, tests/matrix-logic.test.tsx |
| store.putHistoryWorkout | lib/state/finish.ts | tests/audit-m1-009-watch-edit.test.ts, tests/swap-schema16.test.ts |
| store.normalizeGroups | lib/state/groups.ts | tests/logic.test.ts, tests/matrix-invariants.test.ts, tests/reorder-t010.test.tsx |
| store.groupLabels | lib/state/groups.ts | tests/matrix-logic.test.tsx |
| store.ssTag | lib/state/groups.ts | tests/audit-m1-037-ss-pr-dict.test.ts |
| store.ssBtn | lib/state/groups.ts | tests/audit-m1-037-ss-pr-dict.test.ts, tests/guide.test.tsx |
| store.linkWithNext | lib/state/groups.ts | tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx, tests/audit-close-d.test.ts +9 |
| store.unlink | lib/state/groups.ts | tests/audit-m1-037-ss-pr-dict.test.ts, tests/invariants.test.ts, tests/logic.test.ts +1 |
| store.moveItem | lib/state/groups.ts | tests/edit-on-demand.test.tsx, tests/logic.test.ts |
| store.removeItem | lib/state/groups.ts | tests/matrix-invariants.test.ts, tests/regress.test.tsx |
| store.blockRanges | lib/state/groups.ts | tests/reorder-t010.test.tsx |
| store.moveBlockOf | lib/state/groups.ts | tests/matrix-invariants.test.ts, tests/regress.test.tsx, tests/reorder-t010.test.tsx |
| store.moveInGroup | lib/state/groups.ts | tests/reorder-t010.test.tsx |
| store.finishedWorkouts | lib/state/history.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-stats.test.ts +12 |
| store.blocksOf | lib/state/history.ts | tests/audit-perf-equiv.test.ts |
| store.workoutsWith | lib/state/history.ts | tests/audit-perf-equiv.test.ts, tests/edit-history.test.tsx, tests/matrix-logic.test.tsx |
| store.previousFor | lib/state/history.ts | tests/audit-prephone.test.tsx, tests/audit-r82b.test.tsx, tests/edit-history.test.tsx +3 |
| store.previousBlockFor | lib/state/history.ts | tests/audit-r72-b.test.ts, tests/audit-r72-d.test.ts, tests/audit-r82.test.tsx +8 |
| store.previousBlockBefore | lib/state/history.ts | tests/decisions-0310.test.tsx, tests/edit-history.test.tsx, tests/integration-090.test.tsx |
| store.hintFor | lib/state/history.ts | tests/audit-r72-b.test.ts, tests/audit-r72-d.test.ts, tests/audit-r82b.test.tsx +2 |
| store.progressionFor | lib/state/history.ts | tests/audit-backlog-r75.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx +8 |
| store.occurrence | lib/state/history.ts | tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx, tests/store-hint.test.ts +1 |
| store.occurrences | lib/state/history.ts | tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx, tests/store-hint.test.ts +1 |
| store.prevOfActiveBlock | lib/state/history.ts | tests/matrix-logic.test.tsx, tests/regress.test.tsx |
| store.addSet | lib/state/live.ts | tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx, tests/audit-0.10-ui.test.tsx +45 |
| store.removeSetById | lib/state/live.ts | tests/matrix-invariants.test.ts, tests/xcheck-0610b.test.tsx |
| store.removeSet | lib/state/live.ts | tests/cascade-sets.test.tsx, tests/invariants.test.ts, tests/matrix-invariants.test.ts |
| store.removeExercise | lib/state/live.ts | tests/invariants.test.ts, tests/matrix-invariants.test.ts, tests/regress.test.tsx +1 |
| store.findSet | lib/state/live.ts | tests/audit-close-a.test.ts |
| store.typeSetValue | lib/state/live.ts | tests/cascade-sets.test.tsx |
| store.restAfter | lib/state/live.ts | tests/adapt-logic.test.ts, tests/store-rest.test.ts |
| store.roundRest | lib/state/live.ts | tests/audit-0.10-live-logic.test.ts, tests/audit-r72-d.test.ts, tests/store-rest.test.ts |
| store.toggleDone | lib/state/live.ts | tests/a11y-routes.ts, tests/adapt-logic.test.ts, tests/adapt-scenario.test.tsx +78 |
| store.focusSet | lib/state/live.ts | tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx, tests/regress.test.tsx +2 |
| store.migrate | lib/state/migrate.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-gen.test.ts, tests/audit-0.10-live-logic.test.ts +56 |
| store.isPaused | lib/state/pause.ts | tests/m3-p2-board-ui.test.tsx, tests/matrix-invariants.test.ts, tests/pause.test.tsx |
| store.noClock | lib/state/pause.ts | tests/f014-logic.test.ts, tests/matrix-invariants.test.ts, tests/regress.test.tsx |
| store.whenText | lib/state/pause.ts | tests/f014-logic.test.ts, tests/regress.test.tsx |
| store.cleanPauses | lib/state/pause.ts | tests/pause.test.tsx, tests/regress.test.tsx |
| store.pauseWorkout | lib/state/pause.ts | tests/matrix-invariants.test.ts, tests/pause.test.tsx, tests/regress.test.tsx +4 |
| store.resumeWorkout | lib/state/pause.ts | tests/matrix-invariants.test.ts, tests/pause.test.tsx, tests/watch-invariants.test.ts +2 |
| store.locationById | lib/state/places.ts | tests/adapt-logic.test.ts, tests/audit-r82c.test.tsx, tests/decisions-0310.test.tsx +4 |
| store.visibleLocations | lib/state/places.ts | tests/matrix-invariants.test.ts, tests/places-oneoff-logic.test.ts, tests/places-ui.test.tsx |
| store.placeOnDay | lib/state/places.ts | tests/plan-places.test.ts |
| store.startLocationId | lib/state/places.ts | tests/places-oneoff-logic.test.ts, tests/scenario-full.test.tsx, tests/swap-logic.test.ts |
| store.unusedOneOffIds | lib/state/places.ts | tests/places-oneoff-logic.test.ts |
| store.pruneOneOff | lib/state/places.ts | tests/matrix-invariants.test.ts, tests/places-oneoff-logic.test.ts |
| store.offListAt | lib/state/places.ts | tests/audit-r82b.test.tsx, tests/swap-logic.test.ts |
| store.prevFromOther | lib/state/places.ts | tests/audit-r82.test.tsx, tests/swap-logic.test.ts |
| store.implAtLoc | lib/state/places.ts | tests/decisions-0310.test.tsx, tests/f014-logic.test.ts, tests/integration-090.test.tsx +5 |
| store.blockImpl | lib/state/places.ts | tests/audit-r82b.test.tsx |
| store.liveBlockImpl | lib/state/places.ts | tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx |
| store.listLocFor | lib/state/places.ts | tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx, tests/swap-logic.test.ts |
| store.pinnedImpl | lib/state/places.ts | tests/swap-logic.test.ts |
| store.offListNote | lib/state/places.ts | tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx |
| store.srcSetAt | lib/state/places.ts | tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx, tests/swap-logic.test.ts |
| store.stampImpl | lib/state/places.ts | tests/matrix-logic.test.tsx |
| store.setActiveLocation | lib/state/places.ts | tests/adapt-logic.test.ts, tests/audit-m1-034-hit-areas.test.tsx, tests/audit-r82.test.tsx +9 |
| store.restampUntouched | lib/state/places.ts | tests/f014-logic.test.ts |
| store.locationEquipChanged | lib/state/places.ts | tests/swap-logic.test.ts |
| store.exById | lib/state/sets.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-gen.test.ts, tests/audit-0.10-stats.test.ts +30 |
| store.bandById | lib/state/sets.ts | tests/matrix-data-fuzz.test.ts, tests/scenario-full.test.tsx |
| store.isBW | lib/state/sets.ts | tests/audit-perf-equiv.test.ts, tests/invariants.test.ts, tests/matrix-invariants.test.ts +1 |
| store.repsOf | lib/state/sets.ts | tests/audit-journey-a.test.tsx, tests/audit-perf-equiv.test.ts, tests/matrix-invariants.test.ts |
| store.loadOf | lib/state/sets.ts | tests/audit-perf-equiv.test.ts, tests/audit-r83b.test.tsx |
| store.shownLoad | lib/state/sets.ts | tests/audit-r83.test.tsx, tests/audit-r83b.test.tsx |
| store.setLoad | lib/state/sets.ts | tests/audit-perf-equiv.test.ts, tests/audit-r82c.test.tsx, tests/audit-r83.test.tsx +4 |
| store.loadFieldValue | lib/state/sets.ts | tests/matrix-dim-metrics.test.tsx, tests/matrix-logic.test.tsx |
| store.writeLoad | lib/state/sets.ts | tests/matrix-dim-metrics.test.tsx, tests/matrix-invariants.test.ts, tests/matrix-logic.test.tsx +1 |
| store.effectiveLoad | lib/state/sets.ts | tests/audit-perf-equiv.test.ts |
| store.exMult | lib/state/sets.ts | tests/logic.test.ts, tests/regress.test.tsx |
| store.isWorking | lib/state/sets.ts | tests/audit-perf-equiv.test.ts, tests/matrix-dim-metrics.test.tsx |
| store.workCount | lib/state/sets.ts | tests/audit-0.10-stats.test.ts, tests/backlog-0.10.1-dane-ui.test.tsx, tests/matrix-dim-metrics.test.tsx +1 |
| store.workSetCount | lib/state/sets.ts | tests/audit-0.10-stats.test.ts |
| store.workingSets | lib/state/sets.ts | tests/audit-0.10-stats.test.ts, tests/backlog-0.10.1-dane-ui.test.tsx, tests/progress.test.ts +1 |
| store.setVolume | lib/state/sets.ts | tests/audit-perf-equiv.test.ts, tests/audit-r82.test.tsx, tests/matrix-dim-catalog.test.tsx |
| store.blockMult | lib/state/sets.ts | tests/matrix-logic.test.tsx |
| store.volOf | lib/state/sets.ts | tests/matrix-logic.test.tsx |
| store.loadLabelShort | lib/state/sets.ts | tests/audit-r82.test.tsx, tests/audit-r82c.test.tsx, tests/regress.test.tsx |
| store.loadLabel | lib/state/sets.ts | tests/audit-close2-b.test.tsx, tests/audit-journey-c.test.tsx, tests/audit-journey-d.test.tsx +3 |
| store.restFor | lib/state/sets.ts | tests/regress.test.tsx |
| store.bandColor | lib/state/sets.ts | tests/audit-0.10-lang-ui.test.tsx, tests/audit-m1-040-band-colors.test.ts, tests/decisions-0310.test.tsx +3 |
| store.shortBand | lib/state/sets.ts | tests/audit-0.10-lang-ui.test.tsx, tests/audit-m1-040-band-colors.test.ts, tests/regress.test.tsx |
| store.bandA11y | lib/state/sets.ts | tests/audit-m1-040-band-colors.test.ts, tests/regress.test.tsx |
| store.setSummary | lib/state/sets.ts | tests/audit-k1-bl-mer.test.tsx, tests/audit-m1-lok07-01-imperial-dist.test.tsx, tests/audit-r83.test.tsx +11 |
| store.setScore | lib/state/sets.ts | tests/audit-perf-equiv.test.ts, tests/catalog-library25.test.tsx, tests/logic.test.ts |
| store.setHasValue | lib/state/sets.ts | tests/matrix-dim-metrics.test.tsx, tests/matrix-logic.test.tsx |
| store.volume | lib/state/sets.ts | tests/audit-0.10-stats.test.ts, tests/audit-close-d.test.ts, tests/audit-k1-data.test.ts +26 |
| store.usesBand | lib/state/sets.ts | tests/band-exercises.test.tsx, tests/matrix-dim-catalog.test.tsx, tests/matrix-invariants.test.ts +1 |
| store.applyPrefs | lib/state/settings.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-plan.test.ts, tests/audit-0.10-stats-ui.test.tsx +17 |
| store.setModule | lib/state/settings.ts | tests/matrix-logic.test.tsx |
| store.assistLost | lib/state/setvals.ts | tests/swap-logic.test.ts |
| store.cascadeDown | lib/state/setvals.ts | tests/cascade-sets.test.tsx |
| store.prefillSets | lib/state/start.ts | tests/audit-0.10-tst.test.ts |
| store.startableItem | lib/state/start.ts | tests/audit-0.10-live-logic.test.ts |
| store.repeatBlocks | lib/state/start.ts | tests/audit-0.10-live-logic.test.ts |
| store.startFromTemplate | lib/state/start.ts | tests/a11y-routes.ts, tests/adapt-logic.test.ts, tests/adapt-scenario.test.tsx +69 |
| store.startEmpty | lib/state/start.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx +123 |
| store.repeatLast | lib/state/start.ts | tests/access.test.ts, tests/audit-0.10-live-logic.test.ts, tests/audit-close-d.test.ts +14 |
| store.deloadTail | lib/state/start.ts | tests/audit-0.10-live-logic.test.ts |
| store.addExerciseToActive | lib/state/start.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx +114 |
| store.swapBlock | lib/state/swap.ts | tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-tst-ui.test.tsx, tests/audit-0.10-tst.test.ts +13 |
| store.swapImpl | lib/state/swap.ts | tests/audit-k1-log.test.ts, tests/live2-split-template.test.tsx, tests/matrix-invariants.test.ts +2 |
| store.canUndoSwap | lib/state/swap.ts | tests/invariants.test.ts, tests/matrix-invariants.test.ts, tests/swap-logic.test.ts |
| store.undoSwap | lib/state/swap.ts | tests/backlog-0.10.1-dane.test.ts, tests/invariants.test.ts, tests/live2-split-template.test.tsx +3 |
| store.canRememberAlt | lib/state/swap.ts | tests/audit-0.10-tst.test.ts, tests/matrix-invariants.test.ts, tests/places-oneoff-logic.test.ts +1 |
| store.rememberAlt | lib/state/swap.ts | tests/audit-0.10-tst.test.ts, tests/matrix-invariants.test.ts, tests/places-oneoff-logic.test.ts +1 |
| store.altHint | lib/state/swap.ts | tests/matrix-invariants.test.ts, tests/places-oneoff-logic.test.ts, tests/swap-alternates.test.tsx |
| store.acceptAlt | lib/state/swap.ts | tests/matrix-invariants.test.ts, tests/swap-alternates.test.tsx |
| store.skipExercise | lib/state/swap.ts | tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx, tests/matrix-invariants.test.ts +7 |
| store.unskipExercise | lib/state/swap.ts | tests/audit-0.10-live-logic.test.ts, tests/matrix-invariants.test.ts, tests/skip-today.test.tsx +2 |
| store.adaptActive | lib/state/swap.ts | tests/adapt-logic.test.ts, tests/matrix-invariants.test.ts |
| store.skipAlt | lib/state/swap.ts | tests/matrix-invariants.test.ts, tests/swap-alternates.test.tsx |
| store.rememberRest | lib/state/swap.ts | tests/matrix-invariants.test.ts, tests/swap-alternates.test.tsx |
| store.tplRows | lib/state/templates.ts | tests/audit-0.10-ui.test.tsx, tests/audit-k1-log.test.ts, tests/cascade-sets.test.tsx +8 |
| store.tplWorkSets | lib/state/templates.ts | tests/audit-0.10-stats.test.ts, tests/audit-k1-log.test.ts, tests/matrix-dim-metrics.test.tsx +1 |
| store.tplAddRow | lib/state/templates.ts | tests/cascade-sets.test.tsx, tests/edit-on-demand.test.tsx, tests/live2-split-template.test.tsx +3 |
| store.tplRemoveRow | lib/state/templates.ts | tests/matrix-invariants.test.ts, tests/template-rows.test.tsx |
| store.tplCycleBand | lib/state/templates.ts | tests/matrix-invariants.test.ts, tests/template-rows.test.tsx |
| store.tplSetRow | lib/state/templates.ts | tests/cascade-sets.test.tsx, tests/matrix-invariants.test.ts, tests/template-rows.test.tsx |
| store.tplEditRow | lib/state/templates.ts | tests/cascade-sets.test.tsx |
| store.tplSetKind | lib/state/templates.ts | tests/matrix-dim-metrics.test.tsx, tests/matrix-invariants.test.ts, tests/plan-own-templates.test.ts +1 |
| store.newTemplate | lib/state/templates.ts | tests/adapt-logic.test.ts, tests/adapt-scenario.test.tsx, tests/adapt-ui.test.tsx +74 |
| store.dupTemplate | lib/state/templates.ts | tests/audit-0.10-gen.test.ts, tests/gen-days-ui.test.tsx, tests/matrix-data-fuzz.test.ts +6 |
| store.templateFolders | lib/state/templates.ts | tests/template-folders.test.tsx |
| store.templateGroups | lib/state/templates.ts | tests/template-folders.test.tsx |
| store.archivedTemplates | lib/state/templates.ts | tests/template-folders.test.tsx |
| store.setTemplateNote | lib/state/templates.ts | tests/audit-0.10-gen.test.ts, tests/matrix-invariants.test.ts |
| store.setTemplateFolder | lib/state/templates.ts | tests/template-folders.test.tsx |
| store.setTemplateArchived | lib/state/templates.ts | tests/audit-0.10-plan.test.ts, tests/matrix-invariants.test.ts, tests/motyw.test.tsx +5 |
| store.deleteTemplate | lib/state/templates.ts | tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx, tests/audit-0.10-ui.test.tsx +5 |
| store.localDateTs | lib/state/time.ts | tests/audit-0.10-data-ui.test.tsx, tests/logic.test.ts, tests/matrix-time.test.ts |
| store.fmtSec | lib/state/time.ts | tests/audit-0.10-lang.test.ts, tests/i18n-wave3.test.ts, tests/i18n-wave4.test.ts +4 |
| store.fmtDist | lib/state/time.ts | tests/audit-0.10-lang.test.ts, tests/audit-m1-lok07-01-imperial-dist.test.tsx, tests/i18n-wave3.test.ts +2 |
| store.reps | lib/state/time.ts | tests/adapt-scenario.test.tsx, tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts +200 |
| store.fmtDur | lib/state/time.ts | tests/regress.test.tsx |
| store.fmtDayKey | lib/state/time.ts | tests/audit-0.10-ui.test.tsx, tests/csv-import-ui.test.tsx |
| store.fmtDate | lib/state/time.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/audit-m1-008-kopia-ui.test.tsx +9 |
| store.fmtTime | lib/state/time.ts | tests/audit-0.10-data.test.ts, tests/backlog-0.10.1-dane-ui.test.tsx, tests/backlog-0.10.1-dane.test.ts +7 |
| store.cleanTz | lib/state/time.ts | tests/audit-0.10-data.test.ts |
| store.wallTs | lib/state/time.ts | tests/audit-0.10-data.test.ts, tests/audit-perf-equiv.test.ts, tests/backlog-0.10.1-dane-ui.test.tsx +3 |
| store.fromWallTs | lib/state/time.ts | tests/audit-0.10-data.test.ts |
| store.workoutDay | lib/state/time.ts | tests/audit-0.10-data.test.ts, tests/backlog-0.10.1-dane.test.ts, tests/matrix-time.test.ts |
| store.mondayKey | lib/state/time.ts | tests/audit-0.10-data.test.ts, tests/deload-plan.test.ts, tests/matrix-time.test.ts +1 |
| store.clampName | lib/state/util.ts | tests/matrix-invariants.test.ts, tests/matrix-logic.test.tsx |
| store.isDeloadWeek | lib/state/weekplan.ts | tests/audit-0.10-plan-ui.test.tsx, tests/deload-week.test.tsx, tests/matrix-invariants.test.ts +2 |
| store.toggleDeloadWeek | lib/state/weekplan.ts | tests/audit-0.10-live.test.tsx, tests/audit-0.10-plan-ui.test.tsx, tests/deload-plan.test.ts +13 |
| store.cleanPlanName | lib/state/weekplan.ts | tests/audit-0.10-plan.test.ts |
| store.planDays | lib/state/weekplan.ts | tests/audit-0.10-plan.test.ts |
| store.normPlanHistory | lib/state/weekplan.ts | tests/audit-0.10-plan.test.ts |
| store.cleanOverrides | lib/state/weekplan.ts | tests/audit-0.10-plan.test.ts |
| store.cleanPlanPlaces | lib/state/weekplan.ts | tests/plan-places.test.ts |
| stats.bwShare | lib/stats.ts | tests/audit-0.10-stats.test.ts |
| stats.liftedLoad | lib/stats.ts | tests/audit-0.10-stats.test.ts |
| stats.bwE1Diff | lib/stats.ts | tests/audit-0.10-stats.test.ts, tests/audit-k1-mer.test.tsx |
| stats.fmtE1 | lib/stats.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-stats.test.ts, tests/audit-k1-mer.test.tsx |
| stats.e1rm | lib/stats.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-stats.test.ts, tests/audit-k1-mer.test.tsx +4 |
| stats.totalKind | lib/stats.ts | tests/catalog-library25.test.tsx, tests/matrix-dim-metrics.test.tsx, tests/matrix-invariants.test.ts +1 |
| stats.setTotal | lib/stats.ts | tests/audit-perf-equiv.test.ts, tests/q024.test.ts, tests/stats.test.ts |
| stats.fmtTotal | lib/stats.ts | tests/audit-records-logic.test.ts, tests/audit-records-misc.test.tsx, tests/stats.test.ts |
| stats.hasHistory | lib/stats.ts | tests/audit-perf-equiv.test.ts, tests/audit-perf-ui.test.tsx, tests/matrix-dim-catalog.test.tsx +2 |
| stats.sessionsFor | lib/stats.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-stats.test.ts, tests/audit-backlog-q.test.tsx +20 |
| stats.emptyRecords | lib/stats.ts | tests/audit-perf-equiv.test.ts |
| stats.recordsFor | lib/stats.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-stats.test.ts, tests/audit-backlog-q.test.tsx +30 |
| stats.setPRs | lib/stats.ts | tests/audit-0.10-stats.test.ts, tests/audit-final-stats.test.ts, tests/stats.test.ts |
| stats.prMap | lib/stats.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-stats.test.ts, tests/audit-final-stats.test.ts +24 |
| stats.recordLabel | lib/stats.ts | tests/audit-records-logic.test.ts |
| stats.recordDelta | lib/stats.ts | tests/records-card.test.tsx |
| stats.workoutPRs | lib/stats.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-stats.test.ts, tests/audit-close-d.test.ts +17 |
| stats.recordCards | lib/stats.ts | tests/records-card.test.tsx |
| stats.prCountOf | lib/stats.ts | tests/audit-0.10-stats.test.ts, tests/records-card.test.tsx, tests/review-run.test.tsx |
| stats.prCount | lib/stats.ts | tests/audit-0.10-stats.test.ts, tests/dashboard.test.tsx, tests/motyw.test.tsx |
| stats.chartKeysFor | lib/stats.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-stats.test.ts, tests/matrix-data-fuzz.test.ts +3 |
| stats.thisMonday | lib/stats.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-stats.test.ts, tests/guard.test.ts +12 |
| stats.weeklyTotals | lib/stats.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-stats.test.ts, tests/edit-history.test.tsx +11 |
| stats.hasAnyHistory | lib/stats.ts | tests/stats.test.ts |
| stats.weeklySetsByMuscle | lib/stats.ts | tests/logic.test.ts, tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-metrics.test.tsx +8 |
| stats.weeklySplitByMuscle | lib/stats.ts | tests/scenario-full.test.tsx, tests/set-split.test.ts |
| stats.setsByMuscle | lib/stats.ts | tests/audit-0.10-stats.test.ts, tests/audit-m1-044-brd.test.ts, tests/muscle-map.test.tsx +2 |
| stats.setsSplitByMuscle | lib/stats.ts | tests/set-split.test.ts |
| stats.manualSetsGoal | lib/stats.ts | tests/set-goals.test.ts |
| stats.setsGoal | lib/stats.ts | tests/matrix-invariants.test.ts, tests/scenario-full.test.tsx, tests/set-goals.test.ts +1 |
| stats.weeklyVolumeByMuscle | lib/stats.ts | tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-metrics.test.tsx, tests/matrix-time.test.ts +2 |
| stats.volumeByMuscle | lib/stats.ts | tests/progress.test.ts |
| store-adapter.setStoreAdapter | lib/store-adapter.ts | tests/audit-m1-012-status.test.ts, tests/audit-m1-016-paywall-benefit.test.tsx, tests/entitlement.test.ts +5 |
| store-adapter.getStoreAdapter | lib/store-adapter.ts | tests/store-adapter.test.ts |
| store-adapter.resetStoreAdapterForTests | lib/store-adapter.ts | tests/audit-m1-012-status.test.ts, tests/audit-m1-016-paywall-benefit.test.tsx, tests/audit-m1-041-reminder-files.test.tsx +12 |
| store-fake.createFakeStore | lib/store-fake.ts | tests/audit-m1-016-paywall-benefit.test.tsx, tests/entitlement.test.ts, tests/m5s1-bez-proby.test.ts +5 |
| store-native.entitlementFromPurchase | lib/store-native.ts | tests/m5s1-bez-proby.test.ts, tests/store-adapter.test.ts |
| store-native.productFromStore | lib/store-native.ts | tests/m5s1-bez-proby.test.ts, tests/store-adapter.test.ts |
| store-native.createNativeStore | lib/store-native.ts | tests/audit-m1-012-status.test.ts, tests/store-adapter.test.ts |
| support.buildSupportMailto | lib/support.ts | tests/idea-request.test.tsx, tests/support-mail.test.tsx |
| support.openSupportMail | lib/support.ts | tests/idea-request.test.tsx |
| support.openWebPage | lib/support.ts | tests/legal-links.test.tsx |
| swap.swapCandidates | lib/swap.ts | tests/adapt-logic.test.ts, tests/audit-0.10-stats.test.ts, tests/audit-0.10-tst.test.ts +3 |
| swap.sortOthers | lib/swap.ts | tests/catalog-full.test.tsx |
| swap.implLabel | lib/swap.ts | tests/swap-top3.test.ts |
| swap.otherImpls | lib/swap.ts | tests/swap-logic.test.ts, tests/swap-top3.test.ts |
| swap.reasonText | lib/swap.ts | tests/swap-top3.test.ts |
| swap.parseSwapTarget | lib/swap.ts | tests/matrix-logic.test.tsx |
| theme.applyTheme | lib/theme.ts | tests/matrix-logic.test.tsx |
| theme.useTheme | lib/theme.ts | tests/audit-m1-024-bold.test.tsx, tests/audit-m1-031-contrast.test.tsx, tests/matrix-logic.test.tsx |
| theme.font | lib/theme.ts | tests/i18n-wave2.test.ts, tests/m3-system.test.tsx, tests/m3-theme.test.ts |
| theme.maxScale | lib/theme.ts | tests/m3-theme.test.ts |
| theme.titleMaxScale | lib/theme.ts | tests/m3-components.test.tsx, tests/m3-theme.test.ts |
| theme.boardDigitSize | lib/theme.ts | tests/m3-theme.test.ts |
| timer.ensurePermission | lib/timer.ts | tests/matrix-logic.test.tsx, tests/timer-logic.test.ts |
| timer.start | lib/timer.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-live.test.tsx, tests/audit-0.10-tst.test.ts +53 |
| timer.adjust | lib/timer.ts | tests/maestro-selectors.test.ts, tests/matrix-logic.test.tsx, tests/matrix-time.test.ts +3 |
| timer.relabel | lib/timer.ts | tests/audit-0.10-tst.test.ts, tests/timer-logic.test.ts |
| timer.stop | lib/timer.ts | tests/adapt-scenario.test.tsx, tests/audit-0.10-live.test.tsx, tests/audit-0.10-tst-ui.test.tsx +89 |
| timer.stopIfFrom | lib/timer.ts | tests/matrix-logic.test.tsx, tests/timer-logic.test.ts |
| timer.restore | lib/timer.ts | tests/adapt-logic.test.ts, tests/audit-final-timer.test.tsx, tests/audit-m1-012-status.test.ts +11 |
| timer.onForeground | lib/timer.ts | tests/matrix-logic.test.tsx, tests/matrix-time.test.ts, tests/timer-logic.test.ts |
| timer.relocalize | lib/timer.ts | tests/f014-logic.test.ts |
| timer.refreshStale | lib/timer.ts | tests/f014-logic.test.ts, tests/timer-logic.test.ts |
| timer.resetAll | lib/timer.ts | tests/audit-journey-c.test.tsx, tests/audit-m1-lok07-02-default-system.test.ts, tests/audit011b.test.tsx +4 |
| timer.startSet | lib/timer.ts | tests/adapt-ui.test.tsx, tests/audit-backlog-q.test.tsx, tests/audit-close-a.test.ts +11 |
| timer.refreshScheduled | lib/timer.ts | tests/audit-backlog-r75.test.tsx, tests/m3-p5d-haptics.test.ts, tests/regress.test.tsx +1 |
| timer.stopSet | lib/timer.ts | tests/adapt-scenario.test.tsx, tests/audit-0.10-live.test.tsx, tests/audit-0.10-tst-ui.test.tsx +79 |
| timer.setElapsed | lib/timer.ts | tests/matrix-logic.test.tsx, tests/timer-logic.test.ts |
| timer.setReached | lib/timer.ts | tests/matrix-logic.test.tsx, tests/timer-logic.test.ts |
| timer.tick | lib/timer.ts | tests/adapt-logic.test.ts, tests/audit-0.10-tst.test.ts, tests/audit-journey-a.test.tsx +18 |
| timer.subscribe | lib/timer.ts | tests/matrix-logic.test.tsx, tests/timer-logic.test.ts, tests/watch-link-module.test.ts |
| timer.scheduleWeighReminder | lib/timer.ts | tests/audit-backlog-r75.test.tsx, tests/morning-removed.test.tsx, tests/timer-logic.test.ts |
| timer.cancelStaleReminder | lib/timer.ts | tests/audit-io-more.test.tsx, tests/timer-logic.test.ts |
| timer.staleBody | lib/timer.ts | tests/audit-stale-ui.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx, tests/backlog-0.10.1-dane.test.ts +2 |
| timer.scheduleStaleReminder | lib/timer.ts | tests/regress.test.tsx, tests/timer-logic.test.ts |
| tplsync.templateDiff | lib/tplsync.ts | tests/audit-0.10-ui.test.tsx, tests/audit-k1-log.test.ts, tests/live2-split-template.test.tsx +2 |
| tplsync.updateTemplateFromWorkout | lib/tplsync.ts | tests/audit-0.10-ui.test.tsx, tests/audit-k1-log.test.ts, tests/live2-split-template.test.tsx +1 |
| tplsync.templateFromWorkout | lib/tplsync.ts | tests/audit-0.10-ui.test.tsx, tests/matrix-invariants.test.ts |
| tplsync.templateDiffText | lib/tplsync.ts | tests/audit-0.10-ui.test.tsx |
| tplsync.rememberTemplateUpdate | lib/tplsync.ts | tests/tplsync-pending.test.ts |
| tplsync.pendingTemplateUpdate | lib/tplsync.ts | tests/tplsync-pending.test.ts |
| tplsync.applyPendingTemplateUpdate | lib/tplsync.ts | tests/tplsync-pending.test.ts |
| units.applyUnit | lib/units.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx +44 |
| units.wu | lib/units.ts | tests/matrix-data-fuzz.test.ts, tests/matrix-dim-metrics.test.tsx, tests/units.test.ts |
| units.isImperial | lib/units.ts | tests/audit-m1-lok07-01-imperial-dist.test.tsx |
| units.distUnit | lib/units.ts | tests/audit-m1-lok07-01-imperial-dist.test.tsx |
| units.dOut | lib/units.ts | tests/audit-m1-lok07-01-imperial-dist.test.tsx |
| units.dIn | lib/units.ts | tests/audit-m1-lok07-01-imperial-dist.test.tsx |
| units.wOut | lib/units.ts | tests/audit-backlog-r75.test.tsx, tests/audit-r83.test.tsx, tests/audit-training.test.ts +7 |
| units.wField | lib/units.ts | tests/audit-close2-b.test.tsx, tests/logic.test.ts, tests/matrix-dim-metrics.test.tsx +1 |
| units.wIn | lib/units.ts | tests/audit-0.10-live.test.tsx, tests/audit-backlog-r75.test.tsx, tests/audit-close-d.test.ts +16 |
| units.wInKeep | lib/units.ts | tests/matrix-dim-metrics.test.tsx, tests/matrix-logic.test.tsx |
| units.snapLb | lib/units.ts | tests/matrix-logic.test.tsx |
| units.snapLegacyLb | lib/units.ts | tests/matrix-migrations.test.tsx, tests/regress.test.tsx, tests/units.test.ts |
| units.fmtNum | lib/units.ts | tests/matrix-i18n.test.tsx, tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx +1 |
| units.volOut | lib/units.ts | tests/regress.test.tsx, tests/units.test.ts |
| units.fmtVol | lib/units.ts | tests/invariants.test.ts, tests/matrix-logic.test.tsx, tests/progression-ui.test.tsx +3 |
| units.fmtW | lib/units.ts | tests/audit-close-d.test.ts, tests/audit-m1-039-ru-units.test.ts, tests/audit-training.test.ts +4 |
| version.versionLabel | lib/version.ts | tests/support-mail.test.tsx, tests/version-label.test.tsx |
| voice.voicePolicy | lib/voice.ts | tests/voice.test.ts |
| voice.voiceSetting | lib/voice.ts | tests/audit-m1-027-voice-default.test.ts, tests/voice.test.ts |
| voice.setVoiceSetting | lib/voice.ts | tests/audit-m1-027-voice-default.test.ts, tests/voice.test.ts |
| voice.voiceSettingLabel | lib/voice.ts | tests/voice.test.ts |
| voice.__setScreenReaderForTests | lib/voice.ts | tests/voice-ui.test.tsx, tests/voice.test.ts |
| voice.appActive | lib/voice.ts | tests/voice.test.ts |
| voice.cueSpeech | lib/voice.ts | tests/voice.test.ts |
| voice.sayRestStart | lib/voice.ts | tests/voice.test.ts |
| voice.silenceVoice | lib/voice.ts | tests/voice.test.ts |
| voice.voiceAvailable | lib/voice.ts | tests/voice.test.ts |
| voice.sampleVoice | lib/voice.ts | tests/voice.test.ts |
| watch/apple.startAppleWatchLink | lib/watch/apple.ts | tests/watch-apple-link.test.ts |
| watch/apply.decideWatchEvent | lib/watch/apply.ts | tests/audit-m1-005-watch-reset.test.ts, tests/watch-apply.test.ts |
| watch/apply.applyWatchEvent | lib/watch/apply.ts | tests/audit-m1-005-watch-reset.test.ts, tests/voice.test.ts, tests/watch-apply.test.ts +2 |
| watch/client.initialClient | lib/watch/client.ts | tests/watch-client.test.ts, tests/watch-invariants.test.ts, tests/watch-scenarios.ts |
| watch/client.clientView | lib/watch/client.ts | tests/watch-client.test.ts, tests/watch-invariants.test.ts, tests/watch-scenarios.ts |
| watch/client.clientStep | lib/watch/client.ts | tests/watch-client.test.ts, tests/watch-invariants.test.ts, tests/watch-scenarios.ts |
| watch/health.watchHealthPlan | lib/watch/health.ts | tests/watch-health.test.ts |
| watch/labels.watchLabels | lib/watch/labels.ts | tests/watch-apple-i18n.test.ts, tests/watch-protocol.test.ts |
| watch/labels.watchLabelsFor | lib/watch/labels.ts | tests/watch-protocol.test.ts |
| watch/labels.allWatchLabels | lib/watch/labels.ts | tests/watch-fixtures.test.ts, tests/watch-protocol.test.ts |
| watch/link.snapshotBytes | lib/watch/link.ts | tests/watch-invariants.test.ts, tests/watch-snapshot.test.ts |
| watch/link.startWatchLink | lib/watch/link.ts | tests/watch-link.test.ts |
| watch/link.stopWatchLink | lib/watch/link.ts | tests/watch-apple-link.test.ts, tests/watch-link.test.ts, tests/watch-test-mode.test.tsx |
| watch/link.activeWatchLink | lib/watch/link.ts | tests/watch-apple-link.test.ts, tests/watch-link.test.ts |
| watch/protocol.parseWatchMessage | lib/watch/protocol.ts | tests/watch-fixtures.test.ts, tests/watch-protocol.test.ts |
| watch/protocol.encodeWatchMessage | lib/watch/protocol.ts | tests/watch-protocol.test.ts |
| watch/protocol.decodeWatchMessage | lib/watch/protocol.ts | tests/watch-apple-contract.test.ts, tests/watch-protocol.test.ts |
| watch/snapshot.watchNow | lib/watch/snapshot.ts | tests/watch-snapshot.test.ts |
| watch/snapshot.buildSnapshot | lib/watch/snapshot.ts | tests/watch-fixtures.test.ts, tests/watch-invariants.test.ts, tests/watch-scenarios.ts +1 |
| watch/snapshot.snapshotKey | lib/watch/snapshot.ts | tests/watch-snapshot.test.ts |
| watch/test-mode.isFakeWatchBuild | lib/watch/test-mode.ts | tests/watch-test-mode.test.tsx |
| watch/test-mode.testWatch | lib/watch/test-mode.ts | tests/watch-test-mode.test.tsx |
| watch/test-mode.startTestWatch | lib/watch/test-mode.ts | tests/watch-test-mode.test.tsx |
| watch/test-mode.pressTestWatch | lib/watch/test-mode.ts | tests/watch-test-mode.test.tsx |
| watchLabels.watchLabels | lib/watchLabels.ts | tests/watch-apple-i18n.test.ts, tests/watch-protocol.test.ts |
| watchLabels.watchInfoPlist | lib/watchLabels.ts | tests/watch-apple-i18n.test.ts |
| watchLabels.watchLabelTable | lib/watchLabels.ts | tests/watch-apple-i18n.test.ts |
| whatsnew.whatsNewUnseen | lib/whatsnew.ts | tests/mutation-bounds.test.ts, tests/whats-new.test.tsx |
| whatsnew.markWhatsNewSeen | lib/whatsnew.ts | tests/mutation-bounds.test.ts, tests/whats-new.test.tsx |

## WYMIAR

| Pozycja | Źródło | Testy (pierwsze 3) |
|---|---|---|
| ACCESS_STATES (4) | lib/access.ts | tests/access.test.ts |
| AccessLevel: full \| free | lib/access.ts | tests/access.test.ts |
| ENTITLEMENT_PLANS (3) | lib/access.ts | tests/access.test.ts, tests/audit-m1-012-status.test.ts, tests/entitlement.test.ts +3 |
| ENTITLEMENT_SOURCES (3) | lib/access.ts | tests/access.test.ts |
| ALWAYS_AVAILABLE (13) | lib/access.ts | tests/access.test.ts, tests/m5s1-dni-zapis.test.ts |
| GUARDED_STARTS (5) | lib/access.ts | tests/entitlement.test.ts |
| ADAPT_KINDS (4) | lib/adapt.ts | tests/adapt-logic.test.ts |
| AdaptSource: alternate \| ranking \| none | lib/adapt.ts | tests/adapt-logic.test.ts |
| BoardKey: weight \| addKg \| reps \| durationSec \| distanceM | lib/board.ts | tests/audit-backlog-r75.test.tsx, tests/cascade-sets.test.tsx |
| ICON_PLATES (4) | lib/brandIcon.ts | tests/intro.test.tsx, tests/motyw.test.tsx |
| ICON_SCHEMES (2) | lib/brandIcon.ts | tests/intro.test.tsx |
| LoadSource: barbell \| dumbbell \| cable \| machine_stack \| bodyweight \| trap_bar \| ez_bar \| plate_loaded_machine \| kettlebell \| smith \| band \| none | lib/catalog.generated.ts | tests/adapt-logic.test.ts, tests/audit-0.10-tst-ui.test.tsx, tests/audit-0.10-ui.test.tsx +3 |
| Pattern: h_push \| h_pull \| v_push \| v_pull \| squat \| hinge \| lunge_single_leg \| isolation \| core_flexion \| core_anti_ext \| core_anti_rot \| core_other \| carry \| cardio \| other \| mobility | lib/catalog.generated.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-gen.test.ts, tests/audit-0.10-plan.test.ts +1 |
| CATALOG_CAPS (91) | lib/catalog.generated.ts | tests/catalog-v2.test.ts, tests/locations-catalog.test.ts |
| CATALOG_ADDED_REVS (4) | lib/catalog.generated.ts | tests/audit-k1-catalog-step.test.ts, tests/catalog-v2.test.ts |
| CATALOG_LIB_EXTRA (585) | lib/catalog.generated.ts | tests/catalog-v2.test.ts |
| UNMAPPED_MUSCLES (4) | lib/catalog.generated.ts | tests/audit-0.10-ui.test.tsx |
| CsvFormat: formatA \| formatB | lib/csvparse.ts | tests/csv-import-logic.test.ts |
| ImportErrorCode: empty \| format \| rows \| toolarge | lib/csvparse.ts | tests/access.test.ts, tests/csv-import-logic.test.ts |
| CUE_SECTIONS (4) | lib/cues/index.ts | tests/cues-014.test.tsx, tests/cues.test.tsx, tests/figures.test.tsx |
| CUE_BASIS_KINDS (4) | lib/cues/index.ts | tests/audit-k1-bl-mer.test.tsx |
| DraftKind: exercise \| template | lib/draft.ts | tests/access.test.ts, tests/app.tsx |
| DraftEffect: created \| restored | lib/draft.ts | tests/audit-k1-fala2b.test.tsx |
| EXTRA_CAPS (4) | lib/equipment.ts | tests/audit-0.10-tst.test.ts |
| CAPABILITIES (2) | lib/equipment.ts | tests/locations-catalog.test.ts |
| EQUIP_GROUPS (8) | lib/equipment.ts | tests/app.tsx |
| LoadKind: barbell \| ez_bar \| trap_bar \| dumbbell \| kettlebell \| cable \| machine | lib/equipment.ts | tests/adapt-logic.test.ts, tests/audit-0.10-ui.test.tsx, tests/audit-m1-031-asekuracja-zakres.test.tsx +2 |
| EQUIPMENT (87) | lib/equipment.ts | tests/audit-0.10-tst.test.ts, tests/audit-k1-brands.test.ts, tests/catalog-v2.test.ts +5 |
| LOAD_PRESETS (5) | lib/equipment.ts | tests/audit-k1-brands.test.ts, tests/audit-m1-lok07-03-presets.test.ts, tests/locations-audit.test.tsx +4 |
| LOCATION_PRESETS (4) | lib/equipment.ts | tests/audit-0.10-gen.test.ts, tests/gen-general.test.ts, tests/matrix-dim-equipment.test.tsx +2 |
| View: side \| front | lib/figures/geom.ts | tests/figures.test.tsx |
| FrameName: start \| mid \| end | lib/figures/geom.ts | tests/audit-0.10-live.test.tsx, tests/audit-final2-fg.test.tsx, tests/figures.test.tsx |
| Role: body \| far \| load \| fixed \| pad \| cable | lib/figures/geom.ts | tests/audit-backlog-r75.test.tsx, tests/audit-r82.test.tsx, tests/figures.test.tsx |
| Goal: strength \| hypertrophy \| cut \| general | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit011b.test.tsx |
| GOALS (4) | lib/generator.ts | tests/gen-general.test.ts, tests/matrix-invariants.test.ts |
| GEN_MINUTES (3) | lib/generator.ts | tests/audit-0.10-gen.test.ts, tests/gen-general.test.ts, tests/matrix-invariants.test.ts +1 |
| HELP_EQUIP (4) | lib/generator.ts | tests/audit-0.10-gen.test.ts |
| MAJOR (8) | lib/generator.ts | tests/audit-0.10-gen.test.ts, tests/gen-days.test.ts, tests/gen-general.test.ts +3 |
| SessionKey: fbw \| fbwA \| fbwB \| upA \| upB \| loA \| loB \| cardio | lib/generator.ts | tests/audit-0.10-data.test.ts, tests/gen-days-ui.test.tsx, tests/gen-days.test.ts |
| GuardDir: up \| same \| down \| unknown \| new \| none \| deload | lib/guard.ts | tests/access.test.ts, tests/adapt-logic.test.ts, tests/audit-0.10-live-logic.test.ts +2 |
| SkipReason: onlyNow \| onlyBefore \| noWeight \| unknownPlan | lib/guard.ts | tests/guard.test.ts |
| GUIDE (10) | lib/guide.ts | tests/backlog-0.10.1-dane.test.ts, tests/guide.test.tsx, tests/m3-p5d-settings-ui.test.tsx |
| BoardHaptic: step \| missing \| done | lib/haptics.ts | tests/audit-0.10-data.test.ts, tests/audit-r72-b.test.ts, tests/m3-p2-haptics.test.ts |
| HEALTH_READ_TYPES (4) | lib/healthRead.ts | tests/health-read.test.ts |
| WATCH_MATCH_TYPES (2) | lib/healthRead.ts | tests/health-read.test.ts |
| LANGS (35) | lib/i18n.ts | tests/asc-metadane.test.ts, tests/audit-0.10-data.test.ts, tests/audit-0.10-lang-ui.test.tsx +72 |
| ES_419_REGIONS (24) | lib/i18n.ts | tests/i18n-variants.test.ts |
| ZH_HANT_REGIONS (3) | lib/i18n.ts | tests/i18n-wave4.test.ts |
| LB_REGIONS (3) | lib/i18n.ts | tests/audit-0.10-tst.test.ts |
| IMPERIAL_SYSTEMS (2) | lib/i18n.ts | tests/asc-metadane.test.ts, tests/audit-m1-lok07-02-default-system.test.ts |
| LOCALE_UPPER (2) | lib/i18n.ts | tests/audit-0.10-lang.test.ts |
| INTRO_MODES (2) | lib/intro.ts | tests/intro.test.tsx |
| LICENSES (619) | lib/licenses.generated.ts | tests/audit-0.10-data-ui.test.tsx, tests/licenses-native.test.tsx |
| NATIVE_LICENSES (7) | lib/licenses.generated.ts | tests/licenses-native.test.tsx |
| CAPPED_IMPLS (2) | lib/loadcap.ts | tests/audit-k1-bl-mer.test.tsx |
| LoadUnit: kg \| lb | lib/loads.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-gen-ui.test.tsx |
| SpecProblem: list_too_long \| plates_too_many_rows \| plates_too_many_combos \| range_invalid \| range_too_many | lib/loads.ts | tests/audit-0.10-tst.test.ts, tests/locations-audit.test.tsx |
| ONE_OFF_PRESETS (3) | lib/locations.ts | tests/matrix-invariants.test.ts, tests/places-oneoff-logic.test.ts |
| LOAD_ORDER (4) | lib/motif.ts | tests/motyw-miesiac.test.tsx, tests/motyw.test.tsx |
| ICON_PLATES (4) | lib/motif.ts | tests/intro.test.tsx, tests/motyw.test.tsx |
| DAY_MARKS (4) | lib/motif.ts | tests/matrix-a11y.test.tsx, tests/motyw.test.tsx |
| MONTH_WEEK_STATES (3) | lib/motif.ts | tests/motyw-miesiac.test.tsx |
| View: front \| back | lib/musclemap.ts | tests/figures.test.tsx, tests/muscle-map.test.tsx |
| PARTS (18) | lib/musclemap.ts | tests/muscle-map.test.tsx, tests/trening-naglowek.test.tsx |
| SHADE_MIX (5) | lib/musclemap.ts | tests/muscle-map.test.tsx |
| PeriodKind: week \| month | lib/period.ts | tests/audit-0.10-stats.test.ts, tests/audit-m1-032-total-bars.test.tsx |
| DayStatus: done \| other \| planned \| missed \| rest | lib/plan.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-plan.test.ts |
| LEGACY_REMINDER_IDS (1) | lib/planReminder.ts | tests/rm-signing.test.tsx |
| ReminderPermission: granted \| denied \| undetermined | lib/planReminder.ts | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts |
| PLAN_ORDER (3) | lib/products.ts | tests/store-adapter.test.ts |
| SUBSCRIPTION_PLANS (2) | lib/products.ts | tests/store-adapter.test.ts |
| CmpKind: week \| prevWeek \| month | lib/progress.ts | tests/audit-0.10-stats.test.ts, tests/audit-m1-032-total-bars.test.tsx |
| ReviewRunResult: asked \| unavailable \| error | lib/review-run.ts | tests/audit-0.10-live-logic.test.ts, tests/health-query.test.ts, tests/review-run.test.tsx |
| REVIEW_BLOCK_REASONS (10) | lib/review.ts | tests/review.test.ts |
| IDEA_BLOCK_REASONS (3) | lib/review.ts | tests/idea-request.test.tsx |
| MODULES (6) | lib/seed.ts | tests/matrix-data-shared.ts |
| METRICS (6) | lib/seed.ts | tests/matrix-dim-metrics.test.tsx, tests/matrix-invariants.test.ts, tests/matrix-shared.tsx +1 |
| MUSCLES (12) | lib/seed.ts | tests/guard.test.ts, tests/logic.test.ts, tests/matrix-dim-catalog.test.tsx +7 |
| SET_KINDS (4) | lib/seed.ts | tests/matrix-dim-metrics.test.tsx |
| LoadMode: per_dumbbell \| total \| unilateral | lib/seed.ts | tests/audit-final-timer.test.tsx, tests/audit-k1-data.test.ts, tests/audit-r72-c.test.ts |
| SessionMode: solo \| remote \| in_gym | lib/seed.ts | tests/audit-0.10-tst.test.ts |
| Equipment: hantle \| sztanga \| masa ciała \| maszyna \| linki \| inne | lib/seed.ts | tests/adapt-logic.test.ts, tests/audit-0.10-stats.test.ts, tests/audit-k1-bl-mer.test.tsx +3 |
| GROUPS (11) | lib/seed.ts | tests/logic.test.ts, tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx +3 |
| IMPLS (8) | lib/seed.ts | tests/matrix-karta.test.tsx |
| ThemeSetting: light \| dark \| auto | lib/seed.ts | tests/adapt-ui.test.tsx, tests/audit-r72-c.test.ts |
| WORKOUT_VIEWS (2) | lib/seed.ts | tests/matrix-tuleja.test.tsx |
| LIB_MUSCLE_FIXES (2) | lib/seed.ts | tests/catalog-v2.test.ts |
| LIB (2) | lib/seed.ts | tests/audit-0.10-stats.test.ts, tests/catalog-library25.test.tsx, tests/catalog-v2.test.ts +6 |
| CFG_KEYS (11) | lib/state/core.ts | tests/audit-0.10-tst.test.ts |
| TotalKind: objętość treningu \| suma powtórzeń \| łączny czas \| łączny dystans | lib/stats.ts | tests/audit-final-stats.test.ts, tests/audit-records-logic.test.ts |
| ChartKey: total \| maxLoad \| bestE1rm \| volume \| maxReps \| maxDuration \| maxDistance | lib/stats.ts | tests/audit-0.10-data.test.ts, tests/audit-final-timer.test.tsx, tests/audit-m1-032-total-bars.test.tsx +2 |
| E2E_START_ENTITLEMENTS (1) | lib/store-adapter.ts | tests/entitlement.test.ts |
| SupportKind: feedback \| idea | lib/support.ts | tests/idea-request.test.tsx |
| SwapReason: pattern \| muscle \| firstMuscle \| group \| secondary \| swapped \| history | lib/swap.ts | tests/access.test.ts, tests/audit-0.10-tst.test.ts, tests/audit-k1-catalog-step.test.ts +2 |
| StaleKind: work \| warmup \| none | lib/timer.ts | tests/adapt-logic.test.ts, tests/audit-0.10-live-logic.test.ts, tests/audit-stale-ui.test.tsx |
| PaletteKey: bg \| surface \| surface2 \| line \| ctrlLine \| text \| muted \| accent \| accentInk \| done \| doneLine \| danger \| dangerInk \| band \| less \| board \| boardEdge \| boardText \| boardMuted \| boardField \| now \| motifBar \| motif25 \| motif20 \| motif15 \| motif10 | lib/tokens.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-tst-ui.test.tsx +5 |
| TypeRole: largeTitle \| navTitle \| sectionTitle \| body \| bodyStrong \| callout \| footnote \| caption \| button \| buttonPrimary \| boardName \| boardMeta \| boardNumber \| boardClock \| boardField \| boardNext \| stepLabel \| stat | lib/tokens.ts | tests/adapt-ui.test.tsx, tests/figures.test.tsx, tests/health-world.ts +1 |
| HAPTICS (7) | lib/tokens.ts | tests/m3-p2-haptics.test.ts, tests/m3-p5d-haptics-done.test.tsx, tests/m3-theme.test.ts |
| Unit: kg \| lb | lib/units.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-gen-ui.test.tsx |
| VoiceMode: speak \| announce \| silent | lib/voice.ts | tests/voice-native.test.ts, tests/voice.test.ts |
| VOICE_REASONS (7) | lib/voice.ts | tests/audit-close-c.test.tsx, tests/audit-m1-027-voice-default.test.ts, tests/voice.test.ts |
| VOICE_SETTINGS (3) | lib/voice.ts | tests/voice.test.ts |
| CLIENT_SCREENS (7) | lib/watch/client.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-live.test.tsx, tests/audit-close-c.test.tsx +2 |
| CLIENT_ACTIONS (4) | lib/watch/client.ts | tests/adapt-logic.test.ts, tests/audit-0.10-data.test.ts, tests/audit-m1b-028-watch-ack.test.ts +1 |
| HealthWriter: watch \| phone \| wait | lib/watch/health.ts | tests/audit-m1-009-watch-edit.test.ts, tests/watch-fixtures.test.ts, tests/watch-health.test.ts |
| WATCH_LABEL_IDS (15) | lib/watch/labels.ts | tests/watch-apple-contract.test.ts, tests/watch-apple-i18n.test.ts, tests/watch-protocol.test.ts |
| WATCH_CLIENTS (2) | lib/watch/protocol.ts | tests/watch-apple-contract.test.ts, tests/watch-protocol.test.ts |
| WATCH_PHASES (4) | lib/watch/protocol.ts | tests/watch-apple-contract.test.ts, tests/watch-protocol.test.ts |
| WATCH_EVENT_TYPES (7) | lib/watch/protocol.ts | tests/watch-apple-contract.test.ts, tests/watch-apply.test.ts, tests/watch-invariants.test.ts +1 |
| WATCH_ACK_STATUSES (4) | lib/watch/protocol.ts | tests/watch-protocol.test.ts |
| WATCH_REASONS (11) | lib/watch/protocol.ts | tests/watch-protocol.test.ts |
| WATCH_SESSION_ACTIONS (2) | lib/watch/protocol.ts | tests/watch-apple-contract.test.ts, tests/watch-protocol.test.ts |
| WATCH_MSG_KINDS (6) | lib/watch/protocol.ts | tests/watch-protocol.test.ts |
| TestWatchEvent: done \| differ \| skip | lib/watch/test-mode.ts | tests/adapt-logic.test.ts, tests/audit-0.10-data.test.ts, tests/audit-m1b-028-watch-ack.test.ts |
| APPLE_ONLY_LABEL_IDS (1) | lib/watchLabels.ts | tests/watch-apple-i18n.test.ts |
| WATCH_LABEL_KEYS (2) | lib/watchLabels.ts | tests/watch-apple-i18n.test.ts |
| LANGS_012 (9) | lib/whatsnew.ts | tests/release-0.12.test.tsx |
| WHATS_NEW (12) | lib/whatsnew.ts | tests/audit011b.test.tsx, tests/backlog-0.10.1-dane.test.ts, tests/guide.test.tsx +12 |
