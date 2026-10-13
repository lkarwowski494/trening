/* 0.18 „Dostosuj do miejsca” (docs/33), etap 1 — logika bez ekranów: adaptCandidates / restoreCandidates (lib/adapt.ts) i adaptActive
 * (lib/state/swap.ts). Przypadki ze specyfikacji: definicja bloku do dostosowania i przywrócenia, domyślny wybór (W3 → ranking od ćwiczenia z planu
 * → bez zmian), reguła P3 A, częściowo odhaczony blok (podział), superserie i rundy, Siłownia → Hotel → Siłownia, Hotel → Dom, deload,
 * usunięte ćwiczenie, atomowość (jeden zapis, wszystko albo nic), szablony i plan bez zmian, restart. */
import * as store from '@/lib/store';
import { fresh, ex, saved } from './helpers';
import { loc } from './locations-fixtures';
import { presetEquipment, availability, implsAt } from '@/lib/equipment';
import { adaptCandidates, restoreCandidates, ADAPT_KINDS, type AdaptChoice } from '@/lib/adapt';
import { swapCandidates } from '@/lib/swap';
import type { Template, Exercise } from '@/lib/seed';

jest.setTimeout(60000);
const st = () => store.getState();
const act = () => st().active!;
const blk = (i: number) => act().exercises[i];
const J = (x: unknown) => JSON.stringify(x);
const GYM = 'gym', HOTEL = 'hotel', DOM = 'dom';

/** Siłownia (główne), Hotel, „Dom” bez sprzętu (tylko mata i ściana). */
async function world() {
  await fresh(undefined, 'pl'); const s = st().settings;
  s.locations = [loc('Siłownia', presetEquipment('gym'), GYM), loc('Hotel', presetEquipment('hotel'), HOTEL), loc('Dom', presetEquipment('bodyweight'), DOM)];
  s.mainLocationId = GYM; store.save();
}
const item = (name: string, id: string, groupId: string | null = null) => ({ id, exerciseId: ex(name).id, sets: 3, repMin: 6, repMax: 8, restSec: 120, startWeight: '' as const,
  targetSec: '' as const, groupId });
function template(names: [string, string][], groupId: string | null = null): Template {
  const tpl = store.newTemplate(); tpl.name = 'FBW'; tpl.items = names.map(([n, id]) => item(n, id, groupId)); store.save(tpl); return tpl;
}
const FBW: [string, string][] = [['Bench Press (sztanga)', 'bench'], ['Overhead Press (sztanga)', 'ohp'], ['Pull Up', 'pull'], ['RDL (hantle/linki)', 'rdl']];
/** Trening z szablonu FBW na siłowni, potem „📍” na `to`. */
async function started(to: string | null = HOTEL, tpl: Template | null = null) {
  if (!tpl) await world(); const t = tpl ?? template(FBW); store.startFromTemplate(t); if (to) store.setActiveLocation(to); return t;
}
const nameOf = (id: string) => st().exercises.find(e => e.id === id)!.name;
const tick = (bi: number, si: number) => store.toggleDone(bi, si);
const rows = (to: string) => adaptCandidates(act(), to);

describe('adaptCandidates — definicja bloku do dostosowania', () => {
  test('Siłownia → Hotel: tylko ćwiczenia niedostępne w Hotelu, w kolejności treningu; RDL (dostępny) poza listą; wiersz opisuje brak sprzętu', async () => {
    await started();
    const r = rows(HOTEL);
    expect(r.map(x => nameOf(x.curExId))).toEqual(['Bench Press (sztanga)', 'Overhead Press (sztanga)', 'Pull Up']);
    expect(r.map(x => x.blockId)).toEqual([blk(0).id, blk(1).id, blk(2).id]);
    for (const x of r) { expect(x.missing.length).toBeGreaterThan(0); expect(availability(ex(nameOf(x.curExId)), store.locationById(HOTEL)).ok).toBe(false); expect(x.planExId).toBe(x.curExId); }
    expect(rows(GYM)).toEqual([]); /* na siłowni wszystko dostępne */
  });
  test('nieznane miejsce, brak miejsca, puste id — pusta lista (bez wyjątku)', async () => {
    await started();
    expect(adaptCandidates(act(), 'nie-ma')).toEqual([]); expect(adaptCandidates(act(), null)).toEqual([]); expect(adaptCandidates(act(), undefined)).toEqual([]);
    expect(restoreCandidates(act(), 'nie-ma')).toEqual([]); expect(restoreCandidates(act(), null)).toEqual([]);
  });
  test('blok pominięty, w pełni odhaczony albo z usuniętym ćwiczeniem nie trafia na listę; częściowo odhaczony — tak', async () => {
    await started(null); const a = act();
    a.exercises[0].skipped = true; a.exercises[1].sets.forEach(s => { s.done = true; }); a.exercises[2].sets[0].done = true;
    store.setActiveLocation(HOTEL);
    expect(rows(HOTEL).map(x => nameOf(x.curExId))).toEqual(['Pull Up']);
    /* „Usunięte ćwiczenie”: archiwum (jest w treningu w toku) — blok zostaje, ale nie jest proponowany */
    store.deleteExercise(ex('Pull Up').id); expect(ex('Pull Up').archived).toBe(true);
    expect(rows(HOTEL)).toEqual([]);
  });
});

describe('adaptCandidates — domyślny wybór', () => {
  test('(b) ranking: pierwsza propozycja swapCandidates od ćwiczenia z planu; wiersz niesie wpis rankingu do linijki „dlaczego”', async () => {
    await started();
    const r = rows(HOTEL);
    const bench = r[0]; const top = swapCandidates(bench.planExId, { locationId: HOTEL, showAll: false, inWorkout: new Set(act().exercises.map(e => e.exerciseId)) })[0];
    expect(bench.source).toBe('ranking'); expect(bench.choice).toEqual({ kind: 'swap', blockId: blk(0).id, toExId: top.exId }); expect(bench.candidate).toEqual(top);
    expect(nameOf(top.exId)).toBe('Bench Press (hantle)'); expect(bench.shifted).toBe(false); expect(bench.duplicate).toBe(false);
    for (const x of r) { expect(x.choice).not.toBeNull(); expect(availability(ex(nameOf((x.choice as { toExId: string }).toExId)), store.locationById(HOTEL)).ok).toBe(true); }
  });
  test('(a) zamiennik per miejsce z szablonu (W3) wygrywa z rankingiem i niesie przerwę oraz przyrząd', async () => {
    await world(); const tpl = template(FBW); tpl.items[0].alternates = [{ locationId: HOTEL, exerciseId: ex('Incline Bench Press (hantle)').id, restSec: 75, impl: 'dumbbell' }];
    await started(HOTEL, tpl); const r = rows(HOTEL);
    expect(r[0].source).toBe('alternate'); expect(r[0].candidate).toBeUndefined();
    expect(r[0].choice).toEqual({ kind: 'swap', blockId: blk(0).id, toExId: ex('Incline Bench Press (hantle)').id, restSec: 75, impl: 'dumbbell' });
    expect(r[1].source).toBe('ranking');
  });
  test('zamiennik z szablonu pomijany, gdy niedostępny w miejscu, usunięty, równy bieżącemu albo dla innego miejsca — wtedy ranking', async () => {
    await world(); const tpl = template(FBW);
    tpl.items[0].alternates = [{ locationId: HOTEL, exerciseId: ex('Leg Press').id, restSec: null }]; /* niedostępny w Hotelu */
    tpl.items[1].alternates = [{ locationId: GYM, exerciseId: ex('Arnold Press').id, restSec: null }]; /* inne miejsce */
    await started(HOTEL, tpl);
    const r = rows(HOTEL); expect(r[0].source).toBe('ranking'); expect(r[1].source).toBe('ranking');
    tpl.items[2].alternates = [{ locationId: HOTEL, exerciseId: ex('Chest Supported Row').id, restSec: null }]; store.deleteExercise(ex('Chest Supported Row').id);
    store.save(tpl);
    expect(rows(HOTEL)[2].source).toBe('ranking'); /* usunięty (archiwum / skasowany) zamiennik nie jest proponowany */
  });
  test('(c) brak zamiennika (Pull Up w Domu bez sprzętu) — „Bez zmian”: choice null, source none', async () => {
    await started(DOM); const r = rows(DOM);
    const pull = r.find(x => nameOf(x.curExId) === 'Pull Up')!;
    expect(pull.source).toBe('none'); expect(pull.choice).toBeNull(); expect(pull.candidate).toBeUndefined();
  });
  test('P3 A: dwa bloki tego samego ćwiczenia — drugi dostaje następną propozycję z rankingu (dopisek), bez powtórki', async () => {
    await world(); const tpl = template([['Bench Press (sztanga)', 'b1'], ['Bench Press (sztanga)', 'b2'], ['Bench Press (sztanga)', 'b3']]);
    await started(HOTEL, tpl); const r = rows(HOTEL);
    const rank = swapCandidates(ex('Bench Press (sztanga)').id, { locationId: HOTEL, showAll: false, inWorkout: new Set([ex('Bench Press (sztanga)').id]) }).map(c => c.exId);
    const picks = r.map(x => (x.choice as { toExId: string }).toExId);
    expect(picks).toEqual(rank.slice(0, 3)); expect(new Set(picks).size).toBe(3);
    expect(r.map(x => x.shifted)).toEqual([false, true, true]); expect(r.every(x => !x.duplicate)).toBe(true);
  });
  test('P3 A: zamiennik z szablonu zajmuje ćwiczenie przed rankingiem — blok z rankingiem ustępuje następnej propozycji', async () => {
    await world(); const tpl = template([['Bench Press (sztanga)', 'b1'], ['Bench Press (sztanga)', 'b2']]);
    tpl.items[1].alternates = [{ locationId: HOTEL, exerciseId: ex('Bench Press (hantle)').id, restSec: null }];
    await started(HOTEL, tpl); const r = rows(HOTEL);
    expect(r[1].source).toBe('alternate'); expect((r[1].choice as { toExId: string }).toExId).toBe(ex('Bench Press (hantle)').id);
    expect(r[0].source).toBe('ranking'); expect(r[0].shifted).toBe(true); expect(r[0].candidate!.exId).not.toBe(ex('Bench Press (hantle)').id);
  });
  test('P3 A: gdy rankingu zabraknie na „następną” — wiersz powtarza propozycję i jest oznaczony (duplicate), a nie „Bez zmian”', async () => {
    await world(); const s = st().settings;
    /* dwa własne ćwiczenia z barbell i jedyny wspólny „mięsień” z jednym własnym zamiennikiem dostępnym w Hotelu */
    const mk = (n: string, requires?: string[][]): Exercise => { const e = store.newExercise(n); e.group = 'inne'; e.muscles = ['testowy-mięsień' as never]; if (requires) e.requires = requires; store.save(e); return e; };
    const a = mk('Test A', [['barbell']]); mk('Test Zamiennik');
    s.locations = [loc('Siłownia', presetEquipment('gym'), GYM), loc('Hotel', presetEquipment('hotel'), HOTEL)];
    const tpl = store.newTemplate(); tpl.items = [{ ...item('Bench Press (sztanga)', 'x1'), exerciseId: a.id }, { ...item('Bench Press (sztanga)', 'x2'), exerciseId: a.id }]; store.save(tpl);
    store.startFromTemplate(tpl); store.setActiveLocation(HOTEL);
    const r = rows(HOTEL); expect(r.map(x => x.source)).toEqual(['ranking', 'ranking']);
    expect(r.map(x => nameOf((x.choice as { toExId: string }).toExId))).toEqual(['Test Zamiennik', 'Test Zamiennik']);
    expect(r.map(x => x.shifted)).toEqual([false, false]); expect(r.map(x => x.duplicate)).toEqual([false, true]);
  });
  test('adaptCandidates nic nie zmienia (czysta funkcja nad stanem)', async () => {
    await started(); const before = J(st()); rows(HOTEL); restoreCandidates(act(), HOTEL); expect(J(st())).toBe(before);
  });
});

describe('adaptActive — zastosowanie wyborów', () => {
  const defaults = (to: string): AdaptChoice[] => rows(to).flatMap(x => x.choice ? [x.choice] : []);

  test('wszystkie domyślne wybory naraz: bloki zamienione w miejscu, swappedFrom = ćwiczenie z planu, serie nowe i nieodhaczone, JEDEN zapis', async () => {
    await started(); const ids = act().exercises.map(e => e.id); const oldSets = act().exercises.flatMap(e => e.sets.map(s => s.id));
    const ch = defaults(HOTEL); expect(ch).toHaveLength(3); const rev = store.getRev();
    const r = store.adaptActive(ch)!;
    expect(r).toMatchObject({ swapped: 3, restored: 0, skipped: 0, skippedSetIds: [] }); expect(store.getRev()).toBe(rev + 1);
    expect(act().exercises.map(e => e.id)).toEqual(ids); /* zamiana w miejscu — id bloków bez zmian */
    expect(act().exercises.map(e => nameOf(e.exerciseId))).toEqual(ch.map(c => nameOf((c as { toExId: string }).toExId)).slice(0, 3).concat(['RDL (hantle/linki)']));
    expect(blk(0).swappedFrom).toBe(ex('Bench Press (sztanga)').id); expect(blk(3).swappedFrom).toBeUndefined();
    expect(r.goneSetIds.sort()).toEqual(act().exercises.slice(0, 3).length ? oldSets.slice(0, 9).sort() : []);
    for (const e of act().exercises.slice(0, 3)) { expect(e.sets).toHaveLength(3); expect(e.sets.every(s => !s.done)).toBe(true); }
    expect(rows(HOTEL)).toEqual([]); /* po zastosowaniu nie ma już czego dostosować */
  });
  test('blok bez wyboru zostaje bez zmian; pusta lista wyborów — null i brak zapisu', async () => {
    await started(); const before = J(act()); const rev = store.getRev();
    expect(store.adaptActive([])).toBeNull(); expect(store.getRev()).toBe(rev); expect(J(act())).toBe(before);
    const ch = defaults(HOTEL); store.adaptActive([ch[1]]);
    expect(blk(0).exerciseId).toBe(ex('Bench Press (sztanga)').id); expect(blk(1).swappedFrom).toBe(ex('Overhead Press (sztanga)').id); expect(blk(2).exerciseId).toBe(ex('Pull Up').id);
  });
  test('częściowo odhaczony blok — podział: odhaczone zostają przy A, reszta (nowy blok) przy B; goneSetIds = nieodhaczone serie', async () => {
    await started(GYM); tick(0, 0); const done = blk(0).sets[0].id; const undone = blk(0).sets.slice(1).map(s => s.id); store.setActiveLocation(HOTEL);
    const row = rows(HOTEL).find(x => x.blockId === blk(0).id)!; expect(row).toBeTruthy();
    const r = store.adaptActive([row.choice!])!;
    expect(act().exercises).toHaveLength(5); expect(blk(0).sets.map(s => s.id)).toEqual([done]); expect(blk(0).exerciseId).toBe(ex('Bench Press (sztanga)').id);
    expect(blk(1).splitFrom).toBe(blk(0).id); expect(blk(1).swappedFrom).toBe(ex('Bench Press (sztanga)').id); expect(blk(1).sets).toHaveLength(2);
    expect(r.goneSetIds.sort()).toEqual(undone.sort()); expect(rows(HOTEL).map(x => nameOf(x.curExId))).toEqual(['Overhead Press (sztanga)', 'Pull Up']); /* część odhaczona A nie wraca na listę */
  });
  test('„Pomiń dziś” (skip) w pakiecie: skip oddaje nieodhaczone serie do zatrzymania stopera, blok zostaje w treningu jako pominięty', async () => {
    await world(); const t = template([['RDL (hantle/linki)', 'rdl'], ['Pull Up', 'pull']]); store.startFromTemplate(t); store.setActiveLocation(HOTEL);
    const pullSets = blk(1).sets.map(s => s.id);
    const r = store.adaptActive([{ kind: 'skip', blockId: blk(1).id }, { kind: 'impl', blockId: blk(0).id, impl: 'trap_bar' }]);
    expect(r).toBeNull(); expect(blk(1).skipped).toBeUndefined(); /* trap bar nie ma w Hotelu — cały pakiet odrzucony */
    const ok = store.adaptActive([{ kind: 'skip', blockId: blk(1).id }])!;
    expect(ok).toMatchObject({ skipped: 1, swapped: 0, goneSetIds: [] }); expect(ok.skippedSetIds.sort()).toEqual(pullSets.sort()); expect(blk(1).skipped).toBe(true);
    expect(rows(HOTEL)).toEqual([]); /* pominięty blok nie wraca na listę */
  });
  test('impl: ten sam ruch, inny przyrząd w miejscu (RDL na siłowni) — przyrząd przypięty, jeden zapis; przyrząd spoza miejsca — odrzucony', async () => {
    await world(); store.startFromTemplate(template([['RDL (hantle/linki)', 'rdl']]));
    const others = implsAt(ex('RDL (hantle/linki)'), store.locationById(GYM)).filter(i => i !== blk(0).impl); expect(others.length).toBeGreaterThan(0);
    const rev = store.getRev(); const r = store.adaptActive([{ kind: 'impl', blockId: blk(0).id, impl: others[0] }])!;
    expect(r.swapped).toBe(1); expect(blk(0).impl).toBe(others[0]); expect(blk(0).implPinned).toBe(true); expect(store.getRev()).toBe(rev + 1);
    expect(store.adaptActive([{ kind: 'impl', blockId: blk(0).id, impl: 'trap_bar' }])).toBeNull(); expect(blk(0).impl).toBe(others[0]);
  });
  test('superserie i rundy: groupId zachowany po zamianie obu członków, a przerwa nie wypada w środku rundy (docs/14 pkt 3.5)', async () => {
    await world(); const tpl = template([['Bench Press (sztanga)', 's1'], ['Overhead Press (sztanga)', 's2']], 'ss'); await started(GYM, tpl);
    expect(blk(0).groupId).toBeTruthy(); const g = blk(0).groupId;
    tick(0, 0); tick(1, 0); store.setActiveLocation(HOTEL);
    const r = store.adaptActive(defaults(HOTEL))!; expect(r.swapped).toBe(2);
    expect(act().exercises.map(e => nameOf(e.exerciseId)).length).toBe(4); /* [Bench✓, ZamB, OHP✓, ZamO] */
    expect(act().exercises.map(e => e.groupId)).toEqual([g, g, g, g]); expect(blk(1).splitFrom).toBe(blk(0).id); expect(blk(3).splitFrom).toBe(blk(2).id);
    const zb = act().exercises.indexOf(act().exercises.find(e => e.splitFrom === blk(0).id)!); const zo = act().exercises.indexOf(act().exercises.find(e => e.splitFrom === blk(2).id)!);
    const rest = (bi: number, si: number) => { tick(bi, si); return store.restAfter(bi, si); };
    expect(rest(zb, 0)).toBeNull(); /* runda 2: pierwszy członek — bez przerwy */
    expect(typeof rest(zo, 0)).toBe('number'); /* drugi zamyka rundę */
  });
  test('deload: blok skrócony (deloadFull) zamieniony w miejscu zachowuje pełną liczbę; po podziale suma łańcucha = pełna liczba', async () => {
    await world(); store.startFromTemplate(template([['Bench Press (sztanga)', 'b']]), { deload: true }); const full = blk(0).deloadFull; expect(full).toBeGreaterThan(blk(0).sets.length);
    store.setActiveLocation(HOTEL); store.adaptActive(defaults(HOTEL)); expect(blk(0).deloadFull).toBe(full);
    await world(); store.startFromTemplate(template([['Bench Press (sztanga)', 'b']]), { deload: true }); const n = blk(0).sets.length; tick(0, 0);
    store.setActiveLocation(HOTEL); store.adaptActive(defaults(HOTEL));
    const chain = act().exercises.filter(e => e.id === blk(0).id || e.splitFrom === blk(0).id);
    expect(chain).toHaveLength(2); expect(chain[0].sets.length + chain[1].sets.length).toBe(n);
    expect(chain[0].deloadFull).toBeUndefined(); expect(chain[1].deloadFull).toBe(full! - chain[0].sets.length); /* LIVE2-03: suma łańcucha = pełna liczba */
  });
  test('wyjątki: ten sam blok dwa razy, nieistniejący blok, brak aktywnego treningu, zamiennik niedostępny/usunięty/równy bieżącemu — null i NIC się nie zmienia', async () => {
    await started(); const ch = defaults(HOTEL); const before = J(act()); const rev = store.getRev();
    const bad: AdaptChoice[][] = [
      [ch[0], ch[0]], [ch[0], { kind: 'skip', blockId: 'nie-ma' }], [ch[0], { kind: 'restore', blockId: blk(1).id }], /* nie jest zamiennikiem */
      [ch[0], { kind: 'swap', blockId: blk(1).id, toExId: 'nie-ma' }], [ch[0], { kind: 'swap', blockId: blk(1).id, toExId: blk(1).exerciseId }],
      [ch[0], { kind: 'impl', blockId: blk(1).id, impl: 'trap_bar' }],
    ];
    for (const c of bad) { expect(store.adaptActive(c)).toBeNull(); expect(J(act())).toBe(before); expect(store.getRev()).toBe(rev); }
    const archived = ex('Arnold Press'); archived.archived = true;
    expect(store.adaptActive([ch[0], { kind: 'swap', blockId: blk(1).id, toExId: archived.id }])).toBeNull(); expect(J(act())).toBe(before);
    await fresh(undefined, 'pl'); expect(store.adaptActive([{ kind: 'skip', blockId: 'x' }])).toBeNull(); /* brak treningu */
  });
});

describe('adaptActive — przywracanie (Siłownia → Hotel → Siłownia, P5 A)', () => {
  test('po powrocie do miejsca blok-zamiennik wraca z planu; „Wraca z planu” zawiera tylko takie bloki, a lista dostosowań jest pusta', async () => {
    await started(); const orig = act().exercises.map(e => e.exerciseId);
    store.adaptActive(rows(HOTEL).flatMap(x => x.choice ? [x.choice] : []));
    expect(restoreCandidates(act(), HOTEL)).toEqual([]); /* w Hotelu plan wciąż niedostępny */
    store.setActiveLocation(GYM);
    const back = restoreCandidates(act(), GYM); expect(back.map(x => x.blockId)).toEqual([blk(0).id, blk(1).id, blk(2).id]);
    expect(back.map(x => [nameOf(x.planExId), x.edited])).toEqual([['Bench Press (sztanga)', false], ['Overhead Press (sztanga)', false], ['Pull Up', false]]);
    expect(back.every(x => x.choice.kind === 'restore' && x.curExId !== x.planExId)).toBe(true); expect(rows(GYM)).toEqual([]);
    const rev = store.getRev(); const r = store.adaptActive(back.map(x => x.choice))!;
    expect(r).toMatchObject({ restored: 3, swapped: 0 }); expect(store.getRev()).toBe(rev + 1);
    expect(act().exercises.map(e => e.exerciseId)).toEqual(orig); expect(act().exercises.every(e => !e.swappedFrom && e.sets.every(s => !s.done))).toBe(true);
    expect(restoreCandidates(act(), GYM)).toEqual([]);
  });
  test('definicja „do przywrócenia”: odhaczona seria, pominięty blok, usunięte lub niedostępne ćwiczenie z planu — blok NIE wraca', async () => {
    await started(); store.adaptActive(rows(HOTEL).flatMap(x => x.choice ? [x.choice] : [])); store.setActiveLocation(GYM);
    tick(0, 0); /* odhaczona seria zamiennika — canUndoSwap false */
    blk(1).skipped = true; ex('Pull Up').archived = true;
    expect(restoreCandidates(act(), GYM)).toEqual([]);
    ex('Pull Up').archived = false; delete blk(1).skipped; tick(0, 0); store.setActiveLocation(DOM);
    expect(restoreCandidates(act(), DOM)).toEqual([]); /* Dom: sztanga niedostępna */
  });
  test('Hotel → Dom: ranking liczony od ćwiczenia z PLANU (nie od zamiennika z Hotelu); blok zamieniony wcześniej zachowuje swappedFrom = plan', async () => {
    await started(); store.adaptActive(rows(HOTEL).flatMap(x => x.choice ? [x.choice] : [])); store.setActiveLocation(DOM);
    const r = rows(DOM); const ohp = r.find(x => x.planExId === ex('Overhead Press (sztanga)').id)!;
    expect(ohp.curExId).not.toBe(ohp.planExId); expect(ohp.planExId).toBe(blk(1).swappedFrom);
    const fromPlan = swapCandidates(ohp.planExId, { locationId: DOM, showAll: false, inWorkout: new Set(act().exercises.map(e => e.exerciseId)) });
    expect(ohp.candidate).toEqual(fromPlan[0]); expect(nameOf(ohp.candidate!.exId)).toBe('Handstand Push Up');
    store.adaptActive([ohp.choice!]); expect(blk(1).swappedFrom).toBe(ex('Overhead Press (sztanga)').id); expect(nameOf(blk(1).exerciseId)).toBe('Handstand Push Up');
  });
  test('cofnięcie z wpisanymi wartościami: wiersz oznaczony edited (potwierdzenie na ekranie)', async () => {
    await started(); store.adaptActive(rows(HOTEL).flatMap(x => x.choice ? [x.choice] : [])); store.setActiveLocation(GYM);
    blk(0).sets[0].edited = true; expect(restoreCandidates(act(), GYM)[0].edited).toBe(true);
  });
  test('Hotel → Siłownia dla bloku podzielonego: odhaczone serie A zostają, serie B wracają na koniec A', async () => {
    await started(GYM); tick(0, 0); store.setActiveLocation(HOTEL); store.adaptActive([rows(HOTEL)[0].choice!]); store.setActiveLocation(GYM);
    const back = restoreCandidates(act(), GYM); expect(back).toHaveLength(1); expect(back[0].blockId).toBe(blk(1).id);
    store.adaptActive([back[0].choice]); expect(act().exercises).toHaveLength(4); expect(blk(0).sets).toHaveLength(3); expect(blk(0).sets[0].done).toBe(true);
  });
});

describe('adaptActive — atomowość, szablony i plan, restart', () => {
  test('niezmiennik: szablony, plan, historia i ćwiczenia bit w bit bez zmian po adaptActive (zamiany tylko w tym treningu)', async () => {
    await world(); const tpl = template(FBW); tpl.items[0].alternates = [{ locationId: HOTEL, exerciseId: ex('Floor Press (hantle)').id, restSec: 60 }]; store.save(tpl);
    st().weekPlan = { days: [tpl.id, null, tpl.id, null, tpl.id, null, null] }; st().planOverrides = { '2026-10-20': null }; store.save();
    await started(HOTEL, tpl); const snap = () => J({ ...st(), active: null, timer: null, metaUpdatedAt: 0, saveSeq: 0 });
    const before = snap(); store.adaptActive(rows(HOTEL).flatMap(x => x.choice ? [x.choice] : [])); expect(snap()).toBe(before);
    store.setActiveLocation(GYM); store.adaptActive(restoreCandidates(act(), GYM).map(x => x.choice)); expect(snap()).toBe(before);
  });
  test('restart w trakcie = nic nie zastosowano: nieudany pakiet nie zapisuje niczego; udany zapisuje całość i wraca po ponownym uruchomieniu', async () => {
    await started(); await store.flush();
    const ch = rows(HOTEL).flatMap(x => x.choice ? [x.choice] : []);
    const dump = () => J(saved().active?.exercises); const base = dump();
    expect(store.adaptActive([ch[0], ch[1], { kind: 'skip', blockId: 'nie-ma' }])).toBeNull();
    await store.flush(); expect(dump()).toBe(base); expect(act().exercises.map(e => nameOf(e.exerciseId))).toEqual(['Bench Press (sztanga)', 'Overhead Press (sztanga)', 'Pull Up', 'RDL (hantle/linki)']);
    store.adaptActive(ch); await store.flush();
    const after = saved(); await fresh(after); /* ponowne uruchomienie */
    expect(act().exercises.slice(0, 3).every(e => !!e.swappedFrom)).toBe(true); expect(act().locationId).toBe(HOTEL); expect(rows(HOTEL)).toEqual([]);
  });
  test('usunięte ćwiczenie (archiwum): blok nie jest proponowany ani przywracany, ale ręczny wybór zamiany działa; po zamianie ćwiczenie bez odwołań znika (jak swapBlock)', async () => {
    await started(GYM); const benchId = ex('Bench Press (sztanga)').id; store.deleteExercise(benchId); expect(ex('Bench Press (sztanga)').archived).toBe(true);
    store.setActiveLocation(HOTEL); expect(rows(HOTEL).map(x => nameOf(x.curExId))).toEqual(['Overhead Press (sztanga)', 'Pull Up']);
    const r = store.adaptActive([{ kind: 'swap', blockId: blk(0).id, toExId: ex('Bench Press (hantle)').id }])!; expect(r.swapped).toBe(1);
    expect(st().exercises.some(e => e.id === benchId)).toBe(false); expect(restoreCandidates(act(), GYM)).toEqual([]); /* plan usunięty — nie ma do czego wracać */
  });
});

describe('ADAPT_KINDS — każdy rodzaj wyboru', () => {
  test.each([...ADAPT_KINDS])('rodzaj %s: poprawny wybór daje skutek w danych, ten sam wybór na nieistniejącym bloku jest odrzucony bez zmian', async (kind) => {
    await started(GYM); let c: AdaptChoice; let check: () => void;
    if (kind === 'swap') { store.setActiveLocation(HOTEL); c = rows(HOTEL)[0].choice!; check = () => { expect(blk(0).swappedFrom).toBe(ex('Bench Press (sztanga)').id); expect(blk(0).sets.every(s => !s.done)).toBe(true); }; }
    else if (kind === 'impl') { const o = implsAt(ex('RDL (hantle/linki)'), store.locationById(GYM)).find(i => i !== blk(3).impl)!; c = { kind, blockId: blk(3).id, impl: o }; check = () => { expect(blk(3).impl).toBe(o); expect(blk(3).implPinned).toBe(true); }; }
    else if (kind === 'skip') { c = { kind, blockId: blk(2).id }; check = () => expect(blk(2).skipped).toBe(true); }
    else { store.setActiveLocation(HOTEL); store.adaptActive([rows(HOTEL)[0].choice!]); store.setActiveLocation(GYM); c = restoreCandidates(act(), GYM)[0].choice; check = () => { expect(blk(0).exerciseId).toBe(ex('Bench Press (sztanga)').id); expect(blk(0).swappedFrom).toBeUndefined(); }; }
    const before = J(act()); expect(store.adaptActive([{ ...c, blockId: 'nie-ma' }])).toBeNull(); expect(J(act())).toBe(before);
    expect(store.adaptActive([c])).not.toBeNull(); check();
  });
});
