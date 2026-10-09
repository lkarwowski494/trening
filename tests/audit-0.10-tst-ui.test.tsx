/*
 * Audyt 0.10, fala 2 — obszar TESTY (docs/25 M5 / TST-05): elementy UI i komunikaty, które po zmianie bramki macierzy (dowód tylko z kodu
 * testu, bez komentarzy i tytułów) nie miały testu — tu każdy pokazuje się na prawdziwym ekranie, a naciśnięcie/wpis daje skutek w danych.
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { equipVisFor } from '@/lib/equipvis';
import { EquipVisual } from '@/components/EquipVisual';
import { PlateBar } from '@/components/PlateBar';
import { fresh, ex, addWorkout, pressAlert, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, go, tap, act, type, openCard, startEdit, saveEdit } from './app';

jest.setTimeout(60000);
afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
const S = () => store.getState();
const day = 86400e3;
const state = () => JSON.parse(JSON.stringify(S()));

describe('ekran treningu', () => {
  test('„↺ cofnij” przy zamienionym ćwiczeniu: widoczny po zamianie, naciśnięcie przywraca oryginał i chowa przycisk', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); await store.flush();
    await renderApp({ saved: state() }); await flushAll(20);
    expect(screen.queryByText('↺ cofnij')).toBeNull();
    await act(async () => { store.swapBlock(S().active!.exercises[0].id, ex('Bench Press (hantle)').id); }); await flushAll(5);
    await tap(screen.getByText('↺ cofnij')); await flushAll(10);
    expect(S().active!.exercises[0].exerciseId).toBe(ex('Bench Press (sztanga)').id); expect(screen.queryByText('↺ cofnij')).toBeNull();
  });

  test('„Nowy rekord!” — jeden rekord po treningu: tytuł okna w liczbie pojedynczej (więcej — „Nowe rekordy: n”)', async () => {
    await renderApp(); addWorkout(Date.now() - 2 * day, [['Plank', [{ durationSec: 30 }]]]);
    await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Plank')); const a = S().active!; a.exercises[0].sets = [a.exercises[0].sets[0]]; a.exercises[0].sets[0].durationSec = 45; store.save(a); });
    await flushAll(10); await act(async () => { store.toggleDone(0, 0); }); await flushAll(1000);
    await tap(screen.getAllByText('Zakończ trening i zapisz')[0]); pressAlert('Zakończyć trening?', 'Zakończ'); await flushAll(600);
    const titles = (global.__alerts as { title: string }[]).map(x => x.title).filter(x => /rekord/i.test(x));
    expect(titles).toEqual(['Nowy rekord!']);
  });

  test('grafika sprzętu: guma przy podciąganiu z asystą — „asysta gumą: …”; sztanga bez talerzy — „sam gryf”', async () => {
    await fresh(); const b = S().bands[0]; store.startEmpty(); store.addExerciseToActive(ex('Pull Up'));
    const a = S().active!; const e = a.exercises[0]; e.sets[0].bandId = b.id; e.sets[0].reps = 8;
    const vis = equipVisFor(a, e, e.sets[0]); const band = vis.find(v => v.kind === 'band');
    expect(band).toMatchObject({ kind: 'band', role: 'assist', level: b.level });
    const r = render(<>{vis.map((v, i) => <EquipVisual key={i} v={v} />)}</>);
    expect(r.getByLabelText(new RegExp(`^asysta gumą: `))).toBeTruthy();
    /* ta sama guma przy ćwiczeniu z oporem gumy (bez asysty) — „guma: …” */
    const r2 = render(<EquipVisual v={{ ...band!, role: 'resist' } as never} />); expect(r2.getByLabelText(/^guma: /)).toBeTruthy(); expect(r2.queryByLabelText(/^asysta gumą/)).toBeNull();
    const p = render(<PlateBar plan={{ unit: 'kg', base: 20, plates: [] }} />);
    expect(p.getByLabelText('Na każdą stronę: sam gryf')).toBeTruthy(); expect(p.getByText(/sam gryf/)).toBeTruthy();
    const p2 = render(<PlateBar plan={{ unit: 'kg', base: 20, plates: [10] }} />); expect(p2.queryByText(/sam gryf/)).toBeNull();
  });
});

describe('ekrany edycji i ustawień', () => {
  test('ćwiczenie: przerwa robocza bez własnej wartości — „domyślna …” w podglądzie; własna wartość — bez dopisku', async () => {
    await fresh(); const e = ex('Back Squat'); e.restSec = null; store.save(e); await store.flush();
    await renderApp({ saved: state() }); await go(`/exercise/${e.id}`); await flushAll(10);
    expect(screen.getAllByText(/^domyślna /).length).toBeGreaterThan(0);
    await act(async () => { const x = ex('Back Squat'); x.restSec = 150; store.save(x); }); await flushAll(10);
    expect(screen.queryAllByText(/^domyślna /)).toHaveLength(0);
  });

  test('szablon: pole „pow. od” po „+ zakres powtórzeń” — wpis zapisuje dolną granicę zakresu', async () => {
    await fresh(); const st = S(); st.templates.push({ id: 'tq', ownerId: 'local', createdAt: 1, updatedAt: 1, name: 'Q', items: [{ id: 'iq', exerciseId: ex('Bench Press (sztanga)').id, sets: 3, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null }] } as never); await store.flush();
    await renderApp({ saved: state() }); await go('/template/tq'); await flushAll(10); await startEdit(); await openCard(0);
    expect(screen.queryByText('pow. od')).toBeNull();
    await tap(screen.getByText('+ zakres powtórzeń')); await flushAll(5);
    expect(screen.getByText('pow. od')).toBeTruthy();
    await type(screen.getAllByLabelText(/^powtórzenia od — /)[0], '6'); await flushAll(5); await saveEdit();
    expect(S().templates.find(t => t.id === 'tq')!.items[0].repMin).toBe(6);
  });

  test('Ustawienia: „Widok treningu” — wybór „Lista” zapisuje widok i przeżywa restart', async () => {
    await fresh(); await renderApp({ saved: state() }); await go('/more/settings'); await flushAll(10);
    expect(screen.getAllByText('Widok treningu').length).toBeGreaterThan(0);
    await tap(screen.getByText('Lista')); await flushAll(5); expect(S().settings.workoutView).toBe('list');
    await store.flush(); store.__resetForTests(); await store.init(); expect(S().settings.workoutView).toBe('list');
  });

  test('trening wstecz: sekcja „Z szablonu” z szablonami; wybór szablonu otwiera edytor z jego ćwiczeniami', async () => {
    await fresh(); const [A] = withDemoTemplates(); await store.flush();
    await renderApp({ saved: state() }); await go('/history/add'); await flushAll(10);
    expect(screen.getByText('Z szablonu')).toBeTruthy();
    await tap(screen.getByText(A.name)); await flushAll(10);
    expect(screen.getAllByText(store.exById(A.items[0].exerciseId)!.name).length).toBeGreaterThan(0);
  });

  test('lista Ćwiczeń: chip „Podstawowe ✕” zdejmuje filtr („+ Podstawowe”) i wybór jest zapamiętany', async () => {
    await fresh(); await renderApp({ saved: state() }); await go('/exercises'); await flushAll(10);
    await tap(screen.getByText('Podstawowe ✕')); await flushAll(5);
    expect(screen.getByText('+ Podstawowe')).toBeTruthy(); expect(store.libShowAll()).toBe(true);
    await tap(screen.getByText('+ Podstawowe')); await flushAll(5); expect(screen.getByText('Podstawowe ✕')).toBeTruthy(); expect(store.libShowAll()).toBe(false);
  });

  test('Plan: zapisany plan bez nazwy (dane sprzed nazw z datą) — „Poprzedni plan” na liście i w oknie aktywacji', async () => {
    await fresh(); const [A] = withDemoTemplates(); const st = S(); st.savedPlans = [{ id: 'p0', name: '', days: [A.id, null, null, null, null, null, null] }]; store.save(); await store.flush();
    await renderApp({ saved: state() }); await go('/plan'); await flushAll(10);
    expect(S().savedPlans?.[0]?.name).toBe(''); /* migrate zostawia pustą nazwę (lib/store.ts: cleanPlanName) */
    expect(screen.getAllByText('Poprzedni plan').length).toBeGreaterThan(0);
    await tap(screen.getByLabelText('Ustaw jako aktywny: Poprzedni plan')); await flushAll(5);
    expect((global.__alerts as { title: string }[]).some(a => a.title === 'Ustawić „Poprzedni plan” jako aktywny plan?')).toBe(true);
  });
});

