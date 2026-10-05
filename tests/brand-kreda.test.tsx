/* Styl marki „Kreda” (decyzja właściciela 05.10.2026: „Podoba mi się kreda”, „Kreda + ciemna wersja”; docs/16). */
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

test('kolory Kredy: kredowe tło i grafitowy tekst za dnia, odwrotnie po zmroku; jeden akcent pomarańczowy', () => {
  expect(light.bg).toBe(BRAND.chalk); expect(light.text).toBe(BRAND.graphite);
  expect(dark.text).toBe(BRAND.chalk); expect(BRAND.signal).toBe('#E8590C');
  expect(Object.keys(dark).sort()).toEqual(Object.keys(light).sort());
});

test('kroje: każdy krój z F ma plik; start ładuje wszystkie', async () => {
  for (const f of Object.values(F)) expect([f, !!(FONT_FILES as Record<string, unknown>)[f]]).toEqual([f, true]);
  await renderApp(); await flushAll(10);
  expect(Object.keys(load.mock.calls[0][0] as object).sort()).toEqual(Object.values(F).sort());
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
  expect(splash.backgroundColor).toBe(BRAND.chalk); /* domyślny wygląd jasny (05.10.2026) — bez błysku przy starcie */
  expect(fs.readFileSync(path.join(root, 'assets/brand/icon.svg'), 'utf8')).toContain(BRAND.signal);
});

test('audyt cd60eec MEDIUM: wąskie pola liczbowe nie używają kroju mono (ucinał „102,5” w polu 56 pt) — cyfry tabelaryczne', () => {
  const { NUM_FONT } = require('@/components/ui');
  expect(NUM_FONT.fontFamily).not.toBe(F.mono); expect(NUM_FONT.fontFamily).not.toBe(F.monoBold);
  expect(NUM_FONT.fontVariant).toEqual(['tabular-nums']);
  const src = ['components/ActiveWorkout.tsx', 'app/history/edit/[id].tsx'].map(f => fs.readFileSync(path.join(root, f), 'utf8')).join('\n');
  expect(src).not.toMatch(/kind !== 'normal' \? F\.monoBold : F\.mono/); /* etykieta serii w kolumnie 24 pt łamała „12•” */
});
