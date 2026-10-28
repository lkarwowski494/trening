/*
 * Figury v2 — opis sceny: rekwizyty (sprzęt) w świecie 3D, kształty 2D po rzucie, kolidery do testów geometrii.
 * Role kolorów są nazwami, nie kolorami: kolory z motywu dobiera palette.ts (tokeny lib/tokens przez lib/theme).
 */
import type { V2, V3 } from './math';
import type { PoseIn, Skeleton } from './skeleton';

/** side = z boku (kamera po prawej stronie osoby), front = z przodu, top = z góry (głowa u góry rysunku; dla ćwiczeń w leżeniu). */
export type View = 'side' | 'front' | 'top';
export type Role = 'floor' | 'frame' | 'pad' | 'steel' | 'plate' | 'load' | 'skin' | 'skinFar' | 'skinHi' | 'cloth' | 'clothFar' | 'clothHi' | 'error' | 'shoe' | 'hair' | 'guide' | 'cable' | 'muscleMain' | 'muscleAux' | 'contactOk' | 'contactBad';

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
  | { k: 'barbell'; c: V3; plates?: boolean; len?: number; held?: boolean | 'R' | 'L'; id?: string }                        /* sztanga: środek gryfu */
  | { k: 'trapbar'; c: V3; w?: number }                                                                    /* gryf sześciokątny: środek (uchwyty wzdłuż z) */
  | { k: 'dumbbell'; c: V3; side: 'R' | 'L'; vertical?: boolean; r?: number; held?: boolean }                  /* hantel: środek chwytu */
  | { k: 'kettlebell'; c: V3; side?: 'R' | 'L' | 'C'; r?: number; held?: boolean; bell?: 'down' | 'along' | 'back'; dir?: V3; dnemDoGory?: boolean } /* kettlebell: środek rączki; dir = wersor od rączki do środka dzwonu (domyślnie w dół; bell: tryb wyznaczany ze szkieletu; dnemDoGory: przy bell „along” dzwon obraca się dnem do góry, gdy przedramię jest blisko pionu) */
  | { k: 'plate'; c: V3; r?: number; held?: boolean | 'R' | 'L' }                                           /* talerz trzymany: tarcza w płaszczyźnie y–z (powierzchnią do przodu), środek */
  | { k: 'ball'; c: V3; r?: number; held?: boolean | 'R' | 'L' }                                            /* kula, środek; domyślnie trzymana (piłka lekarska); held: false = leży na podłodze (piłka gimnastyczna) */
  | { k: 'roll'; c: V3; r: number; len: number; held?: boolean }                                                         /* wałek (roller piankowy): walec wzdłuż z, środek */
  | { k: 'bench'; seatFrom: V2; hinge: V2; backTo: V2; legH: number; w?: number; rollers?: boolean; backFrame?: boolean }              /* ławka: siedzisko od-do, zawias, koniec oparcia */
  | { k: 'preacher'; top: V2; bottom: V2; seat: V2 }                                                      /* modlitewnik: pochyła podpórka na ramiona (górny koniec przy osobie, dolny dalej) i małe siedzisko (środek) */
  | { k: 'sled'; x: number; h: number; len: number; posts: boolean }                                    /* sanie obciążeniowe: słupki uchwytów w x (wysokość h, z = ±EQUIP.sledHalf), podstawa od x o len w stronę +x; posts = dłonie na słupkach */
  | { k: 'rope'; x: number; z: number; top: number; bottom: number; held?: boolean | 'R' | 'L' }      /* lina pionowa (do wspinania): od bottom do top w (x, z) */
  | { k: 'dipbars'; x0: number; x1: number; h: number; z: number; held?: boolean }                   /* poręcze do dipów: dwie poziome rury na wysokości h w z = ±z, od x0 do x1 */
  | { k: 'slider'; c: V3; r: number }                                                                      /* ślizgacz: płaski krążek pod stopą albo dłonią na podłodze (środek, promień) */
  | { k: 'wheel'; c: V3; r: number }                                                                       /* kółko do brzucha: koło toczące się po podłodze (oś w c, promień r) */
  | { k: 'dome'; c: V3; r: number }                                                                       /* półkula na podłodze (platforma balansowa): środek na podłodze, promień */
  | { k: 'hyper'; pad: V2; kat: number; len: number; roller?: V2 }                                       /* ławka do prostowania tułowia: podpórka bioder (środek, kąt, długość) i wałki na kostki (środek) */
  | { k: 'hammer'; a: V3; b: V3 }                                                                        /* młot: trzonek od a (końcówka) do b (głowica) */
  | { k: 'neckload'; len: number; r: number }                                                            /* uprząż na szyję: łańcuch i talerz wiszące pod głową (rozwiązywane ze szkieletu) */
  | { k: 'box'; x0: number; x1: number; top: number; w?: number; z?: number }                  /* skrzynia; z = środek skrzyni na osi z (domyślnie 0) */
  | { k: 'wall'; x: number; h: number; front?: boolean }                                      /* ściana: lita po stronie −x od powierzchni x (za osobą); front: lita po stronie +x (przed osobą; w widoku z przodu przekrój) */
  | { k: 'rail'; x: number; h: number }                                                        /* prowadnica suwnicy Smitha (pionowa) */
  | { k: 'post'; x: number; h: number; hook?: number }                                         /* słupek stojaka */
  | { k: 'cable'; from: V3; to: V3; attach?: 'handle' | 'rope' | 'bar' | 'strap'; ends?: V3[]; solid?: boolean; free?: number } /* linka od bloczku (from) do osprzętu (to); ends = miejsca chwytu (dłonie albo kostka); solid = kolider tylko dla danych kontraktu; free = długość odcinka przy osprzęcie bez kolidera (domyślnie EQUIP.cableEnd; taśmy zawieszenia: wzdłuż przedramienia) */
  | { k: 'tower'; x: number; z: number; h: number; solid?: boolean }                                    /* kolumna stacji wyciągów (bloczek na linii x, z) */
  | { k: 'slide'; from: V3; to: V3; dir: V3; len: number }                                                /* prowadnica liniowa maszyny: odcinek skoku od from w kierunku dir (długość len), to = punkt mocowania (platforma, wałek, uchwyt) na prowadnicy */
  | { k: 'band'; from: V3; to: V3 }
  | { k: 'chain'; from: V3; to: V3; /** łańcuch sztangi (wisi na obu tulejach); bez tego pola — pojedynczy łańcuch (np. pas z obciążeniem) */ bar?: true }
  | { k: 'floor'; x0: number; x1: number }
  | { k: 'mat'; x0: number; x1: number; h: number }
  | { k: 'pivot'; from: V3; to: V3; len?: number; label?: string; cut?: number }                                                /* gryf landmine albo dźwignia maszyny: z osi obrotu do dłoni/kostek; len = długość ramienia (sztywne); label = nazwa w komunikatach */

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
  /** Wejście pozy, z którego liczony jest szkielet (kontrakt danych rodziny: przykłady z gotowych rodzin). */
  pose?: PoseIn;
};
