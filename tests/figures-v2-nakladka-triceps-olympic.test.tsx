/*
 * (wdrożenie 08.11.2026) Figury v2 — nakładka techniki: rodziny olympic i triceps (04.11.2026, decyzja właściciela docs/18: „żadna rodzina nie wychodzi bez nakładki”; zasady: zawsze widoczne, ≤ 3 linie + 1 łuk na rzut łącznie
 * ze starymi liniami odniesienia, liczba kąta tylko w podpisie „Kąt na rysunku”, złamana reguła w kolorze błędu, element tylko dla reguły „ustalone” ze zdaniem na karcie wariantu).
 * Rodzaje (docs/20): dane (reguła ze źródłem), geometria (łuk = measuredAngle ±1°, także w pętli jednokierunkowej), niezmienniki (bez tekstu i liczb, limit na rzut, brak dwóch linii w tym samym miejscu,
 * element ⇔ wskazówka), kolor błędu, VoiceOver i podpis (PL/EN), wygląd (zrzut tokenów roli), regresja (inne rodziny bez zmian). Wzór: tests/figures-v2-nakladka-curl-pullup.test.tsx.
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: ten test sprawdza rysowanie, nie recenzję rodziny */
import * as fs from 'fs';
import * as path from 'path';
import React from 'react';
import * as RN from 'react-native';
import { render, screen, act } from '@testing-library/react-native';
import { ExerciseFigureV2, joinCues } from '@/components/ExerciseFigureV2';
import { CATALOG } from '@/lib/catalog.generated';
import { figureSpec, frameAt, guideShapes, measuredAngle, measuredSide, overlayShapes, errorBreaksRule, loopOf, type FigureSpec, type Shape } from '@/lib/figures/v2';
import { OVERLAY_MAX_ARCS, OVERLAY_MAX_LINES, TECHNIQUE, techniqueGeom, techniqueShapes, techniquesFor } from '@/lib/figures/v2/overlay';
import { OLYMPIC_TECHNIQUE, OLYMPIC_HIP_EXERCISES } from '@/lib/figures/v2/overlay/olympic';
import { TRICEPS_TECHNIQUE } from '@/lib/figures/v2/overlay/triceps';
import { errorsOf, techniquesOf, onDrawingCues, guidesOf, cueIdsOf, errorText, measureLine } from '@/lib/figures/v2/ui';
import { proj } from '@/lib/figures/v2/draw';
import { applyLang, t } from '@/lib/i18n';

const spec = (k: string): FigureSpec => figureSpec(k) as FigureSpec;
const lib = (key: string) => ({ lib: true as const, libKey: key });
const AI = RN.AccessibilityInfo as unknown as { isReduceMotionEnabled: jest.Mock };
const flush = async () => { await act(async () => { await Promise.resolve(); }); };
const keysOf = (family: string) => Object.keys(CATALOG).filter(k => { try { return figureSpec(k)?.family === family; } catch { return false; } });
const OLY_KEYS = keysOf('olympic'), TRI_KEYS = keysOf('triceps');
const US = Array.from({ length: 21 }, (_, i) => i / 20);
const role = (x: Shape): string | undefined => (x.k === 'line' ? x.role : (x as { stroke?: string }).stroke);
const sens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/zrodla/figury-sens.json'), 'utf8')).rodziny;
type Ln = Extract<Shape, { k: 'line' }>;

afterEach(() => { applyLang('pl'); AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(false)); });

/** Oczekiwane elementy per ćwiczenie (04.11.2026): wynik doboru po kartach × reguły „ustalone” wariantu; ćwiczenia spoza tabeli (z kartą własną olympic.* bez wpisu w wskazowki_na_reguly) nie mają elementu. */
const L = 'tricepsElbowLimb', P = 'tricepsElbowPlumb', B = 'olympicBackRef', C = 'olympicBarCloseRef', K = 'olympicKneeLimb', H = 'olympicHipLimb';
const OLY_WANT: Record<string, string[]> = {
  'Power Clean': [C, K, H], 'Clean': [C, K, H], 'Power Snatch': [C, K, H], 'Snatch Pull': [C, K, H], 'Barbell Snatch': [C, K], 'Hang Snatch': [C, K], 'Block Power Snatch': [B, C, K],
  'Clean and Jerk': [C], 'Hang Clean': [C], 'Block Snatch': [C], 'Muscle Snatch': [C], 'Block Power Clean': [C], 'Split Snatch': [C],
  'Clean Shrug': [], 'Snatch Shrug': [], 'Jerk Balance': [], 'Jerk Dip Squat': [], 'Clean Pull': [], 'Block Clean': [], 'Split Clean': [], 'Snatch Balance': [], 'Power Jerk': [], 'Split Jerk': [], 'Squat Jerk': [],
};
const TRI_NONE = ['Machine Triceps Extension', 'Cable Incline Triceps Extension', 'Kneeling Cable Triceps Extension'];

describe('dane: elementy rodzin olympic i triceps ← reguły ze źródłem (04.11.2026)', () => {
  test('rejestr: olympic = pleców + sztanga blisko + kolano + biodro; triceps = łokieć (limb) + pion łokcia przy bokach; TECHNIQUE wskazuje te same tablice', () => {
    expect(OLYMPIC_TECHNIQUE.map(d => d.id)).toEqual([B, C, K, H]); expect(TRICEPS_TECHNIQUE.map(d => d.id)).toEqual([L, P]);
    expect(TECHNIQUE.olympic).toBe(OLYMPIC_TECHNIQUE); expect(TECHNIQUE.triceps).toBe(TRICEPS_TECHNIQUE);
    expect(OLYMPIC_TECHNIQUE.map(d => [d.kind, d.joint, d.ref, d.views])).toEqual([
      ['ref', undefined, { shape: 'segment', from: 'pelvis', to: 'shoulderC' }, ['side']], ['ref', undefined, { shape: 'segment', from: 'ankle', to: 'knee' }, ['side']], ['limb', 'knee', undefined, ['side']], ['limb', 'hip', undefined, ['side']]]);
    expect(TRICEPS_TECHNIQUE.map(d => [d.kind, d.joint, d.ref, d.views])).toEqual([['limb', 'elbow', undefined, ['side']], ['ref', undefined, { shape: 'vertical', through: 'shoulder', dir: 'down', until: 'pelvis' }, ['side']]]);
  });
  test.each([['olympic', OLYMPIC_TECHNIQUE], ['triceps', TRICEPS_TECHNIQUE]] as const)('%s: reguła każdego elementu istnieje i jest „ustalone”; każda wskazówka elementu należy do wskazowki_na_reguly reguły', (fam, defs) => {
    for (const d of defs) {
      const r = sens[fam].reguly[d.rule]; expect(r).toBeTruthy(); expect(r.pewnosc).toMatch(/^ustalone/); expect(d.cue.length).toBeGreaterThan(0);
      for (const c of d.cue) expect([c, sens[fam].wskazowki_na_reguly[c]]).toEqual([c, expect.arrayContaining([d.rule])]);
    }
    expect(defs.map(d => d.rule)).toEqual(fam === 'olympic' ? ['plecy_neutralne', 'sztanga_blisko', 'wyprost_bioder_kolan', 'wyprost_bioder_kolan'] : ['lokiec_prostuje_sie', 'ramie_nieruchome']);
  });
  test('reguły bez statusu „ustalone” NIE mają elementu (olympic: rece_proste_do_wyprostu, rece_proste, odbior_nad_glowa, kolana_nad_stopami; zero elementów dla ich reguł)', () => {
    const rules = new Set(OLYMPIC_TECHNIQUE.map(d => d.rule)); const nie = Object.entries(sens.olympic.reguly as Record<string, { pewnosc: string }>).filter(([, r]) => !/^ustalone/.test(r.pewnosc)).map(([k]) => k);
    expect(nie).toEqual(expect.arrayContaining(['rece_proste_do_wyprostu', 'rece_proste', 'odbior_nad_glowa', 'kolana_nad_stopami'])); for (const k of nie) expect([k, rules.has(k)]).toEqual([k, false]);
  });
  test('zestaw biodra: lista ćwiczeń nie zawiera ćwiczenia z linią pleców (Block Power Snatch), a każde ćwiczenie listy ma zdanie oly.legs i mierzone biodro', () => {
    expect(OLYMPIC_HIP_EXERCISES).not.toContain('Block Power Snatch');
    for (const k of OLYMPIC_HIP_EXERCISES) { expect(cueIdsOf(k).ids).toContain('oly.legs'); expect(measuredAngle(spec(k), 0.5).joint).toBe('hip'); }
  });
});

describe('element ⇔ wskazówka na karcie i reguła „ustalone” wariantu: tabela ćwiczeń', () => {
  test('olympic: techniquesOf = tabela dla KAŻDEGO ćwiczenia rodziny (24 z figurą), zdanie elementu istnieje', () => {
    expect(OLY_KEYS.length).toBe(24); expect(Object.keys(OLY_WANT).sort()).toEqual([...OLY_KEYS].sort());
    for (const [k, w] of Object.entries(OLY_WANT)) { expect([k, techniquesOf(k)]).toEqual([k, w]); const have = new Set(cueIdsOf(k).ids); expect(techniquesFor('olympic', have, k).map(d => d.id)).toEqual(w);
      for (const id of w) expect(errorText(TECHNIQUE.olympic.find(d => d.id === id)!.cue.find(c => have.has(c))!).length).toBeGreaterThan(0); }
  });
  test('triceps: element ruchu w każdym ćwiczeniu z karty „zginaj/prostuj łokcie”; pion łokcia tylko Pushdown i Reverse Grip Pushdown; bez elementu: Machine / Cable Incline / Kneeling Cable (zdania ogólne bez ruchu łokcia)', () => {
    expect(TRI_KEYS.length).toBe(29);
    for (const k of TRI_KEYS) { const w = TRI_NONE.includes(k) ? [] : /Pushdown$/.test(k) && !/Single Arm/.test(k) ? [L, P] : [L]; expect([k, techniquesOf(k)]).toEqual([k, w]); }
    expect(techniquesOf('Triceps Pushdown')).toEqual([L, P]); expect(techniquesFor('triceps', ['tpd.elbows'], 'Triceps Pushdown').map(d => d.id)).toEqual([P]);
    expect(techniquesFor('triceps', ['tpd.move', 'ote.upperArm']).map(d => d.id)).toEqual([L]); expect(techniquesFor('triceps', ['dl.lift'])).toEqual([]); expect(techniquesFor('olympic', ['curl.dbMove'])).toEqual([]);
  });
  test('wyjątki jawne: ćwiczenia bez elementu nie mają zdania ruchu z wskazowki_na_reguly (powód w danych, nie lista wyjątków w teście strażnika)', () => {
    for (const k of TRI_NONE) expect([k, cueIdsOf(k).ids.some(c => TRICEPS_TECHNIQUE[0].cue.includes(c))]).toEqual([k, false]);
  });
});

describe('geometria: łuk = kąt z jointAngles (±1°) w 21 klatkach, także w pętli jednokierunkowej', () => {
  const withLimb = [...OLY_KEYS, ...TRI_KEYS].filter(k => techniquesOf(k).some(id => /Limb$/.test(id)));
  test('każde ćwiczenie z elementem kończyny: rozwarcie łuku = measuredAngle w mierzonym stawie; linia zawsze, łuk gdy zgięcie ≥ progu; element dokładnie jednej kończyny', () => {
    expect(withLimb.length).toBeGreaterThan(30); let sprawdzone = 0;
    for (const k of withLimb) { const s = spec(k); const side = measuredSide(s); const mj = measuredAngle(s, 0.5).joint; const ids = techniquesOf(k).filter(id => /Limb$/.test(id) && (TECHNIQUE[s.family].find(d => d.id === id)!.joint === mj)); if (!ids.length) continue; /* Block Power Snatch: biodro mierzone, element biodra poza listą — bez kończyny (linia pleców zamiast) */
      for (const u of US) {
        const f = frameAt(s, u); const m = measuredAngle(s, u); const g = techniqueGeom('limb', f.sk, side, m.joint as 'elbow' | 'knee' | 'hip')!;
        expect([k, u, Math.abs(g.sweepDeg - m.deg) <= 1]).toEqual([k, u, true]);
        const sh = overlayShapes(s, u, 'side', ids); expect([k, u, sh.filter(x => x.k === 'line').length]).toEqual([k, u, 1]); expect([k, u, sh.filter(x => x.k === 'poly').length]).toEqual([k, u, g.arc ? 1 : 0]);
        sprawdzone++;
      } }
    expect(sprawdzone).toBeGreaterThan(30 * 21);
  });
  test('olympic: staw elementu = staw mierzony (kolano albo biodro) — nigdy oba naraz; pętla jednokierunkowa u 0 → 1 obejmuje całe powtórzenie, element jest w każdej klatce', () => {
    const jednokier = OLY_KEYS.filter(k => loopOf(spec(k)) === 'jednokierunkowa' && techniquesOf(k).length > 0); expect(jednokier.length).toBeGreaterThanOrEqual(8);
    const narysowane = (k: string) => [K, H].filter(id => techniquesOf(k).includes(id) && overlayShapes(spec(k), 0.5, 'side', [id]).length > 0);
    for (const k of OLY_KEYS) { const j = measuredAngle(spec(k), 0.5).joint; const want = !techniquesOf(k).some(id => /Limb$/.test(id)) ? [] : j === 'knee' ? [K] : OLYMPIC_HIP_EXERCISES.includes(k) ? [H] : []; expect([k, narysowane(k)]).toEqual([k, want]); }
    expect(narysowane('Block Power Snatch')).toEqual([]); expect(narysowane('Power Clean')).toEqual([H]); expect(narysowane('Barbell Snatch')).toEqual([K]);
    for (const k of jednokier) for (const u of US) expect([k, u, overlayShapes(spec(k), u, 'side', techniquesOf(k)).length > 0]).toEqual([k, u, true]);
  });
  test('Triceps Pushdown: łokieć zgięty na dole zakresu rośnie rozwarcie łuku; wyprost → łuk znika albo mały (zgięcie < 25° u = 1)', () => {
    const s = spec('Triceps Pushdown'); const sw = (u: number) => techniqueGeom('limb', frameAt(s, u).sk, measuredSide(s), 'elbow')!.sweepDeg;
    expect(Math.max(sw(0), sw(1))).toBeGreaterThan(60); expect(Math.min(sw(0), sw(1))).toBeLessThan(26);
  });
  test('rzut z przodu/z góry nie dostaje elementu: olympic i triceps mają tylko rzut z boku', () => {
    for (const d of [...OLYMPIC_TECHNIQUE, ...TRICEPS_TECHNIQUE]) expect([d.id, d.views]).toEqual([d.id, ['side']]);
    for (const k of [...OLY_KEYS, ...TRI_KEYS]) expect([k, spec(k).views]).toEqual([k, ['side']]);
    for (const u of US) { expect(overlayShapes(spec('Power Clean'), u, 'front', techniquesOf('Power Clean'))).toEqual([]); expect(overlayShapes(spec('Triceps Pushdown'), u, 'top', techniquesOf('Triceps Pushdown'))).toEqual([]); }
  });
});

describe('niezmienniki: bez tekstu i liczb, limit elementów na rzut, nic nie leży jedno pod drugim', () => {
  test('elementy to wyłącznie linie ciągłe i łuki (poly bez wypełnienia), w warstwie nad ciałem, bez pól tekstowych; id z rejestru', () => {
    for (const k of [...OLY_KEYS, ...TRI_KEYS]) { const s = spec(k); const ts = techniquesOf(k); for (const u of [0, 0.5, 1]) for (const x of overlayShapes(s, u, 'side', ts)) {
      expect(['line', 'poly']).toContain(x.k); expect(x.z).toBeGreaterThan(3000); expect(x.id).toMatch(/^(tricepsElbowLimb(Line|Arc)|tricepsElbowPlumbLine|olympic(BackRef|BarCloseRef)Line|olympic(Knee|Hip)Limb(Line|Arc))$/);
      if (x.k === 'line') expect(x.dash).toBeUndefined(); else expect((x as { fill?: unknown }).fill).toBeUndefined();
      expect(JSON.stringify(x)).not.toMatch(/"(text|label|value)"/);
    } }
  });
  test('limit: ≤ 3 linie i ≤ 1 łuk na rzut — suma linii odniesienia (GUIDES) i nakładki, w każdym ćwiczeniu, klatce i pozie błędu', () => {
    let razem = 0, zNakladka = 0;
    for (const k of [...OLY_KEYS, ...TRI_KEYS]) { const s = spec(k); const g = guidesOf(k), t2 = techniquesOf(k); const errs = [undefined, ...errorsOf(s).map(e => e.error)];
      for (const u of [0, 0.25, 0.5, 0.75, 1]) for (const e of errs) {
        const all = [...guideShapes(s, u, 'side', g, e), ...overlayShapes(s, u, 'side', t2, e, g)]; razem++; if (t2.length) zNakladka++;
        expect([k, u, all.filter(x => x.k === 'line').length <= OVERLAY_MAX_LINES]).toEqual([k, u, true]); expect([k, u, all.filter(x => x.k === 'poly').length <= OVERLAY_MAX_ARCS]).toEqual([k, u, true]);
      } }
    expect(razem).toBeGreaterThan(250); expect(zNakladka).toBeGreaterThan(150);
  });
  test('dwie linie (odniesienia + nakładka) nie leżą jedna pod drugą w żadnej klatce (olympic: Power Clean, Clean, Snatch Pull, Power Snatch, Block Power Snatch…; triceps: Pushdown)', () => {
    const overlap = (p: Ln, q: Ln): number => { const [s1, l1] = Math.hypot(p.b[0] - p.a[0], p.b[1] - p.a[1]) <= Math.hypot(q.b[0] - q.a[0], q.b[1] - q.a[1]) ? [p, q] : [q, p];
      const dx = l1.b[0] - l1.a[0], dy = l1.b[1] - l1.a[1], Ll = Math.hypot(dx, dy) || 1; const ux = dx / Ll, uy = dy / Ll;
      const dist = (pt: [number, number]) => Math.abs((pt[0] - l1.a[0]) * uy - (pt[1] - l1.a[1]) * ux), along = (pt: [number, number]) => (pt[0] - l1.a[0]) * ux + (pt[1] - l1.a[1]) * uy;
      if (dist(s1.a) > 1.2 || dist(s1.b) > 1.2) return 0; const lo = Math.max(0, Math.min(along(s1.a), along(s1.b))), hi = Math.min(Ll, Math.max(along(s1.a), along(s1.b))); return Math.max(0, hi - lo) / (Math.hypot(s1.b[0] - s1.a[0], s1.b[1] - s1.a[1]) || 1); };
    /* próg 0,5 (jak w curl/pull_up); wyjątek jawny: odcinek kostka–kolano (olympicBarCloseRef) i linia uda z łukiem kolana (olympicKneeLimb) leżą na jednej prostej, gdy noga jest prosta — pokrywają się wtedy tylko na ok. 28 cm (14 cm po obu stronach kolana), próg 0,75 */
    const prog = (a: Ln, b: Ln) => [a.id, b.id].sort().join('+') === 'olympicBarCloseRefLine+olympicKneeLimbLine' ? 0.75 : 0.5;
    let pary = 0; const bad: string[] = [];
    for (const k of [...OLY_KEYS, ...TRI_KEYS]) { const s = spec(k); const g = guidesOf(k), t2 = techniquesOf(k);
      for (const u of US) for (const e of [undefined, ...errorsOf(s).map(x => x.error)]) { const ls = [...guideShapes(s, u, 'side', g, e), ...overlayShapes(s, u, 'side', t2, e, g)].filter(x => x.k === 'line') as Ln[];
        for (let i = 0; i < ls.length; i++) for (let j = i + 1; j < ls.length; j++) { pary++; if (overlap(ls[i], ls[j]) >= prog(ls[i], ls[j])) bad.push(`${k} u=${u} ${ls[i].id}+${ls[j].id}`); } } }
    expect(pary).toBeGreaterThan(100); expect(bad).toEqual([]);
  });
  test('pion łokcia (triceps) zaczyna się w barku i kończy na wysokości miednicy (nie schodzi pod podłogę); linia pleców olympic zaczyna się w miednicy i wychodzi za bark', () => {
    for (const k of ['Triceps Pushdown', 'Reverse Grip Triceps Pushdown']) { const s = spec(k); const side = measuredSide(s);
      for (const u of US) { const f = frameAt(s, u); const ln = overlayShapes(s, u, 'side', [P]).filter(x => x.k === 'line') as Ln[]; expect([k, u, ln.length]).toEqual([k, u, 1]);
        const top = proj(f.sk.arms[side].shoulder, 'side'), bot = proj(f.sk.pelvis, 'side'); const ys = [ln[0].a[1], ln[0].b[1]];
        expect([k, u, ln[0].a[0] === ln[0].b[0], Math.max(...ys) - top[1] < 1e-9, Math.abs(Math.min(...ys) - bot[1]) < 1e-9]).toEqual([k, u, true, true, true]); } }
    const s = spec('Block Power Snatch'); for (const u of US) { const f = frameAt(s, u); const ln = overlayShapes(s, u, 'side', [B]).filter(x => x.k === 'line') as Ln[]; expect(ln.length).toBe(1);
      const p = proj(f.sk.pelvis, 'side'), sh = proj(f.sk.shoulderC, 'side'); expect([Math.hypot(ln[0].a[0] - p[0], ln[0].a[1] - p[1]) < 1e-6, Math.hypot(ln[0].b[0] - sh[0], ln[0].b[1] - sh[1]) > 5]).toEqual([true, true]); }
  });
});

describe('kolor błędu: element w roli error tylko wtedy, gdy błąd łamie jego regułę', () => {
  test('silnik z danymi rodziny: reguła złamana → linia (i łuk) w roli error; inna reguła → guide, dla każdego elementu obu rodzin', () => {
    for (const [k, defs, joint] of [['Triceps Pushdown', TRICEPS_TECHNIQUE, 'elbow'], ['Power Clean', OLYMPIC_TECHNIQUE, 'hip'], ['Barbell Snatch', OLYMPIC_TECHNIQUE, 'knee']] as const) {
      const sk = frameAt(spec(k), 0.5).sk; const side = measuredSide(spec(k)); const ctx = (danger: (r: string) => boolean) => ({ joint, side, limbShown: true, danger });
      for (const d of defs.filter(x => x.kind !== 'limb' || x.joint === joint)) { const red = techniqueShapes(sk, 'side', [d], ctx(r => r === d.rule)), ok = techniqueShapes(sk, 'side', [d], ctx(r => r === 'inna'));
        expect([k, d.id, red.length > 0]).toEqual([k, d.id, true]); for (const x of red) expect(role(x)).toBe('error'); for (const x of ok) expect(role(x)).toBe('guide'); }
    }
  });
  test('prawdziwe błędy ćwiczeń: kolor każdego elementu = errorBreaksRule(błąd, reguła elementu) w każdej pozie błędu; grupa błędu oly.mis (plecy_tor) łamie plecy_neutralne i sztanga_blisko, nie wyprost', () => {
    for (const k of [...OLY_KEYS, ...TRI_KEYS]) { const s = spec(k); for (const id of techniquesOf(k)) { const d = TECHNIQUE[s.family].find(x => x.id === id)!;
      for (const { error } of errorsOf(s)) { const broken = errorBreaksRule(s, error, d.rule); for (const u of [0.5, 1]) for (const x of overlayShapes(s, u, 'side', [id], error)) expect([k, error, id, role(x)]).toEqual([k, error, id, broken ? 'error' : 'guide']); } } }
    const g = JSON.parse(JSON.stringify(sens.olympic.grupy_bledow)); expect(g['oly.mis']).toBe('plecy_tor');
    expect([sens.olympic.reguly.plecy_neutralne.grupa, sens.olympic.reguly.sztanga_blisko.grupa, sens.olympic.reguly.wyprost_bioder_kolan.grupa]).toEqual(['plecy_tor', 'plecy_tor', 'zakres']);
  });
});

describe('VoiceOver i podpis: „Na rysunku: …” z elementem, „Kąt na rysunku” bez nowych tekstów', () => {
  test('onDrawingCues: triceps — ruch i łokcie przy bokach (Pushdown), sam ruch (Skullcrusher); olympic — blisko ciała i nogi (Power Clean), plecy + blisko (Block Power Snatch); brak — Clean Shrug', () => {
    expect(onDrawingCues(spec('Triceps Pushdown'), guidesOf('Triceps Pushdown'), techniquesOf('Triceps Pushdown'))).toEqual(['tpd.move', 'tpd.elbows']);
    expect(onDrawingCues(spec('Skullcrusher (EZ)'), guidesOf('Skullcrusher (EZ)'), techniquesOf('Skullcrusher (EZ)'))).toEqual(['skull.move']);
    expect(onDrawingCues(spec('Power Clean'), guidesOf('Power Clean'), techniquesOf('Power Clean'))).toEqual(['oly.close', 'oly.legs']);
    expect(onDrawingCues(spec('Block Power Snatch'), guidesOf('Block Power Snatch'), techniquesOf('Block Power Snatch'))).toEqual(['oly.back', 'oly.close']); /* biodro bez elementu (leżałby na linii pleców) */
    expect(onDrawingCues(spec('Clean Shrug'), guidesOf('Clean Shrug'), techniquesOf('Clean Shrug'))).toEqual([]);
  });
  test('podpis „Kąt na rysunku”: staw elementu = staw mierzony; szablon i etykiety (łokieć, kolano, biodro) przez t() — ten sam klucz PL i EN, bez nowych kluczy', () => {
    for (const [k, staw] of [['Triceps Pushdown', 'zgięcie łokcia'], ['Barbell Snatch', 'zgięcie kolana'], ['Power Clean', 'zgięcie biodra']] as const) {
      const m = measuredAngle(spec(k), 0.5); const l = measureLine({ joint: m.joint, deg: m.deg, unit: 'deg' }); expect([k, l.template, l.staw]).toEqual([k, 'Kąt na rysunku: {staw} {n}°', staw]);
      applyLang('en'); expect(t(l.template).startsWith('Angle in the drawing: ')).toBe(true); expect(t(l.staw)).not.toBe(l.staw); applyLang('pl'); }
  });
  test('komponent: etykieta obrazu = „Rysunek ruchu: …. Na rysunku: {zdania}” w PL i EN (Triceps Pushdown, Power Clean)', async () => {
    AI.isReduceMotionEnabled.mockImplementation(() => Promise.resolve(true));
    await render(<ExerciseFigureV2 exercise={lib('Triceps Pushdown')} name="Prostowanie ramion na wyciągu" />); await flush();
    expect(screen.getAllByTestId('exercise-figure-v2-image').pop()!.props.accessibilityLabel).toBe(`Rysunek ruchu: Prostowanie ramion na wyciągu. Na rysunku: ${joinCues(['tpd.move', 'tpd.elbows'].map(errorText))}`);
    await render(<ExerciseFigureV2 exercise={lib('Power Clean')} name="Zarzut" />); await flush();
    expect(screen.getAllByTestId('exercise-figure-v2-image').pop()!.props.accessibilityLabel).toBe(`Rysunek ruchu: Zarzut. Na rysunku: ${joinCues(['oly.close', 'oly.legs'].map(errorText))}`);
    applyLang('en'); await render(<ExerciseFigureV2 exercise={lib('Power Clean')} name="Power clean" />); await flush();
    expect((screen.getAllByTestId('exercise-figure-v2-image').pop()!.props.accessibilityLabel as string).startsWith('Movement drawing: Power clean. On the drawing: ')).toBe(true);
  });
});

describe('regresja: pozostałe rodziny bez zmian', () => {
  test('elementy rodzin bench_press, squat, hinge, curl, pull_up nie zostały dotknięte (liczba elementów w rejestrze) i rejestr ma dokładnie 17 rodzin (forearm, core_hang, carry — partia 5, 10.11.2026, tests/figures-v2-nakladka-forearm.test.tsx, tests/figures-v2-nakladka-core-hang.test.tsx, tests/figures-v2-nakladka-carry.test.tsx; pulldown, shrug, hip_abd_add, leg_machine — partia 3, 09.11.2026; delt_raise dodana 09.11.2026; hip_bridge i cable_row dopisane 09.11.2026, tests/figures-v2-nakladka-hip-bridge.test.tsx, tests/figures-v2-nakladka-cable-row.test.tsx)', () => {
    expect(Object.keys(TECHNIQUE).sort()).toEqual(['bench_press', 'cable_row', 'carry', 'core_hang', 'curl', 'delt_raise', 'forearm', 'hinge', 'hip_abd_add', 'hip_bridge', 'leg_machine', 'olympic', 'pull_up', 'pulldown', 'shrug', 'squat', 'triceps']);
    expect(['bench_press', 'squat', 'hinge', 'curl', 'pull_up'].map(f => TECHNIQUE[f].length)).toEqual([3, 1, 1, 2, 3]); /* pull_up 2 → 3 od 09.11.2026: prowadnica prostej ręki pullArmStraightRef (docs/18 09.11.2026, tests/figures-v2-pull-up-lokiec.test.tsx) */
  });
});
