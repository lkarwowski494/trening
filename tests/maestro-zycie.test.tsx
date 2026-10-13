/*
 * Scenariusze E2E „z życia” 31–35 (decyzja właściciela 13.10.2026, docs/31): pokrycie ekranów, kolejność i tagi w config.yaml, krok „Aktualizacja”
 * w e2e-ios.yml (poprzednia wersja → dane → bieżąca bez odinstalowania), odporność na dzień tygodnia / granicę miesiąca / północ (MAESTRO_NOW).
 * Sam przebieg każdego scenariusza w interpreterze: tests/maestro-flows.test.tsx.
 */
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { Runner, DIR, load } from './maestro-runner';

jest.setTimeout(240000);
const root = join(__dirname, '..');
const read = (p: string) => readFileSync(join(root, p), 'utf8');
const doc31 = read('docs/31-scenariusze-z-zycia.md');
const files = readdirSync(DIR).filter(f => /^\d\d-.*\.yaml$/.test(f)).sort();
/* 35 (jak 21) działa w buildzie E2E ze sztucznym sklepem — zmienna i adapter jak w tests/maestro-flows.test.tsx */
const run = async (f: string) => {
  const { resetStoreAdapterForTests } = require('@/lib/store-adapter'); const { resetEntitlementsForTests } = require('@/lib/entitlement');
  if (f.startsWith('35-')) process.env.EXPO_PUBLIC_STORE_FAKE = '1'; resetStoreAdapterForTests(); resetEntitlementsForTests();
  try { const r = new Runner(f); await r.run(load(join(DIR, f)), f); } finally { delete process.env.EXPO_PUBLIC_STORE_FAKE; resetStoreAdapterForTests(); resetEntitlementsForTests(); }
};

describe('docs/31 — pokrycie', () => {
  test('każdy EKRAN z docs/19 ma wiersz w tabeli pokrycia docs/31 z co najmniej jednym istniejącym scenariuszem', () => {
    const routes = [...read('docs/19-macierz-testow.md').split('## EKRAN')[1].split('\n## ')[0].matchAll(/^\| (\/\S*) \|/gm)].map(m => m[1]);
    expect(routes.length).toBeGreaterThanOrEqual(28);
    const rows = new Map<string, string>(); for (const m of doc31.matchAll(/^\| `(\/[^`]*)`[^|]*\| ([^|]+) \|/gm)) rows.set(m[1].replace(/\/\[id\]$/, ''), m[2]);
    const nums = new Set(files.map(f => f.slice(0, 2)));
    const bad: string[] = [];
    for (const r of new Set(routes)) {
      const key = r === '/more/location' ? '/more/location' : r;
      const cell = rows.get(key); if (!cell) { bad.push(`${r}: brak wiersza`); continue; }
      const ids = [...cell.replace(/\*/g, '').matchAll(/\b(\d\d)(?:–(\d\d))?\b/g)].flatMap(m => m[2] ? Array.from({ length: +m[2] - +m[1] + 1 }, (_, i) => String(+m[1] + i).padStart(2, '0')) : [m[1]]);
      if (!ids.length || !ids.every(i => nums.has(i))) bad.push(`${r}: scenariusze „${cell.trim()}” — brak pliku`);
    }
    expect(bad).toEqual([]);
  });
  test('czego nie ma w CI, ma powód i odesłanie (sekcja „Czego nie da się w CI”, każda pozycja z odesłaniem do telefonu albo testu)', () => {
    const sec = doc31.split('## 4.')[1].split('\n## ')[0];
    const rows = sec.split('\n').filter(l => /^\| /.test(l) && !/^\|[- |]+$/.test(l)).slice(1);
    expect(rows.length).toBeGreaterThanOrEqual(7);
    for (const r of rows) { const c = r.split('|').map(x => x.trim()).filter(Boolean); expect(c.length).toBe(3); expect(c.every(x => x.length > 20)).toBe(true); }
    for (const must of ['zablokowany ekran', 'Zdrowia', 'StoreKit', 'plik']) expect(sec).toContain(must);
  });
});

describe('config.yaml i workflow', () => {
  test('31–35 po 21 i 22, w tej kolejności; 33–34 z tagiem aktualizacja, reszta bez', () => {
    const cfg = read('.maestro/config.yaml'); const list = [...cfg.matchAll(/^\s+- (\d\d-.*\.yaml)$/gm)].map(m => m[1]);
    expect(list.slice(-7).map(f => f.slice(0, 2))).toEqual(['21', '22', '31', '32', '33', '34', '35']);
    for (const f of files) expect([f, /^tags:\n\s+- aktualizacja$/m.test(read('.maestro/' + f))]).toEqual([f, /^3[34]-/.test(f)]);
  });
  test('e2e-ios.yml: główny przebieg wyklucza tag, krok Aktualizacja: poprzednia wersja → 33 → bieżąca bez uninstall → 34; uprawnienia bez zmian', () => {
    const y = read('.github/workflows/e2e-ios.yml');
    expect((y.match(/test "\$DIR" --exclude-tags=aktualizacja /g) || []).length).toBe(2); expect(y).toMatch(/tylko_scenariusze:/); expect(y).toMatch(/DIR=\.maestro-wybrane/);
    expect(y).toMatch(/poprzednia_wersja_z_przebiegu:/); expect(y).toMatch(/permissions:\n\s+contents: read\n\s+actions: read/);
    const upd = y.split('Aktualizacja (poprzednia wersja')[1]; expect(upd).toBeTruthy();
    const a = upd.indexOf('simctl uninstall'), b = upd.indexOf('33-aktualizacja-przygotuj.yaml'), c = upd.indexOf('simctl install "$SIM" "$NEW"'), d = upd.indexOf('34-aktualizacja-sprawdz.yaml');
    expect([a, b, c, d].every(x => x > 0) && a < b && b < c && c < d).toBe(true);
    expect(upd.slice(c, d)).not.toMatch(/uninstall/); /* bieżąca wersja instalowana na tej samej instalacji */
    expect(y).toMatch(/--branch main --status success/); expect(y).not.toMatch(/pull_request|contents: write/);
  });
});

describe('para 33 + 34 (aktualizacja)', () => {
  test('34 po 33 przechodzi (restart na tych samych danych), a 34 na pustej instalacji pada — sprawdza prawdziwe dane', async () => {
    await run('33-aktualizacja-przygotuj.yaml'); await run('34-aktualizacja-sprawdz.yaml');
    await expect(run('34-aktualizacja-sprawdz.yaml')).rejects.toThrow(/krok:/); /* po zakończeniu treningu w 34 nie ma już treningu w toku */
  });
  test('34 pada, gdy trening w toku zginął (dane z pustej instalacji zamiast zachowanych)', async () => {
    const r = new Runner('x'); await r.step({ launchApp: { clearState: true } }, 'x');
    await expect(run('34-aktualizacja-sprawdz.yaml')).rejects.toThrow(/Pause workout|krok:/);
  });
});

describe('odporność na zegar (MAESTRO_NOW): niedziela, poniedziałek, północ — regresje z 13.10.2026', () => {
  const at = async (iso: string, fs: string[]) => { process.env.MAESTRO_NOW = iso; try { for (const f of fs) { await run(f); if (f.startsWith('33-')) await run('34-aktualizacja-sprawdz.yaml'); } } finally { delete process.env.MAESTRO_NOW; } };
  test('niedziela 1.11.2026 i poniedziałek 2.11.2026 (miesiąc się zmienia, dłuższa lista przesunięć): 13 i 32', async () => { await at('2026-11-01T10:00:00', ['13-kalendarz-plan.yaml', '32-regularny-uzytkownik.yaml']); await at('2026-11-02T10:00:00', ['32-regularny-uzytkownik.yaml']); });
  test('tuż przed północą (13.10, 23:59): para 33 + 34 — sesje z dwóch dni, bez „dziś”', async () => { await at('2026-10-13T23:59:00', ['33-aktualizacja-przygotuj.yaml']); });
  test('poniedziałek 12.10 i niedziela 18.10: 31 (treningi wstecz w poprzednim tygodniu) i 35', async () => { await at('2026-10-12T10:00:00', ['31-pierwszy-tydzien.yaml']); await at('2026-10-18T20:00:00', ['31-pierwszy-tydzien.yaml', '35-ustawienia-dostepnosc.yaml']); });
});
