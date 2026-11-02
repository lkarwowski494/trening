/*
 * Nagłówek sekcji błędów w karcie ćwiczenia: „Częste błędy” → „Czego unikać” (EN „What to avoid”) — decyzja właściciela 02.11.2026 ~14:15 (docs/18):
 * błąd wnioskowany ze zdania ustawienia lub ruchu nie dowodzi częstości, więc nagłówek nie obiecuje „częstych” błędów.
 * Rodzaje (docs/20): ekran (nagłówek karty), języki (PL + EN; pozostałe języki — przekład przez API, patrz pytanie w raporcie), dane (strona z ćwiczeniami używa tego samego klucza).
 * Zakres: tytuł sekcji `mistakes` w components/ExerciseCues.tsx:26 i tekst `ui.mistakes` w scripts/strona/eksport.mjs. „Pokaż częsty błąd” (animacja) bez zmian.
 */
import React from 'react';
import * as fs from 'fs';
import * as path from 'path';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ExerciseCues } from '@/components/ExerciseCues';
import { applyLang, t } from '@/lib/i18n';
import { fresh } from './helpers';

const root = path.join(__dirname, '..');
afterEach(() => { applyLang('pl'); });

describe('„Czego unikać” (02.11.2026)', () => {
  beforeEach(async () => { await fresh(); });
  test('karta w PL: nagłówek „Czego unikać”, brak „Częste błędy”', async () => {
    await render(<ExerciseCues exercise={{ lib: true, libKey: 'Deadlift (sztanga)' }} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Technika' }));
    expect(screen.getByRole('header', { name: 'Czego unikać' })).toBeTruthy();
    expect(screen.queryByText('Częste błędy')).toBeNull();
  });
  test('karta w EN: „What to avoid”', async () => {
    applyLang('en');
    await render(<ExerciseCues exercise={{ lib: true, libKey: 'Deadlift (sztanga)' }} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Technique' }));
    expect(screen.getByRole('header', { name: 'What to avoid' })).toBeTruthy();
    expect(t('Czego unikać')).toBe('What to avoid');
  });
  test('kod źródłowy: stary nagłówek nie występuje w komponencie karty ani w eksporcie strony; słownik EN nie ma starego klucza', () => {
    for (const f of ['components/ExerciseCues.tsx', 'scripts/strona/eksport.mjs', 'lib/i18n.en.ts']) expect([f, /t\('Częste błędy'\)|'Częste błędy':/.test(fs.readFileSync(path.join(root, f), 'utf8'))]).toEqual([f, false]);
    expect(fs.readFileSync(path.join(root, 'components/ExerciseCues.tsx'), 'utf8')).toContain("t('Czego unikać')");
    expect(fs.readFileSync(path.join(root, 'scripts/strona/eksport.mjs'), 'utf8')).toContain("t('Czego unikać')");
  });
});
