/*
 * Język Live Activity przerwy (decyzja właściciela 26.10.2026, naprawa w 1.0).
 * Błąd: ekran blokady w przerwie brał język z systemu (Locale.preferredLanguages), a aplikacja ma własny wybór języka — telefon po polsku
 * + aplikacja po angielsku dawały „Przerwa” na ekranie blokady. Naprawa: pole `lang` w ContentState wypełniane z lang() (rozstrzygnięty język
 * aplikacji), widżet używa go zamiast języka systemu; stan bez pola (starsza aktywność) → język systemu jak dawniej.
 * Rodzaje testów (docs/20): logika JS (każda wartość wymiaru języka, „auto” z tagami systemu), statyczne Swift (jak widget-i18n / verify-native),
 * regresja jest też w tests/regress.test.tsx. Na symulatorze Live Activity nie jest widoczna — punkt PR-13 listy „tylko telefon” (docs/39).
 */
import * as fs from 'fs';
import * as path from 'path';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { blankTimer } from '@/lib/seed';
import { LANGS, applyLang, lang, resolveLang, type LangSetting } from '@/lib/i18n';
import { fresh, ex } from './helpers';

const root = path.join(__dirname, '..');
const read = (p: string) => fs.readFileSync(path.join(root, p), 'utf8');
const la = () => global.__la as any[][];
const LA_LANG_START = 6; /* start(title, subtitle, endAt, total, kind, lang) → indeks po nazwie operacji */
const LA_LANG_UPDATE = 4; /* update(subtitle, endAt, total, lang) */

beforeEach(async () => {
  await fresh(); store.setTimerState(blankTimer()); await timer.stop(); await timer.stopSet(); await timer.restore();
  timer.labels.title = ''; timer.labels.subtitle = ''; timer.labels.last = false; global.__la.length = 0;
});
afterEach(async () => { await timer.stop(); await timer.stopSet(); global.__locales = [{ languageCode: 'pl', languageTag: 'pl-PL' }]; applyLang('pl'); });
const startRest = async () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const sid = store.getState().active!.exercises[0].sets[0].id; await timer.start(90, sid); };

describe('Live Activity przerwy dostaje język aplikacji (logika)', () => {
  test.each([...LANGS])('wymiar: język „%s” z ustawień → start Live Activity niesie ten kod (a nie język systemu = pl)', async l => {
    await fresh(); store.getState().settings.language = l; store.applyPrefs(); expect(lang()).toBe(l);
    global.__la.length = 0; await startRest();
    const s = la().find(x => x[0] === 'start')!; expect(s[LA_LANG_START]).toBe(l);
    expect(String(s[5]).startsWith('rest|')).toBe(true); /* etykieta w kind zostaje (zgodność) */
  });
  test('przerwa po stoperze serii („set”) też niesie język', async () => {
    store.getState().settings.language = 'de'; store.applyPrefs(); store.startEmpty(); store.addExerciseToActive(ex('Plank')); const sid = store.getState().active!.exercises[0].sets[0].id;
    await timer.startSet(sid, 60); const s = la().find(x => x[0] === 'start')!; expect(String(s[5]).startsWith('set|')).toBe(true); expect(s[LA_LANG_START]).toBe('de');
  });
  test.each<[string, string, string, string]>([
    ['pl', 'pl-PL', 'auto', 'pl'], ['en', 'en-GB', 'auto', 'en'], ['hiszpański Meksyk', 'es-MX', 'auto', 'es-419'], ['hiszpański Hiszpania', 'es-ES', 'auto', 'es'],
    ['portugalski Brazylia', 'pt-BR', 'auto', 'pt-BR'], ['portugalski Portugalia', 'pt-PT', 'auto', 'pt'], ['chiński tradycyjny', 'zh-Hant-TW', 'auto', 'zh-Hant'],
    ['chiński Hongkong', 'zh-HK', 'auto', 'zh-Hant'], ['chiński uproszczony (nieobsługiwany) → angielski', 'zh-Hans-CN', 'auto', 'en'], ['nieobsługiwany język (hindi) → angielski', 'hi-IN', 'auto', 'en'],
    ['telefon po polsku, aplikacja po angielsku (zgłoszony błąd)', 'pl-PL', 'en', 'en'], ['telefon po angielsku, aplikacja po polsku', 'en-US', 'pl', 'pl'], ['telefon po chińsku, aplikacja zh-Hant', 'zh-Hans-CN', 'zh-Hant', 'zh-Hant'],
  ])('„%s”: tag systemu %s + ustawienie %s → %s (to samo odwzorowanie co resolveLang)', async (_n, tag, setting, expected) => {
    global.__locales = [{ languageCode: tag.split('-')[0], languageTag: tag }]; store.getState().settings.language = setting as LangSetting; store.applyPrefs();
    global.__la.length = 0; await startRest(); expect(la().find(x => x[0] === 'start')![LA_LANG_START]).toBe(expected);
    if (setting === 'auto') expect(expected).toBe(resolveLang(tag, tag.split('-')[0]));
  });
  test('korekta przerwy (update) niesie język, żeby nowy stan nie zgubił pola', async () => {
    store.getState().settings.language = 'fr'; store.applyPrefs(); await startRest(); global.__la.length = 0; await timer.adjust(15);
    const u = la().find(x => x[0] === 'update')!; expect(u).toBeDefined(); expect(u[LA_LANG_UPDATE]).toBe('fr');
  });
  test('zmiana języka w ustawieniach przy trwającej przerwie odświeża Live Activity w nowym języku z tym samym końcem', async () => {
    store.getState().settings.language = 'pl'; store.applyPrefs(); await startRest(); const end = timer.T.endAt;
    store.getState().settings.language = 'en'; store.applyPrefs(); global.__la.length = 0; await timer.relocalize();
    const s = la().filter(x => x[0] === 'start'); expect(s).toHaveLength(1); expect(s[0][LA_LANG_START]).toBe('en'); expect(s[0][3]).toBe(end); expect(s[0][5]).toBe('rest|Rest');
  });
});

describe('Swift: pole lang w stanie aktywności i wybór etykiety (statycznie)', () => {
  const attrs = read('targets/rest-widget/RestTimerAttributes.swift'); const widget = read('targets/rest-widget/RestLiveActivity.swift'); const mod = read('modules/rest-activity/ios/RestActivityModule.swift');
  test('RestTimerAttributes: moduł i widżet identyczne; lang opcjonalne (Codable dekoduje brak pola jako nil), init z domyślnym nil, bez własnego dekodera i wersji stanu', () => {
    expect(read('modules/rest-activity/ios/RestTimerAttributes.swift')).toBe(attrs);
    expect(attrs).toMatch(/public var lang: String\?/); expect(attrs).toMatch(/lang: String\? = nil\)/);
    expect(attrs).not.toMatch(/init\(from|CodingKeys|version/i); /* syntezowany dekoder używa decodeIfPresent dla opcjonalnych: stary stan działa */
  });
  test('moduł natywny: start i update przyjmują lang, pusty = nil, i wstawiają go do ContentState', () => {
    expect(mod).toMatch(/AsyncFunction\("start"\) \{ \(title: String, subtitle: String, endAtMs: Double, totalSec: Int, kind: String, lang: String\)/);
    expect(mod).toMatch(/AsyncFunction\("update"\) \{ \(subtitle: String, endAtMs: Double, totalSec: Int, lang: String\)/);
    expect(mod.match(/lang: lang\.isEmpty \? nil : lang/g)).toHaveLength(2);
  });
  test('widżet: etykieta rodzaju bierze język ze stanu przed etykietą z atrybutu i przed językiem systemu; oba widoki podają context.state.lang', () => {
    expect(widget.match(/kindLabel\(context\.attributes\.kind, lang: context\.state\.lang\)/g)).toHaveLength(2);
    const fn = widget.slice(widget.indexOf('func kindLabel')); const iLang = fn.indexOf('restLabels[lang]'); const iKind = fn.indexOf('kind.firstIndex(of: "|")'); const iSys = fn.indexOf('Locale.preferredLanguages');
    expect(iLang).toBeGreaterThan(0); expect(iLang).toBeLessThan(iKind); expect(iKind).toBeLessThan(iSys); /* brak/nieznany lang → dotychczasowe zachowanie */
    expect(widget.match(/Locale\.preferredLanguages/g)).toHaveLength(1);
  });
  test('każdy kod języka aplikacji z JS ma etykiety w RestLabels.swift (nieznany lang w widżecie nie zdarza się dla LANGS)', () => {
    const labels = read('targets/rest-widget/RestLabels.swift'); for (const l of LANGS) expect([l, labels.includes(`"${l}": (rest:`)]).toEqual([l, true]);
  });
  test('most JS: start/update przekazują lang natywnie; bez argumentu → pusty (widżet: język systemu)', () => {
    const idx = read('modules/rest-activity/index.ts'); expect(idx).toMatch(/native\.start\(title, subtitle, Math\.round\(endAtMs\), sec\(totalSec\), kind, lang\)/); expect(idx).toMatch(/native\.update\(subtitle, Math\.round\(endAtMs\), sec\(totalSec\), lang\)/); expect(idx).toMatch(/lang = ''/);
  });
});
