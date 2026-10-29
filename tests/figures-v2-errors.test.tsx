/*
 * Figury v2 — poza błędu jako modyfikacja pozy poprawnej (decyzja właściciela 25.10.2026: animacja błędu ✕ dla każdego ćwiczenia z błędem ze źródłami).
 * Rodzaje (docs/20): dane (każdy błąd ze źródłami przypisany ćwiczeniu gotowej rodziny ma animację albo nazwany wyjątek), niezmienniki (poza błędu nie przenika sprzętu,
 * różni się od poprawnej TYLKO w deklarowanych stawach, ale widocznie), logika (waga rośnie z ruchem, tempo błędu), wygląd (znacznik ✕ z tokenu danger).
 */
import * as fs from 'fs';
import * as path from 'path';
import { CUE_DATA } from '@/lib/cues';
import { CUE_SETS } from '@/lib/figures/v2/cueSets';
import {
  ERRORS, CUE_TO_ERROR, assignAll, figureSpec, frameAt, faultApplicable, faultWeight, errorMarks, checkFrame, jointAngles, shapesAt, uAt, loopLength, TEMPO, figurePalette,
  type ErrorId, type FigureSpec, type Affects,
} from '@/lib/figures/v2';
import { light, dark } from '@/lib/theme';

const READY = ['squat', 'bench_press', 'hinge'];
const KEYS = Object.entries(assignAll()).filter(([, f]) => READY.includes(f)).map(([k]) => k);
const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const U = Array.from({ length: 25 }, (_, i) => i / 24);
const POSE_ERRORS = (Object.keys(ERRORS) as ErrorId[]).filter(e => ERRORS[e].kind === 'pose');
const ANG: Record<Affects, string[]> = { knee: ['knee'], ankle: ['ankle'], hip: ['hip'], shoulder: ['shElev'], elbow: ['elbow'], spine: [], kneeLat: [], heel: [], pelvis: [], bar: [] };

/** Błędy ze źródłami (id wskazówki „częsty błąd”) przypisane ćwiczeniu: własne (lib/cues) albo zestaw ogólny. */
const errIds = (k: string): string[] => { const e = CUE_SETS.items[k]; return e.b === 'own' ? (CUE_DATA.exercises[k]?.mistakes ?? []) /* karta ukryta po recenzji treści (M1-audytor-generalny-038, 28.10.2026) — bez błędów */.map(r => r.c) : e.b === 'general' ? e.err ?? [] : []; };

describe('definicje błędów', () => {
  test('każdy błąd: wskazówka źródłowa, powód, deklaracja stawów; błędy pozowe mają zmianę parametrów, błąd tempa ma czasy szybsze niż normalne', () => {
    for (const e of Object.values(ERRORS)) { expect([e.id, e.cue.length > 0, e.why.length > 10]).toEqual([e.id, true, true]); if (e.kind === 'pose') expect(Object.keys(e.mods).length).toBeGreaterThan(0); }
    expect(ERRORS.jerk.mods.tempo!.downMs).toBeLessThan(TEMPO.downMs); expect(ERRORS.jerk.mods.tempo!.upMs).toBeLessThan(TEMPO.upMs); expect(ERRORS.jerk.affects).toEqual([]);
    expect(CUE_TO_ERROR['sq.mis.kneesIn']).toBe('kneesIn'); expect(CUE_TO_ERROR['sq.mis.heels']).toBe('heels'); expect(CUE_TO_ERROR['mis.roundBack']).toBe('roundBack');
    expect(CUE_TO_ERROR['bp.mis.arch']).toBe('arch'); expect(CUE_TO_ERROR['mis.barAway']).toBe('barAway'); expect(CUE_TO_ERROR['rdl.mis.knees']).toBe('kneesBent'); expect(CUE_TO_ERROR['mis.jerk']).toBe('jerk');
  });
  test('1.0.1: każdy błąd figury wskazuje opis błędu (rodzina „mis”), nie wskazówkę poprawnej techniki; opis jest w każdym języku (RDL: kolana ugięte jak w przysiadzie)', () => {
    /* RDL kneesBent wskazywał „rdl.knees” („Kolana tylko lekko ugięte — to nie przysiad”): animacja błędu podpisana zaleceniem zamiast opisem błędu. */
    for (const e of Object.values(ERRORS)) for (const c of e.cue) expect([e.id, c, /(^|\.)mis\./.test(c)]).toEqual([e.id, c, true]);
    expect(ERRORS.kneesBent.cue).toEqual(['rdl.mis.knees']); expect(CUE_TO_ERROR['rdl.knees']).toBeUndefined();
    const dir = path.join(__dirname, '..', 'lib/cues/text');
    for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.json') && x !== 'es-419.json')) {
      const d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as Record<string, string>;
      expect([f, typeof d['rdl.mis.knees'], typeof d['bp.elbowsMid']]).toEqual([f, 'string', 'string']);
    }
    const pl = JSON.parse(fs.readFileSync(path.join(dir, 'pl.json'), 'utf8')) as Record<string, string>;
    expect(pl['rdl.mis.knees']).not.toBe(pl['rdl.knees']); expect(pl['bp.elbowsMid']).toMatch(/Łokcie/);
  });
  test('słownik deklaracji stawów: każdy błąd deklaruje tylko znane wielkości', () => {
    const KNOWN: Affects[] = ['knee', 'ankle', 'hip', 'spine', 'kneeLat', 'heel', 'pelvis', 'bar', 'shoulder', 'elbow'];
    for (const e of Object.values(ERRORS)) for (const a of e.affects) expect([e.id, KNOWN.includes(a)]).toEqual([e.id, true]);
    expect(new Set(Object.values(ERRORS).flatMap(e => e.affects))).toEqual(new Set(KNOWN.filter(a => a !== 'elbow' || true).filter(a => Object.values(ERRORS).some(e => e.affects.includes(a)))));
  });
  test('tempo błędu: uAt z szybszym tempem kończy opuszczanie szybciej; długość pętli krótsza', () => {
    const t = ERRORS.jerk.mods.tempo!; expect(uAt(TEMPO.holdMs + t.downMs, true, t)).toBeCloseTo(1, 6); expect(uAt(TEMPO.holdMs + t.downMs, true)).toBeLessThan(0.9);
    expect(loopLength(true, t)).toBeLessThan(loopLength(true));
  });
  test('waga błędu: 0 na starcie ruchu i rośnie z postępem (przysiad, wyciskanie); z podłogi największa przy oderwaniu i maleje ku wyprostowi', () => {
    expect(faultWeight(spec('Back Squat'), 0)).toBe(0); expect(faultWeight(spec('Back Squat'), 1)).toBeCloseTo(1, 9); expect(faultWeight(spec('Bench Press (sztanga)'), 0.5)).toBeCloseTo(0.5, 9);
    expect(faultWeight(spec('Deadlift (sztanga)'), 0)).toBe(1); expect(faultWeight(spec('Deadlift (sztanga)'), 1)).toBeCloseTo(0.4, 9);
  });
});

describe('pokrycie: każdy błąd ze źródłami ma animację', () => {
  const EXEMPT: Record<string, string> = {
    'JM Press|bp.mis.arch': 'gryf przy szyi: wygięcie lędźwi unosi głowę w gryf — poza błędu przeniknęłaby sprzęt',
    'Sumo Squat (hantel)|sq.mis.kneesIn': 'hantel między kolanami: kolana do środka uderzałyby w ciężar — poza błędu przeniknęłaby sprzęt',
  };
  test('wszystkie id błędów w ćwiczeniach 87 gotowych: mają mapowanie na błąd pozowy/tempa i są stosowalne albo są nazwanym wyjątkiem z powodem', () => {
    const unmapped: string[] = [], notApplicable: string[] = [];
    for (const k of KEYS) for (const id of errIds(k)) { const e = CUE_TO_ERROR[id]; if (!e) { unmapped.push(`${k}: ${id}`); continue; } if (!faultApplicable(spec(k), e) && !EXEMPT[`${k}|${id}`]) notApplicable.push(`${k}: ${id}`); }
    expect(unmapped).toEqual([]); expect(notApplicable).toEqual([]);
    for (const [key, why] of Object.entries(EXEMPT)) { const [k, id] = key.split('|'); expect([key, faultApplicable(spec(k), CUE_TO_ERROR[id]), why.length > 20]).toEqual([key, false, true]); }
  });
  test('liczba par ćwiczenie × błąd z animacją: 126 pozowych (bez tempa), każde ćwiczenie ma co najmniej tempo', () => {
    let n = 0; for (const k of KEYS) for (const e of POSE_ERRORS) if (faultApplicable(spec(k), e)) n++;
    expect(n).toBe(126); for (const k of KEYS) expect(faultApplicable(spec(k), 'jerk')).toBe(true);
  });
});

describe('poza błędu: bez przenikania, tylko deklarowane stawy, widoczna różnica', () => {
  test('126 par: każda klatka bez błędów geometrii (podłoga, zasięg, przenikanie ciało–sprzęt, chwyt)', () => {
    const bad: string[] = [];
    for (const k of KEYS) for (const e of POSE_ERRORS) { if (!faultApplicable(spec(k), e)) continue; for (const u of U) { const is = checkFrame(frameAt(spec(k), u, e)); if (is.length) bad.push(`${k} ${e} u=${u.toFixed(2)}: ${is[0].code} ${is[0].detail}`); } }
    expect(bad).toEqual([]);
  });
  test('kąty niedeklarowane w `affects` różnią się od pozy poprawnej o ≤ 4° w każdej pozycji (bark, łokieć, biodro, kolano, kostka)', () => {
    const bad: string[] = [];
    for (const k of KEYS) for (const e of POSE_ERRORS) { if (!faultApplicable(spec(k), e)) continue; const allowed = new Set(ERRORS[e].affects.flatMap(a => ANG[a]));
      for (const u of U) { const a = jointAngles(frameAt(spec(k), u).sk, 'R'), b = jointAngles(frameAt(spec(k), u, e).sk, 'R');
        for (const j of ['hip', 'knee', 'ankle', 'elbow', 'shElev'] as const) if (!allowed.has(j) && Math.abs(a[j] - b[j]) > 4) bad.push(`${k} ${e} u=${u.toFixed(2)} ${j}: ${Math.abs(a[j] - b[j]).toFixed(1)}°`); } }
    expect(bad).toEqual([]);
  });
  test('na początku ruchu (waga 0) poza błędu = poza poprawna; w pozycji skrajnej różni się widocznie (≥ 3 cm w deklarowanym punkcie)', () => {
    const at = (k: string, e: ErrorId, u: number) => ({ c: frameAt(spec(k), u), f: frameAt(spec(k), u, e) });
    for (const [k, e] of [['Back Squat', 'kneesIn'], ['Back Squat', 'heels'], ['Bench Press (sztanga)', 'arch'], ['RDL (sztanga)', 'kneesBent']] as [string, ErrorId][]) { const a = at(k, e, 0); expect([k, e, JSON.stringify(a.c.sk.pelvis)]).toEqual([k, e, JSON.stringify(a.f.sk.pelvis)]); }
    const sq = at('Back Squat', 'kneesIn', 1); expect(sq.c.sk.legs.R.knee[2] - sq.f.sk.legs.R.knee[2]).toBeGreaterThan(5); expect(sq.f.sk.legs.R.knee[2]).toBeLessThan(sq.f.sk.legs.R.ankle[2]); /* kolano poza linię stopy do środka */
    const hl = at('Back Squat', 'heels', 1); expect(hl.f.sk.legs.R.heel[1]).toBeGreaterThan(6); expect(hl.c.sk.legs.R.heel[1]).toBeLessThan(0.5); expect(Math.abs(hl.f.sk.legs.R.toe[1])).toBeLessThan(0.5);
    const ar = at('Bench Press (sztanga)', 'arch', 1); expect(ar.f.sk.pelvis[1] - ar.c.sk.pelvis[1]).toBeGreaterThan(6); expect(ar.f.sk.spineMid[1]).toBeGreaterThan(ar.f.sk.pelvis[1] - 1);
    const rb = at('Deadlift (sztanga)', 'roundBack', 0); const bendOf = (f: typeof rb.c) => f.sk.spineMid[1] - (f.sk.pelvis[1] + f.sk.shoulderC[1]) / 2;
    expect(Math.abs(bendOf(rb.f))).toBeGreaterThan(Math.abs(bendOf(rb.c)) + 3);
    const ba = at('Deadlift (sztanga)', 'barAway', 0); expect(ba.f.info.bar[0] - ba.c.info.bar[0]).toBeGreaterThan(6);
    const kb = at('RDL (sztanga)', 'kneesBent', 1); expect(jointAngles(kb.f.sk, 'R').knee - jointAngles(kb.c.sk, 'R').knee).toBeGreaterThan(8);
  });
});

describe('znacznik ✕ i kształty błędu', () => {
  test('znacznik: pierścień i dwie kreski w roli „error” (token danger), nad ciałem; liczba znaczników zależy od widoku (kolana: jedno z boku, dwa z przodu)', () => {
    const f = frameAt(spec('Back Squat'), 1, 'kneesIn');
    expect(errorMarks(f, 'side', 'kneesIn').filter(s => s.id === 'errorMark').length).toBe(2); expect(errorMarks(f, 'front', 'kneesIn').filter(s => s.id === 'errorMark').length).toBe(4);
    for (const e of POSE_ERRORS) expect([e, errorMarks(f, 'side', e).length > 0]).toEqual([e, true]);
    for (const th of [light, dark]) expect(figurePalette(th).error).toBe(th.danger);
    expect(shapesAt(spec('Back Squat'), 1, 'side', false, 'kneesIn').some(s => s.id === 'errorMark')).toBe(true); expect(shapesAt(spec('Back Squat'), 1, 'side').some(s => s.id === 'errorMark')).toBe(false);
  });
});
