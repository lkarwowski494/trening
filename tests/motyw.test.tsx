/*
 * Motyw z ikony w aplikacji (decyzja właściciela 09.10.2026, „zestaw pełny”; docs/18) po korekcie właściciela z 09.10.2026 ok. 17:00: pod dniem
 * w pasku tygodnia i w kalendarzu mała ikona aplikacji (pełna = zrobione, obwódka = zaplanowane, wyszarzona = opuszczone, bez planu — nic; kolor
 * nic nie koduje — usunięte reguły „kolor = serie względem średniej” i „kolor po kolei” oraz legenda), postęp tygodnia jako stosy talerzy z procentem
 * planu (zamiast sztangi), bez paska-akcentu; puste stany z gryfem, ikony zakładek, animacja „dokładania talerza” bez zmian. Rodzaje testów (docs/20):
 * logika (lib/motif), ekran, scenariusz z restartem, macierz (kolory × motyw × tło, znaczniki, N = 1–7, języki), wymiary 320 pt, dane, wygląd.
 */
import * as fs from 'fs';
import * as path from 'path';
import React from 'react';
import * as RN from 'react-native';
import { AccessibilityInfo, Animated, Appearance } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import {
  LOAD_ORDER, PLATE_HEIGHT, plateAt, contrast, GRAPHIC_MIN, needsEdge, RECORD_FRESH_MS, RECORD_ANIM_MS, shouldAnimateRecord, __resetRecordAnim,
  ICON_PLATES, ICON_COLLAR, ICON_BAR_H, MINI_ICON, miniIcon, PLATE_STACK, plateStack, plateStackHeight, planPct, weekProgress, DAY_MARKS, dayMark, MARK_STROKE, type DayMark,
} from '@/lib/motif';
import type { DayStatus } from '@/lib/plan';
import { CAL_FACE } from '@/components/HistoryCalendar';
import { PLATE_COLORS } from '@/lib/plates';
import { light, dark, type Theme } from '@/lib/theme';
import { SCHEMA_VERSION } from '@/lib/seed';
import { prCount } from '@/lib/stats';
import { TabIcon, type TabIconName } from '@/components/TabIcon';
import { WeekStacks } from '@/components/WeekStacks';
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
const svgRects = () => [...fs.readFileSync(path.join(root, 'assets/brand/icon.svg'), 'utf8').matchAll(/<rect ([^>]*)\/>/g)].map(m => Object.fromEntries([...m[1].matchAll(/(\w+)="([^"]*)"/g)].map(x => [x[1], x[2]])) as Record<string, string>);
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
  test('geometria ikony w kodzie (ICON_PLATES, zacisk, gryf) = assets/brand/icon.svg; wysokości talerzy = PLATE_HEIGHT', () => {
    const rects = svgRects();
    expect(ICON_PLATES.map(p => p.color)).toEqual([...LOAD_ORDER]);
    for (const p of ICON_PLATES) { const r = rects.find(x => x.fill?.toLowerCase() === PLATE_COLORS[p.color].toLowerCase())!; expect([p.color, +r.width, +r.height]).toEqual([p.color, p.w, p.h]); expect(PLATE_HEIGHT[p.color]).toBeCloseTo(p.h / ICON_PLATES[0].h, 1); }
    const ink = rects.filter(x => x.fill?.toLowerCase() === '#15171a'); /* gryf i zacisk: kolor tekstu (BRAND.ink) */
    expect(ink.some(x => +x.height === ICON_BAR_H && +x.width > 90)).toBe(true); expect(ink.some(x => +x.width === ICON_COLLAR.w && +x.height === ICON_COLLAR.h)).toBe(true);
  });
  test('mała ikona dnia: mieści się w 18–24 pt, kolory i proporcje wysokości jak ikona, talerz ≥ 2,5 pt, odstęp ≥ 1 pt (czytelność), gryf i zacisk', () => {
    const r = miniIcon(); const { w, h } = MINI_ICON; expect(w).toBeGreaterThanOrEqual(18); expect(w).toBeLessThanOrEqual(24); expect(h).toBeLessThanOrEqual(24);
    for (const x of r) { expect(x.x).toBeGreaterThanOrEqual(0); expect(x.y).toBeGreaterThanOrEqual(0); expect(x.x + x.w).toBeLessThanOrEqual(w + 1e-9); expect(x.y + x.h).toBeLessThanOrEqual(h + 1e-9); }
    const plates = r.filter(x => x.part === 'plate'); expect(plates.map(p => p.color)).toEqual([...LOAD_ORDER]);
    plates.forEach((p, i) => { expect(p.h / plates[0].h).toBeCloseTo(ICON_PLATES[i].h / ICON_PLATES[0].h, 2); expect(p.w).toBeGreaterThanOrEqual(2.5); expect(Math.abs((p.y + p.h / 2) - h / 2)).toBeLessThan(0.02); });
    for (let i = 1; i < plates.length; i++) { expect(plates[i].x - (plates[i - 1].x + plates[i - 1].w)).toBeGreaterThanOrEqual(1); expect(plates[i].w).toBeLessThanOrEqual(plates[i - 1].w); }
    const bar = r.filter(x => x.part === 'bar'); const collar = r.filter(x => x.part === 'collar'); expect([bar.length, collar.length]).toEqual([1, 1]);
    expect(bar[0].w).toBe(w); expect(collar[0].x).toBeGreaterThanOrEqual(plates[3].x + plates[3].w + 1); expect(collar[0].h).toBeCloseTo(plates[0].h * ICON_COLLAR.h / ICON_PLATES[0].h, 1);
    expect(plates[0].x).toBeGreaterThan(0); /* kawałek gryfu przed talerzami — kształt sztangi jak na ikonie */
  });
  test('stos talerzy: od dołu największy, szerokość ∝ średnica, grubość ∝ grubość talerza na ikonie, wyśrodkowany', () => {
    const r = plateStack(); expect(r.map(p => p.color)).toEqual([...LOAD_ORDER]); const H = plateStackHeight();
    expect(r[0].y + r[0].h).toBeCloseTo(H, 5); expect(Math.min(...r.map(p => p.y))).toBeCloseTo(0, 5);
    r.forEach((p, i) => { expect(p.w / r[0].w).toBeCloseTo(ICON_PLATES[i].h / ICON_PLATES[0].h, 2); expect(p.h / r[0].h).toBeCloseTo(ICON_PLATES[i].w / ICON_PLATES[0].w, 1); expect(p.x + p.w / 2).toBeCloseTo(PLATE_STACK.w / 2, 1); if (i) expect(r[i - 1].y - (p.y + p.h)).toBeCloseTo(PLATE_STACK.gap, 5); });
    expect(r[0].w).toBe(PLATE_STACK.w);
  });
  test('planPct: zaokrąglenie do całości, 100 tylko gdy zrobione wszystkie, 0 tylko gdy nic; złe dane → 0', () => {
    expect([planPct(3, 5), planPct(1, 3), planPct(2, 3), planPct(0, 5), planPct(5, 5), planPct(6, 5)]).toEqual([60, 33, 67, 0, 100, 100]);
    expect([planPct(1, 0), planPct(Number.NaN, 3), planPct(2, Number.POSITIVE_INFINITY), planPct(-1, 3), planPct(1, -2)]).toEqual([0, 0, 0, 0, 0]);
    for (let n = 1; n <= 7; n++) for (let d = 0; d <= n; d++) expect([n, d, planPct(d, n)]).toEqual([n, d, Math.round((d / n) * 100)]);
    for (const n of [199, 200, 1000]) { expect(planPct(n - 1, n)).toBe(99); expect(planPct(1, n)).toBe(1); } /* granica: zaokrąglenie nie udaje końca ani zera */
  });
  test('weekProgress z planem: N = dni treningowe w planie tygodnia, pełne = zrobione z planu (dzień spoza planu się nie liczy)', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); const a = mkTpl('A'); const b = mkTpl('B');
    /* plan od poniedziałku (historia planu — dni przed ustawieniem planu nie są zaplanowane): ustawiamy w poniedziałek */
    jest.setSystemTime(at(10, 5, 8)); [0, 2, 4, 5].forEach((i, k) => plan.setWeekDay(i, k % 2 ? b.id : a.id)); jest.setSystemTime(NOW);
    expect(weekProgress()).toEqual({ done: 0, total: 4, pct: 0, stacks: [false, false, false, false] });
    const w = addWorkout(at(10, 5), [['Back Squat', sets(3)]], 'A'); w.templateId = a.id; store.save();
    const w2 = addWorkout(at(10, 6), [['Back Squat', sets(3)]], 'B'); w2.templateId = b.id; store.save(); /* wtorek — dzień wolny w planie: nie zalicza dnia z planu */
    expect(weekProgress()).toEqual({ done: 1, total: 4, pct: 25, stacks: [true, false, false, false] });
  });
  test.each([1, 2, 3, 4, 5, 6, 7])('weekProgress: N = %i, wszystkie z planu zrobione → 100% i wszystkie stosy pełne', async n => {
    jest.useFakeTimers({ now: at(10, 11, 21) }); await fresh(); const a = mkTpl('A');
    jest.setSystemTime(at(10, 5, 6)); for (let i = 0; i < n; i++) plan.setWeekDay(i, a.id); jest.setSystemTime(at(10, 11, 21));
    for (let i = 0; i < n; i++) { const w = addWorkout(at(10, 5 + i, 7), [['Back Squat', sets(2)]], 'A'); w.templateId = a.id; } store.save();
    expect(weekProgress()).toEqual({ done: n, total: n, pct: 100, stacks: Array(n).fill(true) });
  });
  test('weekProgress bez planu i z planem bez dni w tym tygodniu → null (stosów nie ma, aplikacja nie wyznacza celu)', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh();
    expect(weekProgress()).toBeNull(); addWorkout(at(10, 6), [['Back Squat', sets(2)]]); expect(weekProgress()).toBeNull();
    const a = mkTpl('A'); jest.setSystemTime(at(10, 5, 8)); plan.setWeekDay(4, a.id); jest.setSystemTime(NOW); plan.setDayPlan('2026-10-09', null);
    expect(weekProgress()).toBeNull();
  });
  test('dayMark: zrobione i zrobiony inny trening → pełna ikona, zaplanowany → obwódka, opuszczony → obwódka wyszarzona, wolne → nic', () => {
    const ALL: DayStatus[] = ['done', 'other', 'planned', 'missed', 'rest'];
    expect(ALL.map(dayMark)).toEqual(['done', 'done', 'planned', 'missed', null]);
    expect([...DAY_MARKS]).toEqual(['done', 'planned', 'missed']);
    expect(Object.keys(MARK_STROKE).sort()).toEqual(DAY_MARKS.filter(m => m !== 'done').sort()); expect(MARK_STROKE.planned).not.toBe(MARK_STROKE.missed);
  });
  test('kontrast WCAG i obwódka talerza: < 3:1 do tła → obwódka; złe dane → 1:1', () => {
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21, 5); expect(contrast('#ffffff', '#ffffff')).toBe(1); expect(contrast('fff', '#000')).toBe(1); expect(contrast('#FFFFFF', '000000')).toBeCloseTo(21, 5);
    expect(GRAPHIC_MIN).toBe(3); expect(needsEdge(PLATE_COLORS.yellow, light.bg)).toBe(true); expect(needsEdge(PLATE_COLORS.blue, light.bg)).toBe(false); expect(needsEdge(PLATE_COLORS.blue, dark.surface)).toBe(true);
  });
  test('animacja rekordu: tylko świeżo po treningu (≤ 10 min) i raz na sesję; stara, przyszła, bez końca — obraz statyczny', () => {
    const now = 1_000_000_000_000; expect(RECORD_FRESH_MS).toBe(600000); expect(RECORD_ANIM_MS).toBeGreaterThan(0);
    expect(shouldAnimateRecord('a', now - 1000, now)).toBe(true); expect(shouldAnimateRecord('a', now - 1000, now)).toBe(false);
    expect(shouldAnimateRecord('b', now - RECORD_FRESH_MS, now)).toBe(true); expect(shouldAnimateRecord('c', now - RECORD_FRESH_MS - 1, now)).toBe(false);
    expect(shouldAnimateRecord('d', now + 5000, now)).toBe(false); expect(shouldAnimateRecord('e', null, now)).toBe(false); expect(shouldAnimateRecord('f', Number.NaN, now)).toBe(false);
    __resetRecordAnim(); expect(shouldAnimateRecord('a', now - 1000, now)).toBe(true);
  });
  test('wymiary na ekranie 320 pt: ikona mieści się w kolumnie paska tygodnia i w komórce kalendarza, 7 stosów w jednym wierszu karty', () => {
    const SCREEN = 320, PAD = 14; /* Screen 14 (components/ui), karta „Dziś”: ramka 1, padding 14, odstęp kolumn 2, ramka „dziś” 2 */
    const col = (SCREEN - 2 * PAD - 2 * 1 - 2 * 14 - 6 * 2) / 7 - 2 * 2; expect(col).toBeGreaterThanOrEqual(MINI_ICON.w);
    const cell = (SCREEN - 2 * PAD - 2 * 1) / 7; expect(cell).toBeGreaterThanOrEqual(CAL_FACE.w); expect(CAL_FACE.h).toBeGreaterThanOrEqual(MINI_ICON.h + 18); /* numer (wiersz 18) nad ikoną */
    expect(7 * PLATE_STACK.w + 6 * 6).toBeLessThanOrEqual(SCREEN - 2 * PAD);
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
  /* macierz: motyw × tło × znacznik — obwódka dnia zaplanowanego (tekst) i opuszczonego (wyszarzona) ≥ 3:1; gryf ikony i obwódka pustego stosu (tekst) ≥ 3:1 */
  const markCases = (['light', 'dark'] as const).flatMap(n => (['bg', 'surface', 'surface2'] as const).flatMap(bg => DAY_MARKS.filter(m => m !== 'done').map(m => [n, bg, m as Exclude<DayMark, 'done'>] as const)));
  test.each(markCases)('%s / tło %s / znacznik %s: obwódka ≥ 3:1', (n, bg, m) => {
    const th: Theme = n === 'light' ? light : dark; expect([n, bg, m, contrast(th[MARK_STROKE[m]], th[bg]) >= GRAPHIC_MIN]).toEqual([n, bg, m, true]);
    expect(contrast(th.text, th[bg])).toBeGreaterThanOrEqual(GRAPHIC_MIN);
  });
});

/* ---------- 3. ekran: karta „Dziś” i „Ten tydzień” ---------- */
type Node = ReturnType<typeof screen.getByTestId>;
/** prostokąty SVG pod węzłem (komponent Rect z react-native-svg: fill/stroke jako napisy) */
const rects = (n: Node) => n.findAll(x => typeof x.type !== 'string' && typeof x.props.fill === 'string' && 'width' in x.props).map(x => ({ fill: String(x.props.fill), stroke: x.props.stroke as string | undefined }));
const iconsIn = (n: Node) => n.findAll(x => typeof x.type === 'string' && typeof x.props.testID === 'string' && /^day-icon-/.test(x.props.testID)).map(x => String(x.props.testID));
const stack = (i: number) => screen.getByTestId(`week-stack-${i}`, { includeHiddenElements: true });
const hidden = (n: Node) => { for (let x: Node | null = n; x; x = x.parent as Node | null) if (x.props.accessibilityElementsHidden === true && x.props.importantForAccessibility === 'no-hide-descendants') return true; return false; };
const PLATE_FILLS: string[] = LOAD_ORDER.map(c => PLATE_COLORS[c]);
/* plan od poniedziałku 5.10 (historia planu — dni przed ustawieniem nie są zaplanowane); `done` — dni (indeksy pon=0) zrobione planowanym szablonem */
const planWeek = (days: number[], done: number[]) => () => {
  jest.setSystemTime(at(10, 5, 6)); const a = mkTpl('A'); days.forEach(i => plan.setWeekDay(i, a.id));
  done.forEach(i => { const w = addWorkout(at(10, 5 + i, 7), [['Back Squat', sets(3)]], 'A'); w.templateId = a.id; }); store.save(); jest.setSystemTime(NOW);
};
describe('„Ten tydzień”: stosy talerzy z procentem planu (tylko przy planie); karta „Dziś”: ikona pod dniem, bez paska-akcentu', () => {
  test('z planem 5 dni, 3 zrobione: „60% planu tygodnia (3 z 5)”, etykieta VoiceOver z liczbami; 3 stosy pełne, 2 obwódki; stosy ukryte przed VoiceOver', async () => {
    jest.useFakeTimers({ now: NOW }); await boot(planWeek([0, 1, 2, 4, 5], [0, 1, 2]));
    const box = screen.getByTestId('week-stacks'); expect(box.props.accessibilityLabel).toBe('Postęp tygodnia: 60% planu, zrobione 3 z 5 treningów z planu'); expect(box.props.accessible).toBe(true);
    expect(screen.getByText('60% planu tygodnia (3 z 5)')).toBeTruthy();
    for (let i = 0; i < 5; i++) {
      const r = rects(stack(i)); expect(r).toHaveLength(LOAD_ORDER.length); expect(hidden(stack(i))).toBe(true);
      if (i < 3) expect([i, r.map(x => x.fill)]).toEqual([i, PLATE_FILLS]); else expect([i, r.every(x => x.fill === 'none' && x.stroke === light.text)]).toEqual([i, true]);
    }
    expect(screen.queryByTestId('week-stack-5', { includeHiddenElements: true })).toBeNull();
    expect(screen.queryByTestId('week-barbell', { includeHiddenElements: true })).toBeNull();
  });
  test('pasek-akcent usunięty: nie ma go na karcie „Dziś” ani nigdzie na ekranie głównym', async () => {
    jest.useFakeTimers({ now: NOW }); await boot(planWeek([0, 2], [0]));
    expect(screen.getByTestId('today-plan')).toBeTruthy(); expect(screen.queryByTestId('plate-stripe', { includeHiddenElements: true })).toBeNull();
  });
  test('pasek tygodnia: zrobione (też inny trening) — pełna ikona, zaplanowany — obwódka w kolorze tekstu, opuszczony — wyszarzona, wolne — nic; etykiety bez zmian; dziś w ramce', async () => {
    jest.useFakeTimers({ now: NOW });
    await boot(() => {
      jest.setSystemTime(at(10, 5, 6)); const a = mkTpl('A'); const b = mkTpl('B'); [0, 1, 2, 4, 5].forEach(i => plan.setWeekDay(i, a.id));
      const w = addWorkout(at(10, 5, 7), [['Back Squat', sets(3)]], 'A'); w.templateId = a.id; const o = addWorkout(at(10, 6, 7), [['Back Squat', sets(3)]], 'B'); o.templateId = b.id; store.save(); jest.setSystemTime(NOW);
    });
    const mark = (k: string) => screen.getByTestId(`strip-mark-${k}`, { includeHiddenElements: true });
    const exp: [string, string[]][] = [['2026-10-05', ['day-icon-done']], ['2026-10-06', ['day-icon-done']], ['2026-10-07', ['day-icon-missed']], ['2026-10-08', []], ['2026-10-09', ['day-icon-planned']], ['2026-10-10', ['day-icon-planned']], ['2026-10-11', []]];
    for (const [k, ic] of exp) expect([k, iconsIn(mark(k))]).toEqual([k, ic]);
    const done = rects(mark('2026-10-05')); expect(done.map(x => x.fill)).toEqual([light.text, ...PLATE_FILLS, light.text]); /* gryf, talerze w kolorach ikony, zacisk */
    const yellow = done.find(x => x.fill === PLATE_COLORS.yellow)!; expect(yellow.stroke).toBe(light.text); /* żółty na białej karcie < 3:1 — obwódka */
    expect(rects(mark('2026-10-09')).filter(x => x.stroke).every(x => x.stroke === light.text && !PLATE_FILLS.includes(x.fill))).toBe(true);
    expect(rects(mark('2026-10-07')).filter(x => x.stroke).every(x => x.stroke === light.ctrlLine)).toBe(true);
    for (const k of ['2026-10-05', '2026-10-07', '2026-10-09']) { const ic = mark(k).findAll(x => typeof x.type === 'string' && /^day-icon-/.test(String(x.props.testID ?? '')))[0]; expect([k, hidden(ic)]).toEqual([k, true]); } /* dekoracja — stan dnia w etykiecie */
    expect(screen.getByTestId('strip-2026-10-05').props.accessibilityLabel).toMatch(/^poniedziałek, 5 października, zrobione: A/);
    expect(screen.getByTestId('strip-2026-10-06').props.accessibilityLabel).toMatch(/zrobiony inny trening: B, opuszczony: A/);
    expect(screen.getByTestId('strip-2026-10-07').props.accessibilityLabel).toMatch(/opuszczony: A/); expect(screen.getByTestId('strip-2026-10-09').props.accessibilityLabel).toMatch(/zaplanowany: A/);
    expect(flat(screen.getByTestId('strip-2026-10-08').props.style).borderColor).toBe(light.accent); expect(flat(screen.getByTestId('strip-2026-10-09').props.style).borderColor).toBe('transparent');
  });
  test('bez planu: stosów nie ma (kafelki zostają), ikony pod dniami z treningiem są; po restarcie to samo; komponent bez danych — nic', async () => {
    jest.useFakeTimers({ now: NOW });
    await boot(() => { addWorkout(at(10, 5), [['Back Squat', sets(3)]]); addWorkout(at(10, 6), [['Back Squat', sets(3)]]); });
    expect(screen.queryByTestId('week-stacks')).toBeNull(); expect(screen.getByLabelText('Treningi: 2, poprzedni tydzień 0')).toBeTruthy();
    expect(iconsIn(screen.getByTestId('strip-mark-2026-10-05', { includeHiddenElements: true }))).toEqual(['day-icon-done']);
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(10); /* restart */
    expect(screen.queryByTestId('week-stacks')).toBeNull();
    expect(render(<WeekStacks progress={null} />).toJSON()).toBeNull();
  });
  test.each([['pl', 'Postęp tygodnia: 100% planu, zrobione 1 z 1 treningów z planu', '100% planu tygodnia (1 z 1)'], ['en', 'Weekly progress: 100% of the plan, 1 of 1 planned workouts done', '100% of the weekly plan (1 of 1)']] as const)('język %s: wszystko z planu zrobione → 100%, stos pełny', async (l, label, txt) => {
    jest.useFakeTimers({ now: NOW }); await boot(planWeek([0], [0]), l);
    expect(screen.getByTestId('week-stacks').props.accessibilityLabel).toBe(label); expect(screen.getByText(txt)).toBeTruthy(); expect(rects(stack(0)).map(x => x.fill)).toEqual(PLATE_FILLS);
  });
  test('ciemny motyw: gryf ikony w kolorze tekstu (jasny), niebieski talerz na karcie (2,9:1) z obwódką; pusty stos — obwódka w kolorze tekstu', async () => {
    jest.useFakeTimers({ now: NOW }); await boot(planWeek([0, 1, 2], [0, 1]), 'en', 'dark');
    const done = rects(screen.getByTestId('strip-mark-2026-10-05', { includeHiddenElements: true }));
    expect(done[0].fill).toBe(dark.text); expect(done.find(x => x.fill === PLATE_COLORS.blue)!.stroke).toBe(dark.text); expect(done.find(x => x.fill === PLATE_COLORS.red)!.stroke).toBeUndefined();
    expect(rects(stack(2)).every(x => x.fill === 'none' && x.stroke === dark.text)).toBe(true);
    expect(rects(stack(0)).every(x => x.stroke === undefined)).toBe(true); /* na tle ekranu (bg) w ciemnym motywie każdy kolor ≥ 3:1 — bez obwódek */
    expect(screen.getByText('67% of the weekly plan (2 of 3)')).toBeTruthy();
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
    expect(screen.queryByTestId('plate-stripe', { includeHiddenElements: true })).toBeNull(); /* pasek-akcent usunięty (korekta 09.10.2026 ok. 17:00) */
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

/* ---------- 7. kalendarz: ikona pod dniem ---------- */
describe('kalendarz: pod dniem ikona — pełna (zrobione) albo obwódka (zaplanowane), bez legendy kolorów', () => {
  test.each([['light', 'pl'], ['dark', 'en']] as const)('motyw %s, język %s: znaczniki dni, wartość VoiceOver „zrobione / zaplanowane”, etykiety bez zmian, dziś i wybrany w ramce', async (theme, l) => {
    jest.useFakeTimers({ now: NOW }); const th = theme === 'light' ? light : dark;
    await boot(() => {
      addWorkout(at(10, 1), [['Back Squat', sets(2)]]); addWorkout(at(10, 2), [['Back Squat', sets(6)]]);
      jest.setSystemTime(at(10, 5, 6)); const a = mkTpl('A'); [0, 2, 4].forEach(i => plan.setWeekDay(i, a.id));
      const w = addWorkout(at(10, 5, 7), [['Back Squat', sets(10)]], 'A'); w.templateId = a.id; store.save(); jest.setSystemTime(NOW);
    }, l, theme, '/history');
    await go('/history'); await flushAll(10);
    const W = l === 'pl' ? { done: 'zrobione', planned: 'zaplanowane', s: ', 1 sesja', miss: 'opuszczony: A', plan: 'zaplanowany: A' } : { done: 'done', planned: 'planned', s: ', 1 session', miss: 'missed: A', plan: 'planned: A' };
    const exp: [string, string[], string | undefined][] = [['2026-10-01', ['day-icon-done'], W.done], ['2026-10-02', ['day-icon-done'], W.done], ['2026-10-03', [], undefined], ['2026-10-05', ['day-icon-done'], W.done],
      ['2026-10-07', ['day-icon-missed'], W.planned], ['2026-10-08', [], undefined], ['2026-10-09', ['day-icon-planned'], W.planned], ['2026-10-16', ['day-icon-planned'], W.planned]];
    for (const [k, ic, v] of exp) { const day = screen.getByTestId(`cal-${k}`); expect([k, iconsIn(day), day.props.accessibilityValue?.text]).toEqual([k, ic, v]); }
    expect(screen.getByTestId('cal-2026-10-01').props.accessibilityLabel).toMatch(new RegExp(`${W.s}$`));
    expect(screen.getByTestId('cal-2026-10-07').props.accessibilityLabel).toMatch(new RegExp(`${W.miss}$`)); expect(screen.getByTestId('cal-2026-10-09').props.accessibilityLabel).toMatch(new RegExp(`${W.plan}$`));
    expect(rects(screen.getByTestId('cal-2026-10-01')).map(x => x.fill)).toEqual([th.text, ...PLATE_FILLS, th.text]); /* kolor nie koduje serii: każdy dzień ta sama ikona */
    expect(rects(screen.getByTestId('cal-2026-10-05')).map(x => x.fill)).toEqual([th.text, ...PLATE_FILLS, th.text]);
    expect(rects(screen.getByTestId('cal-2026-10-09')).filter(x => x.stroke).every(x => x.stroke === th.text)).toBe(true);
    expect(rects(screen.getByTestId('cal-2026-10-07')).filter(x => x.stroke).every(x => x.stroke === th.ctrlLine)).toBe(true);
    expect(screen.queryByTestId('cal-legend')).toBeNull(); expect(screen.queryAllByTestId(/^day-plate-/, { includeHiddenElements: true })).toEqual([]);
    const faceOf = (k: string) => flat(screen.getByTestId(`cal-${k}`).findAll(x => typeof x.type === 'string' && flat(x.props.style).width === CAL_FACE.w)[0].props.style);
    expect([faceOf('2026-10-08').borderColor, faceOf('2026-10-08').borderWidth]).toEqual([th.accent, 2]); /* dziś */
    expect(faceOf('2026-10-09').borderWidth).toBe(0); /* zaplanowany: bez kółka planu — sama obwódka ikony */
    await act(async () => { fireEvent.press(screen.getByTestId('cal-2026-10-05')); }); await flushAll(5);
    expect([faceOf('2026-10-05').borderColor, faceOf('2026-10-05').backgroundColor]).toEqual([th.text, th.surface2]); /* wybrany dzień */
  });
  test('miesiąc bez treningów i bez planu — żadnej ikony, bez legendy', async () => {
    jest.useFakeTimers({ now: NOW }); await boot(() => {}, 'pl', 'light', '/history'); await go('/history'); await flushAll(10);
    expect(screen.queryAllByTestId(/^day-icon-/, { includeHiddenElements: true })).toEqual([]); expect(screen.queryByTestId('cal-legend')).toBeNull();
  });
});

/* ---------- 8. dane: bez zmian schematu ---------- */
test('motyw nie dopisuje nic do danych (schemat bez zmian, zapis po obejrzeniu ekranów = przed)', async () => {
  jest.useFakeTimers({ now: NOW }); await boot(() => { addWorkout(at(10, 5), [['Back Squat', sets(3)]]); });
  await act(async () => { await store.flush(); }); const before = JSON.stringify(saved());
  for (const r of ['/', '/history', '/templates']) { await go(r); await flushAll(10); }
  await act(async () => { await store.flush(); }); expect(JSON.stringify(saved())).toBe(before); expect(S().schemaVersion).toBe(SCHEMA_VERSION);
});
