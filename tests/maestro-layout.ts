/*
 * Przybliżony układ ekranu dla interpretera scenariuszy Maestro (tests/maestro-flows.test.tsx) — przebieg E2E 91 (09.10.2026): 5 z 7 porażek to
 * elementy poza ekranem (pod krawędzią listy, nad nią po przewinięciu, pod klawiaturą), których drzewo z Jest nie pokazuje, bo nie ma układu.
 *
 * To NIE jest silnik flexbox: wysokości z jawnych stylów (height/minHeight/padding/margin/border/gap), tekst — liczba linii z długości
 * i średniej szerokości znaku kroju (IBM Plex Sans ≈ 0,47 em — skalibrowane na hierarchiach przebiegu 91), pola tekstowe — wysokość linii + padding. Wiersze (flexDirection: row) —
 * wysokość najwyższego dziecka, szerokość: stała (width), naturalna (tekst) albo reszta dla flex; flexWrap — pakowanie po szacowanej szerokości;
 * listy przewijane (RCTScrollView) — contentContainerStyle dokładany do treści (makieta ScrollView z Jest go nie stosuje), poziome — w rzędzie.
 * Stałe ekranu z hierarchii Maestro przebiegu 91 (iPhone 17, 402 × 874 pt): pasek stanu 62, pasek nawigacji do 116 (okno modalne: +16), pasek zakładek od 791,
 * dolna krawędź bez zakładek 826, klawiatura od 539 (górna krawędź wiersza podpowiedzi klawiatury liter).
 * Błąd szacunku rzędu kilkudziesięciu punktów jest oczekiwany (porównanie z hierarchiami 91: lista licencji, ekran ćwiczenia, trening, wybór
 * ćwiczenia — przesunięcia 10–20 pt), więc interpreter ma luz: widoczny = na ekranie co najmniej połowa elementu, najwyżej minVis pt, minus peek;
 * stuknięcie — środek w obszarze listy z luzem slack (poziomo bez luzu: Maestro stuka w środek). Łapie elementy wyraźnie poza ekranem, a nie te
 * tuż przy krawędzi.
 */
export const SCREEN = { w: 402, h: 874, top: 62, header: 54, tabTop: 791, bottom: 826, kbTop: 539, modal: 16, slack: 24, tabSlack: 8, minVis: 22, peek: 8, charEm: 0.47 } as const;

export type LNode = { type: unknown; props: Record<string, any>; parent: LNode | null; children: (LNode | string)[] };
export type Box = { x: number; y: number; w: number; h: number; scroll: LNode | null; horiz: LNode | null };

const isHost = (n: LNode) => typeof n.type === 'string';
export const flat = (st: unknown): Record<string, any> => Array.isArray(st) ? Object.assign({}, ...st.map(flat)) : st && typeof st === 'object' ? st as Record<string, any> : {};
const num = (...v: unknown[]) => { for (const x of v) if (typeof x === 'number') return x; return 0; };
const textOf = (n: LNode | string): string => typeof n === 'string' ? n : (n.children ?? []).map(textOf).join('');
const hostKids = (n: LNode): LNode[] => { const out: LNode[] = []; for (const c of n.children ?? []) { if (typeof c === 'string') continue; if (isHost(c)) out.push(c); else out.push(...hostKids(c)); } return out; };
/** Ekrany pod spodem stosu (aria-hidden z nawigacji) nie zajmują miejsca; elementy ukryte tylko dla VoiceOver (accessibilityElementsHidden) — zajmują. */
const isHidden = (n: LNode) => n.props['aria-hidden'] === true;

function edges(st: Record<string, any>) {
  const mt = num(st.marginTop, st.marginVertical, st.margin), mb = num(st.marginBottom, st.marginVertical, st.margin);
  const ml = num(st.marginLeft, st.marginStart, st.marginHorizontal, st.margin), mr = num(st.marginRight, st.marginEnd, st.marginHorizontal, st.margin);
  const bw = num(st.borderWidth); const bt = num(st.borderTopWidth, bw), bb = num(st.borderBottomWidth, bw), bl = num(st.borderLeftWidth, bw), br = num(st.borderRightWidth, bw);
  const pt = num(st.paddingTop, st.paddingVertical, st.padding) + bt, pb = num(st.paddingBottom, st.paddingVertical, st.padding) + bb;
  const pl = num(st.paddingLeft, st.paddingStart, st.paddingHorizontal, st.padding) + bl, pr = num(st.paddingRight, st.paddingEnd, st.paddingHorizontal, st.padding) + br;
  return { mt, mb, ml, mr, pt, pb, pl, pr };
}
const fontOf = (st: Record<string, any>) => { const fs = num(st.fontSize) || 14; return { fs, lh: num(st.lineHeight) || Math.round(fs * 1.3) }; };
/** Szacowana naturalna szerokość (dla wierszy z zawijaniem i dzieci bez szerokości). */
function natW(n: LNode): number {
  const st = flat(n.props.style); const e = edges(st); if (typeof st.width === 'number') return st.width + e.ml + e.mr;
  if (n.type === 'Text') { const { fs } = fontOf(st); return Math.ceil(textOf(n).length * fs * SCREEN.charEm) + e.pl + e.pr + e.ml + e.mr; }
  const kids = hostKids(n).filter(k => !isHidden(k) && flat(k.props.style).position !== 'absolute'); const row = st.flexDirection === 'row';
  const inner = kids.length ? (row ? kids.reduce((a, k) => a + natW(k), 0) : Math.max(...kids.map(natW))) : n.type === 'TextInput' ? 80 : 0;
  return inner + e.pl + e.pr + e.ml + e.mr;
}

/** Układa poddrzewo: zwraca zewnętrzną wysokość (z marginesami), zapisuje pozycje w `out` (y względem treści najbliższej listy przewijanej). */
function place(n: LNode, x: number, y: number, w: number, scroll: LNode | null, horiz: LNode | null, out: Map<LNode, Box>, extra?: Record<string, any>): number {
  if (isHidden(n)) return 0;
  const st = { ...flat(n.props.style), ...extra }; if (st.display === 'none') return 0;
  const e = edges(st); const ow = typeof st.width === 'number' ? st.width : typeof st.width === 'string' && st.width.endsWith('%') ? w * parseFloat(st.width) / 100 - e.ml - e.mr : w - e.ml - e.mr;
  const bx = x + e.ml, by = y + e.mt, iw = Math.max(1, ow - e.pl - e.pr);
  let h: number;
  if (n.type === 'Text') {
    const { fs, lh } = fontOf(st); const per = Math.max(1, Math.floor(iw / (fs * SCREEN.charEm)));
    let lines = textOf(n).split('\n').reduce((a, p) => a + Math.max(1, Math.ceil(p.length / per)), 0); if (typeof n.props.numberOfLines === 'number' && n.props.numberOfLines > 0) lines = Math.min(lines, n.props.numberOfLines);
    h = lines * lh + e.pt + e.pb;
  } else if (n.type === 'TextInput') {
    const { lh } = fontOf(st); h = Math.max(lh + e.pt + e.pb, num(st.minHeight), 36); if (n.props.multiline) h = Math.max(h, num(st.minHeight), 2 * lh + e.pt + e.pb);
  } else if (n.type === 'RCTSwitch') h = 31;
  else {
    const isScroll = n.type === 'RCTScrollView'; const isH = isScroll && !!n.props.horizontal;
    const sc = isScroll && !isH ? n : scroll; const hz = isH ? n : horiz;
    const cy0 = isScroll && !isH ? 0 : by + e.pt; const cx0 = isH ? 0 : bx + e.pl;
    const kids = hostKids(n).filter(k => !isHidden(k)); const flow = kids.filter(k => flat(k.props.style).position !== 'absolute');
    const gapR = num(st.rowGap, st.gap), gapC = num(st.columnGap, st.gap);
    const row = st.flexDirection === 'row';
    let ch = 0;
    if (row && (st.flexWrap === 'wrap')) {
      let cx = 0, lineH = 0, cy = cy0;
      for (const k of flow) { const kw = Math.min(iw, natW(k)); if (cx > 0 && cx + kw > iw) { cy += lineH + gapR; cx = 0; lineH = 0; } const kh = place(k, cx0 + cx, cy, kw, sc, hz, out); lineH = Math.max(lineH, kh); cx += kw + gapC; }
      ch = cy - cy0 + lineH;
    } else if (row) {
      /* szerokości: stała (width), bez flex — naturalna (przycięta do reszty), flex — reszta proporcjonalnie do flex (minWidth 0 jak flexShrink) */
      const noFlex = !!extra?.__noShrink; /* treść poziomej listy: bez ściskania */
      const flexOf = (k: LNode) => { const s2 = flat(k.props.style); return noFlex ? 0 : typeof s2.flex === 'number' && s2.flex > 0 ? s2.flex : typeof s2.flexGrow === 'number' && s2.flexGrow > 0 ? s2.flexGrow : 0; };
      const fixed = flow.map(k => { const s2 = flat(k.props.style); const e2 = edges(s2); return typeof s2.width === 'number' ? s2.width + e2.ml + e2.mr : flexOf(k) ? null : natW(k); });
      const used = gapC * Math.max(0, flow.length - 1) + fixed.reduce<number>((a, v) => a + (v ?? 0), 0); const fl = flow.reduce((a, k) => a + flexOf(k), 0);
      let free = iw - used; if (!noFlex && free < 0 && !fl) { const shrink = flow.map((k, i) => typeof flat(k.props.style).width === 'number' ? 0 : fixed[i] ?? 0); const tot = shrink.reduce((a, v) => a + v, 0); if (tot > 0) shrink.forEach((v, i) => { fixed[i] = (fixed[i] ?? 0) + free * v / tot; }); free = 0; }
      let cx = 0; flow.forEach((k, i) => { const kw = fixed[i] ?? Math.max(0, free) * flexOf(k) / Math.max(1, fl); ch = Math.max(ch, place(k, cx0 + cx, cy0, kw, sc, hz, out)); cx += kw + gapC; });
    } else {
      /* makieta ScrollView z Jest (@react-native/jest-preset) owija dzieci w View bez stylu — contentContainerStyle i kierunek dokładamy tu */
      const cc = isScroll ? { ...flat(n.props.contentContainerStyle), ...(isH ? { flexDirection: 'row', __noShrink: true } : {}) } : undefined;
      let cy = cy0; flow.forEach((k, i) => { cy += place(k, cx0, cy, iw, sc, hz, out, cc && k.type === 'View' ? cc : undefined) + (i < flow.length - 1 ? gapR : 0); }); ch = cy - cy0;
    }
    for (const k of kids) if (!flow.includes(k)) { const s2 = flat(k.props.style); place(k, cx0 + num(s2.left), cy0 + num(s2.top), iw, sc, hz, out); }
    h = isScroll && !isH ? (typeof st.height === 'number' ? st.height : 0) : ch + e.pt + e.pb;
    if (isScroll && !isH) out.set(n, { x: bx, y: by, w: ow, h: ch, scroll, horiz }); /* h listy = wysokość treści */
  }
  if (typeof st.height === 'number') h = st.height; else if (typeof st.aspectRatio === 'number') h = ow / st.aspectRatio;
  h = Math.max(h, num(st.minHeight)); if (typeof st.maxHeight === 'number') h = Math.min(h, st.maxHeight);
  if (!out.has(n)) out.set(n, { x: bx, y: by, w: ow, h, scroll, horiz });
  return h + e.mt + e.mb;
}

/** Pozycje wszystkich hostów drzewa (tylko widoczne gałęzie). y — względem treści najbliższej pionowej listy przewijanej (albo ekranu). */
export function layout(root: LNode): Map<LNode, Box> { const out = new Map<LNode, Box>(); place(root, 0, 0, SCREEN.w, null, null, out); return out; }
