/*
 * M1-audytor-generalny-041 (regresja od M1-031 / decyzji 10a, reaudyt 28.10.2026; 09-lokalizacja-601): w el etykieta masy to pełne słowo „κιλά” (liczba mnoga),
 * więc VoiceOver przycisku ± czytał „Αύξηση βάρους κατά 1 κιλά”, a nagłówek kolumny ciężaru („κιλά/πλευρά”) nie mieścił się w kolumnie (56–64 pt).
 * Test: (1) gdy etykieta jednostki jest pełnym słowem (dziś el), krok ± w etykiecie VoiceOver ma odmienioną nazwę (jak głos, spokenUnit) — „1 κιλό”;
 * w językach ze skrótem (pl, en, ru) bez zmian („1 kg”, „2,5 kg”); (2) wzorzec A11-19: nagłówek kolumny ciężaru w treningu (jedna linia, stała szerokość)
 * zmniejsza krój zamiast ucinać tekst (adjustsFontSizeToFit, minimumFontScale 0,7) — pomiar w raporcie: „κιλά/πλευρά” ok. 70 px wobec 56 pt (≥ 0,8).
 */
import * as fs from 'fs';
import * as path from 'path';
import * as store from '@/lib/store';
import { stepOf } from '@/lib/board';
import { applyLang, type Lang } from '@/lib/i18n';
import { applyUnit } from '@/lib/units';
import { fresh, ex } from './helpers';

const S = () => store.getState();
const up = () => { const a = S().active!; return stepOf(a, a.exercises[0], 'weight', 1, 10).amount; };

describe('M1-041: krok ± w etykiecie VoiceOver z odmienioną nazwą jednostki, gdy etykieta to słowo', () => {
  afterEach(() => { applyLang('pl'); applyUnit('kg'); });
  test('el: hantle, krok 1 → „1 κιλό” (nie „1 κιλά”)', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (hantle)'));
    applyLang('el' as Lang); applyUnit('kg');
    expect(up()).toBe('1 κιλό');
  });
  test.each([['pl', '1 kg'], ['en', '1 kg'], ['ru', '1 кг']] as [Lang, string][])('%s: skrót bez zmian (%s)', async (l, want) => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (hantle)'));
    applyLang(l); applyUnit('kg');
    expect(up()).toBe(want);
  });
});

describe('M1-041: nagłówek kolumny ciężaru zmniejsza krój zamiast ucinać (A11-19)', () => {
  test('components/WorkoutBlocks.tsx: nagłówek loadLabelShort ma numberOfLines={1} i adjustsFontSizeToFit', () => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'components/WorkoutBlocks.tsx'), 'utf8');
    const line = src.split('\n').find((l) => l.includes('{loadLabelShort(ex, impl)}')) ?? '';
    expect(line).toMatch(/numberOfLines=\{1\}/);
    expect(line).toMatch(/adjustsFontSizeToFit/);
  });
});
