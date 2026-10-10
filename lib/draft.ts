import { getState, save, markDraft, clampName, NAME_MAX, setTemplateNote, deleteTemplate, exerciseUsed, exerciseEdited, registerDraftStore, draftsChanged, takeSavedDrafts, sanitizeDraftObj, DRAFTS_KEY, onStateReplaced } from './store';
import type { Exercise, Template } from './seed';
import { t } from './i18n';

/*
 * Edycja na żądanie (decyzja właściciela 08.10.2026 ok. 21:30, docs/18): ekran ćwiczenia i szablonu otwiera się w podglądzie, a „Edytuj”
 * zaczyna SZKIC — głęboką kopię obiektu poza stanem aplikacji (ten sam wzór co edycja sesji w historii, lib/edit.ts). Funkcje store wołane
 * na szkicu (tplAddRow, setEquipment, moveItem…) kończą się `save(szkic)`, które tylko odświeża ekran (store.markDraft). „Zapisz” przenosi
 * szkic do obiektu w stanie jednym zapisem; „Anuluj” szkic wyrzuca.
 * UX2-03 = DAT2-06 (audyt kontrolny 1, wariant A): szkic przeżywa zamknięcie aplikacji przez iOS — każda zmiana idzie do osobnego klucza bazy
 * (store.DRAFTS_KEY), a po starcie restoreObjDrafts przywraca szkice ze zmianami (ekran startu pyta: wrócić do edycji czy odrzucić).
 * UX2-12: nowy obiekt („+ Nowy”), który po zabiciu aplikacji nie ma szkicu ze zmianami, znika przy starcie (kryteria dropUnsavedNew).
 */
export { DRAFTS_KEY };
export type DraftKind = 'exercise' | 'template';
type Obj = Exercise | Template;
/** UI2-10 (audyt kontrolny 1): skutki w bibliotece wywołane w trakcie edycji szablonu (wybór ćwiczenia: „Utwórz „…””, „Przywróć „…””) — należą do szkicu. */
export type DraftEffect = 'created' | 'restored';
type Fx = Partial<Record<DraftEffect, string[]>>;
interface ObjDraft { kind: DraftKind; id: string; obj: Obj; orig: string; /** utworzony na tym ekranie („+ Nowy”) — UX2-12 */ isNew?: boolean; /** UI2-10 */ fx?: Fx }
const drafts = new Map<string, ObjDraft>();
const k = (kind: DraftKind, id: string) => `${kind}:${id}`;
/** Pola, których szkic nie zmienia (tożsamość, archiwum — przełączane w podglądzie, znaczniki zapisu). */
const KEEP = new Set(['id', 'ownerId', 'createdAt', 'updatedAt', 'archived']);
const snap = (o: Obj) => JSON.stringify(o, (key, v) => (key === 'updatedAt' ? undefined : v));
const real = (kind: DraftKind, id: string): Obj | undefined => kind === 'exercise' ? getState().exercises.find(x => x.id === id) : getState().templates.find(x => x.id === id);

/** „Edytuj”: szkic z bieżącego stanu (istniejący szkic zostaje — powrót z wyboru ćwiczenia czy Kolejności nie gubi zmian). */
export function beginObjDraft<T extends Obj>(kind: DraftKind, id: string, opts: { isNew?: boolean } = {}): T | null {
  const cur = drafts.get(k(kind, id)); if (cur) return cur.obj as T;
  const src = real(kind, id); if (!src) return null;
  const obj = markDraft(JSON.parse(JSON.stringify(src)) as Obj); drafts.set(k(kind, id), { kind, id, obj, orig: snap(obj), ...(opts.isNew ? { isNew: true } : {}) }); draftsChanged(); return obj as T; /* bez save/emit: woła to także render (useState) — ekran i tak się przerysowuje (setEditing) */
}
export function objDraft<T extends Obj>(kind: DraftKind, id: string): T | undefined { return drafts.get(k(kind, id))?.obj as T | undefined; }
/** Czy szkic różni się od stanu z chwili „Edytuj”. */
export function objDirty(kind: DraftKind, id: string): boolean { const d = drafts.get(k(kind, id)); return !!d && snap(d.obj) !== d.orig; }
/** UI2-10: zapisanie skutku w bibliotece przy trwającym szkicu (wybór ćwiczenia w edycji szablonu); bez szkicu — false (zmiana zwykła, od razu). */
export function noteDraftEffect(kind: DraftKind, id: string, eff: DraftEffect, exerciseId: string): boolean {
  const d = drafts.get(k(kind, id)); if (!d) return false; const fx = (d.fx ??= {}); const list = (fx[eff] ??= []); if (!list.includes(exerciseId)) list.push(exerciseId); draftsChanged(); return true;
}
/** UI2-10: odrzucenie szkicu cofa jego skutki w bibliotece — ćwiczenie utworzone w tej edycji znika, przywrócone wraca do usuniętych — chyba że
 * w międzyczasie trafiło gdzie indziej (trening, inny szablon, zamiennik): wtedy zostaje (nic, czego użytkownik użył poza szkicem, nie ginie). */
function undoEffects(fx: Fx | undefined) {
  if (!fx) return; const st = getState();
  /* szablony w stanie (szkic w nim nie jest) — także ten sam szablon, gdyby pozycję zapisano wcześniej */
  const inTemplates = (exId: string) => st.templates.some(tp => tp.items.some(i => i.exerciseId === exId || (i.alternates ?? []).some(a => a.exerciseId === exId)));
  const usedElsewhere = (exId: string) => exerciseUsed(exId) || inTemplates(exId);
  let changed = false;
  for (const exId of fx.created ?? []) { const e = st.exercises.find(x => x.id === exId); if (!e || e.lib || usedElsewhere(exId)) continue; st.exercises = st.exercises.filter(x => x.id !== exId); changed = true; }
  for (const exId of fx.restored ?? []) { const e = st.exercises.find(x => x.id === exId); if (!e || e.archived || inTemplates(exId)) continue; e.archived = true; save(e); changed = true; }
  if (changed) save();
}
/** Wyrzucenie szkicu („Anuluj”, zamknięcie ekranu) — razem ze skutkami w bibliotece (UI2-10). */
export function discardObjDraft(kind: DraftKind, id: string) { const d = drafts.get(k(kind, id)); if (!d) return; drafts.delete(k(kind, id)); draftsChanged(); save(d.obj); undoEffects(d.fx); }
/** Nazwa przy zapisie (G2, audyt 0.10 UI-05): spacje uporządkowane; pusta — wraca poprzednia (a bez niej domyślna). */
export function cleanName(v: string, prev: string, fallback: string): string { const n = clampName(String(v ?? '').replace(/\s+/g, ' ').trim(), NAME_MAX); return n || prev || fallback; }

/** „Zapisz”: szkic trafia do obiektu w stanie jednym zapisem (obiekt zachowuje tożsamość — inne ekrany trzymają do niego odwołania).
 * Bez zmian — nic się nie zapisuje (znacznik zmiany zostaje). Zwraca false, gdy obiekt w międzyczasie zniknął. */
export function commitObjDraft(kind: DraftKind, id: string, opts: { keepNew?: boolean } = {}): boolean {
  const d = drafts.get(k(kind, id)); if (!d) return false; drafts.delete(k(kind, id)); draftsChanged();
  const dst = real(kind, id) as unknown as Record<string, unknown> | undefined; if (!dst) { save(d.obj); return false; }
  if (snap(d.obj) === d.orig) {
    save(d.obj);
    /* UI2-05 (audyt kontrolny 1, wariant A): „Zapisz” na NOWYM obiekcie to jawny wybór — znacznik zapisu (updatedAt > createdAt), żeby dropUnsavedNew go nie usunął */
    if (opts.keepNew) { const o = dst as unknown as { createdAt: number; updatedAt: number }; save(dst as unknown as Obj); if (o.updatedAt <= o.createdAt) o.updatedAt = o.createdAt + 1; }
    return true;
  }
  const src = d.obj as unknown as Record<string, unknown>;
  src.name = cleanName(String(src.name ?? ''), String(dst.name ?? ''), kind === 'exercise' ? t('Nowe ćwiczenie') : t('Nowy szablon'));
  const EQUIP_KEYS = ['equipment', 'loadSource', 'requires', 'implements', 'loadMode']; const equipBefore = JSON.stringify(EQUIP_KEYS.map(x => dst[x] ?? null));
  for (const key of Object.keys(dst)) if (!KEEP.has(key) && !(key in src)) delete dst[key];
  for (const [key, v] of Object.entries(src)) if (!KEEP.has(key)) dst[key] = v;
  if (kind === 'template') setTemplateNote(dst as unknown as Template, String((dst as unknown as Template).note ?? '')); /* ta sama sanityzacja co dotąd przy końcu edycji */
  else if (JSON.stringify(EQUIP_KEYS.map(x => dst[x] ?? null)) !== equipBefore) exerciseEdited(id); /* UI2-01: na szkicu setEquipment przeliczał bloki wg NIEZMIENIONEGO ćwiczenia — przeliczenie po przeniesieniu szkicu, tylko po zmianie sprzętu (L5; inne pola nie ruszają treningu w toku) */
  save(dst as unknown as Obj); return true;
}

/** Szablon, na którym działają wybór ćwiczenia i Kolejność: szkic, gdy trwa edycja, inaczej szablon ze stanu. */
export function templateForEdit(id: string): Template | undefined { return objDraft<Template>('template', id) ?? getState().templates.find(x => x.id === id); }

/** „+ Nowe” / „+ Nowy” i „Anuluj” bez zapisu: obiekt utworzony na tym ekranie i nigdy niezapisany znika (nic nie zostaje po rezygnacji).
 * Ćwiczenie użyte gdziekolwiek (trening, szablon) zostaje. */
export function dropUnsavedNew(kind: DraftKind, id: string): boolean {
  const st = getState();
  if (kind === 'template') { const x = st.templates.find(y => y.id === id); if (!x || x.updatedAt !== x.createdAt || x.items.length) return false; deleteTemplate(x.id); return true; }
  const e = st.exercises.find(y => y.id === id); if (!e || e.lib || e.updatedAt !== e.createdAt || exerciseUsed(e.id) || st.templates.some(tp => tp.items.some(i => i.exerciseId === e.id))) return false;
  st.exercises = st.exercises.filter(y => y.id !== id); save(); return true;
}
/* ---------- UX2-03 = DAT2-06 / UX2-12: szkice w bazie i przywracanie po starcie ---------- */
registerDraftStore(() => drafts.size ? JSON.stringify({ v: 1, items: [...drafts.values()].map(d => ({ kind: d.kind, id: d.id, obj: d.obj, orig: d.orig, ...(d.isNew ? { isNew: true } : {}), ...(d.fx ? { fx: d.fx } : {}) })) }) : null);
/** UI2-10: skutki ze szkicu zapisanego w bazie — tylko listy tekstowych id (dane z bazy, nie ufamy kształtowi). */
function cleanFx(v: unknown): Fx | undefined {
  if (!v || typeof v !== 'object') return undefined; const out: Fx = {};
  for (const key of ['created', 'restored'] as const) { const a = (v as Record<string, unknown>)[key]; if (Array.isArray(a)) { const ids = [...new Set(a.filter((x): x is string => typeof x === 'string'))]; if (ids.length) out[key] = ids; } }
  return out.created || out.restored ? out : undefined;
}
/** Szkic przywrócony po starcie — do pytania „Wrócić do edycji?”. */
export interface RestoredDraft { kind: DraftKind; id: string; name: string; isNew: boolean }
const defaultName = (kind: DraftKind) => kind === 'exercise' ? t('Nowe ćwiczenie') : t('Nowy szablon');
/** Po starcie (app/_layout): szkice zapisane w bazie wracają do pamięci po porządkowaniu jak import (store.sanitizeDraftObj); szkic bez zmian
 * odpada bez pytania. Nowe obiekty bez szkicu ze zmianami — z zapisu albo puste, nietknięte, z domyślną nazwą (także pozostałości z 0.10.0) —
 * znikają (dropUnsavedNew). Zwraca szkice ze zmianami (najpierw szablony). */
export function restoreObjDrafts(): RestoredDraft[] {
  drafts.clear(); let items: unknown[] = [];
  try { const raw = takeSavedDrafts(); const p = raw ? JSON.parse(raw) : null; if (p && Array.isArray(p.items)) items = p.items; } catch { items = []; }
  const fresh = new Set<string>(); const out: RestoredDraft[] = []; const pending: (Fx | undefined)[] = [];
  for (const it of items) {
    if (!it || typeof it !== 'object') continue; const x = it as { kind?: unknown; id?: unknown; obj?: unknown; orig?: unknown; isNew?: unknown; fx?: unknown };
    if ((x.kind !== 'exercise' && x.kind !== 'template') || typeof x.id !== 'string' || drafts.has(k(x.kind, x.id))) continue;
    const kind = x.kind; const id = x.id; if (x.isNew === true) fresh.add(k(kind, id));
    const fx = cleanFx(x.fx); /* UI2-10: szkic, który nie wraca (obiekt zniknął, bez zmian, uszkodzony), cofa swoje skutki od razu */
    const skip = () => { pending.push(fx); };
    if (!real(kind, id) || !x.obj || typeof x.obj !== 'object' || (x.obj as { id?: unknown }).id !== id) { skip(); continue; }
    const clean = sanitizeDraftObj(kind, x.obj); if (!clean) { skip(); continue; }
    const nm = (clean as { name?: unknown }).name; if (typeof nm === 'string') (clean as { name: string }).name = clampName(nm, NAME_MAX); /* jak pole nazwy */
    const obj = markDraft(clean as Obj); const orig = typeof x.orig === 'string' ? x.orig : '';
    if (snap(obj) === orig || snap(obj) === snap(real(kind, id)!)) { skip(); continue; } /* bez zmian — nic do przywrócenia */
    drafts.set(k(kind, id), { kind, id, obj, orig, ...(x.isNew === true ? { isNew: true } : {}), ...(fx ? { fx } : {}) });
    out.push({ kind, id, name: String((obj as { name?: unknown }).name ?? '') || defaultName(kind), isNew: x.isNew === true });
  }
  for (const fx of pending) undoEffects(fx);
  const st = getState();
  for (const tp of [...st.templates]) if (!drafts.has(k('template', tp.id)) && (fresh.has(k('template', tp.id)) || tp.name === defaultName('template'))) dropUnsavedNew('template', tp.id);
  for (const e of [...st.exercises]) if (!drafts.has(k('exercise', e.id)) && (fresh.has(k('exercise', e.id)) || e.name === defaultName('exercise'))) dropUnsavedNew('exercise', e.id);
  draftsChanged();
  return out.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'template' ? -1 : 1));
}
/** „Odrzuć zmiany” w pytaniu po starcie: szkic znika, a nowy (nigdy niezapisany) obiekt — razem z nim. */
export function dropRestored(r: Pick<RestoredDraft, 'kind' | 'id'>) { const d = drafts.get(k(r.kind, r.id)); discardObjDraft(r.kind, r.id); if (d?.isNew) dropUnsavedNew(r.kind, r.id); }
export function __resetObjDrafts() { drafts.clear(); }
/* A11B-1: import i reset (store.replaceState) — szkice znikają z pamięci i z bazy (pusty zbiór → writeDrafts kasuje klucz; flush po imporcie
 * i resecie zapisuje to od razu). Bez cofania skutków (undoEffects): dotyczą danych sprzed zastąpienia. */
onStateReplaced(() => { drafts.clear(); draftsChanged(); });
