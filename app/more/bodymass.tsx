import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { ScrollView } from '@/components/Scroll';
import { Stack } from 'expo-router';
import { Screen, Field, NumInput, Input, Btn, Muted, Item, SectionTitle, Empty } from '@/components/ui';
import { InfoTip } from '@/components/InfoTip';
import { SwipeRow } from '@/components/SwipeRow';
import { EditableRow } from '@/components/EditableRow';
import { useEditHeader } from '@/components/EditHeader';
import { font } from '@/lib/theme';
import { useTick, bodyMassLog, addBodyMass, removeBodyMass, localISODate, fmtDate, localDateTs } from '@/lib/store';
import { BW_SHARE } from '@/lib/stats';
import { t } from '@/lib/i18n';
import { wu, wIn, fmtW } from '@/lib/units';
import { DateField } from '@/components/WhenFields';

/*
 * Masa ciała z datą (fala 2 audytu 0.10, decyzja: wdrożyć; E1 wariant B). Pomiary — dzień i masa; e1RM ćwiczeń z masą ciała w każdym treningu liczy się
 * z ostatniego pomiaru z dnia treningu albo wcześniejszego (store.bodyMassOn). Dane tylko w telefonie (kopia zapasowa je obejmuje; CSV — nie).
 * Wejścia (od 11.10.2026, docs/22 P5 A): zakładka Postępy → sekcja „Masa ciała” → „Masa ciała — pomiary”; Postępy (ćwiczenie z masą ciała) → „Masa ciała — pomiary”.
 */
export default function BodyMassScreen() {
  useTick(); const [kg, setKg] = useState<number | ''>(''); const [date, setDate] = useState(localISODate());
  const log = [...bodyMassLog()].reverse();
  /* M3 ZM-04, W1 b: „Edytuj” w nagłówku → przy pomiarach przycisk usunięcia (to samo okno co gest); pusta lista kończy tryb */
  const [edit, setEdit] = useState(false); const editing = edit && log.length > 0;
  const header = useEditHeader(undefined, editing, () => setEdit(e => !e), log.length > 0);
  const add = () => {
    const v = wIn(kg); if (v === '') { Alert.alert(t('Masa ciała'), t('Wpisz masę ciała.')); return; }
    const err = addBodyMass(v, date.trim()); if (err) { Alert.alert(t('Masa ciała'), err); return; }
    setKg(''); setDate(localISODate());
  };
  return (
    <Screen><Stack.Screen options={header} /><ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets contentContainerStyle={{ paddingVertical: 10, paddingBottom: 60 }}>
      <InfoTip id="bodymass-intro" label={t('Opcjonalnie, tylko w telefonie. Potrzebna do e1RM w podciąganiu i pompkach.')} info={t('Opcjonalnie, tylko w telefonie. Z nią aplikacja liczy e1RM w podciąganiu (cała masa ciała — uproszczenie) i w pompkach (ok. {p}% masy ciała — badania z platformą siłową). Każdy trening liczy się z ostatnim pomiarem z tego dnia lub wcześniejszym; treningi sprzed pierwszego pomiaru — bez e1RM w tych ćwiczeniach.', { p: Math.round(BW_SHARE['Push Up'] * 100) })} style={{ marginBottom: 12 }}>
        <Muted style={font('footnote')}>{t('Opcjonalnie, tylko w telefonie. Potrzebna do e1RM w podciąganiu i pompkach.')}</Muted>
      </InfoTip>
      <View /* UX2-11: pola jedno pod drugim — na 320 pt i przy dużym tekście etykiety nie konkurują o szerokość */>
        <View><Field label={t('Masa ciała ({u})', { u: wu() })}><NumInput testID="bodymass-kg" /* E2E: pole masy po id (UX2-11 — pola jedno pod drugim) */ decimal weightTol value={kg} placeholder="—" onNum={v => setKg(v === '' ? '' : Math.max(0, v))} /></Field></View>
        <View style={{ marginBottom: 12 }}><DateField value={date} onChange={setDate} label={t('Data pomiaru (RRRR-MM-DD)')} placeholder={localISODate()} /></View>
      </View>
      <Btn title={t('Zapisz pomiar')} kind="primary" onPress={add} />
      <Muted style={{ ...font('footnote'), marginTop: 6 }}>{t('Pomiar z tym samym dniem zastępuje poprzedni.')}</Muted>
      <SectionTitle>{t('Pomiary')}</SectionTitle>
      {log.length ? log.map(x => { const v = fmtW(x.kg); const d = fmtDate(localDateTs(x.date)); return (
        <SwipeRow key={x.date} label={t('Usuń pomiar: {v}, {d}', { v, d })} title={t('Usunąć pomiar?')} /* UI2-03: usuwanie gestem jak wszędzie (decyzja 07.10) */
          message={t('{v} z {d}. Treningi z tego okresu przeliczą e1RM z wcześniejszego pomiaru (albo bez e1RM, gdy go nie ma).', { v, d })} onDelete={() => removeBodyMass(x.date)}>
          {a11y => <EditableRow editing={editing} label={t('Usuń pomiar: {v}, {d}', { v, d })} title={t('Usunąć pomiar?')}
            message={t('{v} z {d}. Treningi z tego okresu przeliczą e1RM z wcześniejszego pomiaru (albo bez e1RM, gdy go nie ma).', { v, d })} onDelete={() => removeBodyMass(x.date)}><Item a11y={a11y} title={v} sub={d} /></EditableRow>}
        </SwipeRow>); })
        : <Empty>{t('Brak pomiarów.')}</Empty>}
    </ScrollView></Screen>
  );
}
