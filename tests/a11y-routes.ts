/*
 * Stan z danymi i trasy przeglądu dostępności — wspólne dla matrix-a11y (pl/en: nazwy, role, kontrast, Dynamic Type) i audit-0.10-lang-ui
 * (audyt kontrolny 1 A11N-01: accessibilityLanguage na wszystkich trasach w języku innym niż pl/en). Wydzielone z tests/matrix-a11y.test.tsx.
 */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import * as locations from '@/lib/locations';
import { fresh, seedWithDemo } from './helpers';

/** Stan z danymi: zakończona sesja (2 serie), trening w toku z tego samego szablonu (1 seria odhaczona). */
export async function richState(l: 'pl' | 'en') {
  await fresh(seedWithDemo(l), l);
  const S = store.getState(); const tpl = S.templates[0];
  /* audyt 0.10 (A11-10, TST-03): miejsce treningu i plan tygodnia — nowe ekrany (szczegóły miejsca, plan, kalendarz z planem) z danymi */
  const loc = locations.addLocation('gym'); for (let i = 0; i < 7; i += 2) plan.setWeekDay(i, tpl.id);
  store.startFromTemplate(tpl); store.toggleDone(0, 0); store.toggleDone(0, 1);
  const w = store.finishWorkout(Date.now())!;
  store.startFromTemplate(tpl); store.toggleDone(0, 0);
  return { s: JSON.parse(JSON.stringify(store.getState())), w, tpl, exId: S.exercises[0].id, locId: loc.id, blockId: store.getState().active!.exercises[0].id };
}
/** Trasy przeglądu. Audyt 0.10 (A11-10): także ekrany 0.10 — plan, generator, przewodnik, zamiana, wybór ćwiczenia, kolejność, trening wstecz,
 * szczegóły miejsca (dashboard bez treningu w toku: osobny przegląd niżej). Indeks 13 = szczegóły sesji (test kroju mono niżej). */
export const routesFor = (w: { id: string }, tpl: { id: string }, exId: string, locId: string, blockId: string) => [
  '/', '/templates', '/exercises', '/history', '/more', '/more/settings', '/more/progress', '/more/locations', '/more/backup', '/more/language', '/more/bands',
  `/template/${tpl.id}`, `/exercise/${exId}`, `/history/${w.id}`, `/history/edit/${w.id}`,
  '/plan', '/generator', '/guide', `/swap?target=active:${blockId}`, '/picker?target=active', '/reorder?target=active', '/history/add', `/more/location/${locId}`,
  '/more/bodymass', '/more/about', '/more/licenses', /* audyt 0.10 fala 2: masa ciała z datą, O aplikacji, licencje (SEC-08) */
];
