/*
 * SEC2-07 (audyt kontrolny 1, 09.10.2026): wskazówki techniki ładowały od razu 26 słowników zdań (lib/cues/text/*.json, ok. 744 KB) przy pierwszym
 * imporcie modułu — wbrew wzorcowi z PERF-05 (słowniki UI ładowane przy pierwszym użyciu języka, lib/locales/index.ts). Teraz słownik języka
 * wczytuje się przy pierwszym odczycie zdania w tym języku; rezerwa (en, potem pl) — dopiero gdy zdania brakuje.
 * Rodzaje (docs/20): logika (ładowanie leniwe, rezerwa en/pl, cueDict), regresja (te same teksty co przy ładowaniu od razu).
 */
const LANG_FILES = ['pl', 'en', 'cs', 'sk', 'hu', 'ro', 'bg', 'hr', 'sl', 'sr', 'lt', 'lv', 'et', 'uk', 'es', 'pt', 'de', 'fr', 'it', 'nl', 'sv', 'da', 'nb', 'fi', 'tr', 'el'];

describe('SEC2-07: słowniki wskazówek techniki ładowane przy pierwszym użyciu', () => {
  afterEach(() => { for (const l of LANG_FILES) jest.dontMock(`@/lib/cues/text/${l}.json`); jest.resetModules(); });
  test('import modułu nie wczytuje żadnego słownika; zdanie po niemiecku wczytuje tylko de', () => {
    jest.isolateModules(() => {
      const loaded = new Set<string>();
      for (const l of LANG_FILES) { const real = jest.requireActual(`@/lib/cues/text/${l}.json`); jest.doMock(`@/lib/cues/text/${l}.json`, () => { loaded.add(l); return real; }); }
      const cues = require('@/lib/cues');
      expect([...loaded]).toEqual([]);
      const id = Object.keys(jest.requireActual('@/lib/cues/text/de.json'))[0];
      expect(cues.cueText(id, 'de')).toBe(jest.requireActual('@/lib/cues/text/de.json')[id]);
      expect([...loaded]).toEqual(['de']);
    });
  });
  test('brak zdania w języku → angielski (wczytany dopiero wtedy), brak w angielskim → polski, brak wszędzie → id', () => {
    jest.isolateModules(() => {
      const loaded: string[] = [];
      for (const l of LANG_FILES) jest.doMock(`@/lib/cues/text/${l}.json`, () => { loaded.push(l); return l === 'en' ? { a: 'A-en' } : l === 'pl' ? { a: 'A-pl', b: 'B-pl' } : {}; });
      const cues = require('@/lib/cues');
      expect(cues.cueText('a', 'fr')).toBe('A-en'); expect(loaded).toEqual(['fr', 'en']);
      expect(cues.cueText('b', 'fr')).toBe('B-pl'); expect(loaded).toEqual(['fr', 'en', 'pl']);
      expect(cues.cueText('zzz', 'fr')).toBe('zzz');
      expect(cues.cueDict('pl')).toEqual({ a: 'A-pl', b: 'B-pl' }); expect(loaded).toEqual(['fr', 'en', 'pl']); /* każdy słownik raz */
    });
  });
  test('regresja: cuesFor daje te same teksty co słowniki z plików w każdym języku', () => {
    const { cuesFor, cueDict, CUE_DATA } = require('@/lib/cues');
    const key = Object.keys(CUE_DATA.exercises)[0];
    for (const l of LANG_FILES) {
      const c = cuesFor({ lib: true, libKey: key }, l); const d = jest.requireActual(`@/lib/cues/text/${l}.json`);
      expect(cueDict(l)).toEqual(d);
      for (const s of c.sections) for (const t of s.items) expect(typeof t).toBe('string');
    }
  });
});
