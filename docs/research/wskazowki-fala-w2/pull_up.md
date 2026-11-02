# Wskazówki techniki — rodzina `pull_up` (fala W2, grupa G6)

- Data: 02.11.2026; fala W2; autor: badacz-merytoryczny (agent).
- Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1. Rodzina ma status `ready` — karta własna liczy się tylko z błędem.
- Co zrobiono: drugie źródła szczebla 4 dla Dead Hang i Scapular Pull-Up (GORNATION, Fitness Volt z autorem) → dwie nowe karty z błędami; błąd wnioskowany dla Rope Climb (karta W1 bez błędów); Muscle Up — ponowna próba (częściowe, poza blokiem). Pull Up, Chin Up, Neutral Grip Pull Up mają już błąd (E1) — bez zmian. Wszystkie strony z tabeli źródeł otwarte WebFetch 02.11.2026.

## Tabela ćwiczeń

| Klucz | Tryb dziś | Wynik W2 | Uwagi |
|---|---|---|---|
| Dead Hang | general (`npu.hang` — zdanie o uchwytach, błędne dla drążka, W1 sekcja 1) | gotowe (ustawienie + ruch + wskazówka + 2 błędy) | BarBend (2 artykuły = 1 organizacja) + GORNATION. Szerokość chwytu: część wspólna („na szerokość barków albo trochę szerzej”). Proste ręce wprost tylko GORNATION; BarBend — nazwa ćwiczenia (zwis), nie przeczy |
| Scapular Pull-Up | general | gotowe (ustawienie + ruch + 1 błąd) | Fitness Volt (autor ACE) + GORNATION. Pozycja startowa łopatek sprzeczna (niżej) — karta jej nie przesądza |
| Rope Climb | open (karta W1 bez błędów, bez rysunku) | tylko błąd wnioskowany dopisany | `rope.mis.arms` — wniosek z `rope.legs` |
| Muscle Up | open | częściowe (open) — poza blokiem | BarBend + GORNATION (oba: drążek) potwierdzają `mu.transition`, `mu.press`; brak zdania ustawienia; katalog opisuje wersję na kółkach (W1) |
| Pull Up, Chin Up, Neutral Grip Pull Up | own (E1) | bez zmian | mają już `pu.partial` |
| Gironda Sternum Chins, Mixed Grip Chin, One Arm Chin-Up, Wide-Grip Rear Pull-Up, Side To Side Chins, Gorilla Chin/Crunch | general | otwarte | nie badane ponownie w W2 (W1 wyczerpała dostępne źródła; One Arm — nadal jedno źródło GORNATION) |

### Blok do wdrożenia

```json
{
  "Dead Hang": {
    "setup": [
      {"c": "hang.grip", "s": [["barbend-grip-exercises", "How to Do the Dead Hang (hands slightly wider than shoulder-width apart)"], ["gornation-dead-hang", "instrukcja (Grab the Pull Up Bar shoulder-width apart; arms fully extended)"]]}
    ],
    "move": [
      {"c": "hang.shoulders", "s": [["barbend-grip-exercises", "How to Do the Dead Hang (active shoulders, pulled down and away from your ears)"], ["gornation-dead-hang", "Common mistakes: Passive shoulders (engage them slightly down and back)"]]}
    ],
    "tips": [
      {"c": "hang.tight", "s": [["barbend-grip-exercises", "How to Do the Dead Hang (Maintain a tight core)"], ["gornation-dead-hang", "instrukcja (keep your core tight); Common mistakes: Swinging legs (Keep your body stable)"]]}
    ],
    "mistakes": [
      {"c": "hang.noSwing", "s": [["gornation-dead-hang", "Common mistakes: Swinging legs"], ["barbend-women-pull-up", "Dead hang (You want to avoid swinging) — standard"]]},
      {"c": "hang.mis.shrug", "s": [["gornation-dead-hang", "Common mistakes: Passive shoulders (shoulders shrug fully up)"], ["barbend-grip-exercises", "How to Do the Dead Hang (shoulders pulled down and away from your ears) — standard"]]}
    ]
  },
  "Scapular Pull-Up": {
    "setup": [
      {"c": "hang.grip", "s": [["fitnessvolt-scap-pull-up", "instrukcja (overhand grip, roughly shoulder-width apart or a few inches wider)"], ["gornation-scapular-pull-up", "pozycja startowa (shoulder-width grip, hang fully extended)"]]}
    ],
    "move": [
      {"c": "scap.pull", "s": [["fitnessvolt-scap-pull-up", "instrukcja (Pull your shoulder blades back and pull down on the bar; Slowly drop yourself back down)"], ["gornation-scapular-pull-up", "ruch (driving your shoulder blades down and together); powrót (Lower yourself back into the starting hang with control)"]]}
    ],
    "mistakes": [
      {"c": "scap.mis.elbows", "s": [["gornation-scapular-pull-up", "Common mistakes: Not enough scapular contraction (Focus on shoulder blade movement, not biceps)"], ["fitnessvolt-scap-pull-up", "instrukcja (elbows always fully extended with no bend at any point) — standard"]]}
    ]
  },
  "Rope Climb": {
    "_tryb": "dopisz",
    "mistakes": [
      {"c": "rope.mis.arms", "s": [["wniosek", "rope.legs"]]}
    ]
  }
}
```

## Nowe zdania

| id | PL | EN (propozycja) | uzasadnienie |
|---|---|---|---|
| hang.grip | Chwyć drążek na szerokość barków albo trochę szerzej i zawiśnij na prostych rękach. | Grab the bar shoulder-width or a bit wider and hang with straight arms. | Część wspólna szerokości: GORNATION (na szerokość barków) i BarBend / Fitness Volt (trochę szerzej). Rodzaj chwytu pominięty — GORNATION go nie podaje. Wspólne dla Dead Hang i Scapular Pull-Up (zastępuje propozycje W1 `hang.grip`, `scap.hang`) |
| hang.shoulders | Ściągnij barki lekko w dół, z dala od uszu, i trzymaj je tak przez cały zwis. | Draw your shoulders slightly down, away from your ears, and keep them there the whole hang. | BarBend („down and away from your ears”) + GORNATION („slightly down and back”). Część wspólna: „w dół”; „do tyłu” tylko GORNATION — pominięte |
| hang.tight | Trzymaj całe ciało napięte i spokojne. | Keep your whole body tight and still. | Tekst z propozycji W1; BarBend (tight core; drugi artykuł: entire body tensed) + GORNATION (core tight, body stable) |
| hang.mis.shrug | Barki podjechane do uszu — wiszenie na luźnych barkach. | Shoulders shrugged up to your ears — hanging on loose shoulders. | GORNATION nazywa błąd („Passive shoulders”); BarBend podaje standard; jednocześnie zaprzecza `hang.shoulders` |
| scap.pull | Ściągnij łopatki w dół i do tyłu, potem powoli wróć do zwisu. | Pull your shoulder blades down and back, then slowly return to the hang. | Fitness Volt (retraction + pull down; slowly drop) + GORNATION (down and together; lower with control) |
| scap.mis.elbows | Zginanie łokci — ciągniesz rękami zamiast łopatkami. | Bending your elbows — pulling with your arms instead of your shoulder blades. | GORNATION (błąd: ruch z bicepsa zamiast łopatek) + Fitness Volt (standard: łokcie cały czas wyprostowane) |
| rope.mis.arms | Wspinanie się na samych rękach, bez blokady liny nogami. | Climbing on your arms alone, without locking the rope with your feet. | Wnioskowany: zaprzecza `rope.legs` („Wstawaj na zablokowanej linie nogami — nie ciągnij samymi rękami”) i `rope.lock` |

Zdanie istniejące użyte ponownie: `hang.noSwing` („Bujanie się i wymachy nogami.”). Nowe zdania wymagają wpisu w rejestrze twierdzeń.

## Źródła

| id | adres | organizacja | szczebel | co przeczytano |
|---|---|---|---|---|
| barbend-grip-exercises | https://barbend.com/best-grip-exercises/ | BarBend | 4 — artykuł o technice; autor Mike Dewar (CSCS, mgr fizjologii wysiłku), aktualizacja 18.06.2025 | sekcja „How to Do the Dead Hang” |
| barbend-women-pull-up | https://barbend.com/women-pull-up-guide/ | BarBend (ta sama organizacja — liczy się raz) | 4 — autorka Alice O'Connor (CF-L1), porady Stefanie Cohen, DPT; aktualizacja 10.08.2023 | sekcja „Dead hang” („You want to avoid swinging.”) |
| gornation-dead-hang | https://www.gornation.com/blogs/calisthenics-exercises/dead-hang | GORNATION | 4 wg rozstrzygnięcia W1 (producent drążków — własny rodzaj sprzętu); data 11.10.2025, firmowane, bez autora. **Uwaga: na stronie bloki „Shop Now” (kryterium 3 — do potwierdzenia przez koordynatora)** | instrukcja, „Common mistakes” (Passive shoulders, Swinging legs, Holding breath) |
| gornation-scapular-pull-up | https://www.gornation.com/blogs/calisthenics-exercises/scapular-pull-up | GORNATION | jw.; data 16.10.2025 | pozycja startowa, ruch, powrót, „Common mistakes” |
| fitnessvolt-scap-pull-up | https://fitnessvolt.com/?p=157103 („Scapular Pull-Ups: Strengthen Your Back and Improve Control”) | Fitness Volt | 4 — autor Matthew Magnante, certyfikat ACE (biogram); opublikowane 18.10.2022, modyfikacja 15.10.2026 (dane strukturalne) | instrukcja: chwyt, „keeping your elbows fully locked out”, powrót |
| gornation-muscle-up | https://www.gornation.com/blogs/calisthenics-exercises/muscle-up | GORNATION | jw.; data 01.11.2025 | cała instrukcja (drążek), lista błędów — tylko do sekcji Muscle Up niżej |

## Muscle Up — częściowe (open), poza blokiem

- `mu.transition` (BarBend — odczyt W1 02.11.2026: „chest and shoulders forward over the bar”; GORNATION: „pull as high as possible”, przy klatce na wysokości drążka „lean slightly forward” i przerzucenie nadgarstków) — 2 organizacje, drążek.
- `mu.press` (BarBend — odczyt W1: wypchnięcie do pełnego wyprostu; GORNATION: „extend the arms fully”) — 2 organizacje.
- `mu.grip` (fałszywy chwyt) — **sprzeczne**: GORNATION każe objąć drążek kciukiem z lekkim nadchwytem; nie do karty.
- Brak zdania ustawienia → karta nie spełnia kryterium. Możliwy błąd ze źródeł: „ciągnięcie prosto w górę” (GORNATION, błąd) — zaprzecza `mu.transition`; nie dopisano, bo karta nie wchodzi.
- Katalog opisuje wersję na kółkach (W1) — oba źródła W2 to drążek; decyzja koordynatora, czy wariant sprzętu (kółka ↔ drążek) jest dopuszczalnym uproszczeniem (chwyt i przejście różnią się).

## Otwarte i uwagi dla koordynatora

1. **GORNATION a kryterium 3** — strony firmowane i datowane, ale z blokami sklepowymi. Od tej oceny zależą obie nowe karty (Dead Hang, Scapular Pull-Up — Dead Hang miałby wtedy tylko BarBend; Scapular — tylko Fitness Volt).
2. **Dead Hang — oddech** („Holding breath” jako błąd): tylko GORNATION (Physitrack = 5) → otwarte.
3. **Scapular Pull-Up — pozycja startowa łopatek sprzeczna:** Fitness Volt — start z luźnymi barkami („drop down into your shoulders”), GORNATION — łopatki już ściągnięte. Karta tego nie przesądza; zestaw ogólny `pu.shoulders` kierunkowo zgodny.
4. **Scapular Pull-Up — „unoszenie klatki do drążka”** (GORNATION) — tylko jedno źródło; pominięte.
5. **Zestaw ogólny Dead Hang** (`npu.hang`) — nowa karta usuwa problem zdania o uchwytach (W1 sekcja 1).
6. **Rysunek:** nie sprawdzałem `lib/figures/v2/poses/pull_up.json` — do recenzji, czy poza Dead Hang pokazuje barki ściągnięte (zgodnie z `hang.shoulders`) i czy błąd `hang.mis.shrug` da się narysować.
7. **Gironda, Mixed Grip, One Arm, Wide-Grip Rear, Side To Side, Gorilla** — nie badane w W2; następny krok: Fitness Volt z autorem z kwalifikacjami jako drugie źródło (One Arm Chin-Up — do GORNATION).
8. **Role mięśni** — otwarte z W1 (Muscle Up triceps/klatka, One Arm brzuch, Scapular Pull-Up, Gorilla, Dead Hang najszerszy) nie badane w W2; plik `role-miesni-fala-w2/pull_up.md` nie powstał.
9. W tekstach zdań nie ma nazw źródeł ani organizacji.
