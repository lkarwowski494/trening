import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Btn, Chip, Muted, Txt, H2 } from '@/components/ui';
import { getState, startFromTemplate, useTick } from '@/lib/store';
import { plannedOn, isChanged, shiftPlan, moveOnly, swapDays, setDayPlan, resetDay, addDays, dayKeyOf, suggest, applySuggestion, backToBack, RETURN_DAYS, type ShiftResult, type Suggestion } from '@/lib/plan';
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
  const [mode, setMode] = useState<'none' | 'move' | 'pick' | 'suggest'>('none');
  const live = getState().templates.filter(x => !x.archived);
  const start = () => { const tpl = getState().templates.find(x => x.id === id); if (!tpl) return; startFromTemplate(tpl); router.navigate('/'); };
  const pairs = () => new Set(backToBack(day < today ? today : day).map(p => p.a + p.b));
  const shift = () => { const before = pairs(); const r = shiftPlan(day); setMode('none'); if (!r.moved.length) return;
    const fresh = backToBack(day < today ? today : day).filter(p => !before.has(p.a + p.b));
    Alert.alert(t('Plan przesunięty'), [shiftSummary(r), ...fresh.map(p => t('Uwaga: {a} i {b} dzień po dniu — te same główne partie.', { a: shortDay(p.a), b: shortDay(p.b) }))].join('\n')); };
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
        {id ? <Btn small kind="ghost" title={t('Propozycje')} accessibilityHint={t('Ułożenie tygodnia z najmniejszą liczbą zmian, z uwzględnieniem regeneracji partii.')} onPress={() => setMode(mode === 'suggest' ? 'none' : 'suggest')} /> : null}
      </View>
      {mode === 'move' ? <>
        <Muted style={{ fontSize: 12, marginTop: 8 }}>{t('Na który dzień? Zajęte dni są oznaczone nazwą treningu.')}</Muted>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
          {targets.map(k => { const there = plannedOn(k); return <Chip key={k} label={there ? `${shortDay(k)} · ${tplName(there)}` : shortDay(k)} on={false} a11yLabel={there ? t('{day}, zajęty: {name}', { day: longDay(k), name: tplName(there) }) : longDay(k)} onPress={() => moveTo(k)} />; })}
        </View>
      </> : null}
      {mode === 'suggest' && id ? <Suggestions day={day} onDone={() => setMode('none')} /> : null}
      {mode === 'pick' ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
        {live.length ? live.map(x => <Chip key={x.id} label={x.name} on={x.id === id} onPress={() => { setDayPlan(day, x.id); setMode('none'); }} />) : <Muted style={{ fontSize: 13 }}>{t('Nie masz jeszcze szablonów.')}</Muted>}
      </View> : null}
    </View>
  );
}

/** Opis propozycji: co się zmienia, ile dni, ostrzeżenia o parach dzień po dniu (docs/research/23 — uproszczenie, ostrzeżenie zamiast blokady). */
export function suggestionTexts(day: string, sg: Suggestion): { title: string; details: string[] } {
  const title = sg.kind === 'shift' ? t('Przesuń plan od tego dnia') : sg.kind === 'move' ? t('Przenieś na {day}', { day: shortDay(sg.to!) }) : sg.kind === 'swap' ? t('Zamień z {day} ({name})', { day: shortDay(sg.to!), name: tplName(plannedOn(sg.to!)) }) : t('Pomiń ten trening');
  const details = [t('Zmienione dni: {n}', { n: sg.changes })];
  if (sg.dropped) details.push(t('Wypada treningów: {n}', { n: sg.dropped }));
  sg.newBackToBack.forEach(p => details.push(t('Uwaga: {a} i {b} dzień po dniu — te same główne partie.', { a: shortDay(p.a), b: shortDay(p.b) })));
  if (!sg.returns) details.push(t('Zmiany sięgają dalej niż {n} dni.', { n: RETURN_DAYS }));
  return { title, details };
}

function Suggestions({ day, onDone }: { day: string; onDone: () => void }) {
  const list = suggest(day).slice(0, 3);
  return (
    <View testID="suggestions" style={{ marginTop: 8, gap: 8 }}>
      {list.map((sg, i) => { const { title, details } = suggestionTexts(day, sg); return (
        <View key={i} style={{ gap: 2 }}>
          <Txt style={{ fontSize: 14 }}>{title}</Txt>
          {details.map((d, j) => <Muted key={j} style={{ fontSize: 12 }}>{d}</Muted>)}
          <Btn small title={t('Zastosuj')} accessibilityLabel={t('Zastosuj: {title}', { title })} onPress={() => { applySuggestion(sg); onDone(); }} style={{ alignSelf: 'flex-start', marginTop: 2 }} />
        </View>); })}
      <Muted style={{ fontSize: 12 }}>{t('Uproszczenie: zwykle dzień przerwy między sesjami z tymi samymi głównymi partiami; dwa dni pod rząd przy tej samej liczbie serii w tygodniu też są w porządku (przeglądy badań, ACSM). Po zmianach plan wraca do rutyny w ciągu {n} dni.', { n: RETURN_DAYS })}</Muted>
    </View>
  );
}
