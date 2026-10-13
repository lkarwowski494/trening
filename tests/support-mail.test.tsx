/*
 * „Napisz do nas” (decyzja właściciela 13.10.2026, docs/18; wzorce docs/32 pkt 14 i 17): Więcej → O aplikacji, pod wersją, z podpisem support@apps4brew.com;
 * mailto: przez Linking.openURL (bez canOpenURL), temat i stopka techniczna przez t(). Rodzaje (docs/20): logika (lib/support.ts: kodowanie, niezmiennik
 * „tylko stopka techniczna”), ekran (wiersz, a11y, 44 pt przez Item, wciśnięcie → openURL), scenariusz (odrzucenie openURL → okno i adres do zaznaczenia),
 * języki × jasny/ciemny, dane (SCHEMA_VERSION bez zmian). E2E: .maestro/15-masa-licencje.yaml (stuknięcie poza Mailem — otwarcie poczty jest poza kontrolą Maestro).
 */
import * as fs from 'fs';
import * as RN from 'react-native';
import { Linking, Platform } from 'react-native';
import * as store from '@/lib/store';
import { applyLang } from '@/lib/i18n';
import { SUPPORT_EMAIL, buildSupportMailto } from '@/lib/support';
import { versionLabel } from '@/lib/version';
import { SCHEMA_VERSION } from '@/lib/seed';
import { fresh, seedWithDemo } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';

afterEach(() => { applyLang('pl'); jest.restoreAllMocks(); });
const parse = (u: string) => { const [head, q] = u.split('?'); const p = Object.fromEntries(q.split('&').map(kv => kv.split('=').map(decodeURIComponent) as [string, string])); return { to: head.replace('mailto:', ''), subject: p.subject, body: p.body }; };

describe('lib/support: buildSupportMailto', () => {
  test('PL: adres z jednej stałej, temat, pusta linia i sama stopka techniczna; kodowanie encodeURIComponent (bez surowych spacji i znaków nowej linii)', () => {
    expect(SUPPORT_EMAIL).toBe('support@apps4brew.com');
    const u = buildSupportMailto({ version: '0.17.0 (1105)', os: '17.5', language: 'pl' });
    expect(u).toMatch(/^mailto:support@apps4brew\.com\?subject=[^ \n]+&body=[^ \n]+$/);
    expect(u).toContain(encodeURIComponent('Trening — opinia'));
    expect(parse(u)).toEqual({ to: SUPPORT_EMAIL, subject: 'Trening — opinia', body: '\n\nWersja: 0.17.0 (1105) · iOS 17.5 · Język: pl' });
  });
  test('EN: temat i stopka po angielsku; znaki specjalne (&, #, %, +) w wersji nie rozbijają adresu', () => {
    applyLang('en');
    const p = parse(buildSupportMailto({ version: '1.0 & #2 100% a+b', os: 18, language: 'en' }));
    expect(p.subject).toBe('Training — feedback'); expect(p.body).toBe('\n\nVersion: 1.0 & #2 100% a+b · iOS 18 · Language: en');
  });
  test('niezmiennik: treść to dokładnie pusta linia + stopka — bez historii, masy ciała, nazw szablonów, identyfikatorów, kopii; bez numeru buildu poza versionLabel', async () => {
    await fresh(seedWithDemo(), 'pl');
    const s = JSON.stringify(store.getState()); const names = (store.getState().templates ?? []).map((x: { name: string }) => x.name).filter(Boolean);
    expect(names.length).toBeGreaterThan(0);
    const u = buildSupportMailto({ version: versionLabel('0.17.0', undefined), os: '17.5', language: 'pl' }); const p = parse(u);
    expect(p.body).toBe('\n\nWersja: 0.17.0 · iOS 17.5 · Język: pl'); expect(p.body).not.toMatch(/\(\d+\)/); /* bez BUILD_NUMBER — sama wersja */
    expect(p.body.split('\n').filter(Boolean)).toHaveLength(1);
    for (const n of names) expect(decodeURIComponent(u)).not.toContain(n);
    expect(s.length).toBeGreaterThan(100); expect(decodeURIComponent(u)).not.toMatch(/ownerId|schemaVersion|workouts|bodyWeight|kg\b|[0-9a-f]{8}-[0-9a-f]{4}-/);
    expect(u).not.toMatch(/[?&](cc|bcc|attach)=/i);
  });
  test('dane: SCHEMA_VERSION = 19 (0.19: jedno podniesienie dla miejsc jednorazowych i miejsc dni planu)', () => { expect(SCHEMA_VERSION).toBe(19); });
});

describe('O aplikacji: wiersz „Napisz do nas”', () => {
  const boot = async (locale: 'pl' | 'en' = 'pl') => { await fresh(seedWithDemo(), locale); await renderApp({ locale, url: '/more/about' }); await flushAll(10); };

  test('ekran PL: wiersz pod wersją z podpisem adresu; VoiceOver: przycisk „Napisz do nas”, podpowiedź „Otwiera aplikację Mail”; zdanie o braku zbierania danych bez zmian', async () => {
    await boot();
    const row = screen.getByLabelText('Napisz do nas');
    expect(row.props.accessibilityRole).toBe('button'); expect(row.props.accessibilityHint).toBe('Otwiera aplikację Mail'); expect(row.props.accessibilityLanguage).toBe('pl');
    expect(screen.getByText(SUPPORT_EMAIL)).toBeTruthy();
    expect(screen.getByText('Aplikacja nie zbiera danych: wszystko, co wpisujesz, zostaje w telefonie, bez konta, reklam i analityki.')).toBeTruthy();
    const order = screen.getAllByRole('button').map(b => b.props.accessibilityLabel).filter(Boolean);
    expect(order.indexOf('Napisz do nas')).toBeGreaterThan(-1); expect(order.indexOf('Napisz do nas')).toBeLessThan(order.findIndex((l: string) => /licencje|licences/i.test(l)));
    expect(fs.readFileSync('app/more/about.tsx', 'utf8')).not.toContain('canOpenURL');
  });
  test('ekran EN: etykieta „Write to us”, podpowiedź „Opens the Mail app”, accessibilityLanguage en', async () => {
    await boot('en');
    const row = screen.getByLabelText('Write to us');
    expect(row.props.accessibilityHint).toBe('Opens the Mail app'); expect(row.props.accessibilityLanguage).toBe('en'); expect(screen.getByText(SUPPORT_EMAIL)).toBeTruthy();
  });
  test('wciśnięcie woła Linking.openURL z adresem mailto: (wersja z buildem, iOS, język), bez okna błędu', async () => {
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined as never); await boot();
    await tap(screen.getByLabelText('Napisz do nas')); await flushAll(10);
    expect(open).toHaveBeenCalledTimes(1);
    const p = parse(open.mock.calls[0][0]);
    expect(p.to).toBe(SUPPORT_EMAIL); expect(p.subject).toBe('Trening — opinia');
    expect(p.body).toMatch(new RegExp(`^\\n\\nWersja: .+ · iOS ${String(Platform.Version).replace('.', '\\.')} · Język: pl$`));
    expect(global.__alerts).toHaveLength(0); expect(screen.queryByTestId('support-mail-fallback')).toBeNull();
  });
  test('scenariusz: odrzucenie openURL (brak poczty) → okno „Nie udało się otworzyć poczty” z adresem i zaznaczalny adres na ekranie; bez awarii; EN', async () => {
    jest.spyOn(Linking, 'openURL').mockRejectedValue(new Error('no mail')); await boot();
    await tap(screen.getByLabelText('Napisz do nas')); await flushAll(10);
    expect(global.__alerts).toHaveLength(1); expect(global.__alerts[0].title).toBe('Nie udało się otworzyć poczty'); expect(global.__alerts[0].msg).toBe(`Napisz na: ${SUPPORT_EMAIL}`);
    expect((global.__alerts[0].buttons as { text: string }[]).map(b => b.text)).toEqual(['OK']);
    const fb = screen.getByTestId('support-mail-fallback'); expect(fb.props.selectable).toBe(true); expect(fb.props.children).toBe(`Napisz na: ${SUPPORT_EMAIL}`);
    expect(screen.getByLabelText('Napisz do nas')).toBeTruthy(); /* ekran działa dalej */
  });
  test('scenariusz EN: synchroniczny wyjątek openURL też jest obsłużony; komunikat po angielsku', async () => {
    jest.spyOn(Linking, 'openURL').mockImplementation(() => { throw new Error('sync'); }); await boot('en');
    await tap(screen.getByLabelText('Write to us')); await flushAll(10);
    expect(global.__alerts[0].title).toBe('Couldn’t open Mail'); expect(global.__alerts[0].msg).toBe(`Write to: ${SUPPORT_EMAIL}`);
  });
  test.each([['pl', 'light'], ['pl', 'dark'], ['en', 'light'], ['en', 'dark']] as const)('macierz: %s × %s — wiersz i podpis renderują się', async (loc, mode) => {
    jest.spyOn(RN, 'useColorScheme').mockImplementation((() => mode) as never); await boot(loc);
    expect(screen.getByLabelText(loc === 'pl' ? 'Napisz do nas' : 'Write to us')).toBeTruthy(); expect(screen.getByText(SUPPORT_EMAIL)).toBeTruthy();
  });
});
