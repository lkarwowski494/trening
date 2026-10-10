/*
 * Fala 4 nowych języków (docs/16 „Fala 4”, 09.10.2026) — ekran, scenariusz i dane: 日本語, 한국어, 繁體中文 na liście języków, wybór zmienia teksty
 * i przeżywa ponowne uruchomienie, migrację i kopię; „Jak w telefonie” na telefonie ja-JP / ko-KR / zh-Hant-TW / zh-HK → ten język, a telefon
 * zh-Hans-CN (chiński uproszczony — odłożony) po angielsku; ekran ćwiczenia z sekcją techniki; trening w toku i ustawienia na 320 pt przy skali
 * tekstu 2,0 (200 %) bez polskich tekstów i błędów Reacta.
 * Wszystkie trasy × LANGS: tests/matrix-dim-langs-routes.test.tsx; szerokości 320 pt / 200 % z łamaniem CJK: tests/matrix-i18n.test.tsx (units()).
 */
import * as store from '@/lib/store';
import { buildBackup, parseBackup } from '@/lib/backup';
import { LANG_NAME, lang, applyLang, t, type Lang } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';
import { CUE_DATA, cueText } from '@/lib/cues';
import * as RN from 'react-native';
import { renderApp, flushAll, screen, go, tap } from './app';
import { seedWithDemo } from './helpers';

const S = () => store.getState();
afterEach(() => { global.__locales = [{ languageCode: 'pl', languageTag: 'pl-PL' }]; applyLang('pl'); });
const W4 = ['ja', 'ko', 'zh-Hant'] as const;
/** Teksty na ekranie, które są polskim kluczem z tłumaczeniem w języku `l` (powinny być przetłumaczone). */
const plLeft = (l: Lang) => { const d = LOCALES[l]!; return screen.UNSAFE_root.findAll((x: { type: unknown; props: { children?: unknown } }) => x.type === 'Text' && typeof x.props.children === 'string').map((x: { props: { children?: unknown } }) => String(x.props.children)).filter(s => Object.prototype.hasOwnProperty.call(d, s) && d[s] !== s); };
/** Wszystkie teksty na ekranie. */
const shown = () => screen.UNSAFE_root.findAll((x: { type: unknown; props: { children?: unknown } }) => x.type === 'Text' && typeof x.props.children === 'string').map((x: { props: { children?: unknown } }) => String(x.props.children));
const SCRIPT: Record<typeof W4[number], RegExp> = { ja: /[぀-ヿ一-鿿]/, ko: /[가-힯]/, 'zh-Hant': /[一-鿿]/ };

describe('Ustawienia → Język: 日本語, 한국어, 繁體中文', () => {
  test.each([
    ['ja', 'トレーニング中は画面をオンのままにする', '外観'], ['ko', '운동 중 화면 켜 두기', '화면 모드'], ['zh-Hant', '訓練時保持螢幕開啟', '外觀'],
  ] as const)('%s: na liście nazwa jak w iOS; wybór zapisuje się, ekran ustawień w tym języku', async (l, keepScreen, appearance) => {
    await renderApp(); await go('/more/language'); await flushAll(5);
    for (const x of W4) expect(screen.getByText(LANG_NAME[x])).toBeTruthy();
    await tap(screen.getByText(LANG_NAME[l])); await flushAll(10);
    expect([S().settings.language, lang()]).toEqual([l, l]);
    await go('/more/settings'); await flushAll(5);
    expect(screen.getByText(keepScreen)).toBeTruthy(); expect(screen.getByText(appearance)).toBeTruthy();
    expect(screen.queryByText('Ekran włączony podczas treningu')).toBeNull();
    expect(screen.getByText(LANG_NAME[l])).toBeTruthy();
    expect(plLeft(l)).toEqual([]);
  });
});

describe('dane: ustawienie języka przeżywa restart, migrację i kopię', () => {
  test.each([...W4])('%s: ponowne uruchomienie, migrate(), eksport → import', async l => {
    await renderApp(); S().settings.language = l; store.save(); await flushAll(5);
    const saved = JSON.parse(JSON.stringify(S()));
    await renderApp({ saved }); await flushAll(5);
    expect([S().settings.language, lang()]).toEqual([l, l]);
    expect(store.migrate(JSON.parse(JSON.stringify(saved))).settings.language).toBe(l);
    expect(parseBackup(JSON.stringify(buildBackup())).settings.language).toBe(l);
  });
});

describe('„Jak w telefonie”: telefon z Japonii, Korei, Tajwanu, Hongkongu; chiński uproszczony → angielski', () => {
  test.each([
    ['ja', 'ja', 'ja-JP'], ['ko', 'ko', 'ko-KR'], ['zh-Hant', 'zh', 'zh-Hant-TW'], ['zh-Hant', 'zh', 'zh-Hant-HK'], ['zh-Hant', 'zh', 'zh-HK'], ['en', 'zh', 'zh-Hans-CN'],
  ] as const)('%s na telefonie %s / %s (start aplikacji): ekran Treningu i zakładki w tym języku, bez tekstów po polsku', async (l, code, tag) => {
    const s = seedWithDemo(l); s.settings.language = 'auto';
    await renderApp({ saved: s, code, tag }); await flushAll(10);
    expect(lang()).toBe(l);
    for (const k of ['Trening', 'Szablony', 'Ćwiczenia', 'Kalendarz', 'Więcej']) expect([k, screen.getAllByText(t(k)).length > 0]).toEqual([k, true]);
    if (l !== 'en') {
      expect(plLeft(l)).toEqual([]);
      /* pisma się nie mieszają na ekranie: japoński bez hangula, koreański bez kana, chiński bez kana i hangula */
      const other = l === 'ja' ? /[가-힯]/ : l === 'ko' ? /[぀-ヿ]/ : /[぀-ヿ가-힯]/;
      expect(shown().filter(x => other.test(x))).toEqual([]);
      expect(shown().some(x => SCRIPT[l].test(x))).toBe(true);
    } else expect(shown().filter(x => /[぀-ヿ가-힯一-鿿]/.test(x))).toEqual([]);
  });

  test.each(W4.flatMap(l => (['/', '/more/settings'] as const).map(u => [l, u] as const)))('%s, szerokość 320 pt, skala tekstu 2,0: %s (trening w toku / ustawienia) bez błędów Reacta i bez polskich tekstów', async (l, url) => {
    jest.spyOn(RN.PixelRatio, 'getFontScale').mockReturnValue(2);
    const dims = RN.Dimensions.get; jest.spyOn(RN.Dimensions, 'get').mockImplementation(((k: 'window' | 'screen') => ({ ...dims(k), fontScale: 2 })) as never);
    const errs: string[] = []; jest.spyOn(console, 'error').mockImplementation((...a: unknown[]) => { const m = String(a[0]); if (!/not wrapped in act/.test(m)) errs.push(m.slice(0, 200)); });
    try {
      const s = seedWithDemo(l); s.settings.language = l;
      await renderApp({ saved: s, width: 320 }); await flushAll(10);
      if (url === '/') { store.startFromTemplate(S().templates[0]); await go('/'); await flushAll(10); expect(screen.getAllByText(new RegExp(t('Seria'))).length).toBeGreaterThan(0); }
      else { await go(url); await flushAll(10); expect(screen.getByText(t('Wygląd'))).toBeTruthy(); }
      expect(plLeft(l)).toEqual([]);
      expect(errs).toEqual([]);
    } finally { jest.restoreAllMocks(); }
  });
});

describe('ekran ćwiczenia: sekcja techniki w ja, ko, zh-Hant', () => {
  test.each([
    ['ja', 'テクニック', 'よくある間違い'], ['ko', '자세', '흔한 실수'], ['zh-Hant', '技巧', '常見錯誤'],
  ] as const)('%s: przycisk „%s”, wskazówki z lib/cues/text, nagłówek „%s”; nazwa ćwiczenia po angielsku', async (l, tech, mistakes) => {
    await renderApp(); S().settings.language = l; store.applyPrefs(); await flushAll(5);
    const ex = S().exercises.find(e => e.lib && e.libKey === 'Back Squat')!;
    const { router } = require('expo-router'); const { act } = require('./app');
    await act(async () => { router.push(`/exercise/${ex.id}`); }); await flushAll();
    await tap(screen.getByRole('button', { name: tech }));
    expect(screen.getByText(`• ${cueText(CUE_DATA.exercises['Back Squat'].setup[0].c, l)}`)).toBeTruthy();
    expect(screen.getByRole('header', { name: mistakes })).toBeTruthy();
    expect(screen.getByText(/Back Squat/)).toBeTruthy(); /* nazwa ćwiczenia z biblioteki — po angielsku, jak w innych językach */
  });
});
