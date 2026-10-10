/*
 * Fala 4 nowych języków (docs/16 „Fala 4”, 09.10.2026): japoński (ja), koreański (ko), chiński tradycyjny — wariant tajwański (zh-Hant).
 * Rodzaje (docs/20): logika (resolveLang / detectLang: ja-JP, ko-KR, zh-Hant-TW, zh-Hant-HK, zh-TW, zh-HK → zh-Hant; zh-Hans, zh-CN, samo „zh” → en;
 * locale z regionu telefonu, kropka dziesiętna; liczba mnoga — jedna forma „other” wg CLDR), dane (komplet kluczy UI i wskazówek, parametry,
 * locales/*.json, nazwy App Store), języki (każdy tekst w swoim piśmie, bez śladów angielskich i polskich, ja — grzeczny styl です/ます,
 * ko — styl grzecznościowy, zh-Hant — znaki tradycyjne i słownictwo tajwańskie, terminologia siłowni, nazwy iOS, jednostki),
 * wygląd (wariant A: IBM Plex bez zmian, pismo CJK krojem zastępczym iOS — lib/theme.ts FALLBACK_SCRIPTS; łamanie wierszy bez spacji —
 * tests/matrix-i18n units()).
 * Ekran: tests/i18n-wave4-ui.test.tsx; 320 pt / 200 %, ekrany × język, widżet, kompletność, przerwa ≠ pauza — testy z pętlą po LANGS
 * (matrix-i18n, matrix-dim-langs*, widget-i18n, i18n-locales, cues, audit-0.10-lang) obejmują ja/ko/zh-Hant automatycznie albo przez ręczne
 * listy uzupełnione w tej fali (TERMS, matrix-i18n — ALT i kropka dziesiętna, i18n-variants, i18n-multi, cues-lazy).
 */
import * as fs from 'fs';
import * as path from 'path';
import { LANGS, resolveLang, applyLang, lang, locale, decimalComma, tp, detectLang, LANG_NAME, APP_NAME, ZH_HANT_REGIONS, type Lang } from '@/lib/i18n';
import { EN } from '@/lib/i18n.en';
import { LOCALES } from '@/lib/locales';
import { PLURAL_FORMS, pluralIndex } from '@/lib/plural';
import { cueDict } from '@/lib/cues';
import { F, FONT_FILES, FALLBACK_SCRIPTS } from '@/lib/theme';
import { fmtSec, fmtDist, reps } from '@/lib/store';

const W4 = ['ja', 'ko', 'zh-Hant'] as const;
type W4L = typeof W4[number];
const dict = (l: W4L): Record<string, string> => LOCALES[l]!;
const entries = (l: W4L) => Object.entries(dict(l));
const all = (l: W4L) => [...Object.values(dict(l)), ...Object.values(cueDict(l))];
const KANA = /[぀-ヿ]/, HANGUL = /[가-힯ᄀ-ᇿ㄰-㆏]/, HAN = /[㐀-䶿一-鿿豈-﫿]/;
/** Pismo języka: ja — kana albo kanji, ko — hangul, zh-Hant — znaki chińskie. */
const SCRIPT: Record<W4L, RegExp> = { ja: /[぀-ヿ㐀-䶿一-鿿]/, ko: HANGUL, 'zh-Hant': HAN };
/** Teksty bez pisma CJK — tylko symbole, skróty i terminy siłowni pisane łacinką (jak SAME_AS_EN w falach 2–3). */
const LATIN_OK = new Set(['{k}: {v}', 'e1RM', 'GHD', 'glute-ham raise', 'circus bell', 'reverse hyper', 'OK', '{n} km', '{n} m', '{n}km', '{n}m', '{n}/{all}', '{n}/{m}', 'GHD（glute-ham developer）', 'GHD(glute-ham developer)']);

describe('resolveLang / detectLang: telefon po japońsku, koreańsku, chińsku (tradycyjny i uproszczony)', () => {
  test.each([
    ['ja-JP', 'ja'], ['ja', 'ja'], ['ja_JP', 'ja'], ['ja-US', 'ja'] /* język telefonu decyduje, nie region */,
    ['ko-KR', 'ko'], ['ko', 'ko'], ['ko_KR', 'ko'], ['ko-US', 'ko'],
    ['zh-Hant-TW', 'zh-Hant'], ['zh-Hant-HK', 'zh-Hant'], ['zh-Hant-MO', 'zh-Hant'], ['zh-Hant', 'zh-Hant'], ['zh-Hant-US', 'zh-Hant'],
    ['zh-TW', 'zh-Hant'], ['zh-HK', 'zh-Hant'], ['zh-MO', 'zh-Hant'], ['zh_TW', 'zh-Hant'], ['zh_Hant_TW', 'zh-Hant'],
    ['zh-Hans-CN', 'en'], ['zh-Hans', 'en'], ['zh-CN', 'en'], ['zh-SG', 'en'], ['zh', 'en'], ['zh-Hans-HK', 'en'] /* pismo uproszczone w HK — uproszczony odłożony */,
    ['yue-Hant-HK', 'en'] /* kantoński — nie jest językiem aplikacji */, ['en-JP', 'en'], ['en-KR', 'en'], ['en-TW', 'en'],
  ] as const)('%s → %s', (tag, want) => { expect(resolveLang(tag)).toBe(want); });
  test('kod języka z expo-localization (languageCode) — chiński bez tagu → en; z tagiem zh-Hant-TW → zh-Hant', () => {
    expect([resolveLang(null, 'ja'), resolveLang(null, 'ko'), resolveLang(null, 'zh')]).toEqual(['ja', 'ko', 'en']);
    expect([resolveLang('zh-Hant-TW', 'zh'), resolveLang('zh-HK', 'zh'), resolveLang('zh-Hans-CN', 'zh')]).toEqual(['zh-Hant', 'zh-Hant', 'en']);
  });
  test('regiony pisma tradycyjnego bez zapisu pisma (CLDR likelySubtags): TW, HK, MO', () => { expect([...ZH_HANT_REGIONS]).toEqual(['TW', 'HK', 'MO']); });

  afterEach(() => { global.__locales = [{ languageCode: 'pl', languageTag: 'pl-PL' }]; applyLang('pl'); });
  const dev = (code: string, tag: string) => { global.__locales = [{ languageCode: code, languageTag: tag }]; };
  test.each([
    ['ja', 'ja-JP', 'ja', 'ja-JP'], ['ko', 'ko-KR', 'ko', 'ko-KR'], ['zh', 'zh-Hant-TW', 'zh-Hant', 'zh-Hant-TW'], ['zh', 'zh-Hant-HK', 'zh-Hant', 'zh-Hant-HK'],
    ['zh', 'zh-HK', 'zh-Hant', 'zh-HK'], ['zh', 'zh-Hans-CN', 'en', 'en-US'],
  ] as const)('„Jak w telefonie”: %s / %s → język %s, daty i liczby %s, kropka dziesiętna', (code, tag, want, loc) => {
    dev(code, tag); expect(detectLang()).toBe(want); applyLang('auto');
    expect([lang(), locale(), decimalComma()]).toEqual([want, loc, false]);
  });
  test('wymuszony język przy telefonie w innym języku: domyślne regiony ja-JP, ko-KR, zh-Hant-TW; zh-Hant na telefonie zh-Hans-CN → zh-Hant-TW (nie daty uproszczone)', () => {
    dev('de', 'de-DE');
    for (const [l, tag] of [['ja', 'ja-JP'], ['ko', 'ko-KR'], ['zh-Hant', 'zh-Hant-TW']] as const) { applyLang(l); expect([l, locale()]).toEqual([l, tag]); }
    dev('zh', 'zh-Hans-CN'); applyLang('zh-Hant'); expect(locale()).toBe('zh-Hant-TW');
    dev('ja', 'ja-JP'); applyLang('zh-Hant'); expect(locale()).toBe('zh-Hant-TW');
  });
  test('daty w piśmie języka: miesiąc i dzień tygodnia z Intl (ja 月/曜日, ko 월/요일, zh-Hant 月/星期)', () => {
    const d = new Date(2026, 2, 15);
    const f = (tag: string) => new Intl.DateTimeFormat(tag, { month: 'long', weekday: 'long', day: 'numeric' }).format(d);
    expect(f('ja-JP')).toMatch(/月.*曜日|曜日.*月/); expect(f('ko-KR')).toMatch(/월.*요일/); expect(f('zh-Hant-TW')).toMatch(/月.*星期/);
  });
  test('LANGS: ja, ko, zh-Hant na końcu listy (po ru), nazwy jak w iOS (日本語, 한국어, 繁體中文), nazwa aplikacji „Training”', () => {
    expect(LANGS.slice(-3)).toEqual(['ja', 'ko', 'zh-Hant']); expect(LANGS[LANGS.length - 4]).toBe('ru');
    expect(W4.map(l => LANG_NAME[l])).toEqual(['日本語', '한국어', '繁體中文']);
    expect(W4.map(l => APP_NAME[l])).toEqual(['Training', 'Training', 'Training']);
  });
});

describe('liczba mnoga: ja, ko, zh-Hant — jedna forma (CLDR „other”)', () => {
  afterAll(() => applyLang('pl'));
  test('PLURAL_FORMS = [other]; Intl.PluralRules zna tylko „other”; pluralIndex zawsze 0', () => {
    for (const l of W4) {
      expect([l, PLURAL_FORMS[l]]).toEqual([l, ['other']]);
      expect([l, new Intl.PluralRules(l).resolvedOptions().pluralCategories]).toEqual([l, ['other']]);
      expect([0, 1, 2, 5, 11, 21, 101].map(n => pluralIndex(l, n))).toEqual([0, 0, 0, 0, 0, 0, 0]);
    }
  });
  test('każdy wpis liczby mnogiej ma jedną formę (bez „|”); tp() daje ten sam wyraz dla 1, 2, 5', () => {
    const keys = Object.keys(EN).filter(k => k.includes('|')); expect(keys.length).toBeGreaterThan(3);
    for (const l of W4) {
      for (const k of keys) expect([l, k, dict(l)[k].includes('|')]).toEqual([l, k, false]);
      applyLang(l); expect([l, new Set([1, 2, 5].map(n => tp(n, 'seria|serie|serii'))).size]).toEqual([l, 1]);
    }
    applyLang('ja'); expect([tp(3, 'seria|serie|serii'), tp(3, 'powtórzenie|powtórzenia|powtórzeń'), tp(3, 'dzień|dni|dni')]).toEqual(['セット', '回', '日']);
    applyLang('ko'); expect([tp(3, 'seria|serie|serii'), tp(3, 'powtórzenie|powtórzenia|powtórzeń'), tp(3, 'dzień|dni|dni')]).toEqual(['세트', '회', '일']);
    applyLang('zh-Hant'); expect([tp(3, 'seria|serie|serii'), tp(3, 'powtórzenie|powtórzenia|powtórzeń'), tp(3, 'dzień|dni|dni')]).toEqual(['組', '下', '天']);
  });
});

describe('dane: komplet słownika UI i wskazówek techniki, pliki iOS i App Store', () => {
  const src = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'lib', 'locales', '_source.json'), 'utf8')) as { pl: string }[];
  const params = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(',');
  test.each([...W4])('%s: każdy klucz źródła ma niepuste tłumaczenie z tymi samymi {parametrami}; bez nadmiarowych kluczy; wskazówki — każde zdanie', l => {
    const d = dict(l);
    expect(src.filter(s => !d[s.pl]?.trim()).map(s => s.pl)).toEqual([]);
    expect(src.filter(s => params(d[s.pl]) !== params(s.pl)).map(s => s.pl)).toEqual([]);
    expect(Object.keys(d).length).toBe(src.length);
    const en = cueDict('en'), c = cueDict(l);
    expect(Object.keys(c).sort()).toEqual(Object.keys(en).sort());
    expect(Object.entries(c).filter(([, v]) => !v.trim())).toEqual([]);
  });
  test.each([
    ['ja', /ヘルスケア/], ['ko', /건강/], ['zh-Hant', /健康/],
  ] as const)('locales/%s.json (iOS: nazwa pod ikoną, opisy uprawnień Zdrowia) — w języku, z nazwą aplikacji i nazwą aplikacji Zdrowie z iOS', (l, health) => {
    const f = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'locales', `${l}.json`), 'utf8'));
    expect(f.CFBundleDisplayName).toBe('Training');
    expect(f.NSHealthShareUsageDescription).toMatch(health); expect(f.NSHealthUpdateUsageDescription).toMatch(/Apple Health/);
    for (const v of [f.NSHealthShareUsageDescription, f.NSHealthUpdateUsageDescription] as string[]) expect(SCRIPT[l].test(v)).toBe(true);
  });
  test('nazwy w App Store (lokalizacje App Store Connect ja, ko, zh-Hant) — APP_NAME przed dwukropkiem, ≤ 30 znaków, w piśmie języka', () => {
    const names = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'store', 'app-store-names.json'), 'utf8')).names as Record<string, string>;
    for (const l of W4) { const n = names[l]; expect([l, n.startsWith(`${APP_NAME[l]}: `), [...n].length <= 30, SCRIPT[l].test(n)]).toEqual([l, true, true, true]); }
  });
  test('app.json: CFBundleLocalizations i locales z ja, ko, zh-Hant (zh-Hant.lproj — identyfikator Apple z pismem)', () => {
    const app = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'app.json'), 'utf8')).expo;
    for (const l of W4) { expect(app.ios.infoPlist.CFBundleLocalizations).toContain(l); expect(app.locales[l]).toBe(`./locales/${l}.json`); }
  });
  test('widżet: etykiety w RestLabels.swift i wybór zh-Hant z języka systemu (zh-Hant-TW, zh-HK…), uproszczony → angielski', () => {
    const dir = path.join(__dirname, '..', 'targets', 'rest-widget');
    const labels = fs.readFileSync(path.join(dir, 'RestLabels.swift'), 'utf8');
    expect(labels).toContain('"ja": (rest: "休憩", set: "セット")'); expect(labels).toContain('"ko": (rest: "휴식", set: "세트")'); expect(labels).toContain('"zh-Hant": (rest: "休息", set: "組")');
    const swift = fs.readFileSync(path.join(dir, 'RestLiveActivity.swift'), 'utf8');
    expect(swift).toMatch(/if code == "zh" \{ code = \(pref\.contains\("Hant"\) \|\| pref\.hasSuffix\("-TW"\) \|\| pref\.hasSuffix\("-HK"\) \|\| pref\.hasSuffix\("-MO"\)\) \? "zh-Hant" : "en" \}/);
    for (const l of W4) expect(fs.existsSync(path.join(dir, `${l}.lproj`, 'InfoPlist.strings'))).toBe(true);
  });
});

/* ====================================================================================================================================== */
/** Polskie wyrazy częste w kluczach — ślad nieprzetłumaczonego tekstu. */
const PL_WORDS = /\b(nie|jest|albo|oraz|przy|trening|treningu|seria|serii|szablon|ciężar|przerwa|dodaj|usuń|zapisz)\b/i;
/** Wyrazy angielskie (ślad nieprzetłumaczonego tekstu) — poza nazwami w nawiasach, nazwami Apple i terminami z listy. */
const EN_WORDS = /\b(the|and|with|your|you|of|for|this|that|is|are|will|not|from|when|after|before|only|all|tap|weight|workout|exercise|template|rest|set|sets|reps)\b/i;
const stripNames = (v: string) => v.replace(/\{\w+\}/g, '').replace(/[(（][^)）]*[)）]/g, '').replace(/\b(glute-ham raise|circus bell|reverse hyper|Apple Health|Apple ID|TestFlight|iCloud|iPhone|iOS|HealthKit|Backup|Zourdos|Helms|JSCR|Epley)\b/g, '');
describe('języki: jakość tekstów ja, ko, zh-Hant', () => {
  test.each([...W4])('%s: każdy tekst w piśmie języka (poza symbolami i terminami z listy LATIN_OK); żaden nie jest identyczny z angielskim poza listą', l => {
    expect(entries(l).filter(([, v]) => !SCRIPT[l].test(v) && !LATIN_OK.has(v)).map(([k, v]) => `${k} → ${v}`)).toEqual([]);
    expect(entries(l).filter(([k, v]) => v === EN[k] && !LATIN_OK.has(v)).map(([k]) => k)).toEqual([]);
    expect(Object.values(cueDict(l)).filter(v => !SCRIPT[l].test(v))).toEqual([]);
  });
  test('lista LATIN_OK nie jest martwa: każdy wpis występuje w którymś słowniku', () => {
    const used = new Set(W4.flatMap(l => Object.values(dict(l))));
    expect([...LATIN_OK].filter(x => !used.has(x))).toEqual([]);
  });
  test.each([...W4])('%s: bez angielskich wyrazów-śladów (poza nazwami w nawiasach i nazwami Apple) i bez polskich', l => {
    expect(all(l).filter(v => EN_WORDS.test(stripNames(v)))).toEqual([]);
    expect(all(l).filter(v => PL_WORDS.test(v))).toEqual([]);
  });
  test('wskazówki techniki: żadne zdanie nie jest identyczne z angielskim ani polskim; każde w piśmie języka', () => {
    const en = cueDict('en'), pl = cueDict('pl');
    for (const l of W4) { const c = cueDict(l); expect([l, Object.keys(c).filter(k => c[k] === en[k] || c[k] === pl[k] || !SCRIPT[l].test(c[k]))]).toEqual([l, []]); }
  });
  test('pisma się nie mieszają: ja bez hangula; ko bez kana i bez znaków chińskich (hanja); zh-Hant bez kana i hangula', () => {
    expect(all('ja').filter(v => HANGUL.test(v))).toEqual([]);
    expect(all('ko').filter(v => KANA.test(v) || HAN.test(v))).toEqual([]);
    expect(all('zh-Hant').filter(v => KANA.test(v) || HANGUL.test(v))).toEqual([]);
    expect(all('ja').filter(v => /[぀-ゟ]/.test(v)).length).toBeGreaterThan(1000); /* kontrola: hiragana naprawdę w użyciu (zdania, nie same kanji) */
  });
  /* Chiński tradycyjny (Tajwan): znaki tradycyjne, nie uproszczone; słownictwo iOS w wersji tajwańskiej (設定, 檔案, 資料). */
  const SIMPLIFIED = /[们这个为说时动练习组设录计数据应没关开换读删选项级带训体复后间单击视频软户输]/; /* bez 置 i 划 — te same w obu zapisach (位置, 划船) */
  test('zh-Hant: bez znaków uproszczonych (lista częstych: 们 这 个 为 动 练 组 设 录 计 划 数 据…) i bez słownictwa z Chin kontynentalnych (數據, 文件, 視頻, 軟件, 用戶, 信息, 設置)', () => {
    expect(all('zh-Hant').filter(v => SIMPLIFIED.test(v))).toEqual([]);
    expect(all('zh-Hant').filter(v => /數據|文件|視頻|軟件|用戶|信息|設置|默認/.test(v))).toEqual([]);
    expect(all('zh-Hant').filter(v => /[動訓練組設錄計劃數據]/.test(v)).length).toBeGreaterThan(500); /* kontrola: znaki tradycyjne w użyciu */
  });
  /* Japoński — grzeczny styl です/ます (polecenie 09.10.2026): zdanie zakończone „。” nie kończy się formą słownikową czasownika ani formą „だ/である”.
   * Rzeczowniki i równoważniki (np. „次のセット。”) są dozwolone — sprawdzamy tylko końcówki form zwykłych. */
  const PLAIN_JA = /(る|う|く|ぐ|す|つ|ぬ|ぶ|む|た|だ|ない|である)$/;
const POLITE_JA = /(ます|です|ません|ました|でした|ましょう|ください)$/;
  const sentencesJa = (v: string) => v.split(/[。？！]/).slice(0, -1).map(s => s.replace(/[」』）)\s]+$/, '').trim()).filter(Boolean);
  test('ja: grzeczny styl — zdania kończą się formą です/ます (albo równoważnikiem), nie formą zwykłą (る, た, だ, ない…); UI i wskazówki', () => {
    const bad = all('ja').flatMap(v => sentencesJa(v).filter(s => !POLITE_JA.test(s) && PLAIN_JA.test(s)).map(s => `${s}。 (${v.slice(0, 40)})`));
    expect(bad).toEqual([]);
    expect(all('ja').filter(v => /(ます|です|ません|ください)。/.test(v)).length).toBeGreaterThan(400); /* kontrola: forma grzeczna naprawdę w użyciu */
  });
  /* Koreański — styl grzecznościowy (-니다 / -세요 / -요), bez formy zwykłej „-다.” (반말/한다체) na końcu zdania. */
  test('ko: zdania kończą się formą grzeczną (-니다, -세요, -요, -까요?) albo równoważnikiem — bez formy zwykłej „…다.” poza „…니다.”', () => {
    const bad = all('ko').flatMap(v => v.split(/(?<=[.?!])\s+/).filter(s => /[^니]다[.?!]$/.test(s.trim())));
    expect(bad).toEqual([]);
    expect(all('ko').filter(v => /(니다|세요|까요)[.?]/.test(v)).length).toBeGreaterThan(400);
  });
  test('terminologia siłowni jednolita: trening / ćwiczenie / seria / powtórzenia / przerwa / pauza / szablon / guma / do upadku / deload', () => {
    const k = ['Trening', 'Ćwiczenie', 'Seria', 'Powtórzenia', 'Przerwa', '⏸ Pauza', 'Szablon', 'Guma', 'do upadku', 'Deload'];
    expect(k.map(x => dict('ja')[x])).toEqual(['トレーニング', '種目', 'セット', '回数', '休憩', '⏸ 一時停止', 'テンプレート', 'バンド', '限界まで', 'ディロード']);
    expect(k.map(x => dict('ko')[x])).toEqual(['운동', '종목', '세트', '반복 횟수', '휴식', '⏸ 일시정지', '루틴', '밴드', '실패 지점까지', '디로드']);
    expect(k.map(x => dict('zh-Hant')[x])).toEqual(['訓練', '動作', '組', '次數', '休息', '⏸ 暫停', '範本', '彈力帶', '力竭', '減量']);
  });
  test('cel generatora „Redukcja” ≠ „Deload” (zh-Hant: 減脂 vs 減量; ja: 減量 vs ディロード; ko: 감량 vs 디로드)', () => {
    for (const l of W4) expect([l, dict(l)['Redukcja'] !== dict(l)['Deload'], dict(l)['Redukcja'] !== dict(l)['Masa']]).toEqual([l, true, true]);
    expect(dict('zh-Hant')['Redukcja']).toBe('減脂');
  });
  test('nazwy iOS: Ustawienia, aplikacja Zdrowie, Pliki („Na moim iPhonie”) jak w iOS w danym języku', () => {
    expect(W4.map(l => dict(l)['Ustawienia'])).toEqual(['設定', '설정', '設定']);
    const health = 'Brak zgody na zapis treningów. Włącz ją w aplikacji Zdrowie: profil → Aplikacje → {app}.';
    expect([dict('ja')[health], dict('ko')[health], dict('zh-Hant')[health]]).toEqual([expect.stringMatching(/ヘルスケア/), expect.stringMatching(/건강 앱/), expect.stringMatching(/「健康」/)]);
    const files = 'Pliki → Na moim iPhonie → {app} → Backup, ostatnie {n}';
    expect([dict('ja')[files], dict('ko')[files], dict('zh-Hant')[files]]).toEqual([expect.stringMatching(/^ファイル → このiPhone内/), expect.stringMatching(/^파일 → 나의 iPhone/), expect.stringMatching(/^檔案 → 我的 iPhone/)]);
  });
  test('jednostki i skróty: ja 45秒 / 1.5 km / 最大, ko 45초 / 1.5km / 최대, zh-Hant 45 秒 / 1.5 公里 / 最大 (fmtSec, fmtDist, reps)', () => {
    const run = (l: Lang) => { applyLang(l); return [fmtSec(45), fmtSec(95), fmtDist(800), fmtDist(1500), reps(null, null), reps(8, 12)]; };
    try {
      expect(run('ja')).toEqual(['45秒', '1:35', '800 m', '1.5 km', '最大', '8–12']);
      expect(run('ko')).toEqual(['45초', '1:35', '800m', '1.5km', '최대', '8–12']);
      expect(run('zh-Hant')).toEqual(['45 秒', '1:35', '800 公尺', '1.5 公里', '最大', '8–12']);
    } finally { applyLang('pl'); }
  });
  test('cudzysłowy: ja i zh-Hant 「…」, ko ‘…’ — bez „…” i “…”', () => {
    for (const l of W4) expect([l, all(l).filter(v => /[„“”]/.test(v))]).toEqual([l, []]);
    expect(entries('ja').filter(([k]) => /[„“]/.test(k)).every(([, v]) => /「/.test(v))).toBe(true);
    expect(entries('zh-Hant').filter(([k]) => /[„“]/.test(k)).every(([, v]) => /「/.test(v))).toBe(true);
  });
});

/* ====================================================================================================================================== */
/** Czytnik cmap TTF (format 4) — czy krój ma znak. */
function hasGlyph(file: string) {
  const b = fs.readFileSync(file); const T: Record<string, number> = {};
  for (let i = 0; i < b.readUInt16BE(4); i++) { const o = 12 + 16 * i; T[b.toString('latin1', o, o + 4)] = b.readUInt32BE(o + 8); }
  let sub = -1; for (let i = 0; i < b.readUInt16BE(T.cmap + 2); i++) { const p = b.readUInt16BE(T.cmap + 4 + 8 * i), e = b.readUInt16BE(T.cmap + 6 + 8 * i), off = b.readUInt32BE(T.cmap + 8 + 8 * i); if (b.readUInt16BE(T.cmap + off) === 4 && ((p === 3 && e === 1) || p === 0)) { sub = T.cmap + off; break; } }
  const seg = b.readUInt16BE(sub + 6) / 2, ends = sub + 14, starts = ends + 2 * seg + 2, deltas = starts + 2 * seg, ros = deltas + 2 * seg;
  return (ch: string) => { const cp = ch.codePointAt(0)!; for (let i = 0; i < seg; i++) { if (cp > b.readUInt16BE(ends + 2 * i)) continue; const st = b.readUInt16BE(starts + 2 * i); if (cp < st) return false; const d = b.readInt16BE(deltas + 2 * i), ro = b.readUInt16BE(ros + 2 * i); if (!ro) return ((cp + d) & 0xffff) > 0; const g = b.readUInt16BE(ros + 2 * i + ro + 2 * (cp - st)); return g ? ((g + d) & 0xffff) > 0 : false; } return false; };
}
describe('wygląd: wariant A — IBM Plex bez zmian, pismo CJK krojem zastępczym iOS', () => {
  const FONTS = path.join(__dirname, '..', 'node_modules', '@expo-google-fonts');
  const files = ['ibm-plex-sans/400Regular/IBMPlexSans_400Regular.ttf', 'ibm-plex-sans/600SemiBold/IBMPlexSans_600SemiBold.ttf', 'ibm-plex-sans/700Bold/IBMPlexSans_700Bold.ttf', 'ibm-plex-mono/500Medium/IBMPlexMono_500Medium.ttf'].map(f => hasGlyph(`${FONTS}/${f}`));
  test('fakt: IBM Plex Sans i Mono nie mają kana, kanji ani hangula (dlatego krój zastępczy — docs/16 „Fala 4”)', () => {
    expect(files.map(has => [...'あア日中한국訓'].some(ch => has(ch)))).toEqual([false, false, false, false]);
  });
  test('jeden zestaw krojów dla każdego języka: F i FONT_FILES bez krojów CJK (rozmiar aplikacji bez zmian); FALLBACK_SCRIPTS obejmuje każdą literę CJK z tłumaczeń', () => {
    expect(Object.values(F).every(f => /^IBMPlex(Sans|Mono)_/.test(f))).toBe(true);
    expect(Object.keys(FONT_FILES).some(k => /JP|KR|TC|CJK|Noto|PingFang|Hiragino/i.test(k))).toBe(false);
    for (const l of W4) {
      const missing = [...new Set(all(l).join('').match(/\p{L}/gu) ?? [])].filter(ch => !files[0](ch));
      expect([l, missing.filter(ch => !FALLBACK_SCRIPTS.test(ch)).join('')]).toEqual([l, '']); /* łacina w tych językach (RPE, kg, nazwy) jest w Plex */
      expect(missing.length).toBeGreaterThan(50);
    }
  });
  test('FALLBACK_SCRIPTS bez \\p{scx=…} (Hermes) i bez znaków innych pism (łacina, cyrylica, grecki)', () => {
    expect(FALLBACK_SCRIPTS.source).not.toMatch(/\\p\{/);
    expect([...'aąЖωé0'].some(ch => FALLBACK_SCRIPTS.test(ch))).toBe(false);
    expect([...'あア日한、。「？'].every(ch => FALLBACK_SCRIPTS.test(ch))).toBe(true);
  });
});
