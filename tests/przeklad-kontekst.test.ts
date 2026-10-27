/*
 * Kontekst ekranu w przekładzie i przeglądzie przez API (lekcje L-030, L-041; 27.10.2026): budujZadanie dostaje docs/lokalizacja/konteksty.json
 * i dodaje do pozycji pole „kontekst” (skrócone do KONTEKST_MAX znaków). Rodzaje (docs/20): logika (moduł kontekst.mjs), scenariusz (budowa żądań),
 * regresja (L-041 „Podciąganie” = faza ruchu; L-030 „Przerwa” = odpoczynek między seriami), dane (wszystkie klucze dynamiczne mają kontekst ręczny).
 * Bez sieci. Skrypty są modułami ESM — wywołanie przez `node --input-type=module`.
 */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';

const ROOT = path.join(__dirname, '..');
const mod = (f: string) => path.join(ROOT, 'scripts/i18n', f);
const run = (code: string) => JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', code], { env: { PATH: process.env.PATH ?? '' } as unknown as NodeJS.ProcessEnv, encoding: 'utf8', maxBuffer: 1 << 26 }));
const PRZEKLAD = JSON.stringify(mod('przeklad-api.mjs')); const PRZEGLAD = JSON.stringify(mod('przeglad-api.mjs')); const KONT = JSON.stringify(mod('kontekst.mjs'));
const R = JSON.stringify(ROOT);

/** Zadanie przekładu dla pozycji (pl, en) z prawdziwymi kontekstami repozytorium; zwraca [pozycje z promptu, system, user]. */
const przeklad = (pozycje: { pl: string; en: string }[], kod = 'de') => run(`import * as m from ${PRZEKLAD}; import * as k from ${KONT};
  const poz = ${JSON.stringify(pozycje)}.map((p, i) => ({ id: i + 1, rodzaj: 'nowy', ...p }));
  const z = m.budujZadanie(${JSON.stringify(kod)}, poz, {}, null, k.wczytajKonteksty(${R}));
  const user = z.messages[0].content; console.log(JSON.stringify({ system: z.system, user, lista: JSON.parse(user.slice(user.lastIndexOf('\\n[') + 1)) }));`);

describe('kontekst.mjs: wczytanie i skracanie', () => {
  test('kontekstDla: opis zwraca, „dynamiczny” i brak klucza → null, długi opis skrócony do KONTEKST_MAX z wielokropkiem', () => {
    const w = run(`import * as k from ${KONT}; console.log(JSON.stringify({ max: k.KONTEKST_MAX,
      ok: k.kontekstDla({ a: 'przycisk [x.tsx:1]' }, 'a'), dyn: k.kontekstDla({ a: 'dynamiczny (lista)' }, 'a'), brak: k.kontekstDla({}, 'a'), puste: k.kontekstDla({ a: '  ' }, 'a'), nul: k.kontekstDla(null, 'a'),
      dlugi: k.kontekstDla({ a: 'x'.repeat(500) }, 'a'), proto: k.kontekstDla({}, 'constructor') }))`);
    expect(w.max).toBe(200); expect(w.ok).toBe('przycisk [x.tsx:1]'); expect(w.dyn).toBeNull(); expect(w.brak).toBeNull(); expect(w.puste).toBeNull(); expect(w.nul).toBeNull(); expect(w.proto).toBeNull();
    expect(w.dlugi.length).toBe(200); expect(w.dlugi.endsWith('…')).toBe(true);
  });
  test('wczytajKonteksty: brak pliku (atrapa projektu) → pusty obiekt; prawdziwe repozytorium → wpisy', () => {
    const w = run(`import * as k from ${KONT}; console.log(JSON.stringify({ pusty: k.wczytajKonteksty('/nie/ma/projektu'), n: Object.keys(k.wczytajKonteksty(${R})).length }))`);
    expect(w.pusty).toEqual({}); expect(w.n).toBeGreaterThan(300);
  });
});

describe('przekład API: pole „kontekst” w pozycji', () => {
  test('klucz z kontekstem ręcznym i z miejsca użycia dostaje pole; klucz długi bez kontekstu — bez pola; każdy kontekst ≤ 200 znaków', () => {
    const { lista } = przeklad([{ pl: 'Podciąganie', en: 'Pull' }, { pl: 'Skakanka', en: 'Jump rope' }, { pl: 'Zapisz', en: 'Save' }, { pl: 'Zapis serii zakończył się bez błędów, wszystko w porządku.', en: 'The set was saved without errors.' }]);
    expect(lista[0].kontekst).toMatch(/FAZY/); expect(lista[1].kontekst).toMatch(/lib\/equipment\.ts/); expect(lista[2].kontekst).toMatch(/\.tsx?:\d+/);
    expect('kontekst' in lista[3]).toBe(false);
    for (const p of lista) if (p.kontekst) expect(p.kontekst.length).toBeLessThanOrEqual(200);
  });
  test('polecenie systemowe mówi, jak użyć pola „kontekst”', () => {
    const { system } = przeklad([{ pl: 'Zapisz', en: 'Save' }]);
    expect(system).toMatch(/kontekst/); expect(system).toMatch(/CZYM jest/); expect(system).toMatch(/odpoczynek między seriami/);
  });
  test('bez konteksów (stare wywołanie z 4 argumentami) pozycja nie ma pola — zgodność wstecz', () => {
    const w = run(`import * as m from ${PRZEKLAD}; const z = m.budujZadanie('de', [{ id: 1, rodzaj: 'nowy', pl: 'Podciąganie', en: 'Pull' }]); console.log(JSON.stringify(z.messages[0].content.includes('kontekst"')))`);
    expect(w).toBe(false);
  });
  test('REGRESJA L-041: faza „Podciąganie” ma w poleceniu opis „faza ruchu, nie nazwa ćwiczenia”', () => {
    const { lista } = przeklad([{ pl: 'Podciąganie', en: 'Pulling' }, { pl: 'Opuszczanie', en: 'Lowering' }, { pl: '{faza} {n} s', en: '{faza} {n} s' }]);
    expect(lista[0].kontekst).toMatch(/FAZY animacji ruchu/); expect(lista[0].kontekst).toMatch(/NIE nazwa ćwiczenia/);
    expect(lista[1].kontekst).toMatch(/FAZY/); expect(lista[2].kontekst).toMatch(/fazy ruchu \(nie ćwiczenia\)/);
  });
  test('REGRESJA L-030: „Przerwa” i „Przerwa robocza” = odpoczynek między seriami na siłowni, nie przerwa w pracy', () => {
    const { lista } = przeklad([{ pl: 'Przerwa', en: 'Rest' }, { pl: 'Przerwa robocza', en: 'Working rest' }], 'pt-BR');
    for (const p of lista) { expect(p.kontekst).toMatch(/między seriami/i); expect(p.kontekst).toMatch(/NIE (przerwa w pracy|praca zawodowa)/); }
  });
});

describe('przegląd API: pole „kontekst” w zdaniu', () => {
  test('zdanie rodzaju „nowe” z kluczem mającym kontekst dostaje pole; wskazówki techniki i brak kontekstu — bez pola', () => {
    const w = run(`import * as m from ${PRZEGLAD}; import * as k from ${KONT};
      const z = [{ id: 1, rodzaj: 'nowe', klucz: 'Podciąganie', pl: 'Podciąganie', en: 'Pulling', tlum: 'Klimmzug' }, { id: 2, rodzaj: 'wskazowka', klucz: 'Podciąganie', pl: 'x', en: 'x', tlum: 'y' }, { id: 3, rodzaj: 'nowe', klucz: 'Długi tekst bez kontekstu w pliku.', pl: 'Długi tekst bez kontekstu w pliku.', en: 'Long', tlum: 'Lang' }];
      const t = m.budujZadanie('de', z, k.wczytajKonteksty(${R})); const u = t.messages[0].content; console.log(JSON.stringify({ lista: JSON.parse(u.slice(u.lastIndexOf('\\n[') + 1)), system: t.system }));`);
    expect(w.lista[0].kontekst).toMatch(/NIE nazwa ćwiczenia/); expect('kontekst' in w.lista[1]).toBe(false); expect('kontekst' in w.lista[2]).toBe(false);
    expect(w.system).toMatch(/kontekst/);
  });
});

describe('koszt: kontekst mieści się w limicie', () => {
  test('szacunek tokenów rośnie o kontekst, ale nie więcej niż KONTEKST_MAX znaków na pozycję', () => {
    const w = run(`import * as m from ${PRZEKLAD}; import * as k from ${KONT};
      const kon = k.wczytajKonteksty(${R}); const poz = Object.keys(kon).slice(0, 300).map((pl, i) => ({ id: i + 1, rodzaj: 'nowy', pl, en: pl }));
      const a = JSON.stringify(m.budujZadanie('de', poz, {}, null, null).messages[0].content).length; const b = JSON.stringify(m.budujZadanie('de', poz, {}, null, kon).messages[0].content).length;
      console.log(JSON.stringify({ dodane: b - a, n: poz.length }));`);
    expect(w.dodane).toBeGreaterThan(0); expect(w.dodane).toBeLessThanOrEqual(w.n * (200 + 30));
  });
});
