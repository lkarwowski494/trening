/*
 * Język naturalny, źródła w jednym miejscu (decyzja właściciela 23.10.2026, docs/18): „język musi być naturalny … źródła wiedzy opisać … w jednym miejscu w aplikacji
 * bez przypisów do konkretnych funkcji”. Rodzaje (docs/20): dane (lista źródeł ⇔ rejestr twierdzeń ⇔ dokumenty), logika (wzorce nazw), języki (wszystkie słowniki,
 * wskazówki, sklep), niezmienniki (żaden tekst interfejsu poza ekranem „Źródła wiedzy” nie ma nazwy źródła). Ekran: tests/zrodla-wiedzy-ui.test.tsx.
 * Lista nazw jest jedna: lib/sources.ts (SOURCE_NAME_PATTERNS); stare tłumaczenia kluczy z zestawu do przekładu (docs/lokalizacja/zestaw-przekladu-2026-10-23.json,
 * rodzaj „zmieniony”) są wyjątkiem do czasu przekładu na 33 języki — wyjątek znika razem z wpisem w zestawie.
 */
import * as fs from 'fs';
import * as path from 'path';
import { EN } from '@/lib/i18n.en';
import { LANGS } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';
import { cueDict } from '@/lib/cues';
import { allLabels } from '@/lib/equipment';
import { SOURCE_GROUPS, SOURCE_NAME_PATTERNS, CUE_SOURCE_LINES } from '@/lib/sources';
import { PENDING, PENDING_CHANGED } from './pending-translation';

const root = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');
/** Nazwa źródła: wzorzec z listy, poprzedzony czymkolwiek poza literą (wielkość liter ma znaczenie: „WHO”, nie „who”). */
export const NAME = new RegExp(`(?<![\\p{L}])(?:${SOURCE_NAME_PATTERNS.join('|')})`, 'u');
const strings = (o: unknown, out: string[] = []): string[] => { if (typeof o === 'string') out.push(o); else if (Array.isArray(o)) o.forEach(x => strings(x, out)); else if (o && typeof o === 'object') Object.values(o).forEach(x => strings(x, out)); return out; };
const ITEMS = SOURCE_GROUPS.flatMap(g => g.items);

describe('wzorzec nazw źródeł (jedna lista: lib/sources.ts)', () => {
  test('rozpoznaje cytaty i skróty w PL i EN, nie łapie zwykłych słów', () => {
    for (const s of ['Zourdos i in., JSCR 2016', 'ACSM 2026', 'wytyczne USA 2018', 'WHO 2020', 'Pelland et al. 2026', 'wzór Epleya', 'Epley formula', 'NSCA 2017', 'Helms i in. 2016', 'Bell i in. 2023', 'Kowalski i in. 2019', 'US guidelines 2018', 'Physical Activity Guidelines'])
      expect([s, NAME.test(s)]).toEqual([s, true]);
    for (const s of ['people who used earlier versions', 'Dumbbell row', 'Zrób 3 serie', 'RPE 8 = 2 RIR', 'Bellows', 'Apple Health', 'e1RM (na hantel)']) expect([s, NAME.test(s)]).toEqual([s, false]);
  });
  test('każde źródło z listy jest rozpoznawane przez wzorzec (lista jest jedynym miejscem nazw)', () => {
    for (const i of ITEMS) expect([i.id, NAME.test(i.cite)]).toEqual([i.id, true]);
  });
});

describe('dane: lista źródeł ⇔ rejestr twierdzeń ⇔ dokumenty', () => {
  test('id unikalne; każde źródło ma nazwę, opis i zdanie „do czego służy”; grupy niepuste', () => {
    expect(new Set(ITEMS.map(i => i.id)).size).toBe(ITEMS.length);
    for (const g of SOURCE_GROUPS) { expect([g.id, g.items.length > 0, g.title().length > 3]).toEqual([g.id, true, true]); }
    for (const i of ITEMS) expect([i.id, i.cite.length > 3, i.detail.length > 3, i.use().length > 15]).toEqual([i.id, true, true, true]);
    expect(CUE_SOURCE_LINES).toHaveLength(4);
  });
  test('każde źródło z rejestru twierdzeń (pole zrodla, poza etykietą prywatności sklepu) ma wpis na ekranie', () => {
    const reg = JSON.parse(read('docs/research/rejestr-twierdzen.json')).twierdzenia as { id: string; zrodla: string[] }[];
    const missing: string[] = [];
    for (const e of reg) for (const z of e.zrodla) { if (/^App Store/.test(z)) continue; if (!NAME.test(z)) missing.push(`${e.id}: ${z}`); }
    expect(missing).toEqual([]);
    const cited = reg.flatMap(e => e.zrodla).filter(z => !/^App Store/.test(z));
    for (const z of cited) expect([z, ITEMS.some(i => new RegExp(i.names.join('|') || i.cite.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(z))]).toEqual([z, true]);
  });
  test('każde źródło z ekranu jest opisane w dokumentach badacza (docs/research) — lista nie zawiera zmyślonych pozycji', () => {
    const dir = path.join(root, 'docs/research'); const all = fs.readdirSync(dir).filter(f => f.endsWith('.md')).map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n') + read('docs/brd/zrodla.md');
    const miss = ITEMS.filter(i => !new RegExp(i.names[0] ?? i.cite.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(all)).map(i => i.id);
    expect(miss).toEqual([]);
  });
});

describe('niezmiennik: żaden tekst interfejsu poza ekranem „Źródła wiedzy” nie ma nazwy źródła', () => {
  test('słownik PL (klucze) i EN (wartości) — bez wyjątków', () => {
    const bad = Object.entries(EN).filter(([k, v]) => NAME.test(k) || NAME.test(v)).map(([k]) => k.slice(0, 80));
    expect(bad).toEqual([]);
  });
  test('słowniki 33 języków (poza PL i EN): bez nazw; wyjątek tylko stare tłumaczenia kluczy z zestawu do przekładu', () => {
    const bad: string[] = [];
    for (const l of LANGS) { if (l === 'pl' || l === 'en') continue; for (const [k, v] of Object.entries(LOCALES[l] ?? {})) if (NAME.test(v) && !PENDING_CHANGED.has(k)) bad.push(`${l}: ${k.slice(0, 60)}`); }
    expect(bad).toEqual([]);
  });
  test('wyjątek jest wąski: każdy klucz „zmieniony” z zestawu ma w PL i EN brzmienie bez nazw (tylko stare tłumaczenia czekają)', () => {
    for (const p of PENDING) { expect([p.pl.slice(0, 50), NAME.test(p.pl), NAME.test(p.en)]).toEqual([p.pl.slice(0, 50), false, false]); }
  });
  test('wskazówki techniki (wszystkie języki), etykiety sprzętu, metadane sklepu, uprawnienia iOS i strony www', () => {
    const bad: string[] = [];
    for (const l of LANGS) for (const [id, v] of Object.entries(cueDict(l))) if (NAME.test(v)) bad.push(`wskazówka ${l}: ${id}`);
    for (const x of allLabels()) if (NAME.test(x.pl) || NAME.test(x.en)) bad.push(`sprzęt: ${x.pl}`);
    for (const f of ['store/app-store-metadata.json', 'store/app-store-names.json']) for (const s of strings(JSON.parse(read(f)))) if (NAME.test(s)) bad.push(`${f}: ${s.slice(0, 60)}`);
    for (const f of fs.readdirSync(path.join(root, 'locales'))) for (const s of strings(JSON.parse(read(`locales/${f}`)))) if (NAME.test(s)) bad.push(`locales/${f}: ${s.slice(0, 60)}`);
    for (const f of fs.readdirSync(path.join(root, 'site')).filter(f => f.endsWith('.html'))) if (NAME.test(read(`site/${f}`).replace(/<[^>]+>/g, ' '))) bad.push(`site/${f}`);
    expect(bad).toEqual([]);
  });
  test('stopka wskazówek techniki nie wymienia podstawy (tylko zdanie medyczne); klucze stopki usunięte ze słowników', () => {
    expect(read('components/ExerciseCues.tsx')).not.toMatch(/Na podstawie|Własne sformułowania|BASIS/);
    expect(EN['Na podstawie: {list}. Własne sformułowania.']).toBeUndefined();
    for (const l of LANGS) if (l !== 'pl' && l !== 'en') expect([l, (LOCALES[l] ?? {})['Na podstawie: {list}. Własne sformułowania.']]).toEqual([l, undefined]);
  });
  test('teksty ekranu „Źródła wiedzy” są w słowniku EN; ekran jest w Ustawieniach i w nawigacji', () => {
    expect(read('app/more/settings.tsx')).toMatch(/router\.push\('\/more\/sources'\)/);
    expect(read('app/_layout.tsx')).toMatch(/name="more\/sources" options=\{\{ title: t\('Źródła wiedzy'\) \}\}/);
    for (const k of ['Źródła wiedzy', 'Na czym opierają się liczby i zalecenia', 'Technika ćwiczeń', 'Nasze uproszczenia i wybory', 'Partie mięśniowe w ćwiczeniach']) expect([k, typeof EN[k]]).toEqual([k, 'string']);
    for (const i of ITEMS) expect([i.id, typeof EN[i.use()]]).toEqual([i.id, 'string']);
  });
  test('ekran działa offline: bez fetch, Linking, WebBrowser i adresów http w kodzie ekranu i listy', () => {
    for (const f of ['app/more/sources.tsx', 'lib/sources.ts']) expect([f, /fetch\(|Linking|WebBrowser|https?:\/\/|openWebPage|XMLHttpRequest/.test(read(f).replace(/\/\*[\s\S]*?\*\//g, ''))]).toEqual([f, false]);
  });
});
