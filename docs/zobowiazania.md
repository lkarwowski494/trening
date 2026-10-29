# Zobowiązania na przyszłość — rejestr akcji z warunkiem startu

Decyzja właściciela 28.10.2026 (~22:00 UTC): akcje zaplanowane na później (po dacie albo po zdarzeniu, np. „po wydaniu 1.0”) żyją **tutaj**,
a nie w pamięci sesji. Każda sesja przed ułożeniem planu czyta sekcję „Aktywne” (CLAUDE.md; hak startu sesji wypisuje ją automatycznie)
i **nie układa planu od nowa** — wykonuje to, co ma spełniony warunek, a nowe ustalenia dopisuje tu od razu.

Zasady:
- Jeden wiersz = jedna akcja. Pola: **Kiedy** (data `RRRR-MM-DD` albo zdarzenie), **Akcja**, **Decyzja** (data i miejsce zapisu, zwykle docs/18 albo docs/48),
  **Kto** (rola/sesja albo właściciel), **Stan** (`czeka` / `w toku` / `zrobione RRRR-MM-DD` + dowód).
- Zrobione wiersze przenosimy do „Archiwum” (dokument roboczy krótki — tylko stan bieżący).
- Akcja z datą dostaje też zaplanowane zadanie (budzik) w sesji koordynatora; ten plik pozostaje źródłem prawdy.
- Zmiana albo anulowanie akcji = decyzja właściciela z datą (wpis w docs/18), potem zmiana wiersza tutaj.
- Kroki zgłoszenia 1.0 mają własną listę ze stanem (`docs/48`, kolumna „Stan”) — tu tylko odwołanie, bez powielania.
- Backlog bez terminu i warunku (`docs/21`) tu nie trafia; trafia akcja, która ma **kiedy**.

## Aktywne

| ID | Kiedy | Akcja | Decyzja | Kto | Stan |
|---|---|---|---|---|---|
| ZB-001 | rano 29.10.2026 | Weto lub zatwierdzenie decyzji nocnych agentów: #84 (JM Press i Decline Close-Grip Bench To Skull Crusher bez rysunku w 1.0), zmiany słów kluczowych z odświeżenia metadanych, inne wyjątki „decyzja agenta w nocy” w docs/18 | nocny tryb napraw, właściciel 28.10.2026 ~20:00 i ~20:35 UTC (docs/18) | właściciel, koordynator podaje listę | czeka |
| ZB-002 | po ogłoszeniu „main kandydat <SHA>” | Build `testflight.yml` na SHA kandydata (czeka na zatwierdzenie `release`; w nocy 28/29.10 bez powiadomień — właściciel zatwierdza po 06:00 UTC); równolegle zrzuty 35 języków i zegarka **na tym samym SHA** (zmiana `main` po kandydacie = zrzuty od nowa) | właściciel 28.10.2026 (~20:00 „powiadom mnie w nocy”, zmienione ~22:10 „nic do 6”; ~21:35 „zrzuty z finalnej wersji”) | koordynator przeglądów | czeka |
| ZB-003 | po buildzie kandydata | Kroki właściciela do zgłoszenia 1.0 po kolei: docs/48 Z-08, Z-09, Z-16 (akceptacja zrzutów), Z-14, Z-24, Z-25, Z-25a, Z-26, Z-28, Z-29 | docs/48 (kolumna „Stan” = źródło) | właściciel, prowadzi koordynator krok po kroku | czeka |
| ZB-004 | po wysłaniu 1.0 do recenzji Apple | Przygotowanie przeniesienia do Apps4Brew: konfiguracja `scripts/przeniesienie-1.0.json` wg D1–D7, klasyfikacja plików dodanych po 21.10, poprawa 13 testów czytających usuwane pliki i nazw w dokumentach; podgląd `node scripts/przeniesienie-1.0.mjs --zachowaj --testy` bez błędów | właściciel 28.10.2026 ~21:55 UTC, wariant B (docs/46) | koordynator | czeka |
| ZB-005 | po wydaniu 1.0 w App Store | Przeniesienie do `Apps4Brew/trening` (jeden commit, stare repo prywatnym archiwum), potem transfer `apps4brew-narzedzia`; kroki właściciela 1–5 z docs/46 pkt 3 (można wcześniej, w czasie recenzji) | D7 A 21.10.2026 (docs/46); zasada „repo na koncie właściciela do wydania na produkcji” 28.10.2026 ~21:50 UTC | właściciel + koordynator | czeka |
| ZB-006 | po wydaniu 1.0, pierwszy dzień | Ekran zakupu z App Store (polskie konto) pokazuje 4,99 zł / 19,99 zł / 59,99 zł | docs/48 Z-36 | właściciel (telefon, 2 min) | czeka |
| ZB-007 | po wydaniu 1.0 | Scalenie linii 1.0.1 (`wersja-1-0-1-r2`) do `main` na polecenie właściciela; wydanie 1.0.1 stopniowe 7 dni | docs/48 Z-34; CLAUDE.md (scalenie do main na polecenie) | sesja 1.0.1 + właściciel | czeka |
| ZB-008 | po wydaniu 1.0 | Etykiety dostępności w App Store Connect (opcjonalne) | docs/48 Z-33 | właściciel | czeka |
| ZB-009 | po wydaniu 1.0 | Test pierwszego użycia z 3–5 osobami bez instrukcji (część B) | docs/48 Z-37 (DEC-07 b, 27.10.2026) | właściciel | czeka |
| ZB-010 | 1.0.x, przy aktualizacji SDK | `decode-uri-component` ≥ 0.5 (podatność GHSA-vcc3-ghjq-m6fr; wymuszenie wersji nie zadziałało) — razem z `expo-router` z nowego SDK, nie razem ze zmianą schematu danych | właściciel 28.10.2026 ~19:10 UTC, wariant A (docs/18, docs/21) | sesja 1.0.1 / kolejna linia | czeka |
| ZB-011 | 1.0.x | Automat odczytu cen wszystkich terytoriów (porównanie z espresso) | właściciel 28.10.2026 ~18:20 UTC, Z-10b A (docs/18) | koordynator | czeka |
| ZB-012 | 2026-12-26 | Ocena hipotez widoczności H-51 ≥ 50%, H-52 ≥ 30%, H-53 ≥ 40% z App Analytics | docs/45 (decyzja 21.10.2026) | agent przygotowuje dane, właściciel ocenia | czeka |
| ZB-013 | 8 tygodni po premierze 1.0 | Punkt kontrolny W0 (pobrania, płacący); decyzja o Androidzie (DEC-26); odświeżenie bramki opłacalności Kalisteniki danymi Treningu (Kalistenika DK-03 A) | docs/48 Z-35; Kalistenika `docs/decyzje.md` | agent przygotowuje dane, właściciel decyduje | czeka |
| ZB-014 | po wydaniu 1.1 | Wydzielenie wspólnego silnika (katalog ćwiczeń, figury v2, zapis, zegarek, Zdrowie) jako pakietu dla Kalisteniki | właściciel 26.10.2026 (docs/18) | koordynator / architekt | czeka |
| ZB-015 | gdy właściciel ma zegarek | Ikona aplikacji na zegarku (zamyka resztę R-013) | docs/40 R-013, docs/48 Z-08 | właściciel | czeka |

## Archiwum

| ID | Kiedy | Akcja | Stan |
|---|---|---|---|
