/*
 * Fala 2 nowych języków (docs/16 „Fala 2”, 09.10.2026): indonezyjski (id), malajski (ms), wietnamski (vi) — pełne słowniki (UI + wskazówki techniki).
 * Rodzaje (docs/20): logika (resolveLang z tagu telefonu i przestarzałych kodów CLDR, detectLang, locale, separator dziesiętny, liczba mnoga
 * „other”), dane (komplet kluczy UI i wskazówek, parametry, jedna forma liczby mnogiej), języki (bez pozostałości angielskich i polskich,
 * terminologia: id ≠ ms, nazwy aplikacji iOS w danym języku, „set” po wietnamsku = „hiệp”), wygląd (wietnamskie znaki w kroju, NFC, wysokość
 * znaków z podwójnymi diakrytykami względem metryk kroju). Ekran: tests/i18n-wave2-ui.test.tsx; 320 pt / 200 %, ekrany × język, widżet,
 * kompletność — testy z pętlą po LANGS (matrix-i18n, matrix-dim-langs*, widget-i18n, i18n-locales, cues) obejmują nowe kody automatycznie.
 */
import * as fs from 'fs';
import * as path from 'path';
import { LANGS, resolveLang, applyLang, lang, locale, decimalComma, tp, t, detectLang, LANG_NAME, APP_NAME, type Lang } from '@/lib/i18n';
import { EN } from '@/lib/i18n.en';
import { LOCALES } from '@/lib/locales';
import { PLURAL_FORMS, pluralIndex } from '@/lib/plural';
import { cueDict } from '@/lib/cues';

const W2 = ['id', 'ms', 'vi'] as const;
type W2 = typeof W2[number];
const dict = (l: W2): Record<string, string> => LOCALES[l]!;
const entries = (l: W2) => Object.entries(dict(l));

describe('resolveLang / detectLang: telefon po indonezyjsku, malajsku, wietnamsku', () => {
  test.each([
    ['id-ID', 'id'], ['id', 'id'], ['id_ID', 'id'], ['in-ID', 'id'] /* CLDR languageAlias: in → id (przestarzały kod) */, ['in', 'id'],
    ['ms-MY', 'ms'], ['ms', 'ms'], ['ms-SG', 'ms'], ['ms-BN', 'ms'], ['ms_MY', 'ms'], ['zsm-MY', 'ms'] /* CLDR languageAlias: zsm → ms */,
    ['vi-VN', 'vi'], ['vi', 'vi'], ['vi_VN', 'vi'],
    ['jv-ID', 'en'] /* jawajski — nie jest językiem aplikacji */, ['en-ID', 'en'], ['en-MY', 'en'], ['zh-Hans-MY', 'en'], ['en-VN', 'en'],
  ] as const)('%s → %s', (tag, want) => { expect(resolveLang(tag)).toBe(want); });
  test('kod języka z expo-localization (languageCode) też przechodzi przez aliasy', () => {
    expect(resolveLang('in-ID', 'in')).toBe('id'); expect(resolveLang(null, 'vi')).toBe('vi'); expect(resolveLang(null, 'ms')).toBe('ms');
  });
  test('aliasy są zgodne z ICU/CLDR (Intl.getCanonicalLocales) — nie wymyślone', () => {
    expect(Intl.getCanonicalLocales(['in', 'zsm'])).toEqual(['id', 'ms']);
  });

  afterEach(() => { global.__locales = [{ languageCode: 'pl', languageTag: 'pl-PL' }]; applyLang('pl'); });
  const dev = (code: string, tag: string) => { global.__locales = [{ languageCode: code, languageTag: tag }]; };
  test.each([
    ['id', 'id-ID', 'id', 'id-ID', true], ['ms', 'ms-MY', 'ms', 'ms-MY', false], ['ms', 'ms-SG', 'ms', 'ms-SG', false], ['vi', 'vi-VN', 'vi', 'vi-VN', true],
  ] as const)('„Jak w telefonie”: %s / %s → język %s, daty i liczby %s, przecinek dziesiętny: %s (CLDR)', (code, tag, want, loc, comma) => {
    dev(code, tag); expect(detectLang()).toBe(want); applyLang('auto');
    expect([lang(), locale(), decimalComma()]).toEqual([want, loc, comma]);
    expect([(1.5).toLocaleString(loc).includes(','), comma]).toEqual([comma, comma]);
  });
  test('wymuszony język przy telefonie z innym językiem: domyślny region (id-ID, ms-MY, vi-VN)', () => {
    dev('de', 'de-DE');
    for (const [l, tag] of [['id', 'id-ID'], ['ms', 'ms-MY'], ['vi', 'vi-VN']] as const) { applyLang(l); expect([l, locale()]).toEqual([l, tag]); }
  });
  test('LANGS: nowe kody na końcu listy (kolejność w ustawieniach), nazwy w danym języku, nazwa aplikacji „Training” (lokalne słowo niepodobne do „Trening”)', () => {
    expect(LANGS.slice(LANGS.indexOf('el') + 1, LANGS.indexOf('el') + 4)).toEqual(['id', 'ms', 'vi']); /* fala 3 (ru) dopisana za nimi */
    expect(W2.map(l => LANG_NAME[l])).toEqual(['Bahasa Indonesia', 'Bahasa Melayu', 'Tiếng Việt']);
    expect(W2.map(l => APP_NAME[l])).toEqual(['Training', 'Training', 'Training']);
  });
});

describe('liczba mnoga: id, ms, vi — jedna forma (CLDR „other”)', () => {
  afterAll(() => applyLang('pl'));
  test.each([...W2])('%s: PLURAL_FORMS = [other] = kategorie Intl.PluralRules; pluralIndex 0 dla każdej liczby; tp() zwraca jedną formę', l => {
    expect(PLURAL_FORMS[l]).toEqual(['other']);
    expect(new Intl.PluralRules(l).resolvedOptions().pluralCategories).toEqual(['other']);
    for (const n of [0, 1, 2, 5, 11, 21, 101, 1.5, -1]) expect(pluralIndex(l, n)).toBe(0);
    applyLang(l);
    const keys = Object.keys(EN).filter(k => k.includes('|'));
    expect(keys.length).toBeGreaterThan(3);
    for (const k of keys) { const v = dict(l)[k]; expect([k, v.includes('|')]).toEqual([k, false]); for (const n of [1, 2, 5]) expect(tp(n, k)).toBe(v); }
  });
});

describe('dane: komplet słowników UI i wskazówek techniki', () => {
  const src = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'lib', 'locales', '_source.json'), 'utf8')) as { pl: string }[];
  const params = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(',');
  test.each([...W2])('%s: każdy klucz źródła ma niepuste tłumaczenie z tymi samymi {parametrami}; wskazówki — każde zdanie', l => {
    const d = dict(l);
    expect(src.filter(s => !d[s.pl]?.trim())).toEqual([]);
    expect(src.filter(s => params(d[s.pl]) !== params(s.pl)).map(s => s.pl)).toEqual([]);
    const en = cueDict('en'), c = cueDict(l);
    expect(Object.keys(c).sort()).toEqual(Object.keys(en).sort());
    expect(Object.entries(c).filter(([, v]) => !v.trim())).toEqual([]);
  });
  test('locales/<kod>.json (iOS: nazwa pod ikoną, opisy uprawnień Zdrowia) — po indonezyjsku, malajsku, wietnamsku, z nazwą aplikacji', () => {
    const want: Record<W2, RegExp> = { id: /kesehatan/i, ms: /kesihatan/i, vi: /sức khỏe/i };
    for (const l of W2) {
      const f = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'locales', `${l}.json`), 'utf8'));
      expect([l, f.CFBundleDisplayName, want[l].test(f.NSHealthShareUsageDescription)]).toEqual([l, 'Training', true]);
    }
  });
});

/* ====================================================================================================================================== */
/** Wyrazy angielskie, które nie występują w id/ms/vi — ślad nieprzetłumaczonego tekstu (nazwy sprzętu po angielsku nie zawierają tych wyrazów). */
const EN_WORDS = /\b(the|and|with|your|you|of|for|this|that|is|are|will|not|from|when|after|before|only|all|set to|tap|weight|workout|exercise|template|rest)\b/i;
/** Polskie wyrazy częste w kluczach — ślad nieprzetłumaczonego tekstu (litery ąęłńśźż sprawdza i18n-locales, tu wyrazy bez nich). */
const PL_WORDS = /\b(nie|jest|albo|oraz|przy|trening|treningu|seria|serii|szablon|ćwiczenie|ciężar|przerwa|dodaj|usuń|zapisz)\b/i;
/** Tłumaczenie identyczne z angielskim — tylko terminy siłowni używane w tych językach bez tłumaczenia i symbole (lista minimalna). */
const SAME_AS_EN = new Set([
  '{k}: {v}', '{n} km', '{n} m', 'e1RM', 'max ±', 'OK', 'GHD', 'GHD (glute-ham developer)', 'glute-ham raise', 'circus bell', 'drop set', '+ drop set', 'Drop set (D)',
  'superset', 'Deload', 'core', 'kettlebell', 'Kettlebell', 'kettlebell: {v}', 'landmine', 'T-bar', 'trap bar', 'hack squat', 'Hack squat', 'pendulum squat', 'reverse hyper',
  'Strongman', 'tempo', 'Tempo', 'keg', 'Keg', 'pec deck', 'Pec deck', 'yoke', 'Yoke', 'Log bar', 'log bar', 'rickshaw', 'Rickshaw', 'Hotel', 'Folder', 'Diet', 'T-bar row',
  'Cable crossover (two adjustable pulleys)', 'treadmill', 'Treadmill', 'Leg extension', 'Leg curl', 'Seated cable row', 'Lat pulldown', 'lat pulldown', 'leg press', 'Leg press',
  'Smith machine', 'Power rack', 'foam roller', 'Foam roller', 'wrist roller', 'Wrist roller', 'stair climber', 'Stair climber', 'suspension trainer', 'Suspension trainer',
  'elliptical', 'Elliptical', 'Sled (prowler)', 'sled', 'sandbag', 'cardio', 'Cardio', 'rotator cuff', 'serratus anterior', 'tibialis anterior', 'Pendulum squat machine',
  'Version', 'Edit', 'Import', 'Total', 'total', 'normal', 'Set', 'set', 'Set {n}', 'set {n}', 'Set {n} — {ex}', 'Sets', 'sets', 'Tips', 'Volume', 'volume', 'vol.', 'Fokus',
  'hamstrings', 'Power tower (pull-up + dip)', 'Rep', 'Biceps', 'Tempo (optional, e.g. 3-1-1)', 'Muscle', '{n} min', 'Bar ({u})',
  /* id: „level”, „target”, „per”, „set” i „Full Body” — wyrazy używane po indonezyjsku na siłowni (KBBI: level, target, per) */
  '{c}, level {n}', 'Level (1–7)', 'level {n}', '+ set', 'e1RM {v} (set {s})', 'set · target {s}', 'Full Body', 'Full Body A', 'Full Body B',
]);
describe('języki: jakość tekstów id / ms / vi', () => {
  test.each([...W2])('%s: bez angielskich wyrazów-śladów (the, and, your, workout…) i bez polskich (nie, jest, trening…)', l => {
    expect(entries(l).filter(([, v]) => EN_WORDS.test(v.replace(/\{\w+\}/g, '').replace(/\b(drop set|superset|farmer's walk|glute-ham developer|Smith machine|Power rack|Cable crossover|Leg extension|Leg curl|Seated cable row|Lat pulldown|T-bar row|wall sit|stair climber|Stair climber|suspension trainer|Suspension trainer|foam roller|Foam roller|wrist roller|Wrist roller|reverse hyper|air bike|ab wheel|dip belt|safety arm|battle rope|Battle rope|power tower|Power tower|gym ball|log bar|Log bar|lat pulldown|leg press|Leg press|hack squat|Hack squat|pendulum squat|circus bell|Circus bell|trap bar|T-bar)\b/gi, ''))).map(([k, v]) => `${k} → ${v}`)).toEqual([]);
    expect(entries(l).filter(([, v]) => PL_WORDS.test(v)).map(([k, v]) => `${k} → ${v}`)).toEqual([]);
  });
  test.each([...W2])('%s: tłumaczenie identyczne z angielskim tylko dla terminów siłowni i symboli (lista minimalna); dłuższe teksty zawsze przetłumaczone', l => {
    const same = entries(l).filter(([k, v]) => v === EN[k]).map(([, v]) => v);
    expect(same.filter(v => !SAME_AS_EN.has(v))).toEqual([]);
    expect(entries(l).filter(([k, v]) => v === EN[k] && v.split(/\s+/).length > 4).map(([k]) => k)).toEqual([]);
  });
  test('wskazówki techniki: żadne zdanie nie jest identyczne z angielskim ani polskim', () => {
    const en = cueDict('en'), pl = cueDict('pl');
    for (const l of W2) { const c = cueDict(l); expect([l, Object.keys(c).filter(k => c[k] === en[k] || c[k] === pl[k])]).toEqual([l, []]); }
  });
  test('id ≠ ms: słowniki nie są kopią (różne słownictwo: id „Pengaturan/Hapus/ponsel/gerakan”, ms „Seting/Padam/telefon/senaman”)', () => {
    const id = dict('id'), ms = dict('ms'); const keys = Object.keys(id);
    const same = keys.filter(k => id[k] === ms[k] && id[k].split(/\s+/).length > 2).length;
    expect(same / keys.length).toBeLessThan(0.1); /* języki bliskie (wspólne słownictwo, np. „Mesin chest press”, „Simpan sebagai templat”) — dziś ok. 7 %; kopia dałaby ~100 % */
    const ID_ONLY = /\b(Pengaturan|Hapus|ponsel|Kesehatan|gerakan|karet|Batalkan pengeditan)\b/; const MS_ONLY = /\b(Seting|Padam|telefon|Kesihatan|senaman|getah|baharu|Fail)\b/;
    expect(Object.entries(ms).filter(([, v]) => ID_ONLY.test(v)).map(([k, v]) => `ms: ${k} → ${v}`)).toEqual([]);
    expect(Object.entries(id).filter(([, v]) => MS_ONLY.test(v)).map(([k, v]) => `id: ${k} → ${v}`)).toEqual([]);
    for (const [l, d] of [['id', cueDict('id')], ['ms', cueDict('ms')]] as const) expect([l, Object.values(d).filter(v => (l === 'id' ? MS_ONLY : ID_ONLY).test(v))]).toEqual([l, []]);
  });
  /* Nazwy aplikacji i ekranów iOS w danym języku (Apple: id — Pengaturan, File, Kesehatan; ms — Seting, Fail, Kesihatan; vi — Cài đặt, Tệp, Sức khỏe). */
  test.each([
    ['id', 'Pengaturan', /Pengaturan iOS/, /File/, /Kesehatan/], ['ms', 'Seting', /Seting iOS/, /Fail/, /Kesihatan/], ['vi', 'Cài đặt', /Cài đặt iOS/, /Tệp/, /Sức khỏe/],
  ] as const)('%s: Ustawienia = „%s”; teksty o Ustawieniach iOS, Plikach i Zdrowiu używają nazw systemu', (l, settings, ios, files, health) => {
    const d = dict(l);
    expect(d['Ustawienia']).toBe(settings);
    expect(d['Otwórz Ustawienia iOS']).toMatch(ios);
    expect(d['Automatyczna kopia po każdym treningu trafia do Plików (Ustawienia).']).toMatch(files);
    expect(d['Brak zgody na zapis treningów. Włącz ją w aplikacji Zdrowie: profil → Aplikacje → {app}.']).toMatch(health);
  });
  test('vi: seria = „hiệp”, powtórzenia = „lần”, szablon = „mẫu”; angielskie „set” tylko w „drop set” i „superset”', () => {
    const d = dict('vi');
    expect([d['Seria'], d['seria|serie|serii'], d['Szablon'], d['powtórzenie|powtórzenia|powtórzeń']]).toEqual(['Hiệp', 'hiệp', 'Mẫu', 'lần']);
    expect(Object.entries(d).filter(([, v]) => /\bsets?\b/i.test(v.replace(/drop set|superset/gi, ''))).map(([k, v]) => `${k} → ${v}`)).toEqual([]);
  });
  test('id / ms: terminy treningowe jednolite (id: latihan = trening, gerakan = ćwiczenie; ms: latihan = trening, senaman = ćwiczenie)', () => {
    expect([dict('id')['Trening'], dict('id')['Ćwiczenie'], dict('ms')['Trening'], dict('ms')['Ćwiczenie']]).toEqual(['Latihan', 'Gerakan', 'Latihan', 'Senaman']);
    expect([dict('id')['Przerwa'], dict('ms')['Przerwa'], dict('vi')['Przerwa']]).toEqual(['Istirahat', 'Rehat', 'Nghỉ']);
  });
  test('vi: każdy tekst w formie złożonej (NFC) — bez osobnych znaków łączących (U+0300–U+036F), które krój mógłby źle ułożyć', () => {
    const bad = [...entries('vi').map(([, v]) => v), ...Object.values(cueDict('vi'))].filter(v => v !== v.normalize('NFC') || /[̀-ͯ]/.test(v));
    expect(bad).toEqual([]);
  });
  test('vi: dłuższe teksty (≥ 4 wyrazy) mają litery wietnamskie z diakrytykami — nie zostały po angielsku', () => {
    expect(entries('vi').filter(([, v]) => v.replace(/\{\w+\}/g, '').split(/\s+/).filter(w => /\p{L}/u.test(w)).length >= 4 && !/[^\x00-\x7F—–“”…→×≥±·↑↺⇄≡▶⏸●★✓✂⇅]/.test(v)).map(([k, v]) => `${k} → ${v}`)).toEqual([]);
  });
});

/* ====================================================================================================================================== */
/** Czytnik TTF: metryki (head, hhea) i ramka glifu (glyf/loca) — wysokość znaków z diakrytykami względem wysokości wiersza. */
function font(file: string) {
  const b = fs.readFileSync(file); const T: Record<string, number> = {};
  for (let i = 0; i < b.readUInt16BE(4); i++) { const o = 12 + 16 * i; T[b.toString('latin1', o, o + 4)] = b.readUInt32BE(o + 8); }
  const upm = b.readUInt16BE(T.head + 18), longLoca = b.readInt16BE(T.head + 50) === 1;
  const ascent = b.readInt16BE(T.hhea + 4), descent = b.readInt16BE(T.hhea + 6), lineGap = b.readInt16BE(T.hhea + 8);
  let sub = -1; for (let i = 0; i < b.readUInt16BE(T.cmap + 2); i++) { const p = b.readUInt16BE(T.cmap + 4 + 8 * i), e = b.readUInt16BE(T.cmap + 6 + 8 * i), off = b.readUInt32BE(T.cmap + 8 + 8 * i); if (b.readUInt16BE(T.cmap + off) === 4 && ((p === 3 && e === 1) || p === 0)) { sub = T.cmap + off; break; } }
  const seg = b.readUInt16BE(sub + 6) / 2, ends = sub + 14, starts = ends + 2 * seg + 2, deltas = starts + 2 * seg, ros = deltas + 2 * seg;
  const gid = (cp: number) => { for (let i = 0; i < seg; i++) { if (cp > b.readUInt16BE(ends + 2 * i)) continue; const st = b.readUInt16BE(starts + 2 * i); if (cp < st) return 0; const d = b.readInt16BE(deltas + 2 * i), ro = b.readUInt16BE(ros + 2 * i); if (!ro) return (cp + d) & 0xffff; const g = b.readUInt16BE(ros + 2 * i + ro + 2 * (cp - st)); return g ? (g + d) & 0xffff : 0; } return 0; };
  const loca = (g: number) => longLoca ? b.readUInt32BE(T.loca + 4 * g) : 2 * b.readUInt16BE(T.loca + 2 * g);
  /** [yMin, yMax] glifu znaku w em (nagłówek glifu; także glify złożone — ramka zapisana w pliku). */
  const box = (ch: string): [number, number] => { const o = T.glyf + loca(gid(ch.codePointAt(0)!)); return [b.readInt16BE(o + 4) / upm, b.readInt16BE(o + 8) / upm]; };
  return { has: (ch: string) => gid(ch.codePointAt(0)!) > 0, box, ascent: ascent / upm, descent: -descent / upm, lineGap: lineGap / upm };
}
const FONTS = path.join(__dirname, '..', 'node_modules', '@expo-google-fonts');
const PLEX = {
  sans400: font(`${FONTS}/ibm-plex-sans/400Regular/IBMPlexSans_400Regular.ttf`), sans600: font(`${FONTS}/ibm-plex-sans/600SemiBold/IBMPlexSans_600SemiBold.ttf`),
  sans700: font(`${FONTS}/ibm-plex-sans/700Bold/IBMPlexSans_700Bold.ttf`), mono500: font(`${FONTS}/ibm-plex-mono/500Medium/IBMPlexMono_500Medium.ttf`),
};
/** Wielkie litery z dwoma znakami nad literą (daszek/łuk + ton) — najwyższe znaki wietnamskiego. */
const VI_STACKED_UPPER = 'ẤẦẨẪẬẮẰẲẴẶẾỀỂỄỆỐỒỔỖỘ';
const VI_STACKED_LOWER = 'ấầẩẫậắằẳẵặếềểễệốồổỗộ';
describe('wygląd: wietnamskie znaki z podwójnymi diakrytykami w IBM Plex (wysokość wiersza)', () => {
  test('każda litera słownika i wskazówek vi jest w IBM Plex Sans 400/600/700 (bez kroju zastępczego)', () => {
    const letters = [...new Set([...entries('vi').map(([, v]) => v), ...Object.values(cueDict('vi'))].join('').match(/\p{L}/gu) ?? [])];
    expect(letters.filter(ch => !(PLEX.sans400.has(ch) && PLEX.sans600.has(ch) && PLEX.sans700.has(ch)))).toEqual([]);
    expect([...VI_STACKED_UPPER, ...VI_STACKED_LOWER].filter(ch => !PLEX.sans400.has(ch) || !PLEX.mono500.has(ch))).toEqual([]);
  });
  test('małe litery z dwoma diakrytykami mieszczą się w wysokości wiersza kroju (ascent hhea) — bez ucięcia nawet przy lineHeight = ascent + descent', () => {
    for (const [name, f] of Object.entries(PLEX)) {
      const top = Math.max(...[...VI_STACKED_LOWER].map(ch => f.box(ch)[1]));
      expect([name, top <= f.ascent]).toEqual([name, true]);
    }
  });
  /* Fakt przypięty (ograniczenie opisane w docs/16 „Fala 2”): wielkie litery z dwoma diakrytykami (np. „Ấ”, „Ệ”) wystają ponad ascent hhea
   * o 4–11 % em (Plex Sans 400: 1,061 em; 700: 1,127 em przy ascent 1,025). iOS (TextKit) liczy wiersz z ascent + descent + lineGap = 1,3 em,
   * a glif rysuje poza ramką wiersza (bez przycinania w <Text>), więc w zwykłym tekście nic nie znika; nad pierwszą linią jest margines
   * descent poprzedniej linii (0,275 em) minus najgłębszy ogonek (ok. 0,2 em). Rzeczywisty wygląd — zrzut z symulatora iOS (e2e-ios). */
  test('wielkie litery z dwoma diakrytykami: wystają ponad ascent najwyżej 0,11 em, a sąsiednie wiersze się nie nachodzą (odstęp ≥ 0)', () => {
    for (const [name, f] of Object.entries(PLEX)) {
      const top = Math.max(...[...VI_STACKED_UPPER].map(ch => f.box(ch)[1]));
      const deepest = -Math.min(...[...'gjpqyỵọụ'].map(ch => f.box(ch)[0]));
      const over = top - f.ascent;
      expect([name, over > 0, over <= 0.11]).toEqual([name, true, true]);
      /* domyślna wysokość wiersza = ascent + descent + lineGap; nachodzenie = glif wyżej niż wiersz + ogonek wiersza wyżej głębiej niż descent */
      const lineH = f.ascent + f.descent + f.lineGap;
      expect([name, lineH - top - deepest > -0.04]).toEqual([name, true]); /* najgorszy przypadek (Bold, „Ấ” pod „g”): ≤ 0,04 em styku */
    }
  });
  test('teksty z jawnym lineHeight w aplikacji mają wysokość wiersza ≥ 1,28 em (miejsce na podwójne diakrytyki) albo zawierają tylko cyfry', () => {
    const files: string[] = []; const walk = (d: string) => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (/\.tsx$/.test(f)) files.push(p); } };
    for (const d of ['app', 'components']) walk(path.join(__dirname, '..', d));
    const found = files.flatMap(f => [...fs.readFileSync(f, 'utf8').matchAll(/fontSize: (\d+)[^}]{0,120}?lineHeight: (\d+)/g)].map(m => ({ f: path.basename(f), size: +m[1], lh: +m[2] })));
    expect(found.length).toBeGreaterThan(0);
    const DIGITS_OR_SYMBOL = new Set(['HistoryCalendar.tsx' /* numer dnia miesiąca */, 'ActiveWorkout.tsx' /* duże liczby karty */, 'DragList.tsx' /* „≡” */]);
    expect(found.filter(x => !DIGITS_OR_SYMBOL.has(x.f) && x.lh / x.size < 1.28)).toEqual([]);
  });
});
