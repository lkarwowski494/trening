/* Audyt 0.10 — fala 2, obszar UI (09.10.2026): testy regresji i nowe zachowanie. docs/25 grupy G (usuwanie, edycja, potwierdzenia), H (nawigacja,
 * nazwy, formaty, pierwsze kroki, „Zapisz jako szablon”), L1 (notka medyczna), F7 (podwójne tapnięcie), zaległe: notatka szablonu w treningu
 * i licznik serii roboczych. Edycja na żądanie (ćwiczenie, szablon): tests/edit-on-demand.test.tsx. Rodzaje (docs/20): logika (lib/tplsync,
 * loads.fillRange, i18n.deviceUnit, store.fmtDayKey/setPlanHintHidden), ekran, scenariusz z restartem, dane (migrate, zapis), języki (EN). */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { fillRange, LOAD_LIMITS } from '@/lib/loads';
import { templateDiff, updateTemplateFromWorkout, templateFromWorkout, templateDiffText } from '@/lib/tplsync';
import { deviceUnit, LB_REGIONS } from '@/lib/i18n';
import { equipEntry } from '@/lib/equipment';
import { addLocation } from '@/lib/locations';
import type { Template, Workout } from '@/lib/seed';
import { fresh, ex, addWorkout, pressAlert, saved } from './helpers';
import { renderApp, flushAll, screen, go, tap, type, act, fireEvent, expandEquip, swipeDelete, deleteActions } from './app';
import { loc } from './locations-fixtures';

jest.setTimeout(60000);
const S = () => store.getState();
const lastAlert = () => global.__alerts[global.__alerts.length - 1];
const alertOf = (title: string) => [...global.__alerts].reverse().find(a => a.title === title);
const boot = async (fn: () => void = () => {}, url?: string, locale: 'pl' | 'en' = 'pl') => { await fresh(undefined, locale); fn(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url, locale }); await flushAll(10); };
const blocked = () => screen.UNSAFE_root.findAll((n: { type: unknown; props: Record<string, any> }) => typeof n.type === 'string' && typeof n.props.onAccessibilityAction === 'function' && Array.isArray(n.props.accessibilityActions) && n.props.accessibilityActions.some((a: { name: string }) => a.name === 'blocked'));
const mkTpl = (name = 'Push', rows = true) => { const t = store.newTemplate(); t.name = name; t.note = 'Wysiłek: zwykle 0–3 powtórzenia w zapasie (RIR); do upadku nie trzeba.';
  t.items.push({ id: 'a', exerciseId: ex('Bench Press (sztanga)').id, sets: 3, repMin: 6, repMax: 8, restSec: null, startWeight: 60, targetSec: '', groupId: null, ...(rows ? { rows: [{ id: 'w', kind: 'warmup', reps: 10, weight: 40, durationSec: '', distanceM: '' }, { id: 'r1', kind: 'normal', reps: '', weight: 60, durationSec: '', distanceM: '' }, { id: 'r2', kind: 'normal', reps: '', weight: 60, durationSec: '', distanceM: '' }, { id: 'r3', kind: 'drop', reps: '', weight: 40, durationSec: '', distanceM: '' }] } : {}) },
    { id: 'b', exerciseId: ex('Pull Up').id, sets: 2, repMin: null, repMax: null, restSec: 120, startWeight: '', targetSec: '', groupId: null });
  store.save(t); return t; };

describe('G1 — edytor ciężarów: „Wypełnij” dopisuje, „Usuń odznaczone” pyta', () => {
  test('logika: zakres dopisuje do listy (wpisane zostają z zaznaczeniem), bez powtórzeń, rosnąco; limit po dopisaniu', () => {
    const items = fillRange([{ w: 2.5, on: true }, { w: 4, on: false }, { w: 30, on: true }], 2, 8, 2)!;
    expect(items.map(x => [x.w, x.on])).toEqual([[2, true], [2.5, true], [4, false], [6, true], [8, true], [30, true]]);
    const full = Array.from({ length: LOAD_LIMITS.listItems }, (_, i) => ({ w: i + 1, on: true }));
    expect(fillRange(full, 0.5, 1.5, 0.5)).toBeNull(); expect(fillRange(full, 0.5, 1.5, 0.5, Infinity)).toHaveLength(LOAD_LIMITS.listItems + 2);
    expect(fillRange(full, 1, 300, 1)).toHaveLength(LOAD_LIMITS.listItems); /* same powtórzenia — nic nie dochodzi */
  });
  test('ekran: „Wypełnij” nie kasuje wpisanych ciężarów; „Usuń odznaczone” — okno „Nie”/„Usuń”; za dużo po dopisaniu — komunikat', async () => {
    const KB = 'Kettlebell';
    await fresh(); const s = S().settings; s.locations.push(loc('Test', [equipEntry('kettlebell')], 'lt')); s.mainLocationId = 'lt'; await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(S())) }); await go('/more/location/lt'); await flushAll(10); await expandEquip();
    const spec = () => S().settings.locations[0].equipment.find(e => e.item === 'kettlebell')!.load as { items: { w: number; on: boolean }[] };
    const byHint = (label: string) => screen.getAllByLabelText(label).find(x => x.props.accessibilityHint === KB)!;
    await type(byHint('dodaj ciężar'), '7'); await tap(screen.getByLabelText(`Dodaj ciężar — ${KB}`)); await flushAll(5);
    await type(byHint('od'), '8'); await type(byHint('do'), '12'); await type(byHint('co'), '2'); await tap(screen.getByLabelText(`Wypełnij zakresem — ${KB}`)); await flushAll(5);
    expect(spec().items.map(x => x.w)).toEqual([7, 8, 10, 12]);
    await tap(screen.getByLabelText('7 kg')); await tap(screen.getByLabelText(`Usuń odznaczone — ${KB}`));
    expect(lastAlert()).toMatchObject({ title: 'Usunąć odznaczone ciężary?' }); expect(lastAlert().msg).toMatch(/^7 kg/);
    expect(lastAlert().buttons!.map(b => [b.text, b.style])).toEqual([['Nie', 'cancel'], ['Usuń', 'destructive']]);
    await act(async () => { pressAlert('Usunąć odznaczone ciężary?', 'Nie'); }); expect(spec().items).toHaveLength(4);
    await tap(screen.getByLabelText(`Usuń odznaczone — ${KB}`)); await act(async () => { pressAlert('Usunąć odznaczone ciężary?', 'Usuń'); }); await flushAll(5); expect(spec().items.map(x => x.w)).toEqual([8, 10, 12]);
    await type(byHint('od'), '13'); await type(byHint('do'), '310'); await type(byHint('co'), '1'); await tap(screen.getByLabelText(`Wypełnij zakresem — ${KB}`)); await flushAll(5);
    expect(screen.getByText(`Po dopisaniu zakresu byłoby ciężarów: ${3 + 298} — najwyżej ${LOAD_LIMITS.listItems}. Zwiększ krok albo usuń odznaczone.`)).toBeTruthy(); expect(spec().items).toHaveLength(3);
  });
});

describe('G2 — kolor gumy: jedna zasada na ekranie Gumy i w poziomach gum miejsca', () => {
  test('ekran Gumy: pusty kolor wraca do poprzedniego (koniec edycji), spacje porządkowane', async () => {
    await boot(undefined, '/more/bands'); const b0 = S().bands.slice().sort((a, b) => a.level - b.level)[0]; const old = b0.color;
    const f = screen.getAllByLabelText('Kolor gumy')[0]; await type(f, ''); await act(async () => { fireEvent(f, 'endEditing'); }); expect(b0.color).toBe(old);
    await type(f, '  bardzo   ciemna '); await act(async () => { fireEvent(f, 'endEditing'); }); expect(b0.color).toBe('bardzo ciemna');
  });
  test('poziomy gum w miejscu: ta sama zasada — także przy wyjściu z ekranu bez końca edycji', async () => {
    await fresh(); const s = S().settings; s.locations.push(loc('Dom', [equipEntry('bands')], 'lb1')); s.mainLocationId = 'lb1'; await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(S())) }); await go('/more/location/lb1'); await flushAll(10); await expandEquip();
    const field = screen.getAllByLabelText(/^Kolor gumy: poziom /)[0]; const lvl = Number(/poziom (\d)/.exec(field.props.accessibilityLabel)![1]); const band = () => S().bands.find(b => b.level === lvl)!; const old = band().color;
    await type(field, '   '); const { router } = require('expo-router'); await act(async () => { router.back(); }); await flushAll(10);
    expect(band().color).toBe(old); await act(async () => { await store.flush(); }); expect(JSON.parse(global.__kv.get('state')!).bands.find((b: { level: number }) => b.level === lvl).color).toBe(old);
  });
});

describe('G3 — skutki w oknach potwierdzeń', () => {
  test('miejsce z treningiem w toku, „Wyczyść wszystkie dane” przy treningu w toku, sesja z kopią w Zdrowiu', async () => {
    await boot(() => { const a = addLocation('home'); addLocation('gym'); store.startEmpty(); S().active!.locationId = S().settings.locations.find(l => l.id !== S().settings.mainLocationId)!.id; void a;
      addWorkout(Date.now() - 86400e3, [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Nogi').healthUUID = 'hk-1'; store.save(); });
    await go('/more/locations'); await flushAll(10); await swipeDelete(/^Usuń miejsce: /);
    expect(lastAlert().msg).toContain('Trwający trening w tym miejscu trwa dalej; miejsce pokaże się jako „(usunięte miejsce)”.'); await act(async () => { pressAlert('Usunąć miejsce?', 'Nie'); });
    await go('/more/settings'); await flushAll(10); await tap(screen.getByText('Wyczyść wszystkie dane'));
    expect(lastAlert()).toMatchObject({ title: 'Wyczyścić wszystkie dane?' }); expect(lastAlert().msg).toContain('Trening w toku też zostanie usunięty.'); expect(lastAlert().buttons![0]).toMatchObject({ text: 'Nie', style: 'cancel' });
    await act(async () => { pressAlert('Wyczyścić wszystkie dane?', 'Nie'); }); store.cancelWorkout();
    await go('/history'); await flushAll(10); await swipeDelete(/^Usuń sesję: Nogi/); expect(lastAlert().msg).toContain('Kopia w Apple Health zostanie — usuniesz ją w aplikacji Zdrowie.');
  });
});

describe('G4 — ostatniej serii nie usuwa się nigdzie; przy próbie — okno z powodem', () => {
  test('trening, szablon (edycja) i edycja historii: bez akcji „usuń” ostatniej serii, akcja „blocked” pokazuje powód; miejsce główne — też', async () => {
    let id = ''; await boot(() => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); id = addWorkout(Date.now() - 86400e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]).id; addLocation('home'); addLocation('gym'); });
    expect(deleteActions().filter(l => l.startsWith('Usuń serię'))).toEqual([]); expect(blocked().length).toBeGreaterThan(0);
    await act(async () => { blocked()[0].props.onAccessibilityAction({ nativeEvent: { actionName: 'blocked' } }); });
    expect(lastAlert()).toMatchObject({ title: 'To ostatnia seria', msg: 'Ćwiczenie ma co najmniej jedną serię. Żeby usunąć całe ćwiczenie, przesuń w lewo jego nazwę.' });
    store.cancelWorkout(); await go(`/history/edit/${id}`); await flushAll(20); expect(deleteActions().filter(l => l.startsWith('Usuń serię'))).toEqual([]); expect(deleteActions()).toContain('Usuń ćwiczenie: Back Squat');
    await go('/more/locations'); await flushAll(10); const bl = blocked().filter(n => n.props.accessibilityActions.some((a: { label: string }) => a.label === 'To miejsce główne')); expect(bl.length).toBe(1); /* ekrany niżej w stosie (edycja historii) zostają zamontowane */
    await act(async () => { bl[0].props.onAccessibilityAction({ nativeEvent: { actionName: 'blocked' } }); }); expect(lastAlert()).toMatchObject({ title: 'To miejsce główne', msg: 'Miejsca głównego nie usuniesz — najpierw ustaw inne miejsce jako główne.' });
  });
});

describe('G5 — konwencje okien i SwipeRow', () => {
  test('„Ukryj komunikat” (nieczytelne dane) — destructive; „Odrzucić trening?” — „Wróć” w stylu cancel', async () => {
    await renderApp({ saved: '{zle' }); await flushAll(10); await tap(screen.getByText('Poprzednich danych nie dało się odczytać'));
    expect(lastAlert().buttons!.find(b => b.text === 'Ukryj komunikat')!.style).toBe('destructive'); expect(lastAlert().buttons![0]).toMatchObject({ text: 'Anuluj', style: 'cancel' });
    await boot(() => { store.startEmpty(); }); await tap(screen.getByText('Odrzuć trening'));
    expect(lastAlert()).toMatchObject({ title: 'Odrzucić trening?' }); expect(lastAlert().buttons!.map(b => [b.text, b.style])).toEqual([['Wróć', 'cancel'], ['Odrzuć trening', 'destructive']]);
  });
  test('UI-17: PanResponder wiersza nie zmienia się przy przerysowaniu (gest nie zeruje się); jeden odsłonięty wiersz', async () => {
    await boot(() => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addSet(0); });
    const rowH = () => screen.UNSAFE_root.findAll((n: { props: Record<string, any> }) => typeof n.props.onResponderGrant === 'function' && n.props.onMoveShouldSetResponder)[0].props.onResponderGrant;
    const before = rowH(); await act(async () => { store.save(S().active); }); await flushAll(5); expect(rowH()).toBe(before);
  });
  test('UI-15: same zarchiwizowane szablony — pusty stan na zakładce Szablony; trening wstecz pokazuje archiwum pod „Archiwum”', async () => {
    await boot(() => { const t = mkTpl('Stary'); t.archived = true; store.save(t); }, '/templates');
    expect(screen.getByText('Brak szablonów — dodaj pierwszy.')).toBeTruthy(); expect(screen.getByLabelText('Archiwum (1)')).toBeTruthy();
    await go('/history/add'); await flushAll(10); expect(screen.getByRole('header', { name: 'Archiwum' })).toBeTruthy(); expect(screen.getByText('Stary')).toBeTruthy();
  });
  test('UI-16: powtórzenia ≤ REPS_MAX w treningu; zły wpis przerwy — komunikat zamiast ciszy', async () => {
    await boot(() => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); });
    await type(screen.getAllByLabelText('Powtórzenia')[0], '99999'); expect(S().active!.exercises[0].sets[0].reps).toBe(store.REPS_MAX);
    await tap(screen.getAllByLabelText(/^Przerwa: /)[0]); await act(async () => { pressAlert('Przerwa (sekundy)', 'Tylko teraz', 'abc'); });
    expect(lastAlert()).toMatchObject({ title: 'Nie zmieniono przerwy', msg: `Wpisz liczbę sekund od 0 do ${store.REST_MAX}.` });
  });
  test('UI-18: panel dnia przy treningu w toku — „Start” wyszarzony z wyjaśnieniem, nie znika', async () => {
    jest.useFakeTimers({ now: new Date(2026, 9, 8, 9) });
    let tid = ''; await boot(() => { const t = mkTpl(); tid = t.id; plan.setWeekDay(3, t.id); store.startEmpty(); }, `/history?day=2026-10-08`);
    const st = screen.getByLabelText('Start zaplanowanego treningu: Push'); expect(st.props.accessibilityHint).toBe('Trening w toku');
    await tap(st); expect(lastAlert()).toMatchObject({ title: 'Trening w toku', msg: 'Najpierw zakończ albo anuluj bieżący trening.' }); expect(S().active!.templateId).not.toBe(tid);
  });
});

describe('H1–H4 — nawigacja, nazwy, formaty, pierwsze kroki', () => {
  test('H1: „Jak to działa” (Pierwsze kroki) otwiera temat „Trening i serie” rozwinięty i odhaczony', async () => {
    await boot(); await tap(screen.getByText('Jak to działa')); await flushAll(10);
    expect(screen.getByLabelText('Trening i serie, przeczytane').props.accessibilityState).toEqual({ expanded: true }); expect(S().guideSeen).toEqual(['workout']);
  });
  test('H2: jedna nazwa — „Miejsca i sprzęt” (Więcej, Ustawienia), „Kopia zapasowa”, „Odrzuć trening”; komunikat autozapisu wskazuje Kalendarz', async () => {
    await boot(undefined, '/more'); expect(screen.getByText('Miejsca i sprzęt')).toBeTruthy(); expect(screen.getByText('Kopia zapasowa (eksport / import)')).toBeTruthy();
    await go('/more/settings'); await flushAll(10); expect(screen.getByText('Miejsca i sprzęt')).toBeTruthy(); expect(screen.queryByText('Miejsca treningu')).toBeNull();
    const { EN } = require('@/lib/i18n.en'); expect(EN['Trening z {d} {s} nie miał aktywności od 6 godzin, więc zapisał się sam. Koniec: {e} (ostatnia seria). Znajdziesz go w Kalendarzu.']).toMatch(/Calendar\.$/);
    expect('Znajdziesz go w Historii' in EN).toBe(false);
  });
  test('H3: data dnia jednym formatem (fmtDayKey = fmtDate); przerwa w karcie szablonu jak w treningu (m:ss)', async () => {
    await fresh(); expect(store.fmtDayKey('2026-10-12')).toBe(store.fmtDate(new Date(2026, 9, 12, 12).getTime())); expect(store.fmtDayKey('zły')).toBe('zły');
    const t = mkTpl(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await go(`/template/${t.id}`); await flushAll(10);
    expect(screen.getByText('zakres 6–8 · przerwa 1:30')).toBeTruthy(); expect(screen.getByText('przerwa 2:00')).toBeTruthy();
  });
  test('H4 (UX-12 A): Pierwsze kroki — dwa przyciski w kroku 1, krok 2 nieaktywny bez szablonu, krok „Miejsca i sprzęt”, pusty stan pod spodem ukryty', async () => {
    await boot(); const fs = screen.getByTestId('first-steps');
    expect(screen.getAllByText('+ Nowy szablon').length).toBe(1); expect(screen.getByText('Wygeneruj szablony i plan')).toBeTruthy();
    expect(screen.getByText('Najpierw utwórz szablon.')).toBeTruthy(); expect(screen.queryByText('Plan tygodnia')).toBeNull();
    expect(screen.getByText('Opcjonalnie: dodaj miejsce i sprzęt — wybór ćwiczeń i podpowiedzi ciężarów dopasują się do niego.')).toBeTruthy();
    expect(screen.queryByText('Nie masz jeszcze szablonów — utwórz pierwszy albo zacznij pusty trening.')).toBeNull(); void fs;
    await tap(screen.getByText('+ Nowy szablon')); await flushAll(10); expect(screen.getByLabelText('Zapisz szablon')).toBeTruthy(); /* od razu edycja (edycja na żądanie) */
  });
  test('H4: jednostka świeżej instalacji z regionu (en-US → lb, en-GB/pl → kg); „Co nowego” dla nowej osoby z dopiskiem', async () => {
    expect(deviceUnit('en-US')).toBe('lb'); expect(deviceUnit('en_US')).toBe('lb'); expect(deviceUnit('en-GB')).toBe('kg'); expect(deviceUnit('pl-PL')).toBe('kg'); expect(deviceUnit('en')).toBe('kg'); expect(LB_REGIONS).toContain('US');
    global.__kv.clear(); global.__locales = [{ languageCode: 'en', languageTag: 'en-US' }]; store.__resetForTests(); await store.init(); expect(S().settings.unit).toBe('lb');
    await boot(); await tap(screen.getByTestId('whats-new-i')); await flushAll(5); expect(screen.getByText('Zaczynasz od tej wersji — poniżej zmiany dla osób, które korzystały z poprzednich. Na start przyda się przewodnik.')).toBeTruthy();
  });
  test('UX-16 A: „Ukryj” zachętę do planu (karta i Kalendarz), zapis i migrate; kafelki prowadzą do Postępów; „Powtórz ostatni” niżej przy innym treningu z planu', async () => {
    jest.useFakeTimers({ now: new Date(2026, 9, 8, 9) });
    await boot(() => { addWorkout(new Date(2026, 9, 6, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Nogi'); });
    expect(screen.getByText('Bez planu tygodnia')).toBeTruthy(); await tap(screen.getAllByLabelText('Ukryj zachętę do planu tygodnia')[0]); await flushAll(5);
    expect(S().planHintHidden).toBe(true); expect(screen.queryByText('Bez planu tygodnia')).toBeNull(); expect(screen.getAllByText('Ten tydzień').length).toBeGreaterThan(0);
    await go('/history'); await flushAll(10); expect(screen.queryByLabelText('Ukryj zachętę do planu tygodnia')).toBeNull();
    await act(async () => { await store.flush(); }); const raw = saved(); expect(raw.planHintHidden).toBe(true);
    (raw as unknown as Record<string, unknown>).planHintHidden = 'tak'; await fresh(raw); expect('planHintHidden' in S()).toBe(false); /* migrate: tylko true */
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); expect(screen.getByTestId('week-tiles').props.accessibilityHint).toBe('Otwiera Postępy.'); await tap(screen.getByTestId('week-tiles')); await flushAll(10); expect(screen.UNSAFE_root.findAll((n: { type: unknown }) => n.type === 'RNSScreenStackHeaderConfig').map((n: { props: { title?: string } }) => n.props.title)).toContain('Postępy');
    await fresh(); const t = mkTpl('Pull'); const w = addWorkout(new Date(2026, 9, 7, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Nogi'); void w; plan.setWeekDay(3, t.id); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); const btns = screen.getAllByRole('button').map(b => b.props.accessibilityLabel);
    expect(btns.indexOf('Powtórz ostatni (Nogi)')).toBeGreaterThan(btns.indexOf('Pusty trening'));
  });
  test('UX-16 A: lista sesji pod kalendarzem idzie za oglądanym miesiącem; „Pokaż wszystkie” wraca', async () => {
    jest.useFakeTimers({ now: new Date(2026, 9, 8, 9) });
    await boot(() => { addWorkout(new Date(2026, 9, 2, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Październik'); addWorkout(new Date(2026, 8, 20, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Wrzesień'); }, '/history');
    expect(screen.getByText('Październik')).toBeTruthy(); expect(screen.getByText('Wrzesień')).toBeTruthy();
    await tap(screen.getByLabelText('Poprzedni miesiąc')); await flushAll(5); expect(screen.queryByText('Październik')).toBeNull(); expect(screen.getByText('Wrzesień')).toBeTruthy();
    await tap(screen.getByLabelText('Poprzedni miesiąc')); await flushAll(5); expect(screen.getByText('Brak treningów w tym miesiącu.')).toBeTruthy();
    await tap(screen.getByText('Pokaż wszystkie')); await flushAll(5); expect(screen.getByText('Październik')).toBeTruthy(); expect(screen.getByText('Wrzesień')).toBeTruthy();
  });
});

describe('H5 — „Zapisz jako szablon” i „Zaktualizować szablon?” (tylko na wybór użytkownika)', () => {
  const run = (t: Template, f: (w: Workout) => void = () => {}) => { store.startFromTemplate(t); const w = JSON.parse(JSON.stringify(S().active)) as Workout; f(w); return w; };
  test('logika templateDiff: ten sam skład — null; dodane, usunięte, inne serie, kolejność; „Pomiń dziś”, zamiana, wartości i deload — bez pytania', async () => {
    await fresh(); const t = mkTpl();
    expect(templateDiff(t, run(t))).toBeNull(); store.cancelWorkout();
    expect(templateDiff(t, run(t, w => { w.exercises[0].sets.forEach(s => { s.weight = 200; s.reps = 1; s.done = true; }); }))).toBeNull(); store.cancelWorkout(); /* inne wartości — progresja */
    expect(templateDiff(t, run(t, w => { w.exercises[1].skipped = true; w.exercises[1].sets = []; }))).toBeNull(); store.cancelWorkout();
    expect(templateDiff(t, run(t, w => { w.exercises[1].swappedFrom = w.exercises[1].exerciseId; w.exercises[1].exerciseId = ex('Lat Pulldown').id; w.exercises[1].sets.push(store.emptySet()); }))).toBeNull(); store.cancelWorkout();
    expect(templateDiff(t, run(t, w => { w.deload = true; w.exercises[0].sets.pop(); }))).toBeNull(); store.cancelWorkout();
    const d = templateDiff(t, run(t, w => { w.exercises.splice(1, 1); w.exercises[0].sets.push({ ...store.emptySet(), kind: 'normal' }); w.exercises.unshift({ ...w.exercises[0], id: 'n', tplItemId: undefined, exerciseId: ex('Plank').id }); }))!;
    expect(d).toEqual({ added: ['Plank'], removed: ['Pull Up'], sets: ['Bench Press (Barbell)'.replace('(Barbell)', '(sztanga)')], order: false }); store.cancelWorkout();
    expect(templateDiffText(d)).toBe('Dodane: Plank.\nUsunięte: Pull Up.\nInne serie: Bench Press (sztanga).'); expect(templateDiffText({ added: [], removed: [], sets: [], order: true })).toBe('Inna kolejność ćwiczeń.');
    expect(templateDiff(t, run(t, w => { w.exercises.reverse(); }))).toMatchObject({ order: true }); store.cancelWorkout();
    expect(templateDiff(undefined, run(t))).toBeNull(); store.cancelWorkout(); t.archived = true; expect(templateDiff(t, run(t))).toBeNull();
  });
  test('updateTemplateFromWorkout: skład jak w treningu; pozycje zachowują ustawienia i wartości wierszy tego samego rodzaju; nowe ćwiczenie z wartościami z treningu', async () => {
    await fresh(); const t = mkTpl(); const w = run(t, x => { x.exercises[0].sets.push({ ...store.emptySet(), kind: 'normal', weight: 62.5, reps: 8 }); const pl = { ...x.exercises[1], id: 'p', tplItemId: undefined, exerciseId: ex('Plank').id, sets: [{ ...store.emptySet(), durationSec: 45, done: true }] }; x.exercises.push(pl); });
    updateTemplateFromWorkout(t, w); const [a, b, c] = t.items;
    expect(t.items.map(i => i.exerciseId)).toEqual([ex('Bench Press (sztanga)').id, ex('Pull Up').id, ex('Plank').id]);
    expect(store.tplRows(a).map(r => [r.kind, r.weight])).toEqual([['warmup', 40], ['normal', 60], ['normal', 60], ['drop', 40], ['normal', 62.5]]); expect([a.repMin, a.repMax, a.sets]).toEqual([6, 8, 5]);
    expect(b.restSec).toBe(120); expect(store.tplRows(c).map(r => r.durationSec)).toEqual([45]); expect(c.targetSec).toBe(45); store.cancelWorkout(); expect(templateDiff(t, run(t))).toBeNull(); /* następny trening z tego szablonu — bez pytania */
  });
  test('templateFromWorkout: nowy szablon z sesji (nazwa bez powtórzeń, serie z rodzajami, miejsce, supersety); ćwiczenia usunięte pominięte', async () => {
    await fresh(); const l = addLocation('home'); mkTpl('Nogi'); const w = addWorkout(Date.now() - 86400e3, [['Back Squat', [{ kind: 'warmup', weight: 40, reps: 10 }, { weight: 100, reps: 5 }]], ['Plank', [{ durationSec: 60 }]]], 'Nogi');
    w.locationId = l.id; w.exercises[0].groupId = 'g'; w.exercises[1].groupId = 'g'; const n = S().templates.length;
    const t = templateFromWorkout(w); expect(S().templates.length).toBe(n + 1); expect(t.name).toBe('Nogi (2)'); expect(t.locationId).toBe(l.id);
    expect(store.tplRows(t.items[0]).map(r => [r.kind, r.weight, r.reps])).toEqual([['warmup', 40, 10], ['normal', 100, 5]]); expect(t.items[0].groupId).toBeTruthy(); expect(t.items[1].groupId).toBe(t.items[0].groupId);
    await act(async () => { await store.flush(); }); await fresh(saved()); expect(S().templates.find(x => x.id === t.id)!.items).toHaveLength(2); /* po restarcie */
  });
  test('ekran: szczegóły sesji — „Zapisz jako szablon” otwiera nowy szablon w podglądzie', async () => {
    let id = ''; await boot(() => { id = addWorkout(Date.now() - 86400e3, [['Back Squat', [{ weight: 100, reps: 5 }]]], 'Moje nogi').id; });
    await go(`/history/${id}`); await flushAll(10); const b = screen.getByText('Zapisz jako szablon'); expect(screen.getByLabelText('Zapisz jako szablon').props.accessibilityHint).toBe('Nowy szablon z ćwiczeniami i seriami tej sesji.');
    await tap(b); await flushAll(10); expect(S().templates.map(x => x.name)).toContain('Moje nogi'); expect(screen.getByLabelText('Start: Moje nogi')).toBeTruthy();
  });
  test('ekran: po treningu z dodanym ćwiczeniem — „Zaktualizować szablon?”: „Tylko ten raz” zostawia szablon, „Zaktualizuj szablon” go zmienia', async () => {
    for (const choice of ['Tylko ten raz', 'Zaktualizuj szablon']) {
      let tid = ''; await boot(() => { tid = mkTpl().id; store.startFromTemplate(S().templates.find(x => x.id === tid)!); store.addExerciseToActive(ex('Plank')); const a = S().active!; a.exercises[0].sets[1].done = true; store.save(a); });
      await tap(screen.getAllByText('Zakończ')[0]); await act(async () => { pressAlert('Zakończyć trening?', 'Zakończ'); }); await flushAll(600);
      const al = alertOf('Zaktualizować szablon „Push”?')!; expect(al.msg).toBe('Dodane: Plank.\nSzablon zmieni się tylko po „Zaktualizuj szablon”.');
      expect(al.buttons!.map(b => [b.text, b.style])).toEqual([['Tylko ten raz', 'cancel'], ['Zaktualizuj szablon', undefined]]);
      await act(async () => { pressAlert('Zaktualizować szablon „Push”?', choice); }); await flushAll(5);
      expect(S().templates.find(x => x.id === tid)!.items.length).toBe(choice === 'Tylko ten raz' ? 2 : 3);
    }
  });
  test('ekran: skład bez zmian — bez pytania', async () => {
    let tid = ''; await boot(() => { tid = mkTpl().id; store.startFromTemplate(S().templates.find(x => x.id === tid)!); const a = S().active!; a.exercises[0].sets[1].done = true; store.save(a); });
    await tap(screen.getAllByText('Zakończ')[0]); await act(async () => { pressAlert('Zakończyć trening?', 'Zakończ'); }); await flushAll(600); expect(alertOf('Zaktualizować szablon „Push”?')).toBeUndefined();
  });
});

describe('trening w toku: notatka szablonu, licznik serii roboczych, notka medyczna, opis gestu', () => {
  test('notatka szablonu widoczna w treningu (VoiceOver „Notatka szablonu: …”); licznik „Postęp treningu” liczy serie robocze (drop z serią, bez rozgrzewek)', async () => {
    await boot(() => { const t = mkTpl(); store.startFromTemplate(t); });
    expect(screen.getByLabelText('Notatka szablonu: Wysiłek: zwykle 0–3 powtórzenia w zapasie (RIR); do upadku nie trzeba.')).toBeTruthy();
    /* Bench: W + 2 normalne + drop = 2 robocze; Pull Up: 2 → 4 */
    expect(screen.getByLabelText('Postęp treningu: 0 z 4 serii')).toBeTruthy();
    await act(async () => { const a = S().active!; a.exercises[0].sets[0].done = true; store.save(a); }); await flushAll(5); expect(screen.getByLabelText('Postęp treningu: 0 z 4 serii')).toBeTruthy(); /* rozgrzewka */
    await act(async () => { const a = S().active!; a.exercises[0].sets[1].done = true; a.exercises[0].sets[2].done = true; a.exercises[0].sets[3].done = true; store.save(a); }); await flushAll(5);
    expect(screen.getByLabelText('Postęp treningu: 2 z 4 serii')).toBeTruthy(); /* drop razem z serią przed nim */
    expect(screen.getByText('Aplikacja nie udziela porad medycznych. Przy bólu, urazie albo chorobie skonsultuj się z lekarzem lub fizjoterapeutą.')).toBeTruthy();
    expect(screen.getByText('Przesuń serię albo nazwę ćwiczenia w lewo, by je usunąć.', { exact: false })).toBeTruthy();
  });
  test('L1: notka medyczna także w edycji sesji, generatorze i Ustawieniach; EN', async () => {
    let id = ''; await boot(() => { id = addWorkout(Date.now() - 86400e3, [['Back Squat', [{ weight: 100, reps: 5 }]]]).id; });
    const note = 'Aplikacja nie udziela porad medycznych. Przy bólu, urazie albo chorobie skonsultuj się z lekarzem lub fizjoterapeutą.';
    for (const u of [`/history/edit/${id}`, '/generator', '/more/settings']) { await go(u); await flushAll(20); expect([u, screen.getAllByText(note).length > 0]).toEqual([u, true]); }
    await boot(undefined, '/more/settings', 'en'); expect(screen.getByText(/^The app doesn’t give medical advice\./)).toBeTruthy();
  });
});

describe('F7 — przyciski przejścia bez podwójnego ekranu', () => {
  test('podwójne „Plan tygodnia” w Kalendarzu otwiera jeden ekran planu', async () => {
    await boot(undefined, '/history'); const b = screen.getByText('Plan tygodnia'); await act(async () => { fireEvent.press(b); fireEvent.press(b); }); await flushAll(10); /* oba w jednym act — jak dwa tapnięcia w ~100 ms (testowy słuchacz nawigacji przesuwa zegar po każdym przejściu) */
    const { store: rs } = require('expo-router/build/global-state/router-store'); const names: string[] = [];
    const walk = (st: { routes?: { name: string; state?: unknown }[] } | undefined) => st?.routes?.forEach(r => { names.push(r.name); walk(r.state as never); }); walk(rs.navigationRef.getRootState());
    expect(names.filter(n => n === 'plan')).toHaveLength(1);
  });
});
