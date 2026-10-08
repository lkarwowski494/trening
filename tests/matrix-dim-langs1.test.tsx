/* Macierz wymiarów — część „langs 1/4” (z podziału tests/matrix-dimensions.test.tsx, 06.10.2026; opis i pomocnicze: tests/matrix-shared.tsx). */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as RN from 'react-native';
import { Appearance } from 'react-native';
import * as store from '@/lib/store';
import * as edit from '@/lib/edit';
import * as stats from '@/lib/stats';
import { buildBackup, buildCsv, parseBackup } from '@/lib/backup';
import { addLocation, setEquip, setOpt, setLoad, equipOf, activeEquip } from '@/lib/locations';
import {
  EQUIPMENT, LOCATION_PRESETS, LOAD_PRESETS, LOCATION_PRESET_LABEL, CAPABILITIES, CAP_LABEL, equipById, capsOf, availability, loadKindsFor, loadsFor,
  implAt, implsAt, applyLoadPreset, presetEquipment, equipLabel, blankLoad, equipEntry, type EquipItem,
} from '@/lib/equipment';
import { validateSpec, specValues, type LoadSpec } from '@/lib/loads';
import { LANGS, applyLang, exName, t, tIn, lbl, lang, decimalComma, type Lang } from '@/lib/i18n';
import { EN } from '@/lib/i18n.en';
import { LOCALES } from '@/lib/locales';
import { KG_PER_LB, wIn, wOut, wField, wInKeep, applyUnit, wu, type Unit } from '@/lib/units';
import { light, dark } from '@/lib/theme';
import { METRICS, SET_KINDS, MUSCLES, IMPLS, GROUPS, METRIC_LABEL, SET_KIND_LABEL, LOAD_MODE_LABEL, REGION_LABEL, LOAD_SOURCE_BY_EQUIPMENT, hasWeight, hasReps, hasTime, hasDistance, seedState, uid, type Exercise, type MetricType, type SetKind, type ThemeSetting, type WSet, type Workout, type Template } from '@/lib/seed';
import { renderApp, flushAll, screen, go } from './app';
import { fresh } from './helpers';
import { UNITS, THEMES, S, CATALOG0, isBWx, multOf, epley, fmtPl, secTxt, distTxt, setUnit, parseCsv, VALS, valsOf, Rep, REPS, KINDS_ORDER, W_DISP, ADD_DISP, REPS_V, TIME_V, DIST_V, loadDisp, fill, doWorkout, expSummary } from './matrix-shared';

jest.setTimeout(180000);
/* Część 1/4 języków (co 4. język z LANGS — nowy język trafia do którejś części sam); podział z powodu pamięci (06.10.2026). */
const MINE = (i: number) => i % 4 === 0;

describe('LANGS × THEMES — główne ekrany w każdym języku i motywie', () => {
  /* @matrix LANGS */ /* @matrix THEMES */
  /* Motyw: w Jest Appearance.setColorScheme nie zmienia useColorScheme — odtwarzamy telefon: wybór aplikacji ('light'/'dark')
   * albo — przy 'auto' („Jak w telefonie”, setColorScheme('unspecified')) — tryb systemu. */
  let scheme: 'light' | 'dark' | null = 'light'; let system: 'light' | 'dark' = 'dark';
  beforeAll(() => {
    jest.spyOn(Appearance, 'setColorScheme').mockImplementation(((v: string | null | undefined) => { scheme = v === 'unspecified' || v == null ? system : v as 'light' | 'dark'; }) as never);
    jest.spyOn(RN, 'useColorScheme').mockImplementation((() => scheme) as never);
  });
  afterAll(() => jest.restoreAllMocks());
  const ROUTES: [string, string][] = [
    ['/', 'Pusty trening'], ['/exercises', '+ Nowe'], ['/templates', 'Brak szablonów — dodaj pierwszy.'], ['/history', '+ Dodaj trening wstecz'], ['/more', 'Miejsca i sprzęt'],
    ['/more/settings', 'Dźwięk i wibracja na koniec przerwy'], ['/more/progress', 'Wykresy pojawią się po pierwszym zakończonym treningu.'], ['/more/locations', '+ Dodaj miejsce'],
    ['/more/backup', 'Eksport tworzy plik JSON z całą historią i szablonami — zapisz go w Plikach/iCloud albo wyślij sobie. Import przyjmuje ten sam format, także backup z wersji webowej.'],
    ['/more/language', 'Nazwy ćwiczeń z biblioteki są po angielsku we wszystkich językach poza polskim.'], ['/more/bands', '+ Guma'],
  ];
  const TABS = ['Trening', 'Szablony', 'Ćwiczenia', 'Kalendarz', 'Więcej']; /* 08.10.2026: Historia → Kalendarz */
  /** Polskie teksty, które w innym języku nie mogą zostać na ekranie (wszystkie mają tłumaczenia w słownikach; bez „+ Guma” — „guma” to też
   * słowo czeskie, słowackie i litewskie). */
  /** To samo słowo w języku docelowym (fiń. historia) — nie jest przeciekiem polskiego tekstu (07.10.2026; jak SAME_IN w matrix-i18n). */
  const SAME_WORD: Partial<Record<string, string[]>> = {}; /* fi „Historia” — zakładka to teraz Kalendarz (Kalenteri) */
  const PL_SENTINELS = ['Zacznij z szablonu', 'Ustawienia', 'Pusty trening', 'Postępy', 'Szablony', 'Ćwiczenia', 'Więcej', 'Kalendarz', '+ Dodaj miejsce', '+ Dodaj trening wstecz', 'Dźwięk i wibracja na koniec przerwy', 'Jednostka ciężaru', 'Wygląd'];
  const texts = () => { const out: string[] = []; const walk = (n: any) => { if (!n) return; if (typeof n === 'string') { out.push(n); return; } if (Array.isArray(n)) { n.forEach(walk); return; } walk(n.children); }; walk(screen.toJSON()); return out; };
  const bgs = () => { const out = new Set<string>(); const walk = (n: any) => { if (!n || typeof n === 'string') return; if (Array.isArray(n)) { n.forEach(walk); return; } for (const x of [n.props?.style].flat(9)) if (x && x.backgroundColor) out.add(String(x.backgroundColor)); walk(n.children); }; walk(screen.toJSON()); return out; };
  const palette = (th: ThemeSetting) => (th === 'auto' ? system : th) === 'light' ? light : dark;

  test.each(LANGS.map((l, i) => [l, THEMES[i % THEMES.length]] as const).filter((_, i) => MINE(i)))('%s (motyw %s): każdy ekran przetłumaczony, bez polskich tekstów, w kolorach motywu', async (l, th) => {
    const s = seedState(l); s.settings.language = l; s.settings.theme = th;
    await renderApp({ saved: s }); await flushAll(10);
    expect(lang()).toBe(l); expect(S().settings.language).toBe(l);
    for (const tab of TABS) expect([l, tab, screen.queryAllByText(t(tab)).length > 0]).toEqual([l, tab, true]);
    for (const [route, sentinel] of ROUTES) { await go(route); await flushAll(10); expect([l, route, screen.queryAllByText(t(sentinel)).length > 0]).toEqual([l, route, true]); }
    const all = texts();
    if (l !== 'pl') {
      for (const pl of PL_SENTINELS.filter(x => !SAME_WORD[l]?.includes(x))) expect([l, pl, t(pl) !== pl, all.includes(pl)]).toEqual([l, pl, true, false]);
      /* litery tylko polskie (ł, ś, ź, ż) — żaden tekst ekranu nie powinien ich mieć poza nazwą języka „Polski” */
      expect([l, all.filter(x => /[łśźżŁŚŹŻ]/.test(x))]).toEqual([l, []]);
    }
    const bg = bgs(); const pal = palette(th), other = pal === light ? dark : light;
    expect([l, th, bg.has(pal.bg), bg.has(pal.surface)]).toEqual([l, th, true, true]);
    expect([l, th, [other.bg, other.surface, other.surface2].filter(c => bg.has(c))]).toEqual([l, th, []]);
  });

  /** Stan z danymi: zakończony trening ze wszystkimi reprezentantami metryk (wszystkie typy serii), szablon z nimi i trening w toku. */
  async function richState(l: Lang, th: ThemeSetting) {
    await fresh(); const exs = REPS.map(r => S().exercises.find(e => e.name === r.name)!);
    store.startEmpty(); const a = S().active!; a.startedAt = Date.now() - 7200e3; exs.forEach(ex => store.addExerciseToActive(ex));
    a.exercises.forEach((b, i) => { store.addSet(i, 'warmup'); store.addSet(i); store.addSet(i, 'drop'); b.sets[2].kind = 'failure'; b.sets.forEach((st, si) => fill(exs[i], REPS[i], 'kg', st, KINDS_ORDER[si])); });
    store.save(a); let n = 0; a.exercises.forEach((b, ei) => b.sets.forEach((_, si) => store.toggleDone(ei, si, a.startedAt + 1000 * ++n)));
    const w = store.finishWorkout(a.startedAt + 1000 * ++n)!;
    const tpl = store.newTemplate(); tpl.name = 'Tpl A'; exs.forEach(ex => tpl.items.push({ id: uid(), exerciseId: ex.id, sets: 2, repMin: 6, repMax: 8, restSec: null, startWeight: '', targetSec: '', groupId: null })); store.save(tpl);
    store.startFromTemplate(tpl); store.toggleDone(0, 0);
    const s = JSON.parse(JSON.stringify(S())); s.settings.language = l; s.settings.theme = th; return { s, w, tpl, exs };
  }
  test.each(LANGS.map((l, i) => [l, THEMES[(i + 1) % THEMES.length]] as const).filter((_, i) => MINE(i)))('%s (motyw %s) z danymi: trening w toku, historia, szablon, ćwiczenie każdej metryki, postępy — przetłumaczone', async (l, th) => {
    const { s, w, tpl, exs } = await richState(l, th);
    await renderApp({ saved: s }); await flushAll(10); expect(lang()).toBe(l);
    expect(screen.queryAllByText(t('+ Dodaj ćwiczenie')).length).toBeGreaterThan(0);
    for (const ex of exs) expect([l, ex.name, screen.queryAllByText(exName(ex)).length > 0]).toEqual([l, ex.name, true]);
    await go(`/history/${w.id}`); await flushAll(10); expect([l, 'historia', screen.queryAllByText(t('Edytuj')).length > 0]).toEqual([l, 'historia', true]);
    await go(`/template/${tpl.id}`); await flushAll(10); expect([l, 'szablon', screen.queryAllByDisplayValue('Tpl A').length > 0]).toEqual([l, 'szablon', true]);
    for (const ex of exs) { await go(`/exercise/${ex.id}`); await flushAll(10); expect([l, ex.name, screen.queryAllByText(t('Co logujesz w serii')).length > 0]).toEqual([l, ex.name, true]); }
    await go('/more/progress'); await flushAll(10); await go('/history'); await flushAll(10);
    const all = texts();
    if (l !== 'pl') {
      for (const pl of [...PL_SENTINELS, '+ Dodaj ćwiczenie', 'Poprzednio', 'Co logujesz w serii', 'Edytuj', 'do upadku', 'rozgrzewkowa'].filter(x => !SAME_WORD[l]?.includes(x))) expect([l, pl, all.includes(pl)]).toEqual([l, pl, false]);
      expect([l, all.filter(x => /[łśźżŁŚŹŻ]/.test(x))]).toEqual([l, []]);
    }
    const bg = bgs(); const pal = palette(th), other = pal === light ? dark : light;
    expect([l, th, bg.has(pal.bg), [other.bg, other.surface, other.surface2].filter(c => bg.has(c))]).toEqual([l, th, true, []]);
  });

  test.each(LANGS.filter((_, i) => MINE(i)))('%s: wartości domenowe (partie, grupy, sprzęt, metryki, typy serii, tryby liczenia, regiony) mają wpis w słowniku języka', (l) => {
    const keys = [...MUSCLES, ...GROUPS, ...Object.keys(LOAD_SOURCE_BY_EQUIPMENT), ...Object.values(METRIC_LABEL), ...Object.values(SET_KIND_LABEL), ...Object.values(LOAD_MODE_LABEL), ...Object.values(REGION_LABEL)];
    const d = l === 'pl' ? null : l === 'en' ? EN : LOCALES[l]!;
    expect(d === null || typeof d === 'object').toBe(true);
    if (d) expect([l, keys.filter(k => !Object.prototype.hasOwnProperty.call(d, k) || !String(d[k]).trim())]).toEqual([l, []]);
  });
  test.each(LANGS.filter((_, i) => MINE(i)))('%s: liczby w opisie serii, ciężarze i CSV — separator dziesiętny języka na ekranie, kropka w CSV; typ serii w CSV po tłumaczeniu', async (l) => {
    await fresh(); const ex = S().exercises.find(e => e.name === 'Bench Press (sztanga)')!; doWorkout(ex, { name: ex.name, metric: 'weight_reps', bw: false }, 'kg', KINDS_ORDER);
    applyLang(l); const sep = decimalComma() ? ',' : '.';
    const s = S().workouts[0].exercises[0].sets[2]; expect(store.setSummary(ex, s)).toBe(`62${sep}5×6`);
    const rows = parseCsv(buildCsv()).slice(1); expect(rows[2][5]).toBe('62.5'); expect(rows[2][9]).toBe(t('do upadku')); expect(rows[3][9]).toBe('drop set'); expect(rows[2][3]).toBe(exName(ex)); expect(rows[2][1]).toBe(t('Trening'));
  });

  test.each(THEMES.flatMap(th => (['light', 'dark'] as const).map(sys => [th, sys] as const)))('motyw %s przy telefonie w trybie %s: kolory z właściwej palety na wszystkich ekranach', async (th, sys) => {
    system = sys; const s = seedState('pl'); s.settings.theme = th; s.settings.language = 'pl';
    await renderApp({ saved: s }); await flushAll(10);
    expect(Appearance.setColorScheme).toHaveBeenLastCalledWith(th === 'auto' ? 'unspecified' : th);
    for (const [route] of ROUTES) { await go(route); await flushAll(10); }
    const bg = bgs(); const pal = (th === 'auto' ? sys : th) === 'light' ? light : dark; const other = pal === light ? dark : light;
    expect([bg.has(pal.bg), bg.has(pal.surface)]).toEqual([true, true]);
    expect([other.bg, other.surface, other.surface2].filter(c => bg.has(c))).toEqual([]);
    system = 'dark';
  });
});

/* ======================================================================================================================== */
