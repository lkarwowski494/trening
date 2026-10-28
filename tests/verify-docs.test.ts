/* Decyzja właściciela 21.10.2026 „Szybsze verify dla dokumentów”: commit zmieniający TYLKO dokumenty przechodzi `npm run verify:docs`
   (szybkie kontrole + testy czytające zmienione dokumenty) zamiast pełnego verify; kod, testy, skrypty i workflowy — dalej pełne verify.
   Skrypt jest sprawdzany przez CLI: VERIFY_DOCS_CHANGED (pliki rozdzielone nową linią) zastępuje odczyt z gita, `--plan` niczego nie uruchamia. */
import { readFileSync } from 'fs';
import { join } from 'path';
import { spawnSync } from 'child_process';

const root = join(__dirname, '..');
const SKRYPT = join(root, 'scripts/verify-docs.mjs');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

type Plan = { dokumenty: boolean; poza: string[]; zmienione: string[]; komendy: string[]; testy: string[] };
const uruchom = (zmienione: string[], ...args: string[]) =>
  spawnSync(process.execPath, [SKRYPT, ...args], { cwd: root, encoding: 'utf8', env: { ...process.env, VERIFY_DOCS_CHANGED: zmienione.join('\n') } });
const plan = (zmienione: string[]): Plan => {
  const r = uruchom(zmienione, '--plan');
  expect(r.status).toBe(0);
  return JSON.parse(r.stdout);
};

const DOKUMENTY = [
  'docs/18-przekazanie.md', 'docs/40-lekcje.md', 'docs/brd/reguly.md', 'CLAUDE.md', 'README.md', '.claude/agents/programista.md',
];
const NIE_DOKUMENTY = [
  'lib/plan.ts', 'app/(tabs)/index.tsx', 'components/ActiveWorkout.tsx', 'tests/hak-pre-push.test.ts', 'scripts/readme.mjs', 'scripts/verify-docs.mjs',
  '.github/workflows/tests.yml', '.maestro/01-start.yaml', 'package.json', 'package-lock.json', 'app.json', 'site/index.html',
  'docs/research/rejestr-twierdzen.json', 'docs/research/equipment/catalog.csv', 'docs/research/25-biblioteka/podsumowanie-L2.mjs',
  'tests/fixtures/released/README.md', 'watch-fixtures/README.md', 'lib/locales/pl.json', 'targets/watch/Info.plist',
];

describe('verify:docs — klasyfikacja plików (docs vs kod)', () => {
  test.each(DOKUMENTY)('%s jest dokumentem', f => {
    const p = plan([f]);
    expect(p.dokumenty).toBe(true);
    expect(p.poza).toEqual([]);
  });
  test.each(NIE_DOKUMENTY)('%s nie jest dokumentem', f => {
    const p = plan([f]);
    expect(p.dokumenty).toBe(false);
    expect(p.poza).toEqual([f]);
  });
  test('mieszanka: dokument i kod → nie dokumenty, na liście „poza” tylko kod', () => {
    const p = plan(['docs/18-przekazanie.md', 'lib/plan.ts', 'CLAUDE.md', 'package.json']);
    expect(p.dokumenty).toBe(false);
    expect(p.poza).toEqual(['lib/plan.ts', 'package.json']);
  });
  test('brak zmian: nic do sprawdzenia, kod 0, nie jest „tylko dokumentami”', () => {
    const r = uruchom([]);
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('brak zmian');
    expect(uruchom([], '--czy-dokumenty').status).toBe(1);
  });
});

describe('verify:docs — komunikat i kody wyjścia', () => {
  test('zmiany poza dokumentami: kod 1, komunikat po polsku z listą plików i poleceniem pełnego verify, nic nie jest uruchamiane', () => {
    const r = uruchom(['docs/18-przekazanie.md', 'lib/plan.ts']);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('zmiany poza dokumentami — uruchom npm run verify');
    expect(r.stderr).toContain('lib/plan.ts');
    expect(r.stderr).not.toContain('docs/18-przekazanie.md');
    expect(r.stdout).not.toMatch(/npm run|> trening/);
  });
  test('--czy-dokumenty: 0 tylko gdy są zmiany i wszystkie są dokumentami (bez wypisywania)', () => {
    expect(uruchom(['docs/18-przekazanie.md', 'CLAUDE.md'], '--czy-dokumenty').status).toBe(0);
    expect(uruchom(['docs/18-przekazanie.md', 'lib/plan.ts'], '--czy-dokumenty').status).toBe(1);
    expect(uruchom(['docs/18-przekazanie.md'], '--czy-dokumenty').stdout).toBe('');
  });
});

describe('verify:docs — co jest uruchamiane dla dokumentów', () => {
  test('szybkie kontrole w stałej kolejności, bez lint, typecheck, jest całości, exportu i verify:native', () => {
    const p = plan(['docs/18-przekazanie.md']);
    expect(p.komendy.slice(0, 5)).toEqual(['npm run check:readme', 'npm run check:matrix', 'npm run check:claims', 'npm run check:decyzje', 'npm run check:i18n']);
    expect(p.komendy.join(' ')).not.toMatch(/lint|typecheck|expo|verify:native|check:licenses|check:cues|check:figures/);
  });
  test('zmiana w docs/brd dodaje kontrolę BRD', () => {
    expect(plan(['docs/brd/reguly.md']).komendy).toContain('node scripts/kontrola-brd.mjs docs/brd');
    expect(plan(['docs/18-przekazanie.md']).komendy.join(' ')).not.toContain('kontrola-brd');
  });
  test('testy Jest: te, które wymieniają zmieniony dokument po nazwie, ścieżce albo katalogu', () => {
    const t = plan(['docs/18-przekazanie.md']).testy;
    expect(t).toContain('tests/audit-m1-045-store-description.test.ts');
    expect(plan(['.claude/agents/programista.md']).testy).toContain('tests/hak-pre-push.test.ts'); /* po katalogu .claude/agents */
    expect(plan(['CLAUDE.md']).testy).toContain('tests/forbidden-names.test.ts');
  });
  test('testy przeglądające cały katalog docs są zawsze uwzględnione', () => {
    const t = plan(['docs/18-przekazanie.md']).testy;
    for (const f of ['tests/readme.test.ts', 'tests/public-repo.test.ts', 'tests/e2e-pakiet.test.ts']) expect(t).toContain(f);
  });
  test('lista testów bez powtórzeń, tylko pliki tests/*.test.ts(x), posortowana', () => {
    const t = plan(['docs/18-przekazanie.md', 'docs/40-lekcje.md', 'CLAUDE.md']).testy;
    expect(new Set(t).size).toBe(t.length);
    expect(t.every(f => /^tests\/[^/]+\.test\.tsx?$/.test(f))).toBe(true);
    expect([...t].sort()).toEqual(t);
  });
});

describe('verify:docs — wpięcie w repozytorium', () => {
  test('polecenie npm istnieje i wskazuje na skrypt; nie należy do verify (wyjątek w package-scripts)', () => {
    expect(pkg.scripts['verify:docs']).toBe('node scripts/verify-docs.mjs');
    expect(pkg.scripts.verify).not.toContain('verify:docs');
  });
  test('CLAUDE.md opisuje wyjątek dla commitu tylko z dokumentami', () => {
    const c = readFileSync(join(root, 'CLAUDE.md'), 'utf8');
    expect(c).toContain('commit tylko z dokumentami: `npm run verify:docs`');
  });
});
