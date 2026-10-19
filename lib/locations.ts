import { getState, save, flush, locationById, clampName, NAME_MAX, locationEquipChanged, cleanLevels, visibleLocations, pruneOneOff } from './store';
import { base, type Location, type LocEquip } from './seed';
import { presetEquipment, equipEntry, equipById, LOCATION_PRESET_LABEL, type LocationPreset } from './equipment';
import { type LoadSpec } from './loads';
import { t, lbl } from './i18n';

/*
 * P-003 E1: operacje na miejscach treningu (Ustawienia → Miejsca treningu). Każda zmiana zapisuje się od razu (antywzorzec
 * z popularnej aplikacji treningowej: sprzęt nie zapisywał się po geście „wstecz”). Usunięte miejsce zostaje w treningach i szablonach jako id
 * („(usunięte miejsce)”); miejsca głównego nie da się usunąć, dopóki jest inne miejsce, które można wskazać jako główne.
 */
/** Nazwa bez powtórzeń: rdzeń + dopisek (np. „ (kopia)”) + numer od 2; LOG-16: rdzeń przycinany tak, by całość mieściła się w NAME_MAX. */
const uniqueName = (stem: string, suffix = '') => { const names = new Set(visibleLocations().map(l => l.name));
  for (let i = 1; ; i++) { const tail = suffix + (i > 1 ? ` ${i}` : ''); const n = clampName(stem, NAME_MAX - tail.length) + tail; if (!names.has(n)) return n; } };
/** Nowe miejsce z presetu; pierwsze miejsce staje się główne. */
export function addLocation(preset: LocationPreset, name?: string): Location {
  const st = getState(); const s = st.settings;
  const label = LOCATION_PRESET_LABEL[preset]; const l: Location = { ...base(st.ownerId), name: uniqueName(name ?? lbl(label)), equipment: presetEquipment(preset, s.unit) };
  s.locations.push(l); if (!s.mainLocationId || !visibleLocations().some(x => x.id === s.mainLocationId)) s.mainLocationId = l.id;
  save(); return l;
}
export function setMainLocation(id: string) { const s = getState().settings; const l = locationById(id); if (!l || l.oneOff /* 0.19: miejscem głównym nie bywa miejsce jednorazowe */ || s.mainLocationId === id) return; s.mainLocationId = id; save(); }
export function renameLocation(l: Location, name: string) { l.name = name.slice(0, NAME_MAX); save(l); } /* audyt (LOW): limit także poza polem */
/** Porządkuje nazwę po zakończeniu edycji (pusta → poprzednia albo „Miejsce”). */
export function commitLocationName(l: Location, fallback: string) { const n = l.name.replace(/\s+/g, ' ').trim(); l.name = clampName(n || fallback || t('Miejsce')); save(l); }
export function duplicateLocation(id: string): Location | undefined {
  const src = locationById(id); if (!src || src.oneOff) return undefined; const st = getState();
  const c: Location = { ...JSON.parse(JSON.stringify(src)), ...base(st.ownerId) }; c.name = uniqueName(src.name, ' ' + t('(kopia)'));
  st.settings.locations.push(c); save(); return c;
}
/** Czy można usunąć: miejsce główne tylko wtedy, gdy jest jedynym (wtedy aplikacja wraca do trybu bez miejsc). */
export const canDeleteLocation = (id: string) => { const s = getState().settings; return !!locationById(id) && (s.mainLocationId !== id || visibleLocations().length === 1); };
/** Usuwa miejsce `id` z miejsc dni planu (State.planPlaces i zapisane plany) i porządkuje miejsca jednorazowe bez odwołań. */
function dropPlanPlacesOf(id: string) {
  const st = getState(); const drop = (m: Record<string, string> | undefined) => { const r: Record<string, string> = {}; for (const [k, v] of Object.entries(m ?? {})) if (v !== id) r[k] = v; return r; };
  const pp = drop(st.planPlaces); if (Object.keys(pp).length) st.planPlaces = pp; else delete st.planPlaces;
  if (st.savedPlans) st.savedPlans = st.savedPlans.map(p => { if (!p.places) return p; const { places, ...rest } = p; const r = drop(places); return Object.keys(r).length ? { ...rest, places: r } : rest; });
  pruneOneOff();
}
export function deleteLocation(id: string): boolean {
  const s = getState().settings; if (!canDeleteLocation(id)) return false;
  s.locations = s.locations.filter(l => l.id !== id); if (s.mainLocationId === id) s.mainLocationId = visibleLocations()[0]?.id ?? null;
  dropPlanPlacesOf(id); /* 0.19 (docs/33 B): dni planu z tym miejscem wracają do domyślnego; miejsca jednorazowe bez odwołań znikają */
  locationEquipChanged(id); /* runda 82c (LOW 2): trening w toku w usuniętym miejscu — bloki bez odhaczonych serii bez przyrządu */
  save(); flush(); return true;
}
/** Runda 82c (weryfikacja 82a8a16, LOW 2): KAŻDA zmiana sprzętu miejsca (pozycja, opcja, ciężary — także edytor ciężarów, components/LoadEditor)
 * idzie tędy: przyrządy bloków treningu w toku bez odhaczonych serii liczone od nowa, gdy to miejsce treningu (store.locationEquipChanged), potem zapis. */
export function locationEdited(l: Location) { locationEquipChanged(l.id); save(l); }
/** Pozycja w miejscu (także odznaczona — z zachowanymi ciężarami). */
export const equipOf = (l: Location, item: string): LocEquip | undefined => l.equipment.find(e => e.item === item);
/** Pozycja zaznaczona (aktywna). */
export const activeEquip = (l: Location, item: string): LocEquip | undefined => { const e = equipOf(l, item); return e && !e.off ? e : undefined; };
/** Zaznaczenie / odznaczenie pozycji sprzętu (z domyślnymi opcjami i pustym opisem ciężarów w jednostce z Ustawień).
 * Audyt M5: odznaczenie nie kasuje ciężarów i opcji — pozycja dostaje znacznik off, a ponowne zaznaczenie przywraca ją jak była. */
export function setEquip(l: Location, item: string, on: boolean) {
  if (!equipById(item)) return; const has = equipOf(l, item);
  if (on && !has) { const e = equipEntry(item, getState().settings.unit); if (item === 'bands') e.levels = cleanLevels('bands', getState().bands.map(b => b.level)); l.equipment.push(e); } else if (on && has?.off) delete has.off; else if (!on && has && !has.off) has.off = true; else return;
  locationEdited(l);
}
export function setOpt(l: Location, item: string, opt: string, on: boolean) {
  const e = activeEquip(l, item); const x = equipById(item); if (!e || !x?.options?.some(o => o.id === opt)) return;
  e.opts = on ? [...new Set([...e.opts, opt])] : e.opts.filter(o => o !== opt); locationEdited(l);
}
/** Gumy w miejscu (decyzja 05.10.2026): zaznaczenie poziomu 1–7; poziom bez gumy w katalogu gum tworzy gumę tego poziomu. */
export function setBandLevel(l: Location, level: number, on: boolean) {
  const e = activeEquip(l, 'bands'); if (!e || !Number.isInteger(level) || level < 1 || level > 7) return; const st = getState();
  const cur = e.levels ?? [...new Set(st.bands.map(b => b.level))];
  e.levels = cleanLevels('bands', on ? [...cur, level] : cur.filter(x => x !== level));
  if (on && !st.bands.some(b => b.level === level)) st.bands.push({ ...base(st.ownerId), color: t('nowa'), level });
  locationEdited(l);
}
/** Kolor gumy danego poziomu (wspólny dla miejsc — to ta sama guma). */
export function setBandColor(level: number, color: string) { const b = getState().bands.find(x => x.level === level); if (!b) return; b.color = color; save(b); }
export function setLoad(l: Location, item: string, spec: LoadSpec) { const e = activeEquip(l, item); if (!e) return; e.load = spec; locationEdited(l); }
/** Nazwa miejsca do wyświetlenia; id usuniętego miejsca → „(usunięte miejsce)”. */
export const locationLabel = (id: string | null | undefined) => locationById(id)?.name ?? t('(usunięte miejsce)');

/** Gotowe zestawy w szybkiej liście „Inne miejsce” (docs/33 A4, wariant najprostszy: te trzy presety, bez pełnej siłowni; liczba w jednym miejscu). */
export const ONE_OFF_PRESETS = ['hotel', 'bodyweight', 'home'] as const satisfies readonly LocationPreset[];
/** Nazwa domyślna miejsca jednorazowego z „Inne miejsce (tylko dziś)…” (0.19, docs/33 A4). */
export const ONE_OFF_DEFAULT_NAME = () => t('Tylko dziś');
/**
 * 0.19 (docs/33 A4, P1 A): miejsce jednorazowe — ukryte miejsce z `oneOff` (bez miejsca głównego, bez list); `keep` (przełącznik „Zapisz jako miejsce”) —
 * zwykłe miejsce od razu (znacznik zdjęty, nazwa bez powtórzeń). Sprzęt: wybrane pozycje (`equipment`), bez edycji ciężarów. Nazwa pusta → `fallback`.
 * Zwraca nowe miejsce (już w Settings.locations, zapisane).
 */
export function addOneOffLocation(name: string, equipment: LocEquip[], keep = false, fallback = ONE_OFF_DEFAULT_NAME()): Location {
  const st = getState(); const n = clampName(name.replace(/\s+/g, ' ').trim() || fallback);
  const l: Location = { ...base(st.ownerId), name: keep ? uniqueName(n) : n, equipment: JSON.parse(JSON.stringify(equipment)), ...(keep ? {} : { oneOff: true as const }) };
  st.settings.locations.push(l); if (keep && (!st.settings.mainLocationId || !visibleLocations().some(x => x.id === st.settings.mainLocationId))) st.settings.mainLocationId = l.id;
  save(); return l;
}
/** „Zapisz jako miejsce” dla istniejącego miejsca jednorazowego: zdejmuje znacznik (nazwa bez powtórzeń z miejscami z listy). */
export function keepOneOff(id: string): boolean {
  const l = locationById(id); if (!l?.oneOff) return false;
  l.name = uniqueName(l.name); delete l.oneOff; save(l); return true; /* nazwa liczona, gdy miejsca jeszcze nie ma na listach */
}
