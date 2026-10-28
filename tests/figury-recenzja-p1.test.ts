/*
 * Poprawki po recenzji ruchu 1.1, partia 1 (27.10.2026; decyzja właściciela: bramką jest niezależna recenzja ruchu każdej rodziny, reguły automatyczne chronią przed regresją).
 * 11 błędów w 16 ćwiczeniach, wszystkie przechodziły walidator (0 z 11 złapane regułami). Każdy test odtwarza błąd z recenzji na pozach z lib/figures/v2/poses/*.json
 * i sprawdza wielkość, którą recenzent zmierzył (silnik v2: keyframeFrame, jointAngles); liczby w testach to progi z recenzji, nie wzór do dopasowania.
 * Poprawka pozy: generatory w scripts/figures/agent-pozy/ (dip, overhead_press, row, curl, triceps, delt_raise, chest_fly, rotator_cuff, pull_up).
 */
import * as path from 'path';
import { execFileSync } from 'child_process';

jest.setTimeout(240000);
const ROOT = path.join(__dirname, '..');
const run = (code: string) => JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', code], { cwd: ROOT, env: { PATH: process.env.PATH ?? '' } as unknown as NodeJS.ProcessEnv, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));

const KOD = `
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { loadV2 } from ${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-build.mjs'))};
import { waliduj } from ${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-validate.mjs'))};
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'recenzja-p1-')); const { v2 } = loadV2(dir);
const P = (f, cw) => JSON.parse(fs.readFileSync(path.join(${JSON.stringify(ROOT)}, 'lib/figures/v2/poses', f + '.json'), 'utf8')).cwiczenia[cw];
const US = Array.from({ length: 21 }, (_, i) => i / 20);
const sk = (p, u) => v2.keyframeFrame(p, u).sk;
const ang = (p, u, s = 'R') => v2.jointAngles(sk(p, u), s);
const d3 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const segDist = (pt, a, b) => { const ab = b.map((x, i) => x - a[i]); const ap = pt.map((x, i) => x - a[i]); const t = Math.max(0, Math.min(1, ap.reduce((s, x, i) => s + x * ab[i], 0) / ab.reduce((s, x) => s + x * x, 0))); return d3(pt, a.map((x, i) => x + ab[i] * t)); };
const ok = (p, f) => waliduj(p, { rodzina: f, cwiczenie: p.cwiczenie });
const W = {};

/* 1. Ring Dips: kółka, nie sztywny drążek */
{ const p = P('dip', 'Ring Dips'); const g = (u, s) => sk(p, u).arms[s].grip;
  W.ring = { rodzaje: p.sprzet.map((x) => x.rodzaj), zawieszenia: p.sprzet.filter((x) => x.rodzaj === 'zawieszenie').map((x) => x.trzyma), gripZ: US.map((u) => [g(u, 'R')[2], g(u, 'L')[2]]), lokiec: [ang(p, 0).elbow, ang(p, 1).elbow], walid: ok(p, 'dip'),
    capsZaw: v2.GEAR_KINDS.zawieszenie.caps, capsSztanga: v2.GEAR_KINDS.sztanga.caps, bazaChestDipRodzaje: P('dip', 'Chest Dip').sprzet.map((x) => x.rodzaj) }; }

/* 2. Arnold Press (hantle, kettlebell): różni się od zwykłego wyciskania ruchem łokci */
{ const roz = (a, b) => { let m = 0; for (const u of US) { const A = sk(a, u), B = sk(b, u); for (const k of ['shoulder', 'elbow', 'grip']) m = Math.max(m, d3(A.arms.R[k], B.arms.R[k])); } return m; };
  const A1 = P('overhead_press', 'Arnold Press'), O1 = P('overhead_press', 'Overhead Press (hantle)'), A2 = P('overhead_press', 'Kettlebell Arnold Press'), O2 = P('overhead_press', 'Kettlebell Press');
  const prof = (p) => { const el = US.map((u) => sk(p, u).arms.R.elbow[2]); return { start: el[0], max: Math.max(...el), bark: sk(p, 0).arms.R.shoulder[2], obrot: [p.klatki[0].rece.R.obrotPrzedramienia, p.klatki[p.klatki.length - 1].rece.R.obrotPrzedramienia] }; };
  W.arnold = { hantle: { roz: roz(A1, O1), ...prof(A1), walid: ok(A1, 'overhead_press') }, kb: { roz: roz(A2, O2), ...prof(A2), walid: ok(A2, 'overhead_press') }, bazaHantle: prof(O1) }; }

/* 3. One Arm Row (hantle): ławka, kolano i dłoń jednej strony na ławce */
{ const p = P('row', 'One Arm Row (hantle)'); const l = p.sprzet.find((x) => x.rodzaj === 'lawka');
  const wiersze = US.map((u) => { const s = sk(p, u); return { gripL: s.arms.L.grip, kneeL: s.legs.L.knee, ankL: s.legs.L.ankle, ankR: s.legs.R.ankle, gripR: s.arms.R.grip, pitch: p.klatki[0].pochylenieTulowia }; });
  W.row = { lawka: l ?? null, wiersze, walid: ok(p, 'row') }; }

/* 4. Wide-Grip Rear Pull-Up: głowa przed drążkiem na górze */
{ const p = P('pull_up', 'Wide-Grip Rear Pull-Up'); const bar = p.sprzet.find((x) => x.rodzaj === 'sztanga');
  W.rear = { barX: bar.x, barY: bar.y, glowa: US.map((u) => [u, ...sk(p, u).head]), szyja: US.map((u) => sk(p, u).neck), lokiec0: ang(p, 0).elbow, walid: ok(p, 'pull_up') }; }

/* 5. Scapular Pull-Up: ruch łopatek, nie kolan */
{ const p = P('pull_up', 'Scapular Pull-Up');
  W.scap = { lokcie: US.map((u) => Math.max(ang(p, u, 'R').elbow, ang(p, u, 'L').elbow)), barki: [p.klatki[0].rece.R.uniesienieBarkow, p.klatki[p.klatki.length - 1].rece.R.uniesienieBarkow], miednica: [sk(p, 0).pelvis, sk(p, 1).pelvis],
    kolano: US.map((u) => ang(p, u).knee), kostkaWzgMiednicy: US.map((u) => { const s = sk(p, u); return [s.legs.R.ankle[0] - s.pelvis[0], s.legs.R.ankle[1] - s.pelvis[1]]; }), walid: ok(p, 'pull_up') }; }

/* 6. Dead Hang: izometria — poza poprawna bez ruchu, ruch tylko w błędzie */
{ const p = P('pull_up', 'Dead Hang'); const klucze = ['hip', 'knee', 'ankle', 'elbow', 'shElev'];
  const zakres = Object.fromEntries(klucze.map((k) => { const v = US.map((u) => ang(p, u)[k]); return [k, Math.max(...v) - Math.min(...v)]; }));
  const ky = US.map((u) => { const s = sk(p, u); return s.legs.R.ankle[1] - s.pelvis[1]; });
  const blad = v2.keyframeFrame(p, 0.5, 0).sk; const baza = sk(p, 0.5);
  W.dead = { klatki: p.klatki.length, zakres, kostkaY: Math.max(...ky) - Math.min(...ky), blad: { cue: p.bledy[0]?.cue, kostkaDx: blad.legs.R.ankle[0] - baza.legs.R.ankle[0] }, walid: ok(p, 'pull_up') }; }

/* 7. Concentration Curl (hantle): łokieć na udzie, wolna ręka na udzie */
{ const p = P('curl', 'Concentration Curl (hantle)');
  W.conc = { lokiecDoUda: US.map((u) => { const s = sk(p, u); return segDist(s.arms.R.elbow, s.legs.R.hip, s.legs.R.knee); }), recaDoUda: US.map((u) => { const s = sk(p, u); return segDist(s.arms.L.grip, s.legs.L.hip, s.legs.L.knee); }), walid: ok(p, 'curl'), promienie: { udo: (v2.GIRTH.thigh[0] + v2.GIRTH.thigh[2]) / 2, ramie: (v2.GIRTH.uarm[0] + v2.GIRTH.uarm[1]) / 2, dlon: v2.GIRTH.hand } }; }

/* 8. Tate Press: przedramiona się nie krzyżują, hantle się nie przenikają */
{ const p = P('triceps', 'Tate Press');
  W.tate = { odlegloscDloni: US.map((u) => { const s = sk(p, u); return d3(s.arms.R.grip, s.arms.L.grip); }), gripRz: US.map((u) => sk(p, u).arms.R.grip[2]), walid: ok(p, 'triceps') }; }

/* 9. Reverse Pec Deck: przodem do oparcia, dwie dźwignie, łokcie za linią pleców */
{ const p = P('delt_raise', 'Reverse Pec Deck'); const s0 = sk(p, 0); const s1 = sk(p, 1);
  W.rpd = { lawki: p.sprzet.filter((x) => x.rodzaj === 'lawka').map((x) => ({ x: x.x, top: x.top, kat: x.kat })), dzwignie: p.sprzet.filter((x) => x.rodzaj === 'dzwignia').map((x) => x.trzyma), miednicaX: s0.pelvis[0], barkX: s0.shoulderC[0],
    lokciaKoniec: [s1.arms.R.elbow[0], s1.arms.L.elbow[0]], padBack: v2.BENCH.padBack, trunkCollide: v2.GIRTH.trunkCollide, trunkDepth: v2.GIRTH.trunkDepth, walid: ok(p, 'delt_raise') }; }

/* 10. Rozpiętki: dłonie nie w jednym punkcie */
{ const nazwy = ['Chest Fly (hantle)', 'Incline Chest Fly (hantle)', 'Decline Dumbbell Fly', 'Flat Bench Cable Fly', 'Incline Cable Fly']; W.fly = {};
  for (const n of nazwy) { const p = P('chest_fly', n); W.fly[n] = { minOdleglosc: Math.min(...US.map((u) => { const s = sk(p, u); return d3(s.arms.R.grip, s.arms.L.grip); })), koniec: sk(p, 1).arms.R.grip, walid: ok(p, 'chest_fly') }; } }

/* 11. External Rotation (hantel): opór grawitacji */
{ const p = P('rotator_cuff', 'External Rotation (hantel)'); const sd = p.sprzet.find((x) => x.rodzaj === 'hantel')?.trzyma ?? 'L'; /* ręka robocza z deklaracji sprzętu (od 28.10.2026 leżenie na lewym boku: pracuje górna, prawa ręka) */ const g = US.map((u) => sk(p, u).arms[sd].grip); const ds = US.slice(1).map((_, i) => d3(g[i], g[i + 1])); const droga = ds.reduce((a, b) => a + b, 0);
  W.rot = { hantel: p.sprzet.find((x) => x.rodzaj === 'hantel'), dy: Math.max(...g.map((x) => x[1])) - Math.min(...g.map((x) => x[1])), droga,
    osTulowiaY: US.map((u) => sk(p, u).up[1]), lokiec: US.map((u) => ang(p, u, sd).elbow), lokiecPrzyBoku: US.map((u) => { const s = sk(p, u); return d3(s.arms[sd].elbow, sk(p, 0).arms[sd].elbow); }), walid: ok(p, 'rotator_cuff') }; }

console.log(JSON.stringify(W));
`;

let W: any;
beforeAll(() => { W = run(KOD); });
const bezBledow = (v: any) => { expect(v.bledy).toEqual([]); expect(v.ok).toBe(true); };

describe('recenzja ruchu 1.1, partia 1: Ring Dips (kółka, nie drążek)', () => {
  test('sprzęt to dwie niezależne taśmy z uchwytami (R i L), bez sztywnego drążka; poza przechodzi walidator z wymaganym sprzętem „rings”', () => {
    expect(W.ring.rodzaje).not.toContain('sztanga');
    expect(W.ring.zawieszenia.sort()).toEqual(['L', 'R']);
    bezBledow(W.ring.walid);
  });
  test('wymagany sprzęt „rings” spełniają taśmy, a drążek (sztanga) go już nie spełnia; dipy na poręczach bez zmian', () => {
    expect(W.ring.capsZaw).toContain('rings');
    expect(W.ring.capsSztanga).not.toContain('rings');
    expect(W.ring.bazaChestDipRodzaje).toContain('poreczy');
  });
  test('chwyty są osobnymi punktami po obu stronach (|z| > 20 cm) przez cały ruch, a łokieć schodzi z ok. 12° do ok. 95° jak w dipie', () => {
    for (const [r, l] of W.ring.gripZ) { expect(r).toBeGreaterThan(20); expect(l).toBeLessThan(-20); }
    expect(W.ring.lokiec[0]).toBeLessThan(25); expect(W.ring.lokiec[1]).toBeGreaterThan(85);
  });
});

describe('recenzja ruchu 1.1, partia 1: Arnold Press (inny ruch niż zwykłe wyciskanie)', () => {
  test.each([['hantle'], ['kb']])('%s: różnica położenia stawów względem wariantu bazowego ≥ 8 cm (było 3,3 cm)', (k) => {
    expect(W.arnold[k].roz).toBeGreaterThanOrEqual(8);
    bezBledow(W.arnold[k].walid);
  });
  test.each([['hantle'], ['kb']])('%s: start — łokieć przed klatką, bliżej osi niż bark; w trakcie łokcie rozchodzą się na boki (≥ 30 cm od osi); obrót przedramienia od supinacji do nachwytu', (k) => {
    const a = W.arnold[k];
    expect(a.start).toBeLessThan(a.bark - 2);
    expect(a.max).toBeGreaterThanOrEqual(30);
    expect(a.obrot[0]).toBeGreaterThan(60); expect(a.obrot[1]).toBeLessThan(-60);
  });
  test('zwykłe wyciskanie hantli zostaje bez rozchodzenia łokci (kontrola: łokieć ≤ 30 cm od osi)', () => { expect(W.arnold.bazaHantle.max).toBeLessThan(30); });
});

describe('recenzja ruchu 1.1, partia 1: One Arm Row (hantle) — ławka i podparcie', () => {
  test('sprzęt ma ławkę płaską; lewa dłoń leży na blacie (≤ 6 cm nad blatem), lewe kolano na ławce, prawa stopa na podłodze, w każdej klatce', () => {
    const l = W.row.lawka; expect(l).not.toBeNull(); expect(l.kat ?? 0).toBe(0);
    for (const w of W.row.wiersze) {
      expect(w.gripL[1] - l.top).toBeGreaterThanOrEqual(0); expect(w.gripL[1] - l.top).toBeLessThanOrEqual(6);
      expect(Math.abs(w.gripL[2])).toBeLessThanOrEqual(16); /* blat ławki ma ±15 cm */
      expect(w.kneeL[1] - l.top).toBeGreaterThanOrEqual(2); expect(w.kneeL[1] - l.top).toBeLessThanOrEqual(10);
      expect(w.ankR[1]).toBeLessThanOrEqual(8);
    }
    bezBledow(W.row.walid);
  });
  test('ławka sięga pod dłoń i kolano (x w zasięgu ławki), tułów prawie poziomo (≥ 70° od pionu), goleń za kolanem', () => {
    const l = W.row.lawka; const od = 0 - l.dlugosc, doo = 0 + l.siedzisko;
    for (const w of W.row.wiersze) { expect(w.gripL[0]).toBeLessThanOrEqual(doo); expect(w.kneeL[0]).toBeGreaterThanOrEqual(od); expect(w.ankL[0]).toBeLessThan(w.kneeL[0]); expect(w.pitch).toBeGreaterThanOrEqual(70); }
  });
  test('ręka pracująca nadal wiosłuje (hantel przesuwa się o ≥ 30 cm)', () => {
    const a = W.row.wiersze[0].gripR, b = W.row.wiersze[W.row.wiersze.length - 1].gripR; expect(Math.hypot(a[0] - b[0], a[1] - b[1])).toBeGreaterThanOrEqual(30);
  });
});

describe('recenzja ruchu 1.1, partia 1: Wide-Grip Rear Pull-Up — za kark', () => {
  test('na górze środek głowy jest ≥ 8 cm PRZED osią drążka (drążek za karkiem), było −18 cm', () => {
    const g = W.rear.glowa[W.rear.glowa.length - 1]; expect(g[1] - W.rear.barX).toBeGreaterThanOrEqual(8);
  });
  test('głowa mija drążek z przodu: od momentu, gdy środek głowy jest na wysokości drążka (±12 cm), leży ≥ 11 cm przed nim; szyja na górze jest przed drążkiem', () => {
    for (const [, x, y] of W.rear.glowa) if (Math.abs(y - W.rear.barY) <= 12) expect(x - W.rear.barX).toBeGreaterThanOrEqual(11);
    expect(W.rear.szyja[W.rear.szyja.length - 1][0] - W.rear.barX).toBeGreaterThan(3);
  });
  test('na dole ręce prawie proste, poza przechodzi walidator (broda nad drążkiem, miednica bez bujania)', () => { expect(W.rear.lokiec0).toBeLessThanOrEqual(25); bezBledow(W.rear.walid); });
});

describe('recenzja ruchu 1.1, partia 1: Scapular Pull-Up — ruch łopatek, nie kolan', () => {
  test('ręce proste (łokieć ≤ 10°) przez cały ruch', () => { for (const e of W.scap.lokcie) expect(e).toBeLessThanOrEqual(10); });
  test('barki obniżają się o ≥ 4 cm (uniesienie od +4 do ≤ 0 cm), a ciało unosi się o ≥ 5 cm', () => {
    expect(W.scap.barki[0] - W.scap.barki[1]).toBeGreaterThanOrEqual(4);
    expect(W.scap.miednica[1][1] - W.scap.miednica[0][1]).toBeGreaterThanOrEqual(5);
  });
  test('nogi nieruchome względem miednicy: kolano zmienia się ≤ 5°, kostka względem miednicy ≤ 1 cm (x i y), miednica nie bujana (x ≤ 1 cm)', () => {
    const k = W.scap.kolano; expect(Math.max(...k) - Math.min(...k)).toBeLessThanOrEqual(5);
    for (const i of [0, 1]) { const v = W.scap.kostkaWzgMiednicy.map((x: number[]) => x[i]); expect(Math.max(...v) - Math.min(...v)).toBeLessThanOrEqual(1); }
    expect(Math.abs(W.scap.miednica[1][0] - W.scap.miednica[0][0])).toBeLessThanOrEqual(1);
    bezBledow(W.scap.walid);
  });
});

describe('recenzja ruchu 1.1, partia 1: Dead Hang — izometria bez ruchu', () => {
  test('poza poprawna nie zmienia żadnego stawu o więcej niż 5° (było: kolano 12° → 52°), kostka względem miednicy ≤ 1 cm w pionie, najwyżej 2 klatki', () => {
    expect(W.dead.klatki).toBeLessThanOrEqual(2);
    for (const v of Object.values(W.dead.zakres) as number[]) expect(v).toBeLessThanOrEqual(5);
    expect(W.dead.kostkaY).toBeLessThanOrEqual(1);
    bezBledow(W.dead.walid);
  });
  test('jedynym ruchem w podglądzie jest błąd „bujanie”: stopy w przód o ≥ 10 cm', () => { expect(W.dead.blad.cue).toBe('pu.noSwing'); expect(W.dead.blad.kostkaDx).toBeGreaterThanOrEqual(10); });
});

describe('recenzja ruchu 1.1, partia 1: Concentration Curl (hantle) — oparcie łokcia o udo', () => {
  test('łokieć ręki pracującej dotyka uda (odległość od osi uda ≤ promień uda + promień ramienia + 1 cm) w każdej klatce, było ok. 21 cm', () => {
    const lim = W.conc.promienie.udo + W.conc.promienie.ramie + 1;
    for (const d of W.conc.lokiecDoUda) expect(d).toBeLessThanOrEqual(lim);
    bezBledow(W.conc.walid);
  });
  test('wolna dłoń leży na drugim udzie (odległość od osi uda ≤ promień uda + promień dłoni + 1 cm), było ok. 21 cm od kolana', () => {
    const lim = W.conc.promienie.udo + W.conc.promienie.dlon + 1;
    for (const d of W.conc.recaDoUda) expect(d).toBeLessThanOrEqual(lim);
  });
});

describe('recenzja ruchu 1.1, partia 1: Tate Press — hantle nie przenikają się', () => {
  test('odległość między dłońmi ≥ 16 cm w każdej klatce (było 1,0 cm) i prawa dłoń nie przechodzi na lewą stronę osi (z > 0)', () => {
    for (const d of W.tate.odlegloscDloni) expect(d).toBeGreaterThanOrEqual(16);
    for (const z of W.tate.gripRz) expect(z).toBeGreaterThan(0);
    bezBledow(W.tate.walid);
  });
});

describe('recenzja ruchu 1.1, partia 1: Reverse Pec Deck — przodem do oparcia', () => {
  test('klatka oparta o podporę przed tułowiem: pionowe oparcie (kat 90) przed miednicą, jego tylna powierzchnia styka się z tułowiem (±1,5 cm)', () => {
    const pad = W.rpd.lawki.find((l: any) => l.kat === 90); expect(pad).toBeTruthy();
    expect(pad.x).toBeGreaterThan(W.rpd.miednicaX);
    const luka = pad.x - W.rpd.padBack - (W.rpd.miednicaX + W.rpd.trunkCollide); expect(Math.abs(luka)).toBeLessThanOrEqual(1.5);
    expect(W.rpd.lawki.some((l: any) => (l.kat ?? 0) < 90 && (l.kat ?? 0) >= -5 && (l.kat ?? 0) <= 5)).toBe(true); /* siedzisko: ławka płaska, bez oparcia za plecami */
  });
  test('dwie dźwignie (R i L), łokcie na końcu ruchu za linią pleców (x łokcia ≤ x barku − grubość tułowia)', () => {
    expect(W.rpd.dzwignie.sort()).toEqual(['L', 'R']);
    for (const x of W.rpd.lokciaKoniec) expect(x).toBeLessThanOrEqual(W.rpd.barkX - W.rpd.trunkDepth);
    bezBledow(W.rpd.walid);
  });
});

describe('recenzja ruchu 1.1, partia 1: 5 rozpiętek leżąc — dłonie nie w jednym punkcie', () => {
  test.each(['Chest Fly (hantle)', 'Incline Chest Fly (hantle)', 'Decline Dumbbell Fly', 'Flat Bench Cable Fly', 'Incline Cable Fly'])('%s: odległość chwytów R–L ≥ 12 cm w całym ruchu (było 0,4 cm)', (n) => {
    expect(W.fly[n].minOdleglosc).toBeGreaterThanOrEqual(12);
    bezBledow(W.fly[n].walid);
  });
});

describe('recenzja ruchu 1.1, partia 1: External Rotation (hantel) — opór grawitacji', () => {
  test('hantel unosi się: przyrost wysokości chwytu ≥ 50% drogi chwytu (reguła recenzenta: ≥ 30%) (było 0 przy drodze 46 cm); ciężar wolny działa przeciw grawitacji', () => {
    expect(W.rot.hantel).toBeTruthy();
    expect(W.rot.dy / W.rot.droga).toBeGreaterThanOrEqual(0.5);
    bezBledow(W.rot.walid);
  });
  test('leżenie na boku (oś tułowia pozioma), łokieć zgięty ok. 90° i przy boku (≤ 2 cm od położenia startowego) przez cały ruch', () => {
    for (const y of W.rot.osTulowiaY) expect(Math.abs(y)).toBeLessThan(0.1);
    for (const e of W.rot.lokiec) { expect(e).toBeGreaterThanOrEqual(75); expect(e).toBeLessThanOrEqual(105); }
    for (const d of W.rot.lokiecPrzyBoku) expect(d).toBeLessThanOrEqual(2);
  });
});
