import { getState, finishedWorkouts, templateGroups, exById } from '@/lib/store';
import { hasPlan, dayKeyOf, dayStatus, pending, upcoming, planName, weekPlanDays } from '@/lib/plan';
import type { Template } from '@/lib/seed';

/*
 * Ekran główny — układ B „najpierw trening” (decyzja właściciela 09.10.2026 ok. 15:20, doprecyzowanie ok. 15:30; docs/18).
 * Jeden duży przycisk startu zależny od sytuacji i arkusz „Inny trening”. Tu tylko wybór (czysta logika na stanie); ekran — components/StartPanel.tsx.
 * Start zawsze przez istniejące funkcje (lib/start.ts startTemplate / startRepeatLast, store.startEmpty) — to samo pytanie deload i ten sam strażnik.
 */

/** W ilu dniach szukać następnego treningu z planu (jak „Następne” na karcie „Dziś”). */
export const NEXT_PLAN_DAYS = 14;

/** Szablony, od których da się zacząć (niezarchiwizowane, z ćwiczeniami) — w kolejności listy na ekranie (foldery, store.templateGroups). */
export const startableTemplates = (): Template[] => templateGroups().flatMap(g => g.items).filter(x => !x.archived && x.items.length > 0);

export type MainStart =
  /** trening w toku (ekran Trening pokazuje wtedy sam trening — wariant dla kompletności i innych miejsc) */
  | { kind: 'resume' }
  /** plan: dziś zaplanowany trening, jeszcze nie zrobiony */
  | { kind: 'plan'; tpl: Template }
  /** plan bez treningu na dziś: najbliższy zaplanowany (data) */
  | { kind: 'planNext'; tpl: Template; date: string }
  /** bez planu: następny szablon po ostatnio zrobionym (`after` — nazwa tamtego), albo pierwszy z listy */
  | { kind: 'next'; tpl: Template; after?: string }
  /** brak szablonów do startu */
  | { kind: 'empty' };

/**
 * Reguła dużego przycisku (rozstrzygnięcie agenta, opisane w raporcie):
 *  1. trening w toku → „Wróć do treningu”;
 *  2. plan i dziś czeka zaplanowany trening z ćwiczeniami → „Start: <dzisiejszy>”;
 *  3. plan, ale dziś nic (wolne, zrobione) → najbliższy zaplanowany (14 dni);
 *  4. bez planu (albo plan bez startowalnych dni) → następny szablon po ostatnio zrobionym, w kolejności listy i w kółko (A → B → C → A) —
 *     rotacja, jaką ma zwykle kilka szablonów; ostatni trening bez szablonu albo z usuniętego — pierwszy szablon listy;
 *  5. brak szablonów z ćwiczeniami → „Pusty trening”.
 */
export function mainStart(now = Date.now()): MainStart {
  if (getState().active) return { kind: 'resume' };
  const list = startableTemplates(); const byId = (id: string | null | undefined) => (id ? list.find(x => x.id === id) : undefined);
  const today = dayKeyOf(now);
  if (hasPlan(today)) {
    const ds = dayStatus(today, today); const tpl = pending(ds) ? byId(ds.templateId) : undefined;
    if (tpl) return { kind: 'plan', tpl };
    const nx = upcoming(NEXT_PLAN_DAYS, today).find(x => x.date > today && byId(x.templateId));
    if (nx) return { kind: 'planNext', tpl: byId(nx.templateId)!, date: nx.date };
  }
  if (!list.length) return { kind: 'empty' };
  const lastIdx = (() => { for (const w of finishedWorkouts()) { const i = list.findIndex(x => x.id === w.templateId); if (i >= 0) return i; } return -1; })();
  if (lastIdx < 0) return { kind: 'next', tpl: list[0] };
  return { kind: 'next', tpl: list[(lastIdx + 1) % list.length], after: list[lastIdx].name };
}

export type OtherStart =
  | { kind: 'planOther'; tpl: Template; date: string }
  | { kind: 'repeat'; name: string; date: number }
  | { kind: 'template'; count: number }
  | { kind: 'empty' };
/**
 * Arkusz „Inny trening” — kolejność z makiety (właściciel 09.10.2026): „Inny z planu” (jest plan i inny zaplanowany trening niż na dużym przycisku),
 * „Powtórz ostatni” (ostatni trening ma ćwiczenie z biblioteki, którego nie zarchiwizowano — runda 42), „Z szablonu” (są szablony), „Pusty trening”
 * (gdy nie jest już dużym przyciskiem).
 */
export function otherStarts(main: MainStart = mainStart(), now = Date.now()): OtherStart[] {
  const out: OtherStart[] = []; const today = dayKeyOf(now); const list = startableTemplates();
  const mainId = main.kind === 'plan' || main.kind === 'planNext' || main.kind === 'next' ? main.tpl.id : null;
  if (hasPlan(today)) {
    const nx = upcoming(NEXT_PLAN_DAYS, today).find(x => x.date >= today && x.templateId && x.templateId !== mainId && list.some(t => t.id === x.templateId) && (x.date > today || pending(dayStatus(today, today))));
    if (nx) out.push({ kind: 'planOther', tpl: list.find(t => t.id === nx.templateId)!, date: nx.date });
  }
  const last = finishedWorkouts()[0];
  if (last && last.exercises.some(e => { const x = exById(e.exerciseId); return x && !x.archived; })) out.push({ kind: 'repeat', name: last.templateName, date: last.startedAt });
  if (list.length) out.push({ kind: 'template', count: list.length });
  if (main.kind !== 'empty') out.push({ kind: 'empty' });
  return out;
}

/** Karta Planowania zwinięta do wiersza przy planie: nazwa, liczba dni z treningiem w tygodniu planu, najbliższy trening (po dziś). */
export function planSummary(now = Date.now()): { name: string; days: number; next: { date: string; templateId: string } | null } | null {
  const today = dayKeyOf(now); if (!hasPlan(today)) return null;
  const days = weekPlanDays().filter(Boolean).length;
  const nx = upcoming(NEXT_PLAN_DAYS, today).find(x => x.date > today && x.templateId);
  return { name: planName(), days, next: nx ? { date: nx.date, templateId: nx.templateId! } : null };
}
