/* E2 W3 (docs/14 pkt 4; testy 12–17 z pkt 7) — zamienniki per miejsce w szablonie: „Zawsze w: Dom”, podpowiedź przy starcie, przyjęcie / ✕,
 * przerwa zamiennika, migracja (M5–M7), usuwanie ćwiczenia, kopia szablonu, edytor szablonu. P5a (a): także sam przyrząd (TemplateAlt.impl). */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { fresh, ex, pressAlert, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, go, tap, type, act, openCard, swipeDelete } from './app';
import { userHome, loc } from './locations-fixtures';
import { presetEquipment } from '@/lib/equipment';
import { deleteLocation } from '@/lib/locations';
import type { Template } from '@/lib/seed';

jest.setTimeout(60000);
afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
const TREXO = [2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 24];
const st = () => store.getState();
const blk = (i: number) => st().active!.exercises[i];

/** Dom (główne) i siłownia; szablon: Bench Press (sztanga) ×2 pozycje (ciężko + lżej) i RDL. */
async function setup(): Promise<Template> {
  await fresh(undefined, 'pl'); const s = st().settings;
  s.locations = [userHome(TREXO), loc('Siłownia', presetEquipment('gym'), 'gym')]; s.mainLocationId = 'home';
  const tpl = store.newTemplate(); tpl.name = 'Push';
  const it = (n: string, id: string, restSec: number | null = 120) => ({ id, exerciseId: ex(n).id, sets: 3, repMin: 6, repMax: 8, restSec, startWeight: '' as const, targetSec: '' as const, groupId: null });
  tpl.items = [it('Bench Press (sztanga)', 'heavy'), it('Bench Press (sztanga)', 'light', 90), it('RDL (hantle/linki)', 'rdl', null)]; store.save(tpl); return tpl;
}

describe('W3 — logika', () => {
  test('Zawsze w: Dom zapisuje wpis w pozycji bloku (to samo ćwiczenie dwa razy w szablonie — właściwa pozycja); zastępuje wpis tego miejsca', async () => {
    const tpl = await setup(); store.startFromTemplate(tpl);
    expect(store.canRememberAlt(st().active!, blk(1))).toBe(false); /* bez zamiany — nic do zapamiętania */
    store.swapBlock(blk(1).id, ex('Bench Press (hantle)').id);
    expect(store.canRememberAlt(st().active!, blk(1))).toBe(true);
    store.rememberAlt(blk(1).id);
    expect(tpl.items[0].alternates).toBeUndefined();
    expect(tpl.items[1].alternates).toEqual([{ locationId: 'home', exerciseId: ex('Bench Press (hantle)').id, restSec: null }]);
    expect(store.canRememberAlt(st().active!, blk(1))).toBe(false); /* już zapisane */
    tpl.items[1].alternates![0].restSec = 75; store.swapBlock(blk(1).id, ex('Push Up').id); store.rememberAlt(blk(1).id);
    expect(tpl.items[1].alternates).toEqual([{ locationId: 'home', exerciseId: ex('Push Up').id, restSec: null }]); /* zastąpiony, przerwa wyzerowana */
    /* P5a: sam przyrząd — RDL zawsze na stacji */
    store.swapImpl(blk(2).id, 'electric'); expect(store.canRememberAlt(st().active!, blk(2))).toBe(true); store.rememberAlt(blk(2).id);
    expect(tpl.items[2].alternates).toEqual([{ locationId: 'home', exerciseId: ex('RDL (hantle/linki)').id, restSec: null, impl: 'electric' }]);
  });

  test('start w Domu: podpowiedź, blok bez zmian (nigdy automatycznie); start w Siłowni: brak podpowiedzi; „📍” na Dom w trakcie — podpowiedź się pojawia', async () => {
    const tpl = await setup(); tpl.items[0].alternates = [{ locationId: 'home', exerciseId: ex('Bench Press (hantle)').id, restSec: null }];
    tpl.items[2].alternates = [{ locationId: 'home', exerciseId: ex('RDL (hantle/linki)').id, restSec: null, impl: 'electric' }]; store.save(tpl);
    store.startFromTemplate(tpl); const a = st().active!;
    expect(blk(0).exerciseId).toBe(ex('Bench Press (sztanga)').id); expect(blk(2).impl).toBe('dumbbell');
    expect(store.altHint(a, blk(0))).toMatchObject({ exerciseId: ex('Bench Press (hantle)').id }); expect(store.altHint(a, blk(1))).toBeUndefined();
    expect(store.altHint(a, blk(2))).toMatchObject({ impl: 'electric' });
    store.cancelWorkout(); tpl.locationId = 'gym'; store.save(tpl); store.startFromTemplate(tpl);
    expect(store.altHint(st().active!, blk(0))).toBeUndefined();
    store.setActiveLocation('home'); expect(store.altHint(st().active!, blk(0))).toMatchObject({ exerciseId: ex('Bench Press (hantle)').id });
    /* po odhaczeniu serii — bez podpowiedzi */
    blk(0).sets[0].weight = 60; blk(0).sets[0].reps = 5; store.toggleDone(0, 0); expect(store.altHint(st().active!, blk(0))).toBeUndefined();
  });

  test('Zamień z podpowiedzi: przerwa z wpisu, a pusta — przerwa bloku; ✕ chowa podpowiedź do końca treningu', async () => {
    const tpl = await setup(); tpl.items[0].alternates = [{ locationId: 'home', exerciseId: ex('Bench Press (hantle)').id, restSec: 75 }];
    tpl.items[1].alternates = [{ locationId: 'home', exerciseId: ex('Bench Press (hantle)').id, restSec: null }];
    tpl.items[2].alternates = [{ locationId: 'home', exerciseId: ex('RDL (hantle/linki)').id, restSec: 200, impl: 'electric' }]; store.save(tpl);
    store.startFromTemplate(tpl);
    store.acceptAlt(blk(0).id); expect(blk(0)).toMatchObject({ exerciseId: ex('Bench Press (hantle)').id, restSec: 75, swappedFrom: ex('Bench Press (sztanga)').id });
    store.acceptAlt(blk(1).id); expect(blk(1).restSec).toBe(90);
    store.acceptAlt(blk(2).id); expect(blk(2)).toMatchObject({ impl: 'electric', implPinned: true, restSec: 200 }); expect(blk(2).swappedFrom).toBeUndefined();
    store.cancelWorkout(); store.startFromTemplate(tpl);
    store.skipAlt(blk(0).id); expect(blk(0).altSkip).toBe(true); expect(store.altHint(st().active!, blk(0))).toBeUndefined();
    const w = (() => { blk(0).sets[0].weight = 60; blk(0).sets[0].reps = 5; store.toggleDone(0, 0); return store.finishWorkout()!; })();
    expect(w.exercises[0].altSkip).toBeUndefined(); /* tylko trening w toku */
  });

  test('Zapamiętaj przerwę w bloku-zamienniku zapisuje alt.restSec, nie item.restSec', async () => {
    const tpl = await setup(); tpl.items[0].alternates = [{ locationId: 'home', exerciseId: ex('Bench Press (hantle)').id, restSec: null }]; store.save(tpl);
    store.startFromTemplate(tpl); store.acceptAlt(blk(0).id);
    store.rememberRest(st().active!, blk(0), 100);
    expect(tpl.items[0].alternates![0].restSec).toBe(100); expect(tpl.items[0].restSec).toBe(120); expect(blk(0).restSec).toBe(100);
    /* blok bez zamiennika — jak dotąd: pozycja szablonu */
    store.rememberRest(st().active!, blk(1), 80); expect(tpl.items[1].restSec).toBe(80);
  });

  test('usunięte ćwiczenie B → wpis znika; usunięte miejsce → wpis zostaje, edytor pokazuje (usunięte miejsce); dupTemplate kopiuje wpisy', async () => {
    const tpl = await setup(); tpl.items[0].alternates = [{ locationId: 'home', exerciseId: ex('Bench Press (hantle)').id, restSec: null }, { locationId: 'gym', exerciseId: ex('Push Up').id, restSec: 60 }]; store.save(tpl);
    const c = store.dupTemplate(tpl.id); expect(c.items[0].alternates).toEqual(tpl.items[0].alternates); expect(c.items[0].alternates).not.toBe(tpl.items[0].alternates);
    store.deleteExercise(ex('Push Up').id); expect(tpl.items[0].alternates).toEqual([{ locationId: 'home', exerciseId: ex('Bench Press (hantle)').id, restSec: null }]);
    deleteLocation('home'); expect(tpl.items[0].alternates).toHaveLength(1); /* M7 */
    const m = store.migrate(JSON.parse(JSON.stringify(st()))); expect(m.templates.find(x => x.id === tpl.id)!.items[0].alternates).toHaveLength(1);
  });
});

describe('W3 — migracja (M5–M7)', () => {
  test('M5–M7: śmieci w alternates — poprawione albo usunięte', async () => {
    await fresh(); const raw: any = JSON.parse(JSON.stringify(st())); const A = ex('Bench Press (sztanga)').id, B = ex('Bench Press (hantle)').id;
    raw.templates = [{ id: 't', name: 'T', items: [
      { id: 'i1', exerciseId: A, sets: 3, alternates: [{ locationId: 'home', exerciseId: B, restSec: '75', impl: 'x', junk: 1 }, { locationId: 'home', exerciseId: B, restSec: null }, { locationId: 7, exerciseId: B, restSec: -5 }, { locationId: 'gym', exerciseId: A }, { locationId: 'hotel', exerciseId: A, impl: 'dumbbell', restSec: 5000 }, { locationId: 'x', exerciseId: 'gone' }, null, 'zz', { exerciseId: B }] },
      { id: 'i2', exerciseId: A, sets: 3, alternates: 'nope' },
      { id: 'i3', exerciseId: A, sets: 3, alternates: [{ locationId: 'x', exerciseId: 'gone' }] },
      { id: 'i4', exerciseId: A, sets: 3, alternates: { home: B } } /* mapa z docs/10 pkt 3.3 — nie-tablica */,
    ] }];
    const m = store.migrate(raw); const [i1, i2, i3, i4] = m.templates[0].items;
    expect(i1.alternates).toEqual([{ locationId: 'home', exerciseId: B, restSec: 75 }, { locationId: '7', exerciseId: B, restSec: null }, { locationId: 'hotel', exerciseId: A, restSec: 1800, impl: 'dumbbell' }]);
    for (const i of [i2, i3, i4]) expect('alternates' in i).toBe(false);
    expect(store.migrate(JSON.parse(JSON.stringify(m))).templates).toEqual(JSON.parse(JSON.stringify(m.templates))); /* idempotentnie */
  });
});

describe('W3 — ekrany', () => {
  async function savedActive(withAlt: boolean) {
    const tpl = await setup(); if (withAlt) { tpl.items[0].alternates = [{ locationId: 'home', exerciseId: ex('Bench Press (hantle)').id, restSec: null }]; store.save(tpl); }
    store.startFromTemplate(tpl); await store.flush(); return JSON.parse(JSON.stringify(st()));
  }
  test('podpowiedź „Zwykle w: Dom — B. Zamienić?”: Zamień i ✕; po zamianie „Zawsze w: Dom”', async () => {
    await renderApp({ saved: await savedActive(true) }); await flushAll(20);
    expect(screen.getByText('Zwykle w: Dom — Bench Press (hantle). Zamienić?')).toBeTruthy();
    await tap(screen.getByLabelText('Zamień na zamiennik: Bench Press (hantle)')); await flushAll(10);
    expect(blk(0).exerciseId).toBe(ex('Bench Press (hantle)').id); expect(screen.queryByText(/Zwykle w:/)).toBeNull();
    expect(screen.queryByLabelText(/^Zawsze w: Dom/)).toBeNull(); /* wpis już jest */
    await tap(screen.getByLabelText('Zamień ćwiczenie: Bench Press (hantle)')); await flushAll(20); await tap(screen.getByLabelText(/^Propozycja 1: /)); await flushAll(20);
    expect(screen.getByLabelText(/^Zawsze w: Dom/)).toBeTruthy(); await tap(screen.getByLabelText(/^Zawsze w: Dom/)); await flushAll(5);
    expect(st().templates[0].items[0].alternates![0].exerciseId).toBe(blk(0).exerciseId);
    /* ✕ na drugim bloku tej pozycji — w innym treningu */
  });
  test('✕ chowa podpowiedź', async () => {
    await renderApp({ saved: await savedActive(true) }); await flushAll(20);
    await tap(screen.getByLabelText('Nie zamieniaj: Bench Press (hantle)')); await flushAll(5);
    expect(screen.queryByText(/Zwykle w:/)).toBeNull(); expect(blk(0).exerciseId).toBe(ex('Bench Press (sztanga)').id);
  });
  test('edytor szablonu: lista „📍 Dom: B”, pole przerwy, „✕” z potwierdzeniem; usunięte miejsce i brak sprzętu', async () => {
    const tpl = await setup(); tpl.items[0].alternates = [{ locationId: 'home', exerciseId: ex('Bench Press (hantle)').id, restSec: null }, { locationId: 'gone', exerciseId: ex('Push Up').id, restSec: null }];
    tpl.items[1].alternates = [{ locationId: 'home', exerciseId: ex('Leg Press').id, restSec: null }];
    tpl.items[2].alternates = [{ locationId: 'home', exerciseId: ex('RDL (hantle/linki)').id, restSec: null, impl: 'electric' }]; store.save(tpl); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(st())) }); await go(`/template/${tpl.id}`); await flushAll(20);
    /* 06.10.2026: karty zwinięte, otwarta jedna */ await openCard(2); expect(screen.getByText('📍 Dom: RDL (hantle/linki) — stacja')).toBeTruthy();
    await openCard(1); expect(screen.getByText(/brak sprzętu w: Dom/)).toBeTruthy(); /* Leg Press w Domu */
    await openCard(0); expect(screen.getByText('📍 Dom: Bench Press (hantle)')).toBeTruthy(); expect(screen.getByText('📍 (usunięte miejsce): Push Up')).toBeTruthy();
    await type(screen.getByLabelText('Przerwa zamiennika (s): Dom — Bench Press (hantle)'), '75'); expect(st().templates.find(x => x.id === tpl.id)!.items[0].alternates![0].restSec).toBe(75);
    await swipeDelete('Usuń zamiennik: Dom — Bench Press (hantle)'); expect(st().templates.find(x => x.id === tpl.id)!.items[0].alternates).toHaveLength(2);
    await act(async () => pressAlert('Usunąć zamiennik?', 'Usuń')); await flushAll(5);
    expect(st().templates.find(x => x.id === tpl.id)!.items[0].alternates!.map(a => a.locationId)).toEqual(['gone']);
  });
});
void withDemoTemplates;
