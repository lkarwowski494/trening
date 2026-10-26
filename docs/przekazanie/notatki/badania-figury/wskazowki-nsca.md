# NSCA Basics of Strength and Conditioning Manual — weryfikacja wskazówek (25.10.2026)

Źródło: Sands, Wurth, Hewit, *NSCA — Basics of Strength and Conditioning Manual*, NSCA 2012, nsca.com
(`/uploadedFiles/NSCA/Resources/PDF/Publications/basics_of_strength_and_conditioning_manual.pdf`; adres potwierdzony
wyszukiwarką, strona i PDF zwracają WebFetch 403). Czytałem wyciąg tekstu przygotowany przez koordynatora (`scratchpad/zrodla/nsca-basics.txt`),
który kończy się na s. 79: brakuje Depth Jump, Box Shuffle, Lateral Box Jump i rozdz. 6 (Safe Training).
Szczegóły (cue → status, strona, krótki cytat): `wskazowki-nsca.json`.

## Szczebel źródła

**Szczebel 4.** To materiał szkoleniowy, nie stanowisko organizacji. Podręcznik jest dla członków stowarzyszonych (list założyciela, s. 5),
a we wstępie (s. 7) autorzy piszą, że nie ma on robić z czytelnika eksperta. Stanowiska NSCA są w nim tylko cytowane w bibliografii, a takie
źródło szczebla 2, zacytowane obok, się nie liczy. Do tego w jednym punkcie podręcznik przeczy badaniu szczebla 3 (kolana a palce).
Liczy się więc jako kolejne niezależne źródło techniki, takie jak ACE czy NASM. Gdy drugim źródłem jest już NSCA (TSAC Report, nsca-coach-7-3),
dochodzi inny zespół autorów, ale ta sama organizacja.

## 1. Weryfikacja słownika

- **Potwierdzone: 109 wskazówek** — 89 wprost, 20 kierunkowo albo przez analogię w tej samej rodzinie (P~). Obejmuje przysiad, przysiad przedni,
  martwy ciąg i RDL, wiosłowania, ściąganie drążka, podciąganie, wyciskanie na płasko i skosie (sztanga i hantle), wyciskanie nad głowę
  i push press, unoszenia w przód, bokiem i w opadzie, uginanie EZ, prostowanie na wyciągu, deski, brzuszki, wykroki, podrzut i skoki.
- **Sprzeczne: 4.**
  1. `sq.kneesPast` — NSCA każe trzymać kolana za palcami (s. 49, 52–53). Rozstrzyga hierarchia: w data.json jest badanie szczebla 3 (Fry 2003) i SBS,
     więc tekst zostaje. NSCA Basics nie wolno używać jako źródła zdań o kolanach względem palców.
  2. `lunge.torso` („Tułów wyprostowany”) — NSCA s. 52–53: przy wykroku tułów pochylony 35–45°, plecy proste. Propozycja: **„Plecy proste przez cały ruch.”**
  3. `pp.dip` („z tułowiem pionowo”) — NSCA s. 43: biodra w tył, tułów lekko w przód. Źródła w data.json nie mówią „pionowo”. Propozycja: **„Ugięcie krótkie, tułów napięty.”**
  4. `row.bbPull` („do dolnej części brzucha”) — NSCA s. 46 i ExRx: górna część brzucha, ACE: pępek. Propozycja: **„Przyciągnij sztangę do brzucha…”** (tak samo `row.dbPull`).
- **Różnice bez sprzeczności z tekstem: 3** — `rdl.depth` (NSCA schodzi do kolan), `curl.bbMove` (NSCA do pełnego zgięcia), `tpd.move` (NSCA start od 90°). Bez zmian.
- **Nowa wskazówka (2 źródła): `lpd.mis.lean`** ✕ „Odchylanie się w tył, żeby ściągnąć drążek.” — ACE #158 Step 2 + NSCA s. 46. Dla ściągania drążka, nie dla podciągania.
- Lepsze drugie źródło: `ur.close`/`ur.elbows` (wiosłowanie pionowe) — NSCA High Pull s. 40 (sztanga blisko ciała, łokcie nad sztangą). To bliższa analogia niż martwy ciąg.

## 2. Otwarte ćwiczenia (69)

**Nowych zestawów: 0.** Żadnego z 69 ćwiczeń podręcznik nie opisuje wprost. Bradford Press, Rack Delivery, Jerk Balance i Carioca mają w nim tylko
dalekie analogie — szczegóły w JSON. Przy okazji: Standing Barbell Press Behind Neck i Alternate Heel Touchers są opisane wprost (s. 42, s. 56),
więc ich zestawy mają teraz źródło bezpośrednie.

## 3. Oddech, tempo, asekuracja — co mówi podręcznik

**Oddech (s. 29, 47–49, 53–55):**
- ogólna zasada: wydech w najtrudniejszym miejscu ruchu, wdech w łatwiejszej fazie (s. 29);
- wstrzymanie oddechu (Valsalva): tylko dla zaawansowanych, na 1–2 s, z ostrzeżeniem przed zawrotami głowy, bardzo wysokim ciśnieniem i omdleniem (s. 29);
- przysiad: wdech i zatrzymanie przed zejściem, wydech przy górze, błąd to wstrzymywanie oddechu przez całe powtórzenia (s. 49);
- wyciskanie: głęboki wdech przed opuszczaniem, wydech przy górze (s. 53–55);
- deski: oddychaj normalnie, nie puszczając napięcia brzucha (s. 47–48).

Wnioski:
1. [OTWARTE] nr 1 („wydech przy wysiłku”) **zamknięte w ograniczonym zakresie**: dwa źródła (NSCA s. 29 i ACE #158) i żadne przeczytane źródło nie przeczy
   w ćwiczeniach izolowanych i na maszynach. Ciężkie boje wielostawowe są wyłączone, bo tam ACE (#135) i NSCA różnią się, a SBS zaleca wstrzymanie oddechu.
2. Valsalva — nie do aplikacji (decyzja właściciela; NSCA opisuje skutki zdrowotne).
3. Tekst dla izometrii potwierdzony trzecim źródłem.

Gotowe teksty: `katy-oddech.json`.

**Tempo:** podręcznik nie podaje liczb. Każe opuszczać ciężar wolno i pod kontrolą (przysiad s. 49, wyciskanie s. 54, wiosłowania s. 45–46),
a przy ćwiczeniach na moc przyspieszać ciężar do maksymalnej prędkości, nad którą się panuje (s. 28). Zgadza się to kierunkowo z ACSM 2009.
**Nowa uwaga do makiety:** przy przysiadzie NSCA mówi, żeby na dole nie odbijać się, nie szarpać i nie zatrzymywać ruchu (s. 49–50),
a przy push press i push jerk — żeby nie robić pauzy na dole ugięcia (s. 43). Pauza 0,5 s na dole w domyślnym tempie animacji (konwencja) jest z tym sprzeczna
w tych ćwiczeniach. Propozycja: dla przysiadów i podrzutów ustawić pauzę na dole na 0 (jedno źródło, ale to tylko ilustracja — nie dodajemy twierdzenia, usuwamy pauzę bez źródła).

**Asekuracja (s. 29–33) — jedno źródło, do aplikacji tylko po znalezieniu drugiego:**
- asekuracji wymagają ćwiczenia nad głową, ze sztangą na plecach lub z przodu barków i nad twarzą (wyciskanie leżąc, prostowanie ramion leżąc);
- przy przysiadzie najlepiej klatka z poprzeczkami bezpieczeństwa ustawionymi na odpowiedniej wysokości;
- ćwiczeń dynamicznych (podrzut, rwanie) się nie asekuruje: trzeba umieć odepchnąć albo upuścić sztangę — z przodu odepchnąć, za głową puścić i odskoczyć w przód;
- przed serią ustala się liczbę powtórzeń i sygnały, a hasło „biorę” (ang. *take it*) oznacza przejęcie sztangi;
- przy hantlach asekuruje się przy nadgarstkach, a przy pulloverze i prostowaniu ramion nad głową — trzymając sam hantel;
- najczęstsza przyczyna urazów na siłowni to potknięcie o talerz na podłodze (s. 29).

[OTWARTE] Drugie źródło dla asekuracji (np. ACE, NSCA Essentials rozdz. o asekuracji — ta sama organizacja, ale inny zespół, albo ACSM's Resources 6e z Dysku).

## Otwarte pytania

1. [OTWARTE] „Kolana schodzą się do środka przy lądowaniu” (s. 63, 77–79) — NASM Tuck Jump i ACE #177 tego nie mają; potrzebne drugie źródło.
2. [OTWARTE] „Bez pauzy na dole ugięcia” jako ✕ dla push press i podrzutów — jedno źródło.
3. [OTWARTE] Asekuracja — drugie źródło.
4. [OTWARTE] Strony 80–100 (Depth Jump, Box Shuffle, Lateral Box Jump, Safe Training) — poprosić o pełny wyciąg.
5. Do decyzji właściciela: poprawki tekstów `lunge.torso`, `pp.dip`, `row.bbPull`/`row.dbPull` (zmiana w pl.json → 36 języków przez tłumacza).
