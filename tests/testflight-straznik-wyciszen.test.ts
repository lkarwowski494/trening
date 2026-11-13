/*
 * 07-jakosc-004 (recenzja 13.11.2026, KO-059): strażnik zadań `testy` i `build` w testflight.yml wykrywa wyciszenie porażki testów
 * (`|| true`, `|| :`, `|| exit 0`, cokolwiek po komendzie testów, `continue-on-error`, `if: always()` / `!cancelled()` na zadaniu lub kroku).
 * Przyczyna: dawny strażnik kotwiczył krok `run: npm run verify\s*$`; po podziale na części asercja sprawdzała tylko obecność komendy (mutacje 1–3 z recenzji przechodziły).
 * Rodzaje (docs/20): logika (detektor), niezmienniki (obecny plik czysty), regresja (każda mutacja → czerwony detektor).
 * Wyjątki jawne (powód przy każdym; zwalniają tylko z warunku `if:` i `|| true`, nie z continue-on-error ani z zakazu komend testów): krok odczytu pamięci po Jest (tylko odczyt, `sysctl`/`vm_stat`),
 * sprzątanie klucza ASC po wysyłce (`if: always()`), maskowanie identyfikatorów w logach (`if: failure()`, `|| exit 0`), artefakt logów (`if: failure()`). Nic z tego nie kończy ani nie zastępuje testów.
 * Poprawki recenzji niezależnej df611fa (KO-059): failure()/success() i wielolinijkowy if, wyjątek nie zwalnia z kontroli komend testów, blok `run: |` i `shell:`.
 * Gałąź długo żyjąca (L-080): strażnik czyta stan drzewa roboczego (nie różnicę względem main), więc wcześniejsze zmiany gałęzi nie zmieniają wyniku — wzór: tests/testflight-testy-czas.test.ts.
 * Data decyzji: 13.11.2026.
 */
import { readFileSync } from 'fs';
import { join } from 'path';

const root = join(__dirname, '..');
const yml = readFileSync(join(root, '.github/workflows/testflight.yml'), 'utf8');

const bezKomentarzy = (s: string) => s.split('\n').map(l => l.replace(/(^|\s)#.*$/, '')).join('\n');
const zadanie = (src: string, n: string) => {
  const czesci = src.slice(src.indexOf('\njobs:')).split(/^  (?=[\w-]+:\s*$)/m).slice(1);
  return czesci.find(z => z.startsWith(`${n}:`)) ?? '';
};
/* kroki zadania: bloki od `      - ` (6 spacji); część przed pierwszym krokiem to nagłówek zadania (poziom zadania) */
const kroki = (z: string) => z.split(/^(?=      - )/m);

/* Wyjątki: nazwa kroku (początek) → powód. Dodanie wyjątku wymaga powodu i zmiany tego testu. */
const WYJATKI: Record<string, { zadanie: string; powod: string }> = {
  'Pamięć po Jest': { zadanie: 'testy', powod: 'tylko odczyt vm.swapusage/vm_stat po testach; `|| true` i always() nie zmieniają wyniku części Jest' },
  'Usunięcie klucza z maszyny': { zadanie: 'build', powod: 'sprzątanie AuthKey.p8 po wysyłce (always) — nie dotyczy testów, które padają przed buildem (needs: testy)' },
  'Identyfikatory klucza wycięte z logów': { zadanie: 'build', powod: 'maskowanie logów tylko przy failure(); `|| exit 0` przy braku sekretów (przebieg bez wysyłki)' },
  'uses: actions/upload-artifact@v4': { zadanie: 'build', powod: 'artefakt logów (testflight-logi) tylko przy failure(); nie wpływa na wynik zadania' },
};
const nazwa = (k: string) => /^      - (?:name: )?(.*)$/m.exec(k)?.[1] ?? '';
const wyjatek = (k: string, z: string) => Object.entries(WYJATKI).some(([n, w]) => w.zadanie === z && nazwa(k).startsWith(n));

const WYCISZENIE = /\|\|\s*(true|:|exit\s+0)\b|\|\|\s*:\s*$/m;
/* warunek kroku/zadania: każda funkcja statusu (always, cancelled, failure, success — także w `success() || failure()`) albo wielolinijkowy `if: >-` / `if: |` / pusty */
const WARUNEK_STATUS = /^\s*(?:-\s+)?if:.*(always\(\)|cancelled\(\)|failure\(\)|success\(\))/m;
const WARUNEK_WIELOLINIOWY = /^\s*(?:-\s+)?if:\s*(?:[>|][+-]?\d?)?\s*$/m;
const TESTY = /(verify:kontrole|jest-ponow|npx jest|npm run verify)\b/;
const KOMENDA_TESTOW = /^(?:npm run verify:kontrole|node scripts\/jest-ponow\.mjs --shard=\$\{\{ matrix\.czesc \}\}\/\d+)$/;
/** Treść `run:` kroku: linie po `run:` (jedna linia albo blok `|`/`>`), bez nagłówka. */
const trescRun = (k: string): string[] | null => {
  const l = k.split('\n'); const i = l.findIndex(x => /^\s*(?:- )?run:/.test(x));
  if (i < 0) return null;
  const wciecie = /^(\s*)/.exec(l[i])![1].length + (/^\s*- /.test(l[i]) ? 2 : 0);
  const pierwsza = l[i].replace(/^\s*(?:- )?run:\s*/, '').trim();
  const reszta: string[] = [];
  for (const x of l.slice(i + 1)) { if (x.trim() && /^(\s*)/.exec(x)![1].length <= wciecie) break; if (x.trim()) reszta.push(x.trim()); }
  return /^[>|][+-]?\d?$/.test(pierwsza) || pierwsza === '' ? reszta : [pierwsza, ...reszta];
};

/** Zwraca listę naruszeń (puste = zadania testy i build bez wyciszeń). */
function wyciszenia(src: string): string[] {
  const wynik: string[] = [];
  for (const n of ['testy', 'build']) {
    const z = bezKomentarzy(zadanie(src, n));
    if (!z) { wynik.push(`${n}: brak zadania`); continue; }
    kroki(z).forEach((k, i) => {
      const jestWyjatek = wyjatek(k, n);
      const etykieta = `${n}/${i === 0 ? 'zadanie' : nazwa(k)}`;
      const run = trescRun(k) ?? [];
      if (/continue-on-error/.test(k)) wynik.push(`${etykieta}: continue-on-error`);
      /* wyjątek zwalnia tylko z warunku i z `|| true`; komendy testów w kroku wyjątku są zakazane, w pozostałych muszą być jedną czystą linią `run:` */
      const zTestami = run.some(l => TESTY.test(l));
      if (zTestami && jestWyjatek) wynik.push(`${etykieta}: komenda testów w kroku z wyjątkiem`);
      if (zTestami && !jestWyjatek && !(run.length === 1 && KOMENDA_TESTOW.test(run[0]))) wynik.push(`${etykieta}: komenda testów z dopiskiem albo w bloku: ${run.join(' ⏎ ')}`);
      if (zTestami && /^\s*shell:/m.test(k)) wynik.push(`${etykieta}: shell przy komendzie testów`);
      if (jestWyjatek) return;
      if (WARUNEK_STATUS.test(k)) wynik.push(`${etykieta}: if z funkcją statusu (always/cancelled/failure/success)`);
      if (WARUNEK_WIELOLINIOWY.test(k)) wynik.push(`${etykieta}: wielolinijkowy if`);
      if (WYCISZENIE.test(k)) wynik.push(`${etykieta}: || true / || : / || exit 0`);
      if (/^\s*set \+e\b/m.test(k)) wynik.push(`${etykieta}: set +e`);
    });
  }
  return wynik;
}
/* mutacja musi coś zmienić — inaczej test mutacji nic nie dowodzi */
const mutuj = (od: string, na: string) => { expect(yml).toContain(od); expect(yml.split(od).length - 1).toBe(1); return yml.replace(od, na); };

describe('testflight.yml: strażnik wyciszeń porażki testów (07-jakosc-004, 13.11.2026)', () => {
  test('obecny testflight.yml: zadania testy i build bez wyciszeń (wyjątki jawne z powodem)', () => {
    expect(wyciszenia(yml)).toEqual([]);
    for (const [n, w] of Object.entries(WYJATKI)) {
      expect({ n, powod: w.powod.length > 20 }).toEqual({ n, powod: true });
      expect(kroki(zadanie(yml, w.zadanie)).some(k => nazwa(k).startsWith(n))).toBe(true); /* wyjątek wskazuje istniejący krok */
    }
  });

  const JEST = 'run: node scripts/jest-ponow.mjs --shard=${{ matrix.czesc }}/6';
  const KONTROLE = 'run: npm run verify:kontrole';
  const mutacje: Array<[string, () => string]> = [
    ['|| true po komendzie Jest', () => mutuj(JEST, `${JEST} || true`)],
    ['|| : po komendzie Jest', () => mutuj(JEST, `${JEST} || :`)],
    ['|| exit 0 po komendzie Jest', () => mutuj(JEST, `${JEST} || exit 0`)],
    ['|| true po kontrolach', () => mutuj(`${KONTROLE}\n`, `${KONTROLE} || true\n`)],
    ['; true po komendzie Jest', () => mutuj(JEST, `${JEST}; true`)],
    ['continue-on-error w zadaniu testy', () => mutuj('timeout-minutes: 45', 'continue-on-error: true\n    timeout-minutes: 45')],
    ['continue-on-error w kroku Jest', () => mutuj('        run: node scripts/jest-ponow.mjs', '        continue-on-error: true\n        run: node scripts/jest-ponow.mjs')],
    ['continue-on-error w zadaniu build', () => mutuj('timeout-minutes: 90\n    steps:', 'timeout-minutes: 90\n    continue-on-error: true\n    steps:')],
    ['continue-on-error w kroku Select Xcode (build)', () => mutuj('      - name: Select Xcode 26.x\n', '      - name: Select Xcode 26.x\n        continue-on-error: true\n')],
    ['if: always() na zadaniu build', () => mutuj('needs: [bramka, testy]\n', 'needs: [bramka, testy]\n    if: always()\n')],
    ['if: ${{ always() }} na zadaniu build', () => mutuj('needs: [bramka, testy]\n', 'needs: [bramka, testy]\n    if: ${{ always() }}\n')],
    ['if: ${{ !cancelled() }} na zadaniu build', () => mutuj('needs: [bramka, testy]\n', 'needs: [bramka, testy]\n    if: ${{ !cancelled() }}\n')],
    ['if: always() na kroku z kontrolami (testy)', () => mutuj('if: matrix.czesc == 1\n', 'if: always() && matrix.czesc == 1\n')],
    ['if: always() na kroku Jest (testy)', () => mutuj('      - name: Jest (część ${{ matrix.czesc }} z 6)\n', '      - name: Jest (część ${{ matrix.czesc }} z 6)\n        if: always()\n')],
    ['if: success() || failure() na zadaniu build', () => mutuj('needs: [bramka, testy]\n', 'needs: [bramka, testy]\n    if: success() || failure()\n')],
    ['if: failure() na kroku Jest (testy)', () => mutuj('      - name: Jest (część ${{ matrix.czesc }} z 6)\n', '      - name: Jest (część ${{ matrix.czesc }} z 6)\n        if: failure()\n')],
    ['if: >- wielolinijkowy z always() na kroku Jest', () => mutuj('      - name: Jest (część ${{ matrix.czesc }} z 6)\n', '      - name: Jest (część ${{ matrix.czesc }} z 6)\n        if: >-\n          always()\n')],
    ['if: | wielolinijkowy na zadaniu build', () => mutuj('needs: [bramka, testy]\n', 'needs: [bramka, testy]\n    if: |\n      always()\n')],
    ['npx jest || true w kroku „Pamięć po Jest” (wyjątek nie zwalnia)', () => mutuj('          sysctl vm.swapusage || true\n', '          sysctl vm.swapusage || true\n          npx jest --shard=1/6 || true\n')],
    ['run: | z || echo x w 2. linii po Jest', () => mutuj(JEST, 'run: |\n          node scripts/jest-ponow.mjs --shard=${{ matrix.czesc }}/6\n          echo x')],
    ['run: | z `|| echo x` w jednej linii z Jest', () => mutuj(JEST, 'run: |\n          node scripts/jest-ponow.mjs --shard=${{ matrix.czesc }}/6 || echo x')],
    ['shell: bash {0} + echo po Jest', () => mutuj('        run: node scripts/jest-ponow.mjs', '        shell: bash {0}\n        run: node scripts/jest-ponow.mjs')],
    ['if: always() na kroku buildu innym niż wyjątek', () => mutuj('      - name: Select Xcode 26.x\n', '      - name: Select Xcode 26.x\n        if: always()\n')],
  ];
  test.each(mutacje)('mutacja: %s → strażnik czerwony', (_n, zrob) => {
    expect(wyciszenia(zrob()).length).toBeGreaterThan(0);
  });
});
