/*
 * Backlog audytu kontrolnego 1 (09.10.2026), obszary DAT/LOG/X/LIVE — testy regresji logiki (0.10.1). Każdy test odtwarza dowód audytora
 * (raporty audytu kontrolnego 1, docs/25 „Audyt kontrolny 1”) i sprawdza poprawne zachowanie. Ekrany: tests/backlog-0.10.1-dane-ui.test.tsx.
 */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { fresh } from './helpers';

describe('LIVE2-04: staleBody na zegarze strefy startu', () => {
  test('LIVE2-04: z tz godziny przeliczone wallTs; bez tz (dane sprzed J3) — strefa bieżąca jak dotąd', async () => {
    await fresh(); const at = new Date(2026, 9, 9, 10, 0).getTime(); const tz = -new Date(at).getTimezoneOffset() + 120;
    const w = store.fmtTime(store.wallTs({ startedAt: at, tzOffsetMin: tz }));
    expect(w).not.toBe(store.fmtTime(at));
    expect(timer.staleBody('work', at, true, at, tz)).toBe(`Ostatnia seria o ${w}. Zakończyć trening z tą godziną końca?\nTrening w pauzie od ${w}.`);
    expect(timer.staleBody('none', at, false, null, tz)).toBe(`Trening rozpoczęty o ${w}, bez odhaczonych serii. Otwórz, by kontynuować albo odrzucić.`);
    expect(timer.staleBody('work', at, false, null, undefined)).toBe(timer.staleBody('work', at));
  });
});
