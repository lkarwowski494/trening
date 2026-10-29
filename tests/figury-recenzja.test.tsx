/*
 * Bramka 4 — recenzja ruchu i treści karty przed wyświetleniem (CLAUDE.md, 27.10.2026; decyzja DEC-01 b; zadanie M1-audytor-generalny-005, znalezisko 06-tresci-001).
 * Zapis recenzji: docs/research/figury-recenzja.json — wpis na każdą figurę v1 (rodzina, werdykt, data, kto, skrót danych figury i wskazówek) i na każdą gotową rodzinę v2.
 * Mechanizm: scripts/zrodla-runtime.mjs przepuszcza do lib/figures/data.json tylko figury v1 z werdyktem „wyswietlana” albo „zastapiona” i skrótem równym bieżącemu;
 * figura bez wpisu, ukryta albo zmieniona po recenzji trafia na listę otwartą i się nie renderuje. Rodzina v2 ze statusem „ready” musi mieć wpis z bieżącym skrótem rigu.
 * Rodzaje (docs/20): dane (wpisy i skróty), niezmienniki (wyświetlane ⇒ aktualna recenzja), ekran (figura ukryta — same wskazówki), regresja (wady z recenzji 27.10.2026
 * odtworzone liczbą z silnika na danych sprzed poprawki: „było …”).
 */
import React from 'react';
import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';
import { execFileSync } from 'child_process';
import { render, screen } from '@testing-library/react-native';
import { FIG_DATA, figureByKey } from '@/lib/figures';
import { framePoints, poseBetween, resolveFigure, type Figure, type Points, type Pt } from '@/lib/figures/geom';
import { FAMILIES, assignAll, familyOf, figureSpec, shownFigureSpec } from '@/lib/figures/v2';
import { CUE_DATA } from '@/lib/cues';
import { ExerciseCues } from '@/components/ExerciseCues';

const root = path.join(__dirname, '..');
/** Wyjątki linii 1.1 (scalenie main 28.10.2026): wpis recenzji 1.0 nie pasuje do rysunku 1.1 albo go nie ma — runtime ukrywa (fail-closed), pilnuje tego tests/recenzja-wyjatki-1-1.test.ts. */
const WYJ: { v1: string[]; v2: string[] } = JSON.parse(fs.readFileSync(path.join(root, 'tests/recenzja-wyjatki-1-1.json'), 'utf8'));
type Entry = { rodzina: string; werdykt: 'wyswietlana' | 'zastapiona' | 'ukryta'; data: string; kto: string; sha: string; uwagi?: string; wada?: string; poprawka?: string };
type V2Entry = { werdykt: 'wyswietlana'; data: string; kto: string; sha: string; liczba: number; uwagi?: string };
const REC_FILE = path.join(root, 'docs/research/figury-recenzja.json');
const REC: { v1: Record<string, Entry>; v2: Record<string, V2Entry> } = fs.existsSync(REC_FILE) ? JSON.parse(fs.readFileSync(REC_FILE, 'utf8')) : { v1: {}, v2: {} };
/** Bieżące skróty danych (figura v1 + wskazówki; rig v2) liczone przez generator pliku runtime — ten sam wzór, którego używa przepuszczanie figur. */
let NOW: { v1: Record<string, string>; v2: Record<string, string> } = { v1: {}, v2: {} };
try { NOW = JSON.parse(execFileSync('node', [path.join(root, 'scripts/zrodla-runtime.mjs'), '--skroty'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })); } catch { /* brak skrótów = test zapisu czerwony */ }
const SHOWN = (e?: Entry) => !!e && (e.werdykt === 'wyswietlana' || e.werdykt === 'zastapiona');
const lib = (key: string) => ({ lib: true as const, libKey: key });

describe('zapis recenzji (docs/research/figury-recenzja.json)', () => {
  test('każda figura v1 z danych ma wpis: rodzina (jak w figurach v2), werdykt, data, kto, skrót 12 znaków; ukryta — wada i proponowana poprawka', () => {
    expect(Object.keys(NOW.v1).length).toBeGreaterThanOrEqual(70);
    for (const k of Object.keys(NOW.v1)) expect([k, !!REC.v1[k]]).toEqual([k, true]);
    for (const [k, e] of Object.entries(REC.v1)) {
      expect([k, ['wyswietlana', 'zastapiona', 'ukryta'].includes(e.werdykt), /^\d{4}-\d\d-\d\d$/.test(e.data), e.kto.length > 10, /^[0-9a-f]{12}$/.test(e.sha), e.rodzina.length > 1]).toEqual([k, true, true, true, true, true]);
      expect([k, e.rodzina]).toEqual([k, familyOf(k)]); /* rodzina = przypisanie ćwiczenia w figurach v2 (lib/figures/v2/families.ts) */
      if (e.werdykt === 'ukryta') expect([k, (e.wada ?? '').length > 20, (e.poprawka ?? '').length > 20]).toEqual([k, true, true]);
    }
  });
  test('wyświetlana albo zastąpiona ⇒ skrót recenzji = skrót bieżących danych figury i wskazówek (zmiana bez nowej recenzji czerwieni test)', () => {
    for (const [k, e] of Object.entries(REC.v1)) if (SHOWN(e) && !WYJ.v1.includes(k)) expect([k, e.sha]).toEqual([k, NOW.v1[k]]);
  });
  test('plik runtime: figury = tylko wpisy wyświetlane/zastąpione z aktualnym skrótem; ukryte na liście otwartej (nie renderują się)', () => {
    const ok = Object.keys(NOW.v1).filter(k => SHOWN(REC.v1[k]) && REC.v1[k].sha === NOW.v1[k] && !CUE_DATA.hidden.includes(k)); /* karta ukryta po recenzji treści — bez figury (M1-audytor-generalny-038, 28.10.2026) */
    expect(Object.keys(FIG_DATA.exercises).sort()).toEqual(ok.sort());
    for (const [k, e] of Object.entries(REC.v1)) if (e.werdykt === 'ukryta') { expect([k, FIG_DATA.open.includes(k), figureByKey(k)]).toEqual([k, true, null]); }
  });
  test('„zastąpiona” tylko tam, gdzie wyświetla się figura v2 (gotowa rodzina); „wyświetlana” — tam, gdzie v2 nie ma', () => {
    for (const [k, e] of Object.entries(REC.v1)) {
      if (e.werdykt === 'zastapiona') expect([k, !!figureSpec(k)]).toEqual([k, true]);
      if (e.werdykt === 'wyswietlana') expect([k, !!shownFigureSpec(k)]).toEqual([k, false]); /* rysowana figura v2 wyklucza v1 (rodzina v2 bez aktualnej recenzji nie jest rysowana — wtedy zostaje figura v1 z wpisem) */
    }
  });
  test('rodzina v2 „ready” ⇒ wpis recenzji z bieżącym skrótem rigu i liczbą ćwiczeń z chwili recenzji', () => {
    const all = assignAll();
    for (const f of FAMILIES.filter(x => x.status === 'ready' && !WYJ.v2.includes(x.id))) {
      const e = REC.v2[f.id]; expect([f.id, !!e]).toEqual([f.id, true]);
      const n = Object.values(all).filter(x => x === f.id).length;
      expect([f.id, e.werdykt, e.sha, e.liczba, /^\d{4}-\d\d-\d\d$/.test(e.data)]).toEqual([f.id, 'wyswietlana', NOW.v2[f.id], n, true]);
    }
  });
  test('skrót v2 = sha256 tekstu rigu rodziny, wspólnego modułu rigów i wariantów (ten sam wzór w skrypcie i w teście)', () => {
    const RIG: Record<string, string> = { squat: 'squat.ts', bench_press: 'benchPress.ts', hinge: 'hinge.ts' };
    for (const f of FAMILIES.filter(x => x.status === 'ready')) {
      const txt = [RIG[f.id] ? 'lib/figures/v2/rigs/' + RIG[f.id] : `lib/figures/v2/poses/${f.id}.json` /* rodzina z danych pozy */, 'lib/figures/v2/rigs/common.ts', 'lib/figures/v2/variants.ts'].map(p => fs.readFileSync(path.join(root, p), 'utf8')).join('\n');
      expect([f.id, createHash('sha256').update(txt).digest('hex').slice(0, 12)]).toEqual([f.id, NOW.v2[f.id]]);
    }
  });
  test('generator: figura zmieniona po recenzji (inny skrót) wypada z pliku runtime na listę otwartą', () => {
    const code = `import { buildFigures, recenzja } from ${JSON.stringify(path.join(root, 'scripts/zrodla-runtime.mjs'))};
      import { readFileSync } from 'node:fs';
      const full = JSON.parse(readFileSync(${JSON.stringify(path.join(root, 'data/zrodla/figures.json'))}, 'utf8'));
      const k = 'Barbell Curl'; full.exercises[k].frames[1].p.el += 5;
      const out = buildFigures(full, recenzja());
      console.log(JSON.stringify({ has: k in out.exercises, open: out.open.includes(k) }));`;
    expect(JSON.parse(execFileSync('node', ['--input-type=module', '-e', code], { encoding: 'utf8' }))).toEqual({ has: false, open: true });
  });
});

describe('ekran: figura ukryta po recenzji — sekcja „Technika” bez rysunku, wskazówki zostają', () => {
  test.each(['Push Press', 'Pendlay Row'])('%s', k => {
    expect(REC.v1[k].werdykt).toBe('ukryta');
    render(<ExerciseCues exercise={lib(k)} initialOpen />);
    expect(screen.queryByTestId('exercise-figure')).toBeNull();
    expect(screen.queryByTestId('exercise-figure-v2')).toBeNull();
    expect(screen.getByRole('header', { name: 'Ruch' })).toBeTruthy();
    expect(CUE_DATA.exercises[k]).toBeTruthy();
  });
  test('figura z recenzją się renderuje (Pull Up, Overhead Press (sztanga))', () => {
    for (const k of ['Pull Up', 'Overhead Press (sztanga)']) { render(<ExerciseCues exercise={lib(k)} initialOpen />); expect([k, screen.getAllByTestId('exercise-figure').length > 0]).toEqual([k, true]); }
  });
});

/* ---------- Regresja: wady ruchu z recenzji 27.10.2026 (liczby z silnika; „było” = dane sprzed poprawki) ---------- */
/* Karta ukryta po recenzji treści (M1-audytor-generalny-038, 28.10.2026) nie ma figury w runtime — regresja geometrii liczona na pełnych danych figury (data/zrodla/figures.json). */
const FULL_FIG = JSON.parse(fs.readFileSync(path.join(root, 'data/zrodla/figures.json'), 'utf8')).exercises;
const fig = (k: string) => { const f = figureByKey(k) ?? (CUE_DATA.hidden.includes(k) ? resolveFigure(FULL_FIG, k) : null); if (!f) throw new Error(`brak figury ${k}`); return f; };
/** Wszystkie pozy animacji: 21 chwil każdego przejścia między pozycjami kluczowymi. */
const all = (f: Figure): Points[] => { const out: Points[] = []; for (let i = 0; i + 1 < f.frames.length; i++) for (let s = 0; s <= 20; s++) out.push(poseBetween(f, i, i + 1, s / 20).P); return out; };
const d = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const lineDist = (q: Pt, A: Pt, B: Pt) => { const L = d(A, B); return L < 1e-9 ? d(q, A) : Math.abs((B[0] - A[0]) * (A[1] - q[1]) - (A[0] - q[0]) * (B[1] - A[1])) / L; };
/** Odchylenie toru punktu od prostej pozycja wyjściowa → końcowa. */
const arc = (f: Figure, p: string) => { const A = framePoints(f, 0)[p], B = framePoints(f, f.frames.length - 1)[p]; return Math.max(...all(f).map(P => lineDist(P[p], A, B))); };
/** Największe przesunięcie punktu (podpory) od położenia w pozycji wyjściowej. */
const slide = (f: Figure, p: string) => { const A = framePoints(f, 0)[p]; return Math.max(...all(f).map(P => d(P[p], A))); };
const r1 = (v: number) => Math.round(v * 10) / 10;

describe('regresja: wady ruchu figur v1 z recenzji bramki 4 (27.10.2026)', () => {
  test.each(['Pull Up', 'Chin Up', 'Neutral Grip Pull Up'])('%s — bez bujania (pu.noSwing): biodro pod drążkiem, rozrzut x ≤ 10 j. (było 21,6–22,2)', k => {
    const xs = all(fig(k)).map(P => P.hip[0]); const r = Math.max(...xs) - Math.min(...xs);
    expect([k, r <= 10, r1(r)]).toEqual([k, true, r1(r)]);
  });
  test('Lat Pulldown — drążek w dół przed twarzą (lpd.pull): odchylenie toru dłoni od prostej ≤ 5 j. (było 18,9)', () => {
    const a = arc(fig('Lat Pulldown'), 'hand'); expect([a <= 5, r1(a)]).toEqual([true, r1(a)]);
  });
  test('Overhead Press (sztanga) — gryf prosto w górę (ohp.tall): nie wybiega przed linię startu o więcej niż 1 j. (było +8) i mija twarz (≥ 7 j. od środka głowy poniżej jej czubka)', () => {
    const f = fig('Overhead Press (sztanga)'); const x0 = Math.max(framePoints(f, 0).hand[0], framePoints(f, f.frames.length - 1).hand[0]);
    for (const P of all(f)) { expect([r1(P.hand[0] - x0), P.hand[0] - x0 <= 1]).toEqual([r1(P.hand[0] - x0), true]); if (P.hand[1] < P.head[1] + 6.5) expect(d(P.hand, P.head)).toBeGreaterThanOrEqual(7); }
  });
  test.each(['Overhead Press (hantle)', 'Seated Shoulder Press (hantle)', 'Wyciskanie nad głowę (linki)'])('%s — ciężar prosto w górę: odchylenie toru dłoni ≤ 4 j. (było 10,5–10,9)', k => {
    const a = arc(fig(k), 'hand'); expect([k, a <= 4, r1(a)]).toEqual([k, true, r1(a)]);
  });
  test.each(['Push Up', 'Incline Push Up'])('%s — dłonie w miejscu (podpora): przesunięcie ≤ 2,5 j. (było 5,7–6)', k => {
    const s = slide(fig(k), 'hand'); expect([k, s <= 2.5, r1(s)]).toEqual([k, true, r1(s)]);
  });
  test('Machine Chest Press — uchwyt po prostej prowadnicy: odchylenie toru ≤ 3 j. (było 9,3)', () => {
    const a = arc(fig('Machine Chest Press'), 'hand'); expect([a <= 3, r1(a)]).toEqual([true, r1(a)]);
  });
  test.each(['Seated Cable Row', 'Wiosłowanie na linkach (siedząc)'])('%s — linka poziomo od bloczka do uchwytu w całym ruchu: ≤ 5° (było 34,5°)', k => {
    const f = fig(k); const c = f.props.find(p => p.k === 'cable') as { from: Pt };
    for (const P of all(f)) { const a = Math.abs(Math.atan2(P.hand[1] - c.from[1], c.from[0] - P.hand[0]) * 180 / Math.PI); expect([k, a <= 5, r1(a)]).toEqual([k, true, r1(a)]); }
  });
  test.each(['Hip Thrust (sztanga)', 'Hip Thrust (hantel)'])('%s — dłonie przytrzymują ciężar (ht.hold): dłoń ≤ 2 j. od środka ciężaru (było do 20)', k => {
    const f = fig(k); const pr = f.props.find(p => p.k === 'plate' || p.k === 'db') as { tb: Pt };
    for (let i = 0; i + 1 < f.frames.length; i++) for (let s = 0; s <= 20; s++) {
      const { p, P } = poseBetween(f, i, i + 1, s / 20); const t = (p as { t: number }).t * Math.PI / 180;
      const c: Pt = [P.hip[0] + Math.cos(t) * pr.tb[0] + Math.cos(t - Math.PI / 2) * pr.tb[1], P.hip[1] + Math.sin(t) * pr.tb[0] + Math.sin(t - Math.PI / 2) * pr.tb[1]];
      expect([k, d(P.hand, c) <= 2, r1(d(P.hand, c))]).toEqual([k, true, r1(d(P.hand, c))]);
    }
  });
  test('Triceps Dips (ławka) — pięty w miejscu na podłodze (≤ 3 j., było 9,7); biodra przy krawędzi ławki (1–10 j. przed nią)', () => {
    const f = fig('Triceps Dips (ławka)'); const s = slide(f, 'heel'); expect([s <= 3, r1(s)]).toEqual([true, r1(s)]);
    for (const i of [0, f.frames.length - 1]) { const x = framePoints(f, i).hip[0]; expect([i, x >= 1 && x <= 10, r1(x)]).toEqual([i, true, r1(x)]); }
  });
  test('Leg Press — platforma jedzie prostopadle do swojej powierzchni (wzdłuż prowadnicy), stopa płasko na platformie (było: 36° odchyłki)', () => {
    const f = fig('Leg Press'); const pl = f.props.find(p => p.k === 'plank') as { ang: number };
    const A = framePoints(f, 0).toe, B = framePoints(f, f.frames.length - 1).toe; const dir = Math.atan2(B[1] - A[1], B[0] - A[0]) * 180 / Math.PI;
    const off = Math.abs((((dir - (pl.ang - 270)) % 360) + 540) % 360 - 180); expect([off <= 5, r1(off)]).toEqual([true, r1(off)]);
    for (const fr of f.frames) expect((fr.p as { ft: number }).ft).toBe(pl.ang);
  });
  test('Bulgarian Split Squat (hantle) — tylna stopa na ławce przez cały ruch (bss.setup): przesunięcie ≤ 2 j. (było 7,6)', () => {
    const s = slide(fig('Bulgarian Split Squat (hantle)'), 'toe2'); expect([s <= 2, r1(s)]).toEqual([true, r1(s)]);
  });
  test('Step Up — stopa nogi zakrocznej nie przechodzi przez skrzynię (było 6 j. w środku)', () => {
    const f = fig('Step Up'); const b = f.props.find(p => p.k === 'rect') as { x: number; y: number; w: number; h: number };
    for (const P of all(f)) for (const [n, q] of Object.entries(P)) { if (n === 'hip') continue; const inside = Math.min(q[0] - b.x, b.x + b.w - q[0], q[1] - b.y, b.y + b.h - q[1]); expect([n, inside <= 1, r1(inside)]).toEqual([n, true, r1(inside)]); }
  });
  test('niezmiennik wszystkich wyświetlanych figur v1: punkt stały we wszystkich pozach kluczowych (podpora) nie ślizga się w pozach pośrednich o więcej niż 3,5 j.; żaden punkt ciała nie wchodzi w ławkę ani skrzynię głębiej niż 2 j.', () => {
    const bad: string[] = [];
    for (const k of Object.keys(FIG_DATA.exercises)) {
      const f = fig(k); if (f.frames.length < 2) continue;
      const K = f.frames.map((_, i) => framePoints(f, i));
      for (const p of ['toe', 'heel', 'toe2', 'heel2', 'hand', 'hand2', 'knee', 'knee2']) {
        if (!K[0][p] || !K.every(Q => d(Q[p], K[0][p]) < 1.5)) continue;
        const s = slide(f, p); if (s > 3.5) bad.push(`${k}.${p} ślizg ${r1(s)}`);
      }
      for (const b of f.props.filter(x => x.k === 'rect') as { x: number; y: number; w: number; h: number }[]) for (const P of all(f)) for (const [n, q] of Object.entries(P)) {
        if (n === 'hip') continue; const inside = Math.min(q[0] - b.x, b.x + b.w - q[0], q[1] - b.y, b.y + b.h - q[1]); if (inside > 2) bad.push(`${k}.${n} w przyrządzie ${r1(inside)}`);
      }
    }
    expect([...new Set(bad)]).toEqual([]);
  });
  test.each(['Lunges (hantle)', 'Walking Lunges'])('%s — krok w przód: przednia stopa przenoszona w powietrzu, nie sunie po podłodze (było 7,5 j.)', k => {
    const f = fig(k); const st = framePoints(f, 0).toe, en = framePoints(f, f.frames.length - 1).toe;
    for (const P of all(f)) if (Math.min(P.toe[1], P.heel[1]) < 1.5) { const g = Math.min(Math.abs(P.toe[0] - st[0]), Math.abs(P.toe[0] - en[0])); expect([k, g <= 2, r1(g)]).toEqual([k, true, r1(g)]); }
  });
});
