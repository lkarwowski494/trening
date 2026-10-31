/*
 * Zrzuty zegarka do App Store (A7, 27.10.2026): dane pokazowe w języku zrzutu i Apple bez kanału alfa.
 * Błędy z przeglądu zestawu z 27.10.2026 (watch-sim run 40457515962): (1) wszystkie PNG miały kanał alfa — Apple odrzuca takie zrzuty; (2) dane treningu
 * („Bench Press (sztanga)”, „seria 1 z 3”) po polsku we wszystkich 35 lokalizacjach.
 */
import * as fs from 'fs';
import * as path from 'path';
import { LANGS, applyLang, t } from '@/lib/i18n';
import { watchSnapshotsFor, WATCH_SHOT_STATES } from '../scripts/screens/watch-seed';
import { teardownWorld } from './watch-world';

afterEach(teardownWorld);
const SCRIPT = fs.readFileSync(path.join(__dirname, '..', 'scripts', 'ci', 'watch-screenshots.sh'), 'utf8');
const WORKFLOW = fs.readFileSync(path.join(__dirname, '..', '.github', 'workflows', 'watch-sim.yml'), 'utf8');

describe('zrzuty zegarka: dane w języku zrzutu', () => {
  test.each(LANGS.map(l => [l]))('%s: migawki wszystkich stanów mają język zrzutu', async (lang) => {
    const snaps = await watchSnapshotsFor(lang);
    expect(Object.keys(snaps).sort()).toEqual(Object.keys(WATCH_SHOT_STATES).sort());
    for (const s of Object.values(snaps)) expect(s.lang).toBe(lang);
  }, 60e3);

  test('licznik serii i nazwa ćwiczenia: polski tylko w pl, w en po angielsku', async () => {
    const pl = (await watchSnapshotsFor('pl'))['set-first'] as any; const en = (await watchSnapshotsFor('en'))['set-first'] as any;
    expect(pl.now.counter).toMatch(/seria 1 z 3/);
    expect(en.now.counter).not.toMatch(/seria/i); expect(en.now.counter).toMatch(/1/);
    expect(en.now.title).not.toBe(pl.now.title);
    applyLang('en'); expect(t('Trening')).toBeTruthy();
  }, 60e3);

  test('żaden język poza pl i sk/cs/hr/sl/sr/… nie zawiera polskiego licznika „seria … z …”', async () => {
    for (const lang of LANGS.filter(l => l !== 'pl')) {
      const c = ((await watchSnapshotsFor(lang))['set-first'] as any).now.counter as string;
      expect(c).not.toMatch(/^seria \d+ z \d+$/);
    }
  }, 300e3);

  test('stan „wstrzymany” ma wstrzymany trening (jedyny ekran z nakładką pauzy)', async () => {
    const snaps = await watchSnapshotsFor('en');
    expect(snaps.paused.paused).toBe(true);
    for (const [k, s] of Object.entries(snaps)) if (k !== 'paused') expect(s.paused).toBe(false);
  }, 60e3);
});

describe('zrzuty zegarka: potok', () => {
  test('skrypt zrzutów czyta migawki w języku zrzutu i usuwa kanał alfa (Apple odrzuca alfę)', () => {
    expect(SCRIPT).toMatch(/WATCH_DANE/);
    expect(SCRIPT).toMatch(/-alpha off/);
    expect(SCRIPT).toMatch(/identify[^\n]*channels|%\[channels\]/); /* po konwersji skrypt sprawdza, że alfy nie ma */
  });
  test('zestaw do sklepu: stan „paused” wrócił (101-20), pliki NN-<stan>.png w kolejności', () => {
    const states = SCRIPT.match(/STATES="([^"]+)"/)![1].split(' ');
    expect(states).toEqual(['set-first', 'rest-after-first', 'paused', 'last-rest', 'done', 'idle']);
    expect(SCRIPT).not.toMatch(/Bez stanu „paused”/);
    expect(SCRIPT).toMatch(/printf '%02d' "\$i"\)-\$state\.png/);
  });
  test('workflow generuje migawki (jest) i wywołuje skrypt z katalogiem danych', () => {
    expect(WORKFLOW).toMatch(/scripts\/screens\/watch-seed\.test\.ts/);
    expect(WORKFLOW).toMatch(/WATCH_SEED_OUT/);
  });
});

describe('zegarek: pasek znaczników nie nachodzi na treść (101-20, 29.10.2026)', () => {
  const ROOT = fs.readFileSync(path.join(__dirname, '..', 'targets', 'watch-app', 'RootView.swift'), 'utf8');
  test('badges (offline, „Trening wstrzymany”, sesja) rezerwują miejsce nad treścią zamiast nakładać się na nagłówek „Przerwa”', () => {
    const body = ROOT.slice(ROOT.indexOf('var body: some View'), ROOT.indexOf('@ViewBuilder private func content'));
    expect(body).not.toMatch(/\.overlay\([^)]*topTrailing[^)]*\)\s*\{\s*badges/);
    expect(body).toMatch(/\.safeAreaInset\(edge: \.top[^)]*\)\s*\{\s*badges\(v\)/);
  });
});
