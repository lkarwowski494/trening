# Recenzja niezależna rodziny v2 `thruster` — runda 1 (partia 4, linia 1.1), 10.11.2026

Recenzent: audytor (nie jest autorem rodziny; L-047). Stan zamrożony: `figury/partia-4-thruster` @ c238b04 (baza 47e3715f). Arkusze ze śladem toru (L-050) wygenerowane samodzielnie
(`arkusz-slad.mjs`, 3 ćwiczenia × rzut z boku, kadry co 0,05; `arkusz-nakladka.mjs` dla Clean and Press z pozą błędu), liczby z `frameAt` / `jointAngles`.
Skróty: `node scripts/zrodla-runtime.mjs --skroty` w worktree recenzji (v2 thruster e6ea1059a607; karty: Thruster (hantle) 6606839c306f, Kettlebell Thruster 175baa530c3a; zestaw Clean and Press 84f205b001d6).

**Werdykt rodziny: do poprawy** (3 × WYSOKIE). Karty własne i zestaw ogólny — teksty poprawne, wyświetlane; zgodność z rysunkiem do ponownego sprawdzenia w r2 po W1–W3.

## Znaleziska

| # | Klasa | Pewność | Ćwiczenia | Co | Miara (do testu odtwarzającego) | Realność |
|---|---|---|---|---|---|---|
| W1 | WYSOKIE | 95% | wszystkie 3 | Koniec wyciskania: ciężar przed głową, nie nad nią. Ramię 16,5° od pionu, chwyt 18,1 cm przed barkiem, 16,8–19,7 cm przed kostką. Przeczy „ciężar idzie prosto w górę nad głowę” (ohp.tall: karta Kettlebell Thruster, zestaw Clean and Press), „wypchnij go nad głowę” (thruster.move) i regule „ustalonej” z rodziny overhead_press `ciezar_nad_barkami` ≤ 10 cm (NSCA Basics s. 42: na górze sztanga w linii barków, bioder i pięt). Reguła `nad_glowa` tej rodziny sprawdza tylko wysokość, więc przepuszcza. Zrecenzowana rodzina olympic kończy nad stopą: Muscle Snatch 2,1 cm przed barkiem / 0,3 cm od kostki, Power Jerk 3,8 / −0,6 cm (silnik to umie). | w u = 1: \|grip.x − shoulderC.x\| ≤ 10 cm i \|grip.x − kostka.x\| ≤ 5 cm; negatyw: dane c238b04 (18,1 / 19,7 cm) oblewają | realny (każde otwarcie karty) |
| W2 | WYSOKIE | 95% | Thruster (hantle), Kettlebell Thruster | Głębokość: w najniższym kadrze (u ≈ 0,36) udo 20,4° nad poziomem, staw biodrowy 14,3 cm nad kolanem (biodro 57,2, kolano 42,9 cm). Karta: „Zejdź co najmniej do równoległego ud” (thruster.depth; źródła: biodra poniżej kolan / równolegle lub niżej). Reguła `przysiad` (kolano ≥ 80°) przepuszcza, bo zgięcie kolana 97° przy goleni pochylonej 30° nie daje równoległego uda. Dla porównania Goblet Squat (squat): udo 8,6° poniżej poziomu. | min po u (co 0,01) kąta uda do poziomu ≤ 0° (biodro.y ≤ kolano.y); negatyw: c238b04 = +20,4° | realny |
| W3 | WYSOKIE | 85% | Thruster (hantle), Kettlebell Thruster | Brak powrotu ciężaru do barków: pętla jednokierunkowa kończy w u = 1 nad głową, potem skok do u = 0 (przeskok chwytu o 62,1 cm / 63,4 cm). Karta thruster.move: „…potem opuść z powrotem do barków”; kontrakt pętli: „u 0 → 1 zawiera CAŁE powtórzenie”. Komentarz w `scripts/figures/agent-pozy/thruster.mjs` (generuj) twierdzi „potem ciężar wraca na barki” — profil `gProf` tego nie robi. Pytanie z briefu „czy pokazuje cały cykl zgodnie z kartą” — nie. (Clean and Press: skok 142 cm jest jak w olympic — zestaw nie opisuje opuszczania; bez znaleziska.) | dla obu thrusterów \|grip(u=1) − grip(u=0)\| ≤ 5 cm albo istnieje u > u_max(grip.y), w którym chwyt wraca ≤ 5 cm od chwytu u = 0; negatyw: 62,1 cm | realny |
| N1 | NISKIE | 90% | wszystkie | Brak testów miejsca końca wyciskania, głębokości i powrotu (K5): `tests/figures-v2-thruster.test.tsx` sprawdza chwyt, pięty i nakładkę; progi W1–W3 z karty powinny tam trafić. | — | — |
| N2 | NISKIE | 85% | Clean and Press | Łokcie w racku i w wyciskaniu odchylone w bok do 28,5 cm od barku (shAbd ≈ 63°, u 0,35–0,6) — źródła zarzutu mówią o łokciach w przód; w rzucie z boku niewidoczne (rodzina ma tylko ten rzut). Przy dodaniu rzutu z przodu — WYSOKIE. Komentarz generatora „z podłogi” przy starcie z zawisu nad kolanami (KLUCZE u = 0) — opis niezgodny z danymi. | elbow.z − shoulder.z ≤ ok. 15 cm w racku | teoretyczny (niewidoczne) |

## Punkty zgłoszone przez autora
1. Koniec wyciskania — patrz W1 (nie do przyjęcia jako uproszczenie: reguła ustalona ≤ 10 cm i olympic pokazują, że da się).
2. Hantel u = 1 bez osi: oś u = 0,95–0,97 ≈ (0; 0,05; 0,99) — w rzucie z boku i tak koło, bez osi też koło; skoku na rysunku nie ma. Bez znaleziska.
3. Clean and Press `ciezar_blisko`: maks. 19,6 cm (u = 0,09) przy progu 20 cm; na arkuszu odstęp od powierzchni nóg 3,9–9,2 cm, sztanga wizualnie blisko. Mieści się; kruche przy poprawce W1 (sprawdzić ponownie).
4. Łokcie w racku thrusterów 16,8–21 cm w bok (hantle), 15–19,5 cm (kettlebell) — w rzucie z boku łokieć przed i pod barkiem, zgodnie z „ciężar przy barkach”; niewidoczne odchylenie, bez znaleziska (porównaj N2).

## Sprawdzone bez znalezisk
- Chwyt: każda dłoń ≤ 3 cm od ciężaru w 21 kadrach (test autora zielony, `--runInBand`); ślad = chwyt R.
- Pięty płasko w pozach poprawnych; wyprost na górze (kolano 2,9°, biodro 7,7°, łokieć 10,3° — „biodra, kolana i ręce wyprostowane”); Clean and Press łokieć 20,6° (≤ 25° reguły nad_glowa).
- Przenikanie: kettlebell–głowa min. 1,6 cm (3D); ciężar–głowa w rzucie ≥ 17,5 cm; sztanga przed udami 3,9–9,2 cm. Kettlebell w racku na przedramieniu jak w zrecenzowanym Double Kettlebell Front Squat (konwencja wspólna).
- Orientacja (K6): kettlebell dzwon do tyłu przez cały ruch, sztanga z talerzami, hantle przy barkach skośnie.
- Błędy: sq.mis.heels (pięty) i oly.mis (zaokrąglenie, nakładka „X” na linii pleców) widoczne.
- Nakładka `overlay/thruster.ts`: tylko reguły „ustalone” z kartą (oly.back, oly.close, Clean and Press), rzut z boku; odrzucenia w nagłówku zasadne (kolana_nad_stopami tylko z przodu, piety bez wskazówki, przysiad/start/nad_glowa — analogia).
- Zestaw Clean and Press (oly: oly.back, oly.close, ohp.tall, oly.mis): zdania pasują do ruchu ćwiczenia; ohp.tall zgodne z rysunkiem dopiero po W1.
- Karty własne: teksty bez zmian (skróty jak we wpisach 03.11.2026); niezgodność z rysunkiem (thruster.depth, thruster.move, ohp.tall) leży po stronie rysunku (W1–W3).
- K9: `assignAll()` = 3 ćwiczenia rodziny; K10: brak wpisów v1 tych ćwiczeń (v1_zastapiona pusta).
- K14 (`git diff 47e3715f..c238b04 -- tests/`): `figures-v2-data` — dla thruster widoczność błędu w najgorszej klatce siatki 0,05 i dodany spineMid: zasadne (błąd pięt na dole przysiadu, nie w u = 1), nie poluzowanie progu 3 cm; wyłączenie thruster z ogólnego testu faz — zastąpione testem rodziny; `figury-generator-odtwarza` — usunięty wyjątek Clean and Press i rodzina w zakresie (zaostrzenie); pozostałe zmiany to liczniki (ready, POSE_FAMILIES, 63 → 66 pętli, 214 → 217 eksportu, rejestr nakładek 9) — spójne z danymi. `pokrycie-cele.json` animowanyBlad 264 → 265 — zapadka w górę, zgodna z jednym nowym animowanym błędem (oly.mis Clean and Press). Bez poluzowań.
