/* M1-audytor-generalny-052: dane z bazy, kopii i szkiców wchodzą do migracji jako `unknown`, nie `any`.
   Część typowa jest sprawdzana przez `npm run typecheck` (plik wchodzi do tsc); część wykonawcza — w jest. */
import { migrate, applyCfg } from '../lib/store';

type IsAny<T> = 0 extends 1 & T ? true : false;
const migrateRawNotAny: IsAny<Parameters<typeof migrate>[0]> extends true ? never : true = true;
const applyCfgRawNotAny: IsAny<Parameters<typeof applyCfg>[0]> extends true ? never : true = true;
const applyCfgCNotAny: IsAny<Parameters<typeof applyCfg>[1]> extends true ? never : true = true;

describe('migrate / applyCfg przyjmują unknown (M1-052)', () => {
  test('typy wejścia nie są any', () => {
    expect([migrateRawNotAny, applyCfgRawNotAny, applyCfgCNotAny]).toEqual([true, true, true]);
  });
  test.each([null, undefined, 5, 'x', [], {}, { exercises: [] }, { exercises: 1, templates: [] }])('migrate odrzuca %j', raw => {
    expect(() => migrate(raw as unknown)).toThrow('bad state');
  });
  test.each([null, undefined, 5, 'x', [], {}, { data: 1, seq: 1 }, { data: {}, seq: 'x' }])('applyCfg(…, %j) nie nakłada nic i nie rzuca', c => {
    const raw = { saveSeq: 0, settings: { a: 1 } };
    expect(applyCfg(raw as unknown, c as unknown)).toBe(false);
    expect(raw).toEqual({ saveSeq: 0, settings: { a: 1 } });
  });
  test.each([null, 5, 'x', []])('applyCfg(%j, …) nie rzuca', raw => {
    expect(applyCfg(raw as unknown, { data: {}, seq: 5 })).toBe(false);
  });
});
