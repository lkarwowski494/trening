/**
 * Wydanie 0.13.0 (polecenie właściciela 12.10.2026): cztery zakładki, masa ciała w Postępach, import CSV, strona wsparcia.
 * Wpis „Co nowego” 0.13 (id '2026-10-11') jest historyczny — bieżący wpis i wersja projektu: release-0.14.test.tsx.
 */
import { WHATS_NEW } from '@/lib/whatsnew';
import { LANGS, applyLang, tIn } from '@/lib/i18n';

const fs = require('fs') as typeof import('fs'); const path = require('path') as typeof import('path');
const J = (f: string) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'));
afterEach(() => { applyLang('pl'); });
const E = () => WHATS_NEW.find(e => e.id === '2026-10-11')!;

const IMPORT = 'Import historii treningów z plików CSV popularnych dzienników (Więcej → Kopia zapasowa → „Importuj historię z pliku CSV”), z podglądem przed zapisem.';

describe('wydanie 0.13.0', () => {
  test('wpis 0.13 (id 2026-10-11) jest pod bieżącym; jeśli ma build, to nowszy niż 1008; pod nim 0.12 z buildem 1008', () => {
    const cur = E(); const prev = WHATS_NEW[WHATS_NEW.indexOf(cur) + 1];
    expect([cur.id, prev.id, prev.build, prev.date]).toEqual(['2026-10-11', '2026-10-10', 1008, '2026-10-12']);
    expect(cur.build).toBe(1009); /* build 0.13.0 = 1009 (TestFlight run 38294805184, 12.10.2026) */
  });
  test('wpis 0.13 po polsku: układ zakładek, Postępy, import CSV (nazwa przycisku jak w ekranie); 2–10 punktów', () => {
    const it = E().items();
    expect(it.length).toBeGreaterThanOrEqual(2); expect(it.length).toBeLessThanOrEqual(10);
    expect(it[0]).toMatch(/^Cztery zakładki/); expect(it[1]).toMatch(/Postępy mają własną zakładkę/);
    expect(it).toContain(IMPORT);
  });
  test('wpis 0.13 nie zawiera nazw innych aplikacji (wytyczne 2.3.7 / 5.2.1)', () => {
    expect(E().items().join(' ')).not.toMatch(/strong|hevy|fitbod|jefit|strava|fitnotes/i);
  });
  test('wszystkie języki: punkt o imporcie przetłumaczony, bez „{”, zakończony kropką („。” w ja/zh-Hant), zawiera nazwę przycisku ze słownika', () => {
    for (const l of LANGS) { if (l === 'pl') continue; applyLang(l);
      const x = E().items()[3]; const btn = tIn(l, 'Importuj historię z pliku CSV');
      expect([l, x === IMPORT || /[{}]/.test(x) || !/[.。]$/.test(x)]).toEqual([l, false]);
      expect([l, x.includes(btn)]).toEqual([l, true]); }
  });
  test('francuski: NBSP wewnątrz cudzysłowu; angielski: „More → Backup”', () => {
    applyLang('fr'); expect(E().items()[3]).toMatch(/« Importer.* »/);
    applyLang('en'); expect(E().items()[3]).toContain('More → Backup');
  });
});
