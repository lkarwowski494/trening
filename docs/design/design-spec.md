# System wyglądu — redesign M3, etap E3 (rola 04 build, 21.10.2026)

Stan: **propozycja do zatwierdzenia na STOP E3** (właściciel zatwierdza system i ikonę okiem). Kierunek A „tablica podejść”, wariant A2, krój Barlow Condensed, reguła pól serii: decyzje z 21.10.2026 (docs/18). Tabela „ekran AS IS → ekran TO BE” dla partii wdrożenia powstaje w E4.

## Pliki

| Plik | Co to jest |
|---|---|
| [`tokeny.ts`](tokeny.ts) | propozycja modułu motywu: palety (jasna, ciemna, obie „Zwiększ kontrast”), motyw A2, pismo, odstępy, promienie, rozmiary, ruch, mapa haptyki, ikony. Klucze kolorów jak w `lib/theme.ts`, więc wdrożenie to podmiana wartości plus klucze tablicy. |
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
- Skala (DEC-10): opisy rosną do 200%, liczby w polach do 130% z podglądem po przytrzymaniu, pasek zakładek, pasek tygodnia i pasek nawigacji do 125% (jak pasek zakładek iOS, z podglądem), cyfry tablicy dopasowane do szerokości (96 pt albo 24% szerokości ekranu albo 105% szerokości / liczba znaków — wygrywa najmniejsze, żeby „187,5 lb × 12” zmieściło się w jednym wierszu przy 320 pt). Duży tytuł: do 13% szerokości ekranu (w RN `adjustsFontSizeToFit`, uproszczenie), bo przy AX5 słowo „Προπόνηση” łamało się w środku.
- Wersaliki tylko w nazwie ćwiczenia na tablicy i w „Dziś: …” — jak nazwisko na tablicy podejść (IWF 3.3.6.15), przez `upperText()`; to rozszerzenie wyjątku DEC-17 (pytanie na STOP E3).

### Odstępy, promienie, rozmiary
- Jednostka 4 pt; margines ekranu 16, w grupie 8, między grupami 24.
- Promienie wg hierarchii (M1-036): grupa 12 › tablica 8 = przycisk 8 › pole 4 › znacznik 3; okrągłe: ±, „⋯”, ⓘ. Arkusze i okna — systemowe.
- Cel dotykowy ≥ 44 pt; przycisk główny 60, drugorzędny 52, ± 44, wiersz 52. Pola serii na tablicy nie są celem dotyku (minimum 36 × skala liczb) — do potwierdzenia.

### Ruch i haptyka
- Ruch: „Seria zrobiona” — tablica przewraca się na zegar (250 ms, ease-out), pole serii wypełnia się (120 ms); ± bez animacji. „Ogranicz ruch”: przenikanie 150 ms. Intro bez zmian (`lib/intro.ts`).
- Mapa haptyki (`HAPTICS`, ZM-07): każda haptyka zależy tylko od przełącznika „Wibracje”, każdy dźwięk tylko od „Dźwięk na koniec przerwy”. ✓ → lekkie stuknięcie; koniec przerwy → `notificationSuccess` + dźwięk; ± → `selection` (nowe); „Seria zrobiona” bez wartości → `notificationWarning` + ogłoszenie VoiceOver (nowe); usunięcie, zakończenie, błąd → bez haptyki (okno systemowe).

## 2. Komponenty
| Systemowe (standardowe zachowanie iOS) | Własne |
|---|---|
| pasek nawigacji z „‹ Wróć”, duży tytuł, pasek zakładek, arkusze z „Anuluj” po lewej, okna potwierdzeń (`lib/confirm.ts`), przełączniki, `Segmented`, pole wyszukiwania, menu „⋯”, listy grupowane, klawiatura numeryczna | **tablica „teraz”** (seria, przerwa, seria na czas), **tablica „Dziś”** na starcie, **pola serii**, przycisk ± o krok sprzętu, pasek tygodnia, motyw A2 (dekoracja), ikony 24/1,8 (M1-029) |

**Element firmowy — tablica „teraz”.** Dane: nazwa ćwiczenia, „seria n z m” (`counterLabel`), ciężar × powtórzenia (albo czas / dystans), jednostka z `wu()`/`distUnit()` (kg/lb, m/yd — DEC-28/29), pola wszystkich serii (zrobiona = wypełnienie, bieżąca = ramka bursztynowa, czekająca = kontur, rozgrzewka czekająca = kontur kreskowany; stan niesie kształt), w przerwie zegar i następna seria. **VoiceOver** (jeden element, rola obrazu z opisem): „Bench Press (sztanga), seria 3 z 4, 80 kilogramów razy 6. Serie: 2 z 4 zrobione” / „Przerwa, zostało 1 minuta 47 sekund z 2 minut 30. Następna: seria 4 z 4, 80 kg razy 6”; przy rozgrzewkach „Rozgrzewki: 3 z 3 zrobione; serie: 5 z 8 zrobione”, przy > 12 polach dopisek „lista serii przewijana”. Przyciski ± mają własne etykiety („Zwiększ ciężar o 2,5 kg”).

**Ikony (M1-029 / DEC-11).** Materiał z `origin/m3-wejscie/029-ikony` (`components/Icon.tsx`: pin, pauza, start, przerwa, słuchawki, głośnik, wyciszenie, „⋯”) pasuje do systemu bez zmian: siatka 24, linia 1,8, zaokrąglone końce, kolor z palety. Do dopasowania: ikony zakładek (`components/TabIcon.tsx`) na tę samą linię 1,8 i rozmiar 26; nowe ikony z makiet: lupa, strzałka „Wróć” (systemowa), filiżanka dnia odpoczynku (dziś). Gałęzi nie scalam.

## 3. Słownik interakcji (zgodny z docs/32; zmiany wzorców — tylko jako propozycje na STOP E3)
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

**Nowe teksty z makiet (do `lib/i18n` i tłumacza):** „Następne ćwiczenia” (nagłówek listy pod tablicą; istniejące „Dalej” znaczy „Continue”), „Następna: {x}”, „z {s}”, „Zacznij trening”, nagłówek „Ćwiczenie” w Postępach. Dla el w makiecie są propozycje, nie tłumaczenia.

## 6. Ikona, ekran startowy, intro
- **Rysunek bez zmian** (decyzja STOP E2). iOS: `assets/icon.png` 1024 RGB bez przezroczystości — `ikona.mjs` na `ikona/ikona.svg` daje kod 0 i ten sam obraz (różnice tylko w wygładzaniu krawędzi, maks. 20/255 na 8 pikselach); `icon-dark.png` i `icon-tinted.png` — obecne.
- **Zegarek: nowy plik `ikona/zegarek-1088.png`** (1088×1088, RGB, bez przezroczystości, kwadrat bez maski — HIG App icons: watchOS 1088×1088, kształt okrągły, „provide square layers so the system can create the circular icon shape”; odczyt 21.10.2026). Talerze mieszczą się w kole (najdalszy narożnik 53/60 promienia). **Konfiguracja:** `@bacons/apple-targets` 5.0.0 generuje ikonę zegarka zawsze w 1024 (`build/icon/with-ios-icon.js`, `generateWatchIconsInternalAsync`: `const size = 1024`), więc samo `icon:` w `targets/watch-app/expo-target.config.js` nie wystarczy. Wpięcie (rola 08): własny `AppIcon.appiconset` z plikiem 1088 i `"size": "1088x1088"` albo krok po prebuild; czy `actool` przyjmie 1088 w zestawie watchOS — `[DO USTALENIA]`, rozstrzyga przebieg `ios-unsigned.yml` (przebieg dowodowy CI, L-001).
- **Android:** nie wydawany przed decyzją po 8 tygodniach (DEC-26), a obecna konfiguracja (`android.adaptiveIcon.foregroundImage` = pełna ikona) działa bez nowych plików — warstwa przezroczysta i monochromatyczna zostają **otwarte** (ryzyko: maska Androida przytnie talerze; tani wariant z `pierwszy-plan.svg` w strefie 66/108).
- **Ekran startowy i intro:** rysunek i czasy bez zmian. Propozycja: tło ekranu startowego (`expo-splash-screen` `backgroundColor` i `dark.backgroundColor`) oraz tło intro = `bg` z tokenów (`#E6E8E5` / `#161C24` zamiast `#F4F3EF` / `#121316`), żeby po intro nie było skoku tła; ikona zachowuje papier.
- Ikona warstwowa `.icon` (Icon Composer, macOS): krok właściciela, warstwy w `ikona/`.

## 7. Kontrast
210 par (jasny, ciemny, oba HC): tekst ≥ 4,5, duży tekst i elementy ≥ 3; HC: tekst pomocniczy i akcent ≥ 7, elementy ≥ 4,5 (reguła M1-031). Wynik: wszystkie spełniają progi (kod 0). Przycisk ± na tablicy odróżnia kształt i ikona (para ikona/tło ± mierzona), nie barwa koła wobec tablicy. Szczegóły: `tokeny-kontrast.txt`.

## 8. Pomiar warsztatu (`warsztat.mjs`, 390 px, oba pliki makiet)
0 błędów. Ostrzeżenia: 15–18 wielkości i 7 kolorów tekstu — liczone łącznie z 8 ekranów i chromu makiety (pasek stanu 16 px), z cyframi tablicy dopasowanymi do szerokości (wartości ułamkowe); na jednym ekranie poziomów jest 4–6 zgodnie z `TYPE`. Odstępy 2 i 6 px pochodzą z chromu makiety (`kierunki/wspolne.css`: pasek stanu), nie z tokenów. Test mrużenia: na karcie „teraz” i przerwie punktem skupienia jest tablica; w Postępach wybrany chip konkuruje z wykresem (do obserwacji po wdrożeniu).
