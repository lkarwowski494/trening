Pliki generowane dla aplikacji na Apple Watch (0.20, docs/35-zegarek-apple) — NIE protokół (pliki wzorcowe protokołu: `watch-fixtures/`, docs/35):
- labels.json — stałe etykiety zegarka w 35 językach (identyfikatory z protokołu + `workoutOn` tylko Apple), z lib/watchLabels.ts;
  XCTest sprawdza, że tabela w `Core/WatchLabelTable.swift` jest identyczna, XCUITest — że ekran pokazuje te teksty w każdym języku;
- lang-cases.json — tagi języka telefonu → język aplikacji (resolveLang), dla `WatchLabels.resolve`.
Odtworzenie: `UPDATE_WATCH_APPLE=1 npx jest tests/watch-apple-i18n.test.ts`.
