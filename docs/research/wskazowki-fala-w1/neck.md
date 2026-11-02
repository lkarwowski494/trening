# Wskazówki techniki — fala W1, rodzina `neck` (szyja)

Data: 02.11.2026. Autor: badacz merytoryczny (agent). Zakres: tylko zbieranie danych (polecenie właściciela 02.11.2026) — nic nie trafia
do `lib/` ani `data/zrodla/` bez akceptacji i wdrożenia przez programistę. Metoda: `docs/research/27-wskazowki-zrodla.md`, `docs/research/33-wskazowki-partia2.md`
(≥ 2 przeczytane źródła z różnych organizacji na zdanie; wariant liczy się z opisem, inne ćwiczenie = analogia; bez twierdzeń medycznych;
cytat ≤ 1 zdanie). Szyja = obszar wrażliwy: czasy przytrzymania, obciążenia, „nie do bólu”, przeciwwskazania — tylko wg pełnych zasad (szczebel 1–2
albo kilka niezależnych 2–3); żadne z nich nie jest tu proponowane.

## Tabela ćwiczeń

| Ćwiczenie (klucz katalogu) | Stan | Uwagi |
|---|---|---|
| Isometric Neck Exercise - Sides | **gotowe** (5 zdań: 2 setup, 1 move, 1 tips, 1 mistakes) | NHS CHT + HealthLink BC/Healthwise (+ UMM/WebMD Ignite tam, gdzie zastępuje jedno z nich) |
| Isometric Neck Exercise - Front And Back | **otwarte** (rekomendacja) | przód (dłoń na czole, docisk) ma 2 źródła; tył (dłonie z tyłu głowy) — tylko jedna grupa wydawnicza (Healthwise = WebMD Ignite). Karta tylko z połową ćwiczenia byłaby niepełna — gotowe zdania niżej, wdrożenie po potwierdzeniu tyłu |
| Lying Neck Extension (talerz) | **otwarte** | brak przeczytanego źródła szczebla 4 z organizacji (ExRx 403; wyniki wyszukiwania to serwisy konsumenckie i strony aplikacji — odrzucone) |
| Lying Neck Flexion (talerz) | **otwarte** | jak wyżej |
| Neck Harness Extension | **otwarte** | jedno źródło producenta (Iron Neck, wersja stojąca); drugiej organizacji brak |

## Blok do wklejenia (`data/zrodla/cues.json`, gałąź `exercises`)

```json
{
  "Isometric Neck Exercise - Sides": {
    "setup": [
      {"c": "neck.isoSide.sit", "s": [["nhs-cht-neck", "s. 2, Isometric side flexion, krok 1"], ["umm-neck-iso", "wstęp: pozycja wyjściowa"]]},
      {"c": "neck.isoSide.hand", "s": [["nhs-cht-neck", "s. 2, Isometric side flexion, krok 2"], ["healthlinkbc-iso-head", "Right side of neck, krok 1"]]}
    ],
    "move": [
      {"c": "neck.isoSide.press", "s": [["nhs-cht-neck", "s. 2, Isometric side flexion, krok 2"], ["healthlinkbc-iso-head", "wstęp + Right side of neck, kroki 2–3"]]}
    ],
    "tips": [
      {"c": "neck.isoSide.shoulders", "s": [["nhs-cht-neck", "s. 2, Isometric side flexion, krok 1"], ["umm-neck-iso", "wstęp: pozycja wyjściowa"]]}
    ],
    "mistakes": [
      {"c": "neck.iso.mis.headMoves", "s": [["healthlinkbc-iso-head", "Right side of neck, krok 3"], ["nhs-cht-neck", "s. 2, Isometric side flexion, krok 2 (parafraza: dłoń stawia opór ruchowi)"]]}
    ]
  }
}
```

Zdania gotowe dla „Front And Back” (NIE wklejać, dopóki tył nie ma drugiego źródła):

```json
{
  "Isometric Neck Exercise - Front And Back": {
    "setup": [
      {"c": "neck.isoFront.hand", "s": [["nhs-cht-neck", "s. 2, Isometric flexion, krok 2"], ["healthlinkbc-iso-head", "Front of neck, krok 1"]]}
    ],
    "move": [
      {"c": "neck.isoFront.press", "s": [["nhs-cht-neck", "s. 2, Isometric flexion, krok 2"], ["healthlinkbc-iso-head", "Front of neck, krok 2"]]}
    ]
  }
}
```

## Nowe zdania

Istniejące zdania z `lib/cues/text/pl.json` przejrzane (m.in. `crunch.neck`, `wall.breath`, `st.breathe`, `llc.control`) — żadne nie ma
przeczytanych źródeł dla tych ćwiczeń, więc nie są używane (zasada koordynatora: bez zdań ogólnych niepotwierdzonych dla ćwiczenia).

| id | PL | EN |
|---|---|---|
| neck.isoSide.sit | Usiądź prosto na krześle, stopy płasko na podłodze. | Sit up tall on a chair with your feet flat on the floor. |
| neck.isoSide.hand | Połóż dłoń z boku głowy, nad uchem. | Place your hand on the side of your head, just above your ear. |
| neck.isoSide.press | Dociskaj głowę w bok do dłoni, a dłonią trzymaj opór — głowa zostaje w miejscu. | Press your head sideways into your hand while your hand pushes back — your head stays put. |
| neck.isoSide.shoulders | Barki luźno, nie podciągaj ich. | Keep your shoulders relaxed. |
| neck.iso.mis.headMoves | Głowa przechyla się, zamiast stać w miejscu. | Letting your head tip instead of holding it still. |
| neck.isoFront.hand | Połóż dłoń (albo nasady obu dłoni) na czole. | Place your hand — or the heels of both hands — on your forehead. |
| neck.isoFront.press | Dociskaj czoło do dłoni, a dłonią trzymaj opór — głowa zostaje w miejscu. | Push your forehead into your hand while your hand pushes back — your head stays put. |

Uwaga do `neck.isoSide.shoulders`: „nie podciągaj ich” to doprecyzowanie „relaxed”; jeśli recenzent uzna je za wykraczające poza źródła — samo „Barki luźno.”

## Źródła

| id | Adres | Organizacja | Szczebel | Miejsce i cytat (≤ 1 zdanie) |
|---|---|---|---|---|
| nhs-cht-neck | https://plr.cht.nhs.uk/download/1077/Neck%20Strength%20and%20stability%20Exercises%20A4 | Calderdale and Huddersfield NHS Foundation Trust, fizjoterapia (ulotka csph0153 v2, przegląd 10/28) | 4 (szpital) | s. 2 „Isometric side flexion” kr. 2: „Place your hand above your ear (which is closest to your shoulder) and push your head side ways into your hand.”; kr. 1: „Keep your shoulders relaxed throughout”; „Isometric flexion” kr. 2: „Place your hand on your forehead and push your head into your hand, use your hand to resist the movement.” |
| healthlinkbc-iso-head | https://www.healthlinkbc.ca/healthwise/isometric-exercise-hands-head | HealthLink BC (rząd prowincji Kolumbia Brytyjska), treść Healthwise, przegląd lekarski; aktualne na 27.02.2023 | 4 (materiał dla pacjentów, PROPOZYCJA jak WebMD Ignite w docs/33) | wstęp: „Isometric means you push against resistance without moving your head.” (parafraza narzędzia); Right side: „your head should not move to either side.” |
| umm-neck-iso | https://www.ummhealth.org/health-library/neck-exercises-neck-isometrics | UMass Memorial Health, treść WebMD Ignite; bez daty | 4 (PROPOZYCJA, szczebel WebMD Ignite otwarty — docs/33 pyt. 2) | „Relax your shoulders and keep your head level.” |
| kp-neck-ex | https://healthy.kaiserpermanente.org/health-wellness/health-encyclopedia/he.neck-exercises.ad1500 | Kaiser Permanente, autor „WebMD Ignite Staff”, aktualne na 24.09.2026 | 4 | tylko dowód zależności: ten sam tekst co HealthLink BC, podpisany przez WebMD Ignite → Healthwise i UMM **nie są niezależne**; nie liczę ich jako dwóch źródeł |
| ironneck-harness | https://www.iron-neck.com/blogs/articles/neck-harness-workout | Iron Neck (producent sprzętu do treningu szyi), 27.04.2026, akt. 25.06.2026 | 4 (producent) | Neck Harness Extension: „From neutral, permit only a small, controlled movement into extension.” — jedno źródło, nieużyte |

Odrzucone/niedostępne: ExRx (403), web.archive.org (zablokowane), NMC Healthcare PDF (HTTP 530), CommonSpirit (strona bez treści),
WWL NHS „Neck and Upper Back Exercises Level 2” (s. 1–3 przeczytane — rozciąganie, nie izometria; dalszych stron nie czytano),
NFL.com (artykuł trenera, ogólny, bez opisu techniki uprzęży — szczebel 5), serwisy konsumenckie i strony aplikacji z wyników wyszukiwania (zasada koordynatora — nie źródło, nie zapisane).

## Otwarte

1. **Pozycja wyjściowa głowy w izometrii** — sprzeczność na tym samym szczeblu: NHS CHT zaczyna od lekkiego pochylenia („Slightly tilt your head downwards”;
   przy boku „Slightly tilt your head to the left/right”), HealthLink BC — szyja prosto, wzrok przed siebie („Do not tip your head forward”).
   Część wspólna: głowa nie rusza się w trakcie docisku (to jest w `neck.isoSide.press`). Zdania o pozycji wyjściowej nie proponuję.
2. **Tył (Front And Back)** — „splecione dłonie z tyłu głowy, dociskaj głowę do tyłu, nie odchylaj jej”: HealthLink BC/Healthwise i UMM/WebMD Ignite = jeden wydawca.
   Potrzebne drugie niezależne źródło (np. inna ulotka fizjoterapii szpitalnej z wersją „extension”).
3. **Siła docisku** („mocno, ale nie maksymalnie”) — tylko Healthwise; jedno źródło, a do tego wskazówka dawkowania na szyi → nie do aplikacji.
4. **Czas przytrzymania i powtórzenia** (CHT 5–10 s, Healthwise ok. 6 s i 8–12 razy, UMM 10 s i 5 razy) — liczby, źródła szczebla 4, różne → otwarte; w aplikacji czas ustawia użytkownik.
5. **Oddech** („nie wstrzymuj oddechu”) — w przeczytanych źródłach izometrii brak; tylko Iron Neck (uprząż, ogólnie) → otwarte.
6. **Ćwiczenia z talerzem i uprzężą** — brak dwóch przeczytanych źródeł szczebla 4 z organizacji; kandydaci do sprawdzenia: NSCA „Exercise Technique Manual” (książka, szczebel 3),
   materiały uczelnianych działów przygotowania motorycznego, instrukcje producentów uprzęży. Do tego czasu bez karty.
7. **Ostrzeżenia zdrowotne** (zawroty głowy, ból — WWL „Stop if the exercise makes you feel dizzy or unwell”, Kaiser „Ease off the exercises if you start to have pain”) —
   twierdzenia o zdrowiu; aplikacja nie daje porad medycznych. Ewentualny ogólny tekst „przy bólu — do specjalisty” to decyzja produktowa, nie wskazówka techniki.
8. **Szczebel HealthLink BC/Healthwise i WebMD Ignite** — jak docs/33 pyt. 2: jeśli audytor uzna je za szczebel 5, karta „Sides” traci drugie źródło przy 4 z 5 zdań.

## Stan

Zebrane 02.11.2026: 1 ćwiczenie gotowe (Sides, 5 zdań), 1 częściowo (Front And Back — 2 zdania gotowe, karta wstrzymana), 3 otwarte (talerz ×2, uprząż).
Nic nie wdrożone; teksty EN do przeglądu tłumacza, PL do recenzenta lokalizacji; wpisy w rejestrze twierdzeń (`scripts/claims.mjs --stub`) przy wdrożeniu.
Następny krok: drugie niezależne źródło dla wersji „tył” i dla ćwiczeń z talerzem/uprzężą (NSCA ETM, uczelnie, producenci).
