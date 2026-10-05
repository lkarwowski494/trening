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

## Styl marki

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
- Do sprawdzenia na telefonie: wygląd w trybie ciemnym; błysk przy starcie (tło ekranu startowego #1E1F22 ≠ tło aplikacji — audyt cd60eec LOW).
