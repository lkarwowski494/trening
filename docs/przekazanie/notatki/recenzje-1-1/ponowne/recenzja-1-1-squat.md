# Recenzja 1.1 rodziny squat (25 ćwiczeń): ruch, ślad toru (krok 11, L-050) i treść kart. 29.10.2026, recenzent 1.1 squat

Oceniany stan: `integracja-1-1` @ 15e3ab45 (worktree tylko do odczytu `/home/user/wt/rec-1-1`). Rodzina jest rysowana z rigu (`lib/figures/v2/rigs/squat.ts`, `variants.ts`). Bieżący skrót v2 rodziny to **e0d218c608c3**. Wpis z 1.0 ma fd142e983e89, więc dziś rodzina jest ukryta (fail-closed).

Nie czytałem opisów poprawek, komunikatów commitów, README podglądów ani komentarzy generatorów. Kod rigu porównałem tylko jako różnicę 6a9dd655 → HEAD.

Wcześniejsze recenzje przeczytałem: `recenzje-1-1/squat.md` i `ponowne/1-0-squat-bench.md`.

**Render własny: 13 klatek (u = 0…1, krok 1/12) × 2 widoki (side, front) × poza poprawna i każdy rząd błędu.**
- Wall Sit jest statyczny: 1 klatka × 2 widoki.
- Na każdą klatkę nałożony jest pełny ślad `trailFor` (ten sam, który rysuje `ExerciseFigureV2`).
- Razem 25 arkuszy, czyli 300 klatek pozy poprawnej plus rzędy błędów.
- Skrypt: `slad-1-1-squat/render-recenzenta.mjs`. Silnik ładuje `loadV2` (bez bramki, `figureSpec`), PNG robi playwright.
- Liczby (tor na 25 próbkach jak w `tests/figures-v2-tor.test.ts`, kąty R/L min…max, położenia w u = 0 / 0,5 / 1) są w `slad-1-1-squat/liczby-squat.json`.
- Kadry powiększałem do 3× przy Zercher, Goblet, Dumbbell i Front Squat.
- Współrzędne: x w przód, y w górę, z w prawo, cm.

## Podsumowanie

| | liczba |
|---|---|
| OK | **8** |
| OK z uwagą | **14** |
| BŁĄD | **3** (2 × WYSOKIE, 1 × ŚREDNIE) |

- **Wcześniejsze BŁĘDY usunięte:**
  - B1 Front Squat (rack): łokieć −1,2 cm od wysokości barku, 31 cm przed barkiem, odwiedzenie 0,6–11°, bark-sag 83–87°. Zgadza się z `fsq.rack` „ramiona mniej więcej poziomo”. Z przodu łokcie celują w widza.
  - B2 Reverse Band Box/Power Squat: guma idzie od kotwicy y 175 do końców gryfu (`hang`).
  - Guma przez ciało (4 ćwiczenia) i linka w Dip Belt: naprawione już w 1.0, bez regresji.
- **Reguły sensu:** `sens-gotowe.mjs --rodzina squat` daje 0 naruszeń na 25 figurach. W `tests/sens-wyjatki-1-1.json` (38 par, 35 ćwiczeń) **nie ma żadnego ćwiczenia z rodziny squat**, więc nie było nic do rozstrzygania.
- **Jakość:** `jakosc-raport.mjs` w rodzinie squat zgłasza tylko `klatki_rozne` dla Wall Sit. To fałszywy alarm, bo Wall Sit jest statyczny (izometria).
- **Stopy:** pięty i palce mają y = 0 we wszystkich klatkach pozy poprawnej (25/25). W Box Squat miednica na dole jest w y 54 przy wierzchu skrzyni 45 (siad).
- **Nowe BŁĘDY:** Zercher Squat i Sumo Squat (hantel) mają WYSOKIE, Landmine Squat ma ŚREDNIE. Opis niżej.

**Czy rodzina może dostać wpis „wyswietlana”:**
- Tak dla **23 z 25** ćwiczeń, pod warunkiem że **Zercher Squat** i **Sumo Squat (hantel)** trafią do `V2_WSTRZYMANE` (lib/figures/v2/figure.ts) do czasu poprawki rigu.
- `figure.ts` nie wchodzi do skrótu rodziny, więc wstrzymanie nie zmienia e0d218c608c3.
- Druga możliwość: poprawić rig przed wpisem. To jednak zmienia skrót i wymaga ponownej recenzji zmienionych ćwiczeń.

## Tabela

Skróty w kolumnie „ślad”: odch. = odchylenie od prostej między końcami (cm), zawr. = zmiany kierunku w poziomie. Widok z przodu ma we wszystkich ćwiczeniach tor pionowy (0 cm, 0 zawr.).

| Ćwiczenie | Ruch | Ślad (side) | Treść | Werdykt | Szczegóły |
|---|---|---|---|---|---|
| Back Squat | OK | pion nad śródstopiem x 6,5; 0 / 0 | OK (własna) | **OK** | biodro do 119°, kolano 118° (udo ≈ poziomo, `sq.depth`). Błędy kneesIn i heels widoczne i różnią się tylko błędem |
| Front Squat | OK | 3,3 cm / 0: gryf startuje 3,3 cm przed śródstopiem, od u = 0,25 pion | OK (`fsq.rack`, `fsq.elbows` zgodne z obrazem) | **OK z uwagą** | B1 naprawione. Uwaga NISKIE: mały „haczyk” toru na starcie (pod progiem 4 cm) |
| Goblet Squat | OK | 6,1 cm / 3 (mikro, ≤ 0,5 cm): hantel cofa się 9 cm do u ≈ 0,6, dalej pion. Na obrazie gładki łuk, „S” niewidoczne | **uwaga**: `gob.hold` mówi „łokcie blisko tułowia”, a łokcie są 14–18 cm na zewnątrz od barku (z 33–37 przy barku 19; z przodu „łokcie w bok”) | **OK z uwagą** | U1, U2 |
| Przysiad z pasem (linki) | OK | 8,6 cm / 0: ślad pokazuje **biodra** (punkt `load` = pas), łuk w tył | OK (własna) | **OK z uwagą** | wyjątek toru zasadny (ciężar na pasie); U5 |
| Box Squat | OK | pion; 0 / 0 | OK (zestaw ogólny) | **OK** | siad na skrzynię 45 cm |
| Wall Sit | OK (statyczny) | brak śladu (izometria) | OK (własna; `wall.breath` bez wstrzymywania oddechu) | **OK** | plecy przy ścianie, kolano 89° |
| Cable Squat | OK | 5,1 cm / 2 (mikro): uchwyt cofa się 8 cm, potem pion | OK | **OK z uwagą** | U1 |
| Bodyweight Squat | OK | 4,3 cm / 1: ślad **dłoni** (bez ciężaru) ma widoczną falę „S” | OK | **OK z uwagą** | U3 |
| Smith Machine Squat | OK | pion; szyna stoi (x −7,5), gryf na szynie | OK | **OK** | stopy przed gryfem, typowo dla maszyny Smitha |
| **Zercher Squat** | **BŁĄD** | **9,9 cm / 0**: gryf cofa się 11,6 cm w pierwszych 40% zejścia („haczyk”), potem pion | OK (zestaw ogólny), ale rysunek gubi cechę ćwiczenia | **BŁĄD (WYSOKIE)** | Z1 |
| Double Kettlebell Front Squat | OK | 3,7 cm / 0 (haczyk na starcie, pod progiem) | OK | **OK z uwagą** | NISKIE, jak w Front Squat |
| Landmine Squat | **BŁĄD (geometria sprzętu)** | 4,8 cm / 2 | OK | **BŁĄD (ŚREDNIE)** | L1 |
| **Sumo Squat (hantel)** | **BŁĄD** | **7,3 cm / 0, tor ukośny: dx −24,2 cm przy dy −50 cm** | OK (bez animacji błędu, bo kneesIn nie dotyczy `dbSumo`) | **BŁĄD (WYSOKIE)** | S1 |
| Box Squat with Bands | OK | pion | OK | **OK** | dwie gumy przy końcach gryfu do podłogi |
| Box Squat with Chains | OK | pion | OK | **OK** | łańcuchy przy końcach gryfu |
| Reverse Band Box Squat | OK | pion | OK | **OK z uwagą** | B2 naprawione; U4 |
| Reverse Band Power Squat | OK | pion | OK | **OK z uwagą** | B2 naprawione; U4 |
| Squat with Bands | OK | pion | OK | **OK** | |
| Squat with Chains | OK | pion | OK | **OK** | |
| Barbell Hack Squat | uwaga | 8,6 cm / 0: gryf odjeżdża 22 cm w tył (x −6 → −28), łukiem | OK (zestaw `hingeFloor`: plecy proste, kolana w linii palców, błąd: zaokrąglone plecy; widoczny) | **OK z uwagą (ŚREDNIE)** | H1 |
| Overhead Squat | OK z uwagą | pion nad śródstopiem | OK | **OK z uwagą** | uwaga A z 1.1 bez zmian: bark-sag 190–197° |
| Dumbbell Squat | uwaga | 3,6 cm / 3 (mikro) | OK | **OK z uwagą** | U6 |
| One-Arm Overhead Kettlebell Squat | OK z uwagą | pion | OK | **OK z uwagą** | uwaga A: bark 183–198° |
| Dip Belt Squat | OK | 8,6 cm / 0: ślad bioder (pas), odważnik zwisa pod nim | OK | **OK z uwagą** | U5 |
| Band Squat | OK z uwagą | 4,3 cm / 1: fala „S” śladu dłoni | OK | **OK z uwagą** | uwaga B z 1.1 bez zmian (guma do wyciągniętych rąk); U3 |

## BŁĘDY

### Z1. Zercher Squat: gryf na dole nie leży w zgięciach łokci, a tor ma haczyk (WYSOKIE)

**Co jest źle (liczby, bok):**

| u | gryf (x; y) | łokieć R (x; y) | gryf–łokieć | gryf–przedramię |
|---|---|---|---|---|
| 0 | (18,1; 114,2) | (9,3; 116,6) | 9,1 cm | — |
| 0,5 | — | — | 7,5 cm | — |
| 0,75 | — | — | 14,6 cm | — |
| 1 | (6,5; 63,1) | (20,3; 75,4) | **18,5 cm** | 12,2 cm |

- W u = 1 przedramiona leżą poziomo ok. 12 cm **nad** gryfem, a gryf leży na udach. Ręce go nie trzymają.
- Na powiększonym kadrze u = 1 piasta gryfu jest wyraźnie pod rękami (arkusz `Zercher-Squat-slad.png`, ostatnie klatki obu rzędów side).
- Tor: x 18,1 → 6,5 do u = 0,42, potem pion. Odchylenie 9,9 cm, czyli 2,5 × próg 4 cm, i widoczny haczyk na górze śladu.

**Jak powinno być:** cecha rozpoznawcza Zercher to gryf w zgięciach łokci przez cały ruch, z łokciami przed tułowiem. Tor gryfu jest mniej więcej pionowy.

**Kroki w aplikacji:** Biblioteka → Zercher Squat → Technika → animacja z boku, dół ruchu.

**Pewność i realność:** pewność 85%, realny (każde wyświetlenie).

**Reguła łapie?** Nie. Brakuje reguły „ciężar podparty: gryf ≤ r_gryfu + r_ramienia + 1 cm od przedramienia lub łokcia”. Tor ma w `tests/tor-wyjatki.json` wyjątek „stan zastany … do oceny”. Ta ocena: **wyjątek niezasadny**.

### S1. Sumo Squat (hantel): hantel jedzie ukośnie w tył o 24 cm (WYSOKIE, krok 11: „ucieczka” toru)

**Co jest źle (liczby, bok):**

| u | chwyt (x; y) | bark (x; y) |
|---|---|---|
| 0 | (26,6; 87,3) | (8,2; 136,3) |
| 1 | (2,4; 37,1) | (10,1; 88,9) |

- W u = 0 ramię jest wychylone ok. 20° w przód, jakby trzymało hantel w unoszeniu przodem. W u = 1 dłoń jest 7,7 cm za barkiem.
- Ślad to ukośna prosta pod kątem ok. 26° od pionu, od przodu-góry do tyłu-dołu. Ten sam punkt `load` rysuje aplikacja.

**Jak powinno być:** hantel zwisa na prostych rękach pionowo pod barkami, między nogami, i jedzie mniej więcej pionowo w dół.

**Kroki w aplikacji:** Biblioteka → Sumo Squat (hantel) → Technika → animacja z boku (ślad toru widoczny w każdej klatce).

**Pewność i realność:** pewność 80%, realny.

**Reguła łapie?** Częściowo. Test toru mierzy odchylenie od prostej między końcami, a ukośna prosta je spełnia (7,3 cm wynika z krzywizny, nie z ukosu). Ćwiczenie ma wyjątek w `tor-wyjatki.json`, który ta ocena uznaje za **niezasadny**.

Proponowana reguła: dla ciężaru zwisającego (`dbSumo`, `dbSides`, kettlebell na pasie) |dx toru| ≤ ~8 cm albo kąt toru od pionu ≤ 10°.

### L1. Landmine Squat: gryf zmienia długość o 28 cm (ŚREDNIE, nie blokuje)

**Co jest źle:** rekwizyt `pivot` idzie od osi (150; 0) do końca gryfu. Jego długość to 185,0 cm w u = 0 i 157,2 cm w u = 1 (−15%). Sztywny gryf „teleskopuje”.

Przy stałej długości koniec gryfu na dole (y ≈ 67) leżałby ok. 30 cm dalej w tył, bo zatacza łuk wokół osi. Na obrazie ruch czyta się jako landmine squat, a różnicę długości przy kącie 20–40° trudno zauważyć.

**Jak powinno być:** stała długość gryfu, koniec gryfu na łuku wokół osi, a przysiad dopasowany do tego łuku (biodra bardziej w tył).

**Realność i waga:** realny, waga ŚREDNIE (geometria sprzętu, nie technika ćwiczenia) → backlog 1.1.x.

**Reguła łapie?** Nie. Brakuje niezmiennika „stała długość sztywnego sprzętu (gryf landmine, drążek) we wszystkich klatkach”.

## Uwagi (backlog, nie blokują)

- **U1 (Goblet, Cable Squat; ŚREDNIE/NISKIE):**
  - Ciężar przy klatce cofa się o 8–9 cm w pierwszej połowie zejścia, potem jedzie pionowo. Na obrazie to gładki łuk.
  - Zawrócenia liczone przez test (2–3) to drgania ≤ 0,5 cm, których nie widać.
  - Wyjątki toru „stan zastany” proponuję zastąpić powodem z tej recenzji: „łuk w tył 8–9 cm przy cofaniu bioder, bez widocznego S; mikrozawrócenia ≤ 0,5 cm”.
- **U2 (Goblet Squat, treść ↔ rysunek, ŚREDNIE):** `gob.hold` „łokcie blisko tułowia” przeczy rysunkowi: łokcie 14–18 cm na zewnątrz, z przodu „skrzydła”. Do wyboru: poprawić rig (łokcie bliżej, na dole między kolanami) albo tekst. Tekst ma źródła, więc raczej rig.
- **U3 (Bodyweight Squat, Band Squat; ŚREDNIE):** ślad pokazuje dłonie (bez ciężaru lub z gumą) i ma widoczną falę „S” (4,3 cm, 1 zawrócenie). Do wyboru: nie rysować śladu przy przysiadzie bez ciężaru albo wygładzić tor rąk.
- **U4 (Reverse Band ×2, NISKIE):**
  - Kotwica gumy wisi w powietrzu (y 175), bo nie ma narysowanej belki ani stojaka.
  - W widoku z boku przerywana linia gumy pokrywa się z przerywaną linią śladu toru.
- **U5 (Przysiad z pasem, Dip Belt; NISKIE):** ślad to tor bioder, a nie ciężaru. Powód wyjątku toru jest zasadny. W Dip Belt tor odważnika byłby czytelniejszy niż tor pasa.
- **U6 (Dumbbell Squat, NISKIE):** ręce z hantlami są ugięte w łokciach o 52° na zewnątrz, czyli w łuk („kowboj”) zamiast zwisać prosto. Pewnie chodzi o ominięcie ud. Ślad jest gładki.
- **H1 (Barbell Hack Squat, ŚREDNIE):**
  - Na dole gryf jest w x −27,9 (12 cm za stawem biodrowym, pod pośladkami).
  - Dłonie są 38 cm za barkami, a tor odjeżdża w tył o 22 cm.
  - Cecha (gryf za nogami w prostych rękach) zostaje, ale zwykle gryf schodzi blisko tyłu łydek, prawie pionowo.
  - Wyjątek toru zostawić z powodem „łuk w tył 22 cm, do poprawy 1.1.x”.
- **A (Overhead Squat, One-Arm OH KB):** bez zmian od 1.1. Bark 183–198° względem tułowia, a gryf lub odważnik pionowo nad śródstopiem.
- **Front Squat, Double KB Front Squat (NISKIE):** haczyk toru 3,3–3,7 cm na starcie, pod progiem.

## Treść kart

- **Własne karty:** Back Squat, Front Squat, Goblet Squat, Przysiad z pasem, Wall Sit.
  - Skróty w `docs/research/figury-recenzja.json` (karty i v1) są zgodne z bieżącymi.
  - Każde id wskazówki ma wpis źródła w `data/zrodla/cues.json`, a każde z tych ćwiczeń ma `basis`.
- **Zestawy ogólne:** 20 ćwiczeń, skróty „zestawy” zgodne z bieżącymi (np. `squat`: sq.down, sq.back, sq.kneesToes + sq.mis.kneesIn, sq.mis.heels; Barbell Hack: `hingeFloor`).
- **Brzmienie:** teksty brzmią naturalnie, jak u trenera („Kolana idą w linii palców stóp — nie zapadają się do środka”, „Schodź tak nisko, jak pozwala ruchomość…”). Nie ma w nich nazw źródeł ani marek.
- **Rejestr twierdzeń:**
  - Wskazówki techniki nie mają wpisów w `rejestr-twierdzen.json` (grep po id i po „równoległego”: 0). Nie łapie ich też `DOMAIN_RE` w `scripts/claims.mjs`, a źródła mają w `lib/cues`. Tak samo jak w recenzji 1.0, nie liczę tego jako znaleziska.
  - Jedyne twierdzenie bliskie liczbowemu, `sq.depth` „zwykle co najmniej do równoległego ud”, ma źródło w cues.json.
- **Zgodność z rysunkiem:**
  - `fsq.rack` i Front Squat zgodne (naprawione).
  - `sq.depth`: wszystkie przysiady pełne mają udo ≈ poziomo, kolano 104–128°.
  - `sq.kneesToes`: reguła sensu kolana_nad_stopami daje 0 naruszeń.
  - Wyjątek to `gob.hold` (U2).
- **Mięśnie:** mięśnie zgodne z ruchem. Przy analogiach jest oznaczenie „uproszczenie”, np. Zercher (biceps 0,25 i górna część pleców 0,5, sensowne przy trzymaniu w łokciach) i Landmine.

## Szczelność reguł

0 z 3 BŁĘDÓW łapią reguły automatyczne. Zercher i Sumo przechodzą test toru dzięki wyjątkom „stan zastany” albo ukosowi prostej.

Proponowane reguły:
1. `ciezar_podparty`: gryf w zgięciu łokcia lub w dłoni w każdej klatce (Zercher, goblet, rack).
2. `tor_pionowy_zwisu`: ciężar zwisający, kąt toru od pionu ≤ 10°.
3. `sztywny_sprzet_dlugosc`: niezmiennik długości gryfu landmine i drążków.

## Ćwiczenia

- **Do wpisu „wyswietlana” (23):** Back Squat, Front Squat, Goblet Squat, Przysiad z pasem (linki), Box Squat, Wall Sit, Cable Squat, Bodyweight Squat, Smith Machine Squat, Double Kettlebell Front Squat, Landmine Squat (L1 ŚREDNIE → backlog), Box Squat with Bands, Box Squat with Chains, Reverse Band Box Squat, Reverse Band Power Squat, Squat with Bands, Squat with Chains, Barbell Hack Squat (H1 → backlog), Overhead Squat, Dumbbell Squat, One-Arm Overhead Kettlebell Squat, Dip Belt Squat, Band Squat.
- **Do poprawy, wstrzymać przed wpisem (2):** Zercher Squat (Z1), Sumo Squat (hantel) (S1).
- **`tests/tor-wyjatki.json` (rodzina squat):**
  - Zasadne z nowym powodem: Goblet, Cable, Dumbbell, Landmine, Bodyweight, Band, Przysiad z pasem, Dip Belt, Barbell Hack.
  - Niezasadne: Zercher, Sumo. Usunąć po poprawce rigu, a do tego czasu ćwiczenia wstrzymane.

## Propozycja wpisu v2 (`docs/research/figury-recenzja.json`)

```json
"squat": {
  "werdykt": "wyswietlana",
  "data": "2026-10-29",
  "kto": "recenzja niezależna 1.1 ruchu, śladu toru i treści kart (agent recenzent 1.1 squat, 29.10.2026)",
  "recenzent": "agent recenzent ruchu 1.1 (sesja niezależna, bez dostępu do uzasadnień generatora)",
  "sha": "e0d218c608c3",
  "liczba": 25,
  "rodzina": "squat",
  "slad": "docs/przekazanie/notatki/recenzje-1-1/ponowne/slad-1-1-squat/ — 25 arkuszy *-slad.png: 13 klatek u 0–1 (krok 1/12) × side+front, poza poprawna i rzędy błędów, ślad trailFor na każdej klatce; liczby: liczby-squat.json",
  "uwagi": "Warunek: Zercher Squat i Sumo Squat (hantel) w V2_WSTRZYMANE (Z1: gryf 18,5 cm od łokcia na dole; S1: tor hantla ukośny 24 cm) do poprawki rigu. B1 (Front Squat rack) i B2 (Reverse Band) naprawione. Backlog: L1 Landmine (gryf 185→157 cm), H1 Barbell Hack (tor 22 cm w tył), U1–U6."
}
```
