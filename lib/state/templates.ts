/*
 * Szablony: wiersze serii pozycji (schemat 17 — szablon jako nieaktywny trening), nowy i kopiowany szablon, foldery, archiwum, notatka,
 * usunięcie. Szablony zmienia tylko użytkownik (decyzja 03.10.2026, 08:11).
 * Zależy od: ./sets, ./core, ./bands, ./places, ./util; zewnętrzne: ../seed, ../i18n.
 */
import { t as tr, collator } from '../i18n';
import { uid, base, type SetKind, type Template, type TemplateItem, type TRow } from '../seed';
import { NAME_MAX, clampName } from './util';
import { flush, save, getState } from './core';
import { workCount, exById, isBW } from './sets';
import { cascadeDown } from './setvals';
import { startLocationId } from './places';
import { nextBandId } from './bands';

/* ---------- szablon = nieaktywny trening (schemat 17, docs/17) ---------- */
/** Wiersze serii pozycji: zapisane albo — dla danych sprzed 17 — `sets` zwykłych serii z ciężarem startowym i celem czasu. */
export function tplRows(it: TemplateItem): TRow[] {
  if (it.rows?.length) return it.rows;
  const n = Math.max(1, Math.min(50, Math.floor(Number(it.sets) || 1)));
  return Array.from({ length: n }, (_, k) => ({ id: `${it.id}:${k}`, kind: 'normal' as SetKind, reps: '' as const, weight: it.startWeight ?? '',
      durationSec: Number(it.targetSec) > 0 ? Number(it.targetSec) : '' as const, distanceM: '' as const }));
}
const isWork = (k: SetKind) => k === 'normal' || k === 'failure';
/** Serie szablonu bez rozgrzewek — jedna reguła dla ekranu głównego, „Dodaj trening wstecz”, karty szablonu i listy Historii (scenariusz 06.10, krok 05b). */
/* D3: jak w treningu */
export const tplWorkSets = (tpl: { items: TemplateItem[] }) => tpl.items.reduce((a, i) => a + workCount(tplRows(i).map(r => r.kind)), 0);
/** Wiersze pozycji, gdy rodzaje serii bloku wciąż się z nimi zgadzają (cofnięcie zamiany — „wartości jak przy starcie”, audyt 85364ad M2). */
export const rowsFor = (it: TemplateItem | undefined, kinds: readonly SetKind[]) => {
  if (!it) return undefined;
  const r = tplRows(it);
  return r.length === kinds.length && r.every((x, i) => x.kind === kinds[i]) ? r : undefined;
};
/** Liczba serii, ciężar startowy i cel czasu z wierszy (reszta kodu — zamiana, trening wstecz — czyta te pola). */
export function syncItem(it: TemplateItem) {
  if (!it.rows?.length) {
    delete it.rows;
    return;
  }
  it.sets = it.rows.length;
  const w = it.rows.find(r => isWork(r.kind));
  it.startWeight = w ? w.weight : '';
  it.targetSec = w && Number(w.durationSec) > 0 ? Number(w.durationSec) : '';
}
function rowsOf(it: TemplateItem): TRow[] {
  if (!it.rows?.length) it.rows = tplRows(it).map(r => ({ ...r })); /* audyt 85364ad M1: id wyliczone zostają — pola nie montują się od nowa */
  return it.rows;
}
const tplItem = (tpl: Template, itemId: string) => tpl.items.find(x => x.id === itemId);
/** „+ seria / + rozgrzewka / + drop set” w szablonie — jak w treningu (addSet): rozgrzewka pusta przed roboczymi; seria — wartości ostatniej. */
export function tplAddRow(tpl: Template, itemId: string, kind?: 'warmup' | 'drop') {
  const it = tplItem(tpl, itemId); if (!it) return; const rows = rowsOf(it); if (rows.length >= 50) return;
  if (kind === 'warmup') {
    const i = rows.findIndex(r => r.kind !== 'warmup');
    rows.splice(i < 0 ? rows.length : i, 0, { id: uid(), kind: 'warmup', reps: '', weight: '', durationSec: '', distanceM: '' });
  }
  else {
    const l = rows[rows.length - 1];
    rows.push({ ...(l ?? { reps: '', weight: '', durationSec: '', distanceM: '' }), id: uid(), kind: kind ?? (l?.kind === 'drop' ? 'drop' : 'normal') });
  }
  syncItem(it); save(tpl);
}
export function tplRemoveRow(tpl: Template, itemId: string, rowId?: string) {
  const it = tplItem(tpl, itemId); if (!it) return; const rows = rowsOf(it); if (rows.length <= 1) return;
  const i = rowId ? rows.findIndex(r => r.id === rowId) : rows.length - 1;
  if (i < 0) return; /* audyt 85364ad L4: tylko po id (id wyliczone zostają po zapisie — M1) */
  rows.splice(i, 1);
  syncItem(it);
  save(tpl);
}
/** Guma wiersza szablonu — ten sam cykl co w treningu (poziomy z miejsca szablonu). */
export function tplCycleBand(tpl: Template, itemId: string, rowId: string) {
  const it = tplItem(tpl, itemId);
  if (!it) return;
  const r = rowsOf(it).find(x => x.id === rowId);
  if (!r) return;
  const n = nextBandId(r.bandId ?? '', startLocationId(tpl.locationId));
  if (n) r.bandId = n; else delete r.bandId;
  syncItem(it);
  save(tpl);
}
export function tplSetRow(tpl: Template, itemId: string, rowId: string, patch: Partial<Omit<TRow, 'id' | 'kind'>>) {
  const it = tplItem(tpl, itemId);
  if (!it) return;
  const r = rowsOf(it).find(x => x.id === rowId);
  if (!r) return;
  Object.assign(r, patch);
  syncItem(it);
  save(tpl);
}
/**
 * Wpis wartości w wierszu serii szablonu z kaskadą w dół (decyzja 11.10.2026, pkt 6A; cascadeDown): jak tplSetRow, a dodatkowo wartość pól z `patch`
 * przechodzi do kolejnych wierszy tej samej rodziny (rozgrzewka / drop / robocze osobno), które mają to pole puste albo jeszcze poprzednią wartość
 * wiersza. Ręcznie zmienionych nie rusza. Używa edytor szablonu; tplSetRow zostaje surowym zapisem jednego wiersza (testy, import, generator).
 */
export function tplEditRow(tpl: Template, itemId: string, rowId: string, patch: Partial<Omit<TRow, 'id' | 'kind'>>) {
  const it = tplItem(tpl, itemId); if (!it) return; const rows = rowsOf(it); const i = rows.findIndex(x => x.id === rowId); if (i < 0) return;
  const r = rows[i]; const ex = exById(it.exerciseId); const olds = new Map<string, number | ''>();
  for (const k of ['weight', 'reps', 'durationSec', 'distanceM'] as const) if (k in patch) olds.set(k, r[k]);
  Object.assign(r, patch);
  for (const [k, old] of olds) {
    const key = k as 'weight' | 'reps' | 'durationSec' | 'distanceM';
    cascadeDown(rows, i, old, x => x[key], (x, v) => { x[key] = v; }, key === 'weight' && !!ex && isBW(ex));
  }
  syncItem(it); save(tpl);
}
export function tplSetKind(tpl: Template, itemId: string, rowId: string, kind: SetKind) {
  const it = tplItem(tpl, itemId); if (!it) return; const r = rowsOf(it).find(x => x.id === rowId); if (!r) return; r.kind = kind; syncItem(it); save(tpl);
}
export function newTemplate(): Template {
  const tpl: Template = { ...base(getState().ownerId), name: tr('Nowy szablon'), items: [] };
  getState().templates.push(tpl);
  save();
  return tpl;
}
export function dupTemplate(id: string): Template {
  const src = getState().templates.find(x => x.id === id)!;
  const c: Template = JSON.parse(JSON.stringify(src));
  Object.assign(c, base(getState().ownerId));
  delete c.archived; /* kopia z archiwum trafia na listę */
  const suf = ' ' + tr('(kopia)');
  c.name = clampName(src.name, NAME_MAX - suf.length) + suf; /* runda 39: limit nazwy */
  const ids = new Map<string, string>();
  c.items.forEach(i => {
    i.id = uid();
    if (i.groupId) {
      if (!ids.has(i.groupId)) ids.set(i.groupId, uid());
      i.groupId = ids.get(i.groupId)!;
    }
  });
  getState().templates.push(c);
  save();
  return c;
}
/* ---------- foldery i archiwum szablonów (docs/21 4a, 07.10.2026 wieczór) — zmienia tylko użytkownik ---------- */
export const FOLDER_MAX = 40;
export function cleanFolder(v: string) { return v.replace(/\s+/g, ' ').trim().slice(0, FOLDER_MAX).trim(); }
const byName = (a: string, b: string) => collator().compare(a, b);
/** Foldery użyte w szablonach (także zarchiwizowanych), alfabetycznie wg języka aplikacji. */
export function templateFolders(): string[] { return [...new Set(getState().templates.map(t => t.folder).filter((f): f is string => !!f))].sort(byName); }
/** Lista startu i ekranu Szablony: najpierw bez folderu (kolejność dodania), potem foldery alfabetycznie; bez zarchiwizowanych. */
export function templateGroups(): { folder: string | null; items: Template[] }[] {
  const live = getState().templates.filter(t => !t.archived); const out: { folder: string | null; items: Template[] }[] = [];
  const loose = live.filter(t => !t.folder); if (loose.length) out.push({ folder: null, items: loose });
  for (const f of [...new Set(live.map(t => t.folder).filter((x): x is string => !!x))].sort(byName))
    out.push({ folder: f, items: live.filter(t => t.folder === f) });
  return out;
}
export function archivedTemplates(): Template[] { return getState().templates.filter(t => t.archived); }
/** Audyt 0.10 UX-10: notatka szablonu (np. linijka wysiłku z generatora) — jedna linia tekstu, ≤ TEMPLATE_NOTE_MAX; pusta = brak. */
export const TEMPLATE_NOTE_MAX = 200;
export function cleanNote(v: string) {
  return Array.from(v.replace(/\s+/g, ' ').trim()).slice(0, TEMPLATE_NOTE_MAX).join('').trim();
} /* po znakach — bez przecinania emoji (DAT-06) */
export function setTemplateNote(tpl: Template, v: string) { const n = cleanNote(v); if (n) tpl.note = n; else delete tpl.note; save(tpl); }
export function setTemplateFolder(tpl: Template, name: string | null) {
  const f = name ? cleanFolder(name) : '';
  if (f) tpl.folder = f; else delete tpl.folder;
  save(tpl);
}
export function setTemplateArchived(tpl: Template, on: boolean) { if (on) tpl.archived = true; else delete tpl.archived; save(tpl); }
export function deleteTemplate(id: string) { const st = getState(); st.templates = st.templates.filter(x => x.id !== id); save(); flush(); }
