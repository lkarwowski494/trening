/*
 * L-095-A (decyzja właściciela 03.11.2026, docs/18; lekcja L-095 w docs/40): każde zlecenie pracy na gałęzi `badania/*` zawiera wynik `git log -1` tej gałęzi,
 * żeby stan zadań brać z gałęzi, nie z dokumentu planu. Mechanizm: brief w docs/przekazanie/notatki/linia-1-1/briefy/*.md, który wymienia gałąź `badania/<x>`,
 * podaje w tym samym wierszu, do 120 znaków za nazwą, skrót SHA jej głowy (7–8 znaków hex, co najmniej jedna cyfra) — wzór: `badania/g2-mobilnosc@10d8150a`.
 * Zakres strażnika: katalog BRIEFY (readdir, wszystkie *.md); briefy sprzed 03.11.2026 są wyjątkami z powodem w tests/briefy-badania-wyjatki.json
 * (wyjątek dla briefu, który już spełnia regułę, jest błędem — lista ma się kurczyć). Treść poza tym katalogiem nie jest objęta.
 */
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.join(__dirname, '..');
const BRIEFY = 'docs/przekazanie/notatki/linia-1-1/briefy';
const WYJATKI = 'tests/briefy-badania-wyjatki.json';
const GALAZ = /badania\/[\w.-]+/g;
const SKROT = /(?<![0-9A-Za-z])(?=[0-9a-f]*\d)[0-9a-f]{7,8}(?![0-9A-Za-z])/;
const ZASIEG = 120;

/** Gałęzie `badania/*` wymienione w briefie bez skrótu SHA w tym samym wierszu (do 120 znaków za nazwą): "wiersz:gałąź". */
export function galezieBezSkrotu(tresc: string): string[] {
  const out: string[] = [];
  tresc.split('\n').forEach((linia, i) => {
    for (const m of linia.matchAll(GALAZ)) {
      const za = linia.slice(m.index! + m[0].length, m.index! + m[0].length + ZASIEG);
      if (!SKROT.test(za)) out.push(`${i + 1}:${m[0]}`);
    }
  });
  return out;
}

const briefy = (): Record<string, string> => Object.fromEntries(fs.readdirSync(path.join(ROOT, BRIEFY)).filter(f => f.endsWith('.md'))
  .map(f => [f, fs.readFileSync(path.join(ROOT, BRIEFY, f), 'utf8')]));
const wyjatki = (): { plik: string; powod: string }[] => JSON.parse(fs.readFileSync(path.join(ROOT, WYJATKI), 'utf8'));

/** Problemy: brief z gałęzią bez SHA i bez wyjątku; wyjątek bez powodu, bez pliku albo zbędny. */
export function problemyBriefow(b: Record<string, string>, w: { plik: string; powod: string }[]): string[] {
  const out: string[] = [];
  const wyj = new Map(w.map(x => [x.plik, x]));
  for (const [f, t] of Object.entries(b)) {
    const brak = galezieBezSkrotu(t);
    if (brak.length && !wyj.has(f)) out.push(`${f}: gałąź bez skrótu SHA (${brak.join(', ')})`);
    if (!brak.length && wyj.has(f)) out.push(`${f}: wyjątek zbędny — brief spełnia regułę`);
  }
  for (const x of w) {
    if (!x.powod?.trim()) out.push(`${x.plik}: wyjątek bez powodu`);
    if (!(x.plik in b)) out.push(`${x.plik}: wyjątek dla nieistniejącego briefu`);
  }
  return out;
}

describe('L-095-A: briefy zleceń na gałęzie badania/* podają skrót SHA głowy gałęzi', () => {
  test('briefy w linia-1-1/briefy: gałąź badania/<x> ma skrót SHA w wierszu albo wyjątek z powodem', () => {
    expect(problemyBriefow(briefy(), wyjatki())).toEqual([]);
  });
  test('wzorzec rozpoznaje: gałąź z SHA, bez SHA, SHA zbyt daleko, słowo z liter a–f bez cyfry, origin/ i kilka gałęzi w wierszu', () => {
    expect(galezieBezSkrotu('Źródła: `origin/badania/g2-mobilnosc@10d8150a` oraz badania/g3 (2a32209f)')).toEqual([]);
    expect(galezieBezSkrotu('gałąź badania/g2-mobilnosc, wynik git log -1: e40da114')).toEqual([]);
    expect(galezieBezSkrotu('gałąź badania/g2-mobilnosc bez skrótu')).toEqual(['1:badania/g2-mobilnosc']);
    expect(galezieBezSkrotu(`badania/g4 ${'x'.repeat(130)} 10d8150a`)).toEqual(['1:badania/g4']);
    expect(galezieBezSkrotu('badania/g5 decaded added facade')).toEqual(['1:badania/g5']);
    expect(galezieBezSkrotu('badania/g1 (e40da114) i badania/g6 bez')).toEqual(['1:badania/g6']);
    expect(galezieBezSkrotu('brak gałęzi, tylko pliki /home/user/wt-obow/docs')).toEqual([]);
  });
  test('gałąź z wcześniejszymi zmianami względem main (L-080): stary brief z wyjątkiem przechodzi, nowy brief bez SHA — nie; zbędny wyjątek — błąd', () => {
    const stary = 'Źródła: gałąź `origin/badania/g2-mobilnosc` (git show)';
    const nowy = 'Źródła: gałąź `origin/badania/g3-x` (git show)';
    const ok = 'Źródła: gałąź `origin/badania/g3-x@2a32209f`';
    const w = [{ plik: 'stary.md', powod: 'brief z 02.11.2026, sprzed reguły' }];
    expect(problemyBriefow({ 'stary.md': stary }, w)).toEqual([]);
    expect(problemyBriefow({ 'stary.md': stary, 'nowy.md': nowy }, w)).toEqual(['nowy.md: gałąź bez skrótu SHA (1:badania/g3-x)']);
    expect(problemyBriefow({ 'stary.md': ok }, w)).toEqual(['stary.md: wyjątek zbędny — brief spełnia regułę']);
    expect(problemyBriefow({}, [{ plik: 'brak.md', powod: '' }])).toEqual(['brak.md: wyjątek bez powodu', 'brak.md: wyjątek dla nieistniejącego briefu']);
  });
});
