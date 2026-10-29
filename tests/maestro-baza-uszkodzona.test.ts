/*
 * R-RES (rejestr ryzyk docs/40; decyzja właściciela D8 wariant B, 29.10.2026): czy kopia ratunkowa plików bazy (lib/rescue.ts) naprawdę powstaje na iOS, pokazuje przebieg
 * e2e-ios.yml na symulatorze — scenariusz 60 + skrypt scripts/ci/e2e-60-baza-uszkodzona.sh (uszkodzenie bazy i sprawdzenie plików robi powłoka, Maestro nie ma dostępu do plików).
 * Ten plik pilnuje, żeby dowód nie rozsypał się po cichu: scenariusz, skrypt, krok workflow i wpis katalogu przepływów muszą do siebie pasować.
 * Sam przebieg scenariusza w interpreterze: tests/maestro-flows.test.tsx (60-baza-uszkodzona.yaml); logika kopii: tests/audit-m1-2026-10-27-004-ratunek.test.tsx.
 */
import * as fs from 'fs';
import * as path from 'path';
import { DB_FILES } from '@/lib/rescue';

const root = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');
const code = (f: string) => read(f).split('\n').filter(l => !/^\s*#/.test(l)).join('\n');
const flow = '.maestro/60-baza-uszkodzona.yaml'; const script = 'scripts/ci/e2e-60-baza-uszkodzona.sh'; const wf = read('.github/workflows/e2e-ios.yml');
const exp = wf.slice(wf.indexOf('\n  eksperymenty:'), wf.indexOf('\n  wyniki:'));

describe('R-RES: scenariusz 60 (uszkodzona baza → kopia ratunkowa)', () => {
  test('eksperyment (tag), poza listą flows, bez czyszczenia stanu — baza uszkodzona przez skrypt musi przetrwać start aplikacji', () => {
    expect(read(flow)).toMatch(/^tags:\n\s+- eksperyment\s*$/m);
    expect(read('.maestro/config.yaml')).not.toMatch(/-\s+60-baza-uszkodzona\.yaml/);
    expect(code(flow)).toMatch(/clearState: false/); expect(code(flow)).not.toMatch(/clearState: true/);
  });
  test('kroki: ekran błędu startu → „Send data” → okno „Database copy in Files” z folderem Rescue-… (zrzuty obu ekranów)', () => {
    const c = code(flow);
    for (const s of ['Could not open your data', 'id: "start-error"', 'text: "Send data"', 'Database copy in Files', 'Rescue-', 'takeScreenshot: 600-', 'takeScreenshot: 601-']) expect([s, c.includes(s)]).toEqual([s, true]);
  });
  test('skrypt ma nazwę scenariusza (krok eksperymentów szuka scripts/ci/e2e-<nazwa>.sh) i jest wykonywalny', () => {
    expect(path.basename(script, '.sh')).toBe('e2e-' + path.basename(flow, '.yaml'));
    expect(fs.statSync(path.join(root, script)).mode & 0o111).not.toBe(0);
  });
  test('skrypt: baza z pierwszego startu, kontener z simctl, wszystkie pliki bazy z lib/rescue, porównanie bajt po bajcie, oryginały bez zmian', () => {
    const s = read(script);
    expect(s).toMatch(/xcrun simctl get_app_container "\$SIM" "\$APP" data/); expect(s).toMatch(/Library\/SQLite\/trening\.db/);
    expect(s).toMatch(/maestro --device "\$SIM" test "\$FLOW"/); expect(s).toMatch(/Documents\/Backup"\/Rescue-\*/);
    for (const f of DB_FILES.filter(x => x !== 'trening.db-journal')) expect([f, s.includes(f)]).toEqual([f, true]);
    expect(s).toMatch(/cmp -s "\$RES\/\$n"/); expect(s).toMatch(/cmp -s "\$DATA\/Library\/SQLite\/trening\.db"/);
    expect(s).toMatch(/\[ "\$bad" -eq 0 \] && \[ "\$rc" -eq 0 \]\s*$/); /* kod wyjścia = porównanie plików I scenariusz */
  });
  test('repo publiczne: log nie wypisuje ścieżki kontenera ani identyfikatorów (tylko nazwy plików i rozmiary)', () => {
    for (const l of read(script).split('\n').filter(l => /\becho\b/.test(l))) {
      const seg = l.slice(l.indexOf('echo')).replace(/\$\(basename "\$\w+"\)/g, '').replace(/\$\(\( \$\(wc -c < "\$\w+"\) \)\)/g, '');
      expect([l, /\$\{?(DATA|DB|SIM|RES|FLOW|OUT)\b/.test(seg)]).toEqual([l, false]);
    }
  });
});

describe('R-RES: krok eksperymentów w e2e-ios.yml', () => {
  test('wywołuje skrypt scenariusza, gdy istnieje (zamiast maestro test), i honoruje tylko_scenariusze', () => {
    expect(exp).toMatch(/\[ -f "scripts\/ci\/e2e-\$name\.sh" \]/); expect(exp).toMatch(/bash "scripts\/ci\/e2e-\$name\.sh" "\$SIM" "\$f" "e2e-out\/\$name"/);
    expect(exp).toMatch(/ONLY: \$\{\{ inputs\.tylko_scenariusze \}\}/); expect(exp).toMatch(/printf ' %s ' \$ONLY \| grep -q " \$n "/);
  });
  test('zadanie startuje też dla `tylko_scenariusze: 60` (przebieg dowodowy), nadal niewiążące; pełny katalog uruchamia je jak dotąd', () => {
    expect(exp).toMatch(/' 60 '/); expect(exp).toMatch(/continue-on-error: true/);
    expect(exp).toMatch(/inputs\.tylko_scenariusze == '' && \(inputs\.pakiet == 'pelny' \|\| inputs\.tryb_scisly == true\)/);
  });
  test('katalog przepływów: PR-18 wskazuje scenariusz 60 w trybie eksperymentu', () => {
    const f = (JSON.parse(read('tests/przeplywy.json')).przeplywy as { id: string; scenariusz?: string; tryb?: string }[]).find(x => x.id === 'PR-18');
    expect(f?.scenariusz).toBe('60-baza-uszkodzona.yaml'); expect(f?.tryb).toBe('eksperyment');
  });
});
