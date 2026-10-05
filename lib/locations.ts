import { getState, save, flush, locationById, clampName, NAME_MAX, locationEquipChanged, cleanLevels } from './store';
import { base, type Location, type LocEquip } from './seed';
import { presetEquipment, equipEntry, equipById, LOCATION_PRESET_LABEL, type LocationPreset } from './equipment';
import { type LoadSpec } from './loads';
import { t, lbl } from './i18n';

/*
 * P-003 E1: operacje na miejscach treningu (Ustawienia → Miejsca treningu). Każda zmiana zapisuje się od razu (antywzorzec
 * Freeletics: sprzęt nie zapisywał się po geście „wstecz”). Usunięte miejsce zostaje w treningach i szablonach jako id
 * („(usunięte miejsce)”); miejsca głównego nie da się usunąć, dopóki jest inne miejsce, które można wskazać jako główne.
 */
const uniqueName = (name: string) => { const names = new Set(getState().settings.locations.map(l => l.name)); if (!names.has(name)) return name; for (let i = 2; ; i++) { const n = `${name} ${i}`; if (!names.has(n)) return n; } };
/** Nowe miejsce z presetu; pierwsze miejsce staje się główne. */
export function addLocation(preset: LocationPreset, name?: string): Location {
  const st = getState(); const s = st.settings;
  const label = LOCATION_PRESET_LABEL[preset]; const l: Location = { ...base(st.ownerId), name: uniqueName(clampName(name ?? lbl(label))), equipment: presetEquipment(preset, s.unit) };
  s.locations.push(l); if (!s.mainLocationId || !locationById(s.mainLocationId)) s.mainLocationId = l.id;
  save(); return l;
}
export function setMainLocation(id: string) { const s = getState().settings; if (!locationById(id) || s.mainLocationId === id) return; s.mainLocationId = id; save(); }
export function renameLocation(l: Location, name: string) { l.name = name.slice(0, NAME_MAX); save(l); } /* audyt (LOW): limit także poza polem */
/** Porządkuje nazwę po zakończeniu edycji (pusta → poprzednia albo „Miejsce”). */
export function commitLocationName(l: Location, fallback: string) { const n = l.name.replace(/\s+/g, ' ').trim(); l.name = clampName(n || fallback || t('Miejsce')); save(l); }
export function duplicateLocation(id: string): Location | undefined {
  const src = locationById(id); if (!src) return undefined; const st = getState();
  const c: Location = { ...JSON.parse(JSON.stringify(src)), ...base(st.ownerId) }; const suf = ' ' + t('(kopia)'); c.name = uniqueName(clampName(src.name, NAME_MAX - suf.length) + suf);
  st.settings.locations.push(c); save(); return c;
}
/** Czy można usunąć: miejsce główne tylko wtedy, gdy jest jedynym (wtedy aplikacja wraca do trybu bez miejsc). */
export const canDeleteLocation = (id: string) => { const s = getState().settings; return !!locationById(id) && (s.mainLocationId !== id || s.locations.length === 1); };
export function deleteLocation(id: string): boolean {
  const s = getState().settings; if (!canDeleteLocation(id)) return false;
  s.locations = s.locations.filter(l => l.id !== id); if (s.mainLocationId === id) s.mainLocationId = s.locations[0]?.id ?? null;
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
