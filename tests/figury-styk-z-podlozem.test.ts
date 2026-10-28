/*
 * R17 styk z podłożem (docs/53, recenzja n6, 27.10.2026) i poprawki obu błędów z n6:
 * - Cocoons: ciało lewitowało do 6,7 cm nad podłogą (zwijanie zrobione przez uniesienie całego ciała); reguła nic_nie_wisi działała tylko przy cesze „leżenie”, więc nie złapała błędu;
 * - Decline Push Up: podwyższenie pod stopami obniżono z 14 do 10 cm, żeby poprawić kąt przedramienia, i ćwiczenie straciło cechę rozpoznawczą (dane aplikacji: stopy na ławce albo skrzyni).
 * Zapis błędnych póz: tests/fixtures/figury-n6-bledne.json (nie edytować). Test brak-fałszywych-alarmów obejmuje wszystkie pozy w lib/figures/v2/poses/*.json.
 */
import * as path from 'path';
import { execFileSync } from 'child_process';
import * as fs from 'fs';

jest.setTimeout(180000);
const ROOT = path.join(__dirname, '..');
const run = (code: string) => JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', code], { cwd: ROOT, env: { PATH: process.env.PATH ?? '' } as unknown as NodeJS.ProcessEnv, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));

const KOD = `
import fs from 'node:fs';
import { waliduj } from ${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-validate.mjs'))};
import * as J from ${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-jakosc.mjs'))};
import { v2 } from ${JSON.stringify(path.join(ROOT, 'scripts/figures/agent-pozy/model.mjs'))};
const eng = typeof v2 === 'function' ? v2() : v2;
const fx = JSON.parse(fs.readFileSync(${JSON.stringify(path.join(ROOT, 'tests/fixtures/figury-n6-bledne.json'))}, 'utf8'));
const n6 = {};
for (const { rodzina, cwiczenie, poza } of fx.poze) { const w = waliduj(poza, { rodzina, cwiczenie }); n6[cwiczenie] = { ok: w.ok, kody: [...new Set(w.bledy.map((b) => b.kod + ':' + ((b.szczegol.match(/^(?:jakosc: )?([a-z_]+):/) ?? [])[1] ?? '')))], r17: J.stykZPodlozem(eng, poza).length }; }
const dane = {}; const r17dane = {};
for (const f of fs.readdirSync(${JSON.stringify(path.join(ROOT, 'lib/figures/v2/poses'))})) { const r = f.replace('.json', ''); const d = JSON.parse(fs.readFileSync(${JSON.stringify(path.join(ROOT, 'lib/figures/v2/poses')) } + '/' + f, 'utf8'));
  r17dane[r] = Object.entries(d.cwiczenia).filter(([, p]) => J.stykZPodlozem(eng, p).length).map(([c]) => c);
  if (r !== 'pull_up') dane[r] = Object.entries(d.cwiczenia).filter(([, p]) => !waliduj(p, { rodzina: r, cwiczenie: p.cwiczenie }).ok).map(([c]) => c); }
/* syntetyczne: zawis bez zadeklarowanego lotu, lot zadeklarowany, ciało na skrzyni */
const baza = JSON.parse(fs.readFileSync(${JSON.stringify(path.join(ROOT, 'lib/figures/v2/poses/core_floor.json'))}, 'utf8')).cwiczenia['Dead Bug'];
const coc = fx.poze[0].poza;
const lot = J.LOT; lot['Cocoons'] = 'test: lot zadeklarowany'; const zLotem = J.stykZPodlozem(eng, coc).length; delete lot['Cocoons'];
const uniesiona = JSON.parse(JSON.stringify(baza)); for (const k of uniesiona.klatki) k.miednica[1] += 12;
console.log(JSON.stringify({ n6, dane, r17dane, bazaOk: J.stykZPodlozem(eng, baza).length, uniesiona: J.stykZPodlozem(eng, uniesiona).length, zLotem }));
`;
const W = run(KOD) as { n6: Record<string, { ok: boolean; kody: string[]; r17: number }>; dane: Record<string, string[]>; r17dane: Record<string, string[]>; bazaOk: number; uniesiona: number; zLotem: number };

describe('R17 styk_z_podlozem: błąd Cocoons z recenzji n6', () => {
  test('poza Cocoons z n6 (ciało 6,7 cm nad podłogą) jest odrzucona regułą styk_z_podlozem', () => {
    expect(W.n6['Cocoons'].ok).toBe(false); expect(W.n6['Cocoons'].kody).toContain('jakosc:styk_z_podlozem'); expect(W.n6['Cocoons'].r17).toBeGreaterThan(0);
  });
  test('reguła działa bez warunku cechy: ćwiczenie spoza „leżenia” z ciałem uniesionym o 12 cm też jest odrzucone, poza leżąca przechodzi', () => {
    expect(W.bazaOk).toBe(0); expect(W.uniesiona).toBeGreaterThan(0);
  });
  test('zadeklarowany lot (LOT) wyłącza regułę', () => { expect(W.zLotem).toBe(0); });
  test.each(['core_floor', 'pushup_plank', 'pull_up'])('brak fałszywych alarmów: żadna poza rodziny %s w danych nie łamie R17 (zwis na drążku i dłonie na gryfie z talerzami to podłoże)', (r) => { expect(W.r17dane[r]).toEqual([]); });
  test.each(['core_floor', 'pushup_plank'])('wszystkie pozy rodziny %s przechodzą pełny walidator', (r) => { expect(W.dane[r]).toEqual([]); });
});

describe('Decline Push Up: podwyższenie pod stopami (P3: zmiana sprzętu = zmiana ćwiczenia)', () => {
  const sprzet = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/zrodla/figury-sprzet.json'), 'utf8'));
  const ls = (f: string) => JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/figures/v2/poses', f), 'utf8')).cwiczenia;
  const top = (p: { sprzet: { rodzaj: string; top?: number }[] }) => p.sprzet.find((g) => g.rodzaj === 'skrzynia')?.top ?? 0;
  test('poza z n6 miała skrzynię 10 cm, niższą niż typowa ławka z danych sprzętu', () => {
    const fx = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests/fixtures/figury-n6-bledne.json'), 'utf8'));
    expect(top(fx.poze[1].poza)).toBe(10); expect(top(fx.poze[1].poza)).toBeLessThan(sprzet.lawka_regulowana.seatTop);
  });
  test('poza w danych ma stopy na podwyższeniu o wysokości typowej ławki (figury-sprzet.json → lawka_regulowana.seatTop), a pompka z podłogi nie ma żadnego', () => {
    const p = ls('pushup_plank.json');
    expect(top(p['Decline Push Up'])).toBe(sprzet.lawka_regulowana.seatTop); expect(top(p['Push Up'])).toBe(0);
  });
  test('w górze ruchu ciało nie wznosi się ku głowie jak w zwykłej pompce (cecha decline: barki niżej niż stopy lub na tym samym poziomie)', () => {
    const wys = JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', `
      import fs from 'node:fs';
      import { v2 } from ${JSON.stringify(path.join(ROOT, 'scripts/figures/agent-pozy/model.mjs'))};
      const eng = typeof v2 === 'function' ? v2() : v2;
      const d = JSON.parse(fs.readFileSync(${JSON.stringify(path.join(ROOT, 'lib/figures/v2/poses/pushup_plank.json'))}, 'utf8')).cwiczenia;
      const r = (c) => { const s = eng.keyframeFrame(d[c], 0).sk; return { bark: s.shoulderC[1], kostka: s.legs.R.ankle[1] }; };
      console.log(JSON.stringify({ decline: r('Decline Push Up'), zwykla: r('Push Up') }));`], { cwd: ROOT, env: { PATH: process.env.PATH ?? '' } as unknown as NodeJS.ProcessEnv, encoding: 'utf8' }));
    expect(wys.decline.bark - wys.decline.kostka).toBeLessThanOrEqual(5); expect(wys.zwykla.bark - wys.zwykla.kostka).toBeGreaterThan(30);
  });
  test('manifest nazywa wysokość uproszczeniem (nie zgaduje liczby): wpis PRZYBLIZENIA dla Decline Push Up wskazuje źródło wysokości i brak źródła w repo', () => {
    const src = fs.readFileSync(path.join(ROOT, 'scripts/figures/agent-pozy/pushup_plank.mjs'), 'utf8');
    expect(src).toMatch(/'Decline Push Up': `uproszczenie: [^`]*lawka_regulowana\.seatTop[^`]*źródła w repo nie podają/);
  });
});

describe('P3: krok listy kontrolnej podglądu', () => {
  test('manifest podglądu zgłasza zmianę sprzętu (Decline: skrzynia 10 → 43 cm) w polu zmiany_sprzetu i ma listę kontrolną P3', () => {
    const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'p3-'));
    const fx = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests/fixtures/figury-n6-bledne.json'), 'utf8'));
    const przed = path.join(tmp, 'przed.json'); fs.writeFileSync(przed, JSON.stringify({ cwiczenia: { 'Decline Push Up': fx.poze[1].poza } }));
    execFileSync(process.execPath, [path.join(ROOT, 'scripts/figures/agent-pozy/run.mjs'), '--rodzina', 'pushup_plank', '--wyjscie', path.join(tmp, 'out'), '--podglad', '--tylko', 'Decline Push Up', '--przed', przed], { cwd: ROOT, env: { PATH: process.env.PATH ?? '' } as unknown as NodeJS.ProcessEnv, encoding: 'utf8' });
    const m = JSON.parse(fs.readFileSync(path.join(tmp, 'out/pushup_plank/manifest.json'), 'utf8'));
    expect(m.zmiany_sprzetu).toHaveLength(1);
    const z = m.zmiany_sprzetu[0]; expect(z.cwiczenie).toBe('Decline Push Up');
    expect(z.sprzet_przed.find((g: { rodzaj: string }) => g.rodzaj === 'skrzynia').top).toBe(10); expect(z.sprzet_po.find((g: { rodzaj: string }) => g.rodzaj === 'skrzynia').top).toBe(43);
    expect(z.cecha_rozpoznawcza_przed_i_po).toMatch(/DO UZUPEŁNIENIA/); expect(m.lista_kontrolna[0]).toMatch(/^P3:.*cechy rozpoznawczej przed i po/);
    fs.rmSync(tmp, { recursive: true, force: true });
  });
  test('model pracy (docs/53) opisuje krok P3: zmiana sprzętu jest zmianą ćwiczenia', () => {
    expect(fs.readFileSync(path.join(ROOT, 'docs/53-grafiki-model-pracy.md'), 'utf8')).toMatch(/P3[^\n]*zmiana sprzętu/i);
  });
});
