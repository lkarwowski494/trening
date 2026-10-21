/*
 * Redesign M3, partia p3 — Postępy i historia (design-spec §10 wiersze 6, 7, 9–12; ZM-04/W2, ZM-06/DEC-09/M1-026, W1 c, 04-studio-projektowe-010).
 * Rodzaje (docs/20): ekran (każdy zmieniony ekran), scenariusz (usunięcie sesji ze szczegółów, wybór ćwiczenia w Postępach), macierz (stany Postępów i sesji,
 * pl/en), niezmienniki („—” zamiast „0”, jeden przycisk „Usuń sesję”, kolejność wykres → rekordy → wybór), regresja (gest na liście zostaje).
 * Zrzuty układu 320 pt: npm run screens (scripts/screens/shoot.mjs); E2E: .maestro/05, 13, 19, 28, 29.
 */
import React from 'react';
import * as RN from 'react-native';
import { StyleSheet, Appearance } from 'react-native';
import { light, dark, RADIUS, SPACE } from '@/lib/theme';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { fresh, ex, addWorkout, pressAlert, saved } from './helpers';
import { renderApp, flushAll, screen, go, act, tap, type, swipeDelete } from './app';

jest.setTimeout(60000);
const S = () => store.getState();
const lastAlert = () => global.__alerts[global.__alerts.length - 1];
let scheme: 'light' | 'dark' = 'light';
beforeEach(() => { /* motyw jak w tests/motyw.test.tsx: ustawienie → Appearance.setColorScheme → useColorScheme */
  jest.spyOn(Appearance, 'setColorScheme').mockImplementation(((v: string | null | undefined) => { scheme = v === 'dark' ? 'dark' : 'light'; }) as never);
  jest.spyOn(RN, 'useColorScheme').mockImplementation((() => scheme) as never);
});
afterEach(async () => { jest.restoreAllMocks(); scheme = 'light'; await timer.stop(); await timer.stopSet(); });
const boot = async (fn: () => void = () => {}, url?: string, locale: 'pl' | 'en' = 'pl') => { await fresh(undefined, locale); fn(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url, locale }); await flushAll(10); };
const DAY = 86400e3;
const squat = (at: number, w: number, reps: number) => addWorkout(at, [['Back Squat', [{ weight: w, reps }]]], 'Góra A');
/* Drzewo testowe jako płaska lista: testID i teksty w kolejności na ekranie (żeby sprawdzić „wykres i rekordy na górze, wybór pod nimi”). */
type TNode = { props?: Record<string, unknown>; children?: (TNode | string)[] | null };
const flat = (): { id?: string; text?: string }[] => { const out: { id?: string; text?: string }[] = []; const walk = (n: TNode | string | null | undefined) => { if (n == null) return; if (typeof n === 'string') { out.push({ text: n }); return; } if (n.props?.testID) out.push({ id: String(n.props.testID) }); (n.children ?? []).forEach(walk); }; const j = screen.toJSON() as unknown as TNode | TNode[]; (Array.isArray(j) ? j : [j]).forEach(walk); return out; };
/** Pozycja pierwszego testID albo tekstu w drzewie (-1 gdy brak). */
const at = (idOrText: string) => flat().findIndex(x => x.id === idOrText || x.text === idOrText);
const order = (...ids: string[]) => ids.map(at);
/** Teksty potomków elementu o danym testID. */
const textsIn = (id: string): string[] => { const all = flat(); const i = all.findIndex(x => x.id === id); if (i < 0) return []; const out: string[] = []; const j = screen.toJSON() as unknown as TNode | TNode[]; const find = (n: TNode | string): TNode | null => { if (typeof n === 'string') return null; if (n.props?.testID === id) return n; for (const c of n.children ?? []) { const r = find(c); if (r) return r; } return null; }; const root = (Array.isArray(j) ? j : [j]).map(find).find(Boolean); const collect = (n: TNode | string) => { if (typeof n === 'string') out.push(n); else (n.children ?? []).forEach(collect); }; if (root) collect(root); return out; };

describe('Szczegóły sesji — „Usuń sesję” na dole (ZM-04, W2)', () => {
  test('przycisk jest na dole, po ćwiczeniach i „Zapisz jako szablon”; „Edytuj” zostaje w nagłówku treści; gest na liście zostaje', async () => {
    let wid = ''; await boot(() => { wid = squat(Date.now() - DAY, 100, 5).id; }, '/history/x'); await go(`/history/${wid}`); await flushAll(10);
    const [tpl, del] = [screen.getByText('Zapisz jako szablon'), screen.getByTestId('delete-object')];
    expect(screen.getByText('Usuń sesję')).toBeTruthy(); expect(screen.getByLabelText('Edytuj sesję')).toBeTruthy();
    const json = JSON.stringify(screen.toJSON()); expect(json.indexOf('Zapisz jako szablon')).toBeLessThan(json.indexOf('"testID":"delete-object"')); expect(tpl).toBeTruthy(); expect(del).toBeTruthy();
    await go('/history'); await flushAll(10); expect(screen.queryAllByLabelText(/^Usuń sesję: /, { includeHiddenElements: true }).length).toBeGreaterThan(0); /* gest zostaje skrótem (DEC-12) */
  });
  test('okno jak gest: pytanie z obiektem i datą, [Anuluj, Usuń]; „Anuluj” zostawia sesję, „Usuń” usuwa ją i wraca do listy', async () => {
    let wid = ''; await boot(() => { wid = squat(Date.now() - DAY, 100, 5).id; squat(Date.now() - 2 * DAY, 90, 5); }); await go('/history'); await flushAll(10); await go(`/history/${wid}`); await flushAll(10);
    await tap(screen.getByTestId('delete-object')); const a = lastAlert(); expect(a.title).toBe('Usunąć tę sesję z historii?'); expect(a.msg).toMatch(/^Góra A, /); expect(a.buttons!.map((b: any) => b.text)).toEqual(['Anuluj', 'Usuń']);
    await act(async () => { pressAlert('Usunąć tę sesję z historii?', 'Anuluj'); }); await flushAll(5); expect(S().workouts).toHaveLength(2);
    await tap(screen.getByTestId('delete-object')); await act(async () => { pressAlert('Usunąć tę sesję z historii?', 'Usuń'); }); await flushAll(10);
    expect(S().workouts.map(w => w.id)).not.toContain(wid); expect(S().workouts).toHaveLength(1);
    expect(screen.queryByTestId('delete-object')).toBeNull(); expect(screen.getByTestId('planning-button')).toBeTruthy(); /* po usunięciu — z powrotem lista (zakładka Plan) */
  });
  test.each([['kopia w Zdrowiu', 'abc', 'Kopia w Apple Health zostanie — usuniesz ją w aplikacji Zdrowie.'], ['trening z zegarka', 'watch', 'Trening z zegarka w Apple Health zostanie — usuniesz go w aplikacji Zdrowie.'], ['bez kopii', null, '']] as const)('dopisek o kopii w Zdrowiu: %s', async (_n, uuid, note) => {
    let wid = ''; await boot(() => { const w = squat(Date.now() - DAY, 100, 5); w.healthUUID = uuid as never; wid = w.id; }); await go(`/history/${wid}`); await flushAll(10);
    await tap(screen.getByTestId('delete-object')); const lines = String(lastAlert().msg).split('\n'); expect(lines[0]).toMatch(/^Góra A, /); expect(lines.slice(1).join('\n')).toBe(note);
  });
  test('okno z przycisku i z gestu ma identyczną treść (także z kopią w Zdrowiu)', async () => {
    let wid = ''; await boot(() => { const w = squat(Date.now() - DAY, 100, 5); w.healthUUID = 'abc' as never; wid = w.id; }); await go('/history'); await flushAll(10);
    await swipeDelete(/^Usuń sesję: /); const g = lastAlert(); await act(async () => { pressAlert('Usunąć tę sesję z historii?', 'Anuluj'); });
    await go(`/history/${wid}`); await flushAll(10); await tap(screen.getByTestId('delete-object')); const b = lastAlert(); expect([b.title, b.msg]).toEqual([g.title, g.msg]);
  });
  test('sesja, której nie ma (stary link): „Brak sesji.” z przyciskiem „Wróć”, bez „Usuń sesję”', async () => {
    await boot(() => {}); await go('/history/nie-ma'); await flushAll(10); expect(screen.getByText('Brak sesji.')).toBeTruthy(); expect(screen.queryByTestId('delete-object')).toBeNull(); expect(screen.getByText('Wróć')).toBeTruthy();
  });
  test('English: „Delete session”, to samo okno „Delete this session from history?” [Cancel, Delete]', async () => {
    let wid = ''; await boot(() => { wid = squat(Date.now() - DAY, 100, 5).id; }, undefined, 'en'); await go(`/history/${wid}`); await flushAll(10);
    expect(screen.getByText('Delete session')).toBeTruthy(); await tap(screen.getByTestId('delete-object')); expect(lastAlert().title).toBe('Delete this session from history?'); expect(lastAlert().buttons!.map((b: any) => b.text)).toEqual(['Cancel', 'Delete']);
  });
});

describe('Szczegóły sesji — brak wyniku to „—”, nie „0” (04-studio-projektowe-010)', () => {
  test('seria bez powtórzeń, czasu i dystansu: w komórkach „—”; zapisane wartości bez zmian', async () => {
    let wid = ''; await boot(() => { wid = addWorkout(Date.now() - DAY, [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: '' }]], ['Plank', [{ durationSec: '' }, { durationSec: 45 }]]]).id; }); await go(`/history/${wid}`); await flushAll(10);
    const rows = screen.getAllByLabelText(/^#: /); const labels = rows.map(r => r.props.accessibilityLabel as string);
    const sq = labels.filter(l => /kg:/.test(l)); expect(sq[0]).toMatch(/Pow\.: 5/); expect(sq[1]).toMatch(/Pow\.: —/); expect(sq[1]).not.toMatch(/Pow\.: 0/);
    const pl = labels.filter(l => /Czas/.test(l)); expect(pl[0]).toMatch(/Czas: —/); expect(pl[1]).not.toMatch(/Czas: —/); expect(pl.join()).not.toMatch(/Czas: 0/);
  });
  test('macierz metryk: dystans bez wartości — „—”; waga ciała ±0 wpisana — nadal „0”', async () => {
    let wid = ''; await boot(() => { wid = addWorkout(Date.now() - DAY, [['Back Squat', [{ weight: '', reps: 3 }, { weight: 0, reps: 3 }]]]).id; }); await go(`/history/${wid}`); await flushAll(10);
    const l = screen.getAllByLabelText(/^#: /).map(r => r.props.accessibilityLabel as string); expect(l[0]).toMatch(/: —, Pow\.: 3/); expect(l[1]).toMatch(/: 0, Pow\.: 3/); /* brak ciężaru ≠ wpisane 0 */
  });
});

describe('Zakładka Plan — „Planowanie” w nagłówku, jak na starcie (W1 c, decyzja STOP 3)', () => {
  test('jeden przycisk „Planowanie” w wierszu tytułu (PlanningButton, 44 pt), prowadzi do planu; „Dopisz trening wstecz” zostaje w treści', async () => {
    await boot(() => {}); await go('/history'); await flushAll(10);
    expect(screen.getAllByText('Planowanie')).toHaveLength(1); const b = screen.getByTestId('planning-button'); expect(b.props.accessibilityRole).toBe('button');
    const [pb, back] = order('planning-button', 'Dopisz trening wstecz'); expect(pb).toBeGreaterThan(-1); expect(pb).toBeLessThan(back); /* przycisk przy tytule, przed wierszem akcji */
    await tap(b); await flushAll(10); expect(screen.getByTestId('plan-name')).toBeTruthy(); /* ekran Planowanie */
  });
  test('baner deloadu mieści się w szerokości (przycisk zawija tekst zamiast wychodzić poza ekran)', async () => {
    const src = require('fs').readFileSync(require('path').join(__dirname, '../components/DeloadHint.tsx'), 'utf8'); expect(src).toMatch(/maxWidth: '100%'/); expect(src).toMatch(/flexShrink: 1/);
  });
});

describe('Postępy — wykres i rekordy na górze, wybór pod nimi (ZM-06, DEC-09, M1-026)', () => {
  const seed = () => { squat(Date.now() - 3 * DAY, 80, 5); squat(Date.now() - 2 * DAY, 90, 5); addWorkout(Date.now() - DAY, [['Bench Press (sztanga)', [{ weight: 60, reps: 8 }]]], 'Góra B'); };
  test('z historią: bez wyboru pokazany jest ostatnio trenowane ćwiczenie — wykres i rekordy, potem wybór, potem reszta', async () => {
    await boot(seed, '/progress'); await flushAll(10);
    const [hero, rec, pick, over] = order('progress-hero', 'progress-records', 'progress-chooser', 'progress-overview'); expect([hero, rec, pick, over].every(i => i >= 0)).toBe(true); expect(hero).toBeLessThan(rec); expect(rec).toBeLessThan(pick); expect(pick).toBeLessThan(over);
    expect(screen.getByTestId('progress-hero')).toBeTruthy(); expect(screen.getAllByText('Bench Press (sztanga)').length).toBeGreaterThan(0); /* najnowszy trening */
  });
  test('wybór ćwiczenia: chipy tylko ćwiczeń z danymi; reszta przez wyszukiwanie („Nic nie pasuje.” bez wyników)', async () => {
    await boot(seed, '/progress'); await flushAll(10);
    const t = textsIn('progress-chooser'); expect(t).toContain('Back Squat'); expect(t).toContain('Bench Press (sztanga)'); expect(t).not.toContain('Plank'); expect(t).not.toContain('Pull Up');
    await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'plank'); await flushAll(5); expect(screen.getByLabelText('Plank')).toBeTruthy();
    await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'zzzz'); await flushAll(5); expect(screen.getByText('Nic nie pasuje.')).toBeTruthy();
  });
  test('stuknięcie chipa zmienia ćwiczenie w wykresie i rekordach; ćwiczenie bez sesji (z wyszukiwania) — „Brak zapisanych sesji z tym ćwiczeniem.”', async () => {
    await boot(seed, '/progress'); await flushAll(10);
    await tap(screen.getByLabelText('Back Squat')); await flushAll(10); expect(screen.getByTestId('progress-hero')).toBeTruthy(); expect(screen.getAllByText('Max ciężar').length).toBeGreaterThan(0);
    await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'plank'); await flushAll(5); await tap(screen.getByLabelText('Plank')); await flushAll(10);
    expect(screen.getByText('Brak zapisanych sesji z tym ćwiczeniem.')).toBeTruthy(); expect(screen.queryByTestId('progress-hero')).toBeNull(); expect(screen.getByTestId('progress-chooser')).toBeTruthy(); /* wybór zostaje — da się wrócić */
  });
  test('chipy: wybrane ćwiczenie jest zaznaczone i bez podpowiedzi, pozostałe mają podpowiedź „Tapnij, by wybrać inne ćwiczenie.”', async () => {
    await boot(seed, '/progress'); await flushAll(10);
    const sel = screen.getByLabelText('Bench Press (sztanga)'); const other = screen.getByLabelText('Back Squat');
    expect(sel.props.accessibilityState.selected).toBe(true); expect(sel.props.accessibilityHint).toBeUndefined();
    expect(other.props.accessibilityState.selected).toBe(false); expect(other.props.accessibilityHint).toBe('Tapnij, by wybrać inne ćwiczenie.');
  });
  test('wejście z ćwiczenia (/progress?ex=…) pokazuje to ćwiczenie na górze', async () => {
    let id = ''; await boot(() => { seed(); id = ex('Back Squat').id; }, '/progress'); await go(`/progress?ex=${id}`); await flushAll(10);
    expect(screen.getByTestId('progress-hero')).toBeTruthy(); expect(textsIn('progress-hero')).toContain('Back Squat');
  });
  test('rekordy: tylko wartości, bez zer; przy braku wartości wiersza go nie ma (nie „0”)', async () => {
    await boot(seed, '/progress'); await flushAll(10);
    const rec = textsIn('progress-records'); expect(rec).toContain('Max ciężar'); expect(rec.filter(x => /^0(,0+)?( kg)?$/.test(x.trim()))).toEqual([]);
  });
  test('ogólny przegląd (okres vs okres, strażnik, serie per partia) jest pod wyborem, także przy wybranym ćwiczeniu', async () => {
    await boot(seed, '/progress'); await flushAll(10); expect(screen.getByText('Serie robocze tygodniowo')).toBeTruthy(); await tap(screen.getByLabelText('Back Squat')); await flushAll(10); expect(screen.getByText('Serie robocze tygodniowo')).toBeTruthy();
  });
  test('stan widoku (przewinięcie) zachowany w zakładce — jak dotąd', async () => {
    await boot(seed, '/progress'); await flushAll(10); expect(screen.getByTestId('progress-scroll')).toBeTruthy();
  });
});

describe('Postępy — bez historii: sam pusty stan z „Zacznij trening” (ZM-06, motyw A2)', () => {
  test('motyw (Empty), zdanie i przycisk główny; bez wykresu, wyszukiwania i chipów; przycisk prowadzi na Start', async () => {
    await boot(() => {}, '/progress'); await flushAll(10);
    expect(screen.getByTestId('empty')).toBeTruthy(); expect(screen.getByText('Wykresy pojawią się po pierwszym zakończonym treningu.')).toBeTruthy();
    const b = screen.getByTestId('progress-start'); expect(screen.getAllByText('Zacznij trening')).toHaveLength(1);
    expect(screen.queryByTestId('progress-hero')).toBeNull(); expect(screen.queryByPlaceholderText('Szukaj ćwiczenia…')).toBeNull(); expect(screen.queryByTestId('progress-chooser')).toBeNull(); expect(screen.queryByText('Ćwiczenie')).toBeNull();
    await tap(b); await flushAll(10); expect(screen.getByTestId('start-panel')).toBeTruthy(); /* zakładka Trening (Start) */
  });
  test('English: „Start a workout” i zdanie po angielsku', async () => {
    await boot(() => {}, '/progress', 'en'); await flushAll(10); expect(screen.getByText('Start a workout')).toBeTruthy(); expect(screen.getByText('Charts appear after your first finished workout.')).toBeTruthy();
  });
  test('masa ciała: pomiary wpisane wcześniej nie giną z ekranu (wejście do pomiarów zostaje)', async () => {
    await boot(() => { store.addBodyMass(80, '2026-10-01'); }, '/progress'); await flushAll(10); expect(screen.getByText('Masa ciała — pomiary')).toBeTruthy(); expect(screen.getByTestId('progress-start')).toBeTruthy();
  });
});

describe('wygląd: jasny i ciemny motyw, tokeny (design-spec §1, §10)', () => {
  const flatStyle = (el: { props: { style?: unknown } }) => { const st = el.props.style; return StyleSheet.flatten((typeof st === 'function' ? st({ pressed: false }) : st) as never) as Record<string, unknown>; };
  const seed = () => { squat(Date.now() - 2 * DAY, 80, 5); squat(Date.now() - DAY, 90, 5); };
  test.each([['jasny', light, 'light'], ['ciemny', dark, 'dark']] as const)('Postępy, motyw %s: karta wykresu i grupa rekordów na surface, promień grupy 12', async (_n, pal, theme) => {
    await fresh(); seed(); store.getState().settings.theme = theme; store.saveCfg(); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: '/progress' }); await flushAll(10);
    for (const id of ['progress-hero', 'progress-records']) expect(flatStyle(screen.getByTestId(id))).toMatchObject({ backgroundColor: pal.surface, borderRadius: RADIUS.group });
    expect(flatStyle(screen.getByTestId('progress-hero'))).toMatchObject({ padding: SPACE.l });
  });
  test.each([['jasny', light, 'light'], ['ciemny', dark, 'dark']] as const)('szczegóły sesji, motyw %s: „Usuń sesję” — danger, przezroczysty z obrysem, 52 pt, odstęp 24 pt od treści', async (_n, pal, theme) => {
    await fresh(); const w = squat(Date.now() - DAY, 100, 5); store.getState().settings.theme = theme; store.saveCfg(); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: `/history/${w.id}` }); await flushAll(10);
    expect(flatStyle(screen.getByTestId('delete-object'))).toMatchObject({ backgroundColor: 'transparent', borderColor: pal.danger, minHeight: 52 });
    expect(flatStyle(screen.getByTestId('delete-button-wrap'))).toMatchObject({ marginTop: SPACE.xl });
  });
  test('język en: komórki sesji i „—” bez zmian, rekordy po angielsku', async () => {
    let wid = ''; await boot(() => { wid = addWorkout(Date.now() - DAY, [['Back Squat', [{ weight: 100, reps: '' }]]]).id; }, undefined, 'en'); await go(`/history/${wid}`); await flushAll(10);
    expect(screen.getAllByLabelText(/^#: /)[0].props.accessibilityLabel).toMatch(/Reps: —/);
  });
});
