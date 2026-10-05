import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Alert, Pressable, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, Field, Input, NumInput, Btn, Muted, SwitchRow, useOnce } from '@/components/ui';
import LoadEditor from '@/components/LoadEditor';
import { getState, useTick, locationById, visibleExercises } from '@/lib/store';
import { setMainLocation, renameLocation, commitLocationName, duplicateLocation, deleteLocation, canDeleteLocation, setEquip, setOpt, activeEquip, setBandLevels } from '@/lib/locations';
import type { Location } from '@/lib/seed';
import { EQUIPMENT, EQUIP_GROUPS, EQUIP_GROUP_LABEL, equipLabel, availability, capsOf } from '@/lib/equipment';
import { t } from '@/lib/i18n';
import { useTheme, F } from '@/lib/theme';

/*
 * P-003 E1: jedno miejsce — nazwa, „Ustaw jako główne”, sprzęt w grupach (przełączniki iOS, jak P-002), opcje pozycji, edytor ciężarów
 * pod pozycjami z ciężarami, „Duplikuj”, „Usuń”. Każda zmiana zapisuje się od razu.
 */
export default function LocationEdit() {
  const { id } = useLocalSearchParams<{ id: string }>(); useTick(); const router = useRouter(); const once = useOnce();
  const l = locationById(typeof id === 'string' ? id : ''); const initialName = useRef(l?.name ?? ''); const th = useTheme();
  /* uwaga właściciela 05.10.2026: „Każdy rodzaj sprzętu powinien móc być zwinięty i rozwinięty” — grupy zwinięte, licznik zaznaczonych */
  const [open, setOpen] = useState<string[]>([]);
  /* audyt (LOW): wyjście z pustą nazwą (bez zakończenia edycji) przywraca poprzednią — nie zapisuje pustej */
  useEffect(() => () => { const x = locationById(typeof id === 'string' ? id : ''); if (x && (!x.name.trim() || x.name !== x.name.replace(/\s+/g, ' ').trim())) commitLocationName(x, initialName.current); }, [id]);
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
      {EQUIP_GROUPS.map(g => { const items = EQUIPMENT.filter(x => x.group === g); const n = items.filter(x => activeEquip(l, x.id)).length; const isOpen = open.includes(g); const name = equipLabel(EQUIP_GROUP_LABEL[g]); return (
        <View key={g}>
          <Pressable accessibilityRole="button" accessibilityLabel={name} accessibilityValue={{ text: t('zaznaczone: {n} z {m}', { n, m: items.length }) }} accessibilityState={{ expanded: isOpen }} onPress={() => setOpen(o => o.includes(g) ? o.filter(x => x !== g) : [...o, g])}
            style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', minHeight: 48, marginTop: 10, borderBottomWidth: 1, borderBottomColor: th.line, opacity: pressed ? 0.6 : 1 })}>
            <Text maxFontSizeMultiplier={1.4} style={{ flex: 1, color: th.text, fontSize: 16, fontFamily: F.semibold }}>{name}</Text>
            <Text maxFontSizeMultiplier={1.4} style={{ color: n ? th.accent : th.muted, fontSize: 14, fontFamily: F.regular, marginRight: 8 }}>{t('{n} z {m}', { n, m: items.length })}</Text>
            <Text accessible={false} style={{ color: th.muted, fontSize: 16 }}>{isOpen ? '▾' : '▸'}</Text>
          </Pressable>
          {isOpen ? items.map(x => { const e = activeEquip(l, x.id); return (
            <View key={x.id}>
              <SwitchRow label={equipLabel(x)} value={!!e} onChange={v => setEquip(l, x.id, v)} />
              {e && x.options?.length ? <View style={{ marginLeft: 16 }}>{x.options.map(o => <SwitchRow key={o.id} label={equipLabel(o)} a11yLabel={`${equipLabel(x)}: ${equipLabel(o)}`} value={e.opts.includes(o.id)} onChange={v => setOpt(l, x.id, o.id, v)} />)}</View> : null}
              {e && x.id === 'bands' ? <BandLevels l={l} levels={e.levels} label={equipLabel(x)} /> : null}
              {e && e.load ? <LoadEditor loc={l} entry={e} item={x} /> : null}
            </View>); }) : null}
        </View>); })}
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

/** Uwaga właściciela 05.10.2026: „Gumy — brak możliwości wybrania zakresu 1–7 w ustawieniach miejsca”. Przy serii przełączają się tylko gumy z zakresu. */
function BandLevels({ l, levels, label }: { l: Location; levels?: [number, number]; label: string }) {
  const [a, b] = levels ?? [1, 7]; const clamp = (v: number | '') => v === '' ? null : Math.min(7, Math.max(1, Math.round(v)));
  return (
    <View style={{ marginLeft: 16, marginBottom: 8 }}>
      <Muted style={{ fontSize: 13, marginTop: 6, marginBottom: 6 }}>{t('Poziomy gum w tym miejscu (1 = cienka, 7 = bardzo gruba).')}</Muted>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-end' }}>
        <View style={{ width: 110 }}><Field label={t('od poziomu')}><NumInput value={a} accessibilityLabel={`${label}: ${t('od poziomu')}`} onNum={v => { const x = clamp(v); if (x != null) setBandLevels(l, x, b); }} /></Field></View>
        <View style={{ width: 110 }}><Field label={t('do poziomu')}><NumInput value={b} accessibilityLabel={`${label}: ${t('do poziomu')}`} onNum={v => { const x = clamp(v); if (x != null) setBandLevels(l, a, x); }} /></Field></View>
      </View>
    </View>
  );
}
