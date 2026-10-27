/*
 * Figury v2 — kontrakt danych rodziny (docs/50, rozdz. 10; pilotaż zewnętrznego generatora na rodzinie pull_up). Rodzaje (docs/20): dane (schemat, przykład z gotowej rodziny),
 * niezmienniki (walidator geometrii: kości, zasięg, podłoga, przenikanie, chwyt, zakres stawów, ciągłość), błędy jako delty (deklarowane stawy, widoczność, początek ruchu),
 * komunikaty konkretne (generator ma z nich poprawić dane), interfejs biblioteki scripts/figures/v2-validate.mjs (schematPozy, opisKontraktu, waliduj, przyklad, zastosuj) i CLI.
 */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { execFileSync, spawnSync } from 'child_process';
import { FIG_DATA } from '@/lib/figures';
import {
  CONTRACT, MARKS, AFFECTS, GEAR, TEMPLATES, templateFor, knownFamily, poseSchema, checkSchema, poseAt, deltaAt, applyDelta, toPoseIn, propsFrom, keyframeFrame, validatePose, describeContract,
  NEUTRAL_ANKLE_DEG, neutralFootPitch, solveSkeleton, jointAngles, soleY, keyFrameOf, deltaOf, exampleFor, dataShapes, figureSpec, frameAt, checkFrame, SIDES, FAMILIES,
  type PoseData, type KeyFrame, type DeltaFrame, type DataError, type Gear, type ContractIssue, type ValidateCtx, type FamilyTemplate, type LegData, type ArmData, type RomData, type Affects,
} from '@/lib/figures/v2';

const root = path.resolve(__dirname, '..');
const ROM = FIG_DATA.rom as unknown as RomData;
const CUES = ['pu.partial', 'pu.noSwing'];
const ctx = (over: Partial<ValidateCtx> = {}): ValidateCtx => ({ family: 'pull_up', exercise: 'Pull Up', errorCues: CUES, rom: ROM, ...over });
const kf = (u: number, px: number, py: number, ay: number, ax: number, hp: number, gz = 25): KeyFrame => ({
  u, miednica: [px, py, 0], pochylenieTulowia: 0, pochylenieGlowy: hp,
  nogi: { R: { kostka: [ax, ay, 9] }, L: { kostka: [ax, ay, -9] } }, rece: { R: { chwyt: [0, 230, gz] }, L: { chwyt: [0, 230, -gz] } },
});
const bar: Gear = { rodzaj: 'sztanga', x: 0, y: 230, talerze: false, podazaZaChwytem: false, dlugosc: 128 };
const gearOk: Gear[] = [{ rodzaj: 'podloga', x0: -120, x1: 120 }, { rodzaj: 'slupek', x: 0, h: 235 }, bar];
/** Podciąganie: zwis na prostych rękach (u = 0) → górna pozycja, ciało za drążkiem (u = 1). */
const pullUp = (over: Partial<PoseData> = {}): PoseData => ({
  kontrakt: CONTRACT.id, rodzina: 'pull_up', cwiczenie: 'Pull Up', sprzet: gearOk,
  klatki: [kf(0, 0, 116, 33, 0, 0), kf(0.5, -6, 135, 52, -4, -5), kf(1, -12, 155, 72, -8, -10)], bledy: [], ...over,
});
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));
const codes = (is: ContractIssue[]): string[] => [...new Set(is.map(i => i.kod))];
const texts = (is: ContractIssue[]): string => is.map(i => i.szczegol).join(' | ');
/** Bujanie: miednica odjeżdża w przód, kostki za nią (nogi wahają się), chwyt na drążku bez zmian. */
const swing = (affects: Affects[], dx = 22): DataError => ({ cue: 'pu.noSwing', znacznik: 'pelvis', dotyczy: affects, klatki: [{ u: 0 }, { u: 0.5, miednica: [dx, 0, 0], nogi: { R: { kostka: [dx * 1.3, 0, 0] }, L: { kostka: [dx * 1.3, 0, 0] } } }, { u: 1 }] });

describe('schemat JSON (docs/schemas/figury-v2-poza.schema.json)', () => {
  test('poseSchema: obiekt z polami kontrakt, rodzina, cwiczenie, sprzet, klatki, bledy; bez $ref i oneOf (structured output); stałe w CONTRACT', () => {
    const s = poseSchema('pull_up') as { properties: Record<string, unknown>; required: string[] }; expect(Object.keys(s.properties)).toEqual(['kontrakt', 'rodzina', 'cwiczenie', 'petla', 'lustroRece', 'sprzet', 'klatki', 'bledy']); /* petla i lustroRece: pola opcjonalne trybu cyklicznego (27.10.2026) */ expect(s.required.length).toBe(6);
    const json = JSON.stringify(s); expect(json).not.toMatch(/\$ref|oneOf|anyOf/); expect(json).toContain(CONTRACT.id);
    expect(CONTRACT.frames.min).toBe(2); expect(CONTRACT.errorsMax).toBe(3); expect(MARKS).toEqual(['knees', 'heels', 'back', 'pelvis', 'bar']); expect(GEAR.slice(0, 4)).toEqual(['sztanga', 'slupek', 'podloga', 'skrzynia']); /* pełna lista rodzajów: tests/figures-v2-gear.test.ts */ expect(AFFECTS.length).toBe(10);
  });
  test('plik schematu w repozytorium jest aktualny (node scripts/figures/v2-validate.mjs --schema --check; część check:figures-v2)', () => {
    const r = spawnSync('node', ['scripts/figures/v2-validate.mjs', '--schema', '--check'], { cwd: root, encoding: 'utf8' }); expect([r.status, r.stdout]).toEqual([0, expect.stringContaining('aktualny')]);
  });
  test('checkSchema: konkretne komunikaty ze ścieżką (brak pola, nieznane pole, zły typ, spoza zakresu, spoza listy)', () => {
    const bad = clone(pullUp()) as unknown as Record<string, any>; delete bad.sprzet; bad.nieznane = 1; bad.klatki[0].miednica = [0, 'x', 0]; bad.klatki[1].u = 2; bad.klatki[2].nogi.R.kostka = [0, 0]; bad.cwiczenie = 5;
    const is = checkSchema(bad, poseSchema('pull_up')); const t = texts(is);
    expect(t).toContain('brak wymaganego pola „sprzet”'); expect(t).toContain('nieznane pole „nieznane”'); expect(t).toContain('$.klatki[0].miednica[1]: oczekiwano liczby'); expect(t).toContain('$.klatki[1].u: 2 > maksimum 1'); expect(t).toContain('za mało elementów'); expect(t).toContain('$.cwiczenie: oczekiwano tekstu');
    expect(texts(checkSchema({ ...pullUp(), bledy: [{ cue: 'x', znacznik: 'nosek', dotyczy: ['knee'], klatki: [{ u: 0 }, { u: 1 }] }] }, poseSchema('pull_up')))).toContain('spoza listy');
  });
});

describe('interpreter klatek kluczowych', () => {
  test('poseAt: interpolacja liniowa i brzegi; deltaAt/applyDelta: delta dodawana do pozy; toPoseIn mapuje pola; propsFrom: sztanga podąża za chwytem', () => {
    const k = poseAt(pullUp().klatki, 0.25); expect(k.miednica).toEqual([-3, 125.5, 0]); expect(poseAt(pullUp().klatki, 5).miednica).toEqual([-12, 155, 0]); expect(poseAt(pullUp().klatki, -1).u).toBe(-1);
    const d = deltaAt([{ u: 0 }, { u: 1, miednica: [10, 0, 0], pochylenieTulowia: 20 }], 0.5); expect(d.miednica).toEqual([5, 0, 0]); expect(d.pochylenieTulowia).toBe(10);
    const a = applyDelta(k, { u: 0.25, miednica: [1, 2, 3], pochylenieTulowia: 4, zgiecieKregoslupa: 5, pochylenieGlowy: 6, nogi: { R: { kostka: [1, 1, 1], odchylenieKolana: -20 } }, rece: { L: { chwyt: [0, 1, 0] } } });
    expect(a.miednica).toEqual([-2, 127.5, 3]); expect(a.pochylenieTulowia).toBe(4); expect(a.zgiecieKregoslupa).toBe(5); expect(a.nogi.R.odchylenieKolana).toBe(0); expect(a.rece.L.chwyt[1]).toBe(231);
    const p = toPoseIn(k); expect(p.pelvis).toEqual(k.miednica); expect(p.trunkPitch).toBe(0); expect(p.legs.R.ankle).toEqual(k.nogi.R.kostka);
    const props = propsFrom([{ rodzaj: 'sztanga', podazaZaChwytem: true }, { rodzaj: 'slupek', x: 5, h: 100 }, { rodzaj: 'skrzynia', x0: 1, x1: 2, top: 30 }, { rodzaj: 'podloga' }], { R: [4, 10, 20], L: [6, 12, -20] });
    expect(props[0]).toMatchObject({ k: 'barbell', c: [5, 11, 0], plates: true }); expect(props.map(x => x.k)).toEqual(['barbell', 'post', 'box', 'floor']);
  });
  test('keyframeFrame zwraca Frame jak rigi: szkielet, rekwizyty, info.load; pose zachowana; dataShapes daje kształty w widokach z boku, z przodu i z góry', () => {
    const f = keyframeFrame(pullUp(), 0.5); expect(f.sk.pelvis).toEqual([-6, 135, 0]); expect(f.info.load).toEqual([0, 230, 0]); expect(f.pose?.pelvis).toEqual([-6, 135, 0]);
    for (const v of ['side', 'front', 'top'] as const) expect(dataShapes(pullUp(), 0.5, v).length).toBeGreaterThan(10);
  });
});

describe('przykład z gotowej rodziny (few-shot) i zgodność z rigiem', () => {
  const E = { kneesIn: 'sq.mis.kneesIn', heels: 'sq.mis.heels' } as const;
  test('exampleFor(Back Squat): 9 klatek, sprzęt z rigu, 2 błędy jako delty; przechodzi ten sam walidator co wynik generatora', () => {
    const d = exampleFor('Back Squat', E)!; expect(d.klatki.length).toBe(9); expect(d.bledy.map(b => b.cue)).toEqual(['sq.mis.kneesIn', 'sq.mis.heels']); expect(d.sprzet.map(g => g.rodzaj)).toEqual(['podloga', 'sztanga']);
    expect(validatePose(clone(d), ctx({ family: 'squat', exercise: 'Back Squat', errorCues: ['sq.mis.kneesIn', 'sq.mis.heels'] }))).toEqual([]);
    expect(JSON.stringify(d).length).toBeLessThan(8000); expect(exampleFor('Pull Up')).toBeNull();
  });
  test('klatka z danych w punktach kluczowych = klatka rigu (≤ 0,05 cm w stawach); delta błędu odtwarza pozę błędu rigu (≤ 0,5 cm)', () => {
    const d = exampleFor('Back Squat', E)!; const spec = figureSpec('Back Squat')!;
    for (const u of [0, 0.5, 1]) { const a = keyframeFrame(d, u), b = frameAt(spec, u); for (const s of SIDES) { expect(Math.hypot(...a.sk.legs[s].knee.map((x, i) => x - b.sk.legs[s].knee[i]))).toBeLessThan(0.05); expect(Math.hypot(...a.sk.arms[s].elbow.map((x, i) => x - b.sk.arms[s].elbow[i]))).toBeLessThan(0.05); } }
    for (const [j, id] of [[0, 'kneesIn'], [1, 'heels']] as const) for (const u of [0.5, 1]) { const a = keyframeFrame(d, u, j), b = frameAt(spec, u, id); for (const s of SIDES) expect(Math.hypot(...a.sk.legs[s].knee.map((x, i) => x - b.sk.legs[s].knee[i]))).toBeLessThan(0.5); expect(checkFrame(a)).toEqual([]); }
  });
  test('keyFrameOf i deltaOf: wartości domyślne jawne, delta tylko zmienionych pól', () => {
    const p = frameAt(figureSpec('Back Squat')!, 0.5).pose!; const k = keyFrameOf(p, 0.5); expect(k.zgiecieKregoslupa).toBe(0); expect(k.nogi.R.rotacjaStopy).toBeGreaterThan(0);
    const dd: DeltaFrame = deltaOf(p, frameAt(figureSpec('Back Squat')!, 0.5, 'kneesIn').pose!, 0.5); expect(dd.nogi?.R?.odchylenieKolana).toBeLessThan(0); expect(dd.rece).toBeUndefined(); expect(dd.zgiecieKregoslupa).toBeUndefined();
  });
});

describe('walidator: poza poprawna i komunikaty o błędach (konkretne, do poprawy przez generator)', () => {
  test('podciąganie (rodzina planowana pull_up): zwis → górna pozycja przechodzi (geometria, zakres, ciągłość, ruch)', () => { expect(validatePose(pullUp(), ctx())).toEqual([]); });
  test('dłoń poza drążkiem: komunikat z kodem „chwyt”, stroną, odległością i fazą', () => {
    const d = pullUp(); d.klatki[1].rece.R.chwyt = [0, 236, 25]; const is = validatePose(d, ctx());
    expect(codes(is)).toContain('chwyt'); const t = texts(is); expect(t).toMatch(/dłoń prawa wobec drążka\/sztangi: dłoń \d+\.\d+ cm od chwytu/); expect(t).toMatch(/w fazie u=\d\.\d\d/); expect(t).toContain('chwyt musi leżeć na osi sztangi');
  });
  test('przenikanie podłogi i zasięg: miednica pod podłogą → „floor”; chwyt poza zasięgiem ramienia → „reach” z liczbą cm', () => {
    const d = pullUp(); d.klatki[0].nogi.R.kostka = [0, -10, 9]; expect(texts(validatePose(d, ctx()))).toContain('poniżej podłogi');
    const e = pullUp(); e.klatki[0].miednica = [0, 60, 0]; e.klatki[0].nogi.R.kostka = [0, 33, 9]; e.klatki[0].nogi.L.kostka = [0, 33, -9]; expect(texts(validatePose(e, ctx()))).toMatch(/cel poza zasięgiem o \d+\.\d+ cm|bone/);
  });
  test('zakres stawów: łokieć zgięty ponad zakres → „zakres” z kątem, zakresem i fazą (wyjątki rodziny: bark nad głową dozwolony w pull_up, nie w innej rodzinie)', () => {
    const d = pullUp(); d.klatki[2].rece.R.chwyt = [0, 230, 25]; d.klatki[2].miednica = [-12, 215, 0]; d.klatki[2].nogi.R.kostka = [-8, 132, 9]; d.klatki[2].nogi.L.kostka = [-8, 132, -9];
    const is = validatePose(d, ctx()); expect(codes(is)).toContain('zakres'); expect(texts(is)).toMatch(/staw \w+ [RL] = [\d.-]+° poza zakresem ruchu \[/);
    expect(templateFor('pull_up').allow?.shElev).toBe(180); expect(templateFor('squat').allow).toBeUndefined();
    expect(codes(validatePose(pullUp({ rodzina: 'squat' }), ctx({ family: 'squat' })))).toContain('zakres'); /* bez wyjątku rodziny zwis przekracza średni zakres barku */
  });
  test('ciągłość: odwrócenie kierunku zgięcia łokcia między klatkami → skok o więcej niż limit', () => {
    const d = pullUp(); d.klatki[0].rece.R.biegunLokcia = [0, -1, 1]; d.klatki[1].rece.R.biegunLokcia = [0, 1, -1]; d.klatki[2].rece.R.biegunLokcia = [0, 1, -1];
    expect(codes(validatePose(d, ctx()))).toEqual(expect.arrayContaining(['ciaglosc'])); expect(texts(validatePose(d, ctx()))).toContain('dodaj klatki pośrednie');
  });
  test('ciągłość w ruchu dynamicznym (wersja 1.1): ctx.dynamic podnosi limit skoku do CONTRACT.maxJumpDynamic; bez flagi limit i komunikat bez zmian; zbyt duży skok (teleport) łapie też tryb dynamiczny', () => {
    expect(CONTRACT.maxJumpDynamic).toBeGreaterThan(CONTRACT.maxJump); expect(CONTRACT.maxJumpDynamic).toBeLessThanOrEqual(3 * CONTRACT.maxJump); /* lot, przechwyt i wymach: szybciej niż ruch zwykły, ale nie bez granicy */
    const d = pullUp(); d.klatki[1].miednica = [80, 135, 0]; /* szybszy niż limit zwykły (7,6 cm na 1/48), wolniejszy niż dynamiczny */
    expect(codes(validatePose(d, ctx()))).toContain('ciaglosc'); expect(texts(validatePose(d, ctx()))).toMatch(/limit 6 cm na 1\/48 ruchu/);
    expect(codes(validatePose(d, ctx({ dynamic: false })))).toContain('ciaglosc'); /* jawne false = domyślne */
    expect(codes(validatePose(d, ctx({ dynamic: true })))).not.toContain('ciaglosc');
    const e = pullUp(); e.klatki[1].u = 0.25; e.klatki[1].miednica = [250, 135, 0]; /* ≈ 21 cm na 1/48: teleport łapie też tryb dynamiczny */
    expect(texts(validatePose(e, ctx({ dynamic: true })))).toMatch(new RegExp(`limit ${CONTRACT.maxJumpDynamic} cm na 1/48 ruchu`));
  });
  test('ruch: identyczne klatki → „ruch”; u poza kolejnością i brak klatki 0 lub 1 → „klatki-u” z liczbami', () => {
    const d = pullUp(); d.klatki[2] = { ...clone(d.klatki[0]), u: 1 }; expect(codes(validatePose(d, ctx()))).toContain('ruch');
    const e = pullUp(); e.klatki[1].u = 0; expect(texts(validatePose(e, ctx()))).toContain('rosnące u'); const g = pullUp(); g.klatki[0].u = 0.1; g.klatki[2].u = 0.9; expect(texts(validatePose(g, ctx()))).toMatch(/pierwsza klatka ma u = 0.1.*ostatnia klatka ma u = 0.9/);
  });
  test('kontrakt: zła rodzina, zły kontrakt, inne ćwiczenie, nieznana rodzina walidatora', () => {
    expect(texts(validatePose({ ...pullUp(), rodzina: 'squat' }, ctx()))).toContain('rodzina „squat” zamiast „pull_up”'); expect(texts(validatePose({ ...pullUp(), cwiczenie: 'Chin Up' }, ctx()))).toContain('cwiczenie „Chin Up” zamiast „Pull Up”');
    expect(texts(validatePose({ ...pullUp(), kontrakt: 'inny' }, ctx()))).toContain('spoza listy'); expect(validatePose(pullUp(), ctx({ family: 'nie_ma' }))[0].kod).toBe('rodzina'); expect(knownFamily('pull_up')).toBe(true); expect(knownFamily('nie_ma')).toBe(false);
    expect(FAMILIES.find(f => f.id === 'pull_up')?.status).toBe('ready'); /* od 26.10.2026 rodzina z danymi (poses/pull_up.json) jest gotowa; rig ma tylko przysiad, wyciskanie, zawias */
  });
  test('sprzęt rodziny: drążek poza przedziałem, dwa drążki, drążek z talerzami lub ruchomy → „sprzet” z liczbami', () => {
    const hi = pullUp({ sprzet: [{ ...bar, y: 300 }] }); expect(texts(validatePose(hi, ctx()))).toContain('y = 300 cm poza przedziałem 200–260 cm');
    expect(texts(validatePose(pullUp({ sprzet: [bar, bar] }), ctx()))).toContain('oczekiwano dokładnie jednej sztangi (drążka), jest 2');
    expect(texts(validatePose(pullUp({ sprzet: [{ rodzaj: 'sztanga', x: 0, y: 230 }] }), ctx()))).toMatch(/talerze: false.*podazaZaChwytem: false|podazaZaChwytem: false/s);
    expect(texts(validatePose(pullUp({ sprzet: [{ rodzaj: 'sztanga', x: 80, y: 230, talerze: false, podazaZaChwytem: false }] }), ctx()))).toContain('x = 80 cm poza przedziałem −30…30 cm');
    const t: FamilyTemplate = TEMPLATES.pull_up; expect(t.defaultGear.length).toBe(3); expect(t.movement).toContain('zwis');
  });
  test('opisKontraktu: układ współrzędnych, wymiary szkieletu, zasady błędów i sprzętu rodziny', () => {
    const t = describeContract('pull_up'); for (const s of ['x = do przodu', 'udo 42', 'podudzie 41', 'Dłonie MUSZĄ leżeć na osi drążka', 'MODYFIKACJA pozy poprawnej', String(CONTRACT.undeclaredDeg)]) expect(t).toContain(s);
    expect(describeContract('squat')).toContain('Sprzęt wg rodzaju');
  });
});

describe('błędy jako delty (poza błędu = modyfikacja pozy poprawnej)', () => {
  const ALL: Affects[] = ['pelvis', 'hip', 'knee', 'ankle', 'shoulder', 'elbow', 'spine'];
  test('bujanie z deklarowanymi stawami przechodzi: bez przenikania, widoczne, początek = poza poprawna', () => {
    const d = pullUp({ bledy: [swing(ALL)] }); expect(validatePose(d, ctx())).toEqual([]);
    const f0 = keyframeFrame(d, 0, 0), g0 = keyframeFrame(d, 0); expect(f0.sk.pelvis).toEqual(g0.sk.pelvis); expect(keyframeFrame(d, 0.5, 0).sk.pelvis[0] - keyframeFrame(d, 0.5).sk.pelvis[0]).toBeGreaterThan(15);
  });
  test('kąt niedeklarowany w „dotyczy” → „blad-niedeklarowane” z nazwą kąta, wartością, fazą i podpowiedzią', () => {
    const is = validatePose(pullUp({ bledy: [swing(['pelvis'])] }), ctx()); expect(codes(is)).toContain('blad-niedeklarowane'); expect(texts(is)).toMatch(/kąt \w+ zmienia się o [\d.]+° w fazie u=[\d.]+, a „dotyczy” tego nie deklaruje \(dodaj [\w/]+ do „dotyczy”/);
  });
  test('nieznany błąd (cue spoza listy ćwiczenia) → „blad-cue” z dozwolonymi identyfikatorami; brak błędów na liście → bledy puste; duplikat', () => {
    const is = validatePose(pullUp({ bledy: [{ ...swing(ALL), cue: 'sq.mis.heels' }] }), ctx()); expect(texts(is)).toContain('dozwolone identyfikatory: pu.partial, pu.noSwing');
    expect(texts(validatePose(pullUp({ bledy: [swing(ALL)] }), ctx({ errorCues: [] })))).toContain('zostaw bledy puste'); expect(texts(validatePose(pullUp({ bledy: [swing(ALL), swing(ALL)] }), ctx()))).toContain('występuje dwa razy');
  });
  test('błąd niewidoczny (delta < 3 cm i < 8°) → „blad-niewidoczny”; niezerowa delta na starcie → „blad-start”; złe u → „blad-u”', () => {
    expect(codes(validatePose(pullUp({ bledy: [{ cue: 'pu.noSwing', znacznik: 'pelvis', dotyczy: ['pelvis'], klatki: [{ u: 0 }, { u: 0.5, miednica: [0.5, 0, 0] }, { u: 1 }] }] }), ctx()))).toContain('blad-niewidoczny');
    const st = swing(ALL); st.klatki[0] = { u: 0, miednica: [5, 0, 0] }; expect(texts(validatePose(pullUp({ bledy: [st] }), ctx()))).toContain('delta w pierwszej klatce musi być zerowa');
    const bu = swing(ALL); bu.klatki[2].u = 0.8; expect(texts(validatePose(pullUp({ bledy: [bu] }), ctx()))).toContain('ostatnia klatka błędu ma u = 0.8');
  });
  test('poza błędu nie przenika sprzętu: delta wpychająca miednicę w drążek/podłogę → komunikat geometrii z prefiksem błędu', () => {
    const e = swing(ALL); e.klatki[1] = { u: 0.5, miednica: [0, -60, 0], nogi: { R: { kostka: [0, -60, 0] }, L: { kostka: [0, -60, 0] } } };
    const is = validatePose(pullUp({ bledy: [e] }), ctx()); expect(is.some(i => i.kod === 'geometria' && i.szczegol.startsWith('bledy[0] „pu.noSwing”: '))).toBe(true);
  });
  test('typy kontraktu: nogi, ręce, klatka, błąd, sprzęt i zakres', () => {
    const l: LegData = { kostka: [0, 0, 0] }; const a: ArmData = { chwyt: [0, 0, 0] }; const k: KeyFrame = kf(0, 0, 0, 0, 0, 0); const r: RomData = ROM; expect([l.kostka.length, a.chwyt.length, k.u, r.side.hip.max > 0]).toEqual([3, 3, 0, true]);
  });
});

describe('biblioteka scripts/figures/v2-validate.mjs (interfejs pilotażu) i CLI', () => {
  /** Biblioteka .mjs w osobnym procesie Node (Jest nie ładuje dynamicznie modułów ESM): `body` dostaje `m` (moduł), `a` (argument JSON) i zwraca wynik JSON. */
  const lib = (body: string, arg: unknown = null): any => { const r = spawnSync('node', ['--input-type=module', '-e', `import * as m from './scripts/figures/v2-validate.mjs'; const a = JSON.parse(process.argv[1]); const out = await (async () => { ${body} })(); console.log(JSON.stringify(out));`, JSON.stringify(arg)], { cwd: root, encoding: 'utf8' }); if (r.status !== 0) throw new Error(r.stderr); return JSON.parse(r.stdout); };
  test('eksporty: schematPozy, opisKontraktu, waliduj, przyklad, zastosuj; waliduj zwraca { ok, bledy: [{ kod, szczegol }] } z komunikatami po polsku', () => {
    /* poza próbna jest ćwiczeniem BEZ reguł sensu („Hang Test” nie ma wpisu wariantu): ten test dotyczy interfejsu i geometrii; reguły sensu pull_up: tests/gemini-polecenia.test.ts */
    const bad = pullUp(); bad.klatki[1].rece.R.chwyt = [0, 236, 25];
    const r = lib(`return { fn: ['schematPozy', 'opisKontraktu', 'waliduj', 'przyklad', 'zastosuj', 'bledyCwiczenia', 'schematRepo'].map(f => typeof m[f]), klatki: !!m.schematPozy('pull_up').properties.klatki, opis: m.opisKontraktu('pull_up').includes('drążka'),
      ok: m.waliduj(a.ok, { rodzina: 'pull_up', cwiczenie: 'Hang Test' }), zle: m.waliduj(a.bad, { rodzina: 'pull_up', cwiczenie: 'Hang Test' }), own: m.bledyCwiczenia('Pull Up'), gen: m.bledyCwiczenia('Dead Hang'), open: m.bledyCwiczenia('Muscle Up') };`, { ok: pullUp({ cwiczenie: 'Hang Test' }), bad: { ...bad, cwiczenie: 'Hang Test' } });
    expect(r.fn).toEqual(Array(7).fill('function')); expect(r.klatki).toBe(true); expect(r.opis).toBe(true); expect(r.ok).toEqual({ ok: true, bledy: [] });
    expect(r.zle.ok).toBe(false); expect(r.zle.bledy[0]).toEqual({ kod: 'chwyt', szczegol: expect.stringContaining('dłoń prawa') }); expect(r.own).toContain('pu.partial'); expect(r.gen).toEqual(['pu.noSwing']); expect(r.open).toEqual([]);
  });
  test('przyklad: gotowa rodzina → [{ cwiczenie, poza }] przechodząca walidator; rodzina planowana → []', () => {
    const r = lib(`const out = {}; for (const f of ['squat', 'bench_press', 'hinge', 'pull_up']) { const p = m.przyklad(f); out[f] = p.map(x => ({ cwiczenie: x.cwiczenie, bledy: m.waliduj(x.poza, { rodzina: f, cwiczenie: x.cwiczenie }).bledy, nBledow: x.poza.bledy.length })); } return out;`);
    expect(r.squat).toEqual([{ cwiczenie: 'Back Squat', bledy: [], nBledow: 2 }]); expect(r.pull_up).toEqual([]); expect(r.bench_press).toEqual([]); /* wyciskanie ma własną sylwetkę (ANSUR II) i ławkę — kontrakt v1 nie ma wymiarów ani ławki */ expect(r.hinge.length).toBe(1); expect(r.hinge[0].bledy).toEqual([]);
  });
  test('zastosuj: zapisuje tylko poprawne pozy do lib/figures/v2/poses/<rodzina>.json (katalog tymczasowy), odrzucone zwraca z błędami; kolejne wywołanie scala', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'v2apply-'));
    for (const f of ['lib/figures/v2/cue-sets.json', 'lib/cues/data.json', 'lib/figures/data.json']) { fs.mkdirSync(path.dirname(path.join(tmp, f)), { recursive: true }); fs.copyFileSync(path.join(root, f), path.join(tmp, f)); }
    const bad = pullUp({ cwiczenie: 'Chin Up' }); bad.klatki[1].rece.R.chwyt = [0, 240, 25];
    const r = lib(`return m.zastosuj(a.tmp, { rodzina: 'pull_up', model: 'x', poze: { 'Pull Up': a.ok, 'Chin Up': a.bad } });`, { tmp, ok: pullUp(), bad });
    expect(r.zapisano).toEqual(['Pull Up']); expect(r.odrzucone.map((x: any) => x.cwiczenie)).toEqual(['Chin Up']); expect(r.plik).toBe('lib/figures/v2/poses/pull_up.json');
    expect(Object.keys(JSON.parse(fs.readFileSync(path.join(tmp, r.plik), 'utf8')).cwiczenia)).toEqual(['Pull Up']);
    const r2 = lib(`return m.zastosuj(a.tmp, { rodzina: 'pull_up', poze: { 'Chin Up': a.good } });`, { tmp, good: pullUp({ cwiczenie: 'Chin Up' }) }); expect(r2.zapisano).toEqual(['Chin Up']);
    expect(Object.keys(JSON.parse(fs.readFileSync(path.join(tmp, r.plik), 'utf8')).cwiczenia).sort()).toEqual(['Chin Up', 'Pull Up']); fs.rmSync(tmp, { recursive: true, force: true });
  });
  test('CLI: node scripts/figures/v2-validate.mjs <plik> — kod 0 dla poprawnej pozy, 1 z listą błędów dla niepoprawnej, 2 bez argumentu', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'v2cli-')); const okF = path.join(tmp, 'ok.json'), badF = path.join(tmp, 'bad.json'); fs.writeFileSync(okF, JSON.stringify(pullUp({ cwiczenie: 'Hang Test' })));
    const b = pullUp({ cwiczenie: 'Hang Test' }); b.klatki[1].rece.R.chwyt = [0, 236, 25]; fs.writeFileSync(badF, JSON.stringify(b));
    const run = (a: string[]) => spawnSync('node', ['scripts/figures/v2-validate.mjs', ...a], { cwd: root, encoding: 'utf8' });
    const o = run([okF]); expect([o.status, o.stdout]).toEqual([0, expect.stringContaining('OK  pull_up / Hang Test')]);
    const n = run([badF]); expect(n.status).toBe(1); expect(n.stdout).toContain('[chwyt]'); expect(run([]).status).toBe(2);
    expect(execFileSync('node', ['scripts/figures/v2-validate.mjs', '--schema'], { cwd: root, encoding: 'utf8' })).toContain('"title"'); fs.rmSync(tmp, { recursive: true, force: true });
  });
});

describe('stopa automatyczna (decyzja koordynatora 26.10.2026): brak podbicia → stopa neutralna względem goleni, nie głębiej niż podłoga', () => {
  const k = (ay: number, ax: number, podbicie?: number): KeyFrame => ({
    u: 0, miednica: [0, 8, 0], pochylenieTulowia: -90, pochylenieGlowy: -90,
    nogi: { R: { kostka: [ax, ay, 15], ...(podbicie === undefined ? {} : { podbicie }) }, L: { kostka: [ax, ay, -15], ...(podbicie === undefined ? {} : { podbicie }) } },
    rece: { R: { chwyt: [0, 0, 20] }, L: { chwyt: [0, 0, -20] } },
  });
  it('wisząca noga (ponad podłogą): kąt kostki = NEUTRAL_ANKLE_DEG względem goleni', () => {
    const p = toPoseIn(k(40, 50)); const j = jointAngles(solveSkeleton(p), 'R');
    expect(Math.abs(j.ankle - NEUTRAL_ANKLE_DEG)).toBeLessThan(4); /* ≈: kąt liczony w płaszczyźnie strzałkowej, goleń ma też składową boczną (rozstaw bioder, kolano na zewnątrz) */
  });
  it('stopa przy podłodze (kostka y = 7): pochylenie zmniejszone do płaskiego, podeszwa nie pod podłogą', () => {
    const sk = solveSkeleton(toPoseIn(k(7, 35))); expect(soleY(sk.legs.R)).toBeGreaterThan(-1e-3);
  });
  it('neutralFootPitch: goleń pionowa → stopa ≈ +5°; przy podłodze (kostka y = 7) nie schodzi poniżej podłogi', () => {
    expect(neutralFootPitch([0, 100, 0], 'R', { ankle: [0, 17.5, 9] })).toBeGreaterThan(NEUTRAL_ANKLE_DEG - 12); /* goleń prawie pionowa, ale z boczną składową (rozstaw bioder): pochylenie stopy blisko 5° */ expect(neutralFootPitch([0, 100, 0], 'R', { ankle: [0, 17.5, 9] })).toBeLessThan(NEUTRAL_ANKLE_DEG + 12);
    expect(neutralFootPitch([0, 8, 0], 'R', { ankle: [35, 7, 15] })).toBeGreaterThanOrEqual(0); expect(neutralFootPitch([0, 8, 0], 'R', { ankle: [35, 7, 15] })).toBeLessThanOrEqual(NEUTRAL_ANKLE_DEG + 40);
  });
  it('jawne podbicie ma pierwszeństwo (rodziny, w których stopa jest ruchem)', () => {
    expect(toPoseIn(k(40, 50, -60)).legs.R.footPitch).toBe(-60);
  });
  it('gotowe rodziny (rigi) nie korzystają z toPoseIn: ich figury bez zmian — pochylenie stopy domyślnie 0', () => {
    expect(solveSkeleton({ pelvis: [0, 90, 0], trunkPitch: 0, headPitch: 0, legs: { R: { ankle: [0, 7, 9] }, L: { ankle: [0, 7, -9] } }, arms: { R: { grip: [0, 60, 20] }, L: { grip: [0, 60, -20] } } } as any).legs.R.heel[1]).toBeCloseTo(0, 5);
  });
});
