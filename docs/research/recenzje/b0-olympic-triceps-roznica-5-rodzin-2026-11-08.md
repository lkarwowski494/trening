# Recenzja niezależna bramki 4 — figury/nakladka-b0 (08.11.2026)

Recenzent: audytor (L-047: autor = programista B0, zmiana d5a56f5f; recenzent nie pisał zmiany). Zakres: HEAD 4f61b9cd vs baza c1d32a3a (integracja-1-1).
Worktree /home/user/wt-b0 nie był zmieniany (git status czysty, HEAD 4f61b9cd).

## Werdykt per rodzina

| Rodzina | Skrót przed → po | Werdykt | Ruch/ślad równe | Nakładka równa |
|---|---|---|---|---|
| squat | 855f7f1ea076 → 6913ea2e7f22 | wyswietlana (różnica) | 25/25 | 25/25 |
| bench_press | 25bc1d569a23 → c539a334eb2d | wyswietlana (różnica) | 30/30 | 30/30 |
| hinge | cb535fbface9 → bcc5dcf3b9f7 | wyswietlana (różnica) | 32/32 | 32/32 |
| pull_up | 2f2ae15ced62 → 39a3824aab23 | wyswietlana (różnica) | 11/11 (13 przypisanych, 2 bez rysunku) | 11/11 |
| curl | 820aababfaea → 832a9e774afe | wyswietlana (różnica) | 34/34 (36 przypisanych, 2 bez rysunku) | 34/34 |
| olympic | e60ce57af368 → dfabbebac8da | wyswietlana (pełna recenzja nakładki) | 24/24 | zmieniona w 13 ćw. (zamierzone) |
| triceps | 268d147c860d → a4b978a832e0 | wyswietlana (pełna recenzja nakładki) | 29/29 | zmieniona w 26 ćw. (zamierzone) |

Znaleziska KRYTYCZNE/WYSOKIE: **brak**. Nic w nakładce nie przeczy karcie.

## Znaleziska (od najpoważniejszego)

| ID | Poziom | Pewność | Realność | Opis | Dowód |
|---|---|---|---|---|---|
| N1 | NISKIE | 90% | realny (widać przy każdym odtworzeniu) | Barbell Snatch, Hang Snatch: linia piszczeli (olympicBarCloseRef, oly.close) i linia uda (olympicKneeLimb, oly.legs) są obie przedłużone za kolano i w kadrach wyprostu (u 0,40–0,80) krzyżują się w wąskie „X” na kolanie — bałagan, nie błąd treści. | /home/user/stan-b0/arkusze/olympic/Barbell-Snatch-side.png (kadry u 0,40–0,80); wycinek 3:1 /home/user/stan-b0/audytor/kadry/snatch-zoom.png |
| N2 | NISKIE | 85% | realny | olympicBarCloseRef (linia piszczeli) jest rysowana przez całe powtórzenie, także w odbiorze na barkach i nad głową, gdzie zdanie „Sztanga blisko ciała przez cały ciąg” już nie dotyczy. Element statyczny, nie przeczy zdaniu; ten sam wzór co inne linie odniesienia. | /home/user/stan-b0/arkusze/olympic/Split-Snatch-side.png, Clean-side.png (u 0,6–1) |
| N3 | NISKIE (proces) | 95% | teoretyczny dla treści, wpływa tylko na skrót | Normalizacja overlay.ts (`bezObcychNakladek`, scripts/skrot-v2-norm.mjs) zostawia przecinek po ostatnim własnym wpisie, gdy obce wpisy są za nim: dla pull_up `{ squat: …, hinge: …, pull_up: PULL_UP_TECHNIQUE, }` vs wcześniej `… PULL_UP_TECHNIQUE }`. Dopisanie rodziny na końcu TECHNIQUE zmienia więc skrót pull_up, wbrew intencji decyzji 1A. Tu bez skutku (skrót i tak zmienił reguly-cwiczen.json). Również: wspólny reguly-cwiczen.json w skrócie każdej rodziny powoduje, że dodanie rodziny unieważnia recenzje wszystkich — znane autorowi (tests/recenzja-wyjatki-1-1.json). | /home/user/stan-b0/audytor/ov-pull_up-c1d.ts vs ov-pull_up-4f6.ts (linia 38) |

Uwaga bez progu: Triceps Pushdown / Reverse Grip — linia ramienia i pion barku biegną blisko siebie (para identyczna jak curlElbowLimb + curlElbowPlumb w curl, przyjęta wcześniej). /home/user/stan-b0/audytor/kadry/tpd.png.

## 1. olympic i triceps — ruch, ślad, nakładka

Arkusze autora (/home/user/stan-b0/arkusze/{olympic,triceps}) odtworzone z czystej kopii `git archive 4f61b9cd` (`scripts/figures/arkusz-nakladka.mjs --family olympic --family triceps`, /home/user/stan-b0/audytor/arkusze): **HTML 53/53 bajtowo równe** arkuszom autora. Motyw ciemny: Power Clean, Triceps Pushdown (/home/user/stan-b0/audytor/arkusze-dark). Obejrzane w pełnej rozdzielczości / wycinkach (/home/user/stan-b0/audytor/kadry).

Ruch i ślad: md5 (shapesAt bez i z mięśniami, contactShapes, badgesFor, trailFor; u co 1/8; każdy błąd) równy z bazą — olympic 24/24, triceps 29/29. Ruch jest więc ten sam co w recenzjach r4–r7 (olympic) i r2 (triceps); zmienia się wyłącznie nakładka.

Nakładka w aplikacji (ścieżka techniquesOf/guidesOf/onDrawingCues, kopia 4f61b9cd z przywróconą listą v2; skrypt /home/user/stan-b0/audytor/skrypty/widoczne.mjs):
- olympic, 13 ćwiczeń z elementem: oly.close → linia piszczeli przedłużona za kolano (13 ćw.); oly.legs → łuk kolana tylko przy mierzonym kolanie (Barbell Snatch, Hang Snatch), łuk biodra przy mierzonym biodrze (Clean, Power Clean, Power Snatch, Snatch Pull); oly.back → linia miednica–bark (Block Power Snatch). VoiceOver „Na rysunku” wymienia tylko zdania widocznych elementów (Block Power Snatch bez oly.legs — poprawnie). Rysunek zgodny ze zdaniami: na starcie gryf przed piszczelą tuż przy linii; łuk kolana/biodra prostuje się w drugim ciągu. Brak błędów pozy w rodzinie (errorsOf puste). Clean Shrug, Snatch Shrug — rysunek wstrzymany (V2_WSTRZYMANE), w aplikacji bez elementów.
- triceps, 26 ćwiczeń z elementem: tricepsElbowLimb (linia ramienia + łuk łokcia) przy zdaniach „Zginaj/Prostuj łokcie…”; mierzony staw = łokieć we wszystkich 29; łuk maleje do wyprostu w każdym arkuszu (np. Pushdown 99°→24°, Tate Press 145°→0°, Overhead hantel 120°→17°). tricepsElbowPlumb przy Triceps Pushdown i Reverse Grip Pushdown (tpd.elbows „Łokcie przy bokach”) — łokieć przez cały ruch przy pionie. Bez elementu: Cable Incline, Kneeling Cable, Machine Triceps Extension (zestaw ogólny bez zdania ruchu). Tate Press: łuk w rzucie z boku to rzut zgięcia przy łokciach na boki — kierunkowo zgodny z tate.move.
- Testy autora: tests/figures-v2-nakladka-kazda-rodzina.test.tsx i tests/figures-v2-nakladka-triceps-olympic.test.tsx — 30/30 zielone (uruchomione w /home/user/wt-b0).

## 2. Różnica 5 rodzin — metoda i liczby

Czyste kopie: `git archive c1d32a3a` → /home/user/stan-b0/audytor/kopia-c1d, `git archive 4f61b9cd` → kopia-4f6 (node_modules jako dowiązanie do /home/user/wt-b0/node_modules); kopia-4f6-v2 = kopia-4f6 z listą v2 w lib/figures/data.json przywróconą do 7 rodzin (w HEAD lista jest pusta — fail-closed do recenzji, zamierzone; bez tego ścieżka aplikacji techniquesOf zwraca [] i porównanie nakładki „w aplikacji” byłoby fałszywie różne).

a) Składniki skrótu (/home/user/stan-b0/audytor/skrypty/pliki-skrotu.mjs → skrot-c1d.json, skrot-4f6.json; pliki rodziny, nakładki i V2_WSPOLNE po normalizujPlikV2 + wynik doboru): dla squat, bench_press, hinge, curl różni się **tylko** lib/figures/v2/reguly-cwiczen.json; dla pull_up — reguly-cwiczen.json i overlay.ts (wyłącznie artefakt przecinka, N3). W reguly-cwiczen.json wpisy 5 rodzin są równe (JSON), dopisane tylko klucze olympic (23) i triceps (29). Skróty wyliczone przez skrypt = skróty szkieletów.

b) Rysunek (/home/user/stan-b0/audytor/skrypty/md5-rysunek.mjs → md5-c1d.json, md5-4f6-v2.json): ruch, ślad, linie+nakładka (dobór surowy i ścieżka aplikacji), dobór i VoiceOver — squat 25/25, bench_press 30/30, hinge 32/32, pull_up 11/11, curl 34/34 równe we wszystkich składnikach.

Inne pliki w diff: lib/figures/data.json (tylko lista v2 → pusta), tests/recenzja-wyjatki-1-1.json (7 rodzin na liście wyjątków), scripts/figures/arkusz-nakladka.mjs (narzędzie, poza aplikacją), dokumenty i pliki generowane.

## 3. Wpisy

/home/user/stan-b0/audytor/wpis-{squat,bench_press,hinge,pull_up,curl,olympic,triceps}.json — `node scripts/recenzja-szkielet.mjs --sprawdz` = „komplet” dla wszystkich 7.
- v2: wypełnione (werdykt wyswietlana, data 2026-11-08, autor „programista B0 (figury/nakladka-b0 @ d5a56f5f)”, recenzent „audytor”, slad, uwagi).
- v1 (27), karty (73), zestawy (110 z 112; pozostałe 2 niżej): skróty bez zmian względem docs/research/figury-recenzja.json — wpisy przeniesione bez zmian (data/autor/recenzent oryginalnej recenzji; nie przypisuję sobie recenzji treści kart).
- zestawy Clean Shrug i Snatch Shrug (olympic): bez wpisu już w bazie; rysunek wstrzymany do kart T2. Wpisane jako „do poprawy” (fail-closed, stan w aplikacji bez zmian), z powodem — nie są przyjęte w tej rundzie. Przepisujący może je pominąć, jeśli strażniki bramki 4 ich nie wymagają.

## Sprawdzone obszary bez znalezisk
- Dane i migracje, import/kopia, prywatność i sekrety: diff nie dotyka danych użytkownika, magazynu ani sieci; brak sekretów i danych osobowych w diff.
- Dostępność: etykieta „Na rysunku” (onDrawingCues) wymienia tylko zdania widocznych elementów (olympic, triceps); 5 rodzin bez zmian.
- Liczby i twierdzenia: brak nowych liczb w UI; kąty w podpisie arkusza to narzędzie recenzji. Przypisania lokiec_prostuje_sie zatwierdził badacz (/home/user/stan-b0/badacz/recenzja-badacza.md) — nie powtarzane.
- Ryzyko Apple: brak.
