# 27 — Wskazówki techniki: źródła (generowane)

AUTOMATYCZNIE WYGENEROWANE przez `scripts/cues/gen.mjs` z `data/zrodla/cues.json` i `lib/cues/text/pl.json` — nie edytować ręcznie.
Sprawdzanie: `node scripts/cues/gen.mjs --check` (część `npm run verify`).

Decyzja właściciela: docs/18, 08.10.2026 (ok. 23:50) — wariant A etapami; etap 1 = własne wskazówki tekstowe dla ćwiczeń bazowych (research: docs/research/26).

## Zasady

- Każda wskazówka ma co najmniej 2 przeczytane źródła z różnych organizacji (sprawdza skrypt); miejsce w źródle podane przy odwołaniu.
- Sformułowania własne (parafraza faktów i metod — art. 1 ust. 2¹ pr. aut.); zdań źródeł nie kopiujemy.
- Bez twierdzeń medycznych („zapobiega kontuzjom” itp.); w aplikacji stopka z odesłaniem do lekarza lub fizjoterapeuty.
- Tylko część wspólna źródeł; gdzie źródła się różnią (np. głębokość, rozstaw), wskazówka mówi tyle, ile mówią wszystkie, albo podaje przedział.
- Strony ExRx.net czytane przez Wayback Machine (bezpośrednio HTTP 403) — przy źródle adres migawki.
- Źródło opisujące inne ćwiczenie (np. High Row przy Face Pull) ma znacznik „analogia” i nie liczy się do minimum źródeł; wariant tego samego ćwiczenia (np. wyciskanie siedząc i stojąc, hantle i sztanga) — z opisem w miejscu odwołania (audyt kontrolny 1 MER2-04, 09.10.2026).

## Organizacje i szczeble (hierarchia z CLAUDE.md)

W aplikacji podpis „Na podstawie: …” podaje tylko rodzaje źródeł (kolumna „Rodzaj”), bez nazw organizacji i marek (audyt kontrolny 1 MER2-07, decyzja właściciela 09.10.2026, wariant A); pełna lista — ten dokument.

| Skrót | Organizacja | Szczebel | Rodzaj (podpis w aplikacji) |
|---|---|---|---|
| ACE | American Council on Exercise — Exercise Library (acefitness.org) | 4 | organizacja szkoleniowa (biblioteka ćwiczeń) |
| NASM | National Academy of Sports Medicine — Exercise Library (nasm.org) | 4 | organizacja szkoleniowa (biblioteka ćwiczeń) |
| ExRx.net | ExRx.net — Exercise Directory (czytane przez Wayback Machine) | 4 | serwis specjalistyczny |
| Stronger by Science | Stronger by Science — przewodniki techniki (Greg Nuckols) | 4 | serwis specjalistyczny |
| Concept2 | Concept2 — Indoor Rowing Technique (producent ergometru) | 4 | producent sprzętu |
| Swinton i in. (Robert Gordon University) | Swinton i in. (Robert Gordon University) — badanie w recenzowanym czasopiśmie (PubMed) | 3 | badanie (czasopismo recenzowane) |
| Fry, Smith, Schilling (University of Memphis) | Fry, Smith, Schilling (University of Memphis) — badanie w recenzowanym czasopiśmie (PubMed) | 3 | badanie (czasopismo recenzowane) |
| Eleiko | Eleiko — Online Education, Exercise Video Library (eleiko.inspire360.com) | 4 (warunkowo 4: dział edukacji (Online Education), strona ćwiczenia z opisem ruchu; strony produktowe — szczebel 5; jako producent 4 tylko dla własnego sprzętu (docs/18, 02.11.2026, uzupełnienie 3)) | producent sprzętu |
| NSCA | National Strength and Conditioning Association — NSCA Coach (artykuł edukacyjny, nie stanowisko NSCA) | 4 | organizacja szkoleniowa (biblioteka ćwiczeń) |
| HSS | Hospital for Special Surgery — Move Better Feel Better (materiał edukacyjny szpitala specjalistycznego; rodzaj w aplikacji: serwis specjalistyczny) | 4 | serwis specjalistyczny |
| Life Fitness | Life Fitness — Education Hub (blog producenta sprzętu, 2024) | 4 | producent sprzętu |
| NordicTrack | NordicTrack — blog producenta bieżni (2025) | 4 | producent sprzętu |
| Mullane, Turner, Bishop (Middlesex University) | Mullane, Turner, Bishop (Middlesex University) — artykuł techniczny, Strength Cond J (recenzowany; rękopis z repozytorium uczelni) | 3 | badanie (czasopismo recenzowane) |
| van der Horst i in. (UMC Utrecht) | van der Horst i in. (UMC Utrecht) — RCT, Am J Sports Med 2015 | 3 | badanie (czasopismo recenzowane) |
| Chen, Wu, Guo (Beijing Sport University i in.) | Chen, Wu, Guo (Beijing Sport University i in.) — RCT, Sci Rep 2023 | 3 | badanie (czasopismo recenzowane) |
| Ripley i in. (University of Salford) | Ripley i in. (University of Salford) — badanie, Muscles 2024 | 3 | badanie (czasopismo recenzowane) |
| Lea, O’Driscoll, Wiles (Canterbury Christ Church University) | Lea, O’Driscoll, Wiles (Canterbury Christ Church University) — badanie pilotażowe, Eur J Appl Physiol 2023 | 3 | badanie (czasopismo recenzowane) |
| Ng i in. (Chinese University of Hong Kong) | Ng i in. (Chinese University of Hong Kong) — protokół RCT, Trials 2026 | 3 | badanie (czasopismo recenzowane) |
| Baffour-Awuah i in. (University of New England) | Baffour-Awuah i in. (University of New England) — przegląd z zaleceniami, Clin Hypertens 2023 (współautor Wiles — nie niezależny od Lea i in.) | 3 | badanie (czasopismo recenzowane) |
| Krobot Cutura i in. (University of Zagreb) | Krobot Cutura i in. (University of Zagreb, Faculty of Kinesiology) — badanie, IJERPH 2024 | 3 | badanie (czasopismo recenzowane) |
| Lyons i in. (University of Central Florida) | Lyons i in. (University of Central Florida) — badanie, Int J Sports Phys Ther 2025 | 3 | badanie (czasopismo recenzowane) |
| Andersen i in. (Western Norway University of Applied Sciences) | Andersen i in. (Western Norway University of Applied Sciences) — badanie EMG, J Sports Sci Med 2021 | 3 | badanie (czasopismo recenzowane) |
| Nunes i in. (Londrina State University) | Nunes i in. (Londrina State University) — badanie, IJERPH 2020 | 3 | badanie (czasopismo recenzowane) |
| Havers i in. (IST University of Applied Sciences) | Havers i in. (IST University of Applied Sciences, Düsseldorf) — badanie, Eur J Sport Sci 2025 | 3 | badanie (czasopismo recenzowane) |
| Intziegianni i in. (UCLan Cyprus) | Intziegianni i in. (UCLan Cyprus) — badanie EMG, Muscles 2026 | 3 | badanie (czasopismo recenzowane) |
| Marcolin i in. (University of Padova) | Marcolin i in. (University of Padova) — badanie EMG, J Athl Train 2015 | 3 | badanie (czasopismo recenzowane) |
| Polevoy i in. (Moscow Aviation Institute i in.) | Polevoy i in. (Moscow Aviation Institute i in.) — badanie, IJERPH 2022 | 3 | badanie (czasopismo recenzowane) |
| Tsartsapakis i in. (Aristotle University of Thessaloniki) | Tsartsapakis i in. (Aristotle University of Thessaloniki) — protokół treningowy, Methods Protoc 2025 | 3 | badanie (czasopismo recenzowane) |
| Plotkin i in. (CUNY Lehman College) | Plotkin i in. (CUNY Lehman College; zespół Schoenfelda) — badanie, PeerJ 2022 | 3 | badanie (czasopismo recenzowane) |
| Ghigiarelli i in. (Hofstra University) | Ghigiarelli i in. (Hofstra University) — badanie, Sensors 2026 | 3 | badanie (czasopismo recenzowane) |
| Kinoshita i in. (Ritsumeikan University) | Kinoshita i in. (Ritsumeikan University) — RCT, Front Physiol 2023 | 3 | badanie (czasopismo recenzowane) |
| Hasani i in. (Monash University) | Hasani i in. (Monash University) — badanie pilotażowe, BMC Sports Sci Med Rehabil 2021 (rehabilitacja — użyty tylko opis wykonania) | 3 | badanie (czasopismo recenzowane) |
| Bini, Hume, Croft (Auckland University of Technology) | Bini, Hume, Croft (Auckland University of Technology) — przegląd, Sports Med 2011 | 2 | badanie (czasopismo recenzowane) |
| Moore (Cardiff Metropolitan University) | Moore (Cardiff Metropolitan University) — przegląd, Sports Med 2016 | 2 | badanie (czasopismo recenzowane) |
| Folland i in. (Loughborough University) | Folland i in. (Loughborough University) — badanie, Med Sci Sports Exerc 2017 | 3 | badanie (czasopismo recenzowane) |
| Berling i in. (University of Wisconsin–La Crosse) | Berling i in. (University of Wisconsin–La Crosse) — badanie, J Cardiopulm Rehabil 2006 (abstrakt) | 3 | badanie (czasopismo recenzowane) |
| de Oliveira i in. (Federal University of Paraná) | de Oliveira i in. (Federal University of Paraná) — badanie, Sci Rep 2020 | 3 | badanie (czasopismo recenzowane) |
| Hofmann i in. (Cybex Research Institute) | Hofmann i in. (Cybex Research Institute) — badanie, Int J Exerc Sci 2014 (abstrakt; instytut producenta sprzętu) | 3 | badanie (czasopismo recenzowane) |
| Physitrack | Physitrack — Exercise library (us.physitrack.com, biblioteka ćwiczeń domowych dla fizjoterapeutów) — szczebel 5 (decyzja 02.11.2026: bez autora i kwalifikacji, serwis/dostawca; nie liczy się do pary) | 5 | serwis specjalistyczny |
| The Prehab Guys | The Prehab Guys — biblioteka ćwiczeń (theprehabguys.com, fizjoterapeuci) | 4 (warunkowo 4: artykuł z autorem (zespół fizjoterapeutów z kwalifikacjami); strona bez autora albo sprzedaży programów — szczebel 5 (docs/18, 02.11.2026, uzupełnienie 2)) | serwis specjalistyczny |
| BarBend | BarBend — Exercise Guides (barbend.com; autor CSCS, weryfikacja NASM-CPT i USAW-L2) | 4 | serwis specjalistyczny |
| Breaking Muscle | Breaking Muscle — Exercise Guides (breakingmuscle.com; serwis specjalistyczny) — szczebel 5 (decyzja 02.11.2026: bez autora i kwalifikacji, serwis/dostawca; nie liczy się do pary) | 5 | serwis specjalistyczny |
| Coach | Coach (coachweb.com) — How To, ekspert z akredytacją NSCA | 4 (warunkowo 4: artykuł z autorem z kwalifikacjami w biogramie, datą i redakcją wydawcy; inaczej szczebel 5 (docs/18, 02.11.2026, uzupełnienie 2)) | serwis specjalistyczny |
| Rogue Fitness | Rogue Fitness — Movement Library producenta sztang i hantli (roguefitness.com/theindex); liczona tylko dla własnego rodzaju sprzętu | 4 | producent sprzętu |
| CrossFit | CrossFit — Essentials (crossfit.com; organizacja certyfikująca trenerów) | 4 | organizacja szkoleniowa (biblioteka ćwiczeń) |
| Catalyst Athletics | Catalyst Athletics — Olympic Weightlifting Exercise Library (catalystathletics.com) | 4 | serwis specjalistyczny |
| Experience Life | Experience Life (magazyn Life Time) — liczony tylko artykuł autora z kwalifikacjami (A. Heffernan, CSCS) | 4 | serwis specjalistyczny |
| IronMind | IronMind — artykuły „Jim Schmitz on the Lifts” (liczone tylko z autorem J. Schmitz i datą, także pośrednią z IronMind News) | 4 | serwis specjalistyczny |
| Torokhtiy | Torokhtiy Weightlifting — artykuły techniki z autorem O. Torokhtiy (olimpijczyk, PhD nauk o sporcie) i datą; strony sklepu i programów — nie źródło | 4 | serwis specjalistyczny |
| Suchomel i in. (J Hum Kinet 2019) | Suchomel, McKeever, Sijuwade, Carpenter, McMahon, Loturco, Comfort — badanie, J Hum Kinet 2019 (użyty tylko opis wykonania) | 3 | badanie (czasopismo recenzowane) |
| inSPORTline | inSPORTline — instrukcja zestawu skrzyń plyometrycznych (producent sprzętu) | 4 | producent sprzętu |
| REP Fitness | REP Fitness — blog Training (producent sprzętu, m.in. piłek do wall ball, 2026) | 4 | producent sprzętu |
| RFL | Rugby Football League — karta ćwiczenia „Med Ball Chest Throw” (federacja, szkolenie trenerów) | 4 | organizacja szkoleniowa (biblioteka ćwiczeń) |
| World Athletics | World Athletics — Kids' Athletics, Teaching athletics (federacja, materiały szkoleniowe) | 4 | organizacja szkoleniowa (biblioteka ćwiczeń) |
| Manske, Reiman (Wichita State University, Duke University) | Manske, Reiman — przegląd testów funkcjonalnych, Sports Health 2013 | 3 | badanie (czasopismo recenzowane) |
| EliteFTS | EliteFTS — artykuły szkoleniowe (producent sanek do ciągnięcia i pchania, autorzy-trenerzy) | 4 | producent sprzętu |
| Torque Fitness | Torque Fitness — Ultimate TANK Training Guide (producent sanek do pchania i ciągnięcia) | 4 | producent sprzętu |
| StrongFirst | StrongFirst — standardy i artykuły szkoły instruktorów kettlebell (strongfirst.com) | 4 | organizacja szkoleniowa (biblioteka ćwiczeń) |
| AAOS | AAOS (OrthoInfo) | 4 | serwis specjalistyczny |
| Arthritis Foundation | Arthritis Foundation | 4 | serwis specjalistyczny |
| WebMD Ignite | WebMD Ignite (Healthwise, StayWell, Krames) — materiały dla pacjentów na stronach placówek medycznych, z datą | 4 | serwis specjalistyczny |
| Athletico Physical Therapy | Athletico Physical Therapy | 4 | serwis specjalistyczny |
| Advocate Aurora Health | Advocate Aurora Health | 4 | serwis specjalistyczny |
| Cleveland Clinic | Cleveland Clinic | 4 | serwis specjalistyczny |
| Connecticut Children's Sports Medicine | Connecticut Children's Sports Medicine | 4 | serwis specjalistyczny |
| Cancer Council Victoria | Cancer Council Victoria | 4 | serwis specjalistyczny |
| Covenant HealthCare | Covenant HealthCare (za zgodą Kettering Sports Medicine) | 4 | serwis specjalistyczny |
| Cambridge University Hospitals NHS FT | Cambridge University Hospitals NHS FT | 4 | serwis specjalistyczny |
| Duke University Health System, Occupational and Environmental Safety Office | Duke University Health System, Occupational and Environmental Safety Office | 4 | serwis specjalistyczny |
| East Carolina University Physical Therapy Clinic | East Carolina University Physical Therapy Clinic (Home Exercise Program) | 4 | serwis specjalistyczny |
| Huntsman Cancer Institute, University of Utah Health | Huntsman Cancer Institute, University of Utah Health | 4 | serwis specjalistyczny |
| Health and Wellbeing Queensland | Health and Wellbeing Queensland | 4 | serwis specjalistyczny |
| Leeds Teaching Hospitals NHS Trust, Physiotherapy Department | Leeds Teaching Hospitals NHS Trust, Physiotherapy Department (treść licencjonowana Physiotec) | 4 | serwis specjalistyczny |
| Livewell Southwest | Livewell Southwest (NHS, Podiatry Services) | 4 | serwis specjalistyczny |
| MedlinePlus | MedlinePlus (U.S. National Library of Medicine) | 4 | serwis specjalistyczny |
| NHS (nhs.uk) | NHS (nhs.uk) | 4 | serwis specjalistyczny |
| Shropshire Community Health NHS Trust | Shropshire Community Health NHS Trust (podiatria) | 4 | serwis specjalistyczny |
| South Tees Hospitals NHS Foundation Trust | South Tees Hospitals NHS Foundation Trust | 4 | serwis specjalistyczny |
| Wrightington, Wigan and Leigh Teaching Hospitals NHS FT | Wrightington, Wigan and Leigh Teaching Hospitals NHS FT (fizjoterapia MSK) | 4 | serwis specjalistyczny |
| OrthoBethesda Therapy Services | OrthoBethesda Therapy Services | 4 | serwis specjalistyczny |
| OrthoIndy Physical Therapy | OrthoIndy Physical Therapy | 4 | serwis specjalistyczny |
| Ohio State University Wexner Medical Center | Ohio State University Wexner Medical Center | 4 | serwis specjalistyczny |
| UC Berkeley University Health Services | UC Berkeley University Health Services (Be Well at Work) | 4 | serwis specjalistyczny |
| UW Medicine | UW Medicine | 4 | serwis specjalistyczny |
| YogaUOnline | YogaUOnline (prezentacja: J. Gudmestad, fizjoterapeutka) | 4 | serwis specjalistyczny |
| free-exercise-db | free-exercise-db — otwarty zbiór opisów ćwiczeń (github.com/yuhonas) | 5 | serwis specjalistyczny |
| Tomah Memorial Hospital | Tomah Memorial Hospital, Dept. of Physical Therapy — wideo ćwiczenia w MSD Manuals (msdmanuals.com) | 4 | serwis specjalistyczny |
| ISSA | International Sports Sciences Association — blog szkoleniowy (issaonline.com) | 4 | organizacja szkoleniowa (biblioteka ćwiczeń) |
| Bodylastics | Bodylastics — instrukcje ćwiczeń z taśmami (producent taśm; bodylastics.com) | 4 | producent sprzętu |
| Fitness Volt | Fitness Volt — artykuły o ćwiczeniach (fitnessvolt.com) | 4 | serwis specjalistyczny |
| Atlas ćwiczeń potreningu.pl | Atlas ćwiczeń (potreningu.pl; grupa SFD) | 5 | serwis specjalistyczny |
| ManiacMuscle | ManiacMuscle — opisy ćwiczeń (maniacmuscle.com) | 5 | serwis specjalistyczny |
| Atlas ćwiczeń Fabryka Siły | Atlas ćwiczeń Fabryka Siły (fabrykasily.pl) | 5 | serwis specjalistyczny |
| weighttraining.guide | weighttraining.guide — opisy ćwiczeń | 5 | serwis specjalistyczny |
| FitVibe | FitVibe — ćwiczenia (fitvibe.gr) | 5 | serwis specjalistyczny |
| NFPT | National Federation of Professional Trainers — blog szkoleniowy (nfpt.com) | 4 | organizacja szkoleniowa (biblioteka ćwiczeń) |
| Fitnall | Fitnall — opisy ćwiczeń (fitnall.com) | 5 | serwis specjalistyczny |
| SET FOR SET | SET FOR SET — blog sprzedawcy sanek (setforset.com) | 5 | serwis specjalistyczny |
| Atlas ćwiczeń Centrum Respo | Atlas ćwiczeń Centrum Respo (centrumrespo.pl) | 5 | serwis specjalistyczny |
| app-s1 | app-s1 | 5 | ? |
| app-s2 | app-s2 | 5 | ? |
| app-s3 | app-s3 | 5 | ? |
| app-s4 | app-s4 | 5 | ? |
| app-s5 | app-s5 | 5 | ? |
| app-s6 | app-s6 | 5 | ? |
| app-s7 | app-s7 | 5 | ? |

## Podsumowanie

- Ćwiczenia ze wskazówkami: 196; zdań (z powtórzeniami między ćwiczeniami): 870; unikalnych zdań: 537; źródeł: 412.
- Ćwiczenia bazowe bez wskazówek (otwarte): 21.
- Ćwiczenia z niepełnym zestawem sekcji (research potwierdził tylko część; braków nie dopisujemy z jednego źródła): 78 — Back Extension, Bieg, Burpees, Diamond Push Up, Farmer's Walk, Incline Walk (bieżnia), Leg Curl, Leg Extension, Medicine Ball Slam, Preacher Curl, Reverse Crunch, Rower, Seated Calf Raise, Straight Arm Pulldown, Suitcase Carry, Wall Sit, Wyciskanie na linkach (stojąc), Lunges (hantle), Walking Lunges, Reverse Lunge, Double Kettlebell Clean, Hang Clean, Block Clean, Block Power Clean, Split Clean, Clean Pull, Split Jerk, Power Jerk, Jerk Dip Squat, Jerk Balance, Muscle Snatch, Snatch Balance, Block Snatch, Split Snatch, Jump Squat, Tuck Jump, Weighted Jump Squat, Broad Jump, Alternate Leg Push-Off, Wall Ball, Medicine Ball Chest Pass, Backward Medicine Ball Throw, Standing Two-Arm Overhead Throw, Calves-SMR, Latissimus Dorsi-SMR, Piriformis-SMR, Rhomboids-SMR, Foot-SMR, External Rotation (hantel), Supine Figure-Four Stretch, Butterfly Stretch, Side-Lying Quad Stretch, Child's Pose, Supine Spinal Twist, The Straddle, Peroneals Stretch, Posterior Tibialis Stretch, Standing Soleus And Achilles Stretch, Cross-Body Shoulder Stretch, Overhead Triceps Stretch, Side Neck Stretch, Chest And Front Of Shoulder Stretch, Chin To Chest Stretch, Arm Circles, Ankle Circles, Wrist Circles, One-Arm Cable Rear Lateral Raise, Cable Reverse Fly, Cable Y Raise, One-Arm Incline Lateral Raise, Barbell Front Raise to Overhead, Sled Reverse Flye, Car Drivers, Front Incline Dumbbell Raise, Dumbbell Incline Shoulder Raise, Barbell Incline Shoulder Raise, Dumbbell Front Raise to Overhead, Straight Raises on Incline Bench.

## Otwarte — bez wskazówek

| Ćwiczenie | Powód |
|---|---|
| Decline Bench Press | wskazówki czekają na rozstrzygnięcie pytania o metodę: czy ławka płaska to wariant ławki skośnej w dół (docs/research/31, pyt. 1); jedyne źródło opisujące ławkę skośną w dół to Eleiko |
| Pec Deck | dwa źródła istnieją tylko w materiałach uczelnianych centrów sportu (HKU, Western), których szczebel (4 czy 5) jest otwarty (docs/research/33, pyt. 1) |
| Chest Dip | wspólna tylko jedna wskazówka (ruch) w źródłach McKenzie 2022 i HKU; głębokość i pozycja tułowia po jednym źródle (docs/research/33) |
| Arnold Press | brak opisu w ACE, NASM, Eleiko, HKU, Western ani w badaniach; zostają serwisy konsumenckie (odrzucone); ExRx niedostępny (docs/research/33) |
| Incline Curl (hantle) | opis niejednoznaczny (Oliveira 2009) albo sam abstrakt (Kassiano 2025); brak dwóch przeczytanych opisów (docs/research/33) |
| Concentration Curl (hantle) | jedyne źródło: ACE (ProSource 2014 i badanie ACE — ta sama organizacja); brak drugiego niezależnego (docs/research/33) |
| Spider Curl | brak źródeł szczebla do 4 (docs/research/33) |
| Skullcrusher (hantle) | brak opisu wersji z hantlami (ACE 36 opisuje sztangę) (docs/research/33) |
| Triceps Kickback | jedyne źródło: ACE 55; opis z biblioteki Human Kinetics dotyczy innego ćwiczenia (docs/research/33) |
| Box Squat | wspólna tylko jedna wskazówka (siad na skrzyni bez odbicia); szeroki rozstaw i pionowe piszczele — jedno źródło (docs/research/33) |
| Sissy Squat | brak źródeł (docs/research/33) |
| Cable Kickback | dwa źródła tylko w materiałach uczelnianych centrów sportu (HKU, Western) lub badanie maszyny; szczebel otwarty (docs/research/33, pyt. 1) |
| Hip Abduction | wspólna tylko jedna wskazówka (odwiedzenie i powrót); ACE 155 bez opisu; reszta to abstrakty bez opisu (docs/research/33) |
| Hip Adduction | oba źródła (ACE, HKU) opisują przywodzenie na wyciągu stojąc, nie maszynę; komplet zależy też od szczebla HKU (docs/research/33, pyt. 1) |
| Ab Wheel | tylko jedna wskazówka bez materiałów uczelnianych (Sussexsport); szczebel otwarty (docs/research/33, pyt. 1) |
| Hanging Leg Raise | NASM opisuje tylko progresję; źródła uczelniane niespójne (tekst i zdjęcie) (docs/research/33) |
| Hanging Knee Raise | komplet zależy od uznania materiałów uczelnianych (HKU, Western) i od wariantu z podporem przedramion (docs/research/33, pyt. 1) |
| Cable Crunch | komplet zależy od uznania Western (szczebel otwarty) i od wariantu stojącego zamiast klęcząc (docs/research/33, pyt. 1) |
| Hollow Hold | jedno źródło (Root 2019); Aube 2026 tylko nazwa (docs/research/33) |
| Assault Bike | czy rower stacjonarny to wariant roweru powietrznego z ruchomymi rączkami (jak kąt ławki) — pytanie otwarte; dokumentacji producenta nie udało się odczytać (docs/research/33, pyt. 4) |
| Skakanka | drugie źródło to organizacja spoza fitnessu (DAN), której szczebel jest otwarty (docs/research/33, pyt. 2) |

## Luki — wskazówki bez pary źródeł

Po przeliczeniu szczebli (docs/18, 02.11.2026) wskazówka ma tylko jedno źródło szczebla ≤ 4; zostaje w danych do uzupełnienia przez badacza, a lista może się tylko skracać (skrypt zgłasza lukę, która ma już parę).

| Ćwiczenie | Zdanie | Powód |
|---|---|---|
| Pendlay Row | `pendlay.setup` | drugie źródło szczebla ≤ 4 do uzupełnienia po przeliczeniu szczebli (docs/18, 02.11.2026): BarBend (4) + Breaking Muscle (5, własność BarBend) + Coach (5 per strona) |
| Pendlay Row | `pendlay.pull` | drugie źródło szczebla ≤ 4 do uzupełnienia po przeliczeniu szczebli (docs/18, 02.11.2026): BarBend (4) + Breaking Muscle (5) + Coach (5 per strona) |
| Pendlay Row | `pendlay.floor` | drugie źródło szczebla ≤ 4 do uzupełnienia po przeliczeniu szczebli (docs/18, 02.11.2026): BarBend (4) + Breaking Muscle (5) |
| Pendlay Row | `pendlay.mis.torso` | drugie źródło szczebla ≤ 4 do uzupełnienia po przeliczeniu szczebli (docs/18, 02.11.2026): BarBend (4) + Breaking Muscle (5); brak zdania ustawienia/ruchu do wniosku |
| Łydki na stopniu | `calf.step` | drugie źródło szczebla ≤ 4 do uzupełnienia po przeliczeniu szczebli (docs/18, 02.11.2026): ExRx (4) + Physitrack (5) + The Prehab Guys (5 per strona) |
| Alternating Deltoid Raise | `adr.move` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 niezależne źródła, w tym 1 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| One-Arm Cable Rear Lateral Raise | `crear1.setup` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 3 niezależne źródła, w tym 1 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| One-Arm Cable Rear Lateral Raise | `crear1.move` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 3 niezależne źródła, w tym 1 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| One-Arm Cable Rear Lateral Raise | `rdelt.mis.swing` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 niezależne źródła, w tym 0 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Cable Reverse Fly | `crf.setup` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 3 niezależne źródła, w tym 1 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Cable Reverse Fly | `crf.move` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 3 niezależne źródła, w tym 1 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Cable Y Raise | `cyr.setup` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 niezależne źródła, w tym 0 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Cable Y Raise | `cyr.move` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 niezależne źródła, w tym 0 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| One-Arm Incline Lateral Raise | `inc1.setup` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 niezależne źródła, w tym 1 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| One-Arm Incline Lateral Raise | `inc1.move` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 niezależne źródła, w tym 1 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| One-Arm Incline Lateral Raise | `inc1.mis.shrug` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): pojedyncze źródło, w tym 1 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Barbell Front Raise to Overhead | `bfro.setup` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 niezależne źródła, w tym 0 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Barbell Front Raise to Overhead | `fro.move` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 niezależne źródła, w tym 0 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Barbell Front Raise to Overhead | `fro.mis.arch` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): pojedyncze źródło, w tym 0 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Sled Reverse Flye | `srf.setup` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 niezależne źródła, w tym 0 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Sled Reverse Flye | `srf.move` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 3 niezależne źródła (w tym strona aplikacji), w tym 0 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Car Drivers | `cdr.setup` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 niezależne źródła, w tym 0 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Car Drivers | `cdr.move` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 niezależne źródła, w tym 0 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Car Drivers | `cdr.mis.drop` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): pojedyncze źródło, w tym 0 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Car Drivers | `mis.jerk` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): pojedyncze źródło, w tym 0 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Front Incline Dumbbell Raise | `fidr.setup` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 niezależne źródła, w tym 0 szczebla ≤ 4 (obie to strony aplikacji lub zbiory opisów) — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Front Incline Dumbbell Raise | `fidr.move` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 niezależne źródła, w tym 0 szczebla ≤ 4 (obie to strony aplikacji lub zbiory opisów) — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Dumbbell Incline Shoulder Raise | `isr.setupDb` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 niezależne źródła, w tym 0 szczebla ≤ 4 (obie to strony aplikacji lub zbiory opisów) — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Dumbbell Incline Shoulder Raise | `isr.move` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 niezależne źródła, w tym 0 szczebla ≤ 4 (obie to strony aplikacji lub zbiory opisów) — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Barbell Incline Shoulder Raise | `isr.setupBb` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 niezależne źródła, w tym 0 szczebla ≤ 4 (obie to strony aplikacji lub zbiory opisów) — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Barbell Incline Shoulder Raise | `isr.move` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 niezależne źródła, w tym 0 szczebla ≤ 4 (obie to strony aplikacji lub zbiory opisów) — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Dumbbell Front Raise to Overhead | `dfro.setup` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 niezależne źródła, w tym 0 szczebla ≤ 4 (obie to strony aplikacji lub zbiory opisów) — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Dumbbell Front Raise to Overhead | `fro.move` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 niezależne źródła, w tym 0 szczebla ≤ 4 (obie to strony aplikacji lub zbiory opisów) — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Straight Raises on Incline Bench | `sri.setup` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 niezależne źródła, w tym 0 szczebla ≤ 4 (obie to strony aplikacji lub zbiory opisów) — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Straight Raises on Incline Bench | `sri.move` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 niezależne źródła, w tym 0 szczebla ≤ 4 (obie to strony aplikacji lub zbiory opisów) — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Dumbbell Incline Shoulder Raise | `isr.mis.press` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 niezależne źródła, w tym 0 szczebla ≤ 4 (obie to strony aplikacji lub zbiory opisów) — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Front Incline Dumbbell Raise | `fidr.mis.back` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 niezależne źródła, w tym 0 szczebla ≤ 4 (obie to strony aplikacji lub zbiory opisów) — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Barbell Incline Shoulder Raise | `isr.mis.press` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 niezależne źródła, w tym 0 szczebla ≤ 4 (obie to strony aplikacji lub zbiory opisów) — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Straight Raises on Incline Bench | `yr.mis.chest` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 niezależne źródła, w tym 0 szczebla ≤ 4 (obie to strony aplikacji lub zbiory opisów) — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Dumbbell Front Raise to Overhead | `fro.mis.arch` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 niezależne źródła, w tym 0 szczebla ≤ 4 (obie to strony aplikacji lub zbiory opisów) — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Dumbbell Front Raise to Overhead | `mis.jerk` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 niezależne źródła, w tym 0 szczebla ≤ 4 (obie to strony aplikacji lub zbiory opisów) — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |

## Wskazówki i źródła

### Deadlift (sztanga)

**Ustawienie**

- Stopy pod sztangą, mniej więcej na szerokość bioder do barków; sztanga tuż przy piszczelach, nad środkiem stopy. — ACE: [Deadlift (#6)](https://www.acefitness.org/resources/everyone/exercise-library/6/deadlift/) (opis); NASM: [Barbell Deadlift](https://www.nasm.org/resource-center/exercise-library/barbell-deadlift) (Step 1: Setup); ExRx.net: [BBDeadlift](https://web.archive.org/web/20221218023338/https://exrx.net/WeightExercises/ErectorSpinae/BBDeadlift) (Preparation) `dl.feet`
- Chwyć sztangę nachwytem albo chwytem mieszanym, na szerokość barków lub trochę szerzej. — ACE: [Deadlift (#6)](https://www.acefitness.org/resources/everyone/exercise-library/6/deadlift/) (opis); NASM: [Barbell Deadlift](https://www.nasm.org/resource-center/exercise-library/barbell-deadlift) (Step 1: Setup; FAQ (grip options)); ExRx.net: [BBDeadlift](https://web.archive.org/web/20221218023338/https://exrx.net/WeightExercises/ErectorSpinae/BBDeadlift) (Preparation; Comments) `dl.grip`

**Ruch**

- Podnoś, prostując jednocześnie biodra i kolana; na górze stań prosto, z biodrami w przód. — ACE: [Deadlift (#6)](https://www.acefitness.org/resources/everyone/exercise-library/6/deadlift/) (opis); NASM: [Barbell Deadlift](https://www.nasm.org/resource-center/exercise-library/barbell-deadlift) (Step 3: Execute/Drive); ExRx.net: [BBDeadlift](https://web.archive.org/web/20221218023338/https://exrx.net/WeightExercises/ErectorSpinae/BBDeadlift) (Execution) `dl.lift`
- Odkładaj sztangę tak samo: biodra w tył, kolana się uginają, plecy proste. — ACE: [Deadlift (#6)](https://www.acefitness.org/resources/everyone/exercise-library/6/deadlift/) (opis); NASM: [Barbell Deadlift](https://www.nasm.org/resource-center/exercise-library/barbell-deadlift) (Step 4: Return/Descent) `dl.lower`

**Wskazówki**

- Plecy proste (neutralne) przez cały ruch — bez zaokrąglania. — ACE: [Deadlift (#6)](https://www.acefitness.org/resources/everyone/exercise-library/6/deadlift/) (opis (straight/flat back)); NASM: [Barbell Deadlift](https://www.nasm.org/resource-center/exercise-library/barbell-deadlift) (Step 3; Step 4 (neutral spine)); ExRx.net: [BBDeadlift](https://web.archive.org/web/20221218023338/https://exrx.net/WeightExercises/ErectorSpinae/BBDeadlift) (Comments (back straight)) `hinge.back`
- Prowadź sztangę blisko nóg przez cały ruch. — ExRx.net: [BBDeadlift](https://web.archive.org/web/20221218023338/https://exrx.net/WeightExercises/ErectorSpinae/BBDeadlift) (Comments (keep bar close to body)); NASM: [Barbell Deadlift](https://www.nasm.org/resource-center/exercise-library/barbell-deadlift) (Common Mistakes (bar drifting away)); Stronger by Science: [How to Deadlift: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-deadlift/) (Bar Path) `dl.close`
- Na starcie barki mniej więcej nad sztangą, ręce proste. — NASM: [Barbell Deadlift](https://www.nasm.org/resource-center/exercise-library/barbell-deadlift) (Step 2 (shoulders over the bar)); ExRx.net: [BBDeadlift](https://web.archive.org/web/20221218023338/https://exrx.net/WeightExercises/ErectorSpinae/BBDeadlift) (Comments (shoulder slightly behind bar in powerlifting… arms straight)); Stronger by Science: [How to Deadlift: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-deadlift/) (Bar Path (bar a bit behind the shoulder)) `dl.hipsLow`

**Czego unikać**

- Zaokrąglanie pleców, żeby dociągnąć ciężar. — NASM: [Barbell Deadlift](https://www.nasm.org/resource-center/exercise-library/barbell-deadlift) (Common Mistakes (excessive spinal flexion)); ACE: [Deadlift (#6)](https://www.acefitness.org/resources/everyone/exercise-library/6/deadlift/) (opis (keep back flat)) `mis.roundBack`
- Sztanga odjeżdża od ciała. — NASM: [Barbell Deadlift](https://www.nasm.org/resource-center/exercise-library/barbell-deadlift) (Common Mistakes); ExRx.net: [BBDeadlift](https://web.archive.org/web/20221218023338/https://exrx.net/WeightExercises/ErectorSpinae/BBDeadlift) (Comments) `mis.barAway`

### Sumo Deadlift

**Ustawienie**

- Stań szeroko — stopy na zewnątrz dłoni, palce i kolana skierowane w tę samą stronę, na zewnątrz. — ExRx.net: [BBSumoDeadlift](https://web.archive.org/web/20230530074021/https://exrx.net/WeightExercises/ErectorSpinae/BBSumoDeadlift) (Preparation; Comments); Stronger by Science: [How to Deadlift: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-deadlift/) (Stance Width: Sumo Contrast) `sumo.stance`
- Chwyć sztangę między nogami, mniej więcej na szerokość barków. — ExRx.net: [BBSumoDeadlift](https://web.archive.org/web/20230530074021/https://exrx.net/WeightExercises/ErectorSpinae/BBSumoDeadlift) (Preparation; Comments (shoulder width grip)); Stronger by Science: [How to Deadlift: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-deadlift/) (Grip: Sumo Contrast (hands below shoulders)) `sumo.grip`

**Ruch**

- Podnoś, prostując biodra i kolana; na górze stań prosto, klatka wysoko. — ExRx.net: [BBSumoDeadlift](https://web.archive.org/web/20230530074021/https://exrx.net/WeightExercises/ErectorSpinae/BBSumoDeadlift) (Execution); Stronger by Science: [How to Deadlift: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-deadlift/) (Locking out) `sumo.lift`

**Wskazówki**

- Ruszając z podłogi, wypychaj kolana na zewnątrz, w linii palców stóp. — ExRx.net: [BBSumoDeadlift](https://web.archive.org/web/20230530074021/https://exrx.net/WeightExercises/ErectorSpinae/BBSumoDeadlift) (Comments (push feet out, knees pointed out)); Stronger by Science: [How to Deadlift: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-deadlift/) (Performing the pull: Sumo Contrast) `sumo.kneesOut`
- Plecy proste (neutralne) przez cały ruch — bez zaokrąglania. — ExRx.net: [BBSumoDeadlift](https://web.archive.org/web/20230530074021/https://exrx.net/WeightExercises/ErectorSpinae/BBSumoDeadlift) (Preparation; Comments (back straight)); Stronger by Science: [How to Deadlift: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-deadlift/) (Lowering under control (spine extended)) `hinge.back`
- Prowadź sztangę blisko nóg przez cały ruch. — ExRx.net: [BBSumoDeadlift](https://web.archive.org/web/20230530074021/https://exrx.net/WeightExercises/ErectorSpinae/BBSumoDeadlift) (Comments (keep bar close to body)); Stronger by Science: [How to Deadlift: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-deadlift/) (Bar Path) `dl.close`

### Trap Bar Deadlift

**Ustawienie**

- Stań w środku ramy sztangi i chwyć uchwyty po bokach. — ExRx.net: [TBDeadlift](https://web.archive.org/web/20210506155208/https://exrx.net/WeightExercises/ErectorSpinae/TBDeadlift) (Preparation); Swinton i in. (Robert Gordon University): [Swinton i in. 2011, A biomechanical analysis of straight and hexagonal barbell deadlifts…, J Strength Cond Res 25(7) — abstrakt](https://pubmed.ncbi.nlm.nih.gov/21659894/) (abstrakt (hexagonal barbell that allowed the lifter to stand within its frame)) `tb.inside`

**Ruch**

- Podnoś, prostując jednocześnie biodra i kolana, aż staniesz prosto. — ExRx.net: [TBDeadlift](https://web.archive.org/web/20210506155208/https://exrx.net/WeightExercises/ErectorSpinae/TBDeadlift) (Execution); NASM: [Barbell Deadlift](https://www.nasm.org/resource-center/exercise-library/barbell-deadlift) (Step 3: Execute/Drive (extend hips and knees simultaneously)) `tb.lift`

**Wskazówki**

- Plecy proste (neutralne) przez cały ruch — bez zaokrąglania. — ExRx.net: [TBDeadlift](https://web.archive.org/web/20210506155208/https://exrx.net/WeightExercises/ErectorSpinae/TBDeadlift) (Preparation; Comments (low back taut, back straight)); NASM: [Barbell Deadlift](https://www.nasm.org/resource-center/exercise-library/barbell-deadlift) (Step 3; Step 4 (neutral spine)) `hinge.back`
- Na starcie barki mniej więcej nad sztangą, ręce proste. — ExRx.net: [TBDeadlift](https://web.archive.org/web/20210506155208/https://exrx.net/WeightExercises/ErectorSpinae/TBDeadlift) (Comments (shoulders high, arms straight)); NASM: [Barbell Deadlift](https://www.nasm.org/resource-center/exercise-library/barbell-deadlift) (Step 2 (shoulders over the bar)) `dl.hipsLow`

**Czego unikać**

- Zaokrąglanie pleców, żeby dociągnąć ciężar. — NASM: [Barbell Deadlift](https://www.nasm.org/resource-center/exercise-library/barbell-deadlift) (Common Mistakes (excessive spinal flexion)); ExRx.net: [TBDeadlift](https://web.archive.org/web/20210506155208/https://exrx.net/WeightExercises/ErectorSpinae/TBDeadlift) (Comments (back straight)) `mis.roundBack`

### Bent Over Row (sztanga)

**Ustawienie**

- Pochyl tułów w biodrach przy lekko ugiętych kolanach; plecy proste. — ACE: [Bent Over Row (#12)](https://www.acefitness.org/resources/everyone/exercise-library/12/bent-over-row/) (opis); ExRx.net: [BBBentOverRow](https://web.archive.org/web/20230227195843/https://exrx.net/WeightExercises/BackGeneral/BBBentOverRow) (Preparation) `row.hinge`
- Chwyć sztangę nachwytem, na szerokość barków lub szerzej. — ACE: [Bent Over Row (#12)](https://www.acefitness.org/resources/everyone/exercise-library/12/bent-over-row/) (opis (palms down; wrists, elbows and shoulders in line)); ExRx.net: [BBBentOverRow](https://web.archive.org/web/20230227195843/https://exrx.net/WeightExercises/BackGeneral/BBBentOverRow) (Preparation; Comments (wide or shoulder-width grip)) `row.bbGrip`

**Ruch**

- Przyciągnij sztangę do brzucha, potem opuść ją do pełnego wyprostu rąk. — ACE: [Bent Over Row (#12)](https://www.acefitness.org/resources/everyone/exercise-library/12/bent-over-row/) (opis (towards the belly button)); ExRx.net: [BBBentOverRow](https://web.archive.org/web/20230227195843/https://exrx.net/WeightExercises/BackGeneral/BBBentOverRow) (Execution (to upper waist)) `row.bbPull`

**Wskazówki**

- Plecy proste (neutralne) przez cały ruch — bez zaokrąglania. — ACE: [Bent Over Row (#12)](https://www.acefitness.org/resources/everyone/exercise-library/12/bent-over-row/) (opis (back straight/flat)); ExRx.net: [BBBentOverRow](https://web.archive.org/web/20230227195843/https://exrx.net/WeightExercises/BackGeneral/BBBentOverRow) (Comments (low back straight)) `hinge.back`
- Na dole wyprostuj ręce do końca, barki swobodnie w dół. — ACE: [Bent Over Row (#12)](https://www.acefitness.org/resources/everyone/exercise-library/12/bent-over-row/) (opis (until the elbows are completely straight)); ExRx.net: [BBBentOverRow](https://web.archive.org/web/20230227195843/https://exrx.net/WeightExercises/BackGeneral/BBBentOverRow) (Execution (arms extended, shoulders stretched downward)) `row.fullStretch`

**Czego unikać**

- Zaokrąglanie pleców, żeby dociągnąć ciężar. — ExRx.net: [BBBentOverRow](https://web.archive.org/web/20230227195843/https://exrx.net/WeightExercises/BackGeneral/BBBentOverRow) (Comments (low back rounded due to poor form)); ACE: [Bent Over Row (#12)](https://www.acefitness.org/resources/everyone/exercise-library/12/bent-over-row/) (opis (keep the back flat)) `mis.roundBack`

### Bent Over Row (hantle)

**Ustawienie**

- Pochyl tułów w biodrach przy lekko ugiętych kolanach; plecy proste. — ACE: [Bent Over Row (#12)](https://www.acefitness.org/resources/everyone/exercise-library/12/bent-over-row/) (opis (sztanga — ten sam wzorzec)); ExRx.net: [BBBentOverRow](https://web.archive.org/web/20230227195843/https://exrx.net/WeightExercises/BackGeneral/BBBentOverRow) (Preparation (sztanga — ten sam wzorzec)) `row.hinge`

**Ruch**

- Przyciągnij hantle do brzucha, potem opuść je do pełnego wyprostu rąk. — ACE: [Bent Over Row (#12)](https://www.acefitness.org/resources/everyone/exercise-library/12/bent-over-row/) (opis (towards the belly button)); ExRx.net: [BBBentOverRow](https://web.archive.org/web/20230227195843/https://exrx.net/WeightExercises/BackGeneral/BBBentOverRow) (Execution (to upper waist)) `row.dbPull`

**Wskazówki**

- Plecy proste (neutralne) przez cały ruch — bez zaokrąglania. — ACE: [Bent Over Row (#12)](https://www.acefitness.org/resources/everyone/exercise-library/12/bent-over-row/) (opis (back straight/flat)); ExRx.net: [BBBentOverRow](https://web.archive.org/web/20230227195843/https://exrx.net/WeightExercises/BackGeneral/BBBentOverRow) (Comments (low back straight)) `hinge.back`
- Na dole wyprostuj ręce do końca, barki swobodnie w dół. — ACE: [Bent Over Row (#12)](https://www.acefitness.org/resources/everyone/exercise-library/12/bent-over-row/) (opis (until the elbows are completely straight)); ExRx.net: [BBBentOverRow](https://web.archive.org/web/20230227195843/https://exrx.net/WeightExercises/BackGeneral/BBBentOverRow) (Execution (arms extended, shoulders stretched downward)) `row.fullStretch`

**Czego unikać**

- Zaokrąglanie pleców, żeby dociągnąć ciężar. — ExRx.net: [BBBentOverRow](https://web.archive.org/web/20230227195843/https://exrx.net/WeightExercises/BackGeneral/BBBentOverRow) (Comments (low back rounded due to poor form)); ACE: [Bent Over Row (#12)](https://www.acefitness.org/resources/everyone/exercise-library/12/bent-over-row/) (opis (keep the back flat)) `mis.roundBack`

### Pendlay Row

**Ustawienie**

- Sztanga leży na podłodze. Pochyl tułów prawie równolegle do podłogi, kolana lekko ugięte, plecy proste. — BarBend: [Pendlay Row](https://barbend.com/Pendlay-row/) (How to, Step 1 (barbell on the floor); FAQ (back roughly parallel to the floor)); Breaking Muscle: [Pendlay Row](https://breakingmuscle.com/pendlay-row/) (szczebel 5 — nie liczy się do pary; Step 1 (slight bend in the knees, upper body parallel to the ground)); Coach: [How To Do The Pendlay Row](https://www.coachweb.com/back-exercises/7785/how-to-do-the-pendlay-row) (szczebel 5 — nie liczy się do pary; How To (knees slightly bent, neutral spine; kąt tułowia w źródle 20–30° — część wspólna: prawie równolegle)) `pendlay.setup`
- Chwyć sztangę nachwytem, na szerokość barków lub szerzej. — ACE: [Bent Over Row (#12)](https://www.acefitness.org/resources/everyone/exercise-library/12/bent-over-row/) (opis); ExRx.net: [BBBentOverRow](https://web.archive.org/web/20230227195843/https://exrx.net/WeightExercises/BackGeneral/BBBentOverRow) (Preparation) `row.bbGrip`

**Ruch**

- Dynamicznie przyciągnij sztangę do dolnej części klatki albo brzucha, potem odłóż ją na podłogę. — BarBend: [Pendlay Row](https://barbend.com/Pendlay-row/) (How to, Step 2 (explosively pull the barbell to the base of the chest)); Breaking Muscle: [Pendlay Row](https://breakingmuscle.com/pendlay-row/) (szczebel 5 — nie liczy się do pary; Step 2 (explosive pull; bar touches lower chest or upper abdomen, then returns to the ground)); Coach: [How To Do The Pendlay Row](https://www.coachweb.com/back-exercises/7785/how-to-do-the-pendlay-row) (szczebel 5 — nie liczy się do pary; How To (explosively pull the bar towards the stomach)) `pendlay.pull`

**Wskazówki**

- Każde powtórzenie zaczynaj od sztangi nieruchomej na podłodze. — BarBend: [Pendlay Row](https://barbend.com/Pendlay-row/) (Benefits (each rep is done from a dead stop on the floor)); Breaking Muscle: [Pendlay Row](https://breakingmuscle.com/pendlay-row/) (szczebel 5 — nie liczy się do pary; Step 2 (complete rest on the ground before the next rep); Mistakes — Bouncing Off the Floor) `pendlay.floor`
- Plecy proste (neutralne) przez cały ruch — bez zaokrąglania. — ACE: [Bent Over Row (#12)](https://www.acefitness.org/resources/everyone/exercise-library/12/bent-over-row/) (opis); ExRx.net: [BBBentOverRow](https://web.archive.org/web/20230227195843/https://exrx.net/WeightExercises/BackGeneral/BBBentOverRow) (Comments); Coach: [How To Do The Pendlay Row](https://www.coachweb.com/back-exercises/7785/how-to-do-the-pendlay-row) (szczebel 5 — nie liczy się do pary; How To (neutral spine, hinged at the hips with knees slightly bent)) `hinge.back`

**Czego unikać**

- Unoszenie tułowia przy przyciąganiu. — BarBend: [Pendlay Row](https://barbend.com/Pendlay-row/) (Common Mistakes — Back Angle (rising during the pull)); Breaking Muscle: [Pendlay Row](https://breakingmuscle.com/pendlay-row/) (szczebel 5 — nie liczy się do pary; Mistakes — Moving Your Upper Body (maintain a strict parallel position)) `pendlay.mis.torso`
- Zaokrąglanie pleców, żeby dociągnąć ciężar. — ExRx.net: [BBBentOverRow](https://web.archive.org/web/20230227195843/https://exrx.net/WeightExercises/BackGeneral/BBBentOverRow) (Comments); ACE: [Bent Over Row (#12)](https://www.acefitness.org/resources/everyone/exercise-library/12/bent-over-row/) (opis) `mis.roundBack`

### One Arm Row (hantle)

**Ustawienie**

- Oprzyj kolano i dłoń jednej strony na ławce; tułów mniej więcej równolegle do podłogi, plecy proste. — ACE: [Single Arm Row (#126)](https://www.acefitness.org/resources/everyone/exercise-library/126/single-arm-row/) (Step 1); ExRx.net: [DBBentOverRow](https://web.archive.org/web/20221218023644/https://exrx.net/WeightExercises/BackGeneral/DBBentOverRow) (Preparation; Comments (torso close to horizontal)) `row1.bench`

**Ruch**

- Ciągnij hantel w górę wzdłuż boku, łokciem w tył; opuść do pełnego wyprostu ręki. — ACE: [Single Arm Row (#126)](https://www.acefitness.org/resources/everyone/exercise-library/126/single-arm-row/) (Step 2; Step 3); ExRx.net: [DBBentOverRow](https://web.archive.org/web/20221218023644/https://exrx.net/WeightExercises/BackGeneral/DBBentOverRow) (Execution) `row1.pull`

**Wskazówki**

- Nie skręcaj tułowia, żeby podrzucić hantel. — ACE: [Single Arm Row (#126)](https://www.acefitness.org/resources/everyone/exercise-library/126/single-arm-row/) (Step 2 (avoid rotating your body)); ExRx.net: [DBBentOverRow](https://web.archive.org/web/20221218023644/https://exrx.net/WeightExercises/BackGeneral/DBBentOverRow) (Comments (do not rotate torso)) `row1.noTwist`
- Ciągnij, aż ramię minie linię tułowia. — ACE: [Single Arm Row (#126)](https://www.acefitness.org/resources/everyone/exercise-library/126/single-arm-row/) (Step 2 (pulling your upper arm backwards)); ExRx.net: [DBBentOverRow](https://web.archive.org/web/20221218023644/https://exrx.net/WeightExercises/BackGeneral/DBBentOverRow) (Execution (upper arm just beyond horizontal)) `row1.top`
- Na dole wyprostuj ręce do końca, barki swobodnie w dół. — ACE: [Single Arm Row (#126)](https://www.acefitness.org/resources/everyone/exercise-library/126/single-arm-row/) (Step 1 (extend your arm towards the floor)); ExRx.net: [DBBentOverRow](https://web.archive.org/web/20221218023644/https://exrx.net/WeightExercises/BackGeneral/DBBentOverRow) (Execution (shoulder stretched downward)) `row.fullStretch`

### Chest Supported Row

**Ustawienie**

- Oprzyj klatkę piersiową o podporę i trzymaj ją tam przez cały ruch. — ExRx.net: [DBInclineRow](https://web.archive.org/web/20220831072134/https://exrx.net/WeightExercises/BackGeneral/DBInclineRow) (Preparation (lie chest down)); ACE: [Seated Row (#168)](https://www.acefitness.org/resources/everyone/exercise-library/168/seated-row/) (Step 1; Step 2 (chest against the chest pad)) `csr.chest`

**Ruch**

- Ciągnij łokcie w tył wzdłuż tułowia, potem wyprostuj ręce do końca. — ExRx.net: [DBInclineRow](https://web.archive.org/web/20220831072134/https://exrx.net/WeightExercises/BackGeneral/DBInclineRow) (Execution); ACE: [Seated Row (#168)](https://www.acefitness.org/resources/everyone/exercise-library/168/seated-row/) (Step 2; Step 3) `csr.pull`

**Wskazówki**

- Ciągnij, aż łokcie miną linię pleców. — ExRx.net: [DBInclineRow](https://web.archive.org/web/20220831072134/https://exrx.net/WeightExercises/BackGeneral/DBInclineRow) (Execution (upper arm just beyond height of back)); ACE: [Seated Row (#168)](https://www.acefitness.org/resources/everyone/exercise-library/168/seated-row/) (Step 3 (until your elbows pass the sides of your body)) `row.elbowsPast`
- Na dole wyprostuj ręce do końca, barki swobodnie w dół. — ExRx.net: [DBLyingRow](https://web.archive.org/web/20230531232843/https://exrx.net/WeightExercises/BackGeneral/DBLyingRow) (Execution (arms extended, shoulders stretched downward)); ACE: [Seated Row (#168)](https://www.acefitness.org/resources/everyone/exercise-library/168/seated-row/) (Step 3 (stopping when your arms are fully extended)) `row.fullStretch`

### T-Bar Row

**Ustawienie**

- Pochyl tułów w biodrach przy lekko ugiętych kolanach; plecy proste. — ExRx.net: [LVTBarRow](https://web.archive.org/web/20250118124947/https://exrx.net/WeightExercises/BackGeneral/LVTBarRow) (Preparation); ACE: [Bent Over Row (#12)](https://www.acefitness.org/resources/everyone/exercise-library/12/bent-over-row/) (opis (wiosłowanie w opadzie — ten sam wzorzec)) `row.hinge`

**Ruch**

- Przyciągnij uchwyty do tułowia, potem opuść do pełnego wyprostu rąk. — ExRx.net: [LVTBarRow](https://web.archive.org/web/20250118124947/https://exrx.net/WeightExercises/BackGeneral/LVTBarRow) (Execution); ACE: [Bent Over Row (#12)](https://www.acefitness.org/resources/everyone/exercise-library/12/bent-over-row/) (opis (wiosłowanie w opadzie — ten sam wzorzec)) `tbar.pull`

**Wskazówki**

- Plecy proste (neutralne) przez cały ruch — bez zaokrąglania. — ExRx.net: [LVTBarRow](https://web.archive.org/web/20250118124947/https://exrx.net/WeightExercises/BackGeneral/LVTBarRow) (Comments (keep low back straight)); ACE: [Bent Over Row (#12)](https://www.acefitness.org/resources/everyone/exercise-library/12/bent-over-row/) (opis) `hinge.back`
- Na dole wyprostuj ręce do końca, barki swobodnie w dół. — ExRx.net: [LVTBarRowLM](https://web.archive.org/web/20190824065349/https://www.exrx.net/WeightExercises/BackGeneral/LVTBarRowLM) (Execution; Comments (full arm extension)); ACE: [Bent Over Row (#12)](https://www.acefitness.org/resources/everyone/exercise-library/12/bent-over-row/) (opis) `row.fullStretch`

**Czego unikać**

- Zaokrąglanie pleców, żeby dociągnąć ciężar. — ExRx.net: [LVTBarRow](https://web.archive.org/web/20250118124947/https://exrx.net/WeightExercises/BackGeneral/LVTBarRow) (Comments); ACE: [Bent Over Row (#12)](https://www.acefitness.org/resources/everyone/exercise-library/12/bent-over-row/) (opis) `mis.roundBack`

### Seated Cable Row

**Ustawienie**

- Usiądź, oprzyj stopy, kolana lekko ugięte, plecy wyprostowane. — ACE: [Seated Row (#48)](https://www.acefitness.org/resources/everyone/exercise-library/48/seated-row/) (opis); ExRx.net: [CBSeatedRow](https://web.archive.org/web/20220816182625/https://exrx.net/WeightExercises/BackGeneral/CBSeatedRow) (Preparation) `scr.sit`

**Ruch**

- Przyciągnij uchwyt do brzucha, łokcie blisko tułowia; wróć do wyprostu rąk. — ACE: [Seated Row (#48)](https://www.acefitness.org/resources/everyone/exercise-library/48/seated-row/) (opis); ExRx.net: [CBSeatedRow](https://web.archive.org/web/20220816182625/https://exrx.net/WeightExercises/BackGeneral/CBSeatedRow) (Execution); NASM: [Seated Machine Row Close Grip](https://www.nasm.org/resource-center/exercise-library/seated-machine-row-close-grip) (Step 3; Step 4) `scr.pull`

**Wskazówki**

- Na końcu ruchu klatka do przodu, łopatki ściągnięte w tył. — ACE: [Seated Row (#48)](https://www.acefitness.org/resources/everyone/exercise-library/48/seated-row/) (opis (lift the chest)); ExRx.net: [CBSeatedRow](https://web.archive.org/web/20220816182625/https://exrx.net/WeightExercises/BackGeneral/CBSeatedRow) (Execution (shoulders back, chest forward)); NASM: [Seated Machine Row Close Grip](https://www.nasm.org/resource-center/exercise-library/seated-machine-row-close-grip) (Step 3 (retracting your shoulder blades)) `scr.chest`
- Wracaj powoli, bez odbijania ciężaru na końcu. — ACE: [Seated Row (#48)](https://www.acefitness.org/resources/everyone/exercise-library/48/seated-row/) (opis (slowly straightening the arms)); ExRx.net: [CBSeatedRow](https://web.archive.org/web/20220816182625/https://exrx.net/WeightExercises/BackGeneral/CBSeatedRow) (Comments (do not pause or bounce at bottom)); NASM: [Seated Machine Row Close Grip](https://www.nasm.org/resource-center/exercise-library/seated-machine-row-close-grip) (Step 4 (with control)) `scr.control`

**Czego unikać**

- Szarpanie i rzucanie ciężarem zamiast kontrolowanego ruchu. — NASM: [Seated Machine Row Close Grip](https://www.nasm.org/resource-center/exercise-library/seated-machine-row-close-grip) (Common Mistakes (jerky movements, momentum)); ExRx.net: [CBSeatedRow](https://web.archive.org/web/20220816182625/https://exrx.net/WeightExercises/BackGeneral/CBSeatedRow) (Comments (do not bounce)) `mis.jerk`

### Wiosłowanie na linkach (siedząc)

**Ustawienie**

- Usiądź, oprzyj stopy, kolana lekko ugięte, plecy wyprostowane. — ACE: [Seated Row (#48)](https://www.acefitness.org/resources/everyone/exercise-library/48/seated-row/) (opis); ExRx.net: [CBSeatedRow](https://web.archive.org/web/20220816182625/https://exrx.net/WeightExercises/BackGeneral/CBSeatedRow) (Preparation) `scr.sit`

**Ruch**

- Przyciągnij uchwyt do brzucha, łokcie blisko tułowia; wróć do wyprostu rąk. — ACE: [Seated Row (#48)](https://www.acefitness.org/resources/everyone/exercise-library/48/seated-row/) (opis); ExRx.net: [CBSeatedRow](https://web.archive.org/web/20220816182625/https://exrx.net/WeightExercises/BackGeneral/CBSeatedRow) (Execution); NASM: [Seated Machine Row Close Grip](https://www.nasm.org/resource-center/exercise-library/seated-machine-row-close-grip) (Step 3; Step 4) `scr.pull`

**Wskazówki**

- Na końcu ruchu klatka do przodu, łopatki ściągnięte w tył. — ACE: [Seated Row (#48)](https://www.acefitness.org/resources/everyone/exercise-library/48/seated-row/) (opis (lift the chest)); ExRx.net: [CBSeatedRow](https://web.archive.org/web/20220816182625/https://exrx.net/WeightExercises/BackGeneral/CBSeatedRow) (Execution (shoulders back, chest forward)); NASM: [Seated Machine Row Close Grip](https://www.nasm.org/resource-center/exercise-library/seated-machine-row-close-grip) (Step 3 (retracting your shoulder blades)) `scr.chest`
- Wracaj powoli, bez odbijania ciężaru na końcu. — ACE: [Seated Row (#48)](https://www.acefitness.org/resources/everyone/exercise-library/48/seated-row/) (opis (slowly straightening the arms)); ExRx.net: [CBSeatedRow](https://web.archive.org/web/20220816182625/https://exrx.net/WeightExercises/BackGeneral/CBSeatedRow) (Comments (do not pause or bounce at bottom)); NASM: [Seated Machine Row Close Grip](https://www.nasm.org/resource-center/exercise-library/seated-machine-row-close-grip) (Step 4 (with control)) `scr.control`

**Czego unikać**

- Szarpanie i rzucanie ciężarem zamiast kontrolowanego ruchu. — NASM: [Seated Machine Row Close Grip](https://www.nasm.org/resource-center/exercise-library/seated-machine-row-close-grip) (Common Mistakes (jerky movements, momentum)); ExRx.net: [CBSeatedRow](https://web.archive.org/web/20220816182625/https://exrx.net/WeightExercises/BackGeneral/CBSeatedRow) (Comments (do not bounce)) `mis.jerk`

### Inverted Row

**Ustawienie**

- Złap drążek lub uchwyty nad sobą, ciało wyprostowane od głowy do pięt. — ExRx.net: [BWSupineRow](https://web.archive.org/web/20250510042620/https://exrx.net/WeightExercises/BackGeneral/BWSupineRow) (Preparation; Execution (keeping body straight)); ACE: [Trx Reg Back Row (#84)](https://www.acefitness.org/resources/everyone/exercise-library/84/trx-reg-back-row/) (Step 1; Step 2) `inv.setup`

**Ruch**

- Przyciągnij klatkę do drążka, łokcie blisko tułowia; opuść się do wyprostu rąk. — ExRx.net: [BWSupineRow](https://web.archive.org/web/20250510042620/https://exrx.net/WeightExercises/BackGeneral/BWSupineRow) (Execution); ACE: [Trx Reg Back Row (#84)](https://www.acefitness.org/resources/everyone/exercise-library/84/trx-reg-back-row/) (Step 3; Step 4) `inv.pull`

**Wskazówki**

- Tułów sztywny: biodra nie opadają w trakcie ruchu. — ExRx.net: [BWSupineRow](https://web.archive.org/web/20250510042620/https://exrx.net/WeightExercises/BackGeneral/BWSupineRow) (Execution (keeping body straight)); ACE: [Trx Reg Back Row (#84)](https://www.acefitness.org/resources/everyone/exercise-library/84/trx-reg-back-row/) (Step 2; Step 3 (avoid sagging in the low back or hips)) `inv.rigid`
- Na końcu ruchu klatka do przodu, łopatki ściągnięte w tył. — ExRx.net: [BWSupineRow](https://web.archive.org/web/20250510042620/https://exrx.net/WeightExercises/BackGeneral/BWSupineRow) (Execution (shoulders back, chest high)); ACE: [Trx Reg Back Row (#84)](https://www.acefitness.org/resources/everyone/exercise-library/84/trx-reg-back-row/) (Step 1; Step 2 (scapulae retracted)) `scr.chest`

### Lat Pulldown

**Ustawienie**

- Usiądź i ustaw wałki tak, żeby mocno przytrzymywały uda; chwyć drążek. — ACE: [Seated Lat Pulldown (#158)](https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/) (Step 1); ExRx.net: [CBFrontPulldown](https://web.archive.org/web/20221216151339/https://exrx.net/WeightExercises/LatissimusDorsi/CBFrontPulldown) (Preparation) `lpd.thighs`

**Ruch**

- Ściągnij drążek w dół przed twarzą do górnej części klatki. — ACE: [Seated Lat Pulldown (#158)](https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/) (Step 2; Step 3); ExRx.net: [CBFrontPulldown](https://web.archive.org/web/20221216151339/https://exrx.net/WeightExercises/LatissimusDorsi/CBFrontPulldown) (Execution) `lpd.pull`

**Wskazówki**

- Na górze wyprostuj ręce do końca. — ACE: [Seated Lat Pulldown (#158)](https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/) (Step 4 (until your elbows are fully extended)); ExRx.net: [CBFrontPulldown](https://web.archive.org/web/20221216151339/https://exrx.net/WeightExercises/LatissimusDorsi/CBFrontPulldown) (Execution (arms and shoulders fully extended)) `lpd.fullStretch`
- Ściągaj do górnej części klatki — nie dalej. — ACE: [Seated Lat Pulldown (#158)](https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/) (Step 3 (until the bar nears the chest or elbows begin to move backwards)); ExRx.net: [CBFrontPulldown](https://web.archive.org/web/20221216151339/https://exrx.net/WeightExercises/LatissimusDorsi/CBFrontPulldown) (Execution (to upper chest)) `lpd.toChest`

### Pull Up

**Ustawienie**

- Chwyć drążek nachwytem, trochę szerzej niż barki, i zawiśnij na prostych rękach. — ACE: [Pull Ups (#191)](https://www.acefitness.org/resources/everyone/exercise-library/191/pull-ups/) (Step 1); NASM: [Pull Up](https://www.nasm.org/resource-center/exercise-library/pull-up) (Step 1: Setup); ExRx.net: [BWPullup](https://web.archive.org/web/20230524140351/https://exrx.net/WeightExercises/LatissimusDorsi/BWPullup) (Preparation) `pu.grip`

**Ruch**

- Podciągnij się, aż broda znajdzie się nad drążkiem; opuść się do pełnego wyprostu rąk. — ACE: [Pull Ups (#191)](https://www.acefitness.org/resources/everyone/exercise-library/191/pull-ups/) (Step 3); NASM: [Pull Up](https://www.nasm.org/resource-center/exercise-library/pull-up) (Step 3; Step 4); ExRx.net: [BWPullup](https://web.archive.org/web/20230524140351/https://exrx.net/WeightExercises/LatissimusDorsi/BWPullup) (Execution) `pu.pull`

**Wskazówki**

- Prowadź łokcie w dół, do boków tułowia. — ACE: [Pull Ups (#191)](https://www.acefitness.org/resources/everyone/exercise-library/191/pull-ups/) (Step 2); NASM: [Pull Up](https://www.nasm.org/resource-center/exercise-library/pull-up) (Step 3 (driving your elbows downward)) `pu.elbowsDown`
- Zacznij ruch od ściągnięcia łopatek w dół. — ACE: [Pull Ups (#191)](https://www.acefitness.org/resources/everyone/exercise-library/191/pull-ups/) (Step 1 (depress and retract your scapulae)); NASM: [Pull Up](https://www.nasm.org/resource-center/exercise-library/pull-up) (Step 2 (depress your shoulder blades)) `pu.shoulders`
- Bez bujania i wymachów nogami. — ACE: [Pull Ups (#191)](https://www.acefitness.org/resources/everyone/exercise-library/191/pull-ups/) (Step 2 (avoid swinging)); NASM: [Pull Up](https://www.nasm.org/resource-center/exercise-library/pull-up) (Common Mistakes (momentum or kipping)) `pu.noSwing`

**Czego unikać**

- Skracanie ruchu — bez wyprostu rąk na dole. — NASM: [Pull Up](https://www.nasm.org/resource-center/exercise-library/pull-up) (Common Mistakes (not achieving full range of motion)); ExRx.net: [BWPullup](https://web.archive.org/web/20230524140351/https://exrx.net/WeightExercises/LatissimusDorsi/BWPullup) (Execution (arms and shoulders fully extended)) `pu.partial`

### Chin Up

**Ustawienie**

- Chwyć drążek podchwytem (dłonie do siebie), na szerokość barków, i zawiśnij na prostych rękach. — ACE: [Chin Ups (#190)](https://www.acefitness.org/resources/everyone/exercise-library/190/chin-ups/) (Step 1); ExRx.net: [BWUnderhandChinup](https://web.archive.org/web/20230523091658/https://exrx.net/WeightExercises/LatissimusDorsi/BWUnderhandChinup) (Preparation) `cu.grip`

**Ruch**

- Podciągaj się, ściągając łokcie w dół do boków; opuść się do pełnego wyprostu rąk. — ACE: [Chin Ups (#190)](https://www.acefitness.org/resources/everyone/exercise-library/190/chin-ups/) (Step 2; Step 3); ExRx.net: [BWUnderhandChinup](https://web.archive.org/web/20230523091658/https://exrx.net/WeightExercises/LatissimusDorsi/BWUnderhandChinup) (Execution) `cu.pull`

**Wskazówki**

- Zacznij ruch od ściągnięcia łopatek w dół. — ACE: [Chin Ups (#190)](https://www.acefitness.org/resources/everyone/exercise-library/190/chin-ups/) (Step 1 (depress and retract your scapulae)); NASM: [Pull Up](https://www.nasm.org/resource-center/exercise-library/pull-up) (Step 2 (podciąganie nachwytem — ta sama zasada)) `pu.shoulders`
- Bez bujania i wymachów nogami. — ACE: [Chin Ups (#190)](https://www.acefitness.org/resources/everyone/exercise-library/190/chin-ups/) (Step 2 (avoid swinging)); NASM: [Pull Up](https://www.nasm.org/resource-center/exercise-library/pull-up) (Common Mistakes (podciąganie nachwytem — ta sama zasada)) `pu.noSwing`

**Czego unikać**

- Skracanie ruchu — bez wyprostu rąk na dole. — ACE: [Chin Ups (#190)](https://www.acefitness.org/resources/everyone/exercise-library/190/chin-ups/) (Step 3 (until your arms are fully extended)); ExRx.net: [BWUnderhandChinup](https://web.archive.org/web/20230523091658/https://exrx.net/WeightExercises/LatissimusDorsi/BWUnderhandChinup) (Execution (arms and shoulders fully extended)) `pu.partial`

### Neutral Grip Pull Up

**Ustawienie**

- Chwyć uchwyty pełnym chwytem (kciuk dookoła) i zawiśnij na prostych rękach. — ExRx.net: [BWPullupN](https://web.archive.org/web/20220412004706/https://exrx.net/WeightExercises/LatissimusDorsi/BWPullupN) (Preparation (neutral grip)); ACE: [Pull Ups (#191)](https://www.acefitness.org/resources/everyone/exercise-library/191/pull-ups/) (Step 1 (full grip)); NASM: [Pull Up](https://www.nasm.org/resource-center/exercise-library/pull-up) (Step 1 (arms fully extended)) `npu.hang`

**Ruch**

- Podciągnij się, aż broda znajdzie się nad drążkiem; opuść się do pełnego wyprostu rąk. — ExRx.net: [BWPullupN](https://web.archive.org/web/20220412004706/https://exrx.net/WeightExercises/LatissimusDorsi/BWPullupN) (Execution (neck reaches height of hands)); ACE: [Pull Ups (#191)](https://www.acefitness.org/resources/everyone/exercise-library/191/pull-ups/) (Step 3); NASM: [Pull Up](https://www.nasm.org/resource-center/exercise-library/pull-up) (Step 3; Step 4) `pu.pull`

**Wskazówki**

- Prowadź łokcie w dół, do boków tułowia. — ACE: [Pull Ups (#191)](https://www.acefitness.org/resources/everyone/exercise-library/191/pull-ups/) (Step 2); NASM: [Pull Up](https://www.nasm.org/resource-center/exercise-library/pull-up) (Step 3) `pu.elbowsDown`
- Zacznij ruch od ściągnięcia łopatek w dół. — ACE: [Pull Ups (#191)](https://www.acefitness.org/resources/everyone/exercise-library/191/pull-ups/) (Step 1); NASM: [Pull Up](https://www.nasm.org/resource-center/exercise-library/pull-up) (Step 2) `pu.shoulders`
- Bez bujania i wymachów nogami. — ACE: [Pull Ups (#191)](https://www.acefitness.org/resources/everyone/exercise-library/191/pull-ups/) (Step 2); NASM: [Pull Up](https://www.nasm.org/resource-center/exercise-library/pull-up) (Common Mistakes) `pu.noSwing`

**Czego unikać**

- Skracanie ruchu — bez wyprostu rąk na dole. — NASM: [Pull Up](https://www.nasm.org/resource-center/exercise-library/pull-up) (Common Mistakes); ExRx.net: [BWPullupN](https://web.archive.org/web/20220412004706/https://exrx.net/WeightExercises/LatissimusDorsi/BWPullupN) (Execution (arms and shoulders fully extended)) `pu.partial`

### Biceps Curl (hantle)

**Ustawienie**

- Stań lub usiądź prosto, hantle w opuszczonych rękach, łokcie przy bokach. — ACE: [Seated Biceps Curl (#44)](https://www.acefitness.org/resources/everyone/exercise-library/44/seated-biceps-curl/) (Step 1); ExRx.net: [DBCurl](https://web.archive.org/web/20240105203817/https://exrx.net/WeightExercises/Biceps/DBCurl) (Preparation) `curl.dbSetup`

**Ruch**

- Zginaj łokieć, obracając dłoń w stronę barku; opuść hantel do pełnego wyprostu ręki. — ACE: [Seated Biceps Curl (#44)](https://www.acefitness.org/resources/everyone/exercise-library/44/seated-biceps-curl/) (Step 2; Step 3; Step 4 (rotate the forearms)); ExRx.net: [DBCurl](https://web.archive.org/web/20240105203817/https://exrx.net/WeightExercises/Biceps/DBCurl) (Execution) `curl.dbMove`

**Wskazówki**

- Łokcie zostają przy bokach — pracuje przedramię, nie ramię. — ACE: [Seated Biceps Curl (#44)](https://www.acefitness.org/resources/everyone/exercise-library/44/seated-biceps-curl/) (Step 2 (without moving your elbows forward)); ExRx.net: [DBCurl](https://web.archive.org/web/20240105203817/https://exrx.net/WeightExercises/Biceps/DBCurl) (Execution (with elbows to sides)) `curl.elbows`
- Tułów nieruchomo: bez bujania i odchylania się. — ACE: [Seated Biceps Curl (#44)](https://www.acefitness.org/resources/everyone/exercise-library/44/seated-biceps-curl/) (Step 2 (without arching your back)); NASM: [Barbell Bicep Curl](https://www.nasm.org/resource-center/exercise-library/barbell-bicep-curl) (Common Mistakes (swinging; sztanga — ta sama zasada)) `curl.noSwing`

**Czego unikać**

- Wysuwanie łokci do przodu albo od tułowia. — ACE: [Seated Biceps Curl (#44)](https://www.acefitness.org/resources/everyone/exercise-library/44/seated-biceps-curl/) (Step 2); NASM: [Barbell Bicep Curl](https://www.nasm.org/resource-center/exercise-library/barbell-bicep-curl) (Common Mistakes (elbows drift away from the body)) `curl.mis.elbows`

### Barbell Curl

**Ustawienie**

- Chwyć sztangę podchwytem, mniej więcej na szerokość barków; ręce wyprostowane. — ACE: [Bicep Curl (#70)](https://www.acefitness.org/resources/everyone/exercise-library/70/bicep-curl/) (opis); NASM: [Barbell Bicep Curl](https://www.nasm.org/resource-center/exercise-library/barbell-bicep-curl) (Step 1: Setup); ExRx.net: [BBCurl](https://web.archive.org/web/20230314202340/https://exrx.net/WeightExercises/Biceps/BBCurl) (Preparation) `curl.bbGrip`

**Ruch**

- Zginaj łokcie, aż przedramiona będą pionowo; opuść sztangę do pełnego wyprostu rąk. — ExRx.net: [BBCurl](https://web.archive.org/web/20230314202340/https://exrx.net/WeightExercises/Biceps/BBCurl) (Execution); ACE: [Bicep Curl (#70)](https://www.acefitness.org/resources/everyone/exercise-library/70/bicep-curl/) (opis); NASM: [Barbell Bicep Curl](https://www.nasm.org/resource-center/exercise-library/barbell-bicep-curl) (Step 3; Step 4) `curl.bbMove`

**Wskazówki**

- Łokcie zostają przy bokach — pracuje przedramię, nie ramię. — ACE: [Bicep Curl (#70)](https://www.acefitness.org/resources/everyone/exercise-library/70/bicep-curl/) (opis (elbows next to the middle of the body)); NASM: [Barbell Bicep Curl](https://www.nasm.org/resource-center/exercise-library/barbell-bicep-curl) (Step 2; FAQ (elbow positioning)); ExRx.net: [BBCurl](https://web.archive.org/web/20230314202340/https://exrx.net/WeightExercises/Biceps/BBCurl) (Execution (with elbows to side)) `curl.elbows`
- Tułów nieruchomo: bez bujania i odchylania się. — ACE: [Bicep Curl (#70)](https://www.acefitness.org/resources/everyone/exercise-library/70/bicep-curl/) (opis (keep chest still)); NASM: [Barbell Bicep Curl](https://www.nasm.org/resource-center/exercise-library/barbell-bicep-curl) (Common Mistakes (swinging)) `curl.noSwing`

**Czego unikać**

- Wysuwanie łokci do przodu albo od tułowia. — NASM: [Barbell Bicep Curl](https://www.nasm.org/resource-center/exercise-library/barbell-bicep-curl) (Common Mistakes); ACE: [Bicep Curl (#70)](https://www.acefitness.org/resources/everyone/exercise-library/70/bicep-curl/) (opis) `curl.mis.elbows`

### EZ Bar Curl

**Ustawienie**

- Chwyć gryf łamany podchwytem, mniej więcej na szerokość barków; ręce wyprostowane. — ExRx.net: [BBCurl](https://web.archive.org/web/20230314202340/https://exrx.net/WeightExercises/Biceps/BBCurl) (Preparation; Comments (cambered bar = EZ Bar Curl)); ACE: [Bicep Curl (#70)](https://www.acefitness.org/resources/everyone/exercise-library/70/bicep-curl/) (opis (sztanga — ten sam ruch)) `curl.ezGrip`

**Ruch**

- Zginaj łokcie, aż przedramiona będą pionowo; opuść sztangę do pełnego wyprostu rąk. — ExRx.net: [BBCurl](https://web.archive.org/web/20230314202340/https://exrx.net/WeightExercises/Biceps/BBCurl) (Execution); ACE: [Bicep Curl (#70)](https://www.acefitness.org/resources/everyone/exercise-library/70/bicep-curl/) (opis) `curl.bbMove`

**Wskazówki**

- Łokcie zostają przy bokach — pracuje przedramię, nie ramię. — ExRx.net: [BBCurl](https://web.archive.org/web/20230314202340/https://exrx.net/WeightExercises/Biceps/BBCurl) (Execution); ACE: [Bicep Curl (#70)](https://www.acefitness.org/resources/everyone/exercise-library/70/bicep-curl/) (opis); NASM: [Barbell Bicep Curl](https://www.nasm.org/resource-center/exercise-library/barbell-bicep-curl) (Step 2) `curl.elbows`
- Tułów nieruchomo: bez bujania i odchylania się. — ACE: [Bicep Curl (#70)](https://www.acefitness.org/resources/everyone/exercise-library/70/bicep-curl/) (opis); NASM: [Barbell Bicep Curl](https://www.nasm.org/resource-center/exercise-library/barbell-bicep-curl) (Common Mistakes) `curl.noSwing`

**Czego unikać**

- Wysuwanie łokci do przodu albo od tułowia. — NASM: [Barbell Bicep Curl](https://www.nasm.org/resource-center/exercise-library/barbell-bicep-curl) (Common Mistakes); ACE: [Bicep Curl (#70)](https://www.acefitness.org/resources/everyone/exercise-library/70/bicep-curl/) (opis) `curl.mis.elbows`

### Hammer Curl

**Ustawienie**

- Hantle przy bokach, dłonie zwrócone do ciała. — ACE: [Hammer Curl (#10)](https://www.acefitness.org/resources/everyone/exercise-library/10/hammer-curl/) (Step 1); ExRx.net: [DBHammerCurl](https://web.archive.org/web/20220412005934/https://exrx.net/WeightExercises/Brachioradialis/DBHammerCurl) (Preparation) `curl.hammerSetup`

**Ruch**

- Zginaj łokieć, kciukiem w stronę barku, aż przedramię będzie pionowo; opuść do pełnego wyprostu. — ACE: [Hammer Curl (#10)](https://www.acefitness.org/resources/everyone/exercise-library/10/hammer-curl/) (Step 2; Step 3); ExRx.net: [DBHammerCurl](https://web.archive.org/web/20220412005934/https://exrx.net/WeightExercises/Brachioradialis/DBHammerCurl) (Execution) `curl.hammerMove`

**Wskazówki**

- Łokcie zostają przy bokach — pracuje przedramię, nie ramię. — ACE: [Hammer Curl (#10)](https://www.acefitness.org/resources/everyone/exercise-library/10/hammer-curl/) (Step 2 (without moving your elbows forward)); ExRx.net: [DBHammerCurl](https://web.archive.org/web/20220412005934/https://exrx.net/WeightExercises/Brachioradialis/DBHammerCurl) (Execution (with elbows to sides)) `curl.elbows`
- Tułów nieruchomo: bez bujania i odchylania się. — ACE: [Hammer Curl (#10)](https://www.acefitness.org/resources/everyone/exercise-library/10/hammer-curl/) (Step 2 (keeping your torso erect)); NASM: [Barbell Bicep Curl](https://www.nasm.org/resource-center/exercise-library/barbell-bicep-curl) (Common Mistakes (swinging; sztanga — ta sama zasada)) `curl.noSwing`

**Czego unikać**

- Wysuwanie łokci do przodu albo od tułowia. — ACE: [Hammer Curl (#10)](https://www.acefitness.org/resources/everyone/exercise-library/10/hammer-curl/) (Step 2); ExRx.net: [DBHammerCurl](https://web.archive.org/web/20220412005934/https://exrx.net/WeightExercises/Brachioradialis/DBHammerCurl) (Execution) `curl.mis.elbows`

### Cable Curl

**Ustawienie**

- Chwyć uchwyt dolnego wyciągu podchwytem, ręce wyprostowane w dół. — ExRx.net: [CBCurl](https://web.archive.org/web/20231121070212/https://exrx.net/WeightExercises/Biceps/CBCurl) (Preparation); ACE: [Standing Bicep Curl (#322)](https://www.acefitness.org/resources/everyone/exercise-library/322/standing-bicep-curl/) (opis (palms facing the ceiling; guma/linka)) `curl.cableSetup`

**Ruch**

- Zginaj łokcie, przyciągając uchwyt w stronę barków; wróć do pełnego wyprostu rąk. — ExRx.net: [CBCurl](https://web.archive.org/web/20231121070212/https://exrx.net/WeightExercises/Biceps/CBCurl) (Execution); ACE: [Standing Bicep Curl (#322)](https://www.acefitness.org/resources/everyone/exercise-library/322/standing-bicep-curl/) (opis) `curl.cableMove`

**Wskazówki**

- Łokcie zostają przy bokach — pracuje przedramię, nie ramię. — ExRx.net: [CBCurl](https://web.archive.org/web/20231121070212/https://exrx.net/WeightExercises/Biceps/CBCurl) (Execution (with elbows to side)); ACE: [Standing Bicep Curl (#322)](https://www.acefitness.org/resources/everyone/exercise-library/322/standing-bicep-curl/) (opis (keep the elbows in close to the sides)) `curl.elbows`
- Opuszczaj ciężar powoli, z kontrolą. — ACE: [Standing Bicep Curl (#322)](https://www.acefitness.org/resources/everyone/exercise-library/322/standing-bicep-curl/) (opis (lower slowly)); NASM: [Barbell Bicep Curl](https://www.nasm.org/resource-center/exercise-library/barbell-bicep-curl) (Common Mistakes (incomplete eccentric control)) `curl.control`

### RDL (sztanga)

**Ustawienie**

- Stań prosto ze sztangą przy udach, stopy na szerokość bioder do barków, chwyt na szerokość barków lub trochę szerzej. — ACE: [Romanian Deadlift (#317)](https://www.acefitness.org/resources/everyone/exercise-library/317/romanian-deadlift/) (opis (barbell resting on the front of the thighs — bez szerokości stóp i chwytu)); NASM: [Romanian Deadlift Barbell](https://www.nasm.org/resource-center/exercise-library/romanian-deadlift-barbell) (Step 1; Step 2 (feet hip-width; grip slightly wider than shoulder-width)); ExRx.net: [RomanianDeadlift](https://web.archive.org/web/20230304211839/https://exrx.net/WeightExercises/OlympicLifts/RomanianDeadlift) (Preparation (shoulder width to wide overhand grip; shoulder width or narrower stance)) `rdl.setup`

**Ruch**

- Cofaj biodra i prowadź sztangę w dół blisko nóg, kolana lekko ugięte; wróć, wypychając biodra w przód. — ACE: [Romanian Deadlift (#317)](https://www.acefitness.org/resources/everyone/exercise-library/317/romanian-deadlift/) (opis); NASM: [Romanian Deadlift Barbell](https://www.nasm.org/resource-center/exercise-library/romanian-deadlift-barbell) (Step 3; Step 4); ExRx.net: [RomanianDeadlift](https://web.archive.org/web/20230304211839/https://exrx.net/WeightExercises/OlympicLifts/RomanianDeadlift) (Execution) `rdl.move`

**Wskazówki**

- Plecy proste (neutralne) przez cały ruch — bez zaokrąglania. — ACE: [Romanian Deadlift (#317)](https://www.acefitness.org/resources/everyone/exercise-library/317/romanian-deadlift/) (opis (straight back)); NASM: [Romanian Deadlift Barbell](https://www.nasm.org/resource-center/exercise-library/romanian-deadlift-barbell) (Step 3 (neutral spine)); ExRx.net: [RomanianDeadlift](https://web.archive.org/web/20230304211839/https://exrx.net/WeightExercises/OlympicLifts/RomanianDeadlift) (Comments (keep back straight)) `hinge.back`
- Schodź, dopóki czujesz rozciąganie tyłu ud i utrzymasz proste plecy. — ACE: [Romanian Deadlift (#317)](https://www.acefitness.org/resources/everyone/exercise-library/317/romanian-deadlift/) (opis (until feeling some tension along the back of the legs)); NASM: [Romanian Deadlift Barbell](https://www.nasm.org/resource-center/exercise-library/romanian-deadlift-barbell) (Step 3; FAQ (range of motion)); ExRx.net: [RomanianDeadlift](https://web.archive.org/web/20230304211839/https://exrx.net/WeightExercises/OlympicLifts/RomanianDeadlift) (Execution (once hamstring is stretched)) `rdl.depth`
- Prowadź sztangę blisko nóg przez cały ruch. — ACE: [Romanian Deadlift (#317)](https://www.acefitness.org/resources/everyone/exercise-library/317/romanian-deadlift/) (opis (keeping the bar very close to the body)); ExRx.net: [RomanianDeadlift](https://web.archive.org/web/20230304211839/https://exrx.net/WeightExercises/OlympicLifts/RomanianDeadlift) (Execution (tracing front contour of legs)) `dl.close`

**Czego unikać**

- Zaokrąglanie pleców, żeby dociągnąć ciężar. — NASM: [Romanian Deadlift Barbell](https://www.nasm.org/resource-center/exercise-library/romanian-deadlift-barbell) (Common Mistakes); ExRx.net: [RomanianDeadlift](https://web.archive.org/web/20230304211839/https://exrx.net/WeightExercises/OlympicLifts/RomanianDeadlift) (Comments) `mis.roundBack`
- Zbyt mocno ugięte kolana — ruch zamienia się w przysiad. — NASM: [Romanian Deadlift Barbell](https://www.nasm.org/resource-center/exercise-library/romanian-deadlift-barbell) (Common Mistakes (bending the knees too much)); ACE: [Romanian Deadlift (#317)](https://www.acefitness.org/resources/everyone/exercise-library/317/romanian-deadlift/) (opis (slight bend in both knees)) `rdl.mis.knees`

### RDL (hantle/linki)

**Ustawienie**

- Stań prosto z hantlami przed udami lub po bokach, stopy na szerokość bioder. — NASM: [Dumbbell Romanian Deadlift](https://www.nasm.org/resource-center/exercise-library/dumbbell-romanian-deadlift) (Step 1); ExRx.net: [DBStraightLegDeadlift](https://web.archive.org/web/20220203041733/https://exrx.net/WeightExercises/Hamstrings/DBStraightLegDeadlift) (Preparation) `rdl.dbSetup`

**Ruch**

- Cofaj biodra i opuszczaj ciężar blisko nóg, kolana lekko ugięte; wróć, wypychając biodra w przód. — NASM: [Dumbbell Romanian Deadlift](https://www.nasm.org/resource-center/exercise-library/dumbbell-romanian-deadlift) (Step 3; Step 4); ExRx.net: [DBStraightLegDeadlift](https://web.archive.org/web/20220203041733/https://exrx.net/WeightExercises/Hamstrings/DBStraightLegDeadlift) (Execution); ACE: [Romanian Deadlift (#317)](https://www.acefitness.org/resources/everyone/exercise-library/317/romanian-deadlift/) (opis (sztanga — ten sam ruch)) `rdl.dbMove`

**Wskazówki**

- Plecy proste (neutralne) przez cały ruch — bez zaokrąglania. — NASM: [Dumbbell Romanian Deadlift](https://www.nasm.org/resource-center/exercise-library/dumbbell-romanian-deadlift) (Step 2; Step 3); ExRx.net: [DBStraightLegDeadlift](https://web.archive.org/web/20220203041733/https://exrx.net/WeightExercises/Hamstrings/DBStraightLegDeadlift) (Comments); ACE: [Romanian Deadlift (#317)](https://www.acefitness.org/resources/everyone/exercise-library/317/romanian-deadlift/) (opis) `hinge.back`
- Schodź, dopóki czujesz rozciąganie tyłu ud i utrzymasz proste plecy. — NASM: [Dumbbell Romanian Deadlift](https://www.nasm.org/resource-center/exercise-library/dumbbell-romanian-deadlift) (Step 3; FAQ); ACE: [Romanian Deadlift (#317)](https://www.acefitness.org/resources/everyone/exercise-library/317/romanian-deadlift/) (opis) `rdl.depth`

**Czego unikać**

- Zaokrąglanie pleców, żeby dociągnąć ciężar. — NASM: [Dumbbell Romanian Deadlift](https://www.nasm.org/resource-center/exercise-library/dumbbell-romanian-deadlift) (Common Mistakes); ACE: [Romanian Deadlift (#317)](https://www.acefitness.org/resources/everyone/exercise-library/317/romanian-deadlift/) (opis) `mis.roundBack`
- Zbyt mocno ugięte kolana — ruch zamienia się w przysiad. — NASM: [Dumbbell Romanian Deadlift](https://www.nasm.org/resource-center/exercise-library/dumbbell-romanian-deadlift) (Common Mistakes); ACE: [Romanian Deadlift (#317)](https://www.acefitness.org/resources/everyone/exercise-library/317/romanian-deadlift/) (opis) `rdl.mis.knees`

### Good Morning

**Ustawienie**

- Sztanga na górze pleców, stopy na szerokość bioder, kolana lekko ugięte. — NASM: [Good Mornings](https://www.nasm.org/resource-center/exercise-library/good-mornings) (Step 1; Step 3 (slight knee bend)); ExRx.net: [BBGoodMorning](https://web.archive.org/web/20230311202405/https://exrx.net/WeightExercises/Hamstrings/BBGoodMorning) (Preparation) `gm.setup`

**Ruch**

- Pochyl tułów w przód, cofając biodra, z prostymi plecami; wróć, wypychając biodra w przód. — NASM: [Good Mornings](https://www.nasm.org/resource-center/exercise-library/good-mornings) (Step 3; Step 4); ExRx.net: [BBGoodMorning](https://web.archive.org/web/20230311202405/https://exrx.net/WeightExercises/Hamstrings/BBGoodMorning) (Execution) `gm.move`

**Wskazówki**

- Plecy proste (neutralne) przez cały ruch — bez zaokrąglania. — NASM: [Good Mornings](https://www.nasm.org/resource-center/exercise-library/good-mornings) (Step 1; Step 3); ExRx.net: [BBGoodMorning](https://web.archive.org/web/20230311202405/https://exrx.net/WeightExercises/Hamstrings/BBGoodMorning) (Execution; Comments) `hinge.back`
- Schodź tylko do łagodnego rozciągnięcia tyłu ud — nie dalej niż do poziomu tułowia. — ExRx.net: [BBGoodMorning](https://web.archive.org/web/20230311202405/https://exrx.net/WeightExercises/Hamstrings/BBGoodMorning) (Execution (until parallel); Comments (mild stretch)); NASM: [Good Mornings](https://www.nasm.org/resource-center/exercise-library/good-mornings) (Step 3; FAQ (forward lean)) `gm.depth`
- Zacznij od bardzo lekkiego ciężaru i dokładaj stopniowo. — ExRx.net: [BBGoodMorning](https://web.archive.org/web/20230311202405/https://exrx.net/WeightExercises/Hamstrings/BBGoodMorning) (Comments (begin with very light weight)); NASM: [Good Mornings](https://www.nasm.org/resource-center/exercise-library/good-mornings) (Common Mistakes (excessive weight); FAQ) `gm.light`

**Czego unikać**

- Zaokrąglanie pleców, żeby dociągnąć ciężar. — NASM: [Good Mornings](https://www.nasm.org/resource-center/exercise-library/good-mornings) (Common Mistakes); ExRx.net: [BBGoodMorning](https://web.archive.org/web/20230311202405/https://exrx.net/WeightExercises/Hamstrings/BBGoodMorning) (Execution (keeping back straight)) `mis.roundBack`

### Shrugs (sztanga)

**Ustawienie**

- Stań prosto z ciężarem w opuszczonych, prostych rękach. — ACE: [Shrug (#72)](https://www.acefitness.org/resources/everyone/exercise-library/72/shrug/) (opis); ExRx.net: [BBShrug](https://web.archive.org/web/20230306153926/https://exrx.net/WeightExercises/TrapeziusUpper/BBShrug) (Preparation) `shrug.setup`

**Ruch**

- Unieś barki w górę, potem powoli je opuść. — ACE: [Shrug (#72)](https://www.acefitness.org/resources/everyone/exercise-library/72/shrug/) (opis); ExRx.net: [BBShrug](https://web.archive.org/web/20230306153926/https://exrx.net/WeightExercises/TrapeziusUpper/BBShrug) (Execution) `shrug.move`

**Wskazówki**

- Unoś barki tak wysoko, jak się da. — ACE: [Shrug (#72)](https://www.acefitness.org/resources/everyone/exercise-library/72/shrug/) (opis (as high as possible)); ExRx.net: [BBShrug](https://web.archive.org/web/20230306153926/https://exrx.net/WeightExercises/TrapeziusUpper/BBShrug) (Execution (as high as possible)) `shrug.high`
- Tułów prosto i nieruchomo — pracują tylko barki. — ACE: [Shrug (#72)](https://www.acefitness.org/resources/everyone/exercise-library/72/shrug/) (opis (hips straight, back tall; only raising/lowering the shoulders)); ExRx.net: [DBShrug](https://web.archive.org/web/20240105211625/https://exrx.net/WeightExercises/TrapeziusUpper/DBShrug) (Comments (standing upright or very slightly bent over)) `shrug.tall`

### Shrugs (hantle)

**Ustawienie**

- Stań prosto z ciężarem w opuszczonych, prostych rękach. — ACE: [Standing Shrug (#75)](https://www.acefitness.org/resources/everyone/exercise-library/75/standing-shrug/) (Step 1); ExRx.net: [DBShrug](https://web.archive.org/web/20240105211625/https://exrx.net/WeightExercises/TrapeziusUpper/DBShrug) (Preparation) `shrug.setup`

**Ruch**

- Unieś barki w górę, potem powoli je opuść. — ACE: [Standing Shrug (#75)](https://www.acefitness.org/resources/everyone/exercise-library/75/standing-shrug/) (Step 2; Step 3); ExRx.net: [DBShrug](https://web.archive.org/web/20240105211625/https://exrx.net/WeightExercises/TrapeziusUpper/DBShrug) (Execution) `shrug.move`

**Wskazówki**

- Unoś barki tak wysoko, jak się da. — ACE: [Shrug (#72)](https://www.acefitness.org/resources/everyone/exercise-library/72/shrug/) (opis (as high as possible)); ExRx.net: [DBShrug](https://web.archive.org/web/20240105211625/https://exrx.net/WeightExercises/TrapeziusUpper/DBShrug) (Execution (as high as possible)) `shrug.high`
- Tułów prosto i nieruchomo — pracują tylko barki. — ACE: [Standing Shrug (#75)](https://www.acefitness.org/resources/everyone/exercise-library/75/standing-shrug/) (Step 2 (erect torso)); ExRx.net: [DBShrug](https://web.archive.org/web/20240105211625/https://exrx.net/WeightExercises/TrapeziusUpper/DBShrug) (Comments (standing upright)) `shrug.tall`

### Face Pull

**Ustawienie**

- Lina na wyciągu co najmniej na wysokości barków; chwyć jej końce i cofnij się, aż linka się napnie. — NASM: [Face Pull](https://www.nasm.org/resource-center/exercise-library/face-pull) (Step 1; Step 2 (cable at approximately eye height; grab the rope, step back to create tension)); ExRx.net: [CBStandingRearDeltRowRope](https://web.archive.org/web/20230331040950/https://exrx.net/WeightExercises/DeltoidPosterior/CBStandingRearDeltRowRope) (Preparation (rope attachment on high pulley; step back so cable is taut)); ACE: [High Row (#336)](https://www.acefitness.org/resources/everyone/exercise-library/336/high-row/) (analogia — inne ćwiczenie; nie liczy się do ≥ 2 źródeł; opis (High Row: rope at about shoulder-height)) `fp.setup`

**Ruch**

- Przyciągnij linę w stronę twarzy; wróć do wyprostu rąk. — NASM: [Face Pull](https://www.nasm.org/resource-center/exercise-library/face-pull) (Step 3; Step 4 (pull the rope toward your face; extend your arms to return)); ExRx.net: [CBStandingRearDeltRowRope](https://web.archive.org/web/20230331040950/https://exrx.net/WeightExercises/DeltoidPosterior/CBStandingRearDeltRowRope) (Execution (pull rope to upper chest or neck; return until arms are extended forward)); ACE: [High Row (#336)](https://www.acefitness.org/resources/everyone/exercise-library/336/high-row/) (analogia — inne ćwiczenie; nie liczy się do ≥ 2 źródeł; opis (High Row: pull, then slowly straighten the arms)) `fp.move`

**Wskazówki**

- Prowadź ruch łokciami — cofaj je w tył. — NASM: [Face Pull](https://www.nasm.org/resource-center/exercise-library/face-pull) (Step 3 (driving your elbows backward)); ExRx.net: [CBStandingRearDeltRowRope](https://web.archive.org/web/20230331040950/https://exrx.net/WeightExercises/DeltoidPosterior/CBStandingRearDeltRowRope) (Execution (until elbows travel slightly behind back)); ACE: [High Row (#336)](https://www.acefitness.org/resources/everyone/exercise-library/336/high-row/) (analogia — inne ćwiczenie; nie liczy się do ≥ 2 źródeł; opis (High Row: pull the elbows back)) `fp.elbowsBack`
- Tułów stabilny i wyprostowany. — NASM: [Face Pull](https://www.nasm.org/resource-center/exercise-library/face-pull) (Step 2 (engage your core)); ExRx.net: [CBStandingRearDeltRowRope](https://web.archive.org/web/20230331040950/https://exrx.net/WeightExercises/DeltoidPosterior/CBStandingRearDeltRowRope) (Comments (torso not positioned forward beyond vertical)); ACE: [High Row (#336)](https://www.acefitness.org/resources/everyone/exercise-library/336/high-row/) (analogia — inne ćwiczenie; nie liczy się do ≥ 2 źródeł; opis (High Row: the back tall, lift the chest up)) `fp.chest`

### Overhead Press (sztanga)

**Ustawienie**

- Zdejmij sztangę ze stojaka na wysokości barków; chwyt na szerokość barków lub trochę szerzej, sztanga przy przedniej części barków. — ACE: [Standing Shoulder Press (#71)](https://www.acefitness.org/resources/everyone/exercise-library/71/standing-shoulder-press/) (opis (rack at about shoulder-height; hands about shoulder-width apart; bar across the top of the shoulders)); ExRx.net: [BBMilitaryPress](https://web.archive.org/web/20230227195849/https://exrx.net/WeightExercises/DeltoidAnterior/BBMilitaryPress) (Preparation (grip slightly wider than shoulder width; bar in front of neck)); ACE: [Seated Shoulder Press (#43)](https://www.acefitness.org/resources/everyone/exercise-library/43/seated-shoulder-press/) (opis (siedząc — ten sam bój: hands a little wider than shoulder-width apart)) `ohp.bbSetup`

**Ruch**

- Wypchnij ciężar nad głowę do wyprostu rąk; opuść go z powrotem do barków. — ACE: [Standing Shoulder Press (#71)](https://www.acefitness.org/resources/everyone/exercise-library/71/standing-shoulder-press/) (opis); ExRx.net: [BBMilitaryPress](https://web.archive.org/web/20230227195849/https://exrx.net/WeightExercises/DeltoidAnterior/BBMilitaryPress) (Execution) `ohp.move`

**Wskazówki**

- Tułów wysoko i stabilnie; ciężar idzie prosto w górę nad głowę. — ACE: [Standing Shoulder Press (#71)](https://www.acefitness.org/resources/everyone/exercise-library/71/standing-shoulder-press/) (opis (back straight and tall, press directly overhead)); ExRx.net: [BBMilitaryPress](https://web.archive.org/web/20230227195849/https://exrx.net/WeightExercises/DeltoidAnterior/BBMilitaryPress) (Execution; Comments (chest high)) `ohp.tall`
- Stopy pewnie na podłodze. — ACE: [Seated Shoulder Press (#43)](https://www.acefitness.org/resources/everyone/exercise-library/43/seated-shoulder-press/) (opis (siedząc — ten sam bój: press the feet into the floor)); ExRx.net: [BBMilitaryPress](https://web.archive.org/web/20230227195849/https://exrx.net/WeightExercises/DeltoidAnterior/BBMilitaryPress) (Comments (feet shoulder width apart or one foot in front of other)) `ohp.feet`

### Overhead Press (hantle)

**Ustawienie**

- Hantle przy barkach, łokcie pod nadgarstkami. — ExRx.net: [DBShoulderPress](https://web.archive.org/web/20221218023659/https://exrx.net/WeightExercises/DeltoidAnterior/DBShoulderPress) (Preparation); ACE: [Seated Shoulder Press (#186)](https://www.acefitness.org/resources/everyone/exercise-library/186/seated-shoulder-press/) (Step 1 (handles at shoulder level, wrists in line with forearms; maszyna — ta sama pozycja)) `ohp.dbSetup`

**Ruch**

- Wypchnij ciężar nad głowę do wyprostu rąk; opuść go z powrotem do barków. — ExRx.net: [DBShoulderPress](https://web.archive.org/web/20221218023659/https://exrx.net/WeightExercises/DeltoidAnterior/DBShoulderPress) (Execution); ACE: [Standing Shoulder Press (#71)](https://www.acefitness.org/resources/everyone/exercise-library/71/standing-shoulder-press/) (opis (sztanga — ten sam ruch)) `ohp.move`

**Wskazówki**

- Tułów wysoko i stabilnie; ciężar idzie prosto w górę nad głowę. — ACE: [Standing Shoulder Press (#71)](https://www.acefitness.org/resources/everyone/exercise-library/71/standing-shoulder-press/) (opis); ExRx.net: [DBShoulderPress](https://web.archive.org/web/20221218023659/https://exrx.net/WeightExercises/DeltoidAnterior/DBShoulderPress) (Execution) `ohp.tall`
- Łokcie pod nadgarstkami przez cały ruch. — ExRx.net: [DBShoulderPress](https://web.archive.org/web/20221218023659/https://exrx.net/WeightExercises/DeltoidAnterior/DBShoulderPress) (Preparation (elbows below wrists)); ACE: [Seated Shoulder Press (#186)](https://www.acefitness.org/resources/everyone/exercise-library/186/seated-shoulder-press/) (Step 1; Step 2 (neutral wrist position)) `ohp.elbowsUnder`

### Seated Shoulder Press (hantle)

**Ustawienie**

- Usiądź z plecami opartymi o oparcie, stopy mocno na podłodze; hantle przy barkach. — ACE: [Seated Shoulder Press (#186)](https://www.acefitness.org/resources/everyone/exercise-library/186/seated-shoulder-press/) (Step 1 (back against the backrest, feet firmly on the floor)); ExRx.net: [DBShoulderPress](https://web.archive.org/web/20221218023659/https://exrx.net/WeightExercises/DeltoidAnterior/DBShoulderPress) (Preparation) `ohp.seat`

**Ruch**

- Wypchnij ciężar nad głowę do wyprostu rąk; opuść go z powrotem do barków. — ExRx.net: [DBShoulderPress](https://web.archive.org/web/20221218023659/https://exrx.net/WeightExercises/DeltoidAnterior/DBShoulderPress) (Execution); ACE: [Seated Shoulder Press (#43)](https://www.acefitness.org/resources/everyone/exercise-library/43/seated-shoulder-press/) (opis) `ohp.move`

**Wskazówki**

- Łokcie pod nadgarstkami przez cały ruch. — ExRx.net: [DBShoulderPress](https://web.archive.org/web/20221218023659/https://exrx.net/WeightExercises/DeltoidAnterior/DBShoulderPress) (Preparation); ACE: [Seated Shoulder Press (#186)](https://www.acefitness.org/resources/everyone/exercise-library/186/seated-shoulder-press/) (Step 1; Step 2) `ohp.elbowsUnder`
- Na górze wyprostuj ręce, bez gwałtownego blokowania łokci. — ACE: [Seated Shoulder Press (#186)](https://www.acefitness.org/resources/everyone/exercise-library/186/seated-shoulder-press/) (Step 3 (fully extended, but not locked)); ExRx.net: [DBShoulderPress](https://web.archive.org/web/20221218023659/https://exrx.net/WeightExercises/DeltoidAnterior/DBShoulderPress) (Execution (until arms are extended)) `ohp.fullExt`

### Back Squat

**Ustawienie**

- Sztanga na górze pleców, chwyt szerzej niż barki; zdejmij ją ze stojaka i cofnij się o krok lub dwa. — ACE: [Back Squat (#11)](https://www.acefitness.org/resources/everyone/exercise-library/11/back-squat/) (opis); ExRx.net: [BBFullSquat](https://web.archive.org/web/20221204065643/https://exrx.net/WeightExercises/Quadriceps/BBFullSquat) (Preparation) `sq.bar`
- Stopy mniej więcej na szerokość barków lub trochę szerzej, palce lekko na zewnątrz. — ACE: [Back Squat (#11)](https://www.acefitness.org/resources/everyone/exercise-library/11/back-squat/) (opis (a little wider than shoulder-width)); Stronger by Science: [How to Squat: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-squat/) (Stance width; Foot Angle) `sq.stance`

**Ruch**

- Schodź, cofając biodra i uginając kolana jednocześnie; wstań, wypychając podłogę całymi stopami. — ACE: [Back Squat (#11)](https://www.acefitness.org/resources/everyone/exercise-library/11/back-squat/) (opis); ExRx.net: [BBFullSquat](https://web.archive.org/web/20221204065643/https://exrx.net/WeightExercises/Quadriceps/BBFullSquat) (Execution); ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (Step 3; Step 6 (ten sam wzorzec bez obciążenia)) `sq.down`

**Wskazówki**

- Kolana idą w linii palców stóp — nie zapadają się do środka. — ExRx.net: [BBFullSquat](https://web.archive.org/web/20221204065643/https://exrx.net/WeightExercises/Quadriceps/BBFullSquat) (Execution; Comments); Stronger by Science: [How to Squat: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-squat/) (Foot Angle; FAQ (knees caving in)); ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (Step 4; Step 5 (knees aligned over the second toe)) `sq.kneesToes`
- Kolana mogą wyjść trochę przed palce stóp — nie trzeba ich na siłę blokować. — Stronger by Science: [How to Squat: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-squat/) (FAQ: Is it okay if my knees go past my toes?); Fry, Smith, Schilling (University of Memphis): [Fry i in. 2003, Effect of knee position on hip and knee torques during the barbell squat, J Strength Cond Res 17(4) — abstrakt](https://pubmed.ncbi.nlm.nih.gov/14636100/) (abstrakt (Practical applications)) `sq.kneesPast`
- Schodź tak nisko, jak pozwala ruchomość przy prostych plecach i całych stopach na podłodze — zwykle co najmniej do równoległego ud. — ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (Step 4); Stronger by Science: [How to Squat: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-squat/) (Depth); ExRx.net: [BBFullSquat](https://web.archive.org/web/20221204065643/https://exrx.net/WeightExercises/Quadriceps/BBFullSquat) (Execution (until knees and hips are fully bent)) `sq.depth`
- Plecy proste, klatka uniesiona. — ACE: [Back Squat (#11)](https://www.acefitness.org/resources/everyone/exercise-library/11/back-squat/) (opis (straight back, chest up)); ExRx.net: [BBFullSquat](https://web.archive.org/web/20221204065643/https://exrx.net/WeightExercises/Quadriceps/BBFullSquat) (Comments (back straight)) `sq.back`

**Czego unikać**

- Kolana zapadające się do środka. — Stronger by Science: [How to Squat: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-squat/) (FAQ: My knees are caving in); ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (Step 4); ExRx.net: [BBFullSquat](https://web.archive.org/web/20221204065643/https://exrx.net/WeightExercises/Quadriceps/BBFullSquat) (Comments) `sq.mis.kneesIn`
- Odrywanie pięt od podłogi. — ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (Step 4; Step 6 (heels flat)); ExRx.net: [BBFullSquat](https://web.archive.org/web/20221204065643/https://exrx.net/WeightExercises/Quadriceps/BBFullSquat) (Comments (feet flat on floor)) `sq.mis.heels`

### Goblet Squat

**Ustawienie**

- Trzymaj hantel lub kettlebell pionowo przy klatce, łokcie blisko tułowia. — ACE: [Goblet Squat (#362)](https://www.acefitness.org/resources/everyone/exercise-library/362/goblet-squat/) (opis); NASM: [Goblet Squat](https://www.nasm.org/resource-center/exercise-library/goblet-squat) (Step 1: Setup) `gob.hold`
- Stopy na szerokość bioder do barków. — ACE: [Goblet Squat (#362)](https://www.acefitness.org/resources/everyone/exercise-library/362/goblet-squat/) (opis (shoulder-width)); NASM: [Goblet Squat](https://www.nasm.org/resource-center/exercise-library/goblet-squat) (Step 1 (hip-width)) `gob.stance`

**Ruch**

- Zejdź w przysiad z uniesioną klatką i ciężarem przy klatce; wstań, wypychając podłogę stopami. — ACE: [Goblet Squat (#362)](https://www.acefitness.org/resources/everyone/exercise-library/362/goblet-squat/) (opis); NASM: [Goblet Squat](https://www.nasm.org/resource-center/exercise-library/goblet-squat) (Step 3; Step 4) `gob.move`

**Wskazówki**

- Schodź tak nisko, jak pozwala ruchomość przy prostych plecach i całych stopach na podłodze — zwykle co najmniej do równoległego ud. — ACE: [Goblet Squat (#362)](https://www.acefitness.org/resources/everyone/exercise-library/362/goblet-squat/) (opis (hips below the knees)); NASM: [Goblet Squat](https://www.nasm.org/resource-center/exercise-library/goblet-squat) (Step 3 (parallel or deeper if mobility allows)) `sq.depth`
- Ciężar blisko ciała, klatka nie opada do przodu. — NASM: [Goblet Squat](https://www.nasm.org/resource-center/exercise-library/goblet-squat) (Common Mistakes (drooping the chest, weight drifting away)); ACE: [Goblet Squat (#362)](https://www.acefitness.org/resources/everyone/exercise-library/362/goblet-squat/) (opis (elbows close to the rib cage, back straight)) `gob.close`
- Kolana idą w linii palców stóp — nie zapadają się do środka. — NASM: [Goblet Squat](https://www.nasm.org/resource-center/exercise-library/goblet-squat) (Common Mistakes (knees cave inward)); ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (Step 4 (ten sam wzorzec)) `sq.kneesToes`

**Czego unikać**

- Kolana zapadające się do środka. — NASM: [Goblet Squat](https://www.nasm.org/resource-center/exercise-library/goblet-squat) (Common Mistakes); ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (Step 4) `sq.mis.kneesIn`

### Przysiad z pasem (linki)

**Ustawienie**

- Stopy mniej więcej na szerokość barków lub trochę szerzej, palce lekko na zewnątrz. — ExRx.net: [CBSquatBelt](https://web.archive.org/web/20191210074910/https://exrx.net/WeightExercises/Quadriceps/CBSquatBelt) (Preparation (feet shoulder width or wider)); ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (Step 1) `sq.stance`

**Ruch**

- Schodź, cofając biodra i uginając kolana jednocześnie; wstań, wypychając podłogę całymi stopami. — ExRx.net: [CBSquatBelt](https://web.archive.org/web/20191210074910/https://exrx.net/WeightExercises/Quadriceps/CBSquatBelt) (Execution); ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (Step 3; Step 6) `sq.down`

**Wskazówki**

- Kolana idą w linii palców stóp — nie zapadają się do środka. — ExRx.net: [CBSquatBelt](https://web.archive.org/web/20191210074910/https://exrx.net/WeightExercises/Quadriceps/CBSquatBelt) (Execution; Comments); ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (Step 4; Step 5) `sq.kneesToes`
- Schodź tak nisko, jak pozwala ruchomość przy prostych plecach i całych stopach na podłodze — zwykle co najmniej do równoległego ud. — ExRx.net: [CBSquatBelt](https://web.archive.org/web/20191210074910/https://exrx.net/WeightExercises/Quadriceps/CBSquatBelt) (Execution (thighs just past parallel)); ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (Step 4) `sq.depth`
- Plecy proste, klatka uniesiona. — ExRx.net: [CBSquatBelt](https://web.archive.org/web/20191210074910/https://exrx.net/WeightExercises/Quadriceps/CBSquatBelt) (Comments (back straight, chest high)); ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (Step 2; Step 3) `sq.back`

**Czego unikać**

- Odrywanie pięt od podłogi. — ExRx.net: [CBSquatBelt](https://web.archive.org/web/20191210074910/https://exrx.net/WeightExercises/Quadriceps/CBSquatBelt) (Comments (feet flat)); ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (Step 4; Step 6) `sq.mis.heels`

### Leg Press

**Ustawienie**

- Oprzyj plecy i miednicę o oparcie; stopy płasko na platformie, kolana zgięte mniej więcej pod kątem prostym. — ACE: [Seated Leg Press (#154)](https://www.acefitness.org/resources/everyone/exercise-library/154/seated-leg-press/) (Step 1 (back and sacrum flat against the backrest; feet on the plate, knees at approximately 90 degrees, heels flat)); NASM: [Leg Press](https://www.nasm.org/resource-center/exercise-library/leg-press) (Step 1: Setup (back and head against the backrest; knees bent at approximately 90 degrees)); ExRx.net: [SL45LegPress](https://web.archive.org/web/20220924004705/https://exrx.net/WeightExercises/Quadriceps/SL45LegPress) (Preparation (back on padded support; feet on platform)) `lp.setup`

**Ruch**

- Wypchnij platformę, prostując biodra i kolana; opuść ją powoli, uginając nogi. — ACE: [Seated Leg Press (#154)](https://www.acefitness.org/resources/everyone/exercise-library/154/seated-leg-press/) (Step 2; Step 4); NASM: [Leg Press](https://www.nasm.org/resource-center/exercise-library/leg-press) (Step 3; Step 4); ExRx.net: [SL45LegPress](https://web.archive.org/web/20220924004705/https://exrx.net/WeightExercises/Quadriceps/SL45LegPress) (Execution) `lp.move`

**Wskazówki**

- Na górze nie blokuj kolan w przeproście. — ACE: [Seated Leg Press (#154)](https://www.acefitness.org/resources/everyone/exercise-library/154/seated-leg-press/) (Step 3 (do not hyperextend/lock-out)); NASM: [Leg Press](https://www.nasm.org/resource-center/exercise-library/leg-press) (Common Mistakes (locking out knees)) `lp.noLock`
- Pchaj całą stopą — pięty nie odrywają się od platformy. — ACE: [Seated Leg Press (#154)](https://www.acefitness.org/resources/everyone/exercise-library/154/seated-leg-press/) (Step 2; Step 3); ExRx.net: [SL45LegPress](https://web.archive.org/web/20220924004705/https://exrx.net/WeightExercises/Quadriceps/SL45LegPress) (Comments (do not allow heels to raise)) `lp.heels`
- Nie schodź tak nisko, by miednica odrywała się od oparcia, a dolne plecy zaokrąglały. — ACE: [Seated Leg Press (#154)](https://www.acefitness.org/resources/everyone/exercise-library/154/seated-leg-press/) (Step 3; Step 4 (butt off the seat, thighs against ribcage)); ExRx.net: [SL45LegPress](https://web.archive.org/web/20220924004705/https://exrx.net/WeightExercises/Quadriceps/SL45LegPress) (Comments (without forcing hips to bend at waist)) `lp.hips`
- Kolana idą w linii palców stóp — nie zapadają się do środka. — ExRx.net: [SL45LegPress](https://web.archive.org/web/20220924004705/https://exrx.net/WeightExercises/Quadriceps/SL45LegPress) (Comments (knees pointed same direction as feet)); NASM: [Leg Press](https://www.nasm.org/resource-center/exercise-library/leg-press) (Common Mistakes (knees cave inward)) `sq.kneesToes`

**Czego unikać**

- Kolana zapadające się do środka. — NASM: [Leg Press](https://www.nasm.org/resource-center/exercise-library/leg-press) (Common Mistakes); ExRx.net: [LVSeatedLegPress](https://web.archive.org/web/20230304211727/https://exrx.net/WeightExercises/Quadriceps/LVSeatedLegPress) (Comments) `sq.mis.kneesIn`

### Bulgarian Split Squat (hantle)

**Ustawienie**

- Stań tyłem do ławki i oprzyj na niej grzbiet tylnej stopy; przednia stopa wysunięta. — ACE: [Bulgarian Split Squat (#366)](https://www.acefitness.org/resources/everyone/exercise-library/366/bulgarian-split-squat/) (opis); NASM: [Bulgarian Split Squat](https://www.nasm.org/resource-center/exercise-library/bulgarian-split-squat) (Step 1: Setup); ExRx.net: [DBSingleLegSplitSquat](https://web.archive.org/web/20220920153216/https://exrx.net/WeightExercises/Quadriceps/DBSingleLegSplitSquat) (Preparation) `bss.setup`

**Ruch**

- Opuść się, uginając przednie kolano i biodro, aż tylne kolano będzie tuż nad podłogą; wstań, odpychając się przednią nogą. — ACE: [Bulgarian Split Squat (#366)](https://www.acefitness.org/resources/everyone/exercise-library/366/bulgarian-split-squat/) (opis); NASM: [Bulgarian Split Squat](https://www.nasm.org/resource-center/exercise-library/bulgarian-split-squat) (Step 3; Step 4); ExRx.net: [DBSingleLegSplitSquat](https://web.archive.org/web/20220920153216/https://exrx.net/WeightExercises/Quadriceps/DBSingleLegSplitSquat) (Execution) `bss.move`

**Wskazówki**

- Plecy proste przez cały ruch. — ACE: [Bulgarian Split Squat (#366)](https://www.acefitness.org/resources/everyone/exercise-library/366/bulgarian-split-squat/) (opis (back straight)); NASM: [Bulgarian Split Squat](https://www.nasm.org/resource-center/exercise-library/bulgarian-split-squat) (Step 2; Step 3 (upright posture)); ExRx.net: [DBSingleLegSplitSquat](https://web.archive.org/web/20220920153216/https://exrx.net/WeightExercises/Quadriceps/DBSingleLegSplitSquat) (Comments (torso upright)) `lunge.torso`
- Przednie kolano w linii palców stopy. — ExRx.net: [DBSingleLegSplitSquat](https://web.archive.org/web/20220920153216/https://exrx.net/WeightExercises/Quadriceps/DBSingleLegSplitSquat) (Comments); NASM: [Bulgarian Split Squat](https://www.nasm.org/resource-center/exercise-library/bulgarian-split-squat) (Common Mistakes (front knee cave inward)) `lunge.knee`

**Czego unikać**

- Przednie kolano uciekające do środka. — NASM: [Bulgarian Split Squat](https://www.nasm.org/resource-center/exercise-library/bulgarian-split-squat) (Common Mistakes); ExRx.net: [DBSingleLegSplitSquat](https://web.archive.org/web/20220920153216/https://exrx.net/WeightExercises/Quadriceps/DBSingleLegSplitSquat) (Comments) `lunge.mis.kneeIn`

### Lunges (hantle)

**Ustawienie**

- Stań prosto, stopy na szerokość bioder, hantle w opuszczonych rękach. — ACE: [Lunge (#363)](https://www.acefitness.org/resources/everyone/exercise-library/363/lunge/) (opis); ExRx.net: [DBLunge](https://web.archive.org/web/20221218023658/https://exrx.net/WeightExercises/Quadriceps/DBLunge) (Preparation) `lunge.dbSetup`

**Ruch**

- Zrób krok w przód i opuść się, aż tylne kolano będzie tuż nad podłogą; odepchnij się przednią nogą do pozycji wyjściowej. — ACE: [Lunge (#363)](https://www.acefitness.org/resources/everyone/exercise-library/363/lunge/) (opis); ExRx.net: [DBLunge](https://web.archive.org/web/20221218023658/https://exrx.net/WeightExercises/Quadriceps/DBLunge) (Execution) `lunge.fwd`

**Wskazówki**

- Plecy proste przez cały ruch. — ACE: [Lunge (#363)](https://www.acefitness.org/resources/everyone/exercise-library/363/lunge/) (opis (back straight)); ExRx.net: [DBLunge](https://web.archive.org/web/20221218023658/https://exrx.net/WeightExercises/Quadriceps/DBLunge) (Comments (torso upright)) `lunge.torso`

### Walking Lunges

**Ustawienie**

- Stań prosto, stopy na szerokość bioder, hantle w opuszczonych rękach. — ExRx.net: [DBWalkingLunge](https://web.archive.org/web/20221225223024/https://exrx.net/WeightExercises/Quadriceps/DBWalkingLunge) (Preparation); ACE: [Lunge (#363)](https://www.acefitness.org/resources/everyone/exercise-library/363/lunge/) (opis) `lunge.dbSetup`

**Ruch**

- Krok w przód, opuść się, aż tylne kolano będzie tuż nad podłogą; wstań na przedniej nodze i od razu zrób krok drugą. — ExRx.net: [DBWalkingLunge](https://web.archive.org/web/20221225223024/https://exrx.net/WeightExercises/Quadriceps/DBWalkingLunge) (Execution); ACE: [Walking Lunges With Twists (#139)](https://www.acefitness.org/resources/everyone/exercise-library/139/walking-lunges-with-twists/) (Step 2–5) `lunge.walk`

**Wskazówki**

- Plecy proste przez cały ruch. — ExRx.net: [DBWalkingLunge](https://web.archive.org/web/20221225223024/https://exrx.net/WeightExercises/Quadriceps/DBWalkingLunge) (Comments (torso upright)); ACE: [Walking Lunges With Twists (#139)](https://www.acefitness.org/resources/everyone/exercise-library/139/walking-lunges-with-twists/) (Step 3 (keep the spine extended); wskazówka końcowa (tall, straight spine)) `lunge.torso`

### Reverse Lunge

**Ustawienie**

- Stań prosto, stopy mniej więcej na szerokość bioder. — ACE: [Reverse Lunge (#319)](https://www.acefitness.org/resources/everyone/exercise-library/319/reverse-lunge/) (opis (feet about hip-width apart)); ExRx.net: [DBRearLunge](https://web.archive.org/web/20231227040116/https://exrx.net/WeightExercises/Quadriceps/DBRearLunge) (Preparation) `lunge.stand`

**Ruch**

- Zrób krok w tył i opuść się, aż tylne kolano będzie tuż nad podłogą; wróć, odpychając się przednią nogą. — ACE: [Reverse Lunge (#319)](https://www.acefitness.org/resources/everyone/exercise-library/319/reverse-lunge/) (opis); ExRx.net: [DBRearLunge](https://web.archive.org/web/20231227040116/https://exrx.net/WeightExercises/Quadriceps/DBRearLunge) (Execution) `lunge.back`

**Wskazówki**

- Plecy proste przez cały ruch. — ACE: [Reverse Lunge (#319)](https://www.acefitness.org/resources/everyone/exercise-library/319/reverse-lunge/) (opis (chest raised)); ExRx.net: [DBRearLunge](https://web.archive.org/web/20231227040116/https://exrx.net/WeightExercises/Quadriceps/DBRearLunge) (Comments (torso upright)) `lunge.torso`

### Step Up

**Ustawienie**

- Stań przodem do stabilnej skrzyni lub ławki, hantle w opuszczonych rękach. — ACE: [Step Up (#28)](https://www.acefitness.org/resources/everyone/exercise-library/28/step-up/) (Step 1); ExRx.net: [DBStepUp](https://web.archive.org/web/20220826035241/https://exrx.net/WeightExercises/Quadriceps/DBStepUp) (Preparation) `stepup.setup`

**Ruch**

- Postaw całą stopę na podwyższeniu i wejdź, prostując tę nogę; zejdź kontrolowanie tą samą drogą. — ACE: [Step Up (#28)](https://www.acefitness.org/resources/everyone/exercise-library/28/step-up/) (Step 2; Step 3); ExRx.net: [DBStepUp](https://web.archive.org/web/20220826035241/https://exrx.net/WeightExercises/Quadriceps/DBStepUp) (Execution) `stepup.move`

**Wskazówki**

- Plecy proste przez cały ruch. — ACE: [Step Up (#28)](https://www.acefitness.org/resources/everyone/exercise-library/28/step-up/) (Step 2 (torso upright)); ExRx.net: [DBStepUp](https://web.archive.org/web/20220826035241/https://exrx.net/WeightExercises/Quadriceps/DBStepUp) (Comments (torso upright)) `lunge.torso`
- Kolano nogi na podwyższeniu w linii palców stopy. — ACE: [Step Up (#28)](https://www.acefitness.org/resources/everyone/exercise-library/28/step-up/) (Step 2; wskazówka końcowa (knee aligned over your second toe)); ExRx.net: [DBStepUp](https://web.archive.org/web/20220826035241/https://exrx.net/WeightExercises/Quadriceps/DBStepUp) (Comments (lead knee same direction as foot)) `stepup.knee`

### Pistol Squat

**Ustawienie**

- Stań na jednej nodze, drugą wyprostuj w przód nad podłogą; ręce przed sobą do równowagi. — ExRx.net: [BWSingleLegSquat](https://web.archive.org/web/20230314202344/https://exrx.net/WeightExercises/Quadriceps/BWSingleLegSquat) (Preparation); ACE: [Pistol Squat (#308)](https://www.acefitness.org/resources/everyone/exercise-library/308/pistol-squat/) (opis); NASM: [Single Leg Squat](https://www.nasm.org/resource-center/exercise-library/single-leg-squat) (Step 1; Step 2) `pistol.setup`

**Ruch**

- Zejdź w przysiad na nodze podporowej tak nisko, jak kontrolujesz ruch; wstań do pełnego wyprostu. — ExRx.net: [BWSingleLegSquat](https://web.archive.org/web/20230314202344/https://exrx.net/WeightExercises/Quadriceps/BWSingleLegSquat) (Execution); NASM: [Single Leg Squat](https://www.nasm.org/resource-center/exercise-library/single-leg-squat) (Step 3; Step 4; FAQ (depth)); ACE: [Pistol Squat (#308)](https://www.acefitness.org/resources/everyone/exercise-library/308/pistol-squat/) (opis) `pistol.move`

**Wskazówki**

- Kolano nogi podporowej w linii palców stopy. — ExRx.net: [BWSingleLegSquat](https://web.archive.org/web/20230314202344/https://exrx.net/WeightExercises/Quadriceps/BWSingleLegSquat) (Execution; Comments); NASM: [Single Leg Squat](https://www.nasm.org/resource-center/exercise-library/single-leg-squat) (Common Mistakes (planted knee cave inward)) `pistol.knee`
- Na początek pomagaj sobie podpórką albo zmniejsz zakres ruchu. — ExRx.net: [BWSingleLegSquat](https://web.archive.org/web/20230314202344/https://exrx.net/WeightExercises/Quadriceps/BWSingleLegSquat) (Comments: Easier (partial reps, self assistance)); NASM: [Single Leg Squat](https://www.nasm.org/resource-center/exercise-library/single-leg-squat) (Step 1; FAQ (support for beginners)) `pistol.assist`

### Hip Thrust (sztanga)

**Ustawienie**

- Oprzyj górną część pleców o krawędź ławki, sztangę połóż na biodrach (najlepiej na podkładce); stopy płasko, kolana ugięte. — ExRx.net: [BBHipThrust](https://web.archive.org/web/20210507002610/https://exrx.net/WeightExercises/GluteusMaximus/BBHipThrust) (Preparation; Comments (padding)); ACE: [Understanding the Barbell Hip Thrust (ACE Certified, XI 2019)](https://www.acefitness.org/continuing-education/certified/november-2019/7403/understanding-the-barbell-hip-thrust/) (akapit „The BHT is basically a glute or hip bridge…”) `ht.setup`

**Ruch**

- Unieś biodra do pełnego wyprostu; opuść je kontrolowanie. — ExRx.net: [BBHipThrust](https://web.archive.org/web/20210507002610/https://exrx.net/WeightExercises/GluteusMaximus/BBHipThrust) (Execution); ACE: [Understanding the Barbell Hip Thrust (ACE Certified, XI 2019)](https://www.acefitness.org/continuing-education/certified/november-2019/7403/understanding-the-barbell-hip-thrust/) (akapit wstępny (lowers the tailbone… presses the hips upward)); ACE: [Hip Bridge (#318)](https://www.acefitness.org/resources/everyone/exercise-library/318/hip-bridge/) (opis) `ht.move`

**Wskazówki**

- Ruch tylko w biodrach — na górze nie wyginaj lędźwi w łuk. — ExRx.net: [BBHipThrust](https://web.archive.org/web/20210507002610/https://exrx.net/WeightExercises/GluteusMaximus/BBHipThrust) (Comments (torso rigid; avoid chest arching and anterior pelvic tilt)); ACE: [Glute Bridge (#49)](https://www.acefitness.org/resources/everyone/exercise-library/49/glute-bridge/) (Step 2; wskazówka końcowa (avoid arching your lower back)) `ht.rigid`
- Przytrzymuj ciężar dłońmi, żeby się nie przetaczał. — ExRx.net: [BBHipThrust](https://web.archive.org/web/20210507002610/https://exrx.net/WeightExercises/GluteusMaximus/BBHipThrust) (Comments (keep bar from rolling back with hands)); ACE: [Hip Bridge (#318)](https://www.acefitness.org/resources/everyone/exercise-library/318/hip-bridge/) (opis (hold on to the bar)) `ht.hold`

**Czego unikać**

- Przeprost w lędźwiach na górze zamiast wyprostu w biodrach. — ExRx.net: [BBHipThrust](https://web.archive.org/web/20210507002610/https://exrx.net/WeightExercises/GluteusMaximus/BBHipThrust) (Comments); ACE: [Glute Bridge (#49)](https://www.acefitness.org/resources/everyone/exercise-library/49/glute-bridge/) (wskazówka końcowa) `ht.mis.arch`

### Hip Thrust (hantel)

**Ustawienie**

- Oprzyj górną część pleców o ławkę, stopy płasko na podłodze, hantel na biodrach przytrzymany dłońmi. — ACE: [Elevated Glute Bridge (#367)](https://www.acefitness.org/resources/everyone/exercise-library/367/elevated-glute-bridge/) (opis); ExRx.net: [BBHipThrust](https://web.archive.org/web/20210507002610/https://exrx.net/WeightExercises/GluteusMaximus/BBHipThrust) (Preparation (sztanga — ta sama pozycja)) `ht.dbSetup`

**Ruch**

- Unieś biodra do pełnego wyprostu; opuść je kontrolowanie. — ACE: [Elevated Glute Bridge (#367)](https://www.acefitness.org/resources/everyone/exercise-library/367/elevated-glute-bridge/) (opis); ExRx.net: [BBHipThrust](https://web.archive.org/web/20210507002610/https://exrx.net/WeightExercises/GluteusMaximus/BBHipThrust) (Execution (sztanga — ten sam ruch)) `ht.move`

**Wskazówki**

- Ruch tylko w biodrach — na górze nie wyginaj lędźwi w łuk. — ExRx.net: [BBHipThrust](https://web.archive.org/web/20210507002610/https://exrx.net/WeightExercises/GluteusMaximus/BBHipThrust) (Comments); ACE: [Glute Bridge (#49)](https://www.acefitness.org/resources/everyone/exercise-library/49/glute-bridge/) (Step 2; wskazówka końcowa) `ht.rigid`
- Przytrzymuj ciężar dłońmi, żeby się nie przetaczał. — ACE: [Elevated Glute Bridge (#367)](https://www.acefitness.org/resources/everyone/exercise-library/367/elevated-glute-bridge/) (opis (rest them on top of the hips)); ExRx.net: [BBHipThrust](https://web.archive.org/web/20210507002610/https://exrx.net/WeightExercises/GluteusMaximus/BBHipThrust) (Comments) `ht.hold`

**Czego unikać**

- Przeprost w lędźwiach na górze zamiast wyprostu w biodrach. — ExRx.net: [BBHipThrust](https://web.archive.org/web/20210507002610/https://exrx.net/WeightExercises/GluteusMaximus/BBHipThrust) (Comments); ACE: [Glute Bridge (#49)](https://www.acefitness.org/resources/everyone/exercise-library/49/glute-bridge/) (wskazówka końcowa) `ht.mis.arch`

### Glute Bridge

**Ustawienie**

- Połóż się na plecach, kolana ugięte, stopy płasko na podłodze na szerokość bioder. — ACE: [Glute Bridge (#49)](https://www.acefitness.org/resources/everyone/exercise-library/49/glute-bridge/) (Step 1); NASM: [Floor Bridge](https://www.nasm.org/resource-center/exercise-library/floor-bridge) (Step 1: Setup) `gb.setup`

**Ruch**

- Unieś biodra, napinając pośladki, aż barki, biodra i kolana utworzą linię; opuść powoli. — ACE: [Glute Bridge (#49)](https://www.acefitness.org/resources/everyone/exercise-library/49/glute-bridge/) (Step 2; Step 3); NASM: [Floor Bridge](https://www.nasm.org/resource-center/exercise-library/floor-bridge) (Step 3; Step 4) `gb.move`

**Wskazówki**

- Nie wypychaj bioder wyżej niż linia tułowia — lędźwie bez przeprostu. — ACE: [Glute Bridge (#49)](https://www.acefitness.org/resources/everyone/exercise-library/49/glute-bridge/) (Step 2; wskazówka końcowa); NASM: [Floor Bridge](https://www.nasm.org/resource-center/exercise-library/floor-bridge) (Common Mistakes (excessive lower back arching)) `gb.noArch`
- Dociskaj stopy, zwłaszcza pięty, do podłogi. — ACE: [Glute Bridge (#49)](https://www.acefitness.org/resources/everyone/exercise-library/49/glute-bridge/) (Step 2 (press your heels into the floor)); NASM: [Floor Bridge](https://www.nasm.org/resource-center/exercise-library/floor-bridge) (Step 3; FAQ (driving through your heels)) `gb.heels`

**Czego unikać**

- Przeprost w lędźwiach na górze zamiast wyprostu w biodrach. — ACE: [Glute Bridge (#49)](https://www.acefitness.org/resources/everyone/exercise-library/49/glute-bridge/) (wskazówka końcowa); NASM: [Floor Bridge](https://www.nasm.org/resource-center/exercise-library/floor-bridge) (Common Mistakes; FAQ) `ht.mis.arch`

### Kettlebell Swing

**Ustawienie**

- Stań za kettlebellem, stopy na szerokość barków lub trochę szerzej; pochyl się w biodrach z prostymi plecami i chwyć uchwyt oburącz. — ExRx.net: [KBTwoArmSwing](https://web.archive.org/web/20230406171303/https://exrx.net/WeightExercises/Kettlebell/KBTwoArmSwing) (Preparation (feet slightly wider apart than shoulder width; bend over at hip, back straight; grasp handle with both hands)); ACE: [Swing (#391)](https://www.acefitness.org/resources/everyone/exercise-library/391/swing/) (opis (feet shoulder-width apart; hold with both hands; back straight, sink back into the hips)) `kb.setup`

**Ruch**

- Cofnij biodra, przepuszczając kettlebell między nogami, potem energicznie wypchnij biodra w przód — kettlebell unosi się przed tobą. — ExRx.net: [KBTwoArmSwing](https://web.archive.org/web/20230406171303/https://exrx.net/WeightExercises/Kettlebell/KBTwoArmSwing) (Execution); ACE: [Swing (#391)](https://www.acefitness.org/resources/everyone/exercise-library/391/swing/) (opis) `kb.move`

**Wskazówki**

- Siła idzie z bioder, nie z barków — ręce tylko prowadzą kettlebell. — ACE: [Swing (#391)](https://www.acefitness.org/resources/everyone/exercise-library/391/swing/) (opis (Tip: strength from legs and hips, NOT the shoulders)); ExRx.net: [KBTwoArmSwing](https://web.archive.org/web/20230406171303/https://exrx.net/WeightExercises/Kettlebell/KBTwoArmSwing) (Comments (hips primarily drive; shoulder movements largely passive)) `kb.hips`
- Plecy proste (neutralne) przez cały ruch — bez zaokrąglania. — ACE: [Swing (#391)](https://www.acefitness.org/resources/everyone/exercise-library/391/swing/) (opis (keep the back straight)); ExRx.net: [KBTwoArmSwing](https://web.archive.org/web/20230406171303/https://exrx.net/WeightExercises/Kettlebell/KBTwoArmSwing) (Comments (back taut)) `hinge.back`

### Standing Calf Raise

**Ustawienie**

- Stań przednią częścią stóp na krawędzi podestu, pięty poza krawędzią. — ExRx.net: [LVStandingCalfRaise](https://web.archive.org/web/20230407071949/https://exrx.net/WeightExercises/Gastrocnemius/LVStandingCalfRaise) (Preparation); NASM: [Leg Press Calf Raise](https://www.nasm.org/resource-center/exercise-library/leg-press-calf-raise) (Step 1 (forefeet on the platform, heels beyond the edge)) `calf.edge`

**Ruch**

- Wspinaj się na palce jak najwyżej, potem opuść pięty, aż poczujesz rozciągnięcie łydek. — ExRx.net: [LVStandingCalfRaise](https://web.archive.org/web/20230407071949/https://exrx.net/WeightExercises/Gastrocnemius/LVStandingCalfRaise) (Execution); ACE: [Calf Raises (#51)](https://www.acefitness.org/resources/everyone/exercise-library/51/calf-raises/) (opis); NASM: [Leg Press Calf Raise](https://www.nasm.org/resource-center/exercise-library/leg-press-calf-raise) (Step 3; FAQ (range of motion)) `calf.move`

**Wskazówki**

- Kolana proste lub tylko lekko ugięte — ruch wyłącznie w stawach skokowych. — ExRx.net: [LVStandingCalfRaise](https://web.archive.org/web/20230407071949/https://exrx.net/WeightExercises/Gastrocnemius/LVStandingCalfRaise) (Comments); ACE: [Calf Raises (#51)](https://www.acefitness.org/resources/everyone/exercise-library/51/calf-raises/) (opis (slight bend in knees)) `calf.knees`
- Zatrzymaj się chwilę na górze i opuszczaj powoli. — ACE: [Calf Raises (#51)](https://www.acefitness.org/resources/everyone/exercise-library/51/calf-raises/) (opis (pause at the top, slowly roll the heels down)); NASM: [Leg Press Calf Raise](https://www.nasm.org/resource-center/exercise-library/leg-press-calf-raise) (Step 4 (with control)) `calf.pause`

**Czego unikać**

- Skrócony zakres — bez pełnego wspięcia i opuszczenia. — NASM: [Leg Press Calf Raise](https://www.nasm.org/resource-center/exercise-library/leg-press-calf-raise) (Common Mistakes); ExRx.net: [LVStandingCalfRaise](https://web.archive.org/web/20230407071949/https://exrx.net/WeightExercises/Gastrocnemius/LVStandingCalfRaise) (Execution (as high as possible… until calves are stretched)) `calf.mis.partial`

### Łydki na stopniu

**Ustawienie**

- Stań przednią częścią stóp na stabilnym stopniu, pięty poza krawędzią; przytrzymaj się czegoś dla równowagi. — ExRx.net: [BWStandingCalfRaise](https://web.archive.org/web/20210501093132/https://exrx.net/WeightExercises/Gastrocnemius/BWStandingCalfRaise) (Preparation; Comments); Physitrack: [Heel raises on a step](https://us.physitrack.com/home-exercise-video/heel-raises-on-a-step) (szczebel 5 — nie liczy się do pary; Instrukcja: „Walk your feet back so that your heels are off the edge of the step.” (przytrzymanie się podpory)); The Prehab Guys: [Heel Raise – Off Step](https://theprehabguys.com/vimeo-video/heel-raise-off-step/) (szczebel 5 — nie liczy się do pary; HOW: „Place a step in front of a wall or an object to use for balance. Step onto the box with the balls of your feet on the edge of the box, and your heels off the box.”) `calf.step`

**Ruch**

- Wspinaj się na palce jak najwyżej, potem opuść pięty, aż poczujesz rozciągnięcie łydek. — ExRx.net: [DBSingleLegCalfRaise](https://web.archive.org/web/20230609053308/https://exrx.net/WeightExercises/Gastrocnemius/DBSingleLegCalfRaise) (Execution); ACE: [Standing Calf Raises Wall (#73)](https://www.acefitness.org/resources/everyone/exercise-library/73/standing-calf-raises-wall/) (Step 2; Step 3) `calf.move`

**Wskazówki**

- Kolana proste lub tylko lekko ugięte — ruch wyłącznie w stawach skokowych. — ExRx.net: [BWStandingCalfRaise](https://web.archive.org/web/20210501093132/https://exrx.net/WeightExercises/Gastrocnemius/BWStandingCalfRaise) (Comments); ACE: [Standing Calf Raises Wall (#73)](https://www.acefitness.org/resources/everyone/exercise-library/73/standing-calf-raises-wall/) (Step 2 (keeping your knees extended)) `calf.knees`
- Zatrzymaj się chwilę na górze i opuszczaj powoli. — ACE: [Standing Calf Raises Wall (#73)](https://www.acefitness.org/resources/everyone/exercise-library/73/standing-calf-raises-wall/) (Step 2; Step 3 (hold briefly, slowly lower)); ExRx.net: [BWStandingCalfRaise](https://web.archive.org/web/20210501093132/https://exrx.net/WeightExercises/Gastrocnemius/BWStandingCalfRaise) (Execution) `calf.pause`

### Calf Press (leg press)

**Ustawienie**

- Usiądź na prasie, oprzyj przednią część stóp na dolnej krawędzi platformy, pięty poza nią; nogi wyprostowane. — ExRx.net: [SL45CalfPress](https://web.archive.org/web/20231122093928/https://exrx.net/WeightExercises/Gastrocnemius/SL45CalfPress) (Preparation); NASM: [Leg Press Calf Raise](https://www.nasm.org/resource-center/exercise-library/leg-press-calf-raise) (Step 1) `calf.press`

**Ruch**

- Wypychaj platformę palcami jak najdalej, potem pozwól piętom wrócić, aż poczujesz rozciągnięcie łydek. — ExRx.net: [SL45CalfPress](https://web.archive.org/web/20231122093928/https://exrx.net/WeightExercises/Gastrocnemius/SL45CalfPress) (Execution); NASM: [Leg Press Calf Raise](https://www.nasm.org/resource-center/exercise-library/leg-press-calf-raise) (Step 3; Step 4); ACE: [Calf Raise (#294)](https://www.acefitness.org/resources/everyone/exercise-library/294/calf-raise/) (opis) `calf.pressMove`

**Wskazówki**

- Kolana proste lub tylko lekko ugięte — ruch wyłącznie w stawach skokowych. — ExRx.net: [SL45CalfPress](https://web.archive.org/web/20231122093928/https://exrx.net/WeightExercises/Gastrocnemius/SL45CalfPress) (Comments); ACE: [Calf Raise (#294)](https://www.acefitness.org/resources/everyone/exercise-library/294/calf-raise/) (opis (keeping legs straight)) `calf.knees`
- Zatrzymaj się chwilę na górze i opuszczaj powoli. — NASM: [Leg Press Calf Raise](https://www.nasm.org/resource-center/exercise-library/leg-press-calf-raise) (Step 4 (with control)); ACE: [Calf Raise (#294)](https://www.acefitness.org/resources/everyone/exercise-library/294/calf-raise/) (opis (slowly return)) `calf.pause`

**Czego unikać**

- Skrócony zakres — bez pełnego wspięcia i opuszczenia. — NASM: [Leg Press Calf Raise](https://www.nasm.org/resource-center/exercise-library/leg-press-calf-raise) (Common Mistakes); ExRx.net: [SL45CalfPress](https://web.archive.org/web/20231122093928/https://exrx.net/WeightExercises/Gastrocnemius/SL45CalfPress) (Execution) `calf.mis.partial`

### Push Press

**Ustawienie**

- Sztanga przy przedniej części barków, chwyt mniej więcej na szerokość barków lub trochę szerzej, stopy na szerokość bioder. — ACE: [Push Press (#24)](https://www.acefitness.org/resources/everyone/exercise-library/24/push-press/) (opis); ExRx.net: [PushPress](https://web.archive.org/web/20220802212347/https://exrx.net/WeightExercises/OlympicLifts/PushPress) (Preparation) `pp.setup`

**Ruch**

- Krótko ugnij kolana, a potem dynamicznie wyprostuj nogi i biodra, wypychając sztangę nad głowę do wyprostu rąk. — ACE: [Push Press (#24)](https://www.acefitness.org/resources/everyone/exercise-library/24/push-press/) (opis); ExRx.net: [PushPress](https://web.archive.org/web/20220802212347/https://exrx.net/WeightExercises/OlympicLifts/PushPress) (Execution) `pp.move`

**Wskazówki**

- Siła wybicia idzie z nóg i bioder — ręce kończą ruch. — ACE: [Push Press (#24)](https://www.acefitness.org/resources/everyone/exercise-library/24/push-press/) (opis (power from the hips through the shoulders and arms)); ExRx.net: [PushPress](https://web.archive.org/web/20220802212347/https://exrx.net/WeightExercises/OlympicLifts/PushPress) (Execution (explosively drive upward with legs)) `pp.legs`
- Ugięcie krótkie, tułów napięty. — ExRx.net: [PushPress](https://web.archive.org/web/20220802212347/https://exrx.net/WeightExercises/OlympicLifts/PushPress) (Preparation; Execution (torso tight; dip slightly)); ACE: [Push Press (#24)](https://www.acefitness.org/resources/everyone/exercise-library/24/push-press/) (opis (bend at the knees while keeping the back straight)) `pp.dip`

### Wyciskanie nad głowę (linki)

**Ustawienie**

- Stań lub usiądź między dolnymi bloczkami; uchwyty przy barkach, łokcie w dół, nadgarstki nad łokciami. — ExRx.net: [CBStandingShoulderPress](https://web.archive.org/web/20230306032138/https://exrx.net/WeightExercises/DeltoidAnterior/CBStandingShoulderPress) (Preparation); ACE: [Seated Shoulder Press (#186)](https://www.acefitness.org/resources/everyone/exercise-library/186/seated-shoulder-press/) (Step 1 (handles level with the shoulders, wrists in line with the forearms; maszyna — ta sama pozycja)) `cohp.setup`

**Ruch**

- Wypchnij ciężar nad głowę do wyprostu rąk; opuść go z powrotem do barków. — ExRx.net: [CBStandingShoulderPress](https://web.archive.org/web/20230306032138/https://exrx.net/WeightExercises/DeltoidAnterior/CBStandingShoulderPress) (Execution); ACE: [Standing Shoulder Press (#71)](https://www.acefitness.org/resources/everyone/exercise-library/71/standing-shoulder-press/) (opis (sztanga — ten sam ruch)) `ohp.move`

**Wskazówki**

- Łokcie pod nadgarstkami przez cały ruch. — ExRx.net: [CBStandingShoulderPress](https://web.archive.org/web/20230306032138/https://exrx.net/WeightExercises/DeltoidAnterior/CBStandingShoulderPress) (Comments (wrists above each elbow)); ACE: [Seated Shoulder Press (#186)](https://www.acefitness.org/resources/everyone/exercise-library/186/seated-shoulder-press/) (Step 1; Step 2) `ohp.elbowsUnder`
- Tułów wysoko i stabilnie; ciężar idzie prosto w górę nad głowę. — ACE: [Standing Shoulder Press (#71)](https://www.acefitness.org/resources/everyone/exercise-library/71/standing-shoulder-press/) (opis); ExRx.net: [CBStandingShoulderPress](https://web.archive.org/web/20230306032138/https://exrx.net/WeightExercises/DeltoidAnterior/CBStandingShoulderPress) (Execution) `ohp.tall`

### Lateral Raise (hantle)

**Ustawienie**

- Stań z hantlami przy udach, łokcie lekko ugięte, tułów stabilny. — ACE: [Lateral Raise (#26)](https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/) (Step 1; Step 2); ExRx.net: [DBLateralRaise](https://web.archive.org/web/20240105210847/https://exrx.net/WeightExercises/DeltoidLateral/DBLateralRaise) (Preparation) `lat.setup`

**Ruch**

- Unieś ramiona bokiem, potem opuść je powoli. — ACE: [Lateral Raise (#26)](https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/) (Step 3; Step 4); ExRx.net: [DBLateralRaise](https://web.archive.org/web/20240105210847/https://exrx.net/WeightExercises/DeltoidLateral/DBLateralRaise) (Execution) `lat.move`

**Wskazówki**

- Łokcie lekko ugięte i prowadzą ruch — są na wysokości dłoni lub wyżej. — ACE: [Lateral Raise (#26)](https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/) (Step 3 (elbows and upper arms rise slightly ahead of the forearms)); ExRx.net: [DBLateralRaise](https://web.archive.org/web/20240105210847/https://exrx.net/WeightExercises/DeltoidLateral/DBLateralRaise) (Execution; Comments (elbows above or equal to wrists)) `lat.elbows`
- Unoś mniej więcej do wysokości barków. — ACE: [Lateral Raise (#26)](https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/) (Step 3 (until your arms are level with your shoulders)); ExRx.net: [DBLateralRaise](https://web.archive.org/web/20240105210847/https://exrx.net/WeightExercises/DeltoidLateral/DBLateralRaise) (Execution (until elbows are shoulder height)) `lat.height`

### Cable Lateral Raise

**Ustawienie**

- Złap uchwyt dolnego wyciągu, łokieć lekko ugięty, tułów stabilny. — ExRx.net: [CBOneArmLateralRaise](https://web.archive.org/web/20231121100641/https://exrx.net/WeightExercises/DeltoidLateral/CBOneArmLateralRaise) (Preparation; Execution (elbow slightly bent)); ACE: [Lateral Raise (#26)](https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/) (Step 1; Step 2 (slight bend; bracing)) `clat.setup`

**Ruch**

- Unieś ramiona bokiem, potem opuść je powoli. — ExRx.net: [CBOneArmLateralRaise](https://web.archive.org/web/20231121100641/https://exrx.net/WeightExercises/DeltoidLateral/CBOneArmLateralRaise) (Execution); ACE: [Lateral Raise (#26)](https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/) (Step 3; Step 4 (hantle — ten sam ruch)) `lat.move`

**Wskazówki**

- Łokcie lekko ugięte i prowadzą ruch — są na wysokości dłoni lub wyżej. — ExRx.net: [CBOneArmLateralRaise](https://web.archive.org/web/20231121100641/https://exrx.net/WeightExercises/DeltoidLateral/CBOneArmLateralRaise) (Comments (fixed, slightly bent elbow)); ACE: [Lateral Raise (#26)](https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/) (Step 3) `lat.elbows`
- Unoś mniej więcej do wysokości barków. — ExRx.net: [CBLateralRaise](https://web.archive.org/web/20230306032138/https://exrx.net/WeightExercises/DeltoidLateral/CBLateralRaise) (Execution (until elbows are shoulder height)); ACE: [Lateral Raise (#26)](https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/) (Step 3) `lat.height`

### Front Raise

**Ustawienie**

- Stań z hantlami przed udami, łokcie proste lub lekko ugięte. — ACE: [Front Raise (#54)](https://www.acefitness.org/resources/everyone/exercise-library/54/front-raise/) (Step 1); ExRx.net: [DBFrontRaise](https://web.archive.org/web/20220816182633/https://exrx.net/WeightExercises/DeltoidAnterior/DBFrontRaise) (Preparation) `front.setup`

**Ruch**

- Unieś ręce przed sobą, potem opuść je powoli. — ACE: [Front Raise (#54)](https://www.acefitness.org/resources/everyone/exercise-library/54/front-raise/) (Step 3; Step 4); ExRx.net: [DBFrontRaise](https://web.archive.org/web/20220816182633/https://exrx.net/WeightExercises/DeltoidAnterior/DBFrontRaise) (Execution; Comments (height just above horizontal)) `front.move`

**Wskazówki**

- Łokcie proste lub lekko ugięte — w tym samym ustawieniu przez cały ruch. — ACE: [Front Raise (#54)](https://www.acefitness.org/resources/everyone/exercise-library/54/front-raise/) (Step 1; Step 4 (elbows extended or holding a slight bend)); ExRx.net: [DBFrontRaise](https://web.archive.org/web/20220816182633/https://exrx.net/WeightExercises/DeltoidAnterior/DBFrontRaise) (Comments (elbows straight or slightly bent throughout)) `front.elbows`
- Unoś mniej więcej do wysokości barków. — ACE: [Front Raise (#54)](https://www.acefitness.org/resources/everyone/exercise-library/54/front-raise/) (Step 3 (level with your shoulders)); ExRx.net: [DBFrontRaise](https://web.archive.org/web/20220816182633/https://exrx.net/WeightExercises/DeltoidAnterior/DBFrontRaise) (Comments (height just above horizontal may be adequate)) `lat.height`

### Reverse Fly (hantle)

**Ustawienie**

- Pochyl tułów prawie poziomo z prostymi plecami (albo oprzyj klatkę o skośną ławkę); hantle zwisają, łokcie lekko ugięte. — ExRx.net: [DBRearLateralRaise](https://web.archive.org/web/20220525000244/https://exrx.net/WeightExercises/DeltoidPosterior/DBRearLateralRaise) (Preparation); ACE: [Incline Reverse Fly (#34)](https://www.acefitness.org/resources/everyone/exercise-library/34/incline-reverse-fly/) (Step 1 (chest-supported on an incline bench)) `rear.setup`

**Ruch**

- Unieś ramiona bokiem do wysokości barków, prostopadle do tułowia; opuść powoli. — ExRx.net: [DBRearLateralRaise](https://web.archive.org/web/20220525000244/https://exrx.net/WeightExercises/DeltoidPosterior/DBRearLateralRaise) (Execution); ACE: [Incline Reverse Fly (#34)](https://www.acefitness.org/resources/everyone/exercise-library/34/incline-reverse-fly/) (Step 2; Step 3) `rear.move`

**Wskazówki**

- Ramiona idą w bok, nie w tył — dłonie kończą ruch mniej więcej na linii barków. — ExRx.net: [DBRearLateralRaise](https://web.archive.org/web/20220525000244/https://exrx.net/WeightExercises/DeltoidPosterior/DBRearLateralRaise) (Execution; Comments (upper arms perpendicular to torso)); ACE: [Incline Reverse Fly (#34)](https://www.acefitness.org/resources/everyone/exercise-library/34/incline-reverse-fly/) (Step 2; wskazówka końcowa (dumbbells in line with the ears, not behind the head)) `rear.arms`
- Kąt w łokciach stały przez cały ruch. — ExRx.net: [DBRearLateralRaise](https://web.archive.org/web/20220525000244/https://exrx.net/WeightExercises/DeltoidPosterior/DBRearLateralRaise) (Execution (fixed elbow position)); ACE: [Incline Reverse Fly (#34)](https://www.acefitness.org/resources/everyone/exercise-library/34/incline-reverse-fly/) (Step 1; Step 2 (elbows slightly flexed)) `rear.elbows`

### Reverse Pec Deck

**Ustawienie**

- Usiądź przodem do oparcia, klatka przy podporze; uchwyty na wysokości barków. — ExRx.net: [LVReverseFlyPronated](https://web.archive.org/web/20240126173713/https://exrx.net/WeightExercises/DeltoidPosterior/LVReverseFlyPronated) (Preparation); ACE: [Incline Reverse Fly (#34)](https://www.acefitness.org/resources/everyone/exercise-library/34/incline-reverse-fly/) (Step 1 (face the backrest, torso against it; hantle — ta sama pozycja)) `rpd.setup`

**Ruch**

- Rozciągnij ręce w bok i w tył, aż łokcie znajdą się tuż za linią pleców; wracaj powoli. — ExRx.net: [LVRearLateralRaise](https://web.archive.org/web/20231031202541/https://exrx.net/WeightExercises/DeltoidPosterior/LVRearLateralRaise) (Execution); ACE: [Reverse Fly (#353)](https://www.acefitness.org/resources/everyone/exercise-library/353/reverse-fly/) (opis (spread both arms apart; linki — ten sam ruch)) `rpd.move`

**Wskazówki**

- Łokcie wysoko, na wysokości barków. — ExRx.net: [LVReverseFlyPronated](https://web.archive.org/web/20240126173713/https://exrx.net/WeightExercises/DeltoidPosterior/LVReverseFlyPronated) (Execution; Comments); ACE: [Incline Reverse Fly (#34)](https://www.acefitness.org/resources/everyone/exercise-library/34/incline-reverse-fly/) (Step 2 (arms near level with the shoulders)) `rpd.elbowsHigh`
- Kąt w łokciach stały przez cały ruch. — ExRx.net: [LVRearLateralRaise](https://web.archive.org/web/20231031202541/https://exrx.net/WeightExercises/DeltoidPosterior/LVRearLateralRaise) (Preparation (slightly bend elbows)); ACE: [Incline Reverse Fly (#34)](https://www.acefitness.org/resources/everyone/exercise-library/34/incline-reverse-fly/) (Step 1; Step 2) `rear.elbows`

### Lying Leg Curl

**Ustawienie**

- Połóż się przodem; kolana na wysokości osi maszyny, wałek nad piętami na dolnej części łydek. — ACE: [Lying Hamstrings Curl (#153)](https://www.acefitness.org/resources/everyone/exercise-library/153/lying-hamstrings-curl/) (Step 1); NASM: [Lying Leg Curl](https://www.nasm.org/resource-center/exercise-library/lying-leg-curl) (Step 1 (pad just above your ankles)) `llc.setup`

**Ruch**

- Zegnij kolana, przyciągając wałek w stronę pośladków; opuść go powoli. — ACE: [Lying Hamstrings Curl (#153)](https://www.acefitness.org/resources/everyone/exercise-library/153/lying-hamstrings-curl/) (Step 2–4); NASM: [Lying Leg Curl](https://www.nasm.org/resource-center/exercise-library/lying-leg-curl) (Step 3; Step 4) `llc.move`

**Wskazówki**

- Biodra przyciśnięte do ławki — bez wyginania pleców. — ACE: [Lying Hamstrings Curl (#153)](https://www.acefitness.org/resources/everyone/exercise-library/153/lying-hamstrings-curl/) (Step 2; wskazówka końcowa (avoid arching, stabilize the low back)); NASM: [Lying Leg Curl](https://www.nasm.org/resource-center/exercise-library/lying-leg-curl) (Step 1; Common Mistakes (hips shift)) `llc.hips`
- Ruch płynny w obie strony, bez szarpania. — ACE: [Lying Hamstrings Curl (#153)](https://www.acefitness.org/resources/everyone/exercise-library/153/lying-hamstrings-curl/) (Step 2; Step 4 (controlled manner)); NASM: [Lying Leg Curl](https://www.nasm.org/resource-center/exercise-library/lying-leg-curl) (Common Mistakes (jerky movements)) `llc.control`

### Crunch

**Ustawienie**

- Połóż się na plecach, kolana ugięte, dłonie przy głowie. — ACE: [Crunch (#52)](https://www.acefitness.org/resources/everyone/exercise-library/52/crunch/) (Step 1; Step 2); ExRx.net: [BWCrunch](https://web.archive.org/web/20230523091650/https://exrx.net/WeightExercises/RectusAbdominis/BWCrunch) (Preparation) `crunch.setup`

**Ruch**

- Zbliżaj żebra do miednicy, unosząc łopatki od podłogi; wracaj powoli. — ACE: [Crunch (#52)](https://www.acefitness.org/resources/everyone/exercise-library/52/crunch/) (Step 3; Step 4); ExRx.net: [BWCrunch](https://web.archive.org/web/20230523091650/https://exrx.net/WeightExercises/RectusAbdominis/BWCrunch) (Execution) `crunch.move`

**Wskazówki**

- Dolna część pleców zostaje na podłodze. — ACE: [Crunch (#52)](https://www.acefitness.org/resources/everyone/exercise-library/52/crunch/) (Step 3 (lower back remains in contact with the mat)); ExRx.net: [BWCrunch](https://web.archive.org/web/20230523091650/https://exrx.net/WeightExercises/RectusAbdominis/BWCrunch) (Execution (keep low back on mat)) `crunch.lowBack`
- Szyja rozluźniona — nie ciągnij głowy rękami. — ACE: [Crunch (#52)](https://www.acefitness.org/resources/everyone/exercise-library/52/crunch/) (Step 3; wskazówka końcowa (neck stays relaxed)); ExRx.net: [BWCrunch](https://web.archive.org/web/20230523091650/https://exrx.net/WeightExercises/RectusAbdominis/BWCrunch) (Comments (neck in neutral position)) `crunch.neck`

### Hack Squat

**Ustawienie**

- Oprzyj plecy o oparcie maszyny, stopy na platformie mniej więcej na szerokość bioder. — ExRx.net: [SLHackSquat](https://web.archive.org/web/20220924004705/https://exrx.net/WeightExercises/Quadriceps/SLHackSquat) (Preparation); ACE: [Seated Leg Press (#154)](https://www.acefitness.org/resources/everyone/exercise-library/154/seated-leg-press/) (Step 1 (prasa — ta sama zasada oparcia)) `hack.setup`

**Ruch**

- Opuść się, uginając biodra i kolana, potem wstań, prostując nogi. — ExRx.net: [SLHackSquat](https://web.archive.org/web/20220924004705/https://exrx.net/WeightExercises/Quadriceps/SLHackSquat) (Execution); ACE: [Seated Leg Press (#154)](https://www.acefitness.org/resources/everyone/exercise-library/154/seated-leg-press/) (Step 2–4) `hack.move`

**Wskazówki**

- Pchaj całą stopą — pięty nie odrywają się od platformy. — ExRx.net: [SLHackSquat](https://web.archive.org/web/20220924004705/https://exrx.net/WeightExercises/Quadriceps/SLHackSquat) (Comments (do not allow heels to raise)); ACE: [Seated Leg Press (#154)](https://www.acefitness.org/resources/everyone/exercise-library/154/seated-leg-press/) (Step 2; Step 3) `lp.heels`
- Nie schodź tak nisko, by miednica odrywała się od oparcia, a dolne plecy zaokrąglały. — ExRx.net: [SLHackSquat](https://web.archive.org/web/20220924004705/https://exrx.net/WeightExercises/Quadriceps/SLHackSquat) (Comments (pelvis pulls away from back pad)); ACE: [Seated Leg Press (#154)](https://www.acefitness.org/resources/everyone/exercise-library/154/seated-leg-press/) (Step 3; Step 4) `lp.hips`
- Kolana idą w linii palców stóp — nie zapadają się do środka. — ExRx.net: [SLHackSquat](https://web.archive.org/web/20220924004705/https://exrx.net/WeightExercises/Quadriceps/SLHackSquat) (Comments (knees pointed same direction as feet)); NASM: [Leg Press](https://www.nasm.org/resource-center/exercise-library/leg-press) (Common Mistakes (knees cave inward; prasa — ta sama zasada)) `sq.kneesToes`

### Plank

**Ustawienie**

- Oprzyj się na przedramionach, łokcie dokładnie pod barkami, nogi wyprostowane. — ACE: [Front Plank (#32)](https://www.acefitness.org/resources/everyone/exercise-library/32/front-plank/) (Step 1); NASM: [Plank](https://www.nasm.org/resource-center/exercise-library/plank) (Step 1: Setup) `plank.setup`

**Ruch**

- Unieś tułów i trzymaj ciało w jednej linii od głowy do pięt; oddychaj normalnie. — ACE: [Front Plank (#32)](https://www.acefitness.org/resources/everyone/exercise-library/32/front-plank/) (Step 2); NASM: [Plank](https://www.nasm.org/resource-center/exercise-library/plank) (Step 2; Step 3) `plank.move`

**Wskazówki**

- Biodra nie opadają ani nie unoszą się. — ACE: [Front Plank (#32)](https://www.acefitness.org/resources/everyone/exercise-library/32/front-plank/) (Step 2 (avoid sagging or hiking)); NASM: [Plank](https://www.nasm.org/resource-center/exercise-library/plank) (Step 2; Common Mistakes) `plank.noSag`
- Napnij brzuch, żeby tułów był sztywny. — ACE: [Front Plank (#32)](https://www.acefitness.org/resources/everyone/exercise-library/32/front-plank/) (Step 1 (contract your core to stiffen your torso)); NASM: [Plank](https://www.nasm.org/resource-center/exercise-library/plank) (Step 2 (engage your core)) `plank.brace`

**Czego unikać**

- Opadające biodra i wygięte w łuk lędźwie. — NASM: [Plank](https://www.nasm.org/resource-center/exercise-library/plank) (Common Mistakes); ACE: [Front Plank (#32)](https://www.acefitness.org/resources/everyone/exercise-library/32/front-plank/) (Step 2) `plank.mis.sag`
- Wstrzymywanie oddechu. — NASM: [Plank](https://www.nasm.org/resource-center/exercise-library/plank) (Common Mistakes (holding the breath)); ACE: [Front Plank (#32)](https://www.acefitness.org/resources/everyone/exercise-library/32/front-plank/) (Step 2 (continue to breathe)) `plank.mis.breath`

### Side Plank

**Ustawienie**

- Połóż się na boku, łokieć dokładnie pod barkiem, stopy jedna na drugiej. — ACE: [Side Plank (#303)](https://www.acefitness.org/resources/everyone/exercise-library/303/side-plank/) (opis); NASM: [Side Plank](https://www.nasm.org/resource-center/exercise-library/side-plank) (Step 1; Step 2) `splank.setup`

**Ruch**

- Unieś biodra, aż ciało utworzy prostą linię od głowy do stóp; wytrzymaj i zmień stronę. — ACE: [Side Plank (#303)](https://www.acefitness.org/resources/everyone/exercise-library/303/side-plank/) (opis); NASM: [Side Plank](https://www.nasm.org/resource-center/exercise-library/side-plank) (Step 2; Step 3; Step 4) `splank.move`

**Wskazówki**

- Biodra nie opadają i nie skręcają się w przód ani w tył. — NASM: [Side Plank](https://www.nasm.org/resource-center/exercise-library/side-plank) (Step 3; Common Mistakes); ACE: [Side Plank (#303)](https://www.acefitness.org/resources/everyone/exercise-library/303/side-plank/) (opis (body in a straight line)) `splank.noSag`
- Napnij brzuch, żeby tułów był sztywny. — ACE: [Side Plank (#303)](https://www.acefitness.org/resources/everyone/exercise-library/303/side-plank/) (opis (squeeze the muscles of the stomach and glutes)); NASM: [Side Plank](https://www.nasm.org/resource-center/exercise-library/side-plank) (Step 2 (engage your core)) `plank.brace`

**Czego unikać**

- Łokieć wysunięty przed bark albo cofnięty za niego. — NASM: [Side Plank](https://www.nasm.org/resource-center/exercise-library/side-plank) (Common Mistakes); ACE: [Side Plank (#303)](https://www.acefitness.org/resources/everyone/exercise-library/303/side-plank/) (opis (elbow directly under the shoulder)) `splank.mis.elbow`

### Dead Bug

**Ustawienie**

- Połóż się na plecach, ręce wyprostowane w górę, biodra i kolana ugięte pod kątem prostym. — ACE: [Supine Dead Bug (#147)](https://www.acefitness.org/resources/everyone/exercise-library/147/supine-dead-bug/) (Step 2 (knees over hips bent 90°, elbows over shoulders)); NASM: [Dead Bug](https://www.nasm.org/resource-center/exercise-library/dead-bug) (Step 1: Setup) `db.setup`

**Ruch**

- Powoli opuść przeciwną rękę i nogę w stronę podłogi, nie kładąc ich; wróć i zmień strony. — ACE: [Supine Dead Bug (#147)](https://www.acefitness.org/resources/everyone/exercise-library/147/supine-dead-bug/) (Step 3); NASM: [Dead Bug](https://www.nasm.org/resource-center/exercise-library/dead-bug) (Step 3; Step 4) `db.move`

**Wskazówki**

- Lędźwie przy podłodze — nie wyginaj pleców w łuk. — NASM: [Dead Bug](https://www.nasm.org/resource-center/exercise-library/dead-bug) (Step 2; Common Mistakes); ACE: [Supine Dead Bug (#147)](https://www.acefitness.org/resources/everyone/exercise-library/147/supine-dead-bug/) (Step 1 (without increasing the arch in your low back)) `db.back`
- Ruszaj się powoli i oddychaj normalnie. — NASM: [Dead Bug](https://www.nasm.org/resource-center/exercise-library/dead-bug) (Common Mistakes; FAQ (movement speed)); ACE: [Supine Dead Bug (#147)](https://www.acefitness.org/resources/everyone/exercise-library/147/supine-dead-bug/) (Step 3; wskazówka końcowa (continue to breathe)) `db.slow`

**Czego unikać**

- Wstrzymywanie oddechu. — NASM: [Dead Bug](https://www.nasm.org/resource-center/exercise-library/dead-bug) (Common Mistakes); ACE: [Supine Dead Bug (#147)](https://www.acefitness.org/resources/everyone/exercise-library/147/supine-dead-bug/) (wskazówka końcowa) `plank.mis.breath`

### Bird Dog

**Ustawienie**

- Klęk podparty: dłonie pod barkami, kolana pod biodrami, plecy neutralnie. — ACE: [Bird Dog (#14)](https://www.acefitness.org/resources/everyone/exercise-library/14/bird-dog/) (Step 1–3); NASM: [Bird Dog](https://www.nasm.org/resource-center/exercise-library/bird-dog) (Step 1; Step 2); ExRx.net: [BWBirdDog](https://web.archive.org/web/20230531114932/https://exrx.net/WeightExercises/ErectorSpinae/BWBirdDog) (Preparation) `bd.setup`

**Ruch**

- Unieś jednocześnie przeciwną rękę i nogę do linii tułowia; wróć i zmień strony. — ACE: [Bird Dog (#14)](https://www.acefitness.org/resources/everyone/exercise-library/14/bird-dog/) (Step 4; Step 5; Step 7); NASM: [Bird Dog](https://www.nasm.org/resource-center/exercise-library/bird-dog) (Step 3; Step 4); ExRx.net: [BWBirdDog](https://web.archive.org/web/20230531114932/https://exrx.net/WeightExercises/ErectorSpinae/BWBirdDog) (Execution) `bd.move`

**Wskazówki**

- Biodra i barki równolegle do podłogi — bez skręcania tułowia. — ACE: [Bird Dog (#14)](https://www.acefitness.org/resources/everyone/exercise-library/14/bird-dog/) (Step 4; Step 5); NASM: [Bird Dog](https://www.nasm.org/resource-center/exercise-library/bird-dog) (Common Mistakes (spine rotate, hips shift)) `bd.level`
- Unoś kończyny powoli, bez szarpania. — ExRx.net: [BWBirdDog](https://web.archive.org/web/20230531114932/https://exrx.net/WeightExercises/ErectorSpinae/BWBirdDog) (Comments (deliberately, no jerking)); NASM: [Bird Dog](https://www.nasm.org/resource-center/exercise-library/bird-dog) (Common Mistakes (jerky movements)) `bd.slow`
- Unoś rękę i nogę tylko tak wysoko, jak utrzymasz lędźwie bez wyginania. — ACE: [Bird Dog (#14)](https://www.acefitness.org/resources/everyone/exercise-library/14/bird-dog/) (Step 6); NASM: [Bird Dog](https://www.nasm.org/resource-center/exercise-library/bird-dog) (Common Mistakes (extending limbs too far)) `bd.range`

### Russian Twist

**Ustawienie**

- Usiądź, odchyl tułów lekko w tył z prostymi plecami, kolana ugięte; ciężar trzymaj przed klatką. — NASM: [Russian Twist](https://www.nasm.org/resource-center/exercise-library/russian-twist) (Step 1; Step 2); ACE: [V Twist (#305)](https://www.acefitness.org/resources/everyone/exercise-library/305/v-twist/) (opis (lean back about 45°, straight back)) `rt.setup`

**Ruch**

- Obracaj tułów raz w jedną, raz w drugą stronę, prowadząc ruch barkami. — NASM: [Russian Twist](https://www.nasm.org/resource-center/exercise-library/russian-twist) (Step 3; Step 4); ACE: [V Twist (#305)](https://www.acefitness.org/resources/everyone/exercise-library/305/v-twist/) (opis (rotate the shoulders from side to side)) `rt.move`

**Wskazówki**

- Plecy proste — nie garb się przy obrocie. — NASM: [Russian Twist](https://www.nasm.org/resource-center/exercise-library/russian-twist) (Common Mistakes (rounding the spine)); ACE: [V Twist (#305)](https://www.acefitness.org/resources/everyone/exercise-library/305/v-twist/) (opis (maintaining a straight back)) `rt.back`
- Obracaj się płynnie, bez rzucania ciężarem. — NASM: [Russian Twist](https://www.nasm.org/resource-center/exercise-library/russian-twist) (Common Mistakes (momentum, jerky rotations)); ACE: [Russian Twist (#65)](https://www.acefitness.org/resources/everyone/exercise-library/65/russian-twist/) (opis (twist through the stomach and shoulders; wersja na piłce)) `rt.control`

### Mountain Climbers

**Ustawienie**

- Podpór na prostych rękach, dłonie pod barkami lub trochę przed nimi; jedna noga ugięta pod klatką, druga wyprostowana w tył. — ACE: [Mountain Climbers (#258)](https://www.acefitness.org/resources/everyone/exercise-library/258/mountain-climbers/) (Step 1); ExRx.net: [STMountainClimber](https://web.archive.org/web/20190922161058/https://www.exrx.net/WeightExercises/HipFlexors/STMountainClimber) (Preparation (wersja z taśmami — ta sama pozycja)) `mc.setup`

**Ruch**

- Zmieniaj nogi jednocześnie: ugiętą prostuj w tył, a prostą przyciągaj pod klatkę. — ACE: [Mountain Climbers (#258)](https://www.acefitness.org/resources/everyone/exercise-library/258/mountain-climbers/) (Step 2); ExRx.net: [STMountainClimber](https://web.archive.org/web/20190922161058/https://www.exrx.net/WeightExercises/HipFlexors/STMountainClimber) (Execution) `mc.move`

**Wskazówki**

- Przy każdej zmianie wyprostuj tylną nogę do końca. — ExRx.net: [STMountainClimber](https://web.archive.org/web/20190922161058/https://www.exrx.net/WeightExercises/HipFlexors/STMountainClimber) (Comments (straighten hip each stroke)); ACE: [Mountain Climbers (#258)](https://www.acefitness.org/resources/everyone/exercise-library/258/mountain-climbers/) (Step 2 (fully extending … behind you)) `mc.straight`
- Tułów stabilny, biodra cały czas na podobnej wysokości. — ExRx.net: [STMountainClimber](https://web.archive.org/web/20190922161058/https://www.exrx.net/WeightExercises/HipFlexors/STMountainClimber) (Comments (maintaining approximate height of hips)); ACE: [Mountain Climbers (#258)](https://www.acefitness.org/resources/everyone/exercise-library/258/mountain-climbers/) (Step 1; Step 2 (abs engaged, brace to stabilize your spine)) `mc.stable`

### Rowing Machine

**Ustawienie**

- Zapnij stopy; w pozycji wyjściowej ręce proste, tułów pochylony w biodrach, piszczele mniej więcej pionowo. — Concept2: [Indoor Rowing Technique](https://www.concept2.com/training/rowing-technique) (The Catch); ACE: [Reap the Benefits of Rowing With 3 Fast and Efficient Workouts (blog, 2016)](https://www.acefitness.org/resources/everyone/blog/5881/reap-the-benefits-of-rowing-with-3-fast-and-efficient-workouts/) (The Catch: Starting Position) `erg.setup`

**Ruch**

- Pociągnięcie: najpierw nogi, potem odchylenie tułowia, na końcu ręce. — Concept2: [Indoor Rowing Technique](https://www.concept2.com/training/rowing-technique) (The Drive); ACE: [Reap the Benefits of Rowing With 3 Fast and Efficient Workouts (blog, 2016)](https://www.acefitness.org/resources/everyone/blog/5881/reap-the-benefits-of-rowing-with-3-fast-and-efficient-workouts/) (The Drive: Work) `erg.drive`
- Powrót w odwrotnej kolejności: ręce, tułów, dopiero potem ugięcie kolan. — Concept2: [Indoor Rowing Technique](https://www.concept2.com/training/rowing-technique) (The Recovery); ACE: [Reap the Benefits of Rowing With 3 Fast and Efficient Workouts (blog, 2016)](https://www.acefitness.org/resources/everyone/blog/5881/reap-the-benefits-of-rowing-with-3-fast-and-efficient-workouts/) (The Recovery: Rest) `erg.recovery`

**Wskazówki**

- Prowadź uchwyt w linii prostej do koła zamachowego i z powrotem. — Concept2: [Indoor Rowing Technique](https://www.concept2.com/training/rowing-technique) (The Drive (hands move in a straight line)); ACE: [Reap the Benefits of Rowing With 3 Fast and Efficient Workouts (blog, 2016)](https://www.acefitness.org/resources/everyone/blog/5881/reap-the-benefits-of-rowing-with-3-fast-and-efficient-workouts/) (The Drive (arms in a straight line to and from the flywheel)) `erg.handle`
- Na końcu pociągnięcia nogi proste, tułów lekko odchylony, uchwyt tuż pod żebrami. — Concept2: [Indoor Rowing Technique](https://www.concept2.com/training/rowing-technique) (The Finish); ACE: [Reap the Benefits of Rowing With 3 Fast and Efficient Workouts (blog, 2016)](https://www.acefitness.org/resources/everyone/blog/5881/reap-the-benefits-of-rowing-with-3-fast-and-efficient-workouts/) (The Finish: Stabilize) `erg.finish`

### Box Jump

**Ustawienie**

- Stań przed stabilną skrzynią, stopy na szerokość bioder lub węziej; wybierz wysokość, na którą pewnie wskoczysz. — ACE: [Box Jumps (#115)](https://www.acefitness.org/resources/everyone/exercise-library/115/box-jumps/) (Step 1; wskazówka końcowa (height should not exceed your vertical jump)); NASM: [Box Jumps](https://www.nasm.org/resource-center/exercise-library/box-jumps) (Step 1: Setup) `bj.setup`

**Ruch**

- Krótkie ugięcie z zamachem rąk, wybij się, prostując biodra, kolana i stawy skokowe; wyląduj obiema stopami na skrzyni. — ACE: [Box Jumps (#115)](https://www.acefitness.org/resources/everyone/exercise-library/115/box-jumps/) (Step 2; Step 3); NASM: [Box Jumps](https://www.nasm.org/resource-center/exercise-library/box-jumps) (Step 3: Execute/Drive) `bj.move`

**Wskazówki**

- Ląduj miękko: ugięte kolana, biodra cofnięte w tył. — ACE: [Box Jumps (#115)](https://www.acefitness.org/resources/everyone/exercise-library/115/box-jumps/) (Step 4–6); NASM: [Box Jumps](https://www.nasm.org/resource-center/exercise-library/box-jumps) (Common Mistakes (landing with straight knees)) `bj.land`
- Zacznij od niskiej skrzyni i podnoś ją dopiero, gdy lądowanie jest pewne. — ACE: [Box Jumps (#115)](https://www.acefitness.org/resources/everyone/exercise-library/115/box-jumps/) (Step 1; Step 7; wskazówka końcowa); NASM: [Box Jumps](https://www.nasm.org/resource-center/exercise-library/box-jumps) (Common Mistakes; FAQ (box height for beginners)) `bj.height`

**Czego unikać**

- Lądowanie na sztywnych, wyprostowanych nogach. — NASM: [Box Jumps](https://www.nasm.org/resource-center/exercise-library/box-jumps) (Common Mistakes); ACE: [Box Jumps (#115)](https://www.acefitness.org/resources/everyone/exercise-library/115/box-jumps/) (Step 5 (avoid locking your knees)) `bj.mis.stiff`

### Bench Press (sztanga)

**Ustawienie**

- Głowa, barki i pośladki na ławce, stopy pewnie na podłodze. — ACE: [Chest Press (#5)](https://www.acefitness.org/resources/everyone/exercise-library/5/chest-press/) (opis (press the feet into the ground and the hips into the bench)); NASM: [Barbell Bench Press](https://www.nasm.org/resource-center/exercise-library/barbell-bench-press) (Step 1: Setup); Stronger by Science: [How to Bench Press: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-bench/) (Foot position (butt won’t come off the bench)); NSCA: [Sands, Wurth, Hewit: NSCA — Basics of Strength and Conditioning Manual, NSCA 2012](https://www.nsca.com/uploadedFiles/NSCA/Resources/PDF/Publications/basics_of_strength_and_conditioning_manual.pdf) (Bench press, setup: five-point body contact position (head, shoulders and upper back, buttocks, both feet)) `bp.contact`
- Chwyć sztangę nieco szerzej niż barki. — ACE: [Chest Press (#5)](https://www.acefitness.org/resources/everyone/exercise-library/5/chest-press/) (opis (slightly wider than shoulder-width)); NASM: [Barbell Bench Press](https://www.nasm.org/resource-center/exercise-library/barbell-bench-press) (Step 2; FAQ (grip width)); ExRx.net: [BBBenchPress](https://web.archive.org/web/20230320115018/https://exrx.net/WeightExercises/PectoralSternal/BBBenchPress) (Preparation) `bp.grip`

**Ruch**

- Opuść sztangę kontrolowanie do klatki, potem wypchnij ją w górę do wyprostu rąk. — ACE: [Chest Press (#5)](https://www.acefitness.org/resources/everyone/exercise-library/5/chest-press/) (opis); NASM: [Barbell Bench Press](https://www.nasm.org/resource-center/exercise-library/barbell-bench-press) (Step 3; Step 4); ExRx.net: [BBBenchPress](https://web.archive.org/web/20230320115018/https://exrx.net/WeightExercises/PectoralSternal/BBBenchPress) (Execution); Stronger by Science: [How to Bench Press: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-bench/) (Descent; Ascent) `bp.move`

**Wskazówki**

- Ściągnij łopatki do siebie i w dół i utrzymaj je tak przez cały ruch. — NASM: [Barbell Bench Press](https://www.nasm.org/resource-center/exercise-library/barbell-bench-press) (Step 2 (retract your shoulder blades)); Stronger by Science: [How to Bench Press: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-bench/) (Scapular position) `bp.blades`
- Łokcie ustaw pośrodku — ani przyklejone do tułowia, ani szeroko na boki. — NASM: [Barbell Bench Press](https://www.nasm.org/resource-center/exercise-library/barbell-bench-press) (Common Mistakes (elbows too wide or too close)); Stronger by Science: [How to Bench Press: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-bench/) (FAQ „How much should I tuck my elbows?”) `bp.elbowsMid`
- Opuszczaj ciężar powoli — bez odbijania od klatki. — Stronger by Science: [How to Bench Press: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-bench/) (Descent (lower the bar under control)); NASM: [Barbell Bench Press](https://www.nasm.org/resource-center/exercise-library/barbell-bench-press) (Common Mistakes (lowering the bar too quickly)) `bp.control`

**Czego unikać**

- Nadmierne wyginanie lędźwi albo odrywanie pośladków od ławki, żeby wycisnąć więcej. — NASM: [Barbell Bench Press](https://www.nasm.org/resource-center/exercise-library/barbell-bench-press) (Common Mistakes (excessive lower back arching)); Stronger by Science: [How to Bench Press: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-bench/) (Foot position (butt won’t come off the bench)); NSCA: [Sands, Wurth, Hewit: NSCA — Basics of Strength and Conditioning Manual, NSCA 2012](https://www.nsca.com/uploadedFiles/NSCA/Resources/PDF/Publications/basics_of_strength_and_conditioning_manual.pdf) (s. 54 (nie wyginać pleców i nie unosić klatki do sztangi)) `bp.mis.arch`

### Incline Bench Press (sztanga)

**Ustawienie**

- Połóż się na ławce skośnej: plecy i pośladki oparte, stopy na podłodze. — NASM: [Incline Barbell Bench Press](https://www.nasm.org/resource-center/exercise-library/incline-barbell-bench-press) (Step 1: Setup); ExRx.net: [BBInclineBenchPress](https://web.archive.org/web/20230302054321/https://exrx.net/WeightExercises/PectoralClavicular/BBInclineBenchPress) (Preparation) `ibp.setup`
- Chwyć sztangę nieco szerzej niż barki. — NASM: [Incline Barbell Bench Press](https://www.nasm.org/resource-center/exercise-library/incline-barbell-bench-press) (Step 2; FAQ (grip width)); ExRx.net: [BBInclineBenchPress](https://web.archive.org/web/20230302054321/https://exrx.net/WeightExercises/PectoralClavicular/BBInclineBenchPress) (Preparation (wide oblique overhand grip)) `bp.grip`

**Ruch**

- Opuść sztangę do górnej części klatki, potem wypchnij ją w górę do wyprostu rąk. — NASM: [Incline Barbell Bench Press](https://www.nasm.org/resource-center/exercise-library/incline-barbell-bench-press) (Step 3; Step 4); ExRx.net: [BBInclineBenchPress](https://web.archive.org/web/20230302054321/https://exrx.net/WeightExercises/PectoralClavicular/BBInclineBenchPress) (Execution) `ibp.move`

**Wskazówki**

- Ściągnij łopatki do siebie i w dół i utrzymaj je tak przez cały ruch. — NASM: [Incline Barbell Bench Press](https://www.nasm.org/resource-center/exercise-library/incline-barbell-bench-press) (Step 2); ACE: [Incline Chest Press (#25)](https://www.acefitness.org/resources/everyone/exercise-library/25/incline-chest-press/) (Step 2 (hantle — ta sama zasada)) `bp.blades`
- Łokcie ustaw pośrodku — ani przyklejone do tułowia, ani szeroko na boki. — NASM: [Barbell Bench Press](https://www.nasm.org/resource-center/exercise-library/barbell-bench-press) (Common Mistakes (elbows too wide or too close) (skos — ta sama zasada)); Stronger by Science: [How to Bench Press: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-bench/) (FAQ „How much should I tuck my elbows?” (skos — ta sama zasada)) `bp.elbowsMid`
- Opuszczaj ciężar powoli — bez odbijania od klatki. — NASM: [Incline Barbell Bench Press](https://www.nasm.org/resource-center/exercise-library/incline-barbell-bench-press) (Common Mistakes (lowering the bar too quickly)); ACE: [Incline Chest Press (#25)](https://www.acefitness.org/resources/everyone/exercise-library/25/incline-chest-press/) (Step 3 (slowly lower)) `bp.control`

**Czego unikać**

- Nadmierne wyginanie lędźwi albo odrywanie pośladków od ławki, żeby wycisnąć więcej. — NASM: [Incline Barbell Bench Press](https://www.nasm.org/resource-center/exercise-library/incline-barbell-bench-press) (Common Mistakes); ACE: [Incline Chest Press (#25)](https://www.acefitness.org/resources/everyone/exercise-library/25/incline-chest-press/) (Step 3; Step 4 (avoid any arching in the low back)); NSCA: [Sands, Wurth, Hewit: NSCA — Basics of Strength and Conditioning Manual, NSCA 2012](https://www.nsca.com/uploadedFiles/NSCA/Resources/PDF/Publications/basics_of_strength_and_conditioning_manual.pdf) (s. 54 (nie wyginać pleców i nie unosić klatki do sztangi)) `bp.mis.arch`

### Incline Bench Press (hantle)

**Ustawienie**

- Usiądź na ławce skośnej z hantlami na udach, połóż się i ustaw hantle przy barkach. — ExRx.net: [DBInclineBenchPress](https://web.archive.org/web/20220914021856/https://exrx.net/WeightExercises/PectoralClavicular/DBInclineBenchPress) (Preparation); ACE: [Incline Chest Press (#25)](https://www.acefitness.org/resources/everyone/exercise-library/25/incline-chest-press/) (Step 1; Step 2); NASM: [Two Arm Incline Dumbbell Chest Press](https://www.nasm.org/resource-center/exercise-library/two-arm-incline-dumbbell-chest-press) (Step 1; Step 2) `ibp.dbSetup`

**Ruch**

- Wypchnij hantle w górę nad barki do wyprostu rąk; opuść je powoli do boków górnej części klatki. — ExRx.net: [DBInclineBenchPress](https://web.archive.org/web/20220914021856/https://exrx.net/WeightExercises/PectoralClavicular/DBInclineBenchPress) (Execution); ACE: [Incline Chest Press (#25)](https://www.acefitness.org/resources/everyone/exercise-library/25/incline-chest-press/) (Step 3; Step 4); NASM: [Two Arm Incline Dumbbell Chest Press](https://www.nasm.org/resource-center/exercise-library/two-arm-incline-dumbbell-chest-press) (Step 3; Step 4) `ibp.dbMove`

**Wskazówki**

- Ściągnij łopatki do siebie i w dół i utrzymaj je tak przez cały ruch. — ACE: [Incline Chest Press (#25)](https://www.acefitness.org/resources/everyone/exercise-library/25/incline-chest-press/) (Step 2); NASM: [Two Arm Incline Dumbbell Chest Press](https://www.nasm.org/resource-center/exercise-library/two-arm-incline-dumbbell-chest-press) (Step 2) `bp.blades`
- Łokcie ustaw pośrodku — ani przyklejone do tułowia, ani szeroko na boki. — NASM: [Barbell Bench Press](https://www.nasm.org/resource-center/exercise-library/barbell-bench-press) (Common Mistakes (elbows too wide or too close) (hantle — ta sama zasada)); Stronger by Science: [How to Bench Press: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-bench/) (FAQ „How much should I tuck my elbows?” (hantle — ta sama zasada)) `bp.elbowsMid`
- Opuszczaj ciężar powoli — bez odbijania od klatki. — ACE: [Incline Chest Press (#25)](https://www.acefitness.org/resources/everyone/exercise-library/25/incline-chest-press/) (Step 3); NASM: [Two Arm Incline Dumbbell Chest Press](https://www.nasm.org/resource-center/exercise-library/two-arm-incline-dumbbell-chest-press) (Common Mistakes (lowering too quickly or bouncing)) `bp.control`

**Czego unikać**

- Nadmierne wyginanie lędźwi albo odrywanie pośladków od ławki, żeby wycisnąć więcej. — NASM: [Two Arm Incline Dumbbell Chest Press](https://www.nasm.org/resource-center/exercise-library/two-arm-incline-dumbbell-chest-press) (Common Mistakes); ACE: [Incline Chest Press (#25)](https://www.acefitness.org/resources/everyone/exercise-library/25/incline-chest-press/) (Step 3; Step 4); NSCA: [Sands, Wurth, Hewit: NSCA — Basics of Strength and Conditioning Manual, NSCA 2012](https://www.nsca.com/uploadedFiles/NSCA/Resources/PDF/Publications/basics_of_strength_and_conditioning_manual.pdf) (s. 54 (nie wyginać pleców i nie unosić klatki do sztangi)) `bp.mis.arch`

### Machine Chest Press

**Ustawienie**

- Ustaw siedzisko tak, by uchwyty były na wysokości środka klatki; plecy oparte, stopy na podłodze. — ACE: [Seated Chest Press (#188)](https://www.acefitness.org/resources/everyone/exercise-library/188/seated-chest-press/) (Step 1); NASM: [Chest Press Machine](https://www.nasm.org/resource-center/exercise-library/chest-press-machine) (Step 1; FAQ (seat adjustment)); ExRx.net: [LVChestPress](https://web.archive.org/web/20231122040539/https://exrx.net/WeightExercises/PectoralSternal/LVChestPress) (Preparation (chest approximately height of handles)) `mcp.seat`

**Ruch**

- Wypchnij uchwyty przed siebie do wyprostu rąk; wracaj powoli. — ACE: [Seated Chest Press (#188)](https://www.acefitness.org/resources/everyone/exercise-library/188/seated-chest-press/) (Step 2; Step 3); NASM: [Chest Press Machine](https://www.nasm.org/resource-center/exercise-library/chest-press-machine) (Step 3; Step 4); ExRx.net: [LVChestPress](https://web.archive.org/web/20231122040539/https://exrx.net/WeightExercises/PectoralSternal/LVChestPress) (Execution) `mcp.move`

**Wskazówki**

- Łopatki zostają przy oparciu — nie wysuwaj barków w przód na końcu ruchu. — ACE: [Seated Chest Press (#188)](https://www.acefitness.org/resources/everyone/exercise-library/188/seated-chest-press/) (Step 1; Step 3; wskazówka końcowa); NASM: [Chest Press Machine](https://www.nasm.org/resource-center/exercise-library/chest-press-machine) (Step 2 (shoulders back and down)) `mcp.blades`
- Prostuj ręce do końca, ale bez gwałtownego blokowania łokci. — ACE: [Seated Chest Press (#188)](https://www.acefitness.org/resources/everyone/exercise-library/188/seated-chest-press/) (Step 3 (fully extended, but not locked)); NASM: [Chest Press Machine](https://www.nasm.org/resource-center/exercise-library/chest-press-machine) (Common Mistakes (locking out elbows)) `press.noLock`

### Cable Fly

**Ustawienie**

- Ustaw bloczki mniej więcej na wysokości barków, chwyć uchwyty i zrób krok w przód, ręce rozłożone na boki. — ACE: [Standing Chest Fly (#160)](https://www.acefitness.org/resources/everyone/exercise-library/160/standing-chest-fly/) (opis); NASM: [Cable Crossover](https://www.nasm.org/resource-center/exercise-library/cable-crossover) (Step 1; Step 2) `cfly.setup`

**Ruch**

- Przy lekko ugiętych łokciach złącz dłonie przed klatką szerokim łukiem; wracaj powoli do rozłożenia rąk. — ACE: [Standing Chest Fly (#160)](https://www.acefitness.org/resources/everyone/exercise-library/160/standing-chest-fly/) (opis); NASM: [Cable Crossover](https://www.nasm.org/resource-center/exercise-library/cable-crossover) (Step 3; Step 4); ExRx.net: [CBStandingFly](https://web.archive.org/web/20210411175352/https://exrx.net/WeightExercises/PectoralSternal/CBStandingFly) (Execution) `cfly.move`

**Wskazówki**

- Wracaj powoli — nie pozwól, by ciężar szarpnął ręce w tył. — NASM: [Cable Crossover](https://www.nasm.org/resource-center/exercise-library/cable-crossover) (Step 4 (avoid letting the weight stack pull your arms back too quickly)); ACE: [Standing Chest Fly (#160)](https://www.acefitness.org/resources/everyone/exercise-library/160/standing-chest-fly/) (opis (slowly returning the arms)) `fly.control`
- Łokcie lekko ugięte, w stałym kącie przez cały ruch. — ExRx.net: [CBStandingFly](https://web.archive.org/web/20210411175352/https://exrx.net/WeightExercises/PectoralSternal/CBStandingFly) (Preparation; Execution (elbows in fixed position)); ACE: [Standing Chest Fly (#160)](https://www.acefitness.org/resources/everyone/exercise-library/160/standing-chest-fly/) (opis (with the elbows slightly bent)) `fly.elbows`
- Barki ściągnięte w tył, klatka uniesiona, lekkie pochylenie w przód. — NASM: [Cable Crossover](https://www.nasm.org/resource-center/exercise-library/cable-crossover) (Step 2 (shoulders back and down, chest proud, slight forward lean)); ExRx.net: [CBStandingFly](https://web.archive.org/web/20210411175352/https://exrx.net/WeightExercises/PectoralSternal/CBStandingFly) (Preparation; Comments (bend over slightly)) `fly.posture`

### Push Up

**Ustawienie**

- Dłonie na podłodze na szerokość barków lub trochę szerzej, ciało proste od głowy do pięt. — ACE: [Push Up (#41)](https://www.acefitness.org/resources/everyone/exercise-library/41/push-up/) (Step 2); NASM: [Push Up](https://www.nasm.org/resource-center/exercise-library/push-up) (Step 1; Step 2); ExRx.net: [BWPushup](https://web.archive.org/web/20230523091736/https://exrx.net/WeightExercises/PectoralSternal/BWPushup) (Preparation) `push.setup`

**Ruch**

- Opuść klatkę prawie do podłogi, zginając łokcie; wypchnij się do wyprostu rąk. — ACE: [Push Up (#41)](https://www.acefitness.org/resources/everyone/exercise-library/41/push-up/) (Step 3; Step 4); NASM: [Push Up](https://www.nasm.org/resource-center/exercise-library/push-up) (Step 3; Step 4); ExRx.net: [BWPushup](https://web.archive.org/web/20230523091736/https://exrx.net/WeightExercises/PectoralSternal/BWPushup) (Execution) `push.move`

**Wskazówki**

- Tułów sztywny — biodra nie opadają i nie unoszą się. — ACE: [Push Up (#41)](https://www.acefitness.org/resources/everyone/exercise-library/41/push-up/) (Step 3; Step 4 (do not allow your low back to sag or your hips to hike)); NASM: [Push Up](https://www.nasm.org/resource-center/exercise-library/push-up) (Common Mistakes (hips sag)); ExRx.net: [BWPushup](https://web.archive.org/web/20230523091736/https://exrx.net/WeightExercises/PectoralSternal/BWPushup) (Comments (body kept straight)) `push.rigid`
- Napnij brzuch, żeby tułów był sztywny. — ACE: [Push Up (#41)](https://www.acefitness.org/resources/everyone/exercise-library/41/push-up/) (Step 2 (bracing)); NASM: [Push Up](https://www.nasm.org/resource-center/exercise-library/push-up) (Step 2 (engage your core)) `plank.brace`

**Czego unikać**

- Skracanie ruchu — za płytko w dół albo bez wyprostu na górze. — NASM: [Push Up](https://www.nasm.org/resource-center/exercise-library/push-up) (Common Mistakes (adequate range of motion)); ExRx.net: [BWPushup](https://web.archive.org/web/20230523091736/https://exrx.net/WeightExercises/PectoralSternal/BWPushup) (Execution (lower to floor; until arms are extended)) `push.mis.partial`

### Incline Push Up

**Ustawienie**

- Oprzyj dłonie o krawędź ławki lub stabilnego podwyższenia, trochę szerzej niż barki; stopy cofnięte, ciało proste. — NASM: [Incline Push Up](https://www.nasm.org/resource-center/exercise-library/incline-push-up) (Step 1; Step 2); ExRx.net: [BWInclinePushup](https://web.archive.org/web/20230525113310/https://exrx.net/WeightExercises/PectoralSternal/BWInclinePushup) (Preparation) `ipush.setup`

**Ruch**

- Opuść klatkę do krawędzi podwyższenia, potem wypchnij się do wyprostu rąk. — NASM: [Incline Push Up](https://www.nasm.org/resource-center/exercise-library/incline-push-up) (Step 3; Step 4); ExRx.net: [BWInclinePushup](https://web.archive.org/web/20230525113310/https://exrx.net/WeightExercises/PectoralSternal/BWInclinePushup) (Execution) `ipush.move`

**Wskazówki**

- Tułów sztywny — biodra nie opadają i nie unoszą się. — NASM: [Incline Push Up](https://www.nasm.org/resource-center/exercise-library/incline-push-up) (Step 2; Common Mistakes); ExRx.net: [BWInclinePushup](https://web.archive.org/web/20230525113310/https://exrx.net/WeightExercises/PectoralSternal/BWInclinePushup) (Comments (body kept straight)) `push.rigid`
- Im wyższe podparcie, tym łatwiej — obniżaj je stopniowo. — ExRx.net: [BWInclinePushup](https://web.archive.org/web/20230525113310/https://exrx.net/WeightExercises/PectoralSternal/BWInclinePushup) (Comments (height affects difficulty; Easier/Harder)); NASM: [Incline Push Up](https://www.nasm.org/resource-center/exercise-library/incline-push-up) (FAQ (start with a higher bench, gradually lower)) `ipush.height`

### Skullcrusher (EZ)

**Ustawienie**

- Połóż się na ławce, chwyć gryf wąsko nachwytem i trzymaj go nad czołem na prostych rękach. — ACE: [Lying Barbell Triceps Extensions (#36)](https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/) (Step 1); ExRx.net: [BBLyingTriExt](https://web.archive.org/web/20220926203416/https://exrx.net/WeightExercises/Triceps/BBLyingTriExt) (Preparation; Comments (EZ Bar Lying Triceps Extension)) `skull.setup`

**Ruch**

- Zginaj łokcie, opuszczając gryf w stronę czoła; wyprostuj ręce do pozycji wyjściowej. — ACE: [Lying Barbell Triceps Extensions (#36)](https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/) (Step 2; Step 3); ExRx.net: [BBLyingTriExt](https://web.archive.org/web/20220926203416/https://exrx.net/WeightExercises/Triceps/BBLyingTriExt) (Execution) `skull.move`

**Wskazówki**

- Ramiona prawie nieruchome, mniej więcej pionowo — pracują łokcie. — ACE: [Lying Barbell Triceps Extensions (#36)](https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/) (Step 2; wskazówka końcowa (upper arms vertical)); ExRx.net: [BBLyingTriExt](https://web.archive.org/web/20220926203416/https://exrx.net/WeightExercises/Triceps/BBLyingTriExt) (Execution (elbows move back only slightly to clear the head)) `skull.upperArm`
- Opuszczaj, aż gryf będzie tuż nad czołem — albo wcześniej, jeśli ramiona zaczną uciekać w tył. — ACE: [Lying Barbell Triceps Extensions (#36)](https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/) (Step 2); ExRx.net: [BBLyingTriExt](https://web.archive.org/web/20220926203416/https://exrx.net/WeightExercises/Triceps/BBLyingTriExt) (Execution (as bar nears head)) `skull.depth`

### Triceps Dips (ławka)

**Ustawienie**

- Oprzyj dłonie o krawędź ławki za sobą, ręce proste, nogi wysunięte w przód. — NASM: [Bench Dips](https://www.nasm.org/resource-center/exercise-library/bench-dips) (Step 1); ExRx.net: [BWBenchDip](https://web.archive.org/web/20220823003741/https://exrx.net/WeightExercises/Triceps/BWBenchDip) (Preparation) `bdip.setup`

**Ruch**

- Opuść się, zginając łokcie, do lekkiego rozciągnięcia (mniej więcej kąt prosty w łokciach); wypchnij się do wyprostu. — NASM: [Bench Dips](https://www.nasm.org/resource-center/exercise-library/bench-dips) (Step 3; Step 4); ExRx.net: [BWBenchDip](https://web.archive.org/web/20220823003741/https://exrx.net/WeightExercises/Triceps/BWBenchDip) (Execution) `bdip.move`

**Wskazówki**

- Stopy bliżej ławki i ugięte kolana ułatwiają ćwiczenie; nogi na podwyższeniu — utrudniają. — NASM: [Bench Dips](https://www.nasm.org/resource-center/exercise-library/bench-dips) (Step 1; FAQ (modifications for beginners)); ExRx.net: [BWBenchDip](https://web.archive.org/web/20220823003741/https://exrx.net/WeightExercises/Triceps/BWBenchDip) (Comments: Easier/Harder) `bdip.easier`
- Wykonuj pełny zakres: w dół do lekkiego rozciągnięcia, w górę do wyprostu rąk. — NASM: [Bench Dips](https://www.nasm.org/resource-center/exercise-library/bench-dips) (Common Mistakes (adequate range of motion)); ExRx.net: [BWBenchDip](https://web.archive.org/web/20220823003741/https://exrx.net/WeightExercises/Triceps/BWBenchDip) (Comments (full range of motion)) `bdip.range`

### Close Grip Bench Press

**Ustawienie**

- Chwyć sztangę na szerokość barków lub trochę węziej — nie bardzo wąsko. — ACE: [Close Grip Bench Press (#311)](https://www.acefitness.org/resources/everyone/exercise-library/311/close-grip-bench-press/) (opis (hands directly in line with the shoulders)); NASM: [Close Grip Bench Press](https://www.nasm.org/resource-center/exercise-library/close-grip-bench-press) (Step 1; FAQ (grip width)); ExRx.net: [BBCloseGripBenchPress](https://web.archive.org/web/20240105211522/https://exrx.net/WeightExercises/Triceps/BBCloseGripBenchPress) (Preparation; Comments) `cgbp.grip`

**Ruch**

- Opuść sztangę do klatki z łokciami blisko tułowia; wypchnij ją do wyprostu rąk. — ACE: [Close Grip Bench Press (#311)](https://www.acefitness.org/resources/everyone/exercise-library/311/close-grip-bench-press/) (opis); ExRx.net: [BBCloseGripBenchPress](https://web.archive.org/web/20240105211522/https://exrx.net/WeightExercises/Triceps/BBCloseGripBenchPress) (Execution); NASM: [Close Grip Bench Press](https://www.nasm.org/resource-center/exercise-library/close-grip-bench-press) (Step 3; Step 4) `cgbp.move`

**Wskazówki**

- Łokcie blisko tułowia przez cały ruch. — ACE: [Close Grip Bench Press (#311)](https://www.acefitness.org/resources/everyone/exercise-library/311/close-grip-bench-press/) (opis (elbows close to the ribs)); ExRx.net: [BBCloseGripBenchPress](https://web.archive.org/web/20240105211522/https://exrx.net/WeightExercises/Triceps/BBCloseGripBenchPress) (Execution (elbows close to body)) `cgbp.elbows`
- Głowa, barki i pośladki na ławce, stopy pewnie na podłodze. — ACE: [Close Grip Bench Press (#311)](https://www.acefitness.org/resources/everyone/exercise-library/311/close-grip-bench-press/) (opis (push the feet into the floor, press the hips into the bench)); NASM: [Close Grip Bench Press](https://www.nasm.org/resource-center/exercise-library/close-grip-bench-press) (Step 1 (back firmly against the bench, feet flat)); NSCA: [Sands, Wurth, Hewit: NSCA — Basics of Strength and Conditioning Manual, NSCA 2012](https://www.nsca.com/uploadedFiles/NSCA/Resources/PDF/Publications/basics_of_strength_and_conditioning_manual.pdf) (Bench press, setup: five-point body contact position (head, shoulders and upper back, buttocks, both feet)) `bp.contact`

### Bench Press (hantle)

**Ustawienie**

- Usiądź z hantlami na udach, połóż się na ławce i ustaw hantle przy bokach klatki. — ExRx.net: [DBBenchPress](https://web.archive.org/web/20221218023649/https://exrx.net/WeightExercises/PectoralSternal/DBBenchPress) (Preparation); ACE: [Chest Press (#19)](https://www.acefitness.org/resources/everyone/exercise-library/19/chest-press/) (Step 1; Step 2) `dbp.setup`
- Głowa, barki i pośladki na ławce, stopy pewnie na podłodze. — ACE: [Chest Press (#19)](https://www.acefitness.org/resources/everyone/exercise-library/19/chest-press/) (Step 2 (head, shoulders, butt and feet in contact)); NASM: [Two Arm Dumbbell Chest Press With Band](https://www.nasm.org/resource-center/exercise-library/two-arm-dumbbell-chest-press-with-band) (Step 1; Step 2 (feet firmly planted, flat on the floor)); NSCA: [Sands, Wurth, Hewit: NSCA — Basics of Strength and Conditioning Manual, NSCA 2012](https://www.nsca.com/uploadedFiles/NSCA/Resources/PDF/Publications/basics_of_strength_and_conditioning_manual.pdf) (Bench press, setup: five-point body contact position (head, shoulders and upper back, buttocks, both feet)) `bp.contact`

**Ruch**

- Wypchnij hantle w górę do wyprostu rąk; opuść je powoli do boków klatki. — ExRx.net: [DBBenchPress](https://web.archive.org/web/20221218023649/https://exrx.net/WeightExercises/PectoralSternal/DBBenchPress) (Execution); ACE: [Chest Press (#19)](https://www.acefitness.org/resources/everyone/exercise-library/19/chest-press/) (Step 3; Step 4) `dbp.move`

**Wskazówki**

- Ściągnij łopatki do siebie i w dół i utrzymaj je tak przez cały ruch. — ACE: [Chest Press (#19)](https://www.acefitness.org/resources/everyone/exercise-library/19/chest-press/) (Step 2); NASM: [Two Arm Dumbbell Chest Press With Band](https://www.nasm.org/resource-center/exercise-library/two-arm-dumbbell-chest-press-with-band) (Step 2 (retract your shoulders)) `bp.blades`
- Łokcie ustaw pośrodku — ani przyklejone do tułowia, ani szeroko na boki. — NASM: [Barbell Bench Press](https://www.nasm.org/resource-center/exercise-library/barbell-bench-press) (Common Mistakes (elbows too wide or too close) (hantle — ta sama zasada)); Stronger by Science: [How to Bench Press: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-bench/) (FAQ „How much should I tuck my elbows?” (hantle — ta sama zasada)) `bp.elbowsMid`
- Opuszczaj ciężar powoli — bez odbijania od klatki. — ACE: [Chest Press (#19)](https://www.acefitness.org/resources/everyone/exercise-library/19/chest-press/) (Step 3 (slowly lower… without bouncing)); NASM: [Two Arm Dumbbell Chest Press With Band](https://www.nasm.org/resource-center/exercise-library/two-arm-dumbbell-chest-press-with-band) (Step 4 (lower with control)) `bp.control`

**Czego unikać**

- Nadmierne wyginanie lędźwi albo odrywanie pośladków od ławki, żeby wycisnąć więcej. — ACE: [Chest Press (#19)](https://www.acefitness.org/resources/everyone/exercise-library/19/chest-press/) (Step 3; Step 4 (avoid any arching in the low back)); NASM: [Barbell Bench Press](https://www.nasm.org/resource-center/exercise-library/barbell-bench-press) (Common Mistakes (sztanga — ta sama zasada)); NSCA: [Sands, Wurth, Hewit: NSCA — Basics of Strength and Conditioning Manual, NSCA 2012](https://www.nsca.com/uploadedFiles/NSCA/Resources/PDF/Publications/basics_of_strength_and_conditioning_manual.pdf) (s. 54 (nie wyginać pleców i nie unosić klatki do sztangi)) `bp.mis.arch`

### Chest Fly (hantle)

**Ustawienie**

- Połóż się na ławce, hantle nad klatką, łokcie lekko ugięte. — ACE: [Lying Chest Fly (#21)](https://www.acefitness.org/resources/everyone/exercise-library/21/lying-chest-fly/) (Step 1; Step 2); ExRx.net: [DBFly](https://web.archive.org/web/20220818045122/https://exrx.net/WeightExercises/PectoralSternal/DBFly) (Preparation) `dfly.setup`

**Ruch**

- Opuść hantle szerokim łukiem na boki do rozciągnięcia klatki; wróć tym samym łukiem nad klatkę. — ACE: [Lying Chest Fly (#21)](https://www.acefitness.org/resources/everyone/exercise-library/21/lying-chest-fly/) (Step 3; Step 4); ExRx.net: [DBFly](https://web.archive.org/web/20220818045122/https://exrx.net/WeightExercises/PectoralSternal/DBFly) (Execution) `dfly.move`

**Wskazówki**

- Łokcie lekko ugięte, w stałym kącie przez cały ruch. — ACE: [Lying Chest Fly (#21)](https://www.acefitness.org/resources/everyone/exercise-library/21/lying-chest-fly/) (Step 2–4 (slightly flexed elbows)); ExRx.net: [DBFly](https://web.archive.org/web/20220818045122/https://exrx.net/WeightExercises/PectoralSternal/DBFly) (Comments (keep elbows at fixed angle, only slightly bent)) `fly.elbows`
- Głowa, barki i pośladki na ławce, stopy pewnie na podłodze. — ACE: [Lying Chest Fly (#21)](https://www.acefitness.org/resources/everyone/exercise-library/21/lying-chest-fly/) (Step 2; Step 3 (head, shoulder, butt and feet contact)); NASM: [Barbell Bench Press](https://www.nasm.org/resource-center/exercise-library/barbell-bench-press) (Step 1 (wyciskanie — ta sama pozycja na ławce)); NSCA: [Sands, Wurth, Hewit: NSCA — Basics of Strength and Conditioning Manual, NSCA 2012](https://www.nsca.com/uploadedFiles/NSCA/Resources/PDF/Publications/basics_of_strength_and_conditioning_manual.pdf) (Bench press, setup: five-point body contact position (head, shoulders and upper back, buttocks, both feet)) `bp.contact`

### Front Squat

**Ustawienie**

- Sztanga oparta z przodu barków, łokcie wysoko, ramiona mniej więcej poziomo. — ExRx.net: [BBFrontSquat](https://web.archive.org/web/20230304211839/https://exrx.net/WeightExercises/Quadriceps/BBFrontSquat) (Preparation (upper arms parallel to floor)); NASM: [Dumbbell Front Squat](https://www.nasm.org/resource-center/exercise-library/dumbbell-front-squat) (Step 1 (elbows high; hantle — ta sama pozycja)); ACE: [Front Squat (#22)](https://www.acefitness.org/resources/everyone/exercise-library/22/front-squat/) (Step 2 (front edge of the shoulders)) `fsq.rack`
- Stopy mniej więcej na szerokość barków lub trochę szerzej, palce lekko na zewnątrz. — ACE: [Front Squat (#22)](https://www.acefitness.org/resources/everyone/exercise-library/22/front-squat/) (Step 1); NASM: [Dumbbell Front Squat](https://www.nasm.org/resource-center/exercise-library/dumbbell-front-squat) (Step 1 (shoulder-width, toes slightly out)) `sq.stance`

**Ruch**

- Schodź, cofając biodra i uginając kolana jednocześnie; wstań, wypychając podłogę całymi stopami. — ExRx.net: [BBFrontSquat](https://web.archive.org/web/20230304211839/https://exrx.net/WeightExercises/Quadriceps/BBFrontSquat) (Execution); ACE: [Front Squat (#22)](https://www.acefitness.org/resources/everyone/exercise-library/22/front-squat/) (Step 3; Step 6); NASM: [Dumbbell Front Squat](https://www.nasm.org/resource-center/exercise-library/dumbbell-front-squat) (Step 2; Step 3) `sq.down`

**Wskazówki**

- Nie opuszczaj łokci — wtedy ciężar ciągnie tułów w przód. — NASM: [Dumbbell Front Squat](https://www.nasm.org/resource-center/exercise-library/dumbbell-front-squat) (Common Mistakes (elbows drop)); ExRx.net: [BBFrontSquat](https://web.archive.org/web/20230304211839/https://exrx.net/WeightExercises/Quadriceps/BBFrontSquat) (Preparation (upper arms parallel to floor)) `fsq.elbows`
- Kolana idą w linii palców stóp — nie zapadają się do środka. — ExRx.net: [BBFrontSquat](https://web.archive.org/web/20230304211839/https://exrx.net/WeightExercises/Quadriceps/BBFrontSquat) (Execution; Comments); ACE: [Front Squat (#22)](https://www.acefitness.org/resources/everyone/exercise-library/22/front-squat/) (Step 4; Step 5); NASM: [Dumbbell Front Squat](https://www.nasm.org/resource-center/exercise-library/dumbbell-front-squat) (Common Mistakes) `sq.kneesToes`
- Schodź tak nisko, jak pozwala ruchomość przy prostych plecach i całych stopach na podłodze — zwykle co najmniej do równoległego ud. — ExRx.net: [BBFrontSquat](https://web.archive.org/web/20230304211839/https://exrx.net/WeightExercises/Quadriceps/BBFrontSquat) (Execution (just past parallel)); ACE: [Front Squat (#22)](https://www.acefitness.org/resources/everyone/exercise-library/22/front-squat/) (Step 4); NASM: [Dumbbell Front Squat](https://www.nasm.org/resource-center/exercise-library/dumbbell-front-squat) (Step 3; Common Mistakes) `sq.depth`
- Plecy proste, klatka uniesiona. — ExRx.net: [BBFrontSquat](https://web.archive.org/web/20230304211839/https://exrx.net/WeightExercises/Quadriceps/BBFrontSquat) (Comments (back straight)); ACE: [Front Squat (#22)](https://www.acefitness.org/resources/everyone/exercise-library/22/front-squat/) (Step 6 (back, chest and head-up position)) `sq.back`

**Czego unikać**

- Odrywanie pięt od podłogi. — NASM: [Dumbbell Front Squat](https://www.nasm.org/resource-center/exercise-library/dumbbell-front-squat) (Common Mistakes (rising onto the toes)); ExRx.net: [BBFrontSquat](https://web.archive.org/web/20230304211839/https://exrx.net/WeightExercises/Quadriceps/BBFrontSquat) (Comments (feet flat on floor)) `sq.mis.heels`

### Triceps Pushdown

**Ustawienie**

- Stań przodem do wyciągu z górnym bloczkiem, chwyć uchwyt, łokcie przy bokach. — ACE: [Triceps Pushdowns (#185)](https://www.acefitness.org/resources/everyone/exercise-library/185/triceps-pushdowns/) (Step 1); ExRx.net: [CBPushdown](https://web.archive.org/web/20220816182710/https://exrx.net/WeightExercises/Triceps/CBPushdown) (Preparation) `tpd.setup`

**Ruch**

- Prostuj łokcie, wypychając uchwyt w dół; wróć, aż przedramiona zbliżą się do ramion. — ExRx.net: [CBPushdown](https://web.archive.org/web/20220816182710/https://exrx.net/WeightExercises/Triceps/CBPushdown) (Execution); ACE: [Triceps Pushdowns (#185)](https://www.acefitness.org/resources/everyone/exercise-library/185/triceps-pushdowns/) (Step 2; Step 3) `tpd.move`

**Wskazówki**

- Łokcie przy bokach — pracują przedramiona, nie barki. — ACE: [Triceps Pushdowns (#185)](https://www.acefitness.org/resources/everyone/exercise-library/185/triceps-pushdowns/) (Step 3; wskazówka końcowa (monitor the forward movement of your elbows)); ExRx.net: [CBPushdown](https://web.archive.org/web/20220816182710/https://exrx.net/WeightExercises/Triceps/CBPushdown) (Preparation; Comments (elbows to side, only slight travel at top)) `tpd.elbows`
- Prostuj ręce do końca, ale bez gwałtownego blokowania łokci. — ACE: [Triceps Pushdowns (#185)](https://www.acefitness.org/resources/everyone/exercise-library/185/triceps-pushdowns/) (Step 3 (fully extended, do not “lock out”)); ExRx.net: [CBPushdown](https://web.archive.org/web/20220816182710/https://exrx.net/WeightExercises/Triceps/CBPushdown) (Execution (extend arms down)) `press.noLock`

### Overhead Triceps Extension (hantel)

**Ustawienie**

- Chwyć hantel oburącz i wypchnij go nad głowę na wyprostowanych rękach. — ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 1; Step 2); ExRx.net: [DBTriExt](https://web.archive.org/web/20220816182656/https://exrx.net/WeightExercises/Triceps/DBTriExt) (Preparation) `ote.setup`

**Ruch**

- Zginaj łokcie, opuszczając hantel za głowę; wyprostuj ręce nad głową. — ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 2; Step 3); ExRx.net: [DBTriExt](https://web.archive.org/web/20220816182656/https://exrx.net/WeightExercises/Triceps/DBTriExt) (Execution) `ote.move`

**Wskazówki**

- Ramiona nieruchomo, łokcie nad głową — pracują przedramiona. — ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 3; wskazówka końcowa (upper arms vertical)); ExRx.net: [DBTriExt](https://web.archive.org/web/20220816182656/https://exrx.net/WeightExercises/Triceps/DBTriExt) (Execution (with elbows over head)) `ote.upperArm`
- Łokcie nie rozchodzą się szeroko na boki. — ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (wskazówka końcowa (elbows shoulder-width apart)); ExRx.net: [DBTriExt](https://web.archive.org/web/20220816182656/https://exrx.net/WeightExercises/Triceps/DBTriExt) (Comments (keep elbows from pointing out too much)) `ote.elbowsIn`

### Cable Overhead Extension

**Ustawienie**

- Uchwyt wyciągu za głową, łokcie skierowane w górę nad głową. — ExRx.net: [CBTriExt](https://web.archive.org/web/20231228115509/https://exrx.net/WeightExercises/Triceps/CBTriExt) (Preparation); ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 2 (elbows pointing forward/up; hantel — ta sama pozycja)) `cote.setup`

**Ruch**

- Prostuj łokcie, wypychając uchwyt nad głowę; opuść go za głowę, zginając łokcie. — ExRx.net: [CBTriExt](https://web.archive.org/web/20231228115509/https://exrx.net/WeightExercises/Triceps/CBTriExt) (Execution); ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 2; Step 3) `cote.move`

**Wskazówki**

- Ramiona nieruchomo, łokcie nad głową — pracują przedramiona. — ExRx.net: [CBTriExt](https://web.archive.org/web/20231228115509/https://exrx.net/WeightExercises/Triceps/CBTriExt) (Execution (elbows remaining overhead)); ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 3; wskazówka końcowa) `ote.upperArm`
- Prostuj ręce do końca, ale bez gwałtownego blokowania łokci. — ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 2 (not completely locked)); ExRx.net: [CBStandingTricepsExtensionRope](https://web.archive.org/web/20220403090026/https://exrx.net/WeightExercises/Triceps/CBStandingTricepsExtensionRope) (Execution (until arms are straight)) `press.noLock`

### Deadlift (hantle)

**Ustawienie**

- Stań na szerokość bioder z ciężarem przy nogach; pochyl się w biodrach z prostymi plecami i chwyć go. — NASM: [Kettlebell Deadlift](https://www.nasm.org/resource-center/exercise-library/kettlebell-deadlift) (Step 1; Step 2 (kettlebell — ten sam wzorzec)); ACE: [Deadlift (#6)](https://www.acefitness.org/resources/everyone/exercise-library/6/deadlift/) (opis (sztanga — ten sam wzorzec)) `dbdl.setup`

**Ruch**

- Podnoś, prostując jednocześnie biodra i kolana; na górze stań prosto, z biodrami w przód. — NASM: [Kettlebell Deadlift](https://www.nasm.org/resource-center/exercise-library/kettlebell-deadlift) (Step 3); ACE: [Deadlift (#6)](https://www.acefitness.org/resources/everyone/exercise-library/6/deadlift/) (opis) `dl.lift`

**Wskazówki**

- Plecy proste (neutralne) przez cały ruch — bez zaokrąglania. — NASM: [Kettlebell Deadlift](https://www.nasm.org/resource-center/exercise-library/kettlebell-deadlift) (Step 2; Step 3; Step 4); ACE: [Deadlift (#6)](https://www.acefitness.org/resources/everyone/exercise-library/6/deadlift/) (opis) `hinge.back`
- Wstając, wypychaj biodra w przód aż do pełnego wyprostu. — NASM: [Kettlebell Deadlift](https://www.nasm.org/resource-center/exercise-library/kettlebell-deadlift) (Step 3 (drive your hips forward)); ACE: [Deadlift (#6)](https://www.acefitness.org/resources/everyone/exercise-library/6/deadlift/) (opis (push the hips forward to move to standing)) `dbdl.hips`

**Czego unikać**

- Zaokrąglanie pleców, żeby dociągnąć ciężar. — NASM: [Kettlebell Deadlift](https://www.nasm.org/resource-center/exercise-library/kettlebell-deadlift) (Common Mistakes); ACE: [Deadlift (#6)](https://www.acefitness.org/resources/everyone/exercise-library/6/deadlift/) (opis) `mis.roundBack`

### Straight Arm Pulldown

**Ustawienie**

- Ustaw wyciąg wysoko i chwyć drążek prostymi rękami przed sobą. — ACE: [Straight Arm Pressdown (#334)](https://www.acefitness.org/resources/everyone/exercise-library/334/straight-arm-pressdown/) (opis (wyciąg w najwyższym położeniu, drążek; parafraza)); Eleiko: [Dual Cable Straight Arm Pulldown – Straight Bar](https://eleiko.inspire360.com/resource/659842f49607aaa1f400b866) (Setup (bloczek na wysokości głowy, ręce proste; parafraza)) `sapd.setup`

**Ruch**

- Prostymi rękami ściągnij drążek w dół, w stronę ud; wróć powoli do góry. — ACE: [Straight Arm Pressdown (#334)](https://www.acefitness.org/resources/everyone/exercise-library/334/straight-arm-pressdown/) (opis (proste ręce, dłonie do przodu pasa, powolny powrót; parafraza)); Eleiko: [Dual Cable Straight Arm Pulldown – Straight Bar](https://eleiko.inspire360.com/resource/659842f49607aaa1f400b866) (Procedure (drążek w stronę ud prostymi rękami, powrót pod kontrolą; parafraza)); Eleiko: [Dual Cable Straight Arm Pulldown – Handles](https://eleiko.inspire360.com/resource/6598447ec5f892e7790ccbb8) ((wariant: uchwyty) Procedure) `sapd.move`

**Wskazówki**

- Ręce proste przez cały ruch — nie zginaj łokci. — ACE: [Straight Arm Pressdown (#334)](https://www.acefitness.org/resources/everyone/exercise-library/334/straight-arm-pressdown/) (opis (ręce proste przez cały ruch; parafraza)); Eleiko: [Dual Cable Straight Arm Pulldown – Straight Bar](https://eleiko.inspire360.com/resource/659842f49607aaa1f400b866) (Procedure (ręce proste; parafraza)); Eleiko: [Dual Cable Straight Arm Pulldown – Handles](https://eleiko.inspire360.com/resource/6598447ec5f892e7790ccbb8) ((wariant: uchwyty) Procedure) `sapd.arms`

### Wyciskanie na linkach (stojąc)

**Ustawienie**

- Ustaw bloczki mniej więcej na wysokości klatki lub barków, stań tyłem do wyciągu, uchwyty przy barkach. — Eleiko: [Horizontal Cable Press – Dual Cable, Standing](https://eleiko.inspire360.com/resource/65944cf0a15f04fdb30a8c1b) (Setup (bloczki na wysokości klatki, tyłem do maszyny, uchwyty przed barkami; parafraza)); ACE: [Single-arm Chest Press (#338)](https://www.acefitness.org/resources/everyone/exercise-library/338/single-arm-chest-press/) ((wariant: jednorącz) Setup: bloczek na wysokości barków); ACE: [Seated Cable Press (#165)](https://www.acefitness.org/resources/everyone/exercise-library/165/seated-cable-press/) ((wariant: siedząc) Step 1 (uchwyty na wysokości barków lub środka klatki)) `cpress.setup`

**Ruch**

- Wypchnij uchwyty przed siebie do wyprostu rąk; wracaj powoli. — Eleiko: [Horizontal Cable Press – Dual Cable, Standing](https://eleiko.inspire360.com/resource/65944cf0a15f04fdb30a8c1b) (Movement (wypchnięcie do pełnego wyprostu i powrót)); ACE: [Seated Cable Press (#165)](https://www.acefitness.org/resources/everyone/exercise-library/165/seated-cable-press/) ((wariant: siedząc) Step 2–3 (wyprost bez blokowania, powolny powrót do klatki)) `mcp.move`

**Wskazówki**

- Dociskaj stopy do podłogi i napnij brzuch — tułów stabilny. — Eleiko: [Horizontal Cable Press – Dual Cable, Standing](https://eleiko.inspire360.com/resource/65944cf0a15f04fdb30a8c1b) (Coaching points (tułów stabilny, bez nadmiernego skrętu)); ACE: [Single-arm Chest Press (#338)](https://www.acefitness.org/resources/everyone/exercise-library/338/single-arm-chest-press/) ((wariant: jednorącz) krok 5 (stopy w podłogę, napięty brzuch)) `cpress.base`

### Machine Shoulder Press

**Ustawienie**

- Usiądź tak, by uchwyty były mniej więcej na wysokości barków (ustaw siedzisko). — ACE: [Seated Shoulder Press (#186)](https://www.acefitness.org/resources/everyone/exercise-library/186/seated-shoulder-press/) (Setup (siedzisko tak, by uchwyty były na wysokości barków lub tuż nad nimi; parafraza)); Eleiko: [Overhead Press – Seated, 2 DB](https://eleiko.inspire360.com/resource/659463af0ba5d8897900b853) ((wariant: hantle siedząc) Setup: ciężary przed barkami) `msp.seat`

**Ruch**

- Wypchnij ciężar nad głowę do wyprostu rąk; opuść go z powrotem do barków. — ACE: [Seated Shoulder Press (#186)](https://www.acefitness.org/resources/everyone/exercise-library/186/seated-shoulder-press/) (Movement (wyciśnięcie nad głowę, powolne opuszczenie)); Eleiko: [Overhead Press – Seated, 2 DB](https://eleiko.inspire360.com/resource/659463af0ba5d8897900b853) ((wariant: hantle) Movement) `ohp.move`

**Wskazówki**

- Stopy pewnie na podłodze. — ACE: [Seated Shoulder Press (#186)](https://www.acefitness.org/resources/everyone/exercise-library/186/seated-shoulder-press/) (Setup (stopy na podłodze lub podnóżkach)); Eleiko: [Overhead Press – Seated, 2 DB](https://eleiko.inspire360.com/resource/659463af0ba5d8897900b853) (Coaching points (stopy wciskane w podłogę przez całą serię)) `ohp.feet`
- Na górze wyprostuj ręce, bez gwałtownego blokowania łokci. — ACE: [Seated Shoulder Press (#186)](https://www.acefitness.org/resources/everyone/exercise-library/186/seated-shoulder-press/) (Movement (łokcie prawie proste, nie zablokowane)); Eleiko: [Overhead Press – Seated, 2 DB](https://eleiko.inspire360.com/resource/659463af0ba5d8897900b853) (Movement (pełny wyprost rąk)) `ohp.fullExt`

### Leg Curl

**Ruch**

- Zginaj kolana, przyciągając pięty w stronę pośladków; wracaj powoli do wyprostu. — NASM: [Seated Leg Curl](https://www.nasm.org/resource-center/exercise-library/seated-leg-curl) (Execution; Return (pięty do pośladków, powrót pod kontrolą; parafraza)); ACE: [Prone (Lying) Hamstrings Curl (#131)](https://www.acefitness.org/resources/everyone/exercise-library/131/prone-lying-hamstrings-curl/) ((wariant: leżąc, z linką) „slowly return your leg back to your starting position”) `lcurl.move`

**Wskazówki**

- Uda i biodra nieruchomo — ruch tylko w kolanach. — NASM: [Seated Leg Curl](https://www.nasm.org/resource-center/exercise-library/seated-leg-curl) (Common Mistakes (przesuwanie lub skręcanie bioder)); NASM: [Single-Leg Seated Leg Curl](https://www.nasm.org/resource-center/exercise-library/single-leg-seated-leg-curl) (Common Mistakes (kolano w miejscu)); ACE: [Prone (Lying) Hamstrings Curl (#131)](https://www.acefitness.org/resources/everyone/exercise-library/131/prone-lying-hamstrings-curl/) ((wariant: leżąc, z linką) „without moving your thigh (the top of your thigh remains on the mat)”) `lcurl.still`
- Ruch płynny w obie strony, bez szarpania. — NASM: [Seated Leg Curl](https://www.nasm.org/resource-center/exercise-library/seated-leg-curl) (Common Mistakes (szarpany, niekontrolowany ruch)); ACE: [Prone (Lying) Hamstrings Curl (#131)](https://www.acefitness.org/resources/everyone/exercise-library/131/prone-lying-hamstrings-curl/) ((wariant) krok 4 (powolny powrót)) `llc.control`

### Nordic Curl

**Ustawienie**

- Uklęknij na miękkim podłożu; kostki muszą być mocno przytrzymane (partner, wałki albo zaczep). — van der Horst i in. (UMC Utrecht): [The Preventive Effect of the Nordic Hamstring Exercise… RCT, Am J Sports Med 2015](https://instituteofmotion.com/wp-content/uploads/2018/03/Nordic-hamstring-2015.pdf) (s. 2, Intervention („applying pressure to the player’s heels/lower legs”)); Chen, Wu, Guo (Beijing Sport University i in.): [Nordic hamstring exercises in functional knee rehabilitation after ACL reconstruction, Sci Rep 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10624851/) (Methodology, pkt 2 (kostki przytrzymane)); Ripley i in. (University of Salford): [Kinematic, neuromuscular and bicep femoris in vivo mechanics during the NHE…, Muscles 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC12225522/) (Materials and Methods (klęk na wyściełanej ławce)) `nordic.setup`

**Ruch**

- Pochylaj się w przód jak najwolniej, hamując ruch tyłem ud. — van der Horst i in. (UMC Utrecht): [The Preventive Effect of the Nordic Hamstring Exercise… RCT, Am J Sports Med 2015](https://instituteofmotion.com/wp-content/uploads/2018/03/Nordic-hamstring-2015.pdf) (s. 2 („as slowly as possible to maximize loading in the eccentric phase”)); Ripley i in. (University of Salford): [Kinematic, neuromuscular and bicep femoris in vivo mechanics during the NHE…, Muscles 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC12225522/) (Materials and Methods („as slowly as possible to a prone position”)); Chen, Wu, Guo (Beijing Sport University i in.): [Nordic hamstring exercises in functional knee rehabilitation after ACL reconstruction, Sci Rep 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10624851/) (Methodology (powolne pochylanie z oporem tyłu ud)) `nordic.move`

**Wskazówki**

- Biodra wyprostowane — tułów i uda w jednej linii, bez zginania w biodrach. — van der Horst i in. (UMC Utrecht): [The Preventive Effect of the Nordic Hamstring Exercise… RCT, Am J Sports Med 2015](https://instituteofmotion.com/wp-content/uploads/2018/03/Nordic-hamstring-2015.pdf) (s. 2 (tułów od kolan w górę sztywny i prosty)); Ripley i in. (University of Salford): [Kinematic, neuromuscular and bicep femoris in vivo mechanics during the NHE…, Muscles 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC12225522/) (Materials and Methods (biodra wyprostowane; zgięcie bioder = powtórzenie nieudane)) `nordic.hips`
- Gdy nie dasz rady dalej hamować, złap się dłońmi jak przy pompce. — van der Horst i in. (UMC Utrecht): [The Preventive Effect of the Nordic Hamstring Exercise… RCT, Am J Sports Med 2015](https://instituteofmotion.com/wp-content/uploads/2018/03/Nordic-hamstring-2015.pdf) (s. 2 (ręce hamują upadek i odpychają z powrotem)); Ripley i in. (University of Salford): [Kinematic, neuromuscular and bicep femoris in vivo mechanics during the NHE…, Muscles 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC12225522/) (Materials and Methods (po utracie kontroli ręce kontrolują opad jak w pompce)) `nordic.catch`

### Wall Sit

**Ustawienie**

- Oprzyj plecy o stabilną ścianę, wysuń stopy w przód i zsuń się po ścianie do wybranej wysokości. — Lea, O’Driscoll, Wiles (Canterbury Christ Church University): [Home-based isometric wall squat intervention…, Eur J Appl Physiol 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10786991/) (Methods, HR-EX: Baseline testing; RPE-EX („lower their back down a sturdy wall”, stopy do wysokości przysiadu)); Ng i in. (Chinese University of Hong Kong): [Isometric resistance exercise… study protocol for a RCT, Trials 2026](https://pmc.ncbi.nlm.nih.gov/articles/PMC13449400/) (Intervention arm (stopy na szerokość barków, plecy i głowa neutralnie / przy ścianie)) `wall.setup`

**Wskazówki**

- Plecy oparte o ścianę, tułów wyprostowany. — Lea, O’Driscoll, Wiles (Canterbury Christ Church University): [Home-based isometric wall squat intervention…, Eur J Appl Physiol 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10786991/) (Methods („a vertical lower limb and an erect trunk”)); Ng i in. (Chinese University of Hong Kong): [Isometric resistance exercise… study protocol for a RCT, Trials 2026](https://pmc.ncbi.nlm.nih.gov/articles/PMC13449400/) (Intervention arm (plecy i głowa neutralnie / przy ścianie)) `wall.back`
- Im niżej zejdziesz (mniejszy kąt w kolanach), tym trudniej — można zacząć wyżej i obniżać pozycję stopniowo. — Ng i in. (Chinese University of Hong Kong): [Isometric resistance exercise… study protocol for a RCT, Trials 2026](https://pmc.ncbi.nlm.nih.gov/articles/PMC13449400/) (Intervention arm (indywidualna progresja głębokości)); Baffour-Awuah i in. (University of New England): [An evidence-based guide to… isometric resistance training in hypertension, Clin Hypertens 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10015931/) (Clinical implications, Tabela 4 (intensywność reguluje kąt w kolanach)) `wall.depth`
- Oddychaj normalnie — nie wstrzymuj oddechu. — Lea, O’Driscoll, Wiles (Canterbury Christ Church University): [Home-based isometric wall squat intervention…, Eur J Appl Physiol 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10786991/) (Methods (zwykły oddech; miejsce wg docs/research/33 — do potwierdzenia; zespół Wilesa, wspólny autor z pmc-10015931: liczy się jako jedno źródło)); Krobot Cutura i in. (University of Zagreb): [Evaluating Intraocular Pressure Alterations during Large Muscle Group Isometric Exercises…, IJERPH 2024 (sekcja 2.2.2)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11050476/) (sekcja 2.2.2 „Subjects followed a normal breathing pattern”) `wall.breath`

### Back Extension

**Ruch**

- Opuść tułów, zginając się w biodrach mniej więcej do kąta prostego; wróć do linii prostej z nogami. — Andersen i in. (Western Norway University of Applied Sciences): [Comparison of Muscle Activity in Three Single-Joint, Hip Extension Exercises…, J Sports Sci Med 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8057707/) (Experimental session („until the hip angle was approximately 90 degrees”)); Lyons i in. (University of Central Florida): […Following 45-Degree Roman Chair Exercise, Int J Sports Phys Ther 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC11964695/) (Methods: Session 1 („until a neutral spine angle was achieved”)) `bext.move`

**Wskazówki**

- Plecy proste (neutralne) przez cały ruch — bez zaokrąglania. — Lyons i in. (University of Central Florida): […Following 45-Degree Roman Chair Exercise, Int J Sports Phys Ther 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC11964695/) (Methods („a neutral spine position throughout the exercise”)); Andersen i in. (Western Norway University of Applied Sciences): [Comparison of Muscle Activity in Three Single-Joint, Hip Extension Exercises…, J Sports Sci Med 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8057707/) (Experimental session („The back had to be straight with a natural sway throughout the whole movement.”)) `hinge.back`
- Na górze kończ w linii prostej — bez wyginania lędźwi w łuk. — Lyons i in. (University of Central Florida): […Following 45-Degree Roman Chair Exercise, Int J Sports Phys Ther 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC11964695/) (Methods (unikanie nadmiernego wyginania; koniec w pozycji neutralnej)); Andersen i in. (Western Norway University of Applied Sciences): [Comparison of Muscle Activity in Three Single-Joint, Hip Extension Exercises…, J Sports Sci Med 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8057707/) (Experimental session (plecy proste, powrót do pozycji wyprostowanej)) `bext.noArch`
- Ruch płynny w obie strony, bez szarpania. — Andersen i in. (Western Norway University of Applied Sciences): [Comparison of Muscle Activity in Three Single-Joint, Hip Extension Exercises…, J Sports Sci Med 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8057707/) (Experimental session („self-selected but controlled tempo”)); Lyons i in. (University of Central Florida): […Following 45-Degree Roman Chair Exercise, Int J Sports Phys Ther 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC11964695/) (Methods (tempo z metronomu, 4 s na cykl)) `llc.control`

### Preacher Curl

**Ustawienie**

- Oprzyj tył ramienia o podpórkę modlitewnika, pachą blisko jej krawędzi. — Havers i in. (IST University of Applied Sciences): [Partial Range, Full Gains?…, Eur J Sport Sci 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12621570/) (sekcja 2.5 (ławka 65° odwzorowująca modlitewnik: ramię na ławce, pacha przy krawędzi; parafraza; słabsze — ustawienie testowe)); Nunes i in. (Londrina State University): […Cable vs. Barbell Preacher Curl Training…, IJERPH 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7460162/) (2.3 („The elbow was supported on a padded shelf with the shoulder flexed at an angle of 60°, similar to the preacher bench.”; słabsze — ustawienie testowe)) `preacher.setup`

**Wskazówki**

- Pełny zakres: od wyprostu do pełnego zgięcia łokcia. — Nunes i in. (Londrina State University): […Cable vs. Barbell Preacher Curl Training…, IJERPH 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7460162/) (2.5 („in the maximum range of motion”)); Havers i in. (IST University of Applied Sciences): [Partial Range, Full Gains?…, Eur J Sport Sci 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12621570/) (2.3 (pełny zakres)) `preacher.range`
- Opuszczaj ciężar powoli, z kontrolą. — Nunes i in. (Londrina State University): […Cable vs. Barbell Preacher Curl Training…, IJERPH 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7460162/) (2.5 (tempo: koncentryczna krótsza, ekscentryczna dłuższa)); Havers i in. (IST University of Applied Sciences): [Partial Range, Full Gains?…, Eur J Sport Sci 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12621570/) (2.3 (ekscentryczna dłuższa niż koncentryczna)) `curl.control`

### Diamond Push Up

**Ustawienie**

- Dłonie razem pod środkiem klatki — kciuki i palce wskazujące stykają się, tworząc romb; ciało proste. — Intziegianni i in. (UCLan Cyprus): [EMG… Standard, Diamond, and Wide Hand Position Push-Ups, Muscles 2026](https://pmc.ncbi.nlm.nih.gov/articles/PMC13029269/) (2.3 („place their hands under their chest in the midline of their sternum”)); Marcolin i in. (University of Padova): [Selective Activation of Shoulder, Trunk, and Arm Muscles… Push-Up Variants, J Athl Train 2015](https://pmc.ncbi.nlm.nih.gov/articles/PMC4732391/) (Testing Procedures (kciuk i palec wskazujący jednej dłoni stykają się z drugą)) `diamond.setup`

**Wskazówki**

- Tułów sztywny — biodra nie opadają i nie unoszą się. — Intziegianni i in. (UCLan Cyprus): [EMG… Standard, Diamond, and Wide Hand Position Push-Ups, Muscles 2026](https://pmc.ncbi.nlm.nih.gov/articles/PMC13029269/) (2.3 (prosta linia ciała, napięty brzuch)); Marcolin i in. (University of Padova): [Selective Activation of Shoulder, Trunk, and Arm Muscles… Push-Up Variants, J Athl Train 2015](https://pmc.ncbi.nlm.nih.gov/articles/PMC4732391/) (Testing Procedures („A rigid posture with trunk and legs aligned was required for all the variants.”)) `push.rigid`

### Pallof Press

**Ustawienie**

- Stań bokiem do wyciągu ustawionego mniej więcej na wysokości klatki; uchwyt trzymaj oburącz przy klatce, linka napięta. — ACE: [Standing Anti-Rotation Press (#332)](https://www.acefitness.org/resources/everyone/exercise-library/332/standing-anti-rotation-press/) (opis („The cable pulley should be at approximately chest height.”)); Mullane, Turner, Bishop (Middlesex University): [Exercise Technique: The Pallof Press, Strength Cond J 43(2):121–128 (rękopis)](https://repository.mdx.ac.uk/item/89098) (s. 4 („Ensure that the band or cable machine is fixed to approximately the mid-torso level.”)); Eleiko: [Pallof Cable Press – Low Split Stance](https://eleiko.inspire360.com/resource/659d665daa93b5993f0c90c7) (Setup (bokiem do wyciągu, uchwyt oburącz przy środku tułowia)) `pallof.setup`

**Ruch**

- Wypchnij uchwyt prosto przed siebie do wyprostu rąk, przytrzymaj chwilę i powoli wróć do klatki. — ACE: [Standing Anti-Rotation Press (#332)](https://www.acefitness.org/resources/everyone/exercise-library/332/standing-anti-rotation-press/) (opis (wypchnięcie, przytrzymanie, powolny powrót)); Mullane, Turner, Bishop (Middlesex University): [Exercise Technique: The Pallof Press, Strength Cond J 43(2):121–128 (rękopis)](https://repository.mdx.ac.uk/item/89098) (s. 4 („slowly extend and press the hands away from the torso, ensuring not to lock out the elbows”)) `pallof.move`

**Wskazówki**

- Nie pozwól, by linka obróciła tułów — tułów i biodra zostają nieruchomo. — NASM: [Best Abs Exercises (blog, H. Cherry, akt. 23.07.2026)](https://www.nasm.org/resource-center/blog/training/best-abs-exercises) (Pallof Press („The goal is to prevent movement, not create it.”)); Eleiko: [Pallof Cable Press – Low Split Stance](https://eleiko.inspire360.com/resource/659d665daa93b5993f0c90c7) (Coaching Points („Stay tall through your hips without allowing any movement in your torso.”)); Mullane, Turner, Bishop (Middlesex University): [Exercise Technique: The Pallof Press, Strength Cond J 43(2):121–128 (rękopis)](https://repository.mdx.ac.uk/item/89098) (s. 4 (ćwiczenie antyrotacyjne)) `pallof.noTwist`
- Napnij brzuch, żeby tułów był sztywny. — Mullane, Turner, Bishop (Middlesex University): [Exercise Technique: The Pallof Press, Strength Cond J 43(2):121–128 (rękopis)](https://repository.mdx.ac.uk/item/89098) (s. 4 (tułów napięty, kręgosłup neutralnie)); Eleiko: [Pallof Cable Press – Low Split Stance](https://eleiko.inspire360.com/resource/659d665daa93b5993f0c90c7) (Coaching Points (stopy w podłogę, by ustabilizować tułów)) `plank.brace`

### Reverse Crunch

**Ruch**

- Zwijaj biodra od podłoża w stronę żeber, potem powoli opuść je z powrotem. — ACE: [Reverse Crunch (#76)](https://www.acefitness.org/resources/everyone/exercise-library/76/reverse-crunch/) (krok 2–3 („Continue rolling out until your spine and pelvis (hips) contact the mat”)); NASM: [Best Abs Exercises (blog, H. Cherry, akt. 23.07.2026)](https://www.nasm.org/resource-center/blog/training/best-abs-exercises) (Reverse Crunch (kontrola fazy opuszczania)) `rcrunch.move`

**Wskazówki**

- Ruch prowadzi miednica — nie wymachuj nogami. — ACE: [Reverse Crunch (#76)](https://www.acefitness.org/resources/everyone/exercise-library/76/reverse-crunch/) (wskazówka końcowa (unoszenie miednicy; bez zmiany kąta kolan)); NASM: [Best Abs Exercises (blog, H. Cherry, akt. 23.07.2026)](https://www.nasm.org/resource-center/blog/training/best-abs-exercises) (Reverse Crunch („Focus on lifting the hips rather than simply swinging the legs.”)) `rcrunch.hips`

### Farmer's Walk

**Ustawienie**

- Weź ciężar w każdą rękę; ręce opuszczone wzdłuż boków, ciężary przy biodrach. — ACE: [Farmer’s Carry (#359)](https://www.acefitness.org/resources/everyone/exercise-library/359/farmer-s-carry/) (opis („allow the arms to rest along the sides of the body so the dumbbells are next to each hip”)); NSCA: [Taylor, Reed: Increase Hip and Trunk Stability with Loaded Carries…, NSCA Coach 7.3](https://www.nsca.com/contentassets/927868f8d4bb45f2ac4429631d558d83/coach-7.3.6-increase-hip-and-trunk-stability-with-loaded-carries-for-injury-prevention-rehabilitation-and-performance.pdf) (s. 52, Exercise Set-Up (równy ciężar w każdej ręce)) `carry.two`

**Ruch**

- Idź spokojnym, kontrolowanym krokiem na ustalony dystans albo czas. — ACE: [Farmer’s Carry (#359)](https://www.acefitness.org/resources/everyone/exercise-library/359/farmer-s-carry/) (opis (marsz na ustalony dystans)); NSCA: [Taylor, Reed: Increase Hip and Trunk Stability with Loaded Carries…, NSCA Coach 7.3](https://www.nsca.com/contentassets/927868f8d4bb45f2ac4429631d558d83/coach-7.3.6-increase-hip-and-trunk-stability-with-loaded-carries-for-injury-prevention-rehabilitation-and-performance.pdf) (s. 52 („walk slow and controlled”)) `carry.walk`

**Wskazówki**

- Plecy proste przez cały ruch. — ACE: [Farmer’s Carry (#359)](https://www.acefitness.org/resources/everyone/exercise-library/359/farmer-s-carry/) (opis (plecy proste)); NSCA: [Taylor, Reed: Increase Hip and Trunk Stability with Loaded Carries…, NSCA Coach 7.3](https://www.nsca.com/contentassets/927868f8d4bb45f2ac4429631d558d83/coach-7.3.6-increase-hip-and-trunk-stability-with-loaded-carries-for-injury-prevention-rehabilitation-and-performance.pdf) (s. 52 („maintain an upright torso”)); NASM: [Best Abs Exercises (blog, H. Cherry, akt. 23.07.2026)](https://www.nasm.org/resource-center/blog/training/best-abs-exercises) ((wariant: ciężary nierówne) „Maintain a tall posture and level shoulders throughout the carry.”) `lunge.torso`

### Suitcase Carry

**Ustawienie**

- Weź ciężar w jedną rękę; ręka opuszczona wzdłuż boku, ciężar przy biodrze. — ACE: [Suitcase Carry (#358)](https://www.acefitness.org/resources/everyone/exercise-library/358/suitcase-carry/) (opis (ciężar w jednej ręce przy biodrze; parafraza)); NSCA: [Taylor, Reed: Increase Hip and Trunk Stability with Loaded Carries…, NSCA Coach 7.3](https://www.nsca.com/contentassets/927868f8d4bb45f2ac4429631d558d83/coach-7.3.6-increase-hip-and-trunk-stability-with-loaded-carries-for-injury-prevention-rehabilitation-and-performance.pdf) (s. 52 (suitcase carry: ciężar po jednej stronie)) `carry.one`

**Ruch**

- Idź spokojnym, kontrolowanym krokiem na ustalony dystans albo czas. — ACE: [Suitcase Carry (#358)](https://www.acefitness.org/resources/everyone/exercise-library/358/suitcase-carry/) (opis (marsz na ustalony dystans)); NSCA: [Taylor, Reed: Increase Hip and Trunk Stability with Loaded Carries…, NSCA Coach 7.3](https://www.nsca.com/contentassets/927868f8d4bb45f2ac4429631d558d83/coach-7.3.6-increase-hip-and-trunk-stability-with-loaded-carries-for-injury-prevention-rehabilitation-and-performance.pdf) (s. 52) `carry.walk`

**Wskazówki**

- Nie przechylaj się ani w stronę ciężaru, ani od niego — idź wyprostowany. — NASM: [Best Abs Exercises (blog, H. Cherry, akt. 23.07.2026)](https://www.nasm.org/resource-center/blog/training/best-abs-exercises) („Clients should walk tall and avoid leaning toward or away from the weight.”); NSCA: [Taylor, Reed: Increase Hip and Trunk Stability with Loaded Carries…, NSCA Coach 7.3](https://www.nsca.com/contentassets/927868f8d4bb45f2ac4429631d558d83/coach-7.3.6-increase-hip-and-trunk-stability-with-loaded-carries-for-injury-prevention-rehabilitation-and-performance.pdf) (s. 52 (bez bocznego zginania kręgosłupa)); ACE: [Suitcase Carry (#358)](https://www.acefitness.org/resources/everyone/exercise-library/358/suitcase-carry/) (opis (kręgosłup wyprostowany)) `carry.noLean`

### Burpees

**Ruch**

- Z przysiadu oprzyj dłonie o podłogę i wyskocz nogami w tył do podporu jak do pompki. — NASM: [Squat Thrust Burpees](https://www.nasm.org/resource-center/exercise-library/squat-thrust-burpees) (Execute/Drive („Jump or step your feet backward into a push-up position”)); Polevoy i in. (Moscow Aviation Institute i in.): [The Influence of Burpee on Endurance and Short-Term Memory of Adolescents, IJERPH 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9517252/) (2.3 Execution Technique („Jump back to a push-up position.”)); ACE: [Burpee (#306, wersja z BOSU)](https://www.acefitness.org/education-and-resources/lifestyle/exercise-library/306/burpee/) ((wariant z BOSU) wyskok nogami w tył do podporu) `burpee.down`
- Wskocz stopami z powrotem do dłoni i wyskocz w górę, prostując biodra i kolana. — NASM: [Squat Thrust Burpees](https://www.nasm.org/resource-center/exercise-library/squat-thrust-burpees) (powrót stopami do dłoni, wyskok); Polevoy i in. (Moscow Aviation Institute i in.): [The Influence of Burpee on Endurance and Short-Term Memory of Adolescents, IJERPH 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9517252/) (2.3 („Jump to full hip and knee extension.”)) `burpee.up`

### Medicine Ball Slam

**Ruch**

- Unieś piłkę oburącz nad głowę, potem z całej siły rzuć ją prosto w dół, w podłogę. — ACE: [Overhead Slams (#182)](https://www.acefitness.org/resources/everyone/exercise-library/182/overhead-slams/) (krok 3–4 (piłka nad głowę, potem rzut z całej siły w podłogę; parafraza)); Tsartsapakis i in. (Aristotle University of Thessaloniki): [Development and Implementation of a Core Training Protocol…, Methods Protoc 2025 (sekcja 3.2)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12286126/) (sekcja 3.2 (Controlled Upward Phase → Explosive Downward Phase; parafraza)) `slam.move`

**Wskazówki**

- Plecy proste (neutralne) przez cały ruch — bez zaokrąglania. — ACE: [Overhead Slams (#182)](https://www.acefitness.org/resources/everyone/exercise-library/182/overhead-slams/) (krok 2 („Maintain a flat back by bending forward at the hips.”)); Tsartsapakis i in. (Aristotle University of Thessaloniki): [Development and Implementation of a Core Training Protocol…, Methods Protoc 2025 (sekcja 3.2)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12286126/) (3.2, Neutral Spine Alignment („Ensure the lumbar and thoracic spine remain neutral throughout the movement…”)) `hinge.back`
- Napnij brzuch, żeby tułów był sztywny. — ACE: [Overhead Slams (#182)](https://www.acefitness.org/resources/everyone/exercise-library/182/overhead-slams/) (krok 2–4 (napięty brzuch przez cały ruch; parafraza)); Tsartsapakis i in. (Aristotle University of Thessaloniki): [Development and Implementation of a Core Training Protocol…, Methods Protoc 2025 (sekcja 3.2)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12286126/) (3.2 („Engage the TrA and deep-core stabilizers prior to initiating the slam.”)) `plank.brace`

### Leg Extension

**Ruch**

- Prostuj nogi aż do wyprostu kolan; opuszczaj do zgięcia mniej więcej pod kątem prostym. — Plotkin i in. (CUNY Lehman College): [Progressive overload without progressing load?…, PeerJ 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9528903/) (Methods, Muscle strength-endurance (pełny zakres od zgięcia pod kątem prostym do pełnego wyprostu; parafraza)); Ghigiarelli i in. (Hofstra University): [Concurrent Validity… (MR EMG)… During the Leg Extension Exercise, Sensors 2026](https://pmc.ncbi.nlm.nih.gov/articles/PMC13517625/) (2.3 („All repetitions were performed through a full range of motion permitted by the leg extension machine”)) `lext.range`

**Wskazówki**

- Ruch płynny w obie strony, bez szarpania. — Plotkin i in. (CUNY Lehman College): [Progressive overload without progressing load?…, PeerJ 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9528903/) (Methods (stałe tempo z metronomem)); Ghigiarelli i in. (Hofstra University): [Concurrent Validity… (MR EMG)… During the Leg Extension Exercise, Sensors 2026](https://pmc.ncbi.nlm.nih.gov/articles/PMC13517625/) (2.5 (kontrolowane powtórzenia, metronom)) `llc.control`

### Seated Calf Raise

**Ruch**

- Wspinaj się na palce jak najwyżej, potem opuść pięty, aż poczujesz rozciągnięcie łydek. — Kinoshita i in. (Ritsumeikan University): [Triceps surae muscle hypertrophy is greater after standing versus seated calf-raise training, Front Physiol 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10753835/) (Introduction, ryc. 1 (zakres od zgięcia grzbietowego do podeszwowego, kolana zgięte; parafraza)); Hasani i in. (Monash University): [LOAD-intensity and time-under-tension… feasibility, BMC Sports Sci Med Rehabil 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8152048/) (Tabela 1 (zakres zgięcia grzbietowego i podeszwowego; parafraza)) `calf.move`

**Wskazówki**

- Ruch płynny w obie strony, bez szarpania. — Kinoshita i in. (Ritsumeikan University): [Triceps surae muscle hypertrophy is greater after standing versus seated calf-raise training, Front Physiol 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10753835/) (Training program (2 s w górę, 2 s w dół, metronom)); Hasani i in. (Monash University): [LOAD-intensity and time-under-tension… feasibility, BMC Sports Sci Med Rehabil 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8152048/) (tempo z metronomu); Plotkin i in. (CUNY Lehman College): [Progressive overload without progressing load?…, PeerJ 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9528903/) (Methods („controlled fashion… eccentric action of approximately 2 s”)); NASM: [Calf Training: How to Program This Stubborn Muscle Group (blog, H. Cherry, akt. 25.07.2026)](https://www.nasm.org/resource-center/blog/training/calf-training-how-to-program-this-stubborn-muscle-group-for-clients) („a controlled 2-to-3-second lowering”) `llc.control`

### Incline Walk (bieżnia)

**Wskazówki**

- Poręczy używaj najwyżej do równowagi — nie podpieraj się na nich mocno i nie odchylaj do tyłu, bo to zmniejsza wysiłek. — Berling i in. (University of Wisconsin–La Crosse): […handrail support on oxygen uptake during steady-state treadmill exercise, J Cardiopulm Rehabil 2006 (abstrakt, Europe PMC)](https://europepmc.org/article/MED/17135860) (abstrakt (mocne trzymanie poręczy obniżało tętno i pobór tlenu; parafraza)); Hofmann i in. (Cybex Research Institute): […handrail-use instructions… inclined treadmill walking, Int J Exerc Sci 7(4):339–345 (abstrakt)](https://digitalcommons.wku.edu/ijes/vol7/iss4/10) (abstrakt („holding the handrails and leaning backward significantly reduces metabolic cost”)); NordicTrack: [Incline treadmill benefits… (15.07.2025)](https://www.nordictrack.com/learn/incline-treadmill-benefits-why-it-works-better-than-flat-walking) („It's okay to use the side rails for balance…”); Life Fitness: [Is Treadmill Calorie Burn Affected by Holding the Handrails? (29.07.2024)](https://lifefitness.com/en-us/customer-support/education-hub/blog/treadmill-calorie-burn-affected-holding-handrails) („…ensure that you keep an upright posture and don’t lean back!”); de Oliveira i in. (Federal University of Paraná): […handrail support… during maximal exercise testing, Sci Rep 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7343795/) (wyniki (z podparciem test trwał dłużej, tętno w środkowych etapach niższe; parafraza)) `walk.rails`
- Idź wyprostowany, tułów stabilny. — Life Fitness: [Is Treadmill Calorie Burn Affected by Holding the Handrails? (29.07.2024)](https://lifefitness.com/en-us/customer-support/education-hub/blog/treadmill-calorie-burn-affected-holding-handrails) („stand up straight” / wyprostowana postawa); NordicTrack: [Incline treadmill benefits… (15.07.2025)](https://www.nordictrack.com/learn/incline-treadmill-benefits-why-it-works-better-than-flat-walking) („…try to keep your core tight and your spine neutral.”) `walk.upright`

### Bieg

**Wskazówki**

- Nie wydłużaj kroku na siłę — lepiej trochę krótszy niż za długi. — Moore (Cardiff Metropolitan University): [Is There an Economical Running Technique?…, Sports Med 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC4887549/) (Spatiotemporal Factors (zakres od preferowanej długości kroku minus 3 % do preferowanej)); Folland i in. (Loughborough University): [Running Technique is an Important Component of Running Economy and Performance, MSSE 2017](https://pmc.ncbi.nlm.nih.gov/articles/PMC5473370/) (wyniki (krótszy krok i wyższa kadencja wiązały się z lepszą ekonomią; parafraza)) `run.stride`
- Biegnij płynnie, bez zbędnego podskakiwania w górę. — Moore (Cardiff Metropolitan University): [Is There an Economical Running Technique?…, Sports Med 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC4887549/) (Spatiotemporal Factors („reducing the magnitude of vertical displacement should be encouraged”)); Folland i in. (Loughborough University): [Running Technique is an Important Component of Running Economy and Performance, MSSE 2017](https://pmc.ncbi.nlm.nih.gov/articles/PMC5473370/) (wyniki (mniejsze pionowe przemieszczenie miednicy — najsilniejszy kinematyczny korelat ekonomii; parafraza)) `run.bounce`
- Stawiaj stopę blisko pod ciałem, nie daleko przed sobą — to ogranicza hamowanie. — NASM: [Running Gait Basics (blog, B. Sutton, akt. 29.06.2026)](https://www.nasm.org/resource-center/blog/training/running-gait-basics-what-personal-trainers-should-screen-for) (overstriding („unnecessary braking forces with each step”)); Moore (Cardiff Metropolitan University): [Is There an Economical Running Technique?…, Sports Med 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC4887549/) (mniejsza odległość stopy od środka masy przy kontakcie zmniejszała siły hamujące; parafraza); Folland i in. (Loughborough University): [Running Technique is an Important Component of Running Economy and Performance, MSSE 2017](https://pmc.ncbi.nlm.nih.gov/articles/PMC5473370/) (Discussion („the importance of minimizing braking”)) `run.under`

### Rower

**Ustawienie**

- Ustaw siodełko tak, by w najniższym położeniu pedału noga była prawie prosta — kolano lekko ugięte, nie zablokowane. — Concept2: [Setting Up the BikeErg](https://www.concept2.nl/en/node/8909) („With the ball of your foot on the pedal, your leg should maintain a slight bend at maximum extension.”); HSS: [A. Karp, How to Set Up an Exercise (or Spin) Bike Properly (21.12.2020)](https://www.hss.edu/health-library/move-better/set-up-exercise-bike) (Seat height („It shouldn't be locked out, just bending noticeably.”)); Bini, Hume, Croft (Auckland University of Technology): [Effects of bicycle saddle height on knee injury risk and cycling performance, Sports Med 2011 (abstrakt, Europe PMC)](https://europepmc.org/article/MED/21615188) (abstrakt (kąt zgięcia kolana przy wyprostowanej nodze; parafraza)) `bike.seat`
- Na pedale opieraj przednią część stopy. — Concept2: [Setting Up the BikeErg](https://www.concept2.nl/en/node/8909) (przednia część stopy na pedale); HSS: [A. Karp, How to Set Up an Exercise (or Spin) Bike Properly (21.12.2020)](https://www.hss.edu/health-library/move-better/set-up-exercise-bike) (Foot position (śródstopie nad pedałem; parafraza)) `bike.foot`

### Snatch (hantel)

**Ustawienie**

- Postaw hantel między stopami; zejdź jak do martwego ciągu — plecy proste, klatka uniesiona — i chwyć go jedną ręką. — BarBend: [Dumbbell Snatch (M. Dewar, CSCS; aktualizacja J. Dickson, NASM-CPT, USAW-L2, 26.11.2024)](https://barbend.com/dumbbell-snatch/) (Step 1: Squat Down (dumbbell directly below you; deadlift-like start, chest up; back flat)); Rogue Fitness: [Movement Demo — Alternating Dumbbell Snatch (Set Up, Execution)](https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-alternating-dumbbell-snatch) (Set Up (dumbbell between your feet; hinge, one hand on the dumbbell in a deadlift set up; flat back)) `kbb.dbSnatchSetup`

**Ruch**

- Odepchnij podłogę nogami, mocno wyprostuj biodra i kolana, a potem poprowadź hantel w górę i wypchnij go nad głowę. — BarBend: [Dumbbell Snatch (M. Dewar, CSCS; aktualizacja J. Dickson, NASM-CPT, USAW-L2, 26.11.2024)](https://barbend.com/dumbbell-snatch/) (Step 2–3 (forcefully extend your body; guide it vertically; extend the arm from underneath; elbow locked out)); Rogue Fitness: [Movement Demo — Alternating Dumbbell Snatch (Set Up, Execution)](https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-alternating-dumbbell-snatch) (Execution (drive the floor away; extend hips and knees, shrug; pull and punch the dumbbell overhead)) `kbb.dbSnatchMove`

**Wskazówki**

- Ręka włącza się dopiero po wyproście bioder i kolan — wcześniej tylko luźno trzyma hantel. — BarBend: [Dumbbell Snatch (M. Dewar, CSCS; aktualizacja J. Dickson, NASM-CPT, USAW-L2, 26.11.2024)](https://barbend.com/dumbbell-snatch/) (Common Mistakes: Pulling With Your Arms (arm relaxed, legs and hips do the work in the first half)); Rogue Fitness: [Movement Demo — Alternating Dumbbell Snatch (Set Up, Execution)](https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-alternating-dumbbell-snatch) (Execution (Only use the arm after extending the hips and knees)) `kbb.dbArmLate`
- Na górze zablokuj łokieć — ręka prosta nad głową. — BarBend: [Dumbbell Snatch (M. Dewar, CSCS; aktualizacja J. Dickson, NASM-CPT, USAW-L2, 26.11.2024)](https://barbend.com/dumbbell-snatch/) (Step 3–4 (elbow is locked out; keeping your loaded arm locked out)); Rogue Fitness: [Movement Demo — Alternating Dumbbell Snatch (Set Up, Execution)](https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-alternating-dumbbell-snatch) (Execution (Arm locked out)) `kbb.lockout`

### Double Kettlebell Clean

**Ustawienie**

- Stań szerzej niż na szerokość bioder, żeby oba kettlebelle przeszły między nogami. — ACE: [Advanced Kettlebell Workout for Increased Strength and Conditioning (ACE, 21.04.2015)](https://www.acefitness.org/resources/pros/expert-articles/5386/advanced-kettlebell-workout-for-increased-strength-and-conditioning/) (Double Kettlebell Swing (feet wider than hip-width apart; neutral spine as the bells go back between the legs)); BarBend: [Kettlebell Clean (D. Fraiser, Canadian Kettlebell Instructor, 25.09.2023)](https://barbend.com/kettlebell-clean/) (Double Kettlebell Clean (you'll need a wider stance to hike both bells between your legs)) `kbb.dblStance`

**Ruch**

- Zrób zamach oboma kettlebellami jak przy swingu; po wyproście bioder przyciągnij je blisko ciała i oprzyj przy barkach. — ACE: [Advanced Kettlebell Workout for Increased Strength and Conditioning (ACE, 21.04.2015)](https://www.acefitness.org/resources/pros/expert-articles/5386/advanced-kettlebell-workout-for-increased-strength-and-conditioning/) (Double Kettlebell Clean (after hip extension pull the kettlebell in at the hip, rotate around the wrist, finish in the rack on arm and chest)); BarBend: [Kettlebell Clean (D. Fraiser, Canadian Kettlebell Instructor, 25.09.2023)](https://barbend.com/kettlebell-clean/) (Double Kettlebell Clean (same form as the single-arm clean, one bell in each hand) + Steps 2–4) `kbb.dblCleanMove`

### Double Kettlebell Jerk

**Ustawienie**

- Kettlebelle oparte przy barkach, łokcie przy tułowiu. — CrossFit: [Double-Kettlebell Push Press and Jerk (J. Martone, 01.2008)](https://crossfit.com/essentials/double-kettlebell-push-press-and-jerk) (The Rack (elbows directly over the hips; no space between arms and torso)); StrongFirst: [Go Ballistic—The Jerk for Barbell and Kettlebell (M. Kwon Gracia)](https://www.strongfirst.com/go-ballistic-the-jerk-for-barbell-and-kettlebell/) (kettlebell jerk, krok 1 (pair of kettlebells; elbow close to the ribs)); ACE: [Push-jerk (#385; kettlebells)](https://www.acefitness.org/resources/everyone/exercise-library/385/push-jerk/) (opis (elbows close to the rib cage) (wariant: podrzut nożycowy)) `kbj.rack`

**Ruch**

- Krótko ugnij nogi i wybij kettlebelle w górę, od razu zejdź pod nie drugim ugięciem na prostych rękach i wstań. — CrossFit: [Double-Kettlebell Push Press and Jerk (J. Martone, 01.2008)](https://crossfit.com/essentials/double-kettlebell-push-press-and-jerk) (Jerk, kroki 1–5); StrongFirst: [Go Ballistic—The Jerk for Barbell and Kettlebell (M. Kwon Gracia)](https://www.strongfirst.com/go-ballistic-the-jerk-for-barbell-and-kettlebell/) (kettlebell jerk, kroki 2–5 (one arm or both)); BarBend: [Kettlebell Jerk vs Push Press (M. Dewar, CSCS; akt. 24.08.2023)](https://barbend.com/kettlebell-jerk-vs-push-press) (Kettlebell Jerk) `kbj.move`

**Wskazówki**

- Nadgarstki trzymaj prosto. — CrossFit: [Double-Kettlebell Push Press and Jerk (J. Martone, 01.2008)](https://crossfit.com/essentials/double-kettlebell-push-press-and-jerk) (The Rack (straight or just slightly flexed)); StrongFirst: [Go Ballistic—The Jerk for Barbell and Kettlebell (M. Kwon Gracia)](https://www.strongfirst.com/go-ballistic-the-jerk-for-barbell-and-kettlebell/) (kettlebell jerk, krok 1 (straight wrists)) `kbb.wrist`
- Ugięcie nóg krótkie, tułów zostaje pionowo. — CrossFit: [Double-Kettlebell Push Press and Jerk (J. Martone, 01.2008)](https://crossfit.com/essentials/double-kettlebell-push-press-and-jerk) (Jerk, krok 2 (dip slightly, torso upright)); StrongFirst: [Go Ballistic—The Jerk for Barbell and Kettlebell (M. Kwon Gracia)](https://www.strongfirst.com/go-ballistic-the-jerk-for-barbell-and-kettlebell/) (kettlebell jerk, krok 2 (dip straight down)) `kbb.dip`
- Najpierw do końca wyprostuj nogi i biodra, dopiero potem schodź pod ciężar. — CrossFit: [Double-Kettlebell Push Press and Jerk (J. Martone, 01.2008)](https://crossfit.com/essentials/double-kettlebell-push-press-and-jerk) (Jerk (extend the hips completely before the second dip)); StrongFirst: [Go Ballistic—The Jerk for Barbell and Kettlebell (M. Kwon Gracia)](https://www.strongfirst.com/go-ballistic-the-jerk-for-barbell-and-kettlebell/) (kettlebell jerk, krok 3 (bells stay in the rack until hips and knees fully extend)) `kbj.fullExt`
- Zablokuj łokcie nad głową już w drugim ugięciu — dopiero potem wstań. — CrossFit: [Double-Kettlebell Push Press and Jerk (J. Martone, 01.2008)](https://crossfit.com/essentials/double-kettlebell-push-press-and-jerk) (Jerk („drop and lock”; then extend the knees)); StrongFirst: [Go Ballistic—The Jerk for Barbell and Kettlebell (M. Kwon Gracia)](https://www.strongfirst.com/go-ballistic-the-jerk-for-barbell-and-kettlebell/) (kettlebell jerk, kroki 4–5) `kbj.lockFirst`

### Power Clean

**Ustawienie**

- Stopy na szerokość bioder do barków, palce lekko na zewnątrz. — Catalyst Athletics: [Power Clean](https://www.catalystathletics.com/exercise/67/Power-Clean/) (akapit Setup (feet about hip-width, toes turned out)); BarBend: [The Power Clean Exercise: How To… (akt. 25.03.2024)](https://barbend.com/power-clean/) (Step 1 (hip-width stance, feet pointed out slightly)) `olympic.feet`
- Na starcie plecy proste, tułów mocno napięty. — Catalyst Athletics: [Power Clean](https://www.catalystathletics.com/exercise/67/Power-Clean/) (akapit Setup (trunk braced, back extended)); BarBend: [The Power Clean Exercise: How To… (akt. 25.03.2024)](https://barbend.com/power-clean/) (Step 2 (Flatten your back)) `olympic.setupBack`

**Ruch**

- Zacznij od pchania nogami w podłogę — ręce zostają proste. — Catalyst Athletics: [Power Clean](https://www.catalystathletics.com/exercise/67/Power-Clean/) (akapit First pull (push through the whole foot); Setup (arms straight)); BarBend: [The Power Clean Exercise: How To… (akt. 25.03.2024)](https://barbend.com/power-clean/) (Step 3 (pushing down into the floor)) `olympic.legsFirst`
- Gdy sztanga minie kolana, mocno wyprostuj biodra i nogi. — Catalyst Athletics: [Power Clean](https://www.catalystathletics.com/exercise/67/Power-Clean/) (akapit First pull (after the knees: drive legs, extend hips aggressively)); Experience Life: [How to Power Clean (A. Heffernan, CSCS, 20.05.2019)](https://experiencelife.lifetime.life/article/learn-to-power-clean/) (3. The Second Pull (thrust hips forward, straighten knees)) `olympic.extend`
- Po wyproście szybko przerzuć łokcie do przodu pod sztangą i przyjmij ją na przód barków. — Catalyst Athletics: [Power Clean](https://www.catalystathletics.com/exercise/67/Power-Clean/) (akapity Second pull / Receiving (elbows up and out; spin elbows around the bar into rack)); BarBend: [The Power Clean Exercise: How To… (akt. 25.03.2024)](https://barbend.com/power-clean/) (Step 5 (flip your elbows around, front rack)); Experience Life: [How to Power Clean (A. Heffernan, CSCS, 20.05.2019)](https://experiencelife.lifetime.life/article/learn-to-power-clean/) (4. The Catch (rotate elbows forward and under, fronts of the shoulders)) `olympic.under`
- Sztangę przyjmij w płytkim przysiadzie. — Catalyst Athletics: [Power Clean](https://www.catalystathletics.com/exercise/67/Power-Clean/) (akapit Receiving (partial squat, brake hard, stay above parallel)); BarBend: [The Power Clean Exercise: How To… (akt. 25.03.2024)](https://barbend.com/power-clean/) (Step 5 (legs slightly bent)); Experience Life: [How to Power Clean (A. Heffernan, CSCS, 20.05.2019)](https://experiencelife.lifetime.life/article/learn-to-power-clean/) (4. The Catch (quarter- to half-squat)) `olympic.catchHigh`

**Wskazówki**

- Sztanga blisko ciała przez cały ciąg. — Catalyst Athletics: [Power Clean](https://www.catalystathletics.com/exercise/67/Power-Clean/) (akapit First pull (bar close to the body)); Experience Life: [How to Power Clean (A. Heffernan, CSCS, 20.05.2019)](https://experiencelife.lifetime.life/article/learn-to-power-clean/) (3. The Second Pull (keep the bar close to the body)) `oly.close`
- Ręce proste jak najdłużej — sztangę wybijają nogi i biodra. — BarBend: [The Power Clean Exercise: How To… (akt. 25.03.2024)](https://barbend.com/power-clean/) (Common Mistakes: Using Your Arms); Experience Life: [How to Power Clean (A. Heffernan, CSCS, 20.05.2019)](https://experiencelife.lifetime.life/article/learn-to-power-clean/) (2. The Transition (arms straight) + Common Mistakes: Pulling with the arms) `oly.legs`

**Czego unikać**

- Ciągnięcie rękami, zanim nogi i biodra skończą wyprost. — BarBend: [The Power Clean Exercise: How To… (akt. 25.03.2024)](https://barbend.com/power-clean/) (Common Mistakes: Using Your Arms); Experience Life: [How to Power Clean (A. Heffernan, CSCS, 20.05.2019)](https://experiencelife.lifetime.life/article/learn-to-power-clean/) (Common Mistakes: Bending the arms too early) `olympic.mis.arms`
- Sztanga odjeżdża od ciała. — Experience Life: [How to Power Clean (A. Heffernan, CSCS, 20.05.2019)](https://experiencelife.lifetime.life/article/learn-to-power-clean/) (Common Mistakes: Bar drifting away from the body); BarBend: [How to Do the Clean… (akt. 19.11.2024)](https://barbend.com/how-to-do-the-clean/) (Common Mistakes: Kicking the Bar (bazowy ruch: zarzut)) `mis.barAway`

### Clean

**Ustawienie**

- Na starcie plecy proste, tułów mocno napięty. — Catalyst Athletics: [Clean](https://www.catalystathletics.com/exercise/59/Clean/) (akapit Setup (trunk braced, back extended)); BarBend: [The Power Clean Exercise: How To… (akt. 25.03.2024)](https://barbend.com/power-clean/) (Step 2 (bazowy ruch: power clean — ten sam ciąg wg catalyst-67)); CrossFit: [The Clean and Jerk (Essentials, 21.01.2020)](https://www.crossfit.com/essentials/the-clean-and-jerk) (Setup Position (back flat; shoulders slightly in front of the bar)) `olympic.setupBack`

**Ruch**

- Zacznij od pchania nogami w podłogę — ręce zostają proste. — Catalyst Athletics: [Clean](https://www.catalystathletics.com/exercise/59/Clean/) (akapit First pull (legs push through the whole foot); Setup (arms straight)); BarBend: [How to Do the Clean… (akt. 19.11.2024)](https://barbend.com/how-to-do-the-clean/) (Push, Hard (pushing into the floor with your legs)) `olympic.legsFirst`
- Gdy sztanga minie kolana, mocno wyprostuj biodra i nogi. — Catalyst Athletics: [Clean](https://www.catalystathletics.com/exercise/59/Clean/) (akapit First pull (keep driving, extend hips forcefully)); BarBend: [How to Do the Clean… (akt. 19.11.2024)](https://barbend.com/how-to-do-the-clean/) (Extend Up (mid to high-thigh, triple extension)); CrossFit: [The Clean and Jerk (Essentials, 21.01.2020)](https://www.crossfit.com/essentials/the-clean-and-jerk) (Clean — Second Pull (from mid-thigh, fully extend hips and legs)) `olympic.extend`
- Po wyproście szybko przerzuć łokcie do przodu pod sztangą i przyjmij ją na przód barków. — Catalyst Athletics: [Clean](https://www.catalystathletics.com/exercise/59/Clean/) (akapity Third pull / Receive (elbows spin around the bar to rack)); BarBend: [How to Do the Clean… (akt. 19.11.2024)](https://barbend.com/how-to-do-the-clean/) (Flip and Rack); CrossFit: [The Clean and Jerk (Essentials, 21.01.2020)](https://www.crossfit.com/essentials/the-clean-and-jerk) (Clean — Third Pull (elbows high, bar racked on the shoulders)) `olympic.under`
- Sztangę przyjmij w pełnym przysiadzie i od razu wstań. — Catalyst Athletics: [Clean](https://www.catalystathletics.com/exercise/59/Clean/) (akapity Third pull / Recovery (squat under; drive up immediately)); BarBend: [How to Do the Clean… (akt. 19.11.2024)](https://barbend.com/how-to-do-the-clean/) (Flip and Rack (drop under, catch, stand up)); CrossFit: [The Clean and Jerk (Essentials, 21.01.2020)](https://www.crossfit.com/essentials/the-clean-and-jerk) (Clean — Third Pull (finish in a front squat and stand up)) `olympic.catchLow`

**Wskazówki**

- Sztanga blisko ciała przez cały ciąg. — Catalyst Athletics: [Clean](https://www.catalystathletics.com/exercise/59/Clean/) (akapit Second pull (bar close to the body)); CrossFit: [The Clean and Jerk (Essentials, 21.01.2020)](https://www.crossfit.com/essentials/the-clean-and-jerk) (Clean — First/Second Pull (bar close to the body)) `oly.close`
- Ręce proste jak najdłużej — sztangę wybijają nogi i biodra. — BarBend: [How to Do the Clean… (akt. 19.11.2024)](https://barbend.com/how-to-do-the-clean/) (Common Mistakes: Trying to „Muscle It”); Experience Life: [How to Power Clean (A. Heffernan, CSCS, 20.05.2019)](https://experiencelife.lifetime.life/article/learn-to-power-clean/) (Common Mistakes: Pulling with the arms (bazowy ruch: power clean)); CrossFit: [The Clean and Jerk (Essentials, 21.01.2020)](https://www.crossfit.com/essentials/the-clean-and-jerk) (Clean — Second Pull (arms long)) `oly.legs`

**Czego unikać**

- Sztanga odjeżdża od ciała. — BarBend: [How to Do the Clean… (akt. 19.11.2024)](https://barbend.com/how-to-do-the-clean/) (Common Mistakes: Kicking the Bar); Experience Life: [How to Power Clean (A. Heffernan, CSCS, 20.05.2019)](https://experiencelife.lifetime.life/article/learn-to-power-clean/) (Common Mistakes: Bar drifting away (bazowy ruch: power clean)); CrossFit: [The Clean and Jerk (Essentials, 21.01.2020)](https://www.crossfit.com/essentials/the-clean-and-jerk) (Common Faults: Incomplete first pull (bar drifts from the body)) `mis.barAway`
- Ciągnięcie rękami, zanim nogi i biodra skończą wyprost. — BarBend: [How to Do the Clean… (akt. 19.11.2024)](https://barbend.com/how-to-do-the-clean/) (Common Mistakes: Trying to „Muscle It”); Experience Life: [How to Power Clean (A. Heffernan, CSCS, 20.05.2019)](https://experiencelife.lifetime.life/article/learn-to-power-clean/) (Common Mistakes: Bending the arms too early (bazowy ruch: power clean)); CrossFit: [The Clean and Jerk (Essentials, 21.01.2020)](https://www.crossfit.com/essentials/the-clean-and-jerk) (Common Faults: Pulling early on the clean (arms bend before full hip and knee extension)) `olympic.mis.arms`

### Hang Clean

**Ustawienie**

- Wstań ze sztangą i opuść ją tuż nad kolana: biodra w tył, plecy proste, barki nad sztangą lub lekko przed nią. — Catalyst Athletics: [Hang Clean](https://www.catalystathletics.com/exercise/68/Hang-Clean/) (akapit Starting hang position (stand the bar up, lower under control to the hang; high-hang/knee: shoulder above or slightly in front of the bar)); Rogue Fitness: [Movement Demo — Hang Squat Clean](https://www.roguefitness.com/theindex/movement-library/movement-demo-hang-squat-clean) (Hang Position (just above the knees, hips back, flat back, shoulders on top or just in front)); BarBend: [How to Do a Hang Clean (akt. 19.12.2023)](https://barbend.com/hang-clean/) (FAQ Step 2 (hinge until the bar is past your knees)) `olympic.hangStart`

**Ruch**

- Zacznij od pchania nogami w podłogę — ręce zostają proste. — Catalyst Athletics: [Hang Clean](https://www.catalystathletics.com/exercise/68/Hang-Clean/) (akapit How the lift begins (drive through the floor with the legs)); Rogue Fitness: [Movement Demo — Hang Squat Clean](https://www.roguefitness.com/theindex/movement-library/movement-demo-hang-squat-clean) (Execution (leg drive, arms remaining straight)); BarBend: [How to Do a Hang Clean (akt. 19.12.2023)](https://barbend.com/hang-clean/) (Step 2 (push your feet into the floor)) `olympic.legsFirst`
- Ze zwisu mocno wyprostuj biodra i nogi. — Catalyst Athletics: [Hang Clean](https://www.catalystathletics.com/exercise/68/Hang-Clean/) (akapit How the lift begins (hips extend forcefully)); Rogue Fitness: [Movement Demo — Hang Squat Clean](https://www.roguefitness.com/theindex/movement-library/movement-demo-hang-squat-clean) (Execution (explosively extend hips and knees)); BarBend: [How to Do a Hang Clean (akt. 19.12.2023)](https://barbend.com/hang-clean/) (Step 3 (drive your hips forward)) `olympic.hangExtend`
- Po wyproście szybko przerzuć łokcie do przodu pod sztangą i przyjmij ją na przód barków. — Catalyst Athletics: [Hang Clean](https://www.catalystathletics.com/exercise/68/Hang-Clean/) (akapit Elbows and rack (spin the elbows around the bar)); Rogue Fitness: [Movement Demo — Hang Squat Clean](https://www.roguefitness.com/theindex/movement-library/movement-demo-hang-squat-clean) (Execution (fast elbows, under and around the bar)); BarBend: [How to Do a Hang Clean (akt. 19.12.2023)](https://barbend.com/hang-clean/) (Step 3–4 (high elbows, front rack)) `olympic.under`
- Sztangę przyjmij w pełnym przysiadzie i od razu wstań. — Catalyst Athletics: [Hang Clean](https://www.catalystathletics.com/exercise/68/Hang-Clean/) (akapit Receive (squat under, drive up immediately)); Rogue Fitness: [Movement Demo — Hang Squat Clean](https://www.roguefitness.com/theindex/movement-library/movement-demo-hang-squat-clean) (Receiving (full-depth squat)); BarBend: [How to Do a Hang Clean (akt. 19.12.2023)](https://barbend.com/hang-clean/) (Step 4 (drop into a deep squat)) `olympic.catchLow`

**Wskazówki**

- Sztanga blisko ciała przez cały ciąg. — Catalyst Athletics: [Hang Clean](https://www.catalystathletics.com/exercise/68/Hang-Clean/) (akapit How the lift begins (bar close to the body)); Rogue Fitness: [Movement Demo — Hang Squat Clean](https://www.roguefitness.com/theindex/movement-library/movement-demo-hang-squat-clean) (Execution (keep the bar close)); BarBend: [How to Do a Hang Clean (akt. 19.12.2023)](https://barbend.com/hang-clean/) (FAQ Step 3 (keeping it close to your body)) `oly.close`

**Czego unikać**

- Ciągnięcie rękami, zanim nogi i biodra skończą wyprost. — Experience Life: [How to Power Clean (A. Heffernan, CSCS, 20.05.2019)](https://experiencelife.lifetime.life/article/learn-to-power-clean/) (Common Mistakes: Bending the arms too early (bazowy ruch: zarzut z ziemi)); BarBend: [How to Do the Clean… (akt. 19.11.2024)](https://barbend.com/how-to-do-the-clean/) (Common Mistakes: Trying to „Muscle It” (bazowy ruch: zarzut z ziemi)) `olympic.mis.arms`
- Sztanga odjeżdża od ciała. — Experience Life: [How to Power Clean (A. Heffernan, CSCS, 20.05.2019)](https://experiencelife.lifetime.life/article/learn-to-power-clean/) (Common Mistakes: Bar drifting away (bazowy ruch)); BarBend: [How to Do the Clean… (akt. 19.11.2024)](https://barbend.com/how-to-do-the-clean/) (Common Mistakes: Kicking the Bar (bazowy ruch)) `mis.barAway`

### Block Clean

**Ustawienie**

- Na starcie plecy proste, tułów mocno napięty. — Catalyst Athletics: [Block Clean](https://www.catalystathletics.com/exercise/379/Block-Clean/) (akapit Setup and pull (brace the trunk; same position as a clean at that height)); BarBend: [How to Do the Clean… (akt. 19.11.2024)](https://barbend.com/how-to-do-the-clean/) (Setup (bazowy ruch: zarzut z ziemi)) `olympic.setupBack`

**Ruch**

- Zacznij od pchania nogami w podłogę — ręce zostają proste. — Catalyst Athletics: [Block Clean](https://www.catalystathletics.com/exercise/379/Block-Clean/) (akapit Setup and pull (drive through the floor with the legs)); BarBend: [How to Do the Clean… (akt. 19.11.2024)](https://barbend.com/how-to-do-the-clean/) (Push, Hard (bazowy ruch)) `olympic.legsFirst`
- Gdy sztanga minie kolana, mocno wyprostuj biodra i nogi. — Catalyst Athletics: [Block Clean](https://www.catalystathletics.com/exercise/379/Block-Clean/) (akapit Setup and pull (fully extend the hips)); BarBend: [How to Do the Clean… (akt. 19.11.2024)](https://barbend.com/how-to-do-the-clean/) (Extend Up (bazowy ruch)) `olympic.extend`
- Po wyproście szybko przerzuć łokcie do przodu pod sztangą i przyjmij ją na przód barków. — Catalyst Athletics: [Block Clean](https://www.catalystathletics.com/exercise/379/Block-Clean/) (akapit Receive (spin the elbows around the bar)); BarBend: [How to Do the Clean… (akt. 19.11.2024)](https://barbend.com/how-to-do-the-clean/) (Flip and Rack (bazowy ruch)) `olympic.under`
- Sztangę przyjmij w pełnym przysiadzie i od razu wstań. — Catalyst Athletics: [Block Clean](https://www.catalystathletics.com/exercise/379/Block-Clean/) (akapity Receive / Recovery (squat under; drive back up immediately)); BarBend: [How to Do the Clean… (akt. 19.11.2024)](https://barbend.com/how-to-do-the-clean/) (Flip and Rack (bazowy ruch)) `olympic.catchLow`

**Czego unikać**

- Ciągnięcie rękami, zanim nogi i biodra skończą wyprost. — BarBend: [How to Do the Clean… (akt. 19.11.2024)](https://barbend.com/how-to-do-the-clean/) (Common Mistakes: Trying to „Muscle It” (bazowy ruch)); Experience Life: [How to Power Clean (A. Heffernan, CSCS, 20.05.2019)](https://experiencelife.lifetime.life/article/learn-to-power-clean/) (Common Mistakes: Bending the arms too early (bazowy ruch)) `olympic.mis.arms`
- Sztanga odjeżdża od ciała. — BarBend: [How to Do the Clean… (akt. 19.11.2024)](https://barbend.com/how-to-do-the-clean/) (Common Mistakes: Kicking the Bar (bazowy ruch)); Experience Life: [How to Power Clean (A. Heffernan, CSCS, 20.05.2019)](https://experiencelife.lifetime.life/article/learn-to-power-clean/) (Common Mistakes: Bar drifting away (bazowy ruch)) `mis.barAway`

### Block Power Clean

**Ustawienie**

- Na starcie plecy proste, tułów mocno napięty. — Catalyst Athletics: [Block Power Clean](https://www.catalystathletics.com/exercise/380/Block-Power-Clean/) (akapit Setup (same position as at that point of a power clean from the floor)); BarBend: [The Power Clean Exercise: How To… (akt. 25.03.2024)](https://barbend.com/power-clean/) (Step 2 (bazowy ruch: power clean z ziemi)) `olympic.setupBack`

**Ruch**

- Zacznij od pchania nogami w podłogę — ręce zostają proste. — Catalyst Athletics: [Block Power Clean](https://www.catalystathletics.com/exercise/380/Block-Power-Clean/) (akapit Pull (drive through the whole foot)); BarBend: [The Power Clean Exercise: How To… (akt. 25.03.2024)](https://barbend.com/power-clean/) (Step 3 (bazowy ruch)) `olympic.legsFirst`
- Po wyproście szybko przerzuć łokcie do przodu pod sztangą i przyjmij ją na przód barków. — Catalyst Athletics: [Block Power Clean](https://www.catalystathletics.com/exercise/380/Block-Power-Clean/) (akapit Receive depth (elbows up and out, spin into the rack)); BarBend: [The Power Clean Exercise: How To… (akt. 25.03.2024)](https://barbend.com/power-clean/) (Step 5 (bazowy ruch)) `olympic.under`
- Sztangę przyjmij w płytkim przysiadzie. — Catalyst Athletics: [Block Power Clean](https://www.catalystathletics.com/exercise/380/Block-Power-Clean/) (akapit Receive depth (brake hard, stay above parallel)); BarBend: [The Power Clean Exercise: How To… (akt. 25.03.2024)](https://barbend.com/power-clean/) (Step 5 (legs slightly bent; bazowy ruch)) `olympic.catchHigh`

**Wskazówki**

- Sztanga blisko ciała przez cały ciąg. — Catalyst Athletics: [Block Power Clean](https://www.catalystathletics.com/exercise/380/Block-Power-Clean/) (akapit Pull (keeping the bar as close as possible)); Experience Life: [How to Power Clean (A. Heffernan, CSCS, 20.05.2019)](https://experiencelife.lifetime.life/article/learn-to-power-clean/) (3. The Second Pull (bazowy ruch)) `oly.close`

**Czego unikać**

- Ciągnięcie rękami, zanim nogi i biodra skończą wyprost. — BarBend: [The Power Clean Exercise: How To… (akt. 25.03.2024)](https://barbend.com/power-clean/) (Common Mistakes: Using Your Arms (bazowy ruch)); Experience Life: [How to Power Clean (A. Heffernan, CSCS, 20.05.2019)](https://experiencelife.lifetime.life/article/learn-to-power-clean/) (Common Mistakes: Bending the arms too early (bazowy ruch)) `olympic.mis.arms`
- Sztanga odjeżdża od ciała. — Experience Life: [How to Power Clean (A. Heffernan, CSCS, 20.05.2019)](https://experiencelife.lifetime.life/article/learn-to-power-clean/) (Common Mistakes: Bar drifting away (bazowy ruch)); BarBend: [How to Do the Clean… (akt. 19.11.2024)](https://barbend.com/how-to-do-the-clean/) (Common Mistakes: Kicking the Bar (bazowy ruch)) `mis.barAway`

### Split Clean

**Ustawienie**

- Na starcie plecy proste, tułów mocno napięty. — Catalyst Athletics: [Clean](https://www.catalystathletics.com/exercise/59/Clean/) (akapit Setup (bazowy ruch: catalyst-211 odsyła do mechaniki zarzutu)); BarBend: [How to Do the Clean… (akt. 19.11.2024)](https://barbend.com/how-to-do-the-clean/) (Setup (bazowy ruch)) `olympic.setupBack`

**Ruch**

- Zacznij od pchania nogami w podłogę — ręce zostają proste. — Catalyst Athletics: [Clean](https://www.catalystathletics.com/exercise/59/Clean/) (akapit First pull (bazowy ruch)); BarBend: [How to Do the Clean… (akt. 19.11.2024)](https://barbend.com/how-to-do-the-clean/) (Push, Hard (bazowy ruch)) `olympic.legsFirst`
- Gdy sztanga minie kolana, mocno wyprostuj biodra i nogi. — Catalyst Athletics: [Clean](https://www.catalystathletics.com/exercise/59/Clean/) (akapit First pull (bazowy ruch)); BarBend: [How to Do the Clean… (akt. 19.11.2024)](https://barbend.com/how-to-do-the-clean/) (Extend Up (bazowy ruch)) `olympic.extend`
- Ciągnij jak w zwykłym zarzucie, a sztangę przyjmij w nożycach — jedna stopa w przód, druga w tył. — Catalyst Athletics: [Split Clean](https://www.catalystathletics.com/exercise/211/Split-Clean/) (akapit Execution (squat clean mechanics, under in a split position)); IronMind: [Jim Schmitz: Split Lifting Technique (ok. 07.2012 — data z wpisu IronMind News 06.07.2012, który go zapowiada)](https://ironmind.com/articles/jim-schmitz-on-the-lifts/Split-Lifting-Technique/) (akapit o split clean (pulled just as for a power or squat lift; front leg forward, back leg backward)) `olympic.splitCatch`

**Czego unikać**

- Ciągnięcie rękami, zanim nogi i biodra skończą wyprost. — BarBend: [How to Do the Clean… (akt. 19.11.2024)](https://barbend.com/how-to-do-the-clean/) (Common Mistakes: Trying to „Muscle It” (bazowy ruch)); Experience Life: [How to Power Clean (A. Heffernan, CSCS, 20.05.2019)](https://experiencelife.lifetime.life/article/learn-to-power-clean/) (Common Mistakes: Bending the arms too early (bazowy ruch)) `olympic.mis.arms`

### Clean and Jerk

**Ustawienie**

- Na starcie plecy proste, tułów mocno napięty. — Catalyst Athletics: [Clean & Jerk](https://www.catalystathletics.com/exercise/76/Clean-Jerk/) (akapit Clean (braced back)); CrossFit: [The Clean and Jerk (Essentials, 21.01.2020)](https://www.crossfit.com/essentials/the-clean-and-jerk) (Setup Position (back flat)) `olympic.setupBack`

**Ruch**

- Zacznij od pchania nogami w podłogę — ręce zostają proste. — Catalyst Athletics: [Clean & Jerk](https://www.catalystathletics.com/exercise/76/Clean-Jerk/) (akapit Clean (push with the legs through the whole foot)); BarBend: [How to Do the Clean… (akt. 19.11.2024)](https://barbend.com/how-to-do-the-clean/) (Push, Hard (bazowy ruch: zarzut)) `olympic.legsFirst`
- Gdy sztanga minie kolana, mocno wyprostuj biodra i nogi. — CrossFit: [The Clean and Jerk (Essentials, 21.01.2020)](https://www.crossfit.com/essentials/the-clean-and-jerk) (Clean — Second Pull (from mid-thigh, fully extend hips and legs)); BarBend: [How to Do the Clean… (akt. 19.11.2024)](https://barbend.com/how-to-do-the-clean/) (Extend Up (bazowy ruch: zarzut)) `olympic.extend`
- Po wyproście szybko przerzuć łokcie do przodu pod sztangą i przyjmij ją na przód barków. — Catalyst Athletics: [Clean & Jerk](https://www.catalystathletics.com/exercise/76/Clean-Jerk/) (akapit Transition and rack (spin the elbows around the bar)); CrossFit: [The Clean and Jerk (Essentials, 21.01.2020)](https://www.crossfit.com/essentials/the-clean-and-jerk) (Clean — Third Pull (elbows high, bar racked on the shoulders)) `olympic.under`
- Krótko ugnij kolana, wybij sztangę nogami i wskocz pod nią w nożyce; złap ją na prostych rękach. — Catalyst Athletics: [Clean & Jerk](https://www.catalystathletics.com/exercise/76/Clean-Jerk/) (część jerk (dip, drive straight back up with the legs, push the bar up, move the feet into the split as you punch the elbows)); CrossFit: [The Clean and Jerk (Essentials, 21.01.2020)](https://www.crossfit.com/essentials/the-clean-and-jerk) (Jerk — Dip / Drive / Split-Receive (arms push under the bar, feet into a split, arms locked out)) `olympic.splitMove`

**Wskazówki**

- Sztanga blisko ciała przez cały ciąg. — CrossFit: [The Clean and Jerk (Essentials, 21.01.2020)](https://www.crossfit.com/essentials/the-clean-and-jerk) (Clean — First/Second Pull (bar close to the body)); Catalyst Athletics: [Clean](https://www.catalystathletics.com/exercise/59/Clean/) (akapit Second pull (bazowy ruch: zarzut)) `oly.close`
- Krótkie ugięcie, prosto w dół — tułów zostaje pionowo. — Catalyst Athletics: [Clean & Jerk](https://www.catalystathletics.com/exercise/76/Clean-Jerk/) (część jerk („Dip by bending at the knees only with the trunk vertical”)); CrossFit: [The Clean and Jerk (Essentials, 21.01.2020)](https://www.crossfit.com/essentials/the-clean-and-jerk) (Jerk — Dip (hips and shoulders travel straight down, torso vertical)) `olympic.dip`
- Siła wybicia idzie z nóg i bioder — ręce kończą ruch. — Catalyst Athletics: [Clean & Jerk](https://www.catalystathletics.com/exercise/76/Clean-Jerk/) (część jerk („As you finish the extension of the legs, push the bar up…”)); CrossFit: [The Clean and Jerk (Essentials, 21.01.2020)](https://www.crossfit.com/essentials/the-clean-and-jerk) (Jerk — Drive (aggressively extends the hips and knees), potem Split/Receive (arms push under)) `pp.legs`
- Stopy lądują w tej samej chwili, w której ręce prostują się nad głową. — Catalyst Athletics: [Clean & Jerk](https://www.catalystathletics.com/exercise/76/Clean-Jerk/) (część jerk (move the feet into the split as you punch the elbows)); CrossFit: [The Clean and Jerk (Essentials, 21.01.2020)](https://www.crossfit.com/essentials/the-clean-and-jerk) (Jerk — Split/Receive (arms locked out at the time the feet hit the floor)) `olympic.feetHands`

**Czego unikać**

- Ciągnięcie rękami, zanim nogi i biodra skończą wyprost. — CrossFit: [The Clean and Jerk (Essentials, 21.01.2020)](https://www.crossfit.com/essentials/the-clean-and-jerk) (Common Faults: Pulling early on the clean); BarBend: [How to Do the Clean… (akt. 19.11.2024)](https://barbend.com/how-to-do-the-clean/) (Common Mistakes: Trying to „Muscle It” (bazowy ruch)) `olympic.mis.arms`
- Sztanga odjeżdża od ciała. — CrossFit: [The Clean and Jerk (Essentials, 21.01.2020)](https://www.crossfit.com/essentials/the-clean-and-jerk) (Common Faults: Incomplete first pull (bar drifts from the body)); BarBend: [How to Do the Clean… (akt. 19.11.2024)](https://barbend.com/how-to-do-the-clean/) (Common Mistakes: Kicking the Bar (bazowy ruch)) `mis.barAway`
- Wybijanie sztangi w przód zamiast prosto w górę. — Catalyst Athletics: [Clean & Jerk](https://www.catalystathletics.com/exercise/76/Clean-Jerk/) (część jerk (drive straight back up)); CrossFit: [Foundational Movement: Jerk — What Is a Jerk? (B. Burgener, 29.08.2023)](https://www.crossfit.com/essentials/foundational-movement-jerk-what-is-a-jerk) (Common Faults — Fault #2 (drives the barbell out front; bazowy ruch: podrzut)) `olympic.mis.forward`

### Clean Pull

**Ustawienie**

- Na starcie plecy proste, tułów mocno napięty. — Catalyst Athletics: [Clean Pull](https://www.catalystathletics.com/exercise/98/Clean-Pull/) (akapit Setup (trunk braced, back extended)); Rogue Fitness: [Movement Demo — Clean Pull](https://www.roguefitness.com/theindex/movement-library/movement-demo-clean-pull) (Start Position (flat back)); BarBend: [Clean Pull guide (J. Dickson, USAW-L2, akt. 15.07.2024)](https://barbend.com/clean-pull-guide/) (Step 1 — Set Up (low, braced starting posture)) `olympic.setupBack`

**Ruch**

- Na górze pełny wyprost: biodra, kolana i kostki. — Catalyst Athletics: [Clean Pull](https://www.catalystathletics.com/exercise/98/Clean-Pull/) (akapity Extension / Heels and top position (extend roughly vertically, heels rise naturally)); Rogue Fitness: [Movement Demo — Clean Pull](https://www.roguefitness.com/theindex/movement-library/movement-demo-clean-pull) (Execution (explode through hips, knees, and ankles)); BarBend: [Clean Pull guide (J. Dickson, USAW-L2, akt. 15.07.2024)](https://barbend.com/clean-pull-guide/) (Step 3 — Get Tall (extend hips and legs, then shrug)) `olympic.triple`

**Czego unikać**

- Ciągnięcie rękami, zanim nogi i biodra skończą wyprost. — BarBend: [Clean Pull guide (J. Dickson, USAW-L2, akt. 15.07.2024)](https://barbend.com/clean-pull-guide/) (Common Clean Pull Mistakes: Using Your Arms (only shrug once you've fully extended)); Rogue Fitness: [Movement Demo — Clean Pull](https://www.roguefitness.com/theindex/movement-library/movement-demo-clean-pull) (Execution (bez ciągnięcia rękami — wg notatki z sesji 1)) `olympic.mis.arms`

### Split Jerk

**Ustawienie**

- Sztanga oparta z przodu barków, stopy jak do wyskoku — mniej więcej na szerokość bioder. — Catalyst Athletics: [Split Jerk (Exercise Library #60)](https://catalystathletics.com/exercise/60/Split-Jerk) (opis (heels approximately hip-width; jerk rack position)); CrossFit: [Foundational Movement: Jerk — What Is a Jerk? (B. Burgener, 29.08.2023)](https://www.crossfit.com/essentials/foundational-movement-jerk-what-is-a-jerk) (Split Jerk — setup (jumping/jerk position, hip-width; shelf of the shoulders)) `olympic.jerkSetup`

**Ruch**

- Krótko ugnij kolana, wybij sztangę nogami i wskocz pod nią w nożyce; złap ją na prostych rękach. — Catalyst Athletics: [Split Jerk (Exercise Library #60)](https://catalystathletics.com/exercise/60/Split-Jerk) (opis (dip, drive, push the bar up, move the feet into the split, punch the elbows)); CrossFit: [Foundational Movement: Jerk — What Is a Jerk? (B. Burgener, 29.08.2023)](https://www.crossfit.com/essentials/foundational-movement-jerk-what-is-a-jerk) (Split Jerk — receive (punches body into a lunge)) `olympic.splitMove`

**Wskazówki**

- Krótkie ugięcie, prosto w dół — tułów zostaje pionowo. — Catalyst Athletics: [Split Jerk (Exercise Library #60)](https://catalystathletics.com/exercise/60/Split-Jerk) (opis (bending at the knees only with the trunk vertical)); CrossFit: [Foundational Movement: Jerk — What Is a Jerk? (B. Burgener, 29.08.2023)](https://www.crossfit.com/essentials/foundational-movement-jerk-what-is-a-jerk) (Split Jerk — dip (straight, smooth, and short)) `olympic.dip`

**Czego unikać**

- Wybijanie sztangi w przód zamiast prosto w górę. — CrossFit: [Foundational Movement: Jerk — What Is a Jerk? (B. Burgener, 29.08.2023)](https://www.crossfit.com/essentials/foundational-movement-jerk-what-is-a-jerk) (Common Faults — Fault #2 (drives the barbell out front)); Catalyst Athletics: [Split Jerk (Exercise Library #60)](https://catalystathletics.com/exercise/60/Split-Jerk) (opis (drive straight back up)) `olympic.mis.forward`

### Power Jerk

**Ustawienie**

- Sztanga oparta z przodu barków, stopy jak do wyskoku — mniej więcej na szerokość bioder. — Catalyst Athletics: [Power Jerk (Exercise Library #72)](https://catalystathletics.com/exercise/72/Power-Jerk/) (opis (heels hip-width; jerk rack position)); CrossFit: [Foundational Movement: Jerk — What Is a Jerk? (B. Burgener, 29.08.2023)](https://www.crossfit.com/essentials/foundational-movement-jerk-what-is-a-jerk) (Push (Power) Jerk — feet from hip width) `olympic.jerkSetup`

**Ruch**

- Krótko ugnij kolana, wybij sztangę nogami i wejdź pod nią na nieco szerszych stopach; złap ją na prostych rękach w płytkim przysiadzie, nie niżej niż do równoległego ud. — Catalyst Athletics: [Power Jerk (Exercise Library #72)](https://catalystathletics.com/exercise/72/Power-Jerk/) (opis (feet into squat stance; partial squat above parallel)); CrossFit: [Foundational Movement: Jerk — What Is a Jerk? (B. Burgener, 29.08.2023)](https://www.crossfit.com/essentials/foundational-movement-jerk-what-is-a-jerk) (Push (Power) Jerk — feet hip→shoulder width; parallel or above parallel squat) `olympic.powerMove`

**Wskazówki**

- Krótkie ugięcie, prosto w dół — tułów zostaje pionowo. — Catalyst Athletics: [Power Jerk (Exercise Library #72)](https://catalystathletics.com/exercise/72/Power-Jerk/) (opis (knees only, trunk vertical)); CrossFit: [Foundational Movement: Jerk — What Is a Jerk? (B. Burgener, 29.08.2023)](https://www.crossfit.com/essentials/foundational-movement-jerk-what-is-a-jerk) (dip — opis wspólny dla stylów (straight, smooth, short)) `olympic.dip`

**Czego unikać**

- Wybijanie sztangi w przód zamiast prosto w górę. — CrossFit: [Foundational Movement: Jerk — What Is a Jerk? (B. Burgener, 29.08.2023)](https://www.crossfit.com/essentials/foundational-movement-jerk-what-is-a-jerk) (Common Faults — Fault #2); Catalyst Athletics: [Power Jerk (Exercise Library #72)](https://catalystathletics.com/exercise/72/Power-Jerk/) (opis (drive straight back up)) `olympic.mis.forward`

### Squat Jerk

**Ustawienie**

- Sztanga oparta z przodu barków, stopy jak do wyskoku — mniej więcej na szerokość bioder. — Catalyst Athletics: [Squat Jerk (Exercise Library #75)](https://catalystathletics.com/exercise/75/Squat-Jerk/) (opis (heels hip-width; jerk rack position)); CrossFit: [Foundational Movement: Jerk — What Is a Jerk? (B. Burgener, 29.08.2023)](https://www.crossfit.com/essentials/foundational-movement-jerk-what-is-a-jerk) (setup — jumping/jerk position, hip-width (opis wspólny dla stylów)) `olympic.jerkSetup`

**Ruch**

- Krótko ugnij kolana, wybij sztangę nogami i zejdź pod nią do pełnego przysiadu; złap ją na prostych rękach i wstań. — Catalyst Athletics: [Squat Jerk (Exercise Library #75)](https://catalystathletics.com/exercise/75/Squat-Jerk/) (opis (punch the elbows overhead, drive yourself down into a squat; recover with the bar overhead)); CrossFit: [Foundational Movement: Jerk — What Is a Jerk? (B. Burgener, 29.08.2023)](https://www.crossfit.com/essentials/foundational-movement-jerk-what-is-a-jerk) (Squat Jerk — receive (full-depth squat) and recovery (overhead squat)) `olympic.squatMove`

**Wskazówki**

- Krótkie ugięcie, prosto w dół — tułów zostaje pionowo. — Catalyst Athletics: [Squat Jerk (Exercise Library #75)](https://catalystathletics.com/exercise/75/Squat-Jerk/) (opis (knees only, trunk vertical)); CrossFit: [Foundational Movement: Jerk — What Is a Jerk? (B. Burgener, 29.08.2023)](https://www.crossfit.com/essentials/foundational-movement-jerk-what-is-a-jerk) (dip — opis wspólny dla stylów) `olympic.dip`
- Wstań ze sztangą wciąż nad głową i dopiero wtedy ją opuść. — Catalyst Athletics: [Squat Jerk (Exercise Library #75)](https://catalystathletics.com/exercise/75/Squat-Jerk/) (opis (recover into a standing position with the bar overhead)); CrossFit: [Foundational Movement: Jerk — What Is a Jerk? (B. Burgener, 29.08.2023)](https://www.crossfit.com/essentials/foundational-movement-jerk-what-is-a-jerk) (Squat Jerk — recovery (overhead squat)) `olympic.recover`

**Czego unikać**

- Wybijanie sztangi w przód zamiast prosto w górę. — CrossFit: [Foundational Movement: Jerk — What Is a Jerk? (B. Burgener, 29.08.2023)](https://www.crossfit.com/essentials/foundational-movement-jerk-what-is-a-jerk) (Common Faults — Fault #2 (wspólne dla stylów)); Catalyst Athletics: [Squat Jerk (Exercise Library #75)](https://catalystathletics.com/exercise/75/Squat-Jerk/) (opis (drive straight back up)) `olympic.mis.forward`

### Jerk Dip Squat

**Ustawienie**

- Zanim ugniesz kolana, mocno napnij tułów. — Catalyst Athletics: [Jerk Dip Squat (Exercise Library #194)](https://catalystathletics.com/exercise/194/Jerk-Dip-Squat/) (opis („Brace your trunk as you would for a jerk”)); BarBend: [Jerk Dip — Technique & Benefits (K. Ferriello, akt. 31.07.2023)](https://barbend.com/jerk-dip-technique-benefits/) (Bracing (fill core and chest with a deep breath, push it against the abdominal wall)) `olympic.dipBrace`

**Ruch**

- Ugnij kolana jak przed podrzutem, ale wolno i pod kontrolą, potem spokojnie wstań — bez wybijania sztangi. — Catalyst Athletics: [Jerk Dip Squat (Exercise Library #194)](https://catalystathletics.com/exercise/194/Jerk-Dip-Squat/) (opis (dip as for a jerk but at a controlled speed; change direction at a controlled speed; stand again naturally) + Notes (no drive or speed)); BarBend: [Jerk Dip — Technique & Benefits (K. Ferriello, akt. 31.07.2023)](https://barbend.com/jerk-dip-technique-benefits/) (opis odmian (jerk dip squat: „slower and more controlled movement than the jerk dip in an actual jerk”; wybicie dodaje dopiero odmiana „jerk drive”)) `olympic.dipSquat`

**Czego unikać**

- Zbyt szybkie ugięcie, po którym wypadasz z pozycji. — BarBend: [Jerk Dip — Technique & Benefits (K. Ferriello, akt. 31.07.2023)](https://barbend.com/jerk-dip-technique-benefits/) (wstęp (rushed dips that force the lifter to shift out of position)); Catalyst Athletics: [Jerk Dip Squat (Exercise Library #194)](https://catalystathletics.com/exercise/194/Jerk-Dip-Squat/) (opis (controlled speed regardless of your normal dip tempo; tension throughout legs and hips)) `olympic.mis.dipRushed`

### Jerk Balance

**Ustawienie**

- Sztanga oparta z przodu barków, stopy w krótkich nożycach — przednia stopa bliżej niż zwykle. — Catalyst Athletics: [Jerk Balance (Exercise Library #193)](https://catalystathletics.com/exercise/193/Jerk-Balance/) (opis (jerk rack position; step about a foot-length back with the front foot into a partial split)); BarBend: [Exercises to Strengthen Your Jerk (R. Stefan, akt. 01.07.2024)](https://barbend.com/exercises-to-strengthen-jerk) (Jerk Balance (jerk split stance slightly „shorter” than where you'd receive the bar; bar in the front rack)) `olympic.balanceSetup`

**Ruch**

- Krótko ugnij kolana, wybij sztangę nad głowę i jednocześnie wysuń przednią stopę do pełnych nożyc. — Catalyst Athletics: [Jerk Balance (Exercise Library #193)](https://catalystathletics.com/exercise/193/Jerk-Balance/) (opis (dip straight down, drive straight up, punch the bar overhead, step the front foot forward into the full split)); BarBend: [Exercises to Strengthen Your Jerk (R. Stefan, akt. 01.07.2024)](https://barbend.com/exercises-to-strengthen-jerk) (Jerk Balance (dip and drive from the shortened split; catch overhead while sliding the front leg out)) `olympic.balanceMove`

### Barbell Snatch

**Ustawienie**

- Szeroki chwyt, plecy proste i napięte, barki nad sztangą. — Catalyst Athletics: [Snatch (#58)](https://www.catalystathletics.com/exercise/58/Snatch/) (opis wykonania, start (snatch-width grip; back extended; shoulder joint above the bar)); BarBend: [Power Snatch (R. Stefan, USAW-L1)](https://barbend.com/power-snatch/) (Step 1 Set Your Start (wide snatch grip; back tight) i Step 2 (shoulders over the bar) — wariant power) `olympic.setup`

**Ruch**

- Odepchnij się nogami od podłogi, gdy sztanga dojdzie do bioder, dynamicznie się wyprostuj i wciągnij się pod nią — złap ją na prostych rękach w pełnym przysiadzie, potem wstań. — Catalyst Athletics: [Snatch (#58)](https://www.catalystathletics.com/exercise/58/Snatch/) (opis wykonania (push with the legs; extend the hips; pull elbows up and out; squat under; stand once secure)); Rogue Fitness: [Movement Demo — Hang Squat Snatch](https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-hang-squat-snatch) (Extension, Receive (full depth overhead squat, locked out arms) — wariant: ze zwisu) `olympic.snatchMove`

**Wskazówki**

- Sztanga blisko ciała przez cały ciąg. — Catalyst Athletics: [Snatch (#58)](https://www.catalystathletics.com/exercise/58/Snatch/) (opis wykonania (keeping the bar as close to the body as possible)); Rogue Fitness: [Movement Demo — Hang Squat Snatch](https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-hang-squat-snatch) (Arms (high elbows to keep the bar close to the body) — wariant: ze zwisu (uproszczenie)); BarBend: [Power Snatch (R. Stefan, USAW-L1)](https://barbend.com/power-snatch/) (Muscles Worked › Upper & Lower Back (keep the bar tight to your body) — wariant power (uproszczenie)) `oly.close`
- Ręce proste jak najdłużej — sztangę wybijają nogi i biodra. — Catalyst Athletics: [Snatch (#58)](https://www.catalystathletics.com/exercise/58/Snatch/) (start (arms relaxed and straight) i ciąg (push with the legs)); Rogue Fitness: [Movement Demo — Hang Squat Snatch](https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-hang-squat-snatch) (Extension (leg drive and the arms remaining straight) — wariant: ze zwisu (uproszczenie)); BarBend: [Power Snatch (R. Stefan, USAW-L1)](https://barbend.com/power-snatch/) (Step 2 (arms should remain straight as you pull) — wariant power (uproszczenie)) `oly.legs`
- Barki nad sztangą jak najdłużej — nie odchylaj się za wcześnie. — BarBend: [Need to Fix Your Snatch? (R. Stefan, USAW-L1)](https://barbend.com/fix-your-snatch/) (pkt 2 Not Staying Over the Bar); Rogue Fitness: [Movement Demo — Hang Squat Snatch](https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-hang-squat-snatch) (Extension (shoulders and chest stay over the bar for as long as possible) — wariant: ze zwisu) `olympic.overBar`

**Czego unikać**

- Sztanga odjeżdża od ciała — w ciągu albo po kontakcie z biodrami. — CrossFit: [O'Connor (CF-L4): Ask a Coach — Missing the Bar Forward in the Snatch (2025)](https://www.crossfit.com/pro-coach/ask-a-coach-missing-bar-forward-snatch) (First Pull: The bar separates from the body; Second Pull: Hips are banging into the bar); Catalyst Athletics: [Everett: Keeping the Bar Close — The 3 Biggest Mistakes You're Making (2017)](https://catalystathletics.com/article/2076/Keeping-the-Bar-Close-The-3-Biggest-Mistakes-Youre-Making) (pkt 1 Forward Imbalance in the Pull, pkt 2 Bumping the Bar Off the Hips) `olympic.mis.away`
- Ciągnięcie rękami, zanim nogi i biodra skończą wyprost. — CrossFit: [O'Connor (CF-L4): Ask a Coach — Missing the Bar Forward in the Snatch (2025)](https://www.crossfit.com/pro-coach/ask-a-coach-missing-bar-forward-snatch) (Second Pull: Early Arm Pull); Catalyst Athletics: [Everett: Arm Bend in the Snatch & Clean — It's Still Not the Solution](https://catalystathletics.com/article/1904/Arm-Bend-in-the-Snatch-Clean-Its-Still-Not-the-Solution-to-/) (Why It's a Problem) `olympic.mis.arms`
- Ugięte łokcie nad głową — sztanga spycha cię w dół. — CrossFit: [O'Connor (CF-L4): Ask a Coach — Missing the Bar Forward in the Snatch (2025)](https://www.crossfit.com/pro-coach/ask-a-coach-missing-bar-forward-snatch) (Third Pull: Lazy lockout); BarBend: [Need to Fix Your Snatch? (R. Stefan, USAW-L1)](https://barbend.com/fix-your-snatch/) (pkt 4 A Loose Catch) `olympic.mis.softLockout`

### Power Snatch

**Ustawienie**

- Szeroki chwyt, plecy proste i napięte, barki nad sztangą. — BarBend: [Power Snatch (R. Stefan, USAW-L1)](https://barbend.com/power-snatch/) (Step 1 Set Your Start, Step 2 Pull Into the Hip (shoulders over the bar)); Catalyst Athletics: [Snatch (#58)](https://www.catalystathletics.com/exercise/58/Snatch/) (start — rwanie ogólnie (uproszczenie: ten sam start)); Catalyst Athletics: [Power Snatch (#61)](https://www.catalystathletics.com/exercise/61/) (opis wykonania (set the starting position tightly)) `olympic.setup`

**Ruch**

- Odepchnij się nogami od podłogi, dynamicznie się wyprostuj i wejdź pod sztangę — złap ją na prostych rękach wyżej niż w przysiadzie równoległym, biodra nad kolanami. — Catalyst Athletics: [Power Snatch (#61)](https://www.catalystathletics.com/exercise/61/) (opis wykonania (extend the hips; pull elbows up and out; remain above a parallel squat)); BarBend: [Power Snatch (R. Stefan, USAW-L1)](https://barbend.com/power-snatch/) (Steps 2–4 (hip crease above knee in the catch)); Rogue Fitness: [Movement Demo — Hang Power Snatch](https://www.roguefitness.com/theindex/movement-library/movement-demo-hang-power-snatch) (Receive (hip crease higher than the top of the knees) — wariant: ze zwisu) `olympic.snatchPowerMove`

**Wskazówki**

- Sztanga blisko ciała przez cały ciąg. — Catalyst Athletics: [Power Snatch (#61)](https://www.catalystathletics.com/exercise/61/) (opis wykonania (bar as close to the body as possible)); BarBend: [Power Snatch (R. Stefan, USAW-L1)](https://barbend.com/power-snatch/) (Muscles Worked › Upper & Lower Back (keep the bar tight to your body)) `oly.close`
- Ręce proste jak najdłużej — sztangę wybijają nogi i biodra. — BarBend: [Power Snatch (R. Stefan, USAW-L1)](https://barbend.com/power-snatch/) (Step 2 (arms should remain straight as you pull)); Rogue Fitness: [Movement Demo — Hang Power Snatch](https://www.roguefitness.com/theindex/movement-library/movement-demo-hang-power-snatch) (Extension (leg drive, arms remaining straight) — wariant: ze zwisu); Catalyst Athletics: [Power Snatch (#61)](https://www.catalystathletics.com/exercise/61/) (opis wykonania (push with the legs)) `oly.legs`
- Barki nad sztangą jak najdłużej — nie odchylaj się za wcześnie. — BarBend: [Power Snatch (R. Stefan, USAW-L1)](https://barbend.com/power-snatch/) (Step 2 (shoulders vertically over the bar)); Rogue Fitness: [Movement Demo — Hang Power Snatch](https://www.roguefitness.com/theindex/movement-library/movement-demo-hang-power-snatch) (Extension (shoulders and chest over the bar as long as possible) — wariant: ze zwisu) `olympic.overBar`

**Czego unikać**

- Sztanga odjeżdża od ciała — w ciągu albo po kontakcie z biodrami. — CrossFit: [O'Connor (CF-L4): Ask a Coach — Missing the Bar Forward in the Snatch (2025)](https://www.crossfit.com/pro-coach/ask-a-coach-missing-bar-forward-snatch) (First/Second Pull — rwanie ogólnie (uproszczenie)); Catalyst Athletics: [Everett: Keeping the Bar Close — The 3 Biggest Mistakes You're Making (2017)](https://catalystathletics.com/article/2076/Keeping-the-Bar-Close-The-3-Biggest-Mistakes-Youre-Making) (pkt 1–2 — rwanie i zarzut ogólnie (uproszczenie)) `olympic.mis.away`
- Ciągnięcie rękami, zanim nogi i biodra skończą wyprost. — CrossFit: [O'Connor (CF-L4): Ask a Coach — Missing the Bar Forward in the Snatch (2025)](https://www.crossfit.com/pro-coach/ask-a-coach-missing-bar-forward-snatch) (Second Pull: Early Arm Pull — rwanie ogólnie (uproszczenie)); Catalyst Athletics: [Everett: Arm Bend in the Snatch & Clean — It's Still Not the Solution](https://catalystathletics.com/article/1904/Arm-Bend-in-the-Snatch-Clean-Its-Still-Not-the-Solution-to-/) (Why It's a Problem — rwanie i zarzut ogólnie (uproszczenie)) `olympic.mis.arms`
- Ugięte łokcie nad głową — sztanga spycha cię w dół. — CrossFit: [O'Connor (CF-L4): Ask a Coach — Missing the Bar Forward in the Snatch (2025)](https://www.crossfit.com/pro-coach/ask-a-coach-missing-bar-forward-snatch) (Third Pull: Lazy lockout (uproszczenie)); BarBend: [Need to Fix Your Snatch? (R. Stefan, USAW-L1)](https://barbend.com/fix-your-snatch/) (pkt 4 A Loose Catch (uproszczenie)) `olympic.mis.softLockout`

### Hang Snatch

**Ustawienie**

- Wstań ze sztangą, potem opuść ją do zwisu, cofając biodra — plecy proste, barki nad sztangą. — Catalyst Athletics: [Hang Power Snatch (#62)](https://www.catalystathletics.com/exercise/62/Hang-Power-Snatch/) (opis wykonania (deadlift the bar to standing; lower under control to the hang) — wariant power); Rogue Fitness: [Movement Demo — Hang Squat Snatch](https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-hang-squat-snatch) (Hang Position (hips pushed back; flat back; shoulders on top or just in front of the bar)); BarBend: [What Are Hang Lifts in Weightlifting? (J. Dickson, USAW-L2)](https://barbend.com/what-are-hang-lifts-in-weightlifting/) (What Is the Hang Position (bar suspended; lowered by hinging at the hips)) `olympic.hangSetup`

**Ruch**

- Odepchnij się nogami od podłogi, gdy sztanga dojdzie do bioder, dynamicznie się wyprostuj i wciągnij się pod nią — złap ją na prostych rękach w pełnym przysiadzie, potem wstań. — Rogue Fitness: [Movement Demo — Hang Squat Snatch](https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-hang-squat-snatch) (Extension, Pull Under, Receive (full depth overhead squat), Lockout); Catalyst Athletics: [Snatch (#58)](https://www.catalystathletics.com/exercise/58/Snatch/) (opis wykonania — rwanie ogólnie (uproszczenie: inny start)) `olympic.snatchMove`

**Wskazówki**

- Sztanga blisko ciała przez cały ciąg. — Rogue Fitness: [Movement Demo — Hang Squat Snatch](https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-hang-squat-snatch) (Arms (high elbows to keep the bar close to the body)); Catalyst Athletics: [Hang Power Snatch (#62)](https://www.catalystathletics.com/exercise/62/Hang-Power-Snatch/) (opis wykonania (bar as close to the body as possible)) `oly.close`
- Ręce proste jak najdłużej — sztangę wybijają nogi i biodra. — Rogue Fitness: [Movement Demo — Hang Squat Snatch](https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-hang-squat-snatch) (Extension (leg drive and the arms remaining straight)); BarBend: [What Are Hang Lifts in Weightlifting? (J. Dickson, USAW-L2)](https://barbend.com/what-are-hang-lifts-in-weightlifting/) (legs extend fully before your arms do any work (hang muscle snatch — wariant)); Catalyst Athletics: [Snatch (#58)](https://www.catalystathletics.com/exercise/58/Snatch/) (rwanie ogólnie) `oly.legs`
- Barki nad sztangą jak najdłużej — nie odchylaj się za wcześnie. — Rogue Fitness: [Movement Demo — Hang Squat Snatch](https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-hang-squat-snatch) (Extension); BarBend: [Need to Fix Your Snatch? (R. Stefan, USAW-L1)](https://barbend.com/fix-your-snatch/) (pkt 2 — rwanie ogólnie) `olympic.overBar`

**Czego unikać**

- Sztanga odjeżdża od ciała — w ciągu albo po kontakcie z biodrami. — CrossFit: [O'Connor (CF-L4): Ask a Coach — Missing the Bar Forward in the Snatch (2025)](https://www.crossfit.com/pro-coach/ask-a-coach-missing-bar-forward-snatch) (Second Pull: Hips banging into the bar (uproszczenie)); Catalyst Athletics: [Everett: Keeping the Bar Close — The 3 Biggest Mistakes You're Making (2017)](https://catalystathletics.com/article/2076/Keeping-the-Bar-Close-The-3-Biggest-Mistakes-Youre-Making) (pkt 2 Bumping the Bar Off the Hips (uproszczenie)) `olympic.mis.away`
- Ciągnięcie rękami, zanim nogi i biodra skończą wyprost. — CrossFit: [O'Connor (CF-L4): Ask a Coach — Missing the Bar Forward in the Snatch (2025)](https://www.crossfit.com/pro-coach/ask-a-coach-missing-bar-forward-snatch) (Second Pull: Early Arm Pull (uproszczenie)); Catalyst Athletics: [Everett: Arm Bend in the Snatch & Clean — It's Still Not the Solution](https://catalystathletics.com/article/1904/Arm-Bend-in-the-Snatch-Clean-Its-Still-Not-the-Solution-to-/) (Why It's a Problem (uproszczenie)) `olympic.mis.arms`
- Ugięte łokcie nad głową — sztanga spycha cię w dół. — CrossFit: [O'Connor (CF-L4): Ask a Coach — Missing the Bar Forward in the Snatch (2025)](https://www.crossfit.com/pro-coach/ask-a-coach-missing-bar-forward-snatch) (Third Pull: Lazy lockout (uproszczenie)); BarBend: [Need to Fix Your Snatch? (R. Stefan, USAW-L1)](https://barbend.com/fix-your-snatch/) (pkt 4 A Loose Catch (uproszczenie)) `olympic.mis.softLockout`

### Snatch Pull

**Ustawienie**

- Szeroki chwyt, plecy proste i napięte, barki nad sztangą. — Catalyst Athletics: [Snatch Pull (#97)](https://www.catalystathletics.com/exercise/97/Snatch-Pull/) (opis (set the snatch starting position tightly; arms relaxed)); Rogue Fitness: [Movement Demo — Snatch Pull (2025)](https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-snatch-pull) (Setup (snatch grip) i Extension (chest and shoulders over the bar); Common cues (flat back)) `olympic.setup`

**Ruch**

- Odepchnij się nogami od podłogi, gdy sztanga dojdzie do bioder, dynamicznie się wyprostuj i zakończ mocnym wzruszeniem barków — bez wchodzenia pod sztangę. — Catalyst Athletics: [Snatch Pull (#97)](https://www.catalystathletics.com/exercise/97/Snatch-Pull/) (opis (push with the legs; extend the entire body; shrug up and back)); Rogue Fitness: [Movement Demo — Snatch Pull (2025)](https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-snatch-pull) (First Pull, Extension (triple extension), Shrug (finish with a powerful shrug)) `olympic.pullMove`

**Wskazówki**

- Sztanga blisko ciała przez cały ciąg. — Catalyst Athletics: [Snatch Pull (#97)](https://www.catalystathletics.com/exercise/97/Snatch-Pull/) (opis (keep the bar as close to the legs as possible; at no point should it move away)); Rogue Fitness: [Movement Demo — Snatch Pull (2025)](https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-snatch-pull) (First Pull (keeping the bar close to the legs)) `oly.close`
- Ręce proste jak najdłużej — sztangę wybijają nogi i biodra. — Catalyst Athletics: [Snatch Pull (#97)](https://www.catalystathletics.com/exercise/97/Snatch-Pull/) (opis (arms relaxed and stretched long; push with the legs)); Rogue Fitness: [Movement Demo — Snatch Pull (2025)](https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-snatch-pull) (Bar Close and Arms Straight; Do NOT pull with the arms) `oly.legs`

**Czego unikać**

- Ciągnięcie rękami, zanim nogi i biodra skończą wyprost. — Catalyst Athletics: [Arm Bend In Snatch & Clean Pulls? (wideo z opisem)](https://catalystathletics.com/video/1539/Arm-Bend-In-Snatch-Clean-Pulls/) (opis wideo (ciągi: rozpocząć pracę rąk dopiero po wyproście nóg i bioder)); Rogue Fitness: [Movement Demo — Snatch Pull (2025)](https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-snatch-pull) (Shrug (Do NOT pull with the arms — this isn't a high pull)) `olympic.mis.arms`
- Sztanga odjeżdża od ciała — w ciągu albo po kontakcie z biodrami. — Catalyst Athletics: [How To Stop Swinging Snatch & Clean Pulls (wideo z opisem)](https://catalystathletics.com/video/1499/How-To-Stop-Swinging-Snatch-Clean-Pulls) (opis wideo (ciągi: sztanga odbija od ciała po kontakcie z biodrami; 5 przyczyn)); CrossFit: [O'Connor (CF-L4): Ask a Coach — Missing the Bar Forward in the Snatch (2025)](https://www.crossfit.com/pro-coach/ask-a-coach-missing-bar-forward-snatch) (First Pull / Second Pull — fazy ciągu rwania (uproszczenie)) `olympic.mis.away`

### Muscle Snatch

**Ustawienie**

- Szeroki chwyt, plecy proste i napięte, barki nad sztangą. — Catalyst Athletics: [Muscle Snatch (#96)](https://www.catalystathletics.com/exercise/96/Muscle-Snatch/) (opis (set your snatch starting position) — uproszczenie: start jak w rwaniu); BarBend: [Muscle Snatch (C. Trieu, 2024)](https://barbend.com/muscle-snatch/) (Setup (snatch starting position; shoulders over or slightly ahead of the bar)) `olympic.setup`

**Ruch**

- Wyprostuj się dynamicznie, potem ciągnij łokcie w górę i na boki, a następnie wypchnij sztangę nad głowę — bez ponownego uginania kolan. — Catalyst Athletics: [Muscle Snatch (#96)](https://www.catalystathletics.com/exercise/96/Muscle-Snatch/) (opis (extend close to vertically; pull elbows up and out; turn the bar over; legs tight pushing into the floor)); BarBend: [Muscle Snatch (C. Trieu, 2024)](https://barbend.com/muscle-snatch/) (Second Pull, Turnover, Lockout (without re-bending your legs)) `olympic.msMove`

**Wskazówki**

- Sztanga blisko ciała przez cały ciąg. — Catalyst Athletics: [Muscle Snatch (#96)](https://www.catalystathletics.com/exercise/96/Muscle-Snatch/) (opis (bar as close to the body as possible)); BarBend: [Muscle Snatch (C. Trieu, 2024)](https://barbend.com/muscle-snatch/) (Bar Close) `oly.close`

**Czego unikać**

- Mocne odchylanie tułowia w tył na górze ruchu. — Catalyst Athletics: [Muscle Snatch (#96)](https://www.catalystathletics.com/exercise/96/Muscle-Snatch/) (opis (extend close to vertically rather than leaning the trunk farther back)); BarBend: [Muscle Snatch (C. Trieu, 2024)](https://barbend.com/muscle-snatch/) (Common Mistakes: Going Too Heavy (lean back too far)) `olympic.mis.leanBack`

### Snatch Balance

**Ustawienie**

- Sztanga na górze pleców, za karkiem; chwyt jak do rwania. — Catalyst Athletics: [Snatch Balance (#80)](https://www.catalystathletics.com/exercise/80/Snatch-Balance/) (opis (barbell behind your neck with a snatch-width grip)); BarBend: [Snatch Balance (M. Dewar, CSCS)](https://barbend.com/snatch-balance/) (Step 1 Set Up (on the back, hands in the snatch grip)) `olympic.sbSetup`

**Ruch**

- Krótko ugnij kolana, wybij sztangę z pleców i wejdź pod nią, przestawiając stopy do przysiadu; złap ją na prostych rękach w dole przysiadu i wstań. — Catalyst Athletics: [Snatch Balance (#80)](https://www.catalystathletics.com/exercise/80/Snatch-Balance/) (opis (bend the knees; drive up; move feet into receiving stance; squat into the bottom of an overhead squat; stand)); BarBend: [Snatch Balance (M. Dewar, CSCS)](https://barbend.com/snatch-balance/) (Step 2 Press and Dip, Step 3 Receive the Bar, Then Stand) `olympic.sbMove`

**Wskazówki**

- Schodząc pod sztangę, mocno pchaj ją rękami w górę. — Catalyst Athletics: [Snatch Balance (#80)](https://www.catalystathletics.com/exercise/80/Snatch-Balance/) (opis (punch the arms aggressively up into the bar)); BarBend: [Snatch Balance (M. Dewar, CSCS)](https://barbend.com/snatch-balance/) (Step 3 (reach the arms into the barbell) i wskazówki (pushing up and into it)) `olympic.sbPush`

**Czego unikać**

- Zbyt wolne zejście pod sztangę. — Torokhtiy: [Snatch Balance (O. Torokhtiy, olimpijczyk, PhD nauk o sporcie, 15.10.2026)](https://store.torokhtiy.com/blogs/exercises/snatch-balance) (Common Mistakes: Lack of Speed in the Drop); Catalyst Athletics: [Snatch Balance (#80)](https://www.catalystathletics.com/exercise/80/Snatch-Balance/) (opis (drop under „as quickly as possible” — błąd = zaprzeczenie standardu)) `olympic.mis.slowDrop`
- Wstawanie, zanim sztanga jest stabilna nad głową. — Torokhtiy: [Snatch Balance (O. Torokhtiy, olimpijczyk, PhD nauk o sporcie, 15.10.2026)](https://store.torokhtiy.com/blogs/exercises/snatch-balance) (Common Mistakes: Rushing the Stand Up); Catalyst Athletics: [Snatch Balance (#80)](https://www.catalystathletics.com/exercise/80/Snatch-Balance/) (opis („Making sure it’s stable and secure, stand again with the bar overhead.” — błąd = zaprzeczenie standardu)) `olympic.mis.standEarly`

### Block Snatch

**Ustawienie**

- Sztanga na blokach, zwykle na wysokości kolan. — Catalyst Athletics: [Block Snatch (#207)](https://catalystathletics.com/exercise/207/Block-Snatch/) (opis (most commonly the bar starting at knee height)); BarBend: [Weightlifting Blocks vs. the Hang (J. Dickson, USAW-L2)](https://barbend.com/weightlifting-blocks-vs-hang/) (knee-height blocks (stronger position than the floor)) `olympic.blockSetup`
- Szeroki chwyt, plecy proste i napięte, barki nad sztangą. — Catalyst Athletics: [Block Snatch (#207)](https://catalystathletics.com/exercise/207/Block-Snatch/) (opis (same position as in a snatch with the bar at that height)); Catalyst Athletics: [Snatch (#58)](https://www.catalystathletics.com/exercise/58/Snatch/) (start — rwanie ogólnie); BarBend: [Power Snatch (R. Stefan, USAW-L1)](https://barbend.com/power-snatch/) (Step 1–2 — wariant power z podłogi (uproszczenie: inny start)) `olympic.setup`

**Ruch**

- Odepchnij się nogami od podłogi, gdy sztanga dojdzie do bioder, dynamicznie się wyprostuj i wciągnij się pod nią — złap ją na prostych rękach w pełnym przysiadzie, potem wstań. — Catalyst Athletics: [Block Snatch (#207)](https://catalystathletics.com/exercise/207/Block-Snatch/) (opis (push with the legs; extend; pull elbows up and out; squat under; fix overhead; stand)); Rogue Fitness: [Movement Demo — Hang Squat Snatch](https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-hang-squat-snatch) (Extension, Pull Under, Receive — wariant ze zwisu (uproszczenie: inny start)) `olympic.snatchMove`

**Wskazówki**

- Sztanga blisko ciała przez cały ciąg. — Catalyst Athletics: [Block Snatch (#207)](https://catalystathletics.com/exercise/207/Block-Snatch/) (opis (bar as close to the body as possible)); Rogue Fitness: [Movement Demo — Hang Squat Snatch](https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-hang-squat-snatch) (Arms (high elbows to keep the bar close) — wariant ze zwisu (uproszczenie)) `oly.close`

**Czego unikać**

- Sztanga odjeżdża od ciała — w ciągu albo po kontakcie z biodrami. — CrossFit: [O'Connor (CF-L4): Ask a Coach — Missing the Bar Forward in the Snatch (2025)](https://www.crossfit.com/pro-coach/ask-a-coach-missing-bar-forward-snatch) (Second Pull (uproszczenie)); Catalyst Athletics: [Everett: Keeping the Bar Close — The 3 Biggest Mistakes You're Making (2017)](https://catalystathletics.com/article/2076/Keeping-the-Bar-Close-The-3-Biggest-Mistakes-Youre-Making) (pkt 2 (uproszczenie)) `olympic.mis.away`
- Ciągnięcie rękami, zanim nogi i biodra skończą wyprost. — CrossFit: [O'Connor (CF-L4): Ask a Coach — Missing the Bar Forward in the Snatch (2025)](https://www.crossfit.com/pro-coach/ask-a-coach-missing-bar-forward-snatch) (Second Pull: Early Arm Pull (uproszczenie)); Catalyst Athletics: [Everett: Arm Bend in the Snatch & Clean — It's Still Not the Solution](https://catalystathletics.com/article/1904/Arm-Bend-in-the-Snatch-Clean-Its-Still-Not-the-Solution-to-/) (Why It's a Problem (uproszczenie)) `olympic.mis.arms`

### Split Snatch

**Ustawienie**

- Szeroki chwyt, plecy proste i napięte, barki nad sztangą. — Catalyst Athletics: [Snatch (#58)](https://www.catalystathletics.com/exercise/58/Snatch/) (start — rwanie ogólnie (uproszczenie: ten sam start)); BarBend: [Power Snatch (R. Stefan, USAW-L1)](https://barbend.com/power-snatch/) (Step 1–2 — wariant power (uproszczenie)); IronMind: [Jim Schmitz: Split Lifting Technique (ok. 07.2012 — data z wpisu IronMind News 06.07.2012, który go zapowiada)](https://ironmind.com/articles/jim-schmitz-on-the-lifts/Split-Lifting-Technique/) (ciąg „just as you would for a power or squat lift” (uproszczenie: start jak w rwaniu)) `olympic.setup`

**Ruch**

- Ciągnij jak w rwaniu, potem szybko wejdź pod sztangę w nożyce: jedna stopa do przodu, druga do tyłu — i wstań ze sztangą nad głową. — IronMind: [Jim Schmitz: Split Lifting Technique (ok. 07.2012 — data z wpisu IronMind News 06.07.2012, który go zapowiada)](https://ironmind.com/articles/jim-schmitz-on-the-lifts/Split-Lifting-Technique/) (opis rwania i zarzutu w nożycach (ciąg jak w rwaniu; jedna noga ok. 1 stopy do przodu, druga ok. 2 stóp do tyłu; szybkie nogi i ręce; powrót do stania)); Catalyst Athletics: [Everett: Ask Greg, Issue 130 (Performance Menu, XI 2015) — split snatch](https://performancemenu.com/article/815/Greg-Everett) (odpowiedź o split snatch („a single-leg squat with the other foot behind you”)) `olympic.snatchSplitMove`

**Wskazówki**

- Sztanga blisko ciała przez cały ciąg. — Catalyst Athletics: [Snatch (#58)](https://www.catalystathletics.com/exercise/58/Snatch/) (rwanie ogólnie (uproszczenie)); BarBend: [Power Snatch (R. Stefan, USAW-L1)](https://barbend.com/power-snatch/) (Muscles Worked › Upper & Lower Back — wariant power (uproszczenie)) `oly.close`

**Czego unikać**

- Ciągnięcie rękami, zanim nogi i biodra skończą wyprost. — CrossFit: [O'Connor (CF-L4): Ask a Coach — Missing the Bar Forward in the Snatch (2025)](https://www.crossfit.com/pro-coach/ask-a-coach-missing-bar-forward-snatch) (Second Pull: Early Arm Pull — rwanie ogólnie (uproszczenie)); Catalyst Athletics: [Everett: Arm Bend in the Snatch & Clean — It's Still Not the Solution](https://catalystathletics.com/article/1904/Arm-Bend-in-the-Snatch-Clean-Its-Still-Not-the-Solution-to-/) (Why It's a Problem — rwanie ogólnie (uproszczenie)) `olympic.mis.arms`

### Jump Squat

**Ustawienie**

- Stań prosto, stopy mniej więcej na szerokość bioder. — ACE: [Squat Jumps (#116)](https://www.acefitness.org/resources/everyone/exercise-library/116/squat-jumps/) (Step 1 (feet hip-width apart)); NASM: [Squat Jump](https://www.nasm.org/resource-center/exercise-library/squat-jump) (Step 1: Setup (feet hip-width apart)) `lunge.stand`

**Ruch**

- Ugnij kolana i cofnij biodra do przysiadu. — ACE: [Squat Jumps (#116)](https://www.acefitness.org/resources/everyone/exercise-library/116/squat-jumps/) (Step 2 (push hips back and bend at the knees)); NASM: [Squat Jump](https://www.nasm.org/resource-center/exercise-library/squat-jump) (Step 2: Brace/Position (quarter-squat or half-squat)); Catalyst Athletics: [Squat Vertical Jump (#555)](https://catalystathletics.com/exercise/555/Squat-Vertical-Jump/) (Instructions (squat … into the bottom)) `plyo.dip`
- Wybij się dynamicznie, prostując jednocześnie biodra, kolana i kostki. — ACE: [Squat Jumps (#116)](https://www.acefitness.org/resources/everyone/exercise-library/116/squat-jumps/) (Step 3 (extending ankles, knees and hips)); NASM: [Squat Jump](https://www.nasm.org/resource-center/exercise-library/squat-jump) (Step 3: Execute/Drive); Catalyst Athletics: [Squat Vertical Jump (#555)](https://catalystathletics.com/exercise/555/Squat-Vertical-Jump/) (Instructions (drive into a maximal vertical jump)) `plyo.extend`

**Wskazówki**

- Ląduj miękko, na ugiętych kolanach. — ACE: [Squat Jumps (#116)](https://www.acefitness.org/resources/everyone/exercise-library/116/squat-jumps/) (Step 5 (land softly; don't lock out the knees)); NASM: [Squat Jump](https://www.nasm.org/resource-center/exercise-library/squat-jump) (Step 4: Return/Descent (land softly … bent knees)); Catalyst Athletics: [Squat Vertical Jump (#555)](https://catalystathletics.com/exercise/555/Squat-Vertical-Jump/) (Instructions (absorb the landing … bending the knees and hips)) `jump.land`

**Czego unikać**

- Lądowanie na sztywnych nogach. — NASM: [Squat Jump](https://www.nasm.org/resource-center/exercise-library/squat-jump) (Common Mistakes, pkt 1 (landing with straight or minimally bent knees)); ACE: [Squat Jumps (#116)](https://www.acefitness.org/resources/everyone/exercise-library/116/squat-jumps/) (Step 5 (don't lock out your knees)) `jump.mis.stiff`

### Tuck Jump

**Ustawienie**

- Stań prosto, stopy mniej więcej na szerokość bioder. — ACE: [Tuck Jump (#180)](https://www.acefitness.org/resources/everyone/exercise-library/180/tuck-jump/) (Step 1 (feet about hip-width apart)); NASM: [Tuck Jump](https://www.nasm.org/resource-center/exercise-library/tuck-jump) (Step 1: Setup (feet hip-width apart)) `lunge.stand`

**Ruch**

- Wybij się, prostując biodra, kolana i kostki, z zamachem rąk. — ACE: [Tuck Jump (#180)](https://www.acefitness.org/resources/everyone/exercise-library/180/tuck-jump/) (Step 3; wskazówka końcowa (arms forward and up)); NASM: [Tuck Jump](https://www.nasm.org/resource-center/exercise-library/tuck-jump) (Step 3: Execute/Drive (extend hips, knees, ankles while swinging arms upward)); Catalyst Athletics: [Tuck Jump (#558)](https://catalystathletics.com/exercise/558/Tuck-Jump/) (opis (swing the arms forward and up, push against the ground)) `jump.drive`
- W powietrzu przyciągnij kolana do klatki. — ACE: [Tuck Jump (#180)](https://www.acefitness.org/resources/everyone/exercise-library/180/tuck-jump/) (Step 3 (pull your knees toward your chest)); NASM: [Tuck Jump](https://www.nasm.org/resource-center/exercise-library/tuck-jump) (Step 3: Execute/Drive (drive your knees toward your chest)); Catalyst Athletics: [Tuck Jump (#558)](https://catalystathletics.com/exercise/558/Tuck-Jump/) (opis (pull the knees up as high as possible)) `plyo.tuck`

**Wskazówki**

- Ląduj miękko, na ugiętych kolanach. — ACE: [Tuck Jump (#180)](https://www.acefitness.org/resources/everyone/exercise-library/180/tuck-jump/) (Step 4 (land softly; don't lock knees)); NASM: [Tuck Jump](https://www.nasm.org/resource-center/exercise-library/tuck-jump) (Step 4: Return/Descent (land softly … bent knees)) `jump.land`

**Czego unikać**

- Lądowanie na sztywnych nogach. — NASM: [Tuck Jump](https://www.nasm.org/resource-center/exercise-library/tuck-jump) (Common Mistakes, pkt 1); ACE: [Tuck Jump (#180)](https://www.acefitness.org/resources/everyone/exercise-library/180/tuck-jump/) (Step 4 (don't lock your knees or quads)) `jump.mis.stiff`

### Weighted Jump Squat

**Ustawienie**

- Sztanga na górze pleców, jak do przysiadu. — Catalyst Athletics: [Back Squat Jump (#353)](https://catalystathletics.com/exercise/353/Back-Squat-Jump/) (Instructions, pkt 1 (bar in back squat position, held tightly against the body)); Suchomel i in. (J Hum Kinet 2019): [The Effect of Load Placement on the Power Production Characteristics of Three Lower Extremity Jumping Exercises (J Hum Kinet 2019)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6724584/) (Methods, Procedures (external load on the upper back, similar to a back squat)); Torokhtiy: [Barbell Squat Jump (O. Torokhtiy, akt. 16.09.2024)](https://torokhtiy.com/blogs/guides/barbell-squat-jump) (technika (bar on the shoulders behind the neck, like a back squat)) `plyo.wjsBarBack`

**Ruch**

- Zejdź do przysiadu i wybij się w górę jak najmocniej. — Catalyst Athletics: [Back Squat Jump (#353)](https://catalystathletics.com/exercise/353/Back-Squat-Jump/) (Instructions, pkt 2 (drive up … maximal vertical jump)); Suchomel i in. (J Hum Kinet 2019): [The Effect of Load Placement on the Power Production Characteristics of Three Lower Extremity Jumping Exercises (J Hum Kinet 2019)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6724584/) (Methods, Procedures (rapid countermovement, then jump as high as possible)); Torokhtiy: [Barbell Squat Jump (O. Torokhtiy, akt. 16.09.2024)](https://torokhtiy.com/blogs/guides/barbell-squat-jump) (technika (jump as high as possible)) `plyo.wjsMove`

**Wskazówki**

- Ląduj miękko, na ugiętych kolanach. — Catalyst Athletics: [Back Squat Jump (#353)](https://catalystathletics.com/exercise/353/Back-Squat-Jump/) (Instructions, pkt 4 (absorb the landing)); ACE: [Squat Jumps (#116)](https://www.acefitness.org/resources/everyone/exercise-library/116/squat-jumps/) (Step 5 (wariant: bez obciążenia)); NASM: [Squat Jump](https://www.nasm.org/resource-center/exercise-library/squat-jump) (Step 4: Return/Descent (wariant: bez obciążenia)); Torokhtiy: [Barbell Squat Jump (O. Torokhtiy, akt. 16.09.2024)](https://torokhtiy.com/blogs/guides/barbell-squat-jump) (technika (land on soft knees)) `jump.land`

**Czego unikać**

- Lądowanie na sztywnych nogach. — NASM: [Squat Jump](https://www.nasm.org/resource-center/exercise-library/squat-jump) (Common Mistakes, pkt 1 (wariant: bez obciążenia)); ACE: [Squat Jumps (#116)](https://www.acefitness.org/resources/everyone/exercise-library/116/squat-jumps/) (Step 5 (wariant: bez obciążenia)); Torokhtiy: [Barbell Squat Jump (O. Torokhtiy, akt. 16.09.2024)](https://torokhtiy.com/blogs/guides/barbell-squat-jump) (technika (land on soft knees) — błąd = zaprzeczenie standardu) `jump.mis.stiff`

### Broad Jump

**Ustawienie**

- Ugnij kolana, cofnij biodra i zrób zamach rękami w tył. — ACE: [Forward Linear Jumps (#177)](https://www.acefitness.org/resources/everyone/exercise-library/177/forward-linear-jumps/) (Step 2: Downward Phase (push hips back; arms behind you)); Catalyst Athletics: [Broad Jump (#549)](https://www.catalystathletics.com/exercise/549/Broad-Jump/) (Instructions, pkt 1 (bend knees and hips, swing arms back)) `plyo.broadLoad`

**Ruch**

- Zamach rąk w przód i mocne wybicie nogami — w przód i w górę, jak najdalej. — ACE: [Forward Linear Jumps (#177)](https://www.acefitness.org/resources/everyone/exercise-library/177/forward-linear-jumps/) (Step 3: Jumping Movement (drive forward and up; arms overhead)); Catalyst Athletics: [Broad Jump (#549)](https://www.catalystathletics.com/exercise/549/Broad-Jump/) (opis i pkt 2 (swing arms forward, push hard; as far forward as possible)) `plyo.broadDrive`

**Wskazówki**

- W locie wysuń stopy przed siebie i wyląduj na obu, uginając kolana i biodra. — ACE: [Forward Linear Jumps (#177)](https://www.acefitness.org/resources/everyone/exercise-library/177/forward-linear-jumps/) (Step 4–6 (legs forward; bend knees and hips to absorb)); Catalyst Athletics: [Broad Jump (#549)](https://www.catalystathletics.com/exercise/549/Broad-Jump/) (Instructions, pkt 3 (reach feet forward, absorb by bending knees and hips)) `plyo.broadLand`

**Czego unikać**

- Lądowanie na sztywnych nogach. — ACE: [Forward Linear Jumps (#177)](https://www.acefitness.org/resources/everyone/exercise-library/177/forward-linear-jumps/) (Step 6 (lądowanie na prostych kolanach)); Catalyst Athletics: [Broad Jump (#549)](https://www.catalystathletics.com/exercise/549/Broad-Jump/) (Instructions, pkt 3 (absorb the landing by bending the knees and hips) — błąd = zaprzeczenie standardu) `jump.mis.stiff`

### Alternate Leg Push-Off

**Ustawienie**

- Stań przodem do skrzyni: jedna stopa na skrzyni, druga na podłodze. — ACE: [Alternate Leg Push-off (#246)](https://www.acefitness.org/resources/everyone/exercise-library/246/alternate-leg-push-off/) (Step 1); inSPORTline: [Plyometric Box Set — instrukcja (QT1005), s. 3 „Plyo Boxes Exercises”](https://www.insportline.eu/upload/file/7267_manual_QT1005_or.pdf) (s. 3, ALTERNATING PUSH-OFF (pierwsza pozycja), Start) `plyo.pushoff.setup`

**Ruch**

- Odepchnij się nogą ze skrzyni w górę, w powietrzu zmień nogi i wyląduj drugą stopą na skrzyni. — ACE: [Alternate Leg Push-off (#246)](https://www.acefitness.org/resources/everyone/exercise-library/246/alternate-leg-push-off/) (Step 2–3); inSPORTline: [Plyometric Box Set — instrukcja (QT1005), s. 3 „Plyo Boxes Exercises”](https://www.insportline.eu/upload/file/7267_manual_QT1005_or.pdf) (s. 3, ALTERNATING PUSH-OFF (pierwsza pozycja), Action) `plyo.altPushoff.move`

### Wall Ball

**Ustawienie**

- Stań przodem do ściany, piłkę trzymaj oburącz przy klatce. — REP Fitness: [How to Improve Your Wall Balls](https://uk.repfitness.com/blogs/training/wall-balls) (opis ruchu („holding the ball at your chest”)); CrossFit: [The Wall-Ball Shot: CrossFit's Secret Weapon for Cardiovascular Conditioning](https://www.crossfit.com/essentials/crossfit-wall-ball-secret-weapon) (THE WALL-BALL SHOT („Keep the ball low to the chest.”)) `wb.setup`

**Ruch**

- Zejdź do przysiadu, a wstając, jednym ruchem wyrzuć piłkę w górę, w cel na ścianie. — REP Fitness: [How to Improve Your Wall Balls](https://uk.repfitness.com/blogs/training/wall-balls) (wypowiedź trenerki („squat and as soon as you open your hips, throw the ball”)); CrossFit: [The Wall-Ball Shot: CrossFit's Secret Weapon for Cardiovascular Conditioning](https://www.crossfit.com/essentials/crossfit-wall-ball-secret-weapon) (THE WALL-BALL SHOT (przysiad na początku każdego powtórzenia, wyrzut w cel; parafraza)) `wb.move`

**Czego unikać**

- Za płytki przysiad. — CrossFit: [The Wall-Ball Shot: CrossFit's Secret Weapon for Cardiovascular Conditioning](https://www.crossfit.com/essentials/crossfit-wall-ball-secret-weapon) (THE WALL-BALL SHOT („…it is very common to see poor squat depth in this exercise.”)); REP Fitness: [How to Improve Your Wall Balls](https://uk.repfitness.com/blogs/training/wall-balls) (częste błędy (za płytki przysiad; „Quarter squats won't provide the full benefit”)) `wb.mis.shallow`

### Medicine Ball Chest Pass

**Ustawienie**

- Stań przodem do celu, piłka oburącz przy klatce. — ACE: [Medicine Ball Lunge to Chest Pass (#264)](https://www.acefitness.org/resources/everyone/exercise-library/264/medicine-ball-lunge-to-chest-pass/) (krok 1, Starting position (przodem do partnera, piłka na wysokości klatki; parafraza; wariant: z wykrokiem)); RFL: [Med Ball Chest Throw (karta PDF z oceną 1–5)](https://www.rugby-league.com/uploads/docs/Med%20Ball%20Chest%20Throw.pdf) (Directions, punkty 1–2 („Stand with feet shoulder-width apart and hands behind the ball.”, piłka przyciągnięta do klatki; wariant: rzut na odległość z lekkiego przysiadu)) `mbcp.setup`

**Ruch**

- Mocno wypchnij piłkę od klatki prosto przed siebie. — ACE: [Medicine Ball Lunge to Chest Pass (#264)](https://www.acefitness.org/resources/everyone/exercise-library/264/medicine-ball-lunge-to-chest-pass/) (krok 2 (wypchnięcie piłki od klatki do partnera; parafraza; wariant: z wykrokiem)); RFL: [Med Ball Chest Throw (karta PDF z oceną 1–5)](https://www.rugby-league.com/uploads/docs/Med%20Ball%20Chest%20Throw.pdf) (Directions, punkt 3 („…extend your elbows to push ball away from body.”; wariant: rzut na odległość)) `mbcp.move`

### Backward Medicine Ball Throw

**Ustawienie**

- Stań tyłem do kierunku rzutu, piłka oburącz na prostych rękach przed sobą. — Manske, Reiman (Wichita State University, Duke University): [Functional Performance Testing for Power and Return to Sports, Sports Health 2013 (Trunk Power Tests)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3658404/) (Trunk Power Tests → Backward Overhead Medicine Ball Throw, ryc. 2 („The athlete holds a medicine ball with arms straight in front of the body”)); World Athletics: [Backward overhead throw (Kids' Athletics, poziom 3)](https://worldathletics.org/kids-athletics/teaching-athletics/backward-overhead-throw) (opis pod tytułem (tyłem do linii, piłka oburącz na długość ramion; parafraza)) `bmbt.setup`

**Ruch**

- Ugnij biodra i kolana, opuszczając piłkę, potem dynamicznie się wyprostuj i przerzuć ją nad głową za siebie. — Manske, Reiman (Wichita State University, Duke University): [Functional Performance Testing for Power and Return to Sports, Sports Health 2013 (Trunk Power Tests)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3658404/) (jw. (ruch zamachowy w dół w biodrach i kolanach, potem „extending forcefully backward to throw the ball over the head”)); World Athletics: [Backward overhead throw (Kids' Athletics, poziom 3)](https://worldathletics.org/kids-athletics/teaching-athletics/backward-overhead-throw) (opis pod tytułem (przysiad, szybki wyprost nóg, rzut nad głową w tył; parafraza)) `bmbt.move`

### Standing Two-Arm Overhead Throw

**Ustawienie**

- Stań przodem do celu, piłka oburącz. — ACE: [Overhead Medicine Ball Throws (#178)](https://www.acefitness.org/resources/everyone/exercise-library/178/overhead-medicine-ball-throws/) (Preparation i krok 1 (przodem do partnera, piłka oburącz; parafraza)); World Athletics: [Overarm throw (Kids' Athletics)](https://worldathletics.org/kids-athletics/teaching-athletics/overarm-throw) (Description („…hold the medicine ball with both hands behind the head”; przodem do kierunku rzutu)) `soht.setup`

**Ruch**

- Unieś piłkę nad głowę i trochę za nią, potem mocno rzuć ją przed siebie. — ACE: [Overhead Medicine Ball Throws (#178)](https://www.acefitness.org/resources/everyone/exercise-library/178/overhead-medicine-ball-throws/) (krok 2–3 (piłka nad głowę i za głowę, potem ręce mocno w przód nad głową; parafraza)); World Athletics: [Overarm throw (Kids' Athletics)](https://worldathletics.org/kids-athletics/teaching-athletics/overarm-throw) (Description („They throw the medicine ball over the head as far as possible…”)) `soht.move`

**Wskazówki**

- Napnij brzuch, żeby tułów był sztywny. — ACE: [Overhead Medicine Ball Throws (#178)](https://www.acefitness.org/resources/everyone/exercise-library/178/overhead-medicine-ball-throws/) (krok 1–2 („contract and brace the abdominals…”; brzuch napięty także przy zamachu)); World Athletics: [Overarm throw (Kids' Athletics)](https://worldathletics.org/kids-athletics/teaching-athletics/overarm-throw) (Coaching points („…keep their trunk muscles tense the whole time…”)) `plank.brace`

### Sled Push

**Ustawienie**

- Stań za sankami i chwyć pionowe uchwyty. — REP Fitness: [Sled Push Technique Guide (2026)](https://repfitness.com/blogs/training/sled-push-technique) (Choose Your Hand Position (wysokie uchwyty na prostych rękach albo niższe; parafraza)); BarBend: [How to Do the Sled Push (M. Dewar, CSCS, akt. 28.06.2024)](https://barbend.com/sled-push/) (How to Do the Sled Push, krok 2 („Place the hands about halfway down the sled handles.”)); Torque Fitness: [Ultimate TANK Training Guide (2024, PDF; kopia u dystrybutora)](https://cdn.fitshop.co.uk/files/torque/functional_training_and_strongman/TOR-TANKMX/Ultimate_TANK_Training_Guide_2024.pdf) (s. 40, Push, Instructions 1 („Grasp handles with both hands…”)); EliteFTS: [Shove It! Top Pushing Moves (D. Balzarini, 05.07.2011)](https://elitefts.com/blogs/training/shove-it-top-pushing-moves) (Prowler („…grab the handles, get in a proper forward lean position, and get pushing.”)) `sled.pushGrip`

**Ruch**

- Pracuj nogami — odpychaj się od podłoża przy każdym kroku. — REP Fitness: [Sled Push Technique Guide (2026)](https://repfitness.com/blogs/training/sled-push-technique) (Take Short, Quick Steps („Don't push with your arms since they are not nearly as strong as your legs.”)); BarBend: [How to Do the Sled Push (M. Dewar, CSCS, akt. 28.06.2024)](https://barbend.com/sled-push/) (krok 3 („…begin aggressively driving forward with your legs.”; odpychanie przodem stopy)) `sled.legs`

**Wskazówki**

- Pochyl się w przód. — REP Fitness: [Sled Push Technique Guide (2026)](https://repfitness.com/blogs/training/sled-push-technique) (Get Low and Lean In (pochylenie ok. 45°; parafraza)); BarBend: [How to Do the Sled Push (M. Dewar, CSCS, akt. 28.06.2024)](https://barbend.com/sled-push/) (krok 2 (pochylenie w przód, plecy płasko, blisko równolegle do podłoża; parafraza)); EliteFTS: [Shove It! Top Pushing Moves (D. Balzarini, 05.07.2011)](https://elitefts.com/blogs/training/shove-it-top-pushing-moves) (Prowler („get in a proper forward lean position”)) `sled.lean`
- Plecy proste (neutralne) przez cały ruch — bez zaokrąglania. — REP Fitness: [Sled Push Technique Guide (2026)](https://repfitness.com/blogs/training/sled-push-technique) (Get Low and Lean In (plecy płaskie) oraz Avoid These Common Mistakes (bez zaokrąglania lędźwi; parafraza)); BarBend: [How to Do the Sled Push (M. Dewar, CSCS, akt. 28.06.2024)](https://barbend.com/sled-push/) (krok 2 („…lean forward so your back is flat…” — parafraza w odpowiedzi strony)) `hinge.back`

### Thruster (hantle)

**Ustawienie**

- Hantle przy barkach, stopy na szerokość bioder do barków. — ACE: [Squat to Overhead Press (#357)](https://www.acefitness.org/resources/everyone/exercise-library/357/squat-to-overhead-press/) (opis (dumbbells in front of each shoulder)); Experience Life: [How to Do the Thruster (Experience Life, M. Fazeli Fard, RKC, 19.06.2024)](https://experiencelife.lifetime.life/article/how-to-do-the-thruster/) (Instructions 1 (weight at shoulder height, feet about hip width)); CrossFit: [The Thruster (Essentials, 12.04.2019)](https://www.crossfit.com/essentials/the-thruster) (How to Perform — Set-up (roughly shoulder-width stance; wariant: sztanga, hantle w sekcji wariantów)) `thruster.dbSetup`

**Ruch**

- Zejdź do przysiadu z ciężarem przy barkach, a wstając, jednym ruchem wypchnij go nad głowę; potem opuść z powrotem do barków. — ACE: [Squat to Overhead Press (#357)](https://www.acefitness.org/resources/everyone/exercise-library/357/squat-to-overhead-press/) (opis (lower into a squat; stand up and at the same time press overhead; return to the shoulders)); Experience Life: [How to Do the Thruster (Experience Life, M. Fazeli Fard, RKC, 19.06.2024)](https://experiencelife.lifetime.life/article/how-to-do-the-thruster/) (Instructions 2–4 (press overhead as you rise; lower to shoulder height)) `thruster.move`
- Schodź, cofając biodra i uginając kolana jednocześnie; wstań, wypychając podłogę całymi stopami. — ACE: [Squat to Overhead Press (#357)](https://www.acefitness.org/resources/everyone/exercise-library/357/squat-to-overhead-press/) (opis (push back into the hips; push both legs into the ground to stand up)); CrossFit: [The Thruster (Essentials, 12.04.2019)](https://www.crossfit.com/essentials/the-thruster) (Front Squat (pushing hips back and down; heels remain down; wariant: sztanga)) `sq.down`

**Wskazówki**

- Zejdź co najmniej do równoległego ud. — ACE: [Squat to Overhead Press (#357)](https://www.acefitness.org/resources/everyone/exercise-library/357/squat-to-overhead-press/) (opis (hips below the knees)); Experience Life: [How to Do the Thruster (Experience Life, M. Fazeli Fard, RKC, 19.06.2024)](https://experiencelife.lifetime.life/article/how-to-do-the-thruster/) (Form Cues — bottom of squat (parallel or below)); CrossFit: [The Thruster (Essentials, 12.04.2019)](https://www.crossfit.com/essentials/the-thruster) (Front Squat (lower than the knees; wariant: sztanga)) `thruster.depth`
- Plecy proste, klatka uniesiona. — ACE: [Squat to Overhead Press (#357)](https://www.acefitness.org/resources/everyone/exercise-library/357/squat-to-overhead-press/) (opis (keep the back straight)); Experience Life: [How to Do the Thruster (Experience Life, M. Fazeli Fard, RKC, 19.06.2024)](https://experiencelife.lifetime.life/article/how-to-do-the-thruster/) (Instructions 2; Form Cues (chest up, spine neutral)) `sq.back`
- Na górze biodra, kolana i ręce są wyprostowane. — Experience Life: [How to Do the Thruster (Experience Life, M. Fazeli Fard, RKC, 19.06.2024)](https://experiencelife.lifetime.life/article/how-to-do-the-thruster/) (Instructions 3 (fully extend through your arms, hips, and knees)); CrossFit: [The Thruster (Essentials, 12.04.2019)](https://www.crossfit.com/essentials/the-thruster) (Finish Position (hips, knees, and arms fully extended; wariant: sztanga)) `thruster.fullExt`

**Czego unikać**

- Odrywanie pięt od podłogi. — CrossFit: [The Thruster (Essentials, 12.04.2019)](https://www.crossfit.com/essentials/the-thruster) (Common Mistakes — Front Squat and Shoulder Press Mechanics (heels lifting)); Experience Life: [How to Do the Thruster (Experience Life, M. Fazeli Fard, RKC, 19.06.2024)](https://experiencelife.lifetime.life/article/how-to-do-the-thruster/) (Form Cues — feet (keep your heels down)) `sq.mis.heels`

### Kettlebell Thruster

**Ustawienie**

- Kettlebelle oparte przy barkach, stopy na szerokość bioder do barków. — Experience Life: [How to Do the Thruster (Experience Life, M. Fazeli Fard, RKC, 19.06.2024)](https://experiencelife.lifetime.life/article/how-to-do-the-thruster/) (Equipment-Specific Versions — Kettlebell (front rack, shoulder height); Instructions 1 (feet about hip width)); CrossFit: [The Thruster (Essentials, 12.04.2019)](https://www.crossfit.com/essentials/the-thruster) (Dumbbell or Kettlebell Thruster (two kettlebells); Set-up (roughly shoulder-width stance)) `thruster.kbSetup`

**Ruch**

- Zejdź do przysiadu z ciężarem przy barkach, a wstając, jednym ruchem wypchnij go nad głowę; potem opuść z powrotem do barków. — Experience Life: [How to Do the Thruster (Experience Life, M. Fazeli Fard, RKC, 19.06.2024)](https://experiencelife.lifetime.life/article/how-to-do-the-thruster/) (Kettlebell (press the kettlebells straight overhead as you rise); Instructions 4); CrossFit: [The Thruster (Essentials, 12.04.2019)](https://www.crossfit.com/essentials/the-thruster) (How to Perform; Dumbbell or Kettlebell Thruster) `thruster.move`

**Wskazówki**

- Zejdź co najmniej do równoległego ud. — Experience Life: [How to Do the Thruster (Experience Life, M. Fazeli Fard, RKC, 19.06.2024)](https://experiencelife.lifetime.life/article/how-to-do-the-thruster/) (Form Cues — bottom of squat); CrossFit: [The Thruster (Essentials, 12.04.2019)](https://www.crossfit.com/essentials/the-thruster) (Front Squat (lower than the knees)) `thruster.depth`
- Na górze biodra, kolana i ręce są wyprostowane. — Experience Life: [How to Do the Thruster (Experience Life, M. Fazeli Fard, RKC, 19.06.2024)](https://experiencelife.lifetime.life/article/how-to-do-the-thruster/) (Instructions 3); CrossFit: [The Thruster (Essentials, 12.04.2019)](https://www.crossfit.com/essentials/the-thruster) (Finish Position) `thruster.fullExt`
- Tułów wysoko i stabilnie; ciężar idzie prosto w górę nad głowę. — Experience Life: [How to Do the Thruster (Experience Life, M. Fazeli Fard, RKC, 19.06.2024)](https://experiencelife.lifetime.life/article/how-to-do-the-thruster/) (Kettlebell (straight overhead); Form Cues — core (upright chest)); CrossFit: [The Thruster (Essentials, 12.04.2019)](https://www.crossfit.com/essentials/the-thruster) (Overhead Press (press in a straight line to the finish position)) `ohp.tall`

**Czego unikać**

- Odrywanie pięt od podłogi. — CrossFit: [The Thruster (Essentials, 12.04.2019)](https://www.crossfit.com/essentials/the-thruster) (Common Mistakes — Front Squat and Shoulder Press Mechanics); Experience Life: [How to Do the Thruster (Experience Life, M. Fazeli Fard, RKC, 19.06.2024)](https://experiencelife.lifetime.life/article/how-to-do-the-thruster/) (Form Cues — feet) `sq.mis.heels`

### Foam Roll: Quadriceps

**Ustawienie**

- Leżąc przodem, oprzyj się na przedramionach; wałek pod udami. — Connecticut Children's Sports Medicine: [Lower Extremity Foam Rolling Home Exercise Program (PDF, 2 s.)](https://www.connecticutchildrens.org/sites/default/files/2024-01/lower_extremity_foam_rolling_home_exercise_program.pdf) (s. 2, „Quad” („lying on your stomach with a foam roller under your upper thigh… elbows”)); Ohio State University Wexner Medical Center: [Foam Rolling Exercises (transkrypcja filmu)](https://wexnermedical.osu.edu/-/media/transcripts/wexnermedical/blog/2y2leqbvrgw_foamrollingexercises.txt) („Quadriceps” („Lie with the roll under the top of one thigh… Prop yourself on your elbows”)); OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 2, „1. Quadriceps” („Begin by lying face down”)) `foam_roll.quad.setup`

**Ruch**

- Roluj od miejsca nad kolanem do biodra. — OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 2, „1. Quadriceps” (start „just above the knees”, „Roll the FR upward to just below the hip crease”)); Ohio State University Wexner Medical Center: [Foam Rolling Exercises (transkrypcja filmu)](https://wexnermedical.osu.edu/-/media/transcripts/wexnermedical/blog/2y2leqbvrgw_foamrollingexercises.txt) („Quadriceps” („keeping the roll off your knee”)); Connecticut Children's Sports Medicine: [Lower Extremity Foam Rolling Home Exercise Program (PDF, 2 s.)](https://www.connecticutchildrens.org/sites/default/files/2024-01/lower_extremity_foam_rolling_home_exercise_program.pdf) (s. 1, wstęp („completed over the entirety of the muscle(s)”)) `foam_roll.quad.path`
- Roluj powoli, krótkimi ruchami. — Connecticut Children's Sports Medicine: [Lower Extremity Foam Rolling Home Exercise Program (PDF, 2 s.)](https://www.connecticutchildrens.org/sites/default/files/2024-01/lower_extremity_foam_rolling_home_exercise_program.pdf) (s. 2, „Quad” („Now very slowly roll your leg back and forth”)); OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 1, General Instructions („Slowly move the roller along the muscle”)); ACE: [Foam Rolling 101 (blog)](https://www.acefitness.org/resources/everyone/blog/5624/foam-rolling-101/) (How to Foam Roll („Slowly roll the tender areas…”; lista obejmuje „quads”)) `smr.slow`

**Wskazówki**

- Trzymaj wałek nad kolanem, nie wjeżdżaj na staw. — Ohio State University Wexner Medical Center: [Foam Rolling Exercises (transkrypcja filmu)](https://wexnermedical.osu.edu/-/media/transcripts/wexnermedical/blog/2y2leqbvrgw_foamrollingexercises.txt) („Quadriceps” („keeping the roll off your knee”)); OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 1, Safety („Avoid rolling directly over the joints (i.e knee, elbow, spine)”)); ACE: [Foam Rolling 101 (blog)](https://www.acefitness.org/resources/everyone/blog/5624/foam-rolling-101/) (How to Foam Roll („avoiding bones and joints”)) `foam_roll.offKnee`
- Chcesz mocniej — roluj jedną nogę, a drugą połóż na niej. — Ohio State University Wexner Medical Center: [Foam Rolling Exercises (transkrypcja filmu)](https://wexnermedical.osu.edu/-/media/transcripts/wexnermedical/blog/2y2leqbvrgw_foamrollingexercises.txt) („Quadriceps” („cross your other leg over it”)); OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 2, „1. Quadriceps” („shift the FR laterally and roll on one leg only”)) `foam_roll.oneLeg`
- Gdy trafisz na wrażliwe miejsce, zwolnij i zatrzymaj się na chwilę. — OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 1, General Instructions („pausing on tender areas”)); Connecticut Children's Sports Medicine: [Lower Extremity Foam Rolling Home Exercise Program (PDF, 2 s.)](https://www.connecticutchildrens.org/sites/default/files/2024-01/lower_extremity_foam_rolling_home_exercise_program.pdf) (s. 1, wstęp („focus on these areas”)) `smr.tender`

### Foam Roll: Hamstrings

**Ustawienie**

- Usiądź z wałkiem pod tylną stroną ud i podeprzyj się rękami. — OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 2, „2. Hamstrings” („Begin in long-sitting, with the FR placed just above the back of the knees”)); Ohio State University Wexner Medical Center: [Foam Rolling Exercises (transkrypcja filmu)](https://wexnermedical.osu.edu/-/media/transcripts/wexnermedical/blog/2y2leqbvrgw_foamrollingexercises.txt) („Hamstrings” („Sit with the roll under both thighs. Use your arms…”)) `foam_roll.ham.setup`

**Ruch**

- Roluj od miejsca nad kolanem do pośladków. — OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 2, „2. Hamstrings” („Roll the FR upward to the buttocks”)); Connecticut Children's Sports Medicine: [Lower Extremity Foam Rolling Home Exercise Program (PDF, 2 s.)](https://www.connecticutchildrens.org/sites/default/files/2024-01/lower_extremity_foam_rolling_home_exercise_program.pdf) (s. 1, wstęp („completed over the entirety of the muscle(s)”)); Ohio State University Wexner Medical Center: [Foam Rolling Exercises (transkrypcja filmu)](https://wexnermedical.osu.edu/-/media/transcripts/wexnermedical/blog/2y2leqbvrgw_foamrollingexercises.txt) („Hamstrings” („roll forward and back”)) `foam_roll.ham.path`
- Roluj powoli, krótkimi ruchami. — OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 1, General Instructions („Slowly move the roller along the muscle”)); ACE: [Foam Rolling 101 (blog)](https://www.acefitness.org/resources/everyone/blog/5624/foam-rolling-101/) (How to Foam Roll („Slowly roll…”; lista obejmuje „hamstrings”)) `smr.slow`

**Wskazówki**

- Trzymaj wałek nad kolanem, nie wjeżdżaj na staw. — OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 1, Safety („Avoid rolling directly over the joints (i.e knee…)”)); ACE: [Foam Rolling 101 (blog)](https://www.acefitness.org/resources/everyone/blog/5624/foam-rolling-101/) (How to Foam Roll („avoiding bones and joints”)) `foam_roll.offKnee`
- Gdy trafisz na wrażliwe miejsce, zwolnij i zatrzymaj się na chwilę. — OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 1, General Instructions („pausing on tender areas”)); ACE: [Foam Rolling 101 (blog)](https://www.acefitness.org/resources/everyone/blog/5624/foam-rolling-101/) (How to Foam Roll („Slowly roll the tender areas…”)) `smr.tender`

### Calves-SMR

**Ustawienie**

- Usiądź z wałkiem pod łydkami, podeprzyj się rękami z tyłu i unieś biodra. — NASM: [Foam Roll Calves](https://www.nasm.org/resource-center/exercise-library/foam-roll-calves) (Step 1–2 („Support yourself with your hands behind you and lift your hips slightly off the ground.”)); Ohio State University Wexner Medical Center: [Foam Rolling Exercises (transkrypcja filmu)](https://wexnermedical.osu.edu/-/media/transcripts/wexnermedical/blog/2y2leqbvrgw_foamrollingexercises.txt) („Calves” („Lift your body with your arms”)); Connecticut Children's Sports Medicine: [Lower Extremity Foam Rolling Home Exercise Program (PDF, 2 s.)](https://www.connecticutchildrens.org/sites/default/files/2024-01/lower_extremity_foam_rolling_home_exercise_program.pdf) (s. 1, „Calf” („Push yourself off the ground with your arms”)) `foam_roll.calf.setup`

**Ruch**

- Roluj od kostki do miejsca pod kolanem. — NASM: [Foam Roll Calves](https://www.nasm.org/resource-center/exercise-library/foam-roll-calves) (Step 3 („from just below your knee down toward your ankle”)); OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 2, „4. Calves” (start „just above the heel”, „Roll the FR upward to just below the back of the knee”)) `foam_roll.calf.path`
- Roluj powoli, krótkimi ruchami. — NASM: [Foam Roll Calves](https://www.nasm.org/resource-center/exercise-library/foam-roll-calves) (Step 3 („Perform slow, controlled rolling motions.”)); Connecticut Children's Sports Medicine: [Lower Extremity Foam Rolling Home Exercise Program (PDF, 2 s.)](https://www.connecticutchildrens.org/sites/default/files/2024-01/lower_extremity_foam_rolling_home_exercise_program.pdf) (s. 1, „Calf” („slowly roll your calf”)) `smr.slow`

**Wskazówki**

- Chcesz mocniej — roluj jedną nogę, a drugą połóż na niej. — NASM: [Foam Roll Calves](https://www.nasm.org/resource-center/exercise-library/foam-roll-calves) (Step 1 („Position one leg on top of the other for additional pressure control.”)); Ohio State University Wexner Medical Center: [Foam Rolling Exercises (transkrypcja filmu)](https://wexnermedical.osu.edu/-/media/transcripts/wexnermedical/blog/2y2leqbvrgw_foamrollingexercises.txt) („Calves” („your left leg on top”)) `foam_roll.oneLeg`

**Czego unikać**

- Za szybkie rolowanie. — NASM: [Foam Roll Calves](https://www.nasm.org/resource-center/exercise-library/foam-roll-calves) (Common Mistakes („Rolling too quickly…”)); OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 1, General Instructions („Move about 1 inch per second”)) `smr.mis.fast`
- Za mocny nacisk. — NASM: [Foam Roll Calves](https://www.nasm.org/resource-center/exercise-library/foam-roll-calves) (Common Mistakes („Applying excessive pressure…”)); OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 1, General Instructions („applying moderate pressure”)) `foam_roll.mis.pressure`

### Iliotibial Tract-SMR

**Ustawienie**

- Połóż się na boku, wałek pod zewnętrzną stroną uda. — Ohio State University Wexner Medical Center: [Foam Rolling Exercises (transkrypcja filmu)](https://wexnermedical.osu.edu/-/media/transcripts/wexnermedical/blog/2y2leqbvrgw_foamrollingexercises.txt) („Iliotibial band” („Lie on your side with the roll under your bottom thigh.”)); OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 2, „5. Lateral Thigh (IT Band)” („Begin by lying on your side”)); Connecticut Children's Sports Medicine: [Lower Extremity Foam Rolling Home Exercise Program (PDF, 2 s.)](https://www.connecticutchildrens.org/sites/default/files/2024-01/lower_extremity_foam_rolling_home_exercise_program.pdf) (s. 1, „IT Band” („lying on your side with your hip resting on a foam roll”)) `foam_roll.it.setup`
- Górną nogę przełóż przed dolną i postaw stopę na podłodze. — Connecticut Children's Sports Medicine: [Lower Extremity Foam Rolling Home Exercise Program (PDF, 2 s.)](https://www.connecticutchildrens.org/sites/default/files/2024-01/lower_extremity_foam_rolling_home_exercise_program.pdf) (s. 1, „IT Band” („your upper leg crossed in front of the other, and that foot resting on the ground”)); Ohio State University Wexner Medical Center: [Foam Rolling Exercises (transkrypcja filmu)](https://wexnermedical.osu.edu/-/media/transcripts/wexnermedical/blog/2y2leqbvrgw_foamrollingexercises.txt) („Iliotibial band” („Use your arms and top leg to roll”)) `foam_roll.it.topLeg`

**Ruch**

- Roluj bok uda między biodrem a kolanem. — OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 2, „5. Lateral Thigh” (start „just above the outside of the knee”, „Roll the FR upward to the lateral hip”)); Ohio State University Wexner Medical Center: [Foam Rolling Exercises (transkrypcja filmu)](https://wexnermedical.osu.edu/-/media/transcripts/wexnermedical/blog/2y2leqbvrgw_foamrollingexercises.txt) („Iliotibial band” („roll along the side of your thigh”)); Connecticut Children's Sports Medicine: [Lower Extremity Foam Rolling Home Exercise Program (PDF, 2 s.)](https://www.connecticutchildrens.org/sites/default/files/2024-01/lower_extremity_foam_rolling_home_exercise_program.pdf) (s. 1, „IT Band” („Slowly roll the side of your leg up and down”)) `foam_roll.it.path`
- Roluj powoli, krótkimi ruchami. — Connecticut Children's Sports Medicine: [Lower Extremity Foam Rolling Home Exercise Program (PDF, 2 s.)](https://www.connecticutchildrens.org/sites/default/files/2024-01/lower_extremity_foam_rolling_home_exercise_program.pdf) (s. 1, „IT Band” („Slowly roll…”)); OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 1, General Instructions („Slowly move the roller”)); ACE: [Foam Rolling 101 (blog)](https://www.acefitness.org/resources/everyone/blog/5624/foam-rolling-101/) (How to Foam Roll („Slowly roll…”; lista obejmuje „IT bands”)) `smr.slow`

**Wskazówki**

- Trzymaj wałek nad kolanem, nie wjeżdżaj na staw. — Ohio State University Wexner Medical Center: [Foam Rolling Exercises (transkrypcja filmu)](https://wexnermedical.osu.edu/-/media/transcripts/wexnermedical/blog/2y2leqbvrgw_foamrollingexercises.txt) („Iliotibial band” („Keep the roll above your knee.”)); Connecticut Children's Sports Medicine: [Lower Extremity Foam Rolling Home Exercise Program (PDF, 2 s.)](https://www.connecticutchildrens.org/sites/default/files/2024-01/lower_extremity_foam_rolling_home_exercise_program.pdf) (s. 1, „IT Band” („Don't roll past your knee.”)); OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 1, Safety („Avoid rolling directly over the joints”)) `foam_roll.offKnee`
- Nie dociskaj wałka do kości z boku biodra. — OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 2, „5. Lateral Thigh” („avoid placing pressure directly over the bony area near the top of the thigh”)); ACE: [Foam Rolling 101 (blog)](https://www.acefitness.org/resources/everyone/blog/5624/foam-rolling-101/) (How to Foam Roll („avoiding bones and joints”)) `foam_roll.it.hipBone`
- Gdy trafisz na wrażliwe miejsce, zwolnij i zatrzymaj się na chwilę. — OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 1, General Instructions („pausing on tender areas”)); ACE: [Foam Rolling 101 (blog)](https://www.acefitness.org/resources/everyone/blog/5624/foam-rolling-101/) (How to Foam Roll („Slowly roll the tender areas…”)) `smr.tender`

### Latissimus Dorsi-SMR

**Ustawienie**

- Połóż się na boku, wałek tuż pod pachą. — NASM: [Foam Roll Latissimus Dorsi](https://www.nasm.org/resource-center/exercise-library/foam-roll-latissimus-dorsi) (Step 1 („Lie on your side on a foam roller positioned just below your armpit”)); OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 2, „6. Lats” („lying on your side… FR placed just below your armpit”)) `foam_roll.lat.setup`

**Ruch**

- Roluj bok tułowia, zaczynając tuż pod pachą. — NASM: [Foam Roll Latissimus Dorsi](https://www.nasm.org/resource-center/exercise-library/foam-roll-latissimus-dorsi) (Step 2–3 („along the side of your torso”, „from your armpit down toward your hip”)); OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 2, „6. Lats” („Roll back and forth or side-to-side a few inches”)) `foam_roll.lat.path`
- Roluj powoli, krótkimi ruchami. — NASM: [Foam Roll Latissimus Dorsi](https://www.nasm.org/resource-center/exercise-library/foam-roll-latissimus-dorsi) (Step 3 („Perform slow, controlled rolling motions.”)); OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 1, General Instructions („Slowly move the roller”)) `smr.slow`

**Wskazówki**

- Gdy trafisz na wrażliwe miejsce, zwolnij i zatrzymaj się na chwilę. — NASM: [Foam Roll Latissimus Dorsi](https://www.nasm.org/resource-center/exercise-library/foam-roll-latissimus-dorsi) (Step 3 („pausing on tender areas”)); OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 1, General Instructions („pausing on tender areas”)) `smr.tender`

**Czego unikać**

- Za szybkie rolowanie. — NASM: [Foam Roll Latissimus Dorsi](https://www.nasm.org/resource-center/exercise-library/foam-roll-latissimus-dorsi) (Common Mistakes („Rolling too quickly…”)); OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 1, General Instructions („Move about 1 inch per second”)) `smr.mis.fast`
- Za mocny nacisk. — NASM: [Foam Roll Latissimus Dorsi](https://www.nasm.org/resource-center/exercise-library/foam-roll-latissimus-dorsi) (Common Mistakes („Applying excessive pressure…”)); OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 1, General Instructions („applying moderate pressure”)) `foam_roll.mis.pressure`

### Piriformis-SMR

**Ustawienie**

- Usiądź na wałku i połóż kostkę jednej nogi na kolanie drugiej. — Ohio State University Wexner Medical Center: [Foam Rolling Exercises (transkrypcja filmu)](https://wexnermedical.osu.edu/-/media/transcripts/wexnermedical/blog/2y2leqbvrgw_foamrollingexercises.txt) („Glute piriformis” („Sit on the roll with your right leg crossed over your left knee”)); Connecticut Children's Sports Medicine: [Lower Extremity Foam Rolling Home Exercise Program (PDF, 2 s.)](https://www.connecticutchildrens.org/sites/default/files/2024-01/lower_extremity_foam_rolling_home_exercise_program.pdf) (s. 1, „Glutes” („sitting on a wrapped foam roll with one ankle resting on your opposite knee”)); OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 2, „3. Glutes/Hip Rotators” („crossing the ankle… over the opposite thigh, just above the knee”)) `foam_roll.pir.setup`

**Ruch**

- Roluj pośladek krótkimi ruchami, podpierając się rękami. — Ohio State University Wexner Medical Center: [Foam Rolling Exercises (transkrypcja filmu)](https://wexnermedical.osu.edu/-/media/transcripts/wexnermedical/blog/2y2leqbvrgw_foamrollingexercises.txt) („Glute piriformis” („Use your arms and left leg to roll across your buttock.”)); OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 2, „3. Glutes/Hip Rotators” („Roll back and forth or side-to-side a few inches”)); Connecticut Children's Sports Medicine: [Lower Extremity Foam Rolling Home Exercise Program (PDF, 2 s.)](https://www.connecticutchildrens.org/sites/default/files/2024-01/lower_extremity_foam_rolling_home_exercise_program.pdf) (s. 1, „Glutes” („Slowly roll your bottom back and forth”)) `foam_roll.pir.path`
- Roluj powoli, krótkimi ruchami. — Connecticut Children's Sports Medicine: [Lower Extremity Foam Rolling Home Exercise Program (PDF, 2 s.)](https://www.connecticutchildrens.org/sites/default/files/2024-01/lower_extremity_foam_rolling_home_exercise_program.pdf) (s. 1, „Glutes” („Slowly roll…”)); OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 1, General Instructions („Slowly move the roller”)) `smr.slow`

### Rhomboids-SMR

**Ustawienie**

- Połóż się na plecach, wałek w poprzek pod górną częścią pleców, stopy na podłodze. — Ohio State University Wexner Medical Center: [Foam Rolling Exercises (transkrypcja filmu)](https://wexnermedical.osu.edu/-/media/transcripts/wexnermedical/blog/2y2leqbvrgw_foamrollingexercises.txt) („Spine roll” („Lie on your back with the roll under your back”)); OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 2, „7. Mid/Upper Back” („lying on your back, with the FR placed under your lower ribs”)) `foam_roll.ub.setup`

**Ruch**

- Odpychaj się nogami i roluj górną część pleców. — Ohio State University Wexner Medical Center: [Foam Rolling Exercises (transkrypcja filmu)](https://wexnermedical.osu.edu/-/media/transcripts/wexnermedical/blog/2y2leqbvrgw_foamrollingexercises.txt) („Spine roll” („Use your legs to roll slowly up and down.”)); OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 2, „7. Mid/Upper Back” („Roll the FR upward to the top of the shoulder/base of the neck”)) `foam_roll.ub.path`
- Roluj powoli, krótkimi ruchami. — Ohio State University Wexner Medical Center: [Foam Rolling Exercises (transkrypcja filmu)](https://wexnermedical.osu.edu/-/media/transcripts/wexnermedical/blog/2y2leqbvrgw_foamrollingexercises.txt) („Spine roll” („roll slowly up and down”)); OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 1, General Instructions („Slowly move the roller”)) `smr.slow`

**Wskazówki**

- Gdy trafisz na wrażliwe miejsce, zwolnij i zatrzymaj się na chwilę. — OrthoBethesda Therapy Services: [Foam Rolling (FR) Exercises (PDF, 2 s., 2015)](https://www.orthobethesda.com/foam-rolling-exercises/) (s. 1, General Instructions („pausing on tender areas”)); ACE: [Foam Rolling 101 (blog)](https://www.acefitness.org/resources/everyone/blog/5624/foam-rolling-101/) (How to Foam Roll („Slowly roll the tender areas…”; lista obejmuje „upper back”)) `smr.tender`

### Foot-SMR

**Ustawienie**

- Usiądź i postaw stopę na piłce albo wałku. — UW Medicine: [Exercises for Plantar Fasciitis (Sports Medicine Clinic, PDF, 5 s.)](https://honline.s.uw.edu/sites/default/files/record_pdfs/Exercises-Plantar-Fasciitis.pdf) (s. 2, „Ball Massage” („Sit upright with your feet under your knees. Place a dense ball… under your… foot.”)); WebMD Ignite: [Plantar Fasciitis Exercises (Health Library)](https://www.columbiadoctors.org/health-library/how-to/plantar-fasciitis-exercises) („Plantar fascia self-massage” („Sit in a chair. Place your foot on a firm, tube-shaped object”)) `foam_roll.foot.setup`

**Ruch**

- Roluj podeszwę w przód i w tył, od pięty do poduszki pod palcami. — UW Medicine: [Exercises for Plantar Fasciitis (Sports Medicine Clinic, PDF, 5 s.)](https://honline.s.uw.edu/sites/default/files/record_pdfs/Exercises-Plantar-Fasciitis.pdf) (s. 2, „Ball Massage” („Roll it along the arch of your foot, from the ball to the heel.”)); WebMD Ignite: [Plantar Fasciitis Exercises (Health Library)](https://www.columbiadoctors.org/health-library/how-to/plantar-fasciitis-exercises) („Plantar fascia self-massage” („Roll your foot back and forth over the object”)) `foam_roll.foot.path`

### External Rotation with Band

**Ustawienie**

- Zaczep gumę na wysokości pasa i stań do niej bokiem. — HSS: [Shoulder Rotator Cuff and Scapular Strengthening Program](https://hss.edu/sutton/shoulder-strengthening-program.pdf) (s. 1, External Rotation); WebMD Ignite: [Shoulder external rotation (resisted)](https://www.columbiadoctors.org/health-library/multimedia/shoulder-external-rotation-resisted/) (instrukcja, akapity 1–2) `rotator_cuff.bandSetup`
- Chwyć gumę ręką dalej od zaczepu; łokieć zgięty pod kątem prostym przy boku, przedramię przed brzuchem. — WebMD Ignite: [Shoulder external rotation (resisted)](https://www.columbiadoctors.org/health-library/multimedia/shoulder-external-rotation-resisted/) (instrukcja: elbow 90°, forearm across the belly); HSS: [Shoulder Rotator Cuff and Scapular Strengthening Program](https://hss.edu/sutton/shoulder-strengthening-program.pdf) (s. 1, External Rotation (hand close to chest)) `rotator_cuff.erStart`

**Ruch**

- Odsuwaj dłoń od brzucha na zewnątrz, tak daleko, jak wygodnie. — HSS: [Shoulder Rotator Cuff and Scapular Strengthening Program](https://hss.edu/sutton/shoulder-strengthening-program.pdf) (s. 1, External Rotation); WebMD Ignite: [Shoulder external rotation (resisted)](https://www.columbiadoctors.org/health-library/multimedia/shoulder-external-rotation-resisted/) (instrukcja: rotate the forearm outward); AAOS: [Rotator Cuff and Shoulder Conditioning Program](https://www.orthoinfo.org/en/recovery/rotator-cuff-and-shoulder-conditioning-program/) (ćw. 9 External Rotation) `rotator_cuff.erMove`

**Wskazówki**

- Łokieć zgięty i przy boku — obraca się tylko przedramię. — AAOS: [Rotator Cuff and Shoulder Conditioning Program](https://www.orthoinfo.org/en/recovery/rotator-cuff-and-shoulder-conditioning-program/) (ćw. 9 External Rotation); WebMD Ignite: [Shoulder external rotation (resisted)](https://www.columbiadoctors.org/health-library/multimedia/shoulder-external-rotation-resisted/) (instrukcja: keep elbow and upper arm tucked); HSS: [Shoulder Rotator Cuff and Scapular Strengthening Program](https://hss.edu/sutton/shoulder-strengthening-program.pdf) (s. 1 (hinge on a gate)) `rot.elbow`
- Wracaj powoli. — AAOS: [Rotator Cuff and Shoulder Conditioning Program](https://www.orthoinfo.org/en/recovery/rotator-cuff-and-shoulder-conditioning-program/) (ćw. 9 External Rotation); WebMD Ignite: [Shoulder external rotation (resisted)](https://www.columbiadoctors.org/health-library/multimedia/shoulder-external-rotation-resisted/) (instrukcja: slowly bring the arm back) `rot.slow`

**Czego unikać**

- Łokieć odjeżdża od tułowia. — AAOS: [Rotator Cuff and Shoulder Conditioning Program](https://www.orthoinfo.org/en/recovery/rotator-cuff-and-shoulder-conditioning-program/) (ćw. 9 (keeping your elbow close to your side)); WebMD Ignite: [Shoulder external rotation (resisted)](https://www.columbiadoctors.org/health-library/multimedia/shoulder-external-rotation-resisted/) (instrukcja: elbow and upper arm tucked in) `rot.mis.elbowAway`

### External Rotation (hantel)

**Ustawienie**

- Połóż się na boku; górny łokieć zgięty pod kątem prostym przy boku, hantel przed brzuchem. — AAOS: [Rotator Cuff and Shoulder Conditioning Program](https://www.orthoinfo.org/en/recovery/rotator-cuff-and-shoulder-conditioning-program/) (ćw. 17 External Rotation (side-lying)); HSS: [Shoulder Rotator Cuff and Scapular Strengthening Program](https://hss.edu/sutton/shoulder-strengthening-program.pdf) (s. 2, Sidelying external rotation); South Tees Hospitals NHS Foundation Trust: [Rotator cuff in side lying](https://www.southtees.nhs.uk/resources/rotator-cuff-in-side-lying/) (instrukcja, krok 1) `rotator_cuff.sideSetup`

**Ruch**

- Unoś hantel, obracając przedramię w górę; łokieć zostaje przy boku. — AAOS: [Rotator Cuff and Shoulder Conditioning Program](https://www.orthoinfo.org/en/recovery/rotator-cuff-and-shoulder-conditioning-program/) (ćw. 17); HSS: [Shoulder Rotator Cuff and Scapular Strengthening Program](https://hss.edu/sutton/shoulder-strengthening-program.pdf) (s. 2, Sidelying external rotation); South Tees Hospitals NHS Foundation Trust: [Rotator cuff in side lying](https://www.southtees.nhs.uk/resources/rotator-cuff-in-side-lying/) (instrukcja, krok 2) `rotator_cuff.sideMove`

**Wskazówki**

- Wracaj powoli. — AAOS: [Rotator Cuff and Shoulder Conditioning Program](https://www.orthoinfo.org/en/recovery/rotator-cuff-and-shoulder-conditioning-program/) (ćw. 17 (slowly lower the weight)); HSS: [Shoulder Rotator Cuff and Scapular Strengthening Program](https://hss.edu/sutton/shoulder-strengthening-program.pdf) (s. 2 (slowly lower the hand)); South Tees Hospitals NHS Foundation Trust: [Rotator cuff in side lying](https://www.southtees.nhs.uk/resources/rotator-cuff-in-side-lying/) (instrukcja, krok 3) `rot.slow`

**Czego unikać**

- Łokieć odjeżdża od tułowia. — AAOS: [Rotator Cuff and Shoulder Conditioning Program](https://www.orthoinfo.org/en/recovery/rotator-cuff-and-shoulder-conditioning-program/) (ćw. 17 (keep your elbow against your side)); HSS: [Shoulder Rotator Cuff and Scapular Strengthening Program](https://hss.edu/sutton/shoulder-strengthening-program.pdf) (s. 2 (keep the arm firmly against your side)); South Tees Hospitals NHS Foundation Trust: [Rotator cuff in side lying](https://www.southtees.nhs.uk/resources/rotator-cuff-in-side-lying/) (instrukcja, krok 2 (maintain contact with the towel)) `rot.mis.elbowAway`

### Internal Rotation with Band

**Ustawienie**

- Zaczep gumę na wysokości pasa i stań do niej bokiem. — HSS: [Shoulder Rotator Cuff and Scapular Strengthening Program](https://hss.edu/sutton/shoulder-strengthening-program.pdf) (s. 1, Internal Rotation); WebMD Ignite: [Shoulder internal rotation (resisted)](https://www.columbiadoctors.org/health-library/multimedia/shoulder-internal-rotation-resisted/) (instrukcja, akapity 1–2) `rotator_cuff.bandSetup`
- Chwyć gumę ręką bliżej zaczepu; łokieć zgięty pod kątem prostym przy boku. — WebMD Ignite: [Shoulder internal rotation (resisted)](https://www.columbiadoctors.org/health-library/multimedia/shoulder-internal-rotation-resisted/) (instrukcja (affected side toward the door; elbow 90°)); HSS: [Shoulder Rotator Cuff and Scapular Strengthening Program](https://hss.edu/sutton/shoulder-strengthening-program.pdf) (s. 1, Internal Rotation (elbow flexed at 90 degrees)) `rotator_cuff.irStart`

**Ruch**

- Przyciągaj dłoń do brzucha. — HSS: [Shoulder Rotator Cuff and Scapular Strengthening Program](https://hss.edu/sutton/shoulder-strengthening-program.pdf) (s. 1 (move the hand toward the belly)); WebMD Ignite: [Shoulder internal rotation (resisted)](https://www.columbiadoctors.org/health-library/multimedia/shoulder-internal-rotation-resisted/) (instrukcja (until it touches your belly)); AAOS: [Rotator Cuff and Shoulder Conditioning Program](https://www.orthoinfo.org/en/recovery/rotator-cuff-and-shoulder-conditioning-program/) (ćw. 8 Internal Rotation) `rotator_cuff.irMove`

**Wskazówki**

- Łokieć zgięty i przy boku — obraca się tylko przedramię. — AAOS: [Rotator Cuff and Shoulder Conditioning Program](https://www.orthoinfo.org/en/recovery/rotator-cuff-and-shoulder-conditioning-program/) (ćw. 8 (keep your elbow pressed into your side)); WebMD Ignite: [Shoulder internal rotation (resisted)](https://www.columbiadoctors.org/health-library/multimedia/shoulder-internal-rotation-resisted/) (instrukcja) `rot.elbow`
- Wracaj powoli. — AAOS: [Rotator Cuff and Shoulder Conditioning Program](https://www.orthoinfo.org/en/recovery/rotator-cuff-and-shoulder-conditioning-program/) (ćw. 8); WebMD Ignite: [Shoulder internal rotation (resisted)](https://www.columbiadoctors.org/health-library/multimedia/shoulder-internal-rotation-resisted/) (instrukcja (slowly move it back)) `rot.slow`

### Supine Figure-Four Stretch

**Ustawienie**

- Połóż się na plecach z ugiętymi kolanami i oprzyj kostkę jednej nogi na kolanie drugiej. — Athletico Physical Therapy: [Stretch of the Week: Figure 4](https://athletico.com/?p=27325) (Step 1 i Step 2 (Beginner)); WebMD Ignite: [Piriformis stretch (from legs bent)](https://myhealth.alberta.ca/Health/healthy-living/pages/conditions.aspx?hwid=abk4469) (kroki 1–2); Livewell Southwest: [Lower Limb Muscle Stretching Exercises, v2 04.2016 (PDF, 2 s.)](https://www.livewellsouthwest.co.uk/wp-content/uploads/2023/06/Adult-Stretching-Leafelt-V2-April-2016.pdf) (s. 2, Hip Extensor Muscle Stretch, punkt 1) `mobility_floor.n.f4Cross`

**Ruch**

- Przyciągaj drugą nogę do klatki, aż poczujesz rozciąganie w pośladku. — Livewell Southwest: [Lower Limb Muscle Stretching Exercises, v2 04.2016 (PDF, 2 s.)](https://www.livewellsouthwest.co.uk/wp-content/uploads/2023/06/Adult-Stretching-Leafelt-V2-April-2016.pdf) (s. 2, Hip Extensor Muscle Stretch, punkty 2–3); Athletico Physical Therapy: [Stretch of the Week: Figure 4](https://athletico.com/?p=27325) (Step 2 (Advanced)) `mobility_floor.n.f4Pull`

### Butterfly Stretch

**Ustawienie**

- Tułów trzymaj prosto. — ACE: [Seated Butterfly Stretch (#216)](https://www.acefitness.org/resources/everyone/exercise-library/216/seated-butterfly-stretch/) (Starting position (trunk upright)); Covenant HealthCare: [Lower Body Flexibility (PDF, 2 s.)](https://covenanthealthcare.com/Uploads/Public/Documents/Workfiles/Covenant%20Medical%20Group/Sports_Medicine/Lower_Body_Flexibility.pdf) (s. 2, BUTTERFLY STRETCH, pkt 2 (spinal alignment)) `mobility_floor.n.tall`

**Ruch**

- Pochyl się z bioder i łokciami delikatnie dociśnij uda w dół. — ACE: [Seated Butterfly Stretch (#216)](https://www.acefitness.org/resources/everyone/exercise-library/216/seated-butterfly-stretch/) (Step 1); Covenant HealthCare: [Lower Body Flexibility (PDF, 2 s.)](https://covenanthealthcare.com/Uploads/Public/Documents/Workfiles/Covenant%20Medical%20Group/Sports_Medicine/Lower_Body_Flexibility.pdf) (s. 2, BUTTERFLY STRETCH, pkt 1 (press down with your elbows)) `mobility_floor.n.bfHinge`

**Czego unikać**

- Garbienie się i podwijanie miednicy. — ACE: [Seated Butterfly Stretch (#216)](https://www.acefitness.org/resources/everyone/exercise-library/216/seated-butterfly-stretch/) (Step 1 (back flat, move from the hips, not the low back)); Covenant HealthCare: [Lower Body Flexibility (PDF, 2 s.)](https://covenanthealthcare.com/Uploads/Public/Documents/Workfiles/Covenant%20Medical%20Group/Sports_Medicine/Lower_Body_Flexibility.pdf) (s. 2, BUTTERFLY STRETCH, pkt 2 (do not allow pelvis to tilt backward)) `mobility_floor.n.mis.roundBack`

### Side-Lying Quad Stretch

**Ustawienie**

- Połóż się na boku i chwyć dłonią stopę górnej nogi. — Livewell Southwest: [Lower Limb Muscle Stretching Exercises, v2 04.2016 (PDF, 2 s.)](https://www.livewellsouthwest.co.uk/wp-content/uploads/2023/06/Adult-Stretching-Leafelt-V2-April-2016.pdf) (s. 2, Quadriceps Muscle Stretch, punkt 1); OrthoIndy Physical Therapy: [IT Band Home Exercise Program (PDF, rev. 8/15)](https://orthoindy.com/wp-content/uploads/IT-Band-Program.pdf) (s. 2, Sidelying Quadriceps Stretch, Setup/Movement) `mobility_floor.n.qSide`

**Ruch**

- Przyciągaj piętę do pośladka, kolana trzymaj razem. — Livewell Southwest: [Lower Limb Muscle Stretching Exercises, v2 04.2016 (PDF, 2 s.)](https://www.livewellsouthwest.co.uk/wp-content/uploads/2023/06/Adult-Stretching-Leafelt-V2-April-2016.pdf) (s. 2, Quadriceps Muscle Stretch, punkty 1 i 3); OrthoIndy Physical Therapy: [IT Band Home Exercise Program (PDF, rev. 8/15)](https://orthoindy.com/wp-content/uploads/IT-Band-Program.pdf) (s. 2, Sidelying Quadriceps Stretch, Movement) `mobility_floor.n.qPull`

### Cat-Cow

**Ustawienie**

- Stań na czworakach: dłonie pod barkami, kolana pod biodrami. — ACE: [Cat-Cow (#15)](https://www.acefitness.org/resources/everyone/exercise-library/15/cat-cow/) (Steps, krok 2); Health and Wellbeing Queensland: [Cat and cow stretch](https://hw.qld.gov.au/?p=41297) (Steps, krok 1); South Tees Hospitals NHS Foundation Trust: [Cat stretch (Physiotherapy)](https://www.southtees.nhs.uk/?p=31588) (Fig A); Connecticut Children's Sports Medicine: [Back Stretching Home Exercise Program](https://www.connecticutchildrens.org/sites/default/files/2026-04/pdf_sportsmed_back-stretching-home-exercise-program.pdf) (s. 1, Cat Cow, pkt 1 (kolana zgięte 90°)) `mobility_floor.t.catCow.setup`

**Ruch**

- Zaokrąglij plecy w górę i opuść głowę. — ACE: [Cat-Cow (#15)](https://www.acefitness.org/resources/everyone/exercise-library/15/cat-cow/) (Steps, krok 4 (Cat Phase)); South Tees Hospitals NHS Foundation Trust: [Cat stretch (Physiotherapy)](https://www.southtees.nhs.uk/?p=31588) (Fig B); Connecticut Children's Sports Medicine: [Back Stretching Home Exercise Program](https://www.connecticutchildrens.org/sites/default/files/2026-04/pdf_sportsmed_back-stretching-home-exercise-program.pdf) (s. 1, Cat Cow, pkt 2) `mobility_floor.t.catCow.round`
- Potem opuść brzuch w stronę podłogi, żeby plecy się wygięły. — ACE: [Cat-Cow (#15)](https://www.acefitness.org/resources/everyone/exercise-library/15/cat-cow/) (Steps, krok 5 (Cow Phase)); South Tees Hospitals NHS Foundation Trust: [Cat stretch (Physiotherapy)](https://www.southtees.nhs.uk/?p=31588) (Fig C); Connecticut Children's Sports Medicine: [Back Stretching Home Exercise Program](https://www.connecticutchildrens.org/sites/default/files/2026-04/pdf_sportsmed_back-stretching-home-exercise-program.pdf) (s. 1, Cat Cow, pkt 2); Health and Wellbeing Queensland: [Cat and cow stretch](https://hw.qld.gov.au/?p=41297) (Steps, krok 4) `mobility_floor.t.catCow.arch`

**Wskazówki**

- Przechodź z pozycji do pozycji powoli i płynnie. — South Tees Hospitals NHS Foundation Trust: [Cat stretch (Physiotherapy)](https://www.southtees.nhs.uk/?p=31588) (Fig C); Connecticut Children's Sports Medicine: [Back Stretching Home Exercise Program](https://www.connecticutchildrens.org/sites/default/files/2026-04/pdf_sportsmed_back-stretching-home-exercise-program.pdf) (s. 1, Cat Cow, pkt 3); Health and Wellbeing Queensland: [Cat and cow stretch](https://hw.qld.gov.au/?p=41297) (Breathing / krok 6) `mobility_floor.t.catCow.smooth`
- Zaokrąglając plecy, zrób wydech. — ACE: [Cat-Cow (#15)](https://www.acefitness.org/resources/everyone/exercise-library/15/cat-cow/) (Steps, krok 4); Health and Wellbeing Queensland: [Cat and cow stretch](https://hw.qld.gov.au/?p=41297) (Breathing, krok 5) `mobility_floor.t.catCow.exhale`

### Child's Pose

**Ustawienie**

- Uklęknij i oprzyj dłonie o podłogę przed sobą. — ACE: [Childs Pose (#227)](https://www.acefitness.org/resources/everyone/exercise-library/227/childs-pose/) (Starting Position, krok 1); Connecticut Children's Sports Medicine: [Back Stretching Home Exercise Program](https://www.connecticutchildrens.org/sites/default/files/2026-04/pdf_sportsmed_back-stretching-home-exercise-program.pdf) (s. 1, Child's Pose, pkt 1); WebMD Ignite: [Child's pose (ColumbiaDoctors Health Library, stan na 01.05.2026)](https://www.columbiadoctors.org/health-library/multimedia/child-s-pose/) (kroki 1–2) `mobility_floor.t.child.setup`

**Ruch**

- Cofnij biodra w stronę pięt. — ACE: [Childs Pose (#227)](https://www.acefitness.org/resources/everyone/exercise-library/227/childs-pose/) (krok 2); Connecticut Children's Sports Medicine: [Back Stretching Home Exercise Program](https://www.connecticutchildrens.org/sites/default/files/2026-04/pdf_sportsmed_back-stretching-home-exercise-program.pdf) (s. 1, Child's Pose, pkt 2–3); WebMD Ignite: [Child's pose (ColumbiaDoctors Health Library, stan na 01.05.2026)](https://www.columbiadoctors.org/health-library/multimedia/child-s-pose/) (krok 1) `mobility_floor.t.child.sitBack`
- Ręce zostaw wyciągnięte przed sobą, a klatkę opuść w stronę podłogi. — ACE: [Childs Pose (#227)](https://www.acefitness.org/resources/everyone/exercise-library/227/childs-pose/) (krok 2); Connecticut Children's Sports Medicine: [Back Stretching Home Exercise Program](https://www.connecticutchildrens.org/sites/default/files/2026-04/pdf_sportsmed_back-stretching-home-exercise-program.pdf) (s. 1, Child's Pose, pkt 2); WebMD Ignite: [Child's pose (ColumbiaDoctors Health Library, stan na 01.05.2026)](https://www.columbiadoctors.org/health-library/multimedia/child-s-pose/) (kroki 2–3) `mobility_floor.t.child.reach`

### Supine Spinal Twist

**Ustawienie**

- Połóż się na plecach, kolana ugięte, stopy płasko na podłodze. — HSS: [HSS Rehabilitation and Performance, Back and Neck Stretches (17.02.2021)](https://www.hss.edu/health-library/move-better/back-neck-stretches) (Trunk Rotation, krok 1 (wariant: oba kolana)); Advocate Aurora Health: [Lumbar – Lower Trunk Rotation, Hooklying (X20549, rev. 12/2019)](https://ahc.aurorahealthcare.org/fywb/x20549.pdf) (krok 1 (wariant: oba kolana)) `mobility_floor.t.supTwist.setup`

**Ruch**

- Powoli opuść oba kolana na jedną stronę; barki zostają na podłodze. — HSS: [HSS Rehabilitation and Performance, Back and Neck Stretches (17.02.2021)](https://www.hss.edu/health-library/move-better/back-neck-stretches) (Trunk Rotation (wariant: oba kolana)); Advocate Aurora Health: [Lumbar – Lower Trunk Rotation, Hooklying (X20549, rev. 12/2019)](https://ahc.aurorahealthcare.org/fywb/x20549.pdf) (krok 2 (wariant: oba kolana)); Cambridge University Hospitals NHS FT: [Spinal range of movement/stretching exercises](https://www.cuh.nhs.uk/patient-information/spinal-range-of-movementstretching-exercises/) (Lying on back, Knee rolls (wariant: oba kolana)) `mobility_floor.t.supTwist.move`

**Wskazówki**

- Barki zostają na podłodze. — HSS: [HSS Rehabilitation and Performance, Back and Neck Stretches (17.02.2021)](https://www.hss.edu/health-library/move-better/back-neck-stretches) (Trunk Rotation); Advocate Aurora Health: [Lumbar – Lower Trunk Rotation, Hooklying (X20549, rev. 12/2019)](https://ahc.aurorahealthcare.org/fywb/x20549.pdf) (krok 1) `mobility_floor.t.supTwist.shoulders`

**Czego unikać**

- Odrywanie barku od podłogi. — HSS: [HSS Rehabilitation and Performance, Back and Neck Stretches (17.02.2021)](https://www.hss.edu/health-library/move-better/back-neck-stretches) (Trunk Rotation); Advocate Aurora Health: [Lumbar – Lower Trunk Rotation, Hooklying (X20549, rev. 12/2019)](https://ahc.aurorahealthcare.org/fywb/x20549.pdf) (krok 1) `mobility_floor.t.supTwist.mis.shoulder`

### The Straddle

**Ustawienie**

- Usiądź w szerokim rozkroku, kolana i palce stóp skierowane w górę. — ACE: [Seated Straddle Stretch (#210)](https://www.acefitness.org/resources/everyone/exercise-library/210/seated-straddle-stretch/) (Starting Position (legs apart, knees extended, toes pointing up)); YogaUOnline: [Wide-Angle Seated Forward Bend – Open Inner Thighs Safely (07.03.2026)](https://yogauonline.com/yoga-practice-teaching-tips/yoga-practice-tips/julie-gudmestad-wide-angle-seated-forward-bend-open-inner-thighs-safely/) (akapit o ustawieniu nóg (toes and kneecaps pointing toward the ceiling)) `mobility_floor.u.straddleSit`
- Tułów trzymaj prosto. — ACE: [Seated Straddle Stretch (#210)](https://www.acefitness.org/resources/everyone/exercise-library/210/seated-straddle-stretch/) (Starting Position (trunk vertical, head aligned with spine)); YogaUOnline: [Wide-Angle Seated Forward Bend – Open Inner Thighs Safely (07.03.2026)](https://yogauonline.com/yoga-practice-teaching-tips/yoga-practice-tips/julie-gudmestad-wide-angle-seated-forward-bend-open-inner-thighs-safely/) (akapit o wydłużeniu kręgosłupa przed ruchem) `mobility_floor.n.tall`

**Ruch**

- Pochylaj się z bioder, plecy zostają proste. — ACE: [Seated Straddle Stretch (#210)](https://www.acefitness.org/resources/everyone/exercise-library/210/seated-straddle-stretch/) (Step 2 (hinge forward from the hips, back flat)); YogaUOnline: [Wide-Angle Seated Forward Bend – Open Inner Thighs Safely (07.03.2026)](https://yogauonline.com/yoga-practice-teaching-tips/yoga-practice-tips/julie-gudmestad-wide-angle-seated-forward-bend-open-inner-thighs-safely/) (akapit o pochylaniu z bioder) `mobility_floor.n.hingeFlat`

**Czego unikać**

- Garbienie się zamiast pochylania z bioder. — ACE: [Seated Straddle Stretch (#210)](https://www.acefitness.org/resources/everyone/exercise-library/210/seated-straddle-stretch/) (Step 2 (avoid rounding your back)); YogaUOnline: [Wide-Angle Seated Forward Bend – Open Inner Thighs Safely (07.03.2026)](https://yogauonline.com/yoga-practice-teaching-tips/yoga-practice-tips/julie-gudmestad-wide-angle-seated-forward-bend-open-inner-thighs-safely/) (akapit o pochylaniu z bioder (collapse forward with a rounded back)) `mobility_floor.u.mis.roundInstead`

### Peroneals Stretch

**Ustawienie**

- Usiądź i załóż taśmę albo ręcznik na stopę. — Leeds Teaching Hospitals NHS Trust, Physiotherapy Department: [Ankle Phase 2 Exercises (A. Brogden, 27.01.2022)](https://www.leedsth.nhs.uk/wp-content/uploads/2023/05/Metatarsal-Phase-2-exercises.pdf) (s. 1, ćw. 2 Stretching inversion/eversion, zdanie 1); East Carolina University Physical Therapy Clinic: [Seated Ankle Inversion Stretch with Towel](https://sites.ecu.edu/ecuphysicaltherapyclinic/?p=143) (opis ćwiczenia, zdanie 1) `mobility_floor.u.ankleStrap`

**Ruch**

- Ciągnij za wewnętrzny koniec taśmy, żeby obrócić stopę do środka. — Leeds Teaching Hospitals NHS Trust, Physiotherapy Department: [Ankle Phase 2 Exercises (A. Brogden, 27.01.2022)](https://www.leedsth.nhs.uk/wp-content/uploads/2023/05/Metatarsal-Phase-2-exercises.pdf) (s. 1, ćw. 2, zdanie o inwersji); East Carolina University Physical Therapy Clinic: [Seated Ankle Inversion Stretch with Towel](https://sites.ecu.edu/ecuphysicaltherapyclinic/?p=143) (opis ćwiczenia, zdanie 2 (nacisk po wewnętrznej stronie stopy)) `mobility_floor.u.invert`

### Posterior Tibialis Stretch

**Ustawienie**

- Usiądź i załóż taśmę albo ręcznik na stopę. — Leeds Teaching Hospitals NHS Trust, Physiotherapy Department: [Ankle Phase 2 Exercises (A. Brogden, 27.01.2022)](https://www.leedsth.nhs.uk/wp-content/uploads/2023/05/Metatarsal-Phase-2-exercises.pdf) (s. 1, ćw. 2 Stretching inversion/eversion, zdanie 1); East Carolina University Physical Therapy Clinic: [Seated Ankle Eversion Stretch with Towel](https://sites.ecu.edu/ecuphysicaltherapyclinic/?p=138) (opis ćwiczenia, zdanie 1) `mobility_floor.u.ankleStrap`

**Ruch**

- Ciągnij za zewnętrzny koniec taśmy, żeby obrócić stopę na zewnątrz. — Leeds Teaching Hospitals NHS Trust, Physiotherapy Department: [Ankle Phase 2 Exercises (A. Brogden, 27.01.2022)](https://www.leedsth.nhs.uk/wp-content/uploads/2023/05/Metatarsal-Phase-2-exercises.pdf) (s. 1, ćw. 2, zdanie o ewersji); East Carolina University Physical Therapy Clinic: [Seated Ankle Eversion Stretch with Towel](https://sites.ecu.edu/ecuphysicaltherapyclinic/?p=138) (opis ćwiczenia (nacisk po zewnętrznej stronie)) `mobility_floor.u.evert`

### Wall Calf Stretch

**Ustawienie**

- Oprzyj dłonie o ścianę i cofnij jedną nogę; obie stopy płasko, palce do przodu. — ACE: [Standing Dorsi-Flexion (Calf Stretch) (#152)](https://www.acefitness.org/resources/everyone/exercise-library/152/) (Step 1: dłonie na ścianie, krok w tył do wykroku, obie stopy płasko, palce do przodu); NHS (nhs.uk): [Flexibility exercises](https://www.nhs.uk/live-well/exercise/flexibility-exercises/) (Calf stretch: dłonie na ścianie, lewa noga w tył, „both feet flat on the floor”); Cancer Council Victoria: [Flexibility exercises](https://www.cancervic.org.au/get-support/guides/managing-daily-life/exercise/flexibility-exercises) (Calf stretch: twarzą do ściany, dłonie płasko na ścianie, jedna stopa w tył) `mobility_stand.s.wallCalfSet`

**Ruch**

- Ugnij przednie kolano i pochyl się do ściany; tylna noga prosta, pięta na podłodze. — ACE: [Standing Dorsi-Flexion (Calf Stretch) (#152)](https://www.acefitness.org/resources/everyone/exercise-library/152/) (Step 2: przednie kolano ugina się, tylna noga prosta, pięta wciskana w podłogę); NHS (nhs.uk): [Flexibility exercises](https://www.nhs.uk/live-well/exercise/flexibility-exercises/) (Calf stretch: ugięte przednie kolano, tylna noga prosta, pięta na podłodze); Cancer Council Victoria: [Flexibility exercises](https://www.cancervic.org.au/get-support/guides/managing-daily-life/exercise/flexibility-exercises) (Calf stretch: pochyl się, przednie kolano lekko ugięte, tylna noga prosta) `mobility_stand.s.wallCalfMove`

**Wskazówki**

- Wchodź w rozciąganie powoli, aż poczujesz napięcie. — ACE: [Standing Dorsi-Flexion (Calf Stretch) (#152)](https://www.acefitness.org/resources/everyone/exercise-library/152/) (Step 2: „Slowly move your body toward the wall…”, pogłębianie stopniowo); Cancer Council Victoria: [Flexibility exercises](https://www.cancervic.org.au/get-support/guides/managing-daily-life/exercise/flexibility-exercises) (Calf stretch: tylna stopa dalej, aż poczujesz rozciąganie; General: stretch to mild discomfort) `st.tension`
- Kolano zostaje proste — z ugiętym rozciągasz niżej położoną część łydki. — Shropshire Community Health NHS Trust: [Calf Stretching Information Leaflet](https://www.shropscommunityhealth.nhs.uk/content/doclib/13861.pdf) (s. 1, How to Stretch: kolano proste — środek łydki; ugięte — niżej (płaszczkowaty)); ACE: [Standing Dorsi-Flexion (Calf Stretch) (#152)](https://www.acefitness.org/resources/everyone/exercise-library/152/) (Step 4: lekko ugięte tylne kolano — płaszczkowaty) `gcalf.knee`
- Trzymaj spokojnie, bez sprężynowania. — Cancer Council Victoria: [Flexibility exercises](https://www.cancervic.org.au/get-support/guides/managing-daily-life/exercise/flexibility-exercises) (zasady ogólne (obejmują Calf stretch): bez sprężynowania); Duke University Health System, Occupational and Environmental Safety Office: [Stretches (handout, 2011)](https://www.safety.duke.edu/sites/default/files/Stretches.pdf) (s. 2, stopka: „Stretches should be gentle and slow, but not bouncy.” (dotyczy Sprinters Stretch — łydka, wariant z oparciem o krzesło)) `st.noBounce`

**Czego unikać**

- Odrywanie tylnej pięty od podłogi. — Shropshire Community Health NHS Trust: [Calf Stretching Information Leaflet](https://www.shropscommunityhealth.nhs.uk/content/doclib/13861.pdf) (s. 1, How to Stretch: „Do not lift the heels or push your bottom out.”); ACE: [Standing Dorsi-Flexion (Calf Stretch) (#152)](https://www.acefitness.org/resources/everyone/exercise-library/152/) (Step 3: „…heels in contact with the floor.”); NHS (nhs.uk): [Flexibility exercises](https://www.nhs.uk/live-well/exercise/flexibility-exercises/) (Calf stretch: pięta na podłodze) `mobility_stand.s.mis.heelUp`
- Wciskanie się w rozciąganie na siłę. — Cancer Council Victoria: [Flexibility exercises](https://www.cancervic.org.au/get-support/guides/managing-daily-life/exercise/flexibility-exercises) (zasady ogólne: nie dociskaj rozciągania, które boli (parafraza)); Duke University Health System, Occupational and Environmental Safety Office: [Stretches (handout, 2011)](https://www.safety.duke.edu/sites/default/files/Stretches.pdf) (s. 2, stopka: „Do not stretch to the point of pain.” (Sprinters Stretch, wariant)) `st.mis.force`

### Standing Soleus And Achilles Stretch

**Ustawienie**

- Oprzyj dłonie o ścianę i cofnij jedną nogę; obie stopy płasko, palce do przodu. — ACE: [Standing Dorsi-Flexion (Calf Stretch) (#152)](https://www.acefitness.org/resources/everyone/exercise-library/152/) (Step 1 (ustawienie przy ścianie, wspólne z wariantem z kroku 4)); Shropshire Community Health NHS Trust: [Calf Stretching Information Leaflet](https://www.shropscommunityhealth.nhs.uk/content/doclib/13861.pdf) (s. 1, How to Stretch: „Stand with one foot in front of the other and place your hands/ or elbows on the wall.”) `mobility_stand.s.wallCalfSet`

**Ruch**

- Lekko ugnij tylne kolano, pięta zostaje na podłodze — poczujesz rozciąganie niżej w łydce. — ACE: [Standing Dorsi-Flexion (Calf Stretch) (#152)](https://www.acefitness.org/resources/everyone/exercise-library/152/) (Step 4: lekko ugnij tylne kolano, pięta wciśnięta w podłogę); Shropshire Community Health NHS Trust: [Calf Stretching Information Leaflet](https://www.shropscommunityhealth.nhs.uk/content/doclib/13861.pdf) (s. 1, How to Stretch: kolana ugięte — rozciąganie w dolnej części łydki (płaszczkowaty)) `mobility_stand.s.soleusMove`

**Czego unikać**

- Odrywanie tylnej pięty od podłogi. — Shropshire Community Health NHS Trust: [Calf Stretching Information Leaflet](https://www.shropscommunityhealth.nhs.uk/content/doclib/13861.pdf) (s. 1: „Do not lift the heels…” (w opisie wersji z ugiętymi kolanami)); ACE: [Standing Dorsi-Flexion (Calf Stretch) (#152)](https://www.acefitness.org/resources/everyone/exercise-library/152/) (Step 3–4: pięta w kontakcie z podłogą) `mobility_stand.s.mis.heelUp`

### Cross-Body Shoulder Stretch

**Ustawienie**

- Unieś rękę do wysokości barku i przełóż ją przed klatką na drugą stronę. — Cancer Council Victoria: [Flexibility exercises](https://www.cancervic.org.au/get-support/guides/managing-daily-life/exercise/flexibility-exercises) (Shoulder stretch: ręka na wysokość barku, przeciągnięta przed klatką); WebMD Ignite: [Shoulder stretch (posterior)](https://www.columbiadoctors.org/health-library/multimedia/shoulder-stretch-posterior/) („…pull your affected arm gently up and across your body.”) `mobility_stand.s.xbodySet`

**Ruch**

- Drugą ręką złap za łokieć i delikatnie dociągnij rękę do klatki. — WebMD Ignite: [Shoulder stretch (posterior)](https://www.columbiadoctors.org/health-library/multimedia/shoulder-stretch-posterior/) („Hold the elbow of your affected arm with your other hand.”); Cancer Council Victoria: [Flexibility exercises](https://www.cancervic.org.au/get-support/guides/managing-daily-life/exercise/flexibility-exercises) (Shoulder stretch: delikatnie przeciągnij przez klatkę, podtrzymując drugą ręką) `mobility_stand.s.xbodyMove`

**Wskazówki**

- Bark luźno — nie podciągaj go do ucha. — Cancer Council Victoria: [Flexibility exercises](https://www.cancervic.org.au/get-support/guides/managing-daily-life/exercise/flexibility-exercises) (Shoulder stretch: bark rozluźniony, nie unosi się do ucha); WebMD Ignite: [Shoulder stretch (posterior)](https://www.columbiadoctors.org/health-library/multimedia/shoulder-stretch-posterior/) („Relax your shoulders.”) `mobility_stand.s.shoulderLoose`

### Overhead Triceps Stretch

**Ustawienie**

- Unieś rękę, ugnij ją w łokciu i opuść dłoń na środek pleców. — ACE: [Overhead Triceps Stretch (#174)](https://www.acefitness.org/resources/everyone/exercise-library/174/) (Step 1: ręka w górę, zgięcie w łokciu, dłoń na środek pleców); Cancer Council Victoria: [Flexibility exercises](https://www.cancervic.org.au/get-support/guides/managing-daily-life/exercise/flexibility-exercises) (Triceps stretch: zgięty łokieć, przedramię opuszczone wzdłuż pleców) `mobility_stand.s.triSet`

**Ruch**

- Drugą ręką lekko dociśnij łokieć, aż poczujesz rozciąganie z tyłu ramienia. — ACE: [Overhead Triceps Stretch (#174)](https://www.acefitness.org/resources/everyone/exercise-library/174/) (Step 1: palce drugiej ręki nad łokciem, „applying light pressure to deepen the stretch.”); Cancer Council Victoria: [Flexibility exercises](https://www.cancervic.org.au/get-support/guides/managing-daily-life/exercise/flexibility-exercises) (Triceps stretch: drugą ręką delikatnie dociśnij łokieć w dół) `mobility_stand.s.triMove`

**Wskazówki**

- Trzymaj spokojnie, bez sprężynowania. — Cancer Council Victoria: [Flexibility exercises](https://www.cancervic.org.au/get-support/guides/managing-daily-life/exercise/flexibility-exercises) (zasady ogólne (obejmują Triceps stretch)); Duke University Health System, Occupational and Environmental Safety Office: [Stretches (handout, 2011)](https://www.safety.duke.edu/sites/default/files/Stretches.pdf) (s. 2, Back Scratcher (ręce nad głową, łokieć dociągany drugą ręką) + stopka „not bouncy”) `st.noBounce`

**Czego unikać**

- Wciskanie się w rozciąganie na siłę. — Cancer Council Victoria: [Flexibility exercises](https://www.cancervic.org.au/get-support/guides/managing-daily-life/exercise/flexibility-exercises) (zasady ogólne); Duke University Health System, Occupational and Environmental Safety Office: [Stretches (handout, 2011)](https://www.safety.duke.edu/sites/default/files/Stretches.pdf) (s. 2, stopka (Back Scratcher)) `st.mis.force`

### Side Neck Stretch

**Ustawienie**

- Stań prosto, barki opuszczone. — ACE: [Lateral Neck Flexion (#202)](https://www.acefitness.org/resources/everyone/exercise-library/202/lateral-neck-flexion/) (Step 1: stań, łopatki w dół i do tyłu); NHS (nhs.uk): [Flexibility exercises](https://www.nhs.uk/live-well/exercise/flexibility-exercises/) (Neck stretch: siedź prosto, bark przytrzymany w dole (wariant: siedząc)) `mobility_stand.s.neckSet`

**Ruch**

- Powoli przechyl głowę, ucho w stronę barku, aż poczujesz rozciąganie z boku szyi. — ACE: [Lateral Neck Flexion (#202)](https://www.acefitness.org/resources/everyone/exercise-library/202/lateral-neck-flexion/) (Step 2: powoli ucho do barku, „when you feel the stretch” zatrzymaj); Wrightington, Wigan and Leigh Teaching Hospitals NHS FT: [Neck and Upper Back Exercises Level 1 (Tpy 023, v2)](https://www.wwl.nhs.uk/pdfreader/accessiblePDF/cnv-wwl-68ca8bce9edd73.73954624) (s. 6, ćw. 2 Side Flexions: „Tilt your head toward one shoulder until you feel the stretch on the opposite side.”); NHS (nhs.uk): [Flexibility exercises](https://www.nhs.uk/live-well/exercise/flexibility-exercises/) (Neck stretch: „Slowly tilt your head to the right…”) `mobility_stand.s.neckSideMove`

**Wskazówki**

- Barki trzymaj nisko — nie unoś ich do uszu. — ACE: [Lateral Neck Flexion (#202)](https://www.acefitness.org/resources/everyone/exercise-library/202/lateral-neck-flexion/) (Step 2: „Keep your shoulders down and back” (parafraza)); NHS (nhs.uk): [Flexibility exercises](https://www.nhs.uk/live-well/exercise/flexibility-exercises/) (Neck stretch: bark przytrzymany w dole drugą ręką) `mobility_stand.s.neckShouldersDown`

### Chest And Front Of Shoulder Stretch

**Ustawienie**

- Stań prosto i spleć dłonie za plecami. — ACE: [Standing Chest Stretch (#209)](https://www.acefitness.org/resources/everyone/exercise-library/209/) (Step 1 (stań prosto) i Step 3: „extend your arms behind your back, clasping your hands together”); MedlinePlus: [Chest stretch (Medical Encyclopedia image page)](https://medlineplus.gov/ency/imagepages/19483.htm) („Clasp your hands behind your back with your palms facing up.”) `mobility_stand.s.claspSet`

**Ruch**

- Ściągnij łopatki i lekko unieś klatkę — poczujesz rozciąganie w klatce i z przodu barków. — ACE: [Standing Chest Stretch (#209)](https://www.acefitness.org/resources/everyone/exercise-library/209/) (Step 2: łopatki ściągnięte, „slightly lift your chest up and out”; Step 3: wariant rozciąga przednią część barku); MedlinePlus: [Chest stretch (Medical Encyclopedia image page)](https://medlineplus.gov/ency/imagepages/19483.htm) („…press your shoulder blades together. Your chest should stick out.”; rozciąganie w ramionach i klatce) `mobility_stand.s.claspMove`

### Chin To Chest Stretch

**Ustawienie**

- Stań albo usiądź prosto. — WebMD Ignite: [Neck stretch (front)](https://www.columbiadoctors.org/health-library/multimedia/neck-stretch-front/) (krok 1: „Sit up straight in a firm chair, or stand up straight.”); Huntsman Cancer Institute, University of Utah Health: [Neck Exercises (fact sheet, 2022)](https://hci-portal.hci.utah.edu/sites/factsheets/Shared%20Documents/neck-exercises.pdf) („Tilt Head Forward and Backward”, punkt 1: „Sitting or standing…”); ACE: [Neck Flexion and Extension (#204)](https://www.acefitness.org/resources/everyone/exercise-library/204/neck-flexion-and-extension/) (Step 1: stań, stopy na szerokość bioder (tylko wersja stojąca)) `mobility_stand.s.chinSet`

**Ruch**

- Powoli opuść brodę w stronę klatki. — ACE: [Neck Flexion and Extension (#204)](https://www.acefitness.org/resources/everyone/exercise-library/204/neck-flexion-and-extension/) (Step 2: „Slowly drop your chin toward your chest (neck flexion)”); WebMD Ignite: [Neck stretch (front)](https://www.columbiadoctors.org/health-library/multimedia/neck-stretch-front/) (krok 2: „Slowly bend your head forward…”); Huntsman Cancer Institute, University of Utah Health: [Neck Exercises (fact sheet, 2022)](https://hci-portal.hci.utah.edu/sites/factsheets/Shared%20Documents/neck-exercises.pdf) („Tilt Head Forward and Backward”, punkt 1: „…bring your chin to your chest.”) `mobility_stand.s.chinMove`

**Wskazówki**

- Barki zostają w miejscu — rusza się tylko głowa. — ACE: [Neck Flexion and Extension (#204)](https://www.acefitness.org/resources/everyone/exercise-library/204/neck-flexion-and-extension/) (Step 5: „Avoid any movement of the shoulders…”); WebMD Ignite: [Neck stretch (front)](https://www.columbiadoctors.org/health-library/multimedia/neck-stretch-front/) (krok 2: „…without moving your shoulders.”) `mobility_stand.s.chinShouldersStill`

### Arm Circles

**Ustawienie**

- Rozłóż proste ręce na boki, na wysokości barków. — Arthritis Foundation: [Dynamic Warm-Ups (Arthritis at Work)](https://www.arthritis.org/partnership/atwork/at-work-physical-activity/dynamic-warm-ups-for-arthritis-workplace) („2. Arm Circles”); UC Berkeley University Health Services: [Work Warm-Up](https://uhs.berkeley.edu/sites/default/files/wellness-generic_warmupexerciseprogram.pdf) („5 Arm Circles”, punkt 1) `mobility_stand.d.armsT`

**Ruch**

- Krąż rękami — w przód, potem w tył. — Arthritis Foundation: [Dynamic Warm-Ups (Arthritis at Work)](https://www.arthritis.org/partnership/atwork/at-work-physical-activity/dynamic-warm-ups-for-arthritis-workplace) („2. Arm Circles”); UC Berkeley University Health Services: [Work Warm-Up](https://uhs.berkeley.edu/sites/default/files/wellness-generic_warmupexerciseprogram.pdf) („5 Arm Circles”, punkty 2–3); Cleveland Clinic: [Seated Warm-Up/Cool-Down Exercises (Rev. 7/19)](https://my.clevelandclinic.org/-/scassets/files/org/heart/patient-education/hvti-files/seated-warm-up-exercises.pdf) (s. 2, „Arm Circles” (wariant: siedząc)) `mobility_stand.d.armCircles`

**Wskazówki**

- Ruszaj się płynnie, a zakres zwiększaj stopniowo. — UC Berkeley University Health Services: [Work Warm-Up](https://uhs.berkeley.edu/sites/default/files/wellness-generic_warmupexerciseprogram.pdf) („5 Arm Circles”, punkt 2 (beginning small and increasing size)); Arthritis Foundation: [Dynamic Warm-Ups (Arthritis at Work)](https://www.arthritis.org/partnership/atwork/at-work-physical-activity/dynamic-warm-ups-for-arthritis-workplace) („2. Arm Circles” (gradually increasing their size)); Cleveland Clinic: [Seated Warm-Up/Cool-Down Exercises (Rev. 7/19)](https://my.clevelandclinic.org/-/scassets/files/org/heart/patient-education/hvti-files/seated-warm-up-exercises.pdf) (s. 1, „Exercise Tips” (smooth and slow; wariant: siedząc)) `dyn.control`

### Ankle Circles

**Ustawienie**

- Unieś jedną stopę lekko nad podłogę. — UC Berkeley University Health Services: [Work Warm-Up](https://uhs.berkeley.edu/sites/default/files/wellness-generic_warmupexerciseprogram.pdf) („12 Ankle Circles”, punkty 1–2); WebMD Ignite: [Ankle Circles (akt. 01.05.2026)](https://www.columbiadoctors.org/health-library/multimedia/ankle-circles/) (kroki 2 (wariant: siedząc)) `mobility_stand.d.footUp`

**Ruch**

- Krąż stopą — w jedną, potem w drugą stronę. — UC Berkeley University Health Services: [Work Warm-Up](https://uhs.berkeley.edu/sites/default/files/wellness-generic_warmupexerciseprogram.pdf) („12 Ankle Circles”, punkty 3–4); WebMD Ignite: [Ankle Circles (akt. 01.05.2026)](https://www.columbiadoctors.org/health-library/multimedia/ankle-circles/) (krok 3 (wariant: siedząc)) `mobility_stand.d.ankleCircles`

### Wrist Circles

**Ustawienie**

- Zwiń dłonie w luźne pięści. — UC Berkeley University Health Services: [Work Warm-Up](https://uhs.berkeley.edu/sites/default/files/wellness-generic_warmupexerciseprogram.pdf) („7 Wrist Circles”, punkt 1 (hands loosely closed)); WebMD Ignite: [Wrist Circles (Fist) (akt. 01.05.2026)](https://www.columbiadoctors.org/health-library/multimedia/wrist-circles-fist/) (krok 1 (very light fist; wariant: siedząc, przedramię na udzie)) `mobility_stand.u.looseFist`

**Ruch**

- Krąż nadgarstkami. — UC Berkeley University Health Services: [Work Warm-Up](https://uhs.berkeley.edu/sites/default/files/wellness-generic_warmupexerciseprogram.pdf) („7 Wrist Circles”, punkty 2–3); WebMD Ignite: [Wrist Circles (Fist) (akt. 01.05.2026)](https://www.columbiadoctors.org/health-library/multimedia/wrist-circles-fist/) (krok 2 (make slow circles with your hand; wariant: siedząc)) `mobility_stand.u.wristCircles`

### One-Arm Lateral Raise (hantel)

**Ustawienie**

- Stań prosto z hantlem w jednej ręce przy udzie, łokieć prosty lub lekko ugięty. — HSS: [Shoulder strengthening program](https://www.hss.edu/globalassets/physician-files/sutton/shoulder-strengthening-program.pdf) (s. 1, Lateral Raises (też: arm at your side with the elbow straight; until the hands reach shoulder level; slowly lower)); ACE: [Lateral Raise (#26)](https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/) (Step 3 (Step 1: elbows extended or slight bend; Step 3: level with shoulders)); ACE: [Single Arm Lateral Raise (#354)](https://www.acefitness.org/resources/everyone/exercise-library/354/single-arm-lateral-raise/) (opis (wariant: wyciąg); ta sama org. co ace-26); Catalyst Athletics: [Dumbbell Front Side Raise (#822)](https://catalystathletics.com/exercise/822/Dumbbell-Front-Side-Raise/) (opis — tylko drugie źródło błędu (błąd = zaprzeczenie standardu)) [uproszczenie: ACE opisuje wersję obiema rękami (26) i na wyciągu (354); ten sam ruch stawów, zmienia się liczba rąk i sprzęt] `lat1.setup`

**Ruch**

- Unieś rękę bokiem mniej więcej do wysokości barku, potem opuść ją powoli. — HSS: [Shoulder strengthening program](https://www.hss.edu/globalassets/physician-files/sutton/shoulder-strengthening-program.pdf) (s. 1, Lateral Raises (też: arm at your side with the elbow straight; until the hands reach shoulder level; slowly lower)); ACE: [Lateral Raise (#26)](https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/) (Step 3 (Step 1: elbows extended or slight bend; Step 3: level with shoulders)); ACE: [Single Arm Lateral Raise (#354)](https://www.acefitness.org/resources/everyone/exercise-library/354/single-arm-lateral-raise/) (opis (wariant: wyciąg); ta sama org. co ace-26); Catalyst Athletics: [Dumbbell Front Side Raise (#822)](https://catalystathletics.com/exercise/822/Dumbbell-Front-Side-Raise/) (opis — tylko drugie źródło błędu (błąd = zaprzeczenie standardu)) [uproszczenie: ACE opisuje wersję obiema rękami (26) i na wyciągu (354); ten sam ruch stawów, zmienia się liczba rąk i sprzęt] `lat1.move`

**Wskazówki**

- Kąt w łokciach stały przez cały ruch. — HSS: [Shoulder strengthening program](https://www.hss.edu/globalassets/physician-files/sutton/shoulder-strengthening-program.pdf) (s. 1, Lateral Raises (też: arm at your side with the elbow straight; until the hands reach shoulder level; slowly lower)); ACE: [Lateral Raise (#26)](https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/) (Step 3 (Step 1: elbows extended or slight bend; Step 3: level with shoulders)); ACE: [Single Arm Lateral Raise (#354)](https://www.acefitness.org/resources/everyone/exercise-library/354/single-arm-lateral-raise/) (opis (wariant: wyciąg); ta sama org. co ace-26); Catalyst Athletics: [Dumbbell Front Side Raise (#822)](https://catalystathletics.com/exercise/822/Dumbbell-Front-Side-Raise/) (opis — tylko drugie źródło błędu (błąd = zaprzeczenie standardu)) `rear.elbows`
- Unoś mniej więcej do wysokości barków. — HSS: [Shoulder strengthening program](https://www.hss.edu/globalassets/physician-files/sutton/shoulder-strengthening-program.pdf) (s. 1, Lateral Raises (też: arm at your side with the elbow straight; until the hands reach shoulder level; slowly lower)); ACE: [Lateral Raise (#26)](https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/) (Step 3 (Step 1: elbows extended or slight bend; Step 3: level with shoulders)); ACE: [Single Arm Lateral Raise (#354)](https://www.acefitness.org/resources/everyone/exercise-library/354/single-arm-lateral-raise/) (opis (wariant: wyciąg); ta sama org. co ace-26); Catalyst Athletics: [Dumbbell Front Side Raise (#822)](https://catalystathletics.com/exercise/822/Dumbbell-Front-Side-Raise/) (opis — tylko drugie źródło błędu (błąd = zaprzeczenie standardu)) `lat.height`

**Czego unikać**

- Odchylanie się w tył i wyginanie lędźwi przy unoszeniu. — ACE: [Lateral Raise (#26)](https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/) (Step 3 (Step 1: elbows extended or slight bend; Step 3: level with shoulders)); Catalyst Athletics: [Dumbbell Front Side Raise (#822)](https://catalystathletics.com/exercise/822/Dumbbell-Front-Side-Raise/) (opis — tylko drugie źródło błędu (błąd = zaprzeczenie standardu)) `delt1.mis.arch`

### Dumbbell Scaption

**Ustawienie**

- Stań prosto, hantle w dłoniach, ręce proste. — HSS: [Shoulder strengthening program](https://www.hss.edu/globalassets/physician-files/sutton/shoulder-strengthening-program.pdf) (s. 1, Standing forward flexion (‘full-can’)); ACE: [A pro s guide to muscle mechanics the shoulders](https://www.acefitness.org/continuing-education/certified/september-2025/8951/a-pro-s-guide-to-muscle-mechanics-the-shoulders/) (tabela ćwiczeń, Dumbbell V-Raise (P. McCall, MS, CSCS; IX 2025) — cytat z odczytu narzędzia, sprawdzić przy rehash) `scap.setup`

**Ruch**

- Unieś ręce w przód i lekko na zewnątrz do wysokości barków, potem je opuść. — HSS: [Shoulder strengthening program](https://www.hss.edu/globalassets/physician-files/sutton/shoulder-strengthening-program.pdf) (s. 1, Standing forward flexion (‘full-can’)); ACE: [A pro s guide to muscle mechanics the shoulders](https://www.acefitness.org/continuing-education/certified/september-2025/8951/a-pro-s-guide-to-muscle-mechanics-the-shoulders/) (tabela ćwiczeń, Dumbbell V-Raise (P. McCall, MS, CSCS; IX 2025) — cytat z odczytu narzędzia, sprawdzić przy rehash) `scap.move`

**Wskazówki**

- Ręce proste przez cały ruch — nie zginaj łokci. — HSS: [Shoulder strengthening program](https://www.hss.edu/globalassets/physician-files/sutton/shoulder-strengthening-program.pdf) (s. 1, Standing forward flexion (‘full-can’)); ACE: [A pro s guide to muscle mechanics the shoulders](https://www.acefitness.org/continuing-education/certified/september-2025/8951/a-pro-s-guide-to-muscle-mechanics-the-shoulders/) (tabela ćwiczeń, Dumbbell V-Raise (P. McCall, MS, CSCS; IX 2025) — cytat z odczytu narzędzia, sprawdzić przy rehash) `sapd.arms`
- Unoś mniej więcej do wysokości barków. — HSS: [Shoulder strengthening program](https://www.hss.edu/globalassets/physician-files/sutton/shoulder-strengthening-program.pdf) (s. 1, Standing forward flexion (‘full-can’)); ACE: [A pro s guide to muscle mechanics the shoulders](https://www.acefitness.org/continuing-education/certified/september-2025/8951/a-pro-s-guide-to-muscle-mechanics-the-shoulders/) (tabela ćwiczeń, Dumbbell V-Raise (P. McCall, MS, CSCS; IX 2025) — cytat z odczytu narzędzia, sprawdzić przy rehash) `lat.height`

### Alternating Deltoid Raise

**Ustawienie**

- Stań z hantlami przed udami, łokcie proste lub lekko ugięte. — ACE: [Front Raise (#54)](https://www.acefitness.org/resources/everyone/exercise-library/54/front-raise/) (Steps 1, 3, 4); Catalyst Athletics: [Dumbbell Front Side Raise (#822)](https://catalystathletics.com/exercise/822/Dumbbell-Front-Side-Raise/) (opis); ACE: [Lateral Raise (#26)](https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/) (Step 3 (składowa: bokiem); ta sama org. co ACE 54) `front.setup`

**Ruch**

- Na zmianę: jedno powtórzenie unieś oba hantle przed sobą, następne — bokiem. — Catalyst Athletics: [Dumbbell Front Side Raise (#822)](https://catalystathletics.com/exercise/822/Dumbbell-Front-Side-Raise/) (opis); free-exercise-db: [Alternating Deltoid Raise](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Alternating_Deltoid_Raise.json) (szczebel 5 — nie liczy się do pary; instructions — naprzemienność) [uproszczenie: naprzemienność (przód, bok) opisują Catalyst (szczebel 4) i jedno źródło szczebla 5; ACE — składowe ruchu osobno] `adr.move`

**Wskazówki**

- Łokcie proste lub lekko ugięte — w tym samym ustawieniu przez cały ruch. — ACE: [Front Raise (#54)](https://www.acefitness.org/resources/everyone/exercise-library/54/front-raise/) (Steps 1, 3, 4); Catalyst Athletics: [Dumbbell Front Side Raise (#822)](https://catalystathletics.com/exercise/822/Dumbbell-Front-Side-Raise/) (opis); ACE: [Lateral Raise (#26)](https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/) (Step 3 (składowa: bokiem); ta sama org. co ACE 54) `front.elbows`
- Unoś mniej więcej do wysokości barków. — ACE: [Front Raise (#54)](https://www.acefitness.org/resources/everyone/exercise-library/54/front-raise/) (Steps 1, 3, 4); Catalyst Athletics: [Dumbbell Front Side Raise (#822)](https://catalystathletics.com/exercise/822/Dumbbell-Front-Side-Raise/) (opis); ACE: [Lateral Raise (#26)](https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/) (Step 3 (składowa: bokiem); ta sama org. co ACE 54) `lat.height`

**Czego unikać**

- Odchylanie się w tył i wyginanie lędźwi przy unoszeniu. — ACE: [Front Raise (#54)](https://www.acefitness.org/resources/everyone/exercise-library/54/front-raise/) (Steps 1, 3, 4); Catalyst Athletics: [Dumbbell Front Side Raise (#822)](https://catalystathletics.com/exercise/822/Dumbbell-Front-Side-Raise/) (opis) `delt1.mis.arch`

### Front Plate Raise

**Ustawienie**

- Stań prosto i trzymaj ciężar oburącz przed sobą na opuszczonych rękach, łokcie proste lub lekko ugięte. — Catalyst Athletics: [Barbell Front Raise (#803)](https://catalystathletics.com/exercise/803/Barbell-Front-Raise/) (opis); ACE: [Front Raise (#54)](https://www.acefitness.org/resources/everyone/exercise-library/54/front-raise/) (Steps 1, 3, 4) [uproszczenie: wariant sprzętu: źródła opisują sztangę (Catalyst 803) i hantle (ACE 54); ten sam ruch stawów, zmienia się przyrząd (talerz)] `front2.setup`

**Ruch**

- Unieś ręce przed sobą, potem opuść je powoli. — Catalyst Athletics: [Barbell Front Raise (#803)](https://catalystathletics.com/exercise/803/Barbell-Front-Raise/) (opis); ACE: [Front Raise (#54)](https://www.acefitness.org/resources/everyone/exercise-library/54/front-raise/) (Steps 1, 3, 4) [uproszczenie: wariant sprzętu: źródła opisują sztangę (Catalyst 803) i hantle (ACE 54); ten sam ruch stawów, zmienia się przyrząd (talerz)] `front.move`

**Wskazówki**

- Łokcie proste lub lekko ugięte — w tym samym ustawieniu przez cały ruch. — Catalyst Athletics: [Barbell Front Raise (#803)](https://catalystathletics.com/exercise/803/Barbell-Front-Raise/) (opis); ACE: [Front Raise (#54)](https://www.acefitness.org/resources/everyone/exercise-library/54/front-raise/) (Steps 1, 3, 4) `front.elbows`
- Unoś mniej więcej do wysokości barków. — Catalyst Athletics: [Barbell Front Raise (#803)](https://catalystathletics.com/exercise/803/Barbell-Front-Raise/) (opis); ACE: [Front Raise (#54)](https://www.acefitness.org/resources/everyone/exercise-library/54/front-raise/) (Steps 1, 3, 4) `lat.height`

**Czego unikać**

- Odchylanie się w tył i wyginanie lędźwi przy unoszeniu. — Catalyst Athletics: [Barbell Front Raise (#803)](https://catalystathletics.com/exercise/803/Barbell-Front-Raise/) (opis); ACE: [Front Raise (#54)](https://www.acefitness.org/resources/everyone/exercise-library/54/front-raise/) (Steps 1, 3, 4) `delt1.mis.arch`

### Single Dumbbell Front Raise

**Ustawienie**

- Stań prosto i trzymaj ciężar oburącz przed sobą na opuszczonych rękach, łokcie proste lub lekko ugięte. — Catalyst Athletics: [Barbell Front Raise (#803)](https://catalystathletics.com/exercise/803/Barbell-Front-Raise/) (opis); ACE: [Front Raise (#54)](https://www.acefitness.org/resources/everyone/exercise-library/54/front-raise/) (Steps 1, 3, 4) [uproszczenie: wariant sprzętu: źródła opisują sztangę (Catalyst 803) i hantle (ACE 54); ten sam ruch stawów, pojedynczy hantel trzymany oburącz] `front2.setup`

**Ruch**

- Unieś ręce przed sobą, potem opuść je powoli. — Catalyst Athletics: [Barbell Front Raise (#803)](https://catalystathletics.com/exercise/803/Barbell-Front-Raise/) (opis); ACE: [Front Raise (#54)](https://www.acefitness.org/resources/everyone/exercise-library/54/front-raise/) (Steps 1, 3, 4) [uproszczenie: wariant sprzętu: źródła opisują sztangę (Catalyst 803) i hantle (ACE 54); ten sam ruch stawów, pojedynczy hantel trzymany oburącz] `front.move`

**Wskazówki**

- Łokcie proste lub lekko ugięte — w tym samym ustawieniu przez cały ruch. — Catalyst Athletics: [Barbell Front Raise (#803)](https://catalystathletics.com/exercise/803/Barbell-Front-Raise/) (opis); ACE: [Front Raise (#54)](https://www.acefitness.org/resources/everyone/exercise-library/54/front-raise/) (Steps 1, 3, 4) `front.elbows`
- Unoś mniej więcej do wysokości barków. — Catalyst Athletics: [Barbell Front Raise (#803)](https://catalystathletics.com/exercise/803/Barbell-Front-Raise/) (opis); ACE: [Front Raise (#54)](https://www.acefitness.org/resources/everyone/exercise-library/54/front-raise/) (Steps 1, 3, 4) `lat.height`

**Czego unikać**

- Odchylanie się w tył i wyginanie lędźwi przy unoszeniu. — Catalyst Athletics: [Barbell Front Raise (#803)](https://catalystathletics.com/exercise/803/Barbell-Front-Raise/) (opis); ACE: [Front Raise (#54)](https://www.acefitness.org/resources/everyone/exercise-library/54/front-raise/) (Steps 1, 3, 4) `delt1.mis.arch`

### Cable Front Raise

**Ustawienie**

- Chwyć uchwyt dolnego wyciągu i stań prosto — uchwyt przed udami, ręce opuszczone. — Catalyst Athletics: [Cable Front Raise (#812)](https://catalystathletics.com/exercise/812/Cable-Front-Raise/) (opis); ACE: [Front Raise (#54)](https://www.acefitness.org/resources/everyone/exercise-library/54/front-raise/) (Steps 1, 3, 4) [uproszczenie: ustawienie przy wyciągu opisuje wprost tylko Catalyst 812; ACE 54 opisuje hantle (ten sam ruch stawów)] `cfr.setup`

**Ruch**

- Unieś ręce przed sobą, potem opuść je powoli. — Catalyst Athletics: [Cable Front Raise (#812)](https://catalystathletics.com/exercise/812/Cable-Front-Raise/) (opis); ACE: [Front Raise (#54)](https://www.acefitness.org/resources/everyone/exercise-library/54/front-raise/) (Steps 1, 3, 4) `front.move`

**Wskazówki**

- Łokcie proste lub lekko ugięte — w tym samym ustawieniu przez cały ruch. — Catalyst Athletics: [Cable Front Raise (#812)](https://catalystathletics.com/exercise/812/Cable-Front-Raise/) (opis); ACE: [Front Raise (#54)](https://www.acefitness.org/resources/everyone/exercise-library/54/front-raise/) (Steps 1, 3, 4) `front.elbows`
- Unoś mniej więcej do wysokości barków. — Catalyst Athletics: [Cable Front Raise (#812)](https://catalystathletics.com/exercise/812/Cable-Front-Raise/) (opis); ACE: [Front Raise (#54)](https://www.acefitness.org/resources/everyone/exercise-library/54/front-raise/) (Steps 1, 3, 4) `lat.height`

**Czego unikać**

- Odchylanie się w tył i wyginanie lędźwi przy unoszeniu. — Catalyst Athletics: [Cable Front Raise (#812)](https://catalystathletics.com/exercise/812/Cable-Front-Raise/) (opis); ACE: [Front Raise (#54)](https://www.acefitness.org/resources/everyone/exercise-library/54/front-raise/) (Steps 1, 3, 4) `delt1.mis.arch`

### Dumbbell Lying One-Arm Rear Lateral Raise

**Ustawienie**

- Połóż się przodem na ławce; ręka z hantlem zwisa swobodnie w dół. — HSS: [Shoulder strengthening program](https://www.hss.edu/globalassets/physician-files/sutton/shoulder-strengthening-program.pdf) (s. 3, Prone horizontal abduction (‘T’s’)); Tomah Memorial Hospital: [Prone shoulder horizontal abduction](https://www.msdmanuals.com/professional/multimedia/video/prone-shoulder-horizontal-abduction) (instrukcja (Courtesy of Tomah Memorial Hospital, Dept. of Physical Therapy)) `rear1.setup`

**Ruch**

- Unieś rękę bokiem do wysokości barku, prostopadle do tułowia; opuść ją powoli. — HSS: [Shoulder strengthening program](https://www.hss.edu/globalassets/physician-files/sutton/shoulder-strengthening-program.pdf) (s. 3, Prone horizontal abduction (‘T’s’)); Tomah Memorial Hospital: [Prone shoulder horizontal abduction](https://www.msdmanuals.com/professional/multimedia/video/prone-shoulder-horizontal-abduction) (instrukcja (Courtesy of Tomah Memorial Hospital, Dept. of Physical Therapy)); ACE: [Incline Reverse Fly (#34)](https://www.acefitness.org/resources/everyone/exercise-library/34/incline-reverse-fly/) (Steps 1–3 (wariant: dwie ręce, siad przodem do oparcia — NIE dla ustawienia)) [uproszczenie: ACE 34 opisuje wersję obiema rękami (siad przodem do oparcia) — tylko dla ruchu i wskazówek] `rear1.move`

**Wskazówki**

- Kąt w łokciach stały przez cały ruch. — HSS: [Shoulder strengthening program](https://www.hss.edu/globalassets/physician-files/sutton/shoulder-strengthening-program.pdf) (s. 3, Prone horizontal abduction (‘T’s’)); Tomah Memorial Hospital: [Prone shoulder horizontal abduction](https://www.msdmanuals.com/professional/multimedia/video/prone-shoulder-horizontal-abduction) (instrukcja (Courtesy of Tomah Memorial Hospital, Dept. of Physical Therapy)); ACE: [Incline Reverse Fly (#34)](https://www.acefitness.org/resources/everyone/exercise-library/34/incline-reverse-fly/) (Steps 1–3 (wariant: dwie ręce, siad przodem do oparcia — NIE dla ustawienia)) `rear.elbows`
- Ramiona idą w bok, nie w tył — dłonie kończą ruch mniej więcej na linii barków. — HSS: [Shoulder strengthening program](https://www.hss.edu/globalassets/physician-files/sutton/shoulder-strengthening-program.pdf) (s. 3, Prone horizontal abduction (‘T’s’)); Tomah Memorial Hospital: [Prone shoulder horizontal abduction](https://www.msdmanuals.com/professional/multimedia/video/prone-shoulder-horizontal-abduction) (instrukcja (Courtesy of Tomah Memorial Hospital, Dept. of Physical Therapy)); ACE: [Incline Reverse Fly (#34)](https://www.acefitness.org/resources/everyone/exercise-library/34/incline-reverse-fly/) (Steps 1–3 (wariant: dwie ręce, siad przodem do oparcia — NIE dla ustawienia)) `rear.arms`

**Czego unikać**

- Unoszenie ręki wyżej niż bark. — HSS: [Shoulder strengthening program](https://www.hss.edu/globalassets/physician-files/sutton/shoulder-strengthening-program.pdf) (s. 3, Prone horizontal abduction (‘T’s’)); Tomah Memorial Hospital: [Prone shoulder horizontal abduction](https://www.msdmanuals.com/professional/multimedia/video/prone-shoulder-horizontal-abduction) (instrukcja (Courtesy of Tomah Memorial Hospital, Dept. of Physical Therapy)) `rear1.mis.high`

### Upright Row (sztanga)

**Ustawienie**

- Stań prosto, ciężar trzymaj przed udami na wyprostowanych rękach, dłonie zwrócone do ciała. — ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (How to (By ISSA, 05.02.2024); też „make sure each elbow stays above the forearm”); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (opuszczanie pod kontrolą)) `urow.setup`

**Ruch**

- Unoś ciężar blisko ciała w stronę obojczyków, potem opuść go powoli do wyprostu rąk. — ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (How to (By ISSA, 05.02.2024); też „make sure each elbow stays above the forearm”); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (opuszczanie pod kontrolą)) `urow.move`

**Wskazówki**

- Łokcie prowadzą ruch i są wyżej niż dłonie. — ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (How to (By ISSA, 05.02.2024); też „make sure each elbow stays above the forearm”); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (opuszczanie pod kontrolą)) `ur.elbows`
- Unoś ciężar blisko ciała mniej więcej do wysokości barków, łokcie prowadzą. — ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (How to (By ISSA, 05.02.2024): „Stop when the barbell reaches shoulder height”; też „make sure each elbow stays above the forearm”); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (łokcie jak najwyżej; opuszczanie pod kontrolą)) `urow.height`

### Upright Row (hantle)

**Ustawienie**

- Stań prosto, ciężar trzymaj przed udami na wyprostowanych rękach, dłonie zwrócone do ciała. — ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (How to); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (opuszczanie pod kontrolą)) [uproszczenie: wariant sprzętu: źródła opisują sztangę; ten sam ruch stawów, zmienia się przyrząd (hantle)] `urow.setup`

**Ruch**

- Unoś ciężar blisko ciała w stronę obojczyków, potem opuść go powoli do wyprostu rąk. — ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (How to); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (opuszczanie pod kontrolą)) [uproszczenie: wariant sprzętu: źródła opisują sztangę; ten sam ruch stawów, zmienia się przyrząd (hantle)] `urow.move`

**Wskazówki**

- Łokcie prowadzą ruch i są wyżej niż dłonie. — ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (How to); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (opuszczanie pod kontrolą)) `ur.elbows`
- Unoś ciężar blisko ciała mniej więcej do wysokości barków, łokcie prowadzą. — ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (How to (By ISSA, 05.02.2024): „Stop when the barbell reaches shoulder height”; też „make sure each elbow stays above the forearm”); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (łokcie jak najwyżej; opuszczanie pod kontrolą)) `urow.height`

### Upright Row (linki)

**Ustawienie**

- Stań prosto, ciężar trzymaj przed udami na wyprostowanych rękach, dłonie zwrócone do ciała. — ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (How to); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (opuszczanie pod kontrolą)) [uproszczenie: wariant sprzętu: źródła opisują sztangę; ten sam ruch stawów, zmienia się przyrząd (linka)] `urow.setup`

**Ruch**

- Unoś ciężar blisko ciała w stronę obojczyków, potem opuść go powoli do wyprostu rąk. — ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (How to); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (opuszczanie pod kontrolą)) [uproszczenie: wariant sprzętu: źródła opisują sztangę; ten sam ruch stawów, zmienia się przyrząd (linka)] `urow.move`

**Wskazówki**

- Łokcie prowadzą ruch i są wyżej niż dłonie. — ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (How to); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (opuszczanie pod kontrolą)) `ur.elbows`
- Unoś ciężar blisko ciała mniej więcej do wysokości barków, łokcie prowadzą. — ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (How to (By ISSA, 05.02.2024): „Stop when the barbell reaches shoulder height”; też „make sure each elbow stays above the forearm”); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (łokcie jak najwyżej; opuszczanie pod kontrolą)) `urow.height`

### Smith Machine Upright Row

**Ustawienie**

- Stań prosto, ciężar trzymaj przed udami na wyprostowanych rękach, dłonie zwrócone do ciała. — ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (Variations); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (opuszczanie pod kontrolą)) [uproszczenie: wariant sprzętu: źródła opisują sztangę; ten sam ruch stawów, zmienia się przyrząd (suwnica; ISSA wymienia ją w „Variations”)] `urow.setup`

**Ruch**

- Unoś ciężar blisko ciała w stronę obojczyków, potem opuść go powoli do wyprostu rąk. — ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (Variations); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (opuszczanie pod kontrolą)) [uproszczenie: wariant sprzętu: źródła opisują sztangę; ten sam ruch stawów, zmienia się przyrząd (suwnica; ISSA wymienia ją w „Variations”)] `urow.move`

**Wskazówki**

- Łokcie prowadzą ruch i są wyżej niż dłonie. — ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (Variations); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (opuszczanie pod kontrolą)) `ur.elbows`
- Unoś ciężar blisko ciała mniej więcej do wysokości barków, łokcie prowadzą. — ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (How to (By ISSA, 05.02.2024): „Stop when the barbell reaches shoulder height”; też „make sure each elbow stays above the forearm”); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (łokcie jak najwyżej; opuszczanie pod kontrolą)) `urow.height`

### Dumbbell One-Arm Upright Row

**Ustawienie**

- Stań prosto, ciężar trzymaj jedną ręką przed udem, ręka wyprostowana, dłoń zwrócona do ciała. — ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (How to); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (opuszczanie pod kontrolą)) [uproszczenie: wariant sprzętu: źródła opisują sztangę; ten sam ruch stawów, zmienia się przyrząd (hantel) i liczba rąk] `urow1.setup`

**Ruch**

- Unoś ciężar blisko ciała w stronę obojczyka, potem opuść go powoli do wyprostu ręki. — ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (How to); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (opuszczanie pod kontrolą)) [uproszczenie: wariant sprzętu: źródła opisują sztangę; ten sam ruch stawów, zmienia się przyrząd (hantel) i liczba rąk] `urow1.move`

**Wskazówki**

- Łokcie prowadzą ruch i są wyżej niż dłonie. — ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (How to); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (opuszczanie pod kontrolą)) `ur.elbows`
- Unoś ciężar blisko ciała mniej więcej do wysokości barków, łokcie prowadzą. — ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (How to (By ISSA, 05.02.2024): „Stop when the barbell reaches shoulder height”; też „make sure each elbow stays above the forearm”); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (łokcie jak najwyżej; opuszczanie pod kontrolą)) `urow.height`

### Smith Machine One-Arm Upright Row

**Ustawienie**

- Stań prosto, ciężar trzymaj jedną ręką przed udem, ręka wyprostowana, dłoń zwrócona do ciała. — ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (How to; Variations (Smith)); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (opuszczanie pod kontrolą)) [uproszczenie: wariant sprzętu: źródła opisują sztangę; ten sam ruch stawów, zmienia się przyrząd (suwnica) i liczba rąk] `urow1.setup`

**Ruch**

- Unoś ciężar blisko ciała w stronę obojczyka, potem opuść go powoli do wyprostu ręki. — ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (How to; Variations (Smith)); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (opuszczanie pod kontrolą)) [uproszczenie: wariant sprzętu: źródła opisują sztangę; ten sam ruch stawów, zmienia się przyrząd (suwnica) i liczba rąk] `urow1.move`

**Wskazówki**

- Łokcie prowadzą ruch i są wyżej niż dłonie. — ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (How to; Variations (Smith)); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (opuszczanie pod kontrolą)) `ur.elbows`
- Unoś ciężar blisko ciała mniej więcej do wysokości barków, łokcie prowadzą. — ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (How to (By ISSA, 05.02.2024): „Stop when the barbell reaches shoulder height”; też „make sure each elbow stays above the forearm”); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (łokcie jak najwyżej; opuszczanie pod kontrolą)) `urow.height`

### Band Upright Row

**Ustawienie**

- Stań prosto, ciężar trzymaj przed udami na wyprostowanych rękach, dłonie zwrócone do ciała. — Bodylastics: [Upright row](https://www.bodylastics.com/exercises/resistance-bands/shoulders/upright-row) (instrukcja (producent taśm)); ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (How to (By ISSA, 05.02.2024); też „make sure each elbow stays above the forearm”); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (opuszczanie pod kontrolą)) [uproszczenie: wariant sprzętu: źródła opisują sztangę; ten sam ruch stawów, zmienia się przyrząd (taśma; Bodylastics opisuje taśmy)] `urow.setup`

**Ruch**

- Unoś ciężar blisko ciała w stronę obojczyków, potem opuść go powoli do wyprostu rąk. — Bodylastics: [Upright row](https://www.bodylastics.com/exercises/resistance-bands/shoulders/upright-row) (instrukcja (producent taśm)); ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (How to (By ISSA, 05.02.2024); też „make sure each elbow stays above the forearm”); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (opuszczanie pod kontrolą)) [uproszczenie: wariant sprzętu: źródła opisują sztangę; ten sam ruch stawów, zmienia się przyrząd (taśma; Bodylastics opisuje taśmy)] `urow.move`

**Wskazówki**

- Łokcie prowadzą ruch i są wyżej niż dłonie. — Bodylastics: [Upright row](https://www.bodylastics.com/exercises/resistance-bands/shoulders/upright-row) (instrukcja (producent taśm)); ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (How to (By ISSA, 05.02.2024); też „make sure each elbow stays above the forearm”); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (opuszczanie pod kontrolą)) `ur.elbows`
- Unoś ciężar blisko ciała mniej więcej do wysokości barków, łokcie prowadzą. — Bodylastics: [Upright row](https://www.bodylastics.com/exercises/resistance-bands/shoulders/upright-row) (instrukcja (producent taśm): ręce do dolnej części klatki piersiowej); ISSA: [Upright row muscles worked benefits proper form more](https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more) (How to (By ISSA, 05.02.2024): „Stop when the barbell reaches shoulder height”; też „make sure each elbow stays above the forearm”); Catalyst Athletics: [Barbell Upright Row (#805)](https://catalystathletics.com/exercise/805/Barbell-Upright-Row/) (opis (łokcie jak najwyżej; opuszczanie pod kontrolą)) `urow.height`

### Band Lateral Raise

**Ustawienie**

- Stań na taśmie, uchwyty w dłoniach przy udach, łokcie lekko ugięte. — Bodylastics: [Lateral raise with flat bands](https://bodylastics.com/exercise/lateral-raise-with-flat-bands) (Common Mistake (też Body Position: stand on the bands; Movement: until elbows at shoulder height)); ACE: [Lateral Raise (#26)](https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/) (Step 1 (wersja z hantlami)) [uproszczenie: ustawienie „stań na taśmie” opisuje wprost tylko Bodylastics (producent taśm); ACE opisuje wersję z hantlami — ten sam ruch stawów, zmienia się przyrząd (taśma)] `blat.setup`

**Ruch**

- Unieś ramiona bokiem, potem opuść je powoli. — Bodylastics: [Lateral raise with flat bands](https://bodylastics.com/exercise/lateral-raise-with-flat-bands) (Common Mistake (też Body Position: stand on the bands; Movement: until elbows at shoulder height)); ACE: [Lateral Raise (#26)](https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/) (Step 3) [uproszczenie: wariant sprzętu: Bodylastics opisuje taśmy, ACE 26 hantle; ten sam ruch stawów] `lat.move`

**Wskazówki**

- Unoś mniej więcej do wysokości barków. — Bodylastics: [Lateral raise with flat bands](https://bodylastics.com/exercise/lateral-raise-with-flat-bands) (Common Mistake (też Body Position: stand on the bands; Movement: until elbows at shoulder height)); ACE: [Lateral Raise (#26)](https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/) (Step 3) `lat.height`
- Łokcie lekko ugięte i prowadzą ruch — są na wysokości dłoni lub wyżej. — Bodylastics: [Lateral raise with flat bands](https://bodylastics.com/exercise/lateral-raise-with-flat-bands) (Common Mistake (też Body Position: stand on the bands; Movement: until elbows at shoulder height)); ACE: [Lateral Raise (#26)](https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/) (Step 3) `lat.elbows`

**Czego unikać**

- Dłonie wyprzedzają łokcie i idą wyżej od nich. — Bodylastics: [Lateral raise with flat bands](https://bodylastics.com/exercise/lateral-raise-with-flat-bands) (Common Mistake (też Body Position: stand on the bands; Movement: until elbows at shoulder height)); ACE: [Lateral Raise (#26)](https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/) (Step 3) `delt2.handsHigh`
- Odchylanie się w tył i wyginanie lędźwi przy unoszeniu. — Bodylastics: [Lateral raise with flat bands](https://bodylastics.com/exercise/lateral-raise-with-flat-bands) (Common Mistake (też Body Position: stand on the bands; Movement: until elbows at shoulder height)); ACE: [Lateral Raise (#26)](https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/) (Step 3) `delt1.mis.arch`

### Kettlebell Halo

**Ustawienie**

- Stań prosto i trzymaj kettlebell za rogi przed klatką piersiową. — ACE: [Halo (#394)](https://www.acefitness.org/resources/everyone/exercise-library/394/halo/) (opis (też: horns, in front of the chest; reverse direction)); BarBend: [Kettlebell halo](https://barbend.com/kettlebell-halo/) (instrukcja krok po kroku + błędy formy (D. Fraiser, akt. 01.11.2023)) `halo.setup`

**Ruch**

- Prowadź kettlebell wokół głowy: nad jednym barkiem, za głową, nad drugim barkiem i z powrotem przed klatkę. — ACE: [Halo (#394)](https://www.acefitness.org/resources/everyone/exercise-library/394/halo/) (opis (też: horns, in front of the chest; reverse direction)); BarBend: [Kettlebell halo](https://barbend.com/kettlebell-halo/) (instrukcja krok po kroku + błędy formy (D. Fraiser, akt. 01.11.2023)) `halo.move`

**Wskazówki**

- Zrób powtórzenia w jedną stronę, potem tyle samo w drugą. — ACE: [Halo (#394)](https://www.acefitness.org/resources/everyone/exercise-library/394/halo/) (opis (też: horns, in front of the chest; reverse direction)); BarBend: [Kettlebell halo](https://barbend.com/kettlebell-halo/) (instrukcja krok po kroku + błędy formy (D. Fraiser, akt. 01.11.2023)) `halo.dir`
- Plecy proste, tułów nieruchomy przez cały ruch. — ACE: [Halo (#394)](https://www.acefitness.org/resources/everyone/exercise-library/394/halo/) (opis (też: horns, in front of the chest; reverse direction)); BarBend: [Kettlebell halo](https://barbend.com/kettlebell-halo/) (instrukcja krok po kroku + błędy formy (D. Fraiser, akt. 01.11.2023)) `halo.torso`

**Czego unikać**

- Tułów pochyla się albo wygina, kiedy kettlebell idzie za głowę. — ACE: [Halo (#394)](https://www.acefitness.org/resources/everyone/exercise-library/394/halo/) (opis (też: horns, in front of the chest; reverse direction)); BarBend: [Kettlebell halo](https://barbend.com/kettlebell-halo/) (instrukcja krok po kroku + błędy formy (D. Fraiser, akt. 01.11.2023)) `delt2.haloLean`

### One-Arm Cable Rear Lateral Raise

**Ustawienie**

- Stań bokiem do dolnego wyciągu, uchwyt w dalszej ręce; pochyl tułów w przód z prostymi plecami. — Fitness Volt: [Cable rear delt exercises](https://fitnessvolt.com/cable-rear-delt-exercises/) (ćw. 5 Single-arm cable rear delt fly (P. Dale, akt. 07.06.2024)); Atlas ćwiczeń potreningu.pl: [Unoszenie ramion bokiem w opadzie tulowia w bramie](https://potreningu.pl/atlas-cwiczen/dla-kobiet/357/unoszenie-ramion-bokiem-w-opadzie-tulowia-w-bramie) (szczebel 5 — nie liczy się do pary; opis (też „Unikaj bujania tułowiem.”)); ManiacMuscle: [Cable crossover reverse fly](https://maniacmuscle.com/cable-crossover-reverse-fly/) (szczebel 5 — nie liczy się do pary; execution) [uproszczenie: jedna ręka przy wyciągu: Fitness Volt (szczebel 4) opisuje wersję jednorącz, źródła szczebla 5 — linki oburącz i hantle] `crear1.setup`

**Ruch**

- Unieś rękę bokiem szerokim łukiem, łokieć lekko ugięty prowadzi ruch, aż znajdzie się na wysokości barku; opuść powoli. — Fitness Volt: [Cable rear delt exercises](https://fitnessvolt.com/cable-rear-delt-exercises/) (ćw. 5 Single-arm cable rear delt fly (P. Dale, akt. 07.06.2024)); Atlas ćwiczeń potreningu.pl: [Unoszenie ramion bokiem w opadzie tulowia w bramie](https://potreningu.pl/atlas-cwiczen/dla-kobiet/357/unoszenie-ramion-bokiem-w-opadzie-tulowia-w-bramie) (szczebel 5 — nie liczy się do pary; opis (też „Unikaj bujania tułowiem.”)); ManiacMuscle: [Cable crossover reverse fly](https://maniacmuscle.com/cable-crossover-reverse-fly/) (szczebel 5 — nie liczy się do pary; execution) [uproszczenie: jedna ręka przy wyciągu: Fitness Volt (szczebel 4) opisuje wersję jednorącz, źródła szczebla 5 — linki oburącz i hantle] `crear1.move`

**Czego unikać**

- Bujanie tułowiem, żeby unieść ciężar. — Atlas ćwiczeń potreningu.pl: [Unoszenie ramion bokiem w opadzie tulowia w bramie](https://potreningu.pl/atlas-cwiczen/dla-kobiet/357/unoszenie-ramion-bokiem-w-opadzie-tulowia-w-bramie) (szczebel 5 — nie liczy się do pary; opis (też „Unikaj bujania tułowiem.”)); ManiacMuscle: [Cable crossover reverse fly](https://maniacmuscle.com/cable-crossover-reverse-fly/) (szczebel 5 — nie liczy się do pary; execution) `rdelt.mis.swing`

### Cable Reverse Fly

**Ustawienie**

- Stań między dwoma wyciągami i chwyć uchwyty na krzyż: lewą ręką ten z prawej, prawą — ten z lewej. — ACE: [Reverse Fly (#353)](https://www.acefitness.org/resources/everyone/exercise-library/353/reverse-fly/) (Step 1); Atlas ćwiczeń potreningu.pl: [Odwodzenie ramion w tyl na wyciagu gornym stojac](https://potreningu.pl/atlas-cwiczen/dla-mezczyzn/348/odwodzenie-ramion-w-tyl-na-wyciagu-gornym-stojac) (szczebel 5 — nie liczy się do pary; opis); Atlas ćwiczeń Fabryka Siły: [Odwodzenie linek w tyl wyciagu stojac](https://www.fabrykasily.pl/cwiczenia/na-barki/odwodzenie-linek-w-tyl-wyciagu-stojac) (szczebel 5 — nie liczy się do pary; opis (2015-12-22)) `crf.setup`

**Ruch**

- Rozciągnij ręce szeroko na boki, aż utworzą prostą linię, potem wróć do skrzyżowania. — ACE: [Reverse Fly (#353)](https://www.acefitness.org/resources/everyone/exercise-library/353/reverse-fly/) (Step 1); Atlas ćwiczeń potreningu.pl: [Odwodzenie ramion w tyl na wyciagu gornym stojac](https://potreningu.pl/atlas-cwiczen/dla-mezczyzn/348/odwodzenie-ramion-w-tyl-na-wyciagu-gornym-stojac) (szczebel 5 — nie liczy się do pary; opis); Atlas ćwiczeń Fabryka Siły: [Odwodzenie linek w tyl wyciagu stojac](https://www.fabrykasily.pl/cwiczenia/na-barki/odwodzenie-linek-w-tyl-wyciagu-stojac) (szczebel 5 — nie liczy się do pary; opis (2015-12-22)) `crf.move`

### Cable Y Raise

**Ustawienie**

- Stań przodem między dolnymi wyciągami i chwyć uchwyty na krzyż; cofnij się, aż linki się napną. — weighttraining.guide: [Cable y raise](https://weighttraining.guide/exercises/cable-y-raise/) (szczebel 5 — nie liczy się do pary; Starting position 1 (Execution 1: elbows moderately flexed, „forming the letter 'Y'”); autor „Dr SAL”, akt. 05.09.2023); FitVibe: [Cable y raise 668](https://fitvibe.gr/askiseis/cable-y-raise-668) (szczebel 5 — nie liczy się do pary; krok 1 (krok 3: litera Y, łokcie lekko ugięte; krok 4: opuść powoli)) `cyr.setup`

**Ruch**

- Unieś ręce w górę i na boki, łokcie lekko ugięte, aż ułożą się w literę Y; opuść je powoli. — weighttraining.guide: [Cable y raise](https://weighttraining.guide/exercises/cable-y-raise/) (szczebel 5 — nie liczy się do pary; Starting position 1 (Execution 1: elbows moderately flexed, „forming the letter 'Y'”); autor „Dr SAL”, akt. 05.09.2023); FitVibe: [Cable y raise 668](https://fitvibe.gr/askiseis/cable-y-raise-668) (szczebel 5 — nie liczy się do pary; krok 1 (krok 3: litera Y, łokcie lekko ugięte; krok 4: opuść powoli)) `cyr.move`

### One-Arm Incline Lateral Raise

**Ustawienie**

- Połóż się bokiem na ławce skośnej, hantel w górnej ręce. — NFPT: [How to do incline side lateral dumbbell raises](https://nfpt.com/how-to-do-incline-side-lateral-dumbbell-raises/) (Starting Position (Guest — R. Bovee, Certified Master PPT; 11.08.2025); Warning: „Do not shrug your shoulder when raising the dumbbell.”); free-exercise-db: [One Arm Incline Lateral Raise](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Incline_Lateral_Raise.json) (szczebel 5 — nie liczy się do pary; instructions (odczyt etap 2 przez kopię fitzport — kopia fedb = to samo źródło)) `inc1.setup`

**Ruch**

- Unieś rękę bokiem w górę, potem opuść ją powoli. — NFPT: [How to do incline side lateral dumbbell raises](https://nfpt.com/how-to-do-incline-side-lateral-dumbbell-raises/) (Starting Position (Guest — R. Bovee, Certified Master PPT; 11.08.2025); Warning: „Do not shrug your shoulder when raising the dumbbell.”); free-exercise-db: [One Arm Incline Lateral Raise](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Incline_Lateral_Raise.json) (szczebel 5 — nie liczy się do pary; instructions (odczyt etap 2 przez kopię fitzport — kopia fedb = to samo źródło)) `inc1.move`

**Czego unikać**

- Podciąganie barku do ucha przy unoszeniu. — NFPT: [How to do incline side lateral dumbbell raises](https://nfpt.com/how-to-do-incline-side-lateral-dumbbell-raises/) (Starting Position (Guest — R. Bovee, Certified Master PPT; 11.08.2025); Warning: „Do not shrug your shoulder when raising the dumbbell.”) `inc1.mis.shrug`

### Barbell Front Raise to Overhead

**Ustawienie**

- Stań prosto, sztangę trzymaj nachwytem przed udami na opuszczonych rękach. — Fitnall: [Barbell overhead front raise](https://fitnall.com/exercises/barbell-overhead-front-raise/) (szczebel 5 — nie liczy się do pary; How To 3 (5: „raise the barbell until it slightly passes your head”; 6: „avoid locking the elbows”); A. Albritton); free-exercise-db: [Standing Front Barbell Raise Over Head](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Front_Barbell_Raise_Over_Head.json) (szczebel 5 — nie liczy się do pary; instructions 3) `bfro.setup`

**Ruch**

- Unieś ciężar przed sobą łukiem aż nad głowę, łokcie lekko ugięte; potem opuść go powoli do ud. — Fitnall: [Barbell overhead front raise](https://fitnall.com/exercises/barbell-overhead-front-raise/) (szczebel 5 — nie liczy się do pary; How To 3 (5: „raise the barbell until it slightly passes your head”; 6: „avoid locking the elbows”); A. Albritton); free-exercise-db: [Standing Front Barbell Raise Over Head](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Front_Barbell_Raise_Over_Head.json) (szczebel 5 — nie liczy się do pary; instructions 3) `fro.move`

**Czego unikać**

- Wyginanie lędźwi, gdy ręce idą nad głowę. — Fitnall: [Barbell overhead front raise](https://fitnall.com/exercises/barbell-overhead-front-raise/) (szczebel 5 — nie liczy się do pary; How To 3 (5: „raise the barbell until it slightly passes your head”; 6: „avoid locking the elbows”); A. Albritton) `fro.mis.arch`

### Sled Reverse Flye

**Ustawienie**

- Stań przodem do sanek z uchwytami w wyciągniętych rękach i cofnij się, aż linka się napnie. — free-exercise-db: [Sled Reverse Flye](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Sled_Reverse_Flye.json) (szczebel 5 — nie liczy się do pary; instructions 2–3); SET FOR SET: [Sled workouts](https://www.setforset.com/blogs/news/sled-workouts) (szczebel 5 — nie liczy się do pary; Sled Reverse Fly (blog sprzedawcy sanek)) `srf.setup`

**Ruch**

- Rozciągnij uchwyty na boki, nie zmieniając kąta w łokciach; wróć spokojnie. — free-exercise-db: [Sled Reverse Flye](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Sled_Reverse_Flye.json) (szczebel 5 — nie liczy się do pary; instructions 2–3); SET FOR SET: [Sled workouts](https://www.setforset.com/blogs/news/sled-workouts) (szczebel 5 — nie liczy się do pary; Sled Reverse Fly (blog sprzedawcy sanek)); app-s7 (szczebel 5 — nie liczy się do pary; Instructions 2: slight bend in your elbows, pull the handles apart and out to the sides (Tips: avoid jerking)) `srf.move`

### Car Drivers

**Ustawienie**

- Stań prosto, chwyć talerz oburącz i wyciągnij ręce przed sobą na wysokość barków. — ManiacMuscle: [Dumbbell standing driver](https://maniacmuscle.com/dumbbell-standing-driver/) (szczebel 5 — nie liczy się do pary; Execution 2 (Setup 4: shoulder height, elbows slightly bent; Tips: „Letting the dumbbell sink lower reduces the shoulder challenge.”; Execution 3: „Do not jerk…”); bez autora); Atlas ćwiczeń Centrum Respo: [Bus driver with mini band](https://centrumrespo.pl/atlas/bus-driver-with-mini-band/) (szczebel 5 — nie liczy się do pary; pozycja wyjściowa; ruch: „krótkie skręty kierownicy samochodu, raz w prawo, raz w lewo”) [uproszczenie: wariant sprzętu: źródła opisują hantle i gumę; ten sam ruch stawów, zmienia się przyrząd (talerz)] `cdr.setup`

**Ruch**

- Obracaj talerz jak kierownicę — raz w jedną, raz w drugą stronę; ręce cały czas na wysokości barków. — ManiacMuscle: [Dumbbell standing driver](https://maniacmuscle.com/dumbbell-standing-driver/) (szczebel 5 — nie liczy się do pary; Execution 2 (Setup 4: shoulder height, elbows slightly bent; Tips: „Letting the dumbbell sink lower reduces the shoulder challenge.”; Execution 3: „Do not jerk…”); bez autora); Atlas ćwiczeń Centrum Respo: [Bus driver with mini band](https://centrumrespo.pl/atlas/bus-driver-with-mini-band/) (szczebel 5 — nie liczy się do pary; pozycja wyjściowa; ruch: „krótkie skręty kierownicy samochodu, raz w prawo, raz w lewo”) [uproszczenie: wariant sprzętu: źródła opisują hantle i gumę; ten sam ruch stawów, zmienia się przyrząd (talerz)] `cdr.move`

**Czego unikać**

- Ręce opadają poniżej barków. — ManiacMuscle: [Dumbbell standing driver](https://maniacmuscle.com/dumbbell-standing-driver/) (szczebel 5 — nie liczy się do pary; Execution 2 (Setup 4: shoulder height, elbows slightly bent; Tips: „Letting the dumbbell sink lower reduces the shoulder challenge.”; Execution 3: „Do not jerk…”); bez autora) `cdr.mis.drop`
- Szarpanie i rzucanie ciężarem zamiast kontrolowanego ruchu. — ManiacMuscle: [Dumbbell standing driver](https://maniacmuscle.com/dumbbell-standing-driver/) (szczebel 5 — nie liczy się do pary; Execution 2 (Setup 4: shoulder height, elbows slightly bent; Tips: „Letting the dumbbell sink lower reduces the shoulder challenge.”; Execution 3: „Do not jerk…”); bez autora) `mis.jerk`

### Front Incline Dumbbell Raise

**Ustawienie**

- Usiądź na ławce skośnej, plecy na oparciu; hantle zwisają po bokach. — weighttraining.guide: [Incline dumbbell front raise](https://weighttraining.guide/exercises/incline-dumbbell-front-raise/) (szczebel 5 — nie liczy się do pary; Starting position 2 (autor Edward Lord)); app-s1 (szczebel 5 — nie liczy się do pary; instrukcja 2: hang at arm's length by your sides) `fidr.setup`

**Ruch**

- Unieś hantle przed sobą, łokcie lekko ugięte, mniej więcej do wysokości barków; opuść je powoli. — weighttraining.guide: [Incline dumbbell front raise](https://weighttraining.guide/exercises/incline-dumbbell-front-raise/) (szczebel 5 — nie liczy się do pary; Execution 1: elbows slightly flexed); app-s1 (szczebel 5 — nie liczy się do pary; instrukcja 4: parallel or slightly above shoulder level) `fidr.move`

**Czego unikać**

- Odrywanie pleców od oparcia. — app-s1 (szczebel 5 — nie liczy się do pary; Common Mistakes 3); weighttraining.guide: [Incline dumbbell front raise](https://weighttraining.guide/exercises/incline-dumbbell-front-raise/) (szczebel 5 — nie liczy się do pary; wniosek z ustawienia (etap 2): plecy na oparciu) `fidr.mis.back`

### Dumbbell Incline Shoulder Raise

**Ustawienie**

- Połóż się plecami na ławce skośnej, hantle trzymaj nad barkami na prostych rękach. — weighttraining.guide: [Incline dumbbell shoulder raise](https://weighttraining.guide/exercises/incline-dumbbell-shoulder-raise/) (szczebel 5 — nie liczy się do pary; Execution 1 (M. Livelo)); app-s2 (szczebel 5 — nie liczy się do pary; Setup) `isr.setupDb`

**Ruch**

- Nie zginając łokci, wypchnij ciężar wyżej, odrywając barki od ławki; potem powoli opuść łopatki z powrotem. — weighttraining.guide: [Incline dumbbell shoulder raise](https://weighttraining.guide/exercises/incline-dumbbell-shoulder-raise/) (szczebel 5 — nie liczy się do pary; Execution 1 (M. Livelo)); app-s2 (szczebel 5 — nie liczy się do pary; Instructions 2) `isr.move`

**Czego unikać**

- Zginanie łokci — ruch zamienia się w wyciskanie. — app-s2 (szczebel 5 — nie liczy się do pary; Common mistakes: bending the elbows and turning it into a press); weighttraining.guide: [Incline dumbbell shoulder raise](https://weighttraining.guide/exercises/incline-dumbbell-shoulder-raise/) (szczebel 5 — nie liczy się do pary; Execution 1: only the shoulders should move) `isr.mis.press`

### Barbell Incline Shoulder Raise

**Ustawienie**

- Połóż się plecami na ławce skośnej, sztangę trzymaj nad sobą na prostych rękach. — free-exercise-db: [Barbell Incline Shoulder Raise](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Incline_Shoulder_Raise.json) (szczebel 5 — nie liczy się do pary; instructions 2); app-s3 (szczebel 5 — nie liczy się do pary; krok 3) `isr.setupBb`

**Ruch**

- Nie zginając łokci, wypchnij ciężar wyżej, odrywając barki od ławki; potem powoli opuść łopatki z powrotem. — free-exercise-db: [Barbell Incline Shoulder Raise](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Incline_Shoulder_Raise.json) (szczebel 5 — nie liczy się do pary; instructions 2); app-s3 (szczebel 5 — nie liczy się do pary; krok 3) [uproszczenie: opuszczenie „powoli” opisują źródła wariantu z hantlami; źródła sztangi opisują tylko wypchnięcie z odrywaniem barków od ławki (do potwierdzenia przez recenzenta)] `isr.move`

**Czego unikać**

- Zginanie łokci — ruch zamienia się w wyciskanie. — free-exercise-db: [Barbell Incline Shoulder Raise](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Incline_Shoulder_Raise.json) (szczebel 5 — nie liczy się do pary; wniosek z ruchu (etap 2): ręce proste); app-s3 (szczebel 5 — nie liczy się do pary; wniosek z ruchu (etap 2): ręce proste) `isr.mis.press`

### Dumbbell Front Raise to Overhead

**Ustawienie**

- Stań prosto, hantle trzymaj przed udami, dłonie zwrócone do ciała. — app-s4 (szczebel 5 — nie liczy się do pary; How to do it 1 (from thighs)); app-s5 (szczebel 5 — nie liczy się do pary; How to 1: palms facing your thighs) `dfro.setup`

**Ruch**

- Unieś ciężar przed sobą łukiem aż nad głowę, łokcie lekko ugięte; potem opuść go powoli do ud. — app-s4 (szczebel 5 — nie liczy się do pary; How to do it); app-s5 (szczebel 5 — nie liczy się do pary; How to 3: slowly raise … in an arc) `fro.move`

**Czego unikać**

- Wyginanie lędźwi, gdy ręce idą nad głowę. — app-s4 (szczebel 5 — nie liczy się do pary; Common mistakes: avoid arching your lower back); app-s5 (szczebel 5 — nie liczy się do pary; Common mistakes 3) `fro.mis.arch`
- Szarpanie i rzucanie ciężarem zamiast kontrolowanego ruchu. — app-s4 (szczebel 5 — nie liczy się do pary; Common mistakes: do not swing or use momentum); app-s5 (szczebel 5 — nie liczy się do pary; Common mistakes 1) `mis.jerk`

### Straight Raises on Incline Bench

**Ustawienie**

- Połóż się klatką na ławce skośnej; sztangę trzymaj nachwytem na prostych, zwisających rękach. — free-exercise-db: [Straight Raises on Incline Bench](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Straight_Raises_on_Incline_Bench.json) (szczebel 5 — nie liczy się do pary; instructions 2–3); app-s6 (szczebel 5 — nie liczy się do pary; Steps 1–2) `sri.setup`

**Ruch**

- Prawie prostymi rękami unieś sztangę przed siebie, potem powoli ją opuść. — free-exercise-db: [Straight Raises on Incline Bench](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Straight_Raises_on_Incline_Bench.json) (szczebel 5 — nie liczy się do pary; instructions 3); app-s6 (szczebel 5 — nie liczy się do pary; Steps 3 i 5) `sri.move`

**Czego unikać**

- Odrywanie klatki od ławki. — free-exercise-db: [Straight Raises on Incline Bench](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Straight_Raises_on_Incline_Bench.json) (szczebel 5 — nie liczy się do pary; wniosek z ustawienia (etap 2): leżenie na ławce); app-s6 (szczebel 5 — nie liczy się do pary; Steps 1: position chest against bench top) `yr.mis.chest`

## Źródła

| Id | Organizacja | Tytuł | Adres | Migawka (odczyt) |
|---|---|---|---|---|
| aaos-rotator-cuff-program | AAOS | Rotator Cuff and Shoulder Conditioning Program | https://www.orthoinfo.org/en/recovery/rotator-cuff-and-shoulder-conditioning-program/ | — |
| ace-10 | ACE | Hammer Curl (#10) | https://www.acefitness.org/resources/everyone/exercise-library/10/hammer-curl/ | — |
| ace-11 | ACE | Back Squat (#11) | https://www.acefitness.org/resources/everyone/exercise-library/11/back-squat/ | — |
| ace-115 | ACE | Box Jumps (#115) | https://www.acefitness.org/resources/everyone/exercise-library/115/box-jumps/ | — |
| ace-116 | ACE | Squat Jumps (#116) | https://www.acefitness.org/resources/everyone/exercise-library/116/squat-jumps/ | — |
| ace-12 | ACE | Bent Over Row (#12) | https://www.acefitness.org/resources/everyone/exercise-library/12/bent-over-row/ | — |
| ace-126 | ACE | Single Arm Row (#126) | https://www.acefitness.org/resources/everyone/exercise-library/126/single-arm-row/ | — |
| ace-131 | ACE | Prone (Lying) Hamstrings Curl (#131) | https://www.acefitness.org/resources/everyone/exercise-library/131/prone-lying-hamstrings-curl/ | — |
| ace-135 | ACE | Bodyweight Squat (#135) | https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/ | — |
| ace-139 | ACE | Walking Lunges With Twists (#139) | https://www.acefitness.org/resources/everyone/exercise-library/139/walking-lunges-with-twists/ | — |
| ace-14 | ACE | Bird Dog (#14) | https://www.acefitness.org/resources/everyone/exercise-library/14/bird-dog/ | — |
| ace-147 | ACE | Supine Dead Bug (#147) | https://www.acefitness.org/resources/everyone/exercise-library/147/supine-dead-bug/ | — |
| ace-15 | ACE | Cat-Cow (#15) | https://www.acefitness.org/resources/everyone/exercise-library/15/cat-cow/ | — |
| ace-152 | ACE | Standing Dorsi-Flexion (Calf Stretch) (#152) | https://www.acefitness.org/resources/everyone/exercise-library/152/ | — |
| ace-153 | ACE | Lying Hamstrings Curl (#153) | https://www.acefitness.org/resources/everyone/exercise-library/153/lying-hamstrings-curl/ | — |
| ace-154 | ACE | Seated Leg Press (#154) | https://www.acefitness.org/resources/everyone/exercise-library/154/seated-leg-press/ | — |
| ace-158 | ACE | Seated Lat Pulldown (#158) | https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/ | — |
| ace-160 | ACE | Standing Chest Fly (#160) | https://www.acefitness.org/resources/everyone/exercise-library/160/standing-chest-fly/ | — |
| ace-165 | ACE | Seated Cable Press (#165) | https://www.acefitness.org/resources/everyone/exercise-library/165/seated-cable-press/ | — |
| ace-168 | ACE | Seated Row (#168) | https://www.acefitness.org/resources/everyone/exercise-library/168/seated-row/ | — |
| ace-174 | ACE | Overhead Triceps Stretch (#174) | https://www.acefitness.org/resources/everyone/exercise-library/174/ | — |
| ace-177 | ACE | Forward Linear Jumps (#177) | https://www.acefitness.org/resources/everyone/exercise-library/177/forward-linear-jumps/ | — |
| ace-178 | ACE | Overhead Medicine Ball Throws (#178) | https://www.acefitness.org/resources/everyone/exercise-library/178/overhead-medicine-ball-throws/ | — |
| ace-180 | ACE | Tuck Jump (#180) | https://www.acefitness.org/resources/everyone/exercise-library/180/tuck-jump/ | — |
| ace-182 | ACE | Overhead Slams (#182) | https://www.acefitness.org/resources/everyone/exercise-library/182/overhead-slams/ | — |
| ace-185 | ACE | Triceps Pushdowns (#185) | https://www.acefitness.org/resources/everyone/exercise-library/185/triceps-pushdowns/ | — |
| ace-186 | ACE | Seated Shoulder Press (#186) | https://www.acefitness.org/resources/everyone/exercise-library/186/seated-shoulder-press/ | — |
| ace-188 | ACE | Seated Chest Press (#188) | https://www.acefitness.org/resources/everyone/exercise-library/188/seated-chest-press/ | — |
| ace-19 | ACE | Chest Press (#19) | https://www.acefitness.org/resources/everyone/exercise-library/19/chest-press/ | — |
| ace-190 | ACE | Chin Ups (#190) | https://www.acefitness.org/resources/everyone/exercise-library/190/chin-ups/ | — |
| ace-191 | ACE | Pull Ups (#191) | https://www.acefitness.org/resources/everyone/exercise-library/191/pull-ups/ | — |
| ace-202 | ACE | Lateral Neck Flexion (#202) | https://www.acefitness.org/resources/everyone/exercise-library/202/lateral-neck-flexion/ | — |
| ace-204 | ACE | Neck Flexion and Extension (#204) | https://www.acefitness.org/resources/everyone/exercise-library/204/neck-flexion-and-extension/ | — |
| ace-209 | ACE | Standing Chest Stretch (#209) | https://www.acefitness.org/resources/everyone/exercise-library/209/ | — |
| ace-21 | ACE | Lying Chest Fly (#21) | https://www.acefitness.org/resources/everyone/exercise-library/21/lying-chest-fly/ | — |
| ace-210 | ACE | Seated Straddle Stretch (#210) | https://www.acefitness.org/resources/everyone/exercise-library/210/seated-straddle-stretch/ | — |
| ace-216 | ACE | Seated Butterfly Stretch (#216) | https://www.acefitness.org/resources/everyone/exercise-library/216/seated-butterfly-stretch/ | — |
| ace-22 | ACE | Front Squat (#22) | https://www.acefitness.org/resources/everyone/exercise-library/22/front-squat/ | — |
| ace-227 | ACE | Childs Pose (#227) | https://www.acefitness.org/resources/everyone/exercise-library/227/childs-pose/ | — |
| ace-24 | ACE | Push Press (#24) | https://www.acefitness.org/resources/everyone/exercise-library/24/push-press/ | — |
| ace-246 | ACE | Alternate Leg Push-off (#246) | https://www.acefitness.org/resources/everyone/exercise-library/246/alternate-leg-push-off/ | — |
| ace-25 | ACE | Incline Chest Press (#25) | https://www.acefitness.org/resources/everyone/exercise-library/25/incline-chest-press/ | — |
| ace-258 | ACE | Mountain Climbers (#258) | https://www.acefitness.org/resources/everyone/exercise-library/258/mountain-climbers/ | — |
| ace-26 | ACE | Lateral Raise (#26) | https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/ | — |
| ace-264 | ACE | Medicine Ball Lunge to Chest Pass (#264) | https://www.acefitness.org/resources/everyone/exercise-library/264/medicine-ball-lunge-to-chest-pass/ | — |
| ace-28 | ACE | Step Up (#28) | https://www.acefitness.org/resources/everyone/exercise-library/28/step-up/ | — |
| ace-294 | ACE | Calf Raise (#294) | https://www.acefitness.org/resources/everyone/exercise-library/294/calf-raise/ | — |
| ace-303 | ACE | Side Plank (#303) | https://www.acefitness.org/resources/everyone/exercise-library/303/side-plank/ | — |
| ace-305 | ACE | V Twist (#305) | https://www.acefitness.org/resources/everyone/exercise-library/305/v-twist/ | — |
| ace-306 | ACE | Burpee (#306, wersja z BOSU) | https://www.acefitness.org/education-and-resources/lifestyle/exercise-library/306/burpee/ | — |
| ace-308 | ACE | Pistol Squat (#308) | https://www.acefitness.org/resources/everyone/exercise-library/308/pistol-squat/ | — |
| ace-311 | ACE | Close Grip Bench Press (#311) | https://www.acefitness.org/resources/everyone/exercise-library/311/close-grip-bench-press/ | — |
| ace-317 | ACE | Romanian Deadlift (#317) | https://www.acefitness.org/resources/everyone/exercise-library/317/romanian-deadlift/ | — |
| ace-318 | ACE | Hip Bridge (#318) | https://www.acefitness.org/resources/everyone/exercise-library/318/hip-bridge/ | — |
| ace-319 | ACE | Reverse Lunge (#319) | https://www.acefitness.org/resources/everyone/exercise-library/319/reverse-lunge/ | — |
| ace-32 | ACE | Front Plank (#32) | https://www.acefitness.org/resources/everyone/exercise-library/32/front-plank/ | — |
| ace-322 | ACE | Standing Bicep Curl (#322) | https://www.acefitness.org/resources/everyone/exercise-library/322/standing-bicep-curl/ | — |
| ace-332 | ACE | Standing Anti-Rotation Press (#332) | https://www.acefitness.org/resources/everyone/exercise-library/332/standing-anti-rotation-press/ | — |
| ace-334 | ACE | Straight Arm Pressdown (#334) | https://www.acefitness.org/resources/everyone/exercise-library/334/straight-arm-pressdown/ | — |
| ace-336 | ACE | High Row (#336) | https://www.acefitness.org/resources/everyone/exercise-library/336/high-row/ | — |
| ace-338 | ACE | Single-arm Chest Press (#338) | https://www.acefitness.org/resources/everyone/exercise-library/338/single-arm-chest-press/ | — |
| ace-34 | ACE | Incline Reverse Fly (#34) | https://www.acefitness.org/resources/everyone/exercise-library/34/incline-reverse-fly/ | — |
| ace-353 | ACE | Reverse Fly (#353) | https://www.acefitness.org/resources/everyone/exercise-library/353/reverse-fly/ | — |
| ace-354 | ACE | Single Arm Lateral Raise (#354) | https://www.acefitness.org/resources/everyone/exercise-library/354/single-arm-lateral-raise/ | — |
| ace-357 | ACE | Squat to Overhead Press (#357) | https://www.acefitness.org/resources/everyone/exercise-library/357/squat-to-overhead-press/ | — |
| ace-358 | ACE | Suitcase Carry (#358) | https://www.acefitness.org/resources/everyone/exercise-library/358/suitcase-carry/ | — |
| ace-359 | ACE | Farmer’s Carry (#359) | https://www.acefitness.org/resources/everyone/exercise-library/359/farmer-s-carry/ | — |
| ace-36 | ACE | Lying Barbell Triceps Extensions (#36) | https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/ | — |
| ace-362 | ACE | Goblet Squat (#362) | https://www.acefitness.org/resources/everyone/exercise-library/362/goblet-squat/ | — |
| ace-363 | ACE | Lunge (#363) | https://www.acefitness.org/resources/everyone/exercise-library/363/lunge/ | — |
| ace-366 | ACE | Bulgarian Split Squat (#366) | https://www.acefitness.org/resources/everyone/exercise-library/366/bulgarian-split-squat/ | — |
| ace-367 | ACE | Elevated Glute Bridge (#367) | https://www.acefitness.org/resources/everyone/exercise-library/367/elevated-glute-bridge/ | — |
| ace-385 | ACE | Push-jerk (#385; kettlebells) | https://www.acefitness.org/resources/everyone/exercise-library/385/push-jerk/ | — |
| ace-391 | ACE | Swing (#391) | https://www.acefitness.org/resources/everyone/exercise-library/391/swing/ | — |
| ace-394 | ACE | Halo (#394) | https://www.acefitness.org/resources/everyone/exercise-library/394/halo/ | — |
| ace-41 | ACE | Push Up (#41) | https://www.acefitness.org/resources/everyone/exercise-library/41/push-up/ | — |
| ace-43 | ACE | Seated Shoulder Press (#43) | https://www.acefitness.org/resources/everyone/exercise-library/43/seated-shoulder-press/ | — |
| ace-44 | ACE | Seated Biceps Curl (#44) | https://www.acefitness.org/resources/everyone/exercise-library/44/seated-biceps-curl/ | — |
| ace-48 | ACE | Seated Row (#48) | https://www.acefitness.org/resources/everyone/exercise-library/48/seated-row/ | — |
| ace-49 | ACE | Glute Bridge (#49) | https://www.acefitness.org/resources/everyone/exercise-library/49/glute-bridge/ | — |
| ace-5 | ACE | Chest Press (#5) | https://www.acefitness.org/resources/everyone/exercise-library/5/chest-press/ | — |
| ace-51 | ACE | Calf Raises (#51) | https://www.acefitness.org/resources/everyone/exercise-library/51/calf-raises/ | — |
| ace-52 | ACE | Crunch (#52) | https://www.acefitness.org/resources/everyone/exercise-library/52/crunch/ | — |
| ace-5386-adv-kb | ACE | Advanced Kettlebell Workout for Increased Strength and Conditioning (ACE, 21.04.2015) | https://www.acefitness.org/resources/pros/expert-articles/5386/advanced-kettlebell-workout-for-increased-strength-and-conditioning/ | — |
| ace-54 | ACE | Front Raise (#54) | https://www.acefitness.org/resources/everyone/exercise-library/54/front-raise/ | — |
| ace-6 | ACE | Deadlift (#6) | https://www.acefitness.org/resources/everyone/exercise-library/6/deadlift/ | — |
| ace-65 | ACE | Russian Twist (#65) | https://www.acefitness.org/resources/everyone/exercise-library/65/russian-twist/ | — |
| ace-70 | ACE | Bicep Curl (#70) | https://www.acefitness.org/resources/everyone/exercise-library/70/bicep-curl/ | — |
| ace-71 | ACE | Standing Shoulder Press (#71) | https://www.acefitness.org/resources/everyone/exercise-library/71/standing-shoulder-press/ | — |
| ace-72 | ACE | Shrug (#72) | https://www.acefitness.org/resources/everyone/exercise-library/72/shrug/ | — |
| ace-73 | ACE | Standing Calf Raises Wall (#73) | https://www.acefitness.org/resources/everyone/exercise-library/73/standing-calf-raises-wall/ | — |
| ace-74 | ACE | Triceps Extension (#74) | https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/ | — |
| ace-75 | ACE | Standing Shrug (#75) | https://www.acefitness.org/resources/everyone/exercise-library/75/standing-shrug/ | — |
| ace-76 | ACE | Reverse Crunch (#76) | https://www.acefitness.org/resources/everyone/exercise-library/76/reverse-crunch/ | — |
| ace-84 | ACE | Trx Reg Back Row (#84) | https://www.acefitness.org/resources/everyone/exercise-library/84/trx-reg-back-row/ | — |
| ace-blog-5624 | ACE | Foam Rolling 101 (blog) | https://www.acefitness.org/resources/everyone/blog/5624/foam-rolling-101/ | — |
| aceblog-5881 | ACE | Reap the Benefits of Rowing With 3 Fast and Efficient Workouts (blog, 2016) | https://www.acefitness.org/resources/everyone/blog/5881/reap-the-benefits-of-rowing-with-3-fast-and-efficient-workouts/ | — |
| acecert-7403 | ACE | Understanding the Barbell Hip Thrust (ACE Certified, XI 2019) | https://www.acefitness.org/continuing-education/certified/november-2019/7403/understanding-the-barbell-hip-thrust/ | — |
| acefitness-a-pro-s-guide-to-muscle-mechanics-the-shoulders | ACE | A pro s guide to muscle mechanics the shoulders | https://www.acefitness.org/continuing-education/certified/september-2025/8951/a-pro-s-guide-to-muscle-mechanics-the-shoulders/ | — |
| af-dynamic-warmups | Arthritis Foundation | Dynamic Warm-Ups (Arthritis at Work) | https://www.arthritis.org/partnership/atwork/at-work-physical-activity/dynamic-warm-ups-for-arthritis-workplace | — |
| alberta-abk4469 | WebMD Ignite | Piriformis stretch (from legs bent) | https://myhealth.alberta.ca/Health/healthy-living/pages/conditions.aspx?hwid=abk4469 | — |
| app-s1 | app-s1 | app-s1 | — | — |
| app-s2 | app-s2 | app-s2 | — | — |
| app-s3 | app-s3 | app-s3 | — | — |
| app-s4 | app-s4 | app-s4 | — | — |
| app-s5 | app-s5 | app-s5 | — | — |
| app-s6 | app-s6 | app-s6 | — | — |
| app-s7 | app-s7 | app-s7 | — | — |
| athletico-figure-4 | Athletico Physical Therapy | Stretch of the Week: Figure 4 | https://athletico.com/?p=27325 | — |
| aurora-lower-trunk-rotation | Advocate Aurora Health | Lumbar – Lower Trunk Rotation, Hooklying (X20549, rev. 12/2019) | https://ahc.aurorahealthcare.org/fywb/x20549.pdf | — |
| barbend-blocks-vs-hang | BarBend | Weightlifting Blocks vs. the Hang (J. Dickson, USAW-L2) | https://barbend.com/weightlifting-blocks-vs-hang/ | — |
| barbend-clean | BarBend | How to Do the Clean… (akt. 19.11.2024) | https://barbend.com/how-to-do-the-clean/ | — |
| barbend-clean-pull | BarBend | Clean Pull guide (J. Dickson, USAW-L2, akt. 15.07.2024) | https://barbend.com/clean-pull-guide/ | — |
| barbend-db-snatch | BarBend | Dumbbell Snatch (M. Dewar, CSCS; aktualizacja J. Dickson, NASM-CPT, USAW-L2, 26.11.2024) | https://barbend.com/dumbbell-snatch/ | — |
| barbend-fix-your-snatch | BarBend | Need to Fix Your Snatch? (R. Stefan, USAW-L1) | https://barbend.com/fix-your-snatch/ | — |
| barbend-hang-clean | BarBend | How to Do a Hang Clean (akt. 19.12.2023) | https://barbend.com/hang-clean/ | — |
| barbend-hang-lifts | BarBend | What Are Hang Lifts in Weightlifting? (J. Dickson, USAW-L2) | https://barbend.com/what-are-hang-lifts-in-weightlifting/ | — |
| barbend-jerk-dip | BarBend | Jerk Dip — Technique & Benefits (K. Ferriello, akt. 31.07.2023) | https://barbend.com/jerk-dip-technique-benefits/ | — |
| barbend-jerk-exercises | BarBend | Exercises to Strengthen Your Jerk (R. Stefan, akt. 01.07.2024) | https://barbend.com/exercises-to-strengthen-jerk | — |
| barbend-kb-clean | BarBend | Kettlebell Clean (D. Fraiser, Canadian Kettlebell Instructor, 25.09.2023) | https://barbend.com/kettlebell-clean/ | — |
| barbend-kb-jerk-vs-pp | BarBend | Kettlebell Jerk vs Push Press (M. Dewar, CSCS; akt. 24.08.2023) | https://barbend.com/kettlebell-jerk-vs-push-press | — |
| barbend-kettlebell-halo | BarBend | Kettlebell halo | https://barbend.com/kettlebell-halo/ | — |
| barbend-muscle-snatch | BarBend | Muscle Snatch (C. Trieu, 2024) | https://barbend.com/muscle-snatch/ | — |
| barbend-pendlay-row | BarBend | Pendlay Row | https://barbend.com/Pendlay-row/ | — |
| barbend-power-clean | BarBend | The Power Clean Exercise: How To… (akt. 25.03.2024) | https://barbend.com/power-clean/ | — |
| barbend-power-snatch | BarBend | Power Snatch (R. Stefan, USAW-L1) | https://barbend.com/power-snatch/ | — |
| barbend-sled-push | BarBend | How to Do the Sled Push (M. Dewar, CSCS, akt. 28.06.2024) | https://barbend.com/sled-push/ | — |
| barbend-snatch-balance | BarBend | Snatch Balance (M. Dewar, CSCS) | https://barbend.com/snatch-balance/ | — |
| berling-2006 | Berling i in. (University of Wisconsin–La Crosse) | …handrail support on oxygen uptake during steady-state treadmill exercise, J Cardiopulm Rehabil 2006 (abstrakt, Europe PMC) | https://europepmc.org/article/MED/17135860 | — |
| bini-2011 | Bini, Hume, Croft (Auckland University of Technology) | Effects of bicycle saddle height on knee injury risk and cycling performance, Sports Med 2011 (abstrakt, Europe PMC) | https://europepmc.org/article/MED/21615188 | — |
| bodylastics-lateral-raise-with-flat-bands | Bodylastics | Lateral raise with flat bands | https://bodylastics.com/exercise/lateral-raise-with-flat-bands | — |
| bodylastics-upright-row | Bodylastics | Upright row | https://www.bodylastics.com/exercises/resistance-bands/shoulders/upright-row | — |
| breakingmuscle-pendlay-row | Breaking Muscle | Pendlay Row | https://breakingmuscle.com/pendlay-row/ | — |
| c2-bikeerg-setup | Concept2 | Setting Up the BikeErg | https://www.concept2.nl/en/node/8909 | — |
| c2-technique | Concept2 | Indoor Rowing Technique | https://www.concept2.com/training/rowing-technique | — |
| catalyst-193 | Catalyst Athletics | Jerk Balance (Exercise Library #193) | https://catalystathletics.com/exercise/193/Jerk-Balance/ | — |
| catalyst-194 | Catalyst Athletics | Jerk Dip Squat (Exercise Library #194) | https://catalystathletics.com/exercise/194/Jerk-Dip-Squat/ | — |
| catalyst-207 | Catalyst Athletics | Block Snatch (#207) | https://catalystathletics.com/exercise/207/Block-Snatch/ | — |
| catalyst-211 | Catalyst Athletics | Split Clean | https://www.catalystathletics.com/exercise/211/Split-Clean/ | — |
| catalyst-353 | Catalyst Athletics | Back Squat Jump (#353) | https://catalystathletics.com/exercise/353/Back-Squat-Jump/ | — |
| catalyst-379 | Catalyst Athletics | Block Clean | https://www.catalystathletics.com/exercise/379/Block-Clean/ | — |
| catalyst-380 | Catalyst Athletics | Block Power Clean | https://www.catalystathletics.com/exercise/380/Block-Power-Clean/ | — |
| catalyst-549 | Catalyst Athletics | Broad Jump (#549) | https://www.catalystathletics.com/exercise/549/Broad-Jump/ | — |
| catalyst-555 | Catalyst Athletics | Squat Vertical Jump (#555) | https://catalystathletics.com/exercise/555/Squat-Vertical-Jump/ | — |
| catalyst-558 | Catalyst Athletics | Tuck Jump (#558) | https://catalystathletics.com/exercise/558/Tuck-Jump/ | — |
| catalyst-58 | Catalyst Athletics | Snatch (#58) | https://www.catalystathletics.com/exercise/58/Snatch/ | — |
| catalyst-59 | Catalyst Athletics | Clean | https://www.catalystathletics.com/exercise/59/Clean/ | — |
| catalyst-60 | Catalyst Athletics | Split Jerk (Exercise Library #60) | https://catalystathletics.com/exercise/60/Split-Jerk | — |
| catalyst-61 | Catalyst Athletics | Power Snatch (#61) | https://www.catalystathletics.com/exercise/61/ | — |
| catalyst-62 | Catalyst Athletics | Hang Power Snatch (#62) | https://www.catalystathletics.com/exercise/62/Hang-Power-Snatch/ | — |
| catalyst-67 | Catalyst Athletics | Power Clean | https://www.catalystathletics.com/exercise/67/Power-Clean/ | — |
| catalyst-68 | Catalyst Athletics | Hang Clean | https://www.catalystathletics.com/exercise/68/Hang-Clean/ | — |
| catalyst-72 | Catalyst Athletics | Power Jerk (Exercise Library #72) | https://catalystathletics.com/exercise/72/Power-Jerk/ | — |
| catalyst-75 | Catalyst Athletics | Squat Jerk (Exercise Library #75) | https://catalystathletics.com/exercise/75/Squat-Jerk/ | — |
| catalyst-76 | Catalyst Athletics | Clean & Jerk | https://www.catalystathletics.com/exercise/76/Clean-Jerk/ | — |
| catalyst-80 | Catalyst Athletics | Snatch Balance (#80) | https://www.catalystathletics.com/exercise/80/Snatch-Balance/ | — |
| catalyst-803 | Catalyst Athletics | Barbell Front Raise (#803) | https://catalystathletics.com/exercise/803/Barbell-Front-Raise/ | — |
| catalyst-805 | Catalyst Athletics | Barbell Upright Row (#805) | https://catalystathletics.com/exercise/805/Barbell-Upright-Row/ | — |
| catalyst-812 | Catalyst Athletics | Cable Front Raise (#812) | https://catalystathletics.com/exercise/812/Cable-Front-Raise/ | — |
| catalyst-822 | Catalyst Athletics | Dumbbell Front Side Raise (#822) | https://catalystathletics.com/exercise/822/Dumbbell-Front-Side-Raise/ | — |
| catalyst-96 | Catalyst Athletics | Muscle Snatch (#96) | https://www.catalystathletics.com/exercise/96/Muscle-Snatch/ | — |
| catalyst-97 | Catalyst Athletics | Snatch Pull (#97) | https://www.catalystathletics.com/exercise/97/Snatch-Pull/ | — |
| catalyst-98 | Catalyst Athletics | Clean Pull | https://www.catalystathletics.com/exercise/98/Clean-Pull/ | — |
| catalyst-art-1904 | Catalyst Athletics | Everett: Arm Bend in the Snatch & Clean — It's Still Not the Solution | https://catalystathletics.com/article/1904/Arm-Bend-in-the-Snatch-Clean-Its-Still-Not-the-Solution-to-/ | — |
| catalyst-art-2076 | Catalyst Athletics | Everett: Keeping the Bar Close — The 3 Biggest Mistakes You're Making (2017) | https://catalystathletics.com/article/2076/Keeping-the-Bar-Close-The-3-Biggest-Mistakes-Youre-Making | — |
| catalyst-pm-815 | Catalyst Athletics | Everett: Ask Greg, Issue 130 (Performance Menu, XI 2015) — split snatch | https://performancemenu.com/article/815/Greg-Everett | — |
| catalyst-video-1499 | Catalyst Athletics | How To Stop Swinging Snatch & Clean Pulls (wideo z opisem) | https://catalystathletics.com/video/1499/How-To-Stop-Swinging-Snatch-Clean-Pulls | — |
| catalyst-video-1539 | Catalyst Athletics | Arm Bend In Snatch & Clean Pulls? (wideo z opisem) | https://catalystathletics.com/video/1539/Arm-Bend-In-Snatch-Clean-Pulls/ | — |
| cc-seated-warmup | Cleveland Clinic | Seated Warm-Up/Cool-Down Exercises (Rev. 7/19) | https://my.clevelandclinic.org/-/scassets/files/org/heart/patient-education/hvti-files/seated-warm-up-exercises.pdf | — |
| ccmc-foam-rolling | Connecticut Children's Sports Medicine | Lower Extremity Foam Rolling Home Exercise Program (PDF, 2 s.) | https://www.connecticutchildrens.org/sites/default/files/2024-01/lower_extremity_foam_rolling_home_exercise_program.pdf | — |
| ccsm-back-stretching | Connecticut Children's Sports Medicine | Back Stretching Home Exercise Program | https://www.connecticutchildrens.org/sites/default/files/2026-04/pdf_sportsmed_back-stretching-home-exercise-program.pdf | — |
| ccv-flexibility | Cancer Council Victoria | Flexibility exercises | https://www.cancervic.org.au/get-support/guides/managing-daily-life/exercise/flexibility-exercises | — |
| centrumrespo-bus-driver-with-mini-band | Atlas ćwiczeń Centrum Respo | Bus driver with mini band | https://centrumrespo.pl/atlas/bus-driver-with-mini-band/ | — |
| cf-dkb-pp-jerk | CrossFit | Double-Kettlebell Push Press and Jerk (J. Martone, 01.2008) | https://crossfit.com/essentials/double-kettlebell-push-press-and-jerk | — |
| coach-pendlay-row | Coach | How To Do The Pendlay Row | https://www.coachweb.com/back-exercises/7785/how-to-do-the-pendlay-row | — |
| columbia-plantar-fasciitis | WebMD Ignite | Plantar Fasciitis Exercises (Health Library) | https://www.columbiadoctors.org/health-library/how-to/plantar-fasciitis-exercises | — |
| covenant-lower-body-flex | Covenant HealthCare | Lower Body Flexibility (PDF, 2 s.) | https://covenanthealthcare.com/Uploads/Public/Documents/Workfiles/Covenant%20Medical%20Group/Sports_Medicine/Lower_Body_Flexibility.pdf | — |
| crossfit-cj | CrossFit | The Clean and Jerk (Essentials, 21.01.2020) | https://www.crossfit.com/essentials/the-clean-and-jerk | — |
| crossfit-jerk | CrossFit | Foundational Movement: Jerk — What Is a Jerk? (B. Burgener, 29.08.2023) | https://www.crossfit.com/essentials/foundational-movement-jerk-what-is-a-jerk | — |
| crossfit-snatch-forward | CrossFit | O'Connor (CF-L4): Ask a Coach — Missing the Bar Forward in the Snatch (2025) | https://www.crossfit.com/pro-coach/ask-a-coach-missing-bar-forward-snatch | — |
| crossfit-thruster | CrossFit | The Thruster (Essentials, 12.04.2019) | https://www.crossfit.com/essentials/the-thruster | — |
| crossfit-wall-ball | CrossFit | The Wall-Ball Shot: CrossFit's Secret Weapon for Cardiovascular Conditioning | https://www.crossfit.com/essentials/crossfit-wall-ball-secret-weapon | — |
| cuh-spinal-rom | Cambridge University Hospitals NHS FT | Spinal range of movement/stretching exercises | https://www.cuh.nhs.uk/patient-information/spinal-range-of-movementstretching-exercises/ | — |
| duke-oeso-stretches | Duke University Health System, Occupational and Environmental Safety Office | Stretches (handout, 2011) | https://www.safety.duke.edu/sites/default/files/Stretches.pdf | — |
| ecu-pt-eversion-towel | East Carolina University Physical Therapy Clinic | Seated Ankle Eversion Stretch with Towel | https://sites.ecu.edu/ecuphysicaltherapyclinic/?p=138 | — |
| ecu-pt-inversion-towel | East Carolina University Physical Therapy Clinic | Seated Ankle Inversion Stretch with Towel | https://sites.ecu.edu/ecuphysicaltherapyclinic/?p=143 | — |
| eleiko-65944cf0 | Eleiko | Horizontal Cable Press – Dual Cable, Standing | https://eleiko.inspire360.com/resource/65944cf0a15f04fdb30a8c1b | — |
| eleiko-659463af | Eleiko | Overhead Press – Seated, 2 DB | https://eleiko.inspire360.com/resource/659463af0ba5d8897900b853 | — |
| eleiko-659842f4 | Eleiko | Dual Cable Straight Arm Pulldown – Straight Bar | https://eleiko.inspire360.com/resource/659842f49607aaa1f400b866 | — |
| eleiko-6598447e | Eleiko | Dual Cable Straight Arm Pulldown – Handles | https://eleiko.inspire360.com/resource/6598447ec5f892e7790ccbb8 | — |
| eleiko-659d665d | Eleiko | Pallof Cable Press – Low Split Stance | https://eleiko.inspire360.com/resource/659d665daa93b5993f0c90c7 | — |
| elitefts-shove | EliteFTS | Shove It! Top Pushing Moves (D. Balzarini, 05.07.2011) | https://elitefts.com/blogs/training/shove-it-top-pushing-moves | — |
| experiencelife-power-clean | Experience Life | How to Power Clean (A. Heffernan, CSCS, 20.05.2019) | https://experiencelife.lifetime.life/article/learn-to-power-clean/ | — |
| exrx-BackGeneral/BBBentOverRow | ExRx.net | BBBentOverRow | https://exrx.net/WeightExercises/BackGeneral/BBBentOverRow | https://web.archive.org/web/20230227195843/https://exrx.net/WeightExercises/BackGeneral/BBBentOverRow |
| exrx-BackGeneral/BWSupineRow | ExRx.net | BWSupineRow | https://exrx.net/WeightExercises/BackGeneral/BWSupineRow | https://web.archive.org/web/20250510042620/https://exrx.net/WeightExercises/BackGeneral/BWSupineRow |
| exrx-BackGeneral/CBSeatedRow | ExRx.net | CBSeatedRow | https://exrx.net/WeightExercises/BackGeneral/CBSeatedRow | https://web.archive.org/web/20220816182625/https://exrx.net/WeightExercises/BackGeneral/CBSeatedRow |
| exrx-BackGeneral/DBBentOverRow | ExRx.net | DBBentOverRow | https://exrx.net/WeightExercises/BackGeneral/DBBentOverRow | https://web.archive.org/web/20221218023644/https://exrx.net/WeightExercises/BackGeneral/DBBentOverRow |
| exrx-BackGeneral/DBInclineRow | ExRx.net | DBInclineRow | https://exrx.net/WeightExercises/BackGeneral/DBInclineRow | https://web.archive.org/web/20220831072134/https://exrx.net/WeightExercises/BackGeneral/DBInclineRow |
| exrx-BackGeneral/DBLyingRow | ExRx.net | DBLyingRow | https://exrx.net/WeightExercises/BackGeneral/DBLyingRow | https://web.archive.org/web/20230531232843/https://exrx.net/WeightExercises/BackGeneral/DBLyingRow |
| exrx-BackGeneral/LVTBarRow | ExRx.net | LVTBarRow | https://exrx.net/WeightExercises/BackGeneral/LVTBarRow | https://web.archive.org/web/20250118124947/https://exrx.net/WeightExercises/BackGeneral/LVTBarRow |
| exrx-BackGeneral/LVTBarRowLM | ExRx.net | LVTBarRowLM | https://exrx.net/WeightExercises/BackGeneral/LVTBarRowLM | https://web.archive.org/web/20190824065349/https://www.exrx.net/WeightExercises/BackGeneral/LVTBarRowLM |
| exrx-Biceps/BBCurl | ExRx.net | BBCurl | https://exrx.net/WeightExercises/Biceps/BBCurl | https://web.archive.org/web/20230314202340/https://exrx.net/WeightExercises/Biceps/BBCurl |
| exrx-Biceps/CBCurl | ExRx.net | CBCurl | https://exrx.net/WeightExercises/Biceps/CBCurl | https://web.archive.org/web/20231121070212/https://exrx.net/WeightExercises/Biceps/CBCurl |
| exrx-Biceps/DBCurl | ExRx.net | DBCurl | https://exrx.net/WeightExercises/Biceps/DBCurl | https://web.archive.org/web/20240105203817/https://exrx.net/WeightExercises/Biceps/DBCurl |
| exrx-Brachioradialis/DBHammerCurl | ExRx.net | DBHammerCurl | https://exrx.net/WeightExercises/Brachioradialis/DBHammerCurl | https://web.archive.org/web/20220412005934/https://exrx.net/WeightExercises/Brachioradialis/DBHammerCurl |
| exrx-DeltoidAnterior/BBMilitaryPress | ExRx.net | BBMilitaryPress | https://exrx.net/WeightExercises/DeltoidAnterior/BBMilitaryPress | https://web.archive.org/web/20230227195849/https://exrx.net/WeightExercises/DeltoidAnterior/BBMilitaryPress |
| exrx-DeltoidAnterior/CBStandingShoulderPress | ExRx.net | CBStandingShoulderPress | https://exrx.net/WeightExercises/DeltoidAnterior/CBStandingShoulderPress | https://web.archive.org/web/20230306032138/https://exrx.net/WeightExercises/DeltoidAnterior/CBStandingShoulderPress |
| exrx-DeltoidAnterior/DBFrontRaise | ExRx.net | DBFrontRaise | https://exrx.net/WeightExercises/DeltoidAnterior/DBFrontRaise | https://web.archive.org/web/20220816182633/https://exrx.net/WeightExercises/DeltoidAnterior/DBFrontRaise |
| exrx-DeltoidAnterior/DBShoulderPress | ExRx.net | DBShoulderPress | https://exrx.net/WeightExercises/DeltoidAnterior/DBShoulderPress | https://web.archive.org/web/20221218023659/https://exrx.net/WeightExercises/DeltoidAnterior/DBShoulderPress |
| exrx-DeltoidLateral/CBLateralRaise | ExRx.net | CBLateralRaise | https://exrx.net/WeightExercises/DeltoidLateral/CBLateralRaise | https://web.archive.org/web/20230306032138/https://exrx.net/WeightExercises/DeltoidLateral/CBLateralRaise |
| exrx-DeltoidLateral/CBOneArmLateralRaise | ExRx.net | CBOneArmLateralRaise | https://exrx.net/WeightExercises/DeltoidLateral/CBOneArmLateralRaise | https://web.archive.org/web/20231121100641/https://exrx.net/WeightExercises/DeltoidLateral/CBOneArmLateralRaise |
| exrx-DeltoidLateral/DBLateralRaise | ExRx.net | DBLateralRaise | https://exrx.net/WeightExercises/DeltoidLateral/DBLateralRaise | https://web.archive.org/web/20240105210847/https://exrx.net/WeightExercises/DeltoidLateral/DBLateralRaise |
| exrx-DeltoidPosterior/CBStandingRearDeltRowRope | ExRx.net | CBStandingRearDeltRowRope | https://exrx.net/WeightExercises/DeltoidPosterior/CBStandingRearDeltRowRope | https://web.archive.org/web/20230331040950/https://exrx.net/WeightExercises/DeltoidPosterior/CBStandingRearDeltRowRope |
| exrx-DeltoidPosterior/DBRearLateralRaise | ExRx.net | DBRearLateralRaise | https://exrx.net/WeightExercises/DeltoidPosterior/DBRearLateralRaise | https://web.archive.org/web/20220525000244/https://exrx.net/WeightExercises/DeltoidPosterior/DBRearLateralRaise |
| exrx-DeltoidPosterior/LVRearLateralRaise | ExRx.net | LVRearLateralRaise | https://exrx.net/WeightExercises/DeltoidPosterior/LVRearLateralRaise | https://web.archive.org/web/20231031202541/https://exrx.net/WeightExercises/DeltoidPosterior/LVRearLateralRaise |
| exrx-DeltoidPosterior/LVReverseFlyPronated | ExRx.net | LVReverseFlyPronated | https://exrx.net/WeightExercises/DeltoidPosterior/LVReverseFlyPronated | https://web.archive.org/web/20240126173713/https://exrx.net/WeightExercises/DeltoidPosterior/LVReverseFlyPronated |
| exrx-ErectorSpinae/BBDeadlift | ExRx.net | BBDeadlift | https://exrx.net/WeightExercises/ErectorSpinae/BBDeadlift | https://web.archive.org/web/20221218023338/https://exrx.net/WeightExercises/ErectorSpinae/BBDeadlift |
| exrx-ErectorSpinae/BBSumoDeadlift | ExRx.net | BBSumoDeadlift | https://exrx.net/WeightExercises/ErectorSpinae/BBSumoDeadlift | https://web.archive.org/web/20230530074021/https://exrx.net/WeightExercises/ErectorSpinae/BBSumoDeadlift |
| exrx-ErectorSpinae/BWBirdDog | ExRx.net | BWBirdDog | https://exrx.net/WeightExercises/ErectorSpinae/BWBirdDog | https://web.archive.org/web/20230531114932/https://exrx.net/WeightExercises/ErectorSpinae/BWBirdDog |
| exrx-ErectorSpinae/TBDeadlift | ExRx.net | TBDeadlift | https://exrx.net/WeightExercises/ErectorSpinae/TBDeadlift | https://web.archive.org/web/20210506155208/https://exrx.net/WeightExercises/ErectorSpinae/TBDeadlift |
| exrx-Gastrocnemius/BWStandingCalfRaise | ExRx.net | BWStandingCalfRaise | https://exrx.net/WeightExercises/Gastrocnemius/BWStandingCalfRaise | https://web.archive.org/web/20210501093132/https://exrx.net/WeightExercises/Gastrocnemius/BWStandingCalfRaise |
| exrx-Gastrocnemius/DBSingleLegCalfRaise | ExRx.net | DBSingleLegCalfRaise | https://exrx.net/WeightExercises/Gastrocnemius/DBSingleLegCalfRaise | https://web.archive.org/web/20230609053308/https://exrx.net/WeightExercises/Gastrocnemius/DBSingleLegCalfRaise |
| exrx-Gastrocnemius/LVStandingCalfRaise | ExRx.net | LVStandingCalfRaise | https://exrx.net/WeightExercises/Gastrocnemius/LVStandingCalfRaise | https://web.archive.org/web/20230407071949/https://exrx.net/WeightExercises/Gastrocnemius/LVStandingCalfRaise |
| exrx-Gastrocnemius/SL45CalfPress | ExRx.net | SL45CalfPress | https://exrx.net/WeightExercises/Gastrocnemius/SL45CalfPress | https://web.archive.org/web/20231122093928/https://exrx.net/WeightExercises/Gastrocnemius/SL45CalfPress |
| exrx-GluteusMaximus/BBHipThrust | ExRx.net | BBHipThrust | https://exrx.net/WeightExercises/GluteusMaximus/BBHipThrust | https://web.archive.org/web/20210507002610/https://exrx.net/WeightExercises/GluteusMaximus/BBHipThrust |
| exrx-Hamstrings/BBGoodMorning | ExRx.net | BBGoodMorning | https://exrx.net/WeightExercises/Hamstrings/BBGoodMorning | https://web.archive.org/web/20230311202405/https://exrx.net/WeightExercises/Hamstrings/BBGoodMorning |
| exrx-Hamstrings/DBStraightLegDeadlift | ExRx.net | DBStraightLegDeadlift | https://exrx.net/WeightExercises/Hamstrings/DBStraightLegDeadlift | https://web.archive.org/web/20220203041733/https://exrx.net/WeightExercises/Hamstrings/DBStraightLegDeadlift |
| exrx-HipFlexors/STMountainClimber | ExRx.net | STMountainClimber | https://exrx.net/WeightExercises/HipFlexors/STMountainClimber | https://web.archive.org/web/20190922161058/https://www.exrx.net/WeightExercises/HipFlexors/STMountainClimber |
| exrx-Kettlebell/KBTwoArmSwing | ExRx.net | KBTwoArmSwing | https://exrx.net/WeightExercises/Kettlebell/KBTwoArmSwing | https://web.archive.org/web/20230406171303/https://exrx.net/WeightExercises/Kettlebell/KBTwoArmSwing |
| exrx-LatissimusDorsi/BWPullup | ExRx.net | BWPullup | https://exrx.net/WeightExercises/LatissimusDorsi/BWPullup | https://web.archive.org/web/20230524140351/https://exrx.net/WeightExercises/LatissimusDorsi/BWPullup |
| exrx-LatissimusDorsi/BWPullupN | ExRx.net | BWPullupN | https://exrx.net/WeightExercises/LatissimusDorsi/BWPullupN | https://web.archive.org/web/20220412004706/https://exrx.net/WeightExercises/LatissimusDorsi/BWPullupN |
| exrx-LatissimusDorsi/BWUnderhandChinup | ExRx.net | BWUnderhandChinup | https://exrx.net/WeightExercises/LatissimusDorsi/BWUnderhandChinup | https://web.archive.org/web/20230523091658/https://exrx.net/WeightExercises/LatissimusDorsi/BWUnderhandChinup |
| exrx-LatissimusDorsi/CBFrontPulldown | ExRx.net | CBFrontPulldown | https://exrx.net/WeightExercises/LatissimusDorsi/CBFrontPulldown | https://web.archive.org/web/20221216151339/https://exrx.net/WeightExercises/LatissimusDorsi/CBFrontPulldown |
| exrx-OlympicLifts/PushPress | ExRx.net | PushPress | https://exrx.net/WeightExercises/OlympicLifts/PushPress | https://web.archive.org/web/20220802212347/https://exrx.net/WeightExercises/OlympicLifts/PushPress |
| exrx-OlympicLifts/RomanianDeadlift | ExRx.net | RomanianDeadlift | https://exrx.net/WeightExercises/OlympicLifts/RomanianDeadlift | https://web.archive.org/web/20230304211839/https://exrx.net/WeightExercises/OlympicLifts/RomanianDeadlift |
| exrx-PectoralClavicular/BBInclineBenchPress | ExRx.net | BBInclineBenchPress | https://exrx.net/WeightExercises/PectoralClavicular/BBInclineBenchPress | https://web.archive.org/web/20230302054321/https://exrx.net/WeightExercises/PectoralClavicular/BBInclineBenchPress |
| exrx-PectoralClavicular/DBInclineBenchPress | ExRx.net | DBInclineBenchPress | https://exrx.net/WeightExercises/PectoralClavicular/DBInclineBenchPress | https://web.archive.org/web/20220914021856/https://exrx.net/WeightExercises/PectoralClavicular/DBInclineBenchPress |
| exrx-PectoralSternal/BBBenchPress | ExRx.net | BBBenchPress | https://exrx.net/WeightExercises/PectoralSternal/BBBenchPress | https://web.archive.org/web/20230320115018/https://exrx.net/WeightExercises/PectoralSternal/BBBenchPress |
| exrx-PectoralSternal/BWInclinePushup | ExRx.net | BWInclinePushup | https://exrx.net/WeightExercises/PectoralSternal/BWInclinePushup | https://web.archive.org/web/20230525113310/https://exrx.net/WeightExercises/PectoralSternal/BWInclinePushup |
| exrx-PectoralSternal/BWPushup | ExRx.net | BWPushup | https://exrx.net/WeightExercises/PectoralSternal/BWPushup | https://web.archive.org/web/20230523091736/https://exrx.net/WeightExercises/PectoralSternal/BWPushup |
| exrx-PectoralSternal/CBStandingFly | ExRx.net | CBStandingFly | https://exrx.net/WeightExercises/PectoralSternal/CBStandingFly | https://web.archive.org/web/20210411175352/https://exrx.net/WeightExercises/PectoralSternal/CBStandingFly |
| exrx-PectoralSternal/DBBenchPress | ExRx.net | DBBenchPress | https://exrx.net/WeightExercises/PectoralSternal/DBBenchPress | https://web.archive.org/web/20221218023649/https://exrx.net/WeightExercises/PectoralSternal/DBBenchPress |
| exrx-PectoralSternal/DBFly | ExRx.net | DBFly | https://exrx.net/WeightExercises/PectoralSternal/DBFly | https://web.archive.org/web/20220818045122/https://exrx.net/WeightExercises/PectoralSternal/DBFly |
| exrx-PectoralSternal/LVChestPress | ExRx.net | LVChestPress | https://exrx.net/WeightExercises/PectoralSternal/LVChestPress | https://web.archive.org/web/20231122040539/https://exrx.net/WeightExercises/PectoralSternal/LVChestPress |
| exrx-Quadriceps/BBFrontSquat | ExRx.net | BBFrontSquat | https://exrx.net/WeightExercises/Quadriceps/BBFrontSquat | https://web.archive.org/web/20230304211839/https://exrx.net/WeightExercises/Quadriceps/BBFrontSquat |
| exrx-Quadriceps/BBFullSquat | ExRx.net | BBFullSquat | https://exrx.net/WeightExercises/Quadriceps/BBFullSquat | https://web.archive.org/web/20221204065643/https://exrx.net/WeightExercises/Quadriceps/BBFullSquat |
| exrx-Quadriceps/BWSingleLegSquat | ExRx.net | BWSingleLegSquat | https://exrx.net/WeightExercises/Quadriceps/BWSingleLegSquat | https://web.archive.org/web/20230314202344/https://exrx.net/WeightExercises/Quadriceps/BWSingleLegSquat |
| exrx-Quadriceps/CBSquatBelt | ExRx.net | CBSquatBelt | https://exrx.net/WeightExercises/Quadriceps/CBSquatBelt | https://web.archive.org/web/20191210074910/https://exrx.net/WeightExercises/Quadriceps/CBSquatBelt |
| exrx-Quadriceps/DBLunge | ExRx.net | DBLunge | https://exrx.net/WeightExercises/Quadriceps/DBLunge | https://web.archive.org/web/20221218023658/https://exrx.net/WeightExercises/Quadriceps/DBLunge |
| exrx-Quadriceps/DBRearLunge | ExRx.net | DBRearLunge | https://exrx.net/WeightExercises/Quadriceps/DBRearLunge | https://web.archive.org/web/20231227040116/https://exrx.net/WeightExercises/Quadriceps/DBRearLunge |
| exrx-Quadriceps/DBSingleLegSplitSquat | ExRx.net | DBSingleLegSplitSquat | https://exrx.net/WeightExercises/Quadriceps/DBSingleLegSplitSquat | https://web.archive.org/web/20220920153216/https://exrx.net/WeightExercises/Quadriceps/DBSingleLegSplitSquat |
| exrx-Quadriceps/DBStepUp | ExRx.net | DBStepUp | https://exrx.net/WeightExercises/Quadriceps/DBStepUp | https://web.archive.org/web/20220826035241/https://exrx.net/WeightExercises/Quadriceps/DBStepUp |
| exrx-Quadriceps/DBWalkingLunge | ExRx.net | DBWalkingLunge | https://exrx.net/WeightExercises/Quadriceps/DBWalkingLunge | https://web.archive.org/web/20221225223024/https://exrx.net/WeightExercises/Quadriceps/DBWalkingLunge |
| exrx-Quadriceps/LVSeatedLegPress | ExRx.net | LVSeatedLegPress | https://exrx.net/WeightExercises/Quadriceps/LVSeatedLegPress | https://web.archive.org/web/20230304211727/https://exrx.net/WeightExercises/Quadriceps/LVSeatedLegPress |
| exrx-Quadriceps/SL45LegPress | ExRx.net | SL45LegPress | https://exrx.net/WeightExercises/Quadriceps/SL45LegPress | https://web.archive.org/web/20220924004705/https://exrx.net/WeightExercises/Quadriceps/SL45LegPress |
| exrx-Quadriceps/SLHackSquat | ExRx.net | SLHackSquat | https://exrx.net/WeightExercises/Quadriceps/SLHackSquat | https://web.archive.org/web/20220924004705/https://exrx.net/WeightExercises/Quadriceps/SLHackSquat |
| exrx-RectusAbdominis/BWCrunch | ExRx.net | BWCrunch | https://exrx.net/WeightExercises/RectusAbdominis/BWCrunch | https://web.archive.org/web/20230523091650/https://exrx.net/WeightExercises/RectusAbdominis/BWCrunch |
| exrx-TrapeziusUpper/BBShrug | ExRx.net | BBShrug | https://exrx.net/WeightExercises/TrapeziusUpper/BBShrug | https://web.archive.org/web/20230306153926/https://exrx.net/WeightExercises/TrapeziusUpper/BBShrug |
| exrx-TrapeziusUpper/DBShrug | ExRx.net | DBShrug | https://exrx.net/WeightExercises/TrapeziusUpper/DBShrug | https://web.archive.org/web/20240105211625/https://exrx.net/WeightExercises/TrapeziusUpper/DBShrug |
| exrx-Triceps/BBCloseGripBenchPress | ExRx.net | BBCloseGripBenchPress | https://exrx.net/WeightExercises/Triceps/BBCloseGripBenchPress | https://web.archive.org/web/20240105211522/https://exrx.net/WeightExercises/Triceps/BBCloseGripBenchPress |
| exrx-Triceps/BBLyingTriExt | ExRx.net | BBLyingTriExt | https://exrx.net/WeightExercises/Triceps/BBLyingTriExt | https://web.archive.org/web/20220926203416/https://exrx.net/WeightExercises/Triceps/BBLyingTriExt |
| exrx-Triceps/BWBenchDip | ExRx.net | BWBenchDip | https://exrx.net/WeightExercises/Triceps/BWBenchDip | https://web.archive.org/web/20220823003741/https://exrx.net/WeightExercises/Triceps/BWBenchDip |
| exrx-Triceps/CBPushdown | ExRx.net | CBPushdown | https://exrx.net/WeightExercises/Triceps/CBPushdown | https://web.archive.org/web/20220816182710/https://exrx.net/WeightExercises/Triceps/CBPushdown |
| exrx-Triceps/CBStandingTricepsExtensionRope | ExRx.net | CBStandingTricepsExtensionRope | https://exrx.net/WeightExercises/Triceps/CBStandingTricepsExtensionRope | https://web.archive.org/web/20220403090026/https://exrx.net/WeightExercises/Triceps/CBStandingTricepsExtensionRope |
| exrx-Triceps/CBTriExt | ExRx.net | CBTriExt | https://exrx.net/WeightExercises/Triceps/CBTriExt | https://web.archive.org/web/20231228115509/https://exrx.net/WeightExercises/Triceps/CBTriExt |
| exrx-Triceps/DBTriExt | ExRx.net | DBTriExt | https://exrx.net/WeightExercises/Triceps/DBTriExt | https://web.archive.org/web/20220816182656/https://exrx.net/WeightExercises/Triceps/DBTriExt |
| fabrykasily-odwodzenie-linek-w-tyl-wyciagu-stojac | Atlas ćwiczeń Fabryka Siły | Odwodzenie linek w tyl wyciagu stojac | https://www.fabrykasily.pl/cwiczenia/na-barki/odwodzenie-linek-w-tyl-wyciagu-stojac | — |
| fedb-alternating-deltoid-raise | free-exercise-db | Alternating Deltoid Raise | https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Alternating_Deltoid_Raise.json | — |
| fedb-barbell-incline-shoulder-raise | free-exercise-db | Barbell Incline Shoulder Raise | https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Incline_Shoulder_Raise.json | — |
| fedb-one-arm-incline-lateral-raise | free-exercise-db | One Arm Incline Lateral Raise | https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Incline_Lateral_Raise.json | — |
| fedb-sled-reverse-flye | free-exercise-db | Sled Reverse Flye | https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Sled_Reverse_Flye.json | — |
| fedb-standing-front-barbell-raise-over-head | free-exercise-db | Standing Front Barbell Raise Over Head | https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Front_Barbell_Raise_Over_Head.json | — |
| fedb-straight-raises-on-incline-bench | free-exercise-db | Straight Raises on Incline Bench | https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Straight_Raises_on_Incline_Bench.json | — |
| fitnall-barbell-overhead-front-raise | Fitnall | Barbell overhead front raise | https://fitnall.com/exercises/barbell-overhead-front-raise/ | — |
| fitnessvolt-cable-rear-delt-exercises | Fitness Volt | Cable rear delt exercises | https://fitnessvolt.com/cable-rear-delt-exercises/ | — |
| fitvibe-cable-y-raise-668 | FitVibe | Cable y raise 668 | https://fitvibe.gr/askiseis/cable-y-raise-668 | — |
| hci-neck-exercises | Huntsman Cancer Institute, University of Utah Health | Neck Exercises (fact sheet, 2022) | https://hci-portal.hci.utah.edu/sites/factsheets/Shared%20Documents/neck-exercises.pdf | — |
| healthwise-columbia-shoulder-er | WebMD Ignite | Shoulder external rotation (resisted) | https://www.columbiadoctors.org/health-library/multimedia/shoulder-external-rotation-resisted/ | — |
| healthwise-columbia-shoulder-ir | WebMD Ignite | Shoulder internal rotation (resisted) | https://www.columbiadoctors.org/health-library/multimedia/shoulder-internal-rotation-resisted/ | — |
| hofmann-2014 | Hofmann i in. (Cybex Research Institute) | …handrail-use instructions… inclined treadmill walking, Int J Exerc Sci 7(4):339–345 (abstrakt) | https://digitalcommons.wku.edu/ijes/vol7/iss4/10 | — |
| hss-back-neck-stretches | HSS | HSS Rehabilitation and Performance, Back and Neck Stretches (17.02.2021) | https://www.hss.edu/health-library/move-better/back-neck-stretches | — |
| hss-bike | HSS | A. Karp, How to Set Up an Exercise (or Spin) Bike Properly (21.12.2020) | https://www.hss.edu/health-library/move-better/set-up-exercise-bike | — |
| hss-shoulder-strengthening-program | HSS | Shoulder strengthening program | https://www.hss.edu/globalassets/physician-files/sutton/shoulder-strengthening-program.pdf | — |
| hss-sutton-shoulder-program | HSS | Shoulder Rotator Cuff and Scapular Strengthening Program | https://hss.edu/sutton/shoulder-strengthening-program.pdf | — |
| hwq-cat-cow | Health and Wellbeing Queensland | Cat and cow stretch | https://hw.qld.gov.au/?p=41297 | — |
| insportline-qt1005 | inSPORTline | Plyometric Box Set — instrukcja (QT1005), s. 3 „Plyo Boxes Exercises” | https://www.insportline.eu/upload/file/7267_manual_QT1005_or.pdf | — |
| ironmind-split | IronMind | Jim Schmitz: Split Lifting Technique (ok. 07.2012 — data z wpisu IronMind News 06.07.2012, który go zapowiada) | https://ironmind.com/articles/jim-schmitz-on-the-lifts/Split-Lifting-Technique/ | — |
| issaonline-upright-row-muscles-worked-benefits-proper-form-m | ISSA | Upright row muscles worked benefits proper form more | https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more | — |
| leeds-ankle-phase2 | Leeds Teaching Hospitals NHS Trust, Physiotherapy Department | Ankle Phase 2 Exercises (A. Brogden, 27.01.2022) | https://www.leedsth.nhs.uk/wp-content/uploads/2023/05/Metatarsal-Phase-2-exercises.pdf | — |
| lifefitness-rails | Life Fitness | Is Treadmill Calorie Burn Affected by Holding the Handrails? (29.07.2024) | https://lifefitness.com/en-us/customer-support/education-hub/blog/treadmill-calorie-burn-affected-holding-handrails | — |
| lifetime-thruster | Experience Life | How to Do the Thruster (Experience Life, M. Fazeli Fard, RKC, 19.06.2024) | https://experiencelife.lifetime.life/article/how-to-do-the-thruster/ | — |
| livewell-lower-limb-stretch | Livewell Southwest | Lower Limb Muscle Stretching Exercises, v2 04.2016 (PDF, 2 s.) | https://www.livewellsouthwest.co.uk/wp-content/uploads/2023/06/Adult-Stretching-Leafelt-V2-April-2016.pdf | — |
| maniacmuscle-cable-crossover-reverse-fly | ManiacMuscle | Cable crossover reverse fly | https://maniacmuscle.com/cable-crossover-reverse-fly/ | — |
| maniacmuscle-dumbbell-standing-driver | ManiacMuscle | Dumbbell standing driver | https://maniacmuscle.com/dumbbell-standing-driver/ | — |
| medlineplus-chest-stretch | MedlinePlus | Chest stretch (Medical Encyclopedia image page) | https://medlineplus.gov/ency/imagepages/19483.htm | — |
| msdmanuals-prone-shoulder-horizontal-abduction | Tomah Memorial Hospital | Prone shoulder horizontal abduction | https://www.msdmanuals.com/professional/multimedia/video/prone-shoulder-horizontal-abduction | — |
| mullane-2021 | Mullane, Turner, Bishop (Middlesex University) | Exercise Technique: The Pallof Press, Strength Cond J 43(2):121–128 (rękopis) | https://repository.mdx.ac.uk/item/89098 | — |
| nasm-barbell-bench-press | NASM | Barbell Bench Press | https://www.nasm.org/resource-center/exercise-library/barbell-bench-press | — |
| nasm-barbell-bicep-curl | NASM | Barbell Bicep Curl | https://www.nasm.org/resource-center/exercise-library/barbell-bicep-curl | — |
| nasm-barbell-deadlift | NASM | Barbell Deadlift | https://www.nasm.org/resource-center/exercise-library/barbell-deadlift | — |
| nasm-bench-dips | NASM | Bench Dips | https://www.nasm.org/resource-center/exercise-library/bench-dips | — |
| nasm-best-abs | NASM | Best Abs Exercises (blog, H. Cherry, akt. 23.07.2026) | https://www.nasm.org/resource-center/blog/training/best-abs-exercises | — |
| nasm-bird-dog | NASM | Bird Dog | https://www.nasm.org/resource-center/exercise-library/bird-dog | — |
| nasm-box-jumps | NASM | Box Jumps | https://www.nasm.org/resource-center/exercise-library/box-jumps | — |
| nasm-bulgarian-split-squat | NASM | Bulgarian Split Squat | https://www.nasm.org/resource-center/exercise-library/bulgarian-split-squat | — |
| nasm-cable-crossover | NASM | Cable Crossover | https://www.nasm.org/resource-center/exercise-library/cable-crossover | — |
| nasm-calf-blog | NASM | Calf Training: How to Program This Stubborn Muscle Group (blog, H. Cherry, akt. 25.07.2026) | https://www.nasm.org/resource-center/blog/training/calf-training-how-to-program-this-stubborn-muscle-group-for-clients | — |
| nasm-chest-press-machine | NASM | Chest Press Machine | https://www.nasm.org/resource-center/exercise-library/chest-press-machine | — |
| nasm-close-grip-bench-press | NASM | Close Grip Bench Press | https://www.nasm.org/resource-center/exercise-library/close-grip-bench-press | — |
| nasm-dead-bug | NASM | Dead Bug | https://www.nasm.org/resource-center/exercise-library/dead-bug | — |
| nasm-dumbbell-front-squat | NASM | Dumbbell Front Squat | https://www.nasm.org/resource-center/exercise-library/dumbbell-front-squat | — |
| nasm-dumbbell-romanian-deadlift | NASM | Dumbbell Romanian Deadlift | https://www.nasm.org/resource-center/exercise-library/dumbbell-romanian-deadlift | — |
| nasm-face-pull | NASM | Face Pull | https://www.nasm.org/resource-center/exercise-library/face-pull | — |
| nasm-floor-bridge | NASM | Floor Bridge | https://www.nasm.org/resource-center/exercise-library/floor-bridge | — |
| nasm-foam-roll-calves | NASM | Foam Roll Calves | https://www.nasm.org/resource-center/exercise-library/foam-roll-calves | — |
| nasm-foam-roll-latissimus-dorsi | NASM | Foam Roll Latissimus Dorsi | https://www.nasm.org/resource-center/exercise-library/foam-roll-latissimus-dorsi | — |
| nasm-goblet-squat | NASM | Goblet Squat | https://www.nasm.org/resource-center/exercise-library/goblet-squat | — |
| nasm-good-mornings | NASM | Good Mornings | https://www.nasm.org/resource-center/exercise-library/good-mornings | — |
| nasm-incline-barbell-bench-press | NASM | Incline Barbell Bench Press | https://www.nasm.org/resource-center/exercise-library/incline-barbell-bench-press | — |
| nasm-incline-push-up | NASM | Incline Push Up | https://www.nasm.org/resource-center/exercise-library/incline-push-up | — |
| nasm-kettlebell-deadlift | NASM | Kettlebell Deadlift | https://www.nasm.org/resource-center/exercise-library/kettlebell-deadlift | — |
| nasm-leg-press | NASM | Leg Press | https://www.nasm.org/resource-center/exercise-library/leg-press | — |
| nasm-leg-press-calf-raise | NASM | Leg Press Calf Raise | https://www.nasm.org/resource-center/exercise-library/leg-press-calf-raise | — |
| nasm-lying-leg-curl | NASM | Lying Leg Curl | https://www.nasm.org/resource-center/exercise-library/lying-leg-curl | — |
| nasm-plank | NASM | Plank | https://www.nasm.org/resource-center/exercise-library/plank | — |
| nasm-pull-up | NASM | Pull Up | https://www.nasm.org/resource-center/exercise-library/pull-up | — |
| nasm-push-up | NASM | Push Up | https://www.nasm.org/resource-center/exercise-library/push-up | — |
| nasm-romanian-deadlift-barbell | NASM | Romanian Deadlift Barbell | https://www.nasm.org/resource-center/exercise-library/romanian-deadlift-barbell | — |
| nasm-running-gait | NASM | Running Gait Basics (blog, B. Sutton, akt. 29.06.2026) | https://www.nasm.org/resource-center/blog/training/running-gait-basics-what-personal-trainers-should-screen-for | — |
| nasm-russian-twist | NASM | Russian Twist | https://www.nasm.org/resource-center/exercise-library/russian-twist | — |
| nasm-seated-leg-curl | NASM | Seated Leg Curl | https://www.nasm.org/resource-center/exercise-library/seated-leg-curl | — |
| nasm-seated-machine-row-close-grip | NASM | Seated Machine Row Close Grip | https://www.nasm.org/resource-center/exercise-library/seated-machine-row-close-grip | — |
| nasm-side-plank | NASM | Side Plank | https://www.nasm.org/resource-center/exercise-library/side-plank | — |
| nasm-single-leg-seated-leg-curl | NASM | Single-Leg Seated Leg Curl | https://www.nasm.org/resource-center/exercise-library/single-leg-seated-leg-curl | — |
| nasm-single-leg-squat | NASM | Single Leg Squat | https://www.nasm.org/resource-center/exercise-library/single-leg-squat | — |
| nasm-squat-jump | NASM | Squat Jump | https://www.nasm.org/resource-center/exercise-library/squat-jump | — |
| nasm-squat-thrust-burpees | NASM | Squat Thrust Burpees | https://www.nasm.org/resource-center/exercise-library/squat-thrust-burpees | — |
| nasm-tuck-jump | NASM | Tuck Jump | https://www.nasm.org/resource-center/exercise-library/tuck-jump | — |
| nasm-two-arm-dumbbell-chest-press-with-band | NASM | Two Arm Dumbbell Chest Press With Band | https://www.nasm.org/resource-center/exercise-library/two-arm-dumbbell-chest-press-with-band | — |
| nasm-two-arm-incline-dumbbell-chest-press | NASM | Two Arm Incline Dumbbell Chest Press | https://www.nasm.org/resource-center/exercise-library/two-arm-incline-dumbbell-chest-press | — |
| nfpt-how-to-do-incline-side-lateral-dumbbell-raises | NFPT | How to do incline side lateral dumbbell raises | https://nfpt.com/how-to-do-incline-side-lateral-dumbbell-raises/ | — |
| nhs-flexibility | NHS (nhs.uk) | Flexibility exercises | https://www.nhs.uk/live-well/exercise/flexibility-exercises/ | — |
| nhs-shrops-calf | Shropshire Community Health NHS Trust | Calf Stretching Information Leaflet | https://www.shropscommunityhealth.nhs.uk/content/doclib/13861.pdf | — |
| nhs-southtees-side-lying | South Tees Hospitals NHS Foundation Trust | Rotator cuff in side lying | https://www.southtees.nhs.uk/resources/rotator-cuff-in-side-lying/ | — |
| nhs-wwl-neck | Wrightington, Wigan and Leigh Teaching Hospitals NHS FT | Neck and Upper Back Exercises Level 1 (Tpy 023, v2) | https://www.wwl.nhs.uk/pdfreader/accessiblePDF/cnv-wwl-68ca8bce9edd73.73954624 | — |
| nordictrack-incline | NordicTrack | Incline treadmill benefits… (15.07.2025) | https://www.nordictrack.com/learn/incline-treadmill-benefits-why-it-works-better-than-flat-walking | — |
| nsca-basics-2012 | NSCA | Sands, Wurth, Hewit: NSCA — Basics of Strength and Conditioning Manual, NSCA 2012 | https://www.nsca.com/uploadedFiles/NSCA/Resources/PDF/Publications/basics_of_strength_and_conditioning_manual.pdf | — |
| nsca-coach-7-3 | NSCA | Taylor, Reed: Increase Hip and Trunk Stability with Loaded Carries…, NSCA Coach 7.3 | https://www.nsca.com/contentassets/927868f8d4bb45f2ac4429631d558d83/coach-7.3.6-increase-hip-and-trunk-stability-with-loaded-carries-for-injury-prevention-rehabilitation-and-performance.pdf | — |
| orthobethesda-foam-rolling | OrthoBethesda Therapy Services | Foam Rolling (FR) Exercises (PDF, 2 s., 2015) | https://www.orthobethesda.com/foam-rolling-exercises/ | — |
| orthoindy-itb-program | OrthoIndy Physical Therapy | IT Band Home Exercise Program (PDF, rev. 8/15) | https://orthoindy.com/wp-content/uploads/IT-Band-Program.pdf | — |
| osu-foam-rolling | Ohio State University Wexner Medical Center | Foam Rolling Exercises (transkrypcja filmu) | https://wexnermedical.osu.edu/-/media/transcripts/wexnermedical/blog/2y2leqbvrgw_foamrollingexercises.txt | — |
| physitrack-heel-raise-step | Physitrack | Heel raises on a step | https://us.physitrack.com/home-exercise-video/heel-raises-on-a-step | — |
| pm-14636100 | Fry, Smith, Schilling (University of Memphis) | Fry i in. 2003, Effect of knee position on hip and knee torques during the barbell squat, J Strength Cond Res 17(4) — abstrakt | https://pubmed.ncbi.nlm.nih.gov/14636100/ | — |
| pm-21659894 | Swinton i in. (Robert Gordon University) | Swinton i in. 2011, A biomechanical analysis of straight and hexagonal barbell deadlifts…, J Strength Cond Res 25(7) — abstrakt | https://pubmed.ncbi.nlm.nih.gov/21659894/ | — |
| pmc-10015931 | Baffour-Awuah i in. (University of New England) | An evidence-based guide to… isometric resistance training in hypertension, Clin Hypertens 2023 | https://pmc.ncbi.nlm.nih.gov/articles/PMC10015931/ | — |
| pmc-10624851 | Chen, Wu, Guo (Beijing Sport University i in.) | Nordic hamstring exercises in functional knee rehabilitation after ACL reconstruction, Sci Rep 2023 | https://pmc.ncbi.nlm.nih.gov/articles/PMC10624851/ | — |
| pmc-10753835 | Kinoshita i in. (Ritsumeikan University) | Triceps surae muscle hypertrophy is greater after standing versus seated calf-raise training, Front Physiol 2023 | https://pmc.ncbi.nlm.nih.gov/articles/PMC10753835/ | — |
| pmc-10786991 | Lea, O’Driscoll, Wiles (Canterbury Christ Church University) | Home-based isometric wall squat intervention…, Eur J Appl Physiol 2023 | https://pmc.ncbi.nlm.nih.gov/articles/PMC10786991/ | — |
| pmc-11050476 | Krobot Cutura i in. (University of Zagreb) | Evaluating Intraocular Pressure Alterations during Large Muscle Group Isometric Exercises…, IJERPH 2024 (sekcja 2.2.2) | https://pmc.ncbi.nlm.nih.gov/articles/PMC11050476/ | — |
| pmc-11964695 | Lyons i in. (University of Central Florida) | …Following 45-Degree Roman Chair Exercise, Int J Sports Phys Ther 2025 | https://pmc.ncbi.nlm.nih.gov/articles/PMC11964695/ | — |
| pmc-12225522 | Ripley i in. (University of Salford) | Kinematic, neuromuscular and bicep femoris in vivo mechanics during the NHE…, Muscles 2024 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12225522/ | — |
| pmc-12286126 | Tsartsapakis i in. (Aristotle University of Thessaloniki) | Development and Implementation of a Core Training Protocol…, Methods Protoc 2025 (sekcja 3.2) | https://pmc.ncbi.nlm.nih.gov/articles/PMC12286126/ | — |
| pmc-12621570 | Havers i in. (IST University of Applied Sciences) | Partial Range, Full Gains?…, Eur J Sport Sci 2025 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12621570/ | — |
| pmc-13029269 | Intziegianni i in. (UCLan Cyprus) | EMG… Standard, Diamond, and Wide Hand Position Push-Ups, Muscles 2026 | https://pmc.ncbi.nlm.nih.gov/articles/PMC13029269/ | — |
| pmc-13449400 | Ng i in. (Chinese University of Hong Kong) | Isometric resistance exercise… study protocol for a RCT, Trials 2026 | https://pmc.ncbi.nlm.nih.gov/articles/PMC13449400/ | — |
| pmc-13517625 | Ghigiarelli i in. (Hofstra University) | Concurrent Validity… (MR EMG)… During the Leg Extension Exercise, Sensors 2026 | https://pmc.ncbi.nlm.nih.gov/articles/PMC13517625/ | — |
| pmc-3658404 | Manske, Reiman (Wichita State University, Duke University) | Functional Performance Testing for Power and Return to Sports, Sports Health 2013 (Trunk Power Tests) | https://pmc.ncbi.nlm.nih.gov/articles/PMC3658404/ | — |
| pmc-4732391 | Marcolin i in. (University of Padova) | Selective Activation of Shoulder, Trunk, and Arm Muscles… Push-Up Variants, J Athl Train 2015 | https://pmc.ncbi.nlm.nih.gov/articles/PMC4732391/ | — |
| pmc-4887549 | Moore (Cardiff Metropolitan University) | Is There an Economical Running Technique?…, Sports Med 2016 | https://pmc.ncbi.nlm.nih.gov/articles/PMC4887549/ | — |
| pmc-5473370 | Folland i in. (Loughborough University) | Running Technique is an Important Component of Running Economy and Performance, MSSE 2017 | https://pmc.ncbi.nlm.nih.gov/articles/PMC5473370/ | — |
| pmc-6724584 | Suchomel i in. (J Hum Kinet 2019) | The Effect of Load Placement on the Power Production Characteristics of Three Lower Extremity Jumping Exercises (J Hum Kinet 2019) | https://pmc.ncbi.nlm.nih.gov/articles/PMC6724584/ | — |
| pmc-7343795 | de Oliveira i in. (Federal University of Paraná) | …handrail support… during maximal exercise testing, Sci Rep 2020 | https://pmc.ncbi.nlm.nih.gov/articles/PMC7343795/ | — |
| pmc-7460162 | Nunes i in. (Londrina State University) | …Cable vs. Barbell Preacher Curl Training…, IJERPH 2020 | https://pmc.ncbi.nlm.nih.gov/articles/PMC7460162/ | — |
| pmc-8057707 | Andersen i in. (Western Norway University of Applied Sciences) | Comparison of Muscle Activity in Three Single-Joint, Hip Extension Exercises…, J Sports Sci Med 2021 | https://pmc.ncbi.nlm.nih.gov/articles/PMC8057707/ | — |
| pmc-8152048 | Hasani i in. (Monash University) | LOAD-intensity and time-under-tension… feasibility, BMC Sports Sci Med Rehabil 2021 | https://pmc.ncbi.nlm.nih.gov/articles/PMC8152048/ | — |
| pmc-9517252 | Polevoy i in. (Moscow Aviation Institute i in.) | The Influence of Burpee on Endurance and Short-Term Memory of Adolescents, IJERPH 2022 | https://pmc.ncbi.nlm.nih.gov/articles/PMC9517252/ | — |
| pmc-9528903 | Plotkin i in. (CUNY Lehman College) | Progressive overload without progressing load?…, PeerJ 2022 | https://pmc.ncbi.nlm.nih.gov/articles/PMC9528903/ | — |
| potreningu-odwodzenie-ramion-w-tyl-na-wyciagu-gornym-stojac | Atlas ćwiczeń potreningu.pl | Odwodzenie ramion w tyl na wyciagu gornym stojac | https://potreningu.pl/atlas-cwiczen/dla-mezczyzn/348/odwodzenie-ramion-w-tyl-na-wyciagu-gornym-stojac | — |
| potreningu-unoszenie-ramion-bokiem-w-opadzie-tulowia-w-brami | Atlas ćwiczeń potreningu.pl | Unoszenie ramion bokiem w opadzie tulowia w bramie | https://potreningu.pl/atlas-cwiczen/dla-kobiet/357/unoszenie-ramion-bokiem-w-opadzie-tulowia-w-bramie | — |
| prehab-heel-raise-off-step | The Prehab Guys | Heel Raise – Off Step | https://theprehabguys.com/vimeo-video/heel-raise-off-step/ | — |
| rep-sled-push | REP Fitness | Sled Push Technique Guide (2026) | https://repfitness.com/blogs/training/sled-push-technique | — |
| rep-wall-balls | REP Fitness | How to Improve Your Wall Balls | https://uk.repfitness.com/blogs/training/wall-balls | — |
| rfl-mb-chest-throw | RFL | Med Ball Chest Throw (karta PDF z oceną 1–5) | https://www.rugby-league.com/uploads/docs/Med%20Ball%20Chest%20Throw.pdf | — |
| rogue-alt-db-snatch | Rogue Fitness | Movement Demo — Alternating Dumbbell Snatch (Set Up, Execution) | https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-alternating-dumbbell-snatch | — |
| rogue-clean-pull | Rogue Fitness | Movement Demo — Clean Pull | https://www.roguefitness.com/theindex/movement-library/movement-demo-clean-pull | — |
| rogue-hang-power-snatch | Rogue Fitness | Movement Demo — Hang Power Snatch | https://www.roguefitness.com/theindex/movement-library/movement-demo-hang-power-snatch | — |
| rogue-hang-squat-clean | Rogue Fitness | Movement Demo — Hang Squat Clean | https://www.roguefitness.com/theindex/movement-library/movement-demo-hang-squat-clean | — |
| rogue-hang-squat-snatch | Rogue Fitness | Movement Demo — Hang Squat Snatch | https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-hang-squat-snatch | — |
| rogue-snatch-pull | Rogue Fitness | Movement Demo — Snatch Pull (2025) | https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-snatch-pull | — |
| sbs-how-to-bench | Stronger by Science | How to Bench Press: The Definitive Guide (Greg Nuckols) | https://www.strongerbyscience.com/how-to-bench/ | — |
| sbs-how-to-deadlift | Stronger by Science | How to Deadlift: The Definitive Guide (Greg Nuckols) | https://www.strongerbyscience.com/how-to-deadlift/ | — |
| sbs-how-to-squat | Stronger by Science | How to Squat: The Definitive Guide (Greg Nuckols) | https://www.strongerbyscience.com/how-to-squat/ | — |
| setforset-sled-workouts | SET FOR SET | Sled workouts | https://www.setforset.com/blogs/news/sled-workouts | — |
| sf-go-ballistic-jerk | StrongFirst | Go Ballistic—The Jerk for Barbell and Kettlebell (M. Kwon Gracia) | https://www.strongfirst.com/go-ballistic-the-jerk-for-barbell-and-kettlebell/ | — |
| southtees-cat-stretch | South Tees Hospitals NHS Foundation Trust | Cat stretch (Physiotherapy) | https://www.southtees.nhs.uk/?p=31588 | — |
| torokhtiy-barbell-squat-jump | Torokhtiy | Barbell Squat Jump (O. Torokhtiy, akt. 16.09.2024) | https://torokhtiy.com/blogs/guides/barbell-squat-jump | — |
| torokhtiy-snatch-balance | Torokhtiy | Snatch Balance (O. Torokhtiy, olimpijczyk, PhD nauk o sporcie, 15.10.2026) | https://store.torokhtiy.com/blogs/exercises/snatch-balance | — |
| torque-utg-2024 | Torque Fitness | Ultimate TANK Training Guide (2024, PDF; kopia u dystrybutora) | https://cdn.fitshop.co.uk/files/torque/functional_training_and_strongman/TOR-TANKMX/Ultimate_TANK_Training_Guide_2024.pdf | — |
| ucb-uhs-work-warmup | UC Berkeley University Health Services | Work Warm-Up | https://uhs.berkeley.edu/sites/default/files/wellness-generic_warmupexerciseprogram.pdf | — |
| uwmed-plantar-fasciitis | UW Medicine | Exercises for Plantar Fasciitis (Sports Medicine Clinic, PDF, 5 s.) | https://honline.s.uw.edu/sites/default/files/record_pdfs/Exercises-Plantar-Fasciitis.pdf | — |
| vdhorst-2015 | van der Horst i in. (UMC Utrecht) | The Preventive Effect of the Nordic Hamstring Exercise… RCT, Am J Sports Med 2015 | https://instituteofmotion.com/wp-content/uploads/2018/03/Nordic-hamstring-2015.pdf | — |
| wa-backward-overhead-throw | World Athletics | Backward overhead throw (Kids' Athletics, poziom 3) | https://worldathletics.org/kids-athletics/teaching-athletics/backward-overhead-throw | — |
| wa-overarm-throw | World Athletics | Overarm throw (Kids' Athletics) | https://worldathletics.org/kids-athletics/teaching-athletics/overarm-throw | — |
| webmd-ignite-ankle-circles | WebMD Ignite | Ankle Circles (akt. 01.05.2026) | https://www.columbiadoctors.org/health-library/multimedia/ankle-circles/ | — |
| webmd-ignite-childs-pose | WebMD Ignite | Child's pose (ColumbiaDoctors Health Library, stan na 01.05.2026) | https://www.columbiadoctors.org/health-library/multimedia/child-s-pose/ | — |
| webmd-ignite-wrist-circles-fist | WebMD Ignite | Wrist Circles (Fist) (akt. 01.05.2026) | https://www.columbiadoctors.org/health-library/multimedia/wrist-circles-fist/ | — |
| webmd-neck-stretch-front | WebMD Ignite | Neck stretch (front) | https://www.columbiadoctors.org/health-library/multimedia/neck-stretch-front/ | — |
| webmd-shoulder-posterior | WebMD Ignite | Shoulder stretch (posterior) | https://www.columbiadoctors.org/health-library/multimedia/shoulder-stretch-posterior/ | — |
| weighttraining-cable-y-raise | weighttraining.guide | Cable y raise | https://weighttraining.guide/exercises/cable-y-raise/ | — |
| weighttraining-incline-dumbbell-front-raise | weighttraining.guide | Incline dumbbell front raise | https://weighttraining.guide/exercises/incline-dumbbell-front-raise/ | — |
| weighttraining-incline-dumbbell-shoulder-raise | weighttraining.guide | Incline dumbbell shoulder raise | https://weighttraining.guide/exercises/incline-dumbbell-shoulder-raise/ | — |
| yogau-wide-angle | YogaUOnline | Wide-Angle Seated Forward Bend – Open Inner Thighs Safely (07.03.2026) | https://yogauonline.com/yoga-practice-teaching-tips/yoga-practice-tips/julie-gudmestad-wide-angle-seated-forward-bend-open-inner-thighs-safely/ | — |
