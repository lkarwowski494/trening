# Recenzje ruchu przed 1.1 (zbiorczo)

Decyzja właściciela 27.10.2026 (docs/18, wariant A): niezależna recenzja ruchu każdej rodziny przed wydaniem 1.1. Metoda: `../pilotaz/recenzja-n6.md`. Jeden wiersz na rodzinę; szczegóły w pliku rodziny.

| Rodzina | Ćwiczeń | OK | OK z uwagą | BŁĄD | Walidator | Szczelność reguł | Plik |
|---|---|---|---|---|---|---|---|
| cable_row | 9 | 2 | 4 | 3 | 9/9 OK | 0 z 3 (0%) | [cable_row.md](cable_row.md) |
| pulldown | 8 | 1 | 6 | 1 | 8/8 OK | 0 z 1 (0%) | [pulldown.md](pulldown.md) |
| cable_press | 4 | 2 | 2 | 0 | 4/4 OK | 0 z 0 (brak błędów) | [cable_press.md](cable_press.md) |
| back_extension | 3 | 0 | 1 | 2 | 3/3 OK | 0 z 2 (0%) | [back_extension.md](back_extension.md) |
| kneeling_hinge | 1 | 0 | 1 | 0 | 1/1 OK | — | [kneeling_hinge.md](kneeling_hinge.md) |
| dip | 5 | 3 | 1 | 1 | 5/5 OK | 0 z 1 (0%) | [dip.md](dip.md) |
| overhead_press | 21 | 5 | 14 | 2 | 21/21 OK | 0 z 1 (0%) | [overhead_press.md](overhead_press.md) |
| row | 12 | 1 | 10 | 1 | 12/12 OK | 0 z 1 (0%) | [row.md](row.md) |
| pull_up | 11 | 0 | 8 | 3 | 11/11 OK | 0 z 3 (0%) | [pull_up.md](pull_up.md) |
| curl | 36 | 14 | 21 | 1 | 36/36 OK | 0 z 1 (0%) | [curl.md](curl.md) |
| triceps | 29 | 26 | 2 | 1 | 29/29 OK | 0 z 1 (0%) | [triceps.md](triceps.md) |
| delt_raise | 30 | 25 | 4 | 1 | 30/30 OK | 0 z 1 (0%) | [delt_raise.md](delt_raise.md) |
| chest_fly | 17 | 11 | 1 | 5 | 17/17 OK | 0 z 1 (0%) | [chest_fly.md](chest_fly.md) |
| shrug (opcjonalna) | 8 | 0 | 8 | 0 | 8/8 OK | — | [shrug.md](shrug.md) |
| forearm (opcjonalna) | 11 | 8 | 3 | 0 | 11/11 OK | — | [forearm.md](forearm.md) |
| rotator_cuff (opcjonalna) | 7 | 5 | 1 | 1 | 7/7 OK | 0 z 1 (0%) | [rotator_cuff.md](rotator_cuff.md) |

## Partia rec-11 (dip, overhead_press, row, pull_up, curl, triceps, delt_raise, chest_fly + shrug, forearm, rotator_cuff), 27.10.2026

Pozy z `origin/integracja-1-1` @ 4e5a7f95. Podglądy z istniejących póz rysowałem własnym skryptem (`htmlPodgladu` z `v2-validate.mjs`). Nie używałem `agent-pozy/run.mjs --podglad`, bo on generuje pozy od nowa z generatora.

Wynik partii:

- **187 ćwiczeń, walidator 187/187 OK.**
- **11 znalezisk BŁĄD w 16 ćwiczeniach.** Szczelność reguł automatycznych: 0 z 11 (0%).
- Kolumna „BŁĄD” liczy ćwiczenia; chest_fly ma 1 znalezisko w 5 ćwiczeniach, a overhead_press 1 w 2.

Klasy błędów w tej partii (każdy przechodzi walidator):

1. **Wariant nie różni się od bazy / ma cechę innego ćwiczenia:**
   - Arnold Press = Overhead Press (hantle): ≤ 3,3 cm różnicy;
   - Wide-Grip Rear Pull-Up = podciąganie przodem;
   - Ring Dips = dip na drążku;
   - Scapular Pull-Up bez ruchu łopatek.
2. **Ustawienie sprzeczne ze wskazówką `setup` wyświetlaną przy ćwiczeniu:**
   - One Arm Row bez ławki, wolna dłoń w powietrzu;
   - Reverse Pec Deck plecami do oparcia;
   - Concentration Curl bez oparcia łokcia o udo.
3. **Ruch w ćwiczeniu izometrycznym:** Dead Hang (kolana 12° → 52°).
4. **Przenikanie dłoni i sprzętu w dwóch rękach:** 5 rozpiętek leżąc (dłonie 0,4 cm od siebie), Tate Press (1,0 cm, przedramiona skrzyżowane).
5. **Merytoryka obciążenia:** External Rotation z hantlem na stojąco w płaszczyźnie poziomej (bez oporu).

Uwagi przekrojowe (backlog, nie blokują):

- **Maszyny dwuręczne z jedną dźwignią** (`dzwignia` z `trzyma: "R"`). Dotyczy 9 ćwiczeń:
  - Dip Machine, Pec Deck, Reverse Pec Deck, Machine Lateral Raise, Machine Biceps Curl, Machine Triceps Extension, Leverage Shrug, Calf-Machine Shoulder Shrug;
  - podobnie Machine Lateral Raise.

  Lewa ręka robi ruch w powietrzu. Kontrakt pozwala dać dwa wpisy sprzętu (R i L), tak jak Double Kettlebell Press.
- **Leżenie przodem na ławce skośnej z biodrem −37°** (wyjątek zakresu `hipMin −45`, 7 ćwiczeń). Anatomicznie poza zakresem, a da się narysować bez wyjątku (stopy na podłodze za siedziskiem). Szczegóły: `row.md`, uwaga D.
- **Animacja wahadłowa (0 → 1 → 0) nie oddaje ruchów naprzemiennych i asymetrycznych:**
  - Zottman: obrót tylko na górze;
  - Side To Side Chins i Car Drivers: tylko w jedną stronę.

  To ograniczenie silnika, a nie póz. Potrzebny tryb „pętla” albo dwie fazy.
- **Zwis ze środkiem ciężkości 18 cm za drążkiem** w 9 ćwiczeniach rodziny pull_up (`pull_up.md`, uwaga E).
- **Wyciskania stojące i siedzące** (14 ćwiczeń) zaczynają z chwytem na wysokości ust, 14 cm nad barkiem (`overhead_press.md`, uwaga A).

Proponowane mechanizmy (szczegóły w plikach rodzin):

- niezmienniki bez warunku cechy: `dlonie_nie_przenikaja`, `izometryczne_bez_ruchu`;
- reguły „wariant ↔ baza”: `wariant_rozny_od_bazy`, `za_kark_glowa_przed_drazkiem`;
- reguły zgodności z `setup`: `podparcie_ze_wskazowki`, `podparcie_lokcia`, `wolna_reka_podparta`;
- `ciezar_wolny_pod_grawitacje`;
- `barki_obnizaja`;
- rozszerzenie `nogi_nieruchome` o oś y i kąt kolana.

Progi to konwencja rysunku do potwierdzenia przez badacza. Dobrane na tych samych danych, więc to wynik w próbie, a nie dowód szczelności.
