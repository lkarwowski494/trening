import { getState, save, exById, tplRows, restFor, loadOf, normalizeGroups, clampName, NAME_MAX, locationById } from './store';
import { base, uid, type Template, type TemplateItem, type TRow, type Workout, type WExercise, type WSet, type Exercise, type SetKind } from './seed';
import { t, exName } from './i18n';

/*
 * H5 (audyt 0.10, UX-11; decyzja właściciela 08.10.2026 ~20:20 — wariant A+B): „Zapisz jako szablon” w szczegółach sesji i pytanie po treningu
 * z szablonu „Zaktualizować szablon?”, gdy skład się różni. Tylko na wybór użytkownika — aplikacja sama szablonów nie zmienia (decyzja 03.10.2026).
 * „Skład” = ćwiczenia (dodane / usunięte), ich kolejność i rodzaje serii (dodana / usunięta seria, rozgrzewka, drop set). NIE zmienia składu:
 * inne wartości (ciężar, powtórzenia — to zwykła progresja), „Pomiń dziś” (pominięcie na dziś), zamiana ćwiczenia (ma własne „Zawsze w: …”),
 * nieodhaczone serie (zostają w porównaniu — liczy się plan treningu, nie to, ile zdążono). Trening deload („Mniej serii”) — bez pytania.
 */
export interface TemplateDiff { added: string[]; removed: string[]; sets: string[]; order: boolean }

const kindOf = (s: WSet): SetKind => (s.kind ?? (s.warmup ? 'warmup' : 'normal'));
const nameOf = (id: string) => { const e = exById(id); return e ? exName(e) : t('Usunięte ćwiczenie'); };
/** Pozycja szablonu, z której powstał blok (ta sama pozycja i to samo ćwiczenie albo jego zamiennik). */
const itemOf = (tpl: Template, b: WExercise): TemplateItem | undefined => { if (!b.tplItemId) return undefined; const it = tpl.items.find(x => x.id === b.tplItemId); return it && (it.exerciseId === b.exerciseId || it.exerciseId === b.swappedFrom) ? it : undefined; };
const sameKinds = (a: readonly SetKind[], b: readonly SetKind[]) => a.length === b.length && a.every((k, i) => k === b[i]);

/** Różnice składu treningu `w` (trening w toku przed zapisem — z nieodhaczonymi seriami) względem szablonu; null — skład ten sam albo nie pytamy. */
export function templateDiff(tpl: Template | undefined, w: Workout): TemplateDiff | null {
  if (!tpl || tpl.archived || w.deload || w.templateId !== tpl.id) return null;
  const used = new Set<string>(); const d: TemplateDiff = { added: [], removed: [], sets: [], order: false }; const seq: number[] = [];
  for (const b of w.exercises) {
    const it = itemOf(tpl, b);
    if (!it) { if (exById(b.exerciseId) && b.sets.length) d.added.push(nameOf(b.exerciseId)); continue; }
    used.add(it.id); seq.push(tpl.items.indexOf(it));
    if (b.skipped || b.swappedFrom) continue; /* „Pomiń dziś” i zamiana — tylko na dziś */
    if (!sameKinds(b.sets.map(kindOf), tplRows(it).map(r => r.kind))) d.sets.push(nameOf(it.exerciseId));
  }
  for (const it of tpl.items) if (!used.has(it.id) && exById(it.exerciseId)) d.removed.push(nameOf(it.exerciseId));
  d.order = seq.some((x, i) => i > 0 && x < seq[i - 1]);
  return d.added.length || d.removed.length || d.sets.length || d.order ? d : null;
}

/** Wiersz szablonu z serii treningu (rodzaj i wartości; ciężar w polu, które edytor szablonu pokazuje: ±kg przy masie ciała). */
function rowFromSet(ex: Exercise | undefined, s: WSet): TRow {
  const r: TRow = { id: uid(), kind: kindOf(s), reps: s.reps === '' ? '' : Number(s.reps) || 0, weight: loadOf(ex, s).raw, durationSec: s.durationSec === '' ? '' : Number(s.durationSec) || 0, distanceM: s.distanceM === '' ? '' : Number(s.distanceM) || 0 };
  if (s.bandId) r.bandId = s.bandId; return r;
}
/** Pozycja szablonu z bloku treningu (nowe ćwiczenie): serie jako wiersze, przerwa tylko gdy inna niż z ćwiczenia, zakres powtórzeń bloku. */
function itemFromBlock(b: WExercise, sets: WSet[] = b.sets): TemplateItem {
  const ex = exById(b.exerciseId); const rows = sets.map(s => rowFromSet(ex, s)); const w = rows.find(r => r.kind === 'normal' || r.kind === 'failure');
  return { id: uid(), exerciseId: b.exerciseId, sets: rows.length, repMin: b.repMin, repMax: b.repMax, restSec: b.restSec === restFor(ex) ? null : b.restSec, startWeight: w ? w.weight : '', targetSec: w && Number(w.durationSec) > 0 ? Number(w.durationSec) : '', groupId: b.groupId ?? null, rows };
}
const syncFromRows = (it: TemplateItem) => { const rows = it.rows ?? []; it.sets = rows.length; const w = rows.find(r => r.kind === 'normal' || r.kind === 'failure'); it.startWeight = w ? w.weight : ''; it.targetSec = w && Number(w.durationSec) > 0 ? Number(w.durationSec) : ''; };

/** „Zaktualizuj szablon”: skład szablonu jak w treningu `w` (przed zapisem — z nieodhaczonymi seriami). Pozycje z treningu zachowują swoje ustawienia
 * (przerwa, zakres, zamienniki); wiersze tego samego rodzaju — swoje wartości, nowe wiersze — wartości z treningu. „Pomiń dziś” i zamiana — pozycja bez
 * zmian. Pozycje usunięte w treningu znikają; ćwiczenia dodane w treningu dochodzą w jego kolejności; supersety jak w treningu. */
export function updateTemplateFromWorkout(tpl: Template, w: Workout): void {
  const groups = new Map<string, string>(); const gid = (g: string | null) => { if (!g) return null; if (!groups.has(g)) groups.set(g, uid()); return groups.get(g)!; };
  const items: TemplateItem[] = [];
  for (const b of w.exercises) {
    const it = itemOf(tpl, b);
    if (!it) { if (exById(b.exerciseId) && b.sets.length) items.push({ ...itemFromBlock(b), groupId: gid(b.groupId) }); continue; }
    const keep: TemplateItem = JSON.parse(JSON.stringify(it)); keep.groupId = gid(b.groupId ?? null);
    if (!b.skipped && !b.swappedFrom) {
      const old = tplRows(it); const ex = exById(it.exerciseId);
      keep.rows = b.sets.map((s, i) => (old[i] && old[i].kind === kindOf(s) ? { ...old[i], id: old[i].id.includes(':') ? uid() : old[i].id } : rowFromSet(ex, s)));
      syncFromRows(keep);
    }
    items.push(keep);
  }
  normalizeGroups(items); tpl.items = items; save(tpl);
}

/** Nazwa bez powtórzeń wśród szablonów: „Push”, „Push (2)”… */
function uniqueTplName(name: string): string {
  const taken = new Set(getState().templates.map(x => x.name)); const n = clampName(name || t('Trening'), NAME_MAX - 4); if (!taken.has(n)) return n;
  for (let i = 2; ; i++) { const c = `${n} (${i})`; if (!taken.has(c)) return c; }
}
/** „Zapisz jako szablon” (szczegóły sesji): nowy szablon ze składu zakończonego treningu — ćwiczenia w kolejności, serie z rodzajami i wartościami,
 * supersety; miejsce treningu jako miejsce domyślne (gdy wciąż istnieje). Ćwiczenia usunięte z biblioteki pomijane. */
export function templateFromWorkout(w: Workout): Template {
  const groups = new Map<string, string>(); const gid = (g: string | null) => { if (!g) return null; if (!groups.has(g)) groups.set(g, uid()); return groups.get(g)!; };
  const items = w.exercises.filter(b => { const e = exById(b.exerciseId); return e && !e.archived && b.sets.length; }).map(b => ({ ...itemFromBlock(b), groupId: gid(b.groupId) }));
  normalizeGroups(items);
  const tpl: Template = { ...base(getState().ownerId), name: uniqueTplName(w.templateName || t('Trening')), items, ...(w.locationId && locationById(w.locationId) ? { locationId: w.locationId } : {}) };
  getState().templates.push(tpl); save(tpl); return tpl;
}
/** Treść pytania „Zaktualizować szablon?” — co się zmieni. */
export function templateDiffText(d: TemplateDiff): string {
  return [d.added.length ? t('Dodane: {list}.', { list: d.added.join(', ') }) : '', d.removed.length ? t('Usunięte: {list}.', { list: d.removed.join(', ') }) : '',
    d.sets.length ? t('Inne serie: {list}.', { list: d.sets.join(', ') }) : '', d.order ? t('Inna kolejność ćwiczeń.') : ''].filter(Boolean).join('\n');
}
