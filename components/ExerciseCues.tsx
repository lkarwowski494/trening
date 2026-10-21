import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme, TEXT_SCALE_MAX, FW, font } from '@/lib/theme';
import { t, lang } from '@/lib/i18n';
import { cuesFor, hasCues, type CueSection, type CueBasisKind } from '@/lib/cues';
import { useRouter } from 'expo-router';
import { Btn } from '@/components/ui';
import type { Exercise } from '@/lib/seed';
import { ExerciseFigure } from '@/components/ExerciseFigure';
import { needsSafety } from '@/lib/equipment';

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

export function ExerciseCues({ exercise, initialOpen }: { exercise: Pick<Exercise, 'lib' | 'libKey' | 'recommended'>; /** UX2-05: otwarte z „Technika ›” (trening, szablon) — od razu rozwinięte */ initialOpen?: boolean }) {
  const th = useTheme(); const [open, setOpen] = useState(!!initialOpen);
  const c = cuesFor(exercise); const safety = needsSafety(exercise);
  if (!c) return safety ? <SafetyNote /> : null;
  return (
    <View testID="exercise-cues" style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: th.line, marginBottom: 14 }}>
      <Pressable accessibilityLanguage={lang()} testID="exercise-cues-toggle" onPress={() => setOpen(o => !o)} accessibilityRole="button" accessibilityLabel={t('Technika')} accessibilityHint={t('Ustawienie, ruch, wskazówki i częste błędy.')} accessibilityState={{ expanded: open }} hitSlop={4} style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center' }}>
        <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, ...font('body'), ...FW.semibold, flex: 1 }}>{t('Technika')}</Text>
        <Text importantForAccessibility="no" accessibilityElementsHidden style={{ color: th.muted, ...font('body'), ...FW.regular }}>{open ? '▾' : '▸'}</Text>
      </Pressable>
      {safety ? <SafetyNote inside /> /* widoczne także przy zwiniętej sekcji */ : null}
      {open ? <View style={{ paddingBottom: 12 }}>
        <ExerciseFigure exercise={exercise} />
        {c.sections.map(s => <View key={s.id} style={{ marginTop: 8 }}>
          <Text accessibilityLanguage={lang()} accessibilityRole="header" maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.muted, ...font('footnote'), ...FW.semibold, marginBottom: 2 }}>{LABEL[s.id]()}</Text>
          {s.items.map((x, i) => <Text accessibilityLanguage={lang()} key={i} accessibilityLabel={x} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, ...font('callout'), ...FW.regular, lineHeight: 21, marginTop: 2 }}>{`• ${x}`}</Text>)}
        </View>)}
        <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.muted, ...font('footnote'), ...FW.regular, marginTop: 10 }}>{t('Na podstawie: {list}. Własne sformułowania.', { list: c.basis.map(k => BASIS[k]()).join(', ') })}</Text>
        <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.muted, ...font('footnote'), ...FW.regular, marginTop: 4 }}>{t('Aplikacja nie udziela porad medycznych. Przy bólu, urazie lub chorobie skonsultuj się z lekarzem lub fizjoterapeutą.')}</Text>
      </View> : null}
    </View>
  );
}

/**
 * Zdanie o asekuracji (audyt M1-015): ćwiczenia, przy których katalog zaleca ramiona asekuracyjne (sztanga nad ciałem lub na barkach). Treść ostrożna, bez liczb;
 * źródła i brzmienie do weryfikacji przez badacza merytorycznego (docs/10, „Asekuracja”). Ćwiczenie bez wskazówek techniki dostaje samą ramkę; ze wskazówkami —
 * zdanie na początku rozwiniętej sekcji „Technika”.
 */
function SafetyNote({ inside }: { inside?: boolean }) {
  const th = useTheme();
  return (
    <View testID="exercise-safety" style={inside ? { marginTop: 4, paddingBottom: 10 } : { borderTopWidth: 1, borderBottomWidth: 1, borderColor: th.line, marginBottom: 14, paddingVertical: 10 }}>
      <Text accessibilityLanguage={lang()} accessibilityRole="header" maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.muted, ...font('footnote'), ...FW.semibold, marginBottom: 2 }}>{t('Asekuracja')}</Text>
      <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, ...font('callout'), ...FW.regular, lineHeight: 21 }}>{t('Ćwiczenie ze sztangą na tułowiu lub nad głową i twarzą: zalecana asekuracja — stojaki z ramionami asekuracyjnymi oraz osoba asekurująca.')}</Text>
    </View>
  );
}

/**
 * UX2-05 (audyt kontrolny 1, wariant A+B): „Technika ›” przy ćwiczeniu w treningu na żywo, w podglądzie i w edytorze szablonu — otwiera podgląd
 * ćwiczenia z rozwiniętą sekcją „Technika” na górze (`?cues=1`); ten sam komponent wskazówek i figury, bez kopii treści. Tylko ćwiczenia, które mają
 * wskazówki (lib/cues.hasCues — bez wczytywania słowników). Przejście z blokadą podwójnego tapnięcia (Btn nav, UI2-02).
 */
export function TechniqueLink({ exercise, name }: { exercise: Pick<Exercise, 'id' | 'lib' | 'libKey'> | null | undefined; /** nazwa w etykiecie VoiceOver (z numerem wystąpienia, gdy ćwiczenie powtarza się) */ name: string }) {
  const router = useRouter(); if (!exercise || !hasCues(exercise)) return null;
  return <Btn nav small kind="ghost" title={`${t('Technika')} ›`} accessibilityLabel={t('Technika: {name}', { name })} onPress={() => router.push(`/exercise/${exercise.id}?cues=1`)} />;
}
