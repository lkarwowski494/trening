/*
 * M1-audytor-generalny-066 (DEC-20): pseudolokalizacja w buildzie deweloperskim (każdy tekst z t() w nawiasach ⟦…⟧ — widać, co omija słownik)
 * oraz plik kontekstu krótkich kluczy (≤ 20 znaków) dla tłumacza: docs/lokalizacja/konteksty.json generowany scripts/i18n-context.mjs.
 */
import * as fs from 'fs';
import * as path from 'path';
import { t, tIn, setPseudo, isPseudo } from '@/lib/i18n';
import { renderApp, flushAll, screen, go } from './app';

jest.setTimeout(60000);
afterEach(() => setPseudo(false));
const G = global as unknown as { __DEV__: boolean };

describe('pseudolokalizacja', () => {
  test('wyłączona domyślnie; włączona: t() otacza tekst ⟦…⟧, parametry {…} podstawione w środku', () => {
    expect(isPseudo()).toBe(false); expect(t('Ustawienia')).toBe('Ustawienia');
    setPseudo(true); expect(isPseudo()).toBe(true); expect(t('Ustawienia')).toBe('⟦Ustawienia⟧'); expect(t('{n} z {m}', { n: 1, m: 2 })).toBe('⟦1 z 2⟧');
  });
  test('tylko w buildzie deweloperskim: przy __DEV__ = false włączenie nic nie robi (produkcja nigdy nie pokazuje nawiasów)', () => {
    const was = G.__DEV__; G.__DEV__ = false; try { setPseudo(true); expect(isPseudo()).toBe(false); expect(t('Ustawienia')).toBe('Ustawienia'); } finally { G.__DEV__ = was; }
  });
  test('tIn (język podany wprost, np. powiadomienia) nie jest owijany — to tekst dla systemu, nie dla ekranu', () => { setPseudo(true); expect(tIn('en', 'Ustawienia')).not.toContain('⟦'); });
  test.each(['/more/settings', '/more'] as const)('ekran %s: każdy tekst z literami jest w ⟦…⟧ (nic nie omija t())', async url => {
    setPseudo(true); await renderApp({ url }); await go(url); await flushAll(10);
    const texts = screen.UNSAFE_getAllByType(require('react-native').Text).map((n: { props: { children?: unknown } }) => [n.props.children].flat(5).filter(c => typeof c === 'string').join(''));
    const bare = texts.filter((x: string) => /\p{L}{2}/u.test(x) && !/^⟦[\s\S]*⟧$/.test(x) && !/^Trening [\d.]*$/.test(x) /* nazwa aplikacji + wersja (marka, nie tekst) */ && !/^\p{L}+, \d{1,2} \p{L}+$/u.test(x) /* data z Intl */);
    expect(texts.some((x: string) => x.startsWith('⟦'))).toBe(true);
    expect(bare).toEqual([]);
  });
});

describe('plik kontekstu tłumaczeń', () => {
  const root = path.join(__dirname, '..');
  const ctx = JSON.parse(fs.readFileSync(path.join(root, 'docs/lokalizacja/konteksty.json'), 'utf8')) as Record<string, string>;
  const src = (JSON.parse(fs.readFileSync(path.join(root, 'lib/locales/_source.json'), 'utf8')) as { pl: string }[]).map(x => x.pl);
  test('obejmuje wszystkie klucze słownika o długości ≤ 20 znaków, bez zbędnych', () => {
    const short = src.filter(k => [...k].length <= 20);
    expect(short.length).toBeGreaterThan(300);
    expect(short.filter(k => !ctx[k])).toEqual([]); expect(Object.keys(ctx).filter(k => !short.includes(k))).toEqual([]);
  });
  test('aktualny względem kodu (node scripts/i18n-context.mjs --write)', () => {
    expect(() => require('child_process').execFileSync('node', [path.join(root, 'scripts/i18n-context.mjs'), '--check'], { stdio: 'pipe' })).not.toThrow();
  });
});
