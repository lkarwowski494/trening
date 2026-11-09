/* Strażnik progu wolnego miejsca (L-121, ZB-050; decyzja koordynatora 09.11.2026, zatwierdzona przez właściciela 09.11.2026):
   `verify:lekkie` po haku i kontroli czystej kopii uruchamia scripts/sprawdz-dysk.mjs; poniżej progu (jedno miejsce: MIN_WOLNE_GB) przerywa z instrukcją zwolnienia miejsca;
   polecenie programisty zawiera krok `df -h /`. */
import { readFileSync } from 'fs';
import { join } from 'path';
import { spawnSync } from 'child_process';

const root = join(__dirname, '..');
const read = (p: string) => readFileSync(join(root, p), 'utf8');
const GB = 1024 ** 3;
const uruchom = (bajty: number) => spawnSync('node', ['scripts/sprawdz-dysk.mjs'], { cwd: root, encoding: 'utf8', env: { ...process.env, TRENING_WOLNE_BAJTY_TEST: String(bajty) } });

describe('próg wolnego miejsca na dysku (ZB-050, 09.11.2026)', () => {
  test('próg wynosi 2 GB i jest zdefiniowany w jednym miejscu', () => {
    expect(read('scripts/sprawdz-dysk.mjs')).toMatch(/export const MIN_WOLNE_GB = 2;/);
    expect(read('package.json')).not.toMatch(/MIN_WOLNE|2\s*GB/);
  });
  test('1,9 GB → kod 1 i komunikat z instrukcją zwolnienia miejsca', () => {
    const r = uruchom(1.9 * GB);
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/Za mało wolnego miejsca[^]*1\.90 GB < 2 GB[^]*Zwolnij miejsce[^]*git worktree remove[^]*df -h/);
  });
  test('2 GB → kod 0 (granica włącznie), 50 GB → kod 0', () => {
    expect(uruchom(2 * GB).status).toBe(0);
    expect(uruchom(50 * GB).status).toBe(0);
  });
  test('verify:lekkie sprawdza dysk zaraz po haku i czystej kopii (kolejność G2 z ZB-041)', () => {
    const lekkie = JSON.parse(read('package.json')).scripts['verify:lekkie'] as string;
    expect(lekkie.startsWith('node scripts/hooks/sprawdz-instalacje.mjs && node scripts/verify-znacznik.mjs --czysta && node scripts/sprawdz-dysk.mjs && ')).toBe(true);
  });
  test('verify:szybkie też sprawdza dysk zaraz po haku i czystej kopii (równe verify:lekkie poza testami Jest)', () => {
    expect(JSON.parse(read('package.json')).scripts['verify:szybkie'].startsWith('node scripts/hooks/sprawdz-instalacje.mjs && node scripts/verify-znacznik.mjs --czysta && node scripts/sprawdz-dysk.mjs && ')).toBe(true);
  });
  test('polecenie programisty ma krok df -h / przed długimi testami z progiem 2 GB', () => {
    expect(read('.claude/agents/programista.md')).toMatch(/df -h \/[^\n]*2 GB/);
  });
});
