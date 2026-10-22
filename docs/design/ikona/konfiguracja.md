# Ikona, zegarek, ekran startowy — wpisy konfiguracji dla roli 08 (E4, 21.10.2026)

Decyzje: STOP E2 (rysunek ikony i intro bez zmian) i STOP E3 (zegarek 1088 przez własny zestaw ikon; tło startu i intro = `bg` z tokenów) — `docs/18-przekazanie.md`, wpisy z 21.10.2026. Arkusz kontrolny: [`arkusz.png`](arkusz.png) (generator `../narzedzia/e3-gen.mjs`).

## 1. Ikona iPhone — bez zmian
`app.json` → `ios.icon` `{ light: ./assets/icon.png, dark: ./assets/icon-dark.png, tinted: ./assets/icon-tinted.png }` zostaje. `ikona.svg` (warstwy `tlo.svg` + `pierwszy-plan.svg`) daje ten sam obraz co `assets/icon.png` (`ikona.mjs`, kod 0). Ikona `.icon` (Icon Composer, macOS): krok właściciela, warstwy w tym katalogu.

## 2. Zegarek 1088×1088 — własny zestaw ikon (WYCOFANE 22.10.2026)
**Stan 22.10.2026:** wycofane — build 1026 odrzucony przez App Store Connect (brak `CFBundleIconName` zegarka): bez pola `icon:` wtyczka nie ustawia też `ASSETCATALOG_COMPILER_APPICON_NAME` (`build/configuration-list.js`). Zegarek wrócił do `icon: '../../assets/icon.png'` (1024, opcja b ze STOP E3); `watch-AppIcon.appiconset/` i `zegarek-1088.png` zostają jako materiał na ewentualny powrót (docs/40, R-013 i lekcja z 22.10.2026). Opis niżej — stan historyczny.

Powód: `@bacons/apple-targets` 5.0.0 przy polu `icon:` zawsze generuje zegarek w 1024 (`build/icon/with-ios-icon.js`, rozmiar na sztywno); bez pola `icon:` wtyczka nie rusza katalogu `Assets.xcassets/AppIcon.appiconset` celu (`build/with-widget.js:324`: `if (props.icon) withIosIcon(…)`).
1. `targets/watch-app/expo-target.config.js`: usuń wiersz `icon: '../../assets/icon.png'` (komentarz: zestaw ikon własny, 1088, decyzja STOP E3 21.10.2026).
2. `targets/watch-app/Assets.xcassets/AppIcon.appiconset/`: zastąp zawartość plikami z [`watch-AppIcon.appiconset/`](watch-AppIcon.appiconset/) (`Contents.json` z `"size": "1088x1088"`, `"platform": "watchos"`; PNG 1088×1088 RGB bez przezroczystości = `zegarek-1088.png`, `cmp` zgodny); usuń obecny plik PNG 1024.
3. `scripts/verify-native.mjs` (wiersz z „zegarek: brak ikony 1024”) — sprawdza plik 1088 i `"size": "1088x1088"` po prebuild.
4. **Przebieg dowodowy (L-001):** `ios-unsigned.yml` na gałęzi partii; w logu brak ostrzeżeń `actool` o AppIcon zegarka, a w zbudowanym `.app` zegarka jest `Assets.car` z ikoną. `[DO USTALENIA]` — czy `actool` przyjmie 1088 w zestawie watchOS; jeśli nie, wraca 1024 (opcja b ze STOP E3) i wpis do `docs/40` (rejestr ryzyk) do czasu rozstrzygnięcia.

## 3. Tło ekranu startowego i intro = `bg` z tokenów
| Miejsce | Dziś | Po zmianie |
|---|---|---|
| `app.json` → `expo-splash-screen` `backgroundColor` | `#F4F3EF` | `#E6E8E5` (`light.bg`) |
| `app.json` → `expo-splash-screen` `dark.backgroundColor` | `#121316` | `#161C24` (`dark.bg`) |
| `lib/brandIcon.ts` `iconColors(s).bg` (tło intro, `components/Intro.tsx`) | `BRAND.paper` / `dark.bg` | `light.bg` / `dark.bg` z nowego `lib/theme.ts` |
| obraz `assets/splash.png` / `splash-dark.png` | rysunek ikony | bez zmian (rysunek na przezroczystym tle) |
| `app.json` → `android.adaptiveIcon.backgroundColor` | `#F4F3EF` | bez zmian (Android nie wydawany, DEC-26) |

Tusz gryfu w intro (`iconColors().ink`) zostaje (`#15171A` / `#ECEAE4`): kontrast do nowego tła 14,57:1 / 14,24:1 (rachunek wzorem WCAG, `../narzedzia/kontrast.mjs`). Kadry intro na nowym tle: ostatni rząd arkusza. Test do zmiany: `tests/brand-tuleja.test.tsx` (tło startu = `BRAND.paper` → `light.bg`).

## 4. Barwa akcentu zegarka, widżetu i Live Activity
`colors.$accent` w `targets/watch-app/expo-target.config.js` i `targets/rest-widget/expo-target.config.js` oraz kolory Swift Live Activity biorą `accent` z palety (jedno źródło, `tests/brand-tuleja.test.tsx`): `{ light: '#13294B', dark: '#F5F1E6' }` (dziś `#1F5FD1` / `#6F9BF2`). Tło Live Activity = `dark.bg` `#161C24`. Zegarek ma zawsze ciemne tło, więc działa wartość `dark` (krem, 12,9:1 na granacie tablicy; na czerni zegarka 18,61:1 — rachunek WCAG). Wygląd na zegarku i ekranie blokady: lista „tylko telefon” po TestFlight.

## 5. Android — otwarte
Warstwa przezroczysta (`android-foreground.png` z `pierwszy-plan.svg` w strefie 66/108) i monochromatyczna — nie robione do decyzji po 8 tygodniach (DEC-26). Ryzyko: maska Androida przytnie talerze.
