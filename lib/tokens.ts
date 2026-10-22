/*
 * Moduł tokenów — system E3 redesignu M3 (rola 04 build), zatwierdzony na STOP E3 (21.10.2026). NIE jest importowany przez aplikację: wdroży go rola 08
 * (partia p1 z audit/M3-2026-10-21/plan.md) w miejsce kolorów, krojów i liczb z lib/theme.ts. Opis i zasady użycia: docs/design/design-spec.md.
 *
 * Decyzje, z których wynika (docs/18-przekazanie.md, 21.10.2026): kierunek A „tablica podejść”, wariant A2 (barwy talerzy IWF jako subtelne tło
 * startu i pustych stanów: krycie 16% jasny / 20% ciemny, nigdy przy liczbach kg, bez znaczenia), krój tytułów i liczb Barlow Condensed (OFL),
 * treść krojem systemowym (SF Pro), pola serii 1–4 / 5–12 / >12, obecna ikona i intro bez zmian, DEC-10 (opisy do 200%, liczby do 130%
 * z podglądem po przytrzymaniu), M1-036 (skala pisma i promieni w tokenach), M1-031 (warianty „Zwiększ kontrast”).
 * Kontrast wszystkich par: node docs/design/narzedzia/e3-gen.mjs → docs/design/tokeny-kontrast.json → kontrast.mjs → tokeny-kontrast.txt.
 *
 * Klucze kolorów: te same nazwy co dziś w lib/theme.ts (bg … less), żeby wdrożenie było podmianą wartości, plus klucze tablicy (board*) i motywu A2.
 */

/** Klucze palety: obecne z lib/theme.ts + tablica (element firmowy) + motyw talerzy A2. */
export type PaletteKey =
  | 'bg' | 'surface' | 'surface2' | 'line' | 'ctrlLine' | 'text' | 'muted' | 'accent' | 'accentInk' | 'done' | 'doneLine' | 'danger' | 'dangerInk' | 'band' | 'less'
  | 'board' | 'boardEdge' | 'boardText' | 'boardMuted' | 'boardField' | 'now'
  | 'motifBar' | 'motif25' | 'motif20' | 'motif15' | 'motif10';
export type Palette = Readonly<Record<PaletteKey, string>>;

/*
 * Pochodzenie barw (kierunek A, docs/design/kierunki/README.md):
 *  - bg „hala” #E6E8E5 — chłodna szarość posadzki i ścian hali; ciemny #161C24 — hala nocą (nie przyciemniona czerń);
 *  - board „tablica” #13294B — granat tablicy podejść, cyfry kremowe #F5F1E6 (jak podświetlane pola tablicy), „teraz” bursztyn #F2A900
 *    (zegar przerwy i ramka bieżącej serii; nie jest akcentem interfejsu);
 *  - accent: w jasnym granat tablicy, w ciemnym krem cyfr. Przycisk główny = accent + accentInk w obu motywach, więc w ciemnym jest jasny
 *    (to wersja właściwa; wyjaśnienie rozbieżności z porownanie-a.png: STOP E3);
 *  - danger: bez zmian względem lib/theme.ts (odsunięty od czerwieni talerza 25 kg, tests/motyw.test.tsx);
 *  - motif*: barwy talerzy z ikony (lib/discColors.ts PLATE_COLORS, IWF 3.3.3.6 wyd. 2019; ciemne z lib/brandIcon.ts) nałożone na bg
 *    z kryciem MOTIF.opacity — rachunek: krycie × talerz + (1 − krycie) × tło, wynik jako pełny hex (do pomiaru kontrastu).
 */
export const light: Palette = {
  bg: '#E6E8E5', surface: '#F4F5F3', surface2: '#D3D8D3', line: '#CBD0CB', ctrlLine: '#6B7380',
  text: '#18202B', muted: '#4A5361', accent: '#13294B', accentInk: '#F5F1E6',
  done: '#D5E3D8', doneLine: '#2A7248', danger: '#7F1D1D', dangerInk: '#FFFFFF', band: '#0F6469', less: '#A35200',
  board: '#13294B', boardEdge: '#13294B', boardText: '#F5F1E6', boardMuted: '#B7C1D0', boardField: '#26446F', now: '#F2A900',
  motifBar: '#C2C8C2', motif25: '#E4C9CA', motif20: '#C6D2E2', motif15: '#E8E2C8', motif10: '#C9DCCF',
};
export const dark: Palette = {
  bg: '#161C24', surface: '#1E2530', surface2: '#283244', line: '#2C3440', ctrlLine: '#7C8594',
  text: '#E8EAED', muted: '#A3ACB8', accent: '#F5F1E6', accentInk: '#13294B',
  done: '#1F2E26', doneLine: '#5FA97C', danger: '#EC7A72', dangerInk: '#161C24', band: '#5FC3C9', less: '#F0A050',
  board: '#102544', boardEdge: '#5675A8', boardText: '#F5F1E6', boardMuted: '#AEB9CA', boardField: '#22416D', now: '#F5B21C',
  motifBar: '#333C49', motif25: '#40232D', motif20: '#20304D', motif15: '#423D26', motif10: '#1E3C34',
};
/*
 * „Zwiększ kontrast” (AccessibilityInfo.isDarkerSystemColorsEnabled; reguła z M1-031, tests/audit-m1-031-contrast.test.tsx): tła i tekst główny bez zmian;
 * tekst pomocniczy i akcent (muted, accent, band, boardMuted) ≥ 7:1 do swoich teł, elementy (line jako tor, ctrlLine, doneLine, less, boardEdge) ≥ 4,5:1.
 * Motyw talerzy A2 znika (MOTIF.hideWhenIncreasedContrast) — barwy motywu są wtedy równe bg.
 */
export const lightHC: Palette = {
  ...light, line: '#545B66', ctrlLine: '#4A5361', muted: '#353C47', band: '#08454A', less: '#8A4300', doneLine: '#1F5A38',
  boardMuted: '#D3DAE4', boardField: '#2E4F7E', now: '#FFC233',
  motifBar: light.bg, motif25: light.bg, motif20: light.bg, motif15: light.bg, motif10: light.bg,
};
export const darkHC: Palette = {
  ...dark, line: '#959EAB', ctrlLine: '#A3ACB8', muted: '#C9CED6', band: '#8FDADF', less: '#F7C080', doneLine: '#74C08F', danger: '#F5A39D',
  boardEdge: '#8FA6CC', boardMuted: '#D3DAE4', now: '#FFC233',
  motifBar: dark.bg, motif25: dark.bg, motif20: dark.bg, motif15: dark.bg, motif10: dark.bg,
};

/** Motyw talerzy A2 (decyzja 21.10.2026): gdzie, jak mocno i kiedy znika. Barwy są w paletach (motif*), tu reguły. */
export const MOTIF = {
  opacity: { light: 0.16, dark: 0.2 },
  /** Górna granica krycia: przy ok. 25% tekst pomocniczy na żółtym w ciemnym spada poniżej 4,5:1 (pomiar STOP E2b). */
  opacityMax: 0.24,
  /** Tylko te miejsca. Nigdy: tablica „teraz”, sąsiedztwo liczb kg, paski, listy, przyciski. */
  where: ['start: mała ikonka sztangi zaraz po tytule „Trening”', 'puste stany: gryf z talerzami nad zdaniem i akcją'] as const,
  /** Ikonka sztangi po tytule „Trening” (22.10.2026, zastąpiła sylwetkę 30% szerokości w rogu): wysokość = ten ułamek rozmiaru tytułu, rośnie jak tytuł. */
  titleIconRatio: 0.75,
  emptyWidthPt: 220,
  /** Znika przy dużym tekście (zająłby miejsce tytułu): od skali tytułu 1,4 (ok. AX2) — PixelRatio.getFontScale() ≥ 1,4. */
  hideFromFontScale: 1.4,
  hideWhenIncreasedContrast: true,
  /** Grafika dekoracyjna: ukryta dla VoiceOver (a11yHidden z components/Motif.tsx). */
  accessible: false,
} as const;

/*
 * Pismo. Tytuły i liczby: Barlow Condensed 600/700 (OFL 1.1, docs/design/fonty/barlow-condensed/OFL.txt). Treść: krój systemowy (SF Pro),
 * czyli bez fontFamily w RN — skaluje się z Dynamic Type sam. Barlow nie ma greki ani cyrylicy: w el, bg, ru, uk, sr (i ja, ko, zh-Hant)
 * litery idą krojem zastępczym systemu (lista kaskadowa Core Text, jak dziś FALLBACK_SCRIPTS w lib/theme.ts), cyfry i znaki „×”, „:” zostają w Barlow.
 * Rozmiary w pt przy tekście domyślnym (Large); `scale` mówi, do ilu rośnie z Dynamic Type (DEC-10):
 *  - 'opis'   → do TEXT_SCALE.text (200%), zawija się;
 *  - 'liczba' → do TEXT_SCALE.num (130%), dalej podgląd po przytrzymaniu (Large Content Viewer);
 *  - 'pasek'  → do TEXT_SCALE.bar (125%; pasek zakładek i pasek tygodnia), dalej podgląd po przytrzymaniu, jak pasek zakładek iOS;
 *  - 'stala'  → nie rośnie (cyfry tablicy dopasowane do szerokości: rozmiar = min(size × skala liczb, szerokość × fitWidth)).
 * Skala trzystopniowa wg NN/g (nagłówek, podtytuł, treść) + tablica jako osobny poziom elementu firmowego.
 */
export const FONT = {
  title600: 'BarlowCondensed_600SemiBold',
  title700: 'BarlowCondensed_700Bold',
  /** Treść: systemowy. Pusta wartość = nie ustawiaj fontFamily (RN użyje SF Pro i Dynamic Type). */
  body: '',
} as const;
export type TypeRole =
  | 'largeTitle' | 'navTitle' | 'sectionTitle' | 'body' | 'bodyStrong' | 'callout' | 'footnote' | 'caption' | 'button' | 'buttonPrimary'
  | 'boardName' | 'boardMeta' | 'boardNumber' | 'boardClock' | 'boardField' | 'boardNext' | 'stepLabel' | 'stat';
export type TypeToken = { font: 'title600' | 'title700' | 'body'; size: number; lineHeight: number; weight?: '400' | '600' | '700'; scale: 'opis' | 'liczba' | 'pasek' | 'stala'; upper?: true; tracking?: number; fitWidth?: number; tabular?: true };
export const TYPE: Readonly<Record<TypeRole, TypeToken>> = {
  largeTitle: { font: 'title700', size: 34, lineHeight: 38, scale: 'opis' },
  navTitle: { font: 'title700', size: 20, lineHeight: 24, scale: 'opis' },
  sectionTitle: { font: 'title700', size: 17, lineHeight: 22, scale: 'opis' },
  body: { font: 'body', size: 17, lineHeight: 22, weight: '400', scale: 'opis' },
  bodyStrong: { font: 'body', size: 17, lineHeight: 22, weight: '600', scale: 'opis' },
  callout: { font: 'body', size: 15, lineHeight: 20, weight: '400', scale: 'opis' },
  footnote: { font: 'body', size: 13, lineHeight: 18, weight: '400', scale: 'opis' },
  /** Najmniejszy tekst w aplikacji (minimum iOS 11 pt): podpisy zakładek. */
  caption: { font: 'body', size: 11, lineHeight: 13, weight: '600', scale: 'pasek' },
  button: { font: 'body', size: 17, lineHeight: 22, weight: '600', scale: 'opis' },
  buttonPrimary: { font: 'body', size: 19, lineHeight: 24, weight: '700', scale: 'opis' },
  /** Nazwa ćwiczenia na tablicy: wersaliki jak nazwisko na tablicy podejść (IWF 3.3.6.15) — przez upperText(); rozszerzenie wyjątku wz. 28 / DEC-17 zatwierdzone na STOP E3 (21.10.2026, W3 a; docs/32). */
  boardName: { font: 'title600', size: 24, lineHeight: 26, scale: 'opis', upper: true, tracking: 0.04 },
  boardMeta: { font: 'title600', size: 18, lineHeight: 22, scale: 'opis', tabular: true },
  boardNumber: { font: 'title700', size: 96, lineHeight: 91, scale: 'stala', fitWidth: 0.24, tabular: true },
  boardClock: { font: 'title700', size: 112, lineHeight: 106, scale: 'stala', fitWidth: 0.3, tabular: true },
  boardField: { font: 'title700', size: 20, lineHeight: 24, scale: 'liczba', tabular: true },
  boardNext: { font: 'title600', size: 20, lineHeight: 24, scale: 'opis', tabular: true },
  /** Etykieta jednostki przy ± („kg”, „lb”, „powt.”, „s”, „m”, „yd”) — DEC-28/29: zawsze z wu()/distUnit(), nigdy na sztywno. */
  stepLabel: { font: 'title600', size: 18, lineHeight: 22, scale: 'opis' },
  /** Liczby w Postępach (rekordy, oś wykresu). */
  stat: { font: 'title700', size: 28, lineHeight: 32, scale: 'liczba', tabular: true },
};
/** Limity Dynamic Type (DEC-10, A11-07) — te same wartości co dziś TEXT_SCALE_MAX / NUM_SCALE_MAX w lib/theme.ts, plus pasek. */
export const TEXT_SCALE = { text: 2, num: 1.3, bar: 1.25 } as const;
/** Nazwane odstępstwo od podłogi studia (AX5 ≈ 310%): DEC-10 + STOP E1 (docs/18, 21.10.2026). AX5 renderowany informacyjnie. */
export const TEXT_SCALE_EXCEPTION = 'DEC-10: opisy do 200%, liczby do 130% + Large Content Viewer; AX5 informacyjnie (STOP E1, 21.10.2026)';

/** Odstępy: jedna jednostka 4 pt; każdy odstęp jej wielokrotnością. Margines ekranu 16, między grupami 24, w grupie 8. */
export const SPACE = { unit: 4, xs: 4, s: 8, m: 12, l: 16, xl: 24, xxl: 32, xxxl: 40 } as const;
/** Nagłówek ekranu zakładki (TabHeader, docs/32 wzorzec 31): tytuł zaczyna się tuż pod bezpiecznym obszarem (22.10.2026: wcześniej 10 pt nad tytułem). */
export const HEADER = { top: 0, bottom: SPACE.s } as const;

/*
 * Promienie wg hierarchii (M1-036; nie jeden promień na wszystko): kontener > tablica i przycisk > pole > znacznik.
 * Arkusze, okna i paski systemowe — promienie systemu (nie ustawiamy).
 */
export const RADIUS = {
  /** Grupa listy, pasek tygodnia, ramka objaśnienia ⓘ. */
  group: 12,
  /** Tablica „teraz” i „Dziś” (element firmowy) — kanciastsza od grup, jak tablica. */
  board: 8,
  /** Przyciski z tłem (główny, drugorzędny, ±15 s). */
  button: 8,
  /** Pole serii na tablicy, pole wpisu liczby. */
  field: 4,
  /** Znacznik dnia w pasku tygodnia. */
  marker: 3,
  /** Okrągłe: ±, „⋯”, ⓘ — połowa wysokości. */
  round: 999,
} as const;

/** Wysokości i cele dotykowe (pt). Cel ≥ 44 (decyzja studia; minimum HIG 28). */
export const SIZE = {
  hit: 44, buttonPrimary: 60, buttonSecondary: 52, stepButton: 44, rowMin: 52, boardFieldMin: 44,
  /** Pole serii nie jest celem dotyku (seria poprawiana poza tablicą) — minimum szerokości przy liczeniu rzędów: 36 × skala liczb. Decyzja STOP E3 (21.10.2026): pola bez dotyku. */
  boardFieldMinWidth: 36, boardFieldGap: 8,
  icon: 24, iconInline: 16, tabIcon: 26,
} as const;

/** Reguła pól serii na tablicy (decyzja 21.10.2026): do 4 z wynikiem, 5–12 w 1–3 rzędach, > 12 przewijany rząd na bieżącej serii. */
export const SET_FIELDS = { resultUpTo: 4, maxRows: 3, designedUpTo: 12, scrollAbove: 12 } as const;

/*
 * Ruch (HIG Motion): odpowiada na działanie, krótki, przerywalny; przy „Ogranicz ruch” bez przesunięć (przenikanie albo od razu).
 * Intro: bez zmian, liczby w lib/intro.ts (INTRO.totalMs 1000).
 */
export const MOTION = {
  /** „Seria zrobiona”: tablica przewraca się na zegar przerwy (pół obrotu klapki). */
  boardFlipMs: 250,
  /** Wypełnienie pola serii po „Seria zrobiona”. */
  fieldFillMs: 120,
  /** Zmiana liczby po ± (bez przesuwania cyfr; tylko podmiana). */
  stepMs: 0,
  /** „Ogranicz ruch”: zamiast obrotu przenikanie. */
  reducedCrossfadeMs: 150,
  easing: 'ease-out',
} as const;

/*
 * Mapa haptyki (ZM-07: dwa przełączniki — „Dźwięk na koniec przerwy” i „Wibracje”). Każde zdarzenie haptyczne zależy tylko od „Wibracje”,
 * każdy dźwięk tylko od „Dźwięk na koniec przerwy”. expo-haptics; na web brak. Zdarzenia `nowe: true` zatwierdzone na STOP E3 (21.10.2026): „tick” przy ± i ostrzegawcza przy „Seria zrobiona” bez wyniku.
 */
export type HapticEvent = { kiedy: string; haptyka: 'impactLight' | 'impactMedium' | 'selection' | 'notificationSuccess' | 'notificationWarning' | null; dzwiek: boolean; nowe?: true; zrodlo: string };
export const HAPTICS: readonly HapticEvent[] = [
  { kiedy: 'Seria zrobiona (✓, także na zegarku)', haptyka: 'impactLight', dzwiek: false, zrodlo: 'docs/37 ZD-01, to-be.md ZM-07 pkt 2' },
  { kiedy: 'Koniec przerwy (aplikacja na wierzchu)', haptyka: 'notificationSuccess', dzwiek: true, zrodlo: 'lib/timer.ts (dziś przy soundOn), docs/37 ZD-01' },
  { kiedy: 'Koniec przerwy w tle', haptyka: null, dzwiek: true, zrodlo: 'powiadomienie systemowe: dźwięk i wibracja wg ustawień iOS' },
  { kiedy: '± na tablicy (zmiana o krok)', haptyka: 'selection', dzwiek: false, nowe: true, zrodlo: 'ZM-01; HIG Playing haptics: selection przy zmianie wartości' },
  { kiedy: '„Seria zrobiona” bez wartości → kursor w pustym polu', haptyka: 'notificationWarning', dzwiek: false, nowe: true, zrodlo: 'ZM-01 pkt 4; obok ogłoszenie VoiceOver' },
  { kiedy: 'Przeciąganie na liście: chwyt / mijany wiersz', haptyka: 'impactLight', dzwiek: false, zrodlo: 'components/DragList.tsx (bez zmian; tick = selection)' },
  { kiedy: 'Usunięcie, zakończenie treningu, błąd', haptyka: null, dzwiek: false, zrodlo: 'okno systemowe wystarcza (bez dodatkowej haptyki)' },
];

/** Ikony własne (M1-029 / DEC-11): siatka 24, linia 1,8, zaokrąglone końce i narożniki, kolor z palety — jak components/Icon.tsx na m3-wejscie/029-ikony. */
export const ICON = { grid: 24, stroke: 1.8, cap: 'round', join: 'round', tabSize: 26, inlineSize: 16 } as const;
