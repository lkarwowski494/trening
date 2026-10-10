import React, { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Btn, Item, useOnce } from '@/components/ui';
import { useTheme, F, TEXT_SCALE_MAX } from '@/lib/theme';
import { startEmpty, fmtDate, fmtDayKey } from '@/lib/store';
import { startTemplate, startRepeatLast } from '@/lib/start';
import { mainStart, otherStarts, type MainStart, type OtherStart } from '@/lib/home';
import { dayKeyOf, addDays } from '@/lib/plan';
import { t, tp, lang } from '@/lib/i18n';

/*
 * Ekran główny, układ B (decyzja właściciela 09.10.2026; docs/18): duży przycisk startu zależny od sytuacji (reguła — lib/home.ts mainStart)
 * i „Inny trening” — arkusz od dołu z pozostałymi sposobami startu (lib/home.ts otherStarts). Pod kartą „Dziś”, zamiast dawnego małego „Start”
 * w karcie (rozstrzygnięcie: karta zostaje informacją o tygodniu, akcja startu jest pełnej szerokości i łatwa do trafienia — opis w raporcie).
 * Samodzielny komponent — można go przenieść bez zmian.
 */
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
  const m = mainStart(); const x = mainText(m);
  const go = () => { if (m.kind === 'plan' || m.kind === 'planNext' || m.kind === 'next') startTemplate(m.tpl); else if (m.kind === 'empty') startEmpty(); else router.push('/'); };
  const others = open ? otherStarts(m) : [];
  const pick = (f: () => void) => once(() => { setOpen(false); f(); });
  const row = (o: OtherStart) => {
    switch (o.kind) {
      case 'planOther': return <Item key="plan" title={t('Inny z planu')} sub={t('{name} · w planie na: {day}', { name: o.tpl.name, day: dayWord(o.date) })} accessibilityLabel={t('Inny z planu: {name}', { name: o.tpl.name })} onPress={pick(() => startTemplate(o.tpl))} />;
      case 'repeat': return <Item key="repeat" title={t('Powtórz ostatni')} sub={`${o.name || t('bez szablonu')} · ${fmtDate(o.date)}`} /* właściciel 09.10.2026 ok. 16:20: podpis nazwa · data (dawna sekcja „Ostatni trening”) */ accessibilityLabel={t('Powtórz ostatni ({name})', { name: o.name || t('bez szablonu') })} onPress={pick(() => startRepeatLast())} />;
      case 'template': return <Item key="tpl" title={t('Z szablonu')} sub={(n => `${n} ${tp(n, 'szablon|szablony|szablonów')}`)(o.count)} accessibilityLabel={t('Z szablonu')} onPress={pick(() => router.push('/templates'))} />;
      default: return <Item key="empty" title={t('Pusty trening')} accessibilityLabel={t('Pusty trening')} onPress={pick(() => startEmpty())} />;
    }
  };
  return (
    <View testID="start-panel" style={{ marginTop: 10, gap: 8 }}>
      <Pressable accessibilityLanguage={lang()} testID="start-main" accessibilityRole="button" accessibilityLabel={x.label} onPress={once(go)}
        style={({ pressed }) => ({ minHeight: 56, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, backgroundColor: th.accent, opacity: pressed ? 0.8 : 1, flexDirection: 'row', alignItems: 'center', gap: 10 })}>
        <View style={{ flex: 1 }}>
          <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.accentInk, fontFamily: F.heavy, fontSize: 18 }}>{x.title}</Text>
          {x.sub ? <Text accessibilityLanguage={lang()} maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.accentInk, fontFamily: F.regular, fontSize: 13, marginTop: 2 }}>{x.sub}</Text> : null}
        </View>
        <Text accessibilityElementsHidden importantForAccessibility="no" style={{ color: th.accentInk, fontFamily: F.semibold, fontSize: 22 }}>›</Text>
      </Pressable>
      {m.kind !== 'resume' ? <Btn block title={t('Inny trening')} accessibilityLabel={t('Inny trening')} accessibilityHint={t('Inny z planu, powtórz ostatni, z szablonu albo pusty.')} onPress={() => setOpen(true)} /> : null}
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)} accessibilityViewIsModal>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Pressable accessibilityLanguage={lang()} accessibilityRole="button" accessibilityLabel={t('Zamknij')} onPress={() => setOpen(false)} style={{ ...{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }, backgroundColor: 'rgba(0,0,0,0.4)' }} />
          <View testID="other-sheet" style={{ backgroundColor: th.surface, borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 34 }}>
            <View style={{ alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: th.line, marginBottom: 8 }} accessibilityElementsHidden importantForAccessibility="no" />
            <Text accessibilityLanguage={lang()} accessibilityRole="header" maxFontSizeMultiplier={TEXT_SCALE_MAX} style={{ color: th.text, fontFamily: F.heavy, fontSize: 17, marginBottom: 4 }}>{t('Inny trening')}</Text>
            {others.map(row)}
            <Btn title={t('Anuluj')} kind="ghost" block onPress={() => setOpen(false)} style={{ marginTop: 8 }} />
          </View>
        </View>
      </Modal>
    </View>);
}
