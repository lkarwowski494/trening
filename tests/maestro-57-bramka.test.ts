/*
 * Scenariusz 57 a bramka 4 (noc 41347718181, 02.11.2026): rysunek v2 pokazuje tylko rodzina z wpisem recenzji ruchu (lib/figures/data.json, pole v2).
 * Stary 57 (f77db9b) miał twarde kroki rysunku także dla Pull-Up, której karta (pull_up poza v2 do wdrożenia decyzji C, docs/18 02.11) ma same wskazówki tekstowe.
 * Interpreter działa tu na PRAWDZIWEJ bramce (bez podmiany data.json), czyli tak jak symulator.
 * 1) stary 57 pada w kroku rysunku Pull-Up; 2) nowy przechodzi; 3) Back Squat zostaje twardy (znika rysunek squat -> scenariusz czerwony);
 * 4) strażnik: pull_up w v2 => warunkowy runFlow musi zniknąć.
 */
import { execFileSync } from 'child_process';
import { mkdtempSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { Runner, DIR, load } from './maestro-runner';
import figures from '@/lib/figures/data.json';

jest.setTimeout(240000);
const FILE = '57-grafika-cwiczenia.yaml';
type Cmd = any;
const run = (cmds: Cmd[]) => new Runner(FILE).run(cmds, FILE);
const v2 = figures.v2 as string[];
/** Stary scenariusz z f77db9b (kroki rysunku Pull-Up twarde). */
const stary = (): Cmd[] => {
  const d = mkdtempSync(join(tmpdir(), 'm57-')); const p = join(d, FILE);
  writeFileSync(p, execFileSync('git', ['show', `f77db9b:.maestro/${FILE}`], { cwd: join(__dirname, '..') }));
  return load(p);
};
const nowy = (): Cmd[] => load(join(DIR, FILE));
const hasWhenPhases = (c: Cmd) => !!c && !!c.runFlow && JSON.stringify(c.runFlow.when) === JSON.stringify({ visible: 'Pulling up 1 s.*' });
const failure = async (cmds: Cmd[]) => { let err: Error | null = null; try { await run(cmds); } catch (e) { err = e as Error; } return err; };

describe('57 przy prawdziwej bramce 4', () => {
  test('stan danych: squat w v2, pull_up poza v2 (zmiana któregokolwiek wymaga zmiany 57)', () => {
    expect(v2).toContain('squat'); expect(v2).not.toContain('pull_up');
  });
  test('stary 57 pada w kroku rysunku Pull-Up', async () => {
    const err = await failure(stary());
    expect(err).not.toBeNull();
    const msg = err!.message.split('\nNa ekranie:')[0];
    expect(msg).toContain(`krok: ${FILE}:`); expect(msg).toMatch(/Pulling up/);
  });
  test('nowy 57 przechodzi', async () => { await run(nowy()); });
  test('Back Squat zostaje twardy: bez rysunku squat nowy 57 pada w kroku rysunku', async () => {
    const spy = jest.spyOn(v2, 'includes').mockImplementation((x: string) => x !== 'squat' && Array.prototype.indexOf.call(v2, x) >= 0);
    try { const err = await failure(nowy()); expect(err).not.toBeNull(); expect(err!.message).toMatch(/Movement drawing/); }
    finally { spy.mockRestore(); }
  });
  test('strażnik: kroki rysunku Pull-Up warunkowe tylko dopóki pull_up nie jest w v2; Back Squat nie jest warunkowy', () => {
    const c = nowy();
    const pullIdx = c.findIndex(x => x.runFlow && JSON.stringify(x.runFlow.commands).includes('87-figura-v2-podciaganie-blad'));
    expect(pullIdx).toBeGreaterThan(0);
    if (v2.includes('pull_up')) expect(hasWhenPhases(c[pullIdx])).toBe(false); // zdejmij runFlow when w 57 po wpisie recenzji pull_up
    else expect(hasWhenPhases(c[pullIdx])).toBe(true);
    expect(c.some(hasWhenPhases) && c.filter(hasWhenPhases).length).toBe(1);
    expect(c.some(x => x.assertVisible === 'Lowering 2 s.*')).toBe(true); // Back Squat: twarde asercje na najwyższym poziomie
  });
});
