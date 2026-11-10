# Recenzja niezależna rodziny v2 `calf_raise` — runda r1 (audytor, 09.11.2026)

**Werdykt rodziny: do poprawy** — 3 znaleziska WYSOKIE (Standing Calf Raise, Seated Calf Raise, Calf Raise (linki)), 0 KRYTYCZNYCH, 0 ŚREDNICH, 3 NISKIE.
Pozostałe 9 ćwiczeń z rysunkiem: ruch poprawny („wyswietlana” na poziomie ćwiczenia). Wpis v2 bez skrótu — rodzina wraca do r2 po poprawkach.

## Metoda
- Kopia: `git archive dfae8739` (gałąź figury/partia-1) → `/home/user/rev-p1/calf_raise-r1`, baza `aeabf69a` (integracja-1-1). Autor: programista partii 1; recenzent: audytor (L-047).
- `assignAll()` → 13 ćwiczeń; 12 z figurą v2 (widok `side`); Smith Machine Reverse Calf Raise bez figury (zestaw „open”, brak pozy).
- Arkusze własne: `arkusz-slad.mjs` 12 × side × 21 kadrów, motyw jasny i ciemny (24 PNG); `arkusz-nakladka.mjs --family calf_raise` 22 PNG (12 poprawnych + 10 póz błędu `calf.mis.partial`).
  Kadry u=0 i u=1 obejrzane w wycinkach w pełnej rozdzielczości; liczby z `frameAt`/`jointAngles` (u = 0; 0,25; 0,5; 0,75; 1).
- Testy rodziny uruchomione w kopii: `tests/figures-v2-calf-raise-p1.test.ts` zielony; `tests/figury-recenzja.test.tsx` czerwony (brak wpisu v2 — oczekiwane); `tests/strona-eksport.test.ts` 1 czerwony (`pelna` dla 11 ćwiczeń — skutek braku recenzji: eksport słusznie pomija rodzinę bez wpisu, `scripts/strona/eksport.mjs:72,134`).
- Skróty z `node scripts/zrodla-runtime.mjs --skroty` w kopii: v2.calf_raise `03930cd6804f` (NIE wpisany — werdykt „do poprawy”), zestawy.Donkey Calf Raise `58dfc0b13605`, karty.Łydki na stopniu `97256f2c49e7`.

## Znaleziska

| # | Poziom | Pewność | Realność | Ćwiczenie / widok / kadr | Miara | Kierunek naprawy |
|---|---|---|---|---|---|---|
| W1 | WYSOKIE | 85% | realny (każde otwarcie karty) | Standing Calf Raise / side / wszystkie u | `sprzet` dzwignia `punkt: "miednica"`, y 92,1 — pręt 20 cm rysowany poziomo przez biodra (arkusz `slad/Standing-Calf-Raise-side.png`, wycinek u=0); ręce skrzyżowane na klatce, chwyt R [14, 123, 24] | Maszyna stojąca obciąża barki przez poduszki (karta oparta m.in. na ExRx Lever Standing Calf Raise; ogólny opis maszyny: „padded anchors for the weight that rests on the shoulders” — Wikipedia „Calf raises”). Silnik nie ma punktu „barki” (`LEVER_POINT`, `contract.ts:213`: dlonie/kostki/podeszwy/miednica) → fala wspólna (punkt barki) albo wstrzymanie rysunku (K3/V2_WSTRZYMANE) do tego czasu. |
| W2 | WYSOKIE | 95% | realny | Seated Calf Raise / side / wszystkie u (zgłoszone przez autora) | dzwignia `punkt: "kostki"`, x 42, y 11,1, kąt 52,8° — pręt biegnie ukośnie przez stopę; odstęp ciężaru od nóg −1,6 cm (u=0) → −9,1 cm (u=1) — przenikanie, limit K7 ≤ 1 cm (wycinki `crop/SEA-u0.png`, `SEA-u1.png`) | W maszynie poduszka leży na udach tuż nad kolanami i unosi się z kolanami. Silnik nie ma punktu „uda/kolana” → punkt w fali wspólnej albo wstrzymanie rysunku. Test rodziny: dodać odstęp ciężaru ≥ −1 cm (K7) z przypadkiem negatywnym na danych sprzed poprawki. |
| W3 | WYSOKIE | 85% | realny | Calf Raise (linki) / side / wszystkie u | wyciąg `x: 105, y: 22, z: 45`, chwyt R [0, 78,3, 24] → linka 27,6° poniżej poziomu; składowa pionowa ≈ 46% naciągu, pozioma do przodu ≈ 88%; sylwetka stoi pionowo bez przeciwwagi (`slad/Calf-Raise-linki-side.png`) | Opór wspięcia ma być pionowy: niski wyciąg tuż przy stopach (osoba nad/obok krążków, x ≈ 0–20), linka prawie pionowa. Poprawka danych w `poses/calf_raise.json`, bez silnika. |
| N1 | NISKIE | 90% | realny | Łydki na stopniu / side | karta `calf.step`: „przytrzymaj się czegoś dla równowagi”; na rysunku ręce wzdłuż ciała, brak podpory (Single Leg Calf Raise ma ścianę) | Dodać ścianę/poręcz i dłoń na niej (jak Single Leg). Backlog 1.1. |
| N2 | NISKIE | 95% | — (test) | `tests/figures-v2-calf-raise-p1.test.ts` „przypadek negatywny miary” | `expect(Math.hypot(5,0,0) <= 3).toBe(false)` — tautologia, nie dotyka danych; K5 wymaga przypadku, który odtwarza wadę na danych | Przypadek negatywny: przesunięty ślad z `frameAt` (np. chwyt L zamiast środka gryfu) oblewa miarę. |
| N3 | NISKIE | 90% | — (test) | test toru i K7 | test toru pomija Calf Raise (linki) i Band Calf Raise; brak testu odstępu ciężaru (przepuścił W2) | Dodać oba ćwiczenia do testu toru; dodać strażnika odstępu ≥ −1 cm dla rodziny. |

### Ślad dźwigni poza dłońmi (wada silnika, poza zakresem rodziny)
Standing Calf Raise (ślad przy dłoni R, pionowy 14 cm, zamiast przy dźwigni), Donkey Calf Raise i Seated Calf Raise (ślad w nieruchomej dłoni — punkt): **do ponownej recenzji po figury/slad-dzwignia** (`contract.ts:330–332`).
Ślad jest widoczny dla użytkownika: `components/ExerciseFigureV2.tsx:30` (`trailFor`) i `:36` (rysowany w liście kształtów karty). Odpowiedź na pytanie zlecenia: Donkey Calf Raise mógłby mieć werdykt „wyswietlana” bez poprawki silnika (ślad to mały punkt na dłoni opartej o podporę — mylący, ale nie fałszuje ruchu); Standing i Seated i tak są „do poprawy” z powodu W1/W2. Rodzina jako całość nie może dostać „wyswietlana” w r1 z powodu W1–W3, nie z powodu śladu.

### Ocena pytania autora (Seated Calf Raise, pręt przez stopę)
Potwierdzam jako W2 (WYSOKIE): pręt dźwigni leży przy kostkach i przecina stopę (odstęp do −9,1 cm); w maszynie obciążenie idzie przez poduszkę na udach nad kolanami. Barbell Seated Calf Raise i Seated Calf Raise (hantle) pokazują to miejsce poprawnie (gryf/hantle nad kolanami, odstęp 0,1–2,0 cm) — wzór dla poprawki.

## Tabela ćwiczeń

| Ćwiczenie | Kostka u=0 → u=1 | Kolano (min–max) | Werdykt |
|---|---|---|---|
| Łydki na stopniu | +20,9° → −42,2° | 2,9–6,4° | wyswietlana (N1) |
| Standing Calf Raise | +20,9° → −42,2° | 2,9–6,4° | **do poprawy (W1)** |
| Smith Machine Calf Raise | +20,9° → −42,2° | 2,9–6,4° | wyswietlana |
| Calf Raise (sztanga) | +20,9° → −42,2° | 2,9–6,4° | wyswietlana |
| Calf Raise (linki) | +10,8° → −42,2° | 5,2–7,6° | **do poprawy (W3)** |
| Donkey Calf Raise | +20,9° → −42,2° | 2,9–6,4° (biodro 78–86°) | wyswietlana (ślad do r2 po silniku) |
| Band Calf Raise | +10,8° → −42,2° | 5,2–7,6° | wyswietlana |
| Single Leg Calf Raise | +20,9° → −42,2° (R) | R 2,9–6,4°; L 85,7° | wyswietlana |
| Seated Calf Raise | +10° → −45,7° | 90–94,6° | **do poprawy (W2)** |
| Seated Calf Raise (hantle) | +10° → −45,7° | 90–94,6° | wyswietlana |
| Barbell Seated Calf Raise | +10° → −45,7° | 90–94,6° | wyswietlana |
| Dumbbell Seated One-Leg Calf Raise | +10° → −45,7° (R) | 90–94,6° | wyswietlana |

Wszystkie spełniają reguły z `figury-sens.json`: wspięcie ≤ −15°, kolana stojąc ≤ 20°, w siadzie ≥ 60°. Przód stopy na stopniu 8 cm (x −0,5…7,5 / 53,6…61,6), pięta na dole poniżej krawędzi, nad podłogą (y 3,2 cm). Bez skoków między kadrami co 0,05.

## Nakładka
`calfKneeStraightRef` (ref segment biodro→kolano, reguła `kolana_proste` — „ustalone”, cue `calf.knees`): rysuje się w płaszczyźnie z boku jako przedłużenie uda w dół goleni; po kartach dostaje go 5 ćwiczeń (Łydki na stopniu, Standing, Smith, sztanga, linki) — nie 10, jak w raporcie autora: Band i Donkey nie mają `calf.knees` na karcie/zestawie (dobór poprawny, opis autora nieścisły). Pozy błędu `calf.mis.partial` znaczą pięty i nie kolorują elementu kolan — poprawnie (inna reguła). Pominięcie elementu kostki (MeasuredJoint bez kostki) — uzasadnione.

## Zestaw ogólny i karty
- Donkey Calf Raise (zestaw `calf`): calf.move, calf.pause, calf.mis.partial — zgodne z rysunkiem → wyswietlana.
- Łydki na stopniu (karta własna, K11): treść zgodna z ruchem → wyswietlana; rozbieżność z rysunkiem (podpora) jako N1 po stronie rysunku.
- K10: v1 „Standing Calf Raise”, „Łydki na stopniu” → `zastapiona` po wpisie v2 (przepisujący).

## Testy (K14, `git diff aeabf69a..dfae8739 -- tests/`)
| Plik | Zmiana | Ocena |
|---|---|---|
| figures-v2-data.test.tsx | pominięcie warunku wzrostu kąta mierzonego dla calf_raise | uzasadnione (kolano nie jest ruchem; zakres kostki w teście rodziny) |
| figures-v2-mapping.test.ts | listy ready/POSE_FAMILIES, +12 figur | uzasadnione (liczby zgodne z `assignAll`) |
| figures-v2-nakladka-triceps-olympic.test.tsx | rejestr 7 → 8 rodzin | uzasadnione |
| fixtures/pokrycie-katalogu.json | planned → ready | uzasadnione |
| strona-eksport.test.ts | 183 → 195 | uzasadnione po wpisie recenzji; obecnie `pelna` czerwone z braku wpisu (eksport słusznie bez rodziny) |
Nowy test rodziny — zob. N2, N3.

## Uwagi
- Smith Machine Reverse Calf Raise: bez rysunku i bez wpisu w `figury-wyjatki.json` (K3) — do decyzji, nie blokuje (nic się nie wyświetla).
- DATA_UI „Unoszenie/Opuszczanie” — oba klucze w `lib/i18n.en.ts` (K15).
