/*
 * Niezmiennik silnika „kolano-strona” (lib/figures/v2/contract.ts): kolano leży po stronie swojego biodra względem OSI CIAŁA. Oś ciała to oś miednicy, nie płaszczyzna z = 0 świata:
 * przy przesunięciu bocznym miednicy (przesuniecieBoczne: Lateral Lunge, Cossack Squat, Barbell Side Split Squat) biodro wyciągniętej nogi leży przy z = 0 (1,2 cm), a kolano 25 cm dalej,
 * więc stara wersja (znak z biodra względem świata) odrzucała poprawne pozy. Sprawdzian: te trzy pozy przechodzą, a prawdziwe przekroczenie osi (kostka po drugiej stronie miednicy) jest łapane
 * także przy przesuniętej miednicy (stara wersja go nie widziała: biodro prawie na osi świata).
 */
import * as path from 'path';
import { execFileSync } from 'child_process';

jest.setTimeout(240000);
const ROOT = path.join(__dirname, '..');
const run = (code: string) => JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', code], { cwd: ROOT, env: { PATH: process.env.PATH ?? '' } as unknown as NodeJS.ProcessEnv, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
const KOD = `
import fs from 'node:fs';
import { waliduj } from ${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-validate.mjs'))};
const d = JSON.parse(fs.readFileSync(${JSON.stringify(path.join(ROOT, 'lib/figures/v2/poses/lunge.json'))}, 'utf8')).cwiczenia;
const strona = (p) => waliduj(p, { rodzina: 'lunge', cwiczenie: p.cwiczenie }).bledy.filter((b) => b.kod === 'kolano-strona').length;
const pu = JSON.parse(fs.readFileSync(${JSON.stringify(path.join(ROOT, 'lib/figures/v2/poses/pull_up.json'))}, 'utf8')).cwiczenia['Side To Side Chins'];
const out = { poprawne: {} };
out.poprawne['Side To Side Chins'] = waliduj(pu, { rodzina: 'pull_up', cwiczenie: 'Side To Side Chins' }).bledy.filter((b) => b.kod === 'kolano-strona').length;
for (const c of ['Lateral Lunge', 'Cossack Squat', 'Barbell Side Split Squat']) out.poprawne[c] = strona(d[c]);
const zle = JSON.parse(JSON.stringify(d['Lateral Lunge']));
for (const k of zle.klatki) { if (k.nogi.L.kostka[2] < -20) { k.nogi.L.kostka[2] = 30; delete k.nogi.L.biegunKolana; } }
out.zle = strona(zle);
console.log(JSON.stringify(out));
`;
const W = run(KOD) as { poprawne: Record<string, number>; zle: number };

describe('kolano-strona: oś ciała = oś miednicy (przesunięcie boczne)', () => {
  test.each(['Lateral Lunge', 'Cossack Squat', 'Barbell Side Split Squat', 'Side To Side Chins'])('%s: poprawna poza z biodrem prawie na osi (przesunięcie boczne, ruch na boki) nie łamie niezmiennika', (c) => { expect(W.poprawne[c]).toBe(0); });
  test('kostka lewej nogi po prawej stronie miednicy (prawdziwe przekroczenie osi) jest odrzucona także przy przesuniętej miednicy', () => { expect(W.zle).toBeGreaterThan(0); });
});
