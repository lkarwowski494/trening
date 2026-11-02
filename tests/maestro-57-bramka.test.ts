/*
 * Scenariusz 57 a bramka 4 (noc 41347718181, 02.11.2026): rysunek v2 pokazuje tylko rodzina z wpisem recenzji ruchu (lib/figures/data.json, pole v2).
 * Stary 57 (f77db9b) miał twarde kroki rysunku także dla Pull-Up, której karta (pull_up poza v2 do wdrożenia decyzji C, docs/18 02.11) ma same wskazówki tekstowe.
 * Interpreter działa tu na PRAWDZIWEJ bramce (bez podmiany data.json), czyli tak jak symulator.
 * 1) stary 57 pada w kroku rysunku Pull-Up; 2) nowy przechodzi; 3) Back Squat zostaje twardy (znika rysunek squat -> scenariusz czerwony);
 * 4) strażnik: pull_up w v2 => warunkowy runFlow musi zniknąć.
 * 02.11.2026 (wpis recenzji v2 pull_up po decyzji właściciela C): pull_up w v2, kroki rysunku Pull-Up w 57 znów twarde —
 * stary 57 (f77db9b) przechodzi, a bez rysunku pull_up nowy 57 pada w kroku Pull-Up (jak Back Squat).
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
  test('stan danych (02.11.2026): squat i pull_up w v2 (zmiana któregokolwiek wymaga zmiany 57)', () => {
    expect(v2).toContain('squat'); expect(v2).toContain('pull_up');
  });
  test('stary 57 (twarde kroki Pull-Up z f77db9b) przechodzi przy pull_up w v2', async () => { await run(stary()); });
  test('nowy 57 przechodzi', async () => { await run(nowy()); });
  const bez = async (fam: string, re: RegExp) => {
    const spy = jest.spyOn(v2, 'includes').mockImplementation((x: string) => x !== fam && Array.prototype.indexOf.call(v2, x) >= 0);
    try { const err = await failure(nowy()); expect(err).not.toBeNull(); expect(err!.message.split('\nNa ekranie:')[0]).toMatch(re); }
    finally { spy.mockRestore(); }
  };
  test('Back Squat zostaje twardy: bez rysunku squat nowy 57 pada w kroku rysunku', async () => { await bez('squat', /Movement drawing/); });
  test('Pull-Up twardy (02.11.2026): bez rysunku pull_up nowy 57 pada w kroku rysunku Pull-Up', async () => { await bez('pull_up', /Movement drawing|Pulling up/); });
  test('strażnik: kroki rysunku Pull-Up warunkowe tylko dopóki pull_up nie jest w v2; Back Squat nie jest warunkowy', () => {
    const c = nowy();
    const warunkowy = c.findIndex(x => x.runFlow && JSON.stringify(x.runFlow.commands).includes('87-figura-v2-podciaganie-blad'));
    const twardy = c.findIndex(x => x.takeScreenshot === '87-figura-v2-podciaganie-blad');
    if (v2.includes('pull_up')) { expect(warunkowy).toBe(-1); expect(twardy).toBeGreaterThan(0); expect(c.some(hasWhenPhases)).toBe(false); }
    else { expect(warunkowy).toBeGreaterThan(0); expect(hasWhenPhases(c[warunkowy])).toBe(true); }
    expect(c.some(x => x.assertVisible === 'Lowering 2 s.*')).toBe(true); // Back Squat: twarde asercje na najwyższym poziomie
  });
});
