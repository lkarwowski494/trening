# Karta ćwiczenia — nagłówek z nazwą angielską i lokalną (makiety, 07.11.2026)

Decyzja właściciela 07.11.2026 (docs/18-przekazanie.md:292, zastępuje DEC-13; ZB-044): nazwy z biblioteki po angielsku wszędzie; wyjątek — karta ćwiczenia (`app/exercise/[id].tsx:71`, H1) pokazuje nazwę angielską na górze i lokalną pod nią. Ćwiczenie własne — jedna nazwa. Język bez nazwy lokalnej — sama angielska.
Inne decyzje o tym ekranie: docs/32 wzorzec 19 (szczegóły: tytuł paska = rodzaj, H1 = nazwa, obok „Edytuj”), M1-038 (głos VoiceOver nazwy: `lib/i18n.ts:150` `exNameLang`), UX2-05 („Technika” na górze podglądu).

## Pliki
- Generator: `docs/design/narzedzia/karta-nazwy-gen.mjs` (barwy z `lib/tokens.ts`, skala z `TYPE`, teksty z `lib/locales`), zrzuty: `docs/design/narzedzia/karta-nazwy-zrzuty.mjs` (każdy ekran osobno, 3×).
- Makieta: `docs/design/karta-nazwy/karta-nazwy.html`; zrzuty: `docs/design/karta-nazwy/zrzuty/{A,B,C}-{przypadek}.png` (+ `-szarosc` dla pl-390 i pl-320-dluga); AS IS z prawdziwej aplikacji (eksport web): `docs/design/karta-nazwy/as-is/`.
- Porównanie: `docs/design/karta-nazwy/porownanie.html` + `docs/design/karta-nazwy/porownanie.png`; kontrast: `docs/design/karta-nazwy/karta-nazwy-kontrast.txt` (wszystkie pary ≥ 6,3:1).
- Odtworzenie: `node docs/design/narzedzia/karta-nazwy-gen.mjs docs/design/karta-nazwy && node docs/design/narzedzia/karta-nazwy-zrzuty.mjs docs/design/karta-nazwy/karta-nazwy.html docs/design/karta-nazwy/zrzuty` (Playwright globalny).

## Przypadki
pl-390 (jasny) i pl-390-ciemny: Standing Cable Chest Press / Wyciskanie na linkach (stojąc) — prawdziwa nazwa z katalogu (`lib/i18n.ts:133`). pl-320-dluga: najdłuższa nazwa EN w katalogu (58 znaków, „Lying Close-Grip Barbell Triceps Extension Behind the Head”) + polska [PRZYKŁAD]. de-320: ta sama + niemiecka [PRZYKŁAD]. wlasne-390: ćwiczenie własne. lv-390: język bez nazwy lokalnej. pl-390-duplikat: Bench Press / „Bench Press (sztanga)” — typowa dzisiejsza „polska” nazwa z katalogu. pl-390-ax5 (tytuł do 13% szerokości, opis do 200%), pl-390-hc i pl-320-ciemny-hc (Zwiększ kontrast).

## Warianty
- **A „Podpis” (rekomendacja):** H1 bez zmian (largeTitle 34/38), nazwa lokalna pod nim w `callout` 15/20, kolor `muted`, odstęp 4 pt, w kolumnie tytułu obok „Edytuj”.
- **B „Podpis z językiem”:** jak A, ale „Po polsku: …” (etykieta `muted`, nazwa `text`) — nowy tekst w 30 słownikach.
- **C „Drugi tytuł”:** nazwa lokalna krojem tytułu (`navTitle` 20/24, Barlow 700, `muted`) na całej szerokości pod wierszem z „Edytuj”.
We wszystkich: „Edytuj” wyrównane do pierwszego wiersza tytułu (dziś do środka bloku); reguła — lokalna identyczna z angielską (bez wielkości liter) nie jest pokazywana.

## VoiceOver
H1: rola nagłówka, `accessibilityLanguage="en"` (po decyzji także w PL — dziś `exNameLang` zwraca `pl` dla polskiego). Nazwa lokalna: osobny, następny element z językiem interfejsu (głos polski/niemiecki); nie łączyć w jeden element. Ćwiczenie własne: jeden nagłówek w języku interfejsu. „Ogranicz ruch”: brak ruchu w nagłówku — bez różnic.

## Usterki znalezione w zrzutach i stan
1. Przycisk „Edytuj” w makiecie miał 15 pt zamiast 17 jak w aplikacji — poprawione.
2. Przy 320 pt „Bearbeiten” (DE) zwęża tytuł do ok. 150 pt → 6 wierszy (tak samo dziś w AS IS, `docs/design/karta-nazwy/as-is/asis-de-320-dark-lying.png`) — pytanie do właściciela, nie poprawione.
3. Polskie jednoliterowe wyrazy na końcu wiersza („sztangą w / leżeniu”) — do rozważenia twarda spacja w danych nazw lokalnych.
4. Dzisiejsza „polska” nazwa katalogu to zwykle angielska z dopiskiem („Bench Press (sztanga)”) — w B daje nieprawdziwe „Po polsku: …”; pełne polskie nazwy ma tylko ok. 11 pozycji (`EX_FULL`, `lib/i18n.ts:133-137`).
