# Recenzja ruchu (bramka 4) po scaleniu: mobility_floor i mobility_stand na integracja-1-1 @ 6bee23f7

Worktree tylko do odczytu /home/user/wt/rec-mob-int @ 6bee23f7b0dd04db5d53d65dde81007be689f6b3 (potwierdzone), porównanie z ff7332e7 (/home/user/wt/rodziny-mobilnosc). Nic nie zapisano w repo.
Podgląd: .../scratchpad/mob-int/<rodzina>/<rodzina>/ (oba katalogi mają PODGLAD-WAZNY.txt). Narzędzia: .../scratchpad/recint/ (svgcmp.py, engdiff.mjs, torso.mjs, knee.mjs, bf.mjs, idsA/idsB.mjs).

## 1. cmp 17 póz z mob-r6-rec
- mobility_stand: 8 HTML + 8 PNG + poze/katy/raport identyczne bajt w bajt; różni się tylko manifest.json.
- mobility_floor: 9 HTML i 9 PNG różnych. Przyczyna: podgląd integracji (c17aaf59, viewsOf) nie rysuje już widoku z przodu, którego rodzina nie ma (families.ts:62, mobility_floor = tylko z boku). Klatki widoku z boku (span data-widok="side", u = 0 i 1, a w Cat-Cow także 0,5) są identyczne bajtowo we wszystkich 9 pozach (svgcmp.py). Ocena: obojętne; podgląd teraz odpowiada temu, co pokazuje aplikacja.
- manifest.json (obie rodziny): nowe pola na_krawedzi {}, zmiany_sprzetu [], lista_kontrolna (P3) oraz opis.ruch z 2 wskazówkami (scalenie tekstów wskazówek), np. Standing Lateral: „Skłaniaj się tylko w bok — bez skrętu i bez pochylania w przód.” — zgodne z pozą (reguły sensu sklon_boczny_statyczny, bez_skretu; tabela kątów bez zmian). Pozy statyczne dostają „Trzymaj spokojnie, bez sprężynowania”, Cat-Cow „Ruszaj się płynnie…” — zgodne.

## Zmiana rysunku w silniku (złote odciski Side-Lying i Standing Lateral)
engdiff.mjs: dataShapes starego i nowego silnika, widoki side/front/top, u = 0, 0,1, 0,25, 0,5, 0,75, 0,9, 1, wszystkie wiersze — 17 póz. Różnice tylko:
| Poza | Widok | Kształt | Zmiana | Widok w aplikacji? |
|---|---|---|---|---|
| Side-Lying Quad Stretch | front | torso | maks. 3,81 cm; y 16,7…25,5 → 19,6…22,0 (szerokość klatki pozioma zamiast pionowej) | nie (rodzina tylko side) |
| Standing Lateral Stretch | top | torso | maks. 8,16 cm; x −18,5…2,7 → −25,1…6,8 | nie (rodzina side + front) |
Źródło: lib/figures/v2/draw.ts torsoPoly — TORSO_PROJ_MIN = 0,5 i zwrot normalnej (n[0] < 0 → odwrót): przy osi tułowia prawie wzdłuż kierunku patrzenia szerokość rysuje się poziomo (komentarz: wcześniej schodziła pod podłogę). To poprawka silnika; dla mobilności obojętna, bo dotyczy widoków, których ExerciseFigureV2 (spec.views) nie pokazuje. Widoki side (oba) i front (Standing Lateral) — identyczne bajtowo.
Druga zmiana silnika dotykająca tych póz: jointAngles ma nowe pole shRot (skeleton.ts) — tylko liczba, rysunek bez zmian.

### Pomiar Side-Lying (side, u = 0 i 1, cm; identyczny w obu silnikach, idsA vs idsB różnią się tylko polem shRot)
dłoń dolna 1,4 · przedramię 1,0 · ramię −1,9 / −0,5 (NISKIE #1 z r6 bez zmian) · głowa 7,7 (na dłoni) · tułów 0,5 · miednica 1,3 · udo dolne 2,1–2,2 · goleń dolna 2,4 · stopa dolna 0,0 · górna dłoń x 0,6…13,5 / y 41,3…48,2 na stopie górnej x 4,2…29,8 / y 34,6…56,6. Kolana: górne 140,8°, dolne 9,3°; biodro 10,9 / 8,2°; obrót −75°, skłon głowy −20°.
### Standing Lateral: side i front identyczne bajtowo z r6; tabela kątów bez zmian (biodro 14,6…26,1°, kolano 11,6°, kostka 5,4°, łokieć 25,7…27,9°).

## 2. Nowe wyjątki strażników
### Side-Lying Quad Stretch, kolano −5,0 cm (tests/figury-recenzja-p2.test.ts, OCZEKUJACE_KOLANO) — FAŁSZYWY ALARM
- Trafienie daje górna noga R (−4,98 w każdej klatce); dolna noga L = 0,00.
- Strażnik liczy w 2D (x, y) i obraca tylko składowe x, y wektora front; przy obrocie −75° front = (0; 0,26; −0,97), czyli prawie cały w osi z, a kostka górnej nogi ma z = 22,4 przy kolanie z = 3,5 — rzut 2D gubi kierunek zgięcia.
- W 3D (knee.mjs): odsunięcie kolana od linii biodro–kostka 39,1 cm, składowa w stronę przodu uda +8,3 (kolano z przodu = zgięcie), znak zgięcia (cross(udo, goleń)·oś boczna) ten sam co w dolnej nodze (0,363 i 0,156), kąt 140,8° — pięta przyciągnięta do pośladka, kostka za biodrem (−15,4 cm wzdłuż front). Brak przeprostu, kolano nad podłogą (y 25,6), nie przechodzi przez dolną nogę (górne udo y ≥ 18,5, dolne ≤ 21,0 w rzucie — naturalne nakładanie w widoku z boku, jak w r6).
- Wyjątek zasadny co do wyniku. Uwaga (luka, NISKIE): lista OCZEKUJACE_KOLANO nie ma zapadki i opisana jest jako „niepoprawione kolano w leżeniu przodem / backlog”, więc poza jest całkiem wyjęta z niezmiennika przeprostu; prawdziwy przeprost tej pozy w przyszłości przejdzie niezauważony.
### Butterfly Stretch, przenikanie nóg (tests/figury-p2-r3.test.ts, WYJATKI_NOGI) — NIEWIDOCZNE, ale opis wyjątku nieścisły
- Strażnik jest trójwymiarowy (kapsuły bodyColliders), nie „w widoku z boku”. Wartości (bf.mjs, wszystkie klatki): udo×udo +1,8 (bez przenikania), goleń×goleń −3,0 (kapsuła r = 5,0 przy odstępie kostek 7,0 cm), stopy (poza strażnikiem) −4,8. Kolana 85,5 cm od siebie, kolano 131°.
- Przyczyna: podeszwy złączone, kostki 7 cm od siebie; kapsuła goleni ma stały promień średni 5,0 (przy kostce realnie 4,2 → nadal −1,4 cm). Model ma kostki trochę za blisko, ale jedyny widok rodziny to bok, gdzie nogi i tak leżą jedna za drugą; rysunek z boku identyczny bajtowo z zatwierdzonym w r6, a ten stan istniał już w r6 (poza i silnik dla Butterfly bez zmian).
- Wyjątek zasadny (nic niewidocznego w aplikacji). Tekst powodu jest błędny w dwóch punktach: mówi o „udzie i goleni” (przenika tylko goleń; udo +1,8) i o „przenikaniu w widoku z boku” (to pomiar 3D). Do poprawy tekstu — NISKIE.

## 3. Werdykt
| Rodzina | Werdykt |
|---|---|
| mobility_floor (9) | nadal zatwierdzone |
| mobility_stand (8) | nadal zatwierdzone |
Brak znalezisk KRYTYCZNYCH, WYSOKICH i ŚREDNICH. Nic nie blokuje.

## Znaleziska
| # | Waga | Pewność | Co | Dowód | Kroki w aplikacji | Realność |
|---|---|---|---|---|---|---|
| 1 | NISKIE | 90% | Powód wyjątku Butterfly opisuje „udo i goleń, w widoku z boku”, a strażnik mierzy 3D i przenika tylko goleń (−3,0; udo +1,8) | tests/figury-p2-r3.test.ts (wpis mobility_floor/Butterfly Stretch/ok); bf.mjs | brak — tylko zapis w teście | teoretyczny (dokumentacja) |
| 2 | NISKIE | 85% | Side-Lying w OCZEKUJACE_KOLANO bez zapadki: poza wyjęta z niezmiennika przeprostu całkowicie, choć to fałszywy alarm 2D; lepiej wpis „FAŁSZYWE” z wartością i zapadką albo strażnik 3D przy |roll| > ok. 45° | tests/figury-recenzja-p2.test.ts:43–46; knee.mjs | brak | teoretyczny (luka mechanizmu) |
| 3 | NISKIE | 85% | r6 #1 bez zmian: ramię dolne Side-Lying −1,9 cm pod linią podłogi | idsB.txt uarmL y −1,9 | Biblioteka → Side-Lying Quad Stretch (po nałożeniu) | brzegowy |

## Lista kontrolna 1–10
1. Przybliżenia bez zmian (Side-Lying wpis z r6). 2. Styk i znikanie — pomiar z SVG jak w r6, wartości identyczne. 3. Rzędy błędów: brak. 4/7. Testy na integracji: figury-mobilnosc-reguly, -pokrycie, figury-recenzja-p2, figury-p2-r3, figures-v2-zgodnosc-wsteczna, figury-jakosc — 1958/1958. 5. Tabele kątów identyczne. 6. PODGLAD-WAZNY w obu katalogach. 8. Styk z podłogą bez zmian. 9. Sprzęt: tylko podłoga/ściana, bez zmian. 10. Bez nowych par.
Poza zakresem (do wiadomości): zapadka 'R5_chwyt_pomocniczy|pull_up' (Dead Hang) ma ocenę „DO OCENY” zamiast werdyktu — tests/figury-mobilnosc-reguly.test.ts.
