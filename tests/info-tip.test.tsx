/*
 * Wzorzec „ⓘ” (docs/32 wzorzec 27; decyzje właściciela 14.10.2026: rozwinięcie w miejscu, stan rozwinięcia nie jest zapamiętywany, etykieta VoiceOver
 * „Więcej informacji: {nagłówek}”). Rodzaje testów (docs/20): komponent (zwinięty / rozwinięty, expanded, etykieta, podpowiedź, język VoiceOver, pole dotyku),
 * wygląd (jasny / ciemny), języki (PL / EN), układ wąski (320 pt: zawijanie, brak ucinania) i Dynamic Type (limity powiększenia), niezmiennik „nic nie pamięta”.
 */
import React from 'react';
import * as RN from 'react-native';
import { Appearance } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { InfoTip, INFO_SIZE, INFO_HIT_SLOP, INFO_GLYPH_SCALE_MAX, infoTestId, infoTextTestId } from '@/components/InfoTip';
import { SectionTitle, H2, Field, SwitchRow } from '@/components/ui';
import { light, dark, TEXT_SCALE_MAX } from '@/lib/theme';
import { applyLang } from '@/lib/i18n';

let scheme: 'light' | 'dark' = 'light';
beforeEach(() => {
  jest.spyOn(Appearance, 'setColorScheme').mockImplementation(((v: string | null | undefined) => { scheme = v === 'dark' ? 'dark' : 'light'; }) as never);
  jest.spyOn(RN, 'useColorScheme').mockImplementation((() => scheme) as never);
});
afterEach(() => { jest.restoreAllMocks(); scheme = 'light'; applyLang('pl'); });

const flat = (st: unknown): Record<string, any> => Object.assign({}, ...[st].flat(Infinity as 1).filter(Boolean) as object[]);
const TEXT = 'Objaśnienie — kolor względem partii z największą liczbą serii (uproszczenie).';
const ui = (props: Partial<React.ComponentProps<typeof InfoTip>> = {}) => <InfoTip id="demo" label="Ten tydzień" info={TEXT} {...props}><RN.Text>Ten tydzień</RN.Text></InfoTip>;

describe('InfoTip: zwinięty i rozwinięty', () => {
  test('na starcie zwinięty: bez tekstu objaśnienia, przycisk ma expanded = false', () => {
    const r = render(ui());
    expect(r.queryByText(TEXT)).toBeNull(); expect(r.queryByTestId(infoTextTestId('demo'))).toBeNull();
    expect(r.getByTestId(infoTestId('demo')).props.accessibilityState).toEqual({ expanded: false });
  });
  test('stuknięcie rozwija w miejscu (tekst pod nagłówkiem, expanded = true), drugie stuknięcie zwija', () => {
    const r = render(ui());
    fireEvent.press(r.getByTestId(infoTestId('demo')));
    expect(r.getByText(TEXT)).toBeTruthy(); expect(r.getByTestId(infoTextTestId('demo'))).toBeTruthy();
    expect(r.getByTestId(infoTestId('demo')).props.accessibilityState).toEqual({ expanded: true });
    fireEvent.press(r.getByTestId(infoTestId('demo')));
    expect(r.queryByText(TEXT)).toBeNull(); expect(r.getByTestId(infoTestId('demo')).props.accessibilityState).toEqual({ expanded: false });
  });
  test('tekst objaśnienia jest następnym elementem po przycisku (kolejność czytania VoiceOver)', () => {
    const r = render(ui()); fireEvent.press(r.getByTestId(infoTestId('demo')));
    const order: string[] = []; const walk = (n: any) => { if (!n) return; if (n.props?.testID === infoTestId('demo')) order.push('button'); if (n.props?.testID === infoTextTestId('demo')) order.push('text'); (n.children ?? []).forEach((c: any) => typeof c === 'object' && walk(c)); };
    walk(r.toJSON());
    expect(order).toEqual(['button', 'text']);
  });
  test('wiele akapitów (tablica) — każdy jako osobny tekst', () => {
    const r = render(ui({ info: ['Akapit pierwszy.', 'Akapit drugi.'] })); fireEvent.press(r.getByTestId(infoTestId('demo')));
    expect(r.getByText('Akapit pierwszy.')).toBeTruthy(); expect(r.getByText('Akapit drugi.')).toBeTruthy();
  });
  test('stan rozwinięcia nie jest zapamiętywany: po odmontowaniu i ponownym wejściu znów zwinięty (decyzja P4 A)', () => {
    const a = render(ui()); fireEvent.press(a.getByTestId(infoTestId('demo'))); expect(a.getByText(TEXT)).toBeTruthy(); a.unmount();
    const b = render(ui()); expect(b.queryByText(TEXT)).toBeNull(); expect(b.getByTestId(infoTestId('demo')).props.accessibilityState).toEqual({ expanded: false });
  });
  test('nic nie jest ogłaszane automatycznie (bez accessibilityLiveRegion)', () => {
    const r = render(ui()); fireEvent.press(r.getByTestId(infoTestId('demo')));
    expect(JSON.stringify(r.toJSON())).not.toContain('accessibilityLiveRegion');
  });
});

describe('InfoTip: VoiceOver', () => {
  test('rola button, stała etykieta „Więcej informacji: {nagłówek}” (też po rozwinięciu), podpowiedź, język', () => {
    const r = render(ui()); const b = r.getByTestId(infoTestId('demo'));
    expect(b.props.accessibilityRole).toBe('button'); expect(b.props.accessibilityLabel).toBe('Więcej informacji: Ten tydzień');
    expect(b.props.accessibilityHint).toBe('Pokazuje objaśnienie pod nagłówkiem.'); expect(b.props.accessibilityLanguage).toBe('pl');
    fireEvent.press(b); expect(r.getByTestId(infoTestId('demo')).props.accessibilityLabel).toBe('Więcej informacji: Ten tydzień');
  });
  test('angielski: „More information: …”, język VoiceOver en', () => {
    applyLang('en'); const r = render(ui({ label: 'This week' })); const b = r.getByTestId(infoTestId('demo'));
    expect(b.props.accessibilityLabel).toBe('More information: This week'); expect(b.props.accessibilityHint).toBe('Shows the explanation under the heading.'); expect(b.props.accessibilityLanguage).toBe('en');
  });
  test('litera „i” w kółku jest ukryta przed VoiceOver (czyta etykieta przycisku)', () => {
    const r = render(ui()); const g = r.getByText('i', { includeHiddenElements: true }); expect(g.props.importantForAccessibility).toBe('no'); expect(g.props.accessibilityElementsHidden).toBe(true);
  });
});

describe('InfoTip: pole dotyku, układ wąski i Dynamic Type', () => {
  test('pole dotyku ≥ 44 pt: rozmiar kółka + hitSlop z obu stron', () => {
    expect(INFO_SIZE + 2 * INFO_HIT_SLOP).toBeGreaterThanOrEqual(44);
    const b = render(ui()).getByTestId(infoTestId('demo')); const st = flat(b.props.style);
    expect(b.props.hitSlop).toBe(INFO_HIT_SLOP); expect(st.width).toBe(INFO_SIZE); expect(st.height).toBe(INFO_SIZE);
  });
  test('320 pt: wiersz nagłówka zawija (flexWrap), nagłówek może się zwężać (flexShrink), kółko nigdy się nie ściska', () => {
    const r = render(ui()); const row = r.getByTestId('info-row-demo'); expect(flat(row.props.style).flexWrap).toBe('wrap');
    expect(flat(r.getByTestId('info-head-demo').props.style).flexShrink).toBe(1); expect(flat(r.getByTestId(infoTestId('demo')).props.style).flexShrink).toBe(0);
  });
  test('Dynamic Type: znak „i” ma niski limit powiększenia, rozwinięty tekst rośnie do TEXT_SCALE_MAX i nie jest ucinany', () => {
    const r = render(ui()); expect(r.getByText('i', { includeHiddenElements: true }).props.maxFontSizeMultiplier).toBe(INFO_GLYPH_SCALE_MAX); expect(INFO_GLYPH_SCALE_MAX).toBeLessThanOrEqual(1.3);
    fireEvent.press(r.getByTestId(infoTestId('demo'))); const tx = r.getByText(TEXT);
    expect(tx.props.maxFontSizeMultiplier).toBe(TEXT_SCALE_MAX); expect(tx.props.numberOfLines).toBeUndefined();
  });
});

describe('InfoTip: jasny i ciemny wygląd — tylko kolory motywu', () => {
  test.each([['light', light], ['dark', dark]] as const)('%s: zwinięty — obrys i znak muted; rozwinięty — accent; ramka tekstu surface2', (name, th) => {
    scheme = name; const r = render(ui());
    let b = flat(r.getByTestId(infoTestId('demo')).props.style); expect(b.borderColor).toBe(th.muted); expect(flat(r.getByText('i', { includeHiddenElements: true }).props.style).color).toBe(th.muted);
    fireEvent.press(r.getByTestId(infoTestId('demo')));
    b = flat(r.getByTestId(infoTestId('demo')).props.style); expect(b.borderColor).toBe(th.accent); expect(flat(r.getByText('i', { includeHiddenElements: true }).props.style).color).toBe(th.accent);
    expect(flat(r.getByTestId(infoTextTestId('demo')).props.style).backgroundColor).toBe(th.surface2); expect(flat(r.getByText(TEXT).props.style).color).toBe(th.muted);
  });
});

describe('SectionTitle / H2 z parametrem info', () => {
  test('SectionTitle: nagłówek jako header, ⓘ z etykietą od tekstu nagłówka, objaśnienie po stuknięciu', () => {
    const r = render(<SectionTitle info={TEXT} infoId="sec">Ten tydzień</SectionTitle>);
    expect(r.getByRole('header')).toBeTruthy(); expect(r.getByTestId(infoTestId('sec')).props.accessibilityLabel).toBe('Więcej informacji: Ten tydzień');
    expect(r.queryByText(TEXT)).toBeNull(); fireEvent.press(r.getByTestId(infoTestId('sec'))); expect(r.getByText(TEXT)).toBeTruthy();
  });
  test('H2: to samo; bez info — brak przycisku (nagłówki bez objaśnienia się nie zmieniają)', () => {
    const a = render(<H2 info={TEXT} infoId="h2">Cel</H2>); expect(a.getByTestId(infoTestId('h2')).props.accessibilityLabel).toBe('Więcej informacji: Cel');
    const b = render(<H2>Cel</H2>); expect(b.queryByTestId(infoTestId('h2'))).toBeNull(); expect(b.queryByText('i', { includeHiddenElements: true })).toBeNull();
    const c = render(<SectionTitle>Cel</SectionTitle>); expect(c.queryByText('i', { includeHiddenElements: true })).toBeNull();
  });
  test('uporządkowany nagłówek wersalikami: etykieta ⓘ używa zwykłego zapisu (nie wersalików)', () => {
    applyLang('el'); const r = render(<SectionTitle info="x" infoId="el">Αυτή την εβδομάδα</SectionTitle>);
    expect(r.getByTestId(infoTestId('el')).props.accessibilityLabel).toContain('Αυτή την εβδομάδα');
  });
});

describe('Field i SwitchRow z parametrem info', () => {
  test('Field: ⓘ przy etykiecie pola, etykieta VoiceOver z nazwy pola; objaśnienie po stuknięciu; pole nadal w kontekście etykiety', () => {
    const r = render(<Field label="Widok treningu" info={TEXT} infoId="fld"><RN.TextInput accessibilityLabel="x" /></Field>);
    expect(r.getByTestId(infoTestId('fld')).props.accessibilityLabel).toBe('Więcej informacji: Widok treningu'); expect(r.queryByText(TEXT)).toBeNull();
    fireEvent.press(r.getByTestId(infoTestId('fld'))); expect(r.getByText(TEXT)).toBeTruthy(); expect(r.getByLabelText('x')).toBeTruthy();
    expect(render(<Field label="Widok treningu"><RN.Text>a</RN.Text></Field>).queryByText('i', { includeHiddenElements: true })).toBeNull(); /* bez info — bez ⓘ */
  });
  test('SwitchRow: krótki opis na wierzchu (jest też podpowiedzią VoiceOver przełącznika), pełny pod ⓘ; stuknięcie ⓘ nie przełącza przełącznika; rozwinięcie pod całym wierszem', () => {
    const onChange = jest.fn();
    const r = render(<SwitchRow label="Głos" detail="Krótko." value={false} onChange={onChange} info={TEXT} infoId="sw" />);
    expect(r.getByText('Krótko.')).toBeTruthy(); expect(r.getByLabelText('Głos').props.accessibilityHint).toBe('Krótko.'); expect(r.queryByText(TEXT)).toBeNull();
    expect(r.getByTestId(infoTestId('sw')).props.accessibilityLabel).toBe('Więcej informacji: Głos');
    fireEvent.press(r.getByTestId(infoTestId('sw'))); expect(r.getByText(TEXT)).toBeTruthy(); expect(onChange).not.toHaveBeenCalled(); expect(r.getByTestId(infoTestId('sw')).props.accessibilityState).toEqual({ expanded: true });
    const sw = r.getByLabelText('Głos'); fireEvent(sw, 'valueChange', true); expect(onChange).toHaveBeenCalledWith(true);
  });
  test('SwitchRow bez info — bez zmian (brak ⓘ)', () => { const r = render(<SwitchRow label="Głos" value={false} onChange={() => {}} />); expect(r.queryByTestId(infoTestId('sw'))).toBeNull(); expect(r.queryByText('i', { includeHiddenElements: true })).toBeNull(); });
});
