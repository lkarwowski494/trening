/*
 * Poprawki p2, runda 5 (recenzja niezależna 28.10.2026, bramka 4, krok 2: Leg Press „do poprawy”) — płyta platformy przechodziła przez staw skokowy,
 * podeszwa wystawała 7 cm za płytę (punkt mocowania prowadnicy = kostka). Ten sam błąd w Single Leg Press (przeoczony w r3 oceną „na oko”).
 *   1. Reguła sensu `stopa_na_platformie` (data/zrodla/figury-sens.json, scripts/figures/v2-sens.mjs): odstęp podeszwy (pięta, śródstopie, palce) od płaszczyzny płyty ∈ [−0,5; +1] cm w każdej klatce.
 *   2. Dane odróżniają zaczep „podeszwy” (platforma pod stopą, tylko prowadnica „prosta”) od „kostki” (wałek / poduszka przy kostce: Leg Extension, Leg Curl, Hip Abduction/Adduction…).
 *   3. Leg Press i Single Leg Press: reguła zielona; kąty stawów jak przed poprawką (zmienia się tylko położenie platformy).
 *   4. Przebieg reguły na WSZYSTKICH pozach paczki (krok 4 listy): jedyne pozy z prowadnicą mocowaną w kostce/podeszwie to suwnice i Seated Calf Raise (poduszka, nie platforma).
 */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import { propsFrom, gearFieldIssues, gearSetIssues, BODY, LEVER_POINT } from '@/lib/figures/v2';

jest.setTimeout(240000);
const ROOT = path.join(__dirname, '..');
const run = (code: string): any => JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', `import * as m from ${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-sens.mjs'))}; import { loadV2 } from ${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-build.mjs'))}; const os = await import('node:os'); const fs = await import('node:fs'); const dir = fs.mkdtempSync(os.tmpdir() + '/p2r5-'); process.on('exit', () => fs.rmSync(dir, { recursive: true, force: true })); const { v2 } = loadV2(dir); const POSES = ${JSON.stringify(path.join(ROOT, 'lib/figures/v2/poses'))}; const poze = (f) => JSON.parse(fs.readFileSync(POSES + '/' + f + '.json', 'utf8')).cwiczenia; const Q = { min_cm: -0.5, max_cm: 1 }; const ocen = (d) => m.naruszenia(v2, d, [{ id: 'stopa_na_platformie', typ: 'stopa_na_platformie', grupa: 'platforma', parametry: Q }]).flatMap((n) => n.opisy); ${code}`], { env: { PATH: process.env.PATH ?? '' } as unknown as NodeJS.ProcessEnv, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }));
const POSES = path.join(ROOT, 'lib/figures/v2/poses');
type Poza = { sprzet: { rodzaj: string; tryb?: string; punkt?: string; kat?: number; x?: number; y?: number }[] };
const wszystkie = fs.readdirSync(POSES).filter(f => f.endsWith('.json')).sort().flatMap(f => { const j = JSON.parse(fs.readFileSync(path.join(POSES, f), 'utf8')) as { rodzina: string; cwiczenia: Record<string, Poza> }; return Object.entries(j.cwiczenia).map(([cw, d]) => ({ rodzina: j.rodzina, cw, d })); });
const lever = (d: Poza) => d.sprzet.find(g => g.rodzaj === 'dzwignia');
const SENS = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/zrodla/figury-sens.json'), 'utf8'));

describe('1. reguła stopa_na_platformie: czerwona dla platformy przechodzącej przez kostkę, zielona dla platformy pod podeszwą', () => {
  const w = run(`
    const pl = poze('leg_machine'); const out = {};
    for (const cw of ['Leg Press', 'Single Leg Press']) {
      const d = pl[cw]; const stare = JSON.parse(JSON.stringify(d)); const g = stare.sprzet.find((x) => x.rodzaj === 'dzwignia'); const th = g.kat * Math.PI / 180;
      g.punkt = 'kostki'; g.x = Math.round((g.x - v2.BODY.ankleH * Math.cos(th)) * 10) / 10; g.y = Math.round((g.y - v2.BODY.ankleH * Math.sin(th)) * 10) / 10; /* kształt sprzed r5: prowadnica w kostce */
      out[cw] = { nowa: ocen(d), stara: ocen(stare) };
    }
    console.log(JSON.stringify(out));`);
  test.each(['Leg Press', 'Single Leg Press'])('%s: bieżąca poza bez naruszeń', cw => { expect(w[cw].nowa).toEqual([]); });
  test.each(['Leg Press', 'Single Leg Press'])('%s: kształt sprzed r5 (punkt „kostki”) łamie regułę z liczbą −7,0 cm (podeszwa za płytą)', cw => {
    expect(w[cw].stara.join('|')).toMatch(/odstęp -7\.0…-7\.0 cm, a ma być w -0\.5…1 cm/); expect(w[cw].stara.join('|')).toContain('stopa płasko NA platformie');
  });
});

describe('2. dane odróżniają zaczep „podeszwy” (platforma) od „kostki” (wałek); reguła przypisana tylko suwnicom z platformą', () => {
  test('LEVER_POINT ma „podeszwy”; „podeszwy” tylko z prowadnicą „prosta” (obrót odrzucony przez gearFieldIssues)', () => {
    expect(LEVER_POINT).toContain('podeszwy');
    expect(gearFieldIssues({ rodzaj: 'dzwignia', tryb: 'obrot', punkt: 'podeszwy', x: 0, y: 50, z: 0, dlugosc: 60 } as never).join('|')).toContain('„podeszwy”');
    expect(gearFieldIssues({ rodzaj: 'dzwignia', tryb: 'prosta', kat: -15, punkt: 'podeszwy', x: 0, y: 50, z: 0, dlugosc: 60 } as never)).toEqual([]);
    expect(gearSetIssues([])).toBeDefined();
  });
  test('rekwizyt prowadnicy: punkt „podeszwy” leży wysokość kostki dalej niż kostka wzdłuż prowadnicy, „kostki” — w kostce', () => {
    const ank = { R: [40, 20, 13] as [number, number, number], L: [40, 20, -13] as [number, number, number] };
    const mk = (punkt: string) => propsFrom([{ rodzaj: 'dzwignia', tryb: 'prosta', kat: -15, punkt, trzyma: 'R', x: 0, y: 0, z: 13, dlugosc: 90 } as never], { R: [0, 0, 0], L: [0, 0, 0] }, ank).find(p => p.k === 'slide') as { to: number[]; dir: number[] };
    const th = (-15 * Math.PI) / 180;
    expect(mk('kostki').to).toEqual([40, 20, 13]);
    const p = mk('podeszwy').to; expect(p[0]).toBeCloseTo(40 + BODY.ankleH * Math.cos(th), 6); expect(p[1]).toBeCloseTo(20 + BODY.ankleH * Math.sin(th), 6); expect(p[2]).toBe(13);
  });
  test('w paczce poz żadna prowadnica „prosta” mocowana w kostce nie jest platformą: suwnice (Leg Press, Single Leg Press) mają „podeszwy”, jedyna „prosta + kostki” to poduszka Seated Calf Raise', () => {
    const prosteKostki = wszystkie.filter(x => { const g = lever(x.d); return g?.tryb === 'prosta' && g.punkt === 'kostki'; }).map(x => x.cw);
    expect(prosteKostki).toEqual(['Seated Calf Raise']);
    expect(wszystkie.filter(x => lever(x.d)?.punkt === 'podeszwy').map(x => x.cw).sort()).toEqual(['Leg Press', 'Single Leg Press']);
  });
  test('wałek przy kostce (obrót, punkt „kostki”): Leg Extension, Leg Curl, Hip Abduction/Adduction i spółka nie mają reguły stopa_na_platformie', () => {
    const wal = wszystkie.filter(x => { const g = lever(x.d); return g?.tryb === 'obrot' && g.punkt === 'kostki'; });
    expect(wal.map(x => x.cw)).toEqual(expect.arrayContaining(['Leg Extension', 'Leg Curl', 'Lying Leg Curl', 'Hip Abduction', 'Hip Adduction', 'Machine Glute Kickback']));
    for (const x of wal) { const r = SENS.rodziny[x.rodzina]; const przyp = Object.entries(r.warianty ?? {}).filter(([cw]) => cw === x.cw).flatMap(([, ids]) => ids as string[]); expect([x.cw, przyp.includes('stopa_na_platformie')]).toEqual([x.cw, false]); }
  });
  test('każda poza z zaczepem „podeszwy” ma regułę stopa_na_platformie w wariantach (dane sensu), a wskazówki lp.setup i lp.heels ją wskazują', () => {
    const lm = SENS.rodziny.leg_machine; for (const cw of ['Leg Press', 'Single Leg Press', 'Smith Machine Leg Press']) expect([cw, lm.warianty[cw].includes('stopa_na_platformie')]).toEqual([cw, true]);
    expect(lm.wskazowki_na_reguly['lp.setup']).toContain('stopa_na_platformie'); expect(lm.wskazowki_na_reguly['lp.heels']).toContain('stopa_na_platformie');
    expect(lm.reguly.stopa_na_platformie.parametry).toEqual({ min_cm: -0.5, max_cm: 1 });
    expect(Object.keys(lm.otwarte_czesciowo).join('|')).toContain('lp.heels na suwnicy'); expect(JSON.stringify(lm.otwarte_czesciowo)).toContain('ZAMKNIĘTE p2-r5');
  });
});

describe('3. przebieg reguły na WSZYSTKICH pozach paczki (krok 4 listy kontrolnej) — pozy bez platformy pod stopą zwracają „brak platformy”, nie naruszenie', () => {
  const w = run(`
    const wyn = []; for (const f of fs.readdirSync(POSES)) { const j = JSON.parse(fs.readFileSync(POSES + '/' + f, 'utf8')); for (const [cw, d] of Object.entries(j.cwiczenia)) {
      const g = (d.sprzet ?? []).find((x) => x.rodzaj === 'dzwignia' && x.tryb === 'prosta' && (x.punkt === 'kostki' || x.punkt === 'podeszwy'));
      if (!g) continue; wyn.push({ rodzina: j.rodzina, cw, punkt: g.punkt, o: ocen(d) }); }
    } console.log(JSON.stringify(wyn));`) as { rodzina: string; cw: string; punkt: string; o: string[] }[];
  test('trafienia: tylko Seated Calf Raise (poduszka rysowana w kostce, nie platforma — poza zakresem reguły, backlog); suwnice zielone', () => {
    expect(w.filter(x => x.o.length).map(x => x.cw)).toEqual(['Seated Calf Raise']); expect(w.find(x => x.cw === 'Seated Calf Raise')!.o.join('|')).toMatch(/pięta R w u = 0\.00: 9\.1 cm od płyty/); /* strona dodatnia (stopa przed płytą) też łamie regułę */
    expect(w.filter(x => x.punkt === 'podeszwy').every(x => x.o.length === 0)).toBe(true);
    expect(w.filter(x => x.punkt === 'podeszwy').map(x => x.cw).sort()).toEqual(['Leg Press', 'Single Leg Press']);
  });
  test('poza bez prowadnicy w kostce/podeszwie: reguła zwraca komunikat „brak platformy” (nie jest po cichu zielona)', () => {
    const r = run(`const d = poze('leg_isolation')['Leg Extension']; console.log(JSON.stringify(ocen(d)));`) as string[];
    expect(r.join('|')).toContain('brak platformy pod stopami');
  });
});

describe('4. Leg Press i Single Leg Press: kąty stawów bez zmian (tabela kątów z podglądu r4), platforma pod podeszwą w KAŻDEJ klatce i obu rzędach', () => {
  const w = run(`
    const pl = poze('leg_machine'); const out = {};
    for (const cw of ['Leg Press', 'Single Leg Press']) { const d = pl[cw]; const ks = [];
      for (let i = 0; i <= 20; i++) { const u = i / 20; const f = v2.keyframeFrame(d, u); const sl = f.props.find((p) => p.k === 'slide'); const ja = v2.jointAngles(f.sk, 'R');
        const odl = ['heel', 'toe'].map((k) => (sl.to[0] - f.sk.legs.R[k][0]) * sl.dir[0] + (sl.to[1] - f.sk.legs.R[k][1]) * sl.dir[1]); ks.push({ u, odl, knee: ja.knee, hip: ja.hip, ankle: ja.ankle }); }
      out[cw] = ks; }
    console.log(JSON.stringify(out));`);
  test.each(['Leg Press', 'Single Leg Press'])('%s: pięta i palce 0 ± 0,5 cm od płyty, kolano 15,5…~95° bez przeprostu', cw => {
    const ks = w[cw] as { odl: number[]; knee: number }[]; for (const k of ks) for (const o of k.odl) { expect(o).toBeGreaterThanOrEqual(-0.5); expect(o).toBeLessThanOrEqual(1); }
    expect(Math.min(...ks.map(k => k.knee))).toBeGreaterThan(15); expect(Math.min(...ks.map(k => k.knee))).toBeLessThan(16);
  });
  test('tabela kątów Leg Press: biodro 85,0…124,2°, kolano 15,5…86,0°, kostka −6,4…24,7° (jak w podglądzie r4: platforma przesunięta, kąty nietknięte)', () => {
    const ks = w['Leg Press'] as { knee: number; hip: number; ankle: number }[]; const mm = (k: 'knee' | 'hip' | 'ankle') => [Math.min(...ks.map(x => x[k])), Math.max(...ks.map(x => x[k]))];
    expect(mm('knee')[0]).toBeCloseTo(15.5, 1); expect(mm('knee')[1]).toBeCloseTo(86.0, 1); expect(mm('hip')[0]).toBeCloseTo(85.0, 1); expect(mm('hip')[1]).toBeCloseTo(124.2, 1); expect(mm('ankle')[0]).toBeCloseTo(-6.4, 1); expect(mm('ankle')[1]).toBeCloseTo(24.7, 1);
  });
});
