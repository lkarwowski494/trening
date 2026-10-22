/*
 * Redesign M3, partia p1 (docs/design/design-spec.md §1, §11; decyzje STOP E3 z 21.10.2026, docs/18): moduł tokenów lib/tokens.ts i lib/theme.ts
 * (palety, pismo Barlow Condensed + krój systemowy, promienie, odstępy, haptyka, kroje). Zastępuje pytania o krój i paletę z dawnego testu
 * marki (tests/brand-tuleja.test.tsx → tests/m3-system.test.tsx) na nowe wartości.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as theme from '@/lib/theme';
import * as tokens from '@/lib/tokens';
import { setA11yPrefs, __resetA11yPrefsForTests } from '@/lib/a11yPrefs';

const { light, dark, lightHC, darkHC, font, maxScale, boardDigitSize, titleMaxScale, FW, F, FONT_FILES, FONT, TYPE, TEXT_SCALE, RADIUS, SPACE, SIZE, HAPTICS, MOTIF, SET_FIELDS, MOTION, ICON, FALLBACK_SCRIPTS, BRAND } = theme;
const root = path.join(__dirname, '..');
afterEach(() => { __resetA11yPrefsForTests(); });

describe('palety (design-spec §1)', () => {
  test('jasna i ciemna: wartości z tokenów systemu M3, te same klucze', () => {
    expect([light.bg, light.surface, light.surface2, light.text, light.muted, light.accent, light.accentInk]).toEqual(['#E6E8E5', '#F4F5F3', '#D3D8D3', '#18202B', '#4A5361', '#13294B', '#F5F1E6']);
    expect([dark.bg, dark.surface, dark.surface2, dark.text, dark.muted, dark.accent, dark.accentInk]).toEqual(['#161C24', '#1E2530', '#283244', '#E8EAED', '#A3ACB8', '#F5F1E6', '#13294B']);
    expect(Object.keys(dark).sort()).toEqual(Object.keys(light).sort());
    for (const k of ['bg', 'surface', 'surface2', 'line', 'ctrlLine', 'text', 'muted', 'accent', 'accentInk', 'done', 'doneLine', 'danger', 'dangerInk', 'band', 'less', 'board', 'boardEdge', 'boardText', 'boardMuted', 'boardField', 'now', 'motifBar', 'motif25', 'motif20', 'motif15', 'motif10']) expect(Object.keys(light)).toContain(k);
  });
  test('przycisk główny: accent + accentInk w obu motywach (w ciemnym jasny); „teraz” bursztyn tylko jako osobny klucz', () => {
    expect(dark.accent).toBe(dark.boardText); expect(light.accent).toBe(light.board);
    expect([light.now, dark.now]).toEqual(['#F2A900', '#F5B21C']);
    expect(light.accent).not.toBe(light.now);
  });
  test('stare barwy marki „Tuleja” (papier, atrament, niebieski talerza) nie są barwami interfejsu; BRAND zostaje tylko dla ikony', () => {
    const ui = JSON.stringify([light, dark, lightHC, darkHC]).toLowerCase();
    for (const old of [BRAND.paper, BRAND.signal, '#121316', '#1b1d21', '#6f9bf2']) expect(ui).not.toContain(old.toLowerCase());
    expect(BRAND).toEqual({ paper: '#F4F3EF', ink: '#15171A', signal: '#1F5FD1' });
  });
  test('„Zwiększ kontrast”: te same klucze; motyw A2 znika (barwy = bg); tła i tekst główny bez zmian', () => {
    for (const [base, hc] of [[light, lightHC], [dark, darkHC]] as const) {
      expect(Object.keys(hc).sort()).toEqual(Object.keys(base).sort());
      expect([hc.bg, hc.surface, hc.surface2, hc.text]).toEqual([base.bg, base.surface, base.surface2, base.text]);
      for (const k of ['motifBar', 'motif25', 'motif20', 'motif15', 'motif10'] as const) expect(hc[k]).toBe(base.bg);
    }
  });
  test('lib/theme.ts nie definiuje własnych barw: palety to dokładnie palety lib/tokens.ts', () => {
    expect(light).toBe(tokens.light); expect(dark).toBe(tokens.dark); expect(lightHC).toBe(tokens.lightHC); expect(darkHC).toBe(tokens.darkHC);
  });
});

describe('pismo: font(rola), maxScale(rola), TYPE', () => {
  test('18 ról z docs/design: tytuły i liczby Barlow Condensed 600/700, treść krojem systemowym', () => {
    expect(Object.keys(TYPE).sort()).toEqual(['body', 'bodyStrong', 'boardClock', 'boardField', 'boardMeta', 'boardName', 'boardNext', 'boardNumber', 'button', 'buttonPrimary', 'callout', 'caption', 'footnote', 'largeTitle', 'navTitle', 'sectionTitle', 'stat', 'stepLabel'].sort());
    expect(font('largeTitle')).toEqual({ fontSize: 34, lineHeight: 38, fontFamily: 'BarlowCondensed_700Bold' });
    expect(font('navTitle')).toEqual({ fontSize: 20, lineHeight: 24, fontFamily: 'BarlowCondensed_700Bold' });
    expect(font('sectionTitle')).toMatchObject({ fontSize: 17, fontFamily: 'BarlowCondensed_700Bold' });
    expect(font('body')).toEqual({ fontSize: 17, lineHeight: 22, fontFamily: 'System', fontWeight: '400' });
    expect(font('bodyStrong')).toMatchObject({ fontSize: 17, fontFamily: 'System', fontWeight: '600' });
    expect(font('callout')).toMatchObject({ fontSize: 15 }); expect(font('footnote')).toMatchObject({ fontSize: 13 }); expect(font('caption')).toMatchObject({ fontSize: 11, fontWeight: '600' });
    expect(font('button')).toMatchObject({ fontSize: 17 }); expect(font('buttonPrimary')).toMatchObject({ fontSize: 19, fontWeight: '700' });
  });
  test('tablica: nazwa 24 z rozstrzeleniem 4%, liczba 96 i zegar 112 z cyframi tabelarycznymi, pole 20', () => {
    expect(font('boardName')).toMatchObject({ fontSize: 24, fontFamily: 'BarlowCondensed_600SemiBold', letterSpacing: 0.96 });
    expect(font('boardNumber')).toMatchObject({ fontSize: 96, fontFamily: 'BarlowCondensed_700Bold', fontVariant: ['tabular-nums'] });
    expect(font('boardClock')).toMatchObject({ fontSize: 112, fontVariant: ['tabular-nums'] });
    expect(font('boardField')).toMatchObject({ fontSize: 20, fontVariant: ['tabular-nums'] }); expect(font('stat')).toMatchObject({ fontSize: 28 });
  });
  test('„Pogrubiony tekst” (M1-024): waga o stopień wyżej — własny krój 600 → 700, system 400 → 600, 600 → 700', () => {
    setA11yPrefs({ bold: true });
    expect(font('boardName').fontFamily).toBe('BarlowCondensed_700Bold'); expect(font('largeTitle').fontFamily).toBe('BarlowCondensed_700Bold');
    expect(font('body').fontWeight).toBe('600'); expect(font('bodyStrong').fontWeight).toBe('700'); expect(font('buttonPrimary').fontWeight).toBe('700');
    expect(FW.regular).toEqual({ fontFamily: 'System', fontWeight: '600' }); expect(FW.semibold).toEqual({ fontFamily: 'System', fontWeight: '700' });
    setA11yPrefs({ bold: false });
    expect(FW.regular).toEqual({ fontFamily: 'System', fontWeight: '400' }); expect(FW.semibold).toEqual({ fontFamily: 'System', fontWeight: '600' }); expect(FW.bold).toEqual({ fontFamily: 'System', fontWeight: '700' });
  });
  test('limity skali DEC-10: opisy 200%, liczby 130%, pasek 125%, cyfry tablicy bez skalowania', () => {
    expect(TEXT_SCALE).toEqual({ text: 2, num: 1.3, bar: 1.25 });
    expect([theme.TEXT_SCALE_MAX, theme.NUM_SCALE_MAX]).toEqual([2, 1.3]);
    expect([maxScale('body'), maxScale('boardField'), maxScale('stat'), maxScale('caption'), maxScale('boardNumber'), maxScale('boardClock')]).toEqual([2, 1.3, 1.3, 1.25, 1, 1]);
  });
  test('duży tytuł: do 13% szerokości ekranu, nie więcej niż 200% (uproszczenie z design-spec §1)', () => {
    expect(titleMaxScale(390)).toBeCloseTo(1.49, 2); expect(titleMaxScale(320)).toBeCloseTo(1.22, 2); expect(titleMaxScale(1024)).toBe(2); expect(titleMaxScale(100)).toBe(1);
    for (const w of [320, 390, 430]) expect(34 * titleMaxScale(w)).toBeLessThanOrEqual(0.13 * w + 0.5);
  });
  test('cyfry tablicy dopasowane do szerokości: najmniejsze z rozmiaru ze skalą, 24% (30%) szerokości i 105% szerokości / liczba znaków', () => {
    expect(boardDigitSize('boardNumber', 390, 3, 1)).toBe(93); /* 24% × 390 = 93,6 */
    expect(boardDigitSize('boardNumber', 390, 7, 1)).toBe(58); /* „187,5 lb” w jednym wierszu: 390 × 1,05 / 7 */
    expect(boardDigitSize('boardNumber', 320, 7, 1)).toBe(48);
    expect(boardDigitSize('boardNumber', 430, 2, 1.3)).toBe(103); /* skala liczb najwyżej 1,3 → 96 × 1,3 = 124,8 > 24% × 430 */
    expect(boardDigitSize('boardClock', 390, 4, 1)).toBe(102); /* 112 vs 30% × 390 = 117 vs 410 / 4 */
    expect(boardDigitSize('boardNumber', 390, 0, 1)).toBeGreaterThan(0);
  });
  test('zgodność wsteczna: F.heavy/display = Barlow 700, F.mono/monoBold = Barlow 600/700; F.regular/semibold = krój systemowy', () => {
    expect([F.heavy, F.display, F.mono, F.monoBold]).toEqual([FONT.title700, FONT.title700, FONT.title600, FONT.title700]);
    expect([F.regular, F.semibold]).toEqual(['System', 'System']);
    setA11yPrefs({ bold: true }); expect([F.mono, F.monoBold]).toEqual([FONT.title700, FONT.title700]);
  });
});

describe('kroje: Barlow Condensed (OFL) zamiast IBM Plex', () => {
  test('FONT_FILES ma dokładnie dwa kroje, pliki leżą w assets/fonts, licencja OFL w repo', () => {
    expect(Object.keys(FONT_FILES).sort()).toEqual(['BarlowCondensed_600SemiBold', 'BarlowCondensed_700Bold']);
    for (const f of ['BarlowCondensed-SemiBold.ttf', 'BarlowCondensed-Bold.ttf']) expect(fs.statSync(path.join(root, 'assets/fonts', f)).size).toBeGreaterThan(50_000);
    const ofl = fs.readFileSync(path.join(root, 'assets/fonts/OFL-BarlowCondensed.txt'), 'utf8');
    expect(ofl).toMatch(/SIL OPEN FONT LICENSE Version 1\.1/); expect(ofl).toMatch(/Copyright 2017 The Barlow Project Authors/);
  });
  test('kroje nie mają greki ani cyrylicy → FALLBACK_SCRIPTS obejmuje grecki, cyrylicę i CJK; łacina (także polska, turecka, rumuńska, wietnamska) nie', () => {
    for (const ch of [...'αβγωΩάήЖжщюяїєўЂ', ...'あア日한、。「？']) expect([ch, FALLBACK_SCRIPTS.test(ch)]).toEqual([ch, true]);
    for (const ch of [...'aąćęłńóśźżŞşğıİșțăâîơưẠệé0×:,']) expect([ch, FALLBACK_SCRIPTS.test(ch)]).toEqual([ch, false]);
    expect(FALLBACK_SCRIPTS.source).not.toMatch(/\\p\{/); /* Hermes */
  });
  test('IBM Plex nie jest już w kodzie aplikacji ani w zależnościach używanych w czasie działania', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')) as { dependencies: Record<string, string> };
    expect(Object.keys(pkg.dependencies).filter(d => /ibm-plex/.test(d))).toEqual([]);
    expect(fs.readFileSync(path.join(root, 'lib/theme.ts'), 'utf8')).not.toMatch(/IBMPlex|ibm-plex/);
  });
});

describe('promienie, odstępy, rozmiary, ruch, pola serii, ikony (M1-036)', () => {
  test('hierarchia promieni: grupa 12 › tablica 8 = przycisk 8 › pole 4 › znacznik 3; okrągłe', () => {
    expect(RADIUS).toEqual({ group: 12, board: 8, button: 8, field: 4, marker: 3, round: 999 });
    expect(RADIUS.group).toBeGreaterThan(RADIUS.board); expect(RADIUS.board).toBe(RADIUS.button); expect(RADIUS.button).toBeGreaterThan(RADIUS.field); expect(RADIUS.field).toBeGreaterThan(RADIUS.marker);
  });
  test('odstępy: wielokrotności 4 pt', () => {
    expect(SPACE.unit).toBe(4); for (const v of Object.values(SPACE)) expect(v % 4).toBe(0);
    expect([SPACE.s, SPACE.l, SPACE.xl]).toEqual([8, 16, 24]);
  });
  test('rozmiary: cel dotyku ≥ 44, przycisk główny 60, drugorzędny 52, wiersz 52, ikona zakładki 26', () => {
    expect([SIZE.hit, SIZE.buttonPrimary, SIZE.buttonSecondary, SIZE.rowMin, SIZE.tabIcon, SIZE.stepButton]).toEqual([44, 60, 52, 52, 26, 44]);
    expect(SIZE.boardFieldMinWidth).toBe(36);
  });
  test('ruch: przewrót 250 ms, wypełnienie pola 120 ms, „Ogranicz ruch” 150 ms; pola serii 1–4 / 5–12 / > 12; ikony siatka 24 linia 1,8', () => {
    expect([MOTION.boardFlipMs, MOTION.fieldFillMs, MOTION.reducedCrossfadeMs]).toEqual([250, 120, 150]);
    expect(SET_FIELDS).toMatchObject({ resultUpTo: 4, maxRows: 3, designedUpTo: 12, scrollAbove: 12 });
    expect(ICON).toMatchObject({ grid: 24, stroke: 1.8, tabSize: 26 });
  });
  test('motyw A2: krycie 16% / 20%, górna granica 24%, znika od skali 1,4 i przy „Zwiększ kontrast”, ukryty dla VoiceOver', () => {
    expect(MOTIF.opacity).toEqual({ light: 0.16, dark: 0.2 }); expect(MOTIF.opacityMax).toBe(0.24);
    expect(MOTIF.hideFromFontScale).toBe(1.4); expect(MOTIF.hideWhenIncreasedContrast).toBe(true); expect(MOTIF.accessible).toBe(false);
    expect(Math.max(MOTIF.opacity.light, MOTIF.opacity.dark)).toBeLessThanOrEqual(MOTIF.opacityMax);
  });
});

describe('mapa haptyki (ZM-07): tylko tokeny — wibracje wdrażają partie p2 i p5', () => {
  test('7 zdarzeń; haptyka zależy tylko od „Wibracje”, dźwięk tylko od „Dźwięk na koniec przerwy”; usunięcie, zakończenie, błąd bez haptyki', () => {
    expect(HAPTICS).toHaveLength(7);
    const by = (s: string) => HAPTICS.find(h => h.kiedy.startsWith(s))!;
    expect(by('Seria zrobiona (✓').haptyka).toBe('impactLight'); expect(by('Koniec przerwy (aplikacja').haptyka).toBe('notificationSuccess'); expect(by('Koniec przerwy (aplikacja').dzwiek).toBe(true);
    expect(by('Koniec przerwy w tle').haptyka).toBeNull(); expect(by('± na tablicy').haptyka).toBe('selection'); expect(by('„Seria zrobiona” bez wartości').haptyka).toBe('notificationWarning');
    expect(by('Usunięcie').haptyka).toBeNull(); expect(by('Usunięcie').dzwiek).toBe(false);
    expect(HAPTICS.filter(h => h.nowe).map(h => h.haptyka).sort()).toEqual(['notificationWarning', 'selection']);
    expect(HAPTICS.filter(h => h.dzwiek)).toHaveLength(2);
  });
});
