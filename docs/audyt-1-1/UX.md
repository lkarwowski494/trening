# Raport audytu UX (W-10, audyt 1.1) — ekrany, przepływy, dostępność

Commit badany: 79117f33 (na `integracja-1-1`). Soczewka: nowy użytkownik bez instrukcji, użytkownik VoiceOver. Praca w worktree `wt-UX` (usunięty), sondy w `testy-UX/`.

## Zakres i pokrycie

Przeczytano:
- Wszystkie zmiany w `app/` od `v1.0.0-b1033` (15 plików, 55+/46−) i w `components/` (20 plików): nowe `FirstBoard.tsx`, `FullValue.tsx`, `MuscleRoles.tsx`; zmiany w `Dashboard.tsx` (FirstSteps), `StartPanel.tsx`, `TodayPlan.tsx`, `WorkoutBlocks.tsx`, `ExerciseFigureV2.tsx`, `Icon.tsx`, `ui.tsx`.
- `app/(tabs)/index.tsx`, `app/guide.tsx`, `app/_layout.tsx` (przywracanie szkiców), `app/adapt.tsx` (wejścia i stan pusty), obsługa „nie ma takiego …” na 9 ekranach z parametrem.
- `docs/32-wzorce-interakcji.md`: wzorce 23, 32, 33 i 34; decyzje ZB-044 w docs/18 (wiersze 296, 300, 310, 311, 324).
- Zakres strażników: `tests/interaction-guards.test.ts:15` (skan `app`, `components`, `lib`, bez plików generowanych i locales), S19 `tests/interaction-guards.test.ts:268-279` (analiza AST JSX w obrębie jednego pliku), `tests/close-button-guard.test.tsx:32,46,55,60` (`_layout` w app, `presentation`, `<Modal`, `close-modal` w app+components), S21 `tests/zb044-wzorzec-nazwy.test.ts:17` (ZAKRES app/components/lib; sprawdza exLocal i wyszukiwanie, **nie sprawdza języka głosu**), `tests/matrix-a11y.test.tsx` (trasy z `tests/a11y-routes.ts`; dashboard tylko w stanie „z planem i treningiem”).

Uruchomione (pojedynczo, `--runInBand --ci`):
- `tests/interaction-guards.test.ts` + `tests/close-button-guard.test.tsx` → kod 0, 76/76.
- `tests/matrix-a11y.test.tsx` → kod 0, 34/34 (log: `testy-UX/matrix-a11y.log`).
- `tests/przeplywy.test.ts` → kod 0, 22/22.
- Sonda: przegląd dostępności dashboardu **nowej osoby** (kopia matrix-a11y z `fresh()`) → pl/jasny i en/ciemny: 10 elementów naciskanych, braki nazwy/roli/duplikaty/kontrast/ucinanie — puste.
- Sonda: język głosu nazw ćwiczeń w UI polskim → 130 elementów bez `accessibilityLanguage=en` (UX-01).
- Skan statyczny `Pressable/Touchable*` bez roli w app/ i components/ → 0 trafień.
- Cele nawigacji: wszystkie 31 tras z `router.push/replace/navigate` i `href` (w tym `lib/guide.ts` route:) istnieją w `app/`.

Nie czytano w całości: `components/ActiveWorkout.tsx`, `NowBoard.tsx`, `BoardControls.tsx` (bez zmian od 1.0 — poza `WorkoutBlocks`), ekrany Więcej bez zmian od 1.0. Bez zrzutów Expo web (nie uruchamiano).

## Znaleziska

### UX-01 — VoiceOver po polsku czyta angielskie nazwy ćwiczeń polskim głosem (trening na żywo, szablony, Postępy, szablon)
- **Waga:** ŚREDNIE (degradacja odczytu, nie blokuje funkcji; patrz „Do sprawdzenia” — gdyby na telefonie nazwy były niezrozumiałe, to bariera → WYSOKIE). **Realność:** realny (każdy użytkownik VoiceOver w języku polskim, domyślny rynek). Nowe w 1.1: ZB-044 (docs/18:296) przełączył nazwy biblioteki na angielskie także po polsku; w 1.0 po polsku były polskie nazwy.
- **Kroki:** iOS po polsku, VoiceOver włączony → Trening → start z szablonu → przesuwanie po wierszach serii / „Opcje ćwiczenia” / „Technika”; albo Szablony → wiersz szablonu; Postępy → lista ćwiczeń.
- **Dowód:** sonda `testy-UX/sonda-ux-jezyk-nazw.test.tsx` (stan `richState('pl')`, wszystkie trasy `routesFor`): `SONDA hits 274 bez en: 130`, np. `/ | View | lang=pl | „Seria 1 zrobiona — Dumbbell Bench Press”`, `„Opcje ćwiczenia: Chin-Up”`, `„Technika: Dumbbell Curl”`, `/templates | Text | lang=pl | „Dumbbell Bench Press, Dumbbell Bent-Over Row…”`, `/progress | Text | lang=pl | „Dumbbell Bench Press”`, `/template/<id> | View | lang=pl | „Technika: Dumbbell Bench Press”`. Wzorzec docs/32 nr 34: „Wszędzie poza kartą: nazwa angielska z katalogu (`exName`, głos `exNameLang`)”.
- **Mechanizm:** `exName(` jest w 22 plikach app/components, `exNameLang` tylko w 11. Pliki z `exName` bez `exNameLang`: `app/adapt.tsx`, `app/(tabs)/progress.tsx`, `app/templates.tsx`, `app/reorder.tsx`, `app/history/edit/[id].tsx`, `app/generator.tsx`, `components/RecordsCard.tsx`, `BoardFace.tsx`, `PeriodSummary.tsx`, `GuardSection.tsx`, `ExerciseFigureV2.tsx`; plus etykiety złożone w `WorkoutBlocks`/`ActiveWorkout` („Seria N zrobiona — {nazwa}”), których jeden znacznik języka nie naprawi. Strażnik S21 (`tests/zb044-wzorzec-nazwy.test.ts`) i `tests/audit-m1-038-exname-lang.test.tsx` (tylko lista „Ćwiczenia”) tego nie łapią.
- **Naprawa:** (a) elementy, których etykieta to sama nazwa (lista Postępów, wiersz Szablonów, tytuły) → `accessibilityLanguage={exNameLang(e)}`; (b) etykiety złożone → nazwa jako osobny element VoiceOver z `en` albo decyzja właściciela, że w etykietach złożonych zostaje głos interfejsu (wpis w docs/32 wzorzec 34).
- **Test akceptacyjny:** sonda jako stały test renderu: na wszystkich trasach `routesFor` w pl każdy element dostępności, którego etykieta = `exName` ćwiczenia z biblioteki, ma `accessibilityLanguage` `en`; dla złożonych — lista wyjątków z powodem.

### UX-02 — nowe znaczki ✓/✕ na rysunku ćwiczenia są przyciskami wewnątrz grupy-obrazu: niewidoczne dla VoiceOver (i XCTest)
- **Waga:** ŚREDNIE (ta sama treść wskazówek jest w etykiecie obrazu „Na rysunku: …” i w sekcji techniki karty — brak bariery, ale łamie wzorzec 23 / S19). **Realność:** realny (każda karta z rysunkiem v2; `tests/figures-v2-styk.test.tsx:95`: >60 ćwiczeń ma znaczki). Nowe w 1.1 (`git show v1.0.0-b1033:components/ExerciseFigureV2.tsx | grep -c onBadge` → 0).
- **Kroki:** Ćwiczenia → ćwiczenie z rysunkiem → VoiceOver: obraz czytany jako jeden element; znaczków „Wskazówka: …”/„Częsty błąd: …” nie da się wybrać.
- **Dowód:** `components/ExerciseFigureV2.tsx:103` `<View testID="exercise-figure-v2-image" accessible accessibilityRole="image" …>` zawiera `ViewSvg`, który w `components/ExerciseFigureV2.tsx:50-53` renderuje `<Pressable … onPress={() => onBadge?.(b)} accessibilityRole="button" …>`. docs/32 wzorzec 23: „Grupa `accessible` … nie zawiera przycisków — iOS chowa potomków grupy przed VoiceOver i XCTest”.
- **Mechanizm:** S19 (`tests/interaction-guards.test.ts:268-279`) analizuje JSX w obrębie jednego pliku i jednego drzewa — przycisk w osobnym komponencie (`ViewSvg`) w grupie nadrzędnej nie jest wykrywany. Inne trafienia tego typu nie sprawdzone renderem (patrz „Do sprawdzenia”).
- **Naprawa:** znaczki `accessible={false}` / `importantForAccessibility="no"` jawnie (dekoracja dla VoiceOver, treść w etykiecie obrazu) albo przenieść je poza grupę; rozszerzyć S19 o kontrolę renderu (drzewo włókien: węzeł `accessible` bez roli kontrolki z potomkiem `onPress`) na trasach `routesFor`.
- **Test akceptacyjny:** render karty ćwiczenia z rysunkiem v2 — żaden potomek `exercise-figure-v2-image` z `onPress` nie jest widoczny jako przycisk; S19-render czerwony na obecnym kodzie.

### UX-03 — NISKIE: nieużywany import `firstSteps` w `app/(tabs)/index.tsx:20` (eslint: warning `no-unused-vars`). Bez wpływu na użytkownika.

## Do sprawdzenia
- **UX-01 na telefonie:** jak polski głos VoiceOver wymawia np. „Dumbbell Skull Crusher”, „Chin-Up” — jeśli niezrozumiale, podnieść UX-01 do WYSOKIE (bariera dostępności). Krok: iPhone, iOS po polsku, VoiceOver, ekran treningu z szablonu demonstracyjnego.
- **Kontrast tablicy „Pierwszy trening”:** sonda nowej osoby nie sprawdziła tekstów tablicy, bo są ukryte przed VoiceOver (`components/FirstBoard.tsx:41`, `accessibilityElementsHidden`), a przegląd kontrastu bierze tylko węzły widoczne dla VoiceOver. Kolory (`board`/`boardText`/`boardMuted`) są te same co na tablicy „Dziś” — jeśli tamte teksty są w przeglądzie DASH, ryzyko niskie; nie potwierdzono.
- **Inne przyciski w grupach przez granicę komponentu** (mechanizm UX-02): wymaga sondy renderu na wszystkich trasach — nie wykonano (limit kontekstu).
- **E2E na badanym commicie:** ostatni zielony pakiet podstawowy „wszystkie” na `integracja-1-1`: przebieg 42285310215 (06.11.2026, sha 1f339f4c); między 1f339f4c a 79117f33 zmieniło się 216 plików w app/components/lib/.maestro (ZB-044 nazwy, rysunki v2, wskazówki), na gałęziach funkcji biegły tylko „wybrane”. Nocne testy biegną na `main` (`nightly.yml:53`, domyślnie `["main"]`), ostatni nocny na `integracja-1-1` — 08.11.2026 (sukces). Bramka App Store wymaga pełnego katalogu na standardowym iPhonie — do wykonania na commicie wydania.

## Co działa dobrze
- Strażniki interakcji i „Anuluj” zielone (76/76); macierz dostępności 34/34 na 33 trasach w pl/en, jasny/ciemny; Dynamic Type 2,0 bez błędów.
- Ekran nowej osoby: tablica jako jeden obraz z opisem („Pierwszy trening, dziś, {data}”), kafelki z rolą `button` i pełną etykietą, „Ogranicz ruch” respektowane (`FirstBoard.tsx:19-26`), brak pustego arkusza „Inny trening” (`StartPanel`, `hasOthers`).
- Brak martwych tras: wszystkie 31 celów nawigacji istnieją; ekrany z parametrem mają stan „nie ma takiego …” (`Missing`).
- `FullValue` nie dubluje odczytu VoiceOver (kontener bez `accessible`), zgodnie z wzorcem 32.
- Katalog przepływów: każdy ekran ma przepływ; nowe elementy 1.1 w Maestro: `first-board` (31), `muscle-roles` (57), `adapt-place-line` (22), `first-steps-import` (59). Bez scenariusza: `exercise-local-name` (mapa nazw lokalnych pusta — linia się nie pokazuje) i `voice-hint-*` (zależy od głosów urządzenia) — uzasadnione.

## Nie sprawdzono
- Rozmiar celu dotyku i Dynamic Type na urządzeniu, prawdziwy odczyt VoiceOver, Podgląd dużej zawartości (wzorzec 32, [OTWARTE] w docs/32) — symulator/telefon.
- Zrzuty Expo web/Playwright — nie uruchamiano.
- Trening na żywo w szczegółach (`ActiveWorkout`, `NowBoard`, stany przerwy/pauzy) — bez zmian od 1.0, tylko przegląd macierzowy.
- Zegarek, Live Activity, powiadomienia — poza Linuksem.
