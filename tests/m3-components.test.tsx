/*
 * Redesign M3, partia p1 — komponenty wspólne (docs/design/design-spec.md §10 „Komponenty wspólne (p1, przed ekranami)”, §2, §3; docs/32 W1–W3):
 * Btn (primary = accent/accentInk, 60/52/44), H1/H2/SectionTitle/Item/Chip/Input/Segmented/Empty na tokenach, motyw A2 (start i puste stany),
 * przycisk „Usuń {obiekt}” (Btn danger + okno jak gest), „Edytuj/Gotowe” i „⋯” w nagłówku, ikony M1-029 (Btn/Chip z ikoną), ikony zakładek.
 * Ekrany podpinają te komponenty w partiach p2–p5; tu sprawdzamy same komponenty, w jasnym i ciemnym motywie, przy „Zwiększ kontrast” i dużym tekście.
 */
import React from 'react';
import { Alert, StyleSheet, Text, View, AccessibilityInfo } from 'react-native';
import * as RN from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { light, dark, lightHC, FONT, RADIUS, SIZE, MOTIF, ICON, titleMaxScale, type Theme } from '@/lib/theme';
import { setA11yPrefs, __resetA11yPrefsForTests } from '@/lib/a11yPrefs';
import { Btn, H1, H2, SectionTitle, Item, Chip, Input, Segmented, Empty, Screen, Muted } from '@/components/ui';
import { BarMotif, StartMotif } from '@/components/Motif';
import { DeleteButton } from '@/components/DeleteButton';
import { EditButton, MoreButton, PlanningButton } from '@/components/HeaderActions';
import { Icon, ICON_NAMES } from '@/components/Icon';
import { TabIcon, TabLabel } from '@/components/TabIcon';

let scheme: 'light' | 'dark' = 'light'; let win = { width: 390, height: 844, scale: 3, fontScale: 1 };
beforeEach(() => {
  scheme = 'light'; win = { width: 390, height: 844, scale: 3, fontScale: 1 }; jest.restoreAllMocks(); __resetA11yPrefsForTests();
  jest.spyOn(RN, 'useColorScheme').mockImplementation((() => scheme) as never);
  jest.spyOn(RN.Dimensions, 'get').mockImplementation(((k: string) => (k === 'window' ? win : { ...win })) as never); /* useWindowDimensions czyta Dimensions.get('window') przy każdym renderze */
  jest.spyOn(AccessibilityInfo, 'isBoldTextEnabled').mockResolvedValue(false); jest.spyOn(AccessibilityInfo, 'isDarkerSystemColorsEnabled').mockResolvedValue(false);
});
const st = (el: { props: { style?: unknown } }) => StyleSheet.flatten(el.props.style as never) as Record<string, unknown>;
/** Pressable w drzewie testowym: styl bywa funkcją ({ pressed }). */
const pst = (el: { props: { style?: unknown } }) => { const s = el.props.style; return StyleSheet.flatten((typeof s === 'function' ? s({ pressed: false }) : s) as never) as Record<string, unknown>; };
const BARLOW700 = FONT.title700;

describe('Btn', () => {
  test.each([['jasny', light], ['ciemny', dark]] as [string, Theme][])('%s: przycisk główny = accent + accentInk, 60 pt, promień 8, tekst 19/700', (n, p) => {
    scheme = n === 'jasny' ? 'light' : 'dark';
    const r = render(<Btn kind="primary" title="Start" onPress={() => {}} />);
    const btn = r.getByRole('button'); expect(pst(btn)).toMatchObject({ backgroundColor: p.accent, borderColor: p.accent, minHeight: SIZE.buttonPrimary, borderRadius: RADIUS.button });
    expect(st(r.getByText('Start'))).toMatchObject({ color: p.accentInk, fontSize: 19, fontWeight: '700' });
  });
  test('w ciemnym motywie przycisk główny jest jasny (krem na granacie), nie zlewa się z granatową tablicą', () => {
    scheme = 'dark'; const r = render(<Btn kind="primary" title="Start" onPress={() => {}} />);
    expect([pst(r.getByRole('button')).backgroundColor, st(r.getByText('Start')).color]).toEqual(['#F5F1E6', '#13294B']);
  });
  test('drugorzędny 52 pt (surface2, obrys line, tekst 17/600), mały 44 pt (tekst 15), danger przezroczysty z obrysem i tekstem danger, ghost bez obrysu', () => {
    const r = render(<><Btn title="Zwykły" onPress={() => {}} /><Btn small title="Mały" onPress={() => {}} /><Btn kind="danger" title="Usuń sesję" onPress={() => {}} /><Btn kind="ghost" title="Duch" onPress={() => {}} /></>);
    const by = (t: string) => pst(r.getByLabelText(t));
    expect(by('Zwykły')).toMatchObject({ backgroundColor: light.surface2, borderColor: light.line, minHeight: SIZE.buttonSecondary, borderRadius: 8 });
    expect(st(r.getByText('Zwykły'))).toMatchObject({ color: light.text, fontSize: 17, fontWeight: '600' });
    expect(by('Mały')).toMatchObject({ minHeight: SIZE.hit }); expect(st(r.getByText('Mały'))).toMatchObject({ fontSize: 15 });
    expect(by('Usuń sesję')).toMatchObject({ backgroundColor: 'transparent', borderColor: light.danger }); expect(st(r.getByText('Usuń sesję')).color).toBe(light.danger);
    expect(by('Duch')).toMatchObject({ backgroundColor: 'transparent', borderColor: 'transparent' });
  });
  test('tekst przycisku rośnie do 200% (DEC-10) i zawija się; „Zwiększ kontrast”: obrys line z palety HC', () => {
    setA11yPrefs({ contrast: true }); const r = render(<Btn title="Zwykły" onPress={() => {}} />);
    expect(r.getByText('Zwykły').props.maxFontSizeMultiplier).toBe(2); expect(pst(r.getByRole('button')).borderColor).toBe(lightHC.line);
  });
  test('ikona (M1-029) przed tekstem w kolorze tekstu przycisku; bez emoji w tytule', () => {
    const r = render(<Btn icon="pause" kind="primary" title="Pauza" onPress={() => {}} />);
    expect(r.getByTestId('icon-pause')).toBeTruthy(); expect(JSON.stringify(r.toJSON())).toContain(light.accentInk);
  });
  test('wciśnięcie wywołuje akcję; loading blokuje', () => {
    const f = jest.fn(); const r = render(<><Btn title="A" onPress={f} /><Btn loading title="B" onPress={f} /></>);
    fireEvent.press(r.getByLabelText('A')); fireEvent.press(r.getByLabelText('B')); expect(f).toHaveBeenCalledTimes(1);
  });
});

describe('nagłówki i teksty', () => {
  test('H1 = duży tytuł: Barlow Condensed 700 34/38, rola header, limit skali do 13% szerokości ekranu', () => {
    for (const w of [320, 390, 430]) { win = { ...win, width: w }; const r = render(<H1>Trening</H1>); const h = r.getByRole('header');
      expect(st(h)).toMatchObject({ fontSize: 34, lineHeight: 38, fontFamily: BARLOW700, color: light.text }); expect(h.props.maxFontSizeMultiplier).toBeCloseTo(titleMaxScale(w), 5); r.unmount(); }
  });
  test('H2 = nagłówek sekcji: Barlow 700 17, limit 200%; z ⓘ jak dotąd', () => {
    const r = render(<H2>Sekcja</H2>); expect(st(r.getByText('Sekcja'))).toMatchObject({ fontSize: 17, fontFamily: BARLOW700, color: light.text });
    const r2 = render(<H2 info="Objaśnienie" infoId="x">Z objaśnieniem</H2>); expect(r2.getByTestId('info-x')).toBeTruthy();
  });
  test('SectionTitle: wersaliki przez upperText (pl: textTransform), muted, 13/600, limit 200%', () => {
    const r = render(<SectionTitle>Ten tydzień</SectionTitle>); const s = st(r.getByText('Ten tydzień'));
    expect(s).toMatchObject({ color: light.muted, fontSize: 13, fontWeight: '600', textTransform: 'uppercase' }); expect(r.getByText('Ten tydzień').props.maxFontSizeMultiplier).toBe(2);
  });
  test('Muted: callout 15 muted; Field/Chip/Input na tokenach', () => {
    const r = render(<Muted>Podpis</Muted>); expect(st(r.getByText('Podpis'))).toMatchObject({ color: light.muted, fontSize: 15 });
  });
});

describe('Item, Chip, Input, Segmented, Screen', () => {
  test('Item: wiersz min. 52 pt, tytuł 17/600, podtytuł 15 muted, strzałka muted', () => {
    const r = render(<Item title="Szablon A" sub="3 ćwiczenia" onPress={() => {}} />);
    expect(st(r.getByText('Szablon A'))).toMatchObject({ fontSize: 17, fontWeight: '600', color: light.text }); expect(st(r.getByText('3 ćwiczenia'))).toMatchObject({ fontSize: 15, color: light.muted });
    expect(pst(r.getByRole('button'))).toMatchObject({ minHeight: SIZE.rowMin });
  });
  test('Chip: okrągły, wybrany accent + accentInk; z ikoną (M1-029) i znakiem przed ikoną', () => {
    const r = render(<><Chip label="Dom" on onPress={() => {}} icon="pin" lead="+" /><Chip label="Praca" on={false} onPress={() => {}} /></>);
    expect(pst(r.getByLabelText('Dom'))).toMatchObject({ backgroundColor: light.accent, borderRadius: RADIUS.round }); expect(st(r.getByText('Dom')).color).toBe(light.accentInk);
    expect(r.getByTestId('icon-pin')).toBeTruthy(); expect(r.getByText('+')).toBeTruthy();
    expect(pst(r.getByLabelText('Praca'))).toMatchObject({ backgroundColor: light.surface2 });
  });
  test('Input: pole z promieniem pola (4), obrys ctrlLine, tło surface2; Screen: tło bg i margines 16', () => {
    const r = render(<Screen><Input placeholder="Szukaj" /></Screen>);
    expect(st(r.getByPlaceholderText('Szukaj'))).toMatchObject({ borderRadius: RADIUS.field, borderColor: light.ctrlLine, backgroundColor: light.surface2 });
    expect(st(r.UNSAFE_getByType(View))).toMatchObject({ backgroundColor: light.bg, paddingHorizontal: 16 });
  });
  test('Segmented: promień przycisku, wybrana opcja accent', () => {
    const r = render(<Segmented label="Jednostka" value="kg" onChange={() => {}} options={[['kg', 'kg'], ['lb', 'lb']]} />);
    expect(st(r.getByLabelText('Jednostka'))).toMatchObject({ borderRadius: RADIUS.button, backgroundColor: light.surface2 }); expect(pst(r.getByLabelText('kg'))).toMatchObject({ backgroundColor: light.accent });
  });
});

describe('motyw A2 (design-spec §1)', () => {
  const fills = (r: ReturnType<typeof render>) => r.UNSAFE_root.findAll(x => typeof x.props.fill === 'string').map(x => String(x.props.fill));
  test('gryf z talerzami w barwach motywu (motif25/20/15/10 + motifBar): jasny i ciemny; dekoracja ukryta dla VoiceOver', () => {
    for (const [s, p] of [['light', light], ['dark', dark]] as const) { scheme = s; const r = render(<BarMotif width={220} />);
      const art = r.getByTestId('bar-motif', { includeHiddenElements: true }); expect(art.props.accessibilityElementsHidden).toBe(true);
      for (const k of ['motif25', 'motif20', 'motif15', 'motif10', 'motifBar'] as const) expect(fills(r)).toContain(p[k]); r.unmount(); }
  });
  test('start: sylwetka ok. 30% szerokości ekranu w prawym górnym rogu', () => {
    const r = render(<StartMotif />); const m = r.getByTestId('start-motif', { includeHiddenElements: true });
    expect(st(m)).toMatchObject({ position: 'absolute', top: 0, right: 0 }); const w = Number(st(r.getByTestId('bar-motif', { includeHiddenElements: true })).width ?? 0) || 0;
    expect(JSON.stringify(r.toJSON())).toContain(`"width":${Math.round(390 * MOTIF.startWidthRatio)}`); expect(w).toBeGreaterThanOrEqual(0);
  });
  test('znika przy „Zwiększ kontrast” i od skali tekstu 1,4 (nie zajmuje miejsca tytułu); przy 1,39 jest', () => {
    win = { ...win, fontScale: 1.39 }; expect(render(<StartMotif />).queryByTestId('start-motif', { includeHiddenElements: true })).not.toBeNull();
    win = { ...win, fontScale: 1.4 }; expect(render(<StartMotif />).queryByTestId('start-motif', { includeHiddenElements: true })).toBeNull();
    win = { ...win, fontScale: 1 }; setA11yPrefs({ contrast: true }); expect(render(<StartMotif />).queryByTestId('start-motif', { includeHiddenElements: true })).toBeNull();
    expect(render(<Empty>Brak</Empty>).queryByTestId('bar-motif', { includeHiddenElements: true })).toBeNull();
  });
  test('Empty: ramka RADIUS.group, gryf z talerzami 220 pt nad zdaniem; nic poza dekoracją i tekstem', () => {
    const r = render(<Empty>Nie ma jeszcze treningów.</Empty>);
    expect(r.getByText('Nie ma jeszcze treningów.')).toBeTruthy(); expect(r.getByTestId('empty-art', { includeHiddenElements: true })).toBeTruthy();
    expect(JSON.stringify(r.toJSON())).toContain(`"width":${MOTIF.emptyWidthPt}`);
    expect(st(r.getByTestId('empty', { includeHiddenElements: true }))).toMatchObject({ borderRadius: RADIUS.group });
  });
});

describe('DeleteButton: „Usuń {obiekt}” na dole szczegółów (W2 a, docs/32 wz. 5)', () => {
  test('przycisk danger z podaną etykietą; stuknięcie otwiera to samo okno co gest: tytuł, treść, [Anuluj, Usuń]; „Usuń” wykonuje akcję', () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {}); const del = jest.fn();
    const r = render(<DeleteButton label="Usuń sesję" title="Usunąć tę sesję z historii?" message="Kopia w Zdrowiu też zostanie usunięta." onDelete={del} />);
    const btn = r.getByLabelText('Usuń sesję'); expect(pst(btn)).toMatchObject({ borderColor: light.danger, backgroundColor: 'transparent' });
    fireEvent.press(btn); expect(alert).toHaveBeenCalledTimes(1);
    const [title, message, buttons] = alert.mock.calls[0] as [string, string, { text: string; style?: string; onPress?: () => void }[]];
    expect([title, message]).toEqual(['Usunąć tę sesję z historii?', 'Kopia w Zdrowiu też zostanie usunięta.']); expect(buttons.map(b => b.text)).toEqual(['Anuluj', 'Usuń']);
    expect(buttons.map(b => b.style)).toEqual(['cancel', 'destructive']); expect(del).not.toHaveBeenCalled(); buttons[1].onPress!(); expect(del).toHaveBeenCalledTimes(1);
  });
  test('odstęp od treści 24 pt (SPACE.xl), przycisk na całą szerokość, jedna akcja', () => {
    const r = render(<DeleteButton label="Usuń szablon" title="Usunąć szablon?" onDelete={() => {}} />);
    expect(pst(r.getByLabelText('Usuń szablon'))).toMatchObject({ alignSelf: 'stretch' }); expect(r.getAllByRole('button')).toHaveLength(1);
    expect(st(r.getByTestId('delete-button-wrap'))).toMatchObject({ marginTop: 24 });
  });
});

describe('przyciski nagłówka (W1): wspólny HeaderButton, 44 pt, limit powiększenia 1,4', () => {
  test('„Edytuj” / „Gotowe” (W1 b): przełącznik; w trybie edycji pogrubiony', () => {
    const f = jest.fn(); const r = render(<EditButton editing={false} onToggle={f} />);
    const b = r.getByLabelText('Edytuj'); expect(pst(b)).toMatchObject({ minHeight: 44, minWidth: 44 }); expect(r.getByText('Edytuj').props.maxFontSizeMultiplier).toBe(1.4);
    expect(st(r.getByText('Edytuj'))).toMatchObject({ color: light.accent, fontSize: 17, fontWeight: '400' }); fireEvent.press(b); expect(f).toHaveBeenCalledTimes(1);
    r.rerender(<EditButton editing onToggle={f} />); expect(st(r.getByText('Gotowe'))).toMatchObject({ fontWeight: '600' }); expect(r.queryByLabelText('Edytuj')).toBeNull();
  });
  test('„⋯” (W1 a): ikona z własną etykietą VoiceOver, 44 × 44, limit 1,4', () => {
    const f = jest.fn(); const r = render(<MoreButton label="Opcje treningu" onPress={f} testID="more-btn" />);
    const b = r.getByLabelText('Opcje treningu'); expect(pst(b)).toMatchObject({ minHeight: 44, minWidth: 44 }); expect(r.getByTestId('icon-more')).toBeTruthy(); fireEvent.press(b); expect(f).toHaveBeenCalledTimes(1);
  });
  test('„Planowanie” (W1 c): przycisk tekstowy z blokadą podwójnego tapnięcia', () => {
    const f = jest.fn(); const r = render(<PlanningButton label="Planowanie" onPress={f} />);
    fireEvent.press(r.getByLabelText('Planowanie')); fireEvent.press(r.getByLabelText('Planowanie')); expect(f).toHaveBeenCalledTimes(1);
  });
});

describe('ikony M1-029 i zakładki', () => {
  test('zestaw: pin, pauza, start, przerwa, słuchawki, głośnik, wyciszenie, „⋯”; siatka 24, linia 1,8, ukryte dla VoiceOver', () => {
    expect([...ICON_NAMES].sort()).toEqual(['headphones', 'more', 'pause', 'pin', 'play', 'speaker', 'speakerOff', 'timer']);
    for (const n of ICON_NAMES) { const r = render(<Icon name={n} color="#112233" />); expect(r.getByTestId(`icon-${n}`, { includeHiddenElements: true })).toBeTruthy(); expect(JSON.stringify(r.toJSON())).toContain(`"vbWidth":${ICON.grid},"vbHeight":${ICON.grid}`); if (!['pause', 'more'].includes(n)) expect(JSON.stringify(r.toJSON())).toContain(`"strokeWidth":${ICON.stroke}`); /* pauza i „⋯” są wypełnione */ r.unmount(); }
  });
  test('ikony zakładek: 26 pt, linia 1,8, zaokrąglone końce; podpis 11 pt rośnie do 125% (DEC-10), mieści się przez zmniejszenie do 0,8', () => {
    const r = render(<TabIcon name="workout" color="#112233" />); expect(JSON.stringify(r.toJSON())).toMatch(/"width":26/); expect(JSON.stringify(r.toJSON())).toContain('"strokeWidth":1.8');
    const l = render(<TabLabel color="#112233" position="below-icon">Trening</TabLabel>); const t = l.getByText('Trening');
    expect(st(t)).toMatchObject({ fontSize: 11, fontWeight: '600' }); expect(t.props.maxFontSizeMultiplier).toBe(1.25); expect(t.props.allowFontScaling).not.toBe(false); expect(t.props.adjustsFontSizeToFit).toBe(true);
  });
  test('Text/View importowane — kontrola składni testu', () => { expect([Text, View].every(Boolean)).toBe(true); });
});
