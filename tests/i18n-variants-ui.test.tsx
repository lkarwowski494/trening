/*
 * Fala 1 nowych języków (docs/18, 09.10.2026) — ekran i dane: wybór pt-BR / es-419 w Ustawieniach → Język, ustawienie przeżywa ponowne
 * uruchomienie, migrację i kopię (eksport → import), „Jak w telefonie” na telefonie z Brazylii / Meksyku, ekran Treningu w wariancie.
 * Rodzaje (docs/20): ekran, scenariusz, dane, regresja. Wszystkie trasy × LANGS: tests/matrix-dim-langs-routes.test.tsx (nowe kody wchodzą same).
 */
import * as store from '@/lib/store';
import { buildBackup, parseBackup } from '@/lib/backup';
import { LANG_NAME, lang, applyLang, t } from '@/lib/i18n';
import { renderApp, flushAll, screen, go, tap } from './app';

const S = () => store.getState();
afterEach(() => applyLang('pl'));

describe('Ustawienia → Język: warianty regionalne', () => {
  test('lista ma osobno Português (Portugal) / Português (Brasil) i Español (España) / Español (Latinoamérica); wybór pt-BR zapisuje się i zmienia teksty', async () => {
    await renderApp(); await go('/more/language'); await flushAll(5);
    for (const n of ['Português (Portugal)', 'Português (Brasil)', 'Español (España)', 'Español (Latinoamérica)']) expect(screen.getByText(n)).toBeTruthy();
    await tap(screen.getByText(LANG_NAME['pt-BR'])); await flushAll(10);
    expect(S().settings.language).toBe('pt-BR'); expect(lang()).toBe('pt-BR');
    await go('/more/settings'); await flushAll(5);
    expect(screen.getByText('Manter a tela ligada no treino')).toBeTruthy(); /* po brazylijsku (pt-PT: „Manter ecrã ligado no treino”) */
    expect(screen.getByText(LANG_NAME['pt-BR'])).toBeTruthy(); expect(screen.queryByText('Manter ecrã ligado no treino')).toBeNull();
  });
  test('es-419: ekran ustawień — słownictwo Ameryki Łacińskiej („equipo”, nie „material”)', async () => {
    await renderApp(); await go('/more/language'); await flushAll(5);
    await tap(screen.getByText(LANG_NAME['es-419'])); await flushAll(10);
    expect(S().settings.language).toBe('es-419');
    await go('/more/settings'); await flushAll(5);
    expect(screen.getByText('equipo en casa, en el gimnasio, en un hotel…')).toBeTruthy(); expect(screen.queryByText('material en casa, en el gimnasio, en un hotel…')).toBeNull();
  });
});

describe('dane: ustawienie wariantu przeżywa restart, migrację i kopię', () => {
  test.each(['pt-BR', 'es-419'] as const)('%s: ponowne uruchomienie, migrate(), eksport → import', async l => {
    await renderApp(); S().settings.language = l; store.save(); await flushAll(5);
    const saved = JSON.parse(JSON.stringify(S()));
    await renderApp({ saved }); await flushAll(5);
    expect([S().settings.language, lang()]).toEqual([l, l]);
    expect(store.migrate(JSON.parse(JSON.stringify(saved))).settings.language).toBe(l);
    expect(parseBackup(JSON.stringify(buildBackup())).settings.language).toBe(l);
  });
  test('nieznany wariant (np. z nowszej wersji: „pt-AO”) → ustawienie domyślne, bez błędu', async () => {
    await renderApp(); const raw = JSON.parse(JSON.stringify(S())); raw.settings.language = 'pt-AO';
    expect(store.migrate(raw).settings.language).toBe('auto');
  });
});

describe('„Jak w telefonie”: telefon z Brazylii / Meksyku', () => {
  test('pt-BR na telefonie z Brazylii: ekran Treningu po brazylijsku', async () => {
    await renderApp({ tag: 'pt-BR' }); /* kod języka „pl” w helperze — tag decyduje o regionie; ustawiamy język telefonu wprost */
    global.__locales = [{ languageCode: 'pt', languageTag: 'pt-BR' }]; S().settings.language = 'auto'; store.applyPrefs(); await go('/'); await flushAll(5);
    expect(lang()).toBe('pt-BR');
    expect(screen.getAllByText(t('Trening')).length).toBeGreaterThan(0);
  });
  test('es-419 na telefonie z Meksyku: lang() = es-419, nagłówek „Entreno” (krótka forma — zakładka 320 pt, tests/matrix-i18n)', async () => {
    await renderApp(); global.__locales = [{ languageCode: 'es', languageTag: 'es-MX' }]; S().settings.language = 'auto'; store.applyPrefs(); await go('/'); await flushAll(5);
    expect(lang()).toBe('es-419'); expect(screen.getAllByText('Entreno').length).toBeGreaterThan(0);
  });
});
