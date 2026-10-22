/*
 * Zgłoszenie właściciela 22.10.2026 (docs/18): plan 7 dni ustawiony w czwartek, a pasek „postęp planu tygodnia” pokazuje „2 z 6” — dni przed zmianą
 * liczą się wg poprzedniego planu (audyt 0.10 A1, zamierzone). Decyzja właściciela (wariant A): dopisek pod paskiem tylko w tygodniu ze zmianą planu;
 * liczby i dane bez zmian. Rodzaje (docs/20): logika (planChangedInWeek, weekProgress), ekran (z dopiskiem / bez), języki (macierz), regresja liczb.
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { weekProgress } from '@/lib/motif';
import { WeekStacks } from '@/components/WeekStacks';
import { applyLang, LANGS, t } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';
import { fresh, withDemoTemplates, addWorkout } from './helpers';

const THU = new Date(2026, 9, 22, 12).getTime(); /* czwartek 22.10.2026; tydzień pon 19 … nd 25 */
const at = (k: string) => new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10), 18).getTime();
let A = '', B = '';
const doneOn = (k: string, tpl: string) => { const w = addWorkout(at(k), [['Back Squat', [{ weight: 100, reps: 5 }]]]); w.templateId = tpl; w.templateName = 'x'; store.save(w); };
/** Stan jak u właściciela: plan pon., śr., pt., nd. od poniedziałku (19.10), zrobione pon. i śr.; w czwartek plan na wszystkie 7 dni. */
async function ownerState() {
  jest.useFakeTimers({ now: new Date(2026, 9, 19, 9).getTime() }); await fresh(); [A, B] = withDemoTemplates().map(x => x.id);
  [0, 2, 4, 6].forEach(i => plan.setWeekDay(i, i === 2 ? B : A)); doneOn('2026-10-19', A); doneOn('2026-10-21', B); jest.setSystemTime(THU);
}
const week7 = () => [A, B, B, B, A, A, A].forEach((x, i) => plan.setWeekDay(i, x));
beforeEach(() => applyLang('pl'));
afterEach(() => applyLang('auto'));

describe('planChangedInWeek — czy plan zmieniono w bieżącym tygodniu', () => {
  test('odtworzenie zgłoszenia: przed zmianą 2 z 4 bez dopisku, po zmianie w czwartek 2 z 6 z dopiskiem (liczby bez zmian)', async () => {
    await ownerState(); expect(weekProgress()).toEqual({ done: 2, total: 4, pct: 50, stacks: [true, true, false, false] }); expect(plan.planChangedInWeek()).toBeNull();
    week7(); expect(weekProgress()).toEqual({ done: 2, total: 6, pct: 33, stacks: [true, true, false, false, false, false], changedOn: '2026-10-22' });
    expect(plan.planChangedInWeek()).toBe('2026-10-22');
  });
  test('zmiana w poniedziałek (cały tydzień wg nowego planu) — bez dopisku', async () => {
    await ownerState(); jest.setSystemTime(new Date(2026, 9, 26, 9).getTime()); /* pon. 26.10, nowy tydzień */ week7();
    expect(plan.planChangedInWeek()).toBeNull(); expect(weekProgress()!.changedOn).toBeUndefined();
  });
  test('następny tydzień po zmianie — dopisek znika', async () => {
    await ownerState(); week7(); jest.setSystemTime(new Date(2026, 9, 26, 9).getTime()); expect(plan.planChangedInWeek()).toBeNull();
  });
  test('pierwszy plan w życiu (brak poprzedniego) i poprzedni plan bez treningów — bez dopisku', async () => {
    jest.useFakeTimers({ now: THU }); await fresh(); [A, B] = withDemoTemplates().map(x => x.id); week7(); expect(plan.planChangedInWeek()).toBeNull();
    plan.deactivatePlan(); week7(); expect(plan.planChangedInWeek()).toBeNull();
  });
  test('kilka zmian w tygodniu — dzień ostatniej zmiany; bez planu historia nie daje dopisku', async () => {
    await ownerState(); jest.setSystemTime(new Date(2026, 9, 21, 20).getTime()); plan.setWeekDay(5, B); expect(plan.planChangedInWeek()).toBe('2026-10-21');
    jest.setSystemTime(THU); plan.setWeekDay(6, B); expect(plan.planChangedInWeek()).toBe('2026-10-22');
  });
});

describe('WeekStacks — dopisek o zmianie planu', () => {
  test('po zmianie w czwartek: dopisek „Plan zmieniony w czw. — …” w treści i w etykiecie VoiceOver; liczby jak wcześniej', async () => {
    await ownerState(); week7(); const r = render(<WeekStacks />);
    expect(r.getByText('33% planu tygodnia (2 z 6)')).toBeTruthy();
    expect(r.getByTestId('week-stacks-note').props.children).toBe('Plan zmieniony w czw. — wcześniejsze dni wg poprzedniego planu');
    expect(r.getByTestId('week-stacks').props.accessibilityLabel).toBe('Postęp tygodnia: 33% planu, zrobione 2 z 6 treningów z planu. Plan zmieniony w czw. — wcześniejsze dni wg poprzedniego planu');
  });
  test('bez zmiany planu w tym tygodniu: brak dopisku, etykieta jak dotąd', async () => {
    await ownerState(); const r = render(<WeekStacks />);
    expect(r.queryByTestId('week-stacks-note')).toBeNull(); expect(r.getByTestId('week-stacks').props.accessibilityLabel).toBe('Postęp tygodnia: 50% planu, zrobione 2 z 4 treningów z planu');
  });
  test('angielski: dzień z Intl, tekst ze słownika', async () => {
    await ownerState(); week7(); applyLang('en'); const r = render(<WeekStacks />);
    expect(r.getByTestId('week-stacks-note').props.children).toBe('Plan changed on Thu — earlier days follow the previous plan');
  });
});

describe('dopisek — macierz języków', () => {
  const KEY = 'Plan zmieniony w {day} — wcześniejsze dni wg poprzedniego planu';
  test.each(LANGS.filter(l => l !== 'pl'))('%s: tłumaczenie istnieje, ma {day},', l => {
    applyLang(l); const s = t(KEY, { day: 'X' }); expect(s).toContain('X'); expect(s).not.toContain('{day}');
    if (l !== 'en') { expect(LOCALES[l]?.[KEY]).toBeTruthy(); }
  });
});
