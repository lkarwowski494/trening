/*
 * M1-audytor-generalny-047 (10-wydanie-003, 02-monetyzacja-003, 07-jakosc-002, 07-jakosc-003): dokumenty drogi do sklepu i kroki właściciela
 * opisywały model sprzed M5 S1 (oferta wprowadzająca 14 dni / 1 miesiąc, „sprawdź próbę”) i bramkę E2E sprzed 21.10.2026 („3 noce”, „tryb ścisły”).
 * Obowiązuje: docs/monetyzacja.md (bez okresu próbnego) i CLAUDE.md (App Store blokuje jeden pełny katalog E2E na standardowym iPhonie, jedno ponowienie).
 * Linia z dawną regułą jest dozwolona tylko jako historia oznaczona słowem „uchylone”/„zastąpione”/„nieaktualne”.
 */
import * as fs from 'fs';
import * as path from 'path';

const root = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');
const FILES = ['docs/38-przeplywy-i-luki-e2e.md', 'docs/39-lista-kontrolna-wydania.md', 'tests/przeplywy.json']; /* docs/41, 42, 43, 45-formalnosci-asc: tests/dokumenty-na-dysk.test.ts (idą na Dysk przy przeniesieniu, docs/46) */
const HISTORY = /uchylon|zastąpion|nieaktualn/i;
const TRIAL = /oferta wprowadzając\w*[^.\n]{0,40}14 dni|14 dni oferty|oferta 14 dni|oferta 1 miesiąc|2 Weeks|2 tygodnie, obie|próba 14 dni|14 dniach próby|sprawdź próbę|próbę i cenę|TRIAL_DAYS = 14|planu, próba/i;
const E2E_OLD = /3 (kolejn\w+ )?nocn\w+|trybie ścisłym/i;
const offending = (re: RegExp) => FILES.flatMap((f) => read(f).split('\n').map((l, i) => [f, i + 1, l] as const)).filter(([, , l]) => re.test(l) && !HISTORY.test(l)).map(([f, n, l]) => `${f}:${n} ${l.slice(0, 120)}`);

describe('droga do sklepu zgodna z M5 S1 i bramką E2E z 21.10.2026 (M1-047)', () => {
  test('model jest bez okresu próbnego (jedno miejsce: docs/monetyzacja.md)', () => { expect(read('docs/monetyzacja.md')).toMatch(/Bez okresu próbnego/); });
  test('żadna instrukcja nie każe zakładać ani sprawdzać okresu próbnego (poza historią oznaczoną „uchylone”)', () => { expect(offending(TRIAL)).toEqual([]); });
  test('żaden dokument nie wymaga „3 nocy” ani „trybu ścisłego” jako bramki App Store (poza historią)', () => { expect(offending(E2E_OLD)).toEqual([]); });
  test('docs/38 pkt 11 podaje bramkę z CLAUDE.md: jeden pełny katalog na standardowym iPhonie', () => {
    expect(read('CLAUDE.md')).toMatch(/jeden pełny katalog E2E\s+na standardowym iPhonie/);
    expect(read('docs/38-przeplywy-i-luki-e2e.md')).toMatch(/jeden pełny katalog E2E na standardowym iPhonie/);
  });
  test('US-13 (katalog i docs/39): sześć scenariuszy M5 S1 z oczekiwanym wynikiem, bez próby', () => {
    const us = (JSON.parse(read('tests/przeplywy.json')).przeplywy as any[]).find((x) => x.id === 'US-13');
    const all = JSON.stringify(us);
    expect(us).toBeDefined(); expect(all).not.toMatch(/prób|trial/i);
    for (const s of ['każdy plan', 'Przywróć zakupy', 'tryb samolotowy', 'zwrot', 'Chmura rodzinna', 'limitu dni treningowych', 'brak oferty wprowadzającej']) expect([s, all.includes(s)]).toEqual([s, true]);
    const d39 = read('docs/39-lista-kontrolna-wydania.md'); const blk = d39.slice(d39.indexOf('**US-13**'), d39.indexOf('- [ ]', d39.indexOf('**US-13**')));
    expect(blk).not.toMatch(/prób/i); expect(blk).toContain('brak oferty wprowadzającej');
  });
});
