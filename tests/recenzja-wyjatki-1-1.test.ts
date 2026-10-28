/*
 * Wyjątki bramki 4 w linii 1.1 (scalenie main 28.10.2026; CLAUDE.md „Animacje i karty ćwiczeń — audyt dogłębny”): tests/recenzja-wyjatki-1-1.json wymienia rysunki i zestawy
 * wskazówek, których wpis recenzji z 1.0 nie pasuje do 1.1 albo nie istnieje. Strażnik pilnuje trzech rzeczy: (1) wyjątek jest prawdziwy (skrót niezgodny albo brak wpisu —
 * po nowej recenzji pozycja musi zniknąć z listy), (2) pozycja jest NIEWIDOCZNA w aplikacji (fail-closed: lista v2 i figury v1 w lib/figures/data.json, lista general w lib/cues/data.json),
 * (3) żadna rodzina v2 rysowana w aplikacji nie jest na liście wyjątków. Rodzaje (docs/20): dane (wykaz), niezmienniki (wyjątek ⇒ ukryte), regresja (wyjątek nieaktualny — czerwony).
 */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import { FIG_DATA } from '@/lib/figures';
import { CUE_DATA } from '@/lib/cues';
import { FAMILIES, assignAll, figureSpec, shownFigureSpec } from '@/lib/figures/v2';
import { familyReviewed } from '@/lib/figures/v2/figure';

const root = path.join(__dirname, '..');
const WYJ = JSON.parse(fs.readFileSync(path.join(root, 'tests/recenzja-wyjatki-1-1.json'), 'utf8')) as { powod: string; v1: string[]; v2: string[]; zestawy_zmienione: string[]; zestawy_bez_wpisu: string[] };
const REC = JSON.parse(fs.readFileSync(path.join(root, 'docs/research/figury-recenzja.json'), 'utf8')) as { v1: Record<string, { sha: string }>; v2: Record<string, { sha: string }>; zestawy?: Record<string, { sha: string }> };
const NOW = JSON.parse(execFileSync('node', [path.join(root, 'scripts/zrodla-runtime.mjs'), '--skroty'], { encoding: 'utf8' })) as { v1: Record<string, string>; v2: Record<string, string>; zestawy: Record<string, string> };

describe('wyjątki bramki 4 linii 1.1 (recenzja-wyjatki-1-1.json)', () => {
  test('powód zapisany; listy bez duplikatów', () => {
    expect(WYJ.powod).toMatch(/scalenie main 28\.10\.2026/);
    for (const l of [WYJ.v1, WYJ.v2, WYJ.zestawy_zmienione, WYJ.zestawy_bez_wpisu]) expect(new Set(l).size).toBe(l.length);
  });
  test('figury v1: wyjątek = wpis ze skrótem niezgodnym z bieżącym; figury nie ma w pliku runtime (nie renderuje się)', () => {
    for (const k of WYJ.v1) expect([k, !!REC.v1[k], REC.v1[k]?.sha !== NOW.v1[k], k in FIG_DATA.exercises]).toEqual([k, true, true, false]);
  });
  test('rodziny v2: wyjątek = brak wpisu albo skrót niezgodny; rodziny nie ma na liście rysowanych, a jej ćwiczenia nie mają pokazywanej figury', () => {
    const all = assignAll();
    for (const f of WYJ.v2) {
      expect([f, FAMILIES.some(x => x.id === f && x.status === 'ready'), !REC.v2[f] || REC.v2[f].sha !== NOW.v2[f], FIG_DATA.v2.includes(f)]).toEqual([f, true, true, false]);
      for (const [k, fam] of Object.entries(all)) if (fam === f) expect([k, shownFigureSpec(k)]).toEqual([k, null]);
    }
  });
  test('rodziny rysowane w aplikacji (lista v2) nie są wyjątkami i mają aktualny wpis', () => {
    for (const f of FIG_DATA.v2) expect([f, WYJ.v2.includes(f), REC.v2[f]?.sha === NOW.v2[f]]).toEqual([f, false, true]);
  });
  test('zestawy ogólne: zmienione po recenzji i bez wpisu — poza listą general (ekran ich nie pokazuje)', () => {
    for (const k of WYJ.zestawy_zmienione) expect([k, !!REC.zestawy?.[k], REC.zestawy?.[k]?.sha !== NOW.zestawy[k], CUE_DATA.general.includes(k)]).toEqual([k, true, true, false]);
    for (const k of WYJ.zestawy_bez_wpisu) expect([k, !!REC.zestawy?.[k], CUE_DATA.general.includes(k)]).toEqual([k, false, false]);
  });
  test('familyReviewed / shownFigureSpec: rodzina bez aktualnej recenzji — silnik liczy figurę (figureSpec), aplikacja jej nie pokazuje', () => {
    for (const f of WYJ.v2) expect([f, familyReviewed(f)]).toEqual([f, false]);
    expect(familyReviewed('rodzina_nieistniejaca')).toBe(false);
    expect(figureSpec('Back Squat')).not.toBeNull();
    expect(shownFigureSpec('Back Squat')).toBeNull();
  });
});

describe('generator (scripts/zrodla-runtime.mjs): lista rodzin v2 i figury „zastąpione” zależą od aktualnej recenzji', () => {
  const run = (mutate: string) => JSON.parse(execFileSync('node', ['--input-type=module', '-e', `import { buildFigures, rodzinyZAktualnaRecenzja, rodzinaSkrot, recenzja } from ${JSON.stringify(path.join(root, 'scripts/zrodla-runtime.mjs'))};
    import { readFileSync } from 'node:fs';
    const full = JSON.parse(readFileSync(${JSON.stringify(path.join(root, 'data/zrodla/figures.json'))}, 'utf8'));
    const rec = recenzja();
    ${mutate}
    const out = buildFigures(full, rec);
    console.log(JSON.stringify({ v2: out.v2, deadlift: 'Deadlift (sztanga)' in out.exercises, fam: rodzinyZAktualnaRecenzja(rec) }));`], { encoding: 'utf8' }));
  test('bieżący stan: brak rodzin z aktualnym wpisem — figury „zastąpione” (Deadlift (sztanga)) nie wracają jako v1', () => {
    expect(run('')).toEqual({ v2: [], deadlift: false, fam: [] });
  });
  test('wpis rodziny hinge z bieżącym skrótem: rodzina na liście, figura v1 „zastąpiona” zostaje w pliku runtime; zły skrót — rodzina znika', () => {
    expect(run("rec.v2.hinge = { ...rec.v2.hinge, werdykt: 'wyswietlana', sha: rodzinaSkrot('hinge') };")).toEqual({ v2: ['hinge'], deadlift: true, fam: ['hinge'] });
    expect(run("rec.v2.hinge = { ...rec.v2.hinge, werdykt: 'wyswietlana', sha: '000000000000' };").v2).toEqual([]);
    expect(run("rec.v2.hinge = { ...rec.v2.hinge, werdykt: 'ukryta', sha: rodzinaSkrot('hinge') };").v2).toEqual([]);
  });
});
