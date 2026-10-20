/*
 * M1-audytor-generalny-027 (DEC-05, decyzja właściciela 20.10.2026): zapowiedzi głosowe domyślnie WYŁĄCZONE dla nowej instalacji.
 * Brak pola `Settings.voice` w zapisanych danych znaczy od wydania 0.20 „W słuchawkach” — ten sens zostaje dla danych istniejących użytkowników
 * (nie tracą zachowania), a „Wyłączone” jest wartością jawną zapisywaną przez seed świeżej instalacji. Test na zapisach z wydanych buildów
 * (tests/fixtures/released): efektywne ustawienie po starcie = to, które użytkownik miał przed aktualizacją.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as store from '@/lib/store';
import { seedState } from '@/lib/seed';
import { voiceSetting, setVoiceSetting, VOICE_DEFAULT, VOICE_NEW_INSTALL } from '@/lib/voice';
import { fresh, saved } from './helpers';

jest.setTimeout(60000);
const S = () => store.getState().settings;
const DIR = path.join(__dirname, 'fixtures', 'released');
const FILES = fs.readdirSync(DIR).filter(f => f.endsWith('.json')).sort();

describe('nowa instalacja: głos wyłączony', () => {
  test('stałe: nowa instalacja „off”, brak pola w danych = „headphones” (sens z wydania 0.20)', () => {
    expect(VOICE_NEW_INSTALL).toBe('off'); expect(VOICE_DEFAULT).toBe('headphones');
  });
  test('seedState (każdy język) zapisuje jawnie voice: off', () => {
    for (const l of ['pl', 'en', 'de'] as const) expect(seedState(l).settings.voice).toBe('off');
  });
  test('świeży start: ustawienie „off”, zostaje po restarcie (zapis → odczyt → migracja idempotentna)', async () => {
    await fresh(); expect(voiceSetting()).toBe('off'); expect(S().voice).toBe('off');
    store.saveCfg(); await store.flush(); const disk = JSON.parse(JSON.stringify(saved())); await fresh(disk); expect(S().voice).toBe('off'); expect(voiceSetting()).toBe('off');
  });
  test('wybór „W słuchawkach” na nowej instalacji zapisuje się jawnie i przeżywa restart', async () => {
    await fresh(); setVoiceSetting('headphones'); expect(S().voice).toBe('headphones'); expect(voiceSetting()).toBe('headphones');
    store.saveCfg(); await store.flush(); const disk = JSON.parse(JSON.stringify(saved())); await fresh(disk); expect(voiceSetting()).toBe('headphones');
    setVoiceSetting('speaker'); expect(S().voice).toBe('speaker'); setVoiceSetting('off'); expect(S().voice).toBe('off');
  });
});

/* Fixture’y z wydanych buildów mają voice: 'speaker' (generator je ustawia), a użytkownik, który głosu nie ruszał, ma BRAK pola — dlatego każdy zapis
 * sprawdzamy w dwóch wariantach: jak w pliku i z usuniętym polem (state.settings i cfg.data.settings). */
const VARIANTS = FILES.flatMap(f => [[f, 'jak w pliku'], [f, 'bez pola voice']] as const);
describe.each(VARIANTS)('istniejący użytkownik, dane z wydanego builda %s (%s): zachowanie bez zmian', (file, variant) => {
  const fx = JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8'));
  if (variant === 'bez pola voice') { delete fx.state.settings.voice; if (fx.cfg?.data?.settings) delete fx.cfg.data.settings.voice; }
  const before = (): string => { const c = fx.cfg?.data?.settings?.voice; const s = fx.state?.settings?.voice; const v = c !== undefined ? c : s; return v === 'off' || v === 'speaker' ? v : VOICE_DEFAULT; };
  const load = async () => {
    await fresh(); global.__kv.clear();
    global.__kv.set('state', JSON.stringify(fx.state)); if (fx.live) global.__kv.set('live', JSON.stringify(fx.live)); if (fx.cfg) global.__kv.set('cfg', JSON.stringify(fx.cfg));
    store.__resetForTests(); await store.init(); return store.getState();
  };
  test('efektywne ustawienie głosu po aktualizacji = sprzed aktualizacji (brak pola = „W słuchawkach”)', async () => {
    await load(); expect(voiceSetting()).toBe(before()); if (variant === 'bez pola voice') expect(voiceSetting()).toBe('headphones');
  });
  test('restart po aktualizacji nie zmienia ustawienia', async () => {
    await load(); const want = voiceSetting(); store.saveCfg(); await store.flush(); const disk = JSON.parse(JSON.stringify(saved())); await fresh(disk); expect(voiceSetting()).toBe(want);
  });
});

describe('dane z wydanego 0.20 bez pola voice (syntetyczne warianty)', () => {
  test.each([[undefined, 'headphones'], ['off', 'off'], ['speaker', 'speaker'], ['headphones', 'headphones'], ['loud', 'headphones']] as const)('voice=%s → %s', async (v, want) => {
    await fresh(); store.saveCfg(); await store.flush(); const d = JSON.parse(JSON.stringify(saved()));
    if (v === undefined) delete d.settings.voice; else d.settings.voice = v;
    await fresh(d); expect(voiceSetting()).toBe(want);
  });
});
