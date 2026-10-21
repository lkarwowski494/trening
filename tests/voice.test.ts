/*
 * Głos w słuchawkach (lib/voice.ts, modules/voice-cue; docs/36): kiedy i co mówi — polityka (dźwięk, aplikacja na wierzchu, słuchawki, głośnik, VoiceOver), tekst (restCue + rekord),
 * integracja z odhaczeniem serii (telefon i zdarzenia z zegarka), cofnięcie przerywa, ustawienie „Zapowiedzi głosowe” (`Settings.voice`, 19.10.2026: Wyłączone / W słuchawkach /
 * Także przez głośnik; migracja z `voiceSpeaker`) w danych i kopii, most do modułu natywnego (atrapa).
 */
import { AccessibilityInfo, AppState } from 'react-native';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { voicePolicy, cueSpeech, sayRestStart, silenceVoice, voiceAvailable, sampleVoice, appActive, __setScreenReaderForTests, VOICE_REASONS, VOICE_SETTINGS, VOICE_DEFAULT, voiceSetting, setVoiceSetting, voiceSettingLabel, type VoiceInput } from '@/lib/voice';
import { completeSet } from '@/lib/setFlow';
import { applyWatchEvent } from '@/lib/watch/apply';
import { restCue } from '@/lib/live';
import { applyLang } from '@/lib/i18n';
import { applyUnit } from '@/lib/units';
import { fresh, saved, addWorkout } from './helpers';
import { world as world0, A, sid, NOW, teardownWorld } from './watch-world';
/* DEC-05 (20.10.2026): nowa instalacja ma głos wyłączony — testy mowy działają na ustawieniu „W słuchawkach” (jak dane istniejącego użytkownika) */
const world = async (o: Parameters<typeof world0>[0] = {}) => { const w = await world0(o); store.getState().settings.voice = 'headphones'; return w; };

const V = () => global.__voice;
beforeEach(() => { V().spoken.length = 0; V().stops = 0; V().headphones = false; V().hasVoice = true; __setScreenReaderForTests(false); });
afterEach(() => { teardownWorld(); jest.restoreAllMocks(); });
const tick = async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); };

describe('voicePolicy (czysta)', () => {
  const bools = [true, false];
  const all: VoiceInput[] = []; for (const sound of bools) for (const setting of VOICE_SETTINGS) for (const headphones of bools) for (const appActive of bools) for (const screenReader of bools) all.push({ sound, setting, headphones, appActive, screenReader });
  test.each(all.map(i => [JSON.stringify(i), i] as const))('%s', (_n, i) => {
    const d = voicePolicy(i); expect(VOICE_REASONS).toContain(d.reason);
    if (i.setting === 'off') expect(d).toEqual({ mode: 'silent', reason: 'voice-off' }); /* „Wyłączone” = nigdy nie mówi, niezależnie od dźwięku i słuchawek */
    else if (!i.sound) expect(d).toEqual({ mode: 'silent', reason: 'sound-off' });
    else if (!i.appActive) expect(d).toEqual({ mode: 'silent', reason: 'background' });
    else if (!i.headphones && i.setting !== 'speaker') expect(d).toEqual({ mode: 'silent', reason: 'no-headphones' });
    else if (i.screenReader) expect(d).toEqual({ mode: 'announce', reason: 'screen-reader' });
    else expect(d).toEqual({ mode: 'speak', reason: i.headphones ? 'headphones' : 'speaker' });
  });
  test('domyślnie „W słuchawkach”: bez słuchawek cisza, ze słuchawkami mowa; „Także przez głośnik” mówi bez słuchawek; „Wyłączone” milczy także w słuchawkach', () => {
    const b = { sound: true, setting: VOICE_DEFAULT, headphones: false, appActive: true, screenReader: false };
    expect(VOICE_DEFAULT).toBe('headphones'); expect(VOICE_SETTINGS).toEqual(['off', 'headphones', 'speaker']);
    expect(voicePolicy(b).mode).toBe('silent'); expect(voicePolicy({ ...b, headphones: true }).mode).toBe('speak'); expect(voicePolicy({ ...b, setting: 'speaker' })).toEqual({ mode: 'speak', reason: 'speaker' });
    expect(voicePolicy({ ...b, setting: 'off', headphones: true })).toEqual({ mode: 'silent', reason: 'voice-off' }); expect(voicePolicy({ ...b, setting: 'off', headphones: true, screenReader: true }).mode).toBe('silent');
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
  test('bez słuchawek przy „W słuchawkach”: cisza; „Także przez głośnik”: mówi', async () => {
    await world(); await sayRestStart(A(), sid(0, 0)); expect(V().spoken).toEqual([]);
    store.getState().settings.voice = 'speaker'; const r = await sayRestStart(A(), sid(0, 0)); expect(V().spoken).toHaveLength(1); expect(r.reason).toBe('speaker');
  });
  test('„Wyłączone”: cisza w słuchawkach i przez głośnik, także przy włączonym dźwięku i VoiceOverze (bez announce)', async () => {
    await world(); V().headphones = true; store.getState().settings.voice = 'off'; const an = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => {});
    const r = await sayRestStart(A(), sid(0, 0)); expect([r.mode, r.reason, V().spoken]).toEqual(['silent', 'voice-off', []]);
    __setScreenReaderForTests(true); await sayRestStart(A(), sid(0, 0)); expect(an).not.toHaveBeenCalled(); expect(V().spoken).toEqual([]);
  });
  test('„Wyłączone” przez ✓ na telefonie: przerwa startuje, zapowiedzi brak', async () => {
    await world(); V().headphones = true; store.getState().settings.voice = 'off'; await completeSet(0, 0); await tick(); expect(timer.T.on).toBe(true); expect(V().spoken).toEqual([]);
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

describe('dane: ustawienie „Zapowiedzi głosowe” (Settings.voice; 19.10.2026)', () => {
  const S = () => store.getState().settings;
  test('nowa instalacja: „Wyłączone” zapisane jawnie (DEC-05, 20.10.2026); każdy wybór zapisuje jawną wartość, także „W słuchawkach”', async () => {
    await fresh(); expect(S().voice).toBe('off'); expect(voiceSetting()).toBe('off');
    setVoiceSetting('speaker'); expect(S().voice).toBe('speaker'); expect(voiceSetting()).toBe('speaker');
    setVoiceSetting('headphones'); expect(S().voice).toBe('headphones'); expect(voiceSetting()).toBe('headphones'); setVoiceSetting('off'); expect(S().voice).toBe('off');
  });
  test('wybór „Wyłączone” w trakcie zapowiedzi przerywa mowę', async () => { await fresh(); const s0 = V().stops; setVoiceSetting('off'); expect(V().stops).toBe(s0 + 1); });
  test('migracja: voiceSpeaker true → „Także przez głośnik”; brak pola → „W słuchawkach” (dane sprzed 20.10.2026); dawne pole znika (jedno źródło)', async () => {
    await fresh(); store.saveCfg(); await store.flush(); const disk = JSON.parse(JSON.stringify(saved()));
    const a = JSON.parse(JSON.stringify(disk)); a.settings.voiceSpeaker = true; delete a.settings.voice; await fresh(a); expect(S().voice).toBe('speaker'); expect('voiceSpeaker' in S()).toBe(false);
    const b = JSON.parse(JSON.stringify(disk)); delete b.settings.voiceSpeaker; delete b.settings.voice; await fresh(b); expect('voice' in S()).toBe(false); expect(voiceSetting()).toBe('headphones');
    for (const old of [false, 'tak', 1, null]) { const d = JSON.parse(JSON.stringify(disk)); delete d.settings.voice; d.settings.voiceSpeaker = old; await fresh(d); expect([old, 'voice' in S(), 'voiceSpeaker' in S()]).toEqual([old, false, false]); }
  });
  test('migracja: poprawna wartość przechodzi jawnie (off, headphones, speaker); zła wartość → brak pola (= „W słuchawkach”); nowe pole wygrywa z dawnym', async () => {
    await fresh(); store.saveCfg(); await store.flush(); const disk = JSON.parse(JSON.stringify(saved()));
    for (const [v, want] of [['off', 'off'], ['speaker', 'speaker'], ['headphones', 'headphones'], ['loud', undefined], [true, undefined], [1, undefined], [null, undefined], [{}, undefined]] as const) {
      const d = JSON.parse(JSON.stringify(disk)); d.settings.voice = v; await fresh(d); expect([v, S().voice]).toEqual([v, want]);
    }
    const d = JSON.parse(JSON.stringify(disk)); d.settings.voice = 'off'; d.settings.voiceSpeaker = true; await fresh(d); expect(S().voice).toBe('off'); expect('voiceSpeaker' in S()).toBe(false);
    const e = JSON.parse(JSON.stringify(disk)); e.settings.voice = 'loud'; e.settings.voiceSpeaker = true; await fresh(e); expect('voice' in S()).toBe(false); /* zła wartość nowego pola = domyślna */
  });
  test('kopia zapasowa: eksport → import zachowuje wybór; import kopii sprzed zmiany (voiceSpeaker true) daje „Także przez głośnik”; idempotentne', async () => {
    const { buildBackup, parseBackup } = require('@/lib/backup');
    for (const v of ['off', 'speaker'] as const) { await fresh(); setVoiceSetting(v); await store.flush(); const r = parseBackup(JSON.stringify(buildBackup())); expect(r.settings.voice).toBe(v); expect('voiceSpeaker' in r.settings).toBe(false); }
    await fresh(); store.saveCfg(); await store.flush(); const old = buildBackup(); old.state = JSON.parse(JSON.stringify(old.state)); delete old.state.settings.voice; old.state.settings.voiceSpeaker = true;
    const r = parseBackup(JSON.stringify(old)); expect(r.settings.voice).toBe('speaker'); expect('voiceSpeaker' in r.settings).toBe(false);
    const again = parseBackup(JSON.stringify({ ...old, state: r })); expect(again.settings.voice).toBe('speaker');
    const bad = JSON.parse(JSON.stringify(old)); bad.state.settings.voice = 'głośno'; expect('voice' in parseBackup(JSON.stringify(bad)).settings).toBe(false);
  });
  test('etykiety wyboru w języku aplikacji (PL, EN)', () => {
    expect(VOICE_SETTINGS.map(voiceSettingLabel)).toEqual(['Wyłączone', 'W słuchawkach', 'Także przez głośnik']);
    applyLang('en'); expect(VOICE_SETTINGS.map(voiceSettingLabel)).toEqual(['Off', 'In headphones', 'Also through the speaker']); applyLang('pl');
  });
});
