# Recenzja niezależna bramki 4 — rodzina `leg_machine` (partia 3), 09.11.2026

- Recenzent: audytor (L-047: autor = programista partii 3, recenzent ≠ autor; L-050: arkusze ze śladem toru).
- Stan: `figury/partia-3` @ `37333dc6`, czysta kopia `git archive` w `/tmp/rec-p3-leg`.
- Skrót: `node scripts/zrodla-runtime.mjs --skroty` → v2.leg_machine `39d2c2b68d32` (zgodny z oczekiwanym).
- Testy (pojedyncze pliki, `--runInBand`, czysta kopia): figures-v2-tor 197/197, figures-v2-slad-dzwignia 3/3, figures-v2-kierunek-u 51/51,
  figures-v2-nakladka-kazda-rodzina 12/12, figures-v2-styk 24/24, figury-sens-ewaluatory 63/63, figures-v2-data 18/18.
- Werdykt: **wyswietlana (6/6)**. Bez znalezisk KRYTYCZNYCH ani WYSOKICH. S-1, S-2, N-1, N-2 → backlog.

## Znaleziska

| ID | Poziom | Pewność | Ćwiczenia | Opis | Realność | Dowód |
|----|--------|---------|-----------|------|----------|-------|
| S-1 | ŚREDNIE | 90% | Hack Squat, Pendulum Squat, Lying Machine Squat | Sprzęt nie wygląda jak maszyna. Jest dźwignia obrotowa: w Hack i Lying ma 140 cm, a oś wisi w powietrzu przed figurą albo nad nią — Hack (119,9; 116,2), Lying (82,7; 157). W Pendulum ma 100 cm, oś jest za oparciem przy podłodze, a ramię przechodzi przez oparcie. Tymczasem `gear.ts:280` opisuje hack_squat jako „prowadnica, punkt: miednica — wózek z oparciem”. Oparcie stoi w miejscu, a ciało sunie po nim. Nie ma poduszek barkowych, dłonie są na biodrach. Karta Hack Squat (`hack.setup2`) mówi: „barki pod poduszkami”. Ruch ciała jest poprawny: miednica sunie równolegle do oparcia, stopy płasko. Ślad przy miednicy jest prosty. | realny (widać w każdym kadrze), bez błędu ruchu ani treści | `lib/figures/v2/poses/leg_machine.json` (sprzet), `lib/figures/v2/gear.ts:280`, `/tmp/rec-p3-leg/ark/light/Hack-Squat-side.png`, `Lying-Machine-Squat-side.png`, `Pendulum-Squat-side.png` |
| S-2 | ŚREDNIE | 85% | Belt Squat Machine | Nie ma pasa biodrowego, choć sprzęt `pas` istnieje (`gear.ts:376`). Ciężar to ramię 33 cm od miednicy do osi zawieszonej w powietrzu przed udami (12,8; 60,7); w dolnych kadrach ramię leży wzdłuż uda. Ruch (przysiad) jest poprawny. | realny (widać), bez błędu ruchu | `/tmp/rec-p3-leg/ark/light/Belt-Squat-Machine-side.png` (u=0, u=1) |
| N-1 | NISKIE | 90% | Single Leg Press | Brak elementu nakładki i linii. Element `legMachineKneeLimb` ma regułę `zakres`, a ćwiczenie ma tylko `zakres_jednonoz`; `overlay.ts:66` filtruje elementy po regułach ćwiczenia. Pominięcie zgadza się z praktyką „tylko ustalone” (pewność reguły: „ustalone (analogia jednonóż)”), ale nie jest zapisane w komentarzu `overlay/leg_machine.ts:65–67`. | realny (spójność z Leg Press) | `/tmp/rec-p3-leg/nak/cwiczenia.json` |
| N-2 | NISKIE | 90% | Pendulum, Lying, Hack | Teksty `lp.heels` i `hack.setup2` mówią o platformie, a na rysunku stopy stoją na podłodze — platformy maszyny nie ma. | realny (kosmetyka) | `/tmp/rec-p3-leg/ark/light/Pendulum-Squat-side.png` |

## Ocena ćwiczeń (arkusze śladu: light i dark, nakładka)

- **Leg Press** (tylko z boku): plecy i miednica na oparciu (tułów −10°, miednica stała). Platforma jedzie po prostej pod −15°, prostopadle do płyty. Podeszwy leżą płasko na płycie. Kolano 86° → 15° (reguła `zakres`: ≥ 80° / ≤ 25°, bez blokowania). Ślad = kostka R, prosty (0,02 cm). Podpis „odstęp −7,0 cm” to artefakt miary: ramię dźwigni od punktu styku w kostce jest zasłonięte butem, przenikania nie widać (kadr w pełnej rozdzielczości).
- **Single Leg Press**: jak Leg Press dla prawej nogi. Lewa noga stoi nieruchomo, stopa na podłodze przed siedziskiem (`slp.setup`: „drugą zdejmij z platformy i trzymaj nieruchomo”). Uwaga N-1.
- **Hack Squat**: miednica sunie równolegle do oparcia 65° (przesunięcie 12,5 / 26,7 = tg 25°), tułów stały, kolano 22° → 100°, stopy płasko. Z przodu kolana nad stopami. Uwaga S-1.
- **Pendulum Squat**: te same pozy końcowe co Hack, pośrodku lekki łuk miednicy (1,14 cm). Błąd „kolana do środka” widać w rzucie z przodu. Uwagi S-1, N-2.
- **Lying Machine Squat**: oparcie 42°, miednica równolegle do oparcia, kolano 21° → 100°. Uwagi S-1, N-2.
- **Belt Squat Machine**: kolano 8° → 108°, tułów 4° → 30°, kręgosłup 0°. Biodra idą w tył i w dół, kolana nad stopami (z przodu). Błędy „kolana do środka” i „pięty” widać w kadrach błędu. Uwaga S-2.
- **Calf Press (leg press)**: bez v2, zostaje rysunek v1 (figureFor ≠ null, wpis v1 „wyswietlana”). **Smith Machine Leg Press**: bez rysunku (wyjątek generatora).

## Ślad (D1 A)

`contract.ts:330–334`: dźwignia z punktem „podeszwy”/„kostki” → kostka strony `trzyma` (R przy „obie”); „miednica” → miednica. Sprawdzone przez `frameAt` w u = 0; 0,5; 1:
suwnice — ślad = kostka R; maszyny przysiadu i belt squat — ślad = miednica. Ślad ma sens w obu przypadkach: na suwnicy to tor platformy pod stopą, w maszynach — tor wózka albo pasa przy miednicy.

## Wyjątek toru `Belt Squat Machine|side`

**Potwierdzony.** `ksztaltToru` (tests/figures-v2-tor.test.ts:20) w czystej kopii daje odchylenie 6,82 cm i 0 zawróceń (z przodu 0,00 cm). To tor bioder w przysiadzie: najpierw w tył, potem w dół, bez „S”. Kształt łuku współwyznacza ramię 33 cm (S-2).

## Nakładka (`overlay/leg_machine.ts`)

Element `legMachineKneeLimb` (linia uda i łuk kolana, reguła `zakres`, rzut z boku) rysuje się w Leg Press, Hack, Pendulum i Lying; kąty jak wyżej, reguła spełniona. Pominięcia uzasadnione:
- `przysiad` (Belt) — pewność „ustalone (kierunek)”;
- `kolana_nad_stopami` — linia kneeToe i tak rysuje się z GUIDES w Leg Press, Pendulum, Lying i Belt;
- `miednica_stala`, `piety`, `stopa_na_platformie` — to styki.

Jedyna luka to Single Leg Press (N-1).

## DATA_UI.leg_machine

- Maszyny przysiadu: u = 0 to góra, faza 0 → 1 to Opuszczanie 2 s, potem Wstawanie 1 s (`lowerFirst: true`).
- Suwnice: u = 0 to nogi zgięte, faza 0 → 1 to Wypychanie 1 s, potem Opuszczanie 2 s (`lowerFirst: false`).

Kierunek zgadza się z pozami, staw: kolano. Strażnik kierunku u przechodzi (51/51).

## Karty i zestawy

- **Leg Press** (karta własna, `kartaSkrot` 2596b6e0425a): `lp.setup`, `lp.move`, `lp.noLock`, `lp.heels`, `lp.hips` zgadzają się z rysunkiem v2. `sq.kneesToes` i `sq.mis.kneesIn` przy rysunku tylko z boku — rysunek im nie przeczy. → wpis „karty” wyswietlana; v1 8219dd20f3d3 → zastapiona.
- **Single Leg Press** (31a48b7b300b): zgodna. **Hack Squat** (3ad7ace7cd4d): zgodna, poza pominięciem poduszek (S-1).
- **Zestawy:** squatMachine (91e221d3a561) dla Pendulum i Lying — zgodny (N-2 kosmetyka); squat (9358e2eddadc) dla Belt Squat Machine — zgodny.

## Obszary sprawdzone bez znalezisk

Ruch i zakres zgięcia; oparcie i miednica; stopy płasko i pięty; kolana w linii stóp (z przodu); przenikanie ciała z oparciem i z podłogą; ślad i jego sens; wyjątek toru; DATA_UI; motyw ciemny (czytelność śladu i sprzętu); spójność kart i zestawów.

Stała lista (dane, migracje, prywatność, sekrety): zmiana dotyczy tylko rysunków i danych póz, nie zapisu danych użytkownika — nie dotyczy.
