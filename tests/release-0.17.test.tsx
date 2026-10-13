/**
 * Wydanie 0.17.0 (docs/32, docs/18): spójna obsługa w całej aplikacji (okna z „Anuluj” po lewej, „+” w nagłówkach list, komunikaty, VoiceOver), „Napisz do nas”
 * w Więcej → O aplikacji, prośba o ocenę po treningu z rekordem. Wersja projektu i bieżący wpis „Co nowego” (id '2026-10-15', data 13.10.2026, bez numeru buildu
 * do czasu wydania na TestFlight; numer dopisuje się po przebiegu). Wpis 0.16 (build 1013) jest historyczny (release-0.16.test.tsx). Subskrypcja jest wyłączona
 * przełącznikiem PAYWALL.ENABLED — wpis o niej nie wspomina (test niżej pilnuje obu rzeczy).
 */
import { WHATS_NEW } from '@/lib/whatsnew';
import { LANGS, applyLang, tIn } from '@/lib/i18n';
import { PAYWALL } from '@/lib/access';

const fs = require('fs') as typeof import('fs'); const path = require('path') as typeof import('path');
const J = (f: string) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'));
afterEach(() => { applyLang('pl'); });
const E = () => WHATS_NEW.find(e => e.id === '2026-10-15')!;
const PL = [
  'Spójniejsza obsługa w całej aplikacji: okna z „Anuluj” po lewej, „+” w nagłówkach list do dodawania oraz czytelniejsze komunikaty i opisy dla VoiceOver.',
  'Przycisk „Napisz do nas” w Więcej → O aplikacji.',
  'Po treningu z nowym rekordem aplikacja może poprosić o ocenę — rzadko i tylko w oknie systemowym.',
];

describe('wydanie 0.17.0', () => {
  test('app.json, package.json i package-lock.json (projekt) — 0.17.0', () => {
    const lock = J('package-lock.json');
    expect([J('app.json').expo.version, J('package.json').version, lock.version, lock.packages[''].version]).toEqual(['0.17.0', '0.17.0', '0.17.0', '0.17.0']);
  });
  test('najnowszy wpis = 0.17 (id 2026-10-15, data 2026-10-13); jeśli ma build, to nowszy niż 1013; pod nim 0.16 (2026-10-14, build 1013)', () => {
    expect(WHATS_NEW[0]).toBe(E());
    const cur = E(); const prev = WHATS_NEW[WHATS_NEW.indexOf(cur) + 1];
    expect([cur.id, cur.date, prev.id]).toEqual(['2026-10-15', '2026-10-13', '2026-10-14']);
    expect(cur.build === undefined || cur.build > 1013).toBe(true);
    expect(prev.build).toBe(1013);
  });
  test('wpis 0.17 po polsku: spójna obsługa, „Napisz do nas”, prośba o ocenę; 3 punkty, każdy kończy się kropką', () => {
    expect(E().items()).toEqual(PL);
  });
  test('wpis 0.17 nie zawiera nazw innych aplikacji (wytyczne 2.3.7 / 5.2.1) ani wzmianki o subskrypcji (przełącznik wyłączony)', () => {
    const all = E().items().join(' ');
    expect(all).not.toMatch(/strong|hevy|fitbod|jefit|strava|fitnotes/i);
    expect(all).not.toMatch(/subskrypc|abonament|płatn|zakup|premium|cennik/i);
    expect(PAYWALL.ENABLED).toBe(false); /* gdyby włączono, wpis o subskrypcji to osobna decyzja */
  });
  test('wszystkie języki: trzy punkty przetłumaczone, bez „{”, kropka („。” w ja/zh-Hant), VoiceOver zachowane, zgodność z tIn', () => {
    for (const l of LANGS) { if (l === 'pl') continue; applyLang(l);
      const it = E().items();
      expect([l, it.length]).toEqual([l, 3]);
      expect([l, it.filter(x => /[{}]/.test(x) || !/[.。]$/.test(x))]).toEqual([l, []]);
      expect([l, it.filter((x, i) => x === PL[i])]).toEqual([l, []]);
      expect([l, it[0].includes('VoiceOver')]).toEqual([l, true]);
      PL.forEach((k, i) => expect([l, tIn(l, k) === it[i]]).toEqual([l, true])); }
  });
  test('angielski i francuski (twarde spacje, „vous”)', () => {
    applyLang('en'); expect(E().items()).toEqual([
      'More consistent controls across the app: windows with “Cancel” on the left, “+” in list headers for adding, and clearer messages and VoiceOver descriptions.',
      'A “Write to us” button in More → About.',
      'After a workout with a new record, the app may ask you for a rating — rarely, and only in the system dialog.']);
    applyLang('fr'); const fr = E().items();
    expect(fr[0]).toContain('l’application :'); expect(fr[0]).toContain('« Annuler »'); expect(fr[1]).toContain('« Écrivez-nous »'); expect(fr[2]).toContain('vous demander');
  });
  test('nazwy w punkcie 2 zgodne ze słownikami ekranu: „Napisz do nas”, „Więcej”, „O aplikacji” w każdym języku', () => {
    for (const l of LANGS) { if (l === 'pl') continue;
      const [a, b, c] = ['Napisz do nas', 'Więcej', 'O aplikacji'].map(k => tIn(l, k)); applyLang(l);
      if (l === 'pt-BR' || l === 'es-419') { expect([l, E().items()[1].includes(a)]).toEqual([l, true]); continue; } /* nakładki: etykiety dziedziczone z pt / es — sprawdzone niżej */
      const it = E().items()[1];
      expect([l, it.includes(a), it.includes(b), it.includes(c)]).toEqual([l, true, true, true]); }
  });
  test('nakładki: pt-BR „o app”, es-419 „calificación”', () => {
    applyLang('pt-BR'); expect(E().items()[0]).toContain('todo o app'); applyLang('es-419'); expect(E().items()[2]).toContain('calificación');
  });
});
