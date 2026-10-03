/* Warstwa C planu testów (09): automatyczne miary UX na wyrenderowanych ekranach. */
import { StyleSheet, TextInput } from 'react-native';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { dark, light } from '@/lib/theme';
import { LIB, metricFor, type Equipment } from '@/lib/seed';
import { rowLayout } from '@/components/ActiveWorkout';
import { renderApp, tap, flushAll, screen, go, act, type } from './app';
import { ex, pressAlert, seedWithDemo } from './helpers';

jest.setTimeout(60000);
afterEach(async () => { try { store.getState(); } catch { return; } /* runda 68: test uruchomiony osobno, bez wczytanego stanu */ await timer.stop(); await timer.stopSet(); });

/** Wszystkie teksty wyrenderowane na ekranie (w tym tytuły przycisków i placeholdery). */
function allTexts(): string[] {
  const out: string[] = [];
  const walk = (n: any) => { if (!n) return; if (typeof n === 'string') { out.push(n); return; } if (Array.isArray(n)) { n.forEach(walk); return; } if (n.props) { if (typeof n.props.placeholder === 'string') out.push(n.props.placeholder); if (typeof n.props.accessibilityLabel === 'string') out.push(n.props.accessibilityLabel); } (n.children ?? []).forEach(walk); };
  walk(screen.toJSON()); return out;
}
const act0 = async (f: () => void) => { await act(async () => { f(); }); await flushAll(10); };

/* C1 (docs/09) — dwie ścieżki. Od 03.10.2026 świeża instalacja nie ma szablonów (decyzja właściciela), więc „≤ 2 tapnięcia” dotyczy
 * użytkownika z szablonem (tu: szablony demonstracyjne), a świeża instalacja ma własny, zmierzony wynik (runda 82b, weryfikacja 6ea37a3 LOW 6). */
test('C1a z szablonem: od uruchomienia do pierwszej odhaczonej serii ≤ 2 tapnięcia (Start, ✓)', async () => {
  await renderApp({ saved: seedWithDemo() }); let taps = 0;
  await tap(screen.getByLabelText('Start: Upper A')); taps++;
  await tap(screen.getAllByLabelText(/^Seria 1 zrobiona/)[0]); taps++;
  expect(store.getState().active!.exercises[0].sets[0].done).toBe(true); expect(taps).toBeLessThanOrEqual(2);
});

test('C1b świeża instalacja (bez szablonów): 4 tapnięcia (Pusty trening, + Dodaj ćwiczenie, ćwiczenie, ✓) plus wpis ciężaru i powtórzeń', async () => {
  await renderApp(); let taps = 0;
  expect(store.getState().templates).toEqual([]); expect(screen.queryByLabelText(/^Start: /)).toBeNull(); /* nie ma skrótu „Start” */
  await tap(screen.getByText('Pusty trening')); taps++;
  await tap(screen.getByText('+ Dodaj ćwiczenie')); taps++; await flushAll(20);
  await tap(screen.getByText('Bench Press (hantle)')); taps++; await flushAll(20); /* lista bez szukania — pierwszy ekran wyboru */
  /* bez historii i bez szablonu nic się nie wstawia — ciężar i powtórzenia trzeba wpisać (pola, nie tapnięcia w miarze C1) */
  const a = store.getState().active!; expect([a.exercises[0].sets[0].weight, a.exercises[0].sets[0].reps]).toEqual(['', '']);
  await type(screen.getAllByLabelText('kg/hantel')[0], '20'); await type(screen.getAllByLabelText('Powtórzenia')[0], '8');
  await tap(screen.getAllByLabelText(/^Seria 1 zrobiona/)[0]); taps++;
  expect(a.exercises[0].sets[0]).toMatchObject({ done: true, weight: 20, reps: 8 }); expect(taps).toBe(4);
});

test('C2+C3 przyciski z ikoną mają opis, cele dotykowe ≥ 44 pt', async () => {
  await renderApp();
  await act0(() => { store.getState().settings.showRpe = true; store.startEmpty(); ['Chin Up', 'Plank', 'Back Squat', 'Bieg'].forEach(n => store.addExerciseToActive(ex(n))); });
  await tap(screen.getAllByLabelText('Połącz z następnym w superset')[0]);
  await tap(screen.getAllByLabelText(/^Seria 1 zrobiona/)[2]); // przerwa → pasek −15/+15
  const buttons = [...screen.queryAllByRole('button'), ...screen.queryAllByRole('checkbox')];
  const unlabeled = buttons.map(b => b.props.accessibilityLabel as string | undefined).filter(l => !l || !/\p{L}/u.test(l));
  expect(unlabeled).toEqual([]);
  const small = [/^Seria 1 zrobiona/, 'Start stopera serii'].flatMap(l => screen.getAllByLabelText(l)).map(el => StyleSheet.flatten(el.props.style)).filter(st => (st?.height ?? st?.minHeight ?? 0) < 44);
  expect(small).toEqual([]);
  const idx = screen.getAllByLabelText(/Seria 1, typ/).map(el => StyleSheet.flatten(el.props.style)).filter(st => (st?.minHeight ?? 0) < 44);
  expect(idx).toEqual([]);
});

test('C4 wiersz serii mieści się na 375 i 320 pt dla każdego ćwiczenia z biblioteki', () => {
  const bad: string[] = [];
  for (const [name, , eq, band] of LIB) for (const rpe of [false, true]) for (const width of [375, 320]) {
    const L = rowLayout(metricFor(name), !!band, rpe, width); if (L.fixedW > L.avail) bad.push(`${name} rpe=${rpe} w=${width}: ${L.fixedW}>${L.avail}`);
    void (eq as Equipment);
  }
  expect(bad).toEqual([]);
});

const lum = (hex: string) => { const c = hex.replace('#', '').match(/../g)!.map(x => parseInt(x, 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
test('C5 kontrast motywów (WCAG): tekst ≥ 4,5, duże elementy ≥ 3', () => {
  const fails: string[] = [];
  for (const [name, th] of [['dark', dark], ['light', light]] as const) {
    const need = (fg: string, bg: string, min: number, what: string) => { const r = ratio(fg, bg); if (r < min) fails.push(`${name} ${what}: ${r.toFixed(2)} < ${min}`); };
    for (const bg of [th.bg, th.surface, th.surface2]) { need(th.text, bg, 4.5, 'text'); need(th.muted, bg, 4.5, 'muted'); need(th.band, bg, 4.5, 'band/PR'); need(th.danger, bg, 4.5, 'danger'); need(th.accent, bg, 3, 'accent (duże cyfry, zakładka)'); }
    need(th.accentInk, th.accent, 4.5, 'tekst na przycisku głównym'); need(th.text, th.done, 4.5, 'tekst w odhaczonej serii');
  }
  expect(fails).toEqual([]);
});

test('C6 English: żaden ekran nie pokazuje polskich tekstów interfejsu', async () => {
  await renderApp({ locale: 'en', saved: seedWithDemo('en') });
  const s = store.getState(); const tplId = s.templates[0].id; const exId = ex('Bench Press (hantle)').id;
  const pl = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]|\b(serii?|przerwa|Trening|Zakończ|Usuń|Ćwiczeni|pow\.|guma|sen)\b/;
  const leaks: string[] = [];
  // „Trening” w stopce „Trening 0.8.1 · …” to nazwa aplikacji (marka), nie tekst interfejsu.
  /* runda 75: także ścieżka w Plikach „On My iPhone → Trening → Backup” (nazwa aplikacji = folder) */
  const check = (where: string) => allTexts().filter(t => pl.test(t.replace(/^Trening \S* ·/, '').replace(/→ Trening →/g, '→'))).forEach(t => leaks.push(`${where}: ${t}`));
  for (const url of ['/', '/templates', '/exercises', '/history', '/more', '/more/settings', '/more/bands', '/more/morning', '/more/progress', '/more/backup', `/template/${tplId}`, `/exercise/${exId}`, '/picker?target=active']) { await go(url); await flushAll(10); check(url); }
  await go('/'); await tap(screen.getByLabelText('Start: Upper A')); await tap(screen.getAllByLabelText(/^Set 1 done/)[0]); check('workout');
  await tap(screen.getAllByText('Finish and save workout')[0]); pressAlert('Finish workout?', 'Finish'); await flushAll(500); check('history detail');
  expect(leaks).toEqual([]);
});

test('C7 akcje niszczące wymagają potwierdzenia', async () => {
  await renderApp({ saved: seedWithDemo() }); const s = store.getState();
  const expectConfirm = async (press: () => Promise<void>, title: string | RegExp) => { const n = global.__alerts.length; await press(); expect(global.__alerts.length).toBe(n + 1); expect(global.__alerts[global.__alerts.length - 1].title).toMatch(title); };
  const nTpl = s.templates.length;
  await go(`/template/${s.templates[0].id}`); await flushAll(10);
  await expectConfirm(() => tap(screen.getByText('Usuń')), 'Usunąć szablon?'); expect(s.templates.length).toBe(nTpl);
  await go(`/exercise/${ex('Back Squat').id}`); await flushAll(10);
  await expectConfirm(() => tap(screen.getByText('Usuń ćwiczenie')), 'Usunąć ćwiczenie?'); expect(ex('Back Squat').archived).toBeFalsy();
  await go('/more/bands'); await flushAll(10);
  await expectConfirm(() => tap(screen.getAllByLabelText('Usuń gumę')[0]), 'Usunąć gumę?'); expect(s.bands.length).toBe(3);
  await go('/more/settings'); await flushAll(10);
  await expectConfirm(() => tap(screen.getByText('Wyczyść wszystkie dane')), 'Na pewno?');
  await go('/more/backup'); await flushAll(10);
  await expectConfirm(() => tap(screen.getByText('Importuj backup')), 'Nadpisać dane?');
  await go('/'); await tap(screen.getByLabelText('Start: Upper A'));
  await expectConfirm(() => tap(screen.getAllByText('Anuluj trening')[0]), 'Anulować trening?'); expect(s.active).not.toBeNull();
  await expectConfirm(() => tap(screen.getAllByText('usuń')[0]), 'Usunąć z treningu?');
  await expectConfirm(() => tap(screen.getAllByText('Zakończ')[0]), /Zakończyć trening\?|Brak odhaczonych serii/); expect(s.active).not.toBeNull();
});

test('C8 puste stany mają tekst', async () => {
  await renderApp();
  await go('/history'); await flushAll(10); expect(screen.getByText(/pierwszy trening czeka/)).toBeTruthy();
  await go('/more/progress'); await flushAll(10); expect(screen.getByText(/Wykresy pojawią się/)).toBeTruthy();
  await act0(() => { store.getState().templates = []; store.save(); });
  await go('/templates'); await flushAll(10); expect(screen.getByText(/Brak szablonów/)).toBeTruthy();
});

test('C9 żaden ekran nie zgłasza ostrzeżeń Reacta (poza act w testach)', async () => {
  const errs: string[] = []; const spy = jest.spyOn(console, 'error').mockImplementation((...a: unknown[]) => { const m = String(a[0]); if (!/not wrapped in act/.test(m)) errs.push(m.slice(0, 160)); });
  await renderApp({ saved: seedWithDemo() }); const s = store.getState();
  for (const url of ['/', '/templates', '/exercises', '/history', '/more', '/more/settings', '/more/bands', '/more/morning', '/more/progress', '/more/backup', `/template/${s.templates[0].id}`, `/exercise/${s.exercises[0].id}`, '/picker?target=active']) { await go(url); await flushAll(10); }
  await go('/'); await tap(screen.getByLabelText('Start: Upper A')); await tap(screen.getAllByLabelText(/^Seria 1 zrobiona/)[0]); await flushAll(2000);
  spy.mockRestore(); expect(errs).toEqual([]);
});

test('C10 pola tekstowe ograniczają powiększenie tekstu', async () => {
  await renderApp({ saved: seedWithDemo() }); await tap(screen.getByLabelText('Start: Upper A'));
  const inputs = screen.UNSAFE_getAllByType(TextInput);
  expect(inputs.length).toBeGreaterThan(5);
  expect(inputs.filter(i => !(i.props.maxFontSizeMultiplier > 0))).toHaveLength(0);
  void pressAlert;
});
