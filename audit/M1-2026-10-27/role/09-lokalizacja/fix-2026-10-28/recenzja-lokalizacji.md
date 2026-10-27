# Recenzja lokalizacji — commity d8efe02, c4a5f48 (uk, sl), 27.10.2026

Zakres: 11 tekstów uk (8 zamian „ти” → „ви”, 3 klucze „{n} ćw.” → „впр.”), 3 teksty sl („{n} ćw.” → „vaj.”).
Kontrole: `tests/slownik-terminow.test.ts`, `tests/i18n-skrot-liczebnik.test.ts`, `tests/i18n-forma-uk.test.ts` — zielone (122 testy).
Rejestr: docs/16, wiersz „hr, sl, …, uk — formalny jak w iOS”; wskazówki techniki (`lib/cues`) poza zakresem (forma „ty” zamierzona).
Spójność uk: przeszukanie całego `lib/locales/uk.json` (zaimki ти/твій…, 2. os. l. poj., rozkaźniki „Введи/Вибери/Обери…”) — brak pozostałych form „ти”.

## Poprawki

| kod | klucz | obecnie | proponowane | powód | pewność |
|---|---|---|---|---|---|
| — | — | — | — | brak poprawek | — |

uk: „Введіть / Виберіть / Оберіть / додасте / вашим” — poprawne formy grzecznościowe, naturalne jak w iOS; „впр.” to przyjęty skrót („вправа”), zgodny z kluczem `ćw.` (`впр.`) używanym na innych ekranach.
sl: „vaj.” jest zgodne z istniejącym kluczem `ćw.` (`vaj.`, ekrany szablonów i dodawania treningu), więc zmiana ujednolica aplikację.

## Pytanie do native speakera (sl)

- Czy w wierszu „danes v načrtu · 4 vaj.” skrót „vaj.” brzmi naturalnie, czy lepiej zapis bez odmiany „vaje: 4” (jak „Nove vaje: {n}”)? Uwaga: „vaj” to pełne słowo (dopełniacz l.mn.), kropka może wyglądać jak literówka. Wariant „vaje: {n}” wymagałby zmiany klucza `ćw.` w sl i wyjątku w `tests/i18n-skrot-liczebnik.test.ts`.

## Nowe terminy do słownika

- Skrót „ćw.” (uk „впр.”, sl „vaj.”) — warto dopisać do `docs/lokalizacja/slownik-terminow.json` jako termin, żeby skrót był jeden w całej aplikacji (dziś pilnuje go tylko test skrótu liczebnika).

Podsumowanie: 14 tekstów przeczytanych, 0 poprawek, 1 pytanie.
