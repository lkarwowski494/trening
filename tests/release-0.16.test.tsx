/**
 * Wydanie 0.16.0 (docs/29, docs/18): odczyt z Apple Health (kroki, inne aktywności, tętno i kcal z zegarka), paski serii z odcinkiem pośrednim,
 * generator z celem serii z Ustawień. Wersja projektu i bieżący wpis „Co nowego” (id '2026-10-14', data 13.10.2026, bez numeru buildu do czasu
 * wydania na TestFlight; numer dopisuje się po przebiegu). Wpis 0.15 jest historyczny (release-0.15.test.tsx).
 */
import { WHATS_NEW } from '@/lib/whatsnew';
import { LANGS, applyLang, tIn } from '@/lib/i18n';

const fs = require('fs') as typeof import('fs'); const path = require('path') as typeof import('path');
const J = (f: string) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'));
afterEach(() => { applyLang('pl'); });
const E = () => WHATS_NEW.find(e => e.id === '2026-10-14')!;
const PL = [
  'Odczyt z Apple Health (włączasz w Ustawieniach): kroki i inne aktywności w panelu dnia, średnia kroków pod „Ten tydzień” oraz tętno i kcal z zegarka przy sesji.',
  'Paski serii pokazują osobno serie pośrednie (pomocnicze, liczone po 0,5).',
  'Generator uwzględnia Twój cel serii z Ustawień.',
];

describe('wydanie 0.16.0', () => {
  test('app.json, package.json i package-lock.json (projekt) — 0.16.0', () => {
    const lock = J('package-lock.json');
    expect([J('app.json').expo.version, J('package.json').version, lock.version, lock.packages[''].version]).toEqual(['0.16.0', '0.16.0', '0.16.0', '0.16.0']);
  });
  test('najnowszy wpis = 0.16 (id 2026-10-14, data 2026-10-13); jeśli ma build, to nowszy niż 1012; pod nim 0.15 (2026-10-13, build 1012)', () => {
    expect(WHATS_NEW[0]).toBe(E());
    const cur = E(); const prev = WHATS_NEW[WHATS_NEW.indexOf(cur) + 1];
    expect([cur.id, cur.date, prev.id]).toEqual(['2026-10-14', '2026-10-13', '2026-10-13']);
    expect(cur.build === undefined || cur.build > 1012).toBe(true);
    expect(prev.build).toBe(1012);
  });
  test('wpis 0.16 po polsku: odczyt z Apple Health, paski serii, generator; 3 punkty, każdy kończy się kropką', () => {
    expect(E().items()).toEqual(PL);
  });
  test('wpis 0.16 nie zawiera nazw innych aplikacji (wytyczne 2.3.7 / 5.2.1)', () => {
    expect(E().items().join(' ')).not.toMatch(/strong|hevy|fitbod|jefit|strava|fitnotes/i);
  });
  test('wszystkie języki: trzy punkty przetłumaczone, bez „{”, kropka („。” w ja/zh-Hant), nazwa Apple Health zachowana', () => {
    for (const l of LANGS) { if (l === 'pl') continue; applyLang(l);
      const it = E().items();
      expect([l, it.length]).toEqual([l, 3]);
      expect([l, it.filter(x => /[{}]/.test(x) || !/[.。]$/.test(x))]).toEqual([l, []]);
      expect([l, it.filter((x, i) => x === PL[i])]).toEqual([l, []]);
      expect([l, /Apple[\s ]Health/.test(it[0])]).toEqual([l, true]);
      PL.forEach((k, i) => expect([l, tIn(l, k) === it[i]]).toEqual([l, true])); }
  });
  test('angielski i francuski (twarde spacje, „vous”)', () => {
    applyLang('en'); expect(E().items()).toEqual([
      'Reading from Apple Health (turn it on in Settings): steps and other activities in the day panel, average steps under “This week”, and heart rate and kcal from your watch on a workout.',
      'Set bars show indirect sets separately (secondary sets, counted as 0.5 each).',
      'The generator now uses your sets goal from Settings.']);
    applyLang('fr'); expect(E().items()[0]).toContain('Apple\u00a0Health (à activer'); expect(E().items()[0]).toContain('Lecture\u00a0depuis');
    expect(E().items()[2]).toContain('votre objectif');
  });
  test('nakładki: pt-BR „Ajustes”, es-419 „Configuración” w punktach 1 i 3', () => {
    for (const [l, w] of [['pt-BR', 'Ajustes'], ['es-419', 'Configuración']] as const) { applyLang(l); const it = E().items(); expect([l, it[0].includes(w), it[2].includes(w)]).toEqual([l, true, true]); }
  });
});
