/*
 * M1-audytor-generalny-038: nazwy ćwiczeń z biblioteki są po angielsku we wszystkich językach poza polskim (DEC-13: zostają), więc VoiceOver czytał je głosem
 * języka interfejsu (np. „Back Squat” po niemiecku). Naprawa dotyczy tylko języka wymowy: element z samą nazwą biblioteki ma accessibilityLanguage = en
 * w języku ≠ pl/en (lib/i18n.ts exNameLang); ćwiczenia własne i przemianowane zostają w języku interfejsu.
 */
import * as store from '@/lib/store';
import { exNameLang, applyLang, lang } from '@/lib/i18n';
import { fresh, ex, saved } from './helpers';
import { renderApp, flushAll, screen, act } from './app';

jest.setTimeout(60000);
afterEach(() => { applyLang('pl'); });
const own = () => { const e = store.newExercise('Moje ćwiczenie'); e.lib = false; store.save(e); return e; };

describe('exNameLang', () => {
  test('biblioteka: pl → pl, en → en, inne języki → en; ćwiczenie własne/przemianowane → język interfejsu', async () => {
    await fresh(); const lib = ex('Back Squat'); const mine = { name: 'Moje ćwiczenie', lib: false };
    for (const [l, want] of [['pl', 'pl'], ['en', 'en'], ['de', 'en'], ['fr', 'en'], ['ja', 'en'], ['ru', 'en']] as const) { applyLang(l); expect([l, exNameLang(lib)]).toEqual([l, want]); }
    for (const l of ['pl', 'en', 'de', 'ja'] as const) { applyLang(l); expect([l, exNameLang(mine)]).toEqual([l, l]); }
    applyLang('de'); expect(exNameLang(undefined)).toBe(lang()); expect(exNameLang(null)).toBe(lang());
  });
});
describe('ekrany: nazwa biblioteki czytana po angielsku', () => {
  async function boot(locale: 'pl' | 'en' | 'de' | 'ja') {
    await fresh(undefined, 'pl'); const mine = own(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addExerciseToActive(mine); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: locale as never }); await flushAll(20);
  }
  const langOf = (name: string) => screen.getAllByText(name).map(n => n.props.accessibilityLanguage);
  test.each([['de', 'en'], ['ja', 'en'], ['pl', 'pl'], ['en', 'en']] as const)('%s: nagłówek ćwiczenia z biblioteki → accessibilityLanguage %s; własne → język interfejsu', async (l, want) => {
    await boot(l); expect(langOf('Back Squat').filter(x => x === want).length).toBeGreaterThan(0); expect(langOf('Back Squat').every(x => x === want)).toBe(true);
    expect(langOf('Moje ćwiczenie').every(x => x === l)).toBe(true);
  });
  test('lista „Ćwiczenia” w de: wiersz biblioteki ma język wymowy en (Pressable i napis), ćwiczenie własne — de', async () => {
    await fresh(undefined, 'pl'); own(); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: 'de' as never, url: '/exercises' }); await flushAll(20);
    const titles = screen.getAllByTestId(/^lib-row-\d+$/).map(r => r.findAll(n => (n.type as unknown) === 'Text' && n.props.children !== 'Löschen')[0]).filter(Boolean);
    const libRows = titles.filter(x => x.props.children !== 'Moje ćwiczenie'); expect(libRows.length).toBeGreaterThan(3);
    for (const x of libRows) expect([x.props.children, x.props.accessibilityLanguage]).toEqual([x.props.children, 'en']);
    let btn = libRows[0].parent; while (btn && btn.props.accessibilityRole !== 'button') btn = btn.parent; expect(btn?.props.accessibilityLanguage).toBe('en'); /* element dostępności wiersza */
    const mine = titles.find(x => x.props.children === 'Moje ćwiczenie'); if (mine) { let mb = mine.parent; while (mb && mb.props.accessibilityRole !== 'button') mb = mb.parent; expect([mine.props.accessibilityLanguage, mb?.props.accessibilityLanguage]).toEqual(['de', 'de']); } /* własne: język interfejsu */
  });
});
