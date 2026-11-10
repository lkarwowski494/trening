/*
 * Figury v2 — zgodność wsteczna kontraktu poza@2 (26.10.2026, rozszerzenie modelu figury o obrót i skręt tułowia, skłon boczny, przechył miednicy, barki, nadgarstek):
 * WSZYSTKIE gotowe figury (87 z rigów), przykłady z rigów w kontrakcie (exampleFor) i pozy zapisane w lib/figures/v2/poses/*.json mają dawać BAJTOWO ten sam rysunek co przed rozszerzeniem.
 * Wzorzec (odciski SHA-256 dokumentu SVG i surowych kształtów) powstał na silniku sprzed zmiany: tests/fixtures/figury-v2-zlote.json.

 * Zmiana celowa 26.10.2026 (badacz, runda 4): rigi „Cable Pull Through”, „Incline Bench Press (hantle)”, „Smith Machine Stiff-Legged Deadlift”, „Stiff-Legged Barbell Deadlift” mają poprawione parametry (kolano, biodro, łokieć pod chwytem) — tylko ich odciski zmieniono we wzorcu, pozostałe 83 figur bez zmian.
 * Zmiana celowa 27.10.2026 (poprawki p2, runda 3): odciski 8 póz — Leg Press, Pendulum Squat, Lying Machine Squat, Belt Squat Machine (wiersz „kolana do środka”, Leg Press także kolana nad stopami), Hack Squat (dźwignia z przodu nie przechodzi przez głowę, jak w Lying) i 3 × Bulgarian Split Squat (mniejsze „kolano do środka”, bez przenikania ud).
 * Zmiana celowa 27.10.2026 (poprawki p2, runda 4): odciski 7 póz — Leg Press (bez wiersza „kolana do środka”), Pendulum Squat, Lying Machine Squat (kolano do środka −6,4°), Hack Squat (dźwignia z przodu ukryta w całym ruchu, nie miga) i 3 × Bulgarian Split Squat (kolano do środka −11°, z ≈ +4,5 cm).
 * Zmiana celowa 28.10.2026 (scalenie main do linii 1.1, PR #81: poprawione tory ciężaru w rigach hinge, bench_press i squat połączone ze zmianami 1.1): odciski rigów i przykładów z rigów odtworzone na scalonym silniku (53 rigi, 48 przykładów różniły się od wzorca 1.1); pozy z danych bez zmian
 * Zmiana celowa 04.11.2026 (olympic po recenzji ruchu R1, fala F2): odciski 24 póz olympic odtworzone (rack na przodzie barków, pierwszy ciąg, podrzut pionowo, Jerk Balance, Snatch Balance, przechwyty); pozostałe rodziny bez zmian.
 * Zmiana celowa 04.11.2026 (olympic, poprawka 2 po R1): odciski póz olympic z palcami w podporze w miejscu (R6), mniejszym podbiciem pięty w zarzutach i Clean/Snatch Shrug z pionowym tułowiem; pozostałe rodziny bez zmian.
 * Zmiana celowa 04.11.2026 (olympic, poprawka 3 po R2): odciski póz olympic — rack na przodzie barków z łokciami do przodu (zarzuty) albo niżej i na boki (podrzuty), stopy na podłodze w ćwiczeniach bez lotu (wspięcie 0,4 cm), krótszy lot w wykroku; pozostałe rodziny bez zmian.
 * Zmiana celowa 04.11.2026 (olympic, poprawka 4): odciski póz olympic — ręce w pionie nad głową w rwaniach i podrzutach (większe pochylenie tułowia w przechwycie), wyjątek barku OVERHEAD_SHOULDER_EXCEPTION; pozostałe rodziny bez zmian.
 * Zmiana celowa 31.10.2026 (scalenie wersja-1-0-1-r2 do linii 1.1): odciski 49 rigów i 45 przykładów z rigów odtworzone — poprawki rigów 1.0.1 zrecenzowane niezależnie (docs/research/figury-recenzja.json v2: start z podłogi, gryf przy nogach, wąski chwyt, JM/Skull Crusher, Band/Chain Press, Zercher, Sumo hantel, OHS); pozy z danych (lib/figures/v2/poses) bajtowo bez zmian.
 * Zmiana celowa 31.10.2026 (fale napraw ACG-008/009/012/013/019/020): odciski 13 póz z danych — calf_raise: Seated Calf Raise, Seated Calf Raise (hantle), Barbell Seated Calf Raise, Dumbbell Seated One-Leg Calf Raise; core_floor: Crunch, Sit Up, Janda Sit-Up, Oblique Crunches - On The Floor; curl: Barbell Curl, EZ Bar Curl, Hammer Curl; leg_isolation: Seated Band Hamstring Curl; mobility_stand: Standing Gastrocnemius Calf Stretch. Każda ma zmianę w lib/figures/v2/poses/*.json; pozostałe pozy i rigi bez zmian.
 * Zmiana celowa 01.11.2026 (fala 25, rodzina pull_up po pierwszej recenzji niezależnej): odciski 9 póz — Pull Up, Chin Up, Neutral Grip Pull Up (błąd pu.partial na dole, ręce proste ≤ 8°, klatka u = 0,05), Mixed Grip Chin, One Arm Chin-Up, Gorilla Chin/Crunch (ręce proste, klatka u = 0,05), Wide-Grip Rear Pull-Up (ręce proste z generatora), Gironda Sternum Chins (mostek do drążka), Side To Side Chins (podciągnięcie ku jednej dłoni); Dead Hang i Scapular Pull-Up bez zmian
 * Zmiana celowa 03.11.2026 (partia P2 mocy, karty własne): odcisk pozy sled_throw: Wall Ball (bez wiersza „kolana do środka” sq.mis.kneesIn; karta własna nie zawiera tego błędu, a walidator dopuszcza tylko błędy ćwiczenia). Pozy thruster (Kettlebell Thruster, Thruster (hantle)) po recenzji kart zostają z wierszem „pięty” sq.mis.heels, który mają karty (runda poprawek 03.11.2026, zregenerowane generatorem) — odciski jak przed partią.
 * Zmiana celowa 04.11.2026 (fala wspólna FW1, contract.ts withDumbbellAxis): odciski 18 póz z danych z hantlami i obrotem przedramienia / przedramieniem w poprzek ciała — oś hantla lewej ręki jest lustrem prawej (H-A), oś ⟂ przedramieniu (H-B): curl × 7 (Biceps Curl (hantle), Incline Curl (hantle), Preacher Curl, Spider Curl, Lying Supine Dumbbell Curl, Standing Inner-Biceps Curl, Standing Dumbbell Reverse Curl), delt_raise × 4 (Lateral Raise (hantle), Upright Row (hantle), Reverse Fly (hantle), Y Raise (hantle)), Crucifix, Wrist Curl (hantle), Reverse Wrist Curl (hantle), Arnold Press, External Rotation (hantel), Reverse Flyes With External Rotation, Thruster (hantle); rigi i przykłady z rigów bajtowo bez zmian (tests/figures-v2-fala-wspolna-1.test.ts).
 * Zmiana celowa 04.11.2026 (fala wspólna FW2, contract.ts withDumbbellAxis, S-1): odciski 19 póz z danych z hantlami — oś ⟂ przedramieniu płynnie, bez skoków (calf_raise × 2: Seated Calf Raise (hantle), Dumbbell Seated One-Leg Calf Raise; chest_fly × 5: Chest Fly (hantle), Crucifix, Decline Dumbbell Fly, Incline Chest Fly (hantle), One-Arm Flat Bench Dumbbell Fly; core_standing × 2: Side Bend (hantel), Weighted Ball Side Bend; delt_raise × 3: Dumbbell Front Raise to Overhead, Reverse Fly (hantle), Y Raise (hantle); Dumbbell Clean; Arnold Press; External Rotation (hantel); Reverse Flyes With External Rotation; Thruster (hantle); Triceps Kickback; Two-Arm Dumbbell Kickback); żadna z rodzin ready (squat, bench_press, hinge, curl, pull_up) — rigi i przykłady bajtowo bez zmian (tests/figures-v2-fala-wspolna-2.test.ts).
 * Zmiana celowa 04.11.2026 (rodzina delt_raise po recenzji ruchu R1): odciski 8 póz — Front Raise, Alternating Deltoid Raise, Dumbbell Front Raise to Overhead, Cable Front Raise (płaszczyzna strzałkowa), Cable Seated Lateral Raise (kolumny wewnątrz dłoni), Car Drivers (obrót w obie strony), Y Raise (hantle) (leżenie przodem na ławce), Machine Lateral Raise (dwie dźwignie); nowy wpis: Dumbbell Lying One-Arm Rear Lateral Raise (poza z fali F1). Poprawka 04.11.2026 (tests/figury-p2-r3.test.ts, uda bez przenikania): odcisk tej pozy zmieniony ponownie — górna noga o 3 cm wyżej (NOGI_DY w generatorze).
 * Zmiana celowa 04.11.2026 (rodzina delt_raise po recenzji ruchu r2): odciski 3 póz — Alternating Deltoid Raise (dwa powtórzenia: przód, bok; r2-W1), Dumbbell Lying One-Arm Rear Lateral Raise (leżenie przodem, zwis i bok do wysokości barku; r2-W2), Smith Machine One-Arm Upright Row (szyna w x chwytu; r2-N1). Reszta wzorca bez zmian (diff 3 wpisów).
 * Zmiana celowa 04.11.2026 (rodzina triceps, poprawki rysunku r2 po recenzji R1): odciski 4 póz z danych — Machine Triceps Extension (podpórka na ramiona zamiast oparcia), Lying Close-Grip Barbell Triceps Extension Behind The Head (ramię ok. 20° od pionu, gryf za czubkiem głowy), Incline Barbell Triceps Extension (ławka 15° zamiast 55°), Tate Press (dane bez obrotu przedramienia: po FW2 −80° odchylało oś hantla od poprzecznej). Reszta wzorca bez zmian.
 * Zmiana celowa 08.11.2026 (partia A1 pchanie, karty własne ukryte do przekładu): odciski 3 póz pushup_plank — Decline Push Up, Suspended Push-Up, Rollout (sztanga): z pliku póz usunięte wiersze błędów spoza karty (push.mis.partial, plank.mis.sag), bo walidator dopuszcza tylko błędy ćwiczenia (jak Wall Ball 03.11.2026); pozostałe pozy bez zmian.
 * Zmiana celowa 09.11.2026 (partia 1 linii 1.1, scalenie gałęzi rodzin): odciski póz z danych row (Chest Supported Row, Lying T-Bar Row — stopy na palcach, W1-r2), curl (Spider Curl ×2 — ta sama poprawka), calf_raise (poprawki r1/r2: linki, Łydki na stopniu) i kb_ballistic (poprawki r1: start i ciąg zarzutu/rwania, jerki, Sumo); recenzje niezależne: docs/research/recenzje/partia1-*.
 * Zmiana celowa 09.11.2026 (chest_fly po recenzji r1 audytora, W1/W3/S3): odciski 3 póz z danych — Band Chest Fly (dwa zaczepy gumy po bokach za plecami zamiast jednego w osi ciała), Wide-Grip Decline Barbell Pullover (chwyt ±35 cm zamiast ±19), Cable Fly (bloczek na wysokości barków, dłonie bliżej, tułów pochylony 12°); pozostałe pozy bez zmian.
 * Zmiana celowa 09.11.2026 (partia 1 linii 1.1, kb_ballistic W1-r2 audytora): odciski 7 póz z danych — Kettlebell Clean, Double Kettlebell Clean, Dumbbell Clean, Kettlebell Snatch, Double Kettlebell Snatch, Snatch (hantel) (start z podłogi), One-Arm Kettlebell Clean and Jerk: ręka prosta do wyprostu bioder, ciężar blisko tułowia; pozostałe pozy bez zmian.
 * Zmiana celowa 10.11.2026 (scalenie integracji do figury/partia-1; partia 1, overhead_press po recenzjach r1/r2 audytora — dół przy przedniej części barków, gryf zza karku prosto w górę, tor ciężaru i rack kettlebella): odciski 15 póz overhead_press z danych przeliczone (ZLOTE_ZAPISZ=1); poza nimi żadna poza się nie zmieniła względem wzorców obu stron, pozy cable_row i pozostałych rodzin integracji bez zmian.
 * Zmiana celowa 09.11.2026 (partia 3 linii 1.1, recenzje niezależne): odciski póz shrug × 7 (r2: chwyt podąża za barkiem, łokcie stałe, tułów nieruchomy — W1–W4), pulldown/Straight Arm Pulldown (N1: kolumna wyciągu za łukiem rąk); hip_abd_add/Lateral Band Walk i Monster Walk usunięte (rysunek wstrzymany, H-1/H-2); ślad dźwigni z punktem styku poza dłońmi (D1 A, figury/slad-dzwignia) — leg_machine, leg_isolation, calf_raise, hip_bridge, glute_floor (Machine Glute Kickback), hip_abd_add (maszyny). Reszta wzorca bez zmian.
 * Zmiana celowa 09.11.2026 (cable_row włączona, partia 2): odcisk pozy Leverage High Row — z przodu dźwignia maszyny nie jest rysowana w całym ruchu, bo w u 0–0,1 jej rzut przechodzi przez głowę (DZWIGNIA_BEZ_GLOWY ∋ cable_row; backlog 1.1, docs/21); Machine Row i pozostałe pozy rodziny bez zmian (dźwignia nie dotyka głowy).
 * Zmiana celowa 09.11.2026 (pushup_plank włączona, partia 2): odcisk pozy Barbell Rollout from Bench — start z biodrami nad kolanami (udo pionowo, jak w rolloucie z podłogi) zamiast bioder cofniętych (120°), dzięki czemu wysokość miednicy maleje monotonicznie (wcześniej +6 cm w u 0–0,1; tests/figures-v2-kierunek-u.test.ts); pozostałe pozy rodziny bez zmian (Plyo Push-Up zmienia tylko tryb pętli, nie rysunek klatek kluczowych).
 * Zmiana celowa 10.11.2026 (mobility_floor po recenzji niezależnej r1 — W1, Ś1, Ś2; r2 wyswietlana): odciski 3 póz — Child's Pose (ręce wyciągnięte przed siebie, dłonie na podłodze przed barkiem), Side-Lying Quad Stretch (podudzie w płaszczyźnie ciała), Butterfly Stretch (łokcie na udach); tests/figures-v2-mobility-floor-poprawki-r1.test.ts.
 * Zmiana celowa 09.11.2026 (pushup_plank po recenzji niezależnej r1, W1–W3): odciski 16 póz — nogi proste w kolanie ≤ 5° (DL 83,2 zamiast 82,0; kolano 17–20° → 0–5°; w pozach z klęku bez zmian: Rollout (sztanga), Barbell Rollout from Bench), Plyo Push-Up (dłonie na podłodze do zgięcia łokcia 20°, lot po wyproście, lądowanie), Plank Shoulder Taps (zawsze jedna dłoń na podłodze); pozostałe rodziny bez zmian.
 * Zmiana celowa 09.11.2026 (partia B2 figury nóg, karty własne z A2 ukryte do recenzji): odciski 5 póz — Split Squat, Lunges (sztanga), Barbell Walking Lunge, Barbell Step Up (lunge) i Slider Hamstring Curl (leg_isolation): z pliku póz usunięty rząd błędu spoza karty (lunge.mis.kneeIn, ht.mis.arch), klatki ruchu bez zmian; Slider Hamstring Curl dodatkowo przebudowany na most zgodny z kartą (biodra w górze w całym ruchu; decyzja koordynatora 09.11.2026, wariant A); pozostałe pozy bez zmian.
 * Zmiana celowa 10.11.2026 (partia 4, recenzje niezależne r1–r4 po wzorcu zapisanym przy włączeniu rodzin): odciski 6 póz — back_extension/Back Extension i Reverse Hyperextension (poprawki styku podpórki), cable_press/Seated Cable Chest Press i Wyciskanie na linkach (stojąc), dip/Dip Machine i Triceps Dips (ławka; ławka wstrzymana w V2_WSTRZYMANE, P4-DIP-1, rysunek nadal liczony przez silnik); pozostałe pozy bez zmian (różnica wzorca ograniczona do tych 6 kluczy).
 * Zmiana celowa 10.11.2026 (rodzina thruster po recenzji r1: W1 koniec wyciskania nad stopą, W2 przysiad do równoległego, W3 powrót ciężaru na barki): odciski 3 póz z danych — Thruster (hantle), Kettlebell Thruster, Clean and Press; pozostałe bez zmian.
 * Zmiana celowa 10.11.2026 (mobility_stand po recenzji r1, W1): odcisk pozy Standing Soleus And Achilles Stretch — dłonie na ścianie (props: ściana x 75), nowa poza wykrokowa; pozostałe rodziny i ćwiczenia bez zmian.
 * Zmiana celowa 10.11.2026 (pushup_plank, naprawa po scaleniu z integracją — strażnik „stopa na podporze” figury-p2-r3, STOPA_BLAD_CM = 1): odciski 7 póz — wiersz błędu plank.mis.sag w Push-Up Wide, Single-Arm Push-Up, Plank, Plank Shoulder Taps, Plyo Push-Up, Suspended Fallout i Standing Barbell Rollout: kostka przesuwa się o ≤ 0,9 cm (było 1,1–2,0 cm), a kąt opadnięcia biodra jest ograniczany limitem przesunięcia (generator: sagKat); w Standing Barbell Rollout lędźwie wracają do neutralnych wolniej. Pozy poprawne bez zmian.
 * Zmiana celowa 10.11.2026 (forearm włączona, partia 5): odciski 8 póz forearm — 7 uginań nadgarstków z wierszem błędu wr.mis.lift (przedramię odrywa się od uda; tekst wskazówki już jest) i Behind-the-Back Barbell Wrist Curl (ramię odchylone w tył o 28° zamiast 22°, sztanga nie wchodzi w udo); plik póz przeliczony z generatora; pozostałe pozy bez zmian.
 * Zmiana celowa 10.11.2026 (forearm, poprawki po recenzji r1): odciski 8 póz forearm — Behind-the-Back Barbell Wrist Curl (W1: dłoń do tyłu, zgięcie nadgarstka unosi sztangę w górę i do tyłu) i 7 uginań siedząc (S2: dół ruchu −45°/+45° zamiast −32°/+40°); pozostałe wpisy bez zmian.
 * Zmiana celowa 10.11.2026 (forearm, recenzja r2 W2): odcisk 1 pozy — Behind-the-Back Barbell Wrist Curl (ramię i przedramię nieruchome, rusza się tylko dłoń; kierunek dłoni liczony jak w silniku); pozostałe wpisy bez zmian.
 * Zmiana celowa 10.11.2026 (integrator partii 5; odciski nie zostały zapisane przy poprawkach r1/r2 rodzin): odciski 7 póz — carry: Farmer's Walk, Farmer's Walk (Farmers Handles), Overhead Carry (hantle), Double Kettlebell Front Rack Carry (r1: W1 pozycja rack, W2 ślad toru gryfu sześciokątnego, S2 chwyt neutralny hantli) i core_hang: Hanging Knee Raise, Hanging Leg Raise, Toes to Bar (r2: słupek przy drążku); wzorzec przeliczony ZLOTE_ZAPISZ=1, diff dokładnie tych 7 wpisów; pozostałe wpisy bez zmian.
 * Zmiana celowa 10.11.2026 (rodzina kneeling_hinge po recenzji r1, S1): odcisk pozy Seated Good Mornings — skrzynia 47,3 cm zamiast 46 (miednica i sztanga bez zmian), żeby świecił styk „seat” (tests/figures-v2-styk-siedzenie-kneeling-hinge.test.ts); pozostałe pozy i rigi bez zmian (diff 1 wpisu).
 * Zmiana celowa 10.11.2026 (rotator_cuff włączona, partia 5): odciski 6 póz rotator_cuff — plik póz przeliczony z generatora (niezrecenzowana rodzina); guma z zaczepem trzymana jedną ręką (External/Internal Rotation with Band), Band Pull Apart kończy 76° od przodu (guma nie przechodzi przez klatkę), pozostałe wiersze błędów zgodne z kartami; pozostałe pozy bez zmian.
 * Odtworzenie wzorca (tylko świadomie, gdy rysunek ma się zmienić): ZLOTE_ZAPISZ=1 npx jest tests/figures-v2-zgodnosc-wsteczna.test.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';
import {
  figureSpec, shapesAt, boundsOf, svgDocument, figurePalette, exampleFor, dataShapes, ERRORS, CUE_TO_ERROR, faultApplicable, assignAll, CONTRACT,
  type PoseData, type View, type Shape,
} from '@/lib/figures/v2';
import { CATALOG } from '@/lib/catalog.generated';
import { light } from '@/lib/theme';
import { INNA_ARYTMETYKA } from './helpers/inna-arytmetyka';

const ROOT = path.join(__dirname, '..');
const GOLD = path.join(__dirname, 'fixtures', 'figury-v2-zlote.json');
const U = [0, 0.25, 0.5, 0.75, 1];
const sha = (s: string): string => createHash('sha256').update(s).digest('hex').slice(0, 20);
const r9 = (_k: string, v: unknown): unknown => (typeof v === 'number' ? Math.round(v * 1e9) / 1e9 + 0 : v);
const pal = figurePalette(light);
/** Linux: odcisk SVG i kształtów bajtowo; inna arytmetyka (macOS arm64, 06.11.2026): tylko kształty — odcisk SVG zależy od zaokrąglenia tekstu na granicy (helpers/inna-arytmetyka.ts). */
const widoczne = (o: { svg: string; raw: string }): Partial<{ svg: string; raw: string }> => (INNA_ARYTMETYKA ? { raw: o.raw } : o);

/** Odcisk serii kształtów: SVG (to widzi użytkownik) i surowe kształty zaokrąglone do 1e-9. */
function odcisk(listy: Shape[][]): { svg: string; raw: string } {
  const box = boundsOf(listy);
  return { svg: sha(listy.map(l => svgDocument(l, box, pal, 1)).join('\n#\n')), raw: sha(JSON.stringify(listy, r9)) };
}

function figuryRigow(): Record<string, { svg: string; raw: string }> {
  const out: Record<string, { svg: string; raw: string }> = {};
  for (const key of Object.keys(CATALOG).sort()) {
    const spec = figureSpec(key); if (!spec || !['squat', 'bench_press', 'hinge'].includes(spec.family)) continue; /* tylko rigi z kodu; rodziny z danych (pull_up…) obejmuje sekcja „dane” */
    const listy: Shape[][] = [];
    for (const view of spec.views) {
      for (const u of U) listy.push(shapesAt(spec, u, view, true));
      for (const e of Object.keys(ERRORS) as (keyof typeof ERRORS)[]) if (ERRORS[e].kind === 'pose' && faultApplicable(spec, e)) for (const u of U) listy.push(shapesAt(spec, u, view, false, e));
    }
    out[key] = odcisk(listy);
  }
  return out;
}

const WSZYSTKIE_ERR: Record<string, string> = Object.fromEntries(Object.entries(CUE_TO_ERROR).map(([cue, id]) => [id, cue]));
function przykladyZRigow(): Record<string, { svg: string; raw: string }> {
  const out: Record<string, { svg: string; raw: string }> = {};
  for (const key of Object.keys(CATALOG).sort()) {
    const d = exampleFor(key, WSZYSTKIE_ERR); if (!d) continue;
    const listy: Shape[][] = [];
    for (const view of ['side', 'front', 'top'] as View[]) for (const u of U) { listy.push(dataShapes(d, u, view)); d.bledy.forEach((_, j) => listy.push(dataShapes(d, u, view, j))); }
    out[key] = odcisk(listy);
  }
  return out;
}

function pozyZDanych(): Record<string, { svg: string; raw: string }> {
  const out: Record<string, { svg: string; raw: string }> = {};
  const dir = path.join(ROOT, 'lib/figures/v2/poses');
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.json')).sort()) {
    const dane = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as { rodzina: string; cwiczenia: Record<string, PoseData> };
    for (const [cw, d] of Object.entries(dane.cwiczenia)) {
      const listy: Shape[][] = [];
      for (const view of ['side', 'front', 'top'] as View[]) for (const u of [...U, 0.1, 0.9]) { listy.push(dataShapes(d, u, view)); d.bledy.forEach((_, j) => listy.push(dataShapes(d, u, view, j))); }
      out[`${dane.rodzina}/${cw}`] = odcisk(listy);
    }
  }
  return out;
}

const teraz = (): { rigi: Record<string, { svg: string; raw: string }>; przyklady: Record<string, { svg: string; raw: string }>; dane: Record<string, { svg: string; raw: string }> } => ({ rigi: figuryRigow(), przyklady: przykladyZRigow(), dane: pozyZDanych() });
jest.setTimeout(240000);

if (process.env.ZLOTE_ZAPISZ) {
  test('zapis wzorca (ZLOTE_ZAPISZ=1)', () => { fs.writeFileSync(GOLD, JSON.stringify(teraz(), null, 1) + '\n'); });
} else {
  describe('zgodność wsteczna poza@2: rysunek gotowych figur i póz z danych bez zmian (bajtowo)', () => {
    const zlote = JSON.parse(fs.readFileSync(GOLD, 'utf8')) as ReturnType<typeof teraz>;
    const t = teraz();
    test('wzorzec obejmuje 87 gotowych figur, 87 przykładów z rigów i wszystkie pozy z poses/ (niezmienniki wzorca)', () => {
      expect(Object.keys(zlote.rigi)).toHaveLength(87); expect(Object.keys(zlote.przyklady)).toHaveLength(87); expect(Object.keys(zlote.dane).length).toBeGreaterThanOrEqual(2);
      expect(Object.keys(assignAll()).length).toBe(709); expect(CONTRACT.legacy).toContain('figury-v2/poza@1');
    });
    test.each(Object.keys(zlote.rigi))('rig %s: SVG i kształty identyczne', key => { expect([key, widoczne(t.rigi[key])]).toEqual([key, widoczne(zlote.rigi[key])]); });
    test.each(Object.keys(zlote.przyklady))('przykład z rigu w kontrakcie %s: SVG i kształty identyczne', key => { expect([key, widoczne(t.przyklady[key])]).toEqual([key, widoczne(zlote.przyklady[key])]); });
    test.each(Object.keys(zlote.dane))('poza z danych %s: SVG i kształty identyczne', key => { expect([key, widoczne(t.dane[key])]).toEqual([key, widoczne(zlote.dane[key])]); });
    test('te same zbiory kluczy (nie ubyło ani nie przybyło figury/pozy bez świadomej zmiany wzorca)', () => {
      expect(Object.keys(t.rigi)).toEqual(Object.keys(zlote.rigi)); expect(Object.keys(t.przyklady)).toEqual(Object.keys(zlote.przyklady)); expect(Object.keys(t.dane)).toEqual(Object.keys(zlote.dane));
    });
  });
}
