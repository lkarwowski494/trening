# Recenzja niezależna r1 — rodzina v2 `mobility_floor` (partia 2, linia 1.1), 09.11.2026

Recenzent: audytor (nie pisał rodziny, kart ani zestawów; L-047). Stan: `figury/partia-2-mobility_floor` @ f808d8c1 (baza 7dc265fb), odłączony worktree.
Skrót v2 (`node scripts/zrodla-runtime.mjs --skroty` w worktree): `mobility_floor` = `0c88b49248f1`. `assignAll()`: 22 ćwiczenia, 9 z rysunkiem (widok side), 13 bez pozy.

**Werdykt rodziny: do poprawy** — 1 × WYSOKIE (Child's Pose: ręce na rysunku sprzeczne z kartą). Pozostałe 8 rysunków bez blokera.

## Jak sprawdzono
- Arkusze `scripts/figures/arkusz-slad.mjs` (9 ćwiczeń × side, 21 kadrów co 0,05) wygenerowane samodzielnie; dodatkowo kadry u = 0 / 0,5 / 1 w skali 5 (pełna rozdzielczość).
- Liczby z `frameAt` (stawy, kontakty, pose.spineBend), `v2-validate.mjs` na wszystkich 9 pozach: OK (schemat, geometria, sens, jakość).
- Test `tests/figures-v2-nakladka-mobility-floor.test.tsx` (`--runInBand`): 4/4 zielone. Mięśnie: `musclesFor` = null dla rodziny (zgodnie z decyzją 04.11.2026 (4) B).

## Znaleziska

| # | Poziom | Pewność | Ćwiczenie | Opis | Miara | Realność |
|---|---|---|---|---|---|---|
| W1 | WYSOKIE | 95% | Child's Pose | Karta: „Uklęknij i oprzyj dłonie o podłogę przed sobą” i „Ręce zostaw wyciągnięte przed sobą…”; rysunek ma ręce WZDŁUŻ TUŁOWIA do stóp (wariant rąk z kroku 4 ACE #227 z `figury-sens.json`). Ruch sprzeczny z kartą (K11). | chwyt R/L x = −2,0 cm, bark x = 51,2 cm (dłonie 53 cm ZA barkiem, przy stopach x 0); oczekiwane: chwyt przed barkiem (x > 51) na podłodze | realny (każde otwarcie karty) |
| Ś1 | ŚREDNIE | 85% | Side-Lying Quad Stretch | Pięta górnej nogi uniesiona „do sufitu”, nie cofnięta do pośladka w płaszczyźnie ciała: podudzie ma składową boczną (pelvisRight) 0,56 i tylko 0,33 w tył (front = −0,33) — obrót podudzia wokół uda ok. 59°, czyli rotacja wewnętrzna biodra ok. 59° (zwykle 30–45°). Karta nie jest sprzeczna (pięta przy pośladku, kolana razem — spełnione), ale ułożenie nogi poza zwykłym zakresem. Zgięcie kolana 141° = granica modelu, akceptowalne. | atan2(0,56; 0,33) ≈ 59°; oczekiwane ≤ ok. 40° | realny |
| Ś2 | ŚREDNIE | 85% | Butterfly Stretch | Karta: „łokciami delikatnie dociśnij uda w dół”; na rysunku przedramiona leżą na podudziach (oś przedramię–podudzie 4,4 cm), łokieć ok. 16,3 cm od osi uda — przerwa ok. 6 cm między ramieniem a udem (styk ≤ 1 cm niespełniony). Kierunek ruchu zgodny. | `distSegSeg(bark–łokieć, biodro–kolano)` = 16,3 cm; − promień uda przy kolanie ~6 − ramię 4,4 ≈ 6 cm | realny |
| N1 | NISKIE | 90% | Cat-Cow | Ślad toru = miednica nieruchoma: `trailFor` daje 24 odcinki zerowej długości + kółko „trailStart” (r 2,2 cm) — w aplikacji widoczna samotna kropka na biodrze bez toru (widać też na arkuszu). | 25 kształtów, długość toru 0 cm | realny, kosmetyczne |
| N2 | NISKIE | 90% | The Straddle | Rozkrok (odwiedzenie ok. 40° na stronę: kostki z = ±61,7 cm) w jedynym widoku side zrzutowany skrótowo — rysunek trudno odróżnić od Seated Floor Hamstring; brak sprzeczności z kartą. Propozycja: widok front dla tego ćwiczenia (EXERCISE_VIEWS). | rzut nogi 63 cm z ~88 cm | realny, czytelność |
| N3 | NISKIE | 90% | (nakładka) | Nagłówek `overlay/mobility_floor.ts` formalnie prawdziwy (`wskazowki_na_reguly` mapuje tylko st.noBounce; test to pilnuje), ale merytorycznie nieścisły: karta The Straddle WYPOWIADA regułę „ustalone” (`n.hingeFlat` „Pochylaj się z bioder, plecy zostają proste” → plecy_plasko, sklon_z_bioder), a rodzaj elementu istnieje (`ref` segment miednica→bark, precedens `olympicBackRef`/plecy_neutralne). Zdanie „Pytanie do leada…” nieaktualne po decyzji. MOB-F1 powinno wymienić te wskazówki wprost. | — | teoretyczny dla użytkownika (brak elementu ≠ błąd) |

## Do oceny z briefu
- **Cat-Cow — amplituda:** dane: `spineBend` +26° (u = 0, koci grzbiet) → −16° (u = 1, krowa); reguła `kregoslup_koci_grzbiet` (≥ 10° / ≤ −10°) spełniona. Liczby autora (−24,5° / +15,3°) to inna miara/znak — nie z `pose.spineBend`. Środek kręgosłupa zmienia wysokość o 8,1 cm (63,3 → 55,2), strzałka względem cięciwy ok. +4,6 / −3 cm; głowa 100° → 72°. Ruch czytelny (linia brzucha, garb, głowa), choć umiarkowany. Dłonie pod barkami (x 60 vs 59–60,6), kolana pod biodrami (12,9 = 12,9) — zgodnie z kartą.
- **Child's Pose — kadr 40 cm:** `boxFor` h = 48,1 cm; wyjątek nazwany tylko dla tego ćwiczenia, próg 40 cm nadal łapie kadr zdegenerowany — poluzowanie uzasadnione.
- **Side-Lying Quad 141°:** w granicy modelu (CONTRACT); problemem jest obrót nogi (Ś1), nie zgięcie.
- **The Straddle z boku:** N2.

## Zestawy ogólne (K12) — `stretch`
Seated Calf Stretch (st.tension, st.breathe; err st.mis.force), Seated Floor Hamstring, Kneeling Hip Flexor, Supine Hamstring (st.tension, st.noBounce, st.breathe; err st.mis.force): każde zdanie pasuje do statycznej pozy na rysunku. Wyświetlane. (Seated Calf: pasek pod śródstopiem, stopa w 90° — zestaw nie mówi o pasku, bez sprzeczności.)

## Karty własne (K11)
The Straddle, Cat-Cow, Side-Lying Quad — zgodne z rysunkiem (Side-Lying: uwaga Ś1). Butterfly — zgodna kierunkowo, Ś2. Child's Pose — **do poprawy** (W1).

## v1 → zastąpiona (K10)
Brak wpisów v1 dla 9 ćwiczeń i rodziny w `docs/research/figury-recenzja.json` (sekcja v1) — potwierdzam ustalenie autora; lista pusta.

## Testy (K14) — `git diff 7dc265fb..f808d8c1 -- tests/`
- `figures-v2-data`: próg wysokości kadru 50 → 40 cm tylko dla Child's Pose (nazwany, h = 48,1) — uzasadnione.
- `figures-v2-mapping`, `strona-eksport`, `skrot-v2-wynik`, `nakladka-triceps-olympic`, fixture pokrycia: aktualizacje liczników/list o rodzinę (+9) — bez poluzowania.
- Nowy `figures-v2-nakladka-mobility-floor`: pilnuje pustej nakładki, że tylko ta rodzina jest pusta, 9 ćwiczeń bez elementów i niezmiennika `wskazowki_na_reguly` — wyjątek chroniony.

## Poprawki (dla autora; test odtwarzający)
- W1: Child's Pose — ręce wyciągnięte przed siebie, dłonie na podłodze przed głową (chwyt x > bark x, y ≈ 3 cm); test: chwyt R/L przed barkiem w każdej klatce. Alternatywa (zmiana karty na wariant „ręce wzdłuż ciała”) wymaga badacza i ponownej recenzji karty.
- Ś1 (backlog dopuszczalny): podudzie górnej nogi w płaszczyźnie ciała (składowa boczna podudzia ≤ ~0,35).
- Ś2 (backlog dopuszczalny): łokcie na udach przy kolanach (odstęp ramię–udo ≤ 1 cm).
