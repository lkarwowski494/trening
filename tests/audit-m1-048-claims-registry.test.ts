/*
 * M1-audytor-generalny-048 (DEC-16): rejestr twierdzeń dla tekstów dziedzinowych interfejsu — docs/research/rejestr-twierdzen.json, kontrola scripts/claims.mjs (npm run check:claims, część verify).
 * Test akceptacyjny: verify kończy się błędem, gdy tekst dziedzinowy w słowniku nie ma ID w rejestrze albo jego skrót różni się od zapisanego w przeglądzie.
 * Kontrolę ćwiczymy na danych sztucznych (test potrafi paść) i na prawdziwym słowniku.
 */
import { execFileSync, spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.join(__dirname, '..');
const script = path.join(ROOT, 'scripts/claims.mjs');
const read = (f: string) => fs.readFileSync(path.join(ROOT, f), 'utf8');

/** Wywołuje checkClaims na danych sztucznych w osobnym procesie (moduł ESM). */
function check(EN: Record<string, string>, registry: unknown, docs: Record<string, string>): string[] {
  const code = `import * as c from ${JSON.stringify('file://' + script)}; const a = JSON.parse(process.argv[1]); process.stdout.write(JSON.stringify(c.checkClaims(a.EN, a.registry, (p) => a.docs[p] ?? null)));`;
  return JSON.parse(execFileSync('node', ['--input-type=module', '-e', code, JSON.stringify({ EN, registry, docs })], { encoding: 'utf8' }));
}
const hashOf = (s: string): string => execFileSync('node', ['--input-type=module', '-e', `import { hash } from ${JSON.stringify('file://' + script)}; process.stdout.write(hash(process.argv[1]));`, s], { encoding: 'utf8' });

const TEXT = 'Serie: {s} na ćwiczenie — ACSM 2026 zaleca co najmniej {m}; to uproszczenie.';
const EN_T = 'Sets: {s} per exercise — ACSM 2026 recommends at least {m}; this is a simplification.';
const entry = (over: Record<string, unknown> = {}) => ({ id: 'T-001', kotwica: TEXT.slice(0, 30), skrot: hashOf(TEXT), skrotEn: hashOf(EN_T), rodzaje: ['uproszczenie'], zrodla: ['ACSM 2026'], dokument: 'd.md', fraza: 'ACSM 2026', przeglad: '2026-10-20: test', ...over });
const docs = { 'd.md': 'tekst o ACSM 2026' };

describe('kontrola rejestru twierdzeń (dane sztuczne)', () => {
  test('zgodny rejestr: brak błędów', () => { expect(check({ [TEXT]: EN_T }, { twierdzenia: [entry()] }, docs)).toEqual([]); });
  test('tekst dziedzinowy bez ID w rejestrze → błąd', () => {
    const e = check({ [TEXT]: EN_T }, { twierdzenia: [] }, docs); expect(e).toHaveLength(1); expect(e[0]).toMatch(/bez ID w rejestrze/);
  });
  test('tekst bez znaczników dziedzinowych i krótkie etykiety nie wymagają wpisu', () => {
    expect(check({ 'Zapisz trening na koniec sesji i wróć do listy.': 'Save', 'Zalecenia': 'Recommendations' }, { twierdzenia: [] }, docs)).toEqual([]);
  });
  test('zmiana polskiego brzmienia bez ponownego przeglądu (skrót różny) → błąd', () => {
    const changed = TEXT.replace('co najmniej', 'minimum');
    const e = check({ [changed]: EN_T }, { twierdzenia: [entry({ kotwica: TEXT.slice(0, 30) })] }, docs);
    expect(e.join('\n')).toMatch(/polski tekst zmieniony od przeglądu/);
  });
  test('zmiana angielskiego brzmienia (skrót różny) → błąd', () => {
    const e = check({ [TEXT]: EN_T.replace('recommends', 'requires') }, { twierdzenia: [entry()] }, docs);
    expect(e.join('\n')).toMatch(/angielskie brzmienie zmienione od przeglądu/);
  });
  test('wpis bez tekstu w słowniku → błąd', () => {
    expect(check({}, { twierdzenia: [entry()] }, docs).join('\n')).toMatch(/nie istnieje w słowniku/);
  });
  test('dokument albo fraza nie istnieje → błąd; brak dokumentu wymaga uwagi „[OTWARTE”', () => {
    expect(check({ [TEXT]: EN_T }, { twierdzenia: [entry({ dokument: 'brak.md' })] }, docs).join('\n')).toMatch(/nie istnieje/);
    expect(check({ [TEXT]: EN_T }, { twierdzenia: [entry({ fraza: 'zmyślona fraza' })] }, docs).join('\n')).toMatch(/nie zawiera frazy/);
    expect(check({ [TEXT]: EN_T }, { twierdzenia: [entry({ dokument: null, fraza: null })] }, docs).join('\n')).toMatch(/\[OTWARTE/);
    expect(check({ [TEXT]: EN_T }, { twierdzenia: [entry({ dokument: null, fraza: null, uwaga: '[OTWARTE — brak]' })] }, docs)).toEqual([]);
  });
  test('cytat autora „Nazwisko i in. RRRR” bez innych znaczników też wymaga wpisu (przegląd badacza 21.10.2026: tekst z Helms i in. 2016 był poza kontrolą)', () => {
    const cyt = 'RIR wpisuje się w zakresie od zera do pięciu powtórzeń w zapasie (Helms i in. 2016).';
    expect(check({ [cyt]: 'RIR from 0 to 5 (Helms et al. 2016).' }, { twierdzenia: [] }, docs).join('\n')).toMatch(/bez ID w rejestrze/);
  });
  test('powtórzone ID i nieznany rodzaj → błąd', () => {
    const e = check({ [TEXT]: EN_T }, { twierdzenia: [entry(), entry({ kotwica: 'inna kotwica dłuższa niż dwadzieścia' }), entry({ id: 'T-002', rodzaje: ['zmyślony'] })] }, docs).join('\n');
    expect(e).toMatch(/id powtórzone/); expect(e).toMatch(/rodzaje spośród/);
  });
});

describe('rejestr twierdzeń: prawdziwy słownik i verify', () => {
  test('npm run check:claims przechodzi (kod 0): każdy tekst dziedzinowy ma wpis, skróty zgodne, dokumenty istnieją', () => {
    const r = spawnSync('node', [script, '--check'], { encoding: 'utf8' });
    expect(r.stderr).toBe(''); expect(r.status).toBe(0); expect(r.stdout).toMatch(/rejestr zgodny/);
  });
  test('rejestr ma wpisy ze wszystkimi rodzajami wagi z tekstów (uproszczenie, konwencja, jedno źródło, źródło cytowane)', () => {
    const reg = JSON.parse(read('docs/research/rejestr-twierdzen.json')) as { twierdzenia: { rodzaje: string[] }[] };
    const kinds = new Set(reg.twierdzenia.flatMap((e) => e.rodzaje));
    for (const k of ['uproszczenie', 'konwencja', 'jedno źródło', 'źródło cytowane w tekście']) expect(kinds.has(k)).toBe(true);
    expect(reg.twierdzenia.length).toBeGreaterThanOrEqual(30);
  });
  test('verify (package.json) wywołuje check:claims; CLAUDE.md ma regułę rejestru', () => {
    const pkg = JSON.parse(read('package.json')) as { scripts: Record<string, string> };
    expect(pkg.scripts['check:claims']).toBe('node scripts/claims.mjs --check');
    expect(pkg.scripts.verify).toMatch(/npm run check:claims/);
    expect(read('CLAUDE.md')).toMatch(/rejestr-twierdzen\.json/);
  });
});
