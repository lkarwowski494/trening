/*
 * Tryb cichy — wskazówka przy dźwięku (decyzja właściciela 23.10.2026, wariant A; docs/18, docs/47 Test D).
 * Zachowanie systemu zostaje (w trybie cichym iPhone tylko wibruje); pod przełącznikiem „Dźwięk na koniec przerwy” jest krótka linia (SwitchRow.detail,
 * docs/32 wzorzec 11 i 27). Rodzaje (docs/20): ekran (PL, EN, miejsce, VoiceOver), języki (wszystkie słowniki mają klucz), niezmiennik (długość ≤ 100, jedno miejsce tekstu).
 */
import * as store from '@/lib/store';
import { applyLang, LANGS } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';
import { EN } from '@/lib/i18n.en';
import { fresh, saved } from './helpers';
import { renderApp, flushAll, screen, act } from './app';

jest.setTimeout(60000);
const PL = 'W trybie cichym telefon tylko wibruje', EN_TXT = 'In silent mode the phone only vibrates';
const boot = async (locale: 'pl' | 'en') => {
  await fresh(undefined, locale); store.save(); await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url: '/more/settings' }); await flushAll(10);
};
afterEach(() => applyLang('pl'));

describe('Ustawienia: wskazówka o trybie cichym pod dźwiękiem', () => {
  test('PL: linia pod przełącznikiem „Dźwięk na koniec przerwy” (jedna, pod dźwiękiem, nie pod „Wibracje”), podpowiedź VoiceOver', async () => {
    await boot('pl');
    expect(screen.getAllByText(PL)).toHaveLength(1);
    const sw = screen.getByLabelText('Dźwięk na koniec przerwy');
    expect(sw.props.accessibilityHint).toBe(PL); expect(sw.props.accessibilityRole).toBe('switch');
    expect(screen.getByLabelText('Wibracje').props.accessibilityHint).not.toBe(PL);
  });
  test('EN: ten sam wiersz po angielsku', async () => {
    await boot('en');
    expect(screen.getAllByText(EN_TXT)).toHaveLength(1);
    expect(screen.getByLabelText('Sound at the end of rest').props.accessibilityHint).toBe(EN_TXT);
    expect(screen.queryByText(PL)).toBeNull();
  });
});

describe('Wskazówka o trybie cichym: słownik', () => {
  test('EN ma tłumaczenie, krótkie (≤ 100 znaków, docs/32 wzorzec 27), bez nazw innych aplikacji', () => {
    expect(EN[PL]).toBe(EN_TXT); expect(PL.length).toBeLessThanOrEqual(100); expect(EN_TXT.length).toBeLessThanOrEqual(100);
  });
  test.each(LANGS.filter(l => l !== 'pl' && l !== 'en'))('słownik %s ma niepusty klucz', l => {
    expect((LOCALES[l]?.[PL] ?? '').trim()).not.toBe('');
  });
});
