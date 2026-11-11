# Recenzja niezależna ruchu: P3-MARSZ (Lateral Band Walk, Monster Walk), 11.11.2026

- Recenzent: audytor (L-047; autor: programista W-02 C). Stan: `w02/c-rozjazdy` @ `ca901dbf`. Pracowałem na czystej kopii poza repo. Oba wpisy usunąłem z `WYJATKI` i uruchomiłem `run.mjs --rodzina hip_abd_add --zastosuj` (wynik: 6/6 OK, ostrzeżenie „NA KRAWĘDZI Lateral Band Walk: polprzysiad”).
- Arkusze śladu (21 kadrów co 0,05, obejrzane w pełnej rozdzielczości 2100×900): rzut z przodu (jedyny widok w `spec.views`) i, poza aplikacją, rzut z boku przez kopię `arkusz-slad.mjs` z innym widokiem. Arkusze z przodu są bajtowo równe arkuszom autora (`cmp`: `docs/research/recenzje/p3-marsz/*-front.png` na gałęzi).
- Pomiar: szkielet z `v2.frameAt`, czyli kostka, kolano i palce każdej klatki oraz kąt zgięcia kolana.

## Werdykt

| Ćwiczenie | Werdykt |
|---|---|
| Lateral Band Walk | **do poprawy** (W-1; ruch poza tym przyjęty, uwagi Ś-1 i N-1) |
| Monster Walk | **do poprawy** (W-1, W-2) |

## Znaleziska

| ID | Poziom | Pewność | Ćwiczenie | Opis i dowód | Kroki w aplikacji | Realność |
|---|---|---|---|---|---|---|
| W-2 | WYSOKIE | 85% | Monster Walk | Aplikacja pokazuje tylko rzut z przodu (`spec.views = ['front']`), a rzut jest prostokątny, więc ruch w osi x (do przodu) jest niewidoczny. Pomiar: stopa podporowa stoi w z = ±14 (x 12 → −12, niewidoczne). Stopa przenoszona odrywa się, odchodzi w bok do z = ±36 (u 0,25 i 0,75) i ląduje z powrotem w z = ±14, czyli w tym samym miejscu na rysunku. Na arkuszu z przodu widać więc na przemian unoszenie nogi w bok i odstawienie jej na to samo miejsce: to wahadło każdej nogi, które odrzuciła recenzja H-2. Kroku „po skosie w przód” i przesuwania się do przodu nie widać. W rzucie z boku krok do przodu jest poprawny (24 cm, uniesienie 8 cm), ale tego widoku w aplikacji nie ma. Przy podwójnym podparciu stopy stoją wąsko (kostki 28 cm, nie 37–52 cm, jak podaje brief; `krokPotwor`: `ZW = 14`). Łuk na zewnątrz w połowie przenoszenia to raczej zakreślanie nogą niż krok po skosie. | Ćwiczenie Monster Walk → rysunek | realny |
| W-1 | WYSOKIE | 95% | oba | Pętla jest zamknięta (u = 0 ≡ u = 1), a w `ONE_WAY_STATIC` (lib/figures/v2/anim.ts:29) nie ma wpisu. Dlatego `staticPositions` zwraca [0, 1] (figure.ts:149), a przy „Ogranicz ruch”, pauzie i na zrzutach pojawiają się dwie identyczne pozy z podpisami „Pozycja wyjściowa” i „Pozycja końcowa”. Kroku w ogóle nie widać, a to bariera dostępności. Strażnik r4-W1 to łapie: po zdjęciu wstrzymania na kopii padają testy `tests/figures-v2-delt-raise-p4.test.tsx` „Lateral Band Walk: pozycje statyczne parami różne”, „Monster Walk: …” i liczba 65. Ścieżka zdjęcia wstrzymania opisana w WYJATKI („usunąć wpis, run.mjs --zastosuj, przeliczyć skróty”) nie przejdzie verify. Potrzebny jest wpis w `ONE_WAY_STATIC`, np. LBW: u 0 (start) i 0,5 (szeroko 54 cm); Monster: u 0 i 0,25 (noga w kroku). | Ustawienia iOS → Ogranicz ruch → ćwiczenie → rysunek | realny (dostępność) |
| Ś-1 | ŚREDNIE | 90% | Lateral Band Walk | Stopa podporowa ślizga się w poprzek po podłodze o 13 cm na pół cyklu (L: z −14 → −27 przy u 0 → 0,5; R: 27 → 14 przy u 0,5 → 1), a w rzucie z przodu widać to wprost. W carry poślizg idzie w osi x, więc w rzucie z przodu go nie widać. Nie ma też chwili, w której obie stopy stoją nieruchomo. Jest to konwencja „bieżni” zapisana w backlogu P3-MARSZ, więc nie blokuje. Ruch czyta się jako „krok w bok i dostawienie”, tylko z suwem stopy. | ćwiczenie → rysunek | realny, konwencja |
| N-1 | NISKIE | 85% | oba | Tempo: `ONE_WAY.repMs` = 1500 ms na dwa kroki plus po 500 ms pauzy na początku i końcu. Daje to ok. 0,75 s na krok i zatrzymanie co dwa kroki. Dociąganie nogi (`bw.move`: „powoli dociągnij drugą nogę”) trwa tyle samo co krok. Brak wpisu w `ONE_WAY_REP_MS`. To konwencja bez źródła. | rysunek | realny, kosmetyka |

Informacja dla zdejmującego wstrzymanie (nie są to znaleziska): na kopii padają też `figures-v2-data.test.tsx` („frameAt z danych”: oczekuje faz wahadła dla rodziny z DATA_UI, a `phasesFor` zwraca jedną fazę „Marsz” bez sekund, co jest poprawne), `figury-partia-3.test.ts` (marsze „bez rysunku”) i `v2-gen --check` (skróty). Testy trzeba zmienić razem ze zdjęciem wstrzymania.

## Sprawdzone bez znalezisk

- Lateral Band Walk: półprzysiad trzymany (kolano podporowe 58°; noga przenoszona do 77° przy unoszeniu, co jest naturalne dla nogi w powietrzu). Tułów stały: pochylenie 20° we wszystkich kadrach, miednica bez przesunięcia bocznego (z = 0), wysokość 76,9–79,1 cm. Kolana nie uciekają do środka (u 0,5: kolano ±25,5 przy kostce ±27, piszczel prawie pionowo). Guma stale napięta (kostki 28 → 54 → 28 cm, czyli ≥ ok. 1,6 × szerokość bioder). Zawsze jedna stopa na podłodze, palce y ≥ 0, brak przenikania. Krok prawą w bok i dostawienie lewej zgadza się z `bw.setup`, `bw.move`, `bw.squat`, `bw.tension` i `bw.mis.sway` (lib/cues/text/pl.json:36, 677–680) oraz z regułami rodziny (polprzysiad, tulow_stoi, krok_w_bok, miednica_bez_przechylu w `data/zrodla/figury-sens.json`).
- Tryb `jednokierunkowa` zamiast `cykl_lustro`: poprawny. Lustro odwracałoby kierunek kroku, co jest wahadłem z H-1. Pętla w jedną stronę to wiernie pokazany marsz w jedną stronę. Faza „Marsz” to jedna faza bez sekund (figure.ts:214, `oneWayPhases`).
- Monster Walk w rzucie z boku: tułów stały, półprzysiad, stopa podporowa na podłodze (y = 7), przenoszona unosi się do 8 cm, nigdy obie w powietrzu, kolana nie schodzą do środka (u 0,25: kolano z −30,3 na zewnątrz linii biodro–kostka −19,7). Zestaw `bandWalk` (`bw.squat`, `mis.jerk`) zgadza się z ruchem.
- Pozy statyczne same w sobie są sensowne (LBW u = 0: stopy nieco szerzej niż biodra w półprzysiadzie; Monster u = 0: rozkrok w kroku), ale są identyczne (W-1).

## Pole `slad`

Arkusze arkusz-slad w rzucie z przodu (widok aplikacji) i z boku (kopia skryptu z innym widokiem), 21 kadrów co 0,05, pełna rozdzielczość, po zdjęciu WYJATKI na kopii @ca901dbf. Ślad toru ciężaru to w tych ćwiczeniach punkt miednicy (`info.trail`), stały, bez ciężaru (odstęp −11,9 cm bez znaczenia). Linia przerywana między kostkami to guma. Tor stóp zmierzony z `frameAt`: LBW kostki z 14 → 27 → 14 (szerokość 28 → 54 → 28 cm), uniesienie 7 cm, stopa podporowa przesuwa się 13 cm w z. Monster: stopa podporowa x 12 → −12 przy z = ±14, przenoszona łukiem do z = ±36 i z powrotem do ±14, uniesienie 8 cm; w rzucie z przodu krok do przodu niewidoczny (W-2).
