/*
 * Figury v2 — nakładka techniki, fix4 R1 (recenzja niezależna różnicy elementów 04.11.2026, decyzja koordynatora 04.11.2026, wariant A′):
 * element nakładki jest rysowany tylko wtedy, gdy jego REGUŁA należy do reguł wariantu ćwiczenia (regulyDla(rodzina, ćwiczenie)) i ma pewność „ustalone”.
 * Dotąd samo „wskazówka elementu jest na karcie” wystarczało (Single Leg RDL: karta ma rdl.dbMove, ale wariant jednonóż ma regułę wyprostu tylko jako „analogia”).
 * Rodzaje (docs/20): logika (filtr techniquesFor), dane (reguly-cwiczen.json = regulyDla), niezmiennik na całym katalogu (strażnik), scenariusz (ćwiczenia jednonóż),
 * macierz (rodzina × wariant), regresja (W2 z rundy 2R: pullPlumbRef — lista `exercises` zostaje).
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: test sprawdza dobór elementów, nie recenzję rodziny */
import * as path from 'path';
import { execFileSync } from 'child_process';
import { CATALOG } from '@/lib/catalog.generated';
import { figureSpec } from '@/lib/figures/v2';
import { TECHNIQUE, techniquesFor } from '@/lib/figures/v2/overlay';
import { techniquesOf, cueIdsOf } from '@/lib/figures/v2/ui';
import { DELT_RAISE_TECHNIQUE } from '@/lib/figures/v2/overlay/delt_raise';
import REGULY from '@/lib/figures/v2/reguly-cwiczen.json';

const root = path.join(__dirname, '..');
const FAMS = Object.keys(TECHNIQUE);
const withSpec = (fam: string) => Object.keys(CATALOG).filter(k => { try { return figureSpec(k)?.family === fam; } catch { return false; } });
const KEYS: Record<string, string[]> = Object.fromEntries(FAMS.map(f => [f, withSpec(f)]));
/** Źródło prawdy strażnika: regulyDla (scripts/figures/v2-sens.mjs, pełne dane ze źródłami) + pewność reguły — liczone niezależnie od pliku runtime. */
const REF: Record<string, Record<string, { id: string; pewnosc: string }[]>> = JSON.parse(execFileSync('node', ['--input-type=module', '-e', `
  import { regulyDla } from ${JSON.stringify(path.join(root, 'scripts/figures/v2-sens.mjs'))};
  const keys = JSON.parse(process.env.KEYS); const out = {};
  for (const [f, ks] of Object.entries(keys)) { out[f] = {}; for (const k of ks) out[f][k] = regulyDla(f, k, ${JSON.stringify(root)}).map(r => ({ id: r.id, pewnosc: r.pewnosc ?? '' })); }
  process.stdout.write(JSON.stringify(out));`], { encoding: 'utf8', env: { ...process.env, KEYS: JSON.stringify(KEYS) }, maxBuffer: 1 << 26 }));
const ustalone = (fam: string, k: string) => REF[fam][k].filter(r => /^ustalone/.test(r.pewnosc)).map(r => r.id);
const WITH_EL = FAMS.flatMap(f => KEYS[f].filter(k => techniquesOf(k).length).map(k => [f, k] as const));

describe('R1 (fix4): element nakładki tylko z regułą wariantu o pewności „ustalone”', () => {
  test('strażnik na całym katalogu: każdy rysowany element ma regułę należącą do regulyDla(rodzina, ćwiczenie) z pewnością „ustalone” (niezależnie od pliku runtime)', () => {
    expect(WITH_EL.length).toBeGreaterThan(90); /* dziś ~101 ćwiczeń z elementem; spadek poniżej 90 = filtr za szeroki */
    for (const [f, k] of WITH_EL) for (const id of techniquesOf(k)) {
      const d = TECHNIQUE[f].find(x => x.id === id)!; expect([k, id, ustalone(f, k).includes(d.rule)]).toEqual([k, id, true]);
    }
  });
  test('scenariusz: Single Leg RDL (hantel) i (linki) — wariant jednonóż ma wyprost na górze tylko jako „analogia” → bez pionu, nawet gdy karta ma rdl.dbMove (techniquesFor); od 09.11.2026 (partia P1) karty własne slrdl.* bez rdl.dbMove — też bez pionu; RDL i Single Arm RDL zostają', () => {
    for (const k of ['Single Leg RDL (hantel)', 'Single Leg RDL (linki)']) { expect([k, cueIdsOf(k).ids.includes('rdl.dbMove'), techniquesFor('hinge', ['rdl.dbMove'], k).map(d => d.id)]).toEqual([k, false, []]); expect([k, techniquesOf(k)]).toEqual([k, []]); }
    for (const k of ['RDL (sztanga)', 'RDL (hantle/linki)', 'Single Arm RDL (hantel/linka)', 'Stiff-Legged Barbell Deadlift', 'Deadlift (sztanga)', 'Good Morning']) expect([k, techniquesOf(k)]).toEqual([k, ['hingeUprightRef']]);
  });
  test('macierz: różnica między „wskazówka na karcie” a „element rysowany” to Alternating Deltoid Raise (delt_raise, 09.11.2026; P1, 09.11.2026: karty Single Leg RDL ×2 bez rdl.dbMove — nie są już odcięte: reguły wariantu nie są „ustalone”) oraz Hip Abduction, Hip Adduction i Single Leg Press (partia 3, 09.11.2026) oraz Triceps Dips (ławka) (partia 4, 10.11.2026, ćwiczenie wstrzymane) — reszta bez zmian', () => {
    const odciete = FAMS.flatMap(f => KEYS[f].filter(k => TECHNIQUE[f].filter(d => (!d.exercises || d.exercises.includes(k)) && d.cue.some(c => cueIdsOf(k).ids.includes(c))).length > techniquesOf(k).length));
    expect(odciete.sort()).toEqual(['Alternating Deltoid Raise', 'Hip Abduction', 'Hip Adduction', 'Single Leg Press', 'Triceps Dips (ławka)']); /* partia 4 (10.11.2026): Triceps Dips (ławka) jest w V2_WSTRZYMANE (P4-DIP-1) — bez rysunku techniquesOf = [] (potwierdza tests/figures-v2-nakladka-dip.test.tsx:41), a karta własna nadal ma bdip.*, więc ćwiczenie liczy się jako „odcięte” z założenia, nie z błędu reguł; po powrocie ławki wpis wypada; partia 3 (09.11.2026): maszyny odwodzenia/przywodzenia — zestaw hipAbd ma hab.hips, a wariant ma tylko rozstaw_kolan (pion tułowia bez reguły); Single Leg Press — reguła zakres_jednonoz, element na zakres (recenzja leg_machine N-1, backlog) */
  });
  test('logika techniquesFor: z ćwiczeniem filtruje po regułach (reguly-cwiczen.json), bez ćwiczenia — tylko po wskazówkach (wywołanie na poziomie rodziny); ćwiczenie bez wpisu reguł → brak elementu', () => {
    expect(techniquesFor('hinge', ['rdl.dbMove'], 'Single Leg RDL (hantel)').map(d => d.id)).toEqual([]);
    expect(techniquesFor('hinge', ['rdl.dbMove'], 'RDL (hantle/linki)').map(d => d.id)).toEqual(['hingeUprightRef']);
    expect(techniquesFor('hinge', ['rdl.dbMove']).map(d => d.id)).toEqual(['hingeUprightRef']);
    expect(techniquesFor('hinge', ['rdl.dbMove'], 'Nie ma takiego ćwiczenia').map(d => d.id)).toEqual([]);
    expect(techniquesFor('squat', ['dl.lift'], 'Back Squat')).toEqual([]);
  });
  test('regresja W2 (runda 2R): pullPlumbRef nadal ograniczony listą `exercises` (Pull Up, Chin Up) — filtr reguły jej nie zastępuje ani nie rozszerza', () => {
    expect(withSpec('pull_up').filter(k => techniquesOf(k).includes('pullPlumbRef')).sort()).toEqual(['Chin Up', 'Pull Up']);
    expect(techniquesFor('pull_up', ['pu.noSwing']).map(d => d.id)).toEqual([]);
  });
});

describe('R1 (fix4): lib/figures/v2/reguly-cwiczen.json = reguły „ustalone” wariantu z figury-sens.json (generowane przez scripts/zrodla-runtime.mjs)', () => {
  test('rodziny z nakładką (overlay/<rodzina>.ts) mają wpis; każde ćwiczenie z figurą v2 ma listę równą regulyDla ∩ „ustalone” (w kolejności reguł)', () => {
    for (const f of FAMS) { expect([f, f in REGULY]).toEqual([f, true]); for (const k of KEYS[f]) expect([f, k, (REGULY as Record<string, Record<string, string[]>>)[f][k] ?? []]).toEqual([f, k, ustalone(f, k)]); }
  });
  test('plik nie zawiera nazw źródeł ani pewności (runtime bez źródeł, decyzja właściciela 25.10.2026): tylko id reguł', () => {
    const txt = JSON.stringify(REGULY); expect(txt).not.toMatch(/ExRx|NSCA|ACE|NASM|https?:/); expect(Object.values(REGULY).every(m => Object.values(m as Record<string, unknown>).every(l => Array.isArray(l) && l.every(x => typeof x === 'string')))).toBe(true);
  });
});

describe('delt_raise (09.11.2026, recenzja nakładki): łuk tylko w rzucie płaszczyzny ruchu', () => {
  const FRONT = ['Lateral Raise (hantle)', 'Cable Lateral Raise', 'One-Arm Lateral Raise (hantel)', 'Band Lateral Raise', 'Machine Lateral Raise', 'Cable Seated Lateral Raise', 'Dumbbell Scaption', 'Cable Y Raise'];
  const SIDE = ['Front Raise', 'Cable Front Raise', 'Front Plate Raise', 'Single Dumbbell Front Raise', 'Barbell Front Raise to Overhead', 'Dumbbell Front Raise to Overhead'];
  test('listy rozłączne; element czołowy tylko w rzucie front i tylko dla ćwiczeń z listy czołowej, boczny — side i lista boczna', () => {
    const d = (id: string) => TECHNIQUE.delt_raise.find(x => x.id === id)!;
    expect(d('deltArmElevationFront').views).toEqual(['front']); expect(d('deltArmElevationSide').views).toEqual(['side']);
    expect(d('deltArmElevationFront').exercises!.slice().sort()).toEqual(FRONT.slice().sort()); expect(d('deltArmElevationSide').exercises!.slice().sort()).toEqual(SIDE.slice().sort());
    expect(FRONT.filter(k => SIDE.includes(k))).toEqual([]);
  });
  test('rejestr: TECHNIQUE.delt_raise = DELT_RAISE_TECHNIQUE z trzema elementami w stałej kolejności (czołowy, boczny, poziom barku)', () => {
    expect(TECHNIQUE.delt_raise).toBe(DELT_RAISE_TECHNIQUE); expect(DELT_RAISE_TECHNIQUE.map(d => d.id)).toEqual(['deltArmElevationFront', 'deltArmElevationSide', 'deltShoulderLevelRef']);
  });
  test('dobór: ćwiczenie z listy czołowej nigdy nie dostaje elementu bocznego i odwrotnie; rysowane są te z kartą i regułą „ustalone” (po wpisach zestawów 09.11.2026 wszystkie z listy czołowej rysują element); reszta rodziny bez łuku', () => {
    const NIE_RYSUJE: string[] = []; /* 09.11.2026: Machine Lateral Raise i Cable Seated Lateral Raise mają łuk po wpisach zestawów (recenzja audytora) — wszystkie ćwiczenia z listy czołowej rysują element */
    for (const k of FRONT) { const t = techniquesOf(k); expect([k, t.includes('deltArmElevationSide'), t.includes('deltArmElevationFront')]).toEqual([k, false, !NIE_RYSUJE.includes(k)]); }
    for (const k of SIDE) { const t = techniquesOf(k); expect([k, t.includes('deltArmElevationFront'), t.includes('deltArmElevationSide')]).toEqual([k, false, true]); }
    for (const k of KEYS.delt_raise.filter(x => !FRONT.includes(x) && !SIDE.includes(x))) expect([k, techniquesOf(k).filter(i => i.startsWith('deltArmElevation'))]).toEqual([k, []]);
  });
});
