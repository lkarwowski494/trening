/*
 * 8A (decyzja właściciela 11.10.2026): zamiast okna „Zaktualizować szablon?” po „Zakończ” — przycisk „Zapisz zmiany w szablonie” na ekranie sesji.
 * Logika (lib/tplsync): rememberTemplateUpdate / pendingTemplateUpdate / applyPendingTemplateUpdate — różnica liczona jak dotąd (templateDiff) ze składu
 * sprzed zapisu; przycisk tylko gdy trening różnił się od szablonu i szablon nadal istnieje; po zapisie znika. Ekran: tests/audit-0.10-ui.test.tsx,
 * tests/live2-split-template.test.tsx.
 */
import * as store from '@/lib/store';
import { rememberTemplateUpdate, pendingTemplateUpdate, applyPendingTemplateUpdate, templateDiff } from '@/lib/tplsync';
import type { Template, TemplateItem, Workout } from '@/lib/seed';
import { fresh, ex } from './helpers';

const S = () => store.getState();
const J = (x: unknown) => JSON.parse(JSON.stringify(x));
const item = (id: string, name: string, sets: number): TemplateItem => ({ id, exerciseId: ex(name).id, sets, repMin: 8, repMax: 10, restSec: null, startWeight: 60, targetSec: '', groupId: null });
const mkTpl = (items: TemplateItem[]): Template => { const t = store.newTemplate(); t.name = 'Push'; t.items.push(...items); store.save(t); return t; };
/** Trening z szablonu z dodanym ćwiczeniem — migawka składu jak w ActiveWorkout.finalize (przed zapisem). */
const withAdded = (): { t: Template; snap: Workout } => {
  const t = mkTpl([item('a', 'Bench Press (sztanga)', 3), item('b', 'Back Squat', 2)]); store.startFromTemplate(t); store.addExerciseToActive(ex('Plank'));
  return { t, snap: J(S().active!) };
};
beforeEach(async () => { await fresh(); });

describe('pendingTemplateUpdate / applyPendingTemplateUpdate', () => {
  test('bez zapamiętanego składu (trening nie różnił się od szablonu) — null, apply = false', () => {
    expect(pendingTemplateUpdate('brak')).toBeNull(); expect(applyPendingTemplateUpdate('brak')).toBe(false);
  });
  test('trening z dodanym ćwiczeniem: przycisk ma różnicę (jak templateDiff), szablon nie zmienia się sam', () => {
    const { t, snap } = withAdded(); rememberTemplateUpdate('w1', t.id, snap);
    const p = pendingTemplateUpdate('w1')!; expect(p.tpl).toBe(t); expect(p.diff).toEqual(templateDiff(t, snap)); expect(p.diff.added.length).toBe(1);
    expect(t.items).toHaveLength(2); /* bez „Zapisz zmiany” szablon bez zmian */
  });
  test('apply: szablon dostaje skład z treningu, przycisk znika, drugi apply = false', () => {
    const { t, snap } = withAdded(); rememberTemplateUpdate('w2', t.id, snap);
    expect(applyPendingTemplateUpdate('w2')).toBe(true); expect(S().templates.find(x => x.id === t.id)!.items).toHaveLength(3);
    expect(pendingTemplateUpdate('w2')).toBeNull(); expect(applyPendingTemplateUpdate('w2')).toBe(false); expect(S().templates.find(x => x.id === t.id)!.items).toHaveLength(3);
  });
  test('szablon usunięty po treningu — przycisku nie ma, apply niczego nie zapisuje', () => {
    const { t, snap } = withAdded(); rememberTemplateUpdate('w3', t.id, snap); store.deleteTemplate(t.id);
    expect(pendingTemplateUpdate('w3')).toBeNull(); expect(applyPendingTemplateUpdate('w3')).toBe(false); expect(S().templates.find(x => x.id === t.id)).toBeUndefined();
  });
});
