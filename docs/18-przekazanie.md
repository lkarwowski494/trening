# 18. Przekazanie pracy do nowego czatu (06.10.2026, ok. 08:30 UTC)

Stan prac 06.10.2026. Przeniesienie do nowego czatu odwołane (właściciel 06.10: „Musimy zostać tutaj” — zwykły czat nie ma narzędzi
sesji Claude Code); plik zostaje jako punkt startowy na wypadek nowej sesji Claude Code. Nowa sesja zaczyna od tego pliku,
potem `CLAUDE.md`, docs/14 (E2), docs/15 (App Store / TestFlight), docs/17 (szablon jak trening), docs/09 (dziennik testów).

## Gałęzie i kod

- Praca: `feature/e2-swap` (od `integration/0.9.0`). Ostatni commit kodu: `70481ce` (przegląd spójności, partia 3).
- `npm run verify` na `70481ce`: 1156 testów — OK.
- E2E (Maestro, `e2e-ios.yml`) na `70481ce`: przebieg nr 56 (run 37434083110) — 7/7 zielony (06.10, 08:57 UTC); linia GOTOWE w docs/14 przesunięta.
- GOTOWE DO BUILDU w docs/14: `70481ce` (06.10). `integration/0.9.0` i **`main`** zawierają całą wersję 0.9.0 (polecenie właściciela 06.10:
  „Cała wersja na main”, wykonane 06.10 ok. 09:15 UTC). Scalenie z `main` dołączyło do `CLAUDE.md` zasadę „Merytoryczne podstawy”
  (04.10, wcześniej tylko na `main`) — obowiązuje: hierarchia źródeł, właściciel nie rozstrzyga kwestii merytorycznych.
- Schemat danych: SCHEMA_VERSION 17 (TemplateItem.rows). SDK bez zmian w tym wydaniu.

## Zrobione 06.10.2026

- Postępy: objętość per partia (ten tydzień vs poprzedni), jak serie per partia.
- Stopka w „Więcej”: tylko numer wersji, małym drukiem (decyzja właściciela).
- `tests/scenario-full.test.tsx` — scenariusz od świeżej instalacji do czyszczenia i przywrócenia z kopii (16 kroków).
- Przegląd spójności, partie 1–3 (szczegóły i testy: docs/09, `tests/xcheck-0610*.test.tsx`).
- CI: `testflight.yml` (narzędzia Apple, bez EAS) — sekrety sprawdzane na początku, identyfikatory klucza poza logami.
- Właściciel 06.10: sekrety `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8` są już dodane w GitHubie (nie weryfikowane przez agenta —
  pierwszy krok `testflight.yml` sprawdza ich obecność).

## Kroki właściciela przed pierwszym TestFlight (docs/15)

1. Rekord aplikacji w App Store Connect (identyfikator pakietu z `app.json`).
2. Klucz API z rolą **Admin** (App Manager nie utworzy certyfikatu dystrybucyjnego).
3. Po scaleniu do `main`: Actions → „TestFlight (testy wewnętrzne)” → Run workflow; po pierwszym przebiegu sprawdzić listę certyfikatów.

## Odpowiedź w sprawie Expo (06.10)

EAS (chmura Expo) nie jest potrzebny: repozytorium publiczne → darmowy macOS w Actions; `testflight.yml` buduje i wysyła narzędziami Apple.
Biblioteka Expo w aplikacji zostaje. Propozycja (decyzja właściciela otwarta): A — usunąć `iphone-eas.yml`, `iphone-local.yml`, `eas.json`
i skrypty EAS po pierwszym udanym TestFlight (rekomendacja); B — zostawić jako zapas do 01.11.2026. Zmiana `CLAUDE.md` tylko za zgodą właściciela.

## Otwarte decyzje właściciela (pierwsza opcja = rekomendacja agenta)

1. Potwierdzanie usunięcia serii (dziś trzy różne reguły): A pytać tylko o serię odhaczoną / z wartościami — wszędzie; B bez pytania + „Cofnij”; C zawsze pytać.
2. Notatka/RPE w wierszach szablonu: A bez; B notatka przy wierszu.
3. Zamiana ćwiczenia w szablonie: A „⇄ zamień” z zachowaniem serii i supersetu; B usuń + dodaj (jak dziś).
4. Miejsce w treningu wstecz: A wybór miejsca + 📍 w szczegółach sesji; B miejsce główne (jak dziś).
5. Kolejność i superset w edytorze historii: A bez; B dodać.
6. Smith: A osobny rodzaj ciężaru (gryf + talerze); B lista jak maszyna.
7. Presety kettli: A bez (zasada „tylko zweryfikowane modele”); B „typowy zestaw”.
8. Jednostka w CSV: A kolumna z jednostką na końcu; B nagłówek „Weight (kg/lb)”.
9. Uśpiony kod (przypomnienie o ważeniu, moduły, poranki): A usunąć; B zostawić.
10. Scenariusze E2E 08–10 (wiersze szablonu, język + wygląd, gumy; ok. +10 min przebiegu): A dodać; B nie.

Inne otwarte: rekordy per poziom gumy oporowej; zakresy powtórzeń wg celu treningowego (odłożone); presety stacji o niepełnych danych;
„Powtórz ostatni” a zamienione ćwiczenie (swappedFrom) — do zbadania przed propozycją.

## Decyzje właściciela po przekazaniu

- 06.10.2026: etykiety supersetów po 26 grupach zaczynają się od „A” — **zostaje** (wariant A: „nikt nie robi 27 supersetów”);
  test `tests/matrix-logic.test.tsx` (`groupLabels`) sprawdza zakres A–Z.
- 06.10.2026: scenariusze E2E 08–10 (wiersze serii w szablonie, język + wygląd, gumy) — **wdrażać** (wariant A).
- 06.10.2026: nazwa aplikacji (decyzje z sesji „Nazwa aplikacji treningowej”, 05.10, potwierdzone przez właściciela 06.10) — **najpierw nazwa,
  potem pierwszy TestFlight** (wariant B). Gryf bez talerzy = ciężary nieznane (wariant A, wdrożone f59d36e).
- 06.10.2026: testy przy każdym wypchnięciu — **wariant A**: `tests.yml` (verify na każdej gałęzi), E2E samo na `main` i `integration/**`.
- 06.10.2026: krój pisma dla bg/sr/uk — **wariant A**: IBM Plex Sans (Archivo nie ma cyrylicy); hiszpańska zakładka — **wariant A**: „Entreno”.
- 06.10.2026: cel przychodu ~2000 zł/mies., model 30 dni za darmo + jednorazowa płatność (rachunek w docs/15).
- 06.10.2026: powtórzone identyfikatory w imporcie — **wariant A**: przy wczytaniu powtórzony id dostaje nowy (`uniqueIds` w `migrate`), nic nie ginie.
- 06.10.2026: import treningu z niemożliwą datą (np. 30.02) — **wariant A**: zostaje jak jest (wczytuje się z najbliższą prawdziwą datą, bez ostrzeżenia).
- 06.10.2026: model płatności — **subskrypcja roczna odnawiana automatycznie, 29 zł/rok, miesiąc za darmo** (wariant A; zastępuje jednorazową płatność; docs/15).
