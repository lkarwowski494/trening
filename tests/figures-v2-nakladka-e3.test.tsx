/*
 * Nakładka techniki — silnik E3 (04.11.2026, etap 2): linia odniesienia z regułą (pion / poziom / linia segmentu) i kolor błędu linii odniesienia GUIDES (GuideDef.rule).
 * Rodzaje (docs/20): logika/geometria, niezmienniki (limit linii, bez łuku), kolor błędu (pozytyw i negatyw na prawdziwych pozach błędów), dane (reguły GUIDES istnieją i są „ustalone”).
 */
import * as fs from 'fs';
import * as path from 'path';
import { figureSpec, frameAt, guideShapes, type FigureSpec, type Shape } from '@/lib/figures/v2';
import { errorsOf } from '@/lib/figures/v2/ui';
import { OVERLAY_EXTEND, OVERLAY_LEVEL_HALF, OVERLAY_MAX_ARCS, OVERLAY_MAX_LINES, OVERLAY_PLUMB_LEN, refGeom2D, refPoint, techniqueShapes, type RefSpec, type TechniqueDef } from '@/lib/figures/v2/overlay';
import { GUIDES, type GuideId } from '@/lib/figures/v2/guides';
import { proj } from '@/lib/figures/v2/draw';
import { errorBreaksRule } from '@/lib/figures/v2/figure';

const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const errOf = (k: string, cue: string) => errorsOf(spec(k)).find(e => e.cue === cue)!.error;
const roleOf = (x: Shape) => (x.k === 'line' ? x.role : (x as { stroke?: string }).stroke);
const sens = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/zrodla/figury-sens.json'), 'utf8')).rodziny;
const def = (ref: RefSpec, views: TechniqueDef['views'] = ['side', 'front']): TechniqueDef => ({ id: 'testRef', kind: 'ref', cue: ['x'], rule: 'r', views, ref });
const ctx = (danger: (r: string) => boolean = () => false, guideLines = 0) => ({ joint: 'elbow' as const, side: 'R' as const, limbShown: false, danger, guideLines });

describe('E3: geometria linii odniesienia (pion, poziom, segment)', () => {
  const sk = frameAt(spec('Deadlift (sztanga)'), 0).sk;
  test('pion: x punktu w rzucie; w górę, w dół i w obie strony o OVERLAY_PLUMB_LEN; przez kostkę/uchwyt', () => {
    for (const [p, view] of [['ankle', 'side'], ['grip', 'side'], ['ankle', 'front']] as const) {
      const q = proj(refPoint(sk, 'R', p), view);
      expect(refGeom2D(sk, 'R', view, { shape: 'vertical', through: p, dir: 'up' })).toEqual([q, [q[0], q[1] + OVERLAY_PLUMB_LEN]]);
      expect(refGeom2D(sk, 'R', view, { shape: 'vertical', through: p, dir: 'down' })).toEqual([[q[0], q[1] - OVERLAY_PLUMB_LEN], q]);
      expect(refGeom2D(sk, 'R', view, { shape: 'vertical', through: p, dir: 'both' })).toEqual([[q[0], q[1] - OVERLAY_PLUMB_LEN], [q[0], q[1] + OVERLAY_PLUMB_LEN]]);
    }
  });
  test('poziom: y punktu, połowa długości OVERLAY_LEVEL_HALF na stronę; pion i poziom w rzucie z góry — null', () => {
    const q = proj(refPoint(sk, 'R', 'grip'), 'side');
    expect(refGeom2D(sk, 'R', 'side', { shape: 'horizontal', through: 'grip' })).toEqual([[q[0] - OVERLAY_LEVEL_HALF, q[1]], [q[0] + OVERLAY_LEVEL_HALF, q[1]]]);
    expect(refGeom2D(sk, 'R', 'top', { shape: 'horizontal', through: 'grip' })).toBeNull(); expect(refGeom2D(sk, 'R', 'top', { shape: 'vertical', through: 'grip', dir: 'both' })).toBeNull();
  });
  test('segment: od punktu `from` przez `to`, przedłużony o OVERLAY_EXTEND; kierunek = kierunek segmentu; segment-punkt w rzucie — null; działa też w rzucie z góry', () => {
    for (const view of ['side', 'front', 'top'] as const) {
      const a = proj(sk.pelvis, view), b = proj(sk.shoulderC, view); const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const g = refGeom2D(sk, 'R', view, { shape: 'segment', from: 'pelvis', to: 'shoulderC' });
      if (l < 2) { expect(g).toBeNull(); continue; }
      expect(g![0]).toEqual(a); const d = [g![1][0] - b[0], g![1][1] - b[1]]; expect(Math.hypot(d[0], d[1])).toBeCloseTo(OVERLAY_EXTEND, 6);
      expect(d[0] * (b[1] - a[1]) - d[1] * (b[0] - a[0])).toBeCloseTo(0, 6);
    }
    expect(refGeom2D(sk, 'R', 'side', { shape: 'segment', from: 'hip', to: 'hip' })).toBeNull();
  });
  test('refPoint: wszystkie punkty zwracają punkt szkieletu danej strony', () => {
    expect(refPoint(sk, 'L', 'knee')).toBe(sk.legs.L.knee); expect(refPoint(sk, 'R', 'elbow')).toBe(sk.arms.R.elbow); expect(refPoint(sk, 'R', 'head')).toBe(sk.head); expect(refPoint(sk, 'R', 'pelvis')).toBe(sk.pelvis);
    for (const p of ['grip', 'wrist', 'shoulder', 'hip', 'ankle', 'toe', 'shoulderC'] as const) expect(refPoint(sk, 'R', p)).toHaveLength(3);
  });
});

describe('E3: element w techniqueShapes — jedna linia ciągła, bez łuku, limit, kolor, rzuty', () => {
  const sk = frameAt(spec('Deadlift (sztanga)'), 0).sk;
  test('kształt: jedna linia ciągła (bez dash), id + „Line”, rola guide; bez łuku i bez limbShown', () => {
    const out = techniqueShapes(sk, 'side', [def({ shape: 'vertical', through: 'ankle', dir: 'up' })], ctx());
    expect(out).toHaveLength(1); const l = out[0] as Extract<Shape, { k: 'line' }>; expect([l.k, l.id, l.role, l.dash]).toEqual(['line', 'testRefLine', 'guide', undefined]);
  });
  test('kolor: reguła złamana → error, inna reguła → guide', () => {
    const d = [def({ shape: 'horizontal', through: 'grip' })];
    expect(roleOf(techniqueShapes(sk, 'side', d, ctx(r => r === 'r'))[0])).toBe('error'); expect(roleOf(techniqueShapes(sk, 'side', d, ctx(r => r === 'inna'))[0])).toBe('guide');
  });
  test('rzut spoza views i degeneracja (pion w rzucie z góry) — brak kształtów; brak pola ref — pomija', () => {
    expect(techniqueShapes(sk, 'top', [def({ shape: 'vertical', through: 'ankle', dir: 'up' }, ['top'])], ctx())).toEqual([]);
    expect(techniqueShapes(sk, 'front', [def({ shape: 'vertical', through: 'ankle', dir: 'up' }, ['side'])], ctx())).toEqual([]);
    expect(techniqueShapes(sk, 'side', [{ id: 'x', kind: 'ref', cue: ['x'], rule: 'r', views: ['side'] }], ctx())).toEqual([]);
  });
  test('limit: łącznie ze starymi liniami odniesienia ≤ OVERLAY_MAX_LINES; łuków 0 ≤ OVERLAY_MAX_ARCS', () => {
    const many = Array.from({ length: 5 }, (_, i) => ({ ...def({ shape: 'segment', from: 'hip', to: 'knee' }), id: 'r' + i }));
    expect(techniqueShapes(sk, 'side', many, ctx()).filter(x => x.k === 'line')).toHaveLength(OVERLAY_MAX_LINES);
    expect(techniqueShapes(sk, 'side', many, ctx(undefined, 2)).filter(x => x.k === 'line')).toHaveLength(OVERLAY_MAX_LINES - 2);
    expect(techniqueShapes(sk, 'side', many, ctx(undefined, OVERLAY_MAX_LINES))).toEqual([]);
    expect(techniqueShapes(sk, 'side', many, ctx()).filter(x => x.k !== 'line').length).toBeLessThanOrEqual(OVERLAY_MAX_ARCS);
  });
  test('rzut z góry: strona R niezależnie od ctx.side (segment)', () => {
    const d = [def({ shape: 'segment', from: 'shoulder', to: 'elbow' }, ['top'])];
    expect(techniqueShapes(sk, 'top', d, { ...ctx(), side: 'L' })).toEqual(techniqueShapes(sk, 'top', d, ctx()));
  });
});

describe('kolor błędu linii odniesienia GUIDES (GuideDef.rule)', () => {
  const rolesOf = (k: string, id: GuideId, view: 'side' | 'front', err?: ReturnType<typeof errOf>) => guideShapes(spec(k), 0.5, view, [id], err).map(roleOf);
  test('dane: reguły GUIDES istnieją w figury-sens.json i są „ustalone” (plumbMidfoot bez reguły — brak odpowiednika)', () => {
    expect(Object.fromEntries(Object.values(GUIDES).map(g => [g.id, g.rule ?? null]))).toEqual({ thighParallel: 'udo_rownolegle', plumbMidfoot: null, kneeToe: 'kolana_nad_stopami', backLine: 'plecy_neutralne' });
    for (const g of Object.values(GUIDES)) if (g.rule) { const fam = g.id === 'backLine' ? ['hinge', 'squat'] : ['squat']; for (const f of fam) expect(sens[f].reguly[g.rule].pewnosc).toMatch(/^ustalone/); }
  });
  test('pozytyw: Deadlift z błędem „plecy zaokrąglone” — backLine czerwona; bez błędu i z błędem innej grupy (sztanga od nóg) — zwykła', () => {
    const k = 'Deadlift (sztanga)'; const round = errOf(k, 'mis.roundBack'), away = errOf(k, 'mis.barAway');
    expect(errorBreaksRule(spec(k), round, 'plecy_neutralne')).toBe(true);
    expect(rolesOf(k, 'backLine', 'side', round)).toEqual(['error']); expect(rolesOf(k, 'backLine', 'side')).toEqual(['guide']); expect(rolesOf(k, 'backLine', 'side', away)).toEqual(['guide']);
  });
  test('pozytyw: Back Squat — kolana do środka: kneeToe czerwona (front, obie stopy); pięty (inna grupa) i brak błędu — zwykła', () => {
    const k = 'Back Squat'; const knees = errOf(k, 'sq.mis.kneesIn'), heels = errOf(k, 'sq.mis.heels');
    expect(rolesOf(k, 'kneeToe', 'front', knees)).toEqual(['error', 'error']); expect(rolesOf(k, 'kneeToe', 'front', heels)).toEqual(['guide', 'guide']); expect(rolesOf(k, 'kneeToe', 'front')).toEqual(['guide', 'guide']);
  });
  test('negatyw: linie bez reguły (plumbMidfoot) i bez pasującej grupy (thighParallel) nigdy nie są czerwone przy żadnym błędzie', () => {
    for (const [k, id] of [['Deadlift (sztanga)', 'plumbMidfoot'], ['Back Squat', 'thighParallel']] as const) for (const e of errorsOf(spec(k))) expect([k, id, e.cue, rolesOf(k, id, 'side', e.error).every(r => r === 'guide')]).toEqual([k, id, e.cue, true]);
  });
  test('geometria bez zmian: kolor błędu zmienia tylko rolę (a, b, id, dash, w, z jak w build na klatce błędu)', () => {
    const k = 'Deadlift (sztanga)'; const round = errOf(k, 'mis.roundBack'); const f = frameAt(spec(k), 0.5, round);
    const raw = GUIDES.backLine.build(f, 'side'); const got = guideShapes(spec(k), 0.5, 'side', ['backLine'], round);
    expect(got).toEqual(raw.map(x => ({ ...x, role: 'error' })));
  });
  test('VoiceOver / dozwolone linie bez zmian: ids i rzuty GUIDES niezmienione, backLine z cue P1 (sq.back, wall.back)', () => {
    expect(Object.values(GUIDES).map(g => [g.id, g.cue, g.views])).toEqual([['thighParallel', ['sq.depth'], ['side']], ['plumbMidfoot', ['dl.feet'], ['side']], ['kneeToe', ['sq.kneesToes'], ['front']], ['backLine', ['hinge.back', 'sq.back', 'wall.back'], ['side']]]);
  });
});
