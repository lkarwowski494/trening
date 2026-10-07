/*
 * Przyciski przerwy na ekranie blokady (Live Activity, iOS 17+): −15 s / +15 s / Pomiń — decyzja właściciela 07.10.2026 wieczór
 * („wdrażaj wszystko oprócz Health”), docs/21 pkt 4a. Przycisk wykonuje LiveActivityIntent w procesie aplikacji (Apple: „the system runs
 * the app intent in the app's process”) — Swift: targets/rest-widget/_shared/RestIntents.swift. Aplikacja po powrocie przejmuje nowy
 * stan (lib/timer.ts syncFromActivity). Rodzaje (docs/20): logika (synchronizacja), dane (stan timera), języki (etykiety przycisków w polu
 * kind), spójność JS ↔ Swift (identyfikator powiadomienia i klucz zapisu w jednym miejscu — sprawdzane tutaj). Natywnie: ios-unsigned.yml
 * (kompilacja) i telefon właściciela (działanie przycisków — tylko tam).
 */
import * as fs from 'fs';
import * as path from 'path';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { applyLang } from '@/lib/i18n';
import { fresh } from './helpers';

const root = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');
beforeEach(async () => { await fresh(); store.startEmpty(); (global as any).__laAdjust = null; jest.useFakeTimers({ now: new Date(2026, 9, 7, 18, 0, 0) }); });
afterEach(async () => { await timer.stop(); await timer.stopSet(); jest.useRealTimers(); applyLang('pl'); });

describe('etykiety przycisków w polu kind (język aplikacji)', () => {
  test('przerwa: „rest|Przerwa|Pomiń|Skróć…|Wydłuż…”; stoper serii — bez przycisków („set|Seria”)', async () => {
    await timer.start(90); const st = (global.__la as any[]).filter(x => x[0] === 'start').at(-1)!;
    expect(st[5]).toBe('rest|Przerwa|Pomiń|Skróć przerwę o 15 sekund|Wydłuż przerwę o 15 sekund');
    applyLang('en'); await timer.start(60); expect((global.__la as any[]).filter(x => x[0] === 'start').at(-1)![5]).toBe('rest|Rest|Skip|Shorten rest by 15 seconds|Extend rest by 15 seconds');
  });
});

describe('synchronizacja po przycisku na ekranie blokady (timer.syncFromActivity)', () => {
  const adj = (o: object) => { (global as any).__laAdjust = JSON.stringify(o); };
  test('+15 s z ekranu blokady: nowy koniec i suma przerwy w aplikacji i w zapisanym stanie; powiadomienie przestawione', async () => {
    await timer.start(90); const end0 = timer.T.endAt; global.__notifications.length = 0;
    adj({ endAtMs: end0 + 15000, totalSec: 105, ended: false, atMs: Date.now() + 1000 });
    await timer.syncFromActivity();
    expect([timer.T.on, timer.T.endAt, timer.T.total]).toEqual([true, end0 + 15000, 105]);
    expect(store.getState().timer).toMatchObject({ restEndAt: end0 + 15000, restTotal: 105 });
    expect(global.__notifications.some((n: any) => n.identifier === 'rest-end')).toBe(true);
    expect((global as any).__laAdjust).toBeNull(); /* odczyt zdejmuje wpis */
  });
  test('Pomiń z ekranu blokady: przerwa zakończona w aplikacji (stan wyczyszczony, powiadomienie odwołane)', async () => {
    await timer.start(90); (global as any).__cancelled.length = 0;
    adj({ endAtMs: 0, totalSec: 0, ended: true, atMs: Date.now() + 1000 });
    await timer.syncFromActivity();
    expect(timer.T.on).toBe(false); expect(store.getState().timer).toMatchObject({ restEndAt: null, restTotal: 0 }); expect((global as any).__cancelled).toContain('rest-end');
  });
  test('wpis sprzed bieżącej przerwy (inna przerwa) i wpis bez przerwy w aplikacji — pomijane; zły zapis — pomijany', async () => {
    await timer.start(90); const end0 = timer.T.endAt;
    adj({ endAtMs: end0 + 15000, totalSec: 105, ended: false, atMs: Date.now() - 60000 }); await timer.syncFromActivity(); expect(timer.T.endAt).toBe(end0);
    (global as any).__laAdjust = '{zły'; await timer.syncFromActivity(); expect(timer.T.endAt).toBe(end0);
    await timer.stop(); adj({ endAtMs: end0 + 15000, totalSec: 105, ended: false, atMs: Date.now() + 1000 }); await timer.syncFromActivity(); expect(timer.T.on).toBe(false);
  });
  test('restore (start aplikacji w tle po przycisku) najpierw bierze stan z ekranu blokady', async () => {
    await timer.start(90); const end0 = timer.T.endAt; await store.flush();
    adj({ endAtMs: end0 + 30000, totalSec: 120, ended: false, atMs: Date.now() + 1000 }); await timer.restore();
    expect([timer.T.on, timer.T.endAt]).toEqual([true, end0 + 30000]);
  });
});

describe('spójność JS ↔ Swift', () => {
  const intents = () => read('targets/rest-widget/_shared/RestIntents.swift');
  test('LiveActivityIntent w katalogu _shared (cel aplikacji i widżetu), iOS 17+; delta −15/+15/0', () => {
    const s = intents(); expect(s).toMatch(/struct RestAdjustIntent: LiveActivityIntent/); expect(s).toMatch(/@available\(iOS 17\.0, \*\)/);
    const w = read('targets/rest-widget/RestLiveActivity.swift');
    for (const d of ['-15', '15', '0']) expect(w).toContain(`RestAdjustIntent(delta: ${d})`);
    expect(w).toMatch(/if #available\(iOS 17\.0, \*\)/);
  });
  test('identyfikator powiadomienia końca przerwy i klucz zapisu — te same w JS, intencji i module', () => {
    const s = intents(); const mod = read('modules/rest-activity/ios/RestActivityModule.swift'); const tjs = read('lib/timer.ts');
    expect(tjs).toMatch(/REST_ID = 'rest-end'/); expect(s).toContain('"rest-end"');
    const key = /adjustKey = "([^"]+)"/.exec(s)![1]; expect(mod).toContain(`"${key}"`);
  });
  test('atrybuty aktywności w jednym miejscu dla aplikacji i widżetu (_shared) — pola jak w module', () => {
    const shared = read('targets/rest-widget/_shared/RestTimerAttributes.swift'); const mod = read('modules/rest-activity/ios/RestTimerAttributes.swift');
    expect(fs.existsSync(path.join(root, 'targets/rest-widget/RestTimerAttributes.swift'))).toBe(false); /* bez kopii w samym widżecie (podwójna definicja) */
    const fields = (x: string) => [...x.matchAll(/var (\w+): (\w+)/g)].map(m => `${m[1]}:${m[2]}`).sort();
    expect(fields(shared)).toEqual(fields(mod));
  });
});
