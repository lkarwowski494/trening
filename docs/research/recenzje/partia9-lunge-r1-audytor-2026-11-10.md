# Recenzja niezależna — rodzina v2 `lunge`, partia 9, runda 1 (audytor, 10.11.2026)

Stan zamrożony: `figury/partia-9-lunge` @ 8360f576 (LOAD/DATA_UI w 18cdb40). Autor: programista partii 9. Recenzent: audytor (nie pisał rodziny, nakładki, kart ani zestawów). Bramka 4, L-047 A, L-050, K4–K15.

**Werdykt rodziny: do poprawy** — 5 × WYSOKIE w 12 z 24 ćwiczeń. Bez zastrzeżeń ruchu: Reverse Lunge, Walking Lunges, Lunges (hantle), Lunges (sztanga), Barbell Walking Lunge, Bulgarian Split Squat (hantle/sztanga), Smith Machine Bulgarian Split Squat (tylko Ś2), Slider Reverse Lunge, Suspended Split Squat, Single-Leg High Box Squat, Smith Machine Pistol Squat.

## Metoda
- Arkusze `arkusz-slad.mjs` wygenerowane samodzielnie: 24 ćwiczenia × 2 widoki = 48 arkuszy (21 kadrów co 0,05) + 76 arkuszy `arkusz-nakladka.mjs --family lunge` (z pozami błędów). 24 ćwiczenia tworzą 14 skupisk identycznego szkieletu (frameAt, 21 kadrów — porównanie liczbowe); w pełnej rozdzielczości obejrzano 16 arkuszy (13 z 14 skupisk co najmniej w jednym rzucie; Slider Reverse Lunge tylko liczbowo) i 3 arkusze nakładki z przodu (Step Up, Lateral Lunge, Curtsy Lunge); pozostałe arkusze sprawdzone liczbowo, różnice sprzętu (checkFrame, holdChecks, odstępy kapsuł co u = 0,005).
- Liczby z `frameAt` co u = 0,01: kąty kolan i bioder (`jointAngles`), wysokość tylnego kolana, kąt uda przedniej nogi, kolano wobec palców (x, z), styki stóp z podłogą/stopniem/ławką, chwyt wobec ciężaru, położenie gryfu wobec barków.
- Skróty z własnego `node scripts/zrodla-runtime.mjs --skroty` = skróty `recenzja-szkielet.mjs lunge` (0 różnic; v2 `12c75b7d1d89`, liczba 24).

## Znaleziska
| ID | Klasa | Ćwiczenia | Miara / kroki | Realność |
|---|---|---|---|---|
| W1 | WYSOKIE | Curtsy Lunge, Crossover Reverse Lunge, Elevated Back Lunge, Lunge Pass Through, Step Up (element); Barbell Step Up (linia kąta) | `measuredSide` = L (największy zakres w pętli = noga tylna/zakroczna), więc `lungeKneeToeRef` (z przodu) i linia kąta są na nodze L, a karta mówi o kolanie przednim / na podwyższeniu; reguła `kolano_nad_stopa` ma `strony: bardziej_zgieta` = R (u = 1: R 95°, L 85°; Step Up u = 0: R 90°, L 25°). Step Up z przodu: pion na stopie w powietrzu (do 65 cm nad podłogą), podpis kąta 25→116°. Kroki: otwórz ćwiczenie → rzut z przodu. | realny |
| W2 | WYSOKIE | Lateral Lunge, Barbell Side Split Squat, Cossack Squat | `rotacjaStopy` R −20° (Cossack −28°): palce do środka (pięta z 32,1 → palce z 23,5 cm); kolano na dole 10,0 cm (Cossack 13,1 cm) na zewnątrz od palców — własny pion nakładki pokazuje kolano poza linią, wbrew `lunge.knee`. | realny |
| W3 | WYSOKIE | Barbell Side Split Squat | gryf w z = 0 przez cały ruch, barki z = 21,5 cm (u ≥ 0,5); chwyty z 53,5 / −10,5 — gryf 21,5 cm w bok od środka pleców, dłonie ślizgają się po gryfie (widać z przodu). Wyjątek toru `Barbell Side Split Squat|side` (13,0 cm) opisany jako „tor sztangi = tor bioder”, a miednica stoi (x −16,1 → −18,0), gryf idzie x −21,9 → −8,9 — wyjątek maskuje wadę. | realny |
| W4 | WYSOKIE (K8) | Split Squat, Split Squat (linki), Elevated Back Lunge | u = 0 = „stanie” (DATA_UI, BRD; karta „wstań”): Split Squat kolana 56,8° / 55,7°, miednica 70,5 cm, zakres 20,5 cm; Elevated Back Lunge kolano przednie 63,1° (przednia stopa na stopniu 12 cm, tylna na podłodze obok). | realny |
| W5 | WYSOKIE (K8) | Pistol Squat | wolna noga zgięta 30,6–30,8° przez całe powtórzenie; karta `pistol.setup`: „drugą wyprostuj w przód”. | realny |
| Ś1 | ŚREDNIE | Step Up, Barbell Step Up | noga zakroczna: u 0,30–0,60 kolano 116°, stopa 55–65 cm nad podłogą za ciałem, na górze kolano 87° w górę; stopa nie staje na stopniu — ruch spoza karty. | realny |
| Ś2 | ŚREDNIE | Bulgarian ×3 | grzbiet tylnej stopy 2,1 cm nad siedziskiem przez cały ruch (styk ≤ 1 cm). | realny |
| Ś3 | ŚREDNIE (K12) | Lateral, Barbell Side Split, Cossack | zestaw `lunge`: „Przednie kolano…” przy ruchu bocznym bez nogi przedniej. | realny |
| Ś4 | ŚREDNIE | Lateral, Barbell Side Split, Cossack | u = 0: kolano R 51,8° (Cossack 43,6°), miednica 10,6–11,5 cm od środka między stopami. | realny |
| N1 | NISKIE | tor-wyjatki: Pistol Squat, Single-Leg High Box Squat | opis „ślad dłoni”, a ślad = miednica (76–94 cm od chwytu); ruch fizycznie poprawny. | — |

## Pytania leada
- (a) Start w szerokim rozkroku (u = 0) dla Lateral Lunge i Barbell Side Split Squat — poprawny jako wariant; wadą jest niesymetryczna poza startowa (Ś4) i stopa palcami do środka (W2).
- (b) Curtsy — tylna stopa z = 22 cm, przednia z = 9–13 cm: po zewnętrznej stronie przedniej, za nią; poprawne. Crossover Reverse Lunge ma ten sam szkielet.
- K5/K14 `tests/tor-wyjatki.json` (+12): 7 wykroków 4,0–4,8 cm — uzasadnienie zgodne z ruchem (łuk miednicy przy kroku); Pistol 9,7 i High Box 6,5 — ruch poprawny, opis błędny (N1); Cossack front 4,3 — poprawne; Lunge Pass Through front 15,8 — poprawne (kettlebell pod udem do środka, 0,2 cm od goleni); Barbell Side Split 13,0 — maskuje W3. Pozostałe zmiany testów (mapping, rejestr nakładki, generator w zakresie, eksport 386 → 410, gemini 15 → 14) to dopisania, nie poluzowania; `tests/architecture-limits.test.ts` bez zmian w zakresie b66ecfa..8360f57. Brak testu strony nogi elementu, skrętu stopy i wyprostu na u = 0 — przy poprawce potrzebne testy odtwarzające z miarami z tabeli.
- Nakładka `overlay/lunge.ts`: 2 elementy z reguł „ustalone” (`plecy_proste` z boku, `kolano_nad_stopa` z przodu), odrzucenie `glebokosc_wykroku`, `wejscie`, `wolna_noga_w_przod` z poprawnym powodem (brak punktu/rodzaju elementu); wada tylko w stronie nogi (W1).
- Zestawy ogólne (12): do poprawy 8 (W1–W4, Ś3); wyświetlane 4 (Single-Leg High Box, Slider Reverse Lunge, Smith Machine Pistol, Suspended). Crossover Reverse Lunge z zestawem `mobility` (płynny ruch, bez szarpania) — treść pasuje do ruchu.
- Karty własne (12): do poprawy 4 (Step Up, Barbell Step Up — W1; Split Squat — W4; Pistol Squat — W5), wyświetlane 8 (teksty bez zmian i poprawne).
- K10: v1 → zastąpiona: Reverse Lunge, Walking Lunges, Lunges (hantle), Step Up, Pistol Squat, Bulgarian Split Squat (hantle) — po przyjęciu v2.
