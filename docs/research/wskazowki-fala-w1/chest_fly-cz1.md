# chest_fly (część 1, rozpiętki) — wskazówki techniki, fala W1 (badacz-merytoryczny, 02.11.2026)

Metoda: brief fali W1 + CLAUDE.md („Wyjątek dla wskazówek techniki”): zdanie ustalone, gdy zgadzają się ≥ 2 niezależne źródła
szczebla 4 i żadne przeczytane nie przeczy. Wszystkie źródła przeczytane 02.11.2026 (WebFetch). ExRx (403) i web.archive.org
(zablokowane) niedostępne — istniejących wpisów ExRx nie używam dla nowych wariantów, bo nie mogłem ich przeczytać.
Strony aplikacji treningowych i serwisy konsumenckie z wyników wyszukiwania pominięte (nie są źródłem, nazwy nie zapisane).
Szczeble źródeł poprawione 02.11.2026 wg rozstrzygnięcia koordynatora linii 1.1 — patrz „Korekta szczebli” i „Korekta szczebli — uzupełnienie 3” na końcu.

## Ćwiczenia

| Ćwiczenie | Stan (gotowe/otwarte) | Uwagi |
|---|---|---|
| Pec Deck | otwarte | po uzupełnieniu 3: kopia instrukcji Life Fitness bez potwierdzonej zgodności z oryginałem producenta → nie liczy się; zostaje tylko Hoist (jedna organizacja, dwie strony) — patrz Otwarte 2 |
| Incline Chest Fly (hantle) | otwarte | tylko 1 źródło wprost o ławce skośnej (NFPT, wpis gościnny — szczebel 5); ACE 21 opisuje ławkę płaską (analogia) |
| Cable Fly (high to low) | otwarte | tylko 1 źródło wprost (Major Fitness); ACE 160 i NASM opisują bloczki na wysokości barków lub tuż wyżej, nie „z góry w dół” |
| Cable Fly (low to high) | częściowe (bez błędu) | ustawienie + ruch z 2 źródeł (ACE 163, Major Fitness); błąd i łokcie — po 1 źródle |
| Incline Cable Fly | otwarte | brak przeczytanego źródła o rozpiętkach na wyciągu leżąc na ławce skośnej |
| Flat Bench Cable Fly | otwarte | brak źródła o wersji leżąc; Major Fitness opisuje wersję siedząc na ławce (inne ćwiczenie niż figura — ławka 0°, leżąc) |
| Single Arm Cable Fly | otwarte | wspólny tylko błąd (skręt tułowia: ACE 163 wariant jednorącz + Bodylastics, guma); ustawienie i ruch po 1 źródle |
| Decline Dumbbell Fly | otwarte | brak przeczytanego źródła szczebla 4 o ławce skośnej w dół — patrz Otwarte 6 (zdania zestawu ogólnego) |
| One-Arm Flat Bench Dumbbell Fly | otwarte | brak źródła o wersji jednorącz na ławce |
| Band Chest Fly | częściowe (bez błędu) | ustawienie + ruch + 1 wskazówka z 2–3 źródeł (Thera-Band, ACE 160, Bodylastics); brak błędu z 2 źródeł (wzór: „Cable Fly” w repo ma `mistakes: []`) |

## Blok JSON do data/zrodla/cues.json (sekcja exercises) — NIEAKTUALNY — patrz przeliczenie 02.11.2026 (`przeliczenie-szczebli-2026-11-02.md`, „Korekta 2”: Cable Fly (low to high) otwarte; Band Chest Fly przeniesiony do bloku przeliczenia)

```json
{
 "Cable Fly (low to high)": {
  "setup": [
   {"c": "cfly.low.setup", "s": [
     ["ace-163", "Step 1 (handles between knee and hip height)"],
     ["majorfitness-cable-fly", "sekcja Low-to-High Cable Fly (pulleys at the lowest position)"]]}
  ],
  "move": [
   {"c": "cfly.low.move", "s": [
     ["ace-163", "Step 3 (arms forward until hands meet in front of the face or above the head)"],
     ["majorfitness-cable-fly", "sekcja Low-to-High Cable Fly (sweep upward and inward, finishing around face height)"]]}
  ],
  "tips": [],
  "mistakes": []
 },
 "Band Chest Fly": {
  "setup": [
   {"c": "bfly.setup", "s": [
     ["therabend-chest-flies", "kroki 1–3 (anchor at shoulder height, face away, staggered stance)"],
     ["ace-160", "opis (sprzęt: Resistance Bands/Cables; step forward so arms extend out to the sides)"]]}
  ],
  "move": [
   {"c": "bfly.move", "s": [
     ["therabend-chest-flies", "kroki 4–5 (pull inward in front of you; slowly let the bands return)"],
     ["ace-160", "opis (slowly bring hands together in front; slowly return)"],
     ["bodylastics-crossover-fly", "Movement; Return (sweep in front of chest; back under control)"]]}
  ],
  "tips": [
   {"c": "bfly.arms", "s": [
     ["therabend-chest-flies", "kroki 3–4 (keeping your elbows straight)"],
     ["bodylastics-crossover-fly", "Arm and elbow (slight bend, hold it throughout)"]]}
  ],
  "mistakes": []
 }
}
```

Uwaga do `bfly.arms`: źródła różnią się (Thera-Band: łokcie proste; Bodylastics i ACE 160: lekko ugięte). Część wspólna: kąt łokcia
się nie zmienia, ręce (prawie) proste — dlatego nie użyłem `fly.elbows` ani `cfly.move` („przy lekko ugiętych łokciach”).

## Nowe zdania (id | PL | EN)

| id | PL | EN (propozycja) |
|---|---|---|
| pdeck.seat | Ustaw siedzisko tak, żeby uchwyty były mniej więcej na wysokości barków. | Set the seat so the handles are roughly at shoulder height. |
| pdeck.back | Usiądź prosto, plecy przy oparciu, stopy pewnie oparte. | Sit tall with your back against the pad and your feet planted. |
| pdeck.move | Złącz uchwyty przed klatką płynnym łukiem, potem powoli wróć. | Bring the handles together in front of your chest in a smooth arc, then return slowly. |
| pdeck.mis.lock | Blokowanie łokci w pełnym wyproście. | Locking the elbows out straight. |
| cfly.low.setup | Ustaw bloczki nisko i chwyć po uchwycie w każdą rękę. | Set the pulleys low and take a handle in each hand. |
| cfly.low.move | Prowadź ręce łukiem w górę i do środka, aż dłonie spotkają się mniej więcej na wysokości twarzy. | Sweep your arms up and in until your hands meet at about face height. |
| bfly.setup | Zaczep gumę za sobą mniej więcej na wysokości barków, stań tyłem do zaczepu w lekkim wykroku. | Anchor the band behind you at about shoulder height and stand facing away in a split stance. |
| bfly.move | Ściągnij ręce łukiem przed klatkę, potem powoli oddaj gumę do rozłożenia rąk. | Bring your arms together in an arc in front of your chest, then let the band back out slowly. |
| bfly.arms | Ręce prawie proste — nie zginaj łokci w trakcie ruchu. | Keep your arms nearly straight — don't bend the elbows during the rep. |

Uwagi: zdania `pdeck.*` po uzupełnieniu 3 są tylko kandydatami (Pec Deck otwarte) — nie do wdrożenia, dopóki nie będzie drugiego źródła.
`pdeck.back` celowo bez „stopy na podłodze” — Hoist RS-1302 każe trzymać stopy na podnóżkach (różnice między maszynami).
„Lekki wykrok” w `bfly.setup`: Thera-Band krok 2 (staggered stance); ACE 160 tylko „krok w przód” — część „tyłem do zaczepu,
krok/wykrok w przód” wspólna; jeśli recenzent uzna „wykrok” za jedno źródło, skrócić do „stań tyłem do zaczepu”.

## Nowe źródła (id | adres | organizacja | szczebel | data odczytu)

| id | adres | organizacja | szczebel | data odczytu |
|---|---|---|---|---|
| hoist-hd3900 | https://hoistfitness.com/pages/hd-3900-pec-fly-rear-delt | Hoist Fitness (producent maszyny — własny rodzaj sprzętu; nowa org., kind: maker) | 4 | 02.11.2026 |
| hoist-rs1302 | https://www.hoistfitness.com/pages/rs-1302-pec-fly | Hoist Fitness (ta sama org. co wyżej — nie liczy się jako drugie niezależne) | 4 | 02.11.2026 |
| lifefitness-pro-manual | https://www.manualsdir.com/manuals/166239/life-fitness-pro-series.html?page=17 | kopia instrukcji Life Fitness „Pro Series Owner's Manual” M051-00416-A000 (03.2001), s. 17 „Rear deltoid/pectoral fly (SU35)”, w serwisie z instrukcjami; zgodności z oryginałem producenta nie potwierdzono (uzupełnienie 3) | nie źródło (kopia niepotwierdzona) | 02.11.2026 (tylko do Otwartych) |
| western-chest | https://www.uwo.ca/campusrec/orientation/equipment_guides/chest.html | Western University, Sport and Recreation Services | 5 | 02.11.2026 |
| ace-163 | https://www.acefitness.org/education-and-resources/lifestyle/exercise-library/163/standing-incline-cable-flyes/ | ACE — Standing Incline Cable Flyes (#163) | 4 | 02.11.2026 |
| majorfitness-cable-fly | https://www.majorfitness.com/blogs/training-tips/cable-chest-fly | Major Fitness (producent wyciągów i bramownic do domu — własny rodzaj sprzętu; A. Wang, NSCA-CPT, NASM-CES, 13.05.2026; treść w większości instruktażowa; nowa org., kind: maker) | 4 | 02.11.2026 |
| therabend-chest-flies | https://www.performancehealthacademy.com/exercises/thera-band-chest-flies.html | Performance Health (producent gum Thera-Band — własny rodzaj sprzętu; nowa org., kind: maker) | 4 | 02.11.2026 |
| bodylastics-crossover-fly | https://bodylastics.com/crossover-chest-fly/ | Bodylastics USA (producent gum — własny rodzaj sprzętu; nowa org., kind: maker) | 4 | 02.11.2026 |
| nfpt-incline-fly | https://nfpt.com/?p=4355 | NFPT — „How To Do Incline Bench Dumbbell Flyes” (autor „Guest”, bez kwalifikacji; 11.08.2025) | 5 | 02.11.2026 (tylko do Otwartych) |

Uwaga do id `ace-163`: ten sam numer 163 w bibliotece ACE wskazuje też inną stronę (Elliptical Trainer, inny adres) — przed wpisem sprawdzić, czy w `sources` nie ma już `ace-163`.
Istniejące źródła użyte ponownie: `ace-160` (Standing Chest Fly; sprzęt na stronie: „Resistance Bands/Cables”).

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie/zdanie | powód |
|---|---|
| 1. Incline Chest Fly (hantle) | wprost o ławce skośnej tylko NFPT (wpis gościnny, szczebel 5); ACE 21 i treść WebMD Ignite (ColumbiaDoctors) — ławka płaska / „ławka lub piłka” = analogia. Kąt ławki: NFPT 30–45°, inne strony (konsumenckie, nie źródła) 15–45° — liczba nieustalona |
| 2. Pec Deck (cała karta) | tylko Hoist (HD-3900 + RS-1302 — jedna organizacja). Kopia instrukcji Life Fitness (serwis z instrukcjami, nr M051-00416-A000, 03.2001) — oryginału producenta nie udało się odczytać (strona wsparcia producenta 403; jedyna inna kopia u dealera), więc zgodności numeru i wersji nie potwierdzono → nie liczy się (uzupełnienie 3). Kandydaci: `pdeck.seat`, `pdeck.back`, `pdeck.move`, `pdeck.mis.lock` (Hoist: miejsca jak w poprzedniej wersji bloku). Potrzebne drugie źródło szczebla 4 (inny producent maszyny albo organizacja szkoląca) |
| 3. Cable Fly (high to low) | tylko Major Fitness (bloczki najwyżej, ręce kończą przy biodrach); ACE 160 i NASM Cable Crossover — bloczki na wysokości barków lub tuż wyżej, dłonie przed klatką (inny tor). Thera-Band: wyższy zaczep = „decline fly”, bez opisu toru |
| 4. Cable Fly (low to high) — łokcie, powrót, błąd | `fly.elbows`: wprost dla tego wariantu tylko ACE 163 (Major Fitness — kąt łokcia w sekcji wersji podstawowej); „wracaj powoli” — tylko ACE 163; błąd „pochylanie się w przód” — tylko ACE 163 |
| 5. Single Arm Cable Fly | wspólny tylko błąd „skręcanie tułowia/barków za ręką” (ACE 163, wariant jednorącz; Bodylastics, guma jednorącz — inny sprzęt, a producent gum liczy się tylko dla gum); ustawienie (wolna ręka na biodrze/stojaku — Major Fitness; bokiem do zaczepu — Bodylastics) i ruch — po 1 źródle |
| 6. Decline Dumbbell Fly | brak przeczytanego źródła szczebla 4 (ACE, NASM, NFPT nie mają strony; reszta wyników — serwisy konsumenckie i aplikacje). Zdania zestawu ogólnego (`fly.elbows`, `fly.control`, `mis.jerk`) nie wspominają ławki, ale żadne przeczytane źródło ich dla ławki skośnej w dół nie potwierdza → wg uzupełnienia briefu (pkt 3) nie wpisywać jako własnych; do decyzji koordynatora, czy zostaje zestaw ogólny. Szczegóły ławki w dół (zaczepienie stóp, wejście z hantlami) — bez źródła |
| 7. One-Arm Flat Bench Dumbbell Fly | brak źródła o wersji jednorącz na ławce (tylko serwisy konsumenckie) |
| 8. Incline Cable Fly, Flat Bench Cable Fly | brak źródła o rozpiętkach na wyciągu leżąc (skośnie/płasko); Major Fitness: wersja siedząc na ławce płaskiej — inna pozycja niż figura |
| 9. Band Chest Fly — błąd | brak błędu z 2 źródeł (Thera-Band i ACE 160 nie podają błędów; Bodylastics — skręt tułowia, wersja jednorącz) |
| 10. Pec Deck — `mcp.blades` (zestaw ogólny) | żadne z przeczytanych źródeł pec fly nie mówi o łopatkach — nie wpisane |

## Stan

Zrobione wszystkie 10 ćwiczeń części 1 (po uzupełnieniu 3: 2 z blokiem JSON — oba częściowe, 8 otwartych). Pułapki: ExRx 403, web.archive.org zablokowane,
strona NFPT z archiwum (archive25.nfpt.com) — 503, PDF rozszerzenia UNL — 403, strona UQ Pressbooks — 403, strona wsparcia Life Fitness — 403.
Następny krok, jeśli wracamy do otwartych: instrukcje maszyn i podręczniki producentów (np. tablice ćwiczeń przy wyciągach
z ławką), materiały organizacji szkolących trenerów z opisem wersji na ławce skośnej w dół i skośnej; dla Pec Deck — drugi producent maszyny.

## Korekta szczebli (02.11.2026)

Podstawa: rozstrzygnięcie koordynatora linii 1.1 z 02.11.2026 (kryteria (a)(b)(c)). Autor, data i charakter strony Major Fitness
sprawdzone przez WebFetch 02.11.2026; bez nowych badań treści.

Źródła:
- western-chest (Western Univ. SRS): 4 (propozycja) → 5 (rozstrzygnięcie); usunięte z list `s` w bloku JSON.
- nfpt-incline-fly (NFPT, autor „Guest”): 4 → 5 — brak autora z kwalifikacjami; użyte tylko w „Otwarte”.
- majorfitness-cable-fly (Major Fitness): 4 → 4 — producent wyciągów (własny rodzaj sprzętu), autor z certyfikatami i data, treść w większości instruktażowa.
- lifefitness-pro-manual (Life Fitness, kopia instrukcji): 4 → 4 — dokument producenta dla własnej maszyny; zastrzeżenie o kopii w Otwarte 2. (Zmienione w uzupełnieniu 3 — niżej.)
- hoist-hd3900, hoist-rs1302 (Hoist): 4 → 4 — producent własnej maszyny (jedna organizacja).
- therabend-chest-flies (Performance Health), bodylastics-crossover-fly (Bodylastics): 4 → 4 — producenci gum, tylko dla ćwiczeń z gumą.
- ace-163, ace-160: 4 → 4.

Ćwiczenia:
- Pec Deck: gotowe → gotowe (każde zdanie nadal ma Hoist + Life Fitness). (Zmienione w uzupełnieniu 3 — niżej.)
- Cable Fly (low to high): gotowe (krótka karta) → częściowe (bez błędu).
- Band Chest Fly: gotowe (bez błędów) → częściowe (bez błędu).
- Pozostałe 7 ćwiczeń: otwarte → otwarte.

## Korekta szczebli — uzupełnienie 3 (02.11.2026)

Podstawa: „Uzupełnienie 3 szczebli” koordynatora linii 1.1 (kopie instrukcji Life Fitness liczą się tylko po potwierdzeniu zgodności numeru
i wersji z oryginałem producenta). Sprawdzenie WebFetch 02.11.2026:
- kopia w serwisie z instrukcjami, s. 1: „PRO SERIES OWNER'S MANUAL”, nr M051-00416-A000, marzec 2001;
- strona wsparcia producenta (support.lifefitness.com) — 403 przy każdej próbie (artykuły i wyszukiwarka); wyszukiwanie nie znalazło tego
  dokumentu u producenta — jedyna inna kopia jest u dealera (też osoba trzecia). Zgodności z oryginałem producenta nie potwierdzono.

Zmiany:
- lifefitness-pro-manual: 4 → nie źródło (kopia niepotwierdzona); usunięte z bloku JSON, zostaje tylko w „Otwarte”.
- Pec Deck: gotowe → otwarte (każde zdanie miało tylko Hoist + Life Fitness; Hoist to jedna organizacja); wpis usunięty z bloku JSON, kandydaci w Otwarte 2.
- Cable Fly (low to high), Band Chest Fly: bez zmian (częściowe; źródła ACE, Major Fitness, Performance Health, Bodylastics nieobjęte uzupełnieniem 3).
