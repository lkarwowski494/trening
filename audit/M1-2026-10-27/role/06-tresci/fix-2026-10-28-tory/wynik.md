# Recenzja niezależna ruchu po naprawie torów (28.10.2026)

Bramka 4, L-047 A. Autor zmiany: koordynator M2 (commit 9883ada, gałąź naprawy/M2-tory-2026-10-28). Recenzent: agent recenzent ruchu w osobnej sesji. Kodu nie zmieniałem.

## Werdykt

| Rodzina | Werdykt | Ćwiczeń | Skrót (v2) |
|---|---|---|---|
| hinge | **wyswietlana** | 32 (20 zmienionych, 12 bez zmian piksel w piksel) | a97961c2e618 |
| bench_press | **wyswietlana** | 30 (4 Smith zmienione, 26 bez zmian bajt w bajt) | 39b505a17e9b |

Wpis zapisany w `docs/research/figury-recenzja.json` (v2.hinge, v2.bench_press), commit **33d92b2** na gałęzi naprawy/M2-tory-2026-10-28 (niewypchnięty).

## Co obejrzałem

- Arkusze z `podglad-v2.mjs` (u 0; 0,25; 0,5; 0,75; 1, `--cols 1`): przed (HEAD~1 = f5af3be, tymczasowy worktree, już usunięty) i po (9883ada).
- Własny podgląd powiększony (widok z boku 3,2×, z przodu 1,6×) ze śladem toru (`trailFor`, linia przerywana) i pionem środka stopy (`plumbMidfoot`), każde ćwiczenie hinge oraz 4 Smith z bench_press, przed i po. Do tego liczby z silnika (x ciężaru w 25 klatkach, kształt toru, zgięcie kolana, luz do nogi według `contactX`, położenie szyny).
- Porównanie przed/po: różnicę pikseli liczyłem na pełnej rozdzielczości (PIL `ImageChops`), a `cmp` na kadrach z arkusza.

## Wyniki (po naprawie)

- **Martwe ciągi ze sztangą lub linką** (Deadlift (sztanga), Axle, Clean, Bands, Chains, Reverse Band, Deficit, Snatch, Cable Deadlift): „S” usunięte. Wcześniej odchylenie 4,2–5,6 cm i 2 zawrócenia, teraz gładki łuk 3,1–3,6 cm z 1 zmianą kierunku. Start wypada 1,4–2,6 cm przed środkiem stopy (wskazówka dl.feet), gryf jest przy goleniach (luz 0,2 cm) i nie przenika nóg (dl.close). Pozy kolan, tułowia i rąk są naturalne, ręce proste, widok z przodu poprawny.
- **Rack Pull (+Bands), RDL (sztanga), Stiff-Legged Barbell, Single Leg RDL (linki):** tor prawie pionowy (odchylenie 0,3–0,6 cm). Wcześniej było 5,4–6,4 cm, z jednym zawróceniem w RDL.
- **Smith Stiff-Legged:** szyna stoi (13,8 cm), gryf jest na szynie w każdej klatce.
- **Smith ×4 (bench_press):** szyna stoi w punkcie dotyku i gryf jedzie pionowo. Wcześniej tor był ukośny na 15–18 cm, a szyna jechała z gryfem. Na górze ręce są proste nad punktem dotyku, dotyk na klatce zgadza się z wariantem (płasko, wąsko, skos dodatni i ujemny).
- **Bez zmian** (identyczne z wersją zrecenzowaną 27.10): Deadlift (hantle), Trap Bar, Leverage, Rickshaw, One-Arm Side, Good Morning ×3, RDL (hantle/linki), Single Arm RDL, Single Leg RDL (hantel), Cable Pull Through. Poprawka nic w nich nie zepsuła.

## Uwagi NISKIE (backlog, nie blokują)

1. **Sumo Deadlift, Sumo with Bands, Sumo with Chains, Reverse Band Sumo (u 0→1)**: tor jest gładki (0,8 cm), ale idzie ukośnie w przód o 8 cm: start 2 cm za pionem środka stopy, wyprost 6 cm przed nim. To samo w **Sumo Deadlift (kettlebell)**: 6 cm, wyprost 4 cm przed pionem. Mieści się w progu rozrzutu ≤ 10 cm. Przed naprawą był tu skok o 7 cm w ostatniej ćwiartce ruchu, więc to poprawa.
2. Zaczepy, które jadą z ciężarem (ta sama klasa co dawna szyna Smitha, ale mniej widoczna):
   - **Reverse Band Deadlift / Reverse Band Sumo (u 0→1):** górny zaczep gumy przesuwa się o 3,4 / 8 cm.
   - **Cable Deadlift:** bloczek przy podłodze przesuwa się o 3,7 cm.

   Przed naprawą przesuw w Reverse Band Deadlift i Cable Deadlift był większy (8,5–9 cm), a w Reverse Band Sumo podobny (6,7 cm), tylko skokowy.
3. **Smith Stiff-Legged (u 0,75–1):** szyna stoi 7,3 cm przed środkiem stopy, na dole gryf jest do 6 cm przed goleniami. To skutek pionowej szyny i dla maszyny jest poprawne.
4. **RDL / Stiff-Legged (u 1):** ramiona odchylone od pionu w przód. Tak było już przed naprawą.

## Testy

- `npx jest tests/figures-v2-tor.test.ts tests/figury-1-0-recenzja.test.ts tests/figures-v2-geometry.test.ts tests/figury-recenzja.test.tsx --maxWorkers=1`. Przed aktualizacją wpisu: 80/81, czerwony był tylko znany test skrótu recenzji.
- Po aktualizacji wpisu `npx jest tests/figury-recenzja.test.tsx tests/l047-recenzja-niezalezna.test.ts --maxWorkers=1`: 35/35.

## Arkusze (scratchpad, nie w repo)

- Przed: `/tmp/claude-0/-home-user-trening/b36608ff-66bc-5613-a921-d96ac9b608e9/scratchpad/recenzja-torow/przed/` (hinge-light-0..3.png, bench_press-light-0..3.png)
- Po: `/tmp/claude-0/-home-user-trening/b36608ff-66bc-5613-a921-d96ac9b608e9/scratchpad/recenzja-torow/po/`
- Powiększenia ze śladem toru: `/tmp/claude-0/-home-user-trening/b36608ff-66bc-5613-a921-d96ac9b608e9/scratchpad/recenzja-torow/duze-przed/` i `/tmp/claude-0/-home-user-trening/b36608ff-66bc-5613-a921-d96ac9b608e9/scratchpad/recenzja-torow/duze-po/` (hinge/, bench/; plik liczby.json)
