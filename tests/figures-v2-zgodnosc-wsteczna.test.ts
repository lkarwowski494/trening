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
