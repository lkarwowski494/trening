# Linia bazowa całości (E0b) — Trening — 2026-10-27
Commit: 025a50b9 · Autor: M1 (sam, soczewki po kolei; soczewki-subagenci w partii 1) · Zapisana PRZED lekturą BRD, ADR, docs/18 i kodu aplikacji.
O aplikacji przeczytano tylko: opis w sklepie (store/app-store-metadata.json, lokalizacja pl) i nagłówek kontekstu od właściciela.
Nazwy innych aplikacji pominięte (CLAUDE.md, repo publiczne): alternatywy oznaczone A, B, C z adresem strony App Store (odczyt 27.10.2026, curl; surowe strony w scratchpadzie, poza repo).

## Główne prace użytkownika
1. W trakcie treningu na siłowni/w domu: szybko odhaczyć serię (ciężar × powtórzenia), odliczyć przerwę, zobaczyć następne ćwiczenie — jedną ręką, z zablokowanym ekranem, przy dużym tekście, z zegarkiem.
2. Między treningami: ułożyć i zmienić plan (szablony, tydzień), dopasować do dostępnego sprzętu.
3. Widzieć postęp (rekordy, e1RM, objętość) — liczby muszą być poprawne (błędna liczba = błędna decyzja treningowa).
4. Nie stracić historii — lata zapisów to główny kapitał użytkownika (skargi u konkurencji: zniknięta historia).
5. Zapłacić uczciwie: wiedzieć, ile i w jakiej walucie płaci, co dostaje i co ma po zakupie.

## Alternatywy czytane dziś (27.10.2026)
| Alt. | Adres | Ocena (PL / US) | Cena (PL, z karty sklepu) | Najczęstsze skargi (RSS recenzji, ≤2★) |
|---|---|---|---|---|
| A | https://apps.apple.com/pl/app/id464254577 | 4,9 (1,5 tys.) / 4,9 (109 tys.) | 17,99–499,99 zł (subskrypcje + dożywotni) | zegarek: zła synchronizacja, dublowane serie, gorszy timer po aktualizacji; zniknięta historia; limit 3 szablonów bez płatności; logowanie do konta |
| B | https://apps.apple.com/pl/app/id1458862350 | 4,9 (4,4 tys.) / 4,9 (100 tys.) | 14,99–429,99 zł | w próbce PL brak ≤2★; US: obciążenie CPU/przegrzewanie |
| C | https://apps.apple.com/pl/app/id1434229662 | 5,0 (25) / 4,9 (3,7 tys.) | 63,00–449,00 zł | cena za wysoka, prośba o płatność jednorazową |
| bez aplikacji | notes/arkusz | — | 0 zł | brak timera, brak wykresów; za to zero ryzyka utraty i zero kosztu |

Wniosek: kategoria dojrzała, liderzy 4,9★; różnicują się (1) niezawodność zegarka i synchronizacji, (2) bezpieczeństwo historii, (3) uczciwość modelu płatności (limity darmowej wersji są główną skargą), (4) prostota. Trening celuje w: offline bez konta, niski próg cenowy (espresso), płatność dożywotnia — zgodne z (3).

## Ograniczenia dziedziny i platformy (do potwierdzenia przez role, źródła szczebla 1 czytane w E1)
- App Store Review Guidelines 3.1.1/3.1.2 (zakupy w aplikacji, subskrypcje: jasna cena i okres przed zakupem), 2.3 (zgodność opisu z działaniem), 5.1 (prywatność, HealthKit: dane zdrowotne nie do reklam/iCloud bez zgody). [DO USTALENIA: numery i brzmienie czyta rola 10 w dniu audytu.]
- StoreKit: cena wyświetlana powinna pochodzić z Product.displayPrice storefrontu użytkownika (odczyt dokumentacji: rola 02/10).
- Dynamic Type do rozmiarów dostępności — HIG; bariera dostępności = próg wydania w CLAUDE.md.
- Dziedzina: e1RM, objętość, progresja, RPE/RIR, wskazówki techniki — twierdzenia muszą mieć źródła (hierarchia CLAUDE.md); animacje/karty ćwiczeń — bramka 4 recenzji (CLAUDE.md 27.10).

## Obszary krytyczne
dane (zapis, migracja, kopia, import CSV, „wyczyść wszystko”), pieniądze (paywall, waluta, przywracanie, Family Sharing, limit 5 dni), prywatność (HealthKit, brak sieci, polityka), treści krytyczne (technika ćwiczeń — bezpieczeństwo ruchu), dostępność (największy tekst, VoiceOver), zegarek i powiadomienia (główny przepływ w trakcie treningu).

## „Co musi być prawdą” (punkty do porównania z raportami ról w E2.4)
LB-01 Żadna ścieżka (aktualizacja, import, czyszczenie, awaria w trakcie zapisu) nie traci historii; kopia odtwarza 1:1.
LB-02 Cena na ekranie zakupu = cena pobierana przez Apple (waluta i kwota storefrontu); stan po zakupie pokazuje posiadany plan.
LB-03 Limit darmowy (5 dni/mies.) liczony poprawnie i komunikowany przed blokadą; dane nigdy nie są zakładnikiem (opis: historia, kopia, eksport zawsze darmowe).
LB-04 Główny przepływ treningu działa przy największym tekście dostępności i z VoiceOver.
LB-05 Timer przerwy niezawodny na ekranie blokady, w trybie skupienia i na zegarku; brak dublowania serii przez zegarek.
LB-06 Liczby (e1RM, objętość, rekordy, porównania okresów) poprawne we wszystkich systemach miar i strefach czasowych.
LB-07 Wskazówki techniki i animacje poprawne ruchowo i oparte na źródłach; brak porad medycznych.
LB-08 Brak transmisji danych poza telefon (poza Apple Health na zgodę); etykieta prywatności zgodna z kodem.
LB-09 Obietnice opisu w sklepie (35 języków, import z popularnych dzienników, generator „do przejrzenia przed zapisem”) zgodne z kodem.
LB-10 Każda decyzja właściciela (docs/18) wdrożona i pilnowana testem (sygnał z telefonu: decyzja 23.10 niewdrożona).
LB-11 Tłumaczenia naturalne we wszystkich językach z opisu; ceny i formaty liczb lokalne.
LB-12 Gotowość do przeglądu Apple: notatki recenzenta, konto demo/limit, linki prawne, „Przywróć zakupy”, „Zrealizuj kod”.

## Soczewki (partia 1, 27.10.2026; 5 × 15 punktów; pliki w soczewki/)
Punkty soczewek pokryte przez LB-01…LB-12 dopisane do nich jako źródło; nowe punkty dostały LB-13…LB-20.
| LB | Punkty soczewek (plik: nr) |
|---|---|
| LB-01 dane | sceptyk-ryzyka: 1–6, 15; nowy-uzytkownik: 9; wlasciciel-0zl: 7 |
| LB-02 cena = pobierana, stan po zakupie | recenzent-sklepu: 1, 2, 4, 6; sceptyk-ryzyka: 10, 11; nowy-uzytkownik: 6, 7; wlasciciel-0zl: 13 |
| LB-03 limit bez zakładnika | recenzent-sklepu: 9, 14; sceptyk-ryzyka: 12; nowy-uzytkownik: 4, 5, 8; praktyk: 13; wlasciciel-0zl: 4 |
| LB-04 dostępność | nowy-uzytkownik: 1–3 (przepływ bez instrukcji) |
| LB-05 timer, zegarek | recenzent-sklepu: 13; nowy-uzytkownik: 12, 13; praktyk: 9, 10; wlasciciel-0zl: 8 |
| LB-06 liczby | praktyk: 1–3, 5, 6, 11 (jeden nazwany wzór e1RM z granicą powtórzeń; rozgrzewka poza rekordami; dwie miary objętości nazwane) |
| LB-07 treść i technika | praktyk: 4, 7, 8, 12; sceptyk-ryzyka: 14; recenzent-sklepu: 15 |
| LB-08 prywatność | sceptyk-ryzyka: 8, 9; recenzent-sklepu: 11, 12; praktyk: 14; nowy-uzytkownik: 11; wlasciciel-0zl: 12 |
| LB-09 obietnice opisu | recenzent-sklepu: 10; nowy-uzytkownik: 15; wlasciciel-0zl: 5 |
| LB-11 język | nowy-uzytkownik: 14 |
| LB-12 przegląd Apple | recenzent-sklepu: 4, 8 |
| **LB-13** kopia w Plikach/iCloud a dane odczytane z HealthKit (wytyczna 5.1.3) — rozstrzygnięte świadomie | sceptyk-ryzyka: 7; nowy-uzytkownik: 10; recenzent-sklepu: 11 |
| **LB-14** porównanie „espresso” prawdziwe w każdym storefroncie albo znika | recenzent-sklepu: 3 |
| **LB-15** Pro na zegarku i brak dublowania dożywotni + subskrypcja (ostrzeżenie, zarządzanie, zwrot) | recenzent-sklepu: 5, 6 |
| **LB-16** Family Sharing: cofnięcie dostępu obsłużone | recenzent-sklepu: 7; sceptyk-ryzyka: 13 |
| **LB-17** status sprzedawcy (DSA, „trader”) rozstrzygnięty przed publikacją w UE | wlasciciel-0zl: 6 |
| **LB-18** Small Business Program przed pierwszą sprzedażą; cena dożywotnia vs koszt utrzymania | wlasciciel-0zl: 1–3 |
| **LB-19** zakres bez „kombajnu”: funkcje poza rdzeniem z metryką wartości; wzrost z widoczności w PL i kilku rynków | wlasciciel-0zl: 9, 10, 14, 15; praktyk: 15 |
| **LB-20** CI darmowe i bez danych osobowych w logach | wlasciciel-0zl: 11, 12 |
Kontrola nazw marek w plikach soczewek: grep po nazwach alternatyw — 0 trafień (27.10).
