/*
 * Figury v2 — tryb cykliczny animacji dla ćwiczeń z marszem (decyzja właściciela 27.10.2026, wariant A): po fazie 0 → 1 ta sama faza z nogami w lustrze (druga noga), bez cofania.
 * Powód: animacja wahadłowa odtwarzała w powrocie chód tyłem (stopa w kontakcie sunęła do przodu o 79 cm przy saniach i 38 cm przy jarzmie — „moonwalk”, recenzja p4b, błąd 2).
 * Ćwiczenia w trybie (pole `petla: 'cykl_lustro'` w danych póz): 7 w carry, Sled Push, Sled Drag (Harness), Yoke Walk. Reszta zostaje wahadłowa (zgodność wsteczna).
 * Rodzaje (docs/20): logika (lustro klatki, czas pętli), kontrakt (pole w schemacie i walidatorze), dane (10 ćwiczeń: ciągłość na styku, reguła sensu na całej pętli), regresja (moonwalk wahadła
 * wykrywany tą samą regułą), ekran (licznik „Marsz”, linia kąta, pauza, „Ogranicz ruch”), języki (PL/EN), niezmienniki (pozostałe 423 ćwiczenia bez pola, odciski bez zmian).
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: ten test sprawdza rysowanie, nie recenzję rodziny (tests/figure-gate-open.ts) */
import React from 'react';
import * as RN from 'react-native';
import { render, screen, act, fireEvent } from '@testing-library/react-native';
import { ExerciseFigureV2 } from '@/components/ExerciseFigureV2';
import {
  CONTRACT, FAMILY, WALK, LOOP_MODES, TEMPO, SIDES, boxFor, checkSchema, cycleAt, cycleLength, figureSpec, frameAt, jointAngles, keyframeFrame, loopOf, loopSpan, measuredAngle,
  mirrorKey, poseLoopSpan, loopJoinGap, dataUiForPose, GAIT_UI, phasesFor, poseAt, poseSchema, shapesAt, staticPositions, stanceAdvance, validatePose, trailFor, pendulumFrames, loopFrames, uAt, loopLength,
  type FamilyId, type Frame, type KeyFrame, type PoseData, type V3, type RomData,
} from '@/lib/figures/v2';
import { applyLang } from '@/lib/i18n';
import { EN } from '@/lib/i18n.en';

jest.mock('@/lib/figures/v2/poseData', () => {
  const real = jest.requireActual('@/lib/figures/v2/poseData');
  const EXTRA = ['sled_throw', 'strongman', 'carry'];
  return { ...real, poseDataFor: (key: string, family: string) => {
    if (!EXTRA.includes(family)) return real.poseDataFor(key, family);
    const f = jest.requireActual(`@/lib/figures/v2/poses/${family}.json`).cwiczenia as Record<string, { cwiczenie: string; rodzina: string }>;
    const d = Object.prototype.hasOwnProperty.call(f, key) ? f[key] : undefined; return d && d.cwiczenie === key && d.rodzina === family ? d : null;
  } };
});

jest.setTimeout(240000);
type PoseFile = { cwiczenia: Record<string, PoseData> };
const FILES = require('@/lib/figures/v2/poses/carry.json') as PoseFile; /* typ pliku */
const POZY: Record<string, PoseFile> = {
  carry: FILES, sled_throw: require('@/lib/figures/v2/poses/sled_throw.json'), strongman: require('@/lib/figures/v2/poses/strongman.json'),
};
const CYKLICZNE: [string, string][] = [
  ...Object.keys(POZY.carry.cwiczenia).map(k => ['carry', k] as [string, string]), ['sled_throw', 'Sled Push'], ['sled_throw', 'Sled Drag (Harness)'], ['strongman', 'Yoke Walk'],
];
const dane = (f: string, k: string): PoseData => POZY[f].cwiczenia[k];
const SAVED: Record<string, 'ready' | 'planned'> = Object.fromEntries(['carry', 'sled_throw', 'strongman'].map(f => [f, FAMILY[f as FamilyId].status]));
beforeAll(() => { for (const f of Object.keys(SAVED)) FAMILY[f as FamilyId].status = 'ready'; });
afterAll(() => { for (const f of Object.keys(SAVED)) FAMILY[f as FamilyId].status = SAVED[f]; });

const ROM: RomData = { side: { hip: { min: -30, max: 130 }, knee: { min: 0, max: 150 }, ankle: { min: -60, max: 40 }, el: { min: 0, max: 150 }, sh: { min: -60, max: 180 } }, front: { abd: { min: 0, max: 180 } } };
const dist = (a: V3, b: V3): number => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const pts = (f: Frame): V3[] => [f.sk.pelvis, f.sk.head, f.sk.shoulderC, f.sk.spineMid, ...SIDES.flatMap(s => [f.sk.legs[s].knee, f.sk.legs[s].ankle, f.sk.legs[s].heel, f.sk.legs[s].toe, f.sk.arms[s].elbow, f.sk.arms[s].grip])];
const gap = (a: Frame, b: Frame): number => { const p = pts(a), q = pts(b); return Math.max(...p.map((x, i) => dist(x, q[i]))); };
const refl = (p: V3): V3 => [p[0], p[1], 0 - p[2]];

describe('logika: czas pętli cyklicznej (jedno miejsce: WALK)', () => {
  test('WALK.stepMs to jedyna liczba; pętla = dwa kroki (połowa 0 → 1 i połowa w lustrze); cycleAt idzie liniowo od 0 do 2 i zawija się bez skoku w wartości klatki', () => {
    expect(WALK).toEqual({ stepMs: 1000 }); expect(cycleLength()).toBe(2 * WALK.stepMs);
    expect(cycleAt(0)).toBe(0); expect(cycleAt(WALK.stepMs / 2)).toBeCloseTo(0.5, 9); expect(cycleAt(WALK.stepMs)).toBeCloseTo(1, 9); expect(cycleAt(1.5 * WALK.stepMs)).toBeCloseTo(1.5, 9);
    expect(cycleAt(cycleLength())).toBeCloseTo(0, 9); expect(cycleAt(cycleLength() + 250)).toBeCloseTo(cycleAt(250), 9); expect(cycleAt(-250)).toBeCloseTo(2 - 0.25, 9);
    let prev = cycleAt(0); for (let ms = 33; ms < cycleLength(); ms += 33) { const x = cycleAt(ms); expect(x - prev).toBeCloseTo(33 / WALK.stepMs, 9); prev = x; } /* bez pauz i bez zwolnień: krok ruchu stały */
  });
  test('czas kroku nie zależy od tempa wahadła (opuszczanie/podnoszenie nie dotyczy marszu): cycleAt ignoruje Tempo', () => {
    expect(cycleAt(700, { downMs: 5000, upMs: 100 })).toBeCloseTo(cycleAt(700), 9);
    expect(uAt(0, false)).toBe(0); expect(loopLength(false)).toBe(TEMPO.holdMs * 2 + TEMPO.downMs + TEMPO.upMs); /* wahadło bez zmian */
  });
});

describe('logika: lustro klatki kluczowej (mirrorKey)', () => {
  const k = poseAt(dane('sled_throw', 'Sled Drag (Harness)').klatki, 0.3);
  test('zamienia strony nóg i odbija oś z; miednica, pochylenie tułowia i głowy bez zmian (płaszczyzna strzałkowa)', () => {
    const m = mirrorKey(k, false);
    for (const s of SIDES) { const o = s === 'R' ? 'L' : 'R'; expect(m.nogi[s].kostka).toEqual(refl(k.nogi[o].kostka)); expect(m.nogi[s].podbicie).toBe(k.nogi[o].podbicie); expect(m.nogi[s].rotacjaStopy).toBe(k.nogi[o].rotacjaStopy); expect(m.nogi[s].biegunKolana).toEqual(k.nogi[o].biegunKolana && refl(k.nogi[o].biegunKolana as V3)); }
    expect(m.miednica).toEqual(refl(k.miednica)); expect(m.pochylenieTulowia).toBe(k.pochylenieTulowia); expect(m.pochylenieGlowy).toBe(k.pochylenieGlowy);
    expect(m.rece).toEqual(k.rece); /* ręce bez zamiany, gdy ruch ich nie dotyczy */
  });
  test('z rękami: ręce też zamieniają strony z odbiciem osi z', () => {
    const m = mirrorKey(k, true);
    for (const s of SIDES) { const o = s === 'R' ? 'L' : 'R'; expect(m.rece[s].chwyt).toEqual(refl(k.rece[o].chwyt)); const pol = k.rece[o].biegunLokcia; expect(m.rece[s].biegunLokcia).toEqual(pol && refl(pol)); }
  });
  test('pola poza@2 o znaku zależnym od strony (obrót, skręt, skłon, przechył miednicy i głowy, przesunięcie boczne) zmieniają znak; dwa lustra dają klatkę wyjściową', () => {
    const e: KeyFrame = { ...k, obrotTulowia: 10, skretTulowia: -4, przechylTulowia: 3, przechylMiednicy: 2, przechylGlowy: -5, przesuniecieBoczne: 6 };
    const m = mirrorKey(e, true);
    expect([m.obrotTulowia, m.skretTulowia, m.przechylTulowia, m.przechylMiednicy, m.przechylGlowy, m.przesuniecieBoczne]).toEqual([-10, 4, -3, -2, 5, -6]);
    expect(mirrorKey(m, true)).toEqual(e); expect(mirrorKey(mirrorKey(k, false), false)).toEqual(k);
  });
  test('klatka bez pól opcjonalnych nie dostaje ich po lustrze (brak klucza, nie undefined/NaN)', () => {
    const m = mirrorKey(k, true) as unknown as Record<string, unknown>; for (const f of ['obrotTulowia', 'skretTulowia', 'przechylTulowia', 'przechylMiednicy', 'przechylGlowy', 'przesuniecieBoczne']) expect([f, f in m]).toEqual([f, false]);
  });
});

describe('kontrakt: pole petla (schemat i walidator)', () => {
  test('schemat dopuszcza petla ∈ {wahadlo, cykl_lustro} i lustroRece (boolean), reszta jak dotąd; wartość spoza listy odrzucona', () => {
    expect([...LOOP_MODES]).toEqual(['wahadlo', 'cykl_lustro', 'jednokierunkowa']);
    const s = poseSchema('generic'); const p = s.properties as Record<string, { type?: string; enum?: string[] }>;
    expect(p.petla.enum).toEqual(['wahadlo', 'cykl_lustro', 'jednokierunkowa']); expect(p.lustroRece.type).toBe('boolean'); expect((s.required as string[]).includes('petla')).toBe(false);
    const d = dane('carry', "Farmer's Walk");
    expect(checkSchema({ ...d, petla: 'cykl_lustro' }, s)).toEqual([]); expect(checkSchema({ ...d, petla: 'wahadlo', lustroRece: true }, s)).toEqual([]); expect(checkSchema({ ...d, petla: 'inna' }, s).length).toBeGreaterThan(0);
    expect(checkSchema({ ...d, nieznane: 1 }, s).length).toBeGreaterThan(0);
  });
  test('walidator przepuszcza wszystkie 10 ćwiczeń cyklicznych bez uwag', () => {
    for (const [f, k] of CYKLICZNE) expect([k, validatePose(dane(f, k), { family: f, exercise: k, errorCues: dane(f, k).bledy.map(b => b.cue), rom: ROM, dynamic: false, allow: { ankleMin: -90, hipMin: -40, elbow: 150 } })]).toEqual([k, []]);
  });
  test('walidator łapie pętlę bez ciągłości na styku faz (kod petla): pierwsza klatka zamieniona z ostatnią nie jest lustrem', () => {
    const d = dane('sled_throw', 'Sled Push'); const zle: PoseData = { ...d, klatki: d.klatki.map((c, i) => i === d.klatki.length - 1 ? { ...c, nogi: { R: { ...c.nogi.R, kostka: [c.nogi.R.kostka[0] + 30, c.nogi.R.kostka[1], c.nogi.R.kostka[2]] as V3 }, L: c.nogi.L } } : c) };
    const w = validatePose(zle, { family: 'sled_throw', exercise: 'Sled Push', errorCues: [], rom: ROM, allow: { ankleMin: -90, hipMin: -40, elbow: 150 } });
    expect(w.some(x => x.kod === 'petla' && /styk|lustr/.test(x.szczegol))).toBe(true);
  });
  test('walidator łapie stopę w kontakcie, która sunie do przodu względem miednicy w całej pętli (kod petla), a nie zgłasza tego bez trybu cyklicznego', () => {
    const d = dane('sled_throw', 'Sled Push'); const bez: PoseData = { ...d }; delete bez.petla; delete bez.lustroRece;
    const ctx = { family: 'sled_throw', exercise: 'Sled Push', errorCues: [] as string[], rom: ROM, allow: { ankleMin: -90, hipMin: -40, elbow: 150 } };
    expect(validatePose(bez, ctx).filter(x => x.kod === 'petla')).toEqual([]); /* wahadło: reguła dotyczy tylko trybu cyklicznego (zgodność wsteczna) */
    /* stopa podporowa (lewa) sunie do przodu: odwracamy kolejność klatek lewej nogi */
    const rev: PoseData = { ...d, klatki: d.klatki.map((c, i) => ({ ...c, nogi: { R: c.nogi.R, L: d.klatki[d.klatki.length - 1 - i].nogi.L } })) };
    expect(validatePose(rev, ctx).some(x => x.kod === 'petla')).toBe(true);
  });
});

describe('dane: 10 ćwiczeń marszowych w trybie cyklicznym', () => {
  test('dokładnie 10 ćwiczeń ma petla = cykl_lustro (7 carry, Sled Push, Sled Drag (Harness), Yoke Walk); żadne inne ćwiczenie z plików sled_throw, strongman, carry nie ma pola', () => {
    const z: string[] = []; for (const f of Object.keys(POZY)) for (const [k, d] of Object.entries(POZY[f].cwiczenia)) if (d.petla === 'cykl_lustro') z.push(`${f}/${k}`);
    expect(z.sort()).toEqual(CYKLICZNE.map(([f, k]) => `${f}/${k}`).sort()); expect(Object.keys(POZY.carry.cwiczenia).length).toBe(7);
    for (const [f, k] of CYKLICZNE) expect([k, dane(f, k).petla]).toEqual([k, 'cykl_lustro']);
  });
  test('ręce zamieniają strony tylko tam, gdzie ruch ich dotyczy: Sled Drag (ręka przeciwna do nogi); marsz z ciężarem i popychanie — nie', () => {
    expect(dane('sled_throw', 'Sled Drag (Harness)').lustroRece).toBe(true);
    for (const [f, k] of CYKLICZNE.filter(([, k]) => k !== 'Sled Drag (Harness)')) expect([k, dane(f, k).lustroRece === true]).toEqual([k, false]);
  });
  test.each(CYKLICZNE)('%s / %s: styk faz — klatka u = 1 jest lustrem klatki u = 0 (różnica stawów ≤ CONTRACT.cycle.joinCm), a pętla zamyka się w u = 2', (f, k) => {
    const d = dane(f, k); const g1 = gap(keyframeFrame(d, 1), keyframeFrame(d, 1 + 1e-9)); /* początek połowy w lustrze */
    expect(g1).toBeLessThanOrEqual(CONTRACT.cycle.joinCm);
    expect(gap(keyframeFrame(d, 2), keyframeFrame(d, 0))).toBeLessThanOrEqual(CONTRACT.cycle.joinCm);
    /* styk liczony wprost: ostatnia klatka danych a lustro pierwszej */
    const wprost = gap(keyframeFrame({ ...d, petla: undefined, klatki: [d.klatki[d.klatki.length - 1], d.klatki[d.klatki.length - 1]].map((c, i) => ({ ...c, u: i })) }, 0), keyframeFrame({ ...d, petla: undefined, klatki: [mirrorKey(d.klatki[0], !!d.lustroRece), mirrorKey(d.klatki[0], !!d.lustroRece)].map((c, i) => ({ ...c, u: i })) }, 0));
    expect(wprost).toBeLessThanOrEqual(CONTRACT.cycle.joinCm);
  });
  test('poseLoopSpan: 2 dla trybu cyklicznego, 1 dla wahadła; loopJoinGap: styk faz mieści się w limicie, a zepsuty (stopa przesunięta o 30 cm) go przekracza', () => {
    const d = dane('sled_throw', 'Sled Push'); expect(poseLoopSpan(d)).toBe(2); expect(poseLoopSpan({ ...d, petla: undefined })).toBe(1); expect(poseLoopSpan({ ...d, petla: 'wahadlo' })).toBe(1);
    for (const [f, k] of CYKLICZNE) expect([k, loopJoinGap(dane(f, k)) <= CONTRACT.cycle.joinCm]).toEqual([k, true]);
    const zle: PoseData = { ...d, klatki: d.klatki.map((c, i) => i === d.klatki.length - 1 ? { ...c, nogi: { R: { ...c.nogi.R, kostka: [c.nogi.R.kostka[0] + 30, c.nogi.R.kostka[1], c.nogi.R.kostka[2]] as V3 }, L: c.nogi.L } } : c) };
    expect(loopJoinGap(zle)).toBeGreaterThan(20);
  });
  test.each(CYKLICZNE)('%s / %s: ciągłość całej pętli (0 → 2): żaden punkt szkieletu nie skacze o więcej niż CONTRACT.maxJump na 1/48 kroku', (f, k) => {
    const d = dane(f, k); const n = 2 * CONTRACT.step; let prev = pts(keyframeFrame(d, 0)); let max = 0;
    for (let i = 1; i <= n; i++) { const cur = pts(keyframeFrame(d, 2 * i / n)); cur.forEach((p, j) => { max = Math.max(max, dist(p, prev[j])); }); prev = cur; }
    expect(max).toBeLessThanOrEqual(CONTRACT.maxJump);
  });
  test.each(CYKLICZNE)('%s / %s: druga połowa to lustro pierwszej — prawa noga w u = 1 + t ma pozycję lewej z u = t (x, y), z odbite; to samo dla kolan, pięt i palców', (f, k) => {
    const d = dane(f, k);
    for (const t of [0, 0.13, 0.25, 0.5, 0.77, 1]) { const a = keyframeFrame(d, t).sk, b = keyframeFrame(d, 1 + t).sk;
      for (const s of SIDES) { const o = s === 'R' ? 'L' : 'R'; for (const j of ['knee', 'ankle', 'heel', 'toe'] as const) expect([k, t, s, j, dist(b.legs[s][j], refl(a.legs[o][j])) < 0.05]).toEqual([k, t, s, j, true]); } }
  });
  test('Sled Drag: w drugiej połowie ręce też zamieniają strony (ręka przeciwna do nogi zostaje przeciwna)', () => {
    const d = dane('sled_throw', 'Sled Drag (Harness)');
    for (const t of [0, 0.4, 1]) { const a = keyframeFrame(d, t).sk, b = keyframeFrame(d, 1 + t).sk; for (const s of SIDES) { const o = s === 'R' ? 'L' : 'R'; expect(dist(b.arms[s].grip, refl(a.arms[o].grip))).toBeLessThan(0.05); } }
  });
  test('błąd (poza z deltą) w drugiej połowie to lustro błędu z pierwszej (mirror po nałożeniu delty)', () => {
    const [f, k] = CYKLICZNE.find(([ff, kk]) => dane(ff, kk).bledy.length > 0) ?? [];
    if (!f || !k) return; /* żadne ćwiczenie cykliczne nie ma błędu rysowanego — nic do sprawdzenia */
    const d = dane(f, k); const a = keyframeFrame(d, 0.4, 0).sk, b = keyframeFrame(d, 1.4, 0).sk;
    for (const s of SIDES) { const o = s === 'R' ? 'L' : 'R'; expect(dist(b.legs[s].ankle, refl(a.legs[o].ankle))).toBeLessThan(0.05); }
  });
});

describe('reguła sensu marszu: stopa w kontakcie z podłożem nie przesuwa się do przodu względem miednicy (każda klatka całej pętli)', () => {
  test('stałe w jednym miejscu: kontakt = podeszwa < 1,5 cm, dopuszczalny przesuw do przodu ≤ 2 cm, styk ≤ 1 cm', () => {
    expect(CONTRACT.cycle).toMatchObject({ contactCm: 1.5, advanceCm: 2, joinCm: 1 });
  });
  test.each(CYKLICZNE)('%s / %s: cała pętla (2 × 160 próbek) — stopa podporowa tylko do tyłu (≤ advanceCm), obie nogi mają fazę podporu', (f, k) => {
    const d = dane(f, k); const fr = loopFrames(d, 160); expect(fr.length).toBe(2 * 160 + 1);
    const r = stanceAdvance(fr); expect({ k, cm: Math.round(r.cm * 10) / 10 }).toEqual({ k, cm: expect.any(Number) }); expect(r.cm).toBeLessThanOrEqual(CONTRACT.cycle.advanceCm);
    expect(r.runs.R).toBeGreaterThan(0); expect(r.runs.L).toBeGreaterThan(0); expect(r.retreat).toBeGreaterThan(20); /* stopa podporowa naprawdę się cofa (krok), nie stoi */
  });
  test.each([['sled_throw', 'Sled Push', 40], ['sled_throw', 'Sled Drag (Harness)', 40], ['strongman', 'Yoke Walk', 25]] as const)('regresja błędu 2 recenzji p4b: pętla WAHADŁOWA (0 → 1 → 0) %s / %s ma przesuw stopy w kontakcie do przodu ≥ %s cm', (f, k, min) => {
    const r = stanceAdvance(pendulumFrames(dane(f, k), 160));
    expect(r.cm).toBeGreaterThanOrEqual(min); /* ta sama reguła, która przepuszcza pętlę cykliczną, wykrywa chód tyłem w powrocie wahadła */
    expect(stanceAdvance(loopFrames(dane(f, k), 160)).cm).toBeLessThanOrEqual(CONTRACT.cycle.advanceCm);
  });
  test.each(CYKLICZNE)('marsz_zawsze_podparcie: %s / %s: w każdej klatce całej pętli (2 × 160 próbek) co najmniej jedna podeszwa < contactCm nad podłogą (bez „wiszenia” na rączkach)', (f, k) => {
    const fr = loopFrames(dane(f, k), 160); const zle: string[] = [];
    fr.forEach((x, i) => { const w = Math.min(...SIDES.map(s => Math.min(x.sk.legs[s].heel[1], x.sk.legs[s].toe[1]))); if (w >= CONTRACT.cycle.contactCm) zle.push(`${i}:${w.toFixed(1)}`); });
    expect({ k, klatkiBezPodparcia: zle }).toEqual({ k, klatkiBezPodparcia: [] });
  });
  test('stanceAdvance: znana konstrukcja — stopa w kontakcie cofa się o 30 cm (0 przesuwu), a po odwróceniu kolejności klatek sunie do przodu o 30 cm', () => {
    const fr = (x: number): Frame => { const base = keyframeFrame(dane('carry', "Farmer's Walk"), 0.4); const sh = (p: V3): V3 => [p[0] + x, p[1], p[2]]; const L = base.sk.legs;
      const leg = (l: typeof L.R) => ({ ...l, ankle: sh(l.ankle), heel: [l.ankle[0] + x - 3, 0, l.ankle[2]] as V3, toe: [l.ankle[0] + x + 12, 0, l.ankle[2]] as V3 });
      return { ...base, sk: { ...base.sk, legs: { R: leg(L.R), L: { ...L.L, heel: [0, 50, 0] as V3, toe: [0, 50, 0] as V3 } } } } as Frame; };
    const xs = Array.from({ length: 31 }, (_, i) => -i); /* ankle.x względem miednicy (stałej) maleje o 30 */
    expect(stanceAdvance(xs.map(fr)).cm).toBeLessThanOrEqual(0.01); expect(stanceAdvance([...xs].reverse().map(fr)).cm).toBeCloseTo(30, 5);
  });
});

describe('figura: tryb cykliczny w specyfikacji (silnik)', () => {
  const sp = (k: string) => figureSpec(k)!;
  test('loopOf: cykl_lustro dla 10 ćwiczeń (także Sled Push i Yoke Walk, których rodziny nie mają wpisu DATA_UI), wahadło dla pozostałych (rig, podciąganie, inne rodziny z danych)', () => {
    for (const [, k] of CYKLICZNE) { expect([k, sp(k) !== null]).toEqual([k, true]); expect([k, loopOf(sp(k)), loopSpan(sp(k))]).toEqual([k, 'cykl_lustro', 2]); }
    for (const k of ['Pull Up', 'Dead Hang', 'Barbell Squat', 'Deadlift']) { const s = figureSpec(k); if (s) expect([k, loopOf(s), loopSpan(s)]).toEqual([k, 'wahadlo', 1]); }
    expect(figureSpec('Pull Up')).not.toBeNull();
  });
  test('klatka w u = 1 + t pochodzi z lustra (frameAt przyjmuje u do 2); wahadłowa figura poza zakresem zostaje przy klatce końcowej', () => {
    const s = sp('Sled Push'); const a = frameAt(s, 0.3), b = frameAt(s, 1.3);
    for (const x of SIDES) { const o = x === 'R' ? 'L' : 'R'; expect(dist(b.sk.legs[x].ankle, refl(a.sk.legs[o].ankle))).toBeLessThan(0.05); }
    expect(dist(frameAt(sp('Pull Up'), 1.7).sk.pelvis, frameAt(sp('Pull Up'), 1).sk.pelvis)).toBeLessThan(1e-6);
  });
  test('kadr i tor ruchu obejmują całą pętlę: kształty klatki w u = 1,5 mieszczą się w kadrze figury', () => {
    const s = sp('Yoke Walk'); const b = boxFor(s, 'side');
    for (const sh of shapesAt(s, 1.5, 'side')) { if (sh.k === 'circle') { expect(sh.c[0] - sh.r).toBeGreaterThanOrEqual(b.x - 0.5); expect(sh.c[0] + sh.r).toBeLessThanOrEqual(b.x + b.w + 0.5); } }
    expect(trailFor(s, 'side').length).toBeGreaterThanOrEqual(0);
  });
  test('licznik faz: jedna faza „Marsz” bez sekund i pauz; kąt na rysunku jest okresowy (u = 0 i u = 2 to ta sama pozycja) i obejmuje obie połowy', () => {
    for (const [, k] of CYKLICZNE) { const s = sp(k); expect([k, phasesFor(s)]).toEqual([k, [{ name: 'Marsz', ms: loopLength(false), untimed: true }]]);
      expect(Math.abs(measuredAngle(s, 0).deg - measuredAngle(s, 2).deg)).toBeLessThan(0.7); expect(measuredAngle(s, 0).joint).toMatch(/knee|hip/); }
    /* druga połowa to lustro: kąt prawego kolana w u = 1 + t równa się kątowi lewego w u = t */
    for (const t of [0, 0.2, 0.55, 0.9]) for (const j of ['knee', 'hip'] as const) expect(Math.abs(jointAngles(frameAt(sp('Sled Push'), 1 + t).sk, 'R')[j] - jointAngles(frameAt(sp('Sled Push'), t).sk, 'L')[j])).toBeLessThan(0.5);
  });
  test('pozycje statyczne („Ogranicz ruch”, pauza): start i koniec pierwszej połowy; żadnej trzeciej pozycji', () => { expect(staticPositions(sp('Sled Push'))).toEqual([0, 1]); });
  test('pięć stawów jak dotąd: rodziny z rigiem nie mają pola pętli (zgodność wsteczna): jointAngles i pętla wahadła bez zmian', () => {
    const k = 'Barbell Squat'; const s = figureSpec(k); if (s) { expect(loopOf(s)).toBe('wahadlo'); expect(jointAngles(frameAt(s, 1).sk, 'R').knee).toBeGreaterThan(40); }
  });
});

describe('prezentacja: wpis UI dla ćwiczenia marszowego z rodziny bez DATA_UI', () => {
  test('dataUiForPose: ćwiczenie cykliczne dostaje GAIT_UI (Marsz, kolano/biodro), niecykliczne ćwiczenie rodziny bez wpisu — null; rodzina z wpisem (carry) zachowuje swój', () => {
    expect(dataUiForPose('sled_throw', dane('sled_throw', 'Sled Push'))).toBe(GAIT_UI); expect(dataUiForPose('strongman', dane('strongman', 'Yoke Walk'))).toBe(GAIT_UI);
    expect(dataUiForPose('sled_throw', { ...dane('sled_throw', 'Wall Ball'), petla: undefined })).toBeNull(); /* bez pola petla (rzuty mają teraz jednokierunkową: ONE_WAY_UI) */ expect(GAIT_UI).toMatchObject({ names: { first: 'Marsz', second: 'Marsz' }, walk: true, joints: ['knee', 'hip'] });
    expect(dataUiForPose('carry', dane('carry', "Farmer's Walk"))?.walk).toBe(true);
  });
});

describe('niezmienniki: pozostałe ćwiczenia nie zmieniły trybu', () => {
  test('ćwiczenia sled_throw i strongman poza trzema marszowymi, oraz wszystkie rodziny z pliku poses, nie mają pola petla (domyślnie wahadło)', () => {
    const fs = require('fs') as typeof import('fs'); const path = require('path') as typeof import('path'); const dir = path.join(__dirname, '..', 'lib/figures/v2/poses'); let n = 0, z = 0;
    for (const f of fs.readdirSync(dir).filter((x: string) => x.endsWith('.json'))) { const j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as PoseFile; for (const d of Object.values(j.cwiczenia)) { n++; if (d.petla === 'cykl_lustro') z++; } }
    expect(n).toBeGreaterThan(400); expect(z).toBe(10);
  });
});

describe('ekran: karta marszowego ćwiczenia (komponent)', () => {
  const AI = RN.AccessibilityInfo as unknown as { isReduceMotionEnabled: jest.Mock };
  const setReduce = (v: boolean) => { AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(v)); };
  const flush = async () => { await act(async () => { await Promise.resolve(); }); };
  const lib = (key: string) => ({ lib: true as const, libKey: key });
  afterEach(() => { applyLang('pl'); jest.useRealTimers(); AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(false)); });
  const angleText = (): string => { const el = screen.queryByTestId('exercise-figure-v2-angle'); return el ? String(React.Children.toArray(el.props.children).join('')) : ''; };
  const phasesText = (): string => screen.getByTestId('exercise-figure-v2-phases').findAllByType(RN.Text).map(n => String(React.Children.toArray(n.props.children).join(''))).join('|');
  const lineFor = (k: string, p: number): string => { const m = measuredAngle(figureSpec(k)!, p); return `Kąt na rysunku: ${m.joint === 'knee' ? 'zgięcie kolana' : 'zgięcie biodra'} ${Math.round(m.deg)}°`; };

  test.each(['Sled Push', 'Yoke Walk', "Farmer's Walk"])('%s: animacja idzie po pętli cyklicznej — linia kąta w chwili t równa się pomiarowi w cycleAt(t), także w drugiej połowie (bez cofania i bez pauzy)', async (k) => {
    jest.useFakeTimers(); setReduce(false); render(<ExerciseFigureV2 exercise={lib(k)} />); await flush();
    expect(angleText()).toBe(lineFor(k, 0));
    let t = 0; for (const dt of [396, 594, 495, 495, 495, 495]) /* wielokrotności kroku zegara 33 ms */ { await act(async () => { jest.advanceTimersByTime(dt); }); t += dt; const exp = lineFor(k, cycleAt(t)); const got = angleText();
      expect(Math.abs(Number(got.match(/(-?\d+)°/)![1]) - Number(exp.match(/(-?\d+)°/)![1]))).toBeLessThanOrEqual(1); }
    expect(phasesText()).toBe('Marsz');
  });
  test('licznik: „Marsz” bez sekund i bez pauzy także dla Sled Push i Yoke Walk; kąt: staw nogi', async () => {
    setReduce(true); for (const k of ['Sled Push', 'Yoke Walk']) { const r = render(<ExerciseFigureV2 exercise={lib(k)} />); await flush(); expect(phasesText()).toBe('Marsz'); expect(angleText()).toMatch(/^Kąt na rysunku: zgięcie (kolana|biodra) -?\d+°$/); r.unmount(); }
  });
  test('„Zatrzymaj animację” zatrzymuje pętlę cykliczną, „Wznów” ją wznawia (jak w pozostałych figurach)', async () => {
    jest.useFakeTimers(); setReduce(false); render(<ExerciseFigureV2 exercise={lib('Sled Push')} />); await flush();
    await act(async () => { jest.advanceTimersByTime(700); }); fireEvent.press(screen.getByTestId('exercise-figure-v2-pause')); const a = angleText();
    await act(async () => { jest.advanceTimersByTime(1500); }); expect(angleText()).toBe(a);
    fireEvent.press(screen.getByTestId('exercise-figure-v2-pause')); await act(async () => { jest.advanceTimersByTime(900); }); expect(angleText()).not.toBe(a);
  });
  test('„Ogranicz ruch”: pozycje statyczne z podpisami, bez przycisku pauzy i bez animacji', async () => {
    setReduce(true); render(<ExerciseFigureV2 exercise={lib('Yoke Walk')} />); await flush();
    expect(screen.getByTestId('exercise-figure-v2-static')).toBeTruthy(); expect(screen.queryByTestId('exercise-figure-v2-anim')).toBeNull(); expect(screen.queryByTestId('exercise-figure-v2-pause')).toBeNull();
    expect(screen.getByText('Pozycja wyjściowa')).toBeTruthy(); expect(screen.getByText('Pozycja końcowa')).toBeTruthy(); expect(angleText()).toBe(lineFor('Yoke Walk', 1));
  });
  test('język EN: licznik „Walking”, linia kąta po angielsku', async () => {
    applyLang('en'); setReduce(true); render(<ExerciseFigureV2 exercise={lib('Sled Push')} />); await flush();
    expect(phasesText()).toBe('Walking'); expect(angleText()).toMatch(/^Angle in the drawing: (knee|hip) flexion -?\d+°$/); expect(EN.Marsz).toBe('Walking');
  });
});
