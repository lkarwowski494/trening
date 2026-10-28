# 06-tresci (treści krytyczne + zakres) — reaudyt M1 pętla 2

Commit: 0a566a1848bc44139f27ec2f3fcdc3e49922f901 · Baza: 4c116d0 · Tryb: reaudit (pętla 2), tylko odczyt; sondy w katalogu grupy i w usuniętym worktree /tmp.

## Podsumowanie

| Zadanie | Wynik | Dowód |
|---|---|---|
| M1-audytor-generalny-038 (P1, karty bez recenzji bramki 4) | zweryfikowane | dowody/jest-celowane.txt (karty-recenzja 14/14, l047, figury-recenzja), dowody/mutacja-nowa-karta.txt, dowody/mutacja-nowa-karta-opis.txt, dowody/sonda-technika.txt, dowody/checki.txt |
| M1-audytor-generalny-021 (kąt stóp 15–20°, T-054) | zweryfikowane | dowody/zrodlo-squ-cytat.txt, dowody/checki.txt (check:claims, check:zrodla-runtime kod 0), dowody/jest-celowane.txt (zrodla-pelne-wskazowki-ogolne) |

Nowe znaleziska:

| ID | Poziom | Realność | Opis | Dowód |
|---|---|---|---|---|
| 06-tresci-701 | P2 | realny | „Technika ›” przy JM Press i Decline Close-Grip Bench To Skull Crusher prowadzi do podglądu bez sekcji „Technika” (regresja 8521780) | dowody/sonda-technika.txt |
| 06-tresci-702 | P2 | realny | Opis decyzji nocnej #84 dla weta właściciela jest nieścisły: „karta i wskazówki tekstowe zostają”, a w rzeczywistości znika cała sekcja „Technika” | dowody/sonda-technika.txt |

Kandydatów P0/P1 brak (pilne.md). Teoretyczne (bez poziomu): strażnik L-047 sprawdza tylko wpisy z datą od 2026-10-28 (tests/l047-recenzja-niezalezna.test.ts:12), więc wpis „wyswietlana” z wcześniejszą datą i autor = recenzent by przeszedł. Nie ma do tego drogi przez UI, wymaga ręcznej edycji zapisu.

## Przegląd różnicy

Obszar 4c116d0..0a566a1: lib/figures/**, lib/cues/**, data/zrodla/**, docs/research/**, components/ExerciseCues.tsx, ExerciseFigure*.tsx oraz testy figur i kart (30 plików).

**038 — bramka 4 dla kart.** Mechanizm: scripts/zrodla-runtime.mjs (`buildCues`, `cardReviewed`, `kartaSkrot`, `zestawSkrot`). Karta bez aktualnego wpisu trafia na listę `hidden` i nie ma jej w lib/cues/data.json. Zestaw ogólny bez wpisu nie trafia na listę `general`.
- Sprawdziłem, w których miejscach treść wskazówek jest wyświetlana: tylko ExerciseCues, ExerciseFigureV2 (błędy i linie przez `cueIdsOf`) oraz opis figury v1 (lib/figures/index.ts). Wszystkie czytają przefiltrowane `CUE_DATA` albo `generalCuesReviewed`. Picker i wymiana ćwiczenia nie pokazują wskazówek (grep `cueText|cuesFor|CUE_DATA`).
- Na main nie ma eksportu strony z ćwiczeniami (scripts/site eksportuje tylko politykę prywatności i stronę wsparcia). Decyzja 9a w docs/18 jest otwarta po stronie linii 1.1.
- Zbiór wyświetlany i zbiór z zapisem recenzji się pokrywają. W runtime jest 101 kart, ukryta jest tylko Hack Squat (dowody/sonda-technika.txt: `hidden: ["Hack Squat"]`).
- 51 kart ma wpis w sekcji „karty” z autorem ≠ recenzent (47 + 5 po usunięciu zdań). Pozostałe przechodzą wpisem v1 „wyswietlana” z 27.10, w którym zapisano, że recenzja objęła kartę: „karta (wskazówki, mięśnie)”, recenzent spoza autorów figur. Skrót v1 obejmuje id i polskie teksty wskazówek.
- 70 zestawów ma werdykt „wyswietlana” z autorem ≠ recenzent.
- Hack Squat jest ukryta: brak przycisku „Technika ›” i brak sekcji (sonda) oraz brak figury v1, bo lib/figures/index.ts wymaga karty w `CUE_DATA`.
- Mutacja w worktree /tmp (dodana karta bez wpisu): `check:zrodla-runtime` daje kod 1, karta nie trafia do runtime, a tests/karty-recenzja.test.tsx jest czerwony (dowody/mutacja-nowa-karta-opis.txt). Mutacje tekstu i przypisania pokrywa sam test (sekcja „regresja”).

**Usunięte zdania (decyzja 1a).** Z kart Pistol Squat, Deadlift (hantle) i trzech wykroków zniknęły `sq.mis.kneesIn`, `dl.lower`, `lunge.knee` i `lunge.mis.kneeIn`, a z zestawu Decline Close-Grip zniknęło `skull.upperArm`. Sprawdziłem plik runtime: żadna z tych kart nie ma już tych id. Teksty są wybierane po id, więc zmiana obejmuje wszystkie języki. Same zdania zostają w lib/cues/text, bo używają ich inne karty, a docs/lokalizacja zawiera tylko skróty przekładu. Uwaga na później: `lunge.knee` w zestawach ogólnych wykroków ma teraz za źródło przysiad bułgarski (data/zrodla/wskazowki-ogolne.json). To ten sam rodzaj analogii, z powodu którego zdanie usunięto z kart. Rodzina lunge jest „planned”, więc w 1.0 nic się nie wyświetla, ale przy włączeniu tej rodziny potrzebna będzie recenzja zestawów.

**021.** Cytat Squat University odczytałem sam (curl) i zgadza się dosłownie, z kontekstem „Research has shown that turning the toes out more than 30-degree is less effective” (dowody/zrodlo-squ-cytat.txt). Część wspólna z SBS to 15–20°, a tekst jest oznaczony jako uproszczenie, więc spełnia zasadę z 25.10. Nieaktualny komentarz w kodzie (bez wpływu na UI): lib/figures/v2/ui.ts:42 wciąż podaje NSCA jako drugie źródło, choć NSCA nie zostało otwarte.

**Tory (#81).** W hinge.ts jest górna obwiednia wypukła styków (cache 25 punktów, potem pętla bez przenikania), a w benchPress.ts szyna Smitha ma stały x. Testy tor/figury przechodzą (dowody/jest-celowane.txt).
- Rodziny ready to squat, bench_press i hinge. Żaden wpis v2 nie ma pola `slad`. Strażnik L-050 wymaga go dopiero od 29.10 (tests/figures-v2-tor.test.ts:80). Recenzje hinge i bench_press (33d92b2, 18:59 UTC) powstały przed regułą (b704e30, 19:35 UTC), a ich uwagi opisują obejrzany ślad toru.
- Squat ma recenzję z 27.10 bez arkusza śladu. 14 wyjątków w tests/tor-wyjatki.json ma powody i jest w backlogu 1.0.1 (docs/21-roadmapa-offline.md:159), dlatego nie zgłaszam ich jako znaleziska.
- Informacja dla planu 1.0.1: miara strażnika daje dla Goblet Squat 6,1 cm i 3 zawrócenia, a dla Cable Squat 5,1 cm i 2 zawrócenia, czyli więcej niż wartości skalibrowane jako „źle” (4,2 cm, 2 zawrócenia). Dla Sumo Squat (hantel) i Barbell Hack Squat poziomy rozrzut ciężaru wynosi ok. 22–24 cm (dowody/sonda-tor.txt). Wizualnie tego nie oceniałem: podgląd w dowody/podglad ma zbyt małe kadry, a wg CLAUDE.md nie jest to dowód.

**#84 (opinia, bez decyzji).** `V2_WSTRZYMANE` i `shownFigureSpec` działają we wszystkich miejscach rysowania (ExerciseCues, ExerciseFigureV2; strażnik w tests/figures-v2-wstrzymane.test.ts). Miniatur ani eksportu na main nie ma. Odwrót jest prosty: usunąć 2 wpisy i odwrócić test. Samą decyzję uważam za rozsądną, bo rysunek przeczy wskazówce (próg: błędne twierdzenie), a koszt to brak rysunku przy 2 rzadkich ćwiczeniach. Zastrzeżenia dotyczą 701 i 702.

## Znaleziska

### 06-tresci-701
- Poziom: P2 (ŚREDNIE). Realność: realny, ale dotyczy tylko użytkowników z JM Press albo Decline Close-Grip Bench To Skull Crusher w szablonie lub treningu. Regresja od 8521780 (#84), nie istniało na 4c116d0.
- Kroki: dodaj JM Press do szablonu i otwórz szablon albo trening. Przy ćwiczeniu widać przycisk „Technika ›”. Po stuknięciu otwiera się podgląd ćwiczenia bez sekcji „Technika” (brak rysunku, wskazówek i ramki asekuracji). Przycisk nie prowadzi do niczego.
- Przyczyna: przycisk liczy się z `figureSpec`, a nie z `shownFigureSpec` (lib/figures/v2/ui.ts:48 „return !!figureSpec(key);”). Bramka przycisku jest tutaj: components/ExerciseCues.tsx:80 „hasTechnique(exercise)) return null”.
- Dowód: dowody/sonda-technika.txt — Spośród wszystkich ćwiczeń katalogu `hasTechnique` jest prawdą bez sekcji „Technika” tylko dla tych 2, a `TechniqueLink` dla obu renderuje przycisk.
- Test akceptacyjny: dla każdego klucza katalogu `hasTechnique(e)` ⇒ `ExerciseCues` renderuje `exercise-cues`, a `TechniqueLink` dla JM Press nie renderuje przycisku. Mutacja: wpis w `V2_WSTRZYMANE` bez zmiany `hasTechnique` czerwieni test.

### 06-tresci-702
- Poziom: P2. Realność: realny, bo to podstawa weta właściciela. Wprowadzone przez 8521780 i wpis z 28.10.
- Opis: wpis decyzji do weta (docs/18-przekazanie.md:642) mówi „karta i wskazówki tekstowe zostają, jak Push Press i Pendlay Row”. To samo twierdzi komentarz lib/figures/v2/figure.ts:35 „karta bez rysunku, wskazówki zostają”.
- Stan faktyczny: oba ćwiczenia nie mają karty własnej, mają tylko zestaw ogólny, a ten jest pokazywany wyłącznie przy rysunku v2 (components/ExerciseCues.tsx:34). Bez rysunku znika więc cała sekcja „Technika”. Test to zapisuje (tests/figures-v2-wstrzymane.test.ts:45). Push Press i Pendlay Row mają karty własne, więc porównanie z nimi jest błędne.
- Skutek: właściciel wetuje albo zatwierdza „brak rysunku”, a w praktyce zatwierdza „brak całej techniki” przy 2 ćwiczeniach i wraz z tym 701.
- Test akceptacyjny: brak. To korekta zapisu decyzji w docs/18 (opcje dla właściciela: rysunek ukryty i bez techniki albo zestaw ogólny bez rysunku po recenzji zestawu) oraz wpis lekcji (błędna informacja podana właścicielowi, CLAUDE.md).

## Nie sprawdzono
- Recenzja merytoryczna 51 kart i 70 zestawów od nowa: poza zakresem (pkt 2 zasad audytów). Sprawdziłem tylko zapis, skróty, autor ≠ recenzent i mechanizm.
- Wizualna ocena torów squat (dowody/podglad ma za mało pikseli). Krok: arkusz `podglad-v2.mjs --cols 1` w pełnej rozdzielczości przy recenzji 1.0.1.
- Treść tłumaczeń wskazówek: skrót recenzji obejmuje tylko teksty PL. Za przekłady odpowiada recenzent-lokalizacji (grupa 10).
- Pełny Jest: biegnie u M1. Tu tylko celowane, 13 plików, 178/178 (dowody/jest-celowane.txt).

## Kontrola dowodów i sekretów
- `git status --porcelain` na starcie i na końcu jest pusty (dowody/git-status-start.txt, dowody/git-status-koniec.txt). Worktree /tmp/wt06-tresci usunięty.
- Skrypty kontrolne check:claims, check:cues, check:figures, check:figures-v2 i check:zrodla-runtime dały kod 0 (dowody/checki.txt).
- W raporcie i dowodach nie ma e-maili, UDID, tokenów ani nazw innych aplikacji. Nazwy serwisów źródłowych występują tylko jako źródła wewnętrzne (jak w rejestrze).
- Wynik sprawdz-raport: dowody/sprawdz-raport.txt (kod 0)
