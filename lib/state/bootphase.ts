/*
 * Diagnostyka ostatniego startu (ZK-07, TestFlight 1030): mały klucz kv „bootphase” z etapem, do którego doszedł start — begin (baza otwarta, licznik zapisany),
 * loaded (dane wczytane, init skończony), stable (pierwszy ekran dotrwał do „kamienia”). Gdy kolejny start trafia w tryb awaryjny, ekran pokazuje etap poprzedniego
 * (technicznie, bez tłumaczenia): brak etapu „loaded” = awaria w init(), „loaded” bez „stable” = awaria albo zamknięcie po wczytaniu danych, przy rysowaniu pierwszego ekranu
 * lub w zadaniach po starcie. Bez danych osobowych: tylko etap, czas od początku startu (ms), tryb, licznik, wersja schematu i to, czy w bazie były dane.
 * Zależy od: ./crashguard (typ trybu).
 */
import type { BootMode } from './crashguard';

export const BOOT_PHASE_KEY = 'bootphase';
export type BootPhaseName = 'begin' | 'loaded' | 'stable';
export interface BootPhase { phase: BootPhaseName; ms: number; mode: BootMode; starts: number; hadData: boolean; schema: number }

const PHASES: readonly BootPhaseName[] = ['begin', 'loaded', 'stable'];
/** Zapis z bazy -> etap; brak, nie-JSON i złe wartości dają null (diagnostyka jest pomocnicza, nigdy nie blokuje startu). */
export function parseBootPhase(raw: string | null | undefined): BootPhase | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as Partial<BootPhase> | null;
    if (!o || typeof o !== 'object' || !PHASES.includes(o.phase as BootPhaseName)) return null;
    const n = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0);
    return { phase: o.phase as BootPhaseName, ms: n(o.ms), mode: o.mode === 'safe' ? 'safe' : 'normal', starts: n(o.starts), hadData: o.hadData === true, schema: n(o.schema) };
  } catch { return null; }
}
/** Jedna linia do ekranu awaryjnego i do zgłoszenia (np. „ostatni start: loaded po 840 ms, schemat 19”); bez tłumaczenia — kod diagnostyczny. */
export function describeBootPhase(p: BootPhase | null): string {
  return p ? `start: ${p.phase}, ${p.ms} ms, ${p.hadData ? 'data' : 'empty'}, schema ${p.schema}, n=${p.starts}` : 'start: -';
}
