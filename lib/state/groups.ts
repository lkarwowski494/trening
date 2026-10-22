/*
 * Supersety i kolejność pozycji (trening i szablon): porządkowanie grup, etykiety A/B/C, łączenie, rozłączanie, przesuwanie bloków.
 * Zależy od: ./core; zewnętrzne: ../seed.
 */
import { uid, type Base } from '../seed';
import { save } from './core';
import { t } from '../i18n';

/* ---------- supersety (0.4) ---------- */
export type Grouped = { groupId: string | null };
/**
 * Porządkuje grupy po każdej zmianie listy: grupa musi być ciągła i mieć ≥2 elementy.
 * Rozerwana grupa dzieli się na ciągłe odcinki (każdy z nowym id), pojedyncze elementy wychodzą z grupy.
 */
export function normalizeGroups(list: Grouped[]) {
  let i = 0;
  while (i < list.length) {
    const g = list[i].groupId; if (!g) { i++; continue; }
    let j = i; while (j + 1 < list.length && list[j + 1].groupId === g) j++;
    const seenBefore = list.slice(0, i).some(x => x.groupId === g);
    if (j === i) list[i].groupId = null; else if (seenBefore) { const n = uid(); for (let k = i; k <= j; k++) list[k].groupId = n; }
    i = j + 1;
  }
}
/** Etykieta grupy (A, B, C…) w kolejności pierwszego wystąpienia. */
export function groupLabels(list: Grouped[]): Record<string, string> {
  const out: Record<string, string> = {};
  let n = 0;
  list.forEach(x => {
    if (x.groupId && !out[x.groupId]) out[x.groupId] = String.fromCharCode(65 + (n++ % 26));
  });
  return out;
}
/** Etykieta grupy do wyświetlenia („SS A”) — przez słownik, żeby skrót dało się przetłumaczyć (M1-037). */
export const ssTag = (g: string) => t('SS {g}', { g });
/** Tytuł przycisku łączenia/rozdzielania supersetu („⇅ SS”, „✕ SS”) — skrót przez słownik (M1-037). */
export const ssBtn = (kind: 'link' | 'unlink') => `${kind === 'link' ? '⇅' : '✕'} ${t('SS')}`;
/** Łączy ćwiczenie i z następnym w superset; gdy oba są w różnych grupach — scala je w jedną. */
export function linkWithNext(list: Grouped[], i: number, touched?: Base | null) {
  const a = list[i], b = list[i + 1]; if (!a || !b) return;
  const g = a.groupId ?? b.groupId ?? uid(); const old = b.groupId && b.groupId !== g ? b.groupId : null;
  a.groupId = g; b.groupId = g; if (old) list.forEach(x => { if (x.groupId === old) x.groupId = g; });
  normalizeGroups(list); save(touched);
}
/** Wyjmuje ćwiczenie z supersetu; grupa rozerwana w środku dzieli się, pojedyncze elementy wychodzą. */
export function unlink(list: Grouped[], i: number, touched?: Base | null) {
  if (!list[i]?.groupId) return;
  list[i].groupId = null;
  normalizeGroups(list);
  save(touched);
}
/** Przesuwa element listy (szablon) i porządkuje grupy. */
export function moveItem<T extends Grouped>(list: T[], i: number, d: number, touched?: Base | null) {
  const j = i + d;
  if (j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  normalizeGroups(list);
  save(touched);
}
export function removeItem<T extends Grouped>(list: T[], i: number, touched?: Base | null) { list.splice(i, 1); normalizeGroups(list); save(touched); }

/* T-010 (02.10.2026): kolejność przeciąganiem. Przeciąga się bloki — pojedyncze ćwiczenie albo cały superset — a wewnątrz
 * supersetu jego ćwiczenia. Przesuwanie nigdy nie zmienia członkostwa w supersetach (od tego są „⇅ SS” i „✕ SS”), więc
 * upuszczenie ćwiczenia „w środek” cudzej grupy jej nie rozrywa. Pozycje wskazywane po id — lista mogła się zmienić od rysowania. */
/** Bloki listy: [pierwszy, ostatni] indeks (włącznie) — ciągła grupa albo pojedyncza pozycja. */
export function blockRanges(list: Grouped[]): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < list.length;) {
    const g = list[i].groupId;
    let j = i;
    if (g) while (j + 1 < list.length && list[j + 1].groupId === g) j++;
    out.push([i, j]);
    i = j + 1;
  }
  return out;
}
/** Q-016: trening w toku, to samo ćwiczenie w kilku blokach spoza szablonu — „Poprzednio” bierze blok o numerze wystąpienia, który blok miał na początku
 * (WExercise.occ), a nie o bieżącej pozycji. Wołane z `reorder` przed i po przesunięciu: znacznik zostaje tylko wtedy, gdy numer różni się od pozycji. */
function trackOcc(list: any[], reorder: () => void) {
  const live = list.some(x => x && Array.isArray(x.sets)); const pos = (l: any[], i: number) => l.slice(0, i).filter(x => x.exerciseId === l[i].exerciseId).length;
  const orig = live ? new Map(list.map((x, i) => [x, x.occ ?? pos(list, i)] as const)) : null;
  reorder(); if (!orig) return;
  list.forEach((x, i) => { const k = orig.get(x); if (k == null || !Array.isArray(x.sets)) return; if (k !== pos(list, i)) x.occ = k; else delete x.occ; });
}
/** Przesuwa blok zawierający pozycję `id` na miejsce `to` w kolejności bloków. Zwraca, czy coś się zmieniło. */
export function moveBlockOf<T extends Grouped & { id: string }>(list: T[], id: string, to: number, touched?: Base | null): boolean {
  const i = list.findIndex(x => x.id === id); if (i < 0) return false;
  const b = blockRanges(list); const from = b.findIndex(([s, e]) => i >= s && i <= e);
  const dest = Math.max(0, Math.min(b.length - 1, Math.round(to))); if (!Number.isFinite(to) || dest === from) return false;
  const [s, e] = b[from]; trackOcc(list, () => { const chunk = list.splice(s, e - s + 1); const rest = blockRanges(list);
    list.splice(dest >= rest.length ? list.length : rest[dest][0], 0, ...chunk); normalizeGroups(list); }); save(touched); return true;
}
/** Przesuwa pozycję `id` na miejsce `to` w obrębie jej supersetu. Zwraca, czy coś się zmieniło. */
export function moveInGroup<T extends Grouped & { id: string }>(list: T[], id: string, to: number, touched?: Base | null): boolean {
  const i = list.findIndex(x => x.id === id); const g = list[i]?.groupId; if (!g || !Number.isFinite(to)) return false;
  const [s, e] = blockRanges(list).find(([a, b]) => i >= a && i <= b)!; const dest = s + Math.max(0, Math.min(e - s, Math.round(to)));
  if (dest === i) return false; trackOcc(list, () => { const [x] = list.splice(i, 1); list.splice(dest, 0, x); }); save(touched); return true;
}
