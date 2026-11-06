# STAN — paczka D (etap 2), 03.11.2026 — WSZYSTKIE ĆWICZENIA ZBADANE; zostało scalenie JSON

Pliki: `wyniki-D.md` (tabela + szczegóły części 1), `wyniki-D.json` (część 1), `wyniki-D-czesc2.md/.json` (curl),
`wyniki-D-czesc3.md/.json` (delt_raise częściowo), `wyniki-D-czesc4.md/.json` i `wyniki-D-czesc4b.md/.json` (delt_raise do końca, forearm, Dumbbell Clean),
`wyniki-D-czesc5.md` + `wyniki-D-czesc5b.md` (opisy) i `wyniki-D-czesc5.json` (JSON dla 5 i 5b, 33 ćwiczenia).

Następny krok (jedyny): scalić `wyniki-D.json`, `-czesc2`, `-czesc3`, `-czesc4`, `-czesc4b`, `-czesc5` w `wyniki-D-calosc.json`
(część 4 nadpisuje część 3 dla Dumbbell One-Arm / Smith One-Arm / Smith Machine Upright Row). Najprościej skryptem (`node -e` / `jq -s add`
+ odfiltrowanie 3 wpisów z części 3) — agent bez Bash nie scalał, bo ręczne przepisanie wszystkich JSON-ów przekroczyłoby limit kontekstu.

Część 5 (33 ćwiczenia; wcześniejsza liczba „30” w liście była błędna — paczka liczy więcej niż 77, do sprawdzenia przy scaleniu):
- komplet: Barbell Rear Delt Row („łokcie na boki” tylko M — jedno źródło).
- komplet – uproszczenie (częściowo): Calf-Machine Shoulder Shrug (move, mis; setup otwarty).
- 2 z 3: Double KB Front Rack Carry; 2 z 3 – uproszczenie: One-Arm Medicine Ball Slam, Bottoms-Up Clean From The Hang (chwyt dnem do góry otwarty).
- 1 z 3: One-Arm KB Split Jerk (S), Muscle Up (F), Kneeling High Pulley Row (M), Leverage High Row (M), Sledgehammer Swings (S), Jefferson Squat (S), Tire Flip (S).
- brak: Kettlebell Pirate Ships, Kettlebell Sumo High Pull, Clean Shrug, Snatch Shrug, Rack Delivery, Full ROM Lat Pulldown (do decyzji recenzenta),
  Sled Row, Middle Back Shrug, Rickshaw Carry, Sled Drag (Harness), Sled Forward Drag with Press, Sled Overhead Backward Walk, Spider Crawl,
  Supine One-/Two-Arm Overhead Throw, Circus Bell, Conan's Wheel, Keg Load, Log Lift, Power Stairs, Sandbag Load.

Pułapki: brak narzędzia Edit — pliki przepisywać całe (Write). Respo `?s=` nie działa — WebSearch z allowed_domains. Fabryka Siły: /atlas-cwiczen/ i /cwiczenia/ = ta sama firma.
M: strony bywają tylko jako tytuły w listach linków — adres `maniacmuscle.com/<nazwa-z-myślnikami>/` wprost (znalezione: kneeling-cable-high-row, lever-high-row).
S: artykuły potreningu.pl (nie tylko atlas) to ten sam serwis — liczą się jako jedno źródło S.
Uproszczenie wariantu sprzętu (koordynator 03.11.2026): tylko gdy ruch stawów ten sam; zmiana pozycji ciała, zakresu albo dodany drugi ruch = nie wariant.
