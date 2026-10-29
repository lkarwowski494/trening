/*
 * Strażnik „decyzja → wdrożenie → test” dla docs/18-przekazanie.md (M1-audytor-generalny-009, decyzja właściciela DEC-02 a z 27.10.2026:
 * strażnik w verify dla wszystkich decyzji, także wstecz, z tabel audytu M1 z 27.10.2026). Skrypt: scripts/decyzje.mjs (`npm run check:decyzje`).
 * Powód (lekcja w docs/40, 27.10.2026): decyzja z 23.10.2026 o kolejności planów była zapisana z „Wdrożenie: gałąź …”, nigdy nie weszła do kodu,
 * a test przypinał stan przeciwny — przez 4 dni nic tego nie sygnalizowało. Każdy wpis ma teraz pole [wdrożenie: …] i test albo powód.
 * Rodzaje (docs/20): logika (wpisy, sprawdzWpis na próbkach), dane (cały dziennik zielony), regresja (tabela zgodności z audytu M1 27.10.2026).
 */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { spawnSync } from 'child_process';

const ROOT = path.join(__dirname, '..');
const SKRYPT = path.join(ROOT, 'scripts/decyzje.mjs');
const D18 = 'docs/18-przekazanie.md';

type Wpis = { linia: number; data: string; rodzaj: string; naglowek: string; tekst: string };
/** Wywołanie funkcji modułu ESM przez node (Jest nie ładuje .mjs wprost). */
function wywolaj<T>(kod: string): T {
  const r = spawnSync(process.execPath, ['--input-type=module', '-e',
    `import * as m from ${JSON.stringify(SKRYPT)}; const out = await (async () => { ${kod} })(); console.log(JSON.stringify(out));`], { encoding: 'utf8', cwd: ROOT });
  if (r.status !== 0) throw new Error(r.stderr);
  return JSON.parse(r.stdout);
}
/** Błędy dla tekstu dziennika (pliki testów czytane z repo). */
const bledy = (tekst: string): string[] => wywolaj<{ blad: string }[]>(`return m.sprawdz('probka.md', ${JSON.stringify(tekst)});`).map(e => e.blad);
const dziennik = (...wpisy: string[]) => ['# 18', '', '## Decyzje (od 11.10.2026)', ...wpisy, ''].join('\n');

describe('scripts/decyzje.mjs — wpisy dziennika', () => {
  test('wpis = punkt z datą (także pogrubioną i zakresem dni) albo rozdział z datą i własną treścią; rozdział bez treści (same punkty z datą) nie jest wpisem', () => {
    const t = dziennik('- 11.10.2026: a', '  ciąg dalszy', '- **13.10.2026 (właściciel) — b**', '## 14.10.2026 — c', '- punkt bez daty', '## 15.10.2026 — pusty', '- 14–18.10.2026: d');
    const w = wywolaj<Wpis[]>(`return m.wpisy(${JSON.stringify(t)});`);
    expect(w.map(x => [x.data, x.rodzaj])).toEqual([['2026-10-11', 'punkt'], ['2026-10-13', 'punkt'], ['2026-10-14', 'rozdział'], ['2026-10-14', 'punkt']]);
    expect(w[0].tekst).toContain('ciąg dalszy');
  });
  test('wpisy przed sekcją „## Decyzje” nie są sprawdzane', () => {
    expect(wywolaj<Wpis[]>(`return m.wpisy(${JSON.stringify('# 18\n- 11.10.2026: stan\n')});`)).toEqual([]);
  });
});

describe('scripts/decyzje.mjs — reguły pola wdrożenia (próbki)', () => {
  const T = 'tests/paywall-kolejnosc-domyslna.test.ts'; /* zawiera datę 27.10.2026 */
  test('dopisanie decyzji bez pola wdrożenia czerwieni strażnik (test akceptacyjny 07-jakosc-005)', () => {
    expect(bledy(dziennik('- 28.10.2026 (właściciel): nowa kolejność planów'))).toEqual(['brak pola [wdrożenie: …]']);
  });
  test('[wdrożenie: kod] bez testu i bez powodu — czerwony; z [bez testu: powód] — zielony; za krótki powód — czerwony', () => {
    expect(bledy(dziennik('- 27.10.2026 (właściciel): x [wdrożenie: kod]'))).toEqual(['[wdrożenie: kod] bez [test: …] i bez [bez testu: powód]']);
    expect(bledy(dziennik('- 27.10.2026 (właściciel): x [wdrożenie: kod] [bez testu: sprawdza tylko przebieg w CI]'))).toEqual([]);
    expect(bledy(dziennik('- 27.10.2026 (właściciel): x [wdrożenie: kod] [bez testu: x]'))).toEqual(['[bez testu: …] — powód krótszy niż 10 znaków']);
  });
  test('wskazany test musi istnieć', () => {
    expect(bledy(dziennik('- 27.10.2026 (właściciel): x [wdrożenie: kod] [test: tests/nie-ma-takiego.test.ts]'))).toEqual(['test tests/nie-ma-takiego.test.ts nie istnieje']);
  });
  test('wskazany test zawiera datę decyzji (07-jakosc-005); wstecz (przed 28.10.2026) wystarczy fragment z pliku testu', () => {
    expect(bledy(dziennik(`- 27.10.2026 (właściciel): x [wdrożenie: kod] [test: ${T}]`))).toEqual([]);
    expect(bledy(dziennik(`- 26.10.2026 (właściciel): x [wdrożenie: kod] [test: ${T}]`))[0]).toMatch(/nie zawiera daty decyzji \(26\.10\.2026\)/);
    expect(bledy(dziennik(`- 26.10.2026 (właściciel): x [wdrożenie: kod] [test: ${T} :: PLAN_ORDER]`))).toEqual([]);
    expect(bledy(dziennik(`- 26.10.2026 (właściciel): x [wdrożenie: kod] [test: ${T} :: fragment, którego nie ma]`))[0]).toMatch(/nie zawiera fragmentu/);
  });
  test('od 28.10.2026 fragment nie zastępuje daty: nowy wskazany test musi zawierać datę decyzji', () => {
    expect(bledy(dziennik(`- 30.10.2026 (właściciel): x [wdrożenie: kod] [test: ${T} :: PLAN_ORDER]`))[0]).toMatch(/nie zawiera daty decyzji \(30\.10\.2026\)/); /* plik próbki zawiera „28.10.2026” w komentarzu */
  });
  test('bez kodu — z powodem; zastąpione — data nie wcześniejsza niż wpis; otwarte/odłożone — ze wskazaniem; inne — czerwony; dwa pola — czerwony', () => {
    expect(bledy(dziennik('- 27.10.2026: x [wdrożenie: bez kodu — proces wydania]'))).toEqual([]);
    expect(bledy(dziennik('- 27.10.2026: x [wdrożenie: bez kodu]'))).toEqual(['[wdrożenie: bez kodu — powód]: brak powodu']);
    expect(bledy(dziennik('- 23.10.2026: x [wdrożenie: zastąpione 27.10.2026]'))).toEqual([]);
    expect(bledy(dziennik('- 23.10.2026: x [wdrożenie: zastąpione 22.10.2026]'))).toEqual(['zastąpione decyzją wcześniejszą niż wpis']);
    expect(bledy(dziennik('- 23.10.2026: x [wdrożenie: otwarte → M1-audytor-generalny-024]'))).toEqual([]);
    expect(bledy(dziennik('- 23.10.2026: x [wdrożenie: otwarte]'))[0]).toMatch(/brak wskazania/);
    expect(bledy(dziennik('- 23.10.2026: x [wdrożenie: odłożone → 1.0.1]'))).toEqual([]);
    expect(bledy(dziennik('- 23.10.2026: x [wdrożenie: wdrożone]'))[0]).toMatch(/nieznane pole wdrożenia/);
    expect(bledy(dziennik('- 23.10.2026: x [wdrożenie: bez kodu — a b c] [wdrożenie: kod]'))[0]).toMatch(/2 pola/);
  });
  test('[usuwa] (29.10.2026): decyzja usuwająca treść wymaga „kod” z [test: …] pilnującym braku; samo „kod” z [bez testu], „bez kodu” i brak testu — czerwone', () => {
    const BLAD = /^\[usuwa\] wymaga \[wdrożenie: kod\] z \[test: …\]/;
    expect(bledy(dziennik(`- 27.10.2026: usunięto zdanie karty [usuwa] [wdrożenie: kod] [test: ${T}]`))).toEqual([]);
    expect(bledy(dziennik('- 27.10.2026: usunięto zdanie karty [usuwa] [wdrożenie: kod] [bez testu: sprawdza tylko przebieg w CI]'))[0]).toMatch(BLAD);
    expect(bledy(dziennik('- 27.10.2026: usunięto zdanie karty [usuwa] [wdrożenie: bez kodu — proces]'))[0]).toMatch(BLAD);
    expect(bledy(dziennik('- 27.10.2026: usunięto zdanie karty [usuwa] [wdrożenie: kod]')).some(e => BLAD.test(e))).toBe(true);
    expect(bledy(dziennik('- 27.10.2026: usunięto zdanie karty [usuwa]'))).toEqual(['brak pola [wdrożenie: …]']);
  });
  test('[usuwa] niewdrożone: otwarte → ID i odłożone → wersja dozwolone (test dopiero przy wdrożeniu); zastąpione też; wpis bez [usuwa] nie podlega regule', () => {
    expect(bledy(dziennik('- 27.10.2026: usunąć pasek [usuwa] [wdrożenie: otwarte → M1-audytor-generalny-024]'))).toEqual([]);
    expect(bledy(dziennik('- 27.10.2026: usunąć pasek [usuwa] [wdrożenie: odłożone → 1.0.1]'))).toEqual([]);
    expect(bledy(dziennik('- 23.10.2026: usunąć pasek [usuwa] [wdrożenie: zastąpione 27.10.2026]'))).toEqual([]);
    expect(bledy(dziennik('- 27.10.2026: zmiana [wdrożenie: bez kodu — proces wydania]'))).toEqual([]);
  });
  test('pole może stać w dowolnej linii wpisu wieloliniowego i w treści rozdziału', () => {
    expect(bledy(dziennik('- 27.10.2026: x', '  dalej [wdrożenie: bez kodu — proces wydania]', '## 27.10.2026 — rozdział', 'treść [wdrożenie: bez kodu — zapis stanu]'))).toEqual([]);
  });
});

describe(`${D18}: każdy wpis decyzji ma pole wdrożenia i test albo powód (stan repozytorium)`, () => {
  /* dziennik czytany w procesie podrzędnym (ponad 128 KB — za długi na argument wywołania) */
  const czytaj = `(await import('node:fs')).readFileSync(${JSON.stringify(path.join(ROOT, D18))}, 'utf8')`;
  const wpisy = wywolaj<Wpis[]>(`return m.wpisy(${czytaj});`);
  test('dziennik bez błędów strażnika (wynik jak `npm run check:decyzje`)', () => {
    expect(wywolaj<unknown[]>(`return m.sprawdz(${JSON.stringify(D18)}, ${czytaj});`)).toEqual([]);
    expect(wpisy.length).toBeGreaterThan(300); /* wstecz od 11.10.2026: 319 wpisów 27.10.2026 */
  });
  test('CLI: `npm run check:decyzje` w verify; kod 0 na repozytorium', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
    expect(pkg.scripts['check:decyzje']).toBe('node scripts/decyzje.mjs --check');
    expect(pkg.scripts.verify).toContain('npm run check:decyzje');
    const r = spawnSync(process.execPath, [SKRYPT, '--check'], { cwd: ROOT, encoding: 'utf8' });
    expect([r.status, r.stdout]).toEqual([0, expect.stringContaining('każdy z polem wdrożenia')]);
  });
  test('CLI: dziennik z wpisem bez pola kończy się kodem 1 z linią wpisu', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'decyzje-')); const tmp = path.join(dir, 'decyzje-probka.md');
    fs.writeFileSync(tmp, dziennik('- 28.10.2026 (właściciel): bez pola'));
    try {
      const r = spawnSync(process.execPath, [SKRYPT, '--check', tmp], { cwd: ROOT, encoding: 'utf8' });
      expect(r.status).toBe(1); expect(r.stderr).toMatch(/decyzje-probka\.md:4: brak pola \[wdrożenie: …\]/);
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  });

  /* Tabela zgodności decyzji z kodem z audytu M1 (27.10.2026, role 01/02/03/04/07/08): decyzje, które audyt uznał za niewdrożone albo bez wymuszenia.
     Pole nie może ich ukryć: albo „otwarte → ID zadania napraw”, albo (po naprawie) „kod” ze wskazanym testem; nigdy „bez kodu” ani „kod” bez testu. */
  const NIEWDROZONE: [string, string, string][] = [
    ['2026-10-12', 'P2 B (ekran zakupu raz po pierwszym treningu)', 'M1-audytor-generalny-001'],
    ['2026-10-12', '0.16 (docs/29)', 'M1-audytor-generalny-002'],
    ['2026-10-18', 'po analizie porażek E2E', 'M1-audytor-generalny-034'],
    ['2026-10-21', 'K1–K2 M8', 'M1-audytor-generalny-017'],
    ['2026-10-21', 'STOP 3 przebiegu M3', 'M1-audytor-generalny-024'],
    ['2026-10-23', 'decyzje właściciela po audycie generalnym M1', 'M1-audytor-generalny-024'],
    ['2026-10-27', 'po zgłoszeniu z TestFlight', 'M1-audytor-generalny-005'],
  ];
  const pole = (w: Wpis) => /\[wdrożenie: ([^\]]*)\]/.exec(w.tekst)![1];
  test.each(NIEWDROZONE)('%s „%s”: otwarte → %s albo kod z testem (tabela audytu M1)', (data, kotwica, id) => {
    const w = wpisy.filter(x => x.data === data && x.tekst.includes(kotwica));
    expect(w).toHaveLength(1);
    const p = pole(w[0]);
    if (/^kod$/.test(p)) expect(w[0].tekst).toMatch(/\[test: /);
    else expect([p.startsWith('otwarte →'), p.includes(id)]).toEqual([true, true]);
  });
  test('„Wyjątek Ukraina” z 13.10.2026: zamknięty jako zastąpiony 27.10.2026 (DEC-07 b, M1-audytor-generalny-037; dawniej „otwarte → 037” w tabeli wyżej)', () => {
    const ua = wpisy.find(x => x.data === '2026-10-13' && x.tekst.includes('Wyjątek Ukraina'))!;
    expect([pole(ua), /M1-audytor-generalny-037/.test(ua.tekst), /Z-10b/.test(ua.tekst)]).toEqual(['zastąpione 27.10.2026', true, true]);
  });
  test('kolejność planów: wpis z 23.10.2026 zastąpiony 27.10.2026; wpis z 27.10.2026 wskazuje test kolejności i planu domyślnego (02-monetyzacja-003)', () => {
    const z23 = wpisy.find(x => x.data === '2026-10-23' && x.tekst.includes('miesięczny, roczny, dożywotni'))!;
    expect(pole(z23)).toBe('zastąpione 27.10.2026');
    const z27 = wpisy.find(x => x.data === '2026-10-27' && x.tekst.includes('kolejność planów na ekranie „Pełna wersja” zostaje'))!;
    expect([pole(z27), z27.tekst.includes('[test: tests/paywall-kolejnosc-domyslna.test.ts]')]).toEqual(['kod', true]);
  });
});
