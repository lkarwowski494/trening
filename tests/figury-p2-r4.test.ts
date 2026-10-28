/*
 * Poprawki p2, runda 4 (recenzja niezależna 27.10.2026: docs/przekazanie/notatki/recenzje-1-1/ponowne/p2-r3.md, B3, B4, U-H1 i uwaga o podglądzie).
 *   1. B3: Leg Press (pokazywany tylko z boku) nie ma wiersza „kolana do środka” — z boku różnił się od pozy poprawnej o 0,4 cm; tekst błędu na karcie zostaje (jak w Single Leg Press).
 *   2. B4: Bulgarian Split Squat ×3: przednie kolano w dole na z ≈ +4…+5 cm (do środka od kostki, ale przed osią ciała i nie dalej niż tylne kolano), bez przenikania ud.
 *   3. U-H1: dźwignia maszyny z przodu: decyzja „rysować / nie” jest stała w całym ruchu i we wszystkich wierszach ćwiczenia (Hack Squat nie miga).
 *   4. Podgląd (v2-validate.mjs, htmlPodgladu) rysuje te same widoki co aplikacja (viewsOf): suwnice tylko z boku.
 * Strażnik przenikania udo × udo / goleń × goleń (tests/figury-p2-r3.test.ts) ma tolerancję 0 cm (TOL_NOGI_CM).
 */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import { keyframeFrame, dataShapes, viewsOf, dzwigniaPrzezGlowe, dzwigniaDotykaGlowy, type PoseData } from '@/lib/figures/v2';
import { MIN_ROZNICA_BLEDU_W_WIDOKU_CM, roznicaBledu } from './figury-p2-r2.test';
import { TOL_NOGI_CM } from './figury-p2-r3.test';

jest.setTimeout(120000);
const ROOT = path.join(__dirname, '..');
const POSES = path.join(ROOT, 'lib/figures/v2/poses');
type PoseFile = { rodzina: string; cwiczenia: Record<string, PoseData> };
const pliki = fs.readdirSync(POSES).filter(f => f.endsWith('.json')).sort().map(f => JSON.parse(fs.readFileSync(path.join(POSES, f), 'utf8')) as PoseFile);
const dane = (rodzina: string, cw: string): PoseData => pliki.find(f => f.rodzina === rodzina)!.cwiczenia[cw];
const GRID = Array.from({ length: 21 }, (_, i) => i / 20);

describe('1. B3: Leg Press bez wiersza „kolana do środka” (widok tylko z boku), tekst błędu na karcie zostaje', () => {
  const d = dane('leg_machine', 'Leg Press');
  test('poza Leg Press nie ma wiersza sq.mis.kneesIn (jak Single Leg Press)', () => { expect(d.bledy.map(b => b.cue)).not.toContain('sq.mis.kneesIn'); expect(dane('leg_machine', 'Single Leg Press').bledy).toHaveLength(0); });
  test('karta Leg Press nadal ma tekst błędu „kolana do środka”', () => { const k = JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/cues/data.json'), 'utf8')) as { exercises: Record<string, { mistakes: { c: string }[] }> }; expect(k.exercises['Leg Press'].mistakes.map(m => m.c)).toContain('sq.mis.kneesIn'); });
  test('wszystkie wiersze błędów Leg Press (jeśli są) różnią się ≥ konwencji w pokazywanym widoku — bez wyjątku', () => {
    expect(viewsOf('Leg Press', 'leg_machine')).toEqual(['side']);
    d.bledy.forEach((_, i) => expect(roznicaBledu(d, i, 'side')).toBeGreaterThanOrEqual(MIN_ROZNICA_BLEDU_W_WIDOKU_CM));
  });
  test('żadne ćwiczenie nie ma wiersza błędu niewidocznego w swoich widokach (viewsOf) — lista wyjątków nie zawiera suwnic', () => {
    const src = fs.readFileSync(path.join(__dirname, 'figury-p2-r2.test.ts'), 'utf8'); expect(src).not.toMatch(/'leg_machine\/Leg Press\//);
    for (const f of pliki) for (const [cw, p] of Object.entries(f.cwiczenia)) if (['Leg Press', 'Single Leg Press'].includes(cw)) p.bledy.forEach((_, i) => expect([cw, Math.max(...viewsOf(cw, f.rodzina as never).map(v => roznicaBledu(p, i, v))) >= MIN_ROZNICA_BLEDU_W_WIDOKU_CM]).toEqual([cw, true]));
  });
});

describe('2. B4: Bulgarian Split Squat ×3 — przednie kolano w dole na z ≈ +4…+5, bez przenikania ud', () => {
  test.each(['Bulgarian Split Squat (hantle)', 'Bulgarian Split Squat (sztanga)', 'Smith Machine Bulgarian Split Squat'])('%s', cw => {
    const d = dane('lunge', cw); const i = d.bledy.findIndex(b => b.cue === 'lunge.mis.kneeIn'); expect(i).toBeGreaterThanOrEqual(0);
    const dol = keyframeFrame(d, 1, i).sk; const ok = keyframeFrame(d, 1).sk;
    const zF = dol.legs.R.knee[2]; expect(zF).toBeGreaterThanOrEqual(3.5); expect(zF).toBeLessThanOrEqual(6); /* do środka od kostki (z = 10), ale przed osią ciała */
    expect(zF).toBeGreaterThan(dol.legs.L.knee[2]); /* nie dalej niż tylne kolano */
    expect(ok.legs.R.knee[2] - zF).toBeGreaterThanOrEqual(5); /* kolano wyraźnie przesunięte względem pozy poprawnej */
    for (const u of GRID) { const k = keyframeFrame(d, u, i).sk.legs.R.knee[2]; expect([u, k > 0]).toEqual([u, true]); }
    expect(roznicaBledu(d, i, 'front')).toBeGreaterThanOrEqual(MIN_ROZNICA_BLEDU_W_WIDOKU_CM);
  });
  test('strażnik przenikania ma tolerancję 0 cm', () => { expect(TOL_NOGI_CM).toBe(0); });
});

describe('3. U-H1: dźwignia maszyny z przodu — decyzja stała w całym ruchu', () => {
  const lever = (d: PoseData, u: number, w?: number) => dataShapes(d, u, 'front', w).some(s => s.id === 'landmine');
  const cwiczenia = Object.keys(pliki.find(f => f.rodzina === 'leg_machine')!.cwiczenia);
  test.each(cwiczenia)('%s: dźwignia z przodu rysowana we wszystkich klatkach i wierszach albo w żadnej', cw => {
    const d = dane('leg_machine', cw); const v = new Set<boolean>(); for (const w of [undefined, ...d.bledy.map((_, i) => i)]) for (const u of GRID) v.add(lever(d, u, w));
    expect([cw, v.size]).toEqual([cw, 1]);
  });
  test('Hack Squat: z przodu bez dźwigni (przechodziłaby przez głowę w części ruchu), z boku dźwignia jest', () => {
    const d = dane('leg_machine', 'Hack Squat'); for (const u of GRID) { expect(lever(d, u)).toBe(false); expect(dataShapes(d, u, 'side').some(s => s.id === 'landmine')).toBe(true); }
  });
});

describe('3b. dzwigniaPrzezGlowe / dzwigniaDotykaGlowy', () => {
  test('Hack Squat i Lying Machine Squat: dźwignia przechodzi przez głowę w części ruchu → ukryta w całym', () => { for (const cw of ['Hack Squat', 'Lying Machine Squat']) expect([cw, dzwigniaPrzezGlowe(dane('leg_machine', cw))]).toEqual([cw, true]); });
  test('rodzina spoza DZWIGNIA_BEZ_GLOWY: zawsze false', () => { expect(dzwigniaPrzezGlowe(dane('lunge', 'Split Squat'))).toBe(false); });
  test('Hack Squat: dźwignia dotyka głowy w części klatek, nie we wszystkich (stąd dawne miganie)', () => {
    const d = dane('leg_machine', 'Hack Squat'); const t = GRID.map(u => { const f = keyframeFrame(d, u); return dzwigniaDotykaGlowy(f.props, f.sk); });
    expect(t.some(Boolean)).toBe(true); expect(t.every(Boolean)).toBe(false);
  });
});

describe('4. podgląd rysuje widoki z aplikacji (viewsOf)', () => {
  const widoki = (cw: string): string[] => JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', `
    import fs from 'node:fs'; import path from 'node:path';
    const V = await import(${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-validate.mjs'))});
    const f = JSON.parse(fs.readFileSync(${JSON.stringify(path.join(POSES, 'leg_machine.json'))}, 'utf8'));
    const h = V.htmlPodgladu(f.cwiczenia[${JSON.stringify(cw)}], 'light');
    const J = await import(${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-jakosc.mjs'))});
    console.log(JSON.stringify([...new Set([...h.html.matchAll(/data-widok="(\\w+)"/g)].map((m) => m[1])), ...J.klatkiZHtml(h.html).uwagi]));
  `], { cwd: ROOT, env: { PATH: process.env.PATH ?? '' } as unknown as NodeJS.ProcessEnv, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
  test.each([['Leg Press'], ['Single Leg Press']])('%s: podgląd tylko z boku, bez uwag o niejednolitych klatkach (klatkiZHtml)', cw => { expect(widoki(cw)).toEqual(['side']); });
  test.each([['Hack Squat'], ['Pendulum Squat']])('%s: podgląd z boku i z przodu', cw => { expect(widoki(cw)).toEqual(['side', 'front']); });
});
