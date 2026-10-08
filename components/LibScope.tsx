import React from 'react';
import { View } from 'react-native';
import { Chip, Muted } from '@/components/ui';
import { t } from '@/lib/i18n';

/**
 * Research biblioteki (decyzja właściciela 09.10.2026, wariant B — docs/18): filtr „Podstawowe” na liście Ćwiczeń, w wyborze ćwiczenia i w liście
 * „Inne” zamiany. Ten sam wzór co filtr miejsca („📍 Dom ✕” zdejmuje filtr, „+ 📍 Dom” przywraca; wybór zapamiętany): „Podstawowe ✕” — tylko
 * ćwiczenia ZOSTAJE, własne i już użyte; „+ Podstawowe” — wszystkie, także niszowe. Wyszukiwanie zawsze obejmuje całą bibliotekę.
 */
export function LibScopeChip({ all, hidden, searching, onToggle, compact }: { all: boolean; hidden: number; searching: boolean; onToggle: () => void; compact?: boolean }) {
  const chip = <Chip label={all ? `+ ${t('Podstawowe')}` : `${t('Podstawowe')} ✕`} on={!all} onPress={onToggle}
    a11yLabel={all ? t('Pokazane wszystkie ćwiczenia, także niszowe') : t('Filtr: podstawowe ćwiczenia')}
    a11yHint={all ? t('Tapnij, by zostawić podstawowe.') : t('Tapnij, by pokazać wszystkie.')} /* A11-18: instrukcja w podpowiedzi, jak filtr miejsca */ />;
  if (compact) return chip;
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginTop: 8 }}>
    {chip}
    <Muted style={{ fontSize: 12, flexShrink: 1 }}>{all ? t('wszystkie ćwiczenia, także niszowe') : searching ? t('wyszukiwanie obejmuje też niszowe') : t('niszowe ukryte: {n} — znajdziesz je wyszukiwaniem', { n: hidden })}</Muted>
  </View>;
}
