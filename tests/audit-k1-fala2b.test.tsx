/*
 * Audyt kontrolny 1 — fala 2b (backlog do 0.11, 09.10.2026): UX2-01 (dawne nazwy scalonych/przemianowanych ćwiczeń jako aliasy wyszukiwania),
 * UX2-05 (technika z treningu i szablonu), UX2-09 (opuszczony dzień: kolejność możliwości i stopka), UI2-02 (podwójne tapnięcie — wspólna blokada
 * przejść), UI2-10 (wybór ćwiczenia w edycji szablonu: „Utwórz …” i „Przywróć …” w szkicu). Opisy: scratchpad audit2/UX.md, audit2/UI.md.
 * Każdy blok zaczynał się od testu czerwonego przed naprawą (regresja, docs/20 rodzaj 8).
 */
import * as fs from 'fs';
import * as path from 'path';
import * as store from '@/lib/store';
import * as draft from '@/lib/draft';
import { fresh, ex, saved, addWorkout, pressAlert, set, withDemoTemplates } from './helpers';
import * as plan from '@/lib/plan';
import { renderApp, flushAll, screen, go, tap, type, act, fireEvent, openCard } from './app';
import { LIB_KEYS, LIB_RENAMED, LIB_MERGED, formerNamesOf, formerMatch, formerExact, seedState, type Template, type State } from '@/lib/seed';
import { applyLang, t, exName } from '@/lib/i18n';
import { namesIn } from './forbidden-names';

jest.setTimeout(60000);
afterEach(() => { draft.__resetObjDrafts(); applyLang('pl'); });

const S = () => store.getState();
const boot = async (fn: () => void = () => {}, url?: string, locale: 'pl' | 'en' = 'pl') => { await fresh(undefined, locale); fn(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url, locale }); await flushAll(10); };
const mkTpl = (name = 'Nogi') => { const tp = store.newTemplate(); tp.name = name; tp.items.push({ id: 'a', exerciseId: ex('Back Squat').id, sets: 3, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null }); store.save(tp); return tp; };

/* ---------------- UX2-01: dawne nazwy jako aliasy wyszukiwania ---------------- */
describe('UX2-01: dawne nazwy ćwiczeń z katalogu (scalone, przemianowane) — logika', () => {
  test('formerNamesOf: scalone i przemianowane wskazują ćwiczenie obecne; własne i bez historii nazw — pusto', async () => {
    await fresh();
    expect(formerNamesOf(ex('Biceps Curl (hantle)'))).toContain('Seated Dumbbell Curl');
    expect(formerNamesOf(ex('Back Squat'))).toEqual(expect.arrayContaining(['Narrow Stance Squats', 'Wide Stance Barbell Squat']));
    expect(formerNamesOf(ex('Upright Row (hantle)'))).toContain('Upright Row'); /* przemianowane */
    expect(formerNamesOf(store.newExercise('Moje'))).toEqual([]);
    expect(formerNamesOf(ex('Plank'))).toEqual([]);
    expect(formerNamesOf({ lib: true, libKey: 'nie ma' })).toEqual([]); expect(formerNamesOf({ lib: false, libKey: 'Back Squat' } as never)).toEqual([]); /* tylko ćwiczenie z biblioteki */
  });
  test('niezmiennik: każda dawna nazwa (renamed + merged, także łańcuchy) prowadzi do ćwiczenia obecnego w katalogu i trafia do aliasów dokładnie raz', () => {
    const all = [...Object.keys(LIB_RENAMED), ...Object.keys(LIB_MERGED)];
    const seen = new Map<string, number>();
    for (const k of LIB_KEYS) for (const n of formerNamesOf({ lib: true, libKey: k })) seen.set(n, (seen.get(n) ?? 0) + 1);
    for (const n of all) expect([n, seen.get(n)]).toEqual([n, 1]);
    for (const n of seen.keys()) expect(LIB_KEYS.has(n)).toBe(false); /* dawna nazwa nie jest nazwą obecnego ćwiczenia */
  });
  test('dawne nazwy nie zawierają nazw innych firm (trafiają do tekstów aplikacji — „dawniej: …”)', () => {
    const bad = [...Object.keys(LIB_RENAMED), ...Object.keys(LIB_MERGED)].filter(n => namesIn(n).length);
    expect(bad).toEqual([]);
  });
  test('formerMatch: fragment, wielkość liter, znaki diakrytyczne, pusty i zły tekst', async () => {
    await fresh(); const e = ex('Biceps Curl (hantle)');
    expect(formerMatch(e, 'seated dumbbell curl')).toBe('Seated Dumbbell Curl'); expect(formerMatch(e, 'seated dumb')).toBe('Seated Dumbbell Curl');
    expect(formerMatch(e, '')).toBeUndefined(); expect(formerMatch(e, 'zzz')).toBeUndefined(); expect(formerMatch(store.newExercise('X'), 'seated')).toBeUndefined();
    expect(formerMatch(ex('Reverse Fly (hantle)'), 'rear delt raise (hantle)')).toBe('Rear Delt Raise (hantle)');
    expect(formerExact(e, 'seated dumbbell curl')).toBe(true); expect(formerExact(e, 'seated dumb')).toBe(false); expect(formerExact(e, '')).toBe(false); expect(formerExact(store.newExercise('Seated Dumbbell Curl'), 'seated dumbbell curl')).toBe(false);
    applyLang('en'); expect(formerMatch(ex('Reverse Fly (hantle)'), 'rear delt raise (dumbbell)')).toBe('Rear Delt Raise (hantle)'); /* nawias po angielsku jak exName */
  });
});

describe('UX2-01: wyszukiwanie po dawnej nazwie — ekrany', () => {
  test('wybór ćwiczenia (edycja szablonu): „Seated Dumbbell Curl” pokazuje „Biceps Curl (hantle)” z dopiskiem „dawniej: …”, bez „Utwórz …”; wybór dodaje obecne ćwiczenie', async () => {
    let id = ''; await boot(() => { id = mkTpl().id; }); const n0 = S().exercises.length;
    await go(`/template/${id}`); await flushAll(10); await tap(screen.getByLabelText('Edytuj szablon')); await flushAll(5);
    await go(`/picker?target=template:${id}`); await flushAll(10);
    await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'Seated Dumbbell Curl'); await flushAll(5);
    expect(screen.queryByText('Utwórz „Seated Dumbbell Curl”')).toBeNull(); expect(screen.queryByText('Nic nie pasuje.')).toBeNull();
    expect(screen.getByText('Biceps Curl (hantle)')).toBeTruthy(); expect(screen.getByText(/dawniej: Seated Dumbbell Curl/)).toBeTruthy();
    await tap(screen.getByText('Biceps Curl (hantle)')); await flushAll(10);
    expect(draft.objDraft<Template>('template', id)!.items.map(i => i.exerciseId)).toContain(ex('Biceps Curl (hantle)').id); expect(S().exercises.length).toBe(n0);
  });
  test('zakładka Ćwiczenia: dawna nazwa znajduje obecne ćwiczenie, bez przycisku „Utwórz …”; zwykłe trafienie nazwy — bez dopisku', async () => {
    await boot(); await go('/exercises'); await flushAll(10);
    await type(screen.getByPlaceholderText('Szukaj…'), 'Narrow Stance Squats'); await flushAll(5);
    expect(screen.queryByText('Utwórz „Narrow Stance Squats”')).toBeNull(); expect(screen.getByText('Back Squat')).toBeTruthy(); expect(screen.getByText(/dawniej: Narrow Stance Squats/)).toBeTruthy();
    await type(screen.getByPlaceholderText('Szukaj…'), 'Back Squat'); await flushAll(5);
    expect(screen.queryByText(/dawniej:/)).toBeNull();
    await type(screen.getByPlaceholderText('Szukaj…'), 'Zupełnie Nowe'); await flushAll(5); expect(screen.getByText('Utwórz „Zupełnie Nowe”')).toBeTruthy(); /* bez aliasu — jak dotąd */
  });
  test('po angielsku: alias znajduje ćwiczenie, dopisek z nazwą w języku aplikacji', async () => {
    await boot(undefined, undefined, 'en'); await go('/exercises'); await flushAll(10);
    await type(screen.getByPlaceholderText(t('Szukaj…')), 'Seated Dumbbell Curl'); await flushAll(5);
    expect(screen.getByText(exName(ex('Biceps Curl (hantle)')))).toBeTruthy(); expect(screen.getByText(/formerly: Seated Dumbbell Curl/)).toBeTruthy();
    expect(screen.queryByText(/Create/)).toBeNull();
  });
  test('ekran ćwiczenia: „Dawne nazwy w bibliotece” w podglądzie (tylko gdy są)', async () => {
    await boot(); await go(`/exercise/${ex('Biceps Curl (hantle)').id}`); await flushAll(10);
    expect(screen.getByLabelText(/^Dawne nazwy w bibliotece: .*Seated Dumbbell Curl/)).toBeTruthy();
    await go(`/exercise/${ex('Plank').id}`); await flushAll(10); expect(screen.queryByLabelText(/^Dawne nazwy w bibliotece/)).toBeNull();
  });
  test('scenariusz 1002 (dane): „Seated Dumbbell Curl” z historią scalone przy starcie → po restarcie szukanie dawnej nazwy w treningu prowadzi do ćwiczenia z tą historią (bez duplikatu)', async () => {
    const s0 = JSON.parse(JSON.stringify(seedState('pl'))) as State; (s0 as State & { libExtraStep?: string }).libExtraStep = 'katalog-2026-10-05';
    s0.exercises.push({ ...s0.exercises.find(e => e.name === 'Biceps Curl (hantle)')!, id: 'old-sdc', name: 'Seated Dumbbell Curl', libKey: 'Seated Dumbbell Curl', lib: true });
    const at = Date.now() - 86400e3; s0.workouts = [{ id: 'w1', ownerId: 'local', createdAt: at, updatedAt: at, loggedBy: 'local', sessionMode: 'solo', healthUUID: null, templateId: null, templateName: 'T', startedAt: at, finishedAt: at + 3600e3, note: '',
      exercises: [{ id: 'b1', exerciseId: 'old-sdc', restSec: 90, repMin: null, repMax: null, groupId: null, sets: [set({ weight: 16, reps: 8, done: true })] }] } as never];
    await fresh(); await renderApp({ saved: JSON.parse(JSON.stringify(s0)) }); await flushAll(10);
    const target = ex('Biceps Curl (hantle)'); expect(S().exercises.some(e => e.id === 'old-sdc')).toBe(false); expect(S().workouts[0].exercises[0].exerciseId).toBe(target.id); /* scalone przy starcie */
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(10); /* restart */
    await act(async () => { store.startEmpty(); }); await flushAll(5); await go('/picker?target=active'); await flushAll(10);
    await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'Seated Dumbbell Curl'); await flushAll(5);
    expect(screen.queryByText('Utwórz „Seated Dumbbell Curl”')).toBeNull();
    await tap(screen.getByText('Biceps Curl (hantle)')); await flushAll(10);
    expect(S().active!.exercises.map(b => b.exerciseId)).toEqual([target.id]); expect(S().exercises.filter(e => /Seated Dumbbell Curl/i.test(e.name))).toEqual([]);
  });
});

/* ---------------- UX2-05: technika z treningu i szablonu ---------------- */
const routeNames = (): string[] => { const { store: rs } = require('expo-router/build/global-state/router-store'); const names: string[] = [];
  const walk = (st: { routes?: { name: string; state?: unknown }[] } | undefined) => st?.routes?.forEach(r => { names.push(r.name); walk(r.state as never); }); walk(rs.navigationRef.getRootState()); return names; };
const dbl = async (el: Parameters<typeof tap>[0]) => { await act(async () => { fireEvent.press(el); fireEvent.press(el); }); await flushAll(10); };
const cuesOpen = () => screen.getByTestId('exercise-cues-toggle').props.accessibilityState?.expanded;

describe('UX2-05: wskazówki techniki z treningu na żywo i z szablonu', () => {
  test('logika: hasCues — ćwiczenie bazowe z wskazówkami tak, własne i bez wskazówek nie; bez wczytywania słowników zdań', () => {
    jest.isolateModules(() => {
      const loaded: string[] = []; for (const l of ['pl', 'en', 'de']) { const real = jest.requireActual(`@/lib/cues/text/${l}.json`); jest.doMock(`@/lib/cues/text/${l}.json`, () => { loaded.push(l); return real; }); }
      const { hasCues } = require('@/lib/cues');
      expect(hasCues({ lib: true, libKey: 'Back Squat' })).toBe(true); expect(hasCues({ lib: false, libKey: 'Back Squat' })).toBe(false);
      expect(hasCues({ lib: true, libKey: 'nie ma' })).toBe(false); expect(hasCues(null)).toBe(false); expect(hasCues(undefined)).toBe(false);
      expect(loaded).toEqual([]);
      for (const l of ['pl', 'en', 'de']) jest.dontMock(`@/lib/cues/text/${l}.json`);
    });
  });
  test('trening na żywo: „ⓘ Technika” przy ćwiczeniu z wskazówkami otwiera podgląd ćwiczenia z rozwiniętą sekcją „Technika” na górze; podwójne tapnięcie — jeden ekran; własne ćwiczenie — bez przycisku', async () => {
    await boot(() => { S().settings.workoutView = 'list'; store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addExerciseToActive(store.newExercise('Moje ćwiczenie')); });
    expect(screen.getByLabelText('Technika: Back Squat')).toBeTruthy(); expect(screen.queryByLabelText('Technika: Moje ćwiczenie')).toBeNull();
    expect(screen.getByText('ⓘ Technika')).toBeTruthy();
    await dbl(screen.getByLabelText('Technika: Back Squat'));
    expect(routeNames().filter(n => n === 'exercise/[id]')).toHaveLength(1);
    expect(cuesOpen()).toBe(true); expect(screen.getByText('Ustawienie')).toBeTruthy();
    const json = JSON.stringify(screen.toJSON()); expect(json.indexOf('exercise-cues')).toBeGreaterThan(-1); expect(json.indexOf('exercise-cues')).toBeLessThan(json.indexOf('Partia: nogi')); /* B: sekcja nad danymi konfiguracji */
    expect(S().active!.exercises.length).toBe(2); /* trening bez zmian */
  });
  test('podgląd ćwiczenia z zakładki Ćwiczenia: sekcja „Technika” na górze, zwinięta', async () => {
    await boot(); await go(`/exercise/${ex('Back Squat').id}`); await flushAll(10);
    expect(cuesOpen()).toBe(false); expect(screen.queryByText('Ustawienie')).toBeNull();
    const json = JSON.stringify(screen.toJSON()); expect(json.indexOf('exercise-cues')).toBeLessThan(json.indexOf('Partia: nogi'));
  });
  test('podgląd szablonu i edytor szablonu: „ⓘ Technika” przy ćwiczeniu; w edycji otwarcie nie gubi szkicu', async () => {
    let id = ''; await boot(() => { id = mkTpl().id; }); await go(`/template/${id}`); await flushAll(10);
    expect(screen.getByLabelText('Technika: Back Squat')).toBeTruthy();
    await tap(screen.getByLabelText('Edytuj szablon')); await flushAll(5); draft.objDraft<Template>('template', id)!.name = 'Nogi 2';
    await openCard(0);
    await tap(screen.getByLabelText('Technika: Back Squat')); await flushAll(10);
    expect(cuesOpen()).toBe(true); expect(draft.objDraft<Template>('template', id)!.name).toBe('Nogi 2');
  });
  test('po angielsku: etykieta VoiceOver „Technique: …”', async () => {
    await boot(() => { S().settings.workoutView = 'list'; store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); }, undefined, 'en');
    expect(screen.getByLabelText(`Technique: ${exName(ex('Back Squat'))}`)).toBeTruthy();
  });
});

/* ---------------- UX2-09: opuszczony dzień — kolejność możliwości i stopka ---------------- */
const NOW = new Date(2026, 9, 8, 9, 0); /* czwartek 8.10.2026 */
const atDay = (k: string, h = 18) => new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10), h).getTime();
const bootPlan = async (fn: (ids: string[]) => void) => {
  jest.useFakeTimers({ now: NOW }); await fresh(); const tp = withDemoTemplates();
  jest.setSystemTime(atDay('2026-09-28', 9)); fn(tp.map(x => x.id)); jest.setSystemTime(NOW.getTime()); /* plan od 28.09 — minione dni tygodnia mają plan */
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: '/history' }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
  return tp;
};
const moveTitles = () => screen.getByTestId('suggestions').findAll((n: { props: Record<string, unknown> }) => typeof n.props.accessibilityLabel === 'string' && /^Zastosuj: /.test(n.props.accessibilityLabel as string))
  .map((n: { props: Record<string, unknown> }) => (n.props.accessibilityLabel as string).slice('Zastosuj: '.length)).filter((v: string, i: number, a: string[]) => a.indexOf(v) === i);
const FOOT = /dwa dni pod rząd przy tej samej liczbie serii/;

describe('UX2-09: opuszczony dzień — „Przesuń plan od dziś” i „Wolne” od razu widoczne; stopka bez sprzeczności', () => {
  test('logika suggestionOrder: dzień miniony — najlepsza, potem przesunięcie planu i wolne, reszta wg rankingu; dziś i przyszłość — bez zmian; pusta lista', () => {
    const mk = (kind: plan.Suggestion['kind'], to?: string) => ({ kind, to, changes: 1, newBackToBack: [], dropped: 0, returns: true, placed: [], ov: {} }) as plan.Suggestion;
    const L = [mk('move', 'a'), mk('move', 'b'), mk('move', 'c'), mk('move', 'd'), mk('shift'), mk('skip')];
    const past = plan.suggestionOrder(L, '2026-10-07', '2026-10-08');
    expect(past.map(x => `${x.kind}${x.to ?? ''}`)).toEqual(['movea', 'shift', 'skip', 'moveb', 'movec', 'moved']);
    expect(past.slice(0, plan.SUGGEST_FIRST).map(x => x.kind)).toEqual(expect.arrayContaining(['shift', 'skip']));
    expect(plan.suggestionOrder(L, '2026-10-08', '2026-10-08')).toEqual(L); expect(plan.suggestionOrder(L, '2026-10-09', '2026-10-08')).toEqual(L);
    const best = [mk('shift'), mk('move', 'a'), mk('skip')]; expect(plan.suggestionOrder(best, '2026-10-07', '2026-10-08').map(x => x.kind)).toEqual(['shift', 'skip', 'move']); /* najlepsza = przesunięcie */
    expect(plan.suggestionOrder([], '2026-10-07', '2026-10-08')).toEqual([]);
    expect(new Set(past)).toEqual(new Set(L)); /* nic nie ginie */
  });
  test('ekran: wczoraj opuszczony A, dziś B — bez „Więcej możliwości” widać „Przesuń plan od dziś” i „Wolne w tym dniu” obok polecanej', async () => {
    const tp = await bootPlan(ids => { plan.setWeekDay(2, ids[0]); plan.setWeekDay(3, ids[1]); });
    await tap(screen.getByTestId('cal-2026-10-07')); await flushAll(5); expect(screen.getByText(`Opuszczony: ${tp[0].name}`)).toBeTruthy();
    await tap(screen.getByText('Przesuń albo pomiń')); await flushAll(5);
    const shown = moveTitles(); expect(shown.length).toBeLessThanOrEqual(plan.SUGGEST_FIRST);
    expect(shown).toEqual(expect.arrayContaining(['Przesuń plan od dziś', 'Wolne w tym dniu']));
    expect(screen.getByText(/ · polecane$/)).toBeTruthy();
    await tap(screen.getByLabelText('Zastosuj: Przesuń plan od dziś')); await flushAll(5);
    expect([plan.plannedOn('2026-10-07'), plan.plannedOn('2026-10-08'), plan.plannedOn('2026-10-09')]).toEqual([null, tp[0].id, tp[1].id]);
  });
  test('stopka „dwa dni pod rząd … w porządku” tylko, gdy żadna widoczna możliwość nie ostrzega o dniu po dniu', async () => {
    await bootPlan(ids => { plan.setWeekDay(2, ids[0]); plan.setWeekDay(3, ids[1]); plan.setWeekDay(4, ids[0]); });
    await tap(screen.getByTestId('cal-2026-10-07')); await flushAll(5); await tap(screen.getByText('Przesuń albo pomiń')); await flushAll(5);
    const more = screen.queryByText(/^Więcej możliwości/); if (more) { await tap(more); await flushAll(5); }
    const warn = screen.queryAllByText(/^Uwaga: .* dzień po dniu/).length;
    expect(warn).toBeGreaterThan(0); /* stan z raportu: jest ostrzeżenie */
    expect(screen.queryByText(FOOT)).toBeNull();
    expect(screen.getByText(/^Uproszczenie: zwykle dzień przerwy/)).toBeTruthy(); /* objaśnienie zostaje */
  });
  test('bez ostrzeżeń — pełna stopka jak dotąd', async () => {
    await bootPlan(ids => { plan.setWeekDay(0, ids[0]); });
    await tap(screen.getByTestId('cal-2026-10-05')); await flushAll(5); await tap(screen.getByText('Przesuń albo pomiń')); await flushAll(5);
    expect(screen.queryAllByText(/^Uwaga: .* dzień po dniu/)).toHaveLength(0); expect(screen.getByText(FOOT)).toBeTruthy();
  });
});
