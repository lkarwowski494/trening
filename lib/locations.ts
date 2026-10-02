import { getState, save, flush, locationById, clampName, NAME_MAX } from './store';
import { base, type Location, type LocEquip } from './seed';
import { presetEquipment, equipEntry, equipById, LOCATION_PRESET_LABEL, type LocationPreset } from './equipment';
import { type LoadSpec } from './loads';
import { t, lang } from './i18n';

/*
 * P-003 E1: operacje na miejscach treningu (Ustawienia → Miejsca treningu). Każda zmiana zapisuje się od razu (antywzorzec
 * Freeletics: sprzęt nie zapisywał się po geście „wstecz”). Usunięte miejsce zostaje w treningach i szablonach jako id
 * („(usunięte miejsce)”); miejsca głównego nie da się usunąć, dopóki jest inne miejsce, które można wskazać jako główne.
 */
const uniqueName = (name: string) => { const names = new Set(getState().settings.locations.map(l => l.name)); if (!names.has(name)) return name; for (let i = 2; ; i++) { const n = `${name} ${i}`; if (!names.has(n)) return n; } };
/** Nowe miejsce z presetu; pierwsze miejsce staje się główne. */
export function addLocation(preset: LocationPreset, name?: string): Location {
  const st = getState(); const s = st.settings;
  const label = LOCATION_PRESET_LABEL[preset]; const l: Location = { ...base(st.ownerId), name: uniqueName(clampName(name ?? (lang() === 'en' ? label.en : label.pl))), equipment: presetEquipment(preset, s.unit) };
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
  save(); flush(); return true;
}
/** Pozycja w miejscu (także odznaczona — z zachowanymi ciężarami). */
export const equipOf = (l: Location, item: string): LocEquip | undefined => l.equipment.find(e => e.item === item);
/** Pozycja zaznaczona (aktywna). */
export const activeEquip = (l: Location, item: string): LocEquip | undefined => { const e = equipOf(l, item); return e && !e.off ? e : undefined; };
/** Zaznaczenie / odznaczenie pozycji sprzętu (z domyślnymi opcjami i pustym opisem ciężarów w jednostce z Ustawień).
 * Audyt M5: odznaczenie nie kasuje ciężarów i opcji — pozycja dostaje znacznik off, a ponowne zaznaczenie przywraca ją jak była. */
export function setEquip(l: Location, item: string, on: boolean) {
  if (!equipById(item)) return; const has = equipOf(l, item);
  if (on && !has) l.equipment.push(equipEntry(item, getState().settings.unit)); else if (on && has?.off) delete has.off; else if (!on && has && !has.off) has.off = true; else return;
  save(l);
}
export function setOpt(l: Location, item: string, opt: string, on: boolean) {
  const e = activeEquip(l, item); const x = equipById(item); if (!e || !x?.options?.some(o => o.id === opt)) return;
  e.opts = on ? [...new Set([...e.opts, opt])] : e.opts.filter(o => o !== opt); save(l);
}
export function setLoad(l: Location, item: string, spec: LoadSpec) { const e = activeEquip(l, item); if (!e) return; e.load = spec; save(l); }
/** Nazwa miejsca do wyświetlenia; id usuniętego miejsca → „(usunięte miejsce)”. */
export const locationLabel = (id: string | null | undefined) => locationById(id)?.name ?? t('(usunięte miejsce)');
