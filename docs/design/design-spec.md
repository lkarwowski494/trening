# System wyglądu — redesign M3 (rola 04 build, E3 + przekazanie E4, 21.10.2026)

Stan: **system zatwierdzony na STOP E3** (właściciel, 21.10.2026, docs/18 — wszystkie rekomendacje: zegarek 1088, tło startu = `bg`, grecki i cyrylica krojem systemowym, haptyka ± i ostrzegawcza, pola serii bez dotyku, wzorce W1–W3 wariant a). Kierunek A „tablica podejść”, wariant A2, krój Barlow Condensed. **E4:** tabela „ekran AS IS → ekran TO BE” (§10), z której koordynator układa partie; rola 08 używa wyłącznie tokenów i komponentów z tego systemu, po wdrożeniu rola 04 wraca w trybie `audit` (SP-13, §9).

## Pliki

| Plik | Co to jest |
|---|---|
| [`tokeny.ts`](tokeny.ts) | moduł tokenów (→ `lib/tokens.ts`): palety (jasna, ciemna, obie „Zwiększ kontrast”), motyw A2, pismo, odstępy, promienie, rozmiary, ruch, mapa haptyki, ikony. Klucze kolorów jak w `lib/theme.ts`. |
| [`theme.ts`](theme.ts) | **propozycja nowego `lib/theme.ts`** (E4): stare API bez zmian nazw (`light`, `dark`, `lightHC`, `darkHC`, `useTheme`, `F`, `FONT_FILES`, `FALLBACK_SCRIPTS`, limity skali) + `font(rola)`, `maxScale()`, `boardDigitSize()` i eksport tokenów; instrukcja przeniesienia w nagłówku pliku. Obejmuje M1-036 (pismo `TYPE`, promienie `RADIUS`), mapę haptyki `HAPTICS` (ZM-07) i warianty „Zwiększ kontrast” (M1-031). `tsc` i `eslint`: 0 błędów. |
| [`teksty.md`](teksty.md) | nowe i zmienione teksty UI (PL → EN propozycja, kontekst) dla roli 09; teksty dziedzinowe: brak (reguły ZM-01 do badacza) |
| [`wzorce-zrzuty/`](wzorce-zrzuty/) | zrzuty wzorcowe — linia bazowa SP-13 (§9) |
| [`ikona/konfiguracja.md`](ikona/konfiguracja.md), [`ikona/watch-AppIcon.appiconset/`](ikona/watch-AppIcon.appiconset/) | wpisy konfiguracji dla roli 08: zegarek 1088, tło startu i intro, akcent zegarka / widżetu / Live Activity |
| [`../32-wzorce-interakcji.md`](../32-wzorce-interakcji.md) | katalog wzorców z wpisanymi W1–W3 i ZM-01…07 (decyzja 9, wz. 5, 14, 15, 18, 19, 24, 28, nowe 29–30) |
| [`tokeny-kontrast.json`](tokeny-kontrast.json) → [`tokeny-kontrast.txt`](tokeny-kontrast.txt) | 210 par z tokenów (`narzedzia/e3-kontrast.mjs`), pomiar `narzedzia/kontrast.mjs`: kod 0, najsłabsza para 3,31:1 przy progu 3 |
| [`ekrany/e3-ekrany.html`](ekrany/e3-ekrany.html), [`ekrany/e3-ekrany-el.html`](ekrany/e3-ekrany-el.html) | makiety ekranów TO BE z tokenów (pl i najdłuższy język el); generator `narzedzia/e3-gen.mjs` |
| [`e3/ark-1-tablica.png`](e3/ark-1-tablica.png) … [`e3/ark-5-el-hc.png`](e3/ark-5-el-hc.png) | arkusze zbiorcze: 320/390/430 pt × jasny/ciemny × domyślny/AX5, el, „Zwiększ kontrast” |
| [`ikona/`](ikona/) | warstwy SVG (`tlo.svg`, `pierwszy-plan.svg`, `pierwszy-plan-ciemny.svg`, `ikona.svg`), `zegarek-1088.png`, arkusz `arkusz.png` |

Uruchomienie: `node --experimental-strip-types docs/design/narzedzia/e3-gen.mjs` i `… e3-kontrast.mjs` (Node 22; bez zależności). Zrzuty: `narzedzia/zrzuty.mjs` (Playwright spoza projektu).

## 1. Tokeny

### Barwy (pary i pochodzenie: komentarze w `tokeny.ts`)
| Rola | Jasny | Ciemny | Użycie |
|---|---|---|---|
| bg „hala” | `#E6E8E5` | `#161C24` | tło ekranu, ekran startowy (propozycja) |
| surface / surface2 | `#F4F5F3` / `#D3D8D3` | `#1E2530` / `#283244` | grupy list, pasek tygodnia / przyciski drugorzędne, chipy, pole wyszukiwania |
| text / muted | `#18202B` / `#4A5361` | `#E8EAED` / `#A3ACB8` | treść / tekst pomocniczy |
| accent / accentInk | `#13294B` / `#F5F1E6` | `#F5F1E6` / `#13294B` | przycisk główny, przyciski tekstowe w nagłówku, linia wykresu, wybrany chip, znacznik dnia |
| board, boardText, boardMuted, boardField, boardEdge | `#13294B`, `#F5F1E6`, `#B7C1D0`, `#26446F`, = board | `#102544`, `#F5F1E6`, `#AEB9CA`, `#22416D`, `#5675A8` | tablica „teraz” i „Dziś” (element firmowy) |
| now „teraz” | `#F2A900` | `#F5B21C` | tylko zegar przerwy i ramka bieżącej serii; nie jest akcentem interfejsu |
| danger, done, doneLine, band, less, ctrlLine, line | jak w `tokeny.ts` | | znaczenia bez zmian względem `lib/theme.ts` |
| motif25/20/15/10, motifBar | `#E4C9CA` `#C6D2E2` `#E8E2C8` `#C9DCCF`, `#C2C8C2` | `#40232D` `#20304D` `#423D26` `#1E3C34`, `#333C49` | motyw A2 (16% / 20%) |

**Przycisk główny w ciemnym motywie jest jasny (krem na granacie tekstu).** Reguła: przycisk główny = `accent` + `accentInk` w obu motywach; w ciemnym akcentem jest krem cyfr tablicy. Dzięki temu przycisk nie zlewa się z granatową tablicą nad nim i jest najjaśniejszym punktem pod tablicą.

**Motyw A2 (MOTIF):** tylko start (sylwetka końca sztangi, ok. 30% szerokości, prawy górny róg) i puste stany (gryf z talerzami, 220 pt). Nigdy na tablicy, przy liczbach kg, w paskach, listach ani przyciskach; barwa nic nie znaczy (decyzja 09.10.2026). Znika przy „Zwiększ kontrast” i od skali tytułu 1,4 (ok. AX2); ukryty dla VoiceOver. Górna granica krycia 24%.

### Pismo (TYPE, TEXT_SCALE)
- Tytuły, tablica i liczby: **Barlow Condensed 600/700** (OFL, `fonty/barlow-condensed/OFL.txt`). Treść, przyciski, listy: **krój systemowy** (SF Pro, bez `fontFamily`).
- **Barlow nie ma greki ani cyrylicy** (sprawdzone na pliku TTF: brak U+03B1 i U+0430; jest polski, rumuński, turecki, wietnamski). W el, bg, ru, uk, sr oraz ja, ko, zh-Hant litery idą krojem zastępczym systemu (lista kaskadowa Core Text, jak dziś `FALLBACK_SCRIPTS`), cyfry i „×” zostają w Barlow. Na zrzutach el litery tablicy są krojem zastępczym makiety (Source Sans 3); na iOS będzie SF Pro.
- Poziomy: duży tytuł 34, tytuł w nagłówku 20, nagłówek sekcji 17, treść 17, objaśnienie 15, przypis 13, podpis 11 (minimum iOS); przycisk główny 19, zwykły 17; tablica: nazwa 24 (wersaliki), opis 18, liczba 96, zegar 112, pole 20.
- Skala (DEC-10): opisy rosną do 200%, liczby w polach do 130% z podglądem po przytrzymaniu, pasek zakładek, pasek tygodnia i pasek nawigacji do 125% (jak pasek zakładek iOS, z podglądem; **uwaga E4:** przyciski nagłówka mają dziś `HeaderButton` z limitem 1,4, pilnowanym przez strażnik S2 — rekomendacja: zostawić 1,4 dla przycisków, 125% tylko dla tytułu i zakładek, bo obniżenie limitu byłoby cofnięciem dostępności), cyfry tablicy dopasowane do szerokości (96 pt albo 24% szerokości ekranu albo 105% szerokości / liczba znaków — wygrywa najmniejsze, żeby „187,5 lb × 12” zmieściło się w jednym wierszu przy 320 pt). Duży tytuł: do 13% szerokości ekranu (w RN `adjustsFontSizeToFit`, uproszczenie), bo przy AX5 słowo „Προπόνηση” łamało się w środku.
- Wersaliki tylko w nazwie ćwiczenia na tablicy i w „Dziś: …” — jak nazwisko na tablicy podejść (IWF 3.3.6.15), przez `upperText()`; rozszerzenie wyjątku DEC-17 zatwierdzone (W3 a, docs/32 wz. 28 pkt 4).

### Odstępy, promienie, rozmiary
- Jednostka 4 pt; margines ekranu 16, w grupie 8, między grupami 24.
- Promienie wg hierarchii (M1-036): grupa 12 › tablica 8 = przycisk 8 › pole 4 › znacznik 3; okrągłe: ±, „⋯”, ⓘ. Arkusze i okna — systemowe.
- Cel dotykowy ≥ 44 pt; przycisk główny 60, drugorzędny 52, ± 44, wiersz 52. Pola serii na tablicy nie są celem dotyku (minimum 36 × skala liczb) — decyzja STOP E3.

### Ruch i haptyka
- Ruch: „Seria zrobiona” — tablica przewraca się na zegar (250 ms, ease-out), pole serii wypełnia się (120 ms); ± bez animacji. „Ogranicz ruch”: przenikanie 150 ms. Intro bez zmian (`lib/intro.ts`).
- Mapa haptyki (`HAPTICS`, ZM-07): każda haptyka zależy tylko od przełącznika „Wibracje”, każdy dźwięk tylko od „Dźwięk na koniec przerwy”. ✓ → lekkie stuknięcie; koniec przerwy → `notificationSuccess` + dźwięk; ± → `selection` (nowe, zatwierdzone); „Seria zrobiona” bez wartości → `notificationWarning` + ogłoszenie VoiceOver (nowe, zatwierdzone); usunięcie, zakończenie, błąd → bez haptyki (okno systemowe).

## 2. Komponenty
| Systemowe (standardowe zachowanie iOS) | Własne |
|---|---|
| pasek nawigacji z „‹ Wróć”, duży tytuł, pasek zakładek, arkusze z „Anuluj” po lewej, okna potwierdzeń (`lib/confirm.ts`), przełączniki, `Segmented`, pole wyszukiwania, menu „⋯”, listy grupowane, klawiatura numeryczna | **tablica „teraz”** (seria, przerwa, seria na czas), **tablica „Dziś”** na starcie, **pola serii**, przycisk ± o krok sprzętu, pasek tygodnia, motyw A2 (dekoracja), ikony 24/1,8 (M1-029) |

**Element firmowy — tablica „teraz”.** Dane: nazwa ćwiczenia, „seria n z m” (`counterLabel`), ciężar × powtórzenia (albo czas / dystans), jednostka z `wu()`/`distUnit()` (kg/lb, m/yd — DEC-28/29), pola wszystkich serii (zrobiona = wypełnienie, bieżąca = ramka bursztynowa, czekająca = kontur, rozgrzewka czekająca = kontur kreskowany; stan niesie kształt), w przerwie zegar i następna seria. **VoiceOver** (jeden element, rola obrazu z opisem): „Bench Press (sztanga), seria 3 z 4, 80 kilogramów razy 6. Serie: 2 z 4 zrobione” / „Przerwa, zostało 1 minuta 47 sekund z 2 minut 30. Następna: seria 4 z 4, 80 kg razy 6”; przy rozgrzewkach „Rozgrzewki: 3 z 3 zrobione; serie: 5 z 8 zrobione”, przy > 12 polach dopisek „lista serii przewijana”. Przyciski ± mają własne etykiety („Zwiększ ciężar o 2,5 kg”).

**Ikony (M1-029 / DEC-11).** Materiał z `origin/m3-wejscie/029-ikony` (`components/Icon.tsx`: pin, pauza, start, przerwa, słuchawki, głośnik, wyciszenie, „⋯”) pasuje do systemu bez zmian: siatka 24, linia 1,8, zaokrąglone końce, kolor z palety. Do dopasowania: ikony zakładek (`components/TabIcon.tsx`) na tę samą linię 1,8 i rozmiar 26; nowe ikony z makiet: lupa, strzałka „Wróć” (systemowa), filiżanka dnia odpoczynku (dziś). Gałęzi nie scalam.

## 3. Słownik interakcji (zgodny z docs/32 po wpisaniu W1–W3, 21.10.2026)
Anuluj (lewy górny róg arkusza, okna) · Zapisz (prawy górny róg szkicu) · Edytuj (prawy górny róg szczegółów i list z trybem usuwania — ZM-04) · Usuń {obiekt} (na dole szczegółów, okno [Anuluj, Usuń]) · Seria zrobiona · Zakończ serię (seria na czas, ZM-05) · Pomiń · Zakończ (drugorzędny, w nagłówku treningu) · Wróć (strzałka systemowa) · Cofnij · Przywróć.

## 4. Macierz stanów (tylko stany, które dotyczą ekranu)
| Ekran | Stany narysowane | Stany opisane (do wdrożenia, bez makiety) |
|---|---|---|
| Karta „teraz” — seria | typowy (kg), lb, AX5 | pierwsze użycie: puste pola „— kg × —”; brak wartości: „Seria zrobiona” przenosi kursor do pustego pola, bez okna (ZM-01), haptyka ostrzegawcza i ogłoszenie; seria na czas: „Zakończ serię”; > 12 pól: przewijany rząd |
| Karta „teraz” — przerwa | typowy, AX5 | pierwsza przerwa: wiersz „Przerwa trwa — powiadomić na koniec?” pod tablicą (ZM-02), brak uprawnienia: raz komunikat, potem tylko w Ustawieniach; praca w tle: Live Activity |
| Start | typowy z motywem A2, AX5 (motyw znika), HC (motyw znika) | bez planu: „Dziś” zastępuje zaproszenie do generatora; trening w toku: „Start” wyszarzony + `workoutInProgressNotice` |
| Postępy | z historią (wykres i rekordy na górze — DEC-09), pusty z motywem i „Zacznij trening” (ZM-06) | dane częściowe: rekordy bez wartości pokazują „—”, nie zero; brak wyników wyszukiwania: „Nic nie pasuje.” |
| Szczegóły sesji | typowy z „Usuń sesję”, okno potwierdzenia (to samo co gest) | sesja z kopią w Zdrowiu: dopisek w oknie (narysowany); „nie ma takiej sesji”: `Missing` |

## 5. Głos
Ton: krótko, rzeczowo, jak tablica i trener na sali; ekrany formalne tam, gdzie język tego wymaga (wyjątek „ton trenera” tylko we wskazówkach techniki). Bez wykrzykników, bez „Gotowe!”, bez sprzedawania. Słowa zakazane: „Oops”, „Niestety”, „Gratulacje!”, „Nie udało się” bez nazwy akcji (S8), „anuluj trening” (S9). Wzory: pusty stan = jedno zdanie + akcja („Wykresy pojawią się po pierwszym zakończonym treningu.” + „Zacznij trening”); błąd = „Nie udało się {co}.” + co zrobić; potwierdzenie nieodwracalne = pytanie z obiektem („Usunąć tę sesję z historii?”) + skutek poza aplikacją (kopia w Zdrowiu); sukces rutynowy = widoczna zmiana bez okna.

**Nowe i zmienione teksty:** pełna lista z kontekstem i propozycją EN — [`teksty.md`](teksty.md) (24 pozycje; „Ćwiczenie” już jest w słowniku).

## 6. Ikona, ekran startowy, intro
- **Rysunek bez zmian** (decyzja STOP E2). iOS: `assets/icon.png` 1024 RGB bez przezroczystości — `ikona.mjs` na `ikona/ikona.svg` daje kod 0 i ten sam obraz (różnice tylko w wygładzaniu krawędzi, maks. 20/255 na 8 pikselach); `icon-dark.png` i `icon-tinted.png` — obecne.
- **Wpisy konfiguracji dla roli 08: [`ikona/konfiguracja.md`](ikona/konfiguracja.md)** (zatwierdzone na STOP E3).
- **Zegarek: nowy plik `ikona/zegarek-1088.png`** (1088×1088, RGB, bez przezroczystości, kwadrat bez maski — HIG App icons: watchOS 1088×1088, kształt okrągły, „provide square layers so the system can create the circular icon shape”; odczyt 21.10.2026). Talerze mieszczą się w kole (najdalszy narożnik 53/60 promienia). **Konfiguracja:** `@bacons/apple-targets` 5.0.0 generuje ikonę zegarka zawsze w 1024 (`build/icon/with-ios-icon.js`, `generateWatchIconsInternalAsync`: `const size = 1024`), więc samo `icon:` w `targets/watch-app/expo-target.config.js` nie wystarczy. Wpięcie (rola 08): własny `AppIcon.appiconset` z plikiem 1088 i `"size": "1088x1088"` albo krok po prebuild; czy `actool` przyjmie 1088 w zestawie watchOS — `[DO USTALENIA]`, rozstrzyga przebieg `ios-unsigned.yml` (przebieg dowodowy CI, L-001). **Wycofane 22.10.2026** (zegarek na 1024, `ikona/konfiguracja.md` §2).
- **Android:** nie wydawany przed decyzją po 8 tygodniach (DEC-26), a obecna konfiguracja (`android.adaptiveIcon.foregroundImage` = pełna ikona) działa bez nowych plików — warstwa przezroczysta i monochromatyczna zostają **otwarte** (ryzyko: maska Androida przytnie talerze; tani wariant z `pierwszy-plan.svg` w strefie 66/108).
- **Ekran startowy i intro:** rysunek i czasy bez zmian. Zatwierdzone (STOP E3): tło ekranu startowego (`expo-splash-screen` `backgroundColor` i `dark.backgroundColor`) oraz tło intro = `bg` z tokenów (`#E6E8E5` / `#161C24` zamiast `#F4F3EF` / `#121316`), żeby po intro nie było skoku tła; ikona zachowuje papier.
- Ikona warstwowa `.icon` (Icon Composer, macOS): krok właściciela, warstwy w `ikona/`.

## 7. Kontrast
210 par (jasny, ciemny, oba HC): tekst ≥ 4,5, duży tekst i elementy ≥ 3; HC: tekst pomocniczy i akcent ≥ 7, elementy ≥ 4,5 (reguła M1-031). Wynik: wszystkie spełniają progi (kod 0). Przycisk ± na tablicy odróżnia kształt i ikona (para ikona/tło ± mierzona), nie barwa koła wobec tablicy. Szczegóły: `tokeny-kontrast.txt`.

## 8. Pomiar warsztatu (`warsztat.mjs`, 390 px, oba pliki makiet)
0 błędów. Ostrzeżenia: 15–18 wielkości i 7 kolorów tekstu — liczone łącznie z 8 ekranów i chromu makiety (pasek stanu 16 px), z cyframi tablicy dopasowanymi do szerokości (wartości ułamkowe); na jednym ekranie poziomów jest 4–6 zgodnie z `TYPE`. Odstępy 2 i 6 px pochodzą z chromu makiety (`kierunki/wspolne.css`: pasek stanu), nie z tokenów. Test mrużenia: na karcie „teraz” i przerwie punktem skupienia jest tablica; w Postępach wybrany chip konkuruje z wykresem (do obserwacji po wdrożeniu).

## 9. Linia bazowa: „przed” i wzorzec (SP-13)
- **Przed (AS IS):** 133 zrzuty iOS z nocnego pełnego E2E, przebieg `39537208004` (main `0fd4687`, symulator iPhone 17), decyzja D1 przebiegu M3 — **poza repo**, w katalogu przebiegu `audit/M3-2026-10-21/zrzuty/przed-ios/` (nazwa pliku = zrzut ze scenariusza `.maestro/NN-*.yaml`). Kolumna „Przed” w §10 podaje nazwy plików bez `.png`.
- **Wzorzec (TO BE):** [`wzorce-zrzuty/`](wzorce-zrzuty/) — 140 zrzutów makiet z tokenów: 8 stanów (`seria`, `seria-lb`, `przerwa`, `start`, `postepy`, `postepy-pusty`, `sesja`, `sesja-usun`) × 320/390/430 pt × jasny/ciemny × domyślny/AX5 (96), „Zwiększ kontrast” 390 pt jasny/ciemny (16), najdłuższy język el przy 320 pt × 7 stanów × motyw × rozmiar (28). Nazwa: `e3-ekrany[-el]-<stan>-<szerokość>-<motyw>[-ax5][-hc].png`. Odtworzenie: `node --experimental-strip-types narzedzia/e3-gen.mjs`, potem `narzedzia/zrzuty.mjs <makieta> <katalog> Tablica` (Playwright spoza projektu). Sprawdzone 21.10.2026: ponowny render daje pliki identyczne bajt w bajt z zestawem STOP E3 (196/196, `cmp`).
- **Archiwum:** w repo nie było wcześniejszych zrzutów wzorcowych (sprawdzone `git ls-files`: PNG tylko w `assets/`, `targets/`, `tests/fixtures/` i `docs/design/` z E2–E3), więc `archiwum/2026-10-21/` nie powstało — nic nie przeniesiono ani nie skasowano.
- **Uwaga do E5:** wzorzec to makieta w Chromium (krój treści zastępczy Source Sans 3, AX5 jako uproszczenie skali), więc porównanie dotyczy układu, hierarchii, barw i stanów, nie kroju treści ani natywnych kontrolek (§ „Czego nie sprawdzono” w STOP E3).

## 10. Ekran AS IS → ekran TO BE (dla partii wdrożenia)
**S** = system bazowy na każdym ekranie: palety z `theme.ts` (jasna, ciemna, HC), `font(rola)` zamiast `F.*` i liczbowych `fontSize`, `RADIUS` zamiast liczbowych `borderRadius` (M1-036, 04-011), odstępy z `SPACE` (jednostka 4), ikony M1-029 zamiast emoji (📍 🎧 🔇 🔊; materiał `m3-wejscie/029-ikony`), limity skali DEC-10 (M1-030), przycisk główny `accent` + `accentInk`. **Dane:** flaga tylko przy zmianie zapisanych danych (ZM-07). **Teksty:** numery z [`teksty.md`](teksty.md). **Partia:** propozycja (p1 tokeny i komponenty, p2 trening, p3 Postępy i historia, p4 szablony, plan, generator, biblioteka, p5 Więcej i ustawienia, p6 przekrojowo duży tekst, zegarek, widżet) — ostateczny podział robi koordynator.

| # | Trasa / plik | Przed (`przed-ios/`) | Co się zmienia (TO BE) | ZM / decyzja | Tokeny / komponenty | Dane | Teksty | Partia |
|---|---|---|---|---|---|---|---|---|
| 1 | `app/_layout.tsx` (stos, ładowanie krojów, intro) | — | Barlow Condensed zamiast IBM Plex (`FONT_FILES`), tytuł paska nawigacji Barlow 20 (do 125%), przyciski paska jak dziś (`HeaderButton`, 1,4); intro na tle `bg` | M1-036; STOP E3 (tło intro) | `theme.ts`, `TYPE.navTitle`, `lib/brandIcon.ts`; [`ikona/konfiguracja.md`](ikona/konfiguracja.md) | — | — | p1 |
| 2 | `app/(tabs)/_layout.tsx` (pasek zakładek) | s3-90-cztery-zakladki | ikony zakładek 26 pt / linia 1,8, podpisy `caption` do 125% z podglądem po przytrzymaniu | M1-029, M1-030 | `TabIcon`, `ICON.tabSize`, `TYPE.caption`, `TEXT_SCALE.bar` | — | — | p1 |
| 3 | `app/(tabs)/index.tsx` — Start (bez treningu w toku) | s2-53-ekran-glowny-ciemny, s1-80-pierwsze-kroki | duży tytuł i data; „Planowanie” w nagłówku; tablica „Dziś” (nazwa planu, „Dziś: …” wersalikami); pasek tygodnia; Start (`accent`, 60 pt) i „Inny trening”; motyw A2 (sylwetka 30% w prawym górnym rogu, znika przy HC i od skali 1,4); „Pierwsze kroki”, „Ten tydzień”, wiersze błędów zapisu — S | W1 c, W3, A2, DEC-10 | `TodayPlan`, `StartPanel`, `Motif` (`MOTIF`, `motif*`), `Dashboard`; makieta `start`, ark-2 | — | — | p2 |
| 4 | `app/(tabs)/index.tsx` + `components/ActiveWorkout.tsx` — trening w toku | s3-41-karta-teraz, s3-40-karta-teraz-pusta, s1-83-przerwa, s3-42-wszystko-odhaczone-przerwa-w-karcie, s2-08-stoper | karta „teraz” → **tablica „teraz”** (wz. 29): nazwa wersalikami, „seria n z m”, ciężar × powtórzenia dopasowane do szerokości, ± o krok, wpis po stuknięciu liczby, pola serii 1–4 / 5–12 / > 12; „Seria zrobiona” bez wartości → kursor do pola + haptyka ostrzegawcza + ogłoszenie; przerwa: zegar `now`, „z {s}”, „Następna: …”, „Pomiń”; nagłówek w jednej linii + „⋯” + „Zakończ” drugorzędny (wz. 30); zgoda na powiadomienia przy pierwszej przerwie; „Następne ćwiczenia” pod tablicą; seria na czas: „Zakończ serię”; ruch: przewrót 250 ms (Ogranicz ruch: przenikanie 150 ms) | ZM-01, ZM-02, ZM-05, ZM-07 (haptyka), W1 a, W3 | nowe: tablica, pola serii, przycisk ±, „⋯” i „Zakończ” w nagłówku; `TYPE.board*`, `RADIUS.board/field`, `SET_FIELDS`, `MOTION`, `HAPTICS`, `now`; makiety `seria`, `seria-lb`, `przerwa`, ark-1 | — (logika i dane bez zmian; sesje z pustymi seriami zostają) | 1–3, 5–7, 12–19 | p2 |
| 5 | `components/ActiveWorkout.tsx` — widok listy (Ustawienia → Widok treningu: Lista) | s3-43-widok-listy | S; `[DO USTALENIA]` czy ZM-01 (wpis wyniku z ±) obejmuje widok listy — `to-be.md` go nie opisuje; rekomendacja: tylko S | — | `ActiveWorkout` | — | — | p2 |
| 6 | `app/(tabs)/history.tsx` (zakładka Plan) | s2-42-wraca-z-planu | S (kalendarz, lista sesji z gestem); „Planowanie” i „Dopisz trening wstecz” dziś w treści — `[DO USTALENIA]` czy „Planowanie” tak jak na starcie (W1 c; zasada „ta sama akcja tak samo”) | S, W1 c | `HistoryCalendar`, `DayPanel`, `SwipeRow`, `Chip` | — | — | p3 |
| 7 | `app/(tabs)/progress.tsx` (Postępy) | s3-91-postepy-masa-ciala | wykres i rekordy wybranego ćwiczenia na górze (`stat`, linia `accent`), wybór ćwiczenia pod nimi: chipy tylko ćwiczeń z danymi, reszta przez wyszukiwanie; bez historii sam pusty stan z motywem A2 i „Zacznij trening”; „okres vs okres” i strażnik progresji — S | ZM-06, M1-026 (DEC-09), A2 | `Chart`, `RecordsCard`, `PeriodSummary`, `ProgressBars`, `GuardSection`, `Guard`, `MuscleMap`, `Empty` + motyw; makiety `postepy`, `postepy-pusty`, ark-3 | — | 4 | p3 |
| 8 | `app/(tabs)/more.tsx` (Więcej) | s3-92-wiecej-szablony | S (duży tytuł, lista grupowana `RADIUS.group`, wersja `footnote`) | S | `Item` | — | — | p5 |
| 9 | `app/history/[id].tsx` (Sesja) | s2-111-sesja-po-polsku, s3-102-sesja-ze-skrajnymi-wartosciami | S; „Usuń sesję” na dole (`danger`, odstęp 24) → okno jak gest, z dopiskiem o kopii w Zdrowiu; brak wyniku „—”, nie „0” (04-010); tytuł środkowy skraca się, „Edytuj” się nie ucina | ZM-04, W2, 04-010 | przycisk „Usuń {obiekt}” (wspólny, `confirmDelete`), `RecordsCard`; makiety `sesja`, `sesja-usun`, ark-4 | — | 22 | p3 |
| 10 | `app/history/add.tsx` (Trening wstecz) | — | S | S | `WhenFields`, `DateField` | — | — | p3 |
| 11 | `app/history/edit/[id].tsx` (Edycja sesji) | — | S; kolumny liczb `font('callout')` + cyfry tabelaryczne; szkic bez zmian (`DraftHeader`) | S | `DraftHeader`, `NumInput` | — | — | p3 |
| 12 | `app/progression.tsx` (Progresja) | — | S | S | `ProgressBars`, `PeriodLine` | — | — | p3 |
| 13 | `app/exercise/[id].tsx` (Ćwiczenie) | s1-50-podglad-cwiczenia, s1-51-edycja-cwiczenia | S; „Usuń z biblioteki” na dole podglądu (ćwiczenie własne; wbudowane — `[DO USTALENIA]`, docs/32 wz. 5) | ZM-04, W2 | przycisk „Usuń {obiekt}”, `ExerciseFigure`, `ExerciseCues`, `EquipVisual`, `MuscleMap` | — | 21 | p4 |
| 14 | `app/exercises.tsx` (Ćwiczenia) | s2-80-biblioteka-wszystkie | S | S | `SearchField`, `LibScope`, `AddButton`, `SwipeRow` | — | — | p4 |
| 15 | `app/template/[id].tsx` (Szablon) | s2-109-szablon-po-polsku | S; „Usuń szablon” na dole podglądu (nie w szkicu) | ZM-04, W2 | przycisk „Usuń {obiekt}”, `DraftHeader` | — | 20 | p4 |
| 16 | `app/templates.tsx` (Szablony) | — | S | S | `AddButton`, `SwipeRow`, `SectionTitle` | — | — | p4 |
| 17 | `app/generator.tsx` (Generator) | s2-70-generator, s2-70a-generator-1-dzien, s2-70b-generator-ogolny-cardio, s2-71-generator-zrodla | przełącznik trybu znika (04-001); „Zapisz szablony i plan” bez okien: pierwszy plan aktywny bez pytania → Planowanie ze zdaniem potwierdzenia; pytanie o zastąpienie aktywnego planu zostaje; zgoda na przypomnienie przy pierwszym zaplanowanym dniu albo wierszem w Planowaniu | ZM-03 — zmiana zakresu do potwierdzenia przez rolę 03 przed partią (`to-be.md`) | `Btn primary`; bez `Segmented` | — | 23, 24 | p4 |
| 18 | `app/plan.tsx` (Planowanie) | s2-72-plan-z-generatora | S; zdanie „Plan „{name}” jest aktywny.” po generatorze; „Plan z moich szablonów” jako osobne wejście; wiersz zgody na przypomnienie | ZM-03 | `OwnPlan`, `DayPicker`, `AddButton` | — | 23 | p4 |
| 19 | `app/picker.tsx` (Wybierz ćwiczenie) | s1-23-picker-filtr-miejsca, s1-24-picker-tylko-dostepne, s1-25-picker-pokaz-wszystkie | S | S | `CloseButton`, `SearchField` | — | — | p4 |
| 20 | `app/reorder.tsx` (Kolejność ćwiczeń) | — | S; haptyka przeciągania tylko przy „Wibracje” | S, ZM-07 | `DragList` | — | — | p2 |
| 21 | `app/swap.tsx` (Zamień ćwiczenie) | — | S; ciągi „·” — przegląd wz. 28 (otwarte) | S | `CloseButton` | — | — | p2 |
| 22 | `app/adapt.tsx` (Dostosuj do miejsca) | s2-40-dostosuj-okno, s1-44-dostosuj-jednorazowe | S; 📍 → ikona; ciągi „·” — przegląd wz. 28 | S, M1-029 | `CloseButton`, `Icon` | — | — | p2 |
| 23 | `app/place-once.tsx` (Inne miejsce) | s1-43-inne-miejsce | S; 📍 → ikona | S, M1-029 | `CloseButton`, `Icon` | — | — | p2 |
| 24 | `app/pick-template.tsx` (Wybierz szablon) | — | S | S | `CloseButton` | — | — | p2 |
| 25 | `app/guide.tsx` (Przewodnik) | s2-73-przewodnik, s1-113-przewodnik | S; treść o wpisie wyniku, usuwaniu i dźwięku (`lib/guide.ts`) dopasować do ZM-01, ZM-04, ZM-07 | S | — | — | (`lib/guide.ts`, rola 09) | p5 |
| 26 | `app/paywall.tsx` (Pełna wersja) | s1-99-zakup-ceny, s1-99-limit, s1-99-zakup-aktywny | S; warunki subskrypcji na wierzchu bez zmian | S | `CloseButton`, `SubscriptionCard` | — | — | p5 |
| 27 | `app/more/settings.tsx` (Ustawienia) | s1-106-przelaczniki, s2-51-ustawienia-po-polsku | dwa przełączniki „Dźwięk na koniec przerwy” i „Wibracje” zamiast jednego; ⓘ zapowiedzi odsyła do „Dźwięk…”; reszta S | ZM-07 | `SwitchRow`, `HAPTICS` | **TAK** — nowe pola przejmują wartość obecnego `sound`; migracja w transakcji, test na kopii danych poprzedniej wersji, kopia zapasowa i import; STOP przed partią | 8–11 | p5 (osobna partia) |
| 28 | `app/more/bodymass.tsx` (Masa ciała) | s2-70-masa-ciala-pomiary | „Edytuj” w nagłówku → tryb usuwania pomiarów; gest zostaje | ZM-04, W1 b | przycisk „Edytuj” (wspólny), `SwipeRow` | — | 22 | p5 |
| 29 | `app/more/bands.tsx` (Gumy) | — | „Edytuj” obok „+” → tryb usuwania gum | ZM-04, W1 b | przycisk „Edytuj”, `AddButton` | — | 22 | p5 |
| 30 | `app/more/locations.tsx` (Miejsca i sprzęt) | s1-20-miejsca-pusto, s1-21-presety-miejsc | S; usuwanie przez szczegóły miejsca albo gest | S | `AddButton`, `SwipeRow` | — | — | p5 |
| 31 | `app/more/location/[id].tsx` (Miejsce) | s1-22-drazek-wlaczony, s1-60-gumy-w-miejscu | S; „Usuń miejsce” na dole (poza głównym); talerze: „Usuń odznaczone” bez zmian (wyjątek wz. 5) | ZM-04, W2 | przycisk „Usuń {obiekt}”, `LoadEditor`, `EquipVisual` | — | 22 | p5 |
| 32 | `app/more/backup.tsx` (Kopia zapasowa) | — | S | S | `Btn loading` | — | — | p5 |
| 33 | `app/more/import.tsx` (Import CSV) | — | S | S | `Btn loading` | — | — | p5 |
| 34 | `app/more/language.tsx` (Język) | s2-50-lista-jezykow | S | S | `Item` | — | — | p5 |
| 35 | `app/more/about.tsx` (O aplikacji) | — | S | S | `Item`, `Btn` | — | — | p5 |
| 36 | `app/more/licenses.tsx` (Licencje) | s2-71-licencje | S | S | — | — | — | p5 |
| 37 | `app/+not-found.tsx`, `app/_sitemap.tsx` | — | nie dotyczy (bez interfejsu) | — | — | — | — | — |
| 38 | `targets/watch-app` (zegarek) | — | ikona 1024 przez pole `icon:` (1088 wycofane 22.10.2026 — odrzucona wysyłka build 1026, `ikona/konfiguracja.md` §2); akcent `{ light: '#13294B', dark: '#F5F1E6' }`; „Zakończ serię” w trakcie pomiaru (wz. 24); wygląd ekranów zegarka poza barwą — `[DO USTALENIA]` (mapowanie tablicy z makiety A, E2; nie renderowane w E3) | ZM-05, STOP E3 (zegarek) | `ikona/watch-AppIcon.appiconset/` | — | — | p6 |
| 39 | `targets/rest-widget` (Live Activity) | — | tło `dark.bg`, akcent `dark.accent` (jedno źródło z palety); etykiety z `counterLabel` | S | `colors.$accent`, kolory Swift | — | — | p6 |

**Komponenty wspólne (p1, przed ekranami):** `components/ui.tsx` (`H1`, `H2`, `SectionTitle` z `upperText()`, `Btn` — `primary` = `accent`/`accentInk`, wysokości 60/52; `Item` wiersz 52; `Chip`, `Segmented`, `Field`, `Muted`, `Empty` z motywem A2, `Missing`, `SearchField`); `CloseButton`, `DraftHeader`, `AddButton` (`HeaderButton`, limit 1,4 bez zmian); **nowe wspólne:** „⋯” i „Zakończ” w nagłówku treningu, „Edytuj”/„Gotowe” list, „Planowanie” na starcie, „Usuń {obiekt}” na dole szczegółów (`Btn danger` + `confirmDelete` z `SwipeRow`); `InfoTip` (ramka `RADIUS.group` 12 zamiast 10); `Motif`, `EmptyBarArt`, `WeekStacks` (motyw A2, znaczniki dni `RADIUS.marker`); `Intro` i `lib/brandIcon.ts` (tło `bg`); `TabIcon` i ikony M1-029; `DragList` (haptyka zależna od „Wibracje”). Pozostałe (`HealthLines`, `ExerciseCues`, `ExerciseFigure`, `EquipVisual`, `LoadEditor`, `MedicalNote`, `SubscriptionCard`, `StartError`, `SetBadge`, `DeloadHint`, `IdeaLink`, `LibScope`, `BandColorInput`, `WhenFields`, `DayPicker`, `DayPanel`, `HistoryCalendar`, `Chart`, `ProgressBars`, `PeriodSummary`, `Guard`, `GuardSection`, `MuscleMap`, `RecordsCard`, `OwnPlan`, `WhatsNew`, `TestWatchPanel`, `PlanReminderSync`) — S.

Liczba: wszystkie **36 tras** z `app/` są w tabeli (wiersze 1–37). 34 trasy mają interfejs; `index.tsx` jest rozpisany na trzy stany, więc wierszy z interfejsem jest **36** (1–36), do tego **2** cele natywne (38–39) — razem **38 pozycji AS IS → TO BE**; `+not-found` i `_sitemap` (wiersz 37) nie dotyczą.

## 11. Strażniki do rozszerzenia przez rolę 08 (docs/32 po zmianie z 21.10.2026)
Po wpisaniu W1–W3 i ZM-01…07 do `docs/32-wzorce-interakcji.md` testy przechodzą bez zmian (`tests/audit-m1-063-caps-separators.test.ts`, `tests/interaction-guards.test.ts`, `tests/close-button-guard.test.tsx`, `tests/swipe-delete.test.tsx`, `tests/interaction-patterns.test.tsx` — 118/118, 21.10.2026), bo kod jeszcze się nie zmienił; jedyny test czytający docs/32 to `audit-m1-063` (sekcja 28 — zdania, które sprawdza, zostały). Rola 08 rozszerza je w partii, która zmienia dane zachowanie (test najpierw czerwony):
- **`tests/interaction-guards.test.ts`**: S2 — lista dozwolonych plików z `headerLeft`/`headerRight` powiększona o nowe wspólne komponenty nagłówka (W1 a–c), każdy z `HeaderButton` 44 pt i `maxFontSizeMultiplier` 1,4 (jak dziś; patrz uwaga w §1 „Skala”); nowy strażnik: przycisk „Usuń {obiekt}” tylko przez wspólny komponent (`Btn danger` + `confirmDelete`), jeden na ekran, na ekranach z wz. 5; nowy strażnik tokenów (04-011): zakaz liczbowych `fontSize` i `borderRadius` poza `lib/theme.ts` i `lib/tokens.ts`, z listą wyjątków z powodem; S9 — słownik: „Zakończ serię” jedyną nazwą akcji pomiaru (ZM-05).
- **`tests/close-button-guard.test.tsx`**: jeśli menu „⋯” powstanie jako własny `<Modal>` (a nie `ActionSheetIOS`), wchodzi do listy okien z „Anuluj” po lewej; arkusz „Inny trening” — gest w dół (defekt 04-007).
- **`tests/swipe-delete.test.tsx`**: blok „bez przycisków „Usuń”” (decyzja z 07.10.2026, zastąpiona przez W2 21.10.2026) zamienić na test zgodności: na `/history/[id]`, `/template/[id]`, `/exercise/[id]` (własne), `/more/location/[id]` dokładnie jeden przycisk „Usuń {obiekt}”, który otwiera to samo okno (tytuł, [Anuluj, Usuń]) co gest z tabeli MIEJSC; na `/more/bodymass` i `/more/bands` „Edytuj” → przycisk usunięcia wiersza → to samo okno; w treningu nadal bez „− seria”. To zaostrzenie (nowa droga ma ten sam wynik co gest), nie osłabienie.
- **`tests/audit-m1-063-caps-separators.test.ts`**: lista plików z `upperText()` + plik tablicy (W3, wz. 28 pkt 4).
- Poza strażnikami docs/32: `tests/brand-tuleja.test.tsx` (paleta „Tuleja”, `F` → `FONT_FILES`, tło startu, akcent zegarka i widżetu — zastąpić testem systemu M3 z tymi samymi pytaniami na nowe wartości), `tests/audit-m1-031-contrast.test.tsx` (nowe palety HC), `tests/matrix-i18n.test.tsx` i `tests/i18n-wave4.test.ts*` (`FALLBACK_SCRIPTS` z greką i cyrylicą), `scripts/verify-native.mjs` (ikona zegarka 1088).
