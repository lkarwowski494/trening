import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Btn, Chip, Muted, Txt, H2 } from '@/components/ui';
import { getState, startFromTemplate, useTick } from '@/lib/store';
import { plannedOn, isChanged, shiftPlan, moveOnly, swapDays, setDayPlan, resetDay, addDays, dayKeyOf, type ShiftResult } from '@/lib/plan';
import { t, locale } from '@/lib/i18n';

/*
 * Panel wybranego dnia w Kalendarzu (priorytet właściciela 08.10.2026): co jest zaplanowane i co z tym zrobić.
 * Dwa tryby przesuwania (decyzja właściciela): „Przesuń plan o 1 dzień” — łańcuch tylko do pierwszego wolnego dnia; „Przesuń tylko ten trening”
 * — na wybrany dzień, a na dzień z innym treningiem tylko po wyraźnym poleceniu („Zamień miejscami”).
 */
const tplName = (id: string | null) => (id ? getState().templates.find(x => x.id === id)?.name ?? '' : '');
const dateOf = (k: string) => new Date(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10));
export const shortDay = (k: string) => dateOf(k).toLocaleDateString(locale(), { weekday: 'short', day: 'numeric', month: 'numeric' });
const longDay = (k: string) => dateOf(k).toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long' });
/** Opis wyniku przesunięcia planu: „Upper A → pt. 9.10, Upper B → sob. 10.10”. */
export const shiftSummary = (r: ShiftResult) => r.moved.map(m => `${tplName(m.id)} → ${shortDay(m.to)}`).join(', ') + (r.dropped ? ` · ${t('wypada: {name}', { name: tplName(r.dropped) })}` : '');

export function DayPanel({ day }: { day: string }) {
  useTick(); const router = useRouter(); const today = dayKeyOf(Date.now());
  const id = plannedOn(day); const changed = isChanged(day); const past = day < today; const hasActive = !!getState().active;
  const [mode, setMode] = useState<'none' | 'move' | 'pick'>('none');
  const live = getState().templates.filter(x => !x.archived);
  const start = () => { const tpl = getState().templates.find(x => x.id === id); if (!tpl) return; startFromTemplate(tpl); router.navigate('/'); };
  const shift = () => { const r = shiftPlan(day); setMode('none'); if (r.moved.length) Alert.alert(t('Plan przesunięty'), shiftSummary(r)); };
  const moveTo = (to: string) => {
    const r = moveOnly(day, to); setMode('none'); if (r.ok) return;
    Alert.alert(t('Ten dzień jest zajęty'), t('{day}: {name}. Bez Twojej zgody nie przesuwam na dzień z innym treningiem.', { day: longDay(to), name: tplName(r.conflict) }), [
      { text: t('Anuluj'), style: 'cancel' }, { text: t('Zamień miejscami'), onPress: () => swapDays(day, to) },
    ]);
  };
  const targets = past ? [today] : Array.from({ length: 7 }, (_, i) => addDays(day, i + 1));
  return (
    <View testID="day-panel" style={{ marginBottom: 10 }}>
      <H2>{longDay(day)}</H2>
      <Txt style={{ fontSize: 15 }}>{id ? (past ? t('Opuszczony: {name}', { name: tplName(id) }) : t('Zaplanowany: {name}', { name: tplName(id) })) : t('Wolne')}{changed ? ` · ${t('zmiana planu')}` : ''}</Txt>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
        {id && day === today && !hasActive ? <Btn small kind="primary" title={t('Start')} accessibilityLabel={t('Start zaplanowanego treningu: {name}', { name: tplName(id) })} onPress={start} /> : null}
        {id && !past ? <Btn small title={t('Przesuń plan o 1 dzień')} onPress={shift} /> : null}
        {id ? <Btn small title={past ? t('Przenieś na dziś') : t('Przesuń tylko ten trening')} onPress={() => (past ? moveTo(today) : setMode(mode === 'move' ? 'none' : 'move'))} /> : null}
        {!past ? <Btn small title={id ? t('Inny trening') : t('Dodaj trening')} onPress={() => setMode(mode === 'pick' ? 'none' : 'pick')} /> : null}
        {id && !past ? <Btn small kind="ghost" title={t('Wolne w tym dniu')} onPress={() => setDayPlan(day, null)} /> : null}
        {changed ? <Btn small kind="ghost" title={t('Przywróć z planu')} onPress={() => resetDay(day)} /> : null}
      </View>
      {mode === 'move' ? <>
        <Muted style={{ fontSize: 12, marginTop: 8 }}>{t('Na który dzień? Zajęte dni są oznaczone nazwą treningu.')}</Muted>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
          {targets.map(k => { const there = plannedOn(k); return <Chip key={k} label={there ? `${shortDay(k)} · ${tplName(there)}` : shortDay(k)} on={false} a11yLabel={there ? t('{day}, zajęty: {name}', { day: longDay(k), name: tplName(there) }) : longDay(k)} onPress={() => moveTo(k)} />; })}
        </View>
      </> : null}
      {mode === 'pick' ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
        {live.length ? live.map(x => <Chip key={x.id} label={x.name} on={x.id === id} onPress={() => { setDayPlan(day, x.id); setMode('none'); }} />) : <Muted style={{ fontSize: 13 }}>{t('Nie masz jeszcze szablonów.')}</Muted>}
      </View> : null}
    </View>
  );
}
