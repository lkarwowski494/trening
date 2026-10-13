import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Btn, Input, Muted } from '@/components/ui';
import { shiftDate } from '@/lib/edit';
import { t } from '@/lib/i18n';

/**
 * Docs/12: data, godzina startu i czas trwania treningu — w edytorze historii i przy dodawaniu treningu wstecz. Zwykłe pola tekstowe
 * (bez natywnego kalendarza — brak dodatkowego modułu natywnego); poprawność sprawdza edit.parseWhen przy zapisie / „Dalej”.
 */
/** Wzorzec „data” (docs/32 wzorzec 22): jedno pole daty w całej aplikacji — tekst RRRR-MM-DD ze strzałkami „Dzień wcześniej / później” (‹ ›). */
export function DateField({ value, onChange, label, placeholder = '2026-09-30' }: { value: string; onChange: (v: string) => void; label: string; placeholder?: string }) {
  return (
    <>
      <Muted style={s.label}>{label}</Muted>
      <View style={s.row}>
        <Btn title="‹" small accessibilityLabel={t('Dzień wcześniej')} onPress={() => onChange(shiftDate(value, -1))} style={s.arrow} />
        <View style={{ flex: 1 }}><Input value={value} onChangeText={onChange} accessibilityLabel={label} placeholder={placeholder} keyboardType="numbers-and-punctuation" maxLength={10} autoCorrect={false} center /></View>
        <Btn title="›" small accessibilityLabel={t('Dzień później')} onPress={() => onChange(shiftDate(value, 1))} style={s.arrow} />
      </View>
    </>
  );
}
export function WhenFields({ date, time, min, onChange }: { date: string; time: string; min: string; onChange: (p: Partial<{ date: string; time: string; min: string }>) => void }) {
  return (
    <View style={{ marginBottom: 6 }}>
      <DateField value={date} onChange={v => onChange({ date: v })} label={t('Data (RRRR-MM-DD)')} />
      <View style={[s.row, { marginTop: 10 }]}>
        <View style={{ flex: 1 }}><Muted style={s.label}>{t('Godzina startu')}</Muted><Input value={time} onChangeText={v => onChange({ time: v })} accessibilityLabel={t('Godzina startu')} placeholder="18:00" keyboardType="numbers-and-punctuation" maxLength={5} autoCorrect={false} center /></View>
        <View style={{ flex: 1 }}><Muted style={s.label}>{t('Czas trwania (min)')}</Muted><Input value={min} onChangeText={v => onChange({ min: v })} accessibilityLabel={t('Czas trwania (min)')} placeholder="60" keyboardType="number-pad" maxLength={4} center /></View>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  label: { marginBottom: 5, fontSize: 13 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  arrow: { minWidth: 44, minHeight: 44 },
});
