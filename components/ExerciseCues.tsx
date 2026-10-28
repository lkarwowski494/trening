import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/AppText';
import { useTheme, TEXT_SCALE_MAX, GLYPH_SCALE_MAX, FW, font } from '@/lib/theme';
import { t, lang } from '@/lib/i18n';
import { cuesFor, cueText, generalCuesReviewed, type CueSection } from '@/lib/cues';
import { catalogKey } from '@/lib/seed';
import { figureSpec } from '@/lib/figures/v2';
import { cueSelection, generalCueNote } from '@/lib/figures/v2/cueSets';
import { hasTechnique } from '@/lib/figures/v2/ui';
import { ExerciseFigureV2 } from '@/components/ExerciseFigureV2';
import { useRouter } from 'expo-router';
import { Btn } from '@/components/ui';
import type { Exercise } from '@/lib/seed';
import { ExerciseFigure } from '@/components/ExerciseFigure';
import { needsSafety, needsSpotter, needsSpotterDb } from '@/lib/equipment';

/*
 * Sekcja „Technika” w podglądzie ćwiczenia (wskazówki techniki, etap 1 — decyzja właściciela 08.10.2026 ok. 23:50; dane: lib/cues).
 * Zwinięta na starcie (ekran ćwiczenia zostaje krótki); nagłówek to przycisk z accessibilityState.expanded, treść — zwykły tekst
 * czytany przez VoiceOver (punkty bez znaku „•” w etykiecie) głosem języka aplikacji (accessibilityLanguage — audyt kontrolny 1 A11N-01). Kolory z motywu. Ćwiczenia bez wskazówek (własne, spoza bazowych) — nic.
 * Nad tekstem figura ruchu (etap 2–3, components/ExerciseFigure.tsx), gdy ćwiczenie ją ma.
 * Stopka: tylko odesłanie do specjalisty — aplikacja nie udziela porad medycznych (CLAUDE.md). Podstawa wskazówek (rodzaje źródeł) — nie przy ćwiczeniu, lecz na ekranie
 * Ustawienia → „Źródła wiedzy” (decyzja właściciela 23.10.2026, docs/18); pełna lista organizacji w docs/research/27.
 */
const LABEL: Record<CueSection, () => string> = { setup: () => t('Ustawienie'), move: () => t('Ruch'), tips: () => t('Wskazówki'), mistakes: () => t('Częste błędy') };

export function ExerciseCues({ exercise, initialOpen }: { exercise: Pick<Exercise, 'lib' | 'libKey' | 'recommended' | 'catalogRev'>; /** UX2-05: otwarte z „Technika ›” (trening, szablon) — od razu rozwinięte */ initialOpen?: boolean }) {
  const th = useTheme(); const [open, setOpen] = useState(!!initialOpen);
  const c = cuesFor(exercise); const safety: SafetyKind | null = needsSafety(exercise) ? 'rack' : needsSpotter(exercise) ? 'spotter' : needsSpotterDb(exercise) ? 'spotter_db' : null;
  /* grafiki 1.0 (25.10.2026, wariant A): figura v2 tam, gdzie istnieje rodzina ruchu (zastępuje v1); zestaw ogólny wskazówek wzorca z dopiskiem przy ćwiczeniach-analogiach — na razie tylko dla ćwiczeń z gotową rodziną v2 (reszta rodzin: kolejne etapy) */
  const key = catalogKey(exercise); const v2 = !!key && !!figureSpec(key);
  const sel = key ? cueSelection(key) : null; const note = sel ? generalCueNote(sel) : null;
  const gen = v2 && sel && sel.mode === 'general' && !!key && generalCuesReviewed(key) /* bramka 4 dla treści (M1-audytor-generalny-038) */ ? ([['tips', sel.ok], ['mistakes', sel.err]] as [CueSection, string[]][]).map(([id, ids]) => ({ id, items: ids.map(x => cueText(x, lang())).filter((x, i) => x !== ids[i]) })).filter(s => s.items.length) : [];
  const sections = c ? c.sections : gen;
  if (!c && !v2 && !sections.length) return safety ? <SafetyNote kind={safety} /> : null;
  return (
    <View testID="exercise-cues" style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: th.line, marginBottom: 14 }}>
      <Pressable accessibilityLanguage={lang()} testID="exercise-cues-toggle" onPress={() => setOpen(o => !o)} accessibilityRole="button" accessibilityLabel={t('Technika')} accessibilityHint={t('Ustawienie, ruch, wskazówki i częste błędy.')} accessibilityState={{ expanded: open }} hitSlop={4} style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center' }}>
        <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, ...font('body'), ...FW.semibold, flex: 1 }}>{t('Technika')}</Text>
        <Text importantForAccessibility="no" accessibilityElementsHidden maxFontSizeMultiplier={GLYPH_SCALE_MAX} style={{ color: th.muted, ...font('body'), ...FW.regular }}>{open ? '▾' : '▸'}</Text>
      </Pressable>
      {safety ? <SafetyNote kind={safety} inside /> /* widoczne także przy zwiniętej sekcji */ : null}
      {open ? <View style={{ paddingBottom: 12 }}>
        {v2 ? <ExerciseFigureV2 exercise={exercise} /> : <ExerciseFigure exercise={exercise} />}
        {note && sections.length ? <Text testID="exercise-cues-general-note" accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.muted, ...font('footnote'), ...FW.semibold, marginTop: 8 }}>{note}</Text> : null}
        {sections.map(s => <View key={s.id} style={{ marginTop: 8 }}>
          <Text accessibilityLanguage={lang()} accessibilityRole="header" maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.muted, ...font('footnote'), ...FW.semibold, marginBottom: 2 }}>{LABEL[s.id]()}</Text>
          {s.items.map((x, i) => <Text accessibilityLanguage={lang()} key={i} accessibilityLabel={x} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, ...font('callout'), ...FW.regular, lineHeight: 21, marginTop: 2 }}>{`• ${x}`}</Text>)}
        </View>)}
        <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.muted, ...font('footnote'), ...FW.regular, marginTop: 10 }}>{t('Aplikacja nie udziela porad medycznych. Przy bólu, urazie lub chorobie skonsultuj się z lekarzem lub fizjoterapeutą.')}</Text>
      </View> : null}
    </View>
  );
}

/**
 * Zdanie o asekuracji (audyt M1-015): ćwiczenia, przy których katalog zaleca ramiona asekuracyjne (sztanga nad ciałem lub na barkach). Treść ostrożna, bez liczb;
 * źródła i brzmienie do weryfikacji przez badacza merytorycznego (docs/10, „Asekuracja”). Ćwiczenie bez wskazówek techniki dostaje samą ramkę; ze wskazówkami —
 * zdanie na początku rozwiniętej sekcji „Technika”. M1-031 (NSCA 2017 Standard 3.2): dwa warianty — „rack” (stojaki z ramionami oraz osoba; recommended rack.safeties)
 * i „spotter” (sama osoba asekurująca; ćwiczenia, przy których katalog nie przewiduje stojaków — CATALOG_SPOTTER); M1-031 cz. 2 (DEC-08): „spotter_db” — hantle nad głową lub twarzą (CATALOG_SPOTTER_DB). Źródło i lista: docs/10, „Asekuracja”.
 */
type SafetyKind = 'rack' | 'spotter' | 'spotter_db';
function SafetyNote({ inside, kind }: { inside?: boolean; kind: SafetyKind }) {
  const th = useTheme();
  return (
    <View testID="exercise-safety" style={inside ? { marginTop: 4, paddingBottom: 10 } : { borderTopWidth: 1, borderBottomWidth: 1, borderColor: th.line, marginBottom: 14, paddingVertical: 10 }}>
      <Text accessibilityLanguage={lang()} accessibilityRole="header" maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.muted, ...font('footnote'), ...FW.semibold, marginBottom: 2 }}>{t('Asekuracja')}</Text>
      <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, ...font('callout'), ...FW.regular, lineHeight: 21 }}>{kind === 'rack' ? t('Ćwiczenie ze sztangą na tułowiu lub nad głową i twarzą: zalecana asekuracja — stojaki z ramionami asekuracyjnymi oraz osoba asekurująca.') : kind === 'spotter' ? t('Ćwiczenie ze sztangą na tułowiu lub nad głową i twarzą: zalecana osoba asekurująca.') : t('Ćwiczenie z hantlami nad głową lub twarzą: zalecana osoba asekurująca.')}</Text>
    </View>
  );
}

/**
 * UX2-05 (audyt kontrolny 1, wariant A+B): „Technika ›” przy ćwiczeniu w treningu na żywo, w podglądzie i w edytorze szablonu — otwiera podgląd
 * ćwiczenia z rozwiniętą sekcją „Technika” na górze (`?cues=1`); ten sam komponent wskazówek i figury, bez kopii treści. Tylko ćwiczenia, które mają
 * wskazówki (lib/cues.hasCues — bez wczytywania słowników). Przejście z blokadą podwójnego tapnięcia (Btn nav, UI2-02).
 */
export function TechniqueLink({ exercise, name }: { exercise: Pick<Exercise, 'id' | 'lib' | 'libKey'> | null | undefined; /** nazwa w etykiecie VoiceOver (z numerem wystąpienia, gdy ćwiczenie powtarza się) */ name: string }) {
  const router = useRouter(); if (!exercise || !hasTechnique(exercise)) return null;
  return <Btn nav small kind="ghost" title={`${t('Technika')} ›`} accessibilityLabel={t('Technika: {name}', { name })} onPress={() => router.push(`/exercise/${exercise.id}?cues=1`)} />;
}
