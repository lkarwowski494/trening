# Recenzja niezależna rodziny v2 `leg_isolation` — partia 9, runda 1 (audytor, 10.11.2026)

Zakres: figury/partia-9-leg_isolation @ d4febb69 (z 73f9548 — LOAD/DATA_UI). Autor: programista partii 9; recenzent: audytor (nie pisał rodziny, niczego nie poprawiał).
Bramka 4 (L-047 A), ślad toru (L-050), kryteria K4–K15 z planu recenzji rodzin v2.

## Werdykt

**Rodzina: wyświetlana** (0 × KRYTYCZNE, 0 × WYSOKIE). Ruch wszystkich 8 ćwiczeń z rysunkiem zgodny z kartami i zestawami ogólnymi.
Warunek scalenia (nie ruchu): dwa czerwone testy w SHA (Ś1, Ś2) — do naprawy przez autora przed `tests.yml`.

## Sposób sprawdzenia

- Arkusze `arkusz-slad.mjs` wygenerowane samodzielnie: 8 ćwiczeń × widok side (jedyny widok rodziny), 21 kadrów co 0,05, oglądane w pełnej rozdzielczości (2100 px), kadry krańcowe powiększone.
- Liczby z `frameAt` (41 kadrów co 0,025) i `shapesAt` (styki co 0,05); skróty z `zrodla-runtime.mjs --skroty` policzone w worktree recenzji; `liczba` z `recenzja-szkielet.mjs` (assignAll: 14).
- Testy pojedynczo (`--runInBand`): figures-v2-leg-isolation 38/38, figures-v2-kierunek-u 84/84, figury-generator-odtwarza 18/18, figures-v2-data 23/23 — zielone; figures-v2-tor, architecture-limits — czerwone (Ś1, Ś2); figury-recenzja i strona-eksport — czerwone do czasu przeniesienia wpisów (oczekiwane).

## Pomiary (kolano = zgięcie, 0° = wyprost)

| Ćwiczenie | Kolano (pracująca noga) | Miednica | Oś dźwigni / sprzęt |
|---|---|---|---|
| Leg Extension | 90 → 11° (obie) | stoi (48 cm) | oś = kolano (dryf ≤ 0,4 cm) |
| Single-Leg Leg Extension | 90 → 11° (R), L stale 90°, stopa na podłodze | stoi | jw. |
| Leg Curl (siedząc) | 11 → 100° | stoi | oś = kolano |
| Lying Leg Curl | 3,4 → 99,9° | stoi (53,2), biodro 8,1–9,0° | oś = kolano (−42; 53,2–53,5) |
| Standing Leg Curl | 9,4 → 95,1°; udo nieruchome (biodro 25,0–25,3°) | stoi | oś = kolano (0; 47,8) |
| Standing Cable Leg Curl | 9,4 → 95,1°; biodro 10,1–10,2° | stoi | linka z bloczka z przodu do kostki, wydłuża się przy uginaniu |
| Seated Band Hamstring Curl | 9,7 → 90,7°; u = 0 udo 24° w dół, noga prosta, pięta na podłodze | stoi | zaczep z przodu (x 125), guma 52 → 82 cm |
| Slider Hamstring Curl | 100 → 11,8° (wysuwanie) | 32,8 → 14,5 cm; biodro −5,4…−8,8° (wyprost) | ślizgacze pod piętami (pięta ≥ 2 cm) |

Ślad toru: dźwignie i linka — łuk wokół kolana o promieniu ok. 41 cm, strzałka r·(1 − cos(Δθ/2)) zgodna z pomiarem (Ś1); guma — kostka po podłodze; Slider — miednica jednym łukiem.

## Znaleziska

| ID | Klasa | Realność | Opis i miara | Kroki |
|---|---|---|---|---|
| Ś1 | ŚREDNIE (proces, blokuje scalenie, nie ruch) | — | `tests/figures-v2-tor.test.ts` „każde ćwiczenie i widok…” czerwony: Leg Extension 9,6 cm, Single-Leg 9,6, Leg Curl 12,1, Lying Leg Curl 13,5, Standing 10,8, Standing Cable 10,8 (próg toru prostego 4 cm). Tory są poprawne: łuk wokół kolana, r ≈ 41 cm, Δθ 79° → 9,6 cm; 89° → 11,8; 96,5° → 13,7; 85,7° → 11,0. Naprawa: próg łuku z geometrii (wzór `progDzwigni` chest_press_machine: promień = kolano–punkt styku, Δθ z pozy, + 2 cm) z przypadkiem negatywnym — nie wpis w `tor-wyjatki.json`. | `npx jest tests/figures-v2-tor.test.ts` |
| Ś2 | ŚREDNIE (proces) | — | `tests/architecture-limits.test.ts` czerwony: `lib/figures/v2/poseData.ts` 25 673 B > próg 24 736 B. Przy wariancie A leada próg = 25 673 (rozmiar pliku w tym SHA, bez zapasu); zmiana progu nie jest w tym SHA. | `wc -c lib/figures/v2/poseData.ts` |
| N1 | NISKIE | brzegowy (niewidoczne, korpus na obiciu) | Lying Leg Curl: dolny obrys tułowia 2,2 cm w obiciu ławki (u = 0, punkt x 36, y 40,8; wierzch 43) — K7 ≤ 1 cm. | arkusz, kadr u = 0 |
| N2 | NISKIE | brzegowy | Slider Hamstring Curl: łopatki 1,4 cm pod podłogą (u = 1, x −43,9; u = 0: 0,2 cm). | kadr u = 1 |
| N3 | NISKIE | realny (widoczne) | Standing Leg Curl: ręce wyciągnięte przed siebie na wysokości klatki trzymają powietrze — rama maszyny i uchwyty nierysowane (rysowana tylko dźwignia). | arkusz, każdy kadr |
| N4 | NISKIE (dane, do badacza) | — | `figury-sens.json`: `wskazowki_na_reguly["lext.range"]` nie zawiera `wyprost_kolan_jednonoz`, choć pole `cue` tej reguły to `lext.range`; nowy test pomija sprawdzenie tej reguły warunkiem `d.rule !== …`. Element nakładki Single-Leg uzasadniony polem `cue` reguły — uzupełnić mapę i zdjąć warunek. | `data/zrodla/figury-sens.json` |
| N5 | NISKIE | realny | Seated Band Hamstring Curl: kolano kończy na 90,7°, pięta pod kolanem na podłodze; karta mówi „tak daleko, jak dasz radę”, a przód skrzyni (x −1) pozwala cofnąć piętę dalej (ok. 110°). Nie przeczy karcie (błąd „tylko do połowy” to ok. 65°). | kadr u = 1 |

## Punkty autora (ocena niezależna)

1. Slider — miednica opada 18,3 cm, ale biodro zostaje w wyproście (−5,4…−8,8°), pośladki 4,6 cm nad podłogą przy pełnym wysunięciu, miednica ok. 5 cm nad linią bark–pięta. Opadanie wynika z geometrii (barki i pięty na podłodze), nie z „opadających bioder” (błąd z karty = utrata wyprostu w biodrze). Zgodne z kartą; bez znaleziska (tak samo jak recenzja B2 z 09.11.2026).
2. Seated Band u = 0 — noga prosta (9,7°), udo 24° w dół, pięta na podłodze, zaczep przed sobą: zgodne z „noga wyprostowana przed sobą”. Bez znaleziska.
3. Mapa `lext.range` — N4.
4. Standing Leg Curl / Standing Cable bez elementu nakładki — poprawnie: ich zestaw (lcurl.still, llc.control) nie ma wskazówki ruchu, a reguły bioder są strefą w cm (nieobsługiwana). Bez znaleziska.
5. „Opuszczanie” jako pierwsza faza Slider — poprawnie: start z mostu i ugiętych kolan, wysuwanie = faza ekscentryczna (miednica w dół, strażnik kierunku liczy „opuszczanie”), `lowerFirst: true`.

## K14 — testy (`git diff b66ecfa..d4febb6 -- tests/`)

| Plik | Zmiana | Ocena |
|---|---|---|
| figures-v2-kierunek-u | lista `UGINANIE_KOLANA` odwraca znak kolana dla 5 uginań | nie poluzowanie: zgięcie kolana w uginaniu to wysiłek; odwrócone u nadal oblewa test (lowerFirst ≠ kierunek); nowe uginanie spoza listy oblewa (bezpieczne) |
| figury-generator-odtwarza | leg_isolation z rozjazdów do „w zakresie” | zaostrzenie |
| figures-v2-data | gałąź leg_isolation z jawną listą 5 uginań | nowe sprawdzenie |
| skrot-v2-wynik | przypadek L-080 przeniesiony z leg_isolation na core_hang (nadal planned) | ta sama treść testu |
| mapping, nakladka-triceps-olympic, gemini-polecenia, pokrycie-katalogu, strona-eksport (386 → 394) | liczby i listy +leg_isolation | zgodne z danymi (8 z 14) |
| figures-v2-leg-isolation (nowy) | progi z reguł sens.json, negatyw połowy ruchu | progi z reguł, nie z danych; jedyny warunek pomijający — N4 |

## K10–K12, K15

- K10: v1 Lying Leg Curl → „zastapiona” (w SHA). K11: 5 kart własnych zgodnych z rysunkiem (wpisy w JSON). K12: 3 zestawy ogólne zgodne (legExt — Single-Leg; legCurl — Standing, Standing Cable).
- K15: nazwy faz „Prostowanie”, „Uginanie”, „Powrót”, „Opuszczanie” są w `lib/i18n.en.ts`; mis.jerk i ballcurl.mis.sag bez animacji z powodem w sens.json.

## Sprawdzone bez znalezisk

Orientacja sprzętu (oś dźwigni w kolanie, linka i guma z przodu, ślizgacze pod piętami); styki ławki i skrzyni (≤ 0,4 cm); pięty nad podłogą (≥ −0,3 cm); nakładka (3 elementy, tylko reguły „ustalone”, cue z karty/zestawu, rzut z boku); 6 ćwiczeń bez rysunku (figureSpec = null); prywatność i sekrety w diffie — brak.
