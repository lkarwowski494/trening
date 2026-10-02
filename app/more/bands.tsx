import React, { useRef } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { Screen, Input, NumInput, Btn, Muted, Empty, useOnce } from '@/components/ui';
import { getState, useTick, save, bandColor } from '@/lib/store';
import { base } from '@/lib/seed';
import { useTheme } from '@/lib/theme';
import { t } from '@/lib/i18n';

export default function Bands() {
  useTick(); const st = getState(); const th = useTheme(); const once = useOnce();
  // Kolejność ustalana przy wejściu (i dla nowych na końcu) — wiersz nie „skacze” pod palcem przy zmianie poziomu (runda 3).
  const order = useRef<string[]>([...st.bands].sort((a, b) => a.level - b.level).map(b => b.id));
  st.bands.forEach(b => { if (!order.current.includes(b.id)) order.current.push(b.id); });
  const bands = order.current.map(id => st.bands.find(b => b.id === id)).filter((b): b is NonNullable<typeof b> => !!b);
  const colors = useRef(new Map(st.bands.map(b => [b.id, b.color])));
  return (
    <Screen><ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets contentContainerStyle={{ paddingVertical: 10, paddingBottom: 120 }}>
      <Muted style={{ marginBottom: 10 }}>{t('Kolor i poziom trudności: 1 = cienka, 7 = bardzo gruba. Gumy nie mają kilogramów — przy serii zapisujesz, którą gumą pomagałeś. Rekordem są powtórzenia bez gumy, a postęp z gumą to zejście na niższy poziom.')}</Muted>
      {bands.map(b => (
        <View key={b.id} style={{ flexDirection: 'row', gap: 8, alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: th.line }}>
          <View style={{ flex: 1 }}><Input maxLength={30} selectTextOnFocus value={b.color ? bandColor(b) : ''} onChangeText={v => { b.color = v; save(b); }} onEndEditing={() => { const c = b.color.replace(/\s+/g, ' ').trim(); /* runda 53: jak nazwy */ if (!c) { b.color = colors.current.get(b.id) || t('nowa'); save(b); } else { if (c !== b.color) { b.color = c; save(b); } colors.current.set(b.id, c); } /* runda 49 */ }} placeholder={t('kolor')} accessibilityLabel={t('Kolor gumy')} /></View>
          <View style={{ width: 56 }}><NumInput value={b.level} onNum={v => { if (v === '') return; b.level = Math.min(7, Math.max(1, Math.round(v))); save(b); }} accessibilityLabel={t('Poziom (1–7)')} accessibilityHint={bandColor(b)} /></View>
          <Btn title="✕" small kind="ghost" accessibilityLabel={t('Usuń gumę')} accessibilityHint={bandColor(b)} onPress={() => Alert.alert(t('Usunąć gumę?'), [st.workouts.some(w => w.exercises.some(e => e.sets.some(s => s.bandId === b.id))) ? t('W historii serie z tą gumą pokażą „?”.') : '', st.active?.exercises.some(e => e.sets.some(s => s.bandId === b.id)) ? t('W trwającym treningu guma zniknie z nieodhaczonych serii.') : ''].filter(Boolean).join(' ') || undefined, [{ text: t('Nie') }, { text: t('Usuń'), style: 'destructive', onPress: () => { st.bands = st.bands.filter(x => x.id !== b.id); /* runda 48: trening w toku nie trzyma usuniętej gumy */ st.active?.exercises.forEach(e => e.sets.forEach(s => { if (s.bandId === b.id && !s.done /* T13: odhaczone serie zostają z gumą (pokażą „?”, jak w historii) — inaczej asystowane wyglądałyby na bez asysty i bił by się fałszywy rekord */) { s.bandId = ''; /* P-001: ±kg zostaje — guma nie ma kilogramów */ } })); save(); } }])} />
        </View>))}
      {bands.length ? null : <Empty>{t('Brak gum. Dodaj pierwszą, by zapisywać asystę przy podciąganiu.')}</Empty> /* runda 54 */}
      <Btn title={t('+ Guma')} block style={{ marginTop: 12 }} onPress={once(() => { st.bands.push({ ...base(st.ownerId), color: t('nowa'), level: 3, nominalKg: '' }); save(); })} />
    </ScrollView></Screen>
  );
}
