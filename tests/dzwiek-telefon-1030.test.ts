/*
 * Test właściciela na telefonie, build 1030 (23.10.2026; ZD-01, W2-04, R-004): „Dźwięki chyba nie działają… na Instagramie jest dźwięk”. Diagnoza (docs/18, 23.10.2026):
 * koniec przerwy i stopera serii to DŹWIĘK POWIADOMIENIA LOKALNEGO (UNNotificationSound.default), nie odtwarzanie przez sesję audio aplikacji. Takie dźwięki wycisza tryb
 * cichy iPhone'a (przełącznik/przycisk Action), tryb skupienia i wyłączone „Dźwięki” w Ustawienia → Powiadomienia → Trening; wibrować telefon może dalej. Aplikacje, które grają
 * w trybie cichym (kategoria sesji `playback`), robią to własnym odtwarzaczem — nasza aplikacja go nie ma. Te testy utrwalają stan faktyczny (żeby zmiana była świadoma)
 * i domyślne wartości po instalacji; decyzja właściciela o dźwięku w trybie cichym — docs/18 (opcje A/B/C).
 */
import * as fs from 'fs';
import * as path from 'path';
import { defaultSettings, seedState } from '@/lib/seed';
import { hapticsEnabled } from '@/lib/haptics';

const root = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');

describe('domyślne wartości po instalacji', () => {
  test('dźwięk na koniec przerwy włączony, wibracje włączone (brak pola = jak dźwięk), zapowiedzi głosowe wyłączone (DEC-05)', () => {
    expect(defaultSettings().sound).toBe(true);
    expect(hapticsEnabled(defaultSettings())).toBe(true);
    expect(seedState().settings.voice).toBe('off');
  });
});

describe('skąd bierze się dźwięk (utrwalony stan faktyczny)', () => {
  test('aplikacja nie ma odtwarzacza audio ani trybu audio w tle: bez expo-audio / expo-av, bez UIBackgroundModes „audio”', () => {
    const pkg = JSON.parse(read('package.json')); const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    expect(Object.keys(deps).filter(d => /^expo-(audio|av)$/.test(d))).toEqual([]);
    const modes = JSON.parse(read('app.json')).expo.ios.infoPlist.UIBackgroundModes ?? [];
    expect(modes).not.toContain('audio');
  });
  test('koniec przerwy i serii: powiadomienie lokalne z sound zależnym od ustawienia i poziomem „pilne”', () => {
    const t = read('lib/timer.ts');
    expect(t.match(/sound: soundOn\(\), \.\.\.URGENT/g)?.length).toBe(2); /* rest-end i set-end */
    expect(t).toContain("shouldPlaySound: soundOn()"); /* także gdy aplikacja jest na wierzchu */
  });
  test('jedyna sesja audio w aplikacji to głos (VoiceCue): kategoria playback (gra w trybie cichym), mowa tylko przy aplikacji na wierzchu', () => {
    const sw = read('modules/voice-cue/ios/VoiceCueModule.swift');
    expect(sw).toContain('.playback'); expect(sw).toContain('.duckOthers');
    expect(read('lib/voice.ts')).toContain("if (!i.appActive) return { mode: 'silent', reason: 'background' };");
  });
});
