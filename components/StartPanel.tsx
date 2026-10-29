import React, { useRef, useState } from 'react';
import { Animated, Modal, PanResponder, Pressable, View } from 'react-native';
import { Text } from '@/components/AppText';
import { useRouter } from 'expo-router';
import { Btn, Item, Muted, useOnce } from '@/components/ui';
import { useTheme, TEXT_SCALE_MAX, GLYPH_SCALE_MAX, font, RADIUS, SIZE, SPACE } from '@/lib/theme';
import { fmtDate, fmtDayKey } from '@/lib/store';
import { startTemplate, startRepeatLast, startEmptyWorkout } from '@/lib/start';
import { mainStart, otherStarts, type MainStart, type OtherStart } from '@/lib/home';
import { dayKeyOf, addDays } from '@/lib/plan';
import { t, tp, lang } from '@/lib/i18n';
import { CloseButton } from '@/components/CloseButton';
import { useAccess } from '@/lib/entitlement';

/*
 * Ekran główny, układ B (decyzja właściciela 09.10.2026; docs/18): duży przycisk startu zależny od sytuacji (reguła — lib/home.ts mainStart)
 * i „Inny trening” — arkusz od dołu z pozostałymi sposobami startu (lib/home.ts otherStarts). Pod kartą „Dziś”, zamiast dawnego małego „Start”
 * w karcie (rozstrzygnięcie: karta zostaje informacją o tygodniu, akcja startu jest pełnej szerokości i łatwa do trafienia — opis w raporcie).
 * Samodzielny komponent — można go przenieść bez zmian.
 */
/** Przesunięcie w dół (pt), od którego arkusz „Inny trening” się zamyka (albo szybki gest, vy > 1). */
const SHEET_CLOSE_DY = 90;
const dayWord = (k: string) => (k === addDays(dayKeyOf(Date.now()), 1) ? t('jutro') : fmtDayKey(k));

function mainText(m: MainStart): { title: string; sub?: string; label: string } {
  switch (m.kind) {
    case 'resume': return { title: t('Wróć do treningu'), label: t('Wróć do treningu') };
    case 'plan': return { title: t('Start: {name}', { name: m.tpl.name }), sub: t('dziś w planie · {n} ćw.', { n: m.tpl.items.length }), label: t('Start zaplanowanego treningu: {name}', { name: m.tpl.name }) };
    case 'planNext': return { title: t('Start: {name}', { name: m.tpl.name }), sub: t('w planie na: {day} · {n} ćw.', { day: dayWord(m.date), n: m.tpl.items.length }), label: t('Start następnego treningu: {name}', { name: m.tpl.name }) };
    case 'next': return { title: t('Start: {name}', { name: m.tpl.name }), sub: m.after ? t('następny po: {name} · {n} ćw.', { name: m.after, n: m.tpl.items.length }) : `${m.tpl.items.length} ${t('ćw.')}`, label: t('Start następnego treningu: {name}', { name: m.tpl.name }) };
    default: return { title: t('Pusty trening'), sub: t('ćwiczenia dodasz w trakcie'), label: t('Pusty trening') };
  }
}

export function StartPanel() {
  const th = useTheme(); const router = useRouter(); const once = useOnce(); const [open, setOpen] = useState(false);
  const m = mainStart(); const x = mainText(m); const acc = useAccess(); /* M5 S1: licznik darmowych dni treningowych (tylko stan free przy włączonym przełączniku) */
  const go = () => { if (m.kind === 'plan' || m.kind === 'planNext' || m.kind === 'next') startTemplate(m.tpl); else if (m.kind === 'empty') startEmptyWorkout(); else router.push('/'); };
  const others = open ? otherStarts(m) : [];
  /* 04-studio-projektowe-007: arkusz „Inny trening” zamyka się też gestem w dół (jak arkusze systemowe) — tylko dodatkowo, przycisk „Anuluj” zostaje (zasada 13.10.2026, tests/close-button-guard) */
  const dy = useRef(new Animated.Value(0)).current; const closeRef = useRef(() => {}); closeRef.current = () => { setOpen(false); };
  const pan = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dy > 8 && Math.abs(g.dy) > Math.abs(g.dx) * 1.5,
    onPanResponderMove: (_, g) => { dy.setValue(Math.max(0, g.dy)); },
    onPanResponderRelease: (_, g) => { if (g.dy > SHEET_CLOSE_DY || g.vy > 1) { closeRef.current(); dy.setValue(0); } else Animated.spring(dy, { toValue: 0, useNativeDriver: true }).start(); },
    onPanResponderTerminate: () => { Animated.spring(dy, { toValue: 0, useNativeDriver: true }).start(); },
  })).current;
  const pick = (f: () => void) => once(() => { setOpen(false); f(); });
  const row = (o: OtherStart) => {
    switch (o.kind) {
      case 'planOther': return <Item key="plan" title={t('Inny z planu')} sub={t('{name} · w planie na: {day}', { name: o.tpl.name, day: dayWord(o.date) })} accessibilityLabel={t('Inny z planu: {name}', { name: o.tpl.name })} onPress={pick(() => startTemplate(o.tpl))} />;
      case 'repeat': return <Item key="repeat" title={t('Powtórz ostatni')} sub={`${o.name || t('bez szablonu')} · ${fmtDate(o.date)}`} /* właściciel 09.10.2026 ok. 16:20: podpis nazwa · data (dawna sekcja „Ostatni trening”) */ accessibilityLabel={t('Powtórz ostatni ({name})', { name: o.name || t('bez szablonu') })} onPress={pick(() => startRepeatLast())} />;
      case 'template': return <Item key="tpl" title={t('Z szablonu')} /* P2 B (11.10.2026): pełnoekranowy wybór szablonu ze „Startem” (app/pick-template.tsx), nie zakładka Szablony */ sub={(n => `${n} ${tp(n, 'szablon|szablony|szablonów')}`)(o.count)} accessibilityLabel={t('Z szablonu')} onPress={pick(() => router.push('/pick-template'))} />;
      default: return <Item key="empty" title={t('Pusty trening')} accessibilityLabel={t('Pusty trening')} onPress={pick(() => startEmptyWorkout())} />;
    }
  };
  return (
    <View testID="start-panel" style={{ marginTop: 10, gap: 8 }}>
      <Pressable accessibilityLanguage={lang()} testID="start-main" accessibilityRole="button" accessibilityLabel={x.label} onPress={once(go)}
        style={({ pressed }) => ({ minHeight: SIZE.buttonPrimary, borderRadius: RADIUS.button, paddingVertical: SPACE.m, paddingHorizontal: SPACE.l, backgroundColor: th.accent, opacity: pressed ? 0.8 : 1, flexDirection: 'row', alignItems: 'center', gap: SPACE.m })}>
        <View style={{ flex: 1 }}>
          <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.accentInk, ...font('buttonPrimary') }}>{x.title}</Text>
          {x.sub ? <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.accentInk, ...font('footnote'), marginTop: 2 }}>{x.sub}</Text> : null}
        </View>
        <Text accessibilityElementsHidden importantForAccessibility="no" maxFontSizeMultiplier={GLYPH_SCALE_MAX} style={{ color: th.accentInk, ...font('sectionTitle') }}>›</Text>
      </Pressable>
      {m.kind !== 'resume' ? <Btn block title={t('Inny trening')} accessibilityLabel={t('Inny trening')} accessibilityHint={t('Inny z planu, powtórz ostatni, z szablonu albo pusty.')} onPress={() => setOpen(true)} /> : null}
      {m.kind !== 'resume' && acc.enabled && acc.level === 'free' && !acc.silent ? <Muted testID="start-free-days" style={{ textAlign: 'center' }}>{t('{left} {n} z {limit} darmowych dni treningowych w tym miesiącu.', { left: tp(acc.decision.remaining, 'Został|Zostały|Zostało'), n: acc.decision.remaining, limit: acc.decision.limit })}</Muted> : null}
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)} accessibilityViewIsModal>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Pressable testID="other-sheet-scrim" accessible={false} importantForAccessibility="no" onPress={() => setOpen(false)} /* tło: stuknięcie zamyka jako dodatek; przycisk „Anuluj” jest w nagłówku arkusza (zasada 13.10.2026) */ style={{ ...{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }, backgroundColor: 'rgba(0,0,0,0.4)' }} />
          <Animated.View testID="other-sheet" {...pan.panHandlers} style={{ backgroundColor: th.surface, borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingHorizontal: SPACE.l, paddingTop: SPACE.s, paddingBottom: 34, transform: [{ translateY: dy }] }}>
            <View style={{ alignSelf: 'center', width: 40, height: 5, borderRadius: RADIUS.marker, backgroundColor: th.line, marginBottom: SPACE.s }} accessibilityElementsHidden importantForAccessibility="no" />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <CloseButton onPress={() => setOpen(false)} />
              <Text accessibilityLanguage={lang()} accessibilityRole="header" maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ flex: 1, textAlign: 'center', color: th.text, ...font('sectionTitle') }}>{t('Inny trening')}</Text>
              <View style={{ width: 44 }} accessibilityElementsHidden importantForAccessibility="no" />{/* równowaga dla „Anuluj” po lewej — tytuł na środku */}
            </View>
            {others.map(row)}
          </Animated.View>
        </View>
      </Modal>
    </View>);
}
