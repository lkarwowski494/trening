/*
 * Decyzja właściciela 09.11.2026 (wariant A): skrót recenzji rodziny v2 liczy się z WYNIKU rysunku rodziny (scripts/skrot-v2-wynik.mjs), nie z tekstu wszystkich plików wspólnych.
 * Powód: zmiana jednego wariantu (RDL, variants.ts) albo jednego elementu nakładki (Pull-Up, overlay.ts) unieważniała skróty wszystkich 7 rodzin, aplikacja ukrywała wszystkie rysunki (fail-closed)
 * i potrzebne było zaświadczenie audytora dla rodzin, których rysunek się nie zmienił — dwa razy w ciągu jednego dnia (docs/18, lekcja w docs/40).
 * Rodzaje (docs/20): logika (skrót = funkcja wyniku), niezmienniki (zmiana rysunku ZAWSZE zmienia skrót — strażnik bramki 4, L-047; zmiana bez wpływu na rysunek nie zmienia), macierz (plik rysunku × rodzina),
 * dane (tabela pokrycia plików V2_POKRYCIE, ACG-002), proces (L-080: gałąź z wcześniejszymi zmianami względem main). Kod rysunku ładuje skrypt z drzewa, w którym leży — mutacje w KOPII drzewa (tests/helpers/skrot-v2-kopia.ts).
 * Zastępuje testy tekstu plików z tests/figury-recenzja.test.tsx (sha256 rigu + V2_WSPOLNE, R2-6, ACG-002, W1, N1): ich gwarancje są teraz zawarte w wyniku (dobór linii i elementów po kartach, nakładka, warianty).
 */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import { KORZEN, kopia, kolejka, podlaczenie, skroty, usunKopie, zastosuj, type Wynik, type Zmiana } from './helpers/skrot-v2-kopia';

const RODZINY = ['squat', 'bench_press', 'hinge', 'pull_up', 'curl', 'olympic', 'triceps'];
const SZYBKIE = ['pull_up', 'curl', 'olympic', 'triceps'];
const V2 = 'lib/figures/v2/';
const LIMIT = 900_000;
/** Mutacje kodu i danych: plik, rodzina z rysunkiem, który mutacja zmienia (numer w linii pliku zamieniony; wybrane mechanicznie, każda zmienia WYNIK rodziny w kopii drzewa). */
const MATRYCA: { plik: string; rodzina: string; z: string; na: string }[] = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/skrot-v2-mutacje.json'), 'utf8'));

type Scenariusz = { zmiany: Zmiana[]; rodziny: string[] };
const SCEN: Record<string, Scenariusz> = {
  /* (1) wariant jednej rodziny: RDL — ciężar na dole 45 → 44 cm (decyzja 09.11.2026, variants.ts RDL_DOL) */
  rdl: { rodziny: RODZINY, zmiany: [{ plik: V2 + 'variants.ts', z: 'const RDL_DOL: Partial<HingeParams> = { yEnd: 45 };', na: 'const RDL_DOL: Partial<HingeParams> = { yEnd: 44 };' }] },
  /* (2) element nakładki jednej rodziny: odsunięcie prowadnicy prostej ręki (Pull-Up, overlay.ts OVERLAY_ARM_REF.offset 8 → 7 cm) */
  element: { rodziny: RODZINY, zmiany: [{ plik: V2 + 'overlay.ts', z: 'OVERLAY_ARM_REF = { offset: 8,', na: 'OVERLAY_ARM_REF = { offset: 7,' }] },
  /* (3) kod wspólny zmieniający rysunek wszystkich: profil tułowia z boku (draw.ts TORSO_SIDE) */
  wspolny: { rodziny: RODZINY, zmiany: [{ plik: V2 + 'draw.ts', z: '[-8, -5.5, 3], [-3, -10.5, 7.5]', na: '[-8, -5.5, 4], [-3, -10.5, 7.5]' }] },
  /* (4) zmiana kosmetyczna plików wspólnych (komentarz na końcu każdego z nich) — rysunek bez zmian */
  kosmetyka: { rodziny: RODZINY, zmiany: ['draw', 'variants', 'overlay', 'overlayShapes', 'scene', 'skeleton', 'anim', 'poseData', 'families', 'errors', 'figure', 'contract', 'muscles', 'guides', 'contacts', 'badges', 'ui', 'rigs/common', 'overlay/common', 'overlay/hinge', 'overlay/squat'].map(p => ({ plik: `${V2}${p}.ts`, dopisz: '\n// zmiana kosmetyczna\n' })) },
  /* własny wpis prezentacji rodziny (DATA_UI): nazwa pierwszej fazy Pull-Up — część recenzowanego ekranu */
  dataui: { rodziny: RODZINY, zmiany: [{ plik: V2 + 'rodziny/pull_up.ts', z: "ui: { names: { first: 'Podciąganie'", na: "ui: { names: { first: 'Podciągnięcie'" }] },
  /* plik samej rodziny: pozy Pull-Up (spacja na końcu) i rig przysiadu (komentarz) — tekst pliku rodziny jest w skrócie tej rodziny */
  pliki: { rodziny: ['squat', 'pull_up', 'curl', 'olympic'], zmiany: [{ plik: V2 + 'poses/pull_up.json', dopisz: '\n' }, { plik: V2 + 'rigs/squat.ts', dopisz: '\n// zmiana' }] },
  /* dane i reguły, które tylko SPRAWDZAJĄ pozy (styki wymagane w pozie poprawnej, wyjątek zakresu barku nad głową) i niczego nie rysują — poza wynikiem, więc poza skrótem (V2_POKRYCIE) */
  walidacja: { rodziny: SZYBKIE, zmiany: [{ plik: V2 + 'styki.json', z: '"pull_up":{"wymagane":["handR","handL"]', na: '"pull_up":{"wymagane":["handR"]' }, { plik: V2 + 'overheadException.ts', z: 'aheadMax: 5, behindMax: 10', na: 'aheadMax: 6, behindMax: 10' }] },
  /* warstwa rysowania kształtów na ekran (render.ts, palette.ts): wspólna, unieważnia wszystkie, świadomie */
  render: { rodziny: SZYBKIE, zmiany: [{ plik: V2 + 'render.ts', dopisz: '\n// zmiana' }] },
  palette: { rodziny: SZYBKIE, zmiany: [{ plik: V2 + 'palette.ts', dopisz: '\n// zmiana' }] },
};

let baza: Wynik; const wyniki: Record<string, Wynik> = {}; const macierz: Wynik[] = [];
beforeAll(async () => {
  const zad: (() => Promise<unknown>)[] = [
    async () => { baza = await skroty(KORZEN, RODZINY); },
    ...Object.entries(SCEN).map(([id, s]) => async () => { wyniki[id] = await skroty(kopia(s.zmiany), s.rodziny); }),
    ...MATRYCA.map((m, i) => async () => { macierz[i] = await skroty(kopia([{ plik: m.plik, z: m.z, na: m.na }]), [m.rodzina]); }),
  ];
  await kolejka(zad, 3);
}, LIMIT);
afterAll(usunKopie);
const zmienione = (id: string): string[] => SCEN[id].rodziny.filter(f => wyniki[id][f].skrot !== baza[f].skrot);

describe('09.11.2026: skrót recenzji rodziny z wyniku rysunku — zmiana jednej rodziny nie dotyka pozostałych', () => {
  test('baza: siedem gotowych rodzin ma siedem różnych skrótów 12-znakowych; kopia drzewa bez zmian daje te same skróty', () => {
    expect(Object.keys(baza).sort()).toEqual([...RODZINY].sort());
    for (const f of RODZINY) expect(baza[f].skrot).toMatch(/^[0-9a-f]{12}$/);
    expect(new Set(RODZINY.map(f => baza[f].skrot)).size).toBe(RODZINY.length);
  });
  test('(1) zmiana wariantu jednej rodziny (RDL w variants.ts) zmienia skrót hinge i NIE zmienia skrótów pozostałych sześciu', () => {
    expect(zmienione('rdl')).toEqual(['hinge']);
  });
  test('(2) zmiana elementu nakładki jednej rodziny (prowadnica prostej ręki Pull-Up w overlay.ts) zmienia skrót pull_up i NIE zmienia pozostałych', () => {
    expect(zmienione('element')).toEqual(['pull_up']);
  });
  test('(3) zmiana kodu wspólnego, która zmienia rysunek wszystkich (profil tułowia w draw.ts), zmienia skróty wszystkich siedmiu rodzin', () => {
    expect(zmienione('wspolny').sort()).toEqual([...RODZINY].sort());
  });
  test('(4) zmiana kosmetyczna plików wspólnych (komentarz w plikach silnika) nie zmienia żadnego skrótu — rysunek bez zmian', () => {
    expect(zmienione('kosmetyka')).toEqual([]);
  });
  test('własny wpis prezentacji rodziny (nazwy faz Pull-Up w DATA_UI) zmienia skrót tylko tej rodziny', () => {
    expect(zmienione('dataui')).toEqual(['pull_up']);
  });
  test('tekst pliku samej rodziny (pozy Pull-Up, rig przysiadu) jest w skrócie tej rodziny i tylko jej', () => {
    expect(zmienione('pliki').sort()).toEqual(['pull_up', 'squat']);
  });
  test('warstwa rysowania kształtów na ekran (render.ts, palette.ts) jest wspólna: zmiana unieważnia skrót każdej rodziny (świadomie, nie ma wyniku „po renderze”)', () => {
    expect(zmienione('render').sort()).toEqual([...SZYBKIE].sort()); expect(zmienione('palette').sort()).toEqual([...SZYBKIE].sort());
  });
  test('dane i reguły tylko sprawdzające pozy (styki.json — styki wymagane; overheadException.ts — zakres barku nad głową) nie zmieniają skrótu: nic nie rysują', () => {
    expect(zmienione('walidacja')).toEqual([]);
  });
  test('zmiana skrótu rodziny to zmiana skrótu wyniku (nie samych plików): wynik rodziny, której rysunek się nie zmienił, jest równy bazie', () => {
    for (const f of RODZINY) if (f !== 'hinge') expect([f, wyniki.rdl[f].wynik]).toEqual([f, baza[f].wynik]);
    expect(wyniki.rdl.hinge.wynik).not.toBe(baza.hinge.wynik);
  });
});

describe('L-047 (09.11.2026): macierz plik rysunku × rodzina — zmiana, która zmienia rysunek rodziny, ZAWSZE zmienia jej skrót (strażnik bramki 4: bez fałszywie „bez zmian”)', () => {
  test('macierz zawiera plik z każdej warstwy rysunku (kształty, szkielet, scena, czas, dobór, nakładka, mięśnie, styki, znaczki, błędy, pozy, rig, wariant)', () => {
    const pliki = MATRYCA.map(m => m.plik.replace(V2, ''));
    for (const p of ['draw.ts', 'scene.ts', 'skeleton.ts', 'math.ts', 'anim.ts', 'errors.ts', 'figure.ts', 'overlayShapes.ts', 'overlay.ts', 'guides.ts', 'contacts.ts', 'badges.ts', 'muscles.ts', 'poseInterp.ts']) expect(pliki).toContain(p);
    expect(MATRYCA.length).toBeGreaterThanOrEqual(20);
  });
  test.each(MATRYCA.map((m, i) => [m.plik.replace(V2, '') + ' → ' + m.rodzina, i] as const))('%s: mutacja zmienia WYNIK i skrót rodziny', (_n, i) => {
    const m = MATRYCA[i]; const b = baza[m.rodzina]; const r = macierz[i][m.rodzina];
    expect([m.plik, r.wynik]).not.toEqual([m.plik, b.wynik]); expect([m.plik, r.skrot]).not.toEqual([m.plik, b.skrot]);
  });
});

/** Pliki z domknięcia importów rysunku (figure.ts i moduły v2 komponentu figury) i ich pokrycie: „wynik” (wykonywane przez skrót z wyniku — zmiana rysunku jest widoczna), „render” (tekst w skrócie każdej rodziny),
 * „rodzina” (plik jednej rodziny: tekst w jej skrócie), „poza” (powód: nie zmienia rysunku). Nowy plik w domknięciu bez wpisu = czerwony test (ACG-002: wcześniej lista V2_WSPOLNE). */
const POKRYCIE: Record<string, string> = {
  'anim.ts': 'wynik', 'badges.ts': 'wynik', 'colliders.ts': 'wynik', 'contacts.ts': 'wynik', 'contract.ts': 'wynik', 'draw.ts': 'wynik', 'dumbbellAxis.ts': 'wynik', 'errors.ts': 'wynik', 'families.ts': 'wynik', 'figure.ts': 'wynik',
  'gear.ts': 'wynik', 'guides.ts': 'wynik', 'math.ts': 'wynik', 'muscles.generated.ts': 'wynik', 'muscles.ts': 'wynik', 'overlay.ts': 'wynik', 'overlay/common.ts': 'wynik',
  'overlay/hinge.ts': 'wynik', 'overlay/squat.ts': 'wynik', 'poseData.ts': 'wynik', 'rodziny/index.ts': 'wynik', 'poseInterp.ts': 'wynik', 'reguly-cwiczen.json': 'wynik', 'rigs/common.ts': 'wynik', 'scene.ts': 'wynik', 'skeleton.ts': 'wynik',
  'ui.ts': 'wynik', 'variants.ts': 'wynik', 'overlayShapes.ts': 'wynik', 'grupy.json': 'wynik',
  'leverGuard.ts': 'wynik', /* decyzja „rysować dźwignię” dotyczy rodzin z DZWIGNIA_BEZ_GLOWY (leg_machine, dziś planowana): jej skutek wchodzi do wyniku, gdy rodzina zostanie podłączona */
  'render.ts': 'render', 'palette.ts': 'render',
  'styki.json': 'poza: styki wymagane w pozie poprawnej to reguła sensu sprawdzana testami (requiredContacts, docs/53) — nie rysuje; poświaty styków liczy contactShapes z klatki (scenariusz „walidacja”)',
  'overheadException.ts': 'poza: wyjątek zakresu barku nad głową działa tylko w validatePose (contract.ts:422) — sprawdza pozy, nie rysuje (scenariusz „walidacja”)',
  'cueSets.ts': 'poza: tekst wskazówek przypisany do ćwiczeń (zestawy) — nie zmienia rysunku; własny skrót recenzji zestawów (zestawSkrot)',
  'cue-sets.json': 'poza: dane zestawów wskazówek — nie zmieniają rysunku; własny skrót recenzji zestawów (zestawSkrot); WYBÓR linii i elementów po zestawie wchodzi do wyniku przez dobór (scripts/skrot-v2-dobor.mjs)',
};
describe('ACG-002 (audyt ćwiczeń 31.10.2026): każdy plik lib/figures/v2, z którego składa się rysunek, jest w skrócie rodziny — wynikiem, tekstem albo nazwanym wyjątkiem', () => {
  test('domknięcie importów figure.ts i komponentu figury: każdy plik (poza plikami jednej rodziny) ma wpis w tabeli pokrycia; wpisy bez pliku i wyjątki bez powodu odrzucone', () => {
    const V = 'lib/figures/v2/';
    const start = ['lib/figures/v2/figure.ts', ...[...fs.readFileSync(path.join(KORZEN, 'components/ExerciseFigureV2.tsx'), 'utf8').matchAll(/from '@\/(lib\/figures\/v2\/[\w./-]+)'/g)].map(m => m[1] + '.ts')];
    const znajdz = (od: string, spec: string) => { const b = path.posix.normalize(path.posix.join(path.posix.dirname(od), spec)); return [b, b + '.ts', b + '.tsx'].find(c => fs.existsSync(path.join(KORZEN, c)) && fs.statSync(path.join(KORZEN, c)).isFile()); };
    const domk = new Set<string>(); const kolejkaPlikow = [...start];
    while (kolejkaPlikow.length) {
      const f = kolejkaPlikow.pop()!; if (domk.has(f)) continue; domk.add(f); if (!/\.tsx?$/.test(f)) continue;
      for (const m of fs.readFileSync(path.join(KORZEN, f), 'utf8').matchAll(/(?:from|require\()\s*'(\.{1,2}\/[^']+)'/g)) { const c = znajdz(f, m[1]); if (c && c.startsWith(V)) kolejkaPlikow.push(c); }
    }
    const rodzinne = (f: string) => /^lib\/figures\/v2\/(rigs\/(squat|benchPress|hinge)\.ts|overlay\/(lunge|leg_isolation|bench_press|curl|pull_up|olympic|triceps|hip_bridge|cable_row|delt_raise|chest_fly|calf_raise|kb_ballistic|overhead_press|row|pulldown|shrug|hip_abd_add|leg_machine|dip|chest_press_machine|cable_press|back_extension|thruster|pushup_plank|mobility_floor|mobility_stand|forearm|carry|core_hang|rotator_cuff)\.ts|poses\/[\w-]+\.json)$/.test(f); /* plik jednej rodziny — jego tekst jest w skrócie tej rodziny (plikRodziny, plikNakladki) */
    const wpisRodziny = (f: string) => /^lib\/figures\/v2\/rodziny\/\w+\.ts$/.test(f) && !f.endsWith('/index.ts'); /* KO-022 (10.11.2026): plik rejestru jednej rodziny (load, DATA_UI, ONE_WAY_UI) — wykonywany przez skrót z wyniku (jak poseData.ts przed podziałem): „wynik” */
    const brak = [...domk].filter(f => !rodzinne(f) && !wpisRodziny(f) && !(f.slice(V.length) in POKRYCIE)).sort();
    expect(brak).toEqual([]);
    for (const [f, p] of Object.entries(POKRYCIE)) {
      expect([f, fs.existsSync(path.join(KORZEN, V + f))]).toEqual([f, true]);
      if (p.startsWith('poza')) expect([f, p.length > 40]).toEqual([f, true]); else expect(['wynik', 'render']).toContain(p);
    }
    for (const f of ['render.ts', 'palette.ts']) expect(POKRYCIE[f]).toBe('render');
  });
  test('wpisy „render” = warstwa rysowania z V2_RENDER; wpisy „rodzina” — pliki jednej rodziny (rig/pozy/nakładka) są w skrócie tej rodziny: zmiana ich tekstu zmienia skrót (scenariusz „pliki”)', () => {
    const r: { render: string[] } = JSON.parse(execFileSync('node', ['--input-type=module', '-e', `import { V2_RENDER } from ${JSON.stringify(path.join(KORZEN, 'scripts/skrot-v2-wynik.mjs'))}; process.stdout.write(JSON.stringify({ render: V2_RENDER }));`], { encoding: 'utf8' }));
    expect(r.render.map(p => p.replace(V2, '')).sort()).toEqual(Object.entries(POKRYCIE).filter(([, p]) => p === 'render').map(([f]) => f).sort());
  });
});

describe('L-080 (09.11.2026): gałąź z wcześniejszymi zmianami względem main — podłączenie rodziny i dokument nie zmieniają skrótu, zmiana rysunku jednej rodziny zmienia tylko jej skrót', () => {
  const git = (cwd: string, ...a: string[]) => execFileSync('git', ['-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { cwd, encoding: 'utf8' }).trim();
  test('main → commit 1 (status + LOAD + DATA_UI innej rodziny) → commit 2 (dokument) → commit 3 (prowadnica Pull-Up w overlay.ts)', async () => {
    const tmp = kopia();
    git(tmp, 'init', '-q', '-b', 'main'); git(tmp, 'add', '-A'); git(tmp, 'commit', '-qm', 'main'); const refs: Record<string, string> = { main: git(tmp, 'rev-parse', 'HEAD') };
    git(tmp, 'checkout', '-qb', 'galaz');
    zastosuj(tmp, [
      { plik: V2 + 'families.ts', z: "{ id: 'core_hang', status: 'planned'", na: "{ id: 'core_hang', status: 'ready'" },
      ...podlaczenie('core_hang', { load: true, ui: "{ names: { first: 'Rozpiętka', second: 'Powrót' }, lowerFirst: false, joints: ['shAbd'] }" }),
    ]);
    git(tmp, 'add', '-A'); git(tmp, 'commit', '-qm', 'podlaczenie core_hang'); /* KO-022: nowy plik rodziny — add -A */ refs.c1 = git(tmp, 'rev-parse', 'HEAD');
    fs.writeFileSync(path.join(tmp, 'dokument.md'), 'notatka\n'); git(tmp, 'add', '-A'); git(tmp, 'commit', '-qm', 'dokument'); refs.c2 = git(tmp, 'rev-parse', 'HEAD');
    zastosuj(tmp, SCEN.element.zmiany); git(tmp, 'commit', '-qam', 'prowadnica'); refs.c3 = git(tmp, 'rev-parse', 'HEAD');
    const r: Record<string, Wynik> = {};
    for (const n of ['main', 'c1', 'c2', 'c3']) { git(tmp, 'checkout', '-q', refs[n]); r[n] = await skroty(tmp, SZYBKIE); }
    for (const f of SZYBKIE) { expect([f, r.c1[f].skrot]).toEqual([f, r.main[f].skrot]); expect([f, r.c2[f].skrot]).toEqual([f, r.main[f].skrot]); }
    expect(SZYBKIE.filter(f => r.c3[f].skrot !== r.main[f].skrot)).toEqual(['pull_up']);
    expect(git(tmp, 'diff', '--stat', refs.main, refs.c3)).toMatch(/families\.ts[\s\S]*overlay\.ts/); /* gałąź niesie zmiany z kilku commitów względem main */
  }, LIMIT);
});
