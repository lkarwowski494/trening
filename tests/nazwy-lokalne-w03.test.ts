/*
 * Nazwy lokalne ćwiczeń — dane i generator (ZB-044; decyzja koordynatora KO-044 B 11.11.2026, W-03; decyzje właściciela 07.11 i 08.11.2026 w docs/18).
 * Rodzaje (docs/20): dane (komplet PL dla katalogu, klucze z katalogu, długość), logika (tylko język z recenzją „zatwierdzone” trafia do aplikacji;
 * autor ≠ recenzent — L-047), proces (lib/nazwy-lokalne.ts generowany, --check), regresja (zestaw nazw nie wchodzi do PENDING testów interfejsu).
 * Skrypty są modułami ESM — wywołanie przez `node --input-type=module`.
 */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import { NAZWY_LOKALNE, NAZWY_LOKALNE_RECENZJA } from '@/lib/nazwy-lokalne';
import { NAME_EN } from '@/lib/nazwy-en.generated';
import { CATALOG } from '@/lib/catalog.generated';
import { PENDING } from './pending-translation';

const ROOT = path.join(__dirname, '..');
const GEN = JSON.stringify(path.join(ROOT, 'scripts/i18n/gen-nazwy-lokalne.mjs'));
const run = (code: string) => JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', code], { encoding: 'utf8', maxBuffer: 1 << 26 }));
const DANE = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/lokalizacja/nazwy-lokalne.json'), 'utf8')) as { jezyki: Record<string, { autor: string; recenzja: { wynik?: string } | null }>; nazwy: Record<string, Record<string, string>> };

describe('nazwy lokalne: dane (W-03 11.11.2026)', () => {
  test('każde ćwiczenie biblioteki (klucz katalogu z nazwą EN) ma polską nazwę lokalną; żadnego klucza spoza katalogu', () => {
    const kat = Object.keys(NAME_EN).filter(k => k in CATALOG); /* NAME_EN ma też dawne nazwy wyświetlane (LIB_DISPLAY_NAME) — nie są kluczami */
    expect(kat.length).toBeGreaterThan(270);
    expect(kat.filter(k => !DANE.nazwy[k]?.pl)).toEqual([]);
    expect(Object.keys(DANE.nazwy).filter(k => !(k in CATALOG))).toEqual([]);
  });
  test('generator: dane bez błędów (długość, puste, języki, recenzja) i lib/nazwy-lokalne.ts aktualny', () => {
    expect(execFileSync(process.execPath, [path.join(ROOT, 'scripts/i18n/gen-nazwy-lokalne.mjs'), '--check'], { encoding: 'utf8' })).toMatch(/aktualny/);
  });
  test('w aplikacji tylko języki z recenzją „zatwierdzone”, każdy z polem recenzji (autor ≠ recenzent)', () => {
    const zatw = Object.entries(DANE.jezyki).filter(([, j]) => j.recenzja?.wynik === 'zatwierdzone').map(([l]) => l).sort();
    expect(Object.keys(NAZWY_LOKALNE).sort()).toEqual(zatw);
    for (const l of Object.keys(NAZWY_LOKALNE)) { const r = NAZWY_LOKALNE_RECENZJA[l]; expect(r && r.recenzent && r.data && r.plik).toBeTruthy(); expect(r.recenzent).not.toBe(r.autor); }
  });
  test('regresja: zestaw nazw (rodzaj „nazwa”) nie trafia do PENDING testów kompletności interfejsu', () => {
    const pl = new Set(Object.values(DANE.nazwy).map(n => n.pl));
    expect(PENDING.filter(p => pl.has(p.pl)).map(p => p.pl)).toEqual([]);
  });
});

describe('nazwy lokalne: logika generatora', () => {
  const kat = ['A (sztanga)', 'B'];
  test('bledy: klucz spoza katalogu, pusta i za długa nazwa, język bez wpisu, „zatwierdzone” bez pól i recenzent = autor', () => {
    const b = run(`import * as g from ${GEN}; console.log(JSON.stringify(g.bledy({
      jezyki: { pl: { autor: 'x', recenzja: { wynik: 'zatwierdzone', recenzent: 'x', data: '2026-11-11', plik: 'p' } }, de: { autor: 'api', recenzja: { wynik: 'zatwierdzone' } } },
      nazwy: { 'A (sztanga)': { pl: 'Ok', de: '' }, Z: { pl: 'x'.repeat(61), fr: 'y' } } }, ${JSON.stringify(kat)})))`) as string[];
    for (const w of [/spoza katalogu: Z/, /A \(sztanga\)\/de: pusta/, /Z\/pl: 61 znaków/, /Z: język fr bez wpisu/, /de: .*bez pola recenzent/, /pl: recenzent = autor/]) expect(b.some(x => w.test(x))).toBe(true);
  });
  test('generuj: język bez recenzji albo „do poprawy” poza aplikacją; zatwierdzony — z mapą i polem recenzji', () => {
    const t = run(`import * as g from ${GEN}; console.log(JSON.stringify(g.generuj({ jezyki: { pl: { autor: 'tl', recenzja: { wynik: 'zatwierdzone', recenzent: 'rl', data: 'd', plik: 'p' } }, de: { autor: 'api', recenzja: null }, fr: { autor: 'api', recenzja: { wynik: 'do poprawy' } } },
      nazwy: { B: { pl: ' Bé ', de: 'Be' } } })))`) as string;
    expect(t).toContain('"pl": {\n  "B": "Bé"\n }'); expect(t).not.toContain('"de"'); expect(t).not.toContain('"fr"'); expect(t).toMatch(/"recenzent": "rl"/);
  });
  test('zRaportu: propozycje po polskiej nazwie → klucz katalogu; autor = model API; nieznana nazwa → pominięta', () => {
    const w = run(`import * as g from ${GEN}; const d = { jezyki: {}, nazwy: { B: { pl: 'Bé' } } };
      const r = g.zRaportu(d, [{ jezyk: 'de', model: 'm', propozycje: { 'Bé': 'Be', 'Inna': 'x' } }], '2026-11-11'); console.log(JSON.stringify({ r, d }))`) as { r: { nazw: number; pominiete: string[] }; d: { jezyki: Record<string, { autor: string }>; nazwy: Record<string, Record<string, string>> } };
    expect(w.r.nazw).toBe(1); expect(w.r.pominiete).toEqual(['de: Inna']); expect(w.d.nazwy.B.de).toBe('Be'); expect(w.d.jezyki.de.autor).toMatch(/przekład API \(m, 2026-11-11\)/);
  });
  test('zestawNazw: rodzaj „nazwa”, pole „katalog” (nie „id”, które oznacza zestaw wskazówek), krótki kontekst', () => {
    const z = run(`import * as g from ${GEN}; console.log(JSON.stringify(g.zestawNazw({ nazwy: { B: { pl: 'Bé' } } }, { B: 'Bee' })))`) as { klucze: Record<string, string>[] };
    expect(z.klucze).toEqual([{ rodzaj: 'nazwa', katalog: 'B', pl: 'Bé', en: 'Bee', kontekst: expect.stringMatching(/^NAZWA ĆWICZENIA/) }]);
  });
});
