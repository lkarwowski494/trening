/* Nazwa aplikacji „RepsGoat” od 1.1 (decyzja właściciela 09.11.2026, docs/18 „nowa nazwa aplikacji od wersji 1.1: marka RepsGoat”; ZB-056).
 * Pisownia marki jest w JEDNYM miejscu (lib/brand.ts); ten test sprawdza, że każde miejsce nazwy bierze ją stamtąd albo jest z nią zgodne,
 * także co do wielkości liter (zmiana na inną pisownię = zmiana jednej linii w lib/brand.ts + `node scripts/marka.mjs --write`). */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import { BRAND_NAME, APP_STORE_NAME_MAX } from '@/lib/brand';
import { LANGS, APP_NAME, applyLang, appName, t } from '@/lib/i18n';

const root = path.join(__dirname, '..');
const read = (p: string) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p: string) => JSON.parse(read(p));

test('marka: RepsGoat (decyzja 09.11.2026), nazwa sklepu max 30 znaków', () => {
  expect(BRAND_NAME.toLowerCase()).toBe('repsgoat') /* wielkość liter: tylko lib/brand.ts */;
  expect(APP_STORE_NAME_MAX).toBe(30);
});

test('APP_NAME = marka w każdym z 35 języków, appName() w każdym języku aplikacji', () => {
  expect(LANGS).toHaveLength(35);
  for (const l of LANGS) { expect([l, APP_NAME[l]]).toEqual([l, BRAND_NAME]); applyLang(l); expect(appName()).toBe(BRAND_NAME); }
  applyLang('pl');
});

test('tekst z {app} pokazuje markę w każdym języku (stopka, folder w Plikach, Zdrowie)', () => {
  for (const l of LANGS) { applyLang(l); const s = t('Pliki → Na moim iPhonie → {app} → Backup, ostatnie {n}', { app: appName(), n: 10 }); expect([l, s.includes(BRAND_NAME), s.includes('{app}')]).toEqual([l, true, false]); }
  applyLang('pl');
});

test('iOS: locales/<kod>.json — nazwa pod ikoną i opisy zgód zawierają markę; app.json (nazwa bazowa, zgody w języku źródłowym)', () => {
  const app = json('app.json').expo;
  expect(app.ios.infoPlist.CFBundleDisplayName).toBe(BRAND_NAME);
  for (const l of LANGS) {
    const f = json(`locales/${l}.json`);
    expect([l, f.CFBundleDisplayName]).toEqual([l, BRAND_NAME]);
    expect([l, f.NSHealthShareUsageDescription.includes(BRAND_NAME), f.NSHealthUpdateUsageDescription.includes(BRAND_NAME)]).toEqual([l, true, true]);
  }
  const hk = app.plugins.find((p: unknown) => Array.isArray(p) && p[0] === '@kingstinct/react-native-healthkit')[1];
  expect([hk.NSHealthShareUsageDescription.startsWith(BRAND_NAME), hk.NSHealthUpdateUsageDescription.startsWith(BRAND_NAME)]).toEqual([true, true]);
});

test('zegarek i widżet: nazwa pod ikoną = marka we wszystkich językach (InfoPlist.strings) i w konfiguracji celu', () => {
  for (const l of LANGS) {
    expect([l, read(`targets/watch-app/${l}.lproj/InfoPlist.strings`)]).toEqual([l, expect.stringContaining(`"CFBundleDisplayName" = "${BRAND_NAME}";`)]);
    expect([l, read(`targets/rest-widget/${l}.lproj/InfoPlist.strings`)]).toEqual([l, expect.stringContaining(`"CFBundleDisplayName" = "${BRAND_NAME} — `)]);
  }
  expect(read('targets/watch-app/expo-target.config.js')).toContain(`displayName: '${BRAND_NAME}'`);
  expect(read('targets/rest-widget/expo-target.config.js')).toContain(`displayName: '${BRAND_NAME} — Przerwa'`);
});

test('sklep: nazwa w każdej lokalizacji = „RepsGoat: opis”, max 30 znaków; PL i EN wg decyzji 09.11.2026', () => {
  const { names } = json('store/app-store-names.json') as { names: Record<string, string> };
  expect(Object.keys(names)).toHaveLength(33);
  for (const [loc, n] of Object.entries(names)) { expect([loc, n.startsWith(`${BRAND_NAME}: `), [...n].length <= APP_STORE_NAME_MAX]).toEqual([loc, true, true]); }
  expect(names.pl).toBe(`${BRAND_NAME}: dziennik treningowy`);
  for (const loc of ['en-US', 'en-GB', 'en-AU', 'en-CA']) expect(names[loc]).toBe(`${BRAND_NAME}: Gym Log & Rest Timer`);
});

test('sklep: ukryte słowo kluczowe „repgoat” zostaje w EN obok „offline” (decyzja właściciela 11.11.2026)', () => {
  const m = json('store/app-store-metadata.json').lokalizacje as Record<string, { keywords: string }>;
  for (const loc of ['en-US', 'en-GB', 'en-AU', 'en-CA']) {
    const kw = m[loc].keywords.split(',');
    expect([loc, kw.includes('repgoat'), kw.includes('offline'), Buffer.byteLength(m[loc].keywords) <= 100]).toEqual([loc, true, true, true]);
  }
});

test('sklep: przerwa w podtytułach hr/sl wg słownika, sk bez „váha” (recenzja lokalizacji, wydawca W 11.11.2026)', () => {
  const m = json('store/app-store-metadata.json').lokalizacje as Record<string, { subtitle: string; keywords: string }>;
  expect(m.hr.subtitle).toBe('Serije, planovi, tajmer odmora'); expect(m.hr.subtitle).not.toMatch(/pauz/i);
  expect(m.sl.subtitle).toBe('Serije in časovnik počitka'); expect(m.sl.subtitle).not.toMatch(/odmor/i);
  expect(m.sk.keywords.split(',')).not.toContain('váha'); expect(m.sk.keywords.split(',')).toContain('posilňovanie');
});

test('sklep: podtytuły i słowa kluczowe PL/EN wg decyzji 09.11.2026; opisy mówią o marce, nie o starej nazwie', () => {
  const m = json('store/app-store-metadata.json').lokalizacje as Record<string, { subtitle: string; keywords: string; description: string }>;
  expect(m.pl.subtitle).toBe('Plan treningowy na siłownię');
  expect(m.pl.keywords).toBe('siła,serie,timer,ćwiczenia,domu,stoper,progres,hantle,sztanga,rekordy,1RM,offline,gumy');
  for (const loc of ['en-US', 'en-GB', 'en-AU', 'en-CA']) {
    expect(m[loc].subtitle).toBe('Gym plan & workout tracker');
    const kw = m[loc].keywords.split(','); expect(kw).toEqual(expect.arrayContaining(['offline', 'repgoat']));
    expect(Buffer.byteLength(m[loc].keywords)).toBeLessThanOrEqual(100); expect(new Set(kw).size).toBe(kw.length);
  }
  for (const [loc, v] of Object.entries(m)) { expect([loc, v.subtitle.length <= 30, Buffer.byteLength(v.keywords) <= 100]).toEqual([loc, true, true]); expect([loc, (v.description.match(new RegExp(BRAND_NAME, 'g')) ?? []).length]).toEqual([loc, 2]); }
});

test('strona i dokumenty sklepu: marka w tytułach, nagłówkach i notatkach dla recenzenta', () => {
  for (const f of ['site/index.html', 'site/privacy.html', 'site/support.html', 'site/espresso.html']) expect([f, read(f).includes(BRAND_NAME)]).toEqual([f, true]);
  expect(read('site/index.html')).toContain(`<title>${BRAND_NAME} — `); expect(read('site/index.html')).toContain(`<h1>${BRAND_NAME}</h1>`);
  expect(read('store/review-notes.md')).toContain(`Thank you for reviewing ${BRAND_NAME}.`); expect(read('store/review-notes.en.txt')).toContain(`Thank you for reviewing ${BRAND_NAME}.`);
  expect(read('README.md').split('\n')[0]).toBe(`# ${BRAND_NAME} 🏋️`);
  const iap = json('store/iap-localizations.json').tlumaczenia as Record<string, { group: { name: string } }>;
  for (const [l, v] of Object.entries(iap)) expect([l, v.group.name.startsWith(`${BRAND_NAME} — `)]).toEqual([l, true]);
});

test('pisownia marki spójna z lib/brand.ts we wszystkich plikach zarządzanych (scripts/marka.mjs); inna pisownia jest wykrywana', () => {
  const script = path.join(root, 'scripts', 'marka.mjs');
  expect(() => execFileSync(process.execPath, [script], { stdio: 'pipe' })).not.toThrow();
  const inna = BRAND_NAME.endsWith('GOAT') ? 'RepsGoat' : 'RepsGOAT';
  let out = ''; try { execFileSync(process.execPath, [script, `--marka=${inna}`], { stdio: 'pipe' }); } catch (e) { out = String((e as { stderr?: Buffer }).stderr); }
  expect(out).toContain('locales/pl.json'); expect(out).toContain('store/app-store-names.json'); expect(out).toContain('site/index.html');
});
