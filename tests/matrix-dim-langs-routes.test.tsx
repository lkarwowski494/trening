/*
 * Macierz LANGS × wszystkie ekrany z app/ (audyt 0.10, fala 2, obszar TESTY — M3 / TST-03, A11-10). Dawne testy języków (matrix-dim-langs1–4)
 * obejmowały 11 starych tras; ekrany 0.10 (plan, generator, przewodnik, zamiana, wybór ćwiczenia, kolejność, trening wstecz, miejsce, masa ciała,
 * O aplikacji, licencje) sprawdzano najwyżej po angielsku. Tu: każdy język z LANGS (motyw na zmianę jasny/ciemny), stan z danymi (plan tygodnia,
 * miejsce, zakończony trening, trening w toku), każda trasa z app/ (lista porównana z plikami — nowy ekran wchodzi sam) — na ekranie nie zostaje
 * żaden tekst interfejsu po polsku, który ma tłumaczenie w tym języku, ani polskie litery; kolory z palety wybranego motywu.
 */
import * as RN from 'react-native';
import { Appearance } from 'react-native';
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import * as locations from '@/lib/locations';
import { LANGS, lang, type Lang } from '@/lib/i18n';
import { EN } from '@/lib/i18n.en';
import { LOCALES } from '@/lib/locales';
import { light, dark } from '@/lib/theme';
import { renderApp, flushAll, screen, go } from './app';
import { fresh, seedWithDemo } from './helpers';
import { routeGaps } from './routes';

jest.setTimeout(600000);
const S = () => store.getState();
let scheme: 'light' | 'dark' = 'light';
beforeAll(() => {
  jest.spyOn(Appearance, 'setColorScheme').mockImplementation(((v: string | null | undefined) => { if (v === 'light' || v === 'dark') scheme = v; }) as never);
  jest.spyOn(RN, 'useColorScheme').mockImplementation((() => scheme) as never);
});
afterAll(() => jest.restoreAllMocks());

/** Stan z danymi w języku `l`: plan tygodnia, miejsce, zakończony trening, trening w toku, pomiar masy ciała. */
async function richState(l: Lang) {
  await fresh(seedWithDemo(l), l === 'pl' ? 'pl' : 'en');
  const tpl = S().templates[0]; const loc = locations.addLocation('gym'); for (let i = 0; i < 7; i += 2) plan.setWeekDay(i, tpl.id);
  store.addBodyMass(80, store.localISODate());
  store.startFromTemplate(tpl); store.toggleDone(0, 0); store.toggleDone(0, 1); const w = store.finishWorkout(Date.now())!;
  store.startFromTemplate(tpl); store.toggleDone(0, 0);
  return { s: JSON.parse(JSON.stringify(S())), w, tpl, exId: S().exercises[0].id, locId: loc.id, blockId: S().active!.exercises[0].id };
}
const routesFor = (r: Awaited<ReturnType<typeof richState>>) => [
  '/', '/templates', '/exercises', '/history', '/more', '/more/settings', '/more/progress', '/more/locations', '/more/backup', '/more/language', '/more/bands',
  `/template/${r.tpl.id}`, `/exercise/${r.exId}`, `/history/${r.w.id}`, `/history/edit/${r.w.id}`, '/plan', '/generator', '/guide', `/swap?target=active:${r.blockId}`,
  '/picker?target=active', '/reorder?target=active', '/history/add', `/more/location/${r.locId}`, '/more/bodymass', '/more/about', '/more/licenses',
  '/generator?mode=own', /* 09.10.2026 (B): „Plan z moich szablonów” */
];
type Node = { type?: unknown; props?: Record<string, unknown>; children?: unknown[] } | string;
const texts = () => { const out: string[] = []; const walk = (n: unknown) => { if (!n) return; if (typeof n === 'string') { out.push(n); return; } if (Array.isArray(n)) { n.forEach(walk); return; } walk((n as { children?: unknown }).children); }; walk(screen.toJSON()); return out; };
const bgs = () => { const out = new Set<string>(); const walk = (n: unknown) => { if (!n || typeof n === 'string') return; if (Array.isArray(n)) { n.forEach(walk); return; } const x = n as { props?: { style?: unknown }; children?: unknown }; for (const st of [x.props?.style].flat(9) as { backgroundColor?: string }[]) if (st && st.backgroundColor) out.add(String(st.backgroundColor)); walk(x.children); }; walk(screen.toJSON()); return out; };
/** Klucze ≥ 3 znaków: krótsze („do”, „od”) zbiegają się ze skrótami dat innych języków (nl „do” = czwartek) — nie są dowodem przecieku. */
const PL_KEYS = Object.keys(EN).filter(k => k.trim().length > 2);
/** To samo słowo w obu językach (np. „Plan” w de, „Lista” w fi) nie jest przeciekiem polskiego tekstu. */
const dictOf = (l: Lang): Record<string, string> => (l === 'en' ? EN : (LOCALES as Record<string, Record<string, string>>)[l]) ?? {};

test('lista tras macierzy języków = wszystkie ekrany z app/', async () => {
  const r = await richState('pl'); expect(routeGaps(routesFor(r))).toEqual({ missing: [], unknown: [] });
});

describe.each(LANGS.filter(l => l !== 'pl').map((l, i) => [l, i % 2 ? 'dark' : 'light'] as const))('%s (motyw %s): każdy ekran z app/', (l, th) => {
  test('bez polskich tekstów interfejsu i polskich liter; kolory z palety motywu', async () => {
    const r = await richState(l); r.s.settings.language = l; r.s.settings.theme = th; scheme = th;
    await renderApp({ saved: r.s }); await flushAll(10); expect(lang()).toBe(l);
    const d = dictOf(l); const tr = new Set(Object.values(d)); let hits = 0; const leaks: string[] = []; const plLetters: string[] = []; const bg = new Set<string>(); const shown: string[] = [];
    for (const route of routesFor(r)) {
      await go(route); await flushAll(10); const all = texts(); shown.push(`${route}:${all.length}`);
      for (const x of all) { const k = x.trim(); if (tr.has(k)) hits++; if (PL_KEYS.includes(k) && d[k] !== undefined && d[k] !== k && !tr.has(k) /* to samo słowo jako tłumaczenie innego tekstu (cs „pauza”, nl „do”) */) leaks.push(`${route}: „${k}”`); if (/[łśźżŁŚŹŻ]/.test(x)) plLetters.push(`${route}: „${x.slice(0, 40)}”`); }
      bgs().forEach(c => bg.add(c));
    }
    expect([l, leaks]).toEqual([l, []]); expect([l, plLetters]).toEqual([l, []]);
    expect(shown.filter(x => x.endsWith(':0'))).toEqual([]); /* każdy ekran coś pokazał */
    expect(hits).toBeGreaterThan(150); /* ekrany naprawdę pokazały teksty ze słownika tego języka (porównanie nie jest puste) */
    const pal = th === 'light' ? light : dark, other = th === 'light' ? dark : light;
    expect([l, th, bg.has(pal.bg), [other.bg, other.surface, other.surface2].filter(c => bg.has(c))]).toEqual([l, th, true, []]);
  });
});
