/*
 * M1-audytor-generalny-037 część A (DEC-07 b, właściciel 27.10.2026: „wybrane przed zgłoszeniem 1.0”; źródła 02-monetyzacja-002, 08-programista-005,
 * 04-studio-projektowe-006; uwaga T-11 z telefonu, build 1031): wiersz w sekcji „Subskrypcja” w Ustawieniach miał zawsze tytuł „Pełna wersja”, więc
 * w stanie darmowym czytał się jak opis posiadanego stanu, nie jak wejście do zakupu. Teraz tytuł zależy od stanu:
 *  - darmowy: „Zobacz plany Pro” — ta sama etykieta co pozostałe wejścia na ekran zakupu (okno „Uczciwe zasady”, karta po imporcie: „Zobacz plany Pro ›”;
 *    zasada CLAUDE.md „akcje tego samego typu — ta sama etykieta”, docs/32 wzorzec 17), podtytuł = licznik darmowych dni;
 *  - z dostępem: „Masz plan: {rodzaj planu}” (np. „Masz plan: roczny”, 28.10.2026) — to samo brzmienie co nagłówek karty stanu na ekranie zakupu (DEC-09 a), podtytuł = data albo „na zawsze”.
 * BRD: BR-ZAK-003 (scenariusz „Wiersz w Ustawieniach”). Rodzaje (docs/20): ekran, języki (PL, EN, wszystkie słowniki), VoiceOver, ciemny wygląd.
 * E2E: .maestro/21-subskrypcja.yaml, .maestro/35-ustawienia-dostepnosc.yaml, .maestro/56-uczciwe-zasady.yaml (stukają wiersz po nowym tytule).
 */
import * as fs from 'fs';
import * as path from 'path';
import * as store from '@/lib/store';
import { applyLang } from '@/lib/i18n';
import { PAYWALL, type Entitlement } from '@/lib/access';
import { setStoreAdapter, resetStoreAdapterForTests } from '@/lib/store-adapter';
import { createFakeStore } from '@/lib/store-fake';
import { resetEntitlementsForTests } from '@/lib/entitlement';
import { fresh, saved, addWorkout } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';

const NOW = new Date(2026, 9, 27, 12, 0).getTime(); const DAY = 86400e3;
const ent = (plan: Entitlement['plan'], extra: Partial<Entitlement> = {}): Entitlement => ({ plan, source: 'purchase', expiresAt: plan === 'lifetime' ? null : NOW + 9 * DAY, ...extra });
const settle = async () => { for (let i = 0; i < 8; i++) await flushAll(10); };
const liveW = (n: number) => { for (let i = 0; i < n; i++) { const w = addWorkout(NOW - (i + 1) * DAY, [['Back Squat', [{ weight: 100, reps: 5, done: true }]]], 'Upper A'); w.live = true; w.tzOffsetMin = -new Date(w.startedAt).getTimezoneOffset(); store.recordLiveDayFor(w); } };
async function boot(opts: { ents?: Entitlement[]; live?: number; locale?: 'pl' | 'en'; theme?: 'dark' } = {}) {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, opts.locale ?? 'en'); resetEntitlementsForTests(); PAYWALL.ENABLED = true;
  setStoreAdapter(createFakeStore(opts.ents ?? [])); liveW(opts.live ?? 0); if (opts.theme) store.getState().settings.theme = opts.theme;
  store.save(); await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: opts.locale ?? 'en', url: '/more/settings' }); jest.setSystemTime(NOW); await settle();
}
afterEach(() => { PAYWALL.ENABLED = false; resetEntitlementsForTests(); resetStoreAdapterForTests(); applyLang('pl'); jest.useRealTimers(); });

describe('M1-037 A / DEC-07 b: wiersz w sekcji „Subskrypcja” — tytuł zależny od stanu (akcja w stanie darmowym, plan po zakupie)', () => {
  test('darmowy (EN): tytuł „See Pro plans” zamiast nazwy produktu; podtytuł licznik; przycisk prowadzi na ekran zakupu', async () => {
    await boot({ live: 2 });
    expect(screen.getByText('Subscription')).toBeTruthy();
    expect(screen.getByText('See Pro plans')).toBeTruthy();
    expect(screen.queryByText('Full version')).toBeNull();
    const row = screen.getByLabelText('See Pro plans. Free training days this month: 2 of 5 used');
    expect(row.props.accessibilityRole).toBe('button');
    await tap(row); await settle();
    expect(screen.getByTestId('plan-yearly')).toBeTruthy();
  });
  test('darmowy (PL): „Zobacz plany Pro. Darmowe dni treningowe w tym miesiącu: wykorzystano 1 z 5”', async () => {
    await boot({ live: 1, locale: 'pl' });
    expect(screen.getByLabelText('Zobacz plany Pro. Darmowe dni treningowe w tym miesiącu: wykorzystano 1 z 5')).toBeTruthy();
    expect(screen.queryByText('Pełna wersja')).toBeNull();
  });
  test.each([
    ['miesięczny', ent('monthly'), 'Your plan: monthly', /^Your plan: monthly\. Access until /],
    ['roczny z Chmury rodzinnej', ent('yearly', { source: 'family' }), 'Your plan: yearly', /^Your plan: yearly\. Access until /],
    ['dożywotni', ent('lifetime'), 'Your plan: lifetime', 'Your plan: lifetime. You have access forever'],
  ])('z dostępem (%s): tytuł nazywa plan jak nagłówek ekranu zakupu, bez oferty i licznika', async (_n, e, title, want) => {
    await boot({ ents: [e as Entitlement] });
    expect(screen.getByText(title as string)).toBeTruthy();
    const row = screen.getByLabelText(want as string | RegExp);
    expect(row.props.accessibilityRole).toBe('button');
    expect(screen.queryByText('See Pro plans')).toBeNull(); expect(screen.queryByText('Full version')).toBeNull();
    expect(screen.queryByText(/Free training days this month/)).toBeNull();
    await tap(row); await settle();
    expect(screen.getByTestId('paywall-owned-title').props.children).toBe(title);
  });
  test('ciemny wygląd: wiersz w stanie darmowym renderuje się i otwiera ekran zakupu', async () => {
    await boot({ theme: 'dark' });
    await tap(screen.getByLabelText(/^See Pro plans\./)); await settle();
    expect(screen.getByTestId('plan-yearly')).toBeTruthy();
  });
});

describe('M1-037 A: jedna etykieta wejścia na ekran zakupu we wszystkich językach', () => {
  const dir = path.join(__dirname, '..', 'lib', 'locales');
  const en = fs.readFileSync(path.join(__dirname, '..', 'lib', 'i18n.en.ts'), 'utf8');
  test('EN: „Zobacz plany Pro” = „Zobacz plany Pro ›” bez znaku przejścia (Item dokłada „›” sam)', () => {
    expect(en).toContain("'Zobacz plany Pro': 'See Pro plans'");
    expect(en).toContain("'Zobacz plany Pro ›': 'See Pro plans ›'");
  });
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && f !== '_source.json');
  test.each(files)('%s: tytuł wiersza = etykieta przycisku „Zobacz plany Pro ›” bez „ ›” (ta sama akcja, ta sama nazwa)', (f) => {
    const d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as Record<string, string>;
    const withArrow = d['Zobacz plany Pro ›'];
    if (withArrow === undefined) { expect(d['Zobacz plany Pro']).toBeUndefined(); return; } /* nakładka regionalna bez różnic wobec języka bazowego */
    expect(withArrow.endsWith(' ›')).toBe(true);
    expect(d['Zobacz plany Pro']).toBe(withArrow.slice(0, -2));
  });
});
