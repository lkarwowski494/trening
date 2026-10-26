/*
 * Figury v2 — SPRZĘT W KONTRAKCIE DANYCH (docs/50 rozdz. 10, docs/53): rejestr rodzajów sprzętu, które generator może wpisać w `sprzet[]` pozy.
 * Każdy rodzaj to parametryczny prymityw: pola, rekwizyt(y) sceny (rysunek i kolidery w draw.ts/colliders.ts), możliwości katalogu ćwiczeń (`caps`), które pokrywa,
 * i sprawdzenia pól. Wymiary w EQUIP (draw.ts) są „konwencją rysunku” (źródła i status: data/zrodla/figury-sprzet.json). Czysty moduł (bez React).
 */
import type { V3 } from './math';
import type { Side } from './skeleton';
import type { Prop } from './scene';

export const GEAR = ['sztanga', 'slupek', 'podloga', 'skrzynia'] as const;
export type GearName = typeof GEAR[number];
export type Gear = { rodzaj: GearName; x?: number; y?: number; h?: number; x0?: number; x1?: number; top?: number; talerze?: boolean; podazaZaChwytem?: boolean; trzyma?: 'obie' | 'R' | 'L'; dlugosc?: number };

export type GearGrips = Record<Side, V3>;
export type GearKind = {
  /** Możliwości katalogu ćwiczeń (lib/catalog.generated.ts → requires), które ten rodzaj pozwala narysować. */
  caps: readonly string[];
  /** Krótki opis do generatora poleceń (jak wypełnić pola). */
  opis: string;
  /** Rekwizyty sceny dla wpisu sprzętu (chwyty rąk potrzebne sprzętowi trzymanemu w dłoni). */
  props: (g: Gear, grips: GearGrips) => Prop[];
};

const BAR_LEN = 220;
export const GEAR_KINDS: Record<GearName, GearKind> = {
  sztanga: {
    caps: ['pullup.bar', 'rings', 'barbell'], opis: 'sztanga albo drążek poziomy (x, y, dlugosc, talerze, podazaZaChwytem, trzyma)',
    props: (g, grips) => { const c: V3 = g.podazaZaChwytem ? [(grips.R[0] + grips.L[0]) / 2, (grips.R[1] + grips.L[1]) / 2, 0] : [g.x ?? 0, g.y ?? 0, 0]; return [{ k: 'barbell', c, plates: g.talerze !== false, held: g.trzyma === 'R' || g.trzyma === 'L' ? g.trzyma : true, len: g.dlugosc ?? BAR_LEN }]; },
  },
  slupek: { caps: [], opis: 'słupek pionowy (x, h)', props: g => [{ k: 'post', x: g.x ?? 0, h: g.h ?? 200 }] },
  podloga: { caps: [], opis: 'podłoga (x0, x1)', props: g => [{ k: 'floor', x0: g.x0 ?? -120, x1: g.x1 ?? 120 }] },
  skrzynia: { caps: ['box', 'bench.flat'], opis: 'skrzynia, stopień albo ławka płaska (x0, x1, top)', props: g => [{ k: 'box', x0: g.x0 ?? 0, x1: g.x1 ?? 40, top: g.top ?? 40 }] },
};

/** Możliwości katalogu pokryte przez rejestr (wszystkie rodzaje). */
export const GEAR_CAPS: readonly string[] = Object.values(GEAR_KINDS).flatMap(k => k.caps);

/** Sprzęt jako rekwizyty sceny; sprzęt „podążający za chwytem” leży między dłońmi albo w dłoni. */
export function propsFrom(gear: Gear[], grips: GearGrips): Prop[] { return gear.flatMap(g => GEAR_KINDS[g.rodzaj].props(g, grips)); }
