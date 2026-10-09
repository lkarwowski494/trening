/*
 * Macierz niezmienników — testy modelowe (model-based) z fast-check na PRAWDZIWYM API magazynu (lib/store.ts, lib/edit.ts,
 * lib/locations.ts, lib/backup.ts). Losowa sekwencja działań użytkownika (szablony i ich wiersze, trening w toku, zamiany, miejsca,
 * gumy, ćwiczenia, ustawienia, edycja historii i trening wstecz, kopia zapasowa, ponowne uruchomienie, reset) — po KAŻDYM kroku
 * niezmienniki strukturalne i model (szablony i historia zmieniają się tylko tam, gdzie zmienia je działanie), a na żądanie
 * (akcje „reload”, „roundtrip”, „migrate”, „stats”) i na końcu każdej sekwencji — niezmienniki ciężkie.
 *
 * Uruchomienie:  npx jest tests/matrix-invariants.test.ts
 *   MATRIX_SEED=<liczba>   — inne stałe ziarno (domyślnie 20261006 — powtarzalne),
 *   MATRIX_SEED=random     — losowe ziarno (wypisywane w logu; do odtworzenia podaj je jako MATRIX_SEED),
 *   MATRIX_RUNS=<n>        — liczba przebiegów (domyślnie 100, ok. 1 min; plik mieści się w < 3 min),
 *   MATRIX_COVERAGE=1      — wypisuje, ile razy wykonały się kluczowe ścieżki,
 *   MATRIX_REPLAY='<Counterexample>' … -t replay — odtwarza jeden kontrprzykład z logu krok po kroku.
 * Błąd → fast-check zmniejsza sekwencję i wypisuje najkrótszą, która go odtwarza (razem z ziarnem i ścieżką).
 */
import fc from 'fast-check';
import * as store from '@/lib/store';
import * as stats from '@/lib/stats';
import * as units from '@/lib/units';
import * as edit from '@/lib/edit';
import * as locs from '@/lib/locations';
import * as plan from '@/lib/plan';
import * as gen from '@/lib/generator';
import * as draft from '@/lib/draft';
import * as tplsync from '@/lib/tplsync';
import * as health from '@/lib/health';
import { buildBackup, parseBackup } from '@/lib/backup';
import { implsAt, EQUIPMENT, LOCATION_PRESETS } from '@/lib/equipment';
import { CABLES } from '@/lib/catalog.generated';
import { SCHEMA_VERSION, METRICS, blankTimer, uid, hasReps, hasTime, hasDistance, type Exercise, type Template, type TemplateItem, type Workout, type WSet, type SetKind, type Impl } from '@/lib/seed';
import { fresh } from './helpers';

jest.setTimeout(600000);

const RUNS = Number(process.env.MATRIX_RUNS || 100);
const SEED = process.env.MATRIX_SEED === 'random' ? Date.now() % 2147483647 : Number(process.env.MATRIX_SEED || 20261006);
if (process.env.MATRIX_SEED === 'random') console.log(`matrix-invariants: MATRIX_SEED=${SEED}`); // eslint-disable-line no-console

/* ---------- alfabet działań ---------- */
const KINDS = {
  /* szablony — jawne edycje właściciela (jedyne, po których szablony mogą się zmienić) */
  tplNew: 2, tplRename: 1, tplDup: 1, tplDel: 1, tplAddItem: 4, tplRmItem: 1, tplMove: 1, tplLink: 2, tplUnlink: 1,
  tplAddRow: 3, tplRmRow: 2, tplKind: 2, tplRow: 3, tplBand: 1, tplLoc: 1, rememberAlt: 2, rememberRest: 1,
  /* audyt 0.10 (generator, UX-10): zapis z generatora (aktywacja, zastąpienie nieużywanych) i notatka szablonu */
  gen: 4, tplNote: 1,
  /* trening w toku */
  startTpl: 14, startEmpty: 4, repeat: 5, addEx: 7, rmEx: 1, addSet: 6, rmSet: 1, rmSetById: 1, type: 14, tick: 24, kind: 3, band: 3,
  link: 2, unlink: 1, moveBlock: 1, swap: 7, swapImpl: 4, undoSwap: 5, acceptAlt: 4, skipAlt: 1, setLoc: 3, timerRest: 1, timerSet: 1,
  finish: 10, cancel: 1,
  /* historia */
  delW: 1, past: 3, edit: 3,
  /* ćwiczenia */
  newEx: 1, equip: 1, metric: 1, bandAssist: 1, delEx: 2, restoreEx: 1,
  /* miejsca, sprzęt, gumy */
  addLoc: 2, delLoc: 1, setMain: 1, dupLoc: 1, renameLoc: 1, setEquip: 2, setOpt: 1, setBandLevel: 1, delBand: 1, setBandColor: 1,
  /* plan tygodnia (audyt 0.10 A1/A3/B1/M3: akcje planu w alfabecie — minione dni nie zmieniają statusu, plan = ostatni odcinek historii) */
  planDay: 3, planDayOv: 2, planShift: 2, planMove: 1, planNew: 1, planActivate: 1,
  /* ustawienia i dane */
  unit: 2, lang: 1, planHint: 1 /* UX-16 A (audyt 0.10): „Ukryj” zachętę do planu */, reload: 1, roundtrip: 1, migrate: 1, stats: 1, resetAll: 1,
  /* fala 2 audytu 0.10: pomiary masy ciała z datą (dopisanie / zastąpienie dnia / usunięcie) */
  bodyMass: 1,
  /* fala 2 audytu 0.10 (obszar TESTY, M3 / TST-03): funkcje z 07–09.10 w alfabecie — edycja na żądanie (szkic ćwiczenia/szablonu: Anuluj/Zapisz),
   * „Zapisz jako szablon”, archiwum szablonu, tydzień deload, pauza i „Pomiń dziś” w treningu, ponowienie zapisu do Zdrowia (J2), plany: nazwa,
   * usunięcie, zamiana dni, propozycja z panelu dnia, powrót dnia do planu */
  draft: 3, saveAsTpl: 1, tplArchive: 1, deload: 1, pause: 2, skipEx: 1, health: 1, planRename: 1, planDel: 1, planSwap: 1, planSuggest: 4, planReset: 1, libScope: 1,
} as const;
type K = keyof typeof KINDS;
type Op = { o: number; a: number; b: number; v: number | '' };
type Act = { t: K; a: number; b: number; c: number; v: number | ''; ops?: Op[] };

const num = fc.oneof(fc.constantFrom<number | ''>('', 0, 1, 2.5, 5, 8, 10, 12, 20, 24, 62.5, 100, -5, -20), fc.integer({ min: -3000, max: 30000 }).map(n => n / 100));
const nat = fc.nat(60);
const op = fc.record({ o: fc.nat(8), a: nat, b: nat, v: num });
const arbOf = (weights: Partial<Record<K, number>>): fc.Arbitrary<Act> => fc.oneof(...(Object.entries(weights) as [K, number][]).map(([t, weight]) => ({
  weight,
  arbitrary: t === 'past' || t === 'edit'
    ? fc.record({ t: fc.constant(t), a: nat, b: nat, c: nat, v: num, ops: fc.array(op, { maxLength: 6 }) })
    : fc.record({ t: fc.constant(t), a: nat, b: nat, c: nat, v: num }),
})));
/** Pojedyncze działania z całego alfabetu. */
const actArb = arbOf(KINDS);
/** Działania w trakcie treningu (sesja): serie, zamiany, miejsca — plus „wtrącenia” z innych ekranów (edycja historii, szablonu, sprzętu, gum,
 * ćwiczeń, jednostka, restart, import) w trakcie treningu w toku. */
const inSession = arbOf({ addEx: 4, rmEx: 1, addSet: 5, rmSet: 1, rmSetById: 1, type: 14, tick: 22, kind: 3, band: 3, link: 2, unlink: 1, moveBlock: 1,
  swap: 6, swapImpl: 4, undoSwap: 5, acceptAlt: 5, skipAlt: 1, setLoc: 3, timerRest: 1, timerSet: 1, rememberAlt: 4, rememberRest: 2,
  past: 1, edit: 1, delW: 1, tplRow: 1, tplAddRow: 1, setEquip: 1, setBandLevel: 1, delBand: 1, delEx: 1, equip: 1, unit: 1, reload: 1, roundtrip: 1, delLoc: 1,
  pause: 3, skipEx: 2, draft: 1, deload: 1 });
const start = fc.record({ t: fc.constantFrom<K>('startTpl', 'startTpl', 'startTpl', 'startEmpty', 'repeat'), a: nat, b: nat, c: nat, v: fc.constant<number | ''>('') });
const end = fc.record({ t: fc.constantFrom<K>('finish', 'finish', 'finish', 'cancel'), a: nat, b: nat, c: nat, v: fc.constant<number | ''>('') });
/** Sesja: start (szablon / pusty / powtórz ostatni) → 3–25 działań w treningu → zakończenie albo anulowanie. */
const session = fc.tuple(start, fc.array(inSession, { minLength: 3, maxLength: 25 }), end).map(([a, xs, z]) => [a, ...xs, z]);
const seqArb = fc.array(fc.oneof({ weight: 3, arbitrary: actArb.map(x => [x]) }, { weight: 2, arbitrary: session }), { minLength: 6, maxLength: 30 });

/** Kategorie: jawne edycje szablonów, zmiany historii; w pozostałych działaniach trening w toku ma zostać co do bajtu (ACTIVE_FROZEN). */
const TPL_EDIT = new Set<K>(['tplNew', 'tplRename', 'tplDup', 'tplDel', 'tplAddItem', 'tplRmItem', 'tplMove', 'tplLink', 'tplUnlink', 'tplAddRow', 'tplRmRow', 'tplKind', 'tplRow', 'tplBand', 'tplLoc', 'rememberAlt', 'rememberRest', 'gen', 'tplNote', 'draft', 'saveAsTpl', 'tplArchive']);
const ACTIVE_FROZEN = new Set<K>([...[...TPL_EDIT].filter(k => k !== 'rememberRest'), 'delW', 'past', 'edit', 'unit', 'lang', 'newEx', 'metric', 'bandAssist', 'delEx', 'restoreEx', 'addLoc', 'setMain', 'dupLoc', 'renameLoc', 'setBandColor', 'planHint', 'reload', 'roundtrip', 'migrate', 'stats', 'planDay', 'planDayOv', 'planShift', 'planMove', 'planNew', 'planActivate', 'bodyMass', 'draft', 'saveAsTpl', 'tplArchive', 'deload', 'health', 'planRename', 'planDel', 'planSwap', 'planSuggest', 'planReset', 'libScope']);
/** Audyt 0.10 A1/A7: działania, po których żaden miniony dzień nie może zmienić statusu (poza dniem, którego działanie dotyczy wprost). */
const PAST_FROZEN = new Set<K>(['planDay', 'planDayOv', 'planShift', 'planMove', 'planNew', 'planActivate', 'tplDel', 'tplNew', 'tplDup', 'tplRename', 'tplArchive', 'draft', 'saveAsTpl', 'planRename', 'planDel', 'planSwap', 'planSuggest', 'planReset', 'deload', 'health']);

/* ---------- pomocnicze ---------- */
const J = (x: unknown) => JSON.stringify(x);
const S = () => store.getState();
const pick = <T,>(arr: readonly T[], i: number): T | undefined => (arr.length ? arr[i % arr.length] : undefined);
/* Znalezisko 1 naprawione 06.10 (store.restoreExercise) — porównania I1 / restart / import bez wyjątków. */
const strip = (s: unknown, touched = false) => { const c = JSON.parse(J(s)); delete c.metaUpdatedAt; delete c.saveSeq; if (touched) delete c.userTouched; return c; };
const POOL = ['Back Squat', 'Pull Up', 'Bench Press (hantle)', 'Plank', 'Bieg', "Farmer's Walk", 'Burpees', 'RDL (sztanga)', 'Goblet Squat', 'Deadlift (hantle)'];
const CABLE2 = Object.keys(CABLES).filter(n => CABLES[n] === 2).slice(0, 2);
/** Ćwiczenia, na których gra sekwencja: mała pula (powtórzenia w historii — „Poprzednio”, rekordy, statystyki), wszystkie metryki, własne ćwiczenia, ×2 na stacji. */
const pool = () => S().exercises.filter(e => !e.archived && (!e.lib || POOL.includes(e.name) || CABLE2.includes(e.name)));
const ran: Record<string, number> = {};
const hit = (k: string) => { ran[k] = (ran[k] ?? 0) + 1; };
function fail(where: string, msg: string, data?: unknown): never { throw new Error(`${where}: ${msg}${data !== undefined ? '\n' + J(data) : ''}`); }
const ok = (c: unknown, where: string, msg: string, data?: unknown) => { if (!c) fail(where, msg, data); };
const working = (s: WSet) => s.done && s.kind !== 'warmup';
/** D3 (audyt 0.10): seria robocza — drop zaraz po serii roboczej to ta sama seria (niezależna wyrocznia dla store.workSetCount). */
const workN = (sets: WSet[]) => { let n = 0, prev = false; for (const s of sets.filter(working)) { if (!(s.kind === 'drop' && prev)) n++; prev = true; } return n; };
const repsOf = (s: WSet) => Math.max(0, Math.floor(Number(s.reps) || 0));
const maxOf = (xs: number[]) => xs.reduce((a, b) => Math.max(a, b), 0);

/* ---------- model ---------- */
interface Model { tpl: string; hist: Map<string, string> }
const histMap = () => new Map(S().workouts.map(w => [w.id, J(w)] as [string, string]));
const snap = (m: Model) => { m.tpl = J(S().templates); m.hist = histMap(); };
/** Grupy (superset) bez konkretnych id — normalizeGroups nadaje nowe uid przy podziale grupy. */
const canonTpls = (tps: Template[]) => tps.map(tp => { const ids = new Map<string, number>(); return { ...tp, items: tp.items.map(it => ({ ...it, groupId: it.groupId ? (ids.has(it.groupId) ? ids.get(it.groupId) : (ids.set(it.groupId, ids.size), ids.size - 1)) : null })) }; });

/* ---------- zegary jak na ekranie (ActiveWorkout: dropTimers / afterSwap / stopIfFrom / stop przy zakończeniu) ---------- */
const activeSetIds = () => new Set(S().active?.exercises.flatMap(e => e.sets.map(s => s.id)) ?? []);
function dropTimers(gone: Iterable<string>) {
  const g = new Set(gone); const tm = S().timer; const p: Partial<ReturnType<typeof blankTimer>> = {};
  if (tm.restSetId && g.has(tm.restSetId)) Object.assign(p, { restEndAt: null, restTotal: 0, restSetId: null });
  if (tm.setId && g.has(tm.setId)) Object.assign(p, { setStartAt: null, setTarget: 0, setId: null });
  if (Object.keys(p).length) store.setTimerState(p);
}
/** Kontrakt zamian (E2): goneSetIds obejmuje KAŻDĄ serię, która zniknęła z treningu — ekran zatrzymuje po nim stopery (afterSwap). */
function afterSwap(where: string, before: Set<string>, r: { goneSetIds: string[] } | null) {
  const now = activeSetIds(); const gone = [...before].filter(x => !now.has(x));
  if (r) { const g = new Set(r.goneSetIds); ok(gone.every(x => g.has(x)), where, 'goneSetIds nie obejmuje usuniętej serii', { gone, r }); dropTimers(r.goneSetIds); }
  else ok(!gone.length, where, 'odrzucona zamiana usunęła serie', gone);
}

/* ---------- wpisy jak w polach ekranu ---------- */
function typeValue(ex: Exercise, s: WSet, k: number, raw: number | '') {
  const v = raw === '' ? '' : Math.max(-1e6, Math.min(1e6, raw));
  switch (k % 5) {
    case 0: store.writeLoad(ex, s, v === '' ? '' : (units.wIn(store.isBW(ex) ? v : Math.max(0, v)) as number)); break;
    case 1: s.reps = v === '' ? '' : Math.max(0, Math.floor(v)); break;
    case 2: s.durationSec = v === '' ? '' : Math.min(86400, Math.max(0, Math.round(v))); break;
    case 3: s.distanceM = v === '' ? '' : Math.max(0, Math.round(v)); break;
    case 4: s.rpe = v === '' ? '' : Math.min(10, Math.max(0, Math.round(v * 10) / 10)); break;
  }
}
const KIND_OF: SetKind[] = ['normal', 'warmup', 'drop', 'failure'];
const NAMES = ['Push', '  Pull  day ', '', 'x'.repeat(95), 'Nogi 🦵', 'A'];

/** Decyzja 8c / reguła L5: przy powstaniu bloku i przy KAŻDEJ zmianie miejsca treningu albo jego sprzętu blok bez odhaczonych serii i bez ręcznego
 * wyboru (implPinned) ma przyrząd rozstrzygnięty dla miejsca treningu. (Między zdarzeniami przyrząd się nie przelicza — np. cofnięcie odhaczenia
 * po zmianie miejsca zostawia przyrząd poprzedniego miejsca do następnej zmiany; to zgodne z regułą „przelicz przy zmianie”.)
 * Znalezisko 2 naprawione 06.10: zmiana sprzętu ĆWICZENIA (store.setEquipment) też przelicza przyrząd — bez wyjątków. */
function implFresh(where: string, blocks?: { id: string }[]) {
  const a = S().active; if (!a) return; const ids = blocks ? new Set(blocks.map(b => b.id)) : null;
  for (const e of a.exercises) { if (ids && !ids.has(e.id)) continue; if (e.implPinned || e.sets.some(z => z.done)) continue;
    const exp = store.implAtLoc(store.exById(e.exerciseId), a.locationId); ok(e.impl === exp, where, 'przyrząd bloku ≠ przyrząd w miejscu treningu (8c/L5)', { ex: store.exById(e.exerciseId)?.name, impl: e.impl, exp }); }
}

/* ---------- jeden krok ---------- */
async function step(x: Act, m: Model, where: string) {
  const st = S(); const act = st.active; const exs = pool();
  const tpl = pick(st.templates, x.a); const item = tpl ? pick(tpl.items, x.b) : undefined;
  const blk = act ? pick(act.exercises, x.a) : undefined; const ei = act && blk ? act.exercises.indexOf(blk) : -1;
  const loc = pick(st.settings.locations, x.a);
  const tplBefore = m.tpl; const activeBefore = J(act); const setsBefore = activeSetIds();
  const tplsExcept = (id?: string) => J(S().templates.filter(t => t.id !== id));
  const othersSame = (id?: string) => ok(tplsExcept(id) === J((JSON.parse(tplBefore) as Template[]).filter(t => t.id !== id)), where, 'edycja jednego szablonu zmieniła inny');
  const rowsOf = (it: TemplateItem) => store.tplRows(it);
  /* audyt 0.10 A1: statusy minionych 21 dni przed działaniem (porównanie po nim — PAST_FROZEN) */
  const today = plan.dayKeyOf(Date.now()); const pastKeys = Array.from({ length: 21 }, (_, i) => plan.addDays(today, -(i + 1)));
  const pastBefore = PAST_FROZEN.has(x.t) ? pastKeys.map(k => J(plan.dayStatus(k, today))) : null; let pastTouched: string | null = null;

  switch (x.t) {
    /* ===== szablony (jawne edycje) ===== */
    case 'tplNew': { const n = st.templates.length; const t = store.newTemplate(); ok(S().templates.length === n + 1 && t.items.length === 0, where, 'nowy szablon'); hit('tplNew'); break; }
    case 'tplNote': if (tpl) { store.setTemplateNote(tpl, NAMES[x.b % NAMES.length]); ok(tpl.note === undefined || (tpl.note.length <= store.TEMPLATE_NOTE_MAX && tpl.note === tpl.note.trim() && !!tpl.note), where, 'notatka szablonu', tpl.note); othersSame(tpl.id); hit('tplNote'); } break; /* app/template/[id].tsx: pole „Notatka” */
    case 'gen': { /* app/generator.tsx: zapis; zastąpienie usuwa tylko nieużywane wygenerowane szablony i plany zrobione tylko z nich */
      const goal = (['strength', 'hypertrophy', 'cut'] as const)[x.a % 3]; const ss = gen.GEN_SESSIONS[goal];
      const inp = { goal, locationId: x.b % 4 === 0 ? null : pick(st.settings.locations, x.b)?.id ?? null, sessions: ss[x.b % ss.length], minutes: gen.GEN_MINUTES[x.c % gen.GEN_MINUTES.length] };
      const live = new Set(st.templates.map(t => t.id)); const refs = [...st.workouts.map(w => w.templateId), st.active?.templateId, ...(st.weekPlan?.days ?? []), ...Object.values(st.planOverrides ?? {})].filter((id): id is string => !!id && live.has(id));
      const res = gen.saveGenerated(gen.generate(inp), inp, x.c % 2 === 0, x.c % 3 === 0); const ids = new Set(S().templates.map(t => t.id));
      ok(refs.every(id => ids.has(id)), where, 'zastąpienie usunęło szablon w użyciu', refs.filter(id => !ids.has(id)));
      ok(res.templateIds.every(id => (S().templates.find(t => t.id === id)?.items.length ?? 0) > 0), where, 'pusty szablon z generatora');
      const days = x.c % 2 === 0 ? S().weekPlan?.days ?? [] : S().savedPlans?.find(p => p.id === res.planId)?.days ?? [];
      ok(days.length === 7 && days.every(d => !d || res.templateIds.includes(d)), where, 'plan z generatora wskazuje nie swoje szablony', days);
      hit('gen'); break; }
    case 'tplRename': if (tpl) { const prev = tpl.name; tpl.name = NAMES[x.b % NAMES.length].slice(0, 80); store.save(tpl); const n = tpl.name.replace(/\s+/g, ' ').trim(); tpl.name = n || prev; store.save(tpl); othersSame(tpl.id); } break; /* app/template/[id].tsx: onChangeText + commitName */
    case 'tplDup': if (tpl) { const c = store.dupTemplate(tpl.id); ok(c.id !== tpl.id && c.items.length === tpl.items.length && c.items.every((it, i) => it.id !== tpl.items[i].id && it.exerciseId === tpl.items[i].exerciseId), where, 'kopia szablonu'); othersSame(c.id); hit('tplDup'); } break;
    case 'tplDel': if (tpl) { plan.removeTemplate(tpl.id); ok(!S().templates.some(t => t.id === tpl.id), where, 'usunięcie szablonu'); othersSame(tpl.id);
      ok(!plan.weekPlanDays().includes(tpl.id) && !plan.savedPlans().some(p => p.days.includes(tpl.id)), where, 'usunięty szablon został w planie (audyt 0.10 A7)'); } break; /* app/(tabs)/templates.tsx: removeTemplate */
    case 'tplAddItem': if (tpl && exs.length) { const ex = pick(exs, x.b)!; tpl.items.push({ id: uid(), exerciseId: ex.id, sets: 3, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null }); store.save(tpl); othersSame(tpl.id); hit('tplAddItem'); } break; /* app/picker.tsx:49 */
    case 'tplRmItem': if (tpl && item) { store.removeItem(tpl.items, tpl.items.indexOf(item), tpl); othersSame(tpl.id); } break;
    case 'tplMove': if (tpl && item) { store.moveBlockOf(tpl.items, item.id, x.c % 6, tpl); othersSame(tpl.id); } break;
    case 'tplLink': if (tpl && tpl.items.length > 1) { const i = x.b % (tpl.items.length - 1); store.linkWithNext(tpl.items, i, tpl); ok(tpl.items[i].groupId && tpl.items[i].groupId === tpl.items[i + 1].groupId, where, 'połączenie w superset'); othersSame(tpl.id); hit('tplLink'); } break;
    case 'tplUnlink': if (tpl && item) { store.unlink(tpl.items, tpl.items.indexOf(item), tpl); othersSame(tpl.id); } break;
    case 'tplAddRow': if (tpl && item) { const n = rowsOf(item).length; const kind = ([undefined, 'warmup', 'drop'] as const)[x.c % 3]; store.tplAddRow(tpl, item.id, kind);
      const r = rowsOf(item); ok(r.length === (n >= 50 ? n : n + 1), where, 'tplAddRow: liczba wierszy', { n, after: r.length });
      if (kind === 'warmup' && n < 50) { const fw = r.findIndex(z => z.kind !== 'warmup'); ok(fw < 0 || r.slice(fw).every(z => z.kind !== 'warmup') || r.slice(0, fw).every(z => z.kind === 'warmup'), where, 'rozgrzewka przed seriami roboczymi'); }
      othersSame(tpl.id); hit('tplAddRow'); } break;
    case 'tplRmRow': if (tpl && item) { const r0 = rowsOf(item); const n = r0.length; const rid = pick(r0, x.c)!.id; store.tplRemoveRow(tpl, item.id, rid); const r = rowsOf(item);
      ok(r.length === (n <= 1 ? n : n - 1) && (n <= 1 || !r.some(z => z.id === rid)), where, 'tplRemoveRow', { n, after: r.length }); othersSame(tpl.id); hit('tplRmRow'); } break;
    case 'tplKind': if (tpl && item) { const rid = pick(rowsOf(item), x.c)!.id; const k = KIND_OF[x.b % 4]; store.tplSetKind(tpl, item.id, rid, k); ok(rowsOf(item).find(z => z.id === rid)?.kind === k, where, 'tplSetKind'); othersSame(tpl.id); hit('tplKind'); } break;
    case 'tplRow': if (tpl && item) { const rid = pick(rowsOf(item), x.c)!.id; const ex = store.exById(item.exerciseId)!; const v = x.v;
      const patch = [{ reps: v === '' ? '' : Math.min(1000, Math.max(0, Math.round(v))) }, { weight: v === '' ? '' : units.wIn(store.isBW(ex) ? v : Math.max(0, v)) }, { durationSec: v === '' ? '' : Math.min(86400, Math.max(0, Math.round(v))) }, { distanceM: v === '' ? '' : Math.max(0, Math.round(v)) }][x.b % 4] as Parameters<typeof store.tplSetRow>[3];
      store.tplSetRow(tpl, item.id, rid, patch); othersSame(tpl.id); hit('tplRow'); } break;
    case 'tplBand': if (tpl && item) { store.tplCycleBand(tpl, item.id, pick(rowsOf(item), x.c)!.id); othersSame(tpl.id); } break;
    case 'tplLoc': if (tpl) { const l = pick(st.settings.locations, x.b); if (l && x.c % 3) tpl.locationId = l.id; else delete tpl.locationId; store.save(tpl); othersSame(tpl.id); } break;
    case 'rememberAlt': if (act) { const c = act.exercises.filter(e => store.canRememberAlt(act, e)); const e = pick(c, x.b); if (e) { const tp = st.templates.find(t => t.id === act.templateId)!; ok(store.rememberAlt(e.id), where, 'rememberAlt'); othersSame(tp.id); ok(J(act) === activeBefore, where, '„Zawsze w” zmieniło trening w toku'); hit('rememberAlt'); } } break;
    case 'rememberRest': if (act && blk) { const n = [30, 60, 90, 120, 180][x.b % 5]; store.rememberRest(act, blk, n); ok(blk.restSec === n, where, 'rememberRest: przerwa bloku'); othersSame(act.templateId ?? undefined); hit('rememberRest'); } break;

    /* ===== trening w toku ===== */
    case 'startTpl': if (!act && tpl) { store.startFromTemplate(tpl); const a = S().active!; ok(a.templateId === tpl.id, where, 'start z szablonu');
      const live = tpl.items.filter(it => { const e = store.exById(it.exerciseId); return e && !e.archived; });
      ok(a.exercises.length === live.length && a.exercises.every((e, i) => e.tplItemId === live[i].id && e.exerciseId === live[i].exerciseId && e.sets.length === rowsOf(live[i]).length && e.sets.every((s, k) => s.kind === rowsOf(live[i])[k].kind && !s.done)), where, 'blok = pozycja szablonu (ćwiczenie, liczba i rodzaje serii)');
      implFresh(where); hit('startTpl'); } break;
    case 'startEmpty': if (!act) store.startEmpty(); break;
    case 'repeat': if (!act) { const last = store.finishedWorkouts()[0]; store.repeatLast(); const a = S().active; if (a && last) {
      const src = last.exercises.filter(e => { const z = store.exById(e.exerciseId); return z && !z.archived; });
      ok(a.exercises.length === src.length && a.exercises.every((e, i) => e.exerciseId === src[i].exerciseId && e.id !== src[i].id && e.sets.length === src[i].sets.length && e.sets.every((z, k) => !z.done && z.kind === (src[i].sets[k].kind === 'failure' ? 'normal' : src[i].sets[k].kind))), where, '„Powtórz ostatni” = bloki i rodzaje serii ostatniego treningu (upadek → zwykła)');
      implFresh(where); hit('repeat'); } } break;
    case 'addEx': if (act && exs.length) { store.addExerciseToActive(pick(exs, x.b)!); implFresh(where, act.exercises.slice(-1)); } break;
    case 'rmEx': if (act && blk) { store.removeExercise(ei); dropTimers([...setsBefore].filter(i => !activeSetIds().has(i))); } break;
    case 'addSet': if (act && blk) { const n = blk.sets.length; store.addSet(ei, ([undefined, 'warmup', 'drop'] as const)[x.c % 3]); ok(blk.sets.length === n + 1, where, 'addSet'); } break;
    case 'rmSet': if (act && blk) { const n = blk.sets.length; store.removeSet(ei); ok(blk.sets.length === Math.max(1, n - 1), where, 'removeSet'); dropTimers([...setsBefore].filter(i => !activeSetIds().has(i))); } break;
    case 'rmSetById': if (act && blk) { const s = pick(blk.sets, x.b)!; const n = blk.sets.length; store.removeSetById(ei, s.id); ok(blk.sets.length === Math.max(1, n - 1), where, 'removeSetById'); dropTimers([...setsBefore].filter(i => !activeSetIds().has(i))); } break;
    case 'type': if (act && blk) { const ex = store.exById(blk.exerciseId); if (ex) { const s = pick(blk.sets, x.b)!; typeValue(ex, s, x.c, x.v); s.edited = true; store.save(act); } } break;
    case 'tick': if (act && blk) { const si = x.b % blk.sets.length; const s = blk.sets[si]; const rest = store.toggleDone(ei, si);
      if (s.done) { ok(typeof s.completedAt === 'number', where, 'odhaczona seria bez godziny'); if (rest) store.setTimerState({ restEndAt: Date.now() + rest * 1000, restTotal: rest, restSetId: s.id }); else dropTimers(S().timer.restSetId ? [S().timer.restSetId!] : []); }
      else { ok(s.completedAt === null && !s.hinted, where, 'cofnięcie odhaczenia'); dropTimers([s.id]); }
      hit('tick'); } break;
    case 'kind': if (act && blk) { const s = pick(blk.sets, x.b)!; s.kind = KIND_OF[x.c % 4]; s.warmup = s.kind === 'warmup'; store.save(act); } break;
    case 'band': if (act && blk) { const ex = store.exById(blk.exerciseId); const s = pick(blk.sets, x.b)!; if (ex && store.usesBand(ex) && !s.done) store.cycleBand(s, store.isBW(ex) && (ex.metric ?? 'weight_reps').includes('weight')); } break;
    case 'link': if (act && act.exercises.length > 1) store.linkWithNext(act.exercises, x.a % (act.exercises.length - 1), act); break;
    case 'unlink': if (act && blk) store.unlink(act.exercises, ei, act); break;
    case 'moveBlock': if (act && blk) store.moveBlockOf(act.exercises, blk.id, x.c % 6, act); break;
    case 'swap': if (act && blk && exs.length) { const origOf = blk.swappedFrom ?? blk.exerciseId; const to = pick(exs.filter(e => e.metric === store.exById(blk.exerciseId)?.metric && e.id !== blk.exerciseId), x.b) ?? pick(exs, x.b)!; const n = act.exercises.length;
      const r = store.swapBlock(blk.id, to.id); afterSwap(where, setsBefore, r);
      if (r) { const b = act.exercises.find(e => e.id === r.blockId)!; ok(b.exerciseId === to.id && b.sets.length > 0 && b.sets.every(s => !s.done), where, 'zamiana: blok B'); const orig = origOf; ok(b.swappedFrom === (orig === to.id ? undefined : orig), where, 'swappedFrom = oryginał (A→B→C zostaje A)', { orig, b }); implFresh(where, [b]); hit('swap'); if (act.exercises.length > n) hit('split'); }
    } break;
    case 'swapImpl': if (act && blk) { const ex = store.exById(blk.exerciseId); const l = store.locationById(act.locationId); const ch = ex && l ? implsAt(ex, l).filter(i => i !== blk.impl) : []; const impl = pick(ch, x.b);
      if (impl) { const r = store.swapImpl(blk.id, impl); afterSwap(where, setsBefore, r); if (r) { const b = act.exercises.find(e => e.id === r.blockId)!; ok(b.impl === impl && b.implPinned === true, where, 'swapImpl: przyrząd przypięty'); hit('swapImpl'); } } } break;
    case 'undoSwap': if (act) { const e = pick(act.exercises.filter(store.canUndoSwap), x.b); if (e) { const A = e.swappedFrom; const n = e.sets.length; const P = e.splitFrom ? act.exercises.find(z => z.id === e.splitFrom && z.exerciseId === A) : undefined; const pn = P?.sets.length ?? 0;
      const r = store.undoSwap(e.id); afterSwap(where, setsBefore, r); ok(!!r, where, 'undoSwap odrzucone mimo canUndoSwap');
      if (P) ok(!act.exercises.includes(e) && P.sets.length === pn + n, where, 'cofnięcie po podziale: serie B wracają do A'); else { ok(e.exerciseId === A && e.swappedFrom === undefined && e.sets.length === n, where, 'cofnięcie w miejscu: wraca oryginał', e); implFresh(where, [e]); }
      hit(P ? 'undoMerge' : 'undoSwap'); } } break;
    case 'acceptAlt': if (act) { const e = pick(act.exercises.filter(b => store.altHint(act, b)), x.b); if (e) { const r = store.acceptAlt(e.id); afterSwap(where, setsBefore, r); if (r) hit('acceptAlt'); } } break;
    case 'skipAlt': if (act && blk) store.skipAlt(blk.id); break;
    case 'setLoc': if (act && loc) { const prev = act.locationId; store.setActiveLocation(loc.id); if (prev !== loc.id) { implFresh(where); hit('setLoc'); } } break;
    case 'timerRest': if (act && blk) { const s = pick(blk.sets, x.b)!; store.setTimerState({ restEndAt: Date.now() + 60e3, restTotal: 60, restSetId: s.id }); } break;
    case 'timerSet': if (act && blk) { const s = pick(blk.sets, x.b)!; if (!s.done) store.setTimerState({ setStartAt: Date.now(), setTarget: x.c % 2 ? 30 : 0, setId: s.id }); } break;
    case 'finish': if (act) { /* jak ekran: bez odhaczonych serii — „Odrzuć trening” (ActiveWorkout: Brak odhaczonych serii) */
      const done = act.exercises.flatMap(e => e.sets.filter(s => s.done).map(s => s.id));
      /* H5 + LIVE2-01 (audyt kontrolny 1): „Zaktualizować szablon?” → „Zaktualizuj szablon” (ekran: różnice ze stanu sprzed zapisu); łańcuch podziału
       * (zamiana / przyrząd w trakcie) to jedna pozycja — szablon nigdy z dwiema pozycjami o tym samym id (uniq w light), zmienia się tylko ten szablon */
      const upd = done.length && x.c % 2 === 0 ? S().templates.find(z => z.id === act.templateId) : undefined; const before = upd ? J(act) : '';
      const diff = upd ? tplsync.templateDiff(upd, JSON.parse(before)) : null;
      if (done.length) { const w = store.finishWorkout()!; ok(w.id === act.id && !S().active, where, 'zakończenie');
        const kept = w.exercises.flatMap(e => e.sets.map(s => s.id)); ok(J([...kept].sort()) === J([...done].sort()), where, 'historia = dokładnie odhaczone serie', { kept, done });
        m.hist.set(w.id, J(w)); hit('finish');
        if (upd && diff) { const n0 = upd.items.length; tplsync.updateTemplateFromWorkout(upd, JSON.parse(before)); othersSame(upd.id); m.tpl = J(S().templates);
          ok(new Set(upd.items.map(i => i.id)).size === upd.items.length && upd.items.length <= n0 + JSON.parse(before).exercises.length, where, 'LIVE2-01: „Zaktualizuj szablon” — zdublowane id pozycji', upd.items.map(i => i.id)); hit('tplUpdate'); } }
      else store.cancelWorkout();
      store.setTimerState(blankTimer()); } break;
    case 'cancel': if (act) { store.cancelWorkout(); store.setTimerState(blankTimer()); } break;

    /* ===== historia ===== */
    case 'delW': { const w = pick(st.workouts, x.a); if (w) { store.deleteWorkout(w.id); m.hist.delete(w.id); hit('delW'); } break; }
    case 'past': case 'edit': {
      let d: edit.Draft | null;
      if (x.t === 'past') { const now = Date.now(); const start = now - (1 + (x.a % 40)) * 86400e3 - (x.b % 600) * 60e3; const tp = x.c % 4 ? pick(st.templates, x.c) : undefined; d = edit.beginPast(tp?.id ?? null, start, start + (1 + (x.b % 180)) * 60e3); }
      else { const w = pick(st.workouts, x.a); d = w ? edit.beginEdit(w.id) : null; }
      if (!d) break;
      const key = d.key;
      for (const o of x.ops ?? []) {
        const dw = edit.draftOf(key)!.w; const e = pick(dw.exercises, o.a); const ex = e ? store.exById(e.exerciseId) : undefined;
        switch (o.o) {
          case 0: if (e) edit.draftAddSet(key, dw.exercises.indexOf(e), ([undefined, 'warmup', 'drop'] as const)[o.b % 3]); break;
          case 1: if (e && e.sets.length) edit.draftRemoveSet(key, dw.exercises.indexOf(e), pick(e.sets, o.b)!.id); break;
          case 2: { const n = pick(exs, o.b); if (n) edit.draftAddExercise(key, n); break; }
          case 3: if (e) edit.draftRemoveExercise(key, e.id); break;
          case 4: case 5: if (e && ex && e.sets.length) { typeValue(ex, pick(e.sets, o.b)!, o.o === 4 ? 0 : 1, o.v); edit.touchDraft(); } break;
          case 6: if (e) { const to = pick(exs.filter(b => edit.swapTargetOk(edit.draftOf(key)!, e, b)), o.b); if (to) { ok(edit.draftSwapExercise(key, e.id, to.id), where, 'draftSwapExercise odrzucone mimo swapTargetOk'); hit('draftSwap'); } } break;
          case 7: edit.draftSetWhen(key, { min: String(1 + (o.b % 240)) }); break;
          case 8: if (e && ex && e.sets.length) { const s = pick(e.sets, o.b)!; s.kind = KIND_OF[o.a % 4]; s.warmup = s.kind === 'warmup'; edit.touchDraft(); } break;
        }
      }
      const src = d.sourceId ? st.workouts.find(w => w.id === d!.sourceId) : undefined; const srcJ = src ? J(src) : null;
      const noop = x.t === 'edit' && !(x.ops ?? []).length && src && !st.workouts.some(w => w !== src && w.startedAt === src.startedAt) && st.active?.startedAt !== src.startedAt && src.templateName === store.clampName(src.templateName.replace(/\s+/g, ' ').trim());
      if (x.c % 5 === 0) { edit.discardDraft(key); break; }
      const tplsBefore = J(S().templates);
      const r = edit.commitDraft(key); edit.discardDraft(key);
      ok(J(S().templates) === tplsBefore, where, 'trening wstecz / edycja zmieniły szablon');
      if ('w' in r) {
        const w = S().workouts.find(z => z.id === r.w.id)!; ok(!!w && w.exercises.length > 0 && w.exercises.every(e => e.sets.length && e.sets.every(s => s.done && s.warmup === (s.kind === 'warmup'))), where, 'zapisany trening z edytora', w);
        ok(!S().workouts.some(z => z !== w && z.startedAt === w.startedAt) && S().active?.startedAt !== w.startedAt, where, 'start zapisanego treningu nie jest unikalny (audyt M4)');
        if (x.t === 'edit') { ok(w.id === d.sourceId, where, 'edycja zmieniła id treningu');
          if (noop) { /* zapis bez zmian = ten sam trening; edytor świadomie zdejmuje metadane serii treningu w toku (hinted, edited — lib/edit.ts:63, store.putHistoryWorkout) */
            const meta = (x: Workout) => { const c = JSON.parse(J(x)); delete c.updatedAt; for (const e of c.exercises) for (const z of e.sets) { delete z.hinted; delete z.edited; } return c; };
            const a = meta(w), b = meta(JSON.parse(srcJ!)); expect({ where, w: a }).toEqual({ where, w: b }); hit('editNoop'); } }
        m.hist.set(w.id, J(w)); hit(x.t + 'Commit');
      }
      break;
    }

    /* ===== ćwiczenia ===== */
    case 'newEx': { const raw = NAMES[x.b % NAMES.length]; store.newExercise(raw.replace(/\s+/g, ' ').trim() || undefined); break; } /* app/(tabs)/exercises.tsx: „Utwórz …” */
    case 'equip': { const e = pick(exs, x.b); if (e) { const eq = (['hantle', 'sztanga', 'masa ciała', 'maszyna', 'linki', 'inne'] as const)[x.c % 6];
      store.setEquipment(e, eq); implFresh(where, S().active?.exercises.filter(b => b.exerciseId === e.id)); } /* tylko bloki zmienionego ćwiczenia: inne mogą mieć przyrząd sprzed cofnięcia odhaczenia (reguła „przelicz przy zmianie”) */ break; }
    case 'metric': { const e = pick(exs, x.b); if (e) { e.metric = METRICS[x.c % METRICS.length]; store.save(e); } break; } /* app/exercise/[id].tsx:25 */
    case 'bandAssist': { const e = pick(exs, x.b); if (e) { e.bandAssistable = !e.bandAssistable; store.save(e); } break; }
    case 'delEx': { const e = pick(exs, x.b); if (!e) break; const used = store.exerciseUsed(e.id);
      const exp = (JSON.parse(m.tpl) as Template[]).map(tp => { const items = tp.items.filter(i => i.exerciseId !== e.id).map(i => { if (!i.alternates) return i; const al = i.alternates.filter(z => z.exerciseId !== e.id); const c: TemplateItem = { ...i, alternates: al }; if (!al.length) delete c.alternates; return c; }); store.normalizeGroups(items); return { ...tp, items }; });
      store.deleteExercise(e.id);
      expect({ where, t: canonTpls(S().templates) }).toEqual({ where, t: canonTpls(exp) }); /* jedyna kaskada na szablony: usunięcie ćwiczenia (decyzja: „znika z szablonów”) */
      ok(used ? store.exById(e.id)?.archived === true : !store.exById(e.id), where, 'usunięcie ćwiczenia: archiwum ⇔ użyte');
      m.tpl = J(S().templates); hit(used ? 'delExArchive' : 'delExHard'); break; }
    case 'restoreEx': { const e = pick(st.exercises.filter(z => z.archived), x.b); if (e) { store.restoreExercise(e); hit('restoreEx'); } break; } /* app/(tabs)/exercises.tsx:24 „Przywróć” */

    /* ===== miejsca, sprzęt, gumy ===== */
    case 'addLoc': { const l = locs.addLocation(LOCATION_PRESETS[x.b % LOCATION_PRESETS.length]); ok(!!store.locationById(S().settings.mainLocationId) && !!store.locationById(l.id), where, 'nowe miejsce / główne'); hit('addLoc'); break; }
    case 'delLoc': if (loc) { const can = locs.canDeleteLocation(loc.id); ok(locs.deleteLocation(loc.id) === can, where, 'deleteLocation ≠ canDeleteLocation'); if (can && act?.locationId === loc.id) implFresh(where); } break;
    case 'setMain': if (loc) locs.setMainLocation(loc.id); break;
    case 'dupLoc': if (loc) locs.duplicateLocation(loc.id); break;
    case 'renameLoc': if (loc) { const prev = loc.name; locs.renameLocation(loc, NAMES[x.b % NAMES.length]); locs.commitLocationName(loc, prev); } break;
    case 'setEquip': if (loc) { const eq0 = J(loc.equipment); { const it = EQUIPMENT[x.b % EQUIPMENT.length]; locs.setEquip(loc, it.id, x.c % 3 !== 0); } if (act?.locationId === loc.id && J(loc.equipment) !== eq0) implFresh(where); } break;
    case 'setOpt': if (loc) { const eq0 = J(loc.equipment); { const it = pick(EQUIPMENT.filter(q => q.options?.length && locs.activeEquip(loc, q.id)), x.b); if (it) locs.setOpt(loc, it.id, it.options![x.c % it.options!.length].id, x.c % 2 === 0); } if (act?.locationId === loc.id && J(loc.equipment) !== eq0) implFresh(where); } break;
    case 'setBandLevel': if (loc) { const eq0 = J(loc.equipment); locs.setBandLevel(loc, 1 + (x.b % 7), x.c % 2 === 0); if (act?.locationId === loc.id && J(loc.equipment) !== eq0) implFresh(where); } break;
    case 'delBand': { const b = pick(st.bands, x.b); if (b) store.deleteBand(b.id); break; }
    case 'bodyMass': { const l = store.bodyMassLog();
      if (x.c % 3 === 0 && l.length) store.removeBodyMass(pick(l, x.b)!.date);
      else { const day = store.localISODate(new Date(Date.now() - (x.a % 40) * 86400e3)); const kg = 40 + (x.b % 80) + (x.c % 4) / 4; ok(store.addBodyMass(kg, day) === null, where, 'pomiar masy ciała odrzucony'); ok(store.bodyMassOn(day) === kg, where, 'pomiar z tego dnia'); }
      const l2 = store.bodyMassLog(); ok(l2.every((e, i) => i === 0 || l2[i - 1].date < e.date), where, 'pomiary rosnąco, jeden na dzień'); hit('bodyMass'); break; }
    case 'setBandColor': { const b = pick(st.bands, x.b); if (b) locs.setBandColor(b.level, ['czerwona', 'zielona', '', 'x'][x.c % 4] || 'niebieska'); break; }

    /* ===== plan tygodnia (audyt 0.10: ekran Plan tygodnia i panel dnia w Kalendarzu) ===== */
    case 'planDay': case 'planDayOv': case 'planShift': case 'planMove': case 'planNew': case 'planActivate': {
      const live = st.templates.filter(t => !t.archived); const tid = x.c % 3 ? pick(live, x.b)?.id ?? null : null; const day = plan.addDays(today, (x.b % 15) - 7);
      if (x.t === 'planDay') { plan.setWeekDay(x.a % 7, tid); ok(plan.weekPlanDays()[x.a % 7] === tid, where, 'setWeekDay'); }
      else if (x.t === 'planDayOv') { if (day < today && tid) break; plan.setDayPlan(day, tid); pastTouched = day; ok(plan.plannedOn(day, today) === (day < today ? null : tid), where, 'setDayPlan'); } /* miniony dzień — tylko „Wolne” (A4) */
      else if (x.t === 'planShift') { const busy = plan.busyDays(); const r = plan.shiftPlan(day, today); pastTouched = day; ok(r.moved.every(mv => mv.to >= today && !busy.has(mv.to)), where, 'przesunięcie na miniony albo zajęty dzień (A3/A4)', r); }
      else if (x.t === 'planMove') { const to = plan.addDays(today, x.c % 7); const busy = plan.busyDays(); const had = plan.plannedOn(to, today); const r = plan.moveOnly(day, to, today); pastTouched = day;
        if (busy.has(to) || had) ok(plan.plannedOn(to, today) === had, where, 'przeniesienie na dzień zajęty bez polecenia (A3)', r); }
      else if (x.t === 'planNew') { const n = plan.savedPlans().length; const id = plan.newPlan(); ok(id ? plan.savedPlans().length === n + 1 : plan.plansFull(), where, 'newPlan / limit (B3)'); if (id && tid) plan.setSavedDay(id, x.a % 7, tid); }
      else { const p = pick(plan.savedPlans(), x.a); if (!p) break; const fut = J(Object.fromEntries(Object.entries(S().planOverrides ?? {}).filter(([k]) => k >= today && plan.isChanged(k, today)))); const prevDays = J(plan.weekPlanDays());
        plan.activatePlan(p.id); const back = plan.savedPlans()[plan.savedPlans().length - 1];
        if (prevDays !== J(Array(7).fill(null)) && back) ok(J(back.days) === prevDays && J(back.overrides ?? {}) === fut, where, 'poprzedni plan zapisany razem ze zmianami dni od dziś (B1)', { back, fut }); }
      hit(x.t); break; }
    /* ===== fala 2 audytu 0.10 (M3): edycja na żądanie, zapis jako szablon, archiwum, deload, pauza, „Pomiń dziś”, Zdrowie, plany ===== */
    case 'draft': { /* app/exercise/[id].tsx i app/template/[id].tsx: „Edytuj” → szkic → „Anuluj” albo „Zapisz” (decyzja właściciela 08.10.2026) */
      const isTpl = x.a % 2 === 0; const id = isTpl ? tpl?.id : pick(exs, x.b)?.id; if (!id) break; const kind = isTpl ? 'template' as const : 'exercise' as const;
      const exBefore = J(S().exercises); const d = draft.beginObjDraft<Template & Exercise>(kind, id)!; ok(!!d && store.isDraftObj(d), where, 'szkic nie powstał');
      d.name = NAMES[x.b % NAMES.length]; if (isTpl) { if (d.items.length > 1 && x.c % 3 === 0) store.removeItem(d.items, x.b % d.items.length, d); store.setTemplateNote(d, NAMES[x.c % NAMES.length]); } else d.notes = NAMES[x.c % NAMES.length]; store.save(d);
      ok(J(S().templates) === tplBefore && J(S().exercises) === exBefore, where, 'zmiana w szkicu trafiła do danych przed „Zapisz”');
      if (x.c % 2) { draft.discardObjDraft(kind, id); ok(J(S().templates) === tplBefore && J(S().exercises) === exBefore && !draft.objDraft(kind, id), where, '„Anuluj” zmieniło dane'); hit('draftCancel'); }
      else { ok(draft.commitObjDraft(kind, id), where, '„Zapisz” odrzucone'); const real = isTpl ? S().templates.find(t => t.id === id)! : store.exById(id)!;
        ok(!store.isDraftObj(real) && real.name === store.clampName(real.name.replace(/\s+/g, ' ').trim()) && !!real.name, where, 'nazwa po zapisie szkicu', real.name);
        if (isTpl) othersSame(id); else ok(J(S().templates) === tplBefore, where, 'zapis szkicu ćwiczenia zmienił szablony'); hit('draftSave'); }
      break; }
    case 'saveAsTpl': { const w = pick(st.workouts, x.a); if (!w) break; const n = st.templates.length; const t = tplsync.templateFromWorkout(w); /* app/history/[id].tsx: „Zapisz jako szablon” (H5) */
      const live = w.exercises.filter(b => { const e = store.exById(b.exerciseId); return e && !e.archived && b.sets.length; });
      ok(S().templates.length === n + 1 && t.items.length === live.length && t.items.every((it, i) => it.exerciseId === live[i].exerciseId && store.tplRows(it).length === live[i].sets.length), where, 'szablon z treningu = jego ćwiczenia i serie', { t, live: live.map(b => b.exerciseId) });
      ok(!st.templates.some(z => z.id !== t.id && z.name === t.name), where, 'nazwa szablonu z treningu powtórzona', t.name);
      othersSame(t.id); hit('saveAsTpl'); break; }
    case 'tplArchive': if (tpl) { store.setTemplateArchived(tpl, !tpl.archived); othersSame(tpl.id); hit('tplArchive'); } break; /* app/template/[id].tsx: „Do archiwum” / „Przywróć” (A7) */
    case 'deload': { const ts = Date.now() - (x.a % 60) * 86400e3 + (x.b % 30) * 86400e3; const was = store.isDeloadWeek(ts); store.toggleDeloadWeek(ts); ok(store.isDeloadWeek(ts) === !was, where, 'tydzień deload: przełącznik'); hit('deload'); break; }
    case 'pause': if (act) { const was = store.isPaused(act); if (was) store.resumeWorkout(); else store.pauseWorkout(); ok(store.isPaused(S().active) === !was, where, 'pauza / wznowienie'); hit(was ? 'resume' : 'pause'); } break;
    case 'skipEx': if (act && blk) { if (blk.skipped) store.unskipExercise(blk.id); else if (!blk.sets.some(z => z.done)) store.skipExercise(blk.id); hit('skipEx'); } break; /* „Pomiń dziś” w treningu */
    case 'health': { /* J2: znacznik „czeka na Zdrowie” i ponowienie przy starcie / powrocie z tła; zapis w Zdrowiu zmienia tylko healthUUID i healthPending */
      const HK = require('@kingstinct/react-native-healthkit').default; const okSave = x.c % 2 === 0; let calls = 0;
      HK.saveWorkoutSample = async () => { calls++; return okSave ? 'hk-' + calls : false; };
      st.settings.healthSync = x.b % 4 !== 0; store.saveCfg(); /* Ustawienia: przełącznik „Zapisuj w Apple Health” */ const w = pick(st.workouts.filter(z => !z.healthUUID), x.a); if (w) { w.healthPending = true; store.save(w); }
      const pend = health.healthPending().map(z => z.id); const bare = (z: Workout) => { const c = JSON.parse(J(z)); delete c.healthUUID; delete c.healthPending; delete c.updatedAt; return J(c); };
      const snapBare = new Map(S().workouts.map(z => [z.id, bare(z)] as const)); const n = await health.retryHealth();
      ok(n === (st.settings.healthSync && okSave ? pend.length : 0), where, 'ponowienie: liczba zapisanych', { n, pend });
      for (const z of S().workouts) { ok(bare(z) === snapBare.get(z.id), where, 'zapis do Zdrowia zmienił trening poza znacznikami', z.id); ok(!(z.healthPending && z.healthUUID), where, 'znacznik „czeka” przy zapisanym w Zdrowiu', z); m.hist.set(z.id, J(z)); }
      HK.saveWorkoutSample = async () => false; hit('health'); break; }
    case 'planRename': case 'planDel': { const p = pick(plan.savedPlans(), x.a); if (!p) break; if (x.t === 'planDel') { plan.deletePlan(p.id); ok(!plan.savedPlans().some(q => q.id === p.id), where, 'usunięcie planu'); }
      else { plan.renamePlan(p.id, NAMES[x.b % NAMES.length], p.name); const q = plan.savedPlans().find(z => z.id === p.id)!; ok(!!q.name || !p.name, where, 'pusta nazwa planu zamiast poprzedniej', { p, q }); }
      hit(x.t); break; }
    case 'planSwap': { const a = plan.addDays(today, x.a % 7), b = plan.addDays(today, x.b % 7); const busy = plan.busyDays(); const pa = plan.plannedOn(a, today), pb = plan.plannedOn(b, today);
      plan.swapDays(a, b, today); if (!busy.has(a) && !busy.has(b)) ok(plan.plannedOn(a, today) === pb && plan.plannedOn(b, today) === pa, where, 'zamiana dni (A4)', { a, b, pa, pb }); else ok(plan.plannedOn(a, today) === pa && plan.plannedOn(b, today) === pb, where, 'zamiana z dniem zajętym', { a, b }); hit('planSwap'); break; }
    case 'planSuggest': { /* panel dnia: „Przesuń albo pomiń” na dniu z planem (bez planu w oknie — najpierw dzień planu tygodnia, jak na ekranie Plan) */
      const near = () => Array.from({ length: 10 }, (_, i) => plan.addDays(today, i - 3)).filter(k => plan.plannedOn(k, today));
      if (!near().length) { const t = pick(st.templates.filter(z => !z.archived), x.b); if (!t) break; plan.setWeekDay(plan.weekdayIdx(plan.addDays(today, x.c % 7)), t.id); }
      const day = pick(near(), x.a); if (!day) break; const list = plan.suggest(day, today); const sg = pick(list, x.b); pastTouched = day;
      if (sg) { const busy = plan.busyDays(); plan.applySuggestion(sg); ok(sg.placed.every(pl => pl.to >= today && !busy.has(pl.to)), where, 'propozycja na miniony albo zajęty dzień (A3/A4)', sg); hit('planSuggest'); } break; }
    case 'planReset': { const day = plan.addDays(today, (x.a % 10) - 3); plan.resetDay(day); pastTouched = day; ok(!plan.isChanged(day, today), where, 'powrót dnia do planu'); hit('planReset'); break; }

    /* ===== ustawienia i dane ===== */
    case 'unit': case 'lang': { const before = strip(st); const s = st.settings;
      if (x.t === 'unit') s.unit = s.unit === 'lb' ? 'kg' : 'lb'; else s.language = (['pl', 'en', 'auto'] as const)[x.b % 3];
      store.applyPrefs(); store.save(); const after = strip(S()); before.settings.unit = after.settings.unit; before.settings.language = after.settings.language;
      expect({ where, s: after }).toEqual({ where, s: before }); /* jednostka/język nie zmieniają zapisanych kg ani niczego innego */ hit(x.t); break; }
    case 'libScope': { const before = strip(st); store.setLibShowAll(x.b % 2 === 0); const after = strip(S()); if (x.b % 2 === 0) before.settings.libShowAll = true; else delete before.settings.libShowAll;
      expect({ where, s: after }).toEqual({ where, s: before }); /* filtr „Podstawowe” (research biblioteki 09.10.2026) zmienia tylko ustawienie widoku */ hit(x.t); break; }
    case 'planHint': { const before = strip(st); store.setPlanHintHidden(x.b % 2 === 0); const after = strip(S()); if (x.b % 2 === 0) before.planHintHidden = true; else delete before.planHintHidden;
      expect({ where, s: after }).toEqual({ where, s: before }); /* zmienia tylko flagę — nic innego */ hit(x.t); break; }
    case 'reload': await reloadCheck(where); hit('reload'); break;
    case 'roundtrip': await roundtripCheck(where); hit('roundtrip'); break;
    case 'migrate': migrateCheck(where); break;
    case 'stats': statsCheck(where); hit('stats'); break;
    case 'resetAll': { store.resetAll(); await store.flush(); store.setTimerState(blankTimer()); ok(!S().templates.length && !S().workouts.length && !S().active, where, 'reset: bez szablonów, historii i treningu'); snap(m); hit('resetAll'); break; }
  }

  if (pastBefore) { const after = pastKeys.map(k => J(plan.dayStatus(k, today))); const changed = pastKeys.filter((k, i) => after[i] !== pastBefore[i] && k !== pastTouched);
    ok(!changed.length, where, 'działanie zmieniło status minionego dnia (audyt 0.10 A1 — plan nie obowiązuje wstecz)', changed.map(k => [k, JSON.parse(pastBefore[pastKeys.indexOf(k)]), plan.dayStatus(k, today)])); }
  if (TPL_EDIT.has(x.t)) m.tpl = J(S().templates);
  if (ACTIVE_FROZEN.has(x.t)) ok(J(S().active) === activeBefore, where, 'działanie poza treningiem zmieniło trening w toku', { before: JSON.parse(activeBefore), after: S().active });
}

/* ---------- niezmienniki po każdym kroku ---------- */
function groupsOk(list: { groupId?: string | null }[]) {
  const seen = new Set<string>(); let prev: string | null = null; let run = 0;
  for (const it of list) { const g = it.groupId ?? null; if (g !== prev) { if (prev && run < 2) return false; if (g && seen.has(g)) return false; if (g) seen.add(g); run = 1; prev = g; } else run++; }
  return !(prev && run < 2);
}
const onGrid = (v: unknown) => v === '' || v == null || Math.abs(Number(v) * 100 - Math.round(Number(v) * 100)) < 1e-6;
const uniq = (where: string, what: string, ids: string[]) => { const s = new Set(ids); if (s.size !== ids.length) fail(where, `zduplikowane id: ${what}`, ids.filter((x, i) => ids.indexOf(x) !== i)); };

function light(m: Model, where: string) {
  const st = S();
  /* model: szablony zmieniają tylko jawne edycje (i kaskada usunięcia ćwiczenia), historia — tylko zakończenie, usunięcie, edycja, trening wstecz */
  if (J(st.templates) !== m.tpl) expect({ where, why: 'szablony zmienione przez działanie, które ich nie edytuje', t: st.templates }).toEqual({ where, why: 'szablony zmienione przez działanie, które ich nie edytuje', t: JSON.parse(m.tpl) });
  const h = histMap(); if (J([...h].sort()) !== J([...m.hist].sort())) expect({ where, why: 'historia zmieniona poza jej edycją', h: Object.fromEntries([...h].map(([k, v]) => [k, JSON.parse(v)])) }).toEqual({ where, why: 'historia zmieniona poza jej edycją', h: Object.fromEntries([...m.hist].map(([k, v]) => [k, JSON.parse(v)])) });

  ok(st.schemaVersion === SCHEMA_VERSION, where, 'schemaVersion');
  /* audyt 0.10 A1: historia planu — rosnąco, bez równych sąsiadów; ostatni odcinek = plan tygodnia */
  { const h = st.planHistory ?? []; ok(h.every((x, i) => i === 0 || (h[i - 1].from < x.from && J(h[i - 1].days) !== J(x.days))), where, 'historia planu nieuporządkowana', h);
    if (h.length) ok(J(h[h.length - 1].days) === J(plan.weekPlanDays()), where, 'ostatni odcinek historii ≠ plan tygodnia', { h, w: st.weekPlan }); else ok(!plan.weekPlanDays().some(Boolean), where, 'plan tygodnia bez historii'); }
  /* fala 2 audytu 0.10 (M3 / TST-03): plan wskazuje istniejące szablony albo dzień wolny; klucze zmian dni to daty; od dziś zmiany dni tylko na
   * istniejące szablony; nazwy zapisanych planów bez powtórzeń; tygodnie deload to poniedziałki (rosnąco, bez powtórzeń); pauzy w czasie treningu */
  { const ids = new Set(st.templates.map(t => t.id)); const today = plan.dayKeyOf(Date.now()); const isDate = (k: string) => /^\d{4}-\d{2}-\d{2}$/.test(k) && plan.addDays(k, 0) === k;
    ok(plan.weekPlanDays().every(d => d === null || ids.has(d)), where, 'plan tygodnia wskazuje usunięty szablon', st.weekPlan);
    ok((st.savedPlans ?? []).every(p => p.days.length === 7 && p.days.every(d => d === null || ids.has(d))), where, 'zapisany plan wskazuje usunięty szablon', st.savedPlans);
    const ov = Object.entries(st.planOverrides ?? {}); ok(ov.every(([k, v]) => isDate(k) && (v === null || typeof v === 'string')), where, 'zmiany dni: klucz nie jest datą', ov);
    ok(ov.every(([k, v]) => k < today || v === null || ids.has(v)), where, 'zmiana dnia od dziś wskazuje usunięty szablon', ov);
    const names = (st.savedPlans ?? []).map(p => p.name).filter(Boolean); ok(new Set(names).size === names.length, where, 'nazwy zapisanych planów powtórzone', names);
    const dw = st.deloadWeeks ?? []; ok(dw.every((k, i) => isDate(k) && plan.weekdayIdx(k) === 0 && (i === 0 || dw[i - 1] < k)), where, 'tydzień deload: nie poniedziałek / nieuporządkowane', dw);
    for (const w of [...st.workouts, ...(st.active ? [st.active] : [])]) { const p = w.pauses ?? []; const end = w.finishedAt ?? Date.now() + 1;
      ok(p.every(([f, t], i) => f >= w.startedAt && t > f && t <= end && (i === 0 || p[i - 1][1] < f)), where, 'pauzy poza czasem treningu albo nachodzą', { id: w.id, start: w.startedAt, end: w.finishedAt, p });
      ok(w.pausedAt === undefined || (w === st.active && w.pausedAt >= w.startedAt), where, 'pauza trwa w zakończonym treningu', w.pausedAt); } }
  /* unikalne id */
  uniq(where, 'ćwiczenia', st.exercises.map(e => e.id)); uniq(where, 'gumy', st.bands.map(b => b.id)); uniq(where, 'szablony', st.templates.map(t => t.id));
  uniq(where, 'miejsca', st.settings.locations.map(l => l.id)); const all = [...st.workouts, ...(st.active ? [st.active] : [])]; uniq(where, 'treningi', all.map(w => w.id));
  uniq(where, 'pozycje szablonów', st.templates.flatMap(t => t.items.map(i => i.id))); uniq(where, 'bloki', all.flatMap(w => w.exercises.map(e => e.id))); uniq(where, 'serie', all.flatMap(w => w.exercises.flatMap(e => e.sets.map(s => s.id))));
  /* referencje */
  const exIds = new Set(st.exercises.map(e => e.id)); const liveEx = new Set(st.exercises.filter(e => !e.archived).map(e => e.id)); const bandIds = new Set(st.bands.map(b => b.id));
  const s = st.settings; ok(s.locations.length ? !!store.locationById(s.mainLocationId) : s.mainLocationId === null, where, 'mainLocationId', { main: s.mainLocationId, locs: s.locations.map(l => l.id) });
  ok(s.unit === 'kg' || s.unit === 'lb', where, 'unit');
  for (const t of st.templates) {
    ok(groupsOk(t.items), where, 'supersety szablonu', t.items.map(i => i.groupId));
    for (const it of t.items) {
      ok(liveEx.has(it.exerciseId), where, 'pozycja szablonu wskazuje usunięte/brakujące ćwiczenie', it);
      for (const a of it.alternates ?? []) ok(liveEx.has(a.exerciseId), where, 'zamiennik wskazuje usunięte ćwiczenie', a);
      ok(new Set((it.alternates ?? []).map(a => a.locationId)).size === (it.alternates ?? []).length, where, 'dwa zamienniki dla jednego miejsca', it.alternates);
      if (it.rows) { const r = it.rows; ok(r.length >= 1 && r.length <= 50 && it.sets === r.length, where, 'wiersze szablonu ↔ sets', it); uniq(where, 'wiersze pozycji', r.map(z => z.id));
        const w = r.find(z => z.kind === 'normal' || z.kind === 'failure'); ok(J(it.startWeight) === J(w ? w.weight : '') && J(it.targetSec) === J(w && Number(w.durationSec) > 0 ? Number(w.durationSec) : ''), where, 'startWeight/targetSec ≠ pierwszy wiersz roboczy', it); }
      else ok(Number.isInteger(it.sets) && it.sets >= 1 && it.sets <= 50, where, 'sets pozycji', it);
    }
  }
  for (const w of all) {
    ok(groupsOk(w.exercises), where, 'supersety treningu', w.exercises.map(e => e.groupId));
    for (const e of w.exercises) {
      ok(exIds.has(e.exerciseId), where, 'blok wskazuje nieistniejące ćwiczenie', e);
      ok(!e.implPinned || !!e.impl, where, 'implPinned bez impl', e); ok(e.swappedFrom !== e.exerciseId, where, 'swappedFrom = exerciseId', e);
      for (const x of e.sets) { ok(x.warmup === (x.kind === 'warmup'), where, 'warmup ≠ kind', x); ok(onGrid(x.weight) && onGrid(x.addKg), where, 'kg poza siatką 0,01', x); }
    }
  }
  for (const w of st.workouts) {
    ok(w.finishedAt != null && w.finishedAt >= w.startedAt && w.exercises.length > 0, where, 'trening w historii: koniec ≥ start, niepusty', w);
    for (const e of w.exercises) { ok(e.sets.length > 0 && e.sets.every(x => x.done && x.pre === undefined), where, 'historia: tylko odhaczone serie, bez „pre”', e); ok(e.splitFrom === undefined && e.altSkip === undefined, where, 'historia: splitFrom/altSkip', e); }
    ok(w.staleAck === undefined, where, 'historia: staleAck', w);
  }
  const a = st.active; const tm = st.timer;
  if (a) {
    ok(a.finishedAt === null, where, 'trening w toku z końcem');
    for (const e of a.exercises) { ok(e.sets.length >= 1, where, 'blok treningu w toku bez serii', e);
      /* decyzja 8c / L5: blok bez odhaczonych serii i bez ręcznego wyboru ma przyrząd rozstrzygnięty dla miejsca treningu */ for (const x of e.sets) if (!x.done) ok(!x.bandId || bandIds.has(x.bandId), where, 'nieodhaczona seria z usuniętą gumą', x); }
    const ids = activeSetIds(); ok((!tm.restSetId || ids.has(tm.restSetId)) && (!tm.setId || ids.has(tm.setId)), where, 'zegar wskazuje serię, której nie ma', tm);
  } else ok(!tm.restSetId && !tm.setId, where, 'zegar bez treningu', tm);
}

/* ---------- niezmienniki ciężkie ---------- */
function migrateCheck(where: string) {
  const s0 = strip(S()); const m1 = store.migrate(JSON.parse(J(S())));
  ok(m1.schemaVersion === SCHEMA_VERSION, where, 'migrate: schemaVersion');
  expect({ where, why: 'migrate(stan aplikacji) zmienia dane (I1)', s: strip(m1) }).toEqual({ where, why: 'migrate(stan aplikacji) zmienia dane (I1)', s: s0 });
  const m2 = store.migrate(JSON.parse(J(m1)));
  expect({ where, why: 'migrate nieidempotentne', s: strip(m2) }).toEqual({ where, why: 'migrate nieidempotentne', s: strip(m1) });
}
async function reloadCheck(where: string) {
  await store.flush(); const before = strip(S());
  store.__resetForTests(); await store.init();
  expect({ where, why: 'stan po ponownym uruchomieniu ≠ przed', s: strip(S()) }).toEqual({ where, why: 'stan po ponownym uruchomieniu ≠ przed', s: before });
}
async function roundtripCheck(where: string) {
  const before = strip(S(), true); const next = parseBackup(J(buildBackup())); store.replaceState(next); await store.flush();
  expect({ where, why: 'eksport → import nie jest bezstratny', s: strip(S(), true) }).toEqual({ where, why: 'eksport → import nie jest bezstratny', s: before });
}
/** Objętość serii liczona niezależnie od lib/store (definicja: docs + store.setVolume): robocza, kg × powt. × mnożnik (hantle/jednostronne ×2,
 * stacja elektryczna przy ćwiczeniu na dwie linki ×2, masa ciała ×1, tylko ±kg dociążenia); pole „obce” (zapis pod innym sprzętem) = 0. */
function myVol(ex: Exercise, s: WSet, impl?: Impl) {
  if (!working(s) || (ex.metric ?? 'weight_reps') !== 'weight_reps') return 0;
  const bw = ex.equipment === 'masa ciała'; const a = bw ? s.addKg : s.weight, b = bw ? s.weight : s.addKg; const has = (v: unknown) => v !== '' && v != null;
  const own = has(a) || !has(b); const raw = has(a) ? Number(a) || 0 : has(b) ? Number(b) || 0 : 0; const kg = bw ? raw : Math.max(0, raw); const eff = Math.max(0, own ? kg : 0);
  const mult = bw ? 1 : impl === 'electric' && ex.lib === true && Object.prototype.hasOwnProperty.call(CABLES, ex.name) && CABLES[ex.name] === 2 ? 2 : ex.loadMode === 'total' ? 1 : 2;
  return mult * eff * repsOf(s);
}
function statsCheck(where: string) {
  const st = S(); const fin = st.workouts.filter(w => w.finishedAt);
  for (const ex of st.exercises) {
    const ws = fin.filter(w => w.exercises.some(e => e.exerciseId === ex.id && e.sets.some(working)));
    const ses = stats.sessionsFor(ex);
    ok(ses.length === ws.length, where, `sesje ${ex.name}: ${ses.length} ≠ ${ws.length} (rozgrzewki nie tworzą sesji)`);
    ok(stats.hasHistory(ex.id) === (ws.length > 0), where, 'hasHistory');
    for (let i = 1; i < ses.length; i++) ok(ses[i].date >= ses[i - 1].date, where, 'sesje nie rosną po dacie');
    for (const x of ses) { const n = x.workout.exercises.filter(e => e.exerciseId === ex.id).reduce((q, e) => q + e.sets.filter(working).length, 0); ok(x.sets.length === n && x.sets.every(working), where, 'serie sesji = serie robocze', { ex: ex.name, n, got: x.sets.length }); }
    const r = stats.recordsFor(ex); const sets = ses.flatMap(x => x.sets); const mt = ex.metric ?? 'weight_reps';
    ok(r.any === ses.length > 0, where, 'records.any');
    ok(r.maxReps === (hasReps(mt) ? maxOf(sets.filter(z => z.kind !== 'drop').map(repsOf)) : 0), where, `maxReps ${ex.name}`, { r: r.maxReps });
    ok(r.maxDuration === (hasTime(mt) ? maxOf(sets.map(z => Number(z.durationSec) || 0)) : 0), where, `maxDuration ${ex.name}`);
    ok(r.maxDistance === (hasDistance(mt) ? maxOf(sets.map(z => Number(z.distanceM) || 0)) : 0), where, `maxDistance ${ex.name}`);
    ok(r.bestTotal === maxOf(ses.map(x => x.total)), where, `bestTotal ${ex.name}`);
    const tk = stats.totalKind(ex);
    for (const x of ses) {
      if (tk === 'łączny czas') ok(x.total === x.sets.reduce((q, z) => q + (Number(z.durationSec) || 0), 0), where, 'suma czasu sesji');
      if (tk === 'łączny dystans') ok(x.total === x.sets.reduce((q, z) => q + (Number(z.distanceM) || 0), 0), where, 'suma dystansu sesji');
      if (st.settings.unit === 'kg') { const v = x.workout.exercises.filter(e => e.exerciseId === ex.id).reduce((q, e) => q + e.sets.reduce((p, z) => p + myVol(ex, z, e.impl), 0), 0); ok(Math.abs(x.volume - v) <= 1e-6 * Math.max(1, v), where, `objętość sesji ${ex.name}`, { lib: x.volume, mine: v }); }
    }
  }
  /* tygodnie (Postępy): treningi, serie robocze (bez rozgrzewek), objętość */
  const wk = stats.weeklyTotals(8); const end = stats.thisMonday(1);
  const exp = wk.map(b => ({ weekStart: b.weekStart, volume: 0, sets: 0, workouts: 0 }));
  for (const w of fin) { if (w.startedAt < exp[0].weekStart || w.startedAt >= end) continue; let i = exp.length - 1; while (i > 0 && w.startedAt < exp[i].weekStart) i--;
    exp[i].workouts++; for (const e of w.exercises) { const ex = store.exById(e.exerciseId); if (!ex) continue; exp[i].sets += workN(e.sets); exp[i].volume += e.sets.reduce((q, z) => q + myVol(ex, z, e.impl), 0); } }
  wk.forEach((b, i) => { ok(b.workouts === exp[i].workouts && b.sets === exp[i].sets, where, 'weeklyTotals: treningi/serie', { lib: b, mine: exp[i] });
    if (st.settings.unit === 'kg') ok(Math.abs(b.volume - exp[i].volume) <= 1e-6 * Math.max(1, exp[i].volume), where, 'weeklyTotals: objętość', { lib: b, mine: exp[i] }); });
  const mon = stats.thisMonday(); const d = new Date(mon); const nx = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7).getTime(); const mus: Record<string, number> = {};
  for (const w of fin) { if (w.startedAt < mon || w.startedAt >= nx) continue; for (const e of w.exercises) { const ex = store.exById(e.exerciseId); if (!ex) continue; const n = workN(e.sets); if (!n) continue;
    ex.muscles.forEach(q => { mus[q] = (mus[q] ?? 0) + n; }); ex.secondaryMuscles.forEach(q => { mus[q] = (mus[q] ?? 0) + n * 0.5; }); } }
  expect({ where, m: stats.weeklySetsByMuscle(mon) }).toEqual({ where, m: mus });
}

/* ---------- przebieg ---------- */
/** Stały początek każdego przebiegu: szablon z czterema pozycjami z puli, superset i rozgrzewka — przez te same działania co losowe kroki. */
const PROLOGUE: Act[] = [
  { t: 'tplNew', a: 0, b: 0, c: 0, v: '' }, ...[0, 1, 2, 3].map(b => ({ t: 'tplAddItem' as const, a: 0, b, c: 0, v: '' as const })),
  { t: 'tplLink', a: 0, b: 0, c: 0, v: '' }, { t: 'tplAddRow', a: 0, b: 1, c: 1, v: '' }, { t: 'tplRow', a: 0, b: 0, c: 0, v: 5 },
];

/** Miejsca na start przebiegu (0 — bez miejsc, jak przed P-003; inaczej presety przez locations.addLocation). */
const LOC_START: Act[][] = [[], [{ t: 'addLoc', a: 0, b: 0, c: 0, v: '' }], [{ t: 'addLoc', a: 0, b: 0, c: 0, v: '' }, { t: 'addLoc', a: 0, b: 1, c: 0, v: '' }], [{ t: 'addLoc', a: 0, b: 1, c: 0, v: '' }, { t: 'addLoc', a: 0, b: 2, c: 0, v: '' }, { t: 'tplLoc', a: 0, b: 1, c: 1, v: '' }]];

async function runSeq(acts: Act[], locStart: number) {
  await fresh(); edit.__resetDrafts(); draft.__resetObjDrafts(); store.setTimerState(blankTimer());
  const m: Model = { tpl: '', hist: new Map() }; snap(m);
  const pro = [...PROLOGUE, ...LOC_START[locStart % LOC_START.length]]; const seq = [...pro, ...acts];
  for (let i = 0; i < seq.length; i++) { const where = `krok ${i - pro.length}: ${J(seq[i])}`; await step(seq[i], m, where); light(m, where); }
  const where = 'koniec sekwencji';
  migrateCheck(where); statsCheck(where); await reloadCheck(where); light(m, where + ' (po restarcie)'); await roundtripCheck(where); light(m, where + ' (po imporcie)');
}

/* Odtworzenie kontrprzykładu: MATRIX_REPLAY='<Counterexample z logu>' npx jest tests/matrix-invariants.test.ts -t replay */
(process.env.MATRIX_REPLAY ? test : test.skip)('replay', async () => { const [seq, loc] = JSON.parse(process.env.MATRIX_REPLAY!); try { await runSeq((seq as Act[][]).flat(), loc); } finally { units.applyUnit('kg'); edit.__resetDrafts(); } });

describe('macierz niezmienników — losowe sekwencje działań na prawdziwym API (model-based)', () => {
  afterAll(() => { units.applyUnit('kg'); });
  test('szablony tylko z jawnej edycji, historia tylko z jej edycji, referencje, unikalne id, supersety, zegary, jednostki, migrate, restart, eksport/import, statystyki', async () => {
    await fc.assert(fc.asyncProperty(seqArb, fc.nat(7), async (seq, locStart) => {
      try { await runSeq(seq.flat(), locStart); } finally { units.applyUnit('kg'); edit.__resetDrafts(); }
    }), { numRuns: RUNS, seed: SEED });
    if (process.env.MATRIX_COVERAGE) console.log(J(ran)); // eslint-disable-line no-console
    /* pokrycie: kluczowe ścieżki naprawdę się wykonały (inaczej niezmienniki byłyby puste) */
    if (RUNS >= 50 && !process.env.MATRIX_SEED) /* kontrola pokrycia tylko dla stałego ziarna — losowe może nie wylosować rzadkiej akcji */ for (const k of ['startTpl', 'finish', 'tick', 'swap', 'split', 'undoSwap', 'pastCommit', 'editCommit', 'draftSwap', 'delExArchive', 'delExHard', 'reload', 'roundtrip', 'addLoc', 'setLoc', 'tplAddRow', 'tplRmRow', 'tplKind', 'tplDup', 'repeat', 'unit', 'lang', 'rememberAlt', 'rememberRest', 'gen', 'tplNote', 'draftCancel', 'draftSave', 'saveAsTpl', 'tplArchive', 'deload', 'pause', 'resume', 'skipEx', 'health', 'planSwap', 'planSuggest', 'planReset', 'tplUpdate'])
      expect([k, (ran[k] ?? 0) > 0]).toEqual([k, true]);
  });
});

/* ---------- znaleziska (deterministyczne, minimalne) ---------- */
describe('macierz niezmienników — znaleziska', () => {
  /* Minimalny kontrprzykład z sekwencji: delEx (ćwiczenie z historią → archiwum) → restoreEx. „Przywróć” w UI ustawia `e.archived = false`
   * (app/(tabs)/exercises.tsx:24, app/picker.tsx:58, app/swap.tsx:76), a migrate usuwa każde archived ≠ true (lib/store.ts:246). Skutek: stan w pamięci
   * ≠ stan po ponownym uruchomieniu / imporcie (niezmiennik I1 „wczytanie zapisanych danych niczego nie zmienia”). Zachowanie aplikacji to samo
   * (wszędzie `!e.archived` / `=== true`), ale porównanie stanu przed i po restarcie nie jest dosłowne. */
  test('NAPRAWIONE 06.10: „Przywróć” zostawia archived: false, którego migrate nie zachowuje (I1: wczytanie zmienia dane)', async () => {
    await fresh(); store.startEmpty(); const e = S().exercises.find(x => x.name === 'Back Squat')!; store.addExerciseToActive(e);
    store.getState().active!.exercises[0].sets[0].reps = 5; store.toggleDone(0, 0); store.finishWorkout();
    store.deleteExercise(e.id); expect(e.archived).toBe(true);
    store.restoreExercise(e); /* jak przycisk „Przywróć …” (app/picker.tsx, app/swap.tsx, app/(tabs)/exercises.tsx) */
    for (const f of ['app/picker.tsx', 'app/swap.tsx', 'app/(tabs)/exercises.tsx']) expect(require('fs').readFileSync(require('path').join(__dirname, '..', f), 'utf8')).not.toMatch(/archived = false/);
    const before = JSON.parse(J(S())); const m = JSON.parse(J(store.migrate(JSON.parse(J(S())))));
    delete before.metaUpdatedAt; delete m.metaUpdatedAt; delete before.saveSeq; delete m.saveSeq;
    expect(m).toEqual(before);
  });
  /* Minimalny kontrprzykład z sekwencji: miejsce „Pełna siłownia” → start → blok „Bench Press (hantle)” (przyrząd: hantle) → w ekranie ćwiczenia sprzęt
   * „sztanga” (store.setEquipment, lib/store.ts:1358). Blok bez odhaczonych serii zostaje przy przyrządzie „dumbbell”, choć w tym miejscu ćwiczenie
   * rozstrzyga się teraz na sztangę. Ta sama reguła (L5, runda 82c) jest egzekwowana przy zmianie sprzętu MIEJSCA (store.locationEquipChanged)
   * i miejsca treningu (setActiveLocation), ale nie przy zmianie sprzętu ĆWICZENIA. Skutek: etykieta „kg/hant.”, „Poprzednio” wg przyrządu 8c,
   * lista ciężarów hantli i — po odhaczeniu — historia zapisana z przyrządem „dumbbell”. */
  test('NAPRAWIONE 06.10: zmiana sprzętu ćwiczenia nie przelicza przyrządu bloku w treningu w toku (reguła L5)', async () => {
    await fresh(); const l = locs.addLocation('gym'); store.startEmpty(); const e = S().exercises.find(x => x.name === 'Bench Press (hantle)')!;
    store.addExerciseToActive(e); const b = S().active!.exercises[0]; expect(b.impl).toBe('dumbbell');
    store.setEquipment(e, 'sztanga'); expect(store.implAtLoc(e, l.id)).toBe('barbell');
    expect(b.impl).toBe(store.implAtLoc(e, S().active!.locationId));
  });
});
