/*
 * M1-audytor-generalny-037 część D (10-wydanie-004; DEC-07 b, właściciel 27.10.2026: „wybrane przed zgłoszeniem 1.0”; D7 z 25.10.2026: zrzuty dla wszystkich
 * lokalizacji sklepu — 32 z `store/app-store-names.json`, bez „sl”). Podpisy zrzutów były tylko PL i EN, a krok „ramki” (scripts/ci/store-frames.sh) pomija język bez podpisów — 27 lokalizacji dostałoby
 * zrzuty języka podstawowego (PL; Apple: nowy język domyślnie bierze zrzuty języka podstawowego — docs/48 pkt 5, odczyt 28.10.2026).
 * Pilnuje: każdy język aplikacji z lokalizacją w sklepie (SHOT_LOCALES w scripts/asc/zrzuty.mjs) ma podpis każdego ekranu scenorysu, najwyżej `maxZnakow`
 * znaków, bez cen i nazw innych aplikacji, ma wpis statusu; znaki podpisów pisma łacińskiego, cyrylicy i greki są w czcionce ramek (IBM Plex Sans Bold) —
 * brakujący znak dałby puste prostokąty na obrazie. Rodzaje (docs/20): dane, języki, strażnik. Uruchomienie workflowów zrzutów — krok koordynatora (docs/48 Z-16).
 */
import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';

const root = path.join(__dirname, '..');
type Cap = { status: Record<string, string>; maxZnakow: number; podpisy: Record<string, Record<string, string>> };
const cap = (): Cap => JSON.parse(fs.readFileSync(path.join(root, 'store/screenshot-captions.json'), 'utf8'));
/** SHOT_LOCALES z modułu ESM (Jest nie ładuje .mjs wprost). */
const shotLocales = (): Record<string, string[]> => {
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', `import { SHOT_LOCALES } from ${JSON.stringify(path.join(root, 'scripts/asc/zrzuty.mjs'))}; console.log(JSON.stringify(SHOT_LOCALES));`], { encoding: 'utf8', cwd: root });
  if (r.status !== 0) throw new Error(r.stderr);
  return JSON.parse(r.stdout);
};
/** Znaki obecne w czcionce TrueType (tabela cmap, podtabele formatu 4 i 12). */
function cmapChars(file: string): Set<number> {
  const b = fs.readFileSync(file); const n = b.readUInt16BE(4); let cmap = -1;
  for (let i = 0; i < n; i++) { const o = 12 + i * 16; if (b.toString('latin1', o, o + 4) === 'cmap') cmap = b.readUInt32BE(o + 8); }
  if (cmap < 0) throw new Error('brak tabeli cmap');
  const out = new Set<number>(); const subs = b.readUInt16BE(cmap + 2);
  for (let i = 0; i < subs; i++) {
    const off = cmap + b.readUInt32BE(cmap + 4 + i * 8 + 4); const fmt = b.readUInt16BE(off);
    if (fmt === 4) {
      const seg = b.readUInt16BE(off + 6) / 2; const ends = off + 14, starts = ends + seg * 2 + 2, deltas = starts + seg * 2, ranges = deltas + seg * 2;
      for (let s = 0; s < seg; s++) {
        const end = b.readUInt16BE(ends + s * 2), start = b.readUInt16BE(starts + s * 2), delta = b.readInt16BE(deltas + s * 2), ro = b.readUInt16BE(ranges + s * 2);
        for (let ch = start; ch <= end && ch !== 0xffff; ch++) {
          const g = ro === 0 ? (ch + delta) & 0xffff : b.readUInt16BE(ranges + s * 2 + ro + (ch - start) * 2);
          if (g !== 0) out.add(ch);
        }
      }
    } else if (fmt === 12) {
      const groups = b.readUInt32BE(off + 12);
      for (let g = 0; g < groups; g++) { const o = off + 16 + g * 12; for (let ch = b.readUInt32BE(o); ch <= b.readUInt32BE(o + 4); ch++) out.add(ch); }
    }
  }
  return out;
}

describe('M1-037 D / 10-wydanie-004: podpisy zrzutów dla każdej lokalizacji sklepu (DEC-07 b, 27.10.2026)', () => {
  const c = cap(); const loc = shotLocales();
  const langs = Object.keys(loc).filter(l => loc[l].length > 0).sort();
  const ekrany = Object.keys(c.podpisy.pl);
  test('scenorys: 9 ekranów PL; języki ze sklepem = 29 języków aplikacji = lokalizacje z store/app-store-names.json bez „sl” (L-003, D7 w docs/48)', () => {
    expect(ekrany).toEqual(['trening', 'postepy-cwiczenia', 'straznik', 'plan', 'dostosuj', 'progresja', 'historia', 'szablony', 'import']);
    expect(langs).toHaveLength(29);
    const names = Object.keys(JSON.parse(fs.readFileSync(path.join(root, 'store/app-store-names.json'), 'utf8')).names).filter(l => l !== 'sl').sort();
    expect(langs.flatMap(l => loc[l]).sort()).toEqual(names);
  });
  test.each(Object.keys(shotLocales()).filter(l => shotLocales()[l].length > 0).sort())('%s: podpis każdego ekranu, ≤ maxZnakow, bez cen; wpis statusu', (l) => {
    const p = c.podpisy[l]; expect(p).toBeDefined();
    expect(Object.keys(p ?? {})).toEqual(ekrany);
    for (const [k, v] of Object.entries(p ?? {})) {
      expect({ k, ok: typeof v === 'string' && v.trim().length > 0 && [...v].length <= c.maxZnakow }).toEqual({ k, ok: true });
      expect({ k, cena: /\d+[.,]\d{2}|[$€£¥₩]|\bzł\b/.test(v) }).toEqual({ k, cena: false });
    }
    expect(typeof c.status[l]).toBe('string');
  });
  test('ten sam podpis nie powtarza się w obrębie języka (każdy ekran ma własne zdanie)', () => {
    for (const l of langs) expect({ l, powt: new Set(Object.values(c.podpisy[l] ?? {})).size }).toEqual({ l, powt: ekrany.length });
  });
  test('znaki podpisów (poza ja, ko, zh-Hant — czcionka CJK) są w czcionce ramek IBM Plex Sans Bold', () => {
    const font = path.join(root, 'node_modules/@expo-google-fonts/ibm-plex-sans/700Bold/IBMPlexSans_700Bold.ttf');
    expect(fs.readFileSync(path.join(root, 'scripts/ci/store-frames.sh'), 'utf8')).toContain('ibm-plex-sans/700Bold/IBMPlexSans_700Bold.ttf');
    const have = cmapChars(font);
    expect(have.has(0x41) && have.has(0x105)).toBe(true); /* A, ą — kontrola czytnika */
    const braki: string[] = [];
    for (const l of langs.filter(x => !['ja', 'ko', 'zh-Hant'].includes(x))) for (const v of Object.values(c.podpisy[l] ?? {}))
      for (const ch of v) if (!have.has(ch.codePointAt(0)!)) braki.push(`${l}: „${ch}” U+${ch.codePointAt(0)!.toString(16).toUpperCase()}`);
    expect([...new Set(braki)]).toEqual([]);
  });
  test('docs/48 pkt 5: lokalizacja bez zrzutów bierze zrzuty języka podstawowego (cytat Apple, odczyt 28.10.2026) i warunki Z-16 przed uruchomieniem workflowów', () => {
    const d = fs.readFileSync(path.join(root, 'docs/48-zgloszenie-1-0.md'), 'utf8');
    expect(d).toContain('screenshots and the properties for the new language default to those of the primary language, except for the description and keywords.');
    expect(d).toContain('https://developer.apple.com/help/app-store-connect/manage-app-information/localize-app-information/');
    expect(d).toMatch(/odczyt 28\.10\.2026/);
    expect(d).toMatch(/\*\*Warunki przed Z-16:\*\* \(a\) akceptacja EN/);
    expect(d).toMatch(/`store-screenshots\.yml` z `jezyki: all`/);
    expect(d).not.toMatch(/\*\*\[OTWARTE\]\*\*: czy lokalizacja bez własnych zrzutów dziedziczy/);
  });
});
