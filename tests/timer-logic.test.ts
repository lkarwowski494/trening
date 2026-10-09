/*
 * lib/timer.ts — logika przerwy, stopera serii, powiadomień i Live Activity bez ekranu (audyt 0.10, fala 2, obszar TESTY — M2 / TST-02).
 * Stryker (09.10.2026) przed tym plikiem: 18,5% wykrytych mutantów timera — moduł był sprawdzany tylko przez testy ekranów (poza zestawem
 * mutacyjnym), a granice (alarm przy 0 s, okno odtworzenia 1 h, sekundy powiadomienia ≥ 1, cel stopera, korekta poniżej zera) nie miały testu.
 * Tu każda granica i każda gałąź: zwykły przypadek, granica, poza granicą.
 */
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { blankTimer } from '@/lib/seed';
import { fresh, ex } from './helpers';

const NOW = new Date(2026, 9, 9, 10, 0, 0).getTime();
const S = () => store.getState();
const la = () => global.__la as unknown[][];
type N = { identifier: string; content: { title: string; body: string; sound: boolean }; trigger: { type: string; seconds: number; repeats: boolean } };
const notes = () => global.__notifications as N[];
const cancelled = () => global.__cancelled as string[];
const reset = () => { global.__la.length = 0; global.__notifications.length = 0; global.__cancelled.length = 0; };
let haptic: jest.SpyInstance;

beforeEach(async () => {
  jest.useFakeTimers({ now: NOW }); await fresh(); store.setTimerState(blankTimer());
  await timer.stop(); await timer.stopSet(); await timer.restore(); /* restore() bez treningu: właściciel Live Activity nieznany (laKind = null) */
  timer.labels.title = ''; timer.labels.subtitle = ''; timer.labels.last = false; reset();
  haptic = jest.spyOn(Haptics, 'notificationAsync').mockImplementation(async () => {});
});
afterEach(() => { haptic.mockRestore(); jest.useRealTimers(); });
const startWorkout = () => { store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addExerciseToActive(ex('Plank')); const a = S().active!; a.templateName = 'Push'; store.save(a); return a; };

describe('przerwa: start, powiadomienie, Live Activity', () => {
  test('start: koniec = teraz + sekundy, stan zapisany, powiadomienie po tylu sekundach (z dźwiękiem), Live Activity z tytułem treningu i podpisem', async () => {
    startWorkout(); timer.labels.subtitle = 'dalej: Plank';
    await timer.start(90, 's1');
    expect([timer.T.on, timer.T.endAt, timer.T.total, timer.T.setId, timer.T.alarmed, timer.T.sub, timer.T.last]).toEqual([true, NOW + 90e3, 90, 's1', false, 'dalej: Plank', false]);
    expect([S().timer.restEndAt, S().timer.restTotal, S().timer.restSetId]).toEqual([NOW + 90e3, 90, 's1']);
    expect(cancelled()).toContain('rest-end');
    expect(notes()).toEqual([{ identifier: 'rest-end', content: { title: 'Przerwa minęła', body: 'Następna seria.', sound: true }, trigger: { type: 'timeInterval', seconds: 90, repeats: false } }]);
    expect(la()).toEqual([['start', 'Push', 'dalej: Plank', NOW + 90e3, 90, 'rest|Przerwa']]);
  });
  test('start bez podpisu i bez treningu: tytuł „Trening”, podpis „przerwa N s”; tytuł z labels.title wygrywa', async () => {
    await timer.start(75.4); expect(la()[0]).toEqual(['start', 'Trening', 'przerwa 75 s', NOW + 75.4e3, 75.4, 'rest|Przerwa']);
    reset(); timer.labels.title = 'Mój'; await timer.start(60); expect(la()[0][1]).toBe('Mój');
  });
  test('start od chwili `from` (seria skończyła się wcześniej): koniec = from + sekundy; `from` w przyszłości albo niepoprawny — od teraz', async () => {
    await timer.start(60, null, NOW - 20e3); expect(timer.T.endAt).toBe(NOW + 40e3); expect(notes()[0].trigger.seconds).toBe(40);
    await timer.start(60, null, NOW + 50e3); expect(timer.T.endAt).toBe(NOW + 60e3);
    await timer.start(60, null, NaN); expect(timer.T.endAt).toBe(NOW + 60e3);
  });
  test('ostatnia seria treningu: treść „Nic więcej do zrobienia…”; dźwięk wyłączony w Ustawieniach — bez dźwięku', async () => {
    timer.labels.last = true; S().settings.sound = false; await timer.start(30);
    expect(notes()[0].content).toEqual({ title: 'Przerwa minęła', body: 'Nic więcej do zrobienia — możesz zakończyć trening.', sound: false });
    expect(timer.T.last).toBe(true);
  });
  test('powiadomienie: najmniej 1 s (przerwa 0 s i koniec w przeszłości), zaokrąglenie do pełnych sekund', async () => {
    await timer.start(0); expect(notes()[0].trigger.seconds).toBe(1);
    reset(); await timer.start(10, null, NOW - 60e3); expect(notes()[0].trigger.seconds).toBe(1);
    reset(); await timer.start(2.6); expect(notes()[0].trigger.seconds).toBe(3);
  });
});

describe('przerwa: korekta ±, stop', () => {
  test('adjust bez przerwy — nic; ±15 przesuwa koniec i całość; skrócenie nie schodzi poniżej „teraz” ani całości poniżej 0', async () => {
    await timer.adjust(15); expect(timer.T.on).toBe(false); expect(notes()).toEqual([]);
    await timer.start(60); reset();
    await timer.adjust(15); expect([timer.T.endAt, timer.T.total, S().timer.restEndAt, S().timer.restTotal]).toEqual([NOW + 75e3, 75, NOW + 75e3, 75]);
    expect(notes()[0].trigger.seconds).toBe(75); expect(la()).toEqual([['update', 'przerwa 75 s', NOW + 75e3, 75]]);
    await timer.adjust(-200); expect([timer.T.endAt, timer.T.total]).toEqual([NOW, 0]);
  });
  test('po końcu przerwy: „−15” nic nie zmienia; „+15” liczy od teraz, uzbraja alarm i przywraca Live Activity', async () => {
    await timer.start(30); jest.setSystemTime(NOW + 40e3); timer.tick(); expect(timer.T.alarmed).toBe(true); reset();
    await timer.adjust(-15); expect([timer.T.endAt, timer.T.total]).toEqual([NOW + 30e3, 30]); expect(notes()).toEqual([]);
    await timer.adjust(15); expect([timer.T.endAt, timer.T.total, timer.T.alarmed]).toEqual([NOW + 55e3, 45, false]);
    expect(la()).toEqual([['start', 'Trening', 'przerwa 45 s', NOW + 55e3, 45, 'rest|Przerwa']]); expect(notes()[0].trigger.seconds).toBe(15);
  });
  test('koniec przerwy dokładnie teraz (0 s) to już „po końcu”: „−15” nic nie zmienia', async () => {
    await timer.start(30); jest.setSystemTime(NOW + 30e3); reset();
    await timer.adjust(-15); expect(timer.T.endAt).toBe(NOW + 30e3); expect(notes()).toEqual([]);
  });
  test('stop: przerwa wyłączona, stan wyczyszczony, powiadomienie odwołane, Live Activity zakończona (tylko gdy przerwa trwała)', async () => {
    await timer.start(60, 's1'); reset(); await timer.stop();
    expect([timer.T.on, timer.T.setId, S().timer.restEndAt, S().timer.restTotal, S().timer.restSetId]).toEqual([false, null, null, 0, null]);
    expect(cancelled()).toEqual(['rest-end']); expect(la()).toEqual([['end']]);
    reset(); await timer.stop(); expect(la()).toEqual([]);
  });
  test('stopIfFrom: zatrzymuje tylko przerwę uruchomioną przez tę serię', async () => {
    await timer.start(60, 's1'); await timer.stopIfFrom('s2'); expect(timer.T.on).toBe(true);
    await timer.stopIfFrom('s1'); expect(timer.T.on).toBe(false);
  });
});

describe('tick i powrót z tła', () => {
  test('tick: alarm dokładnie przy 0 s (nie sekundę później), raz — wibracja przy dźwięku, koniec Live Activity', async () => {
    await timer.start(30); const sub = jest.fn(); const off = timer.subscribe(sub);
    jest.setSystemTime(NOW + 29.4e3); timer.tick(); expect(timer.T.alarmed).toBe(false); /* zostało 0,6 s → zaokrąglone 1 */
    jest.setSystemTime(NOW + 29.6e3); timer.tick(); expect(timer.T.alarmed).toBe(true); expect(haptic).toHaveBeenCalledTimes(1); expect(la().slice(-1)).toEqual([['end']]); expect(sub).toHaveBeenCalled();
    timer.tick(); expect(haptic).toHaveBeenCalledTimes(1); off();
  });
  test('tick: dźwięk wyłączony — alarm bez wibracji; bez przerwy — nic', async () => {
    S().settings.sound = false; await timer.start(5); jest.setSystemTime(NOW + 6e3); timer.tick(); expect(timer.T.alarmed).toBe(true); expect(haptic).not.toHaveBeenCalled();
    await timer.stop(); timer.tick(); expect(timer.T.on).toBe(false);
  });
  test('tick: stoper z celem — alarm przy celu (nie wcześniej), koniec Live Activity stopera, wibracja', async () => {
    const a = startWorkout(); const sid = a.exercises[1].sets[0].id; await timer.startSet(sid, 30); reset();
    jest.setSystemTime(NOW + 29.9e3); timer.tick(); expect(timer.S.alarmed).toBe(false);
    jest.setSystemTime(NOW + 30e3); timer.tick(); expect(timer.S.alarmed).toBe(true); expect(la()).toEqual([['end']]); expect(haptic).toHaveBeenCalledTimes(1);
    timer.tick(); expect(haptic).toHaveBeenCalledTimes(1);
  });
  test('onForeground: przerwa minęła w tle — alarm i koniec Live Activity; trwa — bez zmian; stoper z celem po czasie — alarm', async () => {
    await timer.start(30); jest.setSystemTime(NOW + 10e3); timer.onForeground(); expect(timer.T.alarmed).toBe(false);
    jest.setSystemTime(NOW + 30e3); timer.onForeground(); expect(timer.T.alarmed).toBe(true); expect(la().slice(-1)).toEqual([['end']]);
    await timer.stop(); jest.setSystemTime(NOW); const a = startWorkout(); await timer.startSet(a.exercises[1].sets[0].id, 20); reset();
    jest.setSystemTime(NOW + 19e3); timer.onForeground(); expect(timer.S.alarmed).toBe(false);
    jest.setSystemTime(NOW + 20e3); timer.onForeground(); expect(timer.S.alarmed).toBe(true); expect(la()).toEqual([['end']]);
  });
});

describe('stoper serii czasowych', () => {
  test('startSet: zatrzymuje przerwę, cel zaokrąglony 0…86400, stan, powiadomienie „Seria skończona”, Live Activity tylko z celem', async () => {
    const a = startWorkout(); const sid = a.exercises[1].sets[0].id; await timer.start(60); reset();
    await timer.startSet(sid, 30.4);
    expect(timer.T.on).toBe(false); expect([timer.S.on, timer.S.startAt, timer.S.targetSec, timer.S.setId, timer.S.alarmed]).toEqual([true, NOW, 30, sid, false]);
    expect([S().timer.setStartAt, S().timer.setTarget, S().timer.setId]).toEqual([NOW, 30, sid]);
    expect(notes()).toEqual([{ identifier: 'set-end', content: { title: 'Seria skończona', body: 'Minęło 30 s.', sound: true }, trigger: { type: 'timeInterval', seconds: 30, repeats: false } }]);
    expect(la().filter(x => x[0] === 'start')).toEqual([['start', 'Push', 'seria 30 s', NOW + 30e3, 30, 'set|Seria']]);
    reset(); await timer.startSet(sid, 0); expect(timer.S.targetSec).toBe(0); expect(notes()).toEqual([]); expect(la().filter(x => x[0] === 'start')).toEqual([]);
    await timer.startSet(sid, -5); expect(timer.S.targetSec).toBe(0); await timer.startSet(sid, 1e9); expect(timer.S.targetSec).toBe(86400);
    await timer.startSet(sid, NaN as unknown as number); expect(timer.S.targetSec).toBe(0);
    timer.labels.subtitle = 'Plank · seria 1'; reset(); await timer.startSet(sid, 45); expect(la().filter(x => x[0] === 'start')[0][2]).toBe('Plank · seria 1');
  });
  test('stopSet: czas serii (z celem — najwyżej cel, koniec = start + cel), bez celu — rzeczywisty; stan wyczyszczony, powiadomienie odwołane', async () => {
    const a = startWorkout(); const sid = a.exercises[1].sets[0].id;
    await timer.startSet(sid, 30); jest.setSystemTime(NOW + 25.4e3); expect(timer.setElapsed()).toBeCloseTo(25.4); expect(timer.setReached()).toBe(false); reset();
    expect(await timer.stopSet()).toEqual({ setId: sid, sec: 25, endAt: NOW + 25.4e3 });
    expect([timer.S.on, timer.S.setId, S().timer.setStartAt, S().timer.setTarget, S().timer.setId]).toEqual([false, null, null, 0, null]); expect(cancelled()).toEqual(['set-end']); expect(la()).toEqual([['end']]);
    jest.setSystemTime(NOW); await timer.startSet(sid, 30); jest.setSystemTime(NOW + 30e3); expect(timer.setReached()).toBe(true);
    jest.setSystemTime(NOW + 3600e3); expect(await timer.stopSet()).toEqual({ setId: sid, sec: 30, endAt: NOW + 30e3 }); /* zablokowany telefon: najwyżej cel */
    jest.setSystemTime(NOW); await timer.startSet(sid, 30); jest.setSystemTime(NOW + 30e3); expect((await timer.stopSet()).endAt).toBe(NOW + 30e3); /* równo cel — koniec teraz */
    jest.setSystemTime(NOW); await timer.startSet(sid, 0); jest.setSystemTime(NOW + 100e3); expect(timer.setReached()).toBe(false); expect(await timer.stopSet()).toEqual({ setId: sid, sec: 100, endAt: NOW + 100e3 });
    jest.setSystemTime(NOW); await timer.startSet(sid, 0); jest.setSystemTime(NOW + 2 * 86400e3); expect((await timer.stopSet()).sec).toBe(86400); /* doba */
    reset(); expect(await timer.stopSet()).toEqual({ setId: null, sec: 0, endAt: NOW + 2 * 86400e3 }); expect(la()).toEqual([]); expect(timer.setElapsed()).toBe(0);
  });
  test('przekazanie Live Activity: koniec stopera przy trwającej przerwie — przerwa przejmuje', async () => {
    const a = startWorkout(); const sid = a.exercises[1].sets[0].id;
    await timer.startSet(sid, 60); jest.setSystemTime(NOW + 10e3);
    timer.T.on = true; timer.T.endAt = NOW + 100e3; timer.T.total = 90; timer.T.alarmed = false; timer.T.sub = ''; /* przerwa trwa w tle (np. odtworzona) */
    reset(); await timer.stopSet(); expect(la()).toEqual([['end'], ['start', 'Push', 'przerwa 90 s', NOW + 100e3, 90, 'rest|Przerwa']]);
  });
  test('przekazanie: koniec przerwy, gdy stoper z celem jeszcze odlicza — Live Activity stopera', async () => {
    const a = startWorkout(); const sid = a.exercises[1].sets[0].id;
    await timer.start(30); timer.S.on = true; timer.S.startAt = NOW; timer.S.targetSec = 120; timer.S.alarmed = false; timer.S.setId = sid; reset();
    await timer.stop(); expect(la()).toEqual([['end'], ['start', 'Push', 'seria 120 s', NOW + 120e3, 120, 'set|Seria']]);
    timer.S.on = false;
  });
});

describe('odtworzenie po restarcie (restore)', () => {
  test('bez treningu: Live Activity zakończona, znaczniki stopera i przerwy wyczyszczone', async () => {
    store.setTimerState({ restEndAt: NOW + 10e3, restTotal: 60, setStartAt: NOW, setTarget: 30 }); reset();
    await timer.restore(); expect(la()).toEqual([['end']]); expect([S().timer.restEndAt, S().timer.setStartAt, S().timer.setTarget]).toEqual([null, null, 0]);
  });
  test('przerwa w toku: odliczanie wraca, podpis z serii, która ją uruchomiła, powiadomienie i Live Activity; minęła — alarm bez powiadomienia', async () => {
    const a = startWorkout(); const s0 = a.exercises[0].sets[0]; s0.weight = 100; s0.reps = 5; store.toggleDone(0, 0);
    store.setTimerState({ restEndAt: NOW + 50e3, restTotal: 90, restSetId: s0.id }); reset(); await timer.restore();
    expect([timer.T.on, timer.T.endAt, timer.T.total, timer.T.setId, timer.T.alarmed]).toEqual([true, NOW + 50e3, 90, s0.id, false]);
    expect(timer.T.sub).toBe('dalej: Plank'); /* jedna seria ławki — następna jest deska (lib/live.ts restLabel) */ expect(timer.labels.subtitle).toBe(timer.T.sub);
    expect(notes()[0].trigger.seconds).toBe(50); expect(la().filter(x => x[0] === 'start')).toEqual([['start', 'Push', timer.T.sub, NOW + 50e3, 90, 'rest|Przerwa']]);
    store.setTimerState({ restEndAt: NOW - 10e3, restTotal: 90, restSetId: s0.id }); reset(); await timer.restore();
    expect([timer.T.on, timer.T.alarmed]).toEqual([true, true]); expect(notes()).toEqual([]); expect(la()).toEqual([['end']]);
  });
  test('okno odtworzenia: koniec sprzed ponad 1 h — nie wraca; dokładnie 1 h — nie wraca; 1 h bez sekundy — wraca; koniec dalej niż cała przerwa + 60 s — uszkodzony, nie wraca', async () => {
    startWorkout(); const back = async (p: Partial<ReturnType<typeof blankTimer>>) => { await timer.stop(); store.setTimerState({ restEndAt: null, restTotal: 0, restSetId: null, ...p }); await timer.restore(); return timer.T.on; };
    expect(await back({ restEndAt: NOW - 3600e3, restTotal: 60 })).toBe(false);
    expect(await back({ restEndAt: NOW - 3600e3 + 1000, restTotal: 60 })).toBe(true);
    expect(await back({ restEndAt: NOW + 60e3 + 60e3, restTotal: 60 })).toBe(true); /* granica: cała przerwa + 60 s */
    expect(await back({ restEndAt: NOW + 60e3 + 60e3 + 1, restTotal: 60 })).toBe(false);
    expect(await back({ restEndAt: NOW + 60e3 + 1, restTotal: 'x' as unknown as number })).toBe(false); /* zła całość = 0 */
  });
  test('stoper z celem wraca, dopóki seria istnieje; po celu — alarm; start w przyszłości (> 60 s) albo bez celu — nie wraca', async () => {
    const a = startWorkout(); const sid = a.exercises[1].sets[0].id;
    const back = async (p: Partial<ReturnType<typeof blankTimer>>) => { timer.S.on = false; store.setTimerState({ setStartAt: null, setTarget: 0, setId: null, ...p }); reset(); await timer.restore(); return timer.S.on; };
    expect(await back({ setStartAt: NOW - 10e3, setTarget: 30, setId: sid })).toBe(true);
    expect([timer.S.startAt, timer.S.targetSec, timer.S.setId, timer.S.alarmed]).toEqual([NOW - 10e3, 30, sid, false]);
    expect(notes()[0]).toMatchObject({ identifier: 'set-end', trigger: { seconds: 20 } }); expect(la().filter(x => x[0] === 'start')).toEqual([['start', 'Push', 'seria 30 s', NOW + 20e3, 30, 'set|Seria']]);
    expect(await back({ setStartAt: NOW - 30e3, setTarget: 30, setId: sid })).toBe(true); expect(timer.S.alarmed).toBe(true); expect(notes()).toEqual([]);
    expect(await back({ setStartAt: NOW + 60e3, setTarget: 30, setId: sid })).toBe(true); /* granica: 60 s w przód (zegar telefonu) */
    expect(await back({ setStartAt: NOW + 60e3 + 1, setTarget: 30, setId: sid })).toBe(false);
    expect(await back({ setStartAt: NOW, setTarget: 0, setId: sid })).toBe(false);
    expect(await back({ setStartAt: NOW, setTarget: 30, setId: 'nie-ma' })).toBe(false);
  });
  test('resetAll: przerwa i stoper zatrzymane', async () => {
    const a = startWorkout(); await timer.start(60); timer.S.on = true; timer.S.setId = a.exercises[1].sets[0].id;
    await timer.resetAll(); expect([timer.T.on, timer.S.on]).toEqual([false, false]);
  });
});

describe('powiadomienia: ponowne planowanie, porzucony trening, zgoda', () => {
  test('refreshScheduled: trwająca przerwa i stoper dostają nowe powiadomienia (np. bez dźwięku); po alarmie — bez drugiego „Przerwa minęła”', async () => {
    const a = startWorkout(); await timer.start(60); await timer.startSet(a.exercises[1].sets[0].id, 30); await timer.start(60);
    timer.S.on = true; timer.S.alarmed = false; timer.S.startAt = NOW; timer.S.targetSec = 30; S().settings.sound = false; reset();
    await timer.refreshScheduled(); expect(notes().map(n => [n.identifier, n.content.sound])).toEqual([['rest-end', false], ['set-end', false]]); expect(cancelled()).toContain('weigh-reminder');
    timer.T.alarmed = true; timer.S.alarmed = true; reset(); await timer.refreshScheduled(); expect(notes()).toEqual([]);
    timer.T.alarmed = false; jest.setSystemTime(NOW + 61e3); reset(); await timer.refreshScheduled(); expect(notes()).toEqual([]); /* koniec w przeszłości */
    timer.S.on = false;
  });
  test('scheduleWeighReminder: tylko odwołuje dawne przypomnienie o wadze (poranny wpis usunięty)', async () => {
    await timer.scheduleWeighReminder(); expect(cancelled()).toEqual(['weigh-reminder']); expect(notes()).toEqual([]);
  });
  test('staleBody: treść zależna od tego, co zrobiono (seria robocza / rozgrzewka / nic), pytanie albo zachęta; pauza dopisana', () => {
    const at = NOW; const tm = store.fmtTime(at);
    expect(timer.staleBody('work', at)).toBe(`Ostatnia seria o ${tm}. Otwórz, by zakończyć albo kontynuować.`);
    expect(timer.staleBody('work', at, true)).toBe(`Ostatnia seria o ${tm}. Zakończyć trening z tą godziną końca?`);
    expect(timer.staleBody('warmup', at)).toBe(`Ostatnia rozgrzewka o ${tm}, bez serii roboczych. Otwórz, by kontynuować albo odrzucić.`);
    expect(timer.staleBody('warmup', at, true)).toBe(`Ostatnia rozgrzewka o ${tm}, bez serii roboczych. Kontynuować czy odrzucić?`);
    expect(timer.staleBody('none', at)).toBe(`Trening rozpoczęty o ${tm}, bez odhaczonych serii. Otwórz, by kontynuować albo odrzucić.`);
    expect(timer.staleBody('none', at, true)).toBe(`Trening rozpoczęty o ${tm}, bez odhaczonych serii. Kontynuować czy odrzucić?`);
    expect(timer.staleBody('work', at, false, at)).toBe(`Ostatnia seria o ${tm}. Otwórz, by zakończyć albo kontynuować.\nTrening w pauzie od ${tm}.`);
    expect(timer.staleBody('work', at, false, null)).toBe(timer.staleBody('work', at)); expect(timer.staleBody('work', at, false, NaN)).toBe(timer.staleBody('work', at));
  });
  test('scheduleStaleReminder: po STALE_ASK_MS od ostatniej aktywności; termin < 1 s albo > doba — bez powiadomienia; zawsze odwołuje poprzednie', async () => {
    await timer.scheduleStaleReminder(NOW, NOW - 60e3, 'warmup', NOW - 30e3);
    expect(notes()).toEqual([{ identifier: 'stale-reminder', content: { title: 'Trening wciąż trwa', body: timer.staleBody('warmup', NOW - 60e3, false, NOW - 30e3), sound: true }, trigger: { type: 'timeInterval', seconds: store.STALE_ASK_MS / 1000, repeats: false } }]);
    expect(cancelled()).toEqual(['stale-reminder']);
    reset(); await timer.scheduleStaleReminder(NOW - store.STALE_ASK_MS + 1000); expect(notes().map(n => n.trigger.seconds)).toEqual([1]);
    reset(); await timer.scheduleStaleReminder(NOW - store.STALE_ASK_MS + 400); expect(notes()).toEqual([]); expect(cancelled()).toEqual(['stale-reminder']);
    reset(); await timer.scheduleStaleReminder(NOW + 86400e3 - store.STALE_ASK_MS); expect(notes().map(n => n.trigger.seconds)).toEqual([86400]);
    reset(); await timer.scheduleStaleReminder(NOW + 86400e3 - store.STALE_ASK_MS + 1000); expect(notes()).toEqual([]);
    reset(); await timer.scheduleStaleReminder(NaN); expect(notes()).toEqual([]);
    reset(); await timer.cancelStaleReminder(); expect(cancelled()).toEqual(['stale-reminder']);
  });
  test('ensurePermission: jest zgoda — bez pytania; brak — wynik prośby', async () => {
    const G = global as unknown as Record<string, unknown>;
    G.__notifPermAsked = 0; G.__notifPerm = { granted: true }; expect(await timer.ensurePermission()).toBe(true); expect(G.__notifPermAsked).toBe(0);
    G.__notifPerm = { granted: false }; G.__notifPermReq = { granted: false }; expect(await timer.ensurePermission()).toBe(false); expect(G.__notifPermAsked).toBe(1);
    G.__notifPermReq = { granted: true }; expect(await timer.ensurePermission()).toBe(true);
    delete G.__notifPerm; delete G.__notifPermReq;
  });
  test('obsługa powiadomień przy otwartej aplikacji: baner, lista, bez plakietki; dźwięk wg Ustawień', async () => {
    const h = (Notifications.setNotificationHandler as jest.Mock).mock.calls.map(c => c[0]).find(x => x?.handleNotification);
    expect(await h.handleNotification()).toEqual({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: false, shouldShowBanner: true, shouldShowList: true });
    S().settings.sound = false; expect((await h.handleNotification()).shouldPlaySound).toBe(false);
  });
});
