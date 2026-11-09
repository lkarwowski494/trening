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
| NFPT (wpisy gościnne) | National Federation of Professional Trainers — wpisy gościnne bez nazwanego autora (nfpt.com) | 5 | organizacja szkoleniowa (biblioteka ćwiczeń) |
| Fit Father Project | Fit Father Project — poradnik o ćwiczeniach (fitfatherproject.com) | 5 | serwis specjalistyczny |
| BodBot | BodBot — opisy ćwiczeń (bodbot.com) | 5 | serwis specjalistyczny |
| app-s8 | app-s8 | 5 | ? |
| Echelon Fitness | Echelon Fitness — instrukcja ćwiczeń do własnego kółka (producent, PDF 2021) | 4 | producent sprzętu |
| NSCA — Exercise Technique Manual (Human Kinetics) | NSCA — Exercise Technique Manual for Resistance Training, wyd. 4 (fragment u wydawcy Human Kinetics) | 3 | organizacja szkoleniowa (biblioteka ćwiczeń) |
| TRX | TRX — blog producenta zawieszeń (trxtraining.com) | 4 | producent sprzętu |
| Thera-Band | Thera-Band (Performance Health) — instrukcje ćwiczeń z gumami (producent gum) | 4 | producent sprzętu |
| Generation Iron | Generation Iron — przewodniki ćwiczeń (generationiron.com) | 4 (warunkowo 4: strona z autorem z kwalifikacjami i datą; inaczej szczebel 5 (docs/18, 02.11.2026, uzupełnienie 3 i K3)) | serwis specjalistyczny |
| Healthline | Healthline — artykuły o ćwiczeniach (healthline.com) | 4 (warunkowo 4: strona z nazwanym recenzentem z kwalifikacjami i datą; inaczej szczebel 5 (docs/18, 02.11.2026, uzupełnienie 3; odpowiedź 1 z 02.11.2026)) | serwis specjalistyczny |
| Mullaney i in. (Int J Sports Phys Ther 2021) | Mullaney i in. — program Thrower’s Ten, opis wykonania w załączniku (Int J Sports Phys Ther 2021;16(6)) | 3 | badanie (czasopismo recenzowane) |

## Podsumowanie

- Ćwiczenia ze wskazówkami: 276; zdań (z powtórzeniami między ćwiczeniami): 1211; unikalnych zdań: 699; źródeł: 517.
- Ćwiczenia bazowe bez wskazówek (otwarte): 15.
- Ćwiczenia z niepełnym zestawem sekcji (research potwierdził tylko część; braków nie dopisujemy z jednego źródła): 136 — Back Extension, Bieg, Burpees, Diamond Push Up, Farmer's Walk, Incline Walk (bieżnia), Leg Curl, Leg Extension, Medicine Ball Slam, Preacher Curl, Reverse Crunch, Rower, Seated Calf Raise, Straight Arm Pulldown, Suitcase Carry, Wall Sit, Wyciskanie na linkach (stojąc), Lunges (hantle), Walking Lunges, Reverse Lunge, Double Kettlebell Clean, Hang Clean, Block Clean, Block Power Clean, Split Clean, Clean Pull, Split Jerk, Power Jerk, Jerk Dip Squat, Jerk Balance, Muscle Snatch, Snatch Balance, Block Snatch, Split Snatch, Jump Squat, Tuck Jump, Weighted Jump Squat, Broad Jump, Alternate Leg Push-Off, Wall Ball, Medicine Ball Chest Pass, Backward Medicine Ball Throw, Standing Two-Arm Overhead Throw, Calves-SMR, Latissimus Dorsi-SMR, Piriformis-SMR, Rhomboids-SMR, Foot-SMR, External Rotation (hantel), Supine Figure-Four Stretch, Butterfly Stretch, Side-Lying Quad Stretch, Child's Pose, Supine Spinal Twist, The Straddle, Peroneals Stretch, Posterior Tibialis Stretch, Standing Soleus And Achilles Stretch, Cross-Body Shoulder Stretch, Overhead Triceps Stretch, Side Neck Stretch, Chest And Front Of Shoulder Stretch, Chin To Chest Stretch, Arm Circles, Ankle Circles, Wrist Circles, One-Arm Cable Rear Lateral Raise, Cable Reverse Fly, Cable Y Raise, One-Arm Incline Lateral Raise, Barbell Front Raise to Overhead, Sled Reverse Flye, Car Drivers, Front Incline Dumbbell Raise, Dumbbell Incline Shoulder Raise, Barbell Incline Shoulder Raise, Dumbbell Front Raise to Overhead, Straight Raises on Incline Bench, Single Arm Triceps Pushdown, Skullcrusher (sztanga), Standing Low-Pulley One-Arm Triceps Extension, Tate Press, Reverse Grip Triceps Pushdown, Triceps Kickback (linki), Two-Arm Dumbbell Kickback, Band Overhead Triceps Extension, Band Skull Crusher, Cable Lying Triceps Extension, Incline Barbell Triceps Extension, Decline Dumbbell Triceps Extension, Decline EZ Bar Triceps Extension, Lying Close-Grip Barbell Triceps Extension Behind The Head, One-Arm Lying Dumbbell Triceps Extension, Chain Handle Extension, Arnold Press, Seated Barbell Military Press, Kettlebell Press, Kettlebell Seated Press, Band Shoulder Press, Single Arm Overhead Press (hantel), Ab Wheel, Renegade Row, Incline Chest Fly (hantle), Decline Push Up, Suspended Push-Up, Seated Calf Raise (hantle), Barbell Seated Calf Raise, Band Calf Raise, Dumbbell Seated One-Leg Calf Raise, Cable Kickback, Fire Hydrant, Hip Extension with Bands, Single Leg Glute Bridge, Single Leg Hip Thrust, Glute Bridge (sztanga), Seated Band Hamstring Curl, Hack Squat, Single Leg Press, Bent Over Row (linki), Meadows Row, Standing Cable Row, Machine Row, Single Arm Lat Pulldown, V-Bar Pulldown, Barbell Shrug Behind The Back, Leverage Shrug, Zottman Curl, Zottman Preacher Curl, Band Pull Apart, Cuban Press, Single Leg RDL (hantel), Single Leg RDL (linki), Barbell Hack Squat, Bodyweight Squat, Dumbbell Squat, Overhead Squat.

## Otwarte — bez wskazówek

| Ćwiczenie | Powód |
|---|---|
| Decline Bench Press | wskazówki czekają na rozstrzygnięcie pytania o metodę: czy ławka płaska to wariant ławki skośnej w dół (docs/research/31, pyt. 1); jedyne źródło opisujące ławkę skośną w dół to Eleiko |
| Pec Deck | dwa źródła istnieją tylko w materiałach uczelnianych centrów sportu (HKU, Western), których szczebel (4 czy 5) jest otwarty (docs/research/33, pyt. 1) |
| Incline Curl (hantle) | opis niejednoznaczny (Oliveira 2009) albo sam abstrakt (Kassiano 2025); brak dwóch przeczytanych opisów (docs/research/33) |
| Concentration Curl (hantle) | jedyne źródło: ACE (ProSource 2014 i badanie ACE — ta sama organizacja); brak drugiego niezależnego (docs/research/33) |
| Spider Curl | brak źródeł szczebla do 4 (docs/research/33) |
| Box Squat | wspólna tylko jedna wskazówka (siad na skrzyni bez odbicia); szeroki rozstaw i pionowe piszczele — jedno źródło (docs/research/33) |
| Sissy Squat | brak źródeł (docs/research/33) |
| Hip Abduction | wspólna tylko jedna wskazówka (odwiedzenie i powrót); ACE 155 bez opisu; reszta to abstrakty bez opisu (docs/research/33) |
| Hip Adduction | oba źródła (ACE, HKU) opisują przywodzenie na wyciągu stojąc, nie maszynę; komplet zależy też od szczebla HKU (docs/research/33, pyt. 1) |
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
| Reverse Grip Triceps Pushdown | `rgpd.setup` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 źródła, w tym 1 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Reverse Grip Triceps Pushdown | `rgpd.move` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 źródła, w tym 1 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Reverse Grip Triceps Pushdown | `tpd.elbows` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 źródła, w tym 1 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Band Overhead Triceps Extension | `tri.bandOte.setup` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 źródła, w tym 1 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Band Overhead Triceps Extension | `tri.bandOte.move` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 źródła, w tym 1 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Decline Dumbbell Triceps Extension | `tri.skullDbDec.setup` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 źródła, w tym 1 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Decline Dumbbell Triceps Extension | `skullDb.move` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 źródła, w tym 1 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Decline Dumbbell Triceps Extension | `tri.mis.elbowsFlare` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 źródła, w tym 1 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Decline EZ Bar Triceps Extension | `tri.skullDec.setup` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 źródła, w tym 1 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Decline EZ Bar Triceps Extension | `tri.skullBb.move` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 źródła, w tym 1 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Decline EZ Bar Triceps Extension | `tri.mis.elbowsFlare` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 źródła, w tym 1 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Chain Handle Extension | `tri.chainExt.setup` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 źródła, w tym 0 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Chain Handle Extension | `tri.chainExt.move` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 źródła, w tym 0 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |
| Chain Handle Extension | `tri.mis.elbowsFlare` | praktyka (etap 2, decyzja właściciela 02–03.11.2026): 2 źródła, w tym 0 szczebla ≤ 4 — ustawienie i ruch z części wspólnej, recenzja niezależna z porównaniem z rysunkiem (L-047) |

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

- Sztanga na górze pleców, chwyt szerzej niż barki; zdejmij ją ze stojaka i cofnij się o krok lub dwa. — ACE: [Back Squat (#11)](https://www.acefitness.org/resources/everyone/exercise-library/11/back-squat/) (opis); BarBend: [How to Do the Back Squat (M. Dewar, CSCS; weryfikacja J. Dickson, USAW-L2)](https://barbend.com/back-squat/) (Step 2 („hands clasping the bar just outside your shoulders”; „step out of the rack”) (runda 2 recenzji niezależnej, 09.11.2026)) `sq.bar`
- Stopy mniej więcej na szerokość barków lub trochę szerzej, palce lekko na zewnątrz. — ACE: [Back Squat (#11)](https://www.acefitness.org/resources/everyone/exercise-library/11/back-squat/) (opis (a little wider than shoulder-width)); Stronger by Science: [How to Squat: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-squat/) (Stance width; Foot Angle) `sq.stance`

**Ruch**

- Schodź, cofając biodra i uginając kolana jednocześnie; wstań, wypychając podłogę całymi stopami. — ACE: [Back Squat (#11)](https://www.acefitness.org/resources/everyone/exercise-library/11/back-squat/) (opis); ExRx.net: [BBFullSquat](https://web.archive.org/web/20221204065643/https://exrx.net/WeightExercises/Quadriceps/BBFullSquat) (Execution); ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (Step 3; Step 6 (ten sam wzorzec bez obciążenia)) `sq.down`

**Wskazówki**

- Kolana idą w linii palców stóp — nie zapadają się do środka. — ExRx.net: [BBFullSquat](https://web.archive.org/web/20221204065643/https://exrx.net/WeightExercises/Quadriceps/BBFullSquat) (Execution; Comments); Stronger by Science: [How to Squat: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-squat/) (Foot Angle; FAQ (knees caving in)); ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (Step 4; Step 5 (knees aligned over the second toe)) `sq.kneesToes`
- Kolana mogą wyjść trochę przed palce stóp — nie trzeba ich na siłę blokować. — Stronger by Science: [How to Squat: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-squat/) (FAQ: Is it okay if my knees go past my toes?); Fry, Smith, Schilling (University of Memphis): [Fry i in. 2003, Effect of knee position on hip and knee torques during the barbell squat, J Strength Cond Res 17(4) — abstrakt](https://pubmed.ncbi.nlm.nih.gov/14636100/) (abstrakt (Practical applications)) `sq.kneesPast`
- Schodź tak nisko, jak pozwala ruchomość przy prostych plecach i całych stopach na podłodze — zwykle co najmniej do równoległego ud. — ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (Step 4); Stronger by Science: [How to Squat: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-squat/) (Depth); ExRx.net: [BBFullSquat](https://web.archive.org/web/20221204065643/https://exrx.net/WeightExercises/Quadriceps/BBFullSquat) (Execution (until knees and hips are fully bent)) `sq.depth`
- Plecy proste, klatka uniesiona. — ACE: [Back Squat (#11)](https://www.acefitness.org/resources/everyone/exercise-library/11/back-squat/) (opis (straight back, chest up)); BarBend: [How to Do the Back Squat (M. Dewar, CSCS; weryfikacja J. Dickson, USAW-L2)](https://barbend.com/back-squat/) (Step 5 („Keep your chest up”) (runda 2 recenzji niezależnej, 09.11.2026)); Stronger by Science: [How to Squat: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-squat/) („Your spine should remain rigid and extended” (runda 2 recenzji niezależnej, 09.11.2026)) `sq.back`

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

- Oprzyj plecy o oparcie, barki pod poduszkami; stopy na platformie jak do zwykłego przysiadu. — BarBend: [hack squat machine](https://barbend.com/hack-squat-machine/) (Step 2: Set Your Stance (back against the backrest; head between the shoulder pads; typical squat stance)); NFPT: [how to do hack squats](https://nfpt.com/how-to-do-hack-squats/) (Setup (shoulders against the shoulder pads, feet on the platform); Options (medium stance: feet shoulder width apart)) `hack.setup2`

**Ruch**

- Opuść się, uginając biodra i kolana, potem wstań, prostując nogi. — BarBend: [hack squat machine](https://barbend.com/hack-squat-machine/) (Step 3: Squat (slide down into a deep squat; push into the plate to return)); NFPT: [how to do hack squats](https://nfpt.com/how-to-do-hack-squats/) (Movement (bending at the hips and knees, lower the weight)) `hack.move`

**Czego unikać**

- Odrywanie bioder albo dolnej części pleców od oparcia. — BarBend: [hack squat machine](https://barbend.com/hack-squat-machine/) (Common Mistakes (hips and torso connected with the pad at all times; pelvis or lower-back drift)); NFPT: [how to do hack squats](https://nfpt.com/how-to-do-hack-squats/) (Cautions (do not let your hips come off the pad or arch your back)) `hack.mis.hips`

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

### Dumbbell One-Arm Triceps Extension

**Ustawienie**

- Unieś hantel jedną ręką nad głowę, łokieć skierowany w górę. — ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 Triceps Extension (or use one arm at a time)); ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 2–3 (wariant oburącz)); Catalyst Athletics: [Single Arm Overhead Cable Tricep Extension (#894)](https://www.catalystathletics.com/exercise/894/Single-Arm-Overhead-Cable-Tricep-Extension/) (Description (wariant wyciąg)) [uproszczenie: ACE opisuje wersję oburącz, Catalyst — wyciąg; ten sam ruch stawów, zmienia się liczba rąk albo przyrząd] `ote1.setup`

**Ruch**

- Zginaj łokieć, opuszczając hantel za głowę; wyprostuj rękę nad głową. — ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 Triceps Extension (one arm at a time)); ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 2–3 (wariant oburącz)); Catalyst Athletics: [Single Arm Overhead Cable Tricep Extension (#894)](https://www.catalystathletics.com/exercise/894/Single-Arm-Overhead-Cable-Tricep-Extension/) (Description (wariant wyciąg)) [uproszczenie: ACE opisuje wersję oburącz, Catalyst — wyciąg; ten sam ruch stawów, zmienia się liczba rąk albo przyrząd] `ote1.move`

**Wskazówki**

- Ramię nieruchomo, łokieć wysoko nad głową — pracuje przedramię. — Catalyst Athletics: [Single Arm Overhead Cable Tricep Extension (#894)](https://www.catalystathletics.com/exercise/894/Single-Arm-Overhead-Cable-Tricep-Extension/) (Description (keep the elbow high instead of driving it forward; wariant wyciąg)); ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 3 (wariant oburącz)); ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 (upper arm still; one arm at a time)) [uproszczenie: ACE opisuje wersję oburącz, Catalyst — wyciąg; ten sam ruch stawów, zmienia się liczba rąk albo przyrząd] `ote1.upperArm`
- Prostuj rękę do końca, ale bez gwałtownego blokowania łokcia. — ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 (one arm; not lock the elbows)); ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 2 (wariant oburącz)) [uproszczenie: ACE opisuje wersję oburącz, Catalyst — wyciąg; ten sam ruch stawów, zmienia się liczba rąk albo przyrząd] `press1.noLock`

**Czego unikać**

- Łokieć opada w przód zamiast zostać wysoko. — Catalyst Athletics: [Single Arm Overhead Cable Tricep Extension (#894)](https://www.catalystathletics.com/exercise/894/Single-Arm-Overhead-Cable-Tricep-Extension/) (Description (wariant wyciąg)); ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 3 — błąd = zaprzeczenie standardu; wariant oburącz) [uproszczenie: ACE opisuje wersję oburącz, Catalyst — wyciąg; ten sam ruch stawów, zmienia się liczba rąk albo przyrząd] `tri.mis.elbowDrift1`
- Wyginanie pleców w łuk. — BarBend: [Overhead triceps extension](https://barbend.com/overhead-triceps-extension/) (Coach's Tips (wariant: wyciąg)); ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 2–3 — błąd = zaprzeczenie standardu; wariant oburącz) [uproszczenie: ACE opisuje wersję oburącz, Catalyst — wyciąg; ten sam ruch stawów, zmienia się liczba rąk albo przyrząd] `tri.mis.archBack`

### Kettlebell Overhead Triceps Extension

**Ustawienie**

- Unieś ciężar nad głowę na prostych rękach, łokcie skierowane w górę. — ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 2–3 (wariant: hantel oburącz)); ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 Triceps Extension (wariant: hantel)) [uproszczenie: wariant sprzętu: źródła opisują hantel (ACE, ISSA) i wyciąg (BarBend); ten sam ruch stawów, zmienia się przyrząd (do potwierdzenia przez recenzenta L-047); kettlebell to inny przyrząd tego samego ruchu] `ote.setupLoad`

**Ruch**

- Zginaj łokcie, opuszczając ciężar za głowę; wyprostuj ręce nad głową. — ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 2–3 (wariant: hantel oburącz)); ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 Triceps Extension (wariant: hantel)) [uproszczenie: wariant sprzętu: źródła opisują hantel (ACE, ISSA) i wyciąg (BarBend); ten sam ruch stawów, zmienia się przyrząd (do potwierdzenia przez recenzenta L-047); kettlebell to inny przyrząd tego samego ruchu] `ote.moveLoad`

**Wskazówki**

- Ramiona nieruchomo, łokcie nad głową — pracują przedramiona. — ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 3 (wariant: hantel oburącz)); ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 (upper arm still; wariant: hantel)) [uproszczenie: wariant sprzętu: źródła opisują hantel (ACE, ISSA) i wyciąg (BarBend); ten sam ruch stawów, zmienia się przyrząd (do potwierdzenia przez recenzenta L-047); kettlebell to inny przyrząd tego samego ruchu] `ote.upperArm`
- Łokcie nie rozchodzą się szeroko na boki. — ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (wskazówka końcowa (wariant: hantel oburącz)); BarBend: [Best triceps exercises](https://barbend.com/best-triceps-exercises/) (Overhead Triceps Extension, How to Do It (keeping your elbows tucked in; wariant: guma)) [uproszczenie: wariant sprzętu: źródła opisują hantel (ACE, ISSA) i wyciąg (BarBend); ten sam ruch stawów, zmienia się przyrząd (do potwierdzenia przez recenzenta L-047); kettlebell to inny przyrząd tego samego ruchu] `ote.elbowsIn`
- Prostuj ręce do końca, ale bez gwałtownego blokowania łokci. — ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 (not lock the elbows; wariant: hantel)); ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 2 (wariant: hantel)) [uproszczenie: wariant sprzętu: źródła opisują hantel (ACE, ISSA) i wyciąg (BarBend); ten sam ruch stawów, zmienia się przyrząd (do potwierdzenia przez recenzenta L-047); kettlebell to inny przyrząd tego samego ruchu] `press.noLock`

**Czego unikać**

- Wyginanie pleców w łuk. — BarBend: [Overhead triceps extension](https://barbend.com/overhead-triceps-extension/) (Coach's Tips (wariant: wyciąg)); ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 2–3 — błąd = zaprzeczenie standardu; wariant: hantel) [uproszczenie: wariant sprzętu: źródła opisują hantel (ACE, ISSA) i wyciąg (BarBend); ten sam ruch stawów, zmienia się przyrząd (do potwierdzenia przez recenzenta L-047); kettlebell to inny przyrząd tego samego ruchu] `tri.mis.archBack`

### Overhead Triceps Extension (EZ)

**Ustawienie**

- Unieś ciężar nad głowę na prostych rękach, łokcie skierowane w górę. — ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 2–3 (wariant: hantel oburącz)); ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 Triceps Extension (wariant: hantel)) [uproszczenie: wariant sprzętu: źródła opisują hantel (ACE, ISSA) i wyciąg (BarBend); ten sam ruch stawów, zmienia się przyrząd (do potwierdzenia przez recenzenta L-047); gryf EZ zamiast hantla] `ote.setupLoad`

**Ruch**

- Zginaj łokcie, opuszczając ciężar za głowę; wyprostuj ręce nad głową. — ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 2–3 (wariant: hantel oburącz)); ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 Triceps Extension (wariant: hantel)) [uproszczenie: wariant sprzętu: źródła opisują hantel (ACE, ISSA) i wyciąg (BarBend); ten sam ruch stawów, zmienia się przyrząd (do potwierdzenia przez recenzenta L-047); gryf EZ zamiast hantla] `ote.moveLoad`

**Wskazówki**

- Ramiona nieruchomo, łokcie nad głową — pracują przedramiona. — ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 3 (wariant: hantel oburącz)); ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 (upper arm still; wariant: hantel)) [uproszczenie: wariant sprzętu: źródła opisują hantel (ACE, ISSA) i wyciąg (BarBend); ten sam ruch stawów, zmienia się przyrząd (do potwierdzenia przez recenzenta L-047); gryf EZ zamiast hantla] `ote.upperArm`
- Łokcie nie rozchodzą się szeroko na boki. — ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (wskazówka końcowa (wariant: hantel oburącz)); BarBend: [Best triceps exercises](https://barbend.com/best-triceps-exercises/) (Overhead Triceps Extension, How to Do It (keeping your elbows tucked in; wariant: guma)) [uproszczenie: wariant sprzętu: źródła opisują hantel (ACE, ISSA) i wyciąg (BarBend); ten sam ruch stawów, zmienia się przyrząd (do potwierdzenia przez recenzenta L-047); gryf EZ zamiast hantla] `ote.elbowsIn`
- Prostuj ręce do końca, ale bez gwałtownego blokowania łokci. — ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 (not lock the elbows; wariant: hantel)); ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 2 (wariant: hantel)) [uproszczenie: wariant sprzętu: źródła opisują hantel (ACE, ISSA) i wyciąg (BarBend); ten sam ruch stawów, zmienia się przyrząd (do potwierdzenia przez recenzenta L-047); gryf EZ zamiast hantla] `press.noLock`

**Czego unikać**

- Wyginanie pleców w łuk. — BarBend: [Overhead triceps extension](https://barbend.com/overhead-triceps-extension/) (Coach's Tips (wariant: wyciąg)); ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 2–3 — błąd = zaprzeczenie standardu; wariant: hantel) [uproszczenie: wariant sprzętu: źródła opisują hantel (ACE, ISSA) i wyciąg (BarBend); ten sam ruch stawów, zmienia się przyrząd (do potwierdzenia przez recenzenta L-047); gryf EZ zamiast hantla] `tri.mis.archBack`

### Standing Overhead Barbell Triceps Extension

**Ustawienie**

- Unieś ciężar nad głowę na prostych rękach, łokcie skierowane w górę. — ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 2–3 (wariant: hantel oburącz)); ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 Triceps Extension (wariant: hantel)) [uproszczenie: wariant sprzętu: źródła opisują hantel (ACE, ISSA) i wyciąg (BarBend); ten sam ruch stawów, zmienia się przyrząd (do potwierdzenia przez recenzenta L-047); sztanga zamiast hantla] `ote.setupLoad`

**Ruch**

- Zginaj łokcie, opuszczając ciężar za głowę; wyprostuj ręce nad głową. — ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 2–3 (wariant: hantel oburącz)); ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 Triceps Extension (wariant: hantel)) [uproszczenie: wariant sprzętu: źródła opisują hantel (ACE, ISSA) i wyciąg (BarBend); ten sam ruch stawów, zmienia się przyrząd (do potwierdzenia przez recenzenta L-047); sztanga zamiast hantla] `ote.moveLoad`

**Wskazówki**

- Ramiona nieruchomo, łokcie nad głową — pracują przedramiona. — ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 3 (wariant: hantel oburącz)); ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 (upper arm still; wariant: hantel)) [uproszczenie: wariant sprzętu: źródła opisują hantel (ACE, ISSA) i wyciąg (BarBend); ten sam ruch stawów, zmienia się przyrząd (do potwierdzenia przez recenzenta L-047); sztanga zamiast hantla] `ote.upperArm`
- Łokcie nie rozchodzą się szeroko na boki. — ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (wskazówka końcowa (wariant: hantel oburącz)); BarBend: [Best triceps exercises](https://barbend.com/best-triceps-exercises/) (Overhead Triceps Extension, How to Do It (keeping your elbows tucked in; wariant: guma)) [uproszczenie: wariant sprzętu: źródła opisują hantel (ACE, ISSA) i wyciąg (BarBend); ten sam ruch stawów, zmienia się przyrząd (do potwierdzenia przez recenzenta L-047); sztanga zamiast hantla] `ote.elbowsIn`
- Prostuj ręce do końca, ale bez gwałtownego blokowania łokci. — ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 (not lock the elbows; wariant: hantel)); ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 2 (wariant: hantel)) [uproszczenie: wariant sprzętu: źródła opisują hantel (ACE, ISSA) i wyciąg (BarBend); ten sam ruch stawów, zmienia się przyrząd (do potwierdzenia przez recenzenta L-047); sztanga zamiast hantla] `press.noLock`

**Czego unikać**

- Wyginanie pleców w łuk. — BarBend: [Overhead triceps extension](https://barbend.com/overhead-triceps-extension/) (Coach's Tips (wariant: wyciąg)); ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 2–3 — błąd = zaprzeczenie standardu; wariant: hantel) [uproszczenie: wariant sprzętu: źródła opisują hantel (ACE, ISSA) i wyciąg (BarBend); ten sam ruch stawów, zmienia się przyrząd (do potwierdzenia przez recenzenta L-047); sztanga zamiast hantla] `tri.mis.archBack`

### Single Arm Triceps Pushdown

**Ustawienie**

- Stań przodem do wyciągu z górnym bloczkiem, chwyć uchwyt jedną ręką, łokieć przy boku. — ACE: [Triceps Pushdowns (#185)](https://www.acefitness.org/resources/everyone/exercise-library/185/triceps-pushdowns/) (Step 1–3 (wersja jednorącz)); Catalyst Athletics: [Single Arm Rope Tricep Pushdown (#898)](https://www.catalystathletics.com/exercise/898/Single-Arm-Rope-Tricep-Pushdown/) (Description (one hand; elbow close to the side)) `tpd1.setup`

**Ruch**

- Prostuj łokieć, wypychając uchwyt w dół; powoli wróć do góry. — ACE: [Triceps Pushdowns (#185)](https://www.acefitness.org/resources/everyone/exercise-library/185/triceps-pushdowns/) (Step 3 (wersja jednorącz)); Catalyst Athletics: [Single Arm Rope Tricep Pushdown (#898)](https://www.catalystathletics.com/exercise/898/Single-Arm-Rope-Tricep-Pushdown/) (Description (extend, return under control)) `tpd1.move`

**Wskazówki**

- Łokieć przy boku — pracuje przedramię, nie bark. — ACE: [Triceps Pushdowns (#185)](https://www.acefitness.org/resources/everyone/exercise-library/185/triceps-pushdowns/) (wskazówka końcowa (forward movement of your elbows)); Catalyst Athletics: [Single Arm Rope Tricep Pushdown (#898)](https://www.catalystathletics.com/exercise/898/Single-Arm-Rope-Tricep-Pushdown/) (Description (elbow close to the side)) `tpd1.elbow`

**Czego unikać**

- Łokieć odjeżdża od tułowia podczas wypychania. — ACE: [Triceps Pushdowns (#185)](https://www.acefitness.org/resources/everyone/exercise-library/185/triceps-pushdowns/) (wskazówka końcowa (forward movement of your elbows)); Catalyst Athletics: [Single Arm Rope Tricep Pushdown (#898)](https://www.catalystathletics.com/exercise/898/Single-Arm-Rope-Tricep-Pushdown/) (Description (elbow close to the side) — błąd = zaprzeczenie standardu) `mis.elbowAway1`

### Skullcrusher (hantle)

**Ustawienie**

- Połóż się na ławce i trzymaj hantle nad sobą na prostych rękach. — ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 Triceps Extension, wersja leżąc (dumbbells raised above the head)); Catalyst Athletics: [Skullcrusher (#903)](https://www.catalystathletics.com/exercise/903/Skullcrusher/) (Description; Variations (dumbbells)); ACE: [Lying Barbell Triceps Extensions (#36)](https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/) (Step 1 (wariant: sztanga)) [uproszczenie: ACE opisuje sztangę; ten sam ruch stawów, zmienia się przyrząd] `skullDb.setup`

**Ruch**

- Zginaj łokcie, opuszczając hantle w stronę głowy; wyprostuj ręce do pozycji wyjściowej. — ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 wersja leżąc (lowered to ear level)); Catalyst Athletics: [Skullcrusher (#903)](https://www.catalystathletics.com/exercise/903/Skullcrusher/) (Description; Variations (dumbbells)); ACE: [Lying Barbell Triceps Extensions (#36)](https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/) (Step 2–3 (wariant: sztanga)) [uproszczenie: ACE opisuje sztangę; ten sam ruch stawów, zmienia się przyrząd] `skullDb.move`

**Wskazówki**

- Ramiona prawie nieruchome, mniej więcej pionowo — pracują łokcie. — ACE: [Lying Barbell Triceps Extensions (#36)](https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/) (Final Tip (upper arms vertical; wariant: sztanga)); ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 wersja leżąc (upper arm does not move)) [uproszczenie: ACE opisuje sztangę; ten sam ruch stawów, zmienia się przyrząd] `skull.upperArm`
- Opuszczaj, aż dłonie będą tuż nad czołem — albo wcześniej, jeśli ramiona zaczną uciekać w tył. — ACE: [Lying Barbell Triceps Extensions (#36)](https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/) (Step 2 (lower until just above your forehead or until the upper arms begin to drift backwards; wariant: sztanga)); ExRx.net: [BBLyingTriExt](https://web.archive.org/web/20220926203416/https://exrx.net/WeightExercises/Triceps/BBLyingTriExt) (Execution (as bar nears head; wariant: sztanga)) [uproszczenie: ACE i ExRx opisują sztangę; zakres opuszczania ten sam przy hantlach (zdanie bez słowa o gryfie)] `skull.depthFree`

**Czego unikać**

- Łokcie rozjeżdżają się na boki. — Catalyst Athletics: [Skullcrusher (#903)](https://www.catalystathletics.com/exercise/903/Skullcrusher/) (Description (avoiding flaring them out to the sides)); ACE: [Lying Barbell Triceps Extensions (#36)](https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/) (Final Tip (elbows shoulder-width apart) — błąd = zaprzeczenie standardu; wariant: sztanga) [uproszczenie: ACE opisuje sztangę; ten sam ruch stawów, zmienia się przyrząd] `tri.mis.elbowsFlare`

### Skullcrusher (sztanga)

**Ustawienie**

- Połóż się na ławce i trzymaj sztangę nad sobą na prostych rękach. — ACE: [Lying Barbell Triceps Extensions (#36)](https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/) (Step 1–3); Catalyst Athletics: [Skullcrusher (#903)](https://www.catalystathletics.com/exercise/903/Skullcrusher/) (Description (barbell or EZ curl bar pressed up above you)); ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 wersja leżąc (sztanga dozwolona)) `tri.skullBb.setup`

**Ruch**

- Zginaj łokcie, opuszczając sztangę w stronę głowy; wyprostuj ręce do pozycji wyjściowej. — ACE: [Lying Barbell Triceps Extensions (#36)](https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/) (Step 2–3); Catalyst Athletics: [Skullcrusher (#903)](https://www.catalystathletics.com/exercise/903/Skullcrusher/) (Description); ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 wersja leżąc (lowered to ear level)) `tri.skullBb.move`

**Wskazówki**

- Ramiona prawie nieruchome, mniej więcej pionowo — pracują łokcie. — ACE: [Lying Barbell Triceps Extensions (#36)](https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/) (Final Tip (upper arms vertical)); ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 wersja leżąc (upper arm does not move; wariant: hantle)) `skull.upperArm`

**Czego unikać**

- Łokcie rozjeżdżają się na boki. — Catalyst Athletics: [Skullcrusher (#903)](https://www.catalystathletics.com/exercise/903/Skullcrusher/) (Description (avoiding flaring them out to the sides)); ACE: [Lying Barbell Triceps Extensions (#36)](https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/) (Final Tip — błąd = zaprzeczenie standardu) `tri.mis.elbowsFlare`

### Standing Low-Pulley One-Arm Triceps Extension

**Ustawienie**

- Stań tyłem do wyciągu i trzymaj uchwyt jedną ręką nad głową, łokieć skierowany w górę. — Catalyst Athletics: [Single Arm Overhead Cable Tricep Extension (#894)](https://www.catalystathletics.com/exercise/894/Single-Arm-Overhead-Cable-Tricep-Extension/) (Description (one hand overhead, facing away from the machine; elbow high)); BarBend: [Overhead triceps extension](https://barbend.com/overhead-triceps-extension/) (How to (pulley at a low position; face away from the cable stack)) `lpote.setup`

**Ruch**

- Zginaj łokieć, opuszczając uchwyt za głowę; wyprostuj rękę nad głową. — Catalyst Athletics: [Single Arm Overhead Cable Tricep Extension (#894)](https://www.catalystathletics.com/exercise/894/Single-Arm-Overhead-Cable-Tricep-Extension/) (Description (bend the arm, then extend it completely)); BarBend: [Overhead triceps extension](https://barbend.com/overhead-triceps-extension/) (How to (extend; lower under control)); ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 2–3 (za głową; wariant: hantel)) [uproszczenie: wariant oburącz (ACE) i jednorącz z hantlem; ten sam ruch stawów] `lpote.move`

**Wskazówki**

- Ramię nieruchomo, łokieć wysoko nad głową — pracuje przedramię. — Catalyst Athletics: [Single Arm Overhead Cable Tricep Extension (#894)](https://www.catalystathletics.com/exercise/894/Single-Arm-Overhead-Cable-Tricep-Extension/) (Description (keep the elbow high instead of driving it forward)); ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 3 (wariant: hantel oburącz)); ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 (one arm; upper arm still; wariant: hantel)) [uproszczenie: wariant oburącz (ACE) i jednorącz z hantlem; ten sam ruch stawów] `ote1.upperArm`

**Czego unikać**

- Wyginanie pleców w łuk. — BarBend: [Overhead triceps extension](https://barbend.com/overhead-triceps-extension/) (Coach's Tips); ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 2–3 — błąd = zaprzeczenie standardu; wariant: hantel) [uproszczenie: wariant oburącz (ACE) i jednorącz z hantlem; ten sam ruch stawów] `tri.mis.archBack`
- Łokieć opada w przód zamiast zostać wysoko. — Catalyst Athletics: [Single Arm Overhead Cable Tricep Extension (#894)](https://www.catalystathletics.com/exercise/894/Single-Arm-Overhead-Cable-Tricep-Extension/) (Description); ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 3 — błąd = zaprzeczenie standardu; wariant: hantel) [uproszczenie: wariant oburącz (ACE) i jednorącz z hantlem; ten sam ruch stawów] `tri.mis.elbowDrift1`

### Tate Press

**Ustawienie**

- Połóż się na ławce i trzymaj hantle nad klatką na prostych rękach. — ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#5 Tate Press); Catalyst Athletics: [Tate Press (#909)](https://www.catalystathletics.com/exercise/909/Tate-Press/) (Description) `tate.setup`

**Ruch**

- Zginaj łokcie skierowane na boki, opuszczając hantle do klatki; wyprostuj ręce. — ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#5 Tate Press (lower toward the chest, elbows pointing outward)); Catalyst Athletics: [Tate Press (#909)](https://www.catalystathletics.com/exercise/909/Tate-Press/) (Description (elbows out to the sides, lower the dumbbells to the chest)) `tate.move`

### Triceps Kickback

**Ustawienie**

- Pochyl się do przodu z prostymi plecami i oprzyj wolną rękę o ławkę albo udo; ramię przy tułowiu, łokieć zgięty pod kątem prostym. — ACE: [Triceps Kickback (#55)](https://www.acefitness.org/resources/everyone/exercise-library/55/triceps-kickback/) (Step 1–2 (lean forward; upper arm parallel to and close to your torso; elbow about a right angle)); Catalyst Athletics: [Tricep Kickback (#910)](https://www.catalystathletics.com/exercise/910/Tricep-Kickback/) (Description (upper arm horizontal and against your side)) `kick.setup`

**Ruch**

- Prostuj łokieć, odprowadzając dłoń do tyłu, aż ręka będzie prosta; wróć do kąta prostego. — ACE: [Triceps Kickback (#55)](https://www.acefitness.org/resources/everyone/exercise-library/55/triceps-kickback/) (Step 3–4); Catalyst Athletics: [Tricep Kickback (#910)](https://www.catalystathletics.com/exercise/910/Tricep-Kickback/) (Description (extend the elbow completely, then return under control)) `kick.move`

**Wskazówki**

- Ramię nieruchomo przy tułowiu — rusza się tylko przedramię. — ACE: [Triceps Kickback (#55)](https://www.acefitness.org/resources/everyone/exercise-library/55/triceps-kickback/) (Step 3 (upper arm stationary next to your torso)); Catalyst Athletics: [Tricep Kickback (#910)](https://www.catalystathletics.com/exercise/910/Tricep-Kickback/) (Description (upper arm horizontal and against your side)) `kick.upperArm`
- Prostuj ręce do końca, ale bez gwałtownego blokowania łokci. — ACE: [Triceps Kickback (#55)](https://www.acefitness.org/resources/everyone/exercise-library/55/triceps-kickback/) (Step 3 (until your elbow is fully extended)); ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#3 Triceps Kickback (Don't lock the elbow)) `press.noLock`

**Czego unikać**

- Ramię się rusza — odjeżdża od tułowia albo zmienia wysokość. — ACE: [Triceps Kickback (#55)](https://www.acefitness.org/resources/everyone/exercise-library/55/triceps-kickback/) (Step 3 (upper arm stationary; not raised during the movement)); Catalyst Athletics: [Tricep Kickback (#910)](https://www.catalystathletics.com/exercise/910/Tricep-Kickback/) (Description — błąd = zaprzeczenie standardu) `tri.mis.kickArm`

### Reverse Grip Triceps Pushdown

**Ustawienie**

- Chwyć drążek wyciągu podchwytem, dłońmi w górę, łokcie przy bokach. — Catalyst Athletics: [Reverse Grip Tricep Pushdown (#878)](https://www.catalystathletics.com/exercise/878/Reverse-Grip-Tricep-Pushdown/) (Description, zdanie 1 (straight handle; high cable attachment; palms up)); NFPT (wpisy gościnne): [How to do reverse tricep pushdown](https://nfpt.com/how-to-do-reverse-tricep-pushdown/) (szczebel 5 — nie liczy się do pary; Setup (under grip, palms facing up; elbows in at your sides)) `rgpd.setup`

**Ruch**

- Prostuj łokcie, wypychając drążek w dół; powoli wróć do góry. — Catalyst Athletics: [Reverse Grip Tricep Pushdown (#878)](https://www.catalystathletics.com/exercise/878/Reverse-Grip-Tricep-Pushdown/) (Description (extend the elbows fully, then return under control)); NFPT (wpisy gościnne): [How to do reverse tricep pushdown](https://nfpt.com/how-to-do-reverse-tricep-pushdown/) (szczebel 5 — nie liczy się do pary; Movement (press the handle down to the extended position)) `rgpd.move`

**Wskazówki**

- Łokcie przy bokach — pracują przedramiona, nie barki. — Catalyst Athletics: [Reverse Grip Tricep Pushdown (#878)](https://www.catalystathletics.com/exercise/878/Reverse-Grip-Tricep-Pushdown/) (Description (elbows close to the sides)); NFPT (wpisy gościnne): [How to do reverse tricep pushdown](https://nfpt.com/how-to-do-reverse-tricep-pushdown/) (szczebel 5 — nie liczy się do pary; Setup (elbows at your sides)) `tpd.elbows`

**Czego unikać**

- Łokcie odjeżdżają od tułowia podczas wypychania. — ACE: [Triceps Pushdowns (#185)](https://www.acefitness.org/resources/everyone/exercise-library/185/triceps-pushdowns/) (wskazówka końcowa (forward movement of your elbows; wariant: nachwyt)); Catalyst Athletics: [Reverse Grip Tricep Pushdown (#878)](https://www.catalystathletics.com/exercise/878/Reverse-Grip-Tricep-Pushdown/) (Description (elbows close to the sides) — błąd = zaprzeczenie standardu) [uproszczenie: ACE opisuje chwyt nachwytem; błąd (łokcie odjeżdżają od tułowia) nie zależy od chwytu] `mis.elbowsAway`

### Triceps Kickback (linki)

**Ustawienie**

- Stań przodem do wyciągu, chwyć uchwyt jedną ręką i cofnij się o krok; pochyl się do przodu z prostymi plecami, ramię przy tułowiu. — BarBend: [Best triceps exercises](https://barbend.com/best-triceps-exercises/) (Cable Kickback, How to Do It (torso roughly parallel to the floor; upper arm back and against your torso)); ISSA: [20-minute full-body resistance band workout](https://www.issaonline.com/blogs/training-tips/20-minute-full-body-resistance-band-workout) (Triceps Kickback (band secured; one hand; a few steps from the attachment point; hinge, neutral spine; wariant: guma)) [uproszczenie: guma ≈ wyciąg: ten sam ruch, zmienia się źródło oporu] `tri.kickCb.setup`

**Ruch**

- Prostuj łokieć, odprowadzając dłoń do tyłu, aż ręka będzie prosta; wróć do kąta prostego. — BarBend: [Best triceps exercises](https://barbend.com/best-triceps-exercises/) (Cable Kickback, How to Do It (extend your elbow)); ACE: [Triceps Kickback (#55)](https://www.acefitness.org/resources/everyone/exercise-library/55/triceps-kickback/) (Step 3–4 (wariant: hantel)); ISSA: [20-minute full-body resistance band workout](https://www.issaonline.com/blogs/training-tips/20-minute-full-body-resistance-band-workout) (Triceps Kickback (wariant: guma)) [uproszczenie: wariant sprzętu hantel (ACE, Catalyst) → wyciąg; błąd (ramię się rusza) nie zależy od przyrządu] `kick.move`

**Wskazówki**

- Ramię nieruchomo przy tułowiu — rusza się tylko przedramię. — BarBend: [Best triceps exercises](https://barbend.com/best-triceps-exercises/) (Cable Kickback (upper arm back and against your torso)); ACE: [Triceps Kickback (#55)](https://www.acefitness.org/resources/everyone/exercise-library/55/triceps-kickback/) (Step 3 (wariant: hantel)); ISSA: [20-minute full-body resistance band workout](https://www.issaonline.com/blogs/training-tips/20-minute-full-body-resistance-band-workout) (Triceps Kickback (wariant: guma)) [uproszczenie: wariant sprzętu hantel (ACE, Catalyst) → wyciąg; błąd (ramię się rusza) nie zależy od przyrządu] `kick.upperArm`

**Czego unikać**

- Ramię się rusza — odjeżdża od tułowia albo zmienia wysokość. — ACE: [Triceps Kickback (#55)](https://www.acefitness.org/resources/everyone/exercise-library/55/triceps-kickback/) (Step 3 (wariant: hantel)); Catalyst Athletics: [Tricep Kickback (#910)](https://www.catalystathletics.com/exercise/910/Tricep-Kickback/) (Description (wariant: hantel) — błąd = zaprzeczenie standardu) [uproszczenie: wariant sprzętu hantel (ACE, Catalyst) → wyciąg; błąd (ramię się rusza) nie zależy od przyrządu] `tri.mis.kickArm`

### Two-Arm Dumbbell Kickback

**Ustawienie**

- Z hantlami w obu dłoniach pochyl się do przodu z prostymi plecami; ramiona przy tułowiu, łokcie zgięte pod kątem prostym. — ACE: [Triceps Kickback (#55)](https://www.acefitness.org/resources/everyone/exercise-library/55/triceps-kickback/) (Step 1–2 (lean forward; upper arm parallel to and close to your torso; elbow about a right angle)); BarBend: [Best triceps exercises](https://barbend.com/best-triceps-exercises/) (Cable Kickback, modyfikacja (two cables at the same time; torso roughly parallel to the floor)) [uproszczenie: ACE i Catalyst opisują wersję jednorącz z podparciem; BarBend — wyciąg bez podparcia, obie ręce naraz; ten sam ruch stawów, zmienia się liczba rąk i podparcie wolnej ręki (do potwierdzenia przez recenzenta L-047)] `tri.kick2.setup`

**Ruch**

- Prostuj łokcie, odprowadzając dłonie do tyłu, aż ręce będą proste; wróć do kąta prostego. — ACE: [Triceps Kickback (#55)](https://www.acefitness.org/resources/everyone/exercise-library/55/triceps-kickback/) (Step 3–4); Catalyst Athletics: [Tricep Kickback (#910)](https://www.catalystathletics.com/exercise/910/Tricep-Kickback/) (Description (extend the elbow completely, then return under control)) [uproszczenie: ACE i Catalyst opisują wersję jednorącz z podparciem; BarBend — wyciąg bez podparcia, obie ręce naraz; ten sam ruch stawów, zmienia się liczba rąk i podparcie wolnej ręki (do potwierdzenia przez recenzenta L-047)] `tri.kick2.move`

**Wskazówki**

- Ramię nieruchomo przy tułowiu — rusza się tylko przedramię. — ACE: [Triceps Kickback (#55)](https://www.acefitness.org/resources/everyone/exercise-library/55/triceps-kickback/) (Step 3); Catalyst Athletics: [Tricep Kickback (#910)](https://www.catalystathletics.com/exercise/910/Tricep-Kickback/) (Description (upper arm horizontal and against your side)) [uproszczenie: ACE i Catalyst opisują wersję jednorącz z podparciem; BarBend — wyciąg bez podparcia, obie ręce naraz; ten sam ruch stawów, zmienia się liczba rąk i podparcie wolnej ręki (do potwierdzenia przez recenzenta L-047)] `kick.upperArm`

**Czego unikać**

- Ramię się rusza — odjeżdża od tułowia albo zmienia wysokość. — ACE: [Triceps Kickback (#55)](https://www.acefitness.org/resources/everyone/exercise-library/55/triceps-kickback/) (Step 3); Catalyst Athletics: [Tricep Kickback (#910)](https://www.catalystathletics.com/exercise/910/Tricep-Kickback/) (Description — błąd = zaprzeczenie standardu) [uproszczenie: ACE i Catalyst opisują wersję jednorącz z podparciem; BarBend — wyciąg bez podparcia, obie ręce naraz; ten sam ruch stawów, zmienia się liczba rąk i podparcie wolnej ręki (do potwierdzenia przez recenzenta L-047)] `tri.mis.kickArm`

### Band Overhead Triceps Extension

**Ustawienie**

- Stań na środku gumy, chwyć jej końce i unieś dłonie za głowę, łokcie skierowane w górę. — BarBend: [Best triceps exercises](https://barbend.com/best-triceps-exercises/) (Overhead Triceps Extension, How to Do It (band underneath the middle of both feet; handles behind your ears)); The Prehab Guys: [Overhead Tricep Extension – Band](https://theprehabguys.com/vimeo-video/overhead-tricep-extension-band/) (szczebel 5 — nie liczy się do pary; opis (start standing with a band anchored under your feet)) `tri.bandOte.setup`

**Ruch**

- Prostuj łokcie, wypychając dłonie nad głowę; zginając je, wróć dłońmi za głowę. — BarBend: [Best triceps exercises](https://barbend.com/best-triceps-exercises/) (Overhead Triceps Extension, How to Do It (extend the elbows until lockout)); The Prehab Guys: [Overhead Tricep Extension – Band](https://theprehabguys.com/vimeo-video/overhead-tricep-extension-band/) (szczebel 5 — nie liczy się do pary; opis (extend overhead and return)) `tri.bandOte.move`

**Wskazówki**

- Ramiona nieruchomo, łokcie nad głową — pracują przedramiona. — ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 3 (wariant: hantel)); ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 (upper arm still; wariant: hantel)) [uproszczenie: wariant sprzętu guma: ACE opisuje hantel (łokcie w górę), BarBend — wyciąg; ten sam ruch stawów] `ote.upperArm`

**Czego unikać**

- Wyginanie pleców w łuk. — The Prehab Guys: [Overhead Tricep Extension – Band](https://theprehabguys.com/vimeo-video/overhead-tricep-extension-band/) (szczebel 5 — nie liczy się do pary; opis (do not excessively arch or bend your back)); BarBend: [Overhead triceps extension](https://barbend.com/overhead-triceps-extension/) (Coach's Tips (wariant: wyciąg)); ACE: [Triceps Extension (#74)](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/) (Step 2–3 — błąd = zaprzeczenie standardu; wariant: hantel) [uproszczenie: wariant sprzętu guma: ACE opisuje hantel (łokcie w górę), BarBend — wyciąg; ten sam ruch stawów] `tri.mis.archBack`

### Band Skull Crusher

**Ustawienie**

- Połóż się na ławce i trzymaj gumę nad sobą na prostych rękach. — Catalyst Athletics: [Skullcrusher (#903)](https://www.catalystathletics.com/exercise/903/Skullcrusher/) (Description; Variations (low cable)); ExRx.net: [CBLyingTriExt](https://exrx.net/WeightExercises/Triceps/CBLyingTriExt) (Preparation (wersja z wyciągiem leżąc)); BarBend: [Best triceps exercises](https://barbend.com/best-triceps-exercises/) (Skull Crusher — lista sprzętu (cable pulley)) [uproszczenie: guma zaczepiona nisko za głową ≈ dolny wyciąg (Catalyst i ExRx opisują wyciąg leżąc); żadne przeczytane źródło nie opisuje gumy leżąc — decyzja recenzenta L-047 (bez potwierdzenia karta zostaje otwarta)] `tri.skullBand.setup`

**Ruch**

- Zginaj łokcie, opuszczając dłonie w stronę głowy; wyprostuj ręce do pozycji wyjściowej. — Catalyst Athletics: [Skullcrusher (#903)](https://www.catalystathletics.com/exercise/903/Skullcrusher/) (Description; Variations (low cable)); ExRx.net: [CBLyingTriExt](https://exrx.net/WeightExercises/Triceps/CBLyingTriExt) (Execution (wersja z wyciągiem leżąc)); BarBend: [Best triceps exercises](https://barbend.com/best-triceps-exercises/) (Skull Crusher — lista sprzętu (cable pulley)) [uproszczenie: guma zaczepiona nisko za głową ≈ dolny wyciąg (Catalyst i ExRx opisują wyciąg leżąc); żadne przeczytane źródło nie opisuje gumy leżąc — decyzja recenzenta L-047 (bez potwierdzenia karta zostaje otwarta)] `tri.skullBand.move`

**Czego unikać**

- Łokcie rozjeżdżają się na boki. — Catalyst Athletics: [Skullcrusher (#903)](https://www.catalystathletics.com/exercise/903/Skullcrusher/) (Description (avoiding flaring them out to the sides)); ACE: [Lying Barbell Triceps Extensions (#36)](https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/) (Final Tip — błąd = zaprzeczenie standardu; wariant: sztanga) [uproszczenie: guma zaczepiona nisko za głową ≈ dolny wyciąg (Catalyst i ExRx opisują wyciąg leżąc); żadne przeczytane źródło nie opisuje gumy leżąc — decyzja recenzenta L-047 (bez potwierdzenia karta zostaje otwarta)] `tri.mis.elbowsFlare`

### Cable Lying Triceps Extension

**Ustawienie**

- Połóż się na ławce i trzymaj drążek wyciągu nad sobą na prostych rękach. — Catalyst Athletics: [Skullcrusher (#903)](https://www.catalystathletics.com/exercise/903/Skullcrusher/) (Description; Variations (low cable)); ExRx.net: [CBLyingTriExt](https://exrx.net/WeightExercises/Triceps/CBLyingTriExt) (Preparation (leżąc, drążek nad twarzą na prostych rękach)) [uproszczenie: wariant sprzętu wyciąg (Catalyst nazywa „low cable”, ExRx opisuje wprost); ten sam ruch stawów] `tri.skullCb.setup`

**Ruch**

- Zginaj łokcie, opuszczając drążek w stronę głowy; wyprostuj ręce do pozycji wyjściowej. — Catalyst Athletics: [Skullcrusher (#903)](https://www.catalystathletics.com/exercise/903/Skullcrusher/) (Description; Variations (low cable)); ExRx.net: [CBLyingTriExt](https://exrx.net/WeightExercises/Triceps/CBLyingTriExt) (Execution) [uproszczenie: wariant sprzętu wyciąg (Catalyst nazywa „low cable”, ExRx opisuje wprost); ten sam ruch stawów] `tri.skullCb.move`

**Wskazówki**

- Ramiona prawie nieruchome, mniej więcej pionowo — pracują łokcie. — ACE: [Lying Barbell Triceps Extensions (#36)](https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/) (Final Tip (upper arms vertical; wariant: sztanga)); ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 wersja leżąc (upper arm does not move; wariant: hantle)) [uproszczenie: wariant sprzętu wyciąg (Catalyst nazywa „low cable”, ExRx opisuje wprost); ten sam ruch stawów] `skull.upperArm`

**Czego unikać**

- Łokcie rozjeżdżają się na boki. — Catalyst Athletics: [Skullcrusher (#903)](https://www.catalystathletics.com/exercise/903/Skullcrusher/) (Description (avoiding flaring them out to the sides)); ACE: [Lying Barbell Triceps Extensions (#36)](https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/) (Final Tip — błąd = zaprzeczenie standardu) [uproszczenie: wariant sprzętu wyciąg (Catalyst nazywa „low cable”, ExRx opisuje wprost); ten sam ruch stawów] `tri.mis.elbowsFlare`

### Incline Barbell Triceps Extension

**Ustawienie**

- Połóż się na ławce skośnej i trzymaj sztangę nad sobą na prostych rękach. — Catalyst Athletics: [Skullcrusher (#903)](https://www.catalystathletics.com/exercise/903/Skullcrusher/) (Variations (can also be done on an incline bench); Description (bar pressed up above you)); BarBend: [Best triceps exercises](https://barbend.com/best-triceps-exercises/) (Skull Crusher, modyfikacja (adjustable bench, low incline)) `tri.skullInc.setup`

**Ruch**

- Zginaj łokcie, opuszczając sztangę w stronę głowy; wyprostuj ręce do pozycji wyjściowej. — Catalyst Athletics: [Skullcrusher (#903)](https://www.catalystathletics.com/exercise/903/Skullcrusher/) (Description; Variations (incline bench)); ACE: [Lying Barbell Triceps Extensions (#36)](https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/) (Step 2–3 (ławka płaska)) [uproszczenie: ławka skośna: ruch łokcia ten sam, inny stały kąt barku (ACE opisuje ławkę płaską); kąta ławki zdanie nie podaje] `tri.skullBb.move`

**Czego unikać**

- Łokcie rozjeżdżają się na boki. — Catalyst Athletics: [Skullcrusher (#903)](https://www.catalystathletics.com/exercise/903/Skullcrusher/) (Description (avoiding flaring them out to the sides)); ACE: [Lying Barbell Triceps Extensions (#36)](https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/) (Final Tip — błąd = zaprzeczenie standardu; ławka płaska) [uproszczenie: ławka skośna: ruch łokcia ten sam, inny stały kąt barku (ACE opisuje ławkę płaską); kąta ławki zdanie nie podaje] `tri.mis.elbowsFlare`

### Decline Dumbbell Triceps Extension

**Ustawienie**

- Połóż się na ławce skośnej głową w dół i trzymaj hantle nad sobą na prostych rękach. — Fitness Volt: [Decline skull crusher](https://fitnessvolt.com/23999/decline-skull-crusher/) (How to (decline bench; wariant: sztanga)); Fit Father Project: [Skull crusher exercise](https://www.fitfatherproject.com/skull-crusher-exercise/) (szczebel 5 — nie liczy się do pary; sekcja Decline Bench (EZ, krótka sztanga lub hantle)) [uproszczenie: źródła opisują sztangę, gryf EZ i hantle; ten sam ruch stawów, zmienia się przyrząd] `tri.skullDbDec.setup`

**Ruch**

- Zginaj łokcie, opuszczając hantle w stronę głowy; wyprostuj ręce do pozycji wyjściowej. — Fitness Volt: [Decline skull crusher](https://fitnessvolt.com/23999/decline-skull-crusher/) (How to (slowly lower … to your forehead; wariant: sztanga)); Fit Father Project: [Skull crusher exercise](https://www.fitfatherproject.com/skull-crusher-exercise/) (szczebel 5 — nie liczy się do pary; Decline Bench (ruch jak wersja płaska; hantle)) [uproszczenie: źródła opisują sztangę, gryf EZ i hantle; ten sam ruch stawów, zmienia się przyrząd] `skullDb.move`

**Czego unikać**

- Łokcie rozjeżdżają się na boki. — Fit Father Project: [Skull crusher exercise](https://www.fitfatherproject.com/skull-crusher-exercise/) (szczebel 5 — nie liczy się do pary; sekcja Decline Bench (Don't let them flare outwards)); Fitness Volt: [Decline skull crusher](https://fitnessvolt.com/23999/decline-skull-crusher/) (How to (keep your elbows tucked in)) [uproszczenie: źródła opisują sztangę, gryf EZ i hantle; ten sam ruch stawów, zmienia się przyrząd] `tri.mis.elbowsFlare`

### Decline EZ Bar Triceps Extension

**Ustawienie**

- Połóż się na ławce skośnej głową w dół i trzymaj sztangę nad sobą na prostych rękach. — Fitness Volt: [Decline skull crusher](https://fitnessvolt.com/23999/decline-skull-crusher/) (How to (lie on a decline bench holding a barbell straight up above chin level)); Fit Father Project: [Skull crusher exercise](https://www.fitfatherproject.com/skull-crusher-exercise/) (szczebel 5 — nie liczy się do pary; sekcja Decline Bench (EZ lub krótka sztanga)) `tri.skullDec.setup`

**Ruch**

- Zginaj łokcie, opuszczając sztangę w stronę głowy; wyprostuj ręce do pozycji wyjściowej. — Fitness Volt: [Decline skull crusher](https://fitnessvolt.com/23999/decline-skull-crusher/) (How to (slowly lower the barbell to your forehead)); Fit Father Project: [Skull crusher exercise](https://www.fitfatherproject.com/skull-crusher-exercise/) (szczebel 5 — nie liczy się do pary; sekcja Decline Bench (Slowly lower the bar)) `tri.skullBb.move`

**Czego unikać**

- Łokcie rozjeżdżają się na boki. — Fit Father Project: [Skull crusher exercise](https://www.fitfatherproject.com/skull-crusher-exercise/) (szczebel 5 — nie liczy się do pary; sekcja Decline Bench (Don't let them flare outwards)); Fitness Volt: [Decline skull crusher](https://fitnessvolt.com/23999/decline-skull-crusher/) (How to (keep your elbows tucked in)) `tri.mis.elbowsFlare`

### Lying Close-Grip Barbell Triceps Extension Behind The Head

**Ustawienie**

- Połóż się na ławce i trzymaj sztangę nad sobą na prostych rękach. — Catalyst Athletics: [Skullcrusher (#903)](https://www.catalystathletics.com/exercise/903/Skullcrusher/) (Description (lie supine on a bench with a barbell … pressed up above you)); ACE: [Lying Barbell Triceps Extensions (#36)](https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/) (Step 1) `tri.skullBb.setup`

**Ruch**

- Zginaj łokcie, opuszczając sztangę za czubek głowy; wyprostuj ręce do pozycji wyjściowej. — Catalyst Athletics: [Skullcrusher (#903)](https://www.catalystathletics.com/exercise/903/Skullcrusher/) (Description (move the elbows back slightly to bring the bar past the top of the head)); ACE: [Lying Barbell Triceps Extensions (#36)](https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/) (Step 2 (towards your forehead or slightly behind your head; granica: upper arms begin to drift backwards)) `tri.skullBehind.move`

**Czego unikać**

- Łokcie rozjeżdżają się na boki. — Catalyst Athletics: [Skullcrusher (#903)](https://www.catalystathletics.com/exercise/903/Skullcrusher/) (Description (avoiding flaring them out to the sides)); ACE: [Lying Barbell Triceps Extensions (#36)](https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/) (Final Tip — błąd = zaprzeczenie standardu) `tri.mis.elbowsFlare`

### One-Arm Lying Dumbbell Triceps Extension

**Ustawienie**

- Połóż się na ławce i trzymaj hantel nad sobą na prostej ręce. — ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 wersja leżąc (dumbbells raised above the head)); Catalyst Athletics: [Skullcrusher (#903)](https://www.catalystathletics.com/exercise/903/Skullcrusher/) (Description; Variations (dumbbells)); BodBot: [Tricep extension, lying, dumbbell, one arm](https://www.bodbot.com/Exercises/1010/Tricep-Extension-_-Lying,-Dumbbell-_-One-Arm) (szczebel 5 — nie liczy się do pary; Set-up (raise a dumbbell overhead with one arm)) [uproszczenie: jedna ręka zamiast dwóch (ISSA, Catalyst, ACE opisują wersję oburącz leżąc); ten sam ruch stawów] `tri.skullDb1.setup`

**Ruch**

- Zginaj łokieć, opuszczając hantel w stronę głowy; wyprostuj rękę do pozycji wyjściowej. — ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 wersja leżąc (lowered to ear level)); Catalyst Athletics: [Skullcrusher (#903)](https://www.catalystathletics.com/exercise/903/Skullcrusher/) (Description; Variations (dumbbells)); BodBot: [Tricep extension, lying, dumbbell, one arm](https://www.bodbot.com/Exercises/1010/Tricep-Extension-_-Lying,-Dumbbell-_-One-Arm) (szczebel 5 — nie liczy się do pary; ruch (keeping the upper arm still, lower the forearm)) [uproszczenie: jedna ręka zamiast dwóch (ISSA, Catalyst, ACE opisują wersję oburącz leżąc); ten sam ruch stawów] `tri.skullDb1.move`

**Wskazówki**

- Ramiona prawie nieruchome, mniej więcej pionowo — pracują łokcie. — ACE: [Lying Barbell Triceps Extensions (#36)](https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/) (Final Tip (upper arms vertical; wariant: sztanga)); ISSA: [Top exercises to enhance your triceps workout](https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout) (#2 wersja leżąc (upper arm does not move)) [uproszczenie: jedna ręka zamiast dwóch (ISSA, Catalyst, ACE opisują wersję oburącz leżąc); ten sam ruch stawów] `skull.upperArm`

**Czego unikać**

- Łokieć rozjeżdża się na bok. — Catalyst Athletics: [Skullcrusher (#903)](https://www.catalystathletics.com/exercise/903/Skullcrusher/) (Description (avoiding flaring them out to the sides; hantle)); ACE: [Lying Barbell Triceps Extensions (#36)](https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/) (Final Tip — błąd = zaprzeczenie standardu; wariant: sztanga) [uproszczenie: jedna ręka zamiast dwóch (ISSA, Catalyst, ACE opisują wersję oburącz leżąc); ten sam ruch stawów] `tri.mis.elbowFlare1`

### Chain Handle Extension

**Ustawienie**

- Połóż się na płaskiej ławce z uchwytem z łańcuchem w każdej dłoni, łokcie skierowane w górę. — free-exercise-db: [Chain Handle Extension](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Chain_Handle_Extension.json) (szczebel 5 — nie liczy się do pary; instructions[0] (position yourself on the flat bench; elbows pointing straight up)); app-s8 (szczebel 5 — nie liczy się do pary; Movement, krok 1 (lie securely with one handle in each hand, elbows upward)) `tri.chainExt.setup`

**Ruch**

- Prostuj łokcie, trzymając ramiona nieruchomo; potem opuść uchwyty z powrotem. — free-exercise-db: [Chain Handle Extension](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Chain_Handle_Extension.json) (szczebel 5 — nie liczy się do pary; instructions (straighten the arms)); app-s8 (szczebel 5 — nie liczy się do pary; Movement, krok 2 (straighten both arms without allowing the elbows to move)) `tri.chainExt.move`

**Czego unikać**

- Łokcie rozjeżdżają się na boki. — free-exercise-db: [Chain Handle Extension](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Chain_Handle_Extension.json) (szczebel 5 — nie liczy się do pary; instructions[0] (your elbows should be pointing straight up)); app-s8 (szczebel 5 — nie liczy się do pary; Movement, krok 2 (without allowing the elbows to move)) `tri.mis.elbowsFlare`

### Arnold Press

**Ustawienie**

- Hantle przed twarzą, dłonie zwrócone do ciebie. — BarBend: [arnold press](https://barbend.com/arnold-press/) (How to: Set Up (palms facing you)); ISSA: [overhead press proper form variations and common mistakes](https://issaonline.com/blog/post/overhead-press-proper-form-variations-and-common-mistakes) (Arnold Press (dumbbell in each hand, palms facing the body)) `arnold.setup`

**Ruch**

- Wyciskaj hantle nad głowę, obracając dłonie — na górze patrzą do przodu; opuszczając, obróć je z powrotem do siebie. — BarBend: [arnold press](https://barbend.com/arnold-press/) (How to: Rotate and Press; Reverse It); ISSA: [overhead press proper form variations and common mistakes](https://issaonline.com/blog/post/overhead-press-proper-form-variations-and-common-mistakes) (Arnold Press (rotate the weights about 180 degrees away from the face while pressing; slowly reverse to the start)) `arnold.move`

**Wskazówki**

- Obracaj i wyciskaj naraz — nie najpierw obrót, a potem wyciskanie. — BarBend: [arnold press](https://barbend.com/arnold-press/) (Coach's tip (rotate and press at the same time)); ISSA: [overhead press proper form variations and common mistakes](https://issaonline.com/blog/post/overhead-press-proper-form-variations-and-common-mistakes) (Arnold Press (in one controlled motion)) `arnold.together`

**Czego unikać**

- Wyginanie lędźwi w łuk przy wyciskaniu. — ISSA: [overhead press proper form variations and common mistakes](https://issaonline.com/blog/post/overhead-press-proper-form-variations-and-common-mistakes) (Common mistakes: Lower back arch); BarBend: [arnold press](https://barbend.com/arnold-press/) (FAQ — wersja stojąca (avoid overextending your lower back)) `ohp.mis.arch`

### Seated Barbell Military Press

**Ustawienie**

- Chwyt trochę szerzej niż barki; sztanga z przodu barków. — ACE: [Seated Shoulder Press (#43)](https://www.acefitness.org/resources/everyone/exercise-library/43/seated-shoulder-press/) (opis, zdania 1–2 (grip a little wider than shoulder-width; bar lowered to the front of the shoulders, about chin height)); ISSA: [overhead press proper form variations and common mistakes](https://issaonline.com/blog/post/overhead-press-proper-form-variations-and-common-mistakes) (Standing Barbell Overhead Press (grip just outside shoulder width; bar across the front of the shoulders) + Seated Variations (upper-body form very similar)) `ohp.bbGrip`

**Ruch**

- Wypchnij ciężar nad głowę do wyprostu rąk; opuść go z powrotem do barków. — ACE: [Seated Shoulder Press (#43)](https://www.acefitness.org/resources/everyone/exercise-library/43/seated-shoulder-press/) (opis, zdania 3–4 (press directly overhead; slowly lower to chin height)); ISSA: [overhead press proper form variations and common mistakes](https://issaonline.com/blog/post/overhead-press-proper-form-variations-and-common-mistakes) (Standing Barbell Overhead Press (press straight up until the elbows are extended; return to the start) + Seated Variations) `ohp.move`

**Czego unikać**

- Łokcie uciekają na boki, zamiast być skierowane do przodu. — ISSA: [overhead press proper form variations and common mistakes](https://issaonline.com/blog/post/overhead-press-proper-form-variations-and-common-mistakes) (Common mistakes: Elbow flare (the elbows should point forward)); ACE: [Seated Shoulder Press (#43)](https://www.acefitness.org/resources/everyone/exercise-library/43/seated-shoulder-press/) (opis, zdanie 3 (keep the elbows pointed forward) — błąd = zaprzeczenie standardu) `ohp.mis.flare`
- Wyginanie lędźwi w łuk przy wyciskaniu. — ISSA: [overhead press proper form variations and common mistakes](https://issaonline.com/blog/post/overhead-press-proper-form-variations-and-common-mistakes) (Common mistakes: Lower back arch; Seated Variations (seated helps minimize the arch)); ACE: [Seated Shoulder Press (#43)](https://www.acefitness.org/resources/everyone/exercise-library/43/seated-shoulder-press/) (opis, zdanie 1 (keep the back straight) — błąd = zaprzeczenie standardu) `ohp.mis.arch`

### Kettlebell Press

**Ustawienie**

- Kettlebell przy barku, łokieć blisko żeber. — ACE: [single arm overhead press](https://www.acefitness.org/resources/everyone/exercise-library/395/single-arm-overhead-press/) (opis (kettlebell in front of the chest near the shoulder; elbow close to the rib cage) — przeczytane w rundzie 1); Catalyst Athletics: [Ketllebell Press](https://catalystathletics.com/exercise/855/Ketllebell-Press/) (Description (a kettlebell in each hand at the shoulders… and the arms against the ribs)) [uproszczenie: Catalyst opisuje wersję z dwoma kettlebellami — pozycja każdej ręki (kettlebell przy barku, ramię przy żebrach) jest ta sama] `kbp.setup`

**Ruch**

- Wypchnij kettlebell prosto nad głowę; opuść go z powrotem do barku, ściągając łokieć do żeber. — NSCA — Exercise Technique Manual (Human Kinetics): [one arm kettlebell press](https://us.humankinetics.com/blogs/excerpt/one-arm-kettlebell-press) (Upward Movement (press the kettlebell overhead, elbow fully extended); Downward Movement (lower slowly and under control)); ACE: [single arm overhead press](https://www.acefitness.org/resources/everyone/exercise-library/395/single-arm-overhead-press/) (opis (press the arm straight overhead; pull the elbow back down to the rib cage)) `kbp.move`

**Czego unikać**

- Przechylanie się w bok, żeby wypchnąć ciężar. — NSCA — Exercise Technique Manual (Human Kinetics): [one arm kettlebell press](https://us.humankinetics.com/blogs/excerpt/one-arm-kettlebell-press) (Upward Movement (do not allow the spine to flex laterally) — błąd = zaprzeczenie standardu); StrongFirst: [mastering your press part i](https://www.strongfirst.com/mastering-your-press-part-i/) (When Things Get Heavy, punkt 5 (side lean increasing during the attempt)) `ohp.mis.sideLean`
- Wyginanie lędźwi w łuk przy wyciskaniu. — ISSA: [overhead press proper form variations and common mistakes](https://issaonline.com/blog/post/overhead-press-proper-form-variations-and-common-mistakes) (wstęp (dumbbell, kettlebell, and resistance band variations) + Common Mistakes, punkt 6 (Arching the lower back)); NSCA — Exercise Technique Manual (Human Kinetics): [one arm kettlebell press](https://us.humankinetics.com/blogs/excerpt/one-arm-kettlebell-press) (wskazówki tułowia (keep the spine neutral) — błąd = zaprzeczenie standardu) `ohp.mis.arch`

### Kettlebell Seated Press

**Ustawienie**

- Kettlebell przy barku, łokieć blisko żeber. — ACE: [single arm overhead press](https://www.acefitness.org/resources/everyone/exercise-library/395/single-arm-overhead-press/) (opis (kettlebell near the shoulder; elbow close to the rib cage)); Catalyst Athletics: [Ketllebell Press](https://catalystathletics.com/exercise/855/Ketllebell-Press/) (Description (at the shoulders… arms against the ribs)); ISSA: [overhead press proper form variations and common mistakes](https://issaonline.com/blog/post/overhead-press-proper-form-variations-and-common-mistakes) (Seated Variations (seated kettlebell press; the upper body form is very similar… to the standing version)) [uproszczenie: pozycja siedząca Kettlebell Press — ISSA: górna część ciała pracuje w wersji siedzącej bardzo podobnie jak na stojąco; zmienia się tylko podparcie (ławka zamiast stóp i bioder)] `kbp.setup`

**Ruch**

- Wypchnij kettlebell prosto nad głowę; opuść go z powrotem do barku, ściągając łokieć do żeber. — NSCA — Exercise Technique Manual (Human Kinetics): [one arm kettlebell press](https://us.humankinetics.com/blogs/excerpt/one-arm-kettlebell-press) (Upward Movement; Downward Movement); ACE: [single arm overhead press](https://www.acefitness.org/resources/everyone/exercise-library/395/single-arm-overhead-press/) (opis (press straight overhead; elbow back down to the rib cage)); ISSA: [overhead press proper form variations and common mistakes](https://issaonline.com/blog/post/overhead-press-proper-form-variations-and-common-mistakes) (Seated Variations (very similar to the standing version)) [uproszczenie: pozycja siedząca Kettlebell Press — ten sam tor ręki nad głowę i powrót do barku (ISSA, Seated Variations)] `kbp.move`

**Czego unikać**

- Wyginanie lędźwi w łuk przy wyciskaniu. — ISSA: [overhead press proper form variations and common mistakes](https://issaonline.com/blog/post/overhead-press-proper-form-variations-and-common-mistakes) (Seated Variations (seated kettlebell press; seated position can help minimize a client's lower back arch) + Common Mistakes, punkt 6 (Arching the lower back)); NSCA — Exercise Technique Manual (Human Kinetics): [one arm kettlebell press](https://us.humankinetics.com/blogs/excerpt/one-arm-kettlebell-press) (wskazówki tułowia (keep the spine neutral; wersja stojąca) — błąd = zaprzeczenie standardu) `ohp.mis.arch`

### Band Shoulder Press

**Ustawienie**

- Stań na gumie, chwyć jej końce i unieś dłonie w okolice barków, łokcie ugięte. — Bodylastics: [standing shoulder press with bands](https://bodylastics.com/standing-shoulder-press-with-bands) (Start and Finish Positions (stand on the bands; raise your arms to a goal post position: upper arms parallel, forearms perpendicular to the floor) — przeczytane w W1); WebMD Ignite: [shoulder press](https://www.columbiadoctors.org/health-library/multimedia/shoulder-press/) (instrukcja (standing, pass the band under your feet; one end of the band in each hand)) `band.ohpSetup`

**Ruch**

- Wypchnij dłonie nad głowę, potem powoli wróć do pozycji startowej. — Bodylastics: [standing shoulder press with bands](https://bodylastics.com/standing-shoulder-press-with-bands) (Movement (press the handles overhead; lower back to the goal post position under control) — przeczytane w W1); WebMD Ignite: [shoulder press](https://www.columbiadoctors.org/health-library/multimedia/shoulder-press/) (instrukcja (slowly press your arms straight up over your head; slowly return to your starting position)) `band.ohpMove`

**Wskazówki**

- Tułów wysoko i stabilnie; ciężar idzie prosto w górę nad głowę. — Bodylastics: [standing shoulder press with bands](https://bodylastics.com/standing-shoulder-press-with-bands) (Start and Finish Positions (back straight, head straight, chest up) — przeczytane w W1); WebMD Ignite: [shoulder press](https://www.columbiadoctors.org/health-library/multimedia/shoulder-press/) (instrukcja (sit or stand up straight; press straight up)) `ohp.tall`

**Czego unikać**

- Wyginanie lędźwi w łuk przy wyciskaniu. — ISSA: [overhead press proper form variations and common mistakes](https://issaonline.com/blog/post/overhead-press-proper-form-variations-and-common-mistakes) (Common Mistakes (arching the lower back)); Bodylastics: [standing shoulder press with bands](https://bodylastics.com/standing-shoulder-press-with-bands) (Start and Finish Positions (keep your back straight) — błąd = zaprzeczenie standardu) [uproszczenie: wariant sprzętu Overhead Press — guma zamiast sztangi/hantli, ten sam pionowy wypych nad głowę na stojąco] `ohp.mis.arch`

### Single Arm Overhead Press (hantel)

**Ustawienie**

- Stań stabilnie, hantel w jednej ręce przy barku. — ACE: [single arm overhead press](https://www.acefitness.org/resources/everyone/exercise-library/395/single-arm-overhead-press/) (opis (stand with the feet hip-width apart; kettlebell in front of the chest near the shoulder)); WebMD Ignite: [shoulder press](https://www.columbiadoctors.org/health-library/multimedia/shoulder-press/) (instrukcja (stand up straight; hands near your shoulders; small weights such as dumbbells instead of a band)) [uproszczenie: wariant sprzętu: ACE 395 — jednorącz z kettlebellem, ColumbiaDoctors — hantle oburącz; pozycja startowa (stoisz, ciężar przy barku) ta sama] `ohp.saSetup`

**Ruch**

- Wypchnij hantel nad głowę do wyprostu ręki; opuść go spokojnie z powrotem do barku. — NSCA — Exercise Technique Manual (Human Kinetics): [one arm kettlebell press](https://us.humankinetics.com/blogs/excerpt/one-arm-kettlebell-press) (Upward Movement (press the kettlebell overhead, elbow fully extended); Downward Movement (lower slowly and under control back to the starting position)); ACE: [single arm overhead press](https://www.acefitness.org/resources/everyone/exercise-library/395/single-arm-overhead-press/) (opis (press the right arm straight overhead; pull the elbow back down to the rib cage to lower)) [uproszczenie: wariant sprzętu wyciskania jednorącz z kettlebellem — ten sam tor ręki nad głowę i powrót do barku; różni się tylko to, jak ciężar leży w dłoni] `ohp.saMove`

**Czego unikać**

- Przechylanie się w bok, żeby wypchnąć ciężar. — NSCA — Exercise Technique Manual (Human Kinetics): [one arm kettlebell press](https://us.humankinetics.com/blogs/excerpt/one-arm-kettlebell-press) (Upward Movement (do not allow the spine to flex laterally) — błąd = zaprzeczenie standardu); StrongFirst: [mastering your press part i](https://www.strongfirst.com/mastering-your-press-part-i/) (When Things Get Heavy, punkt 5 (leg drive and side lean increasing during the attempt) — przeczytane w W1 i ponownie 02.11.2026) [uproszczenie: wariant sprzętu wyciskania jednorącz z kettlebellem — ciężar po jednej stronie ciała tak samo przechyla tułów] `ohp.mis.sideLean`

### Ab Wheel

**Ustawienie**

- Uklęknij i chwyć kółko oburącz przed kolanami, ręce proste. — Catalyst Athletics: [Ab Rollout](https://catalystathletics.com/exercise/135/Ab-Rollout) (opis (kneel, wheel close to the knees, arms straight)); Echelon Fitness: [ECHELON AB WHEEL EXERCISE GUIDE.pdf](https://cdn.shopify.com/s/files/1/2422/9487/files/ECHELON-AB-WHEEL-EXERCISE-GUIDE.pdf) (s. 1, AB ROLL — START) `rollout.wheel.setup`

**Ruch**

- Powoli wytocz kółko do przodu, opuszczając tułów w stronę podłogi, i wróć do klęku. — Echelon Fitness: [ECHELON AB WHEEL EXERCISE GUIDE.pdf](https://cdn.shopify.com/s/files/1/2422/9487/files/ECHELON-AB-WHEEL-EXERCISE-GUIDE.pdf) (s. 1, AB ROLL — FINISH); Catalyst Athletics: [Ab Rollout](https://catalystathletics.com/exercise/135/Ab-Rollout) (opis (roll out, pull back)) `rollout.wheel.move`

### Renegade Row

**Ustawienie**

- Podpór na hantlach ustawionych pod barkami, nogi proste, stopy na szerokość barków lub szerzej. — ACE: [renegade row](https://www.acefitness.org/resources/everyone/exercise-library/355/renegade-row/) (Preparation; Step 1); BarBend: [renegade row](https://www.barbend.com/renegade-row/) (Step 1 — Set Your Base (feet wider than shoulder-width)) `renegade.setup`

**Ruch**

- Przyciągnij jeden hantel do boku tułowia, odłóż go spokojnie i zmień rękę. — ACE: [renegade row](https://www.acefitness.org/resources/everyone/exercise-library/355/renegade-row/) (Steps 3–6); BarBend: [renegade row](https://www.barbend.com/renegade-row/) (Step 2 — Initiate the Row; Step 3 — Control the Eccentric) `renegade.move`

**Czego unikać**

- Skręcanie bioder i tułowia, żeby dźwignąć hantel. — BarBend: [renegade row](https://www.barbend.com/renegade-row/) (Common Mistakes — Twisting Your Body); NASM: [Best Abs Exercises (blog, H. Cherry, akt. 23.07.2026)](https://www.nasm.org/resource-center/blog/training/best-abs-exercises) (sekcja Renegade Row — Common Mistake (hips shift side to side; excessive rotation) i Coaching Tip (square hips)) `renegade.mis.twist`

### Rollout (sztanga)

**Ustawienie**

- Uklęknij przed sztangą i chwyć ją oburącz. — ACE: [309](https://www.acefitness.org/resources/everyone/exercise-library/309/) (Preparation; Step 1); Catalyst Athletics: [Ab Rollout](https://catalystathletics.com/exercise/135/Ab-Rollout) (opis (ab wheel or barbell with rotating sleeves; kneel)) `rollout.bar.setup`

**Ruch**

- Wytocz sztangę do przodu, opuszczając tułów w stronę podłogi, i przyciągnij ją z powrotem. — ACE: [309](https://www.acefitness.org/resources/everyone/exercise-library/309/) (Steps 2–4); Catalyst Athletics: [Ab Rollout](https://catalystathletics.com/exercise/135/Ab-Rollout) (opis (roll out, pull back)) `rollout.bar.move`

**Wskazówki**

- Wytaczaj tylko tak daleko, jak dasz radę bez wyginania lędźwi. — ACE: [309](https://www.acefitness.org/resources/everyone/exercise-library/309/) (Step 2 (keep the hips pressed forward and the back straight)); Catalyst Athletics: [Ab Rollout](https://catalystathletics.com/exercise/135/Ab-Rollout) (opis (as close to the ground as possible while maintaining the brace)) `rollout.range`
- Napnij brzuch, żeby tułów był sztywny. — ACE: [309](https://www.acefitness.org/resources/everyone/exercise-library/309/) (Step 3 (hold the trunk in position)); Catalyst Athletics: [Ab Rollout](https://catalystathletics.com/exercise/135/Ab-Rollout) (opis (brace the abs hard)) `plank.brace`

**Czego unikać**

- Wygięte w łuk lędźwie przy wytaczaniu. — ACE: [309](https://www.acefitness.org/resources/everyone/exercise-library/309/) (Step 2 (back straight)); Catalyst Athletics: [Ab Rollout](https://catalystathletics.com/exercise/135/Ab-Rollout) (opis (avoid hyperextension of the lower back)) `rollout.mis.arch`

### Incline Chest Fly (hantle)

**Ustawienie**

- Połóż się na ławce, hantle nad klatką, łokcie lekko ugięte. — NFPT: [how to do incline bench dumbbell flyes](https://nfpt.com/how-to-do-incline-bench-dumbbell-flyes/) (instrukcja, krok 1 (lie back on the incline bench, arms extended straight up toward the ceiling)); BarBend: [dumbbell flye variations](https://barbend.com/dumbbell-flye-variations/) (Incline Dumbbell Flye > How to Do the Incline Dumbbell Flye (lay back on the bench with dumbbells in your hands; slight bend in your elbows)) `dfly.setup`

**Ruch**

- Opuść hantle szerokim łukiem na boki do rozciągnięcia klatki; wróć tym samym łukiem nad klatkę. — NFPT: [how to do incline bench dumbbell flyes](https://nfpt.com/how-to-do-incline-bench-dumbbell-flyes/) (instrukcja (lower the weights out to the sides with elbows slightly bent; raise back to the start)); BarBend: [dumbbell flye variations](https://barbend.com/dumbbell-flye-variations/) (Incline Dumbbell Flye > How to Do… (open the arms wide to a deep chest stretch; hugging motion back up)) `dfly.move`

**Wskazówki**

- Łokcie lekko ugięte, w stałym kącie przez cały ruch. — NFPT: [how to do incline bench dumbbell flyes](https://nfpt.com/how-to-do-incline-bench-dumbbell-flyes/) (instrukcja (keeping elbows slightly bent — przy opuszczaniu i unoszeniu)); BarBend: [dumbbell flye variations](https://barbend.com/dumbbell-flye-variations/) (Incline Dumbbell Flye > How to Do… („Maintain a slight bend in your elbows.”)) `fly.elbows`

**Czego unikać**

- Zginanie i prostowanie łokci w trakcie powtórzenia. — wniosek ze zdania `fly.elbows` tej karty; BarBend: [dumbbell flye variations](https://barbend.com/dumbbell-flye-variations/) (Incline Dumbbell Flye > How to Do… (hugging a tree rather than pressing them straight up)); NFPT: [how to do incline bench dumbbell flyes](https://nfpt.com/how-to-do-incline-bench-dumbbell-flyes/) (lista błędów (avoid locking out your elbows after you have raised the dumbbells)) `fly.mis.elbows`

### Chest Dip

**Ustawienie**

- Chwyć poręcze i unieś się na prostych rękach, stopy nad podłogą. — ISSA: [chest dips form benefits variations what to avoid](https://www.issaonline.com/blog/post/chest-dips-form-benefits-variations-what-to-avoid) (How to Perform the Chest Dip (with your body in between two bars, place both hands on the dip bar; feet off the ground and arms are straight)); BarBend: [dips](https://barbend.com/dips/) (How to Do the Dip, krok 1 (set your hands evenly on the bars); akapit Ring Dips (start w wyproście — steady at lockout before dipping down)) `dip.setup`

**Ruch**

- Zegnij łokcie i opuść się między poręczami, potem wypchnij się z powrotem do prostych rąk. — ISSA: [chest dips form benefits variations what to avoid](https://www.issaonline.com/blog/post/chest-dips-form-benefits-variations-what-to-avoid) (How to Perform the Chest Dip (bending at the elbows and lowering your body down; press your body back up to the starting position)); BarBend: [dips](https://barbend.com/dips/) (How to Do the Dip (flex your elbows and lower your body; drive through your palms to raise your body back to the starting position)) `dip.move`

**Wskazówki**

- Pochyl tułów lekko w przód. — ISSA: [chest dips form benefits variations what to avoid](https://www.issaonline.com/blog/post/chest-dips-form-benefits-variations-what-to-avoid) (How to Perform the Chest Dip (maintain a slight forward lean to emphasize the strain on your chest)); BarBend: [dips](https://barbend.com/dips/) (How to Do the Dip (nearly vertical, with perhaps a slight lean forward); Common Mistakes — Letting Your Chest Sink (slight forward lean)) `dip.chestLean`
- Napnij brzuch, żeby tułów był sztywny. — ISSA: [chest dips form benefits variations what to avoid](https://www.issaonline.com/blog/post/chest-dips-form-benefits-variations-what-to-avoid) (How to Perform the Chest Dip (keep your core engaged)); BarBend: [dips](https://barbend.com/dips/) (How to Do the Dip (your core tight)) `plank.brace`

**Czego unikać**

- Schodzenie za nisko albo zatrzymywanie się za wysoko. — ISSA: [chest dips form benefits variations what to avoid](https://www.issaonline.com/blog/post/chest-dips-form-benefits-variations-what-to-avoid) (What to Avoid When Performing Chest Dips (going too low, not going low enough)); BarBend: [dips](https://barbend.com/dips/) (Common Mistakes — Going Too Low; Not Going Low Enough) `dip.mis.depth`
- Odchylanie tułowia do tyłu. — ISSA: [chest dips form benefits variations what to avoid](https://www.issaonline.com/blog/post/chest-dips-form-benefits-variations-what-to-avoid) (What to Avoid When Performing Chest Dips (leaning back)); BarBend: [dips](https://barbend.com/dips/) (How to Do the Dip (slight lean forward) — błąd = zaprzeczenie standardu) `dip.mis.leanBack`
- Za mocne pochylenie — klatka leci w dół między poręcze. — BarBend: [dips](https://barbend.com/dips/) (Common Mistakes — Letting Your Chest Sink (leaning too far forward)); ISSA: [chest dips form benefits variations what to avoid](https://www.issaonline.com/blog/post/chest-dips-form-benefits-variations-what-to-avoid) (How to Perform the Chest Dip (slight forward lean) — błąd = zaprzeczenie standardu) `dip.mis.overLean`

### Seated Cable Chest Press

**Ustawienie**

- Usiądź, plecy przy oparciu, stopy na podłodze; uchwyty przy klatce, łokcie ugięte. — ACE: [Seated Cable Press (#165)](https://www.acefitness.org/resources/everyone/exercise-library/165/seated-cable-press/) (Step 1 (back firmly supported against the backrest; hands level with your mid-chest region; feet firmly on the floor)); NASM: [Chest Press Machine](https://www.nasm.org/resource-center/exercise-library/chest-press-machine) (Step 1: Setup (back firmly against the backrest; handles align with mid-chest height; feet on the floor) — wariant sprzętu) [uproszczenie: wariant sprzętu Machine Chest Press] `cpress.seated`

**Ruch**

- Wypchnij uchwyty przed siebie, potem powoli wróć w stronę klatki. — ACE: [Seated Cable Press (#165)](https://www.acefitness.org/resources/everyone/exercise-library/165/seated-cable-press/) (Step 2–3 (extending your arms forward at the level of your mid-chest; slowly return … moving the handles back towards your chest)); NASM: [Chest Press Machine](https://www.nasm.org/resource-center/exercise-library/chest-press-machine) (Step 3: Execute (press the handles forward); Step 4: Return (with control) — wariant sprzętu) [uproszczenie: wariant sprzętu Machine Chest Press] `cpress.seatedMove`

**Wskazówki**

- Łopatki zostają przy oparciu — nie wysuwaj barków w przód na końcu ruchu. — ACE: [Seated Cable Press (#165)](https://www.acefitness.org/resources/everyone/exercise-library/165/seated-cable-press/) (Step 1 (depress and retract your scapulae); Step 2 (contact with your back and shoulder blades against the backrest; minimize rounding your shoulder blades)); NASM: [Chest Press Machine](https://www.nasm.org/resource-center/exercise-library/chest-press-machine) (Step 2: Brace (position your shoulders back and down) — wariant sprzętu) [uproszczenie: wariant sprzętu Machine Chest Press] `mcp.blades`
- Napnij brzuch, żeby tułów był sztywny. — ACE: [Seated Cable Press (#165)](https://www.acefitness.org/resources/everyone/exercise-library/165/seated-cable-press/) (Step 1 (stiffen („brace”) your abdominal muscles)); NASM: [Chest Press Machine](https://www.nasm.org/resource-center/exercise-library/chest-press-machine) (Step 2: Brace (engage your core) — wariant sprzętu) [uproszczenie: wariant sprzętu Machine Chest Press] `plank.brace`

**Czego unikać**

- Gwałtowne blokowanie łokci na końcu ruchu. — NASM: [Chest Press Machine](https://www.nasm.org/resource-center/exercise-library/chest-press-machine) (Common Mistakes (locking out elbows at the top) — wariant sprzętu); ACE: [Seated Cable Press (#165)](https://www.acefitness.org/resources/everyone/exercise-library/165/seated-cable-press/) (Step 3 (fully extended, but not locked) — błąd = zaprzeczenie standardu) [uproszczenie: wariant sprzętu Machine Chest Press] `press.mis.lock`
- Szarpanie i rzucanie ciężarem zamiast kontrolowanego ruchu. — NASM: [Chest Press Machine](https://www.nasm.org/resource-center/exercise-library/chest-press-machine) (Common Mistakes (jerky or uncontrolled movements) — wariant sprzętu); ACE: [Seated Cable Press (#165)](https://www.acefitness.org/resources/everyone/exercise-library/165/seated-cable-press/) (Step 3 (slow, controlled manner); Step 4 (control the speed, range and direction of movement) — błąd = zaprzeczenie standardu) [uproszczenie: wariant sprzętu Machine Chest Press] `mis.jerk`

### Decline Push Up

**Ustawienie**

- Dłonie na podłodze, stopy na ławce albo stopniu; ciało proste od głowy do pięt. — NASM: [decline push up](https://www.nasm.org/resource-center/exercise-library/decline-push-up) (Step 1; Step 2); Fitness Volt: [?p=75039](https://fitnessvolt.com/?p=75039) (How-to: „place your feet up onto your chosen platform”; „With your body in a straight line”); The Prehab Guys: [push up exercise variations](https://theprehabguys.com/push-up-exercise-variations/) (Progressions → Decline Push Up („The biggest focus for this exercise needs to be on body alignment.”)) `dpush.setup`

**Ruch**

- Opuść klatkę prawie do podłogi, zginając łokcie; wypchnij się do wyprostu rąk. — NASM: [decline push up](https://www.nasm.org/resource-center/exercise-library/decline-push-up) (Step 3; Step 4); Fitness Volt: [?p=75039](https://fitnessvolt.com/?p=75039) (How-to: „Lower yourself as far down as you can and then press yourself back up until arms are extended.”) `push.move`

**Wskazówki**

- Napnij brzuch, żeby tułów był sztywny. — NASM: [decline push up](https://www.nasm.org/resource-center/exercise-library/decline-push-up) (Step 2 (engage your core)); Fitness Volt: [?p=75039](https://fitnessvolt.com/?p=75039) (How-to: „tense your core to maintain a rigid torso”) `plank.brace`

**Czego unikać**

- Biodra opadają i ciało przestaje być w linii. — NASM: [decline push up](https://www.nasm.org/resource-center/exercise-library/decline-push-up) (Common Mistakes (Allowing hips to sag)); Fitness Volt: [?p=75039](https://fitnessvolt.com/?p=75039) (zaprzeczenie standardu: „With your body in a straight line and butt lifted”); wniosek ze zdania `dpush.setup` tej karty `push.mis.sag`

### Suspended Push-Up

**Ustawienie**

- Chwyć uchwyty taśm, ręce wyprostowane przed sobą; pochyl się do przodu, ciało proste i pod skosem. — TRX: [trx push up](https://www.trxtraining.com/blogs/news/trx-push-up) (Step 3–6); Fitness Volt: [suspension chest press](https://fitnessvolt.com/suspension-chest-press/) (Step 3 („Keep your arms fully extended and lean your weight forward onto the straps”)) `spush.setup`

**Ruch**

- Opuść klatkę w stronę dłoni, zginając łokcie; wypchnij się z powrotem do wyprostu rąk. — TRX: [trx push up](https://www.trxtraining.com/blogs/news/trx-push-up) (Step 7–9); Fitness Volt: [suspension chest press](https://fitnessvolt.com/suspension-chest-press/) (Step 5; Step 6) `spush.move`

**Wskazówki**

- Napnij brzuch, żeby tułów był sztywny. — TRX: [trx push up](https://www.trxtraining.com/blogs/news/trx-push-up) (Form Cues); Fitness Volt: [suspension chest press](https://fitnessvolt.com/suspension-chest-press/) (Step 3 („Tighten your core muscles, glutes, and quadriceps”)) `plank.brace`

**Czego unikać**

- Łokcie rozjeżdżają się szeroko na boki. — Fitness Volt: [suspension chest press](https://fitnessvolt.com/suspension-chest-press/) (Pro tip („Avoid flaring your elbows too wide”)); TRX: [trx push up](https://www.trxtraining.com/blogs/news/trx-push-up) (zaprzeczenie standardu: Form Cues (łokcie ok. 45° do tułowia)) `push.mis.flare`

### Single Leg Calf Raise

**Ustawienie**

- Stań przednią częścią jednej stopy na krawędzi stopnia, pięta poza krawędzią; drugą nogę unieś. — ISSA: [top six exercises for building bigger calves](https://www.issaonline.com/blog/post/top-six-exercises-for-building-bigger-calves) (Single-Leg Calf Raises (także „on … an elevated platform”); Elevated Calf Raises (pięty poza krawędzią)); ACE: [Standing Calf Raises Wall (#73)](https://www.acefitness.org/resources/everyone/exercise-library/73/standing-calf-raises-wall/) (Exercise Variation (1): Single-leg Calf Raise („bend your left knee to lift your left foot off the floor”; wariant: z podłogi)); NASM: [Calf Training: How to Program This Stubborn Muscle Group (blog, H. Cherry, akt. 25.07.2026)](https://www.nasm.org/resource-center/blog/training/calf-training-how-to-program-this-stubborn-muscle-group-for-clients) (The Exercise Menu („dumbbell on a step”; wariant: obunóż)) `calf.stepOne`

**Ruch**

- Wspinaj się na palce jak najwyżej, potem opuść pięty, aż poczujesz rozciągnięcie łydek. — ISSA: [top six exercises for building bigger calves](https://www.issaonline.com/blog/post/top-six-exercises-for-building-bigger-calves) (Elevated Calf Raises („until the heels are slightly below the raised platform”; uproszczenie: wariant jednonóż)); NASM: [Calf Training: How to Program This Stubborn Muscle Group (blog, H. Cherry, akt. 25.07.2026)](https://www.nasm.org/resource-center/blog/training/calf-training-how-to-program-this-stubborn-muscle-group-for-clients) (Technique Standards That Change Everything (wariant: obunóż)) `calf.move`

**Wskazówki**

- Kolana proste lub tylko lekko ugięte — ruch wyłącznie w stawach skokowych. — ACE: [Standing Calf Raises Wall (#73)](https://www.acefitness.org/resources/everyone/exercise-library/73/standing-calf-raises-wall/) (Step 2 („keeping your knees extended”); Variation (1)); ISSA: [top six exercises for building bigger calves](https://www.issaonline.com/blog/post/top-six-exercises-for-building-bigger-calves) (Standing Calf Raises („a straight knee”)) `calf.knees`
- Zatrzymaj się chwilę na górze i opuszczaj powoli. — ACE: [Standing Calf Raises Wall (#73)](https://www.acefitness.org/resources/everyone/exercise-library/73/standing-calf-raises-wall/) (Step 2–3 („Hold your raised position briefly.”; „slowly lower your heels”)); ISSA: [top six exercises for building bigger calves](https://www.issaonline.com/blog/post/top-six-exercises-for-building-bigger-calves) (Standing Calf Raises (slight pause at the top)) `calf.pause`

**Czego unikać**

- Skrócony zakres — bez pełnego wspięcia i opuszczenia. — NASM: [Calf Training: How to Program This Stubborn Muscle Group (blog, H. Cherry, akt. 25.07.2026)](https://www.nasm.org/resource-center/blog/training/calf-training-how-to-program-this-stubborn-muscle-group-for-clients) (Technique Standards That Change Everything); ISSA: [top six exercises for building bigger calves](https://www.issaonline.com/blog/post/top-six-exercises-for-building-bigger-calves) (Elevated Calf Raises (standard pełnego zakresu; błąd = zaprzeczenie standardu)) `calf.mis.partial`

### Seated Calf Raise (hantle)

**Ustawienie**

- Usiądź z ugiętymi kolanami, przednią część stóp oprzyj na podwyższeniu, pięty poza krawędzią. — ISSA: [top six exercises for building bigger calves](https://www.issaonline.com/blog/post/top-six-exercises-for-building-bigger-calves) (Seated Calf Raises („Heels should be hanging with the balls of the feet pressing into the foot platform on the machine.”; uproszczenie: wariant sprzętu — maszyna)); Kinoshita i in. (Ritsumeikan University): [Triceps surae muscle hypertrophy is greater after standing versus seated calf-raise training, Front Physiol 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10753835/) (Methods, Participants and overview („seated/knee 90°-flexed position”); ryc. 1 (zakres od 20° zgięcia grzbietowego — pięty niżej niż palce; parafraza)) `calf.seatedEdge`

**Ruch**

- Wspinaj się na palce jak najwyżej, potem opuść pięty, aż poczujesz rozciągnięcie łydek. — Kinoshita i in. (Ritsumeikan University): [Triceps surae muscle hypertrophy is greater after standing versus seated calf-raise training, Front Physiol 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10753835/) (ryc. 1 (zakres od 20° zgięcia grzbietowego do 30° podeszwowego, kolano 90°; parafraza)); ISSA: [25 minute calf workout](https://issaonline.com/blog/post/25-minute-calf-workout) (Seated Calf Raise („let your heels drop below the foot platform”; uproszczenie: wariant sprzętu — maszyna)) `calf.move`

**Wskazówki**

- Zatrzymaj się chwilę na górze i opuszczaj powoli. — ISSA: [25 minute calf workout](https://issaonline.com/blog/post/25-minute-calf-workout) (Seated Calf Raise („squeeze the back of the legs at the top of the motion”)); ACE: [Calf Raises (#51)](https://www.acefitness.org/resources/everyone/exercise-library/51/calf-raises/) (opis (pauza na górze, powolne opuszczanie; wariant: stojąc)); Kinoshita i in. (Ritsumeikan University): [Triceps surae muscle hypertrophy is greater after standing versus seated calf-raise training, Front Physiol 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10753835/) (Methods, Training program (2 s opuszczania; parafraza)) `calf.pause`

**Czego unikać**

- Skrócony zakres — bez pełnego wspięcia i opuszczenia. — NASM: [Calf Training: How to Program This Stubborn Muscle Group (blog, H. Cherry, akt. 25.07.2026)](https://www.nasm.org/resource-center/blog/training/calf-training-how-to-program-this-stubborn-muscle-group-for-clients) (Technique Standards That Change Everything (wariant: stojąc)); ISSA: [25 minute calf workout](https://issaonline.com/blog/post/25-minute-calf-workout) (Seated Calf Raise (standard: pięty poniżej podestu, napięcie na górze; błąd = zaprzeczenie standardu)) `calf.mis.partial`

### Smith Machine Calf Raise

**Ustawienie**

- Stań przednią częścią stóp na krawędzi podestu, pięty poza krawędzią. — ISSA: [top six exercises for building bigger calves](https://www.issaonline.com/blog/post/top-six-exercises-for-building-bigger-calves) (Elevated Calf Raises („heels of both feet hanging off the edge of the platform”; uproszczenie: wariant sprzętu — wspięcia stojąc na podeście)); NASM: [Calf Training: How to Program This Stubborn Muscle Group (blog, H. Cherry, akt. 25.07.2026)](https://www.nasm.org/resource-center/blog/training/calf-training-how-to-program-this-stubborn-muscle-group-for-clients) (The Exercise Menu („Standing calf raise (machine, smith, or dumbbell on a step)”); Technique Standards (pięty poniżej palców)) `calf.edge`

**Ruch**

- Wspinaj się na palce jak najwyżej, potem opuść pięty, aż poczujesz rozciągnięcie łydek. — ISSA: [top six exercises for building bigger calves](https://www.issaonline.com/blog/post/top-six-exercises-for-building-bigger-calves) (Elevated Calf Raises (opuszczanie „until the heels are slightly below the raised platform”)); NASM: [Calf Training: How to Program This Stubborn Muscle Group (blog, H. Cherry, akt. 25.07.2026)](https://www.nasm.org/resource-center/blog/training/calf-training-how-to-program-this-stubborn-muscle-group-for-clients) (Technique Standards That Change Everything) `calf.move`

**Wskazówki**

- Kolana proste lub tylko lekko ugięte — ruch wyłącznie w stawach skokowych. — ISSA: [25 minute calf workout](https://issaonline.com/blog/post/25-minute-calf-workout) (Standing Calf Raise („Keep your legs straight without locking out your knees completely.”)); ACE: [Calf Raises (#51)](https://www.acefitness.org/resources/everyone/exercise-library/51/calf-raises/) (opis („Keep a slight bend in knees”; wariant: sztanga)) `calf.knees`
- Zatrzymaj się chwilę na górze i opuszczaj powoli. — ISSA: [top six exercises for building bigger calves](https://www.issaonline.com/blog/post/top-six-exercises-for-building-bigger-calves) (Standing Calf Raises („…with a slight pause at the top of the contraction.”)); ACE: [Calf Raises (#51)](https://www.acefitness.org/resources/everyone/exercise-library/51/calf-raises/) (opis („Pause at the top, and slowly roll the heels back down”; wariant: sztanga)) `calf.pause`

**Czego unikać**

- Skrócony zakres — bez pełnego wspięcia i opuszczenia. — NASM: [Calf Training: How to Program This Stubborn Muscle Group (blog, H. Cherry, akt. 25.07.2026)](https://www.nasm.org/resource-center/blog/training/calf-training-how-to-program-this-stubborn-muscle-group-for-clients) (Technique Standards That Change Everything (szybkie, niepełne powtórzenia jako częsty błąd)); ISSA: [top six exercises for building bigger calves](https://www.issaonline.com/blog/post/top-six-exercises-for-building-bigger-calves) (Elevated Calf Raises (standard: wspięcie z pauzą na górze i opuszczenie pięt poniżej podestu; błąd = zaprzeczenie standardu)) `calf.mis.partial`

### Calf Raise (sztanga)

**Ustawienie**

- Stań przednią częścią stóp na krawędzi podestu, pięty poza krawędzią. — ISSA: [top six exercises for building bigger calves](https://www.issaonline.com/blog/post/top-six-exercises-for-building-bigger-calves) (Elevated Calf Raises (uproszczenie: wariant sprzętu — wspięcia stojąc na podeście); ISSA 25-min: obciążenie „place a barbell on your back”); NASM: [Calf Training: How to Program This Stubborn Muscle Group (blog, H. Cherry, akt. 25.07.2026)](https://www.nasm.org/resource-center/blog/training/calf-training-how-to-program-this-stubborn-muscle-group-for-clients) (The Exercise Menu; Technique Standards (pięty poniżej palców; wariant: maszyna/Smith/hantle)) `calf.edge`

**Ruch**

- Wspinaj się na palce jak najwyżej, potem opuść pięty, aż poczujesz rozciągnięcie łydek. — ISSA: [top six exercises for building bigger calves](https://www.issaonline.com/blog/post/top-six-exercises-for-building-bigger-calves) (Elevated Calf Raises („until the heels are slightly below the raised platform”)); NASM: [Calf Training: How to Program This Stubborn Muscle Group (blog, H. Cherry, akt. 25.07.2026)](https://www.nasm.org/resource-center/blog/training/calf-training-how-to-program-this-stubborn-muscle-group-for-clients) (Technique Standards That Change Everything) `calf.move`

**Wskazówki**

- Kolana proste lub tylko lekko ugięte — ruch wyłącznie w stawach skokowych. — ACE: [Calf Raises (#51)](https://www.acefitness.org/resources/everyone/exercise-library/51/calf-raises/) (opis („Keep a slight bend in knees”)); ISSA: [25 minute calf workout](https://issaonline.com/blog/post/25-minute-calf-workout) (Standing Calf Raise („Keep your legs straight without locking out your knees completely.”)) `calf.knees`
- Zatrzymaj się chwilę na górze i opuszczaj powoli. — ACE: [Calf Raises (#51)](https://www.acefitness.org/resources/everyone/exercise-library/51/calf-raises/) (opis („Pause at the top, and slowly roll the heels back down”)); ISSA: [top six exercises for building bigger calves](https://www.issaonline.com/blog/post/top-six-exercises-for-building-bigger-calves) (Standing Calf Raises (slight pause at the top)) `calf.pause`

**Czego unikać**

- Skrócony zakres — bez pełnego wspięcia i opuszczenia. — NASM: [Calf Training: How to Program This Stubborn Muscle Group (blog, H. Cherry, akt. 25.07.2026)](https://www.nasm.org/resource-center/blog/training/calf-training-how-to-program-this-stubborn-muscle-group-for-clients) (Technique Standards That Change Everything (szybkie, niepełne powtórzenia)); ISSA: [top six exercises for building bigger calves](https://www.issaonline.com/blog/post/top-six-exercises-for-building-bigger-calves) (Elevated Calf Raises (standard pełnego zakresu; błąd = zaprzeczenie standardu)) `calf.mis.partial`

### Calf Raise (linki)

**Ustawienie**

- Stań prosto, palce stóp skierowane do przodu. — ACE: [Calf Raises (#51)](https://www.acefitness.org/resources/everyone/exercise-library/51/calf-raises/) (opis („toes pointed forward”; uproszczenie: wariant sprzętu — sztanga)); ISSA: [top six exercises for building bigger calves](https://www.issaonline.com/blog/post/top-six-exercises-for-building-bigger-calves) (Standing Calf Raises („toes pointed forward and a straight knee”)) `calf.stand`

**Ruch**

- Wspinaj się na palce, potem pod kontrolą opuść pięty. — ACE: [Calf Raises (#51)](https://www.acefitness.org/resources/everyone/exercise-library/51/calf-raises/) (opis („press the toes into the ground while lifting the heels up”; „slowly roll the heels back down to the floor”)); ISSA: [25 minute calf workout](https://issaonline.com/blog/post/25-minute-calf-workout) (Standing Calf Raise („slowly raise your heels off the ground”; obciążenie trzymane przy bokach)) `calf.rise`

**Wskazówki**

- Kolana proste lub tylko lekko ugięte — ruch wyłącznie w stawach skokowych. — ACE: [Calf Raises (#51)](https://www.acefitness.org/resources/everyone/exercise-library/51/calf-raises/) (opis („Keep a slight bend in knees”)); ISSA: [25 minute calf workout](https://issaonline.com/blog/post/25-minute-calf-workout) (Standing Calf Raise („Keep your legs straight without locking out your knees completely.”)) `calf.knees`
- Zatrzymaj się chwilę na górze i opuszczaj powoli. — ACE: [Calf Raises (#51)](https://www.acefitness.org/resources/everyone/exercise-library/51/calf-raises/) (opis („Pause at the top…”)); ISSA: [top six exercises for building bigger calves](https://www.issaonline.com/blog/post/top-six-exercises-for-building-bigger-calves) (Standing Calf Raises (slight pause at the top)) `calf.pause`

**Czego unikać**

- Skrócony zakres — bez pełnego wspięcia i opuszczenia. — NASM: [Calf Training: How to Program This Stubborn Muscle Group (blog, H. Cherry, akt. 25.07.2026)](https://www.nasm.org/resource-center/blog/training/calf-training-how-to-program-this-stubborn-muscle-group-for-clients) (Technique Standards That Change Everything (szybkie, niepełne powtórzenia; wariant: na podeście)); ACE: [Calf Raises (#51)](https://www.acefitness.org/resources/everyone/exercise-library/51/calf-raises/) (opis (pełne wspięcie i opuszczenie pięt do podłogi; błąd = zaprzeczenie standardu)) `calf.mis.partial`

### Barbell Seated Calf Raise

**Ustawienie**

- Usiądź z ugiętymi kolanami, przednią część stóp oprzyj na podwyższeniu, pięty poza krawędzią. — ISSA: [top six exercises for building bigger calves](https://www.issaonline.com/blog/post/top-six-exercises-for-building-bigger-calves) (Seated Calf Raises (pięty poza podestem; uproszczenie: wariant sprzętu — maszyna)); Kinoshita i in. (Ritsumeikan University): [Triceps surae muscle hypertrophy is greater after standing versus seated calf-raise training, Front Physiol 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10753835/) (Methods („seated/knee 90°-flexed position”); ryc. 1 (parafraza)) `calf.seatedEdge`

**Ruch**

- Wspinaj się na palce jak najwyżej, potem opuść pięty, aż poczujesz rozciągnięcie łydek. — Kinoshita i in. (Ritsumeikan University): [Triceps surae muscle hypertrophy is greater after standing versus seated calf-raise training, Front Physiol 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10753835/) (ryc. 1 (zakres zgięcia grzbietowego i podeszwowego w siadzie; parafraza)); ISSA: [25 minute calf workout](https://issaonline.com/blog/post/25-minute-calf-workout) (Seated Calf Raise („let your heels drop below the foot platform”)) `calf.move`

**Wskazówki**

- Zatrzymaj się chwilę na górze i opuszczaj powoli. — ISSA: [25 minute calf workout](https://issaonline.com/blog/post/25-minute-calf-workout) (Seated Calf Raise (squeeze at the top)); ACE: [Calf Raises (#51)](https://www.acefitness.org/resources/everyone/exercise-library/51/calf-raises/) (opis (wariant: stojąc)) `calf.pause`

**Czego unikać**

- Skrócony zakres — bez pełnego wspięcia i opuszczenia. — NASM: [Calf Training: How to Program This Stubborn Muscle Group (blog, H. Cherry, akt. 25.07.2026)](https://www.nasm.org/resource-center/blog/training/calf-training-how-to-program-this-stubborn-muscle-group-for-clients) (Technique Standards That Change Everything (wariant: stojąc)); ISSA: [25 minute calf workout](https://issaonline.com/blog/post/25-minute-calf-workout) (Seated Calf Raise (standard pełnego zakresu; błąd = zaprzeczenie standardu)) `calf.mis.partial`

### Band Calf Raise

**Ustawienie**

- Stań prosto, trzymając w dłoniach końce gumy albo uchwyty. — Bodylastics: [standing calf raises with flat bands](https://bodylastics.com/exercise/standing-calf-raises-with-flat-bands) (Setup (uchwyt w każdej dłoni, tułów wyprostowany)); Thera-Band: [thera band ankle calf raise in standing](https://www.performancehealthacademy.com/exercises/thera-band-ankle-calf-raise-in-standing.html) (Step One–Two (guma pod przednią częścią stóp, końce w dłoniach przy biodrach)) `calf.band`

**Ruch**

- Wspinaj się na palce, potem pod kontrolą opuść pięty. — Bodylastics: [standing calf raises with flat bands](https://bodylastics.com/exercise/standing-calf-raises-with-flat-bands) (Movement („as high on your toes as you can go”; „Lower your heels back to the floor under control.”)); Thera-Band: [thera band ankle calf raise in standing](https://www.performancehealthacademy.com/exercises/thera-band-ankle-calf-raise-in-standing.html) (Step Three–Four) `calf.rise`

**Wskazówki**

- Zatrzymaj się chwilę na górze i opuszczaj powoli. — Thera-Band: [thera band ankle calf raise in standing](https://www.performancehealthacademy.com/exercises/thera-band-ankle-calf-raise-in-standing.html) (Step Four („Hold and slowly return.”)); ACE: [Calf Raises (#51)](https://www.acefitness.org/resources/everyone/exercise-library/51/calf-raises/) (opis (wariant: sztanga)) `calf.pause`

**Czego unikać**

- Skrócony zakres — bez pełnego wspięcia i opuszczenia. — NASM: [Calf Training: How to Program This Stubborn Muscle Group (blog, H. Cherry, akt. 25.07.2026)](https://www.nasm.org/resource-center/blog/training/calf-training-how-to-program-this-stubborn-muscle-group-for-clients) (Technique Standards That Change Everything (wariant: stojąc na podeście)); Bodylastics: [standing calf raises with flat bands](https://bodylastics.com/exercise/standing-calf-raises-with-flat-bands) (Movement (pełne wspięcie i opuszczenie pięt; błąd = zaprzeczenie standardu)) `calf.mis.partial`

### Dumbbell Seated One-Leg Calf Raise

**Ustawienie**

- Usiądź z ugiętym kolanem, przednią część stopy oprzyj na podwyższeniu, piętę poza krawędzią. — ISSA: [top six exercises for building bigger calves](https://www.issaonline.com/blog/post/top-six-exercises-for-building-bigger-calves) (Seated Calf Raises (uproszczenie: wariant sprzętu — maszyna; wariant: obunóż)); Kinoshita i in. (Ritsumeikan University): [Triceps surae muscle hypertrophy is greater after standing versus seated calf-raise training, Front Physiol 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10753835/) (Methods („seated/knee 90°-flexed position”, trening jednej nogi w siadzie); ryc. 1 (parafraza)) `calf.seatedEdge1`

**Ruch**

- Wspinaj się na palce jak najwyżej, potem opuść pięty, aż poczujesz rozciągnięcie łydek. — Kinoshita i in. (Ritsumeikan University): [Triceps surae muscle hypertrophy is greater after standing versus seated calf-raise training, Front Physiol 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10753835/) (ryc. 1 (parafraza)); ISSA: [25 minute calf workout](https://issaonline.com/blog/post/25-minute-calf-workout) (Seated Calf Raise („let your heels drop below the foot platform”)) `calf.move`

**Wskazówki**

- Zatrzymaj się chwilę na górze i opuszczaj powoli. — ISSA: [25 minute calf workout](https://issaonline.com/blog/post/25-minute-calf-workout) (Seated Calf Raise (squeeze at the top)); ACE: [Calf Raises (#51)](https://www.acefitness.org/resources/everyone/exercise-library/51/calf-raises/) (opis (wariant: stojąc)) `calf.pause`

**Czego unikać**

- Skrócony zakres — bez pełnego wspięcia i opuszczenia. — NASM: [Calf Training: How to Program This Stubborn Muscle Group (blog, H. Cherry, akt. 25.07.2026)](https://www.nasm.org/resource-center/blog/training/calf-training-how-to-program-this-stubborn-muscle-group-for-clients) (Technique Standards That Change Everything (wariant: stojąc)); ISSA: [25 minute calf workout](https://issaonline.com/blog/post/25-minute-calf-workout) (Seated Calf Raise (standard pełnego zakresu; błąd = zaprzeczenie standardu)) `calf.mis.partial`

### Cable Kickback

**Ustawienie**

- Ustaw wyciąg nisko, załóż mankiet na kostkę i stań przodem do maszyny, trzymając się jej. — ACE: [8 butt toning moves](https://www.acefitness.org/resources/pros/expert-articles/6355/8-butt-toning-moves/) (Single-leg cable extension (mankiet na kostce, niski wyciąg)); BarBend: [glute kickbacks](https://barbend.com/glute-kickbacks/) (How to Do the Glute Kickback, kroki 1–2 (lowest position; face the cable machine)) `ck.setup`

**Ruch**

- Odprowadź nogę w tył, napinając pośladek, i powoli wróć. — ACE: [8 butt toning moves](https://www.acefitness.org/resources/pros/expert-articles/6355/8-butt-toning-moves/) (Single-leg cable extension (Slowly raise the heel by initiating the movement from the glutes)); BarBend: [glute kickbacks](https://barbend.com/glute-kickbacks/) (How to Do the Glute Kickback (Squeeze your glute… as you drive your leg backward)) `ck.move`

**Wskazówki**

- Biodra i tułów nieruchomo — pracuje tylko noga. — BarBend: [glute kickbacks](https://barbend.com/glute-kickbacks/) (Common mistakes: Not Bracing Properly (only contract your glutes)); ACE: [8 butt toning moves](https://www.acefitness.org/resources/pros/expert-articles/6355/8-butt-toning-moves/) (Single-leg cable extension (keeping an erect torso)) `hab.hips`

**Czego unikać**

- Biodra i tułów się bujają, żeby noga poszła dalej w tył. — BarBend: [glute kickbacks](https://barbend.com/glute-kickbacks/) (Common mistakes: Not Bracing Properly (don't flare your upper back, or sway your hips)); ACE: [8 butt toning moves](https://www.acefitness.org/resources/pros/expert-articles/6355/8-butt-toning-moves/) (Single-leg cable extension (keeping an erect torso — błąd = zaprzeczenie standardu)) `ck.mis.sway`
- Plecy wyginają się w łuk, gdy noga idzie w górę. — BarBend: [glute kickbacks](https://barbend.com/glute-kickbacks/) (Common mistakes: Not Bracing Properly (Do not allow your lower back to arch)); HSS: [mini band exercises for runners](https://www.hss.edu/health-library/move-better/mini-band-exercises-for-runners) (Diagonal hip extension, krok („…without arching your low back.”) — uproszczenie: wariant sprzętu guma) `hext.mis.arch`

### Fire Hydrant

**Ustawienie**

- Klęk podparty: dłonie pod barkami, kolana pod biodrami, plecy neutralnie. — ACE: [7 new moves to challenge your glutes and hamstrings](https://www.acefitness.org/resources/pros/expert-articles/7409/7-new-moves-to-challenge-your-glutes-and-hamstrings/) (Fire Hydrant (Start in a quadruped position with the hands under the shoulders and knees under the hips)); ISSA: [hip abduction exercises for stronger hips and glutes](https://issaonline.com/blog/post/hip-abduction-exercises-for-stronger-hips-and-glutes) (Fire Hydrant (klęk podparty, dłonie w linii barków)) `bd.setup`

**Ruch**

- Nie prostując kolana, unieś nogę w bok i opuść ją z powrotem. — ACE: [7 new moves to challenge your glutes and hamstrings](https://www.acefitness.org/resources/pros/expert-articles/7409/7-new-moves-to-challenge-your-glutes-and-hamstrings/) (Fire Hydrant (slowly lifting the right leg out to the side… keeping the knee bent)); ISSA: [hip abduction exercises for stronger hips and glutes](https://issaonline.com/blog/post/hip-abduction-exercises-for-stronger-hips-and-glutes) (Fire Hydrant (raising your right knee away from the body keeping the leg flexed)) `fh.move`

**Wskazówki**

- Ruch tylko w biodrze — nie przechylaj się i nie skręcaj bioder, żeby unieść nogę wyżej. — ACE: [5 ab exercises no crunches no equipment](https://www.acefitness.org/resources/pros/expert-articles/6402/5-ab-exercises-no-crunches-no-equipment/) (Two-legged Fire Hydrant (keep your hips level) — wariant z uniesioną ręką); ISSA: [hip abduction exercises for stronger hips and glutes](https://issaonline.com/blog/post/hip-abduction-exercises-for-stronger-hips-and-glutes) (Fire Hydrant (without rotating or twisting the hips)) `fh.level`

**Czego unikać**

- Biodra skręcają się albo przechylają, żeby noga poszła wyżej. — ISSA: [hip abduction exercises for stronger hips and glutes](https://issaonline.com/blog/post/hip-abduction-exercises-for-stronger-hips-and-glutes) (Fire Hydrant (Raise the leg up as far as you can without rotating or twisting the hips — błąd = zaprzeczenie standardu)); ACE: [5 ab exercises no crunches no equipment](https://www.acefitness.org/resources/pros/expert-articles/6402/5-ab-exercises-no-crunches-no-equipment/) (Two-legged Fire Hydrant (keep your hips level — błąd = zaprzeczenie standardu; wariant)) `fh.mis.twist`

### Donkey Kick

**Ustawienie**

- Klęk podparty: dłonie pod barkami, kolana pod biodrami, plecy neutralnie. — ACE: [quadruped bent knee hip extensions](https://www.acefitness.org/resources/everyone/exercise-library/270/quadruped-bent-knee-hip-extensions/) (Step 1 (knees directly under your hips, hands directly under your shoulders)); ISSA: [donkey kicks benefits and variations for strong glutes](https://www.issaonline.com/blogs/strength/donkey-kicks-benefits-and-variations-for-strong-glutes) (How to Do a Donkey Kick Correctly (Start on all fours…)) `bd.setup`

**Ruch**

- Nie prostując kolana, unieś nogę w tył i w górę, podeszwą w stronę sufitu; potem powoli ją opuść. — ISSA: [donkey kicks benefits and variations for strong glutes](https://www.issaonline.com/blogs/strength/donkey-kicks-benefits-and-variations-for-strong-glutes) (How to Do a Donkey Kick Correctly (stopa w stronę sufitu; The movement should be slow.)); ACE: [quadruped bent knee hip extensions](https://www.acefitness.org/resources/everyone/exercise-library/270/quadruped-bent-knee-hip-extensions/) (Step 2 (while maintaining your bent-knee position)) `dk.move`

**Wskazówki**

- Napnij brzuch, żeby tułów był sztywny. — ACE: [quadruped bent knee hip extensions](https://www.acefitness.org/resources/everyone/exercise-library/270/quadruped-bent-knee-hip-extensions/) (Step 1/2 (Stiffen your core and abdominal muscles)); ISSA: [donkey kicks benefits and variations for strong glutes](https://www.issaonline.com/blogs/strength/donkey-kicks-benefits-and-variations-for-strong-glutes) (How to Do… (Engage and tighten your core)) `plank.brace`
- Unoś nogę tylko tak wysoko, żeby plecy się nie wyginały. — ACE: [quadruped bent knee hip extensions](https://www.acefitness.org/resources/everyone/exercise-library/270/quadruped-bent-knee-hip-extensions/) (uwaga po kroku 3 (Only raise the leg to a height where the low back position can be maintained)); ISSA: [donkey kicks benefits and variations for strong glutes](https://www.issaonline.com/blogs/strength/donkey-kicks-benefits-and-variations-for-strong-glutes) (How to Do… (Don't lift so high that your back starts to arch)) `hext.range`

**Czego unikać**

- Plecy wyginają się w łuk, gdy noga idzie w górę. — ISSA: [donkey kicks benefits and variations for strong glutes](https://www.issaonline.com/blogs/strength/donkey-kicks-benefits-and-variations-for-strong-glutes) (How to Do… (za wysoko unoszona noga wygina plecy)); ACE: [quadruped bent knee hip extensions](https://www.acefitness.org/resources/everyone/exercise-library/270/quadruped-bent-knee-hip-extensions/) (uwaga po kroku 3 (an increase in lumbar lordosis)) `hext.mis.arch`

### Clamshell

**Ustawienie**

- Połóż się na boku, kolana ugięte, nogi ułożone jedna na drugiej. — NASM: [the banded clamshell a simple move for stronger glutes](https://www.nasm.org/resource-center/blog/training/the-banded-clamshell-a-simple-move-for-stronger-glutes) (How to Perform a Banded Clamshell (lie on one side with the knees bent and stacked)); ACE: [8 hip strengthening exercises using the versa loop](https://www.acefitness.org/resources/pros/expert-articles/6315/8-hip-strengthening-exercises-using-the-versa-loop/) (Clam Shells (leżenie na boku, kolana ugięte, nogi jedna na drugiej)); Catalyst Athletics: [Clamshell](https://catalystathletics.com/exercise/766/Clamshell/) (opis (Lie on one side with the knees bent to approximately 90 degrees)) `clam.setup`

**Ruch**

- Trzymając stopy razem, unieś górne kolano jak najwyżej bez odchylania bioder i opuść je powoli. — NASM: [the banded clamshell a simple move for stronger glutes](https://www.nasm.org/resource-center/blog/training/the-banded-clamshell-a-simple-move-for-stronger-glutes) (How to Perform a Banded Clamshell (Keeping the feet together… lifts the top knee as high as possible; slow and controlled)); ACE: [8 hip strengthening exercises using the versa loop](https://www.acefitness.org/resources/pros/expert-articles/6315/8-hip-strengthening-exercises-using-the-versa-loop/) (Clam Shells (Keeping the inner arches of the feet together, externally rotate the top leg)); Catalyst Athletics: [Clamshell](https://catalystathletics.com/exercise/766/Clamshell/) (opis (lift the top knee as far as possible and return under control)) `clam.move`

**Wskazówki**

- Biodra nie uciekają do tyłu — zostań na boku. — NASM: [the banded clamshell a simple move for stronger glutes](https://www.nasm.org/resource-center/blog/training/the-banded-clamshell-a-simple-move-for-stronger-glutes) (How to Perform a Banded Clamshell (without allowing the hips to rotate backward)); Catalyst Athletics: [Clamshell](https://catalystathletics.com/exercise/766/Clamshell/) (opis (Without rolling the body)) `clam.noRoll`
- Ruch płynny w obie strony, bez szarpania. — NASM: [the banded clamshell a simple move for stronger glutes](https://www.nasm.org/resource-center/blog/training/the-banded-clamshell-a-simple-move-for-stronger-glutes) (How to Perform; Coaching (avoid using momentum)); Catalyst Athletics: [Clamshell](https://catalystathletics.com/exercise/766/Clamshell/) (opis (return under control)) `llc.control`

**Czego unikać**

- Biodra uciekają do tyłu, żeby kolano poszło wyżej. — NASM: [the banded clamshell a simple move for stronger glutes](https://www.nasm.org/resource-center/blog/training/the-banded-clamshell-a-simple-move-for-stronger-glutes) (How to Perform; FAQ (bez odchylania miednicy do tyłu — błąd = zaprzeczenie standardu)); Catalyst Athletics: [Clamshell](https://catalystathletics.com/exercise/766/Clamshell/) (opis (Without rolling the body — błąd = zaprzeczenie standardu)) `clam.mis.roll`

### Hip Extension with Bands

**Ustawienie**

- Załóż minigumę na kostki i przenieś ciężar ciała na jedną nogę. — HSS: [mini band exercises for runners](https://www.hss.edu/health-library/move-better/mini-band-exercises-for-runners) (Diagonal hip extension: Setup (mini band around both ankles); shift your weight onto one leg); BarBend: [resistance band exercises for glutes](https://barbend.com/resistance-band-exercises-for-glutes/) (5. Resistance Band Glute Kickback (band at your ankles; shift your weight onto one leg)) `hexb.setup`

**Ruch**

- Odprowadź nogę w tył, napinając pośladek, i powoli wróć. — HSS: [mini band exercises for runners](https://www.hss.edu/health-library/move-better/mini-band-exercises-for-runners) (Diagonal hip extension (Reach the other heel back… squeeze the glute… return slowly)); BarBend: [resistance band exercises for glutes](https://barbend.com/resistance-band-exercises-for-glutes/) (5. Resistance Band Glute Kickback (flex your glute to move it away from your body)); Thera-Band: [thera band wobble board hip extension with band](https://www.performancehealthacademy.com/exercises/thera-band-wobble-board-hip-extension-with-band.html) (Step Two (Extend your hip against the band and slowly return) — wariant: na desce balansowej) `ck.move`

**Wskazówki**

- Napnij brzuch, żeby tułów był sztywny. — HSS: [mini band exercises for runners](https://www.hss.edu/health-library/move-better/mini-band-exercises-for-runners) (Diagonal hip extension (core engaged)); BarBend: [resistance band exercises for glutes](https://barbend.com/resistance-band-exercises-for-glutes/) (5. Resistance Band Glute Kickback (a solid core brace)) `plank.brace`

**Czego unikać**

- Plecy wyginają się w łuk, gdy noga idzie w górę. — HSS: [mini band exercises for runners](https://www.hss.edu/health-library/move-better/mini-band-exercises-for-runners) (Diagonal hip extension, krok („…without arching your low back.”)); Thera-Band: [thera band wobble board hip extension with band](https://www.performancehealthacademy.com/exercises/thera-band-wobble-board-hip-extension-with-band.html) (Step Two (Keep your back and neck straight — błąd = zaprzeczenie standardu; wariant: na desce balansowej)) `hext.mis.arch`

### Lateral Band Walk

**Ustawienie**

- Załóż minigumę tuż nad kolana albo niżej, nad kostki; stopy na szerokość bioder. — NASM: [active recovery](https://www.nasm.org/resource-center/blog/active-recovery) (Lateral Band Walk — minigumę „just above your knees (or lower…)”, stopy na szerokość bioder); ACE: [how to self care for the it band](https://www.acefitness.org/resources/pros/expert-articles/5043/how-to-self-care-for-the-it-band/) (Lateral Band Walks — „Place a band of appropriate resistance around the shins, above the ankles.”); ACE: [8 hip strengthening exercises using the versa loop](https://www.acefitness.org/resources/pros/expert-articles/6315/8-hip-strengthening-exercises-using-the-versa-loop/) (Monster Walks (chód w bok) — „Place the Versa Loop just above the knee.”) `bw.setup`

**Ruch**

- Zrób krok w bok, potem powoli dociągnij drugą nogę. — NASM: [active recovery](https://www.nasm.org/resource-center/blog/active-recovery) (Lateral Band Walk — „sidestep in one direction with slow and controlled steps”); ACE: [8 hip strengthening exercises using the versa loop](https://www.acefitness.org/resources/pros/expert-articles/6315/8-hip-strengthening-exercises-using-the-versa-loop/) (Monster Walks — „Laterally walk to the right, with the right leg initiating the step.”) `bw.move`

**Wskazówki**

- Zejdź do lekkiego przysiadu i trzymaj go przez cały marsz. — NASM: [active recovery](https://www.nasm.org/resource-center/blog/active-recovery) (Lateral Band Walk — kolana ugięte, pozycja atletyczna („almost a squat”)); ACE: [8 hip strengthening exercises using the versa loop](https://www.acefitness.org/resources/pros/expert-articles/6315/8-hip-strengthening-exercises-using-the-versa-loop/) (Monster Walks — „keep a soft bend at the knees”) `bw.squat`
- Guma napięta przez cały czas — nie luzuj jej. — NASM: [active recovery](https://www.nasm.org/resource-center/blog/active-recovery) (Lateral Band Walk — stopy co najmniej na szerokość bioder, by utrzymać opór gumy); ACE: [8 hip strengthening exercises using the versa loop](https://www.acefitness.org/resources/pros/expert-articles/6315/8-hip-strengthening-exercises-using-the-versa-loop/) (Monster Walks — „Maintain resistance with the band”) `bw.tension`

**Czego unikać**

- Tułów buja się na boki przy każdym kroku. — NASM: [active recovery](https://www.nasm.org/resource-center/blog/active-recovery) (Lateral Band Walk — „Keep your core tight so that your upper body does not sway.”); ACE: [8 hip strengthening exercises using the versa loop](https://www.acefitness.org/resources/pros/expert-articles/6315/8-hip-strengthening-exercises-using-the-versa-loop/) (Monster Walks — „Begin in an upright, athletic stance…” (błąd = zaprzeczenie standardu)) `bw.mis.sway`

### Single Leg Glute Bridge

**Ustawienie**

- Połóż się na plecach, jedno kolano ugięte, stopa płasko na podłodze; drugą nogę wyprostuj albo przyciągnij do klatki. — ACE: [glute bridge single leg progression](https://www.acefitness.org/resources/everyone/exercise-library/145/glute-bridge-single-leg-progression/) (Step 1); Catalyst Athletics: [Single Leg Glute Bridge](https://www.catalystathletics.com/exercise/496/Single-Leg-Glute-Bridge/) (opis (one knee bent, other leg straight)) `gb.slSetup`

**Ruch**

- Dociskając stopę do podłogi, zwłaszcza piętę, unieś biodra; opuść je powoli. — ACE: [glute bridge single leg progression](https://www.acefitness.org/resources/everyone/exercise-library/145/glute-bridge-single-leg-progression/) (Step 2; Step 3); Catalyst Athletics: [Single Leg Glute Bridge](https://www.catalystathletics.com/exercise/496/Single-Leg-Glute-Bridge/) (opis (press through the whole foot, emphasizing the heel; lower under control)) `gb.slMove`

**Wskazówki**

- Ruch tylko w biodrach — na górze nie wyginaj lędźwi w łuk. — ACE: [glute bridge single leg progression](https://www.acefitness.org/resources/everyone/exercise-library/145/glute-bridge-single-leg-progression/) (Step 1 (brace abs); Step 2 (avoid pushing your hips too high … arching)); Catalyst Athletics: [Single Leg Glute Bridge](https://www.catalystathletics.com/exercise/496/Single-Leg-Glute-Bridge/) (opis (ensure the motion is at the hip)) `ht.rigid`

**Czego unikać**

- Przeprost w lędźwiach na górze zamiast wyprostu w biodrach. — ACE: [glute bridge single leg progression](https://www.acefitness.org/resources/everyone/exercise-library/145/glute-bridge-single-leg-progression/) (Step 2); Catalyst Athletics: [Single Leg Glute Bridge](https://www.catalystathletics.com/exercise/496/Single-Leg-Glute-Bridge/) (opis (not excessive lumbar extension)) `ht.mis.arch`

### Single Leg Hip Thrust

**Ustawienie**

- Oprzyj górną część pleców o ławkę, jedną stopę postaw płasko na podłodze, drugą nogę oderwij od podłogi. — Catalyst Athletics: [Single Leg Bench Supported Glute Bridge](https://www.catalystathletics.com/exercise/723/Single-Leg-Bench-Supported-Glute-Bridge/) (opis (upper back on a padded bench, one leg bent and foot flat on the floor, the other extended straight forward)); ISSA: [hip thrusts benefits and variations for stronger glutes](https://issaonline.com/blog/post/hip-thrusts-benefits-and-variations-for-stronger-glutes) (4. Single-Leg Hip Thrust (one foot lifted slightly off the ground) + Basic Hip Thrust Technique (back on a bench, feet flat)) `ht.slSetup`

**Ruch**

- Unieś biodra do pełnego wyprostu; opuść je kontrolowanie. — Catalyst Athletics: [Single Leg Bench Supported Glute Bridge](https://www.catalystathletics.com/exercise/723/Single-Leg-Bench-Supported-Glute-Bridge/) (opis (push through the floor… extend your hip maximally; return to the floor under control)); ISSA: [hip thrusts benefits and variations for stronger glutes](https://issaonline.com/blog/post/hip-thrusts-benefits-and-variations-for-stronger-glutes) (4. Single-Leg Hip Thrust (opposite glute controls the hip extension) + Basic Hip Thrust Technique (press hips up, pause, lower)) `ht.move`

**Wskazówki**

- Ruch tylko w biodrach — na górze nie wyginaj lędźwi w łuk. — Catalyst Athletics: [Single Leg Bench Supported Glute Bridge](https://www.catalystathletics.com/exercise/723/Single-Leg-Bench-Supported-Glute-Bridge/) (opis (ensure the motion is at the hip and not excessive lumbar extension)); NSCA: [Contreras, Cronin, Schoenfeld: Barbell Hip Thrust, Strength and Conditioning Journal 33(5):58–61, 2011 (kolumna Exercise Technique, NSCA) — kopia PDF u autora; strony czasopisma 403 dla narzędzia 08.11.2026](https://www.lookgreatnaked.com/articles/barbell_hip_thrust.pdf) (Exercise Technique, s. 59 (extension movement comes from the hips, not from the lumbopelvic region; uproszczenie: wersja obunóż — ISSA: poza jedną nogą jak w podstawowym)) `ht.rigid`

**Czego unikać**

- Przeprost w lędźwiach na górze zamiast wyprostu w biodrach. — Catalyst Athletics: [Single Leg Bench Supported Glute Bridge](https://www.catalystathletics.com/exercise/723/Single-Leg-Bench-Supported-Glute-Bridge/) (opis (not excessive lumbar extension)); NSCA: [Contreras, Cronin, Schoenfeld: Barbell Hip Thrust, Strength and Conditioning Journal 33(5):58–61, 2011 (kolumna Exercise Technique, NSCA) — kopia PDF u autora; strony czasopisma 403 dla narzędzia 08.11.2026](https://www.lookgreatnaked.com/articles/barbell_hip_thrust.pdf) (Exercise Technique, s. 59 (excessive lumbar hyperextension; uproszczenie: wersja obunóż)) `ht.mis.arch`

### Glute Bridge (sztanga)

**Ustawienie**

- Połóż się na plecach pod sztangą, tak żeby leżała na biodrach; kolana ugięte, stopy płasko na podłodze na szerokość bioder. — ACE: [Hip Bridge (#318)](https://www.acefitness.org/resources/everyone/exercise-library/318/hip-bridge/) (opis, zdania 1–2 (lie underneath the bar, top of the hips directly under the bar; feet flat on the ground hip-width apart)); ACE: [Understanding the Barbell Hip Thrust (ACE Certified, XI 2019)](https://www.acefitness.org/continuing-education/certified/november-2019/7403/understanding-the-barbell-hip-thrust/) (The Origins of the Hip Thrust (lying face-up on the floor… knees bent and feet flat; barbell across the top of the hips, usually on a pad) — ta sama organizacja co ace-318); NASM: [Floor Bridge](https://www.nasm.org/resource-center/exercise-library/floor-bridge) (Step 1: Setup (uproszczenie: wariant sprzętu Glute Bridge — bez sztangi)) `gb.bbSetup`

**Ruch**

- Unieś biodra, napinając pośladki, aż barki, biodra i kolana utworzą linię; opuść powoli. — ACE: [Hip Bridge (#318)](https://www.acefitness.org/resources/everyone/exercise-library/318/hip-bridge/) (opis, zdania 4–5 (press the feet into the floor and lift the hips; slowly lower the tailbone)); NASM: [Floor Bridge](https://www.nasm.org/resource-center/exercise-library/floor-bridge) (Step 3 (linia kolana–biodra–barki); Step 4 (uproszczenie: wariant sprzętu Glute Bridge)); ACE: [Glute Bridge (#49)](https://www.acefitness.org/resources/everyone/exercise-library/49/glute-bridge/) (Step 2; Step 3 (press your hips upwards… into extension; slowly lower; uproszczenie: wariant sprzętu Glute Bridge)) `gb.move`

**Wskazówki**

- Dociskaj stopy, zwłaszcza pięty, do podłogi. — ACE: [Glute Bridge (#49)](https://www.acefitness.org/resources/everyone/exercise-library/49/glute-bridge/) (Step 2 (press your heels into the floor; uproszczenie: wariant sprzętu Glute Bridge)); NASM: [Floor Bridge](https://www.nasm.org/resource-center/exercise-library/floor-bridge) (Step 3; FAQ (driving through your heels; uproszczenie: wariant sprzętu Glute Bridge)) `gb.heels`

**Czego unikać**

- Przeprost w lędźwiach na górze zamiast wyprostu w biodrach. — ACE: [Glute Bridge (#49)](https://www.acefitness.org/resources/everyone/exercise-library/49/glute-bridge/) (wskazówka końcowa (uproszczenie: wariant sprzętu Glute Bridge)); NASM: [Floor Bridge](https://www.nasm.org/resource-center/exercise-library/floor-bridge) (Common Mistakes; FAQ (uproszczenie: wariant sprzętu Glute Bridge)) `ht.mis.arch`

### Seated Band Hamstring Curl

**Ustawienie**

- Usiądź przodem do zaczepu gumy, załóż pętlę na kostkę; noga wyprostowana przed sobą. — WebMD Ignite: [3,S,90814](https://healthlibrary.vanderbilthealth.com/library/HealthSheets/3,S,90814) (kroki 1–3 („Sit in a chair facing the closed door. Slip the loop of the elastic exercise band around the heel of your leg.”)); NASM: [Single-Leg Seated Leg Curl](https://www.nasm.org/resource-center/exercise-library/single-leg-seated-leg-curl) (uproszczenie: wariant sprzętu Seated Leg Curl (maszyna); Step 1–2 (siad, opór z przodu tuż nad kostką; parafraza)) `bandcurl.setup`

**Ruch**

- Zegnij kolano, ciągnąc piętą gumę w tył; potem powoli wyprostuj nogę. — WebMD Ignite: [3,S,90814](https://healthlibrary.vanderbilthealth.com/library/HealthSheets/3,S,90814) (kroki („Slowly pull the elastic band backward along the floor with your heel”; „Slowly return your leg to the starting position.”)); NASM: [Single-Leg Seated Leg Curl](https://www.nasm.org/resource-center/exercise-library/single-leg-seated-leg-curl) (uproszczenie: wariant sprzętu; Step 3–4 (pięta w stronę pośladka, powrót z kontrolą; parafraza)) `bandcurl.move`

**Wskazówki**

- Zginaj kolano tak daleko, jak dasz radę. — WebMD Ignite: [3,S,90814](https://healthlibrary.vanderbilthealth.com/library/HealthSheets/3,S,90814) (kroki („Stop when you can't pull it any farther.”)); NASM: [Single-Leg Seated Leg Curl](https://www.nasm.org/resource-center/exercise-library/single-leg-seated-leg-curl) (uproszczenie: wariant sprzętu; Common Mistakes („Not achieving full range of motion…”)) `lcurl.full`

**Czego unikać**

- Zginanie kolana tylko do połowy zamiast tak daleko, jak się da. — NASM: [Single-Leg Seated Leg Curl](https://www.nasm.org/resource-center/exercise-library/single-leg-seated-leg-curl) (uproszczenie: wariant sprzętu; Common Mistakes („Not achieving full range of motion…”)); WebMD Ignite: [3,S,90814](https://healthlibrary.vanderbilthealth.com/library/HealthSheets/3,S,90814) (kroki (ciągnij, aż nie da się dalej) — błąd = zaprzeczenie standardu) `lcurl.mis.partial`

### Single Leg Press

**Ustawienie**

- Usiądź na maszynie, plecy na oparciu; jedną stopę postaw na platformie, drugą zdejmij z platformy i trzymaj nieruchomo. — NASM: [single leg press](https://www.nasm.org/resource-center/exercise-library/single-leg-press) (Setup (back and head against the backrest; one foot on the platform)); ACE: [Seated Leg Press (#154)](https://www.acefitness.org/resources/everyone/exercise-library/154/seated-leg-press/) (Step 1 (uproszczenie: analogia Leg Press — back flat against the backrest)) `slp.setup`

**Ruch**

- Wypchnij platformę, prostując biodra i kolana; opuść ją powoli, uginając nogi. — NASM: [single leg press](https://www.nasm.org/resource-center/exercise-library/single-leg-press) (Movement (press the platform by extending the leg; lower under control)); ACE: [Seated Leg Press (#154)](https://www.acefitness.org/resources/everyone/exercise-library/154/seated-leg-press/) (Step 2; Step 4 (uproszczenie: analogia Leg Press)) `lp.move`

**Czego unikać**

- Blokowanie kolana w przeproście na górze. — NASM: [single leg press](https://www.nasm.org/resource-center/exercise-library/single-leg-press) (Movement; Common Mistakes (locking the knee at full extension)); ACE: [Seated Leg Press (#154)](https://www.acefitness.org/resources/everyone/exercise-library/154/seated-leg-press/) (Step 3 (uproszczenie: analogia Leg Press — do not hyperextend/lock-out)) `lp.mis.lock`

### Bent Over Row (linki)

**Ustawienie**

- Pochyl tułów w biodrach przy lekko ugiętych kolanach; plecy proste. — ACE: [Bent Over Row (#12)](https://www.acefitness.org/resources/everyone/exercise-library/12/bent-over-row/) (opis (sztanga — ten sam wzorzec; uproszczenie: wariant sprzętu)); ExRx.net: [BBBentOverRow](https://web.archive.org/web/20230227195843/https://exrx.net/WeightExercises/BackGeneral/BBBentOverRow) (Preparation (sztanga — ten sam wzorzec; uproszczenie: wariant sprzętu)) [uproszczenie: wariant sprzętu: źródła opisują sztangę; ten sam zawias biodrowy i przyciąganie do brzucha, linka z dolnego bloczka zmienia tylko kierunek oporu] `row.hinge`

**Ruch**

- Przyciągnij uchwyty do brzucha, potem wróć do pełnego wyprostu rąk. — ACE: [Bent Over Row (#12)](https://www.acefitness.org/resources/everyone/exercise-library/12/bent-over-row/) (opis (towards the belly button; until the elbows are completely straight — sztanga, uproszczenie: wariant sprzętu)); ExRx.net: [BBBentOverRow](https://web.archive.org/web/20230227195843/https://exrx.net/WeightExercises/BackGeneral/BBBentOverRow) (Execution (to upper waist; arms extended — sztanga, uproszczenie: wariant sprzętu)) [uproszczenie: wariant sprzętu: źródła opisują sztangę; ten sam zawias biodrowy i przyciąganie do brzucha, linka z dolnego bloczka zmienia tylko kierunek oporu] `row.cbPull`

**Wskazówki**

- Plecy proste (neutralne) przez cały ruch — bez zaokrąglania. — ACE: [Bent Over Row (#12)](https://www.acefitness.org/resources/everyone/exercise-library/12/bent-over-row/) (opis (back straight/flat — sztanga, uproszczenie)); ExRx.net: [BBBentOverRow](https://web.archive.org/web/20230227195843/https://exrx.net/WeightExercises/BackGeneral/BBBentOverRow) (Comments (low back straight — sztanga, uproszczenie)) [uproszczenie: wariant sprzętu: źródła opisują sztangę; ten sam zawias biodrowy i przyciąganie do brzucha, linka z dolnego bloczka zmienia tylko kierunek oporu] `hinge.back`

**Czego unikać**

- Zaokrąglanie pleców, żeby dociągnąć ciężar. — ExRx.net: [BBBentOverRow](https://web.archive.org/web/20230227195843/https://exrx.net/WeightExercises/BackGeneral/BBBentOverRow) (Comments (low back rounded due to poor form — sztanga, uproszczenie)); ACE: [Bent Over Row (#12)](https://www.acefitness.org/resources/everyone/exercise-library/12/bent-over-row/) (opis (keep the back flat — sztanga, uproszczenie)) [uproszczenie: wariant sprzętu: źródła opisują sztangę; ten sam zawias biodrowy i przyciąganie do brzucha, linka z dolnego bloczka zmienia tylko kierunek oporu] `mis.roundBack`

### Meadows Row

**Ustawienie**

- Stań bokiem do gryfu w lekkim wykroku, pochyl tułów w biodrach i chwyć końcówkę gryfu nachwytem; drugie przedramię oprzyj o udo wysuniętej nogi. — BarBend: [The Best Unilateral Exercises… (S. McLean, CPT; akt. 04.06.2025) — Meadows Row](https://barbend.com/best-unilateral-exercises/) (Meadows Row (staggered stance; hinge; overhand grip on the end of the barbell; forearm on forward leg)); Generation Iron: [Meadows Row Exercise Guide (T. Ramos, ACSM-CPT, ISSA CSCS; akt. 24.01.2025)](https://generationiron.com/meadows-row-exercise-guide/) (Steps 1–3 (staggered stance; hinge; overhand grip on the end; forearm on forward leg)) `meadows.setup2`

**Ruch**

- Przyciągnij gryf do biodra, prowadząc łokieć w tył; opuść powoli do wyprostu ręki. — BarBend: [The Best Unilateral Exercises… (S. McLean, CPT; akt. 04.06.2025) — Meadows Row](https://barbend.com/best-unilateral-exercises/) (Meadows Row (drive your elbow behind your body; pull toward your back hip; slowly lower)); Generation Iron: [Meadows Row Exercise Guide (T. Ramos, ACSM-CPT, ISSA CSCS; akt. 24.01.2025)](https://generationiron.com/meadows-row-exercise-guide/) (Steps 5–7 (pull to your back hip; slowly lower until your elbow is straight)) `meadows.pull`

### Standing Cable Row

**Ustawienie**

- Ustaw wyciąg mniej więcej na wysokości klatki, chwyć uchwyt oburącz i stań przodem do wyciągu, kolana lekko ugięte. — ACE: [standing row](https://www.acefitness.org/resources/everyone/exercise-library/335/standing-row/) (Starting position (cable pulley at about chest-height; two handles, one in each hand; feet hip-width, knees slightly bent)); Fitness Volt: [cable standing row](https://fitnessvolt.com/cable-standing-row/) (How to (V bar about lower chest height; grip with both hands, step back; feet hip-width, knees slightly bent)) `scrow.setup`

**Ruch**

- Przyciągnij uchwyt do tułowia, potem powoli wróć. — ACE: [standing row](https://www.acefitness.org/resources/everyone/exercise-library/335/standing-row/) (Pulling; Return (pull back until the hands reach the front of the stomach; slowly straighten the elbows)); Fitness Volt: [cable standing row](https://fitnessvolt.com/cable-standing-row/) (How to (drive your elbows behind your body, pull just below your chest; slowly extend your arms forward)) `scrow.pull`

**Czego unikać**

- Odchylanie albo pochylanie tułowia, żeby dociągnąć ciężar. — Fitness Volt: [cable standing row](https://fitnessvolt.com/cable-standing-row/) (How to / tips (avoid leaning too far back or forward)); ACE: [standing row](https://www.acefitness.org/resources/everyone/exercise-library/335/standing-row/) (Starting position (standard: hips straight, back tall) — błąd = zaprzeczenie standardu) `scrow.mis.lean`

### Machine Row

**Ustawienie**

- Dopasuj wysokość siedziska do uchwytów, usiądź prosto i chwyć je. — NASM: [Seated Machine Row Close Grip](https://www.nasm.org/resource-center/exercise-library/seated-machine-row-close-grip) (Step 1–2 (adjust seat to the handles, feet on the platform, grip the handles)); Healthline: [seated row](https://www.healthline.com/health/seated-row) (How to do a seated row, setup (adjust seat and chest pad so shoulders are level with the handles; sit upright; hold the handle)) `mrow.setup`

**Ruch**

- Przyciągnij uchwyty do tułowia, łokcie w tył; wróć do pozycji wyjściowej. — NASM: [Seated Machine Row Close Grip](https://www.nasm.org/resource-center/exercise-library/seated-machine-row-close-grip) (Step 3–4 (pull toward your torso driving the elbows back; lower)); Healthline: [seated row](https://www.healthline.com/health/seated-row) (How to do a seated row, pull and return (bend the elbows keeping them tucked; slowly extend the arms)) `mrow.pull`

**Czego unikać**

- Szarpanie i rzucanie ciężarem zamiast kontrolowanego ruchu. — NASM: [Seated Machine Row Close Grip](https://www.nasm.org/resource-center/exercise-library/seated-machine-row-close-grip) (Common mistakes (jerking the weight)); Healthline: [seated row](https://www.healthline.com/health/seated-row) (Common mistakes: swinging torso; rapid movements (wariant: seated row machine / cable)) `mis.jerk`

### Single Arm Lat Pulldown

**Ustawienie**

- Usiądź i ustaw wałki tak, żeby mocno przytrzymywały uda. — ACE: [Seated Lat Pulldown (#158)](https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/) (Step 1 (wałek na udach)); ExRx.net: [CBFrontPulldown](https://web.archive.org/web/20221216151339/https://exrx.net/WeightExercises/LatissimusDorsi/CBFrontPulldown) (Preparation) [uproszczenie: karta Lat Pulldown (oburącz → jednorącz); siedzisko z wałkami jak na figurze] `lpd.thighsOnly`
- Chwyć uchwyt jedną ręką, wyprostowaną nad głową. — Catalyst Athletics: [Single-Arm Pulldown (#895)](https://catalystathletics.com/exercise/895/Single-Arm-Pulldown/) (opis zd. 1 („Hold a cable attachment overhead with a single hand.”)); ACE: [Seated Lat Pulldown (#158)](https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/) (Step 1 (chwyt nad głową, ręce wyprostowane)) [uproszczenie: ACE 158: drążek oburącz → uchwyt jednorącz] `lpd1.setup`

**Ruch**

- Ściągnij uchwyt w dół do barku; wróć powoli do wyprostu ręki. — Catalyst Athletics: [Single-Arm Pulldown (#895)](https://catalystathletics.com/exercise/895/Single-Arm-Pulldown/) (opis zd. 2–3 („pull the handle to the shoulder… return to the extended position under control”)); ACE: [Seated Lat Pulldown (#158)](https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/) (Step 2–4) [uproszczenie: ACE 158: drążek do klatki → uchwyt do barku (ten sam ruch jedną ręką)] `lpd1.pull`

**Wskazówki**

- Zacznij ruch od ściągnięcia łopatki w dół i do tyłu. — Catalyst Athletics: [Single-Arm Pulldown (#895)](https://catalystathletics.com/exercise/895/Single-Arm-Pulldown/) (opis (łopatka w dół i do tyłu)); ACE: [Seated Lat Pulldown (#158)](https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/) (Step 2 („initiate the downward pull by first depressing… your scapulae”)) [uproszczenie: ACE 158: oburącz] `lpd1.blade`

**Czego unikać**

- Bujanie i odchylanie się do tyłu, żeby ściągnąć ciężar. — NASM: [the biomechanics of the lat pulldown muscles grip and form](https://www.nasm.org/resource-center/blog/training/the-biomechanics-of-the-lat-pulldown-muscles-grip-and-form) (Common Compensations (wariant: jednorącz)); ACE: [Seated Lat Pulldown (#158)](https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/) (Step 2 — standard); Catalyst Athletics: [Single-Arm Pulldown (#895)](https://catalystathletics.com/exercise/895/Single-Arm-Pulldown/) (opis (tułów usztywniony) — standard) `lpd.mis.lean`
- Barki uciekają w górę, do uszu. — NASM: [the biomechanics of the lat pulldown muscles grip and form](https://www.nasm.org/resource-center/blog/training/the-biomechanics-of-the-lat-pulldown-muscles-grip-and-form) (Common Compensations (wariant: jednorącz)); Catalyst Athletics: [Single-Arm Pulldown (#895)](https://catalystathletics.com/exercise/895/Single-Arm-Pulldown/) (opis (łopatka w dół) — standard) `lpd.mis.shrug`

### Close-Grip Front Lat Pulldown

**Ustawienie**

- Usiądź i ustaw wałki tak, żeby mocno przytrzymywały uda; chwyć drążek. — ACE: [Seated Lat Pulldown (#158)](https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/) (Step 1 (wariant: chwyt nieokreślony)); ExRx.net: [CBFrontPulldown](https://web.archive.org/web/20221216151339/https://exrx.net/WeightExercises/LatissimusDorsi/CBFrontPulldown) (Preparation (wariant: chwyt szeroki)) [uproszczenie: wariant chwytu Lat Pulldown: wąski chwyt; ten sam ruch] `lpd.thighs`

**Ruch**

- Ściągnij drążek w dół przed twarzą do górnej części klatki. — ACE: [Seated Lat Pulldown (#158)](https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/) (Step 2 (wariant: chwyt nieokreślony)); Catalyst Athletics: [Neutral Grip Lat Pulldown](https://www.catalystathletics.com/exercise/861/Neutral-Grip-Lat-Pulldown/) (opis („most commonly this will be a narrow grip”; „pull the handles to the upper chest”)) [uproszczenie: wariant chwytu Lat Pulldown: wąski chwyt; ten sam ruch] `lpd.pull`

**Wskazówki**

- Na górze wyprostuj ręce do końca. — ACE: [Seated Lat Pulldown (#158)](https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/) (Step 4 (wariant: chwyt nieokreślony)); Catalyst Athletics: [Neutral Grip Lat Pulldown](https://www.catalystathletics.com/exercise/861/Neutral-Grip-Lat-Pulldown/) (opis („return to the extended position under control”)) [uproszczenie: wariant chwytu Lat Pulldown: wąski chwyt; ten sam ruch] `lpd.fullStretch`
- Ściągaj do górnej części klatki — nie dalej. — ACE: [Seated Lat Pulldown (#158)](https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/) (Step 3 (wariant: chwyt nieokreślony)); Catalyst Athletics: [Neutral Grip Lat Pulldown](https://www.catalystathletics.com/exercise/861/Neutral-Grip-Lat-Pulldown/) (opis („pull the handles to the upper chest”)) [uproszczenie: wariant chwytu Lat Pulldown: wąski chwyt; ten sam ruch] `lpd.toChest`
- Tułów stabilny — bez bujania. — ACE: [Seated Lat Pulldown (#158)](https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/) (Step 2 (nie odchylaj się dalej w trakcie ściągania; wariant: chwyt nieokreślony)); Catalyst Athletics: [Neutral Grip Lat Pulldown](https://www.catalystathletics.com/exercise/861/Neutral-Grip-Lat-Pulldown/) (opis („Keeping the trunk braced”)) [uproszczenie: wariant chwytu Lat Pulldown: wąski chwyt; ten sam ruch] `lpd.still`

**Czego unikać**

- Bujanie i odchylanie się do tyłu, żeby ściągnąć ciężar. — NASM: [the biomechanics of the lat pulldown muscles grip and form](https://www.nasm.org/resource-center/blog/training/the-biomechanics-of-the-lat-pulldown-muscles-grip-and-form) (Common Compensations (wariant: chwyt)); ACE: [Seated Lat Pulldown (#158)](https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/) (Step 2 — standard (wariant: chwyt nieokreślony)) [uproszczenie: wariant chwytu Lat Pulldown: wąski chwyt; ten sam ruch] `lpd.mis.lean`
- Barki uciekają w górę, do uszu. — NASM: [the biomechanics of the lat pulldown muscles grip and form](https://www.nasm.org/resource-center/blog/training/the-biomechanics-of-the-lat-pulldown-muscles-grip-and-form) (Common Compensations (wariant: chwyt)); ACE: [Seated Lat Pulldown (#158)](https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/) (Step 2 — standard (wariant: chwyt nieokreślony)) [uproszczenie: wariant chwytu Lat Pulldown: wąski chwyt; ten sam ruch] `lpd.mis.shrug`

### Underhand Lat Pulldown

**Ustawienie**

- Usiądź i ustaw wałki tak, żeby mocno przytrzymywały uda; chwyć drążek. — ACE: [Seated Lat Pulldown (#158)](https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/) (Step 1 (wariant: chwyt nieokreślony)); ExRx.net: [CBFrontPulldown](https://web.archive.org/web/20221216151339/https://exrx.net/WeightExercises/LatissimusDorsi/CBFrontPulldown) (Preparation (wariant: chwyt szeroki)) [uproszczenie: wariant chwytu Lat Pulldown: podchwyt; ten sam ruch] `lpd.thighs`

**Ruch**

- Ściągnij drążek w dół przed twarzą do górnej części klatki. — ACE: [Seated Lat Pulldown (#158)](https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/) (Step 2 (wariant: chwyt nieokreślony)); Catalyst Athletics: [Reverse Grip Lat Pulldown](https://www.catalystathletics.com/exercise/876/Reverse-Grip-Lat-Pulldown/) (opis (do górnej części klatki)) [uproszczenie: wariant chwytu Lat Pulldown: podchwyt; ten sam ruch] `lpd.pull`

**Wskazówki**

- Ściągaj do górnej części klatki — nie dalej. — ACE: [Seated Lat Pulldown (#158)](https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/) (Step 3 (wariant: chwyt nieokreślony)); Catalyst Athletics: [Reverse Grip Lat Pulldown](https://www.catalystathletics.com/exercise/876/Reverse-Grip-Lat-Pulldown/) (opis (drążek przy obojczykach)) [uproszczenie: wariant chwytu Lat Pulldown: podchwyt; ten sam ruch] `lpd.toChest`
- Na górze wyprostuj ręce do końca. — ACE: [Seated Lat Pulldown (#158)](https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/) (Step 4 (wariant: chwyt nieokreślony)); Catalyst Athletics: [Reverse Grip Lat Pulldown](https://www.catalystathletics.com/exercise/876/Reverse-Grip-Lat-Pulldown/) (opis (powrót do pełnego wyprostu rąk nad głową)) [uproszczenie: wariant chwytu Lat Pulldown: podchwyt; ten sam ruch] `lpd.fullStretch`

**Czego unikać**

- Bujanie i odchylanie się do tyłu, żeby ściągnąć ciężar. — NASM: [the biomechanics of the lat pulldown muscles grip and form](https://www.nasm.org/resource-center/blog/training/the-biomechanics-of-the-lat-pulldown-muscles-grip-and-form) (Common Compensations (wariant: chwyt)); ACE: [Seated Lat Pulldown (#158)](https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/) (Step 2 — standard (wariant: chwyt nieokreślony)) [uproszczenie: wariant chwytu Lat Pulldown: podchwyt; ten sam ruch] `lpd.mis.lean`
- Barki uciekają w górę, do uszu. — NASM: [the biomechanics of the lat pulldown muscles grip and form](https://www.nasm.org/resource-center/blog/training/the-biomechanics-of-the-lat-pulldown-muscles-grip-and-form) (Common Compensations (wariant: chwyt)); ACE: [Seated Lat Pulldown (#158)](https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/) (Step 2 — standard (wariant: chwyt nieokreślony)) [uproszczenie: wariant chwytu Lat Pulldown: podchwyt; ten sam ruch] `lpd.mis.shrug`

### V-Bar Pulldown

**Ustawienie**

- Usiądź, ustaw wałki tak, żeby mocno przytrzymywały uda, i chwyć uchwyt V, dłonie zwrócone do siebie. — ACE: [Seated Lat Pulldown (#158)](https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/) (Step 1 (thigh pad to fit firmly; uproszczenie: wariant sprzętu Lat Pulldown)); Catalyst Athletics: [Neutral Grip Lat Pulldown](https://www.catalystathletics.com/exercise/861/Neutral-Grip-Lat-Pulldown/) (opis (Hold a neutral-grip cable attachment overhead)) [uproszczenie: wariant sprzętu Lat Pulldown: uchwyt V zamiast drążka; ten sam ruch] `lpd.vbarSetup`

**Ruch**

- Ściągnij uchwyt do górnej części klatki, łopatki w dół i do tyłu; wróć powoli do wyprostu rąk. — Catalyst Athletics: [Neutral Grip Lat Pulldown](https://www.catalystathletics.com/exercise/861/Neutral-Grip-Lat-Pulldown/) (opis (pull the handles to the upper chest, pulling the shoulder blades down and back; return to the extended position under control)); ACE: [Seated Lat Pulldown (#158)](https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/) (Step 2–4 (depress scapulae; bar nears the chest; slowly return; uproszczenie: wariant sprzętu Lat Pulldown)) [uproszczenie: wariant sprzętu Lat Pulldown: uchwyt V zamiast drążka; ten sam ruch] `lpd.vbarPull`

**Wskazówki**

- Na górze wyprostuj ręce do końca. — ACE: [Seated Lat Pulldown (#158)](https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/) (Step 4 (until your elbows are fully extended; wariant sprzętu)); Catalyst Athletics: [Neutral Grip Lat Pulldown](https://www.catalystathletics.com/exercise/861/Neutral-Grip-Lat-Pulldown/) (opis (return to the extended position)) [uproszczenie: wariant sprzętu Lat Pulldown: uchwyt V zamiast drążka; ten sam ruch] `lpd.fullStretch`

**Czego unikać**

- Bujanie i odchylanie się do tyłu, żeby ściągnąć ciężar. — NASM: [the biomechanics of the lat pulldown muscles grip and form](https://www.nasm.org/resource-center/blog/training/the-biomechanics-of-the-lat-pulldown-muscles-grip-and-form) (Common Compensations (wariant: uchwyt)); ACE: [Seated Lat Pulldown (#158)](https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/) (Step 2 — standard); Catalyst Athletics: [Neutral Grip Lat Pulldown](https://www.catalystathletics.com/exercise/861/Neutral-Grip-Lat-Pulldown/) (opis (Keeping the trunk braced) — standard) [uproszczenie: wariant sprzętu Lat Pulldown: uchwyt V zamiast drążka; ten sam ruch] `lpd.mis.lean`
- Barki uciekają w górę, do uszu. — NASM: [the biomechanics of the lat pulldown muscles grip and form](https://www.nasm.org/resource-center/blog/training/the-biomechanics-of-the-lat-pulldown-muscles-grip-and-form) (Common Compensations (wariant: uchwyt)); Catalyst Athletics: [Neutral Grip Lat Pulldown](https://www.catalystathletics.com/exercise/861/Neutral-Grip-Lat-Pulldown/) (opis (shoulder blades down and back) — standard) [uproszczenie: wariant sprzętu Lat Pulldown: uchwyt V zamiast drążka; ten sam ruch] `lpd.mis.shrug`

### Shrugs (linki)

**Ustawienie**

- Stań prosto z ciężarem w opuszczonych, prostych rękach. — ACE: [Shrug (#72)](https://www.acefitness.org/resources/everyone/exercise-library/72/shrug/) (opis (uproszczenie: wariant sprzętu sztanga)); ExRx.net: [DBShrug](https://web.archive.org/web/20240105211625/https://exrx.net/WeightExercises/TrapeziusUpper/DBShrug) (Preparation (uproszczenie: wariant sprzętu hantle)) [uproszczenie: wariant sprzętu: źródła opisują sztangę i hantle; ciężar w opuszczonych, prostych rękach, ruch barków ten sam, linka zmienia tylko źródło oporu] `shrug.setup`

**Ruch**

- Unieś barki w górę, potem powoli je opuść. — ACE: [Shrug (#72)](https://www.acefitness.org/resources/everyone/exercise-library/72/shrug/) (opis (uproszczenie: wariant sprzętu sztanga)); ExRx.net: [BBShrug](https://web.archive.org/web/20230306153926/https://exrx.net/WeightExercises/TrapeziusUpper/BBShrug) (Execution (uproszczenie: wariant sprzętu sztanga)) [uproszczenie: wariant sprzętu: źródła opisują sztangę i hantle; ciężar w opuszczonych, prostych rękach, ruch barków ten sam, linka zmienia tylko źródło oporu] `shrug.move`

**Wskazówki**

- Unoś barki tak wysoko, jak się da. — ACE: [Shrug (#72)](https://www.acefitness.org/resources/everyone/exercise-library/72/shrug/) (opis (as high as possible; wariant: sztanga)); ExRx.net: [BBShrug](https://web.archive.org/web/20230306153926/https://exrx.net/WeightExercises/TrapeziusUpper/BBShrug) (Execution (wariant: sztanga)) [uproszczenie: wariant sprzętu: źródła opisują sztangę i hantle; ciężar w opuszczonych, prostych rękach, ruch barków ten sam, linka zmienia tylko źródło oporu] `shrug.high`
- Tułów prosto i nieruchomo — pracują tylko barki. — ACE: [Shrug (#72)](https://www.acefitness.org/resources/everyone/exercise-library/72/shrug/) (opis (back tall; only the shoulders; wariant: sztanga)); ExRx.net: [DBShrug](https://web.archive.org/web/20240105211625/https://exrx.net/WeightExercises/TrapeziusUpper/DBShrug) (Comments (wariant: hantle)) [uproszczenie: wariant sprzętu: źródła opisują sztangę i hantle; ciężar w opuszczonych, prostych rękach, ruch barków ten sam, linka zmienia tylko źródło oporu] `shrug.tall`

**Czego unikać**

- Krążenie barkami zamiast ruchu prosto w górę i w dół. — ACE: [Shrug (#72)](https://www.acefitness.org/resources/everyone/exercise-library/72/shrug/) (Tip (wariant: sztanga)); Fitness Volt: [barbell shrugs guide](https://fitnessvolt.com/barbell-shrugs-guide/) (How to (wariant: sztanga)) [uproszczenie: wariant sprzętu: źródła opisują sztangę i hantle; ciężar w opuszczonych, prostych rękach, ruch barków ten sam, linka zmienia tylko źródło oporu] `shrug.mis.roll`
- Uginanie łokci — ciężar ciągną ręce zamiast barków. — ACE: [Standing Shrug (#75)](https://www.acefitness.org/resources/everyone/exercise-library/75/standing-shrug/) (Step 2 (wariant: hantle)); BarBend: [dumbbell shrug](https://barbend.com/dumbbell-shrug/) (Common Mistakes — Bending Your Elbows (wariant: hantle)) [uproszczenie: wariant sprzętu: źródła opisują sztangę i hantle; ciężar w opuszczonych, prostych rękach, ruch barków ten sam, linka zmienia tylko źródło oporu] `shrug.mis.elbows`

### Barbell Shrug Behind The Back

**Ustawienie**

- Stań prosto, sztangę trzymaj nachwytem za udami, ręce proste. — BarBend: [dumbbell shrug](https://barbend.com/dumbbell-shrug/) (Variations — Behind-the-Back Barbell Shrug (facing away; bar against the backs of the legs; close, overhand grip; stand upright)); Fitness Volt: [front barbell shrugs vs behind the back shrugs](https://fitnessvolt.com/13180/front-barbell-shrugs-vs-behind-the-back-shrugs/) (behind-the-back shrug — instrukcja (overhand grip, barbell behind your thighs; arms straight)) `shrug.setupBehind`

**Ruch**

- Unieś barki w górę, potem powoli je opuść. — Fitness Volt: [front barbell shrugs vs behind the back shrugs](https://fitnessvolt.com/13180/front-barbell-shrugs-vs-behind-the-back-shrugs/) (behind-the-back shrug — instrukcja (barki w stronę uszu, przytrzymanie, opuszczenie)); ACE: [Shrug (#72)](https://www.acefitness.org/resources/everyone/exercise-library/72/shrug/) (opis (lowering slowly; wariant: sztanga z przodu)) [uproszczenie: wersja z przodu (sztanga, hantle) jako źródło ruchu barków; ten sam ruch, zmienia się tylko położenie gryfu] `shrug.move`

**Wskazówki**

- Unoś barki tak wysoko, jak się da. — ACE: [Shrug (#72)](https://www.acefitness.org/resources/everyone/exercise-library/72/shrug/) (opis (wariant: sztanga z przodu)); Fitness Volt: [barbell shrugs guide](https://fitnessvolt.com/barbell-shrugs-guide/) (How to (shrug as high as you possibly can; wariant: sztanga z przodu)) [uproszczenie: wersja z przodu (sztanga, hantle) jako źródło ruchu barków; ten sam ruch, zmienia się tylko położenie gryfu] `shrug.high`

**Czego unikać**

- Krążenie barkami zamiast ruchu prosto w górę i w dół. — ACE: [Shrug (#72)](https://www.acefitness.org/resources/everyone/exercise-library/72/shrug/) (Tip (wariant: sztanga z przodu)); Fitness Volt: [barbell shrugs guide](https://fitnessvolt.com/barbell-shrugs-guide/) (How to (wariant: sztanga z przodu)) [uproszczenie: wersja z przodu (sztanga, hantle) jako źródło ruchu barków; ten sam ruch, zmienia się tylko położenie gryfu] `shrug.mis.roll`

### Leverage Shrug

**Ustawienie**

- Stań prosto z ciężarem w opuszczonych, prostych rękach. — ACE: [Standing Shrug (#75)](https://www.acefitness.org/resources/everyone/exercise-library/75/standing-shrug/) (Step 1 (uproszczenie: wariant sprzętu hantle — uchwyty przy bokach, łokcie wyprostowane)); ExRx.net: [DBShrug](https://web.archive.org/web/20240105211625/https://exrx.net/WeightExercises/TrapeziusUpper/DBShrug) (Preparation (uproszczenie: wariant sprzętu hantle)) [uproszczenie: wariant sprzętu: źródła opisują sztangę i hantle; uchwyty maszyny przy bokach jak hantle, ruch barków ten sam] `shrug.setup`

**Ruch**

- Unieś barki w górę, potem powoli je opuść. — ACE: [Shrug (#72)](https://www.acefitness.org/resources/everyone/exercise-library/72/shrug/) (opis (uproszczenie: wariant sprzętu sztanga)); ExRx.net: [BBShrug](https://web.archive.org/web/20230306153926/https://exrx.net/WeightExercises/TrapeziusUpper/BBShrug) (Execution (uproszczenie: wariant sprzętu sztanga)) [uproszczenie: wariant sprzętu: źródła opisują sztangę i hantle; uchwyty maszyny przy bokach jak hantle, ruch barków ten sam] `shrug.move`

**Wskazówki**

- Unoś barki tak wysoko, jak się da. — ACE: [Shrug (#72)](https://www.acefitness.org/resources/everyone/exercise-library/72/shrug/) (opis (wariant: sztanga)); ExRx.net: [BBShrug](https://web.archive.org/web/20230306153926/https://exrx.net/WeightExercises/TrapeziusUpper/BBShrug) (Execution (wariant: sztanga)) [uproszczenie: wariant sprzętu: źródła opisują sztangę i hantle; uchwyty maszyny przy bokach jak hantle, ruch barków ten sam] `shrug.high`

**Czego unikać**

- Krążenie barkami zamiast ruchu prosto w górę i w dół. — ACE: [Standing Shrug (#75)](https://www.acefitness.org/resources/everyone/exercise-library/75/standing-shrug/) (Step 2 (wariant: hantle)); Fitness Volt: [barbell shrugs guide](https://fitnessvolt.com/barbell-shrugs-guide/) (How to (wariant: sztanga)) [uproszczenie: wariant sprzętu: źródła opisują sztangę i hantle; uchwyty maszyny przy bokach jak hantle, ruch barków ten sam] `shrug.mis.roll`
- Uginanie łokci — ciężar ciągną ręce zamiast barków. — ACE: [Standing Shrug (#75)](https://www.acefitness.org/resources/everyone/exercise-library/75/standing-shrug/) (Step 2 (wariant: hantle)); BarBend: [dumbbell shrug](https://barbend.com/dumbbell-shrug/) (Common Mistakes — Bending Your Elbows (wariant: hantle)) [uproszczenie: wariant sprzętu: źródła opisują sztangę i hantle; uchwyty maszyny przy bokach jak hantle, ruch barków ten sam] `shrug.mis.elbows`

### Zottman Curl

**Ustawienie**

- Trzymaj hantle w opuszczonych rękach, dłonie zwrócone do przodu. — Catalyst Athletics: [Zottman Curl (#915)](https://www.catalystathletics.com/exercise/915/Zottman-Curl/) (opis zd. 1 („…at arm's length and the palms facing forward”)); ISSA: [12 Biceps Curl Variations to Keep Your Arms Engaged (ISSA, 22.09.2025)](https://www.issaonline.com/blogs/performance/12-biceps-curl-variations-to-keep-your-arms-engaged) (8. Zottman Curl („Start with dumbbells held in a supinated grip”)) `curl2.zottSetup`

**Ruch**

- Uginaj ręce podchwytem, na górze obróć dłonie w dół i opuść hantle nachwytem. — Catalyst Athletics: [Zottman Curl (#915)](https://www.catalystathletics.com/exercise/915/Zottman-Curl/) (opis zd. 2–3); ISSA: [12 Biceps Curl Variations to Keep Your Arms Engaged (ISSA, 22.09.2025)](https://www.issaonline.com/blogs/performance/12-biceps-curl-variations-to-keep-your-arms-engaged) (8. Zottman Curl) `zottman.move`

**Wskazówki**

- Opuszczaj ciężar powoli, z kontrolą. — Catalyst Athletics: [Zottman Curl (#915)](https://www.catalystathletics.com/exercise/915/Zottman-Curl/) (opis zd. 3); ISSA: [12 Biceps Curl Variations to Keep Your Arms Engaged (ISSA, 22.09.2025)](https://www.issaonline.com/blogs/performance/12-biceps-curl-variations-to-keep-your-arms-engaged) (8. Zottman Curl („slowly lower…”)) `curl.control`

### Zottman Preacher Curl

**Ustawienie**

- Oprzyj ramię o podpórkę modlitewnika i nie odrywaj go przez cały ruch. — ISSA: [12 Biceps Curl Variations to Keep Your Arms Engaged (ISSA, 22.09.2025)](https://www.issaonline.com/blogs/performance/12-biceps-curl-variations-to-keep-your-arms-engaged) (9. Preacher Curl (hantle)); Catalyst Athletics: [Single-Arm Dumbbell Preacher Curl (#889)](https://www.catalystathletics.com/exercise/889/) (opis zd. 1) `preacher.arms`

**Ruch**

- Uginaj ręce podchwytem, na górze obróć dłonie w dół i opuść hantle nachwytem. — Catalyst Athletics: [Zottman Curl (#915)](https://www.catalystathletics.com/exercise/915/Zottman-Curl/) (opis zd. 2–3); ISSA: [12 Biceps Curl Variations to Keep Your Arms Engaged (ISSA, 22.09.2025)](https://www.issaonline.com/blogs/performance/12-biceps-curl-variations-to-keep-your-arms-engaged) (8. Zottman Curl) [uproszczenie: wariant pozycji Zottman Curl (stojąc → modlitewnik); obrót dłoni ten sam] `zottman.move`

### External Rotation (linki)

**Ustawienie**

- Załóż pojedynczy uchwyt, ustaw wyciąg na wysokości pasa i stań do niego bokiem. — ACE: [Rotator Cuff External Rotation (#352)](https://www.acefitness.org/resources/everyone/exercise-library/352/rotator-cuff-external-rotation/) (instrukcja, zdania 1–2); Fitness Volt: [cable external shoulder rotation](https://fitnessvolt.com/cable-external-shoulder-rotation/) (Setup (single handle, approximately elbow height)); HSS: [Shoulder Rotator Cuff and Scapular Strengthening Program](https://hss.edu/sutton/shoulder-strengthening-program.pdf) (s. 1, External Rotation — uproszczenie: wariant sprzętu External Rotation with Band); WebMD Ignite: [Shoulder external rotation (resisted)](https://www.columbiadoctors.org/health-library/multimedia/shoulder-external-rotation-resisted/) (instrukcja, akapity 1–2 — uproszczenie: wariant sprzętu External Rotation with Band) `rotator_cuff.cableSetup`
- Chwyć uchwyt ręką dalej od wyciągu; łokieć zgięty pod kątem prostym przy boku, przedramię przed brzuchem. — ACE: [Rotator Cuff External Rotation (#352)](https://www.acefitness.org/resources/everyone/exercise-library/352/rotator-cuff-external-rotation/) (Steps („Keep the left elbow tucked in to the body”; „the cable should pass in front of the stomach”; wyciąg na wysokości pasa, pojedynczy uchwyt)); Fitness Volt: [cable external shoulder rotation](https://fitnessvolt.com/cable-external-shoulder-rotation/) (How to („The working arm should be farther from the weight stack”; „Bend it to about 90 degrees and keep the upper arm close to your side.”)) `rotator_cuff.erStartCable`

**Ruch**

- Odsuwaj dłoń od brzucha na zewnątrz, tak daleko, jak wygodnie. — ACE: [Rotator Cuff External Rotation (#352)](https://www.acefitness.org/resources/everyone/exercise-library/352/rotator-cuff-external-rotation/) (instrukcja (move the left hand to the outside of the body)); Fitness Volt: [cable external shoulder rotation](https://fitnessvolt.com/cable-external-shoulder-rotation/) (Movement (move the forearm away from the cable)); AAOS: [Rotator Cuff and Shoulder Conditioning Program](https://www.orthoinfo.org/en/recovery/rotator-cuff-and-shoulder-conditioning-program/) (ćw. 9 — uproszczenie: wariant sprzętu External Rotation with Band) `rotator_cuff.erMove`

**Wskazówki**

- Łokieć zgięty i przy boku — obraca się tylko przedramię. — ACE: [Rotator Cuff External Rotation (#352)](https://www.acefitness.org/resources/everyone/exercise-library/352/rotator-cuff-external-rotation/) (instrukcja (elbow tucked in to the body)); Fitness Volt: [cable external shoulder rotation](https://fitnessvolt.com/cable-external-shoulder-rotation/) (Setup; Movement (elbow stays near the same spot)) `rot.elbow`
- Wracaj powoli. — ACE: [Rotator Cuff External Rotation (#352)](https://www.acefitness.org/resources/everyone/exercise-library/352/rotator-cuff-external-rotation/) (instrukcja (slowly lowering the weight)); Fitness Volt: [cable external shoulder rotation](https://fitnessvolt.com/cable-external-shoulder-rotation/) (Return (under control)); AAOS: [Rotator Cuff and Shoulder Conditioning Program](https://www.orthoinfo.org/en/recovery/rotator-cuff-and-shoulder-conditioning-program/) (ćw. 9 — uproszczenie: wariant sprzętu) `rot.slow`

**Czego unikać**

- Łokieć odjeżdża od tułowia. — Fitness Volt: [cable external shoulder rotation](https://fitnessvolt.com/cable-external-shoulder-rotation/) (Common mistakes: Pulling the elbow away from the ribs); ACE: [Rotator Cuff External Rotation (#352)](https://www.acefitness.org/resources/everyone/exercise-library/352/rotator-cuff-external-rotation/) (instrukcja (keep the left elbow tucked in) — błąd = zaprzeczenie standardu) `rot.mis.elbowAway`

### Band Pull Apart

**Ustawienie**

- Chwyć gumę oburącz i trzymaj ręce przed sobą na wysokości klatki. — WebMD Ignite: [Resistance Training With Exercise Bands: Exercises](https://healthy.kaiserpermanente.org/health-wellness/health-encyclopedia/he.resistance-training-with-exercise-bands-exercises.bz1003) (Chest-level pull, kroki 1–2); Catalyst Athletics: [Band Pull Apart](https://www.catalystathletics.com/exercise/762/Band-Pull-Apart/) (opis, zdanie 1) `rotator_cuff.pullHold`

**Ruch**

- Rozciągnij gumę na boki, ściągając łopatki; dłonie zostają na wysokości klatki. — WebMD Ignite: [Resistance Training With Exercise Bands: Exercises](https://healthy.kaiserpermanente.org/health-wellness/health-encyclopedia/he.resistance-training-with-exercise-bands-exercises.bz1003) (Chest-level pull, krok 3); Catalyst Athletics: [Band Pull Apart](https://www.catalystathletics.com/exercise/762/Band-Pull-Apart/) (opis, zdanie 2 (arms remaining horizontal)); Mullaney i in. (Int J Sports Phys Ther 2021): [PMC8637269](https://pmc.ncbi.nlm.nih.gov/articles/PMC8637269/) (Appendix A, Standing horizontal abduction with neutral) `rotator_cuff.pullMove`

**Wskazówki**

- Wracaj powoli. — WebMD Ignite: [Resistance Training With Exercise Bands: Exercises](https://healthy.kaiserpermanente.org/health-wellness/health-encyclopedia/he.resistance-training-with-exercise-bands-exercises.bz1003) (Chest-level pull, krok 4); Mullaney i in. (Int J Sports Phys Ther 2021): [PMC8637269](https://pmc.ncbi.nlm.nih.gov/articles/PMC8637269/) (Appendix A (then slowly move your arms in)) `rot.slow`

**Czego unikać**

- Unoszenie barków do uszu. — WebMD Ignite: [Resistance Training With Exercise Bands: Exercises](https://healthy.kaiserpermanente.org/health-wellness/health-encyclopedia/he.resistance-training-with-exercise-bands-exercises.bz1003) (Chest-level pull, krok 3 (do not pull your shoulders up toward your ears)); Catalyst Athletics: [Band Pull Apart](https://www.catalystathletics.com/exercise/762/Band-Pull-Apart/) (opis, zdanie 2 (keeping them down) — błąd = zaprzeczenie standardu) `rotator_cuff.mis.shrug`

### Cuban Press

**Ustawienie**

- Stań prosto z hantlami w dłoniach. — BarBend: [cuban press](https://barbend.com/cuban-press/) (How to, Step 1 (Grab light dumbbells in both hands)); Fitness Volt: [cuban press](https://fitnessvolt.com/cuban-press/) (Setup (Stand with your feet about hip-width apart) — uproszczenie: wariant sprzętu (sztanga)) `rotator_cuff.cubanStand`
- Zanim zaczniesz, ściągnij łopatki w dół i do tyłu. — BarBend: [cuban press](https://barbend.com/cuban-press/) (Step 1, Coach's Tip; Common mistakes: Not Setting Your Scapula); Fitness Volt: [cuban press](https://fitnessvolt.com/cuban-press/) (Setup (shoulders pulled down and back)) `rotator_cuff.cubanBlades`

**Ruch**

- Unieś łokcie bokiem do wysokości barków, zgięte pod kątem prostym; hantle zwisają. — BarBend: [cuban press](https://barbend.com/cuban-press/) (Step 1 (elbows up to a 90-degree angle, parallel to the floor)); Fitness Volt: [cuban press](https://fitnessvolt.com/cuban-press/) (Step 2 (upper arms roughly parallel to the floor, elbows bent to 90-degrees) — uproszczenie: wariant sprzętu) `rotator_cuff.cubanRow`
- Obróć przedramiona w górę, nie opuszczając łokci — ramiona zostają poziomo. — BarBend: [cuban press](https://barbend.com/cuban-press/) (Step 2 (goalpost position)); Fitness Volt: [cuban press](https://fitnessvolt.com/cuban-press/) (Step 3 (Without lowering your upper arms, externally rotate) — uproszczenie: wariant sprzętu) `rotator_cuff.cubanRotate`
- Wyciśnij hantle prosto nad głowę. — BarBend: [cuban press](https://barbend.com/cuban-press/) (Step 3 (Press your arms overhead; Coach's Tip: press up straight)); Fitness Volt: [cuban press](https://fitnessvolt.com/cuban-press/) (Step 4 (Press the bar up to arms' length) — uproszczenie: wariant sprzętu) `rotator_cuff.cubanPressUp`

### Clean Deadlift

**Ustawienie**

- Ustaw się jak do zarzutu: chwyt jak do zarzutu, kolana wypchnięte na zewnątrz, aż dotkną rąk. — Catalyst Athletics: [Clean Deadlift (exercise library #176)](https://www.catalystathletics.com/exercise/176/Clean-Deadlift/) (opis (starting position)); BarBend: [Chad Vaughn — clean deadlift technique (17.07.2023)](https://barbend.com/news/chad-vaughn-clean-deadlift/) (start position (knees out, clean grip)) `cdl.setup`

**Ruch**

- Odrywaj sztangę nogami, trzymając ten sam kąt pleców, aż minie kolana. — Catalyst Athletics: [Clean Deadlift (exercise library #176)](https://www.catalystathletics.com/exercise/176/Clean-Deadlift/) (opis (back angle until bar passes knees)); BarBend: [Chad Vaughn — clean deadlift technique (17.07.2023)](https://barbend.com/news/chad-vaughn-clean-deadlift/) (back holding position as legs lift) `cdl.move`

**Wskazówki**

- Prowadź sztangę blisko nóg przez cały ruch. — Catalyst Athletics: [Clean Deadlift (exercise library #176)](https://www.catalystathletics.com/exercise/176/Clean-Deadlift/) (opis (bar close to legs)); BarBend: [Chad Vaughn — clean deadlift technique (17.07.2023)](https://barbend.com/news/chad-vaughn-clean-deadlift/) (keep bar close) `dl.close`
- Plecy proste (neutralne) przez cały ruch — bez zaokrąglania. — Catalyst Athletics: [Clean Deadlift (exercise library #176)](https://www.catalystathletics.com/exercise/176/Clean-Deadlift/) (opis (back braced and extended)); BarBend: [Chad Vaughn — clean deadlift technique (17.07.2023)](https://barbend.com/news/chad-vaughn-clean-deadlift/) (back tension and position maintenance) `hinge.back`

**Czego unikać**

- Sztanga odjeżdża od ciała. — BarBend: [Chad Vaughn — clean deadlift technique (17.07.2023)](https://barbend.com/news/chad-vaughn-clean-deadlift/) (shoulders in front → bar drifts forward); Catalyst Athletics: [Clean Deadlift (exercise library #176)](https://www.catalystathletics.com/exercise/176/Clean-Deadlift/) (opis (bar as close as possible) — błąd = zaprzeczenie standardu) `mis.barAway`

### Single Leg RDL (hantel)

**Ustawienie**

- Stań na jednej nodze, kolano lekko ugięte. — ACE: [Single-Arm Single-Leg Romanian Deadlift (#127)](https://www.acefitness.org/resources/everyone/exercise-library/127/single-arm-single-leg-romanian-dead-lift/) (instrukcja (balance on the left leg… keep the left knee slightly bent)); BarBend: [Single-Leg Romanian Deadlift (M. Dewar, CSCS, akt. 13.08.2024)](https://barbend.com/single-leg-romanian-deadlift/) (Step 1: Stand on One Leg (wariant: dowolne obciążenie)) `slrdl.setup`

**Ruch**

- Pochyl się, cofając biodra, a wolną nogę prowadź prosto w tył; wróć, wypychając biodra w przód. — ACE: [Single-Arm Single-Leg Romanian Deadlift (#127)](https://www.acefitness.org/resources/everyone/exercise-library/127/single-arm-single-leg-romanian-dead-lift/) (instrukcja (leaning forward on the left hip… straighten the right leg; stand up)); Coach: [How To Do The Single-Leg Romanian Deadlift](https://www.coachweb.com/leg-exercises/8130/how-to-do-the-single-leg-romanian-deadlift) (The Hinge; The Return (wariant: sztanga, hantel); kwalifikacje autora na stronie autora coachweb.com/author/sam-rider („REPS level 3 qualified personal trainer”) — nie na stronie artykułu); BarBend: [Single-Leg Romanian Deadlift (M. Dewar, CSCS, akt. 13.08.2024)](https://barbend.com/single-leg-romanian-deadlift/) (Step 2: Push Your Hips Back; Step 3) `slrdl.move`

**Wskazówki**

- Plecy proste (neutralne) przez cały ruch — bez zaokrąglania. — ACE: [Single-Arm Single-Leg Romanian Deadlift (#127)](https://www.acefitness.org/resources/everyone/exercise-library/127/single-arm-single-leg-romanian-dead-lift/) (instrukcja (the back straight)); Coach: [How To Do The Single-Leg Romanian Deadlift](https://www.coachweb.com/leg-exercises/8130/how-to-do-the-single-leg-romanian-deadlift) (The Hinge (keeping your back flat); kwalifikacje autora na stronie autora coachweb.com/author/sam-rider („REPS level 3 qualified personal trainer”) — nie na stronie artykułu); BarBend: [Single-Leg Romanian Deadlift (M. Dewar, CSCS, akt. 13.08.2024)](https://barbend.com/single-leg-romanian-deadlift/) (Step 3 (keep the back flat)) `hinge.back`

**Czego unikać**

- Zaokrąglanie pleców, żeby dociągnąć ciężar. — Coach: [How To Do The Single-Leg Romanian Deadlift](https://www.coachweb.com/leg-exercises/8130/how-to-do-the-single-leg-romanian-deadlift) (Common mistakes: Rounding Your Back; kwalifikacje autora na stronie autora coachweb.com/author/sam-rider („REPS level 3 qualified personal trainer”) — nie na stronie artykułu); BarBend: [Single-Leg Romanian Deadlift (M. Dewar, CSCS, akt. 13.08.2024)](https://barbend.com/single-leg-romanian-deadlift/) (Form tips, Step 2 (lower back rounds)) `mis.roundBack`

### Single Leg RDL (linki)

**Ustawienie**

- Stań na jednej nodze, kolano lekko ugięte. — ACE: [Single-Leg Romanian Deadlift — cable (#350)](https://www.acefitness.org/resources/everyone/exercise-library/350/single-leg-romanian-dead-lift/) (instrukcja (balancing body weight on the right leg… slight bend in the right knee)); BarBend: [Single-Leg Romanian Deadlift (M. Dewar, CSCS, akt. 13.08.2024)](https://barbend.com/single-leg-romanian-deadlift/) (Step 1 (wariant: wolne ciężary)) `slrdl.setup`

**Ruch**

- Pochyl się, cofając biodra, a wolną nogę prowadź prosto w tył; wróć, wypychając biodra w przód. — ACE: [Single-Leg Romanian Deadlift — cable (#350)](https://www.acefitness.org/resources/everyone/exercise-library/350/single-leg-romanian-dead-lift/) (instrukcja (hinging forward on the right hip; stand up… lowering the left leg)); Coach: [How To Do The Single-Leg Romanian Deadlift](https://www.coachweb.com/leg-exercises/8130/how-to-do-the-single-leg-romanian-deadlift) (The Hinge; The Return (wariant: sztanga, hantel); kwalifikacje autora na stronie autora coachweb.com/author/sam-rider („REPS level 3 qualified personal trainer”) — nie na stronie artykułu) [uproszczenie: wariant sprzętu (wyciąg): źródła opisują wersję z wolnym ciężarem; wersję z wyciągiem opisuje wprost ACE (#350)] `slrdl.move`

**Wskazówki**

- Plecy proste (neutralne) przez cały ruch — bez zaokrąglania. — ACE: [Single-Leg Romanian Deadlift — cable (#350)](https://www.acefitness.org/resources/everyone/exercise-library/350/single-leg-romanian-dead-lift/) (instrukcja (the back straight)); Coach: [How To Do The Single-Leg Romanian Deadlift](https://www.coachweb.com/leg-exercises/8130/how-to-do-the-single-leg-romanian-deadlift) (The Hinge (wariant); kwalifikacje autora na stronie autora coachweb.com/author/sam-rider („REPS level 3 qualified personal trainer”) — nie na stronie artykułu); BarBend: [Single-Leg Romanian Deadlift (M. Dewar, CSCS, akt. 13.08.2024)](https://barbend.com/single-leg-romanian-deadlift/) (Step 3 (wariant)) `hinge.back`

**Czego unikać**

- Zaokrąglanie pleców, żeby dociągnąć ciężar. — Coach: [How To Do The Single-Leg Romanian Deadlift](https://www.coachweb.com/leg-exercises/8130/how-to-do-the-single-leg-romanian-deadlift) (Common mistakes: Rounding Your Back (wariant); kwalifikacje autora na stronie autora coachweb.com/author/sam-rider („REPS level 3 qualified personal trainer”) — nie na stronie artykułu); BarBend: [Single-Leg Romanian Deadlift (M. Dewar, CSCS, akt. 13.08.2024)](https://barbend.com/single-leg-romanian-deadlift/) (Form tips, Step 2 (wariant)) [uproszczenie: wariant sprzętu (wyciąg): źródła opisują wersję z wolnym ciężarem; wersję z wyciągiem opisuje wprost ACE (#350)] `mis.roundBack`

### Barbell Hack Squat

**Ustawienie**

- Sztanga za nogami, chwyt nachwytem w opuszczonych rękach; stopy na szerokość barków. — BarBend: [How to Do the Hack Squat (J. Zucker, NCSF CPT; recenzja J. Dickson, CPT-NASM; akt. 12.01.2024)](https://barbend.com/hack-squat/) (How to Do the Hack Squat — Setup/Grip (heels touching the bar behind you; feet shoulder-width; overhand grip behind you)); Coach: [How To Do The Hack Squat](https://www.coachweb.com/fitness/leg-exercises/hack-squat) (Barbell Hack Squat — Setup/Grip (back to the bar; overhand grip, palms facing behind; feet shoulder-width); kwalifikacje autora na stronie autora coachweb.com/author/sam-rider („REPS level 3 qualified personal trainer”) — nie na stronie artykułu) `bhs.setup`

**Ruch**

- Opuść się, uginając biodra i kolana, potem wstań, prostując nogi. — BarBend: [How to Do the Hack Squat (J. Zucker, NCSF CPT; recenzja J. Dickson, CPT-NASM; akt. 12.01.2024)](https://barbend.com/hack-squat/) (How to Do the Hack Squat — Descent (drop hips back and down); Ascent (push your feet into the floor to stand up)); Coach: [How To Do The Hack Squat](https://www.coachweb.com/fitness/leg-exercises/hack-squat) (Barbell Hack Squat — Descent (bend your knees to lower); Ascent (back to the start); kwalifikacje autora na stronie autora coachweb.com/author/sam-rider („REPS level 3 qualified personal trainer”) — nie na stronie artykułu) `hack.move`

**Wskazówki**

- Plecy proste (neutralne) przez cały ruch — bez zaokrąglania. — BarBend: [How to Do the Hack Squat (J. Zucker, NCSF CPT; recenzja J. Dickson, CPT-NASM; akt. 12.01.2024)](https://barbend.com/hack-squat/) (How to Do the Hack Squat — Back (spine neutral); Mistakes: Rounding); Coach: [How To Do The Hack Squat](https://www.coachweb.com/fitness/leg-exercises/hack-squat) (Barbell Hack Squat — Back (shoulder blades to straighten your back); kwalifikacje autora na stronie autora coachweb.com/author/sam-rider („REPS level 3 qualified personal trainer”) — nie na stronie artykułu) `hinge.back`

**Czego unikać**

- Odrywanie pięt od podłogi. — BarBend: [How to Do the Hack Squat (J. Zucker, NCSF CPT; recenzja J. Dickson, CPT-NASM; akt. 12.01.2024)](https://barbend.com/hack-squat/) (Mistakes: Heels lifting); Coach: [How To Do The Hack Squat](https://www.coachweb.com/fitness/leg-exercises/hack-squat) (Barbell Hack Squat — Ascent (drive through midfoot and heels); Mistakes: pressing through the forefoot; kwalifikacje autora na stronie autora coachweb.com/author/sam-rider („REPS level 3 qualified personal trainer”) — nie na stronie artykułu) `sq.mis.heels`

### Bodyweight Squat

**Ustawienie**

- Stopy na szerokość bioder do barków. — ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (Step 1 (feet slightly wider than hip-width)); ISSA: [Mastering the Squat: A Trainer's Guide to Form, Function, and Fixes (24.07.2025)](https://www.issaonline.com/blog/post/mastering-the-squat-a-trainers-guide-to-form-function-and-fixes) (How to Perform a Proper Squat (feet just outside hip-width)) `gob.stance`

**Ruch**

- Schodź, cofając biodra i uginając kolana jednocześnie; wstań, wypychając podłogę całymi stopami. — ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (Step 3 (hips backwards then downwards, knees bend); Step 6 (extend hips and knees, push through heels)); ISSA: [Mastering the Squat: A Trainer's Guide to Form, Function, and Fixes (24.07.2025)](https://www.issaonline.com/blog/post/mastering-the-squat-a-trainers-guide-to-form-function-and-fixes) (How to Perform a Proper Squat (hinge from the hips and bend the knees, hips slightly back; press through your midfoot to return to standing)) `sq.down`

**Wskazówki**

- Kolana idą w linii palców stóp — nie zapadają się do środka. — ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (Step 5 (knees aligned over the second toe)); ISSA: [Mastering the Squat: A Trainer's Guide to Form, Function, and Fixes (24.07.2025)](https://www.issaonline.com/blog/post/mastering-the-squat-a-trainers-guide-to-form-function-and-fixes) (How to Perform a Proper Squat (knees track in the same direction as your big toes)) `sq.kneesToes`

**Czego unikać**

- Kolana zapadające się do środka. — ISSA: [Mastering the Squat: A Trainer's Guide to Form, Function, and Fixes (24.07.2025)](https://www.issaonline.com/blog/post/mastering-the-squat-a-trainers-guide-to-form-function-and-fixes) (Common mistakes: Knees falling in or out (Valgus or Varus Collapse)); ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (Step 5 (knees remain aligned over the second toe)) `sq.mis.kneesIn`

### Dumbbell Squat

**Ustawienie**

- Stopy na szerokość bioder do barków. — BarBend: [Dumbbell Squat (J. Morris, CSCS, akt. 01.07.2024)](https://barbend.com/dumbbell-squat/) (How to do (feet about shoulder-width apart, maybe a little wider; one dumbbell in each hand)); ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (uproszczenie: wariant sprzętu Bodyweight Squat — Step 1 (slightly wider than hip-width)); ISSA: [Mastering the Squat: A Trainer's Guide to Form, Function, and Fixes (24.07.2025)](https://www.issaonline.com/blog/post/mastering-the-squat-a-trainers-guide-to-form-function-and-fixes) (uproszczenie: wariant sprzętu Bodyweight Squat — How to Perform a Proper Squat (just outside hip-width)) [uproszczenie: wariant sprzętu Bodyweight Squat: hantle w opuszczonych rękach zmieniają miejsce ciężaru; źródło o samym przysiadzie z hantlami opisuje przebieg zgodny z przysiadem bez obciążenia] `gob.stance`

**Ruch**

- Schodź, cofając biodra i uginając kolana jednocześnie; wstań, wypychając podłogę całymi stopami. — BarBend: [Dumbbell Squat (J. Morris, CSCS, akt. 01.07.2024)](https://barbend.com/dumbbell-squat/) (How to do (unlock your knees and hips… sit back; push with your legs… standing tall)); ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (uproszczenie: wariant sprzętu Bodyweight Squat — Step 3; Step 6); ISSA: [Mastering the Squat: A Trainer's Guide to Form, Function, and Fixes (24.07.2025)](https://www.issaonline.com/blog/post/mastering-the-squat-a-trainers-guide-to-form-function-and-fixes) (uproszczenie: wariant sprzętu Bodyweight Squat — How to Perform a Proper Squat) [uproszczenie: wariant sprzętu Bodyweight Squat: hantle w opuszczonych rękach zmieniają miejsce ciężaru; źródło o samym przysiadzie z hantlami opisuje przebieg zgodny z przysiadem bez obciążenia] `sq.down`

**Wskazówki**

- Kolana idą w linii palców stóp — nie zapadają się do środka. — BarBend: [Dumbbell Squat (J. Morris, CSCS, akt. 01.07.2024)](https://barbend.com/dumbbell-squat/) (How to do (toes out; knees out)); ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (uproszczenie: wariant sprzętu Bodyweight Squat — Step 5); ISSA: [Mastering the Squat: A Trainer's Guide to Form, Function, and Fixes (24.07.2025)](https://www.issaonline.com/blog/post/mastering-the-squat-a-trainers-guide-to-form-function-and-fixes) (uproszczenie: wariant sprzętu Bodyweight Squat — knees track with big toes) [uproszczenie: wariant sprzętu Bodyweight Squat: hantle w opuszczonych rękach zmieniają miejsce ciężaru; źródło o samym przysiadzie z hantlami opisuje przebieg zgodny z przysiadem bez obciążenia] `sq.kneesToes`

**Czego unikać**

- Kolana zapadające się do środka. — ISSA: [Mastering the Squat: A Trainer's Guide to Form, Function, and Fixes (24.07.2025)](https://www.issaonline.com/blog/post/mastering-the-squat-a-trainers-guide-to-form-function-and-fixes) (uproszczenie: wariant sprzętu Bodyweight Squat — Common mistakes: Knees falling in); ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (uproszczenie: wariant sprzętu Bodyweight Squat — Step 5) [uproszczenie: wariant sprzętu Bodyweight Squat: hantle w opuszczonych rękach zmieniają miejsce ciężaru; źródło o samym przysiadzie z hantlami opisuje przebieg zgodny z przysiadem bez obciążenia] `sq.mis.kneesIn`

### Overhead Squat

**Ustawienie**

- Sztanga nad głową na wyprostowanych rękach. — Catalyst Athletics: [Overhead Squat (exercise library #79)](https://catalystathletics.com/exercise/79/Overhead-Squat/) (opis (bar overhead; elbows extended fully; feet in your squat stance) — rozstaw stóp poza zdaniem: tu „your squat stance”, w drugim źródle stopy na wprost w teście (recenzja niezależna rundy 1, 09.11.2026)); ISSA: [It's Not Your Fault That You Don't Know Squat — overhead squat assessment (05.02.2024)](https://www.issaonline.com/blog/post/its-not-your-fault-that-you-dont-know-squat) (uproszczenie: wariant sprzętu (bez sztangi) — overhead squat assessment (arms extended overhead, aligned with ears)) [uproszczenie: wariant sprzętu: jedno ze źródeł opisuje ten sam przysiad z rękami nad głową bez sztangi (ocena ruchu); sztanga nad głową nie zmienia przebiegu ruchu] `ohs.setup`

**Ruch**

- Zejdź w przysiad, trzymając sztangę cały czas nad głową, i wróć do stania. — Catalyst Athletics: [Overhead Squat (exercise library #79)](https://catalystathletics.com/exercise/79/Overhead-Squat/) (opis (squat at a controlled speed into full depth and return to standing; bar not moving relative to upper body)); ISSA: [It's Not Your Fault That You Don't Know Squat — overhead squat assessment (05.02.2024)](https://www.issaonline.com/blog/post/its-not-your-fault-that-you-dont-know-squat) (uproszczenie: wariant sprzętu (bez sztangi) — squat as if sitting in a chair, return to standing, arms stay overhead) [uproszczenie: wariant sprzętu: jedno ze źródeł opisuje ten sam przysiad z rękami nad głową bez sztangi (ocena ruchu); sztanga nad głową nie zmienia przebiegu ruchu] `ohs.move`

**Wskazówki**

- Ręce przez cały ruch wyprostowane. — Catalyst Athletics: [Overhead Squat (exercise library #79)](https://catalystathletics.com/exercise/79/Overhead-Squat/) (opis (elbows extended fully and forcefully)); ISSA: [It's Not Your Fault That You Don't Know Squat — overhead squat assessment (05.02.2024)](https://www.issaonline.com/blog/post/its-not-your-fault-that-you-dont-know-squat) (uproszczenie: wariant sprzętu (bez sztangi) — arms extended overhead; faults: arms stay in place or fall forward) [uproszczenie: wariant sprzętu: jedno ze źródeł opisuje ten sam przysiad z rękami nad głową bez sztangi (ocena ruchu); sztanga nad głową nie zmienia przebiegu ruchu] `ohs.arms`

**Czego unikać**

- Odrywanie pięt od podłogi. — ISSA: [It's Not Your Fault That You Don't Know Squat — overhead squat assessment (05.02.2024)](https://www.issaonline.com/blog/post/its-not-your-fault-that-you-dont-know-squat) (uproszczenie: wariant sprzętu (bez sztangi) — faults: Feet (does the heel come off the ground?)); Stronger by Science: [How to Squat: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-squat/) (przysiad ze sztangą („heels coming off the ground”) — uproszczenie: analogia do przysiadu ze sztangą (recenzja niezależna rundy 1, 09.11.2026)) [uproszczenie: analogia do przysiadu ze sztangą: jedno źródło opisuje odrywanie pięt wprost przy przysiadzie z rękami nad głową, drugie — przy przysiadzie ze sztangą na plecach] `sq.mis.heels`

### Squat with Chains

**Ustawienie**

- Sztanga na górze pleców, chwyt szerzej niż barki; zdejmij ją ze stojaka i cofnij się o krok lub dwa. — ACE: [Back Squat (#11)](https://www.acefitness.org/resources/everyone/exercise-library/11/back-squat/) (opis — uproszczenie: wariant sprzętu Back Squat); BarBend: [How to Do the Back Squat (M. Dewar, CSCS; weryfikacja J. Dickson, USAW-L2)](https://barbend.com/back-squat/) (Step 2 („hands clasping the bar just outside your shoulders”; „step out of the rack”) (runda 2 recenzji niezależnej, 09.11.2026) — uproszczenie: wariant sprzętu Back Squat) [uproszczenie: wariant sprzętu Back Squat: łańcuchy zmieniają tylko rozkład oporu w zakresie ruchu, przysiad jak zwykle (źródło o tym wariancie mówi to wprost)] `sq.bar`

**Ruch**

- Schodź, cofając biodra i uginając kolana jednocześnie; wstań, wypychając podłogę całymi stopami. — Catalyst Athletics: [Chain Back Squat (exercise library #609)](https://www.catalystathletics.com/exercise/609/Chain-Back-Squat/) (opis (Squat as usual)); ACE: [Back Squat (#11)](https://www.acefitness.org/resources/everyone/exercise-library/11/back-squat/) (opis — uproszczenie: wariant sprzętu Back Squat) [uproszczenie: wariant sprzętu Back Squat: łańcuchy zmieniają tylko rozkład oporu w zakresie ruchu, przysiad jak zwykle (źródło o tym wariancie mówi to wprost)] `sq.down`

**Wskazówki**

- Kolana idą w linii palców stóp — nie zapadają się do środka. — Stronger by Science: [How to Squat: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-squat/) (Foot Angle; FAQ (knees caving in) — uproszczenie: wariant sprzętu Back Squat); ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (Step 4; Step 5 — uproszczenie: wariant sprzętu Back Squat) [uproszczenie: wariant sprzętu Back Squat: łańcuchy zmieniają tylko rozkład oporu w zakresie ruchu, przysiad jak zwykle (źródło o tym wariancie mówi to wprost)] `sq.kneesToes`
- Plecy proste, klatka uniesiona. — ACE: [Back Squat (#11)](https://www.acefitness.org/resources/everyone/exercise-library/11/back-squat/) (opis (straight back, chest up) — uproszczenie: wariant sprzętu Back Squat); BarBend: [How to Do the Back Squat (M. Dewar, CSCS; weryfikacja J. Dickson, USAW-L2)](https://barbend.com/back-squat/) (Step 5 („Keep your chest up”) (runda 2 recenzji niezależnej, 09.11.2026) — uproszczenie: wariant sprzętu Back Squat); Stronger by Science: [How to Squat: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-squat/) („Your spine should remain rigid and extended” (runda 2 recenzji niezależnej, 09.11.2026) — uproszczenie: wariant sprzętu Back Squat) [uproszczenie: wariant sprzętu Back Squat: łańcuchy zmieniają tylko rozkład oporu w zakresie ruchu, przysiad jak zwykle (źródło o tym wariancie mówi to wprost)] `sq.back`

**Czego unikać**

- Kolana zapadające się do środka. — Stronger by Science: [How to Squat: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-squat/) (FAQ: My knees are caving in — uproszczenie: wariant sprzętu Back Squat); ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (Step 4 — uproszczenie: wariant sprzętu Back Squat) [uproszczenie: wariant sprzętu Back Squat: łańcuchy zmieniają tylko rozkład oporu w zakresie ruchu, przysiad jak zwykle (źródło o tym wariancie mówi to wprost)] `sq.mis.kneesIn`
- Odrywanie pięt od podłogi. — ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (Step 4; Step 6 (heels flat) — uproszczenie: wariant sprzętu Back Squat); Stronger by Science: [How to Squat: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-squat/) (przysiad ze sztangą („heels coming off the ground”) — uproszczenie: wariant sprzętu Back Squat (recenzja niezależna rundy 1, 09.11.2026)) [uproszczenie: wariant sprzętu Back Squat: łańcuchy zmieniają tylko rozkład oporu w zakresie ruchu, przysiad jak zwykle (źródło o tym wariancie mówi to wprost)] `sq.mis.heels`

### Squat with Bands

**Ustawienie**

- Sztanga na górze pleców, chwyt szerzej niż barki; zdejmij ją ze stojaka i cofnij się o krok lub dwa. — ACE: [Back Squat (#11)](https://www.acefitness.org/resources/everyone/exercise-library/11/back-squat/) (opis — uproszczenie: wariant sprzętu Back Squat); BarBend: [How to Do the Back Squat (M. Dewar, CSCS; weryfikacja J. Dickson, USAW-L2)](https://barbend.com/back-squat/) (Step 2 („hands clasping the bar just outside your shoulders”; „step out of the rack”) (runda 2 recenzji niezależnej, 09.11.2026) — uproszczenie: wariant sprzętu Back Squat) [uproszczenie: wariant sprzętu Back Squat: gumy zmieniają tylko rozkład oporu w zakresie ruchu, standardowy przysiad ze sztangą na plecach (źródło o tym wariancie mówi to wprost)] `sq.bar`

**Ruch**

- Schodź, cofając biodra i uginając kolana jednocześnie; wstań, wypychając podłogę całymi stopami. — BarBend: [Accommodating Resistance (T. Ramos, ACSM CPT, akt. 27.05.2025)](https://barbend.com/accommodating-resistance/) (sekcja o przysiadzie z gumami (perform standard back squats)); ACE: [Back Squat (#11)](https://www.acefitness.org/resources/everyone/exercise-library/11/back-squat/) (opis — uproszczenie: wariant sprzętu Back Squat) [uproszczenie: wariant sprzętu Back Squat: gumy zmieniają tylko rozkład oporu w zakresie ruchu, standardowy przysiad ze sztangą na plecach (źródło o tym wariancie mówi to wprost)] `sq.down`

**Wskazówki**

- Kolana idą w linii palców stóp — nie zapadają się do środka. — Stronger by Science: [How to Squat: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-squat/) (Foot Angle; FAQ (knees caving in) — uproszczenie: wariant sprzętu Back Squat); ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (Step 4; Step 5 — uproszczenie: wariant sprzętu Back Squat) [uproszczenie: wariant sprzętu Back Squat: gumy zmieniają tylko rozkład oporu w zakresie ruchu, standardowy przysiad ze sztangą na plecach (źródło o tym wariancie mówi to wprost)] `sq.kneesToes`
- Plecy proste, klatka uniesiona. — ACE: [Back Squat (#11)](https://www.acefitness.org/resources/everyone/exercise-library/11/back-squat/) (opis (straight back, chest up) — uproszczenie: wariant sprzętu Back Squat); BarBend: [How to Do the Back Squat (M. Dewar, CSCS; weryfikacja J. Dickson, USAW-L2)](https://barbend.com/back-squat/) (Step 5 („Keep your chest up”) (runda 2 recenzji niezależnej, 09.11.2026) — uproszczenie: wariant sprzętu Back Squat); Stronger by Science: [How to Squat: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-squat/) („Your spine should remain rigid and extended” (runda 2 recenzji niezależnej, 09.11.2026) — uproszczenie: wariant sprzętu Back Squat) [uproszczenie: wariant sprzętu Back Squat: gumy zmieniają tylko rozkład oporu w zakresie ruchu, standardowy przysiad ze sztangą na plecach (źródło o tym wariancie mówi to wprost)] `sq.back`

**Czego unikać**

- Kolana zapadające się do środka. — Stronger by Science: [How to Squat: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-squat/) (FAQ: My knees are caving in — uproszczenie: wariant sprzętu Back Squat); ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (Step 4 — uproszczenie: wariant sprzętu Back Squat) [uproszczenie: wariant sprzętu Back Squat: gumy zmieniają tylko rozkład oporu w zakresie ruchu, standardowy przysiad ze sztangą na plecach (źródło o tym wariancie mówi to wprost)] `sq.mis.kneesIn`
- Odrywanie pięt od podłogi. — ACE: [Bodyweight Squat (#135)](https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/) (Step 4; Step 6 (heels flat) — uproszczenie: wariant sprzętu Back Squat); Stronger by Science: [How to Squat: The Definitive Guide (Greg Nuckols)](https://www.strongerbyscience.com/how-to-squat/) (przysiad ze sztangą („heels coming off the ground”) — uproszczenie: wariant sprzętu Back Squat (recenzja niezależna rundy 1, 09.11.2026)) [uproszczenie: wariant sprzętu Back Squat: gumy zmieniają tylko rozkład oporu w zakresie ruchu, standardowy przysiad ze sztangą na plecach (źródło o tym wariancie mówi to wprost)] `sq.mis.heels`

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
| ace-127 | ACE | Single-Arm Single-Leg Romanian Deadlift (#127) | https://www.acefitness.org/resources/everyone/exercise-library/127/single-arm-single-leg-romanian-dead-lift/ | — |
| ace-131 | ACE | Prone (Lying) Hamstrings Curl (#131) | https://www.acefitness.org/resources/everyone/exercise-library/131/prone-lying-hamstrings-curl/ | — |
| ace-135 | ACE | Bodyweight Squat (#135) | https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/ | — |
| ace-139 | ACE | Walking Lunges With Twists (#139) | https://www.acefitness.org/resources/everyone/exercise-library/139/walking-lunges-with-twists/ | — |
| ace-14 | ACE | Bird Dog (#14) | https://www.acefitness.org/resources/everyone/exercise-library/14/bird-dog/ | — |
| ace-145 | ACE | glute bridge single leg progression | https://www.acefitness.org/resources/everyone/exercise-library/145/glute-bridge-single-leg-progression/ | — |
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
| ace-270 | ACE | quadruped bent knee hip extensions | https://www.acefitness.org/resources/everyone/exercise-library/270/quadruped-bent-knee-hip-extensions/ | — |
| ace-28 | ACE | Step Up (#28) | https://www.acefitness.org/resources/everyone/exercise-library/28/step-up/ | — |
| ace-294 | ACE | Calf Raise (#294) | https://www.acefitness.org/resources/everyone/exercise-library/294/calf-raise/ | — |
| ace-303 | ACE | Side Plank (#303) | https://www.acefitness.org/resources/everyone/exercise-library/303/side-plank/ | — |
| ace-305 | ACE | V Twist (#305) | https://www.acefitness.org/resources/everyone/exercise-library/305/v-twist/ | — |
| ace-306 | ACE | Burpee (#306, wersja z BOSU) | https://www.acefitness.org/education-and-resources/lifestyle/exercise-library/306/burpee/ | — |
| ace-308 | ACE | Pistol Squat (#308) | https://www.acefitness.org/resources/everyone/exercise-library/308/pistol-squat/ | — |
| ace-309 | ACE | 309 | https://www.acefitness.org/resources/everyone/exercise-library/309/ | — |
| ace-311 | ACE | Close Grip Bench Press (#311) | https://www.acefitness.org/resources/everyone/exercise-library/311/close-grip-bench-press/ | — |
| ace-317 | ACE | Romanian Deadlift (#317) | https://www.acefitness.org/resources/everyone/exercise-library/317/romanian-deadlift/ | — |
| ace-318 | ACE | Hip Bridge (#318) | https://www.acefitness.org/resources/everyone/exercise-library/318/hip-bridge/ | — |
| ace-319 | ACE | Reverse Lunge (#319) | https://www.acefitness.org/resources/everyone/exercise-library/319/reverse-lunge/ | — |
| ace-32 | ACE | Front Plank (#32) | https://www.acefitness.org/resources/everyone/exercise-library/32/front-plank/ | — |
| ace-322 | ACE | Standing Bicep Curl (#322) | https://www.acefitness.org/resources/everyone/exercise-library/322/standing-bicep-curl/ | — |
| ace-332 | ACE | Standing Anti-Rotation Press (#332) | https://www.acefitness.org/resources/everyone/exercise-library/332/standing-anti-rotation-press/ | — |
| ace-334 | ACE | Straight Arm Pressdown (#334) | https://www.acefitness.org/resources/everyone/exercise-library/334/straight-arm-pressdown/ | — |
| ace-335 | ACE | standing row | https://www.acefitness.org/resources/everyone/exercise-library/335/standing-row/ | — |
| ace-336 | ACE | High Row (#336) | https://www.acefitness.org/resources/everyone/exercise-library/336/high-row/ | — |
| ace-338 | ACE | Single-arm Chest Press (#338) | https://www.acefitness.org/resources/everyone/exercise-library/338/single-arm-chest-press/ | — |
| ace-34 | ACE | Incline Reverse Fly (#34) | https://www.acefitness.org/resources/everyone/exercise-library/34/incline-reverse-fly/ | — |
| ace-350 | ACE | Single-Leg Romanian Deadlift — cable (#350) | https://www.acefitness.org/resources/everyone/exercise-library/350/single-leg-romanian-dead-lift/ | — |
| ace-352 | ACE | Rotator Cuff External Rotation (#352) | https://www.acefitness.org/resources/everyone/exercise-library/352/rotator-cuff-external-rotation/ | — |
| ace-353 | ACE | Reverse Fly (#353) | https://www.acefitness.org/resources/everyone/exercise-library/353/reverse-fly/ | — |
| ace-354 | ACE | Single Arm Lateral Raise (#354) | https://www.acefitness.org/resources/everyone/exercise-library/354/single-arm-lateral-raise/ | — |
| ace-355 | ACE | renegade row | https://www.acefitness.org/resources/everyone/exercise-library/355/renegade-row/ | — |
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
| ace-395 | ACE | single arm overhead press | https://www.acefitness.org/resources/everyone/exercise-library/395/single-arm-overhead-press/ | — |
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
| ace-55 | ACE | Triceps Kickback (#55) | https://www.acefitness.org/resources/everyone/exercise-library/55/triceps-kickback/ | — |
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
| ace-pro-5043 | ACE | how to self care for the it band | https://www.acefitness.org/resources/pros/expert-articles/5043/how-to-self-care-for-the-it-band/ | — |
| ace-pro-6315 | ACE | 8 hip strengthening exercises using the versa loop | https://www.acefitness.org/resources/pros/expert-articles/6315/8-hip-strengthening-exercises-using-the-versa-loop/ | — |
| ace-pro-6355 | ACE | 8 butt toning moves | https://www.acefitness.org/resources/pros/expert-articles/6355/8-butt-toning-moves/ | — |
| ace-pro-6402 | ACE | 5 ab exercises no crunches no equipment | https://www.acefitness.org/resources/pros/expert-articles/6402/5-ab-exercises-no-crunches-no-equipment/ | — |
| ace-pro-7409 | ACE | 7 new moves to challenge your glutes and hamstrings | https://www.acefitness.org/resources/pros/expert-articles/7409/7-new-moves-to-challenge-your-glutes-and-hamstrings/ | — |
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
| app-s8 | app-s8 | app-s8 | — | — |
| athletico-figure-4 | Athletico Physical Therapy | Stretch of the Week: Figure 4 | https://athletico.com/?p=27325 | — |
| aurora-lower-trunk-rotation | Advocate Aurora Health | Lumbar – Lower Trunk Rotation, Hooklying (X20549, rev. 12/2019) | https://ahc.aurorahealthcare.org/fywb/x20549.pdf | — |
| barbend-accommodating-resistance | BarBend | Accommodating Resistance (T. Ramos, ACSM CPT, akt. 27.05.2025) | https://barbend.com/accommodating-resistance/ | — |
| barbend-arnold-press | BarBend | arnold press | https://barbend.com/arnold-press/ | — |
| barbend-back-squat | BarBend | How to Do the Back Squat (M. Dewar, CSCS; weryfikacja J. Dickson, USAW-L2) | https://barbend.com/back-squat/ | — |
| barbend-band-glutes | BarBend | resistance band exercises for glutes | https://barbend.com/resistance-band-exercises-for-glutes/ | — |
| barbend-blocks-vs-hang | BarBend | Weightlifting Blocks vs. the Hang (J. Dickson, USAW-L2) | https://barbend.com/weightlifting-blocks-vs-hang/ | — |
| barbend-clean | BarBend | How to Do the Clean… (akt. 19.11.2024) | https://barbend.com/how-to-do-the-clean/ | — |
| barbend-clean-pull | BarBend | Clean Pull guide (J. Dickson, USAW-L2, akt. 15.07.2024) | https://barbend.com/clean-pull-guide/ | — |
| barbend-db-shrug | BarBend | dumbbell shrug | https://barbend.com/dumbbell-shrug/ | — |
| barbend-db-snatch | BarBend | Dumbbell Snatch (M. Dewar, CSCS; aktualizacja J. Dickson, NASM-CPT, USAW-L2, 26.11.2024) | https://barbend.com/dumbbell-snatch/ | — |
| barbend-dips | BarBend | dips | https://barbend.com/dips/ | — |
| barbend-dumbbell-flye-variations | BarBend | dumbbell flye variations | https://barbend.com/dumbbell-flye-variations/ | — |
| barbend-dumbbell-squat | BarBend | Dumbbell Squat (J. Morris, CSCS, akt. 01.07.2024) | https://barbend.com/dumbbell-squat/ | — |
| barbend-fix-your-snatch | BarBend | Need to Fix Your Snatch? (R. Stefan, USAW-L1) | https://barbend.com/fix-your-snatch/ | — |
| barbend-glute-kickbacks | BarBend | glute kickbacks | https://barbend.com/glute-kickbacks/ | — |
| barbend-hack-squat | BarBend | How to Do the Hack Squat (J. Zucker, NCSF CPT; recenzja J. Dickson, CPT-NASM; akt. 12.01.2024) | https://barbend.com/hack-squat/ | — |
| barbend-hack-squat-machine | BarBend | hack squat machine | https://barbend.com/hack-squat-machine/ | — |
| barbend-hang-clean | BarBend | How to Do a Hang Clean (akt. 19.12.2023) | https://barbend.com/hang-clean/ | — |
| barbend-hang-lifts | BarBend | What Are Hang Lifts in Weightlifting? (J. Dickson, USAW-L2) | https://barbend.com/what-are-hang-lifts-in-weightlifting/ | — |
| barbend-jerk-dip | BarBend | Jerk Dip — Technique & Benefits (K. Ferriello, akt. 31.07.2023) | https://barbend.com/jerk-dip-technique-benefits/ | — |
| barbend-jerk-exercises | BarBend | Exercises to Strengthen Your Jerk (R. Stefan, akt. 01.07.2024) | https://barbend.com/exercises-to-strengthen-jerk | — |
| barbend-kb-clean | BarBend | Kettlebell Clean (D. Fraiser, Canadian Kettlebell Instructor, 25.09.2023) | https://barbend.com/kettlebell-clean/ | — |
| barbend-kb-jerk-vs-pp | BarBend | Kettlebell Jerk vs Push Press (M. Dewar, CSCS; akt. 24.08.2023) | https://barbend.com/kettlebell-jerk-vs-push-press | — |
| barbend-kettlebell-halo | BarBend | Kettlebell halo | https://barbend.com/kettlebell-halo/ | — |
| barbend-muscle-snatch | BarBend | Muscle Snatch (C. Trieu, 2024) | https://barbend.com/muscle-snatch/ | — |
| barbend-ote | BarBend | Overhead triceps extension | https://barbend.com/overhead-triceps-extension/ | — |
| barbend-pendlay-row | BarBend | Pendlay Row | https://barbend.com/Pendlay-row/ | — |
| barbend-power-clean | BarBend | The Power Clean Exercise: How To… (akt. 25.03.2024) | https://barbend.com/power-clean/ | — |
| barbend-power-snatch | BarBend | Power Snatch (R. Stefan, USAW-L1) | https://barbend.com/power-snatch/ | — |
| barbend-renegade-row | BarBend | renegade row | https://www.barbend.com/renegade-row/ | — |
| barbend-single-leg-romanian-deadlift | BarBend | Single-Leg Romanian Deadlift (M. Dewar, CSCS, akt. 13.08.2024) | https://barbend.com/single-leg-romanian-deadlift/ | — |
| barbend-sled-push | BarBend | How to Do the Sled Push (M. Dewar, CSCS, akt. 28.06.2024) | https://barbend.com/sled-push/ | — |
| barbend-snatch-balance | BarBend | Snatch Balance (M. Dewar, CSCS) | https://barbend.com/snatch-balance/ | — |
| barbend-tri-best | BarBend | Best triceps exercises | https://barbend.com/best-triceps-exercises/ | — |
| barbend-unilateral | BarBend | The Best Unilateral Exercises… (S. McLean, CPT; akt. 04.06.2025) — Meadows Row | https://barbend.com/best-unilateral-exercises/ | — |
| barbend-vaughn-clean-deadlift | BarBend | Chad Vaughn — clean deadlift technique (17.07.2023) | https://barbend.com/news/chad-vaughn-clean-deadlift/ | — |
| berling-2006 | Berling i in. (University of Wisconsin–La Crosse) | …handrail support on oxygen uptake during steady-state treadmill exercise, J Cardiopulm Rehabil 2006 (abstrakt, Europe PMC) | https://europepmc.org/article/MED/17135860 | — |
| bini-2011 | Bini, Hume, Croft (Auckland University of Technology) | Effects of bicycle saddle height on knee injury risk and cycling performance, Sports Med 2011 (abstrakt, Europe PMC) | https://europepmc.org/article/MED/21615188 | — |
| bodbot-lying-one-arm-triceps-extension | BodBot | Tricep extension, lying, dumbbell, one arm | https://www.bodbot.com/Exercises/1010/Tricep-Extension-_-Lying,-Dumbbell-_-One-Arm | — |
| bodylastics-lateral-raise-with-flat-bands | Bodylastics | Lateral raise with flat bands | https://bodylastics.com/exercise/lateral-raise-with-flat-bands | — |
| bodylastics-standing-calf-raise-flat-bands | Bodylastics | standing calf raises with flat bands | https://bodylastics.com/exercise/standing-calf-raises-with-flat-bands | — |
| bodylastics-standing-shoulder-press | Bodylastics | standing shoulder press with bands | https://bodylastics.com/standing-shoulder-press-with-bands | — |
| bodylastics-upright-row | Bodylastics | Upright row | https://www.bodylastics.com/exercises/resistance-bands/shoulders/upright-row | — |
| breakingmuscle-pendlay-row | Breaking Muscle | Pendlay Row | https://breakingmuscle.com/pendlay-row/ | — |
| c2-bikeerg-setup | Concept2 | Setting Up the BikeErg | https://www.concept2.nl/en/node/8909 | — |
| c2-technique | Concept2 | Indoor Rowing Technique | https://www.concept2.com/training/rowing-technique | — |
| catalyst-176 | Catalyst Athletics | Clean Deadlift (exercise library #176) | https://www.catalystathletics.com/exercise/176/Clean-Deadlift/ | — |
| catalyst-193 | Catalyst Athletics | Jerk Balance (Exercise Library #193) | https://catalystathletics.com/exercise/193/Jerk-Balance/ | — |
| catalyst-194 | Catalyst Athletics | Jerk Dip Squat (Exercise Library #194) | https://catalystathletics.com/exercise/194/Jerk-Dip-Squat/ | — |
| catalyst-207 | Catalyst Athletics | Block Snatch (#207) | https://catalystathletics.com/exercise/207/Block-Snatch/ | — |
| catalyst-211 | Catalyst Athletics | Split Clean | https://www.catalystathletics.com/exercise/211/Split-Clean/ | — |
| catalyst-353 | Catalyst Athletics | Back Squat Jump (#353) | https://catalystathletics.com/exercise/353/Back-Squat-Jump/ | — |
| catalyst-379 | Catalyst Athletics | Block Clean | https://www.catalystathletics.com/exercise/379/Block-Clean/ | — |
| catalyst-380 | Catalyst Athletics | Block Power Clean | https://www.catalystathletics.com/exercise/380/Block-Power-Clean/ | — |
| catalyst-496 | Catalyst Athletics | Single Leg Glute Bridge | https://www.catalystathletics.com/exercise/496/Single-Leg-Glute-Bridge/ | — |
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
| catalyst-723 | Catalyst Athletics | Single Leg Bench Supported Glute Bridge | https://www.catalystathletics.com/exercise/723/Single-Leg-Bench-Supported-Glute-Bridge/ | — |
| catalyst-75 | Catalyst Athletics | Squat Jerk (Exercise Library #75) | https://catalystathletics.com/exercise/75/Squat-Jerk/ | — |
| catalyst-76 | Catalyst Athletics | Clean & Jerk | https://www.catalystathletics.com/exercise/76/Clean-Jerk/ | — |
| catalyst-766 | Catalyst Athletics | Clamshell | https://catalystathletics.com/exercise/766/Clamshell/ | — |
| catalyst-79-overhead-squat | Catalyst Athletics | Overhead Squat (exercise library #79) | https://catalystathletics.com/exercise/79/Overhead-Squat/ | — |
| catalyst-80 | Catalyst Athletics | Snatch Balance (#80) | https://www.catalystathletics.com/exercise/80/Snatch-Balance/ | — |
| catalyst-803 | Catalyst Athletics | Barbell Front Raise (#803) | https://catalystathletics.com/exercise/803/Barbell-Front-Raise/ | — |
| catalyst-805 | Catalyst Athletics | Barbell Upright Row (#805) | https://catalystathletics.com/exercise/805/Barbell-Upright-Row/ | — |
| catalyst-812 | Catalyst Athletics | Cable Front Raise (#812) | https://catalystathletics.com/exercise/812/Cable-Front-Raise/ | — |
| catalyst-822 | Catalyst Athletics | Dumbbell Front Side Raise (#822) | https://catalystathletics.com/exercise/822/Dumbbell-Front-Side-Raise/ | — |
| catalyst-861 | Catalyst Athletics | Neutral Grip Lat Pulldown | https://www.catalystathletics.com/exercise/861/Neutral-Grip-Lat-Pulldown/ | — |
| catalyst-876 | Catalyst Athletics | Reverse Grip Lat Pulldown | https://www.catalystathletics.com/exercise/876/Reverse-Grip-Lat-Pulldown/ | — |
| catalyst-878 | Catalyst Athletics | Reverse Grip Tricep Pushdown (#878) | https://www.catalystathletics.com/exercise/878/Reverse-Grip-Tricep-Pushdown/ | — |
| catalyst-889 | Catalyst Athletics | Single-Arm Dumbbell Preacher Curl (#889) | https://www.catalystathletics.com/exercise/889/ | — |
| catalyst-894 | Catalyst Athletics | Single Arm Overhead Cable Tricep Extension (#894) | https://www.catalystathletics.com/exercise/894/Single-Arm-Overhead-Cable-Tricep-Extension/ | — |
| catalyst-895 | Catalyst Athletics | Single-Arm Pulldown (#895) | https://catalystathletics.com/exercise/895/Single-Arm-Pulldown/ | — |
| catalyst-898 | Catalyst Athletics | Single Arm Rope Tricep Pushdown (#898) | https://www.catalystathletics.com/exercise/898/Single-Arm-Rope-Tricep-Pushdown/ | — |
| catalyst-903 | Catalyst Athletics | Skullcrusher (#903) | https://www.catalystathletics.com/exercise/903/Skullcrusher/ | — |
| catalyst-909 | Catalyst Athletics | Tate Press (#909) | https://www.catalystathletics.com/exercise/909/Tate-Press/ | — |
| catalyst-910 | Catalyst Athletics | Tricep Kickback (#910) | https://www.catalystathletics.com/exercise/910/Tricep-Kickback/ | — |
| catalyst-915 | Catalyst Athletics | Zottman Curl (#915) | https://www.catalystathletics.com/exercise/915/Zottman-Curl/ | — |
| catalyst-96 | Catalyst Athletics | Muscle Snatch (#96) | https://www.catalystathletics.com/exercise/96/Muscle-Snatch/ | — |
| catalyst-97 | Catalyst Athletics | Snatch Pull (#97) | https://www.catalystathletics.com/exercise/97/Snatch-Pull/ | — |
| catalyst-98 | Catalyst Athletics | Clean Pull | https://www.catalystathletics.com/exercise/98/Clean-Pull/ | — |
| catalyst-ab-rollout | Catalyst Athletics | Ab Rollout | https://catalystathletics.com/exercise/135/Ab-Rollout | — |
| catalyst-art-1904 | Catalyst Athletics | Everett: Arm Bend in the Snatch & Clean — It's Still Not the Solution | https://catalystathletics.com/article/1904/Arm-Bend-in-the-Snatch-Clean-Its-Still-Not-the-Solution-to-/ | — |
| catalyst-art-2076 | Catalyst Athletics | Everett: Keeping the Bar Close — The 3 Biggest Mistakes You're Making (2017) | https://catalystathletics.com/article/2076/Keeping-the-Bar-Close-The-3-Biggest-Mistakes-Youre-Making | — |
| catalyst-chain-back-squat | Catalyst Athletics | Chain Back Squat (exercise library #609) | https://www.catalystathletics.com/exercise/609/Chain-Back-Squat/ | — |
| catalyst-kettlebell-press | Catalyst Athletics | Ketllebell Press | https://catalystathletics.com/exercise/855/Ketllebell-Press/ | — |
| catalyst-pm-815 | Catalyst Athletics | Everett: Ask Greg, Issue 130 (Performance Menu, XI 2015) — split snatch | https://performancemenu.com/article/815/Greg-Everett | — |
| catalyst-video-1499 | Catalyst Athletics | How To Stop Swinging Snatch & Clean Pulls (wideo z opisem) | https://catalystathletics.com/video/1499/How-To-Stop-Swinging-Snatch-Clean-Pulls | — |
| catalyst-video-1539 | Catalyst Athletics | Arm Bend In Snatch & Clean Pulls? (wideo z opisem) | https://catalystathletics.com/video/1539/Arm-Bend-In-Snatch-Clean-Pulls/ | — |
| cc-seated-warmup | Cleveland Clinic | Seated Warm-Up/Cool-Down Exercises (Rev. 7/19) | https://my.clevelandclinic.org/-/scassets/files/org/heart/patient-education/hvti-files/seated-warm-up-exercises.pdf | — |
| ccmc-foam-rolling | Connecticut Children's Sports Medicine | Lower Extremity Foam Rolling Home Exercise Program (PDF, 2 s.) | https://www.connecticutchildrens.org/sites/default/files/2024-01/lower_extremity_foam_rolling_home_exercise_program.pdf | — |
| ccsm-back-stretching | Connecticut Children's Sports Medicine | Back Stretching Home Exercise Program | https://www.connecticutchildrens.org/sites/default/files/2026-04/pdf_sportsmed_back-stretching-home-exercise-program.pdf | — |
| ccv-flexibility | Cancer Council Victoria | Flexibility exercises | https://www.cancervic.org.au/get-support/guides/managing-daily-life/exercise/flexibility-exercises | — |
| centrumrespo-bus-driver-with-mini-band | Atlas ćwiczeń Centrum Respo | Bus driver with mini band | https://centrumrespo.pl/atlas/bus-driver-with-mini-band/ | — |
| cf-dkb-pp-jerk | CrossFit | Double-Kettlebell Push Press and Jerk (J. Martone, 01.2008) | https://crossfit.com/essentials/double-kettlebell-push-press-and-jerk | — |
| coach-hack-squat | Coach | How To Do The Hack Squat | https://www.coachweb.com/fitness/leg-exercises/hack-squat | — |
| coach-pendlay-row | Coach | How To Do The Pendlay Row | https://www.coachweb.com/back-exercises/7785/how-to-do-the-pendlay-row | — |
| coach-single-leg-romanian-deadlift | Coach | How To Do The Single-Leg Romanian Deadlift | https://www.coachweb.com/leg-exercises/8130/how-to-do-the-single-leg-romanian-deadlift | — |
| columbia-plantar-fasciitis | WebMD Ignite | Plantar Fasciitis Exercises (Health Library) | https://www.columbiadoctors.org/health-library/how-to/plantar-fasciitis-exercises | — |
| columbia-shoulder-press-band | WebMD Ignite | shoulder press | https://www.columbiadoctors.org/health-library/multimedia/shoulder-press/ | — |
| covenant-lower-body-flex | Covenant HealthCare | Lower Body Flexibility (PDF, 2 s.) | https://covenanthealthcare.com/Uploads/Public/Documents/Workfiles/Covenant%20Medical%20Group/Sports_Medicine/Lower_Body_Flexibility.pdf | — |
| crossfit-cj | CrossFit | The Clean and Jerk (Essentials, 21.01.2020) | https://www.crossfit.com/essentials/the-clean-and-jerk | — |
| crossfit-jerk | CrossFit | Foundational Movement: Jerk — What Is a Jerk? (B. Burgener, 29.08.2023) | https://www.crossfit.com/essentials/foundational-movement-jerk-what-is-a-jerk | — |
| crossfit-snatch-forward | CrossFit | O'Connor (CF-L4): Ask a Coach — Missing the Bar Forward in the Snatch (2025) | https://www.crossfit.com/pro-coach/ask-a-coach-missing-bar-forward-snatch | — |
| crossfit-thruster | CrossFit | The Thruster (Essentials, 12.04.2019) | https://www.crossfit.com/essentials/the-thruster | — |
| crossfit-wall-ball | CrossFit | The Wall-Ball Shot: CrossFit's Secret Weapon for Cardiovascular Conditioning | https://www.crossfit.com/essentials/crossfit-wall-ball-secret-weapon | — |
| cuh-spinal-rom | Cambridge University Hospitals NHS FT | Spinal range of movement/stretching exercises | https://www.cuh.nhs.uk/patient-information/spinal-range-of-movementstretching-exercises/ | — |
| duke-oeso-stretches | Duke University Health System, Occupational and Environmental Safety Office | Stretches (handout, 2011) | https://www.safety.duke.edu/sites/default/files/Stretches.pdf | — |
| echelon-ab-wheel | Echelon Fitness | ECHELON AB WHEEL EXERCISE GUIDE.pdf | https://cdn.shopify.com/s/files/1/2422/9487/files/ECHELON-AB-WHEEL-EXERCISE-GUIDE.pdf | — |
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
| exrx-RectusAbdominis/BWCrunch | ExRx.net | BWCrunch | https://exrx.net/WeightExercises/RectusAbdominis/BWCrunch | https://web.archive.org/web/20230523091650/https://exrx.net/WeightExercises/RectusAbdominis/BWCrunch |
| exrx-TrapeziusUpper/BBShrug | ExRx.net | BBShrug | https://exrx.net/WeightExercises/TrapeziusUpper/BBShrug | https://web.archive.org/web/20230306153926/https://exrx.net/WeightExercises/TrapeziusUpper/BBShrug |
| exrx-TrapeziusUpper/DBShrug | ExRx.net | DBShrug | https://exrx.net/WeightExercises/TrapeziusUpper/DBShrug | https://web.archive.org/web/20240105211625/https://exrx.net/WeightExercises/TrapeziusUpper/DBShrug |
| exrx-Triceps/BBCloseGripBenchPress | ExRx.net | BBCloseGripBenchPress | https://exrx.net/WeightExercises/Triceps/BBCloseGripBenchPress | https://web.archive.org/web/20240105211522/https://exrx.net/WeightExercises/Triceps/BBCloseGripBenchPress |
| exrx-Triceps/BBLyingTriExt | ExRx.net | BBLyingTriExt | https://exrx.net/WeightExercises/Triceps/BBLyingTriExt | https://web.archive.org/web/20220926203416/https://exrx.net/WeightExercises/Triceps/BBLyingTriExt |
| exrx-Triceps/BWBenchDip | ExRx.net | BWBenchDip | https://exrx.net/WeightExercises/Triceps/BWBenchDip | https://web.archive.org/web/20220823003741/https://exrx.net/WeightExercises/Triceps/BWBenchDip |
| exrx-Triceps/CBLyingTriExt | ExRx.net | CBLyingTriExt | https://exrx.net/WeightExercises/Triceps/CBLyingTriExt | — |
| exrx-Triceps/CBPushdown | ExRx.net | CBPushdown | https://exrx.net/WeightExercises/Triceps/CBPushdown | https://web.archive.org/web/20220816182710/https://exrx.net/WeightExercises/Triceps/CBPushdown |
| exrx-Triceps/CBStandingTricepsExtensionRope | ExRx.net | CBStandingTricepsExtensionRope | https://exrx.net/WeightExercises/Triceps/CBStandingTricepsExtensionRope | https://web.archive.org/web/20220403090026/https://exrx.net/WeightExercises/Triceps/CBStandingTricepsExtensionRope |
| exrx-Triceps/CBTriExt | ExRx.net | CBTriExt | https://exrx.net/WeightExercises/Triceps/CBTriExt | https://web.archive.org/web/20231228115509/https://exrx.net/WeightExercises/Triceps/CBTriExt |
| exrx-Triceps/DBTriExt | ExRx.net | DBTriExt | https://exrx.net/WeightExercises/Triceps/DBTriExt | https://web.archive.org/web/20220816182656/https://exrx.net/WeightExercises/Triceps/DBTriExt |
| fabrykasily-odwodzenie-linek-w-tyl-wyciagu-stojac | Atlas ćwiczeń Fabryka Siły | Odwodzenie linek w tyl wyciagu stojac | https://www.fabrykasily.pl/cwiczenia/na-barki/odwodzenie-linek-w-tyl-wyciagu-stojac | — |
| fedb-alternating-deltoid-raise | free-exercise-db | Alternating Deltoid Raise | https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Alternating_Deltoid_Raise.json | — |
| fedb-barbell-incline-shoulder-raise | free-exercise-db | Barbell Incline Shoulder Raise | https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Incline_Shoulder_Raise.json | — |
| fedb-chain-handle-extension | free-exercise-db | Chain Handle Extension | https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Chain_Handle_Extension.json | — |
| fedb-one-arm-incline-lateral-raise | free-exercise-db | One Arm Incline Lateral Raise | https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Incline_Lateral_Raise.json | — |
| fedb-sled-reverse-flye | free-exercise-db | Sled Reverse Flye | https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Sled_Reverse_Flye.json | — |
| fedb-standing-front-barbell-raise-over-head | free-exercise-db | Standing Front Barbell Raise Over Head | https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Front_Barbell_Raise_Over_Head.json | — |
| fedb-straight-raises-on-incline-bench | free-exercise-db | Straight Raises on Incline Bench | https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Straight_Raises_on_Incline_Bench.json | — |
| fitfather-skull-crusher | Fit Father Project | Skull crusher exercise | https://www.fitfatherproject.com/skull-crusher-exercise/ | — |
| fitnall-barbell-overhead-front-raise | Fitnall | Barbell overhead front raise | https://fitnall.com/exercises/barbell-overhead-front-raise/ | — |
| fitnessvolt-cable-rear-delt-exercises | Fitness Volt | Cable rear delt exercises | https://fitnessvolt.com/cable-rear-delt-exercises/ | — |
| fitnessvolt-cable-standing-row | Fitness Volt | cable standing row | https://fitnessvolt.com/cable-standing-row/ | — |
| fitnessvolt-decline-skull-crusher | Fitness Volt | Decline skull crusher | https://fitnessvolt.com/23999/decline-skull-crusher/ | — |
| fitvibe-cable-y-raise-668 | FitVibe | Cable y raise 668 | https://fitvibe.gr/askiseis/cable-y-raise-668 | — |
| fv-13180 | Fitness Volt | front barbell shrugs vs behind the back shrugs | https://fitnessvolt.com/13180/front-barbell-shrugs-vs-behind-the-back-shrugs/ | — |
| fv-barbell-shrugs | Fitness Volt | barbell shrugs guide | https://fitnessvolt.com/barbell-shrugs-guide/ | — |
| fv-decline-push-up | Fitness Volt | ?p=75039 | https://fitnessvolt.com/?p=75039 | — |
| fv-suspension-chest-press | Fitness Volt | suspension chest press | https://fitnessvolt.com/suspension-chest-press/ | — |
| generationiron-meadows-row | Generation Iron | Meadows Row Exercise Guide (T. Ramos, ACSM-CPT, ISSA CSCS; akt. 24.01.2025) | https://generationiron.com/meadows-row-exercise-guide/ | — |
| hci-neck-exercises | Huntsman Cancer Institute, University of Utah Health | Neck Exercises (fact sheet, 2022) | https://hci-portal.hci.utah.edu/sites/factsheets/Shared%20Documents/neck-exercises.pdf | — |
| healthline-seated-row | Healthline | seated row | https://www.healthline.com/health/seated-row | — |
| healthwise-columbia-shoulder-er | WebMD Ignite | Shoulder external rotation (resisted) | https://www.columbiadoctors.org/health-library/multimedia/shoulder-external-rotation-resisted/ | — |
| healthwise-columbia-shoulder-ir | WebMD Ignite | Shoulder internal rotation (resisted) | https://www.columbiadoctors.org/health-library/multimedia/shoulder-internal-rotation-resisted/ | — |
| healthwise-kaiser-band-exercises | WebMD Ignite | Resistance Training With Exercise Bands: Exercises | https://healthy.kaiserpermanente.org/health-wellness/health-encyclopedia/he.resistance-training-with-exercise-bands-exercises.bz1003 | — |
| hofmann-2014 | Hofmann i in. (Cybex Research Institute) | …handrail-use instructions… inclined treadmill walking, Int J Exerc Sci 7(4):339–345 (abstrakt) | https://digitalcommons.wku.edu/ijes/vol7/iss4/10 | — |
| hss-back-neck-stretches | HSS | HSS Rehabilitation and Performance, Back and Neck Stretches (17.02.2021) | https://www.hss.edu/health-library/move-better/back-neck-stretches | — |
| hss-bike | HSS | A. Karp, How to Set Up an Exercise (or Spin) Bike Properly (21.12.2020) | https://www.hss.edu/health-library/move-better/set-up-exercise-bike | — |
| hss-mini-band-hip-ext | HSS | mini band exercises for runners | https://www.hss.edu/health-library/move-better/mini-band-exercises-for-runners | — |
| hss-shoulder-strengthening-program | HSS | Shoulder strengthening program | https://www.hss.edu/globalassets/physician-files/sutton/shoulder-strengthening-program.pdf | — |
| hss-sutton-shoulder-program | HSS | Shoulder Rotator Cuff and Scapular Strengthening Program | https://hss.edu/sutton/shoulder-strengthening-program.pdf | — |
| hwq-cat-cow | Health and Wellbeing Queensland | Cat and cow stretch | https://hw.qld.gov.au/?p=41297 | — |
| insportline-qt1005 | inSPORTline | Plyometric Box Set — instrukcja (QT1005), s. 3 „Plyo Boxes Exercises” | https://www.insportline.eu/upload/file/7267_manual_QT1005_or.pdf | — |
| ironmind-split | IronMind | Jim Schmitz: Split Lifting Technique (ok. 07.2012 — data z wpisu IronMind News 06.07.2012, który go zapowiada) | https://ironmind.com/articles/jim-schmitz-on-the-lifts/Split-Lifting-Technique/ | — |
| issa-12-curls | ISSA | 12 Biceps Curl Variations to Keep Your Arms Engaged (ISSA, 22.09.2025) | https://www.issaonline.com/blogs/performance/12-biceps-curl-variations-to-keep-your-arms-engaged | — |
| issa-25min-calves | ISSA | 25 minute calf workout | https://issaonline.com/blog/post/25-minute-calf-workout | — |
| issa-band-20 | ISSA | 20-minute full-body resistance band workout | https://www.issaonline.com/blogs/training-tips/20-minute-full-body-resistance-band-workout | — |
| issa-chest-dips | ISSA | chest dips form benefits variations what to avoid | https://www.issaonline.com/blog/post/chest-dips-form-benefits-variations-what-to-avoid | — |
| issa-donkey-kicks | ISSA | donkey kicks benefits and variations for strong glutes | https://www.issaonline.com/blogs/strength/donkey-kicks-benefits-and-variations-for-strong-glutes | — |
| issa-dont-know-squat | ISSA | It's Not Your Fault That You Don't Know Squat — overhead squat assessment (05.02.2024) | https://www.issaonline.com/blog/post/its-not-your-fault-that-you-dont-know-squat | — |
| issa-hip-abduction | ISSA | hip abduction exercises for stronger hips and glutes | https://issaonline.com/blog/post/hip-abduction-exercises-for-stronger-hips-and-glutes | — |
| issa-hip-thrust-variations | ISSA | hip thrusts benefits and variations for stronger glutes | https://issaonline.com/blog/post/hip-thrusts-benefits-and-variations-for-stronger-glutes | — |
| issa-mastering-squat | ISSA | Mastering the Squat: A Trainer's Guide to Form, Function, and Fixes (24.07.2025) | https://www.issaonline.com/blog/post/mastering-the-squat-a-trainers-guide-to-form-function-and-fixes | — |
| issa-overhead-press-mistakes | ISSA | overhead press proper form variations and common mistakes | https://issaonline.com/blog/post/overhead-press-proper-form-variations-and-common-mistakes | — |
| issa-top6-calves | ISSA | top six exercises for building bigger calves | https://www.issaonline.com/blog/post/top-six-exercises-for-building-bigger-calves | — |
| issa-tri-top5 | ISSA | Top exercises to enhance your triceps workout | https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout | — |
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
| nasm-blog-active-recovery | NASM | active recovery | https://www.nasm.org/resource-center/blog/active-recovery | — |
| nasm-blog-banded-clamshell | NASM | the banded clamshell a simple move for stronger glutes | https://www.nasm.org/resource-center/blog/training/the-banded-clamshell-a-simple-move-for-stronger-glutes | — |
| nasm-box-jumps | NASM | Box Jumps | https://www.nasm.org/resource-center/exercise-library/box-jumps | — |
| nasm-bulgarian-split-squat | NASM | Bulgarian Split Squat | https://www.nasm.org/resource-center/exercise-library/bulgarian-split-squat | — |
| nasm-cable-crossover | NASM | Cable Crossover | https://www.nasm.org/resource-center/exercise-library/cable-crossover | — |
| nasm-calf-blog | NASM | Calf Training: How to Program This Stubborn Muscle Group (blog, H. Cherry, akt. 25.07.2026) | https://www.nasm.org/resource-center/blog/training/calf-training-how-to-program-this-stubborn-muscle-group-for-clients | — |
| nasm-chest-press-machine | NASM | Chest Press Machine | https://www.nasm.org/resource-center/exercise-library/chest-press-machine | — |
| nasm-close-grip-bench-press | NASM | Close Grip Bench Press | https://www.nasm.org/resource-center/exercise-library/close-grip-bench-press | — |
| nasm-dead-bug | NASM | Dead Bug | https://www.nasm.org/resource-center/exercise-library/dead-bug | — |
| nasm-decline-push-up | NASM | decline push up | https://www.nasm.org/resource-center/exercise-library/decline-push-up | — |
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
| nasm-lpd-biomech | NASM | the biomechanics of the lat pulldown muscles grip and form | https://www.nasm.org/resource-center/blog/training/the-biomechanics-of-the-lat-pulldown-muscles-grip-and-form | — |
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
| nasm-single-leg-press | NASM | single leg press | https://www.nasm.org/resource-center/exercise-library/single-leg-press | — |
| nasm-single-leg-seated-leg-curl | NASM | Single-Leg Seated Leg Curl | https://www.nasm.org/resource-center/exercise-library/single-leg-seated-leg-curl | — |
| nasm-single-leg-squat | NASM | Single Leg Squat | https://www.nasm.org/resource-center/exercise-library/single-leg-squat | — |
| nasm-squat-jump | NASM | Squat Jump | https://www.nasm.org/resource-center/exercise-library/squat-jump | — |
| nasm-squat-thrust-burpees | NASM | Squat Thrust Burpees | https://www.nasm.org/resource-center/exercise-library/squat-thrust-burpees | — |
| nasm-tuck-jump | NASM | Tuck Jump | https://www.nasm.org/resource-center/exercise-library/tuck-jump | — |
| nasm-two-arm-dumbbell-chest-press-with-band | NASM | Two Arm Dumbbell Chest Press With Band | https://www.nasm.org/resource-center/exercise-library/two-arm-dumbbell-chest-press-with-band | — |
| nasm-two-arm-incline-dumbbell-chest-press | NASM | Two Arm Incline Dumbbell Chest Press | https://www.nasm.org/resource-center/exercise-library/two-arm-incline-dumbbell-chest-press | — |
| nfpt-hack-squat | NFPT | how to do hack squats | https://nfpt.com/how-to-do-hack-squats/ | — |
| nfpt-how-to-do-incline-side-lateral-dumbbell-raises | NFPT | How to do incline side lateral dumbbell raises | https://nfpt.com/how-to-do-incline-side-lateral-dumbbell-raises/ | — |
| nfpt-incline-fly | NFPT | how to do incline bench dumbbell flyes | https://nfpt.com/how-to-do-incline-bench-dumbbell-flyes/ | — |
| nfpt-reverse-tricep-pushdown | NFPT (wpisy gościnne) | How to do reverse tricep pushdown | https://nfpt.com/how-to-do-reverse-tricep-pushdown/ | — |
| nhs-flexibility | NHS (nhs.uk) | Flexibility exercises | https://www.nhs.uk/live-well/exercise/flexibility-exercises/ | — |
| nhs-shrops-calf | Shropshire Community Health NHS Trust | Calf Stretching Information Leaflet | https://www.shropscommunityhealth.nhs.uk/content/doclib/13861.pdf | — |
| nhs-southtees-side-lying | South Tees Hospitals NHS Foundation Trust | Rotator cuff in side lying | https://www.southtees.nhs.uk/resources/rotator-cuff-in-side-lying/ | — |
| nhs-wwl-neck | Wrightington, Wigan and Leigh Teaching Hospitals NHS FT | Neck and Upper Back Exercises Level 1 (Tpy 023, v2) | https://www.wwl.nhs.uk/pdfreader/accessiblePDF/cnv-wwl-68ca8bce9edd73.73954624 | — |
| nordictrack-incline | NordicTrack | Incline treadmill benefits… (15.07.2025) | https://www.nordictrack.com/learn/incline-treadmill-benefits-why-it-works-better-than-flat-walking | — |
| nsca-basics-2012 | NSCA | Sands, Wurth, Hewit: NSCA — Basics of Strength and Conditioning Manual, NSCA 2012 | https://www.nsca.com/uploadedFiles/NSCA/Resources/PDF/Publications/basics_of_strength_and_conditioning_manual.pdf | — |
| nsca-coach-7-3 | NSCA | Taylor, Reed: Increase Hip and Trunk Stability with Loaded Carries…, NSCA Coach 7.3 | https://www.nsca.com/contentassets/927868f8d4bb45f2ac4429631d558d83/coach-7.3.6-increase-hip-and-trunk-stability-with-loaded-carries-for-injury-prevention-rehabilitation-and-performance.pdf | — |
| nsca-etm4-one-arm-kb-press | NSCA — Exercise Technique Manual (Human Kinetics) | one arm kettlebell press | https://us.humankinetics.com/blogs/excerpt/one-arm-kettlebell-press | — |
| nsca-scj-hip-thrust | NSCA | Contreras, Cronin, Schoenfeld: Barbell Hip Thrust, Strength and Conditioning Journal 33(5):58–61, 2011 (kolumna Exercise Technique, NSCA) — kopia PDF u autora; strony czasopisma 403 dla narzędzia 08.11.2026 | https://www.lookgreatnaked.com/articles/barbell_hip_thrust.pdf | — |
| orthobethesda-foam-rolling | OrthoBethesda Therapy Services | Foam Rolling (FR) Exercises (PDF, 2 s., 2015) | https://www.orthobethesda.com/foam-rolling-exercises/ | — |
| orthoindy-itb-program | OrthoIndy Physical Therapy | IT Band Home Exercise Program (PDF, rev. 8/15) | https://orthoindy.com/wp-content/uploads/IT-Band-Program.pdf | — |
| osu-foam-rolling | Ohio State University Wexner Medical Center | Foam Rolling Exercises (transkrypcja filmu) | https://wexnermedical.osu.edu/-/media/transcripts/wexnermedical/blog/2y2leqbvrgw_foamrollingexercises.txt | — |
| ph-wobble-hip-ext | Thera-Band | thera band wobble board hip extension with band | https://www.performancehealthacademy.com/exercises/thera-band-wobble-board-hip-extension-with-band.html | — |
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
| prehab-pushup-variations | The Prehab Guys | push up exercise variations | https://theprehabguys.com/push-up-exercise-variations/ | — |
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
| staywell-seated-hamstring-curl | WebMD Ignite | 3,S,90814 | https://healthlibrary.vanderbilthealth.com/library/HealthSheets/3,S,90814 | — |
| strongfirst-mastering-your-press-1 | StrongFirst | mastering your press part i | https://www.strongfirst.com/mastering-your-press-part-i/ | — |
| theprehabguys-overhead-tricep-extension-band | The Prehab Guys | Overhead Tricep Extension – Band | https://theprehabguys.com/vimeo-video/overhead-tricep-extension-band/ | — |
| theraband-ankle-calf-raise-standing | Thera-Band | thera band ankle calf raise in standing | https://www.performancehealthacademy.com/exercises/thera-band-ankle-calf-raise-in-standing.html | — |
| torokhtiy-barbell-squat-jump | Torokhtiy | Barbell Squat Jump (O. Torokhtiy, akt. 16.09.2024) | https://torokhtiy.com/blogs/guides/barbell-squat-jump | — |
| torokhtiy-snatch-balance | Torokhtiy | Snatch Balance (O. Torokhtiy, olimpijczyk, PhD nauk o sporcie, 15.10.2026) | https://store.torokhtiy.com/blogs/exercises/snatch-balance | — |
| torque-utg-2024 | Torque Fitness | Ultimate TANK Training Guide (2024, PDF; kopia u dystrybutora) | https://cdn.fitshop.co.uk/files/torque/functional_training_and_strongman/TOR-TANKMX/Ultimate_TANK_Training_Guide_2024.pdf | — |
| trx-push-up | TRX | trx push up | https://www.trxtraining.com/blogs/news/trx-push-up | — |
| ucb-uhs-work-warmup | UC Berkeley University Health Services | Work Warm-Up | https://uhs.berkeley.edu/sites/default/files/wellness-generic_warmupexerciseprogram.pdf | — |
| uwmed-plantar-fasciitis | UW Medicine | Exercises for Plantar Fasciitis (Sports Medicine Clinic, PDF, 5 s.) | https://honline.s.uw.edu/sites/default/files/record_pdfs/Exercises-Plantar-Fasciitis.pdf | — |
| vdhorst-2015 | van der Horst i in. (UMC Utrecht) | The Preventive Effect of the Nordic Hamstring Exercise… RCT, Am J Sports Med 2015 | https://instituteofmotion.com/wp-content/uploads/2018/03/Nordic-hamstring-2015.pdf | — |
| w2g2-rc-barbend-cuban | BarBend | cuban press | https://barbend.com/cuban-press/ | — |
| w2g2-rc-catalyst-pullapart | Catalyst Athletics | Band Pull Apart | https://www.catalystathletics.com/exercise/762/Band-Pull-Apart/ | — |
| w2g2-rc-fv-cable-er | Fitness Volt | cable external shoulder rotation | https://fitnessvolt.com/cable-external-shoulder-rotation/ | — |
| w2g2-rc-fv-cuban | Fitness Volt | cuban press | https://fitnessvolt.com/cuban-press/ | — |
| w2g2-rc-throwers10 | Mullaney i in. (Int J Sports Phys Ther 2021) | PMC8637269 | https://pmc.ncbi.nlm.nih.gov/articles/PMC8637269/ | — |
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
