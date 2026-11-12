# W-12: przegląd treści krytycznej po przekładzie (R-010), 34 języki, 12.11.2026

- autor: przekład API i tłumacz (fale przekładu wskazówek od 1.0, W-03, DIF-01; zestawy `docs/lokalizacja/zestaw-przekladu-*.json`)
- recenzent: recenzent-lokalizacji (4 niezależne przebiegi po grupach języków) oraz badacz-merytoryczny (sens zdań medycznych i asekuracji, 33 języki); subagenci ≠ autor
- wykonawca poprawek: programista sesji Z (nie recenzuje własnej poprawki — poprawki są dosłownie brzmieniem zaproponowanym przez recenzenta)
- data: 12.11.2026; stan repo: `integracja-1-1` @ 077be292 (gałąź `wyd/w12-w13-1-1`)

## Zakres

- **A (pełny):** zdanie medyczne i 5 kluczy asekuracji (docs/16, „Treść krytyczna”; klucze w `tests/audit-m1-049-critical-content.test.ts:17-24`) w 33 językach + źródło EN. Od 1.0 (`v1.0.0-b1033`) zmieniło się w nich 7 tłumaczeń (cs „jisticí”, id „Gerakan”, vi „ở phía trên”).
- **B (wybór wg ryzyka):** 96 z 516 wskazówek techniki nowych lub zmienionych od 1.0 — 85 opisów błędów `*.mis.*` (ryzyko odwrócenia sensu: lekcja lv z R-010), 9 zdań o lędźwiach, oddechu, szarpaniu i odkładaniu ciężaru oraz 2 zmienione zdania (`skull.depth` — nowy warunek „albo wcześniej, jeśli ramiona zaczną uciekać w tył”; `calf.edge`). Tekst efektywny es-419/pt-BR (baza + nakładka).
- **Poza zakresem (nazwany wyjątek, do weta):** pozostałe 420 nowych wskazówek (ustawienie i przebieg ruchu) × 33 języki ≈ 13,9 tys. zdań. Każda fala przekładu miała własną recenzję lokalizacji (`docs/lokalizacja/do-recenzji-przekladu-*.md`, `docs/research/recenzje/w03-*`, `lok-a1-a3-*`); tańsza kontrola zamiast pełnej: wybór zdań o największej szkodzie przy błędzie (opis błędu i bezpieczeństwo).
- Wejście dla recenzentów: zrzut zdań PL/EN i tłumaczeń wygenerowany skryptem z `lib/cues/text/*.json` i `lib/locales/*.json` (porównanie z `git show v1.0.0-b1033:…`).

## Wynik

| grupa | języki | zdań | K | W | Ś | N |
|---|---|---|---|---|---|---|
| g1 | en de fr it es es-419 pt pt-BR nl | 912 | 0 | 0 | 3 | 9 |
| g2 | cs sk hr sl sr bg ru uk | 816 | 0 | 0 | 6 | 10 |
| g3 | da nb sv fi et lv lt hu ro el | 1020 | 2 | 0 | 5 | 6 |
| g4 | tr id ms vi ja ko zh-Hant | 714 | 0 | 0 | 11 | 8 |
| badacz (A + 6 kluczy B) | 33 | — | 0 | 0 | 0 | 4 (+4 niepewne) |

Zdanie medyczne i asekuracja (A1–A6): we wszystkich 33 językach sens wierny, bez złagodzenia i wzmocnienia; „zalecana” nigdzie nie stała się „wymaganą”; odesłanie do lekarza i fizjoterapeuty (lub krajowego odpowiednika) wszędzie; forma zwracania się zgodna z rejestrem docs/16. `skull.depth` oddaje nowy warunek we wszystkich językach. `tests/slownik-terminow.test.ts` 175/175.

## KRYTYCZNE — naprawione 12.11.2026

| język | klucz | było | jest | powód |
|---|---|---|---|---|
| nb | rollout.mis.arch | Svai i korsryggen når du ruller ut. | Å svaie i korsryggen når du ruller ut. | „Svai” = tryb rozkazujący; opis błędu czytany jako polecenie wygięcia lędźwi |
| sv | core_floor.mis.momentum | Kör reps med fart i stället för kontroll. | Att köra reps med fart i stället för kontroll. | „Kör” = ta sama forma teraźniejsza i rozkazująca; czytane jako polecenie |

Test odtwarzający: `tests/w12-opis-bledu-nb-sv-2026-11-12.test.ts` — przed poprawką 3/3 czerwone (asercja brzmienia i strażnik sv „Kör/Gör/Hör/Rör/Bär/Lär” na początku opisu błędu), po poprawce 3/3 zielone. Rejestr twierdzeń nie dotyczy (obejmuje tylko `lib/i18n.en.ts`, `scripts/claims.mjs:22`).

## Niepewne z przeglądu badacza — rozstrzygnięcie

- zh-Hant i el `rollout.range` (kierunek wygięcia): recenzent-lokalizacji g4 i g3 nie zgłosił uwag do tych zdań — bez zmiany; pytanie do native speakera w docs/21.
- ru/uk `skull.depth` („плечи/плечі” — barki czy ramię): zgodne ze słownikiem terminów (плечо = ramię); recenzent g2 — NISKIE z pytaniem do native speakera; bez zmiany.

ŚREDNIE i NISKIE (25 + 37) oraz pytania do native speakerów: backlog 1.1.x w `docs/21-roadmapa-offline.md`, sekcja „W-12”. Pełne listy uwag z wagami: raporty recenzentów streszczone niżej.

## Uwagi ŚREDNIE (do backlogu, nie blokują)

- g1: es-419 `olympic.mis.away` „jalón” → „tirón”; pt `kbb.mis.armPull/cast/bang` rodzaj „a kettlebell” (słownik); pt-BR `calf.edge` „para fora da plataforma”.
- g2: cs `smr.mis.fast` „válcování”; sk `lp.mis.lock` „preprnutia” (nie istnieje); sl `wb.mis.shallow` „Preplitek”; sl `core_floor.mis.fastReturn` „ko” → „—”; sl A3/A4 „drog” → „palica” (słownik); uk `dyn.mis.jerk` „силові” → „через силу”.
- g3: sv A6 „i stället” (dwuznaczne „zamiast”) → „i ställningen”; sv A3 „ställ” → „ställning”; et `ohp.mis.flare`, `push.mis.flare` „vajuvad” → „lähevad”; el niespójność κυρτώνει/καμπυλώνει.
- g4: tr A3/A6 „raf” → „rack”; tr `olympic.mis.dipRushed`; id `mobility_floor.n.mis.roundBack`; ms `scrow.mis.lean`, `shrug.mis.elbows`; vi `core_floor.scissor.lift` „hơi cao”; vi `core_floor.mis.fastReturn` „để …” (brzmi jak polecenie po myślniku); ko A3/A4 „운동” → „종목”; ko końcówki opisów błędów pomieszane (-니다/-음/-기).
