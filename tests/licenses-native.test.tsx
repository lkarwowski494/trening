/*
 * SEC2-06 (audyt kontrolny 1, 09.10.2026): ekran licencji pomijał biblioteki natywne spoza npm, które React Native kompiluje do binarki iOS
 * (folly, glog, double-conversion, fmt, fast_float, boost; także SocketRocket) — BSD-3 i Apache-2.0 wymagają notki przy dystrybucji binarnej.
 * Lista: scripts/licenses-native.json (wersja z podspec, licencja i notka z pliku licencji projektu w tej wersji), treść licencji spoza npm:
 * scripts/licenses-native/<SPDX>.txt — w repo (bez pobierania przy budowaniu). ios/Podfile.lock nie jest w repo (ios/ powstaje w CI) — gdy jest
 * (lokalny prebuild), test sprawdza też jego wersje; inaczej stała lista porównana z podspec w node_modules/react-native.
 * Rodzaje (docs/20): dane (lista ⇔ podspec, wygenerowany plik ⇔ lista), ekran (sekcja i wiersze), języki (nagłówek sekcji w 26 językach).
 */
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { renderApp, flushAll, screen, go } from './app';
import { LICENSES, LICENSE_TEXTS, NATIVE_LICENSES } from '@/lib/licenses.generated';
import { applyLang, LANGS, t } from '@/lib/i18n';

jest.setTimeout(60000);
const root = join(__dirname, '..');
const RN = join(root, 'node_modules/react-native');
const NATIVE: { _opis: string; pods: { pod: string; name: string; version: string; license: string; copyright: string[]; url: string }[] } = JSON.parse(readFileSync(join(root, 'scripts/licenses-native.json'), 'utf8'));
/** Wersja z podspec (spec.version = '…') albo ze stałych React Native (folly, SocketRocket — scripts/cocoapods/helpers.rb). */
function podVersion(pod: string): string | undefined {
  const helpers = readFileSync(join(RN, 'scripts/cocoapods/helpers.rb'), 'utf8');
  if (pod === 'RCT-Folly') return /@@folly_config = \{\s*:version => '([^']+)'/.exec(helpers)?.[1];
  if (pod === 'SocketRocket') return /@@socket_rocket_config = \{\s*:version => '([^']+)'/.exec(helpers)?.[1];
  const f = join(RN, 'third-party-podspecs', `${pod}.podspec`); if (!existsSync(f)) return undefined;
  return /spec\.version\s*=\s*['"]([^'"]+)['"]/.exec(readFileSync(f, 'utf8'))?.[1];
}

describe('SEC2-06: licencje bibliotek natywnych spoza npm', () => {
  test('każdy podspec React Native (poza zbiorczym ReactNativeDependencies — te same biblioteki w wersji prekompilowanej) i SocketRocket są na liście, wersje zgodne', () => {
    const pods = readdirSync(join(RN, 'third-party-podspecs')).filter(f => f.endsWith('.podspec')).map(f => f.replace(/\.podspec$/, '')).filter(p => p !== 'ReactNativeDependencies');
    expect(pods.length).toBeGreaterThanOrEqual(6);
    expect(NATIVE.pods.map(p => p.pod).sort()).toEqual([...pods, 'SocketRocket'].sort());
    for (const p of NATIVE.pods) expect({ pod: p.pod, v: p.version }).toEqual({ pod: p.pod, v: podVersion(p.pod) });
  });
  test('ios/Podfile.lock: gdy jest (lokalny prebuild) — te same wersje; w repo go nie ma (powód zapisany w liście)', () => {
    const lock = join(root, 'ios/Podfile.lock');
    if (!existsSync(lock)) { expect(NATIVE._opis).toMatch(/Podfile\.lock nie jest w repo/); return; }
    const s = readFileSync(lock, 'utf8');
    for (const p of NATIVE.pods) { const m = new RegExp(`^  - ${p.pod.replace(/[-]/g, '\\-')} \\(([^)]+)\\)`, 'm').exec(s); if (m) expect({ pod: p.pod, v: m[1] }).toEqual({ pod: p.pod, v: p.version }); }
  });
  test('każda licencja ma treść na ekranie (npm albo scripts/licenses-native); notki BSD/MIT/Apache niepuste; adres pliku licencji w tej wersji', () => {
    for (const p of NATIVE.pods) {
      expect({ pod: p.pod, text: !!LICENSE_TEXTS[p.license]?.text }).toEqual({ pod: p.pod, text: true });
      if (p.license !== 'BSL-1.0') expect({ pod: p.pod, c: p.copyright.length > 0 }).toEqual({ pod: p.pod, c: true }); /* BSL-1.0: bez wymogu notki w kodzie maszynowym */
      expect(p.url).toMatch(new RegExp(`^https://github\\.com/.+/blob/[^/]*${p.version.replace(/\./g, '\\.')}[^/]*/`));
    }
    expect(LICENSE_TEXTS['BSL-1.0'].text).toBe(readFileSync(join(root, 'scripts/licenses-native/BSL-1.0.txt'), 'utf8').replace(/\r\n/g, '\n').trim());
  });
  test('lib/licenses.generated.ts: NATIVE_LICENSES = lista (nazwa, wersja, licencja, notki); pakiety npm bez zmian', () => {
    expect(NATIVE_LICENSES).toEqual(NATIVE.pods.map(p => [p.name, p.version, p.license, p.copyright]));
    for (const r of NATIVE_LICENSES) expect({ n: r[0], text: !!LICENSE_TEXTS[r[2]] }).toEqual({ n: r[0], text: true }); /* każda biblioteka natywna ma treść licencji */
    expect(LICENSES.some(r => r[0] === 'react-native')).toBe(true);
  });
  test('ekran: sekcja „Biblioteki natywne iOS spoza npm (n)” z wierszami i licznik licencji obejmuje biblioteki natywne', async () => {
    await renderApp(); await go('/more/licenses'); await flushAll(10);
    expect(screen.getByText(t('Biblioteki natywne iOS spoza npm ({n})', { n: NATIVE.pods.length }))).toBeTruthy();
    expect(screen.getByText(`Biblioteki natywne iOS spoza npm (${NATIVE.pods.length})`)).toBeTruthy(); /* PL — tekst na ekranie */
    for (const p of NATIVE.pods) expect(screen.getByText(`${p.name} ${p.version}`)).toBeTruthy();
    expect(screen.getByText(t('pakiety: {n} · treść wg {p}', { n: 1, p: 'boost' }))).toBeTruthy(); /* licencja BSL-1.0 tylko z biblioteki natywnej — treść z repo */
  });
  test('nagłówek sekcji w 26 językach (tłumaczenie ≠ PL poza PL)', () => {
    for (const l of LANGS) { applyLang(l); const s = t('Biblioteki natywne iOS spoza npm ({n})', { n: 7 }); expect(s).toContain('7'); if (l !== 'pl') expect({ l, s: s !== 'Biblioteki natywne iOS spoza npm (7)' }).toEqual({ l, s: true }); }
    applyLang('pl');
  });
});
