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
  - Kierunek: opcjonalny **cel treningowy szablonu** → zakres powtórzeń na ćwiczenie (podpowiedzi progresji) + linijka z uzasadnieniem
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

## 4. Testerzy i publikacja
„Zrobimy TestFlight, ale jak uznam, że apka jest gotowa. Alternatywnie udostępnimy ją za darmo. Jak będzie zbierać słabe oceny przez
bugi, to możemy wycofać, a później dodać z nowymi featurami pod nową nazwą?”
- Ustalenie (do decyzji właściciela): App Store pozwala **wyzerować oceny** przy wydaniu nowej wersji (App Store Connect → „Reset summary
  rating”) — bez wycofywania. Ponowne wydanie tej samej aplikacji pod nową nazwą, by uciec od ocen, grozi odrzuceniem
  (wytyczne Apple 4.3 „spam” i 5.6 — manipulowanie ocenami). Bezpieczniej: TestFlight przed publikacją, potem wydanie stopniowe (phased release).
