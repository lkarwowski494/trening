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

jest.setTimeout(240000);
const ROOT = path.join(__dirname, '..');
const skan = (rodziny: string[]) => JSON.parse(execFileSync(process.execPath, [path.join(ROOT, 'scripts/figures/odtwarzanie-poz.mjs'), ...rodziny], { cwd: ROOT, env: { PATH: process.env.PATH ?? '' } as unknown as NodeJS.ProcessEnv, encoding: 'utf8', maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() || '{}');
const skanDozwolonyKod1 = (rodziny: string[]) => { try { return skan(rodziny); } catch (e) { const out = (e as { stdout?: Buffer | string }).stdout; if (!out) throw e; return JSON.parse(out.toString()); } };

/* Stan z 28.10.2026 (integracja-1-1 @ b2067b8c): rozbieżności w rodzinach poza zakresem sesji tresc-plyo-sanie; do naprawy przez właścicieli rodzin. */
const ROZJAZDY_POZA_ZAKRESEM: Record<string, string[]> = {
  core_floor: ['Superman', 'Crunch', 'Frog Sit-Ups', 'Janda Sit-Up', 'Oblique Crunches - On The Floor', 'Sit Up', 'Toe Touchers', 'Bicycle Crunch', 'Cross-Body Crunch', 'Scissor Kick'],
  curl: ['Spider Curl', 'Spider Curl (sztanga)'],
  delt_raise: ['Straight Raises on Incline Bench'],
  forearm: ['Barbell Wrist Curl', 'Barbell Reverse Wrist Curl', 'Wrist Curl (hantle)', 'Reverse Wrist Curl (hantle)', 'One-Arm Dumbbell Wrist Curl', 'One-Arm Dumbbell Reverse Wrist Curl', 'Cable Wrist Curl'],
  glute_floor: ['Donkey Kick', 'Fire Hydrant', 'Clamshell', 'Cable Kickback', 'Hip Extension with Bands', 'Machine Glute Kickback', 'Prone Flutter Kicks'],
  hip_abd_add: ['Cable Hip Abduction'],
  pull_up: ['Gironda Sternum Chins', 'Chin Up', 'Mixed Grip Chin', 'Neutral Grip Pull Up', 'One Arm Chin-Up', 'Pull Up', 'Side To Side Chins', 'Gorilla Chin/Crunch'],
  rotator_cuff: ['External Rotation (linki)', 'External Rotation with Band', 'Internal Rotation with Band', 'Cable Internal Rotation', 'Reverse Flyes With External Rotation'],
  row: ['Lying T-Bar Row', 'Chest Supported Row'],
  shrug: ['Middle Back Shrug'],
  thruster: ['Clean and Press'],
};
const W_ZAKRESIE = ['plyo', 'core_hang', 'core_standing', 'strongman', 'sled_throw'];

describe('generator rodziny odtwarza zatwierdzony plik póz', () => {
  test.each(W_ZAKRESIE)('%s: generuj() = plik póz, każda poza ważna', (r) => { expect(skanDozwolonyKod1([r])).toEqual({ [r]: {} }); });

  test('rodziny spoza zakresu: rozbieżności dokładnie jak na liście (lista nie rośnie i nie zalega)', () => {
    const wszystkie = skanDozwolonyKod1([]) as Record<string, Record<string, string>>;
    const stan = Object.fromEntries(Object.entries(wszystkie).filter(([r, v]) => !W_ZAKRESIE.includes(r) && Object.keys(v).length).map(([r, v]) => [r, Object.keys(v).sort()]));
    const oczekiwane = Object.fromEntries(Object.entries(ROZJAZDY_POZA_ZAKRESEM).map(([r, v]) => [r, [...v].sort()]));
    expect(stan).toEqual(oczekiwane);
  });
});
