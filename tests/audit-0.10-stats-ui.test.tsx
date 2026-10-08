/*
 * Audyt 0.10 (08.10.2026) — ekrany napraw obszaru „statystyki” (E1, E3, E4, E5, D3, UI-13). Logika: tests/audit-0.10-stats.test.ts.
 * Rodzaje (docs/20): ekran (teksty i liczby na ekranach), scenariusz (Ustawienia → masa ciała → Postępy), VoiceOver (etykieta pola), języki (EN).
 */
import * as store from '@/lib/store';
import { applyLang } from '@/lib/i18n';
import { applyUnit } from '@/lib/units';
import { BW_SHARE } from '@/lib/stats';
import { base, uid, type Template } from '@/lib/seed';
import { fresh, saved, addWorkout, ex } from './helpers';
import { renderApp, flushAll, screen, go, act, fireEvent, openCard, type as typeText } from './app';

jest.setTimeout(30000);
const NOW = new Date(2026, 9, 8, 18).getTime();
const at = (m: number, d: number, h = 18) => new Date(2026, m, d, h).getTime();
const S = () => store.getState();
const boot = async (fn: () => void = () => {}, url?: string, locale: 'pl' | 'en' = 'pl') => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); fn(); store.save(); await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url, locale }); await flushAll(10);
};
const endEdit = async (el: Parameters<typeof fireEvent>[0]) => { await act(async () => { fireEvent(el, 'endEditing'); }); };
afterEach(() => { applyLang('pl'); applyUnit('kg'); });
const rows = (kinds: ('normal' | 'drop' | 'warmup')[]) => kinds.map((k, i) => ({ id: 'r' + i, kind: k, reps: 8 as const, weight: 100 as const, durationSec: '' as const, distanceM: '' as const }));
const tplD = (): Template => ({ ...base(), id: 'td', name: 'D', items: [{ id: 'i1', exerciseId: ex('Back Squat').id, sets: 5, repMin: 5, repMax: 8, restSec: 120, startWeight: 100, targetSec: '', groupId: null, rows: rows(['warmup', 'normal', 'normal', 'normal', 'drop']) }] });
const sqDrop = (d: number) => addWorkout(at(9, d), [['Back Squat', [{ kind: 'warmup', warmup: true, weight: 60, reps: 5 }, { weight: 100, reps: 5 }, { weight: 100, reps: 5 }, { weight: 100, reps: 5 }, { kind: 'drop', weight: 70, reps: 8 }]]]);

describe('E1: masa ciała w Ustawieniach i e1RM w Postępach', () => {
  test('Ustawienia: pole „Masa ciała (kg)” z opisem; wpis 80 zapisuje kg, puste pole usuwa; w lb — wpis w funtach, zapis w kg', async () => {
    await boot(undefined, '/more/settings');
    const p = Math.round(BW_SHARE['Push Up'] * 100);
    expect(screen.getByText('Opcjonalnie, tylko w telefonie. Z nią aplikacja liczy e1RM w podciąganiu (cała masa ciała — uproszczenie) i w pompkach (ok. {p}% masy ciała — badania z platformą siłową). Zmiana przelicza e1RM wszystkich treningów; puste pole — bez e1RM w tych ćwiczeniach.'.replace('{p}', String(p)))).toBeTruthy();
    const f = screen.getByLabelText('Masa ciała (kg)'); expect(f.props.value).toBe('');
    await typeText(f, '80,5'); await endEdit(f); await flushAll(5); expect(S().settings.bodyMass).toBe(80.5);
    await typeText(screen.getByLabelText('Masa ciała (kg)'), ''); await flushAll(5); expect('bodyMass' in S().settings).toBe(false);
    await act(async () => { S().settings.unit = 'lb'; store.applyPrefs(); store.save(); }); await flushAll(5);
    await typeText(screen.getByLabelText('Masa ciała (lb)'), '176'); await flushAll(5); expect(S().settings.bodyMass).toBeCloseTo(176 * 0.45359237, 1);
  });
  test('Postępy Pull Up: bez masy ciała — brak wiersza e1RM i wskazówka; z masą ciała — „126,67 kg (masa ciała + 46,67)” i opis uproszczenia', async () => {
    await boot(() => { addWorkout(at(9, 1), [['Pull Up', [{ addKg: 20, reps: 8 }]]]); });
    await go(`/more/progress?ex=${ex('Pull Up').id}`); await flushAll(10);
    expect(screen.queryByText('e1RM (Epley)')).toBeNull(); expect(screen.queryByText('e1RM (dociążenie)')).toBeNull();
    expect(screen.getByText('e1RM pojawi się po wpisaniu masy ciała w Ustawieniach.')).toBeTruthy(); expect(screen.getByText('Max dociążenie')).toBeTruthy();
    await act(async () => { S().settings.bodyMass = 80; store.save(); }); await flushAll(5);
    expect(screen.getByText('e1RM (Epley)')).toBeTruthy(); expect(screen.getByText('126,67 kg (masa ciała + 46,67)')).toBeTruthy();
    expect(screen.getByText('e1RM: wzór Epleya na 100% masy ciała z Ustawień plus dociążenie (uproszczenie).')).toBeTruthy();
  });
  test('Postępy Chest Dip (bez źródła udziału masy ciała): „Bez e1RM…” także z masą ciała; ćwiczenie z ciężarem — bez notki', async () => {
    await boot(() => { S().settings.bodyMass = 80; addWorkout(at(9, 1), [['Chest Dip', [{ addKg: 10, reps: 5 }]], ['Back Squat', [{ weight: 100, reps: 5 }]]]); });
    await go(`/more/progress?ex=${ex('Chest Dip').id}`); await flushAll(10);
    expect(screen.getByText('Bez e1RM: brak źródeł, jaką część masy ciała podnosisz w tym ćwiczeniu.')).toBeTruthy(); expect(screen.queryByText('e1RM (Epley)')).toBeNull();
    await go(`/more/progress?ex=${ex('Back Squat').id}`); await flushAll(10);
    expect(screen.getByText('e1RM (Epley)')).toBeTruthy(); expect(screen.queryByText(/^Bez e1RM|^e1RM pojawi się|^e1RM: wzór/)).toBeNull();
  });
  test('ekran ćwiczenia: opis masy ciała mówi prawdę o e1RM (masa ciała z Ustawień, udział ze źródeł), bez „masa ciała nie wchodzi do obliczeń”', async () => {
    await boot(); await go(`/exercise/${ex('Pull Up').id}`); await flushAll(10);
    const p = Math.round(BW_SHARE['Push Up'] * 100);
    expect(screen.getByText(new RegExp(`liczy się tylko z masą ciała wpisaną w Ustawieniach .*pompki \\(ok\\. ${p}% — badania z platformą siłową\\)\\.`))).toBeTruthy();
    expect(screen.queryByText(/nie wchodzi do obliczeń/)).toBeNull();
  });
  test('EN: Settings field and Progress note', async () => {
    await boot(() => { addWorkout(at(9, 1), [['Pull Up', [{ addKg: 20, reps: 8 }]]]); }, '/more/settings', 'en');
    expect(screen.getByLabelText('Body weight (kg)')).toBeTruthy();
    await go(`/more/progress?ex=${ex('Pull Up').id}`); await flushAll(10); expect(screen.getByText('e1RM will appear once you enter your body weight in Settings.')).toBeTruthy();
  });
});

describe('E4 / MER-10: przypisanie partii — „uproszczenie, nie wynik badań” na ekranie ćwiczenia', () => {
  test('ćwiczenie z biblioteki i własne: dopisek przy partiach (do czasu źródeł dla danego ćwiczenia — seed.MUSCLE_SOURCES)', async () => {
    await boot(); await go(`/exercise/${ex('Back Squat').id}`); await flushAll(10);
    expect(screen.getByText(/^Przypisanie partii mięśniowych — uproszczenie, nie wynik badań\./)).toBeTruthy();
    const own = store.newExercise('Moje'); await flushAll(5); await go(`/exercise/${own.id}`); await flushAll(10);
    expect(screen.getByText(/^Przypisanie partii mięśniowych — uproszczenie, nie wynik badań\./)).toBeTruthy();
  });
});

describe('E3 / X-08: karta „Ostatni trening” liczy rekordy jak okno po treningu', () => {
  test('110 × 5 po 100 × 5: „2 rekordy” (suma treningu i e1RM), było „1 rekord”', async () => {
    await boot(() => { addWorkout(at(9, 1), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }]]]); addWorkout(at(9, 3), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 110, reps: 5 }]]]); });
    expect(screen.getByText(/ · 2 serie · .* · 2 rekordy$/)).toBeTruthy();
  });
});

describe('D3 / UI-13: liczba serii roboczych na ekranach — rozgrzewka poza, drop razem z serią', () => {
  test('Trening (karta szablonu), Kolejność, edytor szablonu: „3 serie” dla rozgrzewki + 3 serii + dropa', async () => {
    await boot(() => { S().templates.push(tplD()); });
    expect(screen.getByLabelText(/^D, /).props.accessibilityLabel).toMatch(/3 serie/);
    await go('/reorder?target=template:td'); await flushAll(10); expect(screen.getByText('3 serie')).toBeTruthy(); expect(screen.queryByText(/^[45] serie$/)).toBeNull();
    await go('/template/td'); await flushAll(10); expect(screen.getByText(/^3 serie · 1 rozgrz\./)).toBeTruthy();
  });
  test('trening w toku — Kolejność liczy serie robocze, ✓ — odhaczone robocze', async () => {
    await boot(() => { S().templates.push(tplD()); store.startFromTemplate(S().templates.find(t => t.id === 'td')!); const a = S().active!; a.exercises[0].sets[0].done = true; a.exercises[0].sets[1].done = true; store.save(a); });
    await go('/reorder?target=active'); await flushAll(10); expect(screen.getByText('3 serie · ✓ 1')).toBeTruthy();
  });
  test('Historia (lista) i edycja historii: „3 serie” (edycja: „3 serie · 1 rozgrz.”); Postępy: opis uproszczenia drop setu', async () => {
    let id = ''; await boot(() => { id = sqDrop(6).id; }, '/history');
    expect(screen.getAllByText(/ · 3 serie · /).length).toBeGreaterThan(0); expect(screen.queryByText(/ · 4 serie · /)).toBeNull();
    await go(`/history/edit/${id}`); await flushAll(20); expect(screen.getByText('3 serie · 1 rozgrz.')).toBeTruthy();
    await go('/more/progress'); await flushAll(10); expect(screen.getByText(/Uproszczenie: drop set liczy się razem z serią, po której jest\./)).toBeTruthy();
  });
});

describe('E5: teksty prawdziwe dla działania aplikacji', () => {
  test('MER-13: edytor szablonu — opis podpowiedzi „↑ spróbuj …” z górą zakresu; brak przy zakresie otwartym „8+” i przy wyłączonej podpowiedzi', async () => {
    await boot(() => { const t = tplD(); t.items[0].rows = rows(['normal', 'normal']); S().templates.push(t); });
    await go('/template/td'); await flushAll(10); await openCard(0);
    expect(screen.getByText('Zakres powtórzeń: 5–8 — gdy ostatnio wszystkie serie robocze miały co najmniej 8 powt., przy ćwiczeniu pojawi się podpowiedź „↑ spróbuj …”: większy ciężar albo powtórzenie więcej (poza tygodniem deload).')).toBeTruthy();
    expect(screen.queryByText(/↑ więcej/)).toBeNull();
    await act(async () => { const it = S().templates.find(t => t.id === 'td')!.items[0]; it.repMax = 3; store.save(); }); await flushAll(5); /* „do” < „od” → „5+” */
    expect(screen.queryByText(/^Zakres powtórzeń: 5\+/)).toBeNull();
    await act(async () => { const it = S().templates.find(t => t.id === 'td')!.items[0]; it.repMax = 8; S().settings.progressHint = false; store.save(); }); await flushAll(5);
    expect(screen.queryByText(/^Zakres powtórzeń: 5–8 —/)).toBeNull();
  });
  test('MER-15: ekran Gumy — zdanie prawdziwe dla asysty i oporu', async () => {
    await boot(undefined, '/more/bands');
    expect(screen.getByText(/Guma jako asysta \(np\. podciąganie\): rekordem są powtórzenia bez gumy, a postęp to zejście na niższy poziom\. Guma jako opór: rekordy liczą serie z gumą\.$/)).toBeTruthy();
    expect(screen.queryByText(/którą gumą pomagałeś/)).toBeNull();
  });
});
