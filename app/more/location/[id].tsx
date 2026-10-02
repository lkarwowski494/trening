import React, { useRef } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, Field, Input, Btn, Muted, SwitchRow, SectionTitle, useOnce } from '@/components/ui';
import LoadEditor from '@/components/LoadEditor';
import { getState, useTick, locationById, visibleExercises } from '@/lib/store';
import { setMainLocation, renameLocation, commitLocationName, duplicateLocation, deleteLocation, canDeleteLocation, setEquip, setOpt, equipOf } from '@/lib/locations';
import { EQUIPMENT, EQUIP_GROUPS, EQUIP_GROUP_LABEL, equipLabel, availability, capsOf } from '@/lib/equipment';
import { t } from '@/lib/i18n';

/*
 * P-003 E1: jedno miejsce — nazwa, „Ustaw jako główne”, sprzęt w grupach (przełączniki iOS, jak P-002), opcje pozycji, edytor ciężarów
 * pod pozycjami z ciężarami, „Duplikuj”, „Usuń”. Każda zmiana zapisuje się od razu.
 */
export default function LocationEdit() {
  const { id } = useLocalSearchParams<{ id: string }>(); useTick(); const router = useRouter(); const once = useOnce();
  const l = locationById(typeof id === 'string' ? id : ''); const initialName = useRef(l?.name ?? '');
  if (!l) return <Screen><Muted style={{ marginTop: 16 }}>{t('Nie ma takiego miejsca.')}</Muted></Screen>;
  const s = getState().settings; const main = s.mainLocationId === l.id;
  const back = () => { if (router.canGoBack()) router.back(); else router.replace('/more/locations'); };
  const caps = capsOf(l); const all = visibleExercises(); const ok = all.filter(e => availability(e, l, caps).ok).length;
  return (
    <Screen><ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets contentContainerStyle={{ paddingVertical: 10, paddingBottom: 120 }}>
      <Field label={t('Nazwa')}><Input selectTextOnFocus maxLength={80} value={l.name} onChangeText={v => renameLocation(l, v)} onEndEditing={() => { commitLocationName(l, initialName.current); initialName.current = l.name; }} /></Field>
      {main ? <Muted style={{ marginBottom: 8 }}>{t('★ Miejsce główne — domyślne dla nowych treningów i szablonów bez własnego miejsca.')}</Muted>
        : <Btn title={t('Ustaw jako główne')} small style={{ alignSelf: 'flex-start', marginBottom: 8 }} onPress={() => setMainLocation(l.id)} />}
      <Muted style={{ fontSize: 13 }}>{t('Dostępne ćwiczenia: {n} z {m}', { n: ok, m: all.length })}</Muted>
      {EQUIP_GROUPS.map(g => (
        <View key={g}>
          <SectionTitle>{equipLabel(EQUIP_GROUP_LABEL[g])}</SectionTitle>
          {EQUIPMENT.filter(x => x.group === g).map(x => { const e = equipOf(l, x.id); return (
            <View key={x.id}>
              <SwitchRow label={equipLabel(x)} value={!!e} onChange={v => setEquip(l, x.id, v)} />
              {e && x.options?.length ? <View style={{ marginLeft: 16 }}>{x.options.map(o => <SwitchRow key={o.id} label={equipLabel(o)} value={e.opts.includes(o.id)} onChange={v => setOpt(l, x.id, o.id, v)} />)}</View> : null}
              {e && e.load ? <LoadEditor loc={l} entry={e} item={x} /> : null}
            </View>); })}
        </View>))}
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 20 }}>
        <Btn title={t('Duplikuj')} onPress={once(() => { const c = duplicateLocation(l.id); if (c) router.replace(`/more/location/${c.id}`); })} />
        <Btn title={t('Usuń')} kind="danger" onPress={() => {
          if (!canDeleteLocation(l.id)) { Alert.alert(t('To miejsce główne'), t('Najpierw ustaw inne miejsce jako główne.')); return; }
          const used = getState().workouts.some(w => w.locationId === l.id) || getState().templates.some(x => x.locationId === l.id);
          Alert.alert(t('Usunąć miejsce?'), used ? t('Treningi i szablony z tym miejscem pokażą „(usunięte miejsce)”.') : undefined, [{ text: t('Nie') }, { text: t('Usuń'), style: 'destructive', onPress: () => { if (deleteLocation(l.id)) back(); } }]);
        }} />
      </View>
    </ScrollView></Screen>
  );
}
