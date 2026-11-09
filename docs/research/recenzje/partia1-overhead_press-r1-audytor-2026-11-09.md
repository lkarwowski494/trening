# Recenzja niezależna — rodzina v2 `overhead_press`, runda r1 (audytor, 09.11.2026)

**Werdykt rodziny: do poprawy** (1 WYSOKIE). Ćwiczenia: 8 × wyświetlana, 13 × do poprawy, 2 bez rysunku (Bradford Press, Handstand Push Up).
Znaleziska: KRYTYCZNE 0, WYSOKIE 1, ŚREDNIE 3, NISKIE 1.

## Metoda
- SHA autora `0b390518` (figury/partia-1, scalenie partia-1-ohp 27dc6450); czysta kopia `git archive` w `/home/user/rev-p1/overhead_press-r1`. Poprawka śladu dźwigni 55c9f206 nie jest w tym stanie — oceniany stan bez niej.
- Arkusze: `arkusz-slad.mjs` — 21 ćwiczeń × side + front, motyw jasny (42 PNG, `arkusze/slad/`), ciemny dla 11 ćwiczeń (22 PNG, `arkusze/slad-dark/`); `arkusz-nakladka.mjs --family overhead_press` (44 PNG, `arkusze/nakladka/`, w tym poza błędu Pike). Kadry u = 0 / 0,5 / 1 każdego ćwiczenia w obu widokach oglądane w pełnej rozdzielczości (wycinki bez zmniejszania), pełne arkusze: Overhead Press (sztanga) side, Pike Push Up side.
- Liczby: `frameAt` + `jointAngles` co 0,05–0,1 (łokieć, zgięcie/odwiedzenie barku, kolano, biodro, obrót przedramienia, położenie chwytu względem barków i głowy), `gap` ciężar–tułów/głowa.
- `sha` z `node scripts/zrodla-runtime.mjs --skroty` w kopii (v2.overhead_press = ff9008d6a4eb — nie wpisane, bo werdykt „do poprawy”).
- `liczba` = 23 (`assignAll()`, w tym 2 bez rysunku).

## Znaleziska

| ID | Poziom | Pewność | Realność | Ćwiczenia / widok / kadr | Miara | Kierunek naprawy |
|---|---|---|---|---|---|---|
| W1 | WYSOKIE | 85% | realny (każde powtórzenie, oba widoki) | 13 ćwiczeń z generatora `wyciskanie()`: Overhead Press (sztanga), Overhead Press (hantle), Seated Shoulder Press (hantle), Push Press, Wyciskanie nad głowę (linki), Single Arm Overhead Press (hantel), Kettlebell Press, Seated Barbell Military Press, See-Saw Press, Band Shoulder Press, Seated Cable Shoulder Press, Kettlebell Seated Press, Double Kettlebell Press; side i front, u = 0 (i u ≤ 0,75) | Na dole chwyt 22 cm przed środkiem barków i 14 cm nad nimi (na wysokości brody); `gap` u=0: sztanga–tułów 15,0 cm, sztanga–głowa 12,3 cm; hantel–tułów 21,3 cm; kettlebell–tułów 11,5 cm; łokieć 23,4 cm przed barkami (u=0), 28,9 cm (u=0,25–0,5), zgięcie barku 51°. Do u≈0,75 ciężar idzie pionowo 21–22 cm przed twarzą, dopiero potem cofa się 15 cm nad głowę. Wycinek: `arkusze/slad/Overhead-Press-sztanga-side.png` u=0,00 (gryf przed brodą, odstęp od klatki widoczny). | Karty mówią: „sztanga przy przedniej części barków” (ohp.bbSetup, pp.setup), „sztanga z przodu barków” (ohp.bbGrip), „hantle przy barkach” (ohp.dbSetup, ohp.seat, ohp.saSetup), „kettlebell przy barku, łokieć blisko żeber” (kbp.setup/kbp.move), „opuść go z powrotem do barków” (ohp.move). Rysunek pokazuje dół ruchu przed brodą — dla trenera to skrócony zakres na dole i ciężar daleko od twarzy. Reguła `start_przy_barkach` (źródło: „sztanga na barkach”) jest sprawdzana tylko w pionie, więc test tego nie złapał (K5). | W `scripts/figures/agent-pozy/overhead_press.mjs` `wyciskanie()`: zmniejszyć `x0` (ok. 8–12 cm) i `dy0` (ok. 0–6 cm), tak by ciężar na dole leżał przy przedniej części barków (sztanga ≤ ok. 3–5 cm od tułowia), łokcie pod nadgarstkami i bliżej tułowia (kettlebell: łokieć przy żebrach), tor bliżej twarzy. Test: poziomy odstęp ciężaru od tułowia/barków na dole z przypadkiem negatywnym = dane sprzed poprawki (x0 22). |
| Ś1 | ŚREDNIE | 95% | realny | Seated Cable Shoulder Press — zestaw ogólny `ohp` | Zdanie `ohp.seat`: „…; hantle przy barkach.” przy ćwiczeniu z linkami (rysunek: dwa dolne bloczki, uchwyty). | Usunąć `ohp.seat` z tego ćwiczenia (CUE_REQUIRES na sprzęt hantle albo zdanie neutralne „uchwyty/ciężar przy barkach” — badacz/tłumacz). |
| Ś2 | ŚREDNIE | 85% | realny | Standing Barbell Press Behind Neck, Push Press - Behind the Neck; side, u = 0,75 → 1 | Chwyt względem barków (x świata): −13,0 cm do u=0,5, −9,1 (u=0,75), +3,0 (u=0,9), +8,0 cm (u=1) — gryf w ostatniej ćwiartce przesuwa się 21 cm w przód i kończy nad czołem. Zestaw ogólny BTN (`ohp.tall`): „ciężar idzie prosto w górę nad głowę”. Reguła ciezar_nad_barkami (≤ 10 cm) spełniona, więc test nie łapie. | Dla zza karku `xTop` ≤ 0 (gryf nad barkami/tyłem głowy) w granicy silnika (szczyt ze znacznym odwiedzeniem, shAbd 33°, więc limit shSag 171° zza karku nie musi wymuszać przesunięcia — do sprawdzenia przez autora); test: |dx| na całym torze ≤ ok. 10 cm. |
| Ś3 | ŚREDNIE | 90% | realny (widok z przodu) | Landmine Press, Landmine Linear Jammer, Single-Arm Linear Jammer; front, wszystkie kadry | Przy dłoniach rysuje się poprzeczny odcinek gryfu (20 cm w osi z), którego landmine nie ma (koniec gryfu leży wzdłuż dźwigni). Wycinek: `arkusze/slad/Landmine-Press-front.png` u = 0 / 0,5 / 1. Autor zgłosił to jako ograniczenie silnika. | Zgłoszenie silnika (fala wspólna): gryf landmine wzdłuż osi dźwigni; do tego czasu dopuszczalne do wyświetlenia (ruch i łuk poprawne). |
| N1 | NISKIE | 90% | teoretyczny (test) | test `figures-v2-ohp-p1.test.ts` „ciężar nie wchodzi w głowę, tułów…” | Dla obu ćwiczeń zza karku pętla pomija **wszystkie** części ciała (`continue`), a test zastępczy sprawdza tylko głowę i szyję; tułów i ramiona nie są sprawdzane (dziś gryf–tułów 4,2 cm, więc bez błędu). | Pomijać tylko parę gryf–głowa/szyja z progiem z testu zastępczego, resztę sprawdzać. |

Obserwacje poniżej progu zgłoszenia (pewność < 80%, bez znaleziska): kettlebell na szczycie rysowany z kulą na wysokości uchwytu za dłonią (zwykle opiera się niżej, na przedramieniu); szczyt ramię ok. 9° przed pionem (znane ograniczenie silnika, mieści się w regule ≤ 10 cm).

## Tabela ćwiczeń

| Ćwiczenie | Werdykt | Uwagi |
|---|---|---|
| Overhead Press (sztanga) | do poprawy | W1 |
| Overhead Press (hantle) | do poprawy | W1 (oś hantla poprzecznie, obrót −80° — poprawnie) |
| Seated Shoulder Press (hantle) | do poprawy | W1 (ławka 85°, kolano 78° — poprawnie) |
| Push Press | do poprawy | W1; ugięcie kolan 50° i wyprost przed wyciśnięciem — poprawnie |
| Wyciskanie nad głowę (linki) | do poprawy | W1; linki z dolnych bloczków po bokach — poprawnie |
| Single Arm Overhead Press (hantel) | do poprawy | W1; wolna ręka na biodrze |
| Kettlebell Press | do poprawy | W1 (łokieć 23 cm przed barkiem wobec „łokieć blisko żeber”) |
| Seated Barbell Military Press | do poprawy | W1 |
| See-Saw Press (Alternating Side Press) | do poprawy | W1; przeciwfaza rąk poprawna |
| Band Shoulder Press | do poprawy | W1 (karta luźniej: „w okolice barków”; poprawka wspólna) |
| Seated Cable Shoulder Press | do poprawy | W1, Ś1 |
| Kettlebell Seated Press | do poprawy | W1 |
| Double Kettlebell Press | do poprawy | W1 |
| Arnold Press | wyswietlana | start przed twarzą, obrót 80° → −75°, łokieć 9° |
| Kettlebell Arnold Press | wyswietlana | jak Arnold, jednorącz |
| Standing Barbell Press Behind Neck | wyswietlana | Ś2 (backlog/poprawka przy W1) |
| Push Press - Behind the Neck | wyswietlana | Ś2 |
| Landmine Press | wyswietlana | Ś3 |
| Landmine Linear Jammer | wyswietlana | Ś3 |
| Single-Arm Linear Jammer | wyswietlana | Ś3 |
| Pike Push Up | wyswietlana | ślad miednicy, błąd push.mis.partial |
| Bradford Press, Handstand Push Up | bez rysunku | K3: wyjątek nie dopisany do `figury-wyjatki.json` — decyzja przed r2 |

## Nakładka
3 elementy, wszystkie z reguł „ustalone” (`wyprost_lokci`, `lokcie_pod_dlonmi`, `ciezar_nad_barkami`). Pion przez bark tylko z boku (bez artefaktu w rzucie z przodu), pion pod nadgarstkiem z boku i z przodu, kąt łokcia z boku — zgodne z wskazówkami kart (ohp.tall, ohp.elbowsUnder, ohp.fullExt). Jedyna poza błędu (Pike, push.mis.partial) zmienia zakres łokcia — bez elementu nakładki do pokolorowania. Bez znalezisk. Po poprawce W1 element `ohpElbowsUnderRef` trzeba obejrzeć ponownie (zmieni się położenie łokcia).

## Zestawy ogólne (K12)
- wyswietlana: Landmine Press, Pike Push Up, Push Press - Behind the Neck, Kettlebell Arnold Press, Landmine Linear Jammer, Single-Arm Linear Jammer (wpisy w JSON z `sha` z `--skroty`).
- do poprawy (bez wpisu): Seated Cable Shoulder Press (Ś1 + W1), Standing Barbell Press Behind Neck (`ohp.tall` „prosto w górę” przeczy torowi z Ś2), See-Saw Press i Double Kettlebell Press (`ohp.move` „opuść… do barków” przeczy rysunkowi z W1).

## Karty własne bez wpisu „karty” (K11)
Overhead Press (sztanga), Overhead Press (hantle), Seated Shoulder Press (hantle), Wyciskanie nad głowę (linki) — treść kart poprawna, ale rysunek jej przeczy (W1: „przy przedniej części barków”, „hantle przy barkach”, „uchwyty przy barkach”). Werdykt: do poprawy rysunku, bez wpisu; recenzja kart w r2 po poprawce W1. K10: wpisy v1 tych 5 ćwiczeń → `zastapiona` dopiero przy wyświetlaniu v2 (po r2).

## Testy (K14) — `git diff 233c0f25..0b390518 -- tests/` w części overhead_press
| Plik | Zmiana | Ocena |
|---|---|---|
| figures-v2-mapping.test.ts | lista ready, POSE_FAMILIES, licznik figur +21 | uzasadnione (podłączenie) |
| figures-v2-nakladka-triceps-olympic.test.tsx | rejestr TECHNIQUE 12 → 13 rodzin | uzasadnione |
| strona-eksport.test.ts | 257 → 278 figur (+21) | uzasadnione |
| fixtures/pokrycie-katalogu.json | status planned → ready | uzasadnione |
| figures-v2-ohp-p1.test.ts (nowy) | 26 testów z negatywami | dobry zakres; luki: K8 start_przy_barkach tylko w pionie (nie łapie W1), brak miary |dx| zza karku na całym torze (Ś2), N1 |
Poluzowań oczekiwań w testach innych rodzin brak.

## Czas pracy
Ok. 15 min agenta (22:10–22:22 UTC).
