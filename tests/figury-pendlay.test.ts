/*
 * Pendlay Row — nowa figura silnika v1 (1.0.1, docs/21 „Pendlay Row”, M1-audytor-generalny-047; ukryta w 1.0 decyzją właściciela 28.10.2026).
 * Cechy rozpoznawcze (2 przeczytane źródła szczebla 4, raport badacza 28.10.2026 sekcja 1): sztanga startuje z podłogi w każdym powtórzeniu (talerze leżą na podłodze),
 * tułów prawie równolegle do podłogi i nieruchomy (wyraźnie niżej niż w wiosłowaniu sztangą w opadzie), dynamiczne przyciągnięcie do dolnej części klatki / górnej części brzucha,
 * kolana lekko ugięte. Kąt tułowia jest uproszczeniem ilustracyjnym (źródła: „prawie równolegle”, bez liczby w tekście karty).
 * Rodzaje (docs/20): niezmienniki geometrii (liczone z silnika na pełnych danych figury — figura jest ukryta w runtime do recenzji niezależnej, L-047), dane (rejestr źródeł),
 * języki (4 nowe zdania we wszystkich językach wskazówek), recenzja (wpis „ukryta” z bieżącym skrótem — wyświetlana dopiero po recenzji innego agenta).
 * Ocena realności (docs/CLAUDE.md pkt 6): błąd „figura Pendlay Row wygląda jak zwykłe wiosłowanie” — realny (użytkownik otwiera kartę ćwiczenia).
 */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import {
  PROP_R, framePoints, poseBetween, resolveFigure, shapes, toHorizontal, evalCheck, jointAngles, FRAME_ORDER, type Figure, type Points,
} from '@/lib/figures/geom';
import { FIG_DATA } from '@/lib/figures';

const root = path.join(__dirname, '..');
const read = (p: string) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const FULL = read('data/zrodla/figures.json'), CUES = read('data/zrodla/cues.json');
const REC = read('docs/research/figury-recenzja.json');
const KEY = 'Pendlay Row', BOR = 'Bent Over Row (sztanga)';
const NEW_IDS = ['pendlay.setup', 'pendlay.pull', 'pendlay.floor', 'pendlay.mis.torso'];

const F = () => resolveFigure(FULL.exercises, KEY) as Figure;
const BORF = () => resolveFigure(FULL.exercises, BOR) as Figure;
/** Każda pozycja kluczowa i 8 pozycji pośrednich każdego przejścia animacji. */
function poses(f: Figure): { P: Points; tag: string; p: ReturnType<typeof poseBetween>["p"] }[] {
  const out: { P: Points; tag: string; p: ReturnType<typeof poseBetween>["p"] }[] = f.frames.map((fr, i) => ({ P: framePoints(f, i), p: fr.p, tag: fr.n as string }));
  for (let i = 0; i + 1 < f.frames.length; i++) for (let s = 1; s < 8; s++) { const r = poseBetween(f, i, i + 1, s / 8); out.push({ P: r.P, p: r.p, tag: `${f.frames[i].n}→${f.frames[i + 1].n}@${s / 8}` }); }
  return out;
}
/** Dolna krawędź talerza w pozycji kluczowej (y rysunku = podłoga 0), z kształtów, które rysuje silnik. */
function plateBottom(f: Figure, i: number): number {
  const c = shapes(f.frames[i].p, f.view, framePoints(f, i), f.props).filter(s => s.s === 'circle' && s.r === PROP_R.plate);
  expect(c.length).toBe(1);
  const s = c[0]; return s.s === 'circle' ? s.c[1] - s.r : NaN;
}

describe('Pendlay Row: figura jest własna (nie kopia wiosłowania sztangą w opadzie)', () => {
  test('dane: własne 4 pozycje start → mid → mid2 → end, bez „like” na wiosłowanie, widok z boku, kotwica palce, talerz na dłoni', () => {
    expect(FULL.exercises[KEY].like).toBeUndefined();
    const f = F(); expect(f.frames.map(x => x.n)).toEqual(FRAME_ORDER[4]);
    expect([f.view, f.anchor, f.props.map(p => p.k)]).toEqual(['side', 'toe', ['plate']]);
    expect(Object.keys(FULL.open)).not.toContain(KEY);
  });
  test('tułów prawie równolegle do podłogi w każdej pozie (≤ 15° od poziomu), wyraźnie niżej niż wiosłowanie w opadzie (≥ 15° różnicy)', () => {
    const bad = poses(F()).map(x => [x.tag, toHorizontal(x.P.hip, x.P.shoulder)] as const).filter(([, a]) => a > 15);
    expect(bad).toEqual([]);
    const f = F(), b = BORF();
    const pend = Math.min(...poses(f).map(x => toHorizontal(x.P.hip, x.P.shoulder))), bor = Math.min(...poses(b).map(x => toHorizontal(x.P.hip, x.P.shoulder)));
    expect(bor - Math.max(...poses(f).map(x => toHorizontal(x.P.hip, x.P.shoulder)))).toBeGreaterThanOrEqual(15);
    expect(pend).toBeGreaterThanOrEqual(0);
  });
  test('tułów nie unosi się: kąt od pozycji wyjściowej do „w trakcie 1” i w każdej innej pozie zmienia się o ≤ 5°', () => {
    const f = F(), a0 = toHorizontal(framePoints(f, 0).hip, framePoints(f, 0).shoulder), a1 = toHorizontal(framePoints(f, 1).hip, framePoints(f, 1).shoulder);
    expect(Math.abs(a1 - a0)).toBeLessThanOrEqual(5);
    for (const x of poses(f)) expect([x.tag, Math.abs(toHorizontal(x.P.hip, x.P.shoulder) - a0) <= 5]).toEqual([x.tag, true]);
  });
  test('start: sztanga na podłodze — dolna krawędź talerza styka się z podłogą (±0,5 j.); koniec powtórzenia = pętla wraca do tej pozycji', () => {
    const f = F(); expect(Math.abs(plateBottom(f, 0))).toBeLessThanOrEqual(0.5);
    expect(plateBottom(f, f.frames.length - 1)).toBeGreaterThanOrEqual(20); /* góra: sztanga wysoko nad podłogą, przy tułowiu */
  });
  test('talerz nie wchodzi pod podłogę w żadnej pozie animacji (≥ −0,5 j.)', () => {
    const f = F();
    for (const x of poses(f)) expect([x.tag, x.P.hand[1] - PROP_R.plate >= -0.5]).toEqual([x.tag, true]);
  });
  test('koniec: sztanga przy dolnej części klatki / górnej części brzucha (wskazówka pendlay.pull), tułów bez zmiany', () => {
    const f = F(), end = f.frames[3];
    const touch = end.why.find(w => w.q === 'touch' && w.c === 'pendlay.pull');
    expect(touch).toBeTruthy();
    expect(evalCheck(touch!, end.p, f.view, framePoints(f, 3)).ok).toBe(true);
  });
  test('tor sztangi prawie pionowy: rozrzut poziomy ≤ 25% drogi w pionie (droga ≥ 25 j.)', () => {
    const xs = poses(F()).map(x => x.P.hand[0]), ys = poses(F()).map(x => x.P.hand[1]);
    const dx = Math.max(...xs) - Math.min(...xs), dy = Math.max(...ys) - Math.min(...ys);
    expect(dy).toBeGreaterThanOrEqual(25); expect(dx / dy).toBeLessThanOrEqual(0.25);
  });
  test('brak ślizgu stóp: kostka, pięta i palce w żadnej pozie nie odchodzą od pozycji wyjściowej o więcej niż 2 j.; kolana lekko ugięte (15–35°)', () => {
    const f = F(), A = framePoints(f, 0);
    for (const x of poses(f)) for (const n of ['ankle', 'heel', 'toe', 'ankle2', 'heel2', 'toe2']) {
      expect([x.tag, n, Math.hypot(x.P[n][0] - A[n][0], x.P[n][1] - A[n][1]) <= 2]).toEqual([x.tag, n, true]);
    }
    for (const x of poses(f)) { const k = jointAngles(x.p, 'side').knee; expect([x.tag, k >= 15 && k <= 35]).toEqual([x.tag, true]); }
  });
  test('zakres stawów: każdy staw w każdej pozie i pozie pośredniej w granicach anatomicznych (rom z data.json)', () => {
    const bad: string[] = [], R = FIG_DATA.rom.side;
    for (const x of poses(F())) for (const [j, v] of Object.entries(jointAngles(x.p, 'side'))) {
      const r = R[j.replace(/2$/, '')]; if (!r) { bad.push(`${x.tag}: brak granicy ${j}`); continue; }
      if (v < r.min - 0.5 || v > r.max + 0.5) bad.push(`${x.tag}.${j}=${v.toFixed(1)} poza [${r.min}, ${r.max}]`);
    }
    expect(bad).toEqual([]);
  });
  test('figura nie wchodzi pod podłogę (≥ −1,5 j.) i ma skończone współrzędne w każdej pozie', () => {
    for (const x of poses(F())) for (const [n, q] of Object.entries(x.P)) expect([x.tag, n, Number.isFinite(q[0]) && Number.isFinite(q[1]) && q[1] >= -1.5]).toEqual([x.tag, n, true]);
  });
  test('każda poza spełnia swoje sprawdzenia i odwołuje się do zdań karty tego ćwiczenia', () => {
    const f = F(), ids = new Set(Object.values(CUES.exercises[KEY]).flat().map((r: unknown) => (r as { c: string }).c));
    f.frames.forEach((fr, i) => {
      expect([fr.n, fr.why.length > 0]).toEqual([fr.n, true]);
      for (const w of fr.why) { expect([fr.n, w.c, ids.has(w.c)]).toEqual([fr.n, w.c, true]); const r = evalCheck(w, fr.p, f.view, framePoints(f, i)); expect([fr.n, w.q, w.c, r.ok]).toEqual([fr.n, w.q, w.c, true]); }
    });
    expect(new Set(f.frames.flatMap(fr => fr.why.map(w => w.c)))).toContain('pendlay.floor');
  });
});

describe('Pendlay Row: karta (wskazówki) — start od nieruchomej sztangi, tułów nieruchomy', () => {
  test('karta ma 4 nowe zdania (ustawienie, ruch, wskazówka, błąd) w odpowiednich sekcjach; nie ma już ogólnego row.hinge', () => {
    const c = CUES.exercises[KEY], ids = (s: string) => c[s].map((r: { c: string }) => r.c);
    expect(ids('setup')).toContain('pendlay.setup'); expect(ids('move')).toEqual(['pendlay.pull']);
    expect(ids('tips')).toContain('pendlay.floor'); expect(ids('mistakes')).toContain('pendlay.mis.torso');
    expect(ids('setup')).not.toContain('row.hinge');
  });
  test('każde nowe zdanie ma ≥ 2 przeczytane źródła z różnych organizacji (wyjątek dla wskazówek techniki: 2 źródła szczebla 4) i miejsce w źródle', () => {
    for (const id of NEW_IDS) {
      const refs = Object.values(CUES.exercises[KEY]).flat().filter((r: unknown) => (r as { c: string }).c === id).flatMap((r: unknown) => (r as { s: [string, string][] }).s);
      expect(refs.length).toBeGreaterThanOrEqual(2);
      expect(new Set(refs.map(([sid]) => CUES.sources[sid].org)).size).toBeGreaterThanOrEqual(2);
      for (const [sid, at] of refs) { expect(CUES.sources[sid].level).toBe(4); expect(at.length).toBeGreaterThan(5); expect(CUES.sources[sid].url).toMatch(/^https:\/\//); }
    }
  });
  test('teksty: wszystkie języki wskazówek mają 4 nowe zdania; bez cyfr (kąt tułowia bez liczby), bez nazw źródeł; PL/EN zgodne z raportem badacza', () => {
    const files = fs.readdirSync(path.join(root, 'lib/cues/text')).filter(f => f.endsWith('.json') && !['es-419.json', 'pt-BR.json'].includes(f));
    expect(files.length).toBeGreaterThanOrEqual(32);
    for (const f of files) {
      const d = read('lib/cues/text/' + f);
      for (const id of NEW_IDS) { expect([f, id, typeof d[id] === 'string' && d[id].trim().length > 8]).toEqual([f, id, true]); expect([f, id, /\d/.test(d[id])]).toEqual([f, id, false]); expect([f, id, (/barbend|breaking ?muscle/i.test(d[id]) || /\b(NSCA|ACE)\b/.test(d[id]))]).toEqual([f, id, false]); }
    }
    const pl = read('lib/cues/text/pl.json'), en = read('lib/cues/text/en.json');
    expect(pl['pendlay.setup']).toMatch(/podłodze/); expect(pl['pendlay.setup']).toMatch(/równolegle/); expect(pl['pendlay.floor']).toMatch(/nieruchom/); expect(pl['pendlay.mis.torso']).toMatch(/tułow/i);
    expect(en['pendlay.setup']).toMatch(/floor/); expect(en['pendlay.floor']).toMatch(/dead stop/); expect(en['pendlay.pull']).toMatch(/explosively/);
  });
});

describe('Pendlay Row: recenzja (L-047) — figura ukryta do recenzji niezależnej', () => {
  test('wpis v1 „ukryta” ze skrótem bieżącej figury i kart; wyświetlana tylko po zapisie recenzji innego agenta (poza zakresem wykonawcy)', () => {
    const now = JSON.parse(execFileSync('node', [path.join(root, 'scripts/zrodla-runtime.mjs'), '--skroty'], { encoding: 'utf8' }));
    expect(REC.v1[KEY].werdykt).toBe('ukryta'); expect(REC.v1[KEY].sha).toBe(now.v1[KEY]);
    expect(FIG_DATA.exercises[KEY]).toBeUndefined(); expect(FIG_DATA.open).toContain(KEY);
  });
});
