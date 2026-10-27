# Soczewka: praktyk dziedziny (trener / zaawansowany trenujący siłowo, który zna lepsze narzędzia)

- **Data:** 27.10.2026 (wszystkie strony i streszczenia odczytane tego dnia).
- **Założenie:** ustalone od zera, bez otwierania repozytorium aplikacji ani jej dokumentów. Punkty mówią, co musi być prawdą w najlepszej w klasie aplikacji; nie oceniają obecnego stanu.
- **Metoda cytatów:** wszystkie cytaty dosłowne sprawdzone na surowym tekście (curl strony App Store → tekst; PubMed E-utilities `efetch rettype=abstract retmode=text`; Europe PMC `fullTextXML`). Wstawki w nawiasach kwadratowych `[…]` to moje zastąpienie nazwy marki.
- **Nazwy innych aplikacji pominięte** (repo publiczne) — alternatywy oznaczone literami.

## Źródła

### Alternatywy (App Store, odczyt 27.10.2026)

| Id | Strona PL / USA | Ocena PL / USA | Cena w PL (zakupy w aplikacji, z odczytu strony PL) |
|---|---|---|---|
| A | https://apps.apple.com/pl/app/id464254577 , https://apps.apple.com/us/app/id464254577 | 4,9 (1,5 tys.) / 4,9 (109 tys.) | 1 mies. 17,99–22,99 zł; 1 rok 104,99–139,99 zł; dożywotnio 399,99–499,99 zł (kilka wariantów cen) |
| B | https://apps.apple.com/pl/app/id1458862350 , https://apps.apple.com/us/app/id1458862350 | 4,9 (4,4 tys.) / 4,9 (100 tys.) | 1 mies. 14,99 / 22,99 zł; 1 rok 117,99 zł; dożywotnio 429,99 zł |
| C | https://apps.apple.com/pl/app/id1041517543 , https://apps.apple.com/us/app/id1041517543 | 4,8 (648) / 4,8 (288 tys.) | 1 mies. 34,99–89,99 zł; 1 rok 274,99–499,99 zł |

A — prosty dziennik z zegarkiem i limitem szablonów w wersji darmowej; B — dziennik z funkcjami społecznościowymi i generatorem programu w płatnej wersji; C — generator treningów „AI” z wskaźnikiem regeneracji mięśni.

### Dziedzina (PubMed / Europe PMC, odczyt 27.10.2026)

| Kod | Szczebel | Źródło |
|---|---|---|
| S1 | 2 | Currier i in., ACSM Position Stand „Resistance Training Prescription for Muscle Function, Hypertrophy, and Physical Performance in Healthy Adults: An Overview of Reviews”, Med Sci Sports Exerc 2026;58(4):851-872 — https://pubmed.ncbi.nlm.nih.gov/41843416/ |
| S2 | 2 | ACSM Position Stand „Progression models in resistance training for healthy adults”, Med Sci Sports Exerc 2009;41(3):687-708 — https://pubmed.ncbi.nlm.nih.gov/19204579/ (zastąpione przez S1, ale S1 nie podaje reguły przyrostu obciążenia) |
| S3 | 2 | Schoenfeld, Ogborn, Krieger, „Dose-response relationship between weekly resistance training volume and increases in muscle mass”, J Sports Sci 2017 — https://pubmed.ncbi.nlm.nih.gov/27433992/ |
| S4 | 2 | Pelland i in., „The Resistance Training Dose Response: Meta-Regressions…”, Sports Med 2026;56(2):481-505 — https://pubmed.ncbi.nlm.nih.gov/41343037/ |
| S5 | 2 | Schoenfeld, Ogborn, Krieger, „Effects of Resistance Training Frequency on Measures of Muscle Hypertrophy”, Sports Med 2016 — https://pubmed.ncbi.nlm.nih.gov/27102172/ |
| S6 | 2 | Robinson i in., „Exploring the Dose-Response Relationship Between Estimated Resistance Training Proximity to Failure…”, Sports Med 2024 — https://pubmed.ncbi.nlm.nih.gov/38970765/ |
| S7 | 2 | Halperin i in., „Accuracy in Predicting Repetitions to Task Failure in Resistance Exercise: A Scoping Review and Exploratory Meta-analysis”, Sports Med 2022 — https://pubmed.ncbi.nlm.nih.gov/34542869/ |
| S8 | 3 | Zourdos i in., „Novel Resistance Training-Specific Rating of Perceived Exertion Scale Measuring Repetitions in Reserve”, J Strength Cond Res 2016 — https://pubmed.ncbi.nlm.nih.gov/26049792/ |
| S9 | 3 | Helms i in., „Application of the Repetitions in Reserve-Based Rating of Perceived Exertion Scale for Resistance Training”, Strength Cond J 2016 — https://pubmed.ncbi.nlm.nih.gov/27531969/ |
| S10 | 3 | Reynolds, Gordon, Robergs, „Prediction of one repetition maximum strength from multiple repetition maximum testing and anthropometry”, J Strength Cond Res 2006 — https://pubmed.ncbi.nlm.nih.gov/16937972/ |
| S11 | 3 | Pełny tekst z wzorami Epleya i Brzyckiego (wstęp, cytuje DiStasio 2014 i Brzycki 1993): https://europepmc.org/article/PMC/PMC9465738 (PMID 36196346, 2022). Publikacji źródłowej Epleya (1985) nie przeczytałem — wzór zweryfikowany przez to wtórne źródło i rachunek. |
| S12 | 3 (badanie jakościowe — opinie trenerów, w praktyce szczebel 5) | Bell i in., „Coaches' perceptions, practices and experiences of deloading in strength and physique sports”, Front Sports Act Living 2022 — https://pubmed.ncbi.nlm.nih.gov/36619355/ |

## Co musi być prawdą (15 punktów)

### 1. e1RM: jeden nazwany wzór, 1 powtórzenie = ciężar, granica 10 powtórzeń — **dane**
Najlepszy dziennik podaje, którym wzorem liczy e1RM, i daje ten sam wynik w wykresie, rekordach i podpowiedzi. Wzór Epleya w postaci `w × (1 + r/30)` daje dla r = 1 wynik o 3,3% wyższy niż podniesiony ciężar — praktyk od razu to wychwyci, więc dla 1 powtórzenia e1RM = ciężar (wariant `w × (1 + (r−1)/30)` albo warunek). Przy liczbie powtórzeń > 10 e1RM jest ukryty albo wyraźnie oznaczony jako mało wiarygodny; seria do RIR > 0 nie jest liczona tak, jakby była do upadku (albo wzór dodaje RIR do r — nazwane jako uproszczenie).
- S11: „the Epley (1RM=load(kg)×(1+0.0333×reps)) and Brzycki (1RM=load(kg)/(1.0278+0.0278×reps)) equations accurately predicted a back squat 1RM to within 2.7 and 3.1kg from a 5RM and a 3RM test” (pełny tekst, wstęp; 2022).
- S10: „Data reveal that no more than 10 repetitions should be used in linear equations to estimate 1RM for the LP and CP actions.” (streszczenie; 2006).
- Rachunek: Epley dla r = 1 → 1,0333 × w; dla r = 10 → 1,333 × w; Brzycki dla r = 10 → w / 0,75 = 1,333 × w (wzory zbieżne przy 10, rozbieżne powyżej).

### 2. Rekordy: kilka rodzajów, rozgrzewka się nie liczy — **dane**
Rekord musi być jednoznaczny: osobno najcięższy ciężar, najlepsze e1RM, najwięcej powtórzeń przy danym ciężarze (rekord „n-RM”) i największa objętość serii/ćwiczenia. Serie oznaczone jako rozgrzewkowe nie tworzą rekordów ani objętości; usunięcie lub edycja starego treningu przelicza rekordy (bez „widm” po usuniętej serii). Import CSV nie tworzy fałszywych rekordów z serii rozgrzewkowych.
- Alt. A (strona USA): „Tag sets as Warm Up, Failure or Drop Sets” (opis, 27.10.2026).
- Alt. B (strona USA): „Log supersets, drop sets, warm-ups, and failure sets alongside your regular sets.” (opis, 27.10.2026).

### 3. Objętość: dwie miary i obie nazwane — **dane / treść**
Praktyk rozróżnia tonaż (kg × powtórzenia) i liczbę serii na partię mięśniową w tygodniu. Badania mierzą objętość seriami, więc aplikacja, która mówi o objętości w kontekście wzrostu mięśni albo regeneracji partii, liczy serie na partię, a serie ćwiczeń pomocniczych liczy ułamkowo (np. 0,5), nie jako pełne. Tonaż jest pokazywany jako „tonaż”, z jasną regułą dla ćwiczeń z masą ciała i hantli w parze (na rękę czy łącznie).
- S3: „Each additional set was associated with an increase in effect size (ES) of 0.023 corresponding to an increase in the percentage gain by 0.37%.” (streszczenie; 2017).
- S4: „weekly set volume/frequency for indirect sets was quantified as 1 for 'total,' 0.5 for 'fractional,' and 0 for 'direct.'” oraz „The relative evidence for the 'fractional' quantification method was strongest” (streszczenie; 2026).

### 4. Progi objętości i bliskość upadku bez przesady — **treść**
Jeśli aplikacja pokazuje cel tygodniowy dla partii, opiera go na „≥ 10 serii/tydz.” dla przyrostu mięśni i mówi o malejących zyskach (nie „im więcej, tym lepiej” bez końca). Nie namawia do serii do upadku: dla siły bliskość upadku ma znikomy wpływ, dla przyrostu mięśni — niewielki, i dowód jest eksploracyjny.
- S1: „Muscle hypertrophy was enhanced by higher volumes (≥10 sets/wk) and eccentric overload.” oraz „Training to momentary muscle fatigue, equipment type, exercise complexity, set structure, time under tension, blood flow restriction, and periodization did not consistently impact training outcomes.” (streszczenie; 2026).
- S4: „both best-fit models suggest diminishing returns, with the diminishing returns for strength being considerably more pronounced.” (streszczenie; 2026).
- S6: „Strength gains were similar across a wide range of RIR, while muscle hypertrophy improves as sets are terminated closer to failure.” (streszczenie; 2024).

### 5. RPE/RIR: poprawna skala i uczciwość co do dokładności — **dane / treść**
Skala RPE 1–10 jest powiązana z RIR (RPE 10 = 0 RIR, RPE 9 = 1 RIR…), z połówkami (np. 8,5), i jest opcjonalna dla każdej serii, wpisywana jednym dotknięciem. Aplikacja nie przedstawia RIR jako pomiaru: szacunek myli się średnio o ok. 1 powtórzenie i bardziej przy seriach > 12 powtórzeń, więc wskazówki oparte na RIR są oznaczone jako szacunek.
- S8: „Subjects reported an RPE value that corresponded to an RIR value (RPE-10 = 0-RIR, RPE-9 = 1-RIR, and so forth).” (streszczenie; 2016).
- S9: „A NEWLY DEVELOPED SCALE BASED ON HOW MANY REPETITIONS ARE REMAINING AT THE COMPLETION OF A SET MAY BE A MORE PRECISE TOOL.” (streszczenie; 2016).
- S7: „Participants were imperfect in their ability to predict proximity to task failure independent of their training background.” (streszczenie; 2022; wynik główny ok. 0,95 powtórzenia).
- Alt. B (strona USA): „Log weights, reps, duration, and RPE in seconds without breaking the flow of your sets.” (opis, 27.10.2026) — RPE w trakcie serii to standard rynku.

### 6. Podpowiedź progresji: reguła ze źródła i realne skoki sprzętu — **treść / dane**
Podpowiedź progresji dodaje obciążenie dopiero, gdy docelowy zakres został przekroczony (o 1–2 powtórzenia), o 2–10%, zaokrąglone do skoku, który użytkownik naprawdę ma (talerze, para hantli w domu). Gdy najmniejszy skok przekracza 10% (np. hantle 10 → 12 kg = 20%), podpowiedź proponuje najpierw więcej powtórzeń (podwójna progresja — nazwana jako uproszczenie), a nie nierealny ciężar typu 10,5 kg.
- S2: „When training at a specific RM load, it is recommended that 2-10% increase in load be applied when the individual can perform the current workload for one to two repetitions over the desired number.” (streszczenie; 2009).
- S1: „Healthy adults should perform progressive RT, with variable prescription consistent with our findings, to improve muscle function, size, and physical performance.” (streszczenie; 2026).

### 7. Plan tygodnia i generator: częstotliwość ≥ 2×/tydz. na partię — **treść / przepływ**
Generator (na polecenie, do przejrzenia) przy ≥ 2–3 sesjach w tygodniu rozkłada każdą główną partię co najmniej 2 razy w tygodniu i pokazuje sumę serii na partię przed zapisem; przy 1 sesji mówi wprost, że to kompromis. Duże ćwiczenia wielostawowe i ciężkie serie są na początku sesji.
- S5: „It can therefore be inferred that the major muscle groups should be trained at least twice a week to maximize muscle growth” (streszczenie; 2016).
- S1: „voluntary strength was enhanced by lifting heavier loads (≥80% one-repetition maximum), through a complete range of motion, for 2-3 sets, at the beginning of training sessions, and ≥2 sessions/wk.” (streszczenie; 2026).
- S4: „suggesting strength gains increase with increasing frequency, albeit with diminishing returns.” (streszczenie; 2026).

### 8. „Regeneracja partii” bez pseudo-precyzji — **treść**
W przeczytanych źródłach szczebla 2 nie ma liczby godzin regeneracji dla partii ani metody liczenia „procentu regeneracji”; roztrenowanie (deload) opisują głównie praktycy. Najlepsza aplikacja nazywa takie propozycje „uproszczeniem / konwencją”, opiera je na policzalnych rzeczach (serie na partię w ostatnich dniach, czas od ostatniego treningu partii) i nie pokazuje procentu „regeneracji mięśnia” jak pomiaru. Liczby godzin — otwarte pytanie do badacza, nie do aplikacji.
- Alt. C (recenzja USA, 12.12.2021): „You can then customize almost everything….workout time, muscle recovery %, gym equipment you have” — konkurencja sprzedaje „% regeneracji”.
- Alt. C (recenzja PL, 14.07.2019): „splits - based on fresh muscles, push/pull/lower, upper/lower or fbw” — użytkownicy cenią dobór pod „świeże” partie.
- S12: „Whilst deloading is a common training practice in strength and physique sports, little is known about how the necessary reduction in training demand should be accomplished.” (streszczenie; 2022).

### 9. Logowanie serii w trakcie treningu: jedno dotknięcie, timer sam — **przepływ**
Między seriami praktyk ma kilkanaście sekund i spocone ręce. Seria jest wypełniona wartościami z poprzedniego treningu (ciężar, powtórzenia, RPE) widocznymi obok, zatwierdzenie bez klawiatury jednym dotknięciem, timer przerwy startuje sam i jest na ekranie blokady (Live Activity / Dynamic Island) — to już standard. Domyślna przerwa zależy od rodzaju pracy (ciężkie serie wielostawowe dłużej), a nie jedna globalna.
- Alt. B (strona USA): „See last session's weights and reps for every exercise, right where you need them.” (opis, 27.10.2026).
- Alt. A (strona USA, historia wersji 6.5.0, sierpień 2026): „New: Live Activity and Dynamic Island support for rest timers”.
- S2: „with eventual emphasis on heavy loading (1-6 RM) using 3- to 5-min rest periods between sets” oraz dla przyrostu mięśni „using 1- to 2-min rest periods between sets at a moderate velocity” (streszczenie; 2009).

### 10. Zegarek: pełne logowanie bez telefonu i bez utraty danych — **przepływ / dane / wydanie**
Zegarek loguje serie i timer samodzielnie (telefon w szafce), a po ponownym połączeniu trening trafia do telefonu bez duplikatów i bez utraty; zapis do Zdrowia jest poprawny (kalorie, czas). Tego nie sprawdzi symulator — wydanie wymaga testu na fizycznym zegarku z zerwaniem połączenia.
- Alt. A (strona USA): „Fully-featured Apple Watch app to log workouts with or without your iPhone” (opis, 27.10.2026).
- Alt. B (strona USA): „Workouts save automatically when your watch reconnects to your phone.” (opis, 27.10.2026).
- Alt. A (historia wersji 6.5.0, 12.08.2026): „Fix: Apple Watch - Workout calories could be recorded incorrectly in Apple Health after completion” — nawet lider rynku ma tu błędy danych.

### 11. Typy ćwiczeń, które pokrywają dom i siłownię — **dane**
Model danych obsługuje: masa ciała, masa ciała z obciążeniem i z odciążeniem (wspomaganie), czas z obciążeniem (np. deska z obciążeniem), ćwiczenia jednostronne i hantle w parze; e1RM, objętość i rekordy mają dla każdego typu zdefiniowaną regułę (albo są wyłączone). Scalanie dwóch ćwiczeń i zmiana typu ćwiczenia nie gubią historii.
- Alt. A (recenzja USA, 24.10.2023): „some pairings are not currently allowed, like added weight and duration” — luka, którą zgłaszają zaawansowani.
- Alt. A (recenzja PL): „It’ll be easier if I could merge two existing exercises” (data recenzji niewidoczna w wyciągu).
- Alt. A (strona USA): „Support for multiple Exercise Types, including Assisted Bodyweight and Duration Exercises” (opis, 27.10.2026).

### 12. Wskazówki techniki: krótkie, poprawne, z pełnym zakresem ruchu — **treść**
Konkurencja ma filmy z wielu kątów; tekstem wygrać można tylko poprawnością i zwięzłością: 3–5 wskazówek (ustawienie, przebieg, częsty błąd), pełny zakres ruchu tam, gdzie źródła to mówią, każda karta po niezależnej recenzji ruchu. Jeden błąd w karcie (np. pomylony wariant ćwiczenia) praktyk uzna za brak kompetencji całej aplikacji.
- S1: „voluntary strength was enhanced by lifting heavier loads (≥80% one-repetition maximum), through a complete range of motion” (streszczenie; 2026).
- Alt. B (strona USA): „Learn how to do any exercise with high-quality videos and step-by-step instructions.” (opis, 27.10.2026).
- Alt. C (strona PL): „Hi-res, multi-angle videos of each exercise” (opis, 27.10.2026).

### 13. Model darmowy, który nie karze za regularność — **pieniądze**
Limit „5 dni treningowych w miesiącu” osoba trenująca 3–4 razy w tygodniu wyczerpie w 2. tygodniu; alternatywy ograniczają funkcje (liczbę szablonów, starsze statystyki), a nie samo logowanie. Najlepsza w klasie aplikacja przy takim limicie: nigdy nie blokuje zapisu rozpoczętego treningu, nie blokuje dostępu do własnej historii ani eksportu, jasno pokazuje licznik dni i ma opcję jednorazowego zakupu (rynek ją wyraźnie ceni). Cena w PL porównywalna z alternatywami (ok. 15–22 zł/mies., ok. 105–140 zł/rok, ok. 400–500 zł dożywotnio).
- Alt. A (strona USA): „The free version of […] can save unlimited workouts, but is limited to 3 custom routines.” (opis, 27.10.2026).
- Alt. B (recenzja PL, 04.01.2025): „to see statistics for workouts older than 3 months the pro version is required.”
- Alt. B (recenzja USA, 23.12.2024): „I bought the lifetime membership (PLEASE don’t ever remove this option, its value is unbelievable).”

### 14. „Bez konta i śledzenia” musi być sprawdzalne — **prywatność**
Etykieta prywatności w App Store musi brzmieć „dane nie są zbierane” i to musi być prawdą w kodzie (brak analityki z identyfikatorem, brak SDK zewnętrznych wysyłających dane, kopia tylko lokalnie / w Plikach). To realny wyróżnik: alternatywy zbierają dane powiązane z tożsamością (e-mail, imię, kontakty, dane użycia).
- Alt. B (strona USA, sekcja prywatności): „The following data, which may be collected and linked to your identity, may be used for the following purposes:” — poniżej m.in. Email Address, Name, Contacts, Product Interaction (27.10.2026).
- Alt. A (historia wersji 6.5.1, 08.10.2026): „Fix: Sign-in sessions could be lost or fail to renew, stopping sync” — konto i synchronizacja to też źródło awarii, którego aplikacja offline nie ma.

### 15. Przeprowadzka z innej aplikacji w 2 minuty — **wzrost**
Praktyk, który „zna lepsze narzędzia”, ma lata historii w innym dzienniku. Import CSV w formacie popularnych dzienników przenosi treningi, serie, RPE, notatki i oznaczenia serii (rozgrzewka) z poprawnym mapowaniem ćwiczeń i jednostek (kg/lb), pokazuje podgląd i liczby przed zapisem, a rekordy/e1RM po imporcie zgadzają się z tymi, które użytkownik znał. Bez tego wyróżniki (prywatność, PL) nie wystarczą do zmiany.
- Alt. A (strona USA): „Export all of your data to Notes or Email in CSV format” (opis, 27.10.2026).
- Alt. A (strona USA): „Support for Imperial (lbs) and Metric (kg) weights, or a combination of both” (opis, 27.10.2026).

## Otwarte (nie do aplikacji bez dalszych źródeł)
- Liczba godzin regeneracji partii mięśniowej i reguła „gotowości” — w przeczytanych źródłach szczebla 2 brak (pkt 8).
- Publikacja źródłowa wzoru Epleya (1985) — nieprzeczytana; wzór potwierdzony wtórnie (S11) i rachunkiem (pkt 1).
- Pełne teksty S1 i S4 (szczegóły progów i krzywych) — przeczytane tylko streszczenia.
