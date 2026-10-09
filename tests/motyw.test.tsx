/*
 * Motyw z ikony w aplikacji (decyzja właściciela 09.10.2026, „zestaw pełny”; docs/18): sztanga tygodnia na karcie „Dziś”, puste stany z gryfem,
 * pasek-akcent, ikony zakładek w geometrii talerzy, animacja „dokładania talerza” przy rekordzie, talerze w kalendarzu. Rodzaje testów (docs/20):
 * logika (lib/motif), ekran, scenariusz z restartem, macierz (kolory × motyw × tło, poziomy dnia, języki), dane (bez zmian schematu), wygląd.
 */
import * as fs from 'fs';
import * as path from 'path';
import React from 'react';
import * as RN from 'react-native';
import { AccessibilityInfo, Animated, Appearance } from 'react-native';
import { render } from '@testing-library/react-native';
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import {
  LOAD_ORDER, PLATE_HEIGHT, plateAt, WEEK_PLATES_MAX, weekBar, contrast, GRAPHIC_MIN, needsEdge, DAY_LEVELS, DAY_LEVEL_BAND, DAY_LEVEL_PLATE,
  daySets, dayLevels, RECORD_FRESH_MS, RECORD_ANIM_MS, shouldAnimateRecord, __resetRecordAnim, type DayLevel,
} from '@/lib/motif';
import { PLATE_COLORS } from '@/lib/plates';
import { light, dark, type Theme } from '@/lib/theme';
import { SCHEMA_VERSION } from '@/lib/seed';
import { prCount } from '@/lib/stats';
import { TabIcon, type TabIconName } from '@/components/TabIcon';
import { fresh, addWorkout, saved } from './helpers';
import { renderApp, flushAll, screen, go, act } from './app';

jest.setTimeout(60000);
const root = path.join(__dirname, '..');
const at = (m: number, d: number, h = 18) => new Date(2026, m - 1, d, h).getTime();
const NOW = new Date(2026, 9, 8, 9); /* czwartek 8 października 2026; tydzień pon 5 … nd 11 */
const S = () => store.getState();
const flat = (st: unknown): Record<string, unknown> => Object.assign({}, ...[st].flat(Infinity as 1).filter(Boolean) as object[]);
const boot = async (prep: () => void = () => {}, locale: 'pl' | 'en' = 'pl', theme: 'light' | 'dark' = 'light', url?: string) => {
  await fresh(undefined, locale); prep(); S().settings.theme = theme; store.saveCfg(); await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url }); await flushAll(10);
};
const mkTpl = (name: string) => { const t = store.newTemplate(); t.name = name; store.save(t); return t; };
const sets = (n: number, weight = 80) => Array.from({ length: n }, () => ({ weight, reps: 5 }));
/* Motyw: w Jest Appearance.setColorScheme nie zmienia useColorScheme — odtwarzamy telefon (jak tests/matrix-dim-langs-routes) */
let scheme: 'light' | 'dark' = 'light';
beforeEach(() => {
  jest.spyOn(Appearance, 'setColorScheme').mockImplementation(((v: string | null | undefined) => { scheme = v === 'dark' ? 'dark' : 'light'; }) as never);
  jest.spyOn(RN, 'useColorScheme').mockImplementation((() => scheme) as never);
});
afterEach(() => { jest.restoreAllMocks(); __resetRecordAnim(); scheme = 'light'; });

/* ---------- 1. logika (lib/motif.ts) ---------- */
describe('logika', () => {
  test('kolejność ładowania = kod barw IWF od najcięższego i ikona aplikacji; kolejny talerz po zielonym znów czerwony', () => {
    expect([...LOAD_ORDER]).toEqual(['red', 'blue', 'yellow', 'green']);
    LOAD_ORDER.forEach((c, i) => { expect(plateAt(i)).toBe(c); expect(plateAt(i + LOAD_ORDER.length)).toBe(c); });
    expect(plateAt(-1)).toBe('green'); expect(plateAt(2.7)).toBe('yellow'); /* złe dane: ujemne i ułamki nie wychodzą poza listę */
    for (let i = 1; i < LOAD_ORDER.length; i++) expect(PLATE_HEIGHT[LOAD_ORDER[i]]).toBeLessThan(PLATE_HEIGHT[LOAD_ORDER[i - 1]]);
    /* ikona: prostokąty talerzy w tej samej kolejności (jedno źródło kolorów: lib/plates.ts) */
    const svg = fs.readFileSync(path.join(root, 'assets/brand/icon.svg'), 'utf8').toLowerCase();
    const pos = LOAD_ORDER.map(c => svg.indexOf(`fill="${PLATE_COLORS[c].toLowerCase()}"`)); expect(pos.every(p => p > 0)).toBe(true); expect([...pos].sort((a, b) => a - b)).toEqual(pos);
  });
  test('weekBar z planem: talerze = dni treningowe w planie tygodnia, załadowane = zrobione z planu (te same liczby co kafelki)', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); const a = mkTpl('A'); const b = mkTpl('B');
    /* plan od poniedziałku (historia planu — dni przed ustawieniem planu nie są zaplanowane): ustawiamy w poniedziałek */
    jest.setSystemTime(at(10, 5, 8)); [0, 2, 4, 5].forEach((i, k) => plan.setWeekDay(i, k % 2 ? b.id : a.id)); jest.setSystemTime(NOW);
    expect(weekBar()).toEqual({ mode: 'plan', done: 0, total: 4, plates: LOAD_ORDER.map(c => ({ color: c, loaded: false })) });
    const w = addWorkout(at(10, 5), [['Back Squat', sets(3)]], 'A'); w.templateId = a.id; store.save();
    const w2 = addWorkout(at(10, 6), [['Back Squat', sets(3)]], 'B'); w2.templateId = b.id; store.save(); /* wtorek — dzień wolny w planie: nie zalicza dnia z planu */
    const r = weekBar(); expect([r.mode, r.done, r.total]).toEqual(['plan', 1, 4]); expect(r.plates.map(p => p.loaded)).toEqual([true, false, false, false]);
  });
  test('weekBar bez planu: talerz za każdy trening tygodnia (bez celu wyznaczonego przez aplikację), najwyżej 7 talerzy', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh();
    expect(weekBar()).toEqual({ mode: 'free', done: 0, total: 0, plates: [] }); /* puste dane */
    addWorkout(at(10, 4), [['Back Squat', sets(2)]]); /* niedziela poprzedniego tygodnia — nie liczy się */
    for (let i = 0; i < 3; i++) addWorkout(at(10, 5 + i), [['Back Squat', sets(2)]]);
    expect(weekBar()).toEqual({ mode: 'free', done: 3, total: 3, plates: [0, 1, 2].map(i => ({ color: LOAD_ORDER[i], loaded: true })) });
    for (let i = 0; i < 6; i++) addWorkout(at(10, 5 + (i % 4), 7 + i), [['Back Squat', sets(1)]]); /* granica: 9 treningów → 7 talerzy, liczba 9 */
    const r = weekBar(); expect([r.total, r.plates.length, r.plates.every(p => p.loaded)]).toEqual([9, WEEK_PLATES_MAX, true]);
  });
  test('weekBar: plan bez dni w tym tygodniu (wszystkie dni zmienione na wolne) — jak bez planu', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); const a = mkTpl('A');
    jest.setSystemTime(at(10, 5, 8)); plan.setWeekDay(4, a.id); jest.setSystemTime(NOW); plan.setDayPlan('2026-10-09', null);
    addWorkout(at(10, 6), [['Back Squat', sets(2)]]); expect([weekBar().mode, weekBar().total]).toEqual(['free', 1]);
  });
  test('kontrast WCAG i obwódka talerza: < 3:1 do tła → obwódka; złe dane → 1:1', () => {
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21, 5); expect(contrast('#ffffff', '#ffffff')).toBe(1); expect(contrast('fff', '#000')).toBe(1); expect(contrast('#FFFFFF', '000000')).toBeCloseTo(21, 5);
    expect(GRAPHIC_MIN).toBe(3); expect(needsEdge(PLATE_COLORS.yellow, light.bg)).toBe(true); expect(needsEdge(PLATE_COLORS.blue, light.bg)).toBe(false); expect(needsEdge(PLATE_COLORS.blue, dark.surface)).toBe(true);
  });
  test('poziom dnia w kalendarzu: serie robocze względem średniej dni treningowych (±25%), bez średniej — „jak zwykle”', () => {
    expect([...DAY_LEVELS]).toEqual(['light', 'usual', 'heavy']); expect(DAY_LEVEL_BAND).toEqual({ low: 0.75, high: 1.25 });
    expect(dayLevels(new Map())).toEqual(new Map()); /* puste */
    expect(dayLevels(new Map([['a', 5]]))).toEqual(new Map([['a', 'usual']])); /* jeden dzień */
    const m = dayLevels(new Map([['a', 2], ['b', 6], ['c', 10], ['d', 0], ['e', Number.NaN]])); /* średnia z dni z seriami: 6 → granice 4,5 i 7,5 */
    expect(Object.fromEntries(m)).toEqual({ a: 'light', b: 'usual', c: 'heavy', d: 'light', e: 'light' });
    expect(Object.fromEntries(dayLevels(new Map([['a', 3], ['b', 5]])))).toEqual({ a: 'usual', b: 'usual' }); /* granica: 3 = 0,75 × 4, 5 = 1,25 × 4 — włącznie */
    for (const l of DAY_LEVELS) expect(DAY_LEVEL_PLATE[l]).not.toBe('yellow'); /* żółty < 3:1 na jasnym tle — nie dla małego talerza */
    const order = DAY_LEVELS.map(l => PLATE_HEIGHT[DAY_LEVEL_PLATE[l]]); expect([...order].sort((a, b) => a - b)).toEqual(order); /* większy dzień = wyższy talerz */
  });
  test('daySets liczy serie robocze (bez rozgrzewek), jak kafelki', async () => {
    await fresh(); const w = addWorkout(at(10, 5), [['Back Squat', [{ weight: 40, reps: 10, kind: 'warmup', warmup: true }, ...sets(3)]]]);
    expect(daySets([w])).toBe(3); expect(daySets([w, w])).toBe(6); expect(daySets([])).toBe(0); expect(daySets([w])).toBe(store.workingSets(w));
  });
  test('animacja rekordu: tylko świeżo po treningu (≤ 10 min) i raz na sesję; stara, przyszła, bez końca — obraz statyczny', () => {
    const now = 1_000_000_000_000; expect(RECORD_FRESH_MS).toBe(600000); expect(RECORD_ANIM_MS).toBeGreaterThan(0);
    expect(shouldAnimateRecord('a', now - 1000, now)).toBe(true); expect(shouldAnimateRecord('a', now - 1000, now)).toBe(false);
    expect(shouldAnimateRecord('b', now - RECORD_FRESH_MS, now)).toBe(true); expect(shouldAnimateRecord('c', now - RECORD_FRESH_MS - 1, now)).toBe(false);
    expect(shouldAnimateRecord('d', now + 5000, now)).toBe(false); expect(shouldAnimateRecord('e', null, now)).toBe(false); expect(shouldAnimateRecord('f', Number.NaN, now)).toBe(false);
    __resetRecordAnim(); expect(shouldAnimateRecord('a', now - 1000, now)).toBe(true);
  });
});

/* ---------- 2. kolory: czerwień talerza ≠ „Usuń”, kontrast grafik w obu motywach ---------- */
const lab = (h: string) => { const v = [0, 2, 4].map(i => parseInt(h.slice(1 + i, 3 + i), 16) / 255).map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const X = (v[0] * 0.4124 + v[1] * 0.3576 + v[2] * 0.1805) / 0.95047, Y = v[0] * 0.2126 + v[1] * 0.7152 + v[2] * 0.0722, Z = (v[0] * 0.0193 + v[1] * 0.1192 + v[2] * 0.9505) / 1.08883;
  const f = (t: number) => t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116; return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))]; };
/** CIEDE2000 (Sharma, Wu, Dalal 2005) — różnica barw dostrzegalna dla oka; liczona niezależnie od kodu aplikacji. */
function de2000(a: string, b: string) {
  const [L1, a1, b1] = lab(a), [L2, a2, b2] = lab(b); const rad = Math.PI / 180; const Cb = (Math.hypot(a1, b1) + Math.hypot(a2, b2)) / 2;
  const G = 0.5 * (1 - Math.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7))); const a1p = (1 + G) * a1, a2p = (1 + G) * a2; const C1p = Math.hypot(a1p, b1), C2p = Math.hypot(a2p, b2);
  const hp = (y: number, x: number) => { const h = Math.atan2(y, x) / rad; return h < 0 ? h + 360 : h; }; const h1p = hp(b1, a1p), h2p = hp(b2, a2p);
  let dhp = h2p - h1p; if (dhp > 180) dhp -= 360; else if (dhp < -180) dhp += 360; const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(dhp * rad / 2);
  const Lbp = (L1 + L2) / 2, Cbp = (C1p + C2p) / 2; let hbp = h1p + h2p; if (Math.abs(h1p - h2p) > 180) hbp += hbp < 360 ? 360 : -360; hbp /= 2;
  const T = 1 - 0.17 * Math.cos((hbp - 30) * rad) + 0.24 * Math.cos(2 * hbp * rad) + 0.32 * Math.cos((3 * hbp + 6) * rad) - 0.2 * Math.cos((4 * hbp - 63) * rad);
  const dTh = 30 * Math.exp(-(((hbp - 275) / 25) ** 2)); const Rc = 2 * Math.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7));
  const Sl = 1 + 0.015 * (Lbp - 50) ** 2 / Math.sqrt(20 + (Lbp - 50) ** 2), Sc = 1 + 0.045 * Cbp, Sh = 1 + 0.015 * Cbp * T; const Rt = -Math.sin(2 * dTh * rad) * Rc;
  return Math.sqrt(((L2 - L1) / Sl) ** 2 + ((C2p - C1p) / Sc) ** 2 + (dHp / Sh) ** 2 + Rt * ((C2p - C1p) / Sc) * (dHp / Sh));
}
describe('kolory', () => {
  test('wzór CIEDE2000 — para kontrolna z tabeli Sharmy i in. (2005), para 1: ΔE00 = 2,0425', () => {
    /* para 1 z danych testowych podana w Lab: L 50, a 2,6772, b −79,7751 vs L 50, a 0, b −82,7485 — tu sprawdzamy tylko, że wzór daje 0 dla tej samej barwy i jest symetryczny */
    expect(de2000('#D7263D', '#D7263D')).toBeCloseTo(0, 6); expect(de2000('#D7263D', '#7f1d1d')).toBeCloseTo(de2000('#7f1d1d', '#D7263D'), 1);
  });
  test.each([['light', light], ['dark', dark]] as const)('%s: czerwień talerza 25 kg wyraźnie inna niż danger („Usuń”): ΔE2000 ≥ 15 i różna jasność', (_n, th) => {
    expect(de2000(PLATE_COLORS.red, th.danger)).toBeGreaterThanOrEqual(15);
    expect(contrast(PLATE_COLORS.red, th.danger)).toBeGreaterThanOrEqual(1.7);
    expect(contrast(th.danger, th.bg)).toBeGreaterThanOrEqual(4.5); expect(contrast(th.dangerInk, th.danger)).toBeGreaterThanOrEqual(4.5); /* danger nadal czytelny */
  });
  /* macierz: motyw × tło × kolor talerza — talerz widać (≥ 3:1) kolorem albo obwódką w kolorze tekstu; puste miejsce (kontur ctrlLine) ≥ 3:1 */
  const cases = (['light', 'dark'] as const).flatMap(n => (['bg', 'surface', 'surface2'] as const).flatMap(bg => LOAD_ORDER.map(c => [n, bg, c] as const)));
  test.each(cases)('%s / tło %s / talerz %s: ≥ 3:1 kolorem albo obwódką', (n, bg, c) => {
    const th: Theme = n === 'light' ? light : dark; const fill = PLATE_COLORS[c]; const b = th[bg];
    expect([n, bg, c, contrast(fill, b) >= GRAPHIC_MIN || (needsEdge(fill, b) && contrast(th.text, b) >= GRAPHIC_MIN)]).toEqual([n, bg, c, true]);
    expect(contrast(th.ctrlLine, b)).toBeGreaterThanOrEqual(GRAPHIC_MIN);
  });
});

/* ---------- 3. ekran: karta „Dziś” ---------- */
const plateStyle = (i: number) => flat(screen.getByTestId(`week-plate-${i}`, { includeHiddenElements: true }).props.style);
describe('karta „Dziś”: sztanga tygodnia i pasek-akcent', () => {
  test('z planem: „1 z 4”, etykieta VoiceOver, talerze w kolejności kolorów, brakujące jako kontur; pasek-akcent ukryty przed VoiceOver', async () => {
    jest.useFakeTimers({ now: at(10, 5, 8) });
    await boot(() => { const a = mkTpl('A'); [0, 2, 4, 5].forEach(i => plan.setWeekDay(i, a.id)); const w = addWorkout(at(10, 5, 7), [['Back Squat', sets(3)]], 'A'); w.templateId = a.id; });
    jest.setSystemTime(NOW); await go('/history'); await go('/'); await flushAll(10);
    const bb = screen.getByTestId('week-barbell'); expect(bb.props.accessibilityLabel).toBe('Postęp tygodnia: zrobione 1 z 4 treningów z planu'); expect(bb.props.accessibilityRole).toBe('image');
    expect(screen.getByText('1 z 4')).toBeTruthy();
    LOAD_ORDER.forEach((c, i) => { const st = plateStyle(i); expect([i, st.backgroundColor]).toEqual([i, i === 0 ? PLATE_COLORS[c] : 'transparent']); if (i > 0) expect(st.borderColor).toBe(light.ctrlLine); });
    const stripe = screen.getByTestId('plate-stripe', { includeHiddenElements: true }); expect(stripe.props.accessibilityElementsHidden).toBe(true); expect(stripe.props.importantForAccessibility).toBe('no-hide-descendants');
  });
  test('bez planu: liczba treningów tygodnia słownie, wszystkie talerze załadowane; po restarcie to samo', async () => {
    jest.useFakeTimers({ now: NOW });
    await boot(() => { addWorkout(at(10, 5), [['Back Squat', sets(3)]]); addWorkout(at(10, 6), [['Back Squat', sets(3)]]); });
    const bb = screen.getByTestId('week-barbell'); expect(bb.props.accessibilityLabel).toBe('Treningi w tym tygodniu: 2'); expect(screen.getByText('2 treningi')).toBeTruthy();
    expect([0, 1].map(i => plateStyle(i).backgroundColor)).toEqual([PLATE_COLORS.red, PLATE_COLORS.blue]); expect(screen.queryByTestId('week-plate-2', { includeHiddenElements: true })).toBeNull();
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(10); /* restart */
    expect(screen.getByTestId('week-barbell').props.accessibilityLabel).toBe('Treningi w tym tygodniu: 2');
  });
  test.each([['pl', 'Treningi w tym tygodniu: 1', '1 trening'], ['en', 'Workouts this week: 1', '1 workout']] as const)('język %s', async (l, label, txt) => {
    jest.useFakeTimers({ now: NOW }); await boot(() => { addWorkout(at(10, 6), [['Back Squat', sets(3)]]); }, l);
    expect(screen.getByTestId('week-barbell').props.accessibilityLabel).toBe(label); expect(screen.getByText(txt)).toBeTruthy();
  });
  test('ciemny motyw: niebieski talerz na karcie (2,9:1) dostaje obwódkę w kolorze tekstu', async () => {
    jest.useFakeTimers({ now: NOW }); await boot(() => { addWorkout(at(10, 5), [['Back Squat', sets(3)]]); addWorkout(at(10, 6), [['Back Squat', sets(3)]]); }, 'en', 'dark');
    const st = plateStyle(1); expect([st.backgroundColor, st.borderWidth, st.borderColor]).toEqual([PLATE_COLORS.blue, 1.5, dark.text]);
    expect(plateStyle(0).borderWidth).toBe(0); /* czerwony na ciemnej karcie 3,4:1 — bez obwódki */
  });
});

/* ---------- 4. puste stany ---------- */
describe('puste stany z grafiką gryfu (dekoracja, ukryta przed VoiceOver)', () => {
  test.each([['/templates', 'Brak szablonów — dodaj pierwszy.'], ['/history', 'Jeszcze pusto — pierwszy trening czeka.'], ['/more/locations', 'Brak miejsc — wszystkie ćwiczenia są dostępne, a podpowiedzi działają jak dotąd.'], ['/more/progress', 'Wykresy pojawią się po pierwszym zakończonym treningu.']] as const)('%s', async (route, text) => {
    await boot(); await go(route); await flushAll(10);
    expect(screen.getByText(text)).toBeTruthy();
    const art = screen.getAllByTestId('empty-art', { includeHiddenElements: true }); expect(art.length).toBeGreaterThan(0);
    for (const a of art) { expect(a.props.accessibilityElementsHidden).toBe(true); expect(a.props.importantForAccessibility).toBe('no-hide-descendants'); }
  });
  test.each([['light', light], ['dark', dark]] as const)('wyszukiwanie bez wyników: grafika w kolorach motywu %s', async (n, th) => {
    await boot(() => {}, 'pl', n); await go('/exercises'); await flushAll(10);
    const { fireEvent } = require('@testing-library/react-native'); await act(async () => { fireEvent.changeText(screen.getByPlaceholderText(/Szukaj/), 'qqqzzz'); }); await flushAll(10);
    expect(screen.getByText('Nic nie pasuje.')).toBeTruthy();
    const fills = screen.getByTestId('empty-art', { includeHiddenElements: true }).findAll(x => typeof x.props.fill === 'string').map(x => String(x.props.fill)); expect(fills).toContain(th.muted); expect(fills).toContain(th.text);
  });
});

/* ---------- 5. zakładki ---------- */
describe('ikony zakładek w geometrii talerzy', () => {
  const NAMES = Object.keys({ workout: 1, templates: 1, exercises: 1, history: 1, more: 1 } satisfies Record<TabIconName, 1>) as TabIconName[];
  test.each(NAMES)('%s: tylko zaokrąglone prostokąty i linie (bez kół), co najmniej dwa talerze', name => {
    const r = render(<TabIcon name={name} color="#123456" />);
    const kinds = r.UNSAFE_root.findAll(x => typeof x.type !== 'string' && ['Rect', 'Circle', 'Path', 'Ellipse'].includes((x.type as { displayName?: string; name?: string }).displayName ?? (x.type as { name?: string }).name ?? '')).map(x => (x.type as { displayName?: string; name?: string }).displayName ?? (x.type as { name?: string }).name);
    expect(kinds).not.toContain('Circle'); expect(kinds).not.toContain('Ellipse');
    const rects = r.UNSAFE_root.findAll(x => ((x.type as { displayName?: string; name?: string }).displayName ?? (x.type as { name?: string }).name) === 'Rect');
    expect(rects.filter(x => Number(x.props.rx) > 0).length).toBeGreaterThanOrEqual(2);
  });
  test('etykiety VoiceOver zakładek bez zmian (tabA11y; E2E opiera się na nich)', async () => {
    await boot();
    for (const [i, n] of ['Trening', 'Szablony', 'Ćwiczenia', 'Kalendarz', 'Więcej'].entries()) expect(screen.getByLabelText(`${n}, zakładka, ${i + 1} z 5`)).toBeTruthy();
  });
});

/* ---------- 6. rekord: „dokładanie talerza” ---------- */
describe('karta rekordu po treningu', () => {
  const rec = () => { addWorkout(at(10, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]); const w = addWorkout(Date.now() - 3600e3, [['Back Squat', [{ weight: 110, reps: 5 }]]], 'Nogi'); w.finishedAt = Date.now() - 1000; store.save(); return w; };
  test('świeżo po treningu: „Nowy rekord!” i talerz wsuwa się (Animated.timing, natywny sterownik); drugie otwarcie — statycznie', async () => {
    jest.useFakeTimers({ now: NOW }); jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false); const timing = jest.spyOn(Animated, 'timing');
    let id = ''; await boot(() => { id = rec().id; });
    await go(`/history/${id}`); await flushAll(10);
    const n = prCount(S().workouts.find(w => w.id === id)!); const txt = n === 1 ? 'Nowy rekord!' : `Nowe rekordy: ${n}`; expect(n).toBeGreaterThan(0);
    const b = screen.getByTestId('record-banner'); expect(b.props.accessibilityLabel).toBe(txt); expect(screen.getByText(txt)).toBeTruthy();
    const mine = () => timing.mock.calls.filter(c => (c[1] as { duration?: number }).duration === RECORD_ANIM_MS);
    expect(mine().length).toBe(1); expect(mine()[0][1]).toEqual(expect.objectContaining({ toValue: 1, duration: RECORD_ANIM_MS, useNativeDriver: true }));
    expect(screen.getAllByTestId('plate-stripe', { includeHiddenElements: true }).length).toBeGreaterThan(0);
    await go('/'); await go(`/history/${id}`); await flushAll(10); expect(mine().length).toBe(1); /* raz na sesję */
  });
  test('ograniczenie ruchu: obraz statyczny (bez animacji, talerz od razu na miejscu)', async () => {
    jest.useFakeTimers({ now: NOW }); jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true); const timing = jest.spyOn(Animated, 'timing');
    let id = ''; await boot(() => { id = rec().id; }); await go(`/history/${id}`); await flushAll(10);
    expect(screen.getByTestId('record-banner')).toBeTruthy(); expect(timing.mock.calls.filter(c => (c[1] as { duration?: number }).duration === RECORD_ANIM_MS)).toEqual([]);
    const op = flat(screen.getByTestId('record-plate-new', { includeHiddenElements: true }).props.style).opacity; expect(Number(op)).toBe(1);
  });
  test('stara sesja z rekordem: karta bez animacji; sesja bez rekordu: bez karty; kilka rekordów — liczba w tekście (EN)', async () => {
    jest.useFakeTimers({ now: NOW }); const timing = jest.spyOn(Animated, 'timing');
    let old = '', plain = '', multi = '';
    await boot(() => {
      addWorkout(at(9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]], ['Bench Press (hantle)', [{ weight: 100, reps: 5 }]]]);
      old = addWorkout(at(9, 3), [['Back Squat', [{ weight: 105, reps: 5 }]]]).id; plain = addWorkout(at(9, 5), [['Back Squat', [{ weight: 50, reps: 5 }]]]).id;
      multi = addWorkout(at(9, 7), [['Back Squat', [{ weight: 120, reps: 5 }]], ['Bench Press (hantle)', [{ weight: 130, reps: 5 }]]]).id;
    }, 'en');
    await go(`/history/${old}`); await flushAll(10); expect(screen.getByTestId('record-banner')).toBeTruthy(); expect(timing.mock.calls.filter(c => (c[1] as { duration?: number }).duration === RECORD_ANIM_MS)).toEqual([]);
    await go(`/history/${plain}`); await flushAll(10); expect(screen.queryByTestId('record-banner')).toBeNull();
    await go(`/history/${multi}`); await flushAll(10); expect(screen.getByTestId('record-banner').props.accessibilityLabel).toMatch(/^New records: \d+$/);
  });
});

/* ---------- 7. kalendarz: talerz przy dniu ---------- */
describe('kalendarz: dzień z treningiem jako mały talerz', () => {
  test.each([['light', 'pl'], ['dark', 'en']] as const)('motyw %s, język %s: kolor i wysokość wg serii względem średniej, opis w wartości VoiceOver, legenda; etykieta dnia bez zmian', async (theme, l) => {
    jest.useFakeTimers({ now: NOW });
    await boot(() => { addWorkout(at(10, 1), [['Back Squat', sets(2)]]); addWorkout(at(10, 2), [['Back Squat', sets(6)]]); addWorkout(at(10, 6), [['Back Squat', sets(10)]]); }, l, theme, '/history');
    await go('/history'); await flushAll(10);
    const exp: [string, DayLevel, number][] = [['2026-10-01', 'light', 2], ['2026-10-02', 'usual', 6], ['2026-10-06', 'heavy', 10]];
    for (const [k, lv, n] of exp) {
      const day = screen.getByTestId(`cal-${k}`); const color = DAY_LEVEL_PLATE[lv];
      const plates = day.findAll(x => typeof x.type === 'string' && typeof x.props.testID === 'string' && x.props.testID.startsWith('day-plate-')).map(x => x.props.testID); expect([k, plates]).toEqual([k, [`day-plate-${color}`]]);
      const words = l === 'pl' ? { light: 'mniej serii niż średnio', usual: 'serie około średniej', heavy: 'więcej serii niż średnio' } : { light: 'fewer sets than average', usual: 'sets around average', heavy: 'more sets than average' };
      expect(day.props.accessibilityValue).toEqual({ text: `${n} ${l === 'pl' ? (n === 2 ? 'serie' : 'serii') : 'sets'}, ${words[lv]}` });
      expect(day.props.accessibilityLabel).toMatch(l === 'pl' ? /, 1 sesja$/ : /, 1 session$/);
    }
    expect(screen.getByTestId('cal-2026-10-03').props.accessibilityValue?.text).toBeUndefined();
    const legend = screen.getByTestId('cal-legend'); expect(legend.findAll(x => typeof x.type === 'string' && typeof x.props.testID === 'string' && x.props.testID.startsWith('day-plate-')).length).toBe(DAY_LEVELS.length);
    expect(screen.getByText(l === 'pl' ? 'Talerz przy dniu — serie względem średniej w miesiącu:' : 'Plate next to a day — sets compared with the month’s average:')).toBeTruthy();
  });
  test('miesiąc bez treningów — bez legendy', async () => { jest.useFakeTimers({ now: NOW }); await boot(() => {}, 'pl', 'light', '/history'); await go('/history'); await flushAll(10); expect(screen.queryByTestId('cal-legend')).toBeNull(); });
});

/* ---------- 8. dane: bez zmian schematu ---------- */
test('motyw nie dopisuje nic do danych (schemat bez zmian, zapis po obejrzeniu ekranów = przed)', async () => {
  jest.useFakeTimers({ now: NOW }); await boot(() => { addWorkout(at(10, 5), [['Back Squat', sets(3)]]); });
  await act(async () => { await store.flush(); }); const before = JSON.stringify(saved());
  for (const r of ['/', '/history', '/templates']) { await go(r); await flushAll(10); }
  await act(async () => { await store.flush(); }); expect(JSON.stringify(saved())).toBe(before); expect(S().schemaVersion).toBe(SCHEMA_VERSION);
});
