/* Metadane App Store Connect — podtytuł i słowa kluczowe (store/app-store-metadata.json; nazwy: store/app-store-names.json). Przebieg M5 widoczności
 * w sklepie (docs/45), decyzje właściciela 21.10.2026 (STOP 1 i STOP 2, przekazane przez koordynatora). Limity wg App Store Connect Help
 * „Platform version information” (odczyt 21.10.2026): Subtitle ≤ 30 znaków; Keywords „One or more keywords (each greater than two characters)
 * … up to 100 bytes”; „you shouldn't duplicate” nazwy aplikacji w słowach kluczowych; App Store search: bez powtórzeń słów z nazwy i podtytułu. */
import * as fs from 'fs';
import * as path from 'path';
import { namesIn } from './forbidden-names';
import { PRIVACY_URL, TERMS_URL } from '@/lib/products';
import { LANGS } from '@/lib/i18n';
import { PAYWALL } from '@/lib/access';
import { EN } from '@/lib/i18n.en';
import { LOCALES } from '@/lib/locales';
import { LIB } from '@/lib/seed';
import * as V2 from '@/lib/figures/v2';
import { figureByKey } from '@/lib/figures';
import { errorsOf, legendOf } from '@/lib/figures/v2/ui';

const read = (f: string) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'));
const names = read('store/app-store-names.json').names as Record<string, string>;
const meta = read('store/app-store-metadata.json');
const L = meta.lokalizacje as Record<string, { subtitle: string; keywords: string; description: string; promotionalText: string }>;
/* Model M5 S1 (decyzja właściciela 22.10.2026; kontrakt: docs/monetyzacja-badanie-2026-10.md rozdz. 11): aplikacja darmowa bez okresu próbnego,
 * limit dni treningowych w miesiącu (jedno miejsce: PAYWALL.FREE_TRAINING_DAYS_PER_MONTH w lib/access.ts), Pro bez limitu. */
const FREE_DAYS = PAYWALL.FREE_TRAINING_DAYS_PER_MONTH;
const words = (s: string) => s.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);

describe('store/app-store-metadata.json', () => {
  test('te same lokalizacje co nazwy (33: 31 + en-AU, en-CA — decyzja STOP 1, 21.10.2026)', () => {
    expect(Object.keys(L).sort()).toEqual(Object.keys(names).sort());
    expect(Object.keys(names)).toEqual(expect.arrayContaining(['en-AU', 'en-CA']));
    expect(Object.keys(names)).toHaveLength(33);
  });
  test('limity Apple: podtytuł ≤ 30 znaków, słowa kluczowe ≤ 100 B, każde słowo > 2 znaki, przecinki bez spacji', () => {
    for (const [l, v] of Object.entries(L)) {
      const kw = v.keywords.split(',');
      expect({ l, sub: [...v.subtitle].length <= 30, b: Buffer.byteLength(v.keywords, 'utf8') <= 100, krotkie: kw.filter(k => [...k].length <= 2), spacje: /,\s|\s,/.test(v.keywords) })
        .toEqual({ l, sub: true, b: true, krotkie: [], spacje: false });
    }
  });
  test('słowa kluczowe bez powtórzeń i bez słów z nazwy i podtytułu', () => {
    for (const [l, v] of Object.entries(L)) {
      const own = new Set([...words(names[l]), ...words(v.subtitle)]);
      const kw = v.keywords.toLowerCase().split(',');
      expect({ l, dup: kw.filter((k, i) => kw.indexOf(k) !== i), zNazwy: kw.filter(k => own.has(k)) }).toEqual({ l, dup: [], zNazwy: [] });
    }
  });
  test('decyzje właściciela (STOP 2, 21.10.2026): nazwa PL, podtytuły PL/EN zastępują D-4 z 14.10.2026; en-AU = en-GB, en-CA = en-US', () => {
    expect(names.pl).toBe('Trening: dziennik treningowy');
    expect(L.pl.subtitle).toBe('Serie i przerwy. Bez konta');
    for (const l of ['en-US', 'en-GB', 'en-AU', 'en-CA']) expect([l, L[l].subtitle]).toEqual([l, 'Workout tracker. No account.']);
    expect([names['en-AU'], L['en-AU']]).toEqual([names['en-GB'], L['en-GB']]);
    expect([names['en-CA'], L['en-CA']]).toEqual([names['en-US'], L['en-US']]);
  });
  test('opis i tekst promocyjny w każdej lokalizacji (M5, 22.10.2026; model M5 S1): limity 4000 / 170 znaków, linki Warunków i Polityki prywatności, 35 języków, limit darmowych dni w opisie i tekście promocyjnym, bez okresu próbnego (14), przypis espresso', () => {
    for (const [l, v] of Object.entries(L)) {
      const d = v.description ?? ''; const p = v.promotionalText ?? '';
      const foot = d.split('\n').filter((x) => x.startsWith('* '));
      const rest = d.split('\n').filter((x) => !x.startsWith('* ')).join('\n').replace(TERMS_URL, '').replace(PRIVACY_URL, '');
      expect({ l, d: [...d].length > 800 && [...d].length <= 4000, p: p.length > 40 && [...p].length <= 170, terms: d.includes(TERMS_URL), privacy: d.includes(PRIVACY_URL),
        jezyki: new RegExp(`(^|\\D)${LANGS.length}(\\D|$)`).test(d), bezProby: !/(^|\D)14(\D|$)|free trial|No subscriptions?/i.test(d + p), limit: new RegExp(`(^|\\D)${FREE_DAYS}(\\D|$)`).test(d) && new RegExp(`(^|\\D)${FREE_DAYS}(\\D|$)`).test(p),
        przypis: foot.length === 1 && /1[.,]06/.test(foot[0]) && /1[.,]51/.test(foot[0]) && !/MIMIT|Assoutenti|C\.r\.c\./.test(foot[0]) && /2026/.test(foot[0]),
        kwoty: /\d+[.,]\d\d\s*(zł|PLN|USD|EUR|GBP|€|\$|£)|(USD|EUR|GBP|€|\$|£)\s*\d/.test(rest + p), marki: namesIn(`${d} ${p}`) })
        .toEqual({ l, d: true, p: true, terms: true, privacy: true, jezyki: true, bezProby: true, limit: true, przypis: true, kwoty: false, marki: [] });
    }
  });
  test('en-AU = en-GB i en-CA = en-US także w opisie i tekście promocyjnym (decyzja STOP 1, 21.10.2026)', () => {
    expect([L['en-AU'].description, L['en-AU'].promotionalText]).toEqual([L['en-GB'].description, L['en-GB'].promotionalText]);
    expect([L['en-CA'].description, L['en-CA'].promotionalText]).toEqual([L['en-US'].description, L['en-US'].promotionalText]);
  });
  test('bez nazw innych aplikacji i marek (wytyczna 2.3.7) i bez kwot w polach', () => {
    for (const [l, v] of Object.entries(L)) {
      const all = `${names[l]} ${v.subtitle} ${v.keywords}`;
      expect({ l, marki: namesIn(all), kwoty: /\d+[,.]\d\d|zł|PLN|USD|EUR|€|\$|£/.test(all) }).toEqual({ l, marki: [], kwoty: false });
    }
  });

  /* Odświeżenie przed 1.0 (decyzja właściciela 28.10.2026, wariant A; docs/45 „Odświeżenie przed 1.0”): opis i tekst promocyjny pokazują rysunki ruchu
   * i sekcję „Technika”. Rysunki są tylko przy części biblioteki (figury v2 dla gotowych rodzin + figury v1), więc tekst mówi „ponad 100 ćwiczeń” —
   * liczba z kodu: ćwiczenia biblioteki z rysunkiem animowanym, takim, jaki pokazuje karta (v2: shownFigureSpec po wstrzymaniach, jeśli istnieje; v1: ≥ 2 klatki). */
  describe('rysunki ruchu i sekcja „Technika” (odświeżenie przed 1.0, 28.10.2026)', () => {
    const CLAIM = 100; /* „ponad 100” we wszystkich lokalizacjach */
    const v2spec = ((V2 as unknown as { shownFigureSpec?: typeof V2.figureSpec }).shownFigureSpec ?? V2.figureSpec);
    const keys = [...new Set(LIB.map((r) => r[0]))];
    const spec = (k: string) => v2spec(k);
    /* 101-29 (29.10.2026): licznik = to, co widzi użytkownik (components/ExerciseCues.tsx): v2 shownFigureSpec; ćwiczenie wstrzymane (V2_WSTRZYMANE) — bez rysunku, bez powrotu do v1; reszta — v1 */
    const animated = keys.filter((k) => { const s = spec(k); if (s) return !s.static; if (Object.prototype.hasOwnProperty.call(V2.V2_WSTRZYMANE, k)) return false; const f = figureByKey(k); return !!f && f.frames.length > 1; });
    /* kod lokalizacji sklepu → język aplikacji (słownik interfejsu) */
    const APP: Record<string, string> = { 'es-ES': 'es', 'es-MX': 'es-419', 'pt-PT': 'pt', 'de-DE': 'de', 'fr-FR': 'fr', 'nl-NL': 'nl', no: 'nb' };
    const ui = (l: string, pl: string): string => l === 'pl' ? pl : l.startsWith('en-') ? EN[pl] : (LOCALES as Record<string, Record<string, string>>)[APP[l] ?? l][pl];
    const ANIM = /anim|аним|анім|κινούμεν|hoạt ảnh|動畫|アニメーション|움직이는/i;
    test(`liczba z kodu: ponad ${CLAIM} ćwiczeń biblioteki ma animowany rysunek ruchu (tekst „ponad ${CLAIM}”)`, () => {
      expect(animated.length).toBeGreaterThan(CLAIM);
      expect(animated.length).toBeLessThan(keys.length); /* nie cała biblioteka — stąd brak obietnicy „przy każdym ćwiczeniu” */
    });
    test('101-29 (29.10.2026): licznik zgodny z aplikacją — żadne wstrzymane ćwiczenie (V2_WSTRZYMANE) nie jest liczone, bo karta nie pokazuje przy nim rysunku', () => {
      for (const k of Object.keys(V2.V2_WSTRZYMANE)) expect([k, animated.includes(k)]).toEqual([k, false]);
      for (const k of keys) { const shown = !!V2.shownFigureSpec(k); const hold = Object.prototype.hasOwnProperty.call(V2.V2_WSTRZYMANE, k); if (shown) expect([k, hold]).toEqual([k, false]); }
    });
    test('rodziny wymienione w opisie (przysiad, wyciskanie leżąc, martwy ciąg) są gotowe; rysunek v2 pokazuje mięśnie zawsze, a częsty błąd zwykle (≥ 80%)', () => {
      for (const f of ['squat', 'bench_press', 'hinge'] as const) expect([f, V2.FAMILY[f].status]).toEqual([f, 'ready']);
      const v2 = keys.map(spec).filter((s): s is NonNullable<typeof s> => !!s);
      expect(v2.filter((s) => !legendOf(s.key))).toEqual([]);
      expect(v2.filter((s) => errorsOf(s).length > 0).length / v2.length).toBeGreaterThanOrEqual(0.8);
    });
    test('każda lokalizacja: rysunki ruchu z liczbą, nazwa sekcji i „Strażnika progresji” jak w interfejsie, wzmianka o animacji w tekście promocyjnym', () => {
      for (const [l, v] of Object.entries(L)) {
        const d = v.description;
        expect({ l, liczba: new RegExp(`(^|\\D)${CLAIM}(\\D|$)`).test(d), anim: ANIM.test(d), promo: ANIM.test(v.promotionalText),
          technika: d.includes(ui(l, 'Technika')), straznik: d.includes(ui(l, 'Strażnik progresji')) })
          .toEqual({ l, liczba: true, anim: true, promo: true, technika: true, straznik: true });
      }
    });
    test('PL i EN: bez obietnicy rysunku przy każdym ćwiczeniu; dokładne brzmienie punktów', () => {
      const every = /(każd|wszystk|every|each|\ball\b)[^\n]{0,40}(rysun|animac|drawing|animat)|(rysun|animac|drawing|animat)[^\n]{0,40}(każd\w* ćwicz|wszystk\w* ćwicz|every exercise|each exercise|all exercises)/i;
      for (const l of ['pl', 'en-US', 'en-GB']) {
        const bad = L[l].description.split('\n').filter((x) => every.test(x));
        expect([l, bad]).toEqual([l, []]);
      }
      expect(L.pl.description).toContain(`• Animowane rysunki ruchu przy ponad ${CLAIM} ćwiczeniach; animację możesz zatrzymać`);
      // Brzmienie en po recenzji lokalizacji metadanych 1.0 (decyzja właściciela 29.10.2026, docs/18).
      expect(L['en-US'].description).toContain(`• Animated drawings of the movement for over ${CLAIM} exercises; you can pause them`);
      expect(L.pl.promotionalText.startsWith('Animowane rysunki ruchu, wskazówki techniki')).toBe(true);
      expect(L['en-US'].promotionalText.startsWith('Animated exercise drawings, technique tips')).toBe(true);
    });
    test('bez nazwy wzoru e1RM w żadnym alfabecie (źródła publicznie anonimowo, 25.10.2026; wcześniej uk, ru, ko miały ją w nawiasie)', () => {
      for (const [l, v] of Object.entries(L)) expect([l, /Epley|Эпли|Еплі|엡리|エプリー|艾普利/i.test(v.description + v.promotionalText)]).toEqual([l, false]);
    });
  });
});

