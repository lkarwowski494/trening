# dip — wskazówki techniki, fala W1 (badacz-merytoryczny, 02.11.2026)

Szczeble źródeł sprawdzone wg rozstrzygnięcia koordynatora z 02.11.2026 — patrz sekcje „Korekta szczebli (02.11.2026)” i „Korekta szczebli — uzupełnienie 3” na końcu.

## Ćwiczenia

| Ćwiczenie | Stan (gotowe/częściowe/otwarte) | Uwagi |
|---|---|---|
| Chest Dip | otwarte | brak 2 przeczytanych źródeł szczebla 4 dla poręczy (ExRx 403, web.archive.org zablokowane; ACE i NASM nie mają tego ćwiczenia w bibliotece); stan jak w docs/research/33 (tylko 1 wspólna wskazówka) |
| Triceps Dip | otwarte | jw. — wersja na poręczach; źródła ławki (nasm-bench-dips, exrx BWBenchDip) nie obejmują poręczy |
| Ring Dips | otwarte | brak jakiegokolwiek przeczytanego źródła szczebla ≤ 4 |
| Dip Machine | otwarte | po uzupełnieniu 3: kopia instrukcji Life Fitness bez potwierdzonej zgodności z oryginałem producenta → nie liczy się; zostaje tylko Hoist (1 źródło). Figura `poses/dip.json` „Dip Machine”: siedzisko z oparciem i dźwignia — maszyna „seated dip” |

## Blok JSON do data/zrodla/cues.json (sekcja exercises)

Po uzupełnieniu 3 brak wpisów (Dip Machine — otwarte, kandydaci w „Otwarte”).

```json
{}
```

## Nowe zdania (id | PL | EN)

Kandydaci (nie do wdrożenia, dopóki Dip Machine nie ma drugiego źródła):

| id | PL | EN |
|---|---|---|
| dipm.setup | Ustaw wysokość siedziska, usiądź ze stopami opartymi i chwyć uchwyty. | Set the seat height, sit with your feet supported and grab the handles. |
| dipm.handles | Ustaw uchwyty tak, żeby chwyt był wygodny. | Adjust the handles so the grip feels comfortable. |
| dipm.move | Wypchnij uchwyty w dół, potem powoli wróć do pozycji wyjściowej. | Push the handles down, then slowly return to the start. |

## Nowe źródła (id | adres | organizacja | szczebel | data odczytu)

| id | adres | organizacja | szczebel | data odczytu |
|---|---|---|---|---|
| hoist-rs-1101 | https://www.hoistfitness.com/pages/rs-1101-seated-dip | HOIST Fitness Systems (producent tej maszyny; strona produktu z instrukcją użycia) | 4 (producent — własna maszyna) | 02.11.2026 |
| lf-pro-su66 | https://www.manualsdir.com/manuals/166239/life-fitness-pro-series.html?page=23 | kopia instrukcji Life Fitness „Pro Series Owner's Manual” M051-00416-A000 (03.2001), s. 3-14 Seated Dip (SU66), w serwisie z instrukcjami; zgodności z oryginałem producenta nie potwierdzono | nie źródło (kopia niepotwierdzona; uzupełnienie 3) | 02.11.2026 (tylko do Otwartych) |

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie/zdanie | powód |
|---|---|
| Chest Dip, Triceps Dip | Nie znaleziono 2 niezależnych źródeł szczebla 4 opisujących pompki na poręczach: ExRx — 403, web.archive.org zablokowane w narzędziu; ACE (wyszukiwarka biblioteki i kategorie „triceps”, „chest”) i NASM (adres `exercise-library/dips` — 404) nie mają tego ćwiczenia. Wyniki wyszukiwarki to serwisy konsumenckie i strony aplikacji (odrzucone). Do sprawdzenia przy dostępie: ExRx Chest Dip / Triceps Dip (przez archiwum), NSCA Exercise Technique Manual. |
| Ring Dips | brak jakiegokolwiek przeczytanego źródła szczebla ≤ 4 |
| Dip Machine (cała karta) | tylko 1 źródło szczebla 4 (Hoist RS-1101: „How Do I Use This Machine?”, kroki 1–5). Kopia instrukcji Life Fitness (s. 3-14) zgodna treściowo z Hoist dla `dipm.setup`, `dipm.handles`, `dipm.move`, ale oryginału producenta nie udało się odczytać (strona wsparcia 403) → nie liczy się. Potrzebny drugi producent maszyny „seated dip” albo organizacja szkoląca |
| zestaw ogólny `dip` (`bdip.move`, `bdip.range`, `mis.jerk`) dla Chest Dip / Triceps Dip / Ring Dips | Zdania pochodzą z ławki (`bdip.*`: dłonie na ławce za sobą, nogi w przód). Dla poręczy i kółek żadne przeczytane źródło ich nie potwierdza; „mniej więcej kąt prosty w łokciach” dla poręczy — tylko 1 źródło (HKU wg docs/33). Sygnał o błędzie zestawu ogólnego. |
| zestaw ogólny `dip` dla Dip Machine (`bdip.move`, `bdip.range`) | Nie pasuje do maszyny: `bdip.move` mówi „opuść się… wypchnij się”, a na maszynie siedzisz i wypychasz uchwyty; kąt prosty i „lekkie rozciągnięcie” — żadne z przeczytanych źródeł maszyny tego nie podaje. Do zastąpienia własnymi zdaniami, gdy będzie drugie źródło. |
| Dip Machine — „nie blokuj łokci na dole” | tylko kopia Life Fitness („Do not lock elbows at the bottom”) — nie liczy się; Hoist nie wspomina |
| Dip Machine — „łokcie blisko tułowia, plecy przy oparciu” | tylko kopia Life Fitness — nie liczy się |
| Dip Machine — wysokość siedziska | Hoist — uchwyty na wysokości klatki; kopia Life Fitness — łokcie zgięte mniej więcej pod kątem prostym przy chwycie. Wspólne tylko „ustaw siedzisko” |
| Dip Machine — `mis.jerk` (zestaw ogólny) | źródła mówią „powoli” (ruch), ale żadne nie opisuje szarpania jako błędu |

## Korekta szczebli (02.11.2026)

Podstawa: rozstrzygnięcie koordynatora linii 1.1 z 02.11.2026 (kryteria a–c).

Źródła:
- hoist-rs-1101: 4 → 4 (producent tej maszyny; bez zmiany).
- lf-pro-su66: 4 → 4 (instrukcja producenta dla własnej maszyny, treść firmowana przez producenta; kopia w serwisie z instrukcjami — zastrzeżenie dopisane, bez zmiany szczebla). (Zmienione w uzupełnieniu 3 — niżej.)

Ćwiczenia (1 zmiana stanu):
- Dip Machine: gotowe → częściowe (ustawienie + ruch z 2 źródeł szczebla 4, brak błędu). (Zmienione w uzupełnieniu 3 — niżej.)
- Bez zmian: Chest Dip, Triceps Dip, Ring Dips — otwarte.

## Korekta szczebli — uzupełnienie 3 (02.11.2026)

Podstawa: „Uzupełnienie 3 szczebli” koordynatora linii 1.1. Sprawdzenie WebFetch 02.11.2026: kopia w serwisie z instrukcjami ma na s. 1
„PRO SERIES OWNER'S MANUAL”, nr M051-00416-A000, marzec 2001; strona wsparcia Life Fitness — 403 (artykuły i wyszukiwarka), dokumentu
u producenta nie znaleziono (jedyna inna kopia u dealera). Zgodności z oryginałem nie potwierdzono.

Zmiany:
- lf-pro-su66: 4 → nie źródło (kopia niepotwierdzona); usunięte z bloku JSON.
- Dip Machine: częściowe → otwarte (zostaje 1 źródło — Hoist); wpis usunięty z bloku JSON, zdania `dipm.*` jako kandydaci.
- Chest Dip, Triceps Dip, Ring Dips: bez zmian (otwarte).
