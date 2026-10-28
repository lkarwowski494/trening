/* 28.10.2026 [M1-audytor-generalny-031; 09-lokalizacja-006]: rejestr formy (docs/16-jezyki-i-marka.md): ukraiński w ekranach, komunikatach i ostrzeżeniach
 * zwraca się formą grzecznościową „ви” (wyjątek: wskazówki techniki w lib/cues — „ton trenera”, forma „ty”, decyzja 21.10.2026; ten test dotyczy tylko
 * słownika interfejsu lib/locales/uk.json). Heurystyka: zaimki „ти” i ich odmiana, czasowniki w 2. os. l. poj. (-еш/-єш/-иш/-їш, „додаси”)
 * oraz rozkaźniki l. poj. najczęstszych poleceń interfejsu („введи”, „вибери”, „обери”…). Heurystyka nie dowodzi poprawności — chroni przed regresją. */
import { LOCALES } from '@/lib/locales';

const uk = (LOCALES as Record<string, Record<string, string>>).uk;
const CYR = '[\\u0400-\\u04FF’]';
const TY = new RegExp(
  `(?<!${CYR})(ти|тебе|тобі|тобою|твій|твоя|твоє|твої|твого|твоєї|твоїх|твоєму|твоїм|твоїй|твою|${CYR}{2,}(?:еш|єш|иш|їш)|додаси|даси|введи|вибери|обери|натисни|торкнись|торкнися|зроби|перевір|спробуй|додай|встанови|скористайся|уведи|вкажи|задай)(?!${CYR})`, 'iu');

test('ukraiński słownik interfejsu: bez formy „ти” (forma grzecznościowa „ви”)', () => {
  const zle = Object.entries(uk).filter(([, v]) => TY.test(v)).map(([k, v]) => `${k.slice(0, 50)} → ${v.slice(0, 90)}`);
  expect(zle).toEqual([]);
});

test('heurystyka rozpoznaje formę „ти” (próby dodatnie) i nie łapie formy „ви” (próby ujemne)', () => {
  for (const s of ['Введи кількість', 'Вибери шаблон', 'вправи додаси', 'за твоїм планом', 'ти можеш', 'Ти знаєш', 'що робиш']) expect([s, TY.test(s)]).toEqual([s, true]);
  for (const s of ['Введіть кількість', 'Виберіть шаблон', 'вправи додасте', 'за вашим планом', 'Тренуйтеся вдома', 'тиждень', 'ціль', 'розминка']) expect([s, TY.test(s)]).toEqual([s, false]);
});
