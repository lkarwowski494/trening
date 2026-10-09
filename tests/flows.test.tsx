/* Warstwa B planu testów (09): przepływy na prawdziwych ekranach. */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { renderApp, tap, type, flushAll, screen, go, act, openCard, swipeDelete, startEdit, saveEdit, tplDraft } from './app';
import { ex, pressAlert, addWorkout, seedWithDemo } from './helpers';

jest.setTimeout(30000);
afterEach(async () => { await timer.stop(); await timer.stopSet(); });

const startTemplate = async (name: string) => {
  await tap(screen.getByLabelText(`Start: ${name}`)); await flushAll(10); expect(screen.getAllByText('Zakończ trening i zapisz').length).toBeGreaterThan(0);
};
const finishConfirmed = async () => { await tap(screen.getAllByText('Zakończ trening i zapisz')[0]); pressAlert('Zakończyć trening?', 'Zakończ'); await flushAll(500); };

test('B1 pierwszy start: podpowiedź, ZERO szablonów (decyzja 03.10.2026) i droga do pierwszego szablonu', async () => {
  await renderApp();
  expect(store.getState().templates).toEqual([]);
  /* UX-12 A (audyt 0.10): „Pierwsze kroki” z przyciskami przy kroku — bez powtórzonej podpowiedzi „Pierwszy raz?” i komunikatu o braku szablonów */
  expect(screen.getByLabelText('1. Utwórz pierwszy szablon albo wygeneruj szablony i plan. do zrobienia')).toBeTruthy();
  expect(screen.queryByText(/Wybierz szablon niżej|Pierwszy raz\?/)).toBeNull();
  expect(screen.queryByText('Nie masz jeszcze szablonów — utwórz pierwszy albo zacznij pusty trening.')).toBeNull();
  for (const n of ['Upper A', 'Upper B', 'Legs — siłownia', 'Legs — dom']) expect(screen.queryByText(n)).toBeNull();
  expect(screen.queryByLabelText(/^Start: /)).toBeNull(); expect(screen.getByText('Pusty trening')).toBeTruthy();
  await tap(screen.getByText('+ Nowy szablon')); await flushAll(10); /* „+ Nowy szablon” → edytor nowego szablonu */
  expect(store.getState().templates).toHaveLength(1); expect(screen.getByDisplayValue('Nowy szablon')).toBeTruthy(); expect(screen.getByText('+ Dodaj ćwiczenie')).toBeTruthy();
});

test('B1 (EN) first launch without templates: hint, empty state and „+ New template” in English', async () => {
  await renderApp({ locale: 'en' });
  expect(screen.getByText('Create your first template or generate templates and a plan.')).toBeTruthy(); expect(screen.getByText('+ New template')).toBeTruthy();
  expect(screen.queryByText(/Nie masz jeszcze szablonów|Pierwszy raz/)).toBeNull();
});

test('B1b szablony ustawione przez użytkownika (dane testowe) — wszystkie na ekranie głównym ze „Start”', async () => {
  await renderApp({ saved: seedWithDemo() });
  expect(screen.getByLabelText(/^1\. .* zrobione$/)).toBeTruthy(); expect(screen.getByText('Pierwszy trening: „Start” przy szablonie niżej albo „Pusty trening”.')).toBeTruthy();
  expect(screen.queryByText('Nie masz jeszcze szablonów — utwórz pierwszy albo zacznij pusty trening.')).toBeNull();
  for (const n of ['Upper A', 'Upper B', 'Legs — siłownia', 'Legs — dom']) { expect(screen.getByText(n)).toBeTruthy(); expect(screen.getByLabelText('Start: ' + n)).toBeTruthy(); }
});

test('B2 start szablonu jednym tapnięciem, ✓ → przerwa i powiadomienie', async () => {
  await renderApp({ saved: seedWithDemo() });
  await startTemplate('Upper A');
  const checks = screen.getAllByLabelText(/^Seria 1 zrobiona/);
  await tap(checks[0]);
  expect(await screen.findByText(/przerwa z/)).toBeTruthy();
  expect(timer.T.on).toBe(true); expect(global.__notifications.length).toBeGreaterThan(0);
});

test('B3 ciężar z przecinkiem: 12,5 zostaje w polu i trafia do danych', async () => {
  await renderApp({ saved: seedWithDemo() }); await startTemplate('Upper A');
  const field = screen.getAllByLabelText('kg/hantel')[0];
  await type(field, '12,'); expect(field.props.value).toBe('12,');
  await type(field, '12,5'); expect(field.props.value).toBe('12,5');
  expect(store.getState().active!.exercises[0].sets[0].weight).toBe(12.5);
});

test('B4 cofnięcie ✓ starszej serii nie kasuje przerwy z nowszej', async () => {
  await renderApp({ saved: seedWithDemo() }); await startTemplate('Upper A');
  await tap(screen.getAllByLabelText(/^Seria 1 zrobiona/)[0]);
  await tap(screen.getAllByLabelText(/^Seria 2 zrobiona/)[0]);
  const id2 = store.getState().active!.exercises[0].sets[1].id; expect(timer.T.setId).toBe(id2);
  await tap(screen.getAllByLabelText(/^Seria 1 zrobiona/)[0]);
  expect(timer.T.on).toBe(true);
  await tap(screen.getAllByLabelText(/^Seria 2 zrobiona/)[0]);
  expect(timer.T.on).toBe(false);
});

test('B5 rozgrzewka nie przesuwa „Poprzednio”', async () => {
  await renderApp({ saved: seedWithDemo() });
  const w0 = Date.now() - 3 * 86400e3; const s = store.getState(); const bench = ex('Bench Press (hantle)');
  s.workouts.push({ id: 'w0', ownerId: 'local', createdAt: w0, updatedAt: w0, loggedBy: 'local', sessionMode: 'solo', healthUUID: null, templateId: null, templateName: 'X', startedAt: w0, finishedAt: w0 + 1, note: '', exercises: [{ id: 'e0', exerciseId: bench.id, restSec: 90, repMin: null, repMax: null, groupId: null, sets: [22, 24].map((kg, i) => ({ id: 'p' + i, weight: kg, reps: 8, durationSec: '', distanceM: '', rpe: '', bandId: '', addKg: '', kind: 'normal' as const, warmup: false, note: '', done: true, completedAt: w0 + i, actualRest: null })) }] });
  store.save();
  await startTemplate('Upper A');
  const a = store.getState().active!; const first = a.exercises[0].sets[0];
  await tap(screen.getAllByLabelText(/Seria 1, typ/)[0]); await act(async () => { (global as any).__pickSheet(1); }); // → rozgrzewka
  expect(first.kind).toBe('warmup');
  // wiersz 2 (pierwsza robocza) pokazuje 22×8, wiersz 3 — 24×8
  const prevTexts = screen.getAllByText(/^2[24]×8$/).map(t => t.props.children);
  expect(prevTexts.slice(0, 2)).toEqual(['22×8', '24×8']);
});

test('B6 ćwiczenie na czas: ✓ na trwającej serii kończy pomiar, czas ≤ cel', async () => {
  await renderApp();
  store.startEmpty(); store.addExerciseToActive(ex('Plank')); const a = store.getState().active!; a.exercises[0].sets[0].durationSec = 60; store.save(a);
  await flushAll();
  await tap(screen.getByLabelText('Start stopera serii'));
  expect(timer.S.on).toBe(true); timer.S.startAt -= 200e3; // „telefon zablokowany” przez 200 s
  await tap(screen.getByLabelText(/^Seria 1 zrobiona/));
  await flushAll(10);
  expect(timer.S.on).toBe(false); expect(a.exercises[0].sets[0].durationSec).toBe(60); expect(a.exercises[0].sets[0].done).toBe(true);
});

test('B7 superset: po pierwszym ćwiczeniu brak przerwy, po drugim jest', async () => {
  await renderApp();
  store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addExerciseToActive(ex('Pull Up')); await flushAll();
  await tap(screen.getByLabelText('Połącz z następnym w superset'));
  await tap(screen.getAllByLabelText(/^Seria 1 zrobiona/)[0]); expect(timer.T.on).toBe(false);
  await tap(screen.getAllByLabelText(/^Seria 1 zrobiona/)[1]); expect(timer.T.on).toBe(true);
});

test('B8 zakończenie z rekordem: alert i te same PR w historii', async () => {
  await renderApp({ saved: seedWithDemo() }); /* runda 72: pierwsza sesja ćwiczenia nie jest rekordem — wcześniejsza, lżejsza sesja */
  { const st = store.getState(); const tpl = st.templates.find(x => x.name === 'Upper A')!; const e0 = store.exById(tpl.items[0].exerciseId)!; await act(async () => { addWorkout(Date.now() - 86400e3, [[e0.name, [{ weight: 20, reps: 8 }]]]); }); }
  await startTemplate('Upper A');
  const a = store.getState().active!; a.exercises[0].sets.forEach(s => { s.weight = 24; s.reps = 8; }); store.save(a); await flushAll();
  for (let i = 0; i < 2; i++) await tap(screen.getAllByLabelText(new RegExp(`^Seria ${i + 1} zrobiona`))[0]);
  await finishConfirmed();
  const alert = global.__alerts.find(x => /rekord/i.test(x.title)); expect(alert).toBeTruthy();
  expect(await screen.findAllByText(/^PR:/)).toHaveLength(1); // drugi identyczny zestaw nie jest rekordem
});

test('B9 zakończenie bez serii → odrzucenie, bez pustej sesji', async () => {
  await renderApp({ saved: seedWithDemo() }); await startTemplate('Upper A');
  await tap(screen.getAllByText('Zakończ trening i zapisz')[0]);
  pressAlert('Brak odhaczonych serii', 'Odrzuć trening'); await flushAll();
  expect(store.getState().active).toBeNull(); expect(store.getState().workouts).toHaveLength(0);
});

test('B10 edytor szablonu: „+ seria / − seria” (05.10.2026: serie jako wiersze, dawne pole „serie”), potwierdzenie usunięcia', async () => {
  await renderApp({ saved: seedWithDemo() }); const tpl = store.getState().templates[0];
  await go(`/template/${tpl.id}`); await screen.findByText('Duplikuj'); await startEdit(); await openCard(0); /* edycja na żądanie (decyzja właściciela 08.10.2026): „Edytuj” → szkic → „Zapisz” */
  const d = tplDraft(tpl.id); const n0 = d.items[0].sets;
  await tap(screen.getAllByText('+ seria')[0]); expect(d.items[0].sets).toBe(n0 + 1);
  /* 07.10.2026 wieczór: „− seria” i przycisk usuwania zastąpione przesunięciem w lewo (z potwierdzeniem) */
  await swipeDelete(new RegExp(`^Usuń serię ${n0 + 1} — `)); expect(d.items[0].sets).toBe(n0 + 1); pressAlert('Usunąć serię?', 'Usuń'); await flushAll(); expect(d.items[0].sets).toBe(n0);
  const n = d.items.length;
  await swipeDelete(/^Usuń ćwiczenie: /); expect(d.items.length).toBe(n);
  pressAlert('Usunąć z szablonu?', 'Usuń'); await flushAll(); expect(d.items.length).toBe(n - 1); expect(tpl.items.length).toBe(n); /* dane bez zmian do „Zapisz” */
  await saveEdit(); expect(tpl.items.length).toBe(n - 1);
});

test('B11 usunięcie ćwiczenia z historią: znika z listy, historia zna nazwę', async () => {
  await renderApp(); const e = ex('Back Squat'); const t0 = Date.now() - 86400e3;
  store.getState().workouts.push({ id: 'h1', ownerId: 'local', createdAt: t0, updatedAt: t0, loggedBy: 'local', sessionMode: 'solo', healthUUID: null, templateId: null, templateName: 'Nogi', startedAt: t0, finishedAt: t0 + 1, note: '', exercises: [{ id: 'x', exerciseId: e.id, restSec: 90, repMin: null, repMax: null, groupId: null, sets: [{ id: 's', weight: 100, reps: 5, durationSec: '', distanceM: '', rpe: '', bandId: '', addKg: '', kind: 'normal', warmup: false, note: '', done: true, completedAt: t0, actualRest: null }] }] });
  store.deleteExercise(e.id);
  await go('/history/h1'); expect(await screen.findByText('Back Squat')).toBeTruthy(); expect(screen.getByText(/500 kg/)).toBeTruthy();
});

test('B12 ustawienia: przełącznik po jednym tapnięciu, English, funty', async () => {
  await renderApp(); await go('/more/settings'); await screen.findByText('Język');
  const rpe = screen.getByLabelText('RPE / RIR przy serii'); expect(rpe.props.accessibilityState.checked).toBe(false); /* P-002: przełącznik iOS */
  await act(async () => { require('@testing-library/react-native').fireEvent(rpe, 'valueChange', true); }); expect(store.getState().settings.showRpe).toBe(true); expect(screen.getByLabelText('RPE / RIR przy serii').props.accessibilityState.checked).toBe(true);
  await tap(screen.getByText('lb')); expect(store.getState().settings.unit).toBe('lb');
  await tap(screen.getByText('Język')); await flushAll(5); await tap(screen.getByText('English')); await flushAll(10); /* 05.10.2026: wybór języka na osobnej liście */ expect(await screen.findByText('Language')).toBeTruthy();
});

test('B13 gumy: pusty kolor nie wywraca treningu z gumą', async () => {
  await renderApp(); store.startEmpty(); store.addExerciseToActive(ex('Chin Up')); const a = store.getState().active!; const b = store.getState().bands[0];
  a.exercises[0].sets[0].bandId = b.id; b.color = ''; store.save(); await flushAll();
  expect(screen.getByLabelText(/Guma: \?, poziom 2/)).toBeTruthy();
});

/* B14 (poranny wpis) — ekran usunięty 05.10.2026 (decyzja właściciela); zachowanie po usunięciu: tests/morning-removed.test.tsx */

test('B15 reset danych zatrzymuje timery', async () => {
  await renderApp({ saved: seedWithDemo() }); await startTemplate('Upper A'); await tap(screen.getAllByLabelText(/^Seria 1 zrobiona/)[0]); expect(timer.T.on).toBe(true);
  await go('/more/settings'); await screen.findByText('Wyczyść wszystkie dane');
  await tap(screen.getByText('Wyczyść wszystkie dane')); pressAlert('Wyczyścić wszystkie dane?', 'Wyczyść'); await flushAll(10);
  expect(timer.T.on).toBe(false); expect(store.getState().active).toBeNull();
});

test('B16 powtórz ostatni pomija usunięte ćwiczenia', async () => {
  await renderApp(); const t0 = Date.now() - 86400e3; const a = ex('Back Squat'), b = ex('Pull Up');
  const mk = (id: string, exId: string) => ({ id, exerciseId: exId, restSec: 90, repMin: null, repMax: null, groupId: null, sets: [{ id: id + 's', weight: 100, reps: 5, durationSec: '' as const, distanceM: '' as const, rpe: '' as const, bandId: '', addKg: '' as const, kind: 'normal' as const, warmup: false, note: '', done: true, completedAt: t0, actualRest: null }] });
  store.getState().workouts.push({ id: 'r1', ownerId: 'local', createdAt: t0, updatedAt: t0, loggedBy: 'local', sessionMode: 'solo', healthUUID: null, templateId: null, templateName: 'Wolny', startedAt: t0, finishedAt: t0 + 1, note: '', exercises: [mk('1', a.id), mk('2', b.id)] });
  store.deleteExercise(b.id); store.repeatLast();
  expect(store.getState().active!.exercises.map(e => e.exerciseId)).toEqual([a.id]);
});
