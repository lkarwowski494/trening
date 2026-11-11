/**
 * Wersja 1.1.0 (W-08, docs/49-wydanie-1-1.md; decyzja 11.11.2026 w docs/18, tryb analogia do weta): numer 1.1.0 w app.json, package.json i package-lock.json;
 * „Co nowego” — jeden wpis 1.1 (id 2026-11-11) zastępuje wpis 1.0.1 (2026-11-06), bo 1.0.1 był tylko buildem TestFlight właściciela — użytkownik App Store
 * aktualizuje się z 1.0.0 i widzi jeden wpis z całością zmian. Punkt o nazwach ćwiczeń tylko poza językiem angielskim (po angielsku nazwy się nie zmieniły).
 * Zachowanie przycisku ✦ i kropki: tests/whats-new.test.tsx.
 */
import { WHATS_NEW, whatsNewUnseen } from '@/lib/whatsnew';
import { BRAND_NAME } from '@/lib/brand';
import { applyLang } from '@/lib/i18n';
import * as store from '@/lib/store';
import { fresh, addWorkout } from './helpers';

const fs = require('fs') as typeof import('fs'); const path = require('path') as typeof import('path');
const R = (f: string) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
const J = (f: string) => JSON.parse(R(f));
afterEach(() => { applyLang('pl'); });

const PL_1_1 = [
  'Rysunki ruchu ma teraz większość ćwiczeń z biblioteki: maszyny i linki, kettlebell, skoki, brzuch, mobilność i wiele innych.',
  'Nowe i dopracowane wskazówki techniki, m.in. dla barków, ćwiczeń mocy i mobilności.',
  'Nazwy ćwiczeń z biblioteki są po angielsku, jak na większości siłowni. Na karcie ćwiczenia pod nazwą widać nazwę w Twoim języku, a wyszukiwarka znajduje ćwiczenie po obu.',
  'Zapowiedzi głosowe używają najlepszego głosu zainstalowanego w telefonie.',
  'Nowa osoba zaczyna na ekranie Trening od przycisku „Zacznij pierwszy trening” i tablicy „Pierwszy trening”.',
  `Aplikacja nazywa się teraz ${BRAND_NAME}. Treningi, szablony i ustawienia zostają bez zmian.`,
];

describe('wersja 1.1.0 (W-08, 11.11.2026)', () => {
  test('app.json, package.json i package-lock.json (projekt) — 1.1.0', () => {
    const lock = J('package-lock.json');
    expect([J('app.json').expo.version, J('package.json').version, lock.version, lock.packages[''].version]).toEqual(['1.1.0', '1.1.0', '1.1.0', '1.1.0']);
  });
  test('„Co nowego”: jeden wpis 1.1 (id 2026-11-11, bez numeru buildu do przebiegu testflight.yml), 6 punktów po polsku', () => {
    applyLang('pl');
    expect(WHATS_NEW.map(e => e.id)).toEqual(['2026-11-11']); expect(WHATS_NEW[0].build).toBeUndefined(); expect(WHATS_NEW[0].date).toBe('2026-11-11');
    expect(WHATS_NEW[0].items()).toEqual(PL_1_1);
  });
  test('po angielsku 5 punktów: bez punktu o nazwach ćwiczeń (nazwy angielskie były już w 1.0), każdy przetłumaczony', () => {
    applyLang('en'); const it = WHATS_NEW[0].items();
    expect(it).toHaveLength(5); expect(it.join(' ')).not.toMatch(/Nazwy|names are in English/);
    const { EN } = require('@/lib/i18n.en'); PL_1_1.forEach((x, i) => { if (i !== 2) expect(EN[x] ?? EN[x.replace(BRAND_NAME, '{app}')]).toBeTruthy(); });
    expect(EN[PL_1_1[2]]).toBeTruthy(); /* klucz w słowniku EN jest (komplet źródła), choć punkt po angielsku się nie pokazuje */
  });
  test('kropka po aktualizacji z 1.0.0 i z 1.0.1: osoba, która trenowała i widziała wpis 1.0.1, znów ma kropkę', async () => {
    await fresh(); addWorkout(new Date(2026, 10, 10, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    store.getState().whatsNewSeen = '2026-11-06'; expect(whatsNewUnseen()).toBe(true);
  });
  test('dziennik wydań (docs/09) ma wiersz 1.1.0', () => {
    expect(R('docs/09-plan-testow.md')).toMatch(/\| Wydanie 1\.1\.0 /);
  });
});
