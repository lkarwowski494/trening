/*
 * Strażnik zegara w testach (07-jakosc-001/-005, 01.11.2026; mechanizm, nie postanowienie). Dwie reguły dla plików tests/*.test.ts(x):
 *  (1) KALENDARZ NA PRAWDZIWYM ZEGARZE: test, który z bieżącej daty buduje daty kalendarza (new Date().getMonth()/getFullYear()/getDate()/getDay(), `const now|today = new Date()`),
 *      a nie przypina zegara (pinDate, jest.useFakeTimers/setSystemTime, spyOn(Date), PIN_NOW), pada w konkretne dni (1. dzień miesiąca, poniedziałek rano, przełom roku —
 *      tak padł tests/history-calendar.test.tsx 1.11.2026). Wzorzec naprawy: pinDate z tests/helpers.ts + jawne przypadki brzegowe.
 *  (2) CZAS WYKONANIA W ASERCJI: `expect(... Date.now() - t0 ...)` (t0 wzięte z Date.now()/performance.now()) uzależnia wynik od szybkości maszyny. Pomiar wydajności — względnie
 *      (tests/perf-wzgledny.ts) albo w `npm run perf` (scripts/perf).
 * Wyjątki tylko z powodem w tests/zegar-wyjatki.json (plik → powód); wyjątek, który przestał być potrzebny, też jest błędem (lista nie gnije).
 * L-080 (strażnik procesu na gałęzi długo żyjącej): skan obejmuje CAŁE drzewo tests/ z dysku, nie różnicę względem main ani historię gita — plik zmieniony we wcześniejszym
 * commicie na gałęzi jest sprawdzany tak samo (test niżej pilnuje, że skan nie sięga do gita).
 */
import * as fs from 'fs';
import * as path from 'path';

const DIR = __dirname;
const PRZYPIECIE = /pinDate\(|useFakeTimers|setSystemTime|PIN_NOW|spyOn\(Date|spyOn\(global,\s*'Date'/;
const KALENDARZ = [/new Date\(\)[^;\n]*\.(getMonth|getFullYear|getDate|getDay)\(/, /(?:const|let)\s+(?:now|today|teraz|dzis)\s*=\s*new Date\(\)\s*[;,]/];
const START = /\b(\w+)\s*=\s*(?:Date\.now\(\)|performance\.now\(\)|realNow\(\))\s*[;,]/g;

/** Plik używa kalendarza z prawdziwego zegara bez przypięcia. */
function kalendarzNaZegarze(src: string): boolean { return !PRZYPIECIE.test(src) && KALENDARZ.some(r => r.test(src)); }
/** Linie z asercją czasu wykonania (expect z różnicą „teraz − start”, start zapisany z zegara). */
function asercjeCzasuWykonania(src: string): string[] {
  const starty = new Set([...src.matchAll(START)].map(m => m[1])); const out: string[] = [];
  for (const line of src.split('\n')) {
    for (const m of line.matchAll(/expect\([^;]*?(?:Date\.now\(\)|performance\.now\(\)|realNow\(\))\s*-\s*(\w+)/g)) if (starty.has(m[1])) { out.push(line.trim().slice(0, 140)); break; }
  }
  return out;
}

const pliki = fs.readdirSync(DIR).filter(f => /\.test\.tsx?$/.test(f) && f !== 'straznik-zegar.test.ts');
const wyjatki = JSON.parse(fs.readFileSync(path.join(DIR, 'zegar-wyjatki.json'), 'utf8')) as Record<string, string>;
const zrodlo = (f: string) => fs.readFileSync(path.join(DIR, f), 'utf8');

describe('detektory (przypadki syntetyczne)', () => {
  test('kalendarz z prawdziwego zegara: wykrywa, a przypięcie albo data jawna zwalnia', () => {
    expect(kalendarzNaZegarze('const now = new Date(); const d = new Date(now.getFullYear(), 3, 1);')).toBe(true);
    expect(kalendarzNaZegarze('const y = new Date().getFullYear();')).toBe(true);
    expect(kalendarzNaZegarze("const unpin = pinDate('2026-10-15T20:00:00'); const now = new Date();")).toBe(false);
    expect(kalendarzNaZegarze('jest.useFakeTimers(); jest.setSystemTime(1); const now = new Date();')).toBe(false);
    expect(kalendarzNaZegarze('const t = new Date(2026, 9, 1).getMonth(); const iso = new Date().toISOString();')).toBe(false);
  });
  test('czas wykonania w asercji: wykrywa różnicę od startu z zegara; stała data bazowa i pomiar bez asercji — nie', () => {
    expect(asercjeCzasuWykonania('const t0 = Date.now(); work(); expect((Date.now() - t0) / n).toBeLessThan(15);')).toHaveLength(1);
    expect(asercjeCzasuWykonania('let t0 = realNow(); x(); expect([k, (Date.now() - t0) / N < 60]).toEqual([k, true]);')).toHaveLength(1);
    expect(asercjeCzasuWykonania('const T0 = new Date(2026, 9, 8).getTime(); expect(Math.round((Date.now() - T0) / 1000)).toBe(5);')).toEqual([]);
    expect(asercjeCzasuWykonania('const t0 = performance.now(); x(); const d = performance.now() - t0; expect(Number.isFinite(d)).toBe(true);')).toEqual([]);
  });
});

describe('drzewo tests/ (cały skan, bez gita — L-080)', () => {
  test('żaden test nie buduje dat kalendarza z prawdziwego zegara bez przypięcia (poza wyjątkami z powodem)', () => {
    const zle = pliki.filter(f => kalendarzNaZegarze(zrodlo(f)) && !wyjatki[f]);
    expect(zle).toEqual([]);
  });
  test('żaden test nie asercjonuje czasu wykonania w ms (wydajność: tests/perf-wzgledny.ts albo npm run perf)', () => {
    const zle = pliki.flatMap(f => asercjeCzasuWykonania(zrodlo(f)).map(l => `${f}: ${l}`)).filter(l => !wyjatki[l.split(':')[0]]);
    expect(zle).toEqual([]);
  });
  test('wyjątki mają powód i dotyczą istniejących plików, które nadal łamią regułę (lista nie gnije)', () => {
    for (const [f, powod] of Object.entries(wyjatki)) {
      expect([f, pliki.includes(f)]).toEqual([f, true]); expect([f, powod.trim().length > 30]).toEqual([f, true]);
      expect([f, kalendarzNaZegarze(zrodlo(f)) || asercjeCzasuWykonania(zrodlo(f)).length > 0]).toEqual([f, true]);
    }
  });
  test('skan nie sięga do gita ani do różnicy względem main (plik zmieniony we wcześniejszym commicie na gałęzi jest sprawdzany tak samo)', () => {
    const importy = [...fs.readFileSync(__filename, 'utf8').matchAll(/^import .* from '([^']+)'/gm)].map(m => m[1]);
    expect(importy).toEqual(['fs', 'path']); /* tylko system plików: bez child_process, bez narzędzi gita */
    expect(pliki.length).toBeGreaterThan(100); /* skan widzi całe drzewo */
  });
});
