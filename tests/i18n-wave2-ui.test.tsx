/*
 * Fala 2 nowych języków (docs/16 „Fala 2”, 09.10.2026) — ekran, scenariusz i dane: id, ms, vi na liście języków (nazwy w danym języku), wybór
 * zmienia teksty i przeżywa ponowne uruchomienie, migrację i kopię; „Jak w telefonie” na telefonie id-ID / ms-MY / vi-VN; ekran ćwiczenia
 * z sekcją „Technika” po wietnamsku; trening w toku na 320 pt przy skali tekstu 2,0 (200 %) bez polskich tekstów i błędów.
 * Wszystkie trasy × LANGS: tests/matrix-dim-langs-routes.test.tsx; szerokości 320 pt / 200 %: tests/matrix-i18n.test.tsx (nowe kody wchodzą same).
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
const W2 = ['id', 'ms', 'vi'] as const;

describe('Ustawienia → Język: id, ms, vi', () => {
  test.each([
    ['id', 'Layar tetap menyala saat latihan'], ['ms', 'Skrin kekal hidup semasa latihan'], ['vi', 'Giữ màn hình bật khi tập'],
  ] as const)('%s: na liście nazwa w danym języku; wybór zapisuje się, ekran ustawień po tym języku', async (l, keepScreen) => {
    await renderApp(); await go('/more/language'); await flushAll(5);
    for (const x of W2) expect(screen.getByText(LANG_NAME[x])).toBeTruthy();
    await tap(screen.getByText(LANG_NAME[l])); await flushAll(10);
    expect([S().settings.language, lang()]).toEqual([l, l]);
    await go('/more/settings'); await flushAll(5);
    expect(screen.getByText(keepScreen)).toBeTruthy(); expect(screen.queryByText('Ekran włączony podczas treningu')).toBeNull();
    expect(screen.getByText(LANG_NAME[l])).toBeTruthy();
  });
});

describe('dane: ustawienie języka przeżywa restart, migrację i kopię', () => {
  test.each([...W2])('%s: ponowne uruchomienie, migrate(), eksport → import', async l => {
    await renderApp(); S().settings.language = l; store.save(); await flushAll(5);
    const saved = JSON.parse(JSON.stringify(S()));
    await renderApp({ saved }); await flushAll(5);
    expect([S().settings.language, lang()]).toEqual([l, l]);
    expect(store.migrate(JSON.parse(JSON.stringify(saved))).settings.language).toBe(l);
    expect(parseBackup(JSON.stringify(buildBackup())).settings.language).toBe(l);
  });
});

describe('„Jak w telefonie”: telefon z Indonezji, Malezji, Wietnamu', () => {
  /** Teksty na ekranie, które są polskim kluczem z tłumaczeniem w języku `l` (powinny być przetłumaczone). */
  const plLeft = (l: Lang) => { const d = LOCALES[l]!; return screen.UNSAFE_root.findAll((x: { type: unknown; props: { children?: unknown } }) => x.type === 'Text' && typeof x.props.children === 'string').map((x: { props: { children?: unknown } }) => String(x.props.children)).filter(s => Object.prototype.hasOwnProperty.call(d, s) && d[s] !== s); };
  test.each([['id', 'id', 'id-ID'], ['ms', 'ms', 'ms-MY'], ['vi', 'vi', 'vi-VN'], ['id', 'in', 'in-ID'] /* przestarzały kod CLDR */] as const)('%s na telefonie %s / %s (start aplikacji): ekran Treningu i zakładki w tym języku, bez tekstów po polsku', async (l, code, tag) => {
    const s = seedWithDemo(l); s.settings.language = 'auto';
    await renderApp({ saved: s, code, tag }); await flushAll(10);
    expect(lang()).toBe(l);
    for (const k of ['Trening', 'Szablony', 'Ćwiczenia', 'Kalendarz', 'Więcej']) expect([k, screen.getAllByText(t(k)).length > 0]).toEqual([k, true]);
    expect(plLeft(l)).toEqual([]);
  });

  test('vi, szerokość 320 pt, skala tekstu 2,0: trening w toku (karta, serie) po wietnamsku, bez błędów Reacta i bez polskich tekstów', async () => {
    jest.spyOn(RN.PixelRatio, 'getFontScale').mockReturnValue(2);
    const dims = RN.Dimensions.get; jest.spyOn(RN.Dimensions, 'get').mockImplementation(((k: 'window' | 'screen') => ({ ...dims(k), fontScale: 2 })) as never);
    const errs: string[] = []; jest.spyOn(console, 'error').mockImplementation((...a: unknown[]) => { const m = String(a[0]); if (!/not wrapped in act/.test(m)) errs.push(m.slice(0, 200)); });
    try {
      const s = seedWithDemo('vi'); s.settings.language = 'vi';
      await renderApp({ saved: s, width: 320 }); await flushAll(10);
      store.startFromTemplate(S().templates[0]); await go('/'); await flushAll(10);
      expect(screen.getAllByText(/Hiệp|hiệp/).length).toBeGreaterThan(0);
      expect(plLeft('vi')).toEqual([]);
      expect(errs).toEqual([]);
    } finally { jest.restoreAllMocks(); }
  });
});

describe('ekran ćwiczenia: sekcja „Technika” po wietnamsku', () => {
  test('vi: przycisk „Kỹ thuật”, wskazówki z lib/cues/text/vi.json, nagłówki sekcji po wietnamsku', async () => {
    await renderApp(); S().settings.language = 'vi'; store.applyPrefs(); await flushAll(5);
    const ex = S().exercises.find(e => e.lib && e.libKey === 'Back Squat')!;
    const { router } = require('expo-router'); const { act } = require('./app');
    await act(async () => { router.push(`/exercise/${ex.id}`); }); await flushAll();
    await tap(screen.getByRole('button', { name: 'Kỹ thuật' }));
    expect(screen.getByText(`• ${cueText(CUE_DATA.exercises['Back Squat'].setup[0].c, 'vi')}`)).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Lỗi thường gặp' })).toBeTruthy();
  });
});
