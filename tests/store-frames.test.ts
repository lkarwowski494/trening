/* Podpisy i ramki na zrzutach do App Store (decyzja właściciela 14.10.2026, D-6 B — docs/41): store/screenshot-captions.json,
 * scripts/ci/store-frames.sh, zadanie „ramki” w store-screenshots.yml. */
import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { BRAND } from '@/lib/theme';

const root = path.join(__dirname, '..');
const cap = JSON.parse(fs.readFileSync(path.join(root, 'store/screenshot-captions.json'), 'utf8'));
const seed = fs.readFileSync(path.join(root, 'scripts/screens/store-seed.test.ts'), 'utf8');
const screens = [...seed.matchAll(/\['([a-z-]+)', '\/[^']*'(?: \+ \w+)?, '[a-z]+', '[a-z0-9-]*'\]/g)].map(m => m[1]);
const y = fs.readFileSync(path.join(root, '.github/workflows/store-screenshots.yml'), 'utf8');
const hasIM = (() => { try { execFileSync('convert', ['-version']); execFileSync('identify', ['-version']); return true; } catch { return false; } })();

describe('store/screenshot-captions.json', () => {
  test('PL i EN: podpis dla każdego ekranu zrzutów (te same klucze), najwyżej 40 znaków, bez cen', () => {
    expect(screens).toHaveLength(9); expect(cap.maxZnakow).toBe(40);
    for (const l of ['pl', 'en']) {
      expect(Object.keys(cap.podpisy[l]).sort()).toEqual([...screens].sort());
      for (const [k, v] of Object.entries(cap.podpisy[l]) as [string, string][]) {
        expect({ l, k, ok: v.trim().length > 0 && [...v].length <= 40 }).toEqual({ l, k, ok: true });
        expect(v).not.toMatch(/\d+[,.]\d\d|zł|USD|EUR|€|\$|£|free|darmo/i); /* 2.3.7: bez cen na zrzutach */
      }
    }
    expect(cap.podpisy.pl.trening).toBe('Twój trening zostaje w Twoim telefonie'); /* hasło z planu marketingu 13.10.2026 */
  });
  test('status per język (PL zaakceptowane w scenorysie 14.10.2026, EN propozycja); inne języki dopiero po akceptacji EN — każdy obecny język ma komplet', () => {
    expect(cap.status.pl).toBe('zaakceptowane 14.10.2026'); expect(Object.keys(cap.status).sort()).toEqual(Object.keys(cap.podpisy).sort());
    if (cap.status.en === 'propozycja') expect(Object.keys(cap.podpisy).sort()).toEqual(['en', 'pl']);
    expect(cap.podpisy.pl.straznik).toContain('Strażnik progresji'); /* decyzja właściciela 14.10.2026: nazwa funkcji w podpisie */
    for (const l of Object.keys(cap.podpisy)) expect(Object.keys(cap.podpisy[l]).sort()).toEqual([...screens].sort());
  });
  test('kolory ramki = kolory marki z lib/theme.ts', () => {
    expect(cap.kolory).toEqual({ tlo: BRAND.paper, tekst: BRAND.ink, obwodka: BRAND.signal });
  });
});

describe('zadanie „ramki” w store-screenshots.yml', () => {
  test('ubuntu, po zrzutach, narzędzia z apt (ImageMagick, czcionki CJK), artefakty 3 dni, wejścia bez wstrzyknięć', () => {
    const job = y.slice(y.indexOf('\n  ramki:'), y.indexOf('\n  zakup:'));
    expect(job).toMatch(/needs: zrzuty/); expect(job).toMatch(/runs-on: ubuntu-latest/);
    expect(job).toMatch(/apt-get install -y -qq imagemagick fonts-noto-cjk/);
    expect(job).toMatch(/pattern: sklep-zrzuty-\*\n\s+path: sklep-zrzuty\n\s+merge-multiple: true/);
    expect(job).toMatch(/bash scripts\/ci\/store-frames\.sh sklep-zrzuty sklep-ramki store\/screenshot-captions\.json/);
    expect(job).toMatch(/retention-days: 3/); expect(job).not.toMatch(/run:[^\n]*\$\{\{/);
  });
  test('czcionka marki dostępna z node_modules (IBM Plex Sans Bold, licencja OFL)', () => {
    expect(fs.existsSync(path.join(root, 'node_modules/@expo-google-fonts/ibm-plex-sans/700Bold/IBMPlexSans_700Bold.ttf'))).toBe(true);
    expect(fs.readFileSync(path.join(root, 'scripts/ci/store-frames.sh'), 'utf8')).toContain('node_modules/@expo-google-fonts/ibm-plex-sans/700Bold/IBMPlexSans_700Bold.ttf');
  });
});

(hasIM ? describe : describe.skip)('scripts/ci/store-frames.sh (ImageMagick)', () => {
  test('ramka ma ten sam rozmiar co zrzut, bez kanału alfa; tło i obwódka w kolorach marki; język bez podpisów pominięty', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ramki-')); const inp = path.join(tmp, 'in'); const out = path.join(tmp, 'out');
    for (const l of ['pl', 'de']) fs.mkdirSync(path.join(inp, '6.3', l), { recursive: true });
    const shot = path.join(inp, '6.3', 'pl', '01-trening.png');
    execFileSync('convert', ['-size', '241x524', 'xc:#00ff00', shot]);
    fs.copyFileSync(shot, path.join(inp, '6.3', 'pl', '08-szablony.png')); fs.copyFileSync(shot, path.join(inp, '6.3', 'de', '01-trening.png'));
    const res = execFileSync('bash', [path.join(root, 'scripts/ci/store-frames.sh'), inp, out], { cwd: root, encoding: 'utf8' });
    expect(res).toContain('::warning::Brak podpisów dla języka de'); expect(res).toContain('Ramki: 2 plików');
    expect(fs.readdirSync(path.join(out, '6.3', 'pl')).sort()).toEqual(['01-trening.png', '08-szablony.png']); expect(fs.existsSync(path.join(out, '6.3', 'de'))).toBe(false);
    const f = path.join(out, '6.3', 'pl', '01-trening.png');
    expect(execFileSync('identify', ['-format', '%w %h %A', f], { encoding: 'utf8' })).toMatch(/^241 524 (False|Undefined|Blend)$/);
    const px = (x: number, yy: number) => execFileSync('convert', [f, '-depth', '8', '-format', `%[hex:u.p{${x},${yy}}]`, 'info:'], { encoding: 'utf8' }).trim().slice(0, 6).toUpperCase();
    expect(px(1, 1)).toBe(BRAND.paper.slice(1).toUpperCase()); /* tło */
    expect(px(120, 300)).toBe('00FF00'); /* środek zrzutu */
  });
});
