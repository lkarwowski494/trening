/* W-22 (11.11.2026, docs/49): pole whatsNew metadanych sklepu (store/app-store-metadata.json) generowane z najnowszego wpisu „Co nowego”
 * (lib/whatsnew-wpisy.ts) i słowników aplikacji przez scripts/store-whatsnew.mjs — nie przepisywane ręcznie (wzór gen.mjs --check).
 * Limit pola wg App Store Connect Help „Platform version information” (odczyt 10.11.2026, docs/49 W-22): „Limited to 4000 characters.” — jedno miejsce: LIMITY.whatsNew
 * w scripts/asc/metadane.mjs. Generator nie jest strażnikiem procesu (hak, verify:docs) — sprawdza treść pliku jak readme/macierz, bez przypadku „gałąź względem main”. */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import { WHATS_NEW } from '@/lib/whatsnew-wpisy';
import { LANGS, applyLang } from '@/lib/i18n';

const ROOT = path.join(__dirname, '..');
const meta = JSON.parse(fs.readFileSync(path.join(ROOT, 'store/app-store-metadata.json'), 'utf8')) as { lokalizacje: Record<string, { whatsNew?: string }> };
/** Moduły .mjs w osobnym procesie node (Jest bez --experimental-vm-modules; wzór tests/asc-metadane.test.ts): kod ESM wypisuje JSON wyniku. */
const wezel = (kod: string): any => JSON.parse(execFileSync('node', ['--input-type=module', '-e', kod], { cwd: ROOT, encoding: 'utf8', maxBuffer: 50e6 }));
afterEach(() => { applyLang('pl'); });

describe('W-22 (11.11.2026): whatsNew metadanych sklepu z „Co nowego” aplikacji', () => {
  test('generator --check: plik aktualny (kod 0); --check jest w verify, verify:szybkie, verify:lekkie i w check:pochodne', () => {
    expect(() => execFileSync('node', [path.join(ROOT, 'scripts/store-whatsnew.mjs'), '--check'], { stdio: 'pipe' })).not.toThrow();
    const s = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).scripts as Record<string, string>;
    expect(s['check:whatsnew-sklep']).toBe('node scripts/store-whatsnew.mjs --check');
    for (const k of ['verify', 'verify:szybkie', 'verify:lekkie']) expect([k, s[k].includes('npm run check:whatsnew-sklep')]).toEqual([k, true]);
    expect(fs.readFileSync(path.join(ROOT, 'scripts/pochodne.mjs'), 'utf8')).toContain("'scripts/store-whatsnew.mjs', '--check'");
  });
  test('każda lokalizacja sklepu: whatsNew = punkty najnowszego wpisu w jej języku aplikacji, jeden punkt w wierszu („• ”); po angielsku bez punktu o nazwach', () => {
    const { JEZYK_APLIKACJI, PUNKT } = wezel("import * as W from './scripts/store-whatsnew.mjs'; console.log(JSON.stringify({ JEZYK_APLIKACJI: W.JEZYK_APLIKACJI, PUNKT: W.PUNKT }));") as { JEZYK_APLIKACJI: Record<string, string>; PUNKT: string };
    expect(Object.keys(meta.lokalizacje).sort()).toEqual(Object.keys(JEZYK_APLIKACJI).sort());
    for (const [loc, lang] of Object.entries(JEZYK_APLIKACJI)) {
      expect([loc, (LANGS as readonly string[]).includes(lang)]).toEqual([loc, true]);
      applyLang(lang as (typeof LANGS)[number]);
      expect([loc, meta.lokalizacje[loc].whatsNew]).toEqual([loc, WHATS_NEW[0].items().map(x => PUNKT + x).join('\n')]);
    }
    expect(meta.lokalizacje['en-US'].whatsNew!.split('\n')).toHaveLength(5); expect(meta.lokalizacje.pl.whatsNew!.split('\n')).toHaveLength(6);
  });
  test('limit pola i walidacja skryptu zapisu do App Store Connect (bez pustych pól, bez nazw innych marek)', () => {
    const r = wezel(`import * as A from './scripts/asc/metadane.mjs'; import { readFileSync as R } from 'node:fs'; const J = p => JSON.parse(R(p, 'utf8'));
      const meta = J('store/app-store-metadata.json'), wanted = A.buildWanted({ meta, names: J('store/app-store-names.json'), urls: { privacyPolicyUrl: 'https://x', supportUrl: 'https://x', marketingUrl: 'https://x' } });
      console.log(JSON.stringify({ limit: A.LIMITY.whatsNew, bledy: A.validate({ wanted, findBrands: A.makeBrandFinder(J('tests/forbidden-names.json')) }).filter(e => e.field === 'whatsNew') }));`);
    expect(r.limit).toBe(4000); expect(r.bledy).toEqual([]);
    for (const [loc, m] of Object.entries(meta.lokalizacje)) expect([loc, [...m.whatsNew!].length <= r.limit]).toEqual([loc, true]);
  });
  test('negatyw: ręczna zmiana pola → generator przywraca tekst z aplikacji, a zapis różni się od pliku (--check by odmówił)', () => {
    const r = wezel(`import * as W from './scripts/store-whatsnew.mjs'; import { readFileSync as R } from 'node:fs'; const teraz = R(W.PLIK, 'utf8'); const zle = JSON.parse(teraz); zle.lokalizacje.pl.whatsNew = 'Poprawki błędów.';
      console.log(JSON.stringify({ przywrocone: W.zbuduj(zle).lokalizacje.pl.whatsNew, rozne: W.serializuj(zle) !== teraz }));`);
    expect(r.przywrocone).toBe(meta.lokalizacje.pl.whatsNew); expect(r.rozne).toBe(true);
  });
});
