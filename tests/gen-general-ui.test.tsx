/*
 * Generator: najpierw dni, potem cel; czwarty cel „Ogólny”; uwaga pod celem przy 1 dniu; przełącznik „Dni cardio w planie” (decyzje właściciela
 * 09.10.2026 wieczór, docs/18; podstawy docs/research/30-cel-ogolny.md) — ekran. Rodzaje (docs/20): ekran (kolejność dni → cel, 4 chipy celu aktywne
 * przy każdej liczbie dni, rola i stan dla VoiceOver), komunikaty (opis celu, uwaga pod celem w jednym miejscu — nie w podglądzie, punkty „Na czym to
 * oparte”, minuty cardio obok zalecenia WHO), przełącznik (widoczny tylko dla „Ogólny” przy 4–6 dniach, domyślnie wyłączony, zmienia dni cardio),
 * scenariusz zapis → restart (dane), 25 języków na 320 pt, EN. Logika: tests/gen-general.test.ts; E2E: .maestro/14-generator.yaml.
 */
import { fireEvent, within } from '@testing-library/react-native';
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { generate, type GenInput } from '@/lib/generator';
import { applyLang, lang, tIn, LANGS } from '@/lib/i18n';
import { fresh, saved } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';

jest.setTimeout(120000);
const NOW = new Date(2026, 9, 8, 9, 0);
const S = () => store.getState();
afterEach(() => { applyLang('pl'); });
const boot = async (url = '/generator', locale: 'pl' | 'en' = 'pl') => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale);
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
};
const restart = async (url: string) => { await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url }); jest.setSystemTime(NOW.getTime()); await flushAll(10); };
const lastAlert = (title: string) => [...global.__alerts].reverse().find(x => x.title === title);
const press = async (title: string, btn: string) => { const a = lastAlert(title)!; expect(a).toBeTruthy(); await act(async () => { a.buttons!.find(b => b.text === btn)!.onPress?.(); }); await flushAll(10); };
const day = (d: number) => screen.getByTestId(`day-${d}`);
const checkedDays = () => [0, 1, 2, 3, 4, 5, 6].filter(d => day(d).props.accessibilityState.checked);
const pickDays = async (ds: number[]) => { const cur = checkedDays(); for (let d = 0; d < 7; d++) if (cur.includes(d) !== ds.includes(d)) await tap(day(d)); await flushAll(5); };
const goal = async (label: string) => { await tap(screen.getByText(label)); await flushAll(5); };
const SW = 'sw-Dni cardio w planie';
const toggle = async (v: boolean) => { await act(async () => { fireEvent(screen.getByTestId(SW), 'valueChange', v); }); await flushAll(5); };
const inp = (o: Partial<GenInput> = {}): GenInput => ({ goal: 'general', locationId: null, sessions: 3, minutes: 60, ...o });
/** Kolejność elementów na ekranie: pozycja testID w drzewie (przechodzenie w głąb, od góry). */
const order = (...ids: string[]) => { const out: string[] = []; const walk = (n: unknown) => { if (!n || typeof n !== 'object') return; const x = n as { props?: { testID?: string }; children?: unknown[] }; if (x.props?.testID && ids.includes(x.props.testID)) out.push(x.props.testID); (x.children ?? []).forEach(walk); }; walk(screen.toJSON()); return out; };
const GOALS_PL = ['Siła', 'Masa', 'Redukcja', 'Ogólny'];
const ONEDAY_GEN = '1 dzień siłowy w tygodniu to mniej niż zalecenie WHO 2020 (co najmniej 2 dni). Na początek to dobry krok: wytyczne USA 2018 radzą zacząć od 1 dnia i z czasem dojść do 2 — trochę ruchu jest lepsze niż żaden.';
const ONEDAY = 'Jeden trening w tygodniu też daje postępy, ale zwykle trochę mniejsze niż częstszy trening — głównie dlatego, że w jednej sesji mieści się mniej serii. Przy tej samej liczbie serii w tygodniu różnica w przyroście mięśni znika, a w sile maleje.';
const GOAL_NOTE = 'Ogólny (dla zdrowia i sprawności): 2 serie na ćwiczenie, 8–12 powtórzeń (w domu 12–20), do chwili, gdy kolejne powtórzenie byłoby trudne. WHO 2020 zaleca ćwiczenia wzmacniające wszystkie główne partie co najmniej 2 dni w tygodniu.';
const WHO = (n: number) => `Cardio w planie: ${n} min tygodniowo. Zalecenie WHO: co najmniej 150–300 min umiarkowanego wysiłku tygodniowo (albo 75–150 min intensywnego); liczy się też umiarkowany ruch w ciągu dnia, np. szybki marsz, nawet krótki.`;

describe('kolejność i cele', () => {
  test('najpierw wybór dni, potem cel; 4 chipy celu (rola przycisku, stan wybrania, podpowiedź „Cel”), wszystkie aktywne przy 1–6 dniach', async () => {
    await boot();
    expect(order('day-picker', 'gen-goals')).toEqual(['day-picker', 'gen-goals']);
    for (const n of [1, 2, 3, 4, 5, 6]) {
      await pickDays([0, 1, 2, 3, 4, 5].slice(0, n));
      for (const g of GOALS_PL) { const b = screen.getByLabelText(g); expect([n, g, b.props.accessibilityRole, b.props.accessibilityHint, b.props.accessibilityState.disabled]).toEqual([n, g, 'button', 'Cel', false]); }
      await goal('Ogólny'); expect(screen.getByLabelText('Ogólny').props.accessibilityState.selected).toBe(true); expect(screen.queryByTestId('day-picker-range')).toBeNull(); expect(screen.getByText('Podgląd')).toBeTruthy();
      await goal('Masa'); expect(screen.getByLabelText('Ogólny').props.accessibilityState.selected).toBe(false);
    }
  });
  test('zmiana celu nie zmienia wybranych dni; „Ogólny” — opis celu z liczbami ze stałych i punkty „Na czym to oparte” dla zdrowia (bez RIR i boju)', async () => {
    await boot(); await pickDays([1, 3]); await goal('Ogólny'); expect(checkedDays()).toEqual([1, 3]);
    expect(screen.getByText(GOAL_NOTE)).toBeTruthy();
    for (const x of [/^• Serie: 2 na ćwiczenie — dla zdrowia zwykle 2–3 /, /^• Powtórzenia: 8–12 \(wytyczne USA 2018, ACSM 2011\); w domu i bez obciążenia 12–20/, /^• Wysiłek: do chwili, gdy kolejne powtórzenie byłoby trudne/, /^• Przerwy: 2 min po wielostawowych, 1,5 min po jednostawowych i core/, /^• Cardio: przy 4–6 dniach możesz zamienić dni powyżej 3/, /= 20; ćwiczeń = serie \/ 2 \(co najmniej 3\)/])
      expect([String(x), screen.queryAllByText(x).length]).toEqual([String(x), 1]);
    expect(screen.queryByText(/powtórzenia w zapasie/)).toBeNull(); expect(screen.queryByText(/boju głównego/)).toBeNull();
    expect(screen.getByText(WHO(0))).toBeTruthy(); /* minuty cardio w planie obok zalecenia WHO, także bez cardio */
    expect(screen.getByText(generate(inp({ days: [1, 3] })).days.map((ti, i) => (ti == null ? null : `${new Date(2024, 0, 1 + i).toLocaleDateString('pl-PL', { weekday: 'short' })} FBW`)).filter(Boolean).join(' · '))).toBeTruthy();
    expect(screen.getAllByText(/ — 2\s×\s8\D{1,3}12, przerwa /u).length).toBeGreaterThan(5); /* glue: spacje nierozdzielające (A11-19) */
    await goal('Masa'); expect(checkedDays()).toEqual([1, 3]); expect(screen.queryByText(GOAL_NOTE)).toBeNull(); expect(screen.queryByText(WHO(0))).toBeNull();
  });
});

describe('uwaga pod celem przy 1 dniu (jedno miejsce)', () => {
  test('każdy cel przy 1 dniu: uwaga pod celem (nie w podglądzie), tekst raz; „Ogólny” — zalecenie dla zdrowia; 2 dni — bez uwagi', async () => {
    await boot(); await pickDays([2]);
    for (const [g, txt] of [['Siła', ONEDAY], ['Masa', ONEDAY], ['Redukcja', ONEDAY], ['Ogólny', ONEDAY_GEN]] as const) {
      await goal(g); const note = screen.getByTestId('gen-day-note');
      expect([g, screen.getAllByText(txt).length]).toEqual([g, 1]); expect(within(note).getByText(txt)).toBeTruthy();
      expect(order('gen-goals', 'gen-day-note', 'gen-fbw')).toEqual(['gen-goals', 'gen-day-note', 'gen-fbw']); /* pod celem, przed podglądem */
      expect([g, screen.queryAllByText(g === 'Ogólny' ? ONEDAY : ONEDAY_GEN).length]).toEqual([g, 0]);
      expect(screen.getByText(/^Rzadziej niż 2 dni w tygodniu: /)).toBeTruthy(); /* lista partii zostaje w podglądzie */
    }
    await pickDays([2, 5]); expect(screen.queryByTestId('gen-day-note')).toBeNull(); expect(screen.queryByText(ONEDAY_GEN)).toBeNull();
    await pickDays([]); expect(screen.queryByTestId('gen-day-note')).toBeNull(); /* 0 dni — komunikat zakresu, bez uwagi */
  });
});

describe('przełącznik „Dni cardio w planie”', () => {
  test('tylko „Ogólny” przy 4–6 dniach, domyślnie wyłączony; włączony — dni powyżej 3 to cardio (etykieta dni, podgląd, minuty WHO); wyłączony — same dni siłowe', async () => {
    await boot(); await goal('Ogólny');
    for (const n of [1, 2, 3]) { await pickDays([0, 2, 4].slice(0, n)); expect([n, screen.queryByTestId(SW)]).toEqual([n, null]); }
    await pickDays([0, 1, 2, 4, 5]); const sw = screen.getByTestId(SW);
    expect([sw.props.value, sw.props.accessibilityRole, sw.props.accessibilityLabel, sw.props.accessibilityHint]).toEqual([false, 'switch', 'Dni cardio w planie', 'Dni powyżej 3 to sesje umiarkowanego cardio zamiast siłowych.']);
    expect(screen.getByText('Dni treningowe w tygodniu')).toBeTruthy(); expect(screen.queryByTestId('gen-cardio')).toBeNull(); expect(screen.getByText(WHO(0))).toBeTruthy();
    expect(screen.getByTestId('gen-upA')).toBeTruthy(); /* 5 dni bez cardio — góra/dół jak masa */
    await toggle(true); expect(screen.getByTestId(SW).props.value).toBe(true);
    expect(screen.getByText('Dni treningowe w tygodniu (w tym 2 cardio)')).toBeTruthy(); expect(screen.getByTestId('gen-cardio')).toBeTruthy(); expect(screen.getByTestId('gen-fbw')).toBeTruthy(); expect(screen.queryByTestId('gen-upA')).toBeNull();
    expect(screen.getByText(WHO(120))).toBeTruthy(); expect(checkedDays()).toEqual([0, 1, 2, 4, 5]);
    const r = generate(inp({ days: [0, 1, 2, 4, 5], cardio: true })); expect(r.backToBack).toEqual([]);
    expect(screen.getByText(r.days.map((ti, i) => (ti == null ? null : `${new Date(2024, 0, 1 + i).toLocaleDateString('pl-PL', { weekday: 'short' })} ${r.templates[ti].name}`)).filter(Boolean).join(' · '))).toBeTruthy();
    await pickDays([0, 1, 2, 3, 4, 5]); expect(screen.getByText('Dni treningowe w tygodniu (w tym 3 cardio)')).toBeTruthy(); expect(screen.getByText(WHO(180))).toBeTruthy();
    await pickDays([0, 2, 4]); expect(screen.queryByTestId(SW)).toBeNull(); expect(screen.getByText('Dni treningowe w tygodniu')).toBeTruthy(); expect(screen.queryByTestId('gen-cardio')).toBeNull(); /* 3 dni — bez przełącznika i bez cardio */
    await pickDays([0, 2, 4, 6]); await goal('Masa'); expect(screen.queryByTestId(SW)).toBeNull(); expect(screen.queryByTestId('gen-cardio')).toBeNull(); /* inny cel — przełącznik pomijany */
    await goal('Ogólny'); await toggle(false); expect(screen.queryByTestId('gen-cardio')).toBeNull(); expect(screen.getByText(WHO(0))).toBeTruthy();
  });
  test('scenariusz: Ogólny, 5 dni, cardio włączone → zapis „Ustaw jako aktywny” → plan: 3 × FBW + 2 × Cardio na wybranych dniach → restart — bez zmian', async () => {
    await boot(); await goal('Ogólny'); await pickDays([0, 1, 2, 4, 5]); await toggle(true);
    await tap(screen.getByText('Zapisz szablony i plan')); await flushAll(5); await press('Ustawić nowy plan jako aktywny?', 'Ustaw jako aktywny');
    expect(plan.planName()).toBe('Ogólny, 5× w tygodniu · Pełna siłownia');
    const days = plan.weekPlanDays(); const names = days.map(id => (id ? S().templates.find(x => x.id === id)!.name : null));
    expect(names.filter(Boolean).sort()).toEqual(['Cardio', 'Cardio', 'FBW', 'FBW', 'FBW']); expect(days.flatMap((x, d) => (x ? [d] : []))).toEqual([0, 1, 2, 4, 5]);
    expect(S().templates.find(x => x.name === 'FBW')!.note).toBe('Wysiłek: do chwili, gdy kolejne powtórzenie byłoby trudne; do upadku nie trzeba.');
    await restart('/plan'); expect(plan.weekPlanDays()).toEqual(days); expect(plan.planName()).toBe('Ogólny, 5× w tygodniu · Pełna siłownia');
  });
  test('EN: nazwa celu, opis, przełącznik, uwaga przy 1 dniu', async () => {
    await boot('/generator', 'en'); await goal('General fitness');
    expect(screen.getByText(/^General fitness \(for health\): 2 sets per exercise, 8–12 reps/)).toBeTruthy();
    await pickDays([0, 1, 2, 3]); expect(screen.getByTestId('sw-Cardio days in the plan').props.accessibilityHint).toBe('Days above 3 are moderate cardio sessions instead of strength.');
    await pickDays([3]); expect(screen.getByText(/^1 strength day a week is less than the WHO 2020 recommendation/)).toBeTruthy();
  });
});

/* każdy język z LANGS na ekranie 320 pt: „Ogólny”, 4 dni z włączonym przełącznikiem — chip celu, opis celu, przełącznik z opisem, punkty podstaw,
 * minuty cardio; 1 dzień — uwaga pod celem; bez tych tekstów po polsku (poza pl). Szerokości wyrazów: tests/matrix-i18n.test.tsx. */
describe('„Ogólny” — każdy język na 320 pt', () => {
  test.each([...LANGS])('%s', async l => {
    jest.useFakeTimers({ now: NOW }); await fresh(undefined, l === 'pl' ? 'pl' : 'en'); S().settings.language = l; store.save(); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: l === 'pl' ? 'pl' : 'en', url: '/generator', width: 320 }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
    expect(lang()).toBe(l);
    for (const g of ['Siła', 'Masa', 'Redukcja', 'Ogólny']) expect([l, g, screen.getAllByText(tIn(l, g)).length > 0]).toEqual([l, g, true]);
    await goal(tIn(l, 'Ogólny')); await pickDays([0, 1, 3, 5]);
    await act(async () => { fireEvent(screen.getByTestId(`sw-${tIn(l, 'Dni cardio w planie')}`), 'valueChange', true); }); await flushAll(5);
    const p = (s: string, v: Record<string, string | number>) => Object.entries(v).reduce((a, [k, x]) => a.split(`{${k}}`).join(String(x)), s);
    const texts = [
      p(tIn(l, 'Ogólny (dla zdrowia i sprawności): {s} serie na ćwiczenie, {a}–{b} powtórzeń (w domu {c}–{d}), do chwili, gdy kolejne powtórzenie byłoby trudne. WHO 2020 zaleca ćwiczenia wzmacniające wszystkie główne partie co najmniej {n} dni w tygodniu.'), { s: 2, a: 8, b: 12, c: 12, d: 20, n: 2 }),
      tIn(l, 'Dni cardio w planie'), p(tIn(l, 'Dni powyżej {k} to sesje umiarkowanego cardio zamiast siłowych.'), { k: 3 }),
      p(tIn(l, 'Dni treningowe w tygodniu (w tym {n} cardio)'), { n: 1 }),
      `• ${p(tIn(l, 'Serie: {s} na ćwiczenie — dla zdrowia zwykle {s}–{b} (wytyczne USA 2018, ACSM 2011, ACSM 2026: jedna seria działa, więcej zwykle trochę lepiej); {s} to dolna granica — uproszczenie.'), { s: 2, b: 3 })}`,
      `• ${p(tIn(l, 'Cardio: przy {k}–{m} dniach możesz zamienić dni powyżej {j} na sesje umiarkowanego cardio („Dni cardio w planie”, domyślnie wyłączone). WHO 2020 nie znalazło dowodów, że więcej ćwiczeń wzmacniających daje więcej korzyści dla zdrowia, a ruch aerobowy zalecenia radzą rozłożyć na kilka dni (wytyczne USA 2018, ACSM 2011). Długość sesji cardio = czas sesji — konwencja.'), { k: 4, m: 6, j: 3 })}`,
      `• ${tIn(l, 'Wysiłek: do chwili, gdy kolejne powtórzenie byłoby trudne — zmęczenie, ale nie wyczerpanie (WHO 2020: co najmniej umiarkowany; wytyczne USA 2018; ACSM 2011). Do upadku nie trzeba.')}`,
    ];
    for (const x of texts) expect([l, x, screen.queryAllByText(x).length]).toEqual([l, x, 1]);
    expect(screen.getByTestId('gen-cardio')).toBeTruthy();
    await pickDays([2]); const one = p(tIn(l, '{k} dzień siłowy w tygodniu to mniej niż zalecenie WHO 2020 (co najmniej {n} dni). Na początek to dobry krok: wytyczne USA 2018 radzą zacząć od {k} dnia i z czasem dojść do {n} — trochę ruchu jest lepsze niż żaden.'), { k: 1, n: 2 });
    expect([l, screen.queryAllByText(one).length]).toEqual([l, 1]);
    const all = JSON.stringify(screen.toJSON());
    if (l !== 'pl') expect([l, ['Ogólny', 'Dni cardio w planie', 'dzień siłowy', 'wytyczne USA'].filter(k => all.includes(k))]).toEqual([l, []]);
  });
});
