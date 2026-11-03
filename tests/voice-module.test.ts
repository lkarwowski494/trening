/*
 * modules/voice-cue/index.ts — most do modułu natywnego głosu (docs/36) na atrapie modułu Expo: delegowanie wywołań, połykanie wyjątków, zachowanie bez modułu
 * (Expo Go, Android, testy). Osobny plik: ładuje prawdziwy plik mostu w izolowanym rejestrze modułów (globalna atrapa mostu z tests/setup.js obejmuje resztę testów).
 */
type Bridge = typeof import('../modules/voice-cue/index');
const load = (native: unknown): Bridge => {
  let m!: Bridge;
  jest.isolateModules(() => { jest.doMock('expo-modules-core', () => ({ ...jest.requireActual('expo-modules-core'), requireOptionalNativeModule: () => native })); m = jest.requireActual('../modules/voice-cue/index'); });
  return m;
};
const fake = () => ({ isSupported: jest.fn(() => true), hasVoice: jest.fn(() => true), voiceQuality: jest.fn(() => 2), headphonesConnected: jest.fn(() => true), speak: jest.fn(async () => true), stop: jest.fn() });

test('z modułem: wywołania trafiają do natywnego z tymi samymi argumentami', async () => {
  const n = fake(); const m = load(n);
  expect([m.isSupported(), m.hasVoice('pl-PL'), m.headphonesConnected(), await m.speak('tekst', 'pl-PL')]).toEqual([true, true, true, true]); m.stop();
  expect(n.hasVoice).toHaveBeenCalledWith('pl-PL'); expect(n.speak).toHaveBeenCalledWith('tekst', 'pl-PL'); expect(n.stop).toHaveBeenCalledTimes(1);
});
test('moduł rzuca wyjątki: most je połyka (false / brak wyjątku) — błąd audio nigdy nie psuje treningu', async () => {
  const m = load({ ...fake(), hasVoice: () => { throw new Error('x'); }, headphonesConnected: () => { throw new Error('x'); }, speak: async () => { throw new Error('x'); }, stop: () => { throw new Error('x'); } });
  expect([m.hasVoice('pl'), m.headphonesConnected(), await m.speak('a', 'pl')]).toEqual([false, false, false]); expect(() => m.stop()).not.toThrow();
});
test('ZB-039: voiceQuality — wartość z modułu, wyjątek lub nie-liczba → 0, bez modułu → 0', () => {
  const n = fake(); const m = load(n); expect(m.voiceQuality('pl-PL')).toBe(2); expect(n.voiceQuality).toHaveBeenCalledWith('pl-PL');
  expect(load({ ...fake(), voiceQuality: () => { throw new Error('x'); } }).voiceQuality('pl')).toBe(0);
  expect(load({ ...fake(), voiceQuality: () => undefined }).voiceQuality('pl')).toBe(0); expect(load(null).voiceQuality('pl')).toBe(0);
});
test('bez modułu natywnego: wszystko false i no-op', async () => {
  const m = load(null); expect([m.isSupported(), m.hasVoice('pl'), m.headphonesConnected(), await m.speak('a', 'pl')]).toEqual([false, false, false, false]); expect(() => m.stop()).not.toThrow();
});
