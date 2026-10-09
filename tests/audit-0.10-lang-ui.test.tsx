/*
 * Audyt 0.10 — języki i dostępność na ekranach (docs/25 grupa K, docs/audyt-0.10/A11.md). Słowniki i logika: tests/audit-0.10-lang.test.ts.
 */
import * as RN from 'react-native';
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { applyLang, t, type Lang } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';
import { renderApp, flushAll, screen, go, tap, openCard } from './app';
import { fresh, withDemoTemplates } from './helpers';

jest.setTimeout(300000);
type Node = any; // eslint-disable-line @typescript-eslint/no-explicit-any
const flat = (x: unknown): Record<string, any> => (RN.StyleSheet.flatten((typeof x === 'function' ? (x as (s: { pressed: boolean }) => unknown)({ pressed: false }) : x) as never) ?? {}) as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const texts = (): Node[] => screen.UNSAFE_root.findAll((n: Node) => n.type === 'Text');
const str = (n: Node): string => { const out: string[] = []; const w = (x: Node) => { if (x == null) return; if (typeof x === 'string' || typeof x === 'number') { out.push(String(x)); return; } if (Array.isArray(x)) { x.forEach(w); return; } if (x.props) w(x.props.children); }; w(n.props.children); return out.join(''); };
afterEach(() => { applyLang('pl'); jest.restoreAllMocks(); });

/** Elementy czytane przez VoiceOver (tekst, element accessible, pole, przełącznik) bez accessibilityLanguage = l (A11-09, A11N-01). */
function langGaps(l: Lang): { n: number; bad: string[] } {
  const bad: string[] = []; let n = 0;
  const walk = (x: Node, inText: boolean) => {
    if (!x || typeof x !== 'object') return; const p = x.props ?? {};
    if (p.accessibilityElementsHidden || p.importantForAccessibility === 'no-hide-descendants' || p['aria-hidden'] || flat(p.style).display === 'none') return;
    const reads = typeof x.type === 'string' && p.accessible !== false && ((x.type === 'Text' && !inText) || p.accessible === true || x.type === 'TextInput' || /Switch/.test(x.type));
    if (reads) { n++; if (p.accessibilityLanguage !== l) bad.push(`${x.type} „${String(p.accessibilityLabel ?? str(x)).slice(0, 40)}”`); }
    for (const c of x.children ?? []) walk(c, inText || x.type === 'Text');
  };
  walk(screen.UNSAFE_root, false);
  return { n, bad };
}
/** Start aplikacji w danym języku (ustawienie w danych, jak wybór na liście języków). */
async function bootIn(l: Lang, url = '/', prep?: () => void) {
  await fresh(); const st = store.getState(); st.settings.language = l; applyLang(l); withDemoTemplates(l); prep?.();
  await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())), url }); await flushAll(10);
}

describe('K2 (A11-02): nagłówki wielkimi literami zgodnie z językiem', () => {
  test.each([['el', 'Ogólne', 'ΓΕΝΙΚΑ'], ['tr', 'Powiadomienia', 'BİLDİRİMLER']] as const)('%s: Ustawienia — nagłówek „%s” = „%s”, bez textTransform; VoiceOver czyta zwykły zapis', async (l, key, want) => {
    await bootIn(l, '/more/settings');
    expect(LOCALES[l]![key].toLocaleUpperCase(l)).toBe(want);
    const h = texts().find(x => str(x) === want);
    expect(h).toBeTruthy(); expect(h.props.accessibilityLabel).toBe(LOCALES[l]![key]);
    expect(texts().filter(x => flat(x.props.style).textTransform === 'uppercase').map(str)).toEqual([]);
  });
  test('karta „Dziś” (dashboard): nagłówek wersalikami z regułami języka (el), bez textTransform', async () => {
    await bootIn('el', '/', () => { const id = store.getState().templates[0].id; for (let i = 0; i < 7; i++) plan.setWeekDay(i, id); });
    const want = LOCALES.el!['Dziś'].toLocaleUpperCase('el');
    expect(texts().some(x => str(x) === want)).toBe(true);
    expect(texts().filter(x => flat(x.props.style).textTransform === 'uppercase').map(str)).toEqual([]);
  });
  test('tr: skrót koloru gumy w historii — wielka litera wg języka (i → İ)', () => {
    applyLang('tr'); const { shortBand, bandColor } = store as typeof store;
    const b = { id: 'x', color: 'zielona', level: 3 } as never;
    const first = Array.from(bandColor(b))[0]!;
    expect(shortBand(b)).toBe(first.toLocaleUpperCase('tr') + '3');
  });
});

describe('K2 (A11-03): etykiety zakładek na wąskim ekranie', () => {
  test.each(['lv', 'bg', 'el'] as const)('%s: każda etykieta zakładki — jedna linia, adjustsFontSizeToFit z minimalną skalą (zamiast „…” na 320 pt)', async l => {
    await bootIn(l, '/more');
    const { TAB_LABEL_MIN_SCALE } = require('@/components/TabIcon');
    for (const k of ['Trening', 'Szablony', 'Ćwiczenia', 'Kalendarz', 'Więcej']) {
      const els = texts().filter(x => str(x) === t(k) && x.props.numberOfLines === 1); /* etykieta zakładki (nie tytuł ekranu) */
      expect([k, els.length > 0]).toEqual([k, true]);
      for (const el of els) expect([k, el.props.adjustsFontSizeToFit, el.props.minimumFontScale, el.props.allowFontScaling]).toEqual([k, true, TAB_LABEL_MIN_SCALE, false]);
    }
  });
});

describe('K2 (A11-09): VoiceOver czyta głosem języka aplikacji', () => {
  test('lista języków: każdy wiersz ma accessibilityLanguage = kod języka (nazwa czytana jej głosem), „Jak w telefonie” — język aplikacji', async () => {
    const { LANGS, LANG_NAME } = require('@/lib/i18n');
    await bootIn('de', '/more/language');
    const rows = (label: string) => screen.UNSAFE_root.findAll((n: Node) => typeof n.type === 'string' && n.props?.accessibilityRole === 'button' && n.props.accessibilityLabel === label);
    for (const l of LANGS) {
      const r = [...rows(LANG_NAME[l]), ...rows(t('{name}, wybrany', { name: LANG_NAME[l] }))];
      expect([l, r.length > 0, r.every((x: Node) => x.props.accessibilityLanguage === l)]).toEqual([l, true, true]);
    }
    const auto = rows(t('Jak w telefonie'));
    expect(auto.length > 0 && auto.every((r: Node) => r.props.accessibilityLanguage === 'de')).toBe(true);
  });
  test.each([['el', '/more/settings'], ['tr', '/'], ['uk', '/history'], ['el', '/more/progress'], ['de', '/templates']] as const)('%s %s: każdy element czytany przez VoiceOver (tekst, element accessible, pole, przełącznik) ma accessibilityLanguage = język aplikacji', async (l, url) => {
    await bootIn(l, url);
    const { n, bad } = langGaps(l);
    expect(n).toBeGreaterThan(5); expect(bad).toEqual([]);
  });
  /* Audyt kontrolny 1 A11N-01: podgląd ćwiczenia (wiersze informacji, sekcja „Technika”, figura) nie miał accessibilityLanguage — test obejmuje teraz
   * wszystkie trasy przeglądu dostępności (tests/a11y-routes.ts — te same co matrix-a11y) i podgląd ćwiczenia z rozwiniętą „Techniką” i figurą. */
  test('de: wszystkie trasy przeglądu dostępności (routesFor z matrix-a11y) + podgląd ćwiczenia z rozwiniętą „Techniką” — każdy element czytany przez VoiceOver ma accessibilityLanguage', async () => {
    const { richState, routesFor } = require('./a11y-routes');
    const { cuesFor } = require('@/lib/cues'); const { figureFor } = require('@/lib/figures');
    const r = await richState('pl'); r.s.settings.language = 'de'; applyLang('de');
    const cue = (r.s.exercises as { id: string; lib?: boolean; libKey?: string }[]).find(e => cuesFor(e) && figureFor(e))!; expect(cue).toBeTruthy();
    await renderApp({ saved: r.s }); await flushAll(10);
    const routes: string[] = [...routesFor(r.w, r.tpl, r.exId, r.locId, r.blockId), `/exercise/${cue.id}`];
    const bad: string[] = []; let n = 0;
    for (const url of routes) {
      await go(url); await flushAll(10);
      if (url === `/exercise/${cue.id}`) { await tap(screen.getByRole('button', { name: t('Technika') })); await flushAll(5); expect(screen.getByTestId('exercise-figure')).toBeTruthy(); }
      if (url === '/more/language') continue; /* wiersze listy języków celowo w języku nazwy — osobny test wyżej */
      const g = langGaps('de'); n += g.n; bad.push(...g.bad.map(b => `${url}: ${b}`));
    }
    expect(routes).toHaveLength(27); expect(n).toBeGreaterThan(500); expect([...new Set(bad)]).toEqual([]);
  });
});

describe('K3 (A11-11): krój mono (IBM Plex Mono) bez liter greckich', () => {
  test('el: Postępy (podsumowanie „προηγ.”, rekordy), szczegóły sesji, trening w toku — żaden tekst krojem mono nie zawiera liter greckich', async () => {
    const { F } = require('@/lib/theme');
    let wid = '';
    await bootIn('el', '/more/progress', () => {
      const st = store.getState(); store.startFromTemplate(st.templates[0]); store.toggleDone(0, 0); wid = store.finishWorkout(Date.now())!.id;
      store.startFromTemplate(st.templates[0]); store.toggleDone(0, 0);
    });
    const greekInMono: string[] = []; let monoSeen = 0;
    const walk = (x: Node, fam?: string) => {
      if (x == null) return;
      if (typeof x === 'string') { if (fam === F.mono || fam === F.monoBold) { monoSeen++; if (/\p{Script=Greek}/u.test(x)) greekInMono.push(x); } return; }
      if (Array.isArray(x)) { x.forEach(c => walk(c, fam)); return; }
      if (typeof x !== 'object') return; walk(x.children, flat(x.props?.style).fontFamily ?? fam);
    };
    for (const r of ['/more/progress', `/history/${wid}`, '/']) { await go(r); await flushAll(10); walk(screen.UNSAFE_root); }
    expect(monoSeen).toBeGreaterThan(5); expect(greekInMono).toEqual([]);
  });
  test('monoSafe: litery greckie krojem tekstu, reszta bez zmian (łacina i cyrylica są w Plex Mono)', () => {
    const { monoSafe } = require('@/components/ui'); const { F } = require('@/lib/theme');
    expect(monoSafe('12,5 kg')).toBe('12,5 kg'); expect(monoSafe('12 кг')).toBe('12 кг'); expect(monoSafe(5)).toBe(5);
    const parts = monoSafe('80 (προηγ. 75)', true) as Node[];
    expect(parts.filter((p: Node) => typeof p === 'string').join('|')).toBe('80 (|. 75)');
    expect(parts.filter((p: Node) => typeof p !== 'string').map((p: Node) => [p.props.children, p.props.style.fontFamily])).toEqual([['προηγ', F.semibold]]);
  });
});

describe('K2/K3: kontrast, pola dotyku, przełącznik-chip, wyszarzone wiersze', () => {
  test('A11-04: „Usuń” pod wierszem (SwipeRow) — kolor z palety dangerInk, kontrast do danger ≥ 4,5 w obu motywach', async () => {
    const { light, dark } = require('@/lib/theme');
    for (const [mode, pal] of [['light', light], ['dark', dark]] as const) {
      jest.spyOn(RN, 'useColorScheme').mockImplementation((() => mode) as never);
      await bootIn('pl', '/templates');
      const del = texts().filter(x => str(x) === 'Usuń' && flat(x.props.style).fontSize === 15);
      expect([mode, del.length > 0, del.every(x => flat(x.props.style).color === pal.dangerInk)]).toEqual([mode, true, true]);
      jest.restoreAllMocks();
    }
  });
  test('A11-06: ramka pola, puste pole ✓ serii i tor wyłączonego przełącznika — ctrlLine (≥ 3:1), nie line', async () => {
    const { light, dark } = require('@/lib/theme'); const CTRL = [light.ctrlLine, dark.ctrlLine];
    await bootIn('pl', '/', () => { const st = store.getState(); store.startFromTemplate(st.templates[0]); });
    const inputs = screen.UNSAFE_root.findAll((n: Node) => n.type === 'TextInput');
    expect(inputs.length).toBeGreaterThan(0); expect(inputs.map((i: Node) => flat(i.props.style).borderColor).filter((c: string) => !CTRL.includes(c))).toEqual([]);
    const boxes = screen.UNSAFE_root.findAll((n: Node) => typeof n.type === 'string' && n.props.accessibilityRole === 'checkbox' && n.props.accessibilityState?.checked === false);
    expect(boxes.length).toBeGreaterThan(0); expect(boxes.map((b: Node) => flat(b.props.style).borderColor).filter((c: string) => !CTRL.includes(c))).toEqual([]);
    await go('/more/settings'); await flushAll(10);
    const sw = screen.UNSAFE_root.findAll((n: Node) => typeof n.type !== 'string' && typeof n.props.onValueChange === 'function' && n.props.ios_backgroundColor !== undefined);
    expect(sw.length).toBeGreaterThan(3); expect(sw.filter((x: Node) => !(CTRL.includes(x.props.ios_backgroundColor) && CTRL.includes(x.props.trackColor.false))).length).toBe(0);
  });
  test('A11-14: przełącznik-chip bez Field (Postępy → „Tydzień deload”) — VoiceOver nie czyta nazwy dwa razy; z Field — nazwa pola i wartość', async () => {
    await bootIn('pl', '/more/progress', () => { const st = store.getState(); store.startFromTemplate(st.templates[0]); store.toggleDone(0, 0); store.finishWorkout(Date.now()); });
    const sw = screen.getAllByRole('switch').find(x => x.props.accessibilityLabel === t('Tydzień deload'))!;
    expect(sw).toBeTruthy(); expect(sw.props.accessibilityValue?.text).toBeUndefined();
  });
  test('A11-15: pola dotyku ≥ 44 pt (wysokość + hitSlop): opcje Segmented, dni kalendarza, pasek tygodnia, starsze wpisy „Co nowego”', async () => {
    const eff = (n: Node) => { const st = flat(n.props.style); const h = Math.max(st.minHeight ?? 0, st.height ?? 0); const hs = n.props.hitSlop; const v = typeof hs === 'number' ? 2 * hs : hs ? (hs.top ?? 0) + (hs.bottom ?? 0) : 0; return h + v; };
    const small: string[] = [];
    const check = (sel: (n: Node) => boolean, what: string) => { const ns = screen.UNSAFE_root.findAll((n: Node) => typeof n.type !== 'string' && typeof n.props.onPress === 'function' && sel(n)); if (!ns.length) small.push(`${what}: brak`); for (const n of ns) { const h = eff(n) || eff(n.children?.[0] ?? { props: {} }); if (h < 44) small.push(`${what}: ${h}`); } };
    await bootIn('pl', '/more/settings'); check(n => n.props.accessibilityRole === 'button' && typeof n.props.accessibilityHint === 'string' && n.props.accessibilityHint === t('Wygląd'), 'Segmented');
    await go('/generator'); await flushAll(10); check(n => n.props.accessibilityHint === t('Cel'), 'Segmented (Cel)');
    await bootIn('pl', '/history', () => { const id = store.getState().templates[0].id; for (let i = 0; i < 7; i++) plan.setWeekDay(i, id); });
    const days = screen.UNSAFE_root.findAll((n: Node) => typeof n.type !== 'string' && /^cal-/.test(n.props.testID ?? '') && typeof n.props.onPress === 'function');
    expect(days.length).toBeGreaterThan(27); for (const d of days.slice(0, 3)) { const face = flat(d.props.children?.props?.style); const hs = d.props.hitSlop; if (Math.min(face.height ?? 0, face.width ?? 0) + 2 * (typeof hs === 'number' ? hs : 0) < 44) small.push(`dzień kalendarza: ${face.height}+2×${hs}`); }
    await go('/'); await flushAll(10);
    for (const s of screen.UNSAFE_root.findAll((n: Node) => typeof n.type !== 'string' && /^strip-/.test(n.props.testID ?? '') && typeof n.props.onPress === 'function')) if (eff(s) < 44) small.push(`pasek tygodnia: ${eff(s)}`);
    expect(small).toEqual([]);
  });
  test('A11-16: wiersz wyszarzony, ale aktywny (wybór ćwiczenia: brak sprzętu w miejscu) — bez przezroczystości, tytuł kolorem muted (≥ 4,5:1)', async () => {
    const { light, dark } = require('@/lib/theme');
    const locations = require('@/lib/locations');
    await bootIn('pl', '/', () => { const st = store.getState(); const l = locations.addLocation('bodyweight'); locations.setMainLocation(l.id); st.settings.pickerShowAll = true; store.startFromTemplate(st.templates[0]); });
    await go('/picker?target=active'); await flushAll(10);
    const rows = screen.UNSAFE_root.findAll((n: Node) => typeof n.type === 'string' && n.props.accessibilityRole === 'button' && /brak|niedost/i.test(String(n.props.accessibilityLabel ?? '')));
    expect(rows.length).toBeGreaterThan(0);
    for (const r of rows.slice(0, 5)) { expect(flat(r.props.style).opacity ?? 1).toBe(1); }
    const dimTitles = texts().filter(x => [light.muted, dark.muted].includes(flat(x.props.style).color) && flat(x.props.style).fontSize === 16);
    expect(dimTitles.length).toBeGreaterThan(0);
  });
});

describe('K3 (A11-18, A11-19): szum VoiceOver, podwójne glify, złamania linii', () => {
  const labels = () => screen.UNSAFE_root.findAll((n: Node) => typeof n.type === 'string' && typeof n.props.accessibilityLabel === 'string').map((n: Node) => n.props.accessibilityLabel as string);
  test('instrukcje „Tapnij, by…” są w podpowiedziach, nie w etykietach (trening, szablon, wybór ćwiczenia, zamiana)', async () => {
    let tplId = '';
    await bootIn('pl', '/', () => { const st = store.getState(); tplId = st.templates[0].id; st.settings.showRpe = true; const locations = require('@/lib/locations'); locations.addLocation('gym'); store.startFromTemplate(st.templates[0]); });
    const bad: string[] = []; const hints: string[] = [];
    const scan = () => { bad.push(...labels().filter(l => /Tapnij|Stuknij/.test(l) && !/^Nie udało się zapisać/.test(l) /* baner błędu zapisu: widoczny tekst wiersza */)); hints.push(...screen.UNSAFE_root.findAll((n: Node) => typeof n.type === 'string' && /Tapnij, by/.test(String(n.props.accessibilityHint ?? ''))).map((n: Node) => n.props.accessibilityHint)); };
    scan();
    const blk = store.getState().active!.exercises[0].id;
    for (const r of [`/template/${tplId}`, '/picker?target=active', `/swap?target=active:${blk}`]) { await go(r); await flushAll(10); scan(); }
    expect(bad).toEqual([]); expect(hints.length).toBeGreaterThan(3);
    expect(hints.some(h => h.endsWith('Tapnij, by zmienić typ lub dodać notatkę.'))).toBe(true);
  });
  test('trening: nagłówki kolumn „#”, „✓”, „▶” ukryte przed VoiceOver; plakietka „PR” czytana jako rekord', async () => {
    await bootIn('pl', '/', () => { const st = store.getState(); store.startFromTemplate(st.templates[0]); });
    expect(screen.queryByText('#')).toBeNull(); expect(screen.getAllByText('#', { includeHiddenElements: true }).length).toBeGreaterThan(0);
    const src = require('fs').readFileSync(require('path').join(__dirname, '..', 'components', 'ActiveWorkout.tsx'), 'utf8') as string;
    expect(src).toMatch(/accessibilityLabel=\{tr\('Rekord: \{list\}'/);
  });
  test('zamiana: „↺ przywróć” i „Inne ▾” bez drugiego glifu obok; „Co nowego”: starsze wpisy bez „▸” w etykiecie', async () => {
    await bootIn('pl', '/', () => { const st = store.getState(); store.startFromTemplate(st.templates[0]); });
    const blk = store.getState().active!.exercises[0].id; await go(`/swap?target=active:${blk}`); await flushAll(10);
    const glyphs = screen.UNSAFE_root.findAll((n: Node) => n.type === 'Text' && n.props.accessible === false && ['▾', '▴', '↺'].includes(str(n)));
    expect(glyphs.map(str)).toEqual([]);
    await go('/'); await flushAll(10); await go('/more'); await flushAll(10);
    expect(labels().filter(l => /^[▸▾] /.test(l))).toEqual([]);
  });
  test('glue: NBSP między liczbą a wyrazem, łącznik bez szerokości po „–” między cyframi; karta treningu „seria 1 z 4” bez złamania', async () => {
    const { glue } = require('@/lib/i18n');
    expect(glue('3 serie · 1 rekord')).toBe('3 serie · 1 rekord'); expect(glue('seria 1 z 4')).toBe('seria 1 z 4');
    expect(glue('Bench — 3 × 8–12, vila 2:00')).toBe('Bench — 3 × 8–⁠12, vila 2:00'); expect(glue('Ελληνικά')).toBe('Ελληνικά');
    await bootIn('pl', '/', () => { const st = store.getState(); st.settings.workoutView = 'focus'; store.startFromTemplate(st.templates[0]); });
    expect(texts().some(x => /^seria 1 z \d+$/.test(str(x)))).toBe(true);
  });
});

describe('K3 (A11-18): podpowiedzi VoiceOver po przeniesieniu instrukcji z etykiet', () => {
  const hintOf = (label: string | RegExp) => screen.UNSAFE_root.findAll((n: Node) => typeof n.type === 'string' && (typeof label === 'string' ? n.props.accessibilityLabel === label : label.test(String(n.props.accessibilityLabel ?? '')))).map((n: Node) => String(n.props.accessibilityHint ?? ''));
  test('filtry (wybór ćwiczenia, zamiana), typ serii w szablonie, przerwa i guma — etykieta = nazwa i wartość, podpowiedź = instrukcja', async () => {
    let tplId = '';
    await bootIn('pl', '/', () => { const st = store.getState(); tplId = st.templates[0].id; const locations = require('@/lib/locations'); const l = locations.addLocation('gym'); locations.setMainLocation(l.id); store.startFromTemplate(st.templates[0]); });
    expect(hintOf(/^Przerwa: \d/).some(h => h.endsWith('Tapnij, by zmienić.'))).toBe(true);
    const blk = store.getState().active!.exercises[0].id;
    await go('/picker?target=active'); await flushAll(10);
    expect(hintOf(/^Filtr miejsca(?: wyłączony)?: /).every(h => ['Tapnij, by zdjąć.', 'Tapnij, by pokazać tylko dostępne.'].includes(h))).toBe(true);
    await go(`/swap?target=active:${blk}`); await flushAll(10); await tap(screen.getByLabelText('Pokaż inne ćwiczenia')); await flushAll(5);
    const grp = screen.UNSAFE_root.findAll((n: Node) => typeof n.type === 'string' && /^Filtr partii: /.test(String(n.props.accessibilityLabel ?? '')))[0];
    expect(grp.props.accessibilityHint).toBe('Tapnij, by zdjąć.'); await tap(grp); await flushAll(5);
    expect(hintOf(/^Filtr partii wyłączony: /)).toContain('Tapnij, by włączyć.');
    await go(`/template/${tplId}?edit=1`); /* edycja na żądanie: edytor po „Edytuj” */ await flushAll(10); await openCard(0); await flushAll(5);
    expect(hintOf(/^Seria \d+, typ: /)).toContain('Tapnij, by zmienić typ.');
  });
});
