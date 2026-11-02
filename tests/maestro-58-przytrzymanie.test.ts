/*
 * Scenariusz 58 (noc 41347718181, 02.11.2026): po przytrzymaniu liczby ciężaru na tablicy (longPressOn board-value-weight, DEC-01 a) brak panelu przerwy po „Set 1 done”,
 * zrzut: ciężar „3 lb”, seria nieodhaczona. Przyczyna w scenariuszu, nie w aplikacji: Pressable liczby nie ma onLongPress, więc React Native po zwolnieniu przytrzymania
 * wywołuje onPress (Pressability) — otwiera się edytor liczby z klawiaturą numeryczną; stuknięcie ✓ serii w liście leży pod klawiaturą i trafia w klawisz „3”.
 * Na telefonie przytrzymanie przechwytuje systemowy podgląd dużej zawartości (kontrola ręczna, docs/21); symulator Maestro go nie ma.
 * Interpreter (tests/maestro-runner.ts, longPressOn = onPress bez onLongPress + autoFocus) odtwarza to w tym samym kroku: stary 58 pada, nowy przechodzi.
 */
import { execFileSync } from 'child_process';
import { mkdtempSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { Runner, DIR, load } from './maestro-runner';

jest.setTimeout(240000);
const FILE = '58-duzy-tekst.yaml';
type Cmd = any;
const stary = (): Cmd[] => {
  const d = mkdtempSync(join(tmpdir(), 'm58-')); const p = join(d, FILE);
  writeFileSync(p, execFileSync('git', ['show', `f77db9b:.maestro/${FILE}`], { cwd: join(__dirname, '..') }));
  return load(p);
};
const run = async (cmds: Cmd[]) => {
  process.env.EXPO_PUBLIC_STORE_FAKE = '1'; process.env.EXPO_PUBLIC_WATCH_FAKE = '1';
  const { resetStoreAdapterForTests } = require('@/lib/store-adapter'); const { resetEntitlementsForTests } = require('@/lib/entitlement');
  resetStoreAdapterForTests(); resetEntitlementsForTests();
  try { await new Runner(FILE).run(cmds, FILE); } finally { delete process.env.EXPO_PUBLIC_STORE_FAKE; delete process.env.EXPO_PUBLIC_WATCH_FAKE; resetStoreAdapterForTests(); resetEntitlementsForTests(); }
};

describe('58: przytrzymanie liczby na tablicy otwiera edytor (onPress po długim przytrzymaniu)', () => {
  test('stary 58 pada w kroku „Set 1 done” — ✓ serii pod klawiaturą', async () => {
    let err: Error | null = null; try { await run(stary()); } catch (e) { err = e as Error; }
    expect(err).not.toBeNull();
    const msg = err!.message.split('\nNa ekranie:')[0];
    expect(msg).toContain('tapOn {"text":"Set 1 done.*","index":0}'); expect(msg).toMatch(/pod klawiaturą/);
  });
  test('nowy 58 przechodzi: fokus zdjęty stuknięciem w opis tablicy przed ✓', async () => { await run(load(join(DIR, FILE))); });
  test('nowy 58 ma stuknięcie w board-desc między zrzutem 590 a ✓ serii', () => {
    const c = load(join(DIR, FILE)); const i590 = c.findIndex(x => x.takeScreenshot === '590-po-przytrzymaniu-liczby');
    const iDone = c.findIndex((x, k) => k > i590 && x.tapOn && x.tapOn.text === 'Set 1 done.*');
    const mid = c.slice(i590 + 1, iDone); expect(mid.some(x => x.tapOn && x.tapOn.id === 'board-desc')).toBe(true);
  });
});
