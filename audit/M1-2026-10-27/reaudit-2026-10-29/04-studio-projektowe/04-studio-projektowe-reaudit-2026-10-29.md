# Reaudyt M1 pętla 2 — grupa 04-studio-projektowe (UX, dostępność, przepływy)

Commit: 0a566a1848bc44139f27ec2f3fcdc3e49922f901 · Baza: 4c116d0 · Tryb: reaudit (pętla 2), tylko odczyt; sondy w worktree /tmp/wt04 (HEAD) i /tmp/wt04b (4c116d0)

## Podsumowanie

| Zadanie | Wynik | Dowód |
|---|---|---|
| M1-audytor-generalny-039 | zweryfikowane w kodzie i testach; E2E scenariusza 21 nie sprawdzono (krok niżej) | app/paywall.tsx:87, app/paywall.tsx:96, dowody/jest-celowane.txt, dowody/jest-na-bazie-4c116d0.txt, dowody/sonda-skala2-grupy.txt, dowody/e2e-przebiegi.txt |
| M1-audytor-generalny-011 | zweryfikowane (AX5 na symulatorze: scenariusz 58 zielony, zrzuty bez ucięć); stan „dziś bez treningu” i mały ekran 375 pt nie sprawdzono | dowody/e2e-przebiegi.txt, dowody/e2e-58-ax5/, components/AppText.tsx:12, dowody/jest-celowane.txt |
| M1-audytor-generalny-043 | zweryfikowane | components/Dashboard.tsx:113, dowody/jest-celowane.txt, dowody/jest-na-bazie-4c116d0.txt |
| M1-audytor-generalny-044 | zweryfikowane | app/paywall.tsx:107, dowody/kontrast-044.txt, dowody/jest-na-bazie-4c116d0.txt |

Nowe znaleziska:

| ID | Poziom | Realność | Opis | Dowód |
|---|---|---|---|---|

Brak nowych znalezisk powyżej progu pewności 80% (dowody/sonda-skala2-grupy.txt).

## Przegląd różnicy

Zakres: `git diff 4c116d0..0a566a1` w app/**, components/**, eslint.config.js, .maestro/**, docs/32, docs/37 (46 plików).

- 039: karta stanu planu bez `accessible` (app/paywall.tsx:87 „paywall-owned” bez grupy), przycisk z testID (app/paywall.tsx:96 „paywall-manage”). Test `tests/voiceover-grupa-przycisk.test.tsx` szuka natywnego przodka `accessible` aż do korzenia — na 4c116d0 czerwony, na HEAD zielony (dowody/jest-na-bazie-4c116d0.txt, dowody/jest-celowane.txt). Strażnik S19 jest statyczny (jeden plik JSX), więc uzupełniłem go sondą w czasie działania: każdy natywny element z onPress/onLongPress na 33 trasach, w stanie pierwszego uruchomienia, na ekranie Trening bez treningu w toku i na ekranie zakupu z planem (dożywotni + roczny) — żaden nie leży w grupie `accessible` (dowody/sonda-skala2-grupy.txt, sekcja GRUPA pusta). Na iOS w tej gałęzi drzewa nie ma innego przodka-grupy.
- 043: „›” w „Pierwszych krokach” ma GLYPH_SCALE_MAX (components/Dashboard.tsx:113 „maxFontSizeMultiplier={GLYPH_SCALE_MAX}”); test renderuje stan pierwszego uruchomienia przy skali 2, na bazie czerwony.
- 044: karta posiadanego planu bez opacity (app/paywall.tsx:107 „posiadany plan bez przezroczystości”). Kontrast liczony z palety: muted/surface 7,11:1 (jasny), 6,72:1 (ciemny) (dowody/kontrast-044.txt). Test sprawdza brak opacity, kontrast wynika z palety.
- PR #83 (duży tekst), punkty zlecenia:
  - (a) AppText: components/AppText.tsx:12 „maxFontSizeMultiplier={props.maxFontSizeMultiplier ?? TEXT_SCALE_MAX}”. W app/ i components/ nie ma już importu Text z react-native poza AppText. Nie ma też Animated.Text, importu przestrzeni nazw ani require. Text z react-native-svg (Chart, Guard) nie skaluje się z Dynamic Type. TextInput tylko w components/ui.tsx z własnym limitem. Reguła lint (eslint.config.js:22 „importNames: ['Text']”) łapie import nazwany i `import * as` (dowody/lint-obejscie.txt). Obejścia `require('react-native').Text` (tylko ostrzeżenie innej reguły) i `Animated.Text` z nazwanego importu Animated zostają — teoretyczne, dziś nieużywane. Strażnik w czasie działania (matrix-a11y „każdy tekst … 1 ≤ max ≤ TEXT_SCALE_MAX”) pokrywa trasy.
  - (b) Limit znaków-ikon: jawny prop ma pierwszeństwo (`??`), więc 1,4 / 1,3 / 1,2 nie są nadpisywane. Sonda: żaden znak-ikona poza wyjątkiem T-04 (‹ › w obramowanym przycisku ≥ 44 pt) nie ma limitu > 1,4 (dowody/sonda-skala2-grupy.txt, sekcja GLYPH — tylko ten wyjątek). Ryzyko zagnieżdżenia: Text/Txt bez propu w rodzicu z niższym limitem dostałby teraz 2,0 zamiast dziedziczyć. Skan AST: brak takich miejsc (dowody/ast-zagniezdzone-teksty.txt „brak”). Sonda renderu znalazła tylko Muted w Txt 1,4 na /progress (components/PeriodSummary.tsx:70), a Muted ma domyślne 2,0 już na 4c116d0 — to nie regresja, tekst się zawija.
  - (c) Stałe wysokości: strażnik w tests/matrix-a11y.test.tsx:253 sprawdza 6 poziomów przodków na trasach bogatego stanu. Sonda rozszerzona (8 poziomów, plus pierwsze uruchomienie, ekran Trening bez treningu w toku, ekran zakupu z planem) — brak tekstu > 1 znaku z limitem > 1,4 w kontenerze o stałej wysokości (sekcja FIXED pusta). Pozostałe stałe wysokości (WorkoutBlocks doneBtn/bandBtn 44, WhatsNew 32, kółka kroków 24) zawierają tekst z limitem ≤ 1,3.
  - (d) Zmiana importów w 07519d0: w app/ i components/ hunk to wyłącznie linie importu (sprawdzone `git show 07519d0` bez linii innych niż import poza AppText.tsx). Props JSX nietknięte; AppText przekazuje wszystko przez `{...props}`, ref jako prop działa w React 19.2. Konteksty tłumaczeń: `npm run check:i18n` kod 0 (dowody/check-i18n.txt). a215ec9: Chart `height` → `minHeight` w pustym stanie (pusty wykres rośnie z tekstem), edycja historii zmienia tylko komentarz.
  - (e) Teza z briefu „E2E AX5 nie biegło” jest nieaktualna: przebieg 40766078690 (scenariusz 58, `ROZMIAR_TEKSTU: accessibility-extra-extra-extra-large` = AX5, iPhone 17, 402 pt) przeszedł na 623c1ef. To przodek HEAD; różnica w app/components dotyczy tylko ExerciseCues/ExerciseFigureV2, poza ekranem Trening. Przejrzałem zrzuty 580, 581, 582, 583, 586, 589 w pełnej rozdzielczości 1206×2622 (dowody/e2e-58-ax5/): elementy sterujące całe, „›” i ikony bez ucięć, ekran do użycia. AX1 nie biegł.
- Zasada projektowa: nowych okien ani ekranów brak. Przycisk „Anuluj” — tests/close-button-guard.test.tsx zielony. docs/32 dopisuje wzorzec grupy bez przycisków i S19 (spójnie z kodem). docs/37 US-12 i ZD-03 zgodne ze stanem.
- .maestro/56: przejście na `fake-new-user` (panel tylko w buildzie ze sztucznym sklepem) — obszar 02-monetyzacja, tu bez uwag do UX.

Ocena: przy dużym tekście żaden sprawdzony ekran nie staje się nie do użycia (render przy skali 2 na 33 trasach i 3 stanach dodatkowych oraz zrzuty AX5 ekranu Trening). Kandydatów P0/P1 brak, pilne.md niepotrzebne.

## Znaleziska

Brak nowych znalezisk z ID. Teoretyczne (jedna linijka, bez poziomu): reguła lint nie blokuje `Animated.Text` z nazwanego importu `Animated` ani `require('react-native').Text` (dowody/lint-obejscie.txt) — dziś brak użycia, a strażnik renderu matrix-a11y złapałby tekst bez limitu na trasach.

## Nie sprawdzono

- 039, E2E: scenariusz 21 (stuknięcie `paywall-manage` po zakupie) nie przeszedł na symulatorze. Przebieg 40729084387: build anulowany, e2e pominięte (dowody/e2e-przebiegi.txt). Krok: `e2e-ios.yml` z `tylko_scenariusze: 21` (opcjonalnie 56) na gałęzi z HEAD 0a566a1; po zielonym status naprawione-do-weryfikacji. VoiceOver na telefonie (fokus na „Zarządzaj subskrypcją”) — lista „tylko telefon”.
- 011 / duży tekst: AX1 na symulatorze nie biegł. Scenariusz 58 nie obejmuje stanu „dziś bez treningu” (dzień spoczynku w planie) ani małego ekranu 375 pt. Krok: `e2e-ios.yml` z `tylko_scenariusze: 58`, `rozmiar_tekstu: accessibility-extra-extra-extra-large` i wejściem `urzadzenie` z małym iPhone'em; stan „dziś bez treningu” — krok T-04 w docs/49 na telefonie.
- Natywne zachowanie `maxFontSizeMultiplier` w zagnieżdżonym tekście iOS (Fabric) — sprawdzone tylko drzewem propsów w Jest, nie na urządzeniu.

## Kontrola dowodów i sekretów

Dowody: dowody/git-status-start.txt (pusty), dowody/jest-celowane.txt (7 plików, 113 testów, EXIT 0), dowody/jest-na-bazie-4c116d0.txt (5 z 5 czerwonych na bazie), dowody/sonda-skala2-grupy.txt i .test.tsx.txt, dowody/sonda-zagniezdzenie.txt i .test.tsx.txt, dowody/ast-zagniezdzone-teksty.txt i .js.txt, dowody/lint-obejscie.txt, dowody/check-i18n.txt, dowody/kontrast-044.txt, dowody/e2e-przebiegi.txt (identyfikatory symulatora usunięte), dowody/e2e-58-ax5/*.png, dowody/git-status-koniec.txt (pusty); raport bez e-maili, UDID, tokenów, kluczy i nazw innych aplikacji.
