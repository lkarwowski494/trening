# Rejestr języków

Stan: 20.10.2026 (audyt M1-067, DEC-21 wariant a). Rejestr obejmuje **wszystkie obecne języki** (`LANGS` w `lib/i18n.ts`); nowych języków w tym zadaniu nie dodajemy. Nowy język = nowy wiersz tutaj w tym samym commicie (pilnuje `tests/audit-m1-067-language-registry.test.ts`, który porównuje listę kodów z `LANGS`).

Źródła kolumn: fala, tłumaczenie i recenzja — `docs/16-jezyki-i-marka.md`; kontrola treści krytycznej (zdanie medyczne, asekuracja, wskazówki) — tabela generowana w `docs/16` (sekcja „Treść krytyczna”, M1-049); nazwy sklepu — `store/app-store-names.json`; zakupy — `store/iap-localizations.json`; opis sklepu — `docs/15` (projekt tylko PL/EN, pozostałe lokalizacje: docs/41 D4).
Kolumny „nazwa w App Store”, „opis w App Store” i „zakupy (ASC)” test wylicza z plików sklepu; „kontrole automatyczne” — z istnienia plików testów.

Ryzyko dla wydania w App Store: R-010 w `docs/40-lekcje.md` (drugi przegląd przez native speakerów i forma zwracania się w fr i tr).

<!-- rejestr:start -->
| kod | język | fala (decyzja) | tłumaczenie | recenzja drugim agentem | drugi przegląd (native speaker) | kontrole automatyczne | zrzuty z symulatora | nazwa w App Store | opis w App Store | zakupy (ASC) |
|---|---|---|---|---|---|---|---|---|---|---|
| `pl` | Polski | bazowy (język źródłowy) | autor (teksty źródłowe w kodzie) | — | niewykonany (język źródłowy) | locales; cues | zrzuty sklepu (`store/screenshot-captions.json`); Maestro 09, 37 | pl | projekt (docs/15) | wersja bazowa |
| `en` | English | bazowy (T-040) | słownik `lib/i18n.en.ts` (T-040) | — | niewykonany | locales; cues; krytyczne (049) | zrzuty sklepu (`store/screenshot-captions.json`); Maestro 09, 37 | en-US, en-GB, en-AU, en-CA | projekt (docs/15) | wersja bazowa |
| `cs` | Čeština | 05.10.2026 — 14 języków (docs/16) | agent AI, osobny na język | tak (05.10.2026) | niewykonany | locales; cues; krytyczne (049) | brak zapisu | cs | brak (docs/41 D4) | tak |
| `sk` | Slovenčina | 05.10.2026 — 14 języków (docs/16) | agent AI, osobny na język | tak (05.10.2026) | niewykonany | locales; cues; krytyczne (049) | brak zapisu | sk | brak (docs/41 D4) | tak |
| `hu` | Magyar | 05.10.2026 — 14 języków (docs/16) | agent AI, osobny na język | tak (05.10.2026) | niewykonany | locales; cues; krytyczne (049) | brak zapisu | hu | brak (docs/41 D4) | tak |
| `ro` | Română | 05.10.2026 — 14 języków (docs/16) | agent AI, osobny na język | tak (05.10.2026) | niewykonany | locales; cues; krytyczne (049) | brak zapisu | ro | brak (docs/41 D4) | tak |
| `bg` | Български | 05.10.2026 — 14 języków (docs/16) | agent AI, osobny na język | tak (05.10.2026) | niewykonany | locales; cues; krytyczne (049) | brak zapisu | brak (nie jest lokalizacją ASC) | brak (docs/41 D4) | pominięty (nie jest lokalizacją ASC) |
| `hr` | Hrvatski | 05.10.2026 — 14 języków (docs/16) | agent AI, osobny na język | tak (05.10.2026) | niewykonany | locales; cues; krytyczne (049) | brak zapisu | hr | brak (docs/41 D4) | tak |
| `sl` | Slovenščina | 05.10.2026 — 14 języków (docs/16) | agent AI, osobny na język | tak (05.10.2026) | niewykonany | locales; cues; krytyczne (049) | brak zapisu | sl | brak (docs/41 D4) | odrzucony przez ASC (14.10.2026) |
| `sr` | Српски | 05.10.2026 — 14 języków (docs/16) | agent AI, osobny na język | tak (05.10.2026) | niewykonany | locales; cues; krytyczne (049) | brak zapisu | brak (nie jest lokalizacją ASC) | brak (docs/41 D4) | pominięty (nie jest lokalizacją ASC) |
| `lt` | Lietuvių | 05.10.2026 — 14 języków (docs/16) | agent AI, osobny na język | tak (05.10.2026) | niewykonany | locales; cues; krytyczne (049) | brak zapisu | brak (nie jest lokalizacją ASC) | brak (docs/41 D4) | pominięty (nie jest lokalizacją ASC) |
| `lv` | Latviešu | 05.10.2026 — 14 języków (docs/16) | agent AI, osobny na język | tak (05.10.2026) | niewykonany | locales; cues; krytyczne (049) | brak zapisu | brak (nie jest lokalizacją ASC) | brak (docs/41 D4) | pominięty (nie jest lokalizacją ASC) |
| `et` | Eesti | 05.10.2026 — 14 języków (docs/16) | agent AI, osobny na język | tak (05.10.2026) | niewykonany | locales; cues; krytyczne (049) | brak zapisu | brak (nie jest lokalizacją ASC) | brak (docs/41 D4) | pominięty (nie jest lokalizacją ASC) |
| `uk` | Українська | 05.10.2026 — 14 języków (docs/16) | agent AI, osobny na język | tak (05.10.2026) | niewykonany | locales; cues; krytyczne (049) | brak zapisu | uk | brak (docs/41 D4) | tak |
| `es` | Español (España) | 05.10.2026 — 14 języków (docs/16) | agent AI, osobny na język | tak (05.10.2026) | niewykonany | locales; cues; krytyczne (049) | brak zapisu | es-ES | brak (docs/41 D4) | tak |
| `es-419` | Español (Latinoamérica) | 09.10.2026 — fala 1 (docs/16) | agent AI; nakładka na es | brak zapisu | niewykonany | locales; cues; krytyczne (049); i18n-variants.test.ts | brak zapisu | es-MX | brak (docs/41 D4) | tak |
| `pt` | Português (Portugal) | 05.10.2026 — 14 języków (docs/16) | agent AI, osobny na język | tak (05.10.2026) | niewykonany | locales; cues; krytyczne (049) | brak zapisu | pt-PT | brak (docs/41 D4) | tak |
| `pt-BR` | Português (Brasil) | 09.10.2026 — fala 1 (docs/16) | agent AI; nakładka na pt | brak zapisu | niewykonany | locales; cues; krytyczne (049); i18n-variants.test.ts | brak zapisu | pt-BR | brak (docs/41 D4) | tak |
| `de` | Deutsch | 07.10.2026 — wariant B (docs/16) | agent AI, osobny na język | tak (07.10.2026) | niewykonany | locales; cues; krytyczne (049) | brak zapisu | de-DE | brak (docs/41 D4) | tak |
| `fr` | Français | 07.10.2026 — wariant B (docs/16) | agent AI, osobny na język | tak (07.10.2026) | niewykonany | locales; cues; krytyczne (049) | brak zapisu | fr-FR | brak (docs/41 D4) | tak |
| `it` | Italiano | 07.10.2026 — wariant B (docs/16) | agent AI, osobny na język | tak (07.10.2026) | niewykonany | locales; cues; krytyczne (049) | brak zapisu | it | brak (docs/41 D4) | tak |
| `nl` | Nederlands | 07.10.2026 — wariant B (docs/16) | agent AI, osobny na język | tak (07.10.2026) | niewykonany | locales; cues; krytyczne (049) | brak zapisu | nl-NL | brak (docs/41 D4) | tak |
| `sv` | Svenska | 07.10.2026 — wariant B (docs/16) | agent AI, osobny na język | tak (07.10.2026) | niewykonany | locales; cues; krytyczne (049) | brak zapisu | sv | brak (docs/41 D4) | tak |
| `da` | Dansk | 07.10.2026 — wariant B (docs/16) | agent AI, osobny na język | tak (07.10.2026) | niewykonany | locales; cues; krytyczne (049) | brak zapisu | da | brak (docs/41 D4) | tak |
| `nb` | Norsk | 07.10.2026 — wariant B (docs/16) | agent AI, osobny na język | tak (07.10.2026) | niewykonany | locales; cues; krytyczne (049) | brak zapisu | no | brak (docs/41 D4) | tak |
| `fi` | Suomi | 07.10.2026 — wariant B (docs/16) | agent AI, osobny na język | tak (07.10.2026) | niewykonany | locales; cues; krytyczne (049) | brak zapisu | fi | brak (docs/41 D4) | tak |
| `tr` | Türkçe | 07.10.2026 — wariant B (docs/16) | agent AI, osobny na język | tak (07.10.2026) | niewykonany | locales; cues; krytyczne (049) | brak zapisu | tr | brak (docs/41 D4) | tak |
| `el` | Ελληνικά | 07.10.2026 — wariant B (docs/16) | agent AI, osobny na język | tak (07.10.2026) | niewykonany | locales; cues; krytyczne (049) | brak zapisu | el | brak (docs/41 D4) | tak |
| `id` | Bahasa Indonesia | 09.10.2026 — fala 2 (docs/16) | agent AI, pełny słownik | brak zapisu | niewykonany | locales; cues; krytyczne (049); i18n-wave2.test.ts | web (Chromium), poza repo; symulator iOS: otwarte (docs/16) | id | brak (docs/41 D4) | tak |
| `ms` | Bahasa Melayu | 09.10.2026 — fala 2 (docs/16) | agent AI, pełny słownik | brak zapisu | niewykonany | locales; cues; krytyczne (049); i18n-wave2.test.ts | web (Chromium), poza repo; symulator iOS: otwarte (docs/16) | ms | brak (docs/41 D4) | tak |
| `vi` | Tiếng Việt | 09.10.2026 — fala 2 (docs/16) | agent AI, pełny słownik | brak zapisu | niewykonany | locales; cues; krytyczne (049); i18n-wave2.test.ts | web (Chromium), poza repo; symulator iOS: otwarte (docs/16) | vi | brak (docs/41 D4) | tak |
| `ru` | Русский | 09.10.2026 — fala 3 (docs/16) | agent AI, pełny słownik | brak zapisu | niewykonany | locales; cues; krytyczne (049); i18n-wave3.test.ts | web (Chromium), poza repo; symulator iOS: otwarte (docs/16) | ru | brak (docs/41 D4) | tak |
| `ja` | 日本語 | 09.10.2026 — fala 4 (docs/16) | agent AI, pełny słownik | brak zapisu | niewykonany | locales; cues; krytyczne (049); i18n-wave4.test.ts | web (Chromium), poza repo; symulator iOS: otwarte (docs/16) | ja | brak (docs/41 D4) | tak |
| `ko` | 한국어 | 09.10.2026 — fala 4 (docs/16) | agent AI, pełny słownik | brak zapisu | niewykonany | locales; cues; krytyczne (049); i18n-wave4.test.ts | web (Chromium), poza repo; symulator iOS: otwarte (docs/16) | ko | brak (docs/41 D4) | tak |
| `zh-Hant` | 繁體中文 | 09.10.2026 — fala 4 (docs/16) | agent AI, pełny słownik | brak zapisu | niewykonany | locales; cues; krytyczne (049); i18n-wave4.test.ts | web (Chromium), poza repo; symulator iOS: otwarte (docs/16) | zh-Hant | brak (docs/41 D4) | tak |
<!-- rejestr:end -->

Objaśnienia: „niewykonany” = brak zapisu przeglądu przez native speakera (nie zgadujemy); „brak zapisu” = w repozytorium nie ma śladu takiego działania; „web (Chromium), poza repo” = zrzuty orientacyjne z sesji, nie z symulatora iOS.
