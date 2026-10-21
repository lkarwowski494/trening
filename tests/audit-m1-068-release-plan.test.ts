/*
 * M1-audytor-generalny-068 (DEC-22 a): zapisany plan wydania 1.0 — docs/42-plan-wydania-1.0.md: wydanie 1.0 ręcznie po kontroli na telefonie, aktualizacje stopniowo 7 dni,
 * postępowanie przy złym buildzie. Dokument jest punktem listy kontrolnej drogi do App Store (docs/41, F3) i odsyła do rejestru ryzyk (otwarte ryzyko blokuje wydanie).
 */
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const exists = (f: string) => fs.existsSync(path.join(ROOT, f));
const PLAN = 'docs/42-plan-wydania-1.0.md';

describe('docs/42: plan wydania 1.0', () => {
  test('dokument istnieje ze wszystkimi częściami planu', () => {
    expect(exists(PLAN)).toBe(true); const d = read(PLAN);
    for (const h of ['## 1. Bramki przed wysłaniem do recenzji', '## 2. Wydanie 1.0 — ręcznie, po kontroli na telefonie', '## 3. Aktualizacje — wydanie stopniowe przez 7 dni', '## 4. Zły build', '## 5. Lista kontrolna wydania 1.0']) expect(d).toContain(h);
  });
  test('wydanie stopniowe: tabela dni 1–7 z procentami z dokumentacji Apple, adres i data odczytu', () => {
    const d = read(PLAN);
    expect(d).toMatch(/developer\.apple\.com\/help\/app-store-connect\/update-your-app\/release-a-version-update-in-phases/); expect(d).toMatch(/odczytano 20\.10\.2026/);
    for (const [day, pct] of [[1, 1], [2, 2], [3, 5], [4, 10], [5, 20], [6, 50], [7, 100]]) expect(d).toMatch(new RegExp(`\\| ${day} \\| ${pct}% \\|`));
    expect(d).toMatch(/pause[^\n]*30 days/i);
  });
  test('wydanie 1.0 ręczne (D-5 A) — pierwsze wydanie nie ma etapowania; kontrola na telefonie (docs/39)', () => {
    const d = read(PLAN); expect(d).toMatch(/D-5/); expect(d).toMatch(/docs\/39/); expect(d).toMatch(/Release/);
  });
  test('zły build: kroki (wstrzymanie etapowania, poprawka, lekcja w docs/40) i oznaczenie nieprzeczytanych zasad Apple jako otwarte', () => {
    const d = read(PLAN); const s = d.slice(d.indexOf('## 4. Zły build'), d.indexOf('## 5.'));
    expect(s).toMatch(/Pause Phased Release/); expect(s).toMatch(/docs\/40/); expect(s).toMatch(/testflight\.yml/); expect(s).toMatch(/DO PRZECZYTANIA/);
  });
  test('bramki: każde otwarte ryzyko z rejestru docs/40 jest wymienione z identyfikatorem', () => {
    const open = read('docs/40-lekcje.md').split('\n').filter((l) => /^\| R-\d{3} \|/.test(l) && !/zamknięte/.test(l.split('|')[4] ?? '')).map((l) => l.split('|')[1].trim());
    expect(open.length).toBeGreaterThan(0); const d = read(PLAN);
    for (const id of open) expect(d).toContain(id);
  });
  test('wszystkie odwołania do plików w planie istnieją', () => {
    const d = read(PLAN); const refs = [...d.matchAll(/`((?:docs|scripts|store|tests|\.github\/workflows|lib)\/[A-Za-z0-9_./-]+\.(?:md|mjs|json|ya?ml|ts|tsx|storekit))`/g)].map((m) => m[1]);
    expect(refs.length).toBeGreaterThan(5); for (const f of refs) expect({ f, ok: exists(f) }).toEqual({ f, ok: true });
  });
  test('docs/41 ma punkt F3 odsyłający do planu; plan nie zmienia modelu monetyzacji (bez kwot poza odsyłaczem do docs/monetyzacja.md)', () => {
    expect(read('docs/41-droga-do-app-store.md')).toMatch(/\| F3 \|[^\n]*docs\/42-plan-wydania-1\.0\.md/);
    expect(read(PLAN)).not.toMatch(/\d+[.,]\d{2}\s*(USD|EUR|GBP|zł)/);
  });
});
