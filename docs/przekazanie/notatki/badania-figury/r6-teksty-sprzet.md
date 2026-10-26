# R6 — teksty wskazówek cobra.* i hang.*; wymiary sprzętu (badacz, 26.10.2026)

Łatka: `r6-teksty-sprzet-patch.json` (dwie sekcje: `teksty_wskazowek` → `lib/cues/text/pl.json` i `en.json`; `figury_sprzet` → `data/zrodla/figury-sprzet.json`, gałąź grafiki-sprzet, worktree `scratchpad/wt-sprzet`).

## 1. Teksty wskazówek

W `pl.json` i `en.json` (wt-sprzet) brakuje kluczy `cobra.hips`, `cobra.control`, `cobra.mis`, `hang.noSwing`, `hang.slow` i `hang.ribs`. Dodaję wszystkie sześć, bo `hang.slow` i `hang.ribs` też nie mają tekstów (są w zestawie ogólnym „hanging”).

Teksty PL pochodzą ze słownika badacza; `cobra.mis` przeredagowałem, żeby zgadzał się z oboma źródłami. Styl dopasowałem do istniejących wpisów: błąd opisany rzeczownikiem (jak `plank.mis.sag`), wskazówka krótkim trybem rozkazującym (jak `cobra.hips`). Teksty nie zawierają nazw źródeł.

| Klucz | PL | EN | Źródła (przeczytane 26.10.2026) | Pewność |
|---|---|---|---|---|
| cobra.hips | Biodra zostają na podłodze. | Keep your hips on the floor. | NASM Floor Prone Cobra, krok 2: „Keep your hips and legs relaxed on the floor…”; ACE #16 Cobra, krok 2: „press your hips into the mat… while keeping your hips stable” | ustalone |
| cobra.control | Opuszczaj się powoli. | Lower yourself slowly. | NASM, krok 4: „Lower yourself back to the floor with control.”; ACE #16, krok 3: „Gently relax and lower your upper body…” | ustalone |
| cobra.mis | Wyginanie pleców za mocno, aż biodra odrywają się od podłogi. | Arching your back too far, until your hips lift off the floor. | NASM, Common Mistakes: „Excessive spinal extension that strains the lower back”; ACE #16: „individuals may often lift their hips off the mat or floor as they fully extend their arms.” | ustalone (część wspólna) |
| hang.noSwing | Bujanie się i wymachy nogami. | Swinging and kicking your legs up. | NASM Best Abs Exercises, Hanging Knee Raise: „Avoid using momentum to swing the legs upward.”; analogia: pu.noSwing (ACE #191, NASM — cues.json) | jedno źródło bezpośrednie + analogia |
| hang.slow | Opuszczaj nogi powoli. | Lower your legs slowly. | NASM Best Abs: „…requires the core to control both the raising and lowering phases…”; ISSA 5 Best Core Exercises (słownik: „…slowly controlled back down…”) | ustalone |
| hang.ribs | Żebra w dół, tułów spokojny — podwijaj miednicę. | Ribs down, torso still — tuck your pelvis. | ISSA (Hanging Leg Raises: „Keeping the ribcage down…”; słownik: „tuck their pelvis…”); NASM Best Abs („…stable torso…”) | ustalone |

Uwaga do `hang.noSwing`: błąd ma dziś tekst, ale nie ma reguły sensu (r4, core_hang — [OTWARTE] miara bujania). Tekst można wdrożyć niezależnie od reguły.
Pozostałe języki (da, ko, ms, …) wymagają przekładu — zadanie dla tłumacza.

## 2. Wymiary sprzętu (`figury-sprzet.json`)

Główne źródło to **przepisy techniczne międzynarodowej federacji trójboju siłowego, wyd. styczeń 2024** (szczebel 4: regulamin federacji, norma sprzętu startowego). Przeczytałem s. 7–9 (Equipment and Specifications). Plik PDF to kopia ze strony krajowego związku: https://www.fpio.org.ru/data/04-docs/IPF_Technical_Rules_Book_2024_24_Jan.pdf. Pełny opis do folderu „05 Research” na Dysku; w repo bez nazwy.

Wymiary z przepisów (s. 8–9):

**Gryf**
- długość całkowita ≤ 2,2 m;
- odległość między wewnętrznymi kołnierzami 1,31–1,32 m;
- średnica 28–29 mm;
- średnica tulei 50–52 mm.

**Talerze**
- otwór 52–53 mm;
- grubość: talerze ≥ 20 kg — ≤ 6 cm, talerze ≤ 15 kg — ≤ 3 cm;
- średnica największych ≤ 45 cm.

**Ławka i stojaki**
- ławka: długość ≥ 1,22 m, szerokość 29–32 cm, wysokość 42–45 cm (do wierzchu wyściółki);
- podpory gryfu przy ławce: wysokość 75–110 cm, rozstaw wewnętrzny ≥ 1,10 m;
- stojaki do przysiadu regulowane od 1,00 m do co najmniej 1,70 m.

| Klucz | Wartość | Wynik | Uwagi |
|---|---|---|---|
| barLen | 220 | zgodne | górna granica |
| sleeveR | 2,6 | zgodne | Ø 52 mm |
| plateR | 22,5 | zgodne | Ø 45 cm |
| plateW | 2,8 | zgodne | ≤ 3 / ≤ 6 cm |
| lawka_regulowana.seatTop, długość | 43; 130 cm | zgodne | 42–45 cm; ≥ 122 cm |
| postSpan | 64 (rozstaw 128) | zgodne | ≥ 110 cm |
| **barR** | 1,6 (Ø 32 mm) | **niezgodne** | norma 28–29 mm → 1,4–1,45; albo jawna konwencja „pogrubienie dla czytelności” |
| **benchW** | 28 | **niezgodne** | norma 29–32 → propozycja 30 |
| **plateZ** | 44–49 | **niezgodne (istotne)** | talerze zaczynają się przy ok. ±66 cm, dziś leżą na części chwytnej gryfu. Propozycja [66, 71]; sprawdzić kolizje z dłońmi przy szerokim chwycie i widok z przodu |
| **chainZ** | 45 | **niezgodne** | jak plateZ; propozycja ok. 73 |
| kbBallR | 9,5 (Ø 19) | konwencja (zakres 19–21) | kettlebell sportowy (dokumentacja producenta, Dysk): korpus Ø 210 mm, uchwyt Ø 35 mm, okno 60 mm; żeliwne — rozmiar zależy od masy, źródła brak |
| gymBallR | 32,5 (Ø 65) | zgodne z typoszeregiem — uproszczenie | katalog sprzętu medycznego organizacji humanitarnej: piłki Ø 55 i Ø 75 cm; 55 cm dla wzrostu 155–170 cm. Rozmiar 65 cm leży pomiędzy, sam w źródle nie występuje |

Zostają „konwencją rysunku” z zakresem z pliku, bez źródła szczebla 4:
- hantel (dbHeadR, dbHandle), piłka lekarska, wałek piankowy;
- wysokości bloczków wyciągu, kolumna wyciągu, linka i uchwyty;
- modlitewnik, poręcze do dipów, skrzynia, sanie, lina, taśmy do podwieszania, ślizgacze, kółko do brzucha;
- gryf sześciokątny, landmine, prowadnice suwnicy Smitha, dźwignie maszyn.

Wymiary hantli, piłek lekarskich i wałków zależą od producenta i masy — normy nie znalazłem. **[OTWARTE]** Zebranie danych od producentów (2–3 na rodzaj sprzętu, na Dysk) pozwoliłoby podać zakres „zgodne ze źródłem”. Nie robiłem tego w tej rundzie.

Ocena realności `plateZ` (talerze na części chwytnej):
- **realny** dla grafik ze sztangą w widoku z przodu: rysunek przeczy budowie sprzętu;
- nie dotyczy danych;
- kategoria: błędne twierdzenie w grafice, czyli próg wydania „błędne liczby” — rozstrzyga koordynator.

Do sprawdzenia na rigach: czy jakaś poza (np. szeroki chwyt, ±40 cm) zakłada talerze bliżej środka.

## Źródła przeczytane (26.10.2026)

| # | Źródło | Szczebel | Miejsce |
|---|---|---|---|
| Z60 | NASM, Floor Prone Cobra. https://www.nasm.org/resource-center/exercise-library/floor-prone-cobra | 4 | kroki 2 i 4; Common Mistakes |
| Z61 | ACE #16 Cobra. https://www.acefitness.org/resources/everyone/exercise-library/16/cobra/ | 4 | kroki 2–3; uwaga o biodrach |
| Z62 | NASM, Best Abs Exercises. https://www.nasm.org/resource-center/blog/training/best-abs-exercises | 4 | Hanging Knee Raise |
| Z63 | Przepisy techniczne federacji trójboju siłowego, wyd. 01.2024 (PDF, link wyżej) | 4 | s. 8: Bars and Discs (a) 1–6, (b) 2; s. 9: Discs 5 i 9, Squat Racks, Bench 1–4 |
| Z64 | Dokumentacja producenta kettlebelli sportowych (adres na Dysku) | 4 | specyfikacja: korpus 210 mm, uchwyt 35 mm, okno 60 mm |
| Z65 | Katalog sprzętu organizacji humanitarnej, piłka Ø 55 cm. https://unicat.msf.org/cat/product/42240 | 4 | opis artykułu (55 cm dla 155–170 cm) |

Nie przeczytane:
- przepisy międzynarodowej federacji podnoszenia ciężarów (strona iwf.sport zwraca 403);
- tabele rozmiarów piłek w serwisach (streszczenia wyszukiwarki — nie są źródłem).
