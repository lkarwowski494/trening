# Audyt wydania 1.1.1 — zmiany od 1.1 + stała lista kontrolna (22.11.2026)

Zakres (KO-120, do weta): zmiany od tagu `v1.1.0-b1041` do `wyd/1-1-1` i stała lista kontrolna (dane, migracje, prywatność); bez pełnego audytu całości. Audytor: rola `audytor` (niezależna od wykonawcy, odczyt na HEAD `654f8c86`); próg: blokują tylko KRYTYCZNE i WYSOKIE (CLAUDE.md, „Audyty i wydania”).

**Werdykt: brak znalezisk KRYTYCZNYCH i WYSOKICH — nic nie blokuje wydania.** Dwa NISKIE (backlog).

| ID | Waga | Realność | Plik | Opis | Stan |
|---|---|---|---|---|---|
| N-1 | NISKIE | realny | `lib/whatsnew-wpisy.ts`, `store/app-store-metadata.json` (whatsNew) | Pierwsza wersja punktu „Opis {app} w App Store jest teraz dokładniejszy…” twierdziła zmianę opisu, a `description` jest identyczny z 1.1 we wszystkich 33 lokalizacjach (zmieniły się nazwy, podtytuły, słowa kluczowe) | **naprawione 22.11.2026**: tekst „Zaktualizowaliśmy informacje o {app} w App Store, żeby łatwiej było je znaleźć. Sama aplikacja działa tak samo…” (PL, EN, 31 słowników + es-419, pt-BR, `_source.json`, whatsNew sklepu); test `tests/release-1.1.1.test.tsx` |
| N-2 | NISKIE | brzegowy | `store/review-notes.en.txt` | Notatki dla recenzenta mówią „New in 1.1” i nie wyjaśniają, że 1.1.1 to tylko metadane | backlog; opcjonalnie jedno zdanie „1.1.1: store metadata only, no functional changes” przy wklejaniu do ASC (X-14 w docs/49b) |

## Sprawdzenia (komendy z kodem wyjścia — raport audytora)

- **A1 pliki aplikacji:** `git diff --name-only v1.1.0-b1041..HEAD | grep -vE '^(docs/|tests/|lib/locales/|store/|scripts/|\.github/|README.md$)'` → tylko `app.json`, `lib/i18n.en.ts`, `lib/whatsnew-wpisy.ts`, `package-lock.json`, `package.json`; `git diff --stat v1.1.0-b1041..HEAD -- app components targets ios assets plugins modules` → pusty. W `lib` (poza słownikami) i `app.json`: pola `version` 1.1.0→1.1.1, jedna linia EN, nowy wpis „Co nowego”.
- **A2 dane i migracje:** `SCHEMA_VERSION = 19` w tagu i na HEAD (`lib/seed.ts:15`); `git diff v1.1.0-b1041..HEAD -- tests/fixtures/released lib/seed.ts lib/store.ts` → 0 linii; `tests/migrate-released.test.ts` czyta wszystkie zapisy z `tests/fixtures/released/` (w tym b1033, schemat 19).
- **A3 zależności i prywatność:** w `package.json` i `package-lock.json` zmieniają się tylko trzy linie `version`; `privacyManifests` w `app.json` bez zmian; `targets/*` bez zmian.
- **B sekrety i dane osobowe:** wzorce kluczy (PEM, p8, tokeny, UUID, UDID) w diffie i `store/` → 0 trafień; jedyny e-mail to firmowy adres wsparcia (jak od 1.0).
- **B skrypty zapisu do ASC:** `asc-zrzuty.yml` domyślnie dry-run, zapis tylko w zadaniu ze środowiskiem `release`; DELETE ograniczony do pojedynczych placementów (`scripts/asc/iap-localizations.mjs:48-49`, `scripts/asc/zrzuty.mjs:386`, `PLACEMENT_DELETE_OK`); logi bez identyfikatorów (maskowanie `ASC_KEY_ID`, `ASC_ISSUER_ID`, ścieżki `{id}`).
- **B limity Apple (33 lokalizacje):** nazwa ≤ 30 (maks. 30), podtytuł ≤ 30 (29), słowa kluczowe ≤ 100 B (100), tekst promocyjny ≤ 170 (170), opis ≤ 4000 (3991), whatsNew ≤ 4000; naruszeń 0; `node scripts/asc/kontrola-oczekiwane.mjs --check` kod 0.
- **B marki i źródła w tekstach sklepu:** poza „Apple” (Apple Watch, Zdrowie; bez zmian od 1.1) brak; obietnice funkcji z nazw i podtytułów mają pokrycie w kodzie (progresja `app/progression.tsx`, plan `app/plan.tsx`, generator, zegarek `targets/watch-app`, minutnik).

## Nie sprawdzono

- Poprawność językowa przekładów (nowy punkt „Co nowego”, nazwy i podtytuły) — recenzja native speakerów (lt, lv, et, sr, ms, vi, tr, uwaga na rodzaj gramatyczny przy `{app}`); to ŚREDNIE do backlogu 1.2, nie blokuje.
- Stan App Store Connect (wolne nazwy, liczenie słów kluczowych po stronie usługi, wersja robocza).
- Wygląd wpisu na ekranie „Co nowego” i VoiceOver — komponent `components/WhatsNew.tsx` bez zmian; pokrywa go telefon właściciela (docs/49b pkt 3).
