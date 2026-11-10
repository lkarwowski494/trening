# Recenzja niezależna rodziny v2 `back_extension` — runda 2 (audytor, 10.11.2026)

Recenzja różnicy po poprawkach r1. Stan zamrożony: `figury/partia-4-back_extension` @ acfbb24 (r1: aec8cda), czysta kopia. Poprawki napisał inny programista niż autor rodziny; recenzent nie pisał rodziny ani poprawek.

## Werdykt

| Wpis | Werdykt |
|---|---|
| v2 `back_extension` (4 ćwiczenia, 1 bez rysunku) | **wyswietlana** |
| karta Back Extension | wyswietlana (bez zmian od r1) |
| zestawy Reverse Hyperextension, Lower Back Curl | wyswietlana (bez zmian od r1) |
| v1 | brak wpisów do zastąpienia |

## Znaleziska r1 — stan

| ID | Klasa | Stan | Dowód |
|---|---|---|---|
| W1 | WYSOKIE | naprawione | `poseData.ts`: `'Lower Back Curl': { hideAngle: true }` (wzór Car Drivers); `angleLineShown` = false, nazwy faz bez zmian (Unoszenie 1 s / Opuszczanie 2 s). Test `tests/figures-v2-back-extension-kat.test.ts`: skok między kadrami co 0,05 ≤ 8° dla ćwiczeń z linią kąta. Próg 8° zamiast proponowanych 5° **nie jest poluzowaniem**: zmierzony legalny ruch to Back Extension maks. 5,3° (u 0,75), Reverse Hyperextension maks. 6,4° (u 0,60) — próg 5° odrzuciłby poprawny rysunek (moja propozycja z r1 była za ciasna); dawny skok znaku 18,9° jest ponad 2× nad progiem, a negatyw na danych (pomiar surowy Lower Back Curl > 8°) pilnuje, że miara go wykrywa. |
| N2 | NISKIE | naprawione | komentarz w generatorze wskazuje `tests/figures-v2-back-extension.test.tsx` |
| Ś1 | ŚREDNIE | backlog (lead) | dłonie reverse hyper w powietrzu |
| N1 | NISKIE | backlog (lead) | pomiar 3D biodra na górze 9–10° |

Nowych znalezisk brak.

## Sprawdzone

- Dane póz, nakładka, teksty i zestawy bez zmian (`git diff aec8cda..acfbb24` pusty dla `lib/figures/v2/poses`, `overlay`, `lib/cues`, `cue-sets.json`); arkusze `arkusz-slad` Reverse Hyperextension i Lower Back Curl bajtowo równe r1 (cmp), Back Extension przegenerowany.
- Zmiana asercji w teście rodziny (wyjątki `DATA_UI`) — dopisany wyjątek, nic nie usunięte.
- `jest --runInBand`: `figures-v2-back-extension-kat.test.ts` i `figures-v2-back-extension.test.tsx` — 24/24.
- Wpisy JSON: `recenzja-szkielet --sprawdz` — komplet.

Skróty (`zrodla-runtime.mjs --skroty`, kopia recenzji @ acfbb24): v2 back_extension 014b427fa2f2 (zmiana względem r1: `poseData.ts`); karta Back Extension 22159fe935b0; zestawy Reverse Hyperextension 2552fa39017b, Lower Back Curl cfcd14a3dc6d.
