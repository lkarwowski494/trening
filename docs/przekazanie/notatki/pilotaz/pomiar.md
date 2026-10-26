# Pilotaż póz: agent vs Gemini — pomiar strony „agent” (26.10.2026)

Metoda: generator rodziny (`scripts/figures/agent-pozy/<rodzina>.mjs` + wspólny `model.mjs`, runner `run.mjs`), pozy liczone z modelu (FK/IK, długości kości, sprzęt), parametry per ćwiczenie, błędy jako delty liczone z trajektorii (`dotyczy` z silnika). Walidacja: `waliduj()` (geometria + reguły sensu). Log przebiegów: `pomiar-log.jsonl`.

## Tabela

| | pushup_plank | core_floor |
|---|---|---|
| Ćwiczeń w zakresie zadania | 25 | 13 (z czego Scissor Kick wykreślony przez koordynatora → 12) |
| Wygenerowane generatorem | 19 | 12 |
| Wyjątki (kontrakt tego nie narysuje) | 6 | 0 |
| Czas: start zadania → generator gotowy do 1. przebiegu | ok. 13 min (wspólny kod + czytanie silnika ok. 7 min) | ok. 6 min |
| Czas: do pierwszego pełnego zielonego przebiegu | 21 min od startu (7 przebiegów) | 30 min od startu (8 przebiegów) |
| Czas po scaleniu 633c2ad (nowe reguły: klatka ≤ 20 cm nad dłońmi, łokcie) | +5 przebiegów, ok. 3 min | +5 przebiegów (1 regresja mojej zmiany łokcia), ok. 3 min |
| Iteracje generatora (przebiegi całej rodziny) | 7 przed scaleniem, 12 łącznie | 8 przed scaleniem, 13 łącznie |
| Zaliczone za 1. przebiegiem generatora | 9/19 = 47% | 3/13 = 23% |
| Zaliczone na końcu | 19/19 = 100% (z 19 generowanych; 76% z 25 w zakresie) | 12/12 = 100% |
| Wywołania narzędzi (szacunek, cały pilotaż) | ok. 105 łącznie; ok. 45 na pushup_plank, ok. 40 na core_floor, reszta wspólna (czytanie, scalenie, testy) | |

Porównanie z Gemini (rejestr `data/figury-bledy-modelu.json`): pull_up 6/11 za 1. razem (v2), core_floor 6/17 za 1. razem i 8/17 po 1 rundzie. Agent: 47% i 23% za 1. razem, ale iteracja trwa ok. 1–2 s i nie wymaga człowieka; pętla zbiegła do 100% w 5–8 przebiegach (ok. 10 min na rodzinę). Gemini wymaga kroku właściciela (wklejenie, odesłanie) na każdą rundę. Uwaga: 1. przebieg agenta to pierwszy przebieg całego generatora napisanego „na sucho” z modelu, bez wcześniejszej walidacji (poza sprawdzeniem wzorca Push Up), więc jest porównywalny z 1. odpowiedzią Gemini.

## Co było trudne (uczciwie)

- Rodzaje błędów 1. przebiegu to w większości błędy generatora, nie modelu: pominięty trzeci wymiar w miednicy, literówki w nazwach pól, brak filtrowania błędów po liście wskazówek ćwiczenia (Push Up nie ma `plank.mis.sag`), nadpisanie podbicia. To klasa, którą Gemini robi inaczej (halucynuje liczby), a agent robi chochliki w kodzie. Mechanizm: `zbuduj` filtruje błędy po `bledyCwiczenia`.
- Systematyczne luki w wiedzy o walidatorze, które agent odkrywał dopiero iteracją: kąt kostki liczony symetrycznie (`|kierunek goleni − podbicie| − 90`, więc stopa „palcami w górę” przy nogach nisko i „w dół” wysoko to dwie gałęzie, między którymi interpolacja przechodzi przez zakazany zakres; rozwiązanie: stała stopa zgięta podeszwowo o 45° albo grałęź „w górę” zależnie od ćwiczenia); limit ramienia 170° wyklucza ramiona w osi tułowia (trzeba 10° luzu i biegun łokcia do dołu); stopy nigdy nie wskazują do tyłu (brak palców skierowanych do tyłu: Superman na brzuchu ma stopy obrócone na zewnątrz).
- Reguła „skrajna” (najdalsza para bark–kostka) przy sztywnym ciele wskazuje u = 0 (remis), więc Suspended Fallout wymagał lekko ugiętego startu, żeby ocena trafiła w u = 1. To luka walidatora, nie pozy (zgłoszona w uwagach).
- Parametry dobrane przeszukiwaniem siatki (nie z modelu analitycznie): rollouty (fi1, wysokość kolana, kąt sag), biegun kolana w Mountain Climbers. Ręcznie wpisane: kształt każdego ćwiczenia (które punkty, jaki zakres, sprzęt). Z modelu wyliczone: łuk ciała w podporze, łokieć z odległości bark–chwyt, FK nóg, biegun kolana z FK, `dotyczy`, delty błędów.
- Po scaleniu nowych reguł (klatka ≤ 20 cm nad dłońmi) pompki trzeba było przeliczyć (łokieć 95° → 142°, kąt ≈ 45°) i podwyższenia przeprojektować (ręce przed barkami, krótsza skrzynia). Zmiana polegała na parametrach, nie na przepisywaniu póz.

## Co wyglądają „szablonowo” (ocena podglądów)

Wszystkie pompki (Push Up, Wide, Close-Grip, Diamond, Decline, Incline, Incline Close-Grip, Suspended, Clock) są jednym wzorcem z innym chwytem/sprzętem — poprawne, ale wizualnie podobne; różnica to rozstaw rąk, wysokość podparcia, nachylenie ciała. Leżące (Crunch Hands Overhead, Reverse Crunch, Leg Pull-In, Cocoons) dzielą szkielet FK. Przybliżone, do oceny recenzenta (nie „szablon”, tylko uproszczenie): Clock Push-Up (przestawione dłonie, bez skoku), Plyo Push-Up (dłonie 12 cm nad podłogą), Alternate Heel Touchers (bez skłonu bocznego, ręka sięga w stronę pięty), Superman (stopy obrócone na zewnątrz), Tuck Crunch (kostki blisko, nie skrzyżowane), Cocoons (ruch ramion niejednoznaczny w opisie), Suspended Push-Up/Fallout (uchwyty jako drążek).

## Czego nie da się zrobić bez Gemini lub bez zmiany kontraktu

- Sześć ćwiczeń pushup_plank poza kontraktem: Side Plank, Copenhagen Plank, Push Up to Side Plank, Isometric Wipers (potrzebny obrót tułowia wokół osi długiej — kontrakt ma tylko pochylenie strzałkowe i barki zawsze poziomo), Drop Push, Incline Push-Up Depth Jump (skrzynie po bokach — sprzęt wyśrodkowany w z = 0). To nie jest kwestia generatora: zrobiłby to także Gemini tylko po rozszerzeniu kontraktu (roll tułowia, skrzynia z przesunięciem z). Pięć dalszych (Ab Wheel, Plyo Kettlebell, Renegade Row, piłka, Smith) poza sprzętem kontraktu — bez zmian.
- Wszystko, co wymaga oceny „czy to wygląda jak to ćwiczenie”, wymaga recenzenta; generator tego nie sprawdza (walidator sensu jest tylko tak dobry jak reguły).
- Gemini ma przewagę tam, gdzie ćwiczenie nie ma prostej parametryzacji (swobodna poza); agent ma przewagę w powtarzalności, szybkości iteracji i braku kroku ludzkiego. Scissor Kick: Gemini zaliczył go dopiero z automatyczną stopą (633c2ad); mój generator miał go na pierwszej ścieżce, ale wykreślono go z pilotażu.

## Wniosek dla decyzji właściciela (do oceny koordynatora)

Dla rodzin z jedną strukturą ruchu (pompki, leżące core) generator agenta daje 100% zaliczeń geometrii i sensu w ok. 10 minutach na rodzinę bez udziału właściciela; koszt to kod generatora (ok. 300 linii na rodzinę), który amortyzuje się przy zmianie reguł (przeliczenie zamiast ponownego pytania modelu). Rekomendacja: agent dla rodzin parametrycznych, Gemini dla rodzin ze swobodną, nietypową pozą; recenzent ruchu obowiązkowy dla obu.

## Szacunek dla reszty biblioteki (ok. 44 rodzin poza gotowymi i pilotażowymi), 3–4 agenty równolegle

Założenia z pomiaru: rodzina parametryczna ≈ 10–20 min pracy agenta (generator + 5–8 iteracji + przegląd podglądów); rodzina z nietypowym sprzętem lub ruchem ≈ 30–60 min; wspólny moduł (model.mjs) już jest. Średnio ok. 30 min na rodzinę → ok. 22 h pracy agentów łącznie, przy 3–4 równolegle ok. 6–8 h zegarowo.
Dodatkowo (poza czasem agentów): reguły sensu od badacza dla każdej rodziny (blokada: bez reguł rodzina jest wstrzymana, ok. 1–2 h badacza na rodzinę, równolegle), recenzent ruchu na każdą rodzinę, CI tests.yml (ok. 20+ min na przebieg, kolejka), rozszerzenia kontraktu (roll tułowia, sprzęt poza osią z, wyciągi/maszyny/piłka/hantle/kettlebell/zawieszenie jako sprzęt) ≈ 0,5–1 dnia pracy agenta i decyzja właściciela. Realny kalendarz: 2–3 dni robocze, z czego większość to oczekiwanie na badacza, recenzenta i CI.
Główne ryzyka: (1) sprzęt spoza kontraktu (cable, maszyny, hantle, piłka) — bez rozszerzenia kontraktu ok. 1/3 ćwiczeń to wyjątki; (2) luki walidatora (np. reguła „skrajna” przy sztywnym ciele, symetryczny kąt kostki) powodują fałszywe porażki lub fałszywe zaliczenia — każda wymaga poprawki w v2-sens/validate, a zmiana może uzdatnić już nałożone rodziny (regresja jak po 633c2ad: pompki wymagały przeliczenia); (3) „zaliczone ≠ dobre” — walidator nie widzi złego ruchu, więc recenzent jest wąskim gardłem; (4) szablonowość (wiele ćwiczeń jednej rodziny wygląda tak samo); (5) ćwiczenia jednostronne/asymetryczne i dynamiczne (olympic, plyo, strongman) — kilkanaście klatek i limity szybkości; (6) zmiany reguł przez badacza w trakcie pracy zmuszają do przebiegów powtórnych (tanie dzięki generatorom).
