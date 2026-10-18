/*
 * Dane pokazowe do zrzutów App Store (workflow store-screenshots.yml; scenorys zaakceptowany przez właściciela 14.10.2026 — docs/41, C1).
 * Uruchamiane tylko jawnie: STORE_SEED_OUT=<katalog> npx jest --testMatch "**\/scripts/screens/store-seed.test.ts" (poza zwykłym `jest`).
 * Wynik dla każdego języka aplikacji:
 *   state-<język>-<wariant>.json — stan aplikacji (klucz „state” w SQLite); warianty: trening (trening w toku, przerwa), adapt (trening w toku
 *     w domu — okno „Dostosuj”), jasny i ciemny (bez treningu w toku); od 18.10.2026 (decyzja właściciela) wszystkie warianty w ciemnym motywie,
 *     chyba że STORE_SEED_THEME=light;
 *   routes-<język>.json — 9 ekranów w kolejności scenorysu: [nazwa, ścieżka expo-router, wariant, akcja Maestro albo ''];
 *   trening-historia.csv — zmyślony plik CSV (format z popularnych dzienników) do podglądu importu.
 * Dane są zmyślone (wytyczne Apple 2.3.9). Ciężary i powtórzenia to przykład wpisów użytkownika, nie zalecenie (bez liczb merytorycznych).
 * Pole `__sklepSavedAt` (chwila zapisu danych): skrypt zrzutów przesuwa o czas od zapisu czasy treningu w toku i przerwy (scripts/ci/store-screenshots.sh) i je usuwa.
 */
import * as store from '@/lib/store';
import * as loc from '@/lib/locations';
import { LANGS, type Lang } from '@/lib/i18n';
import { base, uid, type Workout, type Template, type TemplateItem, type State } from '@/lib/seed';
import { localISODate } from '@/lib/state/time';
import { fresh, set } from '../../tests/helpers';

const DAY = 86400e3;
const WEEKS = 12;
/** [nazwa kanoniczna z biblioteki, serie (wcześniej → ostatnie 6 tygodni), powtórzenia, ciężar na start → na koniec 12 tygodni, krok, przerwa s] */
type Row = [string, [number, number], number, [number, number], number, number];
const TPL: { key: 'push' | 'pull' | 'legs' | 'fbw'; name: { pl: string; en: string }; rows: Row[] }[] = [
  { key: 'push', name: { pl: 'Push', en: 'Push' }, rows: [['Bench Press (sztanga)', [3, 4], 5, [60, 75], 2.5, 180], ['Overhead Press (sztanga)', [3, 4], 6, [37.5, 45], 2.5, 150], ['Incline Bench Press (hantle)', [3, 3], 10, [20, 26], 2, 120], ['Lateral Raise (hantle)', [3, 3], 12, [8, 10], 1, 60], ['Triceps Pushdown', [3, 3], 12, [25, 32.5], 2.5, 60]] },
  { key: 'pull', name: { pl: 'Pull', en: 'Pull' }, rows: [['Deadlift (sztanga)', [3, 4], 5, [100, 125], 2.5, 180], ['Pull Up', [3, 4], 8, [0, 0], 0, 120], ['Bent Over Row (sztanga)', [3, 4], 8, [55, 67.5], 2.5, 120], ['Lat Pulldown', [3, 3], 10, [50, 60], 2.5, 90], ['Biceps Curl (hantle)', [3, 3], 12, [12, 15], 1, 60]] },
  { key: 'legs', name: { pl: 'Nogi', en: 'Legs' }, rows: [['Back Squat', [3, 4], 5, [80, 97.5], 2.5, 180], ['Leg Press', [3, 4], 10, [140, 180], 5, 120], ['Leg Curl', [3, 3], 12, [35, 45], 2.5, 90], ['Lunges (hantle)', [3, 3], 10, [16, 20], 2, 90], ['Calf Raise (sztanga)', [3, 3], 15, [60, 75], 2.5, 60]] },
  { key: 'fbw', name: { pl: 'FBW', en: 'Full body' }, rows: [['Front Squat', [3, 3], 6, [60, 62.5], 2.5, 150], ['Incline Bench Press (sztanga)', [3, 3], 8, [50, 52.5], 2.5, 120], ['Seated Cable Row', [3, 3], 10, [55, 60], 2.5, 90], ['Overhead Press (hantle)', [3, 3], 10, [16, 18], 2, 90]] },
];
const exByName = (n: string) => { const e = store.getState().exercises.find(x => x.name === n); if (!e) throw new Error('brak ćwiczenia ' + n); return e; };
const round = (v: number, step: number) => (step ? Math.round(v / step) * step : 0);

/** Ekrany w kolejności scenorysu (zmiana właściciela 14.10.2026: 9 ekranów, „Dostosuj” jako 5.). */
function routes(squatId: string): [string, string, string, string][] {
  return [
    ['trening', '/', 'trening', ''],
    ['postepy-cwiczenia', '/progress?ex=' + squatId, 'jasny', 'e1rm'],
    ['straznik', '/progress?s=guard', 'ciemny', 'przewin'],
    ['plan', '/plan', 'jasny', ''],
    ['dostosuj', '/adapt', 'adapt', ''],
    ['progresja', '/progression?c=month', 'jasny', ''],
    ['historia', '/history', 'ciemny', 'poprzedni-miesiac'],
    ['szablony', '/templates', 'jasny', ''],
    ['import', '/more/import', 'jasny', 'import'],
  ];
}

/** Zmyślona historia z innego dziennika (format A: jeden wiersz = seria) — 142 treningi przed historią w aplikacji (bez duplikatów). */
export function demoCsv(now: number, n = 142): string {
  const head = 'Date,Workout Name,Duration,Exercise Name,Set Order,Weight,Reps,Distance,Seconds,Notes,Workout Notes,RPE';
  const days: [string, [string, number, number][]][] = [
    ['Upper', [['Bench Press (Barbell)', 55, 6], ['Bent Over Row (Barbell)', 50, 8], ['Overhead Press (Barbell)', 32.5, 8]]],
    ['Lower', [['Squat (Barbell)', 70, 6], ['Deadlift (Barbell)', 90, 5], ['Leg Curl (Machine)', 30, 12]]],
  ];
  const start = new Date(now - (WEEKS * 7 + 7 + Math.ceil(n / 3) * 7) * DAY); start.setHours(18, 0, 0, 0);
  const out = [head]; const pad = (x: number) => String(x).padStart(2, '0');
  for (let i = 0; i < n; i++) {
    const d = new Date(start.getTime() + (Math.floor(i / 3) * 7 + [0, 2, 4][i % 3]) * DAY); const [name, exs] = days[i % 2];
    const ds = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} 18:${pad(5 + (i % 4) * 10)}:00`;
    for (const [ex, w, r] of exs) for (let s = 1; s <= 3; s++) out.push([ds, name, '1h 2m', ex, s, round(w + i * 0.12, 2.5), r, '', '', '', '', ''].join(','));
  }
  return out.join('\n') + '\n';
}

function workout(tpl: Template, rows: Row[], at: number, idx: number, total: number, late: boolean): Workout {
  const exercises = tpl.items.map((it, k) => {
    const [, sets, reps, [w0, w1], step] = rows[k]; const w = w1 > 0 ? round(w0 + ((w1 - w0) * idx) / Math.max(1, total - 1), step) : '';
    const n = late ? sets[1] : sets[0];
    return { id: uid(), exerciseId: it.exerciseId, restSec: it.restSec, repMin: it.repMin, repMax: it.repMax, groupId: null,
      sets: Array.from({ length: n }, (_, i) => set({ weight: w, reps: i === n - 1 && reps >= 8 ? reps - 1 : reps, rpe: i === n - 1 ? 8 : '', completedAt: at + (k * 5 + i) * 170e3 })) };
  });
  return { id: `w-${tpl.id}-${at}`, ownerId: 'local', createdAt: at, updatedAt: at, loggedBy: 'local', sessionMode: 'solo', healthUUID: null, templateId: tpl.id,
    templateName: tpl.name, startedAt: at, finishedAt: at + (52 + (idx % 4) * 4) * 60e3, note: '', exercises } as Workout;
}

/** Stan dla jednego języka: szablony, 12 tygodni historii (pon/śr/pt), plan Push/Pull/Nogi z dniami wolnymi, miejsca, masa ciała. */
async function build(lng: Lang, now: number) {
  await fresh(); const st = store.getState(); const nm = lng === 'pl' ? 'pl' : 'en';
  st.settings.language = lng; st.settings.showRpe = true; st.settings.workoutView = 'focus';
  const gym = loc.addLocation('gym', nm === 'pl' ? 'Siłownia' : 'Gym'); const home = loc.addLocation('home', nm === 'pl' ? 'Dom' : 'Home');
  for (const it of ['db_fixed', 'bench_adj']) loc.setEquip(home, it, true);
  st.settings.mainLocationId = gym.id;
  const tpls: Record<string, Template> = {};
  for (const t of TPL) {
    /* ciężar startowy szablonu = krok wyżej niż ostatnia sesja (zaplanowane w tym tygodniu idzie dalej w górę — strażnik pokazuje „więcej”) */
    const items: TemplateItem[] = t.rows.map(([n, sets, reps, [, w1], step, rest]) => ({ id: uid(), exerciseId: exByName(n).id, sets: sets[1], repMin: reps, repMax: reps, restSec: rest, startWeight: w1 > 0 ? w1 + step : '', targetSec: '', groupId: null }));
    tpls[t.key] = { ...base(), name: t.name[nm], items } as Template; st.templates.push(tpls[t.key]);
  }
  /* historia: pon (Push), śr (Pull), pt (Nogi) przez 12 tygodni do wczoraj; godziny 17:30–19:00 */
  const today = new Date(now); today.setHours(0, 0, 0, 0); const mon = new Date(today.getTime() - ((today.getDay() + 6) % 7) * DAY);
  /* w ostatnich 3 tygodniach dochodzi sobotni FBW, a od początku bieżącego miesiąca więcej serii — „ten miesiąc” wyraźnie wyżej w Progresji */
  const slots: { key: 'push' | 'pull' | 'legs' | 'fbw'; at: number }[] = [];
  for (let w = WEEKS - 1; w >= 0; w--) for (const [key, dd] of [['push', 0], ['pull', 2], ['legs', 4], ['fbw', 5]] as const) {
    if (key === 'fbw' && w > 2) continue;
    const at = mon.getTime() - w * 7 * DAY + dd * DAY + (key === 'fbw' ? 10 : 17.5 + ((w + dd) % 4) * 0.5) * 3600e3; if (at < today.getTime()) slots.push({ key, at });
  }
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
  for (const key of ['push', 'pull', 'legs', 'fbw'] as const) {
    const mine = slots.filter(s => s.key === key); const rows = TPL.find(t => t.key === key)!.rows;
    mine.forEach((s, i) => st.workouts.push(workout(tpls[key], rows, s.at, i, mine.length, s.at >= monthStart)));
  }
  st.workouts.sort((a, b) => a.startedAt - b.startedAt);
  /* plan tygodnia od początku historii: pon Push, śr Pull, pt Nogi, reszta wolne */
  const days = [tpls.push.id, null, tpls.pull.id, null, tpls.legs.id, null, null];
  st.weekPlan = { days, name: lng === 'pl' ? 'Push / Pull / Nogi' : 'Push / Pull / Legs' };
  st.planHistory = [{ from: localISODate(new Date(mon.getTime() - (WEEKS - 1) * 7 * DAY)), days }];
  /* masa ciała co 2 tygodnie (zmyślona) — Postępy bez „nie podano” */
  st.bodyMassLog = Array.from({ length: 6 }, (_, i) => ({ id: uid(), date: localISODate(new Date(now - (10 - i * 2) * 7 * DAY)), kg: 82 - i * 0.4 } as never));
  st.whatsNewSeen = (require('@/lib/whatsnew') as typeof import('@/lib/whatsnew')).WHATS_NEW[0].id;
  st.guideSeen = (require('@/lib/guide') as typeof import('@/lib/guide')).GUIDE.map(g => g.id);
  /* podpowiedź deloadu „Nie teraz” (zmyślony użytkownik już ją odłożył) — bez ramki z podpowiedzią nad kalendarzem */
  const dh = (require('@/lib/deload') as typeof import('@/lib/deload')).deloadHint(now); if (dh.kind === 'suggest') st.deloadSnooze = dh.from;
  store.save(); await store.flush();
  /* własny cel serii (Ustawienia → cel na partię) dla małych partii, których plan PPL nie dobija do celu automatycznego — wybór zmyślonego użytkownika,
   * żeby sekcja strażnika pokazywała partie na celu; tylko wartości w danych pokazowych, bez zmiany automatu w aplikacji */
  const g = (require('@/lib/guard') as typeof import('@/lib/guard')).guardCached(now);
  st.settings.weeklySetGoals = Object.fromEntries(g.below.map(p => [p.part, Math.max(1, Math.floor(p.total))]));
  store.save(); await store.flush();
  return { st, tpls, gym, home, squat: exByName('Back Squat') };
}

const snap = (extra: Record<string, unknown> = {}) => JSON.stringify({ ...JSON.parse(JSON.stringify(store.getState())), ...extra });

test('dane pokazowe do zrzutów App Store (wszystkie języki aplikacji, 4 warianty)', async () => {
  const out = process.env.STORE_SEED_OUT; if (!out) return; /* bez katalogu wyjściowego nic nie zapisujemy (np. przypadkowe uruchomienie) */
  const fs = require('fs') as typeof import('fs'); const path = require('path') as typeof import('path'); fs.mkdirSync(out, { recursive: true });
  const now = Date.now();
  for (const lng of LANGS as readonly Lang[]) {
    const { st, tpls, gym, home, squat } = await build(lng, now);
    /* decyzja właściciela 18.10.2026: wszystkie zrzuty w ciemnej wersji aplikacji (STORE_SEED_THEME=light — wariant jasny tylko na żądanie) */
    const base = process.env.STORE_SEED_THEME === 'light' ? 'light' : 'dark'; st.settings.theme = base;
    fs.writeFileSync(path.join(out, `state-${lng}-jasny.json`), snap());
    st.settings.theme = 'dark'; fs.writeFileSync(path.join(out, `state-${lng}-ciemny.json`), snap()); st.settings.theme = base;
    /* trening w toku: Nogi na siłowni, przysiad 100 kg × 5 (poprzednio 97,5 × 5), pierwsza seria odhaczona, przerwa trwa */
    store.startFromTemplate(tpls.legs); const a = st.active!; a.locationId = gym.id; a.startedAt = now - 9 * 60e3;
    const sq = a.exercises.find(e => e.exerciseId === squat.id)!;
    for (const s of sq.sets) { s.weight = 100; s.reps = 5; }
    sq.restSec = 240; /* przerwa 4:00 przy ciężkim przysiadzie — zapas na start aplikacji i okna systemowe przed zrzutem (przebieg 39155596330: przy 2:00 przerwa zdążyła minąć) */
    sq.sets[0].done = true; sq.sets[0].completedAt = now - 85e3;
    st.timer = { ...st.timer, restEndAt: now + 235e3, restTotal: 240, restSetId: sq.sets[0].id };
    store.save(); await store.flush();
    const tr = JSON.parse(snap({ __sklepSavedAt: now })) as State; /* skrypt przesuwa czasy o czas od zapisu: na zrzucie trening trwa ok. 9 min, przerwa ok. 1:30–2:00 z 4:00 (minus start i okna systemowe) */
    expect(tr.active?.exercises[0].sets[0].weight).toBe(100);
    fs.writeFileSync(path.join(out, `state-${lng}-trening.json`), JSON.stringify(tr));
    /* trening w domu (hantle + ławka): Push — okno „Dostosuj” z zamianami */
    st.active = null; st.timer = { ...st.timer, restEndAt: null, restSetId: null };
    store.startFromTemplate(tpls.push); st.active!.locationId = home.id; st.active!.startedAt = now - 2 * 60e3; store.save(); await store.flush();
    fs.writeFileSync(path.join(out, `state-${lng}-adapt.json`), snap({ __sklepSavedAt: now }));
    const r = routes(squat.id); expect(r).toHaveLength(9);
    fs.writeFileSync(path.join(out, `routes-${lng}.json`), JSON.stringify(r));
  }
  fs.writeFileSync(path.join(out, 'trening-historia.csv'), demoCsv(now));
}, 900e3);
