# Oddech i tempo w animacji figur — wnioski (25.10.2026)

Dotyczy makiety: domyślne tempo `[2.0, 0.5, 1.0, 0.5]` (ekscentryczna, pauza na dole, koncentryczna, pauza na górze; l. 1001),
izometria `[2,2,2,0]` z cyklem oddechu 4 s „WDECH/WYDECH” (l. 1121–1127), etykiety faz „IN” (ekscentryczna) i „EX” (koncentryczna)
(l. 1143, 1153), komunikaty głosowe „Dół / Trzymaj / Góra”.

## 1. Tempo — co jest ustalone

| Twierdzenie | Źródło (przeczytane 25.10.2026) | Pewność |
|---|---|---|
| Dla siły (początkujący i średniozaawansowani) zalecane umiarkowane tempo, ok. 1–2 s faza koncentryczna i 1–2 s ekscentryczna | ACSM Position Stand 2009, Progression Models in Resistance Training for Healthy Adults, Med Sci Sports Exerc 41(3):687–708, doi 10.1249/MSS.0b013e3181915670 — streszczenie (Europe PMC): „performed at a moderate contraction velocity (1-2 s CON; 1-2 s ECC)” | **ustalone** (stanowisko organizacji, szczebel 2, wprost) |
| Dla przerostu mięśni szeroki zakres czasu powtórzenia daje podobne efekty | Schoenfeld, Ogborn, Krieger 2015, Sports Med 45:577–585, PMID 25601394 (metaanaliza) — wyniki: „hypertrophic outcomes are similar when training with repetition durations ranging from 0.5 to 8 s”; wnioski: „training at volitionally very slow durations (>10s per repetition) is inferior from a hypertrophy standpoint” | **ustalone** (metaanaliza, wprost) |
| Zapis tempa czterema liczbami: ekscentryczna / przejście / koncentryczna / przejście | Wilk, Zajac, Tufano 2021, Sports Med, https://pmc.ncbi.nlm.nih.gov/articles/PMC8310485/ (przegląd), Introduction: „where each digit defines the duration of a particular phase of the movement” (przykład 2/0/3/0) | ustalone jako **konwencja zapisu** |
| Wolniejsza faza ekscentryczna bywa korzystna | Wilk i in. 2021, Conclusions: „it seems that the most favorable is a combination of slower movement in the eccentric phase” | jedno źródło (przegląd narracyjny, sformułowanie ostrożne) |

Wniosek dla makiety: **2 s w dół, 1 s w górę mieści się w zaleceniu ACSM (1–2 s każda faza) i w zakresie metaanalizy (0,5–8 s
na powtórzenie: tu 4 s z pauzami)**. Pauzy 0,5 s — **konwencja** (brak źródła dla tej liczby). W aplikacji: tempo animacji to
„tempo ilustracyjne”, nie zalecenie; jeśli użytkownik ma w ćwiczeniu własne tempo (pole „Tempo (opcjonalnie, np. 3-1-1)” już
istnieje w app/exercise/[id].tsx), animacja może je odtworzyć. Uwaga: w aplikacji jest format trzyczłonowy (3-1-1), w makiecie
czteroczłonowy — ujednolicić (decyzja produktowa).

Tekst dla użytkownika (propozycja): **„Tempo na rysunku: ok. 2 s w dół, 1 s w górę. Ruch kontrolowany — dokładne tempo możesz ustawić sam.”**
Twierdzenie: umiarkowane tempo 1–2 s na fazę (ACSM 2009); szeroki zakres czasu powtórzenia równie skuteczny dla masy (Schoenfeld 2015).

Animacja „Dół / Góra” głosem — bez zastrzeżeń merytorycznych (opis faz). Zdarzenie „Szczyt napięcia” w etykiecie pauzy
(l. 1147: „Izometria: Szczyt napięcia”) — twierdzenie fizjologiczne bez źródła → zmienić na „Pauza”.

## 2. Oddech — co jest ustalone, a co nie

| Twierdzenie | Źródła | Ocena |
|---|---|---|
| W izometrii (deska, wall sit, dead bug) nie wstrzymuj oddechu, oddychaj normalnie | `plank.mis.breath` (NASM Plank — Common Mistakes; ACE Front Plank #32 — Step 2), `db.slow` — docs/research/27 | **potwierdzone** (2 źródła szczebla 4) — dla tych ćwiczeń; dla innych izometrii analogia |
| Wydech w fazie wysiłku (koncentrycznej), wdech przy opuszczaniu — jako ogólna reguła | ACE Seated Lat Pulldown #158, Step 2: „Slowly exhale and initiate the downward pull” (przeczytane 25.10.2026; szczebel 4). AHA 2007 (Williams i in., Circulation 116:572, PMID 17638929) zawiera według streszczeń wtórnych zalecenie wydechu przy wysiłku — **nieprzeczytane** (403), nie liczy się. AHA 2023 (Paluch i in., Circulation 2024, PMC11209834 — przeczytane) mówi tylko o „proper breathing techniques”, bez opisu | **[OTWARTE]** — jedno źródło szczebla 4; sprzeczne z SBS (niżej) |
| Przy ciężkich bojach wstrzymanie oddechu / manewr Valsalvy dla usztywnienia tułowia | SBS How to Bench (Ascent): „Hold your breath throughout the duration of the rep.”; SBS How to Squat (Bracing) — Valsalva jako sposób zwiększenia ciśnienia w jamie brzusznej (przeczytane 25.10.2026, szczebel 4). Hackett, Chow 2013, JSCR, PMID 23222073 (przegląd, streszczenie): „The VM effectively increases IAP, which may assist with spine stability and trunk rigidity during resistance exercise.”; „The health risks associated with the VM during resistance exercise remain unconfirmed.”; „resistance trainers are often advised to avoid the VM”. Blazek i in. 2021, Biol Sport 38(3):445–450, https://pmc.ncbi.nlm.nih.gov/articles/PMC8329978 (szczebel 3): „The VM is not avoidable during a lift above 80% of 1RM.” | sprzeczność na szczeblu 3–4 i temat z pogranicza zdrowia (ciśnienie) → **nie do aplikacji jako instrukcja** |

Część wspólna źródeł: (1) przy lżejszej pracy i w izometrii — oddychać, nie wstrzymywać oddechu; (2) przy ciężarach bliskich
maksymalnym część źródeł zaleca krótkie wstrzymanie oddechu dla usztywnienia tułowia, a część — „często się zaleca” unikać;
(3) skutki zdrowotne nie są potwierdzone (Hackett 2013). Osoby z nadciśnieniem, chorobą serca, w ciąży → to sprawa lekarza
(aplikacja nie udziela porad medycznych).

Wniosek dla makiety:
- **Usunąć automatyczne etykiety „IN/EX” i cykl „WDECH/WYDECH” 4 s** — to konwencja bez źródła szczebla 1–2, a dla ciężkich bojów
  sprzeczna z częścią źródeł. 4-sekundowy cykl oddechu w izometrii nie ma żadnego źródła.
- Zostawić tylko sprawdzone: przy deskach/izometrii zdanie „Oddychaj normalnie, nie wstrzymuj oddechu.” (istniejące `wall.breath`,
  `plank.mis.breath`).
- Jeśli właściciel chce „oddech” w animacji: opcja „wydech przy wysiłku” tylko jako **konwencja** z etykietą, bez zastosowania do
  ciężkich bojów (przysiad, martwy ciąg, wyciskanie) — po potwierdzeniu w źródle szczebla 2 (niżej).

Tekst dla użytkownika (izometria): **„Oddychaj spokojnie — nie wstrzymuj oddechu.”**

## 3. Do potwierdzenia w ACSM's Resources for the Personal Trainer 6e (Dysk właściciela; nie czytałem)

1. Rozdział o technice ćwiczeń oporowych / wskazówkach bezpieczeństwa: zalecenie dotyczące oddychania (wydech przy wysiłku?
   manewr Valsalvy — kiedy unikać, kiedy dopuszczalny?). Jeśli jest wprost — razem z ACE daje 2 niezależne źródła (szczebel 3 + 4).
2. Rozdział o programowaniu treningu oporowego: tempo/prędkość powtórzeń dla początkujących (czy powtarza 1–2 s ACSM 2009, czy
   podaje np. „2 s w górę, 2–4 s w dół”).
3. Opis techniki wyciskania leżąc i pompki: kąt łokci (pkt 1.3 audytu).

Inne źródła szczebla 2, których nie udało się przeczytać (paywall/403) i które warto zdobyć: Williams i in. 2007 (AHA), Garber i in.
2011 (ACSM Position Stand, MSSE 43:1334), Fragala i in. 2019 (NSCA, trening oporowy osób starszych), NSCA Essentials (rozdz. o technice
— oddychanie).

## 4. Otwarte

1. [OTWARTE] Reguła „wydech przy wysiłku” — potrzebne drugie niezależne źródło (najlepiej szczebel 2).
2. [OTWARTE] Valsalva — czy aplikacja w ogóle ma o tym mówić (rekomendacja: nie; ewentualnie odesłanie do lekarza przy nadciśnieniu).
3. [OTWARTE] Format tempa: 3 liczby (aplikacja) vs 4 (makieta, przegląd Wilka) — decyzja produktowa.
