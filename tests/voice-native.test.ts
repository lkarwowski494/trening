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
  for (const f of ['isSupported', 'hasVoice', 'voiceQuality', 'headphonesConnected', 'stop']) expect(code).toContain(`Function("${f}")`);
  expect(code).toContain('AsyncFunction("speak")'); expect(code).toContain('Name("VoiceCue")');
  const bridge = fs.readFileSync(path.join(root, 'modules/voice-cue/index.ts'), 'utf8'); for (const f of ['isSupported', 'hasVoice', 'voiceQuality', 'headphonesConnected', 'speak', 'stop']) expect(bridge).toMatch(new RegExp(`export const ${f}\\b`));
});
test('rejestracja: konfiguracja modułu Expo i podspec wskazują VoiceCueModule; etap 1 bez trybu audio w tle (app.json)', () => {
  const cfg = JSON.parse(fs.readFileSync(path.join(root, 'modules/voice-cue/expo-module.config.json'), 'utf8')); expect(cfg.apple.modules).toEqual(['VoiceCueModule']); expect(cfg.apple.podspecPath).toBe('VoiceCue.podspec');
  expect(fs.readFileSync(path.join(root, 'modules/voice-cue/VoiceCue.podspec'), 'utf8')).toMatch(/s\.name\s+=\s+'VoiceCue'/);
  const app = JSON.parse(fs.readFileSync(path.join(root, 'app.json'), 'utf8')).expo; expect(app.ios.infoPlist.UIBackgroundModes).toBeUndefined();
});

test('ZB-039 (03.11.2026): wybór najlepszego zainstalowanego głosu — pełny kod języka, potem język podstawowy; premium > enhanced > default; bez zgadywania głosu domyślnego jako pierwszego wyboru', () => {
  expect(code).toContain('AVSpeechSynthesisVoice.speechVoices()');
  expect(code).toMatch(/\$0\.language == language/); expect(code).toMatch(/exact\.isEmpty \? all\.filter/); expect(code).toMatch(/\$0\.language == primary \|\| \$0\.language\.hasPrefix\(primary \+ "-"\)/);
  expect(code).toMatch(/case \.premium: return 3/); expect(code).toMatch(/case \.enhanced: return 2/); expect(code).toMatch(/default: return 1/);
  expect(code).toMatch(/level\(v\.quality\) > level\(best!\.quality\)/);
  expect(code.indexOf('best ?? AVSpeechSynthesisVoice(language: language)')).toBeGreaterThan(code.indexOf('for v in pool')); /* głos domyślny tylko jako ostatnia rezerwa */
  expect(code).toMatch(/Function\("voiceQuality"\)[\s\S]*return 0[\s\S]*VoiceCueModule\.level\(v\.quality\)/);
});
test('ZB-039: .premium wymaga iOS 16 — cel podspecu ≥ 16 (bez #available)', () => {
  const pod = fs.readFileSync(path.join(root, 'modules/voice-cue/VoiceCue.podspec'), 'utf8'); const v = /:ios => '(\d+)(?:\.\d+)?'/.exec(pod); expect(Number(v![1])).toBeGreaterThanOrEqual(16);
});
