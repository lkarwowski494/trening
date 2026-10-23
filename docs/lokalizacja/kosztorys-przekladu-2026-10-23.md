# Kosztorys przekładu zestawu kluczy (23.10.2026)

Zestaw: `docs/lokalizacja/zestaw-przekladu-2026-10-23.json` — 74 klucze (37 przepisanych „zmieniony” + 37 nowych „nowy”; PL i EN gotowe) na 33 języki aplikacji
(poza PL i EN; es-419 i pt-BR policzone jak pełne języki, choć są nakładkami na es i pt — to zawyżenie).
**Nic nie wysłano.** Liczy `node scripts/i18n/przeklad-szacuj.mjs` (bez sieci, bez klucza API); ceny i modele z `scripts/i18n/przeglad-api.mjs`
(skill claude-api, tabela „Current Models”, stan 2026-10-06): Opus 5.5 — 4 / 20 USD za mln tokenów (wejście / wyjście), Sonnet 5.5 — 2 / 10 USD; Message Batches −50%.

## Narzędzie do przekładu
W portfelu **nie ma** narzędzia do przekładu przez API: `scripts/i18n/przeglad-api.mjs` to przegląd gotowych tłumaczeń (Message Batches, rejestry zwracania się, kosztorys `--szacuj`),
`/home/user/prompts` (role, moduł `09-lokalizacja`) i `apps4brew-narzedzia` (tylko README) nie zawierają skryptu przekładu. Do przekładu trzeba dopisać skrypt wzorowany na
`przeglad-api.mjs` (jedno żądanie na język, ten sam rejestr `REJESTR`, wynik do `lib/locales/<kod>.json`, kontrola zmiennych `{…}` i form liczby mnogiej `kontrolaLokalna`),
potem uruchomić przegląd `przeglad-api.mjs` na nowych kluczach. Szkic instrukcji systemowej jest w `przeklad-szacuj.mjs` (SYSTEM).

## Szacunek
Założenia (nie pomiar, celowo zawyżone): wejście = instrukcja + rejestr języka + 74 pary (PL, EN) ≈ 6,5 tys. tokenów na język; wyjście = tokeny angielskiego brzmienia × współczynnik długości
(1,0 CJK; 1,25 języki romańskie i id/ms/vi; 1,35 germańskie i słowiańskie; 1,6 cyrylica i grecki) + 12 tokenów obwiedni JSON na klucz + 3000 tokenów myślenia na żądanie.

| Wariant | Języków × kluczy | Tokeny wejścia | Tokeny wyjścia | Opus 5.5, Batch −50% | Sonnet 5.5, Batch −50% |
|---|---|---|---|---|---|
| Podstawowy (myślenie 3 tys.) | 33 × 74 | 218 667 | 259 687 | **ok. 3,03 USD** | **ok. 1,52 USD** |
| Ostrożny (myślenie 10 tys. na język) | 33 × 74 | 218 667 | 490 687 | ok. 5,34 USD | ok. 2,67 USD |
| Bez rabatu Batch (podstawowy) | 33 × 74 | 218 667 | 259 687 | ok. 6,07 USD | ok. 3,03 USD |
| Bez es-419 i pt-BR (nakładki zrobi się z es i pt) | 31 × 74 | — | — | ok. 2,85 USD | ok. 1,43 USD |

Limit kosztu jednego przebiegu w narzędziach portfela: 50 USD (`LIMIT_KOSZTU_USD`) — wszystkie warianty mieszczą się z dużym zapasem. Przegląd tłumaczeń po przekładzie
(`przeglad-api.mjs`, zdania krytyczne + nowe klucze) to osobny koszt rzędu kilku USD (kosztorys: `node scripts/i18n/przeglad-api.mjs --szacuj`).

**Rekomendacja:** Opus 5.5, Batch, wariant podstawowy (ok. 3 USD) — zdania zawierają ostrzeżenia (asekuracja, bezpieczeństwo) i liczby, a różnica do Sonneta to ok. 1,5 USD;
po przekładzie przegląd rolą tłumacza. Przekład wymaga zgody właściciela na kwotę (CLAUDE.md: nic płatnego bez zgody).

## Wiersze na język (tokeny, szacunek)
| Język | Kluczy | Wejście | Wyjście |
|---|---|---|---|
| bg | 74 | 6623 | 8682 |
| cs | 74 | 6622 | 7933 |
| da | 74 | 6614 | 7933 |
| de | 74 | 6615 | 7933 |
| el | 74 | 6625 | 8682 |
| es | 74 | 6622 | 7633 |
| es-419 | 74 | 6639 | 7633 |
| et | 74 | 6630 | 7933 |
| fi | 74 | 6631 | 7933 |
| fr | 74 | 6641 | 7633 |
| hr | 74 | 6623 | 7933 |
| hu | 74 | 6623 | 7933 |
| id | 74 | 6625 | 7633 |
| it | 74 | 6614 | 7633 |
| ja | 74 | 6629 | 6884 |
| ko | 74 | 6635 | 6884 |
| lt | 74 | 6623 | 7933 |
| lv | 74 | 6623 | 7933 |
| ms | 74 | 6616 | 7633 |
| nb | 74 | 6618 | 7933 |
| nl | 74 | 6618 | 7933 |
| pt | 74 | 6629 | 7633 |
| pt-BR | 74 | 6644 | 7633 |
| ro | 74 | 6623 | 7933 |
| ru | 74 | 6638 | 8682 |
| sk | 74 | 6623 | 7933 |
| sl | 74 | 6623 | 7933 |
| sr | 74 | 6637 | 8682 |
| sv | 74 | 6615 | 7933 |
| tr | 74 | 6636 | 7933 |
| uk | 74 | 6623 | 8682 |
| vi | 74 | 6627 | 7633 |
| zh-Hant | 74 | 6640 | 6884 |
