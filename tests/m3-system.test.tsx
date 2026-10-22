/*
 * Redesign M3, partia p1 — test systemu wyglądu. Zastępuje tests/brand-tuleja.test.tsx (styl „Tuleja”, 07.10.2026): TE SAME PYTANIA na nowe wartości,
 * po decyzjach STOP E3 z 21.10.2026 (docs/18): paleta „hala/tablica” (docs/design/design-spec.md §1), krój Barlow Condensed zamiast IBM Plex,
 * tło ekranu startowego i intro = bg z tokenów, akcent zegarka, widżetu i Live Activity z palety, ikona zegarka 1024 (opcja b, 22.10.2026). Rysunek ikony iPhone i intro
 * zostaje przy „Tulei” (decyzja STOP E2) — te pytania zostają bez zmian.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as Font from 'expo-font';
import { renderApp, flushAll, screen } from './app';
import { light, dark, BRAND, F, FONT_FILES } from '@/lib/theme';

jest.mock('expo-font', () => ({ ...jest.requireActual('expo-font'), loadAsync: jest.fn(() => Promise.resolve()) }));
const load = Font.loadAsync as jest.Mock;
jest.setTimeout(60000);
const root = path.join(__dirname, '..');
afterEach(() => { load.mockReset(); load.mockImplementation(() => Promise.resolve()); });
const rgb = (h: string) => h.slice(1).match(/../g)!.map(x => parseInt(x, 16) / 255);
const pngInfo = (f: string) => { const b = fs.readFileSync(f); return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), bitDepth: b[24], colorType: b[25] }; };

test('kolory systemu: tło „hala” i tekst za dnia, granat tablicy jako akcent; po zmroku „hala nocą”; stare barwy Tulei poza interfejsem (była paleta: papier + atrament + niebieski talerza 20 kg)', () => {
  expect([light.bg, light.text, light.accent]).toEqual(['#E6E8E5', '#18202B', '#13294B']);
  expect([dark.bg, dark.text, dark.accent]).toEqual(['#161C24', '#E8EAED', '#F5F1E6']);
  for (const old of ['#E8590C', '#F2F0EB', '#1E1F22', '#c2410c', '#ff8a3d', BRAND.paper, BRAND.signal, '#121316']) expect(JSON.stringify([light, dark]).toLowerCase()).not.toContain(old.toLowerCase());
  expect(Object.keys(dark).sort()).toEqual(Object.keys(light).sort());
  const { PLATE_COLORS } = require('@/lib/discColors'); expect(BRAND.signal).toBe(PLATE_COLORS.blue); /* BRAND zostaje barwą rysunku ikony: talerz 20 kg */
});

test('kroje: każdy krój własny z F ma plik; start ładuje wszystkie (Barlow Condensed 600/700; treść krojem systemowym bez pliku)', async () => {
  const own = Object.values(F).filter(f => f !== 'System');
  expect(own.length).toBeGreaterThan(0); for (const f of own) expect([f, !!(FONT_FILES as Record<string, unknown>)[f]]).toEqual([f, true]);
  await renderApp(); await flushAll(10);
  expect(Object.keys(load.mock.calls[0][0] as object).sort()).toEqual(Object.keys(FONT_FILES).sort());
  expect(Object.keys(FONT_FILES).sort()).toEqual(['BarlowCondensed_600SemiBold', 'BarlowCondensed_700Bold']);
  for (const f of own) expect(Object.keys(load.mock.calls[0][0] as object)).toContain(f);
});

test('kroje, które się nie wczytają (błąd albo brak odpowiedzi), nie blokują startu — po 3 s krój systemowy', async () => {
  load.mockReturnValue(new Promise(() => {}));
  await renderApp(); await flushAll(100);
  expect(screen.queryByText('Postępy')).toBeNull(); /* jeszcze kółko */
  await flushAll(3000); expect(screen.getAllByText('Postępy').length).toBeGreaterThan(0);
  load.mockRejectedValue(new Error('font'));
  await renderApp(); await flushAll(10); expect(screen.getAllByText('Postępy').length).toBeGreaterThan(0);
});

test('zakładki bez emoji (ikony SVG); ekran startowy i intro na tle bg z tokenów; ikona aplikacji zostaje przy rysunku Tulei', async () => {
  await renderApp(); await flushAll(10);
  for (const e of ['🏋️', '📋', '📚', '📈', '⋯']) expect(screen.queryByText(e)).toBeNull();
  const app = JSON.parse(fs.readFileSync(path.join(root, 'app.json'), 'utf8')).expo;
  const splash = app.plugins.find((p: unknown) => Array.isArray(p) && p[0] === 'expo-splash-screen')[1];
  expect(splash.backgroundColor).toBe(light.bg); /* STOP E3: tło startu = bg z tokenów (było BRAND.paper) — bez błysku przy starcie, bez skoku tła po intro */
  expect(splash.dark.backgroundColor).toBe(dark.bg); /* było #121316 */
  expect(splash.image).toBe('./assets/splash.png'); expect(splash.dark.image).toBe('./assets/splash-dark.png');
  const { iconColors } = require('@/lib/brandIcon'); expect([iconColors('light').bg, iconColors('dark').bg]).toEqual([light.bg, dark.bg]);
  expect([iconColors('light').ink, iconColors('dark').ink]).toEqual([BRAND.ink, '#ECEAE4']); /* tusz gryfu w intro bez zmian (rysunek ikony, STOP E3: kontrast 14,57:1 / 14,24:1 do nowego tła) */
  expect(JSON.stringify(app)).not.toMatch(/E8590C|F2F0EB/i);
  const notif = app.plugins.find((p: unknown) => Array.isArray(p) && p[0] === 'expo-notifications')[1]; expect(notif.color).toBe(BRAND.signal);
  /* ikona: koniec sztangi z talerzami w kolorach IWF (25 czerwony, 20 niebieski, 15 żółty, 10 zielony) — trzy warianty iOS (rysunek bez zmian, STOP E2) */
  const { PLATE_COLORS } = require('@/lib/discColors');
  for (const f of ['icon.svg', 'icon-dark.svg', 'icon-tinted.svg']) expect(fs.existsSync(path.join(root, 'assets/brand', f))).toBe(true);
  const svg = fs.readFileSync(path.join(root, 'assets/brand/icon.svg'), 'utf8');
  for (const c of [PLATE_COLORS.red, PLATE_COLORS.blue, PLATE_COLORS.yellow, PLATE_COLORS.green]) expect(svg.toLowerCase()).toContain(c.toLowerCase());
  expect(app.ios.icon).toEqual({ light: './assets/icon.png', dark: './assets/icon-dark.png', tinted: './assets/icon-tinted.png' });
  for (const f of ['icon.png', 'icon-dark.png', 'icon-tinted.png']) { const b = fs.readFileSync(path.join(root, 'assets', f)); expect([f, b.readUInt32BE(16), b.readUInt32BE(20)]).toEqual([f, 1024, 1024]); }
});

test('audyt cd60eec MEDIUM: wąskie pola liczbowe nie używają kroju mono (ucinał „102,5” w polu 56 pt) — cyfry tabelaryczne', () => {
  const { NUM_FONT } = require('@/components/ui');
  expect(NUM_FONT.fontFamily).not.toBe(F.mono); expect(NUM_FONT.fontFamily).not.toBe(F.monoBold);
  expect(NUM_FONT.fontVariant).toEqual(['tabular-nums']);
  const src = ['components/ActiveWorkout.tsx', 'app/history/edit/[id].tsx'].map(f => fs.readFileSync(path.join(root, f), 'utf8')).join('\n');
  expect(src).not.toMatch(/kind !== 'normal' \? F\.monoBold : F\.mono/); /* etykieta serii w kolumnie 24 pt łamała „12•” */
});

test('Live Activity (Swift) w kolorach ciemnej palety: tło = dark.bg, akcent = dark.accent (jedno źródło: lib/theme.ts)', () => {
  const swift = fs.readFileSync(path.join(root, 'targets/rest-widget/RestLiveActivity.swift'), 'utf8');
  const cols = [...swift.matchAll(/Color\(red: ([\d.]+), green: ([\d.]+), blue: ([\d.]+)\)/g)].map(m => [Number(m[1]), Number(m[2]), Number(m[3])]);
  const near = (a: number[], b: number[]) => a.every((v, i) => Math.abs(v - b[i]) < 0.003);
  expect(cols.length).toBeGreaterThan(0);
  for (const c of cols) expect([c, near(c, rgb(dark.bg)) || near(c, rgb(dark.accent))]).toEqual([c, true]);
  expect(cols.some(c => near(c, rgb(dark.accent)))).toBe(true); expect(cols.some(c => near(c, rgb(dark.bg)))).toBe(true);
});

test('kolor akcentu rozszerzenia widżetu i zegarka = akcent palety (jasny granat tablicy, ciemny krem) — bez niebieskiego Tulei', () => {
  for (const f of ['../targets/rest-widget/expo-target.config.js', '../targets/watch-app/expo-target.config.js']) {
    const cfg = require(f);
    expect([f, JSON.stringify(cfg.colors.$accent).toLowerCase()]).toEqual([f, JSON.stringify({ light: light.accent, dark: dark.accent }).toLowerCase()]);
    expect(JSON.stringify(cfg).toLowerCase()).not.toMatch(/ff8a3d|1f5fd1|6f9bf2/);
  }
  for (const d of ['rest-widget', 'watch-app']) { /* wygenerowane zestawy kolorów w repo zgadzają się z paletą (wtyczka zapisuje składowe = hex / 255) */
    const cs = JSON.parse(fs.readFileSync(path.join(root, 'targets', d, 'Assets.xcassets/$accent.colorset/Contents.json'), 'utf8')).colors as { color: { components: { red: number; green: number; blue: number } }; appearances?: unknown[] }[];
    const comp = (c: (typeof cs)[number]) => [c.color.components.red, c.color.components.green, c.color.components.blue];
    const near = (a: number[], b: number[]) => a.every((v, i) => Math.abs(v - b[i]) < 0.003);
    expect([d, near(comp(cs.find(c => !c.appearances)!), rgb(light.accent))]).toEqual([d, true]);
    expect([d, near(comp(cs.find(c => c.appearances)!), rgb(dark.accent))]).toEqual([d, true]);
  }
});

test('ikona zegarka (STOP E3, opcja b po odrzuceniu wysyłki build 1026, 22.10.2026): pole icon: w konfiguracji celu — wtyczka ustawia wtedy ASSETCATALOG_COMPILER_APPICON_NAME (a z niego CFBundleIconName); bez niego App Store Connect odrzuca wysyłkę (lekcja w docs/40, R-013)', () => {
  const cfg = fs.readFileSync(path.join(root, 'targets/watch-app/expo-target.config.js'), 'utf8');
  expect(cfg).toMatch(/^\s*icon: '\.\.\/\.\.\/assets\/icon\.png',/m);
  const dir = path.join(root, 'targets/watch-app/Assets.xcassets/AppIcon.appiconset');
  const c = JSON.parse(fs.readFileSync(path.join(dir, 'Contents.json'), 'utf8')) as { images: { filename: string; size: string; platform: string }[] };
  expect(c.images).toEqual([{ filename: 'App-Icon-1024x1024@1x.png', idiom: 'universal', size: '1024x1024', platform: 'watchos' }]);
  expect(pngInfo(path.join(dir, 'App-Icon-1024x1024@1x.png'))).toMatchObject({ w: 1024, h: 1024 });
  expect(fs.existsSync(path.join(dir, 'App-Icon-1088x1088.png'))).toBe(false);
});
