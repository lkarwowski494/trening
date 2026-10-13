/* Apple Watch (0.20 „Zegarki i głos”, docs/36): stałe etykiety i opisy zgód w 35 językach. Pliki zegarka są GENEROWANE z lib/watchLabels.ts
 * (jeden słownik z telefonem, bez rozjazdu) — wzór tests/widget-i18n.test.ts. Po zmianie tłumaczeń, języków albo kluczy:
 *   UPDATE_WATCH_APPLE=1 npx jest tests/watch-apple-i18n.test.ts
 * - targets/watch-app/Core/WatchLabelTable.swift — tabela język → etykiety (zegarek bierze język z migawki telefonu),
 * - targets/watch-app/<język>.lproj/InfoPlist.strings — nazwa pod ikoną i opisy zgód HealthKit w języku systemu,
 * - tests/fixtures/watch-app/labels.json — te same etykiety dla testów interfejsu (XCUITest sprawdza je w każdym języku),
 * - tests/fixtures/watch-app/lang-cases.json — przypadki resolveLang dla testu Swift (WatchLabels.resolve musi dawać to samo). */
import * as fs from 'fs';
import * as path from 'path';
import { LANGS, resolveLang, applyLang } from '@/lib/i18n';
import { WATCH_LABEL_IDS, APPLE_ONLY_LABEL_IDS, WATCH_LABEL_KEYS, watchLabelTable, watchLabels, watchInfoPlist } from '@/lib/watchLabels';

const root = path.join(__dirname, '..');
const dir = path.join(root, 'targets', 'watch-app');
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const TAGS = ['pl-PL', 'en-US', 'en-GB', 'pt-BR', 'pt_BR', 'pt', 'pt-PT', 'pt-AO', 'es-419', 'es-MX', 'es-AR', 'es-US', 'es-ES', 'es', 'es-GQ', 'zh-Hant-TW', 'zh-Hant', 'zh-TW', 'zh-HK', 'zh-MO', 'zh-Hans-CN', 'zh-CN', 'zh', 'sr-Latn-RS', 'sr', 'nb-NO', 'nb', 'no', 'ja-JP', 'ko-KR', 'in-ID', 'id-ID', 'zsm', 'ms-MY', 'th-TH', 'de-AT', 'fr-CA', 'cs-CZ', 'uk-UA', 'ru-RU', 'fi-FI', 'el-GR', 'tr-TR', 'vi-VN', ''];

function expected(): Record<string, string> {
  const tab = watchLabelTable('pl'); const out: Record<string, string> = {};
  const json = JSON.stringify(Object.fromEntries(LANGS.map(l => [l, tab[l].labels])));
  out['Core/WatchLabelTable.swift'] = `// Generowane: tests/watch-apple-i18n.test.ts (UPDATE_WATCH_APPLE=1) z lib/watchLabels.ts — nie edytuj ręcznie.\n// Stałe etykiety zegarka w ${LANGS.length} językach aplikacji (JSON: klucz WatchLabelKey → tekst).\nenum WatchLabelTable {\n  static let json = #"""\n${json}\n"""#\n}\n`;
  for (const l of LANGS) {
    const p = tab[l].plist;
    out[`${l}.lproj/InfoPlist.strings`] = `/* Generowane: tests/watch-apple-i18n.test.ts (UPDATE_WATCH_APPLE=1) — nie edytuj ręcznie. */\n"CFBundleDisplayName" = "${esc(p.CFBundleDisplayName)}";\n"NSHealthShareUsageDescription" = "${esc(p.NSHealthShareUsageDescription)}";\n"NSHealthUpdateUsageDescription" = "${esc(p.NSHealthUpdateUsageDescription)}";\n`;
  }
  out['../../tests/fixtures/watch-app/labels.json'] = JSON.stringify(Object.fromEntries(LANGS.map(l => [l, tab[l].labels])), null, 1) + '\n';
  out['../../tests/fixtures/watch-app/lang-cases.json'] = JSON.stringify(TAGS.map(tag => ({ tag, lang: resolveLang(tag) })), null, 1) + '\n';
  return out;
}

test('pliki zegarka zgodne z lib/watchLabels.ts (wszystkie języki — LANGS)', () => {
  const exp = expected();
  if (process.env.UPDATE_WATCH_APPLE) for (const [f, c] of Object.entries(exp)) { fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true }); fs.writeFileSync(path.join(dir, f), c); }
  for (const [f, c] of Object.entries(exp)) expect([f, fs.existsSync(path.join(dir, f)) ? fs.readFileSync(path.join(dir, f), 'utf8') : 'BRAK']).toEqual([f, c]);
  const lproj = fs.readdirSync(dir).filter(f => f.endsWith('.lproj')).sort();
  expect(lproj).toEqual(LANGS.map(l => `${l}.lproj`).sort());
});

test('klucze etykiet = identyfikatory protokołu + dodatki Apple', () => {
  expect([...WATCH_LABEL_KEYS]).toEqual([...WATCH_LABEL_IDS, ...APPLE_ONLY_LABEL_IDS]);
  expect(WATCH_LABEL_IDS).toHaveLength(14);
});

describe.each(WATCH_LABEL_KEYS)('etykieta zegarka %s', key => {
  test.each(LANGS)('język %s: niepusta, krótka, poza pl nie polska', l => {
    applyLang(l); const v = watchLabels()[key]; applyLang('pl'); const pl = watchLabels()[key];
    expect(v.trim().length).toBeGreaterThan(0); expect(v.length).toBeLessThanOrEqual(48);
    if (l !== 'pl' && !(key === 'pause' && ['cs', 'sk', 'hr'].includes(l))) expect(v).not.toBe(pl); /* cs, sk, hr: „pauza” to to samo słowo */
    expect(v).not.toMatch(/\{\w+\}/); /* etykiety zegarka nie mają parametrów — teksty dynamiczne składa telefon */
  });
});

test('klucze Swift (WatchLabelKey) = WATCH_LABEL_KEYS, w tej samej kolejności; identyfikatory wspólne z protokołem w tej samej kolejności', () => {
  const swift = fs.readFileSync(path.join(dir, 'Core', 'WatchLabels.swift'), 'utf8');
  const m = swift.match(/enum WatchLabelKey: String, CaseIterable \{\s*case ([^\n]+)\n/); expect(m).not.toBeNull();
  expect(m![1].split(',').map(s => s.trim())).toEqual([...WATCH_LABEL_KEYS]);
  /* po scaleniu z gałęzią protokołu (lib/watch/labels.ts) lista wspólnych identyfikatorów musi być identyczna — wtedy ten plik zastępuje się importem */
  const proto = path.join(root, 'lib', 'watch', 'labels.ts');
  if (fs.existsSync(proto)) {
    const ids = fs.readFileSync(proto, 'utf8').match(/WATCH_LABEL_IDS = \[([^\]]+)\]/)![1].split(',').map(x => x.trim().replace(/'/g, ''));
    expect(WATCH_LABEL_KEYS.filter(k => k !== 'workoutOn')).toEqual(ids);
  }
});

test('opisy zgód HealthKit zegarka: wszystkie języki, niepuste, Info.plist (pl) i CFBundleLocalizations zgodne', () => {
  applyLang('pl'); const pl = watchInfoPlist('pl');
  const plist = fs.readFileSync(path.join(dir, 'Info.plist'), 'utf8');
  expect(plist).toContain(`<key>NSHealthShareUsageDescription</key>\n  <string>${pl.NSHealthShareUsageDescription}</string>`);
  expect(plist).toContain(`<key>NSHealthUpdateUsageDescription</key>\n  <string>${pl.NSHealthUpdateUsageDescription}</string>`);
  const loc = [...plist.match(/<key>CFBundleLocalizations<\/key>\s*<array>([\s\S]*?)<\/array>/)![1].matchAll(/<string>([^<]+)<\/string>/g)].map(x => x[1]);
  expect([...loc].sort()).toEqual([...LANGS].sort());
  for (const l of LANGS) { applyLang(l); const p = watchInfoPlist(l); applyLang('pl'); expect([l, p.NSHealthShareUsageDescription.length > 20, p.NSHealthUpdateUsageDescription.length > 20]).toEqual([l, true, true]); }
  const wk = plist.match(/<key>WKBackgroundModes<\/key>\s*<array>([\s\S]*?)<\/array>/)![1];
  expect(wk).toContain('workout-processing');
});

test('etykiety zegarka: polskie źródło i angielski komplet (literały — te same teksty widzi użytkownik na zegarku)', () => {
  applyLang('pl');
  expect(watchLabels()).toEqual({ done: 'Seria zrobiona', differ: 'Zrobione inaczej', skip: 'Pomiń', skipAsk: 'Pominąć ćwiczenie?', cancel: 'Anuluj', undo: 'Cofnij', rest: 'Przerwa', set: 'Seria', pause: 'Pauza', connect: 'Połącz z telefonem', idle: 'Zacznij trening na telefonie', finished: 'Trening zakończony', update: 'Zaktualizuj aplikację na zegarku', nothingLeft: 'nic więcej do zrobienia', workoutOn: 'Trening wciąż trwa' });
  expect(watchInfoPlist('pl')).toEqual({ CFBundleDisplayName: 'Trening', NSHealthShareUsageDescription: 'Zegarek odczytuje tętno i energię aktywną z trwającego treningu. Dane nie są wysyłane poza Twoje urządzenia.', NSHealthUpdateUsageDescription: 'Zegarek zapisuje zakończony trening siłowy, z tętnem i energią aktywną, w Apple Health.' });
  applyLang('en');
  expect(watchLabels()).toEqual({ done: 'Set done', differ: 'Done differently', skip: 'Skip', skipAsk: 'Skip this exercise?', cancel: 'Cancel', undo: 'Undo', rest: 'Rest', set: 'Set', pause: 'Paused', connect: 'Connect to your phone', idle: 'Start a workout on your phone', finished: 'Workout finished', update: 'Update the watch app', nothingLeft: 'nothing more to do', workoutOn: 'Workout still in progress' });
  expect(watchInfoPlist('en')).toEqual({ CFBundleDisplayName: 'Training', NSHealthShareUsageDescription: 'Your watch reads heart rate and active energy during the workout. The data is not sent outside your devices.', NSHealthUpdateUsageDescription: 'Your watch saves the finished strength workout, with heart rate and active energy, to Apple Health.' });
  applyLang('pl');
});
