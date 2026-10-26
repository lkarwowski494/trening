# Postęp — wskazówki dla 709 ćwiczeń (25.10.2026)

- Po 224 ćwiczeniach (pliki 01–02): 211 z zestawem, 13 otwartych (94%).
- Po 424 (01–04): 372 z zestawem, 52 otwarte (88%) — w 03–04 dużo strongmana, rzutów, szyi i kettlebelli.
- Po 709 (01–07 + 08-korekty): **640 z zestawem (90,3%)** — 102 własne (data.json), 538 ogólne (wariant A); **69 otwartych**.
- Po NSCA Basics (25.10.2026, `wskazowki-nsca.json/md`): 109 wskazówek potwierdzonych (89 wprost, 20 kierunkowo), 4 sprzeczne
  (`sq.kneesPast` — zostaje dzięki szczeblowi 3; `lunge.torso`, `pp.dip`, `row.bbPull` — propozycje nowych tekstów), 3 różnice bez zmian; nowy błąd `lpd.mis.lean`;
  **otwartych nadal 69** (podręcznik żadnego nie opisuje wprost). NSCA Basics = szczebel 4 (materiał szkoleniowy, nie stanowisko).
- Kąty i oddech (`katy-oddech.json/md`): 2 kąty (palce w przysiadzie 15–20°, łokcie przy wyciskaniu ok. 45° — z zastrzeżeniem ACE),
  2 wskazówki oddechu (spokojny oddech w izometrii; wydech przy wysiłku tylko w ćwiczeniach izolowanych i na maszynach). Valsalva — nie.

## Jak czytać pliki

1. `wskazowki-slownik.json` + `wskazowki-slownik-uzupelnienie.json` + `newCues`/`newCue` w meta plików 06 i 08 + `newCues` w `wskazowki-nsca.json` — teksty PL, twierdzenia i źródła (adres + miejsce/cytat). Istniejące zdania: odesłanie `data:<ćwiczenie>` do lib/cues/data.json.
2. `wskazowki-cwiczenia-01…07.json` — wszystkie 709 ćwiczeń w kolejności katalogu (01 = 124 bazowe z szablonów i generatora).
3. Korekty mają pierwszeństwo: meta.corrections w 04, potem cały plik 08, potem propozycje tekstów w `wskazowki-nsca.json` → conflicts (do decyzji).
4. `katy-oddech.json` — kąty i oddech z listą źródeł sprawdzonych pod kątem sprzeczności.

## Niepełne zestawy (do decyzji: pokazać czy dopracować)

- 1 ✓ zamiast 2–4: ok. 30 ćwiczeń (skoki jednonóż, skakanka, siady z leżenia, zwis, rzuty, Split Jerk itd.) — oznaczone „1 ✓” w polu chk.
- brak ✕: ok. 20 (noszenie, sanki, maszyny cardio, podrzuty, rzuty, Assault Bike) — brak sprawdzonego błędu w 2 źródłach.
- NSCA Basics nie domknął żadnego z nich dwoma źródłami (kolana przy lądowaniu, „bez pauzy w ugięciu” — po jednym źródle; [OTWARTE]).

## Otwarte (69) — grupy

szyja 5; strongman i sanki 12 (Conan, opona, kamienie, beczka, worek, log, circus bell, power stairs, sled row/reverse flye/overhead walk/OH triceps, bear crawl drag); rzuty leżąc i chest pass 4; nietypowe barki 7 (Bradford, Cuban, pirate ships, incline shoulder raise ×3, Svend); przedramię 4 (pronacja, supinacja, wrist roller, plate pinch); core 11 (GHD sit-up, dragon flag, L-sit, side bend hantlem*, butt-ups, cocoons, press sit-up, side jackknife, Bosu cable crunch, stomach vacuum, Smith hip raise); gimnastyka 4 (rope climb, muscle up, HSPU, London bridges); pozostałe ~22 (Sissy, Reverse Nordic, Around the Worlds, Machine Pullover, Body-Up, BW triceps ext, hip flexion band, Kneeling squat ×2, Smith reverse calf, Downward facing balance, Carioca, Spider crawl, Spell caster, Sledgehammer, Jerk balance, Rack delivery, Figure 8, MB chest pass…).
\* Side Bend (hantel) w 03 pozostał otwarty, choć Barbell Side Bend w 06 ma zestaw sideBend — do ujednolicenia (można przenieść, ta sama analogia).
