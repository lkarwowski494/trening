/*
 * M1-audytor-generalny-046 (10-wydanie-002, 02-monetyzacja-002): polityka prywatności (site/privacy.html, PL i EN) wymieniała przypomnienie o końcu
 * okresu próbnego (usunięte z aplikacji 22.10.2026, model M5 S1) oraz przypomnienie o ważeniu (aplikacja je tylko odwołuje, nowe nie powstaje).
 * Test: sekcja „Powiadomienia” opisuje dokładnie to, co aplikacja dziś planuje (lib/timer.ts, lib/planReminder.ts), i nie wspomina okresu próbnego,
 * dopóki docs/monetyzacja.md ma „Bez okresu próbnego”.
 */
import * as fs from 'fs';
import * as path from 'path';

const root = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');
const privacy = read('site/privacy.html');
const text = (html: string) => html.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const section = (h: string) => { const i = privacy.indexOf(`<h2>${h}</h2>`); expect(i).toBeGreaterThan(-1); const j = privacy.indexOf('<h2>', i + 4); return text(privacy.slice(i, j)); };
const code = (f: string) => read(f).replace(/\/\*[\s\S]*?\*\//g, '').split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');

describe('site/privacy.html: powiadomienia zgodne z kodem (M1-046)', () => {
  test('model bez okresu próbnego → polityka (PL i EN) nie wspomina okresu próbnego', () => {
    expect(read('docs/monetyzacja.md')).toMatch(/Bez okresu próbnego/);
    expect(text(privacy)).not.toMatch(/okres\w* próbn|próbn\w* okres|free trial|\btrial\b/i);
  });
  test('przypomnienie o ważeniu nie jest planowane w kodzie → polityka go nie wymienia', () => {
    const timer = code('lib/timer.ts');
    const weigh = timer.slice(timer.indexOf('export async function scheduleWeighReminder'), timer.indexOf('const STALE_ID'));
    expect(weigh).not.toMatch(/scheduleNotificationAsync/);
    expect(text(privacy)).not.toMatch(/ważeni|weigh-in/i);
  });
  test('sekcja „Powiadomienia” wymienia każde powiadomienie lokalne z kodu (przerwa, seria na czas, plan, niezakończony trening)', () => {
    const timer = code('lib/timer.ts');
    for (const id of ['REST_ID', 'SET_ID', 'STALE_ID']) expect(timer).toMatch(new RegExp(`identifier: ${id}`));
    expect(code('lib/planReminder.ts')).toMatch(/scheduleNotificationAsync/);
    const pl = section('Powiadomienia');
    for (const s of ['koniec przerwy', 'koniec serii na czas', 'trening z planu', 'niezakończonym treningu']) expect([s, pl.includes(s)]).toEqual([s, true]);
    const en = section('Notifications');
    for (const s of ['end of rest', 'end of a timed set', 'planned workout', 'unfinished workout']) expect([s, en.includes(s)]).toEqual([s, true]);
  });
});
