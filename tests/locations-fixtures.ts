import { equipEntry, LOAD_PRESETS } from '@/lib/equipment';
import type { Location, LocEquip } from '@/lib/seed';
import type { LoadSpec } from '@/lib/loads';

/** Miejsce do testów (bez store). */
export const loc = (name: string, equipment: LocEquip[], id = 'loc-' + name): Location => ({ id, ownerId: 'local', createdAt: 1, updatedAt: 1, name, equipment });
export const presetSpec = (id: string): LoadSpec => LOAD_PRESETS.find(p => p.id === id)!.spec();

/**
 * Dom użytkownika (docs/10, decyzja 9 i sekcja 3.4): ławka regulowana, drążek, poręcze do dipów, 2 × TREXO TXO-B4W002 24 kg
 * (hantle z szybką regulacją pokrętłem) i ViShape SmartGym Pro (1,5–65 kg na stronę, krok 0,5 kg; dwie linki od dołu, pas, opaski).
 * UWAGA: dokładne kroki TREXO są NIEZNANE (do odczytania z pokrętła). `trexo` to lista podana przez test — nie specyfikacja produktu.
 */
export function userHome(trexo: number[] = []): Location {
  const db = equipEntry('db_fixed'); db.load = { kind: 'list', unit: 'kg', items: trexo.map(w => ({ w, on: true })) };
  const vs = equipEntry('electric'); vs.load = presetSpec('vishape_pro');
  return loc('Dom', [equipEntry('bench_adj'), equipEntry('pullup_bar'), equipEntry('dip_bars'), db, vs], 'home');
}
