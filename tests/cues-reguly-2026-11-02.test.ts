/*
 * Reguły źródeł wskazówek po decyzjach z 02.11.2026 (docs/18: książki = szczebel 3 z nieprzezroczystym id; szczeble organizacji i serwisów;
 * jedno źródło szczebla 3 dla ustawienia i ruchu; „uproszczenie”; błąd wnioskowany `["wniosek", "<id>"]`; karty z luką drugiego źródła po przeliczeniu szczebli).
 * Zakres strażnika (L-089): scripts/cues/gen.mjs `validate` (część `npm run check:cues` w verify i scripts/pochodne.mjs:35) + dane data/zrodla/cues.json.
 * Rodzaje (docs/20): logika (validate), dane (orgs, luki), niezmienniki (poziom 5 nie liczy się do pary i nie wchodzi do podpisu), macierz (każda reguła ma przypadek zgody i odmowy).
 * Ocena realności: błąd „słabe źródło liczy się jako drugie” — realny (treść kart w aplikacji i na stronie z ćwiczeniami).
 */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import { CUE_BASIS_KINDS } from '@/lib/cues';
import { CUE_FULL } from './zrodla-pelne';

const root = path.join(__dirname, '..');
const GEN = path.join(root, 'scripts/cues/gen.mjs');
type Ref = string[]; type Cue = { c: string; s: Ref[]; uproszczenie?: unknown; jedno_zrodlo?: unknown };
type Data = { orgs: Record<string, Record<string, unknown>>; sources: Record<string, Record<string, unknown>>; exercises: Record<string, Record<string, Cue[]>>; open: Record<string, string>; partial?: string[]; luki?: Record<string, string> };
const clone = (): Data => JSON.parse(JSON.stringify(CUE_FULL));
/** validate() z gen.mjs na podanych danych — w osobnym procesie (moduł .mjs poza transformacją Jest), ten sam sposób co tests/zrodla-pelne-cues.test.ts. */
const validate = (data: unknown): string[] => JSON.parse(execFileSync('node', ['--input-type=module', '-e',
  `import { validate } from ${JSON.stringify(GEN)}; import { readFileSync } from 'node:fs';
   const pl = JSON.parse(readFileSync(${JSON.stringify(path.join(root, 'lib/cues/text/pl.json'))}, 'utf8')); let d = ''; process.stdin.on('data', c => d += c);
   process.stdin.on('end', () => process.stdout.write(JSON.stringify(validate(JSON.parse(d), pl, Object.values(JSON.parse(readFileSync(${JSON.stringify(path.join(root, 'lib/figures/v2/cue-sets.json'))}, 'utf8')).items).flatMap(e => [...(e.ok ?? []), ...(e.err ?? [])])))));`],
  { input: JSON.stringify(data), encoding: 'utf8' }));
const text = (errs: string[]) => errs.join('\n');
const KEY = 'Deadlift (sztanga)';
const cueOf = (d: Data, ex: string, sec: string, c: string) => d.exercises[ex][sec].find(r => r.c === c) as Cue;
/** Dane z dodaną książką (szczebel 3, nieprzezroczysty id) — baza przypadków poniżej. */
function zKsiazka(): Data {
  const d = clone();
  d.orgs['dysk-k1'] = { name: 'dysk-k1', level: 3, kind: 'book' };
  d.sources['dysk-k1'] = { org: 'dysk-k1', title: 'dysk-k1', level: 3 };
  return d;
}

describe('stan wyjściowy: dane przechodzą validate()', () => {
  test('data/zrodla/cues.json: brak błędów', () => { expect(validate(CUE_FULL)).toEqual([]); });
});

describe('rodzaj podstawy `book` (szczebel 3, 02.11.2026)', () => {
  test('CUE_BASIS_KINDS ma `book` na końcu; BASIS_ORDER w zrodla-runtime.mjs i KINDS w gen.mjs są zgodne', () => {
    expect(CUE_BASIS_KINDS).toEqual(['org', 'site', 'maker', 'study', 'book']);
    const out = JSON.parse(execFileSync('node', ['--input-type=module', '-e',
      `import { BASIS_ORDER } from ${JSON.stringify(path.join(root, 'scripts/zrodla-runtime.mjs'))}; import { KINDS } from ${JSON.stringify(GEN)}; console.log(JSON.stringify({ b: BASIS_ORDER, k: Object.keys(KINDS) }));`], { encoding: 'utf8' }));
    expect(out.b).toEqual([...CUE_BASIS_KINDS]); expect(out.k).toEqual([...CUE_BASIS_KINDS]);
  });
  test('książka z nieprzezroczystym id, szczebel 3, bez adresu — zgoda; liczy się jako druga organizacja', () => {
    const d = zKsiazka(); cueOf(d, KEY, 'tips', 'dl.close').s = [['exrx-ErectorSpinae/BBDeadlift', 'Comments'], ['dysk-k1', 'rozdział 3']];
    expect(validate(d)).toEqual([]);
  });
  test('książka: nazwa z tytułem (nie id) → błąd; adres → błąd; szczebel 4 → błąd; id źródła spoza wzorca → błąd', () => {
    let d = zKsiazka(); d.orgs['dysk-k1'].name = 'Science and Practice of Strength Training'; expect(text(validate(d))).toMatch(/orgs\.dysk-k1.*nieprzezroczyst/);
    d = zKsiazka(); d.sources['dysk-k1'].url = 'https://example.org/ksiazka'; cueOf(d, KEY, 'tips', 'dl.close').s.push(['dysk-k1', 'rozdział']);
    expect(text(validate(d))).toMatch(/sources\.dysk-k1.*bez adresu/);
    d = zKsiazka(); d.orgs['dysk-k1'].level = 4; expect(text(validate(d))).toMatch(/orgs\.dysk-k1.*szczebel 3/);
    d = zKsiazka(); d.orgs['ksiazka-nsca'] = { name: 'ksiazka-nsca', level: 3, kind: 'book' }; expect(text(validate(d))).toMatch(/orgs\.ksiazka-nsca.*nieprzezroczyst/);
  });
  test('rodzaj spoza listy → błąd (zgodność z CUE_BASIS_KINDS)', () => {
    const d = clone(); d.orgs.ACE.kind = 'blog'; expect(text(validate(d))).toMatch(/orgs\.ACE: rodzaj/);
  });
});

describe('szczebel 5 nie liczy się do pary źródeł; luka tylko jawna', () => {
  test('wskazówka z drugim źródłem szczebla 5 → błąd „1 organizacja”; ta sama wskazówka wpisana w `luki` → zgoda', () => {
    const d = clone(); delete d.luki; d.orgs.Physitrack.level = 5; d.sources['physitrack-heel-raise-step'].level = 5; const r = cueOf(d, 'Łydki na stopniu', 'setup', 'calf.step');
    r.s = [['exrx-Gastrocnemius/BWStandingCalfRaise', 'Preparation'], ['physitrack-heel-raise-step', 'opis']];
    expect(text(validate(d))).toMatch(/Łydki na stopniu\.calf\.step: 1 organizacja/);
    d.luki = { 'Łydki na stopniu::calf.step': 'test: drugie źródło szczebla ≤ 4 do uzupełnienia' };
    expect(text(validate(d))).not.toMatch(/calf\.step: 1 organizacja/);
  });
  test('luka zbędna (wskazówka ma parę), luka bez powodu i luka wskazująca nieistniejące zdanie → błąd', () => {
    const d = clone(); d.luki = { [`${KEY}::dl.feet`]: 'zbędna' }; expect(text(validate(d))).toMatch(/luki\.Deadlift \(sztanga\)::dl\.feet: wskazówka ma komplet źródeł/);
    d.luki = { [`${KEY}::nie.ma`]: 'x'.repeat(30) }; expect(text(validate(d))).toMatch(/luki.*nieistniejące zdanie/);
    d.luki = { [`${KEY}::dl.feet`]: '' }; expect(text(validate(d))).toMatch(/luki.*powód/);
  });
  test('źródło szczebla 5 nie wchodzi do podpisu (basis) ćwiczenia, jeśli to jedyny rodzaj', () => {
    const out = JSON.parse(execFileSync('node', ['--input-type=module', '-e',
      `import { buildCues } from ${JSON.stringify(path.join(root, 'scripts/zrodla-runtime.mjs'))}; let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>{ const full=JSON.parse(d); console.log(JSON.stringify(buildCues(full).basis['X'])); });`],
      { input: JSON.stringify({ orgs: { A: { level: 4, kind: 'org' }, S: { level: 5, kind: 'site' } }, sources: { a: { org: 'A', level: 4 }, s: { org: 'S', level: 5 } }, exercises: { X: { setup: [{ c: 'x', s: [['a', 'm'], ['s', 'm']] }] } }, open: {} }), encoding: 'utf8' }));
    expect(out).toEqual(['org']);
  });
});

describe('„jedno źródło” (ustawienie i ruch z jednego źródła szczebla ≤ 3)', () => {
  const jedno = (mut: (d: Data, r: Cue) => void) => { const d = zKsiazka(); const r = cueOf(d, KEY, 'setup', 'dl.feet'); r.s = [['dysk-k1', 'rozdział 3']]; mut(d, r); return text(validate(d)); };
  test('setup z jedną książką i znacznikiem → zgoda; bez znacznika → błąd', () => {
    expect(jedno((_d, r) => { r.jedno_zrodlo = true; })).toBe('');
    expect(jedno(() => {})).toMatch(/Deadlift \(sztanga\)\.dl\.feet: 1 organizacja/);
  });
  test('znacznik w tips/mistakes → błąd; przy komplecie źródeł → „zbędne”; przy źródle szczebla 4 → błąd', () => {
    const d = zKsiazka(); const r = cueOf(d, KEY, 'tips', 'dl.close'); r.s = [['dysk-k1', 'rozdział 3']]; r.jedno_zrodlo = true;
    expect(text(validate(d))).toMatch(/dl\.close: jedno_zrodlo tylko w ustawieniu i ruchu/);
    const e = zKsiazka(); cueOf(e, KEY, 'setup', 'dl.feet').jedno_zrodlo = true; expect(text(validate(e))).toMatch(/dl\.feet: jedno_zrodlo zbędne/);
    expect(jedno((d2, r2) => { r2.s = [['ace-6', 'opis']]; r2.jedno_zrodlo = true; d2.luki = {}; })).toMatch(/dl\.feet: jedno_zrodlo wymaga źródła szczebla ≤ 3/);
  });
  test('znacznik nie jest prawdą (nie `true`) → błąd', () => { expect(jedno((_d, r) => { r.jedno_zrodlo = 'tak'; })).toMatch(/jedno_zrodlo/); });
});

describe('„uproszczenie” przy zdaniu', () => {
  test('niepusty opis → zgoda; pusty albo nie tekst → błąd', () => {
    const d = clone(); cueOf(d, KEY, 'tips', 'dl.close').uproszczenie = 'wariant sprzętu sztanga'; expect(validate(d)).toEqual([]);
    cueOf(d, KEY, 'tips', 'dl.close').uproszczenie = ''; expect(text(validate(d))).toMatch(/dl\.close: uproszczenie/);
    cueOf(d, KEY, 'tips', 'dl.close').uproszczenie = true; expect(text(validate(d))).toMatch(/dl\.close: uproszczenie/);
  });
  test('nieznane pole przy zdaniu → błąd', () => { const d = clone(); (cueOf(d, KEY, 'tips', 'dl.close') as Record<string, unknown>).cokolwiek = 1; expect(text(validate(d))).toMatch(/dl\.close: nieznane pole cokolwiek/); });
});

describe('błąd wnioskowany `["wniosek", "<id>"]`', () => {
  const mis = (s: Ref[]) => { const d = clone(); cueOf(d, KEY, 'mistakes', 'mis.barAway').s = s; return text(validate(d)); };
  test('wniosek ze zdania ustawienia tej karty + jedno źródło → zgoda; sam wniosek (bez źródeł) → zgoda', () => {
    expect(mis([['nasm-barbell-deadlift', 'Common Mistakes'], ['wniosek', 'dl.close']])).toBe('');
    expect(mis([['wniosek', 'dl.lift']])).toBe('');
  });
  test('wniosek ze zdania, którego nie ma w tej karcie → błąd; ze zdania błędu → błąd; w sekcji wskazówek → błąd', () => {
    expect(mis([['wniosek', 'tri.mis.padLift']])).toMatch(/mis\.barAway: wniosek ze zdania spoza tej karty/);
    expect(mis([['wniosek', 'mis.roundBack']])).toMatch(/mis\.barAway: wniosek ze zdania błędu/);
    const d = clone(); cueOf(d, KEY, 'tips', 'dl.close').s.push(['wniosek', 'dl.lift']); expect(text(validate(d))).toMatch(/dl\.close: wniosek tylko w sekcji błędów/);
  });
  test('wniosek ze zdania bez własnych źródeł (też wniosek / luka) → błąd; błąd bez źródeł i bez wniosku → błąd', () => {
    expect(mis([['nasm-barbell-deadlift', 'Common Mistakes']])).toMatch(/mis\.barAway: 1 organizacja/);
    expect(mis([])).toMatch(/mis\.barAway: 0 organizacja/);
  });
  test('wniosek nie podnosi liczby organizacji w tips/setup: jedno źródło + wniosek w move → błąd', () => {
    const d = clone(); const r = cueOf(d, KEY, 'move', 'dl.lift'); r.s = [['ace-6', 'opis'], ['wniosek', 'dl.feet']];
    expect(text(validate(d))).toMatch(/dl\.lift: wniosek tylko w sekcji błędów/);
  });
});

describe('organizacje warunkowo szczebla 4 (Coach, The Prehab Guys: ocena per strona)', () => {
  test('`warunkowo`: źródło bez własnego szczebla → błąd; szczebel 4 bez opisu strony → błąd; szczebel 5 z opisem → zgoda', () => {
    const d = clone(); d.orgs.Coach.warunkowo = 'artykuł z autorem z kwalifikacjami w biogramie i datą'; delete d.sources['coach-pendlay-row'].level;
    expect(text(validate(d))).toMatch(/sources\.coach-pendlay-row: organizacja warunkowa — szczebel strony/);
    d.sources['coach-pendlay-row'].level = 4; delete d.sources['coach-pendlay-row'].strona;
    expect(text(validate(d))).toMatch(/sources\.coach-pendlay-row: szczebel 4 wymaga opisu strony/);
    d.sources['coach-pendlay-row'].level = 5; d.sources['coach-pendlay-row'].strona = 'bez autora z kwalifikacjami (odczyt 02.11.2026)';
    expect(text(validate(d))).not.toMatch(/coach-pendlay-row/);
  });
});

describe('dane po porządkach P0 (02.11.2026)', () => {
  test('organizacje decyzji: Physitrack i Breaking Muscle = szczebel 5; free-exercise-db nie występuje jako organizacja szczebla ≤ 4', () => {
    expect(CUE_FULL.orgs['Physitrack'].level).toBe(5); expect(CUE_FULL.orgs['Breaking Muscle'].level).toBe(5);
    for (const [id, o] of Object.entries(CUE_FULL.orgs)) if (/free-exercise|fedb/i.test(`${id} ${o.name}`)) expect([id, o.level]).toEqual([id, 5]);
  });
  test('Coach i The Prehab Guys: warunkowo, każde źródło ma własny szczebel i opis strony', () => {
    for (const org of ['Coach', 'The Prehab Guys']) {
      expect([org, typeof (CUE_FULL.orgs[org] as { warunkowo?: string }).warunkowo]).toEqual([org, 'string']);
      for (const [id, s] of Object.entries(CUE_FULL.sources)) if (s.org === org) expect([id, [4, 5].includes(s.level), typeof (s as { strona?: string }).strona]).toEqual([id, true, 'string']);
    }
  });
  test('Skakanka i Assault Bike zostają otwarte do czasu kart z fali G6 (P4): każde ćwiczenie bazowe ma wskazówki albo wpis open — tests/cues.test.tsx; luki = dokładnie wskazówki, które po przeliczeniu szczebli tracą parę', () => {
    expect(Object.keys(CUE_FULL.open)).toEqual(expect.arrayContaining(['Skakanka', 'Assault Bike']));
    expect(Object.keys((CUE_FULL as unknown as Data).luki ?? {}).sort()).toEqual([
      'Pendlay Row::pendlay.floor', 'Pendlay Row::pendlay.mis.torso', 'Pendlay Row::pendlay.pull', 'Pendlay Row::pendlay.setup', 'Łydki na stopniu::calf.step',
    ].sort());
  });
  test('dokument docs/research/27 pokazuje sekcję luk i rodzaj `book`', () => {
    const md = fs.readFileSync(path.join(root, 'docs/research/27-wskazowki-zrodla.md'), 'utf8');
    expect(md).toMatch(/## Luki — wskazówki bez pary źródeł/); expect(md).toMatch(/Pendlay Row/);
  });
});
