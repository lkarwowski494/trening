import * as store from '@/lib/store';
import { seedState, type State, type Template, type Workout, type WSet } from '@/lib/seed';
import { lang, type Lang } from '@/lib/i18n';
import { demoTemplates } from './fixtures/demo-templates';

declare global { // eslint-disable-next-line no-var
  var __kv: Map<string, string>; var __dbFail: boolean; var __locales: { languageCode: string; languageTag: string }[]; var __alerts: { title: string; msg?: string; buttons?: { text: string; onPress?: (v?: string) => void; style?: string }[]; prompt?: boolean; def?: string }[]; var __notifications: unknown[]; var __la: unknown[];
}

/** Świeży store: opcjonalnie z zapisanym stanem (obiekt lub surowy tekst) w „SQLite”. */
export async function fresh(saved?: unknown, locale: 'pl' | 'en' = 'pl') {
  global.__kv.clear(); global.__dbFail = false; global.__alerts.length = 0; global.__notifications.length = 0; global.__la.length = 0;
  global.__locales = [{ languageCode: locale, languageTag: locale === 'pl' ? 'pl-PL' : 'en-GB' }];
  if (saved !== undefined) global.__kv.set('state', typeof saved === 'string' ? saved : JSON.stringify(saved));
  store.__resetForTests();
  await store.init();
  return store.getState();
}
/** Zapisany stan tak, jak go wczyta aplikacja: pełny stan + nowszy trening w toku/timer z klucza „live” (runda 69). */
export const saved = (): State => { const s = JSON.parse(global.__kv.get('state')!); const l = global.__kv.has('live') ? JSON.parse(global.__kv.get('live')!) : null; if (l && (Number.isFinite(l.seq) && Number.isFinite(s.saveSeq) ? l.seq >= s.saveSeq : l.at >= (s.metaUpdatedAt || 0))) { s.active = l.active; s.timer = l.timer; } return s; };
export const ex = (name: string) => { const e = store.getState().exercises.find(x => x.name === name); if (!e) throw new Error('no exercise ' + name); return e; };
export const set = (p: Partial<WSet> = {}): WSet => ({ id: Math.random().toString(36).slice(2), weight: '', reps: '', durationSec: '', distanceM: '', rpe: '', bandId: '', addKg: '', kind: 'normal', warmup: false, note: '', done: true, completedAt: null, actualRest: null, ...p });
/** Dodaje zakończony trening z blokami [nazwa ćwiczenia, serie]. */
export function addWorkout(at: number, blocks: [string, Partial<WSet>[]][], name = 'T'): Workout {
  const st = store.getState();
  const w: Workout = { id: Math.random().toString(36).slice(2), ownerId: 'local', createdAt: at, updatedAt: at, loggedBy: 'local', sessionMode: 'solo', healthUUID: null, templateId: null, templateName: name, startedAt: at, finishedAt: at + 3600e3, note: '', exercises: blocks.map(([n, sets]) => ({ id: Math.random().toString(36).slice(2), exerciseId: ex(n).id, restSec: 90, repMin: null, repMax: null, groupId: null, sets: sets.map((s, i) => set({ completedAt: at + i * 1000, ...s })) })) };
  st.workouts.push(w); store.save(); return w;
}
export const pressAlert = (title: string, button: string, value?: string) => {
  const a = [...global.__alerts].reverse().find(x => x.title === title); if (!a) throw new Error('no alert ' + title + ' in ' + global.__alerts.map(x => x.title).join(' | '));
  const b = a.buttons?.find(x => x.text === button); if (!b) throw new Error('no button ' + button); b.onPress?.(value);
};
/** Decyzja 03.10.2026 (08:11): świeża instalacja nie ma szablonów. Testy, które potrzebują dawnych czterech szablonów (Upper A, Upper B,
 * Legs — siłownia, Legs — dom), dokładają je JAWNIE: do stanu w store (język jak interfejsu) — zwraca dodane szablony w tej kolejności. */
export function withDemoTemplates(lng: Lang = lang()): Template[] {
  const st = store.getState(); const t = demoTemplates(st.exercises, lng); st.templates.push(...t); store.save(); return t;
}
/** seedState z szablonami demonstracyjnymi — dla testów budujących zapisany stan (`fresh(seedWithDemo())`). */
export function seedWithDemo(lng: Lang = 'pl'): State { const s = seedState(lng); s.templates = demoTemplates(s.exercises, lng); return s; }
export { seedState };
