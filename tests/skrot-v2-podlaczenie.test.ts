/*
 * Decyzja właściciela 1A (03.11.2026 ~22:00 PL; plan: docs/przekazanie/notatki/linia-1-1/plan-recenzji-rodzin-v2.md): skrót recenzji rodziny v2 (rodzinaSkrot, scripts/zrodla-runtime.mjs)
 * nie zmienia się od samego PODŁĄCZENIA innej rodziny — status rodziny (families.ts: `status`), wpis ładowania (poseData.ts: LOAD) i wpis prezentacji innej rodziny (DATA_UI) są
 * wyjęte ze skrótu (scripts/skrot-v2-norm.mjs). Wszystko, co zmienia rysunek (contract/scene/draw, dane póz, rigi, widoki i reszta tych dwóch plików), zostaje w skrócie.
 * Parytet z eksportem strony: tests/strona-eksport-recenzja.test.ts. Rodzaje (docs/20): logika (skrót), niezmienniki (podłączenie ≠ zmiana rysunku), macierz (plik × rodzina), regresja (zgodność wsteczna: tests/figures-v2-zgodnosc-wsteczna.test.ts),
 * proces (L-080: gałąź z wcześniejszymi zmianami względem main).
 */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { execFileSync } from 'child_process';

const root = path.join(__dirname, '..');
const RT = path.join(root, 'scripts/zrodla-runtime.mjs');
type Zmiana = { plik: string; z?: string; na?: string; dopisz?: string };
type Scenariusz = { rodzina: string; zmiany?: Zmiana[] };
/** Skróty rodzin dla scenariuszy: bieżące pliki repo z podmienionym tekstem (jedno uruchomienie węzła na wszystkie scenariusze). */
function skroty(sc: Scenariusz[]): string[] {
  const code = `import { rodzinaSkrot } from ${JSON.stringify(RT)}; import { readFileSync } from 'node:fs'; import { join } from 'node:path';
    const sc = JSON.parse(process.env.SC); const root = ${JSON.stringify(root)};
    process.stdout.write(JSON.stringify(sc.map(s => rodzinaSkrot(s.rodzina, p => { let t = readFileSync(join(root, p), 'utf8');
      for (const m of s.zmiany ?? []) if (p === m.plik) { if (m.z !== undefined) { if (!t.includes(m.z)) throw new Error('brak tekstu: ' + m.z); t = t.replace(m.z, () => m.na); } if (m.dopisz) t += m.dopisz; }
      return t; }))));`;
  return JSON.parse(execFileSync('node', ['--input-type=module', '-e', code], { encoding: 'utf8', env: { ...process.env, SC: JSON.stringify(sc) } }));
}
const FAM = ['squat', 'bench_press', 'hinge', 'pull_up', 'curl'];
const V2 = 'lib/figures/v2/';
const rozne = (a: string[], b: string[]) => a.map((x, i) => x !== b[i]);

/* 05.11.2026: przykład „innej rodziny” to chest_fly (planned, z plikiem póz); triceps jest już ready, więc jego zamiana nic by nie sprawdzała */
describe('1A: podłączenie innej rodziny nie zmienia skrótu recenzji (03.11.2026)', () => {
  const baza = skroty(FAM.map(rodzina => ({ rodzina })));
  const wszystkie = (zmiany: Zmiana[]) => skroty(FAM.map(rodzina => ({ rodzina, zmiany })));

  test('baza: pięć gotowych rodzin ma pięć różnych skrótów 12-znakowych', () => {
    expect(new Set(baza).size).toBe(FAM.length);
    for (const s of baza) expect(s).toMatch(/^[0-9a-f]{12}$/);
  });
  test('status innej rodziny planned → ready (families.ts) nie zmienia skrótu żadnej rodziny', () => {
    expect(wszystkie([{ plik: V2 + 'families.ts', z: "{ id: 'chest_fly', status: 'planned'", na: "{ id: 'chest_fly', status: 'ready'" }])).toEqual(baza);
  });
  test('status własnej rodziny też jest poza skrótem (planned ↔ ready to podłączenie, nie zmiana rysunku)', () => {
    expect(wszystkie([{ plik: V2 + 'families.ts', z: "{ id: 'curl', status: 'ready'", na: "{ id: 'curl', status: 'planned'" }])).toEqual(baza);
  });
  test('wpis ładowania LOAD innej rodziny (poseData.ts) nie zmienia skrótu', () => {
    expect(wszystkie([{ plik: V2 + 'poseData.ts', z: "  pull_up: () => require('./poses/pull_up.json'),\n", na: "  pull_up: () => require('./poses/pull_up.json'),\n  chest_fly: () => require('./poses/chest_fly.json'),\n" }])).toEqual(baza);
  });
  test('wpis prezentacji DATA_UI innej rodziny (dodany albo zmieniony) nie zmienia skrótu; własny wpis zmienia tylko skrót tej rodziny', () => {
    expect(wszystkie([{ plik: V2 + 'poseData.ts', z: "carry: { names: { first: 'Marsz'", na: "carry: { names: { first: 'Chód'" }])).toEqual(baza);
    expect(wszystkie([{ plik: V2 + 'poseData.ts', z: "export const DATA_UI: Record<string, DataUi> = {\n", na: "export const DATA_UI: Record<string, DataUi> = {\n  chest_fly: { names: { first: 'Rozpiętka', second: 'Powrót' }, lowerFirst: false, joints: ['shAbd'] },\n" }])).toEqual(baza);
    const wlasny = wszystkie([{ plik: V2 + 'poseData.ts', z: "pull_up: { names: { first: 'Podciąganie'", na: "pull_up: { names: { first: 'Podciągnięcie'" }]);
    expect(rozne(baza, wlasny)).toEqual(FAM.map(f => f === 'pull_up'));
  });
  test('pełny scenariusz podłączenia (status + LOAD + DATA_UI nowej rodziny) = skróty bez zmian', () => {
    expect(wszystkie([
      { plik: V2 + 'families.ts', z: "{ id: 'chest_fly', status: 'planned'", na: "{ id: 'chest_fly', status: 'ready'" },
      { plik: V2 + 'poseData.ts', z: "  pull_up: () => require('./poses/pull_up.json'),\n", na: "  pull_up: () => require('./poses/pull_up.json'),\n  chest_fly: () => require('./poses/chest_fly.json'),\n" },
      { plik: V2 + 'poseData.ts', z: "export const DATA_UI: Record<string, DataUi> = {\n", na: "export const DATA_UI: Record<string, DataUi> = {\n  chest_fly: { names: { first: 'Rozpiętka', second: 'Powrót' }, lowerFirst: false, joints: ['shAbd'] },\n" },
    ])).toEqual(baza);
  });
  test.each([
    ['contract.ts (kontrakt póz)', V2 + 'contract.ts'], ['scene.ts', V2 + 'scene.ts'], ['draw.ts', V2 + 'draw.ts'], ['rigs/common.ts', V2 + 'rigs/common.ts'], ['figure.ts', V2 + 'figure.ts'], ['poseInterp.ts (interpolacja póz)', V2 + 'poseInterp.ts'], ['dumbbellAxis.ts (oś hantla)', V2 + 'dumbbellAxis.ts'],
  ])('zmiana rysunku: %s zmienia skrót każdej rodziny', (_n, plik) => {
    expect(rozne(baza, wszystkie([{ plik, dopisz: '\n// zmiana' }]))).toEqual(FAM.map(() => true));
  });
  test('zmiana danych póz albo rigu zmienia skrót tylko tej rodziny', () => {
    expect(rozne(baza, skroty(FAM.map(rodzina => ({ rodzina, zmiany: [{ plik: V2 + 'poses/pull_up.json', dopisz: '\n' }] }))))).toEqual(FAM.map(f => f === 'pull_up'));
    expect(rozne(baza, skroty(FAM.map(rodzina => ({ rodzina, zmiany: [{ plik: V2 + 'rigs/squat.ts', dopisz: '\n// zmiana' }] }))))).toEqual(FAM.map(f => f === 'squat'));
  });
  test('reszta families.ts i poseData.ts zostaje w skrócie: widoki rodziny, etykieta, ISOMETRIC, komentarz — zmiana zmienia skrót każdej rodziny', () => {
    const zm: Zmiana[][] = [
      [{ plik: V2 + 'families.ts', z: "label: 'Przysiad obustronny', views: ['side', 'front']", na: "label: 'Przysiad obustronny', views: ['side']" }],
      [{ plik: V2 + 'families.ts', dopisz: '\n// zmiana' }],
      [{ plik: V2 + 'poseData.ts', z: "  'Dead Hang',\n", na: "  'Dead Hang', 'Inne',\n" }],
      [{ plik: V2 + 'poseData.ts', dopisz: '\n// zmiana' }],
    ];
    for (const z of zm) expect(rozne(baza, wszystkie(z))).toEqual(FAM.map(() => true));
  });
});

describe('1A, L-080: gałąź z wcześniejszymi zmianami względem main — podłączenie rodziny na gałęzi nie zmienia skrótu, zmiana rysunku zmienia', () => {
  const git = (cwd: string, ...a: string[]) => execFileSync('git', ['-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { cwd, encoding: 'utf8' });
  test('main → gałąź (commit 1: status + LOAD + DATA_UI; commit 2: dokument) → gałąź rysunku (commit 3: draw.ts)', () => {
    const kod = `import * as z from ${JSON.stringify(RT)}; import { DANE_DOBORU } from ${JSON.stringify(path.join(root, 'scripts/skrot-v2-dobor.mjs'))}; process.stdout.write(JSON.stringify([...z.V2_WSPOLNE, 'lib/figures/v2/poses/pull_up.json', ...DANE_DOBORU]));`; /* fix4 R2 (04.11.2026): skrót czyta też dane doboru po kartach */
    const pliki: string[] = JSON.parse(execFileSync('node', ['--input-type=module', '-e', kod], { encoding: 'utf8' }));
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'skrot-l080-'));
    try {
      for (const p of pliki) { fs.mkdirSync(path.dirname(path.join(tmp, p)), { recursive: true }); fs.copyFileSync(path.join(root, p), path.join(tmp, p)); }
      git(tmp, 'init', '-q', '-b', 'main'); git(tmp, 'add', '-A'); git(tmp, 'commit', '-qm', 'main');
      git(tmp, 'checkout', '-qb', 'galaz');
      const ed = (p: string, z: string, na: string) => { const f = path.join(tmp, p); const t = fs.readFileSync(f, 'utf8'); if (!t.includes(z)) throw new Error('brak ' + z); fs.writeFileSync(f, t.replace(z, () => na)); };
      ed(V2 + 'families.ts', "{ id: 'chest_fly', status: 'planned'", "{ id: 'chest_fly', status: 'ready'");
      ed(V2 + 'poseData.ts', "  pull_up: () => require('./poses/pull_up.json'),\n", "  pull_up: () => require('./poses/pull_up.json'),\n  chest_fly: () => require('./poses/chest_fly.json'),\n");
      ed(V2 + 'poseData.ts', "export const DATA_UI: Record<string, DataUi> = {\n", "export const DATA_UI: Record<string, DataUi> = {\n  chest_fly: { names: { first: 'Rozpiętka', second: 'Powrót' }, lowerFirst: false, joints: ['shAbd'] },\n");
      git(tmp, 'commit', '-qam', 'podlaczenie chest_fly');
      fs.writeFileSync(path.join(tmp, 'dokument.md'), 'notatka\n'); git(tmp, 'add', '-A'); git(tmp, 'commit', '-qm', 'dokument');
      git(tmp, 'checkout', '-qb', 'rysunek');
      fs.appendFileSync(path.join(tmp, V2 + 'draw.ts'), '\n// zmiana rysunku'); git(tmp, 'commit', '-qam', 'draw');
      const kod2 = `import { rodzinaSkrot } from ${JSON.stringify(RT)}; import { execFileSync } from 'node:child_process';
        const dla = ref => rodzinaSkrot('pull_up', p => { try { return execFileSync('git', ['show', ref + ':' + p], { cwd: ${JSON.stringify(tmp)}, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch { return ''; /* plik nakładki rodziny (overlay/pull_up.ts) jest dopiero na gałęzi etapu 2 — w kopii z main go nie ma */ } });
        process.stdout.write(JSON.stringify({ main: dla('main'), galaz: dla('galaz'), rysunek: dla('rysunek') }));`;
      const r = JSON.parse(execFileSync('node', ['--input-type=module', '-e', kod2], { encoding: 'utf8' })) as Record<string, string>;
      expect(r.galaz).toBe(r.main);
      expect(r.rysunek).not.toBe(r.main);
    } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  });
});
