/* Audyt jakości 007 i 012 (01.11.2026) — tests.yml: (007) limit czasu wyliczony z pomiaru, nie zgadywany; (012) kasa z tagami i pełną historią,
 * bo test dziennika wydań bez tagów jest pusty. Dowód na gotowym produkcie: przebieg tests.yml na gałęzi (zielony, z log „tests/audit-m1-050-release-log” liczący tagi).
 * ZB-029 T1 (31.10.2026): po podziale na zadania kontrole / jest (części) / zbiorcze verify limity są per zadanie, liczby w scripts/ci/czasy-tests.json. */
import { readFileSync } from 'fs';
import { join } from 'path';

const root = join(__dirname, '..');
const yml = readFileSync(join(root, '.github/workflows/tests.yml'), 'utf8');
type Probka = { przebieg: number; min: number; czesc?: number };
type Zadanie = { minimalna_probka: number; limit_tymczasowy_min: number; probka_min: Probka[] };
const czasy = JSON.parse(readFileSync(join(root, 'scripts/ci/czasy-tests.json'), 'utf8')) as {
  zapas: number; krok_zaokraglenia_min: number; czesci_jest: number; zbiorcze_limit_min: number;
  przed_podzialem: { limit_min: number; probka_min: Probka[] }; po_podziale: { jest: Zadanie; kontrole: Zadanie };
};
const p95 = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.ceil(0.95 * xs.length) - 1];
const wylicz = (xs: number[]) => Math.ceil((p95(xs) * czasy.zapas) / czasy.krok_zaokraglenia_min) * czasy.krok_zaokraglenia_min;
const zadania = yml.slice(yml.indexOf('\njobs:')).split(/^  (?=[\w-]+:\s*$)/m).slice(1);
const limitZadania = (n: string) => Number(/timeout-minutes: (\d+)/.exec(zadania.find(z => z.startsWith(`${n}:`)) ?? '')?.[1]);
/** Oczekiwany limit zadania: z pomiaru, a do czasu pełnej próbki — tymczasowy (zapisany w pliku pomiarów). */
const oczekiwany = (z: Zadanie) => (z.probka_min.length >= z.minimalna_probka ? wylicz(z.probka_min.map(p => p.min)) : z.limit_tymczasowy_min);

describe('tests.yml: limity czasu z pomiaru (007, ZB-029 T1)', () => {
  test('timeout-minutes zadań kontrole i jest = p95 próbki × zapas, w górę do kroku (albo limit tymczasowy do pełnej próbki); zbiorcze verify — stała z pliku pomiarów', () => {
    expect(limitZadania('kontrole')).toBe(oczekiwany(czasy.po_podziale.kontrole));
    expect(limitZadania('jest')).toBe(oczekiwany(czasy.po_podziale.jest));
    expect(limitZadania('verify')).toBe(czasy.zbiorcze_limit_min);
  });
  test('pomiar przed podziałem (jedno zadanie verify): p95 × zapas daje dawny limit 55 min; próbka ≥ 10 przebiegów (punkt odniesienia)', () => {
    expect(wylicz(czasy.przed_podzialem.probka_min.map(p => p.min))).toBe(czasy.przed_podzialem.limit_min);
    expect(czasy.przed_podzialem.probka_min.length).toBeGreaterThanOrEqual(10);
  });
  test('po pomiarze limit mieści najdłuższy zmierzony czas zadania z zapasem i jest niższy niż dawne 55 min', () => {
    for (const [n, z] of Object.entries(czasy.po_podziale)) {
      const lim = limitZadania(n); expect(lim).toBeLessThan(czasy.przed_podzialem.limit_min);
      if (z.probka_min.length >= z.minimalna_probka) expect(lim).toBeGreaterThan(Math.max(...z.probka_min.map(p => p.min)) * 1.2);
    }
  });
  test('liczba części Jest w macierzy i w --shard = czesci_jest; próbka części zawiera wpisy tylko z numerów 1..czesci_jest', () => {
    const j = zadania.find(z => z.startsWith('jest:')) ?? '';
    expect(j).toContain(`czesc: [${Array.from({ length: czasy.czesci_jest }, (_, i) => i + 1).join(', ')}]`);
    expect(j).toContain(`--shard=\${{ matrix.czesc }}/${czasy.czesci_jest}`);
    for (const p of czasy.po_podziale.jest.probka_min) expect(p.czesc! >= 1 && p.czesc! <= czasy.czesci_jest).toBe(true);
  });
  test('limity są tylko w trzech zadaniach (kontrole, jest, verify) — żadnego innego timeout-minutes', () => { expect((yml.match(/timeout-minutes:/g) ?? []).length).toBe(3); });
});

describe('tests.yml: tagi i historia dla dziennika wydań (012)', () => {
  test('actions/checkout z fetch-depth: 0 i fetch-tags: true', () => {
    expect(yml).toMatch(/actions\/checkout@v\d+\s*\n\s+with:\s*\n(?:\s+#.*\n|\s+\S.*\n)*?\s+fetch-depth: 0/); expect(yml).toMatch(/fetch-tags: true/);
  });
  test('test dziennika wydań w CI nie bywa pusty: wymaga co najmniej jednego tagu v*-b* (L-080: tagi z innych gałęzi niż testowana też trafiają do kasy dzięki fetch-tags)', () => {
    const t = readFileSync(join(root, 'tests/audit-m1-050-release-log.test.ts'), 'utf8'); expect(t).toMatch(/GITHUB_ACTIONS[\s\S]*tags\.length[\s\S]*toBeGreaterThan\(0\)/);
  });
});
