# 17. Szablon jak trening, typy serii, gumy w miejscu (decyzje 05.10.2026)

Rozmowa 05.10.2026 po pierwszym treningu na wersji 409d768. Cytaty właściciela.

## 1. Szablon = nieaktywny trening
„Chciałbym, aby ćwiczenia w ekranie dodawania szablonu i ekranie aktywnego treningu miały te same funkcje i wyglądały tak samo.
Tworzenie szablonu to po prostu nieaktywny trening.” / „Co znaczy przy dodaniu ćwiczenia powtórzenia od, powtórzenia do? Powinno być
seria, ostatnio, powtórzenia, kg … Każda seria jako oddzielny wiersz.”

- Ćwiczenie w szablonie: wiersze serii jak w treningu (typ serii, „ostatnio”, powtórzenia, kg), bez odhaczania.
- Zakres powtórzeń: „Może linijka tekstu pod nazwą ćwiczenia z uzasadnieniem? … trening siłowy, rzeźbę i masę to różne zakresy
  powtórzeń … opcjonalnie przy kreowaniu szablonu wybór: cel treningowy (masa, rzeźba, siła, masa + siła i inne możliwe mixy) i zrobić
  research, jakie są najlepsze zakresy powtórzeń w tych opcjach”.
  - **Decyzja 05.10.2026 (po researchu zakresów):** „Bez celów na razie” — szablon jak trening (wiersze serii), bez celu i zakresów;
    podpowiedzi z „ostatnio”. Research zakresów zostaje: `docs/research/zakresy-powtorzen-cele-2026-10.md`.
  - (wcześniej rozważane) opcjonalny **cel treningowy szablonu** → zakres powtórzeń na ćwiczenie (podpowiedzi progresji) + linijka z uzasadnieniem
    pod nazwą ćwiczenia. Zakresy — z researchu (źródła naukowe), **otwarte** do zatwierdzenia przez właściciela.
- Otwarte: migracja obecnych szablonów (N serii + od–do → N wierszy), zmiana schematu danych (osobne wydanie, bez aktualizacji SDK).

## 2. Typy serii widoczne
„Gdzie są oznaczenia serii — dropsety i warmups? … ludzie nie znajdą drop setu czy innych ustawień serii, jeżeli będą ukryte pod cyfrą.”
Wybór: **„Przyciski dodawania + widoczna litera”** — pod ćwiczeniem „+ Seria”, „+ Rozgrzewka”, „+ Drop set”; w wierszu kolorowa etykieta
typu; zmiana typu istniejącej serii — dotknięcie etykiety (menu z nazwami). To samo w szablonie i w treningu.

## 3. Gumy w dodawaniu sprzętu
„Teraz w ustawieniach to oddzielny ekran. To powinno być w dodawaniu sprzętu, a posiadane poziomy od 1 do 7 jak ciężary w hantlach.”
Wybór: **„Poziomy w miejscu, kolory tam też”** — pod „Gumy oporowe” w miejscu przyciski 1–7 (jak lista ciężarów hantli), przy
zaznaczonym poziomie opcjonalna nazwa koloru. Ekran „Gumy” w Więcej znika (dane i historia zostają). Zastępuje zakres „od–do” z 7651f64.
- Wdrożenie: `LocEquip.levels` = lista poziomów; zaznaczenie poziomu bez gumy tworzy gumę; kolor wspólny dla miejsc (ta sama guma);
  usuwanie gum — „Usuń gumy…” pod gumami w miejscu (dawny ekran). Przycisk gumy w serii: tylko poziomy miejsca treningu; edytor historii —
  miejsce edytowanego treningu (audyt 7651f64 MEDIUM). Test: `tests/owner-0510c.test.tsx`.

## 4. Testerzy i publikacja
„Zrobimy TestFlight, ale jak uznam, że apka jest gotowa. Alternatywnie udostępnimy ją za darmo. Jak będzie zbierać słabe oceny przez
bugi, to możemy wycofać, a później dodać z nowymi featurami pod nową nazwą?”
- Ustalenie (do decyzji właściciela): App Store pozwala **wyzerować oceny** przy wydaniu nowej wersji (App Store Connect → „Reset summary
  rating”) — bez wycofywania. Ponowne wydanie tej samej aplikacji pod nową nazwą, by uciec od ocen, grozi odrzuceniem
  (wytyczne Apple 4.3 „spam” i 5.6 — manipulowanie ocenami). Bezpieczniej: TestFlight przed publikacją, potem wydanie stopniowe (phased release).

## Wdrożenie (05.10.2026)

- **Progresja** (właściciel: „niech w ustawieniach szablonu będzie się opcjonalnie dało wrzucić zakres i wtedy będą podpowiedzi”):
  zakres od–do przy ćwiczeniu szablonu jest opcjonalny („+ zakres powtórzeń”); bez zakresu — bez podpowiedzi „↑”. Nowe ćwiczenie w szablonie —
  bez zakresu. Istniejące szablony zachowują swoje zakresy (podpowiedzi działają jak dotąd).
- **Schemat 17:** `TemplateItem.rows` (typ, powtórzenia, ciężar, czas, dystans). Szablony sprzed 17 **bez zmian** (brak `rows` = `sets` zwykłych
  serii z `startWeight`; decyzja 03.10.2026 08:11 — aplikacja nie zmienia szablonów). Wiersze zapisują się dopiero przy edycji serii.
  `sets`, `startWeight`, `targetSec` liczone z wierszy (zamiana ćwiczenia, trening wstecz). Kopia 17 odrzucana przez wersję 16.
- **Start treningu:** typy serii z wierszy; serie robocze z „ostatnio” (jak dotąd), bez historii — plan z wiersza (także rozgrzewki i drop sety).
- **Ekran szablonu:** wiersze jak w treningu (etykieta typu — menu: typ albo usunięcie serii; „Poprzednio”; ciężar; powtórzenia/czas/dystans),
  „+ seria / + rozgrzewka / + drop set / − seria”, przerwa, opcjonalny zakres. Wspólna etykieta typu: `components/SetBadge.tsx`.
- Testy: `tests/template-rows.test.tsx`; dostosowane testy dawnych pól „serie”/„start kg” (flows B10, regress R2-24/R6-10/R49-06/R63-01/R71-07,
  audit-r82 MEDIUM 2, audit-r83 Q-021) i numeru schematu.

## Karty ćwiczeń w szablonie (06.10.2026)
Właściciel (zrzut ekranu szablonu): „niewygodne, że jak dodasz ćwiczenie, to ono zostaje takie rozwinięte … zmiana pozycji ćwiczenia na liście
jest za blisko X — łatwo je wyrzucić missclickiem”. Decyzje: **„Zwijane karty, jedna otwarta”** i **„Bez strzałek; »Usuń« w rozwiniętej karcie”**.
- Każde ćwiczenie to karta: zwinięta — nazwa i podsumowanie („3 serie · 8–12 · 120 s”), rozwinięta — wiersze serii, przerwa, zakres, superset i
  „Usuń ćwiczenie” (z potwierdzeniem) na dole. Otwarta jedna naraz; nowo dodane ćwiczenie otwiera się samo. Kolejność — tylko „≡ Kolejność”.
- Testy: `tests/template-cards.test.tsx`; dostosowane testy edytora (pomocnik `openCard`).

## Gumy w ćwiczeniach z oporem gumy (06.10.2026)
Właściciel: „ćwiczenia z band nie mają przy tworzeniu szablonu / przy pustym treningu wyboru zakresu gumy. Sprawdź wszystkie ćwiczenia z band
i upewnij się, że można wybrać gumy z zakresu 1–7.”
- Przyczyna: przycisk gumy był tylko przy asyście gumą (`bandAssistable`, np. podciąganie). W katalogu 34 ćwiczenia wymagają gum jako oporu
  (23 tylko z gumą, np. Band Pull Apart; 11 sztanga + gumy, np. Deadlift with Bands).
- Teraz `usesBand(ex)` = asysta albo wymaganie „bands”: przycisk gumy w treningu, edycji historii i wierszach szablonu (`TRow.bandId`);
  cykl przez gumy z poziomów miejsca (1–7). Test: `tests/band-exercises.test.tsx` (wszystkie ćwiczenia z gumą, pełne 1–7).
- **Otwarte (decyzja właściciela):** serie z gumą nie liczą się dziś do rekordów i podpowiedzi „↑” (guma traktowana jak asysta — obciążenie
  nieznane). Dla oporu gumy sensowne byłyby rekordy osobno dla każdego poziomu gumy.
