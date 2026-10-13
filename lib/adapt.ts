import { getState, exById, locationById, canUndoSwap } from './store';
import { availability } from './equipment';
import { swapCandidates, type SwapCandidate } from './swap';
import type { Impl, Workout, WExercise } from './seed';

/*
 * 0.18 „Dostosuj do miejsca” (docs/33, decyzje właściciela 13.10.2026 P0–P7) — czysta logika nad stanem, bez zapisu i bez ekranów:
 * które bloki treningu trzeba dostosować do miejsca, co domyślnie zaproponować i które bloki mogą wrócić do ćwiczenia z planu.
 * Zapis robi `adaptActive` (lib/state/swap.ts); wynik tych funkcji tylko opisuje propozycje do przejrzenia (P2 A, P4 A: nigdy automatyczna zamiana).
 * Słownik: „ćwiczenie z planu” = `swappedFrom ?? exerciseId`; ranking i przywracanie zawsze od niego.
 */

/** Wybór użytkownika dla jednego bloku — wejście `adaptActive`. Blok bez wyboru zostaje bez zmian. */
export type AdaptChoice =
  /** zamiana ćwiczenia (swapBlock); `restSec`/`impl` — z zamiennika per miejsce (W3) */
  | { kind: 'swap'; blockId: string; toExId: string; restSec?: number | null; impl?: Impl }
  /** „ten sam ruch, inny przyrząd” (swapImpl) */
  | { kind: 'impl'; blockId: string; impl: Impl }
  /** „Pomiń dziś” (skipExercise) */
  | { kind: 'skip'; blockId: string }
  /** powrót do ćwiczenia z planu (undoSwap) */
  | { kind: 'restore'; blockId: string };
/** Rodzaje wyboru (wymiar macierzy testów). */
export const ADAPT_KINDS = ['swap', 'impl', 'skip', 'restore'] as const;

/** Skąd pochodzi domyślna propozycja wiersza. */
export type AdaptSource = 'alternate' | 'ranking' | 'none';
/** Wiersz okna „Dostosuj do: X” — blok do dostosowania. */
export interface AdaptRow {
  blockId: string;
  /** ćwiczenie z planu: swappedFrom ?? exerciseId */
  planExId: string;
  /** ćwiczenie bloku teraz (niedostępne w miejscu) */
  curExId: string;
  /** czego brakuje w miejscu (grupy możliwości — jak Availability.missing) */
  missing: string[][];
  source: AdaptSource;
  /** domyślny wybór; null = „Bez zmian” (brak zamiennika) */
  choice: AdaptChoice | null;
  /** wpis rankingu (dla linijki „dlaczego” — reasonText); tylko source = 'ranking' */
  candidate?: SwapCandidate;
  /** P3 A: pierwsza propozycja była zajęta przez wcześniejszy blok — wiersz dostał następną z rankingu (dopisek przy wierszu) */
  shifted: boolean;
  /** rankingu zabrakło na „następną” — wiersz powtarza propozycję innego bloku (dopisek; użytkownik może zmienić) */
  duplicate: boolean;
}
/** Wiersz sekcji „Wraca z planu” — blok-zamiennik, którego ćwiczenie z planu jest znów dostępne. */
export interface RestoreRow {
  blockId: string;
  /** ćwiczenie bloku teraz */
  curExId: string;
  /** ćwiczenie z planu, do którego blok wraca */
  planExId: string;
  /** domyślnie zaznaczone (P5 A) */
  choice: Extract<AdaptChoice, { kind: 'restore' }>;
  /** w seriach zamiennika są wpisane wartości — cofnięcie ich zgubi (potwierdzenie C7 jak w „Cofnij zamianę”) */
  edited: boolean;
}

/** Blok bierze udział w dostosowaniu: nie pominięty, ma nieodhaczoną serię. */
const open = (e: WExercise) => !e.skipped && e.sets.some(x => !x.done);
const planOf = (e: WExercise) => e.swappedFrom ?? e.exerciseId;

/** Bloki do PRZYWRÓCENIA: mają `swappedFrom`, ćwiczenie z planu jest dostępne w miejscu, brak odhaczonych serii i `canUndoSwap` (P5 A, spec „Słownik”).
 * Kolejność treningu. Bez miejsca / nieznane miejsce — pusto. */
export function restoreCandidates(w: Workout, locationId: string | null | undefined): RestoreRow[] {
  const loc = locationById(locationId); if (!loc) return [];
  const out: RestoreRow[] = [];
  for (const e of w.exercises) {
    if (!e.swappedFrom || e.skipped || !e.sets.length || !canUndoSwap(e)) continue;
    const plan = exById(e.swappedFrom); if (!plan || plan.archived || !availability(plan, loc).ok) continue;
    out.push({ blockId: e.id, curExId: e.exerciseId, planExId: plan.id, choice: { kind: 'restore', blockId: e.id }, edited: e.sets.some(x => x.edited) });
  }
  return out;
}

/** Zamiennik per miejsce (W3) z pozycji szablonu bloku: istnieje wpis dla miejsca, ćwiczenie widoczne i dostępne tutaj, inne niż bieżące. */
function alternateFor(w: Workout, e: WExercise, locationId: string): AdaptChoice | null {
  const loc = locationById(locationId); const tpl = w.templateId ? getState().templates.find(x => x.id === w.templateId) : undefined;
  const item = tpl && e.tplItemId ? tpl.items.find(x => x.id === e.tplItemId) : undefined; if (!loc || !item || item.exerciseId !== planOf(e)) return null;
  const alt = item.alternates?.find(x => x.locationId === locationId); const B = alt ? exById(alt.exerciseId) : undefined;
  if (!alt || !B || B.archived || B.id === e.exerciseId || !availability(B, loc).ok) return null;
  return { kind: 'swap', blockId: e.id, toExId: B.id, restSec: alt.restSec, ...(alt.impl ? { impl: alt.impl } : {}) };
}

/**
 * Bloki do DOSTOSOWANIA do miejsca `locationId` (spec „Słownik”): ćwiczenie bloku niedostępne w miejscu, ≥1 nieodhaczona seria, blok nie pominięty,
 * ćwiczenie nie jest usunięte („Usunięte ćwiczenie”), a blok nie jest do przywrócenia (wtedy trafia do restoreCandidates). Kolejność treningu.
 * Domyślny wybór wiersza: (a) zamiennik per miejsce z szablonu (W3 alternates); (b) pierwsza propozycja swapCandidates od ćwiczenia z planu
 * (showAll false) z regułą P3 A — propozycja zajęta przez wcześniejszy blok ustępuje następnej z rankingu; (c) brak — „Bez zmian” (choice = null).
 * Zamienniki z szablonu zajmują ćwiczenie przed rankingiem (właściciel ustawił je jawnie), ranking rozdziela się w kolejności treningu.
 * Nic nie zapisuje; stan nie jest zmieniany.
 */
export function adaptCandidates(w: Workout, locationId: string | null | undefined): AdaptRow[] {
  const loc = locationById(locationId); if (!loc || !locationId) return [];
  const restoring = new Set(restoreCandidates(w, locationId).map(r => r.blockId));
  const inWorkout = new Set(w.exercises.map(e => e.exerciseId));
  const rows: AdaptRow[] = [];
  for (const e of w.exercises) {
    const cur = exById(e.exerciseId); if (!cur || cur.archived || !open(e) || restoring.has(e.id)) continue;
    const a = availability(cur, loc); if (a.ok) continue;
    rows.push({ blockId: e.id, planExId: planOf(e), curExId: e.exerciseId, missing: a.missing, source: 'none', choice: null, shifted: false, duplicate: false });
  }
  const claimed = new Set<string>();
  for (const r of rows) { /* (a) zamiennik per miejsce */
    const c = alternateFor(w, w.exercises.find(x => x.id === r.blockId)!, locationId);
    if (c && c.kind === 'swap') { r.source = 'alternate'; r.choice = c; claimed.add(c.toExId); }
  }
  for (const r of rows) { /* (b) ranking od ćwiczenia z planu, P3 A */
    if (r.choice) continue;
    const plan = exById(r.planExId); const base = plan && !plan.archived ? plan.id : r.curExId; /* plan usunięty — ranking od bieżącego ćwiczenia */
    const list = swapCandidates(base, { locationId, showAll: false, inWorkout }).filter(c => c.exId !== r.curExId);
    if (!list.length) continue;
    const i = list.findIndex(c => !claimed.has(c.exId)); const pick = list[i < 0 ? 0 : i];
    r.source = 'ranking'; r.candidate = pick; r.shifted = i > 0; r.duplicate = i < 0;
    r.choice = { kind: 'swap', blockId: r.blockId, toExId: pick.exId }; claimed.add(pick.exId);
  }
  return rows;
}
