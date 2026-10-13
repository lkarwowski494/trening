import type { AdaptChoice } from './adapt';

/*
 * 0.18 (docs/33 pkt 4): arkusz zamiany `swap.tsx` z celem `adapt:<id bloku>` NIE zapisuje — zwraca wybór oknu „Dostosuj do miejsca” (app/adapt.tsx),
 * które jest pod nim na stosie. Kanał jest prostym nasłuchem w pamięci: wybór żyje tylko do zamknięcia okna (restart z otwartym oknem = nic nie zastosowano).
 */
export interface AdaptPick { blockId: string; /** null = „Bez zmian” */ choice: AdaptChoice | null }
const listeners = new Set<(p: AdaptPick) => void>();
/** Okno „Dostosuj” nasłuchuje wyborów z arkusza zamiany; zwraca funkcję odpinającą. */
export function onAdaptPick(f: (p: AdaptPick) => void): () => void { listeners.add(f); return () => { listeners.delete(f); }; }
/** Arkusz zamiany oddaje wybór oknu „Dostosuj”. */
export function emitAdaptPick(p: AdaptPick): void { listeners.forEach(f => f(p)); }

/*
 * 0.19 (docs/33 B, P4 A): trening rozpoczęty w dniu z miejscem zapisanym w planie — okno „Dostosuj” otwiera się samo po starcie (ActiveWorkout), ale tylko raz
 * dla tego treningu i tylko gdy są propozycje. Znacznik w pamięci (nie w danych): po restarcie zostaje wiersz „N ćwiczeń bez sprzętu · Dostosuj” pod chipem.
 */
const autoOpen = new Set<string>();
/** Start w dniu z miejscem z planu: zapamiętaj trening (id), któremu okno ma się otworzyć samo. */
export function armAutoAdapt(workoutId: string): void { autoOpen.clear(); autoOpen.add(workoutId); }
/** Ekran treningu: czy okno ma się otworzyć samo dla tego treningu (zużywa znacznik — raz). */
export function takeAutoAdapt(workoutId: string): boolean { return autoOpen.delete(workoutId); }
