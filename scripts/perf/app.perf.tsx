/* Runda 73: pomiar wydajności na dużej historii — `npm run perf` (PERF_N=1000,5000). Wypisuje tabelę czasów w ms.
 * Czasy z Node na komputerze deweloperskim — telefon jest wolniejszy (rząd 2–5×); liczy się proporcja i trend między wersjami. */
import * as store from '@/lib/store';
import * as stats from '@/lib/stats';
import { fresh, ex } from '../../tests/helpers';
import { renderApp, flushAll, screen, type, act } from '../../tests/app';
import type { Workout, WSet } from '@/lib/seed';

const NS = (process.env.PERF_N ?? '1000,5000').split(',').map(Number) as number[];
/* zegar spoza Jesta — fałszywe timery (renderApp) podmieniają performance.now */
const realPerf = require('perf_hooks').performance; const now = () => realPerf.now();
/* Runda 74: minimum z kilku prób — średnia z jednej próby skakała o ±40 % między uruchomieniami (GC, JIT). */
const ms = (f: () => unknown, n = 1, tries = 5) => { let best = Infinity; for (let k = 0; k < tries; k++) { const t = now(); for (let i = 0; i < n; i++) f(); best = Math.min(best, (now() - t) / n); } return best; };
/** Zimny cache: przed każdą próbą zmiana historii (save) unieważnia cache. */
const cold = (f: () => unknown, tries = 5) => { let best = Infinity; for (let k = 0; k < tries; k++) { store.save(); const t = now(); f(); best = Math.min(best, now() - t); } return best; };
const rows: [number, number, string][] = [];
const note = (n: number, k: string, v: number) => { rows.push([n, Math.round(v * 10) / 10, k]); };

function build(n: number) {
  const st = store.getState(); const names = ['Back Squat', 'Bench Press (sztanga)', 'Bent Over Row (sztanga)', 'Pull Up', 'Plank', 'Bench Press (hantle)'];
  const ids = names.map(x => ex(x).id); const t0 = Date.now() - (n + 1) * 2 * 86400e3;
  for (let i = 0; i < n; i++) {
    const at = t0 + i * 2 * 86400e3;
    const sets = (k: number): WSet[] => Array.from({ length: 4 }, (_, j) => ({ id: `s${i}_${k}_${j}`, weight: k === 3 || k === 4 ? '' : 60 + (i % 40), reps: k === 4 ? '' : 5 + (j % 3), durationSec: k === 4 ? 45 + (i % 20) : '', distanceM: '', rpe: '', bandId: '', addKg: k === 3 ? (i % 10) : '', kind: 'normal', warmup: false, note: '', done: true, completedAt: at + (k * 4 + j) * 60e3, actualRest: 90 }) as WSet);
    const w: Workout = { id: `w${i}`, ownerId: 'local', createdAt: at, updatedAt: at, loggedBy: 'local', sessionMode: 'solo', healthUUID: null, templateId: null, templateName: 'Upper A', startedAt: at, finishedAt: at + 3600e3, note: '', exercises: ids.map((id, k) => ({ id: `e${i}_${k}`, exerciseId: id, restSec: 90, repMin: null, repMax: null, groupId: null, sets: sets(k) })) };
    st.workouts.push(w);
  }
  store.save();
}

test('wydajność', async () => {
  for (const n of NS) {
    jest.useRealTimers(); await fresh(); build(n); await store.flush();
    const raw = global.__kv.get('state')!; note(n, 'rozmiar stanu (MB)', raw.length / 1e6);
    note(n, 'JSON.stringify stanu', ms(() => JSON.stringify(store.getState()), 1, 3));
    note(n, 'start: JSON.parse', ms(() => JSON.parse(raw), 1, 3)); note(n, 'start: parse + migracja', ms(() => store.migrate(JSON.parse(raw)), 1, 3));
    note(n, 'start z szablonu (zimny cache)', ms(() => store.startFromTemplate(store.getState().templates[0]), 1, 1));
    const a = store.getState().active!; a.exercises.forEach((e, k) => { const s0 = e.sets[0]; if (s0) Object.assign(s0, { weight: 100, reps: 5, durationSec: 60, done: true, completedAt: Date.now() + k }); }); /* runda 74: odhaczone serie — prMap naprawdę liczy rekordy */
    note(n, 'prMap treningu w toku (zimny)', cold(() => stats.prMap(a)));
    note(n, 'prMap treningu w toku (ciepły)', ms(() => stats.prMap(a), 20));
    note(n, 'poprzednio ×6 ćwiczeń (ciepły)', ms(() => a.exercises.forEach(e => store.previousBlockFor(e.exerciseId, 0, 1, e.tplItemId, a.templateId)), 20));
    await store.flush(); let t = now(); a.exercises[0].sets[0].weight = 70; store.save(a); await store.flush(); note(n, 'zapis zmiany serii (klucz live)', now() - t);
    t = now(); store.getState().settings.defaultRest = 91; store.save(); await store.flush(); note(n, 'zapis pełny (zmiana poza treningiem)', now() - t);
    note(n, 'Postępy: sesje + rekordy (zimny)', cold(() => { stats.sessionsFor(ex('Back Squat')); stats.recordsFor(ex('Back Squat')); }));
    note(n, 'Postępy: sesje + rekordy (ciepły)', ms(() => { stats.sessionsFor(ex('Back Squat')); stats.recordsFor(ex('Back Squat')); }, 20));
    note(n, 'sumy tygodniowe (8 tyg.)', ms(() => stats.weeklyTotals(8), 5));
    note(n, 'historia: PR jednej sesji (zimny)', cold(() => stats.prMap(store.getState().workouts[n - 1]))); note(n, 'historia: PR innej sesji (ciepły)', ms(() => stats.prMap(store.getState().workouts[n >> 1]), 20));
    const saved = JSON.parse(JSON.stringify(store.getState()));
    t = now(); await renderApp({ saved }); await flushAll(50); note(n, 'start aplikacji + ekran treningu (render)', now() - t);
    const input = screen.queryAllByLabelText('kg')[0];
    if (input) { t = now(); for (let i = 0; i < 5; i++) await type(input, String(70 + i)); note(n, 'wpis znaku w pole serii (z renderem)', (now() - t) / 5); }
    const { router } = require('expo-router');
    t = now(); await act(async () => { router.push('/history'); }); await flushAll(50); note(n, 'zakładka Historia (render)', now() - t);
    t = now(); await act(async () => { router.push('/more/progress?ex=' + ex('Back Squat').id); }); await flushAll(50); note(n, 'Postępy ćwiczenia (render)', now() - t);
  }
  const keys = [...new Set(rows.map(r => r[2]))];
  console.log('\nms (Node)'.padEnd(50) + NS.map(n => String(n).padStart(9)).join('') + '\n' + keys.map(k => k.padEnd(48) + NS.map(n => String(rows.find(r => r[0] === n && r[2] === k)?.[1] ?? '—').padStart(9)).join('')).join('\n'));
});
