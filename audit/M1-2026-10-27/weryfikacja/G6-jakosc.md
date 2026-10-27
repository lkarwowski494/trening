# Weryfikacja przeciwna G6 — 2026-10-27

Commit: 025a50b9

Zakres: 07-jakosc-001, 07-jakosc-002 + 10-wydanie-003 (jeden mechanizm), 07-jakosc-003, 07-jakosc-004. Sondy w kopii roboczej (worktree 025a50b9 w scratchpadzie, usunięta); pliki śledzone nietknięte.

| ID | Wynik | Dowód | Realność | Poziom (zgłoszony → właściwy) |
|---|---|---|---|---|
| 07-jakosc-001 | potwierdzone | `check:release` nie występuje w żadnym workflowie, haku, agencie ani liście docs/39 i docs/48 (dowody/G6-check-release.txt); docs/18 sam zapisuje to jako niezrobione | brzegowy (dziś wyjątek pusty, kod 0) | P1 → P2 |
| 07-jakosc-002, 10-wydanie-003 | potwierdzone (w części dotyczącej „brak mechanizmu” osłabione) | 7 wierszy otwartych lub częściowych, w tym R-006 spełnione wg docs/48; żaden test ani workflow nie czyta stanu rejestru (dowody/G6-rejestr.txt). Ręczna bramka jednak jest: docs/48 pkt 7 i kroki Z-02/Z-08 | realny | 07: P1 → P2; 10: P2 → P2 |
| 07-jakosc-003 | potwierdzone (z korektą: lista innych planów jest zamierzona) | sonda: subskrybent `monthly` widzi `paywall-headline`, `plan-monthly` i „Subscribe”; karta bez nazwy planu; brak uwagi przed zakupem dożywotniego (dowody/G6-sonda.txt) | realny | P1 → P2 |
| 07-jakosc-004 | potwierdzone | sonda: na ekranie Trening przy skali 2,0 dwa znaki „›” bez limitu powiększenia; `tests/matrix-a11y.test.tsx` 31/31 zielony (dowody/G6-sonda.txt); poprawka 644c4989 nie jest przodkiem 025a50b9 | realny (obserwacja z telefonu właściciela, nie do sprawdzenia na Linuksie) | P1 → P2 |

## 07-jakosc-001 — check:release nie jest uruchamiany w krokach wydania

**Potwierdzone.**

- Skrypt deklaruje podpięcie: `scripts/ci/blokada-wydania.mjs:5` „uruchamia ją krok wydania (testflight.yml, zadanie przed budową) i lista kontrolna wydawcy”.
- Podpięcia nie ma. `grep -rnE "check:release|blokada-wydania"` w `.github`, `.claude`, `scripts/hooks`, docs/39 i docs/48 nie zwraca nic (kod 1). Szukanie w całym repo (bez node_modules i audit) znajduje tylko skrypt, `package.json`, testy i dokumenty (dowody/G6-check-release.txt). Sprawdziłem wszystkie 18 workflowów i `.claude/agents/wydawca.md`.
- Build TestFlight uruchamia samo verify: `.github/workflows/testflight.yml:97` „run: npm run verify”. Test pilnuje, że kontroli w verify NIE ma: `tests/blokada-wydania.test.ts:50` „expect(s.verify).not.toContain('check:release')”.
- Samo repo potwierdza, że to luka zaplanowana i nierozliczona: `docs/18-przekazanie.md:541` „do podpięcia w `testflight.yml` przed budową — zmianę workflowu wypycha koordynator”.
- Siatki bezpieczeństwa nie zastępują też oba strażniki, bo przepuszczają ten sam wyjątek: `scripts/check-bundle.mjs:26` „które zawierają nazwy — jedyne dozwolone”.
- Stan dziś: `npm run -s check:release` daje kod 0, „wyjątek anonimizacji pusty”, więc obecny build nie jest dotknięty.

**Realność:** brzegowy. Kroki: zmiana tekstu dziedzinowego, która tworzy klucz „zmieniony” w zestawie przekładu, a potem build TestFlight przed przekładem API. Po przekładzie z 26.10 słowniki są wolne od nazw, więc nazwy źródeł wróciłyby tylko przy ręcznie wpisanym tłumaczeniu z nazwą. Bardziej prawdopodobny skutek to wydanie ze starym tłumaczeniem tekstu dziedzinowego w 33 językach, czyli nieaktualne brzmienie lub liczba. Brakująca bramka łapie także to.

**Poziom:** P1 → P2. To luka procesu, a dziś nie ma żadnego skutku dla użytkownika. W chwili wydania z niepustym wyjątkiem (np. stara liczba w 33 językach) skutek przekracza próg wydania, ale to stan przyszły i warunkowy.

## 07-jakosc-002 i 10-wydanie-003 — rejestr ryzyk nierozliczony, brak automatycznego wiązania z bramką

**Potwierdzone. Teza „brak mechanizmu” jest osłabiona: mechanizm istnieje jako krok listy kontrolnej, nie jako automat.**

- Otwarte lub częściowe są: R-005, R-004, R-006, R-008, R-010, R-013 (częściowo) i R-014 (`docs/40-lekcje.md:16`, `docs/40-lekcje.md:17`, `docs/40-lekcje.md:20`, `docs/40-lekcje.md:25`, `docs/40-lekcje.md:26`; pełna lista w dowody/G6-rejestr.txt).
- R-006: `docs/40-lekcje.md:18` „otwarte (partia 1 napraw M2, 20.10.2026)”.
- Ten sam warunek docs/48 uznaje za spełniony: `docs/48-zgloszenie-1-0.md:304` „**spełnione**: `watch-sim.yml` 39380918348”.
- R-008 część (a) też jest spełniona w docs/48:305, a rejestr tego nie zawiera. Rejestr jest więc nieaktualny.
- R-010 jest otwarte zasadnie (przegląd po przekładzie, Z-02): `docs/40-lekcje.md:22` „blokuje wydanie w App Store, nie blokuje TestFlight”.
- Automatu nie ma:
  - `tests/audit-m1-049-risk-register.test.ts` sprawdza tylko, że R-M5-3, R-012 i R-009 są zamknięte;
  - `tests/blokada-wydania.test.ts` sprawdza tylko R-015;
  - żaden workflow nie czyta `docs/40`.
- Ręczna bramka jednak jest: `docs/48-zgloszenie-1-0.md:297` „**Otwarte ryzyko blokuje wydanie**”. Tabela pkt 7 przypisuje każde ryzyko do kroku (Z-02, Z-08, Z-06). CLAUDE.md wprost uznaje krok listy kontrolnej za mechanizm.
- Potwierdzeń z telefonu z 27.10 (R-004, R-014) nie ma w repo na 025a50b9. `grep 1031 docs/*.md` nic nie zwraca, więc tę część dowodu przyjmuję z wejścia, bez sprawdzenia.

**Realność:** realny. Rozjazd rejestru z dowodami istnieje dziś. Wydanie z otwartym ryzykiem wymagałoby pominięcia kroków Z-02 i Z-08 w docs/48.

**Poziom:** 07-jakosc-002 P1 → P2, 10-wydanie-003 P2 → P2. Skutek to proces: fałszywa blokada albo przeoczenie przy ręcznym przeglądzie. To nie jest skutek z progu wydania. Jedynym ryzykiem z progu jest R-010 i ono jest poprawnie oznaczone jako otwarte, z przypisanym krokiem Z-02.

## 07-jakosc-003 — ekran zakupu przy aktywnej subskrypcji

**Potwierdzone, z korektą zakresu.**

- Sonda (render `/paywall?reason=settings` z uprawnieniem `monthly`, EN) zwraca:
  - `headline: OBECNY`, `planMonthly: true`, „Subscribe” widoczne także po wybraniu planu miesięcznego;
  - karta pokazuje tylko „You have the full version”, „Access until …”, „Manage subscription” (dowody/G6-sonda.txt).
- Kod potwierdza:
  - nagłówek zależy tylko od `reason`: `app/paywall.tsx:66` „testID="paywall-headline"”;
  - tytuł karty nie zawiera nazwy planu: `app/paywall.tsx:69` „t('Masz pełną wersję')”;
  - plany są ukryte tylko przy dożywotnim: `app/paywall.tsx:76` „{!lifetime ? <>”. Wejście podaje tu linię :79, właściwa to :76.
- Korekta: lista **innych** planów u subskrybenta jest zamierzona. `docs/27-subskrypcja-spec.md:177` „przez zakup drugiego planu na naszym ekranie”, czyli zmiana planu. Monthly i yearly są w jednej grupie (`store/Trening.storekit:68` „"subscriptionGroupID" : "21D0A4F2"”), więc ponowny zakup posiadanego planu nie pobierze drugi raz opłaty.
- Usterką pozostają:
  - nagłówek o darmowych dniach dla płacącego;
  - „Subskrybuj” dla posiadanego planu bez oznaczenia „aktualny”;
  - karta bez nazwy planu, wbrew specyfikacji: `docs/27-subskrypcja-spec.md:314` „aktywna subskrypcja (plan, data odnowienia”.
- Kryterium w BRD: `docs/brd/wymagania.md:686` (BR-ZAK-003) ma trzy scenariusze (start ponad limit, ekran z Ustawień, brak samoczynnych okien), ale żadnego dla aktywnej subskrypcji. Testy sprawdzają kartę po zakupie (`tests/subscription-ui.test.tsx:83`), a brak nagłówka tylko w wariancie limitu (`tests/subscription-ui.test.tsx:122`).
- Obok (poza zgłoszeniem): `docs/27-subskrypcja-spec.md:183` „Na ekranie zakupu przy aktywnej subskrypcji ta sama uwaga przed zakupem.” Sonda pokazuje `lifetimeWarningBeforePurchase: 0`: subskrybent wybiera dożywotni i nie widzi ostrzeżenia o podwójnej płatności, a uwaga pojawia się dopiero po zakupie. To pieniądze użytkownika, ale po zakupie jest jawna uwaga z przyciskiem „Zarządzaj”. Do oceny osobno, kandydat na P2/P1.

**Realność:** realny (Ustawienia → Subskrypcja u każdego subskrybenta).

**Poziom:** P1 → P2. To myląca treść bez utraty pieniędzy i danych, a StoreKit w jednej grupie blokuje podwójną subskrypcję. Nie jest to skutek z progu wydania.

## 07-jakosc-004 — T-04: ucięte ikony przy największym tekście, brak testu odtwarzającego

**Potwierdzone.**

- Sonda: ekran Trening (stan z danymi, bez aktywnego treningu, `getFontScale` = 2) ma dwa elementy Text „›” bez `maxFontSizeMultiplier`, jeden z nich ukryty przed VoiceOver (dowody/G6-sonda.txt).
- Źródła w kodzie:
  - szary znak wiersza `Item`: `components/ui.tsx:66` „style={{ color: t.muted, ...font('body') }}>{glyph}</Text>”;
  - strzałka przycisku startu: `components/StartPanel.tsx:64` „importantForAccessibility="no" style={{ color: th.accentInk, ...font('sectionTitle') }}>›</Text>”.
- Zastępnik ZD-03 tego nie łapie:
  - `tests/matrix-a11y.test.tsx` przechodzi 31/31 (kod 0);
  - `tests/matrix-a11y.test.tsx:31` „const visibleNodes = (): Node[] =>” pomija elementy ukryte przed VoiceOver;
  - reguła skali obejmuje tylko zdania: `tests/matrix-a11y.test.tsx:217` „txt.length > 25”.
- Oczekiwanie listy: `docs/39-lista-kontrolna-wydania.md:71` „trening, plan i ustawienia czytelne bez ucięć”.
- Poprawka ze strażnikiem (644c4989, `GLYPH_SCALE_MAX`) istnieje tylko na `origin/naprawy-1-0`. `git merge-base --is-ancestor 644c4989 025a50b9` daje kod 1, a `GLYPH_SCALE_MAX` nie występuje w kodzie na 025a50b9.
- Samego ucięcia na urządzeniu nie da się sprawdzić na Linuksie. Opieram się na obserwacji właściciela z wejścia.

**Realność:** realny (Dostępność → Większe rozmiary tekstu, ekran Trening).

**Poziom:** P1 → P2. Ucięte są znaki ozdobne („›”, ukryte przed VoiceOver albo powtarzające rolę przycisku). Tekst, etykiety i działanie przycisków zostają, więc to nie jest bariera dostępności z progu wydania, tylko wada wyglądu. Gdyby któryś ucięty znak był jedynym nośnikiem znaczenia, właściwe byłoby P1. Sonda na ekranie Trening tego nie wykazała, innych ekranów nie badałem.
