# dip — wskazówki techniki, fala W1 (badacz-merytoryczny, 02.11.2026)

Szczeble źródeł sprawdzone wg rozstrzygnięcia koordynatora z 02.11.2026 — patrz sekcja „Korekta szczebli (02.11.2026)” na końcu.

## Ćwiczenia

| Ćwiczenie | Stan (gotowe/częściowe/otwarte) | Uwagi |
|---|---|---|
| Chest Dip | otwarte | brak 2 przeczytanych źródeł szczebla 4 dla poręczy (ExRx 403, web.archive.org zablokowane; ACE i NASM nie mają tego ćwiczenia w bibliotece); stan jak w docs/research/33 (tylko 1 wspólna wskazówka) |
| Triceps Dip | otwarte | jw. — wersja na poręczach; źródła ławki (nasm-bench-dips, exrx BWBenchDip) nie obejmują poręczy |
| Ring Dips | otwarte | brak jakiegokolwiek przeczytanego źródła szczebla ≤ 4 |
| Dip Machine | częściowe (ustawienie + ruch; bez błędu) | figura `poses/dip.json` „Dip Machine”: siedzisko z oparciem i dźwignia — to maszyna „seated dip”; dwaj producenci tej maszyny opisują ją zgodnie; brak błędu z 2 źródeł (minimum „gotowe” wymaga 1 błędu) |

## Blok JSON do data/zrodla/cues.json (sekcja exercises)

„Dip Machine” — wpis częściowy (bez błędu); do aplikacji tylko, jeśli koordynator dopuszcza karty częściowe.

```json
{
 "Dip Machine": {
  "setup": [
   {"c": "dipm.setup", "s": [
     ["hoist-rs-1101", "How Do I Use This Machine?, kroki 1 i 3–4 (siedzisko, stopy na podnóżkach, chwyt uchwytów)"],
     ["lf-pro-su66", "Seated Dip (SU66), s. 3-14: ustawienie siedziska, stopy na podłodze, chwyt uchwytów"]
   ]},
   {"c": "dipm.handles", "s": [
     ["hoist-rs-1101", "How Do I Use This Machine?, krok 2 (ADJUST handles for comfort)"],
     ["lf-pro-su66", "Seated Dip (SU66), s. 3-14 (rotate the handles inward or outward as desired)"]
   ]}
  ],
  "move": [
   {"c": "dipm.move", "s": [
     ["hoist-rs-1101", "How Do I Use This Machine?, kroki 4–5 (push hands down; slowly return)"],
     ["lf-pro-su66", "Seated Dip (SU66), s. 3-14 (slowly press the handles down; slowly return)"]
   ]}
  ],
  "tips": [],
  "mistakes": []
 }
}
```

## Nowe zdania (id | PL | EN)

| id | PL | EN |
|---|---|---|
| dipm.setup | Ustaw wysokość siedziska, usiądź ze stopami opartymi i chwyć uchwyty. | Set the seat height, sit with your feet supported and grab the handles. |
| dipm.handles | Ustaw uchwyty tak, żeby chwyt był wygodny. | Adjust the handles so the grip feels comfortable. |
| dipm.move | Wypchnij uchwyty w dół, potem powoli wróć do pozycji wyjściowej. | Push the handles down, then slowly return to the start. |

## Nowe źródła (id | adres | organizacja | szczebel | data odczytu)

| id | adres | organizacja | szczebel | data odczytu |
|---|---|---|---|---|
| hoist-rs-1101 | https://www.hoistfitness.com/pages/rs-1101-seated-dip | HOIST Fitness Systems (producent tej maszyny; strona produktu z instrukcją użycia) | 4 (producent — własna maszyna) | 02.11.2026 |
| lf-pro-su66 | https://www.manualsdir.com/manuals/166239/life-fitness-pro-series.html?page=23 | Life Fitness (producent tej maszyny) — „Pro Series User Manual”, s. 3-14; czytane w kopii instrukcji w serwisie z instrukcjami (oryginalnego PDF producenta nie znaleziono) | 4 (instrukcja producenta dla własnej maszyny; zastrzeżenie: kopia u osoby trzeciej — przy dostępie porównać z oryginałem) | 02.11.2026 |

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie/zdanie | powód |
|---|---|
| Chest Dip, Triceps Dip | Nie znaleziono 2 niezależnych źródeł szczebla 4 opisujących pompki na poręczach: ExRx — 403, web.archive.org zablokowane w narzędziu; ACE (wyszukiwarka biblioteki i kategorie „triceps”, „chest”) i NASM (adres `exercise-library/dips` — 404) nie mają tego ćwiczenia. Wyniki wyszukiwarki to serwisy konsumenckie i strony aplikacji (odrzucone). Do sprawdzenia przy dostępie: ExRx Chest Dip / Triceps Dip (przez archiwum), NSCA Exercise Technique Manual. |
| Ring Dips | brak jakiegokolwiek przeczytanego źródła szczebla ≤ 4 |
| zestaw ogólny `dip` (`bdip.move`, `bdip.range`, `mis.jerk`) dla Chest Dip / Triceps Dip / Ring Dips | Zdania pochodzą z ławki (`bdip.*`: dłonie na ławce za sobą, nogi w przód). Dla poręczy i kółek żadne przeczytane źródło ich nie potwierdza; „mniej więcej kąt prosty w łokciach” dla poręczy — tylko 1 źródło (HKU wg docs/33). Sygnał o błędzie zestawu ogólnego. |
| zestaw ogólny `dip` dla Dip Machine (`bdip.move`, `bdip.range`) | Nie pasuje do maszyny: `bdip.move` mówi „opuść się… wypchnij się”, a na maszynie siedzisz i wypychasz uchwyty; kąt prosty i „lekkie rozciągnięcie” — żadne z dwóch źródeł maszyny tego nie podaje. Zastąpić własnymi zdaniami z bloku wyżej. |
| Dip Machine — błąd (brak w karcie → stan „częściowe”) | żaden błąd nie ma 2 źródeł; kandydaci niżej |
| Dip Machine — „nie blokuj łokci na dole” | tylko 1 źródło (lf-pro-su66: „Do not lock elbows at the bottom”); Hoist nie wspomina |
| Dip Machine — „łokcie blisko tułowia, plecy przy oparciu” | tylko 1 źródło (lf-pro-su66) |
| Dip Machine — wysokość siedziska | źródła się różnią: Hoist — uchwyty na wysokości klatki; Life Fitness — łokcie zgięte mniej więcej pod kątem prostym przy chwycie. Wspólne tylko „ustaw siedzisko” (stąd ogólne `dipm.setup`). |
| Dip Machine — `mis.jerk` (zestaw ogólny) | oba źródła mówią „powoli” (ruch), ale żadne nie opisuje szarpania jako błędu; wpisane jako „powoli” w `dipm.move`, nie jako błąd |

## Korekta szczebli (02.11.2026)

Podstawa: rozstrzygnięcie koordynatora linii 1.1 z 02.11.2026 (kryteria a–c).

Źródła:
- hoist-rs-1101: 4 → 4 (producent tej maszyny; bez zmiany).
- lf-pro-su66: 4 → 4 (instrukcja producenta dla własnej maszyny, treść firmowana przez producenta; kopia w serwisie z instrukcjami — zastrzeżenie dopisane, bez zmiany szczebla).

Ćwiczenia (1 zmiana stanu):
- Dip Machine: gotowe → częściowe (ustawienie + ruch z 2 źródeł szczebla 4, brak błędu).
- Bez zmian: Chest Dip, Triceps Dip, Ring Dips — otwarte.
