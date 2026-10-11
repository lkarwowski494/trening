/*
 * Gumy: posiadane poziomy w miejscu, cykl przycisku gumy w serii (trening, edytor historii, szablon) i usunięcie gumy.
 * Zależy od: ./core, ./places; zewnętrzne: ../seed.
 */
import { type WSet } from '../seed';
import { save, getState } from './core';
import { locationById } from './places';

/** Gumy (decyzja właściciela 05.10.2026): posiadane poziomy 1–7 w miejscu — lista jak ciężary hantli; zły zapis → poprawne wartości albo brak. */
export function cleanLevels(item: unknown, v: unknown): number[] | undefined {
  if (item !== 'bands' || !Array.isArray(v)) return undefined;
  return [...new Set(v.filter((x): x is number => typeof x === 'number' && Number.isInteger(x) && x >= 1 && x <= 7))].sort((p, q) => p - q);
}
/** Następna guma w cyklu przycisku gumy: brak → najcieńsza → … → najgrubsza → brak (wg poziomu). Jedno źródło dla treningu i edytora historii. */
/** Następna guma w cyklu przycisku serii. `locId` — miejsce treningu (audyt 7651f64 MEDIUM: edytor historii podaje miejsce edytowanego treningu). */
export function nextBandId(cur: string, locId: string | null | undefined = getState().active?.locationId): string {
  const st = getState(); const loc = locId ? locationById(locId) : undefined; const lv = loc?.equipment.find(e => e.item === 'bands' && !e.off)?.levels;
  const all = [...st.bands].sort((a, b) => a.level - b.level);
  const inRange = lv ? all.filter(b => lv.includes(b.level)) : all;
  const sorted = lv && !lv.length ? [] : inRange.length ? inRange : all; /* przegląd 06.10: wszystkie poziomy odznaczone = brak gum w miejscu */
  const cl = all.find(b => b.id === cur); const i = sorted.findIndex(b => b.id === cur);
  if (i < 0 && cl) { const nx = sorted.find(b => b.level > cl.level); return nx?.id ?? ''; } /* guma spoza miejsca → następna z miejsca */
  return i < 0 ? (sorted[0]?.id ?? '') : (i + 1 < sorted.length ? sorted[i + 1].id : '');
}
/**
 * Przycisk gumy w serii treningu w toku. P-001/T-055: guma = kolor + poziom 1–7 — wybór, zmiana ani zdjęcie gumy nie zmienia ±kg
 * (dawna automatyczna asysta −kg gumy usunięta). Zdjęcie gumy zapamiętuje „bez gumy” (runda 47: nie wraca z podpowiedzi).
 * usesKg = false (ćwiczenie bez pola ±kg): bez ukrytej wartości ±kg (runda 54).
 */
export function cycleBand(s: WSet, usesKg = true) {
  s.bandId = nextBandId(s.bandId); if (s.bandId) delete s.noBand; else s.noBand = true;
  if (!usesKg) s.addKg = ''; save(getState().active);
}
/** Usunięcie gumy (ekran Gumy). Runda 48: trening w toku nie trzyma usuniętej gumy w nieodhaczonych seriach; T13: odhaczone zostają
 * z gumą (pokażą „?”, jak w historii); P-001: ±kg zostaje — guma nie ma kilogramów. */
export function deleteBand(id: string) {
  const st = getState(); st.bands = st.bands.filter(x => x.id !== id);
  st.active?.exercises.forEach(e => e.sets.forEach(s => { if (s.bandId === id && !s.done) s.bandId = ''; })); save();
}
