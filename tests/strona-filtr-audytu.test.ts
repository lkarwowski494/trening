/**
 * Filtr audytu w eksporcie dla strony (CLAUDE.md, „Animacje i karty ćwiczeń — audyt dogłębny”, 27.10.2026): rodzina bez niezależnego audytu ruchu i treści karty
 * nie trafia na stronę jako figura (tekst ćwiczenia zostaje). Jedno miejsce prawdy: data/figury-audyt.json.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { FAMILIES } from '@/lib/figures/v2/families';
import { familyOf } from '@/lib/figures/v2';

const root = path.join(__dirname, '..');
const SCRIPT = path.join(root, 'scripts/strona/eksport.mjs');
const AUDYT = path.join(root, 'data/figury-audyt.json');
const IDS = FAMILIES.map(f => f.id as string);
const audyt = JSON.parse(fs.readFileSync(AUDYT, 'utf8')) as { schema: string; rodziny: Record<string, { stan: string; data?: string; recenzjaRuchu: string | null; recenzjaTresci: string | null; uwaga?: string }> };
const KAT = 'docs/przekazanie/notatki/recenzje-1-1';
const run = (out: string, ...extra: string[]) => execFileSync('node', [SCRIPT, '--out', out, '--commit', 'abc1234def', '--langs', 'pl,en', ...extra], { encoding: 'utf8' });
const runFail = (out: string, ...extra: string[]) => spawnSync('node', [SCRIPT, '--out', out, '--commit', 'abc1234def', '--langs', 'pl', ...extra], { encoding: 'utf8' });
type Ex = { id: string; slug: string; family: string; figure: unknown; audit: string | null };
const read = (d: string, f: string) => JSON.parse(fs.readFileSync(path.join(d, f), 'utf8'));
const tmp: string[] = [];
const mk = () => { const d = fs.mkdtempSync(path.join(os.tmpdir(), 'audyt-')); tmp.push(d); return d; };
const writeAudit = (mut: (r: typeof audyt) => void) => { const c = JSON.parse(JSON.stringify(audyt)) as typeof audyt; mut(c); const f = path.join(mk(), 'a.json'); fs.writeFileSync(f, JSON.stringify(c)); return f; };
let dReal = '', dSquat = '', dOff = '';
beforeAll(() => {
  dReal = mk(); run(dReal);
  /* plik pomocniczy: squat zatwierdzona (istniejące dokumenty jako recenzje) — dowodzi, że filtr przepuszcza dokładnie zatwierdzone rodziny */
  const f = writeAudit(a => { a.rodziny.squat = { stan: 'zatwierdzona', data: '2026-10-28', recenzjaRuchu: 'docs/18-przekazanie.md', recenzjaTresci: 'docs/20-definicja-ukonczenia.md' }; });
  dSquat = mk(); run(dSquat, '--audyt', f);
  dOff = mk(); run(dOff, '--bez-filtra-audytu');
}, 240000);
afterAll(() => { for (const d of tmp) fs.rmSync(d, { recursive: true, force: true }); });

describe('plik audytu rodzin (data/figury-audyt.json): schemat', () => {
  test('schema, klucze = dokładnie wszystkie rodziny figur v2, stan jednym z trzech', () => {
    expect(audyt.schema).toBe('figury-audyt@1');
    expect(Object.keys(audyt.rodziny).sort()).toEqual([...IDS].sort());
    for (const [id, e] of Object.entries(audyt.rodziny)) expect([id, ['zatwierdzona', 'do_poprawy', 'brak'].includes(e.stan)]).toEqual([id, true]);
  });
  test('zatwierdzona: data ISO oraz istniejące pliki recenzji ruchu i treści; pozostałe stany: uwaga niepusta', () => {
    for (const [id, e] of Object.entries(audyt.rodziny)) {
      if (e.stan === 'zatwierdzona') {
        expect([id, /^\d{4}-\d{2}-\d{2}$/.test(e.data ?? '')]).toEqual([id, true]);
        for (const p of [e.recenzjaRuchu, e.recenzjaTresci]) expect([id, !!p && fs.existsSync(path.join(root, p))]).toEqual([id, true]);
      } else expect([id, (e.uwaga ?? '').trim().length > 0]).toEqual([id, true]);
    }
  });
  test('odnośnik do recenzji ruchu wskazuje plik rodziny w katalogu recenzji (gdy katalog jest w tym drzewie, plik istnieje); stan „brak” nie ma odnośnika', () => {
    const jest = fs.existsSync(path.join(root, KAT));
    for (const [id, e] of Object.entries(audyt.rodziny)) {
      if (e.stan === 'brak') { expect([id, e.recenzjaRuchu]).toEqual([id, null]); continue; }
      expect([id, e.recenzjaRuchu]).toEqual([id, `${KAT}/${id}.md`]);
      if (jest) expect([id, fs.existsSync(path.join(root, e.recenzjaRuchu!))]).toEqual([id, true]);
    }
  });
  test('rodzina opisana jako zatwierdzona bez audytu treści karty jest niemożliwa: zatwierdzona wymaga recenzjaTresci (shrug i forearm: do_poprawy, dopóki karty nie ma)', () => {
    for (const [id, e] of Object.entries(audyt.rodziny)) if (e.stan === 'zatwierdzona') expect([id, e.recenzjaTresci]).not.toEqual([id, null]);
    for (const id of ['shrug', 'forearm']) expect([id, audyt.rodziny[id].recenzjaTresci ? 'ma kartę' : audyt.rodziny[id].stan]).toEqual([id, audyt.rodziny[id].recenzjaTresci ? 'ma kartę' : 'do_poprawy']);
  });
  test.each([
    ['brak rodziny', (a: typeof audyt) => { delete a.rodziny.squat; }],
    ['nieznana rodzina', (a: typeof audyt) => { a.rodziny.nie_ma = { stan: 'brak', recenzjaRuchu: null, recenzjaTresci: null, uwaga: 'x' }; }],
    ['nieznany stan', (a: typeof audyt) => { a.rodziny.squat.stan = 'ok'; }],
    ['zatwierdzona bez daty', (a: typeof audyt) => { a.rodziny.squat = { stan: 'zatwierdzona', recenzjaRuchu: 'docs/18-przekazanie.md', recenzjaTresci: 'docs/18-przekazanie.md' }; }],
    ['zatwierdzona bez pliku recenzji treści', (a: typeof audyt) => { a.rodziny.squat = { stan: 'zatwierdzona', data: '2026-10-28', recenzjaRuchu: 'docs/18-przekazanie.md', recenzjaTresci: null }; }],
    ['zatwierdzona z odnośnikiem do nieistniejącego pliku', (a: typeof audyt) => { a.rodziny.squat = { stan: 'zatwierdzona', data: '2026-10-28', recenzjaRuchu: 'docs/nie-ma.md', recenzjaTresci: 'docs/18-przekazanie.md' }; }],
    ['do_poprawy bez uwagi', (a: typeof audyt) => { a.rodziny.squat.uwaga = ''; }],
  ])('eksport odrzuca zły plik audytu: %s', (_n, mut) => {
    const r = runFail(mk(), '--audyt', writeAudit(mut)); expect(r.status).not.toBe(0); expect(r.stderr).toMatch(/plik audytu figur niepoprawny/);
  });
});

describe('eksport dla strony: filtr audytu', () => {
  test('stan początkowy (żadna rodzina nie jest zatwierdzona): figury.json puste, każde ćwiczenie ma figure=null i pole audit = stan jego rodziny; tekst zostaje', () => {
    expect(Object.values(audyt.rodziny).filter(e => e.stan === 'zatwierdzona')).toHaveLength(0);
    expect(read(dReal, 'figury.json').figures).toEqual({});
    for (const l of ['pl', 'en']) {
      const ex = read(dReal, `atlas-${l}.json`).exercises as (Ex & { cues: { scope: string } })[];
      expect(ex).toHaveLength(709);
      for (const e of ex) expect([e.id, e.figure, e.audit]).toEqual([e.id, null, audyt.rodziny[familyOf(e.id)].stan]);
      expect(ex.some(e => e.cues.scope === 'own')).toBe(true);
    }
  });
  test('manifest opisuje filtr: włączony, plik audytu, lista zatwierdzonych, liczby stanów', () => {
    const m = read(dReal, 'manifest.json');
    const licz = (s: string) => Object.values(audyt.rodziny).filter(e => e.stan === s).length;
    expect(m.audit).toEqual({ filter: true, schema: 'figury-audyt@1', approved: [], counts: { zatwierdzona: licz('zatwierdzona'), do_poprawy: licz('do_poprawy'), brak: licz('brak') } });
  });
  test('rodzina zatwierdzona przepuszcza figury dokładnie swoich ćwiczeń (squat), inne rodziny dalej bez figury', () => {
    const fig = read(dSquat, 'figury.json').figures as Record<string, { family: string }>;
    const ex = read(dSquat, 'atlas-en.json').exercises as Ex[];
    const squat = ex.filter(e => familyOf(e.id) === 'squat');
    expect(squat.length).toBeGreaterThan(0);
    expect(Object.keys(fig).sort()).toEqual(squat.map(e => e.slug).sort());
    for (const f of Object.values(fig)) expect(f.family).toBe('squat');
    for (const e of ex) expect([e.id, e.figure !== null]).toEqual([e.id, familyOf(e.id) === 'squat']);
    expect(read(dSquat, 'manifest.json').audit.approved).toEqual(['squat']);
  });
  test('bez filtra (tylko testy): figury wszystkich gotowych rodzin, manifest mówi filter=false i strona może takie dane odrzucić', () => {
    const m = read(dOff, 'manifest.json'); expect(m.audit.filter).toBe(false);
    expect(Object.keys(read(dOff, 'figury.json').figures).length).toBeGreaterThan(98);
    expect((read(dOff, 'atlas-en.json').exercises as Ex[]).every(e => e.audit === null)).toBe(true);
  });
});
