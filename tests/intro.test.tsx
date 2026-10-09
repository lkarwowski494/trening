/*
 * Animacja przy starcie (decyzja właściciela 09.10.2026 ok. 17:25, docs/18): talerze wsuwają się na gryf i składają w ikonę aplikacji.
 * Zakres wg docs/20: logika (lib/intro.ts — zimny start / powrót z tła, „Ogranicz ruch”, pominięcie, czasy, klatki), dane marki (geometria
 * i kolory = assets/brand/*.svg i PNG ekranu startowego, app.json), ekran (components/Intro.tsx w jasnym i ciemnym motywie, znika po czasie,
 * trzyma ostatnią klatkę do końca ładowania, ukryty dla VoiceOver), scenariusz (prawdziwy start aplikacji z animacją — tests/setup.js ją
 * wyłącza dla pozostałych testów), E2E (scenariusze Maestro przechodzą z włączoną animacją w interpreterze; każdy launchApp czeka na tekst).
 */
jest.unmock('@/components/Intro');
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import React from 'react';
import { AccessibilityInfo, AppState, Easing, StyleSheet } from 'react-native';
import { render, act, fireEvent, screen as rtl } from '@testing-library/react-native';
import * as SplashScreen from 'expo-splash-screen';
import { Intro } from '@/components/Intro';
import { INTRO, INTRO_MOVE_MS, INTRO_MODES, introMode, introPieces, introFrame, pieceOffset, easeOutCubic, takeColdStart, __resetIntroForTests } from '@/lib/intro';
import { ICON_BAR, ICON_PLATES, ICON_COLLAR, ICON_VIEWBOX, ICON_SCHEMES, iconColors, type IconRect } from '@/lib/brandIcon';
import { PLATE_COLORS } from '@/lib/plates';
import { BRAND, dark } from '@/lib/theme';
import { renderApp, flushAll, screen } from './app';
import { Runner, DIR, load } from './maestro-runner';

jest.mock('expo-splash-screen', () => ({ ...jest.requireActual('expo-splash-screen'), hideAsync: jest.fn(async () => {}) }));
jest.setTimeout(120000);
const root = path.join(__dirname, '..');
const hide = SplashScreen.hideAsync as jest.Mock;
const rm = AccessibilityInfo.isReduceMotionEnabled as jest.Mock;
beforeEach(() => { hide.mockClear(); rm.mockImplementation(() => Promise.resolve(false)); });
afterEach(() => { rm.mockImplementation(() => Promise.resolve(false)); });

describe('logika (lib/intro.ts)', () => {
  test('zimny start: animacja raz na proces; powrót z tła / ponowne zamontowanie — bez; proces obudzony w tle — bez', () => {
    __resetIntroForTests(); expect(takeColdStart('active')).toBe(true); expect(takeColdStart('active')).toBe(false); expect(takeColdStart('inactive')).toBe(false);
    __resetIntroForTests(); expect(takeColdStart('inactive')).toBe(true); /* iOS w trakcie startu: 'inactive' */
    __resetIntroForTests(); expect(takeColdStart(undefined)).toBe(true);
    __resetIntroForTests(); expect(takeColdStart('background')).toBe(false); expect(takeColdStart('active')).toBe(false); /* flaga zużyta bez animacji */
  });
  test('„Ogranicz ruch”: animacja tylko, gdy system odpowiedział „wyłączone”', () => {
    const want: Record<string, (typeof INTRO_MODES)[number]> = { false: 'animate', true: 'none', null: 'none' };
    for (const v of [false, true, null]) expect(introMode(v)).toBe(want[String(v)]);
    expect(INTRO_MODES.map(m => [false, true, null].some(v => introMode(v) === m))).toEqual(INTRO_MODES.map(() => true));
  });
  test('czasy: ok. 1 s razem ze zniknięciem; ostatni element na miejscu przed końcem ruchu; krzywa = Easing.out(Easing.cubic)', () => {
    expect(INTRO.totalMs).toBeGreaterThanOrEqual(800); expect(INTRO.totalMs).toBeLessThanOrEqual(1100);
    expect(INTRO_MOVE_MS).toBe(INTRO.totalMs - INTRO.fadeMs);
    const ps = introPieces(); expect(Math.max(...ps.map(p => p.delay + INTRO.slideMs))).toBeLessThanOrEqual(INTRO_MOVE_MS);
    const e = Easing.out(Easing.cubic); for (let p = 0; p <= 1; p += 0.05) expect(easeOutCubic(p)).toBeCloseTo(e(p), 10);
    expect(INTRO.reduceMotionWaitMs).toBeLessThanOrEqual(500);
  });
  test('kolejność: talerze od najcięższego (jak na ikonie), na końcu zacisk; każdy startuje później', () => {
    const ps = introPieces();
    expect(ps.map(p => p.fill)).toEqual([...ICON_PLATES.map(p => p.color), 'ink']);
    expect(ps.map(p => [p.x, p.y, p.w, p.h, p.rx])).toEqual([...ICON_PLATES, ICON_COLLAR].map(r => [r.x, r.y, r.w, r.h, r.rx]));
    ps.forEach((p, i) => expect(p.delay).toBe(i * INTRO.staggerMs));
  });
  test('klatki: pierwsza = sam gryf (wszystko poza ekranem), ostatnia = ikona; ruch tylko w lewo, bez pętli; talerze nie nachodzą na siebie', () => {
    const ps = introPieces();
    introFrame(0).x.forEach(x => expect(x).toBeGreaterThanOrEqual(ICON_VIEWBOX));
    expect(introFrame(INTRO_MOVE_MS).x).toEqual(ps.map(p => p.x));
    expect(introFrame(INTRO_MOVE_MS).opacity).toBe(1); expect(introFrame(INTRO.totalMs).opacity).toBe(0); expect(introFrame(INTRO.totalMs * 5).x).toEqual(ps.map(p => p.x));
    let prev = introFrame(0).x;
    for (let t = 0; t <= INTRO.totalMs + 200; t += 5) {
      const { x } = introFrame(t);
      x.forEach((v, i) => expect(v).toBeLessThanOrEqual(prev[i] + 1e-9)); prev = x;
      for (let i = 0; i + 1 < x.length; i++) expect(x[i + 1]).toBeGreaterThanOrEqual(x[i] + ps[i].w - 1e-9);
    }
    expect(pieceOffset({ delay: 0 }, -50)).toBe(INTRO.fromRight); expect(pieceOffset({ delay: 0 }, INTRO.slideMs)).toBe(0);
  });
});

/* --- dane marki: SVG, PNG, app.json --- */
const rects = (svg: string) => [...svg.matchAll(/<rect ([^>]*)\/>/g)].map(m => Object.fromEntries([...m[1].matchAll(/(\w+)="([^"]*)"/g)].map(a => [a[1], a[2]])));
const asSvg = (r: IconRect, fill: string) => ({ x: String(r.x), y: String(r.y), width: String(r.w), height: String(r.h), rx: String(r.rx), fill: fill.toUpperCase() });
const norm = (o: Record<string, string>) => ({ ...o, fill: o.fill.toUpperCase() });
/** Minimalny dekoder PNG (RGBA 8 bit, bez przeplotu) — piksel (x, y). */
function png(file: string) {
  const b = fs.readFileSync(file); let o = 8; const idat: Buffer[] = []; let w = 0, h = 0, ct = 0;
  while (o < b.length) { const len = b.readUInt32BE(o); const type = b.toString('ascii', o + 4, o + 8); const d = b.subarray(o + 8, o + 8 + len); if (type === 'IHDR') { w = d.readUInt32BE(0); h = d.readUInt32BE(4); ct = d[9]; } if (type === 'IDAT') idat.push(d); o += 12 + len; }
  if (ct !== 6) throw new Error('oczekiwany PNG RGBA'); const raw = zlib.inflateSync(Buffer.concat(idat)); const bpp = 4, stride = w * bpp; const out = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) { const f = raw[y * (stride + 1)]; for (let x = 0; x < stride; x++) { const v = raw[y * (stride + 1) + 1 + x]; const a = x >= bpp ? out[y * stride + x - bpp] : 0; const up = y ? out[(y - 1) * stride + x] : 0; const c = y && x >= bpp ? out[(y - 1) * stride + x - bpp] : 0;
    const p = a + up - c; const pa = Math.abs(p - a), pb = Math.abs(p - up), pc = Math.abs(p - c); const pr = pa <= pb && pa <= pc ? a : pb <= pc ? up : c;
    out[y * stride + x] = (v + [0, a, up, (a + up) >> 1, pr][f]) & 255; } }
  return { w, h, at: (px: number, py: number) => { const i = Math.round(py) * stride + Math.round(px) * bpp; return [out[i], out[i + 1], out[i + 2], out[i + 3]]; } };
}
const hex = (rgb: number[]) => '#' + rgb.slice(0, 3).map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();

describe('dane marki: ikona i ekran startowy = geometria i kolory z lib/brandIcon.ts', () => {
  test('icon.svg i icon-dark.svg: gryf, 4 talerze, zacisk — dokładnie te prostokąty i kolory; jasne talerze z PLATE_COLORS', () => {
    for (const s of ICON_SCHEMES) {
      const svg = fs.readFileSync(path.join(root, 'assets/brand', s === 'dark' ? 'icon-dark.svg' : 'icon.svg'), 'utf8'); const c = iconColors(s);
      let rs = rects(svg); if (s === 'light') { expect(rs[0]).toEqual({ width: '120', height: '120', fill: BRAND.paper }); rs = rs.slice(1); }
      expect(rs.map(norm)).toEqual([asSvg(ICON_BAR, c.ink), ...ICON_PLATES.map(p => asSvg(p, c.plate[p.color])), asSvg(ICON_COLLAR, c.ink)]);
    }
    expect(iconColors('light').plate).toBe(PLATE_COLORS); expect(iconColors('light').ink).toBe(BRAND.ink); expect(iconColors('dark').ink).toBe(dark.text); expect(iconColors('dark').bg).toBe(dark.bg);
  });
  test('ekran startowy: sam gryf (splash.svg / splash-dark.svg), PNG 1024 z gryfem w tym miejscu, przezroczyste poza nim; app.json wskazuje te pliki i tła motywów', () => {
    for (const s of ICON_SCHEMES) {
      const f = s === 'dark' ? 'splash-dark' : 'splash'; const c = iconColors(s);
      expect(rects(fs.readFileSync(path.join(root, 'assets/brand', f + '.svg'), 'utf8')).map(norm)).toEqual([asSvg(ICON_BAR, c.ink)]);
      const p = png(path.join(root, 'assets', f + '.png')); expect([p.w, p.h]).toEqual([1024, 1024]); const k = 1024 / ICON_VIEWBOX;
      expect(hex(p.at((ICON_BAR.x + ICON_BAR.w / 2) * k, (ICON_BAR.y + ICON_BAR.h / 2) * k))).toBe(c.ink.toUpperCase()); expect(p.at((ICON_BAR.x + ICON_BAR.w / 2) * k, (ICON_BAR.y + ICON_BAR.h / 2) * k)[3]).toBe(255);
      for (const r of [...ICON_PLATES.map(q => ({ ...q, y: q.y + 2 })), ICON_COLLAR]) expect(p.at((r.x + r.w / 2) * k, (r.y + 2) * k)[3]).toBe(0); /* nad gryfem: bez talerzy */
      expect(p.at(2, 2)[3]).toBe(0);
    }
    const app = JSON.parse(fs.readFileSync(path.join(root, 'app.json'), 'utf8')).expo;
    const sp = app.plugins.find((x: unknown) => Array.isArray(x) && x[0] === 'expo-splash-screen')[1];
    expect([sp.image, sp.dark.image]).toEqual(['./assets/splash.png', './assets/splash-dark.png']);
    expect([sp.backgroundColor, sp.dark.backgroundColor]).toEqual([iconColors('light').bg, iconColors('dark').bg]);
    /* Intro zakłada układ obrazu: pełny ekran, „contain” (kwadrat na szerokość ekranu, środek w pionie) — zmiana tego wymaga zmiany Intro */
    expect([sp.ios.enableFullScreenImage_legacy, sp.resizeMode]).toEqual([true, 'contain']);
    expect(app.userInterfaceStyle).toBe('automatic');
  });
});

/* --- ekran: komponent --- */
const H_ = { includeHiddenElements: true } as const; /* nakładka jest ukryta dla VoiceOver */
const flat = (id: string) => StyleSheet.flatten(rtl.getByTestId(id, H_).props.style);
const tx = (id: string) => (flat(id).transform as { translateX: number }[])[0].translateX;
const layout = async (w: number, h: number) => { await act(async () => { fireEvent(rtl.getByTestId('intro', H_), 'layout', { nativeEvent: { layout: { x: 0, y: 0, width: w, height: h } } }); }); };
const tick = async (ms: number) => { for (let left = ms; ; left -= 10) { await act(async () => { jest.advanceTimersByTime(Math.max(0, Math.min(10, left))); for (let i = 0; i < 5; i++) await Promise.resolve(); }); if (left <= 10) break; } };

describe('ekran (components/Intro.tsx)', () => {
  beforeEach(() => { jest.useFakeTimers(); });
  afterEach(() => { jest.useRealTimers(); });
  test.each(ICON_SCHEMES)('motyw %s: kwadrat ikony na szerokość ekranu, środek w pionie (jak ekran startowy); pierwsza klatka = sam gryf, ostatnia = ikona w kolorach ikony', async s => {
    const c = iconColors(s); const W = 390, H = 844, k = W / ICON_VIEWBOX;
    render(<Intro ready={false} onDone={() => {}} scheme={s} frame={0} />); await layout(W, H);
    expect(flat('intro').backgroundColor).toBe(c.bg);
    expect(flat('intro-icon')).toMatchObject({ left: 0, top: (H - W) / 2, width: W, height: W });
    expect(flat('intro-bar')).toMatchObject({ left: ICON_BAR.x * k, top: ICON_BAR.y * k, width: ICON_BAR.w * k, height: ICON_BAR.h * k, borderRadius: ICON_BAR.rx * k, backgroundColor: c.ink });
    const ps = introPieces();
    ps.forEach((p, i) => { expect(flat(`intro-piece-${i}`)).toMatchObject({ left: p.x * k, top: p.y * k, width: p.w * k, height: p.h * k, borderRadius: p.rx * k, backgroundColor: p.fill === 'ink' ? c.ink : c.plate[p.fill] }); expect(p.x * k + tx(`intro-piece-${i}`)).toBeGreaterThanOrEqual(W); });
    rtl.unmount();
    render(<Intro ready={false} onDone={() => {}} scheme={s} frame={INTRO_MOVE_MS} />); await layout(W, H);
    ps.forEach((_, i) => expect(tx(`intro-piece-${i}`)).toBeCloseTo(0, 6));
    rtl.unmount();
    render(<Intro ready={false} onDone={() => {}} scheme={s} frame={300} />); await layout(W, H); /* klatka pośrednia = introFrame */
    introFrame(300).x.forEach((x, i) => expect(ps[i].x * k + tx(`intro-piece-${i}`)).toBeCloseTo(x * k, 4));
  });
  test('VoiceOver: grafika ukryta, pominięcie tapnięciem bez elementu dostępności', () => {
    render(<Intro ready onDone={() => {}} scheme="light" frame={0} />);
    const n = rtl.getByTestId('intro', H_); expect(n.props.accessibilityElementsHidden).toBe(true); expect(n.props.importantForAccessibility).toBe('no-hide-descendants');
    expect(rtl.getByTestId('intro-skip', H_).props.accessible).toBe(false);
  });
  test('dane gotowe: ekran startowy schowany po zamontowaniu, ruch ok. 1 s, potem znika (onDone) — nie dłużej', async () => {
    const done = jest.fn(); render(<Intro ready onDone={done} scheme="light" />);
    await tick(40); expect(hide).toHaveBeenCalledTimes(1); expect(done).not.toHaveBeenCalled();
    await tick(INTRO_MOVE_MS - 60); expect(done).not.toHaveBeenCalled();
    await tick(INTRO.fadeMs + 60); expect(done).toHaveBeenCalledTimes(1);
  });
  test('dane ładują się dłużej: ostatnia klatka (ikona) zostaje bez pętli, znika dopiero po załadowaniu', async () => {
    const done = jest.fn(); render(<Intro ready={false} onDone={done} scheme="dark" />); await layout(390, 844);
    await tick(INTRO.totalMs + 3000); expect(done).not.toHaveBeenCalled();
    introPieces().forEach((_, i) => expect(tx(`intro-piece-${i}`)).toBeCloseTo(0, 6)); expect(flat('intro').opacity).toBe(1);
    rtl.rerender(<Intro ready onDone={done} scheme="dark" />); await tick(INTRO.fadeMs - 10); expect(done).not.toHaveBeenCalled(); await tick(20); expect(done).toHaveBeenCalledTimes(1);
  });
  test('tapnięcie pomija: dane gotowe — od razu aplikacja; dane w drodze — od razu ikona, aplikacja zaraz po załadowaniu', async () => {
    const done = jest.fn(); render(<Intro ready onDone={done} scheme="light" />); await tick(150);
    await act(async () => { fireEvent(rtl.getByTestId('intro-skip', H_), 'pressIn'); }); await tick(0); expect(done).toHaveBeenCalledTimes(1);
    rtl.unmount();
    const d2 = jest.fn(); render(<Intro ready={false} onDone={d2} scheme="light" />); await layout(390, 844); await tick(150);
    await act(async () => { fireEvent(rtl.getByTestId('intro-skip', H_), 'pressIn'); }); await tick(0);
    expect(d2).not.toHaveBeenCalled(); introPieces().forEach((_, i) => expect(tx(`intro-piece-${i}`)).toBeCloseTo(0, 6));
    rtl.rerender(<Intro ready onDone={d2} scheme="light" />); await tick(0); expect(d2).toHaveBeenCalledTimes(1);
  });
  test('„Ogranicz ruch”: bez animacji — od razu koniec, ekranu startowego nie chowa (zrobi to expo-router z aplikacją)', async () => {
    rm.mockImplementation(() => Promise.resolve(true));
    const done = jest.fn(); render(<Intro ready={false} onDone={done} scheme="light" />); await tick(0);
    expect(done).toHaveBeenCalledTimes(1); await tick(2000); expect(hide).not.toHaveBeenCalled(); expect(done).toHaveBeenCalledTimes(1);
  });
  test('system nie odpowiada o „Ogranicz ruch”: po INTRO.reduceMotionWaitMs bez animacji (nie wisi na ekranie)', async () => {
    rm.mockImplementation(() => new Promise(() => {}));
    const done = jest.fn(); render(<Intro ready onDone={done} scheme="light" />);
    await tick(INTRO.reduceMotionWaitMs - 10); expect(done).not.toHaveBeenCalled(); await tick(20); expect(done).toHaveBeenCalledTimes(1); expect(hide).not.toHaveBeenCalled();
  });
});

/* --- scenariusz: start całej aplikacji z animacją (w pozostałych testach wyłączona przez tests/setup.js) --- */
describe('scenariusz: start aplikacji', () => {
  test('w aplikacji animacja jest włączona: nakładka na starcie, treść ukryta dla VoiceOver do końca animacji, potem aplikacja; app/_layout.tsx ją montuje', async () => {
    const src = fs.readFileSync(path.join(root, 'app/_layout.tsx'), 'utf8');
    expect(src).toMatch(/takeColdStart\(AppState\.currentState\)/); expect(src).toMatch(/<Intro ready=\{ready \|\| err != null\}/);
    expect(fs.readFileSync(path.join(root, 'tests/setup.js'), 'utf8')).toMatch(/jest\.mock\('@\/components\/Intro'/); /* wyłączenie tylko w testach */
    await renderApp();
    expect(screen.getByTestId('intro', H_)).toBeTruthy();
    expect(screen.queryAllByText('Szablony', { includeHiddenElements: false })).toHaveLength(0);
    expect(screen.getAllByText('Szablony', { includeHiddenElements: true }).length).toBeGreaterThan(0); /* dane gotowe pod spodem (równolegle) */
    for (let t = 0; t < INTRO.totalMs + 100; t += 50) await flushAll(50);
    expect(screen.queryByTestId('intro', H_)).toBeNull(); expect(screen.queryAllByText('Szablony', { includeHiddenElements: false }).length).toBeGreaterThan(0);
    expect(hide).toHaveBeenCalled();
  });
  test('powrót z tła: bez animacji', async () => {
    const handlers: ((s: string) => void)[] = []; const spy = jest.spyOn(AppState, 'addEventListener').mockImplementation(((ev: string, cb: any) => { if (ev === 'change') handlers.push(cb); return { remove: () => {} }; }) as any);
    try {
      await renderApp(); for (let t = 0; t < INTRO.totalMs + 100; t += 50) await flushAll(50); expect(screen.queryByTestId('intro', H_)).toBeNull();
      await act(async () => { handlers.forEach(h => h('background')); }); await act(async () => { handlers.forEach(h => h('active')); }); await flushAll(10);
      expect(screen.queryByTestId('intro', H_)).toBeNull(); expect(screen.queryAllByText('Szablony', { includeHiddenElements: false }).length).toBeGreaterThan(0);
    } finally { void spy; }
  });
  test('„Ogranicz ruch” włączone: aplikacja od razu po załadowaniu, bez nakładki', async () => {
    rm.mockImplementation(() => Promise.resolve(true));
    await renderApp(); await flushAll(10);
    expect(screen.queryByTestId('intro', H_)).toBeNull(); expect(screen.queryAllByText('Szablony', { includeHiddenElements: false }).length).toBeGreaterThan(0);
  });
  test('błąd startu: animacja nie zasłania komunikatu (kończy się jak przy gotowych danych)', async () => {
    try {
      (global as any).__dbOpenFail = true; await renderApp(); for (let t = 0; t < INTRO.totalMs + 100; t += 50) await flushAll(50); /* kroki: obietnice między timerami */
      expect(screen.queryByTestId('intro', H_)).toBeNull(); expect(screen.getByText('Nie udało się otworzyć danych.')).toBeTruthy();
    } finally { (global as any).__dbOpenFail = false; }
  });
});

/* --- E2E: Maestro --- */
describe('E2E: scenariusze Maestro z włączoną animacją', () => {
  const flows = fs.readdirSync(DIR).filter(f => /^\d\d-.*\.yaml$/.test(f)).sort();
  test('każdy launchApp czeka potem na tekst (extendedWaitUntil visible) — treść jest ukryta, dopóki trwa animacja, więc tap nie trafi w nakładkę', () => {
    for (const f of flows) { const cmds = load(path.join(DIR, f)); cmds.forEach((c: any, i: number) => { if (c && typeof c === 'object' && 'launchApp' in c) expect([f, i, Object.keys(cmds[i + 1] ?? {})[0], !!cmds[i + 1]?.extendedWaitUntil?.visible]).toEqual([f, i, 'extendedWaitUntil', true]); }); }
  });
  test('02 (restart = drugi zimny start) i 01 przechodzą w interpreterze z prawdziwą nakładką', async () => {
    for (const f of ['02-przerwa-po-restarcie.yaml', '01-trening-z-szablonu.yaml']) await new Runner(f).run(load(path.join(DIR, f)), f);
  });
});
