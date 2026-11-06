/*
 * Regresja MER2-07 „podpis i teksty karty każdego ćwiczenia w każdym języku bez nazw źródeł” — wspólny kod grup (06.11.2026, lekcja L-110 w docs/40).
 * Powód podziału na pliki: RNTL 14 zostawia ok. 160 KB sterty na każdą otwartą kartę po unmount; render ~215 kart × 35 języków w jednym procesie Jest
 * kończył się „heap out of memory” w CI (tests.yml 42159848532, część Jest 2) mimo podziału na test na język. Każda grupa
 * (tests/audit-k1-bl-mer-podpisy1…N.test.tsx) biegnie w świeżym procesie roboczym, więc pamięć nie kumuluje się między grupami.
 * Zakres bez zmian: każdy język z LANGS × każde ćwiczenie z CUE_DATA, zero nazw źródeł; strażnik sumy grup: tests/audit-k1-bl-mer-podpisy-guard.test.ts.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { CUE_DATA } from '@/lib/cues';
import { ExerciseCues } from '@/components/ExerciseCues';
import { LANGS, applyLang, t } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';
import { fresh } from './helpers';

/** Nazwy organizacji i marek źródeł wskazówek — tylko w docs/research/27 (zasada właściciela 09.10.2026: nazwy innych firm nie w tekstach aplikacji). */
export const SOURCE_NAMES = /\b(ACE|NASM|ExRx|Stronger by Science|Concept ?2|acefitness|nasm\.org)\b/i;

/** Liczba plików grup (tests/audit-k1-bl-mer-podpisy1…N.test.tsx) — jedyne miejsce; zmiana wymaga dodania/usunięcia pliku (pilnuje strażnik). Pomiar 06.11.2026: docs/18. */
export const PODPISY_GRUPY = 7;
/** Języki grupy `k` (1…PODPISY_GRUPY): podział pozycyjny (co N-ty język), więc grupy są równe co do liczby języków (różnica ≤ 1). */
export const langsOfGroup = (k: number): Lang[] => LANGS.filter((_, i) => i % PODPISY_GRUPY === k - 1);

/** Definiuje testy grupy `k`: każdy jej język × każde ćwiczenie z kart — brak nazw źródeł w tekstach karty po otwarciu „Technika”. */
export function definePodpisyGroup(k: number) {
  beforeEach(async () => { await fresh(); });
  afterEach(() => { applyLang('pl'); });
  test('grupa ma języki', () => { expect(langsOfGroup(k).length).toBeGreaterThan(0); });
  test.each(langsOfGroup(k))('regresja: podpis i teksty karty każdego ćwiczenia w języku %s bez nazw źródeł', async (l) => {
    const bad: string[] = []; applyLang(l);
    for (const key of Object.keys(CUE_DATA.exercises)) {
      const { unmount } = await render(<ExerciseCues exercise={{ lib: true as const, libKey: key }} />);
      await fireEvent.press(screen.getByRole('button', { name: t('Technika') }));
      for (const x of screen.container.queryAll((n: { type: unknown }) => n.type === 'Text')) { const s = JSON.stringify(x.props.children); if (SOURCE_NAMES.test(s)) bad.push(`${l} ${key}: ${s.slice(0, 60)}`); }
      await unmount();
    }
    expect(bad).toEqual([]);
  }, 120000);
}
