import React, { useRef } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { Screen, Input, NumInput, Btn, Muted, Empty, useOnce } from '@/components/ui';
import { getState, useTick, save, bandColor, deleteBand } from '@/lib/store';
import { SwipeRow } from '@/components/SwipeRow';
import { BandColorInput } from '@/components/BandColorInput';
import { base } from '@/lib/seed';
import { useTheme } from '@/lib/theme';
import { t } from '@/lib/i18n';

export default function Bands() {
  useTick(); const st = getState(); const th = useTheme(); const once = useOnce();
  // Kolejność ustalana przy wejściu (i dla nowych na końcu) — wiersz nie „skacze” pod palcem przy zmianie poziomu (runda 3).
  const order = useRef<string[]>([...st.bands].sort((a, b) => a.level - b.level).map(b => b.id));
  st.bands.forEach(b => { if (!order.current.includes(b.id)) order.current.push(b.id); });
  const bands = order.current.map(id => st.bands.find(b => b.id === id)).filter((b): b is NonNullable<typeof b> => !!b);
  return (
    <Screen><ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets contentContainerStyle={{ paddingVertical: 10, paddingBottom: 120 }}>
      <Muted style={{ marginBottom: 10 }}>{t('Kolor i poziom trudności: 1 = cienka, 7 = bardzo gruba. Gumy nie mają kilogramów — przy serii zapisujesz, której gumy użyłeś. Guma jako asysta (np. podciąganie): rekordem są powtórzenia bez gumy, a postęp to zejście na niższy poziom. Guma jako opór: rekordy liczą serie z gumą.') /* MER-15 (audyt 0.10): prawdziwe dla asysty i oporu */}</Muted>
      {bands.map(b => (
        <SwipeRow key={b.id} label={t('Usuń gumę: {name}', { name: bandColor(b) })} title={t('Usunąć gumę?')} message={[st.workouts.some(w => w.exercises.some(e => e.sets.some(s => s.bandId === b.id))) ? t('W historii serie z tą gumą pokażą „?”.') : '', st.active?.exercises.some(e => e.sets.some(s => s.bandId === b.id)) ? t('W trwającym treningu guma zniknie z nieodhaczonych serii.') : ''].filter(Boolean).join(' ') || undefined} onDelete={() => deleteBand(b.id)}>{a11y => <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: th.line }}>
          <View style={{ flex: 1 }}><BandColorInput band={b} a11y={a11y} accessibilityLabel={t('Kolor gumy')} /* G2 (audyt 0.10): wspólne pole z poziomami gum w miejscu */ /></View>
          <View style={{ width: 56 }}><NumInput value={b.level} onNum={v => { if (v === '') return; b.level = Math.min(7, Math.max(1, Math.round(v))); save(b); }} accessibilityLabel={t('Poziom (1–7)')} accessibilityHint={bandColor(b)} /></View>
        </View>}</SwipeRow>))}
      {bands.length ? null : <Empty>{t('Brak gum. Dodaj pierwszą, by zapisywać asystę przy podciąganiu.')}</Empty> /* runda 54 */}
      <Btn title={t('+ Guma')} block style={{ marginTop: 12 }} onPress={once(() => { st.bands.push({ ...base(st.ownerId), color: t('nowa'), level: 3 }); save(); })} />
    </ScrollView></Screen>
  );
}
