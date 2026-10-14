/*
 * 0.16.0, odczyt z Apple Health — TEKSTY ZGODY i POLITYKA PRYWATNOŚCI (docs/29 rozdz. 8, 9, 13, 15 pkt 9–10; Apple 5.1.1: opisy uprawnień dokładne, polityka aktualna):
 * aplikacja czyta Zdrowie, więc żaden język nie może dalej mówić „nie odczytuje” ani opisywać zapisu bez wzmianki o usuwaniu własnej kopii. Rodzaje (docs/20): języki,
 * dane (app.json = locales/pl.json), regresja (opisy sprzed 0.16: tests/fixtures/health-usage-pre016.json).
 * UWAGA — testy „… przetłumaczony” (po jednym na język) są czerwone, dopóki tłumacz nie dostarczy locales/<kod>.json: lista w docs (do-tlumacza-016).
 */
import * as fs from 'fs';
import * as path from 'path';
import { LANGS, APP_NAME } from '@/lib/i18n';

const root = path.join(__dirname, '..'); const J = (f: string) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const stale: Record<string, { share: string; update: string }> = J('tests/fixtures/health-usage-pre016.json');
const app = J('app.json').expo; const hkOpts = app.plugins.find((p: any) => Array.isArray(p) && p[0] === '@kingstinct/react-native-healthkit')[1];
const loc = (l: string) => J(`locales/${l}.json`);

describe('opisy uprawnień: polski i angielski (napisane w tym wydaniu)', () => {
  test('app.json (plugin HealthKit) = locales/pl.json; zapis: nic nie zmienia się w kluczach pliku', () => {
    expect(hkOpts.NSHealthShareUsageDescription).toBe(loc('pl').NSHealthShareUsageDescription); expect(hkOpts.NSHealthUpdateUsageDescription).toBe(loc('pl').NSHealthUpdateUsageDescription); expect(hkOpts.background).toBe(false);
    expect(Object.keys(loc('pl')).sort()).toEqual(['CFBundleDisplayName', 'NSHealthShareUsageDescription', 'NSHealthUpdateUsageDescription']);
  });
  test('PL: odczyt — kroki, treningi (także z zegarka), tętno, aktywne kalorie; po co; dane zostają w telefonie, bez wysyłania i kopii; bez „nie odczytuje”', () => {
    const t: string = loc('pl').NSHealthShareUsageDescription;
    expect(t).not.toMatch(/nie odczytuje/i); for (const w of ['kroki', 'treningi', 'z zegarka', 'tętno', 'aktywne kalorie', 'w planie i przy sesjach', 'zostają w telefonie', 'nie wysyła', 'nie zapisuje w kopii']) expect(t).toContain(w); expect(t).toContain(APP_NAME.pl);
  });
  test('EN: reads steps, workouts (including from your watch), heart rate, active energy; stays on the iPhone; not sent, not in backups; no “does not read”', () => {
    const t: string = loc('en').NSHealthShareUsageDescription;
    expect(t).not.toMatch(/does not read|doesn't read/i); for (const w of ['steps', 'workouts', 'from your watch', 'heart rate', 'active energy', 'in your plan and next to your sessions', 'stays on your iPhone', 'send it anywhere', 'backups']) expect(t).toContain(w); expect(t).toContain(APP_NAME.en);
  });
  test('zapis (PL i EN): siłowe i cardio oraz usuwanie własnej kopii po zapisie przez zegarek', () => {
    expect(loc('pl').NSHealthUpdateUsageDescription).toMatch(/siłowe i cardio/); expect(loc('pl').NSHealthUpdateUsageDescription).toMatch(/Gdy ten sam trening zapisze zegarek, aplikacja usuwa swoją kopię\.$/);
    expect(loc('en').NSHealthUpdateUsageDescription).toMatch(/strength and cardio/); expect(loc('en').NSHealthUpdateUsageDescription).toMatch(/When your watch records the same workout, the app removes its own copy\.$/);
  });
  test('opisy nie obiecują więcej, niż aplikacja robi: bez ocen, porad ani wysyłania', () => {
    for (const l of ['pl', 'en']) for (const k of ['NSHealthShareUsageDescription', 'NSHealthUpdateUsageDescription']) expect(loc(l)[k]).not.toMatch(/porad|advice|analityk|analytics|reklam|advertis|ocen/i);
  });
});

describe('macierz języków: opisy uprawnień zaktualizowane we wszystkich językach', () => {
  test('fixture opisów sprzed 0.16 obejmuje wszystkie języki, a pl/en mówiły „nie odczytuje” (dowód, że test coś sprawdza)', () => {
    expect(Object.keys(stale).sort()).toEqual([...LANGS].sort()); expect(stale.pl.share).toMatch(/nie odczytuje/); expect(stale.en.share).toMatch(/does not read/);
  });
  test.each(LANGS.map(l => [l]))('%s: opis odczytu i opis zapisu przetłumaczone na nowo (różne od opisów sprzed 0.16, które mówiły „nie odczytuje”)', l => {
    const f = loc(l); expect([l, f.NSHealthShareUsageDescription !== stale[l].share]).toEqual([l, true]); expect([l, f.NSHealthUpdateUsageDescription !== stale[l].update]).toEqual([l, true]);
    expect([l, f.NSHealthShareUsageDescription.includes(APP_NAME[l as keyof typeof APP_NAME])]).toEqual([l, true]); /* nazwa aplikacji w danym języku (jak w tests/i18n-locales) */
  });
  test('verify-native pilnuje tych samych opisów w prebuildzie (lista sprzed 0.16 + brak „nie odczytuje” w pl/en)', () => {
    const v = fs.readFileSync(path.join(root, 'scripts/verify-native.mjs'), 'utf8'); expect(v).toContain('tests/fixtures/health-usage-pre016.json'); expect(v).toMatch(/nie odczytuje\|does not read/);
  });
});

describe('polityka prywatności (site/privacy.html)', () => {
  const html = fs.readFileSync(path.join(root, 'site/privacy.html'), 'utf8'); const pl = html.slice(html.indexOf('<section lang="pl">'), html.indexOf('<section lang="en">')); const en = html.slice(html.indexOf('<section lang="en">'));
  test('PL: odczyt lokalny (kroki, treningi, tętno, aktywna energia), tylko wyświetlanie, bez zapisu w bazie / kopii / CSV, bez wysyłania, jak cofnąć zgodę; nie mówi już „nie odczytuje”', () => {
    expect(pl).not.toMatch(/nie odczytuje żadnych danych/); for (const w of ['Pokazuj dane z Apple Health', 'kroki, treningi (także z zegarka), tętno i aktywną energię', 'tylko w pamięci aplikacji', 'nie zapisuje ich w swojej bazie, w kopii zapasowej ani w eksporcie CSV', 'nie wysyła ich nigdzie',
      'nie używa do reklam, marketingu ani analityki', 'nie udziela porad medycznych', 'zgodę cofniesz w aplikacji Zdrowie', 'usuwa swoją kopię z Apple Health', 'wersja aplikacji 0.20.0']) expect(pl).toContain(w);
  });
  test('EN: the same facts in English; no “does not read any data”', () => {
    expect(en).not.toMatch(/does not\s+read any data/); for (const w of ['Show data from Apple Health', 'steps, workouts (including from your watch), heart rate and active energy', 'only in the app\'s memory', 'does not store it in its database, in backups or in CSV exports', 'does not send it anywhere',
      'does not use it for advertising, marketing or analytics', 'gives no medical advice', 'revoke access in the Health app', 'removes its own copy from Apple Health', 'app version 0.20.0']) expect(en).toContain(w);
  });
  test('strona i kod mówią to samo: kopia i CSV nie mają kolumn ze Zdrowia; aplikacja nie ma wywołań sieciowych (public-repo.test); odczyt wyłączony domyślnie', () => {
    const seed = fs.readFileSync(path.join(root, 'lib/seed.ts'), 'utf8'); expect(seed).toMatch(/healthSync: false/); expect(seed).not.toMatch(/healthRead: (true|false)/); /* domyślnie brak pola = wyłączony */
    const bk = fs.readFileSync(path.join(root, 'lib/backup.ts'), 'utf8'); expect(bk).not.toMatch(/avgBpm|maxBpm|StepCount|loadDay|loadWeek|loadWatchStats|healthQuery/); /* kopia i CSV nie sięgają po zapytania ani wartości ze Zdrowia */
  });
});
