/*
 * M1-audytor-generalny-032 (audyt 1.0, 27.10.2026; 12-niezawodnosc-003): „Napisz do nas” z ekranu błędu startu dołącza do treści e-maila kod diagnostyczny
 * startu (lib/state/bootphase.ts: etap, czas, schemat, licznik — bez danych osobowych) i treść błędu; bez danych treningowych. Zwykłe „Napisz do nas”
 * (Więcej → O aplikacji) — bez zmian. Rodzaje (docs/20): logika, ekran, prywatność (brak danych treningowych), regresja.
 */
import { Linking } from 'react-native';
import { buildSupportMailto } from '@/lib/support';
import { t } from '@/lib/i18n';
import { seedState } from './helpers';
import { renderApp, flushAll, screen, tap } from './app';

jest.setTimeout(60000);
const bodyOf = (u: string) => decodeURIComponent(/body=([^&]*)/.exec(u)![1]);

describe('M1-032: kod diagnostyczny w wiadomości z ekranu błędu startu', () => {
  test('buildSupportMailto z extra: treść zawiera kod i komunikat pod stopką; bez extra — jak dotąd', () => {
    const plain = bodyOf(buildSupportMailto({ version: '1.0.0 (1040)', os: '18.1', language: 'pl' }));
    const withDiag = bodyOf(buildSupportMailto({ version: '1.0.0 (1040)', os: '18.1', language: 'pl', extra: 'boot:init t=1200 s=19 n=2 · boom-x' }));
    expect(withDiag.startsWith(plain)).toBe(true); expect(withDiag).toContain('boot:init t=1200 s=19 n=2 · boom-x'); expect(plain).not.toContain('boot:');
  });
  test('ekran błędu startu: „Napisz do nas” otwiera pocztę z treścią błędu; bez danych treningowych z zapisu', async () => {
    const state = seedState('pl'); state.settings.defaultRest = 77;
    const spy = jest.spyOn(require('@/lib/draft'), 'restoreObjDrafts').mockImplementation(() => { throw new Error('boom-po-init'); });
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
    try {
      await renderApp({ saved: state }); await flushAll(50);
      await tap(screen.getByText(t('Napisz do nas'))); await flushAll(20);
      const body = bodyOf(String(open.mock.calls.at(-1)![0]));
      expect(body).toContain('boom-po-init'); expect(body).not.toMatch(/defaultRest|Back Squat|"workouts"/);
    } finally { spy.mockRestore(); open.mockRestore(); }
  });
});
