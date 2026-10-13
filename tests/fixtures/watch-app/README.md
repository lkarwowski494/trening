Pliki „złote” zegarka Apple Watch (0.20, docs/36). WERSJA ROBOCZA: wygenerowane 13.10.2026 z modelu referencyjnego zegarka z gałęzi `f020-protokol`
(stan roboczy: lib/watch/client.ts + tests/watch-scenarios.ts — scenariusze, migawki z prawdziwego telefonu). Po scaleniu protokołu zastąp je plikami
z `watch-fixtures/` (docs/36 rozdz. 6) — format scenariusza ten sam: `{name, doc, cfg, steps: [{at, input, out, view, note}]}`.
- scenarios/*.json — wejścia (start, połączenie, komunikaty z telefonu, przyciski, tik) → zdarzenia do wysłania i widok po każdym kroku;
  XCTest (`ScenarioReplayTests`) odtwarza każdy krok na Swift i porównuje wynik z tym plikiem.
- snapshots/*.json — migawki kolejnych stanów jednego treningu.
- constants.json — liczby protokołu (`WATCH`), pilnowane testem względem `WatchLimits` w Swift.
- labels.json, lang-cases.json — generowane z lib/watchLabels.ts (tests/watch-apple-i18n.test.ts, UPDATE_WATCH_APPLE=1).
