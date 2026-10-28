/*
 * Decyzja właściciela 10a (28.10.2026), znalezisko 09-lokalizacja-005 (zmienia M1-039): etykieta jednostki masy jest LOKALNA w piśmie cyrylicy i greki
 * (ru, uk, bg, sr, el), a wartość logiczna jednostki (wu(): 'kg' | 'lb') zostaje w danych, CSV, kopii i porównaniach. Rodzaje (docs/20): logika (etykieta vs wartość),
 * macierz języków (35), dane (CSV/kopia bez zmian), niezmiennik/strażnik (wartość logiczna nie trafia do t() ani do tekstu).
 */
import * as fs from 'fs';
import * as path from 'path';
import { applyLang } from '@/lib/i18n';
import { LANGS, type Lang } from '@/lib/i18n';
import { applyUnit, wu, unitLabel, distLabel, distLongLabel, fmtW, fmtVol } from '@/lib/units';
import { distParts } from '@/lib/live';
import { buildCsv, buildBackup } from '@/lib/backup';
import { loadLabelShort, loadLabel } from '@/lib/state/sets';
import * as store from '@/lib/store';
import { fresh, addWorkout, ex } from './helpers';

const root = path.join(__dirname, '..');
afterEach(() => { applyLang('pl'); applyUnit('kg'); });

/** Oczekiwane symbole (do przeglądu recenzent-lokalizacji): tylko ru, uk, bg, sr, el różnią się od łacinki. */
const KG: Partial<Record<Lang, string>> = { ru: 'кг', uk: 'кг', bg: 'кг', sr: 'кг', el: 'κιλά' };
const LB: Partial<Record<Lang, string>> = { ru: 'фнт', uk: 'фнт', sr: 'фнт' };

describe('etykieta jednostki masy — macierz języków', () => {
  test.each(LANGS as readonly string[])('%s: kg i lb (etykieta, fmtW, fmtVol); logiczne wu() bez zmian', (l) => {
    applyLang(l as Lang);
    applyUnit('kg'); expect(wu()).toBe('kg'); expect(unitLabel()).toBe(KG[l as Lang] ?? 'kg');
    expect(fmtW(80)).toBe(`80 ${KG[l as Lang] ?? 'kg'}`); expect(fmtVol(1234)).toBe(`1234 ${KG[l as Lang] ?? 'kg'}`);
    applyUnit('lb'); expect(wu()).toBe('lb'); expect(unitLabel()).toBe(LB[l as Lang] ?? 'lb');
    expect(fmtW(45.359237).endsWith(` ${LB[l as Lang] ?? 'lb'}`)).toBe(true);
  });
  test('ru: etykiety pól (placeholder, dostępność) używają lokalnego symbolu, nie łacinki', async () => {
    await fresh();
    applyLang('ru'); applyUnit('kg');
    const e = ex('Back Squat');
    expect(loadLabelShort(e)).toBe('кг'); expect(loadLabel(e)).toBe('кг'); expect(loadLabelShort(e)).not.toMatch(/kg/);
  });
  test('dystans: etykieta pola jak w fmtDist (ru: „м”, imperialny „ярд”)', () => {
    applyLang('ru'); applyUnit('kg'); expect(distLabel()).toBe('м'); applyUnit('lb'); expect(distLabel()).toBe('ярд');
    applyLang('pl'); applyUnit('kg'); expect(distLabel()).toBe('m'); applyUnit('lb'); expect(distLabel()).toBe('yd');
  });
});

describe('dystans na ekranie blokady i zegarku: etykieta ze słownika (distParts, distLongLabel)', () => {
  test('ru i pl, metryczny i imperialny: m / yd / mi lokalnie', () => {
    applyLang('ru'); applyUnit('kg'); expect(distParts(30)).toEqual({ num: '30', unit: 'м' }); expect(distLongLabel()).toBe('км');
    applyUnit('lb'); expect(distParts(30)).toEqual({ num: '33', unit: 'ярд' }); expect(distParts(5000).unit).toBe('ми'); expect(distLongLabel()).toBe('ми');
    applyLang('uk'); expect(distLongLabel()).toBe('ми'); applyLang('pl'); expect(distLongLabel()).toBe('mi'); applyUnit('kg'); expect(distLongLabel()).toBe('km');
  });
});

describe('dane: CSV i kopia zapasowa zostają w kg/lb łacinką niezależnie od języka', () => {
  beforeEach(async () => { await fresh(); addWorkout(Date.now() - 864e5, [['Back Squat', [{ weight: 100, reps: 5 }]]]); });
  test('ru + kg: CSV bez znaków cyrylicy z jednostką; ru + lb: kolumny „Weight Unit” = lb, „Distance Unit” = m', () => {
    applyLang('ru'); applyUnit('kg'); const kg = buildCsv(); expect(kg).not.toMatch(/кг|фнт/);
    applyUnit('lb'); const lbCsv = buildCsv(); const [head, row] = lbCsv.split('\n'); expect(head.endsWith(',Weight Unit,Distance Unit')).toBe(true); expect(row.endsWith(',lb,m')).toBe(true);
    expect(lbCsv).not.toMatch(/кг|фнт|ярд/);
  });
  test('CSV i kopia są takie same w ru i pl (tylko jednostka wyświetlania wpływa na liczby, nie język)', () => {
    applyUnit('kg'); applyLang('pl'); const a = buildCsv(); const ba = buildBackup(); applyLang('ru'); expect(buildCsv()).toBe(a);
    const bb = buildBackup(); expect(JSON.parse(JSON.stringify(bb)).settings?.unit).toBe(JSON.parse(JSON.stringify(ba)).settings?.unit);
    expect(store.getState().settings.unit === 'kg' || store.getState().settings.unit === undefined).toBe(true);
  });
});

describe('strażnik: wartość logiczna jednostki nie trafia do tekstu ani do t()', () => {
  const files: string[] = [];
  const walk = (d: string) => { for (const f of fs.readdirSync(path.join(root, d), { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) walk(p); else if (/\.(ts|tsx)$/.test(f.name) && !/\.generated\.ts$/.test(f.name)) files.push(p); } };
  ['app', 'components', 'lib'].forEach(walk);
  test('wu() wolno tylko w porównaniu z \'lb\' (=== / !==); do wyświetlania służy unitLabel()', () => {
    const bad: string[] = [];
    for (const f of files) {
      if (f === path.join('lib', 'units.ts')) continue;
      fs.readFileSync(path.join(root, f), 'utf8').split('\n').forEach((line, i) => {
        const code = line.replace(/\/\*.*?\*\//g, '').replace(/\/\/.*$/, '');
        for (const m of code.matchAll(/(?<!'\|'\s\+\s)\bwu\(\)(?!\s*[!=]==\s*'lb')/g)) { void m; bad.push(`${f}:${i + 1}`); }
      });
    }
    expect(bad).toEqual([]);
  });
  test('żaden t()/tr()/tp() nie dostaje wartości logicznej jako klucza ani parametru', () => {
    const bad: string[] = [];
    for (const f of files) fs.readFileSync(path.join(root, f), 'utf8').split('\n').forEach((line, i) => {
      if (/\b(?:t|tr|tp)\(\s*(?:wu\(\)|unit\b)/.test(line) || /\bu:\s*(?:wu\(\)|unit\b|spec\.unit)/.test(line) || /\$\{(?:spec|s)\.unit\}/.test(line)) bad.push(`${f}:${i + 1}`);
    });
    expect(bad).toEqual([]);
  });
});
