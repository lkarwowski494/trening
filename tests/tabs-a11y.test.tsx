/**
 * E2E 88 (09.10.2026): po A11-03 (tabBarLabel jako funkcja) przyciski zakładek straciły etykietę VoiceOver „{tytuł}, tab, {i} of {n}”
 * (React Navigation tworzy ją tylko dla etykiety-tekstu) — Maestro nie znajdował „More, tab.*”, VoiceOver czytał samą ikonę.
 * Etykieta budowana w app/(tabs)/_layout.tsx, w języku aplikacji; selektory Maestro „{Title}, tab.*” (EN) dalej pasują.
 */
import * as store from '@/lib/store';
import { applyLang, t } from '@/lib/i18n';
import { renderApp, flushAll, screen } from './app';
import { fresh } from './helpers';

const boot = async () => { await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())), url: '/' }); await flushAll(10); };

describe('zakładki: etykieta VoiceOver z nazwą i pozycją', () => {
  test('EN: „{Title}, tab, {i} of 4” dla każdej z 4 zakładek (Trening · Plan · Postępy · Więcej, 11.10.2026) (selektory Maestro)', async () => {
    await fresh(); store.getState().settings.language = 'en'; store.save(); await boot();
    ['Workout', 'Plan', 'Progress', 'More'].forEach((n, i) => expect(screen.getByLabelText(`${n}, tab, ${i + 1} of 4`)).toBeTruthy());
    ['Templates', 'Exercises', 'Calendar'].forEach(n => expect(screen.queryByLabelText(new RegExp(`^${n}, tab`))).toBeNull()); /* Szablony i Ćwiczenia zeszły pod Więcej */
  });
  test('PL i inny język: nazwa i pozycja w języku aplikacji', async () => {
    await fresh(); await boot();
    expect(screen.getByLabelText('Plan, zakładka, 2 z 4')).toBeTruthy(); expect(screen.getByLabelText('Postępy, zakładka, 3 z 4')).toBeTruthy(); expect(screen.getByLabelText('Więcej, zakładka, 4 z 4')).toBeTruthy();
    await fresh(); store.getState().settings.language = 'de'; store.save(); await boot(); applyLang('de');
    expect(screen.getByLabelText(`${t('Postępy')}, ${t('zakładka, {i} z {n}', { i: 3, n: 4 })}`)).toBeTruthy();
  });
});
