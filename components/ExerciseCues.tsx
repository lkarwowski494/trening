import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme, F } from '@/lib/theme';
import { t, lang } from '@/lib/i18n';
import { cuesFor, type CueSection, type CueBasisKind } from '@/lib/cues';
import type { Exercise } from '@/lib/seed';
import { ExerciseFigure } from '@/components/ExerciseFigure';

/*
 * Sekcja „Technika” w podglądzie ćwiczenia (wskazówki techniki, etap 1 — decyzja właściciela 08.10.2026 ok. 23:50; dane: lib/cues).
 * Zwinięta na starcie (ekran ćwiczenia zostaje krótki); nagłówek to przycisk z accessibilityState.expanded, treść — zwykły tekst
 * czytany przez VoiceOver (punkty bez znaku „•” w etykiecie) głosem języka aplikacji (accessibilityLanguage — audyt kontrolny 1 A11N-01). Kolory z motywu. Ćwiczenia bez wskazówek (własne, spoza bazowych) — nic.
 * Nad tekstem figura ruchu (etap 2–3, components/ExerciseFigure.tsx), gdy ćwiczenie ją ma.
 * Stopka: na czym oparte — rodzaje źródeł opisane ogólnie, bez nazw organizacji i marek (audyt kontrolny 1 MER2-07 = SEC2-02, decyzja właściciela
 * 09.10.2026 wariant A; pełna lista w docs/research/27) — i odesłanie do specjalisty — aplikacja nie udziela porad medycznych (CLAUDE.md).
 */
const BASIS: Record<CueBasisKind, () => string> = { org: () => t('biblioteki ćwiczeń organizacji szkoleniowych'), site: () => t('specjalistyczne serwisy treningowe'), maker: () => t('materiały producenta sprzętu'), study: () => t('badania naukowe') };
const LABEL: Record<CueSection, () => string> = { setup: () => t('Ustawienie'), move: () => t('Ruch'), tips: () => t('Wskazówki'), mistakes: () => t('Częste błędy') };

export function ExerciseCues({ exercise }: { exercise: Pick<Exercise, 'lib' | 'libKey'> }) {
  const th = useTheme(); const [open, setOpen] = useState(false);
  const c = cuesFor(exercise); if (!c) return null;
  return (
    <View testID="exercise-cues" style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: th.line, marginBottom: 14 }}>
      <Pressable accessibilityLanguage={lang()} testID="exercise-cues-toggle" onPress={() => setOpen(o => !o)} accessibilityRole="button" accessibilityLabel={t('Technika')} accessibilityHint={t('Ustawienie, ruch, wskazówki i częste błędy.')} accessibilityState={{ expanded: open }} hitSlop={4} style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center' }}>
        <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.6} style={{ color: th.text, fontSize: 16, fontFamily: F.semibold, flex: 1 }}>{t('Technika')}</Text>
        <Text importantForAccessibility="no" accessibilityElementsHidden style={{ color: th.muted, fontSize: 16, fontFamily: F.regular }}>{open ? '▾' : '▸'}</Text>
      </Pressable>
      {open ? <View style={{ paddingBottom: 12 }}>
        <ExerciseFigure exercise={exercise} />
        {c.sections.map(s => <View key={s.id} style={{ marginTop: 8 }}>
          <Text accessibilityLanguage={lang()} accessibilityRole="header" maxFontSizeMultiplier={1.6} style={{ color: th.muted, fontSize: 13, fontFamily: F.semibold, marginBottom: 2 }}>{LABEL[s.id]()}</Text>
          {s.items.map((x, i) => <Text accessibilityLanguage={lang()} key={i} accessibilityLabel={x} maxFontSizeMultiplier={1.8} style={{ color: th.text, fontSize: 15, fontFamily: F.regular, lineHeight: 21, marginTop: 2 }}>{`• ${x}`}</Text>)}
        </View>)}
        <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.6} style={{ color: th.muted, fontSize: 12, fontFamily: F.regular, marginTop: 10 }}>{t('Na podstawie: {list}. Własne sformułowania.', { list: c.basis.map(k => BASIS[k]()).join(', ') })}</Text>
        <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={1.6} style={{ color: th.muted, fontSize: 12, fontFamily: F.regular, marginTop: 4 }}>{t('Aplikacja nie udziela porad medycznych. Przy bólu, urazie lub chorobie skonsultuj się z lekarzem lub fizjoterapeutą.')}</Text>
      </View> : null}
    </View>
  );
}
