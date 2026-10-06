/* Przegląd spójności 06.10.2026, partia 3 — testy odtwarzające znaleziska (sprzęt, trening ↔ szablon ↔ historia, wygląd). */
import * as fs from 'fs';
import * as path from 'path';
import { act } from '@testing-library/react-native';
import { renderApp, flushAll, screen, tap } from './app';
import * as store from '@/lib/store';
import * as edit from '@/lib/edit';
import { loadKindsFor, applyLoadPreset, LOAD_PRESETS } from '@/lib/equipment';
import { fresh, ex } from './helpers';

jest.setTimeout(60000);
const src = (f: string) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
beforeEach(async () => { await fresh(); });

test('ŚREDNIE (sprzęt #6): EZ i trap bar jako alternatywa w wymaganiach dają rodzaj ciężaru (Upright Row, Reverse Curl…)', () => {
  const alt = store.getState().exercises.filter(e => loadKindsFor(e).length /* z obciążeniem (masa ciała — bez listy) */ && (e.requires ?? []).some(g => g.length > 1 && g.some(c => c === 'ez_bar' || c === 'trap_bar')));
  expect(alt.length).toBeGreaterThan(0);
  for (const e of alt) for (const c of ['ez_bar', 'trap_bar'] as const) if ((e.requires ?? []).flat().includes(c)) expect([e.name, loadKindsFor(e).includes(c)]).toEqual([e.name, true]);
});
test('NISKIE (sprzęt #8): preset Voltra I (jedna linka) odznacza „dwie niezależne linki”; ViShape Pro zostawia opcje', () => {
  const v = LOAD_PRESETS.find(p => p.id === 'voltra1')!, vs = LOAD_PRESETS.find(p => p.id === 'vishape_pro')!;
  const a = { opts: ['dual', 'belt', 'ankle'] as string[], load: undefined as any }; applyLoadPreset(a, v);
  expect(a.opts).toEqual(['belt', 'ankle']); expect(a.load).toEqual({ kind: 'electric', unit: 'lb', min: 5, max: 200, step: 1 });
  const b = { opts: ['dual', 'belt'] as string[], load: undefined as any }; applyLoadPreset(b, vs); expect(b.opts).toEqual(['dual', 'belt']);
  expect(src('components/LoadEditor.tsx')).toMatch(/applyLoadPreset\(entry, p\)/);
});
test('ŚREDNIE (sprzęt #4): lista ćwiczeń i wybór oznaczają „guma” także przy gumie oporowej; ekran ćwiczenia tłumaczy opór gumy', () => {
  for (const f of ['app/picker.tsx', 'app/(tabs)/exercises.tsx']) { expect(src(f)).toMatch(/usesBand\(e\) \? ' · ' \+ t\('guma'\)/); expect(src(f)).not.toMatch(/e\.bandAssistable \? ' · '/); }
  expect(src('app/exercise/[id].tsx')).toMatch(/!e\.bandAssistable && usesBand\(e\)/);
});
test('ŚREDNIE (parytet #3): w treningu menu serii ma „Usuń serię” — usuwa wybraną serię (np. rozgrzewkę), nie ostatnią', async () => {
  store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); const e0 = store.getState().active!.exercises[0];
  e0.sets[0].weight = 80; e0.sets[0].reps = 8; store.addSet(0); store.addSet(0, 'warmup'); await store.flush();
  await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await flushAll(10);
  expect(store.getState().active!.exercises[0].sets.map(s => s.kind)).toEqual(['warmup', 'normal', 'normal']);
  await tap(screen.getByLabelText(/^Seria W, typ: rozgrzewkowa/)); await act(async () => { (global as any).__pickSheet(5); }); await flushAll(5);
  expect(store.getState().active!.exercises[0].sets.map(s => [s.kind, s.weight])).toEqual([['normal', 80], ['normal', 80]]);
  /* ostatnia seria bloku zostaje — menu bez „Usuń serię” */
  store.removeSetById(0, store.getState().active!.exercises[0].sets[0].id); expect(store.getState().active!.exercises[0].sets).toHaveLength(1);
  store.removeSetById(0, store.getState().active!.exercises[0].sets[0].id); expect(store.getState().active!.exercises[0].sets).toHaveLength(1);
});
test('ŚREDNIE (parytet #5) i NISKIE (#9): edytor historii ma „+ rozgrzewka” i „+ drop set”; „+ seria” nie kopiuje RPE', () => {
  const d = edit.beginPast(null, Date.now() - 2 * 86400000, Date.now() - 2 * 86400000 + 3600000); edit.draftAddExercise(d.key, ex('Bench Press (sztanga)'));
  const e = d.w.exercises[0]; Object.assign(e.sets[0], { weight: 60, reps: 10, rpe: 8 });
  edit.draftAddSet(d.key, 0); expect(e.sets[1].rpe).toBe(''); expect(e.sets[1].weight).toBe(60);
  edit.draftAddSet(d.key, 0, 'warmup'); expect(e.sets.map(s => s.kind)).toEqual(['warmup', 'normal', 'normal']); expect(e.sets[0].weight).toBe('');
  edit.draftAddSet(d.key, 0, 'drop'); expect(e.sets.map(s => s.kind)).toEqual(['warmup', 'normal', 'normal', 'drop']); expect(e.sets[3].weight).toBe(60);
  const ui = src('app/history/edit/[id].tsx'); expect(ui).toMatch(/draftAddSet\(d\.key, ei, 'warmup'\)/); expect(ui).toMatch(/draftAddSet\(d\.key, ei, 'drop'\)/);
});
test('NISKIE (parytet #13): edytor historii pokazuje typ serii plakietką SetBadge; w szablonie guma po kolumnie czasu (jak w treningu)', () => {
  expect(src('app/history/edit/[id].tsx')).toMatch(/<SetBadge kind=\{kind\} label=\{lbl\} note=\{!!set\.note\}/);
  const tpl = src('app/template/[id].tsx'); expect(tpl.indexOf("{hasTime(m) ? <View style={{ width: W.time }}>")).toBeLessThan(tpl.indexOf("{band ? <Pressable accessibilityRole=\"button\" accessibilityHint={nm}"));
});
test('NISKIE (wygląd #7): etykiety wykresów i „Anuluj” w wyborze/zamianie w kroju aplikacji', () => {
  const c = src('components/Chart.tsx'); expect((c.match(/<SvgText /g) ?? []).length).toBe((c.match(/<SvgText fontFamily=\{F\.regular\} /g) ?? []).length);
  for (const f of ['app/picker.tsx', 'app/swap.tsx']) expect(src(f)).toMatch(/fontSize: 17, fontFamily: F\.regular \}\}>\{t\('Anuluj'\)\}/);
});
