/*
 * Testy, które potrzebują PEŁNYCH danych źródeł wskazówek (data/zrodla/cues.json): ≥ 2 organizacje na wskazówkę, adresy, powody otwartych ćwiczeń, znacznik „analogia”,
 * generator dokumentu docs/research/27, zgodność pliku runtime (lib/cues/data.json, bez nazw) z pełnymi danymi. Wyodrębnione z tests/cues.test.tsx, tests/cues-014.test.tsx
 * i tests/audit-k1-bl-mer.test.tsx (decyzja właściciela 25.10.2026: pełne źródła mogą zostać przeniesione poza repozytorium publiczne — razem z data/zrodla
 * i tym plikiem; pozostałe testy czytają tylko plik runtime). Rodzaje (docs/20): dane (merytoryka źródeł), niezmienniki (runtime = funkcja pełnych danych), dokument.
 */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import { CUE_SECTIONS, CUE_DATA, CUE_BASIS_KINDS, cueBasis, cueText, cuesFor, type CueBasisKind } from '@/lib/cues';
import { CUE_FULL } from './zrodla-pelne';

const root = path.join(__dirname, '..');
const lib = (key: string) => ({ lib: true as const, libKey: key });
const NEW_P1 = ['Straight Arm Pulldown', 'Wyciskanie na linkach (stojąc)', 'Machine Shoulder Press', 'Leg Curl', 'Nordic Curl', 'Wall Sit', 'Back Extension', 'Preacher Curl',
  'Diamond Push Up', 'Pallof Press', 'Reverse Crunch', "Farmer's Walk", 'Suitcase Carry', 'Burpees'];
const NEW_P2 = ['Medicine Ball Slam', 'Leg Extension', 'Seated Calf Raise', 'Incline Walk (bieżnia)', 'Bieg', 'Rower'];
const NEW = [...NEW_P1, ...NEW_P2];
/** Organizacje wskazówek ćwiczenia w kolejności pierwszego użycia (dawne cueOrgs z lib/cues — w aplikacji nie ma nazw, tylko rodzaje). */
function cueOrgsFull(key: string): string[] {
  const x = CUE_FULL.exercises[key]; if (!x) return [];
  const out: string[] = [];
  for (const sec of CUE_SECTIONS) for (const r of x[sec] ?? []) for (const [sid] of r.s) { const o = CUE_FULL.sources[sid]?.org; if (o && !out.includes(o)) out.push(o); }
  return out;
}

describe('pełne dane wskazówek (data/zrodla/cues.json)', () => {
  test('każda wskazówka: ≥ 2 przeczytane źródła z różnych organizacji, z miejscem w źródle; źródło ma adres https', () => {
    for (const [ex, x] of Object.entries(CUE_FULL.exercises)) for (const sec of CUE_SECTIONS) for (const r of x[sec] ?? []) {
      const orgs = new Set<string | undefined>(r.s.map(([sid]) => CUE_FULL.sources[sid]?.org));
      expect([ex, r.c, orgs.has(undefined)]).toEqual([ex, r.c, false]);
      expect([ex, r.c, orgs.size >= 2]).toEqual([ex, r.c, true]);
      for (const [, at] of r.s) expect(at.trim().length).toBeGreaterThan(2);
    }
    for (const s of Object.values(CUE_FULL.sources)) { expect(s.url).toMatch(/^https:\/\//); expect(CUE_FULL.orgs[s.org]).toBeDefined(); if (s.archive) expect(s.archive).toMatch(/^https:\/\/web\.archive\.org\/web\/\d+\//); }
  });
  test('żadne źródło ze spornego szczebla (uczelniane centra sportu, DAN, WebMD Ignite, przedruk NSCA ETM) nie wchodzi do danych', () => {
    const HOSTS = /cse\.hku\.hk|uwo\.ca|sussex\.ac\.uk|ummhealth\.org|dan\.org|coachesontario\.ca|exrx\.net/;
    const bad = Object.entries(CUE_FULL.sources).filter(([id, s]) => !id.startsWith('exrx-') && HOSTS.test(s.url)).map(([id]) => id);
    expect(bad).toEqual([]);
    for (const o of Object.keys(CUE_FULL.orgs)) expect(o).not.toMatch(/HKU|Western SRS|Sussex|WebMD|^DAN$|NSCA ETM/);
  });
  test('każda nowa wskazówka: ≥ 2 różne organizacje bez „analogii”; miejsce w źródle; Wall Sit „oddech” nie liczy zespołu Wilesa podwójnie', () => {
    for (const k of NEW) for (const sec of CUE_SECTIONS) for (const r of CUE_FULL.exercises[k][sec]) {
      const orgs = new Set(r.s.filter(x => x[2] === undefined).map(([sid]) => CUE_FULL.sources[sid].org));
      expect([k, r.c, orgs.size >= 2]).toEqual([k, r.c, true]);
    }
    const breath = CUE_FULL.exercises['Wall Sit'].tips.find(r => r.c === 'wall.breath')!;
    expect(breath.s.map(([sid]) => sid)).toEqual(['pmc-10786991', 'pmc-11050476']);
    expect(breath.s.every(([, at]) => at.length > 10)).toBe(true);
  });
  test('Preacher Curl: ustawienie oznaczone w danych jako słabsze (ustawienie testowe)', () => {
    const r = CUE_FULL.exercises['Preacher Curl'].setup[0];
    expect(r.c).toBe('preacher.setup'); expect(r.s.every(([, at]) => /słabsze/.test(at))).toBe(true);
  });
  test('otwarte ćwiczenia mają powód (≥ 20 znaków); ćwiczenia z kompletem nie są na liście otwartych; notatka „partial” odsyła do researchu', () => {
    for (const [k, why] of Object.entries(CUE_FULL.open)) expect([k, why.length > 20, !!CUE_FULL.exercises[k]]).toEqual([k, true, false]);
    for (const k of NEW) expect([k, !!CUE_FULL.exercises[k], k in CUE_FULL.open]).toEqual([k, true, false]);
    expect(CUE_FULL.partialNote).toMatch(/docs\/research\/31/);
  });
  test('cueOrgsFull: organizacje w kolejności pierwszego użycia, bez powtórzeń; nieznane ćwiczenie → []', () => {
    const o = cueOrgsFull('Deadlift (sztanga)'); expect(o[0]).toBe('ACE'); expect(new Set(o).size).toBe(o.length); expect(o.length).toBeGreaterThanOrEqual(2);
    expect(cueOrgsFull('xyz')).toEqual([]);
  });
  test('każda organizacja ma szczebel 2–4 i rodzaj z CUE_BASIS_KINDS', () => {
    for (const [id, o] of Object.entries(CUE_FULL.orgs)) expect([id, [2, 3, 4].includes(o.level), (CUE_BASIS_KINDS as readonly string[]).includes(o.kind)]).toEqual([id, true, true]);
  });
});

describe('plik runtime lib/cues/data.json = funkcja pełnych danych, bez nazw', () => {
  test('generator zrodla-runtime --check: plik aktualny', () => {
    expect(() => execFileSync('node', [path.join(root, 'scripts/zrodla-runtime.mjs'), '--check'], { stdio: 'pipe' })).not.toThrow();
  });
  test('te same ćwiczenia, sekcje i zdania w tej samej kolejności; runtime bez pól sources/orgs/s/partialNote', () => {
    expect(Object.keys(CUE_DATA.exercises)).toEqual(Object.keys(CUE_FULL.exercises));
    for (const [ex, x] of Object.entries(CUE_FULL.exercises)) for (const sec of Object.keys(x)) expect([ex, sec, CUE_DATA.exercises[ex][sec as 'setup'].map(r => r.c)]).toEqual([ex, sec, x[sec as 'setup'].map(r => r.c)]);
    expect(Object.keys(CUE_DATA).sort()).toEqual(['basis', 'exercises', 'open', 'partial']);
    expect(JSON.stringify(CUE_DATA.exercises)).not.toMatch(/"s":/);
    expect(CUE_DATA.open).toEqual(Object.keys(CUE_FULL.open)); expect(CUE_DATA.partial).toEqual(CUE_FULL.partial ?? []);
  });
  test('podpis (basis) = rodzaje organizacji ze wszystkich odwołań ćwiczenia (też „analogia”), w kolejności CUE_BASIS_KINDS — niezależne przeliczenie', () => {
    for (const ex of Object.keys(CUE_FULL.exercises)) {
      const kinds = new Set<CueBasisKind>(cueOrgsFull(ex).map(o => CUE_FULL.orgs[o].kind));
      expect([ex, cueBasis(ex)]).toEqual([ex, CUE_BASIS_KINDS.filter(k => kinds.has(k))]);
    }
  });
  test('cuesFor nadal zwraca podpis i zdania (nic nie zgubione przy przejściu na dane runtime)', () => {
    const c = cuesFor(lib('Back Squat'), 'pl')!; expect(c.basis).toEqual(cueBasis('Back Squat')); expect(c.sections.length).toBeGreaterThan(1);
    expect(cueText(CUE_FULL.exercises['Back Squat'].setup[0].c, 'pl')).toBe(c.sections[0].items[0]);
  });
});


describe('dokument źródeł (generowany z pełnych danych)', () => {
  test('docs/research/27-wskazowki-zrodla.md aktualny i dane poprawne (scripts/cues/gen.mjs --check)', () => {
    expect(() => execFileSync('node', [path.join(root, 'scripts/cues/gen.mjs'), '--check'], { stdio: 'pipe' })).not.toThrow();
    const doc = fs.readFileSync(path.join(root, 'docs/research/27-wskazowki-zrodla.md'), 'utf8');
    for (const k of Object.keys(CUE_FULL.exercises)) expect(doc).toContain(`### ${k}`);
    for (const k of Object.keys(CUE_FULL.open)) expect(doc).toContain(`| ${k} |`);
  });
  test('verify uruchamia sprawdzenie dokumentu wskazówek', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
    expect(pkg.scripts['check:cues']).toBe('node scripts/cues/gen.mjs --check');
    expect(pkg.scripts.verify).toContain('npm run check:cues');
  });
});

/*
 * MER2-04: wskazania źródeł we wskazówkach (przeczytane strony, 09.10.2026): reguła docs/research/27 „gdzie źródła się różnią — przedział”.
 *  - OHP (sztanga): ACE #71 „about shoulder-width”, ExRx „slightly wider” → „na szerokość barków lub trochę szerzej”; stopy: ACE #71 nic,
 *    ACE #43 (siedząc) „press the feet into the floor”, ExRx „shoulder width or one foot in front” → bez szerokości.
 *  - Kettlebell Swing: ACE #391 „shoulder-width”, ExRx „slightly wider” → przedział. RDL: chwyt NASM „slightly wider”, ExRx „shoulder width to wide”.
 *  - Leg Press: szerokość stóp tylko NASM → zamiast niej kąt w kolanach (~90°: ACE #154 i NASM).
 *  - Face Pull: ACE #336 to High Row (inne ćwiczenie) — odwołanie oznaczone „analogia” i NIE liczy się do ≥ 2 źródeł (gen.mjs); „łokcie za linią
 *    pleców” (tylko ExRx) i „klatka uniesiona” (tylko High Row) zastąpione częścią wspólną NASM i ExRx.
 */
describe('MER2-04: wskazania źródeł wskazówek', () => {
  const { execFileSync } = require('child_process') as typeof import('child_process');
  const { cueText } = require('@/lib/cues') as typeof import('@/lib/cues');
  const refs = (ex: string) => Object.values(CUE_FULL.exercises[ex]).flat() as unknown as { c: string; s: string[][] }[];
  const validate = (data: unknown): string[] => JSON.parse(execFileSync('node', ['--input-type=module', '-e',
    `import { validate } from ${JSON.stringify(path.join(root, 'scripts/cues/gen.mjs'))}; import { readFileSync } from 'node:fs';
     const pl = JSON.parse(readFileSync(${JSON.stringify(path.join(root, 'lib/cues/text/pl.json'))}, 'utf8')); let d = ''; process.stdin.on('data', c => d += c);
     process.stdin.on('end', () => process.stdout.write(JSON.stringify(validate(JSON.parse(d), pl))));`], { input: JSON.stringify(data) }).toString());
  test('rozstaw jako przedział: OHP (sztanga), Kettlebell Swing, RDL — „na szerokość barków lub trochę szerzej”; stopy w OHP i Leg Press bez szerokości', () => {
    expect(cueText('ohp.bbSetup', 'pl')).toContain('chwyt na szerokość barków lub trochę szerzej');
    expect(cueText('kb.setup', 'pl')).toContain('stopy na szerokość barków lub trochę szerzej');
    expect(cueText('rdl.setup', 'pl')).toContain('chwyt na szerokość barków lub trochę szerzej');
    expect(cueText('ohp.feet', 'pl')).not.toMatch(/szeroko/);
    expect(cueText('lp.setup', 'pl')).not.toMatch(/szeroko/);
    expect(cueText('ohp.bbSetup', 'en')).toContain('shoulder-width or a little wider');
  });
  test('Face Pull: High Row (ACE #336) oznaczone „analogia”; zdania bez twierdzeń jednego źródła; każde zdanie ma ≥ 2 organizacje bez analogii', () => {
    const fp = refs('Face Pull');
    for (const r of fp) for (const ref of r.s) if (ref[0] === 'ace-336') expect([r.c, ref[2]]).toEqual([r.c, 'analogia']);
    for (const r of fp) expect([r.c, new Set(r.s.filter(x => x[2] !== 'analogia').map(x => CUE_FULL.sources[x[0]].org)).size >= 2]).toEqual([r.c, true]);
    expect(cueText('fp.elbowsBack', 'pl')).not.toMatch(/za linią pleców/); expect(cueText('fp.chest', 'pl')).not.toMatch(/Klatka uniesiona/);
  });
  test('gen.mjs: odwołanie „analogia” nie liczy się do ≥ 2 źródeł; nieznany znacznik — błąd; dokument pokazuje „analogia”', () => {
    expect(validate(CUE_FULL)).toEqual([]);
    const d = JSON.parse(JSON.stringify(CUE_FULL)); const r = d.exercises['Face Pull'].tips.find((x: { c: string }) => x.c === 'fp.chest');
    r.s = [r.s.find((x: string[]) => x[0].startsWith('exrx')), ['ace-336', 'opis', 'analogia']];
    expect(validate(d).join('\n')).toMatch(/Face Pull\.fp\.chest: 1 organizacja/);
    r.s[1][2] = 'cokolwiek'; expect(validate(d).join('\n')).toMatch(/znacznik/);
    expect(fs.readFileSync(path.join(root, 'docs/research/27-wskazowki-zrodla.md'), 'utf8')).toMatch(/High Row \(#336\)\]\([^)]*\) \(analogia — inne ćwiczenie; /);
  });
});
