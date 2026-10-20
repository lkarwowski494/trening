/* Adresy polityki prywatności i wsparcia (decyzja właściciela 14.10.2026, D-2 A — docs/41): apps4brew.com/trening/, te same w aplikacji
 * (lib/products.ts) i w danych do App Store Connect (store/app-store-urls.json). */
import * as fs from 'fs';
import * as path from 'path';
import { PRIVACY_URL, SUPPORT_URL } from '@/lib/products';

const urls = JSON.parse(fs.readFileSync(path.join(__dirname, '../store/app-store-urls.json'), 'utf8'));

describe('adresy prywatności i wsparcia (D-2 A)', () => {
  test('aplikacja: strona marki apps4brew.com, HTTPS, bez adresu repozytorium', () => {
    expect(PRIVACY_URL).toBe('https://apps4brew.com/trening/privacy.html'); expect(SUPPORT_URL).toBe('https://apps4brew.com/trening/support.html');
    for (const u of [PRIVACY_URL, SUPPORT_URL]) expect(u).not.toMatch(/github\.io|github\.com/);
  });
  test('store/app-store-urls.json = stałe aplikacji (App Store Connect i aplikacja wskazują tę samą stronę)', () => {
    expect(urls.privacyPolicyUrl).toBe(PRIVACY_URL); expect(urls.supportUrl).toBe(SUPPORT_URL); expect(urls.marketingUrl).toBe('https://apps4brew.com/');
  });
  test('w kodzie aplikacji nie zostały stare adresy github.io', () => {
    const walk = (d: string): string[] => fs.readdirSync(path.join(__dirname, '..', d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : /\.(ts|tsx)$/.test(e.name) ? [path.join(d, e.name)] : []);
    const hits = ['lib', 'app', 'components'].flatMap(walk).filter(f => /lkarwowski494\.github\.io/.test(fs.readFileSync(path.join(__dirname, '..', f), 'utf8')));
    expect(hits).toEqual([]);
  });
});
