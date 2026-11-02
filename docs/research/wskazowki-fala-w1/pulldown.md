# Wskazówki techniki — rodzina `pulldown` (fala W1, grupa G6)

- Data: 02.11.2026
- Autor: badacz-merytoryczny (agent)
- Zakres: ćwiczenia rodziny `pulldown` bez własnych wskazówek (Close-Grip Front Lat Pulldown, V-Bar Pulldown, Underhand Lat Pulldown,
  Single Arm Lat Pulldown, Wide-Grip Pulldown Behind The Neck, Full Range-Of-Motion Lat Pulldown) + dopełnienie „Straight Arm Pulldown” (lista `partial`).
- Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1.

Metoda: zasada „wyjątek dla wskazówek techniki” (2 zgodne, niezależne, przeczytane źródła szczebla 4 z różnych organizacji). Wszystkie strony
otwarte 02.11.2026 (WebFetch). ExRx.net: HTTP 403 (sprawdzone 02.11.2026 na CBCloseGripPulldown), web.archive.org zablokowane przez narzędzie —
strony wariantów ExRx nieczytane. Istniejący wpis `exrx-LatissimusDorsi/CBFrontPulldown` (czytany w partii docs/research/27 przez migawkę archiwum)
użyty tylko tam, gdzie już potwierdza to samo zdanie dla „Lat Pulldown”, z dopiskiem „(wariant: chwyt)”.
Dokumentacja innych aplikacji treningowych i serwisy konsumenckie z wyników wyszukiwania — odrzucone (nie są źródłem).

## 1. Tabela ćwiczeń

| Ćwiczenie (klucz katalogu) | Obecny tryb | Wynik | Uwagi |
|---|---|---|---|
| Close-Grip Front Lat Pulldown | general (vpull) | częściowe — gotowe do JSON (bez zdania o szerokości chwytu) | Brak przeczytanego opisu specyficznego dla wąskiego nachwytu; zdania ogólne ściągania potwierdzają ACE (chwyt nieokreślony) i Catalyst (dowolna szerokość chwytu). Zdanie o chwycie → Otwarte. |
| V-Bar Pulldown | general (vpull) | gotowe | Dwa opisy wariantu z uchwytem neutralnym (NFPT — uchwyt V, Catalyst — uchwyt neutralny, zwykle wąski). Punkt końcowy różni się (broda vs górna część klatki) — w zdaniu tylko część wspólna. |
| Underhand Lat Pulldown | general (vpull) | gotowe | Catalyst (strona podchwytu) + NFPT (podchwyt jako odmiana wykonywana tak samo) + ACE (ogólny). |
| Single Arm Lat Pulldown | general (vpull) | gotowe | Eleiko (wariant: klęcząc, jednorącz) + Catalyst (jednorącz). |
| Wide-Grip Pulldown Behind The Neck | general (vpull) | otwarte | Brak przeczytanego opisu techniki (ExRx 403, Catalyst bez strony); NASM odradza wariant — to ocena zdrowotna, nie wskazówka (Otwarte). Uwaga: obecny zestaw ogólny `vpull` nie jest potwierdzony dla tego wariantu. |
| Full Range-Of-Motion Lat Pulldown | general (vpull) | otwarte | Nie znaleziono przeczytanego źródła, które definiuje ten wariant (czym różni się od zwykłego ściągania). |
| Straight Arm Pulldown (dopełnienie) | own, `partial` | gotowe — dopełnienie | Druga wskazówka `sapd.torso` (Eleiko + Catalyst); `sapd.arms` dostaje trzecie źródło (Catalyst). Po integracji można usunąć z listy `partial`. |

## 2. Blok JSON (do `exercises` w `data/zrodla/cues.json`)

Dla „Straight Arm Pulldown” — pełny wpis zastępujący obecny (istniejące `setup`/`move` bez zmian, `tips` uzupełnione).

```json
{
  "Close-Grip Front Lat Pulldown": {
    "setup": [
      {"c": "lpd.thighs", "s": [["ace-158", "Step 1 (wariant: chwyt nieokreślony)"], ["exrx-LatissimusDorsi/CBFrontPulldown", "Preparation (wariant: chwyt szeroki)"]]}
    ],
    "move": [
      {"c": "lpd.pull", "s": [["ace-158", "Step 2 (wariant: chwyt nieokreślony)"], ["catalyst-725", "opis (wariant: chwyt; strona dopuszcza dowolną szerokość chwytu)"]]}
    ],
    "tips": [
      {"c": "lpd.fullStretch", "s": [["ace-158", "Step 4 (wariant: chwyt nieokreślony)"], ["catalyst-725", "opis (powrót do pełnego wyprostu rąk; wariant: chwyt)"]]},
      {"c": "lpd.toChest", "s": [["ace-158", "Step 3 (wariant: chwyt nieokreślony)"], ["catalyst-725", "opis (drążek przy obojczykach; wariant: chwyt)"]]},
      {"c": "lpd.still", "s": [["ace-158", "Step 2 (nie odchylaj się dalej w trakcie ściągania; wariant: chwyt nieokreślony)"], ["catalyst-725", "opis (tułów napięty, bez zaokrąglania i bujania; wariant: chwyt)"]]}
    ],
    "mistakes": []
  },
  "V-Bar Pulldown": {
    "setup": [
      {"c": "lpd.vbarGrip", "s": [["nfpt-vbar-pulldown", "Setup (uchwyt V, ręce nad głową; parafraza)"], ["catalyst-861", "opis (uchwyt neutralny nad głową, zwykle wąsko; parafraza)"]]}
    ],
    "move": [
      {"c": "lpd.vbarPull", "s": [["nfpt-vbar-pulldown", "Movement (w dół, łopatki ściągnięte, barki w dół; parafraza)"], ["catalyst-861", "opis (ściąganie z łopatkami w dół i do tyłu; parafraza)"]]}
    ],
    "tips": [
      {"c": "lpd.fullStretch", "s": [["nfpt-vbar-pulldown", "Return (pełny wyprost rąk nad głową)"], ["catalyst-861", "opis (powrót do pełnego wyprostu rąk)"]]},
      {"c": "lpd.still", "s": [["nfpt-vbar-pulldown", "Training Tips; Common Mistakes (Rocking)"], ["catalyst-861", "opis (tułów napięty, plecy neutralnie)"]]}
    ],
    "mistakes": [
      {"c": "lpd.mis.shrug", "s": [["nfpt-vbar-pulldown", "Common Mistakes (Shoulder shrugging)"], ["nasm-lpd-biomech", "FAQ — common mistakes (shrugging the shoulders; wariant: chwyt ogólnie)"]]}
    ]
  },
  "Underhand Lat Pulldown": {
    "setup": [
      {"c": "lpd.thighs", "s": [["ace-158", "Step 1 (wariant: chwyt nieokreślony)"], ["exrx-LatissimusDorsi/CBFrontPulldown", "Preparation (wariant: chwyt szeroki)"]]},
      {"c": "lpd.underhand", "s": [["catalyst-876", "opis (podchwyt, dłonie odwrócone; parafraza)"], ["nfpt-vbar-pulldown", "Training Tips (drążek podchwytem jako odmiana wykonywana tak samo)"]]}
    ],
    "move": [
      {"c": "lpd.pull", "s": [["ace-158", "Step 2 (wariant: chwyt nieokreślony)"], ["catalyst-876", "opis (do górnej części klatki)"]]}
    ],
    "tips": [
      {"c": "lpd.toChest", "s": [["ace-158", "Step 3 (wariant: chwyt nieokreślony)"], ["catalyst-876", "opis (drążek przy obojczykach)"]]},
      {"c": "lpd.fullStretch", "s": [["ace-158", "Step 4 (wariant: chwyt nieokreślony)"], ["catalyst-876", "opis (powrót do pełnego wyprostu rąk nad głową)"]]}
    ],
    "mistakes": []
  },
  "Single Arm Lat Pulldown": {
    "setup": [
      {"c": "lpd1.setup", "s": [["eleiko-659827ed", "Setup (wariant: klęcząc; uchwyt, ręka wyprostowana nad głową)"], ["catalyst-895", "opis (uchwyt jedną ręką, ręka wyprostowana nad głową)"]]}
    ],
    "move": [
      {"c": "lpd1.pull", "s": [["eleiko-659827ed", "Procedure (dłoń do przodu barku, powrót nad głowę; wariant: klęcząc)"], ["catalyst-895", "opis (uchwyt w stronę barku, powolny powrót)"]]}
    ],
    "tips": [
      {"c": "lpd1.blade", "s": [["eleiko-659827ed", "Coaching points (zacznij od ściągnięcia łopatek w tył i w dół)"], ["catalyst-895", "opis (ściąganie łopatki w dół i do tyłu)"]]},
      {"c": "lpd.still", "s": [["eleiko-659827ed", "Procedure (tułów nieruchomo)"], ["catalyst-895", "opis (tułów napięty, plecy neutralnie)"]]}
    ],
    "mistakes": []
  },
  "Straight Arm Pulldown": {
    "setup": [
      {"c": "sapd.setup", "s": [["ace-334", "opis (wyciąg w najwyższym położeniu, drążek; parafraza)"], ["eleiko-659842f4", "Setup (bloczek na wysokości głowy, ręce proste; parafraza)"]]}
    ],
    "move": [
      {"c": "sapd.move", "s": [["ace-334", "opis (proste ręce, dłonie do przodu pasa, powolny powrót; parafraza)"], ["eleiko-659842f4", "Procedure (drążek w stronę ud prostymi rękami, powrót pod kontrolą; parafraza)"], ["eleiko-6598447e", "(wariant: uchwyty) Procedure"]]}
    ],
    "tips": [
      {"c": "sapd.arms", "s": [["ace-334", "opis (ręce proste przez cały ruch; parafraza)"], ["eleiko-659842f4", "Procedure (ręce proste; parafraza)"], ["eleiko-6598447e", "(wariant: uchwyty) Procedure"], ["catalyst-907", "opis (ręce wyprostowane przez całe powtórzenie)"]]},
      {"c": "sapd.torso", "s": [["eleiko-659842f4", "Procedure (keep your torso still)"], ["catalyst-907", "opis (brzuch napięty, tułów stabilny)"]]}
    ],
    "mistakes": []
  }
}
```

Uwaga do „Close-Grip Front Lat Pulldown”: każde zdanie ma 2 źródła, ale żadne nie opisuje wąskiego chwytu wprost (ACE nie podaje szerokości,
Catalyst dopuszcza dowolną). Jeśli koordynator uzna to za za słabe dla wariantu — przenieść do „Otwarte” (wtedy zostaje zestaw ogólny albo tryb open).

## 3. Nowe źródła

| id | org | tytuł | url | szczebel | czytane |
|---|---|---|---|---|---|
| catalyst-725 | Catalyst Athletics | Lat Pulldown | https://www.catalystathletics.com/exercise/725/Lat-Pulldown/ | 4 | 02.11.2026 |
| catalyst-861 | Catalyst Athletics | Neutral-Grip Lat Pulldown | https://www.catalystathletics.com/exercise/861/Neutral-Grip-Lat-Pulldown/ | 4 | 02.11.2026 |
| catalyst-876 | Catalyst Athletics | Reverse-Grip Lat Pulldown | https://www.catalystathletics.com/exercise/876/Reverse-Grip-Lat-Pulldown/ | 4 | 02.11.2026 |
| catalyst-895 | Catalyst Athletics | Single-Arm Pulldown | https://catalystathletics.com/exercise/895/Single-Arm-Pulldown/ | 4 | 02.11.2026 |
| catalyst-907 | Catalyst Athletics | Straight-Arm Pulldown | https://www.catalystathletics.com/exercise/907/Straight-Arm-Pulldown/ | 4 | 02.11.2026 |
| eleiko-659827ed | Eleiko | Cable Pulldown – Kneeling, 1-Arm | https://eleiko.inspire360.com/resource/659827ede629c99e2b085e81 | 4 | 02.11.2026 |
| nfpt-vbar-pulldown | NFPT | How to Do a Close Grip V-Bar Lat Pulldown (M. Rogers, 11.08.2025) | https://nfpt.com/close-grip-lat-pulldown-v-bar | 4 | 02.11.2026 |
| nasm-lpd-biomech | NASM | The Biomechanics of the Lat Pulldown: Muscles, Grips, and Form (blog) | https://www.nasm.org/resource-center/blog/training/the-biomechanics-of-the-lat-pulldown-muscles-grip-and-form | 4 | 02.11.2026 |

Nowe organizacje (propozycja szczebla — do akceptacji koordynatora):
- **Catalyst Athletics** (catalystathletics.com, biblioteka ćwiczeń zespołu trenerskiego Grega Everetta, autora podręczników podnoszenia ciężarów) —
  proponowany szczebel 4, rodzaj „serwis specjalistyczny”. Niezależna od ACE, NASM, Eleiko, NFPT.
- **NFPT** (National Federation of Professional Trainers — organizacja certyfikująca trenerów) — proponowany szczebel 4, „organizacja szkoleniowa”.
  Artykuł autorski na blogu, nie biblioteka ćwiczeń.
- NASM — organizacja już w rejestrze; nowe tylko źródło (artykuł blogowy, a nie biblioteka ćwiczeń).

## 4. Nowe zdania

| id | PL | EN (propozycja) | źródła |
|---|---|---|---|
| lpd.still | Tułów stabilny — bez bujania. | Keep your torso steady — no swinging. | ACE 158 Step 2; Catalyst 725/861/895; NFPT (Rocking); Eleiko 659827ed |
| lpd.vbarGrip | Chwyć uchwyt V oburącz; ręce wyprostowane nad głową. | Grab the V-handle with both hands, arms straight overhead. | NFPT (Starting position); Catalyst 861 |
| lpd.vbarPull | Ściągnij uchwyt w dół przed twarzą, ściągając łopatki w dół i do tyłu. | Pull the handle down in front of your face, drawing your shoulder blades down and back. | NFPT (Movement); Catalyst 861 |
| lpd.underhand | Chwyć drążek podchwytem — dłonie zwrócone do siebie. | Take an underhand grip on the bar — palms facing you. | Catalyst 876; NFPT (Training Tips) |
| lpd.mis.shrug | Barki uciekają w górę, do uszu. | Shoulders creeping up toward your ears. | NFPT (Common Mistakes); NASM biomech (FAQ) |
| lpd1.setup | Chwyć uchwyt jedną ręką; ręka wyprostowana nad głową. | Hold the handle in one hand, arm straight overhead. | Eleiko 659827ed (Setup); Catalyst 895 |
| lpd1.pull | Ściągnij uchwyt w dół do barku; wróć powoli do wyprostu ręki. | Pull the handle down to your shoulder; return slowly until your arm is straight. | Eleiko 659827ed (Procedure); Catalyst 895 |
| lpd1.blade | Zacznij ruch od ściągnięcia łopatki w dół i do tyłu. | Start by drawing your shoulder blade down and back. | Eleiko 659827ed (Coaching points); Catalyst 895 |
| sapd.torso | Napnij brzuch; tułów zostaje nieruchomo. | Brace your abs; your torso stays still. | Eleiko 659842f4 (Procedure); Catalyst 907 |

Istniejące zdania użyte ponownie: `lpd.thighs`, `lpd.pull`, `lpd.fullStretch`, `lpd.toChest`, `sapd.setup`, `sapd.move`, `sapd.arms`.
Nowe zdania wymagają wpisu w rejestrze twierdzeń (`node scripts/claims.mjs --stub`) przy integracji.

## 5. Otwarte

1. **Wide-Grip Pulldown Behind The Neck** — brak przeczytanego opisu techniki z dwóch organizacji (ExRx 403; Catalyst wymienia wariant tylko
   w liście programowej, bez opisu; NASM nie opisuje techniki). NASM (artykuł o biomechanice, sekcja „Common Compensations”) pisze, że ten wariant
   „is generally best avoided” — to ocena ryzyka (twierdzenie zdrowotne), nie wskazówka techniki; wymaga zasad szczebla 1–2, nie wpisywać do karty.
   Obecny zestaw ogólny `vpull` dla tego ćwiczenia nie jest potwierdzony żadnym przeczytanym źródłem dla wariantu zza karku (prowadzenie drążka
   za głowę zamiast do klatki) — rekomendacja: zestaw ogólny dla tego wariantu przejrzeć (zdania „do klatki” byłyby błędne).
2. **Full Range-Of-Motion Lat Pulldown** — nie znaleziono przeczytanego źródła, które definiuje ten wariant; bez definicji nie da się potwierdzić,
   czym karta ma się różnić od „Lat Pulldown”.
3. **Close-Grip Front Lat Pulldown — zdanie o wąskim nachwycie** (np. „chwyć drążek nachwytem węziej niż barki”) — brak dwóch przeczytanych opisów
   wariantu (ExRx CBCloseGripPulldown: 403).
4. **V-Bar Pulldown — punkt końcowy:** NFPT — uchwyt do wysokości brody; Catalyst 861 — do górnej części klatki. Sprzeczność na tym samym szczeblu;
   w karcie tylko część wspólna („w dół przed twarzą”). Dlatego `lpd.toChest` i `lpd.pull` („do górnej części klatki”) NIE są w karcie V-Bar.
5. **Liczby pominięte:** NFPT podaje czas powrotu 2–3 s — liczba z jednego źródła szczebla 4; nie wpisano. NFPT łączy błędy z „poważnym urazem” —
   twierdzenie zdrowotne, nie wpisano.
6. **Szczebel nowych organizacji** (Catalyst Athletics, NFPT) — do akceptacji koordynatora; bez akceptacji karty V-Bar, Underhand, Single Arm
   i dopełnienie Straight Arm wracają do „Otwarte” (zostaje po jednym źródle z rejestru).

## 6. Stan

Rodzina `pulldown` zakończona w zakresie dostępnych źródeł. Pułapki: exrx.net 403, web.archive.org zablokowane; strony ACE #35 (Kneeling Lat
Pulldown) zwracają tylko metadane (brak kroków); `nfpt.com/?p=8954` przekierowuje na inny artykuł — używać adresu `nfpt.com/close-grip-lat-pulldown-v-bar`.
