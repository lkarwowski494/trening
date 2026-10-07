# 16. Języki i styl marki

## Języki (decyzja właściciela 05.10.2026)

*Decyzja:* aplikacja w językach krajów Europy Środkowo-Wschodniej, „każdy kraj swój język”, plus hiszpański i portugalski
(„Pełna lista plus portugalski i hiszpański”). Kontrola jakości: „Tłumaczenie + niezależna recenzja AI”.

Języki (16): pl, en, cs, sk, hu, ro, bg, hr, sl, sr, lt, lv, et, uk, es, pt.

| Kod | Wariant / zapis | Rejestr (wg iOS danego języka) |
|---|---|---|
| sr | serbski, **cyrylica**, ekawica | polecenia „Додирните”, przyciski „Сачувај” |
| pt | **pt-PT** (Portugalia) | formalnie, bez „você”; „ecrã”, „telemóvel” |
| es | **es-ES** (Hiszpania) | „tú”, „Ajustes”, „OK” jako Gotowe |
| hr, sl, cs, sk, bg, lt, lv, ro, hu, uk | standard | formalny jak w iOS |
| et | standard | „sina” (jak Apple w iOS po estońsku) |

*Jak to działa (jedno źródło prawdy):*
- Klucz = polski tekst. Lista tekstów do przetłumaczenia generowana z kodu: `lib/locales/_source.json`
  (`UPDATE_I18N=1 npx jest tests/i18n-locales.test.ts`).
- Słowniki: `lib/locales/<kod>.json`. Brak klucza → angielski. Liczba mnoga wg CLDR: `lib/plural.ts`.
- Opisy uprawnień iOS (HealthKit) w danym języku: `locales/<kod>.json` + `app.json` (`CFBundleLocalizations`, `locales`).
- Test `tests/i18n-locales.test.ts` pilnuje: komplet kluczy, te same `{parametry}`, liczba form liczby mnogiej,
  brak polskich liter (przeciek nieprzetłumaczonego tekstu), zgodność `app.json` z listą języków.
- Nazwy ćwiczeń z biblioteki: po polsku tylko w języku polskim, w pozostałych po angielsku (tłumaczenie 854 nazw — otwarte).

*Proces (05.10.2026):* 14 tłumaczeń (osobny agent AI na język, wytyczne: rejestr iOS, terminy siłowni, długość ≤ ~130% EN),
potem 14 niezależnych recenzji (inny agent, bez dostępu do notatek tłumacza). Recenzje zmieniły 5–36 wpisów na język
(hu 36, sk 20, bg 20, sr 17, pt 16, sl 15, hr 14, uk 14, lv 14, lt 13, ro 12, cs 8, et 6, es 5).

*Otwarte (do rozstrzygnięcia przez native speakera; nie zgadujemy):*
- „do upadku/failure”: et „kuni väsimuseni”, lt „iki nesėkmės”, hu „bukásig”, ro „până la epuizare”.
- „core”: et „kere”, lt „liemuo”, bg „кор”.
- Obciążenie dodatkowe: pt „lastro”, ro „lest”.
- cs: „široký sval zádový” vs „latissimus”; „Smith stroj” vs „Multipress”.
- sr: nazwa aplikacji Pliki („Датотеке”), „Торањ (згибови + дипс)”.
- sl: pytania w 1. osobie („Izbrišem vajo?”) vs „Želite …?”.
- lv: forma „zero” liczby mnogiej (teraz mianownik l.mn., np. „vingrinājumi”; alternatywa dopełniacz „vingrinājumu”).
- Nazwy ćwiczeń z biblioteki w językach innych niż pl/en.
- Opis w App Store w każdym języku — przy publikacji (docs/15).

## Nazwa aplikacji (decyzja właściciela 05.10.2026)

*Pod ikoną* (`APP_NAME` w `lib/i18n.ts`, jedno źródło prawdy; `locales/<kod>.json` musi się zgadzać — test `tests/i18n-locales.test.ts`):
słowo lokalne tam, gdzie jest podobne do „Trening” (to samo co tytuł zakładki), w pozostałych „Training”.

| Nazwa | Języki |
|---|---|
| Trening | pl, hr, sl |
| Тренинг | sr |
| Trénink / Tréning | cs / sk |
| Treening / Treniņš / Treniruotė | et / lv / lt |
| Treino | pt |
| Training | en, es, ro, hu, bg, uk |

Przebieg decyzji: odrzucone „Forma” (w App Store jest już „Forma: Workout Tracker Gym Log”), „Simple Workout Tracker”
(22 znaki — ucięte pod ikoną; jest już „Simple Workout Tracker: Gym”), „Workout” (nazwa aplikacji Apple na Apple Watch),
„Seria”, „Hantel” (właściciel wybrał „Trening”). lt i pt najpierw „Training”, potem właściciel: „Treino i Treniruotė też jest ok”.
sr: cyrylica jak cały interfejs (nie łacinka „Trening”).

*W App Store* (`store/app-store-names.json`, max 30 znaków, wytyczna Apple 2.3.7): „<nazwa>: <opis>”, opis = dziennik siłowni.
App Store Connect nie ma lokalizacji bg, sr, lt, lv, et (lista: developer.apple.com/help/app-store-connect/reference/app-information/app-store-localizations);
w tych krajach sklep pokazuje English (U.K.) — „Training: Gym Log & Rest Timer”, Serbia także chorwacką. Pod ikoną zostaje nazwa lokalna
(wariant A, właściciel 05.10.2026). Odrzucony wariant B: „Training” pod ikoną w tych 5 językach. Ryzyko: wytyczna 2.3.8 (nazwa w sklepie
i pod ikoną „similar”) — wspólny rdzeń; jeśli recenzja zakwestionuje, zmiana jednej linii w `APP_NAME`.

*Otwarte:* opisy w App Store (część po dwukropku) czytane przez native speakera; unikalność nazw (rezerwacja w App Store Connect);
znaki towarowe (nie sprawdzone); ~~nazwa widżetu „Trening — przerwa” tylko po polsku~~ — 06.10.2026: widżet w 16 językach (`<kod>.lproj/InfoPlist.strings` i `RestLabels.swift` generowane z APP_NAME i słowników, `tests/widget-i18n.test.ts`); czy folder w Plikach
przyjmuje nazwę zlokalizowaną (sprawdzić na buildzie — teksty ścieżki zakładają, że tak).

## Styl marki

*Decyzja właściciela 07.10.2026:* „Podoba mi się grafika B” → **kierunek B · Tuleja** (docs/21 pkt 6, makiety: https://claude.ai/artifact/VcG5ESWeNsPEVYiFA1kEru):
kolory talerzy zawodniczych (IWF) zawsze z liczbą na talerzu, Tektur + IBM Plex Mono, ikona — koniec sztangi z talerzami z boku.
Zastępuje Kredę (05.10). Zakres (07.10.2026): **wszystko naraz** (B) — ikona z wariantami iOS, kolory, kroje, talerze „co nałożyć na stronę”, widok
skupiony na bieżącej serii (przełącznik Ustawienia → Widok treningu, domyślnie skupiony); krój **mieszany** (A): IBM Plex Sans tekst, Tektur nagłówki i duże
liczby, IBM Plex Mono dane; domyślny wygląd **jasny** (A). Wdrożenie: `lib/theme.ts`, `lib/plates.ts`, `components/PlateBar.tsx`, `assets/brand/icon*.svg`
(`node scripts/brand/icon.mjs`), testy `tests/brand-tuleja.test.tsx`, `tests/tuleja.test.tsx`, `tests/matrix-tuleja.test.tsx`; docs/09.
Opis Kredy niżej zostaje jako historia decyzji.

*Decyzja właściciela 05.10.2026:* „Podoba mi się kreda.” → **kierunek A · Kreda**. Tryb ciemny: „Kreda + ciemna wersja” (05.10.2026) — w trybie ciemnym grafitowe tło, kredowy tekst, ten sam pomarańcz.

Właściciel: „Grafika wydaje się defaultowa … Co możemy zrobić, żeby mieć swój własny brand style?” → wybrał „3 kierunki do wyboru”.

| Kierunek | Kolory | Pismo | Charakter |
|---|---|---|---|
| A · Kreda | #F2F0EB tło, #1E1F22 tekst, #E8590C akcent | Archivo + IBM Plex Mono | jasny, spokojny, „zeszyt trenera” |
| B · Stal | #0F1216 tło, #1A1F26 karty, #C6F432 postęp, #5B8DEF informacja | Space Grotesk + JetBrains Mono | ciemny, techniczny |
| C · Tablica wyników | #FFFFFF, #0B0C0E, #1739D6 akcent, #FFB800 rekord | Barlow Condensed + Barlow | sportowy, wąskie duże cyfry |

Każdy kierunek: ikona aplikacji, ikony zakładek SVG zamiast emoji, ten sam ekran treningu. Fonty z Google Fonts (licencja OFL — 0 zł).
*Wdrożenie (05.10.2026):*
- Kolory i kroje w jednym module `lib/theme.ts` (`BRAND`, `light`, `dark`, `F`, `FONT_FILES`).
- Pomarańcz marki #E8590C na jasnym tle ma kontrast 3,3:1 — za mało dla tekstu (WCAG 4,5). W jasnym motywie akcent #C2410C, w ciemnym #FF8A3D;
  czysty #E8590C zostaje w ikonie aplikacji i kolorze powiadomień. Test kontrastu: `tests/ux.test.tsx` C5.
- Kroje ładowane przy starcie (`app/_layout.tsx`); błąd lub brak odpowiedzi w 3 s → krój systemowy, start nie czeka dłużej.
- Timery i duże liczby — IBM Plex Mono; tekst, nagłówki i wąskie pola liczbowe — Archivo z cyframi tabelarycznymi
  (audyt cd60eec: mono, 0,6 em na znak, ucinało „102,5” w polu ciężaru 56 pt).
- Ikony zakładek: `components/TabIcon.tsx` (SVG). Ikona aplikacji: źródło `assets/brand/icon.svg` → `node scripts/brand/icon.mjs` → `assets/icon.png`.
- Ekran startowy i Live Activity (przerwa) w kolorach Kredy.
- Testy: `tests/brand-kreda.test.tsx`.
- **Wybór wyglądu (decyzja właściciela 05.10.2026, po instalacji — zrzut „Nie ma wyglądu kredy”, telefon w trybie ciemnym):**
  „Wybór motywu, domyślnie jasna Kreda”. Ustawienia → Wygląd: Jasny (domyślnie, także dla dotychczasowych danych) / Ciemny / Jak w telefonie.
  `settings.theme`, `applyTheme` w `lib/theme.ts` (`Appearance.setColorScheme` — alerty, klawiatura i pasek stanu też). Ekran startowy kredowy
  (#F2F0EB) — pasuje do domyślnego wyglądu. Testy: `tests/theme-choice.test.tsx`.
