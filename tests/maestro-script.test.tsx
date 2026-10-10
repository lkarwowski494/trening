/*
 * TST2-04 (audyt kontrolny 1, 09.10.2026): interpreter scenariuszy Maestro pomijał `copyTextFrom`/`evalScript`/`assertTrue`, więc jedyna
 * asercja skutku w .maestro/06-miejsca.yaml („licznik dostępnych ćwiczeń zmienia się po włączeniu drążka”) była w Jest martwa.
 * Teraz: copyTextFrom zapamiętuje tekst elementu (maestro.copiedText), evalScript i assertTrue liczą wyrażenie JavaScript `${…}` (jak GraalJS
 * w Maestro: obiekty `output` i `maestro`), fałsz w assertTrue to błąd kroku; wyrażenie bez `${…}` albo rzucające wyjątek — też błąd.
 */
import { join } from 'path';
import { Runner, DIR, load, evalJs } from './maestro-runner';

jest.setTimeout(240000);
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

describe('TST2-04: wyrażenia Maestro (evalScript, assertTrue)', () => {
  afterAll(() => { delete (global as any).__notifPerm; });

  test('evalJs: output i maestro.copiedText, przypisanie i porównanie; bez ${…} albo z błędem — wyjątek', () => {
    const ctx = { output: {} as Record<string, unknown>, maestro: { copiedText: 'Available exercises: 10 of 854' } };
    evalJs('${output.przed = maestro.copiedText}', ctx);
    expect(ctx.output.przed).toBe('Available exercises: 10 of 854');
    ctx.maestro.copiedText = 'Available exercises: 30 of 854';
    expect(evalJs('${maestro.copiedText != output.przed}', ctx)).toBe(true);
    expect(evalJs('${maestro.copiedText == output.przed}', ctx)).toBe(false);
    expect(() => evalJs('maestro.copiedText', ctx)).toThrow(/\$\{/);
    expect(() => evalJs('${nieMa.pole}', ctx)).toThrow();
  });

  test('06 bez włączenia drążka: licznik dostępnych ćwiczeń się nie zmienia — assertTrue zatrzymuje scenariusz', async () => {
    const f = '06-miejsca.yaml';
    const cmds = load(join(DIR, f)).filter((x: unknown) => !same(x, { tapOn: { id: 'sw-Pull-up bar \\(doorway, wall-mounted\\)' } }));
    expect(cmds.length).toBe(load(join(DIR, f)).length - 1);
    let err: Error | null = null; try { await new Runner(f).run(cmds, f); } catch (e) { err = e as Error; }
    expect(err).not.toBeNull();
    expect(err!.message.split('\nNa ekranie:')[0]).toMatch(/krok: 06-miejsca\.yaml: assertTrue[\s\S]*Warunek fałszywy/);
  });

  test('06 (bieżący): po włączeniu drążka licznik jest inny — skopiowane teksty przed i po', async () => {
    const f = '06-miejsca.yaml'; const r = new Runner(f); await r.run(load(join(DIR, f)), f);
    expect(r.copied.length).toBe(2);
    expect(r.copied[0]).toMatch(/^Available exercises: \d+ of \d+$/); expect(r.copied[1]).toMatch(/^Available exercises: \d+ of \d+$/);
    expect(r.copied[1]).not.toBe(r.copied[0]);
  });
});
