/*
 * M1-audytor-generalny-043 (regresja od M1-025, reaudyt 28.10.2026; 04-studio-projektowe-603): znak „›” w „Pierwszych krokach” miał limit powiększenia
 * TEXT_SCALE_MAX (2,0) zamiast GLYPH_SCALE_MAX (1,4) dla znaków-ikon (T-04), a strażnik T-04 (tests/matrix-a11y.test.tsx) przechodzi tylko trasy ze stanem
 * z treningami, więc „Pierwszych kroków” nie renderował.
 * Test: strażnik T-04 dla stanu pierwszego uruchomienia (bez treningów i szablonów) przy skali 2,0 — każdy znak-ikona na ekranie Trening ma
 * 0 < maxFontSizeMultiplier ≤ GLYPH_SCALE_MAX (ten sam warunek co w matrix-a11y; wyjątek: znak w obramowanym przycisku ≥ 44 pt z limitem 2,0).
 */
import * as RN from 'react-native';
import { StyleSheet } from 'react-native';
import * as store from '@/lib/store';
import { applyLang } from '@/lib/i18n';
import { TEXT_SCALE_MAX, GLYPH_SCALE_MAX } from '@/lib/theme';
import { fresh, saved } from './helpers';
import { renderApp, flushAll, screen, act } from './app';

jest.setTimeout(60000);
type Node = { type: unknown; props: Record<string, unknown> & { style?: unknown; children?: unknown }; parent: Node | null; children: unknown[] };
const flat = (st: unknown) => (StyleSheet.flatten(st as never) ?? {}) as Record<string, number>;
const raw = (n: Node): string => n.children.map((c) => (typeof c === 'string' ? c : '')).join('').trim();
const GLYPH = /^[›‹▸▾▴▲▼✓✕✗✦⇄⋯+↑↓←→×▶⏸…]{1,2}$/u; /* jak tests/matrix-a11y.test.tsx (T-04) */

describe('M1-043: T-04 — znaki-ikony w stanie pierwszego uruchomienia („Pierwsze kroki”)', () => {
  afterEach(() => { applyLang('pl'); jest.restoreAllMocks(); });
  test('każdy znak-ikona na ekranie Trening bez treningów ma limit ≤ GLYPH_SCALE_MAX', async () => {
    jest.spyOn(RN.PixelRatio, 'getFontScale').mockReturnValue(2);
    await fresh(undefined, 'pl'); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: 'pl', url: '/' }); await flushAll(10);
    expect(screen.getByTestId('first-steps')).toBeTruthy();
    const texts = (screen.UNSAFE_root.findAll((n: { type: unknown }) => n.type === 'Text') as unknown as Node[]);
    const bad: string[] = []; let glyphs = 0;
    for (const tx of texts) {
      const g = raw(tx); if (!GLYPH.test(g)) continue;
      const m = tx.props.maxFontSizeMultiplier as number | undefined;
      let bp = tx.parent; while (bp && !(bp.props?.accessibilityRole === 'button' && typeof bp.props?.onPress === 'function')) bp = bp.parent;
      const ps = bp ? flat(typeof bp.props.style === 'function' ? (bp.props.style as (s: { pressed: boolean }) => unknown)({ pressed: false }) : bp.props.style) : {};
      if (bp && ps.borderWidth === 1 && ps.minHeight >= 44 && m === TEXT_SCALE_MAX) continue;
      glyphs++;
      if (!(typeof m === 'number' && m > 0 && m <= GLYPH_SCALE_MAX)) bad.push(`„${g}” (${m})`);
    }
    expect(glyphs).toBeGreaterThan(0);
    expect(bad).toEqual([]);
  });
});
