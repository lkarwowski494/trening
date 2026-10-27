# Ponowna recenzja ruchu i treści kart: poprawki-p4b (14 ćwiczeń z 5 rodzin), 27.10.2026

Recenzent niezależny (recenzent p4b). Nie czytałem README podglądów, komunikatów commitów gałęzi, komentarzy w `scripts/figures/agent-pozy/*.mjs` ani opisów poprawek.

Co sprawdziłem:

- **Podglądy:** `podglady-1-1/poprawki-p4b/` na `origin/przekazanie-konta` @ c535921e (14 PNG). Oglądałem je w pełnej rozdzielczości, a rzuty z boku kadrowałem osobno.
- **Liczby:** silnik v2 we własnym, odłączonym worktree `origin/poprawki-p4b` @ 71823ea7, jednym wątkiem. Skrypty leżą w `/tmp/claude-0/rec-p4b/s/` (lokalnie, poza repo):
  - `miary`: stawy, kąty, chwyt i podeszwy na siatce u;
  - `slizg`: poślizg stopy w kontakcie i odcinki lotu na siatce u co 0,0125;
  - `kolano`: najniższe kolano.
- **Porównanie:** pozy sprzed zmian z `origin/integracja-1-1`.
- **Treść karty:**
  - `cue-sets.json`, `lib/cues/text/pl.json` i `components/ExerciseCues.tsx` (wskazówka bez tekstu w pl.json jest odfiltrowana, więc karta jej nie pokazuje);
  - `lib/catalog.generated.ts`, `muscles.generated.ts` i `data/zrodla/figury-sens.json`;
  - grep w `docs/research/rejestr-twierdzen.json`;
  - `lib/figures/v2/anim.ts` i `components/ExerciseFigureV2.tsx` (sposób odtwarzania).
- **Walidator:** lokalnie nie uruchamiałem pełnego walidatora (maszyna przeciążona, pkt 12). Za bramkę geometrii przyjmuję zielone tests.yml 40485412600 (dane koordynatora).

## Krok 6: ważność podglądu

Podgląd jest **ważny**. Wszystkie 5 katalogów ma `PODGLAD-WAZNY.txt`, `zgodnosc_manifestu` = `[]` oraz `katy-stawow.md`, a każde ćwiczenie ma `katy_stawow`. Obrazy mają rzut z boku i z przodu.

Błędy nierysowane z braku tekstu (`hang.noSwing`, `jump.mis.stiff`) mają wyjątek opisu z powodem. Żadne z 14 ćwiczeń nie ma wiersza błędu, więc krok 3 listy kontrolnej nie ma tu zastosowania.

## Wynik

| Werdykt | Liczba | Ćwiczenia |
|---|---|---|
| OK | 4 | Lateral Bound, Alternate Leg Push-Off, Single Leg Push-Off, Alternate Leg Diagonal Bound |
| OK z uwagą | 4 | Kettlebell Windmill, Side to Side Box Shuffle, Split Jump, Depth Jump |
| **BŁĄD** | **6** | **Bent Press** (WYSOKIE), **Sled Push, Sled Drag (Harness), Yoke Walk** (WYSOKIE, jedna przyczyna: animacja wahadłowa), **Toes to Bar** (ŚREDNIE, regresja), **Double Kettlebell Windmill** (ŚREDNIE) |

**Szczelność reguł automatycznych: 0 z 4 klas błędów (0%).** Wszystkie pozy przechodzą testy p4b (`tests/figury-recenzja-p4b.test.ts`). Test Bent Press i test Toes to Bar mierzą coś innego niż cechę, która zawodzi (szczegóły w tabeli).

### Stan znalezisk z pierwotnych recenzji

| Pierwotne | Stan w p4b | Dowód (liczby) |
|---|---|---|
| core_hang nr 1: Toes to Bar, palce 58 cm od drążka | **usunięte; nowa regresja** | u = 1: palce (−1,6; 236,4), drążek (0; 230), czyli 6,6 cm. Biodro 124°, miednica +28 cm (117,9 → 145,8), tułów odchylony 55°. **Start nie jest jednak zwisem** (BŁĄD nr 3) |
| core_hang A: miednica się nie zwija | nadal (uwaga) | `zgiecieKregoslupa` 0 przez cały ruch (Toes to Bar) |
| core_hang B: drążek niewidoczny z boku | nadal (uwaga) | na kadrze z boku nie ma linii drążka nad dłońmi, a rodzina ma `views: ['side']` |
| core_standing nr 1: Windmill jako płytki skłon boczny | **usunięte** (z uwagą i nowym BŁĘDEM w Double) | u = 1: biodro 71/77°, tułów pochylony 64° i przechylony −34°, miednica przesunięta 7 cm w stronę ciężaru. Wolna dłoń zjeżdża 78 → 41 cm (Double: 43,5 cm). Ręka z ciężarem prosta (łokieć 4–7°), chwyt 173–199 cm |
| core_standing nr 2: Bent Press bez wyciskania | **częściowo; BŁĄD nadal** | start z hantlem przy barku jest (u = 0: łokieć 148°, hantel 147 cm). Wyprost nadal przychodzi jednak przez **wyciśnięcie w górę**, a nie przez zejście pod ciężar (nr 1) |
| plyo nr 1: Split Jump, stopy suną | **usunięte** | kontakt u 0–0,40: obie kostki przesuwają się o 0,0 cm. Lot u 0,41–0,96, nogi mijają się w powietrzu, lądowanie w odwrotnym wykroku |
| plyo nr 2: Diagonal Bound obunóż, bez skosu | **usunięte** | odbicie z L (z −8), lądowanie na R w (85; 51), miednica z 0 → 45. Lot u 0,46–0,91, przesunięcie w kontakcie 0 cm |
| plyo nr 3: Lateral Bound na tej samej nodze | **usunięte** | odbicie z L (z −8, noga przeciwna do kierunku +z), lądowanie na R (z 96), miednica z 0 → 90 |
| plyo nr 4: Box Shuffle, obie stopy na skrzyni | **usunięte** | u = 0: L na blacie (podeszwa 12,9 przy blacie 12), R na podłodze z 34. u = 1: R na blacie, L na podłodze z −34 |
| plyo nr 5: Push-Off bez drugiej stopy | **usunięte** | u = 0 i u = 1: stopa podłogowa 0,8 cm, stopa na skrzyni 30,0 cm (blat 30). Alternate kończy z zamienionymi nogami, Single z tym samym układem |
| plyo W: rzut tylko z boku (8 ćw.) | **usunięte** | `families.ts`: plyo `views: ['side', 'front']`. Na obrazie z przodu widać przesunięcie w z, bo ramka jest wspólna dla wszystkich klatek (`boundsOf`) |
| plyo A, B, F | nadal (uwagi przekrojowe) | m.in. Depth Jump: w locie miednica x 65 → 52 → 56 cm (zygzak 13 cm) |
| sled_throw nr 1: chód odwrotny w 1. połowie | **usunięte w fazie 0 → 1; BŁĄD wraca w fazie 1 → 0** | Push: stopa L w kontakcie u 0,25–1 cofa się z x 19,7 do −59 (względem miednicy x −4). R przenosi się w powietrzu do przodu. Drag: tak samo (23,7 → −55). Odtwarzanie wahadłowe pokazuje jednak połowę pętli wstecz (nr 2) |
| strongman nr 1: Yoke „moonwalk” | **usunięte w fazie 0 → 1; BŁĄD wraca w fazie 1 → 0** | L w kontakcie u 0–1 cofa się z 14 do −24 cm, R przenosi się nad podłogą (do 12 cm). Rozstaw kroku 38 cm, miednica stała (86 cm), tułów pionowo |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / staw | Co jest źle (liczby) | Jak powinno być | Pewność | Realność, waga | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Bent Press** | u = 0 → 1, ręka z hantlem i tułów | **Ruch to wyciskanie w skłonie, a nie „bent press”.** Hantel jedzie w górę z 146,7 do 199 cm (+52 cm), a łokieć prostuje się 148° → 12°. Barki opadają tylko o 12,5 cm (138,7 → 126,2), przy pochyleniu tułowia 30° i przechyle −30°. Do u = 0,5 hantel jest już 40 cm wyżej, a tułów pochylony dopiero o 15°. Na arkuszu klatki 1–6 z boku to zwykłe wyciskanie nad głowę. Na starcie łokieć stoi 47 cm w bok (z 46,9, odwiedzenie 64°): z przodu ramię jest poziomo w bok, a hantel przy uchu. | Hantel zostaje na prawie stałej wysokości (zmiana rzędu ≤ 10–15 cm), a ciało schodzi pod niego: skłon w bok i w przód. Barki opadają o kilkadziesiąt cm, łokieć prostuje się, bo tułów się oddala, a nie dlatego, że ręka pcha. Na starcie łokieć w dół, przy boku tułowia (oparty o biodro i bok tułowia), przedramię pionowo. | 80% | realny; **WYSOKIE** (obraz uczy innego ruchu niż nazwa) | **nie.** Test p4b sprawdza łokieć ≥ 90° w u = 0, prostą rękę na końcu i wolną dłoń ≤ 75 cm. Wysokości hantla nie sprawdza nic. Propozycja `bent_press_ciezar_stoi`: zmiana y chwytu z ciężarem w całym ruchu ≤ 15 cm i spadek barków ≥ 25 cm |
| 2 | **Sled Push, Sled Drag (Harness), Yoke Walk** | faza powrotu animacji (u 1 → 0), nogi | **W aplikacji połowa każdej pętli to chód tyłem.** Pozy w fazie 0 → 1 są poprawne (tabela wyżej). `uAt` w `anim.ts` odtwarza jednak ruch wahadłowo (0 → 1, pauza, 1 → 0), a `ExerciseFigureV2` innego trybu nie ma. W fazie 1 → 0 stopa podporowa sunie po podłodze **do przodu** przy stojącej miednicy: Push i Drag o 79 cm, Yoke o 38 cm. Wykroczna cofa się w powietrzu. To dokładnie pierwotny błąd „moonwalk”, który teraz zajmuje połowę pętli zamiast połowy fazy. | Chód w miejscu odtwarzany cyklicznie: 0 → 1, a potem ten sam półkrok z zamienionymi nogami (lustro z), bez cofania. Albo pętla 0 → 1 → (lustro), w której stopa w kontakcie zawsze przesuwa się do tyłu. | 95% | realny (każde wyświetlenie); **WYSOKIE** w 1.1 (ta sama klasa, za którą pierwotne recenzje dały BŁĄD) | **nie.** Reguły i test p4b badają pozę na u 0 → 1, a nie odtwarzanie. Propozycja: niezmiennik `chod_bez_powrotu`: ćwiczenie z deklarowanym marszem w miejscu musi mieć tryb cykliczny w specyfikacji animacji. Test na `uAt`/spec, a nie na pozie. Dotyczy też rodziny **carry** (poza moim zakresem; pierwotnie uznana za poprawną, ale odtwarzana tak samo) |
| 3 | **Toes to Bar** (regresja p4b) | u = 0, biodra i nogi | **Ruch nie zaczyna się ze zwisu.** W u = 0 kostki są w (44,5; 56,3), czyli nogi uniesione 45° w przód (biodro 45,4°). Przed poprawką i w Knee Raise / Leg Raise start był w zwisie: kostki (−10,9; 35), biodro ok. 10°. Przy odtwarzaniu wahadłowym postać nigdy nie wraca do zwisu, więc widać unoszenie od połowy. Wskazówka `hang.slow` (kontrolowany powrót) nie ma pokrycia w obrazie. | u = 0: zwis z nogami pionowo (biodro ≤ 15°), jak w Hanging Leg Raise. Koniec bez zmian. | 85% | realny; **ŚREDNIE** (cecha końcowa jest poprawna, brakuje fazy startowej) | **nie.** Test p4b „na początku (zwis) palce daleko od drążka” wymaga tylko odległości > 100 cm (jest 177 cm), a kąta biodra nie sprawdza. Propozycja: w rodzinie core_hang w u = 0 biodro ≤ 15° |
| 4 | **Double Kettlebell Windmill** | u = 0 → 1, lewa ręka z dolnym kettlebellem | **Dolny kettlebell wisi na ugiętej ręce, z dala od nogi.** Łokieć lewej ręki ma 45–46° przez cały ruch, a łokieć jest 37 → 55 cm w bok (z). Kettlebell w u = 1 jest w (27,7; 43,5; −48,7), czyli 29 cm na zewnątrz od lewej stopy (z −20) i 28 cm przed nią. Z przodu (`/tmp/claude-0/rec-p4b/crop/dkw-front.png`) ciężar odstaje od uda na zgiętym ramieniu, co przy realnym ciężarze jest nienaturalne. Reguła sensu `wiatrak_bok` cytuje jako źródło, że wolna ręka zsuwa się „po wewnętrznej stronie nogi”. | Dolna ręka prosta (łokieć ≤ 15°), zwisa pionowo, a kettlebell zjeżdża wzdłuż wewnętrznej strony przedniej nogi, między stopami albo przy stopie. | 80% | realny; **ŚREDNIE** | **nie.** `wiatrak_reka_prosta` obejmuje tylko rękę z ciężarem nad głową (`trzyma`) |

## OK z uwagą (backlog, nie blokuje)

- **Kettlebell Windmill:**
  - Wolna dłoń (bez ciężaru) jest w u = 1 w (27,7; 41,3; −38,7), czyli 19 cm na zewnątrz od stopy i 28 cm przed nią, a łokieć zgięty 41° przez cały ruch. Źródło reguły mówi „po wewnętrznej stronie nogi”. Pewność 70%.
  - **Wspólne dla obu Windmill i Bent Press:** `skretTulowia` = 0, więc klatka jest zwrócona do podłogi przy ręce pionowo w górę. Zgięcie barku w płaszczyźnie tułowia wynosi 240° (Bent Press 199°), a kontrakt dopuszcza 171°.
  - Wyjątek `zakres_wyjatki` w `figury-sens.json` uzasadnia to tym, że „model nie ma obrotu klatki wokół osi długiej”. **To nieprawda:** kontrakt poza@2 ma `skretTulowia` (−90…90°, „skręt klatki względem miednicy wokół osi tułowia”), a rodzina używa go w Russian Twist (±38°).
  - Propozycja: skręt klatki ku ciężarowi (rzędu 30–60°, wartość do potwierdzenia przez badacza) zamiast wyjątku zakresu. Wyjątek z błędnym uzasadnieniem to luka procesu: wyjątek zakresu wymaga sprawdzenia, czy kontrakt ma stopień swobody, który by go zbędnie nie wprowadzał.
- **Side to Side Box Shuffle:**
  - Na przejściu wybicie / lądowanie stopa w kontakcie (podeszwa < 1,5 cm) przesuwa się 6,1 cm (R, u ≤ 0,575) i 7,0 cm (L, u ≥ 0,825) w z, przy progu 3 cm z propozycji `stopa_w_kontakcie_stoi`.
  - Lot dość wysoki (podeszwy do 31 cm nad podłogą przy stopniu 12 cm), jak na „shuffle”. Pewność 60%.
- **Split Jump:** zamach przed wybiciem jest bardzo głęboki. Miednica schodzi 80 → 55,5 cm, a tylne kolano jest 13,9 cm nad podłogą (u 0,09), co na klatce 2 wygląda jak przyklęk. Pewność 60%.
- **Depth Jump:**
  - Kontakt z podłogą trwa u 0,15–0,49 (ok. ⅓ ruchu), a lądowanie jest głębokie (kolano 90°, miednica 65,5 cm). Przy wyskoku po zeskoku zwykle chodzi o krótki kontakt.
  - W locie miednica x 65 → 52 → 56 (uwaga B). Pewność 55%.
- **Alternate Leg Diagonal Bound, Lateral Bound:** obie ręce idą razem nad głowę (jak w skoku pionowym). W skokach z nogi na nogę ręce zwykle pracują naprzemiennie. Pewność 50%, uwaga rysunkowa.
- **Manifest plyo (tekst nieaktualny):** wpisy `przyblizenia` dla Lateral Bound („lądowanie na tej samej nodze”) i Diagonal Bound („model nie przesuwa miednicy w bok”) przeczą pozom (lądowanie na drugiej nodze, miednica z 0 → 45). Kontrola `zgodnosc_manifestu` sprawdza obecność wpisów, a nie ich prawdziwość. Waga NISKIE: wprowadza w błąd recenzenta i badacza, w aplikacji niewidoczne.

## Treść karty

| Ćwiczenie | Co pokazuje karta (pl) | Uwagi |
|---|---|---|
| Toes to Bar | brak wskazówek | `hang.slow`, `hang.ribs` i `hang.noSwing` są w `newIds` bez tekstu, a `ExerciseCues` je odfiltrowuje. Mięśnie: brzuch 1, skośne 0,5, najszerszy 0,25, przedramiona 0,25 („jedno źródło”). Spójne z rysunkiem |
| Windmill ×2 | tylko błąd `mis.jerk` („Szarpanie i rzucanie ciężarem…”) | `wm.arm` i `wm.eyes` bez tekstu. Mięśnie spójne (skośne 1, bark boczny 0,5) |
| **Bent Press** | tylko `mis.jerk` | **Niespójność ukryta:** zestaw `ok` to `wm.arm` („ręka prosta przez cały ruch”, źródło reguły `wiatrak_reka_prosta`), a rysunek Bent Press słusznie zaczyna z ręką zgiętą. Reguła sensu została dla Bent Press zdjęta, a wskazówka w `cue-sets.json` została. Po wdrożeniu tekstu przez tłumacza karta będzie przeczyć rysunkowi. Waga ŚREDNIE (dziś niewidoczne). Zalecenie: osobny zestaw wskazówek dla Bent Press albo usunięcie `wm.arm` z jego `ok` |
| plyo ×7 | brak wskazówek | `jump.drive`, `jump.land` i `jump.mis.stiff` bez tekstu. Mięśnie spójne (czworogłowe 1, pośladki i łydki 0,5; w ruchach bocznych przywodziciele i odwodziciele) |
| Sled Push, Sled Drag | brak wskazówek | `sled.lean` i `sled.legs` bez tekstu. Pochylenie tułowia ok. 33° od pionu. Sled Drag wymaga „dip_belt” (pas zamiast uprzęży), a rysunek pokazuje linkę do pasa, więc spójnie |
| Yoke Walk | `carry.noLean` („Nie przechylaj się…”), `carry.walk` („Idź spokojnym, kontrolowanym krokiem…”) | Zgodne z rysunkiem: tułów pionowo, przechył 0, krótkie kroki 38 cm. Jarzmo narysowane jako sztanga z talerzami (uwaga pierwotna, bez zmian) |

- **Rejestr twierdzeń:** żadne z 14 ćwiczeń ani żadna z ich wskazówek nie ma wpisu w `rejestr-twierdzen.json`. Widoczne teksty (`mis.jerk`, `carry.*`) nie powołują się na źródło ani nie podają liczby, więc wpis nie jest wymagany. Brak wpisu nie jest znaleziskiem.
- **Pewność mięśni:** etykieta „brak źródła — uproszczenie” (Double Windmill, Bent Press, Sled Push i Drag) jest bez zmian względem integracja-1-1. Gałąź tego nie zmienia.
- **Nazwy marek i źródeł** w tekstach widocznych: brak.
- **Luka przekrojowa (poza zakresem p4b, do wiadomości):** dla rodzin hanging, windmill, jump i sled karta nie ma żadnej wskazówki techniki, dopóki tłumacz nie wdroży `newIds`.

## Gotowość rodzin do statusu „zatwierdzona”

- **plyo: gotowa** w zakresie p4b. 7 poprawionych ćwiczeń to OK albo OK z uwagą, a W zamknięte. Pozostałe 20 bez zmian, z uwagami z `plyo.md` (A, B, F).
- **core_hang: nie** (nr 3, Toes to Bar).
- **core_standing: nie** (nr 1 Bent Press, nr 4 Double Windmill).
- **sled_throw i strongman: nie**, dopóki nie zostanie rozstrzygnięty nr 2 (animacja chodu). Same pozy są poprawne.

## Decyzja dla właściciela (nr 2, animacja chodu)

- **A (rekomendacja):** tryb cykliczny w silniku dla ćwiczeń z marszem w miejscu: 0 → 1, a potem ta sama faza z nogami w lustrze, bez cofania. Dotyczy sled_throw (2), strongman (1) i carry. Koszt: zmiana `anim.ts`/spec + testy, ok. 1–2 h pracy agenta. Usuwa klasę błędu na stałe.
- **B:** dla chodu animacja tylko 0 → 1 z przeskokiem do 0 (pętla bez powrotu). Taniej, ale widać „skok” klatki co pętlę.
- **C:** zostawić jako ograniczenie silnika (jak uwaga F przy skokach). Najtaniej, ale połowa pętli pokazuje ruch odwrotny do nazwy ćwiczenia, a przy sankach to ten sam błąd, który recenzja pierwotna zablokowała.
