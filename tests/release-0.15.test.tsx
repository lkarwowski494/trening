/**
 * Wydanie 0.15.0 (docs/18): aktualizacja biblioteki Apple Health 8 → 16 (zapis treningów do Zdrowia bez zmian dla użytkownika), strona WWW w site/
 * (tylko repo), parafrazy wskazówek techniki w EN. Wpis „Co nowego” (id '2026-10-13', data 12.10.2026, build 1012) jest historyczny od 0.16 — bieżący wpis i wersja projektu: release-0.16.test.tsx.
 */
import { WHATS_NEW } from '@/lib/whatsnew';
import { LANGS, applyLang, tIn } from '@/lib/i18n';

const fs = require('fs') as typeof import('fs'); const path = require('path') as typeof import('path');
const J = (f: string) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'));
afterEach(() => { applyLang('pl'); });
const E = () => WHATS_NEW.find(e => e.id === '2026-10-13')!;
const A = 'Aktualizacja współpracy z Apple Health — zapis treningów działa jak dotąd.';
const B = 'Poprawione sformułowania części wskazówek techniki.';

describe('wydanie 0.15.0', () => {
  test('app.json, package.json i package-lock.json (projekt) — wersja bieżąca (od 0.17: release-0.17.test.tsx), 0.15.0 było wydane', () => {
    const lock = J('package-lock.json');
    expect([J('app.json').expo.version, J('package.json').version, lock.version, lock.packages[''].version]).toEqual(['0.17.0', '0.17.0', '0.17.0', '0.17.0']);
  });
  test('wpis 0.15 (id 2026-10-13, historyczny; bieżący 0.16: release-0.16.test.tsx), data 2026-10-12, build 1012 (TestFlight 38355743899; 1011 przepadł); pod nim 0.14 (2026-10-12, build 1010)', () => {
    const cur = E(); const prev = WHATS_NEW[WHATS_NEW.indexOf(cur) + 1];
    expect([cur.id, cur.date, prev.id]).toEqual(['2026-10-13', '2026-10-12', '2026-10-12']);
    expect(cur.build).toBe(1012);
    expect(prev.build).toBe(1010);
  });
  test('wpis 0.15 po polsku: Apple Health i wskazówki techniki; 2–10 punktów, każdy kończy się kropką', () => {
    expect(E().items()).toEqual([A, B]);
  });
  test('wpis 0.15 nie zawiera nazw innych aplikacji (wytyczne 2.3.7 / 5.2.1)', () => {
    expect(E().items().join(' ')).not.toMatch(/strong|hevy|fitbod|jefit|strava|fitnotes/i);
  });
  test('wszystkie języki: dwa punkty przetłumaczone, bez „{”, kropka („。” w ja/zh-Hant), nazwa Apple Health zachowana', () => {
    for (const l of LANGS) { if (l === 'pl') continue; applyLang(l);
      const it = E().items();
      expect([l, it.length]).toEqual([l, 2]);
      expect([l, it.filter(x => /[{}]/.test(x) || !/[.。]$/.test(x))]).toEqual([l, []]);
      expect([l, it.filter((x, i) => x === [A, B][i])]).toEqual([l, []]);
      expect([l, /Apple[\s ]Health/.test(it[0])]).toEqual([l, true]);
      expect([l, tIn(l, A) === it[0]]).toEqual([l, true]); }
  });
  test('angielski i francuski (NBSP przed półpauzą i wewnątrz nazwy)', () => {
    applyLang('en'); expect(E().items()).toEqual(['Updated integration with Apple Health — saving workouts works as before.', 'Reworded some of the technique tips.']);
    applyLang('fr'); expect(E().items()[0]).toContain('Apple Health —');
  });
});
