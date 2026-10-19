/**
 * Wydanie 0.20.0 (0.19 + 0.20 jednym wydaniem, decyzja właściciela 13.10.2026; docs/18 19.10.2026): miejsca treningu i „Dostosuj do miejsca”, Apple Watch, głos,
 * „Strażnik progresji”, Postępy (dwa słupki), objaśnienia ⓘ, „Poproś o nową funkcję”, poprawka zapisu i odczytu Apple Health (L-001). Wersja projektu i bieżący wpis
 * „Co nowego” (id '2026-10-17', data 19.10.2026, bez numeru buildu do czasu wydania na TestFlight; numer dopisuje się po przebiegu). Wpis 0.18 (build 1015) jest
 * historyczny (release-0.18.test.tsx). Subskrypcja jest wyłączona przełącznikiem PAYWALL.ENABLED — wpis o niej nie wspomina. Wpis ma 8 punktów (reguła 2–10).
 * Tłumaczenia 31 języków — do przeglądu (rola tłumacza / Gemini).
 */
import { WHATS_NEW } from '@/lib/whatsnew';
import { LANGS, applyLang, tIn } from '@/lib/i18n';
import { PAYWALL } from '@/lib/access';

const fs = require('fs') as typeof import('fs'); const path = require('path') as typeof import('path');
const J = (f: string) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'));
afterEach(() => { applyLang('pl'); });
const E = () => WHATS_NEW.find(e => e.id === '2026-10-17')!;
const PL = [
  'Miejsca treningu i „Dostosuj do miejsca”: zmiany tylko w dzisiejszym treningu — szablon i plan zostają bez zmian.',
  'Apple Watch: odhaczanie serii, przerwa z timerem i „Cofnij” przez 5 sekund (watchOS 10 lub nowszy).',
  'Zapowiedzi głosowe na początku przerwy: ćwiczenie, ciężar i powtórzenia.',
  '„Strażnik progresji” w Postępach: sylwetka z kierunkiem progresu oraz zdanie o brakach do celu z uwzględnieniem planu.',
  'Postępy: dwa słupki na partię — porównanie okresu z poprzednim okresem.',
  'Objaśnienia pod przyciskiem „i” na ekranach.',
  '„Poproś o nową funkcję” obok „Napisz do nas” w Więcej → O aplikacji.',
  'Poprawka: zapis i odczyt Apple Health działają (w poprzedniej wersji testowej brakowało uprawnienia).',
];

describe('wydanie 0.20.0', () => {
  test('app.json, package.json i package-lock.json (projekt) — 0.20.0', () => {
    const lock = J('package-lock.json');
    expect([J('app.json').expo.version, J('package.json').version, lock.version, lock.packages[''].version]).toEqual(['0.20.0', '0.20.0', '0.20.0', '0.20.0']);
  });
  test('najnowszy wpis = 0.20 (id 2026-10-17, data 2026-10-19); jeśli ma build, to nowszy niż 1015; pod nim 0.18 (2026-10-16, build 1015)', () => {
    expect(WHATS_NEW[0]).toBe(E());
    const cur = E(); const prev = WHATS_NEW[1];
    expect([cur.id, cur.date, prev.id]).toEqual(['2026-10-17', '2026-10-19', '2026-10-16']);
    expect(cur.build === undefined || cur.build > 1015).toBe(true);
    expect(prev.build).toBe(1015);
  });
  test('wpis 0.20 po polsku: 8 punktów, każdy z kropką; nazwy funkcji zgodne ze słownikiem', () => {
    expect(E().items()).toEqual(PL);
    expect(E().items()).toHaveLength(8);
  });
  test('wpis 0.20 nie zawiera nazw innych aplikacji (wytyczne 2.3.7 / 5.2.1) ani wzmianki o subskrypcji (przełącznik wyłączony)', () => {
    const all = E().items().join(' ');
    expect(all).not.toMatch(/strong|hevy|fitbod|jefit|strava|fitnotes/i);
    expect(all).not.toMatch(/subskrypc|abonament|płatn|zakup|premium|cennik/i);
    expect(PAYWALL.ENABLED).toBe(false);
  });
  test('wszystkie języki: 8 punktów przetłumaczonych, bez „{”, kropka („。” w ja/zh-Hant), nazwy funkcji z tego samego słownika, zgodność z tIn', () => {
    for (const l of LANGS) { if (l === 'pl') continue; applyLang(l);
      const it = E().items();
      expect([l, it.length]).toEqual([l, 8]);
      expect([l, it.filter(x => /[{}\[\]<>]/.test(x) || !/[.。]$/.test(x))]).toEqual([l, []]);
      if (l !== 'en') expect([l, it.filter((x, i) => x === PL[i])]).toEqual([l, []]);
      expect([l, it[3].includes(tIn(l, 'Strażnik progresji')), it[6].includes(tIn(l, 'Poproś o nową funkcję')), it[6].includes(tIn(l, 'Napisz do nas'))]).toEqual([l, true, true, true]);
      expect([l, it[0].includes(tIn(l, 'Dostosuj do miejsca')), it[1].includes(tIn(l, 'Cofnij'))]).toEqual([l, true, true]);
      PL.forEach((k, i) => expect([l, tIn(l, k) === it[i]]).toEqual([l, true])); }
  });
  test('angielski', () => {
    applyLang('en'); expect(E().items()[3]).toContain('“Progress Guard”'); expect(E().items()[6]).toBe('“Request a new feature” next to “Write to us” in More → About.');
  });
});
