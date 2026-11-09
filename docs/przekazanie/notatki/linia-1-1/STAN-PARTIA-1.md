# Stan — partia rodzin 1 (linia 1.1)

Gałąź `figury/partia-1` od `origin/integracja-1-1` @ aeabf69. Zlecenie koordynatora 09.11.2026 (sesja koordynatora linii 1.1).
Rodziny: calf_raise, row, kb_ballistic, chest_fly, overhead_press (kolejność: od najmniejszej — pomiar czasu na rodzinę).
Brief autora rodziny: `briefy/partia-1-autor.md`. Recenzja: subagent `audytor` (≠ autor), pliki `docs/research/recenzje/partia1-<rodzina>-*`.

Zysk z `node scripts/pokrycie-symulacja.mjs` (09.11.2026, przed pracą): overhead_press +21, chest_fly +17, kb_ballistic +16, calf_raise +12, row +12 (pełna karta).

| Rodzina | Autor (SHA) | Recenzja ruchu | Nakładka/zestawy | Wpisy | Stan |
|---|---|---|---|---|---|
| calf_raise | — | — | — | — | w toku |
| row | — | — | — | — | otwarte |
| kb_ballistic | — | — | — | — | otwarte |
| chest_fly | — | — | — | — | otwarte |
| overhead_press | — | — | — | — | otwarte |

## chest_fly (autor, 09.11.2026, gałąź figury/partia-1-chest)

Zrobione: podłączenie (`families.ts` ready, `LOAD` i `DATA_UI` w `poseData.ts`: Unoszenie/Opuszczanie, stawy shElev i shAbd), nakładka `overlay/chest_fly.ts` (`flyElbowLimb` z góry i z boku, `pulloverElbowLimb` z boku), test `tests/figures-v2-chest-fly-p1.test.ts` (22 testy), listy w testach wspólnych z datą (mapping nie dotykany; nakladka-triceps-olympic 8 rodzin, strona-eksport 183 → 200, hasTechnique Pec Deck → Sissy Squat, data: staw/kierunek chest_fly, JERK_TEMPO_RODZINY, Crucifix top; tor: chest_fly w LUKOWE z progiem 46), pochodne (macierz, pokrycie, README, docs/51, reguly-cwiczen).
Zostało: zestawy ogólne i karty (programista partii), wpisy recenzji, recenzja niezależna.
Pułapki: `Band Chest Fly` poza miarą styku `stykKlatki` (zastępczy odcinek uchwytu przecina tułów); Crucifix „top” = osoba stojąca z góry (box h < 50), wyjątek w teście data; 3 ćwiczenia bez rysunku (Around The Worlds, Machine Pullover, Svend Press — brak źródła ruchu, WYJATKI w generatorze).

Wnioski z oglądania arkuszy (arkusze poza repo, na tej maszynie: /home/user/arkusze-partia-1/chest_fly/{slad,nakladka}; nowa sesja generuje je ponownie: `node scripts/figures/arkusz-slad.mjs --out <dir> --key "<ćw>"`, `arkusz-nakladka.mjs --family chest_fly`, NODE_PATH=/opt/node-tools/node_modules):
- Obejrzane w pełnej rozdzielczości: Chest Fly (hantle) top i side, Cable Fly side, Pec Deck top i side, Pullover (hantel) side, Wide-Grip Decline Barbell Pullover side. Pozostałe 12 ćwiczeń × 2 rzuty NIE obejrzane okiem (tylko testy liczbowe: ślad ≤ 3 cm, styk, łokieć, łuk) — do obejrzenia przed recenzją: Incline/Decline, One-Arm, wyciągi leżąc, Cable Fly high/low, Single Arm, Band, Crucifix, pozostałe pulloovery.
- Bez wad ruchu w obejrzanych: ślad w chwycie R, brak przenikania ławki, hantle osią wzdłuż ciała w rozpiętce, pullover bez przenikania głowy (ręce z boku głowy).
- Uwagi dla recenzenta: u = 0 rozpiętki leżąc to ramię poziome (a = 0°) — hantle na wysokości barków, nie poniżej (karta: „dol_na_wysokosci_barkow” jedno źródło, min −10 cm); ramię prawie pionowo na końcu (92°). Łuk łokcia (14°) w nakładce jest mały i w rzucie z góry/z boku silnie skrócony — element rysuje się, ale słabo widoczny. Pec Deck: dźwignia rysowana jako ukośny pręt od punktu 15 cm pod dłonią (prop `dzwignia`, tryb obrót) — nie przypomina ramienia maszyny; do oceny recenzenta. Cable Fly stojąc: bloczek na ścianie za plecami na wysokości głowy, nie po bokach.
- Zgłoszenia silnika (nie ruszane): MeasuredJoint bez nadgarstka/łopatki nie dotyczy; widoki rodziny = top+side także dla Crucifix (stojący, „top” bezsensowny — wyjątek w tests/figures-v2-data.test.tsx); Band Chest Fly poza stykKlatki.
- Testy: batch `tests/figures-v2 tests/figury tests/strona-eksport.test.ts tests/skrot-v2-*` uruchomiony po ostatnich zmianach; wynik w raporcie koordynatorowi. Czerwone dozwolone: figury-recenzja, karty-recenzja, recenzja-wyjatki, zrodla-runtime (skróty), l047.
Następny krok: obejrzeć pozostałe arkusze, zestawy ogólne (przeczące: bp.contact na Chest Fly (hantle) — id z karty własnej, do recenzji; mcp.blades Pec Deck), karty v1 do „zastapiona” (K10/K11), recenzja niezależna.
