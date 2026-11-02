# Wskazówki techniki — fala W1, rodzina `neck` (szyja)

Data: 02.11.2026. Autor: badacz merytoryczny (agent; dwie sesje tego samego dnia + korekta szczebli + uzupełnienie 2). Zakres: tylko zbieranie danych (polecenie właściciela 02.11.2026) — nic nie trafia
do `lib/` ani `data/zrodla/` bez akceptacji i wdrożenia przez programistę. Metoda: `docs/research/27-wskazowki-zrodla.md`, `docs/research/33-wskazowki-partia2.md`
(≥ 2 przeczytane źródła z różnych organizacji na zdanie; wariant liczy się z opisem, inne ćwiczenie = analogia; bez twierdzeń medycznych;
cytat ≤ 1 zdanie). Szyja = obszar wrażliwy: czasy przytrzymania, obciążenia, „nie do bólu”, przeciwwskazania — tylko wg pełnych zasad (szczebel 1–2
albo kilka niezależnych 2–3); żadne z nich nie jest tu proponowane.
Szczeble źródeł poprawione 02.11.2026 wg rozstrzygnięcia koordynatora linii 1.1 — sekcje „Korekta szczebli 02.11.2026” i „Korekta szczebli — uzupełnienie 2 (02.11.2026)” na końcu.

## Tabela ćwiczeń

| Ćwiczenie (klucz katalogu) | Stan | Uwagi |
|---|---|---|
| Isometric Neck Exercise - Sides | **gotowe, 3 zdania** (uzupełnienie 2; po pierwszej korekcie: otwarte) | NHS CHT i NHS NCM = szczebel 4 (szpital/system ochrony zdrowia); Healthwise/WebMD Ignite (HealthLink BC = Kaiser = UMM) liczone jako jedno źródło |
| Isometric Neck Exercise - Front And Back | **gotowe, 3 zdania (przód)** (uzupełnienie 2) | tył (`isoBack.*`) nadal wstrzymany: RelayHealth → 5 (treść firmowana przez dostawcę IT, nie przez placówkę) |
| Lying Neck Extension (talerz) | **otwarte** | sesja 2: nadal brak przeczytanego źródła szczebla 4 z organizacji; wyniki wyszukiwania to wyłącznie serwisy konsumenckie i strony aplikacji (odrzucone) |
| Lying Neck Flexion (talerz) | **otwarte** | jak wyżej |
| Neck Harness Extension | **otwarte** | sesja 2: dwaj producenci (Iron Neck; RDX Sports) zgodni tylko co do „powoli, pod kontrolą”; pozycja ciała rozbieżna, tekst RDX ma błąd kopiowania i prawie identyczny tekst sklepu DMoose (zależność) — zbyt słabe na kartę |

## Blok do wklejenia (`data/zrodla/cues.json`, gałąź `exercises`)

Tylko gotowe (po uzupełnieniu 2):

```json
{
  "Isometric Neck Exercise - Sides": {
    "setup": [
      {"c": "neck.isoSide.hand", "s": [["nhs-cht-neck", "s. 2, Isometric side flexion, krok 2"], ["healthlinkbc-iso-head", "Right side of neck, krok 1"]]}
    ],
    "move": [
      {"c": "neck.isoSide.press", "s": [["nhs-cht-neck", "s. 2, Isometric side flexion, krok 2"], ["healthlinkbc-iso-head", "wstęp + Right side of neck, kroki 2–3"], ["nhs-ncm-neck", "s. 15, Cervical Spine Side Flexion Isometric, zdanie 3"]]}
    ],
    "mistakes": [
      {"c": "neck.iso.mis.headMoves", "s": [["healthlinkbc-iso-head", "Right side of neck, krok 3"], ["nhs-cht-neck", "s. 2, Isometric side flexion, krok 2 (błąd = zaprzeczenie standardu: dłoń stawia opór ruchowi)"]]}
    ]
  },
  "Isometric Neck Exercise - Front And Back": {
    "setup": [
      {"c": "neck.isoFront.hand", "s": [["nhs-cht-neck", "s. 2, Isometric flexion, krok 2"], ["healthlinkbc-iso-head", "Front of neck, krok 1"], ["nhs-ncm-neck", "s. 14, Cervical Spine Flexion Isometric, zdanie 2"]]}
    ],
    "move": [
      {"c": "neck.isoFront.press", "s": [["nhs-cht-neck", "s. 2, Isometric flexion, krok 2"], ["nhs-ncm-neck", "s. 14, Cervical Spine Flexion Isometric, zdanie 3"]]}
    ],
    "mistakes": [
      {"c": "neck.iso.mis.headMoves", "s": [["healthlinkbc-iso-head", "Back of neck and upper back, krok 5"], ["nhs-ncm-neck", "s. 14, zdanie 3 (wariant: przód; błąd = zaprzeczenie standardu: opór dłoni wobec każdego ruchu głowy)"]]}
    ]
  }
}
```

### Kandydaci wstrzymani (NIE do `exercises`)

Oznaczenia: [WI] = Healthwise/WebMD Ignite (liczone, szczebel 4; HealthLink BC = Kaiser = UMM — jedno źródło), [NHS] = ulotka szpitala NHS (szczebel 4 od uzupełnienia 2),
[RH] = RelayHealth (szczebel 5 od uzupełnienia 2), [UMM] = WebMD Ignite u UMass (ta sama treść co [WI] — nie liczy się osobno).

```json
{
  "Isometric Neck Exercise - Sides": {
    "setup": [
      {"c": "neck.isoSide.sit", "s": [["nhs-cht-neck", "s. 2, Isometric side flexion, krok 1"], ["umm-neck-iso", "wstęp: pozycja wyjściowa"]]}
    ],
    "tips": [
      {"c": "neck.isoSide.shoulders", "s": [["nhs-cht-neck", "s. 2, Isometric side flexion, krok 1"], ["umm-neck-iso", "wstęp: pozycja wyjściowa"]]}
    ]
  },
  "Isometric Neck Exercise - Front And Back": {
    "setup": [
      {"c": "neck.isoBack.hands", "s": [["healthlinkbc-iso-head", "Back of neck and upper back, kroki 1–2"], ["relayhealth-stinger", "Extension, krok 1"]]}
    ],
    "move": [
      {"c": "neck.isoBack.press", "s": [["healthlinkbc-iso-head", "Back of neck and upper back, krok 3"], ["relayhealth-stinger", "Extension, krok 2"]]}
    ]
  }
}
```

| zdanie | źródła (po uzupełnieniu 2) | stan |
|---|---|---|
| neck.isoSide.sit | [NHS] CHT + [UMM] | wstrzymane — UMM to ta sama treść co [WI], a [WI] (HealthLink BC/Kaiser) tego zdania przy izometrii nie ma; jedno źródło |
| neck.isoSide.hand | [NHS] CHT + [WI] | gotowe |
| neck.isoSide.press | [NHS] CHT + [WI] + [NHS] NCM | gotowe |
| neck.isoSide.shoulders | [NHS] CHT + [UMM] | wstrzymane — jw. (Kaiser ma „relax your shoulders” tylko przy rozciąganiu) |
| neck.iso.mis.headMoves (bok) | [WI] + [NHS] CHT | gotowe (CHT: błąd = zaprzeczenie standardu) |
| neck.isoFront.hand | [NHS] CHT + [WI] + [NHS] NCM | gotowe — w wersji skróconej (niżej) |
| neck.isoFront.press | [NHS] CHT + [NHS] NCM | gotowe — dwa różne trusty NHS (osobne organizacje i działy fizjoterapii, różne dokumenty) |
| neck.isoBack.hands | [WI] + [RH] | wstrzymane — RelayHealth = 5 |
| neck.isoBack.press | [WI] + [RH] | wstrzymane — RelayHealth = 5 |
| neck.iso.mis.headMoves (przód/tył) | [WI] + [NHS] NCM | gotowe (NCM: błąd = zaprzeczenie standardu) |

Uwagi do „Front And Back”:
- `neck.isoFront.hand` — NCM: „across your forehead” (dłoń), CHT: dłoń na czole, HealthLink BC: dłoń lub nasady obu dłoni; „albo nasady obu dłoni” ma tylko HealthLink BC → w bloku gotowym
  **wersja skrócona** „Połóż dłoń na czole.” / „Place your hand on your forehead.” (CHT + NCM + HealthLink BC).
- `neck.isoFront.press` — „dłonią trzymaj opór — głowa zostaje w miejscu”: CHT („use your hand to resist the movement”) i NCM („firmly resisting any movement of your head with your hand”).
- Karta „Front And Back” ma dziś tylko przód; tył wraca, gdy znajdzie się drugie źródło szczebla 4 obok HealthLink BC (otwarte pkt 2). Do decyzji programisty/koordynatora:
  wyświetlić kartę z samym przodem czy czekać na tył (nazwa ćwiczenia obejmuje oba kierunki).
- NCM: „as hard as you are able” — sprzeczne z HealthLink BC („not quite as hard as you can”) → siła docisku zostaje otwarta (pkt 3).

## Nowe zdania

Istniejące zdania z `lib/cues/text/pl.json` przejrzane (m.in. `crunch.neck`, `wall.breath`, `st.breathe`, `llc.control`) — żadne nie ma
przeczytanych źródeł dla tych ćwiczeń, więc nie są używane (zasada koordynatora: bez zdań ogólnych niepotwierdzonych dla ćwiczenia).

| id | PL | EN | stan |
|---|---|---|---|
| neck.isoSide.sit | Usiądź prosto na krześle, stopy płasko na podłodze. | Sit up tall on a chair with your feet flat on the floor. | wstrzymane |
| neck.isoSide.hand | Połóż dłoń z boku głowy, nad uchem. | Place your hand on the side of your head, just above your ear. | gotowe |
| neck.isoSide.press | Dociskaj głowę w bok do dłoni, a dłonią trzymaj opór — głowa zostaje w miejscu. | Press your head sideways into your hand while your hand pushes back — your head stays put. | gotowe |
| neck.isoSide.shoulders | Barki luźno, nie podciągaj ich. | Keep your shoulders relaxed. | wstrzymane |
| neck.iso.mis.headMoves | Głowa przechyla się, zamiast stać w miejscu. | Letting your head tip instead of holding it still. | gotowe |
| neck.isoFront.hand | Połóż dłoń na czole. | Place your hand on your forehead. | gotowe (skrócone w uzupełnieniu 2; było: „Połóż dłoń (albo nasady obu dłoni) na czole.”) |
| neck.isoFront.press | Dociskaj czoło do dłoni, a dłonią trzymaj opór — głowa zostaje w miejscu. | Push your forehead into your hand while your hand pushes back — your head stays put. | gotowe |
| neck.isoBack.hands | Spleć dłonie i połóż je z tyłu głowy. | Clasp your hands and place them on the back of your head. | wstrzymane |
| neck.isoBack.press | Dociskaj tył głowy do splecionych dłoni. | Press the back of your head into your clasped hands. | wstrzymane |

## Źródła

| id | Adres | Organizacja | Szczebel (po uzupełnieniu 2) | Miejsce i cytat (≤ 1 zdanie) |
|---|---|---|---|---|
| nhs-cht-neck | https://plr.cht.nhs.uk/download/1077/Neck%20Strength%20and%20stability%20Exercises%20A4 | Calderdale and Huddersfield NHS Foundation Trust, fizjoterapia (ulotka csph0153 v2, przegląd 10/28) | **4** (uzupełnienie 2: szpital, jawnie firmowane) | s. 2 „Isometric side flexion” kr. 2: „Place your hand above your ear (which is closest to your shoulder) and push your head side ways into your hand.”; kr. 1: „Keep your shoulders relaxed throughout”; „Isometric flexion” kr. 2: „Place your hand on your forehead and push your head into your hand, use your hand to resist the movement.” |
| nhs-ncm-neck | https://northcheshireandmersey.nhs.uk/media/cq5b2ddw/neck-strengthening-exercises-patient-advice-sheet.pdf | North Cheshire and Mersey NHS Foundation Trust, Musculoskeletal Physiotherapy OCATS („Neck Strengthening Exercises”, 16 s.; bez daty) | **4** (uzupełnienie 2: szpital, jawnie firmowane; data niewymagana) — inna organizacja niż CHT | s. 14 „Cervical Spine Flexion Isometric Exercise”: „Push your head and neck forward as hard as you are able while firmly resisting any movement of your head with your hand”; s. 15 (side flexion): „Place your hand across your temple.” |
| relayhealth-stinger | https://iris.hattiesburgclinic.com/patadv/aha/aha_stinger_rex.htm | RelayHealth (McKesson), „Adult Advisor 2016.4”, na domenie Hattiesburg Clinic | **5** (uzupełnienie 2) | Extension: „Clasp your hands together and place them behind your head.”; „Press the back of your head into your palms.” — strona sprawdzona ponownie 02.11.2026: w tekście tylko „Developed by RelayHealth” i copyright McKesson Technologies, brak nazwy placówki |
| healthlinkbc-iso-head | https://www.healthlinkbc.ca/healthwise/isometric-exercise-hands-head | HealthLink BC (usługa zdrowotna rządu Kolumbii Brytyjskiej), treść Healthwise (WebMD Ignite); recenzja 5 lekarzy; aktualne na 27.02.2023 | 4 — razem z Kaiser i UMM **jedno** źródło (ta sama licencjonowana treść) | Right side: „your head should not move to either side.”; Back of neck: „Press your hands against your head at the same time you press your head straight back against your hands.”, kr. 5 „Do not tip your head back.” |
| umm-neck-iso | https://www.ummhealth.org/health-library/neck-exercises-neck-isometrics | UMass Memorial Health, treść WebMD Ignite; bez daty | 4 jako placówka (uzupełnienie 2), ale ta sama licencjonowana treść co HealthLink BC → **nie drugie źródło** | „Relax your shoulders and keep your head level.” |
| kp-neck-ex | https://healthy.kaiserpermanente.org/health-wellness/health-encyclopedia/he.neck-exercises.ad1500 | Kaiser Permanente, „WebMD Ignite Staff”, „Clinical Review Board”; aktualne na 24.09.2026 | 4 — to samo źródło co HealthLink BC, nie drugie | „Neck side flexion (isometric)” — „your head should not move to either side”; „Neck extension (isometric)” — „Do not tip your head back.”; brak „Relax your shoulders” / „keep your head level” przy izometrii |
| ironneck-harness | https://www.iron-neck.com/blogs/articles/neck-harness-workout | Iron Neck (producent sprzętu do treningu szyi), 27.04.2026, akt. 25.06.2026 | 4 (producent własnego rodzaju sprzętu, z datą); nieużyte | Neck Harness Extension: „From neutral, permit only a small, controlled movement into extension.” |
| ironneck-head-harness | https://www.iron-neck.com/blogs/articles/head-harness-neck-training-guide | Iron Neck, 09.04.2026, akt. 30.07.2026 (ta sama organizacja co wyżej) | jw. | flexion: „Sit on the edge of a bench or stand with a slight forward lean.” — opis fazy ekscentrycznej w sekcji extension niespójny; nieużyte |
| rdx-harness-rehab | https://blogs.rdxsports.com/?p=33591 | RDX Sports, G. Murphy, 05.10.2023 | nieocenione ponownie (nieużyte); wątpliwe — tekst niemal identyczny ze sklepem DMoose | extension: „tilting your head slowly backward while keeping control” — sekcja zaczyna się zdaniem o flexion (błąd kopiowania) |
| dmoose-thick-neck | https://www.dmoose.com/blogs/workout-training/how-to-get-a-thick-neck | DMoose (sklep) | 5 | tekst prawie identyczny z RDX → nie niezależny; nieużyte |

Odrzucone/niedostępne: ExRx (403), web.archive.org (zablokowane), NMC Healthcare PDF (HTTP 530), CommonSpirit (strona bez treści),
WWL NHS „Neck and Upper Back Exercises Level 2” (s. 1–3 przeczytane — rozciąganie, nie izometria; dalszych stron nie czytano),
Infomed/sld.cu (HTTP 503), Nova Scotia Health 0949 (program równowagi, nie szyja), Hawaii Pacific Health i Columbia (treść Healthwise/WebMD Ignite wg wyszukiwarki — niesprawdzone; i tak to samo źródło co HealthLink BC),
ACE „Neck Flexion and Extension” (przeczytane: rozciąganie na stojąco bez obciążenia, inne ćwiczenie),
Marquette University Athletics „Neck Extension” 2006 (nieprzeczytane; wg uzupełnienia 2 uczelniane centrum sportu bez autora = 5), elitefts (HTTP 404),
NFL.com (artykuł trenera, ogólny — szczebel 5), serwisy konsumenckie, platformy ćwiczeń dla fizjoterapeutów i strony aplikacji (nie źródło).

## Otwarte

1. **Pozycja wyjściowa głowy w izometrii** — sprzeczność: NHS CHT zaczyna od lekkiego pochylenia („Slightly tilt your head downwards”), a HealthLink BC („keep your neck straight and look straight ahead”) i NHS NCM („with your head in the neutral position”) — głowa prosto. Kandydat (NIE w bloku): `neck.iso.neutral` „Głowa prosto, wzrok przed siebie.” / „Keep your head level and look straight ahead.” — po uzupełnieniu 2 ma 2 źródła szczebla 4 (HealthLink BC + NCM), ale CHT (też 4) przeczy → wg zasady wyjątku dla przedziałów/wskazówek („żadne przeczytane nie przeczy”) do rozstrzygnięcia przez recenzenta: wariant CHT to inne ćwiczenie (izometria w lekkim skłonie) czy sprzeczność.
2. **Tył (Front And Back)** — po uzupełnieniu 2 tylko HealthLink BC (4) + RelayHealth (5) → otwarte; potrzebne drugie źródło szczebla 4 (np. inny szpital/NHS z izometrią w wyproście).
3. **Siła docisku** — sprzeczność: HealthLink BC „not quite as hard as you can”, NCM „as hard as you are able” → nie do aplikacji.
4. **Czas przytrzymania i powtórzenia** (CHT 5–10 s; Healthwise ok. 6 s i 8–12 razy; UMM 10 s i 5 razy; NCM 10 s, 3×3; RelayHealth 5 s, 3×5) — liczby, różne → otwarte; w aplikacji czas ustawia użytkownik.
5. **Oddech** („nie wstrzymuj oddechu”) — w przeczytanych źródłach izometrii brak; tylko Iron Neck (uprząż, ogólnie) → otwarte.
6. **Ćwiczenia z talerzem i uprzężą** — brak dwóch rzetelnych przeczytanych źródeł szczebla 4 z różnych organizacji.
   - Talerz: wszystkie trafienia wyszukiwarki to strony aplikacji, serwisy konsumenckie i media; ACE ma tylko rozciąganie.
   - Uprząż: Iron Neck + RDX Sports zgodni wyłącznie co do „powoli, pod kontrolą” (kandydat `neck.harness.slow` — NIE w bloku: jedno zdanie nie tworzy karty, RDX ma błąd kopiowania, pozycja wyjściowa rozbieżna).
   - Kandydaci na kolejną sesję: NSCA „Exercise Technique Manual for Resistance Training” (szczebel 3), podręczniki S&C uczelni z autorem (warunkowo 4), instrukcje obsługi uprzęży innych producentów, materiały federacji (zapasy, rugby).
7. **Ostrzeżenia zdrowotne** (zawroty głowy, ból — WWL, Kaiser, NCM s. 16) — twierdzenia o zdrowiu; aplikacja nie daje porad medycznych. Ewentualny ogólny tekst „przy bólu — do specjalisty” to decyzja produktowa.
8. ~~Szczebel materiałów dla pacjentów~~ — rozstrzygnięte uzupełnieniem 2 (02.11.2026): NHS = 4, RelayHealth = 5.
9. **Położenie dłoni przy boku** — CHT „above your ear”, NCM „across your temple”, RelayHealth „at the side of your temple”; `neck.isoSide.hand` („nad uchem”) ma CHT + HealthLink BC. Do wiadomości recenzenta.
10. **Dwa trusty NHS jako dwa źródła** (`neck.isoFront.press`: CHT + NCM) — liczone jako różne organizacje (osobne fundacje NHS, osobne działy fizjoterapii, różne dokumenty i sformułowania). Jeśli koordynator uzna NHS za jedną organizację, `isoFront.press` spada (zostaje jedno źródło), a karta przodu ma 2 zdania (`isoFront.hand` z HealthLink BC, `iso.mis.headMoves`) — nadal gotowa.

## Korekta szczebli 02.11.2026

Podstawa: rozstrzygnięcie koordynatora linii 1.1 (02.11.2026): szczebel 4 wymaga naraz (a) organizacji szkolącej/certyfikującej trenerów, serwisu
z redakcją i recenzją ekspercką albo producenta własnego rodzaju sprzętu, (b) autora z datą albo treści jawnie firmowanej, (c) braku marketingu;
WebMD Ignite — 4 tylko materiał opublikowany przez placówkę medyczną, z datą; materiały szpitali dla pacjentów — ocenić (a), przy wątpliwości
„do decyzji koordynatora linii” i zachowawczo otwarte. Strony HealthLink BC, Kaiser Permanente i RelayHealth otwarte ponownie (WebFetch 02.11.2026).

| źródło | przed | po | powód |
|---|---|---|---|
| healthlinkbc-iso-head (Healthwise/WebMD Ignite) | 4 PROPOZYCJA | 4 | ta sama treść opublikowana przez Kaiser Permanente (placówka medyczna, „Current as of: September 24, 2026”, „Clinical Review Board”); liczy się jako **jedno** źródło razem z Kaiser i UMM. |
| kp-neck-ex | 4 (tylko dowód zależności) | 4 | jw.; nie jest drugim źródłem. |
| umm-neck-iso | 4 PROPOZYCJA | 5 | WebMD Ignite bez daty; i tak zależne od HealthLink BC. |
| nhs-cht-neck | 4 | do decyzji (nie liczone) | (a) wątpliwe: ulotka działu fizjoterapii szpitala, nie organizacja szkoląca trenerów. |
| nhs-ncm-neck | 4 | do decyzji (nie liczone) | jw.; bez daty. |
| relayhealth-stinger | 4 | do decyzji (nie liczone) | (a) wątpliwe: dostawca materiałów dla pacjentów (McKesson), bez autora; treść ponad 10 lat. |
| dmoose-thick-neck | 4 | 5 | sprzedawca — blog marketingowy. |

Skutek wtedy: Sides gotowe 5 → otwarte 0; Front And Back gotowe 5 → otwarte 0.

## Korekta szczebli — uzupełnienie 2 (02.11.2026)

Podstawa: uzupełnienie 2 rozstrzygnięcia koordynatora linii 1.1 (02.11.2026): szpitale/systemy ochrony zdrowia, organizacje zdrowia publicznego i pacjentów → szczebel 4
(precedens HSS; jawne firmowanie wystarcza, data niewymagana); ta sama licencjonowana treść u kilku placówek = jedno źródło; reguła błędu „błąd = zaprzeczenie standardu”.

| źródło | przed (korekta 1) | po (uzupełnienie 2) | powód |
|---|---|---|---|
| nhs-cht-neck | do decyzji (nie liczone) | **4** | szpital NHS (Foundation Trust), ulotka jawnie firmowana przez trust. |
| nhs-ncm-neck | do decyzji (nie liczone) | **4** | jw.; brak daty nie przeszkadza (data niewymagana). Inna organizacja niż CHT (pkt 10 otwartych). |
| relayhealth-stinger | do decyzji (nie liczone) | **5** | WebFetch 02.11.2026: tekst strony firmowany wyłącznie przez RelayHealth/McKesson Technologies (firma IT/dystrybutor treści), nazwy Hattiesburg Clinic brak — sama domena placówki to nie jawne firmowanie (nagłówek/stopka to obrazy, ich treści nie dało się odczytać; jeśli zawierają logo kliniki, ocena do zmiany na 4). |
| umm-neck-iso | 5 | 4 jako placówka, ale nadal **nie drugie źródło** (licencjonowana treść Healthwise/WebMD Ignite = to samo źródło co HealthLink BC/Kaiser) | data niewymagana; reguła „ta sama treść licencjonowana = jedno źródło”. |
| healthlinkbc-iso-head, kp-neck-ex | 4 | 4 | bez zmian; jedno źródło. |
| ironneck-*, dmoose | bez zmian | bez zmian | nie dotyczy uzupełnienia 2. |

Skutek dla ćwiczeń:

| ćwiczenie | przed (korekta 1) | po (uzupełnienie 2) | zdania |
|---|---|---|---|
| Isometric Neck Exercise - Sides | otwarte, 0 | **gotowe, 3** | `isoSide.hand`, `isoSide.press`, `iso.mis.headMoves` (błąd = zaprzeczenie standardu u CHT); `isoSide.sit`, `isoSide.shoulders` — wstrzymane (drugie źródło to UMM = ta sama treść co [WI]) |
| Isometric Neck Exercise - Front And Back | otwarte, 0 | **gotowe, 3 (tylko przód)** | `isoFront.hand` (skrócone), `isoFront.press`, `iso.mis.headMoves` (błąd = zaprzeczenie standardu u NCM); `isoBack.*` — wstrzymane (RelayHealth = 5) |
| talerz ×2, uprząż | otwarte | otwarte | bez zmian |

## Stan

Sesja 1 (02.11.2026): Sides gotowe (5 zdań); Front And Back — 2 zdania, karta wstrzymana.
Sesja 2 (02.11.2026): Front And Back odblokowane (RelayHealth, NHS NCM).
Korekta szczebli (02.11.2026): 0 z 5 gotowych (było 2 z 5).
Uzupełnienie 2 (02.11.2026): **2 z 5 ćwiczeń gotowych** — Sides (3 zdania), Front And Back (3 zdania, tylko przód; tył wstrzymany — RelayHealth = 5). Talerz ×2 i uprząż — otwarte.
Nic nie wdrożone; teksty EN do przeglądu tłumacza, PL do recenzenta lokalizacji; wpisy w rejestrze twierdzeń (`scripts/claims.mjs --stub`) przy wdrożeniu.
Następny krok: (1) koordynator linii — potwierdzić pkt 10 (dwa trusty NHS = dwie organizacje) i czy karta „Front And Back” może wyjść z samym przodem; (2) drugie źródło szczebla 4 dla tyłu; (3) talerz/uprząż wg pkt 6.
