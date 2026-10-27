/*
 * „Co nowego” (decyzja właściciela 08.10.2026): przycisk „i” w lewym górnym rogu ekranu Trening, kropka po aktualizacji (tylko u kogoś, kto już
 * trenował), sekcja rozwijana: bieżący wpis na górze, starsze zwinięte. State.whatsNewSeen (id wpisu). Wzór: Organizer (karta po aktualizacji).
 * 1.0.0 (decyzja właściciela 14.10.2026, docs/18): pierwsza wersja w App Store — historia pusta; bez wpisów nie ma przycisku, kropki ani panelu.
 * Zachowanie przy wpisach (pierwszy wpis 1.1) sprawdzają próbki z tests/whatsnew-probki.ts.
 * Rodzaje (docs/20): logika (lista wpisów, kropka), dane (zapis/odczyt, sanityzacja, dane bez pola 1:1), ekran (położenie, kropka, rozwijanie,
 * starsze wpisy, zamknięcie, brak w trakcie treningu, pusta historia), VoiceOver (etykieta z informacją o nowościach, stan rozwinięcia), języki (EN).
 * E2E: .maestro/13, 31, 34, 35 (1.0.0: przycisku nie ma).
 */
import * as store from '@/lib/store';
import { WHATS_NEW, whatsNewUnseen, markWhatsNewSeen } from '@/lib/whatsnew';
import { applyLang } from '@/lib/i18n';
import { fresh, addWorkout, saved, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';
import { PROBKI, zProbkami } from './whatsnew-probki';

const NOW = new Date(2026, 9, 8, 18, 0);
const S = () => store.getState();
beforeEach(async () => { jest.useFakeTimers({ now: NOW }); await fresh(); });
afterEach(() => { applyLang('pl'); });
const boot = async (fn: () => void = () => {}, locale: 'pl' | 'en' = 'pl') => { await fresh(undefined, locale); fn(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url: '/' }); jest.setSystemTime(NOW.getTime()); await flushAll(10); };
const withWorkout = () => { addWorkout(new Date(2026, 9, 7, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]); };

describe('1.0.0: pusta historia (pierwsza wersja w App Store)', () => {
  test('lista w kodzie jest pusta', () => { expect(WHATS_NEW).toEqual([]); });
  test('kropka nigdy, także po treningu i przy zapisanym id starego wpisu; markWhatsNewSeen nic nie zapisuje', () => {
    expect(whatsNewUnseen()).toBe(false);
    withWorkout(); expect(whatsNewUnseen()).toBe(false);
    S().whatsNewSeen = '2026-10-17'; expect(whatsNewUnseen()).toBe(false); /* osoba po aktualizacji z 0.20 */
    const rev = store.getRev(); markWhatsNewSeen(); expect(store.getRev()).toBe(rev); expect(S().whatsNewSeen).toBe('2026-10-17');
  });
  test('ekran Trening: bez przycisku ✦, kropki i panelu — nowa osoba i osoba po aktualizacji; tytuł ekranu na miejscu', async () => {
    await boot(); expect(screen.queryByTestId('whats-new-i')).toBeNull(); expect(screen.queryByTestId('whats-new')).toBeNull(); expect(screen.getAllByText('Trening').length).toBeGreaterThan(0);
    await boot(() => { withWorkout(); S().whatsNewSeen = '2026-10-17'; });
    expect(screen.queryByTestId('whats-new-i')).toBeNull(); expect(screen.queryByTestId('whats-new-dot')).toBeNull(); expect(screen.queryByLabelText(/Co nowego/)).toBeNull();
  });
  test('panel wywołany bezpośrednio przy pustej historii nie renderuje niczego (bez błędu)', async () => {
    await boot(); const { WhatsNewPanel } = require('@/components/WhatsNew'); const { render } = require('@testing-library/react-native');
    const r = render(<WhatsNewPanel onClose={() => {}} />); expect(r.toJSON()).toBeNull();
  });
});

describe('logika i dane (próbki wpisów)', () => {
  zProbkami();
  test('próbki spełniają regułę wpisów: unikalne id, od najnowszego, numery buildów rosną; każdy ma 2–10 punktów zakończonych kropką', () => {
    const ids = WHATS_NEW.map(e => e.id); expect(new Set(ids).size).toBe(ids.length);
    expect([...WHATS_NEW].sort((a, b) => b.date.localeCompare(a.date)).map(e => e.id)).toEqual(ids);
    const builds = WHATS_NEW.map(e => e.build).filter((b): b is number => b != null); expect([...builds].sort((a, b) => b - a)).toEqual(builds);
    WHATS_NEW.forEach(e => { const it = e.items(); expect(it.length).toBeGreaterThanOrEqual(2); expect(it.length).toBeLessThanOrEqual(10); it.forEach(x => expect(x).toMatch(/\.$/)); });
  });
  test('kropka: nowa osoba (bez treningów) — nie; po treningu — tak; otwarcie zapisuje id najnowszego wpisu; nowy wpis — znowu tak', () => {
    expect(whatsNewUnseen()).toBe(false);
    addWorkout(new Date(2026, 9, 7, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]); expect(whatsNewUnseen()).toBe(true);
    markWhatsNewSeen(); expect(S().whatsNewSeen).toBe(WHATS_NEW[0].id); expect(whatsNewUnseen()).toBe(false);
    const rev = store.getRev(); markWhatsNewSeen(); expect(store.getRev()).toBe(rev); /* drugi raz bez zapisu */
    S().whatsNewSeen = WHATS_NEW[1].id; expect(whatsNewUnseen()).toBe(true); /* starszy wpis przeczytany → po aktualizacji kropka */
  });
  test('zapis i odczyt; sanityzacja (tylko niepusty tekst do 40 znaków); dane bez pola przechodzą bez dopisywania go', async () => {
    markWhatsNewSeen(); await store.flush(); await fresh(saved()); expect(S().whatsNewSeen).toBe(WHATS_NEW[0].id);
    for (const bad of [7, '', 'x'.repeat(41), null, { a: 1 }]) { (S() as any).whatsNewSeen = bad; store.save(); await store.flush(); await fresh(saved()); expect('whatsNewSeen' in S()).toBe(false); }
    expect(S().userTouched).not.toBe(true); /* stan ekranu, nie dane treningowe */
  });
});

describe('ekran Trening (próbki wpisów)', () => {
  zProbkami();
  test('„i” w lewym górnym rogu — przed tytułem; bez treningów bez kropki', async () => {
    await boot();
    const i = screen.getByTestId('whats-new-i'); expect(i.props.accessibilityLabel).toBe('Co nowego'); expect(screen.queryByTestId('whats-new-dot')).toBeNull();
    const tree = JSON.stringify(screen.toJSON()); expect(tree.indexOf('whats-new-i')).toBeLessThan(tree.indexOf('"Trening"')); /* pierwszy w wierszu nagłówka, przed tytułem */
  });
  test('9A (11.10.2026): ikona „Co nowego” to iskierka ✦, nie litera „i”; testID i etykieta VoiceOver bez zmian', async () => {
    await boot();
    const i = screen.getByTestId('whats-new-i'); const glyphs = i.findAll(n => (n.type as unknown) === 'Text').map(n => [n.props.children].flat().join(''));
    expect(glyphs).toEqual(['✦']); expect(i.props.accessibilityLabel).toBe('Co nowego'); expect(i.props.accessibilityRole).toBe('button');
  });
  test('nowa osoba: panel z informacją „Zaczynasz od tej wersji” i przyciskiem przewodnika', async () => {
    await boot(); await tap(screen.getByTestId('whats-new-i')); await flushAll(5);
    expect(screen.getByText('Zaczynasz od tej wersji — poniżej zmiany dla osób, które korzystały z poprzednich. Na start przyda się przewodnik.')).toBeTruthy();
    expect(screen.getByText('Przewodnik po funkcjach')).toBeTruthy();
  });
  test('kropka po aktualizacji; otwarcie: bieżący wpis, starsze zwinięte; kropka znika; „Zamknij” i ponowne „i” zwijają', async () => {
    await boot(withWorkout);
    expect(screen.getByTestId('whats-new-dot')).toBeTruthy(); expect(screen.getByLabelText('Co nowego — są nowe zmiany')).toBeTruthy();
    expect(screen.queryByTestId('whats-new')).toBeNull();
    await tap(screen.getByTestId('whats-new-i')); await flushAll(5);
    expect(screen.getByTestId('whats-new')).toBeTruthy(); expect(screen.getByRole('header', { name: 'Co nowego' })).toBeTruthy();
    expect(screen.queryByText(/^Zaczynasz od tej wersji/)).toBeNull(); /* tylko nowa osoba */
    expect(screen.getByTestId('whats-new-i').props.accessibilityState).toEqual({ expanded: true });
    expect(screen.getByText(/^Wersja testowa 1018 · /)).toBeTruthy();
    for (const x of WHATS_NEW[0].items()) expect(screen.getByText(`• ${x}`)).toBeTruthy();
    expect(screen.queryByTestId('whats-new-dot')).toBeNull(); expect(S().whatsNewSeen).toBe(WHATS_NEW[0].id);
    const oldItem = `• ${PROBKI[2].items()[0]}`; expect(screen.queryByText(oldItem)).toBeNull();
    expect(screen.getByText(/^▸ Wersja testowa 1005 · 10 paź 2026$/)).toBeTruthy();
    const head = screen.getByText(/^▸ Wersja testowa 1002 · 7 paź 2026$/); expect(head).toBeTruthy(); /* H3 (audyt 0.10): miesiąc słownie */
    expect(screen.getByLabelText('Wersja testowa 1002 · 7 paź 2026').props.accessibilityState).toEqual({ expanded: false }); /* A11-18: stan w expanded, nie w etykiecie */
    await tap(head); await flushAll(5); expect(screen.getByText(oldItem)).toBeTruthy(); expect(screen.getByText(/^▾ Wersja testowa 1002/)).toBeTruthy();
    await tap(screen.getByText(/^▸ Wersja testowa 1005/)); await flushAll(5); expect(screen.queryByText(oldItem)).toBeNull(); /* otwarcie innego zwija poprzedni */
    for (const x of PROBKI[1].items()) expect(screen.getByText(`• ${x}`)).toBeTruthy();
    await tap(screen.getByText('Zamknij')); await flushAll(5); expect(screen.queryByTestId('whats-new')).toBeNull();
    await tap(screen.getByTestId('whats-new-i')); await flushAll(5); expect(screen.getByTestId('whats-new')).toBeTruthy();
    await tap(screen.getByTestId('whats-new-i')); await flushAll(5); expect(screen.queryByTestId('whats-new')).toBeNull();
  });
  test('wpis bez numeru buildu: „W tej wersji”', async () => {
    WHATS_NEW.unshift({ id: 'probka-4', date: '2026-10-20', items: () => ['Niewydany punkt.', 'Drugi niewydany punkt.'] });
    await boot(withWorkout); await tap(screen.getByTestId('whats-new-i')); await flushAll(5);
    expect(screen.getByText('W tej wersji')).toBeTruthy(); expect(screen.getByText('• Niewydany punkt.')).toBeTruthy();
  });
  test('w trakcie treningu „i” nie ma (ekran treningu)', async () => {
    await boot(() => { const [tpl] = withDemoTemplates(); store.startFromTemplate(tpl); });
    expect(screen.queryByTestId('whats-new-i')).toBeNull();
  });
  test('English', async () => {
    await boot(withWorkout, 'en');
    expect(screen.getByLabelText("What's new — new changes")).toBeTruthy();
    await tap(screen.getByTestId('whats-new-i')); await flushAll(5);
    expect(screen.getByText(/^Test build 1018 · 19 Oct 2026$/)).toBeTruthy(); expect(screen.getByText(/^▸ Test build 1005 · 10 Oct 2026$/)).toBeTruthy(); expect(screen.getByText('Close')).toBeTruthy();
  });
});
