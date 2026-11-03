/*
 * Run 41538603321 (02.11.2026): krok „Aktualizacja” w e2e-ios.yml jest uruchamiany przez `bash -e`; zapis `faza …; rc=$?` kończył krok przy pierwszej
 * porażce, więc obiecane jedno ponowienie pary 33–34 nigdy się nie wykonywało („padł (bez ponowienia)”). Test wykonuje wiersze sterujące z workflowu
 * w `bash -e` z podstawioną funkcją faza.
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { spawnSync } from 'child_process';

const y = readFileSync(join(__dirname, '..', '.github/workflows/e2e-ios.yml'), 'utf8').split('\n');
const start = y.findIndex(l => /^\s+(rc=0; )?faza e2e-out\/aktualizacja(;| \|\|)/.test(l));
const end = y.findIndex((l, i) => i > start && l.trim() === 'exit $rc');
const ctl = y.slice(start, end + 1).map(l => l.replace(/^ {10}/, '')).join('\n');

const run = (fails: number) => spawnSync('bash', ['-e', '-c', `STRICT=false; n=0\nfaza() { n=$((n+1)); echo "faza $1"; [ "$n" -gt ${fails} ]; }\n${ctl}`], { encoding: 'utf8' });

describe('krok „Aktualizacja”: ponowienie pary 33–34 działa pod bash -e', () => {
  test('pierwsza faza czerwona, druga zielona -> jedno ponowienie, wynik 0', () => {
    const r = run(1); expect(r.stdout).toContain('faza e2e-out/aktualizacja/ponowienie'); expect(r.status).toBe(0);
  });
  test('obie czerwone -> ponowienie było, wynik niezerowy', () => {
    const r = run(2); expect(r.stdout).toContain('faza e2e-out/aktualizacja/ponowienie'); expect(r.status).not.toBe(0);
  });
  test('pierwsza zielona -> bez ponowienia', () => {
    const r = run(0); expect(r.stdout).not.toContain('ponowienie'); expect(r.status).toBe(0);
  });
});
