/*
 * Backlog figur, runda 2 (28.10.2026), po niezależnej recenzji ruchu (bramka 4): F1–F6 i luki L1–L4 jako mechanizmy.
 *  F1 stopy w Clamshell i External Rotation (hantel) leżą jedna na drugiej, palcami w stronę kolan; L2: reguła R11 „oś stopy w płaszczyźnie biodro–kolano–kostka ±30°” na wszystkich pozach;
 *  F2 stopy leżącego przodem (Superman, Lower Back Curl, Seal Row) grzbietem w dół, palcami do tyłu (podbicie 91…270°);
 *  F3 rząd błędu Clamshell pokazuje nogę wyżej; F4 wiosłowanie: goleń odchylona do tyłu jest w przybliżeniu; F5/F6 komentarz i wpisy przybliżeń;
 *  L1 znacznik podglądu: tylko cała rodzina i tylko świeży względem gita; L3 tabela kątów osobno R i L; L4 przybliżenia z ograniczeniem silnika przeglądane przy zmianie kontraktu.
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
const { v2 } = loadV2(fs.mkdtempSync(path.join(os.tmpdir(), 'r2-')));
const poza = (r, cw) => JSON.parse(fs.readFileSync(path.join(${q('lib/figures/v2/poses')}, r + '.json'), 'utf8')).cwiczenia[cw];
const klon = (p) => JSON.parse(JSON.stringify(p));
const us = (p) => [...new Set([...Array.from({ length: 21 }, (_, i) => i / 20), ...p.klatki.map((k) => k.u)])].sort((a, b) => a - b);
const sub = (a, b) => a.map((x, i) => x - b[i]); const dot = (a, b) => a.reduce((t, x, i) => t + x * b[i], 0);
const r1 = (x) => Math.round(x * 10) / 10;
`;

describe('R11: oś stopy w płaszczyźnie biodro–kolano–kostka (L2 z recenzji ruchu r2)', () => {
  const W = uruchom(`${WSTEP}
const W = {}; const CS = poza('glute_floor', 'Clamshell'), ER = poza('rotator_cuff', 'External Rotation (hantel)');
const zle = (p) => { const k = klon(p); for (const f of k.klatki) { delete f.nogi.R.podbicie; f.nogi.R.rotacjaStopy = 10; } return k; }; /* stan sprzed poprawki: górna stopa neutralna względem goleni, rotacja 10° */
const trafia = (p, cw) => J.osStopyWPlaszczyznie(v2, { ...p, cwiczenie: cw ?? p.cwiczenie }).length;
W.clamshell = trafia(CS); W.er = trafia(ER); W.clamshellZle = trafia(zle(CS), 'X'); W.erZle = trafia(zle(ER), 'X');
const prosta = poza('pushup_plank', 'Push Up'); W.prostaNoga = us(prosta).map((u) => J.katOsiStopyOdPlaszczyzny(v2.keyframeFrame(prosta, u).sk, 'R')).filter((a) => a !== null).length; W.prostaTrafia = trafia(prosta);
W.prog = J.PROGI.osStopyDeg; W.progKolano = J.PROGI.osStopyKolanoMinDeg; W.reguly = J.REGULY_JAKOSCI.includes('os_stopy_w_plaszczyznie');
W.wyjatki = Object.fromEntries(Object.entries(J.OS_STOPY_WYJATKI).map(([cw, powod]) => [cw, String(powod).length]));
/* każdy wyjątek nadal coś wyłącza: poza pod inną nazwą łamie regułę */
const dane = {}; for (const f of fs.readdirSync(${q('lib/figures/v2/poses')})) { const d = JSON.parse(fs.readFileSync(path.join(${q('lib/figures/v2/poses')}, f), 'utf8')); for (const [cw, p] of Object.entries(d.cwiczenia ?? {})) dane[cw] = p; }
W.wyjatkiNieAktualne = Object.keys(J.OS_STOPY_WYJATKI).filter((cw) => { const p = dane[cw] ?? (v2.figureSpec(cw) ? v2.exampleFor(cw) : null); return !p || J.osStopyWPlaszczyznie(v2, { ...p, cwiczenie: 'X' }).length === 0; });
console.log(JSON.stringify(W));`);
  test('reguła jest w REGULY_JAKOSCI, próg 30° i kolano ≥ 35° są w PROGI', () => { expect(W.reguly).toBe(true); expect(W.prog).toBe(30); expect(W.progKolano).toBe(35); });
  test('poprawione pozy (Clamshell, External Rotation z hantlem) spełniają regułę, a ich stan sprzed poprawki (górna stopa neutralna, rotacja 10°) ją łamie', () => {
    expect(W.clamshell).toBe(0); expect(W.er).toBe(0); expect(W.clamshellZle).toBeGreaterThan(0); expect(W.erZle).toBeGreaterThan(0);
  });
  test('noga prawie prosta (płaszczyzna nieokreślona) nie jest oceniana: podpór na rękach nie daje trafień', () => { expect(W.prostaNoga).toBe(0); expect(W.prostaTrafia).toBe(0); });
  test('każdy znany wyjątek ma powód (≥ 40 znaków) i nadal łamie regułę (wyjątek, który niczego nie wyłącza, to błąd)', () => {
    for (const [cw, n] of Object.entries(W.wyjatki as Record<string, number>)) expect([cw, n >= 40]).toEqual([cw, true]);
    expect(W.wyjatkiNieAktualne).toEqual([]);
  });
  const Z = uruchom(`
import { raport } from ${q('scripts/figures/jakosc-raport.mjs')};
const r = raport(); console.log(JSON.stringify({ n: r.length, trafienia: r.filter((x) => x.naruszenia.includes('os_stopy_w_plaszczyznie')).map((x) => x.rodzina + '|' + x.cwiczenie) }));`);
  test('wszystkie pozy (dane i rigi): 0 trafień R11 poza jawnymi wyjątkami z powodem (zapadka pusta)', () => { expect(Z.n).toBeGreaterThan(400); expect(Z.trafienia).toEqual([]); });
});

describe('F1: stopy w Clamshell i External Rotation (hantel) leżą jedna na drugiej, palcami w stronę kolan', () => {
  const M = uruchom(`${WSTEP}
const out = {};
for (const [r, cw] of [['glute_floor', 'Clamshell'], ['rotator_cuff', 'External Rotation (hantel)']]) { const p = poza(r, cw); const o = { max: { R: 0, L: 0 }, palceVsKolano: 1, kostkiPoziomo: 0 };
  for (const u of us(p)) { const s = v2.keyframeFrame(p, u).sk;
    for (const k of ['R', 'L']) { const l = s.legs[k]; o.max[k] = Math.max(o.max[k], J.katOsiStopyOdPlaszczyzny(s, k)); const os = sub(l.toe, l.heel); const sr = l.hip.map((x, i) => (x + l.ankle[i]) / 2); const kolano = sub(l.knee, sr); o.palceVsKolano = Math.min(o.palceVsKolano, dot(os, kolano) / (Math.hypot(...os) * Math.hypot(...kolano))); }
    o.kostkiPoziomo = Math.max(o.kostkiPoziomo, Math.hypot(s.legs.R.ankle[0] - s.legs.L.ankle[0], s.legs.R.ankle[2] - s.legs.L.ankle[2])); }
  o.max.R = r1(o.max.R); o.max.L = r1(o.max.L); o.palceVsKolano = r1(o.palceVsKolano * 100) / 100; o.kostkiPoziomo = r1(o.kostkiPoziomo); out[cw] = o; }
console.log(JSON.stringify(out));`);
  test.each(['Clamshell', 'External Rotation (hantel)'])('%s: oś każdej stopy ≤ 30° od płaszczyzny biodro–kolano–kostka w każdej klatce (było 87° dla górnej stopy)', (cw) => { expect(M[cw].max.R).toBeLessThanOrEqual(30); expect(M[cw].max.L).toBeLessThanOrEqual(30); });
  test.each(['Clamshell', 'External Rotation (hantel)'])('%s: palce skierowane w tę samą stronę co kolano (kąt osi stopy do przesunięcia kolana < 90°) i kostki obu nóg blisko siebie (≤ 8 cm w poziomie)', (cw) => { expect(M[cw].palceVsKolano).toBeGreaterThan(0); expect(M[cw].kostkiPoziomo).toBeLessThanOrEqual(8); });
});

describe('F2: stopy leżącego przodem grzbietem w dół, palcami do tyłu (silnik ma podbicie 91…270°)', () => {
  const S = uruchom(`${WSTEP}
const out = {};
for (const [r, cw] of [['core_floor', 'Superman'], ['back_extension', 'Lower Back Curl'], ['row', 'Seal Row (sztanga)']]) { const p = poza(r, cw); const o = { podbicie: [999, -999], rot: 0, palceNizej: 999, palceDoTylu: 999, stopaNadPodloga: -1 };
  for (const k of p.klatki) for (const s of ['R', 'L']) { o.podbicie[0] = Math.min(o.podbicie[0], k.nogi[s].podbicie); o.podbicie[1] = Math.max(o.podbicie[1], k.nogi[s].podbicie); o.rot = Math.max(o.rot, Math.abs(k.nogi[s].rotacjaStopy ?? 0)); }
  for (const u of us(p)) { const s = v2.keyframeFrame(p, u).sk; for (const k of ['R', 'L']) { const l = s.legs[k]; o.palceNizej = Math.min(o.palceNizej, l.heel[1] - l.toe[1]); o.palceDoTylu = Math.min(o.palceDoTylu, l.ankle[0] - l.toe[0]); } }
  if (cw === 'Lower Back Curl') { const dk = (x) => Math.min(...(x.k === 'poly' ? x.pts : v2.ellipsePts(x.c, x.rx, x.ry, x.rot)).map((z) => z[1])); o.stopaNadPodloga = Math.max(...us(p).map((u) => Math.min(...v2.dataShapes(p, u, 'side').filter((x) => /^foot[RL]$/.test(x.id ?? '')).map(dk)))); }
  o.rot = r1(o.rot); o.palceNizej = r1(o.palceNizej); o.palceDoTylu = r1(o.palceDoTylu); o.stopaNadPodloga = r1(o.stopaNadPodloga); out[cw] = o; }
console.log(JSON.stringify(out));`);
  test.each(['Superman', 'Lower Back Curl', 'Seal Row (sztanga)'])('%s: podbicie 91…270° i rotacja 0 w każdej klatce, palce niżej niż pięta i za kostką (nie but pod goleniami)', (cw) => {
    expect(S[cw].podbicie[0]).toBeGreaterThanOrEqual(91); expect(S[cw].podbicie[1]).toBeLessThanOrEqual(270); expect(S[cw].rot).toBe(0); expect(S[cw].palceNizej).toBeGreaterThan(5); expect(S[cw].palceDoTylu).toBeGreaterThan(10);
  });
  test('Lower Back Curl: stopa leży przy podłodze (najniższy punkt obrysu najwyżej 2,5 cm nad nią; było 3,5 cm)', () => { expect(S['Lower Back Curl'].stopaNadPodloga).toBeLessThanOrEqual(2.5); });
  test('w generatorach nie ma już rotacji 70° ani nieaktualnego uzasadnienia „model stopy nie ma palców do tyłu” dla leżenia przodem', () => {
    for (const f of ['core_floor', 'row', 'back_extension']) { const t = fs.readFileSync(path.join(ROOT, `scripts/figures/agent-pozy/${f}.mjs`), 'utf8'); expect(t).not.toMatch(/ROT_STOPA_LEZY|rotacja 70°|obrócone na zewnątrz o 70°|model stopy nie ma palców/); }
  });
});

describe('F3: rząd błędu Clamshell pokazuje nogę za wysoko (nie tylko skręt tułowia)', () => {
  const E = uruchom(`${WSTEP}
import * as GF from ${q('scripts/figures/agent-pozy/glute_floor.mjs')};
const p = GF.generuj().Clamshell(); const o = {}; /* wiersz błędu jest w generatorze (w danych poz brak wierszy błędów Clamshell, Supermana i Fire Hydrant: decyzja backlogu 28.10.2026 — dodanie wiersza po przeglądzie) */
const s1 = v2.keyframeFrame(p, 1).sk, e1 = v2.keyframeFrame(p, 1, 0).sk; const s0 = v2.keyframeFrame(p, 0).sk, e0 = v2.keyframeFrame(p, 0, 0).sk;
o.kolanoWyzejCm = r1(e1.legs.R.knee[1] - s1.legs.R.knee[1]); o.kolanoU0 = r1(Math.abs(e0.legs.R.knee[1] - s0.legs.R.knee[1])); o.skret = Math.abs(p.bledy[0].klatki[p.bledy[0].klatki.length - 1].skretTulowia ?? 0);
o.dolnaNogaBezZmian = r1(Math.hypot(...sub(e1.legs.L.knee, s1.legs.L.knee))); o.zapis = p.bledy[0].klatki.map((k) => Object.keys(k).sort().join(','));
console.log(JSON.stringify(o));`);
  test('górne kolano w rzędzie błędu u = 1 jest ≥ 5 cm wyżej niż w pozie poprawnej, w u = 0 oba rzędy są takie same', () => { expect(E.kolanoWyzejCm).toBeGreaterThanOrEqual(5); expect(E.kolanoU0).toBe(0); });
  test('tułów odchyla się o ≥ 20° (skręt), a dolna noga zostaje na miejscu (≤ 1 cm)', () => { expect(E.skret).toBeGreaterThanOrEqual(20); expect(E.dolnaNogaBezZmian).toBeLessThanOrEqual(1); });
});

describe('F4: wiosłowanie w opadzie — goleń odchylona do tyłu jest w przybliżeniu', () => {
  const R4 = uruchom(`${WSTEP}
import * as G from ${q('scripts/figures/agent-pozy/row.mjs')};
const d = JSON.parse(fs.readFileSync(path.join(${q('lib/figures/v2/poses')}, 'row.json'), 'utf8')); const o = { kolanoZaPieta: [], maxKolano: 0, bezWpisu: [], lista: G.WIOSLO_STOPY_PRZED_KOLANEM };
for (const [cw, p] of Object.entries(d.cwiczenia)) { const s = v2.keyframeFrame(p, 0).sk; const l = s.legs.R; if (l.ankle[1] > 20) continue; const dx = l.knee[0] - l.heel[0]; 
  if (dx <= -3 && v2.jointAngles(s, 'R').knee < 45) { o.maxKolano = Math.max(o.maxKolano, v2.jointAngles(s, 'R').knee); o.kolanoZaPieta.push(cw); if (!/goleń[^;]*odchyla się do tyłu/.test(G.PRZYBLIZENIA[cw] ?? '')) o.bezWpisu.push(cw); } }
console.log(JSON.stringify(o));`);
  test('każda poza wiosłowania w opadzie z kolanem ≥ 3 cm za piętą ma w przybliżeniu opis odchylonej goleni (liczby i powód)', () => { expect(R4.kolanoZaPieta.length).toBeGreaterThanOrEqual(8); expect(R4.bezWpisu).toEqual([]); });
  test('lista póz z przesuniętymi stopami zgadza się z pomiarem; kolano nadal ≤ 30° (konwencja „lekko”)', () => { expect([...R4.kolanoZaPieta].sort()).toEqual([...R4.lista].sort()); expect(R4.maxKolano).toBeLessThanOrEqual(30); });
});

describe('F5/F6: komentarz o widoku z boku i wpisy przybliżeń', () => {
  test('komentarz BOK.ROLL nie twierdzi, że widok z boku jest jedynym w aplikacji (glute_floor i rotator_cuff mają widok z przodu)', () => {
    const t = fs.readFileSync(path.join(ROOT, 'scripts/figures/agent-pozy/mob.mjs'), 'utf8'); expect(t).not.toMatch(/jedynym w aplikacji/); expect(t).toMatch(/widok[a-z]* z przodu/);
  });
  const P = uruchom(`
import * as R1 from ${q('scripts/figures/agent-pozy/rotator_cuff.mjs')}; import * as B from ${q('scripts/figures/agent-pozy/back_extension.mjs')}; import * as G from ${q('scripts/figures/agent-pozy/glute_floor.mjs')};
console.log(JSON.stringify({ er: R1.PRZYBLIZENIA['External Rotation (hantel)'] ?? '', lbc: B.PRZYBLIZENIA['Lower Back Curl'] ?? '', cs: G.PRZYBLIZENIA.Clamshell ?? '' }));`);
  test('External Rotation (hantel) ma wpis przybliżenia z obrotem tułowia −75°, Lower Back Curl z ustawieniem stóp, Clamshell wspomina widok z przodu', () => {
    expect(P.er).toMatch(/−75°/); expect(P.lbc).toMatch(/stopy grzbietem w dół/); expect(P.cs).toMatch(/widoku z przodu/);
  });
});

describe('L1: znacznik podglądu — tylko cała rodzina i tylko świeży względem gita', () => {
  const L = uruchom(`
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import { execFileSync } from 'node:child_process';
import * as Z from ${q('scripts/figures/podglad-znacznik.mjs')};
import * as G from ${q('scripts/figures/agent-pozy/glute_floor.mjs')};
const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'znacznik-git-')); const git = (...a) => execFileSync('git', ['-c', 'user.email=t@t', '-c', 'user.name=t', '-c', 'commit.gpgsign=false', ...a], { cwd: repo, encoding: 'utf8' });
git('init', '-q'); for (const f of Z.plikiRodziny('glute_floor')) { fs.mkdirSync(path.dirname(path.join(repo, f)), { recursive: true }); fs.writeFileSync(path.join(repo, f), 'v1'); }
git('add', '-A'); git('commit', '-q', '-m', 'A');
const gen = G.generuj(); const wszystkie = Object.fromEntries(Object.entries(gen).map(([cw, f]) => [cw, f()]));
const buduj = (poze) => { const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'podglad-')); const przyblizenia = Object.fromEntries(Object.keys(poze).filter((c) => c in G.PRZYBLIZENIA).map((c) => [c, G.PRZYBLIZENIA[c]]));
  fs.writeFileSync(path.join(dir, 'poze.json'), JSON.stringify({ rodzina: 'glute_floor', poze })); fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify({ rodzina: 'glute_floor', przyblizenia }));
  fs.writeFileSync(path.join(dir, 'PODGLAD-WAZNY.txt'), Z.zbudujZnacznik({ rodzina: 'glute_floor', poze, przyblizenia, root: repo })); return dir; };
const W = { liczba: Object.keys(wszystkie).length };
const dirPelny = buduj(wszystkie); W.pelny = await Z.sprawdzPodglad(dirPelny, { generator: G, root: repo });
W.czesciowy = await Z.sprawdzPodglad(buduj({ Clamshell: wszystkie.Clamshell }), { generator: G, root: repo });
fs.writeFileSync(path.join(repo, Z.plikiRodziny('glute_floor')[0]), 'v2'); W.brudne = await Z.sprawdzPodglad(dirPelny, { generator: G, root: repo });
git('add', '-A'); git('commit', '-q', '-m', 'B'); W.starszy = await Z.sprawdzPodglad(dirPelny, { generator: G, root: repo });
const dirNowy = buduj(wszystkie); W.poNowymCommicie = await Z.sprawdzPodglad(dirNowy, { generator: G, root: repo });
fs.writeFileSync(path.join(repo, 'inny.txt'), 'x'); git('add', '-A'); git('commit', '-q', '-m', 'C (nie rodzina)'); W.innyCommit = await Z.sprawdzPodglad(dirNowy, { generator: G, root: repo });
console.log(JSON.stringify(W));`);
  test('podgląd całej rodziny zbudowany na zatwierdzonym stanie jest ważny', () => { expect(L.liczba).toBeGreaterThanOrEqual(7); expect(L.pelny).toEqual([]); });
  test('podgląd tylko części rodziny jest nieważny (brakuje póz)', () => { expect(L.czesciowy.join(' ')).toMatch(/niepełnej rodziny glute_floor: brakuje 6 z 7/); });
  test('pliki rodziny z niezatwierdzonymi zmianami unieważniają podgląd', () => { expect(L.brudne.join(' ')).toMatch(/niezatwierdzone zmiany/); });
  test('podgląd starszy niż ostatni commit zmieniający pliki rodziny jest nieważny', () => { expect(L.starszy.join(' ')).toMatch(/starszy niż ostatni commit zmieniający pliki rodziny/); });
  test('podgląd zbudowany po tym commicie jest ważny, a commit spoza plików rodziny go nie unieważnia', () => { expect(L.poNowymCommicie).toEqual([]); expect(L.innyCommit).toEqual([]); });
});

describe('L3: tabela kątów stawów osobno dla strony prawej i lewej', () => {
  const T = uruchom(`${WSTEP}
const p = poza('glute_floor', 'Clamshell'); const t = J.tabelaKatow(v2, p); const md = J.tabelaKatowMd([{ cwiczenie: 'Clamshell', katy: t }]);
const mw = (katy) => ({ cwiczenia: [{ cwiczenie: 'Clamshell', obraz: 'x.png', katy_stawow: katy, klatki_u: [0, 1], klatki_na_obrazie: [0, 1] }], zgodnosc_manifestu: [] });
const bezStron = JSON.parse(JSON.stringify(t)); for (const k of Object.keys(bezStron)) { delete bezStron[k].R; delete bezStron[k].L; }
console.log(JSON.stringify({ stawy: Object.keys(J.STAWY_TABELA), strony: Object.keys(t).map((k) => !!(t[k].R && t[k].L)), kolano: t.knee, laczny: Object.keys(t).map((k) => t[k].min === Math.min(t[k].R.min, t[k].L.min) && t[k].max === Math.max(t[k].R.max, t[k].L.max)), naglowek: md.split('\\n')[0], wiersz: md.split('\\n')[2], ok: J.podgladWazny(mw(t)), bezStron: J.podgladWazny(mw(bezStron)) }));`);
  test('każdy staw ma zakres R, zakres L i zakres łączny (min/max z obu stron)', () => { expect(T.strony.every(Boolean)).toBe(true); expect(T.laczny.every(Boolean)).toBe(true); });
  test('Clamshell: kolana obu nóg zgięte 80–95° (odczyt osobno dla R i L)', () => { for (const s of ['R', 'L']) { expect(T.kolano[s].min).toBeGreaterThan(80); expect(T.kolano[s].max).toBeLessThan(95); } });
  test('Markdown ma osobne kolumny „staw R” i „staw L” dla każdego stawu', () => { for (const n of ['biodro', 'kolano', 'kostka', 'łokieć']) { expect(T.naglowek).toContain(`${n} R`); expect(T.naglowek).toContain(`${n} L`); } expect(T.wiersz.split('|').length).toBe(T.naglowek.split('|').length); });
  test('podgląd z tabelą bez podziału na strony jest nieważny, z podziałem ważny', () => { expect(T.ok).toEqual([]); expect(T.bezStron.join(' ')).toMatch(/stronę prawą i lewą/); });
});

describe('L4: przybliżenia z ograniczeniem silnika są przeglądane przy zmianie kontraktu', () => {
  const K = uruchom(`
import * as O from ${q('scripts/figures/ograniczenia-silnika.mjs')}; import { schematRepo } from ${q('scripts/figures/v2-validate.mjs')};
const odcisk = O.odciskKontraktu(schematRepo()); const znalezione = await O.znajdzPrzyblizeniaZOgraniczeniem(); const rejestr = O.wczytajRejestrOgraniczen();
const syn = (wpisy, zn = ['a|X']) => O.sprawdzRejestrOgraniczen({ rejestr: { wpisy }, znalezione: zn, odcisk });
const w = { rodzina: 'a', cwiczenie: 'X', ograniczenie: 'model nie ma stopy do tyłu' };
console.log(JSON.stringify({ odcisk, rzeczywiste: O.sprawdzRejestrOgraniczen({ rejestr, znalezione, odcisk }), n: znalezione.length,
  bezWpisu: syn([]), swiezy: syn([{ ...w, status: 'przejrzane', przejrzane_przy: odcisk }]), nieaktualny: syn([{ ...w, status: 'przejrzane', przejrzane_przy: 'stary00000000' }]),
  bezPowodu: syn([{ ...w, status: 'do_przegladu' }]), zPowodem: syn([{ ...w, status: 'do_przegladu', powod: 'nie sprawdzone po zmianie silnika' }]), zbedny: syn([{ ...w, status: 'do_przegladu', powod: 'nie sprawdzone po zmianie silnika' }], []),
  wzorzec: ['model stopy nie ma palców', 'granica kontraktu', 'niemodelowane', 'schematycznie'].map((t) => O.WZORZEC_OGRANICZENIA.test(t)) }));`);
  test('odcisk schematu kontraktu to 12 znaków hex; rzeczywisty rejestr jest zgodny z przybliżeniami w generatorach (każde z ograniczeniem ma wpis, żaden wpis nie jest zbędny)', () => { expect(K.odcisk).toMatch(/^[0-9a-f]{12}$/); expect(K.n).toBeGreaterThanOrEqual(10); expect(K.rzeczywiste).toEqual([]); });
  test('przybliżenie z ograniczeniem bez wpisu jest zgłaszane (czerwony test przed wpisem)', () => { expect(K.bezWpisu.join(' ')).toMatch(/nie ma wpisu/); });
  test('wpis przejrzany przy bieżącym odcisku jest zgodny; po zmianie schematu kontraktu (inny odcisk) czerwienieje', () => { expect(K.swiezy).toEqual([]); expect(K.nieaktualny.join(' ')).toMatch(/kontrakt silnika się zmienił/); });
  test('wpis do_przegladu wymaga powodu; zbędny wpis (przybliżenia już nie ma) jest zgłaszany', () => { expect(K.bezPowodu.join(' ')).toMatch(/bez powodu/); expect(K.zPowodem).toEqual([]); expect(K.zbedny.join(' ')).toMatch(/nie ma już odpowiadającego/); });
  test('wzorzec łapie „model/kontrakt/silnik”, a nie „niemodelowane” ani „schematycznie”', () => { expect(K.wzorzec).toEqual([true, true, false, false]); });
  test('docs/50 opisuje regułę: przybliżenia z ograniczeniem silnika są przeglądane przy zmianie kontraktu', () => { const d = fs.readFileSync(path.join(ROOT, 'docs/50-figury-v2.md'), 'utf8'); expect(d).toMatch(/figury-ograniczenia-silnika\.json/); expect(d).toMatch(/ograniczeni\w+ silnika/); });
});
