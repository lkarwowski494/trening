/**
 * ZB-010 (decyzja właściciela 28.10.2026 ~19:10 UTC, wariant A; docs/21 „Backlog 1.0.1 — podatność zależności”):
 * `decode-uri-component` < 0.5 (GHSA-vcc3-ghjq-m6fr, DoS przy spreparowanym linku `trening://…`) nie może wejść do aplikacji.
 * Wymuszenie `overrides` nie działa (0.5 to ESM, query-string 7 to CommonJS) — naprawa przez SDK 58 (expo-router ≥ 58.0.13 bez query-string).
 * Warunek ZB-010: aktualizacja SDK nie zmienia schematu danych (SCHEMA_VERSION 19) w tym samym wydaniu.
 */
import fs from 'fs';
import path from 'path';

const lock = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package-lock.json'), 'utf8')) as { packages: Record<string, { version?: string }> };
const entries = (name: string) => Object.entries(lock.packages).filter(([k]) => k === `node_modules/${name}` || k.endsWith(`/node_modules/${name}`)).map(([k, v]) => ({ k, v: v.version ?? '' }));
const major = (v: string) => v.split('.').map(Number);
const atLeast = (v: string, [a, b]: [number, number]) => { const [x, y] = major(v); return x > a || (x === a && y >= b); };

describe('ZB-010 (28.10.2026): podatna wersja decode-uri-component poza aplikacją', () => {
  test('każda kopia decode-uri-component w package-lock.json ma wersję ≥ 0.5 (albo nie ma jej wcale)', () => {
    const bad = entries('decode-uri-component').filter(e => !atLeast(e.v, [0, 5]));
    expect(bad).toEqual([]);
  });
  test('expo-router z SDK 58 (≥ 58.0.13) — bez query-string 7, które ciągnęło decode-uri-component 0.2', () => {
    const r = entries('expo-router').find(e => e.k === 'node_modules/expo-router');
    expect(r && atLeast(r.v, [58, 0])).toBe(true);
    const [, , patch] = major(r!.v);
    expect(patch).toBeGreaterThanOrEqual(13);
    expect(entries('query-string').filter(e => !atLeast(e.v, [9, 0]))).toEqual([]);
  });
  test('aktualizacja SDK nie zmienia schematu danych: SCHEMA_VERSION = 19 (lib/seed.ts)', () => {
    expect(require('@/lib/seed').SCHEMA_VERSION).toBe(19);
  });
  test('expo-router 58 na iOS 26+: nagłówek stosu nieprzezroczysty jak w SDK 57 (headerTransparent: false), tytuł krojem marki', () => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'app', '_layout.tsx'), 'utf8');
    const opts = src.slice(src.indexOf('<Stack screenOptions={{'), src.indexOf('}}>', src.indexOf('<Stack screenOptions={{')));
    expect(opts).toMatch(/headerTransparent: false/);
    expect(opts).toMatch(/headerTitleStyle: \{ fontFamily:/); /* iOS 26+: bez fontFamily nagłówek bierze krój systemowy */
  });
  test('expo-router 58: unstable_settings.anchor zamiast usuniętego initialRouteName (zakładki pod ekranem z linku)', () => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'app', '_layout.tsx'), 'utf8');
    expect(src).toMatch(/export const unstable_settings = \{ anchor: '\(tabs\)' \}/);
    expect(src).not.toMatch(/initialRouteName/);
  });
});
