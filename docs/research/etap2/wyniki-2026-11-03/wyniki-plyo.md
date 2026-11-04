## Plyometria — 15 ćwiczeń, weryfikacja adresów z Gemini (badacz, 03.11.2026)

Zasady: CLAUDE.md „Merytoryczne podstawy”, wyjątek dla wskazówek techniki: ustawienie i ruch = 2 zgodne źródła szczebla 4 ALBO 1 przeczytane źródło
szczebla 3 (bez sprzeczności) → „jedno źródło (szczebel 3)”; błędy = 2 zgodne źródła (≥ szczebel 4); bez liczb i bez twierdzeń o zdrowiu
(twierdzenia Gemini o kolanach pominięte). Wynik Gemini = wskazówka; poniżej tylko to, co przeczytałem sam.
Plik `docs/research/szczeble-organizacji-2026-11-02.md` nie istnieje w ~/trening (Glob 03.11.2026) — szczeble przypisane wg briefu i CLAUDE.md.

### Źródła przeczytane

| Kod | Źródło | Autor / wydawca (sprawdzone) | Szczebel |
|---|---|---|---|
| UH | https://cdn4.sportngin.com/attachments/document/0127/7274/G._Plyometrics_Master.pdf (10 s.) | Nagłówek s. 1 „Plyometrics – USA Hockey”, stopka s. 10 „USA Hockey, 2001”. Plik leży na serwerze klubowym SportsEngine (nie na usahockey.com), zdjęcia z koszulkami klubu; oryginału na stronie USA Hockey nie znalazłem (wyszukiwanie 03.11.2026) | **4 warunkowo** — autorstwo federacji tylko z napisu w pliku, bez potwierdzenia u wydawcy |
| HK-R | https://us.humankinetics.com/blogs/excerpt/plyometric-bounds-and-skips | Human Kinetics; strona: „By James Radcliffe”, *High-Powered Plyometrics*, **3rd ed.** (nie 2nd i nie Radcliffe & Farentinos, jak podał Gemini) | **3** (wyciąg z książki od wydawcy) |
| HK-H | https://us.humankinetics.com/blogs/excerpt/power-development-exercises | Human Kinetics; Tom Howley, *Complete Conditioning for Lacrosse* (wydanie nie podane, numery rycin 4.xx, bez stron) | **3** (wyciąg z książki od wydawcy) |
| — | https://us.humankinetics.com/blogs/excerpt/stride-jump | adres przekierowuje na stronę główną HK (03.11.2026) — **nieprzeczytane** | — |
| — | https://us.humankinetics.com/blogs/excerpt/lower-body-power-development | dziś strona sklepu bez treści ćwiczeń — **nieprzeczytane** | — |
| — | nsca.com | dwa wyszukiwania z ograniczeniem do domeny — brak stron z techniką tych ćwiczeń | — |

### Sprawdzenie cytatów Gemini

| Cytat Gemini | Przypisanie Gemini | Co jest w źródle | Ocena |
|---|---|---|---|
| „Start in an athletic position with feet together.” | Alternate Leg Diagonal Bound | UH s. 10, „Alternate Leg Diagonal Bound” | dosłowny, właściwe ćwiczenie |
| „Explode outward and upward.” | Alternate Leg Diagonal Bound | UH s. 10 (to samo zdanie też w „Moving Lateral Cone Hops”, „Cross Over Bound”, s. 9) | dosłowny, właściwe ćwiczenie |
| „Left leg flexed, Left foot on box.” / „Use both legs to jump.” | Side to Side Box Shuffle | UH s. 6, ćwiczenie nazwane **„Lateral Bench Squats”** | dosłowne, **inna nazwa**; ruch zgodny z aplikacją (stopa na skrzyni, druga na podłodze, przeskok z zamianą stóp — `scripts/figures/agent-pozy/plyo.mjs:130-131`) — zgodność nazwy do potwierdzenia przez recenzenta |
| „Stand on one leg.” / „Push off with the leg you are standing on and jump forward, landing on the same leg.” / „Try to keep opposite leg off ground the entire time.” | Single-Leg Hop Progression | UH s. 5, ćwiczenie **„Single Leg Hops”** | dosłowne (w źródle ostatnie zdanie bez kropki); ruch zgodny z aplikacją (`plyo.mjs:20`: seria skoków jednonóż w przód) |
| „Facing the first box from about two steps away, assume an upright stance with one leg slightly behind the other.” | Box Skip | HK-R, „Box Skip” (s. 62 wg strony) | dosłowny, właściwe ćwiczenie |
| „Repeat the sequence (driving with the other leg) upon landing, as in the alternate-leg bound, except that you take every other step from a box.” | Box Skip | HK-R, ćwiczenie **„Box Bound”** (s. 63) | **nie zgadza się** — inne ćwiczenie |
| „Eliminate landing positions that foster overstriding or pulling the hips over and off the box.” | Box Skip | HK-R, „Box Bound”, wskazówki trenerskie | **nie zgadza się** — inne ćwiczenie; dla Box Skip strona nie ma osobnych wskazówek |
| Radcliffe & Farentinos, 2nd ed., drill 64 | Box Skip | strona podaje 3rd ed., autor James Radcliffe | **opis książki nieścisły** |

### Wynik

| Ćwiczenie | Ustawienie | Ruch | Czego unikać | Stan |
|---|---|---|---|---|
| Alternate Leg Diagonal Bound | UH s. 10 | UH s. 10 | — | **brak** (1 źródło szczebla 4 warunkowo; potrzebne 2) |
| Bench Jump | HK-H (Box Jump) | HK-H (Box Jump) | — | ustawienie, ruch: **jedno źródło (szczebel 3) — uproszczenie: wariant sprzętu (ławka zamiast skrzyni), do potwierdzenia przez recenzenta**; UH s. 5 „Box Jumps” zgodne kierunkowo; błędy **brak** (patrz niżej) |
| Box Skip | HK-R | HK-R | — | ustawienie, ruch: **jedno źródło (szczebel 3)**; błędy **brak** |
| Double Leg Butt Kick | UH s. 3 („Tuck Jump – Butt Kick”) | UH s. 3 | — | **brak** (1 źródło szczebla 4 warunkowo) |
| Dumbbell Seated Box Jump | — | — | — | **brak** |
| Frog Hops | — | — | — | **brak** |
| Kneeling Jump Squat | — | — | — | **brak** |
| Lateral Box Jump | UH s. 6 („Lateral Box Jumps”) | UH s. 6 | — | **brak** (1 źródło szczebla 4 warunkowo) |
| Side Hop-Sprint | — | — | — | **brak** |
| Side Standing Long Jump | — | — | — | **brak** |
| Side to Side Box Shuffle | UH s. 6 („Lateral Bench Squats”) | UH s. 6 | — | **brak** (1 źródło szczebla 4 warunkowo, inna nazwa) |
| Single Leg Butt Kick | — | — | — | **brak** |
| Single-Leg Hop Progression | UH s. 5 („Single Leg Hops”) | UH s. 5 | — | **brak** (1 źródło szczebla 4 warunkowo) |
| Single-Leg Stride Jump | — | — | — | **brak** (wyciąg HK „stride jump” niedostępny) |
| Star Jump | — | — | — | **brak** |

### Box Skip — jedno źródło (szczebel 3)
- HK-R, sekcja „Box Skip”, Starting position: „Facing the first box from about two steps away, assume an upright stance with one leg slightly behind the other.”
- HK-R, „Box Skip”, Action: „Drive off the back leg, and attempt to gain as much height with the hips as possible.”; „Immediately upon landing on a box, drive the other leg forward and up to gain maximal height and distance”.
- setup PL „Stań przodem do pierwszej skrzyni, w niewielkiej odległości, wyprostowany, jedna noga lekko z tyłu.” EN „Stand tall facing the first box, a short distance away, one foot slightly behind the other.”
- move PL „Odbij się z tylnej nogi, pomagając sobie rękami i wyciągnięciem kolana w górę; po lądowaniu na skrzyni od razu wybij drugą nogę w przód i w górę, zeskocz między skrzynie i skipem przejdź do następnej.” EN „Drive off your back leg, using your arms and knee drive; as soon as you land on the box, drive the other leg forward and up, drop down between the boxes and skip to the next one.”
- Uwaga dla recenzenta: książka opisuje serię skrzyń; rysunek w aplikacji to jeden skok jednonóż na skrzynię (`plyo.mjs:18`) — sprawdzić, czy zdania i rysunek nie przeczą sobie.
- Czego unikać: brak (wyciąg nie ma wskazówek dla Box Skip; zdanie o „overstriding” dotyczy Box Bound).

### Bench Jump — jedno źródło (szczebel 3), uproszczenie (wariant sprzętu)
- W aplikacji: wyskok w przód na podwyższenie (`plyo.mjs:198`, skrzynia/ławka na wysokości lądowania). Baza: Box Jump.
- HK-H, „Box Jump”: „Stand with the feet approximately shoulder-width apart in front of a box.”; „Land on box with both feet flat, the knees and hips slightly flexed, and the chest up”.
- UH s. 5, „Box Jumps”: „Land with the knees bent, under control and on the balls of the feet.” — **sprzeczność** co do stopy (HK-H: cała stopa, UH: przednia część stopy) → w zdaniu tylko część wspólna (ugięte kolana, kontrola).
- setup PL „Stań przed ławką, stopy mniej więcej na szerokość barków.” EN „Stand in front of the bench, feet about shoulder-width apart.”
- move PL „Zamachnij rękami w przód i wskocz na ławkę; wyląduj miękko, na ugiętych kolanach, klatka w górę.” EN „Swing your arms forward and jump up onto the bench; land softly with your knees bent and chest up.”
- Czego unikać: kandydat PL „Lądowanie na wyprostowanych nogach.” / EN „Landing with straight legs.” — wniosek z dwóch wskazówek pozytywnych (HK-H szczebel 3 + UH szczebel 4 warunkowo); **[OTWARTE]**: drugie źródło warunkowe, a żadne nie podaje tego błędu wprost → nie do aplikacji.

### Ćwiczenia z jednym źródłem UH (zdania nie do aplikacji, tylko dla kolejnego wyszukiwania)
- Alternate Leg Diagonal Bound, UH s. 10: „Start in an athletic position with feet together.”; „Land on Left leg with the knees bent, under control and on the balls of the feet.”
- Double Leg Butt Kick, UH s. 3 („Tuck Jump – Butt Kick”): „Bring your heels to your butt.”
- Lateral Box Jump, UH s. 6: „Jump laterally from the ground onto the center of the box.”
- Side to Side Box Shuffle, UH s. 6 („Lateral Bench Squats”): „Left leg flexed, Left foot on box”; „Use both legs to jump.”
- Single-Leg Hop Progression, UH s. 5 („Single Leg Hops”): „Push off with the leg you are standing on and jump forward, landing on the same leg.”
- Odrzucone: HK-H „Single-Leg Power Hop” (stopa na skrzyni, wybicie w górę) — inny ruch niż Single-Leg Hop Progression.

### Otwarte pytania
1. Autorstwo UH: czy USA Hockey publikuje ten dokument (np. materiały Coaching Education Program)? Potwierdzenie na usahockey.com zrobiłoby z UH pełny szczebel 4; nadal potrzebne drugie źródło szczebla 4.
2. Drugie źródło szczebla 4 dla 5 ćwiczeń z UH — kandydaci spoza zakresu tego zlecenia (biblioteki organizacji szkolących trenerów, ExRx) — niesprawdzone.
3. Wyciąg HK „stride jump” (High-Powered Plyometrics) zniknął z sieci wydawcy; ewentualnie archiwum (web.archive.org) tej samej strony wydawcy — decyzja koordynatora, czy archiwum strony wydawcy jest dopuszczalne.
4. 8 ćwiczeń bez żadnego źródła (Dumbbell Seated Box Jump, Frog Hops, Kneeling Jump Squat, Side Hop-Sprint, Side Standing Long Jump, Single Leg Butt Kick, Single-Leg Stride Jump, Star Jump) — decyzja produktowa: ukryć albo dalej szukać.
