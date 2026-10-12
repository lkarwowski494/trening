/*
 * Fala 3 nowych języków (docs/16 „Fala 3”, 09.10.2026) — ekran, scenariusz i dane: „Русский” na liście języków, wybór zmienia teksty i przeżywa
 * ponowne uruchomienie, migrację i kopię; „Jak w telefonie” na telefonie ru-RU / ru-KZ / ru-UA / ru-BY → ru, a ukraiński telefon (uk-UA) dalej
 * po ukraińsku; ekran ćwiczenia z sekcją „Техника”; trening w toku i ustawienia na 320 pt przy skali tekstu 2,0 (200 %) bez polskich tekstów i błędów.
 * Wszystkie trasy × LANGS: tests/matrix-dim-langs-routes.test.tsx; szerokości 320 pt / 200 %: tests/matrix-i18n.test.tsx (ru wchodzi sam).
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
/** Teksty na ekranie, które są polskim kluczem z tłumaczeniem w języku `l` (powinny być przetłumaczone). */
const plLeft = (l: Lang) => { const d = LOCALES[l]!; return screen.UNSAFE_root.findAll((x: { type: unknown; props: { children?: unknown } }) => x.type === 'Text' && typeof x.props.children === 'string').map((x: { props: { children?: unknown } }) => String(x.props.children)).filter(s => Object.prototype.hasOwnProperty.call(d, s) && d[s] !== s); };
/** Wszystkie teksty na ekranie. */
const shown = () => screen.UNSAFE_root.findAll((x: { type: unknown; props: { children?: unknown } }) => x.type === 'Text' && typeof x.props.children === 'string').map((x: { props: { children?: unknown } }) => String(x.props.children));

describe('Ustawienia → Język: Русский', () => {
  test('na liście „Русский” obok „Українська”; wybór zapisuje się, ekran ustawień po rosyjsku', async () => {
    await renderApp(); await go('/more/language'); await flushAll(5);
    expect(screen.getByText('Русский')).toBeTruthy(); expect(screen.getByText('Українська')).toBeTruthy();
    await tap(screen.getByText(LANG_NAME.ru)); await flushAll(10);
    expect([S().settings.language, lang()]).toEqual(['ru', 'ru']);
    await go('/more/settings'); await flushAll(5);
    expect(screen.getByText('Экран не гаснет во время тренировки')).toBeTruthy(); expect(screen.queryByText('Ekran włączony podczas treningu')).toBeNull();
    expect(screen.getByText('Русский')).toBeTruthy();
    expect(plLeft('ru')).toEqual([]);
  });
});

describe('dane: ustawienie języka przeżywa restart, migrację i kopię', () => {
  test('ru: ponowne uruchomienie, migrate(), eksport → import', async () => {
    await renderApp(); S().settings.language = 'ru'; store.save(); await flushAll(5);
    const saved = JSON.parse(JSON.stringify(S()));
    await renderApp({ saved }); await flushAll(5);
    expect([S().settings.language, lang()]).toEqual(['ru', 'ru']);
    expect(store.migrate(JSON.parse(JSON.stringify(saved))).settings.language).toBe('ru');
    expect(parseBackup(JSON.stringify(buildBackup())).settings.language).toBe('ru');
  });
});

describe('„Jak w telefonie”: telefon po rosyjsku z różnych regionów i telefon ukraiński', () => {
  test.each([['ru', 'ru', 'ru-RU'], ['ru', 'ru', 'ru-KZ'], ['ru', 'ru', 'ru-UA'], ['ru', 'ru', 'ru-BY'], ['uk', 'uk', 'uk-UA']] as const)('%s na telefonie %s / %s (start aplikacji): ekran Treningu i zakładki w tym języku, bez tekstów po polsku', async (l, code, tag) => {
    const s = seedWithDemo(l); s.settings.language = 'auto';
    await renderApp({ saved: s, code, tag }); await flushAll(10);
    expect(lang()).toBe(l);
    for (const k of ['Trening', 'Szablony', 'Ćwiczenia', 'Kalendarz', 'Więcej']) expect([k, screen.getAllByText(t(k)).length > 0]).toEqual([k, true]);
    expect(plLeft(l)).toEqual([]);
    /* ukraiński telefon: żadnego tekstu z rosyjskimi literami; rosyjski: żadnego z ukraińskimi */
    const bad = l === 'uk' ? /[ыэъё]/ : /[іїєґ’]/;
    expect(shown().filter(x => bad.test(x))).toEqual([]);
  });

  test.each(['/', '/more/settings'] as const)('ru, szerokość 320 pt, skala tekstu 2,0: %s (trening w toku / ustawienia) po rosyjsku, bez błędów Reacta i bez polskich tekstów', async url => {
    jest.spyOn(RN.PixelRatio, 'getFontScale').mockReturnValue(2);
    const dims = RN.Dimensions.get; jest.spyOn(RN.Dimensions, 'get').mockImplementation(((k: 'window' | 'screen') => ({ ...dims(k), fontScale: 2 })) as never);
    const errs: string[] = []; jest.spyOn(console, 'error').mockImplementation((...a: unknown[]) => { const m = String(a[0]); if (!/not wrapped in act/.test(m)) errs.push(m.slice(0, 200)); });
    try {
      const s = seedWithDemo('ru'); s.settings.language = 'ru';
      await renderApp({ saved: s, width: 320 }); await flushAll(10);
      if (url === '/') { store.startFromTemplate(S().templates[0]); await go('/'); await flushAll(10); expect(screen.getAllByText(/Подход|подход/).length).toBeGreaterThan(0); }
      else { await go(url); await flushAll(10); expect(screen.getByText('Оформление')).toBeTruthy(); }
      expect(plLeft('ru')).toEqual([]);
      expect(errs).toEqual([]);
    } finally { jest.restoreAllMocks(); }
  });
});

describe('ekran ćwiczenia: sekcja „Техника” po rosyjsku', () => {
  test('ru: przycisk „Техника”, wskazówki z lib/cues/text/ru.json, nagłówek „Частые ошибки”', async () => {
    await renderApp(); S().settings.language = 'ru'; store.applyPrefs(); await flushAll(5);
    const ex = S().exercises.find(e => e.lib && e.libKey === 'Back Squat')!;
    const { router } = require('expo-router'); const { act } = require('./app');
    await act(async () => { router.push(`/exercise/${ex.id}`); }); await flushAll();
    await tap(screen.getByRole('button', { name: 'Техника' }));
    expect(screen.getByText(`• ${cueText(CUE_DATA.exercises['Back Squat'].setup[0].c, 'ru')}`)).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Частые ошибки' })).toBeTruthy();
    expect(screen.getByText(/Back Squat/)).toBeTruthy(); /* nazwa ćwiczenia z biblioteki — po angielsku, jak w innych językach */
  });
});
