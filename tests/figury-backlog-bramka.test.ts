/*
 * Backlog figur (28.10.2026, obszar 1.1): (1) R9 „ciało leży” i R10 „część ciała nie znika” są bramką sprawdzJakosc dla WSZYSTKICH rodzin (dotąd tylko mobilność, luka z recenzji mobilności r6);
 * głowę podpiera się tylko tam, gdzie tułów nie rusza się w ruchu (rozróżnienie z danych, nie z listy nazw); mostek (miednica uniesiona celowo) nie jest fałszywym alarmem;
 * (2) poprawione pozy: Clamshell i External Rotation (hantel) leżą na boku, stopy w Lower Back Curl, Superman i Seal Row są widoczne;
 * (3) znacznik PODGLAD-WAZNY.txt wiąże podgląd z danymi (odcisk póz i przybliżeń): podgląd z nieaktualnym manifestem jest nieważny;
 * (4) obrys kończyn leżących nie wchodzi pod podłogę, a dolna noga leżąca na boku jest mierzona profilem (kolumna po kolumnie), nie minimum kształtu;
 * (5) jedna stała „kolano lekko ugięte ≤ 30°” (KOLANO_LEKKO_MAX_DEG, konwencja) dla wszystkich reguł „lekko”.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(__dirname, '..');
const uruchom = (kod: string): any => JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', kod], { cwd: ROOT, env: { PATH: process.env.PATH ?? '' } as unknown as NodeJS.ProcessEnv, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
const q = (p: string) => JSON.stringify(path.join(ROOT, p));
const WSTEP = `
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { loadV2 } from ${q('scripts/figures/v2-build.mjs')};
import * as J from ${q('scripts/figures/v2-jakosc.mjs')};
const { v2 } = loadV2(fs.mkdtempSync(path.join(os.tmpdir(), 'bramka-')));
const poza = (r, cw) => JSON.parse(fs.readFileSync(path.join(${q('lib/figures/v2/poses')}, r + '.json'), 'utf8')).cwiczenia[cw];
const klon = (p) => JSON.parse(JSON.stringify(p));
const ctx = (rodzina, cwiczenie) => ({ v2, rodzina, cwiczenie, postural: new Set(), izometryczne: false, teksty: new Proxy({}, { get: () => 'x' }), reguly: [] });
const reguly = (p, rodzina, cw) => [...new Set(J.sprawdzJakosc(p, ctx(rodzina, cw)).map((x) => x.regula))];
const trafienia = (p, rodzina, cw, re) => J.sprawdzJakosc(p, ctx(rodzina, cw)).filter((x) => re.test(x.regula)).map((x) => x.szczegol);
`;

describe('R9 i R10 jako bramka sprawdzJakosc dla każdej rodziny (luka z recenzji mobilności r6)', () => {
  const W = uruchom(`${WSTEP}
const W = {}; const SQ = poza('mobility_floor', 'Side-Lying Quad Stretch');
const wisi = klon(SQ); for (const k of wisi.klatki) k.miednica[1] += 4;
const stopa = klon(SQ); for (const k of stopa.klatki) k.nogi.L.rotacjaStopy = 90;
const glowaWisi = klon(SQ); for (const k of glowaWisi.klatki) { k.rece.L.chwyt = [-20, 6, 10]; delete k.przechylGlowy; }
W.lezyInnaRodzina = ['glute_floor', 'rotator_cuff', 'core_floor', 'row'].map((r) => trafienia(wisi, r, 'X', /^cialo_lezy$/).length);
W.nieZnikaInnaRodzina = ['row', 'back_extension', 'core_floor', 'pull_up'].map((r) => trafienia(stopa, r, 'X', /^czesc_ciala_nie_znika$/).length);
W.glowaStatyczna = trafienia(glowaWisi, 'rotator_cuff', 'X', /^cialo_lezy$/).filter((x) => /głow/.test(x)).length;
W.pozaPoprawna = trafienia(SQ, 'glute_floor', 'X', /^(cialo_lezy|czesc_ciala_nie_znika)$/).length;
const cr = poza('core_floor', 'Crunch'), hh = poza('core_floor', 'Hollow Hold'), sl = poza('leg_isolation', 'Slider Hamstring Curl'), su = poza('core_floor', 'Superman');
W.brzuch = { crunch: trafienia(cr, 'core_floor', 'Crunch', /^cialo_lezy$/).length, hollow: trafienia(hh, 'core_floor', 'Hollow Hold', /^cialo_lezy$/).length, slider: trafienia(sl, 'leg_isolation', 'Slider Hamstring Curl', /^cialo_lezy$/).length, superman: trafienia(su, 'core_floor', 'Superman', /^cialo_lezy$/).length };
const slW = klon(sl); for (const k of slW.klatki) k.miednica[1] = 3; /* miednica leży na podłodze, a obrys miednicy 4 cm wyżej niż w pozie leżącej: mostek wyłączony tylko przy uniesionych biodrach względem barków */
W.mostekPoziom = trafienia(slW, 'leg_isolation', 'X', /^cialo_lezy$/).length;
console.log(JSON.stringify(W));`);
  test('obrys miednicy 4 cm nad podłogą w pozie leżącej jest zgłaszany w glute_floor, rotator_cuff, core_floor i row, nie tylko w mobilności', () => { expect(W.lezyInnaRodzina.every((n: number) => n > 0)).toBe(true); });
  test('stopa obrócona wprost na kamerę (kształt 0 cm) jest zgłaszana w każdej rodzinie', () => { expect(W.nieZnikaInnaRodzina.every((n: number) => n > 0)).toBe(true); });
  test('podparcie głowy: poza o stałym tułowiu (leżenie na boku, ręka wisi) jest sprawdzana, ćwiczenia brzucha z ruchem tułowia (Crunch) i uniesioną głową (Hollow Hold, Superman) nie', () => {
    expect(W.glowaStatyczna).toBe(1); expect(W.brzuch.crunch).toBe(0); expect(W.brzuch.hollow).toBe(0); expect(W.brzuch.superman).toBe(0);
  });
  test('mostek na jednej nodze (miednica uniesiona celowo względem barków) nie jest fałszywym alarmem; poprawna poza leżąca nie ma trafień', () => { expect(W.brzuch.slider).toBe(0); expect(W.pozaPoprawna).toBe(0); });
});

describe('wszystkie pozy z danych i rigi: 0 trafień R9 i R10 (zapadka pusta)', () => {
  const w = uruchom(`
import { raport } from ${q('scripts/figures/jakosc-raport.mjs')};
const r = raport(); console.log(JSON.stringify({ n: r.length, trafienia: r.filter((x) => x.naruszenia.some((n) => n === 'cialo_lezy' || n === 'czesc_ciala_nie_znika')).map((x) => x.rodzina + '|' + x.cwiczenie) }));`);
  test('żadna poza (dane i rigi) nie łamie cialo_lezy ani czesc_ciala_nie_znika', () => { expect(w.n).toBeGreaterThan(400); expect(w.trafienia).toEqual([]); });
});

describe('pomiary poprawionych póz', () => {
  const M = uruchom(`${WSTEP}
const dk = (x) => { const p = x.k === 'poly' ? x.pts : x.k === 'ellipse' ? v2.ellipsePts(x.c, x.rx, x.ry, x.rot) : x.k === 'circle' ? [[x.c[0], x.c[1] - x.r]] : null; return p ? Math.min(...p.map((z) => z[1])) : null; };
const nis = (p, u, re) => { const l = v2.dataShapes(p, u, 'side').filter((x) => re.test(x.id ?? '')).map(dk).filter((y) => y !== null); return l.length ? Math.round(Math.min(...l) * 10) / 10 : null; };
const rozm = (p, u, id) => { const x = v2.dataShapes(p, u, 'side').find((s) => s.id === id); if (!x || x.k !== 'poly') return null; const xs = x.pts.map((z) => z[0]), ys = x.pts.map((z) => z[1]); return Math.round(Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) * 10) / 10; };
const out = {};
for (const [r, cw] of [['glute_floor', 'Clamshell'], ['rotator_cuff', 'External Rotation (hantel)']]) { const p = poza(r, cw); const us = p.klatki.map((k) => k.u);
  out[cw] = { tulow: Math.max(...us.map((u) => nis(p, u, /^torso$/))), udoDolne: Math.max(...us.map((u) => Math.min(nis(p, u, /^thighR$/), nis(p, u, /^thighL$/)))), golenDolna: Math.max(...us.map((u) => Math.min(nis(p, u, /^shankR$/), nis(p, u, /^shankL$/)))), reguly: reguly(p, r, cw).filter((x) => /cialo_lezy|czesc/.test(x)) }; }
for (const [r, cw] of [['back_extension', 'Lower Back Curl'], ['core_floor', 'Superman'], ['row', 'Seal Row (sztanga)']]) { const p = poza(r, cw); out[cw] = { stopy: Math.min(...p.klatki.flatMap((k) => [rozm(p, k.u, 'footR'), rozm(p, k.u, 'footL')])), reguly: reguly(p, r, cw).filter((x) => /cialo_lezy|czesc/.test(x)) }; }
console.log(JSON.stringify(out));`);
  test.each(['Clamshell', 'External Rotation (hantel)'])('%s leży na boku: obrys tułowia ≤ 2 cm, dolne udo i goleń ≤ 3 cm nad podłogą, reguły R9/R10 bez trafień', (cw) => {
    expect(M[cw].tulow).toBeLessThanOrEqual(2); expect(M[cw].udoDolne).toBeLessThanOrEqual(3); expect(M[cw].golenDolna).toBeLessThanOrEqual(3); expect(M[cw].reguly).toEqual([]);
  });
  test.each(['Lower Back Curl', 'Superman', 'Seal Row (sztanga)'])('%s: żadna stopa nie jest punktem w widoku z boku (≥ 1,5 cm w każdej klatce)', (cw) => { expect(M[cw].stopy).toBeGreaterThanOrEqual(1.5); expect(M[cw].reguly).toEqual([]); });
});

describe('znacznik PODGLAD-WAZNY.txt wiąże podgląd z danymi (luka z r6: nieaktualne przybliżenie przeszło)', () => {
  const S = uruchom(`
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import * as Z from ${q('scripts/figures/podglad-znacznik.mjs')};
import * as G from ${q('scripts/figures/agent-pozy/glute_floor.mjs')};
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'znacznik-')); const gen = G.generuj(); const poze = { Clamshell: gen.Clamshell() };
const przyblizenia = { Clamshell: G.PRZYBLIZENIA.Clamshell };
fs.writeFileSync(path.join(dir, 'poze.json'), JSON.stringify({ rodzina: 'glute_floor', poze }));
fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify({ rodzina: 'glute_floor', przyblizenia }));
fs.writeFileSync(path.join(dir, 'PODGLAD-WAZNY.txt'), Z.zbudujZnacznik({ rodzina: 'glute_floor', poze, przyblizenia, ekstra: 'Kontrola manifestu wykonana.' }));
const W = {}; W.znacznik = fs.readFileSync(path.join(dir, 'PODGLAD-WAZNY.txt'), 'utf8');
W.swiezy = await Z.sprawdzPodglad(dir, { generator: G });
const stare = { ...G, PRZYBLIZENIA: { ...G.PRZYBLIZENIA, Clamshell: 'inny opis przybliżenia' } };
W.innePrzyblizenie = await Z.sprawdzPodglad(dir, { generator: stare });
const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8')); manifest.przyblizenia.Clamshell = 'nieaktualny opis'; fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest));
W.manifestNieaktualny = await Z.sprawdzPodglad(dir, { generator: G });
fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify({ rodzina: 'glute_floor', przyblizenia }));
const zmienione = JSON.parse(fs.readFileSync(path.join(dir, 'poze.json'), 'utf8')); zmienione.poze.Clamshell.klatki[0].miednica[1] += 1; fs.writeFileSync(path.join(dir, 'poze.json'), JSON.stringify(zmienione));
W.pozaZmieniona = await Z.sprawdzPodglad(dir, { generator: G });
fs.rmSync(path.join(dir, 'PODGLAD-WAZNY.txt')); W.bezZnacznika = await Z.sprawdzPodglad(dir, { generator: G });
console.log(JSON.stringify(W));`);
  test('znacznik zawiera odcisk póz i przybliżeń (sha256) oraz jest odczytywalny', () => { expect(S.znacznik).toMatch(/odcisk_poz: [0-9a-f]{64}/); expect(S.znacznik).toMatch(/odcisk_przyblizen: [0-9a-f]{64}/); });
  test('świeży podgląd jest ważny', () => { expect(S.swiezy).toEqual([]); });
  test('przybliżenie zmienione w generatorze po zbudowaniu podglądu unieważnia podgląd', () => { expect(S.innePrzyblizenie.join(' ')).toMatch(/przybliżen/); });
  test('manifest z nieaktualnym przybliżeniem unieważnia podgląd', () => { expect(S.manifestNieaktualny.join(' ')).toMatch(/przybliżen/); });
  test('poza zmieniona po zbudowaniu podglądu unieważnia podgląd', () => { expect(S.pozaZmieniona.join(' ')).toMatch(/poz/); });
  test('brak znacznika = podgląd nieważny', () => { expect(S.bezZnacznika.join(' ')).toMatch(/PODGLAD-WAZNY/); });
  test('run.mjs zapisuje znacznik przez zbudujZnacznik (nie ręcznym tekstem)', () => { expect(fs.readFileSync(path.join(ROOT, 'scripts/figures/agent-pozy/run.mjs'), 'utf8')).toMatch(/zbudujZnacznik/); });
});

describe('obrys kończyn leżących i pomiar dolnej nogi profilem', () => {
  const P = uruchom(`${WSTEP}
const SQ = poza('mobility_floor', 'Side-Lying Quad Stretch');
const pod = klon(SQ); for (const k of pod.klatki) { k.rece.L.chwyt[1] -= 5; }
const nogaSkos = klon(SQ); for (const k of nogaSkos.klatki) { k.nogi.L.kostka[1] += 2; }
const W = { poprawna: J.cialoLezy(v2, SQ, { glowa: true }).length, podRamie: J.obrysKonczynPodPodloga(v2, pod).length, poprawnaPod: J.obrysKonczynPodPodloga(v2, SQ).length, skos: J.cialoLezy(v2, nogaSkos, { glowa: true }).filter((x) => /dolna noga/.test(x)).length };
W.prog = J.PROGI.podlogaObrysKonczynCm;
console.log(JSON.stringify(W));`);
  test('próg przenikania obrysu kończyn leżących pod linię podłogi jest w PROGI (konwencja), ujemny i nie luźniejszy niż −3 cm', () => { expect(P.prog).toBeLessThan(0); expect(P.prog).toBeGreaterThanOrEqual(-3); });
  test('kończyna z obrysem wchodzącym pod podłogę jest zgłaszana, poprawna poza leżąca nie', () => { expect(P.podRamie).toBeGreaterThan(0); expect(P.poprawnaPod).toBe(0); expect(P.poprawna).toBe(0); });
  test('dolna noga uniesiona jednym końcem jest zgłaszana (profil kolumna po kolumnie, nie minimum kształtu)', () => { expect(P.skos).toBeGreaterThan(0); });
});

describe('jedna stała „kolano lekko ugięte” (konwencja, 30°)', () => {
  const S = uruchom(`
import { KOLANO_LEKKO_MAX_DEG, regulyDla } from ${q('scripts/figures/v2-sens.mjs')};
const par = (r, cw, id) => regulyDla(r, cw).find((x) => x.id === id)?.parametry;
console.log(JSON.stringify({ stala: KOLANO_LEKKO_MAX_DEG, row: par('row', 'Bent Over Row (sztanga)', 'kolana_lekko'), hang: par('core_hang', 'Hanging Leg Raise', 'kolana_lekko'), mob: par('mobility_stand', 'Standing Soleus And Achilles Stretch', 'obie_kolana_lekko') }));`);
  const surowy = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/zrodla/figury-sens.json'), 'utf8'));
  test('stała = 30° i wszystkie reguły „lekko” (wiosłowanie, zwis, rozciąganie stojąc) używają jej po rozwiązaniu odnośnika', () => {
    expect(S.stala).toBe(30); expect(S.row.max_deg).toBe(30); expect(S.hang.max_deg).toBe(30); expect(S.mob.max_max_deg).toBe(30);
  });
  test('w pliku reguł te trzy progi są odnośnikiem do stałej, nie liczbą (liczba w jednym miejscu)', () => {
    expect(surowy.rodziny.row.reguly.kolana_lekko.parametry.max_deg).toBe('@kolano_lekko_max_deg');
    expect(surowy.rodziny.core_hang.reguly.kolana_lekko.parametry.max_deg).toBe('@kolano_lekko_max_deg');
    expect(surowy.rodziny.mobility_stand.reguly.obie_kolana_lekko.parametry.max_max_deg).toBe('@kolano_lekko_max_deg');
    expect(surowy.stale.kolano_lekko_max_deg.wartosc).toBe(30); expect(surowy.stale.kolano_lekko_max_deg.liczba).toMatch(/^konwencja/);
  });
  test('specyfikacja docs/research/28-figury.md odsyła do stałej zamiast własnej liczby (row.hinge nie ma już 20° ±15°)', () => {
    const d = fs.readFileSync(path.join(ROOT, 'docs/research/28-figury.md'), 'utf8');
    expect(d).toMatch(/KOLANO_LEKKO_MAX_DEG/); expect(d).not.toMatch(/row\.hinge[^\n]*20° ±15°/);
  });
});
