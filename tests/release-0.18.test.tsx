/**
 * Wydanie 0.18.0 (docs/33, docs/18): „Dostosuj do miejsca” — po zmianie miejsca na takie bez potrzebnego sprzętu aplikacja proponuje zamienniki ćwiczeń do przejrzenia,
 * zmiany tylko w tym treningu. Wersja projektu i bieżący wpis „Co nowego” (id '2026-10-16', data 13.10.2026, bez numeru buildu do czasu wydania na TestFlight; numer
 * dopisuje się po przebiegu). Wpis 0.17 (build 1014) jest historyczny (release-0.17.test.tsx). Subskrypcja jest wyłączona przełącznikiem PAYWALL.ENABLED — wpis
 * o niej nie wspomina (test niżej pilnuje obu rzeczy). Wpis ma 2 punkty (reguła 2–10 z tests/whats-new.test.tsx).
 */
import { WHATS_NEW } from '@/lib/whatsnew';
import { LANGS, applyLang, tIn } from '@/lib/i18n';
import { PAYWALL } from '@/lib/access';

const fs = require('fs') as typeof import('fs'); const path = require('path') as typeof import('path');
const J = (f: string) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'));
afterEach(() => { applyLang('pl'); });
const E = () => WHATS_NEW.find(e => e.id === '2026-10-16')!;
const PL = [
  'Dostosuj do miejsca: po zmianie miejsca na takie bez potrzebnego sprzętu aplikacja proponuje zamienniki ćwiczeń do przejrzenia — zmiany tylko w tym treningu.',
  'W oknie zmienisz zamiennik albo wybierzesz „Bez zmian” lub „Pomiń dziś”; zastosowaną zamianę cofniesz przy ćwiczeniu.',
];

describe('wydanie 0.18.0', () => {
  test('app.json, package.json i package-lock.json (projekt) — 0.18.0', () => {
    const lock = J('package-lock.json');
    expect([J('app.json').expo.version, J('package.json').version, lock.version, lock.packages[''].version]).toEqual(['0.18.0', '0.18.0', '0.18.0', '0.18.0']);
  });
  test('najnowszy wpis = 0.18 (id 2026-10-16, data 2026-10-13); jeśli ma build, to nowszy niż 1014; pod nim 0.17 (2026-10-15, build 1014)', () => {
    expect(WHATS_NEW[0]).toBe(E());
    const cur = E(); const prev = WHATS_NEW[WHATS_NEW.indexOf(cur) + 1];
    expect([cur.id, cur.date, prev.id]).toEqual(['2026-10-16', '2026-10-13', '2026-10-15']);
    expect(cur.build === undefined || cur.build > 1014).toBe(true);
    expect(prev.build).toBe(1014);
  });
  test('wpis 0.18 po polsku: „Dostosuj do miejsca”, 2 punkty, każdy kończy się kropką; nazwa funkcji zgodna z tytułem okna, nazwy przycisków z okna', () => {
    expect(E().items()).toEqual(PL);
    expect(E().items()[0].startsWith('Dostosuj do miejsca')).toBe(true);
    expect(E().items()[1]).toContain('„Bez zmian”'); expect(E().items()[1]).toContain('„Pomiń dziś”');
  });
  test('wpis 0.18 nie zawiera nazw innych aplikacji (wytyczne 2.3.7 / 5.2.1) ani wzmianki o subskrypcji i prośbie o ocenę (przełącznik wyłączony)', () => {
    const all = E().items().join(' ');
    expect(all).not.toMatch(/strong|hevy|fitbod|jefit|strava|fitnotes/i);
    expect(all).not.toMatch(/subskrypc|abonament|płatn|zakup|premium|cennik|ocen/i);
    expect(PAYWALL.ENABLED).toBe(false);
  });
  test('wszystkie języki: dwa punkty przetłumaczone, bez „{”, kropka („。” w ja/zh-Hant), zaczyna się nazwą funkcji z tego języka, zgodność z tIn', () => {
    for (const l of LANGS) { if (l === 'pl') continue; applyLang(l);
      const it = E().items();
      expect([l, it.length]).toEqual([l, 2]);
      expect([l, it.filter(x => /[{}]/.test(x) || !/[.。]$/.test(x))]).toEqual([l, []]);
      expect([l, it.filter((x, i) => x === PL[i])]).toEqual([l, []]);
      expect([l, it[0].startsWith(tIn(l, 'Dostosuj do miejsca'))]).toEqual([l, true]);
      expect([l, it[1].includes(tIn(l, 'Bez zmian')), it[1].includes(tIn(l, 'Pomiń dziś'))]).toEqual([l, true, true]); /* nazwy przycisków okna jak w słowniku ekranu */
      PL.forEach((k, i) => expect([l, tIn(l, k) === it[i]]).toEqual([l, true])); }
  });
  test('angielski i francuski (twarde spacje, „vous”)', () => {
    applyLang('en'); expect(E().items()).toEqual([
      'Adjust to location: after you switch to a location without the equipment you need, the app suggests exercise substitutes for you to review — changes apply to this workout only.',
      'In the window you can change a substitute or choose “No change” or “Skip today”; you can undo an applied swap at the exercise.']);
    applyLang('fr'); const fr = E().items();
    expect(fr[0]).toContain('Adapter au lieu :'); expect(fr[0]).toContain('vous passez'); expect(fr[0]).toContain('examiner ;'); expect(fr[1]).toContain('«\u00a0Aucun changement\u00a0»'); expect(fr[1]).toContain('\u00a0;'); expect(fr).toHaveLength(2);
  });
  test('nakładki: pt-BR „o app”; es-419 bez własnego punktu (dziedziczy es)', () => {
    applyLang('pt-BR'); expect(E().items()[0]).toContain('o app'); expect(E().items()[1]).toContain('você'); applyLang('es-419'); const la = E().items(); applyLang('es'); expect(la).toEqual(E().items());
  });
});
