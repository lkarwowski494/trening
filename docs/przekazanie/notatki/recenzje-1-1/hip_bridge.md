# Recenzja ruchu 1.1: rodzina hip_bridge (10 ćwiczeń), 27.10.2026

Metoda jak w `back_extension.md` (`origin/integracja-1-1` @ 4e5a7f95, zapisane pozy, PNG w pełnej rozdzielczości, liczby z silnika v2, kierunek zgięcia kolana, styk z oparciem).

Walidator: **10/10 OK**. Błędów: 0.

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| Glute Bridge | OK | Leżenie tyłem, stopy płasko. Miednica y 9,5 → 31,4, biodro 47° → −10° (na górze 3,7 cm nad linią bark–kolano, czyli praktycznie w linii z `gb.move`), kolano 101° → 82°, barki na podłodze, pięty stale na podłodze. Wiersz błędu `ht.mis.arch` widoczny na górze |
| Glute Bridge (sztanga) | OK | Jak wyżej, sztanga na biodrach przytrzymana dłońmi (dłoń ≤ 1,3 cm od gryfu) |
| Frog Pump | OK z uwagą | Mostek do −9°, kolana szeroko (±22,4), stopy blisko (kostki ±5), palce na zewnątrz. Uwaga A |
| Single Leg Glute Bridge | OK | Noga pracująca jak w Glute Bridge. Wolna noga uniesiona (kolano 31°) i na górze w przedłużeniu uda (biodro 18°) |
| Hip Thrust (sztanga) | OK | Górna część pleców na krawędzi skrzyni (43 cm; tułów 0,5–2 cm od blatu), sztanga na biodrach. Miednica y 25,3 → 52,5 (na górze na wysokości barków), biodro 61° → −7°, kolano 98° → 82°, golenie prawie pionowo, jak w `ht.setup` / `ht.move` |
| Hip Thrust (hantel) | OK | Jak wyżej, hantel pionowo na biodrach przytrzymany dłońmi (`ht.dbSetup`) |
| Single Leg Hip Thrust | OK | Jak Hip Thrust, wolna noga uniesiona i na górze w przedłużeniu |
| Smith Machine Hip Thrust | OK | Jak Hip Thrust, sztanga na pionowej prowadnicy |
| Machine Hip Thrust | OK z uwagą | Ruch jak Hip Thrust. Uwaga B |
| Stability Ball Hip Bridge | OK z uwagą | Plecy na piłce (promień 32,5), stopy na podłodze, miednica y 45,9 → 64,8. Uwaga C |

## OK z uwagą (backlog, nie blokuje)

- **A. Frog Pump: stopy nie łączą się podeszwami.** W tym ćwiczeniu podeszwy stóp się stykają (stopy na zewnętrznych krawędziach), kolana opadają szeroko na boki, a pięty są blisko pośladków. Tu stopy stoją płasko, kostki są 10 cm od siebie, palce na zewnątrz. Z boku poza wygląda tak samo jak Glute Bridge, różnicę widać tylko w rzucie z przodu (kolana szerzej). Pewność 60%.
- **B. Machine Hip Thrust: maszyny nie widać.** `dzwignia` to krótki pręt w poprzek bioder, bez ramy i pasa lub poduszki. Ta sama klasa co `leg_isolation.md` (uwaga A) i `leg_machine.md` (uwaga A). Pewność 60%.
- **C. Stability Ball Hip Bridge: przeprost na górze.** W u = 1 biodro ma −15° (pozostałe mostki od −7° do −10°), a miednica leży 5,8 cm nad linią bark–kolano. Kolano otwiera się do 42°, kolano jest 20 cm niżej niż miednica, a goleń pochyla się 21° w przód (stopy przed kolanami). Wskazówka `gb.noArch`: „Nie wypychaj bioder wyżej niż linia tułowia”. Typowa góra to tułów i uda w linii, golenie pionowo, kolano ok. 90°. Pewność 55%.
