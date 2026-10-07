/*
 * Dostępność na prawdziwych ekranach (polecenie właściciela 06.10.2026: „najpełniejsze darmowe testy automatyczne”; docs/20 rodzaj 2 i 7).
 * Uzupełnia — nie powtarza — tests/ux.test.tsx (C5 kontrast samych par palety, C10 limit powiększenia pól w treningu) i regress R9-06.
 * Tu: przegląd drzewa każdego głównego ekranu (z danymi: trening w toku, sesja w historii, szablon, ćwiczenie, edycja sesji) w pl/jasny
 * i en/ciemny — nazwa i rola każdego elementu naciskanego, brak powtórzonych nazw, etykiety pól, kontrast WCAG 2.1 każdego tekstu
 * względem jego RZECZYWISTEGO tła (najbliższy przodek z backgroundColor) z progiem zależnym od rozmiaru, zasada ucinania tekstów
 * tłumaczonych (numberOfLines=1 tylko na liście dozwolonych) oraz Dynamic Type (skala czcionki 2,0: brak awarii, limity powiększenia).
 * Ekrany ukryte pod bieżącym (aria-hidden w stosie/zakładkach — VoiceOver ich nie czyta) są pomijane, jak na telefonie.
 */
import * as RN from 'react-native';
import * as store from '@/lib/store';
import { light, dark, F, type Theme } from '@/lib/theme';
import { applyLang } from '@/lib/i18n';
import { EN } from '@/lib/i18n.en';
import { renderApp, flushAll, screen, go } from './app';
import { fresh, seedWithDemo } from './helpers';

jest.setTimeout(180000);

/* ---------- pomocnicze: drzewo ---------- */
type Node = any; // eslint-disable-line @typescript-eslint/no-explicit-any
const kind = (n: Node): string => typeof n.type === 'string' ? n.type : n.type?.displayName ?? n.type?.name ?? '?';
const flat = (x: unknown): Record<string, any> => (RN.StyleSheet.flatten((typeof x === 'function' ? (x as (s: { pressed: boolean }) => unknown)({ pressed: false }) : x) as never) ?? {}) as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
/** Ukrywa poddrzewo przed VoiceOver: aria-hidden / accessibilityElementsHidden / no-hide-descendants albo display:none (ekrany pod spodem w stosie). */
const hides = (x: Node): boolean => { const p = x.props ?? {}; return !!(p.accessibilityElementsHidden || p.importantForAccessibility === 'no-hide-descendants' || p['aria-hidden'] || flat(p.style).display === 'none'); };
/** Wszystkie węzły widoczne dla VoiceOver — jedno przejście od korzenia (pomija ukryte poddrzewa). */
const visibleNodes = (): Node[] => { const out: Node[] = []; const walk = (x: Node) => { if (!x || typeof x !== 'object' || hides(x)) return; out.push(x); for (const c of x.children ?? []) walk(c); }; walk(screen.UNSAFE_root); return out; };
/** Tekst czytany przez VoiceOver z dzieci (bez elementów accessible={false}). */
const textOf = (n: Node): string => { const out: string[] = []; const walk = (x: Node) => { if (x == null) return; if (typeof x === 'string' || typeof x === 'number') { out.push(String(x)); return; } if (Array.isArray(x)) { x.forEach(walk); return; } if (x.props?.accessible === false || x.props?.importantForAccessibility === 'no') return; walk(x.children); }; walk(n); return out.join(' ').replace(/\s+/g, ' ').trim(); };
const nameOf = (n: Node): string => n.props.accessibilityLabel ?? n.props['aria-label'] ?? textOf(n);
const PRESSABLE = new Set(['Pressable', 'TouchableOpacity', 'TouchableHighlight', 'TouchableWithoutFeedback', 'Text']);
/** Role, które VoiceOver ogłasza jako element do naciśnięcia. */
const ACT_ROLES = new Set(['button', 'link', 'switch', 'checkbox', 'radio', 'tab', 'menuitem', 'togglebutton', 'imagebutton', 'adjustable', 'combobox', 'search', 'spinbutton']);

/* ---------- pomocnicze: kontrast WCAG 2.1 (1.4.3) ---------- */
const lum = (hex: string) => { const c = hex.replace('#', '').match(/../g)!.map(x => parseInt(x, 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const hex6 = (c: unknown) => typeof c === 'string' && /^#[0-9a-f]{6}$/i.test(c) ? c.toLowerCase() : null;
/** Pogrubienie w rozumieniu WCAG (≥ 700): Tektur Bold/ExtraBold i IBM Plex Mono SemiBold traktujemy jak pogrubione; Plex Sans SemiBold (600) — nie (ostrożnie). */
const isBold = (st: Record<string, unknown>) => st.fontFamily === F.heavy || st.fontFamily === F.display || st.fontFamily === F.monoBold || st.fontWeight === 'bold' || Number(st.fontWeight) >= 700;

/* ---------- stan i trasy ---------- */
/** Stan z danymi: zakończona sesja (2 serie), trening w toku z tego samego szablonu (1 seria odhaczona). */
async function richState(l: 'pl' | 'en') {
  await fresh(seedWithDemo(l), l);
  const S = store.getState(); const tpl = S.templates[0];
  store.startFromTemplate(tpl); store.toggleDone(0, 0); store.toggleDone(0, 1);
  const w = store.finishWorkout(Date.now())!;
  store.startFromTemplate(tpl); store.toggleDone(0, 0);
  return { s: JSON.parse(JSON.stringify(store.getState())), w, tpl, exId: S.exercises[0].id };
}
const routesFor = (w: { id: string }, tpl: { id: string }, exId: string) => [
  '/', '/templates', '/exercises', '/history', '/more', '/more/settings', '/more/progress', '/more/locations', '/more/backup', '/more/language', '/more/bands',
  `/template/${tpl.id}`, `/exercise/${exId}`, `/history/${w.id}`, `/history/edit/${w.id}`,
];
/* Trasa „/” w stanie z treningiem w toku = ekran aktywnego treningu (components/ActiveWorkout.tsx). */

/**
 * Teksty interfejsu (t()), które wolno uciąć do jednej linii (numberOfLines={1}) — z powodem:
 *  - nazwy zakładek: pasek zakładek React Navigation (BottomTabItem) sam ustawia numberOfLines=1 — tego nie zmieniamy w aplikacji;
 *  - „Poprzednio” i nagłówek kolumny ciężaru („kg/hant.” itp.): szerokości kolumn wiersza serii liczy rowLayout (ActiveWorkout.tsx,
 *    test szerokości: tests/ux.test.tsx), a przy wąskim ekranie „Poprzednio” schodzi pod wiersz.
 */
const ONE_LINE_OK = ['Trening', 'Szablony', 'Ćwiczenia', 'Historia', 'Więcej', 'Poprzednio'];
const ONE_LINE_OK_RE = /^(kg|lb)\/|^Poprzednio: |^Previous: /;

type Sweep = {
  routes: string[]; pressables: number; texts: number; inputs: number;
  noName: string[]; noRole: string[]; dup: string[]; inputNoLabel: string[]; switchBad: string[];
  contrast: string[]; oneLine: string[]; colorsSeen: Set<string>; nonHex: string[];
};
async function sweep(l: 'pl' | 'en', theme: 'light' | 'dark'): Promise<Sweep> {
  const pal: Theme = theme === 'light' ? light : dark;
  const { s, w, tpl, exId } = await richState(l); s.settings.theme = theme;
  await renderApp({ saved: s, locale: l }); await flushAll(10);
  const out: Sweep = { routes: routesFor(w, tpl, exId), pressables: 0, texts: 0, inputs: 0, noName: [], noRole: [], dup: [], inputNoLabel: [], switchBad: [], contrast: [], oneLine: [], colorsSeen: new Set(), nonHex: [] };
  const uiTexts = new Set<string>([...Object.keys(EN), ...Object.values(EN)].filter(x => !x.includes('{')));
  for (const r of out.routes) {
    await go(r); await flushAll(10);
    const all: Node[] = visibleNodes();
    /* naciskane: Pressable, Touchable…, Text z onPress (komponenty RN — jeden węzeł na element) */
    const ps = all.filter(x => typeof x.props?.onPress === 'function' && PRESSABLE.has(kind(x)) && !(kind(x) === 'Text' && typeof x.type !== 'string'));
    out.pressables += ps.length;
    for (const p of ps) {
      const nm = nameOf(p); const role = p.props.accessibilityRole ?? p.props.role;
      if (!nm) out.noName.push(`${r}: ${kind(p)} role=${role}`);
      if (!role || !ACT_ROLES.has(role)) out.noRole.push(`${r}: ${kind(p)} „${nm}” role=${role}`);
    }
    const byName = new Map<string, number>();
    for (const p of ps) { const k = `${nameOf(p)} ‖ ${p.props.accessibilityHint ?? ''} ‖ ${JSON.stringify(p.props.accessibilityValue ?? '')}`; byName.set(k, (byName.get(k) ?? 0) + 1); }
    for (const [k, c] of byName) if (c > 1) out.dup.push(`${r}: ${c}× ${k}`);
    /* pola tekstowe i przełączniki */
    const inputs = all.filter(x => kind(x) === 'TextInput' && typeof x.type !== 'string'); out.inputs += inputs.length;
    for (const i of inputs) if (!(i.props.accessibilityLabel || i.props.placeholder)) out.inputNoLabel.push(`${r}: value=${i.props.value}`);
    for (const sw of all.filter(x => kind(x) === 'Switch' && typeof x.props?.onValueChange === 'function')) if (!sw.props.accessibilityLabel || sw.props.accessibilityRole !== 'switch') out.switchBad.push(`${r}: ${sw.props.accessibilityLabel}`);
    /* teksty: kontrast względem rzeczywistego tła i ucinanie */
    const texts = all.filter(x => x.type === 'Text' && !(x.parent && x.parent.type === 'Text'));
    for (const tx of texts) {
      out.texts++;
      const st = flat(tx.props.style); const fg = hex6(st.color); const label = textOf(tx);
      if (tx.props.numberOfLines === 1 && uiTexts.has(label) && !ONE_LINE_OK.includes(label) && !ONE_LINE_OK.map(k => EN[k]).includes(label)) out.oneLine.push(`${r}: „${label}”`);
      if (tx.props.numberOfLines === 1 && !uiTexts.has(label) && ONE_LINE_OK_RE.test(label) === false && /\p{L}{4,}/u.test(label) && [...uiTexts].some(u => u.length > 3 && label.includes(u))) out.oneLine.push(`${r}: „${label}” (zawiera tekst interfejsu)`);
      if (!fg) { if (st.color !== undefined) out.nonHex.push(`${r}: ${String(st.color)} „${label.slice(0, 30)}”`); continue; }
      out.colorsSeen.add(fg);
      let bg: string | null = null; let dim = false;
      for (let x: Node = tx; x; x = x.parent) {
        const ps2 = flat(x.props?.style);
        if (typeof ps2.opacity === 'number' && ps2.opacity < 1) dim = true; /* wyszarzone = nieaktywne (WCAG 1.4.3: wyjątek dla nieaktywnych elementów) */
        if (x.props?.accessibilityState?.disabled) dim = true;
        const b = ps2.backgroundColor; if (b && b !== 'transparent') { bg = hex6(b); if (!bg) out.nonHex.push(`${r}: tło ${String(b)}`); break; }
      }
      bg = bg ?? pal.bg; /* tło sceny: sceneStyle/Screen = bg */
      const size = typeof st.fontSize === 'number' ? st.fontSize : 14; const bold = isBold(st);
      const need = size >= 18 || (bold && size >= 14) ? 3 : 4.5; const rr = ratio(fg, bg);
      if (rr < need && !dim) out.contrast.push(`${r}: „${label.slice(0, 40)}” ${fg} na ${bg} (${size} pt${bold ? ', pogrubiony' : ''}): ${rr.toFixed(2)} < ${need}`);
    }
  }
  return out;
}

describe.each([['pl', 'light'], ['en', 'dark']] as const)('dostępność ekranów: język %s, motyw %s', (l, theme) => {
  let R: Sweep; const pal = theme === 'light' ? light : dark; const other = theme === 'light' ? dark : light;
  beforeAll(async () => {
    jest.spyOn(RN, 'useColorScheme').mockImplementation((() => theme) as never);
    R = await sweep(l, theme);
  });
  afterAll(() => { jest.restoreAllMocks(); applyLang('pl'); });

  test('przegląd objął wszystkie ekrany i elementy (stan z danymi, właściwy motyw)', () => {
    expect(R.routes).toHaveLength(15);
    expect(R.pressables).toBeGreaterThan(900); /* lista ćwiczeń ~860 wierszy + reszta */
    expect(R.inputs).toBeGreaterThan(5); expect(R.texts).toBeGreaterThan(1000);
    expect(R.colorsSeen.has(pal.text.toLowerCase())).toBe(true); expect(R.colorsSeen.has(pal.muted.toLowerCase())).toBe(true);
    expect([other.muted, other.danger, other.band].filter(c => R.colorsSeen.has(c.toLowerCase()))).toEqual([]); /* other.text pomijamy: w ciemnym accentInk = grafit = light.text */
    expect(R.nonHex).toEqual([]); /* każdy kolor tekstu i tła z palety (hex) — inaczej kontrast nie byłby sprawdzony */
  });
  test('każdy element naciskany ma nazwę dostępności (accessibilityLabel albo tekst)', () => { expect(R.noName).toEqual([]); });
  test('każdy element naciskany ma rolę (przycisk/łącze/przełącznik/pole wyboru/zakładka…)', () => { expect(R.noRole).toEqual([]); });
  test('na jednym ekranie żadne dwa elementy naciskane nie mają tej samej nazwy + podpowiedzi + wartości', () => { expect(R.dup).toEqual([]); });
  test('każde pole tekstowe ma etykietę (accessibilityLabel albo placeholder); przełączniki — etykietę i rolę switch', () => { expect([R.inputNoLabel, R.switchBad]).toEqual([[], []]); });
  test('kontrast WCAG 2.1 każdego tekstu względem jego tła na ekranie: ≥ 4,5 (zwykły), ≥ 3 (≥ 18 pt albo ≥ 14 pt pogrubiony)', () => { expect(R.contrast).toEqual([]); });
  test('teksty interfejsu (t()) nie są ucinane do jednej linii poza listą dozwolonych (długie tłumaczenia się zawijają)', () => { expect(R.oneLine).toEqual([]); });
});

/* ---------- kontrast palety: pary nieobjęte tests/ux.test.tsx C5 ---------- */
describe('kontrast palety (WCAG 2.1) — pary używane w kodzie, których nie sprawdza C5', () => {
  test.each([['light', light], ['dark', dark]] as const)('%s', (_n, th) => {
    const fails: string[] = [];
    const need = (fg: string, bg: string, min: number, what: string) => { const r = ratio(fg, bg); if (r < min) fails.push(`${what}: ${r.toFixed(2)} < ${min}`); };
    /* akcent jako ZWYKŁY tekst 14 pt (ActiveWorkout.tsx:204 „📍 miejsce ▾”, more/location/[id].tsx:39 „{n} z {m}”) i etykieta aktywnej zakładki 10 pt na pasku (surface) */
    need(th.accent, th.bg, 4.5, 'accent 14 pt na bg'); need(th.accent, th.surface, 4.5, 'accent (zakładka, 10 pt) na surface');
    /* SetBadge.tsx: tekst bg na tle band (13 pt) */
    need(th.bg, th.band, 4.5, 'bg na band (plakietka typu serii)');
    /* nieaktywna zakładka: muted na surface; chip wyłączony: muted na surface2; plakietka przerwy na zakładce: accentInk na accent (11 pt) */
    need(th.muted, th.surface, 4.5, 'muted na surface (zakładka)'); need(th.muted, th.surface2, 4.5, 'muted na surface2 (chip)'); need(th.accentInk, th.accent, 4.5, 'accentInk na accent (plakietka)');
    /* tekst w odhaczonej serii: muted i band (guma) na done */
    need(th.muted, th.done, 4.5, 'muted na done'); need(th.band, th.done, 4.5, 'band na done'); need(th.danger, th.done, 4.5, 'danger na done');
    expect(fails).toEqual([]);
  });
});

/* ---------- Dynamic Type ---------- */
describe('Dynamic Type: skala czcionki 2,0 (największe rozmiary dostępności iOS)', () => {
  let errs: string[] = []; let R: { routes: string[]; inputs: { r: string; m: unknown }[]; monoNoLimit: string[]; btnNoLimit: string[]; btnTexts: number; maxEff: number };
  beforeAll(async () => {
    jest.spyOn(RN.PixelRatio, 'getFontScale').mockReturnValue(2);
    const dims = RN.Dimensions.get; jest.spyOn(RN.Dimensions, 'get').mockImplementation(((k: 'window' | 'screen') => ({ ...dims(k), fontScale: 2 })) as never);
    jest.spyOn(console, 'error').mockImplementation((...a: unknown[]) => { const m = String(a[0]); if (!/not wrapped in act/.test(m)) errs.push(m.slice(0, 200)); });
    const { s, w, tpl, exId } = await richState('pl');
    await renderApp({ saved: s }); await flushAll(10);
    R = { routes: routesFor(w, tpl, exId), inputs: [], monoNoLimit: [], btnNoLimit: [], btnTexts: 0, maxEff: 0 };
    for (const r of R.routes) {
      await go(r); await flushAll(10);
      const all: Node[] = visibleNodes();
      for (const i of all.filter(x => x.type === 'TextInput')) R.inputs.push({ r, m: i.props.maxFontSizeMultiplier });
      for (const tx of all.filter(x => x.type === 'Text')) {
        const st = flat(tx.props.style); const m = tx.props.maxFontSizeMultiplier; const fs = typeof st.fontSize === 'number' ? st.fontSize : 14;
        if ((st.fontFamily === F.mono || st.fontFamily === F.monoBold) && !(m > 0)) R.monoNoLimit.push(`${r}: „${textOf(tx)}”`);
        let p = tx.parent; while (p && !(p.props?.accessibilityRole === 'button' && typeof p.props?.onPress === 'function')) p = p.parent;
        const ps = p ? flat(p.props.style) : {}; /* Btn (ui.tsx s.btn): ramka 1, promień 10, min. wysokość 40/44 */
        if (p && kind(p) === 'Pressable' && ps.borderRadius === 10 && ps.borderWidth === 1 && ps.minHeight >= 40 && (R.btnTexts++, !(m > 0))) R.btnNoLimit.push(`${r}: „${textOf(tx)}”`);
        R.maxEff = Math.max(R.maxEff, fs * Math.min(2, m > 0 ? m : 2));
      }
    }
  });
  afterAll(() => jest.restoreAllMocks());
  test('wszystkie ekrany renderują się przy skali 2,0 bez błędów Reacta', () => { expect(R.routes).toHaveLength(15); expect(errs).toEqual([]); expect(RN.PixelRatio.getFontScale()).toBe(2); });
  test('każde pole tekstowe na każdym ekranie (nie tylko w treningu — C10) ma limit powiększenia 0 < max ≤ 1,3 (components/ui.tsx Input)', () => {
    expect(R.inputs.length).toBeGreaterThan(5);
    expect(R.inputs.filter(i => !(typeof i.m === 'number' && i.m > 0 && i.m <= 1.3))).toEqual([]);
  });
  /* ZNALEZISKO (NISKIE): app/history/[id].tsx:17 — komórki tabeli serii (cell: Txt, IBM Plex Mono 14 pt, kolumny flex) nie mają
   * maxFontSizeMultiplier, a nagłówki kolumn obok mają 1,4 (Muted) i wiersze serii w treningu 1,3 (R9-06). Przy skali 2,0 liczba 28 pt
   * w kolumnie ~50–75 pt (5–7 kolumn na 375 pt) — „102,5” (5 znaków × ~0,6 em ≈ 84 pt) łamie się w środku liczby. Poprawka: limit 1,3 jak w treningu. */
  test('NAPRAWIONE 06.10: liczby krojem mono (tabela serii w historii — app/history/[id].tsx:17) mają limit powiększenia', () => { expect(R.monoNoLimit).toEqual([]); });
  test('liczby krojem mono poza tabelą historii mają limit powiększenia (zasada: ui.tsx, R9-06)', () => { expect(R.monoNoLimit.filter(x => !x.startsWith(R.routes[13] + ':'))).toEqual([]); });
  test('etykiety przycisków Btn mają limit powiększenia (1,4 — ui.tsx)', () => { expect(R.btnTexts).toBeGreaterThan(20); expect(R.btnNoLimit).toEqual([]); });
  test('największy efektywny rozmiar tekstu przy skali 2,0 jest skończony (rozmiar × min(2, limit))', () => { expect(Number.isFinite(R.maxEff) && R.maxEff > 24).toBe(true); });
});

