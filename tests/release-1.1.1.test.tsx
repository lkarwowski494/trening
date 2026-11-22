/**
 * Wersja 1.1.1 (KO-119, 22.11.2026, docs/49b-wydanie-1-1-1.md): numer 1.1.1 w app.json, package.json i package-lock.json; „Co nowego” — nowy wpis 2026-11-22 na górze
 * (jeden punkt, bez obietnic funkcji; nie twierdzi, że opis się zmienił — audyt N-1: opis sklepu bez zmian od 1.1: wydanie z nowymi metadanymi sklepu, aplikacja bez zmian funkcji), wpis 1.1 (2026-11-11) zostaje jako starszy.
 * Rodzaje (docs/20): logika (lista wpisów), dane (wersja w trzech plikach i lockfile), języki (PL/EN i komplet 33 słowników), kropka (osoba po 1.1 znów ma kropkę).
 */
import { WHATS_NEW, whatsNewUnseen } from '@/lib/whatsnew';
import { BRAND_NAME } from '@/lib/brand';
import { applyLang, LANGS } from '@/lib/i18n';
import * as store from '@/lib/store';
import { fresh, addWorkout } from './helpers';

const fs = require('fs') as typeof import('fs'); const path = require('path') as typeof import('path');
const R = (f: string) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
const J = (f: string) => JSON.parse(R(f));
afterEach(() => { applyLang('pl'); });

const PL_1_1_1 = `Zaktualizowaliśmy informacje o ${BRAND_NAME} w App Store, żeby łatwiej było je znaleźć. Sama aplikacja działa tak samo, a treningi, szablony i ustawienia zostają bez zmian.`;

describe('wersja 1.1.1 (KO-119, 22.11.2026)', () => {
  test('app.json, package.json i package-lock.json (projekt) — 1.1.1', () => {
    const lock = J('package-lock.json');
    expect([J('app.json').expo.version, J('package.json').version, lock.version, lock.packages[''].version]).toEqual(['1.1.1', '1.1.1', '1.1.1', '1.1.1']);
  });
  test('„Co nowego”: na górze wpis 1.1.1 (id 2026-11-22, bez numeru buildu), jeden punkt po polsku; pod nim wpis 1.1', () => {
    applyLang('pl');
    expect(WHATS_NEW.map(e => e.id)).toEqual(['2026-11-22', '2026-11-11']); expect(WHATS_NEW[0].build).toBeUndefined(); expect(WHATS_NEW[0].date).toBe('2026-11-22');
    expect(WHATS_NEW[0].items()).toEqual([PL_1_1_1]);
  });
  test('punkt nie obiecuje funkcji: mówi o opisie w sklepie i że aplikacja działa tak samo', () => {
    applyLang('pl'); const x = WHATS_NEW[0].items()[0];
    expect(x).toMatch(/App Store/); expect(x).toMatch(/działa tak samo/); expect(x).not.toMatch(/nowa funkcj|nowe ćwiczeni|rysunk/i);
  });
  test('po angielsku: przetłumaczony, z nazwą aplikacji', () => {
    applyLang('en'); const it = WHATS_NEW[0].items();
    expect(it).toEqual([`We updated the ${BRAND_NAME} information in the App Store to make it easier to find. The app itself works the same, and your workouts, templates and settings stay unchanged.`]);
  });
  test('każdy z 33 języków aplikacji ma własny przekład punktu (nie polski, nie angielski, z nazwą aplikacji)', () => {
    const pl = WHATS_NEW[0].items()[0]; applyLang('en'); const en = WHATS_NEW[0].items()[0];
    for (const l of LANGS) { if (l === 'pl' || l === 'en') continue; applyLang(l); const x = WHATS_NEW[0].items()[0];
      expect([l, x !== pl, x !== en, x.includes(BRAND_NAME), /\{app\}/.test(x)]).toEqual([l, true, true, true, false]); }
  });
  test('kropka: osoba, która trenowała i widziała wpis 1.1 (id 2026-11-11), po aktualizacji do 1.1.1 ma kropkę', async () => {
    await fresh(); addWorkout(new Date(2026, 10, 18, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    store.getState().whatsNewSeen = '2026-11-11'; expect(whatsNewUnseen()).toBe(true);
    store.getState().whatsNewSeen = '2026-11-22'; expect(whatsNewUnseen()).toBe(false);
  });
  test('dziennik wydań (docs/09) ma wiersz 1.1.1', () => {
    expect(R('docs/09-plan-testow.md')).toMatch(/\| Wydanie 1\.1\.1 /);
  });
});
