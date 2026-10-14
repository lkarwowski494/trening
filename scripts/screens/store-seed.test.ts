/*
 * Dane pokazowe do zrzutów ekranu App Store (workflow store-screenshots.yml, docs/41-droga-do-app-store.md).
 * Uruchamiane tylko jawnie: STORE_SEED_OUT=<katalog> npx jest --testMatch "**\/scripts/screens/store-seed.test.ts" (poza zwykłym `jest`).
 * Wynik: <katalog>/state-<język>.json (stan aplikacji tak, jak zapisuje go SQLite w kluczu „state”) i <katalog>/routes-<język>.json (ekrany do zrzutów).
 * Dane są zmyślone (wytyczne Apple 2.3.9: „display fictional account information instead of data from a real person”); szablony
 * demonstracyjne z tests/fixtures/demo-templates.ts (nazwy PL albo EN — to dane użytkownika, aplikacja ich nie tłumaczy).
 * Bez liczb merytorycznych: ciężary i powtórzenia to tylko przykład wpisów, nie zalecenie.
 */
import * as store from '@/lib/store';
import * as loc from '@/lib/locations';
import { LANGS, type Lang } from '@/lib/i18n';
import type { Workout, Template } from '@/lib/seed';
import { fresh, set, withDemoTemplates } from '../../tests/helpers';

const DAY = 86400e3;
/** Ekrany w kolejności zrzutów (nazwa pliku = numer + nazwa). Ścieżki expo-router; identyfikatory z wygenerowanych danych. */
function routes(benchId: string, lastId: string): [string, string][] {
  return [
    ['trening', '/'],
    ['plan', '/plan'],
    ['postepy-cwiczenia', '/progress?ex=' + benchId],
    ['progresja', '/progression'],
    ['historia', '/history'],
    ['sesja', '/history/' + lastId],
    ['szablony', '/templates'],
    ['technika', '/exercise/' + benchId],
  ];
}

/** Zakończony trening z szablonu: każda pozycja szablonu z liczbą serii z szablonu, ciężar rośnie co tydzień (tylko przykład wpisów). */
function workoutFrom(tpl: Template, at: number, week: number): Workout {
  const exercises = tpl.items.map((it, k) => {
    const e = store.getState().exercises.find(x => x.id === it.exerciseId)!;
    const w = Number(it.startWeight) > 0 ? Number(it.startWeight) + week * (Number(it.startWeight) >= 40 ? 2.5 : 1) : '';
    const reps = it.repMax ?? 8;
    return { id: `${tpl.id}-${at}-${k}`, exerciseId: e.id, restSec: it.restSec, repMin: it.repMin, repMax: it.repMax, groupId: null,
      sets: Array.from({ length: it.sets }, (_, i) => set({ weight: w, reps: i === it.sets - 1 && reps > 6 ? reps - 1 : reps, rpe: i === it.sets - 1 ? 8 : '', completedAt: at + (k * 6 + i) * 150e3 })) };
  });
  return { id: `w-${at}`, ownerId: 'local', createdAt: at, updatedAt: at, loggedBy: 'local', sessionMode: 'solo', healthUUID: null, templateId: tpl.id,
    templateName: tpl.name, startedAt: at, finishedAt: at + 55 * 60e3, note: '', exercises } as Workout;
}

test('dane pokazowe do zrzutów App Store (wszystkie języki aplikacji)', async () => {
  const out = process.env.STORE_SEED_OUT; if (!out) return; /* bez katalogu wyjściowego nic nie zapisujemy (np. przypadkowe uruchomienie) */
  const fs = require('fs') as typeof import('fs'); const path = require('path') as typeof import('path'); fs.mkdirSync(out, { recursive: true });
  const theme = process.env.STORE_SEED_THEME === 'dark' ? 'dark' : 'light';
  const now = Date.now(); let routeList: [string, string][] = [];
  for (const lng of LANGS as readonly Lang[]) {
    await fresh(); const tpls = withDemoTemplates(lng === 'pl' ? 'pl' : 'en'); const st = store.getState();
    st.settings.language = lng; st.settings.theme = theme; st.settings.showRpe = true;
    /* ok. 5 tygodni, 3 treningi w tygodniu (co 2–3 dni wstecz od wczoraj), szablony po kolei, od najstarszego */
    const back = [33, 31, 29, 26, 24, 22, 19, 17, 15, 12, 10, 8, 5, 3, 1];
    back.forEach((d, n) => st.workouts.push(workoutFrom(tpls[n % 3], now - d * DAY - 2 * 3600e3, Math.floor((33 - d) / 7))));
    const gym = loc.addLocation('gym'); const home = loc.addLocation('home');
    for (const it of ['bench_adj', 'pullup_bar', 'dip_bars', 'db_fixed']) { try { loc.setEquip(home, it, true); } catch { /* id spoza słownika — pomijamy */ } }
    st.settings.mainLocationId = gym.id;
    /* trening w toku: pierwszy szablon, dwie serie odhaczone — ekran „Trening” */
    store.startFromTemplate(tpls[0]); const a = st.active!; a.locationId = gym.id;
    for (const s of a.exercises[0].sets.slice(0, 2)) { s.done = true; s.completedAt = now - 60e3; }
    store.save(); await store.flush();
    const bench = st.exercises.find(e => e.id === tpls[0].items[0].exerciseId)!;
    const last = [...st.workouts].sort((x, y) => y.startedAt - x.startedAt)[0];
    routeList = routes(bench.id, last.id);
    const json = JSON.stringify(store.getState());
    expect(JSON.parse(json).settings.language).toBe(lng);
    fs.writeFileSync(path.join(out, `state-${lng}.json`), json);
    fs.writeFileSync(path.join(out, `routes-${lng}.json`), JSON.stringify(routeList)); /* identyfikatory są losowe w każdym przebiegu — ekrany osobno dla każdego języka */
  }
  expect(routeList.length).toBeLessThanOrEqual(10); /* App Store: najwyżej 10 zrzutów na rozmiar */
}, 600e3);
