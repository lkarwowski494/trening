/*
 * fix4 R2 (recenzja niezależna różnicy elementów 04.11.2026, decyzja koordynatora 04.11.2026): skrót recenzji rodziny v2 obejmuje WYNIK doboru po kartach
 * (guidesOf, techniquesOf, errorsOf każdego ćwiczenia rodziny; scripts/skrot-v2-dobor.mjs). Powód: scalenie spójności karta–rysunek zmieniło rysunek w 38 ćwiczeniach,
 * a skróty bench_press, hinge i squat zostały równe wpisom „wyswietlana” (cue-sets.json i lib/cues/data.json są poza skrótem) — zmiana przeszła bramkę 4 bez sygnału.
 * Rodzaje: logika (dobór = funkcje aplikacji), niezmienniki (zmiana doboru → inny skrót; zdanie karty bez wpływu → ten sam), parytet strony, L-080 (gałąź z wcześniejszymi zmianami względem main).
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: test porównuje dobór z funkcjami aplikacji */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { execFileSync } from 'child_process';
import { CATALOG } from '@/lib/catalog.generated';
import { figureSpec } from '@/lib/figures/v2';
import { guidesOf, techniquesOf, errorsOf, cueIdsOf } from '@/lib/figures/v2/ui';

const root = path.join(__dirname, '..');
const RT = path.join(root, 'scripts/zrodla-runtime.mjs'), DOB = path.join(root, 'scripts/skrot-v2-dobor.mjs'), STRONA = path.join(root, 'scripts/strona/recenzja-figur.mjs');
const node = (kod: string, env: Record<string, string> = {}) => JSON.parse(execFileSync('node', ['--input-type=module', '-e', kod], { encoding: 'utf8', env: { ...process.env, ...env }, maxBuffer: 1 << 26 }));
const FAM5 = ['squat', 'bench_press', 'hinge', 'curl', 'pull_up'];
const SETS = 'lib/figures/v2/cue-sets.json';

describe('dobór po kartach = funkcje aplikacji (guidesOf, techniquesOf, errorsOf)', () => {
  test('dla każdego ćwiczenia z widoczną kartą w rodzinach squat, bench_press, hinge, curl, pull_up: dobór surowy = wynik funkcji ekranu; surowe id = cueIdsOf', () => {
    const d: Record<string, Record<string, { guides: string[]; techniques: string[]; errors: [string, string][] }>> = node(`import { doborPoKluczach } from ${JSON.stringify(DOB)}; const o = {}; for (const f of ${JSON.stringify(FAM5)}) o[f] = doborPoKluczach(f); process.stdout.write(JSON.stringify(o));`);
    let n = 0;
    for (const f of FAM5) for (const [k, x] of Object.entries(d[f])) {
      if (!cueIdsOf(k).ids.length) continue; n++; const spec = figureSpec(k)!;
      expect([k, x.guides]).toEqual([k, guidesOf(k)]); expect([k, x.techniques]).toEqual([k, techniquesOf(k)]); expect([k, x.errors]).toEqual([k, errorsOf(spec).map(e => [e.error, e.cue])]);
    }
    expect(n).toBeGreaterThan(80);
    expect(Object.keys(CATALOG).length).toBeGreaterThan(n);
  });
  test('surowe id: karta własna ma pierwszeństwo, zestaw ogólny tylko b = general; ćwiczenie bez wskazówek → puste', () => {
    const r = node(`import { wskazowkiSurowe } from ${JSON.stringify(DOB)}; process.stdout.write(JSON.stringify([wskazowkiSurowe('Back Squat'), wskazowkiSurowe('Nie ma takiego')]));`);
    expect(r[1]).toEqual({ ids: [], errs: [] }); expect(r[0].ids.length).toBeGreaterThan(0); expect(r[0].ids).toEqual(expect.arrayContaining(r[0].errs));
  });
});

describe('skrót rodziny reaguje na zmianę doboru, nie na zmianę brzmienia', () => {
  test('zestaw dodaje linię (sq.depth → thighParallel) → skrót squat inny; wskazówka bez wpływu na rysunek i zdanie karty (pl.json) → skrót bez zmian; inne rodziny bez zmian', () => {
    const r = node(`import { rodzinaSkrot } from ${JSON.stringify(RT)}; import { doborPoKluczach } from ${JSON.stringify(DOB)}; import { readFileSync } from 'node:fs'; import { join } from 'node:path';
      const real = p => readFileSync(join(${JSON.stringify(root)}, p), 'utf8'); const zm = f => p => p === ${JSON.stringify(SETS)} ? JSON.stringify(f(JSON.parse(real(p)))) : real(p);
      const base = doborPoKluczach('squat'); const sets0 = JSON.parse(real(${JSON.stringify(SETS)}));
      const kand = Object.keys(base).find(k => sets0.items[k]?.b === 'general' && !(sets0.items[k].ok ?? []).includes('sq.depth') && !(sets0.items[k].err ?? []).includes('sq.depth') && !base[k].guides.includes('thighParallel'));
      const dodaj = id => zm(s => { (s.items[kand].ok ??= []).push(id); return s; });
      const o = { kand, baza: rodzinaSkrot('squat'), linia: rodzinaSkrot('squat', dodaj('sq.depth')), bezWplywu: rodzinaSkrot('squat', dodaj('zz.nie.ma.takiej')), zdanie: rodzinaSkrot('squat', p => p === 'lib/cues/text/pl.json' ? '{}' : real(p)),
        innaBaza: rodzinaSkrot('hinge'), innaLinia: rodzinaSkrot('hinge', dodaj('sq.depth')), liniaDobor: doborPoKluczach('squat', dodaj('sq.depth').bind(null))[kand]?.guides };
      process.stdout.write(JSON.stringify(o));`);
    expect(r.kand).toBeTruthy(); expect(r.linia).not.toBe(r.baza); expect(r.bezWplywu).toBe(r.baza); expect(r.zdanie).toBe(r.baza); expect(r.innaLinia).toBe(r.innaBaza); /* ćwiczenie z squat nie należy do rodziny hinge */
    expect(r.liniaDobor).toContain('thighParallel');
  });
  test('parytet strony: skrót rodziny w eksporcie strony = skrót aplikacji (z doborem) dla gotowych rodzin', () => {
    const r = node(`import { rodzinaSkrot } from ${JSON.stringify(RT)}; import { skrotRodziny } from ${JSON.stringify(STRONA)}; process.stdout.write(JSON.stringify(${JSON.stringify(FAM5)}.map(f => [f, rodzinaSkrot(f), skrotRodziny(f)])));`);
    for (const [f, a, s] of r) expect([f, s]).toEqual([f, a]);
  });
});

describe('L-080 (04.11.2026): gałąź z wcześniejszymi zmianami względem main — zmiana doboru na gałęzi zmienia skrót, dokument i wskazówka bez wpływu nie', () => {
  const git = (cwd: string, ...a: string[]) => execFileSync('git', ['-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { cwd, encoding: 'utf8' }).trim();
  test('main → commit 1 (zestaw dodaje sq.depth) → commit 2 (dokument) → commit 3 (wskazówka bez wpływu)', () => {
    const lista: string[] = node(`import * as w from ${JSON.stringify(path.join(root, 'scripts/skrot-v2-wynik.mjs'))}; import * as d from ${JSON.stringify(DOB)}; process.stdout.write(JSON.stringify([...w.V2_RENDER, 'lib/figures/v2/rigs/squat.ts', ...d.DANE_DOBORU]));`);
    const kand: string = node(`import { doborPoKluczach } from ${JSON.stringify(DOB)}; import { readFileSync } from 'node:fs'; const s = JSON.parse(readFileSync(${JSON.stringify(path.join(root, SETS))}, 'utf8')); const b = doborPoKluczach('squat');
      process.stdout.write(JSON.stringify(Object.keys(b).find(k => s.items[k]?.b === 'general' && ![...(s.items[k].ok ?? []), ...(s.items[k].err ?? [])].includes('sq.depth') && !b[k].guides.includes('thighParallel'))));`);
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'skrot-dobor-'));
    try {
      for (const p of lista) { fs.mkdirSync(path.dirname(path.join(tmp, p)), { recursive: true }); fs.copyFileSync(path.join(root, p), path.join(tmp, p)); }
      git(tmp, 'init', '-q', '-b', 'main'); git(tmp, 'add', '-A'); git(tmp, 'commit', '-qm', 'main'); const main = git(tmp, 'rev-parse', 'HEAD');
      git(tmp, 'checkout', '-qb', 'galaz');
      const edytuj = (id: string) => { const f = path.join(tmp, SETS); const s = JSON.parse(fs.readFileSync(f, 'utf8')); (s.items[kand].ok ??= []).push(id); fs.writeFileSync(f, JSON.stringify(s, null, 2) + '\n'); };
      edytuj('sq.depth'); git(tmp, 'commit', '-qam', 'zestaw: linia'); const c1 = git(tmp, 'rev-parse', 'HEAD');
      fs.writeFileSync(path.join(tmp, 'dokument.md'), 'notatka\n'); git(tmp, 'add', '-A'); git(tmp, 'commit', '-qm', 'dokument'); const c2 = git(tmp, 'rev-parse', 'HEAD');
      edytuj('zz.nie.ma.takiej'); git(tmp, 'commit', '-qam', 'zestaw: bez wpływu'); const c3 = git(tmp, 'rev-parse', 'HEAD');
      const r = node(`import { rodzinaSkrot } from ${JSON.stringify(RT)}; import { execFileSync } from 'node:child_process';
        const dla = ref => rodzinaSkrot('squat', p => execFileSync('git', ['show', ref + ':' + p], { cwd: ${JSON.stringify(tmp)}, encoding: 'utf8', maxBuffer: 1 << 26 }));
        process.stdout.write(JSON.stringify(Object.fromEntries(JSON.parse(process.env.REFS).map(([n, ref]) => [n, dla(ref)]))));`, { REFS: JSON.stringify([['main', main], ['c1', c1], ['c2', c2], ['c3', c3]]) });
      expect(r.c1).not.toBe(r.main); expect(r.c2).toBe(r.c1); expect(r.c3).toBe(r.c1);
    } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  });
});
