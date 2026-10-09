# e1RM w ćwiczeniach z masą ciała — jaka część masy ciała jest podnoszona (08.10.2026)

Powód: audyt 0.10 (docs/25, grupa **E1**; raporty MER-03 i LOG-02). Aplikacja liczyła e1RM ćwiczeń z masą ciała z samego dociążenia
(`e1rm(±kg, powtórzenia)`). To nie jest szacunek wzoru Epleya — wzór mnoży **cały podnoszony ciężar** przez (1 + powtórzenia/30), więc
z samego dociążenia różni się o masa·r/30, a ta różnica zależy od liczby powtórzeń (rachunek, szczebel 1). Skutek: odwrócona kolejność
serii i rekordów (+30 kg × 3 „biło” +20 kg × 8, choć przy 80 kg masy ciała: Epley(110, 3) = 121 < Epley(100, 8) = 126,7).

**Decyzja właściciela (08.10.2026, docs/18): wariant B** — opcjonalna masa ciała w Ustawieniach; e1RM z (udział masy ciała × masa ciała
± dociążenie/pomoc), pokazany np. „126,7 kg (masa ciała + 46,7)”; bez masy ciała — bez e1RM i bez rekordu e1RM (jak wariant A).
**Zmienia decyzję Q-001** („masa ciała poza obliczeniami”, runda 75, schemat 13) w części dotyczącej e1RM: objętość i rekord sumy
(suma powtórzeń bez asysty) nadal liczą się bez masy ciała. Odrzucone: A (zawsze bez e1RM), C (inna nazwa liczby bez odznaki) — opcje
w docs/25 E1. Kwestia merytoryczna (jaka część masy ciała) rozstrzygana źródłami, nie przez właściciela (CLAUDE.md).

Metoda jak w docs/research/22: **PT** = przeczytany pełny tekst, **A** = przeczytane streszczenie; szczeble z CLAUDE.md (S1 wzory, S2 przeglądy
i stanowiska, S3 pojedyncze badania, S4 serwisy, S5 praktyka).

## 1. Wzór (S1)

e1RM = ciężar × (1 + powtórzenia / 30) (Epley, decyzja D-005), tylko serie do 10 powtórzeń i bez drop setów (`E1RM_MAX_REPS`, runda 73:
Mayhew i in., JSCR 2008). Dla ćwiczeń z masą ciała „ciężar” = **podnoszony ciężar** = udział × masa ciała + ±kg (`lib/stats.ts`, `liftedLoad`).
Opis „masa ciała + X”: X = e1RM − udział × masa ciała, czyli dociążenie, z którym wyszłoby jedno powtórzenie.

## 2. Podciąganie (Pull Up; Chin Up i Neutral Grip Pull Up — uproszczenie) — udział 1 (cała masa ciała)

| Źródło | Szczebel | Status | Cytat |
|---|---|---|---|
| Sánchez-Moreno M., Rodríguez-Rosell D., Pareja-Blanco F., Mora-Custodio R., González-Badillo J.J. (2017). Movement Velocity as Indicator of Relative Intensity and Level of Effort Attained During the Set in Pull-Up Exercise. *IJSPP* 12(10), 1378–1384. https://doi.org/10.1123/ijspp.2016-0791 — rękopis zaakceptowany: https://rio.upo.es/entities/publication/aa878d47-664f-4a4d-9e4f-0f1bc4d8ecc1 | S3 | PT | „Because subjects needed to lift their BM, PU maximal strength (1RM) was calculated as the sum of the maximum weight lifted and the subject’s BM. For example, if a subject weighing 90 kg was able to lift 20 kg during the loading test, his 1RM was 110 kg (90 kg + 20 kg = 110 kg).” |
| Talaber K.A., Orr R.M., Maupin D., Schram B., Hasanki K., Roberts A., Robinson J. (2022). Profiling the absolute and relative strength of a special operations police unit. *BMC Sports Sci Med Rehabil*. https://doi.org/10.1186/s13102-022-00502-5 (PMC9208152) | S3 | PT | „The 1RM weight documented was the officer’s body weight plus the additional weight lifted.” |
| Baker D.G., Newton R.U. (2004). An analysis of the ratio and relationship between upper body pressing and pulling strength. *JSCR* 18, 594–598. https://doi.org/10.1519/r-12382.1 | S3 | A | „1RM PU of 133.1 +/- 17.1 kg” u zawodników rugby — liczba możliwa tylko z masą ciała (streszczenie nie podaje definicji wprost; pomocniczo). |

Dwa niezależne zespoły (Hiszpania, Australia) liczą 1RM podciągania jako masa ciała + dodatkowy ciężar → udział **1**.
**Uproszczenie (nazwane w aplikacji):** dłonie i część przedramion nie są unoszone, a badania dotyczyły nachwytu; podchwyt (Chin Up) i chwyt
neutralny to ten sam ruch w zwisie, więc ten sam udział — bez osobnego źródła. Asysta (−kg, np. maszyna) odejmuje się od masy ciała;
guma bez kg — obciążenie nieznane, brak e1RM (jak dotąd, T8).

## 3. Pompki (Push Up) — udział 0,64

| Źródło | Szczebel | Status | Cytat / wynik |
|---|---|---|---|
| van den Tillaar R., Ball N. (2020). Push-Ups are Able to Predict the Bench Press 1-RM and Constitute an Alternative for Measuring Maximum Upper Body Strength Based on Load-Velocity Relationships. *J Hum Kinet* 73 (2020). https://doi.org/10.2478/hukin-2019-0133 (PMC7386139) | S3 | PT | „This made the relative load from 62.6 to 65.1% of body mass (+ weight vest) that had to be lifted during the different push-ups”; „at 0 kg the percentage of body mass lifted is considered to be 62.6 ± 4.3% … similar to previous studies (64.0 and 63.2%) (Gouvali and Boudolos, 2005; Wurm et al., 2010) … lower than in the study (69%) of Suprak et al. (2011)”; przykład 1RM: „only 62.6% of the mass is lifted … mean load lifted of 50.7 kg … an extra load of 57.6 kg could be added” (1RM = 108,3 kg). |
| Gouvali M.K., Boudolos K. (2005). Dynamic and electromyographical analysis in variants of push-up exercise. *JSCR* 19(1), 146–151. https://doi.org/10.1519/14733.1 | S3 | A | „The initial load relative to body weight was 66.4% at the normal position, while only 52.9% at the on-knees EV.” |
| Wu H., Zhai H., Ma R., Wei H. (2025). A predictive model for vertical ground reaction force during incline push-ups. *Sci Rep*. https://doi.org/10.1038/s41598-025-28012-7 (PMC12738558) | S3 | PT (przegląd literatury w dyskusji) | „force values in conventional push-ups and knee-flexion push-ups … ranging from about 64% to 66% and 49% to 53% of body mass” |
| Suprak D.N., Dawes J., Stephenson M.D. (2011). The effect of position on the percentage of body mass supported during traditional and modified push-up variants. *JSCR* 25(2), 497–503. https://doi.org/10.1519/JSC.0b013e3181bde2cf | S3 | A (liczba 69% — za van den Tillaarem i Ballem) | streszczenie: „subjects supported less weight in the up vs. the down position” (siły specjalne / SWAT). |
| Ebben W.P. i in. (2011). Kinetic analysis of several variations of push-ups. *JSCR* 25(10), 2891–2894. https://doi.org/10.1519/JSC.0b013e31820c8587 | S3 | A | streszczenie bez liczby dla zwykłej pompki; cel: „quantify the training load as a percentage of body mass”. |

Niezależne zespoły (Norwegia/Australia, Grecja, Chiny, USA) — część wspólna u osób trenujących rekreacyjnie **ok. 63–66% masy ciała** w pozycji
startowej; u bardzo wytrenowanych (Suprak) 69%. **0,64 — uproszczenie** w tym przedziale (jedna liczba zamiast zależności od pozycji, budowy
ciała i fazy ruchu — Suprak: więcej w dolnej pozycji). Dociążenie (kamizelka, talerz) liczone w całości, jak w przykładzie van den Tillaara
i Balla (1RM = 62,6% masy ciała + dodatkowy ciężar); w ich tabeli udział rośnie z kamizelką tylko do 65,1% — różnica mieści się w uproszczeniu. Źródło jest tu niejednoznaczne (audyt kontrolny 1
MER2-09, 09.10.2026): kolumna podaje „of body mass (+ weight vest)”, więc nie wiadomo, czy 65,1% to udział samej masy ciała, czy masy z kamizelką;
liczenie kamizelki w całości jest uproszczeniem, nie wynikiem tego badania.

## 4. Bez udziału (brak e1RM, także z masą ciała) — pytania otwarte

- **Dipy na poręczach (Chest Dip, Dips – Triceps Version, Ring Dips)** — nie znalazłem (08.10.2026) recenzowanego źródła, które definiuje 1RM dipów
  jako masę ciała + dociążenie; badanie gimnastyków (Journal of Exercise Science and Fitness 2026, PMC12925195, PT) mierzy „bar dip 1RM”, ale nie
  podaje, czy z masą ciała. Kalkulatory w sieci są sprzeczne (S5). Do znalezienia: badanie lub przegląd z definicją obciążenia w dipach.
- **Pompki w innych wariantach** (na podwyższeniu, ze stopami wyżej, diamentowe, na kolanach) — udział zależy od pozycji (Wu i in. 2025, PT, za
  García-Massó i in. 2011: ręce wyżej o 60,96 cm „as low as 41% of body mass”, stopy wyżej „up to 74%”; Gouvali 2005: 52,9% na kolanach); bez osobnej
  liczby dla każdego wariantu — brak e1RM.
- **Muscle-up, podciąganie jednorącz, wiosłowanie australijskie, pistolety, nordic curl, ćwiczenia brzucha** — brak źródeł udziału.
- **Ćwiczenia własne** z masą ciała — brak klucza katalogu, więc brak udziału i e1RM.
- **Masa ciała w czasie** — od fali 2 audytu 0.10 aplikacja zapisuje masę ciała z datą (`State.bodyMassLog`, ekran Więcej → Masa ciała); każdy
  trening liczy e1RM z ostatnim pomiarem z tego dnia lub wcześniejszym (sprostowanie 09.10.2026, audyt kontrolny 1 MER2-09 — wcześniej ten punkt
  opisywał jedną masę z Ustawień).
- **Trafność Epleya przy ćwiczeniach z masą ciała** — wzór szacuje 1RM z serii do 10 powtórzeń; badania podciągania (Sánchez-Moreno 2017) mierzyły
  1RM bezpośrednio, nie sprawdzały Epleya. Uproszczenie: ta sama reguła co w ćwiczeniach z ciężarem.

## 5. W kodzie

`lib/stats.ts`: `BW_SHARE` (jedyne miejsce liczb; klucz = `Exercise.libKey`, więc zmiana nazwy ćwiczenia nie zmienia udziału), `bwShare`,
`liftedLoad`, `fmtE1`. Ustawienia: `settings.bodyMass` (kg, opcjonalne, `migrate` odrzuca wartości ≤ 0 i > `BODY_MASS_MAX`, kopia zapasowa je
obejmuje, tylko w telefonie). Teksty: Ustawienia (opis pola), Postępy (notka przy rekordach), ekran ćwiczenia. Testy:
`tests/audit-0.10-stats.test.ts` (E1), `tests/audit-0.10-stats-ui.test.tsx`.
