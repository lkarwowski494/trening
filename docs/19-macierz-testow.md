# 19. Macierz testów (generowana)

Plik generuje `node scripts/test-matrix.mjs --write` z kodu i testów — nie edytuj ręcznie. `npm run verify` uruchamia `--check`:
nowy ekran, przycisk, pole, funkcja albo wartość wymiaru bez testu blokuje commit (polecenie właściciela 06.10.2026).
Wyjątki tylko z powodem w `tests/matrix-exceptions.json`. Pokrycie liczy się tylko z kodu testu (bez komentarzy, tytułów testów
i importów; Maestro bez komentarzy): UI/TEKST — tekst w literale testu, LOGIKA — funkcja użyta w kodzie, WYMIAR (z kodu lib/: tablice stałych
i typy-unie) — pętla po stałej albo każda wartość w teście. To warunek konieczny, nie dowód — przepływy i logikę sprawdzają testy
scenariuszowe (docs/09, sekcja „Macierz testów”).

| Rodzaj | Pozycji | Z testem | Wyjątki |
|---|---|---|---|
| EKRAN | 26 | 26 | 0 |
| UI | 294 | 294 | 0 |
| TEKST | 782 | 782 | 0 |
| LOGIKA | 637 | 637 | 0 |
| WYMIAR | 68 | 68 | 0 |

## EKRAN

| Pozycja | Źródło | Testy (pierwsze 3) |
|---|---|---|
| /exercises | app/(tabs)/exercises.tsx | tests/a11y-routes.ts, tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-tst-ui.test.tsx +18 |
| /history | app/(tabs)/history.tsx | tests/a11y-routes.ts, tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx +43 |
| / | app/(tabs)/index.tsx | tests/a11y-routes.ts, tests/app.tsx, tests/audit-0.10-data-ui.test.tsx +138 |
| /more | app/(tabs)/more.tsx | tests/a11y-routes.ts, tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-gen-ui.test.tsx +60 |
| /templates | app/(tabs)/templates.tsx | tests/a11y-routes.ts, tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-gen-ui.test.tsx +22 |
| /exercise | app/exercise/[id].tsx | tests/a11y-routes.ts, tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-stats-ui.test.tsx +20 |
| /generator | app/generator.tsx | tests/a11y-routes.ts, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx +12 |
| /guide | app/guide.tsx | tests/a11y-routes.ts, tests/guide.test.tsx, tests/matrix-dim-langs-routes.test.tsx |
| /history | app/history/[id].tsx | tests/a11y-routes.ts, tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx +43 |
| /history/add | app/history/add.tsx | tests/a11y-routes.ts, tests/audit-0.10-tst-ui.test.tsx, tests/audit-0.10-ui.test.tsx +5 |
| /history/edit | app/history/edit/[id].tsx | tests/a11y-routes.ts, tests/audit-0.10-stats-ui.test.tsx, tests/audit-0.10-ui.test.tsx +7 |
| /more/about | app/more/about.tsx | tests/a11y-routes.ts, tests/matrix-dim-langs-routes.test.tsx |
| /more/backup | app/more/backup.tsx | tests/a11y-routes.ts, tests/audit-io-more.test.tsx, tests/audit-r83.test.tsx +11 |
| /more/bands | app/more/bands.tsx | tests/a11y-routes.ts, tests/audit-0.10-stats-ui.test.tsx, tests/audit-0.10-ui.test.tsx +14 |
| /more/bodymass | app/more/bodymass.tsx | tests/a11y-routes.ts, tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-stats-ui.test.tsx +3 |
| /more/language | app/more/language.tsx | tests/a11y-routes.ts, tests/audit-0.10-lang-ui.test.tsx, tests/matrix-dim-langs-routes.test.tsx +6 |
| /more/licenses | app/more/licenses.tsx | tests/a11y-routes.ts, tests/licenses-native.test.tsx, tests/matrix-dim-langs-routes.test.tsx |
| /more/location | app/more/location/[id].tsx | tests/a11y-routes.ts, tests/audit-0.10-ui.test.tsx, tests/audit-r82c.test.tsx +10 |
| /more/locations | app/more/locations.tsx | tests/a11y-routes.ts, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-ui.test.tsx +12 |
| /more/progress | app/more/progress.tsx | tests/a11y-routes.ts, tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx +27 |
| /more/settings | app/more/settings.tsx | tests/a11y-routes.ts, tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx +30 |
| /picker | app/picker.tsx | tests/a11y-routes.ts, tests/audit-0.10-lang-ui.test.tsx, tests/audit-k1-fala2b.test.tsx +13 |
| /plan | app/plan.tsx | tests/a11y-routes.ts, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx +15 |
| /reorder | app/reorder.tsx | tests/a11y-routes.ts, tests/audit-0.10-stats-ui.test.tsx, tests/matrix-dim-langs-routes.test.tsx +1 |
| /swap | app/swap.tsx | tests/a11y-routes.ts, tests/audit-0.10-lang-ui.test.tsx, tests/matrix-dim-langs-routes.test.tsx +2 |
| /template | app/template/[id].tsx | tests/a11y-routes.ts, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx +33 |

## UI

| Pozycja | Źródło | Testy (pierwsze 3) |
|---|---|---|
| {label}: {v}, poprzedni tydzień {p} | components/Dashboard.tsx | tests/dashboard.test.tsx, tests/maestro-selectors.test.ts, tests/motyw.test.tsx |
| {label}: {v}, poprzednio {p} | components/PeriodSummary.tsx | tests/period-summary.test.tsx |
| {n} min | app/generator.tsx | tests/app.tsx, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts +40 |
| {n} z {all} | components/DragList.tsx | (tylko parametry — pokrycie przez test ekranu) |
| ↑ przy ćwiczeniu, gdy ostatnio wszystkie serie były na górze zakresu powtórzeń | app/more/settings.tsx | tests/matrix-ui.test.tsx |
| ↺ cofnij | components/ActiveWorkout.tsx | tests/audit-0.10-tst-ui.test.tsx, tests/audit-0.10-tst.test.ts |
| ↺ przywróć: {name} | app/swap.tsx | tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx, tests/swap-history.test.tsx |
| ⇄ zamień | app/history/edit/[id].tsx | tests/guide.test.tsx |
| + Dodaj ćwiczenie | app/history/edit/[id].tsx | tests/audit-0.10-live.test.tsx, tests/audit-prephone.test.tsx, tests/audit-r82.test.tsx +13 |
| + Dodaj miejsce | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/locations-ui.test.tsx +7 |
| + Dodaj trening wstecz | app/(tabs)/history.tsx | tests/edit-history.test.tsx, tests/guide.test.tsx, tests/integration-090.test.tsx +5 |
| + drop set | app/history/edit/[id].tsx | tests/matrix-i18n.test.tsx, tests/scenario-full.test.tsx, tests/set-kinds-visible.test.tsx +2 |
| + Guma | app/more/bands.tsx | tests/audit-r83.test.tsx, tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx +5 |
| + Nowe | app/(tabs)/exercises.tsx | tests/edit-on-demand.test.tsx, tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx +4 |
| + Nowy | app/(tabs)/templates.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/audit-k1-fala2b.test.tsx +14 |
| + Nowy folder | app/template/[id].tsx | tests/b2-plan-own-templates.test.tsx, tests/edit-on-demand.test.tsx, tests/template-folders.test.tsx |
| + Nowy plan | app/plan.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/guide.test.tsx +3 |
| + Nowy szablon | app/plan.tsx | tests/audit-0.10-ui.test.tsx, tests/b2-plan-own-templates.test.tsx, tests/flows.test.tsx +6 |
| + rozgrzewka | app/history/edit/[id].tsx | tests/scenario-full.test.tsx, tests/set-kinds-visible.test.tsx, tests/template-rows.test.tsx |
| + seria | app/history/edit/[id].tsx | tests/audit-0.10-live.test.tsx, tests/audit-close2-b.test.tsx, tests/audit-journey-c.test.tsx +6 |
| + talerz | components/LoadEditor.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/locations-ui.test.tsx +2 |
| + zakres powtórzeń | app/template/[id].tsx | tests/audit-0.10-tst-ui.test.tsx, tests/scenario-full.test.tsx, tests/template-rows.test.tsx |
| ≡ Kolejność | app/template/[id].tsx | tests/audit-0.10-live.test.tsx, tests/edit-on-demand.test.tsx, tests/matrix-ui.test.tsx +1 |
| Anuluj | app/(tabs)/index.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-live.test.tsx, tests/audit-0.10-ui.test.tsx +20 |
| Archiwizuj | app/template/[id].tsx | tests/audit-0.10-plan-ui.test.tsx, tests/edit-on-demand.test.tsx, tests/guide.test.tsx +1 |
| Archiwum ({n}) | app/(tabs)/templates.tsx | tests/audit-0.10-ui.test.tsx, tests/template-folders.test.tsx |
| Asysta gumą | app/exercise/[id].tsx | tests/scenario-full.test.tsx |
| Automatyczna kopia po każdym treningu | app/more/settings.tsx | tests/guide.test.tsx, tests/phone-p1.test.tsx, tests/scenario-full.test.tsx |
| bez folderu | app/template/[id].tsx | tests/template-folders.test.tsx |
| Bez ograniczeń sprzętu | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/gen-days-ui.test.tsx, tests/generator-ui.test.tsx |
| Brak sprzętu w: {l}. Brakuje: {m} | components/ActiveWorkout.tsx | tests/scenario-full.test.tsx |
| Cel | app/generator.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/generator-ui.test.tsx |
| cel s | app/template/[id].tsx | tests/scenario-full.test.tsx |
| co | components/LoadEditor.tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/audit-0.10-gen-ui.test.tsx +77 |
| Co logujesz w serii | app/exercise/[id].tsx | tests/edit-on-demand.test.tsx, tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx +3 |
| Cofnij | components/ActiveWorkout.tsx | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx +1 |
| Cofnij zamianę: {name} | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx, tests/swap-ui.test.tsx |
| czas | app/history/edit/[id].tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-live.test.tsx, tests/edit-history.test.tsx +12 |
| Czas | components/Dashboard.tsx | tests/dashboard.test.tsx, tests/edit-history.test.tsx, tests/generator-ui.test.tsx +4 |
| Czas sesji | app/generator.tsx | tests/generator-ui.test.tsx |
| Czas trwania (min) | components/WhenFields.tsx | tests/edit-history.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Data (RRRR-MM-DD) | components/WhenFields.tsx | tests/edit-history.test.tsx, tests/integration-090.test.tsx, tests/matrix-ui.test.tsx +1 |
| Data pomiaru (RRRR-MM-DD) | app/more/bodymass.tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-stats-ui.test.tsx, tests/ux2-11-bodymass-se.test.tsx |
| Dawne nazwy w bibliotece | app/exercise/[id].tsx | tests/audit-k1-fala2b.test.tsx |
| Dni treningowe w tygodniu | components/OwnPlan.tsx | tests/gen-days-ui.test.tsx, tests/generator-ui.test.tsx, tests/plan-own-templates-ui.test.tsx |
| do | app/template/[id].tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/audit-0.10-gen-ui.test.tsx +106 |
| Do upadku (F) | app/template/[id].tsx | tests/scenario-full.test.tsx |
| dodaj ciężar | components/LoadEditor.tsx | tests/audit-0.10-ui.test.tsx, tests/locations-ui.test.tsx, tests/matrix-ui.test.tsx +1 |
| Dodaj ćwiczenia | components/Dashboard.tsx | tests/first-steps-empty.test.tsx |
| Dodaj ćwiczenia do szablonu „{name}”. | components/Dashboard.tsx | tests/first-steps-empty.test.tsx |
| Dodaj notatkę | components/ActiveWorkout.tsx | tests/scenario-full.test.tsx |
| domyślna {s} | app/exercise/[id].tsx | tests/audit-0.10-tst-ui.test.tsx |
| Domyślna przerwa (sekundy) | app/more/settings.tsx | tests/scenario-full.test.tsx |
| Drop set (D) | app/template/[id].tsx | tests/matrix-i18n.test.tsx, tests/scenario-full.test.tsx |
| Duplikuj | app/more/location/[id].tsx | tests/audit-k1-fala2b.test.tsx, tests/edit-on-demand.test.tsx, tests/flows.test.tsx +3 |
| dystans | app/history/edit/[id].tsx | tests/catalog-library25.test.tsx, tests/logic.test.ts, tests/matrix-invariants.test.ts +3 |
| Dzień później | components/WhenFields.tsx | tests/scenario-full.test.tsx |
| Dzień wcześniej | components/WhenFields.tsx | tests/edit-history.test.tsx, tests/scenario-full.test.tsx |
| Dźwięk i wibracja na koniec przerwy | app/more/settings.tsx | tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx, tests/matrix-dim-langs3.test.tsx +4 |
| Edytuj | app/exercise/[id].tsx | tests/app.tsx, tests/audit-0.10-plan-ui.test.tsx, tests/audit-k1-fala2b.test.tsx +10 |
| Edytuj ćwiczenie | app/exercise/[id].tsx | tests/app.tsx, tests/edit-on-demand.test.tsx, tests/scenario-full.test.tsx |
| Edytuj notatkę | components/ActiveWorkout.tsx | tests/scenario-full.test.tsx |
| Edytuj sesję | app/history/[id].tsx | tests/audit-0.10-plan-ui.test.tsx, tests/scenario-full.test.tsx |
| Edytuj szablon | app/template/[id].tsx | tests/app.tsx, tests/audit-k1-fala2b.test.tsx, tests/edit-on-demand.test.tsx |
| Ekran włączony podczas treningu | app/more/settings.tsx | tests/phone-p1.test.tsx, tests/regress.test.tsx, tests/scenario-full.test.tsx |
| Eksportuj backup (plik JSON) | app/more/backup.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Eksportuj historię do CSV | app/more/backup.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Folder | app/template/[id].tsx | tests/edit-on-demand.test.tsx, tests/matrix-i18n.test.tsx, tests/template-folders.test.tsx +1 |
| główne | app/template/[id].tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/audit-k1-bl-mer.test.tsx +16 |
| Godzina startu | components/WhenFields.tsx | tests/backlog-0.10.1-dane-ui.test.tsx, tests/edit-history.test.tsx, tests/matrix-ui.test.tsx +1 |
| Gotowe | app/reorder.tsx | tests/matrix-ui.test.tsx, tests/reorder-t010.test.tsx, tests/scenario-full.test.tsx |
| Guma: {b} | app/history/edit/[id].tsx | tests/audit-journey-a.test.tsx, tests/audit-journey-c.test.tsx, tests/audit-r83.test.tsx +6 |
| Gumy… | app/more/location/[id].tsx | tests/matrix-i18n.test.tsx, tests/scenario-full.test.tsx, tests/ui2-09-leftovers.test.tsx |
| Importuj | app/more/backup.tsx | tests/audit-io-more.test.tsx, tests/audit-r83.test.tsx, tests/audit-r83b.test.tsx +3 |
| Importuj backup | app/more/backup.tsx | tests/audit-io-more.test.tsx, tests/audit-r83.test.tsx, tests/audit-r83b.test.tsx +3 |
| Inny przyrząd: {impl} | app/swap.tsx | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx +1 |
| Inny trening | components/StartPanel.tsx | tests/app.tsx, tests/audit-0.10-live.test.tsx, tests/audit-0.10-plan-ui.test.tsx +7 |
| Inny z planu | components/StartPanel.tsx | tests/home-b.test.tsx |
| Inny z planu: {name} | components/StartPanel.tsx | tests/home-b.test.tsx |
| Jak liczyć ciężar w objętości | app/exercise/[id].tsx | tests/scenario-full.test.tsx |
| jak robocza | app/exercise/[id].tsx | tests/edit-on-demand.test.tsx, tests/matrix-ui.test.tsx |
| Jak to działa | components/Dashboard.tsx | tests/audit-0.10-ui.test.tsx |
| Jednostka ciężaru | app/more/settings.tsx | tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx, tests/matrix-dim-langs3.test.tsx +3 |
| Język | app/more/settings.tsx | tests/audit-io-flows.test.tsx, tests/audit-io-more.test.tsx, tests/flows.test.tsx +4 |
| kolor | components/BandColorInput.tsx | tests/whats-new.test.tsx |
| Kolor gumy | app/more/bands.tsx | tests/audit-0.10-ui.test.tsx, tests/owner-0510c.test.tsx, tests/regress.test.tsx +1 |
| Kontynuuj | components/ActiveWorkout.tsx | tests/audit-close2-a.test.tsx, tests/audit-journey-b.test.tsx, tests/audit-r72-ui.test.tsx +4 |
| Kopia zapasowa (eksport / import) | app/(tabs)/more.tsx | tests/audit-0.10-ui.test.tsx, tests/scenario-full.test.tsx |
| krok | components/LoadEditor.tsx | tests/audit-0.10-ui.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/backlog-0.10.1-dane.test.ts +12 |
| Licencje open source | app/more/about.tsx | tests/audit-0.10-data-ui.test.tsx |
| Masa ciała | app/more/settings.tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-stats-ui.test.tsx, tests/audit-k1-fala2b.test.tsx +3 |
| Masa ciała — pomiary | app/more/progress.tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-k1-fala2b.test.tsx |
| Masa ciała ({u}) | app/more/bodymass.tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-stats-ui.test.tsx, tests/ux2-11-bodymass-se.test.tsx |
| max na stronę | components/LoadEditor.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Miejsca i sprzęt | app/(tabs)/more.tsx | tests/audit-0.10-ui.test.tsx, tests/guide.test.tsx, tests/locations-ui.test.tsx +6 |
| Miejsce | app/generator.tsx | tests/locations-model.test.ts, tests/locations-ui.test.tsx, tests/matrix-logic.test.tsx +2 |
| Miejsce domyślne | app/template/[id].tsx | tests/locations-ui.test.tsx, tests/scenario-full.test.tsx |
| Miejsce treningu: {l} | components/ActiveWorkout.tsx | tests/locations-ui.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Miesiąc | components/PeriodSummary.tsx | tests/deload-week.test.tsx, tests/motyw-miesiac.test.tsx, tests/period-summary.test.tsx |
| min na stronę | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Mój plan | app/plan.tsx | tests/audit-0.10-plan.test.ts, tests/mutation-plan.test.ts, tests/plan-own-templates-ui.test.tsx +2 |
| Na każdą stronę: {p} | components/PlateBar.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-tst-ui.test.tsx, tests/karta-sprzet.test.tsx +3 |
| Nazwa | app/exercise/[id].tsx | tests/audit-0.10-plan-ui.test.tsx, tests/b2-plan-own-templates.test.tsx, tests/edit-on-demand.test.tsx +7 |
| Nazwa planu | app/plan.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/plans-multi-ui.test.tsx, tests/ui2-08-saved-plan-title.test.tsx |
| Nie | app/more/backup.tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx +35 |
| Nie teraz | components/DeloadHint.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts, tests/maestro-selectors.test.ts +1 |
| Nie udało się zapisać danych | app/(tabs)/index.tsx | tests/matrix-ui.test.tsx, tests/regress.test.tsx |
| Nie zamieniaj: {name} | components/ActiveWorkout.tsx | tests/scenario-full.test.tsx, tests/swap-alternates.test.tsx |
| Notatka | app/template/[id].tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/edit-history.test.tsx +2 |
| Notatka do treningu | app/history/edit/[id].tsx | tests/edit-history.test.tsx, tests/scenario-full.test.tsx |
| Notatki techniczne | app/exercise/[id].tsx | tests/edit-on-demand.test.tsx, tests/scenario-full.test.tsx |
| Nowe szablony i plan | app/generator.tsx | tests/audit-k1-bl-mer.test.tsx, tests/matrix-i18n.test.tsx, tests/plan-own-templates-ui.test.tsx |
| np. samopoczucie, ból, sprzęt | app/history/edit/[id].tsx | tests/matrix-ui.test.tsx |
| O aplikacji | app/(tabs)/more.tsx | tests/audit-0.10-data-ui.test.tsx |
| Obciążenie partii (z katalogu) | app/exercise/[id].tsx | tests/catalog-v2.test.ts |
| od | components/LoadEditor.tsx | tests/a11y-routes.ts, tests/app.tsx, tests/audit-0.10-data-ui.test.tsx +135 |
| Odhacz bez pomiaru | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/matrix-tuleja.test.tsx |
| Odhacz bez pomiaru: {ex}, seria {n} | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx |
| Odrzuć | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-ui.test.tsx, tests/audit-close2-a.test.tsx +10 |
| Odrzuć trening | app/history/edit/[id].tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-ui.test.tsx, tests/edit-history.test.tsx +5 |
| Odrzuć zmiany | app/_layout.tsx | tests/audit-k1-fala2b.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx, tests/edit-history.test.tsx +4 |
| OK | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/maestro-runner.ts, tests/matrix-i18n.test.tsx +4 |
| opcjonalne pole, nie wpływa na objętość | app/more/settings.tsx | tests/matrix-ui.test.tsx |
| Otwórz Ustawienia iOS | app/more/settings.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/matrix-ui.test.tsx |
| Partia | app/exercise/[id].tsx | tests/audit-k1-fala2b.test.tsx, tests/edit-on-demand.test.tsx, tests/matrix-i18n.test.tsx +2 |
| Partie główne (1 seria) | app/exercise/[id].tsx | tests/edit-on-demand.test.tsx, tests/matrix-ui.test.tsx |
| Partie pomocnicze (0,5 serii) | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| Plan tygodnia | app/(tabs)/history.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/generator-ui.test.tsx +6 |
| Plan z moich szablonów | app/generator.tsx | tests/first-steps-empty.test.tsx, tests/home-b.test.tsx, tests/matrix-i18n.test.tsx +3 |
| Plan: {name} · {n} {d} · następny: {next} | components/PlanningCard.tsx | tests/home-b.test.tsx |
| Pliki → Na moim iPhonie → {app} → Backup, ostatnie {n} | app/more/settings.tsx | tests/xcheck-0610.test.tsx |
| Podpowiedź progresji | app/more/settings.tsx | tests/matrix-ui.test.tsx, tests/phone-p1.test.tsx, tests/scenario-full.test.tsx |
| Pokaż | app/guide.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx +11 |
| Pokaż szablony | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/ui2-06-gen-back-to-plan.test.tsx |
| Pokaż więcej ({n}) | app/swap.tsx | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| Pokaż więcej ćwiczeń: zostało {n} | app/swap.tsx | tests/catalog-full.test.tsx, tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| Pokaż wszystkie | app/(tabs)/history.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/history-calendar.test.tsx |
| Pokaż wszystkie ({n}) | app/plan.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Pokaż: {name} | app/guide.tsx | tests/guide.test.tsx |
| Połącz z następnym w superset | app/template/[id].tsx | tests/flows.test.tsx, tests/guide.test.tsx, tests/scenario-full.test.tsx +1 |
| Pomiń | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/guide.test.tsx, tests/karta-sprzet.test.tsx +4 |
| Pomiń dziś | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/guide.test.tsx, tests/skip-today.test.tsx +2 |
| Pomiń dziś: {name} | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/skip-today.test.tsx |
| Ponów teraz | app/more/settings.tsx | tests/audit-0.10-data-ui.test.tsx |
| Poprzednich danych nie dało się odczytać | app/(tabs)/index.tsx | tests/audit-0.10-ui.test.tsx, tests/matrix-ui.test.tsx, tests/regress.test.tsx |
| Postęp treningu: {d} z {n} serii | components/ActiveWorkout.tsx | tests/audit-0.10-ui.test.tsx, tests/audit-backlog-r75.test.tsx, tests/scenario-full.test.tsx +1 |
| Postęp tygodnia: {p}% planu, zrobione {done} z {n} treningów z planu | components/WeekStacks.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/dashboard.test.tsx, tests/matrix-i18n.test.tsx +1 |
| Postępy | app/(tabs)/more.tsx | tests/audit-0.10-ui.test.tsx, tests/backlog-0.10.1-dane.test.ts, tests/edit-on-demand.test.tsx +7 |
| pow. od | app/template/[id].tsx | tests/audit-0.10-tst-ui.test.tsx |
| Powtórz ostatni | components/StartPanel.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-ui.test.tsx, tests/audit-close2-b.test.tsx +6 |
| Powtórz ostatni ({name}) | components/StartPanel.tsx | tests/audit-0.10-ui.test.tsx, tests/audit-close2-b.test.tsx, tests/b2-plan-own-templates.test.tsx +4 |
| Powtórzenia | app/history/edit/[id].tsx | tests/audit-0.10-ui.test.tsx, tests/audit-close2-b.test.tsx, tests/audit-journey-a.test.tsx +6 |
| Poziom (1–7) | app/more/bands.tsx | tests/phone-p1.test.tsx, tests/regress.test.tsx, tests/scenario-full.test.tsx |
| Propozycja {n}: {name} | app/swap.tsx | tests/generator-ui.test.tsx, tests/matrix-logic.test.tsx, tests/plan-own-templates-ui.test.tsx +4 |
| Przerwa po rozgrzewce | app/exercise/[id].tsx | tests/scenario-full.test.tsx |
| Przerwa po rozgrzewce (s) | app/exercise/[id].tsx | tests/scenario-full.test.tsx |
| Przerwa robocza | app/exercise/[id].tsx | tests/edit-on-demand.test.tsx, tests/scenario-full.test.tsx |
| Przerwa robocza (s) | app/exercise/[id].tsx | tests/scenario-full.test.tsx |
| przerwa s | app/template/[id].tsx | tests/regress.test.tsx, tests/scenario-full.test.tsx |
| Przerwa zamiennika (s): {name} | app/template/[id].tsx | tests/swap-alternates.test.tsx |
| Przerwa: {s} | components/ActiveWorkout.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/regress.test.tsx +1 |
| Przesuń albo pomiń | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/guide.test.tsx +2 |
| Przewodnik | app/(tabs)/more.tsx | tests/edit-on-demand.test.tsx, tests/guide.test.tsx |
| Przewodnik po funkcjach | components/Dashboard.tsx | tests/guide.test.tsx |
| Przewodnik: {name} | components/Dashboard.tsx | tests/edit-on-demand.test.tsx |
| Przypomnienie o treningu z planu | app/more/settings.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts, tests/backlog-0.10.1-dane-ui.test.tsx +2 |
| Przywróć | components/ActiveWorkout.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/backlog-0410.test.tsx +8 |
| Przywróć „{name}” | app/(tabs)/exercises.tsx | tests/audit-k1-fala2b.test.tsx, tests/backlog-0410.test.tsx, tests/matrix-logic.test.tsx +2 |
| Przywróć ćwiczenie: {name} | app/swap.tsx | tests/skip-today.test.tsx |
| Przywróć z planu | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/plan-calendar-ui.test.tsx, tests/plan-own-templates-ui.test.tsx |
| Puste szablony: {n} | components/Dashboard.tsx | tests/first-steps-empty.test.tsx |
| Pusty trening | app/history/add.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-ui.test.tsx, tests/audit-r82.test.tsx +13 |
| rano o {h}:00 w dniu zaplanowanego treningu | app/more/settings.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/plan-reminder.test.tsx |
| Rekord: {list} | components/ActiveWorkout.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/matrix-i18n.test.tsx |
| Rozgrzewka (W) | app/template/[id].tsx | tests/scenario-full.test.tsx |
| RPE / RIR przy serii | app/more/settings.tsx | tests/flows.test.tsx, tests/matrix-ui.test.tsx, tests/phone-p1.test.tsx +1 |
| Seria {n} zrobiona — {ex} | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/audit-close2-a.test.tsx, tests/audit-close2-b.test.tsx +15 |
| Seria {n}, typ: {k} | app/history/edit/[id].tsx | tests/audit-0.10-lang-ui.test.tsx, tests/audit-close2-b.test.tsx, tests/audit-journey-c.test.tsx +5 |
| Seria normalna | app/template/[id].tsx | tests/scenario-full.test.tsx |
| Seria zrobiona: {ex}, seria {n} | components/ActiveWorkout.tsx | tests/maestro-selectors.test.ts, tests/tuleja.test.tsx |
| Serie | components/Dashboard.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/dashboard.test.tsx, tests/edit-history.test.tsx +7 |
| Sesja {d}: {s} | app/exercise/[id].tsx | tests/audit-k1-fala2b.test.tsx, tests/edit-on-demand.test.tsx, tests/scenario-full.test.tsx |
| Skala wysiłku | app/more/settings.tsx | tests/effort-scale.test.tsx, tests/whats-new.test.tsx |
| Skróć przerwę o 15 sekund | components/ActiveWorkout.tsx | tests/karta-sprzet.test.tsx, tests/scenario-full.test.tsx |
| Sprawdź zgodę na powiadomienia | app/more/settings.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Sprzęt | app/exercise/[id].tsx | tests/audit-0.10-tst.test.ts, tests/edit-on-demand.test.tsx |
| Start | app/(tabs)/index.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-tst.test.ts +57 |
| Start stopera: {ex}, seria {n} | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx |
| Start zaplanowanego treningu: {name} | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/deload-ui.test.tsx +2 |
| Start: {name} | app/(tabs)/index.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-ui.test.tsx, tests/audit-journey-a.test.tsx +21 |
| Szablony | components/OwnPlan.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx, tests/brand-tuleja.test.tsx +17 |
| sztuk | components/LoadEditor.tsx | tests/matrix-i18n.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Szukaj ćwiczenia… | app/more/progress.tsx | tests/audit-k1-fala2b.test.tsx, tests/audit-prephone.test.tsx, tests/audit-r82.test.tsx +17 |
| Szukaj… | app/(tabs)/exercises.tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/catalog-library25.test.tsx +5 |
| talerz ({u}) | components/LoadEditor.tsx | tests/scenario-full.test.tsx, tests/swipe-delete.test.tsx |
| Technika | components/ExerciseCues.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/audit-k1-bl-mer.test.tsx, tests/audit-k1-fala2b.test.tsx +4 |
| Technika: {name} | components/ExerciseCues.tsx | tests/audit-k1-fala2b.test.tsx |
| tekst na karcie „Dziś” i w Kalendarzu, gdy nie ma planu | app/more/settings.tsx | tests/regress.test.tsx |
| Tempo | app/exercise/[id].tsx | tests/matrix-i18n.test.tsx, tests/scenario-full.test.tsx |
| Tempo (opcjonalnie, np. 3-1-1) | app/exercise/[id].tsx | tests/scenario-full.test.tsx |
| Teraz: {v} | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/matrix-i18n.test.tsx, tests/matrix-tuleja.test.tsx +1 |
| Trening | app/history/edit/[id].tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-live.test.tsx +41 |
| Treningi | components/Dashboard.tsx | tests/audit-0.10-data-ui.test.tsx, tests/dashboard.test.tsx, tests/matrix-i18n.test.tsx +3 |
| Tydzień | components/PeriodSummary.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-live.test.tsx, tests/audit-0.10-plan-ui.test.tsx +5 |
| Tydzień deload | components/PeriodSummary.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-live.test.tsx, tests/audit-0.10-plan-ui.test.tsx +5 |
| Tylko ten raz | components/ActiveWorkout.tsx | tests/audit-0.10-ui.test.tsx |
| Tylko teraz | components/ActiveWorkout.tsx | tests/audit-0.10-ui.test.tsx, tests/regress.test.tsx, tests/scenario-full.test.tsx |
| Tylko zapisz | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/generator-ui.test.tsx, tests/plan-own-templates-ui.test.tsx +2 |
| Ukryj | app/(tabs)/history.tsx | tests/audit-0.10-ui.test.tsx, tests/owner-0510b.test.tsx, tests/regress.test.tsx |
| Ukryj komunikat | app/(tabs)/index.tsx | tests/audit-0.10-ui.test.tsx, tests/regress.test.tsx |
| Ukryj zachętę do planu tygodnia | app/(tabs)/history.tsx | tests/audit-0.10-ui.test.tsx, tests/regress.test.tsx |
| Ustaw | app/plan.tsx | tests/audit-0.10-data.test.ts, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx +28 |
| Ustaw jako aktywny | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-tst-ui.test.tsx +9 |
| Ustaw jako aktywny: {name} | app/plan.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-tst-ui.test.tsx +2 |
| Ustaw jako główne | app/more/location/[id].tsx | tests/locations-ui.test.tsx, tests/scenario-full.test.tsx |
| Ustawienia | app/(tabs)/more.tsx | tests/audit-0.10-data.test.ts, tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-stats-ui.test.tsx +11 |
| Usunąć ćwiczenie? | app/(tabs)/exercises.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx, tests/swipe-delete.test.tsx +1 |
| Usunąć gumę? | app/more/bands.tsx | tests/audit-r83.test.tsx, tests/audit-records-misc.test.tsx, tests/matrix-i18n.test.tsx +5 |
| Usunąć miejsce? | app/more/locations.tsx | tests/audit-0.10-ui.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx +1 |
| Usunąć pomiar? | app/more/bodymass.tsx | tests/audit-0.10-data-ui.test.tsx, tests/swipe-delete.test.tsx |
| Usunąć serię? | app/history/edit/[id].tsx | tests/edit-history.test.tsx, tests/flows.test.tsx, tests/matrix-ui.test.tsx +5 |
| Usunąć szablon? | app/(tabs)/templates.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/scenario-full.test.tsx, tests/swipe-delete.test.tsx +1 |
| Usunąć talerz? | components/LoadEditor.tsx | tests/scenario-full.test.tsx, tests/swipe-delete.test.tsx |
| Usunąć ten plan? | app/plan.tsx | tests/plans-multi-ui.test.tsx |
| Usunąć tę sesję z historii? | app/(tabs)/history.tsx | tests/matrix-ui.test.tsx, tests/regress.test.tsx, tests/scenario-full.test.tsx +1 |
| Usunąć z szablonu? | app/template/[id].tsx | tests/flows.test.tsx, tests/live2-split-template.test.tsx, tests/regress.test.tsx +3 |
| Usunąć z treningu? | app/history/edit/[id].tsx | tests/audit-0.10-live.test.tsx, tests/edit-history.test.tsx, tests/matrix-ui.test.tsx +4 |
| Usunąć zamiennik? | app/template/[id].tsx | tests/swap-alternates.test.tsx |
| Usuń | components/LoadEditor.tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-live.test.tsx +20 |
| Usuń ćwiczenie: {name} | app/history/edit/[id].tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-ui.test.tsx, tests/edit-history.test.tsx +8 |
| Usuń gumę: {name} | app/more/bands.tsx | tests/audit-r83.test.tsx, tests/audit-records-misc.test.tsx, tests/matrix-ui.test.tsx +4 |
| Usuń miejsce: {name} | app/more/locations.tsx | tests/audit-0.10-ui.test.tsx, tests/locations-ui.test.tsx, tests/matrix-ui.test.tsx +2 |
| Usuń odznaczone | components/LoadEditor.tsx | tests/audit-0.10-ui.test.tsx, tests/scenario-full.test.tsx |
| Usuń plan: {name} | app/plan.tsx | tests/plans-multi-ui.test.tsx |
| Usuń pomiar: {v}, {d} | app/more/bodymass.tsx | tests/audit-0.10-data-ui.test.tsx, tests/swipe-delete.test.tsx |
| Usuń serię {n} — {ex} | app/history/edit/[id].tsx | tests/audit-0.10-ui.test.tsx, tests/edit-history.test.tsx, tests/flows.test.tsx +6 |
| Usuń sesję | app/history/edit/[id].tsx | tests/audit-0.10-ui.test.tsx, tests/edit-history.test.tsx, tests/matrix-ui.test.tsx +3 |
| Usuń sesję: {name} | app/(tabs)/history.tsx | tests/audit-0.10-ui.test.tsx, tests/regress.test.tsx, tests/scenario-full.test.tsx +1 |
| Usuń szablon: {name} | app/(tabs)/templates.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/scenario-full.test.tsx, tests/swipe-delete.test.tsx +1 |
| Usuń usunięte ćwiczenie z treningu | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx, tests/swipe-delete.test.tsx |
| Usuń z biblioteki: {name} | app/(tabs)/exercises.tsx | tests/audit-0.10-data-ui.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx +2 |
| Usuń zakres powtórzeń | app/template/[id].tsx | tests/scenario-full.test.tsx |
| Usuń zamiennik: {name} | app/template/[id].tsx | tests/swap-alternates.test.tsx |
| Utwórz „{name}” | app/(tabs)/exercises.tsx | tests/audit-k1-fala2b.test.tsx, tests/backlog-0410.test.tsx, tests/matrix-logic.test.tsx +2 |
| Wersja | app/more/about.tsx | tests/audit-0.10-data-ui.test.tsx, tests/whats-new.test.tsx |
| Widok treningu | app/more/settings.tsx | tests/audit-0.10-tst-ui.test.tsx |
| Więcej możliwości ({n}) | components/DayPanel.tsx | tests/plan-calendar-ui.test.tsx |
| Więcej opcji | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/guide.test.tsx, tests/plan-calendar-ui.test.tsx +1 |
| Wolne | app/plan.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/b2-plan-own-templates.test.tsx +5 |
| Wróć | app/history/edit/[id].tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-ui.test.tsx, tests/audit-close2-a.test.tsx +9 |
| Wróć do edycji | app/_layout.tsx | tests/backlog-0.10.1-dane-ui.test.tsx |
| Wszystkie | app/picker.tsx | tests/audit-0.10-live.test.tsx, tests/scenario-full.test.tsx, tests/skip-today.test.tsx +1 |
| Wyczyść | app/more/settings.tsx | tests/audit-0.10-ui.test.tsx, tests/audit-io-more.test.tsx, tests/audit-r83.test.tsx +6 |
| Wyczyść wszystkie dane | app/more/settings.tsx | tests/audit-0.10-ui.test.tsx, tests/audit-io-more.test.tsx, tests/audit-r83.test.tsx +6 |
| Wydłuż przerwę o 15 sekund | components/ActiveWorkout.tsx | tests/audit-0.10-lang.test.ts, tests/scenario-full.test.tsx |
| Wygeneruj szablony i plan | app/(tabs)/templates.tsx | tests/audit-0.10-ui.test.tsx, tests/dashboard.test.tsx, tests/generator-ui.test.tsx +3 |
| Wygląd | app/more/settings.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx +5 |
| Wyjmij z supersetu | app/template/[id].tsx | tests/scenario-full.test.tsx |
| Wykres słupkowy: {v} | components/Chart.tsx | tests/deload-week.test.tsx, tests/regress.test.tsx |
| Wypełnij | components/LoadEditor.tsx | tests/audit-0.10-ui.test.tsx, tests/audit-r82c.test.tsx, tests/locations-audit.test.tsx +3 |
| Wyślij kopię | app/(tabs)/index.tsx | tests/matrix-ui.test.tsx, tests/regress.test.tsx |
| Z szablonu | components/StartPanel.tsx | tests/audit-0.10-tst-ui.test.tsx, tests/audit-0.10-tst.test.ts, tests/home-b.test.tsx |
| Zachęta do planu tygodnia | app/more/settings.tsx | tests/regress.test.tsx |
| Zakończ | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-tst-ui.test.tsx, tests/audit-0.10-tst.test.ts +29 |
| Zakończ i zapisz | components/ActiveWorkout.tsx | tests/audit-close2-a.test.tsx, tests/audit-close2-c.test.tsx, tests/audit-journey-b.test.tsx +2 |
| Zakończ serię | components/ActiveWorkout.tsx | tests/audit-r72-ui.test.tsx, tests/matrix-ui.test.tsx, tests/regress.test.tsx +1 |
| Zakończ trening i zapisz | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-tst-ui.test.tsx, tests/audit-backlog-r75.test.tsx +17 |
| Zaktualizuj szablon | components/ActiveWorkout.tsx | tests/audit-0.10-ui.test.tsx, tests/live2-split-template.test.tsx, tests/matrix-invariants.test.ts |
| Zamień | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-plan-ui.test.tsx, tests/backlog-0410.test.tsx +7 |
| Zamień ćwiczenie (brak sprzętu): {name} | components/ActiveWorkout.tsx | tests/scenario-full.test.tsx, tests/swap-ui.test.tsx |
| Zamień ćwiczenie: {name} | app/history/edit/[id].tsx | tests/audit-0.10-live.test.tsx, tests/backlog-0410.test.tsx, tests/catalog-full.test.tsx +5 |
| Zamień na zamiennik: {name} | components/ActiveWorkout.tsx | tests/swap-alternates.test.tsx |
| Zamknij | components/StartPanel.tsx | tests/whats-new.test.tsx |
| Zapamiętaj | components/ActiveWorkout.tsx | tests/regress.test.tsx, tests/scenario-full.test.tsx |
| Zapisuj zakończone treningi do Apple Health | app/more/settings.tsx | tests/matrix-ui.test.tsx, tests/phone-p1.test.tsx, tests/scenario-full.test.tsx |
| Zapisz | app/history/edit/[id].tsx | tests/app.tsx, tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-gen-ui.test.tsx +22 |
| Zapisz jako szablon | app/history/[id].tsx | tests/audit-0.10-ui.test.tsx |
| Zapisz plan | components/OwnPlan.tsx | tests/gen-days-ui.test.tsx, tests/plan-own-templates-ui.test.tsx, tests/ui2-06-gen-back-to-plan.test.tsx |
| Zapisz pomiar | app/more/bodymass.tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-stats-ui.test.tsx |
| Zapisz szablony i plan | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx +5 |
| Zapisz trening z tego dnia | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/guide.test.tsx |
| Zapisz zmiany | app/history/edit/[id].tsx | tests/edit-history.test.tsx, tests/scenario-full.test.tsx |
| Zaplanuj deload od {date} | components/DeloadHint.tsx | tests/deload-ui.test.tsx, tests/guide.test.tsx |
| Zastąp | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/locations-audit.test.tsx, tests/matrix-ui.test.tsx +2 |
| Zastosuj | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/plan-calendar-ui.test.tsx +1 |
| Zastosuj: {title} | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/plan-calendar-ui.test.tsx +1 |
| Zawsze w: {l} | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx, tests/swap-alternates.test.tsx |
| Zawsze w: {l} — {name} | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx, tests/swap-alternates.test.tsx |
| zaznaczone: {n} z {m} | app/more/location/[id].tsx | tests/scenario-full.test.tsx |
| Zdejmij oznaczenie deload | components/DeloadHint.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/deload-ui.test.tsx |
| Zmień kolejność ćwiczeń | app/template/[id].tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Zmień kolejność: {name} | components/DragList.tsx | tests/reorder-t010.test.tsx, tests/scenario-full.test.tsx |
| Zmierz | components/ActiveWorkout.tsx | tests/audit-close-b.test.tsx, tests/audit-close2-c.test.tsx, tests/audit-final-timer.test.tsx +4 |
| Zostaw | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/ux2-08-gen-replace-active.test.tsx |

## TEKST

| Pozycja | Źródło | Testy (pierwsze 3) |
|---|---|---|
| „⇄ zamień” przy ćwiczeniu zamienia je na inne tylko w tym treningu — szablon zostaje. | lib/guide.ts | tests/guide.test.tsx |
| „+ Dodaj trening wstecz” zapisze trening, którego nie zapisałeś na bieżąco; z dnia w Kalendarzu — „Zapisz trening z tego dnia”. | lib/guide.ts | tests/guide.test.tsx |
| „⏸ Pauza” zatrzymuje zegar treningu; czas pauzy nie liczy się do czasu trwania. | lib/guide.ts | tests/guide.test.tsx |
| „Archiwizuj” w podglądzie chowa szablon; przesunięcie w lewo na liście usuwa go (z potwierdzeniem). | lib/guide.ts | tests/guide.test.tsx |
| „Bez ograniczeń sprzętu” = pełna siłownia (sztanga, hantle, maszyny i wyciągi). | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx |
| „do” jest mniejsze niż „od” — zakres pokaże się jako {n}+ | app/template/[id].tsx | tests/scenario-full.test.tsx |
| „Pomiń dziś” pomija resztę serii ćwiczenia w tym treningu. | lib/guide.ts | tests/guide.test.tsx |
| „Wygeneruj szablony i plan” (Szablony albo Plan tygodnia): wybierz cel, miejsce, liczbę i długość sesji. | lib/guide.ts | tests/guide.test.tsx |
| (kopia) | lib/locations.ts | tests/backlog-0.10.1-dane.test.ts, tests/locations-model.test.ts, tests/locations-ui.test.tsx +2 |
| (usunięte miejsce) | lib/locations.ts | tests/audit-0.10-ui.test.tsx, tests/integration-090.test.tsx, tests/locations-model.test.ts +2 |
| {c}, poziom {n} | lib/store.ts | tests/flows.test.tsx, tests/regress.test.tsx, tests/scenario-full.test.tsx |
| {ex} — {n} min, umiarkowane tempo | app/generator.tsx | tests/generator-ui.test.tsx |
| {ex} — {s} × {a}–{b}, przerwa {r} | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/generator-ui.test.tsx, tests/regress.test.tsx +1 |
| {goal}, {n}× w tygodniu · {place} | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/gen-days-ui.test.tsx +6 |
| {k}: {v} | lib/stats.ts | (tylko parametry) |
| {n} h | components/Dashboard.tsx | (tylko parametry) |
| {n} km | lib/store.ts | tests/audit-0.10-lang.test.ts, tests/matrix-i18n.test.tsx, tests/matrix-shared.tsx +2 |
| {n} m | lib/store.ts | (tylko parametry) |
| {n} rozgrz. | app/history/edit/[id].tsx | tests/audit-0.10-stats-ui.test.tsx, tests/scenario-full.test.tsx |
| {n} s | lib/store.ts | (tylko parametry) |
| {n} z {m} | app/more/location/[id].tsx | (tylko parametry) |
| {n}, główne: {m} | app/more/settings.tsx | tests/scenario-full.test.tsx |
| {name} · w planie na: {day} | components/StartPanel.tsx | tests/home-b.test.tsx |
| {name}, wybrany | app/more/language.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx |
| {name}: {n}× w tygodniu | components/OwnPlan.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit-0.10-plan.test.ts +9 |
| {p} zastąpi ciężary wpisane dla: {i}. | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| {p}% planu tygodnia ({done} z {n}) | components/WeekStacks.tsx | tests/dashboard.test.tsx, tests/matrix-i18n.test.tsx, tests/motyw.test.tsx |
| {u}/hant. | lib/store.ts | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx +2 |
| {u}/hantel | lib/store.ts | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx +5 |
| {u}/str. | lib/store.ts | tests/audit-k1-brands.test.ts, tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx +4 |
| {u}/strona | lib/store.ts | tests/matrix-ui.test.tsx |
| {u}/stronę | lib/store.ts | tests/audit-r82.test.tsx |
| {v} · pomiar z {d} | app/more/settings.tsx | tests/audit-0.10-data-ui.test.tsx |
| {v} ({p}% masy ciała {d}) | lib/stats.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-stats-ui.test.tsx, tests/audit-k1-mer.test.tsx |
| {v} (masa ciała {d}) | lib/stats.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/audit-0.10-stats-ui.test.tsx +3 |
| {v} z {d}. Treningi z tego okresu przeliczą e1RM z wcześniejszego pomiaru (albo bez e1RM, gdy go nie ma). | app/more/bodymass.tsx | tests/audit-0.10-data-ui.test.tsx |
| ↑ spróbuj {n} pow. | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-stats-ui.test.tsx, tests/audit-backlog-r75.test.tsx +5 |
| ↑ spróbuj {v} | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-stats-ui.test.tsx, tests/audit-backlog-r75.test.tsx +5 |
| ↑ spróbuj bez asysty | components/ActiveWorkout.tsx | tests/audit-backlog-r75.test.tsx |
| ⏸ Pauza | components/ActiveWorkout.tsx | tests/audit-0.10-lang.test.ts, tests/guide.test.tsx, tests/matrix-i18n.test.tsx +1 |
| ▶ Start | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/matrix-i18n.test.tsx, tests/matrix-tuleja.test.tsx |
| ▶ Wznów | components/ActiveWorkout.tsx | tests/pause.test.tsx |
| ●●● główna · ●● pomocnicza · ● stabilizacja | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| ★ Miejsce główne — domyślne dla nowych treningów i szablonów bez własnego miejsca. | app/more/location/[id].tsx | tests/scenario-full.test.tsx |
| 10 nowych języków: niemiecki, francuski, włoski, niderlandzki, szwedzki, duński, norweski, fiński, turecki i grecki. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| 16 języków; wygląd jasny, ciemny albo jak w telefonie. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| Anuluj edycję ćwiczenia | app/exercise/[id].tsx | tests/edit-on-demand.test.tsx |
| Anuluj edycję szablonu | app/template/[id].tsx | tests/audit-k1-fala2b.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx, tests/edit-on-demand.test.tsx +2 |
| Aplikacja korzysta z bibliotek open source. Niżej licencje (dotknij, by zobaczyć treść) oraz wszystkie pakiety npm, od których zależy aplikacja — także narzędzia budowania — z licencją i notką o prawach autorskich. | app/more/licenses.tsx | tests/audit-0.10-data-ui.test.tsx |
| Aplikacja nie udziela porad medycznych. Przy bólu, urazie lub chorobie skonsultuj się z lekarzem lub fizjoterapeutą. | components/ExerciseCues.tsx | tests/audit-0.10-ui.test.tsx, tests/cues.test.tsx |
| Aplikacja nie zbiera danych: wszystko, co wpisujesz, zostaje w telefonie, bez konta, reklam i analityki. | app/more/about.tsx | tests/audit-0.10-data-ui.test.tsx |
| Aplikacja zamknęła się w trakcie edycji ćwiczenia „{name}”. Wrócić do edycji? | app/_layout.tsx | tests/backlog-0.10.1-dane-ui.test.tsx |
| Aplikacja zamknęła się w trakcie edycji szablonu „{name}”. Wrócić do edycji? | app/_layout.tsx | tests/backlog-0.10.1-dane-ui.test.tsx |
| Apple Health niedostępne | app/more/settings.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Archiwizować szablon? | app/template/[id].tsx | tests/audit-0.10-plan-ui.test.tsx |
| Archiwum | app/history/add.tsx | tests/audit-0.10-ui.test.tsx, tests/template-folders.test.tsx |
| asysta gumą: {v} | components/EquipVisual.tsx | tests/audit-0.10-tst-ui.test.tsx |
| asysta: {v} | components/EquipVisual.tsx | tests/karta-sprzet.test.tsx |
| Automatyczna kopia po każdym treningu trafia do Plików (Ustawienia). | lib/guide.ts | tests/guide.test.tsx |
| Backup treningów | lib/backup.ts | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| Backup z nowszej wersji aplikacji | app/more/backup.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| badania naukowe | components/ExerciseCues.tsx | tests/audit-k1-bl-mer.test.tsx |
| Bez e1RM: brak źródeł, jaką część masy ciała podnosisz w tym ćwiczeniu. | app/more/progress.tsx | tests/audit-0.10-stats-ui.test.tsx |
| bez miejsca | components/ActiveWorkout.tsx | tests/bar-no-plates.test.tsx, tests/matrix-ui.test.tsx |
| Bez nowych rekordów w tym okresie. | components/PeriodSummary.tsx | tests/period-summary.test.tsx |
| Bez planu tygodnia | components/TodayPlan.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/plan-calendar-ui.test.tsx |
| bez szablonu | components/StartPanel.tsx | tests/audit-close2-b.test.tsx |
| bez treningów | app/plan.tsx | tests/plans-multi-ui.test.tsx |
| Bez treningów i poza aktywnym planem: {list}. „Zastąp” je usunie, „Zostaw” doda nowe obok. | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/ux2-08-gen-replace-active.test.tsx |
| Bez treningów: {list}. To zastąpi też aktywny plan „{plan}”, zrobiony tylko z tych szablonów — „Zastąp” je usunie i ustawi nowy plan jako aktywny w jego miejsce, „Zostaw” doda nowe obok. | app/generator.tsx | tests/ux2-08-gen-replace-active.test.tsx |
| biblioteki ćwiczeń organizacji szkoleniowych | components/ExerciseCues.tsx | tests/audit-k1-bl-mer.test.tsx, tests/cues.test.tsx |
| Biblioteki natywne iOS spoza npm ({n}) | app/more/licenses.tsx | tests/licenses-native.test.tsx |
| brak | app/history/edit/[id].tsx | tests/app.tsx, tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx +27 |
| brak ciężarów — podpowiedź „↑” jak bez miejsca | components/LoadEditor.tsx | tests/bar-no-plates.test.tsx, tests/matrix-ui.test.tsx |
| Brak ćwiczeń — dodaj pierwsze. | app/history/edit/[id].tsx | tests/edit-history.test.tsx, tests/scenario-full.test.tsx |
| Brak ćwiczeń dostępnych w tym miejscu. | app/generator.tsx | tests/generator-ui.test.tsx |
| Brak ćwiczeń na: {list}. | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/mutation-generator.test.ts +1 |
| Brak danych do wykresu. | components/Chart.tsx | tests/regress.test.tsx |
| Brak gum. Dodaj pierwszą, by zapisywać asystę przy podciąganiu. | app/more/bands.tsx | tests/matrix-ui.test.tsx |
| Brak miejsc — wszystkie ćwiczenia są dostępne, a podpowiedzi działają jak dotąd. | app/more/locations.tsx | tests/motyw.test.tsx, tests/scenario-full.test.tsx |
| Brak odhaczonych serii | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/flows.test.tsx, tests/matrix-ui.test.tsx +3 |
| Brak podobnych ćwiczeń w tym miejscu — rozwiń „Inne”. | app/swap.tsx | tests/audit-0.10-lang.test.ts, tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| Brak pomiarów. | app/more/bodymass.tsx | tests/audit-0.10-data-ui.test.tsx |
| Brak serii w tym i poprzednim tygodniu. | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| Brak sesji. | app/history/[id].tsx | tests/edit-history.test.tsx |
| brak sprzętu w: {l} | app/template/[id].tsx | tests/locations-ui.test.tsx, tests/swap-alternates.test.tsx, tests/swap-ui.test.tsx |
| Brak szablonów — dodaj pierwszy. | app/(tabs)/templates.tsx | tests/audit-0.10-ui.test.tsx, tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx +4 |
| Brak szablonów z ćwiczeniami — utworzysz je w zakładce Szablony. Możesz też zacząć od pustego treningu. | app/history/add.tsx | tests/edit-history.test.tsx |
| Brak treningów w tym miesiącu. | app/(tabs)/history.tsx | tests/audit-0.10-ui.test.tsx |
| Brak treningów w tym okresie. | components/PeriodSummary.tsx | tests/period-summary.test.tsx |
| Brak zapisanych sesji z tym ćwiczeniem. | app/more/progress.tsx | tests/scenario-full.test.tsx |
| Brak zgody | app/more/settings.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/matrix-ui.test.tsx |
| Brak zgody na powiadomienia — przypomnienia i koniec przerwy nie przyjdą. Zgodę włączysz w Ustawieniach iOS. | app/more/settings.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Brak zgody na zapis treningów. Włącz ją w aplikacji Zdrowie: profil → Aplikacje → {app}. | app/more/settings.tsx | tests/matrix-ui.test.tsx |
| brak: {m} | app/picker.tsx | tests/locations-ui.test.tsx, tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx |
| Był skrócony w tygodniu deload: {a} zamiast {b} serii roboczych. Powtórzyć pełny trening? | lib/start.ts | tests/audit-0.10-live.test.tsx |
| cały sprzęt; sztanga {bar} {u} + talerze {max}…{min} {u}; hantle {a}–{b} {u} co {step} | lib/equipment.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/scenario-full.test.tsx |
| Cardio | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/gen-days-ui.test.tsx +3 |
| Cardio poza planem: sesja cardio jest w planie od {k} dni w tygodniu, przy mniejszej liczbie wszystkie dni są siłowe. Zalecenie WHO: co najmniej {a}–{b} min umiarkowanego wysiłku tygodniowo (albo {c}–{d} min intensywnego); liczy się też umiarkowany ruch w ciągu dnia, np. szybki marsz, nawet krótki. | app/generator.tsx | tests/gen-days-ui.test.tsx, tests/generator-ui.test.tsx, tests/matrix-i18n.test.tsx |
| Cardio w planie: {n} min tygodniowo. Zalecenie WHO: co najmniej {a}–{b} min umiarkowanego wysiłku tygodniowo (albo {c}–{d} min intensywnego); liczy się też umiarkowany ruch w ciągu dnia, np. szybki marsz, nawet krótki. | app/generator.tsx | tests/gen-days-ui.test.tsx, tests/generator-ui.test.tsx, tests/matrix-i18n.test.tsx |
| Cardio: jedna sesja umiarkowanego wysiłku w osobny dzień; jej długość = czas sesji — konwencja. | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx |
| Cardio: od {k} dni w tygodniu jedna sesja w osobny dzień; przy mniejszej liczbie dni wszystkie są siłowe, żeby cardio nie zabierało dni treningowi siłowemu (każda główna partia co najmniej {n} dni) — konwencja. | app/generator.tsx | tests/gen-days-ui.test.tsx, tests/generator-ui.test.tsx, tests/matrix-i18n.test.tsx |
| Ciemny | app/more/settings.tsx | tests/matrix-i18n.test.tsx, tests/scenario-full.test.tsx, tests/theme-choice.test.tsx |
| ciężar | app/history/[id].tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-live.test.tsx, tests/audit-0.10-stats-ui.test.tsx +33 |
| Ciężar od {a} do {b}. | components/LoadEditor.tsx | tests/scenario-full.test.tsx |
| Ciężar serii na stacji wpisuj na stronę — tak, jak pokazuje urządzenie. | components/LoadEditor.tsx | tests/decisions-0310.test.tsx |
| Ciężarów w tym zakresie: {c} — najwyżej {n}. Zwiększ krok. | components/LoadEditor.tsx | tests/locations-audit.test.tsx |
| ciężaru {w} nie ma tutaj — wpisz ciężar | app/history/edit/[id].tsx | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx +1 |
| co najmniej {n} | app/more/progress.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-stats-ui.test.tsx, tests/audit-0.10-ui.test.tsx +7 |
| Co nowego | components/WhatsNew.tsx | tests/whats-new.test.tsx |
| Co nowego — są nowe zmiany | components/WhatsNew.tsx | tests/whats-new.test.tsx |
| Cofnąć zamianę? | components/ActiveWorkout.tsx | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx, tests/swap-ui.test.tsx |
| CSV: ciężar w jednostce z ustawień ({u}), dystans w metrach. | app/more/backup.tsx | tests/matrix-ui.test.tsx, tests/regress.test.tsx |
| Czas treningów | components/PeriodSummary.tsx | tests/period-summary.test.tsx |
| Czas trwania: od 1 do 1440 minut. | lib/edit.ts | tests/matrix-time.test.ts, tests/matrix-ui.test.tsx |
| Czeka na zapis w Apple Health: {n}. Ponawiam przy uruchomieniu i powrocie do aplikacji. | app/more/settings.tsx | tests/audit-0.10-data-ui.test.tsx |
| Częste błędy | components/ExerciseCues.tsx | tests/cues.test.tsx |
| ćw. | app/(tabs)/index.tsx | tests/edit-on-demand.test.tsx, tests/home-b.test.tsx, tests/scenario-full.test.tsx |
| Ćwiczenia | app/(tabs)/_layout.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-live.test.tsx, tests/matrix-a11y.test.tsx +8 |
| ćwiczenia dodasz w następnym kroku | app/history/add.tsx | tests/scenario-full.test.tsx |
| ćwiczenia dodasz w trakcie | components/StartPanel.tsx | tests/home-b.test.tsx |
| Ćwiczenia na czas mają w treningu stoper — po upływie celu seria odhacza się sama. Przerwa ustawiona w pozycji szablonu ma pierwszeństwo; puste pole przerwy w szablonie oznacza przerwę z tego ćwiczenia. | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| Ćwiczenia z 1 serią bez zmian. | lib/start.ts | tests/audit-0.10-live.test.tsx |
| Ćwiczenie | app/_layout.tsx | tests/audit-0.10-ui.test.tsx, tests/edit-on-demand.test.tsx, tests/swap-top3.test.ts |
| Ćwiczenie ma co najmniej jedną serię. Żeby usunąć całe ćwiczenie, przesuń w lewo jego nazwę. | components/SwipeRow.tsx | tests/audit-0.10-ui.test.tsx |
| Ćwiczenie zostanie bez zmian. | app/exercise/[id].tsx | tests/edit-on-demand.test.tsx |
| D — tydzień oznaczony jako deload. | app/more/progress.tsx | tests/deload-week.test.tsx |
| Dalej | lib/planReminder.ts | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts, tests/mutation-bounds.test.ts |
| dalej: {name} | components/ActiveWorkout.tsx | tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx, tests/audit-0.10-tst.test.ts +3 |
| Dane i kopie | app/more/settings.tsx | tests/phone-p1.test.tsx, tests/ui2-09-leftovers.test.tsx |
| Dane nie zostały wyczyszczone | app/more/settings.tsx | tests/audit-r83.test.tsx |
| Dane w telefonie | app/more/settings.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/regress.test.tsx |
| Dane w telefonie zapisała nowsza wersja (schemat {a}); ta wersja obsługuje do {b}. Niczego nie zmieniam — zainstaluj najnowszą wersję (TestFlight). Dane możesz też wysłać jako plik. | app/_layout.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Dane z nowszej wersji aplikacji | lib/backup.ts | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts |
| Dane z nowszej wersji aplikacji — zaktualizuj aplikację | app/_layout.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts |
| Data pomiaru nie może być w przyszłości. | lib/store.ts | tests/audit-0.10-data-ui.test.tsx |
| dawniej: {n} | app/(tabs)/exercises.tsx | tests/audit-k1-fala2b.test.tsx |
| Deload | lib/guide.ts | tests/deload-week.test.tsx, tests/matrix-i18n.test.tsx, tests/whats-new.test.tsx +1 |
| deload — mniej serii | app/(tabs)/history.tsx | tests/audit-0.10-live.test.tsx |
| Deload: podpowiedź w Kalendarzu, a w tygodniu deload przy starcie {less}; przypomnienie rano w dniu treningu z planu. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| Dni co najmniej tyle, ile wybranych szablonów. | components/OwnPlan.tsx | tests/plan-own-templates-ui.test.tsx |
| Dni treningowe w tygodniu (w tym {n} cardio) | app/generator.tsx | tests/gen-days-ui.test.tsx, tests/generator-ui.test.tsx |
| Dni tygodnia | app/plan.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Dni: {n}, szablony: {k} — szablony powtarzają się po kolei: {seq}. Co tydzień od początku. | components/OwnPlan.tsx | tests/plan-own-templates-ui.test.tsx |
| do zrobienia | components/Dashboard.tsx | tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx, tests/audit-0.10-tst.test.ts +7 |
| dociążenie: {v} | components/EquipVisual.tsx | tests/karta-sprzet.test.tsx |
| Dodaj ciężar | components/LoadEditor.tsx | tests/audit-0.10-ui.test.tsx, tests/locations-audit.test.tsx, tests/locations-ui.test.tsx +2 |
| Dodaj trening | components/DayPanel.tsx | tests/edit-history.test.tsx, tests/guide.test.tsx, tests/integration-090.test.tsx +7 |
| Dodane: {list}. | lib/tplsync.ts | tests/audit-0.10-ui.test.tsx, tests/matrix-i18n.test.tsx |
| Dostępne ćwiczenia: {n} z {m} | app/more/location/[id].tsx | tests/locations-ui.test.tsx, tests/scenario-full.test.tsx |
| dostępne: {n} ({r}) | components/LoadEditor.tsx | tests/locations-ui.test.tsx |
| Dotknij etykiety serii, by zmienić typ; przesuń wiersz w lewo, by go usunąć. Zakres powtórzeń jest opcjonalny — z nim pojawiają się podpowiedzi „↑”. „⇅ SS” łączy ćwiczenie z następnym w superset, „✂ SS” wyjmuje z grupy. Kolejność: „≡ Kolejność”. | app/template/[id].tsx | tests/matrix-ui.test.tsx |
| Dół A | lib/generator.ts | tests/generator-ui.test.tsx |
| Dół B | lib/generator.ts | tests/generator-ui.test.tsx |
| Dzień po dniu te same główne partie: {list}. Zwykle lepiej z dniem przerwy; przy tej samej liczbie serii w tygodniu to też jest w porządku. | lib/generator.ts | tests/generator-ui.test.tsx |
| dziś | components/HistoryCalendar.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit-0.10-live.test.tsx +14 |
| Dziś | components/TodayPlan.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx, tests/morning-removed.test.tsx +4 |
| dziś w planie · {n} ćw. | components/StartPanel.tsx | tests/home-b.test.tsx |
| Dziś wolne | components/TodayPlan.tsx | tests/plan-calendar-ui.test.tsx |
| Dziś zrobione: {name} | components/TodayPlan.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/plan-calendar-ui.test.tsx |
| Dziś: {name} | components/TodayPlan.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/mutation-bounds.test.ts, tests/plan-calendar-ui.test.tsx +1 |
| e1RM (Epley, na stronę) | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| e1RM (Epley, per hantel) | app/more/progress.tsx | tests/matrix-i18n.test.tsx, tests/scenario-full.test.tsx |
| e1RM {v} ({p}% masy ciała {d}; seria {s}) | lib/stats.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-stats-ui.test.tsx, tests/audit-k1-mer.test.tsx |
| e1RM {v} (masa ciała {d}; seria {s}) | lib/stats.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/audit-0.10-stats-ui.test.tsx +3 |
| e1RM {v} (seria {s}) | lib/stats.ts | tests/audit-records-logic.test.ts, tests/audit-records-misc.test.tsx, tests/matrix-i18n.test.tsx +1 |
| e1RM pojawi się po wpisaniu masy ciała w Ustawieniach. | app/more/progress.tsx | tests/audit-0.10-stats-ui.test.tsx, tests/matrix-ui.test.tsx |
| e1RM w ćwiczeniach z masą ciała liczy się tylko z masą ciała wpisaną w Ustawieniach i tylko tam, gdzie wiadomo, jaką jej część podnosisz: podciąganie (cała — uproszczenie), pompki (ok. {p}% — badania z platformą siłową). | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| e1RM: wzór Epleya na {p}% masy ciała z dnia treningu (ostatni pomiar z tego dnia lub wcześniejszy) plus dociążenie (uproszczenie). | app/more/progress.tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-stats-ui.test.tsx |
| Edycja ćwiczenia | app/exercise/[id].tsx | tests/edit-on-demand.test.tsx |
| Edycja sesji | app/_layout.tsx | tests/audit-0.10-tst.test.ts, tests/guide.test.tsx |
| Edycja sesji i trening wstecz | lib/guide.ts | tests/guide.test.tsx |
| Edycja szablonu | app/template/[id].tsx | tests/edit-on-demand.test.tsx |
| Eksport CSV | lib/backup.ts | tests/matrix-ui.test.tsx |
| Eksport tworzy plik JSON z całą historią i szablonami — zapisz go w Plikach/iCloud albo wyślij sobie. Import przyjmuje ten sam format, także backup z wersji webowej. | app/more/backup.tsx | tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx, tests/matrix-dim-langs3.test.tsx +2 |
| FBW | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/gen-days-ui.test.tsx +5 |
| FBW A | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/generator-ui.test.tsx +2 |
| FBW B | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/generator-ui.test.tsx +2 |
| Filtr miejsca wyłączony: {l} | app/picker.tsx | tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx |
| Filtr miejsca: {l} | app/picker.tsx | tests/locations-ui.test.tsx, tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx +2 |
| Filtr partii wyłączony: {g} | app/swap.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx |
| Filtr partii: {g} | app/swap.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/catalog-full.test.tsx, tests/matrix-logic.test.tsx +3 |
| Filtr: podstawowe ćwiczenia | components/LibScope.tsx | tests/catalog-library25.test.tsx |
| Folder nie został utworzony. | app/template/[id].tsx | tests/edit-on-demand.test.tsx |
| Gdzie trenujesz i jaki sprzęt tam masz. Wybór ćwiczenia pokazuje wtedy to, co da się zrobić w miejscu treningu, a podpowiedź „↑” proponuje ciężary, które naprawdę masz. Miejsce wybierasz na starcie treningu. | app/more/locations.tsx | tests/matrix-ui.test.tsx |
| Generator szablonów i planu | app/_layout.tsx | tests/generator-ui.test.tsx, tests/whats-new.test.tsx, .maestro/14-generator.yaml |
| Generator szablonów i planu tygodnia na Twoje polecenie (cel, miejsce, liczba i długość sesji) oraz kilka planów z wyborem aktywnego. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| główna | app/exercise/[id].tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-k1-muscleload.test.tsx, tests/catalog-v2.test.ts +7 |
| Godzina {t} nie istnieje tego dnia (zmiana czasu). Wpisz inną. | lib/edit.ts | tests/edit-history.test.tsx, tests/matrix-time.test.ts |
| Góra A | lib/generator.ts | tests/generator-ui.test.tsx, tests/matrix-migrations.test.tsx |
| Góra B | lib/generator.ts | tests/generator-ui.test.tsx |
| Gryf ({u}) | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| gryf łamany | lib/swap.ts | tests/matrix-ui.test.tsx |
| guma | app/(tabs)/exercises.tsx | tests/audit-0.10-tst-ui.test.tsx, tests/audit-r72-b.test.ts, tests/edit-history.test.tsx +9 |
| Guma | app/history/edit/[id].tsx | tests/audit-0.10-stats-ui.test.tsx, tests/audit-journey-a.test.tsx, tests/audit-journey-c.test.tsx +12 |
| Guma jako opór: przy serii wybierasz gumę (poziom 1–7), rekordy liczą serie z gumą. | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| guma: {v} | components/EquipVisual.tsx | tests/audit-0.10-tst-ui.test.tsx, tests/matrix-data-shared.ts, tests/matrix-i18n.test.tsx |
| Gumy | app/_layout.tsx | tests/matrix-i18n.test.tsx, tests/matrix-ui.test.tsx, tests/owner-0510c.test.tsx +4 |
| hantle | lib/swap.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit-0.10-live-logic.test.ts +65 |
| hantle {a}–{b} {u}, ławka regulowana, mata, ściana, bieżnia, rower | lib/equipment.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/scenario-full.test.tsx |
| hantle: {v} | components/EquipVisual.tsx | tests/karta-sprzet.test.tsx, tests/matrix-karta.test.tsx |
| Import przerwany | app/more/backup.tsx | tests/audit-r83.test.tsx, tests/audit-r83b.test.tsx, tests/matrix-ui.test.tsx |
| Import zastąpi wszystkie obecne dane zawartością pliku. Obecne dane (także trening w toku) zapiszą się najpierw jako kopia w Plikach: {app} → Backup. | app/more/backup.tsx | tests/matrix-ui.test.tsx |
| Inna kolejność ćwiczeń. | lib/tplsync.ts | tests/audit-0.10-ui.test.tsx |
| Inne | app/swap.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit-0.10-lang.test.ts +16 |
| Inne plany | app/plan.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit-0.10-plan-ui.test.tsx +10 |
| Inne serie: {list}. | lib/tplsync.ts | tests/audit-0.10-ui.test.tsx |
| Inny plan | app/plan.tsx | tests/ui2-08-saved-plan-title.test.tsx |
| Inny z planu, powtórz ostatni, z szablonu albo pusty. | components/StartPanel.tsx | tests/home-b.test.tsx |
| Jak ostatnio | lib/start.ts | tests/audit-0.10-live.test.tsx |
| Jak w telefonie | app/more/language.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/logic.test.ts, tests/matrix-i18n.test.tsx +4 |
| Jasny | app/more/settings.tsx | tests/matrix-i18n.test.tsx, tests/scenario-full.test.tsx, tests/theme-choice.test.tsx |
| Jeden trening w tygodniu też daje postępy, ale zwykle trochę mniejsze niż częstszy trening — głównie dlatego, że w jednej sesji mieści się mniej serii. Przy tej samej liczbie serii w tygodniu różnica w przyroście mięśni znika, a w sile maleje. | lib/generator.ts | tests/gen-days-ui.test.tsx, tests/gen-days.test.ts, tests/matrix-i18n.test.tsx |
| Jedna sesja: {v}. Wykres pojawi się po drugiej. | components/Chart.tsx | tests/matrix-ui.test.tsx |
| Jednostka sprzętu | components/LoadEditor.tsx | tests/locations-audit.test.tsx, tests/scenario-full.test.tsx |
| Jeszcze nie było w treningu. | app/exercise/[id].tsx | tests/edit-on-demand.test.tsx |
| Jeszcze pusto — pierwszy trening czeka. | app/(tabs)/history.tsx | tests/motyw.test.tsx, tests/scenario-full.test.tsx |
| jutro | components/StartPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/home-b.test.tsx, tests/plan-new-template-day.test.tsx |
| już w treningu | app/swap.tsx | tests/matrix-logic.test.tsx, tests/swap-ui.test.tsx |
| Kalendarz | app/(tabs)/_layout.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-ui.test.tsx +17 |
| Kalendarz zamiast Historii: plan tygodnia, przesuwanie treningów i propozycje zmian z myślą o regeneracji partii. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| Karta bieżącej serii w treningu; widok „Lista” jak wcześniej do wyboru w Ustawieniach. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| Każda główna partia co najmniej {n} dni w tygodniu (WHO 2020 — zalecenie dla zdrowia; ACSM 2026: siła rośnie przy co najmniej {n} sesjach tygodniowo). Dzień, w którym partia pracuje tylko pomocniczo, liczy się jako {h} — uproszczenie (jedno źródło). Podział na sesje (FBW, góra/dół) to konwencja — przy tej samej liczbie serii daje podobne efekty. | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx |
| Każda z tych możliwości wraca do rutyny w ciągu {n} dni. | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/plan-calendar-ui.test.tsx |
| Każde ćwiczenie ma tu 1 serię — liczba serii zostaje bez zmian (ćwiczenia z 1 serią nie są skracane). Ciężary bez zmian. | lib/start.ts | tests/audit-0.10-live.test.tsx |
| kettlebell | lib/swap.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/audit-k1-bl-mer.test.tsx +9 |
| kettlebell: {v} | components/EquipVisual.tsx | tests/matrix-i18n.test.tsx, tests/matrix-karta.test.tsx |
| Kilka planów: „+ Nowy plan” tworzy kopię do zmiany, a „Ustaw jako aktywny” w „Inne plany” ją włącza — zmiany dni wracają razem z planem. | lib/guide.ts | tests/guide.test.tsx |
| Kolejność ćwiczeń | app/_layout.tsx | .maestro/03-kolejnosc.yaml |
| Kolejność: najpierw zmiany, po których plan wraca do rutyny w ciągu {n} dni, potem bez utraty treningów, bez nowych par dzień po dniu z tymi samymi partiami i z najmniejszą liczbą zmienionych dni. | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Kolor i poziom trudności: 1 = cienka, 7 = bardzo gruba. Gumy nie mają kilogramów — przy serii zapisujesz, której gumy użyłeś. Guma jako asysta (np. podciąganie): rekordem są powtórzenia bez gumy, a postęp to zejście na niższy poziom. Guma jako opór: rekordy liczą serie z gumą. | app/more/bands.tsx | tests/matrix-ui.test.tsx |
| Kolor względem partii z największą liczbą serii w tym okresie (partia główna 1 seria, pomocnicza 0,5). Szare — bez serii. | components/MuscleMap.tsx | tests/muscle-map.test.tsx |
| Koniec przerwy i przypomnienie o treningu z planu przyjdą także przy zablokowanym ekranie. | app/more/settings.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/matrix-ui.test.tsx |
| Koniec treningu ({t}) jest w przyszłości. Zmień datę, godzinę albo czas trwania. | lib/edit.ts | tests/matrix-time.test.ts, tests/matrix-ui.test.tsx |
| Kopia automatyczna po treningu jest wyłączona (Ustawienia). | app/more/backup.tsx | tests/matrix-ui.test.tsx |
| Kopia automatyczna: po każdym treningu plik JSON zapisuje się sam w Plikach (Na moim iPhonie → {app} → Backup, ostatnie {n}). Import przyjmuje też te pliki. Te kopie znikają razem z aplikacją — przed jej usunięciem albo instalacją z innego Apple ID wyeksportuj backup na zewnątrz. | app/more/backup.tsx | tests/matrix-ui.test.tsx |
| Kopia jest zachowana w telefonie. Tapnij, by ją wysłać, a potem zaimportuj backup. | app/(tabs)/index.tsx | tests/matrix-ui.test.tsx |
| Kopia nieczytelnych danych | lib/backup.ts | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| Kopia obecnego planu w „Inne plany” — zmienisz ją przed ustawieniem jako aktywny. | app/plan.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Kopia obejmie też poprzednie, nieczytelne dane. | lib/backup.ts | tests/audit-r83b.test.tsx, tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| Kopia w Apple Health zostanie — usuniesz ją w aplikacji Zdrowie. | app/(tabs)/history.tsx | tests/audit-0.10-ui.test.tsx |
| Kopia zapasowa | app/_layout.tsx | tests/audit-0.10-ui.test.tsx, tests/guide.test.tsx, tests/public-repo.test.ts +1 |
| Kreska = {n} serii na partię w tygodniu. Stanowisko ACSM 2026: przy co najmniej {n} seriach na partię tygodniowo przyrost mięśni był większy niż przy mniejszej objętości; każdy trening siłowy daje przyrost w porównaniu z brakiem treningu. Uproszczenie: serie pomocnicze liczymy po 0,5. | app/more/progress.tsx | tests/sets-mark.test.tsx |
| Liczba serii z czasu sesji: (minuty − {w} min rozgrzewki) × 60 / ({s} s serii + średnia przerwa {r} s) = {n}; ćwiczeń = serie / {k} (co najmniej {e}) — uproszczenie, nie wynik badań. | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/generator-ui.test.tsx |
| Lista | app/more/settings.tsx | tests/audit-0.10-tst-ui.test.tsx, tests/first-steps-empty.test.tsx, tests/guide.test.tsx +4 |
| lista ćwiczeń z filtrami, które możesz zdjąć | app/swap.tsx | tests/matrix-ui.test.tsx |
| Lista ćwiczeń, zamiany i generator pokazują to, co da się zrobić w wybranym miejscu. | lib/guide.ts | tests/guide.test.tsx |
| Lista możliwości: przesunięcie planu, przeniesienie tylko tego treningu, zamiana albo wolne — z uwzględnieniem regeneracji partii. | components/DayPanel.tsx | tests/plan-calendar-ui.test.tsx |
| Lista szablonów. | components/Dashboard.tsx | tests/first-steps-empty.test.tsx |
| Lista: ćwiczenia i serie jak w poprzednich wersjach, bez karty. | app/more/settings.tsx | tests/tuleja.test.tsx |
| łączny czas | lib/stats.ts | tests/matrix-invariants.test.ts, tests/regress.test.tsx, tests/stats.test.ts |
| łączny dystans | lib/stats.ts | tests/catalog-library25.test.tsx, tests/matrix-invariants.test.ts, tests/regress.test.tsx +1 |
| Mapa mięśni | components/MuscleMap.tsx | tests/backlog-0.10.1-dane.test.ts, tests/guide.test.tsx, tests/muscle-map.test.tsx |
| Mapa mięśni i serie na partię z kreską {n} serii tygodniowo. | lib/guide.ts | tests/backlog-0.10.1-dane.test.ts, tests/guide.test.tsx |
| Mapa mięśni: {list} | components/MuscleMap.tsx | tests/muscle-map.test.tsx |
| Mapa mięśni: brak serii w tym okresie. | components/MuscleMap.tsx | tests/muscle-map.test.tsx |
| Masa | app/generator.tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts +14 |
| masa ciała | lib/live.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/audit-0.10-live-logic.test.ts +23 |
| Masa ciała musi być większa od zera i nie większa niż {max}. | lib/store.ts | tests/audit-0.10-data-ui.test.tsx |
| Masa ciała: „±” to dociążenie (plus) albo asysta, np. maszyny (minus); guma to osobne pole z poziomem. Rekord to suma powtórzeń bez asysty, a objętość liczy się tylko z dociążenia. | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| Masa: co najmniej {m} serii na partię w tygodniu, {a}–{b} powtórzeń (w domu {c}–{d}), zwykle {r1}–{r2} powtórzenia w zapasie. | app/generator.tsx | tests/generator-ui.test.tsx |
| maszyna | lib/swap.ts | tests/catalog-library25.test.tsx, tests/invariants.test.ts, tests/locations-audit.test.tsx +4 |
| materiały producenta sprzętu | components/ExerciseCues.tsx | tests/audit-k1-bl-mer.test.tsx |
| max | lib/store.ts | tests/audit-0.10-lang.test.ts, tests/audit-k1-bl-mer.test.tsx, tests/matrix-i18n.test.tsx +7 |
| max ± | lib/stats.ts | tests/matrix-i18n.test.tsx, tests/regress.test.tsx, tests/stats.test.ts |
| max ciężar | lib/stats.ts | tests/matrix-i18n.test.tsx |
| Max ciężar | app/more/progress.tsx | tests/regress.test.tsx, tests/scenario-full.test.tsx |
| Max ciężar (na stronę) | app/more/progress.tsx | tests/regress.test.tsx |
| Max ciężar (per hantel) | app/more/progress.tsx | tests/scenario-full.test.tsx |
| max czas | lib/stats.ts | tests/matrix-ui.test.tsx |
| Max dociążenie | app/more/progress.tsx | tests/audit-0.10-stats-ui.test.tsx, tests/matrix-ui.test.tsx |
| max dystans | lib/stats.ts | tests/matrix-ui.test.tsx |
| max pow. | lib/stats.ts | tests/matrix-i18n.test.tsx, tests/matrix-ui.test.tsx |
| Max powtórzeń bez asysty | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| Max powtórzeń w serii | app/more/progress.tsx | tests/scenario-full.test.tsx |
| Max powtórzeń z asystą | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| Miejsca głównego nie usuniesz — najpierw ustaw inne miejsce jako główne. | app/more/locations.tsx | tests/audit-0.10-ui.test.tsx |
| Miejsce tego treningu | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Mięsień docelowy spoza mapy partii: {m} — nie liczy się w seriach na partię ani na mapie mięśni. | app/exercise/[id].tsx | tests/audit-0.10-ui.test.tsx |
| Minęło {s} s. | lib/timer.ts | tests/matrix-ui.test.tsx, tests/timer-logic.test.ts |
| mniej | components/MuscleMap.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx +17 |
| Mniej opcji | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Mniej serii | lib/start.ts | tests/audit-0.10-live.test.tsx, tests/deload-ui.test.tsx, tests/guide.test.tsx +1 |
| Moje szablony, {n}× w tygodniu | lib/generator.ts | tests/gen-days-ui.test.tsx, tests/plan-own-templates-ui.test.tsx, tests/plan-own-templates.test.ts |
| Mój plan ({date}) | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/mutation-plan.test.ts, tests/plan-own-templates-ui.test.tsx +2 |
| Na czym to oparte | app/generator.tsx | tests/guide.test.tsx |
| Na ekranie Trening stuknij „Start” przy szablonie albo „Pusty trening”. | lib/guide.ts | tests/guide.test.tsx |
| Na ekranie treningu: dzisiejszy trening z planu, bieżący tydzień i najbliższe treningi z nazwą. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| Na górze listy jest polecana: wraca do rutyny i nie gubi treningu, potem unika par dzień po dniu z tymi samymi partiami i zmienia najmniej dni. | lib/guide.ts | tests/guide.test.tsx |
| Na każdą stronę | components/PlateBar.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-tst-ui.test.tsx, tests/karta-sprzet.test.tsx +3 |
| Na koniec „Zakończ trening i zapisz” — sesja trafi do Kalendarza. | lib/guide.ts | tests/guide.test.tsx |
| Na podstawie: {list}. Własne sformułowania. | components/ExerciseCues.tsx | tests/audit-k1-bl-mer.test.tsx, tests/cues.test.tsx |
| na urządzeniu: {v} | components/EquipVisual.tsx | tests/matrix-karta.test.tsx |
| Nadpisać dane? | app/more/backup.tsx | tests/audit-io-more.test.tsx, tests/audit-r83.test.tsx, tests/audit-r83b.test.tsx +3 |
| Najcięższy ciężar w miejscu dla boju głównego ({list}): {w}. Ciężkie serie {a}–{b} powtórzeń (ok. {p}% maksimum) mogą być z nim za lekkie — jeśli {b} powtórzeń wychodzi lekko, rób więcej powtórzeń, bliżej upadku. Siła też wtedy rośnie, ale zwykle mniej niż przy dużym ciężarze. | lib/loadcap.ts | tests/audit-k1-bl-mer.test.tsx |
| Najdłużej łącznie na treningu | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| Najdłuższa seria | app/more/progress.tsx | tests/scenario-full.test.tsx |
| Najdłuższy dystans | app/more/progress.tsx | tests/catalog-library25.test.tsx, tests/matrix-ui.test.tsx |
| Najdłuższy dystans na treningu | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| najlepsza | app/more/progress.tsx | tests/audit-records-ui.test.tsx |
| Najlepsza seria (objętość) | app/more/progress.tsx | tests/scenario-full.test.tsx |
| Najlepszy trening (objętość) | app/more/progress.tsx | tests/regress.test.tsx |
| Najpierw utwórz szablon. | components/Dashboard.tsx | tests/audit-0.10-ui.test.tsx, tests/first-steps-empty.test.tsx |
| Najpierw zakończ albo anuluj bieżący trening. | app/template/[id].tsx | tests/audit-0.10-ui.test.tsx, tests/matrix-ui.test.tsx |
| Najważniejsze funkcje w kilku krokach. „Pokaż” otwiera opisany ekran. | app/guide.tsx | tests/guide.test.tsx |
| Najwięcej powtórzeń na treningu | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| Najwyżej {n} rodzajów. | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Najwyżej {n} szablonów — każdy dostaje co najmniej jeden dzień. | components/OwnPlan.tsx | tests/plan-own-templates-ui.test.tsx |
| Następna seria. | lib/timer.ts | tests/audit-0.10-live.test.tsx, tests/matrix-ui.test.tsx, tests/timer-logic.test.ts |
| Następne: {list} | components/TodayPlan.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Następny miesiąc | components/HistoryCalendar.tsx | tests/history-calendar.test.tsx |
| Następny okres | components/PeriodSummary.tsx | tests/period-summary.test.tsx |
| następny po: {name} · {n} ćw. | components/StartPanel.tsx | tests/home-b.test.tsx |
| następny: {next} | components/PlanningCard.tsx | tests/home-b.test.tsx |
| Nazwa folderu | app/template/[id].tsx | tests/b2-plan-own-templates.test.tsx, tests/edit-on-demand.test.tsx, tests/template-folders.test.tsx |
| Nazwy ćwiczeń z biblioteki są po angielsku we wszystkich językach poza polskim. | app/more/language.tsx | tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx, tests/matrix-dim-langs3.test.tsx +3 |
| Nic do zapisania. Odrzucić ten trening? | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Nic nie odhaczono — wszystkie ćwiczenia pominięte | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx |
| Nic nie pasuje. | app/(tabs)/exercises.tsx | tests/audit-k1-fala2b.test.tsx, tests/matrix-logic.test.tsx, tests/motyw.test.tsx +2 |
| nic więcej do zrobienia | lib/live.ts | tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx |
| Nic więcej do zrobienia — możesz zakończyć trening. | lib/timer.ts | tests/audit-0.10-live.test.tsx, tests/audit-0.10-tst.test.ts, tests/timer-logic.test.ts |
| Nic więcej do zrobienia (część pominięta) | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/skip-today.test.tsx |
| nie | app/exercise/[id].tsx | tests/app.tsx, tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts +128 |
| Nie da się ułożyć z talerzy ({l}) | components/EquipVisual.tsx | tests/audit-0.10-live.test.tsx |
| Nie da się ułożyć z talerzy ({l}) — najbliżej {v} | components/EquipVisual.tsx | tests/audit-0.10-live.test.tsx |
| Nie ma takiego ćwiczenia. | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| Nie ma takiego miejsca. | app/more/location/[id].tsx | tests/matrix-ui.test.tsx |
| Nie ma takiego planu. | app/plan.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Nie ma takiego szablonu. | app/reorder.tsx | tests/reorder-t010.test.tsx |
| Nie ma treningu w toku. | app/reorder.tsx | tests/reorder-t010.test.tsx |
| Nie ma żadnej serii z wynikiem — nic do zapisania. | app/history/edit/[id].tsx | tests/edit-history.test.tsx, tests/scenario-full.test.tsx |
| Nie ma żadnej serii z wynikiem. | lib/edit.ts | tests/matrix-ui.test.tsx |
| Nie masz jeszcze miejsc treningu, więc plan zakłada pełną siłownię (sztanga, hantle, maszyny i wyciągi). Trenujesz w domu albo w hotelu? Stuknij „+ Dodaj miejsce” i zaznacz sprzęt — generator dobierze ćwiczenia. | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx |
| Nie masz jeszcze szablonów — utwórz pierwszy albo zacznij pusty trening. | app/(tabs)/index.tsx | tests/audit-0.10-ui.test.tsx, tests/flows.test.tsx, tests/scenario-full.test.tsx |
| Nie masz jeszcze szablonów. | app/plan.tsx | tests/b2-plan-own-templates.test.tsx, tests/plan-calendar-ui.test.tsx, tests/plan-new-template-day.test.tsx |
| Nie masz szablonów z ćwiczeniami. Utwórz szablon albo wybierz „Nowe szablony i plan”. | components/OwnPlan.tsx | tests/audit-k1-bl-mer.test.tsx, tests/plan-own-templates-ui.test.tsx |
| nie podano — e1RM podciągania i pompek | app/more/settings.tsx | tests/audit-0.10-stats-ui.test.tsx |
| Nie udało się | app/(tabs)/index.tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx, tests/intro.test.tsx +5 |
| Nie udało się otworzyć danych. | app/_layout.tsx | tests/intro.test.tsx, tests/regress.test.tsx, tests/splash-start-error.test.tsx |
| Nie udało się zapisać | app/history/edit/[id].tsx | tests/audit-0.10-lang-ui.test.tsx, tests/matrix-data-fuzz.test.ts, tests/matrix-logic.test.tsx +2 |
| Nie udało się zapisać kopii bezpieczeństwa w Plikach — dane nie zostały zmienione. | lib/backup.ts | tests/matrix-data-fuzz.test.ts, tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| Nie zapisano jeszcze w Apple Health — ponowię przy następnym uruchomieniu aplikacji. | app/history/[id].tsx | tests/audit-0.10-data-ui.test.tsx |
| Nie zmieniono przerwy | components/ActiveWorkout.tsx | tests/audit-0.10-ui.test.tsx |
| Nie zostałaby żadna seria z wynikiem. Usunąć tę sesję z historii? | app/history/edit/[id].tsx | tests/matrix-ui.test.tsx |
| niedostępne w: {l} są wyszarzone | app/picker.tsx | tests/scenario-full.test.tsx |
| Nieodhaczone serie z wpisanymi wynikami: {n} — nie zostaną zapisane. Seria zapisuje się po odhaczeniu ✓. | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/matrix-ui.test.tsx |
| Nieodhaczone serie: {n} — nie zostaną zapisane. | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/matrix-ui.test.tsx, tests/regress.test.tsx +1 |
| Nieprawidłowa data. Wpisz RRRR-MM-DD, np. {d}. | lib/edit.ts | tests/matrix-time.test.ts, tests/matrix-ui.test.tsx |
| Nieprawidłowa godzina. Wpisz GG:MM, np. 18:00. | lib/edit.ts | tests/matrix-time.test.ts, tests/matrix-ui.test.tsx |
| nieprzeczytane | app/guide.tsx | tests/guide.test.tsx |
| Niezapisane zmiany | app/_layout.tsx | tests/audit-k1-fala2b.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx |
| niszowe ukryte: {n} — znajdziesz je wyszukiwaniem | components/LibScope.tsx | tests/catalog-library25.test.tsx |
| Notatka do serii | app/history/edit/[id].tsx | tests/scenario-full.test.tsx |
| Notatka szablonu | components/ActiveWorkout.tsx | tests/audit-0.10-ui.test.tsx |
| nowa | app/more/bands.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts, tests/audit-0.10-stats.test.ts +19 |
| Nowe ćwiczenie | app/exercise/[id].tsx | tests/edit-on-demand.test.tsx, tests/scenario-full.test.tsx |
| Nowe ćwiczenie nie zostanie zapisane. | app/exercise/[id].tsx | tests/edit-on-demand.test.tsx |
| nowe ćwiczenie własne | app/picker.tsx | tests/matrix-logic.test.tsx |
| Nowe miejsce | app/more/locations.tsx | tests/scenario-full.test.tsx |
| Nowe rekordy: {n} | components/ActiveWorkout.tsx | tests/audit-0.10-stats-ui.test.tsx, tests/audit-records-misc.test.tsx, tests/motyw.test.tsx |
| Nowy ekran Trening: dzisiejszy trening, tydzień w liczbach i ostatni trening; przewodnik po funkcjach w Więcej. | lib/whatsnew.ts | tests/guide.test.tsx, tests/whats-new.test.tsx |
| Nowy plan | lib/plan.ts | tests/audit-0.10-plan-ui.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/guide.test.tsx +3 |
| Nowy rekord! | components/ActiveWorkout.tsx | tests/audit-0.10-tst-ui.test.tsx, tests/motyw.test.tsx |
| Nowy szablon | app/template/[id].tsx | tests/audit-0.10-ui.test.tsx, tests/b2-plan-own-templates.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx +10 |
| Nowy szablon nie zostanie zapisany. | app/template/[id].tsx | tests/backlog-0.10.1-dane-ui.test.tsx, tests/edit-on-demand.test.tsx |
| Nowy szablon z ćwiczeniami i seriami tej sesji. | app/history/[id].tsx | tests/audit-0.10-ui.test.tsx |
| Nowy wygląd: kolory i kroje, grafika talerzy na sztandze. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| o około 1/3–1/2 mniej serii (np. {k} z {n}; ćwiczenia z 1 serią bez zmian) | lib/start.ts | tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx, tests/deload-ui.test.tsx +3 |
| Obecny plan zostanie w „Inne plany” — wrócisz do niego jednym przyciskiem. | lib/plan.ts | tests/audit-0.10-gen.test.ts, tests/audit-0.10-plan.test.ts, tests/mutation-plan.test.ts +2 |
| Obecny plan zostanie w „Inne plany” razem ze zmianami pojedynczych dni od dziś ({n}) — wrócą, gdy znów go ustawisz. | lib/plan.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit-0.10-plan-ui.test.tsx +4 |
| obj. | app/more/progress.tsx | tests/matrix-i18n.test.tsx, tests/matrix-ui.test.tsx |
| objętość | app/history/[id].tsx | tests/audit-final-stats.test.ts, tests/audit-records-live.test.tsx, tests/audit-records-logic.test.ts +9 |
| Objętość | components/PeriodSummary.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Objętość per partia ({u}) — ten tydzień vs poprzedni | app/more/progress.tsx | tests/scenario-full.test.tsx |
| Objętość serii roboczych (ciężar × powtórzenia × mnożnik ćwiczenia); partia główna liczy całość, pomocnicza połowę. Ćwiczenia bez ciężaru (masa ciała, gumy) się nie liczą. | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| Objętość tygodniowo ({u}) | app/more/progress.tsx | tests/scenario-full.test.tsx |
| Obok w nawiasie — cały poprzedni okres. Serie robocze bez rozgrzewki; rekordy jak w podsumowaniu treningu. | components/PeriodSummary.tsx | tests/period-summary.test.tsx |
| Obowiązuje jeden plan naraz. Po okresie przejściowym wrócisz do poprzedniego jednym przyciskiem. Tapnij plan, by zmienić jego nazwę i dni. | app/plan.tsx | tests/plans-multi-ui.test.tsx |
| Od {date}: tydzień deload. Przy starcie treningu zaproponuję {less}, ciężary bez zmian. | components/DeloadHint.tsx | tests/deload-ui.test.tsx |
| Odhaczone są tylko serie rozgrzewkowe ({n}). Zapisać taki trening? | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Odhaczone serie bez ciężaru: {n}. | components/ActiveWorkout.tsx | tests/locations-verify3.test.tsx |
| Odhaczone serie bez czasu lub dystansu: {n}. | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Odhaczone serie bez powtórzeń: {n}. | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Odhaczone serie: {n} — przepadną. | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx |
| odpoczynek | components/HistoryCalendar.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/matrix-invariants.test.ts, tests/motyw.test.tsx +1 |
| Odrzucić trening? | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-ui.test.tsx, tests/audit-close2-a.test.tsx +4 |
| Odrzucić zmiany? | components/DraftHeader.tsx | tests/audit-k1-fala2b.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx, tests/edit-history.test.tsx +4 |
| Odznacz ciężary, których nie masz. Najwyżej {n} ciężarów. | components/LoadEditor.tsx | tests/locations-audit.test.tsx |
| Ogólne | app/more/settings.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-lang.test.ts, tests/phone-p1.test.tsx |
| Opcjonalnie, tylko w telefonie. Z nią aplikacja liczy e1RM w podciąganiu (cała masa ciała — uproszczenie) i w pompkach (ok. {p}% masy ciała — badania z platformą siłową). Każdy trening liczy się z ostatnim pomiarem z tego dnia lub wcześniejszym; treningi sprzed pierwszego pomiaru — bez e1RM w tych ćwiczeniach. | app/more/bodymass.tsx | tests/audit-0.10-stats-ui.test.tsx |
| Opcjonalnie: dodaj miejsce i sprzęt — wybór ćwiczeń i podpowiedzi ciężarów dopasują się do niego. | components/Dashboard.tsx | tests/audit-0.10-ui.test.tsx |
| opuszczony: {name} | components/HistoryCalendar.tsx | tests/motyw.test.tsx, tests/plan-calendar-ui.test.tsx |
| Opuszczony: {name} | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/plan-calendar-ui.test.tsx |
| Ostatni trening był już skrócony — „Mniej serii” powtórzy go bez dalszego cięcia. | lib/start.ts | tests/audit-0.10-live.test.tsx |
| Ostatni trening był lżejszy | lib/start.ts | tests/audit-0.10-live.test.tsx |
| Ostatnia rozgrzewka o {t}, bez serii roboczych. Kontynuować czy odrzucić? | lib/timer.ts | tests/matrix-ui.test.tsx, tests/timer-logic.test.ts |
| Ostatnia rozgrzewka o {t}, bez serii roboczych. Otwórz, by kontynuować albo odrzucić. | lib/timer.ts | tests/matrix-ui.test.tsx, tests/timer-logic.test.ts |
| Ostatnia seria o {t}. Otwórz, by zakończyć albo kontynuować. | lib/timer.ts | tests/audit-0.10-live.test.tsx, tests/matrix-ui.test.tsx, tests/timer-logic.test.ts |
| Ostatnia seria o {t}. Zakończyć trening z tą godziną końca? | lib/timer.ts | tests/audit-0.10-live.test.tsx, tests/backlog-0.10.1-dane.test.ts, tests/matrix-ui.test.tsx +1 |
| Ostatnie treningi | app/exercise/[id].tsx | tests/edit-on-demand.test.tsx, tests/scenario-full.test.tsx |
| ostatnio | app/(tabs)/index.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-stats-ui.test.tsx, tests/matrix-ui.test.tsx +1 |
| Ostatnio {d}: | app/exercise/[id].tsx | tests/scenario-full.test.tsx |
| ostatnio {s} | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-stats-ui.test.tsx, tests/matrix-ui.test.tsx +1 |
| Otwiera Postępy. | components/Dashboard.tsx | tests/audit-0.10-ui.test.tsx |
| Otwiera ten dzień w Kalendarzu. | components/TodayPlan.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Oznacz tydzień jako deload | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/guide.test.tsx |
| Pakiety ({n}) | app/more/licenses.tsx | tests/audit-0.10-data-ui.test.tsx |
| Pakiety open source: {n} | app/more/about.tsx | tests/audit-0.10-data-ui.test.tsx |
| pakiety: {n} · treść wg {p} | app/more/licenses.tsx | tests/audit-0.10-data-ui.test.tsx, tests/licenses-native.test.tsx |
| para: {a} ({r}); jeden hantel: {b} ({r1}) | components/LoadEditor.tsx | tests/locations-ui.test.tsx |
| Partia główna liczy 1 serię, pomocnicza 0,5 (np. wyciskanie: klatka 1, triceps i barki po 0,5). Partie ustawisz w edycji ćwiczenia. | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| pauza | components/ActiveWorkout.tsx | tests/audit-0.10-lang.test.ts, tests/matrix-i18n.test.tsx, tests/matrix-invariants.test.ts +3 |
| Pauza treningu | components/ActiveWorkout.tsx | tests/audit-0.10-lang.test.ts, tests/audit-0.10-live.test.tsx, tests/pause.test.tsx +1 |
| Pauza treningu — czas pauzy nie liczy się do czasu trwania. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| Pełny trening | lib/start.ts | tests/audit-0.10-live.test.tsx, tests/deload-ui.test.tsx |
| Pierwsza wersja testowa: treningi z szablonów, historia, postępy i rekordy, kopia zapasowa w Plikach. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| Pierwsze kroki | components/Dashboard.tsx | tests/dashboard.test.tsx |
| Pierwszy trening: „Start” przy szablonie niżej albo „Pusty trening”. | components/Dashboard.tsx | tests/dashboard.test.tsx, tests/edit-on-demand.test.tsx, tests/flows.test.tsx +2 |
| piszczelowy przedni | app/exercise/[id].tsx | tests/audit-0.10-ui.test.tsx |
| Plan „{name}” jest teraz aktywny. | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/plan-own-templates-ui.test.tsx, tests/ux2-08-gen-replace-active.test.tsx |
| Plan „{name}” jest w „Inne plany”. | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/plan-own-templates-ui.test.tsx |
| Plan powtarza się co tydzień. Pojedyncze dni zmienisz w Kalendarzu. | app/plan.tsx | tests/plan-calendar-ui.test.tsx |
| Plan tygodnia i Kalendarz | lib/guide.ts | tests/guide.test.tsx |
| Plan tygodnia z Twoich szablonów według tych samych reguł co generator — przejrzysz go przed zapisem. Szablony zostają bez zmian. | components/OwnPlan.tsx | tests/plan-own-templates-ui.test.tsx |
| Plan: {name} | components/PlanningCard.tsx | tests/home-b.test.tsx, tests/matrix-i18n.test.tsx |
| Planowanie | components/PlanningCard.tsx | tests/home-b.test.tsx |
| Plik ma schemat {a}, a ta wersja obsługuje do {b}. Zaktualizuj aplikację. | lib/backup.ts | tests/audit-0.10-plan.test.ts, tests/matrix-data-fuzz.test.ts, tests/matrix-ui.test.tsx |
| Po dopisaniu zakresu byłoby ciężarów: {c} — najwyżej {n}. Zwiększ krok albo usuń odznaczone. | components/LoadEditor.tsx | tests/audit-0.10-ui.test.tsx |
| Po kilku tygodniach treningu z rzędu Kalendarz podpowie „Zaplanuj deload od …”. | lib/guide.ts | tests/guide.test.tsx |
| Po przywróceniu z archiwum szablon wróci do planu. | lib/plan.ts | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts |
| Po ukryciu komunikatu kopii nie da się już wysłać z aplikacji — najpierw ją wyślij, jeśli jest potrzebna. | app/(tabs)/index.tsx | tests/matrix-ui.test.tsx |
| Po zapisie szablon trafi na ten dzień. | app/plan.tsx | tests/plan-new-template-day.test.tsx |
| Podgląd | app/generator.tsx | tests/dashboard.test.tsx, tests/gen-days-ui.test.tsx, tests/generator-ui.test.tsx +2 |
| Podpowiedź wróci w przyszłym tygodniu. | components/DeloadHint.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Podstawowe | components/LibScope.tsx | tests/audit-0.10-tst-ui.test.tsx, tests/scenario-0.10.test.tsx, .maestro/17-biblioteka-technika.yaml |
| Podsumowanie | components/PeriodSummary.tsx | tests/maestro-failures.test.ts |
| Pokazane wszystkie ćwiczenia, także niszowe | components/LibScope.tsx | tests/catalog-library25.test.tsx |
| Pokazano {n} z {m} — wpisz nazwę, by zawęzić. | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| Pokaż inne ćwiczenia | app/swap.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/backlog-0410.test.tsx, tests/catalog-full.test.tsx +5 |
| polecane | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/plan-calendar-ui.test.tsx |
| Pomiar z tym samym dniem zastępuje poprzedni. | app/more/bodymass.tsx | tests/audit-0.10-data-ui.test.tsx |
| Pomiary | app/more/bodymass.tsx | tests/audit-0.10-data-ui.test.tsx |
| Pominięcie ćwiczenia przerwie pomiar — ten czas się nie zapisze. | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx |
| pominięte dziś | components/ActiveWorkout.tsx | tests/skip-today.test.tsx |
| pomocnicza | app/exercise/[id].tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-k1-muscleload.test.tsx, tests/catalog-v2.test.ts +5 |
| Poniżej {n} serii tygodniowo: {list}. Pomoże więcej sesji, dłuższy czas albo więcej sprzętu w miejscu. | lib/generator.ts | tests/generator-ui.test.tsx |
| Poniżej {n} serii tygodniowo: {list}. To dolny próg zalecany przy budowie masy; serie dodasz w szablonach. | lib/generator.ts | tests/plan-own-templates-ui.test.tsx, tests/plan-own-templates.test.ts |
| Poprawka zapisu: wszystkie serie bloku „{name}” przejdą pod wybrane ćwiczenie (wartości bez zmian). | app/swap.tsx | tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx |
| poprz. | app/more/progress.tsx | tests/dashboard.test.tsx, tests/scenario-full.test.tsx, tests/sets-mark.test.tsx |
| poprz.: {v} | components/Dashboard.tsx | tests/dashboard.test.tsx |
| Poprzedni miesiąc | components/HistoryCalendar.tsx | tests/audit-0.10-ui.test.tsx, tests/history-calendar.test.tsx |
| Poprzedni okres | components/PeriodSummary.tsx | tests/motyw-miesiac.test.tsx, tests/period-summary.test.tsx |
| Poprzedni plan | app/generator.tsx | tests/audit-0.10-tst-ui.test.tsx, tests/mutation-plan.test.ts |
| Poprzedni tydzień jest oznaczony jako deload. | components/PeriodSummary.tsx | tests/deload-week.test.tsx |
| Poprzednio | app/template/[id].tsx | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/decisions-0310.test.tsx +8 |
| Poprzednio: {l} | components/ActiveWorkout.tsx | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/decisions-0310.test.tsx +4 |
| Postępy i rekordy | lib/guide.ts | tests/guide.test.tsx |
| Postępy: podsumowanie tygodnia i miesiąca z mapą mięśni, znacznik {n} serii na partię w tygodniu i oznaczanie tygodnia deload. | lib/whatsnew.ts | tests/backlog-0.10.1-dane.test.ts, tests/whats-new.test.tsx |
| pow. | app/history/[id].tsx | tests/audit-0.10-tst-ui.test.tsx, tests/audit-records-ui.test.tsx, tests/edit-history.test.tsx +6 |
| Pow. | app/history/edit/[id].tsx | tests/matrix-ui.test.tsx |
| Powiadomienia | app/more/settings.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx, tests/matrix-ui.test.tsx +2 |
| Powiadomienia działają | app/more/settings.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| powtórzenia do | app/template/[id].tsx | tests/scenario-full.test.tsx |
| powtórzenia od | app/template/[id].tsx | tests/audit-0.10-tst-ui.test.tsx, tests/scenario-full.test.tsx, tests/template-rows.test.tsx |
| poziom {n} | app/more/location/[id].tsx | tests/audit-0.10-stats-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/flows.test.tsx +5 |
| Poziomy gum, które masz w tym miejscu (1 = cienka, 7 = bardzo gruba). | app/more/location/[id].tsx | tests/matrix-ui.test.tsx |
| Pozostałe akcje dla tego dnia. | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Pozostałe nieodhaczone serie: {n} — też nie zostaną zapisane. | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx |
| Pozycja końcowa | lib/figures/index.ts | tests/audit-k1-bl-mer.test.tsx, tests/figures.test.tsx |
| Pozycja wyjściowa | lib/figures/index.ts | tests/audit-k1-bl-mer.test.tsx, tests/figures.test.tsx |
| Progresja: gdy zrobisz górę zakresu powtórzeń, dołóż ciężar — konwencja. | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/generator-ui.test.tsx |
| Propozycja według Twoich założeń — przejrzysz ją przed zapisem. Reguły pochodzą z przeglądów badań; części oznaczone jako konwencja albo uproszczenie nie wynikają z badań. | app/generator.tsx | tests/generator-ui.test.tsx |
| Propozycje | app/swap.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/maestro-failures.test.ts, tests/matrix-logic.test.tsx +3 |
| Przeciągnij za ≡, żeby zmienić kolejność. Superset przesuwa się w całości; kolejność w nim zmienisz uchwytami przy ćwiczeniach. | app/reorder.tsx | tests/matrix-ui.test.tsx |
| przeczytane | app/guide.tsx | tests/audit-0.10-ui.test.tsx, tests/guide.test.tsx |
| Przeczytane: {n} z {m} | app/(tabs)/more.tsx | tests/guide.test.tsx |
| Przejrzyj podgląd i „Na czym to oparte” — wynik zapisuje się dopiero po zatwierdzeniu. | lib/guide.ts | tests/guide.test.tsx |
| Przenieś na {day} | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/plan-calendar-ui.test.tsx |
| przerwa | app/history/[id].tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-lang.test.ts, tests/audit-0.10-ui.test.tsx +18 |
| Przerwa | lib/timer.ts | tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-lang.test.ts, tests/audit-0.10-live.test.tsx +11 |
| Przerwa (sekundy) | components/ActiveWorkout.tsx | tests/audit-0.10-ui.test.tsx, tests/regress.test.tsx, tests/scenario-full.test.tsx |
| przerwa {s} | app/(tabs)/_layout.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-lang.test.ts, tests/audit-0.10-ui.test.tsx +18 |
| przerwa {s} s | lib/timer.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-lang.test.ts, tests/audit-0.10-ui.test.tsx +18 |
| przerwa minęła | components/ActiveWorkout.tsx | tests/scenario-full.test.tsx |
| Przerwa minęła | lib/timer.ts | tests/audit-0.10-live.test.tsx, tests/audit-io-flows.test.tsx, tests/matrix-ui.test.tsx +1 |
| przerwa z {s} | components/ActiveWorkout.tsx | tests/flows.test.tsx, tests/scenario-full.test.tsx |
| Przerwy: {a} min po ciężkich seriach boju głównego, {b} min po innych wielostawowych, {c} min po jednostawowych i core — uproszczenie; przeglądy są niejednoznaczne (ACSM 2026: długość przerwy nie zmieniała przyrostu siły). | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx |
| Przesunięcie serii albo nazwy ćwiczenia w lewo usuwa je (z potwierdzeniem). | lib/guide.ts | tests/guide.test.tsx |
| Przesuń niżej | components/DragList.tsx | tests/template-cards.test.tsx |
| Przesuń plan o 1 dzień | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/plan-calendar-ui.test.tsx, tests/plan-own-templates-ui.test.tsx |
| Przesuń plan od dziś | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/plan-calendar-ui.test.tsx |
| Przesuń serię albo nazwę ćwiczenia w lewo, by je usunąć. | app/history/edit/[id].tsx | tests/audit-0.10-ui.test.tsx |
| Przesuń wyżej | components/DragList.tsx | tests/template-cards.test.tsx |
| Przód | components/MuscleMap.tsx | tests/muscle-map.test.tsx |
| Przyda się: {list}. | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/mutation-generator.test.ts |
| Przypisanie partii mięśniowych — jedno źródło, nie ustalone. Od niego zależą serie na partię, mapa mięśni, generator i propozycje w kalendarzu. | app/exercise/[id].tsx | tests/audit-0.10-ui.test.tsx |
| Przypisanie partii mięśniowych — uproszczenie, nie wynik badań. Od niego zależą serie na partię, mapa mięśni, generator i propozycje w kalendarzu. | app/exercise/[id].tsx | tests/audit-0.10-ui.test.tsx, tests/matrix-ui.test.tsx |
| przyrząd: {impl} | components/ActiveWorkout.tsx | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx +1 |
| Przywróć z archiwum | app/template/[id].tsx | tests/edit-on-demand.test.tsx, tests/template-folders.test.tsx |
| Pusta nazwa folderu | app/template/[id].tsx | tests/edit-on-demand.test.tsx |
| Rano o {h}:00 w dniu zaplanowanego treningu przyjdzie powiadomienie. Potrzebna jest zgoda na powiadomienia — iOS zapyta o nią po „Dalej”. | lib/planReminder.ts | tests/audit-0.10-plan-ui.test.tsx |
| Redukcja | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts +4 |
| Redukcja: trening jak na masę (chroni mięśnie) i jedna sesja umiarkowanego cardio. | app/generator.tsx | tests/generator-ui.test.tsx |
| Redukcja: trening jak na masę (chroni mięśnie); sesja cardio w planie od {k} dni w tygodniu. | app/generator.tsx | tests/gen-days-ui.test.tsx, tests/generator-ui.test.tsx, tests/matrix-i18n.test.tsx |
| REKORDY | app/more/progress.tsx | tests/audit-records-ui.test.tsx, tests/matrix-i18n.test.tsx, tests/scenario-full.test.tsx |
| Rekordy w tym okresie | components/PeriodSummary.tsx | tests/period-summary.test.tsx |
| RIR — powtórzenia w zapasie: RIR = 10 − RPE (RPE 10 = 0 RIR, RPE 9 = 1 RIR; Zourdos i in., JSCR 2016). Zapisane wartości przeliczają się przy zmianie skali. | app/more/settings.tsx | tests/effort-scale.test.tsx |
| RIR wpisuje się w zakresie 0–{max}; więcej niż {max} powtórzeń w zapasie zapisuje się jako „lekko” (RPE {light}), bo poniżej RPE {min} skala opisuje wysiłek słowami, a nie powtórzeniami w zapasie (Helms i in. 2016). | app/more/settings.tsx | tests/audit-k1-bl-mer.test.tsx |
| robione {n}× | lib/swap.ts | tests/audit-0.10-plan-ui.test.tsx, tests/dashboard.test.tsx, tests/flows.test.tsx +6 |
| rozgrzewka | components/ActiveWorkout.tsx | tests/audit-close2-a.test.tsx, tests/audit-stale-ui.test.tsx, tests/matrix-invariants.test.ts +6 |
| Rozwija planowanie. | components/PlanningCard.tsx | tests/home-b.test.tsx |
| Ruch | components/ExerciseCues.tsx | tests/cues.test.tsx, tests/figures.test.tsx |
| Rysunek ruchu: {opis} | lib/figures/index.ts | tests/figures.test.tsx, tests/maestro-selectors.test.ts |
| Rysunek schematyczny — pozycje orientacyjne. | components/ExerciseFigure.tsx | tests/figures.test.tsx |
| Rzadziej niż {n} dni w tygodniu: {list} (dzień tylko z pracą pomocniczą = {h}). | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx |
| sam gryf | components/PlateBar.tsx | tests/audit-0.10-tst-ui.test.tsx |
| sek. | app/history/edit/[id].tsx | tests/matrix-i18n.test.tsx, tests/matrix-ui.test.tsx |
| Seria | lib/timer.ts | tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-lang.test.ts, tests/audit-0.10-live.test.tsx +29 |
| seria · bez celu | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| seria · cel {s} | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| seria {n} | components/ActiveWorkout.tsx | tests/audit-0.10-data.test.ts, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx +37 |
| Seria {n} | app/history/edit/[id].tsx | tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-lang.test.ts, tests/audit-0.10-live.test.tsx +29 |
| Seria {n} — {ex} | app/history/edit/[id].tsx | tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-lang.test.ts, tests/audit-0.10-live.test.tsx +29 |
| seria {n} z {all} | components/ActiveWorkout.tsx | tests/audit-0.10-data.test.ts, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx +37 |
| seria {n} z {all} · drop set | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx |
| seria {s} s | lib/timer.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx +37 |
| Seria jest już odhaczona. | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Seria skończona | lib/timer.ts | tests/matrix-ui.test.tsx, tests/timer-logic.test.ts |
| Seria zrobiona | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/karta-sprzet.test.tsx, tests/maestro-selectors.test.ts +2 |
| Serie bez ciężaru: {n}. | app/history/edit/[id].tsx | tests/integration-090.test.tsx |
| Serie bez wyniku zostaną pominięte: {n}. | app/history/edit/[id].tsx | tests/edit-history.test.tsx, tests/scenario-full.test.tsx |
| Serie na partię w tygodniu (pomocnicza = {h} serii — uproszczenie, jedno źródło): {list} | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/generator-ui.test.tsx, tests/plan-own-templates-ui.test.tsx |
| Serie per partia — ten tydzień vs poprzedni | app/more/progress.tsx | tests/scenario-full.test.tsx |
| Serie robocze | components/PeriodSummary.tsx | tests/period-summary.test.tsx, tests/scenario-full.test.tsx |
| Serie robocze tygodniowo | app/more/progress.tsx | tests/scenario-full.test.tsx |
| Serie z tej sesji przepadną. | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Serie: {s} na ćwiczenie — ACSM 2026 zaleca co najmniej {m}; więcej serii zwykle daje trochę więcej, z malejącym zyskiem. Liczba {s} to uproszczenie. | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx |
| Sesja | app/_layout.tsx | tests/audit-k1-fala2b.test.tsx, tests/edit-on-demand.test.tsx, tests/scenario-full.test.tsx |
| Sesja w historii zostanie bez zmian. | app/history/edit/[id].tsx | tests/scenario-full.test.tsx |
| Sesje | app/more/progress.tsx | tests/audit-records-ui.test.tsx, tests/gen-days-ui.test.tsx, tests/scenario-full.test.tsx |
| Siła | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit-k1-bl-mer.test.tsx +10 |
| Siła bez obciążenia zewnętrznego (sztanga, hantle, kettlebell, maszyny, wyciągi): ciężkich serii (ok. {p}% maksimum) tu nie zrobisz, więc plan jest jak na masę w domu — {s} × {a}–{b} powtórzeń blisko upadku. Siła też wtedy rośnie, ale zwykle mniej niż przy dużym ciężarze. | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx |
| Siła: bój główny na początku, {s} × {a}–{b} powtórzeń (ciężko, ok. {p}% maksimum i więcej), pozostałe ćwiczenia {s} × {c}–{d}. | app/generator.tsx | tests/generator-ui.test.tsx |
| Skala wysiłku RPE albo RIR w Ustawieniach. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| Skupiony | app/more/settings.tsx | tests/matrix-i18n.test.tsx, tests/tuleja.test.tsx |
| Skupiony: bieżąca seria dużymi cyframi i talerze na stronę nad listą ćwiczeń. | app/more/settings.tsx | tests/tuleja.test.tsx |
| specjalistyczne serwisy treningowe | components/ExerciseCues.tsx | tests/audit-k1-bl-mer.test.tsx, tests/cues.test.tsx |
| Sprawdź datę i godzinę | app/history/add.tsx | tests/edit-history.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Spróbuj ponownie | app/_layout.tsx | tests/matrix-ui.test.tsx, tests/splash-start-error.test.tsx |
| Spróbuj ponownie. | app/(tabs)/index.tsx | tests/matrix-ui.test.tsx |
| sprzęt w domu, na siłowni, w hotelu… | app/more/settings.tsx | tests/scenario-full.test.tsx |
| stabilizacja | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| stacja | lib/swap.ts | tests/audit-k1-brands.test.ts, tests/locations-audit.test.tsx, tests/matrix-logic.test.tsx +5 |
| start | components/ActiveWorkout.tsx | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-live.test.tsx, tests/audit-0.10-ui.test.tsx +23 |
| Start następnego treningu: {name} | components/StartPanel.tsx | tests/home-b.test.tsx |
| Start stopera serii | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/audit-close-b.test.tsx, tests/audit-close-c.test.tsx +18 |
| Stoper trwa | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| stos na {v} | components/EquipVisual.tsx | tests/karta-sprzet.test.tsx, tests/matrix-a11y.test.tsx, tests/matrix-karta.test.tsx |
| stożek rotatorów | app/exercise/[id].tsx | tests/audit-0.10-ui.test.tsx |
| Stuknij dzień w Kalendarzu: „Przesuń albo pomiń” pokazuje możliwości — przesunięcie planu o 1 dzień, tylko tego treningu, zamianę albo wolne. | lib/guide.ts | tests/guide.test.tsx |
| suma pow. | lib/stats.ts | tests/stats.test.ts |
| superset | app/reorder.tsx | tests/audit-journey-c.test.tsx, tests/flows.test.tsx, tests/guide.test.tsx +6 |
| superset · przerwa po rundzie {t} | components/ActiveWorkout.tsx | tests/scenario-full.test.tsx |
| Superset ustawisz w szablonie: „Edytuj”, potem „⇅ SS” przy ćwiczeniu łączy je z następnym (w trakcie treningu ten sam przycisk jest przy ćwiczeniu) — przerwa liczy się po ostatnim ćwiczeniu grupy. | lib/guide.ts | tests/guide.test.tsx |
| Szablon | app/_layout.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-lang.test.ts +22 |
| Szablon jest pusty — „Edytuj”, by dodać ćwiczenia. | app/template/[id].tsx | tests/edit-on-demand.test.tsx |
| Szablon jest pusty — dodaj ćwiczenia | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Szablon otwiera się w podglądzie ze „Start”; zmiany (także folder) dopiero po „Edytuj” — zapisuje je „Zapisz”. | lib/guide.ts | tests/guide.test.tsx |
| Szablon w planie: {name} | components/OwnPlan.tsx | tests/plan-own-templates-ui.test.tsx |
| Szablon zmieni się tylko po „Zaktualizuj szablon”. | components/ActiveWorkout.tsx | tests/audit-0.10-ui.test.tsx |
| Szablon zostanie bez zmian. | app/template/[id].tsx | tests/edit-on-demand.test.tsx |
| Szablony trafiają do folderu „Wygenerowane”, a plan do „Inne plany” albo od razu jako aktywny. | lib/guide.ts | tests/guide.test.tsx |
| Szablony trafią do folderu „{folder}”, a plan — do „Inne plany” albo od razu jako aktywny. | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/generator-ui.test.tsx |
| Szablony w folderach i archiwum, „Pomiń dziś” bez zmiany szablonu, usuwanie przesunięciem w lewo. | lib/whatsnew.ts | tests/whats-new.test.tsx |
| Szablony zostają bez zmian. Plan trafi do „Inne plany” albo od razu jako aktywny. | components/OwnPlan.tsx | tests/plan-own-templates-ui.test.tsx |
| Szablony: {list} — w folderze „{folder}” na liście Szablony. | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/ux2-08-gen-replace-active.test.tsx |
| sztanga | lib/swap.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit-0.10-live-logic.test.ts +79 |
| tak — przy serii wybierasz gumę | app/exercise/[id].tsx | tests/scenario-full.test.tsx |
| Talerze: ciężar i liczba sztuk (wszystkie, dla obu hantli razem). | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Talerze: ciężar i liczba sztuk (wszystkie, na obie strony razem). | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Tapnij numer serii, by zmienić typ (W, D, F) albo dodać notatkę. Serie bez wyniku nie zostaną zapisane. | app/history/edit/[id].tsx | tests/matrix-ui.test.tsx |
| Tapnij, by pokazać tylko dostępne. | app/picker.tsx | tests/audit-0.10-lang-ui.test.tsx |
| Tapnij, by pokazać wszystkie. | components/LibScope.tsx | tests/catalog-library25.test.tsx |
| Tapnij, by spróbować ponownie. Zrób też backup. | app/(tabs)/index.tsx | tests/matrix-ui.test.tsx |
| Tapnij, by włączyć. | app/swap.tsx | tests/audit-0.10-lang-ui.test.tsx |
| Tapnij, by wybrać inne ćwiczenie. | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| Tapnij, by zdjąć. | app/picker.tsx | tests/audit-0.10-lang-ui.test.tsx |
| Tapnij, by zmienić typ lub dodać notatkę. | app/history/edit/[id].tsx | tests/audit-0.10-lang-ui.test.tsx |
| Tapnij, by zmienić typ. | app/template/[id].tsx | tests/audit-0.10-lang-ui.test.tsx |
| Tapnij, by zmienić. | app/history/edit/[id].tsx | tests/audit-0.10-lang-ui.test.tsx |
| Tapnij, by zostawić podstawowe. | components/LibScope.tsx | tests/catalog-library25.test.tsx |
| te same mięśnie | lib/swap.ts | tests/matrix-ui.test.tsx |
| Tego ćwiczenia nie da się już zamienić. | app/swap.tsx | tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| Tej sesji nie ma już w historii. | lib/edit.ts | tests/edit-history.test.tsx |
| tempo | app/(tabs)/exercises.tsx | tests/generator-ui.test.tsx, tests/matrix-data-shared.ts, tests/matrix-i18n.test.tsx +1 |
| Ten plan jeszcze nie obowiązuje. Zmień nazwę i dni, potem „Ustaw jako aktywny”. | app/plan.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/plans-multi-ui.test.tsx |
| ten sam ruch | lib/swap.ts | tests/swap-ui.test.tsx |
| Ten sam ruch, inny przyrząd | app/swap.tsx | tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx, tests/swap-ui.test.tsx |
| Ten termin nachodzi na sesję „{name}” ({d}). | app/history/edit/[id].tsx | tests/backlog-0.10.1-dane-ui.test.tsx, tests/matrix-ui.test.tsx |
| Ten termin nachodzi na trening w toku (start {t}). Wybierz wcześniejszy. | lib/edit.ts | tests/matrix-ui.test.tsx |
| Ten trening nie zostanie zapisany. | app/history/edit/[id].tsx | tests/matrix-ui.test.tsx |
| Ten tydzień | components/Dashboard.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-ui.test.tsx, tests/dashboard.test.tsx +1 |
| Ten tydzień: deload. Przy starcie treningu zaproponuję {less}, ciężary bez zmian. | components/DeloadHint.tsx | tests/audit-0.10-live.test.tsx, tests/deload-ui.test.tsx |
| Timer odlicza w aplikacji, a na koniec przerwy przychodzi powiadomienie — także przy zablokowanym telefonie. | app/more/settings.tsx | tests/matrix-ui.test.tsx |
| To miejsce główne | app/more/locations.tsx | tests/audit-0.10-ui.test.tsx |
| To nie wygląda na backup z tej apki | app/more/backup.tsx | tests/scenario-full.test.tsx |
| To ostatnia seria | components/SwipeRow.tsx | tests/audit-0.10-ui.test.tsx |
| trap bar | lib/swap.ts | tests/catalog-library25.test.tsx, tests/matrix-i18n.test.tsx |
| Trening i serie | components/Dashboard.tsx | tests/audit-0.10-ui.test.tsx, tests/edit-on-demand.test.tsx, tests/guide.test.tsx |
| Trening rozpoczęty o {t}, bez odhaczonych serii. Kontynuować czy odrzucić? | lib/timer.ts | tests/matrix-ui.test.tsx, tests/timer-logic.test.ts |
| Trening rozpoczęty o {t}, bez odhaczonych serii. Otwórz, by kontynuować albo odrzucić. | lib/timer.ts | tests/backlog-0.10.1-dane.test.ts, tests/matrix-ui.test.tsx, tests/timer-logic.test.ts |
| Trening w pauzie od {t}. | lib/timer.ts | tests/audit-0.10-live.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx, tests/backlog-0.10.1-dane.test.ts +1 |
| Trening w toku | app/template/[id].tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/matrix-ui.test.tsx +1 |
| Trening w toku też zostanie usunięty. | app/more/settings.tsx | tests/audit-0.10-ui.test.tsx |
| Trening w toku zapisuje się na bieżąco. Tapnij numer serii, by oznaczyć rozgrzewkę (W), drop set (D), serię do upadku (F) albo dodać notatkę. | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Trening wciąż trwa | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/audit-backlog-q.test.tsx, tests/audit-close-c.test.tsx +10 |
| Trening wstecz | app/_layout.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-tst.test.ts |
| Trening wstecz z datą tego dnia. | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Trening z {d} {s} nie miał aktywności od 6 godzin, więc zapisał się sam. Koniec: {e} (ostatnia seria). Znajdziesz go w Kalendarzu. | app/_layout.tsx | tests/audit-0.10-ui.test.tsx, tests/matrix-ui.test.tsx |
| Trening z Twojego planu tygodnia. Otwórz aplikację, by zacząć. | lib/planReminder.ts | tests/audit-k1-bl-mer.test.tsx, tests/mutation-bounds.test.ts, tests/plan-reminder.test.tsx |
| Trening, którego nie zapisałeś na bieżąco. Ustaw termin i wybierz szablon — serie uzupełnisz w następnym kroku (wartości z ostatniego treningu przed tą datą). | app/history/add.tsx | tests/matrix-ui.test.tsx |
| Treningi i szablony z tym miejscem pokażą „(usunięte miejsce)”. | app/more/locations.tsx | tests/matrix-ui.test.tsx |
| Treningi nadal czekają na zapis w Apple Health. Sprawdź zgodę w aplikacji Zdrowie: profil → Aplikacje → {app}. | app/more/settings.tsx | tests/audit-0.10-data-ui.test.tsx |
| Treningi sprzed pierwszego pomiaru ({d}) — bez e1RM. | app/more/progress.tsx | tests/audit-0.10-data-ui.test.tsx |
| Trwa pomiar serii | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/skip-today.test.tsx |
| Trwa trening z tego szablonu — zostanie bez zmian. | lib/plan.ts | tests/audit-0.10-plan.test.ts |
| Trwający trening w tym miejscu trwa dalej; miejsce pokaże się jako „(usunięte miejsce)”. | app/more/locations.tsx | tests/audit-0.10-ui.test.tsx |
| Twoje oznaczenie, np. lżejszy tydzień. Przy starcie treningu zaproponuję {less}, ciężary bez zmian. | components/PeriodSummary.tsx | tests/audit-0.10-live.test.tsx, tests/deload-week.test.tsx |
| tydzień deload | components/HistoryCalendar.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/deload-ui.test.tsx, tests/matrix-invariants.test.ts |
| Tydzień oznaczysz też w Postępach przełącznikiem „Tydzień deload”. | lib/guide.ts | tests/guide.test.tsx |
| Tygodnie od poniedziałku. Objętość = ciężar × powtórzenia × mnożnik ćwiczenia; rozgrzewka poza. | app/more/progress.tsx | tests/matrix-ui.test.tsx |
| Tygodnie treningu z rzędu bez deloadu: {n}. Trenerzy zwykle robią deload co {a}–{b} tygodni — to praktyka opisana w ankietach jednego zespołu badaczy (jedno źródło), nie wynik badań skuteczności. | components/DeloadHint.tsx | tests/deload-ui.test.tsx |
| Tygodnie z wykonanym planem: {done} z {n} | components/PeriodSummary.tsx | tests/motyw-miesiac.test.tsx |
| tylko dostępne w: {l} | app/picker.tsx | tests/integration-090.test.tsx, tests/locations-ui.test.tsx, tests/scenario-full.test.tsx |
| Tylko rozgrzewka | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx, tests/regress.test.tsx |
| Tył | components/MuscleMap.tsx | tests/muscle-map.test.tsx |
| Uchwyt (jeden, {u}) | components/LoadEditor.tsx | tests/scenario-full.test.tsx |
| ukryte: {n} | app/picker.tsx | tests/catalog-library25.test.tsx, tests/locations-ui.test.tsx, tests/scenario-full.test.tsx |
| Uproszczenie: drop set liczy się razem z serią, po której jest. | app/more/progress.tsx | tests/audit-0.10-stats-ui.test.tsx, tests/sets-mark.test.tsx |
| Uproszczenie: zwykle dzień przerwy między sesjami z tymi samymi głównymi partiami; dwa dni pod rząd przy tej samej liczbie serii w tygodniu też są w porządku (przeglądy badań, ACSM). | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Uproszczenie: zwykle dzień przerwy między sesjami z tymi samymi głównymi partiami. | components/DayPanel.tsx | tests/plan-calendar-ui.test.tsx |
| Ustaw plan tygodnia — zobaczysz tu dzisiejszy trening i dostaniesz przypomnienie. | components/Dashboard.tsx | tests/dashboard.test.tsx |
| Ustaw plan tygodnia, by widzieć tu dzisiejszy trening i dostawać przypomnienie. | components/TodayPlan.tsx | tests/plan-calendar-ui.test.tsx, tests/regress.test.tsx |
| Ustaw plan tygodnia, by widzieć zaplanowane treningi i przesuwać je w kalendarzu. | app/(tabs)/history.tsx | tests/plan-calendar-ui.test.tsx |
| Ustawić „{name}” jako aktywny plan? | app/plan.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-tst-ui.test.tsx +2 |
| Ustawić nowy plan jako aktywny? | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx, tests/gen-days-ui.test.tsx +5 |
| Ustawienia na stronę: {n} ({r}) | components/LoadEditor.tsx | tests/locations-ui.test.tsx |
| Ustawienie | components/ExerciseCues.tsx | tests/audit-k1-bl-mer.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/cues.test.tsx +1 |
| Ustawienie, ruch, wskazówki i częste błędy. | components/ExerciseCues.tsx | tests/audit-k1-bl-mer.test.tsx, tests/cues.test.tsx |
| Usunąć odznaczone ciężary? | components/LoadEditor.tsx | tests/audit-0.10-ui.test.tsx, tests/scenario-full.test.tsx |
| Usunie ćwiczenia, szablony i całą historię oraz przywróci ustawienia domyślne (także miejsca, sprzęt i gumy). Przedtem obecne dane zapiszą się jako kopia w Plikach: {app} → Backup (można ją zaimportować). | app/more/settings.tsx | tests/matrix-ui.test.tsx |
| usunięte | app/history/edit/[id].tsx | tests/audit-0.10-ui.test.tsx, tests/integration-090.test.tsx, tests/locations-model.test.ts +9 |
| Usunięte ćwiczenie | app/history/edit/[id].tsx | tests/matrix-logic.test.tsx, tests/swap-ui.test.tsx |
| usunięte ćwiczenie (w bieżącym treningu) | app/(tabs)/exercises.tsx | tests/matrix-logic.test.tsx, tests/regress.test.tsx |
| usunięte ćwiczenie z historią | app/(tabs)/exercises.tsx | tests/matrix-logic.test.tsx, tests/regress.test.tsx, tests/scenario-full.test.tsx |
| Usunięte: {list}. | lib/tplsync.ts | tests/audit-0.10-ui.test.tsx |
| usunięty szablon | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/matrix-invariants.test.ts |
| Usuń talerz | components/LoadEditor.tsx | tests/scenario-full.test.tsx, tests/swipe-delete.test.tsx |
| Utwórz pierwszy szablon albo wygeneruj szablony i plan. | components/Dashboard.tsx | tests/dashboard.test.tsx, tests/edit-on-demand.test.tsx, tests/flows.test.tsx +3 |
| Uwaga: {a} i {b} dzień po dniu — te same główne partie. | components/DayPanel.tsx | tests/plan-calendar-ui.test.tsx |
| Uwaga: zmiana sprzętu, trybu liczenia lub metryki przelicza też dawne treningi (objętość, rekordy, wykresy). | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| W „Inne plany” jest już {n} planów — usuń któryś, by dodać nowy. | app/generator.tsx | tests/audit-0.10-plan-ui.test.tsx |
| w archiwum | app/template/[id].tsx | tests/edit-on-demand.test.tsx |
| W historii serie z tą gumą pokażą „?”. | app/more/bands.tsx | tests/matrix-ui.test.tsx |
| W Kalendarzu „Plan tygodnia” przypisuje szablony do dni — plan powtarza się co tydzień. | lib/guide.ts | tests/guide.test.tsx |
| W Kalendarzu stuknij sesję, potem „Edytuj” — zmiany zapisuje „Zapisz”, „Anuluj” je odrzuca. | lib/guide.ts | tests/guide.test.tsx |
| W Kalendarzu: stuknij dzień, potem „Więcej opcji” → „Oznacz tydzień jako deload” — także przyszły tydzień. | lib/guide.ts | tests/guide.test.tsx |
| w planie na: {day} · {n} ćw. | components/StartPanel.tsx | tests/home-b.test.tsx |
| W planie tygodnia: {days} — te dni będą wolne. | lib/plan.ts | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts |
| W tej wersji | components/WhatsNew.tsx | tests/whats-new.test.tsx |
| W trakcie | lib/figures/index.ts | tests/figures.test.tsx |
| W trwającym treningu guma zniknie z nieodhaczonych serii. | app/more/bands.tsx | tests/matrix-ui.test.tsx |
| W trwającym treningu zostanie oznaczone jako usunięte. | app/(tabs)/exercises.tsx | tests/matrix-ui.test.tsx |
| W tygodniu deload „Start” i „Powtórz ostatni” zaproponują „Mniej serii”: {less}; ciężary i szablon bez zmian. | lib/guide.ts | tests/guide.test.tsx |
| W zakładce Szablony „+ Nowy” tworzy szablon: ćwiczenia, serie, zakres powtórzeń i przerwy. | lib/guide.ts | tests/guide.test.tsx |
| W zapisanych planach: {names}. | lib/plan.ts | tests/audit-0.10-plan.test.ts |
| Wartości zmienisz w wierszu serii poniżej. | components/ActiveWorkout.tsx | tests/tuleja.test.tsx |
| wcześniej zamieniane | lib/swap.ts | tests/swap-top3.test.ts |
| Wersja testowa {n} · {date} | components/WhatsNew.tsx | tests/whats-new.test.tsx |
| Wiersz w ramce — tydzień deload. | components/HistoryCalendar.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/deload-ui.test.tsx |
| więcej | components/MuscleMap.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit-0.10-live-logic.test.ts +12 |
| Więcej | app/(tabs)/_layout.tsx | tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx, tests/audit-k1-fala2b.test.tsx +14 |
| Więcej → Kopia zapasowa: eksport wszystkich danych do pliku i import z pliku. | lib/guide.ts | tests/guide.test.tsx |
| Więcej → Miejsca i sprzęt: dom, siłownia, hotel — każdy ze swoim sprzętem i ciężarami. | lib/guide.ts | tests/guide.test.tsx |
| Więcej → Postępy: podsumowanie tygodnia lub miesiąca z poprzednim okresem obok. | lib/guide.ts | tests/guide.test.tsx |
| Więcej dni niż szablonów: szablony po kolei (A, B, A…), jak w generatorze — konwencja. | components/OwnPlan.tsx | tests/plan-own-templates-ui.test.tsx |
| Włącz powiadomienia dla {app} w Ustawieniach iOS. | app/more/settings.tsx | tests/matrix-ui.test.tsx |
| wolne | components/TodayPlan.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts, tests/guide.test.tsx +2 |
| Wolne w tym dniu | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-k1-fala2b.test.tsx, tests/plan-calendar-ui.test.tsx |
| Wpisane wartości zamiennika przepadną. | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Wpisz ciężar i powtórzenia, odhacz serię ✓ — przerwa odlicza się sama. | lib/guide.ts | tests/guide.test.tsx |
| Wpisz liczbę sekund od 0 do {n}. | components/ActiveWorkout.tsx | tests/audit-0.10-ui.test.tsx |
| Wpisz masę ciała. | app/more/bodymass.tsx | tests/audit-0.10-data-ui.test.tsx |
| wpisz uchwyt i talerze | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| wpisz zakres na stronę i krok | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Wrócą zmiany pojedynczych dni zapisane z tym planem: {n}. | lib/plan.ts | tests/audit-0.10-gen.test.ts, tests/audit-0.10-plan.test.ts |
| Wróć do treningu | app/template/[id].tsx | tests/edit-on-demand.test.tsx |
| Wskazówki | components/ExerciseCues.tsx | tests/audit-k1-bl-mer.test.tsx, tests/cues.test.tsx |
| Wstaw ciężary modelu | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| wszystkie ćwiczenia, także niszowe | components/LibScope.tsx | tests/catalog-library25.test.tsx |
| Wszystkie serie odhaczone | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/skip-today.test.tsx, tests/tuleja.test.tsx |
| Wybierz co najmniej jeden szablon. | components/OwnPlan.tsx | tests/audit-k1-bl-mer.test.tsx, tests/plan-own-templates-ui.test.tsx |
| Wybierz ćwiczenie | app/_layout.tsx | tests/matrix-ui.test.tsx |
| Wybierz dni treningowe: {n}. | components/DayPicker.tsx | tests/gen-days-ui.test.tsx, tests/plan-own-templates-ui.test.tsx |
| Wybierz dni treningowe: od {a} do {b}. | components/DayPicker.tsx | tests/gen-days-ui.test.tsx, tests/plan-own-templates-ui.test.tsx |
| Wybierz szablon na ten dzień. | app/plan.tsx | tests/audit-0.10-plan-ui.test.tsx |
| wyciąg | lib/swap.ts | tests/audit-0.10-gen-ui.test.tsx, tests/locations-audit.test.tsx, tests/scenario-full.test.tsx |
| Wyczyścić wszystkie dane? | app/more/settings.tsx | tests/audit-0.10-ui.test.tsx, tests/audit-io-more.test.tsx, tests/audit-r83.test.tsx +5 |
| Wygenerowane | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx, tests/generator-ui.test.tsx, tests/generator.test.ts +3 |
| Wykres, {n} {s}: od {a} ({x}) do {b} ({y}), najlepiej {c} ({z}). | components/Chart.tsx | tests/matrix-ui.test.tsx |
| Wykresy ćwiczeń i rekordy; rekord w trakcie treningu widać przy serii. | lib/guide.ts | tests/guide.test.tsx |
| Wykresy pojawią się po pierwszym zakończonym treningu. | app/more/progress.tsx | tests/guide.test.tsx, tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx +4 |
| Wypada treningów: {n} | components/DayPanel.tsx | tests/plan-calendar-ui.test.tsx, tests/plan-calendar.test.ts |
| Wypełnij zakresem | components/LoadEditor.tsx | tests/audit-0.10-ui.test.tsx, tests/audit-r82c.test.tsx, tests/locations-audit.test.tsx +3 |
| Wysiłek: zwykle {a}–{b} powtórzenia w zapasie (ACSM 2026: blisko upadku albo {c}–{d}; dokładnej liczby nie ustalono); do upadku nie trzeba. | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx |
| Wysiłek: zwykle {a}–{b} powtórzenia w zapasie (RIR); do upadku nie trzeba. | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit-0.10-ui.test.tsx |
| wyszukiwanie obejmuje też niszowe | components/LibScope.tsx | tests/catalog-library25.test.tsx |
| Wyślij dane | app/_layout.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Wyświetlane jako: {n} | app/exercise/[id].tsx | tests/matrix-ui.test.tsx |
| Wznów animację | components/ExerciseFigure.tsx | tests/figures.test.tsx, tests/maestro-selectors.test.ts |
| Wznów trening | components/ActiveWorkout.tsx | tests/pause.test.tsx |
| Za dużo ciężarów (najwyżej {n}). | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Za dużo kombinacji talerzy — ciężary nie są liczone. Usuń nietypowe talerze. | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Za dużo rodzajów talerzy (najwyżej {n}). | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Za dużo ustawień (najwyżej {n}) — zwiększ krok. | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Za dużo zapisanych planów | app/generator.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/plan-own-templates-ui.test.tsx |
| Zacząć z mniejszą liczbą serii: {a} zamiast {b} serii roboczych? Ciężary bez zmian, szablon się nie zmienia. | lib/start.ts | tests/audit-0.10-live.test.tsx, tests/deload-ui.test.tsx |
| Zacznij z szablonu | app/(tabs)/index.tsx | tests/edit-history.test.tsx, tests/guide.test.tsx, tests/matrix-dim-langs1.test.tsx +5 |
| Zaczynasz od tej wersji — poniżej zmiany dla osób, które korzystały z poprzednich. Na start przyda się przewodnik. | components/WhatsNew.tsx | tests/audit-0.10-ui.test.tsx |
| Zaimportowano | app/more/backup.tsx | tests/scenario-full.test.tsx |
| zakładka, {i} z {n} | app/(tabs)/_layout.tsx | tests/matrix-a11y.test.tsx, tests/motyw.test.tsx, tests/regress.test.tsx +2 |
| Zakończ trening | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-tst-ui.test.tsx, tests/audit-backlog-r75.test.tsx +18 |
| Zakończyć trening? | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/audit-0.10-tst-ui.test.tsx, tests/audit-0.10-ui.test.tsx +19 |
| zakres | app/template/[id].tsx | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-tst-ui.test.tsx, tests/audit-0.10-ui.test.tsx +11 |
| Zakres jest niepoprawny: „do” musi być ≥ „od”, krok > 0, wartości od {a} do {b}. | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Zakres jest niepoprawny: „max” musi być ≥ „min”, krok > 0. Ciężary nie są liczone. | components/LoadEditor.tsx | tests/matrix-ui.test.tsx |
| Zakres powtórzeń: {r} — gdy ostatnio wszystkie serie robocze miały co najmniej {n} powt., przy ćwiczeniu pojawi się podpowiedź „↑ spróbuj …”: większy ciężar albo powtórzenie więcej (poza tygodniem deload). | app/template/[id].tsx | tests/audit-0.10-stats-ui.test.tsx, tests/matrix-ui.test.tsx |
| Zakresy powtórzeń (masa {a}–{b}, w domu i bez obciążenia {c}–{d}; przy sile dodatkowe {e}–{f}) to uproszczenie: mięśnie rosną przy szerokim zakresie ciężarów, gdy serie są blisko upadku (ACSM, przeglądy badań). | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx |
| Zaktualizować szablon „{name}”? | components/ActiveWorkout.tsx | tests/audit-0.10-ui.test.tsx, tests/live2-split-template.test.tsx |
| Zamiana tylko w tym treningu: {name} | app/swap.tsx | tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx |
| zamiast: {name} | app/swap.tsx | tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx, tests/swap-ui.test.tsx |
| Zamienniki | app/template/[id].tsx | tests/matrix-ui.test.tsx |
| Zamień ćwiczenie | app/_layout.tsx | tests/audit-0.10-live.test.tsx, tests/backlog-0410.test.tsx, tests/catalog-full.test.tsx +5 |
| Zamień z {day} ({name}) | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/plan-calendar-ui.test.tsx |
| Zapamiętać dla tego ćwiczenia? | components/ActiveWorkout.tsx | tests/scenario-full.test.tsx |
| Zapisać zmiany? | app/history/edit/[id].tsx | tests/backlog-0.10.1-dane-ui.test.tsx, tests/edit-history.test.tsx, tests/integration-090.test.tsx +2 |
| Zapisałem trening | app/_layout.tsx | tests/audit-close2-a.test.tsx, tests/audit-final2-fg.test.tsx, tests/matrix-ui.test.tsx +1 |
| Zapisane zostaną serie robocze: {n}. | components/ActiveWorkout.tsx | tests/audit-0.10-live.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx, tests/regress.test.tsx +1 |
| Zapisano | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/generator-ui.test.tsx, tests/matrix-i18n.test.tsx +3 |
| Zapisany czas zostanie nadpisany. | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Zapisuje zamiennik w szablonie dla tego miejsca. | components/ActiveWorkout.tsx | tests/matrix-ui.test.tsx |
| Zapisz ćwiczenie | app/exercise/[id].tsx | tests/app.tsx, tests/edit-on-demand.test.tsx |
| Zapisz szablon | app/template/[id].tsx | tests/app.tsx, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-plan-ui.test.tsx +13 |
| zaplanowane | components/HistoryCalendar.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/deload-ui.test.tsx +4 |
| Zaplanowany też na: {days} — te dni będą wolne. | lib/plan.ts | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts |
| zaplanowany: {name} | components/HistoryCalendar.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/motyw.test.tsx, tests/plan-calendar-ui.test.tsx |
| Zaplanowany: {name} | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/plan-calendar-ui.test.tsx, tests/plan-own-templates-ui.test.tsx |
| Zastąpić poprzednio wygenerowane, nieużywane szablony? | app/generator.tsx | tests/audit-0.10-gen-ui.test.tsx, tests/ux2-08-gen-replace-active.test.tsx |
| Zastąpić wpisane ciężary? | components/LoadEditor.tsx | tests/locations-audit.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Zatrzymaj animację | components/ExerciseFigure.tsx | tests/figures.test.tsx, tests/maestro-selectors.test.ts |
| Zegar treningu stoi i pauza nie wlicza się do czasu trwania. Przerwa między seriami liczy dalej; odhaczenie serii wznawia trening. | components/ActiveWorkout.tsx | tests/pause.test.tsx |
| zębaty przedni | app/exercise/[id].tsx | tests/audit-0.10-ui.test.tsx |
| zginacze biodra | app/exercise/[id].tsx | tests/audit-0.10-ui.test.tsx |
| Zgody na powiadomienia jeszcze nie ma — „Sprawdź zgodę na powiadomienia” poprosi o nią. | app/more/settings.tsx | tests/audit-0.10-plan-ui.test.tsx |
| zmiana planu | components/DayPanel.tsx | tests/plan-calendar-ui.test.tsx, tests/plan-own-templates-ui.test.tsx |
| zmiany dni: {n} | app/plan.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/matrix-invariants.test.ts |
| Zmiany nie trafiają do Apple Health. | app/history/edit/[id].tsx | tests/edit-history.test.tsx |
| Zmiany pojedynczych dni zapisane z tym planem: {n} — wrócą po aktywacji. | app/plan.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Zmiany sięgają dalej niż {n} dni. | components/DayPanel.tsx | tests/plan-calendar-ui.test.tsx |
| Zmiany w trakcie treningu | lib/guide.ts | tests/guide.test.tsx |
| Zmienione dni: {n} | components/DayPanel.tsx | tests/plan-calendar-ui.test.tsx |
| Zmierzyć serię od nowa? | components/ActiveWorkout.tsx | tests/audit-close-b.test.tsx, tests/audit-close2-c.test.tsx, tests/audit-final-timer.test.tsx +4 |
| Zniknie z list i szablonów; historia, wykresy i eksport zostaną. | app/(tabs)/exercises.tsx | tests/audit-0.10-data-ui.test.tsx, tests/matrix-ui.test.tsx, tests/scenario-full.test.tsx |
| Zniknie z list i szablonów. | app/(tabs)/exercises.tsx | tests/scenario-full.test.tsx |
| zrobione | components/Dashboard.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/dashboard.test.tsx, tests/flows.test.tsx +6 |
| zrobione: {name} | components/TodayPlan.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/motyw.test.tsx, tests/plan-calendar-ui.test.tsx |
| Zrobione: {name} | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx |
| zrobiony inny trening | components/HistoryCalendar.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/motyw.test.tsx |
| zrobiony inny trening: {name} | components/TodayPlan.tsx | tests/audit-0.10-plan-ui.test.tsx, tests/motyw.test.tsx |
| Zrobiony inny trening: {name} | components/DayPanel.tsx | tests/audit-0.10-plan-ui.test.tsx |
| Zwiń inne ćwiczenia | app/swap.tsx | tests/catalog-full.test.tsx, tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| Zwykle w: {l} — {name}. Zamienić? | components/ActiveWorkout.tsx | tests/scenario-full.test.tsx, tests/swap-alternates.test.tsx |

## LOGIKA

| Pozycja | Źródło | Testy (pierwsze 3) |
|---|---|---|
| backup.buildBackup | lib/backup.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/audit-0.10-live-logic.test.ts +24 |
| backup.cleanShareLeftovers | lib/backup.ts | tests/audit-0.10-data-ui.test.tsx |
| backup.exportBackup | lib/backup.ts | tests/audit-0.10-data-ui.test.tsx, tests/matrix-logic.test.tsx |
| backup.autoBackup | lib/backup.ts | tests/audit-backlog-r75.test.tsx, tests/audit-r83.test.tsx, tests/audit-r83b.test.tsx +6 |
| backup.safetyBackup | lib/backup.ts | tests/audit-r83b.test.tsx, tests/matrix-logic.test.tsx |
| backup.safetyRecoveryNote | lib/backup.ts | tests/matrix-logic.test.tsx |
| backup.isSafetyError | lib/backup.ts | tests/matrix-logic.test.tsx |
| backup.onWorkoutSaved | lib/backup.ts | tests/audit-0.10-data.test.ts |
| backup.onHistoryEdited | lib/backup.ts | tests/matrix-logic.test.tsx |
| backup.strongDur | lib/backup.ts | tests/audit-0.10-stats.test.ts |
| backup.buildCsv | lib/backup.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-stats.test.ts, tests/audit-backlog-q.test.tsx +22 |
| backup.exportCsv | lib/backup.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-backlog-q.test.tsx, tests/matrix-data-fuzz.test.ts |
| backup.parseBackup | lib/backup.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/audit-0.10-live-logic.test.ts +28 |
| backup.recheckHealthAfterImport | lib/backup.ts | tests/audit-io-flows.test.tsx |
| backup.importBackup | lib/backup.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-journey-c.test.tsx, tests/matrix-data-fuzz.test.ts |
| backup.exportRawData | lib/backup.ts | tests/audit-0.10-plan.test.ts |
| backup.exportRecovery | lib/backup.ts | tests/matrix-logic.test.tsx |
| brandIcon.iconColors | lib/brandIcon.ts | tests/intro.test.tsx |
| calendar.dayKey | lib/calendar.ts | tests/history-calendar.test.tsx |
| calendar.monthGrid | lib/calendar.ts | tests/history-calendar.test.tsx |
| calendar.workoutsByDay | lib/calendar.ts | tests/history-calendar.test.tsx |
| calendar.shiftMonth | lib/calendar.ts | tests/history-calendar.test.tsx |
| calendar.weekdayLabels | lib/calendar.ts | tests/gen-days.test.ts, tests/history-calendar.test.tsx |
| calendar.weekdayNames | lib/calendar.ts | tests/gen-days.test.ts |
| calendar.monthTitle | lib/calendar.ts | tests/history-calendar.test.tsx |
| calendar.dayTitle | lib/calendar.ts | tests/history-calendar.test.tsx |
| cues/index.cueText | lib/cues/index.ts | tests/audit-k1-bl-mer.test.tsx, tests/cues-lazy.test.ts, tests/cues.test.tsx +1 |
| cues/index.cueDict | lib/cues/index.ts | tests/audit-k1-bl-mer.test.tsx, tests/cues-lazy.test.ts, tests/cues.test.tsx |
| cues/index.hasCues | lib/cues/index.ts | tests/audit-k1-fala2b.test.tsx |
| cues/index.cuesFor | lib/cues/index.ts | tests/audit-0.10-lang-ui.test.tsx, tests/cues-lazy.test.ts, tests/cues.test.tsx +1 |
| cues/index.cueBasis | lib/cues/index.ts | tests/audit-k1-bl-mer.test.tsx |
| cues/index.cueOrgs | lib/cues/index.ts | tests/cues.test.tsx |
| dashboard.weekStrip | lib/dashboard.ts | tests/audit-0.10-plan.test.ts, tests/dashboard.test.tsx, tests/matrix-invariants.test.ts +1 |
| dashboard.weekTiles | lib/dashboard.ts | tests/audit-0.10-plan.test.ts, tests/audit-0.10-stats.test.ts, tests/dashboard.test.tsx +2 |
| dashboard.lastWorkout | lib/dashboard.ts | tests/audit-0.10-stats.test.ts, tests/dashboard.test.tsx, tests/mutation-bounds.test.ts |
| dashboard.emptyTemplates | lib/dashboard.ts | tests/first-steps-empty.test.tsx |
| dashboard.firstSteps | lib/dashboard.ts | tests/audit-0.10-plan.test.ts, tests/dashboard.test.tsx, tests/mutation-bounds.test.ts |
| deload-sets.deloadKeep | lib/deload-sets.ts | tests/audit-0.10-live-logic.test.ts, tests/deload-plan.test.ts, tests/deload-ui.test.tsx +1 |
| deload-sets.deloadSets | lib/deload-sets.ts | tests/deload-plan.test.ts, tests/mutation-bounds.test.ts |
| deload.nextMonday | lib/deload.ts | tests/deload-plan.test.ts, tests/mutation-bounds.test.ts |
| deload.trainingStreakWeeks | lib/deload.ts | tests/deload-plan.test.ts, tests/mutation-bounds.test.ts |
| deload.deloadHint | lib/deload.ts | tests/audit-0.10-plan.test.ts, tests/deload-plan.test.ts, tests/mutation-bounds.test.ts |
| deload.snoozeDeloadHint | lib/deload.ts | tests/audit-0.10-plan.test.ts |
| draft.beginObjDraft | lib/draft.ts | tests/audit-k1-fala2b.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx, tests/backlog-0.10.1-dane.test.ts +2 |
| draft.objDraft | lib/draft.ts | tests/app.tsx, tests/audit-k1-fala2b.test.tsx, tests/backlog-0.10.1-dane.test.ts +2 |
| draft.objDirty | lib/draft.ts | tests/backlog-0.10.1-dane.test.ts, tests/edit-on-demand.test.tsx |
| draft.noteDraftEffect | lib/draft.ts | tests/audit-k1-fala2b.test.tsx, tests/matrix-invariants.test.ts |
| draft.discardObjDraft | lib/draft.ts | tests/audit-k1-fala2b.test.tsx, tests/backlog-0.10.1-dane.test.ts, tests/edit-on-demand.test.tsx +1 |
| draft.cleanName | lib/draft.ts | tests/edit-on-demand.test.tsx |
| draft.commitObjDraft | lib/draft.ts | tests/audit-k1-fala2b.test.tsx, tests/backlog-0.10.1-dane.test.ts, tests/edit-on-demand.test.tsx +1 |
| draft.templateForEdit | lib/draft.ts | tests/edit-on-demand.test.tsx |
| draft.dropUnsavedNew | lib/draft.ts | tests/edit-on-demand.test.tsx |
| draft.restoreObjDrafts | lib/draft.ts | tests/backlog-0.10.1-dane.test.ts |
| draft.dropRestored | lib/draft.ts | tests/backlog-0.10.1-dane.test.ts |
| draft.__resetObjDrafts | lib/draft.ts | tests/audit-k1-fala2b.test.tsx, tests/b2-plan-own-templates.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx +9 |
| edit.touchDraft | lib/edit.ts | tests/edit-history.test.tsx, tests/integration-090.test.tsx, tests/matrix-invariants.test.ts +1 |
| edit.useDraftTick | lib/edit.ts | tests/matrix-logic.test.tsx |
| edit.draftOf | lib/edit.ts | tests/audit-0.10-data.test.ts, tests/audit-r83b.test.tsx, tests/backlog-0410.test.tsx +4 |
| edit.discardDraft | lib/edit.ts | tests/edit-history.test.tsx, tests/edit-on-demand.test.tsx, tests/matrix-invariants.test.ts +3 |
| edit.dateText | lib/edit.ts | tests/backlog-0.10.1-dane-ui.test.tsx, tests/backlog-0.10.1-dane.test.ts, tests/edit-history.test.tsx +3 |
| edit.timeText | lib/edit.ts | tests/backlog-0.10.1-dane-ui.test.tsx, tests/backlog-0.10.1-dane.test.ts, tests/edit-history.test.tsx +2 |
| edit.minText | lib/edit.ts | tests/matrix-logic.test.tsx |
| edit.isDirty | lib/edit.ts | tests/matrix-logic.test.tsx |
| edit.beginEdit | lib/edit.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-live-logic.test.ts, tests/audit-r83b.test.tsx +11 |
| edit.defaultPastWhen | lib/edit.ts | tests/edit-history.test.tsx, tests/matrix-time.test.ts |
| edit.beginPast | lib/edit.ts | tests/audit-0.10-data.test.ts, tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx +11 |
| edit.prefilledOffList | lib/edit.ts | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx |
| edit.draftSetWhen | lib/edit.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-live-logic.test.ts, tests/backlog-0.10.1-dane.test.ts +5 |
| edit.draftAddExercise | lib/edit.ts | tests/audit-0.10-data.test.ts, tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx +8 |
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
| edit.commitDraft | lib/edit.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-live-logic.test.ts, tests/backlog-0.10.1-dane.test.ts +9 |
| edit.__resetDrafts | lib/edit.ts | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx +7 |
| equipment.capLabel | lib/equipment.ts | tests/matrix-logic.test.tsx, tests/sec2-01-names.test.ts |
| equipment.equipById | lib/equipment.ts | tests/bar-no-plates.test.tsx, tests/catalog-library25.test.tsx, tests/locations-catalog.test.ts +3 |
| equipment.equipLabel | lib/equipment.ts | tests/app.tsx, tests/audit-k1-brands.test.ts, tests/locations-audit.test.tsx +2 |
| equipment.blankLoad | lib/equipment.ts | tests/matrix-dim-equipment.test.tsx, tests/matrix-logic.test.tsx |
| equipment.applyLoadPreset | lib/equipment.ts | tests/matrix-dim-equipment.test.tsx, tests/xcheck-0610b.test.tsx |
| equipment.equipEntry | lib/equipment.ts | tests/audit-0.10-tst.test.ts, tests/audit-0.10-ui.test.tsx, tests/audit-r82.test.tsx +10 |
| equipment.presetEquipment | lib/equipment.ts | tests/audit-0.10-gen.test.ts, tests/catalog-full.test.tsx, tests/catalog-library25.test.tsx +10 |
| equipment.presetHint | lib/equipment.ts | tests/audit-0.10-gen.test.ts, tests/catalog-library25.test.tsx |
| equipment.fillEquip2 | lib/equipment.ts | tests/catalog-library25.test.tsx |
| equipment.fillOpts | lib/equipment.ts | tests/matrix-logic.test.tsx |
| equipment.fillGym | lib/equipment.ts | tests/matrix-logic.test.tsx |
| equipment.allLabels | lib/equipment.ts | tests/i18n-locales.test.ts, tests/matrix-i18n.test.tsx |
| equipment.capsOf | lib/equipment.ts | tests/audit-0.10-tst.test.ts, tests/catalog-full.test.tsx, tests/catalog-v2.test.ts +4 |
| equipment.availability | lib/equipment.ts | tests/catalog-full.test.tsx, tests/catalog-library25.test.tsx, tests/catalog-v2.test.ts +9 |
| equipment.missingLabel | lib/equipment.ts | tests/locations-catalog.test.ts |
| equipment.loadKindsFor | lib/equipment.ts | tests/locations-catalog.test.ts, tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-equipment.test.tsx +1 |
| equipment.loadsFor | lib/equipment.ts | tests/audit-r82b.test.tsx, tests/catalog-v2.test.ts, tests/decisions-0310.test.tsx +7 |
| equipment.implAt | lib/equipment.ts | tests/decisions-0310.test.tsx, tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-equipment.test.tsx +1 |
| equipment.implsAt | lib/equipment.ts | tests/audit-k1-log.test.ts, tests/catalog-v2.test.ts, tests/matrix-dim-equipment.test.tsx +2 |
| equipment.plateSpecFor | lib/equipment.ts | tests/tuleja.test.tsx |
| equipvis.implFor | lib/equipvis.ts | tests/karta-sprzet.test.tsx, tests/matrix-karta.test.tsx |
| equipvis.stackWindow | lib/equipvis.ts | tests/karta-sprzet.test.tsx |
| equipvis.nearestLoad | lib/equipvis.ts | tests/audit-0.10-live-logic.test.ts |
| equipvis.equipVisFor | lib/equipvis.ts | tests/audit-0.10-tst-ui.test.tsx, tests/karta-sprzet.test.tsx, tests/matrix-karta.test.tsx |
| equipvis.bandHex | lib/equipvis.ts | tests/karta-sprzet.test.tsx |
| equipvis.equipSlotFor | lib/equipvis.ts | tests/karta-sprzet.test.tsx |
| figures/geom.side | lib/figures/geom.ts | tests/figures.test.tsx, tests/tuleja.test.tsx |
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
| figures/geom.shapes | lib/figures/geom.ts | tests/figures.test.tsx, tests/muscle-map.test.tsx |
| figures/geom.bounds | lib/figures/geom.ts | tests/figures.test.tsx |
| figures/index.figureFor | lib/figures/index.ts | tests/audit-0.10-lang-ui.test.tsx, tests/figures.test.tsx, tests/sec2-01-names.test.ts |
| figures/index.figureByKey | lib/figures/index.ts | tests/figures.test.tsx |
| figures/index.figureLabel | lib/figures/index.ts | tests/figures.test.tsx |
| figures/index.frameLabel | lib/figures/index.ts | tests/figures.test.tsx |
| figures/index.figureFrames | lib/figures/index.ts | tests/figures.test.tsx |
| figures/index.toSvg | lib/figures/index.ts | tests/figures.test.tsx |
| figures/index.svgPath | lib/figures/index.ts | tests/figures.test.tsx |
| figures/index.figureAt | lib/figures/index.ts | tests/figures.test.tsx |
| generator.cardioCount | lib/generator.ts | tests/gen-days.test.ts, tests/generator.test.ts |
| generator.setsBudget | lib/generator.ts | tests/audit-0.10-gen.test.ts, tests/generator.test.ts |
| generator.splitFor | lib/generator.ts | tests/audit-0.10-gen.test.ts, tests/generator.test.ts, tests/mutation-generator.test.ts |
| generator.bestDays | lib/generator.ts | tests/audit-0.10-gen.test.ts, tests/mutation-generator.test.ts, tests/plan-own-templates.test.ts |
| generator.pickDays | lib/generator.ts | tests/gen-days-ui.test.tsx, tests/gen-days.test.ts, tests/generator-ui.test.tsx +1 |
| generator.assignDays | lib/generator.ts | tests/gen-days.test.ts |
| generator.hasExternalLoad | lib/generator.ts | tests/audit-0.10-gen.test.ts, tests/mutation-generator.test.ts |
| generator.sessionName | lib/generator.ts | tests/generator-ui.test.tsx |
| generator.goalLabel | lib/generator.ts | tests/generator-ui.test.tsx |
| generator.weekLoad | lib/generator.ts | tests/plan-own-templates.test.ts |
| generator.generate | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit-0.10-stats.test.ts +10 |
| generator.genCount | lib/generator.ts | tests/gen-days.test.ts |
| generator.genProposal | lib/generator.ts | tests/gen-days-ui.test.tsx, tests/gen-days.test.ts, tests/generator-ui.test.tsx |
| generator.previewWarnings | lib/generator.ts | tests/audit-0.10-gen.test.ts, tests/audit011-gen.test.tsx, tests/gen-days.test.ts +1 |
| generator.genPlanName | lib/generator.ts | tests/audit-0.10-gen.test.ts, tests/gen-days.test.ts, tests/mutation-generator.test.ts |
| generator.genNote | lib/generator.ts | tests/audit-0.10-gen.test.ts |
| generator.genFolder | lib/generator.ts | tests/audit-0.10-gen.test.ts |
| generator.replaceable | lib/generator.ts | tests/audit-0.10-gen.test.ts, tests/audit011-gen.test.tsx, tests/mutation-generator.test.ts +1 |
| generator.saveGenerated | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit011-gen.test.tsx +6 |
| generator.ownTemplates | lib/generator.ts | tests/matrix-invariants.test.ts, tests/plan-own-templates.test.ts |
| generator.ownSessionsFor | lib/generator.ts | tests/gen-days.test.ts, tests/plan-own-templates.test.ts |
| generator.ownPlan | lib/generator.ts | tests/gen-days-ui.test.tsx, tests/gen-days.test.ts, tests/matrix-invariants.test.ts +2 |
| generator.ownProposal | lib/generator.ts | tests/gen-days-ui.test.tsx, tests/gen-days.test.ts, tests/plan-own-templates-ui.test.tsx |
| generator.ownWarnings | lib/generator.ts | tests/gen-days.test.ts, tests/plan-own-templates.test.ts |
| generator.ownCounts | lib/generator.ts | tests/plan-own-templates.test.ts |
| generator.ownPlanName | lib/generator.ts | tests/plan-own-templates.test.ts |
| generator.saveOwnPlan | lib/generator.ts | tests/matrix-invariants.test.ts, tests/plan-own-templates.test.ts |
| guide.guideSeen | lib/guide.ts | tests/audit-0.10-ui.test.tsx, tests/guide.test.tsx, tests/migrate-idem.test.ts |
| guide.guideProgress | lib/guide.ts | tests/guide.test.tsx |
| guide.markGuideSeen | lib/guide.ts | tests/guide.test.tsx |
| health.workoutActivityType | lib/health.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-gen.test.ts |
| health.ensureAuthorization | lib/health.ts | tests/regress.test.tsx |
| health.healthStart | lib/health.ts | tests/pause.test.tsx |
| health.saveWorkout | lib/health.ts | tests/audit-0.10-stats.test.ts, tests/edit-history.test.tsx, tests/pause.test.tsx +2 |
| health.healthPending | lib/health.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/matrix-invariants.test.ts +1 |
| health.syncAfterFinish | lib/health.ts | tests/audit-0.10-data.test.ts, tests/audit-io-more.test.tsx, tests/swap-history.test.tsx |
| health.retryHealth | lib/health.ts | tests/audit-0.10-data.test.ts, tests/matrix-invariants.test.ts |
| home.startableTemplates | lib/home.ts | tests/home-b.test.tsx |
| home.mainStart | lib/home.ts | tests/home-b.test.tsx |
| home.otherStarts | lib/home.ts | tests/home-b.test.tsx |
| home.planSummary | lib/home.ts | tests/home-b.test.tsx |
| i18n.isLang | lib/i18n.ts | tests/matrix-logic.test.tsx |
| i18n.detectLang | lib/i18n.ts | tests/matrix-logic.test.tsx |
| i18n.applyLang | lib/i18n.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/audit-0.10-gen-ui.test.tsx +59 |
| i18n.lang | lib/i18n.ts | tests/gen-days-ui.test.tsx, tests/helpers.ts, tests/i18n-locales.test.ts +11 |
| i18n.appName | lib/i18n.ts | tests/i18n-locales.test.ts |
| i18n.deviceUnit | lib/i18n.ts | tests/audit-0.10-tst.test.ts, tests/audit-0.10-ui.test.tsx, tests/maestro-selectors.test.ts |
| i18n.locale | lib/i18n.ts | tests/app.tsx, tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-gen-ui.test.tsx +55 |
| i18n.decimalComma | lib/i18n.ts | tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx, tests/matrix-dim-langs3.test.tsx +3 |
| i18n.t | lib/i18n.ts | tests/app.tsx, tests/audit-0.10-data.test.ts, tests/audit-0.10-gen-ui.test.tsx +88 |
| i18n.lbl | lib/i18n.ts | tests/audit-0.10-live-logic.test.ts, tests/audit-close2-b.test.tsx, tests/audit-journey-c.test.tsx +5 |
| i18n.tp | lib/i18n.ts | tests/audit-0.10-gen.test.ts, tests/audit-0.10-tst.test.ts, tests/audit-k1-bl-mer.test.tsx +18 |
| i18n.exName | lib/i18n.ts | tests/audit-close2-a.test.tsx, tests/audit-close2-b.test.tsx, tests/audit-final-auto.test.tsx +25 |
| i18n.collator | lib/i18n.ts | tests/audit-0.10-data.test.ts |
| i18n.fold | lib/i18n.ts | tests/catalog-v2.test.ts, tests/i18n-multi.test.ts |
| i18n.upper | lib/i18n.ts | tests/audit-0.10-lang.test.ts |
| i18n.glue | lib/i18n.ts | tests/audit-0.10-lang-ui.test.tsx |
| i18n.tIn | lib/i18n.ts | tests/gen-days-ui.test.tsx, tests/i18n-multi.test.ts, tests/matrix-dim-catalog.test.tsx |
| intro.introPieces | lib/intro.ts | tests/intro.test.tsx |
| intro.easeOutCubic | lib/intro.ts | tests/intro.test.tsx |
| intro.pieceOffset | lib/intro.ts | tests/intro.test.tsx |
| intro.introFrame | lib/intro.ts | tests/intro.test.tsx |
| intro.introMode | lib/intro.ts | tests/intro.test.tsx |
| intro.takeColdStart | lib/intro.ts | tests/intro.test.tsx |
| intro.__resetIntroForTests | lib/intro.ts | tests/app.tsx, tests/intro.test.tsx |
| live.setMarkOf | lib/live.ts | tests/audit-0.10-live-logic.test.ts |
| live.setLabel | lib/live.ts | tests/audit-0.10-live-logic.test.ts |
| live.restLabel | lib/live.ts | tests/audit-0.10-live-logic.test.ts |
| live.nowParts | lib/live.ts | tests/audit-0.10-live-logic.test.ts, tests/catalog-library25.test.tsx |
| live.focusCounter | lib/live.ts | tests/audit-0.10-live-logic.test.ts |
| loadcap.heavyLoadCaps | lib/loadcap.ts | tests/audit-k1-bl-mer.test.tsx |
| loadcap.loadCapWarning | lib/loadcap.ts | tests/audit-k1-bl-mer.test.tsx |
| loads.toKg | lib/loads.ts | tests/locations-loads.test.ts, tests/matrix-dim-catalog.test.tsx, tests/tuleja.test.tsx |
| loads.rangeCount | lib/loads.ts | tests/locations-verify2.test.tsx |
| loads.rangeValues | lib/loads.ts | tests/locations-audit.test.tsx, tests/locations-loads.test.ts, tests/locations-verify2.test.tsx +1 |
| loads.fillRange | lib/loads.ts | tests/audit-0.10-ui.test.tsx, tests/locations-audit.test.tsx, tests/locations-loads.test.ts +1 |
| loads.plateSums | lib/loads.ts | tests/locations-audit.test.tsx, tests/locations-loads.test.ts |
| loads.validateSpec | lib/loads.ts | tests/audit-0.10-tst.test.ts, tests/locations-audit.test.tsx, tests/locations-verify2.test.tsx +1 |
| loads.specValues | lib/loads.ts | tests/locations-loads.test.ts, tests/matrix-dim-equipment.test.tsx |
| loads.noPlates | lib/loads.ts | tests/bar-no-plates.test.tsx |
| loads.achievable | lib/loads.ts | tests/decisions-0310.test.tsx, tests/locations-audit.test.tsx, tests/locations-catalog.test.ts +3 |
| loads.convertSpec | lib/loads.ts | tests/locations-audit.test.tsx, tests/locations-verify2.test.tsx, tests/locations-verify3.test.tsx |
| loads.sameLoad | lib/loads.ts | tests/locations-loads.test.ts |
| loads.hasLoad | lib/loads.ts | tests/audit-backlog-q.test.tsx, tests/audit-perf-equiv.test.ts, tests/audit-r82b.test.tsx +4 |
| loads.hasLoadShown | lib/loads.ts | tests/audit-r82b.test.tsx |
| loads.nextHeavier | lib/loads.ts | tests/decisions-0310.test.tsx, tests/locations-loads.test.ts |
| loads.roundDown | lib/loads.ts | tests/locations-loads.test.ts |
| loads.sanitizeLoadSpec | lib/loads.ts | tests/locations-audit.test.tsx, tests/locations-loads.test.ts |
| locations.addLocation | lib/locations.ts | tests/a11y-routes.ts, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts +37 |
| locations.setMainLocation | lib/locations.ts | tests/audit-0.10-lang-ui.test.tsx, tests/locations-model.test.ts, tests/locations-verify3.test.tsx +1 |
| locations.renameLocation | lib/locations.ts | tests/locations-audit.test.tsx, tests/matrix-invariants.test.ts |
| locations.commitLocationName | lib/locations.ts | tests/matrix-invariants.test.ts, tests/matrix-logic.test.tsx |
| locations.duplicateLocation | lib/locations.ts | tests/backlog-0.10.1-dane.test.ts, tests/locations-model.test.ts, tests/matrix-invariants.test.ts |
| locations.canDeleteLocation | lib/locations.ts | tests/matrix-invariants.test.ts, tests/matrix-logic.test.tsx |
| locations.deleteLocation | lib/locations.ts | tests/audit-r82c.test.tsx, tests/integration-090.test.tsx, tests/locations-model.test.ts +4 |
| locations.locationEdited | lib/locations.ts | tests/matrix-logic.test.tsx |
| locations.equipOf | lib/locations.ts | tests/locations-model.test.ts, tests/matrix-dim-equipment.test.tsx |
| locations.activeEquip | lib/locations.ts | tests/locations-model.test.ts, tests/matrix-dim-equipment.test.tsx, tests/matrix-invariants.test.ts +2 |
| locations.setEquip | lib/locations.ts | tests/audit-0.10-gen.test.ts, tests/audit-r82c.test.tsx, tests/band-exercises.test.tsx +11 |
| locations.setOpt | lib/locations.ts | tests/locations-model.test.ts, tests/matrix-dim-equipment.test.tsx, tests/matrix-invariants.test.ts +1 |
| locations.setBandLevel | lib/locations.ts | tests/band-exercises.test.tsx, tests/matrix-invariants.test.ts, tests/owner-0510c.test.tsx +1 |
| locations.setBandColor | lib/locations.ts | tests/matrix-invariants.test.ts, tests/owner-0510c.test.tsx |
| locations.setLoad | lib/locations.ts | tests/audit-perf-equiv.test.ts, tests/audit-r82c.test.tsx, tests/audit-r83.test.tsx +4 |
| locations.locationLabel | lib/locations.ts | tests/locations-model.test.ts |
| motif.plateAt | lib/motif.ts | tests/motyw.test.tsx |
| motif.dayMark | lib/motif.ts | tests/matrix-invariants.test.ts, tests/motyw.test.tsx |
| motif.restCup | lib/motif.ts | tests/motyw.test.tsx |
| motif.miniIcon | lib/motif.ts | tests/motyw.test.tsx |
| motif.plateStack | lib/motif.ts | tests/motyw.test.tsx |
| motif.plateStackHeight | lib/motif.ts | tests/motyw.test.tsx |
| motif.planPct | lib/motif.ts | tests/matrix-invariants.test.ts, tests/motyw.test.tsx |
| motif.weekProgress | lib/motif.ts | tests/matrix-invariants.test.ts, tests/motyw.test.tsx |
| motif.monthWeeks | lib/motif.ts | tests/matrix-invariants.test.ts, tests/motyw-miesiac.test.tsx |
| motif.contrast | lib/motif.ts | tests/matrix-a11y.test.tsx, tests/motyw.test.tsx |
| motif.needsEdge | lib/motif.ts | tests/motyw.test.tsx |
| motif.shouldAnimateRecord | lib/motif.ts | tests/motyw.test.tsx |
| motif.__resetRecordAnim | lib/motif.ts | tests/motyw.test.tsx |
| musclemap.shadeLevel | lib/musclemap.ts | tests/muscle-map.test.tsx |
| musclemap.mixHex | lib/musclemap.ts | tests/muscle-map.test.tsx |
| musclemap.shadeColor | lib/musclemap.ts | tests/muscle-map.test.tsx |
| musclemap.rankedMuscles | lib/musclemap.ts | tests/muscle-map.test.tsx |
| musclemap.svgMarkup | lib/musclemap.ts | tests/muscle-map.test.tsx |
| period.periodRange | lib/period.ts | tests/matrix-invariants.test.ts, tests/motyw-miesiac.test.tsx, tests/mutation-bounds.test.ts +1 |
| period.periodSummary | lib/period.ts | tests/audit-0.10-stats.test.ts, tests/backlog-0.10.1-dane.test.ts, tests/mutation-bounds.test.ts +2 |
| period.periodTitle | lib/period.ts | tests/mutation-bounds.test.ts, tests/period-summary.test.tsx |
| plan.dayKeyOf | lib/plan.ts | tests/audit011-gen.test.tsx, tests/matrix-invariants.test.ts, tests/plan-calendar.test.ts |
| plan.addDays | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/audit011-gen.test.tsx, tests/matrix-invariants.test.ts +5 |
| plan.weekdayIdx | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/matrix-invariants.test.ts, tests/mutation-plan.test.ts +1 |
| plan.weekPlanDays | lib/plan.ts | tests/audit-0.10-gen.test.ts, tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts +11 |
| plan.planHistory | lib/plan.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-plan.test.ts, tests/audit-0.10-tst.test.ts +5 |
| plan.baseRaw | lib/plan.ts | tests/matrix-data-fuzz.test.ts, tests/mutation-plan.test.ts |
| plan.planInForce | lib/plan.ts | tests/matrix-invariants.test.ts, tests/motyw.test.tsx |
| plan.plannedOn | lib/plan.ts | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts, tests/audit-k1-fala2b.test.tsx +7 |
| plan.planTplName | lib/plan.ts | tests/audit-0.10-plan.test.ts |
| plan.busyDays | lib/plan.ts | tests/audit-0.10-data.test.ts, tests/matrix-invariants.test.ts |
| plan.setWeekDay | lib/plan.ts | tests/a11y-routes.ts, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts +29 |
| plan.planName | lib/plan.ts | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts, tests/gen-days-ui.test.tsx +11 |
| plan.savedPlans | lib/plan.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit-0.10-plan-ui.test.tsx +20 |
| plan.plansFull | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/matrix-invariants.test.ts |
| plan.setPlanName | lib/plan.ts | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts, tests/home-b.test.tsx +5 |
| plan.typePlanName | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/mutation-plan.test.ts |
| plan.newPlan | lib/plan.ts | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts, tests/matrix-invariants.test.ts +3 |
| plan.setSavedDay | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/matrix-invariants.test.ts, tests/mutation-plan.test.ts +1 |
| plan.typeSavedName | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/mutation-plan.test.ts |
| plan.renamePlan | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/matrix-invariants.test.ts, tests/mutation-plan.test.ts +1 |
| plan.activationNote | lib/plan.ts | tests/audit-0.10-gen.test.ts, tests/audit-0.10-plan.test.ts, tests/mutation-plan.test.ts +1 |
| plan.activatePlan | lib/plan.ts | tests/audit-0.10-gen.test.ts, tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts +5 |
| plan.addPlan | lib/plan.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit-0.10-plan-ui.test.tsx +5 |
| plan.assignNewTemplate | lib/plan.ts | tests/matrix-invariants.test.ts, tests/plan-new-template-day.test.tsx |
| plan.deletePlan | lib/plan.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/matrix-invariants.test.ts +2 |
| plan.setDayPlan | lib/plan.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts, tests/audit-0.10-plan-ui.test.tsx +13 |
| plan.resetDay | lib/plan.ts | tests/matrix-invariants.test.ts, tests/mutation-plan.test.ts, tests/plan-calendar.test.ts +1 |
| plan.shiftPlan | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/matrix-invariants.test.ts, tests/mutation-plan.test.ts +1 |
| plan.moveOnly | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/matrix-invariants.test.ts, tests/mutation-plan.test.ts +1 |
| plan.swapDays | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/matrix-invariants.test.ts, tests/mutation-plan.test.ts +1 |
| plan.templateUsage | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/mutation-plan.test.ts |
| plan.templateUsageText | lib/plan.ts | tests/audit-0.10-plan.test.ts |
| plan.removeTemplate | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/matrix-invariants.test.ts, tests/mutation-plan.test.ts |
| plan.dayStatusFrom | lib/plan.ts | tests/audit-0.10-plan.test.ts |
| plan.doneOn | lib/plan.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-plan.test.ts |
| plan.pending | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/edit-history.test.tsx, tests/mutation-plan.test.ts |
| plan.templateMuscles | lib/plan.ts | tests/gen-days.test.ts, tests/mutation-plan.test.ts, tests/plan-calendar.test.ts +1 |
| plan.doneInfo | lib/plan.ts | tests/audit-0.10-plan.test.ts |
| plan.backToBack | lib/plan.ts | tests/audit-0.10-gen.test.ts, tests/gen-days.test.ts, tests/generator.test.ts +4 |
| plan.suggest | lib/plan.ts | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts, tests/backlog-0.10.1-dane.test.ts +5 |
| plan.suggestionOrder | lib/plan.ts | tests/audit-k1-fala2b.test.tsx |
| plan.applySuggestion | lib/plan.ts | tests/audit-0.10-plan.test.ts, tests/matrix-invariants.test.ts, tests/plan-calendar.test.ts |
| planReminder.planReminderOn | lib/planReminder.ts | tests/plan-reminder.test.tsx |
| planReminder.syncPlanReminders | lib/planReminder.ts | tests/audit-0.10-plan.test.ts, tests/mutation-bounds.test.ts, tests/plan-reminder.test.tsx |
| planReminder.planReminderKey | lib/planReminder.ts | tests/audit-0.10-live.test.tsx, tests/audit-0.10-plan.test.ts, tests/mutation-bounds.test.ts +1 |
| planReminder.cancelLegacyReminders | lib/planReminder.ts | tests/rm-signing.test.tsx |
| planReminder.reminderPermission | lib/planReminder.ts | tests/audit-0.10-plan.test.ts, tests/mutation-bounds.test.ts |
| planReminder.askReminderPermission | lib/planReminder.ts | tests/audit-0.10-plan.test.ts, tests/mutation-bounds.test.ts |
| planReminder.__resetReminderAsk | lib/planReminder.ts | tests/app.tsx, tests/helpers.ts |
| plates.plateColor | lib/plates.ts | tests/tuleja.test.tsx |
| plates.plateInk | lib/plates.ts | tests/tuleja.test.tsx |
| plates.plateOutlined | lib/plates.ts | tests/tuleja.test.tsx |
| plates.platesPerSide | lib/plates.ts | tests/tuleja.test.tsx |
| plates.plateList | lib/plates.ts | tests/tuleja.test.tsx |
| plural.pluralIndex | lib/plural.ts | tests/i18n-multi.test.ts, tests/matrix-i18n.test.tsx |
| seed.hasTime | lib/seed.ts | tests/audit-perf-equiv.test.ts, tests/catalog-library25.test.tsx, tests/matrix-dim-metrics.test.tsx +3 |
| seed.hasReps | lib/seed.ts | tests/audit-perf-equiv.test.ts, tests/catalog-library25.test.tsx, tests/matrix-dim-catalog.test.tsx +3 |
| seed.hasWeight | lib/seed.ts | tests/audit-perf-equiv.test.ts, tests/catalog-library25.test.tsx, tests/matrix-dim-catalog.test.tsx +3 |
| seed.hasDistance | lib/seed.ts | tests/audit-perf-equiv.test.ts, tests/catalog-library25.test.tsx, tests/matrix-dim-metrics.test.tsx +1 |
| seed.loadModeFor | lib/seed.ts | tests/catalog-library25.test.tsx, tests/catalog-v2.test.ts |
| seed.loadMult | lib/seed.ts | tests/audit-k1-data.test.ts, tests/matrix-logic.test.tsx |
| seed.uid | lib/seed.ts | tests/audit-0.10-stats.test.ts, tests/audit-k1-catalog-step.test.ts, tests/audit-k1-data.test.ts +11 |
| seed.base | lib/seed.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-stats-ui.test.tsx +29 |
| seed.defaultModules | lib/seed.ts | tests/matrix-logic.test.tsx |
| seed.muscleLoadOf | lib/seed.ts | tests/audit-0.10-stats.test.ts, tests/audit-k1-muscleload.test.tsx, tests/catalog-v2.test.ts +1 |
| seed.libExtraRevOf | lib/seed.ts | tests/audit-0.10-stats.test.ts, tests/swap-logic.test.ts |
| seed.catalogKey | lib/seed.ts | tests/audit-0.10-stats.test.ts |
| seed.isLibBase | lib/seed.ts | tests/audit-0.10-stats.test.ts |
| seed.metricFor | lib/seed.ts | tests/catalog-library25.test.tsx, tests/catalog-v2.test.ts, tests/ux.test.tsx |
| seed.muscleConfidence | lib/seed.ts | tests/audit-0.10-ui.test.tsx, tests/catalog-library25.test.tsx |
| seed.unmappedMuscleOf | lib/seed.ts | tests/audit-0.10-ui.test.tsx, tests/catalog-library25.test.tsx |
| seed.isNiche | lib/seed.ts | tests/catalog-library25.test.tsx, tests/swap-logic.test.ts |
| seed.formerNamesOf | lib/seed.ts | tests/audit-k1-fala2b.test.tsx |
| seed.formerMatch | lib/seed.ts | tests/audit-k1-fala2b.test.tsx |
| seed.formerExact | lib/seed.ts | tests/audit-k1-fala2b.test.tsx |
| seed.musclesSourced | lib/seed.ts | tests/audit-0.10-stats.test.ts, tests/audit-0.10-ui.test.tsx |
| seed.musclesFor | lib/seed.ts | tests/catalog-library25.test.tsx, tests/catalog-v2.test.ts |
| seed.equipFields | lib/seed.ts | tests/locations-catalog.test.ts |
| seed.blankTimer | lib/seed.ts | tests/audit-0.10-tst.test.ts, tests/matrix-invariants.test.ts, tests/matrix-logic.test.tsx +1 |
| seed.defaultSettings | lib/seed.ts | tests/theme-choice.test.tsx |
| seed.libExercise | lib/seed.ts | tests/matrix-logic.test.tsx |
| seed.fpHash | lib/seed.ts | tests/backlog-0.10.1-dane.test.ts |
| seed.libKeyFromFields | lib/seed.ts | tests/audit-0.10-stats.test.ts |
| seed.libKeyCandidates | lib/seed.ts | tests/backlog-0.10.1-dane-lib.test.ts |
| seed.seedState | lib/seed.ts | tests/audit-k1-catalog-step.test.ts, tests/audit-k1-data.test.ts, tests/audit-k1-fala2b.test.tsx +22 |
| start.deloadCounts | lib/start.ts | tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-stats.test.ts, tests/deload-ui.test.tsx +1 |
| start.repeatCounts | lib/start.ts | tests/audit-0.10-live-logic.test.ts, tests/live2-split-template.test.tsx |
| start.deloadLessText | lib/start.ts | tests/audit-0.10-live-logic.test.ts |
| start.startTemplate | lib/start.ts | tests/audit-journey-a.test.tsx, tests/flows.test.tsx |
| start.startRepeatLast | lib/start.ts | tests/audit-0.10-live-logic.test.ts |
| stats.bwShare | lib/stats.ts | tests/audit-0.10-stats.test.ts |
| stats.liftedLoad | lib/stats.ts | tests/audit-0.10-stats.test.ts |
| stats.bwE1Diff | lib/stats.ts | tests/audit-0.10-stats.test.ts, tests/audit-k1-mer.test.tsx |
| stats.fmtE1 | lib/stats.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-stats.test.ts, tests/audit-k1-mer.test.tsx |
| stats.e1rm | lib/stats.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-stats.test.ts, tests/audit-k1-mer.test.tsx +3 |
| stats.totalKind | lib/stats.ts | tests/catalog-library25.test.tsx, tests/matrix-dim-metrics.test.tsx, tests/matrix-invariants.test.ts +1 |
| stats.setTotal | lib/stats.ts | tests/audit-perf-equiv.test.ts, tests/q024.test.ts, tests/stats.test.ts |
| stats.fmtTotal | lib/stats.ts | tests/audit-records-logic.test.ts, tests/audit-records-misc.test.tsx, tests/stats.test.ts |
| stats.hasHistory | lib/stats.ts | tests/audit-perf-equiv.test.ts, tests/audit-perf-ui.test.tsx, tests/matrix-dim-catalog.test.tsx +2 |
| stats.sessionsFor | lib/stats.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-stats.test.ts, tests/audit-backlog-q.test.tsx +20 |
| stats.emptyRecords | lib/stats.ts | tests/audit-perf-equiv.test.ts |
| stats.recordsFor | lib/stats.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-stats.test.ts, tests/audit-backlog-q.test.tsx +29 |
| stats.setPRs | lib/stats.ts | tests/audit-0.10-stats.test.ts, tests/audit-final-stats.test.ts, tests/stats.test.ts |
| stats.prMap | lib/stats.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-stats.test.ts, tests/audit-final-stats.test.ts +20 |
| stats.workoutPRs | lib/stats.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-stats.test.ts, tests/audit-close-d.test.ts +15 |
| stats.prCountOf | lib/stats.ts | tests/audit-0.10-stats.test.ts |
| stats.prCount | lib/stats.ts | tests/audit-0.10-stats.test.ts, tests/dashboard.test.tsx, tests/motyw.test.tsx |
| stats.chartKeysFor | lib/stats.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-stats.test.ts, tests/matrix-data-fuzz.test.ts +3 |
| stats.thisMonday | lib/stats.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-stats.test.ts, tests/logic.test.ts +8 |
| stats.weeklyTotals | lib/stats.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-stats.test.ts, tests/edit-history.test.tsx +11 |
| stats.hasAnyHistory | lib/stats.ts | tests/stats.test.ts |
| stats.weeklySetsByMuscle | lib/stats.ts | tests/logic.test.ts, tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-metrics.test.tsx +5 |
| stats.setsByMuscle | lib/stats.ts | tests/audit-0.10-stats.test.ts, tests/muscle-map.test.tsx |
| stats.weeklyVolumeByMuscle | lib/stats.ts | tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-metrics.test.tsx, tests/matrix-time.test.ts +1 |
| store.dbDirectory | lib/store.ts | tests/audit-backlog-r75.test.tsx |
| store.copyKv | lib/store.ts | tests/audit-backlog-r75.test.tsx |
| store.init | lib/store.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-tst-ui.test.tsx, tests/audit-0.10-tst.test.ts +14 |
| store.applyPrefs | lib/store.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-plan.test.ts, tests/audit-0.10-stats-ui.test.tsx +12 |
| store.migrate | lib/store.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-gen.test.ts, tests/audit-0.10-live-logic.test.ts +38 |
| store.applyCfg | lib/store.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-tst.test.ts, tests/helpers.ts |
| store.flush | lib/store.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/audit-0.10-gen-ui.test.tsx +119 |
| store.registerDraftStore | lib/store.ts | tests/backlog-0.10.1-dane-lib.test.ts |
| store.draftsChanged | lib/store.ts | tests/backlog-0.10.1-dane-lib.test.ts |
| store.takeSavedDrafts | lib/store.ts | tests/backlog-0.10.1-dane-lib.test.ts |
| store.sanitizeDraftObj | lib/store.ts | tests/backlog-0.10.1-dane-lib.test.ts |
| store.getPersistError | lib/store.ts | tests/audit-persist.test.ts, tests/logic.test.ts, tests/matrix-data-fuzz.test.ts +1 |
| store.getRecovery | lib/store.ts | tests/audit-io-more.test.tsx, tests/audit-r83b.test.tsx, tests/logic.test.ts +5 |
| store.clearRecovery | lib/store.ts | tests/matrix-logic.test.tsx, tests/regress.test.tsx |
| store.getNewerSchema | lib/store.ts | tests/audit-0.10-plan.test.ts |
| store.readRawData | lib/store.ts | tests/audit-0.10-plan.test.ts |
| store.readRecovery | lib/store.ts | tests/audit-io-more.test.tsx, tests/logic.test.ts, tests/regress.test.tsx |
| store.markDraft | lib/store.ts | tests/edit-on-demand.test.tsx |
| store.isDraftObj | lib/store.ts | tests/edit-on-demand.test.tsx, tests/matrix-invariants.test.ts |
| store.save | lib/store.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/audit-0.10-gen-ui.test.tsx +134 |
| store.saveCfg | lib/store.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/matrix-invariants.test.ts +2 |
| store.getState | lib/store.ts | tests/a11y-routes.ts, tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts +166 |
| store.replaceState | lib/store.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-plan.test.ts, tests/audit-close-d.test.ts +16 |
| store.useStore | lib/store.ts | tests/matrix-logic.test.tsx |
| store.useTick | lib/store.ts | tests/audit-0.10-tst.test.ts |
| store.usePrefsTick | lib/store.ts | tests/matrix-logic.test.tsx |
| store.getHistRev | lib/store.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/edit-on-demand.test.tsx +2 |
| store.getRev | lib/store.ts | tests/audit-0.10-data.test.ts, tests/mutation-bounds.test.ts |
| store.refreshViews | lib/store.ts | tests/audit-r72-ui.test.tsx, tests/audit-stale-ui.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx +3 |
| store.useForegroundTick | lib/store.ts | tests/matrix-logic.test.tsx |
| store.useHistTick | lib/store.ts | tests/audit-0.10-tst.test.ts |
| store.useCfgTick | lib/store.ts | tests/audit-0.10-tst.test.ts |
| store.useExercisesTick | lib/store.ts | tests/audit-0.10-tst.test.ts |
| store.memoHist | lib/store.ts | tests/matrix-logic.test.tsx |
| store.memoHistBy | lib/store.ts | tests/matrix-logic.test.tsx |
| store.exById | lib/store.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-gen.test.ts, tests/audit-0.10-stats.test.ts +27 |
| store.bandById | lib/store.ts | tests/matrix-data-fuzz.test.ts, tests/scenario-full.test.tsx |
| store.isBW | lib/store.ts | tests/audit-perf-equiv.test.ts, tests/invariants.test.ts, tests/matrix-invariants.test.ts +1 |
| store.repsOf | lib/store.ts | tests/audit-journey-a.test.tsx, tests/audit-perf-equiv.test.ts, tests/matrix-invariants.test.ts |
| store.loadOf | lib/store.ts | tests/audit-perf-equiv.test.ts, tests/audit-r83b.test.tsx |
| store.shownLoad | lib/store.ts | tests/audit-r83.test.tsx, tests/audit-r83b.test.tsx |
| store.setLoad | lib/store.ts | tests/audit-perf-equiv.test.ts, tests/audit-r82c.test.tsx, tests/audit-r83.test.tsx +4 |
| store.loadFieldValue | lib/store.ts | tests/matrix-dim-metrics.test.tsx, tests/matrix-logic.test.tsx |
| store.writeLoad | lib/store.ts | tests/matrix-dim-metrics.test.tsx, tests/matrix-invariants.test.ts, tests/matrix-logic.test.tsx +1 |
| store.localDateTs | lib/store.ts | tests/audit-0.10-data-ui.test.tsx, tests/logic.test.ts, tests/matrix-time.test.ts |
| store.effectiveLoad | lib/store.ts | tests/audit-perf-equiv.test.ts |
| store.exMult | lib/store.ts | tests/logic.test.ts, tests/regress.test.tsx |
| store.isWorking | lib/store.ts | tests/audit-perf-equiv.test.ts, tests/matrix-dim-metrics.test.tsx |
| store.workCount | lib/store.ts | tests/audit-0.10-stats.test.ts, tests/backlog-0.10.1-dane-ui.test.tsx, tests/matrix-dim-metrics.test.tsx +1 |
| store.workSetCount | lib/store.ts | tests/audit-0.10-stats.test.ts |
| store.workingSets | lib/store.ts | tests/audit-0.10-stats.test.ts, tests/backlog-0.10.1-dane-ui.test.tsx, tests/scenario-full.test.tsx |
| store.setVolume | lib/store.ts | tests/audit-perf-equiv.test.ts, tests/audit-r82.test.tsx, tests/matrix-dim-catalog.test.tsx |
| store.blockMult | lib/store.ts | tests/matrix-logic.test.tsx |
| store.volOf | lib/store.ts | tests/matrix-logic.test.tsx |
| store.loadLabelShort | lib/store.ts | tests/audit-r82.test.tsx, tests/audit-r82c.test.tsx, tests/regress.test.tsx |
| store.loadLabel | lib/store.ts | tests/audit-close2-b.test.tsx, tests/audit-journey-c.test.tsx, tests/audit-journey-d.test.tsx +3 |
| store.restFor | lib/store.ts | tests/regress.test.tsx |
| store.fmtSec | lib/store.ts | tests/audit-0.10-lang.test.ts, tests/invariants.test.ts, tests/regress.test.tsx +1 |
| store.fmtDist | lib/store.ts | tests/audit-0.10-lang.test.ts, tests/regress.test.tsx |
| store.reps | lib/store.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/audit-0.10-gen-ui.test.tsx +136 |
| store.fmtDur | lib/store.ts | tests/regress.test.tsx |
| store.fmtDayKey | lib/store.ts | tests/audit-0.10-ui.test.tsx, tests/home-b.test.tsx |
| store.fmtDate | lib/store.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx +6 |
| store.fmtTime | lib/store.ts | tests/audit-0.10-data.test.ts, tests/backlog-0.10.1-dane-ui.test.tsx, tests/backlog-0.10.1-dane.test.ts +6 |
| store.cleanTz | lib/store.ts | tests/audit-0.10-data.test.ts |
| store.wallTs | lib/store.ts | tests/audit-0.10-data.test.ts, tests/audit-perf-equiv.test.ts, tests/backlog-0.10.1-dane-ui.test.tsx +2 |
| store.fromWallTs | lib/store.ts | tests/audit-0.10-data.test.ts |
| store.workoutDay | lib/store.ts | tests/audit-0.10-data.test.ts, tests/backlog-0.10.1-dane.test.ts, tests/matrix-time.test.ts |
| store.bodyMassLog | lib/store.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/audit-0.10-stats-ui.test.tsx +7 |
| store.bodyMassOn | lib/store.ts | tests/audit-0.10-data.test.ts, tests/matrix-invariants.test.ts |
| store.bodyMassFor | lib/store.ts | tests/audit-0.10-data.test.ts |
| store.latestBodyMass | lib/store.ts | tests/audit-0.10-data.test.ts |
| store.addBodyMass | lib/store.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/backlog-0.10.1-dane.test.ts +3 |
| store.removeBodyMass | lib/store.ts | tests/audit-0.10-data.test.ts, tests/matrix-invariants.test.ts |
| store.bandColor | lib/store.ts | tests/audit-0.10-lang-ui.test.tsx, tests/matrix-logic.test.tsx, tests/matrix-ui.test.tsx |
| store.shortBand | lib/store.ts | tests/audit-0.10-lang-ui.test.tsx, tests/regress.test.tsx |
| store.bandA11y | lib/store.ts | tests/regress.test.tsx |
| store.finishedWorkouts | lib/store.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-stats.test.ts +7 |
| store.blocksOf | lib/store.ts | tests/audit-perf-equiv.test.ts |
| store.workoutsWith | lib/store.ts | tests/audit-perf-equiv.test.ts, tests/edit-history.test.tsx, tests/matrix-logic.test.tsx |
| store.previousFor | lib/store.ts | tests/audit-prephone.test.tsx, tests/audit-r82b.test.tsx, tests/edit-history.test.tsx +3 |
| store.previousBlockFor | lib/store.ts | tests/audit-r72-b.test.ts, tests/audit-r72-d.test.ts, tests/audit-r82.test.tsx +8 |
| store.previousBlockBefore | lib/store.ts | tests/decisions-0310.test.tsx, tests/edit-history.test.tsx, tests/integration-090.test.tsx |
| store.hintFor | lib/store.ts | tests/audit-r72-b.test.ts, tests/audit-r72-d.test.ts, tests/audit-r82b.test.tsx +2 |
| store.progressionFor | lib/store.ts | tests/audit-backlog-r75.test.tsx, tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx +7 |
| store.occurrence | lib/store.ts | tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx, tests/store-hint.test.ts +1 |
| store.occurrences | lib/store.ts | tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx, tests/store-hint.test.ts +1 |
| store.setSummary | lib/store.ts | tests/audit-k1-bl-mer.test.tsx, tests/audit-r83.test.tsx, tests/audit-r83b.test.tsx +10 |
| store.setScore | lib/store.ts | tests/audit-perf-equiv.test.ts, tests/catalog-library25.test.tsx, tests/logic.test.ts |
| store.effortScale | lib/store.ts | tests/audit-0.10-plan.test.ts, tests/audit-0.10-stats.test.ts, tests/audit-k1-bl-mer.test.tsx +2 |
| store.effortLabel | lib/store.ts | tests/effort-scale.test.tsx |
| store.effortOut | lib/store.ts | tests/audit-k1-bl-mer.test.tsx, tests/effort-scale.test.tsx |
| store.effortText | lib/store.ts | tests/audit-k1-bl-mer.test.tsx |
| store.effortIn | lib/store.ts | tests/audit-0.10-stats.test.ts, tests/audit-k1-bl-mer.test.tsx, tests/effort-scale.test.tsx |
| store.effortField | lib/store.ts | tests/audit-k1-bl-mer.test.tsx, tests/effort-scale.test.tsx |
| store.setHasValue | lib/store.ts | tests/matrix-dim-metrics.test.tsx, tests/matrix-logic.test.tsx |
| store.volume | lib/store.ts | tests/audit-0.10-stats.test.ts, tests/audit-close-d.test.ts, tests/audit-k1-data.test.ts +20 |
| store.locationById | lib/store.ts | tests/audit-r82c.test.tsx, tests/decisions-0310.test.tsx, tests/locations-model.test.ts +2 |
| store.startLocationId | lib/store.ts | tests/scenario-full.test.tsx, tests/swap-logic.test.ts |
| store.offListAt | lib/store.ts | tests/audit-r82b.test.tsx, tests/swap-logic.test.ts |
| store.prevFromOther | lib/store.ts | tests/audit-r82.test.tsx, tests/swap-logic.test.ts |
| store.implAtLoc | lib/store.ts | tests/decisions-0310.test.tsx, tests/matrix-invariants.test.ts, tests/scenario-full.test.tsx +2 |
| store.blockImpl | lib/store.ts | tests/audit-r82b.test.tsx |
| store.liveBlockImpl | lib/store.ts | tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx |
| store.listLocFor | lib/store.ts | tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx, tests/swap-logic.test.ts |
| store.pinnedImpl | lib/store.ts | tests/swap-logic.test.ts |
| store.offListNote | lib/store.ts | tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx |
| store.srcSetAt | lib/store.ts | tests/audit-r82b.test.tsx, tests/audit-r82c.test.tsx, tests/swap-logic.test.ts |
| store.stampImpl | lib/store.ts | tests/matrix-logic.test.tsx |
| store.setActiveLocation | lib/store.ts | tests/audit-r82.test.tsx, tests/audit-r82b.test.tsx, tests/band-exercises.test.tsx +5 |
| store.locationEquipChanged | lib/store.ts | tests/swap-logic.test.ts |
| store.prefillSets | lib/store.ts | tests/audit-0.10-tst.test.ts |
| store.tplRows | lib/store.ts | tests/audit-0.10-ui.test.tsx, tests/audit-k1-log.test.ts, tests/edit-on-demand.test.tsx +7 |
| store.tplWorkSets | lib/store.ts | tests/audit-0.10-stats.test.ts, tests/audit-k1-log.test.ts, tests/matrix-dim-metrics.test.tsx +1 |
| store.tplAddRow | lib/store.ts | tests/edit-on-demand.test.tsx, tests/live2-split-template.test.tsx, tests/matrix-invariants.test.ts +2 |
| store.tplRemoveRow | lib/store.ts | tests/matrix-invariants.test.ts, tests/template-rows.test.tsx |
| store.tplCycleBand | lib/store.ts | tests/matrix-invariants.test.ts, tests/template-rows.test.tsx |
| store.tplSetRow | lib/store.ts | tests/matrix-invariants.test.ts, tests/template-rows.test.tsx |
| store.tplSetKind | lib/store.ts | tests/matrix-dim-metrics.test.tsx, tests/matrix-invariants.test.ts, tests/plan-own-templates.test.ts +1 |
| store.startableItem | lib/store.ts | tests/audit-0.10-live-logic.test.ts |
| store.repeatBlocks | lib/store.ts | tests/audit-0.10-live-logic.test.ts |
| store.startFromTemplate | lib/store.ts | tests/a11y-routes.ts, tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-live-logic.test.ts +51 |
| store.startEmpty | lib/store.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx +92 |
| store.repeatLast | lib/store.ts | tests/audit-0.10-live-logic.test.ts, tests/audit-close-d.test.ts, tests/audit-r82.test.tsx +11 |
| store.deloadTail | lib/store.ts | tests/audit-0.10-live-logic.test.ts |
| store.addExerciseToActive | lib/store.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx +88 |
| store.swapBlock | lib/store.ts | tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-tst-ui.test.tsx, tests/audit-0.10-tst.test.ts +12 |
| store.swapImpl | lib/store.ts | tests/audit-k1-log.test.ts, tests/live2-split-template.test.tsx, tests/matrix-invariants.test.ts +2 |
| store.canUndoSwap | lib/store.ts | tests/invariants.test.ts, tests/matrix-invariants.test.ts, tests/swap-logic.test.ts |
| store.undoSwap | lib/store.ts | tests/backlog-0.10.1-dane.test.ts, tests/invariants.test.ts, tests/live2-split-template.test.tsx +3 |
| store.canRememberAlt | lib/store.ts | tests/audit-0.10-tst.test.ts, tests/matrix-invariants.test.ts, tests/swap-alternates.test.tsx |
| store.rememberAlt | lib/store.ts | tests/audit-0.10-tst.test.ts, tests/matrix-invariants.test.ts, tests/swap-alternates.test.tsx |
| store.altHint | lib/store.ts | tests/matrix-invariants.test.ts, tests/swap-alternates.test.tsx |
| store.acceptAlt | lib/store.ts | tests/matrix-invariants.test.ts, tests/swap-alternates.test.tsx |
| store.skipExercise | lib/store.ts | tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx, tests/matrix-invariants.test.ts +1 |
| store.unskipExercise | lib/store.ts | tests/audit-0.10-live-logic.test.ts, tests/matrix-invariants.test.ts, tests/skip-today.test.tsx |
| store.skipAlt | lib/store.ts | tests/matrix-invariants.test.ts, tests/swap-alternates.test.tsx |
| store.rememberRest | lib/store.ts | tests/matrix-invariants.test.ts, tests/swap-alternates.test.tsx |
| store.addSet | lib/store.ts | tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx, tests/audit-0.10-ui.test.tsx +32 |
| store.removeSetById | lib/store.ts | tests/matrix-invariants.test.ts, tests/xcheck-0610b.test.tsx |
| store.removeSet | lib/store.ts | tests/invariants.test.ts, tests/matrix-invariants.test.ts |
| store.removeExercise | lib/store.ts | tests/invariants.test.ts, tests/matrix-invariants.test.ts, tests/regress.test.tsx +1 |
| store.findSet | lib/store.ts | tests/audit-close-a.test.ts |
| store.usesBand | lib/store.ts | tests/band-exercises.test.tsx, tests/matrix-dim-catalog.test.tsx, tests/matrix-invariants.test.ts +1 |
| store.assistLost | lib/store.ts | tests/swap-logic.test.ts |
| store.prevOfActiveBlock | lib/store.ts | tests/matrix-logic.test.tsx |
| store.restAfter | lib/store.ts | tests/store-rest.test.ts |
| store.roundRest | lib/store.ts | tests/audit-0.10-live-logic.test.ts, tests/audit-r72-d.test.ts, tests/store-rest.test.ts |
| store.toggleDone | lib/store.ts | tests/a11y-routes.ts, tests/audit-0.10-data.test.ts, tests/audit-0.10-lang-ui.test.tsx +63 |
| store.lastActivity | lib/store.ts | tests/audit-persist.test.ts, tests/store-stale.test.ts |
| store.staleKind | lib/store.ts | tests/matrix-dim-metrics.test.tsx, tests/store-stale.test.ts |
| store.hasWorkDone | lib/store.ts | tests/matrix-dim-metrics.test.tsx, tests/store-stale.test.ts |
| store.staleSince | lib/store.ts | tests/audit-backlog-q.test.tsx, tests/audit-final2-auto.test.ts, tests/audit-persist.test.ts +5 |
| store.ackStale | lib/store.ts | tests/audit-r72-d.test.ts, tests/regress.test.tsx, tests/store-stale.test.ts |
| store.markActivity | lib/store.ts | tests/store-stale.test.ts |
| store.resolveColdStopwatch | lib/store.ts | tests/store-stale.test.ts |
| store.autoFinishStale | lib/store.ts | tests/audit-backlog-q.test.tsx, tests/audit-close-a.test.ts, tests/audit-final2-auto.test.ts +6 |
| store.finishWorkout | lib/store.ts | tests/a11y-routes.ts, tests/audit-0.10-data.test.ts, tests/audit-0.10-lang-ui.test.tsx +34 |
| store.mondayKey | lib/store.ts | tests/audit-0.10-data.test.ts, tests/deload-plan.test.ts, tests/matrix-time.test.ts +1 |
| store.isDeloadWeek | lib/store.ts | tests/audit-0.10-plan-ui.test.tsx, tests/deload-week.test.tsx, tests/matrix-invariants.test.ts +1 |
| store.toggleDeloadWeek | lib/store.ts | tests/audit-0.10-live.test.tsx, tests/audit-0.10-plan-ui.test.tsx, tests/deload-plan.test.ts +7 |
| store.isPaused | lib/store.ts | tests/matrix-invariants.test.ts, tests/pause.test.tsx |
| store.cleanPauses | lib/store.ts | tests/pause.test.tsx, tests/regress.test.tsx |
| store.pauseWorkout | lib/store.ts | tests/matrix-invariants.test.ts, tests/pause.test.tsx |
| store.resumeWorkout | lib/store.ts | tests/matrix-invariants.test.ts, tests/pause.test.tsx |
| store.cancelWorkout | lib/store.ts | tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx, tests/audit-0.10-ui.test.tsx +18 |
| store.deleteWorkout | lib/store.ts | tests/audit-0.10-data.test.ts, tests/edit-history.test.tsx, tests/invariants.test.ts +3 |
| store.setHasResult | lib/store.ts | tests/matrix-dim-catalog.test.tsx, tests/matrix-logic.test.tsx |
| store.putHistoryWorkout | lib/store.ts | tests/swap-schema16.test.ts |
| store.normalizeGroups | lib/store.ts | tests/logic.test.ts, tests/matrix-invariants.test.ts, tests/reorder-t010.test.tsx |
| store.groupLabels | lib/store.ts | tests/matrix-logic.test.tsx |
| store.linkWithNext | lib/store.ts | tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx, tests/audit-close-d.test.ts +8 |
| store.unlink | lib/store.ts | tests/invariants.test.ts, tests/logic.test.ts, tests/matrix-invariants.test.ts |
| store.moveItem | lib/store.ts | tests/edit-on-demand.test.tsx, tests/logic.test.ts |
| store.removeItem | lib/store.ts | tests/matrix-invariants.test.ts, tests/regress.test.tsx |
| store.blockRanges | lib/store.ts | tests/reorder-t010.test.tsx |
| store.moveBlockOf | lib/store.ts | tests/matrix-invariants.test.ts, tests/reorder-t010.test.tsx |
| store.moveInGroup | lib/store.ts | tests/reorder-t010.test.tsx |
| store.cleanLevels | lib/store.ts | tests/matrix-logic.test.tsx |
| store.nextBandId | lib/store.ts | tests/audit-r83.test.tsx, tests/owner-0510c.test.tsx, tests/xcheck-0610.test.tsx |
| store.cycleBand | lib/store.ts | tests/invariants.test.ts, tests/matrix-invariants.test.ts, tests/owner-0510c.test.tsx +1 |
| store.deleteBand | lib/store.ts | tests/invariants.test.ts, tests/matrix-invariants.test.ts |
| store.setTimerState | lib/store.ts | tests/audit-0.10-tst.test.ts, tests/audit-persist.test.ts, tests/matrix-invariants.test.ts +3 |
| store.clampName | lib/store.ts | tests/matrix-invariants.test.ts, tests/matrix-logic.test.tsx |
| store.cleanPlanName | lib/store.ts | tests/audit-0.10-plan.test.ts |
| store.planDays | lib/store.ts | tests/audit-0.10-plan.test.ts |
| store.normPlanHistory | lib/store.ts | tests/audit-0.10-plan.test.ts |
| store.cleanOverrides | lib/store.ts | tests/audit-0.10-plan.test.ts |
| store.newExercise | lib/store.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-stats-ui.test.tsx, tests/audit-0.10-stats.test.ts +15 |
| store.setEquipment | lib/store.ts | tests/audit-io-more.test.tsx, tests/audit-r83.test.tsx, tests/audit-r83b.test.tsx +8 |
| store.exerciseEdited | lib/store.ts | tests/ui2-01-draft-equipment.test.tsx |
| store.restoreExercise | lib/store.ts | tests/audit-k1-fala2b.test.tsx, tests/matrix-invariants.test.ts |
| store.exerciseInHistory | lib/store.ts | tests/audit-0.10-data-ui.test.tsx, tests/matrix-logic.test.tsx |
| store.exerciseUsed | lib/store.ts | tests/matrix-invariants.test.ts, tests/matrix-logic.test.tsx |
| store.deleteExercise | lib/store.ts | tests/audit-0.10-tst.test.ts, tests/audit-k1-fala2b.test.tsx, tests/backlog-0.10.1-dane.test.ts +10 |
| store.visibleExercises | lib/store.ts | tests/audit-0.10-data-ui.test.tsx, tests/logic.test.ts, tests/scenario-full.test.tsx +1 |
| store.exercisesInUse | lib/store.ts | tests/catalog-library25.test.tsx, tests/scenario-full.test.tsx |
| store.inCoreList | lib/store.ts | tests/catalog-library25.test.tsx, tests/scenario-full.test.tsx |
| store.libShowAll | lib/store.ts | tests/audit-0.10-tst-ui.test.tsx, tests/catalog-library25.test.tsx, tests/matrix-invariants.test.ts +2 |
| store.setLibShowAll | lib/store.ts | tests/catalog-library25.test.tsx, tests/matrix-invariants.test.ts |
| store.newTemplate | lib/store.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-data.test.ts, tests/audit-0.10-gen.test.ts +52 |
| store.dupTemplate | lib/store.ts | tests/audit-0.10-gen.test.ts, tests/gen-days-ui.test.tsx, tests/matrix-data-fuzz.test.ts +6 |
| store.templateFolders | lib/store.ts | tests/template-folders.test.tsx |
| store.templateGroups | lib/store.ts | tests/template-folders.test.tsx |
| store.archivedTemplates | lib/store.ts | tests/template-folders.test.tsx |
| store.setTemplateNote | lib/store.ts | tests/audit-0.10-gen.test.ts, tests/matrix-invariants.test.ts |
| store.setTemplateFolder | lib/store.ts | tests/template-folders.test.tsx |
| store.setTemplateArchived | lib/store.ts | tests/audit-0.10-plan.test.ts, tests/first-steps-empty.test.tsx, tests/matrix-invariants.test.ts +6 |
| store.deleteTemplate | lib/store.ts | tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx, tests/edit-on-demand.test.tsx +3 |
| store.setModule | lib/store.ts | tests/matrix-logic.test.tsx |
| store.resetAll | lib/store.ts | tests/audit-journey-c.test.tsx, tests/matrix-data-fuzz.test.ts, tests/matrix-invariants.test.ts +2 |
| store.setPlanHintHidden | lib/store.ts | tests/matrix-invariants.test.ts |
| store.isReadyForTests | lib/store.ts | tests/app.tsx, tests/audit-0.10-plan.test.ts |
| store.__resetForTests | lib/store.ts | tests/app.tsx, tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-tst-ui.test.tsx +14 |
| store.focusSet | lib/store.ts | tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx, tests/regress.test.tsx +2 |
| swap.swapCandidates | lib/swap.ts | tests/audit-0.10-stats.test.ts, tests/audit-0.10-tst.test.ts, tests/catalog-full.test.tsx +2 |
| swap.sortOthers | lib/swap.ts | tests/catalog-full.test.tsx |
| swap.implLabel | lib/swap.ts | tests/swap-top3.test.ts |
| swap.otherImpls | lib/swap.ts | tests/swap-logic.test.ts, tests/swap-top3.test.ts |
| swap.reasonText | lib/swap.ts | tests/swap-top3.test.ts |
| swap.parseSwapTarget | lib/swap.ts | tests/matrix-logic.test.tsx |
| theme.applyTheme | lib/theme.ts | tests/matrix-logic.test.tsx |
| theme.useTheme | lib/theme.ts | tests/matrix-logic.test.tsx |
| timer.ensurePermission | lib/timer.ts | tests/matrix-logic.test.tsx, tests/timer-logic.test.ts |
| timer.start | lib/timer.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-live.test.tsx, tests/audit-0.10-tst.test.ts +20 |
| timer.adjust | lib/timer.ts | tests/matrix-logic.test.tsx, tests/matrix-time.test.ts, tests/regress.test.tsx +1 |
| timer.relabel | lib/timer.ts | tests/audit-0.10-tst.test.ts, tests/timer-logic.test.ts |
| timer.stop | lib/timer.ts | tests/audit-0.10-live.test.tsx, tests/audit-0.10-tst-ui.test.tsx, tests/audit-0.10-tst.test.ts +60 |
| timer.stopIfFrom | lib/timer.ts | tests/matrix-logic.test.tsx, tests/timer-logic.test.ts |
| timer.restore | lib/timer.ts | tests/audit-final-timer.test.tsx, tests/matrix-time.test.ts, tests/regress.test.tsx +1 |
| timer.onForeground | lib/timer.ts | tests/matrix-logic.test.tsx, tests/matrix-time.test.ts, tests/timer-logic.test.ts |
| timer.resetAll | lib/timer.ts | tests/audit-journey-c.test.tsx, tests/matrix-data-fuzz.test.ts, tests/matrix-invariants.test.ts +2 |
| timer.startSet | lib/timer.ts | tests/audit-backlog-q.test.tsx, tests/audit-close-a.test.ts, tests/audit-final2-auto.test.ts +6 |
| timer.refreshScheduled | lib/timer.ts | tests/audit-backlog-r75.test.tsx, tests/regress.test.tsx, tests/timer-logic.test.ts |
| timer.stopSet | lib/timer.ts | tests/audit-0.10-live.test.tsx, tests/audit-0.10-tst-ui.test.tsx, tests/audit-backlog-q.test.tsx +58 |
| timer.setElapsed | lib/timer.ts | tests/matrix-logic.test.tsx, tests/timer-logic.test.ts |
| timer.setReached | lib/timer.ts | tests/matrix-logic.test.tsx, tests/timer-logic.test.ts |
| timer.tick | lib/timer.ts | tests/audit-0.10-tst.test.ts, tests/audit-journey-a.test.tsx, tests/audit-records-live.test.tsx +9 |
| timer.subscribe | lib/timer.ts | tests/matrix-logic.test.tsx, tests/timer-logic.test.ts |
| timer.scheduleWeighReminder | lib/timer.ts | tests/audit-backlog-r75.test.tsx, tests/morning-removed.test.tsx, tests/timer-logic.test.ts |
| timer.cancelStaleReminder | lib/timer.ts | tests/audit-io-more.test.tsx, tests/timer-logic.test.ts |
| timer.staleBody | lib/timer.ts | tests/audit-stale-ui.test.tsx, tests/backlog-0.10.1-dane-ui.test.tsx, tests/backlog-0.10.1-dane.test.ts +2 |
| timer.scheduleStaleReminder | lib/timer.ts | tests/regress.test.tsx, tests/timer-logic.test.ts |
| tplsync.templateDiff | lib/tplsync.ts | tests/audit-0.10-ui.test.tsx, tests/audit-k1-log.test.ts, tests/live2-split-template.test.tsx +1 |
| tplsync.updateTemplateFromWorkout | lib/tplsync.ts | tests/audit-0.10-ui.test.tsx, tests/audit-k1-log.test.ts, tests/live2-split-template.test.tsx +1 |
| tplsync.templateFromWorkout | lib/tplsync.ts | tests/audit-0.10-ui.test.tsx, tests/matrix-invariants.test.ts |
| tplsync.templateDiffText | lib/tplsync.ts | tests/audit-0.10-ui.test.tsx |
| units.applyUnit | lib/units.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-live-logic.test.ts, tests/audit-0.10-live.test.tsx +28 |
| units.wu | lib/units.ts | tests/matrix-data-fuzz.test.ts, tests/matrix-dim-metrics.test.tsx, tests/units.test.ts |
| units.wOut | lib/units.ts | tests/audit-backlog-r75.test.tsx, tests/audit-r83.test.tsx, tests/audit-training.test.ts +6 |
| units.wField | lib/units.ts | tests/audit-close2-b.test.tsx, tests/logic.test.ts, tests/matrix-dim-metrics.test.tsx +1 |
| units.wIn | lib/units.ts | tests/audit-0.10-live.test.tsx, tests/audit-backlog-r75.test.tsx, tests/audit-close-d.test.ts +15 |
| units.wInKeep | lib/units.ts | tests/matrix-dim-metrics.test.tsx, tests/matrix-logic.test.tsx |
| units.snapLb | lib/units.ts | tests/matrix-logic.test.tsx |
| units.snapLegacyLb | lib/units.ts | tests/matrix-migrations.test.tsx, tests/regress.test.tsx, tests/units.test.ts |
| units.fmtNum | lib/units.ts | tests/matrix-i18n.test.tsx, tests/matrix-logic.test.tsx, tests/scenario-full.test.tsx +1 |
| units.volOut | lib/units.ts | tests/regress.test.tsx, tests/units.test.ts |
| units.fmtVol | lib/units.ts | tests/invariants.test.ts, tests/matrix-logic.test.tsx, tests/regress.test.tsx +2 |
| units.fmtW | lib/units.ts | tests/audit-close-d.test.ts, tests/audit-training.test.ts, tests/invariants.test.ts +3 |
| version.versionLabel | lib/version.ts | tests/version-label.test.tsx |
| whatsnew.whatsNewUnseen | lib/whatsnew.ts | tests/mutation-bounds.test.ts, tests/whats-new.test.tsx |
| whatsnew.markWhatsNewSeen | lib/whatsnew.ts | tests/mutation-bounds.test.ts, tests/whats-new.test.tsx |

## WYMIAR

| Pozycja | Źródło | Testy (pierwsze 3) |
|---|---|---|
| ICON_PLATES (4) | lib/brandIcon.ts | tests/intro.test.tsx, tests/motyw.test.tsx |
| ICON_SCHEMES (2) | lib/brandIcon.ts | tests/intro.test.tsx |
| LoadSource: barbell \| dumbbell \| cable \| machine_stack \| bodyweight \| trap_bar \| ez_bar \| plate_loaded_machine \| kettlebell \| smith \| band \| none | lib/catalog.generated.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-tst-ui.test.tsx +5 |
| Pattern: h_push \| h_pull \| v_push \| v_pull \| squat \| hinge \| lunge_single_leg \| isolation \| core_flexion \| core_anti_ext \| core_anti_rot \| core_other \| carry \| cardio \| other \| mobility | lib/catalog.generated.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-gen.test.ts, tests/audit-0.10-plan.test.ts +1 |
| CATALOG_CAPS (91) | lib/catalog.generated.ts | tests/catalog-v2.test.ts, tests/locations-catalog.test.ts |
| CATALOG_ADDED_REVS (4) | lib/catalog.generated.ts | tests/audit-k1-catalog-step.test.ts, tests/catalog-v2.test.ts |
| CATALOG_LIB_EXTRA (585) | lib/catalog.generated.ts | tests/catalog-v2.test.ts |
| UNMAPPED_MUSCLES (4) | lib/catalog.generated.ts | tests/audit-0.10-ui.test.tsx |
| CUE_SECTIONS (4) | lib/cues/index.ts | tests/cues.test.tsx, tests/figures.test.tsx |
| CUE_BASIS_KINDS (4) | lib/cues/index.ts | tests/audit-k1-bl-mer.test.tsx |
| DraftKind: exercise \| template | lib/draft.ts | tests/app.tsx |
| DraftEffect: created \| restored | lib/draft.ts | tests/audit-k1-fala2b.test.tsx |
| EXTRA_CAPS (4) | lib/equipment.ts | tests/audit-0.10-tst.test.ts |
| CAPABILITIES (2) | lib/equipment.ts | tests/locations-catalog.test.ts |
| EQUIP_GROUPS (8) | lib/equipment.ts | tests/app.tsx |
| LoadKind: barbell \| ez_bar \| trap_bar \| dumbbell \| kettlebell \| cable \| machine | lib/equipment.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-ui.test.tsx, tests/audit-k1-bl-mer.test.tsx +3 |
| EQUIPMENT (87) | lib/equipment.ts | tests/audit-0.10-tst.test.ts, tests/audit-k1-brands.test.ts, tests/catalog-v2.test.ts +5 |
| LOAD_PRESETS (5) | lib/equipment.ts | tests/audit-k1-brands.test.ts, tests/locations-audit.test.tsx, tests/locations-catalog.test.ts +3 |
| LOCATION_PRESETS (4) | lib/equipment.ts | tests/audit-0.10-gen.test.ts, tests/matrix-dim-equipment.test.tsx, tests/matrix-invariants.test.ts +1 |
| View: side \| front | lib/figures/geom.ts | tests/figures.test.tsx |
| FrameName: start \| mid \| end | lib/figures/geom.ts | tests/audit-0.10-live.test.tsx, tests/audit-final2-fg.test.tsx, tests/figures.test.tsx |
| Role: body \| far \| load \| fixed \| pad \| cable | lib/figures/geom.ts | tests/audit-backlog-r75.test.tsx, tests/audit-r82.test.tsx, tests/figures.test.tsx |
| Goal: strength \| hypertrophy \| cut | lib/generator.ts | tests/audit-0.10-gen-ui.test.tsx, tests/audit-0.10-gen.test.ts |
| GEN_MINUTES (3) | lib/generator.ts | tests/audit-0.10-gen.test.ts, tests/matrix-invariants.test.ts, tests/mutation-generator.test.ts |
| HELP_EQUIP (4) | lib/generator.ts | tests/audit-0.10-gen.test.ts |
| MAJOR (8) | lib/generator.ts | tests/audit-0.10-gen.test.ts, tests/gen-days.test.ts, tests/mutation-generator.test.ts +1 |
| SessionKey: fbw \| fbwA \| fbwB \| upA \| upB \| loA \| loB \| cardio | lib/generator.ts | tests/audit-0.10-data.test.ts, tests/gen-days-ui.test.tsx, tests/gen-days.test.ts |
| GUIDE (10) | lib/guide.ts | tests/backlog-0.10.1-dane.test.ts, tests/guide.test.tsx |
| LANGS (26) | lib/i18n.ts | tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-lang.test.ts, tests/audit-0.10-tst.test.ts +21 |
| LB_REGIONS (3) | lib/i18n.ts | tests/audit-0.10-tst.test.ts |
| LOCALE_UPPER (2) | lib/i18n.ts | tests/audit-0.10-lang.test.ts |
| INTRO_MODES (2) | lib/intro.ts | tests/intro.test.tsx |
| LICENSES (616) | lib/licenses.generated.ts | tests/audit-0.10-data-ui.test.tsx, tests/licenses-native.test.tsx |
| NATIVE_LICENSES (7) | lib/licenses.generated.ts | tests/licenses-native.test.tsx |
| CAPPED_IMPLS (2) | lib/loadcap.ts | tests/audit-k1-bl-mer.test.tsx |
| LoadUnit: kg \| lb | lib/loads.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-gen-ui.test.tsx |
| SpecProblem: list_too_long \| plates_too_many_rows \| plates_too_many_combos \| range_invalid \| range_too_many | lib/loads.ts | tests/audit-0.10-tst.test.ts, tests/locations-audit.test.tsx |
| LOAD_ORDER (4) | lib/motif.ts | tests/motyw-miesiac.test.tsx, tests/motyw.test.tsx |
| ICON_PLATES (4) | lib/motif.ts | tests/intro.test.tsx, tests/motyw.test.tsx |
| DAY_MARKS (4) | lib/motif.ts | tests/matrix-a11y.test.tsx, tests/motyw.test.tsx |
| MONTH_WEEK_STATES (3) | lib/motif.ts | tests/motyw-miesiac.test.tsx |
| View: front \| back | lib/musclemap.ts | tests/figures.test.tsx, tests/muscle-map.test.tsx |
| PARTS (18) | lib/musclemap.ts | tests/muscle-map.test.tsx |
| SHADE_MIX (5) | lib/musclemap.ts | tests/muscle-map.test.tsx |
| PeriodKind: week \| month | lib/period.ts | tests/audit-0.10-stats.test.ts, tests/matrix-i18n.test.tsx |
| DayStatus: done \| other \| planned \| missed \| rest | lib/plan.ts | tests/audit-0.10-data.test.ts, tests/audit-0.10-plan.test.ts |
| LEGACY_REMINDER_IDS (1) | lib/planReminder.ts | tests/rm-signing.test.tsx |
| ReminderPermission: granted \| denied \| undetermined | lib/planReminder.ts | tests/audit-0.10-plan-ui.test.tsx, tests/audit-0.10-plan.test.ts |
| MODULES (6) | lib/seed.ts | tests/matrix-data-shared.ts |
| METRICS (6) | lib/seed.ts | tests/matrix-dim-metrics.test.tsx, tests/matrix-invariants.test.ts, tests/matrix-shared.tsx |
| MUSCLES (12) | lib/seed.ts | tests/logic.test.ts, tests/matrix-dim-catalog.test.tsx, tests/matrix-dim-langs1.test.tsx +5 |
| SET_KINDS (4) | lib/seed.ts | tests/matrix-dim-metrics.test.tsx |
| LoadMode: per_dumbbell \| total \| unilateral | lib/seed.ts | tests/audit-final-timer.test.tsx, tests/audit-k1-data.test.ts, tests/audit-r72-c.test.ts |
| SessionMode: solo \| remote \| in_gym | lib/seed.ts | tests/audit-0.10-tst.test.ts |
| Equipment: hantle \| sztanga \| masa ciała \| maszyna \| linki \| inne | lib/seed.ts | tests/audit-0.10-stats.test.ts, tests/audit-k1-bl-mer.test.tsx, tests/audit-r72-c.test.ts +3 |
| GROUPS (11) | lib/seed.ts | tests/logic.test.ts, tests/matrix-dim-langs1.test.tsx, tests/matrix-dim-langs2.test.tsx +3 |
| IMPLS (8) | lib/seed.ts | tests/matrix-karta.test.tsx |
| ThemeSetting: light \| dark \| auto | lib/seed.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-lang-ui.test.tsx, tests/audit-r72-c.test.ts |
| WORKOUT_VIEWS (2) | lib/seed.ts | tests/matrix-tuleja.test.tsx |
| LIB_MUSCLE_FIXES (2) | lib/seed.ts | tests/catalog-v2.test.ts |
| LIB (2) | lib/seed.ts | tests/audit-0.10-stats.test.ts, tests/catalog-library25.test.tsx, tests/catalog-v2.test.ts +5 |
| TotalKind: objętość treningu \| suma powtórzeń \| łączny czas \| łączny dystans | lib/stats.ts | tests/audit-final-stats.test.ts, tests/catalog-library25.test.tsx, tests/matrix-invariants.test.ts |
| ChartKey: total \| maxLoad \| bestE1rm \| volume \| maxReps \| maxDuration \| maxDistance | lib/stats.ts | tests/audit-0.10-data.test.ts, tests/audit-final-timer.test.tsx, tests/regress.test.tsx +1 |
| CFG_KEYS (10) | lib/store.ts | tests/audit-0.10-tst.test.ts |
| SwapReason: pattern \| muscle \| firstMuscle \| group \| secondary \| swapped \| history | lib/swap.ts | tests/audit-0.10-tst.test.ts, tests/audit-journey-d.test.tsx, tests/audit-k1-catalog-step.test.ts +2 |
| StaleKind: work \| warmup \| none | lib/timer.ts | tests/audit-0.10-lang-ui.test.tsx, tests/audit-0.10-live-logic.test.ts, tests/audit-stale-ui.test.tsx |
| Unit: kg \| lb | lib/units.ts | tests/audit-0.10-data-ui.test.tsx, tests/audit-0.10-gen-ui.test.tsx |
| WHATS_NEW (3) | lib/whatsnew.ts | tests/backlog-0.10.1-dane.test.ts, tests/guide.test.tsx, tests/mutation-bounds.test.ts +1 |
