/*
 * Backlog audytu kontrolnego 1 (09.10.2026), obszary DAT/LOG/X/LIVE — testy regresji logiki (0.10.1). Każdy test odtwarza dowód audytora
 * (raporty audytu kontrolnego 1, docs/25 „Audyt kontrolny 1”) i sprawdza poprawne zachowanie. Ekrany: tests/backlog-0.10.1-dane-ui.test.tsx.
 */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { fresh } from './helpers';
import { addLocation } from '@/lib/locations';
import { parseBackup } from '@/lib/backup';

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

describe('DAT2-04 (= DAT-08): import z powtórzonym id miejsca albo zapisanego planu nie gubi drugiego wpisu (reguła „~n” jak uniqueIds)', () => {
  test('DAT2-04: dwa miejsca o tym samym id → oba zostają, drugie z id „~2”; dwa plany o id „p” → oba; migrate idempotentne', async () => {
    await fresh(); addLocation('gym', 'Siłownia'); addLocation('home', 'Dom');
    const st = JSON.parse(JSON.stringify(store.getState())); const id0 = st.settings.locations[0].id; st.settings.locations[1].id = id0;
    st.savedPlans = [{ id: 'p', name: 'A', days: [] }, { id: 'p', name: 'B', days: [] }];
    const r = parseBackup(JSON.stringify({ format: 'trening-backup', schemaVersion: 17, state: st }));
    expect(r.settings.locations.map(l => [l.id, l.name])).toEqual([[id0, 'Siłownia'], [`${id0}~2`, 'Dom']]);
    expect(r.settings.mainLocationId).toBe(id0);
    expect((r.savedPlans ?? []).map(p => [p.id, p.name])).toEqual([['p', 'A'], ['p~2', 'B']]);
    const again = store.migrate(JSON.parse(JSON.stringify(r))); expect(again.settings.locations).toEqual(r.settings.locations); expect(again.savedPlans).toEqual(r.savedPlans);
  });
  test('DAT2-04: id „~2” już zajęte → „~3”', async () => {
    await fresh(); addLocation('gym', 'A'); addLocation('home', 'B'); addLocation('hotel', 'C');
    const st = JSON.parse(JSON.stringify(store.getState())); const L = st.settings.locations; const id0 = L[0].id; L[1].id = id0; L[2].id = `${id0}~2`;
    L.push({ ...L[2], id: id0, name: 'D' });
    const r = store.migrate(st); expect(r.settings.locations.map(l => l.id.replace(id0, 'x'))).toEqual(['x', 'x~3', 'x~2', 'x~4']);
  });
});
