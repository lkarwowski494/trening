/*
 * L-088 (02.11.2026, wariant A): każdy krok Maestro użyty w `.maestro/**\/*.yaml` (oprócz config.yaml) ma w interpreterze (`tests/maestro-runner.ts`, metoda `step`)
 * obsługę Z EFEKTEM; krok obsłużony pustym `break` jest dozwolony tylko z powodem w `KROKI_PUSTE` (jedno miejsce). Powód: nocny E2E 57 i 58 — interpreter traktował
 * `longPressOn` jako pusty krok i przepuścił porażki, które symulator wykrył.
 * Zakres: wszystkie pliki YAML pod DIR (maestro-runner.ts:69) z podprzepływami i poleceniami zagnieżdżonymi (retry.commands, runFlow.commands).
 * Nie jest hakiem ani verify:docs (test Jest w `npm run verify`), więc przypadek „gałąź z wcześniejszymi zmianami względem main” (L-080) nie dotyczy:
 * test czyta drzewo robocze, nie historię git.
 */
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { DIR, KROKI_PUSTE, KLAWISZE_Z_EFEKTEM, WARUNKI_RUNFLOW, load } from './maestro-runner';

type Krok = unknown;
const RUNNER = readFileSync(join(__dirname, 'maestro-runner.ts'), 'utf8');

/** Etykiety `case` metody `step()` z podziałem na puste (pusty `break` albo przejście do kolejnej etykiety) i z treścią. */
export function przypadkiInterpretera(src: string): { wszystkie: string[]; puste: string[] } {
  const od = src.indexOf('async step(raw: any, file: string)'); if (od < 0) throw new Error('brak metody step() w maestro-runner.ts');
  const t = src.slice(od); const wszystkie: string[] = []; const puste: string[] = [];
  for (const m of t.matchAll(/case '(\w+)':(\s*(?:\/\*[\s\S]*?\*\/\s*)?(break;|(?=case ')))?/g)) { wszystkie.push(m[1]); if (m[3] !== undefined) puste.push(m[1]); }
  return { wszystkie, puste };
}

function pliki(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? pliki(join(dir, e.name)) : /\.ya?ml$/.test(e.name) && e.name !== 'config.yaml' ? [join(dir, e.name)] : []);
}

/** Zbiera użycia kroków: {komenda, argument} także z retry.commands i runFlow.commands. */
export function zbierzKroki(cmds: Krok): { cmd: string; arg: any }[] {
  if (!Array.isArray(cmds)) return [];
  return cmds.flatMap((raw: any) => {
    const [cmd, arg] = typeof raw === 'string' ? [raw, undefined] : Object.entries(raw)[0] as [string, any];
    return [{ cmd, arg }, ...zbierzKroki(arg && typeof arg === 'object' ? arg.commands : undefined)];
  });
}

/** Naruszenia reguły L-088 dla zebranych kroków; pusta lista = zgodne. */
export function naruszenia(kroki: { cmd: string; arg: any }[], przyp: { wszystkie: string[]; puste: string[] }, powody: Record<string, string>): string[] {
  const out: string[] = [];
  for (const cmd of new Set(kroki.map(k => k.cmd))) {
    if (!przyp.wszystkie.includes(cmd)) out.push(`krok „${cmd}” bez obsługi w interpreterze`);
    else if (przyp.puste.includes(cmd) && !(powody[cmd] ?? '').trim()) out.push(`krok „${cmd}” obsłużony pustym break bez powodu w KROKI_PUSTE`);
  }
  for (const k of kroki) {
    if (k.cmd === 'pressKey' && !KLAWISZE_Z_EFEKTEM.some(x => x.toLowerCase() === String(k.arg).toLowerCase())) out.push(`pressKey „${k.arg}” bez efektu`);
    if (k.cmd === 'runFlow' && k.arg && typeof k.arg === 'object' && k.arg.when) for (const w of Object.keys(k.arg.when)) if (!(WARUNKI_RUNFLOW as readonly string[]).includes(w)) out.push(`runFlow.when.${w} bez efektu`);
  }
  return out;
}

const przyp = przypadkiInterpretera(RUNNER);
const sciezki = pliki(DIR);
const kroki = sciezki.flatMap(p => zbierzKroki(load(p)));

describe('L-088: kroki scenariuszy Maestro mają obsługę z efektem w interpreterze', () => {
  test('zakres: znaleziono scenariusze i podprzepływy (strażnik nie jest pusty)', () => {
    expect(sciezki.length).toBeGreaterThanOrEqual(50);
    expect(sciezki.some(p => p.includes('subflows'))).toBe(true);
    expect(new Set(kroki.map(k => k.cmd)).size).toBeGreaterThanOrEqual(15);
  });

  test('każdy krok ze scenariuszy ma obsługę, a pusty — powód', () => {
    expect(naruszenia(kroki, przyp, KROKI_PUSTE)).toEqual([]);
  });

  test('lista pustych kroków zgadza się z interpreterem: każdy wpis ma powód, jest pusty w kodzie i jest użyty', () => {
    const uzyte = new Set(kroki.map(k => k.cmd));
    for (const [cmd, powod] of Object.entries(KROKI_PUSTE)) {
      expect(powod.trim().length).toBeGreaterThan(20);
      expect(przyp.puste).toContain(cmd);
      expect(uzyte.has(cmd)).toBe(true);
    }
    expect(przyp.puste.slice().sort()).toEqual(Object.keys(KROKI_PUSTE).sort());
  });

  test('zbieranie kroków sięga poleceń zagnieżdżonych (retry, runFlow.commands)', () => {
    const z = zbierzKroki([{ retry: { maxRetries: 2, commands: [{ longPressOn: 'x' }] } }, { runFlow: { when: { visible: 'a' }, commands: ['inny'] } }]);
    expect(z.map(k => k.cmd)).toEqual(['retry', 'longPressOn', 'runFlow', 'inny']);
  });

  describe('test negatywny: sztuczny scenariusz', () => {
    const sztuczny = (c: Krok) => naruszenia(zbierzKroki(c), przyp, KROKI_PUSTE);
    test('krok nieznany → czerwień (także zagnieżdżony)', () => {
      expect(sztuczny([{ tapOn: 'a' }, { nieznanyKrok: 'x' }])).toEqual(['krok „nieznanyKrok” bez obsługi w interpreterze']);
      expect(sztuczny([{ retry: { commands: [{ nieznanyKrok: 'x' }] } }])).toHaveLength(1);
    });
    test('krok pusty bez powodu → czerwień; z powodem → zgodny', () => {
      const p = { wszystkie: [...przyp.wszystkie, 'nowyPusty'], puste: [...przyp.puste, 'nowyPusty'] };
      expect(naruszenia(zbierzKroki([{ nowyPusty: 1 }]), p, KROKI_PUSTE)).toEqual(['krok „nowyPusty” obsłużony pustym break bez powodu w KROKI_PUSTE']);
      expect(naruszenia(zbierzKroki([{ nowyPusty: 1 }]), p, { ...KROKI_PUSTE, nowyPusty: ' ' })).toHaveLength(1);
      expect(naruszenia(zbierzKroki([{ nowyPusty: 1 }]), p, { ...KROKI_PUSTE, nowyPusty: 'powód' })).toEqual([]);
    });
    test('wykrywanie pustych etykiet w kodzie interpretera (pusty break, przejście, komentarz)', () => {
      const src = "async step(raw: any, file: string) {\n switch (cmd) {\n case 'a': break; /* x */\n case 'b': /* c */ break;\n case 'c': case 'd': foo(); break;\n case 'e': { bar(); break; }\n }";
      expect(przypadkiInterpretera(src)).toEqual({ wszystkie: ['a', 'b', 'c', 'd', 'e'], puste: ['a', 'b', 'c'] });
    });
    test('pressKey z nieznanym klawiszem i runFlow.when z nieznanym warunkiem → czerwień', () => {
      expect(sztuczny([{ pressKey: 'Volume Up' }])).toEqual(['pressKey „Volume Up” bez efektu']);
      expect(sztuczny([{ runFlow: { when: { platform: 'iOS' }, commands: [] } }])).toEqual(['runFlow.when.platform bez efektu']);
      expect(sztuczny([{ pressKey: 'Enter' }, { runFlow: { when: { visible: 'x' }, commands: [] } }])).toEqual([]);
    });
  });
});
