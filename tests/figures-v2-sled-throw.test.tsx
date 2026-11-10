/*
 * sled_throw włączona jako `ready` (partia 8, 10.11.2026; decyzja właściciela 03.11.2026 wariant A): 8 ćwiczeń z rysunkiem v2 — sześć w pętli jednokierunkowej (slamy, rzuty, Wall Ball: jedna faza „Rzut”)
 * i dwa w trybie cyklicznym (Sled Push, Sled Drag (Harness): faza „Marsz”). Prezentacja z domyślnych wpisów (ONE_WAY_UI / GAIT_UI w dataUiForPose), bez DATA_UI rodziny — wpis rodziny nadpisałby domyślny
 * dla wszystkich ćwiczeń (poseData.ts). Wall Ball ma dwa widoki (błąd „kolana do środka” widać tylko z przodu, families.ts EXERCISE_VIEWS), reszta tylko z boku.
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: ten test sprawdza rysowanie, nie recenzję rodziny */
import { FAMILY, DATA_UI, GAIT_UI, ONE_WAY_UI, assignAll, figureSpec, frameAt, keyframeFrame, phasesFor, poseFile, poseKeys, dataUiForPose, type PoseData } from '@/lib/figures/v2';
import { techniquesOf } from '@/lib/figures/v2/ui';
import { techniquesFor } from '@/lib/figures/v2/overlay';
import { SLED_THROW_TECHNIQUE } from '@/lib/figures/v2/overlay/sled_throw';
import { overlayShapes, type FigureSpec } from '@/lib/figures/v2';

const KEYS = ['Medicine Ball Slam', 'One-Arm Medicine Ball Slam', 'Standing Two-Arm Overhead Throw', 'Backward Medicine Ball Throw', 'Medicine Ball Scoop Throw', 'Wall Ball', 'Sled Push', 'Sled Drag (Harness)'];
const GAIT = ['Sled Push', 'Sled Drag (Harness)'];
const dane = (k: string): PoseData => poseFile('sled_throw')!.cwiczenia[k];

describe('sled_throw: rodzina ready z danych póz', () => {
  test('status ready, plik póz ma dokładnie 8 ćwiczeń, wszystkie z rodziny sled_throw, bez wpisu DATA_UI (prezentacja domyślna)', () => {
    expect(FAMILY.sled_throw.status).toBe('ready'); expect(poseKeys('sled_throw').sort()).toEqual([...KEYS].sort());
    for (const k of KEYS) expect([k, assignAll()[k]]).toEqual([k, 'sled_throw']);
    expect(DATA_UI.sled_throw).toBeUndefined();
  });
  test.each(KEYS)('%s: figura v2 z danych, widoki, prezentacja wg trybu pętli', k => {
    const s = figureSpec(k)!; expect([k, s.family]).toEqual([k, 'sled_throw']); expect(s.views).toEqual(k === 'Wall Ball' ? ['side', 'front'] : ['side']);
    const ui = dataUiForPose('sled_throw', dane(k)); expect(ui).toBe(GAIT.includes(k) ? GAIT_UI : ONE_WAY_UI.sled_throw);
    expect(dane(k).petla).toBe(GAIT.includes(k) ? 'cykl_lustro' : 'jednokierunkowa');
    const names = new Set(phasesFor(s).filter(p => p.name !== 'Pauza').map(p => p.name)); expect([...names]).toEqual([GAIT.includes(k) ? 'Marsz' : 'Rzut']);
  });
  test.each(KEYS)('%s: klatki u = 0 i u = 1 istnieją, pętla cykliczna zamyka się lustrem (dla sanek)', k => {
    const a = keyframeFrame(dane(k), 0), b = keyframeFrame(dane(k), 1); expect(a.sk.pelvis.every(Number.isFinite)).toBe(true); expect(b.sk.pelvis.every(Number.isFinite)).toBe(true);
    expect(frameAt(figureSpec(k)!, 0.5).sk.pelvis[1]).toBeGreaterThan(0);
  });
  test('SLED_THROW_TECHNIQUE: 5 elementów, id niepowtarzalne, każdy tylko w rzucie z boku, z regułą ze źródeł (sanki_pochylenie, rzut_wyprost, slam_nad_glowa) i wskazówką karty', () => {
    expect(SLED_THROW_TECHNIQUE.map(d => d.id)).toEqual(['sledLeanTrunkRef', 'sledLeanPlumbRef', 'throwKneeLimb', 'throwHipLimb', 'slamOverheadRef']);
    for (const d of SLED_THROW_TECHNIQUE) { expect([d.id, d.views]).toEqual([d.id, ['side']]); expect(['sanki_pochylenie', 'rzut_wyprost', 'slam_nad_glowa']).toContain(d.rule); expect(d.cue.length).toBeGreaterThan(0); }
  });
  test('nakładka: elementy wybrane przez wskazówki karty i reguły „ustalone” wariantu (Sled Drag i Scoop Throw mają zestaw ogólny — na karcie pojawią się po wpisie „zestawy” recenzji, dlatego tu id wskazówek jawnie)', () => {
    const of = (k: string, cues: string[]) => techniquesFor('sled_throw', cues, k).map(d => d.id);
    expect(techniquesOf('Sled Push')).toEqual(['sledLeanTrunkRef', 'sledLeanPlumbRef']); expect(of('Sled Drag (Harness)', ['sled.lean', 'sled.legs'])).toEqual(['sledLeanTrunkRef', 'sledLeanPlumbRef']);
    expect(of('Medicine Ball Scoop Throw', ['mb.legs'])).toEqual(['throwKneeLimb', 'throwHipLimb']); expect(techniquesOf('Medicine Ball Slam')).toEqual(['slamOverheadRef']);
    /* bez elementu: reguła nie „ustalone” albo wskazówka karty bez mapowania na regułę (slam_plecy: hinge.back poza wskazowki_na_reguly, pytanie do leada partii 8) */
    expect(of('Medicine Ball Slam', ['hinge.back', 'plank.brace'])).toEqual([]); expect(of('Sled Push', ['hinge.back'])).toEqual([]);
    for (const k of ['One-Arm Medicine Ball Slam', 'Standing Two-Arm Overhead Throw', 'Backward Medicine Ball Throw', 'Wall Ball']) expect([k, techniquesOf(k)]).toEqual([k, []]);
    const sp = (k: string) => figureSpec(k) as FigureSpec; const ids = (k: string) => techniquesOf(k);
    for (const k of ['Sled Push', 'Medicine Ball Slam']) expect([k, [0, 0.25, 0.5, 0.75, 1].some(u => overlayShapes(sp(k), u, 'side', ids(k)).length > 0)]).toEqual([k, true]);
  });
});
