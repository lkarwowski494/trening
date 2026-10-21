/*
 * Audyt M1 z 19.10.2026, partia 2 — M1-audytor-generalny-013: aplikacja linkowała do polityki prywatności z wersji 0.16.0 (bez zegarka, zapisu tętna i energii
 * do Zdrowia, głosu). Adres polityki w aplikacji = adres w App Store Connect (store/app-store-urls.json, decyzja D-2 A z 14.10.2026), a strona z `site/`
 * ma wersję nie niższą niż wersja aplikacji i opisuje zegarek (PL i EN). Czerwone na 8273448 (adres github.io, strona 0.16.0, brak pliku adresów).
 * Publikacja: site/privacy.html jest źródłem; strona apps4brew.com/trening/ żyje w repo strony marki (krok: docs/41, scripts/site/export-apps4brew.mjs na gałęzi f020-sklep).
 */
import * as fs from 'fs';
import * as path from 'path';
import { PRIVACY_URL, SUPPORT_URL } from '@/lib/products';

const root = path.join(__dirname, '..'); const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');
const ver = (s: string) => s.split('.').map(Number); const gte = (a: string, b: string) => { const x = ver(a), y = ver(b); for (let i = 0; i < 3; i++) { if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) > (y[i] ?? 0); } return true; };

describe('M1-013: polityka prywatności pod adresem z aplikacji jest aktualna', () => {
  test('PRIVACY_URL i SUPPORT_URL = adresy w store/app-store-urls.json (App Store Connect), strona marki, bez adresu repozytorium', () => {
    const urls = JSON.parse(read('store/app-store-urls.json'));
    expect(PRIVACY_URL).toBe(urls.privacyPolicyUrl); expect(SUPPORT_URL).toBe(urls.supportUrl);
    for (const u of [PRIVACY_URL, SUPPORT_URL]) { expect(u).toMatch(/^https:\/\/apps4brew\.com\/trening\//); expect(u).not.toMatch(/github\.(io|com)/); }
  });
  test('site/privacy.html: wersja aplikacji w treści (PL i EN) ≥ wersja z app.json', () => {
    const app = JSON.parse(read('app.json')).expo.version as string; const html = read('site/privacy.html');
    const pl = /wersja aplikacji (\d+\.\d+\.\d+)/.exec(html)?.[1]; const en = /app version (\d+\.\d+\.\d+)/.exec(html)?.[1];
    expect([pl, en].every(Boolean)).toBe(true);
    expect([app, pl, gte(pl!, app)]).toEqual([app, pl, true]); expect([app, en, gte(en!, app)]).toEqual([app, en, true]);
  });
  test('site/privacy.html opisuje aplikację zegarka i zapis tętna i energii do Zdrowia (PL i EN) tak, jak działa kod zegarka', () => {
    const html = read('site/privacy.html'); const wc = read('targets/watch-app/WorkoutController.swift');
    expect(wc).toMatch(/HKWorkoutSession/); expect(wc).toMatch(/\.heartRate/); expect(wc).toMatch(/\.activeEnergyBurned/);
    for (const w of ['<h2>Apple Watch (opcjonalnie)</h2>', 'odczytuje tętno i energię aktywną', 'zapisuje trening siłowy w Apple Health', '<h2>Apple Watch (optional)</h2>', 'reads heart rate and active energy', 'saves the strength workout to Apple Health']) expect(html).toContain(w);
  });
});
