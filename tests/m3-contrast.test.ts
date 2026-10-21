/*
 * Redesign M3, partia p1 (design-spec §7; reguła M1-031, 04-011): kontrast wszystkich par barw z palet w lib/theme.ts — jasna, ciemna i obie
 * „Zwiększ kontrast” — z tych samych reguł co docs/design/narzedzia/e3-kontrast.mjs (WCAG 1.4.3 tekst 4,5; duży tekst i elementy 3; HC: tekst pomocniczy
 * i akcent 7, elementy 4,5). Pary wyliczone z żywych palet muszą dać dokładnie ten zestaw (210) co zatwierdzony w docs/design/tokeny-kontrast.json,
 * więc paleta w kodzie nie może się rozjechać z systemem zatwierdzonym na STOP E3.
 */
import * as fs from 'fs';
import * as path from 'path';
import { light, dark, lightHC, darkHC, type Theme } from '@/lib/theme';

const lum = (h: string) => { const c = h.slice(1).match(/../g)!.map(x => parseInt(x, 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

type Pair = [string, string, number];
function pairs(): Record<string, Pair> {
  const out: Record<string, Pair> = {};
  const add = (n: string, fg: string, bg: string, min = 4.5) => { out[n] = [fg.toUpperCase(), bg.toUpperCase(), min]; };
  for (const [nazwa, p, hc] of [['jasny', light, false], ['ciemny', dark, false], ['jasny HC', lightHC, true], ['ciemny HC', darkHC, true]] as [string, Theme, boolean][]) {
    for (const [tn, tb] of Object.entries({ bg: p.bg, surface: p.surface, surface2: p.surface2 })) {
      add(`${nazwa}: text/${tn}`, p.text, tb);
      add(`${nazwa}: muted/${tn}`, p.muted, tb, hc ? 7 : 4.5);
      add(`${nazwa}: accent (tekst przycisku w nagłówku)/${tn}`, p.accent, tb, hc ? 7 : 4.5);
      add(`${nazwa}: band (tekst gumy)/${tn}`, p.band, tb, hc ? 7 : 4.5);
      add(`${nazwa}: danger (tekst „Usuń …”)/${tn}`, p.danger, tb);
      add(`${nazwa}: ctrlLine (element)/${tn}`, p.ctrlLine, tb, hc ? 4.5 : 3);
      add(`${nazwa}: doneLine (element)/${tn}`, p.doneLine, tb, hc ? 4.5 : 3);
      add(`${nazwa}: less (element)/${tn}`, p.less, tb, hc ? 4.5 : 3);
      if (hc) add(`${nazwa}: line jako tor (element)/${tn}`, p.line, tb, 4.5);
    }
    add(`${nazwa}: text/done (wiersz zrobiony)`, p.text, p.done);
    add(`${nazwa}: doneLine/done (element)`, p.doneLine, p.done, hc ? 4.5 : 3);
    add(`${nazwa}: przycisk główny accentInk/accent`, p.accentInk, p.accent, hc ? 7 : 4.5);
    add(`${nazwa}: przycisk główny/bg (element)`, p.accent, p.bg, 3);
    add(`${nazwa}: przycisk drugorzędny text/surface2`, p.text, p.surface2);
    add(`${nazwa}: dangerInk/danger`, p.dangerInk, p.danger);
    add(`${nazwa}: tablica ikona ± boardText/boardField (element)`, p.boardText, p.boardField, hc ? 4.5 : 3);
    add(`${nazwa}: tablica cyfry boardText/board`, p.boardText, p.board);
    add(`${nazwa}: tablica opis boardMuted/board`, p.boardMuted, p.board, hc ? 7 : 4.5);
    add(`${nazwa}: tablica zegar now/board (duży tekst)`, p.now, p.board, hc ? 4.5 : 3);
    add(`${nazwa}: tablica zegar now/board jako tekst zwykły`, p.now, p.board, 4.5);
    add(`${nazwa}: tablica ± boardText/boardField`, p.boardText, p.boardField);
    add(`${nazwa}: pole zrobione board/boardText (tekst)`, p.board, p.boardText);
    add(`${nazwa}: pole czekające kontur boardMuted/board (element)`, p.boardMuted, p.board, hc ? 4.5 : 3);
    add(`${nazwa}: pole bieżące ramka now/board (element)`, p.now, p.board, hc ? 4.5 : 3);
    add(`${nazwa}: tablica brzeg/bg (element)`, p.boardEdge === p.board ? p.board : p.boardEdge, p.bg, 3);
    add(`${nazwa}: znacznik dnia accent/surface (element)`, p.accent, p.surface, 3);
    for (const m of ['motif25', 'motif20', 'motif15', 'motif10', 'motifBar'] as const) { add(`${nazwa}: text/${m}`, p.text, p[m]); add(`${nazwa}: muted/${m}`, p.muted, p[m], hc ? 7 : 4.5); }
  }
  return out;
}

const approved = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'docs/design/tokeny-kontrast.json'), 'utf8')) as Record<string, Pair>;
const live = pairs();

describe('kontrast palet (M3, tokeny zatwierdzone na STOP E3)', () => {
  test('żywe palety dają dokładnie 210 par z docs/design/tokeny-kontrast.json (te same barwy i progi)', () => {
    expect(Object.keys(live)).toHaveLength(210);
    expect(Object.keys(live)).toEqual(Object.keys(approved));
    for (const k of Object.keys(approved)) expect([k, live[k]]).toEqual([k, [approved[k][0].toUpperCase(), approved[k][1].toUpperCase(), approved[k][2]]]);
  });
  test.each(Object.entries(live))('%s ≥ próg', (name, [fg, bg, min]) => {
    expect([name, ratio(fg, bg) >= min - 1e-9]).toEqual([name, true]);
  });
  test('najsłabsza para ≥ 3:1 (design-spec §7: 3,31:1), a pary tekstu ≥ 4,5:1', () => {
    const min = Math.min(...Object.values(live).map(([f, b]) => ratio(f, b)));
    expect(min).toBeGreaterThanOrEqual(3.3);
    for (const [, [f, b, m]] of Object.entries(live)) if (m >= 4.5) expect(ratio(f, b)).toBeGreaterThanOrEqual(4.5);
  });
  test('przycisk główny: accentInk na accent ≥ 7:1 w obu motywach (także HC)', () => {
    for (const p of [light, dark, lightHC, darkHC]) expect(ratio(p.accentInk, p.accent)).toBeGreaterThanOrEqual(7);
  });
  test('motyw A2: krycie nie większe niż granica 24%; tekst na barwie motywu ≥ 4,5:1 (pary wyżej), a w HC motyw = tło', () => {
    for (const k of ['motif25', 'motif20', 'motif15', 'motif10', 'motifBar'] as const) { expect(lightHC[k]).toBe(lightHC.bg); expect(darkHC[k]).toBe(darkHC.bg); }
  });
});
