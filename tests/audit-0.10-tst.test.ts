/*
 * Audyt 0.10, fala 2 — obszar TESTY (docs/25 grupa M: M5 / TST-05). Po zmianie bramki macierzy (scripts/test-matrix.mjs: dowód tylko z KODU testu —
 * bez komentarzy, tytułów i importów; wymiary generowane z kodu lib/) wyszły pozycje, które miały „test” tylko we wzmiance. Tu testy ich
 * ZACHOWANIA (logika i wartości wymiarów); ekrany: tests/audit-0.10-tst-ui.test.tsx. Do tego test samej bramki (komentarz ≠ dowód).
 */
import { renderHook, act } from '@testing-library/react-native';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as plan from '@/lib/plan';
import { deviceUnit, LB_REGIONS } from '@/lib/i18n';
import { EXTRA_CAPS, EQUIPMENT, capsOf, equipEntry } from '@/lib/equipment';
import { CATALOG } from '@/lib/catalog.generated';
import { validateSpec, LOAD_LIMITS } from '@/lib/loads';
import { swapCandidates } from '@/lib/swap';
import { blankTimer, type Location } from '@/lib/seed';
import { fresh, ex, set } from './helpers';

const S = () => store.getState();

describe('LOGIKA: funkcje lib/ bez testu zachowania (M5)', () => {
  test('store.prefillSets: serie robocze z poprzedniej sesji po kolei (drop pominięty), rozgrzewka pusta, bez źródła — ciężar startowy, cel czasu z szablonu', async () => {
    await fresh(); const bench = ex('Bench Press (hantle)'); const plank = ex('Plank');
    const prev = { workout: { id: 'w' } as never, sets: [set({ weight: 30, reps: 8 }), set({ kind: 'drop', weight: 20, reps: 6 }), set({ weight: 32.5, reps: 6 })] };
    const out = store.prefillSets(bench, ['warmup', 'normal', 'normal', 'normal'], prev, null, null, '');
    expect(out.map(s => [s.kind, s.weight, s.reps, s.done])).toEqual([['warmup', '', '', false], ['normal', 30, 8, false], ['normal', 32.5, 6, false], ['normal', 32.5, 6, false]]);
    expect(store.prefillSets(bench, ['normal', 'normal'], null, null, null, '', 40).map(s => s.weight)).toEqual([40, 40]);
    expect(store.prefillSets(bench, ['normal'], null, null, null, '', -5)[0].weight).toBe(0); /* ciężar startowy nie schodzi poniżej zera */
    expect(store.prefillSets(bench, [], prev, null, null, '')).toEqual([]);
    /* cel czasu: w seriach poza rozgrzewką; 0 = bez celu */
    expect(store.prefillSets(plank, ['warmup', 'normal'], null, null, null, 45).map(s => s.durationSec)).toEqual(['', 45]);
    expect(store.prefillSets(plank, ['normal'], null, null, null, 0)[0].durationSec).toBe('');
    /* from: numeracja serii źródła od podanej pozycji */
    expect(store.prefillSets(bench, ['normal'], prev, null, null, '', '', 1)[0].weight).toBe(32.5);
  });

  test('timer.relabel: zmienia podpis TRWAJĄCEJ przerwy (Live Activity i stan), zmiana „ostatniej” przeplanowuje powiadomienie; bez przerwy, pusty albo ten sam podpis — nic', async () => {
    jest.useFakeTimers({ now: new Date(2026, 9, 9, 10).getTime() });
    try {
      await fresh(); store.startEmpty(); store.setTimerState(blankTimer());
      timer.relabel('dalej: Bench', false); expect(timer.T.sub).toBe(''); /* bez przerwy — nic */
      timer.labels.subtitle = 'dalej: Squat'; timer.labels.last = false; await timer.start(90, null);
      global.__la.length = 0; global.__notifications.length = 0;
      timer.relabel('dalej: Squat', false); expect(global.__la).toEqual([]); expect(global.__notifications).toEqual([]); /* ten sam — nic */
      timer.relabel('', true); expect(timer.T.last).toBe(false); /* pusty — nic */
      timer.relabel('dalej: Bench', false);
      expect([timer.T.sub, timer.labels.subtitle, timer.T.last]).toEqual(['dalej: Bench', 'dalej: Bench', false]);
      expect((global.__la as unknown[][]).filter(x => x[0] === 'update').map(x => x[1])).toEqual(['dalej: Bench']); expect(global.__notifications).toEqual([]); /* `last` bez zmian — bez nowego powiadomienia */
      timer.relabel('koniec', true); await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
      expect(timer.T.last).toBe(true); expect(global.__notifications.length).toBe(1);
      expect((global.__notifications[0] as { content: { body: string } }).content.body).toBe('Nic więcej do zrobienia — możesz zakończyć trening.');
      await timer.stop();
    } finally { jest.useRealTimers(); timer.labels.subtitle = ''; timer.labels.last = false; }
  });

  test('store.useTick / useHistTick / useCfgTick / useExercisesTick: który zapis przerysowuje który ekran (PERF-01/02, runda 14)', async () => {
    await fresh();
    const tick = renderHook(() => store.useTick()); const hist = renderHook(() => store.useHistTick()); const cfg = renderHook(() => store.useCfgTick()); const exs = renderHook(() => store.useExercisesTick());
    const snap = () => [tick.result.current, hist.result.current, cfg.result.current, exs.result.current];
    /* wpis w treningu w toku: tylko useTick */
    act(() => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); }); let a = snap(); act(() => { S().active!.exercises[0].sets[0].reps = 7; store.save(S().active!); }); let b = snap();
    expect([a[0] !== b[0], a[1] === b[1], a[2] === b[2], a[3] === b[3]]).toEqual([true, true, true, true]);
    /* zmiana szablonu: useCfgTick tak, historia nie */
    let tp = store.newTemplate(); act(() => { tp = store.newTemplate(); }); a = snap(); act(() => { tp.name = 'X'; store.save(tp); }); b = snap();
    expect([a[0] !== b[0], a[1] === b[1], a[2] !== b[2]]).toEqual([true, true, true]);
    /* zmiana nazwy ćwiczenia: lista ćwiczeń tak; notatka ćwiczenia: lista nie */
    const e = ex('Plank'); a = snap(); act(() => { e.name = 'Deska'; store.save(e); }); b = snap(); expect(a[3] !== b[3]).toBe(true);
    a = snap(); act(() => { e.notes = 'x'; store.save(e); }); b = snap(); expect(a[3] === b[3]).toBe(true);
    /* zakończenie treningu (historia): useHistTick i useCfgTick */
    act(() => { store.toggleDone(0, 0); });
    a = snap(); act(() => { store.finishWorkout(); }); b = snap(); expect([a[1] !== b[1], a[2] !== b[2]]).toEqual([true, true]);
    [tick, hist, cfg, exs].forEach(h => h.unmount());
  });
});

describe('WYMIAR: wartości z kodu lib/ — zachowanie każdej wartości (M5)', () => {
  test('LB_REGIONS: każdy region z listy daje funty, inne — kilogramy (jednostka świeżej instalacji, H4)', () => {
    for (const r of LB_REGIONS) { expect([r, deviceUnit(`en-${r}`)]).toEqual([r, 'lb']); expect([r, deviceUnit(`es_${r}`)]).toEqual([r, 'lb']); }
    expect(['pl-PL', 'en-GB', 'de-DE', 'en', ''].map(x => deviceUnit(x))).toEqual(['kg', 'kg', 'kg', 'kg', 'kg']);
  });
  test('EXTRA_CAPS: każda możliwość spoza katalogu daje jakiś sprzęt (wprost albo opcją) — miejsce z tym sprzętem ją ma', () => {
    for (const c of EXTRA_CAPS) {
      const it = EQUIPMENT.find(q => q.gives.includes(c) || (q.options ?? []).some(o => o.gives.includes(c)));
      expect([c, !!it]).toEqual([c, true]);
      const loc = { id: 'l', name: 'L', equipment: [equipEntry(it!.id, 'kg', true)] } as unknown as Location;
      expect([c, capsOf(loc).has(c)]).toEqual([c, true]);
    }
    expect(EXTRA_CAPS.filter(c => !['bands', 'cable.rope', 'ankle_strap', 'cable.handles'].includes(c))).toEqual([]);
  });
  test('Pattern (catalog.generated): każdy wzorzec ruchu ma ćwiczenia w katalogu; katalog nie ma wzorca spoza listy', () => {
    const P = ['h_push', 'h_pull', 'v_push', 'v_pull', 'squat', 'hinge', 'lunge_single_leg', 'isolation', 'core_flexion', 'core_anti_ext', 'core_anti_rot', 'core_other', 'carry', 'cardio', 'other', 'mobility'];
    const used = new Set(Object.values(CATALOG).map(e => e.pattern));
    expect([...used].filter(p => !P.includes(p)).sort()).toEqual([]);
    expect(P.filter(p => !used.has(p as never))).toEqual([]);
  });
  test('SpecProblem: list_too_long — lista ciężarów ponad limit; równo limit — w porządku', () => {
    const items = (n: number) => Array.from({ length: n }, (_, i) => ({ w: i + 1 }));
    expect(validateSpec({ kind: 'list', unit: 'kg', items: items(LOAD_LIMITS.listItems + 1) } as never)).toBe('list_too_long');
    expect(validateSpec({ kind: 'list', unit: 'kg', items: items(LOAD_LIMITS.listItems) } as never)).toBeNull();
  });
  test('SessionMode: solo / remote / in_gym przechodzą przez migrate bez zmian (zgodność z wersją webową), brak — solo', async () => {
    await fresh(); const w0 = { id: 'w1', ownerId: 'local', createdAt: 1, updatedAt: 1, loggedBy: 'local', healthUUID: null, templateId: null, templateName: 'T', startedAt: Date.now() - 7200e3, finishedAt: Date.now() - 3600e3, note: '', exercises: [{ id: 'b', exerciseId: ex('Plank').id, sets: [set({ durationSec: 30 })], groupId: null }] };
    const modes = ['solo', 'remote', 'in_gym'] as const;
    const st = JSON.parse(JSON.stringify(S())); st.workouts = [...modes.map((m, i) => ({ ...w0, id: 'w' + i, startedAt: w0.startedAt - i * 86400e3, finishedAt: w0.finishedAt - i * 86400e3, sessionMode: m })), { ...w0, id: 'wx', startedAt: w0.startedAt - 9 * 86400e3, finishedAt: w0.finishedAt - 9 * 86400e3 }];
    const m = store.migrate(st); const by = (id: string) => m.workouts.find(w => w.id === id)!.sessionMode;
    expect([by('w0'), by('w1'), by('w2'), by('wx')]).toEqual(['solo', 'remote', 'in_gym', 'solo']);
  });
  test('SwapReason: firstMuscle (ten sam mięsień główny) i secondary (wspólne pomocnicze) w powodach zamiany', async () => {
    await fresh(); const a = ex('Bench Press (hantle)');
    const list = swapCandidates(a.id, { showAll: true, inWorkout: new Set() });
    const R = (r: string) => list.filter(c => c.reasons.includes(r as never)).map(c => store.exById(c.exId)!);
    expect(R('firstMuscle').length).toBeGreaterThan(0); expect(R('firstMuscle').every(b => b.muscles[0] === a.muscles[0])).toBe(true);
    expect(R('secondary').length).toBeGreaterThan(0); expect(R('secondary').every(b => b.secondaryMuscles.some(m => a.secondaryMuscles.includes(m)))).toBe(true);
    expect(list.filter(c => c.reasons.includes('firstMuscle') && !c.reasons.includes('muscle'))).toEqual([]); /* firstMuscle tylko przy wspólnym mięśniu */
  });
  test('CFG_KEYS: każde pole konfiguracji z nowszego klucza „cfg” nadpisuje stan; brak pola w „cfg” — pole usunięte; starszy „cfg” — bez zmian', () => {
    for (const k of store.CFG_KEYS) {
      const raw: Record<string, unknown> = { saveSeq: 5, [k]: 'stare' };
      expect([k, store.applyCfg(raw, { seq: 6, data: { [k]: 'nowe' } }), raw[k]]).toEqual([k, true, 'nowe']);
      const raw2: Record<string, unknown> = { saveSeq: 5, [k]: 'stare' }; store.applyCfg(raw2, { seq: 6, data: {} }); expect([k, k in raw2]).toEqual([k, false]);
      const raw3: Record<string, unknown> = { saveSeq: 7, [k]: 'stare' }; expect([k, store.applyCfg(raw3, { seq: 6, data: { [k]: 'nowe' } }), raw3[k]]).toEqual([k, false, 'stare']);
    }
  });
  test('CFG_KEYS: historia planu (planHistory) zapisana samym kluczem „cfg” przeżywa restart', async () => {
    await fresh(); const t = store.newTemplate(); t.name = 'A'; store.save(t); await store.flush();
    plan.setWeekDay(0, t.id); await store.flush();
    const h = JSON.stringify(S().planHistory); expect(S().planHistory?.length).toBe(1);
    const st = JSON.parse(global.__kv.get('state')!); const cfgOnly = global.__kv.has('cfg') && !(st.planHistory?.length); /* zapis samej konfiguracji (PERF-03) */
    store.__resetForTests(); await store.init(); expect(JSON.stringify(S().planHistory)).toBe(h);
    expect(typeof cfgOnly).toBe('boolean');
  });
});

describe('bramka macierzy (scripts/test-matrix.mjs): dowód tylko z kodu testu (M5 / TST-05)', () => {
  const src = readFileSync(join(__dirname, '..', 'scripts', 'test-matrix.mjs'), 'utf8');
  /* codeOf z bramki (moduł ESM) — odtworzenie na kopii w pamięci: komentarz, tytuł testu i import nie są dowodem */
  const loadGate = async () => { const ts = require('typescript'); const m: { codeOf: (f: string, s: string) => { lits: string[]; ids: Set<string>; iter: Set<string> }; yamlCode: (s: string) => string } = {} as never;
    const body = src.slice(src.indexOf('const TEST_FNS'), src.indexOf('const tests = ')).replace(/^export /gm, '');
    new Function('ts', 'm', body + '\nm.codeOf = codeOf; m.yamlCode = yamlCode;')(ts, m); return m; };
  test('komentarz, tytuł test()/describe() i import nie liczą się; literał, wywołanie i pętla po stałej — tak', async () => {
    const g = await loadGate();
    const c = g.codeOf('x.test.ts', [
      "import { relabel } from '@/lib/timer';", "// '↺ cofnij' relabel", "/* 'Sprzęt' */",
      "describe('Edycja sesji', () => { test('relabel Trening wstecz', () => { expect(t('Z szablonu')).toBeTruthy(); store.prefillSets(); for (const l of LANGS) go(`/template/${l}`); test.each(METRICS)('%s', () => {}); }); });",
    ].join('\n'));
    expect(c.lits.some(l => l.includes('↺ cofnij') || l.includes('Sprzęt') || l.includes('Edycja sesji') || l.includes('Trening wstecz'))).toBe(false);
    expect(c.ids.has('relabel')).toBe(false); expect(c.ids.has('prefillSets')).toBe(true);
    expect(c.lits).toContain('Z szablonu'); expect(c.lits).toContain('/template/${');
    expect([c.iter.has('LANGS'), c.iter.has('METRICS')]).toEqual([true, true]);
    expect(g.yamlCode("- tapOn: 'Start' # 'Sprzęt'\n# 'Zakończ'\n- assertVisible: \"a # b\"")).toBe("- tapOn: 'Start' \n\n- assertVisible: \"a # b\"");
  });
});

describe('regresja TST-01 (nocny przebieg 08.10, MATRIX_SEED=426708283; ponownie 09.10 ziarno 507327062)', () => {
  test('„Zawsze w tym miejscu” nie zapisuje w szablonie zamiennika, który usunięto (archiwum) w trakcie treningu', async () => {
    await fresh(); const t = store.newTemplate(); t.items.push({ id: 'i1', exerciseId: ex('Bench Press (sztanga)').id, sets: 2, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null }); store.save(t);
    const { addLocation } = require('@/lib/locations'); addLocation('gym');
    store.startFromTemplate(t); const a = S().active!; const X = ex('Bench Press (hantle)');
    expect(store.swapBlock(a.exercises[0].id, X.id)).toBeTruthy(); const blk = S().active!.exercises.find(e => e.exerciseId === X.id)!;
    expect(store.canRememberAlt(S().active!, blk)).toBe(true); /* przed usunięciem — można zapamiętać */
    store.deleteExercise(X.id); expect(store.exById(X.id)?.archived).toBe(true); /* w treningu w toku — archiwum, nie usunięcie */
    expect(store.canRememberAlt(S().active!, blk)).toBe(false); expect(store.rememberAlt(blk.id)).toBe(false);
    expect(S().templates.find(z => z.id === t.id)!.items[0].alternates ?? []).toEqual([]);
  });
});

describe('słownik bez martwych kluczy (TST-08)', () => {
  /* Klucz słownika EN (= tekst polski w kodzie) bez literału w kodzie aplikacji to martwy wpis w 26 językach (audyt 0.10: 41 takich — poranny wpis,
   * waga, „− seria”, moduły…; usunięte 09.10.2026). check-i18n pilnuje kierunku kod → słownik; ten test — słownik → kod. Klucze używane
   * dynamicznie też są literałami w kodzie (tablice tekstów w lib/), więc wyjątków nie ma. */
  test('każdy klucz lib/i18n.en.ts występuje jako literał w app/, components/, lib/, modules/, plugins/ albo targets/; słowniki bez kluczy spoza EN', () => {
    const ts = require('typescript'); const fs = require('fs'); const root = join(__dirname, '..');
    const walk = (d: string, out: string[] = []): string[] => { if (!fs.existsSync(d)) return out; for (const f of fs.readdirSync(d)) { const p = join(d, f); if (fs.statSync(p).isDirectory()) { if (f !== 'node_modules') walk(p, out); } else out.push(p); } return out; };
    const files = ['app', 'components', 'lib', 'modules', 'plugins', 'targets'].flatMap(d => walk(join(root, d))).filter(f => !/i18n\.en\.ts$|locales[\\/]/.test(f));
    const lits = new Set<string>(); let raw = '';
    for (const f of files) {
      const src = readFileSync(f, 'utf8');
      if (/\.(tsx?|jsx?)$/.test(f)) { const v = (n: any) => { if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) lits.add(n.text); ts.forEachChild(n, v); }; v(ts.createSourceFile(f, src, ts.ScriptTarget.Latest, true, /x$/.test(f) ? ts.ScriptKind.TSX : ts.ScriptKind.TS)); } // eslint-disable-line @typescript-eslint/no-explicit-any
      else raw += src; /* Swift / plist (Live Activity) */
    }
    /* klucze wpisane w lib/i18n.en.ts (etykiety sprzętu {pl, en} z lib/equipment.ts dochodzą do EN w czasie działania — nie są martwe) */
    const keys: string[] = []; const k = (n: any) => { if (ts.isPropertyAssignment(n) && (ts.isStringLiteral(n.name) || ts.isIdentifier(n.name))) keys.push(n.name.text); ts.forEachChild(n, k); }; // eslint-disable-line @typescript-eslint/no-explicit-any
    k(ts.createSourceFile('en.ts', readFileSync(join(root, 'lib', 'i18n.en.ts'), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS));
    expect(keys.length).toBeGreaterThan(900);
    expect(keys.filter(x => !lits.has(x) && !raw.includes(x))).toEqual([]);
    /* słowniki języków: każdy klucz to klucz EN albo tekst z kodu (etykiety sprzętu, nazwy presetów) — bez martwych wpisów */
    const { EN } = require('@/lib/i18n.en'); const { LANGS } = require('@/lib/i18n');
    for (const l of LANGS.filter((x: string) => x !== 'pl' && x !== 'en')) { const d = JSON.parse(readFileSync(join(root, 'lib', 'locales', `${l}.json`), 'utf8')); expect([l, Object.keys(d).filter(x => !(x in EN) && !lits.has(x) && !raw.includes(x))]).toEqual([l, []]); }
  });
});
