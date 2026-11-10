# Recenzja niezależna rodziny v2 `kneeling_hinge` — partia 5, runda r1 (audytor, 10.11.2026)

Stan zamrożony: gałąź `figury/partia-5-kneeling_hinge` @ c483874 (worktree odłączony). Autor: programista (subagent, sesja session_01T66VByZrLpWxNF8yF3gpgu). Recenzent: audytor (subagent). Bramka 4, L-047, L-050.

**Werdykt: `wyswietlana`** (brak KRYTYCZNYCH i WYSOKICH; S1 ŚREDNIE → backlog, poprawka tania).

Skróty (`node scripts/zrodla-runtime.mjs --skroty` w worktree recenzenta): v2 `kneeling_hinge` = `bd7c66c9bb27`; zestawy `Seated Good Mornings` = `6d8665e4bef9`. `liczba` z `assignAll()` = 2 (Seated Good Mornings, Kneeling Squat).

## Znaleziska

| ID | Poziom | Pewność | Opis | Kroki | Realność | Miara / dowód |
|---|---|---|---|---|---|---|
| S1 | ŚREDNIE | 95% | Brak styku „siedzenie” (seat): kolider miednicy wisi 2,30 cm nad skrzynią, powyżej progu `CONTACT.surface` 1,5 cm, więc `contactsOf` daje tylko stopy i dłonie. Na rysunku świecą stopy i dłonie, a pośladki na skrzyni nie — choć sylwetka wizualnie siedzi (obrys dotyka krawędzi skrzyni, ok. 1 px). | Ćwiczenie Seated Good Mornings → rysunek techniki (poświaty styków rysuje `components/ExerciseFigureV2.tsx:36` przez `contactShapes`) | realny (każde otwarcie) | `gap(pelvis, box)` = 2,30 cm, `gap(thighR, box)` = 2,07 cm w każdej klatce (miednica stała [0; 57,8], skrzynia top 46; `lib/figures/v2/poses/kneeling_hinge.json`). Wzorzec: Box Squat ma `seat` (`tests/figures-v2-styk-skrzynia.test.ts`). Poprawka: miednica y ≤ 57,0 (≤ 56,8 dla ≤ 1 cm); test: `contactsOf(frameAt(spec,u))` zawiera `seat` dla u co 0,05. |

## Sprawdzone bez znalezisk

- **Ruch (K4–K8)**: arkusz własny `rec-kneeling_hinge/Seated-Good-Mornings-side.png` (21 kadrów co 0,05, widok side — jedyny w `views`), obejrzany w pełnej rozdzielczości, kadry u 0 i u 1 powiększone 3×, styk miednicy 8×. Tułów 2,0° → 44,0° od pionu, zgięcie kręgosłupa 0 w każdej klatce, biodro (mierzone) 78,2° → 119,5°; miednica nieruchoma na skrzyni (x 0 w obrębie skrzyni −30…8), stopy na podłodze (pięty i palce w styku), kolano ok. 90°, głowa w linii (30,8° przy tułowiu 44°). `checkFrame` = [] dla u 0; 0,25; 0,5; 0,75; 1 (brak przenikania). Fazy: Opuszczanie 2 s / Pauza / Prostowanie 1 s / Pauza, `lowerFirst`.
- **Sztanga na plecach**: w każdej klatce 12,8 cm za środkiem barków prostopadle do osi tułowia i 3,0 cm poniżej wzdłuż osi (odległość 13,1–13,2 cm, zmiana ≤ 0,1 cm) — ta sama konwencja co zrecenzowane Good Morning i Back Squat (identyczne wartości), czyli górna część pleców, nie kark. Ślad (`info.load`) = środek gryfu = chwyt (0,0 cm); tor gryfu łukiem w przód i lekko w dół (x −11,2 → 23,4, y 105,2 → 100,5), zgodny z obrotem tułowia wokół biodra. Animacja błędu `mis.roundBack` (zgięcie kręgosłupa do 26°): gryf dalej 12,9–13,2 cm od barków, nie odrywa się.
- **Zakres wobec reguł** (`data/zrodla/figury-sens.json`, kneeling_hinge): pochylenie — zmiana 42° ≥ 30°, maks. 44° ≤ 95°; plecy — zgięcie 0° w przedziale −20…10°.
- **Nakładka**: brak pliku `lib/figures/v2/overlay/kneeling_hinge.ts` uzasadniony merytorycznie. Obie reguły opierają się na źródłach zawiasu stojąc (NSCA/ACE, NASM) przeniesionych na siad; siad z unieruchomioną miednicą to inna pozycja, nie wariant sprzętu tego samego ruchu, więc wyjątek „uproszczenie” z CLAUDE.md nie ma zastosowania. „Analogia” jest poprawną oceną, żadna reguła nie kwalifikuje się do „ustalone”. Decyzja o wyjątku od „żadna rodzina bez nakładki” — koordynator.
- **Zestaw ogólny (K12)** Seated Good Mornings (`general`, f `rdl`): `hinge.back` („Plecy proste (neutralne) przez cały ruch”) — zgodne (zgięcie 0°); `gm.light` („Zacznij od bardzo lekkiego ciężaru…”) — nie dotyczy geometrii, rysunek nie przeczy; `mis.roundBack` — animacja błędu pokazuje zaokrąglenie pleców, zgodne.
- **Karty własne / v1 (K10, K11)**: brak kart własnych i wpisów v1 dla obu ćwiczeń — nic do „zastapiona”.
- **Kneeling Squat**: zestaw `open`, `figureSpec` = null, brak w eksporcie strony (233 = 232 + 1) — nie trafia do v2.
- **Testy (K14)** `git diff 13a3eb7..c483874 -- tests/`: wyłączenie kneeling_hinge z pętli ogólnej w `figures-v2-data` zastąpione osobnym testem sprawdzającym te same własności (lowerFirst, staw, fazy — z własnymi czasami 2 s / 1 s, wzrost kąta ≥ 30° z reguły); pozostałe zmiany to dopisanie rodziny i liczników (+1). Bez poluzowań. Uruchomione `--runInBand`: nakładka (4), data (20), mapping (8), generator-odtwarza (10), tor (198) — zielone.
