import { getState, getRev, exById, finishedWorkouts, wallTs, isWorking, workSetCount, setVolume, effectiveLoad, isDeloadWeek, isBW } from '@/lib/store';
import { dayKeyOf, hasPlan } from '@/lib/plan';
import { thisMonday, setsSplitByMuscle, setsGoal } from '@/lib/stats';
import { estimateItem, plannedDays, plannedRest } from '@/lib/progress';
import { emptySplit, sumSplit, SECONDARY_SHARE, type SetSplit } from '@/lib/setSplit';
import { MUSCLES, hasWeight, hasReps, type Muscle, type Exercise } from '@/lib/seed';
import { volOut, wOut, fmtNum } from '@/lib/units';
import { fmtDayMonth } from '@/lib/calendar';
import { t } from '@/lib/i18n';

/*
 * „Strażnik progresji” (specyfikacja zatwierdzona przez właściciela 14.10.2026; podstawy: docs/18, badacz — docs/research). Dwie osobne odpowiedzi na partię:
 *  1. CEL SERII: serie partii w tygodniu = wykonane + zaplanowane na pozostałe dni (jak compare('week')) wobec celu (ręcznego albo automatycznego).
 *     „Poniżej celu” tylko wtedy, gdy NAWET PO CAŁYM PLANIE tygodnia partia ma mniej serii niż cel. Partia bez serii i bez planu to „bez serii”, nie brak.
 *  2. KIERUNEK (progres): więcej / tyle samo / mniej względem poprzedniego tygodnia — wyłącznie kierunek, bez progów procentowych i bez oceny „za mało / za dużo”
 *     (badacz: brak konsensusu co do tempa, tonaż nie ma danych dawka–odpowiedź, progresja nie jest konieczna do korzyści; kolory neutralne).
 * To RACHUNEK z historii i planu użytkownika (szczebel 1), a reguły poniżej są KONWENCJAMI produktu (decyzje właściciela), nie twierdzeniami dziedzinowymi:
 *  - porównujemy tylko ćwiczenia, które były w OBU tygodniach (bieżący: wykonane + plan; poprzedni: wykonane); pozostałe wykluczone z obu i wymienione jako pominięte;
 *  - miara: tonaż (serie robocze × powtórzenia × ciężar — store.setVolume) ŚREDNIO NA SESJĘ ćwiczenia (sesja = trening albo zaplanowany dzień z tym ćwiczeniem),
 *    więc FBW raz kontra dwa razy w tygodniu nie daje fałszywego progresu;
 *  - tonaż spadł, a ciężar roboczy ćwiczenia (najwyższy ciężar serii roboczych) wzrósł → ćwiczenie liczy się jako progres (zmiana ciężaru = zamierzona progresja);
 *  - ćwiczenie obciążane (nie masa ciała, miara z ciężarem i powtórzeniami) zapisane w tygodniu porównawczym z 0 kg (tonaż 0), a teraz z ciężarem → też progres ciężarem
 *    (decyzja właściciela 19.10.2026: „ciężar roboczy wzrósł = progres”); w sumie ważonej liczy się jak progres ciężarem (jak poprzednio, więc nie zawyża partii),
 *    a wiersz pokazuje liczby wprost (poprz. 0 kg). Masa ciała bez dociążenia — nadal bez porównania (brak ciężaru z definicji);
 *  - partia: suma ćwiczeń z wagą (główna 1, pomocnicza SECONDARY_SHARE); „tyle samo” = równe po zaokrągleniu do liczby, którą widać na ekranie (volOut);
 *  - bez porównania („?”): brak wspólnych ćwiczeń, plan bez ciężaru lub powtórzeń („≥”), ćwiczenia bez ciężaru (masa ciała bez dociążenia, czas, gumy — tonaż 0);
 *  - tydzień oznaczony deload: bez oceny; tydzień po deloadzie porównujemy z ostatnim tygodniem bez deloadu i mówimy, z którym (badacz, pkt 13: konwencja);
 *  - bez poprzedniego tygodnia (nic w tygodniu porównawczym): trenowane partie są „nowe”.
 * OTWARTE (decyzje produktowe, bez źródła): sposób łączenia kilku ćwiczeń z progresem ciężaru i spadkiem innych; „ciężar roboczy” jako maksimum; zasięg wstecz po deloadzie
 * (GUARD_DELOAD_LOOKBACK_WEEKS); tydzień porównawczy po przerwie bez treningów (dziś: poprzedni tydzień kalendarzowy, nawet pusty → „nowe”).
 */
/** Ile tygodni wstecz szukamy tygodnia porównawczego bez deloadu (konwencja produktu; bez źródła — przy samych deloadach w tym zasięgu: brak porównania). */
export const GUARD_DELOAD_LOOKBACK_WEEKS = 8;

export type GuardDir = 'up' | 'same' | 'down' | 'unknown' | 'new' | 'none' | 'deload';
export type SkipReason = 'onlyNow' | 'onlyBefore' | 'noWeight' | 'unknownPlan';
type Side = { sessions: number; perSession: number; /** najwyższy ciężar serii roboczych (kg) */ weight: number };
export type GuardExercise = { exerciseId: string; /** waga w partii: 1 (główna) albo SECONDARY_SHARE (pomocnicza) */ share: number; now: Side; before: Side; dir: 'up' | 'same' | 'down'; /** tonaż spadł, a ciężar roboczy wzrósł */ byWeight: boolean;
  /** ćwiczenie obciążane zapisane poprzednio z 0 kg (tonaż 0), teraz z ciężarem — progres ciężarem (19.10.2026) */ fromZero: boolean };
export type GuardSkip = { exerciseId: string; reason: SkipReason };
export type GuardPart = {
  part: Muscle; dir: GuardDir; goal: number; done: SetSplit; planned: SetSplit; /** wykonane + zaplanowane, serie ważone */ total: number;
  /** brakujące serie do celu PO całym planie (0, gdy cel osiągnięty albo tydzień deload) */ gap: number; over: number; belowGoal: boolean; /** dni (RRRR-MM-DD) zaplanowanych treningów z tą partią */ plannedDays: string[];
  /** suma ważona tonażu na sesję porównywanych ćwiczeń (kg) i jej kierunek (wprost z liczb; bez poprawki o ciężar) albo null */ tonnage: { now: number; before: number; dir: 'up' | 'same' | 'down' } | null;
  /** którekolwiek porównywane ćwiczenie to progres ciężarem (spadek tonażu przy wzroście ciężaru albo poprzednio 0 kg — fromZero) */ byWeight: boolean; compared: GuardExercise[]; skipped: GuardSkip[];
};
export type Guard = {
  weekStart: number; current: boolean; deload: boolean; hasPlan: boolean; /** poniedziałek tygodnia porównawczego (bez deloadu) albo null */ comparedStart: number | null;
  /** tydzień porównawczy to bezpośrednio poprzedni tydzień */ adjacent: boolean; /** w tygodniu porównawczym był trening */ hasPrev: boolean;
  parts: GuardPart[]; /** poniżej celu po całym planie, od największej luki */ below: GuardPart[]; /** kierunek „mniej”, w kolejności MUSCLES */ less: GuardPart[];
};

type Agg = { sessions: number; tonnage: number; maxWeight: number; unknown: number };
const aggAdd = (m: Map<string, Agg>, id: string, tonnage: number, maxWeight: number, unknown: number) => {
  const a = m.get(id) ?? { sessions: 0, tonnage: 0, maxWeight: 0, unknown: 0 }; a.sessions++; a.tonnage += tonnage; a.maxWeight = Math.max(a.maxWeight, maxWeight); a.unknown += unknown; m.set(id, a);
};
const inRange = (w: { startedAt: number; tzOffsetMin?: number }, start: number, end: number) => { const x = wallTs(w); return x >= start && x < end; };

/** Wykonane ćwiczenia tygodnia: sesja = trening, w którym ćwiczenie ma serie robocze (kilka bloków tego samego ćwiczenia w treningu to jedna sesja). */
function doneAggs(start: number, end: number): Map<string, Agg> {
  const out = new Map<string, Agg>();
  for (const w of finishedWorkouts()) {
    if (!inRange(w, start, end)) continue; const per = new Map<string, { sets: number; tonnage: number; maxWeight: number }>();
    for (const e of w.exercises) {
      const ex = exById(e.exerciseId); if (!ex) continue; const n = workSetCount(e.sets); if (!n) continue; const a = per.get(ex.id) ?? { sets: 0, tonnage: 0, maxWeight: 0 }; a.sets += n;
      for (const s of e.sets.filter(isWorking)) { a.tonnage += setVolume(ex, s, e.impl); a.maxWeight = Math.max(a.maxWeight, effectiveLoad(ex, s)); }
      per.set(ex.id, a);
    }
    for (const [id, a] of per) aggAdd(out, id, a.tonnage, a.maxWeight, 0);
  }
  return out;
}
/** Zaplanowane, jeszcze niezrobione dni: sesja = dzień z szablonem zawierającym ćwiczenie; serie bez wartości (plan „≥”) w `unknown`. */
function plannedAggs(now: number): Map<string, Agg> {
  const out = new Map<string, Agg>();
  for (const { tpl } of plannedDays(now)) {
    const per = new Map<string, { sets: number; tonnage: number; maxWeight: number; unknown: number }>();
    tpl.items.forEach((_, ii) => { const e = estimateItem(tpl, ii); if (!e || !e.sets) return; const a = per.get(e.exerciseId) ?? { sets: 0, tonnage: 0, maxWeight: 0, unknown: 0 }; a.sets += e.sets; a.tonnage += e.volume; a.maxWeight = Math.max(a.maxWeight, e.maxWeight); a.unknown += e.unknown; per.set(e.exerciseId, a); });
    for (const [id, a] of per) aggAdd(out, id, a.tonnage, a.maxWeight, a.unknown);
  }
  return out;
}
const merge = (a: Map<string, Agg>, b: Map<string, Agg>): Map<string, Agg> => {
  const out = new Map(a); for (const [id, x] of b) { const y = out.get(id); out.set(id, y ? { sessions: x.sessions + y.sessions, tonnage: x.tonnage + y.tonnage, maxWeight: Math.max(x.maxWeight, y.maxWeight), unknown: x.unknown + y.unknown } : x); } return out;
};
/** Dni zaplanowanych treningów per partia (tylko ćwiczenia z seriami). */
function plannedDaysByPart(now: number): Map<string, string[]> {
  const out = new Map<string, string[]>();
  for (const { day, tpl } of plannedDays(now)) {
    tpl.items.forEach((_, ii) => { const e = estimateItem(tpl, ii); if (!e || !e.sets) return; const ex = exById(e.exerciseId); if (!ex) return;
      for (const m of [...(ex.muscles ?? []), ...(ex.secondaryMuscles ?? [])]) { const l = out.get(m) ?? []; if (!l.includes(day)) l.push(day); out.set(m, l); } });
  }
  return out;
}
/** Ćwiczenie, w którym ciężar jest częścią tonażu (nie masa ciała, miara z ciężarem i powtórzeniami) — 0 kg to wtedy zapis „bez ciężaru”, nie brak ciężaru z definicji. */
const weighted = (ex: Exercise) => !isBW(ex) && hasWeight(ex.metric ?? 'weight_reps') && hasReps(ex.metric ?? 'weight_reps');
const hasWorkoutIn = (start: number, end: number) => finishedWorkouts().some(w => inRange(w, start, end));
const dirOf = (a: number, b: number): 'up' | 'same' | 'down' => { const x = volOut(a), y = volOut(b); return x > y ? 'up' : x < y ? 'down' : 'same'; }; /* „tyle samo” = ta sama liczba na ekranie */

/** Strażnik dla tygodnia z przesunięciem `offset` (0 = bieżący: wykonane + plan; −1 i dalej = tydzień zamknięty: tylko wykonane). */
export function progressGuard(now = Date.now(), offset = 0): Guard {
  const d = new Date(now); const start = thisMonday(offset, d); const end = thisMonday(offset + 1, d); const current = offset === 0;
  const deload = isDeloadWeek(start);
  let comparedStart: number | null = null; let comparedEnd = 0;
  for (let i = 1; i <= GUARD_DELOAD_LOOKBACK_WEEKS; i++) { const ms = thisMonday(offset - i, d); if (!isDeloadWeek(ms)) { comparedStart = ms; comparedEnd = thisMonday(offset - i + 1, d); break; } }
  const adjacent = comparedStart === thisMonday(offset - 1, d);
  const hasPrev = comparedStart != null && hasWorkoutIn(comparedStart, comparedEnd);
  const prevAgg = comparedStart != null ? doneAggs(comparedStart, comparedEnd) : new Map<string, Agg>();
  const nowAgg = current ? merge(doneAggs(start, end), plannedAggs(now)) : doneAggs(start, end);
  const doneSplit = setsSplitByMuscle(start, end); const plannedSplit = current ? plannedRest(now).bySplit : {}; const days = current ? plannedDaysByPart(now) : new Map<string, string[]>();
  const parts: GuardPart[] = MUSCLES.map(part => {
    const done = doneSplit[part] ?? emptySplit(); const planned = plannedSplit[part] ?? emptySplit(); const total = sumSplit(done, planned).total; const goal = setsGoal(part);
    const compared: GuardExercise[] = []; const skipped: GuardSkip[] = [];
    for (const id of new Set([...nowAgg.keys(), ...prevAgg.keys()])) {
      const ex = exById(id); if (!ex) continue; const share = (ex.muscles ?? []).includes(part) ? 1 : (ex.secondaryMuscles ?? []).includes(part) ? SECONDARY_SHARE : 0; if (!share) continue;
      const a = nowAgg.get(id); const b = prevAgg.get(id);
      if (!b) { skipped.push({ exerciseId: id, reason: 'onlyNow' }); continue; } if (!a) { skipped.push({ exerciseId: id, reason: 'onlyBefore' }); continue; }
      if (a.unknown > 0) { skipped.push({ exerciseId: id, reason: 'unknownPlan' }); continue; }
      const fromZero = weighted(ex) && a.tonnage > 0 && !(b.tonnage > 0) && wOut(a.maxWeight) > wOut(b.maxWeight); /* poprzednio 0 kg, teraz z ciężarem (19.10.2026) */
      if (!fromZero && (!(a.tonnage > 0) || !(b.tonnage > 0))) { skipped.push({ exerciseId: id, reason: 'noWeight' }); continue; }
      const now: Side = { sessions: a.sessions, perSession: a.tonnage / a.sessions, weight: a.maxWeight }; const before: Side = { sessions: b.sessions, perSession: b.tonnage / b.sessions, weight: b.maxWeight };
      const dir = dirOf(now.perSession, before.perSession); compared.push({ exerciseId: id, share, now, before, dir, byWeight: dir === 'down' && wOut(now.weight) > wOut(before.weight), fromZero });
    }
    const byWeight = compared.some(c => c.byWeight || c.fromZero); let tonnage: GuardPart['tonnage'] = null; let dir: GuardDir;
    if (total <= 0) dir = 'none'; else if (deload) dir = 'deload'; else if (!hasPrev) dir = 'new'; else if (!compared.length) dir = 'unknown';
    else {
      const cur = compared.reduce((s, c) => s + c.share * c.now.perSession, 0); const prev = compared.reduce((s, c) => s + c.share * c.before.perSession, 0);
      const eff = compared.reduce((s, c) => s + c.share * (c.byWeight || c.fromZero ? c.before.perSession : c.now.perSession), 0); /* progres ciężarem: tonaż tego ćwiczenia liczy się jak poprzednio (nie jako spadek ani wzrost od 0) */
      tonnage = { now: cur, before: prev, dir: dirOf(cur, prev) }; const e = dirOf(eff, prev); dir = e === 'same' && byWeight ? 'up' : e;
    }
    const belowGoal = !deload && total > 0 && total < goal;
    return { part, dir, goal, done, planned, total, gap: belowGoal ? goal - total : 0, over: Math.max(0, total - goal), belowGoal, plannedDays: days.get(part) ?? [], tonnage, byWeight, compared, skipped };
  });
  const below = parts.filter(p => p.belowGoal).sort((x, y) => y.gap - x.gap); /* sort stabilny: remis zostaje w kolejności MUSCLES */
  return { weekStart: start, current, deload, hasPlan: current && hasPlan(dayKeyOf(now)), comparedStart, adjacent, hasPrev, parts, below, less: parts.filter(p => p.dir === 'down') };
}

/** Pamięć podręczna do następnej zmiany stanu (store.getRev) i dnia — ekran Trening wywołuje to przy każdym odświeżeniu (jak compareCached, PERF-04). */
const memo = new Map<number, { key: string; st: object; v: Guard }>();
export function guardCached(now = Date.now(), offset = 0): Guard {
  const key = `${getRev()}|${dayKeyOf(now)}`; const st = getState(); const m = memo.get(offset); if (m && m.key === key && m.st === st) return m.v;
  const v = progressGuard(now, offset); memo.set(offset, { key, st, v }); return v;
}

const n1 = (v: number) => fmtNum(v, 1);
const ORDER: GuardDir[] = ['up', 'same', 'down', 'unknown', 'new'];
const WORD: Record<'up' | 'same' | 'down' | 'unknown' | 'new' | 'none', () => string> = { up: () => t('więcej'), same: () => t('tyle samo'), down: () => t('mniej'), unknown: () => t('bez porównania'), new: () => t('nowe'), none: () => t('bez serii') };
/** Słowo stanu w języku interfejsu (legenda, wiersze, etykiety). */
export const guardWord = (d: Exclude<GuardDir, 'deload'>): string => WORD[d]();
/** Teksty strażnika: zdania ekranu Trening (najwyżej dwa + informacja o deloadzie/tygodniu porównawczym) i etykieta obrazu dla VoiceOver. */
export function guardTexts(g: Guard): { deload: string | null; compared: string | null; short: string | null; less: string | null; label: string } {
  const compared = !g.deload && !g.adjacent && g.hasPrev && g.comparedStart != null ? t('Wobec tygodnia {d} (poprzedni był deloadem)', { d: fmtDayMonth(g.comparedStart) }) : null;
  const deload = g.deload ? t('Tydzień deloadu — bez porównania') : null;
  let short: string | null = null;
  if (!g.deload && g.parts.some(p => p.total > 0)) {
    if (g.below.length) {
      const items = g.below.map(p => `${t(p.part)} (${n1(p.total)}/${n1(p.goal)})`); const list = items.length > 3 ? `${items.slice(0, 2).join(', ')} ${t('i jeszcze {n}', { n: items.length - 2 })}` : items.join(', ');
      short = g.hasPlan ? t('Poniżej celu nawet z planem: {list}.', { list }) : t('Poniżej celu (bez planu tygodnia): {list}.', { list });
    } else short = g.hasPlan ? t('Z planem wszystkie trenowane partie dojdą do celu.') : t('Wszystkie trenowane partie są na celu (bez planu tygodnia).');
  }
  const names = g.less.map(p => t(p.part)).join(', ');
  const less = !g.deload && g.less.length ? (g.adjacent || g.comparedStart == null ? t('Mniej niż przed tygodniem: {list}.', { list: names }) : t('Mniej niż w tygodniu {d}: {list}.', { d: fmtDayMonth(g.comparedStart), list: names })) : null;
  const groups = ORDER.map(d => [d, g.parts.filter(p => p.dir === d)] as const).filter(([, l]) => l.length);
  const label = g.deload ? t('Tydzień deloadu — bez porównania')
    : `${t('Ten tydzień wobec poprzedniego: {list}.', { list: groups.map(([d, l]) => `${WORD[d as keyof typeof WORD]()} — ${l.map(p => t(p.part)).join(', ')}`).join('; ') })}${compared ? ` ${compared}.` : ''}`;
  return { deload, compared, short, less, label };
}
