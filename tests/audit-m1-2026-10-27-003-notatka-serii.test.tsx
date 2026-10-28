/*
 * M1-audytor-generalny-003 (audyt 1.0, 27.10.2026; 05-architekt-001): notatka serii z importu CSV (do 500 znaków) była ucinana do 300 przy „Zapisz”
 * w oknie notatki (edycja historii i trening w toku) — cicha utrata tekstu. Jedna stała długości notatki serii dla importu i obu okien.
 * Rodzaje (docs/20): dane (długość zapisanego tekstu przed i po), scenariusz (edycja sesji z historii), strażnik (bez literału długości w ekranach), regresja.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as store from '@/lib/store';
import { IMPORT_NOTE_MAX, note as importNote } from '@/lib/csvcore';
import { SET_NOTE_MAX } from '@/lib/state/util';
import { fresh, addWorkout, pressAlert, saved } from './helpers';
import { renderApp, flushAll, screen, go, tap, act } from './app';

const LONG = 'n'.repeat(449) + 'K'; /* 450 znaków, ostatni rozpoznawalny */
const sheet = async (i: number) => { await act(async () => { (global as any).__pickSheet(i); }); await flushAll(5); };

describe('M1-003: notatka serii — jedna stała długości', () => {
  test('import i oba okna używają tej samej stałej (500); import zachowuje 450 znaków', () => {
    expect(SET_NOTE_MAX).toBe(IMPORT_NOTE_MAX); expect(SET_NOTE_MAX).toBe(500); expect(importNote(LONG)).toBe(LONG);
  });
  test('strażnik: w ekranach i komponentach notatka serii nie jest przycinana liczbą wpisaną na sztywno', () => {
    for (const f of ['app/history/edit/[id].tsx', 'components/WorkoutBlocks.tsx']) {
      const src = fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
      expect([f, /set\.note = clampName\([^)]*\)\s*,\s*\d+\)/.test(src)]).toEqual([f, false]);
      expect([f, src.includes('SET_NOTE_MAX')]).toEqual([f, true]);
    }
  });
  test('scenariusz: seria z notatką 450 znaków (jak po imporcie) → Historia → Edytuj → „Edytuj notatkę” → „Zapisz” bez zmian → „Zapisz sesję” → 450 znaków', async () => {
    await fresh(); const w = addWorkout(Date.now() - 86400e3, [['Back Squat', [{ weight: 100, reps: 5, done: true, note: LONG }]]], 'Import');
    store.save(); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await go(`/history/edit/${w.id}`); await flushAll(20);
    await tap(screen.getAllByLabelText(/^Seria 1, typ: /)[0]); expect((global as any).__sheets.at(-1).opts.options[4]).toBe('Edytuj notatkę');
    await sheet(4); await act(async () => { pressAlert('Notatka do serii', 'Zapisz', LONG); }); await flushAll(5);
    await tap(screen.getByLabelText('Zapisz sesję')); await flushAll(20);
    const after = store.getState().workouts.find(x => x.id === w.id)!.exercises[0].sets[0].note;
    expect(after.length).toBe(450); expect(after.endsWith('K')).toBe(true);
  });
});
