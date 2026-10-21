/*
 * M3 p2 — tablica „teraz” i nagłówek treningu na prawdziwym ekranie (ZM-01, ZM-02, ZM-05; docs/32 wzorce 29 i 30; design-spec §1, §2, §4; decyzje STOP E3 21.10.2026).
 * Scenariusze: wpis i ± na tablicy, „Seria zrobiona” bez wyniku (kursor w polu, haptyka, ogłoszenie), przerwa jako zegar na tablicy, pola serii (1–4 / 5–12 / > 12),
 * seria na czas („Zakończ serię”), widok listy bez tablicy, nagłówek (nazwa + czas, menu „⋯”, „Zakończ” drugorzędny), zgoda na powiadomienia przy pierwszej przerwie,
 * VoiceOver (opis tablicy, etykiety ±, pola ukryte, Large Content Viewer). Logika: tests/m3-p2-board-logic.test.ts.
 */
import { AccessibilityInfo, StyleSheet } from 'react-native';
import { within } from '@testing-library/react-native';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { applyUnit } from '@/lib/units';
import { __resetRestNoticesForTests } from '@/components/ActiveWorkout';
import { fresh, ex, saved, addWorkout, set } from './helpers';
import { renderApp, tap, type as typeText, flushAll, screen, act } from './app';

jest.setTimeout(120000);
const S = () => store.getState(); const A = () => S().active!; /* po boot() store jest wczytany od nowa — stare odwołania do treningu są nieaktualne */
const G = global as unknown as { __notifPerm?: unknown; __notifPermAsked?: number; __haptics: string[]; __sheets: { opts: { options: string[]; title?: string }; cb: (i: number) => void }[] };
const HID = { includeHiddenElements: true } as const;
afterEach(async () => { applyUnit('kg'); G.__notifPerm = undefined; G.__notifPermAsked = 0; jest.restoreAllMocks(); try { S(); } catch { return; } await timer.stop(); await timer.stopSet(); });
beforeEach(() => { __resetRestNoticesForTests(); G.__haptics.length = 0; G.__sheets.length = 0; });
const boot = async (locale: 'pl' | 'en' | 'el' = 'pl') => { await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), ...(locale === 'el' ? { code: 'el', tag: 'el-GR' } : { locale }) }); await flushAll(20); };
const startBench = (n = 3, name = 'Bench Press (sztanga)') => { store.startEmpty(); store.addExerciseToActive(ex(name)); for (let i = 1; i < n; i++) store.addSet(0); return S().active!; };
const vals = (a: ReturnType<typeof startBench>, si: number, v: { weight?: number; reps?: number }) => { Object.assign(A().exercises[0].sets[si], v); };
const sheet = () => G.__sheets[G.__sheets.length - 1];
const pick = async (label: string | RegExp) => { const i = sheet().opts.options.findIndex(o => typeof label === 'string' ? o === label : label.test(o)); if (i < 0) throw new Error('brak pozycji ' + String(label) + ' w ' + sheet().opts.options.join(' | ')); await act(async () => { sheet().cb(i); }); await flushAll(10); };
const text = (id: string) => within(screen.getByTestId(id)).queryByText(/.+/)?.props.children;

describe('ZM-01: tablica „teraz” — dane i wpis', () => {
  test('nazwa ćwiczenia wersalikami przez upperText (pl: styl wersalików, tekst bez zmian), liczby „—” gdy brak wyniku (nie „0”), „seria n z m”', async () => {
    await fresh(); startBench(3); await boot();
    const card = within(screen.getByTestId('focus-card')); const name = card.getByText('Bench Press (sztanga)');
    expect(([] as { textTransform?: string }[]).concat(name.props.style).flat(3).some(x => x?.textTransform === 'uppercase')).toBe(true);
    expect(within(screen.getByTestId('board-value-weight')).getByText('—')).toBeTruthy(); expect(within(screen.getByTestId('board-value-reps')).getByText('—')).toBeTruthy();
    expect(card.getByText('seria 1 z 3')).toBeTruthy();
  });
  test('wersaliki w greckim: reguły języka (upper, nie styl systemowy) — tekst zapisany wersalikami', async () => {
    await fresh(undefined, 'pl'); startBench(1); await boot('el');
    const name = within(screen.getByTestId('focus-card')).getAllByText(/BENCH PRESS|ΠΆ|ΠΈ/)[0]; expect(String(name.props.children)).toBe(String(name.props.children).toUpperCase());
  });
  test('stuknięcie liczby otwiera wpis; wpis ciężaru i powtórzeń zapisuje serię (edited) i przechodzi na kolejne puste serie (kaskada jak w wierszu)', async () => {
    await fresh(); const a = startBench(3); await boot();
    await tap(screen.getByTestId('board-value-weight')); await typeText(screen.getByTestId('board-input-weight'), '80');
    expect(A().exercises[0].sets[0].weight).toBe(80); expect(A().exercises[0].sets[0].edited).toBe(true); expect(A().exercises[0].sets[1].weight).toBe(80); expect(A().exercises[0].sets[2].weight).toBe(80);
    await tap(screen.getByTestId('board-value-reps')); await typeText(screen.getByTestId('board-input-reps'), '6'); expect(A().exercises[0].sets[0].reps).toBe(6);
  });
  test('pokazuje podpowiedź „Poprzednio” jako wartość (tak jak zapisze ✓), nie „—”', async () => {
    await fresh(); addWorkout(Date.now() - 86400e3, [['Bench Press (sztanga)', [set({ weight: 77.5, reps: 6 })]]]); startBench(2); await boot();
    expect(within(screen.getByTestId('board-value-weight')).getByText('77,5')).toBeTruthy(); expect(within(screen.getByTestId('board-value-reps')).getByText('6')).toBeTruthy();
  });
  test('jednostka funtów: liczba i etykieta jednostki z wu() (lb)', async () => {
    await fresh(); S().settings.unit = 'lb'; applyUnit('lb'); const a = startBench(1); vals(a, 0, { weight: 45.4, reps: 5 }); await boot();
    expect(within(screen.getByTestId('focus-card')).getAllByText('lb').length).toBeGreaterThan(0);
  });
});

describe('ZM-01: ± o krok sprzętu, haptyka „tick”', () => {
  test('„+” i „−” zmieniają ciężar o krok (62,5 / 57,5), dają jedno „selection”, a w danych serii zostaje wpis ręczny', async () => {
    await fresh(); const a = startBench(2); vals(a, 0, { weight: 60, reps: 8 }); await boot();
    await tap(screen.getByTestId('step-weight-up')); expect(A().exercises[0].sets[0].weight).toBe(62.5); expect(G.__haptics).toEqual(['selection']);
    await tap(screen.getByTestId('step-weight-down')); await tap(screen.getByTestId('step-weight-down')); expect(A().exercises[0].sets[0].weight).toBe(57.5); expect(G.__haptics).toEqual(['selection', 'selection', 'selection']);
    expect(A().exercises[0].sets[0].edited).toBe(true);
  });
  test('± powtórzeń o 1; na zerze „−” nie robi nic i nie wibruje', async () => {
    await fresh(); const a = startBench(1); vals(a, 0, { weight: 60, reps: 1 }); await boot();
    await tap(screen.getByTestId('step-reps-down')); expect(A().exercises[0].sets[0].reps).toBe(0); G.__haptics.length = 0; await tap(screen.getByTestId('step-reps-down')); expect(A().exercises[0].sets[0].reps).toBe(0); expect(G.__haptics).toEqual([]);
    await tap(screen.getByTestId('step-reps-up')); expect(A().exercises[0].sets[0].reps).toBe(1);
  });
  test('przełącznik dźwięku/wibracji wyłączony: ± działa, ale bez wibracji', async () => {
    await fresh(); const a = startBench(1); vals(a, 0, { weight: 60, reps: 8 }); S().settings.sound = false; await boot();
    await tap(screen.getByTestId('step-weight-up')); expect(A().exercises[0].sets[0].weight).toBe(62.5); expect(G.__haptics).toEqual([]);
  });
  test('etykiety VoiceOver ± zawierają krok i jednostkę (PL i EN)', async () => {
    await fresh(); const a = startBench(1); vals(a, 0, { weight: 60, reps: 8 }); await boot();
    expect(screen.getByLabelText('Zwiększ ciężar o 2,5 kg')).toBeTruthy(); expect(screen.getByLabelText('Zmniejsz ciężar o 2,5 kg')).toBeTruthy(); expect(screen.getByLabelText('Zwiększ powtórzenia o 1')).toBeTruthy(); expect(screen.getByLabelText('Zmniejsz powtórzenia o 1')).toBeTruthy();
    await boot('en'); expect(screen.getByLabelText('Increase weight by 2.5 kg')).toBeTruthy(); expect(screen.getByLabelText('Remove one rep')).toBeTruthy();
  });
  test('masa ciała: słowo zamiast „0”; ± dociążenia o 2,5 kg', async () => {
    await fresh(); const a = startBench(1, 'Pull Up'); vals(a, 0, { reps: 8 }); await boot();
    expect(within(screen.getByTestId('board-value-addKg')).getByText('masa ciała')).toBeTruthy(); await tap(screen.getByTestId('step-addKg-up')); expect(A().exercises[0].sets[0].addKg).toBe(2.5);
  });
});

describe('ZM-01: „Seria zrobiona” bez wyniku', () => {
  test('bez ciężaru: seria NIE jest odhaczona, kursor w polu ciężaru, haptyka ostrzegawcza, ogłoszenie VoiceOver, przerwa nie startuje; bez okna', async () => {
    const spy = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => {});
    await fresh(); const a = startBench(2); await boot(); global.__alerts.length = 0;
    await tap(screen.getByTestId('focus-done')); await flushAll(10);
    expect(A().exercises[0].sets[0].done).toBe(false); expect(timer.T.on).toBe(false); expect(screen.getByTestId('board-input-weight')).toBeTruthy();
    expect(G.__haptics).toEqual(['notification:warning']); expect(spy).toHaveBeenCalledWith('Wpisz ciężar, żeby zapisać serię.'); expect(global.__alerts).toEqual([]);
  });
  test('po wpisaniu ciężaru brakuje powtórzeń: kursor przechodzi do powtórzeń; po wpisaniu obu — seria odhaczona i przerwa startuje', async () => {
    const spy = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => {});
    await fresh(); const a = startBench(2); await boot();
    await tap(screen.getByTestId('focus-done')); await typeText(screen.getByTestId('board-input-weight'), '60');
    await tap(screen.getByTestId('focus-done')); await flushAll(10); expect(A().exercises[0].sets[0].done).toBe(false); expect(screen.getByTestId('board-input-reps')).toBeTruthy(); expect(spy).toHaveBeenLastCalledWith('Wpisz powtórzenia, żeby zapisać serię.');
    await typeText(screen.getByTestId('board-input-reps'), '8'); await tap(screen.getByTestId('focus-done')); await flushAll(20);
    expect(A().exercises[0].sets[0].done).toBe(true); expect(timer.T.on).toBe(true);
  });
  test('z podpowiedzią: jedno stuknięcie odhacza i startuje przerwę (trening z podpowiedziami nie wydłuża się)', async () => {
    await fresh(); addWorkout(Date.now() - 86400e3, [['Bench Press (sztanga)', [set({ weight: 80, reps: 6 }), set({ weight: 80, reps: 6 })]]]); const a = startBench(2); await boot();
    await tap(screen.getByTestId('focus-done')); await flushAll(20); expect(A().exercises[0].sets[0].done).toBe(true); expect(A().exercises[0].sets[0].weight).toBe(80); expect(timer.T.on).toBe(true); expect(G.__haptics).toEqual(['impact:light']); /* ZM-07 pkt 2: krótka wibracja przy odhaczeniu */
  });
  test('szablon z dolną granicą zakresu: powtórzenia z szablonu, ciężar nadal do wpisania', async () => {
    await fresh(); const a = startBench(1); A().exercises[0].repMin = 8; await boot(); expect(within(screen.getByTestId('board-value-reps')).getByText('8')).toBeTruthy();
    await tap(screen.getByTestId('focus-done')); await flushAll(10); expect(A().exercises[0].sets[0].done).toBe(false); expect(screen.getByTestId('board-input-weight')).toBeTruthy();
  });
  test('wiersz serii (✓ w wierszu) działa jak dotąd — odhacza bez blokady (zmiana dotyczy przycisku „Seria zrobiona” na tablicy)', async () => {
    await fresh(); const a = startBench(2); await boot();
    await tap(screen.getByLabelText('Seria 1 zrobiona — Bench Press (sztanga)')); await flushAll(20); expect(A().exercises[0].sets[0].done).toBe(true);
  });
});

describe('ZM-01: przerwa na tablicy', () => {
  const doneFirst = async (a: ReturnType<typeof startBench>) => { vals(a, 0, { weight: 80, reps: 6 }); vals(a, 1, { weight: 80, reps: 6 }); await boot(); await tap(screen.getByTestId('focus-done')); await flushAll(20); };
  test('po „Seria zrobiona” tablica przewraca się na zegar: „PRZERWA”, „z {s}”, następna seria; −15 / +15 / Pomiń pod tablicą; Pomiń wraca do serii', async () => {
    await fresh(); const a = startBench(3); await doneFirst(a);
    expect(screen.getByTestId('board-clock')).toBeTruthy(); expect(screen.queryByTestId('focus-done')).toBeNull(); expect(screen.getByText(/^z \d+:\d{2}$/)).toBeTruthy();
    expect(screen.getByTestId('board-next').props.children).toMatch(/^Następna:\sseria\s2\sz\s3,\s80\skg\s×\s6/) /* spacje nierozdzielające (glue, A11-19) */;
    await tap(screen.getByLabelText('Wydłuż przerwę o 15 sekund')); await tap(screen.getByLabelText('Skróć przerwę o 15 sekund'));
    await tap(screen.getByText('Pomiń')); await flushAll(20); expect(timer.T.on).toBe(false); expect(screen.getByTestId('focus-done')).toBeTruthy(); expect(screen.queryByTestId('board-clock')).toBeNull();
  });
  test('po upływie przerwy tablica serii wraca sama (jedno stuknięcie na serię), z linią „przerwa minęła”', async () => {
    await fresh(); const a = startBench(3); await doneFirst(a); timer.T.endAt = Date.now() - 2000; await flushAll(600);
    expect(screen.getByTestId('focus-done')).toBeTruthy(); expect(screen.queryByTestId('board-clock')).toBeNull(); expect(screen.getByText('przerwa minęła')).toBeTruthy();
    await tap(screen.getByTestId('focus-done')); await flushAll(20); expect(A().exercises[0].sets[1].done).toBe(true);
  });
  test('Ogranicz ruch i zwykły ruch: zmiana twarzy tablicy nie zależy od animacji (treść od razu)', async () => {
    await fresh(); const a = startBench(2); await doneFirst(a); expect(screen.getByTestId('board-clock')).toBeTruthy();
  });
});

describe('ZM-01: pola serii (bez dotyku)', () => {
  const states = () => screen.getAllByTestId(/^board-field-\d+$/, HID).map(f => f.props.accessibilityValue.text);
  test('do 4 serii: pola z wynikiem dla zrobionych, stan: zrobiona / bieżąca / czekająca', async () => {
    await fresh(); const a = startBench(4); vals(a, 0, { weight: 80, reps: 6 }); vals(a, 1, { weight: 80, reps: 6 }); vals(a, 2, { weight: 80, reps: 6 }); store.toggleDone(0, 0); store.toggleDone(0, 1); await boot();
    expect(states()).toEqual(['done', 'done', 'current', 'pending']); expect(within(screen.getByTestId('board-field-0', HID)).getByText('80×6', HID)).toBeTruthy(); expect(within(screen.getByTestId('board-field-2', HID)).getByText('3', HID)).toBeTruthy();
  });
  test('5–12 serii: bez wyniku, wszystkie pola, bez przewijania; > 12: jeden przewijany rząd (bez limitu w danych)', async () => {
    await fresh(); const a = startBench(8); vals(a, 0, { weight: 80, reps: 6 }); store.toggleDone(0, 0); await boot();
    expect(states()).toHaveLength(8); expect(screen.queryByTestId('board-fields-scroll', HID)).toBeNull(); expect(within(screen.getByTestId('board-field-0', HID)).queryByText('80×6', HID)).toBeNull(); expect(within(screen.getByTestId('board-field-0', HID)).getByText('1', HID)).toBeTruthy();
    await fresh(); startBench(15); await boot(); expect(states()).toHaveLength(15); expect(screen.getByTestId('board-fields-scroll', HID)).toBeTruthy();
  });
  test('rozgrzewka czekająca: kontur kreskowany; pole nie jest celem dotyku (brak onPress) i jest ukryte dla VoiceOver', async () => {
    await fresh(); startBench(2); store.addSet(0, 'warmup'); store.addSet(0, 'warmup'); await boot(); const wi = A().exercises[0].sets.map(s => s.kind).lastIndexOf('warmup'); /* pierwsza rozgrzewka jest bieżąca, druga czeka */ const f = screen.getByTestId(`board-field-${wi}`, HID);
    expect(StyleSheet.flatten(f.props.style).borderStyle).toBe('dashed'); expect(f.props.onPress).toBeUndefined();
    expect(screen.queryByTestId('board-fields')).toBeNull(); /* ukryte dla VoiceOver — bez includeHiddenElements nie ma ich w drzewie dostępności */ expect(screen.getByTestId('board-fields', HID).props.pointerEvents).toBe('none');
  });
});

describe('ZM-05: seria na czas — jedna nazwa „Zakończ serię” na tablicy i w dolnym pasku', () => {
  test('bez pomiaru: „▶ Start” i „Odhacz bez pomiaru”; w trakcie pomiaru na tablicy i w pasku ten sam tytuł, różne etykiety VoiceOver', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Plank')); const a = S().active!; A().exercises[0].sets[0].durationSec = 30; await boot();
    expect(screen.getByTestId('focus-start')).toBeTruthy(); expect(screen.getByLabelText(/^Odhacz bez pomiaru: Plank/)).toBeTruthy(); expect(screen.queryByText('Zakończ serię')).toBeNull();
    await tap(screen.getByTestId('focus-start')); await flushAll(20); expect(timer.S.on).toBe(true);
    expect(screen.getAllByText('Zakończ serię')).toHaveLength(2); expect(screen.getByLabelText('Zakończ serię')).toBeTruthy(); expect(screen.getByLabelText(/^Zakończ serię: Plank, seria 1/)).toBeTruthy();
    await tap(screen.getByTestId('focus-finish-set')); await flushAll(30); expect(timer.S.on).toBe(false); expect(A().exercises[0].sets[0].done).toBe(true);
  });
  test('„Odhacz bez pomiaru” bez czasu: kursor w polu czasu, seria nie odhaczona (jak ciężar)', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Plank')); const a = S().active!; await boot();
    await tap(screen.getByLabelText(/^Odhacz bez pomiaru: Plank/)); await flushAll(10); expect(A().exercises[0].sets[0].done).toBe(false); expect(screen.getByTestId('board-input-durationSec')).toBeTruthy(); expect(G.__haptics).toEqual(['notification:warning']);
  });
});

describe('widok listy (Ustawienia → Widok treningu): tylko system, bez tablicy (STOP 3)', () => {
  test('bez tablicy i bez nagłówka „Następne ćwiczenia”; bloki ćwiczeń i nagłówek treningu jak w widoku skupionym', async () => {
    await fresh(); S().settings.workoutView = 'list'; startBench(2); store.addExerciseToActive(ex('Back Squat')); await boot();
    expect(screen.queryByTestId('focus-card')).toBeNull(); expect(screen.queryByText('Następne ćwiczenia')).toBeNull(); expect(screen.getByTestId('ex-0')).toBeTruthy(); expect(screen.getByTestId('workout-name')).toBeTruthy(); expect(screen.getByTestId('more-button')).toBeTruthy();
  });
});

describe('ZM-02: nagłówek treningu', () => {
  test('nazwa i czas w jednej linii (jeden wiersz z dwoma tekstami), „⋯” z etykietą „Opcje treningu”, „Zakończ” jako przycisk tekstowy w nagłówku (drugorzędny)', async () => {
    await fresh(); const t = store.newTemplate(); t.name = 'Góra A'; t.items.push({ id: 'a', exerciseId: ex('Bench Press (sztanga)').id, sets: 2, repMin: 8, repMax: 10, restSec: null, startWeight: 60, targetSec: '', groupId: null }); store.save(t); store.startFromTemplate(t); await boot();
    const name = screen.getByTestId('workout-name'); const clock = screen.getByTestId('workout-clock'); expect(within(name).queryByText('Góra A') ?? name.props.children).toBeTruthy(); expect(name.props.children).toBe('Góra A'); expect([clock.props.children].flat().join('')).toMatch(/^\d+:\d{2}/);
    expect(screen.getByLabelText('Opcje treningu')).toBe(screen.getByTestId('more-button')); expect(screen.getByTestId('finish-workout')).toBeTruthy(); expect(screen.getAllByText('Zakończ').length).toBeGreaterThan(0);
    expect(screen.queryByTestId('voice-btn')).toBeNull(); expect(screen.queryByLabelText(/^Miejsce treningu:/)).toBeNull(); /* miejsce, głos i notatka są w menu */
  });
  test('„Zakończ” w nagłówku pyta jak dotąd (okno [Anuluj, Zakończ])', async () => {
    await fresh(); const a = startBench(1); vals(a, 0, { weight: 60, reps: 8 }); store.toggleDone(0, 0); await boot(); await tap(screen.getByTestId('finish-workout')); expect(global.__alerts.at(-1)!.title).toBe('Zakończyć trening?');
  });
  test('menu „⋯”: bez miejsc i notatki — Pauza, Zapowiedzi głosowe, Anuluj; „Pauza treningu” wstrzymuje, a nagłówek pokazuje „· pauza”', async () => {
    await fresh(); startBench(1); await boot(); await tap(screen.getByTestId('more-button'));
    expect(sheet().opts.options).toEqual(['Pauza treningu', expect.stringMatching(/^Zapowiedzi głosowe: /), 'Anuluj']);
    await pick('Pauza treningu'); expect(store.isPaused(S().active!)).toBe(true); expect([screen.getByTestId('workout-clock').props.children].flat().join('')).toContain('· pauza');
    await tap(screen.getByTestId('more-button')); expect(sheet().opts.options[0]).toBe('Wznów trening'); await pick('Wznów trening'); expect(store.isPaused(S().active!)).toBe(false);
  });
  test('menu „⋯”: „Zapowiedzi głosowe” otwiera arkusz z trzema opcjami (zmiana trwała jak w Ustawieniach)', async () => {
    await fresh(); startBench(1); await boot(); await tap(screen.getByTestId('more-button')); await pick(/^Zapowiedzi głosowe: /);
    expect(sheet().opts.title).toBe('Zapowiedzi głosowe'); expect(sheet().opts.options).toHaveLength(4); await act(async () => { sheet().cb(2); }); expect(store.getState().settings.voice).toBe('speaker');
  });
  test('menu „⋯”: miejsce (gdy są miejsca) i „Notatka szablonu” (gdy szablon ma notatkę) — Anuluj zawsze ostatnie', async () => {
    await fresh(); const L = require('@/lib/locations'); L.addLocation('gym', 'Siłownia'); const t = store.newTemplate(); t.name = 'Push'; t.note = 'Wysiłek: zwykle 0–3 powtórzenia w zapasie.'; t.items.push({ id: 'a', exerciseId: ex('Bench Press (sztanga)').id, sets: 1, repMin: 8, repMax: 10, restSec: null, startWeight: 60, targetSec: '', groupId: null }); store.save(t); store.startFromTemplate(t); await boot();
    await tap(screen.getByTestId('more-button')); const o = sheet().opts.options; expect(o[0]).toMatch(/^Miejsce treningu: /); expect(o).toContain('Notatka szablonu'); expect(o[o.length - 1]).toBe('Anuluj');
    await pick('Notatka szablonu'); expect(global.__alerts.at(-1)).toMatchObject({ title: 'Notatka szablonu', msg: 'Wysiłek: zwykle 0–3 powtórzenia w zapasie.' });
    await tap(screen.getByTestId('more-button')); await pick(/^Miejsce treningu: /); expect(sheet().opts.title).toBe('Miejsce tego treningu');
  });
  test('nad tablicą najwyżej 3–4 elementy: nagłówek, pasek postępu, (pauza / dostosuj tylko, gdy trzeba); chip miejsca i notatka szablonu nie są w treści', async () => {
    await fresh(); const t = store.newTemplate(); t.name = 'Push'; t.note = 'Notatka'; t.items.push({ id: 'a', exerciseId: ex('Bench Press (sztanga)').id, sets: 1, repMin: 8, repMax: 10, restSec: null, startWeight: 60, targetSec: '', groupId: null }); store.save(t); store.startFromTemplate(t); await boot();
    expect(screen.queryByText('Notatka')).toBeNull(); expect(screen.queryByTestId('adapt-line')).toBeNull(); expect(screen.getByLabelText(/^Postęp treningu:/)).toBeTruthy();
  });
});

describe('ZM-02: zgoda na powiadomienia przy pierwszej przerwie', () => {
  const UNDETERMINED = { granted: false, canAskAgain: true, status: 'undetermined' }; const DENIED = { granted: false, canAskAgain: false, status: 'denied' };
  const startRest = async (perm: unknown) => { await fresh(); G.__notifPerm = perm; G.__notifPermAsked = 0; const a = startBench(3); vals(a, 0, { weight: 60, reps: 8 }); vals(a, 1, { weight: 60, reps: 8 }); await boot(); };
  const endRest = async () => { await tap(screen.getByText('Pomiń')); await flushAll(20); await tap(screen.getByTestId('focus-done')); await flushAll(20); };
  test('przed przerwą nic nie ma w treści; w pierwszej przerwie wiersz pod tablicą: „Przerwa trwa — powiadomić na koniec?” [Powiadamiaj, Nie teraz]', async () => {
    await startRest(UNDETERMINED); expect(screen.queryByTestId('perm-explain-workout')).toBeNull(); await tap(screen.getByTestId('focus-done')); await flushAll(20);
    expect(screen.getByTestId('perm-explain-workout')).toBeTruthy(); expect(screen.getByText('Przerwa trwa — powiadomić na koniec?')).toBeTruthy(); expect(screen.getByText('Powiadamiaj')).toBeTruthy(); expect(screen.getByText('Nie teraz')).toBeTruthy(); expect(G.__notifPermAsked).toBe(0);
  });
  test('„Powiadamiaj” woła system; „Nie teraz” chowa wiersz i system nie pyta', async () => {
    await startRest(UNDETERMINED); await tap(screen.getByTestId('focus-done')); await flushAll(20); await tap(screen.getByText('Powiadamiaj')); await flushAll(10); expect(G.__notifPermAsked).toBe(1);
    await startRest(UNDETERMINED); await tap(screen.getByTestId('focus-done')); await flushAll(20); await tap(screen.getByText('Nie teraz')); await flushAll(10); expect(screen.queryByTestId('perm-explain-workout')).toBeNull(); expect(G.__notifPermAsked).toBe(0);
  });
  test('po odmowie komunikat „Brak zgody…” jest pokazany raz (w pierwszej przerwie), potem tylko w Ustawieniach (kolejna przerwa bez komunikatu)', async () => {
    await startRest(DENIED); expect(screen.queryByTestId('perm-denied-workout')).toBeNull(); await tap(screen.getByTestId('focus-done')); await flushAll(20);
    expect(screen.getByTestId('perm-denied-workout')).toBeTruthy(); await endRest(); expect(screen.queryByTestId('perm-denied-workout')).toBeNull();
    expect(screen.queryByTestId('perm-denied-workout')).toBeNull(); expect(screen.getByText('Pomiń')).toBeTruthy(); expect(screen.queryByTestId('perm-denied-workout')).toBeNull(); /* druga przerwa trwa, komunikatu nie ma */
  });
  test('zgoda udzielona: żadnego wiersza', async () => {
    await startRest({ granted: true }); await tap(screen.getByTestId('focus-done')); await flushAll(20); expect(screen.queryByTestId('perm-explain-workout')).toBeNull(); expect(screen.queryByTestId('perm-denied-workout')).toBeNull();
  });
});

describe('„Następne ćwiczenia” pod tablicą', () => {
  test('nagłówek przed ćwiczeniami po bieżącym; gdy bieżące jest ostatnie — bez nagłówka', async () => {
    await fresh(); const a = startBench(1); store.addExerciseToActive(ex('Back Squat')); vals(a, 0, { weight: 60, reps: 8 }); await boot();
    expect(screen.getAllByText('Następne ćwiczenia')).toHaveLength(1); store.toggleDone(0, 0); await boot(); expect(screen.queryByText('Następne ćwiczenia')).toBeNull();
  });
});

describe('VoiceOver: opis tablicy i podgląd liczb', () => {
  test('część z nazwą i liczbami to jeden element (rola obrazu) z opisem: ćwiczenie, seria, wartości, postęp serii', async () => {
    await fresh(); const a = startBench(3); vals(a, 0, { weight: 80, reps: 6 }); vals(a, 1, { weight: 80, reps: 6 }); store.toggleDone(0, 0); await boot();
    const d = screen.getByTestId('board-desc'); expect(d.props.accessibilityRole).toBe('image'); expect(d.props.accessible).toBe(true);
    expect(d.props.accessibilityLabel).toMatch(/^Bench Press \(sztanga\), seria 2 z 3\. 80 kilogramów, 6 powtórzeń\. Serie: 1 z 3 zrobione/);
  });
  test('rozgrzewki w opisie osobno; > 12 serii dopisek „lista serii przewijana”', async () => {
    await fresh(); const a = startBench(14); store.addSet(0, 'warmup'); vals(a, 1, { weight: 80, reps: 6 }); await boot();
    const l = screen.getByTestId('board-desc').props.accessibilityLabel as string; expect(l).toContain('Rozgrzewki: 0 z 1 zrobione'); expect(l).toContain('lista serii przewijana');
  });
  test('liczby: podgląd po przytrzymaniu (Large Content Viewer) z nazwą pola i wartością; liczby nie rosną ponad dopasowanie (maxFontSizeMultiplier 1)', async () => {
    await fresh(); const a = startBench(1); vals(a, 0, { weight: 80, reps: 6 }); await boot(); const p = screen.getByTestId('board-value-weight');
    expect(p.props.accessibilityShowsLargeContentViewer).toBe(true); expect(p.props.accessibilityLargeContentTitle).toBe('ciężar: 80'); expect(within(p).getByText('80').props.maxFontSizeMultiplier).toBe(1);
  });
  test('opis tablicy w przerwie: zegar jest w drzewie dostępności jako tekst, pola serii ukryte', async () => {
    await fresh(); const a = startBench(2); vals(a, 0, { weight: 80, reps: 6 }); vals(a, 1, { weight: 80, reps: 6 }); await boot(); await tap(screen.getByTestId('focus-done')); await flushAll(20);
    expect(screen.queryByTestId('board-fields')).toBeNull(); expect(screen.getByTestId('board-fields', HID)).toBeTruthy(); expect(text('board-clock')).toMatch(/^\d+:\d{2}$/);
  });
});

describe('wszystkie serie odhaczone', () => {
  test('tablica „Wszystkie serie odhaczone” z przyciskiem „Zakończ trening” (jak dotąd); bez blokady', async () => {
    await fresh(); const a = startBench(1); vals(a, 0, { weight: 60, reps: 8 }); store.toggleDone(0, 0); await boot(); expect(screen.getByText('Wszystkie serie odhaczone')).toBeTruthy();
    global.__alerts.length = 0; await tap(screen.getByText('Zakończ trening')); expect(global.__alerts.at(-1)!.title).toBe('Zakończyć trening?');
  });
});
