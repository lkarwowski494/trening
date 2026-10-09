import React, { useState } from 'react';
import { ScrollView, Alert, View } from 'react-native';
import { Screen, Field, NumInput, Input, Btn, Muted, Item, SectionTitle } from '@/components/ui';
import { SwipeRow } from '@/components/SwipeRow';
import { useTick, bodyMassLog, addBodyMass, removeBodyMass, localISODate, fmtDate, localDateTs } from '@/lib/store';
import { BW_SHARE } from '@/lib/stats';
import { t } from '@/lib/i18n';
import { wu, wIn, fmtW } from '@/lib/units';

/*
 * Masa ciała z datą (fala 2 audytu 0.10, decyzja: wdrożyć; E1 wariant B). Pomiary — dzień i masa; e1RM ćwiczeń z masą ciała w każdym treningu liczy się
 * z ostatniego pomiaru z dnia treningu albo wcześniejszego (store.bodyMassOn). Dane tylko w telefonie (kopia zapasowa je obejmuje; CSV — nie).
 * Wejścia: Ustawienia → Masa ciała, Postępy (ćwiczenie z masą ciała) → „Masa ciała — pomiary”.
 */
export default function BodyMassScreen() {
  useTick(); const [kg, setKg] = useState<number | ''>(''); const [date, setDate] = useState(localISODate());
  const log = [...bodyMassLog()].reverse();
  const add = () => {
    const v = wIn(kg); if (v === '') { Alert.alert(t('Masa ciała'), t('Wpisz masę ciała.')); return; }
    const err = addBodyMass(v, date.trim()); if (err) { Alert.alert(t('Masa ciała'), err); return; }
    setKg(''); setDate(localISODate());
  };
  return (
    <Screen><ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets contentContainerStyle={{ paddingVertical: 10, paddingBottom: 60 }}>
      <Muted style={{ fontSize: 13, marginBottom: 12 }}>{t('Opcjonalnie, tylko w telefonie. Z nią aplikacja liczy e1RM w podciąganiu (cała masa ciała — uproszczenie) i w pompkach (ok. {p}% masy ciała — badania z platformą siłową). Każdy trening liczy się z ostatnim pomiarem z tego dnia lub wcześniejszym; treningi sprzed pierwszego pomiaru — bez e1RM w tych ćwiczeniach.', { p: Math.round(BW_SHARE['Push Up'] * 100) })}</Muted>
      <View /* UX2-11: pola jedno pod drugim — na 320 pt i przy dużym tekście etykiety nie konkurują o szerokość */>
        <View><Field label={t('Masa ciała ({u})', { u: wu() })}><NumInput decimal weightTol value={kg} placeholder="—" onNum={v => setKg(v === '' ? '' : Math.max(0, v))} /></Field></View>
        <View><Field label={t('Data pomiaru (RRRR-MM-DD)')}><Input value={date} onChangeText={setDate} placeholder={localISODate()} autoCorrect={false} keyboardType="numbers-and-punctuation" maxLength={10} /></Field></View>
      </View>
      <Btn title={t('Zapisz pomiar')} kind="primary" onPress={add} />
      <Muted style={{ fontSize: 12, marginTop: 6 }}>{t('Pomiar z tym samym dniem zastępuje poprzedni.')}</Muted>
      <SectionTitle>{t('Pomiary')}</SectionTitle>
      {log.length ? log.map(x => { const v = fmtW(x.kg); const d = fmtDate(localDateTs(x.date)); return (
        <SwipeRow key={x.date} label={t('Usuń pomiar: {v}, {d}', { v, d })} title={t('Usunąć pomiar?')} /* UI2-03: usuwanie gestem jak wszędzie (decyzja 07.10) */
          message={t('{v} z {d}. Treningi z tego okresu przeliczą e1RM z wcześniejszego pomiaru (albo bez e1RM, gdy go nie ma).', { v, d })} onDelete={() => removeBodyMass(x.date)}>
          {a11y => <Item a11y={a11y} title={v} sub={d} />}
        </SwipeRow>); })
        : <Muted style={{ fontSize: 13 }}>{t('Brak pomiarów.')}</Muted>}
    </ScrollView></Screen>
  );
}
