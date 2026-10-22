/*
 * M3 p5d — ekran Ustawień, ZM-07: dwa przełączniki „Dźwięk na koniec przerwy” i „Wibracje” zamiast jednego „Dźwięk i wibracja na koniec przerwy”.
 * Rodzaje (docs/20): ekran (oba przełączniki, VoiceOver, brak starego), scenariusz (przełączenia niezależne od siebie, trwałość po restarcie), języki (PL, EN, wszystkie
 * słowniki), wąski ekran (segmenty bez zawijania — przełączniki i segmenty Ustawień przy 390 pt w pl/en), ⓘ zapowiedzi odsyła do „Dźwięk…”, Przewodnik.
 * Logika, migracja, kopia: tests/m3-p5d-haptics.test.ts.
 */
import * as store from '@/lib/store';
import { applyLang, LANGS } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';
import { EN } from '@/lib/i18n.en';
import { GUIDE } from '@/lib/guide';
import { hapticsOn } from '@/lib/haptics';
import { fireEvent } from '@testing-library/react-native';
import * as RN from 'react-native';
import { StyleSheet } from 'react-native';
import { fresh, saved } from './helpers';
import { renderApp, flushAll, screen, act, openInfo } from './app';

jest.setTimeout(60000);
const S = () => store.getState().settings;
const SOUND = 'Dźwięk na koniec przerwy', HAPT = 'Wibracje', OLD = 'Dźwięk i wibracja na koniec przerwy';
const boot = async (locale: 'pl' | 'en' = 'pl', fn: () => void = () => {}, width?: number) => {
  /* domyślne okno Jest to 750 pt i fontScale 2 (układ „powiększony tekst”); wąski ekran = prawdziwy iPhone: podana szerokość, tekst 100% */
  if (width) { const win = { width, height: 844, scale: 3, fontScale: 1 }; jest.spyOn(RN.Dimensions, 'get').mockImplementation(((k: string) => (k === 'window' ? win : { ...win })) as never); }
  await fresh(undefined, locale); fn(); store.save(); await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url: '/more/settings', ...(width ? { width } : {}) }); await flushAll(10);
};
const toggle = async (label: string, v: boolean) => { await act(async () => { fireEvent(screen.getByLabelText(label), 'valueChange', v); }); await flushAll(5); };
const checked = (label: string) => screen.getByLabelText(label).props.accessibilityState.checked as boolean;
afterEach(() => { applyLang('pl'); jest.restoreAllMocks(); });

describe('Ustawienia: dwa przełączniki zamiast jednego', () => {
  test('są „Dźwięk na koniec przerwy” i „Wibracje” (rola switch, stan), nie ma dawnego „Dźwięk i wibracja…”', async () => {
    await boot();
    const sw = screen.getAllByRole('switch'); const names = sw.map(x => x.props.accessibilityLabel);
    expect(names).toEqual(expect.arrayContaining([SOUND, HAPT])); expect(names).not.toContain(OLD); expect(screen.queryByText(OLD)).toBeNull();
    expect(names.indexOf(HAPT)).toBe(names.indexOf(SOUND) + 1); /* sąsiednie wiersze: dźwięk, potem wibracje */
    for (const l of [SOUND, HAPT]) { expect(screen.getByLabelText(l).props.accessibilityRole).toBe('switch'); expect(typeof screen.getByLabelText(l).props.accessibilityState.checked).toBe('boolean'); expect(screen.getByTestId('sw-' + l)).toBeTruthy(); }
  });
  test('nowa instalacja i dane bez pola: oba włączone; dane z wyłączonym dźwiękiem (bez pola haptics): oba wyłączone — nic się nie zmienia po aktualizacji', async () => {
    await boot(); expect([checked(SOUND), checked(HAPT)]).toEqual([true, true]); expect(hapticsOn()).toBe(true);
    await boot('pl', () => { S().sound = false; delete S().haptics; }); expect([checked(SOUND), checked(HAPT)]).toEqual([false, false]); expect(hapticsOn()).toBe(false);
  });
  test('przełączniki są niezależne: „Wibracje” nie rusza dźwięku, „Dźwięk” nie rusza wibracji (po pierwszym świadomym wyborze)', async () => {
    await boot();
    await toggle(HAPT, false); expect([S().sound, S().haptics]).toEqual([true, false]); expect([checked(SOUND), checked(HAPT)]).toEqual([true, false]); expect(hapticsOn()).toBe(false);
    await toggle(SOUND, false); expect([S().sound, S().haptics]).toEqual([false, false]); expect([checked(SOUND), checked(HAPT)]).toEqual([false, false]);
    await toggle(HAPT, true); expect([S().sound, S().haptics]).toEqual([false, true]); expect([checked(SOUND), checked(HAPT)]).toEqual([false, true]); expect(hapticsOn()).toBe(true);
    await toggle(SOUND, true); expect([S().sound, S().haptics]).toEqual([true, true]);
  });
  test('pierwsze przełączenie „Dźwięku” przy braku pola `haptics` utrwala dotychczasowy stan wibracji (nie przełącza ich po cichu)', async () => {
    await boot(); expect('haptics' in S()).toBe(false);
    await toggle(SOUND, false); expect(S().sound).toBe(false); expect(S().haptics).toBe(true); expect([checked(SOUND), checked(HAPT)]).toEqual([false, true]); expect(hapticsOn()).toBe(true);
    await boot('pl', () => { S().sound = false; delete S().haptics; }); await toggle(SOUND, true); expect(S().haptics).toBe(false); expect([checked(SOUND), checked(HAPT)]).toEqual([true, false]);
  });
  test('wybór jest trwały: restart aplikacji pokazuje ten sam stan obu przełączników', async () => {
    await boot(); await toggle(HAPT, false); await toggle(SOUND, true); await act(async () => { await store.flush(); });
    const st = JSON.parse(JSON.stringify(saved())); await fresh(st); expect([S().sound, S().haptics, hapticsOn()]).toEqual([true, false, false]);
    await renderApp({ saved: st, url: '/more/settings' }); await flushAll(10); expect([checked(SOUND), checked(HAPT)]).toEqual([true, false]);
  });
  test('ⓘ „Zapowiedzi głosowe” odsyła do „Dźwięk na koniec przerwy”, nie do dawnego przełącznika', async () => {
    await boot(); await openInfo('voice-mode');
    expect(screen.getByText('Zapowiedzi działają, gdy włączony jest „Dźwięk na koniec przerwy”. To samo ustawienie zmienisz w menu „⋯” na ekranie treningu.')).toBeTruthy();
    expect(screen.queryByText(/Dźwięk i wibracja/)).toBeNull();
  });
});

describe('języki: etykiety obu przełączników', () => {
  test('EN: „Sound at the end of rest” i „Haptics”; wszystkie słowniki mają oba klucze, a dawnego klucza już nie ma', async () => {
    expect(EN[SOUND]).toBe('Sound at the end of rest'); expect(EN[HAPT]).toBe('Haptics'); expect(EN[OLD]).toBeUndefined();
    await boot('en'); expect(screen.getByLabelText('Sound at the end of rest').props.accessibilityRole).toBe('switch'); expect(screen.getByLabelText('Haptics').props.accessibilityRole).toBe('switch');
    expect(screen.getByTestId('sw-Sound at the end of rest')).toBeTruthy(); expect(screen.getByTestId('sw-Haptics')).toBeTruthy();
    for (const l of LANGS.filter(x => x !== 'pl' && x !== 'en')) {
      const d = (LOCALES as Record<string, Record<string, string>>)[l];
      expect([l, typeof d[SOUND] === 'string' && d[SOUND].length > 0, typeof d[HAPT] === 'string' && d[HAPT].length > 0, d[OLD]]).toEqual([l, true, true, undefined]);
    }
  });
});

describe('Przewodnik: zdanie o osobnych przełącznikach', () => {
  test('temat „Trening i serie” mówi, że dźwięk i wibracje włącza się osobno (cytaty = etykiety z Ustawień)', () => {
    const steps = GUIDE.find(g => g.id === 'workout')!.steps(); const s = steps.find(x => x.includes(HAPT));
    expect(s).toBe('Więcej → Ustawienia: „Dźwięk na koniec przerwy” i „Wibracje” włączasz osobno.'); expect(steps.length).toBeLessThanOrEqual(5);
  });
});

describe('wąski ekran: segmenty Ustawień bez zawijania etykiet (decyzja właściciela 21.10.2026)', () => {
  const groups = () => screen.UNSAFE_root.findAll((n: { type: unknown; props: Record<string, unknown> }) => n.type === 'View' && n.props.accessibilityRole === 'radiogroup');
  const dirOf = (g: { props: { style?: unknown } }) => (StyleSheet.flatten(g.props.style as never) as { flexDirection?: string }).flexDirection;
  test.each(['pl', 'en'] as const)('%s przy 390 pt: każdy segment w jednym rzędzie, każda etykieta w jednej linii (krój się zmniejsza zamiast zawijać)', async locale => {
    await boot(locale, () => {}, 390);
    const gs = groups(); expect(gs.length).toBeGreaterThanOrEqual(4); /* Wygląd, System miar, Widok treningu, Zapowiedzi głosowe (+ Skala wysiłku po włączeniu RPE) */
    for (const g of gs) {
      expect([g.props.accessibilityLabel, dirOf(g)]).toEqual([g.props.accessibilityLabel, 'row']);
      const texts = g.findAll((n: { type: unknown; props: Record<string, unknown> }) => n.type === 'Text' && typeof n.props.children === 'string');
      expect(texts.length).toBeGreaterThan(1);
      for (const tx of texts) expect([g.props.accessibilityLabel, tx.props.children, tx.props.numberOfLines]).toEqual([g.props.accessibilityLabel, tx.props.children, 1]);
    }
  });
  test('pl przy 320 pt: segmenty, których etykiety by się nie zmieściły, układają się jedna pod drugą (bez ucinania i zawijania), krótkie zostają w rzędzie', async () => {
    await boot('pl', () => {}, 320);
    const by = (label: string) => groups().find(g => g.props.accessibilityLabel === label)!;
    expect(dirOf(by('System miar'))).toBe('column'); expect(dirOf(by('Zapowiedzi głosowe'))).toBe('column'); expect(dirOf(by('Widok treningu'))).toBe('row');
    for (const label of ['System miar', 'Zapowiedzi głosowe']) for (const tx of by(label).findAll((n: { type: unknown; props: Record<string, unknown> }) => n.type === 'Text' && typeof n.props.children === 'string')) expect(tx.props.numberOfLines).toBeUndefined();
    expect(screen.getByTestId('unit-system-lb').props.accessibilityState.selected).toBe(false); /* opcje dalej działają jako przyciski z testID */
  });
});
