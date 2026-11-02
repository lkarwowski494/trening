# Korekta szczebli źródeł — fala W1, G2 mobilność (02.11.2026)

Korekta szczebli wg rozstrzygnięcia koordynatora linii 1.1 z 02.11.2026; ma pierwszeństwo przed plikami fali W1 G2.

> **Zastrzeżenie koordynatora G2 (02.11.2026):** brief tej korekty wymagał od szpitali, uczelni i organizacji zdrowia materiału „jawnie firmowanego **i** z datą albo autorem”, a rozstrzygnięcie pkt (b) dopuszcza „autor + data **albo** treść jawnie firmowana przez organizację”. Degradacje instytucji uzasadnione wyłącznie brakiem daty/autora (np. Arthritis Foundation, UC Berkeley UHS, KU Health System, Health and Wellbeing Queensland, Illinois Extension, Mayo/MFMER, Univ. of Iowa, OSU, Sussexsport, HKU CSE) mogą być zbyt surowe — do potwierdzenia przez koordynatora linii 1.1 razem z pytaniem, czy instytucje te spełniają pkt (a) (pytanie wysłane 02.11.2026). Degradacje za marketing/afiliację (Gym Reapers, Sole, Coach, Topend Sports, Bay State PT) i za brak recenzji (Endurance Magazine, Wiley) tego zastrzeżenia nie dotyczą.

Autor: badacz-merytoryczny. Zakres: nowe źródła (poza bibliotekami ćwiczeń ACE i NASM) w `wskazowki-fala-w1/` — `foam_roll`, `rotator_cuff`,
`mobility_floor-nogi`, `mobility_floor-tulow`, `mobility_stand-statyczne`, `mobility_stand-dynamiczne` — oraz S29–S35 w `role-miesni-fala-w1/rotator_cuff.md`.
Pliki fali nie są zmieniane. Metoda: każdą stronę otworzyłem 02.11.2026 (WebFetch; PDF-y nieczytelne w WebFetch — podgląd strony PDF) i sprawdziłem warunki szczebla 4:
(a) rodzaj organizacji, (b) autor + data albo treść jawnie firmowana — dla szpitali, systemów ochrony zdrowia, NHS, uczelni i organizacji zdrowotnych:
firmowane **i** (datowane albo z autorem), praktyka projektu HSS = 4; (c) brak afiliacji i marketingu. Wspólny właściciel = jedno źródło.
Przeliczenie: dla każdego zdania w blokach JSON liczę źródła szczebla ≤ 4 z różnych organizacji.

## Ustalenia przekrojowe

1. **WebMD Ignite = jeden właściciel.** Healthwise („© … Ignite Healthwise, LLC”), StayWell/Krames („© … The StayWell Company, LLC”, „Powered by Krames by WebMD Ignite”)
   i strony „Author: WebMD Ignite Staff” to ten sam wydawca, niezależnie od placówki, która je hostuje (ColumbiaDoctors, Kaiser, UMass, Vanderbilt, MyHealth.Alberta, Centene).
   W zdaniu liczą się najwyżej jako **jedno** źródło. Szczebel 4 tylko na stronie placówki medycznej z datą („Current as of” / „Last reviewed”); bez daty albo na portalu ubezpieczyciela — 5.
   Strony ColumbiaDoctors: data sprawdzona na 2 stronach (`healthwise-columbia-shoulder-er` „Current as of: May 1, 2026”, `columbia-plantar-fasciitis` „June 9, 2026”); pozostałe
   strony Columbia z plików fali przyjęte jako ten sam szablon (tytuły w plikach fali też podają „stan na 01.05.2026”).
2. **nhs.uk** (`nhs-sitting` i `nhs-sitting-exercises` — **ten sam adres, dwa id**, do scalenia; `nhs-flexibility`) = jedna organizacja. Trusty NHS (South Tees, CUH, KMPT, Shropshire,
   WWL, Livewell Southwest) — osobne organizacje i zespoły; liczone jako niezależne od nhs.uk i od siebie.
3. **Uczelniane ośrodki sportu bez daty i autora** (Sussexsport, HKU CSE / Exercise is Medicine on Campus): firmowane, ale bez daty i autora na stronie → 5 wg reguły dla uczelni
   (i bliżej „sieci siłowni” niż organizacji szkolącej trenerów). To zmienia praktykę z docs/research/33 (HKU „4 — propozycja”).
4. **„4p”** — szczebel 4 przyjęty, ale warunek (b) sprawdzony tylko z metadanych PDF albo z wersji/daty w tytule zapisanej w pliku fali (tekst PDF nieczytelny w WebFetch). Liczone jak 4; do potwierdzenia (patrz „Stan”).

## Tabela źródeł

Legenda a / b / c: ✔ spełnione, ✘ niespełnione, ? niepotwierdzone.

### rotator_cuff (wskazówki)

| id | organizacja | stary | nowy | a / b / c | dowód: miejsce na stronie |
|---|---|---|---|---|---|
| `aaos-rotator-cuff-program` | AAOS (OrthoInfo) | 4 | 4 | ✔ organizacja zawodowa ortopedów / ✔ firmowane AAOS + „written and/or reviewed by a member of … ASES” (brak daty) / ✔ | nagłówek i nota pod treścią |
| `hss-sutton-shoulder-program` | HSS | 4 | 4p | ✔ (HSS = 4) / ? metadane PDF CreateDate 2018-01-18 / ✔ | metadane XMP PDF |
| `healthwise-columbia-shoulder-er` | WebMD Ignite (ColumbiaDoctors) | 4 | 4 | ✔ placówka / ✔ „Current as of: May 1, 2026”, „WebMD Ignite Staff”, Clinical Review Board / ✔ | stopka treści |
| `healthwise-columbia-shoulder-ir` | WebMD Ignite (ColumbiaDoctors) | 4 | 4 | jak wyżej | stopka treści |
| `healthwise-kaiser-band-exercises` | WebMD Ignite (Kaiser Permanente) | 4 | 4 | ✔ / ✔ „Current as of: September 24, 2026” / ✔ — **ten sam właściciel co dwa wyżej** | stopka treści |
| `sussex-rotations` | Sussexsport (Univ. of Sussex) | 4 | **5** | ✘ uczelniany ośrodek sportu / ✘ logo „sussexsport”, brak daty i autora / ✔ | s. 1, nagłówek i stopka |
| `nhs-southtees-side-lying` | South Tees Hospitals NHS FT | 4 | 4 | ✔ / ✔ „Page published: 21/03/2022 Page last updated: 03/04/2024”, ulotka STW0022 / ✔ | dół strony |
| `wiley-dummies-rotation` | Wiley (For Dummies) | 4 | **5** | ✘ wydawca ogólny / ✘ „By”: „No items found”; „This article is from the book”: „No items found” (jest tylko „Updated 2023-08-14”) / ✔ | nagłówek artykułu |
| `gymreapers-band-pull-aparts` | Gym Reapers | 4 | **5** | ✔ producent gum / ✔ „By Roc Pilon”, 03.06.2023 / ✘ blog sprzedażowy: „My top recommendation”, przycisk „SHOP MILITARY RESISTANCE BAND SET” | treść artykułu |
| `barbend-cuban-press` | BarBend | 4 | 4 | ✔ artykuł o technice (how-to, błędy, warianty) / ✔ „Written by Caroline Lubinsky CF-L1”, „Last updated on June 17th, 2024” / ✔ brak linków afiliacyjnych w treści | nagłówek artykułu |
| `sole-cuban-press` | Sole Fitness | 4 | **5** | ✘ w praktyce materiał sprzedażowy hantli / ✔ S. Cawley, 29.06.2025 / ✘ wielokrotne linki do własnych hantli SW155/SW180 i kolekcji „SOLE Strength” | treść artykułu |
| `coach-cuban-press` | Coach (coachweb.com) | 4 | **5** | ✘ magazyn bez recenzji eksperckiej; autor — redaktor, bez kwalifikacji trenerskich / ✔ „By Nick Hutchings”, 03.09.2009 / ✘ „may earn an affiliate commission” | byline, nota afiliacyjna |

### role-miesni-fala-w1/rotator_cuff.md (S29–S35)

| id | organizacja | stary | nowy | a / b / c | dowód |
|---|---|---|---|---|---|
| S29 | Kenhub | 4 | 4 | ✔ serwis z recenzją ekspercką („All content published on Kenhub is reviewed by medical and anatomy experts”) / ✔ „Egle Pirie, BSc (Hons)”, recenzent „Roberto Grujičić, MD”, „Last reviewed: October 30, 2023” / ✔ | nagłówek i stopka artykułu |
| S30, S33 | czasopisma recenzowane | 3 | 3 | poza zakresem (szczebel 3) | — |
| S31 | ACE | 4 | 4 | biblioteka ACE — poza zakresem | — |
| S32 | Catalyst Athletics | 4 | 4 | rozstrzygnięcie koordynatora: Catalyst = 4 | — |
| S34 | BarBend | 4 | 4 | jak `barbend-cuban-press` (ten sam artykuł) | nagłówek artykułu |
| S35 | Coach | 4 | **5** | jak `coach-cuban-press` (ten sam artykuł) | byline, nota afiliacyjna |

### foam_roll

| id | organizacja | stary | nowy | a / b / c | dowód |
|---|---|---|---|---|---|
| `ccmc-foam-rolling` | Connecticut Children's Sports Medicine | 4 | 4p | ✔ szpital / ? data tylko z adresu (`/2024-01/`) / ✔ | adres pliku |
| `orthobethesda-foam-rolling` | OrthoBethesda (fizjoterapia) | 4 | 4p | ✔ / ? „2015” wg pliku fali / ✔ | tytuł w pliku fali |
| `osu-foam-rolling` | Ohio State Wexner Medical Center | 4 | **5** | ✔ / ✘ transkrypcja bez mówcy i daty, tylko „[The Ohio State University Wexner Medical Center]” / ✔ | ostatnia linia transkrypcji |
| `hku-foam-rolling` | HKU CSE (Exercise is Medicine on Campus) | 4 | **5** | ✘ ośrodek sportu uczelni / ✘ logotypy, brak daty i autora (s. 1) / ✔ | s. 1, nagłówek i stopka |
| `uwmed-plantar-fasciitis` | UW Medicine Sports Medicine Clinic | 4 | 4 | ✔ / ✔ „© University of Washington Medical Center, Published PFES: 2018, 2019, Clinician Review: 11/2019” / ✔ | s. 5, stopka |
| `columbia-plantar-fasciitis` | WebMD Ignite (ColumbiaDoctors) | 4 | 4 | ✔ / ✔ „Current as of: June 9, 2026”, „WebMD Ignite Staff” / ✔ | stopka treści |

### mobility_floor-nogi

| id | organizacja | stary | nowy | a / b / c | dowód |
|---|---|---|---|---|---|
| `covenant-lower-body-flex` | Covenant HealthCare (Kettering Sports Medicine) | 4 | 4p | ✔ / ? metadane PDF CreateDate 2016-06-10 / ✔ | metadane XMP |
| `livewell-lower-limb-stretch` | Livewell Southwest (NHS) | 4 | 4p | ✔ / ? „v2 04.2016” wg tytułu w pliku fali / ✔ | tytuł |
| `uiowa-chc-lower-body` | Univ. of Iowa, Community Health Collaborative | 4 | **5** | ✔ uczelnia / ✘ brak daty i autora („© 2026 The University of Iowa”) / ✔ | stopka |
| `vumc-90608` | WebMD Ignite/StayWell (Vanderbilt Health) | 4 | 4 | ✔ / ✔ „© 2000-2026 The StayWell Company”, „Last reviewed 9/1/2025”, recenzenci PT DPT i RN / ✔ | stopka |
| `staywell-89925` | WebMD Ignite/Krames (portal PA Health & Wellness, Centene) | 4 | **5** | ✘ portal ubezpieczyciela, nie placówka / ✘ brak daty i recenzentów / ✔ — i tak ten sam właściciel co `vumc-90608` | stopka |
| `athletico-figure-4` | Athletico Physical Therapy | 4 | 4 | ✔ sieć fizjoterapii / ✔ „by Athletico”, „March 9, 2016” / ✔ brak produktów | nagłówek wpisu |
| `alberta-abk4469` | WebMD Ignite/Healthwise (MyHealth.Alberta, rząd Alberty) | 4 | 4 | ✔ / ✔ „Current as of: July 31, 2024” / ✔ — **ten sam właściciel co `vumc-90608`** | stopka |
| `topend-quads-lying` | Topend Sports | 4 | **5** | ✘ / ✘ brak autora i daty / ✘ „Topendsports.com features affiliate links” | stopka |
| `topend-lunge-forward` | Topend Sports | 4 | **5** | jak wyżej (ten sam serwis) | stopka |
| `orthoindy-itb-program` | OrthoIndy Physical Therapy | 4 | 4p | ✔ / ? „rev. 8/15” wg tytułu w pliku fali / ✔ | tytuł |
| `baystate-pmc-strap` | Bay State PT na blogu Pan-Mass Challenge | 4 | **5** | ✘ wpis sponsora / ✘ autor „Pan-Mass Challenge” / ✘ oznaczenie „Sponsor News”, „Official Physical Therapy Partner” | nagłówek i treść wpisu |
| `hattiesburg-peronank` | RelayHealth (McKesson) na serwerze Hattiesburg Clinic | 4 | **5** | ✘ komercyjny wydawca treści, placówka nienazwana / ✘ „Copyright © 2016 RelayHealth…”, brak autora i recenzji / ✔ | stopka |
| `endurancemag-runners-lunge` | Endurance Magazine | 4 | **5** | ✘ magazyn bez redakcji z recenzją; autorka ekspertka jogi (PhD), ale organizacja nie spełnia (a) / ✔ S. Rountree, 2019 (metadane) / ✔ | byline |

### mobility_stand-dynamiczne

| id | organizacja | stary | nowy | a / b / c | dowód |
|---|---|---|---|---|---|
| `cfmws-irs-dynamic-warmup` | CFMWS — PSP Health Promotion Kingston | 4 | 4p | ✔ promocja zdrowia sił zbrojnych / ? metadane: autor „HP Kingston”, 2025-07-29; treść obrazkowa / ✔ | metadane PDF |
| `af-dynamic-warmups` | Arthritis Foundation | 4 | **5** | ✔ / ✘ brak autora i daty, tylko „Recommended by fitness professionals” / ✔ | treść strony |
| `ucb-uhs-work-warmup` | UC Berkeley University Health Services | 4 | **5** | ✔ / ✘ logo „Be Well at Work”, brak daty i autora / ✔ | s. 1, stopka |
| `sportsg-inclusive-warmup` | Inclusive Sport (rząd Singapuru) | 4 | 4 | ✔ / ✔ „Last updated on 24 June 2026”, „© 2026 Government of Singapore” / ✔ | dół strony |
| `kuhs-dynamic-stretching` | Univ. of Kansas Health System | 4 | **5** | ✔ / ✘ brak autora i daty (tylko „© 2026 …”) / ✔ | stopka |
| `cc-seated-warmup` | Cleveland Clinic | 4 | 4p | ✔ / ? „Rev. 7/19” wg tytułu w pliku fali / ✔ | tytuł |
| `webmd-ignite-ankle-circles` | WebMD Ignite (ColumbiaDoctors) | 4 | 4 | ✔ / ✔ „akt. 01.05.2026” (szablon Columbia) / ✔ | stopka |
| `nhs-sitting` | NHS (nhs.uk) | 4 | 4 | ✔ / ✔ przegląd 18.01.2024 (plik fali) / ✔ | stopka |

### mobility_stand-statyczne

| id | organizacja | stary | nowy | a / b / c | dowód |
|---|---|---|---|---|---|
| `nhs-flexibility` | NHS (nhs.uk) | 4 | 4 | ✔ / ✔ „Page last reviewed: 20 November 2023” / ✔ | stopka |
| `nhs-shrops-calf` | Shropshire Community Health NHS Trust | 4 | 4 | ✔ / ✔ „Datix Ref: 2012 Review Date: May 2019” (data przeglądu minęła — uwaga) / ✔ | s. 1, stopka |
| `nhs-wwl-neck` | WWL Teaching Hospitals NHS FT | 4 | 4p | ✔ / ? tytuł „Level 1 - v2”, Tpy 023; brak daty w czytelnej części / ✔ | metadane PDF |
| `ccv-flexibility` | Cancer Council Victoria | 4 | 4 | ✔ / ✔ „Page last updated: September 2026”, recenzja „Dr Kirsten Adlard, Accredited Exercise Physiologist” / ✔ | dół strony |
| `webmd-calf-step`, `webmd-quad-standing`, `webmd-shoulder-posterior` | WebMD Ignite (ColumbiaDoctors) | 4 | 4 | jak Columbia wyżej — **jedno źródło łącznie** | stopka |
| `webmd-heelcord` | WebMD Ignite (UMass Memorial) | 4 | **5** | ✔ placówka / ✘ brak daty i autora („Content provided by WebMD Ignite”) / ✔ | stopka |
| `webmd-side-bend` | WebMD Ignite (UMass Memorial) | 4 | **5** | jak wyżej | stopka |

### mobility_floor-tulow

| id | organizacja | stary | nowy | a / b / c | dowód |
|---|---|---|---|---|---|
| `hwq-cat-cow` | Health and Wellbeing Queensland | 4 | **5** | ✔ agencja rządowa / ✘ brak daty i autora / ✔ | stopka |
| `kmpt-stretches` | Kent and Medway NHS and Social Care Partnership Trust | 4 | ? | ✔ / ? PDF nieczytelny, kod KM1237 bez daty / ✔ — bez wpływu na wynik (Cat-Cow ma 3 inne) | — |
| `southtees-cat-stretch` | South Tees Hospitals NHS FT | 4 | 4 | ✔ / ✔ „Page published: 21/03/2022 Page last updated: 03/04/2024”, STW0027 / ✔ | dół strony |
| `ccsm-back-stretching` | Connecticut Children's Sports Medicine | 4 | 4p | ✔ / ? data z adresu (`/2026-04/`) / ✔ | adres pliku |
| `webmd-ignite-childs-pose`, `-trunk-twist-seated`, `-upper-back` | WebMD Ignite (ColumbiaDoctors) | 4 | 4 | jak Columbia wyżej | stopka |
| `hss-back-neck-stretches` | HSS | 4 | 4 | ✔ / ✔ 17.02.2021 (plik fali) / ✔ | nagłówek |
| `aurora-lower-trunk-rotation` | Advocate Aurora Health | 4 | 4p | ✔ / ? „rev. 12/2019” wg tytułu / ✔ | tytuł |
| `vhi-supine-rotation` | VHI na serwerze Hattiesburg Clinic | 4 | **5** | ✘ wydawca kart ćwiczeń, placówka nienazwana / ✘ „Copyright © VHI”, brak daty i autora / ✔ | stopka |
| `cuh-spinal-rom` | Cambridge University Hospitals NHS FT | 4 | 4 | ✔ / ✔ „Physiotherapy (Outpatient)”, „Approved 27 May 2024”, dok. 100850 v2 / ✔ | dół strony |
| `uiuc-seated-spinal-twist` | Univ. of Illinois Extension | 4 | **5** | ✔ / ✘ brak daty i autora / ✔ | stopka |
| `mayo-seated-spinal-twist` | Mayo Clinic (MFMER) na stronie Mosaic Life Care | 4 | **5** | ✔ / ✘ tylko „©1998-2026 … MFMER”, brak daty i autora / ✔ | stopka |
| `sussex-trapezius` | Sussexsport | 4 | **5** | jak `sussex-rotations` (ta sama seria kart) | — |
| `nhs-sitting-exercises` | NHS (nhs.uk) | 4 | 4 | = `nhs-sitting` (ten sam adres) | — |

## Zdania spadające poniżej 2 źródeł

„Pozostałe” = źródła szczebla ≤ 4 z różnych organizacji po korekcie.

| plik | ćwiczenie | sekcja | id zdania | pozostałe źródła |
|---|---|---|---|---|
| foam_roll | Foam Roll: Quadriceps | tips | `foam_roll.oneLeg` | orthobethesda |
| foam_roll | Foam Roll: Hamstrings | **setup** | `foam_roll.ham.setup` | orthobethesda |
| foam_roll | Foam Roll: Hamstrings | tips | `foam_roll.angle` | orthobethesda |
| foam_roll | Calves-SMR | tips | `foam_roll.oneLeg` | nasm |
| foam_roll | Calves-SMR | tips | `foam_roll.angle` | orthobethesda |
| foam_roll | Calves-SMR | tips | `smr.tender` | nasm |
| foam_roll | Iliotibial Tract-SMR | setup | `foam_roll.it.topLeg` | ccmc (setup nadal ma `it.setup` z 2) |
| foam_roll | Iliotibial Tract-SMR | tips | `foam_roll.angle` | orthobethesda |
| foam_roll | Adductor-SMR | **setup** | `foam_roll.add.setup` | ccmc |
| foam_roll | Piriformis-SMR | setup | `foam_roll.pir.lean` | brak |
| foam_roll | Piriformis-SMR | tips | `smr.tender` | orthobethesda |
| foam_roll | Rhomboids-SMR | **setup** | `foam_roll.ub.setup` | orthobethesda |
| foam_roll | Rhomboids-SMR | setup | `foam_roll.ub.arms` | orthobethesda |
| foam_roll | Rhomboids-SMR | **move** | `foam_roll.ub.path` | orthobethesda |
| foam_roll | Rhomboids-SMR | **move** | `smr.slow` | orthobethesda |
| rotator_cuff | Band Pull Apart | **setup / move**, tips, mistakes | `rotator_cuff.pullSetup`, `pullMove`, `rot.slow`, `rotator_cuff.mis.shrug` | healthwise-kaiser (WebMD Ignite) |
| rotator_cuff | External Rotation (hantel) | tips | `rotator_cuff.sideHead` | aaos |
| rotator_cuff | External Rotation (linki) | **setup / move**, tips, mistakes | `cableSetup`, `erStart`, `erMove`, `rot.elbow`, `rot.mis.elbowAway` | ace-352 (`rot.slow` zostaje: ace-352 + aaos) |
| rotator_cuff | Internal Rotation with Band | mistakes | `rot.mis.elbowAway` | aaos |
| rotator_cuff | Cable Internal Rotation | **setup / move**, tips, mistakes | `cableSetup`, `irStart`, `irMove`, `rot.elbow`, `rot.mis.elbowAway` | ace-351 (`rot.slow` zostaje: ace-351 + aaos) |
| rotator_cuff | Cuban Press | **setup / move**, mistakes | `cubanSetup`, `cubanRow`, `cubanRotate`, `cubanPress`, `mis.cubanHeavy` | barbend |
| rotator_cuff | Cuban Press | mistakes | `rotator_cuff.mis.elbowsDrop` | brak |
| floor-nogi | Supine Hamstring Stretch | **setup** | `mobility_floor.n.hsStrap` | orthoindy |
| floor-nogi | Butterfly Stretch | setup | `mobility_floor.n.bfSoles` | covenant (setup ma jeszcze `n.tall` z 2) |
| floor-nogi | Seated Floor Hamstring Stretch | **setup** | `mobility_floor.n.hsSeat` | livewell |
| floor-nogi | Seated Floor Hamstring Stretch | tips | `n.hingeFlat`, `st.noBounce` | covenant; livewell |
| floor-nogi | Runner's Stretch | **setup** | `mobility_floor.n.lungeHands` | brak |
| floor-nogi | Side-Lying Quad Stretch | tips | `n.qHipLine`, `n.core` | livewell |
| floor-nogi | IT Band and Glute Stretch | **setup / move** | `n.hsStrap`, `n.itbAcross` | orthoindy |
| floor-nogi | Seated Calf Stretch | **setup / move** | `n.calfStrap`, `n.calfPull` | brak |
| stand-dynamiczne | Leg Swings (Front-to-Back) | **setup / move**, tips, mistakes | `d.oneLeg`, `d.swingFrontBack`, `dyn.control`, `dyn.mis.jerk` | sportsg |
| stand-dynamiczne | Leg Swings (Side-to-Side) | **setup / move**, tips | `d.oneLeg`, `d.swingSide`, `dyn.control` | sportsg |
| stand-dynamiczne | Arm Circles | **setup / move** | `d.armsT`; `d.armCircles` | brak; cc-seated (`dyn.control` zostaje: cc-seated + sportsg) |
| stand-dynamiczne | Torso Rotation | **setup** | `d.feetShoulder` | sportsg (move zostaje: sportsg + nhs-sitting) |
| stand-dynamiczne | Standing Hip Circles | **setup / move** | `d.hipStance`; `d.hipCircles` | sportsg; brak |
| stand-dynamiczne | Ankle Circles | **setup / move** | `d.footUp`, `d.ankleCircles` | webmd-ignite-ankle-circles |
| stand-dynamiczne | Dynamic Chest Stretch | **move** | `d.chestSwing` | sportsg |
| stand-statyczne | Standing Lateral Stretch | **setup / move**, tips | `s.sideSet`, `s.sideMove`; `sb.plane` | nhs-flexibility; ace-212 (wariant siedzący) |
| floor-tulow | Cat-Cow | tips | `t.catCow.exhale` | ace-15 |
| floor-tulow | Supine Spinal Twist | tips | `st.tension` | hss |
| floor-tulow | Seated Rotation Stretch | **setup / move**, tips | `seatRot.setup`, `seatRot.elbow`; `seatRot.move`; `seatRot.head` | brak; brak; webmd-ignite-trunk-twist-seated (wariant); cuh |
| floor-tulow | Upper Back Stretch | **setup / move** | `upperBack.setup`, `upperBack.reach` | webmd-ignite-upper-back |

Role mięśni: `side_delt.shoulder_abd` w Cuban Press — opis ruchu tylko S34 (BarBend) → „jedno źródło” o ćwiczeniu; funkcja mięśnia (S1, S6, S23) bez zmian.
Pozostałe role (S29 Kenhub = 4, S32 Catalyst = 4) — bez zmian stanu.

## Zmiany stanu ćwiczeń

| plik | ćwiczenie | było | jest | powód |
|---|---|---|---|---|
| foam_roll | Foam Roll: Hamstrings | gotowe | częściowe | ustawienie tylko OrthoBethesda (OSU = 5) |
| foam_roll | Adductor-SMR | gotowe | częściowe | ustawienie tylko Connecticut Children's (OSU = 5) |
| foam_roll | Rhomboids-SMR | gotowe | otwarte | ustawienie i ruch tylko OrthoBethesda (OSU, HKU = 5) |
| rotator_cuff | Band Pull Apart | gotowe | otwarte | Gym Reapers = 5; zostaje WebMD Ignite (Kaiser) |
| rotator_cuff | External Rotation (linki) | gotowe | otwarte | Sussexsport = 5; zostaje ACE #352 |
| rotator_cuff | Cable Internal Rotation | gotowe | otwarte | Sussexsport = 5; zostaje ACE #351 |
| rotator_cuff | Cuban Press | gotowe | otwarte | Coach i Sole = 5; zostaje BarBend |
| floor-nogi | Supine Hamstring Stretch | gotowe | częściowe | ustawienie z pasem tylko OrthoIndy (Bay State = 5); ruch ma 2 (OrthoIndy + StayWell/Vanderbilt) |
| floor-nogi | Butterfly Stretch | gotowe | częściowe | zdanie ułożenia stóp tylko Covenant (UIowa = 5); w ustawieniu zostaje tylko „wyprostuj się” |
| floor-nogi | Seated Floor Hamstring Stretch | gotowe | częściowe | ustawienie tylko Livewell (UIowa, Krames = 5) |
| floor-nogi | Runner's Stretch | częściowe | otwarte | oba źródła = 5 (Topend, Endurance Magazine) |
| floor-nogi | IT Band and Glute Stretch | gotowe | otwarte | Bay State = 5; zostaje OrthoIndy |
| floor-nogi | Seated Calf Stretch | gotowe | otwarte | oba źródła = 5 (Bay State, RelayHealth) |
| stand-dynamiczne | Leg Swings (Front-to-Back) | gotowe | otwarte | KU Health System = 5; zostaje Inclusive Sport |
| stand-dynamiczne | Leg Swings (Side-to-Side) | gotowe | otwarte | jak wyżej |
| stand-dynamiczne | Arm Circles | gotowe | otwarte | AF i UC Berkeley = 5; ustawienie 0, ruch tylko Cleveland Clinic (wariant siedzący) |
| stand-dynamiczne | Torso Rotation | gotowe | częściowe | ustawienie tylko Inclusive Sport; ruch 2 |
| stand-dynamiczne | Standing Hip Circles | gotowe | otwarte | AF i UC Berkeley = 5 |
| stand-dynamiczne | Ankle Circles | gotowe | otwarte | UC Berkeley = 5; zostaje WebMD Ignite (wariant siedzący) |
| stand-dynamiczne | Dynamic Chest Stretch | częściowe | otwarte | KU = 5; ruch tylko Inclusive Sport |
| stand-statyczne | Standing Lateral Stretch | gotowe | otwarte | UMass (WebMD bez daty) = 5; zostaje nhs.uk |
| floor-tulow | Seated Rotation Stretch | gotowe | otwarte | Illinois Extension i Mayo/MFMER bez daty i autora = 5 |
| floor-tulow | Upper Back Stretch | częściowe | otwarte | Sussexsport = 5; zostaje WebMD Ignite |

Bez zmiany stanu: Quadriceps, Calves, Iliotibial Tract, Latissimus Dorsi, Piriformis, Foot (foam_roll); External Rotation with Band, External Rotation (hantel),
Internal Rotation with Band (rotator_cuff); Kneeling Hip Flexor, Supine Figure-Four, Side-Lying Quad (nogi); WGS (częściowe), Inchworm, Shoulder Circles (częściowe) (dynamiczne);
Gastrocnemius, Wall Calf, Soleus, Elevated Quad (częściowe), Cross-Body, Overhead Triceps, Side Neck (częściowe) (statyczne); Cat-Cow, Child's Pose, Supine Spinal Twist,
Middle Back (częściowe) (tułów).

Uwaga do Supine Spinal Twist: po wypadnięciu VHI ustawienie i ruch potwierdzają tylko źródła wariantu z **oboma** kolanami (HSS, Advocate Aurora, CUH). Jeśli figura pokazuje
jedno kolano, ćwiczenie nie ma źródła wprost — [OTWARTE], do decyzji koordynatora (analogia wariantu = „uproszczenie”).

## Stan

- **Zrobione (02.11.2026):** ocena wszystkich nowych źródeł spoza ACE/NASM w 6 plikach wskazówek i S29–S35 w pliku ról; przeliczenie zdań i stanów ćwiczeń.
  Wynik: 41 źródeł bez zmiany (z tego 11 „4p”), 25 źródeł → 5 (licząc S35), 1 niepotwierdzone (`kmpt-stretches`, nie wpływa na żadne zdanie) — liczby poprawione przez koordynatora G2 wg raportu autora, 23 ćwiczenia zmieniają stan (14 gotowe → otwarte, 6 gotowe → częściowe, 3 częściowe → otwarte).
- **Zostało / do potwierdzenia narzędziem (`pdfinfo`, `pdftotext`):** PDF-y „4p” — `hss-sutton-shoulder-program`, `ccmc-foam-rolling`, `orthobethesda-foam-rolling`,
  `covenant-lower-body-flex`, `livewell-lower-limb-stretch`, `orthoindy-itb-program`, `cfmws-irs-dynamic-warmup`, `cc-seated-warmup`, `nhs-wwl-neck`, `aurora-lower-trunk-rotation`,
  `ccsm-back-stretching`, `kmpt-stretches`. Jeśli któryś nie ma daty ani autora → 5 i spadają kolejne zdania; najbardziej wrażliwe: OrthoBethesda i Connecticut Children's
  (foam_roll: Quadriceps, Hamstrings, Calves, IT, Piriformis), CFMWS (Inchworm, WGS), Livewell/Covenant (Kneeling Hip Flexor, Butterfly, Side-Lying Quad), OrthoIndy (Side-Lying Quad).
- **Poza zakresem:** `wskazowki-fala-w1/mobility_stand-statyczne-2.md` (m.in. Illinois Extension, Kentucky Extension, Parkview, MedlinePlus, Arthritis UK, Duke, strony WebMD) —
  nie oceniany w tej korekcie; `illinois-forward-fold` prawdopodobnie jak `uiuc-seated-spinal-twist` (5), do sprawdzenia.
- **Następny krok:** koordynator przenosi do danych tylko zdania z ≥ 2 źródłami po korekcie; zdania z tabeli „spadające” → „Otwarte” w plikach fali albo nowy research
  dla ćwiczeń otwartych (np. Leg Swings, Arm Circles, Band Pull Apart, Cuban Press — szukać organizacji szkolących trenerów).
- **Pułapki:** (1) WebMD Ignite pod różnymi placówkami i markami (Healthwise, StayWell, Krames) = jedno źródło; (2) `nhs-sitting` i `nhs-sitting-exercises` to ten sam adres — scalić id;
  (3) HKU i Sussexsport zmieniają praktykę z docs/research/33 — inne pliki z tymi id też wymagają korekty; (4) `nhs-shrops-calf` ma przeterminowaną datę przeglądu (05.2019) — nadal 4,
  ale warto szukać nowszej wersji.
