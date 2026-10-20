/*
 * Partia 3 napraw M1: pokrycie macierzy dla funkcji i tekstu dodanych w zadaniach 024 (prefs „Pogrubiony tekst”), 035 (karta zgody na powiadomienia)
 * i 032 (nazwa okresu) — zachowanie, nie wzmianka nazwy.
 */
import React from 'react';
import { Text } from 'react-native';
import { render, act as rtlAct } from '@testing-library/react-native';
import { a11yPrefs, boldTextOn, setA11yPrefs, useA11yPrefs, __resetA11yPrefsForTests } from '@/lib/a11yPrefs';
import { restExplainDismissed, dismissRestExplain, requestRestNotificationPermission, __resetReminderAsk } from '@/lib/planReminder';

afterEach(() => { (global as any).__sysPrompt = undefined; __resetA11yPrefsForTests(); __resetReminderAsk(); (global as any).__notifPerm = undefined; (global as any).__notifPermReq = undefined; (global as any).__notifPermAsked = 0; });

describe('a11yPrefs: boldTextOn i useA11yPrefs', () => {
  test('boldTextOn zwraca ustawienie; useA11yPrefs odświeża komponent po zmianie w trakcie działania', () => {
    expect(boldTextOn()).toBe(false);
    const C = () => { const p = useA11yPrefs(); return <Text testID="v">{`${p.bold}/${p.contrast}`}</Text>; };
    const r = render(<C />); expect(r.getByTestId('v').props.children).toBe('false/false');
    rtlAct(() => { setA11yPrefs({ bold: true }); }); expect(boldTextOn()).toBe(true); expect(a11yPrefs().bold).toBe(true); expect(r.getByTestId('v').props.children).toBe('true/false');
    rtlAct(() => { setA11yPrefs({ contrast: true }); }); expect(r.getByTestId('v').props.children).toBe('true/true');
  });
});
describe('planReminder: karta wyjaśnienia przed zgodą', () => {
  test('restExplainDismissed / dismissRestExplain: „Nie teraz” chowa kartę do końca uruchomienia', () => {
    expect(restExplainDismissed()).toBe(false); dismissRestExplain(); expect(restExplainDismissed()).toBe(true);
  });
  test('requestRestNotificationPermission: prosi system o zgodę i zwraca stan po odpowiedzi (przyznana / odmowa)', async () => {
    (global as any).__notifPerm = { granted: false, canAskAgain: true, status: 'undetermined' }; (global as any).__sysPrompt = () => { (global as any).__notifPerm = { granted: true, status: 'granted' }; return (global as any).__notifPerm; };
    expect(await requestRestNotificationPermission()).toBe('granted'); expect((global as any).__notifPermAsked).toBe(1);
  });
  test('odmowa w oknie systemowym → „denied”', async () => {
    (global as any).__notifPerm = { granted: false, canAskAgain: false, status: 'denied' }; (global as any).__notifPermReq = { granted: false, canAskAgain: false, status: 'denied' };
    expect(await requestRestNotificationPermission()).toBe('denied');
  });
});
describe('MuscleRows: domyślne nazwy okresów', () => {
  test('bez `names`: „Ten okres” i „Poprzedni okres” przy każdym pasku (M1-032)', () => {
    const { MuscleRows } = require('@/components/ProgressBars'); const rows = [{ key: 'Klatka', label: 'Klatka', done: 1000, planned: 0, prev: 800, up: true }];
    const r = render(<MuscleRows rows={rows} metric="volume" />); expect(r.getAllByText('Ten okres', { exact: false }).length).toBeGreaterThan(0); expect(r.getAllByText('Poprzedni okres', { exact: false }).length).toBeGreaterThan(0);
  });
});
