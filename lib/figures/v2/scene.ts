/*
 * Figury v2 — opis sceny: rekwizyty (sprzęt) w świecie 3D, kształty 2D po rzucie, kolidery do testów geometrii.
 * Role kolorów są nazwami, nie kolorami: kolory z motywu dobiera palette.ts (tokeny lib/tokens przez lib/theme).
 */
import type { V2, V3 } from './math';
import type { Skeleton } from './skeleton';

/** side = z boku (kamera po prawej stronie osoby), front = z przodu, top = z góry (głowa u góry rysunku; dla ćwiczeń w leżeniu). */
export type View = 'side' | 'front' | 'top';
export type Role = 'floor' | 'frame' | 'pad' | 'steel' | 'plate' | 'load' | 'skin' | 'skinFar' | 'skinHi' | 'cloth' | 'clothFar' | 'clothHi' | 'error' | 'shoe' | 'hair' | 'guide' | 'cable' | 'muscleMain' | 'muscleAux';

/** Kształt 2D po rzucie (współrzędne rysunku: x w prawo, y w górę, cm). `z` = kolejność rysowania (mniejsze pierwsze). */
export type Shape =
  | { k: 'poly'; pts: V2[]; fill?: Role; stroke?: Role; w?: number; a?: number; close?: boolean; smooth?: boolean; z: number; id?: string }
  | { k: 'circle'; c: V2; r: number; fill?: Role; stroke?: Role; w?: number; a?: number; z: number; id?: string }
  | { k: 'ellipse'; c: V2; rx: number; ry: number; rot: number; fill?: Role; stroke?: Role; w?: number; a?: number; z: number; id?: string }
  | { k: 'line'; a: V2; b: V2; w: number; role: Role; dash?: [number, number]; alpha?: number; z: number; id?: string };

/** Warstwy rysowania (z = warstwa × 1000 + głębokość). */
export const LAYER = { back: -2, backEquip: -1, body: 0, frontEquip: 1, overlay: 2 } as const;

/** Rekwizyty w świecie 3D. Gryf leży wzdłuż osi z (prostopadle do płaszczyzny strzałkowej). */
export type Prop =
  | { k: 'barbell'; c: V3; plates?: boolean; len?: number; held?: boolean | 'R'; id?: string }                        /* sztanga: środek gryfu */
  | { k: 'trapbar'; c: V3; w?: number }                                                                    /* gryf sześciokątny: środek (uchwyty wzdłuż z) */
  | { k: 'dumbbell'; c: V3; side: 'R' | 'L'; vertical?: boolean; r?: number; held?: boolean }                  /* hantel: środek chwytu */
  | { k: 'kettlebell'; c: V3; side?: 'R' | 'L' | 'C'; r?: number; held?: boolean }                             /* kettlebell: środek rączki */
  | { k: 'bench'; seatFrom: V2; hinge: V2; backTo: V2; legH: number; w?: number }              /* ławka: siedzisko od-do, zawias, koniec oparcia */
  | { k: 'box'; x0: number; x1: number; top: number; w?: number }
  | { k: 'wall'; x: number; h: number }
  | { k: 'rail'; x: number; h: number }                                                        /* prowadnica suwnicy Smitha (pionowa) */
  | { k: 'post'; x: number; h: number; hook?: number }                                         /* słupek stojaka */
  | { k: 'cable'; from: V3; to: V3 }
  | { k: 'band'; from: V3; to: V3 }
  | { k: 'chain'; from: V3; to: V3 }
  | { k: 'floor'; x0: number; x1: number }
  | { k: 'mat'; x0: number; x1: number; h: number }
  | { k: 'pivot'; from: V3; to: V3 };                                                          /* gryf landmine: z podłogi do dłoni */

/** Kolider do testów: kapsuła (ciało, gryf) albo graniastosłup (ławka, skrzynia, ściana: wielokąt w xy wyciągnięty po z). */
export type Collider =
  | { k: 'capsule'; id: string; a: V3; b: V3; r: number }
  | { k: 'prism'; id: string; poly: V2[]; z0: number; z1: number };

/** Dozwolony kontakt ciało–sprzęt: odległość powierzchni w przedziale [−tol, +tol] (gryf na plecach, pośladki na ławce), poza tym brak przenikania. */
export type Contact = { body: string; equip: string; tol: number };

export type Frame = {
  sk: Skeleton;
  props: Prop[];
  /** Punkty znaczące do testów i do znacznika toru ruchu (np. środek gryfu). */
  info: Record<string, V3>;
  contacts: Contact[];
};
