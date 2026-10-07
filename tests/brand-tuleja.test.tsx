/* Styl marki „Tuleja” (decyzja właściciela 07.10.2026: „Podoba mi się grafika B”; docs/16, docs/21 pkt 6). Zastępuje „Kredę” (05.10.2026). */
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

test('kolory Tulei: papierowe tło i atramentowy tekst za dnia, grafit po zmroku; akcent = niebieski talerza 20 kg', () => {
  const { PLATE_COLORS } = require('@/lib/plates');
  expect(light.bg).toBe(BRAND.paper); expect(light.text).toBe(BRAND.ink); expect(light.accent).toBe(BRAND.signal);
  expect(BRAND.signal).toBe(PLATE_COLORS.blue); /* jedno źródło: kolor marki = talerz 20 kg (lib/plates.ts) */
  for (const old of ['#E8590C', '#F2F0EB', '#1E1F22', '#c2410c', '#ff8a3d']) expect(JSON.stringify([BRAND, light, dark]).toLowerCase()).not.toContain(old.toLowerCase());
  expect(Object.keys(dark).sort()).toEqual(Object.keys(light).sort());
});

test('kroje: każdy krój z F ma plik; start ładuje wszystkie', async () => {
  for (const f of Object.values(F)) expect([f, !!(FONT_FILES as Record<string, unknown>)[f]]).toEqual([f, true]);
  await renderApp(); await flushAll(10);
  expect(Object.keys(load.mock.calls[0][0] as object).sort()).toEqual(Object.keys(FONT_FILES).sort()); /* Plex Sans, Tektur, Plex Mono (07.10.2026) */
  for (const f of Object.values(F)) expect(Object.keys(load.mock.calls[0][0] as object)).toContain(f);
});

test('kroje, które się nie wczytają (błąd albo brak odpowiedzi), nie blokują startu — po 3 s krój systemowy', async () => {
  load.mockReturnValue(new Promise(() => {}));
  await renderApp(); await flushAll(100);
  expect(screen.queryByText('Szablony')).toBeNull(); /* jeszcze kółko */
  await flushAll(3000); expect(screen.getAllByText('Szablony').length).toBeGreaterThan(0);
  load.mockRejectedValue(new Error('font'));
  await renderApp(); await flushAll(10); expect(screen.getAllByText('Szablony').length).toBeGreaterThan(0);
});

test('zakładki bez emoji (ikony SVG); ikona aplikacji i ekran startowy w kolorach marki', async () => {
  await renderApp(); await flushAll(10);
  for (const e of ['🏋️', '📋', '📚', '📈', '⋯']) expect(screen.queryByText(e)).toBeNull();
  const app = JSON.parse(fs.readFileSync(path.join(root, 'app.json'), 'utf8')).expo;
  const splash = app.plugins.find((p: unknown) => Array.isArray(p) && p[0] === 'expo-splash-screen')[1];
  expect(splash.backgroundColor).toBe(BRAND.paper); /* domyślny wygląd jasny (potwierdzone 07.10.2026) — bez błysku przy starcie */
  expect(JSON.stringify(app)).not.toMatch(/E8590C|F2F0EB/i);
  const notif = app.plugins.find((p: unknown) => Array.isArray(p) && p[0] === 'expo-notifications')[1]; expect(notif.color).toBe(BRAND.signal);
  /* ikona: koniec sztangi z talerzami w kolorach IWF (25 czerwony, 20 niebieski, 15 żółty, 10 zielony) — trzy warianty iOS */
  const { PLATE_COLORS } = require('@/lib/plates');
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

test('Live Activity (Swift) w kolorach ciemnego motywu: tło = dark.bg, akcent = dark.accent (jedno źródło: lib/theme.ts)', () => {
  const swift = fs.readFileSync(path.join(root, 'targets/rest-widget/RestLiveActivity.swift'), 'utf8');
  const rgb = (h: string) => h.slice(1).match(/../g)!.map(x => parseInt(x, 16) / 255);
  const cols = [...swift.matchAll(/Color\(red: ([\d.]+), green: ([\d.]+), blue: ([\d.]+)\)/g)].map(m => [Number(m[1]), Number(m[2]), Number(m[3])]);
  const near = (a: number[], b: number[]) => a.every((v, i) => Math.abs(v - b[i]) < 0.003);
  expect(cols.length).toBeGreaterThan(0);
  for (const c of cols) expect([c, near(c, rgb(dark.bg)) || near(c, rgb(dark.accent))]).toEqual([c, true]);
  expect(cols.some(c => near(c, rgb(dark.accent)))).toBe(true); expect(cols.some(c => near(c, rgb(dark.bg)))).toBe(true);
});
