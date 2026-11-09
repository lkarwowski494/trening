# Ekran „Trening” nowej osoby — AS IS (linia 1.1, 05.11.2026)

Rola 04 (Studio Projektowe), moduł „przepływy i gesty”, tryb build dla istniejącej aplikacji. Zadanie właściciela (05.11.2026): zakładka Trening,
którą widzi nowa osoba przed pierwszym treningiem, ma być „bardziej wow” — to pierwsze, co widać po instalacji.

**Obraz aplikacji:** eksport Expo web z gałęzi `ui/ekran-startowy-1-1` (od `origin/integracja-1-1`), Playwright, 390 × 844, motyw ciemny
(domyślny dla nowej instalacji — `lib/seed.ts:278`, `theme: 'dark'`), pusty `localStorage` = nowa osoba. Zrzuty: `zrzuty/as-is-*.png`.
Ograniczenia Expo web: krój treści zastępczy zamiast SF Pro; okna `Alert.alert` (np. „Zakończyć trening?”) w web się nie pokazują — kroki z oknem
opisane z kodu (`components/ActiveWorkout.tsx:127-167`). Gestów web nie odtwarza; ten ekran gestów nie ma (poza arkuszem „Inny trening”, `components/StartPanel.tsx:42-47`).

**Kontekst (E0b):** nowa osoba tuż po instalacji, zwykle w domu albo w szatni, ręce wolne, oczy wolne, pierwsza sesja kilka minut. Nie zna słów
„szablon”, „plan tygodnia”, „deload”. Chce zobaczyć, czy aplikacja jest dla niej, i zacząć. Ekran ogląda raz uważnie (10–30 s), nie z 1–2 m jak tablicę w trakcie serii.

## Stan ekranu nowej osoby (dziś)

![start](zrzuty/as-is-1-01-start.png)

Od góry (`app/(tabs)/index.tsx:41-54`): tytuł „Trening” + mała ikonka sztangi (`components/Motif.tsx:94`, `lib/tokens.ts:68` MOTIF.where), data
(szara, `index.tsx:47`) → duży przycisk „Pusty trening / ćwiczenia dodasz w trakcie” (`components/StartPanel.tsx:31`, `lib/home.ts:48`) → „Inny trening”
→ karta „Pierwsze kroki”: 4 kroki, 4 przyciski i zdanie o miejscach (`components/Dashboard.tsx:95-120`). Karta „Dziś” z paskiem tygodnia
nie istnieje dla nowej osoby (`components/TodayPlan.tsx:35`: bez planu i treningów `return null`), „Ten tydzień” też nie (`Dashboard.tsx` WeekStats, `if (!last) return null`).

**Prawdziwe dane, które aplikacja ma o nowej osobie** (sprawdzone w kodzie): dzisiejsza data i bieżący tydzień pon–niedz (`lib/dashboard.ts` weekStrip
działa bez planu — dni „wolne”); stan kroków (`lib/dashboard.ts` firstSteps: szablon tak/nie, plan tak/nie); ustawienia: jednostka `kg`, motyw, miejsca `[]`
(`lib/seed.ts:278`); biblioteka ćwiczeń (podstawowe + 403 niszowe ukryte, komunikat w wyborze ćwiczenia); licznik darmowych dni (`StartPanel.tsx:68`,
tylko przy włączonym przełączniku dostępu). **Nie ma:** szablonów (`templates: []`, `lib/seed.ts:322`), planu, historii, miejsc.

## Przepływ 1 — od otwarcia do pierwszego zapisanego treningu (najkrótsza ścieżka)

| # | Ekran → działanie → co widać | Zrzut | P1 | P2 | P3 | P4 | Wynik |
|---|---|---|---|---|---|---|---|
| 1 | Start → „Pusty trening” → ekran treningu z „+ Dodaj ćwiczenie” | as-is-1-01, as-is-1-02 | **nie** — karta „Pierwsze kroki” zaczyna od „Utwórz pierwszy szablon”, więc nowa osoba uznaje, że trening wymaga szablonu, i idzie dłuższą drogą | tak (duży, u góry) | **nie** — słowo „Pusty” nie mówi „zacznij”; dla osoby z planem ten sam przycisk mówi „Start: …” | tak (licznik czasu) | **porażka** |
| 2 | Trening → „+ Dodaj ćwiczenie” → wybór ćwiczenia | as-is-1-03 | tak | tak | tak | tak | zaliczony (wzorzec platformy: lista + wyszukiwanie) |
| 3 | Wybór → stuknięcie ćwiczenia → tablica „seria 1 z 1”, pola „—” | as-is-1-04 | tak | tak (nazwy angielskie, filtr „Podstawowe”) | tak | tak | zaliczony |
| 4 | Tablica → „Seria zrobiona” bez wartości → kursor w pustym polu kg (projekt ZM-01) | as-is-1-05 | tak | tak | tak | tak (ramka pola) | zaliczony |
| 5 | Wpis kg i powtórzeń → „Seria zrobiona” → przerwa, „Wszystkie serie odhaczone”, „Zakończ trening” | as-is-1-06, as-is-1-07 | tak | tak | tak | tak | zaliczony |
| 6 | „Zakończ trening” → okno „Zakończyć trening? Zapisane zostaną serie robocze: 1.” → „Zakończ” | (z kodu, `ActiveWorkout.tsx:166`) | tak | tak | tak | tak | zaliczony (wzorzec platformy) |
| 7 | Powrót na Start: „Pierwsze kroki” znikają w całości, pojawia się „Ten tydzień” | (z kodu, `lib/dashboard.ts:39-41` firstSteps) | tak | — | — | **nie** — krok 3 nigdy nie dostaje „✓”, lista znika bez domknięcia; niezrobiony krok 2 (plan) też znika | **porażka** |

**Koszt:** 7 kroków · ok. 10 stuknięć (Pusty trening, Dodaj ćwiczenie, ćwiczenie, pole kg, pole powt., Seria zrobiona, Zakończ trening, Zakończ) ·
2 pola · 2 decyzje (które ćwiczenie, jaki ciężar) · 3 zmiany ekranu · 0 rzeczy do zapamiętania.

## Przepływ 2 — od otwarcia do ustawionego planu tygodnia

| # | Ekran → działanie → co widać | Zrzut | P1 | P2 | P3 | P4 | Wynik |
|---|---|---|---|---|---|---|---|
| 1 | Start → krok 1 „Szablony i plan” → Planowanie: nazwa planu, „Szablony”, „Wygeneruj…”, 7 dni „Wolne ▸” | as-is-2-02 | tak | tak | tak | tak | zaliczony |
| 2 | Planowanie → „+” w nagłówku (osoba szuka „utwórz szablon”) → „Nowy plan” zamiast szablonu | (tekst przebiegu) | tak | tak | **nie** — „+” tworzy plan (`app/plan.tsx:117`), a krok 1 obiecał szablon | tak | **porażka** |
| 2′ | Planowanie → stuknięcie dnia („czwartek”) → „Nie masz jeszcze szablonów. + Nowy szablon / Szablony ›” | as-is-2-04 | tak | **nie** — wiersz dnia nie wygląda na wejście do tworzenia szablonu | tak | tak | **porażka** (ścieżka najkrótsza jest ukryta) |
| 3 | „+ Nowy szablon” → edytor: Nazwa, Folder, Notatka, „+ Dodaj ćwiczenie” | as-is-2-05 | tak | tak | tak | tak | zaliczony |
| 4 | „+ Dodaj ćwiczenie” → wybór → ćwiczenie z 3 seriami „—” | as-is-2-06 | tak | tak | tak | tak | zaliczony |
| 5 | „Zapisz” → szczegóły szablonu („Nowy szablon”, Start, Duplikuj…) zamiast planu | as-is-2-07 | tak | — | — | **nie** — nie widać, że czwartek dostał szablon | **porażka** |
| 6 | Wstecz → Planowanie „czwartek: Nowy szablon ▸”, „✓ Aktywny plan” | as-is-2-08 | tak | tak | tak | tak | zaliczony |
| 7 | Wstecz → Start: pasek tygodnia, tablica „DZIŚ: NOWY SZABLON”, „Start: Nowy szablon”, kroki 1–2 z „✓” | as-is-2-09 | — | — | — | tak | zaliczony — **tu pojawia się element firmowy** |

**Koszt:** 7 kroków · 8–9 stuknięć · 0–1 pole (nazwa opcjonalna; bez niej „Nowy szablon” trafia na tablicę) · 3 decyzje (dzień, ćwiczenie, nazwa) ·
5 zmian ekranu · 1 rzecz do zapamiętania (który dzień przypisano, krok 5).

Stan pośredni „szablon bez planu” (`lib/home.ts:49-50`, `kind: 'next'`): duży przycisk „Start: Nowy szablon · 1 ćw.”, krok 1 z „✓”, bez paska tygodnia
i bez tablicy — zrzut `zrzuty/as-is-3-start-szablon-bez-planu.png`.

## Tarcia

| ID | Krok | Dowód | Heurystyka Nielsena | Realność | Poziom |
|---|---|---|---|---|---|
| ST-01 | P1/1 | Dwie konkurencyjne drogi do pierwszego treningu: duży „Pusty trening” i krok 1 „Utwórz pierwszy szablon” (`Dashboard.tsx:109`, `StartPanel.tsx:31`). Kolejność kroków sugeruje, że trening wymaga szablonu. | 2 (zgodność ze światem: „pusty”), 8 | realne | P2 (2) |
| ST-02 | ekran | Najcięższa rzecz na ekranie to karta kroków: 4 przyciski i odnośnik tej samej wagi pod przyciskiem startu (`Dashboard.tsx:107-118`). Test mrużenia: punkt skupienia rozbity na 6 plam. | 8 | realne | P2 (2) |
| ST-03 | ekran | Element firmowy (tablica, pasek tygodnia z ikonami dni) pojawia się dopiero po planie (`TodayPlan.tsx:35`). Nowa osoba widzi ekran bez tożsamości aplikacji — mała ikonka przy tytule to jedyny ślad (SP-02). To jest sedno „mało wow”. | — (SP-02) | realne | P2 |
| ST-04 | P2/2 | „+” w nagłówku Planowania tworzy plan, nie szablon (`app/plan.tsx:117`); przycisk kroku 1 nazywa się „Szablony i plan”. | 4 | realne | P2 (2) |
| ST-05 | P2/2′ | Najkrótsza droga (dzień → „+ Nowy szablon”) jest ukryta w rozwinięciu wiersza dnia. | 6 | realne | P2 (2) |
| ST-06 | P2/5 | Po „Zapisz” edytor przechodzi do szczegółów szablonu, nie wraca do planu — przypisania dnia nie widać. | 1 | brzegowe | P2 (1) |
| ST-07 | P1/7 | Po pierwszym treningu karta znika bez domknięcia (krok 3 nigdy „✓”, niezrobiony krok 2 bez śladu poza „Ustaw plan” w tytule). | 1 | realne | P2 (2) |
| ST-08 | P1/1 | Krok 3 opisuje interfejs („duży przycisk … u góry”) i ma przycisk „Przewodnik” zamiast działania; dwa przyciski kroków 1 i 2 prowadzą w to samo miejsce (`/plan`). | 8, 4 | realne | P2 (1) |
| ST-09 | ekran | Data — jedyna prawdziwa informacja dnia — jest najmniejszym, szarym tekstem (`index.tsx:47`). | 8 | realne | P2 (1) |

Bez P0/P1: przepływy kończą się sukcesem, dane są bezpieczne. Poziomy wg skali Nielsena w nawiasie. Znaleziska z tego pliku są wejściem do `to-be.md`.
