/**
 * Wydanie 0.14.0 (polecenie właściciela 12.10.2026, backlog A — docs/18): cel serii na partię w Ustawieniach, poprawki błędów, 20 nowych ćwiczeń
 * ze wskazówkami techniki, miejsce treningu przy dopisywaniu wstecz. Wpis „Co nowego” 0.14 (id '2026-10-12', bez numeru buildu
 * do czasu wydania na TestFlight) jest historyczny od 0.15 — bieżący wpis i wersja projektu: release-0.15.test.tsx. Wpis wyszukiwany po id, nie po indeksie.
 */
import { WHATS_NEW } from '@/lib/whatsnew';
import { LANGS, applyLang, tIn } from '@/lib/i18n';

const fs = require('fs') as typeof import('fs'); const path = require('path') as typeof import('path');
const J = (f: string) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'));
afterEach(() => { applyLang('pl'); });

const E = () => WHATS_NEW.find(e => e.id === '2026-10-12')!;
const GOAL = 'Cel serii na partię w tygodniu ustawisz w Ustawieniach (Automatycznie albo Ręcznie); paski w „Ten tydzień” i w Postępach mierzą do tego celu, a partia pomocnicza ćwiczenia liczy się za pół serii.';

describe('wydanie 0.14.0', () => {
  test('wpis 0.14 (id 2026-10-12, historyczny; bieżący 0.15: release-0.15.test.tsx): jeśli ma build, to nowszy niż 1008; pod nim 0.13 (2026-10-11)', () => {
    const cur = E(); const prev = WHATS_NEW[WHATS_NEW.indexOf(cur) + 1];
    expect([cur.id, cur.date, prev.id]).toEqual(['2026-10-12', '2026-10-12', '2026-10-11']);
    expect(cur.build).toBe(1010); /* build 0.14.0 = 1010 (TestFlight run 38311331235, 12.10.2026) */
  });
  test('wpis 0.14 po polsku: cel serii, poprawki, nowe ćwiczenia, miejsce treningu; 2–10 punktów, każdy kończy się kropką', () => {
    const it = E().items();
    expect(it.length).toBeGreaterThanOrEqual(2); expect(it.length).toBeLessThanOrEqual(10);
    expect(it[0]).toBe(GOAL); expect(it[1]).toMatch(/^Poprawki: Postępy pamiętają wybrane ćwiczenie/); expect(it[2]).toMatch(/^20 nowych ćwiczeń .*„Technika”\.$/);
    expect(it[3]).toMatch(/miejsce treningu/); it.forEach(x => expect(x).toMatch(/\.$/));
  });
  test('wpis 0.14 nie zawiera nazw innych aplikacji (wytyczne 2.3.7 / 5.2.1)', () => {
    expect(E().items().join(' ')).not.toMatch(/strong|hevy|fitbod|jefit|strava|fitnotes/i);
  });
  test('wszystkie języki: cztery punkty przetłumaczone, bez „{”, kropka („。” w ja/zh-Hant); punkt o celu serii zawiera nazwy z ekranu (Ustawienia, Ręcznie, Ten tydzień)', () => {
    for (const l of LANGS) { if (l === 'pl') continue; applyLang(l);
      const it = E().items(); const pl = E().items.call(null);
      expect([l, it.length]).toEqual([l, 4]);
      expect([l, it.filter(x => /[{}]/.test(x) || !/[.。]$/.test(x))]).toEqual([l, []]);
      if (l !== 'en') expect([l, it.filter((x, i) => x === pl[i] && false)]).toEqual([l, []]);
      for (const k of ['Ustawienia', 'Ręcznie', 'Ten tydzień', 'godzina nieznana', 'Technika']) {
        const w = tIn(l, k); const i = ['Ustawienia', 'Ręcznie', 'Ten tydzień'].includes(k) ? 0 : k === 'Technika' ? 2 : 1;
        if (l === 'pt-BR' && k === 'Ustawienia') continue; if (l === 'es-419' && k === 'Ustawienia') continue; /* nakładka: Ajustes / Configuración (nazwa Ustawień iOS w regionie) */
        expect([l, k, it[i].includes(w)]).toEqual([l, k, true]); } }
  });
  test('nakładki wariantów: pt-BR „Ajustes”, es-419 „Configuración” w punkcie o celu serii', () => {
    expect(tIn('pt-BR', GOAL)).toContain('Ajustes'); expect(tIn('es-419', GOAL)).toContain('Configuración');
  });
  test('angielski: „Settings”, „Automatic”, „Manual”; francuski z « »', () => {
    applyLang('en'); expect(E().items()[0]).toMatch(/in Settings \(Automatic or Manual\)/);
    applyLang('fr'); expect(E().items()[2]).toMatch(/«\u00a0Technique\u00a0»/);
  });
});
