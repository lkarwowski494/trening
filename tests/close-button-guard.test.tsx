/*
 * Test-strażnik zasady „zamykanie okien” (właściciel, 13.10.2026, decyzja 1A; docs/22, docs/32 wzorzec 1): każde okno wysuwane z dołu / modalne ma widoczny, spójny
 * przycisk zamknięcia w nagłówku po LEWEJ — ta sama etykieta „Anuluj” (HIG Sheets), testID `close-modal`, rola „przycisk”; gest w dół zostaje dodatkowo.
 * Rodzaje (docs/20): niezmiennik (skan źródeł: trasy z presentation ≠ card, <Modal>), ekran (każde okno renderuje przycisk i go zamyka), języki (EN),
 * wygląd (jasny i ciemny motyw). Nowe okno bez przycisku = czerwony test.
 */
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative, sep } from 'path';
import * as store from '@/lib/store';
import { PAYWALL } from '@/lib/access';
import { resetEntitlementsForTests } from '@/lib/entitlement';
import { resetStoreAdapterForTests } from '@/lib/store-adapter';
import { applyLang } from '@/lib/i18n';
import { CLOSE_TEST_ID } from '@/components/CloseButton';
import { fresh, saved, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';

jest.setTimeout(60000);
const ROOT = join(__dirname, '..');
const walk = (d: string): string[] => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const rel = (p: string) => relative(ROOT, p).split(sep).join('/');
const src = (p: string) => readFileSync(p, 'utf8');

/** Adres, pod którym okno otwiera się w teście (nowa trasa modalna bez wpisu tutaj = czerwony test). */
export const MODAL_URLS: Record<string, string> = { picker: '/picker', swap: '/swap', adapt: '/adapt', 'place-once': '/place-once', 'pick-template': '/pick-template', paywall: '/paywall?reason=settings' };
/** Warianty zawartości, w których przycisk też ma być (np. ekran zakupu przy każdym powodzie otwarcia). */
const EXTRA_URLS = ['/paywall?reason=limit', '/paywall?reason=first', '/paywall?reason=settings'];

/** Trasy z presentation innym niż zwykła karta — ze wszystkich layoutów w app/. */
function modalRoutes(): { name: string; presentation: string; file: string }[] {
  const out: { name: string; presentation: string; file: string }[] = [];
  for (const f of walk(join(ROOT, 'app')).filter(x => /_layout\.tsx$/.test(x))) {
    for (const m of src(f).matchAll(/<Stack\.Screen\s+name="([^"]+)"\s+options=\{\{([^}]*)\}\}/g)) {
      const p = /presentation:\s*'([^']+)'/.exec(m[2]); if (p && !/^(card|regular)$/.test(p[1])) out.push({ name: m[1], presentation: p[1], file: rel(f) });
    }
  }
  return out;
}

describe('strażnik: źródła', () => {
  test('lista tras modalnych jest niepusta i rozpoznaje wszystkie presentation z layoutów (także formSheet, sheet, transparentModal)', () => {
    const all = walk(join(ROOT, 'app')).filter(x => /_layout\.tsx$/.test(x)).map(src).join('\n');
    expect((all.match(/presentation:/g) ?? []).length).toBe(modalRoutes().length); expect(modalRoutes().length).toBeGreaterThanOrEqual(4);
  });
  test('presentation poza layoutami (opcje ekranu) nie omija strażnika: brak w app/ poza _layout i w components/', () => {
    const others = [...walk(join(ROOT, 'app')).filter(x => !/_layout\.tsx$/.test(x)), ...walk(join(ROOT, 'components'))].filter(x => /\.tsx?$/.test(x) && /presentation\s*[:=]/.test(src(x)));
    expect(others.map(rel)).toEqual([]);
  });
  test.each(modalRoutes())('trasa „$name” ($presentation): ma wpis w MODAL_URLS i plik ekranu używa useCloseHeader/CloseButton', ({ name }) => {
    expect(Object.keys(MODAL_URLS)).toContain(name);
    const f = join(ROOT, 'app', name + '.tsx'); expect(statSync(f).isFile()).toBe(true); expect(src(f)).toMatch(/useCloseHeader\(|<CloseButton/);
  });
  test('MODAL_URLS nie ma wpisów bez trasy modalnej', () => { expect(Object.keys(MODAL_URLS).sort()).toEqual(modalRoutes().map(r => r.name).sort()); });
  test('każdy <Modal> z react-native (arkusz) jest w pliku z <CloseButton>; nikt nie używa własnego przycisku „Zamknij” w oknach', () => {
    const files = [...walk(join(ROOT, 'app')), ...walk(join(ROOT, 'components'))].filter(x => /\.tsx$/.test(x) && !/CloseButton\.tsx$/.test(x) && /<Modal[\s>]/.test(src(x)));
    expect(files.map(rel)).toEqual(['components/StartPanel.tsx']);
    for (const f of files) expect(src(f)).toContain('<CloseButton');
  });
  test('przycisk jest rysowany w jednym miejscu: testID close-modal tylko w components/CloseButton.tsx', () => {
    const using = [...walk(join(ROOT, 'app')), ...walk(join(ROOT, 'components'))].filter(x => /\.tsx?$/.test(x) && /close-modal/.test(src(x)));
    expect(using.map(rel)).toEqual(['components/CloseButton.tsx']); expect(CLOSE_TEST_ID).toBe('close-modal');
  });
});

type Nav = { routes: { name: string; state?: Nav }[] };
const stack = () => { const { store: rs } = require('expo-router/build/global-state/router-store'); let st: Nav = rs.navigationRef.getRootState();
  while (st.routes.length === 1 && st.routes[0].name === '__root' && st.routes[0].state) st = st.routes[0].state; return st.routes.map(r => r.name); };
const go = async (href: string) => { await act(async () => { require('expo-router').router.push(href as never); }); for (let i = 0; i < 6; i++) await flushAll(10); };
async function boot(locale: 'pl' | 'en', theme: 'light' | 'dark') {
  jest.useFakeTimers({ now: new Date(2026, 9, 13, 9, 0) }); await fresh(undefined, locale); PAYWALL.ENABLED = true; resetEntitlementsForTests(); withDemoTemplates(locale);
  store.getState().settings.theme = theme; store.save(); await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url: '/' }); await flushAll(10);
}
afterEach(() => { PAYWALL.ENABLED = false; resetEntitlementsForTests(); resetStoreAdapterForTests(); applyLang('pl'); jest.restoreAllMocks(); jest.useRealTimers(); });

describe.each([['pl', 'Anuluj', 'light'], ['en', 'Cancel', 'dark']] as const)('okna renderują ten sam przycisk zamknięcia (%s, motyw %s)', (locale, label, theme) => {
  test.each([...new Set([...Object.values(MODAL_URLS), ...EXTRA_URLS])])(`%s: „${label}” w nagłówku (testID, rola, etykieta), stuknięcie zamyka okno`, async url => {
    await boot(locale, theme); await go(url);
    const open = stack(); expect(open[open.length - 1]).toBe(url.slice(1).split('?')[0]);
    const b = screen.getByTestId(CLOSE_TEST_ID); expect(b.props.accessibilityRole).toBe('button'); expect(b.props.accessibilityLabel).toBe(label);
    expect(screen.getAllByText(label).length).toBeGreaterThan(0); expect(screen.getAllByTestId(CLOSE_TEST_ID)).toHaveLength(1);
    await tap(b); await flushAll(10); expect(stack()).toEqual(['(tabs)']);
  });
  test(`arkusz „Inny trening”: „${label}” obok tytułu (testID, rola, etykieta), stuknięcie zamyka arkusz; tło arkusza nie jest drugim przyciskiem`, async () => {
    await boot(locale, theme); await tap(screen.getByLabelText(locale === 'pl' ? 'Inny trening' : 'Other workout')); await flushAll(5);
    expect(screen.getByTestId('other-sheet')).toBeTruthy(); const b = screen.getByTestId(CLOSE_TEST_ID); expect(b.props.accessibilityRole).toBe('button'); expect(b.props.accessibilityLabel).toBe(label);
    expect(screen.getAllByLabelText(label)).toHaveLength(1); expect(screen.getByTestId('other-sheet-scrim').props.accessible).toBe(false);
    await tap(b); await flushAll(5); expect(screen.queryByTestId('other-sheet')).toBeNull();
  });
});
