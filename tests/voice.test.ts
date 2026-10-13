/*
 * Głos w słuchawkach (lib/voice.ts, modules/voice-cue; docs/36): kiedy i co mówi — polityka (dźwięk, aplikacja na wierzchu, słuchawki, głośnik, VoiceOver), tekst (restCue + rekord),
 * integracja z odhaczeniem serii (telefon i zdarzenia z zegarka), cofnięcie przerywa, ustawienie `voiceSpeaker` w danych, most do modułu natywnego (atrapa).
 */
import { AccessibilityInfo, AppState } from 'react-native';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { voicePolicy, cueSpeech, sayRestStart, silenceVoice, voiceAvailable, sampleVoice, appActive, __setScreenReaderForTests, VOICE_REASONS, type VoiceInput } from '@/lib/voice';
import { completeSet } from '@/lib/setFlow';
import { applyWatchEvent } from '@/lib/watch/apply';
import { restCue } from '@/lib/live';
import { applyLang } from '@/lib/i18n';
import { applyUnit } from '@/lib/units';
import { fresh, saved, addWorkout } from './helpers';
import { world, A, sid, NOW, teardownWorld } from './watch-world';

const V = () => global.__voice;
beforeEach(() => { V().spoken.length = 0; V().stops = 0; V().headphones = false; V().hasVoice = true; __setScreenReaderForTests(false); });
afterEach(() => { teardownWorld(); jest.restoreAllMocks(); });
const tick = async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); };

describe('voicePolicy (czysta)', () => {
  const bools = [true, false];
  const all: VoiceInput[] = []; for (const sound of bools) for (const speaker of bools) for (const headphones of bools) for (const appActive of bools) for (const screenReader of bools) all.push({ sound, speaker, headphones, appActive, screenReader });
  test.each(all.map(i => [JSON.stringify(i), i] as const))('%s', (_n, i) => {
    const d = voicePolicy(i); expect(VOICE_REASONS).toContain(d.reason);
    if (!i.sound) expect(d).toEqual({ mode: 'silent', reason: 'sound-off' });
    else if (!i.appActive) expect(d).toEqual({ mode: 'silent', reason: 'background' });
    else if (!i.headphones && !i.speaker) expect(d).toEqual({ mode: 'silent', reason: 'no-headphones' });
    else if (i.screenReader) expect(d).toEqual({ mode: 'announce', reason: 'screen-reader' });
    else expect(d).toEqual({ mode: 'speak', reason: i.headphones ? 'headphones' : 'speaker' });
  });
  test('domyślnie (głośnik wyłączony, brak słuchawek) cisza; słuchawki → mowa bez przełącznika; głośnik tylko po przełączniku', () => {
    const b = { sound: true, speaker: false, headphones: false, appActive: true, screenReader: false };
    expect(voicePolicy(b).mode).toBe('silent'); expect(voicePolicy({ ...b, headphones: true }).mode).toBe('speak'); expect(voicePolicy({ ...b, speaker: true })).toEqual({ mode: 'speak', reason: 'speaker' });
  });
});

describe('cueSpeech', () => {
  test('tekst = restCue.speech (pełna nazwa jednostki, nie skrót); nieznana seria → pusty', async () => {
    await world(); expect(cueSpeech(A(), sid(0, 0))).toBe('Bench Press (sztanga) · seria 2, 80 kilogramów, 8 powtórzeń'); expect(cueSpeech(A(), sid(0, 0))).toBe(restCue(A(), sid(0, 0)).speech); expect(restCue(A(), sid(0, 0)).text).toContain('80 kg,'); expect(cueSpeech(A(), 'nie ma')).toBe('');
  });
  test('rekord w odhaczonej serii: „Nowy rekord!” przed zapowiedzią; seria „do uzupełnienia” bez rekordu; po ostatniej serii „nic więcej do zrobienia”', async () => {
    await world(); addWorkout(NOW - 7 * 86400e3, [['Bench Press (sztanga)', [{ weight: 60, reps: 8 }]]]);
    A().exercises[0].sets[0].done = true; expect(cueSpeech(A(), sid(0, 0))).toBe('Nowy rekord! Bench Press (sztanga) · seria 2, 80 kilogramów, 8 powtórzeń');
    A().exercises[0].sets[0].toFill = true; expect(cueSpeech(A(), sid(0, 0))).toBe('Bench Press (sztanga) · seria 2, 80 kilogramów, 8 powtórzeń');
    A().exercises.forEach(e => e.sets.forEach(s => { s.done = true; delete s.toFill; })); expect(cueSpeech(A(), sid(2, 1))).toBe('nic więcej do zrobienia');
  });
  test('angielski i funty: ta sama funkcja, tekst w języku aplikacji', async () => {
    await world(); applyLang('en'); applyUnit('lb'); expect(cueSpeech(A(), sid(0, 0))).toBe('Bench Press (Barbell) · set 2, 176.4 pounds, 8 reps');
  });
});

describe('sayRestStart: trasa dźwięku', () => {
  test('słuchawki: mówi zapowiedź w języku aplikacji (tag regionalny), zwraca decyzję', async () => {
    await world(); V().headphones = true; const r = await sayRestStart(A(), sid(0, 0));
    expect(V().spoken).toEqual([['Bench Press (sztanga) · seria 2, 80 kilogramów, 8 powtórzeń', 'pl-PL']]); expect(r).toMatchObject({ mode: 'speak', reason: 'headphones' });
  });
  test('bez słuchawek i bez przełącznika: cisza; z przełącznikiem „Głos także przez głośnik”: mówi', async () => {
    await world(); await sayRestStart(A(), sid(0, 0)); expect(V().spoken).toEqual([]);
    store.getState().settings.voiceSpeaker = true; const r = await sayRestStart(A(), sid(0, 0)); expect(V().spoken).toHaveLength(1); expect(r.reason).toBe('speaker');
  });
  test('„Dźwięk i wibracja” wyłączone: cisza także w słuchawkach', async () => {
    await world(); V().headphones = true; store.getState().settings.sound = false; const r = await sayRestStart(A(), sid(0, 0)); expect(V().spoken).toEqual([]); expect(r.reason).toBe('sound-off');
  });
  test('aplikacja w tle (etap 1: bez trybu audio w tle): cisza', async () => {
    await world(); V().headphones = true; const old = AppState.currentState; Object.defineProperty(AppState, 'currentState', { value: 'background', configurable: true, writable: true }); expect(appActive()).toBe(false);
    const r = await sayRestStart(A(), sid(0, 0)); expect(V().spoken).toEqual([]); expect(r.reason).toBe('background'); Object.defineProperty(AppState, 'currentState', { value: old, configurable: true, writable: true }); expect(appActive()).toBe(true);
  });
  test('VoiceOver: zapowiedź przez announce (nie własna synteza), tylko gdy trasa dźwięku na to pozwala', async () => {
    await world(); const an = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => {}); __setScreenReaderForTests(true);
    await sayRestStart(A(), sid(0, 0)); expect(an).not.toHaveBeenCalled(); V().headphones = true; const r = await sayRestStart(A(), sid(0, 0));
    expect(an).toHaveBeenCalledWith('Bench Press (sztanga) · seria 2, 80 kilogramów, 8 powtórzeń'); expect(V().spoken).toEqual([]); expect(r.mode).toBe('announce');
  });
  test('pusty tekst (nieznana seria) → nic nie mówi', async () => { await world(); V().headphones = true; const r = await sayRestStart(A(), 'nie ma'); expect([r.mode, V().spoken]).toEqual(['silent', []]); });
  test('język bez głosu w telefonie: hasVoice=false → voiceAvailable false (Ustawienia pokazują wskazówkę)', () => { V().hasVoice = false; expect(voiceAvailable()).toBe(false); V().hasVoice = true; expect(voiceAvailable()).toBe(true); });
  test('„Posłuchaj przykładu”: przykładowa zapowiedź w języku i jednostce aplikacji', async () => {
    await world(); expect(await sampleVoice()).toBe(true); expect(V().spoken.at(-1)).toEqual(['dalej: Bench Press, 80 kilogramów, 8 powtórzeń', 'pl-PL']);
    applyLang('en'); applyUnit('lb'); await sampleVoice(); expect(V().spoken.at(-1)).toEqual(['next: Bench Press, 176.4 pounds, 8 reps', 'en-GB'.replace('en-GB', V().spoken.at(-1)![1])]);
  });
});

describe('integracja z odhaczeniem serii', () => {
  test('✓ na telefonie: dokładnie jedna zapowiedź, ten sam szkielet co podpis przerwy, jednostka pełnym słowem; po ostatniej serii „nic więcej do zrobienia”', async () => {
    await world(); V().headphones = true; await completeSet(0, 0); await tick();
    expect(V().spoken).toEqual([[timer.T.sub.replace('80 kg', '80 kilogramów'), 'pl-PL']]); expect(timer.T.sub).toContain('80 kg,'); /* ekran: skrót */
    A().exercises.forEach(e => e.sets.forEach(s => { s.done = true; })); A().exercises[2].sets[1].done = false; V().spoken.length = 0; await completeSet(2, 1); await tick();
    expect(V().spoken.map(x => x[0])).toEqual(['nic więcej do zrobienia']);
  });
  test('superset w środku rundy (bez przerwy): cisza; po zamknięciu rundy mówi', async () => {
    await world({ ss: true }); V().headphones = true; await completeSet(0, 0); await tick(); expect(V().spoken).toEqual([]); await completeSet(1, 0); await tick(); expect(V().spoken).toHaveLength(1);
  });
  test('cofnięcie odhaczenia przerywa mowę (stop); szybkie kolejne odhaczenia: każde zaczyna nową zapowiedź (moduł przerywa poprzednią)', async () => {
    await world(); V().headphones = true; await completeSet(0, 0); await tick(); const s0 = V().stops; await completeSet(0, 0); await tick(); expect(V().stops).toBe(s0 + 1);
    await completeSet(0, 0); await completeSet(0, 1); await tick(); expect(V().spoken.at(-1)![0]).toBe(restCue(A(), sid(0, 1)).speech);
  });
  test('odhaczenie z opóźnieniem po końcu przerwy (przerwa już minęła): cisza', async () => {
    await world(); V().headphones = true; jest.setSystemTime(NOW + 300e3); await completeSet(0, 0, NOW + 1000); await tick(); expect(V().spoken).toEqual([]);
  });
  test('zdarzenie z zegarka (done): zapowiedź jak po ✓ na telefonie; differ: seria „do uzupełnienia” nie ma „Nowy rekord!”', async () => {
    await world(); V().headphones = true; addWorkout(NOW - 7 * 86400e3, [['Bench Press (sztanga)', [{ weight: 60, reps: 8 }]]]);
    const ev = (type: 'done' | 'differ', i: number) => ({ v: 1, kind: 'event', eventId: `v-${type}-${i}`, workoutId: A().id, baseRev: 1, at: NOW + 1000 * (i + 1), client: 'apple', type, setId: sid(0, i) }) as never;
    jest.setSystemTime(NOW + 5000); await applyWatchEvent(ev('done', 0), 1); await tick(); expect(V().spoken.at(-1)![0]).toBe('Nowy rekord! Bench Press (sztanga) · seria 2, 80 kilogramów, 8 powtórzeń');
    await applyWatchEvent(ev('differ', 1), 2); await tick(); expect(V().spoken.at(-1)![0]).toBe('Bench Press (sztanga) · seria 3, 80 kilogramów, 8 powtórzeń');
  });
  test('błąd modułu mowy nie psuje przerwy ani odhaczenia', async () => {
    await world(); V().headphones = true; const m = require('@/modules/voice-cue'); m.speak.mockImplementationOnce(async () => { throw new Error('audio'); });
    await completeSet(0, 0); await tick(); expect(A().exercises[0].sets[0].done).toBe(true); expect(timer.T.on).toBe(true);
  });
  test('silenceVoice wywołuje stop modułu', () => { const s = V().stops; silenceVoice(); expect(V().stops).toBe(s + 1); });
});

describe('dane: ustawienie voiceSpeaker', () => {
  test('zapisane tylko true; zła wartość = wyłączone; przeżywa restart i kopię', async () => {
    await fresh(); store.getState().settings.voiceSpeaker = true; store.saveCfg(); await store.flush(); const disk = JSON.parse(JSON.stringify(saved()));
    await fresh(disk); expect(store.getState().settings.voiceSpeaker).toBe(true);
    for (const bad of [false, 'tak', 1, null]) { const d = JSON.parse(JSON.stringify(disk)); d.settings.voiceSpeaker = bad; await fresh(d); expect('voiceSpeaker' in store.getState().settings).toBe(false); }
    const { buildBackup, parseBackup } = require('@/lib/backup'); await fresh(disk); const r = parseBackup(JSON.stringify(buildBackup())); expect(JSON.stringify(r)).toContain('"voiceSpeaker":true');
  });
});
