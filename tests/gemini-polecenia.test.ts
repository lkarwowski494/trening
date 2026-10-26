/*
 * Ręczne generowanie póz figur v2 w aplikacji Gemini (26.10.2026, docs/52 pkt 7, docs/53): scripts/figures/gemini-polecenia.mjs (generator poleceń), gemini-pozy.mjs --z-pliku (import),
 * v2-sens.mjs + data/zrodla/figury-sens.json (reguły sensu ruchu), gemini-rejestr.mjs + data/figury-bledy-modelu.json (rejestr błędów modelu), paczka dla recenzenta ruchu.
 * Rodzaje (docs/20): logika (części, wyciąganie JSON), dane (liczby z silnika w poleceniu, reguły z danych), scenariusze importu (poprawna, z błędem, z otoczką, ucięta, nieznany klucz,
 * brak JSON, przegląd), niezmienniki (zgodność polecenie ↔ walidator, każda poza w danych przechodzi walidator, tryb „tylko raport” niczego nie zapisuje), macierz (każda rodzina ma polecenie).
 * Atrapa Gemini: odpowiedzi budowane z póz WYLICZONYCH Z MODELU (wzorzecPodciagania), które przechodzą walidator geometrii i sensu.
 */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { execFileSync } from 'child_process';

jest.setTimeout(240000);
const ROOT = path.join(__dirname, '..');
const POL = path.join(ROOT, 'scripts/figures/gemini-polecenia.mjs');
const POZY = path.join(ROOT, 'scripts/figures/gemini-pozy.mjs');
const REJ = path.join(ROOT, 'scripts/figures/gemini-rejestr.mjs');
const SENS = path.join(ROOT, 'scripts/figures/v2-sens.mjs');
const VAL = path.join(ROOT, 'scripts/figures/v2-validate.mjs');
const run = (script: string, code: string) => JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', `import * as m from ${JSON.stringify(script)}; ${code}`], { env: { PATH: process.env.PATH ?? '' } as unknown as NodeJS.ProcessEnv, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));

/** Korzeń tymczasowy: dane wejściowe skopiowane (docs/51 z rodziną pull_up zawężoną do dwóch ćwiczeń), skrypty przez dowiązanie; zapis póz i rejestru trafia tylko tutaj. */
function tmpRoot(): string {
  const r = fs.mkdtempSync(path.join(os.tmpdir(), 'polecenia-'));
  for (const f of ['docs/51-figury-v2-pokrycie.md', 'lib/figures/data.json', 'lib/figures/v2/cue-sets.json', 'lib/cues/data.json', 'lib/cues/text/pl.json', 'data/zrodla/figury-sens.json']) { fs.mkdirSync(path.dirname(path.join(r, f)), { recursive: true }); fs.copyFileSync(path.join(ROOT, f), path.join(r, f)); }
  const dp = path.join(r, 'docs/51-figury-v2-pokrycie.md'); fs.writeFileSync(dp, fs.readFileSync(dp, 'utf8').replace(/(### pull_up \(\d+\) — do zrobienia\n\n)[^\n]*/, '$1Chin Up; Pull Up'));
  fs.mkdirSync(path.join(r, 'scripts'), { recursive: true }); fs.symlinkSync(path.join(ROOT, 'scripts/figures'), path.join(r, 'scripts/figures'));
  return r;
}
/** Pozy wyliczone z modelu (przechodzą geometrię i sens), jako odpowiedź „modelu”. */
const WZ = run(POL, `const o = {}; for (const [cw, c] of [['Chin Up', 15], ['Pull Up', 22]]) o[cw] = m.wzorzecPodciagania(230, c, { cwiczenie: cw }).poza; console.log(JSON.stringify(o));`) as Record<string, any>;
const importuj = (root: string, plik: string, extra: string[] = []) => run(POZY, `const log = []; const c = await m.main(${JSON.stringify(['--z-pliku', plik, '--wyjscie', path.join(root, 'wyj'), ...extra])}, {}, { root: ${JSON.stringify(root)}, log: (s) => log.push(s) }); console.log(JSON.stringify({ c, log }));`) as { c: number; log: string[] };
const zapisane = (root: string) => { const p = path.join(root, 'lib/figures/v2/poses/pull_up.json'); return fs.existsSync(p) ? Object.keys(JSON.parse(fs.readFileSync(p, 'utf8')).cwiczenia).sort() : []; };
const wyj = (root: string, f: string) => fs.readFileSync(path.join(root, 'wyj', f), 'utf8');
const plik = (root: string, nazwa: string, tresc: string) => { const p = path.join(root, nazwa); fs.writeFileSync(p, tresc); return p; };
const odp = (poze: Record<string, unknown>, extra: Record<string, unknown> = {}) => JSON.stringify({ polecenie: 'polecenie@2', rodzina: 'pull_up', ...extra, poze });
const waliduj = (poza: unknown, cw: string) => run(VAL, `console.log(JSON.stringify(m.waliduj(${JSON.stringify(poza)}, { rodzina: 'pull_up', cwiczenie: ${JSON.stringify(cw)} })))`) as { ok: boolean; bledy: { kod: string; szczegol: string }[] };
const klon = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

describe('pozy w danych (lib/figures/v2/poses): każda przechodzi walidator geometrii i sensu', () => {
  test('każdy plik poses/<rodzina>.json: kontrakt, rodzina zgodna z plikiem, każda poza przechodzi waliduj() (w tym reguły sensu); pull_up ma Gironda Sternum Chins', () => {
    const dir = path.join(ROOT, 'lib/figures/v2/poses'); const pliki = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
    expect(pliki).toContain('pull_up.json');
    for (const f of pliki) {
      const d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); expect(d.kontrakt).toBe('figury-v2/poza@1'); expect(f).toBe(`${d.rodzina}.json`);
      const w = run(VAL, `const r = Object.entries(${JSON.stringify(d.cwiczenia)}).map(([c, p]) => [c, m.waliduj(p, { rodzina: ${JSON.stringify(d.rodzina)}, cwiczenie: c }).ok]); console.log(JSON.stringify(r));`) as [string, boolean][];
      for (const [c, ok] of w) expect([f, c, ok]).toEqual([f, c, true]);
    }
    expect(Object.keys(JSON.parse(fs.readFileSync(path.join(dir, 'pull_up.json'), 'utf8')).cwiczenia)).toContain('Gironda Sternum Chins');
  });
});

describe('reguły sensu ruchu (data/zrodla/figury-sens.json + v2-sens.mjs; docs/53, bramka 3)', () => {
  const dane = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/zrodla/figury-sens.json'), 'utf8')).rodziny.pull_up;
  const cues = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/zrodla/cues.json'), 'utf8'));
  test('dane: każda reguła ma typ z ewaluatorem, grupę, liczbę oznaczoną (uproszczenie/konwencja) i wskazówkę, która istnieje w cues.json (albo jest konwencją z nazwy); warianty i grupy błędów spójne', () => {
    const typy = run(SENS, 'console.log(JSON.stringify(Object.keys(m.EWALUATORY)))') as string[];
    const cueIds = new Set(Object.values(cues.exercises as Record<string, Record<string, { c: string }[]>>).flatMap((x) => Object.values(x).flat().map((r) => r.c)));
    for (const [id, r] of Object.entries(dane.reguly) as [string, any][]) {
      expect([id, typy.includes(r.typ)]).toEqual([id, true]); expect(r.grupa).toBeTruthy(); expect(r.liczba).toMatch(/uproszczenie|konwencja/); expect(r.zrodlo.length).toBeGreaterThan(20);
      if (r.cue) expect([id, r.cue, cueIds.has(r.cue)]).toEqual([id, r.cue, true]); else expect(r.zrodlo).toMatch(/konwencja/);
    }
    const grupy = new Set(Object.values(dane.reguly).map((r: any) => r.grupa));
    for (const g of Object.values(dane.grupy_bledow)) expect(grupy.has(g as string)).toBe(true);
    for (const [cw, w] of Object.entries(dane.warianty) as [string, string | string[]][]) { if (cw.startsWith('_')) continue; for (const id of typeof w === 'string' ? dane.warianty[w] : w) expect([cw, id in dane.reguly]).toEqual([cw, true]); }
    expect(Object.keys(dane.pomin)).toEqual(['Rope Climb']);
  });
  test('wzorzec wyliczony z modelu (z błędem pu.partial) przechodzi walidator geometrii i sensu; tabela referencyjna zgodna z wzorcem', () => {
    expect(waliduj(WZ['Pull Up'], 'Pull Up')).toEqual({ ok: true, bledy: [] });
    const t = run(POL, 'console.log(JSON.stringify(m.tabelaPodciagania()))') as string[]; expect(t).toHaveLength(3); expect(t[1]).toContain('drążek y = 230, chwyt z = ±22: u = 0 → miednica.y = 119.2');
  });
  test('poza poprawna łamiąca regułę jest odrzucana z konkretnym komunikatem: broda pod drążkiem, bujanie miednicy, nogi z przodu, tułów odchylony', () => {
    const a = klon(WZ['Pull Up']); a.klatki[a.klatki.length - 1].miednica[1] -= 10; for (const s of ['R', 'L']) a.klatki[a.klatki.length - 1].nogi[s].kostka[1] -= 10; a.bledy = [];
    expect(waliduj(a, 'Pull Up').bledy.map((b) => b.szczegol).join('|')).toMatch(/reguła „broda_nad_drazkiem” \(wskazówka pu\.pull\): broda w u = 1 jest na y = [\d.]+ cm, a ma być ≥ 232\.0 cm/);
    const b = klon(WZ['Pull Up']); b.klatki[2].miednica[0] -= 6; b.bledy = []; expect(waliduj(b, 'Pull Up').bledy.map((x) => x.szczegol).join('|')).toMatch(/reguła „miednica_nie_buja” .*miednica przesuwa się w x o 6\.0 cm w ruchu \(limit 3 cm\)/);
    const c = klon(WZ['Pull Up']); for (const k of c.klatki) for (const s of ['R', 'L']) k.nogi[s].kostka[0] += 14; c.bledy = []; expect(waliduj(c, 'Pull Up').bledy.map((x) => x.szczegol).join('|')).toMatch(/reguła „nogi_nieruchome” .*kostka R względem miednicy w x: 10\.0…10\.0 cm, dozwolone -10…5 cm/);
    const d = klon(WZ['Pull Up']); d.klatki[0].pochylenieTulowia = -20; d.bledy = []; expect(waliduj(d, 'Pull Up').bledy.map((x) => x.kod)).toContain('sens');
  });
  test('wyjątki wariantów: Gironda i Muscle Up bez reguł bujania; Rope Climb do pominięcia; Side To Side bez limitu z; jednorącz wymaga trzyma R/L i wolnej dłoni poza drążkiem', () => {
    const r = run(SENS, `console.log(JSON.stringify([m.regulyDla('pull_up', 'Gironda Sternum Chins').map(x => x.id), m.regulyDla('pull_up', 'Muscle Up').map(x => x.id), m.pominiecie('pull_up', 'Rope Climb'), m.regulyDla('pull_up', 'Side To Side Chins').map(x => x.id), m.regulyDla('pull_up', 'Squat Xyz'), m.regulyDla('squat', 'Back Squat')]))`) as any[];
    expect(r[0]).toEqual(['dol_rece_proste']); expect(r[1]).toEqual(['dol_rece_proste']); expect(r[2]).toMatch(/lina/); expect(r[3]).toContain('miednica_nie_buja_x'); expect(r[3]).not.toContain('miednica_nie_buja'); expect(r[4]).toEqual([]); expect(r[5]).toEqual([]);
    const oa = klon(WZ['Pull Up']); oa.cwiczenie = 'One Arm Chin-Up'; oa.bledy = [];
    expect(waliduj(oa, 'One Arm Chin-Up').bledy.map((b) => b.szczegol).join('|')).toMatch(/jednorącz, a sprzet\[\] ma drążek trzymany obiema rękami/);
    oa.sprzet[0].trzyma = 'R'; for (const k of oa.klatki) k.rece.L.chwyt = [k.miednica[0] + 2, k.miednica[1] - 13, -21];
    expect(waliduj(oa, 'One Arm Chin-Up')).toEqual({ ok: true, bledy: [] });
    const wolnaZgieta = klon(oa); for (const k of wolnaZgieta.klatki) k.rece.L.chwyt = [k.miednica[0] + 2, k.miednica[1] + 5, -21]; /* reguły rąk (łokieć) nie dotyczą ręki WOLNEJ */
    expect(waliduj(wolnaZgieta, 'One Arm Chin-Up')).toEqual({ ok: true, bledy: [] });
    const zla = klon(oa); for (const k of zla.klatki) k.rece.L.chwyt = [0, 230, -22]; expect(waliduj(zla, 'One Arm Chin-Up').bledy.map((b) => b.kod)).toContain('sens');
  });
  test('błąd łamie DOKŁADNIE regułę swojej wskazówki: pu.noSwing przekraczający limity bujania przechodzi; ten sam błąd skracający zakres, bez przekroczenia limitów albo łamiący obie grupy — odrzucony', () => {
    const m = klon(WZ['Pull Up']); m.cwiczenie = 'Mixed Grip Chin';
    m.bledy = [{ cue: 'pu.noSwing', znacznik: 'pelvis', dotyczy: ['hip', 'knee', 'ankle', 'shoulder', 'elbow'], klatki: [{ u: 0 }, { u: 0.5, miednica: [-9, 0, 0], nogi: { R: { kostka: [24, 6, 0] }, L: { kostka: [24, 6, 0] } } }, { u: 1 }] }];
    expect(waliduj(m, 'Mixed Grip Chin')).toEqual({ ok: true, bledy: [] });
    const nz = klon(m); nz.bledy[0].klatki = [{ u: 0 }, { u: 0.5, miednica: [0, -8, 0], nogi: { R: { kostka: [0, -8, 0] }, L: { kostka: [0, -8, 0] } } }, { u: 1, miednica: [0, -16, 0], nogi: { R: { kostka: [0, -16, 0] }, L: { kostka: [0, -16, 0] } } }];
    const sz = waliduj(nz, 'Mixed Grip Chin').bledy.filter((b) => b.kod === 'blad-sens').map((b) => b.szczegol).join('|');
    expect(sz).toMatch(/nie łamie żadnej reguły grupy „bujanie”/); expect(sz).toMatch(/łamie także regułę innej grupy „pelna_amplituda” \(broda_nad_drazkiem\)/);
  });
  test('rodzina bez reguł (np. squat): sens pominięty, walidator zachowuje się jak dotąd', () => {
    expect(run(SENS, `console.log(JSON.stringify(m.sprawdzSens({ v2: null, poza: {}, rodzina: 'squat', cwiczenie: 'Back Squat' })))`)).toEqual([]);
  });
});

describe('gemini-polecenia: logika', () => {
  test('podział na części: do 12 ćwiczeń jedna część, więcej — równe części; pull_up (bez Gironda) = 12 ćwiczeń w jednym pliku, core_floor (44) = cztery części', () => {
    expect(run(POL, `console.log(JSON.stringify([m.MAX_CWICZEN_W_CZESCI, m.podzielNaCzesci(['a','b','c']), m.podzielNaCzesci(Array.from({length: 13}, (_, i) => 'x' + i)).map(x => x.length), m.podzielNaCzesci([]), m.podzielNaCzesci(Array.from({length: 5}, (_, i) => i), 2).map(x => x.length)]))`))
      .toEqual([12, [['a', 'b', 'c']], [7, 6], [], [2, 2, 1]]);
    expect(run(POL, `console.log(JSON.stringify(m.czesciRodziny('pull_up').map(c => [c.id, c.numer, c.ile, c.cwiczenia.length])))`)).toEqual([['pull_up', 1, 1, 12]]);
    const duza = run(POL, `console.log(JSON.stringify(m.czesciRodziny('core_floor').map(c => [c.id, c.cwiczenia.length])))`);
    expect(duza.map((x: any) => x[0])).toEqual(['core_floor-1', 'core_floor-2', 'core_floor-3', 'core_floor-4']); expect(duza.reduce((a: number, x: any) => a + x[1], 0)).toBe(44);
  });
  test('rodziny gotowe nie mają poleceń; ćwiczenia z zapisaną pozą są pomijane (Gironda); argumenty: wymagane --wyjscie i dokładnie jedno z --rodzina / --wszystkie', () => {
    expect(run(POL, `console.log(JSON.stringify(['squat','bench_press','hinge'].map(r => m.doZrobienia(r))))`)).toEqual([[], [], []]);
    const lista = run(POL, `console.log(JSON.stringify(m.doZrobienia('pull_up')))`); expect(lista).not.toContain('Gironda Sternum Chins'); expect(lista).toContain('Chin Up');
    const e = (a: string[]) => run(POL, `try { m.parsujArgumenty(${JSON.stringify(a)}); console.log('"ok"'); } catch (e) { console.log(JSON.stringify(e.message)); }`);
    expect(e(['--rodzina', 'pull_up', '--wyjscie', 'x'])).toBe('ok'); expect(e(['--rodzina', 'pull_up'])).toMatch(/--wyjscie/); expect(e(['--wyjscie', 'x'])).toMatch(/dokładnie jedno/); expect(e(['--foo'])).toMatch(/nieznany argument/);
  });
});

describe('gemini-polecenia: treść polecenia v2 (liczby z silnika, reguły z danych, rejestr błędów, wzorce)', () => {
  const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'polecenia-')), 'out'); /* dane z repozytorium (docs/51, rejestr, reguły); zapis tylko w katalogu wyniku */
  run(POL, `await m.main(['--rodzina','pull_up','--wyjscie',${JSON.stringify(out)}], { log: () => {} }); console.log('0')`);
  const tresc = fs.readFileSync(path.join(out, 'pull_up.md'), 'utf8');
  test('sekcje: kontrakt, pola, punkty odniesienia, wymagania, reguły sensu, najczęstsze błędy, wzorce, ćwiczenia, format z polem polecenie@N; wersja rdzenia w nagłówku', () => {
    for (const h of ['## Kontrakt danych', '## Pola obiektu pozy', '## Punkty odniesienia', '## Wymagania liczbowe walidatora', '## Reguły sensu ruchu', '## Najczęstsze błędy z poprzednich odpowiedzi', '## Wzorzec 1', '## Ćwiczenia do wykonania', 'FORMAT ODPOWIEDZI']) expect(tresc).toContain(h);
    expect(tresc).toContain('[polecenie@2]'); expect(tresc).toContain('{ "polecenie": "polecenie@2", "rodzina": "pull_up", "poze": {');
    expect(run(POL, 'console.log(JSON.stringify([m.WERSJA_POLECENIA, m.ETYKIETA_WERSJI]))')).toEqual([2, 'polecenie@2']);
  });
  test('punkty odniesienia z modelu: tabela (B, c) → miednica.y dla u = 0 i u = 1, miednica 18 cm za drążkiem, margines, konwencja kąta, kostka = podbicie + nachylenie goleni, reguła klatek (maks. 14 cm na 0,1)', () => {
    expect(tresc).toContain('drążek y = 230, chwyt z = ±22: u = 0 → miednica.y = 119.2'); expect(tresc).toContain('miednica.x = drążek.x − 18'); expect(tresc).toContain('CELUJ w 63.5 cm');
    expect(tresc).toContain('MARGINES: celuj 1–2 cm i 2–3°'); expect(tresc).toContain('0° = staw wyprostowany'); expect(tresc).toContain('KOSTKA (częsty błąd): kąt kostki = podbicie + nachylenie goleni'); expect(tresc).toContain('REGUŁA KLATEK'); expect(tresc).toContain('≤ 14 cm przy odstępie klatek 0,1');
    expect(tresc).toContain('co najmniej 8 cm'); expect(tresc).toContain('więcej niż 0.3 cm'); expect(tresc).toContain('Wyjątek tej rodziny: zwis i podciąganie');
  });
  test('wzorzec 1 to poza wyliczona z modelu i przechodzi walidator (JSON w poleceniu = ta sama poza); lina pominięta („pomiń — zrobi nasz agent”), jednorącz opisany z katalogu i nazwy', () => {
    const blok = /## Wzorzec 1[^\n]*\n\n```json\n(\{.*\})\n```/.exec(tresc)!; const poza = JSON.parse(blok[1]); expect(waliduj(poza, poza.cwiczenie)).toEqual({ ok: true, bledy: [] });
    expect(tresc).not.toContain('- "Rope Climb"'); expect(tresc).toMatch(/Pominięte w tym poleceniu .*"Rope Climb" — pomiń — zrobi nasz agent/);
    expect(tresc).toMatch(/- "One Arm Chin-Up" — sens: .*JEDNORĄCZ: drążek trzyma jedna dłoń \(sprzet: trzyma "R"\/"L"\)/); expect(tresc).toContain('- "Chin Up" — sens: sprzęt: drążek poziomy albo kółka');
  });
  test('rejestr błędów modelu w poleceniu: 10 najczęstszych kategorii z liczbami wystąpień i regułami zapobiegawczymi z liczbami silnika (bez nierozwiniętych {miejsc})', () => {
    const sek = /## Najczęstsze błędy[^\n]*\n\n[^\n]*\n((?:- .*\n)+)/.exec(tresc)!; const linie = sek[1].trim().split('\n'); expect(linie.length).toBeLessThanOrEqual(10); expect(linie.length).toBeGreaterThanOrEqual(8);
    expect(linie[0]).toMatch(/^- \(\d+×\) /); const licz = linie.map((l) => Number(/^- \((\d+)×\)/.exec(l)![1])); expect([...licz].sort((a, b) => b - a)).toEqual(licz);
    expect(sek[1]).not.toMatch(/\{\w+\}/); expect(sek[1]).toContain('zasięg ramienia od barku do chwytu to 64 cm'); expect(sek[1]).toContain('limit 37°');
  });
  test('brak nazw innych aplikacji i marek; polecenie mieści się w oknie czatu', () => {
    expect(tresc.length).toBeLessThan(36000); expect(tresc.length).toBeGreaterThan(8000); expect(tresc).not.toMatch(/strong|hevy|fitbod|jefit|stronglifts|myfitnesspal/i);
  });
  test('ZGODNOŚĆ polecenie ↔ walidator: każda reguła w poleceniu istnieje w danych i ma ewaluator; każda reguła ćwiczeń części jest w poleceniu z liczbami z danych; błędy łamią tylko swoją grupę', () => {
    const typy = run(SENS, 'console.log(JSON.stringify(Object.keys(m.EWALUATORY)))') as string[];
    const dane = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/zrodla/figury-sens.json'), 'utf8')).rodziny.pull_up;
    const wPoleceniu = [...tresc.matchAll(/\[reguła: (\w+)\]/g)].map((m) => m[1]); expect(wPoleceniu.length).toBeGreaterThan(5);
    for (const id of wPoleceniu) { expect([id, id in dane.reguly]).toEqual([id, true]); expect([id, typy.includes(dane.reguly[id].typ)]).toEqual([id, true]); }
    const cwiczenia = [...tresc.matchAll(/^- "([^"]+)" — sens:/gm)].map((m) => m[1]); expect(cwiczenia.length).toBe(11);
    const potrzebne = new Set(cwiczenia.flatMap((c) => { const w = dane.warianty[c]; return typeof w === 'string' ? dane.warianty[w] : w ?? []; }));
    for (const id of potrzebne) expect([id, wPoleceniu.includes(id)]).toEqual([id, true]);
    expect(new Set(wPoleceniu)).toEqual(potrzebne);
    const liczby: Record<string, string[]> = { broda_nad_drazkiem: ['≥ y drążka + 2 cm'], dol_rece_proste: ['≤ 25°'], miednica_nie_buja: ['o ≤ 3 cm'], nogi_nieruchome: ['-10…5 cm', '≤ 4 cm'], tulow_pion: ['-12°…3°'], rece_proste_caly_ruch: ['≤ 25°'], jedna_reka: ['≥ 15 cm'], miednica_nie_buja_x: ['(x) o ≤ 3 cm'] };
    for (const [id, fr] of Object.entries(liczby)) { const linia = tresc.split('\n').find((l) => l.includes(`[reguła: ${id}]`))!; for (const f of fr) expect([id, linia.includes(f)]).toEqual([id, true]); }
    for (const [cue, g] of Object.entries(dane.grupy_bledow)) if (cwiczenia.some((c) => tresc.includes(`błędy: ${cue}`) || tresc.includes(`${cue} (`))) expect(tresc).toContain(`${cue} → grupa „${g}”`);
  });
});

describe('gemini-polecenia: macierz rodzin (--wszystkie)', () => {
  test('plik dla każdej rodziny do zrobienia (bez gotowych), części ≤ 12 ćwiczeń, długość ≤ limitu, polecenie zawiera każdy klucz części i rdzeń v2', () => {
    const r = tmpRoot(); const out = path.join(r, 'out');
    const wynik = run(POL, `const log = []; await m.main(['--wszystkie','--wyjscie',${JSON.stringify(out)}], { root: ${JSON.stringify(r)}, log: (s) => log.push(s) }); console.log(JSON.stringify(log));`) as string[];
    const pliki = fs.readdirSync(out).sort(); expect(wynik[wynik.length - 1]).toMatch(/^rodzin: 40, plików: \d+, najdłuższe: \d+ znaków$/);
    for (const g of ['squat', 'bench_press', 'hinge']) expect(pliki.filter((p) => p.startsWith(g))).toEqual([]);
    const doc = fs.readFileSync(path.join(ROOT, 'docs/51-figury-v2-pokrycie.md'), 'utf8');
    const rodziny = [...doc.matchAll(/^\| `([a-z_0-9]+)` \| do zrobienia/gm)].map((m) => m[1]); expect(rodziny.length).toBe(40);
    for (const id of rodziny) {
      const mp = pliki.filter((p) => p === `${id}.md` || new RegExp(`^${id}-\\d+\\.md$`).test(p)); expect([id, mp.length > 0]).toEqual([id, true]);
      for (const f of mp) {
        const t = fs.readFileSync(path.join(out, f), 'utf8'); expect([f, t.length < 36000]).toEqual([f, true]); expect(t).toContain('[polecenie@2]');
        const klucze = /DOKŁADNIE te nazwy[^:]*: (.*)\.$/m.exec(t)![1].split('", "').map((k) => k.replace(/^"|"$/g, '')); expect(klucze.length).toBeLessThanOrEqual(12);
        for (const k of klucze) expect([f, t.includes(`- "${k}"`)]).toEqual([f, true]);
      }
    }
  });
});

describe('rejestr błędów modelu (gemini-rejestr.mjs, docs/53): kategorie, idempotencja, pomiar wersji', () => {
  test('kategoria z kodu i komunikatu: staw w zakresie, para geometrii, zasięg ręki, reguła sensu (bez przyrostka _x), pozostałe kody wprost', () => {
    const k = (kod: string, s: string) => run(REJ, `console.log(JSON.stringify(m.kluczKategorii(${JSON.stringify(kod)}, ${JSON.stringify(s)})))`);
    expect(k('zakres', 'staw ankle R = 37.9° poza zakresem ruchu [-60°, 37°] w fazie u=0.08')).toBe('zakres:ankle'); expect(k('geometria', 'head × bar: przenikanie 3.54 cm (dopuszczalne 0.3) w fazie u=0.38')).toBe('geometria:head × bar');
    expect(k('geometria', 'bledy[0] „pu.noSwing”: ręka R: cel poza zasięgiem o 1.31 cm w fazie u=0.00')).toBe('geometria:cel poza zasięgiem'); expect(k('sens', 'reguła „miednica_nie_buja_x” (wskazówka pu.noSwing): ...')).toBe('sens:miednica_nie_buja');
    expect(k('ruch', 'x')).toBe('ruch'); expect(k('ciaglosc', 'skok o 7.5 cm')).toBe('ciaglosc');
  });
  test('zapis odpowiedzi: liczniki, rodziny, przykład; ta sama odpowiedź tylko raz (hash); statystyka zaliczonych za 1. razem per wersja polecenia; sekcja z 10 kategoriami i liczbami', () => {
    const r = tmpRoot(); const wyn = [{ cwiczenie: 'A', ok: false, bledy: [{ kod: 'zakres', szczegol: 'staw ankle R = 40° poza zakresem ruchu' }, { kod: 'zakres', szczegol: 'staw ankle L = 40° poza zakresem ruchu' }, { kod: 'ruch', szczegol: 'za mały ruch' }] }, { cwiczenie: 'B', ok: true, bledy: [] }];
    const w = run(REJ, `const a = m.zapiszOdpowiedz(${JSON.stringify(r)}, { rodzina: 'pull_up', wersja: 'polecenie@2', runda: 1, tekst: 'x', wyniki: ${JSON.stringify(wyn)} }); const b = m.zapiszOdpowiedz(${JSON.stringify(r)}, { rodzina: 'pull_up', wersja: 'polecenie@2', runda: 1, tekst: 'x', wyniki: ${JSON.stringify(wyn)} });
      m.zapiszOdpowiedz(${JSON.stringify(r)}, { rodzina: 'pull_up', wersja: 'polecenie@2', runda: 2, tekst: 'y', wyniki: ${JSON.stringify([{ cwiczenie: 'A', ok: true, bledy: [] }])} });
      const rej = m.wczytajRejestr(${JSON.stringify(r)}); console.log(JSON.stringify({ p1: a.powtorka, p2: b.powtorka, kat: rej.kategorie, st: m.statystykaWersji(rej), n: rej.odpowiedzi.length, linie: m.liniePolecenia(rej, { ankleMax: 37, ankleSafe: '-5', minMotion: 8 }) }));`);
    expect([w.p1, w.p2, w.n]).toEqual([false, true, 2]); expect(w.kat['zakres:ankle']).toMatchObject({ wystapien: 2, cwiczen: 1, rodziny: ['pull_up'] }); expect(w.kat.ruch.wystapien).toBe(1);
    expect(w.st['polecenie@2']).toEqual({ cwiczen: 2, zaliczone: 1, odsetek: 50 }); expect(w.linie[0]).toMatch(/^- \(2×\) zakres:ankle: .*limit 37°/);
    expect(fs.existsSync(path.join(r, 'data/figury-bledy-modelu.json'))).toBe(true);
  });
  test('zasilony rejestr w repozytorium: odpowiedzi pull_up polecenie@1 (3 rundy), kategorie z liczbami, wszystkie znane kategorie mają regułę zapobiegawczą z liczbami', () => {
    const rej = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/figury-bledy-modelu.json'), 'utf8'));
    expect(rej.odpowiedzi.filter((o: any) => o.wersja === 'polecenie@1').map((o: any) => o.runda)).toEqual([1, 2, 3]);
    for (const k of ['chwyt', 'geometria:cel poza zasięgiem', 'zakres:ankle', 'geometria:head × bar', 'ciaglosc', 'sens:miednica_nie_buja', 'sens:broda_nad_drazkiem']) expect([k, rej.kategorie[k]?.wystapien > 0]).toEqual([k, true]);
    const zap = run(REJ, 'console.log(JSON.stringify(Object.keys(m.ZAPOBIEGANIE)))') as string[]; for (const k of Object.keys(rej.kategorie)) if (k !== 'sprzet') expect([k, zap.includes(k)]).toEqual([k, true]);
  });
});

describe('gemini-pozy --z-pliku: wyciąganie JSON z wklejonej odpowiedzi', () => {
  const wyc = (t: string) => run(POZY, `console.log(JSON.stringify(m.wyciagnijOdpowiedz(${JSON.stringify(t)})))`) as any;
  test('czysty JSON, blok ```json, otoczka tekstu przed i po bloku, nawiasy i cudzysłowy wewnątrz napisów', () => {
    const j = odp({ 'Pull Up': { klatki: [], x: 'a } "{ b' } });
    for (const t of [j, '```json\n' + j + '\n```', 'Oto pozy:\n```json\n' + j + '\n```\nDaj znać, jeśli coś poprawić {nie JSON}.', 'Jasne!\n' + j + '\nPozdrawiam']) {
      const r = wyc(t); expect(r.blad).toBeNull(); expect(r.ucieta).toBe(false); expect(r.rodzina).toBe('pull_up'); expect(Object.keys(r.poze)).toEqual(['Pull Up']); expect(r.poze['Pull Up'].x).toBe('a } "{ b');
    }
  });
  test('pojedyncza poza bez opakowania traktowana jako jedno ćwiczenie; tekst bez JSON = błąd', () => {
    expect(Object.keys(wyc(JSON.stringify(WZ['Pull Up'])).poze)).toEqual(['Pull Up']);
    const r = wyc('Przepraszam, nie mogę tego zrobić.'); expect(r.blad).toMatch(/nie znaleziono obiektu JSON/); expect(r.poze).toEqual({});
  });
  test('odpowiedź ucięta: odzyskane kompletne pozy, nazwa urwanego wpisu, rodzina z nagłówka', () => {
    const pelna = odp({ 'Chin Up': WZ['Chin Up'], 'Pull Up': WZ['Pull Up'] }); const urwij = pelna.slice(0, pelna.indexOf('"Pull Up"') + 400);
    const r = wyc('```json\n' + urwij); expect(r.ucieta).toBe(true); expect(Object.keys(r.poze)).toEqual(['Chin Up']); expect(r.ostatniKlucz).toBe('Pull Up'); expect(r.rodzina).toBe('pull_up'); expect(r.blad).toMatch(/ucięta.*1 kompletnych/);
    expect(wyc(pelna.slice(0, 60)).poze).toEqual({});
  });
});

describe('gemini-pozy --z-pliku: scenariusze importu (walidacja geometrii i sensu, nałożenie tylko przechodzących, polecenie poprawkowe, rejestr)', () => {
  test('poprawna odpowiedź: obie pozy nałożone do lib/figures/v2/poses/pull_up.json, raport, kod 0, bez polecenia poprawkowego; rejestr zapisuje odpowiedź z wersją z pola „polecenie”', () => {
    const r = tmpRoot(); const w = importuj(r, plik(r, 'o.json', odp({ 'Chin Up': WZ['Chin Up'], 'Pull Up': WZ['Pull Up'] })));
    expect(w.c).toBe(0); expect(zapisane(r)).toEqual(['Chin Up', 'Pull Up']); const rap = JSON.parse(wyj(r, 'raport-import.json')); expect(rap.przeszly).toEqual(['Chin Up', 'Pull Up']); expect(rap.nie_przeszly).toEqual([]);
    expect(fs.existsSync(path.join(r, 'wyj/pull_up-poprawka.md'))).toBe(false); expect(w.log.join('\n')).toMatch(/przeszło 2, nie przeszło 0, brakuje 0; nałożono do lib\/figures\/v2\/poses\/pull_up\.json/);
    const rej = JSON.parse(fs.readFileSync(path.join(r, 'data/figury-bledy-modelu.json'), 'utf8')); expect(rej.odpowiedzi).toHaveLength(1); expect(rej.odpowiedzi[0]).toMatchObject({ wersja: 'polecenie@2', runda: 1, cwiczen: 2, zaliczone: 2 });
    importuj(r, path.join(r, 'o.json')); expect(JSON.parse(fs.readFileSync(path.join(r, 'data/figury-bledy-modelu.json'), 'utf8')).odpowiedzi).toHaveLength(1); /* ta sama odpowiedź tylko raz */
  });
  test('poza z błędem sensu (bujanie): przechodząca nałożona, nieprzechodząca nie; raport z liczbami; polecenie poprawkowe z kodem i szczegółem; kategoria w rejestrze; kod 1', () => {
    const r = tmpRoot(); const zla = klon(WZ['Pull Up']); zla.klatki[2].miednica[0] -= 7; zla.bledy = [];
    const w = importuj(r, plik(r, 'o.md', 'Proszę:\n```json\n' + odp({ 'Chin Up': WZ['Chin Up'], 'Pull Up': zla }) + '\n```'), ['--runda', '1', '--wersja', 'polecenie@2']);
    expect(w.c).toBe(1); expect(zapisane(r)).toEqual(['Chin Up']); const rap = JSON.parse(wyj(r, 'raport-import.json')); expect(rap.nie_przeszly).toEqual(['Pull Up']);
    const pop = wyj(r, 'pull_up-poprawka.md'); expect(pop).toContain('## Pull Up'); expect(pop).toMatch(/- \[sens\] reguła „miednica_nie_buja” .*miednica przesuwa się w x o 7\.0 cm w ruchu \(limit 3 cm\)/); expect(pop).not.toContain('## Chin Up'); expect(pop).toContain('"Pull Up": <poprawiona poza>');
    const rej = JSON.parse(fs.readFileSync(path.join(r, 'data/figury-bledy-modelu.json'), 'utf8')); expect(rej.kategorie['sens:miednica_nie_buja'].wystapien).toBe(1); expect(rej.odpowiedzi[0]).toMatchObject({ cwiczen: 2, zaliczone: 1 });
    expect(wyj(r, 'raport-import.md')).toMatch(/OK  Chin Up[\s\S]*NIE Pull Up[\s\S]*\[sens\]/);
  });
  test('odpowiedź ucięta: odzyskana poza nałożona, polecenie poprawkowe prosi o brakujące ćwiczenia (część polecenia rozpoznana po kluczach)', () => {
    const r = tmpRoot(); const pelna = odp({ 'Chin Up': WZ['Chin Up'], 'Pull Up': WZ['Pull Up'] }); const p = plik(r, 'o.md', '```json\n' + pelna.slice(0, pelna.indexOf('"Pull Up"') + 500));
    const w = importuj(r, p); expect(w.c).toBe(1); expect(zapisane(r)).toEqual(['Chin Up']);
    const rap = JSON.parse(wyj(r, 'raport-import.json')); expect(rap.ucieta).toBe(true); expect(rap.brakujace).toEqual(['Pull Up']); expect(wyj(r, 'pull_up-poprawka.md')).toContain('Brakujące pozy (odpowiedź została ucięta)');
  });
  test('nieznany klucz: odrzucony z komunikatem, nie nałożony; brak JSON: kod 2 gdy nie ustalono rodziny, nic nie zapisane', () => {
    const r = tmpRoot(); const w = importuj(r, plik(r, 'o.json', odp({ 'Chin Up': WZ['Chin Up'], 'Pull Up': WZ['Pull Up'], 'Pullup xyz': WZ['Pull Up'] })));
    expect(w.c).toBe(1); expect(zapisane(r)).toEqual(['Chin Up', 'Pull Up']); expect(JSON.parse(wyj(r, 'raport-import.json')).nieznane).toEqual(['Pullup xyz']); expect(wyj(r, 'pull_up-poprawka.md')).toContain('Nieznane klucze');
    const r2 = tmpRoot(); expect(importuj(r2, plik(r2, 'o.md', 'Nie umiem.')).c).toBe(2); expect(zapisane(r2)).toEqual([]);
  });
  test('--tylko-raport: walidacja i raport bez nakładania (rejestr jednak się uczy); --rodzina niezgodna = kod 2; brakujące pola nagłówka uzupełniane', () => {
    const r = tmpRoot(); const gol = (x: any) => { const { kontrakt, rodzina, cwiczenie, ...bez } = x; return bez; };
    const p = plik(r, 'o.json', odp({ 'Chin Up': gol(WZ['Chin Up']), 'Pull Up': gol(WZ['Pull Up']) }));
    const w = importuj(r, p, ['--tylko-raport']); expect(w.c).toBe(0); expect(zapisane(r)).toEqual([]); expect(JSON.parse(wyj(r, 'raport-import.json')).przeszly).toEqual(['Chin Up', 'Pull Up']); expect(fs.existsSync(path.join(r, 'data/figury-bledy-modelu.json'))).toBe(true);
    expect(importuj(r, p, ['--rodzina', 'pulldown']).c).toBe(2); expect(importuj(r, p).c).toBe(0); expect(zapisane(r)).toEqual(['Chin Up', 'Pull Up']);
  });
  test('--runda: poza zakresem odrzucona; skrypt importu nie używa sieci ani klucza', () => {
    expect(run(POZY, `try { m.parsujArgumenty(['--z-pliku','x','--runda','0']); console.log('"ok"'); } catch (e) { console.log(JSON.stringify(e.message)); }`)).toMatch(/--runda/);
    const src = fs.readFileSync(POZY, 'utf8'); const blok = src.slice(src.indexOf('importujZPliku'), src.indexOf('/* ---------- uruchomienie')); expect(blok).not.toMatch(/fetch|GEMINI_API_KEY|process\.env/);
  });
});

describe('przegląd ruchu przez niezależnego recenzenta (bramka 4, docs/53): paczka wejściowa i blokada nałożenia', () => {
  test('--przeglad-wejscie: PNG/HTML, manifest (sprzęt, chwyt, wskazówki, reguły sensu, pytania) i PRZEGLAD.md dla przechodzących póz; NIC nie nałożone; --przeglad: nakłada tylko „ok”, „do_poprawy” trafia do poprawki z powodem, brak oceny wstrzymuje', () => {
    const r = tmpRoot(); const p = plik(r, 'o.json', odp({ 'Chin Up': WZ['Chin Up'], 'Pull Up': WZ['Pull Up'] }));
    const w = importuj(r, p, ['--przeglad-wejscie', path.join(r, 'paczka')]); expect(w.c).toBe(0); expect(zapisane(r)).toEqual([]);
    const dir = path.join(r, 'paczka/pull_up'); const man = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
    expect(man.cwiczenia.map((c: any) => c.cwiczenie)).toEqual(['Chin Up', 'Pull Up']); expect(man.pytania.length).toBeGreaterThanOrEqual(5); expect(man.pytania.join(' ')).toMatch(/NIE pokazuje błędu/);
    expect(man.cwiczenia[0]).toMatchObject({ trzyma: 'obie', bledy_w_pozie: ['pu.partial'] }); expect(man.cwiczenia[0].reguly_sensu).toContain('broda_nad_drazkiem'); expect(man.cwiczenia[0].opis.sens.join(' ')).toMatch(/drążek poziomy/); expect(man.cwiczenia[0].chwyt_z_cm).toEqual([15, -15]);
    expect(fs.readdirSync(dir).some((f) => /Chin-Up-light\.(png|html)$/.test(f))).toBe(true); expect(fs.readFileSync(path.join(dir, 'PRZEGLAD.md'), 'utf8')).toMatch(/niezależnym recenzentem ruchu[\s\S]*„do_poprawy” z konkretnym powodem blokuje nałożenie/);
    const rv = plik(r, 'przeglad.json', JSON.stringify({ rodzina: 'pull_up', wyniki: { 'Chin Up': { ocena: 'ok' }, 'Pull Up': { ocena: 'do_poprawy', powod: 'broda wygląda na poziomie drążka w widoku z przodu' } } }));
    const w2 = importuj(r, p, ['--przeglad', rv]); expect(w2.c).toBe(1); expect(zapisane(r)).toEqual(['Chin Up']);
    expect(wyj(r, 'pull_up-poprawka.md')).toMatch(/## Pull Up\n- \[przeglad\] recenzent ruchu: broda wygląda na poziomie drążka/);
    const r2 = tmpRoot(); const w3 = importuj(r2, plik(r2, 'o.json', odp({ 'Chin Up': WZ['Chin Up'], 'Pull Up': WZ['Pull Up'] })), ['--przeglad', plik(r2, 'p.json', JSON.stringify({ wyniki: { 'Chin Up': { ocena: 'ok' } } }))]);
    expect(w3.c).toBe(1); expect(zapisane(r2)).toEqual(['Chin Up']); expect(JSON.parse(wyj(r2, 'raport-import.json')).bez_przegladu).toEqual(['Pull Up']);
  });
});
