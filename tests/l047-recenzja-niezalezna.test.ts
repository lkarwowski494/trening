/*
 * L-047 A (decyzja właściciela 28.10.2026, przekazana do M2 pętli 2 — audit/…/naprawy/przekazanie-M2-petla-2.md): recenzja niezależna obowiązkowa dla figur,
 * kart ćwiczeń i tekstów merytorycznych — wykonawca poprawki nie recenzuje własnej pracy. Strażnik zapisu recenzji (docs/research/figury-recenzja.json):
 * każdy wpis z werdyktem „wyswietlana” i datą od 28.10.2026 ma stan „zrecenzowana niezależnie…” oraz jawne pola `autor` i `recenzent`, różne od siebie;
 * „do recenzji niezależnej” przy „wyswietlana” to błąd. CLAUDE.md (sekcja „Animacje i karty ćwiczeń”) zapisuje regułę i wskazuje ten test.
 *
 * L-047-A (decyzja właściciela 03.11.2026, docs/18): plik wpisów recenzenta jako źródło prawdy dla `sha`. Recenzent zapisuje swoje wpisy w
 * `docs/research/recenzje/<partia>-r<N>.json` (format: docs/research/recenzje/README.md); wykonawca nie edytuje wpisów recenzji. Każdy wpis `karty`
 * z werdyktem „wyswietlana”, której nie ma na ZAMROŻONEJ LIŚCIE (tests/l047-lista-zamrozona.json, stan z 03.11.2026), ma w którymś pliku recenzenta
 * wpis o tym samym kluczu i identycznych `sha`, `werdykt`, `recenzent`. Lista zastąpiła próg daty (03.11.2026, decyzja koordynatora 1.1: data wpisu
 * przepuszczała wpisy z wcześniejszą datą dodane później i dawała się obejść datą): sekcja `zwolnione` (karty sprzed reguły) i `do_uzupelnienia`
 * (P1/P2 bez pliku recenzenta, z terminem). Lista tylko maleje: limity `maks_*`, karta z zgodnym wpisem w pliku musi zniknąć z listy, po terminie
 * `do_uzupelnienia` musi być pusta.
 * Zakres: lista plików = docs/research/recenzje/*.json (readdir poniżej), sekcja `karty`; lista kart zwolnionych = tests/l047-lista-zamrozona.json.
 */
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const OD = '2026-10-28';
type Wpis = { werdykt?: string; data?: string; stan?: string; autor?: string; recenzent?: string };

/** Problemy zapisu recenzji: [sekcja/klucz: opis]. */
export function problemyRecenzji(d: Record<string, unknown>): string[] {
  const out: string[] = [];
  for (const [sek, v] of Object.entries(d)) {
    if (!v || typeof v !== 'object' || Array.isArray(v)) continue;
    for (const [k, e] of Object.entries(v as Record<string, Wpis>)) {
      if (!e || typeof e !== 'object' || e.werdykt !== 'wyswietlana' || String(e.data ?? '') < OD) continue;
      const id = `${sek}/${k}`;
      if (!/^zrecenzowana niezależnie/.test(e.stan ?? '')) out.push(`${id}: stan bez „zrecenzowana niezależnie”`);
      if (/do recenzji niezależnej/.test(e.stan ?? '')) out.push(`${id}: „do recenzji niezależnej” przy „wyswietlana”`);
      if (!e.autor?.trim() || !e.recenzent?.trim()) out.push(`${id}: brak pola autor albo recenzent`);
      else if (e.autor.trim().toLowerCase() === e.recenzent.trim().toLowerCase()) out.push(`${id}: autor = recenzent`);
    }
  }
  return out;
}

const DIR_RECENZJE = 'docs/research/recenzje';
type WpisR = Wpis & { sha?: string };
type PlikR = { karty?: Record<string, WpisR> };
type Lista = { zwolnione: string[]; maks_zwolnione: number; do_uzupelnienia: { termin: string; maks: number; karty: string[] } };
const PUSTA: Lista = { zwolnione: [], maks_zwolnione: 0, do_uzupelnienia: { termin: '9999-12-31', maks: 0, karty: [] } };
const zgodny = (r: WpisR, e: WpisR) => r.sha === e.sha && r.werdykt === e.werdykt && r.recenzent === e.recenzent;

/** Problemy samej listy zamrożonej: tylko maleje, karty muszą istnieć i być „wyswietlana”, zgodny wpis w pliku = usuń z listy, termin. */
export function problemyListy(lista: Lista, karty: Record<string, WpisR>, pliki: Record<string, PlikR>, dzis: string): string[] {
  const out: string[] = [];
  if (lista.zwolnione.length > lista.maks_zwolnione) out.push(`zwolnione: ${lista.zwolnione.length} > maks ${lista.maks_zwolnione} (lista tylko maleje)`);
  if (lista.do_uzupelnienia.karty.length > lista.do_uzupelnienia.maks) out.push(`do_uzupelnienia: ${lista.do_uzupelnienia.karty.length} > maks ${lista.do_uzupelnienia.maks} (lista tylko maleje)`);
  const wszystkie = [...lista.zwolnione, ...lista.do_uzupelnienia.karty];
  for (const k of wszystkie) {
    if (wszystkie.indexOf(k) !== wszystkie.lastIndexOf(k)) out.push(`lista: ${k} dwa razy`);
    const e = karty[k];
    if (!e || e.werdykt !== 'wyswietlana') { out.push(`lista: ${k} nie jest kartą „wyswietlana” — usuń z listy`); continue; }
    if (Object.values(pliki).some(d => d.karty?.[k] && zgodny(d.karty[k], e))) out.push(`lista: ${k} ma zgodny wpis w pliku recenzenta — usuń z listy`);
  }
  if (lista.do_uzupelnienia.karty.length && dzis > lista.do_uzupelnienia.termin) out.push(`do_uzupelnienia: termin ${lista.do_uzupelnienia.termin} minął, zostało ${lista.do_uzupelnienia.karty.length} kart`);
  return [...new Set(out)];
}

/** Problemy zgodności wpisów `karty` z plikami recenzenta (L-047-A) oraz formatu samych plików recenzenta. */
export function problemySkrotow(karty: Record<string, WpisR>, pliki: Record<string, PlikR>, lista: Lista = PUSTA): string[] {
  const out: string[] = [];
  for (const [plik, d] of Object.entries(pliki)) {
    for (const [k, e] of Object.entries(d.karty ?? {})) {
      const id = `${plik}/${k}`;
      if (!/^[0-9a-f]{12}$/.test(e.sha ?? '')) out.push(`${id}: sha nie jest 12 znakami hex`);
      if (!e.werdykt?.trim() || !e.data?.trim()) out.push(`${id}: brak werdyktu albo daty`);
      if (!e.recenzent?.trim()) out.push(`${id}: brak pola recenzent`);
      else if (e.autor?.trim().toLowerCase() === e.recenzent.trim().toLowerCase()) out.push(`${id}: autor = recenzent`);
    }
  }
  const zamrozone = new Set([...lista.zwolnione, ...lista.do_uzupelnienia.karty]);
  for (const [k, e] of Object.entries(karty)) {
    if (!e || e.werdykt !== 'wyswietlana' || zamrozone.has(k)) continue;
    const kandydaci = Object.entries(pliki).filter(([, d]) => d.karty?.[k]);
    if (!kandydaci.length) { out.push(`karty/${k}: brak wpisu w ${DIR_RECENZJE}/*.json`); continue; }
    const ok = kandydaci.some(([, d]) => zgodny(d.karty![k], e));
    if (!ok) out.push(`karty/${k}: sha, werdykt albo recenzent różni się od wpisu w ${kandydaci.map(([p]) => p).join(', ')}`);
  }
  return out;
}

const wczytajListe = (): Lista => JSON.parse(read('tests/l047-lista-zamrozona.json'));
const wczytajPliki = (): Record<string, PlikR> => Object.fromEntries(
  fs.readdirSync(path.join(ROOT, DIR_RECENZJE)).filter(f => f.endsWith('.json')).map(f => [f, JSON.parse(read(`${DIR_RECENZJE}/${f}`)) as PlikR]));

describe('L-047 A: recenzja niezależna w zapisie recenzji', () => {
  test('docs/research/figury-recenzja.json: wpisy „wyswietlana” od 28.10.2026 mają recenzję niezależną (autor ≠ recenzent)', () => {
    expect(problemyRecenzji(JSON.parse(read('docs/research/figury-recenzja.json')))).toEqual([]);
  });
  test('strażnik potrafi paść: brak recenzenta, autor = recenzent, „do recenzji niezależnej”, stary wpis bez pól pomijany', () => {
    const d = { karty: {
      A: { werdykt: 'wyswietlana', data: '2026-10-28', stan: 'zrecenzowana niezależnie', autor: 'x' },
      B: { werdykt: 'wyswietlana', data: '2026-10-29', stan: 'zrecenzowana niezależnie', autor: 'rola 06', recenzent: 'Rola 06' },
      C: { werdykt: 'wyswietlana', data: '2026-10-28', stan: 'do recenzji niezależnej', autor: 'a', recenzent: 'b' },
      D: { werdykt: 'wyswietlana', data: '2026-10-27' },
      E: { werdykt: 'do poprawy', data: '2026-10-28' },
    } };
    expect(problemyRecenzji(d)).toEqual(['karty/A: brak pola autor albo recenzent', 'karty/B: autor = recenzent', 'karty/C: stan bez „zrecenzowana niezależnie”', 'karty/C: „do recenzji niezależnej” przy „wyswietlana”']);
  });
  test('CLAUDE.md: reguła „wykonawca nie recenzuje własnej pracy” wskazuje ten strażnik', () => {
    const c = read('CLAUDE.md');
    expect(c).toMatch(/nie recenzuje własnej pracy/); expect(c).toContain('tests/l047-recenzja-niezalezna.test.ts');
  });
  test('L-047-A: wpisy „wyswietlana” spoza zamrożonej listy mają zgodny wpis (sha, werdykt, recenzent) w pliku recenzenta docs/research/recenzje/*.json', () => {
    const d = JSON.parse(read('docs/research/figury-recenzja.json'));
    expect(problemySkrotow(d.karty, wczytajPliki(), wczytajListe())).toEqual([]);
  });
  test('L-047-A: zamrożona lista (03.11.2026) tylko maleje, nie ma martwych kart, a lista do_uzupelnienia jest przed terminem', () => {
    const d = JSON.parse(read('docs/research/figury-recenzja.json'));
    const l = wczytajListe();
    expect(problemyListy(l, d.karty, wczytajPliki(), new Date().toISOString().slice(0, 10))).toEqual([]);
    expect(l.maks_zwolnione).toBe(57); expect(l.do_uzupelnienia.maks).toBe(66);
  });
  test('L-047-A: strażnik pada: brak pliku recenzenta, sha przepisany przez wykonawcę, zły recenzent; karty z listy zamrożonej pomijane niezależnie od daty', () => {
    const w = (sha: string, data = '2026-11-04', recenzent = 'audytor') => ({ werdykt: 'wyswietlana', data, sha, recenzent, autor: 'programista' });
    const pliki: Record<string, PlikR> = { 'p2-r1.json': { karty: { B: w('bbbbbbbbbbbb'), C: w('cccccccccccc') } } };
    const lista: Lista = { ...PUSTA, zwolnione: ['D'] };
    const karty = { A: w('aaaaaaaaaaaa'), B: w('b0b0b0b0b0b0'), C: w('cccccccccccc', '2026-11-04', 'ktoś inny'), D: w('dddddddddddd', '2026-11-03'), E: { werdykt: 'do poprawy', data: '2026-11-05' } };
    expect(problemySkrotow(karty, pliki, lista)).toEqual([
      'karty/A: brak wpisu w docs/research/recenzje/*.json',
      'karty/B: sha, werdykt albo recenzent różni się od wpisu w p2-r1.json',
      'karty/C: sha, werdykt albo recenzent różni się od wpisu w p2-r1.json',
    ]);
  });
  test('L-047-A: strażnik listy pada: lista rośnie, martwa karta, zgodny wpis w pliku, minięty termin, duplikat', () => {
    const w = (sha: string) => ({ werdykt: 'wyswietlana', data: '2026-11-03', sha, recenzent: 'audytor' });
    const karty = { A: w('aaaaaaaaaaaa'), B: w('bbbbbbbbbbbb'), C: { werdykt: 'do poprawy' } as WpisR };
    const lista: Lista = { zwolnione: ['A', 'C'], maks_zwolnione: 1, do_uzupelnienia: { termin: '2026-11-10', maks: 1, karty: ['B', 'B'] } };
    expect(problemyListy(lista, karty, { 'p-r1.json': { karty: { B: w('bbbbbbbbbbbb') } } }, '2026-11-11')).toEqual([
      'zwolnione: 2 > maks 1 (lista tylko maleje)',
      'do_uzupelnienia: 2 > maks 1 (lista tylko maleje)',
      'lista: C nie jest kartą „wyswietlana” — usuń z listy',
      'lista: B dwa razy',
      'lista: B ma zgodny wpis w pliku recenzenta — usuń z listy',
      'do_uzupelnienia: termin 2026-11-10 minął, zostało 2 kart',
    ]);
    expect(problemyListy({ ...PUSTA, zwolnione: ['A'], maks_zwolnione: 1 }, karty, {}, '2099-01-01')).toEqual([]);
  });
  test('L-047-A: format pliku recenzenta — sha 12 hex, recenzent obecny, autor ≠ recenzent', () => {
    const zly: Record<string, PlikR> = { 'x.json': { karty: { A: { werdykt: 'wyswietlana', data: '2026-11-04', sha: 'XYZ', autor: 'a', recenzent: 'A' }, B: { werdykt: 'wyswietlana', data: '2026-11-04', sha: 'aaaaaaaaaaaa' } } } };
    expect(problemySkrotow({}, zly)).toEqual(['x.json/A: sha nie jest 12 znakami hex', 'x.json/A: autor = recenzent', 'x.json/B: brak pola recenzent']);
  });
  test('L-047-A, gałąź z wcześniejszymi zmianami względem main (L-080): karta z wcześniejszą datą dodana na gałęzi poza listą nie przechodzi, karta z listy — tak', () => {
    const w = (sha: string, data: string) => ({ werdykt: 'wyswietlana', data, sha, recenzent: 'audytor', autor: 'programista' });
    const lista: Lista = { ...PUSTA, zwolnione: ['S1'], do_uzupelnienia: { termin: '2026-11-10', maks: 1, karty: ['S2'] } };
    const stare = { S1: w('111111111111', '2026-10-28'), S2: w('222222222222', '2026-11-03') };
    expect(problemySkrotow(stare, {}, lista)).toEqual([]);
    // karta dodana później, ale z datą sprzed reguły (obejście progu daty z poprzedniej wersji strażnika)
    expect(problemySkrotow({ ...stare, N: w('333333333333', '2026-10-28') }, {}, lista)).toEqual(['karty/N: brak wpisu w docs/research/recenzje/*.json']);
    expect(problemySkrotow({ ...stare, N: w('333333333333', '2026-11-03') }, { 'p-r1.json': { karty: { N: w('333333333333', '2026-11-03') } } }, lista)).toEqual([]);
    // dopisanie nowej karty do listy zatrzymuje limit
    expect(problemyListy({ ...lista, zwolnione: ['S1', 'N'] }, { ...stare, N: w('333333333333', '2026-10-28') }, {}, '2026-11-04')).toEqual(['zwolnione: 2 > maks 0 (lista tylko maleje)']);
  });
  test('L-047-A: README recenzji opisuje krok recenzenta i wskazuje ten strażnik', () => {
    const r = read(`${DIR_RECENZJE}/README.md`);
    expect(r).toContain('tests/l047-recenzja-niezalezna.test.ts'); expect(r).toContain('<partia>-r<N>.json'); expect(r).toMatch(/nie edytuje wpisów recenzji/); expect(r).toContain('tests/l047-lista-zamrozona.json');
  });
});
