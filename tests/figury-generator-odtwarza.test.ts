/*
 * Strażnik „generator odtwarza plik póz rodziny” (28.10.2026, sesja tresc-plyo-sanie).
 * Błąd: po wdrożeniu tekstów wskazówek 1.1 (b1f8ea59) generator rodziny rysował pozy błędów, których nie ma w zatwierdzonym pliku
 * (bledyZOpisem filtrował tylko po obecności tekstu w pl.json), a Toes to Bar i Single-Leg Lateral Hop nie przechodziły walidacji;
 * ponowne generowanie (run.mjs --zastosuj) nadpisałoby zatwierdzone pozy. Zasada: dla każdej rodziny z generatorem `generuj()` daje DOKŁADNIE to,
 * co jest w lib/figures/v2/poses/<rodzina>.json (cmp), a każda poza jest ważna. Nowa poza błędu wchodzi do pliku przez recenzję (zdjęcie wstrzymania), nie przez przypadek.
 * ROZJAZDY_POZA_ZAKRESEM: rodziny, których tu nie naprawiono (należą do innych sesji); lista może tylko malała — wpis, który już się zgadza, wywala test (usuń go).
 */
import * as path from 'path';
import { execFileSync } from 'child_process';
import { INNA_ARYTMETYKA, TOLERANCJA_POZ } from './helpers/inna-arytmetyka';

jest.setTimeout(240000);
const ROOT = path.join(__dirname, '..');
const skan = (rodziny: string[]) => JSON.parse(execFileSync(process.execPath, [path.join(ROOT, 'scripts/figures/odtwarzanie-poz.mjs'), ...rodziny], { cwd: ROOT, env: { PATH: process.env.PATH ?? '', ...(INNA_ARYTMETYKA ? { ODTWARZANIE_TOLERANCJA: String(TOLERANCJA_POZ) } : {}) } as unknown as NodeJS.ProcessEnv, encoding: 'utf8', maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() || '{}');
const skanDozwolonyKod1 = (rodziny: string[]) => { try { return skan(rodziny); } catch (e) { const out = (e as { stdout?: Buffer | string }).stdout; if (!out) throw e; return JSON.parse(out.toString()); } };

/* Stan z 28.10.2026 (integracja-1-1 @ b2067b8c): rozbieżności w rodzinach poza zakresem sesji tresc-plyo-sanie; do naprawy przez właścicieli rodzin. */
const ROZJAZDY_POZA_ZAKRESEM: Record<string, string[]> = {
  core_floor: ['Superman', 'Crunch', 'Frog Sit-Ups', 'Janda Sit-Up', 'Oblique Crunches - On The Floor', 'Sit Up', 'Toe Touchers', 'Bicycle Crunch', 'Cross-Body Crunch', 'Scissor Kick'],
  delt_raise: ['Straight Raises on Incline Bench'],
  calf_raise: [/* ACG-020 31.10.2026 (podest pod przodostopiem; generator do backlogu) */ 'Seated Calf Raise', 'Seated Calf Raise (hantle)', 'Barbell Seated Calf Raise', 'Dumbbell Seated One-Leg Calf Raise'],
  forearm: ['Barbell Wrist Curl', 'Barbell Reverse Wrist Curl', 'Wrist Curl (hantle)', 'Reverse Wrist Curl (hantle)', 'One-Arm Dumbbell Wrist Curl', 'One-Arm Dumbbell Reverse Wrist Curl', 'Cable Wrist Curl'],
  glute_floor: [/* 08.11.2026 (A2): Clamshell i Fire Hydrant odtwarzane — karty własne nie mają hab.mis.high, więc generator nie dokłada rzędu błędu */ 'Donkey Kick', 'Cable Kickback', 'Hip Extension with Bands', 'Machine Glute Kickback', 'Prone Flutter Kicks'],
  hip_abd_add: ['Cable Hip Abduction'],
  leg_isolation: [/* ACG-019 31.10.2026 */ 'Seated Band Hamstring Curl'],
  mobility_stand: [/* ACG-013 31.10.2026 (figura na stopniu) */ 'Standing Gastrocnemius Calf Stretch'],
  pull_up: ['Gironda Sternum Chins', 'Chin Up', 'Mixed Grip Chin', 'Neutral Grip Pull Up', 'One Arm Chin-Up', 'Pull Up', 'Side To Side Chins', 'Gorilla Chin/Crunch'],
  rotator_cuff: ['External Rotation (linki)', 'External Rotation with Band', 'Cable Internal Rotation', 'Reverse Flyes With External Rotation'],
  row: ['Lying T-Bar Row', 'Chest Supported Row', /* wyjątek nazwany 01.11.2026 (koordynator 1.1): karty Bent Over Row ×2 i T-Bar Row wróciły po recenzji v1, więc częsty błąd mis.roundBack ma opis i generator rysuje jego pozę, której nie ma w zatwierdzonym row.json; rodzina row v2 niewyświetlana — poza błędu wejdzie przez recenzję rodziny (fala 2) */ 'Bent Over Row (sztanga)', 'Bent Over Row (hantle)', 'T-Bar Row'],
  thruster: ['Clean and Press'],
};
const W_ZAKRESIE = ['plyo', 'core_hang', 'core_standing', 'strongman', 'sled_throw', /* pilotaż toru 02.11.2026: generator odtwarza plik (ACG-012 i Spider Curl wniesione do generatora) */ 'curl', /* partia 3 (09.11.2026): pozy przeliczone generatorem po recenzjach r2 */ 'shrug', 'pulldown'];


describe('generator rodziny odtwarza zatwierdzony plik póz', () => {
  test.each(W_ZAKRESIE)('%s: generuj() = plik póz, każda poza ważna', (r) => { expect(skanDozwolonyKod1([r])).toEqual({ [r]: {} }); });

  test('06.11.2026 (macOS): symulacja innej arytmetyki (sin/cos/atan2/acos +1 ulp w co 10. wywołaniu) — porównanie bajtowe ją wykrywa, tolerancja TOLERANCJA_POZ ją przyjmuje, a prawdziwa zmiana pozy nadal jest rozbieżnością', () => {
    const zaburzone = (tol: string) => JSON.parse(execFileSync(process.execPath, [path.join(ROOT, 'scripts/figures/odtwarzanie-poz.mjs'), 'plyo'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
      env: { PATH: process.env.PATH ?? '', NODE_OPTIONS: `--import ${path.join(ROOT, 'tests/helpers/zaburz-libm.mjs')}`, SEED: '1', MOD: '10', ODTWARZANIE_TOLERANCJA: tol } as unknown as NodeJS.ProcessEnv }));
    let bajtowo: { plyo: Record<string, string> } = { plyo: {} };
    try { zaburzone('0'); } catch (e) { bajtowo = JSON.parse(String((e as { stdout?: Buffer | string }).stdout)); }
    expect(Object.keys(bajtowo.plyo).length).toBeGreaterThan(0);
    expect(zaburzone(String(TOLERANCJA_POZ))).toEqual({ plyo: {} });
    expect(Object.keys(skanDozwolonyKod1(['plyo']).plyo)).toHaveLength(0); /* bez zaburzenia nadal bajtowo zgodne */
  });

  test('rodziny spoza zakresu: rozbieżności dokładnie jak na liście (lista nie rośnie i nie zalega)', () => {
    const wszystkie = skanDozwolonyKod1([]) as Record<string, Record<string, string>>;
    const stan = Object.fromEntries(Object.entries(wszystkie).filter(([r, v]) => !W_ZAKRESIE.includes(r) && Object.keys(v).length).map(([r, v]) => [r, Object.keys(v).sort()]));
    const oczekiwane = Object.fromEntries(Object.entries(ROZJAZDY_POZA_ZAKRESEM).map(([r, v]) => [r, [...v].sort()]));
    if (INNA_ARYTMETYKA) { /* macOS (06.11.2026): tolerancja może zagoić wpis z listy (rozjazd mniejszy niż TOLERANCJA_POZ), ale lista nadal nie może rosnąć */
      for (const [r, cwiczenia] of Object.entries(stan)) { expect(Object.keys(oczekiwane)).toContain(r); for (const cw of cwiczenia as string[]) expect(oczekiwane[r]).toContain(cw); }
    } else expect(stan).toEqual(oczekiwane);
  });
});
