/*
 * Moduł natywny głosu (modules/voice-cue/ios/VoiceCueModule.swift, docs/36): Swiftu nie da się skompilować na Linuksie (kompilacja: ios-unsigned.yml), więc ten test pilnuje
 * decyzji projektowych w źródle — sesja `playback`/`spokenAudio` (mowa także przy wyciszonym telefonie), ściszanie tylko na czas zdania (duckOthers +
 * interruptSpokenAudioAndMixWithOthers), zwolnienie sesji z powiadomieniem innych, limit czasu ściszania, brak trybu audio w tle w etapie 1, rejestracja modułu.
 */
import * as fs from 'fs';
import * as path from 'path';

const root = path.join(__dirname, '..');
const swift = fs.readFileSync(path.join(root, 'modules/voice-cue/ios/VoiceCueModule.swift'), 'utf8');
const code = swift.replace(/\/\/.*$/gm, '');

test('sesja dźwięku: playback + spokenAudio, ściszanie i pauza podcastów, zwolnienie z powiadomieniem innych', () => {
  expect(code).toMatch(/setCategory\(\.playback, mode: \.spokenAudio, options: \[\.duckOthers, \.interruptSpokenAudioAndMixWithOthers\]\)/);
  expect(code).toMatch(/setActive\(false, options: \[\.notifyOthersOnDeactivation\]\)/);
  expect(code).toMatch(/maxDuckSec = 20\.0/); /* Apple: ściszanie „na kilka sekund” — twardy limit zwolnienia sesji */
});
test('słuchawki: tylko przewodowe, Bluetooth i USB (głośnik, AirPlay, HDMI i samochód to nie słuchawki)', () => {
  expect(code).toMatch(/\[\.headphones, \.bluetoothA2DP, \.bluetoothLE, \.bluetoothHFP, \.usbAudio\]/); expect(code).not.toMatch(/builtInSpeaker|airPlay|carAudio|HDMI/);
});
test('funkcje modułu zgodne z mostem TypeScript: isSupported, hasVoice, headphonesConnected, speak, stop', () => {
  for (const f of ['isSupported', 'hasVoice', 'headphonesConnected', 'stop']) expect(code).toContain(`Function("${f}")`);
  expect(code).toContain('AsyncFunction("speak")'); expect(code).toContain('Name("VoiceCue")');
  const bridge = fs.readFileSync(path.join(root, 'modules/voice-cue/index.ts'), 'utf8'); for (const f of ['isSupported', 'hasVoice', 'headphonesConnected', 'speak', 'stop']) expect(bridge).toMatch(new RegExp(`export const ${f}\\b`));
});
test('rejestracja: konfiguracja modułu Expo i podspec wskazują VoiceCueModule; etap 1 bez trybu audio w tle (app.json)', () => {
  const cfg = JSON.parse(fs.readFileSync(path.join(root, 'modules/voice-cue/expo-module.config.json'), 'utf8')); expect(cfg.apple.modules).toEqual(['VoiceCueModule']); expect(cfg.apple.podspecPath).toBe('VoiceCue.podspec');
  expect(fs.readFileSync(path.join(root, 'modules/voice-cue/VoiceCue.podspec'), 'utf8')).toMatch(/s\.name\s+=\s+'VoiceCue'/);
  const app = JSON.parse(fs.readFileSync(path.join(root, 'app.json'), 'utf8')).expo; expect(app.ios.infoPlist.UIBackgroundModes).toBeUndefined();
});
