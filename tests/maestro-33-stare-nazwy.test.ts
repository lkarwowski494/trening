/**
 * L-091 (02.11.2026), akcja 1: scenariusz 33 biegnie na POPRZEDNIEJ wersji aplikacji (plik wydania, v1.0.1-b1035), której nazwy ćwiczeń są jeszcze
 * sprzed ZB-025 b (d2002a32): „Bench Press (Dumbbell)”, nie „Dumbbell Bench Press”. Interpreter Jest działa na bieżących danych, więc rozjazdu nie widzi —
 * pilnujemy go na treści scenariusza: każdy selektor ćwiczenia w 33 i w jego podprzepływach musi trafiać w nazwę ze starej wersji (pełne dopasowanie regex
 * jak w Maestro), a podprzepływy wspólne z innymi scenariuszami — nadal w nazwę bieżącą.
 * Nazwy starej wersji: `git show v1.0.1-b1035:lib/i18n.ts` (exName: EX_PAREN 'hantle' → 'Dumbbell', EX_FULL bez wpisów dla tych ćwiczeń; nazwy PL w lib/seed.ts)
 * + etykiety z components/ui.tsx („{title}, {sub}”) i „Set 1 done — {nazwa}”. Po następnym pliku wydania ten test i alternatywy znikają (docs/zobowiazania.md).
 */
import { readFileSync } from 'fs';
import { join } from 'path';
const yaml = require('js-yaml');

const DIR = join(__dirname, '..', '.maestro');
const OLD = ['Bench Press (Dumbbell), dumbbells', 'Bench Press (Dumbbell)', 'Bent Over Row (Dumbbell), dumbbells', 'Bent Over Row (Dumbbell)', 'Set 1 done — Bench Press (Dumbbell)'];
const NEW = ['Dumbbell Bench Press, dumbbells', 'Dumbbell Bench Press', 'Dumbbell Bent-Over Row, dumbbells', 'Dumbbell Bent-Over Row', 'Set 1 done — Dumbbell Bench Press'];

const load = (f: string): any[] => { const d = yaml.loadAll(readFileSync(join(DIR, f), 'utf8')); return d[d.length - 1] as any[]; };
/** Selektory tekstowe (stringi regex) z komend, rekurencyjnie przez runFlow (plik albo commands). */
function selectors(cmds: any[], out: { f: string; sel: string }[] = [], f = ''): { f: string; sel: string }[] {
  for (const c of cmds) {
    if (typeof c === 'string') continue;
    for (const [k, v] of Object.entries(c)) {
      const add = (s: unknown) => { if (typeof s === 'string') out.push({ f, sel: s }); };
      if (k === 'runFlow') { if (typeof v === 'string') selectors(load(v), out, v); else if ((v as any).file) selectors(load((v as any).file), out, (v as any).file); else if ((v as any).commands) selectors((v as any).commands, out, f); }
      else if (k === 'retry' || k === 'repeat') selectors((v as any).commands ?? [], out, f);
      else if (k === 'tapOn' || k === 'assertVisible' || k === 'assertNotVisible') add(typeof v === 'string' ? v : (v as any)?.text);
      else if (k === 'inputText' && typeof v === 'string' && /Bench|Bent|Row/.test(v)) out.push({ f: f + '#input', sel: v });
      else if (k === 'extendedWaitUntil') add((v as any)?.visible);
      else if (k === 'scrollUntilVisible') add(typeof (v as any)?.element === 'string' ? (v as any).element : (v as any)?.element?.text);
    }
  }
  return out;
}
const full = (sel: string, label: string) => new RegExp(`^(?:${sel})$`).test(label);
const all33 = selectors(load('33-aktualizacja-przygotuj.yaml'));
const exercise = all33.filter(s => !s.f.endsWith('#input') && /Bench Press|Bent.Over Row/.test(s.sel));
const inputs = all33.filter(s => s.f.endsWith('#input'));

describe('L-091: scenariusz 33 na nazwach ćwiczeń POPRZEDNIEJ wersji (v1.0.1-b1035)', () => {
  it('znajduje selektory ćwiczeń w 33 i w jego podprzepływach (strażnik nie jest pusty)', () => {
    expect(exercise.map(s => s.f)).toEqual(expect.arrayContaining(['', 'subflows/szablon-testowy.yaml']));
    expect(exercise.length).toBeGreaterThanOrEqual(5);
  });
  it.each(exercise.map(s => [s.f || '33', s.sel]))('%s: selektor „%s” trafia w nazwę ze starej wersji', (_f, sel) => {
    expect(OLD.some(l => full(sel as string, l))).toBe(true);
  });
  it.each(exercise.map(s => [s.f || '33', s.sel]))('%s: selektor „%s” nadal trafia w nazwę bieżącą (pozostałe scenariusze, 34)', (_f, sel) => {
    expect(NEW.some(l => full(sel as string, l))).toBe(true);
  });
  it.each(inputs.map(s => [s.sel]))('wpisane w wyszukiwarce „%s” znajduje ćwiczenie w starej wersji (małe litery, bez myślnika — stare składanie go nie usuwa)', q => {
    const male = (x: string) => x.toLowerCase().replace(/\s+/g, ' ').trim();
    expect(OLD.some(l => male(l).includes(male(q as string)))).toBe(true);
  });
  it('wyszukiwarka ma zapytania dla obu ćwiczeń szablonu', () => { expect(inputs.map(s => s.sel)).toEqual(['Bench Press', 'Bent Over Row']); });
});
