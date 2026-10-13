# Pliki wzorcowe protokołu zegarka (0.20)

Generowane z kodu telefonu — **nie edytuj ręcznie**. Odtworzenie: `UPDATE_WATCH=1 npx jest tests/watch-fixtures.test.ts`.
Opis protokołu i modelu zegarka: `docs/35-zegarki.md`.

| Katalog / plik | Co zawiera | Kto czyta |
|---|---|---|
| `protocol.json` | wersja, stałe (okno „Cofnij”, limity), listy wartości (typy zdarzeń, fazy, ekrany, akcje) | Swift, Monkey C |
| `messages/valid/*.json` | po jednym poprawnym komunikacie każdego rodzaju (hello, welcome, ack, session, 7 zdarzeń) | oba klienty (kodowanie / dekodowanie) |
| `messages/invalid.json` | komunikaty, które telefon odrzuca, z powodem | testy dekodera |
| `snapshots/*.json` | migawki prawdziwego telefonu: fazy, superset, seria na czas, masa ciała, funty, języki | dekodowanie migawek |
| `labels/<język>.json` | stałe etykiety zegarka w 35 językach (źródło dla `Localizable.strings` / `strings.xml`) | generatory tłumaczeń |
| `scenarios/*.json` | model zegarka: kroki `input` (z godziną `at`) → oczekiwane `out` (zdarzenia do wysłania) i `view` (co wyświetlić) | `swift test`, Run No Evil |

Czas w scenariuszach to epoka w ms (UTC); `view.restEndsAt`, `undoUntil` itd. są w tej samej skali. Klient ma po każdym kroku dać dokładnie `expect.out` i
widok zgodny z `expect.view` (komplet pól).
