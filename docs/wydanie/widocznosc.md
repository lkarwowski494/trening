# Widoczność w sklepie — przebieg M5 22.11.2026 (raport końcowy, E4)

Sesje AL (E0, diagnoza) i AL2 (E1–E4). Gałąź `aso/pozycjonowanie-1-2`. Metadane w repo: 8cd54167 (`store/app-store-names.json`, `store/app-store-metadata.json`,
`store/asc-kontrola-oczekiwane.json`). **Nic nie wysłano do App Store Connect** — wysyłka z najbliższą wersją i scalenie tylko za osobną zgodą właściciela.
Raport roli trzymamy tutaj, a nie w katalogu `audit/`, którego w repo nie ma; surowe wyniki z nazwami innych aplikacji zostały poza repo.

## Pokrycie storefrontów

Przed i po: **174 ze 175 storefrontów ma stronę w języku domyślnym** (brak tylko Chin) — przebieg nie dodaje ani nie usuwa lokalizacji strony
(`pozycjonowanie-stop1.md` § 2; 33 lokalizacje w repo, 32 w sklepie, słoweński tylko w repo — L-003). Ustalenia z badania 22.11: pola ru działają także w UA,
w KZ lokalizacja ru nie jest widoczna; lokalne słowa działają w krajach, gdzie język lokalny jest tylko dodatkowy (diagnoza, przyczyna 5).

## Zmiany pól (decyzje KO-110…KO-115, docs/18 22.11.2026)

- Nazwy: zmiana członu po „RepsGoat: ” w 22 lokalizacjach (w tym EN „Progressive Overload”); bez zmian pl, ro, ru, de-DE, nl-NL, zh-Hant, sl.
- Podtytuły i słowa kluczowe: wszystkie 33 lokalizacje (EN „Gym Rest Timer & Log”; w EN zostają „repgoat” i „offline” — KO-115).
- Kategoria: bez zmian (Health & Fitness, bez dodatkowej). Zrzuty: bez zmian (żadna grupa nie znalazła powodu).
- Wartości i dowody: `pozycjonowanie-stop2.md` (tabela po krytyce) i `pozycjonowanie-nazwa-en.md`; po recenzencie lokalizacji poprawione podtytuły ro, pt-PT,
  pt-BR, fr-FR, id i słowa hu, pt-BR, fr-FR, id (stan końcowy — pliki `store/`).
- Kontrole: limity i reguły słów — `tests/store-metadata.test.ts`, `tests/nazwa-repsgoat.test.ts` (zielone 22.11); `verify:lekkie` zielone (4ab462a6).
  Narzędzie `sprawdz-wydanie.mjs` roli 10 nie dotarło do sesji — zamiast niego te same reguły w testach i skrypcie kontroli przebiegu.
- Krytyka: 8 pól do zmiany i 13 niepewnych — przyjęte w STOP 2; recenzent lokalizacji: 6 poprawek przyjętych, 4 pytania do rodzimych użytkowników
  (vi „Tập gym tại phòng”, es-MX „entreno”, hr „tajmer”, ms „Bina Otot”) — otwarte, do przeglądu tłumacza albo testera z kraju.

## Hipotezy pomiaru (propozycja; progi do decyzji właściciela przy odczycie stanu wyjściowego)

Pomiar 8 tygodni po wydaniu wersji z nowymi polami (KO-100), dane z API App Store Connect (automat sesji AM, KO-105). H-51…H-53 (docs/45) zostają aktywne
do oceny; nowe zastępują je po tej ocenie (najwyżej 3 aktywne).

| ID | Hipoteza | Metryka (nazwy Apple) | Porównanie | Próg |
|---|---|---|---|---|
| H-54 | Frazy z popytem w nazwach dają wyświetlenia z wyszukiwania poza PL | Impressions (Unique Devices), źródło App Store search, suma 31 storefrontów bez PL | 8 tyg. po wydaniu vs 8 tyg. przed | **[DO USTALENIA]** po odczycie stanu wyjściowego |
| H-55 | Nazwa EN „Progressive Overload” + podtytuł „Gym Rest Timer & Log” daje wejście w wyniki EN | jw. dla US, GB, AU, CA; dodatkowo pozycja w API wyszukiwania na „progressive overload” i „gym rest timer” | jw.; pozycja: przed > 200 | **[DO USTALENIA]** |
| H-56 | Nowe słowa PL nie psują rynku głównego | First-Time Downloads, źródło App Store search, PL | jw. | **[DO USTALENIA]** (np. bez spadku) |

Mierzalność: dane od 5 pierwszych pobrań w okresie (Metric definitions, odczyt 22.11.2026). Przy H-54 i H-55 ruch może zostać poniżej progu udostępnienia danych
— wtedy zostaje sygnał pozycji z API wyszukiwania.

## Plan narzędzi po wydaniu

| Narzędzie | Warunek startu |
|---|---|
| Niestandardowe strony produktu | ruch z kanału spoza wyszukiwania (link kampanii, twórca) w danym kraju albo druga praca aplikacji; nie przed H-54 |
| Testy strony produktu | wyświetlenia wystarczające do oszacowania czasu testu w App Store Connect; przy obecnym ruchu nie zdąży — najpierw tekst i zrzuty |
| Wydarzenia w aplikacji | rezygnacja (KO-100); powrót tylko z prawdziwą nowością ograniczoną w czasie |

## Kroki właściciela

1. Zgoda na wysyłkę pól z najbliższą wersją (nazwę zmienia się z nową wersją — App information, cytat w `pozycjonowanie-stop1.md`); zapis `scripts/asc/metadane.mjs`
   jak przy 1.1. Rekomendacja: (a) z najbliższą wersją; (b) osobna wersja tylko z metadanymi — build i recenzja Apple dla samych pól.
2. Zgoda na scalenie gałęzi (`scripts/scal-galaz.mjs` po zielonym `tests.yml`).
3. Progi H-54…H-56 po odczycie stanu wyjściowego (automat AM).

## Nie sprawdzono

Wyszukiwarka sklepu 1:1, pozycje po zmianie, liczby wyszukań, fr-CA, NZ, BY/AM/UZ, łączenie liczby mnogiej i akcentów przez Apple (szczegóły w `pozycjonowanie-stop2.md`).
