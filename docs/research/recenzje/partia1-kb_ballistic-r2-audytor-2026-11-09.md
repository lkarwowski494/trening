# Recenzja niezależna rodziny v2 `kb_ballistic`, runda r2. Audytor, 09.11.2026

**Werdykt rodziny: do poprawy** (1 × WYSOKIE, 0 × ŚREDNIE, 3 × NISKIE). Recenzent: audytor. Nie pisałem tej rodziny ani poprawek (L-047). Autor: programista partii 1.

## Metoda
- SHA autora `0b390518` (gałąź figury/partia-1; poprawki r1 w `4e1a5d7e`, baza diffu testów `4e1a5d7e^`), N = 2. Czysta kopia: `git archive 0b390518` → `/home/user/rev-p1/kb_ballistic-r2` (node_modules jako dowiązanie). Od `4e1a5d7e` do `0b390518` w plikach rodziny (pozy, generator, cue-sets, cueSets.ts, overlay/kb_ballistic.ts, test p1) nie ma zmian. Zmieniły się tylko listy rodzin w families.ts i overlay.ts (scalenia innych rodzin).
- Arkusze własne (38 PNG): `arkusze/slad/` 16 (16 ćwiczeń × side, motyw jasny), `arkusze/slad-dark/` 4 (Kettlebell Clean, Kettlebell Snatch, Double Kettlebell Jerk, Snatch (hantel)), `arkusze/nakladka/` 18 (`--family kb_ballistic`, w tym pozy błędu One-Arm Swings i Sumo). W pełnej rozdzielczości obejrzałem arkusze Kettlebell Clean (kadr u = 0,50–0,65), Snatch (hantel), Sumo High Pull, Double Kettlebell Jerk, Kettlebell Snatch w motywie ciemnym (u = 0–0,65) i pozę błędu Sumo w nakładce. Pozostałe ćwiczenia oceniłem z liczb `frameAt`/`jointAngles`/`odstepCiezaru` (u co 0,05 i co 1/48). Push Press ×2, Split Jerk, Bottoms-Up i swingi są bez zmian ruchu od r1.
- Liczby liczyłem jednorazowymi skryptami w katalogu tymczasowym (poza repo). Test `tests/figures-v2-kb-ballistic-p1.test.ts` w kopii: 67/67 zielony.
- `sha` pochodzą z `node scripts/zrodla-runtime.mjs --skroty`, uruchomionego w kopii.

## Znaleziska

| # | Poziom | Pewność | Realność | Ćwiczenie, widok, kadr | Miara | Kierunek naprawy |
|---|---|---|---|---|---|---|
| W1-r2 | WYSOKIE | 85% | realny (każde otwarcie karty) | Kettlebell Clean, Double Kettlebell Clean, Dumbbell Clean, Kettlebell Snatch, Double Kettlebell Snatch, Snatch (hantel), One-Arm Kettlebell Clean and Jerk; side; u ≈ 0,05–0,7 | Start jest poprawiony: chwyt jest 1,2–3,3 cm za linią kostek, jak w swingu. Ciąg nadal nie jest „blisko ciała”. (a) **Ręka zgina się od razu, w trakcie zawiasu.** Kettlebell Clean: łokieć 19° przy biodrze 80° (u = 0,1), 29° przy 75° (u = 0,25), 59° przy 53° (u = 0,45), 78° przy 37° (u = 0,55). Snatch (hantel) i Kettlebell Snatch: 37° przy biodrze 70° (u = 0,2), 60° przy 53° (u = 0,3). (b) **Ciężar odjeżdża od tułowia na poziomym przedramieniu:** ramię prawie pionowo (łokieć 3–6 cm przed barkiem), łokieć 78–102°, chwyt 23–28 cm przed barkiem. Odstęp ciężaru od ciała: Clean 28,5 / 31,4 / 30,2 / 27,7 cm (u = 0,50–0,65), Snatch 30,6 cm (u = 0,35–0,4), Snatch (hantel) 23,6 cm, Dumbbell Clean 29,8 cm, Clean and Jerk 31,6 cm. W r1 było 34–39 cm, więc poprawa jest niewielka. Na arkuszu (`slad/Kettlebell-Clean-side.png`, u = 0,55–0,65; `slad-dark/Kettlebell-Snatch-side.png`, u = 0,35–0,45) widać uginanie młotkowe z dzwonem przed brzuchem, a potem przewrót do racka. To błąd wymachu („zarzucanie” ciężaru), nie ciąg blisko ciała. Sprzeczność z kartami: Double Kettlebell Clean — „Zrób zamach … jak przy swingu; **po wyproście bioder** przyciągnij je **blisko ciała**”. Snatch (hantel) — „Ręka włącza się **dopiero po wyproście bioder i kolan** — wcześniej tylko luźno trzyma hantel”. Snatch (hantel) nadal startuje z zawisu 56 cm nad podłogą za kostkami (dane identyczne jak Kettlebell Snatch), a karta mówi „Postaw hantel między stopami; zejdź jak do martwego ciągu”. To część W1 z r1, nie poprawiona. Nowy test ciągu tego nie łapie: próg 33 cm (`BODY.farm + BODY.hand`) dopuszcza poziome przedramię przed ciałem. | Łokieć prosty (ręka luźna) do wyprostu bioder (biodro ≤ ok. 15°). Potem łokieć zgina się przy tułowiu, a dłoń jedzie w górę blisko ciała: odstęp ciężaru od tułowia ok. ≤ 15 cm (jak w r1, liczba do potwierdzenia przez badacza). Rwanie: ten sam ciąg, potem wypchnięcie nad głowę. Snatch (hantel): start z hantlem na podłodze między stopami (zawias jak w martwym ciągu), osobny generator zamiast `rwanie(k1())`. Testy: (1) łokieć ≤ ok. 20°, dopóki biodro > ok. 20°; (2) maks. odstęp ciężaru od tułowia w ciągu ≤ próg — miara `odstepCiezaru`, nie wysunięcie przed bark; przypadki negatywne liczone na danych sprzed poprawki, nie na stałych; (3) Snatch (hantel): w u = 0 ciężar ≤ ok. 5 cm nad podłogą. |
| N1-r2 | NISKIE | 90% | teoretyczny (testy) | tests/figures-v2-kb-ballistic-p1.test.ts | „Przypadki negatywne” miar startu i ciągu porównują stałe (`expect(30.4 <= 0).toBe(false)`, pętla po `[37, 49, 58]`) i nie liczą miary na żadnych danych. Nie sprawdzają, że funkcja `wysuniecie` odrzuca złą pozę. Opis testu Dumbbell Clean twierdzi, że „Snatch (hantel) startuje między stopami … (karta: postaw hantel między stopami)”, ale test sprawdza tylko Dumbbell Clean. | Przypadek negatywny jako miara policzona na pozie zmienionej (np. klatka z łokciem 90° i ramieniem pionowo). Opis testu zgodny z tym, co test sprawdza. |
| N2-r2 | NISKIE | 90% | teoretyczny (notatka autora) | Kettlebell Sumo High Pull, zestaw ogólny | STAN-PARTIA-1 („sumo.kneesOut wypada przez CUE_REQUIRES”) i komentarz Ś1 zakładają filtr w czasie działania. `CUE_REQUIRES` sprawdza tylko test strażnika dla squat, bench_press i hinge (`tests/figures-v2-cues.test.tsx:59`). `cueSelection` (`lib/figures/v2/cueSets.ts:26-31`) zwraca `ok` z `cue-sets.json`, gdzie przy Sumo jest `["sumo.kneesOut","hinge.back"]`. Aplikacja pokaże więc „Ruszając z podłogi, wypychaj kolana na zewnątrz…”. Treść pasuje do rysunku (szeroki rozstaw, start przy podłodze), dlatego zestaw przyjmuję. Błędne jest tylko założenie autora. Analogicznie `CUE_NOT_IN_FAMILY` działa dzięki temu, że id zostały usunięte z JSON, nie dzięki filtrowi w czasie działania. | Poprawić notatkę. Jeśli wskazówka ma wypadać — usunąć ją z JSON albo objąć strażnikiem rodzinę kb_ballistic. |
| N3-r2 | NISKIE | 85% | realny | Zestaw ogólny `oly`: Kettlebell Clean, Kettlebell Snatch, Double Kettlebell Snatch, Dumbbell Clean, Bottoms-Up, One-Arm Kettlebell Clean and Jerk | Po Ś1 zestaw ma jedną wskazówkę („Na starcie plecy proste, klatka do góry.”) i pusty błąd. Wskazówka jest poprawna i zgodna z rysunkiem (kręgosłup 0° na starcie), a pusta sekcja błędów się nie wyświetla (`components/ExerciseCues.tsx:34`, `.filter(s => s.items.length)`). Zestaw nie jest błędny, ale jest ubogi. Nic nie mówi o tym, co w tych ćwiczeniach najważniejsze (biodra, ciężar blisko ciała). | Neutralny zestaw dla kettlebella i hantla (badacz + tłumacz): „ciężar blisko ciała”, „siła z bioder”, błąd „ciężar odjeżdża / ręce ciągną za wcześnie”. Backlog 1.1/1.2. |

Bez zgłoszenia (pewność < 80%, pytanie do badacza jak w r1): Kettlebell Snatch, Double Kettlebell Snatch i Snatch (hantel) kończą w u = 1 w ugięciu (kolano 28,3°, biodro 25,4°), bez wstania. Wcześniej, w u = 0,6–0,8, jest wspięcie na palce (kostka −8 → −33°), kiedy chwyt jest już na wysokości 134–193 cm.

## Weryfikacja poprawek r1
| Poprawka | Stan |
|---|---|
| W1 start | zrobiona dla 6 ćwiczeń kettlebella (chwyt −1,2 … −3,3 cm za kostkami, odstęp od nóg 4–7 cm) i dla Dumbbell Clean (hantle po bokach, 22,8 cm przed kostką). Snatch (hantel) **nie** (nadal zawis, karta: z podłogi) |
| W1 ciąg | niezrobiona w sensie ruchu (W1-r2): odstęp spadł z 34–53 do 24–31 cm, ręka ciągnie od początku |
| Ś1 | zrobiona w danych: `cue-sets.json` bez oly.close/legs/mis przy 13 ćwiczeniach rodziny. Uwagi N2-r2, N3-r2 |
| N1 | zrobiona: Double i One-Arm Jerk w u = 1 — kolano 0°, łokieć 10,6°, chwyt 62,6 cm nad barkiem; drugie ugięcie z zablokowanymi łokciami przed wstaniem (arkusz u = 0,70–0,95) |
| N2 | zrobiona: Sumo bez zatrzymania w pół zawiasu, ślad pionowy (odchyłka 2,8 cm, skok maks. 2,6 cm na 1/48), wspięcie na palce na górze ciągu |
| N3a | zrobiona: Push Press ×2 w `pp_ugiecie` |
| N3b | test dodany, ale za luźny (W1-r2, N1-r2) |
| N4 | otwarte (Kettlebell Pirate Ships bez wpisu w figury-wyjatki.json) — decyzja koordynatora, bez zmiany oceny |

## Uwagi do testów (K14, `git diff 4e1a5d7e^..0b390518 -- tests/`)
| Zmiana | Ocena |
|---|---|
| `pp_ugiecie` obejmuje Push Press | zaostrzenie, uzasadnione |
| test startu (chwyt ≤ linia kostek; Dumbbell Clean ≤ 25 cm) | uzasadniony; brak przypadku Snatch (hantel) z podłogi (W1-r2) |
| test ciągu `wysuniecie ≤ BODY.farm + BODY.hand` (33 cm) | nieuzasadniony jako strażnik K5: próg dobrany tak, że przepuszcza obecny błąd (27–28 cm przed barkiem przy poziomym przedramieniu) |
| przypadki negatywne na stałych | słabe (N1-r2) |
| skok śladu: 18 cm → 3 × `CONTRACT.maxJump` (= 18 cm), dla Clean and Jerk 3 × `maxJumpDynamic` (= 48 cm) na 0,05 | uzasadnione przez kontrakt (ćwiczenie „dynamiczne” w danych sensu). Pomiar: maks. 20,8 cm na 0,05 (8,9 cm na 1/48 < 16). Po poprawce W1 warto wrócić do 18 cm, jeśli zarzut przestanie być ściśnięty w u = 0,25–0,45 |
| tor-wyjatki.json: 7 nowych pomiarów (Clean 29,0; Double Clean 29,9; Dumbbell Clean 19,2; Snatch 40,2; Double Snatch 41,9; Snatch (hantel) 40,2; Clean and Jerk 33,7) | nie przyjmuję dla 7 ćwiczeń W1-r2 (łuk z wymachu, nie cecha ruchu). Jerk ×2 (18,0) i Sumo (2,8) przyjmuję |

## Nakładka (K9)
Bez zmian od r1 w `overlay/kb_ballistic.ts`. Elementy tylko przy Swing, One-Arm Swings (kbBackRef, kbHipLimb) i Sumo (kbBackRef), w płaszczyźnie side. Poza błędu Sumo (data:0, mis.roundBack) koloruje linię pleców, a znacznik leży na środku kręgosłupa (`nakladka/Kettlebell-Sumo-High-Pull-side-data-0.png`). Pozostałe 13 ćwiczeń bez elementów. Bez znalezisk.

## Zestawy ogólne (K12)
- One-Arm Kettlebell Swings (`kbSwing`), Double i One-Arm Kettlebell Push Press (`pushPress` z ohp.mis.lock), One-Arm Kettlebell Split Jerk (`pushPress`: pp.legs): ruch bez zmian od r1, zgodne. **wyswietlana**.
- Kettlebell Sumo High Pull (`oly`: sumo.kneesOut, hinge.back; błąd mis.roundBack): zgodne z rysunkiem po N2. **wyswietlana** (uwaga N2-r2).
- Bottoms-Up Clean From The Hang Position (`oly`: oly.back): ruch bez zmian od r1 (wyświetlana), wskazówka zgodna. **wyswietlana** (uwaga N3-r2).
- Kettlebell Clean, Kettlebell Snatch, Double Kettlebell Snatch, Dumbbell Clean, One-Arm Kettlebell Clean and Jerk: tekst zestawu jest poprawny, ale ruch jest do poprawy (W1-r2). **Bez wpisu**: zestaw ocenia się wobec rysunku po poprawce.
- One-Arm Kettlebell Jerk: wpis istnieje, sha cb9bd7c3e35d zgodne z `--skroty`; po N1 ruch nadal zgodny z pp.dip i pp.legs.

## Karty (K10, K11)
- Kettlebell Swing (karta własna bez wpisu „karty”): ruch bez zmian od r1, zgodna. **wyswietlana** (sha aa1b9306d7dd).
- Istniejące wpisy „karty”: Double Kettlebell Clean 9741b4eba017, Snatch (hantel) 4324b03aab39, Double Kettlebell Jerk 15a14aabe7a5 — zgodne z `--skroty`. Treść kart jest poprawna. Z kartą sprzeczny jest rysunek zarzutu i rwania (W1-r2). Double Kettlebell Jerk jest po N1 zgodny z kartą („…i wstań”).
- K10: v1 Kettlebell Swing (wyswietlana, a7fcbadd5b3f) **zostaje bez zmiany**, bo rodzina v2 nie dostaje werdyktu „wyswietlana”. Zmiana na `zastapiona` dopiero w rundzie, w której v2 zostanie przyjęta.

## Tabela ćwiczeń
| Ćwiczenie | Werdykt | Uwagi |
|---|---|---|
| Kettlebell Swing | wyswietlana | bez zmian od r1 |
| One-Arm Kettlebell Swings | wyswietlana | bez zmian od r1 |
| Kettlebell Clean | do poprawy | W1-r2 (łokieć 59° przy biodrze 53°; odstęp 31,4 cm, u = 0,55) |
| Double Kettlebell Clean | do poprawy | W1-r2, sprzeczne z kartą („po wyproście bioder … blisko ciała”) |
| Dumbbell Clean | do poprawy | W1-r2 (odstęp 29,8 cm) |
| Bottoms-Up Clean From The Hang Position | wyswietlana | bez zmian od r1 |
| Kettlebell Snatch | do poprawy | W1-r2 (odstęp 30,6 cm, u = 0,35–0,4) |
| Double Kettlebell Snatch | do poprawy | W1-r2 |
| Snatch (hantel) | do poprawy | W1-r2: start z zawisu zamiast z podłogi, ręka przed wyprostem bioder — sprzeczne z kartą |
| Double Kettlebell Push Press | wyswietlana | bez zmian |
| Double Kettlebell Jerk | wyswietlana | N1 z r1 poprawione |
| One-Arm Kettlebell Push Press | wyswietlana | bez zmian |
| One-Arm Kettlebell Jerk | wyswietlana | N1 z r1 poprawione |
| One-Arm Kettlebell Split Jerk | wyswietlana | bez zmian |
| Kettlebell Sumo High Pull | wyswietlana | N2 z r1 poprawione |
| One-Arm Kettlebell Clean and Jerk | do poprawy | W1-r2 (część zarzutu, odstęp 31,6 cm) |
| Kettlebell Pirate Ships | bez rysunku | N4 z r1 otwarte |

## Obszary bez znalezisk
Ślad w chwycie (test p1: ≤ 3 cm, 67/67) • przenikanie (Double Clean / Double Snatch min −0,3 / −0,4 cm, < 1 cm) • skoki toru (maks. 5,8 cm na 1/48; Clean and Jerk 8,9 < limit dynamiczny 16) • orientacja kettlebella (rack, nad głową) bez zmian od r1 • motyw ciemny (Kettlebell Snatch, kontrast figury i śladu) • nakładka • sha istniejących wpisów „karty” i „zestawy” zgodne z `--skroty`.
