/* Eksport stron do powłoki marki apps4brew.com (W-18, AG2 zad. 1, 15.11.2026; decyzja właściciela 09.11.2026 „RepsGoat” i 15.11.2026 „nazwa musi być odzwierciedlona wszędzie”):
 * skrypt scripts/site/eksport-apps4brew.mjs podmieniał tylko sekcje treści, a w powłoce zostawała stara nazwa (tytuł, meta, og:*, h1, aria-label „Droga aplikacji…”, stopka,
 * tytuł i opis espresso wpisane na sztywno). Powłoka bez treści: tests/fixtures/apps4brew-www/trening (żywe strony z 15.11.2026, sekcje zastąpione znacznikiem). */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import { BRAND_NAME } from '@/lib/brand';

const ROOT = path.join(__dirname, '..');
const SKRYPT = path.join(ROOT, 'scripts/site/eksport-apps4brew.mjs');
const MODUL = path.join(ROOT, 'scripts/site/marka-powloki.mjs');
const przemarkuj = (html: string, marka = BRAND_NAME): string => execFileSync('node', ['--input-type=module', '-e',
  `import { przemarkuj } from ${JSON.stringify(MODUL)}; process.stdout.write(przemarkuj(${JSON.stringify(html)}, ${JSON.stringify(marka)}));`], { encoding: 'utf8' });
const poza = (html: string) => html.replace(/<section lang="(pl|en)"[^>]*>[\s\S]*?<\/section>/g, '<SEC/>');
const STARA = /Trening\b|Training\b/;

describe('eksport stron do apps4brew-www: marka w powłoce', () => {
  let out: string;
  beforeAll(() => {
    out = fs.mkdtempSync(path.join(os.tmpdir(), 'apps4brew-www-'));
    fs.cpSync(path.join(ROOT, 'tests/fixtures/apps4brew-www'), out, { recursive: true });
    execFileSync('node', [SKRYPT, out], { encoding: 'utf8' });
  });
  afterAll(() => fs.rmSync(out, { recursive: true, force: true }));
  const strona = (n: string) => fs.readFileSync(path.join(out, 'trening', `${n}.html`), 'utf8');

  test('powłoka wyeksportowanych stron (privacy, support, espresso) nie ma starej nazwy aplikacji poza treścią', () => {
    for (const n of ['privacy', 'support', 'espresso']) {
      const trafienia = poza(strona(n)).split('\n').filter(l => STARA.test(l.replace(/https?:\/\/apps4brew\.com\/trening\/|\.\.\/trening\/|assets\/trening-icon/g, '')));
      expect([n, trafienia]).toEqual([n, []]);
    }
  });
  test('tytuł, meta description, og:title, og:description, h1 i aria-label z nową nazwą (PL i EN)', () => {
    const p = strona('privacy'); const s = strona('support');
    expect(p).toContain(`<title data-pl="${BRAND_NAME} — polityka prywatności — Apps4Brew" data-en="${BRAND_NAME} — Privacy Policy — Apps4Brew">${BRAND_NAME} — polityka prywatności — Apps4Brew</title>`);
    expect(p).toContain(`content="Polityka prywatności aplikacji ${BRAND_NAME} (Apps4Brew)`);
    expect(p).toContain(`<meta property="og:title" content="${BRAND_NAME} — polityka prywatności — Apps4Brew">`);
    expect(p).toContain(`<h1 data-pl="${BRAND_NAME} — polityka prywatności" data-en="${BRAND_NAME} — Privacy Policy">${BRAND_NAME} — polityka prywatności</h1>`);
    expect(p).toContain(`aria-label="Droga aplikacji ${BRAND_NAME}: etap`); expect(p).toContain(`data-label-en="${BRAND_NAME} path: stage`);
    expect(s).toContain(`<h1 data-pl="${BRAND_NAME} — wsparcie" data-en="${BRAND_NAME} — Support">${BRAND_NAME} — wsparcie</h1>`);
    expect(s).toContain(`content="Wsparcie aplikacji ${BRAND_NAME} (Apps4Brew)`);
    expect(p).toContain(`<span data-pl="${BRAND_NAME}" data-en="${BRAND_NAME}">${BRAND_NAME}</span>`);
  });
  test('espresso: tytuł i opis z nową nazwą (stałe skryptu nie są na sztywno)', () => {
    const e = strona('espresso');
    expect(e).toContain(`<title data-pl="${BRAND_NAME} — indeks espresso — Apps4Brew" data-en="${BRAND_NAME} — Espresso index — Apps4Brew">${BRAND_NAME} — indeks espresso — Apps4Brew</title>`);
    expect(e).toContain(`porównanie ceny aplikacji ${BRAND_NAME} ze średnią ceną espresso`);
    expect(e).toContain('apps4brew.com/trening/espresso.html"'); /* adres zostaje (App Store Connect) */
  });
  test('ponowny eksport na już przemarkowanej powłoce daje te same strony (espresso nie dostaje tytułu ani opisu wsparcia)', () => {
    const przed = ['privacy', 'support', 'espresso'].map(strona);
    execFileSync('node', [SKRYPT, out], { encoding: 'utf8' });
    expect(['privacy', 'support', 'espresso'].map(strona)).toEqual(przed);
    expect(strona('espresso')).not.toContain('wsparcie — Apps4Brew');
    expect(strona('espresso')).not.toContain('Wsparcie aplikacji');
  });
  test('adresy trening/… i ikona assets/trening-icon.png zostają (są w App Store Connect)', () => {
    expect(strona('privacy')).toContain('https://apps4brew.com/trening/privacy.html');
    expect(strona('support')).toContain('../trening/privacy.html');
  });
});

describe('przemarkuj: reguły i granice', () => {
  test('jest idempotentne (ponowny eksport na już przemarkowanej powłoce nic nie zmienia)', () => {
    const html = fs.readFileSync(path.join(ROOT, 'tests/fixtures/apps4brew-www/trening/support.html'), 'utf8');
    const raz = przemarkuj(html); expect(raz).not.toBe(html); expect(przemarkuj(raz)).toBe(raz);
  });
  test('nie dotyka treści sekcji (rzeczownik „trening” i zdania treści zostają)', () => {
    const sekcje = '<section lang="pl" data-lang-section="pl"><p>Trening — to ćwiczenia. Aplikacja Trening w treści.</p></section><section lang="en" data-lang-section="en"><p>Training — path</p></section>';
    expect(przemarkuj(`<title>Trening — x</title>${sekcje}`)).toBe(`<title>${BRAND_NAME} — x</title>${sekcje}`);
  });
  test('pisownia marki pochodzi z podanego argumentu (lib/brand.ts przez scripts/marka.mjs), nie ze stałej', () => {
    expect(przemarkuj('<title>Trening — wsparcie</title>', 'XyZ')).toBe('<title>XyZ — wsparcie</title>');
    expect(fs.readFileSync(SKRYPT, 'utf8')).toMatch(/markaZKodu/);
  });
});
