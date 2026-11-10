# Recenzja niezależna (bramka 4, L-047, L-050): rodzina v2 `hip_abd_add` — 09.11.2026

- Autor: programista partii 3 (gałąź `figury/partia-3`, commit 7d298144). Recenzent: audytor (nie pisał rysunku, nakładki ani zestawów).
- Czysta kopia: `git archive 7d298144` → `(lokalny katalog roboczy recenzenta, poza repo)`. Skrót `node scripts/zrodla-runtime.mjs --skroty` w czystej kopii: `v2.hip_abd_add = e635233e9a44` (zgodny z oczekiwanym); karta Lateral Band Walk `b30c831906fe`; zestawy: Hip Abduction / Hip Adduction / Cable Hip Adduction `ac7f4cc69855`, Cable Hip Abduction `659b60729fe0`, Monster Walk `9782f2bca6c8`.
- Arkusze (21 kadrów co 0,05, rzut z przodu): ślad `(lokalny katalog roboczy recenzenta, poza repo)*.png` (jasny), `(lokalny katalog roboczy recenzenta, poza repo)*.png` (ciemny); nakładka `(lokalny katalog roboczy recenzenta, poza repo)*.png`. Powiększenia kadrów: `(lokalny katalog roboczy recenzenta, poza repo)`.
- `node scripts/figures/v2-validate.mjs` na każdym z 6 ćwiczeń (wyjęte z `poses/hip_abd_add.json`): OK (schemat, kolizje, reguły sensu). `tests/figures-v2-tor.test.ts` zielony w czystej kopii.

## Werdykt

Rodzina **wyświetlana bez dwóch ćwiczeń chodzonych**: Hip Abduction, Hip Adduction, Cable Hip Abduction, Cable Hip Adduction — wyświetlane; **Lateral Band Walk i Monster Walk — do poprawy** (WYSOKIE: rysunek to wahadło jednej nogi, a ćwiczenie to marsz). Jeśli nie da się ukryć tych dwóch figur bez zmiany statusu rodziny, cała rodzina czeka na poprawkę.

## Znaleziska (od najpoważniejszego)

| ID | Waga | Pewność | Ćwiczenie / rzut / kadr | Opis | Realność | Dowód |
|---|---|---|---|---|---|---|
| H-1 | WYSOKIE | 95% | Lateral Band Walk / front / u 0→1→0 | Rysunek: prawa noga robi krok w bok (kostka z 14 → 40 cm), a w fazie „Powrót” (wahadło, 2 s) ta sama noga wraca na miejsce; lewa stopa i miednica stoją w miejscu przez cały cykl. Karta `bw.move`: „Zrób krok w bok, potem powoli dociągnij drugą nogę.” — rysunek przeczy karcie, druga noga nigdy nie jest dociągana, nie ma marszu. Przybliżenie „model nie przesuwa miednicy w bok” (`data/zrodla/figury-ograniczenia-silnika.json`, status `do_przegladu`) jest nieaktualne — poza@2 ma przesunięcie boczne, a silnik ma tryb pętli `cykl_lustro` (`lib/figures/v2/contract.ts:92`) i prezentację marszu (`walk`, `poseData.ts`, carry). Nazwy faz „Rozsuwanie/Powrót” opisują wahadło, nie krok i dostawienie. | realny (każde otwarcie karty) | `(lokalny katalog roboczy recenzenta, poza repo)`, kadry u 0,25–1,0; `lib/figures/v2/poses/hip_abd_add.json` (L.kostka stała [0,7,-14], miednica stała) |
| H-2 | WYSOKIE | 90% | Monster Walk / front / u 0→1→0 | Ten sam wzór: prawa noga wysuwa się po skosie (x 0 → 26, z 14 → 28) i wraca tą samą drogą; lewa noga i miednica nieruchome. Ćwiczenie jest marszem (zestaw `bandWalk`, `bw.squat`: „…trzymaj go przez cały marsz”; źródło zestawu opisuje marsz krokami), rysunek pokazuje wymach i powrót jednej nogi — błędny ruch. | realny | `(lokalny katalog roboczy recenzenta, poza repo)`; ta sama pozycja w `poses/hip_abd_add.json` |
| S-1 | ŚREDNIE | 90% | Hip Abduction, Hip Adduction / front / wszystkie kadry | Maszyna narysowana jako ławka i jedna dźwignia przy prawej kostce (`sprzet: dzwignia, punkt: kostki, trzyma: R`); lewa noga rusza się symetrycznie bez żadnego oporu ani podkładki, podkładek przy kolanach (po zewnętrznej stronie przy odwodzeniu, po wewnętrznej przy przywodzeniu) nie ma. Ruch nóg poprawny (kolana 14 → 34 cm od osi, tułów i miednica nieruchome, reguła rozstaw_kolan spełniona), teksty zestawu nie mówią o podkładkach — nie przeczy treści, ale sprzęt wygląda na niekompletny i asymetryczny. | realny (widoczne), bez błędu treści | `(lokalny katalog roboczy recenzenta, poza repo)`, `(lokalny katalog roboczy recenzenta, poza repo)` |
| S-2 | ŚREDNIE | 85% | Hip Adduction, Cable Hip Adduction (EN) | Faza „Ściąganie” ma w słowniku jeden przekład `'Ściąganie': 'Pulling back'` (`lib/i18n.en.ts:794`, z rodzin ściągania drążka). Przy przywodzeniu noga idzie do środka, nie do tyłu — podpis fazy w EN opisuje zły kierunek. PL „Ściąganie” jest do przyjęcia. | realny (EN) | `lib/figures/v2/poseData.ts` DATA_UI.hip_abd_add; `lib/i18n.en.ts:793–794` |
| N-1 | NISKIE | 85% | Hip Abduction u = 1, Hip Adduction u = 0 / front | Chwyt stały (26,6; 42,8; ±24) leży 5,3 cm od osi uda przy pełnym odwiedzeniu, a promień uda w tym miejscu ok. 8,6 cm (`GIRTH.thigh`, `lib/figures/v2/skeleton.ts:20`) — w 3D dłoń wchodzi w udo (przy u 0,5 już styk: 8,9 cm). W rzucie z przodu czyta się jak dłoń położona na udzie — nie widać przenikania. | teoretyczny w obrazie (tylko rzut z przodu) | pomiar `frameAt` w czystej kopii; kadr u = 1 `(lokalny katalog roboczy recenzenta, poza repo)` |
| N-2 | NISKIE | 90% | Cable Hip Abduction, Cable Hip Adduction / front / nakładka | Pion `hipAbdTorsoPlumb` (miednica → linia barków) w rzucie z przodu pokazuje przechył boczny tułowia — to dobrze ilustruje `hab.hips` i zgadza się z rysunkiem (pion równy osi tułowia we wszystkich kadrach, bez artefaktów). Ale jest przypisany do reguły `tulow_stoi`, której ewaluator mierzy `pochylenieTulowia` (pochylenie w przód/tył, `scripts/figures/v2-sens.mjs:256`) — rzut z przodu tego nie pokazuje, a przechyłu bocznego (`lean`) nie pilnuje żadna reguła rodziny. | teoretyczny (dziś obie wielkości stałe) | `(lokalny katalog roboczy recenzenta, poza repo)`, `(lokalny katalog roboczy recenzenta, poza repo)`; `data/zrodla/figury-sens.json` rodziny.hip_abd_add.reguly.tulow_stoi |
| N-3 | NISKIE | 95% | Hip Abduction, Hip Adduction, Lateral Band Walk, Monster Walk / front | Punkt śladu (`info.load`) to w maszynach chwyt (stały), a w marszach miednica (stała): ślad ma 0 cm i 0 zawróceń, więc strażnik toru (`tests/figures-v2-tor.test.ts`) i arkusz śladu nic nie mówią o torze nogi. Tor kostki w maszynach sprawdzony ręcznie: kostka leży na okręgu dźwigni (41,8 / 41,6 cm od osi obrotu w każdej klatce kluczowej). | brzegowy (luka kontroli, nie błąd rysunku) | pomiar `ksztaltToru` w czystej kopii; `(lokalny katalog roboczy recenzenta, poza repo)*.png` |
| N-4 | NISKIE | 85% | Hip Abduction, Hip Adduction (maszyny na obie nogi) | `hab.hips` „…pracuje tylko noga” / „only the leg moves” — liczba pojedyncza przy ruchu obu nóg. Treść prawdziwa (tułów i biodra nieruchome na rysunku), sformułowanie nieprecyzyjne. | realny, kosmetyczny | `lib/cues/text/pl.json:160`, `lib/cues/text/en.json:160` |

## 1. Ruch ze śladem (per ćwiczenie)

- **Hip Abduction** (maszyna w siadzie): oparcie 80°, siedzisko pod miednicą, miednica i tułów stałe (pochylenie −10° w każdej klatce); kolana rozchodzą się symetrycznie (14,3 → 34,4 cm od osi), stopy na podłodze, uda w skrócie (rzut z przodu) poprawnie. Kostka prawa na okręgu dźwigni. Uwagi: S-1, N-1, N-3. Przenikania widocznego brak (jasny i ciemny motyw).
- **Hip Adduction**: ta sama poza w odwrotnej kolejności (start szeroko, koniec wąsko) — kierunek zgodny z nazwą. Uwagi jak wyżej.
- **Cable Hip Abduction**: stanie, linka z mankietem na prawej kostce, wyciąg po stronie przeciwnej (lewej osoby) — linka przechodzi przed nogą podporową, zgodnie z odwodzeniem. Noga prosta, odwiedzenie ok. 30° (kostka 8,5 → 51,8 cm w bok, stopa 13 cm nad podłogą w u = 1) — umiarkowanie, nie „za wysoko” (zgodnie z `hab.mis.high`). Miednica bez przechyłu, tułów pionowo (2°). Ślad: łuk 3,2 cm, 0 zawróceń — w progu. Ręce na biodrach (bez trzymania się słupka) — dopuszczalne.
- **Cable Hip Adduction**: wyciąg po stronie nogi pracującej, start z nogą odwiedzioną, ściąganie do środka i lekko przed nogę podporową (x 9,8 cm) — poprawnie. Tułów i miednica nieruchome. Ślad: łuk 4,1 cm, 0 zawróceń.
- **Lateral Band Walk / Monster Walk**: guma przy kostkach (dozwolone przez `bw.setup`), lekki przysiad trzymany (reguła polprzysiad spełniona w walidatorze), tułów pochylony stale 20°, ręce przed klatką, guma napięta (kostki ≥ 28 cm) — ustawienie dobre. Ruch: H-1, H-2.

## 2. Wyjątek toru `Cable Hip Adduction|front` — POTWIERDZONY

Pomiar w czystej kopii: odchylenie od cięciwy 4,12 cm, 0 zawróceń (próg 4 cm). Mankiet na kostce kreśli łuk wokół biodra o promieniu ok. długości nogi: strzałka łuku przy cięciwie ok. 48 cm i promieniu ok. 82 cm ≈ 3,6 cm, plus lekkie wysunięcie nogi przed podporową — wynik 4,1 cm jest geometrią łuku, nie „S”. Na arkuszu ślad jest gładkim łukiem bez zawróceń. Odwodzenie (ten sam ruch, mniejsza zmiana wysokości) mieści się w progu (3,2 cm) bez wyjątku — spójne.

## 3. Nakładka (`lib/figures/v2/overlay/hip_abd_add.ts`, rejestr `overlay.ts`)

Pion rysuje się tylko w Cable Hip Abduction i Cable Hip Adduction (`(lokalny katalog roboczy recenzenta, poza repo)`) — tam, gdzie zestaw ma `hab.hips`; Lateral Band Walk i Monster Walk nie mają tego zdania na karcie/zestawie, więc pominięcie zgodne z zasadą „tylko zdania z karty”. Maszyny (Hip Abduction/Adduction) też mają `hab.hips`, ale reguła `tulow_stoi` nie jest w ich wariantach (`warianty` mają tylko rozstaw_kolan) — pominięcie zgodne z danymi. Brak artefaktów (pion od miednicy do linii barków, prosty w każdym kadrze, oba motywy). Pominięcia z komentarza zasadne: kąt kolana w rzucie z przodu w skrócie; rozstawu silnik nie rysuje. Uwaga merytoryczna do reguły — N-2.

## 4. Prezentacja (`DATA_UI.hip_abd_add`)

- Nazwy faz: Rozsuwanie/Powrót (odwodzenie), Ściąganie/Powrót (przywodzenie) — PL trafne; EN „Pulling back” błędny kierunek (S-2). Dla marszów (LBW, Monster) — po poprawce H-1/H-2 prezentacja marszu (`walk`) zamiast faz wahadła.
- Tempo 1 s / 2 s: ta sama konwencja ilustracyjna co pozostałe rodziny (anim.ts), bez nowej liczby — bez uwag.
- Kąt ukryty we wszystkich 6: uzasadnienie prawdziwe — jedyny staw biodra w podpisie to „zgięcie biodra”, a ruch odbywa się w płaszczyźnie czołowej; pokazanie kąta byłoby nieprawdziwym podpisem.

## 5. Karta Lateral Band Walk (b30c831906fe) wobec rysunku v2

Treść karty (bw.setup, bw.move, bw.squat, bw.tension, bw.mis.sway) bez zmian i nadal poprawna. Spójność z rysunkiem: setup, przysiad, napięcie gumy, brak bujania — zgodne; **ruch (`bw.move`) — rysunek przeczy** (H-1). Błąd leży w rysunku, nie w karcie; karta może być wyświetlana bez figury v2.

## 6. Zestawy ogólne

- Hip Abduction, Hip Adduction, Cable Hip Adduction (hipAbd, `ac7f4cc69855`): `hab.hips`, `llc.control`, `mis.jerk` — przypisanie do ruchu właściwe (odwodzenie/przywodzenie przy nieruchomym tułowiu), teksty PL/EN zgodne z rysunkiem (tułów i miednica nieruchome, ruch płynny). Uwaga N-4 (liczba pojedyncza przy maszynach). Wyświetlane.
- Cable Hip Abduction (hipAbd z `hab.mis.high`, `659b60729fe0`): błąd „Noga za wysoko — biodro zaczyna się przechylać” właściwy dla odwodzenia w staniu; rysunek pokazuje poprawną, umiarkowaną wysokość bez przechyłu. Wyświetlany.
- Monster Walk (bandWalk, `9782f2bca6c8`): `bw.squat` + `mis.jerk` — przypisanie do ruchu właściwe (marsz z gumą w lekkim przysiadzie), teksty PL/EN poprawne. Zestaw wyświetlany; niezgodność („marsz” vs wahadło) jest błędem rysunku (H-2).

## Obszary sprawdzone bez znalezisk

Dane pozy (walidator OK, kolizje, podłoga), przenikanie widoczne (brak w obu motywach), miednica bez przechyłu (wszystkie klatki 0), tułów nieruchomy (pochylenie stałe w każdym ćwiczeniu), linka i mankiet (Cable), strona wyciągu, wyjątek toru, skróty, brak liczb i twierdzeń o zdrowiu w nowych tekstach, brak nazw innych firm i źródeł w UI.
