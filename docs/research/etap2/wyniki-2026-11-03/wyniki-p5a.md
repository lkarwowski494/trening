# Partia 5, ćwiczenia 1–10 — wyszukiwanie bez Gemini (p5a, 03.11.2026)

Reguła: etap 2 (CLAUDE.md, właściciel 03.11.2026). Setup i move wymagają 2 niezależnych źródeł (szczebel 5 wystarczy, oznaczenie „praktyka”). Mis pochodzi ze źródeł albo jest wnioskiem z ruchu. Liczby i zdrowie pominięte.
Strony aplikacji dopuszczam jako szczebel 5 (`docs/18-przekazanie.md:201`). Szczeble według `szczeble-organizacji-2026-11-02.md`. Fedb ma szczebel 5 i liczy się najwyżej jako 1 źródło. Strony, które przepisują układ fedb, nie liczą się jako niezależne. Nazwy firm są tylko w tym pliku.
Odmiany sprawdziłem w `docs/research/equipment/catalog.json` (wiersze w JSON). Przejrzałem wcześniejsze wyniki (A/C/D): 1–10 miały stan „brak” albo „1 z 3”. Wcześniejsze źródła przeczytałem ponownie przed użyciem (ManiacMuscle). Żadnej pozycji nie przeniosłem bez ponownego odczytu.
Wszystkie pozycje mają stan „otwarte”, czyli czekają na recenzję niezależną (L-047). Cytaty i miejsca są w `wyniki-p5a.json`.
Uwaga o cytatach: WebFetch oddaje dosłownie najwyżej ok. 125 znaków. Dłuższe zdania cytuję we fragmentach.

## Wynik

| # | Ćwiczenie | Stan | Źródła liczone (setup / move) | Koszt (wyszukania / strony) |
|---|---|---|---|---|
| 1 | Slider Reverse Lunge | komplet (mis z 2 źródeł) | Adam Kemp (MS, ISSA CPT); Mark Lauren | 1 / 2 |
| 2 | Smith Incline Shoulder Raise | **rozbieżność ruchu, bez zdań**: 1 źródło dla odmiany ze Smithem | fedb (exercise.com przepisuje układ fedb) | 1 / 7 |
| 3 | Smith Machine Hip Raise | **1 źródło** (fedb) | inne strony o tej nazwie opisują most biodrowy albo hip thrust | 1 / 5 |
| 4 | Smith Machine Leg Press | komplet (setup to część wspólna; mis z 2 źródeł) | fedb; ManiacMuscle | 0 / 3 |
| 5 | Smith Machine Pistol Squat | **częściowo**: niezależność drugiego źródła niepewna | fedb; RitFit (sprzedawca, te same szczegóły co fedb) | 1 / 4 |
| 6 | Smith Machine Reverse Calf Raise | **częściowo**: niezależność drugiego źródła niepewna | fedb; Motra (układ jak fedb) | 2 / 3 |
| 7 | Snatch Shrug | komplet (mis z 2 źródeł) | Catalyst Athletics (sz. 4); fedb; exercise.com | 1 / 4 |
| 8 | Spell Caster | komplet (move to część wspólna; mis: wniosek z 2 opisów) | fedb; weighttraining.guide (M. Livelo); SetForSet | 1 / 3 |
| 9 | Stability Ball Hip Bridge | komplet (mis z 1 źródła i wniosek) | fedb; Virtuagym; trainwell (oraz S17 potreningu.pl z wyników C) | 1 / 3 |
| 10 | Stair Climber | komplet (mis z 3 źródeł) | Motra; Gymkee; Dummies (strona bez autora) | 1 / 4 |

Komplet: 6 (nr 1, 4, 7, 8, 9, 10). Częściowo: 2 (nr 5, 6). Jedno źródło: 2 (nr 3; nr 2 dodatkowo z rozbieżnością ruchu). Brak: 0.
Koszt łącznie: 10 wyszukań i 38 odczytów stron (z odczytami fedb), czyli średnio 1,0 wyszukania i 3,8 strony na ćwiczenie.
Szczebel 4 w parze ma tylko nr 7. Pozostałe pozycje z kompletem są na poziomie „praktyka”.

## Rozbieżności do recenzji (nie weszły do zdań)
- **Smith Incline Shoulder Raise:** fedb (i exercise.com, który przepisuje jego kroki) opisuje sztangę trzymaną z lekko ugiętymi łokciami i wypchniętą do pełnego wyprostu rąk. To krótkie wyciskanie. Weighttraining.guide (E. Lord, odmiana z hantlami) opisuje proste łokcie i unoszenie samych barków znad ławki, czyli ruch łopatek. Nazwa „shoulder raise” pasuje do drugiego opisu. ExRx (Smith, mięsień zębaty) zwrócił 403. Recenzent musi porównać to z rysunkiem i zdecydować, który ruch pokazuje aplikacja. Do tej decyzji nie piszę zdań.
- **Smith Machine Hip Raise:** w fedb ćwiczenie należy do grupy core: leżenie na ławce, stopy na sztandze nad sobą, podwinięcie miednicy. Lyfta i Cora Health pod tą samą nazwą opisują most biodrowy albo hip thrust. To inny ruch, więc go nie liczę.
- **Smith Machine Pistol Squat:** RitFit (sprzedawca) ma własne zdania i listę błędów, ale te same szczegóły co fedb: stopa ok. 12 cali przed sztangą, pauza na dole, wyprost kolana i biodra. Koordynator musi zdecydować, czy to drugie źródło. Major Fitness opisuje odmianę ze sztangą trzymaną w dłoniach, a nie na plecach.
- **Smith Machine Reverse Calf Raise:** Motra pisze innymi słowami, ale w tym samym układzie co fedb (podest pod sztangą, pięty na podeście, przytrzymanie na górze). To ta sama wątpliwość co Motra w p4a nr 4. Lyfta pod tą nazwą opisuje zwykłe wspięcia na palce, czyli inny ruch.
- **Snatch Shrug:** fedb pochyla tułów lekko do przodu. Catalyst trzyma go zasadniczo pionowo i dopuszcza minimalne pochylenie. W zdaniu jest „prawie pionowo”.
- **Spell Caster:** źródła różnią się co do tempa. WTG radzi płynnie i bez machania, SetForSet każe ruszać się „swiftly”, „somewhat explosive”. Tempo nie weszło do zdań. Punkt dolny też się różni: przy biodrze, przy kolanie albo „w dół na bok”, więc w zdaniu jest „nisko na jeden bok”.
- **Stair Climber:** katalog nie mówi, jaki to typ maszyny (`cardio.stair`). Motra opisuje ruchome schody, Dummies stepper z pedałami. Zdania pasują do obu. Postawa: Dummies dopuszcza lekkie pochylenie w biodrach, Motra mówi „upright”.
- **Slider Reverse Lunge / Stability Ball Hip Bridge:** pytanie z wyników C (czy ślizgacz albo piłka to „wariant sprzętu” zakroku albo hip thrustu) przestaje być potrzebne, bo są już 2 opisy samej odmiany.

## Otwarte pytania
- [OTWARTE] Smith Incline Shoulder Raise: który ruch pokazuje rysunek, wyciskanie czy ruch łopatek przy prostych rękach? Bez drugiego niezależnego opisu odmiany ze Smithem.
- [OTWARTE] Smith Machine Hip Raise: brak drugiego opisu odmiany z fedb (core, stopy na sztandze).
- [OTWARTE] Pistol Squat (RitFit) i Reverse Calf Raise (Motra): czy te źródła liczyć jako niezależne?
- Kemp (MS, ISSA CPT) ma autora z kwalifikacjami, więc może mieć szczebel 4 warunkowo. W JSON wpisałem 5.
- Nieczytelne strony: ExRx (403), fitwill (403), fitbod (403), Planet Fitness (403).
