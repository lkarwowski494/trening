# Wskazówki techniki — fala W1, rodzina `neck` (szyja)

Data: 02.11.2026. Autor: badacz merytoryczny (agent; dwie sesje tego samego dnia + korekta szczebli). Zakres: tylko zbieranie danych (polecenie właściciela 02.11.2026) — nic nie trafia
do `lib/` ani `data/zrodla/` bez akceptacji i wdrożenia przez programistę. Metoda: `docs/research/27-wskazowki-zrodla.md`, `docs/research/33-wskazowki-partia2.md`
(≥ 2 przeczytane źródła z różnych organizacji na zdanie; wariant liczy się z opisem, inne ćwiczenie = analogia; bez twierdzeń medycznych;
cytat ≤ 1 zdanie). Szyja = obszar wrażliwy: czasy przytrzymania, obciążenia, „nie do bólu”, przeciwwskazania — tylko wg pełnych zasad (szczebel 1–2
albo kilka niezależnych 2–3); żadne z nich nie jest tu proponowane.
Szczeble źródeł poprawione 02.11.2026 wg rozstrzygnięcia koordynatora linii 1.1 — sekcja „Korekta szczebli 02.11.2026” na końcu.

## Tabela ćwiczeń

| Ćwiczenie (klucz katalogu) | Stan | Uwagi |
|---|---|---|
| Isometric Neck Exercise - Sides | **otwarte** (po korekcie; było gotowe, 5 zdań) — **do decyzji koordynatora linii** | po korekcie liczy się tylko jedno źródło szczebla 4 (Healthwise/WebMD Ignite: HealthLink BC, ta sama treść u Kaiser Permanente); NHS CHT i NHS NCM — do decyzji. Przy uznaniu NHS: gotowe, 3 zdania |
| Isometric Neck Exercise - Front And Back | **otwarte** (po korekcie; było gotowe, 5 zdań) — **do decyzji koordynatora linii** | jw.; RelayHealth — do decyzji. Przy uznaniu NHS: 3 zdania; przy uznaniu RelayHealth: 2 zdania (tył); przy obu: 5 |
| Lying Neck Extension (talerz) | **otwarte** | sesja 2: nadal brak przeczytanego źródła szczebla 4 z organizacji; wyniki wyszukiwania to wyłącznie serwisy konsumenckie i strony aplikacji (odrzucone) |
| Lying Neck Flexion (talerz) | **otwarte** | jak wyżej |
| Neck Harness Extension | **otwarte** | sesja 2: dwaj producenci (Iron Neck; RDX Sports) zgodni tylko co do „powoli, pod kontrolą”; pozycja ciała rozbieżna, tekst RDX ma błąd kopiowania i prawie identyczny tekst sklepu DMoose (zależność) — zbyt słabe na kartę |

## Blok do wklejenia (`data/zrodla/cues.json`, gałąź `exercises`)

Po korekcie 02.11.2026 **pusty** — żadne ćwiczenie nie ma dziś ≥ 2 zdań z dwoma policzonymi źródłami szczebla 4:

```json
{}
```

### Kandydaci wstrzymani przy korekcie (NIE do `exercises` do decyzji koordynatora linii; zachowane bez zmian)

Kolumna „przy uznaniu” niżej mówi, które zdania wrócą do bloku. Oznaczenia: [WI] = Healthwise/WebMD Ignite (liczone, szczebel 4),
[NHS?] = materiał szpitala NHS (do decyzji), [RH?] = RelayHealth (do decyzji), [UMM] = WebMD Ignite bez daty (nie liczy się osobno — ten sam wydawca co [WI]).

```json
{
  "Isometric Neck Exercise - Sides": {
    "setup": [
      {"c": "neck.isoSide.sit", "s": [["nhs-cht-neck", "s. 2, Isometric side flexion, krok 1"], ["umm-neck-iso", "wstęp: pozycja wyjściowa"]]},
      {"c": "neck.isoSide.hand", "s": [["nhs-cht-neck", "s. 2, Isometric side flexion, krok 2"], ["healthlinkbc-iso-head", "Right side of neck, krok 1"]]}
    ],
    "move": [
      {"c": "neck.isoSide.press", "s": [["nhs-cht-neck", "s. 2, Isometric side flexion, krok 2"], ["healthlinkbc-iso-head", "wstęp + Right side of neck, kroki 2–3"], ["nhs-ncm-neck", "s. 15, Cervical Spine Side Flexion Isometric, zdanie 3"]]}
    ],
    "tips": [
      {"c": "neck.isoSide.shoulders", "s": [["nhs-cht-neck", "s. 2, Isometric side flexion, krok 1"], ["umm-neck-iso", "wstęp: pozycja wyjściowa"]]}
    ],
    "mistakes": [
      {"c": "neck.iso.mis.headMoves", "s": [["healthlinkbc-iso-head", "Right side of neck, krok 3"], ["nhs-cht-neck", "s. 2, Isometric side flexion, krok 2 (parafraza: dłoń stawia opór ruchowi)"]]}
    ]
  },
  "Isometric Neck Exercise - Front And Back": {
    "setup": [
      {"c": "neck.isoFront.hand", "s": [["nhs-cht-neck", "s. 2, Isometric flexion, krok 2"], ["healthlinkbc-iso-head", "Front of neck, krok 1"], ["nhs-ncm-neck", "s. 14, Cervical Spine Flexion Isometric, zdanie 2"]]},
      {"c": "neck.isoBack.hands", "s": [["healthlinkbc-iso-head", "Back of neck and upper back, kroki 1–2"], ["relayhealth-stinger", "Extension, krok 1"]]}
    ],
    "move": [
      {"c": "neck.isoFront.press", "s": [["nhs-cht-neck", "s. 2, Isometric flexion, krok 2"], ["nhs-ncm-neck", "s. 14, Cervical Spine Flexion Isometric, zdanie 3"]]},
      {"c": "neck.isoBack.press", "s": [["healthlinkbc-iso-head", "Back of neck and upper back, krok 3"], ["relayhealth-stinger", "Extension, krok 2"]]}
    ],
    "mistakes": [
      {"c": "neck.iso.mis.headMoves", "s": [["healthlinkbc-iso-head", "Back of neck and upper back, krok 5"], ["nhs-ncm-neck", "s. 14, zdanie 3 (wariant: przód — opór dłoni wobec każdego ruchu głowy)"]]}
    ]
  }
}
```

| zdanie | źródła (po korekcie) | przy uznaniu NHS | przy uznaniu RelayHealth |
|---|---|---|---|
| neck.isoSide.sit | [NHS?] CHT + [UMM] | nie (UMM bez daty; Kaiser — nie sprawdzono tego zdania) | — |
| neck.isoSide.hand | [NHS?] CHT + [WI] | tak | — |
| neck.isoSide.press | [NHS?] CHT + [WI] + [NHS?] NCM | tak | — |
| neck.isoSide.shoulders | [NHS?] CHT + [UMM] | nie (Kaiser nie ma „relax your shoulders” przy izometrii — tylko przy rozciąganiu) | — |
| neck.iso.mis.headMoves (bok) | [WI] + [NHS?] CHT | tak | — |
| neck.isoFront.hand | [NHS?] CHT + [WI] + [NHS?] NCM | tak | — |
| neck.isoFront.press | [NHS?] CHT + [NHS?] NCM | tak | — |
| neck.isoBack.hands | [WI] + [RH?] | — | tak |
| neck.isoBack.press | [WI] + [RH?] | — | tak |
| neck.iso.mis.headMoves (przód/tył) | [WI] + [NHS?] NCM | tak | — |

Uwagi do „Front And Back” (sesja 2):
- `neck.isoFront.hand` — NCM: „across your forehead” (dłoń), CHT: dłoń na czole, HealthLink BC: dłoń lub nasady obu dłoni; „albo nasady obu dłoni” ma tylko HealthLink BC — jeśli recenzent
  uzna to za wykraczające poza dwa źródła, skrócić do „Połóż dłoń na czole.” (CHT + NCM).
- `neck.isoFront.press` — „dłonią trzymaj opór — głowa zostaje w miejscu”: CHT („use your hand to resist the movement”) i NCM („firmly resisting any movement of your head with your hand”).
- `neck.isoBack.press` celowo krótsze niż wersja przodu: RelayHealth podaje tylko docisk tyłu głowy do dłoni; opór dłoni i nieruchomą głowę dla tyłu ma tylko HealthLink BC.
  Brak ruchu głowy na karcie pokrywa zdanie błędu `neck.iso.mis.headMoves` (tył: HealthLink BC; przód: NCM — wariant w obrębie tej samej karty).
- NCM: „as hard as you are able” — sprzeczne z HealthLink BC („not quite as hard as you can”) → siła docisku zostaje otwarta (pkt 3).

## Nowe zdania

Istniejące zdania z `lib/cues/text/pl.json` przejrzane (m.in. `crunch.neck`, `wall.breath`, `st.breathe`, `llc.control`) — żadne nie ma
przeczytanych źródeł dla tych ćwiczeń, więc nie są używane (zasada koordynatora: bez zdań ogólnych niepotwierdzonych dla ćwiczenia).
Po korekcie 02.11.2026 wszystkie poniższe zdania są **wstrzymane** (otwarte do decyzji koordynatora linii o szczeblu NHS i RelayHealth).

| id | PL | EN |
|---|---|---|
| neck.isoSide.sit | Usiądź prosto na krześle, stopy płasko na podłodze. | Sit up tall on a chair with your feet flat on the floor. |
| neck.isoSide.hand | Połóż dłoń z boku głowy, nad uchem. | Place your hand on the side of your head, just above your ear. |
| neck.isoSide.press | Dociskaj głowę w bok do dłoni, a dłonią trzymaj opór — głowa zostaje w miejscu. | Press your head sideways into your hand while your hand pushes back — your head stays put. |
| neck.isoSide.shoulders | Barki luźno, nie podciągaj ich. | Keep your shoulders relaxed. |
| neck.iso.mis.headMoves | Głowa przechyla się, zamiast stać w miejscu. | Letting your head tip instead of holding it still. |
| neck.isoFront.hand | Połóż dłoń (albo nasady obu dłoni) na czole. | Place your hand — or the heels of both hands — on your forehead. |
| neck.isoFront.press | Dociskaj czoło do dłoni, a dłonią trzymaj opór — głowa zostaje w miejscu. | Push your forehead into your hand while your hand pushes back — your head stays put. |
| neck.isoBack.hands | Spleć dłonie i połóż je z tyłu głowy. | Clasp your hands and place them on the back of your head. |
| neck.isoBack.press | Dociskaj tył głowy do splecionych dłoni. | Press the back of your head into your clasped hands. |

Uwaga do `neck.isoSide.shoulders`: „nie podciągaj ich” to doprecyzowanie „relaxed”; jeśli recenzent uzna je za wykraczające poza źródła — samo „Barki luźno.”

## Źródła

| id | Adres | Organizacja | Szczebel (po korekcie 02.11.2026) | Miejsce i cytat (≤ 1 zdanie) |
|---|---|---|---|---|
| nhs-cht-neck | https://plr.cht.nhs.uk/download/1077/Neck%20Strength%20and%20stability%20Exercises%20A4 | Calderdale and Huddersfield NHS Foundation Trust, fizjoterapia (ulotka csph0153 v2, przegląd 10/28) | **do decyzji koordynatora linii** — zachowawczo nie liczone (było: 4) | s. 2 „Isometric side flexion” kr. 2: „Place your hand above your ear (which is closest to your shoulder) and push your head side ways into your hand.”; kr. 1: „Keep your shoulders relaxed throughout”; „Isometric flexion” kr. 2: „Place your hand on your forehead and push your head into your hand, use your hand to resist the movement.” (s. 2 przeczytana ponownie w sesji 2 — brak ćwiczenia „extension”) |
| nhs-ncm-neck | https://northcheshireandmersey.nhs.uk/media/cq5b2ddw/neck-strengthening-exercises-patient-advice-sheet.pdf | North Cheshire and Mersey NHS Foundation Trust, Musculoskeletal Physiotherapy OCATS („Neck Strengthening Exercises”, 16 s.; bez daty) | **do decyzji koordynatora linii** — zachowawczo nie liczone (było: 4) | przeczytane s. 1–16; s. 14 „Cervical Spine Flexion Isometric Exercise”: „Push your head and neck forward as hard as you are able while firmly resisting any movement of your head with your hand”; s. 15 (side flexion): „Place your hand across your temple.”; brak wersji „extension” |
| relayhealth-stinger | https://iris.hattiesburgclinic.com/patadv/aha/aha_stinger_rex.htm | RelayHealth (McKesson), „Adult Advisor 2016.4”, publikowane przez Hattiesburg Clinic | **do decyzji koordynatora linii** — zachowawczo nie liczone (było: 4) | Extension: „Clasp your hands together and place them behind your head.”; „Press the back of your head into your palms.” (oba potwierdzone ponownie 02.11.2026) |
| healthlinkbc-iso-head | https://www.healthlinkbc.ca/healthwise/isometric-exercise-hands-head | HealthLink BC (usługa rządu prowincji Kolumbia Brytyjska), treść Healthwise (WebMD Ignite); recenzja lekarska (5 lekarzy wymienionych z nazwiska); aktualne na 27.02.2023 | 4 (reguła koordynatora dla WebMD Ignite — tu ta sama treść opublikowana z datą także przez Kaiser Permanente, kp-neck-ex) | wstęp: „Isometric means you push against resistance without moving your head.” (parafraza narzędzia); Right side: „your head should not move to either side.”; Back of neck (sesja 2): „Press your hands against your head at the same time you press your head straight back against your hands.”, kr. 5 „Do not tip your head back.” (wszystkie trzy potwierdzone ponownie 02.11.2026) |
| umm-neck-iso | https://www.ummhealth.org/health-library/neck-exercises-neck-isometrics | UMass Memorial Health, treść WebMD Ignite; bez daty | 5 (WebMD Ignite bez daty — reguła koordynatora); i tak nie niezależne od HealthLink BC | „Relax your shoulders and keep your head level.” |
| kp-neck-ex | https://healthy.kaiserpermanente.org/health-wellness/health-encyclopedia/he.neck-exercises.ad1500 | Kaiser Permanente (placówka medyczna), autor „WebMD Ignite Staff”, „Clinical Review Board”; aktualne na 24.09.2026 | 4 (reguła koordynatora dla WebMD Ignite spełniona) — to samo źródło co HealthLink BC, nie drugie | sprawdzone 02.11.2026: „Neck side flexion (isometric)” — „your head should not move to either side”; „Neck extension (isometric)” — dłonie z tyłu głowy, „Do not tip your head back.”; brak „Relax your shoulders” / „keep your head level” przy izometrii |
| ironneck-harness | https://www.iron-neck.com/blogs/articles/neck-harness-workout | Iron Neck (producent sprzętu do treningu szyi), 27.04.2026, akt. 25.06.2026 | 4 wg wcześniejszej oceny (producent własnego rodzaju sprzętu, z datą); nie oceniane ponownie — nieużyte, nie wpływa na stan | Neck Harness Extension: „From neutral, permit only a small, controlled movement into extension.” — nieużyte |
| ironneck-head-harness | https://www.iron-neck.com/blogs/articles/head-harness-neck-training-guide | Iron Neck, 09.04.2026, akt. 30.07.2026 (ta sama organizacja co wyżej) | jw. | extension: „setup is identical to flexion, but the chain hangs behind your head”; flexion: „Sit on the edge of a bench or stand with a slight forward lean.” — opis fazy ekscentrycznej w sekcji extension niespójny (broda do klatki jak przy flexion); nieużyte |
| rdx-harness-rehab | https://blogs.rdxsports.com/?p=33591 | RDX Sports (producent sprzętu sportów walki), G. Murphy, 05.10.2023 | nieocenione ponownie (nieużyte); wątpliwe (c) — blog producenta, a tekst niemal identyczny ze sklepem DMoose | extension: „tilting your head slowly backward while keeping control” — sekcja zaczyna się zdaniem o flexion (błąd kopiowania); nieużyte |
| dmoose-thick-neck | https://www.dmoose.com/blogs/workout-training/how-to-get-a-thick-neck | DMoose (sklep/producent akcesoriów) | 5 (sprzedawca — blog marketingowy; reguła koordynatora) | „Begin the movement by slowly tilting your head backward, away from the resistance” — tekst prawie identyczny z RDX → **nie liczę jako niezależnego**; nieużyte |

Niezależność RelayHealth: treść oznaczona „Developed by RelayHealth”, „Copyright © 2016 RelayHealth, a division of McKesson Technologies Inc.” — inna firma niż Healthwise (WebMD Ignite).

Odrzucone/niedostępne: ExRx (403), web.archive.org (zablokowane), NMC Healthcare PDF (HTTP 530), CommonSpirit (strona bez treści),
WWL NHS „Neck and Upper Back Exercises Level 2” (s. 1–3 przeczytane — rozciąganie, nie izometria; dalszych stron nie czytano; wg wyszukiwarki „Extensions” to ruch czynny, nie izometria),
Infomed/sld.cu „isometric exercises for” (HTTP 503), Nova Scotia Health 0949 (program równowagi, nie szyja), Hawaii Pacific Health i Columbia (treść tego samego wydawcy co Healthwise/WebMD Ignite wg wyszukiwarki — niesprawdzone, nie liczone),
ACE „Neck Flexion and Extension” (https://www.acefitness.org/education-and-resources/lifestyle/exercise-library/204/neck-flexion-and-extension — przeczytane: rozciąganie na stojąco bez obciążenia, inne ćwiczenie),
Marquette University Athletics, karty „Neck Extension” 2006 (wg wyszukiwarki maszyna/opór ręczny — inne ćwiczenie; nieprzeczytane), elitefts (artykuł o uprzęży — HTTP 404),
NFL.com (artykuł trenera, ogólny, bez opisu techniki uprzęży — szczebel 5), serwisy konsumenckie, platformy ćwiczeń dla fizjoterapeutów i strony aplikacji z wyników wyszukiwania (zasada koordynatora — nie źródło, nie zapisane).

## Otwarte

1. **Pozycja wyjściowa głowy w izometrii** — sprzeczność: NHS CHT zaczyna od lekkiego pochylenia („Slightly tilt your head downwards”;
   przy boku „Slightly tilt your head to the left/right”), a HealthLink BC („keep your neck straight and look straight ahead”), NHS NCM („with your head in the neutral position”)
   i RelayHealth („Sit tall, eyes straight ahead, and chin level”) — głowa prosto. Kandydat (NIE w bloku): `neck.iso.neutral` „Głowa prosto, wzrok przed siebie.” / „Keep your head level and look straight ahead.” — do rozstrzygnięcia przez recenzenta/audytora,
   czy wariant CHT jest innym ćwiczeniem (izometria w lekkim skłonie), czy sprzecznością. Po korekcie szczebli: zależy też od decyzji o NHS i RelayHealth.
2. ~~Tył (Front And Back)~~ — zamknięte w sesji 2 (RelayHealth jako drugie źródło); **po korekcie znów otwarte** — RelayHealth do decyzji koordynatora linii.
3. **Siła docisku** — sprzeczność: HealthLink BC „not quite as hard as you can”, NCM „as hard as you are able” → nie do aplikacji (do tego wskazówka dawkowania na szyi).
4. **Czas przytrzymania i powtórzenia** (CHT 5–10 s; Healthwise ok. 6 s i 8–12 razy; UMM 10 s i 5 razy; NCM 10 s, 3×3; RelayHealth 5 s, 3×5) — liczby, różne → otwarte; w aplikacji czas ustawia użytkownik.
5. **Oddech** („nie wstrzymuj oddechu”) — w przeczytanych źródłach izometrii brak; tylko Iron Neck (uprząż, ogólnie) → otwarte.
6. **Ćwiczenia z talerzem i uprzężą** — po sesji 2 nadal brak dwóch rzetelnych przeczytanych źródeł szczebla 4 z różnych organizacji.
   - Talerz (leżąc przodem / tyłem): wszystkie trafienia wyszukiwarki to strony aplikacji, serwisy konsumenckie i media (odrzucone); ACE ma tylko rozciąganie.
   - Uprząż: Iron Neck + RDX Sports zgodni wyłącznie co do „powoli, pod kontrolą” (kandydat `neck.harness.slow` „Ruch powoli i pod kontrolą, bez szarpania.” — NIE w bloku: jedno zdanie nie tworzy karty,
     RDX ma błąd kopiowania w tej sekcji, a pozycja wyjściowa jest rozbieżna — Iron Neck: siad na brzegu ławki lub stanie z lekkim pochyleniem; RDX/DMoose: postawa wyprostowana).
   - Kandydaci na kolejną sesję: NSCA „Exercise Technique Manual for Resistance Training” (szczebel 3, książka — sprawdzić dostępność fragmentów), podręczniki S&C uczelni w PDF
     (zapytania typu „strength and conditioning manual” + „neck harness” / „plate neck”), instrukcje obsługi uprzęży innych producentów (Rogue, Spud Inc., Harbinger — nie znaleziono w sesji 2),
     materiały federacji (zapasy, rugby: programy wzmacniania szyi, np. World Rugby/RFU — tam zwykle izometria z partnerem/gumą, nie talerz).
   Do tego czasu bez karty.
7. **Ostrzeżenia zdrowotne** (zawroty głowy, ból — WWL „Stop if the exercise makes you feel dizzy or unwell”, Kaiser „Ease off the exercises if you start to have pain”, NCM s. 16 „If you feel unwell or the exercises cause significant pain, please stop and rest.”) —
   twierdzenia o zdrowiu; aplikacja nie daje porad medycznych. Ewentualny ogólny tekst „przy bólu — do specjalisty” to decyzja produktowa, nie wskazówka techniki.
8. **Szczebel materiałów dla pacjentów — DO DECYZJI KOORDYNATORA LINII** (zastępuje dawne pytanie o Healthwise/WebMD Ignite/RelayHealth): szczegóły i skutki w sekcji „Korekta szczebli 02.11.2026”.
9. **Położenie dłoni przy boku** — CHT „above your ear”, NCM „across your temple”, RelayHealth „at the side of your temple”; `neck.isoSide.hand` („nad uchem”) ma CHT + HealthLink BC. Bez zmiany; do wiadomości recenzenta.

## Korekta szczebli 02.11.2026

Podstawa: rozstrzygnięcie koordynatora linii 1.1 (02.11.2026): szczebel 4 wymaga naraz (a) organizacji szkolącej/certyfikującej trenerów, serwisu
z redakcją i recenzją ekspercką albo producenta własnego rodzaju sprzętu, (b) autora z datą albo treści jawnie firmowanej, (c) braku marketingu;
WebMD Ignite — 4 tylko materiał opublikowany przez placówkę medyczną, z datą; materiały szpitali dla pacjentów — ocenić (a), przy wątpliwości
„do decyzji koordynatora linii” i zachowawczo otwarte. Strony HealthLink BC, Kaiser Permanente i RelayHealth otwarte ponownie (WebFetch 02.11.2026).

| źródło | przed | po | powód |
|---|---|---|---|
| healthlinkbc-iso-head (Healthwise/WebMD Ignite) | 4 PROPOZYCJA | 4 | ta sama treść opublikowana przez Kaiser Permanente (placówka medyczna, „Current as of: September 24, 2026”, „Clinical Review Board”) — reguła koordynatora spełniona; HealthLink BC sama: usługa zdrowotna rządu prowincji, data 27.02.2023, recenzja 5 lekarzy z nazwiska. Liczy się jako **jedno** źródło razem z Kaiser i UMM. |
| kp-neck-ex | 4 (tylko dowód zależności) | 4 | jw.; potwierdza wydawcę i datę, nie jest drugim źródłem. |
| umm-neck-iso | 4 PROPOZYCJA | 5 | WebMD Ignite bez daty — reguła koordynatora; i tak zależne od HealthLink BC. |
| nhs-cht-neck | 4 | do decyzji (nie liczone) | (a) wątpliwe: ulotka działu fizjoterapii szpitala dla pacjentów, nie organizacja szkoląca trenerów; za uznaniem — firmowana przez trust, numer ulotki, wersja i data przeglądu (10/28), co wskazuje na kontrolę dokumentów; przeciw — strona nie opisuje recenzji eksperckiej, brak autora. (b) i (c) spełnione. |
| nhs-ncm-neck | 4 | do decyzji (nie liczone) | jw.; dodatkowo bez daty (firmowana przez trust, więc (b) formalnie spełnione). |
| relayhealth-stinger | 4 | do decyzji (nie liczone) | (a) wątpliwe: dostawca materiałów dla pacjentów (McKesson), bez autora i bez opisanej recenzji eksperckiej; opublikowane przez klinikę (Hattiesburg Clinic) z datą przeglądu 12.01.2015 i wersją 2016.4 — przez analogię do reguły WebMD Ignite mogłoby być 4, ale koordynator wymienił RelayHealth wśród organizacji do oceny; treść ma ponad 10 lat. |
| dmoose-thick-neck | 4 | 5 | sprzedawca — blog marketingowy (reguła koordynatora); nieużyte. |

Skutek dla ćwiczeń (zdania gotowe przed → po; „przy uznaniu” = co by się zmieniło):

| ćwiczenie | przed | po | przy uznaniu NHS (CHT + NCM) | przy uznaniu RelayHealth | przy obu |
|---|---|---|---|---|---|
| Isometric Neck Exercise - Sides | gotowe, 5 | otwarte, 0 | gotowe, 3 (`isoSide.hand`, `isoSide.press`, `iso.mis.headMoves`) | otwarte, 0 | gotowe, 3 |
| Isometric Neck Exercise - Front And Back | gotowe, 5 | otwarte, 0 | gotowe, 3 (`isoFront.hand`, `isoFront.press`, `iso.mis.headMoves`) | gotowe, 2 (`isoBack.hands`, `isoBack.press`) | gotowe, 5 |
| talerz ×2, uprząż | otwarte | otwarte | bez zmian | bez zmian | bez zmian |

`isoSide.sit` i `isoSide.shoulders` nie wracają w żadnym wariancie (drugie źródło to UMM bez daty; Kaiser nie ma tych zdań przy izometrii).

## Stan

Sesja 1 (02.11.2026): Sides gotowe (5 zdań); Front And Back — 2 zdania, karta wstrzymana.
Sesja 2 (02.11.2026): Front And Back odblokowane — drugie niezależne źródło tyłu (RelayHealth/McKesson), trzecie dla przodu (NHS NCM); nowe zdania `neck.isoBack.hands`, `neck.isoBack.press`.
Korekta szczebli (02.11.2026): **0 z 5 ćwiczeń gotowych** (było 2 z 5). Obie izometrie → otwarte do decyzji koordynatora linii o szczeblu ulotek NHS i RelayHealth
(skutki wariantów — tabela wyżej); wyniki zachowane jako „Kandydaci wstrzymani”. Talerz ×2 i uprząż — bez zmian, otwarte.
Nic nie wdrożone; teksty EN do przeglądu tłumacza, PL do recenzenta lokalizacji; wpisy w rejestrze twierdzeń (`scripts/claims.mjs --stub`) przy wdrożeniu.
Następny krok: (1) koordynator linii — decyzja o szczeblu ulotek NHS (CHT, NCM) i RelayHealth; (2) ćwiczenia z talerzem/uprzężą wg listy kandydatów w pkt 6.
